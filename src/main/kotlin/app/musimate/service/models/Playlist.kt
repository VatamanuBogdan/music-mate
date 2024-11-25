package app.musimate.service.models

import jakarta.persistence.*

@Entity
@Table(name = "playlists")
data class Playlist(
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Int?,

    @Column(nullable = false)
    var name: String,

    @ManyToOne
    @JoinColumn(name = "owner_id")
    var owner: User,

    @ManyToMany
    @JoinTable(
        name = "playlist_tracks",
        joinColumns = [
            JoinColumn(name = "playlist_id", referencedColumnName = "id")
        ],
        inverseJoinColumns = [
            JoinColumn(name = "track_id", referencedColumnName = "id")
        ]
    )
    var tracks: MutableList<Track> = mutableListOf(),

    @Column(name = "track_count", nullable = false)
    var trackCount: UInt
)