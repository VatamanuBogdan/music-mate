package app.musimate.service.controllers.advices

import app.musimate.service.dtos.ApiError
import app.musimate.service.dtos.ApiErrorResponse
import app.musimate.service.dtos.ApiResponse
import app.musimate.service.dtos.ApiSuccessResponse
import org.slf4j.LoggerFactory
import org.springframework.core.MethodParameter
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.http.server.ServletServerHttpResponse
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice

@RestControllerAdvice
class ApiResponseBodyAdvice: ResponseBodyAdvice<Any> {

    private val logger = LoggerFactory.getLogger(this::class.java)

    override fun supports(returnType: MethodParameter, converterType: Class<out HttpMessageConverter<*>>) = true

    override fun beforeBodyWrite(
        body: Any?,
        returnType: MethodParameter,
        selectedContentType: MediaType,
        selectedConverterType: Class<out HttpMessageConverter<*>>,
        request: ServerHttpRequest,
        response: ServerHttpResponse
    ): Any? {

        var statusCode = (response as? ServletServerHttpResponse)?.servletResponse?.status
        if (statusCode == null) {
            logger.error("Received ServerHttpResponse doesn't use Servlet API, " +
                    "thus we cannot extract the status code")
        }

        return when (body) {
            is ApiResponse -> body
            is ApiError -> {
                if (statusCode == null) {
                    statusCode = HttpStatus.BAD_REQUEST.value()
                    response.setStatusCode(HttpStatus.BAD_REQUEST)
                }
                ApiErrorResponse(statusCode = statusCode, error = body)
            }
            else -> {
                if (statusCode == null) {
                    statusCode = HttpStatus.OK.value()
                    response.setStatusCode(HttpStatus.OK)
                }
                ApiSuccessResponse(statusCode = statusCode, data = body)
            }
        }

    }
}