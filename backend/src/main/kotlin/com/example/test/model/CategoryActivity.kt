package com.example.test.model

import jakarta.persistence.*

@Entity
@Table(name = "category_activity")
data class CategoryActivity (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    val category: String
    ) {
    constructor() : this(0, "")
}