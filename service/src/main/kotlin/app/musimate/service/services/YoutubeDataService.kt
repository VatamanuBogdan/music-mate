package app.musimate.service.services

import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.google.api.services.youtube.YouTube
import com.google.api.services.youtube.model.VideoListResponse
import jakarta.annotation.PostConstruct
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import kotlin.time.Duration

@Service
class YoutubeDataService {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @Value("\${youtube-data.api-key}")
    private lateinit var apiKey: String
    private lateinit var youtube: YouTube

    @PostConstruct
    fun init() {
        try {
            youtube = YouTube.Builder(NetHttpTransport(), GsonFactory.getDefaultInstance()) {}
                .setApplicationName(APPLICATION_NAME)
                .build()
        } catch (ex: Exception) {
            logger.error("Failed to initialized Youtube Data API Client")
        }
    }

    fun fetchSongInformation(videoId: String): SongInformation? {
        val request = youtube.videos().list("id,snippet,contentDetails").setKey(apiKey)

        val response: VideoListResponse
        try {
            response = request.setId(videoId).execute()
        } catch (ex: Exception) {
            logger.error("Failed to fetch data for $videoId $ex")
            return null
        }

        try {
            val item = response.items.first()
            val snippets = item.snippet

            val title = snippets.title
            val channel = snippets.channelTitle
            val duration = item.contentDetails.duration.let { Duration.parse(it) }

            val titleAndArtist = extractSongTitleAndArtist(title, channel)

            return SongInformation(
                titleAndArtist.first,
                titleAndArtist.second,
                duration
            )
        } catch (ex: Exception) {
            logger.error("Failed to extract data for $videoId $ex")
            return null
        }
    }

    fun getThumbnailUrl(videoId: String, quality: ThumbnailQuality): String {
        return when (quality) {
            ThumbnailQuality.STANDARD ->
                "https://img.youtube.com/vi/${videoId}/sddefault.jpg"
            ThumbnailQuality.MEDIUM ->
                "https://img.youtube.com/vi/${videoId}/mqdefault.jpg"
            ThumbnailQuality.HIGH ->
                "https://img.youtube.com/vi/${videoId}/hqdefault.jpg"
        }
    }

    private fun extractSongTitleAndArtist(videoTitle: String, channel: String): Pair<String, String> {
        val separatorIndex = videoTitle.indexOfAny(AUTHOR_TITLE_SEPARATORS)
        if (separatorIndex < 1 || videoTitle.length - separatorIndex < 1) {
            return Pair(videoTitle.trim(), channel.trim())
        }

        var titleEndIndex = videoTitle.indexOfAny(TITLE_METADATA_SEPARATORS, separatorIndex + 1)
        if (titleEndIndex == -1) {
            titleEndIndex = videoTitle.length - 1
        }

        return Pair(
            videoTitle.substring(separatorIndex + 1, titleEndIndex).trim(),
            videoTitle.substring(0, separatorIndex).trim()
        )
    }

    companion object {
        private const val APPLICATION_NAME = "Music Mate"
        private val AUTHOR_TITLE_SEPARATORS = "-:".toCharArray()
        private val TITLE_METADATA_SEPARATORS = "()[]{}|".toCharArray()
    }

    data class SongInformation(
        val title: String,
        val artist: String,
        val duration: Duration
    )

    enum class ThumbnailQuality {
        STANDARD, MEDIUM, HIGH
    }
}