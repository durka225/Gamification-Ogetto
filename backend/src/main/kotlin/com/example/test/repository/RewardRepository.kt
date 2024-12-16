package com.example.test.repository

import com.example.test.model.Reward
import com.example.test.controller.exception.NotFoundException
import com.example.test.controller.rewards.RewardDeleteRequest

import org.springframework.stereotype.Repository

@Repository
class RewardRepository() {
    private val rewards = mutableListOf<Reward>(
        Reward(
            id = 0,
            title = "First reward",
            description = "Unlock the first special feature",
            cost = 100,
            count = 10
        ),
        Reward(
            id = 1,
            title = "Secound reward",
            description = "Unlock the secound special feature",
            cost = 150,
            count = 8
        ),
        Reward(
            id = 2,
            title = "Thrid reward",
            description = "Unlock the thrid special feature",
            cost = 300,
            count = 15
        ),
    )

    fun addReward(reward: Reward): Boolean {
        val maxId = rewards.maxOfOrNull { it.id } ?: -1
        val newReward = reward.copy(id = maxId + 1)
        return rewards.add(newReward)
    }

    fun findAllRewards(): List<Reward> = rewards

    fun findById(id: Int): Reward? =
        rewards.firstOrNull { it.id == id }

    fun deleteByID(Request: RewardDeleteRequest): Boolean {
        val foundReward = findById(Request.id)
        
        return foundReward?.let {
            rewards.remove(it)
        } ?: throw NotFoundException("Награда с указанным ID (${Request.id}) не найдена.") // Not Found
    }
}