-- Master Data Seed for Cab Management System

-- SEED USERS
INSERT INTO users (id, username, email, password, role, status) VALUES 
(1, 'admin', 'admin@safepassage.ai', '$2a$10$c1xWdKx.w43M6t.RzF0yKOWiQJ/pE9q/P1wWfN7g.GkY7WwN5p7/C', 'ROLE_SUPER_ADMIN', 'ACTIVE'),
(2, 'priya_sharma', 'priya.sharma@gmail.com', '$2a$10$c1xWdKx.w43M6t.RzF0yKOWiQJ/pE9q/P1wWfN7g.GkY7WwN5p7/C', 'ROLE_PARENT', 'ACTIVE'),
(3, 'kumar_van_owner', 'kumar@cabs.com', '$2a$10$c1xWdKx.w43M6t.RzF0yKOWiQJ/pE9q/P1wWfN7g.GkY7WwN5p7/C', 'ROLE_CAB_OWNER', 'ACTIVE'),
(4, 'ravi_driver', 'ravi@driver.com', '$2a$10$c1xWdKx.w43M6t.RzF0yKOWiQJ/pE9q/P1wWfN7g.GkY7WwN5p7/C', 'ROLE_DRIVER', 'ACTIVE'),
(5, 'arun_student', 'arun.kumar@loyola.edu', '$2a$10$c1xWdKx.w43M6t.RzF0yKOWiQJ/pE9q/P1wWfN7g.GkY7WwN5p7/C', 'ROLE_STUDENT', 'ACTIVE'),
(6, 'deepa_tech', 'deepa.nair@infosys.com', '$2a$10$c1xWdKx.w43M6t.RzF0yKOWiQJ/pE9q/P1wWfN7g.GkY7WwN5p7/C', 'ROLE_PROFESSIONAL', 'ACTIVE')
ON DUPLICATE KEY UPDATE username=VALUES(username), email=VALUES(email), role=VALUES(role), status=VALUES(status);

-- SEED INSTITUTIONS
INSERT INTO institutions (id, name, type, location, contact, admin_username, transport_requirements) VALUES 
(1, 'ABC Matriculation School', 'SCHOOL', 'Mehta Nagar, Chennai', '+91 44 2626 1234', 'school_admin1', 'Daily pick & drop for 150 primary students'),
(2, 'Loyola College', 'COLLEGE', 'Nungambakkam, Chennai', '+91 44 2817 8200', 'college_admin1', 'Coaches for college football team and student shifts'),
(3, 'TCS IT Park', 'COMPANY', 'Siruseri, Chennai', '+91 44 6616 1111', 'tcs_hr_admin', 'Employee shuttle fleet operations')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- SEED VEHICLES
INSERT INTO vehicles (id, reg_number, vehicle_type, capacity, insurance, fitness_certificate, permit, rc, pollution_certificate, verification_status) VALUES 
(1, 'TN 01 AB 1234', 'VAN', 12, 'INS_998822', 'FIT_887711', 'PERMIT_554433', 'RC_223344', 'POL_889900', 'APPROVED'),
(2, 'TN 02 CD 5678', 'CAR', 6, 'INS_998823', 'FIT_887712', 'PERMIT_554434', 'RC_223345', 'POL_889901', 'APPROVED'),
(3, 'TN 03 EF 9012', 'BUS', 40, 'INS_998824', 'FIT_887713', 'PERMIT_554435', 'RC_223346', 'POL_889902', 'PENDING'),
(4, 'TN 09 AZ 4455', 'AUTO', 4, 'INS_998825', 'FIT_887714', 'PERMIT_554436', 'RC_223347', 'POL_889903', 'APPROVED')
ON DUPLICATE KEY UPDATE reg_number=VALUES(reg_number), verification_status=VALUES(verification_status);

-- SEED DRIVERS
INSERT INTO drivers (id, name, email, phone, assigned_vehicle_id, rating, trip_count, cancellation_rate, complaints_count, earnings, safety_incidents_count, status) VALUES 
(1, 'Kumar Swamy', 'kumar@cabs.com', '+91 98401 23456', 1, 4.8, 142, 1.2, 0, 24500.0, 0, 'ACTIVE'),
(2, 'Ravi Chandran', 'ravi@driver.com', '+91 98401 23457', 2, 4.7, 98, 2.5, 1, 18200.0, 0, 'ACTIVE'),
(3, 'Suresh Kumar', 'suresh@driver.com', '+91 98401 23458', 3, 4.6, 210, 0.5, 0, 31000.0, 1, 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email), phone=VALUES(phone);

-- SEED ROUTES
INSERT INTO routes (id, start_point, end_point, demand_level, total_seats, available_seats, price_monthly, assigned_driver_id, assigned_vehicle_id, status) VALUES 
(1, 'Kattur', 'ABC Matriculation School', 'HIGH', 12, 3, 2500.0, 1, 1, 'ACTIVE'),
(2, 'Tambaram', 'Loyola College', 'MEDIUM', 40, 15, 2300.0, 2, 2, 'ACTIVE'),
(3, 'Velachery', 'TCS IT Park Siruseri', 'HOT', 6, 2, 3200.0, 3, 3, 'ACTIVE')
ON DUPLICATE KEY UPDATE start_point=VALUES(start_point), end_point=VALUES(end_point);

-- SEED STOPS
INSERT INTO route_stops (id, route_id, stop_name, timing, sequence) VALUES 
(1, 1, 'Kattur Junction', '07:00 AM', 1),
(2, 1, 'Anna Nagar Arch', '07:20 AM', 2),
(3, 1, 'ABC School Campus', '07:50 AM', 3),
(4, 2, 'Tambaram Sanatorium', '07:15 AM', 1),
(5, 2, 'Guindy Metro', '07:45 AM', 2),
(6, 2, 'Loyola College Gate', '08:15 AM', 3)
ON DUPLICATE KEY UPDATE stop_name=VALUES(stop_name);

-- SEED SUBSCRIPTIONS
INSERT INTO subscriptions (id, user_email, plan_type, status, amount_paid, start_date, end_date) VALUES 
(1, 'priya.sharma@gmail.com', 'MONTHLY', 'ACTIVE', 2800.0, '2026-08-01', '2026-08-31'),
(2, 'arun.kumar@loyola.edu', 'MONTHLY', 'ACTIVE', 2300.0, '2026-08-01', '2026-08-31'),
(3, 'deepa.nair@infosys.com', 'MONTHLY', 'ACTIVE', 3200.0, '2026-08-01', '2026-08-31')
ON DUPLICATE KEY UPDATE user_email=VALUES(user_email);

-- SEED PAYMENTS
INSERT INTO payments (id, payer_email, recipient_email, amount, type, status, payment_date, invoice_no) VALUES 
(1, 'priya.sharma@gmail.com', 'platform@safepassage.ai', 2800.0, 'CUSTOMER_PAYMENT', 'SUCCESS', '2026-08-01 10:15:30', 'INV_2026_001'),
(2, 'deepa.nair@infosys.com', 'platform@safepassage.ai', 3200.0, 'CUSTOMER_PAYMENT', 'SUCCESS', '2026-08-05 09:20:10', 'INV_2026_002'),
(3, 'platform@safepassage.ai', 'kumar@cabs.com', 2520.0, 'DRIVER_PAYOUT', 'SUCCESS', '2026-08-15 18:00:00', 'PAYOUT_DRIVER_001'),
(4, 'priya.sharma@gmail.com', 'platform@safepassage.ai', 500.0, 'WALLET_TOPUP', 'SUCCESS', '2026-08-20 14:10:00', 'TOPUP_2026_003')
ON DUPLICATE KEY UPDATE invoice_no=VALUES(invoice_no);

-- SEED OFFERS
INSERT INTO offers (id, code, title, discount_text, active) VALUES 
(1, 'NEW500', 'First Month Promotion', '₹500 OFF', 1),
(2, 'SIBLING20', 'Sibling Multi-Child Offer', '20% OFF 2nd Child', 1),
(3, 'BACKTOSCHOOL', 'Quarterly Package Off', '10% OFF packages', 0)
ON DUPLICATE KEY UPDATE code=VALUES(code);

-- SEED COMPLAINTS
INSERT INTO complaints (id, reporter_email, details, status, type, incident_date) VALUES 
(1, 'priya.sharma@gmail.com', 'Driver delayed for morning pickup by 10 mins due to road detour.', 'RESOLVED', 'SOS', '2026-08-12 14:05:00'),
(2, 'parent2@gmail.com', 'AC cooling was insufficient in rear seat.', 'PENDING', 'DRIVER', '2026-08-23 08:10:00')
ON DUPLICATE KEY UPDATE reporter_email=VALUES(reporter_email);
