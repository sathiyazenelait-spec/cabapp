package com.superadmin.repository;

import com.superadmin.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteRepository extends JpaRepository<Route, Long> {
    long countByStatus(String status);
}
