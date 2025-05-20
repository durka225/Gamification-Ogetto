package com.example.test.repository


import com.example.test.model.Point
import com.example.test.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PointRepository : JpaRepository<Point, Int> {
    fun deletePointsById(id: Int)
    fun findAllByLogin(login: User): List<Point>
}
