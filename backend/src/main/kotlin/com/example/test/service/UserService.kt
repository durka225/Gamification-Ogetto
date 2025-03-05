package com.example.test.service

// import com.example.test.controller.UserDeleteLogin
import com.example.test.model.User
import com.example.test.model.Role
import com.example.test.repository.UserRepository
import com.example.test.repository.ActivityRepository
import com.example.test.controller.exception.ApiRequestException
import com.example.test.controller.exception.NotFoundException
import com.example.test.controller.user.UserRequest
import com.example.test.model.UserTest
import com.example.test.repository.UserRepositoryTest
import org.springframework.security.crypto.password.PasswordEncoder

import org.springframework.stereotype.Service
import java.util.*
import java.time.LocalDateTime

@Service
class UserService (
    private val userRepository: UserRepository,
    private val userRepositoryTest: UserRepositoryTest,
    private val activityRepository: ActivityRepository,
    private val encoder: PasswordEncoder
) {

    // Метод создания нового пользователя и добавления его в репозиторий пользователей
    // В будущем добавление в базу данных.
    fun createUser(user: User): User? {
        val foundEmail = userRepository.findByEmail(user.email)
        val foundLogin = userRepository.findByLogin(user.login)

        return if (foundEmail == null && foundLogin == null) {
            userRepository.addUser(user)
            user
        } else null
    }

    // Метод поиска пользователя по UUID в пользовательском репозитории
    // В будущем поиск по базе данных 
    fun findByUUID(uuid: UUID): User ? =
        userRepository.findByUUID(uuid)

    // Метод получения всех пользователей из пользовательского репозитория
    // В будущем получение из базы данных
    fun findByAll(): List<User> =
        userRepository.findAll()

    // Метод удаления пользователя из пользовательского репозитория
    // В будущем удаление из базы данных
    fun deleteByUUID(uuid: UUID): Boolean =
        userRepository.deleteByUUID(uuid)

    fun addUserToActivity(uuid: UUID, activityId: Int): Boolean {
        userRepository.findByUUID(uuid) ?: return false
        val foundActivity = activityRepository.findById(activityId) 
            ?: throw NotFoundException("Активность не найдена") // Not Found
        if (foundActivity.dateStart.isBefore(LocalDateTime.now())) 
            throw ApiRequestException("Дата начала раньше текущего времени") // Bad Request

        return userRepository.addUserToActivity(uuid, activityId)
    }

    fun addUserTest(request: UserRequest): Boolean {
        val foundEmail = userRepositoryTest.findByEmail(request.email)
        val foundLogin = userRepositoryTest.findByLogin(request.login)
        if (foundEmail == null && foundLogin == null) {
            userRepositoryTest.save(request.toModel())
            return true
        }
        return false;
    }

    private fun UserRequest.toModel() : UserTest =
        UserTest(
            id = 0,
            login = this.login,
            password = encoder.encode(this.password),
            role = Role.user,
            point = 0,
            email = this.email
        )
}