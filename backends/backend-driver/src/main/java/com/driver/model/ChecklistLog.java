package com.driver.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "checklist_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "student_name")
    private String studentName;

    private String status; // PENDING, BOARDED, ABSENT
    
    @Column(name = "check_time")
    private LocalDateTime checkTime;
}
