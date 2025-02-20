package app.musimate.service.dtos.playlist

import app.musimate.service.models.Playlist
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import javax.annotation.Nullable

data class PlaylistCreationDto(
    @get:NotEmpty(message = "Playlist name cannot be empty")
    @get:Max(32, message = "Playlist name cannot exceed 32 characters")
    val name: String,

    @get:Nullable
    @get:Max(64, message = "Playlist description cannot exceed 64 characters")
    val description: String,
)

data class PlaylistDto(
    @get:NotNull
    val id: Int,

    @get:NotEmpty(message = "Playlist name cannot be empty")
    @get:Max(32, message = "Playlist name cannot exceed 32 characters")
    val name: String,

    @get:Nullable
    @get:Max(64, message = "Playlist description cannot exceed 64 characters")
    val description: String?,

    @get:NotNull
    val thumbnail: Boolean,

    @get:NotNull
    val tracksCount: Int,

    @get:NotNull
    val duration: Long
)

fun PlaylistDto(playlist: Playlist): PlaylistDto {
    return PlaylistDto(
        id = playlist.id!!,
        tracksCount = playlist.trackCount,
        name = playlist.name,
        description = playlist.description,
        thumbnail = playlist.hasThumbnail,
        duration = playlist.totalDurationSec
    )
}