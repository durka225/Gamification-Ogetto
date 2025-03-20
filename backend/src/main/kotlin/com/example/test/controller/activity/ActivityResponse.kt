package com.example.test.controller.activity

import com.example.test.controller.user.UserResponse
import com.example.test.model.Category
import org.springframework.cglib.core.Local
import java.time.LocalDate
import java.time.LocalDateTime

class ActivityResponse (
    val id: Int,
    val title: String,
    val reward: Int,
    val category: Category,
    val users: MutableList<UserResponse>,
    val dateStart: LocalDateTime,
    val dateEnd: LocalDateTime
)