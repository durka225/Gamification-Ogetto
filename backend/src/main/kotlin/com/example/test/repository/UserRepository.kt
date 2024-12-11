package com.example.test.repository

import com.example.test.model.Role
import com.example.test.model.User
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Repository
import java.util.*

@Repository
class UserRepository (
    private val encoder: PasswordEncoder
) {

    // Изменяемый список бользователей по модели User
    private val users = mutableListOf(
        User(
            id = UUID.randomUUID(),
            login = "login1",
            password = encoder.encode("password1"),
            role = Role.admin,
            point = 1000,
            email =  "email1@gmail.com"
        ),
        User(
            id = UUID.randomUUID(),
            login = "login2",
            password = encoder.encode("password2"),
            role = Role.user,
            point = 500,
            email =  "email2@gmail.com"
        ),
        User(
            id = UUID.randomUUID(),
            login = "login3",
            password = encoder.encode("password3"),
            role = Role.manager,
            point = 0,
            email =  "email3@gmail.com"
        ),
    )

    // Функция добавления нового пользователя
    // Принимает на вход данные по модели User
    // В переменную update записывает список User с шифрованным паролем
    // Возвращает true, если добавление прошло успешно, иначе false
    fun addUser (user: User): Boolean {
        val updated = user.copy(password = encoder.encode(user.password))
        return users.add(updated)
    }

    // Функция поиска пользователя по email
    // Возвращает объект User, если пользователь с таким email найден, иначе null
    fun findByEmail(email: String): User? =
        users
            .firstOrNull { it.email == email }

    // Функция получения всех пользователей
    fun findAll(): List<User> = users

    // Функция поиска пользователя по UUID
    // Возвращает объект User, если пользователь с таким UUID найден, иначе null
    fun findByUUID(uuid: UUID): User? =
        users
            .firstOrNull { it.id == uuid }

        
    // Фуункция удаления пользователя по UUID
    // Ищет пользователя по UUID
    // Если найденный пользователь не существует, то возврат falst
    // Если пользователь найден, то удаляет его и возращает true
    fun deleteByUUID(uuid: UUID): Boolean {
        val foundUser = findByUUID(uuid)

        return foundUser?.let {
            users.remove(it)
        } ?: false
    }

    // Функция обновления данных пользователя
    fun updateUser(uuid: UUID, updatedUser: User): Boolean {
        val index = users.indexOfFirst { it.id == uuid }
        if (index == -1) return false

        val updated = updatedUser.copy(
            id = uuid,
            password = encoder.encode(updatedUser.password)
        )
        users[index] = updated
        return true
    }
}