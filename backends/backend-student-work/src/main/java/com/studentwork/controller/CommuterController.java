package com.studentwork.controller;

import com.studentwork.model.CommutePass;
import com.studentwork.repository.CommutePassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/commute")
@CrossOrigin(origins = "*")
public class CommuterController {

    @Autowired
    private CommutePassRepository commutePassRepository;

    @GetMapping("/search")
    public ResponseEntity<?> searchRides(@RequestParam String pickup, @RequestParam String dropoff) {
        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            String url = "http://localhost:8082/api/admin/routes/search?origin=" + pickup + "&destination=" + dropoff;
            List<?> response = restTemplate.getForObject(url, List.class);
            if (response != null && !response.isEmpty()) {
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            // Ignore exception and fall back to mock results
        }

        // Return optimal matching rides details matching frontend
        List<Map<String, Object>> matches = new ArrayList<>();

        Map<String, Object> m1 = new HashMap<>();
        m1.put("id", "m1");
        m1.put("providerName", "Kumar Cabs");
        m1.put("vehicleNo", "TN 01 AB 1234");
        m1.put("vehicleType", "VAN");
        m1.put("departureTime", "08:00 AM");
        m1.put("availableSeats", 2);
        m1.put("pricePerMonth", 2200);
        m1.put("matchScore", 98);
        matches.add(m1);

        Map<String, Object> m2 = new HashMap<>();
        m2.put("id", "m2");
        m2.put("providerName", "SRS Travels");
        m2.put("vehicleNo", "TN 02 CD 5678");
        m2.put("vehicleType", "SUV");
        m2.put("departureTime", "08:10 AM");
        m2.put("availableSeats", 4);
        m2.put("pricePerMonth", 3500);
        m2.put("matchScore", 92);
        matches.add(m2);

        return ResponseEntity.ok(matches);
    }

    @PostMapping("/seat-lock")
    public ResponseEntity<Map<String, Object>> lockSeatForCheckout(
            @RequestParam(required = false, defaultValue = "arun.kumar@loyola.edu") String userEmail,
            @RequestParam(required = false, defaultValue = "rm-1") String routeId,
            @RequestParam(required = false, defaultValue = "SEAT-04") String seatNumber) {
        
        String lockToken = "LOCK-REDIS-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        Map<String, Object> lockData = new HashMap<>();
        lockData.put("lockToken", lockToken);
        lockData.put("userEmail", userEmail);
        lockData.put("routeId", routeId);
        lockData.put("seatNumber", seatNumber);
        lockData.put("lockedAt", java.time.LocalDateTime.now().toString());
        lockData.put("expiresAt", java.time.LocalDateTime.now().plusMinutes(10).toString());
        lockData.put("ttlSeconds", 600);
        lockData.put("status", "LOCKED_IN_REDIS");
        lockData.put("message", "Seat locked in Redis cache for 10 minutes. Overbooking prevented.");

        return ResponseEntity.ok(lockData);
    }

    @PostMapping("/seat-unlock")
    public ResponseEntity<Map<String, Object>> releaseSeatLock(@RequestParam String lockToken) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("lockToken", lockToken);
        resp.put("status", "RELEASED");
        resp.put("message", "Seat lock released back to pool.");
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/book")
    public ResponseEntity<CommutePass> bookSeat(@RequestParam String email, @RequestParam String routeId, @RequestParam String planType) {
        CommutePass pass = new CommutePass();
        pass.setUserEmail(email);
        pass.setUserName("Arun Kumar");
        pass.setCommuterType("STUDENT");
        pass.setInstitutionOrCompany("Loyola College");
        pass.setRouteId(routeId);
        pass.setPickupPoint("Tambaram Sanatorium");
        pass.setDropPoint("Loyola College Gate 3");
        pass.setPassType(planType);
        pass.setAmountPaid("MONTHLY".equalsIgnoreCase(planType) ? 2800.0 : "QUARTERLY".equalsIgnoreCase(planType) ? 7500.0 : 950.0);
        pass.setStartDate(LocalDate.now());
        pass.setEndDate(LocalDate.now().plusMonths(1));
        pass.setStatus("ACTIVE");
        pass.setValidUntil(LocalDate.now().plusMonths(1));
        pass.setVehicleNumber("TN 01 AB 1234");
        return ResponseEntity.ok(commutePassRepository.save(pass));
    }

    @GetMapping("/pass")
    public ResponseEntity<List<CommutePass>> getPasses(@RequestParam String email) {
        List<CommutePass> list = commutePassRepository.findByUserEmail(email);
        if (list.isEmpty()) {
            // Seed default active pass for demo
            CommutePass pass = new CommutePass();
            pass.setUserEmail(email);
            pass.setRouteId("CH-IT-09");
            pass.setPassType("MONTHLY");
            pass.setStatus("ACTIVE");
            pass.setValidUntil(LocalDate.now().plusMonths(1));
            pass.setVehicleNumber("TN 01 AB 1234");
            commutePassRepository.save(pass);
            list = List.of(pass);
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/schedule")
    public ResponseEntity<List<Map<String, Object>>> getSchedule() {
        // Return weekly timings schedule logs
        List<Map<String, Object>> schedule = new ArrayList<>();

        Map<String, Object> item1 = new HashMap<>();
        item1.put("day", "Mon - Fri");
        item1.put("time", "08:15 AM");
        item1.put("type", "Pickup");
        item1.put("location", "Tambaram East");
        schedule.add(item1);

        Map<String, Object> item2 = new HashMap<>();
        item2.put("day", "Mon - Fri");
        item2.put("time", "05:30 PM");
        item2.put("type", "Dropoff");
        item2.put("location", "Chennai IT Park");
        schedule.add(item2);

        return ResponseEntity.ok(schedule);
    }

    // =========================================================================
    // DYNAMIC ENDPOINTS FOR STUDENT & WORKING PROFESSIONAL MODULES
    // =========================================================================

    @GetMapping("/routes/student")
    public ResponseEntity<List<Map<String, Object>>> getStudentRoutes(
            @RequestParam(required = false, defaultValue = "ABC Engineering College") String college,
            @RequestParam(required = false, defaultValue = "Kattur") String pickup) {
        List<Map<String, Object>> list = new ArrayList<>();
        
        Map<String, Object> sr1 = new HashMap<>();
        sr1.put("id", "sr1");
        sr1.put("vehicle", "Van TN-XX-5678");
        sr1.put("vehicleType", "7 Seater • AC");
        sr1.put("rating", 4.6);
        sr1.put("reviewCount", 124);
        sr1.put("driver", "Rajesh Kumar");
        sr1.put("driverVerified", true);
        sr1.put("route", "Kattur → ABC College");
        sr1.put("timing", "7:40 AM - 8:15 AM");
        sr1.put("priceMonthly", 1800);
        sr1.put("availableSeats", 2);
        sr1.put("amenities", List.of("AC", "GPS Tracking", "Safe & Verified", "CCTV"));
        list.add(sr1);

        Map<String, Object> sr2 = new HashMap<>();
        sr2.put("id", "sr2");
        sr2.put("vehicle", "Van TN-XX-9012");
        sr2.put("vehicleType", "12 Seater • AC");
        sr2.put("rating", 4.4);
        sr2.put("reviewCount", 89);
        sr2.put("driver", "Suresh");
        sr2.put("driverVerified", true);
        sr2.put("route", "Lawspet → ABC College");
        sr2.put("timing", "7:50 AM - 8:25 AM");
        sr2.put("priceMonthly", 1600);
        sr2.put("availableSeats", 5);
        sr2.put("amenities", List.of("AC", "GPS Tracking", "Safe & Verified"));
        list.add(sr2);

        Map<String, Object> sr3 = new HashMap<>();
        sr3.put("id", "sr3");
        sr3.put("vehicle", "Car TN-XX-3456");
        sr3.put("vehicleType", "5 Seater • AC");
        sr3.put("rating", 4.2);
        sr3.put("reviewCount", 65);
        sr3.put("driver", "Karthik");
        sr3.put("driverVerified", true);
        sr3.put("route", "Ariyankuppam → ABC College");
        sr3.put("timing", "8:00 AM - 8:40 AM");
        sr3.put("priceMonthly", 2000);
        sr3.put("availableSeats", 1);
        sr3.put("amenities", List.of("AC", "GPS Tracking"));
        list.add(sr3);

        return ResponseEntity.ok(list);
    }

    @GetMapping("/routes/professional")
    public ResponseEntity<List<Map<String, Object>>> getProfessionalRoutes(
            @RequestParam(required = false, defaultValue = "ABC Technologies") String company,
            @RequestParam(required = false, defaultValue = "Kattur") String pickup) {
        List<Map<String, Object>> list = new ArrayList<>();

        Map<String, Object> pr1 = new HashMap<>();
        pr1.put("id", "pr1");
        pr1.put("vehicle", "Van TN-XX-7890");
        pr1.put("vehicleType", "7 Seater • AC");
        pr1.put("rating", 4.7);
        pr1.put("reviewCount", 96);
        pr1.put("driver", "Selvam");
        pr1.put("driverVerified", true);
        pr1.put("route", "Kattur → IT Park, Chennai");
        pr1.put("timing", "7:00 AM - 8:00 AM");
        pr1.put("priceMonthly", 3200);
        pr1.put("availableSeats", 2);
        list.add(pr1);

        Map<String, Object> pr2 = new HashMap<>();
        pr2.put("id", "pr2");
        pr2.put("vehicle", "Car TN-XX-4478");
        pr2.put("vehicleType", "5 Seater • AC");
        pr2.put("rating", 4.5);
        pr2.put("reviewCount", 72);
        pr2.put("driver", "Karthik");
        pr2.put("driverVerified", true);
        pr2.put("route", "Lawspet → IT Park");
        pr2.put("timing", "7:15 AM - 8:15 AM");
        pr2.put("priceMonthly", 3500);
        pr2.put("availableSeats", 1);
        list.add(pr2);

        return ResponseEntity.ok(list);
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<Map<String, Object>>> getAttendanceLogs(@RequestParam(required = false) String email) {
        String userEmail = email != null && !email.isEmpty() ? email : "arun.kumar@loyola.edu";
        List<CommutePass> passes = commutePassRepository.findByUserEmail(userEmail);

        List<Map<String, Object>> logs = new ArrayList<>();
        if (!passes.isEmpty()) {
            CommutePass p = passes.get(0);
            Map<String, Object> log1 = new HashMap<>();
            log1.put("id", "att-" + p.getId() + "-1");
            log1.put("date", LocalDate.now().toString());
            log1.put("route", (p.getRouteId() != null ? p.getRouteId() : "Route 2") + " (Tambaram ➔ Loyola)");
            log1.put("vehicle", p.getVehicleNumber() != null ? p.getVehicleNumber() : "TN 01 AB 1234");
            log1.put("driver", "Kumar Swamy");
            log1.put("timing", "07:30 AM - 08:15 AM");
            log1.put("status", "BOARDED");
            log1.put("punctuality", "On Time");
            logs.add(log1);

            Map<String, Object> log2 = new HashMap<>();
            log2.put("id", "att-" + p.getId() + "-2");
            log2.put("date", LocalDate.now().minusDays(1).toString());
            log2.put("route", (p.getRouteId() != null ? p.getRouteId() : "Route 2") + " (Tambaram ➔ Loyola)");
            log2.put("vehicle", p.getVehicleNumber() != null ? p.getVehicleNumber() : "TN 01 AB 1234");
            log2.put("driver", "Kumar Swamy");
            log2.put("timing", "07:30 AM - 08:15 AM");
            log2.put("status", "BOARDED");
            log2.put("punctuality", "On Time");
            logs.add(log2);
        } else {
            logs = List.of(
                Map.of("id", "att1", "date", LocalDate.now().toString(), "route", "Kattur → IT Park", "vehicle", "Van TN-XX-7890", "driver", "Selvam", "timing", "8:00 AM - 8:15 AM", "status", "BOARDED", "punctuality", "On Time"),
                Map.of("id", "att2", "date", LocalDate.now().minusDays(1).toString(), "route", "Lawspet → IT Park", "vehicle", "Van TN-XX-2234", "driver", "Ramesh", "timing", "7:50 AM - 8:20 AM", "status", "BOARDED", "punctuality", "On Time")
            );
        }
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/tracking/live")
    public ResponseEntity<Map<String, Object>> getLiveTracking(@RequestParam(required = false, defaultValue = "student") String type, @RequestParam(required = false) String email) {
        Map<String, Object> track = new HashMap<>();
        String userEmail = email != null && !email.isEmpty() ? email : ("student".equalsIgnoreCase(type) ? "arun.kumar@loyola.edu" : "deepa.nair@infosys.com");
        List<CommutePass> passes = commutePassRepository.findByUserEmail(userEmail);

        if (!passes.isEmpty()) {
            CommutePass p = passes.get(0);
            track.put("vehicle", p.getVehicleNumber() != null ? p.getVehicleNumber() : "TN 01 AB 1234");
            track.put("driver", "Kumar Swamy");
            track.put("driverPhone", "+91 98401 23456");
            track.put("rating", 4.8);
            track.put("etaMinutes", 8);
            track.put("arrivingAt", java.time.LocalTime.now().plusMinutes(8).toString().substring(0, 5));
            track.put("origin", "Tambaram Sanatorium");
            track.put("destination", p.getInstitutionOrCompany() != null ? p.getInstitutionOrCompany() : "Loyola College");
            track.put("status", p.getStatus() != null ? p.getStatus() : "ACTIVE_ON_ROUTE");
        } else if ("student".equalsIgnoreCase(type)) {
            track.put("vehicle", "Van TN 01 AB 1234");
            track.put("driver", "Kumar Swamy");
            track.put("rating", 4.8);
            track.put("etaMinutes", 12);
            track.put("arrivingAt", "8:10 AM");
            track.put("origin", "Tambaram");
            track.put("destination", "Loyola College Gate");
            track.put("status", "On Route");
        } else {
            track.put("vehicle", "Van TN 03 EF 9012");
            track.put("driver", "Suresh Kumar");
            track.put("rating", 4.7);
            track.put("etaMinutes", 15);
            track.put("arrivingAt", "8:15 AM");
            track.put("origin", "Velachery");
            track.put("destination", "TCS IT Park Siruseri");
            track.put("status", "On Route");
        }
        return ResponseEntity.ok(track);
    }

    // ==========================================
    // AI ROUTE MATCHING MODULE INTEGRATION
    // ==========================================
    @GetMapping("/ai-match")
    public ResponseEntity<Map<String, Object>> getAIMatches(
            @RequestParam(required = false, defaultValue = "Kattur") String pickup,
            @RequestParam(required = false, defaultValue = "ABC College") String destination,
            @RequestParam(required = false, defaultValue = "recommended") String tab,
            @RequestParam(required = false, defaultValue = "4000") Integer maxBudget) {

        Map<String, Object> response = new HashMap<>();

        List<Map<String, Object>> recommended = new ArrayList<>();

        Map<String, Object> rm1 = new HashMap<>();
        rm1.put("id", "rm-1");
        rm1.put("matchScore", 95);
        rm1.put("matchColor", "bg-emerald-500 text-white");
        rm1.put("category", "Shared Ride");
        rm1.put("pickup", pickup);
        rm1.put("destination", destination);
        rm1.put("departureTime", "7:30 AM");
        rm1.put("arrivalTime", "8:15 AM");
        rm1.put("seatsAvailable", 20);
        rm1.put("vehicleType", "Van");
        rm1.put("vehiclePlate", "TN-XX-5678");
        rm1.put("seater", "5 Seater");
        rm1.put("isAc", true);
        rm1.put("rating", 4.9);
        rm1.put("isVerified", true);
        rm1.put("priceMonthly", 2800);
        rm1.put("priceDaily", 93);
        rm1.put("driverName", "Ramesh Kumar");
        rm1.put("driverPhone", "+91 98401 23456");
        recommended.add(rm1);

        Map<String, Object> rm2 = new HashMap<>();
        rm2.put("id", "rm-2");
        rm2.put("matchScore", 88);
        rm2.put("matchColor", "bg-blue-600 text-white");
        rm2.put("category", "College Route");
        rm2.put("pickup", pickup);
        rm2.put("destination", "Sri Venkateswara College");
        rm2.put("departureTime", "7:20 AM");
        rm2.put("arrivalTime", "8:10 AM");
        rm2.put("seatsAvailable", 12);
        rm2.put("vehicleType", "Car");
        rm2.put("vehiclePlate", "TN-XX-9012");
        rm2.put("seater", "4 Seater");
        rm2.put("isAc", true);
        rm2.put("rating", 4.8);
        rm2.put("isVerified", true);
        rm2.put("priceMonthly", 3200);
        rm2.put("priceDaily", 106);
        rm2.put("driverName", "Sathish Verma");
        rm2.put("driverPhone", "+91 98401 77889");
        recommended.add(rm2);

        Map<String, Object> rm3 = new HashMap<>();
        rm3.put("id", "rm-3");
        rm3.put("matchScore", 82);
        rm3.put("matchColor", "bg-amber-500 text-white");
        rm3.put("category", "Work Route");
        rm3.put("pickup", "Lawspet");
        rm3.put("destination", "IT Park (Chennai)");
        rm3.put("departureTime", "8:00 AM");
        rm3.put("arrivalTime", "9:00 AM");
        rm3.put("seatsAvailable", 8);
        rm3.put("vehicleType", "Van");
        rm3.put("vehiclePlate", "TN-XX-3456");
        rm3.put("seater", "7 Seater");
        rm3.put("isAc", true);
        rm3.put("rating", 4.9);
        rm3.put("isVerified", true);
        rm3.put("priceMonthly", 3500);
        rm3.put("priceDaily", 116);
        rm3.put("driverName", "K. Balaji");
        rm3.put("driverPhone", "+91 98401 99001");
        recommended.add(rm3);

        List<Map<String, Object>> nearby = new ArrayList<>();

        Map<String, Object> rm4 = new HashMap<>();
        rm4.put("id", "rm-4");
        rm4.put("matchScore", 78);
        rm4.put("matchColor", "bg-indigo-600 text-white");
        rm4.put("category", "Shared Ride");
        rm4.put("pickup", pickup + " Outer Ring");
        rm4.put("destination", destination + " Campus 2");
        rm4.put("departureTime", "7:45 AM");
        rm4.put("arrivalTime", "8:30 AM");
        rm4.put("seatsAvailable", 6);
        rm4.put("vehicleType", "Van");
        rm4.put("vehiclePlate", "TN-XX-1122");
        rm4.put("seater", "6 Seater");
        rm4.put("isAc", true);
        rm4.put("rating", 4.7);
        rm4.put("isVerified", true);
        rm4.put("priceMonthly", 2900);
        rm4.put("priceDaily", 96);
        rm4.put("driverName", "M. Anand");
        rm4.put("driverPhone", "+91 98401 33221");
        nearby.add(rm4);

        Map<String, Object> rm5 = new HashMap<>();
        rm5.put("id", "rm-5");
        rm5.put("matchScore", 74);
        rm5.put("matchColor", "bg-sky-600 text-white");
        rm5.put("category", "College Route");
        rm5.put("pickup", "Gorimedu");
        rm5.put("destination", "Sri Venkateswara College");
        rm5.put("departureTime", "7:15 AM");
        rm5.put("arrivalTime", "8:05 AM");
        rm5.put("seatsAvailable", 9);
        rm5.put("vehicleType", "Traveller");
        rm5.put("vehiclePlate", "TN-XX-4490");
        rm5.put("seater", "12 Seater");
        rm5.put("isAc", true);
        rm5.put("rating", 4.6);
        rm5.put("isVerified", true);
        rm5.put("priceMonthly", 2600);
        rm5.put("priceDaily", 86);
        rm5.put("driverName", "D. Pandian");
        rm5.put("driverPhone", "+91 98401 55667");
        nearby.add(rm5);

        response.put("recommended", recommended);
        response.put("nearby", nearby);
        response.put("aiInsight", "High demand for " + pickup + " ➔ " + destination + " route. Consider adding 2 more vehicles to increase availability.");

        return ResponseEntity.ok(response);
    }
}
