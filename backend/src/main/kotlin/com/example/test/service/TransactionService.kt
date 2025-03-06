package com.example.test.service

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
    fun createTransaction(transaction: Transaction): Boolean =
        transactionRepository.addTransaction(transaction)

    fun findTransactionsUser(request: String): List<Transaction> {
        val uuid = userRepository.findByLogin(
            tokenService.extractLogin(request.substringAfter("Bearer "))
                ?: throw BadRequestException("Invalid token")
        )?.id
            // todo Изменить логику
        return transactionRepository.findAllTransactions().filter { it.idUser == 0 }
    }

    fun findById(id: Int): Transaction? =
        transactionRepository.findById(id)

    fun deleteByID(id: Int): Boolean =
        transactionRepository.deleteByID(id)
}