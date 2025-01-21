package app.musimate.service.dtos.auth

import app.musimate.service.models.User
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotEmpty

data class AccountInfosDto(
    @get:NotEmpty @get:Email
    val email: String,

    @get:NotEmpty
    val username: String,

    @get:NotEmpty
    val firstName: String,

    @get:NotEmpty
    val lastName: String
)

fun AccountInfosDto(user: User) = AccountInfosDto(
    email = user.email,
    username = user.username,
    firstName = user.firstName,
    lastName = user.lastName
)
