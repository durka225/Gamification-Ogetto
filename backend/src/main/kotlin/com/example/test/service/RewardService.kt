package com.example.test.service

import com.example.test.controller.exception.NotFoundException
import com.example.test.controller.point.PointsRequestAdd
import org.springframework.stereotype.Service
import com.example.test.repository.RewardRepository
import com.example.test.model.Reward
import com.example.test.model.Point
import com.example.test.controller.rewards.RewardDeleteRequest
import com.example.test.repository.UserRepository
import com.test.example.controller.rewards.RewardCreatePointRequest
import jakarta.transaction.Transactional

import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException

@Service
class RewardService(
    private val rewardRepository: RewardRepository,
    private val pointService: PointService,
    private val tokenService: TokenService,
    private val userRepository: UserRepository
) {
    @Transactional
    fun createReward(reward: Reward): Reward? {
        return rewardRepository.save(reward)
    }

    fun findAllRewards(): List<Reward> =
        rewardRepository.findAll()

    fun findById(id: Int): Reward =
        rewardRepository.findById(id.toLong()).orElseThrow {
            NotFoundException("Награда с ID $id не найдена.")
        }

    @Transactional
    fun deleteByID(id: RewardDeleteRequest): Boolean {
        rewardRepository.deleteRewardById(id.id)
        return true
    }

    // todo Переделать логику, чтобы ещё сохранялся ID при создании заявки
    @Transactional
    fun createPoint(request: RewardCreatePointRequest, token: String): Point {
        val reward = findById(request.idReward)
        val newPoint = PointsRequestAdd(
            points = (reward!!.cost)*(-1),
            description = reward.title,
            reward = request.idReward
        )

        return pointService.addApplication(newPoint, token)
    }
}