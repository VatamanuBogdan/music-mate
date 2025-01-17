package app.musimate.service.dtos

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonValue

@JsonFormat
enum class ApiStatus(@JsonValue val raw: String) {
    SUCCESS("success"),
    ERROR("error")
}

sealed class ApiResponse(
    val status: ApiStatus,
    val statusCode: Int
)

@JsonInclude(JsonInclude.Include.NON_NULL)
class ApiSuccessResponse (
    statusCode: Int,
    val data: Any? = null,
) : ApiResponse(ApiStatus.SUCCESS, statusCode)

@JsonInclude(JsonInclude.Include.NON_NULL)
class ApiErrorResponse(
    statusCode: Int,
    val error: ApiError
) : ApiResponse(ApiStatus.ERROR, statusCode)
