package com.example.test.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "activity")
data class Activity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    val title: String,
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    val category: Category,
    val reward: Int,
    @OneToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "activities",
        joinColumns = [JoinColumn(name = "activity_id", referencedColumnName = "id")],
        inverseJoinColumns = [JoinColumn(name = "user_id", referencedColumnName = "id")]
    )
    val users: MutableList<User>,
    val dateStart: LocalDateTime,
    val dateEnd: LocalDateTime
) {
    constructor() : this(0, "", Category(), 0, mutableListOf(), LocalDateTime.now(), LocalDateTime.now())
}