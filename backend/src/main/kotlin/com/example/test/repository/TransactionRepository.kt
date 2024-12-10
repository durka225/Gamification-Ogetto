package com.example.test.repository

import org.springframework.stereotype.Repository
import com.example.test.model.Transaction
import com.example.test.model.TransactionType

@Repository
class TransactionRepository() {

    private val Transactions = mutableListOf<Transaction>(
        Transaction(
            id = 0,
            date = "2024-12-10",
            description = "Invent",
            type = TransactionType.Accrual
        ),
        Transaction(
            id = 1,
            date = "2024-10-12",
            description = "Invent",
            type = TransactionType.Accrual
        ),
        Transaction(
            id = 2,
            date = "2024-12-11",
            description = "Invent",
            type = TransactionType.Accrual
        ),
        Transaction(
            id = 3,
            date = "2024-11-12",
            description = "Invent",
            type = TransactionType.Accrual
        ),
        Transaction(
            id = 4,
            date = "2024-11-20",
            description = "Invent",
            type = TransactionType.Accrual
        )
    )

    fun addTransaction(transaction: Transaction): Boolean {
        val maxId = Transactions.maxOfOrNull { it.id } ?: 0
        val newTransaction = transaction.copy(id = maxId + 1)
        return Transactions.add(newTransaction)
    }

    fun findAllTransactions(): List<Transaction> = Transactions

    fun findById(id: Int): Transaction? =
        Transactions.firstOrNull { it.id == id }


    fun deleteByID(Request: Int): Boolean {
        val foundTransaction = findById(Request)
        
        return foundTransaction?.let {
            Transactions.remove(it)
        } ?: false
    }

}