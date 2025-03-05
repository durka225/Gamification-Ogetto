package com.example.test.model

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "user")
data class UserTest (
    @Id
    @GeneratedValue
    val id: Int,
    val login: String,
    val password: String,
    @Enumerated(EnumType.STRING)
    val role: Role,
    var point: Int,
    val email: String
)
