package com.example.test.controller.rewards

data class RewardRequest (
    val id: Int,
    val title: String,
    val description: String,
    val cost: Int,
    val count: Int
)