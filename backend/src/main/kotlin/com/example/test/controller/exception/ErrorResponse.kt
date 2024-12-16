package com.example.test.controller.exception

import org.springframework.http.HttpStatus

import java.time.LocalDateTime

data class ErrorResponse(
    val message: String? = null,
    val throwable: Throwable? = null,
    val httpStatus: HttpStatus? = null,
    val localDateTime: LocalDateTime? = null
)