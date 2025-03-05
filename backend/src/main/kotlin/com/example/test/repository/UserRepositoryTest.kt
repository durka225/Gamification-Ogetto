package com.example.test.repository

import com.example.test.model.UserTest
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepositoryTest : JpaRepository<UserTest, Int> {
    fun findByEmail(email: String): UserTest?
    fun findByLogin(login: String): UserTest?
}