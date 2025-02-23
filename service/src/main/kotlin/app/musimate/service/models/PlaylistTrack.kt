package app.musimate.service.models

import jakarta.persistence.*
import java.io.Serializable

@Embeddable
data class PlaylistTrackId(
    @Column(name = "playlist_id")
    val playlistId: Int,
    @Column(name = "track_id")
    val trackId: Int
): Serializable

@Entity
@Table(name = "playlists_tracks")
class PlaylistTrack(
    @EmbeddedId
    val id: PlaylistTrackId,

    @Column(nullable = false)
    val index: Int,

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("playlistId")
    val playlist: Playlist,

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("trackId")
    val track: Track,
)