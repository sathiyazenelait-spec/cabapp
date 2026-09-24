package com.cabowner.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reg_number", unique = true, nullable = false)
    private String regNumber;

    @Column(name = "vehicle_type")
    private String vehicleType;

    private int capacity;
    private String insurance;

    @Column(name = "fitness_certificate")
    private String fitnessCertificate;

    private String permit;
    private String rc;

    @Column(name = "pollution_certificate")
    private String pollutionCertificate;

    @Column(name = "verification_status")
    private String verificationStatus; // APPROVED, PENDING, REJECTED
}
