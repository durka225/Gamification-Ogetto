package com.example.test.repository

import com.example.test.model.Reward
import com.example.test.controller.exception.NotFoundException
import com.example.test.controller.rewards.RewardDeleteRequest
import org.springframework.data.jpa.repository.JpaRepository

import org.springframework.stereotype.Repository

@Repository
interface RewardRepository : JpaRepository<Reward, Long> {
    fun deleteRewardById(id: Int)

}