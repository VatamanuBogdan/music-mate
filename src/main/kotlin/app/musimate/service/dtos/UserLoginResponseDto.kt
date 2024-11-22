package app.musimate.service.dtos

import app.musimate.service.utils.Token
import org.springframework.http.HttpStatus

class UserLoginResponseDto(
    status: HttpStatus,
    message: String,
    var authToken: Token
): ResponseDto(status, message)
