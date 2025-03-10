package app.musimate.service.services

import app.musimate.service.dtos.auth.*
import app.musimate.service.exceptions.*
import app.musimate.service.models.User
import app.musimate.service.models.ThirdPartySecrets
import app.musimate.service.repositories.ThirdPartySecretsRepository
import app.musimate.service.repositories.UserRepository
import app.musimate.service.utils.*
import app.musimate.service.utils.User
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.security.crypto.bcrypt.BCrypt
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


@Service
class AuthenticationService(
    private val spotifyService: SpotifyService,
    private val jwtTokenService: JwtTokenService,
    private val userRepository: UserRepository,
    private val user3rdPartySecretsRepository: ThirdPartySecretsRepository,
    private val passwordEncoder: PasswordEncoder
): ServiceBase() {

    val currentAccountInfos: AccountInfosDto
        get() { return AccountInfosDto(authenticatedUser) }

    fun signIn(user: CredentialsDto): AuthenticationData {

        val entity = userRepository.findUserByEmail(user.email)
            ?: throw InvalidUserException()

        if (!BCrypt.checkpw(user.password, entity.hashedPassword)) {
            throw InvalidCredentialsException()
        }

        logger.info("Logged in ${user.email} with success")
        val authTokens = createAuthTokens(entity)
        val spotifyAccessToken = spotifyService.fetchAccessToken(entity)

        return AuthenticationData(
            refreshToken = authTokens.refreshToken,
            accessToken = authTokens.accessToken,
            spotifyAccessToken = spotifyAccessToken,
            accountInfos = AccountInfosDto(entity)
        )
    }

    @Transactional
    fun signUp(user: UserRegisterDto): AuthenticationData {

        try {
            var entity = User(user, passwordEncoder)
            entity = userRepository.save(entity)

            val secrets = ThirdPartySecrets(entity.id, entity)
            user3rdPartySecretsRepository.save(secrets)

            logger.info("Registered successfully ${entity.email} user")
            val authTokens = createAuthTokens(entity)

            return AuthenticationData(
                refreshToken = authTokens.refreshToken,
                accessToken = authTokens.accessToken,
                spotifyAccessToken = null,
                accountInfos = AccountInfosDto(entity)
            )
        } catch (ex: DataIntegrityViolationException) {
            logger.info("Failed to register ${user.email} because the email is probably already used $ex")
            throw UserAlreadyRegisteredException()
        } catch(ex: Exception) {
            logger.error("Failed to register ${user.email} user")
            throw ex
        }
    }

    fun refreshAccessToken(refreshToken: String): AuthToken {

        if (refreshToken.isEmpty()) {
            throw InvalidRefreshToken()
        }

        if (!jwtTokenService.isValidAuthToken(refreshToken, type = AuthTokenType.REFRESH)) {
            throw InvalidRefreshToken()
        }

        val userEmail = jwtTokenService.extractEmail(refreshToken) ?: throw InvalidRefreshToken()

        logger.info("Generating new access token for $userEmail user")
        return jwtTokenService.generateAuthTokenForUser(userEmail, AuthTokenType.ACCESS)
    }

    private fun createAuthTokens(user: User) = AuthTokens(
        accessToken = jwtTokenService.generateAuthTokenForUser(user.email, AuthTokenType.ACCESS).value,
        refreshToken = jwtTokenService.generateAuthTokenForUser(user.email, AuthTokenType.REFRESH).value
    )

    companion object {
        data class AuthTokens(
            val accessToken: String,
            val refreshToken: String
        )

        data class AuthenticationData(
            val refreshToken: String,
            val accessToken: String,
            val spotifyAccessToken: String?,
            val accountInfos: AccountInfosDto
        )
    }
}