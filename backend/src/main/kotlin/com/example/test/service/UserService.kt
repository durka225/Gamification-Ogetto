package com.example.test.service

import com.example.test.model.User
import com.example.test.repository.UserRepository
import com.example.test.repository.ActivityRepository
import com.example.test.controller.exception.ApiRequestException
import com.example.test.controller.exception.NotFoundException
import com.example.test.controller.user.UserResponse
import jakarta.transaction.Transactional
import org.apache.coyote.Response
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder

import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime

@Service
class UserService(
    private val userRepository: UserRepository,
    private val activityRepository: ActivityRepository,
    private val encoder: PasswordEncoder,
    private val tokenService: TokenService
) {

    // Метод создания нового пользователя и добавления его в репозиторий пользователей
    @Transactional
    fun createUser(user: User): User? {
        val foundEmail = userRepository.findByEmail(user.email)
        val foundLogin = userRepository.findByLogin(user.login)

        return if (foundEmail == null && foundLogin == null) {
            userRepository.save(user.copy(password = encoder.encode(user.password)))
        } else null
    }

    // Метод поиска пользователя по id в пользовательском репозитории
    // В будущем поиск по базе данных
    fun findById(id: Int): User? =
        userRepository.findById(id.toLong()).orElseThrow {
            NotFoundException("Пользователь с ID ${id} не найден")
        }

    fun getUser(token: String): UserResponse {
        val login = tokenService.extractLogin(token)
            ?: throw ResponseStatusException(HttpStatus.FORBIDDEN, "Некорректный токен")
        val findUser = userRepository.findByLogin(login)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь с логином ${login} не найден")
        return UserResponse(
            id = findUser.id,
            login = login,
            point = findUser.point,
            rewards = findUser.rewards
        )
    }

    // Метод получения всех пользователей из пользовательского репозитория
    // В будущем получение из базы данных
    fun findByAll(): List<User> =
        userRepository.findAll()

    // Метод удаления пользователя из пользовательского репозитория
    @Transactional
    fun deleteById(id: Int): Boolean {
        userRepository.deleteUserById(id)
        return true
    }

    fun addUserToActivity(userId: Int, activityId: Int): Boolean {

        val foundActivity = activityRepository.findById(activityId.toLong()).orElseThrow {
            NotFoundException("Активность не найдена")
        }
        if (foundActivity.dateStart.isBefore(LocalDateTime.now()))
            throw ApiRequestException("Дата начала раньше текущего времени") // Bad Request
        foundActivity.users.add(userRepository.findById(userId.toLong()).orElseThrow {
            NotFoundException("Пользователь не найден")
        })

        return activityRepository.save(foundActivity).id != 0
    }

}