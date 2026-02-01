package app.musimate.service.api.dtos.auth

import app.musimate.service.models.User
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotEmpty

data class UserInfoDto(
    @get:NotEmpty @get:Email
    val email: String,

    @get:NotEmpty
    val username: String,

    @get:NotEmpty
    val firstName: String,

    @get:NotEmpty
    val lastName: String
)
