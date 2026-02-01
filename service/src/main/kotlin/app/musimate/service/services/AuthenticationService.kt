package app.musimate.service.services

import app.musimate.service.api.dtos.auth.UserInfoDto
import app.musimate.service.api.dtos.auth.UserSignInDto
import app.musimate.service.api.dtos.auth.UserSignUpDto
import app.musimate.service.exceptions.*
import app.musimate.service.models.User
import app.musimate.service.models.ThirdPartySecrets
import app.musimate.service.repositories.ThirdPartySecretsRepository
import app.musimate.service.repositories.UserRepository
import app.musimate.service.utils.*
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
    private val thirdPartySecretsRepository: ThirdPartySecretsRepository,
    private val passwordEncoder: PasswordEncoder
): ServiceBase() {

    val currentAccountInfos: UserInfoDto
        get() { return Convertor.toUserInfosDto(authenticatedUser) }

    @Transactional
    fun signIn(user: UserSignInDto): AuthData {

        val entity = userRepository.findUserByEmail(user.email)
            ?: throw InvalidUserException()

        if (!BCrypt.checkpw(user.password, entity.hashedPassword)) {
            throw InvalidCredentialsException()
        }

        logger.info("Logged in ${user.email} with success")
        val authTokens = createAuthTokens(entity)
        val spotifyAccessToken = spotifyService.fetchAccessToken(entity)

        return AuthData(
            refreshToken = authTokens.refreshToken,
            accessToken = authTokens.accessToken,
            spotifyAccessToken = spotifyAccessToken,
            accountInfos = Convertor.toUserInfosDto(entity)
        )
    }

    @Transactional
    fun signUp(user: UserSignUpDto): AuthData {

        try {
            var entity = Convertor.toUser(user, passwordEncoder)
            entity = userRepository.save(entity)

            val secrets = ThirdPartySecrets(entity.id, entity)
            thirdPartySecretsRepository.save(secrets)

            logger.info("Registered successfully ${entity.email} user")
            val authTokens = createAuthTokens(entity)

            return AuthData(
                refreshToken = authTokens.refreshToken,
                accessToken = authTokens.accessToken,
                spotifyAccessToken = null,
                accountInfos = Convertor.toUserInfosDto(entity)
            )
        } catch (ex: DataIntegrityViolationException) {
            logger.info("Failed to register ${user.email} because the email is probably already used $ex")
            throw UserAlreadyRegisteredException()
        } catch(ex: Exception) {
            logger.error("Failed to register ${user.email} user")
            throw ex
        }
    }

    @Transactional
    fun access(refreshToken: String): RefreshedAuthData {
        val email = extractUserEmail(refreshToken)

        val user = userRepository.findUserByEmail(email)
            ?: throw InvalidUserException()
        val accessToken = createAccessToken(user)
        val spotifyAccessToken = spotifyService.fetchAccessToken(user)

        return RefreshedAuthData(
            accessToken = accessToken,
            spotifyAccessToken = spotifyAccessToken,
            accountInfos = Convertor.toUserInfosDto(user)
        )
    }

    fun refreshAccessToken(refreshToken: String): String {
        val email = extractUserEmail(refreshToken)

        logger.info("Generating new access token for $email user")
        return jwtTokenService.generateAuthTokenForUser(email, JwtAuthTokenType.ACCESS)
    }

    private fun extractUserEmail(refreshToken: String): String {
        if (refreshToken.isEmpty()) {
            throw InvalidRefreshToken()
        }

        if (!jwtTokenService.isValidAuthToken(refreshToken, type = JwtAuthTokenType.REFRESH)) {
            throw InvalidRefreshToken()
        }

        return jwtTokenService.extractEmail(refreshToken) ?: throw InvalidRefreshToken()
    }

    private fun createAuthTokens(user: User) = AuthTokens(
        accessToken = createAccessToken(user),
        refreshToken = jwtTokenService.generateAuthTokenForUser(user.email, JwtAuthTokenType.REFRESH)
    )

    private fun createAccessToken(user: User) =
        jwtTokenService.generateAuthTokenForUser(user.email, JwtAuthTokenType.ACCESS)

    data class AuthData(
        val refreshToken: String,
        val accessToken: String,
        val spotifyAccessToken: String?,
        val accountInfos: UserInfoDto
    )

    data class RefreshedAuthData(
        val accessToken: String,
        val spotifyAccessToken: String?,
        val accountInfos: UserInfoDto
    )

    data class AuthTokens(
        val accessToken: String,
        val refreshToken: String
    )
}