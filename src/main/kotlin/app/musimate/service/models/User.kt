package app.musimate.service.models

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class User(
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Int?,

    @Column(name = "first_name", nullable = false)
    var firstName: String,

    @Column(name = "second_name", nullable = false)
    var secondName: String,

    @Column(nullable = false)
    var username: String,

    @Column(name = "hashed_password", nullable = false)
    var hashedPassword: String,

    @Column(unique = true, nullable = false)
    var email: String,

    @Column(name = "birth_date", nullable = false)
    var birthDate: LocalDate,

    @Column(name = "registered_date", nullable = false)
    var registeredDate: LocalDateTime,
)
