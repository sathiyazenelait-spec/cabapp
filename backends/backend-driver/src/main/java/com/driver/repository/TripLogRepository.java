package com.driver.repository;

import com.driver.model.TripLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripLogRepository extends JpaRepository<TripLog, Long> {
    List<TripLog> findByDriverIdAndStatus(Long driverId, String status);
}
