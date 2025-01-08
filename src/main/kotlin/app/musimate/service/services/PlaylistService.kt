package app.musimate.service.services

import app.musimate.service.dtos.playlist.PlaylistDto
import app.musimate.service.dtos.playlist.TrackDto
import app.musimate.service.models.Playlist
import app.musimate.service.models.User
import app.musimate.service.repositories.PlaylistRepository
import org.springframework.stereotype.Service

@Service
class PlaylistService(
    private val playlistRepository: PlaylistRepository
) {

    fun createPlaylist(user: User, name: String): PlaylistDto {

        val entity = Playlist(
            id = null,
            name = name,
            owner = user
        )

        return convertToDto(playlistRepository.save(entity))
    }

    fun fetchPlaylists(user: User): List<PlaylistDto> {

        return playlistRepository.findPlaylistsByOwner(user).map {
            convertToDto(it)
        }
    }

    fun removePlaylist(user: User, playlistId: Int) {

        playlistRepository.deletePlaylistByOwnerAndId(user, playlistId);
    }

    fun addTrackToPlaylist(use: User, playlistId: Int, track: TrackDto) {



    }

    private fun convertToDto(playlist: Playlist) =
        PlaylistDto(
            id = playlist.id!!,
            name = playlist.name,
            tracksCount = playlist.trackCount
        )
}