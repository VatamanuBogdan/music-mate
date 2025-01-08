package app.musimate.service.repositories

import app.musimate.service.models.Track
import org.springframework.data.jpa.repository.JpaRepository

interface TrackRepository: JpaRepository<Track, Int> {

}