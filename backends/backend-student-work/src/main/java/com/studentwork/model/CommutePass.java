package com.studentwork.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "commute_passes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommutePass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "commuter_type")
    private String commuterType;

    @Column(name = "institution_or_company")
    private String institutionOrCompany;

    @Column(name = "route_id")
    private String routeId;

    @Column(name = "pickup_point")
    private String pickupPoint;

    @Column(name = "drop_point")
    private String dropPoint;

    @Column(name = "pass_type")
    private String passType; // WEEKLY, MONTHLY, QUARTERLY, ANNUAL

    @Column(name = "amount_paid")
    private Double amountPaid;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    private String status; // ACTIVE, EXPIRED, CANCELLED

    @Column(name = "valid_until")
    private LocalDate validUntil;

    @Column(name = "vehicle_number")
    private String vehicleNumber;
}
