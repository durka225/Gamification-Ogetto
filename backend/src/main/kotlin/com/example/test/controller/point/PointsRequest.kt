package com.example.test.controller.point

import com.example.test.model.User

data class PointsRequest (
    val login: String,
    val points: Int?,
    val description: String?
)