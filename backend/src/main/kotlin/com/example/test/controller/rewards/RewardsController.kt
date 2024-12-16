package com.example.test.controller.rewards

import com.example.test.model.Reward
import com.example.test.repository.RewardRepository
import com.example.test.service.RewardService
import com.example.test.controller.exception.ApiRequestException
import com.example.test.controller.exception.NotFoundException


import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.RequestBody

import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity

import org.springframework.web.server.ResponseStatusException


@RestController
@RequestMapping("/api/rewards")
class RewardsController(
    private val rewardService: RewardService
) {

    @GetMapping
    fun listAll(): List<RewardsResponse> =
        rewardService.findAllRewards()
            .map { it.toResponseReward() }

    @PostMapping("/add")
    fun createReward(@RequestBody rewardRequest: RewardRequest): RewardsResponse? =
        rewardService.createReward(
            reward = rewardRequest.toModel()
        )
            ?.toResponseReward()
            ?: throw ApiRequestException("Не удалосб создать награду.") // Bad Request
            
    @DeleteMapping("/delete")
    fun deleteReward(@RequestBody requestDelete: RewardDeleteRequest): ResponseEntity<Boolean> {
        val success = rewardService.deleteByID(requestDelete)

        return if(success)
            ResponseEntity.noContent()
                .build()
        else
            throw NotFoundException("Не удалось найти награду.") // Not found
    }


    fun Reward.toResponseReward(): RewardsResponse =
        RewardsResponse(
            id = this.id,
            title = this.title,
            description = this.description,
            cost = this.cost,
            count = this.count
        )

    private fun RewardRequest.toModel(): Reward =
        Reward(
            id = this.id,
            title = this.title,
            description = this.description,
            cost = this.cost,
            count = this.count
        )
}

