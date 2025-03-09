package app.musimate.service.controllers

import app.musimate.service.config.SecurityParameters
import app.musimate.service.dtos.ApiSuccessResponse
import app.musimate.service.dtos.auth.*
import app.musimate.service.services.AuthenticationService
import app.musimate.service.services.JwtTokenService
import app.musimate.service.services.SpotifyService
import app.musimate.service.utils.AuthToken
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

    @PostMapping("/signin")
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun signIn(@Valid @RequestBody body: CredentialsDto,
               response: HttpServletResponse
    ): AuthenticationDto {
        val (refreshToken, authentication) = authService.signIn(body)

        val refreshTokenCookie = createCookieForRefreshToken(refreshToken.value)
        response.addCookie(refreshTokenCookie)

        return authentication
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    fun signUp(@Valid @RequestBody body: UserRegisterDto,
               response: HttpServletResponse): AuthenticationDto {
        val (refreshToken, authentication) = authService.signUp(body)

        val refreshTokenCookie = createCookieForRefreshToken(refreshToken.value)
        response.addCookie(refreshTokenCookie)

        return authentication;
    }

    @PostMapping("/signout")
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun signOut(response: HttpServletResponse): ApiSuccessResponse {

        val refreshTokenRemovalCookie = createCookieForRefreshTokenRemoval()
        response.addCookie(refreshTokenRemovalCookie)
        return ApiSuccessResponse(HttpStatus.ACCEPTED.value())
    }

    @GetMapping("/refresh")
    @ResponseStatus(HttpStatus.CREATED)
    fun refreshAccessToken(
        @CookieValue(name = REFRESH_TOKEN_COOKIE, defaultValue = "") refreshToken: String
    ): AuthTokenDto {

        return authService.refreshAccessToken(refreshToken)
    }

    @GetMapping("/account")
    @ResponseStatus(HttpStatus.OK)
    fun fetchAccountInfos(): AccountInfosDto {

        return authService.currentAccountInfos
    }

    @GetMapping("/spotify")
    fun authorizeSpotify(response: HttpServletResponse) {

        response.sendRedirect(spotifyService.createAuthorizationUri(SPOTIFY_REDIRECT_URL))
    }

    @GetMapping("/spotify/callback")
    fun spotifyAuthorizeCallback(
        @RequestParam("state") state: String,
        @RequestParam("code", required = false) code: String?,
        @RequestParam("error", required = false) error: String?,
    ): AuthTokenDto {
        return spotifyService.syncAuthorization(state, code, error, SPOTIFY_REDIRECT_URL)
    }

    @GetMapping("/spotify/refresh")
    fun refreshSpotifyAccessToken(): AuthToken {
        return spotifyService.refreshAccessToken()
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