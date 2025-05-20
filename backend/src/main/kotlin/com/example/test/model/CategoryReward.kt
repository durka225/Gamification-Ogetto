package com.example.test.model

import com.fasterxml.jackson.databind.deser.Deserializers
import jakarta.persistence.*

@Entity
@Table(name = "category_reward")
data class CategoryReward (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    val category: String,
    val description: String
) {
    constructor() : this(0, "", "")
}