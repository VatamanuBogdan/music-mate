package app.musimate.service.models

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.persistence.Embedded
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.MapsId
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.time.LocalDateTime

@Embeddable
class SpotifySecrets(
    @Column(name = "spotify_refresh_token", length = 1024, nullable = true)
    var refreshToken: String? = null,

    @Column(name = "spotify_access_token", length = 1024, nullable = true)
    var accessToken: String? = null,

    @Column(name = "spotify_token_expiration", nullable = true)
    var accessTokenExpiration: LocalDateTime? = null
)

@Entity
@Table(name = "third_party_secrets")
class ThirdPartySecrets(
    @Id
    var id: Int? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId("id")
    var user: User?,

    @Embedded
    var spotifySecrets: SpotifySecrets? = null
)