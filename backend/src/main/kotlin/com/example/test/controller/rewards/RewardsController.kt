package com.example.test.controller.rewards

import com.example.test.model.Reward
import com.example.test.repository.RewardRepository
import com.example.test.service.RewardService
import com.example.test.controller.exception.ApiRequestException
import com.example.test.controller.exception.NotFoundException
import com.test.example.controller.rewards.RewardCreatePointRequest
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag

import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader

import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity

import org.springframework.web.server.ResponseStatusException


@RestController
@RequestMapping("/api/rewards")
@Tag(name = "Управление наградами")
class RewardsController(
    private val rewardService: RewardService
) {

    @Operation(
        summary = "Получение списка всех наград",
        description = "Возвращает полный список всех доступных наград в системе с указанием их идентификатора, " +
                "названия, описания, стоимости и количества доступных экземпляров."
    )
    @GetMapping
    fun listAll(): List<RewardsResponse> =
        rewardService.findAllRewards()
            .map { it.toResponseReward() }

    @Operation(
        summary = "Добавление новой награды",
        description = "Создает новую награду в системе на основе предоставленных данных. " +
                "Проверяет корректность данных и уникальность названия награды. " +
                "При успешном создании возвращает данные созданной награды, иначе выбрасывает исключение."
    )
    @PostMapping("/add")
    fun createReward(
        @Parameter(description = "Данные новой награды, включая название, описание, стоимость и доступное количество")
        @RequestBody rewardRequest: RewardRequest
    ): RewardsResponse? =
        rewardService.createReward(
            reward = rewardRequest.toModel()
        )
            ?.toResponseReward()
            ?: throw ApiRequestException("Не удалосб создать награду.") // Bad Request

    @Operation(
        summary = "Удаление награды",
        description = "Удаляет награду по указанному идентификатору. " +
                "В случае успешного удаления возвращает статус 204 No Content. " +
                "Если награда не найдена, возвращает ошибку 404 Not Found."
    )
    @DeleteMapping("/delete")
    fun deleteReward(
        @Parameter(description = "Запрос на удаление награды, содержащий идентификатор награды")
        @RequestBody requestDelete: RewardDeleteRequest
    ): ResponseEntity<Boolean> {
        val success = rewardService.deleteByID(requestDelete)

        return if(success)
            ResponseEntity.noContent()
                .build()
        else
            throw NotFoundException("Не удалось найти награду.") // Not found
    }

    @Operation(
        summary = "Создание запроса на получение награды",
        description = "Создает новый запрос на получение награды пользователем. " +
                "Требуется аутентификация через токен. Система проверяет наличие достаточного количества баллов " +
                "у пользователя для получения запрашиваемой награды. " +
                "Возвращает true при успешном создании запроса, иначе false."
    )
    @PostMapping("/createPoint")
    fun createPoint(
        @Parameter(description = "Запрос на получение награды, содержащий идентификатор награды")
        @RequestBody requestCreatePoint: RewardCreatePointRequest,
        @Parameter(description = "JWT-токен авторизации в формате 'Bearer {token}'")
        @RequestHeader("Authorization") token: String
    ): Boolean {
        val updateToken = token.substringAfter("Bearer ")
        return rewardService.createPoint(requestCreatePoint, updateToken)
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