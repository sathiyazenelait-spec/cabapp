package com.driver.repository;

import com.driver.model.SafetySweep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SafetySweepRepository extends JpaRepository<SafetySweep, Long> {
    List<SafetySweep> findByTripId(Long tripId);
    List<SafetySweep> findByDriverId(Long driverId);
}
