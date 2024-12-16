package com.example.test.service


import com.example.test.controller.point.PointsRequest
import com.example.test.repository.UserRepository
import com.example.test.repository.PointRepository
import com.example.test.repository.ActivityRepository
import com.example.test.model.Transaction
import com.example.test.model.TransactionType
import com.example.test.model.Point
import com.example.test.model.ActivityEnd
import com.example.test.controller.activity.ActivitiesWithUsers 
import com.example.test.controller.activity.ActivityStatus
import com.example.test.controller.exception.ApiRequestException
import com.example.test.controller.exception.NotFoundException

import org.springframework.stereotype.Service

import java.time.LocalDate
import java.time.format.DateTimeFormatter


@Service
class PointService(
    private val tokenService: TokenService,
    private val activityService: ActivityService,
    private val userDetailsService: CustomUserDetailsService,
    private val userRepository: UserRepository,
    private val transactionService: TransactionService,
    private val pointRepository: PointRepository,
    private val activityRepository: ActivityRepository
) {

    fun addApplication(application: Point, token: String): Boolean {
        val login = tokenService.extractLogin(token) 
            ?: throw ApiRequestException("Токен некорректный.") // Bad Request
        var updateApplication = application.copy (login = login)
        return pointRepository.addApplication(updateApplication)
    }

    fun removeApplication(id: Int): Boolean {
        return pointRepository.delApplicationById(id)
    }

    fun getAllApplications(): List<Point> = pointRepository.getAllApplications()

    fun changePoints(pointsRequest: PointsRequest, id: Int): String {
        val login = pointsRequest.login 
                ?: throw ApiRequestException("Токен отсутствует или равен null.") // Bad Request
        val points = pointsRequest.points 
                ?: throw ApiRequestException("Баллы отсутствуют или равны null.") // Bad Request
        val description = pointsRequest.description 
                ?: throw ApiRequestException("Описание отсутствует или равно null.") // Bad Request
    
        val user = userRepository.findByLogin(login) 
                ?: throw NotFoundException("Пользователь не найден по указанному логину: $login.") // Not Found

    
        if (user.point + points < 0) {
            throw ApiRequestException("Недостаточно баллов: операция приведет к отрицательному балансу.") // Bad Request
        }
    
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
    
        return "Баллы пользователя успешно обновлены."
    }
    

    fun getById(id: Int): Point? =
        pointRepository.findById(id)

    fun addCompletedActivitiesRequest(): Boolean {
        val activityEnds = activityService.getAllActivitiesEnd()
        val activityWithUser = activityService.getAllActivitiesWithUsers()

        activityEnds.forEach { activityEnd ->
            activityWithUser.forEach { activityWithUsers ->
                
                    if (activityEnd.id == activityWithUsers.activity.id &&
                        activityWithUsers.status == ActivityStatus.NotProcessed) {
                        activityWithUsers.users.forEach { Users -> 
                            val foundLogin = userRepository.findByUUID(Users.userId)!!.login
                            val application = Point (
                                id = 0,
                                login = foundLogin,
                                points = activityWithUsers.activity.reward,
                                description = activityWithUsers.activity.title
                            )
                            pointRepository.addApplication(application)
                    }
                    activityRepository.updateActivityStatus(activityWithUsers.activity.id, ActivityStatus.Processed)
                }
            }
        }
        return true
    }
}