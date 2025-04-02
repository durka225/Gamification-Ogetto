package com.example.test.config

import com.example.test.model.Role
import com.example.test.model.User
import com.example.test.repository.UserRepository
import com.example.test.service.UserService
import jakarta.transaction.Transactional
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class StartConfig(private val userService: UserService,
    private val encoder: PasswordEncoder) {

    @Bean
    @Transactional
    fun intializationData() : CommandLineRunner =
        CommandLineRunner {
            userService.createUser(
                User(
                    id = 0,
                    email = "admin",
                    login = "admin",
                    password = encoder.encode("admin"),
                    role = Role.admin,
                    point = 1000
                )
            )
        }
}