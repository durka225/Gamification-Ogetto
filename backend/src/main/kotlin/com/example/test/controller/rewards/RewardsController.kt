package com.example.test.controller.rewards

import com.example.test.model.Reward
import com.example.test.repository.RewardRepository
import com.example.test.service.RewardService
import com.example.test.controller.exception.ApiRequestException
import com.example.test.controller.exception.NotFoundException
import com.example.test.model.CategoryReward
import com.example.test.model.Point
import com.test.example.controller.rewards.RewardCreatePointRequest
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag

import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.PathVariable

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
            reward = rewardRequest.toModel(), rewardRequest.categoryId
        )
            ?.toResponseReward()
            ?: throw ApiRequestException("Не удалось создать награду.") // Bad Request

    @Operation(
        summary = "Удаление награды по ID",
        description = "Удаляет награду по указанному идентификатору. " +
                "В случае успешного удаления возвращает статус 204 No Content. " +
                "Если награда не найдена, возвращает ошибку 404 Not Found."
    )
    @DeleteMapping("/{id}")
    fun deleteRewardById(
        @Parameter(description = "Идентификатор удаляемой награды")
        @PathVariable id: Int
    ): ResponseEntity<Boolean> {
        val success = rewardService.deleteReward(id)

        return if(success)
            ResponseEntity.noContent().build()
        else
            throw NotFoundException("Не удалось найти награду.")
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
    ): Point {
        val updateToken = token.substringAfter("Bearer ")
        return rewardService.createPoint(requestCreatePoint, updateToken)
    }

    @Operation(
        summary = "Создание новой категории наград",
        description = "Создает новую категорию наград с указанным названием и описанием. " +
                "Категории используются для группировки наград по типам или назначению. " +
                "Возвращает созданную категорию с присвоенным идентификатором."
    )
    @PostMapping("/newCategory")
    fun createCategory (
        @Parameter(description = "Данные новой категории наград, включая название и описание")
        @RequestBody newCategoryReward: CategoryRequest
    ): ResponseEntity<CategoryReward> = rewardService.createNewCategory(newCategoryReward)

    @Operation(
        summary = "Получение всех категорий наград",
        description = "Возвращает полный список всех доступных категорий наград в системе. " +
                "Категории используются для группировки наград по типам или назначению. " +
                "Если категории отсутствуют, возвращается пустой список со статусом 404 Not Found."
    )
    @GetMapping("/category")
    fun getAllCategory() : ResponseEntity<List<CategoryReward>> =
        rewardService.getAllCategory()

    @Operation(
        summary = "Редактирование награды",
        description = "Обновляет информацию о существующей награде по её идентификатору. " +
                "Позволяет обновлять только нужные поля (отправлять можно только те поля, которые требуют изменения). " +
                "Проверяет существование награды и корректность новых данных. " +
                "Возвращает обновленную награду при успешном обновлении, иначе выбрасывает исключение."
    )
    @PutMapping("/{id}")
    fun updateReward(
        @Parameter(description = "Идентификатор обновляемой награды")
        @PathVariable id: Int,
        @Parameter(description = "Данные для обновления награды (можно указать только необходимые поля)")
        @RequestBody rewardRequest: PartialRewardRequest
    ): RewardsResponse {
        val reward = Reward(
            id = id,
            title = rewardRequest.title ?: "",
            description = rewardRequest.description ?: "",
            cost = rewardRequest.cost ?: 0,
            count = rewardRequest.count ?: 0
        )
        val updatedReward = rewardService.updateReward(id, reward, rewardRequest.categoryId)
        return updatedReward.toResponseReward()
    }

    @Operation(
        summary = "Редактирование категории награды",
        description = "Обновляет информацию о существующей категории наград по её идентификатору. " +
                "Позволяет изменить название и описание категории. " +
                "Возвращает обновленную категорию при успешном обновлении."
    )
    @PutMapping("/category/{id}")
    fun updateCategory(
        @Parameter(description = "Идентификатор обновляемой категории")
        @PathVariable id: Long,
        @Parameter(description = "Новые данные категории. Можно указать только те поля, которые требуют изменения.")
        @RequestBody categoryRequest: CategoryRequest
    ): ResponseEntity<CategoryReward> {
        val updatedCategory = rewardService.updateCategory(id, categoryRequest)
        return ResponseEntity.ok(updatedCategory)
    }

    @Operation(
        summary = "Удаление категории награды",
        description = "Удаляет категорию наград по указанному идентификатору. " +
                "Проверяет, что категория не используется в существующих наградах. " +
                "В случае успешного удаления возвращает статус 204 No Content. " +
                "Если категория не найдена, возвращает ошибку 404 Not Found."
    )
    @DeleteMapping("/category/{id}")
    fun deleteCategory(
        @Parameter(description = "Идентификатор удаляемой категории")
        @PathVariable id: Long
    ): ResponseEntity<Boolean> {
        val success = rewardService.deleteCategory(id)
        
        return if(success)
            ResponseEntity.noContent().build()
        else
            throw NotFoundException("Не удалось найти категорию.")
    }

    fun Reward.toResponseReward(): RewardsResponse =
        RewardsResponse(
            id = this.id,
            title = this.title,
            description = this.description,
            cost = this.cost,
            category = this.category.category,
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