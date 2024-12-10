package com.example.test.config

import com.example.test.service.CustomUserDetailsService
import com.example.test.service.TokenService
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.web.authentication.WebAuthenticationDetails
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val userDetailsService: CustomUserDetailsService,
    private val tokenService: TokenService
) : OncePerRequestFilter() {

    // Виртуальная функция для фильтрации авторизации. 
    // Запрос в форме HttpServletRequest
    // Ответ в форме HttpServletResponse
    // Передача входящего запроса и ответа через фильтр filterChain.doFilter()
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader: String? = request.getHeader("Authorization")

        if (authHeader.doesNotContainBearerToken()) {
            filterChain.doFilter(request, response)
            return
        }

        val jwtToken = authHeader!!.extractTokenValue()
        val email = tokenService.extractEmail(jwtToken)

        if (email != null && SecurityContextHolder.getContext().authentication == null) {
            val foundUser = userDetailsService.loadUserByUsername(email)

            if (tokenService.isValid(jwtToken, foundUser)) {
                updateContext(foundUser, request)
            }

            filterChain.doFilter(request, response)
        }
    }

    // Метод для обновления текста токена на актуальную
    // и добавляет его в контекст SecurityContextHolder.getContext().authentication
    private fun updateContext(foundUser: UserDetails, request: HttpServletRequest) {
        val authToken = UsernamePasswordAuthenticationToken(foundUser, null, foundUser.authorities)

        authToken.details = WebAuthenticationDetailsSource().buildDetails(request)

        SecurityContextHolder.getContext().authentication = authToken
    }

    // Проверка валидности токена с помощью проверки токена на наличие
    // заголовка Bearer и его содержимого
    private fun String?.doesNotContainBearerToken(): Boolean =
        this == null || !this.startsWith("Bearer")


    // Метод для извлечения токена, с помощью удаления заголовка Bearer
    private fun String.extractTokenValue(): String =
        this.substringAfter("Bearer ")
}