package com.example.test.repository

import com.example.test.model.Activity
import com.example.test.model.ActivityEnd
import com.example.test.model.UserToActivity
import com.example.test.controller.activity.ActivitiesWithUsers
import com.example.test.controller.activity.ActivityStatus

import org.springframework.stereotype.Repository

import java.time.LocalDateTime

@Repository
class ActivityRepository () {

    private var activities = mutableListOf<Activity>()

    private val activityEnd = mutableListOf<ActivityEnd>()

    private val activitiesWithUsers = mutableListOf<ActivitiesWithUsers>()

    private val categories = mutableListOf<String>()

    fun addActivity(activity: Activity): Boolean {
        val maxId = activities.maxOfOrNull { it.id } ?: -1
        val updateActivity = activity.copy(id = maxId + 1)
        if (!activity.dateEnd.isAfter(activity.dateStart)) return false
        if (!categories.any { it == activity.category }) return false
        return activities.add(updateActivity)
    }

    fun addActivityWithUsers(request: ActivitiesWithUsers): Boolean =
        activitiesWithUsers.add(request)

    fun findAllActivitiesEnd(): List<ActivityEnd> = activityEnd

    fun findAllActivities(): List<Activity> {
        val now = LocalDateTime.now()
        val expiredActivities = activities.filter { it.dateEnd.isBefore(now) }
    
        expiredActivities.forEach { deleteEndActivity(it.id) }
    
        activities = activities.filterNot { it.dateEnd.isBefore(now) }.toMutableList()
    
        return activities
    }
    
    

    fun findById(id: Int): Activity? =
        activities.firstOrNull { it.id == id }

    fun deleteByID(id: Int): Boolean {
        val foundActivity = findById(id)
        
        return foundActivity?.let {
            activities.remove(it)
        }?: false
    }

    fun updateActivity(id: Int, activity: Activity): Boolean {
        val index = activities.indexOfFirst { it.id == id }
        if (index == -1) return false
        activities[index] = activity
        return true
    }

    fun deleteEndActivity(id: Int): Boolean {
        val foundActivity = findById(id) ?: return false
        if (foundActivity.dateEnd.isBefore(LocalDateTime.now())) {
            val isAddedToEnd = addActivityEnd(foundActivity)
            if (isAddedToEnd) {
                deleteByID(id)
                return true
            }
            return false
        }
        return false
    }
    
    private fun addActivityEnd(activity: Activity): Boolean {
        val newObject = ActivityEnd(id = activity.id, title = activity.title, category = activity.category)
        return try {
            activityEnd.add(newObject)
            true
        } catch (e: Exception) {
            println("Error adding activity to end: ${e.message}")
            false
        }
    }
    

    fun getActivitiesEnd (): List<ActivityEnd> = activityEnd

    fun getAllActivitiesWithUsers(): List<ActivitiesWithUsers> = activitiesWithUsers

    fun findActivityWithUsersById(activityId: Int): ActivitiesWithUsers? =
        activitiesWithUsers.firstOrNull { it.activity.id == activityId }

    fun updateActivityUsers(activityId: Int, newUsers: List<UserToActivity>): Boolean {
        val index = activitiesWithUsers.indexOfFirst { it.activity.id == activityId }
        if (index == -1) return false
        activitiesWithUsers[index] = activitiesWithUsers[index].copy(users = newUsers)
        return true
    }

    fun updateActivityStatus(activityId: Int, newStatus: ActivityStatus): Boolean {
        val activityWithUsers = activitiesWithUsers.firstOrNull { it.activity.id == activityId }
        return if (activityWithUsers != null) {
            activityWithUsers.status = newStatus
            true
        } else {
            false
        }
    }

    fun addCategory(newCategory: String): Boolean =
        categories.add(newCategory)
        
    fun getCategory(): List<String> = categories

}
