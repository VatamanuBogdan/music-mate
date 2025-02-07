package app.musimate.service.config

import io.minio.MinioClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class MinIOConfiguration {
    @Value("\${minio.url}")
    private lateinit var url: String

    @Value("\${minio.access.username}")
    private lateinit var username: String

    @Value("\${minio.access.password}")
    private lateinit var password: String

    @Bean
    fun minioClient(): MinioClient {
        return MinioClient.builder()
            .endpoint(url)
            .credentials(username, password)
            .build()
    }
}