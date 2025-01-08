package app.musimate.service.models

import jakarta.persistence.*

@Entity
@Table(name = "artists")
data class Artist(

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Int?,

    @Column(name = "full_name", unique = true, nullable = false)
    var fullName: String,

    @OneToMany(mappedBy = "artist")
    var tracks: MutableList<Track> = mutableListOf()
)
