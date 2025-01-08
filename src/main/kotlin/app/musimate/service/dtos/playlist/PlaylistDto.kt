package app.musimate.service.dtos.playlist

import app.musimate.service.models.Playlist

data class PlaylistDto(
    val id: Int,
    val name: String,
    val tracksCount: UInt
)