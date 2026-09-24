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
// SUPER ADMIN APIS (:8082)
// -------------------------------------------------------------
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

  getInstitutions: async () => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/institutions`, undefined, []);
  },

  createInstitution: async (data: Record<string, any>) => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/institutions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getOffers: async () => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/offers`, undefined, []);
  },

  createOffer: async (data: Record<string, any>) => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/offers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAIDemand: async () => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/ai/demand`, undefined, [
      { corridor: 'Kattur ➔ Chennai IT Park', demand: 'High 🔥', studentsCount: 28, employeesCount: 46, availableSeats: 17, recommendation: 'Add 3 vehicles to this corridor.' },
      { corridor: 'Tambaram ➔ ABC Matriculation School', demand: 'Medium 📈', studentsCount: 19, employeesCount: 5, availableSeats: 4, recommendation: 'Optimize route timing to save 8 minutes.' },
    ]);
  },

  getAnalytics: async () => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/analytics`, undefined, {});
  },

  getComplaints: async () => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/complaints`, undefined, []);
  },

  getDemandOverview: async (date = 'Apr 15, 2025') => {
    return safeFetch<any>(`${API_BASE.SUPER_ADMIN}/api/admin/analytics/demand-overview?date=${encodeURIComponent(date)}`, undefined, {
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
        { id: 1, origin: 'Kattur', destination: 'ABC College', category: 'College', demandCount: 68, availableSeats: 12, fillRate: 85 },
        { id: 2, origin: 'Kattur', destination: 'IT Park', category: 'Work', demandCount: 54, availableSeats: 10, fillRate: 84 },
        { id: 3, origin: 'Ariyankuppam', destination: 'School', category: 'School', demandCount: 48, availableSeats: 8, fillRate: 86 },
        { id: 4, origin: 'Lawspet', destination: 'College', category: 'College', demandCount: 41, availableSeats: 15, fillRate: 73 },
        { id: 5, origin: 'Villupuram', destination: 'IT Park', category: 'Work', demandCount: 37, availableSeats: 9, fillRate: 80 },
      ],
      heatSpots: [
        { name: 'Kattur Corridor', demand: 68, intensity: 'Very High', lat: 11.9360, lng: 79.8320 },
        { name: 'ABC College Belt', demand: 45, intensity: 'High', lat: 11.9480, lng: 79.8150 },
        { name: 'OMR IT Park', demand: 54, intensity: 'High', lat: 12.8390, lng: 80.2180 },
      ],
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

  getSingleTrips: async () => {
    return safeFetch<any>(`${API_BASE.SUPER_ADMIN}/api/admin/trips/single`, undefined, []);
  },
};

