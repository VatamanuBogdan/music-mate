package app.musimate.service.utils

import app.musimate.service.dtos.UserRegisterDto
import app.musimate.service.models.User
import org.springframework.security.crypto.password.PasswordEncoder
import java.time.LocalDateTime

internal fun User(dto: UserRegisterDto, passwordEncoder: PasswordEncoder) =
    User(
        id = null,
        firstName = dto.firstName,
        secondName = dto.secondName,
        username = "${dto.firstName} ${dto.secondName}",
        hashedPassword = passwordEncoder.encode(dto.password),
        email = dto.email,
        birthDate = dto.birthDate,
        registeredDate = LocalDateTime.now(),
    )