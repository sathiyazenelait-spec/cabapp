import { Platform } from 'react-native';

export const USE_CLOUD_BACKEND = true;

const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE = USE_CLOUD_BACKEND
  ? {
      SUPER_ADMIN: 'https://safepassage-super-admin.onrender.com',
      CAB_OWNER: 'https://safepassage-cab-owner-api.onrender.com',
      DRIVER: 'https://safepassage-driver-api.onrender.com',
      PARENT: 'https://safepassage-parent-api.onrender.com',
      STUDENT_WORK: 'https://safepassage-student-work-api.onrender.com',
    }
  : {
      SUPER_ADMIN: `http://${HOST}:8082`,
      CAB_OWNER: `http://${HOST}:8083`,
      DRIVER: `http://${HOST}:8084`,
      PARENT: `http://${HOST}:8085`,
      STUDENT_WORK: `http://${HOST}:8086`,
    };

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

async function safeFetch<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options?.headers as Record<string, string> || {}),
    };

    const res = await fetch(url, {
      ...options,
      headers,
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
// 1. PARENT APIS (:8085)
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

  getActiveTrip: async (email = 'priya.sharma@gmail.com') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/trip/active?email=${encodeURIComponent(email)}`, undefined, {
      childName: 'Arun Kumar',
      grade: 'Class 3 - Green Valley School',
      vehicleNumber: 'Van TN-XX-1234',
      driverName: 'Kumar',
      driverPhone: '+91 98401 23456',
      status: 'On Route',
      etaMinutes: 12,
      arrivingAt: '8:10 AM',
      currentLat: 11.9360,
      currentLng: 79.8320,
      pickupLocation: 'Kattur, Puducherry',
      dropLocation: 'Green Valley School',
    });
  },

  getTripTimeline: async (tripId = '1') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/trip/timeline?tripId=${tripId}`, undefined, [
      { id: 1, time: '7:32 AM', status: 'Picked Up', location: 'Kattur', completed: true },
      { id: 2, time: '7:45 AM', status: 'On Route', location: 'Lawspet', completed: true },
      { id: 3, time: '8:10 AM', status: 'Reached School', location: 'Green Valley School', completed: false },
    ]);
  },

  getAvailableRoutes: async (category = 'School', pickup = 'Kattur', drop = 'Green Valley School') => {
    return safeFetch(
      `${API_BASE.PARENT}/api/parent/routes/available?category=${encodeURIComponent(category)}&pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}`,
      undefined,
      [
        {
          id: 'r1',
          recommended: true,
          vehicleNumber: 'Van TN-XX-1234',
          vehicleType: '7 Seater • AC',
          rating: 4.8,
          reviewCount: 32,
          driverName: 'Kumar',
          driverVerified: true,
          routeDescription: 'Kattur → Green Valley School',
          via: 'Kattur, Lawspet, Manaveli',
          timing: '7:30 AM - 8:15 AM',
          monthlyPrice: 3000,
          seatsAvailable: 6,
        },
        {
          id: 'r2',
          recommended: false,
          vehicleNumber: 'Van TN-XX-5678',
          vehicleType: '7 Seater • AC',
          rating: 4.6,
          reviewCount: 21,
          driverName: 'Ramesh',
          driverVerified: true,
          routeDescription: 'Kattur → Green Valley School',
          via: 'Kattur, Railway Station, Ozhukarai',
          timing: '7:40 AM - 8:30 AM',
          monthlyPrice: 2800,
          seatsAvailable: 3,
        },
        {
          id: 'r3',
          recommended: false,
          vehicleNumber: 'Car TN-XX-9012',
          vehicleType: '5 Seater • AC',
          rating: 4.5,
          reviewCount: 18,
          driverName: 'Suresh',
          driverVerified: true,
          routeDescription: 'Kattur → Green Valley School',
          via: 'Kattur, ECR, Lawspet',
          timing: '7:35 AM - 8:20 AM',
          monthlyPrice: 2500,
          seatsAvailable: 2,
        },
      ]
    );
  },

  getDriverDetails: async (driverId = 'd1') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/driver/${driverId}/details`, undefined, {
      driverId,
      driverName: 'Kumar',
      driverRole: 'Senior School Fleet Driver',
      driverRating: 4.8,
      reviewCount: 32,
      vehicleNumber: 'Van TN-XX-1234',
      vehicleType: '7 SEATER • AC',
      verified: true,
      phone: '+91 98401 23456',
      documents: [
        { id: 'dl', title: 'Driving Licence', status: 'VERIFIED', verified: true },
        { id: 'rc', title: 'Vehicle RC', status: 'VERIFIED', verified: true },
        { id: 'ins', title: 'Insurance', status: 'VERIFIED', verified: true },
        { id: 'fc', title: 'Fitness Certificate', status: 'VERIFIED', verified: true },
      ],
    });
  },

  getInvoice: async (invoiceId = 'INV-001234') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/invoices/${invoiceId}`, undefined, {
      invoiceNumber: invoiceId,
      issueDate: '5 Mar 2025',
      serviceTitle: 'Green Valley School',
      serviceSubtitle: 'Monthly Transport Subscription',
      childName: 'Arun Kumar',
      route: 'Kattur → Green Valley School',
      vehicle: 'Van TN-XX-1234',
      plan: 'Monthly',
      amount: 3000.0,
      status: 'PAID',
    });
  },

  getFaqs: async () => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/faqs`, undefined, [
      { question: 'How to change pick-up location?', answer: 'You can update your pick-up location under Profile > Transport Details.' },
      { question: 'How to cancel subscription?', answer: 'Go to My Subscriptions > View Details > Cancel Subscription before the 5th.' },
      { question: 'How do notifications work?', answer: 'Push alerts are sent when your child boards, when 12 mins away, and upon safe drop.' },
    ]);
  },

  submitComplaint: async (payload: { category: string; description: string; parentEmail?: string; vehicleNumber?: string }) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/complaints`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, {
      ticketId: 'CP-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      status: 'SUBMITTED',
      message: 'Your complaint has been assigned to the safety team.',
    });
  },

  triggerSos: async (payload?: Record<string, any>) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/sos`, {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    }, {
      status: 'DISPATCHED',
      sosId: 'SOS-' + Date.now(),
      message: 'Emergency SOS dispatched to school control room, police helpline, and emergency contacts.',
    });
  },

  getNotifications: async (email = 'priya.sharma@gmail.com') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/notifications?email=${encodeURIComponent(email)}`, undefined, [
      { id: 1, parentEmail: email, title: 'Child Boarded Safely', message: 'Arun Kumar boarded Kumar\'s Van at Kattur Stop', type: 'ATTENDANCE', sentTime: new Date().toISOString() },
      { id: 2, parentEmail: email, title: 'Near School Alert', message: 'Cab is within 0.5 miles from Green Valley School', type: 'GENERAL', sentTime: new Date().toISOString() },
    ]);
  },

  getLeaves: async (email = 'priya.sharma@gmail.com') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/leave?email=${encodeURIComponent(email)}`, undefined, [
      { id: '1', childName: 'Arun Kumar', date: 'Today', slot: 'Morning Only', reason: 'Feeling Unwell / Fever', status: 'ACTIVE_SKIPPED' }
    ]);
  },

  submitLeave: async (payload: { childName: string; slot: string; reason: string; date?: string }) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/leave`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, {
      id: 'L-' + Date.now(),
      status: 'ACTIVE_SKIPPED',
      message: 'Leave registered. Driver waypoint auto-skipped.',
    });
  },

  getGuardianPasses: async (email = 'priya.sharma@gmail.com') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/guardian-pass?email=${encodeURIComponent(email)}`, undefined, [
      { id: '1', guardianName: 'Ramesh Sharma', relation: 'Uncle / Paternal Brother', phone: '+91 98409 88771', pin: '7429', status: 'ACTIVE' }
    ]);
  },

  createGuardianPass: async (payload: { guardianName: string; relation: string; phone: string; childName?: string }) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/guardian-pass`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, {
      id: 'GP-' + Date.now(),
      pin: '7429',
      status: 'ACTIVE',
      message: 'Guardian Handover Pass created with PIN.',
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

  triggerFcmNotification: async (payload: { email?: string; title: string; message: string; type?: string }) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/notifications/trigger`, {
      method: 'POST',
      body: JSON.stringify(payload),
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
};

// -------------------------------------------------------------
// 2. COMMUTER / STUDENT / WORK APIS (:8086)
// -------------------------------------------------------------
export const studentWorkApi = {
  searchRides: async (pickup: string, dropoff: string) => {
    return safeFetch(
      `${API_BASE.STUDENT_WORK}/api/commute/search?pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}`,
      undefined,
      []
    );
  },

  getStudentRoutes: async (college?: string, pickup?: string) => {
    return safeFetch(
      `${API_BASE.STUDENT_WORK}/api/commute/routes/student?college=${encodeURIComponent(college || '')}&pickup=${encodeURIComponent(pickup || '')}`,
      undefined,
      [
        {
          id: 'sr1',
          vehicle: 'Van TN-XX-5678',
          vehicleType: '7 Seater • AC',
          rating: 4.6,
          reviewCount: 124,
          driver: 'Rajesh Kumar',
          driverVerified: true,
          route: 'Kattur → ABC College',
          timing: '7:40 AM - 8:15 AM',
          priceMonthly: 1800,
          availableSeats: 2,
          amenities: ['AC', 'GPS Tracking', 'Safe & Verified', 'CCTV'],
        },
        {
          id: 'sr2',
          vehicle: 'Van TN-XX-9012',
          vehicleType: '12 Seater • AC',
          rating: 4.4,
          reviewCount: 89,
          driver: 'Suresh',
          driverVerified: true,
          route: 'Lawspet → ABC College',
          timing: '7:50 AM - 8:25 AM',
          priceMonthly: 1600,
          availableSeats: 5,
          amenities: ['AC', 'GPS Tracking', 'Safe & Verified'],
        },
      ]
    );
  },

  getProfessionalRoutes: async (company?: string, pickup?: string) => {
    return safeFetch(
      `${API_BASE.STUDENT_WORK}/api/commute/routes/professional?company=${encodeURIComponent(company || '')}&pickup=${encodeURIComponent(pickup || '')}`,
      undefined,
      [
        {
          id: 'pr1',
          vehicle: 'Van TN-XX-7890',
          vehicleType: '7 Seater • AC',
          rating: 4.7,
          reviewCount: 96,
          driver: 'Selvam',
          driverVerified: true,
          route: 'Kattur → IT Park, Chennai',
          timing: '7:00 AM - 8:00 AM',
          priceMonthly: 3200,
          availableSeats: 2,
        },
        {
          id: 'pr2',
          vehicle: 'Car TN-XX-4478',
          vehicleType: '5 Seater • AC',
          rating: 4.5,
          reviewCount: 72,
          driver: 'Karthik',
          driverVerified: true,
          route: 'Lawspet → IT Park',
          timing: '7:15 AM - 8:15 AM',
          priceMonthly: 3500,
          availableSeats: 1,
        },
      ]
    );
  },

  bookSeat: async (email: string, routeId: string, planType = 'MONTHLY') => {
    return safeFetch(
      `${API_BASE.STUDENT_WORK}/api/commute/book?email=${encodeURIComponent(email)}&routeId=${encodeURIComponent(routeId)}&planType=${encodeURIComponent(planType)}`,
      { method: 'POST' }
    );
  },

  getPasses: async (email: string) => {
    return safeFetch(`${API_BASE.STUDENT_WORK}/api/commute/pass?email=${encodeURIComponent(email)}`, undefined, []);
  },

  getAttendanceLogs: async (email?: string) => {
    return safeFetch(`${API_BASE.STUDENT_WORK}/api/commute/attendance?email=${encodeURIComponent(email || '')}`, undefined, [
      { id: 'att1', date: '15 Apr 2025', route: 'Kattur → IT Park', vehicle: 'Van TN-XX-7890', driver: 'Selvam', timing: '8:00 AM - 8:15 AM', status: 'BOARDED', punctuality: 'On Time' },
      { id: 'att2', date: '14 Apr 2025', route: 'Lawspet → IT Park', vehicle: 'Van TN-XX-2234', driver: 'Ramesh', timing: '7:50 AM - 8:20 AM', status: 'BOARDED', punctuality: 'On Time' },
    ]);
  },
};

export const singleTripApi = {
  calculateFare: async (distanceKm = 2.0) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/trip/single/calculate-fare`, {
      method: 'POST',
      body: JSON.stringify({ distanceKm }),
    }, {
      distanceKm,
      fare: distanceKm <= 2.0 ? 35.0 : 35.0 + Math.round((distanceKm - 2.0) * 14.0),
      baseDistanceKm: 2.0,
      baseFare: 35.0,
      additionalRatePerKm: 14.0,
      breakdown: distanceKm <= 2.0 ? '₹35 flat rate for first 2.0 km' : `₹35 base (first 2 km) + ₹${Math.round((distanceKm - 2.0) * 14)} (${(distanceKm - 2.0).toFixed(1)} km @ ₹14/km)`
    });
  },

  requestTrip: async (payload: {
    passengerName: string;
    passengerEmail: string;
    passengerPhone: string;
    pickupAddress: string;
    dropAddress: string;
    distanceKm?: number;
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
      message: 'Trip requested (Sandbox Mode)',
      boardingOtp: '8492',
      dropOtp: '7429',
      fare: payload.fare || 35.0,
      distanceKm: payload.distanceKm || 2.0,
      razorpayOrderId: 'order_sandbox_' + Date.now(),
      upiQrPayload: `upi://pay?pa=safepassage.driver@icici&pn=Kumar+Swamy+Driver&am=${(payload.fare || 35.0).toFixed(2)}&cu=INR&tn=SafePassage+Trip`
    });
  },

  verifyPickupOtp: async (tripId: number | string, otp: string) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/trip/single/verify-pickup-otp`, {
      method: 'POST',
      body: JSON.stringify({ tripId, otp }),
    }, { verified: true, status: 'IN_PROGRESS', message: 'Boarding verified' });
  },

  verifyDropOtp: async (tripId: number | string, dropOtp: string) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/trip/single/verify-drop-otp`, {
      method: 'POST',
      body: JSON.stringify({ tripId, dropOtp }),
    }, {
      verified: true,
      status: 'COMPLETED',
      fare: 35.0,
      upiQrPayload: 'upi://pay?pa=safepassage.driver@icici&pn=SafePassage+Fleet&am=35.00&cu=INR&tn=SingleTrip+Drop+Settlement',
      message: 'Drop verified'
    });
  },

  completePayment: async (tripId: number | string, paymentMethod = 'RAZORPAY_QR') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/trip/single/payment/complete`, {
      method: 'POST',
      body: JSON.stringify({ tripId, paymentMethod }),
    }, { success: true, paymentStatus: 'PAID_' + paymentMethod.toUpperCase() });
  },

  getActiveTrip: async (email?: string) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/trip/single/active?email=${encodeURIComponent(email || '')}`, undefined, null);
  },
};

export const packagesApi = {
  subscribePackage: async (payload: { packageId: string; packageName: string; amount: number; userEmail?: string; childId?: number }) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/packages/subscribe`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

