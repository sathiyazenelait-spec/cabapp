package com.parent.controller;

import com.parent.model.Notification;
import com.parent.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parent/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@RequestParam(required = false, defaultValue = "priya.sharma@gmail.com") String email) {
        List<Notification> list = notificationRepository.findByParentEmailOrderBySentTimeDesc(email);
        if (list.isEmpty()) {
            // Seed sample rich notifications for demo
            Notification n1 = new Notification(null, email, "Boarding Successful • Arun Kumar",
                    "Arun Kumar boarded vehicle TN 01 AB 1234 at Mehta Nagar Arch. Dynamic OTP verified.",
                    "TRANSPORT", "ATTENDANCE", "LiveTrack", "Live Track", false, LocalDateTime.now().minusMinutes(12));

            Notification n2 = new Notification(null, email, "Geofence Radar Entry Alert",
                    "Cab TN 01 AB 1234 is within 0.5 miles corridor. Estimated arrival at school in 6 mins.",
                    "TRANSPORT", "GENERAL", "LiveTrack", "Open Radar", false, LocalDateTime.now().minusMinutes(24));

            Notification n3 = new Notification(null, email, "Monthly Subscription Receipt",
                    "Invoice #INV-2026-904 for ₹3,000 paid successfully for Green Valley School route.",
                    "PAYMENTS", "PAYMENT", "Payments", "View Invoice", true, LocalDateTime.now().minusDays(1));

            Notification n4 = new Notification(null, email, "Fleet Safety Sweep Completed",
                    "Driver Kumar completed end-of-trip safety check. Zero students remaining in vehicle confirmed.",
                    "SOS", "SOS", null, null, true, LocalDateTime.now().minusDays(1));

            Notification n5 = new Notification(null, email, "Special Route Match Discount",
                    "College and Corporate morning passes are eligible for 10% cash rebate this term.",
                    "SYSTEM", "GENERAL", null, null, true, LocalDateTime.now().minusDays(2));

            notificationRepository.saveAll(List.of(n1, n2, n3, n4, n5));
            list = notificationRepository.findByParentEmailOrderBySentTimeDesc(email);
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Notification>> getAllNotifications(@RequestParam(required = false, defaultValue = "priya.sharma@gmail.com") String email) {
        return getNotifications(email);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        return notificationRepository.findById(id)
                .map(n -> {
                    n.setIsRead(true);
                    notificationRepository.save(n);
                    return ResponseEntity.ok(Map.of("id", id, "status", "READ", "isRead", true));
                })
                .orElse(ResponseEntity.ok(Map.of("id", id, "status", "READ", "isRead", true)));
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(@RequestParam(required = false, defaultValue = "priya.sharma@gmail.com") String email) {
        List<Notification> list = notificationRepository.findByParentEmailOrderBySentTimeDesc(email);
        for (Notification n : list) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(list);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "All notifications marked as read"));
    }

    @PostMapping("/trigger")
    public ResponseEntity<?> triggerFcmNotification(@RequestBody Map<String, String> payload) {
        String email = payload.getOrDefault("email", "priya.sharma@gmail.com");
        String title = payload.getOrDefault("title", "SOS Alert Triggered");
        String message = payload.getOrDefault("message", "Emergency SOS triggered for child transit");
        String category = payload.getOrDefault("category", "SOS");
        String type = payload.getOrDefault("type", "SOS");

        Notification notification = new Notification();
        notification.setParentEmail(email);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setCategory(category);
        notification.setType(type);
        notification.setIsRead(false);
        notification.setSentTime(LocalDateTime.now());

        Notification saved = notificationRepository.save(notification);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "FCM Notification dispatched.");
        response.put("notification", saved);

        return ResponseEntity.ok(response);
    }
}
