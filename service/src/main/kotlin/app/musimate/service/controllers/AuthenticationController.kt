package app.musimate.service.controllers

import app.musimate.service.config.SecurityParameters
import app.musimate.service.api.ApiSuccessResponse
import app.musimate.service.api.dtos.auth.*
import app.musimate.service.services.AuthenticationService
import app.musimate.service.services.JwtTokenService
import app.musimate.service.services.SpotifyService
import app.musimate.service.utils.AuthenticationContext
import app.musimate.service.utils.Convertor
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth/")
class AuthenticationController(
    private val authService: AuthenticationService,
    private val spotifyService: SpotifyService,
    private val jwtTokenService: JwtTokenService,
    private val securityParameters: SecurityParameters
) {

    @PostMapping("/sign-in")
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun signIn(@Valid @RequestBody body: UserSignInDto,
               response: HttpServletResponse
    ): AuthenticationDto {
        val authenticationData = authService.signIn(body)
        setupRefreshTokenCookie(response, authenticationData.refreshToken)

        return Convertor.toAuthenticationDto(authenticationData)
    }

    @PostMapping("/sign-up")
    @ResponseStatus(HttpStatus.CREATED)
    fun signUp(@Valid @RequestBody body: UserSignUpDto,
               response: HttpServletResponse
    ): AuthenticationDto {
        val authenticationData = authService.signUp(body)
        setupRefreshTokenCookie(response, authenticationData.refreshToken)

        return Convertor.toAuthenticationDto(authenticationData)
    }

    @PostMapping("/sign-out")
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun signOut(response: HttpServletResponse): ApiSuccessResponse {
        val refreshTokenRemovalCookie = createCookieForRefreshTokenRemoval()
        response.addCookie(refreshTokenRemovalCookie)

        return ApiSuccessResponse(HttpStatus.ACCEPTED.value())
    }

    @GetMapping("/access")
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun access(@CookieValue(name = REFRESH_TOKEN_COOKIE, defaultValue = "") refreshToken: String
    ): AuthenticationDto {
        val authenticationData = authService.access(refreshToken)

        return Convertor.toAuthenticationDto(authenticationData)
    }

    @GetMapping("/refresh")
    @ResponseStatus(HttpStatus.CREATED)
    fun refreshAccessToken(
        @CookieValue(name = REFRESH_TOKEN_COOKIE, defaultValue = "") refreshToken: String
    ): AuthenticationTokensDto {

        return AuthenticationTokensDto(accessToken = authService.refreshAccessToken(refreshToken))
    }

    @GetMapping("/account")
    @ResponseStatus(HttpStatus.OK)
    fun fetchAccountInfos(): UserInfoDto {

        return authService.currentAccountInfos
    }

    @GetMapping("/spotify")
    fun authorizeSpotify(response: HttpServletResponse) {

        val authorizationUri = spotifyService.createAuthorizationUri(
            AuthenticationContext.user,
            SPOTIFY_REDIRECT_URL
        )
        response.sendRedirect(authorizationUri)
    }

    @GetMapping("/spotify/callback")
    fun spotifyAuthorizeCallback(
        @RequestParam("state") state: String,
        @RequestParam("code", required = false) code: String?,
        @RequestParam("error", required = false) error: String?,
    ): String {
        return spotifyService.syncAuthorization(state, code, error, SPOTIFY_REDIRECT_URL)
    }

    @GetMapping("/spotify/access")
    fun fetchSpotifyAccessToken(): AuthenticationTokensDto? {
        val accessToken = spotifyService.fetchAccessToken(AuthenticationContext.user)
            ?: return null

        return AuthenticationTokensDto(spotifyAccessToken = accessToken)
    }

    private fun setupRefreshTokenCookie(response: HttpServletResponse, refreshToken: String) {

        val refreshTokenCookie = createCookieForRefreshToken(refreshToken)
        response.addCookie(refreshTokenCookie)
    }

    private fun createCookieForRefreshToken(token: String): Cookie {

        return Cookie(REFRESH_TOKEN_COOKIE, token).apply {
            isHttpOnly = true
            secure = securityParameters.secureHttpCookies
            path = "/"
            maxAge = jwtTokenService.refreshTokenDuration.inWholeSeconds.toInt()
        }
    }

    private fun createCookieForRefreshTokenRemoval(): Cookie {

        return Cookie(REFRESH_TOKEN_COOKIE, null).apply {
            isHttpOnly = true
            secure = securityParameters.secureHttpCookies
            path = "/"
            maxAge = 0
        }
    }

    private companion object {
        const val REFRESH_TOKEN_COOKIE = "refresh-token"
        const val SPOTIFY_REDIRECT_URL = "http://localhost:8080/api/auth/spotify/callback"
    }
}