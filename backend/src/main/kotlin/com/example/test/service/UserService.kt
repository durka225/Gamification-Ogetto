package com.example.test.service

// import com.example.test.controller.UserDeleteLogin
import com.example.test.model.User
import com.example.test.repository.UserRepository
import com.example.test.repository.ActivityRepository
import org.springframework.stereotype.Service
import java.util.*
import java.time.LocalDateTime

@Service
class UserService (
    private val userRepository: UserRepository,
    private val activityRepository: ActivityRepository
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
        val foundActivity = activityRepository.findById(activityId) ?: return false
        if (foundActivity.dateStart.isBefore(LocalDateTime.now())) return false

        return userRepository.addUserToActivity(uuid, activityId)
    } 
}