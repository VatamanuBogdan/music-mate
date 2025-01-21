package app.musimate.service.dtos.auth

data class AuthenticationDto(
    val token: AuthTokenDto,
    val infos: AccountInfosDto
)