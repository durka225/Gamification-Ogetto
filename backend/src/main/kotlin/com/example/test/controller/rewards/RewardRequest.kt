package com.example.test.controller.rewards

import com.example.test.model.CategoryReward

data class RewardRequest (
    val id: Int,
    val title: String,
    val description: String,
    val categoryId: Long,
    val cost: Int,
    val count: Int
)