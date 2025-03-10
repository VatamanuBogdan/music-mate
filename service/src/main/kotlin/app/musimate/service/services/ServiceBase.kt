package app.musimate.service.services

import app.musimate.service.exceptions.UnauthenticatedUser
import app.musimate.service.models.User
import app.musimate.service.utils.AuthenticationContext
import app.musimate.service.utils.UserDetailsAdapter
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder

abstract class ServiceBase {
    protected val logger = LoggerFactory.getLogger(this::class.java)

    protected val authenticatedUser: User
        get() = AuthenticationContext.user
}