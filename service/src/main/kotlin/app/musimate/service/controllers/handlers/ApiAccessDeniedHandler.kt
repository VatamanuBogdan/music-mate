package app.musimate.service.controllers.handlers

import app.musimate.service.config.JwtAuthenticationFilter.Companion.EXCEPTION_ATTRIBUTE_NAME
import app.musimate.service.exceptions.ApiException
import app.musimate.service.utils.Convertor
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.MediaType
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.web.access.AccessDeniedHandler
import org.springframework.stereotype.Component

@Component
class ApiAccessDeniedHandler(private val objectMapper: ObjectMapper): AccessDeniedHandler {
    override fun handle(
        request: HttpServletRequest?,
        response: HttpServletResponse?,
        accessDeniedException: AccessDeniedException?
    ) {
        if (response == null) {
            return
        }

        val exception = request?.getAttribute(EXCEPTION_ATTRIBUTE_NAME) as? ApiException
            ?: return
        val errorResponse = Convertor.toApiErrorResponse(exception)

        response.status = HttpServletResponse.SC_FORBIDDEN
        response.contentType = MediaType.APPLICATION_JSON_VALUE
        response.writer.write(objectMapper.writeValueAsString(errorResponse))
    }

}