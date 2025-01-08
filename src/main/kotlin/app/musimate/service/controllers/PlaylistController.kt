package app.musimate.service.controllers

import app.musimate.service.dtos.playlist.PlaylistDto
import app.musimate.service.dtos.playlist.TrackDto
import app.musimate.service.models.Playlist
import app.musimate.service.models.User
import app.musimate.service.services.AuthenticationService
import app.musimate.service.services.PlaylistService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/playlists")
class PlaylistController(
    private val authService: AuthenticationService,
    private val playlistService: PlaylistService
) {

    private val authenticatedUser: User
        get() = authService.authenticatedUser

    @GetMapping
    fun fetchPlaylists(): List<PlaylistDto> =
        playlistService.fetchPlaylists(authenticatedUser)

    @GetMapping("/{playlistId}")
    fun fetchPlaylistContent(@PathVariable playlistId: Int): List<TrackDto> {
        TODO("NOT IMPLEMENTED")
    }

    @PostMapping("/{playlistName}")
    fun createPlaylist(@PathVariable playlistName: String): PlaylistDto =
        playlistService.createPlaylist(authenticatedUser, playlistName)

    @PostMapping("/{playlistId}/tracks")
    fun addTrack(
        @PathVariable playlistId: String,
        @RequestBody body: TrackDto,
    ): String {
        TODO("NOT IMPLEMENTED")
    }

    @DeleteMapping("/{playlistId}")
    fun removePlaylist(@PathVariable playlistId: Int) =
        playlistService.removePlaylist(authenticatedUser, playlistId)

    @DeleteMapping("/{playlistId}/tracks/{trackId}")
    fun removeTrack(
        @PathVariable playlistId: String,
        @PathVariable trackId: String
    ): String {
        TODO("NOT IMPLEMENTED")
    }
}