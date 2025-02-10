package app.musimate.service.exceptions

import app.musimate.service.dtos.ApiErrorCode

class InvalidPlaylistIdExceptions: ApiException(
    errorCode = ApiErrorCode.INVALID_ID,
    message = "Invalid playlists id"
)