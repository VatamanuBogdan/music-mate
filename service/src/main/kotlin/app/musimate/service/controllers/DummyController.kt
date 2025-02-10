package app.musimate.service.controllers

import app.musimate.service.services.ImageService
import io.minio.*
import jakarta.servlet.http.HttpServletRequest
import org.springframework.context.annotation.Profile
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.io.InputStream

@RestController
@RequestMapping("/api/dummy")
class DummyController(
    private val minioClient: MinioClient,
    private val imageService: ImageService
) {

    @GetMapping("/hello")
    fun helloWorld() = "Hello world!"

    @PostMapping("/files/{fileName}")
    fun sendFile(
        dataStream: InputStream,
        @PathVariable fileName: String,
        @RequestHeader("Content-Length") contentLength: Long
    ) {
        try {
            val dummyBucketName = "dummy-bucket"

            val shouldCreate = !minioClient.bucketExists(
                BucketExistsArgs
                    .builder()
                    .bucket(dummyBucketName)
                    .build()
            )

            if (shouldCreate) {
                minioClient.makeBucket(
                    MakeBucketArgs
                        .builder()
                        .bucket(dummyBucketName)
                        .build())
            }

            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(dummyBucketName)
                    .`object`(fileName)
                    .stream(dataStream, contentLength, -1)
                    .contentType("application/octet-stream")
                    .build()
            )

        } catch (ex: Exception) {
            println("Error on file uploading $ex")
        }
    }
}