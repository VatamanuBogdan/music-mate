package app.musimate.service.utils

import app.musimate.service.api.ApiError
import app.musimate.service.api.ApiErrorCode
import app.musimate.service.api.ApiErrorResponse
import app.musimate.service.api.dtos.auth.AuthenticationDto
import app.musimate.service.api.dtos.auth.AuthenticationTokensDto
import app.musimate.service.api.dtos.auth.UserInfoDto
import app.musimate.service.api.dtos.auth.UserSignUpDto
import app.musimate.service.exceptions.ApiException
import app.musimate.service.models.User
import app.musimate.service.services.AuthenticationService
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.security.crypto.password.PasswordEncoder
import java.time.LocalDateTime

object Convertor {

    fun toAuthenticationDto(data: AuthenticationService.AuthData) = AuthenticationDto(
        infos = data.accountInfos,
        tokens = AuthenticationTokensDto(
            accessToken = data.accessToken,
            spotifyAccessToken = data.spotifyAccessToken
        )
    )

    fun toAuthenticationDto(data: AuthenticationService.RefreshedAuthData) = AuthenticationDto(
        infos = data.accountInfos,
        tokens = AuthenticationTokensDto(
            accessToken = data.accessToken,
            spotifyAccessToken = data.spotifyAccessToken
        )
    )

    fun toUserInfosDto(user: User) = UserInfoDto(
        email = user.email,
        username = user.username,
        firstName = user.firstName,
        lastName = user.lastName
    )

    fun toUser(dto: UserSignUpDto, passwordEncoder: PasswordEncoder) = User(
        id = null,
        firstName = dto.firstName,
        lastName = dto.secondName,
        username = "${dto.firstName} ${dto.secondName}",
        hashedPassword = passwordEncoder.encode(dto.password),
        email = dto.email,
        birthDate = dto.birthDate,
        registeredDate = LocalDateTime.now(),
    )

    fun toApiErrorResponse(exception: ApiException?) = ApiErrorResponse(
        statusCode = (exception?.statusCode ?: HttpStatus.BAD_REQUEST).value(),
        error = ApiError(
            code = exception?.errorCode ?: ApiErrorCode.UNKNOWN,
            message = exception?.message ?: "Unknown error",
            details = exception?.details
        )
    )
}