package com.example.test.service

import com.example.test.repository.ActivityRepository
import com.example.test.model.Activity

import org.springframework.stereotype.Service

@Service
class ActivityService(
    private val activityRepository: ActivityRepository
) {

    fun getAllActivities(): List<Activity> = 
        activityRepository.findAllActivities()

    fun createActivity(activity: Activity): Boolean =
        activityRepository.addActivity(activity)

    fun updateActivity(id: Int, update: Activity): Boolean = 
        activityRepository.updateActivity(id, update)
}