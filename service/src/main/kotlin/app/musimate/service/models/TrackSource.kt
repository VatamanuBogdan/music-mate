package app.musimate.service.models

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

sealed class TrackSource {
    data class Spotify(val url: String): TrackSource()
    data class Youtube(val videoId: String): TrackSource()
}

@Converter(autoApply = true)
class TrackSourceConverter: AttributeConverter<TrackSource, String> {
    override fun convertToDatabaseColumn(value: TrackSource): String {
        return when (value) {
            is TrackSource.Spotify -> "$SPOTIFY_PREFIX${value.url}"
            is TrackSource.Youtube -> "$YOUTUBE_PREFIX${value.videoId}"
        }
    }

    override fun convertToEntityAttribute(value: String): TrackSource {
        return if (value.startsWith(SPOTIFY_PREFIX)) {
            TrackSource.Spotify(value.removePrefix(SPOTIFY_PREFIX))
        } else if (value.startsWith(YOUTUBE_PREFIX)) {
            TrackSource.Youtube(value.removePrefix(YOUTUBE_PREFIX))
        } else {
            throw RuntimeException("Invalid data serialization for ${TrackSource::javaClass.name}")
        }
    }

    private companion object {
        const val SPOTIFY_PREFIX = "SpSrc="
        const val YOUTUBE_PREFIX = "YtSrc="
    }
}
