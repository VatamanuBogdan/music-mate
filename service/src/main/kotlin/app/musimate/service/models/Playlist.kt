package app.musimate.service.models

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "playlists")
class Playlist(
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Int?,

    @Column(length = 32, nullable = false)
    var name: String,

    @Column(length = 64)
    var description: String?,

    @Column(name = "has_thumbnail", nullable = false)
    var hasThumbnail: Boolean = false,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    var owner: User,

    @Column(name = "track_count", nullable = false)
    var trackCount: Int = 0,

    @Column(name = "total_duration")
    var totalDurationSec: Long = 0,


    @OneToMany(
        mappedBy = "playlist",
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
    )
    var tracks: MutableList<PlaylistTrack> = mutableListOf(),
) {
    @CreatedDate
    @Column(name = "created_data", nullable = false)
    lateinit var createdDate: LocalDateTime

    @LastModifiedDate
    @Column(name = "last_modified", nullable = false)
    lateinit var lastModifier: LocalDateTime

    override fun equals(other: Any?): Boolean {
        if (this === other) {
            return true
        }
        if (other !is Playlist) {
            return false
        }

        return id != null && id == other.id
    }

    override fun hashCode(): Int {
        return javaClass.hashCode()
    }
}