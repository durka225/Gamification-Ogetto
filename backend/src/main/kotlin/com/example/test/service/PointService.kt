package com.example.test.service


import com.example.test.controller.point.PointsRequest
import com.example.test.repository.UserRepository
import com.example.test.model.Transaction
import com.example.test.model.TransactionType

import org.springframework.stereotype.Service

import java.time.LocalDate
import java.time.format.DateTimeFormatter


@Service
class PointService(
    private val tokenService: TokenService,
    private val userDetailsService: CustomUserDetailsService,
    private val userRepository: UserRepository,
    private val transactionService: TransactionService
) {


    fun changePoints(pointsRequest: PointsRequest): String {
        val token = pointsRequest.token ?: return "Token is missing or null"
        val points = pointsRequest.points ?: return "Points are missing or null"
        val description = pointsRequest.description ?: return "Description is missing or null"
    
        val email = tokenService.extractEmail(token) ?: return "Invalid token: unable to extract email"
        val user = userRepository.findByEmail(email) ?: return "User not found for the given email"
    
        if (user.point + points < 0) {
            return "Insufficient points: operation would result in negative balance"
        } else {
            val currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
            user.point += points
    
            val newTransaction = Transaction(
                id = 0,
                date = currentDate,
                description = description,
                type = if (points >= 0) TransactionType.Accrual else TransactionType.Deduction
            )
    
            transactionService.createTransaction(newTransaction)
            userRepository.updateUser(user.id, user)
            return "Points successfully updated"
        }
    }
    
}