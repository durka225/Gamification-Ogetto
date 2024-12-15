package com.example.test.controller.activity

import com.example.test.model.Activity
import com.example.test.model.UserToActivity

data class ActivitiesWithUsers (
    val activity: Activity,
    val users: List<UserToActivity>,
    var status: ActivityStatus = ActivityStatus.NotProcessed
)

enum class ActivityStatus {
    NotProcessed, Processed
}