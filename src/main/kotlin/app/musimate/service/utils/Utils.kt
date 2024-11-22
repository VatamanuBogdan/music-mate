package app.musimate.service.utils

import java.util.*
import kotlin.time.Duration

object Utils

fun Utils.currentDate() = Date(System.currentTimeMillis())

fun Utils.currentDateAfter(duration: Duration): Date {
    return Date(System.currentTimeMillis() + duration.inWholeMilliseconds)
}