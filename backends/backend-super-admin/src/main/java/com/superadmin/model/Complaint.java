package com.superadmin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reporterEmail;

    @Lob
    private String details;

    private String status; // INVESTIGATION, RESOLVED, PENDING

    private String type; // SAFETY, VEHICLE, DRIVER, SOS

    private LocalDateTime incidentDate;
}
