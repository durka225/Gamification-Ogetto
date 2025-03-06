package com.example.test.controller.activity

import com.example.test.model.Activity
import com.example.test.model.ActivityEnd
import com.example.test.model.Category
import com.example.test.service.ActivityService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
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
        summary = "Получение всех текущих и будущих активностей",
        description = "Возвращает список всех неоконченных активностей в системе, включая текущие (в процессе) " +
                "и запланированные на будущее. Список сортируется по дате начала активности."
    )
    @GetMapping
    fun getAllAcivites(): List<Activity> =
        activityService.getAllActivities()

    @Operation(
        summary = "Получение всех оконченных активностей",
        description = "Возвращает список всех завершенных активностей в системе. Оконченными считаются активности, " +
                "для которых текущая дата превышает дату окончания активности. " +
                "Список включает информацию о результатах и участниках активностей."
    )
    @GetMapping("/end")
    fun getAllActivitesEnd(): List<ActivityEnd> =
        activityService.getAllActivitiesEnd()

    @Operation(
        summary = "Добавление новых активностей",
        description = "Создает новую активность в системе на основе предоставленных данных. " +
                "Проверяет корректность дат (дата начала должна быть раньше даты окончания) " +
                "и существование указанной категории. Возвращает true при успешном создании, " +
                "иначе false."
    )
    @PostMapping("/add")
    fun createActivity(
        @Parameter(description = "Данные новой активности, включая название, категорию, вознаграждение и даты")
        @RequestBody activity: ActivityRequest
    ): Boolean {
        val request = activity.requestToModel()
        return activityService.createActivity(request)
    }

    @Operation(
        summary = "Изменение данных текущей и будущей активности",
        description = "Обновляет информацию о существующей активности по её идентификатору. " +
                "Позволяет изменять название, категорию, награду и даты проведения. " +
                "Проверяет существование активности и корректность новых данных. " +
                "Возвращает true при успешном обновлении, иначе false."
    )
    @PutMapping("/change/{id}")
    fun updateActivity(
        @Parameter(description = "Идентификатор обновляемой активности")
        @PathVariable id: Int,
        @Parameter(description = "Обновляемые данные активности (название, категория, вознаграждение, даты)")
        @RequestBody request: ActivityRequest
    ): Boolean {
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
        summary = "Получение активностей со списком участвующих пользователей",
        description = "Возвращает расширенную информацию о всех активностях, включая полные списки " +
                "участвующих пользователей для каждой активности. Данный метод обновляет кэш " +
                "связей между активностями и пользователями перед возвратом результата."
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
        summary = "Добавление новой категории активности",
        description = "Создает новую категорию для классификации активностей. " +
                "Проверяет уникальность названия категории (не должно совпадать с существующими). " +
                "Возвращает true при успешном создании категории, иначе false."
    )
    @PostMapping("/newCategory")
    fun createCategory(
        @Parameter(description = "Название новой категории активности")
        @RequestBody newCategory: String
    ): Boolean =
        activityService.addNewCategory(newCategory)

    @Operation(
        summary = "Получение списка всех категорий активностей",
        description = "Возвращает полный список всех доступных категорий в системе. " +
                "Категории используются для классификации активностей и облегчения их поиска и фильтрации."
    )
    @GetMapping("/category")
    fun getAllCategory(): List<Category> =
        activityService.getAllCategory()
}