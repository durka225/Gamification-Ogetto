package com.example.test.controller.user

import com.example.test.model.Role
import com.example.test.model.User
import com.example.test.model.Transaction
import com.example.test.service.UserService
import com.example.test.service.TransactionService
import com.example.test.controller.exception.ApiRequestException
import com.example.test.controller.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
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
        description = "Создание нового пользователя. " +
                "Проверяется корректность данных пользователя и отсутствие в базе данных " +
                "пользователей с таким же логином или email. Если данные некорректны или " +
                "пользователь с таким логином/email уже существует, возвращается ошибка 400 Bad Request."
    )
    @PostMapping
    fun create(
        @Parameter(description = "Данные создаваемого пользователя, включая логин, пароль и email")
        @RequestBody userRequest: UserRequest
    ): UserResponse =
        userService.createUser(
            user = userRequest.toModel()
        )
            ?.toResponseUser()
            ?: throw ApiRequestException("Не удалось создать пользователя.") // Bad Request

    @GetMapping
    fun getUser(@RequestHeader("Authorization") token: String): UserResponse =
        userService.getUser(token.substringAfter("Bearer "))

    @Operation(
        summary = "Получение всех пользователей",
        description = "Возвращает список всех пользователей, зарегистрированных в системе. " +
                "Данный метод доступен только пользователям с ролью администратора."
    )
    @GetMapping("/all")
    fun listAll(): List<UserResponse> =
        userService.findByAll()
            .map {it.toResponseUser() }


    @Operation(
        summary = "Получение информации о конкретном пользователе",
        description = "Возвращает детальную информацию о пользователе по его уникальному идентификатору (UUID). " +
                "Если пользователь не найден, возвращается ошибка 404 Not Found."
    )
    @GetMapping("/{id}")
    fun findByUUID(
        @Parameter(description = "Уникальный идентификатор пользователя (UUID)")
        @PathVariable id: Int
    ): UserResponse =
        userService.findById(id)
            ?.toResponseUser()
            ?: throw NotFoundException("Не удалось найти пользователя.") // Not found


    @Operation(
        summary = "Удаление пользователя",
        description = "Удаляет пользователя из системы по его уникальному идентификатору (UUID). " +
                "При успешном удалении возвращает статус 204 No Content. " +
                "Если пользователь не найден, возвращается ошибка 404 Not Found."
    )
    @DeleteMapping("/{id}")
    fun deleteByUUID(
        @Parameter(description = "Уникальный идентификатор удаляемого пользователя (UUID)")
        @PathVariable id: Int
    ): ResponseEntity<Boolean> {
        val success = userService.deleteById(id)

        return if(success)
            ResponseEntity.noContent()
                .build()
        else
            throw NotFoundException("Не удалось найти пользователя.") // Not found
    }

    @Operation(
        summary = "Получение всех транзакций пользователя",
        description = "Возвращает список всех транзакций, связанных с текущим пользователем. " +
                "Пользователь определяется на основе JWT-токена, переданного в заголовке запроса."
    )
    @GetMapping("/transactions")
    fun listAllTransactions(
        @Parameter(description = "JWT-токен авторизации в формате 'Bearer {token}'")
        @RequestHeader("Authorization") request: String
    ): List<TransactionResponse> =
        transactionService.findTransactionsUser(request)
            .map { it.toResponseTransaction() }

    @Operation(
        summary = "Добавление пользователя в активность",
        description = "Регистрирует пользователя как участника указанной активности. " +
                "Проверяет существование активности и её статус (не началась ли она уже). " +
                "Если активность уже началась, возвращается ошибка 400 Bad Request. " +
                "Если активность не найдена, возвращается ошибка 404 Not Found. " +
                "Возвращает true при успешной регистрации пользователя в активности."
    )
    @PostMapping("{id}/activities/{activityId}")
    fun addUserToActivity(
        @Parameter(description = "Идентификатор активности")
        @PathVariable activityId: Int,
        @Parameter(description = "Уникальный идентификатор пользователя (UUID)")
        @PathVariable id: Int
    ): Boolean =
        userService.addUserToActivity(id, activityId)

    // Функция преобразования запроса в модель User
    private fun UserRequest.toModel(): User =
        User(
            id = 0,
            login = this.login,
            password = this.password,
            role = Role.user,
            point = 0,
            email = this.email
        )

    // Функция преобразования модели User в ответ UserResponse
    private fun User.toResponseUser(): UserResponse =
        UserResponse(
            id = this.id,
            login = this.login,
            point = this.point,
            rewards = this.rewards
        )

    private fun Transaction.toResponseTransaction(): TransactionResponse =
        TransactionResponse(
            id = this.id,
            date = this.date,
            description = this.description,
            type = this.type.name
        )
}