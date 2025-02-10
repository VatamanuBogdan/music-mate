package app.musimate.service.services

import app.musimate.service.dtos.PaginationQuery
import app.musimate.service.dtos.playlist.PlaylistCreationDto
import app.musimate.service.dtos.playlist.PlaylistDto
import app.musimate.service.exceptions.InvalidPlaylistIdExceptions
import app.musimate.service.models.Playlist
import app.musimate.service.models.User
import app.musimate.service.repositories.PlaylistRepository
import app.musimate.service.utils.Utils
import app.musimate.service.utils.toPageable
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Sort.Direction
import org.springframework.stereotype.Service
import java.io.InputStream

@Service
class PlaylistService(
    private val playlistRepository: PlaylistRepository,
    private val authService: AuthenticationService,
    private val imageService: ImageService
) {

    private val logger = LoggerFactory.getLogger(this::class.java)

    fun createPlaylist(user: User, creationDto: PlaylistCreationDto): PlaylistDto {

        var playlist = Playlist(
            id = null,
            name = creationDto.name,
            description = creationDto.description,
            owner = user
        )

        playlist = playlistRepository.save(playlist)
        logger.info("User ${user.email} added new playlist ${playlist.name}")

        return PlaylistDto(playlist)
    }

    fun fetchPlaylists(user: User, query: PaginationQuery): Page<PlaylistDto> {
        val pageable = Utils.toPageable(query, Playlist::name.name, Direction.ASC)
        return playlistRepository.findPlaylistsByOwner(user, pageable).map { PlaylistDto(it) }
    }

    fun fetchThumbnail(playlistId: Int): InputStream {
        val playlist = playlistRepository.findPlaylistByIdAndOwner(playlistId, authService.authenticatedUser)
            ?: throw InvalidPlaylistIdExceptions()

        return imageService.fetchPlaylistThumbnail(playlist)
    }

    fun updateThumbnail(playlistId: Int, dataStream: InputStream) {

        val playlist = playlistRepository.findPlaylistByIdAndOwner(playlistId, authService.authenticatedUser)
            ?: throw InvalidPlaylistIdExceptions()

        if (!imageService.addPlaylistThumbnail(playlist, dataStream)) {
            throw RuntimeException("Failed to thumbnail image")
        }

        if (!playlist.hasThumbnail) {
            playlist.hasThumbnail = true
            playlistRepository.save(playlist)
        }
    }
}