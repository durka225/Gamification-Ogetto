package com.example.test.controller.user

data class TransactionResponse(
    val id: Int,
    val date: String,
    val description: String,
    val type: String
)