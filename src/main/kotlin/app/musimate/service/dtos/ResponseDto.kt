package app.musimate.service.dtos

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

open class ResponseDto(
    val status: HttpStatus,
    val message: String = ""
)

fun ResponseDto.entity(): ResponseEntity<*> = ResponseEntity(this, status)