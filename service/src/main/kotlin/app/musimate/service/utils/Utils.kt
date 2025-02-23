package app.musimate.service.utils

import app.musimate.service.dtos.PaginationQuery
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.Direction
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

fun Utils.toPageable(pageQuery: PaginationQuery): Pageable {
    return PageRequest.of(pageQuery.page, pageQuery.size)
}