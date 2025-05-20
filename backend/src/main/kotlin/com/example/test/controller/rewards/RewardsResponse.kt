package com.example.test.controller.rewards

data class RewardsResponse(
    val id: Int,
    val title: String,
    val description: String,
    val category: String,
    val cost: Int,
    val count: Int
)