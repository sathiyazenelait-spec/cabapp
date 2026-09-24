package com.studentwork.repository;

import com.studentwork.model.CommutePass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommutePassRepository extends JpaRepository<CommutePass, Long> {
    List<CommutePass> findByUserEmail(String userEmail);
}
