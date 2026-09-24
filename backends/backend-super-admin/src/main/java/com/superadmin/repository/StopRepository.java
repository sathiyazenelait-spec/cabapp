package com.superadmin.repository;

import com.superadmin.model.Stop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StopRepository extends JpaRepository<Stop, Long> {
    List<Stop> findByRouteIdOrderBySequenceAsc(Long routeId);
}
