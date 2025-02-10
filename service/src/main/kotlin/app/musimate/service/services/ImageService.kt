package app.musimate.service.services

import app.musimate.service.models.Playlist
import app.musimate.service.utils.ImageSize
import app.musimate.service.utils.MinIOClientHelper
import jakarta.annotation.PostConstruct
import org.imgscalr.Scalr
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.util.MimeTypeUtils
import java.awt.image.BufferedImage
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.InputStream
import javax.imageio.ImageIO

@Service
class ImageService(private val minioClient: MinIOClientHelper) {

    private val logger = LoggerFactory.getLogger(this::class.java)

    @PostConstruct
    private fun init() {
        initBuckets()
        logger.info("Initialised buckets successfully")
    }

    private fun initBuckets() {
        try {
            minioClient.makeBucketIfNeeded(PLAYLIST_THUMBNAILS_BUCKET)
        } catch (th: Throwable) {
            throw Error("Failed to init ImageService buckets", th)
        }
    }

    fun fetchPlaylistThumbnail(playlist: Playlist): InputStream {
        return minioClient.fetchObject(
            objectName = thumbnailObjectName(playlist),
            bucket = PLAYLIST_THUMBNAILS_BUCKET
        )
    }

    fun addPlaylistThumbnail(playlist: Playlist, imageStream: InputStream): Boolean {
        val resizedImageInputStream: ByteArrayInputStream
        val resizeImageBytesCount: Long
        try {
            val resizedImageOutputStream = ByteArrayOutputStream();
            ImageIO.write(resizeImage(imageStream), "jpg", resizedImageOutputStream)

            val resizedImageBuffer = resizedImageOutputStream.toByteArray()
            resizeImageBytesCount = resizedImageBuffer.size.toLong()
            resizedImageInputStream = ByteArrayInputStream(resizedImageBuffer)
        } catch (ex: Exception) {
            logger.warn("Failed to create thumbnail for ${playlist.id} playlist")
            return false
        }

        try {
            minioClient.putObject(
                objectName =   thumbnailObjectName(playlist),
                bucket = PLAYLIST_THUMBNAILS_BUCKET,
                contentType = MimeTypeUtils.IMAGE_JPEG_VALUE,
                objectStream = resizedImageInputStream,
                objectSize = resizeImageBytesCount
            )
        } catch (ex: Exception) {
            logger.error("Failed to upload to MinIO generated thumbnail for ${playlist.id} playlist")
            return false
        }

        return true
    }

    private fun resizeImage(imageStream: InputStream): BufferedImage {
        val scaledInstance = ImageIO.read(imageStream)
        return Scalr.resize(
            scaledInstance,
            Scalr.Mode.
            FIT_EXACT,
            PLAYLIST_THUMBNAIL_SIZE.width,
            PLAYLIST_THUMBNAIL_SIZE.height
        )
    }

    private fun thumbnailObjectName(playlist: Playlist): String {
        return "${playlist.id}-thumbnail"
    }

    companion object {
        const val PLAYLIST_THUMBNAILS_BUCKET = "playlist-thumbnails"
        val PLAYLIST_THUMBNAIL_SIZE = ImageSize(100, 100)
    }
}