package app.musimate.service.dtos.auth

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class AuthenticationDto(
    val token: AuthTokenDto,
    val spotifyAccessToken: String?,
    val infos: AccountInfosDto
)