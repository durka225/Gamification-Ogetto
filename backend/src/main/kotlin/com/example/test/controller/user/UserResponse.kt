package com.example.test.controller.user

import com.example.test.model.Role

data class UserResponse(
    val id: Int,
    val name: String,
    val surname: String,
    val login: String,
    val role: Role,
    val point: Int,
    val rewards: List<SimpleRewardResponse> = listOf()
)
