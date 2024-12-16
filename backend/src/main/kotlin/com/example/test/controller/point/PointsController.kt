package com.example.test.controller.point

import com.example.test.service.PointService
import com.example.test.model.Point

import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.PathVariable


@RestController
@RequestMapping("/api/points")
class PointsController(
    private val pointService: PointService
) {

    @PostMapping("/add")
    fun addPoint(@RequestBody request: PointsRequestAdd): Boolean {
        return pointService.addApplication(request.toModelPoint(), request.token)
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
                ?: throw IllegalArgumentException("Point not found")
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