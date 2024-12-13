package com.example.test.service


import com.example.test.controller.point.PointsRequest
import com.example.test.repository.UserRepository
import com.example.test.repository.PointRepository
import com.example.test.model.Transaction
import com.example.test.model.TransactionType
import com.example.test.model.Point

import org.springframework.stereotype.Service

import java.time.LocalDate
import java.time.format.DateTimeFormatter


@Service
class PointService(
    private val tokenService: TokenService,
    private val userDetailsService: CustomUserDetailsService,
    private val userRepository: UserRepository,
    private val transactionService: TransactionService,
    private val pointRepository: PointRepository
) {

    fun addApplication(application: Point, token: String): Boolean {
        val login = tokenService.extractLogin(token) ?: return false
        var updateApplication = application.copy (login = login)
        return pointRepository.addApplication(updateApplication)
    }

    fun removeApplication(id: Int): Boolean {
        return pointRepository.delApplicationById(id)
    }

    fun getAllApplications(): List<Point> = pointRepository.getAllApplications()

    fun changePoints(pointsRequest: PointsRequest, id: Int): String {
        val login = pointsRequest.login ?: return "Token is missing or null"
        val points = pointsRequest.points ?: return "Points are missing or null"
        val description = pointsRequest.description ?: return "Description is missing or null"
        
        // val login = tokenService.extractLogin(token) ?: return "Login is missing or null"
        val user = userRepository.findByLogin(login) ?: return "User not found for the given email"
    
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
            pointRepository.delApplicationById(id)
            return "Points successfully updated"
        }
    }

    fun getById(id: Int): Point? =
        pointRepository.findById(id)
    
}