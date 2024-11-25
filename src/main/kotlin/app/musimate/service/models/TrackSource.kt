package app.musimate.service.models

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated

@Embeddable
data class TrackSource(
    @Column(nullable = false)
    val url: String,

    @Enumerated(value = EnumType.ORDINAL)
    @Column(nullable = false)
    val platform: Platform
)
