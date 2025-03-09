package app.musimate.service.services

import app.musimate.service.dtos.auth.AuthTokenDto
import app.musimate.service.dtos.auth.SpotifyAuthorizationDto
import app.musimate.service.exceptions.InvalidSpotifyStateToken
import app.musimate.service.exceptions.SpotifyAuthorizationFailed
import app.musimate.service.exceptions.SpotifyInternalError
import app.musimate.service.models.ThirdPartySecrets
import app.musimate.service.repositories.ThirdPartySecretsRepository
import app.musimate.service.utils.AuthToken
import app.musimate.service.utils.AuthTokenType
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*

@Service
class SpotifyService(
    private val thirdPartySecretsRepository: ThirdPartySecretsRepository,
    private val jwtTokenService: JwtTokenService,
    private val authService: AuthenticationService
) {
    @Value("\${spotify-api.client_id}")
    private lateinit var _spotifyClientId: String

    @Value("\${spotify-api.client_secret}")
    private lateinit var _spotifyClientSecret: String

    private val logger = LoggerFactory.getLogger(this::class.java)

    val spotifyClientId: String
        get() = _spotifyClientId
    val spotifyClientSecret: String
        get() = _spotifyClientSecret

    fun createAuthorizationFlowState(): String {
        val user = authService.authenticatedUser
        return jwtTokenService.generateOAuthStateToken(user.email)
    }

    fun createAuthorizationUri(redirectionUri: String): String {
        val state = createAuthorizationFlowState()

        return UriComponentsBuilder.fromHttpUrl(SpotifyApiConstants.AUTHORIZE_URL)
            .queryParam(SpotifyApiConstants.RESPONSE_TYPE_KEY, SpotifyApiConstants.CODE_KEY)
            .queryParam(SpotifyApiConstants.CLIENT_ID_KEY, spotifyClientId)
            .queryParam(SpotifyApiConstants.SCOPE_KEY, SpotifyApiConstants.AUTHORIZATION_SCOPES)
            .queryParam(SpotifyApiConstants.REDIRECT_URI_KEY, redirectionUri)
            .queryParam(SpotifyApiConstants.STATE_KEY, state)
            .toUriString()
    }

    @Transactional
    fun syncAuthorization(state: String, authorizationCode: String?, error: String?, redirectUri: String): AuthTokenDto {
        if (error != null || authorizationCode == null) {
            throw SpotifyAuthorizationFailed()
        }

        if (!jwtTokenService.isValidOAuthToken(state)) {
            throw InvalidSpotifyStateToken()
        }

        val email = jwtTokenService.extractEmail(state)
            ?: throw InvalidSpotifyStateToken()

        val spotifyTokens = fetchAuthTokens(authorizationCode, redirectUri)
            ?: throw SpotifyInternalError()

        if (spotifyTokens.refreshToken == null) {
            throw SpotifyInternalError()
        }

        val secrets = thirdPartySecretsRepository.findSecretsForUser(email)
        if (secrets == null) {
            logger.warn("Spotify refresh token update failed because user secret could not be found")
            throw InvalidSpotifyStateToken()
        }

        updateSpotifySecrets(secrets, spotifyTokens)
        return AuthTokenDto(AuthTokenType.ACCESS, spotifyTokens.accessToken)
    }

    @Transactional
    fun refreshAccessToken(): AuthTokenDto {

        val secrets = thirdPartySecretsRepository.findSecretsForUser(authService.authenticatedUser)
        val refreshToken = secrets?.spotifySecrets?.refreshToken

        if (secrets == null || refreshToken == null) {
            throw RuntimeException()
        }

        val formData = LinkedMultiValueMap<String, String>()
        formData.add(SpotifyApiConstants.REFRESH_TOKEN_KEY, refreshToken)
        formData.add(SpotifyApiConstants.GRANT_TYPE_KEY, SpotifyApiConstants.REFRESH_TOKEN_KEY)

        val httpEntity = HttpEntity(formData, spotifyAuthorizationHeaders)
        val spotifyTokens = RestTemplate().postForEntity(
            SpotifyApiConstants.TOKEN_URL,
            httpEntity,
            SpotifyAuthorizationDto::class.java
        ).body ?: throw SpotifyInternalError()

        updateSpotifySecrets(secrets, spotifyTokens)

        return AuthToken(AuthTokenType.ACCESS, spotifyTokens.accessToken)
    }

    private fun fetchAuthTokens(code: String, redirectUri: String): SpotifyAuthorizationDto? {

        val formData = LinkedMultiValueMap<String, String>()
        formData.add(SpotifyApiConstants.CODE_KEY, code)
        formData.add(SpotifyApiConstants.REDIRECT_URI_KEY, redirectUri)
        formData.add(SpotifyApiConstants.GRANT_TYPE_KEY, SpotifyApiConstants.AUTHORIZATION_CODE_KEY)

        val httpEntity = HttpEntity(formData, spotifyAuthorizationHeaders)

        return RestTemplate().postForEntity(
            SpotifyApiConstants.TOKEN_URL,
            httpEntity,
            SpotifyAuthorizationDto::class.java
        ).body
    }

    private fun updateSpotifySecrets(secrets: ThirdPartySecrets,
                                     authorizationDto: SpotifyAuthorizationDto) {
        val expiration = Instant.now()
            .plusSeconds(authorizationDto.durationSeconds.toLong())
            .let {
                LocalDateTime.ofInstant(it, ZoneId.systemDefault())
            }

        secrets.spotifySecrets.apply {
            accessToken = authorizationDto.accessToken
            accessTokenExpiration = expiration
            if (authorizationDto.refreshToken != null) {
                refreshToken = authorizationDto.refreshToken
            }
        }
    }

    private val spotifyAuthorizationHeaders: HttpHeaders
        get() {
            val encodedCredentials = Base64.getEncoder()
                .encodeToString("$spotifyClientId:$spotifyClientSecret".toByteArray())

            val headers = HttpHeaders()
            headers.contentType = MediaType.APPLICATION_FORM_URLENCODED
            headers.setBasicAuth(encodedCredentials)

            return headers
        }
}

private object SpotifyApiConstants {
    const val AUTHORIZE_URL = "https://accounts.spotify.com/authorize"
    const val TOKEN_URL = "https://accounts.spotify.com/api/token"

    const val AUTHORIZATION_CODE_KEY = "authorization_code"
    const val CODE_KEY = "code"
    const val RESPONSE_TYPE_KEY = "response_type"
    const val CLIENT_ID_KEY = "client_id"
    const val SCOPE_KEY = "scope"
    const val REDIRECT_URI_KEY = "redirect_uri"
    const val REFRESH_TOKEN_KEY = "refresh_token"
    const val STATE_KEY = "state"
    const val GRANT_TYPE_KEY = "grant_type"

    const val AUTHORIZATION_SCOPES = "user-read-private user-read-email"
}