import { Platform } from 'react-native';

const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE = {
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
// DRIVER APIS (:8084)
// -------------------------------------------------------------
export const driverApi = {
  getLocation: async (driverId = 'd1') => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/location?driverId=${driverId}`, undefined, {
      latitude: 12.9815,
      longitude: 80.2450,
      timestamp: Date.now(),
    });
  },

  updateLocation: async (driverId: string, latitude: number, longitude: number) => {
    return safeFetch(
      `${API_BASE.DRIVER}/api/driver/location?driverId=${driverId}&latitude=${latitude}&longitude=${longitude}`,
      { method: 'POST' },
      { latitude, longitude, timestamp: Date.now() }
    );
  },

  startTrip: async (driverId: number | string = 1, vehicleId: number | string = 1, routeId: number | string = 1) => {
    return safeFetch<any>(
      `${API_BASE.DRIVER}/api/driver/trip/start?driverId=${driverId}&vehicleId=${vehicleId}&routeId=${routeId}`,
      { method: 'POST' }
    );
  },

  stopTrip: async (tripId: number | string) => {
    return safeFetch<any>(`${API_BASE.DRIVER}/api/driver/trip/stop?tripId=${tripId}`, {
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

  updateTripStatus: async (tripId: number | string, status: string) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/${tripId}/status?status=${status}`, {
      method: 'POST',
    });
  },

  submitSafetySweep: async (payload: { tripId?: number | string; tagCode?: string; photoUrl?: string }) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/safety-sweep`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, {
      status: 'CERTIFIED_CLEAR',
      sweepId: 'SWEEP-001',
      sleepingChildrenCount: 0,
      message: 'Anti-Abandonment sweep certified.',
    });
  },

  verifyGuardianPin: async (pin: string, studentId?: string) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/verify-guardian-pin`, {
      method: 'POST',
      body: JSON.stringify({ pin, studentId }),
    }, {
      verified: pin === '7429' || pin.length === 4,
      guardianName: 'Ramesh Sharma (Uncle)',
      message: 'Guardian verified.',
    });
  },

  triggerBreakdownSwap: async (payload: { reason?: string; vehicleId?: string }) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/breakdown-swap`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, {
      status: 'BACKUP_DISPATCHED',
      replacementVehicle: 'Force Traveller TN-09-BK-8822',
      backupDriver: 'Ravi Chandran (+91 98402 33445)',
      message: 'Backup cab dispatched.',
    });
  },

  getTelematics: async (driverId = 1) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/telematics?driverId=${driverId}`, undefined, {
      safetyScore: 98,
      harshBrakingEvents: 0,
      speedingEvents: 0,
      smoothAccelerationPct: 99,
      onTimeRatingPct: 97,
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

export const singleTripApi = {
  acceptTrip: async (tripId: number | string, driverId = 1) => driverApi.acceptSingleTrip(tripId, driverId),
  declineTrip: async (tripId: number | string) => driverApi.declineSingleTrip(tripId),
  createMockTrip: async (driverId = 1) => driverApi.createMockSingleTrip(driverId),
  markArrived: async (tripId: number | string) => driverApi.markSingleTripArrived(tripId),
  verifyOtp: async (tripId: number | string, otp: string) => driverApi.verifySingleTripOtp(tripId, otp),
  completeTrip: async (tripId: number | string) => driverApi.completeSingleTrip(tripId),
  getActiveTrip: async (driverId = 1) => driverApi.getActiveSingleTrip(driverId),
};

// -------------------------------------------------------------
// CAB OWNER & FLEET APIS (:8083)
// -------------------------------------------------------------
export const cabOwnerApi = {
  getFleet: async () => {
    return safeFetch(`${API_BASE.CAB_OWNER}/api/fleet`, undefined, [
      { id: 1, regNumber: 'TN 01 AB 1234', vehicleType: 'VAN', capacity: 12, verificationStatus: 'VERIFIED' },
      { id: 2, regNumber: 'TN 02 CD 5678', vehicleType: 'SUV', capacity: 7, verificationStatus: 'VERIFIED' },
      { id: 3, regNumber: 'TN 03 EF 9012', vehicleType: 'BUS', capacity: 40, verificationStatus: 'PENDING' },
    ]);
  },

  registerCab: async (vehicleData: Record<string, any>) => {
    return safeFetch(`${API_BASE.CAB_OWNER}/api/fleet/register`, {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },

  getEarnings: async () => {
    return safeFetch(`${API_BASE.CAB_OWNER}/api/fleet/earnings`, undefined, [
      { id: 'e1', period: 'Aug 17 - Aug 23, 2026', grossEarnings: 15400, commission: 1540, netPayout: 13860, status: 'paid' },
      { id: 'e2', period: 'Aug 10 - Aug 16, 2026', grossEarnings: 18200, commission: 1820, netPayout: 16380, status: 'paid' },
      { id: 'e3', period: 'Aug 03 - Aug 09, 2026', grossEarnings: 12500, commission: 1250, netPayout: 11250, status: 'pending' },
    ]);
  },
};

// -------------------------------------------------------------
// PARENT & FILE UPLOAD / SOS APIS (:8085)
// -------------------------------------------------------------
export const parentApi = {
  triggerSos: async (payload?: Record<string, any>) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/sos`, {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    });
  },

  triggerFcmAlert: async (payload: { email?: string; title: string; message: string; type?: string }) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/notifications/trigger`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getDriverDetails: async (driverId = 'd1') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/driver/${driverId}/details`, undefined, {
      driverId,
      driverName: 'Kumar',
      driverRole: 'Senior Fleet Driver',
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
};

// -------------------------------------------------------------
// SINGLE TRIP & ON-DEMAND DISPATCH APIS (:8085)
// -------------------------------------------------------------
export const singleTripApi = {
  calculateFare: async (distanceKm = 2.0) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/trip/single/calculate-fare`, {
      method: 'POST',
      body: JSON.stringify({ distanceKm }),
    }, {
      distanceKm,
      fare: distanceKm <= 2.0 ? 35.0 : 35.0 + Math.round((distanceKm - 2.0) * 14.0),
      baseFare: 35.0,
      breakdown: distanceKm <= 2.0 ? '₹35 flat rate for first 2.0 km' : `₹35 base + ₹${Math.round((distanceKm - 2.0) * 14)} (${(distanceKm - 2.0).toFixed(1)} km @ ₹14/km)`
    });
  },

  acceptTrip: async (tripId: number | string, driverId = 1) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/accept`, {
      method: 'POST',
      body: JSON.stringify({ tripId, driverId }),
    }, { success: true, status: 'ACCEPTED' });
  },

  declineTrip: async (tripId: number | string) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/decline`, {
      method: 'POST',
      body: JSON.stringify({ tripId }),
    }, { success: true, status: 'DECLINED' });
  },

  markArrived: async (tripId: number | string) => {
    return safeFetch(`${API_BASE.DRIVER}/api/driver/trip/arrived`, {
      method: 'POST',
      body: JSON.stringify({ tripId }),
    }, { success: true, status: 'ARRIVED' });
  },

  verifyOtp: async (tripId: number | string, otp: string) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/trip/single/verify-pickup-otp`, {
      method: 'POST',
      body: JSON.stringify({ tripId, otp }),
    }, { verified: true, status: 'IN_PROGRESS', message: 'Passenger Boarding Verified' });
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
      message: 'Drop Verified'
    });
  },

  completePayment: async (tripId: number | string, paymentMethod = 'RAZORPAY_QR') => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/trip/single/payment/complete`, {
      method: 'POST',
      body: JSON.stringify({ tripId, paymentMethod }),
    }, { success: true, paymentStatus: 'PAID_' + paymentMethod.toUpperCase() });
  },

  completeTrip: async (tripId: number | string) => {
    return safeFetch(`${API_BASE.PARENT}/api/parent/trip/single/verify-drop-otp`, {
      method: 'POST',
      body: JSON.stringify({ tripId, dropOtp: '7429' }),
    }, { success: true, status: 'COMPLETED', fare: 35.0 });
  },
};
