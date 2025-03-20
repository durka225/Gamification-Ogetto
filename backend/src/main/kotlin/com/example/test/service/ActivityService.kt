package com.example.test.service

import com.example.test.repository.ActivityRepository
import com.example.test.repository.UserRepository
import com.example.test.model.Activity
import com.example.test.model.ActivityEnd
import com.example.test.controller.activity.ActivityRequest
import com.example.test.controller.activity.ActivityResponse
import com.example.test.controller.exception.NotFoundException
import com.example.test.controller.user.UserResponse
import com.example.test.model.Category
import com.example.test.model.User
import com.example.test.repository.ActivityEndRepository
import com.example.test.repository.CategoryRepository
import jakarta.transaction.Transactional

import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class ActivityService(
    private val activityRepository: ActivityRepository,
    private val activityEndRepository: ActivityEndRepository,
    private val userRepository: UserRepository,
    private val categoryRepository: CategoryRepository
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
            activityEndRepository.save(activityEnd)
            activityRepository.delete(activity)
        }

        activities.removeAll(expiredActivities)
        val activityResponse = mutableListOf<ActivityResponse>()
        activities.forEach { it ->
            activityResponse.add(ActivityResponse(
                id = it.id,
                title = it.title,
                category = it.category,
                reward = it.reward,
                users = it.users.map { user ->
                    UserResponse(
                        id = user.id,
                        login = user.login,
                        point = user.point
                    )
                }.toMutableList(),
                dateStart = it.dateStart,
                dateEnd = it.dateEnd
            ))
        }
        return activityResponse
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

        return activityRepository.save(request.toModelActivity(id, activity.users))
    }

    @Transactional
    fun addNewCategory(newCategory: String): Category =
        categoryRepository.save(Category(0, newCategory))

    fun getAllCategory(): List<Category> =
        categoryRepository.findAll()

    fun ActivityRequest.toModelActivity(id: Int? = 0, users: MutableList<User>? = mutableListOf()): Activity {
        val existingActivity = if (id != 0) {
            id?.let { activityRepository.findById(it.toLong()).orElse(null) }
        } else null

        return Activity(
            id = id ?: 0,
            title = this.title ?: existingActivity?.title ?: "",
            category = if (this.category_id != null)
                categoryRepository.findById(this.category_id!!.toLong()).orElseThrow {
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