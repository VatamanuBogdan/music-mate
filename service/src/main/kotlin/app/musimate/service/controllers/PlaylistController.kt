package app.musimate.service.controllers

import app.musimate.service.dtos.PaginatedResponse
import app.musimate.service.dtos.PaginationQuery
import app.musimate.service.dtos.playlist.PlaylistCreationDto
import app.musimate.service.dtos.playlist.PlaylistDto
import app.musimate.service.dtos.playlist.TrackDto
import app.musimate.service.models.User
import app.musimate.service.services.AuthenticationService
import app.musimate.service.services.PlaylistService
import org.springframework.core.io.InputStreamResource
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.io.InputStream

@RestController
@RequestMapping("/api/playlists")
class PlaylistController(
    private val authService: AuthenticationService,
    private val playlistService: PlaylistService
) {

    private val authenticatedUser: User
        get() = authService.authenticatedUser

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createPlaylist(@RequestBody body: PlaylistCreationDto): PlaylistDto {
        return playlistService.createPlaylist(authenticatedUser, body)
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun fetchPlaylists(pageQuery: PaginationQuery): PaginatedResponse<PlaylistDto> {
        val pageable = playlistService.fetchPlaylists(authenticatedUser, pageQuery)
        return PaginatedResponse(pageable)
    }

    @PutMapping("/thumbnails")
    @ResponseStatus(HttpStatus.OK)
    fun updateThumbnail(
        @RequestParam(name = "id") playlistId: Int,
        dataStream: InputStream
    ) {
        playlistService.updateThumbnail(playlistId, dataStream)
    }

    @GetMapping(
        value = ["/thumbnails"],
        produces = [MediaType.IMAGE_JPEG_VALUE]
    )
    fun fetchThumbnail(@RequestParam(name = "id") playlistId: Int): InputStreamResource {
        val inputStream = playlistService.fetchThumbnail(playlistId)
        val resource = InputStreamResource(inputStream)
        return resource
    }
}