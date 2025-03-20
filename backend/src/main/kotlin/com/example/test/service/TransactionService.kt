package com.example.test.service

import com.example.test.controller.exception.NotFoundException
import org.springframework.stereotype.Service
import com.example.test.repository.TransactionRepository
import com.example.test.model.Transaction
import com.example.test.repository.UserRepository
import org.apache.coyote.BadRequestException

@Service
class TransactionService(
    private val transactionRepository: TransactionRepository,
    private val userRepository: UserRepository,
    private val tokenService: TokenService
) {
    fun createTransaction(transaction: Transaction): Transaction =
        transactionRepository.save(transaction)

    fun findTransactionsUser(request: String): List<Transaction> {
        val id = userRepository.findByLogin(
            tokenService.extractLogin(request.substringAfter("Bearer "))
                ?: throw BadRequestException("Некорректный токен")
        )
        return transactionRepository.findAll().filter { it.idUser == id }
    }

    fun findById(id: Int): Transaction? =
        transactionRepository.findTransactionById(id)
            ?: throw NotFoundException("Транзакция с ID $id не найдена.")

    fun deleteByID(id: Int): Boolean {
        transactionRepository.deleteTransactionsById(id)
        return true
    }

}