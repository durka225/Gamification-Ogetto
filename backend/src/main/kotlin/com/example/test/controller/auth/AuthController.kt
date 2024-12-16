package com.example.test.controller.auth

import com.example.test.service.AuthenticationService
import com.example.test.controller.exception.ForbiddenException


import org.apache.tomcat.util.net.openssl.ciphers.Authentication
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authenticationService: AuthenticationService
) {


    // Функция POST - запроса, которая аунтефицирует пользователя
    // и возвращает токен для доступа к API.
    // Принимает на вход модель AuthenticationRequest
    @PostMapping
    fun authenticate(@RequestBody authRequest: AuthenticationRequest): AuthenticationResponse =
        authenticationService.authentication(authRequest)


    // Функция POST - запроса, которая генерирует новый токен для доступа к API
    // Принимает RefreshTokenRequest, который содержит токен
    // Возращает новый токен в теле TokenResponse
    // Если токен недействителен, то выбрасывается исключение HTTP 403
    @PostMapping("/refresh")
    fun refreshAccessToken(@RequestBody request: RefreshTokenRequest): TokenResponse =
        authenticationService.refreshAccessToken(request.token)
            ?.mapToTokenResponse()
            ?: throw ForbiddenException("Некорректный токен замены") // forbidden


    // Вспомогательная функция, которая преобразует токен в модель TokenResponse
    private fun String.mapToTokenResponse(): TokenResponse =
        TokenResponse(
            token = this
        )
}