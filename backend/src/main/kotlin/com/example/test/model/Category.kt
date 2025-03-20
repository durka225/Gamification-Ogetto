package com.example.test.model

import jakarta.persistence.*

@Entity
@Table(name = "category")
data class Category (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    val category: String
    ) {
    constructor() : this(0, "")
}