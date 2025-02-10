package app.musimate.service.repositories

import app.musimate.service.models.Playlist
import app.musimate.service.models.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.PagingAndSortingRepository

interface PlaylistRepository: JpaRepository<Playlist, Int>, PagingAndSortingRepository<Playlist, Int> {
    fun findPlaylistsByOwner(owner: User, pageable: Pageable): Page<Playlist>
    fun findPlaylistByIdAndOwner(id: Int, owner: User): Playlist?

    fun deletePlaylistByOwnerAndId(owner: User, id: Int)
}