package com.example.test.model

import jakarta.persistence.*
import java.util.UUID


@Entity
@Table(name = "user")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    val login: String,
    val password: String,
    val email: String,
    @Enumerated(EnumType.STRING)
    val role: Role,
    var point: Int
    // todo Добавить изменяемый массив с наградами, которые купил пользователь
) {
    constructor() : this(0, "", "", "", Role.user, 0)
}

enum class Role {
    user, admin, manager
}