package com.superadmin.repository;

import com.superadmin.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    long countByStatus(String status);
}
