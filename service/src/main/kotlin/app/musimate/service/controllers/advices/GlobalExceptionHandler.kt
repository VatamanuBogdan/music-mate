package app.musimate.service.controllers.advices

import app.musimate.service.dtos.ApiError
import app.musimate.service.dtos.ApiErrorCode
import app.musimate.service.dtos.ApiErrorResponse
import app.musimate.service.exceptions.*
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.View

@RestControllerAdvice
class GlobalExceptionHandler(private val error: View) {
    @ExceptionHandler(Exception::class)
    fun handleOtherExceptions(ex: Exception): ResponseEntity<ApiErrorResponse> {

        val statusCode: HttpStatus
        val error: ApiError

        when (ex) {
            is ApiException -> {
                statusCode = ex.statusCode
                error = ApiError(ex.errorCode, ex.message, ex.details)
            }
            else -> {
                statusCode = HttpStatus.BAD_REQUEST
                error = ApiError(ApiErrorCode.UNKNOWN, "Unknown error")
            }
        }

        return ResponseEntity(
            ApiErrorResponse(statusCode = statusCode.value(), error = error),
            statusCode
        )
    }
}