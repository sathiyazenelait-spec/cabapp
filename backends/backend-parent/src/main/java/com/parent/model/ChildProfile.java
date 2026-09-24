package com.parent.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "child_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChildProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parent_email", nullable = false)
    private String parentEmail;

    @Column(name = "child_name", nullable = false)
    private String childName;

    private int age;
    private String grade;
    private String institution; // School or College Name
    
    @Column(name = "pickup_address")
    private String pickupAddress;

    @Column(name = "drop_address")
    private String dropAddress;

    @Column(name = "passport_photo_url")
    private String passportPhotoUrl; // KYC upload tracking

    @Column(name = "verification_status")
    private String verificationStatus; // VERIFIED, PENDING, REJECTED

    @Column(name = "cab_id")
    private String cabId; // Confirmed cab assignment

    @Column(name = "driver_name")
    private String driverName;

    @Column(name = "driver_phone")
    private String driverPhone;

    @Column(name = "vehicle_plate")
    private String vehiclePlate;

    private String status; // ON_ROUTE, BOARDED, AT_SCHOOL, HOME

    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;
}
