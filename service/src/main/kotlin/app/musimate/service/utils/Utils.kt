package app.musimate.service.utils

import app.musimate.service.api.PaginationQuery
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.Direction
import java.security.SecureRandom
import java.time.LocalDateTime
import java.util.*
import kotlin.time.Duration

object Utils {

    fun currentDate() = Date(System.currentTimeMillis())

    fun currentDateAfter(duration: Duration): Date {
        return Date(System.currentTimeMillis() + duration.inWholeMilliseconds)
    }

    fun extractValuePrefixedByFromHttpHeader(
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

    fun toPageable(
        pageQuery: PaginationQuery,
        sortPropriety: String,
        sortDirection: Direction
    ): Pageable {
        return PageRequest.of(
            pageQuery.page,
            pageQuery.size,
            Sort.by(sortDirection, sortPropriety)
        )
    }

    fun generateRandomString(length: Int): String {
        return StringBuilder(length).apply {
            repeat(length) {
                val randomIndex = SECURE_RANDOM.nextInt(RANDOM_CHARS_SOURCE.length)
                append(RANDOM_CHARS_SOURCE[randomIndex])
            }
        }.toString()
    }

    fun toPageable(pageQuery: PaginationQuery): Pageable {
        return PageRequest.of(pageQuery.page, pageQuery.size)
    }

    private const val RANDOM_CHARS_SOURCE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    private val SECURE_RANDOM: SecureRandom = SecureRandom()
}

data class ImageSize(val width: Int, val height: Int)

fun LocalDateTime.isExpired(): Boolean {
    return this.isBefore(LocalDateTime.now())
}