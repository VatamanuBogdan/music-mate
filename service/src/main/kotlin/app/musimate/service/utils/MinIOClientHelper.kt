package app.musimate.service.utils

import io.minio.*
import java.io.InputStream

class MinIOClientHelper(private val client: MinioClient) {
    fun bucketExists(name: String): Boolean {
        return client.bucketExists(
            BucketExistsArgs.builder()
                .bucket(name)
                .build()
        )
    }

    fun makeBucket(name: String) {
        client.makeBucket(
            MakeBucketArgs.builder()
                .bucket(name)
                .build()
        )
    }

    fun makeBucketIfNeeded(name: String) {
        if (!bucketExists(name)) {
            makeBucket(name)
        }
    }

    fun putObject(
        objectName: String,
        bucket: String,
        contentType: String,
        objectStream: InputStream,
        objectSize: Long
    ) {
        client.putObject(
            PutObjectArgs.builder()
                .bucket(bucket)
                .`object`(objectName)
                .stream(objectStream, objectSize, -1)
                .contentType(contentType)
                .build()
        )
    }

    fun fetchObject(objectName: String, bucket: String): GetObjectResponse {
        return client.getObject(
            GetObjectArgs.builder()
                .bucket(bucket)
                .`object`(objectName)
                .build()
        )
    }
}