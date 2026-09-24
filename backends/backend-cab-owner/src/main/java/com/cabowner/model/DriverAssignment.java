package com.cabowner.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "driver_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "driver_id", nullable = false)
    private Long driverId;

    @Column(name = "vehicle_id", nullable = false)
    private Long vehicleId;

    @Column(name = "route_id")
    private Long routeId;

    private String status; // ACTIVE, COMPLETED, CANCELLED
}
