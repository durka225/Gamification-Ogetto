package com.example.test.service;

import com.example.test.config.JwtProperties;
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.security.core.userdetails.ReactiveUserDetailsService
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails
import java.util.Date

@Service
class TokenService(
    jwtProperties: JwtProperties
) {
    // Метод для получение секретного ключа для генерации JWT токенов
    private val secretKey = Keys.hmacShaKeyFor(
        jwtProperties.key.toByteArray()
    )

    // Функция генерации JWT токена.
    // Объектом токена является username (email) пользователя
    // Дата создания токена является текущее время системы
    // Время существования токена - expirationDate
    // Дополнительные поля могут быть добавлены в claims
    // Шифруется с помощью secretKey
    fun generate(
        userDetails: UserDetails,
        expirationDate: Date,
        additionalClaims: Map<String, Any> = emptyMap()
    ): String =
        Jwts.builder()
            .claims()
            .subject(userDetails.username)
            .issuedAt(Date(System.currentTimeMillis()))
            .expiration(expirationDate)
            .add(additionalClaims)
            .and()
            .signWith(secretKey)
            .compact()

    // Метод проверки email пользователя с помощью токена
    fun extractEmail(token: String): String? =
        getAllClaims(token)
            .subject

    // Метод проверки срока действия токена
    fun isExpired(token: String): Boolean =
        getAllClaims(token)
            .expiration
            .before(Date(System.currentTimeMillis()))

    // Метод проверки токена на соответствие информации о пользователе
    fun isValid(token: String, userDetails: UserDetails): Boolean {
        val email = extractEmail(token)

        return userDetails.username == email && !isExpired(token)
    }

    // Вспомогательная функция для получения claims из токена
    private fun getAllClaims(token: String): Claims {
        val parser = Jwts.parser()
            .verifyWith(secretKey)
            .build()

        return parser
            .parseSignedClaims(token)
            .payload
    }

}
