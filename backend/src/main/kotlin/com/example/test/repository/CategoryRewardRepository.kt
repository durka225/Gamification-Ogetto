package com.example.test.repository

import com.example.test.model.CategoryReward
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CategoryRewardRepository : JpaRepository<CategoryReward, Long> {
}