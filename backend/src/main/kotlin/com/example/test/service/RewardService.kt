package com.example.test.service

import org.springframework.stereotype.Service
import com.example.test.repository.RewardRepository
import com.example.test.model.Reward
import com.example.test.model.Point
import com.example.test.controller.rewards.RewardDeleteRequest
import com.test.example.controller.rewards.RewardCreatePointRequest

import com.example.test.service.PointService

@Service
class RewardService(
    private val rewardRepository: RewardRepository,
    private val pointService: PointService
) {
    fun createReward(reward: Reward): Reward? {
        return if (rewardRepository.addReward(reward)) {
            reward
        } else null
    }

    fun findAllRewards(): List<Reward> =
        rewardRepository.findAllRewards()

    fun findById(id: Int): Reward? =
        rewardRepository.findById(id)

    fun deleteByID(id: RewardDeleteRequest): Boolean =
        rewardRepository.deleteByID(id)

    fun createPoint(request: RewardCreatePointRequest, token: String): Boolean {
        val reward = findById(request.idReward)
        val newPoint = Point(
            id = 0,
            login = null,
            points = (reward!!.cost)*(-1),
            description = reward.title
        )

        return pointService.addApplication(newPoint, token)
    }
}