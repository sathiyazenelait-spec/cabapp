package com.superadmin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String startPoint;

    @Column(nullable = false)
    private String endPoint;

    private String demandLevel; // LOW, MEDIUM, HIGH, HOT

    private Integer totalSeats;

    private Integer availableSeats;

    private Double priceMonthly;

    private Long assignedDriverId;

    private Long assignedVehicleId;

    private String status; // ACTIVE, INACTIVE
}
