package app.musimate.service.models

import jakarta.persistence.*

@Entity
@Table(name = "tracks")
data class Track(

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Int?,

    @Column(nullable = false)
    var name: String,

    @Embedded
    var source: TrackSource,

    @ManyToOne
    @JoinColumn(name = "artist_id")
    var artist: Artist
)