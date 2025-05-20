package com.example.test.model

import jakarta.persistence.*

@Entity
@Table(name = "reward")
data class Reward (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    val title: String,
    val description: String,
    val cost: Int,
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    val category: CategoryReward = CategoryReward(),
    var count: Int
) {
    constructor() : this(0, "", "", 0, CategoryReward(), 0)
}