package app.musimate.service.api.dtos.auth

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotEmpty

data class UserSignInDto(
    @get:Email @get:NotEmpty
    var email: String,

    @get:NotEmpty
    var password: String,
)
