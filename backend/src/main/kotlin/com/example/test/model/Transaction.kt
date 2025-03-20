package com.example.test.model

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "transaction")
data class Transaction (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    @ManyToOne
    val idUser: User,
    val date: String,
    val description: String,
    @Enumerated(EnumType.STRING)
    val type: TransactionType,
) {
    constructor() : this(0, User(), "", "", TransactionType.Accrual)
}

enum class TransactionType {
    Accrual,
    Deduction
}