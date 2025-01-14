package app.musimate.service.exceptions

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(
    value = HttpStatus.BAD_REQUEST,
    reason = "On this email there is registered another account"
)
class UserAlreadyRegisteredException: RuntimeException()

@ResponseStatus(
    value = HttpStatus.BAD_REQUEST,
    reason = "Invalid credentials"
)
class InvalidCredentialsException: RuntimeException()

@ResponseStatus(
    value = HttpStatus.BAD_REQUEST,
    reason = "User is not registered"
)
class UnregisteredUserException: RuntimeException()

@ResponseStatus(
    value = HttpStatus.FORBIDDEN,
    reason = "Invalid refresh token"
)
class InvalidRefreshToken: RuntimeException()