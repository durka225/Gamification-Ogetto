package com.example.test.controller.activity

import java.time.LocalDateTime

/**
 * Модель ответа для активностей с упрощенной информацией
 */
data class ActivityResponse(
    val id: Int,
    val title: String,
    val reward: Int,
    val category: ActivityCategoryResponse,
    val users: List<ActivityUserResponse>,
    val dateStart: LocalDateTime,
    val dateEnd: LocalDateTime
)