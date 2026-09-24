package com.driver.service;

import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;

@Service
public class TripLifecycleManager {

    private static final List<String> LIFECYCLE_STATES = Arrays.asList(
            "SCHEDULED",
            "DRIVER_ASSIGNED",
            "TRIP_STARTED",
            "BOARDING",
            "IN_TRANSIT",
            "ARRIVING",
            "COMPLETED"
    );

    public boolean isValidTransition(String currentStatus, String newStatus) {
        if (currentStatus == null || currentStatus.isEmpty()) {
            return "SCHEDULED".equalsIgnoreCase(newStatus) || 
                   "DRIVER_ASSIGNED".equalsIgnoreCase(newStatus) || 
                   "TRIP_STARTED".equalsIgnoreCase(newStatus) ||
                   "RUNNING".equalsIgnoreCase(newStatus);
        }

        int currentIndex = getStatusIndex(currentStatus.toUpperCase());
        int newIndex = getStatusIndex(newStatus.toUpperCase());

        if (currentIndex == -1 || newIndex == -1) {
            return false;
        }

        // Standard lifecycle states must transition strictly to the next sequential step
        return newIndex == currentIndex + 1;
    }

    private int getStatusIndex(String status) {
        if ("RUNNING".equals(status)) {
            return LIFECYCLE_STATES.indexOf("TRIP_STARTED");
        }
        return LIFECYCLE_STATES.indexOf(status);
    }
}
