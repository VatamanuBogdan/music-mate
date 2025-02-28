package app.musimate.service.services

import app.musimate.service.dtos.auth.AccountInfosDto
import app.musimate.service.dtos.auth.AuthenticationDto
import app.musimate.service.dtos.auth.CredentialsDto
import app.musimate.service.dtos.auth.UserRegisterDto
import app.musimate.service.exceptions.InvalidCredentialsException
import app.musimate.service.exceptions.InvalidRefreshToken
import app.musimate.service.exceptions.InvalidUserException
import app.musimate.service.exceptions.UserAlreadyRegisteredException
import app.musimate.service.models.User
import app.musimate.service.repositories.UserRepository
import app.musimate.service.utils.JwtToken
import app.musimate.service.utils.JwtTokenType
import app.musimate.service.utils.User
import app.musimate.service.utils.UserDetailsAdapter
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.bcrypt.BCrypt
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service


@Service
class AuthenticationService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenService: JwtTokenService
) {

    private val logger = LoggerFactory.getLogger(this::class.java)

    val authenticatedUser: User
        get() {
            val authentication = SecurityContextHolder.getContext().authentication

            val principal = authentication.principal as? UserDetailsAdapter
                ?: throw RuntimeException("Unauthenticated user")
            return principal.user
        }

    val currentAccountInfos: AccountInfosDto
        get() { return AccountInfosDto(authenticatedUser) }

    fun signIn(user: CredentialsDto): Pair<JwtToken, AuthenticationDto> {

        val entity = userRepository.findUserByEmail(user.email)
            ?: throw InvalidUserException()

        if (BCrypt.checkpw(user.password, entity.hashedPassword)) {
            logger.info("Logged in ${user.email} with success")
            return generateAuthenticationData(entity);
        } else {
            throw InvalidCredentialsException()
        }
    }

    fun signUp(user: UserRegisterDto): Pair<JwtToken, AuthenticationDto> {

        if (userRepository.existsByEmail(user.email)) {
            logger.info("Failed to register ${user.email} because the email is already used")
            throw UserAlreadyRegisteredException()
        }

        var entity = User(user, passwordEncoder)
        try {
            entity = userRepository.save(entity)
            logger.info("Registered successfully ${entity.email} user")
            return generateAuthenticationData(entity)
        } catch(ex: Exception) {
            logger.error("Failed to register ${entity.email} user")
            throw ex
        }
    }

    fun refreshAccessToken(refreshToken: String): JwtToken {

        if (refreshToken.isEmpty()) {
            throw InvalidRefreshToken()
        }

        if (!jwtTokenService.isTokenValid(refreshToken, type = JwtTokenType.REFRESH)) {
            throw InvalidRefreshToken()
        }

        val userEmail = jwtTokenService.extractEmail(refreshToken) ?: throw InvalidRefreshToken()

        logger.info("Generating new access token for $userEmail user")
        return jwtTokenService.generateTokenForUser(userEmail, JwtTokenType.ACCESS)
    }

    private fun generateAuthenticationData(user: User): Pair<JwtToken, AuthenticationDto> {
        val refreshToken = jwtTokenService.generateTokenForUser(user.email, JwtTokenType.REFRESH)
        val accessToken = jwtTokenService.generateTokenForUser(user.email, JwtTokenType.ACCESS)

        val authenticationDto = AuthenticationDto(
            infos = AccountInfosDto(user),
            token = accessToken
        )

        return Pair(refreshToken, authenticationDto)
    }
}