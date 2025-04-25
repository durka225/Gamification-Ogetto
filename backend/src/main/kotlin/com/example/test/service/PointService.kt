package com.example.test.service


import com.example.test.repository.UserRepository
import com.example.test.repository.PointRepository
import com.example.test.repository.ActivityRepository
import com.example.test.model.Transaction
import com.example.test.model.TransactionType
import com.example.test.model.Point
import com.example.test.controller.exception.ApiRequestException
import com.example.test.controller.exception.NotFoundException
import com.example.test.controller.point.PointsRequestAdd
import com.example.test.model.Activity
import com.example.test.repository.RewardRepository
import jakarta.transaction.Transactional
import org.apache.coyote.BadRequestException
import org.springframework.boot.actuate.autoconfigure.wavefront.WavefrontProperties

import org.springframework.stereotype.Service

import java.time.LocalDate
import java.time.format.DateTimeFormatter


@Service
class PointService(
    private val tokenService: TokenService,
    private val userRepository: UserRepository,
    private val transactionService: TransactionService,
    private val pointRepository: PointRepository,
    private val rewardRepository: RewardRepository
) {

    @Transactional
    fun addApplication(application: PointsRequestAdd, token: String): Point {
        val login = tokenService.extractLogin(token)
            ?: throw ApiRequestException("Токен некорректный.") // Bad Request
        var newApplication = Point()
        if (application.reward != null) {
            val reward = rewardRepository.findById(application.reward!!.toLong()).orElseThrow {
                throw NotFoundException("Награда с ID ${application.reward!!.toLong()} не найдена")
            }
            newApplication = Point(
                id = 0,
                login = userRepository.findByLogin(login)
                    ?: throw NotFoundException("Пользователь с логином ${login} не найден"),
                points = application.points,
                description = application.description,
                idReward = reward
            )
        } else {
            newApplication = Point(
                id = 0,
                login = userRepository.findByLogin(login) ?: throw NotFoundException("Пользователь не найден по указанному логину: $login."),
                points = application.points,
                description = application.description
            )
        }
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
        val points = pointsRequest.points 
                ?: throw ApiRequestException("Баллы отсутствуют или равны null.") // Bad Request
        val description = pointsRequest.description 
                ?: throw ApiRequestException("Описание отсутствует или равно null.") // Bad Request
        var idReward = pointsRequest.idReward
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


        if (idReward != null ) {
            if (idReward.count > 0) {
                idReward?.count = idReward?.count?.minus(1)!!
                rewardRepository.save(idReward)
                pointsRequest.login.rewards.add(idReward)
            } else {
                throw BadRequestException("Недостаточно наград")
            }
        }
    
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
    @Transactional
    fun addCompletedActivitiesRequest(activity: Activity) {
        activity.users.forEach { user ->
            val newPoint = Point (
                id = 0,
                login = user,
                points = activity.reward,
                description = "Участие в активности"
            )
            pointRepository.save(newPoint)
        }
    }
}