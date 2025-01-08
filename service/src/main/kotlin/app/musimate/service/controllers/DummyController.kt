package app.musimate.service.controllers

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/dummy")
class DummyController {

    @GetMapping("/hello")
    fun helloWorld() = "Hello world!"
}