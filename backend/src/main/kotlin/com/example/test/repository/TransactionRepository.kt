package com.example.test.repository

import com.example.test.model.Transaction
import com.example.test.model.TransactionType
import com.example.test.controller.exception.NotFoundException

import org.springframework.stereotype.Repository


@Repository
class TransactionRepository() {

    private val Transactions = mutableListOf<Transaction>(
        Transaction(
            id = 0,
            idUser = 0,
            date = "2024-12-10",
            description = "Invent",
            type = TransactionType.Accrual
        ),
        Transaction(
            id = 1,
            idUser = 0,
            date = "2024-10-12",
            description = "Invent",
            type = TransactionType.Accrual
        ),
        Transaction(
            id = 2,
            idUser = 0,
            date = "2024-12-11",
            description = "Invent",
            type = TransactionType.Accrual
        ),
        Transaction(
            id = 3,
            idUser = 0,
            date = "2024-11-12",
            description = "Invent",
            type = TransactionType.Accrual
        ),
        Transaction(
            id = 4,
            idUser = 0,
            date = "2024-11-20",
            description = "Invent",
            type = TransactionType.Accrual
        )
    )

    fun addTransaction(transaction: Transaction): Boolean {
        val maxId = Transactions.maxOfOrNull { it.id } ?: -1
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
        } ?: throw NotFoundException("Награда с указанным ID (${Request}) не найдена.") // Not Found
    }

}