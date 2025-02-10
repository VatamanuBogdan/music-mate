package app.musimate.service.models

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "playlists")
data class Playlist(
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Int?,

    @Column(length = 32, nullable = false)
    var name: String,

    @Column(length = 64)
    var description: String?,

    @Column(name = "has_thumbnail", nullable = false)
    var hasThumbnail: Boolean = false,

    @ManyToOne
    @JoinColumn(name = "owner_id")
    var owner: User,

    @Column(name = "total_duration")
    var totalDuration: UInt = 0u,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "playlist_tracks",
        joinColumns = [
            JoinColumn(name = "playlist_id", referencedColumnName = "id")
        ],
        inverseJoinColumns = [
            JoinColumn(name = "track_id", referencedColumnName = "id")
        ],
    )
    var tracks: MutableList<Track> = mutableListOf(),

    @Column(name = "track_count", nullable = false)
    var trackCount: UInt = 0u,
) {
    @CreatedDate
    @Column(name = "created_data", nullable = false)
    lateinit var createdDate: LocalDateTime

    @LastModifiedDate
    @Column(name = "last_modified", nullable = false)
    lateinit var lastModifier: LocalDateTime
}