package app.musimate.service.repositories

import app.musimate.service.models.PlaylistTrack
import app.musimate.service.models.PlaylistTrackId
import jakarta.persistence.Tuple
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PlaylistTrackRepository: JpaRepository<PlaylistTrack, PlaylistTrackId> {
    @Query("SELECT pt.index AS index, (SELECT COUNT(pt) FROM PlaylistTrack WHERE pt.id.playlistId = :playlistId) " +
            "AS length FROM PlaylistTrack pt WHERE pt.id.playlistId = :playlistId AND pt.id.trackId = :trackId")
    fun findTrackIndexAndPlaylistLength(@Param("playlistId") playlistId: Int, @Param("trackId") trackId: Int): Tuple
    
    @Modifying
    @Query("INSERT INTO playlists_tracks (index, playlist_id, track_id) " +
            "VALUES ((SELECT COUNT(*) FROM playlists_tracks WHERE playlist_id = :playlistId)," +
            ":playlistId, :trackId)", nativeQuery = true)
    fun insertTrackToPlaylist(@Param("playlistId") playlistId: Int, @Param("trackId") trackId: Int)

    @Modifying
    @Query("DELETE FROM PlaylistTrack pt WHERE pt.id.playlistId = :playlistId AND pt.id.trackId = :trackId")
    fun removeTrackFromPlaylist(@Param("playlistId") playlistId: Int, @Param("trackId") trackId: Int)

    @Modifying
    @Query("UPDATE PlaylistTrack pt " +
            "SET pt.index = " +
            "CASE " +
            "WHEN pt.index = :currentIndex THEN :targetIndex " +
            "ELSE pt.index - 1 " +
            "END " +
            "WHERE :currentIndex < :targetIndex " +
            "AND pt.id.playlistId = :playlistId AND pt.index BETWEEN :currentIndex AND :targetIndex")
    fun moveTrackInPlaylistForward(
        @Param("playlistId") playlistId: Int,
        @Param("currentIndex") currentIndex: Int,
        @Param("targetIndex") targetIndex: Int
    )

    @Modifying
    @Query("UPDATE PlaylistTrack pt " +
            "SET pt.index = " +
            "CASE " +
            "WHEN pt.index = :currentIndex THEN :targetIndex " +
            "ELSE pt.index + 1 " +
            "END " +
            "WHERE :targetIndex < :currentIndex " +
            "AND pt.id.playlistId = :playlistId AND pt.index BETWEEN :targetIndex AND :currentIndex")
    fun moveTrackInPlaylistBackward(
        @Param("playlistId") playlistId: Int,
        @Param("currentIndex") currentIndex: Int,
        @Param("targetIndex") targetIndex: Int
    )
}