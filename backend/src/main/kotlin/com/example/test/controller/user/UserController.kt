package com.example.test.controller.user

import com.example.test.model.Role
import com.example.test.model.User
import com.example.test.model.Transaction
import com.example.test.service.UserService
import com.example.test.service.TransactionService
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.util.*


@RestController
@RequestMapping("/api/user")
class UserController(
    private val userService: UserService,
    private val transactionService: TransactionService
) {

    // Функция POST - запроса для создания пользователя
    // Принимает объект UserRequest, конвертирует его в модель User и передаёт его в UserService
    // В функцию createUser и преобразует потом в формат ответа через toResponseUser
    @PostMapping
    fun create(@RequestBody userRequest: UserRequest): UserResponse =
        userService.createUser(
            user = userRequest.toModel()
        )
            ?.toResponseUser()
            ?: throw  ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot create a user.")

    // Функция GET - запроса для получения всего списка пользователя
    // Преобразует список моделей User в список ответов UserResponse
    // возвращает его в формате ResponseEntity с HttpStatus.OK
    @GetMapping
    fun listAll(): List<UserResponse> =
        userService.findByAll()
            .map {it.toResponseUser() }


    // Функция GET - запроса для получения пользователя по UUID
    // Принимает uuid пользователя, ищет пользователя по uuid через функцию findByUUID
    // Конвертирует потом в ответ через toResponseUser
    @GetMapping("/{uuid}")
    fun findByUUID(@PathVariable uuid: UUID): UserResponse =
        userService.findByUUID(uuid)
            ?.toResponseUser()
            ?: throw  ResponseStatusException(HttpStatus.NOT_FOUND, "Cannot find a user.")


    // Функция DELETE - запроса для удаления пользователя по UUID
    // Принимает uuid пользователя, удаляет его через функцию deleteByUUID
    // Возвращает ResponseEntity с HttpStatus.NO_CONTENT
    // Eсли удаление прошло успешно, иначе - HttpStatus.NOT_FOUND, если пользователь не найдено
    @DeleteMapping("/{uuid}")
    fun deleteByUUID(@PathVariable uuid: UUID): ResponseEntity<Boolean> {
        val success = userService.deleteByUUID(uuid)

        return if(success)
            ResponseEntity.noContent()
                .build()
        else
            throw  ResponseStatusException(HttpStatus.NOT_FOUND, "Cannot find a user.")
    }

    @GetMapping("/transactions")
    fun listAllTransactions(): List<TransactionResponse> =
        transactionService.findAllTransactions()
            .map { it.toResponseTransaction() }

    @PostMapping("{uuid}/activities/{activityId}")
    fun addUserToActivity(@PathVariable activityId: Int, @PathVariable uuid: UUID): Boolean =
        userService.addUserToActivity(uuid, activityId)

    


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