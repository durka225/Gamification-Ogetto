    package com.example.test.controller.point

    import com.example.test.service.PointService

    import org.springframework.web.bind.annotation.RestController
    import org.springframework.web.bind.annotation.RequestMapping
    import org.springframework.web.bind.annotation.PostMapping
    import org.springframework.web.bind.annotation.RequestBody


    @RestController
    @RequestMapping("/api/points")
    class PointsController(
        private val pointService: PointService
    ) {


        @PostMapping
        fun changePoints(@RequestBody pointsRequest: PointsRequest): String {
            return pointService.changePoints(pointsRequest)

        }
    }