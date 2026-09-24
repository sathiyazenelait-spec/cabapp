package com.superadmin.repository;

import com.superadmin.model.SingleTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SingleTripRepository extends JpaRepository<SingleTrip, Long> {
}
