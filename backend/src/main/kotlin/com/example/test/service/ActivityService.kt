package com.example.test.service

import com.example.test.repository.ActivityRepository
import com.example.test.repository.UserRepository
import com.example.test.model.Activity
import com.example.test.controller.activity.ActivitiesWithUsers

import org.springframework.stereotype.Service

@Service
class ActivityService(
    private val activityRepository: ActivityRepository,
    private val userRepository: UserRepository
) {

    fun getAllActivities(): List<Activity> = 
        activityRepository.findAllActivities()

    fun createActivity(activity: Activity): Boolean =
        activityRepository.addActivity(activity)

    fun updateActivity(id: Int, update: Activity): Boolean = 
        activityRepository.updateActivity(id, update)

    fun getAllActivitiesWithUsers(): List<ActivitiesWithUsers> {
        val activities = activityRepository.findAllActivities()
        val users = userRepository.getAllUserToActivity()
    
        return activities.map { activity ->
            val activityUsers = users.filter { it.activityId == activity.id }
            ActivitiesWithUsers(activity, activityUsers)
        }
    }
}