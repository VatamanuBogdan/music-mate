package app.musimate.service.services

import app.musimate.service.utils.*
import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtBuilder
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import io.jsonwebtoken.security.MacAlgorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import javax.crypto.SecretKey
import kotlin.time.Duration
import kotlin.time.Duration.Companion.seconds

enum class JwtAuthTokenType {
    ACCESS, REFRESH
}

@Service
class JwtTokenService {

    @Value("\${auth.token.access-duration-seconds}")
    private var accessTokenDurationSeconds: Double = 0.0

    @Value("\${auth.token.refresh-duration-seconds}")
    private val refreshTokenDurationSeconds: Double = 0.0

    @Value("\${auth.token.state-duration-seconds}")
    private val stateTokenDurationSeconds: Double = 0.0

    @Value("\${auth.token.secret}")
    private lateinit var secret: String

    val accessTokenDuration: Duration
        get() = accessTokenDurationSeconds.seconds

    val refreshTokenDuration: Duration
        get() = refreshTokenDurationSeconds.seconds

    val stateTokenDuration: Duration
        get() = stateTokenDurationSeconds.seconds
    
    fun generateAuthTokenForUser(email: String, type: JwtAuthTokenType): String {

        val tokenTypeClaimValue = getAuthTokenTypeClaimValue(type)
        val tokenDuration = when (type) {
            JwtAuthTokenType.ACCESS -> accessTokenDuration
            JwtAuthTokenType.REFRESH -> refreshTokenDuration
        }

        val value = createExpirableToken(email, tokenDuration)
            .claim(AUTH_TOKEN_TYPE_CLAIM_KEY, tokenTypeClaimValue)
            .signWith(secretKey, SIGNING_ALGORITHM)
            .compact()

        return value
    }
    
    fun generateOAuthStateToken(email: String): String {
        return createExpirableToken(email, stateTokenDuration)
            .claim(OAUTH_STATE_TOKEN_CLAIM_KEY, Utils.generateRandomString(OAUTH_STATE_TOKEN_VALUE_LENGTH))
            .signWith(secretKey, SIGNING_ALGORITHM)
            .compact()
    }

    fun isValidAuthToken(token: String, type: JwtAuthTokenType): Boolean {

        val claims = extractAllClaims(token)

        val typeClaim = claims?.get(AUTH_TOKEN_TYPE_CLAIM_KEY)
        val expirationClaim = claims?.expiration

        if (typeClaim == null || expirationClaim == null) {
            return false
        }

        return getAuthTokenTypeClaimValue(type) == typeClaim
                && expirationClaim.after(Utils.currentDate())
    }

    fun isValidOAuthToken(token: String): Boolean {
        val claims = extractAllClaims(token)
        return claims?.get(OAUTH_STATE_TOKEN_CLAIM_KEY) != null
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
    
    private fun createExpirableToken(email: String, duration: Duration): JwtBuilder {
        return Jwts.builder()
            .subject(email)
            .issuedAt(Utils.currentDate())
            .expiration(Utils.currentDateAfter(duration))
    }

    private fun getAuthTokenTypeClaimValue(type: JwtAuthTokenType) = when(type) {
        JwtAuthTokenType.ACCESS -> ACCESS_TOKEN_CLAIM_VALUE
        JwtAuthTokenType.REFRESH -> REFRESH_TOKEN_CLAIM_VALUE
    }

    private val secretKey: SecretKey by lazy {
        val keyBytes = Decoders.BASE64.decode(secret)
        Keys.hmacShaKeyFor(keyBytes)
    }

    private companion object {
        val SIGNING_ALGORITHM: MacAlgorithm = Jwts.SIG.HS256

        const val AUTH_TOKEN_TYPE_CLAIM_KEY = "type"
        const val ACCESS_TOKEN_CLAIM_VALUE = "access"
        const val REFRESH_TOKEN_CLAIM_VALUE = "refresh"
        const val OAUTH_STATE_TOKEN_CLAIM_KEY = "value"
        const val OAUTH_STATE_TOKEN_VALUE_LENGTH = 16
    }
}