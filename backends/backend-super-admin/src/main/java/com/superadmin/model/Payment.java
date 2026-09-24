package com.superadmin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String payerEmail;

    private String recipientEmail;

    private Double amount;

    private String type; // CUSTOMER_PAYMENT, DRIVER_PAYOUT, OWNER_EARNING, COMMISSION

    private String status; // SUCCESS, PENDING, FAILED

    private LocalDateTime paymentDate;

    private String invoiceNo;
}
