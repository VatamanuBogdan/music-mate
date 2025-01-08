package app.musimate.service.repositories

import app.musimate.service.models.Playlist
import app.musimate.service.models.User
import org.springframework.data.jpa.repository.JpaRepository

interface PlaylistRepository: JpaRepository<Playlist, Int> {
    fun findPlaylistsByOwner(owner: User): List<Playlist>
    fun deletePlaylistByOwnerAndId(owner: User, id: Int)
}