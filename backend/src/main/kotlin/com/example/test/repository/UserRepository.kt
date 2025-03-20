package com.example.test.repository

import com.example.test.model.Role
import com.example.test.model.User
import com.example.test.controller.exception.NotFoundException
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): User?
    fun findByLogin(login: String): User?
    fun deleteUserById(userId: Int)
}