package com.example.test.service

import com.example.test.repository.ActivityRepository
import com.example.test.repository.UserRepository
import com.example.test.model.Activity
import com.example.test.model.ActivityEnd
import com.example.test.controller.activity.ActivitiesWithUsers
import com.example.test.controller.exception.ApiRequestException
import com.example.test.controller.exception.InternalServerErrorException
import com.example.test.controller.activity.ActivityStatus
import com.example.test.model.Category

import org.springframework.stereotype.Service

@Service
class ActivityService(
    private val activityRepository: ActivityRepository,
    private val userRepository: UserRepository
) {

    fun getAllActivities(): List<Activity> = 
        activityRepository.findAllActivities()

    fun getAllActivitiesEnd(): List<ActivityEnd> = 
        activityRepository.findAllActivitiesEnd()

    fun createActivity(activity: Activity): Boolean =
        activityRepository.addActivity(activity)

    fun updateActivity(id: Int, update: Activity): Boolean = 
        activityRepository.updateActivity(id, update)

        fun addActivitiesWithUsers(): List<Boolean> {
            val activities = activityRepository.findAllActivities()
            val users = userRepository.getAllUserToActivity()
        
            return activities.map { activity ->
                val activityUsers = users.filter { it.activityId == activity.id }
                val existingActivityWithUsers = activityRepository.findActivityWithUsersById(activity.id)
        
                when {
                    existingActivityWithUsers != null && existingActivityWithUsers.status == ActivityStatus.NotProcessed -> {
                        if (existingActivityWithUsers.users != activityUsers) {
                            activityRepository.updateActivityUsers(activity.id, activityUsers)
                            true
                        } else {
                            false
                        }
                    }
                    existingActivityWithUsers != null && existingActivityWithUsers.status != ActivityStatus.NotProcessed -> {
                        throw ApiRequestException("Статус активности с ID (${activity.id}) не позволяет обработку.")
                        // Bad Request
                    }
                    else -> {
                        if (!activityRepository.addActivityWithUsers(ActivitiesWithUsers(activity, activityUsers))) {
                            throw InternalServerErrorException("Ошибка при добавлении активности с ID (${activity.id}) и пользователями.")
                            // Internal Server Error
                        }
                        true
                    }
                }
            }
        }
        
        
    fun getAllActivitiesWithUsers(): List<ActivitiesWithUsers> = 
        activityRepository.getAllActivitiesWithUsers()

    fun addNewCategory(newCategory: String): Boolean=
        activityRepository.addCategory(Category (0, newCategory))

    fun getAllCategory(): List<Category> =
        activityRepository.getCategory()
}