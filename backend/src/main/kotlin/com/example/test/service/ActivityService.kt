package com.example.test.service

import com.example.test.controller.activity.ActivityCategoryResponse
import com.example.test.controller.activity.ActivityUserResponse
import com.example.test.controller.activity.CategoryActivityRequest
import com.example.test.controller.activity.CategoryActivityUpdateRequest
import com.example.test.repository.ActivityRepository
import com.example.test.repository.UserRepository
import com.example.test.model.Activity
import com.example.test.model.ActivityEnd
import com.example.test.controller.activity.ActivityRequest
import com.example.test.controller.activity.ActivityResponse
import com.example.test.controller.exception.NotFoundException
import com.example.test.controller.exception.ApiRequestException
import com.example.test.controller.user.UserResponse
import com.example.test.model.CategoryActivity
import com.example.test.model.User
import com.example.test.repository.ActivityEndRepository
import com.example.test.repository.CategoryActivityRepository
import jakarta.transaction.Transactional

import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class ActivityService(
    private val activityRepository: ActivityRepository,
    private val activityEndRepository: ActivityEndRepository,
    private val userRepository: UserRepository,
    private val categoryActivityRepository: CategoryActivityRepository,
    private val pointService: PointService
) {

    @Transactional
    fun getAllActivities(): List<ActivityResponse> {
        val activities = activityRepository.findAll().toMutableList()
        val expiredActivities = activities.filter { it.dateEnd.isBefore(LocalDateTime.now()) }

        expiredActivities.forEach { activity ->
            val activityEnd = ActivityEnd(
                id = 0,
                title = activity.title,
                category = activity.category
            )
            pointService.addCompletedActivitiesRequest(activity)
            activityEndRepository.save(activityEnd)
            activityRepository.delete(activity)
        }

        activities.removeAll(expiredActivities)
        return activities.map { activity ->
            ActivityResponse(
                id = activity.id,
                title = activity.title,
                category = ActivityCategoryResponse(
                    id = activity.category.id,
                    category = activity.category.category
                ),
                reward = activity.reward,
                users = activity.users.map { user ->
                    ActivityUserResponse(
                        id = user.id,
                        name = user.name,
                        surname = user.surname
                    )
                },
                dateStart = activity.dateStart,
                dateEnd = activity.dateEnd
            )
        }
    }

    @Transactional
    fun getAllActivitiesEnd(): List<ActivityEnd> {
        getAllActivities()
        return activityEndRepository.findAll()
    }


    @Transactional
    fun createActivity(activity: ActivityRequest): Activity =
        activityRepository.save(activity.toModelActivity())

    @Transactional
    fun updateActivity(id: Int, request: ActivityRequest): Activity {
        val activity = activityRepository.findById(id.toLong()).orElseThrow {
            NotFoundException("Активность с ID $id не найдена.")
        }

        // Определяем категорию (новую или существующую)
        val category = if (request.category_id != null) {
            categoryActivityRepository.findById(request.category_id!!.toLong()).orElseThrow {
                NotFoundException("Категория с ID ${request.category_id} не существует")
            }
        } else {
            activity.category
        }

        // Создаем обновленную активность, используя значения из запроса или существующие
        val updatedActivity = activity.copy(
            title = request.title ?: activity.title,
            category = category,
            reward = request.reward ?: activity.reward,
            dateStart = request.dateStart ?: activity.dateStart,
            dateEnd = request.dateEnd ?: activity.dateEnd
        )

        return activityRepository.save(updatedActivity)
    }

    @Transactional
    fun addNewCategory(categoryRequest: CategoryActivityRequest): CategoryActivity =
        categoryActivityRepository.save(CategoryActivity(0, categoryRequest.nameCategory))

    fun getAllCategory(): List<CategoryActivity> =
        categoryActivityRepository.findAll()

    @Transactional
    fun deleteActivity(id: Int): Boolean {
        val activity = activityRepository.findById(id.toLong()).orElseThrow {
            NotFoundException("Активность с ID $id не найдена")
        }
        activityRepository.delete(activity)
        return true
    }

    @Transactional
    fun deleteCategoryActivity(id: Long): Boolean {
        val category = categoryActivityRepository.findById(id).orElseThrow {
            NotFoundException("Категория с ID $id не найдена")
        }

        // Проверяем использование категории в активностях
        val activities = activityRepository.findAll()
        if (activities.any { it.category.id.toLong() == id }) {
            throw ApiRequestException("Невозможно удалить категорию, которая используется в активностях")
        }

        categoryActivityRepository.delete(category)
        return true
    }

    @Transactional
    fun updateCategory(id: Long, updateRequest: CategoryActivityUpdateRequest): CategoryActivity {
        val categoryActivity = categoryActivityRepository.findById(id).orElseThrow {
            throw NotFoundException("Категория с ID $id не найдена!")
        }
        
        // Создаем обновленную категорию, используя значения из запроса
        val updatedCategory = categoryActivity.copy(
            category = updateRequest.nameCategory.takeIf { it.isNotBlank() } ?: categoryActivity.category
        )
        
        return categoryActivityRepository.save(updatedCategory)
    }

    fun ActivityRequest.toModelActivity(id: Int? = 0, users: MutableList<User>? = mutableListOf()): Activity {
        val existingActivity = if (id != 0) {
            id?.let { activityRepository.findById(it.toLong()).orElse(null) }
        } else null

        return Activity(
            id = id ?: 0,
            title = this.title ?: existingActivity?.title ?: "",
            category = if (this.category_id != null)
                categoryActivityRepository.findById(this.category_id!!.toLong()).orElseThrow {
                    NotFoundException("Категория с ID ${this.category_id} не существует")
                }
            else existingActivity?.category ?: throw NotFoundException("Категория не указана"),
            reward = this.reward ?: existingActivity?.reward ?: 0,
            users = users ?: mutableListOf(),
            dateStart = this.dateStart ?: existingActivity?.dateStart ?: LocalDateTime.now(),
            dateEnd = this.dateEnd ?: existingActivity?.dateEnd ?: LocalDateTime.now().plusDays(1),
        )
    }

}