package com.example.test.controller.activity

import com.example.test.model.Activity
import com.example.test.model.ActivityEnd
import com.example.test.model.Category
import com.example.test.service.ActivityService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody



@RestController
@RequestMapping("/api/activity")
@Tag(name = "Управление активностями и категориями")
class ActivityController(
    private val activityService: ActivityService
) {

    @Operation(
        summary = "Получение всех текущих и будущих активностей."
    )
    @GetMapping
    fun getAllAcivites(): List<Activity> =
        activityService.getAllActivities()

    @Operation(
        summary = "Получение всех оконченных активностей."
    )
    @GetMapping("/end")
    fun getAllActivitesEnd(): List<ActivityEnd> =
        activityService.getAllActivitiesEnd()

    @Operation(
        summary = "Добавление новых активностей"
    )
    @PostMapping("/add")
    fun createActivity(@RequestBody activity: ActivityRequest): Boolean {
        val request = activity.requestToModel()
        return activityService.createActivity(request)
    }

    @Operation(
        summary = "Изменение данных текущей и будущей активности"
    )
    @PutMapping("/change/{id}")
    fun updateActivity(@PathVariable id: Int, @RequestBody request: ActivityRequest): Boolean {
        val update = request.toModelActivity(id)
        return activityService.updateActivity(id, update)
    }
    
    private fun ActivityRequest.toModelActivity(id_request: Int): Activity =
        Activity(
            id = id_request,
            title = this.title,
            category = this.category,
            reward = this.reward,
            dateStart = this.dateStart,
            dateEnd = this.dateEnd
        )


    @Operation(
        summary = "Получение активностей со списком участвующих пользователей"
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
        category = this.category,
        dateStart = this.dateStart,
        dateEnd = this.dateEnd
    )


    @Operation(
        summary = "Добавление новой категории активности"
    )
    @PostMapping("/newCategory")
    fun createCategory(@RequestBody newCategory: String): Boolean =
        activityService.addNewCategory(newCategory)

    @Operation(
        summary = "Получение списка всех пользователей"
    )
    @GetMapping("/category")
    fun getAllCategory(): List<Category> =
        activityService.getAllCategory()
}