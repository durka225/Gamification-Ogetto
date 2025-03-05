package com.example.test.controller.user

import com.example.test.model.Role
import com.example.test.model.User
import com.example.test.model.Transaction
import com.example.test.service.UserService
import com.example.test.service.TransactionService
import com.example.test.controller.exception.ApiRequestException
import com.example.test.controller.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag


import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.util.*


@RestController
@RequestMapping("/api/user")
@Tag(name = "Контроллер управления пользователями")
class UserController(
    private val userService: UserService,
    private val transactionService: TransactionService
) {

    @Operation(
        summary = "Создание нового пользователя",
        description = "Создание нового пользователя, " +
                "проверяется корректность данных пользователя и проверка того, " +
                "не существует указанные login и email уже в базе данных, иначе возврат 400 Bad Request."
    )
    @PostMapping
    fun create(@RequestBody userRequest: UserRequest): UserResponse =
        userService.createUser(
            user = userRequest.toModel()
        )
            ?.toResponseUser()
            ?: throw  ApiRequestException("Не удалось создать пользователя.") // Bad Request

    @Operation(
        summary = "Получение всех пользователей",
        description = "Запрос возвращает всех существующих пользователей в базе данных. " +
                "Может быть использован только администратором."
    )
    @GetMapping
    fun listAll(): List<UserResponse> =
        userService.findByAll()
            .map {it.toResponseUser() }


    @Operation(
        summary = "Получение информации о конкретном пользователе по его UUID.",
        description = "Ищет пользователя в базе данных по его UUID, если не найден, то " +
                "возврат кода 404 Not Found."
    )
    @GetMapping("/{uuid}")
    fun findByUUID(@PathVariable uuid: UUID): UserResponse =
        userService.findByUUID(uuid)
            ?.toResponseUser()
            ?: throw  NotFoundException("Не удалось найти пользователя.") // Not found


    @Operation(
        summary = "Удаление пользователя по UUID",
        description = "Ищет пользователя в базе данных по его UUID, если не найден, то " +
                "возврат кода 404 Not Found, иначе удаляет пользователя."
    )
    @DeleteMapping("/{uuid}")
    fun deleteByUUID(@PathVariable uuid: UUID): ResponseEntity<Boolean> {
        val success = userService.deleteByUUID(uuid)

        return if(success)
            ResponseEntity.noContent()
                .build()
        else
            throw  NotFoundException("Не удалось найти пользователя.") // Not found
    }

    // todo Переделать транзакции, чтобы возвращались по пользователю, а не только все сразу.
    @Operation(
        summary = "Получение всех транзакций",
        description = ""
    )
    @GetMapping("/transactions")
    fun listAllTransactions(@RequestHeader("Authorization") request: String): List<TransactionResponse> =
        transactionService.findTransactionsUser(request)
            .map { it.toResponseTransaction() }

    @Operation(
        summary = "Добавление пользователя в активность.",
        description = "Добавляет пользователя для участия в активности, " +
                "проверяет существует ли активность и не началась ли она уже. Если началась, то возвращается 400 Bad Request, " +
                "если не существует, то возвращается 404 Not Found."
    )
    @PostMapping("{uuid}/activities/{activityId}")
    fun addUserToActivity(@PathVariable activityId: Int, @PathVariable uuid: UUID): Boolean =
        userService.addUserToActivity(uuid, activityId)


    // Тестовый метод
    @PostMapping("/addUserTest")
    fun addUserTest(@RequestBody request: UserRequest): Boolean {
        return userService.addUserTest(request)
    }

    


    // Функция преобразования запроса в модель User
    // По определённой форме
    private fun UserRequest.toModel(): User =
        User(
            id = UUID.randomUUID(),
            login = this.login,
            password = this.password,
            role = Role.user,
            point = 0,
            email = this.email
        )


    // Функция преобразования модели User в ответ UserResponse
    private fun User.toResponseUser(): UserResponse =
        UserResponse(
            uuid = this.id,
            email = this.email,
            point = this.point,
        )

    private fun Transaction.toResponseTransaction(): TransactionResponse =
        TransactionResponse(
            id = this.id,
            date = this.date,
            description = this.description,
            type = this.type.name
        )
}