package com.driver.repository;

import com.driver.model.SingleTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SingleTripRepository extends JpaRepository<SingleTrip, Long> {
    List<SingleTrip> findByDriverIdOrderByRequestedAtDesc(Long driverId);
    Optional<SingleTrip> findFirstByDriverIdAndStatusInOrderByRequestedAtDesc(Long driverId, List<String> statuses);
    List<SingleTrip> findByStatusOrderByRequestedAtDesc(String status);
    Optional<SingleTrip> findFirstByStatusOrderByRequestedAtDesc(String status);
}
