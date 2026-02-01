package app.musimate.service.api.dtos.auth

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class AuthenticationTokensDto(
    val accessToken: String? = null,
    val spotifyAccessToken: String? = null
)
