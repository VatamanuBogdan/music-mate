package app.musimate.service.utils

enum class AuthTokenType {
    ACCESS, REFRESH
}

data class AuthToken(
    val type: AuthTokenType,
    val value: String
)
