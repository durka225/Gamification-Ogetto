package com.example.test.controller.user

import com.example.test.model.Reward

data class UserRequest(
    val login: String,
    val password: String,
    val email: String
)
