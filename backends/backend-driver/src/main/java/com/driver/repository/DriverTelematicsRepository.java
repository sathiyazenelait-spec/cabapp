package com.driver.repository;

import com.driver.model.DriverTelematics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DriverTelematicsRepository extends JpaRepository<DriverTelematics, Long> {
    Optional<DriverTelematics> findByDriverId(Long driverId);
}
