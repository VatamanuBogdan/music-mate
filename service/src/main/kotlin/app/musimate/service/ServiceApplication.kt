package app.musimate.service

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaAuditing

@SpringBootApplication
@EnableJpaAuditing
class ServiceApplication

fun main(args: Array<String>) {
	runApplication<ServiceApplication>(*args)
}
