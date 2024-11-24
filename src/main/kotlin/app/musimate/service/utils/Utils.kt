package app.musimate.service.utils

import java.util.*
import kotlin.time.Duration

object Utils

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