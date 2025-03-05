package com.example.test.controller.auth

import com.example.test.service.AuthenticationService
import com.example.test.controller.exception.ForbiddenException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag


import org.apache.tomcat.util.net.openssl.ciphers.Authentication
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Контроллер аутентификации и регистрации")
class AuthController(
    private val authenticationService: AuthenticationService
) {
    @Operation(
        summary = "Авторизация пользователя",
        description = "Позволяет авторизовать пользователя. " +
                "Получает в запросе данные пользователя, сверяет логин и пароль с базой данных. " +
                "Если совпадает всё, то возвращает токен доступа и токен замены." +
                "Если не совпадает, то возвращает ошибку 500."
    )
    @PostMapping
    fun authorization(@RequestBody authRequest: AuthenticationRequest): AuthenticationResponse =
        authenticationService.authentication(authRequest)


    @Operation(
        summary = "Обновление токена доступа",
        description = "Позволяет обновить токен доступа. " +
                "Проверяется токен замены на корректность, если он некорректный, то " +
                "возврат исключения 403 Forbidden."
    )
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