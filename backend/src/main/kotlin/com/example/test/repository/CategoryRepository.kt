package com.example.test.repository

import com.example.test.model.Category
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository


@Repository
interface CategoryRepository : JpaRepository<Category, Long> {
}