package app.musimate.service.controllers.handlers

import app.musimate.service.api.ApiErrorResponse
import app.musimate.service.exceptions.*
import app.musimate.service.utils.Convertor
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.View

@RestControllerAdvice
class GlobalExceptionHandler(private val error: View) {
    @ExceptionHandler(Exception::class)
    fun handleOtherExceptions(ex: Exception): ResponseEntity<ApiErrorResponse> {
        val response = Convertor.toApiErrorResponse(ex as? ApiException)

        return ResponseEntity(response, null, response.statusCode)
    }
}