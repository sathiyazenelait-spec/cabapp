package com.parent.repository;

import com.parent.model.ChildLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChildLeaveRepository extends JpaRepository<ChildLeave, Long> {
    List<ChildLeave> findByParentEmail(String parentEmail);
    List<ChildLeave> findByChildId(Long childId);
}
