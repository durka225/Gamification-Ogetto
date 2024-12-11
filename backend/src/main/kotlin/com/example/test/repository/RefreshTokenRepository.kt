package com.example.test.repository

import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Repository


@Repository
class RefreshTokenRepository {

    // Приватное поле tokens, которое хранит:
    // ключ - токен, значение - UserDetails пользователя
    private val tokens = mutableMapOf<String, UserDetails>()


    // Функция для поиска связанного с токеном объекта UserDetails
    // Если токен найден, возвращается UserDetails, иначе null
    fun findUserDetailsByToken(token: String): UserDetails? =
        tokens[token]

    // Функция для сохранения связанного с токеном объекта UserDetails
    // Сохраняет пару Token - UserDetails
    fun save(token: String, userDetails: UserDetails) {
        tokens[token] = userDetails
    }
}