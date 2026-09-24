package com.superadmin.repository;

import com.superadmin.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    long countByType(String type);
    long countByStatus(String status);
}
