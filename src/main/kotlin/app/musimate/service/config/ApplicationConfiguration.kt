package app.musimate.service.config

import app.musimate.service.repositories.UserRepository
import app.musimate.service.utils.UserDetailsAdapter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class ApplicationConfiguration(
    private val userRepository: UserRepository
) {
    @Bean
    fun userDetailsService() = UserDetailsService { username ->
        userRepository.findUserByEmail(username)?.let {
            UserDetailsAdapter(it)
        } ?: throw UsernameNotFoundException("User with $username not found")
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager {

        return config.authenticationManager
    }

    @Bean
    fun authenticationProvider(): AuthenticationProvider {

        return DaoAuthenticationProvider().apply {
            setUserDetailsService(userDetailsService())
            setPasswordEncoder(passwordEncoder())
        }
    }
}