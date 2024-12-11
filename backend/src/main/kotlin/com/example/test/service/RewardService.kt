package com.example.test.service

import org.springframework.stereotype.Service
import com.example.test.repository.RewardRepository
import com.example.test.model.Reward
import com.example.test.controller.rewards.RewardDeleteRequest

@Service
class RewardService(
    private val rewardRepository: RewardRepository
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
}