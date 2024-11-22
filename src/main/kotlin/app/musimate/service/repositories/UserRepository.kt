package app.musimate.service.repositories

import app.musimate.service.models.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository: JpaRepository<User, Int> {
    fun findUserByEmail(email: String): User?
    fun existsByEmail(email: String): Boolean
}