package com.example.test.controller.point

import com.example.test.service.PointService
import com.example.test.model.Point
import com.example.test.controller.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag

import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.PathVariable


@RestController
@RequestMapping("/api/points")
@Tag(name = "Управление баллами пользователей")
class PointsController(
    private val pointService: PointService
) {

    @Operation(
        summary = "Добавление новой заявки на начисление баллов",
        description = "Создаёт новую заявку на начисление баллов пользователю. " +
                "Требуется аутентификация через токен. Система определяет пользователя " +
                "по переданному JWT-токену и создаёт заявку с указанным количеством баллов. " +
                "Возвращает true при успешном создании заявки, иначе false."
    )
    @PostMapping("/add")
    fun addPoint(
        @Parameter(description = "Данные для заявки на начисление баллов, включая количество и описание")
        @RequestBody request: PointsRequestAdd,
        @Parameter(description = "JWT-токен авторизации в формате 'Bearer {token}'")
        @RequestHeader("Authorization") token: String
    ): Point {
        val updateToken = token.substringAfter("Bearer ")
        return pointService.addApplication(request, updateToken)
    }

    @Operation(
        summary = "Получение всех заявок на начисление баллов",
        description = "Возвращает список всех заявок на начисление баллов в системе. " +
                "Перед возвратом результатов метод также обновляет кэш заявок, " +
                "добавляя заявки из завершенных активностей."
    )
    @GetMapping
    fun getAllPoints(): List<Point> {
        // pointService.addCompletedActivitiesRequest()
        return pointService.getAllApplications()
    }

    @Operation(
        summary = "Подтверждение заявки на начисление баллов",
        description = "Обрабатывает заявку на начисление баллов с указанным идентификатором. " +
                "При успешном выполнении начисляет баллы пользователю и создаёт транзакцию. " +
                "Если заявка не найдена, возвращает ошибку 404 Not Found. " +
                "Возвращает сообщение о результате выполнения операции."
    )
    @PostMapping ("/success/{id}")
    fun successPoint(
        @Parameter(description = "Идентификатор заявки на начисление баллов")
        @PathVariable id: Int
    ): String {
        return pointService.changePoints(id)
    }
}