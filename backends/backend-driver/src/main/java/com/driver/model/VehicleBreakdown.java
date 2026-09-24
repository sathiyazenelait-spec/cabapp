package com.driver.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_breakdowns")
public class VehicleBreakdown {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_cab_id")
    private Long originalCabId = 1L;

    @Column(name = "original_vehicle_plate")
    private String originalVehiclePlate = "TN 01 AB 1234";

    @Column(name = "replacement_vehicle_plate")
    private String replacementVehiclePlate = "Force Traveller TN-09-BK-8822";

    @Column(name = "backup_driver_name")
    private String backupDriverName = "Ravi Chandran";

    @Column(name = "backup_driver_phone")
    private String backupDriverPhone = "+91 98402 33445";

    @Column(name = "reason")
    private String reason;

    @Column(name = "status")
    private String status = "BACKUP_DISPATCHED";

    @Column(name = "reported_at")
    private LocalDateTime reportedAt = LocalDateTime.now();

    public VehicleBreakdown() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOriginalCabId() { return originalCabId; }
    public void setOriginalCabId(Long originalCabId) { this.originalCabId = originalCabId; }

    public String getOriginalVehiclePlate() { return originalVehiclePlate; }
    public void setOriginalVehiclePlate(String originalVehiclePlate) { this.originalVehiclePlate = originalVehiclePlate; }

    public String getReplacementVehiclePlate() { return replacementVehiclePlate; }
    public void setReplacementVehiclePlate(String replacementVehiclePlate) { this.replacementVehiclePlate = replacementVehiclePlate; }

    public String getBackupDriverName() { return backupDriverName; }
    public void setBackupDriverName(String backupDriverName) { this.backupDriverName = backupDriverName; }

    public String getBackupDriverPhone() { return backupDriverPhone; }
    public void setBackupDriverPhone(String backupDriverPhone) { this.backupDriverPhone = backupDriverPhone; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getReportedAt() { return reportedAt; }
    public void setReportedAt(LocalDateTime reportedAt) { this.reportedAt = reportedAt; }
}
