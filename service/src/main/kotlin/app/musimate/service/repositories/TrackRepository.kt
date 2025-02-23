package app.musimate.service.repositories

import app.musimate.service.models.Playlist
import app.musimate.service.models.Track
import app.musimate.service.models.TrackSource
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface TrackRepository: JpaRepository<Track, Int> {
    fun findTrackBySource(source: TrackSource): Track?

    @Query("SELECT t FROM Track t JOIN t.playlists p WHERE p.id.playlistId = :playlistId ORDER BY p.index")
    fun findPlaylistTracks(@Param("playlistId") playlistId: Int, pageable: Pageable): Page<Track>
}