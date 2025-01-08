package app.musimate.service.services

import app.musimate.service.dtos.auth.UserLoginDto
import app.musimate.service.dtos.auth.UserRegisterDto
import app.musimate.service.exceptions.InvalidCredentialsException
import app.musimate.service.exceptions.UnregisteredUserException
import app.musimate.service.exceptions.UserAlreadyRegisteredException
import app.musimate.service.models.User
import app.musimate.service.repositories.UserRepository
import app.musimate.service.utils.Token
import app.musimate.service.utils.User
import app.musimate.service.utils.UserDetailsAdapter
import org.slf4j.LoggerFactory
import org.springframework.security.access.AuthorizationServiceException
import org.springframework.security.core.context.SecurityContext
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

    fun login(user: UserLoginDto): Token {

        val entity = userRepository.findUserByEmail(user.email)
            ?: throw UnregisteredUserException()

        return if (BCrypt.checkpw(user.password, entity.hashedPassword)) {
            logger.info("Logged in ${user.email} with success")
            jwtTokenService.generateAuthTokenFor(entity)
        } else {
            throw InvalidCredentialsException()
        }
    }

    fun register(user: UserRegisterDto) {

        if (userRepository.existsByEmail(user.email)) {
            logger.info("Failed to register ${user.email} because the email is already used")
            throw UserAlreadyRegisteredException()
        }

        var entity = User(user, passwordEncoder)
        try {
            entity = userRepository.save(entity)
            logger.info("Registered successfully ${entity.email} user")
        } catch(ex: Exception) {
            logger.error("Failed to register ${entity.email} user")
        }
    }
}