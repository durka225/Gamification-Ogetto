package com.example.test.service

import com.example.test.config.JwtProperties
import com.example.test.controller.auth.AuthenticationRequest
import com.example.test.controller.auth.AuthenticationResponse
import com.example.test.repository.RefreshTokenRepository
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.*


@Service

// Класс принимает следующие поля
// AuthenticationManager - компонент Spring Security, который управляет аутентификацией пользователей
// CustomUserDetailsService - сервис, который загружает данные о пользователе на основе email
// TokenService - сервис, который отвечает за генерацию и валидацию токенов
// JwtProperties - класс, который содержит настройки JWT токена
// RefreshTokenRepository - репозиторий, который используется для хранения и извлечения токенов обновления
class AuthenticationService(
    private val authManager: AuthenticationManager,
    private val userDetailsService: CustomUserDetailsService,
    private val tokenService: TokenService,
    private val jwtProperties: JwtProperties,
    private val refreshTokenRepository: RefreshTokenRepository,
) {

    // Метод генерирует JWT токен для пользователя
    // Принимает на вход модель AuthenticationRequest, а возращает 
    // Ответ в виде модели AuthenticationResponse с двумя токенами, доступа и обновления
    fun authentication(authRequest: AuthenticationRequest): AuthenticationResponse {
        authManager.authenticate(
            UsernamePasswordAuthenticationToken(
                authRequest.login,
                authRequest.password
            )
        )

        val user = userDetailsService.loadUserByUsername(authRequest.login)
        val accessToken = generateAccessToken(user)
        val refreshToken = generateRefreshToken(user)

        refreshTokenRepository.save(refreshToken, user)

        return AuthenticationResponse(
            accessToken = accessToken,
            refreshToken = refreshToken
        )

    }
    // Метод для замены токена доступа с помощью токена обновления
    // Принимает на вход старый JWT токен доступа 
    // Возвращает новый JWT токен доступа
    fun refreshAccessToken(token: String): String? {
        val extractedEmail = tokenService.extractEmail(token)

        return extractedEmail?.let {email ->
            val currentUserDetails = userDetailsService.loadUserByUsername(email)
            val refreshTokenUserDetails = refreshTokenRepository.findUserDetailsByToken(token)

            if(!tokenService.isExpired(token) && currentUserDetails.username == refreshTokenUserDetails?.username)
            {
                generateAccessToken(currentUserDetails)
            } else {
                null
            }
        }
    }

    // Метод генерации JWT токена доступа
    // Принимает на вход модель UserDetails, а возвращает JWT токен доступа
    private fun generateAccessToken(user: UserDetails) = tokenService.generate(
        userDetails = user,
        expirationDate = Date(System.currentTimeMillis() + jwtProperties.accessTokenExpiration)
    )

    // Метод генерации JWT токена обновления
    // Принимает на вход модель UserDetails, а возвращает JWT токен обновления
    private fun generateRefreshToken(user: UserDetails) = tokenService.generate(
        userDetails = user,
        expirationDate = Date(System.currentTimeMillis() + jwtProperties.accessTokenExpiration)
    )


}
