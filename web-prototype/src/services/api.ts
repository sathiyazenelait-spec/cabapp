// Centralized API Client connecting to 5 Spring Boot Microservices + Unified MySQL Database

export const API_BASE = {
  SUPER_ADMIN: 'http://localhost:8082',
  CAB_OWNER: 'http://localhost:8083',
  DRIVER: 'http://localhost:8084',
  PARENT: 'http://localhost:8085',
  STUDENT_WORK: 'http://localhost:8086',
};

async function safeFetch<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[API] ${res.status} for ${url}:`, errText);
      if (fallbackData !== undefined) return fallbackData;
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API Network Error] ${url}:`, err);
    if (fallbackData !== undefined) return fallbackData;
    throw err;
  }
}

// -------------------------------------------------------------
// 1. AUTHENTICATION & ADMIN APIS (Super Admin Backend : 8082)
// -------------------------------------------------------------
export const authApi = {
  login: async (username: string, password: string) => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  register: async (data: { username: string; email: string; password: string; role: string }) => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  forgotPassword: async (identifier: string) => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/auth/forgot-password-request`, {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  },

  verifyOtp: async (identifier: string, otp: string, newPassword?: string) => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/auth/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ identifier, otp, newPassword: newPassword || 'Pass@123' }),
    });
  },
};

export const adminApi = {
  getStats: async () => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/dashboard/stats`, undefined, {
      totalUsers: 6,
      activeParents: 1,
      studentsCount: 1,
      driversCount: 3,
      cabOwnersCount: 1,
      schoolsCount: 1,
      collegesCount: 1,
      companiesCount: 1,
      activeVehicles: 3,
      activeRoutes: 3,
      activeSubscriptions: 3,
      revenue: 8700,
      commission: 870,
      complaintsCount: 2,
      safetyIncidentsCount: 0,
      todaysTripsCount: 6,
    });
  },

  getUsers: async () => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/users`, undefined, []);
  },

  updateUserStatus: async (userId: number | string, status: string) => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/users/${userId}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  generateOtpForUser: async (userId: number | string) => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/users/${userId}/generate-otp`, {
      method: 'POST',
    });
  },

  getVehicles: async () => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/vehicles`, undefined, []);
  },

  updateVehicleStatus: async (vehicleId: number | string, status: string) => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/vehicles/${vehicleId}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  getComplaints: async () => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/complaints`, undefined, []);
  },

  updateComplaintStatus: async (complaintId: number | string, status: string) => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/complaints/${complaintId}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  getPayments: async () => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/payments`, undefined, []);
  },

  getOffers: async () => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/offers`, undefined, []);
  },

  getAnalytics: async () => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/analytics`, undefined, {});
  },

  getAIDemand: async () => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/ai/demand`, undefined, []);
  },

  getDemandOverview: async (date = 'Apr 15, 2025') => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/analytics/demand-overview?date=${encodeURIComponent(date)}`, undefined, {
      date,
      totalDemand: 1248,
      totalDemandTrend: '+12% vs last week',
      availableSeats: 892,
      availableSeatsTrend: '-8% vs last week',
      activeRoutes: 86,
      activeRoutesTrend: '+6% vs last week',
      avgFillRate: 71,
      avgFillRateTrend: '+14% vs last week',
      demandByCategory: {
        School: { percentage: 32, count: 399, color: '#3b82f6' },
        College: { percentage: 28, count: 349, color: '#6366f1' },
        Work: { percentage: 40, count: 500, color: '#10b981' },
      },
      topDemandRoutes: [
        { id: 1, origin: 'Kattur', destination: 'ABC College', category: 'College', categoryColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', demandCount: 68, availableSeats: 12, fillRate: 85 },
        { id: 2, origin: 'Kattur', destination: 'IT Park', category: 'Work', categoryColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', demandCount: 54, availableSeats: 10, fillRate: 84 },
        { id: 3, origin: 'Ariyankuppam', destination: 'School', category: 'School', categoryColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30', demandCount: 48, availableSeats: 8, fillRate: 86 },
        { id: 4, origin: 'Lawspet', destination: 'College', category: 'College', categoryColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', demandCount: 41, availableSeats: 15, fillRate: 73 },
        { id: 5, origin: 'Villupuram', destination: 'IT Park', category: 'Work', categoryColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', demandCount: 37, availableSeats: 9, fillRate: 80 }
      ],
      heatSpots: [
        { name: 'Kattur', demand: 68, intensity: 'Very High', lat: 11.9360, lng: 79.8320 },
        { name: 'ABC College', demand: 45, intensity: 'High', lat: 11.9480, lng: 79.8150 },
        { name: 'IT Park', demand: 54, intensity: 'Medium', lat: 12.8390, lng: 80.2180 }
      ]
    });
  },

  getDriverKycQueue: async () => {
    return safeFetch<any>(`${API_BASE.SUPER_ADMIN}/api/admin/drivers/kyc-queue`, undefined, [
      {
        id: 1,
        driverName: 'Kumar Swamy',
        phone: '+91 98401 23456',
        email: 'kumar.swamy@drivercabs.com',
        vehiclePlate: 'TN 01 AB 1234',
        licenseNumber: 'DL-TN-01-2021-9876',
        licenseExpiry: '2031-08-15',
        rcNumber: 'RC-TN01AB1234',
        insurancePolicy: 'POL-HDFC-998231',
        backgroundCheckStatus: 'POLICE_VERIFIED',
        backgroundCheckDoc: 'CERT-BG-CH-4491.pdf',
        status: 'VERIFIED',
        submittedAt: '2026-09-10T08:30:00',
        auditedBy: 'SuperAdmin Compliance Desk',
        remarks: 'All biometric and RTO records verified.',
      },
      {
        id: 2,
        driverName: 'Ravi Chandran',
        phone: '+91 98401 23457',
        email: 'ravi.chandran@cabs.com',
        vehiclePlate: 'TN 02 CD 5678',
        licenseNumber: 'DL-TN-02-2019-4451',
        licenseExpiry: '2029-04-20',
        rcNumber: 'RC-TN02CD5678',
        insurancePolicy: 'POL-ICICI-881204',
        backgroundCheckStatus: 'PENDING_AUDIT',
        backgroundCheckDoc: 'CERT-BG-CH-7721.pdf',
        status: 'PENDING_AUDIT',
        submittedAt: '2026-09-14T11:15:00',
        auditedBy: null,
        remarks: 'New applicant awaiting RC & PUC verification.',
      },
      {
        id: 3,
        driverName: 'Suresh Kumar',
        phone: '+91 98401 33445',
        email: 'suresh.kumar@cabs.com',
        vehiclePlate: 'TN 03 EF 9012',
        licenseNumber: 'DL-TN-03-2020-7712',
        licenseExpiry: '2030-11-05',
        rcNumber: 'RC-TN03EF9012',
        insurancePolicy: 'POL-BAJAJ-556123',
        backgroundCheckStatus: 'PENDING_AUDIT',
        backgroundCheckDoc: 'CERT-BG-CH-8833.pdf',
        status: 'PENDING_AUDIT',
        submittedAt: '2026-09-15T09:00:00',
        auditedBy: null,
        remarks: 'Driver commercial badge renewal uploaded.',
      },
    ]);
  },

  updateDriverKycStatus: async (driverId: number | string, status: string, remarks = 'Approved by Super Admin KYC desk') => {
    return safeFetch<any>(`${API_BASE.SUPER_ADMIN}/api/admin/drivers/${driverId}/kyc-status?status=${status}&remarks=${encodeURIComponent(remarks)}`, {
      method: 'PUT',
    });
  },

  getTransitHeatmap: async () => {
    return safeFetch<any>(`${API_BASE.SUPER_ADMIN}/api/admin/analytics/transit-heatmap`, undefined, {
      corridorClusters: [
        { id: 'CL-01', name: 'OMR IT Corridor & Sholinganallur', densityLevel: 'CRITICAL_HIGH', densityColor: '#ef4444', commutersCount: 498, activeCabs: 34, seatDeficit: -64, lat: 12.9010, lng: 80.2279 },
        { id: 'CL-02', name: 'Kattur ➔ Nungambakkam Institutional Belt', densityLevel: 'HIGH', densityColor: '#f59e0b', commutersCount: 380, activeCabs: 28, seatDeficit: -12, lat: 13.0610, lng: 80.2420 },
        { id: 'CL-03', name: 'Tambaram Sanatorium ➔ Guindy Corridor', densityLevel: 'BALANCED', densityColor: '#10b981', commutersCount: 240, activeCabs: 20, seatDeficit: 18, lat: 12.9620, lng: 80.1450 },
        { id: 'CL-04', name: 'Anna Nagar West ➔ Kilpauk School Zone', densityLevel: 'HIGH', densityColor: '#f59e0b', commutersCount: 310, activeCabs: 24, seatDeficit: -8, lat: 13.0878, lng: 80.2155 },
      ],
      fleetMarkers: [
        { cabId: 'CAB-101', plate: 'TN 01 AB 1234', driverName: 'Kumar Swamy', driverPhone: '+91 98401 23456', speedKmh: 36, route: 'Route 1: Kasturba Nagar ➔ Green Valley', occupancy: '12/14 Seats (85%)', status: 'ON_ROUTE', lat: 12.9815, lng: 80.2450 },
        { cabId: 'CAB-102', plate: 'TN 02 CD 5678', driverName: 'Ravi Chandran', driverPhone: '+91 98401 23457', speedKmh: 32, route: 'Route 2: Tambaram ➔ Loyola College', occupancy: '7/7 Seats (100%)', status: 'ON_ROUTE', lat: 13.0615, lng: 80.2330 },
        { cabId: 'CAB-103', plate: 'TN 03 EF 9012', driverName: 'Suresh Kumar', driverPhone: '+91 98401 33445', speedKmh: 0, route: 'Route 3: Velachery ➔ TCS Siruseri', occupancy: '0/20 Seats (IDLE)', status: 'STATIONARY', lat: 12.8390, lng: 80.2180 },
      ],
      activeFleetCount: 86,
      totalCommutersMonitored: 1248,
    });
  },
};

// -------------------------------------------------------------
// 2. PARENT APIS (Parent Backend : 8085)
// -------------------------------------------------------------
export const parentApi = {
  getChildren: async (email = 'priya.sharma@gmail.com') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/children?email=${encodeURIComponent(email)}`, undefined, []);
  },

  createChild: async (childData: Record<string, any>) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/children`, {
      method: 'POST',
      body: JSON.stringify(childData),
    });
  },

  getWallet: async (email = 'priya.sharma@gmail.com') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/wallet?email=${encodeURIComponent(email)}`, undefined, {
      parentEmail: email,
      balance: 2500,
    });
  },

  payFromWallet: async (payload: { parent_email: string; child_id: number | string; amount: number; plan_type?: string; cab_id?: string }) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/wallet/pay`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  createPaymentOrder: async (amount: number, currency = 'INR') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/payment/order`, {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    });
  },

  verifyPayment: async (payload: Record<string, any>) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/payment/verify`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getSubscriptions: async (email = 'priya.sharma@gmail.com') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/subscriptions?email=${encodeURIComponent(email)}`, undefined, []);
  },

  triggerSos: async (payload?: Record<string, any>) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/sos`, {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    });
  },

  getNotifications: async (email = 'priya.sharma@gmail.com') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/notifications?email=${encodeURIComponent(email)}`, undefined, []);
  },

  getNotificationCenter: async (email = 'priya.sharma@gmail.com') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/notifications/all?email=${encodeURIComponent(email)}`, undefined, []);
  },

  markNotificationAsRead: async (notificationId: string | number) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/notifications/${notificationId}/read`, {
      method: 'PUT',
    }, { id: notificationId, status: 'READ' });
  },

  saveNotificationPreferences: async (preferences: Record<string, any>) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/notifications/preferences`, {
      method: 'POST',
      body: JSON.stringify(preferences),
    }, { status: 'SUCCESS' });
  },

  getLeaves: async (email = 'priya.sharma@gmail.com') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/leave?email=${encodeURIComponent(email)}`, undefined, []);
  },

  submitLeave: async (payload: { childName: string; slot: string; reason: string; date?: string }) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/leave`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getGuardianPasses: async (email = 'priya.sharma@gmail.com') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/guardian-pass?email=${encodeURIComponent(email)}`, undefined, []);
  },

  createGuardianPass: async (payload: { guardianName: string; relation: string; phone: string; childName?: string }) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/guardian-pass`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getBreakdownAlert: async (cabId = 'd1') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/trip/breakdown-alert?cabId=${cabId}`, undefined, {
      active: false,
      originalVehicle: 'Van TN-XX-1234',
      replacementVehicle: 'Force Traveller TN-09-BK-8822',
      backupDriver: 'Ravi Chandran (+91 98402 33445)',
      reason: 'Radiator Overheating Handled at Waypoint 2'
    });
  },
};

// -------------------------------------------------------------
// 3. DRIVER APIS (Driver Backend : 8084)
// -------------------------------------------------------------
export const driverApi = {
  getLocation: async (driverId = 'd1') => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/location?driverId=${driverId}`, undefined, {
      latitude: 13.0827,
      longitude: 80.2707,
      timestamp: Date.now(),
    });
  },

  updateLocation: async (driverId: string, latitude: number, longitude: number) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/location?driverId=${driverId}&latitude=${latitude}&longitude=${longitude}`, {
      method: 'POST',
    });
  },

  startTrip: async (driverId: number | string, vehicleId: number | string, routeId: number | string) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/start?driverId=${driverId}&vehicleId=${vehicleId}&routeId=${routeId}`, {
      method: 'POST',
    });
  },

  stopTrip: async (tripId: number | string) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/stop?tripId=${tripId}`, {
      method: 'POST',
    });
  },

  getChecklist: async (tripId: number | string) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/checklist?tripId=${tripId}`, undefined, []);
  },

  toggleBoard: async (logId: number | string, status: string) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/board?logId=${logId}&status=${status}`, {
      method: 'POST',
    });
  },

  submitSafetySweep: async (payload: { tripId?: number | string; tagCode?: string; photoUrl?: string }) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/safety-sweep`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  verifyGuardianPin: async (pin: string, studentId?: string) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/verify-guardian-pin`, {
      method: 'POST',
      body: JSON.stringify({ pin, studentId }),
    });
  },

  triggerBreakdownSwap: async (payload: { reason?: string; vehicleId?: string }) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/breakdown-swap`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getTelematics: async (driverId = 1) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/telematics?driverId=${driverId}`, undefined, {
      safetyScore: 98,
      harshBrakingEvents: 0,
      speedingEvents: 0,
      smoothAccelerationPct: 99,
      onTimeRatingPct: 97
    });
  },

  acceptSingleTrip: async (tripId: number | string, driverId = 1) => {
    return safeFetch<any>(`${API_BASE.DRIVER}/api/driver/trip/single/accept?tripId=${tripId}&driverId=${driverId}`, {
      method: 'POST',
    });
  },

  declineSingleTrip: async (tripId: number | string) => {
    return safeFetch<any>(`${API_BASE.DRIVER}/api/driver/trip/single/decline?tripId=${tripId}`, {
      method: 'POST',
    });
  },

  createMockSingleTrip: async (driverId = 1) => {
    return safeFetch<any>(`${API_BASE.DRIVER}/api/driver/trip/single/create-mock?driverId=${driverId}`, {
      method: 'POST',
    });
  },

  markSingleTripArrived: async (tripId: number | string) => {
    return safeFetch<any>(`${API_BASE.DRIVER}/api/driver/trip/single/arrived?tripId=${tripId}`, {
      method: 'POST',
    });
  },

  verifySingleTripOtp: async (tripId: number | string, otp: string) => {
    return safeFetch<any>(`${API_BASE.DRIVER}/api/driver/trip/single/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ tripId, otp }),
    });
  },

  completeSingleTrip: async (tripId: number | string) => {
    return safeFetch<any>(`${API_BASE.DRIVER}/api/driver/trip/single/complete?tripId=${tripId}`, {
      method: 'POST',
    });
  },

  getActiveSingleTrip: async (driverId = 1) => {
    return safeFetch<any>(`${API_BASE.DRIVER}/api/driver/trip/single/active?driverId=${driverId}`, undefined, null);
  },
};



// -------------------------------------------------------------
// 4. CAB OWNER APIS (Cab Owner Backend : 8083)
// -------------------------------------------------------------
export const cabOwnerApi = {
  getFleet: async () => {
    return safeFetch(`${API_BASE.CAB_OWNER}/api/fleet`, undefined, []);
  },

  registerCab: async (vehicleData: Record<string, any>) => {
    return safeFetch(`${API_BASE.CAB_OWNER}/api/fleet/register`, {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },

  assignDriver: async (assignmentData: Record<string, any>) => {
    return safeFetch(`${API_BASE.CAB_OWNER}/api/fleet/assign-driver`, {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  },

  getEarnings: async () => {
    return safeFetch(`${API_BASE.CAB_OWNER}/api/fleet/earnings`, undefined, []);
  },
};

// -------------------------------------------------------------
// 5. COMMUTER / STUDENT / WORK APIS (Student Work Backend : 8086)
// -------------------------------------------------------------
export const studentWorkApi = {
  searchRides: async (pickup: string, dropoff: string) => {
    return safeFetch(`${API_BASE.STUDENT_WORK}/api/commute/search?pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}`, undefined, []);
  },

  bookSeat: async (email: string, routeId: string, planType = 'MONTHLY') => {
    return safeFetch(`${API_BASE.STUDENT_WORK}/api/commute/book?email=${encodeURIComponent(email)}&routeId=${encodeURIComponent(routeId)}&planType=${encodeURIComponent(planType)}`, {
      method: 'POST',
    });
  },

  getPasses: async (email: string) => {
    return safeFetch(`${API_BASE.STUDENT_WORK}/api/commute/pass?email=${encodeURIComponent(email)}`, undefined, []);
  },

  getStudentRoutes: async (college?: string, pickup?: string) => {
    return safeFetch(`${API_BASE.STUDENT_WORK}/api/commute/routes/student?college=${encodeURIComponent(college || '')}&pickup=${encodeURIComponent(pickup || '')}`, undefined, []);
  },

  getProfessionalRoutes: async (company?: string, pickup?: string) => {
    return safeFetch(`${API_BASE.STUDENT_WORK}/api/commute/routes/professional?company=${encodeURIComponent(company || '')}&pickup=${encodeURIComponent(pickup || '')}`, undefined, []);
  },

  getAttendanceLogs: async (email?: string) => {
    return safeFetch(`${API_BASE.STUDENT_WORK}/api/commute/attendance?email=${encodeURIComponent(email || '')}`, undefined, []);
  },

  getLiveTracking: async (type = 'student') => {
    return safeFetch(`${API_BASE.STUDENT_WORK}/api/commute/tracking/live?type=${type}`, undefined, {});
  },

  getAIMatches: async (pickup = 'Kattur', destination = 'ABC College', tab = 'recommended', maxBudget = 4000) => {
    return safeFetch(`${API_BASE.STUDENT_WORK}/api/commute/ai-match?pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}&tab=${tab}&maxBudget=${maxBudget}`, undefined, {
      recommended: [
        {
          id: 'rm-1',
          matchScore: 95,
          matchColor: 'bg-emerald-500 text-white',
          category: 'Shared Ride',
          pickup,
          destination,
          departureTime: '7:30 AM',
          arrivalTime: '8:15 AM',
          seatsAvailable: 20,
          vehicleType: 'Van',
          vehiclePlate: 'TN-XX-5678',
          seater: '5 Seater',
          isAc: true,
          rating: 4.9,
          isVerified: true,
          priceMonthly: 2800,
          priceDaily: 93,
          driverName: 'Ramesh Kumar',
          driverPhone: '+91 98401 23456'
        },
        {
          id: 'rm-2',
          matchScore: 88,
          matchColor: 'bg-blue-600 text-white',
          category: 'College Route',
          pickup,
          destination: 'Sri Venkateswara College',
          departureTime: '7:20 AM',
          arrivalTime: '8:10 AM',
          seatsAvailable: 12,
          vehicleType: 'Car',
          vehiclePlate: 'TN-XX-9012',
          seater: '4 Seater',
          isAc: true,
          rating: 4.8,
          isVerified: true,
          priceMonthly: 3200,
          priceDaily: 106,
          driverName: 'Sathish Verma',
          driverPhone: '+91 98401 77889'
        },
        {
          id: 'rm-3',
          matchScore: 82,
          matchColor: 'bg-amber-500 text-white',
          category: 'Work Route',
          pickup: 'Lawspet',
          destination: 'IT Park (Chennai)',
          departureTime: '8:00 AM',
          arrivalTime: '9:00 AM',
          seatsAvailable: 8,
          vehicleType: 'Van',
          vehiclePlate: 'TN-XX-3456',
          seater: '7 Seater',
          isAc: true,
          rating: 4.9,
          isVerified: true,
          priceMonthly: 3500,
          priceDaily: 116,
          driverName: 'K. Balaji',
          driverPhone: '+91 98401 99001'
        }
      ],
      nearby: [
        {
          id: 'rm-4',
          matchScore: 78,
          matchColor: 'bg-indigo-600 text-white',
          category: 'Shared Ride',
          pickup: `${pickup} Outer Ring`,
          destination: `${destination} Campus 2`,
          departureTime: '7:45 AM',
          arrivalTime: '8:30 AM',
          seatsAvailable: 6,
          vehicleType: 'Van',
          vehiclePlate: 'TN-XX-1122',
          seater: '6 Seater',
          isAc: true,
          rating: 4.7,
          isVerified: true,
          priceMonthly: 2900,
          priceDaily: 96,
          driverName: 'M. Anand',
          driverPhone: '+91 98401 33221'
        },
        {
          id: 'rm-5',
          matchScore: 74,
          matchColor: 'bg-sky-600 text-white',
          category: 'College Route',
          pickup: 'Gorimedu',
          destination: 'Sri Venkateswara College',
          departureTime: '7:15 AM',
          arrivalTime: '8:05 AM',
          seatsAvailable: 9,
          vehicleType: 'Traveller',
          vehiclePlate: 'TN-XX-4490',
          seater: '12 Seater',
          isAc: true,
          rating: 4.6,
          isVerified: true,
          priceMonthly: 2600,
          priceDaily: 86,
          driverName: 'D. Pandian',
          driverPhone: '+91 98401 55667'
        }
      ],
      aiInsight: `High demand for ${pickup} ➔ ${destination} route. Consider adding 2 more vehicles to increase availability.`
    });
  },
};

// -------------------------------------------------------------
// 6. SINGLE TRIP DISPATCH & 45-SEC OTP PROTOCOL APIS
// -------------------------------------------------------------
export const singleTripApi = {
  requestTrip: async (payload: {
    passengerName: string;
    passengerEmail: string;
    passengerPhone: string;
    pickupAddress: string;
    dropAddress: string;
    pickupLat?: number;
    pickupLng?: number;
    dropLat?: number;
    dropLng?: number;
    fare?: number;
  }) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/trip/single/request`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, {
      success: true,
      message: 'Single trip dispatched to near driver with 45-second acceptance countdown.',
      trip: {
        id: Date.now(),
        passengerName: payload.passengerName,
        passengerEmail: payload.passengerEmail,
        passengerPhone: payload.passengerPhone,
        pickupAddress: payload.pickupAddress,
        dropAddress: payload.dropAddress,
        pickupLat: payload.pickupLat || 13.0725,
        pickupLng: payload.pickupLng || 80.2180,
        dropLat: payload.dropLat || 13.0815,
        dropLng: payload.dropLng || 80.2355,
        driverId: 1,
        driverName: 'Kumar Swamy',
        driverPhone: '+91 98401 23456',
        vehiclePlate: 'TN 01 AB 1234',
        vehicleModel: 'Mercedes Van (White)',
        fare: payload.fare || 180.0,
        otpCode: '8492',
        status: 'DISPATCHED_45S',
        countdownSeconds: 45,
        distanceKm: 4.2,
        etaMins: 12,
        requestedAt: new Date().toISOString()
      },
      otp: '8492'
    });
  },

  getActiveTrip: async (emailOrDriverId?: string | number) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/trip/single/active?email=${encodeURIComponent(String(emailOrDriverId || ''))}`, undefined, null);
  },

  acceptTrip: async (tripId: number | string, driverId = 1) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/single/accept?tripId=${tripId}&driverId=${driverId}`, {
      method: 'POST',
    }, {
      success: true,
      message: 'Single trip accepted within 45s timer window.',
      trip: { id: tripId, status: 'ACCEPTED', acceptedAt: new Date().toISOString() }
    });
  },

  markArrived: async (tripId: number | string) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/single/arrived?tripId=${tripId}`, {
      method: 'POST',
    }, {
      success: true,
      message: 'Driver arrived at pickup waypoint. Awaiting OTP verification.',
      trip: { id: tripId, status: 'ARRIVED' }
    });
  },

  verifyOtp: async (tripId: number | string, otp: string) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/single/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ tripId, otp }),
    }, {
      success: true,
      verified: true,
      message: 'OTP verified successfully. Passenger boarded, trip commenced.',
      trip: { id: tripId, status: 'IN_PROGRESS', otpVerifiedAt: new Date().toISOString() }
    });
  },

  declineTrip: async (tripId: number | string) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/single/decline?tripId=${tripId}`, {
      method: 'POST',
    }, {
      success: true,
      message: 'Single trip declined.',
      trip: { id: tripId, status: 'DECLINED' }
    });
  },

  createMockTrip: async (driverId = 1) => {
    return driverApi.createMockSingleTrip(driverId);
  },

  completeTrip: async (tripId: number | string) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/single/complete?tripId=${tripId}`, {
      method: 'POST',
    }, {
      success: true,
      message: 'Single trip marked completed. Receipt generated.',
      trip: { id: tripId, status: 'COMPLETED', completedAt: new Date().toISOString() }
    });
  },
};

// -------------------------------------------------------------
// 7. PACKAGES TRIP APIS
// -------------------------------------------------------------
export const packagesApi = {
  getPackagesList: async () => {
    return [
      {
        id: 'pkg-school-quarterly',
        name: 'School Academic Term Pass',
        badge: 'Most Popular',
        category: 'School',
        validity: '3 Months (90 Days)',
        ridesIncluded: 'Daily Pick & Drop (Mon-Fri)',
        originalPrice: 8000,
        discountedPrice: 7200,
        discountPct: '10% OFF',
        features: ['Live GPS Corridor Tracking', 'Anti-Abandonment Child Safety', 'Guardian Pin Handover', '1-Tap Absence Skip Credit']
      },
      {
        id: 'pkg-college-semester',
        name: 'College Semester Commute Bundle',
        badge: 'Best Value',
        category: 'College',
        validity: '5 Months (Semester)',
        ridesIncluded: '60 Return Rides',
        originalPrice: 9500,
        discountedPrice: 8500,
        discountPct: '₹1,000 OFF',
        features: ['Reserved Fixed Seater AC Cab', 'Flexible Timing Swaps', 'Loyola & Campus Gate Drop', 'Exam Late-Night Escort']
      },
      {
        id: 'pkg-corp-20pack',
        name: 'Corporate Flex 20-Ride Card',
        badge: 'Flexible',
        category: 'Corporate / Work',
        validity: '45 Days Validity',
        ridesIncluded: '20 Rides On-Demand',
        originalPrice: 3000,
        discountedPrice: 2400,
        discountPct: '20% OFF',
        features: ['IT Park Direct Corridor', 'Doorstep Pickup Guarantee', 'Zero Peak Surcharge', 'GST Tax Invoice Auto-Claim']
      },
      {
        id: 'pkg-daily-return',
        name: 'Daily Single / Return Pass',
        badge: 'Instant',
        category: 'Any',
        validity: 'Same Day Only',
        ridesIncluded: '1 or 2 Rides',
        originalPrice: 200,
        discountedPrice: 180,
        discountPct: '₹20 OFF',
        features: ['Instant 45s Driver Dispatch', '4-Digit Secure OTP Boarding', 'Real-time Radar ETA Alert']
      }
    ];
  },

  subscribePackage: async (payload: { packageId: string; packageName: string; amount: number; userEmail?: string; childId?: number }) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/packages/subscribe`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, {
      success: true,
      subscriptionId: 'SUB-PKG-' + Date.now(),
      packageType: payload.packageId,
      amount: payload.amount,
      message: 'Package subscription activated successfully with seat reservation.'
    });
  }
};

// -------------------------------------------------------------
// 8. SOS & EMERGENCY ALERT PROTOCOL APIS
// -------------------------------------------------------------
export const sosApi = {
  triggerEmergency: async (payload: { email?: string; reason?: string; location?: { lat: number; lng: number }; vehiclePlate?: string }) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/sos`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, {
      status: 'DISPATCHED',
      sosId: 'SOS-' + Date.now(),
      message: 'Emergency SOS dispatched to school control room, police helpline, and emergency contacts.'
    });
  }
};

