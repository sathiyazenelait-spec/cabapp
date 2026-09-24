package com.superadmin.controller;

import com.superadmin.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InstitutionRepository institutionRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Counts
        stats.put("totalUsers", userRepository.count());
        stats.put("activeParents", userRepository.countByRole("ROLE_PARENT"));
        stats.put("studentsCount", userRepository.countByRole("ROLE_STUDENT"));
        stats.put("driversCount", driverRepository.count());
        stats.put("cabOwnersCount", userRepository.countByRole("ROLE_CAB_OWNER"));
        
        stats.put("schoolsCount", institutionRepository.countByType("SCHOOL"));
        stats.put("collegesCount", institutionRepository.countByType("COLLEGE"));
        stats.put("companiesCount", institutionRepository.countByType("COMPANY"));
        
        stats.put("activeVehicles", vehicleRepository.countByVerificationStatus("APPROVED"));
        stats.put("activeRoutes", routeRepository.countByStatus("ACTIVE"));
        stats.put("activeSubscriptions", subscriptionRepository.countByStatus("ACTIVE"));
        
        // Sums and financials
        double totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> "CUSTOMER_PAYMENT".equalsIgnoreCase(p.getType()) && "SUCCESS".equalsIgnoreCase(p.getStatus()))
                .mapToDouble(p -> p.getAmount())
                .sum();
        
        double totalCommission = paymentRepository.findAll().stream()
                .filter(p -> "COMMISSION".equalsIgnoreCase(p.getType()) && "SUCCESS".equalsIgnoreCase(p.getStatus()))
                .mapToDouble(p -> p.getAmount())
                .sum();
        
        // If commission isn't directly loaded, default to 10% of revenue
        if (totalCommission == 0) {
            totalCommission = totalRevenue * 0.10;
        }

        stats.put("revenue", totalRevenue);
        stats.put("commission", totalCommission);

        // Safety/Alerts
        stats.put("complaintsCount", complaintRepository.count());
        stats.put("safetyIncidentsCount", complaintRepository.countByType("SAFETY") + complaintRepository.countByType("SOS"));
        stats.put("todaysTripsCount", routeRepository.countByStatus("ACTIVE") * 2); // Simple dynamic estimate (round-trip per active route)

        return ResponseEntity.ok(stats);
    }
}
