package com.superadmin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String email;

    private String phone;

    private Long assignedVehicleId;

    private Double rating;

    private Integer tripCount;

    private Double cancellationRate;

    private Integer complaintsCount;

    private Double earnings;

    private Integer safetyIncidentsCount;

    private String status; // ACTIVE, SUSPENDED
}
