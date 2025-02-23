package app.musimate.service.models

import jakarta.persistence.*

@Entity
@Table(name = "tracks")
class Track(
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Int?,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    val artist: String,

    @Column(name = "duration_sec", nullable = false)
    val durationSec: Long,

    @Convert(converter = TrackSourceConverter::class)
    @Column(nullable = false, unique = true)
    var source: TrackSource,

    @OneToMany(
        mappedBy = "track",
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    var playlists: MutableList<PlaylistTrack> = mutableListOf()
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) {
            return true
        }
        if (other !is Track) {
            return false
        }

        return (id != null && id == other.id) || this.source == other.source
    }

    override fun hashCode(): Int {
        return source.hashCode()
    }
}