package app.musimate.service.dtos.auth

import app.musimate.service.dtos.ResponseDto
import app.musimate.service.utils.JwtToken
import org.springframework.http.HttpStatus

class AuthAccessTokenDto(
    status: HttpStatus,
    message: String,
    var authToken: JwtToken
): ResponseDto(status, message)
