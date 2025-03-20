package com.example.test.model

import jakarta.persistence.*

@Entity
@Table(name = "point")
data class Point (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_login", nullable = false)
    val login: User,
    val points: Int?,
    val description: String?
    // todo Добавить поле для хранения id награды, сделать его Nullable
) {
    constructor() : this(0, User(), 0, "")
}