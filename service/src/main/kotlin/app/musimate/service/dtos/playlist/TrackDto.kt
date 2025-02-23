package app.musimate.service.dtos.playlist

import app.musimate.service.utils.Platform
import jakarta.validation.constraints.NotEmpty

data class TrackDto(
    var id: Int,
    @get:NotEmpty
    var name: String,
    @get:NotEmpty
    var artist: String,
    @get:NotEmpty
    var thumbnailUrl: String,
    var durationSec: Long,
    var source: TrackSourceDto
)

data class TrackPosition(
    var id: Int,
    var index: Int
)

data class TrackSourceDto(
    val platform: Platform,
    val value: String
)
