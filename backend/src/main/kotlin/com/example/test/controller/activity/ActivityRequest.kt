package com.example.test.controller.activity

import java.time.LocalDateTime

data class ActivityRequest(
    val title: String?,
    val reward: Int?,
    val category_id: Int?,
    val dateStart: LocalDateTime?,
    val dateEnd: LocalDateTime?
)