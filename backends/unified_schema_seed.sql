-- ====================================================================
-- School & College Cab Management System - Unified MySQL Schema & Seed
-- Database: cab_management_db
-- ====================================================================

CREATE DATABASE IF NOT EXISTS cab_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cab_management_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    otp_code VARCHAR(10) NULL,
    otp_expiry DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. INSTITUTIONS TABLE
CREATE TABLE IF NOT EXISTS institutions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    contact VARCHAR(50) NOT NULL,
    admin_username VARCHAR(100) NULL,
    transport_requirements TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reg_number VARCHAR(50) NOT NULL UNIQUE,
    vehicle_type VARCHAR(50) NOT NULL,
    capacity INT NOT NULL DEFAULT 12,
    owner_email VARCHAR(150) NULL,
    insurance VARCHAR(100) NULL,
    fitness_certificate VARCHAR(100) NULL,
    permit VARCHAR(100) NULL,
    rc VARCHAR(100) NULL,
    pollution_certificate VARCHAR(100) NULL,
    verification_status VARCHAR(50) DEFAULT 'APPROVED',
    gps_device_id VARCHAR(100) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. DRIVERS TABLE
CREATE TABLE IF NOT EXISTS drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    license_number VARCHAR(100) NULL,
    assigned_vehicle_id BIGINT NULL,
    rating DOUBLE DEFAULT 4.8,
    trip_count INT DEFAULT 0,
    cancellation_rate DOUBLE DEFAULT 0.0,
    complaints_count INT DEFAULT 0,
    earnings DOUBLE DEFAULT 0.0,
    safety_incidents_count INT DEFAULT 0,
    current_lat DOUBLE DEFAULT 13.0827,
    current_lng DOUBLE DEFAULT 80.2707,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    last_location_update DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. ROUTES TABLE
CREATE TABLE IF NOT EXISTS routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    start_point VARCHAR(200) NOT NULL,
    end_point VARCHAR(200) NOT NULL,
    demand_level VARCHAR(50) DEFAULT 'MEDIUM',
    total_seats INT DEFAULT 12,
    available_seats INT DEFAULT 4,
    price_monthly DOUBLE DEFAULT 2500.0,
    assigned_driver_id BIGINT NULL,
    assigned_vehicle_id BIGINT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. ROUTE STOPS TABLE
CREATE TABLE IF NOT EXISTS route_stops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    stop_name VARCHAR(200) NOT NULL,
    timing VARCHAR(50) NOT NULL,
    sequence INT NOT NULL,
    lat DOUBLE NULL,
    lng DOUBLE NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. CHILD PROFILES TABLE
CREATE TABLE IF NOT EXISTS child_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_email VARCHAR(150) NOT NULL,
    name VARCHAR(150) NOT NULL,
    school_name VARCHAR(200) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    pickup_address VARCHAR(255) NOT NULL,
    drop_address VARCHAR(255) NOT NULL,
    pickup_lat DOUBLE DEFAULT 13.0827,
    pickup_lng DOUBLE DEFAULT 80.2707,
    school_lat DOUBLE DEFAULT 13.0650,
    school_lng DOUBLE DEFAULT 80.2450,
    assigned_driver_id VARCHAR(50) DEFAULT 'd1',
    driver_name VARCHAR(150) DEFAULT 'Kumar Swamy',
    driver_phone VARCHAR(50) DEFAULT '+91 98401 23456',
    vehicle_plate VARCHAR(50) DEFAULT 'TN 01 AB 1234',
    status VARCHAR(50) DEFAULT 'AT_SCHOOL',
    qr_code VARCHAR(100) NULL,
    photo_url VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. COMMUTE PASSES TABLE (Student / Professional)
CREATE TABLE IF NOT EXISTS commute_passes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(150) NOT NULL,
    user_name VARCHAR(150) NOT NULL,
    commuter_type VARCHAR(50) NOT NULL, -- 'STUDENT' or 'PROFESSIONAL'
    institution_or_company VARCHAR(200) NOT NULL,
    route_id BIGINT NULL,
    pickup_point VARCHAR(200) NOT NULL,
    drop_point VARCHAR(200) NOT NULL,
    pass_type VARCHAR(50) DEFAULT 'MONTHLY',
    amount_paid DOUBLE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. PARENT WALLETS TABLE
CREATE TABLE IF NOT EXISTS parent_wallets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_email VARCHAR(150) NOT NULL UNIQUE,
    balance DOUBLE DEFAULT 1500.0,
    currency VARCHAR(10) DEFAULT 'INR',
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. PAYMENTS & INVOICES TABLE
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payer_email VARCHAR(150) NOT NULL,
    recipient_email VARCHAR(150) DEFAULT 'platform@safepassage.ai',
    amount DOUBLE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'CUSTOMER_PAYMENT', 'DRIVER_PAYOUT', 'COMMISSION', 'WALLET_TOPUP'
    status VARCHAR(50) DEFAULT 'SUCCESS',
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    invoice_no VARCHAR(100) NOT NULL UNIQUE,
    payment_method VARCHAR(50) DEFAULT 'RAZORPAY_UPI',
    description VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_email VARCHAR(150) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'TRANSPORT', -- 'TRANSPORT', 'PAYMENTS', 'SYSTEM', 'SOS'
    type VARCHAR(50) DEFAULT 'GENERAL',
    action_route VARCHAR(100) NULL,
    action_text VARCHAR(100) NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. TRIP LOGS TABLE
CREATE TABLE IF NOT EXISTS trip_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    driver_id BIGINT NOT NULL,
    route_id BIGINT NULL,
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME NULL,
    status VARCHAR(50) DEFAULT 'IN_PROGRESS',
    total_students_boarded INT DEFAULT 0,
    sos_triggered BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. CHECKLIST LOGS TABLE (Child boarding verification)
CREATE TABLE IF NOT EXISTS checklist_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    child_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'BOARDED', 'ABSENT', 'DROPPED'
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    verified_by VARCHAR(50) DEFAULT 'DRIVER_APP'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporter_email VARCHAR(150) NOT NULL,
    driver_id BIGINT NULL,
    details TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'GENERAL', -- 'SOS', 'DELAY', 'DRIVER_BEHAVIOR', 'OVERCROWDING'
    status VARCHAR(50) DEFAULT 'PENDING',
    incident_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolution_notes TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. OFFERS TABLE
CREATE TABLE IF NOT EXISTS offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    discount_text VARCHAR(100) NOT NULL,
    active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. CHILD LEAVES TABLE (Absenteeism & Route Auto-Skip)
CREATE TABLE IF NOT EXISTS child_leaves (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    child_id BIGINT NOT NULL,
    child_name VARCHAR(150) NOT NULL,
    parent_email VARCHAR(150) NOT NULL,
    leave_date DATE NOT NULL,
    slot VARCHAR(50) DEFAULT 'Morning Only', -- 'Morning Only', 'Evening Only', 'Full Day'
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE_SKIPPED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. GUARDIAN HANDOVER PASSES TABLE
CREATE TABLE IF NOT EXISTS guardian_passes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_email VARCHAR(150) NOT NULL,
    child_name VARCHAR(150) NOT NULL,
    guardian_name VARCHAR(150) NOT NULL,
    relation VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    pin VARCHAR(10) NOT NULL,
    photo_url VARCHAR(255) NULL,
    expires_at DATETIME NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18. SAFETY SWEEPS TABLE (Anti-Abandonment Verification)
CREATE TABLE IF NOT EXISTS safety_sweeps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    driver_name VARCHAR(150) NOT NULL,
    vehicle_plate VARCHAR(50) NOT NULL,
    rows_inspected BOOLEAN DEFAULT TRUE,
    rear_tag_code VARCHAR(100) NOT NULL,
    sleeping_children_count INT DEFAULT 0,
    cabin_photo_url VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'CERTIFIED_CLEAR',
    verified_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 19. VEHICLE BREAKDOWNS TABLE (1-Tap Cab Swap Protocol)
CREATE TABLE IF NOT EXISTS vehicle_breakdowns (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    driver_id BIGINT NOT NULL,
    original_vehicle_plate VARCHAR(50) NOT NULL,
    replacement_vehicle_plate VARCHAR(50) NOT NULL,
    backup_driver_name VARCHAR(150) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'SWAPPED_RESOLVED',
    occurred_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 20. DRIVER TELEMATICS TABLE
CREATE TABLE IF NOT EXISTS driver_telematics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    driver_id BIGINT NOT NULL,
    safety_score INT DEFAULT 98,
    harsh_braking_events INT DEFAULT 0,
    speeding_events INT DEFAULT 0,
    smooth_acceleration_pct INT DEFAULT 99,
    max_speed_kmh DOUBLE DEFAULT 38.5,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 21. SINGLE TRIPS TABLE (45s Instant Dispatch & OTP Verification)
CREATE TABLE IF NOT EXISTS single_trips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    passenger_name VARCHAR(150) NOT NULL,
    passenger_email VARCHAR(150) NOT NULL,
    passenger_phone VARCHAR(50) NOT NULL,
    pickup_address VARCHAR(255) NOT NULL,
    drop_address VARCHAR(255) NOT NULL,
    pickup_lat DOUBLE NOT NULL DEFAULT 13.0725,
    pickup_lng DOUBLE NOT NULL DEFAULT 80.2180,
    drop_lat DOUBLE NOT NULL DEFAULT 13.0815,
    drop_lng DOUBLE NOT NULL DEFAULT 80.2355,
    driver_id BIGINT NULL,
    driver_name VARCHAR(150) NULL,
    driver_phone VARCHAR(50) NULL,
    vehicle_plate VARCHAR(50) NULL,
    vehicle_model VARCHAR(100) NULL,
    fare DOUBLE NOT NULL DEFAULT 180.0,
    otp_code VARCHAR(10) NOT NULL DEFAULT '8492',
    status VARCHAR(50) DEFAULT 'REQUESTED', -- 'REQUESTED', 'DISPATCHED_45S', 'ACCEPTED', 'ARRIVED', 'OTP_VERIFIED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
    countdown_seconds INT DEFAULT 45,
    distance_km DOUBLE DEFAULT 4.2,
    eta_mins INT DEFAULT 12,
    sos_triggered BOOLEAN DEFAULT FALSE,
    requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_at DATETIME NULL,
    otp_verified_at DATETIME NULL,
    completed_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 22. FAQS TABLE
CREATE TABLE IF NOT EXISTS faqs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================================
-- SEED DATA INSERTIONS
-- ====================================================================

-- Users (BCrypt hash for 'admin123' / 'password123')
INSERT INTO users (id, username, email, password, role, status) VALUES 
(1, 'admin', 'admin@safepassage.ai', '$2a$10$c1xWdKx.w43M6t.RzF0yKOWiQJ/pE9q/P1wWfN7g.GkY7WwN5p7/C', 'ROLE_SUPER_ADMIN', 'ACTIVE'),
(2, 'priya_sharma', 'priya.sharma@gmail.com', '$2a$10$c1xWdKx.w43M6t.RzF0yKOWiQJ/pE9q/P1wWfN7g.GkY7WwN5p7/C', 'ROLE_PARENT', 'ACTIVE'),
(3, 'kumar_van_owner', 'kumar@cabs.com', '$2a$10$c1xWdKx.w43M6t.RzF0yKOWiQJ/pE9q/P1wWfN7g.GkY7WwN5p7/C', 'ROLE_CAB_OWNER', 'ACTIVE'),
(4, 'ravi_driver', 'ravi@driver.com', '$2a$10$c1xWdKx.w43M6t.RzF0yKOWiQJ/pE9q/P1wWfN7g.GkY7WwN5p7/C', 'ROLE_DRIVER', 'ACTIVE'),
(5, 'arun_student', 'arun.kumar@loyola.edu', '$2a$10$c1xWdKx.w43M6t.RzF0yKOWiQJ/pE9q/P1wWfN7g.GkY7WwN5p7/C', 'ROLE_STUDENT', 'ACTIVE'),
(6, 'deepa_tech', 'deepa.nair@infosys.com', '$2a$10$c1xWdKx.w43M6t.RzF0yKOWiQJ/pE9q/P1wWfN7g.GkY7WwN5p7/C', 'ROLE_PROFESSIONAL', 'ACTIVE')
ON DUPLICATE KEY UPDATE username=VALUES(username), email=VALUES(email), role=VALUES(role), status=VALUES(status);

-- Institutions
INSERT INTO institutions (id, name, type, location, contact, admin_username, transport_requirements) VALUES 
(1, 'ABC Matriculation School', 'SCHOOL', 'Mehta Nagar, Chennai', '+91 44 2626 1234', 'school_admin1', 'Daily pick & drop for 150 primary students'),
(2, 'Loyola College', 'COLLEGE', 'Nungambakkam, Chennai', '+91 44 2817 8200', 'college_admin1', 'Coaches for college football team and student shifts'),
(3, 'TCS IT Park', 'COMPANY', 'Siruseri, Chennai', '+91 44 6616 1111', 'tcs_hr_admin', 'Employee shuttle fleet operations')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Vehicles
INSERT INTO vehicles (id, reg_number, vehicle_type, capacity, owner_email, insurance, fitness_certificate, permit, rc, pollution_certificate, verification_status) VALUES 
(1, 'TN 01 AB 1234', 'VAN', 12, 'kumar@cabs.com', 'INS_998822', 'FIT_887711', 'PERMIT_554433', 'RC_223344', 'POL_889900', 'APPROVED'),
(2, 'TN 02 CD 5678', 'CAR', 6, 'kumar@cabs.com', 'INS_998823', 'FIT_887712', 'PERMIT_554434', 'RC_223345', 'POL_889901', 'APPROVED'),
(3, 'TN 03 EF 9012', 'BUS', 40, 'kumar@cabs.com', 'INS_998824', 'FIT_887713', 'PERMIT_554435', 'RC_223346', 'POL_889902', 'PENDING'),
(4, 'TN 09 AZ 4455', 'AUTO', 4, 'ravi@driver.com', 'INS_998825', 'FIT_887714', 'PERMIT_554436', 'RC_223347', 'POL_889903', 'APPROVED')
ON DUPLICATE KEY UPDATE reg_number=VALUES(reg_number), verification_status=VALUES(verification_status);

-- Drivers
INSERT INTO drivers (id, name, email, phone, license_number, assigned_vehicle_id, rating, trip_count, cancellation_rate, complaints_count, earnings, safety_incidents_count, current_lat, current_lng, status) VALUES 
(1, 'Kumar Swamy', 'kumar@cabs.com', '+91 98401 23456', 'DL-TN-01-20180099', 1, 4.8, 142, 1.2, 0, 24500.0, 0, 13.0827, 80.2707, 'ACTIVE'),
(2, 'Ravi Chandran', 'ravi@driver.com', '+91 98401 23457', 'DL-TN-02-20190088', 2, 4.7, 98, 2.5, 1, 18200.0, 0, 13.0750, 80.2500, 'ACTIVE'),
(3, 'Suresh Kumar', 'suresh@driver.com', '+91 98401 23458', 'DL-TN-03-20200077', 3, 4.6, 210, 0.5, 0, 31000.0, 1, 13.0600, 80.2300, 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email), phone=VALUES(phone);

-- Routes
INSERT INTO routes (id, start_point, end_point, demand_level, total_seats, available_seats, price_monthly, assigned_driver_id, assigned_vehicle_id, status) VALUES 
(1, 'Kattur', 'ABC Matriculation School', 'HIGH', 12, 3, 2500.0, 1, 1, 'ACTIVE'),
(2, 'Tambaram', 'Loyola College', 'MEDIUM', 40, 15, 2300.0, 2, 2, 'ACTIVE'),
(3, 'Velachery', 'TCS IT Park Siruseri', 'HOT', 6, 2, 3200.0, 3, 3, 'ACTIVE')
ON DUPLICATE KEY UPDATE start_point=VALUES(start_point), end_point=VALUES(end_point);

-- Route Stops
INSERT INTO route_stops (id, route_id, stop_name, timing, sequence, lat, lng) VALUES 
(1, 1, 'Kattur Junction', '07:00 AM', 1, 13.0827, 80.2707),
(2, 1, 'Anna Nagar Arch', '07:20 AM', 2, 13.0850, 80.2100),
(3, 1, 'ABC School Campus', '07:50 AM', 3, 13.0650, 80.2450),
(4, 2, 'Tambaram Sanatorium', '07:15 AM', 1, 12.9250, 80.1200),
(5, 2, 'Guindy Metro', '07:45 AM', 2, 13.0070, 80.2020),
(6, 2, 'Loyola College Gate', '08:15 AM', 3, 13.0655, 80.2355)
ON DUPLICATE KEY UPDATE stop_name=VALUES(stop_name);

-- Child Profiles
INSERT INTO child_profiles (id, parent_email, child_name, institution, grade, age, pickup_address, drop_address, passport_photo_url, verification_status, cab_id, driver_name, driver_phone, vehicle_plate, status, emergency_contact_name, emergency_contact_phone) VALUES 
(1, 'priya.sharma@gmail.com', 'Arun Kumar', 'Green Valley School', 'Class 3', 8, 'Mehta Nagar Anna Arch Gate, Chennai', 'Green Valley School Main Gate, Shenoy Nagar', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150', 'VERIFIED', 'd1', 'Kumar Swamy', '+91 98401 23456', 'TN 01 AB 1234', 'ON_ROUTE', 'Priya Kumar (Mother)', '+91 98401 22334'),
(2, 'priya.sharma@gmail.com', 'Sneha Kumar', 'St. Joseph Academy', 'Class 8', 13, 'Mehta Nagar Anna Arch Gate, Chennai', 'St. Joseph Academy, Nungambakkam', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'VERIFIED', 'd2', 'Ramesh Sundar', '+91 98401 23457', 'TN 02 CD 5678', 'BOARDING_PENDING', 'Priya Kumar (Mother)', '+91 98401 22334')
ON DUPLICATE KEY UPDATE child_name=VALUES(child_name), institution=VALUES(institution);

-- Parent Wallet
INSERT INTO parent_wallets (id, parent_email, balance, currency) VALUES 
(1, 'priya.sharma@gmail.com', 2500.0, 'INR')
ON DUPLICATE KEY UPDATE balance=VALUES(balance);

-- Payments
INSERT INTO payments (id, payer_email, recipient_email, amount, type, status, payment_date, invoice_no, payment_method, description) VALUES 
(1, 'priya.sharma@gmail.com', 'platform@safepassage.ai', 2800.0, 'CUSTOMER_PAYMENT', 'SUCCESS', '2026-08-01 10:15:30', 'INV_2026_001', 'RAZORPAY_UPI', 'Monthly School Cab Subscription - August 2026'),
(2, 'deepa.nair@infosys.com', 'platform@safepassage.ai', 3200.0, 'CUSTOMER_PAYMENT', 'SUCCESS', '2026-08-05 09:20:10', 'INV_2026_002', 'NET_BANKING', 'IT Park Corporate Shuttle Pass'),
(3, 'platform@safepassage.ai', 'kumar@cabs.com', 2520.0, 'DRIVER_PAYOUT', 'SUCCESS', '2026-08-15 18:00:00', 'PAYOUT_DRIVER_001', 'IMPS_TRANSFER', 'Driver Monthly Route Settlement (90%)'),
(4, 'priya.sharma@gmail.com', 'platform@safepassage.ai', 500.0, 'WALLET_TOPUP', 'SUCCESS', '2026-08-20 14:10:00', 'TOPUP_2026_003', 'CREDIT_CARD', 'Parent Wallet Top-up')
ON DUPLICATE KEY UPDATE invoice_no=VALUES(invoice_no);

-- Commute Passes
INSERT INTO commute_passes (id, user_email, user_name, commuter_type, institution_or_company, route_id, pickup_point, drop_point, pass_type, amount_paid, start_date, end_date, status) VALUES 
(1, 'arun.kumar@loyola.edu', 'Arun Kumar', 'STUDENT', 'Loyola College', 2, 'Tambaram Sanatorium', 'Loyola College Gate', 'MONTHLY', 2300.0, '2026-08-01', '2026-08-31', 'ACTIVE'),
(2, 'deepa.nair@infosys.com', 'Deepa Nair', 'PROFESSIONAL', 'TCS IT Park Siruseri', 3, 'Velachery MRTS', 'TCS IT Park Siruseri Gate 2', 'MONTHLY', 3200.0, '2026-08-01', '2026-08-31', 'ACTIVE')
ON DUPLICATE KEY UPDATE user_email=VALUES(user_email);

-- Notifications
INSERT INTO notifications (id, parent_email, title, message, category, type, action_route, action_text, is_read, sent_time) VALUES 
(1, 'priya.sharma@gmail.com', 'Boarding Successful • Arun Kumar', 'Arun Kumar boarded vehicle TN 01 AB 1234 at Mehta Nagar Arch. Dynamic OTP verified.', 'TRANSPORT', 'ATTENDANCE', 'LiveTrack', 'Live Track', FALSE, NOW() - INTERVAL 12 MINUTE),
(2, 'priya.sharma@gmail.com', 'Geofence Radar Entry Alert', 'Cab TN 01 AB 1234 is within 0.5 miles corridor. Estimated arrival at school in 6 mins.', 'TRANSPORT', 'GENERAL', 'LiveTrack', 'Open Radar', FALSE, NOW() - INTERVAL 24 MINUTE),
(3, 'priya.sharma@gmail.com', 'Monthly Subscription Receipt', 'Invoice #INV-2026-904 for ₹3,000 paid successfully for Green Valley School route.', 'PAYMENTS', 'PAYMENT', 'Payments', 'View Invoice', TRUE, NOW() - INTERVAL 1 DAY),
(4, 'priya.sharma@gmail.com', 'Fleet Safety Sweep Completed', 'Driver Kumar completed end-of-trip safety check. Zero students remaining in vehicle confirmed.', 'SOS', 'SOS', NULL, NULL, TRUE, NOW() - INTERVAL 1 DAY),
(5, 'priya.sharma@gmail.com', 'Special Route Match Discount', 'College and Corporate morning passes are eligible for 10% cash rebate this term.', 'SYSTEM', 'GENERAL', NULL, NULL, TRUE, NOW() - INTERVAL 2 DAY)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Offers
INSERT INTO offers (id, code, title, discount_text, active) VALUES 
(1, 'NEW500', 'First Month Promotion', '₹500 OFF', TRUE),
(2, 'SIBLING20', 'Sibling Multi-Child Offer', '20% OFF 2nd Child', TRUE),
(3, 'BACKTOSCHOOL', 'Quarterly Package Off', '10% OFF packages', FALSE)
ON DUPLICATE KEY UPDATE code=VALUES(code);

-- Complaints
INSERT INTO complaints (id, reporter_email, details, status, type, incident_date, resolution_notes) VALUES 
(1, 'priya.sharma@gmail.com', 'Driver delayed for morning pickup by 10 mins due to road detour.', 'RESOLVED', 'DELAY', '2026-08-12 14:05:00', 'Driver counseled, alternate route mapped.'),
(2, 'parent2@gmail.com', 'AC cooling was insufficient in rear seat.', 'PENDING', 'DRIVER_BEHAVIOR', '2026-08-23 08:10:00', NULL)
ON DUPLICATE KEY UPDATE id=id;

-- Child Leaves (Absenteeism)
INSERT INTO child_leaves (id, child_id, child_name, parent_email, leave_date, slot, reason, status) VALUES 
(1, 1, 'Ananya Sharma', 'priya.sharma@gmail.com', CURRENT_DATE, 'Morning Only', 'Feeling Unwell / Fever', 'ACTIVE_SKIPPED')
ON DUPLICATE KEY UPDATE reason=VALUES(reason);

-- Guardian Handover Passes
INSERT INTO guardian_passes (id, parent_email, child_name, guardian_name, relation, phone, pin, photo_url, expires_at, status) VALUES 
(1, 'priya.sharma@gmail.com', 'Ananya Sharma', 'Ramesh Sharma', 'Uncle / Paternal Brother', '+91 98409 88771', '7429', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', DATE_ADD(NOW(), INTERVAL 12 HOUR), 'ACTIVE')
ON DUPLICATE KEY UPDATE pin=VALUES(pin);

-- Safety Sweeps (Anti-Abandonment)
INSERT INTO safety_sweeps (id, trip_id, driver_id, driver_name, vehicle_plate, rows_inspected, rear_tag_code, sleeping_children_count, status) VALUES 
(1, 1, 1, 'Kumar Swamy', 'TN 01 AB 1234', TRUE, 'TAG-REAR-001', 0, 'CERTIFIED_CLEAR')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Vehicle Breakdowns (Cab Swap)
INSERT INTO vehicle_breakdowns (id, driver_id, original_vehicle_plate, replacement_vehicle_plate, backup_driver_name, reason, status) VALUES 
(1, 1, 'TN 01 AB 1234', 'TN-09-BK-8822', 'Ravi Chandran', 'Radiator Overheating Handled at Waypoint 2', 'SWAPPED_RESOLVED')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Driver Telematics
INSERT INTO driver_telematics (id, driver_id, safety_score, harsh_braking_events, speeding_events, smooth_acceleration_pct, max_speed_kmh) VALUES 
(1, 1, 98, 0, 0, 99, 38.5)
ON DUPLICATE KEY UPDATE safety_score=VALUES(safety_score);

-- Single Trips (45s Instant Dispatch Seed)
INSERT INTO single_trips (id, passenger_name, passenger_email, passenger_phone, pickup_address, drop_address, pickup_lat, pickup_lng, drop_lat, drop_lng, driver_id, driver_name, driver_phone, vehicle_plate, vehicle_model, fare, otp_code, status, countdown_seconds, distance_km, eta_mins) VALUES
(1, 'Priya Sharma (for Ananya)', 'priya.sharma@gmail.com', '+91 98401 22334', 'Mehta Nagar Anna Arch Gate, Chennai', 'ABC Matriculation School, Shenoy Nagar', 13.0725, 80.2180, 13.0815, 80.2355, 1, 'Kumar Swamy', '+91 98401 23456', 'TN 01 AB 1234', 'Mercedes Van (White)', 180.0, '8492', 'COMPLETED', 0, 4.2, 12),
(2, 'Arun Kumar', 'arun.kumar@loyola.edu', '+91 98401 44556', 'Tambaram Sanatorium Bus Stand', 'Loyola College Gate 3', 12.9250, 80.1200, 13.0655, 80.2355, 2, 'Ravi Chandran', '+91 98401 23457', 'TN 02 CD 5678', 'Suzuki Ertiga (Silver)', 220.0, '5931', 'DISPATCHED_45S', 45, 8.5, 22)
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- FAQs Seed
INSERT INTO faqs (id, question, answer, category) VALUES
(1, 'How to change pick-up location?', 'You can update your pick-up location under Profile > Transport Details or contact school dispatch directly.', 'Transport'),
(2, 'How to cancel subscription?', 'Go to My Subscriptions > View Details > Cancel Subscription before the next billing cycle on the 5th of each month.', 'Billing'),
(3, 'How do notifications work?', 'Real-time push alerts are sent when your child boards, when the cab is 12 mins away, and upon safe school drop.', 'Alerts')
ON DUPLICATE KEY UPDATE question=VALUES(question);



