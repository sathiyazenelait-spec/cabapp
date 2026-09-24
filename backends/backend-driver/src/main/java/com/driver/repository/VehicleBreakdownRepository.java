package com.driver.repository;

import com.driver.model.VehicleBreakdown;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleBreakdownRepository extends JpaRepository<VehicleBreakdown, Long> {
    List<VehicleBreakdown> findByOriginalCabId(Long originalCabId);
    List<VehicleBreakdown> findByStatus(String status);
}
