export type AppRole = 'admin' | 'driver' | 'cab_owner' | 'parent' | 'student' | 'professional';

export const AUTH_ROLES: AppRole[] = ['admin', 'driver', 'cab_owner', 'parent', 'student', 'professional'];

export interface UserSession {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: AppRole;
  avatar?: string;
  roleDetails?: {
    vehiclePlate?: string;
    vehicleType?: string;
    licenseNumber?: string;
    fleetName?: string;
    fleetCount?: number;
    schoolName?: string;
    studentGrade?: string;
    institutionName?: string;
    rollNumber?: string;
    companyName?: string;
    designation?: string;
  };
}

export interface AdminAuthRequest {
  id: string;
  type: 'REGISTRATION' | 'FORGOT_PASSWORD';
  role: AppRole;
  fullName: string;
  email: string;
  phone: string;
  status: 'PENDING_APPROVAL' | 'OTP_DISPATCHED' | 'ACTIVATED' | 'SCHEDULED_TOMORROW' | 'REJECTED';
  acceptanceTimeframe?: 'WITHIN_30_MIN' | 'TOMORROW';
  registeredPassword?: string;
  approvedFor?: 'IMMEDIATE' | 'TOMORROW';
  generatedOtp?: string;
  otpDispatchedAt?: string;
  requestedAt: string;
  details?: {
    licenseNo?: string;
    vehicleType?: string;
    fleetName?: string;
    fleetCount?: number;
    school?: string;
    grade?: string;
    company?: string;
    designation?: string;
    rollNo?: string;
    reason?: string;
    urgentReason?: string;
  };
}
