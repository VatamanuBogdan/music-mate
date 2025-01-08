package app.musimate.service.controllers

import app.musimate.service.dtos.auth.UserLoginDto
import app.musimate.service.dtos.auth.UserLoginResponseDto
import app.musimate.service.dtos.auth.UserRegisterDto
import app.musimate.service.services.AuthenticationService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth/")
class AuthenticationController(
    private val authService: AuthenticationService
) {

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun login(@Valid @RequestBody body: UserLoginDto): UserLoginResponseDto {

        val token = authService.login(body)
        return UserLoginResponseDto(
            status = HttpStatus.OK,
            message = "Login performed successfully",
            authToken = token
        )
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
}