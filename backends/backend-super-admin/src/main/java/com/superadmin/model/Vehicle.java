package com.superadmin.model;

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

    @Column(unique = true, nullable = false)
    private String regNumber;

    private String vehicleType; // CAR, VAN, MINIBUS, BUS

    private Integer capacity;

    private String insurance;

    private String fitnessCertificate;

    private String permit;

    private String rc;

    private String pollutionCertificate;

    private String verificationStatus; // PENDING, APPROVED, REJECTED
}
