package app.musimate.service.utils

import app.musimate.service.exceptions.UnauthenticatedUser
import app.musimate.service.models.User
import org.springframework.security.core.context.SecurityContextHolder

object AuthenticationContext {
    val user: User
        get() {
            val authentication = SecurityContextHolder.getContext().authentication

            val principal = authentication.principal as? UserDetailsAdapter
                ?: throw UnauthenticatedUser()
            return principal.user
        }
}