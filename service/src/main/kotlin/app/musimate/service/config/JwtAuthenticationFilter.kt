package app.musimate.service.config

import app.musimate.service.services.JwtTokenService
import app.musimate.service.utils.Constants
import app.musimate.service.utils.Utils
import app.musimate.service.utils.extractValuePrefixedByFromHttpHeader
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtTokenService: JwtTokenService,
    private val userDetailsService: UserDetailsService
): OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {

        val jwtToken = extractJwtTokenFrom(request)
        if (jwtToken == null || !jwtTokenService.isAuthTokenValid(jwtToken)) {
            return filterChain.doFilter(request, response)
        }

        val email = jwtTokenService.extractEmail(jwtToken)
            ?: return filterChain.doFilter(request, response)

        val userDetails = userDetailsService.loadUserByUsername(email)
            ?: return filterChain.doFilter(request, response)

        val authentication = UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            userDetails.authorities
        )

        authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
        SecurityContextHolder.getContext().authentication = authentication

        filterChain.doFilter(request, response)
    }

    private fun extractJwtTokenFrom(request: HttpServletRequest): String? {

        val authHeader = request.getHeader(HttpHeaders.AUTHORIZATION)
            ?: return null

        return Utils.extractValuePrefixedByFromHttpHeader(
            Constants.BEARER_AUTH_PREFIX,
            authHeader
        )
    }
}