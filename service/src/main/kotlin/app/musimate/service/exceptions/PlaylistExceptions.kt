package app.musimate.service.exceptions

import app.musimate.service.dtos.ApiErrorCode
import org.springframework.http.HttpStatus

class InvalidPlaylistIdException: ApiException(
    errorCode = ApiErrorCode.INVALID_ID,
    message = "Invalid playlists id"
)

class InvalidTrackIdException: ApiException(
    errorCode = ApiErrorCode.INVALID_ID,
    message = "Invalid track id"
)

class SpotifyOperationNotImplementedException: ApiException(
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode = ApiErrorCode.NOT_IMPLEMENTED,
    message = "Spotify operations were not implemented"
)