package com.example.test.controller.user

import com.example.test.model.Reward

data class UserRequest(
    val name: String,
    val surname: String,
    val login: String,
    val password: String
)
