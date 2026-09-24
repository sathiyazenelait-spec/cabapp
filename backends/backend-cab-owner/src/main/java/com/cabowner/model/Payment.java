package com.cabowner.model;

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

    @Column(name = "payer_email", nullable = false)
    private String payerEmail;

    @Column(name = "recipient_email", nullable = false)
    private String recipientEmail;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String type; // 'CUSTOMER_PAYMENT', 'DRIVER_PAYOUT', 'COMMISSION', 'WALLET_TOPUP'

    @Column(nullable = false)
    private String status;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "invoice_no", nullable = false)
    private String invoiceNo;

    @Column(name = "payment_method")
    private String paymentMethod;

    private String description;
}
