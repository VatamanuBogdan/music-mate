package app.musimate.service.services

import app.musimate.service.models.User
import app.musimate.service.utils.*
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import io.jsonwebtoken.security.MacAlgorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import javax.crypto.SecretKey
import kotlin.time.Duration
import kotlin.time.Duration.Companion.seconds

@Service
class JwtTokenService {

    @Value("\${auth.jwt.duration}")
    private var tokenDurationSeconds: Double = 0.0

    @Value("\${auth.jwt.secret}")
    private lateinit var secret: String

    private val tokenDuration: Duration
        get() = tokenDurationSeconds.seconds

    fun generateAuthTokenFor(user: User): Token {

        val value = Jwts.builder()
            .subject(user.email)
            .issuedAt(Utils.currentDate())
            .expiration(Utils.currentDateAfter(tokenDuration))
            .signWith(secretKey, SIGNING_ALGORITHM)
            .compact()

        return Token(TokenType.JWT, value)
    }

    fun isAuthTokenValid(token: Token) = isAuthTokenValid(token.value)

    fun isAuthTokenValid(token: String): Boolean {

        try {
            val expiration = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                ?.payload?.expiration

            return expiration != null && expiration.after(Utils.currentDate())
        } catch(ex: Exception) {
            return false
        }
    }

    fun extractEmail(token: String): String? {

        return extractAllClaims(token)?.subject
    }

    fun extractClaimValue(token: String, claim: String): String? {

        return extractAllClaims(token)?.get(claim, String::class.java)
    }

    private fun extractAllClaims(token: String): Claims? {

        return try {
            Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .payload
        } catch (ex: Exception) {
            null
        }
    }

    private val secretKey: SecretKey by lazy {
        val keyBytes = Decoders.BASE64.decode(secret)
        Keys.hmacShaKeyFor(keyBytes)
    }

    private companion object {
        val SIGNING_ALGORITHM: MacAlgorithm = Jwts.SIG.HS256
    }
}