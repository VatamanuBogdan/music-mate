package app.musimate.service.dtos.auth

import com.fasterxml.jackson.annotation.JsonProperty

data class SpotifyAuthorizationDto(
    @JsonProperty("access_token")
    val accessToken: String,
    @JsonProperty("token_type")
    val tokenType: String,
    @JsonProperty("expires_in")
    val durationSeconds: Int,
    @JsonProperty("refresh_token")
    val refreshToken: String?
)
