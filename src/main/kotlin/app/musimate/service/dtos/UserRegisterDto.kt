package app.musimate.service.dtos

import com.fasterxml.jackson.annotation.JsonFormat
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Past
import java.time.LocalDate

data class UserRegisterDto(
    @get:NotEmpty
    var firstName: String,

    @get:NotEmpty
    var secondName: String,

    @get:NotEmpty
    var password: String,

    @get:Email @get:NotEmpty
    var email: String,

    @get:Past
    @JsonFormat(pattern = "yyyy-MM-dd")
    var birthDate: LocalDate
)
