package app.musimate.service.dtos

import com.fasterxml.jackson.annotation.JsonFormat

@JsonFormat
enum class ApiErrorCode {
    NOT_REGISTERED,
    NOT_IMPLEMENTED,
    ALREADY_EXISTS,
    UNAUTHENTICATED,
    INVALID_CREDENTIALS,
    INVALID_TOKEN,
    INVALID_REFRESH_TOKEN,
    INVALID_ID,
    UNKNOWN
}

data class ApiError(
    val code: ApiErrorCode,
    val message: String,
    val details: String? = null
)