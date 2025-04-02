package com.example.test.config

import io.github.cdimascio.dotenv.dotenv
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.jdbc.DataSourceBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.core.env.ConfigurableEnvironment
import org.springframework.core.env.MapPropertySource
import javax.sql.DataSource

@Configuration
class EnvConfig {

    @Autowired
    private lateinit var environment: ConfigurableEnvironment

    @PostConstruct
    fun loadEnv() {
        val dotenv = dotenv {
            directory = "./backend/"
            ignoreIfMissing = false
            ignoreIfMalformed = true
        }

        val props = mutableMapOf<String, Any>()
        props["USERNAME_DB"] = dotenv["USERNAME_DB"]
        props["PASSWORD_DB"] = dotenv["PASSWORD_DB"]
        props["JWT_KEY"] = dotenv["JWT_KEY"]

        val propertySource = MapPropertySource("dotenvProperties", props)
        environment.propertySources.addFirst(propertySource)
    }

    @Bean
    @Primary
    fun dataSource(): DataSource {
        val dotenv = dotenv {
            directory = "./backend/"
            ignoreIfMissing = false
        }

        return DataSourceBuilder.create()
            .url("jdbc:mysql://localhost:3306/gamification")
            .username(dotenv["USERNAME_DB"])
            .password(dotenv["PASSWORD_DB"])
            .driverClassName("com.mysql.cj.jdbc.Driver")
            .build()
    }
}