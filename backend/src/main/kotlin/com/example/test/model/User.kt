package com.example.test.model

import jakarta.persistence.*
import java.util.UUID


@Entity
@Table(name = "user")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    val name: String,
    val surname: String,
    val login: String,
    val password: String,
    val email: String,
    @Enumerated(EnumType.STRING)
    val role: Role,
    var point: Int,
    // todo Добавить изменяемый массив с наградами, которые купил пользователь
    @OneToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_rewards",
        joinColumns = [JoinColumn(name = "user_id", referencedColumnName = "id")],
        inverseJoinColumns = [JoinColumn(name = "rewards_id", referencedColumnName = "id")]
    )
    val rewards: MutableList<Reward> = mutableListOf()
) {
    constructor() : this(0,"", "","", "", "", Role.user, 0)
}

enum class Role {
    user, admin, manager
}