package app.musimate.service.dtos

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotEmpty

data class UserLoginDto(
    @get:Email @get:NotEmpty
    var email: String,

    @get:NotEmpty
    var password: String,
)
