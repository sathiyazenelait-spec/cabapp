package com.parent.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "single_trips")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SingleTrip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "passenger_name", nullable = false)
    private String passengerName;

    @Column(name = "passenger_email", nullable = false)
    private String passengerEmail;

    @Column(name = "passenger_phone", nullable = false)
    private String passengerPhone;

    @Column(name = "pickup_address", nullable = false)
    private String pickupAddress;

    @Column(name = "drop_address", nullable = false)
    private String dropAddress;

    @Column(name = "pickup_lat")
    private Double pickupLat;

    @Column(name = "pickup_lng")
    private Double pickupLng;

    @Column(name = "drop_lat")
    private Double dropLat;

    @Column(name = "drop_lng")
    private Double dropLng;

    @Column(name = "driver_id")
    private Long driverId;

    @Column(name = "driver_name")
    private String driverName;

    @Column(name = "driver_phone")
    private String driverPhone;

    @Column(name = "vehicle_plate")
    private String vehiclePlate;

    @Column(name = "vehicle_model")
    private String vehicleModel;

    private Double fare;

    @Column(name = "otp_code", nullable = false)
    private String otpCode;

    private String status; // REQUESTED, DISPATCHED_45S, ACCEPTED, ARRIVED, OTP_VERIFIED, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(name = "countdown_seconds")
    private Integer countdownSeconds;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "eta_mins")
    private Integer etaMins;

    @Column(name = "sos_triggered")
    private Boolean sosTriggered;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "otp_verified_at")
    private LocalDateTime otpVerifiedAt;

    @Column(name = "drop_otp_code")
    private String dropOtpCode;

    @Column(name = "payment_status")
    private String paymentStatus; // PENDING, PAID_RAZORPAY_QR, PAID_WALLET, PAID_CASH

    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
