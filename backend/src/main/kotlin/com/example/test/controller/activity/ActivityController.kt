package com.example.test.controller.activity

import com.example.test.model.Activity
import com.example.test.model.ActivityEnd
import com.example.test.service.ActivityService

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody



@RestController
@RequestMapping("/api/activity")
class ActivityController(
    private val activityService: ActivityService
) {

    @GetMapping
    fun getAllAcivites(): List<Activity> =
        activityService.getAllActivities()

    @GetMapping("/end")
    fun getAllActivitesEnd(): List<ActivityEnd> =
        activityService.getAllActivitiesEnd()

    @PostMapping("/add")
    fun createActivity(@RequestBody activity: ActivityRequest): Boolean {
        val request = activity.requestToModel()
        return activityService.createActivity(request)
    }
        
    @PutMapping("/change/{id}")
    fun updateActivity(@PathVariable id: Int, @RequestBody request: ActivityRequest): Boolean {
        val update = request.toModelActivity(id)
        return activityService.updateActivity(id, update)
    }
    
    private fun ActivityRequest.toModelActivity(id_request: Int): Activity =
        Activity(
            id = id_request,
            title = this.title,
            reward = this.reward,
            dateStart = this.dateStart,
            dateEnd = this.dateEnd
        )

    @GetMapping("/activities-with-users")
    fun getAllActivitiesWithUsers(): List<ActivitiesWithUsers> {
        activityService.addActivitiesWithUsers()
        return activityService.getAllActivitiesWithUsers()
    }

    private fun ActivityRequest.requestToModel(): Activity =
    Activity(
        id = 0,
        title = this.title,
        reward = this.reward,
        dateStart = this.dateStart,
        dateEnd = this.dateEnd
    )
}