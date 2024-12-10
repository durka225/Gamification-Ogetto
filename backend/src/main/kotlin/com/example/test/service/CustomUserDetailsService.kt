package com.example.test.service

import com.example.test.repository.UserRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

typealias ApplicationUser = com.example.test.model.User

@Service
class CustomUserDetailsService(
    private val userRepository: UserRepository
) : UserDetailsService {

    // Виртуальный метод загрузики пользователя по email в данном случае
    // Возвращает UserDetails, который содержит данные о пользователе (логин, пароль, роли)
    override fun loadUserByUsername(username: String): UserDetails =
        userRepository.findByEmail(username)
            ?.mapToUserDetails()
            ?: throw UsernameNotFoundException("Not found!")

    // Метод серелизации данных пользователя (логин (email), пароль, роль)
    private fun ApplicationUser.mapToUserDetails(): UserDetails =
        User.builder()
            .username(this.email)
            .password(this.password)
            .roles(this.role.name)
            .build()
}