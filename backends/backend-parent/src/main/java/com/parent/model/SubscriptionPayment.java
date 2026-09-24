package com.parent.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscription_payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parent_email", nullable = false)
    private String parentEmail;

    @Column(name = "child_id")
    private Long childId;

    private double amount;
    
    @Column(name = "plan_type")
    private String planType; // WEEKLY, MONTHLY, QUARTERLY, ANNUAL
    
    private String status; // SUCCESS, FAILED, PENDING
    
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
    
    @Column(name = "invoice_number")
    private String invoiceNumber;
}
