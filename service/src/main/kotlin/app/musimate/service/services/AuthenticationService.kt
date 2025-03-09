package app.musimate.service.services

import app.musimate.service.dtos.auth.*
import app.musimate.service.exceptions.*
import app.musimate.service.models.User
import app.musimate.service.models.ThirdPartySecrets
import app.musimate.service.repositories.ThirdPartySecretsRepository
import app.musimate.service.repositories.UserRepository
import app.musimate.service.utils.AuthToken
import app.musimate.service.utils.AuthTokenType
import app.musimate.service.utils.User
import app.musimate.service.utils.UserDetailsAdapter
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.bcrypt.BCrypt
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


@Service
class AuthenticationService(
    private val userRepository: UserRepository,
    private val user3rdPartySecretsRepository: ThirdPartySecretsRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenService: JwtTokenService,
) {

    private val logger = LoggerFactory.getLogger(this::class.java)

    val authenticatedUser: User
        get() {
            val authentication = SecurityContextHolder.getContext().authentication

            val principal = authentication.principal as? UserDetailsAdapter
                ?: throw UnauthenticatedUser()
            return principal.user
        }

    val currentAccountInfos: AccountInfosDto
        get() { return AccountInfosDto(authenticatedUser) }

    fun signIn(user: CredentialsDto): Pair<AuthToken, AuthenticationDto> {

        val entity = userRepository.findUserByEmail(user.email)
            ?: throw InvalidUserException()

        if (BCrypt.checkpw(user.password, entity.hashedPassword)) {
            logger.info("Logged in ${user.email} with success")
            return generateAuthenticationData(entity);
        } else {
            throw InvalidCredentialsException()
        }
    }

    @Transactional
    fun signUp(user: UserRegisterDto): Pair<AuthToken, AuthenticationDto> {

        try {
            var entity = User(user, passwordEncoder)
            val secrets = ThirdPartySecrets(entity.id, entity)

            entity = userRepository.save(entity)
            user3rdPartySecretsRepository.save(secrets)

            logger.info("Registered successfully ${entity.email} user")
            return generateAuthenticationData(entity)
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

    private fun generateAuthenticationData(user: User): Pair<AuthToken, AuthenticationDto> {
        val refreshToken = jwtTokenService.generateAuthTokenForUser(user.email, AuthTokenType.REFRESH)
        val accessToken = jwtTokenService.generateAuthTokenForUser(user.email, AuthTokenType.ACCESS)

        val authenticationDto = AuthenticationDto(
            infos = AccountInfosDto(user),
            token = accessToken
        )

        return Pair(refreshToken, authenticationDto)
    }
}