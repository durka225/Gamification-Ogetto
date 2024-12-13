package com.example.test.repository

import com.example.test.model.Activity

import org.springframework.stereotype.Repository

@Repository
class ActivityRepository () {

    private val activities = mutableListOf<Activity>()

    fun addActivity(activity: Activity): Boolean {
        val maxId = activities.maxOfOrNull { it.id } ?: -1
        val updateActivity = activity.copy(id = maxId + 1)
        return activities.add(updateActivity)
    }

    fun findAllActivities(): List<Activity> = activities

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
}