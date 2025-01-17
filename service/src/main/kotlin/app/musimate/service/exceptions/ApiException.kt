package app.musimate.service.exceptions

import app.musimate.service.dtos.ApiErrorCode
import org.springframework.http.HttpStatus

open class ApiException(
    val statusCode: HttpStatus,
    val errorCode: ApiErrorCode,
    override val message: String,
    val details: String? = null
) : RuntimeException(message)