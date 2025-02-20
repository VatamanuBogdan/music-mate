package app.musimate.service.repositories

import app.musimate.service.models.Playlist
import app.musimate.service.models.Track
import app.musimate.service.models.TrackSource
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface TrackRepository: JpaRepository<Track, Int> {
    fun findTrackBySource(source: TrackSource): Track?
    fun findTracksByPlaylistsId(playlistId: Int, pageable: Pageable): Page<Track>
}