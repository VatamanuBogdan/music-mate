package app.musimate.service.repositories

import app.musimate.service.models.Playlist
import app.musimate.service.models.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.data.repository.query.Param

interface PlaylistRepository: JpaRepository<Playlist, Int>, PagingAndSortingRepository<Playlist, Int> {
    fun findPlaylistsByOwner(owner: User, pageable: Pageable): Page<Playlist>
    fun findPlaylistByIdAndOwner(id: Int, owner: User): Playlist?
    fun existsPlaylistByIdAndOwner(id: Int, owner: User): Boolean

    @Modifying
    @Query("DELETE FROM playlists_tracks WHERE playlist_id = :playlistId AND track_id = :trackId", nativeQuery = true)
    fun removeTrackFromPlaylist(@Param("playlistId") playlistId: Int, @Param("trackId") trackId: Int)
}