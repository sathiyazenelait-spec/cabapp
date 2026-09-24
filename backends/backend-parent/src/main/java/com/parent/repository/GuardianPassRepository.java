package com.parent.repository;

import com.parent.model.GuardianPass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuardianPassRepository extends JpaRepository<GuardianPass, Long> {
    List<GuardianPass> findByParentEmail(String parentEmail);
    Optional<GuardianPass> findByPinAndStatus(String pin, String status);
}
