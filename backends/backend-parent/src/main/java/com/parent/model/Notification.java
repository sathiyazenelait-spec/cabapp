package com.parent.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parent_email", nullable = false)
    private String parentEmail;

    private String title;
    private String message;
    private String category; // TRANSPORT, PAYMENTS, SYSTEM, SOS
    private String type; // SOS, ATTENDANCE, PAYMENT, GENERAL
    
    @Column(name = "action_route")
    private String actionRoute;

    @Column(name = "action_text")
    private String actionText;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "sent_time")
    private LocalDateTime sentTime;
}
