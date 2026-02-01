package app.musimate.service.api.dtos.auth

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class AuthenticationDto(
    val infos: UserInfoDto,
    val tokens: AuthenticationTokensDto,
)