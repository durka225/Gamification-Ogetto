package com.example.test.model

import java.time.LocalDateTime

data class Activity (
    val id: Int,
    val title: String,
    val category: String,
    val reward: Int,
    val dateStart: LocalDateTime,
    val dateEnd: LocalDateTime
)