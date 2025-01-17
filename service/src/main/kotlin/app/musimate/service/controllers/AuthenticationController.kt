package app.musimate.service.controllers

import app.musimate.service.config.SecurityParameters
import app.musimate.service.dtos.ApiSuccessResponse
import app.musimate.service.dtos.auth.UserLoginDto
import app.musimate.service.dtos.auth.AuthTokenDto
import app.musimate.service.dtos.auth.UserRegisterDto
import app.musimate.service.services.AuthenticationService
import app.musimate.service.services.JwtTokenService
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth/")
class AuthenticationController(
    private val authService: AuthenticationService,
    private val jwtTokenService: JwtTokenService,
    private val securityParameters: SecurityParameters
) {

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun login(@Valid @RequestBody body: UserLoginDto,
              response: HttpServletResponse
    ): AuthTokenDto {

        val (refreshToken, accessToken) = authService.login(body)

        val refreshTokenCookie = createCookieForRefreshToken(refreshToken.value)
        response.addCookie(refreshTokenCookie)

        return AuthTokenDto(accessToken)
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun register(@Valid @RequestBody body: UserRegisterDto) {
        authService.register(body)
    }

    @PostMapping("/logout")
    fun logout() {
        throw NotImplementedError("The logout endpoint is not implemented")
    }

    @GetMapping("/refresh")
    @ResponseStatus(HttpStatus.CREATED)
    fun refreshAccessToken(
        @CookieValue(name = REFRESH_TOKEN_COOKIE, defaultValue = "") refreshToken: String
    ): AuthTokenDto {

        val token = authService.refreshAccessToken(refreshToken)
        return AuthTokenDto(token)
    }

    private fun createCookieForRefreshToken(token: String): Cookie {

        return Cookie(REFRESH_TOKEN_COOKIE, token).apply {
            isHttpOnly = true
            secure = securityParameters.secureHttpCookies
            path = "/"
            maxAge = jwtTokenService.refreshTokenDuration.inWholeSeconds.toInt()
        }
    }

    private companion object {
        const val REFRESH_TOKEN_COOKIE="refresh-token"
    }
}