package com.example.test.model

import java.util.UUID

data class User(
    val id: UUID,
    val login: String,
    val password: String,
    val role: Role,
    val email: String
)

enum class Role {
    user, admin, manager
}