package com.example.test.controller.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import java.time.LocalDateTime

@ControllerAdvice
class ApiExceptionHandler {

    // Обработка ApiRequestException (400 Bad Request)
    @ExceptionHandler(value = [ApiRequestException::class])
    fun handleApiRequestException(e: ApiRequestException): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            message = e.message ?: "Unexpected error",
            throwable = e.cause,
            httpStatus = HttpStatus.BAD_REQUEST,
            localDateTime = LocalDateTime.now()
        )
        return ResponseEntity(errorResponse, HttpStatus.BAD_REQUEST)
    }

    // Обработка NotFoundException (404 Not Found)
    @ExceptionHandler(value = [NotFoundException::class])
    fun handleNotFoundException(e: NotFoundException): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            message = e.message ?: "Resource not found",
            throwable = e.cause,
            httpStatus = HttpStatus.NOT_FOUND,
            localDateTime = LocalDateTime.now()
        )
        return ResponseEntity(errorResponse, HttpStatus.NOT_FOUND)
    }

    // Обработка ConflictException (409 Conflict)
    @ExceptionHandler(value = [ConflictException::class])
    fun handleConflictException(e: ConflictException): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            message = e.message ?: "Conflict error occurred",
            throwable = e.cause,
            httpStatus = HttpStatus.CONFLICT,
            localDateTime = LocalDateTime.now()
        )
        return ResponseEntity(errorResponse, HttpStatus.CONFLICT)
    }

    // Обработка InternalServerErrorException (500 Internal Server Error)
    @ExceptionHandler(value = [InternalServerErrorException::class])
    fun handleInternalServerErrorException(e: InternalServerErrorException): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            message = e.message ?: "Internal server error",
            throwable = e.cause,
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
            localDateTime = LocalDateTime.now()
        )
        return ResponseEntity(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    // Обработка ForbiddenException (403 Forbidden)
    @ExceptionHandler(value = [ForbiddenException::class])
    fun handleForbiddenException(e: ForbiddenException): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            message = e.message ?: "Forbidden",
            throwable = e.cause,
            httpStatus = HttpStatus.FORBIDDEN,
            localDateTime = LocalDateTime.now()
        )
        return ResponseEntity(errorResponse, HttpStatus.FORBIDDEN)
    }

    // Обработка общего исключения Exception (500 Internal Server Error)
    @ExceptionHandler(value = [Exception::class])
    fun handleGeneralException(e: Exception): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            message = "An unexpected error occurred: ${e.message}",
            throwable = e.cause,
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
            localDateTime = LocalDateTime.now()
        )
        return ResponseEntity(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}
