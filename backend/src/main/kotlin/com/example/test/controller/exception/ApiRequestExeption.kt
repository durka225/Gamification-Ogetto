package com.example.test.controller.exception

class ApiRequestException(message: String?): RuntimeException(message) // 400 Bad Request

class ForbiddenException(message: String?) : RuntimeException(message) // 403 Forbidden

class NotFoundException(message: String?) : RuntimeException(message) // 404 Not Found

class ConflictException(message: String?) : RuntimeException(message) // 409 Conflict

class InternalServerErrorException(message: String?) : RuntimeException(message) // 500 Internal Server Error


