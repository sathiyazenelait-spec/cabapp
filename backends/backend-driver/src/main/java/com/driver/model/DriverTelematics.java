package com.driver.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "driver_telematics")
public class DriverTelematics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "driver_id", nullable = false)
    private Long driverId = 1L;

    @Column(name = "safety_score")
    private Integer safetyScore = 98;

    @Column(name = "harsh_braking_events")
    private Integer harshBrakingEvents = 0;

    @Column(name = "speeding_events")
    private Integer speedingEvents = 0;

    @Column(name = "smooth_acceleration_pct")
    private Integer smoothAccelerationPct = 99;

    @Column(name = "on_time_rating_pct")
    private Integer onTimeRatingPct = 97;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated = LocalDateTime.now();

    public DriverTelematics() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public Integer getSafetyScore() { return safetyScore; }
    public void setSafetyScore(Integer safetyScore) { this.safetyScore = safetyScore; }

    public Integer getHarshBrakingEvents() { return harshBrakingEvents; }
    public void setHarshBrakingEvents(Integer harshBrakingEvents) { this.harshBrakingEvents = harshBrakingEvents; }

    public Integer getSpeedingEvents() { return speedingEvents; }
    public void setSpeedingEvents(Integer speedingEvents) { this.speedingEvents = speedingEvents; }

    public Integer getSmoothAccelerationPct() { return smoothAccelerationPct; }
    public void setSmoothAccelerationPct(Integer smoothAccelerationPct) { this.smoothAccelerationPct = smoothAccelerationPct; }

    public Integer getOnTimeRatingPct() { return onTimeRatingPct; }
    public void setOnTimeRatingPct(Integer onTimeRatingPct) { this.onTimeRatingPct = onTimeRatingPct; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
