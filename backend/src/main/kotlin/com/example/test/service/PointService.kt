package com.example.test.service


import com.example.test.controller.point.PointsRequest
import com.example.test.repository.UserRepository
import com.example.test.repository.PointRepository
import com.example.test.repository.ActivityRepository
import com.example.test.model.Transaction
import com.example.test.model.TransactionType
import com.example.test.model.Point
import com.example.test.model.ActivityEnd
import com.example.test.controller.exception.ApiRequestException
import com.example.test.controller.exception.NotFoundException
import com.example.test.controller.point.PointsRequestAdd
import jakarta.transaction.Transactional

import org.springframework.stereotype.Service

import java.time.LocalDate
import java.time.format.DateTimeFormatter


@Service
class PointService(
    private val tokenService: TokenService,
    private val activityService: ActivityService,
    private val userRepository: UserRepository,
    private val transactionService: TransactionService,
    private val pointRepository: PointRepository,
    private val activityRepository: ActivityRepository
) {

    @Transactional
    fun addApplication(application: PointsRequestAdd, token: String): Point {
        val login = tokenService.extractLogin(token)
            ?: throw ApiRequestException("Токен некорректный.") // Bad Request
        val newApplication = Point(
            id = 0,
            login = userRepository.findByLogin(login) ?: throw NotFoundException("Пользователь не найден по указанному логину: $login."),
            points = application.points,
            description = application.description
        )
        return pointRepository.save(newApplication)
    }

    @Transactional
    fun removeApplication(id: Int): Boolean {
        pointRepository.deletePointsById(id)
        return true
    }

    fun getAllApplications(): List<Point> = pointRepository.findAll()

    @Transactional
    fun changePoints(id: Int): String {
        val pointsRequest = pointRepository.findById(id).orElseThrow {
            NotFoundException("Заявка с ID $id не найдена.")
        }
        val login = pointsRequest.login
        val points = pointsRequest.points 
                ?: throw ApiRequestException("Баллы отсутствуют или равны null.") // Bad Request
        val description = pointsRequest.description 
                ?: throw ApiRequestException("Описание отсутствует или равно null.") // Bad Request

        if (pointsRequest.login.point + points < 0) {
            throw ApiRequestException("Недостаточно баллов: операция приведет к отрицательному балансу.") // Bad Request
        }
    
        val currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
        pointsRequest.login.point += points
    
        val newTransaction = Transaction(
            id = 0,
            idUser = pointsRequest.login,
            date = currentDate,
            description = description,
            type = if (points >= 0) TransactionType.Accrual else TransactionType.Deduction
        )
    
        transactionService.createTransaction(newTransaction)
        userRepository.save(pointsRequest.login)
        pointRepository.deletePointsById(id)
    
        return "Баллы пользователя успешно обновлены."
    }


    fun getById(id: Int): Point? =
        pointRepository.findById(id).orElseThrow {
            NotFoundException("Заявка с ID ${id} не найдена")
        }


    // todo Переделать метод для создания заявок автоматически после конца активности
    /*fun addCompletedActivitiesRequest(): Boolean {
        val activityEnds = activityService.getAllActivitiesEnd()
        val activityWithUser = activityService.getAllActivitiesWithUsers()

        activityEnds.forEach { activityEnd ->
            activityWithUser.forEach { activityWithUsers ->

                    if (activityEnd.id == activityWithUsers.activity.id &&
                        activityWithUsers.status == ActivityStatus.NotProcessed) {
                        activityWithUsers.users.forEach { users ->
                            val foundLogin = userRepository.findById(users.userId)!!.login
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
    }*/
}