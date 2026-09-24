package com.superadmin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private String planType; // WEEKLY, MONTHLY, QUARTERLY, CUSTOM

    private String status; // ACTIVE, EXPIRED, CANCELLED

    private Double amountPaid;

    private LocalDate startDate;

    private LocalDate endDate;
}
