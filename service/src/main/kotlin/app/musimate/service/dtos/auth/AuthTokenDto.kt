package app.musimate.service.dtos.auth

import app.musimate.service.utils.JwtToken
import com.fasterxml.jackson.annotation.JsonValue

class AuthTokenDto(@JsonValue val token: JwtToken)
