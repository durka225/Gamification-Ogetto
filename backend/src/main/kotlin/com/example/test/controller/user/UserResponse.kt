package com.example.test.controller.user

import java.util.UUID

data class UserResponse(
    val uuid: UUID,
    val email: String,
)
