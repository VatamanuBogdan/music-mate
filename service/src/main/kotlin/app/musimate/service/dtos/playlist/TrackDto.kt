package app.musimate.service.dtos.playlist

import app.musimate.service.models.TrackSource
import app.musimate.service.utils.Platform
import jakarta.validation.constraints.NotEmpty
import java.net.URL

data class TrackDto(
    var id: Int,
    @get:NotEmpty
    var name: String,
    @get:NotEmpty
    var artist: String,
    @get:NotEmpty
    var thumbnailUrl: String,
    var source: TrackSourceDto
)

data class TrackSourceDto(
    val platform: Platform,
    val value: String
)
