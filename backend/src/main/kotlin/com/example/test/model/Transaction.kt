package com.example.test.model

import java.util.UUID

data class Transaction (
    val id: Int,
    val idUser: Int,
    val date: String,
    val description: String,
    val type: TransactionType,

)

enum class TransactionType {
    Accrual,
    Deduction
}