package app.musimate.service.exceptions

import app.musimate.service.dtos.ApiErrorCode
import org.springframework.http.HttpStatus

class UserAlreadyRegisteredException : ApiException(
    statusCode = HttpStatus.NOT_ACCEPTABLE,
    errorCode = ApiErrorCode.ALREADY_EXISTS,
    message = "On this email there is already registered another account"
)

class InvalidCredentialsException : ApiException(
    statusCode = HttpStatus.BAD_REQUEST,
    errorCode = ApiErrorCode.INVALID_CREDENTIALS,
    message = "User credential are incorrect"
)

class InvalidUserException : ApiException(
    statusCode = HttpStatus.UNAUTHORIZED,
    errorCode = ApiErrorCode.NOT_REGISTERED,
    message = "User doesn't exist"
)

class InvalidRefreshToken : ApiException(
    statusCode = HttpStatus.UNAUTHORIZED,
    errorCode = ApiErrorCode.INVALID_REFRESH_TOKEN,
    message = "Refresh token is expired or invalid"
)
