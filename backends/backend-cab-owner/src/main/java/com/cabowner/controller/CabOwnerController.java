package com.cabowner.controller;

import com.cabowner.model.Vehicle;
import com.cabowner.model.DriverAssignment;
import com.cabowner.repository.VehicleRepository;
import com.cabowner.repository.DriverAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fleet")
@CrossOrigin(origins = "*")
public class CabOwnerController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverAssignmentRepository driverAssignmentRepository;

    @GetMapping
    public ResponseEntity<List<Vehicle>> getFleet() {
        return ResponseEntity.ok(vehicleRepository.findAll());
    }

    @PostMapping("/register")
    public ResponseEntity<Vehicle> registerCab(@RequestBody Vehicle vehicle) {
        if (vehicle.getVerificationStatus() == null) {
            vehicle.setVerificationStatus("PENDING");
        }
        Vehicle saved = vehicleRepository.save(vehicle);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/assign-driver")
    public ResponseEntity<DriverAssignment> assignDriver(@RequestBody DriverAssignment assignment) {
        if (assignment.getStatus() == null) {
            assignment.setStatus("ACTIVE");
        }
        DriverAssignment saved = driverAssignmentRepository.save(assignment);
        return ResponseEntity.ok(saved);
    }

    @Autowired
    private com.cabowner.repository.PaymentRepository paymentRepository;

    @GetMapping("/earnings")
    public ResponseEntity<List<Map<String, Object>>> getEarnings(@RequestParam(required = false) String ownerEmail) {
        String email = ownerEmail != null && !ownerEmail.isEmpty() ? ownerEmail : "kumar@cabs.com";
        List<com.cabowner.model.Payment> payments = paymentRepository.findByRecipientEmailOrType(email, "DRIVER_PAYOUT");

        List<Map<String, Object>> result = new java.util.ArrayList<>();
        if (!payments.isEmpty()) {
            for (com.cabowner.model.Payment p : payments) {
                Map<String, Object> earn = new HashMap<>();
                earn.put("id", "e" + p.getId());
                earn.put("period", p.getPaymentDate() != null ? p.getPaymentDate().toLocalDate().toString() : "Current Cycle");
                earn.put("grossEarnings", p.getAmount() * 1.11);
                earn.put("commission", p.getAmount() * 0.11);
                earn.put("netPayout", p.getAmount());
                earn.put("status", "SUCCESS".equalsIgnoreCase(p.getStatus()) ? "paid" : "pending");
                result.add(earn);
            }
        } else {
            // Seed defaults into database if newly initialized
            com.cabowner.model.Payment p1 = new com.cabowner.model.Payment(null, "platform@safepassage.ai", email, 13860.0, "DRIVER_PAYOUT", "SUCCESS", java.time.LocalDateTime.now().minusDays(3), "PAYOUT_2026_01", "IMPS_TRANSFER", "Weekly Driver Settlement");
            com.cabowner.model.Payment p2 = new com.cabowner.model.Payment(null, "platform@safepassage.ai", email, 16380.0, "DRIVER_PAYOUT", "SUCCESS", java.time.LocalDateTime.now().minusDays(10), "PAYOUT_2026_02", "IMPS_TRANSFER", "Weekly Driver Settlement");
            paymentRepository.saveAll(List.of(p1, p2));

            Map<String, Object> earn1 = new HashMap<>();
            earn1.put("id", "e" + p1.getId());
            earn1.put("period", "Aug 17 - Aug 23, 2026");
            earn1.put("grossEarnings", 15400);
            earn1.put("commission", 1540);
            earn1.put("netPayout", 13860);
            earn1.put("status", "paid");
            result.add(earn1);

            Map<String, Object> earn2 = new HashMap<>();
            earn2.put("id", "e" + p2.getId());
            earn2.put("period", "Aug 10 - Aug 16, 2026");
            earn2.put("grossEarnings", 18200);
            earn2.put("commission", 1820);
            earn2.put("netPayout", 16380);
            earn2.put("status", "paid");
            result.add(earn2);
        }

        return ResponseEntity.ok(result);
    }

    @PutMapping("/vehicles/{id}/status")
    public ResponseEntity<?> updateVehicleLifecycle(@PathVariable Long id, @RequestParam String status) {
        return vehicleRepository.findById(id).map(v -> {
            v.setVerificationStatus(status.toUpperCase());
            vehicleRepository.save(v);
            Map<String, Object> res = new HashMap<>();
            res.put("vehicleId", v.getId());
            res.put("regNumber", v.getRegNumber());
            res.put("verificationStatus", v.getVerificationStatus());
            res.put("message", "Vehicle lifecycle status updated to " + status.toUpperCase());
            return ResponseEntity.ok(res);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/vehicles/{id}/driver-pairing")
    public ResponseEntity<?> getVehicleDriverPairing(@PathVariable Long id) {
        return vehicleRepository.findById(id).map(v -> {
            Map<String, Object> pairing = new HashMap<>();
            pairing.put("vehicleId", v.getId());
            pairing.put("regNumber", v.getRegNumber());
            pairing.put("vehicleType", v.getVehicleType());
            pairing.put("capacity", v.getCapacity());
            pairing.put("pairedDriverName", "Kumar Swamy");
            pairing.put("pairedDriverPhone", "+91 98401 23456");
            pairing.put("pairingStatus", "ACTIVE_PAIRED");
            pairing.put("pairedSince", "2026-06-15");
            return ResponseEntity.ok(pairing);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ledger")
    public ResponseEntity<Map<String, Object>> getFleetLedger(@RequestParam(required = false) String ownerEmail) {
        String email = ownerEmail != null && !ownerEmail.isEmpty() ? ownerEmail : "kumar@cabs.com";

        Map<String, Object> ledger = new HashMap<>();
        ledger.put("ownerEmail", email);
        ledger.put("totalGrossRevenue", 46100.0);
        ledger.put("totalPlatformCommission", 4610.0); // 10%
        ledger.put("totalEscrowHoldback", 2305.0); // 5%
        ledger.put("fuelSubsidiesCredit", 950.0);
        ledger.put("netDisbursed", 40135.0);
        ledger.put("escrowAvailableForRelease", 2305.0);

        List<Map<String, Object>> entries = new java.util.ArrayList<>();

        Map<String, Object> entry1 = new HashMap<>();
        entry1.put("id", "TXN-LEDGER-001");
        entry1.put("date", "2026-09-14");
        entry1.put("tripRef", "TRIP-SHUTTLE-8819");
        entry1.put("vehiclePlate", "TN 01 AB 1234");
        entry1.put("driverName", "Kumar Swamy");
        entry1.put("grossFare", 3800.0);
        entry1.put("commission", 380.0);
        entry1.put("escrowDeduction", 190.0);
        entry1.put("netPayout", 3230.0);
        entry1.put("status", "SETTLED");
        entry1.put("bankRef", "IMPS-HDFC-991204");
        entries.add(entry1);

        Map<String, Object> entry2 = new HashMap<>();
        entry2.put("id", "TXN-LEDGER-002");
        entry2.put("date", "2026-09-13");
        entry2.put("tripRef", "TRIP-SHUTTLE-8802");
        entry2.put("vehiclePlate", "TN 02 CD 5678");
        entry2.put("driverName", "Ravi Chandran");
        entry2.put("grossFare", 4200.0);
        entry2.put("commission", 420.0);
        entry2.put("escrowDeduction", 210.0);
        entry2.put("netPayout", 3570.0);
        entry2.put("status", "SETTLED");
        entry2.put("bankRef", "IMPS-ICICI-441920");
        entries.add(entry2);

        Map<String, Object> entry3 = new HashMap<>();
        entry3.put("id", "TXN-LEDGER-003");
        entry3.put("date", "2026-09-15");
        entry3.put("tripRef", "TRIP-SHUTTLE-8840");
        entry3.put("vehiclePlate", "TN 01 AB 1234");
        entry3.put("driverName", "Kumar Swamy");
        entry3.put("grossFare", 2900.0);
        entry3.put("commission", 290.0);
        entry3.put("escrowDeduction", 145.0);
        entry3.put("netPayout", 2465.0);
        entry3.put("status", "ESCROW_LOCKED");
        entry3.put("bankRef", "PENDING_CYCLE_CLOSE");
        entries.add(entry3);

        ledger.put("transactions", entries);
        return ResponseEntity.ok(ledger);
    }
}
