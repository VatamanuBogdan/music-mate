package app.musimate.service.dtos.auth

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotEmpty

data class CredentialsDto(
    @get:Email @get:NotEmpty
    var email: String,

    @get:NotEmpty
    var password: String,
)
