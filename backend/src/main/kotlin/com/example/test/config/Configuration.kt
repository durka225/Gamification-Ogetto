package com.example.test.config

import com.example.test.repository.UserRepository
import com.example.test.service.CustomUserDetailsService
import org.apache.tomcat.util.net.openssl.ciphers.Authentication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder


@Configuration
@EnableConfigurationProperties(JwtProperties::class)
class Configuration {

    // Конфигурация изменения данных пользователя
    // Детали пользователя принимают вид, который указан в userRepository
    @Bean
    fun userDetailsService(userRepository: UserRepository): UserDetailsService =
        CustomUserDetailsService(userRepository)

    // Конфигурация шифрования паролей с помощью BCrypt
    @Bean
    fun encoder(): PasswordEncoder = BCryptPasswordEncoder()

    // Конфигурация аутентификации пользователя
    // Аунтентификация состоит из двух элементов (email и password зашифрованный)
    @Bean
    fun authenticationProvider(userRepository: UserRepository): AuthenticationProvider =
        DaoAuthenticationProvider()
            .also {
                it.setUserDetailsService(userDetailsService((userRepository)))
                it.setPasswordEncoder(encoder())
            }

    // Конфигурация менеджера аутентификации
    // Менеджер аутентификации управляет аутентификацией пользователей
    // Используется для проверки подлинности пользователей
    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager =
        config.authenticationManager
}