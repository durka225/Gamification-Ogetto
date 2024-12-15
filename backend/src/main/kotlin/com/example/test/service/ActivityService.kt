package com.example.test.service

import com.example.test.repository.ActivityRepository
import com.example.test.repository.UserRepository
import com.example.test.model.Activity
import com.example.test.model.ActivityEnd
import com.example.test.controller.activity.ActivitiesWithUsers
import com.example.test.controller.activity.ActivityStatus

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
        
                if (existingActivityWithUsers != null &&
                    existingActivityWithUsers.status == ActivityStatus.NotProcessed) {
                    if (existingActivityWithUsers.users != activityUsers) {
                        activityRepository.updateActivityUsers(activity.id, activityUsers)
                        true
                    } else {
                        false
                    }
                } else {
                    activityRepository.addActivityWithUsers(ActivitiesWithUsers(activity, activityUsers))
                    true
                }
            }
        }
        
    fun getAllActivitiesWithUsers(): List<ActivitiesWithUsers> = 
        activityRepository.getAllActivitiesWithUsers()
}