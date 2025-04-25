package com.example.test.controller.user

import com.example.test.model.Reward

data class UserResponse(
    val id: Int,
    val login: String,
    val point: Int,
    val rewards: MutableList<Reward> = mutableListOf()
)
