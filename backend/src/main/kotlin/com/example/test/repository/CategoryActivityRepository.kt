package com.example.test.repository

import com.example.test.model.CategoryActivity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository


@Repository
interface CategoryActivityRepository : JpaRepository<CategoryActivity, Long> {
}