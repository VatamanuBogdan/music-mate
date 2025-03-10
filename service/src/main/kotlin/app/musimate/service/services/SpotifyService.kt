package app.musimate.service.services

import app.musimate.service.dtos.auth.AuthTokenDto
import app.musimate.service.dtos.auth.SpotifyAuthorizationDto
import app.musimate.service.exceptions.InvalidSpotifyStateToken
import app.musimate.service.exceptions.SpotifyAuthorizationFailed
import app.musimate.service.exceptions.SpotifyInternalError
import app.musimate.service.models.SpotifySecrets
import app.musimate.service.models.ThirdPartySecrets
import app.musimate.service.models.User
import app.musimate.service.repositories.ThirdPartySecretsRepository
import app.musimate.service.utils.AuthTokenType
import app.musimate.service.utils.isExpired
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
    private val jwtTokenService: JwtTokenService,
    private val thirdPartySecretsRepository: ThirdPartySecretsRepository,
): ServiceBase() {

    @Value("\${spotify-api.client_id}")
    private lateinit var _spotifyClientId: String

    @Value("\${spotify-api.client_secret}")
    private lateinit var _spotifyClientSecret: String

    val spotifyClientId: String
        get() = _spotifyClientId
    val spotifyClientSecret: String
        get() = _spotifyClientSecret

    fun createAuthorizationFlowState(user: User): String {
        return jwtTokenService.generateOAuthStateToken(user.email)
    }

    fun createAuthorizationUri(user: User, redirectionUri: String): String {
        val state = createAuthorizationFlowState(user)

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
    fun fetchAccessToken(user: User): String? {
        val secrets = thirdPartySecretsRepository.findSecretsForUser(user)

        if (secrets == null) {
            logger.error("Cannot find secrets for user with ${user.id} id, the secret value" +
                    "should not be null for every user")
            return null
        }

        val spotifySecrets = secrets.spotifySecrets

        if (spotifySecrets?.refreshToken == null) {
            return null
        }

        val accessToken = spotifySecrets.accessToken
        if (accessToken != null && spotifySecrets.accessTokenExpiration?.isExpired() == false) {
            return accessToken
        }

        return try {
            refreshAccessToken(user)
        } catch(ex: Exception) {
            null
        }
    }

    @Transactional
    fun refreshAccessToken(user: User): String {

        val secrets = thirdPartySecretsRepository.findSecretsForUser(user)
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

        return spotifyTokens.accessToken
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

        if (secrets.spotifySecrets == null) {
            secrets.spotifySecrets = SpotifySecrets()
        }

        secrets.spotifySecrets!!.apply {
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