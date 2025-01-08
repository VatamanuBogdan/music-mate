package app.musimate.service.dtos.playlist

import app.musimate.service.utils.Platform
import jakarta.validation.constraints.NotEmpty
import org.hibernate.validator.constraints.URL

data class TrackDto(
    var id: Int,

    @get:NotEmpty
    var name: String,

    @get:URL
    var url: String,

    var platform: Platform
)
