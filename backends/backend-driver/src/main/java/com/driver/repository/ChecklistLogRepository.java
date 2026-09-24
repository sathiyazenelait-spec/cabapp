package com.driver.repository;

import com.driver.model.ChecklistLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChecklistLogRepository extends JpaRepository<ChecklistLog, Long> {
    List<ChecklistLog> findByTripId(Long tripId);
}
