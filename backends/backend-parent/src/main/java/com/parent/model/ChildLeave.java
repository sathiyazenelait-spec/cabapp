package com.parent.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "child_leaves")
public class ChildLeave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "child_id")
    private Long childId = 1L;

    @Column(name = "child_name", nullable = false)
    private String childName;

    @Column(name = "parent_email", nullable = false)
    private String parentEmail;

    @Column(name = "leave_date")
    private LocalDate leaveDate;

    @Column(name = "slot")
    private String slot;

    @Column(name = "reason", nullable = false)
    private String reason;

    @Column(name = "status")
    private String status = "ACTIVE_SKIPPED";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public ChildLeave() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getChildId() { return childId; }
    public void setChildId(Long childId) { this.childId = childId; }

    public String getChildName() { return childName; }
    public void setChildName(String childName) { this.childName = childName; }

    public String getParentEmail() { return parentEmail; }
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }

    public LocalDate getLeaveDate() { return leaveDate; }
    public void setLeaveDate(LocalDate leaveDate) { this.leaveDate = leaveDate; }

    public String getSlot() { return slot; }
    public void setSlot(String slot) { this.slot = slot; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
