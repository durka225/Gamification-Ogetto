package com.example.test.controller.activity

import com.example.test.model.Activity
import com.example.test.model.ActivityEnd
import com.example.test.model.CategoryActivity
import com.example.test.service.ActivityService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.http.ResponseEntity
import org.springframework.http.HttpStatus
import com.example.test.controller.exception.NotFoundException



@RestController
@RequestMapping("/api/activity")
@Tag(name = "Управление активностями и категориями")
class ActivityController(
    private val activityService: ActivityService
) {
    @Operation(
        summary = "Получение всех текущих и будущих активностей",
        description = "Возвращает список всех неоконченных активностей в системе в упрощенном формате, " +
                "включая текущие (в процессе) и запланированные на будущее. " +
                "Содержит только необходимую информацию без конфиденциальных данных пользователей."
    )
    @GetMapping
    fun getAllAcivites(): List<ActivityResponse> =
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
    ): Activity {
        return activityService.createActivity(activity)
    }

    @Operation(
        summary = "Изменение данных текущей и будущей активности",
        description = "Обновляет информацию о существующей активности по её идентификатору. " +
                "Позволяет изменять только нужные поля (можно отправить только те поля, которые требуют изменения). " +
                "Проверяет существование активности и корректность новых данных. " +
                "Возвращает обновленную активность при успешном обновлении."
    )
    @PutMapping("/change/{id}")
    fun updateActivity(
        @Parameter(description = "Идентификатор обновляемой активности")
        @PathVariable id: Int,
        @Parameter(description = "Обновляемые данные активности (можно указать только необходимые поля)")
        @RequestBody request: ActivityRequest
    ): Activity {
        return activityService.updateActivity(id, request)
    }

    /*@Operation(
        summary = "Получение активностей со списком участвующих пользователей",
        description = "Возвращает расширенную информацию о всех активностях, включая полные списки " +
                "участвующих пользователей для каждой активности. Данный метод обновляет кэш " +
                "связей между активностями и пользователями перед возвратом результата."
    )
    @GetMapping("/activities-with-users")
    fun getAllActivitiesWithUsers(): List<ActivitiesWithUsers> {
        activityService.addActivitiesWithUsers()
        return activityService.getAllActivitiesWithUsers()
    }*/


    @Operation(
        summary = "Добавление новой категории активности",
        description = "Создает новую категорию для классификации активностей. " +
                "Проверяет уникальность названия категории (не должно совпадать с существующими). " +
                "Возвращает созданную категорию при успешном создании."
    )
    @PostMapping("/newCategory")
    fun createCategory(
        @Parameter(description = "Данные новой категории активности")
        @RequestBody categoryRequest: CategoryActivityRequest
    ): CategoryActivity =
        activityService.addNewCategory(categoryRequest)

    @Operation(
        summary = "Получение списка всех категорий активностей",
        description = "Возвращает полный список всех доступных категорий в системе. " +
                "Категории используются для классификации активностей и облегчения их поиска и фильтрации."
    )
    @GetMapping("/category")
    fun getAllCategory(): List<CategoryActivity> =
        activityService.getAllCategory()

    @Operation(
        summary = "Удаление активности",
        description = "Удаляет активность по указанному идентификатору. " +
                "В случае успешного удаления возвращает статус 204 No Content. " +
                "Если активность не найдена, возвращает ошибку 404 Not Found."
    )
    @DeleteMapping("/{id}")
    fun deleteActivity(
        @Parameter(description = "Идентификатор удаляемой активности")
        @PathVariable id: Int
    ): ResponseEntity<Any> {
        return if (activityService.deleteActivity(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @Operation(
        summary = "Удаление категории активности",
        description = "Удаляет категорию активности по указанному идентификатору. " +
                "Проверяет, что категория не используется в существующих активностях. " +
                "В случае успешного удаления возвращает статус 204 No Content. " +
                "Если категория не найдена или используется, возвращает соответствующую ошибку."
    )
    @DeleteMapping("/category/{id}")
    fun deleteCategory(
        @Parameter(description = "Идентификатор удаляемой категории")
        @PathVariable id: Long
    ): ResponseEntity<Any> {
        return if (activityService.deleteCategoryActivity(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @Operation(
        summary = "Редактирование категории активности",
        description = "Обновляет название существующей категории активности по её идентификатору. " +
                "Проверяет существование категории и корректность новых данных. " +
                "Возвращает обновленную категорию при успешном обновлении."
    )
    @PutMapping("/category/{id}")
    fun updateCategory(
        @Parameter(description = "Идентификатор обновляемой категории")
        @PathVariable id: Long,
        @Parameter(description = "Новое название категории")
        @RequestBody updateRequest: CategoryActivityUpdateRequest
    ): CategoryActivity {
        return activityService.updateCategory(id, updateRequest)
    }
}