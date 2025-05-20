package com.example.test.service

import com.example.test.controller.exception.NotFoundException
import com.example.test.controller.point.PointsRequestAdd
import com.example.test.controller.rewards.CategoryRequest
import org.springframework.stereotype.Service
import com.example.test.repository.RewardRepository
import com.example.test.model.Reward
import com.example.test.model.Point
import com.example.test.controller.rewards.RewardDeleteRequest
import com.example.test.model.CategoryReward
import com.example.test.repository.CategoryRewardRepository
import com.example.test.repository.UserRepository
import com.test.example.controller.rewards.RewardCreatePointRequest
import jakarta.transaction.Transactional

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.server.ResponseStatusException
import kotlin.text.category

@Service
class RewardService(
    private val rewardRepository: RewardRepository,
    private val pointService: PointService,
    private val tokenService: TokenService,
    private val userRepository: UserRepository,
    private val categoryRewardRepository: CategoryRewardRepository
) {
    @Transactional
    fun createReward(reward: Reward, categoryId: Long): Reward? {
        val categoryReward = categoryRewardRepository.findById(categoryId).orElseThrow {
            throw NotFoundException("Категория с ID $categoryId не найдена!")
        }
        val update = reward.copy(category = categoryReward)
        return rewardRepository.save(update)
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

    fun createNewCategory(newCategoryReward: CategoryRequest): ResponseEntity<CategoryReward> {
        val categoryReward = CategoryReward(
            category = newCategoryReward.category, 
            description = newCategoryReward.description ?: ""
        )
        val savedCategoryReward = categoryRewardRepository.save(categoryReward)
        return ResponseEntity.ok(savedCategoryReward)
    }

    fun getAllCategory(): ResponseEntity<List<CategoryReward>> {
        val categories = categoryRewardRepository.findAll()
        return if (categories.isNotEmpty()) {
            ResponseEntity.ok(categories)
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(emptyList())
        }
    }

    @Transactional
    fun updateReward(id: Int, reward: Reward, categoryId: Long?): Reward {
        // Получаем существующую награду
        val existingReward = rewardRepository.findById(id.toLong()).orElseThrow {
            throw NotFoundException("Награда с ID $id не найдена!")
        }
        
        // Определяем категорию (новую или существующую)
        val category = if (categoryId != null) {
            categoryRewardRepository.findById(categoryId).orElseThrow {
                throw NotFoundException("Категория с ID $categoryId не найдена!")
            }
        } else {
            existingReward.category
        }
        
        // Создаем обновленную награду, используя значения из запроса или существующие
        val updatedReward = existingReward.copy(
            title = reward.title.takeIf { it.isNotBlank() } ?: existingReward.title,
            description = reward.description.takeIf { it.isNotBlank() } ?: existingReward.description,
            cost = reward.cost.takeIf { it != 0 } ?: existingReward.cost,
            count = reward.count.takeIf { it >= 0 } ?: existingReward.count,
            category = category
        )
        
        return rewardRepository.save(updatedReward)
    }

    @Transactional
    fun updateCategory(id: Long, categoryRequest: CategoryRequest): CategoryReward {
        val categoryReward = categoryRewardRepository.findById(id).orElseThrow {
            throw NotFoundException("Категория с ID $id не найдена!")
        }
        
        // Создаем обновленную категорию, используя значения из запроса или существующие
        val updatedCategory = categoryReward.copy(
            category = categoryRequest.category.takeIf { it.isNotBlank() } ?: categoryReward.category,
            description = categoryRequest.description?.takeIf { it.isNotBlank() } ?: categoryReward.description
        )
        
        return categoryRewardRepository.save(updatedCategory)
    }

    @Transactional
    fun deleteCategory(id: Long): Boolean {
        val categoryReward = categoryRewardRepository.findById(id).orElseThrow {
            throw NotFoundException("Категория с ID $id не найдена!")
        }
        
        // Проверяем, используется ли категория в каких-либо наградах
        val rewards = rewardRepository.findAll()
        if (rewards.any { it.category.id.toLong() == id }) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Невозможно удалить категорию, так как она используется в наградах")
        }
        
        categoryRewardRepository.delete(categoryReward)
        return true
    }

    @Transactional
    fun deleteReward(id: Int): Boolean {
        rewardRepository.findById(id.toLong()).orElseThrow {
            throw NotFoundException("Награда с ID $id не найдена!")
        }
        rewardRepository.deleteRewardById(id)
        return true
    }
}