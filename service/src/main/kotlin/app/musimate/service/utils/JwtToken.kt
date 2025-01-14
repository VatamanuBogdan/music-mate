package app.musimate.service.utils


enum class JwtTokenType {
    ACCESS, REFRESH
}

data class JwtToken(
    val type: JwtTokenType,
    val value: String
)