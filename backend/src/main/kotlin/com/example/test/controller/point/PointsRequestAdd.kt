package com.example.test.controller.point

import com.example.test.model.Reward

data class PointsRequestAdd (
    val points: Int?,
    val description: String?,
    val reward: Int? = null
)