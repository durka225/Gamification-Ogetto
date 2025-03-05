package com.example.test.controller.point

import com.example.test.service.PointService
import com.example.test.model.Point
import com.example.test.controller.exception.NotFoundException
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

    @PostMapping("/add")
    fun addPoint(
        @RequestBody request: PointsRequestAdd,
        @RequestHeader("Authorization") token: String
    ): Boolean {
        val updateToken = token.substringAfter("Bearer ")
        return pointService.addApplication(request.toModelPoint(), updateToken)
    }

    @GetMapping
    fun getAllPoints(): List<Point> {
        pointService.addCompletedActivitiesRequest()
        return pointService.getAllApplications()
    }

    @PostMapping ("/success/{id}")
    fun successPoint(@PathVariable id: Int): String{
        val foundPoint = pointService.getById(id)
                ?.toRequestBody()
                ?: throw NotFoundException("Заявка не найдена") // Not found
        return pointService.changePoints(foundPoint, id)
    }

     private fun Point.toRequestBody(): PointsRequest =
        PointsRequest(
            login = this.login,
            points = this.points,
            description = this.description
        )


    private fun PointsRequestAdd.toModelPoint(): Point =
        Point(
            id = 0,
            login = null,
            points = this.points,
            description = this.description
            )
        }