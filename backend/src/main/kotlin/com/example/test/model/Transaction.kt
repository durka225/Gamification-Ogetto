package com.example.test.model

data class Transaction (
    val id: Int,
    val date: String,
    val description: String,
    val type: TransactionType,

)

enum class TransactionType {
    Accrual,
    Deduction
}