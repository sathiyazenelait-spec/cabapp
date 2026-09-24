package com.cabowner.repository;

import com.cabowner.model.DriverAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverAssignmentRepository extends JpaRepository<DriverAssignment, Long> {
    List<DriverAssignment> findByDriverId(Long driverId);
    List<DriverAssignment> findByVehicleId(Long vehicleId);
}
