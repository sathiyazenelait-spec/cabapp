package com.driver.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "safety_sweeps")
public class SafetySweep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_id")
    private Long tripId = 1L;

    @Column(name = "driver_id")
    private Long driverId = 1L;

    @Column(name = "driver_name")
    private String driverName = "Kumar Swamy";

    @Column(name = "vehicle_plate")
    private String vehiclePlate = "TN 01 AB 1234";

    @Column(name = "rows_inspected")
    private Boolean rowsInspected = true;

    @Column(name = "rear_tag_code")
    private String rearTagCode = "TAG-REAR-001";

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "sleeping_children_count")
    private Integer sleepingChildrenCount = 0;

    @Column(name = "status")
    private String status = "CERTIFIED_CLEAR";

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt = LocalDateTime.now();

    public SafetySweep() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getVehiclePlate() { return vehiclePlate; }
    public void setVehiclePlate(String vehiclePlate) { this.vehiclePlate = vehiclePlate; }

    public Boolean getRowsInspected() { return rowsInspected; }
    public void setRowsInspected(Boolean rowsInspected) { this.rowsInspected = rowsInspected; }

    public String getRearTagCode() { return rearTagCode; }
    public void setRearTagCode(String rearTagCode) { this.rearTagCode = rearTagCode; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public Integer getSleepingChildrenCount() { return sleepingChildrenCount; }
    public void setSleepingChildrenCount(Integer sleepingChildrenCount) { this.sleepingChildrenCount = sleepingChildrenCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
}
