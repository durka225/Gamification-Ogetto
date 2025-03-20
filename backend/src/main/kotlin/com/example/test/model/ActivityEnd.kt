package com.example.test.model

import jakarta.persistence.*

@Entity
@Table(name = "activity_end")
data class ActivityEnd (
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    val id: Int,
    val title: String,
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "point_id", nullable = false)
    val category: Category
) {
    constructor() : this(0, "", Category())
}