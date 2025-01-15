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

    @Value("\${auth.token.access-duration-seconds}")
    private var accessTokenDurationSeconds: Double = 0.0

    @Value("\${auth.token.refresh-duration-seconds}")
    private val refreshTokenDurationSeconds: Double = 0.0

    @Value("\${auth.token.secret}")
    private lateinit var secret: String

    val accessTokenDuration: Duration
        get() = accessTokenDurationSeconds.seconds

    val refreshTokenDuration: Duration
        get() = refreshTokenDurationSeconds.seconds

    fun generateTokenForUser(email: String, type: JwtTokenType): JwtToken {

        val tokenTypeClaimValue = getTokenTypeClaimValue(type)

        val value = Jwts.builder()
            .subject(email)
            .issuedAt(Utils.currentDate())
            .claim(TOKEN_TYPE_CLAIM_KEY, tokenTypeClaimValue)
            .expiration(Utils.currentDateAfter(accessTokenDuration))
            .signWith(secretKey, SIGNING_ALGORITHM)
            .compact()

        return JwtToken(type, value)
    }

    fun isTokenValid(token: JwtToken) = isTokenValid(token.value, token.type)

    fun isTokenValid(token: String, type: JwtTokenType): Boolean {

        val claims = extractAllClaims(token)

        val typeClaim = claims?.get(TOKEN_TYPE_CLAIM_KEY)
        val expirationClaim = claims?.expiration

        if (typeClaim == null || expirationClaim == null) {
            return false
        }

        return getTokenTypeClaimValue(type) == typeClaim
                && expirationClaim.after(Utils.currentDate())
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

    private fun getTokenTypeClaimValue(type: JwtTokenType) = when(type) {
        JwtTokenType.ACCESS -> ACCESS_TOKEN_CLAIM_VALUE
        JwtTokenType.REFRESH -> REFRESH_TOKEN_CLAIM_VALUE
    }

    private val secretKey: SecretKey by lazy {
        val keyBytes = Decoders.BASE64.decode(secret)
        Keys.hmacShaKeyFor(keyBytes)
    }

    private companion object {
        val SIGNING_ALGORITHM: MacAlgorithm = Jwts.SIG.HS256

        const val TOKEN_TYPE_CLAIM_KEY = "type";
        const val ACCESS_TOKEN_CLAIM_VALUE = "access"
        const val REFRESH_TOKEN_CLAIM_VALUE = "refresh"
    }
}