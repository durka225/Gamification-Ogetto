package com.example.test.repository

import com.example.test.model.Transaction
import com.example.test.model.TransactionType
import com.example.test.controller.exception.NotFoundException
import org.springframework.data.jpa.repository.JpaRepository

import org.springframework.stereotype.Repository

@Repository
interface TransactionRepository : JpaRepository<Transaction, Long> {
    fun findTransactionById(id: Int): Transaction?
    fun deleteTransactionsById(id: Int)

}