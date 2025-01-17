package app.musimate.service.dtos

import com.fasterxml.jackson.annotation.JsonFormat

@JsonFormat
enum class ApiErrorCode {
    NOT_REGISTERED,
    ALREADY_EXISTS,
    INVALID_CREDENTIALS,
    INVALID_REFRESH_TOKEN,
    UNKNOWN
}

data class ApiError(
    val code: ApiErrorCode,
    val message: String,
    val details: String? = null
)