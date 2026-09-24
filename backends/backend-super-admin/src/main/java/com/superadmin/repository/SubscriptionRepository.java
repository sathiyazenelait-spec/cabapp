package com.superadmin.repository;

import com.superadmin.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    long countByStatus(String status);
}
