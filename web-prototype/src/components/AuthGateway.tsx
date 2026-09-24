import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  Key, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Car, 
  Building2, 
  Users, 
  GraduationCap, 
  Briefcase, 
  ArrowRight, 
  RefreshCw, 
  X,
  Download,
  Clock,
  Check
} from 'lucide-react';
import type { AppRole, UserSession, AdminAuthRequest } from '../types/auth';
import { authApi } from '../services/api';

interface AuthGatewayProps {
  onLoginSuccess: (user: UserSession) => void;
  pendingRequests: AdminAuthRequest[];
  onAddRequest: (request: AdminAuthRequest) => void;
  onVerifyOtp: (emailOrPhone: string, otp: string, newPassword?: string) => { success: boolean; message: string; user?: UserSession };
  onOpenDownloadHub?: () => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  onLoginSuccess,
  pendingRequests,
  onAddRequest,
  onVerifyOtp,
  onOpenDownloadHub
}) => {
  const [selectedRole, setSelectedRole] = useState<AppRole>('admin');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showSubmissionSuccessModal, setShowSubmissionSuccessModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusEmailOrPhone, setStatusEmailOrPhone] = useState('');
  const [lastSubmittedRequest, setLastSubmittedRequest] = useState<AdminAuthRequest | null>(null);

  // Register Form State (Super Admin is NEVER registered)
  const [regRole, setRegRole] = useState<Exclude<AppRole, 'admin'>>('driver');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTimeframe, setRegTimeframe] = useState<'WITHIN_30_MIN' | 'TOMORROW'>('WITHIN_30_MIN');
  const [regLicense, setRegLicense] = useState('');
  const [regVehicleType, setRegVehicleType] = useState('Van (12 Seater)');
  const [regFleetName, setRegFleetName] = useState('');
  const [regFleetCount, setRegFleetCount] = useState('5');
  const [regSchool, setRegSchool] = useState('');
  const [regGrade, setRegGrade] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regDesignation, setRegDesignation] = useState('');

  // Forgot Password State
  const [forgotRole, setForgotRole] = useState<Exclude<AppRole, 'admin'>>('driver');
  const [forgotEmailOrPhone, setForgotEmailOrPhone] = useState('');
  const [forgotReason, setForgotReason] = useState('Forgot login credentials');

  // OTP Verification State
  const [otpEmailOrPhone, setOtpEmailOrPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpNewPassword, setOtpNewPassword] = useState('');

  // Predefined Mock Users for Quick Testing
  const roleMockLogins: Record<AppRole, { label: string; user: UserSession; defaultPass: string }> = {
    admin: {
      label: 'Super Admin (Master)',
      defaultPass: 'admin123',
      user: {
        id: 'u1',
        username: 'admin',
        name: 'Master Super Admin',
        email: 'admin@safepassage.ai',
        phone: '+91 90000 00001',
        role: 'admin'
      }
    },
    driver: {
      label: 'Cab Driver (Kumar Swamy)',
      defaultPass: 'driver123',
      user: {
        id: 'u2',
        username: 'kumar_driver',
        name: 'Kumar Swamy',
        email: 'kumar@cabs.com',
        phone: '+91 98401 23456',
        role: 'driver',
        roleDetails: {
          vehiclePlate: 'TN 01 AB 1234',
          vehicleType: 'VAN',
          licenseNumber: 'DL-TN-02-2018-9840'
        }
      }
    },
    cab_owner: {
      label: 'Cab Owner (Fleet Master)',
      defaultPass: 'owner123',
      user: {
        id: 'u3',
        username: 'ravi_owner',
        name: 'Ravi Fleet Networks',
        email: 'ravi.owner@chennaicabs.com',
        phone: '+91 98401 55667',
        role: 'cab_owner',
        roleDetails: {
          fleetName: 'Chennai School & IT Fleet Services',
          fleetCount: 8
        }
      }
    },
    parent: {
      label: 'Parent (Priya Sharma)',
      defaultPass: 'parent123',
      user: {
        id: 'u4',
        username: 'priya_parent',
        name: 'Priya Sharma',
        email: 'priya.sharma@gmail.com',
        phone: '+91 98401 11223',
        role: 'parent',
        roleDetails: {
          schoolName: 'ABC Matriculation School',
          studentGrade: 'Grade 5-A'
        }
      }
    },
    student: {
      label: 'Student (Mahesh Kumar)',
      defaultPass: 'student123',
      user: {
        id: 'u5',
        username: 'mahesh_student',
        name: 'Mahesh Kumar',
        email: 'mahesh.k@loyola.edu',
        phone: '+91 98401 99887',
        role: 'student',
        roleDetails: {
          institutionName: 'Loyola College / School Dept',
          rollNumber: 'LC-2026-CS-042'
        }
      }
    },
    professional: {
      label: 'Working Professional (Vikram Malhotra)',
      defaultPass: 'pro123',
      user: {
        id: 'u6',
        username: 'vikram_pro',
        name: 'Vikram Malhotra',
        email: 'vikram.m@tcs.com',
        phone: '+91 98401 44332',
        role: 'professional',
        roleDetails: {
          companyName: 'TCS IT Park Siruseri',
          designation: 'Senior Cloud Engineer / Professor'
        }
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (selectedRole === 'admin') {
      if (!password) {
        setErrorMessage('Super Admin password is required.');
        return;
      }
      try {
        await authApi.login('admin', password);
      } catch (err) {
        // Continue if local mock fallback or verification
      }
      if (password === 'admin123' || password === 'admin') {
        onLoginSuccess(roleMockLogins.admin.user);
      } else {
        setErrorMessage('Invalid Super Admin credentials. Try "admin123".');
      }
      return;
    }

    // Other roles validation
    if (!usernameOrEmail || !password) {
      setErrorMessage('Please enter both your identifier (email/phone/username) and password.');
      return;
    }

    try {
      const username = usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail;
      await authApi.login(username, password);
    } catch (err) {
      // Backend log
    }

    const mock = roleMockLogins[selectedRole];
    
    // 1. Check if user is a standard default role mock login
    if (password === mock.defaultPass && (usernameOrEmail === mock.user.email || usernameOrEmail === mock.user.username || usernameOrEmail === mock.user.phone || !usernameOrEmail.includes('@'))) {
      onLoginSuccess({
        ...mock.user,
        username: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail
      });
      return;
    }

    // 2. Check if user is in registered pendingRequests
    const customUser = pendingRequests.find(r => 
      r.role === selectedRole && 
      (r.email.toLowerCase() === usernameOrEmail.toLowerCase() || 
       r.phone === usernameOrEmail || 
       r.email.split('@')[0].toLowerCase() === usernameOrEmail.toLowerCase())
    );

    if (customUser) {
      if (customUser.status === 'PENDING_APPROVAL') {
        const slaText = customUser.acceptanceTimeframe === 'WITHIN_30_MIN' ? '⚡ within 30 Minutes' : '📅 by Tomorrow';
        setErrorMessage(`⏳ Registration for ${customUser.fullName} is currently awaiting Super Admin Acceptance (Requested: ${slaText}). Please ask Super Admin to click "Accept & Activate".`);
        return;
      }
      if (customUser.status === 'SCHEDULED_TOMORROW') {
        setErrorMessage(`📅 Registration for ${customUser.fullName} has been approved and scheduled for activation TOMORROW.`);
        return;
      }
      if (customUser.status === 'REJECTED') {
        setErrorMessage(`❌ Registration for ${customUser.fullName} was declined by Super Admin.`);
        return;
      }
      if (customUser.status === 'ACTIVATED') {
        if (password === customUser.registeredPassword || password === mock.defaultPass || password === 'pass123') {
          onLoginSuccess({
            id: customUser.id,
            username: customUser.email.split('@')[0],
            name: customUser.fullName,
            email: customUser.email,
            phone: customUser.phone,
            role: customUser.role,
            roleDetails: {
              licenseNumber: customUser.details?.licenseNo,
              vehicleType: customUser.details?.vehicleType,
              fleetName: customUser.details?.fleetName,
              fleetCount: customUser.details?.fleetCount,
              schoolName: customUser.details?.school,
              studentGrade: customUser.details?.grade,
              companyName: customUser.details?.company,
              designation: customUser.details?.designation
            }
          });
          return;
        } else {
          setErrorMessage(`Invalid password for your active account (${customUser.fullName}).`);
          return;
        }
      }
    }

    // 3. Fallback demo password check
    if (password === mock.defaultPass) {
      onLoginSuccess({
        ...mock.user,
        username: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail
      });
    } else {
      setErrorMessage(`Invalid credentials for ${selectedRole.toUpperCase()}. (Demo password: "${mock.defaultPass}")`);
    }
  };

  const handleQuickDemoFill = (role: AppRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    setInfoMessage(null);
    const mock = roleMockLogins[role];
    if (role === 'admin') {
      setUsernameOrEmail('admin');
      setPassword(mock.defaultPass);
    } else {
      setUsernameOrEmail(mock.user.email);
      setPassword(mock.defaultPass);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regPassword) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }

    try {
      await authApi.register({
        username: regEmail.split('@')[0],
        email: regEmail,
        password: regPassword,
        role: `ROLE_${regRole.toUpperCase()}`
      });
    } catch (err) {
      console.warn('Backend register sync warning:', err);
    }

    const newRequest: AdminAuthRequest = {
      id: `req_${Date.now()}`,
      type: 'REGISTRATION',
      role: regRole,
      fullName: regName,
      email: regEmail,
      phone: regPhone,
      status: 'PENDING_APPROVAL',
      acceptanceTimeframe: regTimeframe,
      registeredPassword: regPassword,
      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: {
        licenseNo: regRole === 'driver' ? regLicense : undefined,
        vehicleType: regRole === 'driver' ? regVehicleType : undefined,
        fleetName: regRole === 'cab_owner' ? regFleetName : undefined,
        fleetCount: regRole === 'cab_owner' ? parseInt(regFleetCount) : undefined,
        school: (regRole === 'parent' || regRole === 'student') ? regSchool : undefined,
        grade: regRole === 'parent' ? regGrade : undefined,
        company: regRole === 'professional' ? regCompany : undefined,
        designation: regRole === 'professional' ? regDesignation : undefined,
      }
    };

    onAddRequest(newRequest);
    setLastSubmittedRequest(newRequest);
    setShowRegisterModal(false);
    setShowSubmissionSuccessModal(true);
    setInfoMessage(`✅ Registration submitted for ${regName}! Forwarded to Super Admin queue with requested timeframe: ${regTimeframe === 'WITHIN_30_MIN' ? '⚡ Within 30 Minutes' : '📅 By Tomorrow'}.`);
    setUsernameOrEmail(regEmail);
    setPassword(regPassword);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmailOrPhone) {
      setErrorMessage('Please enter your email or phone number.');
      return;
    }

    const newRequest: AdminAuthRequest = {
      id: `req_${Date.now()}`,
      type: 'FORGOT_PASSWORD',
      role: forgotRole,
      fullName: `${forgotRole.toUpperCase()} User (${forgotEmailOrPhone})`,
      email: forgotEmailOrPhone.includes('@') ? forgotEmailOrPhone : `${forgotEmailOrPhone}@sms.com`,
      phone: forgotEmailOrPhone.includes('@') ? '+91 98401 00000' : forgotEmailOrPhone,
      status: 'PENDING_APPROVAL',
      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: {
        reason: forgotReason
      }
    };

    onAddRequest(newRequest);
    setShowForgotModal(false);
    setInfoMessage(`🔔 Password reset request dispatched to Super Admin! Super Admin will generate and send your 6-digit reset OTP.`);
    setOtpEmailOrPhone(forgotEmailOrPhone);
  };

  const handleOtpVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpEmailOrPhone || !otpCode) {
      setErrorMessage('Please provide your email/phone and the 6-digit OTP.');
      return;
    }

    const result = onVerifyOtp(otpEmailOrPhone, otpCode, otpNewPassword || 'password123');
    if (result.success && result.user) {
      setShowOtpModal(false);
      setInfoMessage(`🎉 OTP verified successfully! Logging you in as ${result.user.name}...`);
      setTimeout(() => onLoginSuccess(result.user!), 800);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] flex flex-col justify-center items-center p-4 md:p-6 text-gray-100 font-sans relative overflow-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand Header */}
      <div className="text-center mb-8 z-10 max-w-lg">
        <div className="inline-flex items-center space-x-3 mb-2 bg-slate-900/80 px-4 py-2 rounded-2xl border border-gray-800 shadow-xl">
          <div className="bg-gradient-to-tr from-sky-500 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-sky-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-sky-400 via-indigo-200 to-white bg-clip-text text-transparent">
            SafePassage AI
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Role-Based Unified Gateway
        </h2>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          School & College Cab Marketplace, AI Router & Enterprise Fleet Portal
        </p>
      </div>

      {/* Info / Success / Error Alerts */}
      {infoMessage && (
        <div className="w-full max-w-2xl mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-2xl text-xs flex items-center justify-between shadow-lg animate-fadeIn z-10">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{infoMessage}</span>
          </div>
          <button onClick={() => setInfoMessage(null)} className="p-1 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="w-full max-w-2xl mb-4 bg-red-500/10 border border-red-500/30 text-red-300 p-3.5 rounded-2xl text-xs flex items-center justify-between shadow-lg animate-fadeIn z-10">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="p-1 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Mobile App Download Hub Banner */}
      {onOpenDownloadHub && (
        <div className="w-full max-w-2xl mb-4 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-sky-500/15 border-2 border-emerald-500/40 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
              📱
            </div>
            <div>
              <span className="text-xs font-black text-white block">Download Native Mobile Apps</span>
              <span className="text-[10px] text-emerald-300">Driver & Fleet APK, Parent APK, and Student Pass APK</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenDownloadHub}
            className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 stroke-[3]" />
            <span>Open Download Hub ➔</span>
          </button>
        </div>
      )}

      {/* Main Authentication Card */}
      <div className="w-full max-w-2xl glass-card border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl z-10 backdrop-blur-xl">
        
        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-2">
            Select Your Role to Login:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            
            <button
              type="button"
              onClick={() => { setSelectedRole('admin'); setErrorMessage(null); }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 ${
                selectedRole === 'admin'
                  ? 'bg-gradient-to-b from-indigo-600 to-indigo-700 border-indigo-400 text-white shadow-lg shadow-indigo-600/25'
                  : 'bg-slate-900/80 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <Shield className="h-4 w-4 text-indigo-300" />
              <span className="text-[10px] font-bold leading-tight">Super Admin</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('driver'); setErrorMessage(null); }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 ${
                selectedRole === 'driver'
                  ? 'bg-gradient-to-b from-emerald-600 to-emerald-700 border-emerald-400 text-white shadow-lg shadow-emerald-600/25'
                  : 'bg-slate-900/80 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <Car className="h-4 w-4 text-emerald-300" />
              <span className="text-[10px] font-bold leading-tight">Cab Driver</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('cab_owner'); setErrorMessage(null); }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 ${
                selectedRole === 'cab_owner'
                  ? 'bg-gradient-to-b from-teal-600 to-teal-700 border-teal-400 text-white shadow-lg shadow-teal-600/25'
                  : 'bg-slate-900/80 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <Building2 className="h-4 w-4 text-teal-300" />
              <span className="text-[10px] font-bold leading-tight">Cab Owner</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('parent'); setErrorMessage(null); }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 ${
                selectedRole === 'parent'
                  ? 'bg-gradient-to-b from-sky-600 to-sky-700 border-sky-400 text-white shadow-lg shadow-sky-600/25'
                  : 'bg-slate-900/80 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <Users className="h-4 w-4 text-sky-300" />
              <span className="text-[10px] font-bold leading-tight">Parent</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('student'); setErrorMessage(null); }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 ${
                selectedRole === 'student'
                  ? 'bg-gradient-to-b from-amber-600 to-amber-700 border-amber-400 text-white shadow-lg shadow-amber-600/25'
                  : 'bg-slate-900/80 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <GraduationCap className="h-4 w-4 text-amber-300" />
              <span className="text-[10px] font-bold leading-tight">Student</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('professional'); setErrorMessage(null); }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 ${
                selectedRole === 'professional'
                  ? 'bg-gradient-to-b from-purple-600 to-purple-700 border-purple-400 text-white shadow-lg shadow-purple-600/25'
                  : 'bg-slate-900/80 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <Briefcase className="h-4 w-4 text-purple-300" />
              <span className="text-[10px] font-bold leading-tight">Professional</span>
            </button>

          </div>
        </div>

        {/* ================================================================= */}
        {/* SUPER ADMIN LOGIN: STRICTLY PASSWORD PROMPT (NO REGISTRATION) */}
        {/* ================================================================= */}
        {selectedRole === 'admin' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Security Notice */}
            <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-2xl flex items-start gap-3">
              <Shield className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-white block">
                  Master Security Policy: Super Admin Credentials
                </strong>
                <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                  Public self-registration for the <strong>Super Admin</strong> role is strictly disabled. Super administrators log in directly using their authorized master password.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                Master Super Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter master password (e.g. admin123)"
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <Lock className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-xl text-xs md:text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4" />
                <span>Log In as Super Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin')}
                className="bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 px-4 py-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Key className="h-3.5 w-3.5" />
                <span>Demo Fill Master</span>
              </button>
            </div>
          </form>
        ) : (
          /* ================================================================= */
          /* OTHER ROLES (DRIVER, OWNER, PARENT, STUDENT, PROFESSIONAL) LOGIN */
          /* ================================================================= */
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="flex items-center justify-between text-xs text-gray-400 pb-1">
              <span>Logging in as: <strong className="text-white capitalize">{selectedRole.replace('_', ' ')}</strong></span>
              <button
                type="button"
                onClick={() => handleQuickDemoFill(selectedRole)}
                className="text-[11px] text-sky-400 hover:underline font-semibold flex items-center gap-1"
              >
                <Key className="h-3 w-3" /> Quick Demo Fill
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                Email, Phone or Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder={`Enter registered identifier for ${selectedRole.replace('_', ' ')}`}
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <User className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotRole(selectedRole as any);
                    setForgotEmailOrPhone(usernameOrEmail);
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] text-sky-400 hover:underline font-semibold"
                >
                  Forgot Password? (Request Admin OTP)
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <Lock className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
            >
              <span>Log In to {selectedRole.replace('_', ' ').toUpperCase()} Console</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Registration & Status Actions Bar */}
            <div className="pt-4 border-t border-gray-800/80 flex flex-wrap justify-between items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setRegRole(selectedRole as any);
                  setShowRegisterModal(true);
                }}
                className="text-gray-300 hover:text-white font-bold flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 px-3 py-2 rounded-xl border border-gray-800 transition"
              >
                <span>✨ New User? Request Registration</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatusEmailOrPhone(usernameOrEmail);
                  setShowStatusModal(true);
                }}
                className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1.5 bg-sky-950/40 hover:bg-sky-900/50 px-3 py-2 rounded-xl border border-sky-500/30 transition"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Check Approval Status</span>
              </button>
            </div>

          </form>
        )}

      </div>

      {/* ===================================================================== */}
      {/* REGISTRATION REQUEST MODAL (DIRECT SUPER ADMIN ACCEPTANCE) */}
      {/* ===================================================================== */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-gray-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative my-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-4 border-b border-gray-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-sky-400" />
                  Request Role Registration
                </h3>
                <p className="text-[11px] text-gray-400">
                  Direct Super Admin Approval — No OTP required
                </p>
              </div>
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 mt-4">
              
              {/* Role Select */}
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Applying Role</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="driver">Cab Driver / Conductor</option>
                  <option value="cab_owner">Cab Owner / Fleet Agency</option>
                  <option value="parent">Parent</option>
                  <option value="student">Student (School / College)</option>
                  <option value="professional">Working Professional (IT / Teacher / Professor)</option>
                </select>
              </div>

              {/* Acceptance Timeframe Selector */}
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-indigo-500/30 space-y-2">
                <label className="text-[11px] font-extrabold text-indigo-300 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  Ask Super Admin to Accept Registration:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegTimeframe('WITHIN_30_MIN')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                      regTimeframe === 'WITHIN_30_MIN'
                        ? 'bg-amber-500/20 border-amber-400/80 text-white shadow-md'
                        : 'bg-slate-900 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">⚡</span>
                    <div>
                      <strong className="text-xs block text-amber-300">Accept Now (within 30 min)</strong>
                      <span className="text-[10px] text-gray-400">Urgent review & instant activation</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegTimeframe('TOMORROW')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                      regTimeframe === 'TOMORROW'
                        ? 'bg-sky-500/20 border-sky-400/80 text-white shadow-md'
                        : 'bg-slate-900 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">📅</span>
                    <div>
                      <strong className="text-xs block text-sky-300">Accept for Tomorrow</strong>
                      <span className="text-[10px] text-gray-400">Scheduled batch activation</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98401 00000"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Permanent Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create your password"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Dynamic Role-Specific Inputs */}
              {regRole === 'driver' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-gray-855">
                  <div>
                    <label className="text-[10px] font-bold text-emerald-400 block mb-1">Driving License No.</label>
                    <input
                      type="text"
                      value={regLicense}
                      onChange={(e) => setRegLicense(e.target.value)}
                      placeholder="DL-TN-02-2021-0012"
                      className="w-full bg-slate-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-emerald-400 block mb-1">Assigned Vehicle Type</label>
                    <select
                      value={regVehicleType}
                      onChange={(e) => setRegVehicleType(e.target.value)}
                      className="w-full bg-slate-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option>Force Traveller Van (12 Seater)</option>
                      <option>Suzuki Cab (6 Seater)</option>
                      <option>College Coach Bus (40 Seater)</option>
                    </select>
                  </div>
                </div>
              )}

              {regRole === 'cab_owner' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-gray-850">
                  <div>
                    <label className="text-[10px] font-bold text-teal-400 block mb-1">Fleet Business Name</label>
                    <input
                      type="text"
                      value={regFleetName}
                      onChange={(e) => setRegFleetName(e.target.value)}
                      placeholder="e.g. Cityline Vans Ltd"
                      className="w-full bg-slate-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-teal-400 block mb-1">Total Commercial Cabs</label>
                    <input
                      type="number"
                      value={regFleetCount}
                      onChange={(e) => setRegFleetCount(e.target.value)}
                      className="w-full bg-slate-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {(regRole === 'parent' || regRole === 'student') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-gray-850">
                  <div>
                    <label className="text-[10px] font-bold text-sky-400 block mb-1">School / College Name</label>
                    <input
                      type="text"
                      value={regSchool}
                      onChange={(e) => setRegSchool(e.target.value)}
                      placeholder="e.g. ABC Matriculation / Loyola"
                      className="w-full bg-slate-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-sky-400 block mb-1">
                      {regRole === 'parent' ? "Child's Class / Grade" : "Roll No / Semester"}
                    </label>
                    <input
                      type="text"
                      value={regGrade}
                      onChange={(e) => setRegGrade(e.target.value)}
                      placeholder={regRole === 'parent' ? "Grade 5-A" : "CS-2026"}
                      className="w-full bg-slate-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {regRole === 'professional' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-gray-850">
                  <div>
                    <label className="text-[10px] font-bold text-purple-400 block mb-1">Organization / IT Park</label>
                    <input
                      type="text"
                      value={regCompany}
                      onChange={(e) => setRegCompany(e.target.value)}
                      placeholder="e.g. TCS IT Park / College Faculty"
                      className="w-full bg-slate-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-purple-400 block mb-1">Designation</label>
                    <input
                      type="text"
                      value={regDesignation}
                      onChange={(e) => setRegDesignation(e.target.value)}
                      placeholder="e.g. Software Engineer / Professor"
                      className="w-full bg-slate-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 leading-relaxed flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Direct Super Admin Acceptance:</strong> No OTP verification needed. Once the Super Admin clicks "Accept", you can log in immediately with your password.
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-750 text-gray-300 py-2.5 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit to Super Admin</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUBMISSION CONFIRMATION MODAL */}
      {/* ===================================================================== */}
      {showSubmissionSuccessModal && lastSubmittedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="h-7 w-7 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Registration Submitted!</h3>
              <p className="text-xs text-gray-300 mt-1">
                Your request has been forwarded directly to the <strong>Super Admin Console</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-gray-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Applicant:</span>
                <strong className="text-white">{lastSubmittedRequest.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Role:</span>
                <strong className="text-sky-300 capitalize">{lastSubmittedRequest.role.replace('_', ' ')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Requested Acceptance:</span>
                <strong className={lastSubmittedRequest.acceptanceTimeframe === 'WITHIN_30_MIN' ? 'text-amber-300' : 'text-sky-300'}>
                  {lastSubmittedRequest.acceptanceTimeframe === 'WITHIN_30_MIN' ? '⚡ Within 30 Minutes' : '📅 By Tomorrow'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Verification Mode:</span>
                <span className="text-emerald-400 font-bold">Direct Super Admin Acceptance (No OTP)</span>
              </div>
            </div>

            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-300 leading-relaxed">
              💡 As soon as the Super Admin clicks <strong>"Accept & Activate"</strong>, your account is immediately live!
            </div>

            <button
              type="button"
              onClick={() => setShowSubmissionSuccessModal(false)}
              className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg transition"
            >
              Return to Sign In
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* CHECK REGISTRATION APPROVAL STATUS MODAL */}
      {/* ===================================================================== */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">
                  Check Approval Status
                </h3>
              </div>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-300 block mb-1">Enter your registered Email or Phone</label>
              <input
                type="text"
                value={statusEmailOrPhone}
                onChange={(e) => setStatusEmailOrPhone(e.target.value)}
                placeholder="e.g. yourname@domain.com or phone"
                className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* List of matching requests or recent requests */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Registration Requests in Queue:</span>
              {pendingRequests.length === 0 ? (
                <div className="p-3 text-center text-xs text-gray-500 bg-slate-950 rounded-xl">
                  No registration requests submitted yet.
                </div>
              ) : (
                pendingRequests
                  .filter(r => !statusEmailOrPhone || r.email.toLowerCase().includes(statusEmailOrPhone.toLowerCase()) || r.phone.includes(statusEmailOrPhone))
                  .slice(0, 4)
                  .map(req => (
                    <div key={req.id} className="p-3 bg-slate-950 rounded-xl border border-gray-800 flex justify-between items-center gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-xs text-white">{req.fullName}</strong>
                          <span className="text-[10px] text-gray-400 capitalize">({req.role.replace('_', ' ')})</span>
                        </div>
                        <span className="text-[10px] text-gray-400 block">
                          SLA: {req.acceptanceTimeframe === 'WITHIN_30_MIN' ? '⚡ Within 30 min' : '📅 Tomorrow'}
                        </span>
                      </div>

                      <div className="text-right">
                        {req.status === 'ACTIVATED' && (
                          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Active ✅
                          </span>
                        )}
                        {req.status === 'SCHEDULED_TOMORROW' && (
                          <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                            Accepted Tomorrow 📅
                          </span>
                        )}
                        {req.status === 'PENDING_APPROVAL' && (
                          <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 animate-pulse">
                            Awaiting Super Admin ⏳
                          </span>
                        )}
                        {req.status === 'REJECTED' && (
                          <span className="bg-red-500/20 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                            Declined ❌
                          </span>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowStatusModal(false)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 rounded-xl text-xs font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FORGOT PASSWORD MODAL (NOTIFIES SUPER ADMIN FOR RESET) */}
      {/* ===================================================================== */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-fadeIn">
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Request Password Reset
                </h3>
              </div>
              <button 
                onClick={() => setShowForgotModal(false)}
                className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-3.5 mt-4">
              <p className="text-xs text-gray-300 leading-relaxed">
                Enter your registered identifier. A high-priority password reset notification will be dispatched to the <strong>Super Admin Console</strong> for direct verification.
              </p>

              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Your Role</label>
                <select
                  value={forgotRole}
                  onChange={(e) => setForgotRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="driver">Cab Driver</option>
                  <option value="cab_owner">Cab Owner</option>
                  <option value="parent">Parent</option>
                  <option value="student">Student</option>
                  <option value="professional">Working Professional</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Registered Email or Phone</label>
                <input
                  type="text"
                  required
                  value={forgotEmailOrPhone}
                  onChange={(e) => setForgotEmailOrPhone(e.target.value)}
                  placeholder="e.g. priya@gmail.com or +91 98401..."
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Reason for Request</label>
                <input
                  type="text"
                  value={forgotReason}
                  onChange={(e) => setForgotReason(e.target.value)}
                  placeholder="e.g. Forgot account password"
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-750 text-gray-300 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Notify Super Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
