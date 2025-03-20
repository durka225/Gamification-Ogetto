package com.example.test.repository

import com.example.test.model.Activity
import com.example.test.model.ActivityEnd
import com.example.test.controller.exception.ApiRequestException
import com.example.test.controller.exception.InternalServerErrorException
import com.example.test.model.Category
import org.springframework.data.jpa.repository.JpaRepository

import org.springframework.stereotype.Repository

import java.time.LocalDateTime

@Repository
interface ActivityRepository : JpaRepository<Activity, Long> {

}