package com.example.test.controller.point

data class PointsRequestAdd (
    val token: String,
    val points: Int?,
    val description: String?
)