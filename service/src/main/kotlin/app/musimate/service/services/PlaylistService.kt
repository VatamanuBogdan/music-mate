package app.musimate.service.services

import app.musimate.service.dtos.ApiErrorCode
import app.musimate.service.dtos.PaginationQuery
import app.musimate.service.dtos.playlist.*
import app.musimate.service.exceptions.ApiException
import app.musimate.service.exceptions.InvalidPlaylistIdException
import app.musimate.service.exceptions.SpotifyOperationNotImplementedException
import app.musimate.service.models.*
import app.musimate.service.repositories.PlaylistRepository
import app.musimate.service.repositories.PlaylistTrackRepository
import app.musimate.service.repositories.TrackRepository
import app.musimate.service.utils.Platform
import app.musimate.service.utils.Utils
import app.musimate.service.utils.toPageable
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Sort.Direction
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.InputStream

@Service
class PlaylistService(
    private val playlistRepository: PlaylistRepository,
    private val playlistTrackRepository: PlaylistTrackRepository,
    private val trackRepository: TrackRepository,
    private val authService: AuthenticationService,
    private val youtubeService: YoutubeDataService,
    private val imageService: ImageService
) {

    private val logger = LoggerFactory.getLogger(this::class.java)
    private val authUser: User
        get() = authService.authenticatedUser

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
        val page = Utils.toPageable(query, Playlist::name.name, Direction.ASC)
        return playlistRepository.findPlaylistsByOwner(user, page).map { PlaylistDto(it) }
    }

    fun fetchThumbnail(playlistId: Int): InputStream {
        val playlist = playlistRepository.findPlaylistByIdAndOwner(playlistId, authService.authenticatedUser)
            ?: throw InvalidPlaylistIdException()

        return imageService.fetchPlaylistThumbnail(playlist)
    }

    fun updateThumbnail(playlistId: Int, dataStream: InputStream) {

        val playlist = playlistRepository.findPlaylistByIdAndOwner(playlistId, authService.authenticatedUser)
            ?: throw InvalidPlaylistIdException()

        if (!imageService.addPlaylistThumbnail(playlist, dataStream)) {
            throw RuntimeException("Failed to thumbnail image")
        }

        if (!playlist.hasThumbnail) {
            playlist.hasThumbnail = true
            playlistRepository.save(playlist)
        }
    }

    @Transactional(readOnly = true)
    fun fetchPlaylistTracks(playlistId: Int, query: PaginationQuery): Page<TrackDto> {
        if (!playlistRepository.existsPlaylistByIdAndOwner(playlistId, authUser)) {
            throw InvalidPlaylistIdException()
        }

        val pageable = Utils.toPageable(query)
        val page = trackRepository.findPlaylistTracks(playlistId, pageable)
        
        return page.map { createTrackDto(it) }
    }

    @Transactional
    fun addTrackToPlaylist(playlistId: Int, source: TrackSourceDto): TrackDto {
        val playlist = playlistRepository.findPlaylistByIdAndOwner(playlistId, authUser)
            ?: throw InvalidPlaylistIdException()

        val platform = source.platform
        val source = when (platform) {
            Platform.YOUTUBE -> TrackSource.Youtube(source.value)
            Platform.SPOTIFY -> TrackSource.Spotify(source.value)
        }

        var track = trackRepository.findTrackBySource(source)
        if (track == null) {
            track = trackRepository.save(createTransientTrack(source))
        }

        playlistTrackRepository.insertTrackToPlaylist(
            playlistId = playlist.id!!,
            trackId = track.id!!
        )
        return createTrackDto(track)
    }

    @Transactional
    fun removeTrackFromPlaylist(playlistId: Int, trackId: Int) {
        if (!playlistRepository.existsPlaylistByIdAndOwner(playlistId, authUser)) {
            throw InvalidPlaylistIdException()
        }

        playlistTrackRepository.removeTrackFromPlaylist(playlistId, trackId)
    }

    @Transactional
    fun moveTrackInPlaylist(playlistId: Int, trackId: Int, targetIndex: Int) {
        if (!playlistRepository.existsPlaylistByIdAndOwner(playlistId, authUser)) {
            throw InvalidPlaylistIdException()
        }

        val result = playlistTrackRepository.findTrackIndexAndPlaylistLength(playlistId, trackId)
        val currentIndex = result.get(0) as Int
        val playlistLength = result.get(1) as Long
        if (targetIndex < 0 || targetIndex >= playlistLength) {
            throw RuntimeException("Invalid Index")
        }

        if (currentIndex == targetIndex) {
            return
        }

        if (currentIndex < targetIndex) {
            playlistTrackRepository.moveTrackInPlaylistForward(playlistId, currentIndex, targetIndex)
        } else {
            playlistTrackRepository.moveTrackInPlaylistBackward(playlistId, currentIndex, targetIndex)
        }
    }

    private fun createTransientTrack(source: TrackSource) = when (source) {
        is TrackSource.Youtube -> {
            val songInformation = youtubeService.fetchSongInformation(source.videoId)
                ?: throw ApiException(HttpStatus.BAD_REQUEST,
                    ApiErrorCode.UNKNOWN,
                    message = "Failed to retrieve youtube video information"
                )
            Track(
                id = null,
                name = songInformation.title,
                artist = songInformation.artist,
                durationSec = songInformation.duration.inWholeSeconds,
                source = source
            )
        }
        is TrackSource.Spotify -> {
            throw SpotifyOperationNotImplementedException()
        }
    }

    private fun createTrackDto(track: Track) = when(val source = track.source) {
        is TrackSource.Youtube -> {
            TrackDto(
                id = track.id!!,
                name = track.name,
                artist = track.artist,
                thumbnailUrl = youtubeService.getThumbnailUrl(
                    source.videoId,
                    quality = YoutubeDataService.ThumbnailQuality.MEDIUM
                ),
                durationSec= track.durationSec,
                source = TrackSourceDto(Platform.YOUTUBE, source.videoId)
            )
        }
        is TrackSource.Spotify -> {
            throw SpotifyOperationNotImplementedException()
        }
    }
}