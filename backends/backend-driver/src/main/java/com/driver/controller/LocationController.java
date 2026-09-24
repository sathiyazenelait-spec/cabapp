package com.driver.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@RestController
@RequestMapping("/api/driver")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Thread-safe map to store coordinate updates for each driver/vehicle ID
    private static final Map<String, Map<String, Object>> locationCache = new ConcurrentHashMap<>();

    // Static seed location for fallback/testing
    static {
        Map<String, Object> initialLoc = new HashMap<>();
        initialLoc.put("latitude", 12.9815);
        initialLoc.put("longitude", 80.2450);
        initialLoc.put("timestamp", System.currentTimeMillis());
        locationCache.put("d1", initialLoc);
        locationCache.put("d2", initialLoc);
        locationCache.put("d3", initialLoc);
    }

    @PostMapping("/location")
    public ResponseEntity<?> updateLocation(
            @RequestParam String driverId,
            @RequestParam double latitude,
            @RequestParam double longitude) {
        
        Map<String, Object> coordinates = new HashMap<>();
        coordinates.put("latitude", latitude);
        coordinates.put("longitude", longitude);
        coordinates.put("timestamp", System.currentTimeMillis());
        
        locationCache.put(driverId, coordinates);
        
        // Broadcast location coordinates to STOMP WebSocket broker
        try {
            messagingTemplate.convertAndSend("/topic/location/" + driverId, coordinates);
        } catch (Exception e) {
            // Ignore if messagingTemplate fails
        }
        
        return ResponseEntity.ok(coordinates);
    }

    @GetMapping("/location")
    public ResponseEntity<?> getLocation(@RequestParam String driverId) {
        Map<String, Object> location = locationCache.get(driverId);
        if (location == null) {
            // Default seed location if not found
            location = locationCache.get("d1");
        }
        return ResponseEntity.ok(location);
    }
}
