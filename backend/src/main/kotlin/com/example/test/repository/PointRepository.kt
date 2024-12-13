package com.example.test.repository


import com.example.test.model.Point
import org.springframework.stereotype.Repository

@Repository
class PointRepository() {

    private val points = mutableListOf<Point>()

    fun addApplication(application: Point): Boolean {
        val maxId = points.maxOfOrNull { it.id } ?: -1
        val updateApplication = application.copy(id = maxId + 1)
        return points.add(updateApplication)
    }

    fun delApplicationById(id: Int): Boolean {
        val application = findById(id)
        return points.remove(application)
    }

    fun getAllApplications(): List<Point> = points

    fun findById(id: Int): Point? = 
        points
            .firstOrNull { it.id == id }

}