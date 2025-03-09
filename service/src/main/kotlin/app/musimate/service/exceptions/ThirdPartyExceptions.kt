package app.musimate.service.exceptions

import app.musimate.service.dtos.ApiErrorCode
import org.springframework.http.HttpStatus

class SpotifyAuthorizationFailed: ApiException(
    statusCode = HttpStatus.BAD_REQUEST,
    errorCode = ApiErrorCode.UNAUTHENTICATED,
    message = "Spotify authorization failed"
)

class SpotifyInternalError: ApiException(
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode = ApiErrorCode.UNKNOWN,
    message = "There was a problem accessing internal spotify service"
)

class InvalidSpotifyStateToken: ApiException(
    statusCode = HttpStatus.BAD_REQUEST,
    errorCode = ApiErrorCode.INVALID_TOKEN,
    message = "There was a problem using the current state"
)