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

export const authApi = {
  login: async (username: string, password: string) => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  register: async (data: Record<string, any>) => {
    return safeFetch(`${API_BASE.SUPER_ADMIN}/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export const adminApi = {
  getStats: async () => safeFetch(`${API_BASE.SUPER_ADMIN}/api/dashboard/stats`, undefined, {}),
  getUsers: async () => safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/users`, undefined, []),
  getVehicles: async () => safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/vehicles`, undefined, []),
  getComplaints: async () => safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/complaints`, undefined, []),
  getAIDemand: async () => safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/ai/demand`, undefined, []),
  getDemandOverview: async (date = 'Apr 15, 2025') => safeFetch(`${API_BASE.SUPER_ADMIN}/api/admin/analytics/demand-overview?date=${encodeURIComponent(date)}`, undefined, {}),
};

export const parentApi = {
  getChildren: async (email = 'priya.sharma@gmail.com') => safeFetch(`${API_BASE.PARENT}/api/parent/children?email=${encodeURIComponent(email)}`, undefined, []),
  getAvailableRoutes: async () => safeFetch(`${API_BASE.PARENT}/api/parent/routes/available`, undefined, []),
  getDriverDetails: async (driverId = 'd1') => safeFetch(`${API_BASE.PARENT}/api/parent/driver/${driverId}/details`, undefined, {}),
  getNotifications: async (email = 'priya.sharma@gmail.com') => safeFetch(`${API_BASE.PARENT}/api/parent/notifications?email=${encodeURIComponent(email)}`, undefined, []),
  getNotificationCenter: async (email = 'priya.sharma@gmail.com') => safeFetch(`${API_BASE.PARENT}/api/parent/notifications/all?email=${encodeURIComponent(email)}`, undefined, []),
  markNotificationAsRead: async (id: string | number) => safeFetch(`${API_BASE.PARENT}/api/parent/notifications/${id}/read`, { method: 'PUT' }),
  triggerSos: async (payload?: Record<string, any>) => safeFetch(`${API_BASE.PARENT}/api/parent/sos`, { method: 'POST', body: JSON.stringify(payload || {}) }),
  getLeaves: async (email = 'priya.sharma@gmail.com') => safeFetch(`${API_BASE.PARENT}/api/parent/leave?email=${encodeURIComponent(email)}`, undefined, []),
  submitLeave: async (payload: { childName: string; slot: string; reason: string; date?: string }) => safeFetch(`${API_BASE.PARENT}/api/parent/leave`, { method: 'POST', body: JSON.stringify(payload) }),
  getGuardianPasses: async (email = 'priya.sharma@gmail.com') => safeFetch(`${API_BASE.PARENT}/api/parent/guardian-pass?email=${encodeURIComponent(email)}`, undefined, []),
  createGuardianPass: async (payload: { guardianName: string; relation: string; phone: string; childName?: string }) => safeFetch(`${API_BASE.PARENT}/api/parent/guardian-pass`, { method: 'POST', body: JSON.stringify(payload) }),
  getBreakdownAlert: async (cabId = 'd1') => safeFetch(`${API_BASE.PARENT}/api/parent/trip/breakdown-alert?cabId=${cabId}`, undefined, { active: false }),
};

export const driverApi = {
  getLocation: async (driverId = 'd1') => safeFetch(`${API_BASE.DRIVER}/api/driver/location?driverId=${driverId}`, undefined, {}),
  updateLocation: async (driverId: string, latitude: number, longitude: number) => safeFetch(`${API_BASE.DRIVER}/api/driver/location?driverId=${driverId}&latitude=${latitude}&longitude=${longitude}`, { method: 'POST' }),
  startTrip: async (driverId = 1, vehicleId = 1, routeId = 1) => safeFetch(`${API_BASE.DRIVER}/api/driver/trip/start?driverId=${driverId}&vehicleId=${vehicleId}&routeId=${routeId}`, { method: 'POST' }),
  stopTrip: async (tripId: number | string) => safeFetch(`${API_BASE.DRIVER}/api/driver/trip/stop?tripId=${tripId}`, { method: 'POST' }),
  submitSafetySweep: async (payload: { tripId?: number | string; tagCode?: string; photoUrl?: string }) => safeFetch(`${API_BASE.DRIVER}/api/driver/trip/safety-sweep`, { method: 'POST', body: JSON.stringify(payload) }),
  verifyGuardianPin: async (pin: string, studentId?: string) => safeFetch(`${API_BASE.DRIVER}/api/driver/trip/verify-guardian-pin`, { method: 'POST', body: JSON.stringify({ pin, studentId }) }),
  triggerBreakdownSwap: async (payload: { reason?: string; vehicleId?: string }) => safeFetch(`${API_BASE.DRIVER}/api/driver/trip/breakdown-swap`, { method: 'POST', body: JSON.stringify(payload) }),
  getTelematics: async (driverId = 1) => safeFetch(`${API_BASE.DRIVER}/api/driver/telematics?driverId=${driverId}`, undefined, { safetyScore: 98, harshBrakingEvents: 0, speedingEvents: 0, smoothAccelerationPct: 99, onTimeRatingPct: 97 }),
};

export const cabOwnerApi = {
  getFleet: async () => safeFetch<any>(`${API_BASE.CAB_OWNER}/api/fleet`, undefined, []),
  getEarnings: async () => safeFetch<any>(`${API_BASE.CAB_OWNER}/api/fleet/earnings`, undefined, []),
  getFleetLedger: async (ownerEmail = 'kumar@cabs.com') => safeFetch<any>(`${API_BASE.CAB_OWNER}/api/fleet/ledger?ownerEmail=${encodeURIComponent(ownerEmail)}`, undefined, {}),
  updateVehicleLifecycle: async (id: number | string, status: string) => safeFetch<any>(`${API_BASE.CAB_OWNER}/api/fleet/vehicles/${id}/status?status=${status}`, { method: 'PUT' }),
  getVehicleDriverPairing: async (id: number | string) => safeFetch<any>(`${API_BASE.CAB_OWNER}/api/fleet/vehicles/${id}/driver-pairing`, undefined, {}),
  registerCab: async (data: Record<string, any>) => safeFetch<any>(`${API_BASE.CAB_OWNER}/api/fleet/register`, { method: 'POST', body: JSON.stringify(data) }),
};

export const studentWorkApi = {
  getStudentRoutes: async () => safeFetch<any>(`${API_BASE.STUDENT_WORK}/api/commute/routes/student`, undefined, []),
  getProfessionalRoutes: async () => safeFetch<any>(`${API_BASE.STUDENT_WORK}/api/commute/routes/professional`, undefined, []),
  getAIMatches: async (pickup = 'Kattur', destination = 'ABC College') => safeFetch<any>(`${API_BASE.STUDENT_WORK}/api/commute/ai-match?pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}`, undefined, {}),
  lockSeat: async (userEmail: string, routeId: string, seatNumber = 'SEAT-04') => safeFetch<any>(`${API_BASE.STUDENT_WORK}/api/commute/seat-lock?userEmail=${encodeURIComponent(userEmail)}&routeId=${encodeURIComponent(routeId)}&seatNumber=${encodeURIComponent(seatNumber)}`, { method: 'POST' }),
  releaseSeatLock: async (lockToken: string) => safeFetch<any>(`${API_BASE.STUDENT_WORK}/api/commute/seat-unlock?lockToken=${encodeURIComponent(lockToken)}`, { method: 'POST' }),
  bookSeat: async (email: string, routeId: string, planType: string) => safeFetch<any>(`${API_BASE.STUDENT_WORK}/api/commute/book?email=${encodeURIComponent(email)}&routeId=${encodeURIComponent(routeId)}&planType=${encodeURIComponent(planType)}`, { method: 'POST' }),
  getPasses: async (email = 'arun.kumar@loyola.edu') => safeFetch<any>(`${API_BASE.STUDENT_WORK}/api/commute/pass?email=${encodeURIComponent(email)}`, undefined, []),
  getAttendanceLogs: async (email = '') => safeFetch<any>(`${API_BASE.STUDENT_WORK}/api/commute/attendance?email=${encodeURIComponent(email)}`, undefined, []),
};

export const singleTripApi = {
  requestTrip: async (payload: Record<string, any>) => safeFetch(`${API_BASE.PARENT}/api/parent/trip/single/request`, { method: 'POST', body: JSON.stringify(payload) }),
  acceptTrip: async (tripId: number | string, driverId = 1) => safeFetch(`${API_BASE.DRIVER}/api/driver/trip/single/accept?tripId=${tripId}&driverId=${driverId}`, { method: 'POST' }),
  verifyOtp: async (tripId: number | string, otp: string) => safeFetch(`${API_BASE.DRIVER}/api/driver/trip/single/verify-otp`, { method: 'POST', body: JSON.stringify({ tripId, otp }) }),
  completeTrip: async (tripId: number | string) => safeFetch(`${API_BASE.DRIVER}/api/driver/trip/single/complete?tripId=${tripId}`, { method: 'POST' }),
};

export const packagesApi = {
  subscribePackage: async (payload: Record<string, any>) => safeFetch(`${API_BASE.PARENT}/api/parent/packages/subscribe`, { method: 'POST', body: JSON.stringify(payload) }),
};

