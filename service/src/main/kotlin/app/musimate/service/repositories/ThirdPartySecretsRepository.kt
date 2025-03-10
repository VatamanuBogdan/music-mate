package app.musimate.service.repositories

import app.musimate.service.models.User
import app.musimate.service.models.ThirdPartySecrets
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional

interface ThirdPartySecretsRepository: JpaRepository<ThirdPartySecrets, Int> {
    @Query("SELECT s FROM ThirdPartySecrets s WHERE s.user.email = :email")
    fun findSecretsForUser(@Param("email") email: String): ThirdPartySecrets?

    @Query("SELECT s FROM ThirdPartySecrets s WHERE s.user = :user")
    fun findSecretsForUser(@Param("user") user: User): ThirdPartySecrets?

    @Transactional
    @Modifying
    @Query(
        "UPDATE ThirdPartySecrets s " +
            "SET s.spotifySecrets.refreshToken = :refreshToken " +
            "WHERE s = :secrets")
    fun updateUserSpotifyRefreshToken(@Param("secrets") secrets: ThirdPartySecrets,
                                      @Param("refreshToken") refreshToken: String): Int
}