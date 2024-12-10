package com.example.test.service

import org.springframework.stereotype.Service
import com.example.test.repository.TransactionRepository
import com.example.test.model.Transaction

@Service
class TransactionService(
    private val transactionRepository: TransactionRepository
) {
    fun createTransaction(transaction: Transaction): Boolean =
        transactionRepository.addTransaction(transaction)

    fun findAllTransactions(): List<Transaction> =
        transactionRepository.findAllTransactions()

    fun findById(id: Int): Transaction? =
        transactionRepository.findById(id)

    fun deleteByID(id: Int): Boolean =
        transactionRepository.deleteByID(id)
}