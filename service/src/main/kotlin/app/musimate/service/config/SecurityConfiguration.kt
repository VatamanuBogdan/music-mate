package app.musimate.service.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter


@Configuration
@EnableWebSecurity
class SecurityConfiguration(
    private val authProvider: AuthenticationProvider,
    private val jwtAuthFilter: JwtAuthenticationFilter
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity, securityParameters: SecurityParameters): SecurityFilterChain {

        http
            .cors {
                if (!securityParameters.enableCors) {
                    it.disable()
                }
            }
            .csrf {
                it.disable()
            }
            .authorizeHttpRequests { req ->
                req
                    .requestMatchers(*WHITE_LISTED_PATHS)
                    .permitAll()
                    .anyRequest()
                    .authenticated()
            }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authenticationProvider(authProvider)
            .addFilterBefore(
                jwtAuthFilter,
                UsernamePasswordAuthenticationFilter::class.java
            )

        return http.build()
    }

    @Bean
    @Profile("dev")
    fun securityParametersDev() = SecurityParameters(
        enableCors = true,
        secureHttpCookies = false
    )

    @Bean
    @Profile("prod")
    fun securityParametersProd() = SecurityParameters(
        enableCors = false,
        secureHttpCookies = true
    )

    @Bean
    @Profile("dev")
    fun corsFilter(): CorsFilter {
        val config = CorsConfiguration()
        config.allowCredentials = true
        config.addAllowedOriginPattern("*") // Use "*" to allow all origins
        config.addAllowedHeader("*")
        config.addAllowedMethod("*")

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)

        return CorsFilter(source)
    }

    companion object {
        val WHITE_LISTED_PATHS = arrayOf(
            "/api/auth/signin",
            "/api/auth/signup",
            "/api/auth/refresh",
            "/api/auth/signout",
            "/api/dummy/**"
        )
    }
}