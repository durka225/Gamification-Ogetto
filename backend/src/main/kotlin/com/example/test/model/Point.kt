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
    val description: String?,
    // todo Добавить поле для хранения id награды, сделать его Nullable
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reward_id", nullable = true)
    val idReward: Reward? = null,

    @Enumerated(EnumType.STRING)
    val status: PointStatus = PointStatus.PENDING
) {
    constructor() : this(0, User(), 0, "", Reward(), PointStatus.PENDING)
}