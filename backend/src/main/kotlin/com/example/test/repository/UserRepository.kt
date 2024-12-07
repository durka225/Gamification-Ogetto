package com.example.test.repository

import com.example.test.model.Role
import com.example.test.model.User
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Repository
import java.util.*

@Repository
class UserRepository (
    private val encoder: PasswordEncoder
) {

    private val users = mutableListOf(
        User(
            id = UUID.randomUUID(),
            login = "login1",
            password = encoder.encode("password1"),
            role = Role.admin,
            email =  "email1@gmail.com"
        ),
        User(
            id = UUID.randomUUID(),
            login = "login2",
            password = encoder.encode("password2"),
            role = Role.user,
            email =  "email2@gmail.com"
        ),
        User(
            id = UUID.randomUUID(),
            login = "login3",
            password = encoder.encode("password3"),
            role = Role.manager,
            email =  "email3@gmail.com"
        ),
    )

    fun addUser (user: User): Boolean {
        val updated = user.copy(password = encoder.encode(user.password))
        return users.add(updated)
    }


    fun findByEmail(email: String): User? =
        users
            .firstOrNull { it.email == email }

    fun findAll(): List<User> = users

    fun findByUUID(uuid: UUID): User? =
        users
            .firstOrNull { it.id == uuid }

    fun deleteByUUID(uuid: UUID): Boolean {
        val foundUser = findByUUID(uuid)

        return foundUser?.let {
            users.remove(it)
        } ?: false
    }
}