package com.example.test.repository

import com.example.test.model.ActivityEnd
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ActivityEndRepository : JpaRepository<ActivityEnd, Long> {
}