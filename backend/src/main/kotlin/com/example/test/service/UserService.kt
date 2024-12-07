package com.example.test.service

// import com.example.test.controller.UserDeleteLogin
import com.example.test.model.User
import com.example.test.repository.UserRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserService (
    private val userRepository: UserRepository
) {

    fun createUser(user: User): User? {
        val found = userRepository.findByEmail(user.email)

        return if (found == null) {
            userRepository.addUser(user)
            user
        } else null
    }

    fun findByUUID(uuid: UUID): User ? =
        userRepository.findByUUID(uuid)

    fun findByAll(): List<User> =
        userRepository.findAll()

    fun deleteByUUID(uuid: UUID): Boolean =
        userRepository.deleteByUUID(uuid)
}