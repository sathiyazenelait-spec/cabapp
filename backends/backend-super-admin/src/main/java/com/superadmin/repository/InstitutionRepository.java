package com.superadmin.repository;

import com.superadmin.model.Institution;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstitutionRepository extends JpaRepository<Institution, Long> {
    long countByType(String type);
}
