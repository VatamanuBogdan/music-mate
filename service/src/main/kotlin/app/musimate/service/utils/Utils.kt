package app.musimate.service.utils

import app.musimate.service.dtos.PaginationQuery
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.Direction
import java.security.SecureRandom
import java.time.LocalDateTime
import java.util.*
import kotlin.time.Duration

object Utils

data class ImageSize(val width: Int, val height: Int)

fun Utils.currentDate() = Date(System.currentTimeMillis())

fun Utils.currentDateAfter(duration: Duration): Date {
    return Date(System.currentTimeMillis() + duration.inWholeMilliseconds)
}

fun Utils.extractValuePrefixedByFromHttpHeader(
    prefix: String,
    header: String
): String? {
    var startIndex = header.indexOf(prefix)

    if (startIndex == -1) {
        return null
    }
    startIndex += prefix.length

    var endIndex = header.indexOf(',', startIndex)
    if (endIndex < 0) {
        endIndex = header.length
    }

    return header.subSequence(
        startIndex = startIndex,
        endIndex = endIndex
    ).trim().toString()
}

fun Utils.toPageable(pageQuery: PaginationQuery,
                     sortPropriety: String,
                     sortDirection: Direction): Pageable {
    return PageRequest.of(
        pageQuery.page,
        pageQuery.size,
        Sort.by(sortDirection, sortPropriety)
    )
}

private const val RANDOM_CHARS_SOURCE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
private val SECURE_RANDOM: SecureRandom = SecureRandom()

fun Utils.generateRandomString(length: Int): String {
    return StringBuilder(length).apply {
        repeat(length) {
            val randomIndex = SECURE_RANDOM.nextInt(RANDOM_CHARS_SOURCE.length)
            append(RANDOM_CHARS_SOURCE[randomIndex])
        }
    }.toString()
}

fun Utils.toPageable(pageQuery: PaginationQuery): Pageable {
    return PageRequest.of(pageQuery.page, pageQuery.size)
}

fun LocalDateTime.isExpired(): Boolean {
    return this.isBefore(LocalDateTime.now())
}