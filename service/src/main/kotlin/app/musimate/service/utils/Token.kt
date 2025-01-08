package app.musimate.service.utils


enum class TokenType {
    JWT
}

data class Token(
    val type: TokenType,
    val value: String
)