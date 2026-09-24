import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Shield,
  Phone,
  User,
  Users,
  Award,
  AlertCircle,
  Calendar,
  DollarSign,
  Map,
  Settings,
  Bell,
  ArrowLeft,
  Navigation,
  Check,
  CheckCircle,
  AlertTriangle,
  Heart,
  Info,
  Lock,
  PlusCircle,
  Percent,
  Star,
  GraduationCap,
  Filter,
  Sparkles,
  Smartphone,
  CheckSquare,
  Square,
  Sliders,
  Send,
  RefreshCw,
  TrendingUp,
  MapIcon,
  Activity,
  GitMerge,
  Radio,
  Layers,
  Cpu,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  Car,
  Building2,
  Briefcase,
  Key,
  LogOut,
  Receipt,
  Download
} from 'lucide-react';
import { AuthGateway } from './components/AuthGateway';
import { AppDownloadLandingPage } from './components/AppDownloadLandingPage';
import { AdminApprovalsDesk } from './components/AdminApprovalsDesk';
import { CabOwnerDashboard } from './components/CabOwnerDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { CityMap } from './components/CityMap';
import { AdminKpiAnalytics } from './components/AdminKpiAnalytics';
import { AdminInvoicesDesk } from './components/AdminInvoicesDesk';
import { ParentSimulator } from './components/ParentSimulator';
import { ThreeModulesShowcase } from './components/ThreeModulesShowcase';
import { AIRouteMatching } from './components/AIRouteMatching';
import { DemandAnalytics } from './components/DemandAnalytics';
import { NotificationCenter } from './components/NotificationCenter';
import { SingleTripWorkflowModal } from './components/SingleTripWorkflowModal';
import { ThreeVersionMapViewer } from './components/ThreeVersionMapViewer';
import { PackageTripsModal } from './components/PackageTripsModal';
import { SosEmergencyModal } from './components/SosEmergencyModal';
import type { AppRole, UserSession, AdminAuthRequest } from './types/auth';
import { adminApi, parentApi, driverApi, cabOwnerApi, studentWorkApi } from './services/api';

// Types & Mock Data Definitions
interface Driver {
  id: string;
  name: string;
  vehicle: string;
  plate: string;
  rating: number;
  seatsTotal: number;
  seatsAvailable: number;
  priceMonthly: number;
  trustScore: number;
  verified: boolean;
  onTimeRate: number;
}

const mockDrivers: Driver[] = [
  {
    id: 'd1',
    name: 'Kumar Swamy',
    vehicle: 'Mercedes Van (White)',
    plate: '34 ABC 123',
    rating: 4.8,
    seatsTotal: 12,
    seatsAvailable: 3,
    priceMonthly: 2500,
    trustScore: 96,
    verified: true,
    onTimeRate: 98,
  },
  {
    id: 'd2',
    name: 'Ravi Chandran',
    vehicle: 'Suzuki Cab (Silver)',
    plate: '06 MH 456',
    rating: 4.7,
    seatsTotal: 6,
    seatsAvailable: 2,
    priceMonthly: 2800,
    trustScore: 94,
    verified: true,
    onTimeRate: 95,
  },
  {
    id: 'd3',
    name: 'Suresh Kumar',
    vehicle: 'Force Traveller (Yellow)',
    plate: '14 TN 789',
    rating: 4.6,
    seatsTotal: 15,
    seatsAvailable: 5,
    priceMonthly: 2300,
    trustScore: 92,
    verified: true,
    onTimeRate: 94,
  }
];

const mockStudents = [
  { id: 's1', name: 'Mahesh Kumar', grade: 'Class V-C', status: 'pending', phone: '+91 98401 23456' },
  { id: 's2', name: 'Ananya Tiwari', grade: 'Class IV', status: 'boarded', phone: '+91 98401 23457' },
  { id: 's3', name: 'Swapnil Vashistha', grade: 'Class VII-A', status: 'absent', phone: '+91 98401 23458' },
  { id: 's4', name: 'Ayan Mukharjee', grade: 'Class III', status: 'pending', phone: '+91 98401 23459' },
  { id: 's5', name: 'Reyan Singhaniya', grade: 'Class II', status: 'pending', phone: '+91 98401 23460' },
  { id: 's6', name: 'Sampan Roy', grade: 'Class IX-B', status: 'boarded', phone: '+91 98401 23461' },
];

export default function App() {
  // Authentication & Session State - Strict Authentication Enabled
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [activeRole, setActiveRole] = useState<AppRole>('parent');
  const [specialView, setSpecialView] = useState<'none' | 'showcase' | 'ai_matching' | 'demand_analytics' | 'notifications' | 'three_maps'>('showcase');
  const [showSingleTripModal, setShowSingleTripModal] = useState<boolean>(false);
  const [showPackageModal, setShowPackageModal] = useState<boolean>(false);
  const [showSosModal, setShowSosModal] = useState<boolean>(false);
  const [showDownloadHubLanding, setShowDownloadHubLanding] = useState<boolean>(false);

  // Super Admin Authorization & OTP Requests Queue
  const [pendingAuthRequests, setPendingAuthRequests] = useState<AdminAuthRequest[]>([
    {
      id: 'req_1',
      type: 'REGISTRATION',
      role: 'driver',
      fullName: 'Rajesh Pandian',
      email: 'rajesh.driver@cabs.com',
      phone: '+91 98401 66778',
      status: 'PENDING_APPROVAL',
      requestedAt: '07:15 AM',
      details: {
        licenseNo: 'DL-TN-02-2022-9011',
        vehicleType: 'Force Traveller Van (12 Seater)'
      }
    },
    {
      id: 'req_2',
      type: 'FORGOT_PASSWORD',
      role: 'parent',
      fullName: 'Sangeetha Raman (Parent)',
      email: 'sangeetha.parent@gmail.com',
      phone: '+91 98401 33445',
      status: 'PENDING_APPROVAL',
      requestedAt: '07:30 AM',
      details: {
        school: 'ABC Matriculation School',
        reason: 'Forgotten mobile account credentials'
      }
    },
    {
      id: 'req_3',
      type: 'REGISTRATION',
      role: 'cab_owner',
      fullName: 'Kavitha Fleet Lines',
      email: 'kavitha@kavithafleet.com',
      phone: '+91 98401 88990',
      status: 'PENDING_APPROVAL',
      requestedAt: '07:42 AM',
      details: {
        fleetName: 'Kavitha Express City Cabs',
        fleetCount: 12
      }
    }
  ]);

  const [otpAuditLogs, setOtpAuditLogs] = useState<string[]>([
    '[07:00 AM] 🛡️ Super Admin Central Gatekeeper initialized. Self-registration disabled.',
    '[07:15 AM] 📥 Incoming Driver Registration: Rajesh Pandian (DL-TN-02-2022-9011) awaiting OTP.',
    '[07:30 AM] 🔑 Incoming Password Reset: Sangeetha Raman (Parent) awaiting reset OTP.',
    '[07:42 AM] 🏢 Incoming Fleet Owner Registration: Kavitha Fleet Lines awaiting OTP.'
  ]);

  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const [apiConnected, setApiConnected] = useState(false);
  const [parentWallet, setParentWallet] = useState<number>(1850);
  const [parentChildren, setParentChildren] = useState<any[]>([
    { id: 1, childName: 'Ananya Sharma', age: 10, institution: 'ABC Matriculation School', cabId: 'd1', verificationStatus: 'VERIFIED' }
  ]);
  const [adminStats, setAdminStats] = useState<any>({
    totalUsers: 48,
    activeParents: 22,
    studentsCount: 16,
    driversCount: 8,
    cabOwnersCount: 4,
    schoolsCount: 3,
    collegesCount: 1,
    companiesCount: 1,
    activeVehicles: 5,
    activeRoutes: 4,
    activeSubscriptions: 12,
    revenue: 46100,
    commission: 4610,
    complaintsCount: 2,
    safetyIncidentsCount: 0,
    todaysTripsCount: 8
  });
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminVehicles, setAdminVehicles] = useState<any[]>([]);
  const [adminComplaints, setAdminComplaints] = useState<any[]>([]);
  const [driverGPS, setDriverGPS] = useState<{latitude: number, longitude: number}>({latitude: 12.9815, longitude: 80.2450});

  // Parent State variables
  const [parentSearch, setParentSearch] = useState({
    school: 'ABC Matriculation School',
    pickup: 'Mehta Nagar, Chennai',
    vehicleType: 'van',
    subscription: 'monthly'
  });
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(mockDrivers[0]);
  const [girlsSafeMode, setGirlsSafeMode] = useState(false);
  const [parentStep, setParentStep] = useState<'home' | 'search' | 'detail' | 'track' | 'passport'>('home');
  const [alertDistance, setAlertDistance] = useState<number>(0.5); // miles radius tracking alert (Template 2)
  const [sosStatus, setSosStatus] = useState<boolean>(false);
  
  // Driver State variables
  const [studentsList, setStudentsList] = useState(mockStudents);
  const [driverTripStarted, setDriverTripStarted] = useState(false);
  const [driverAvailableSeats, setDriverAvailableSeats] = useState(3);
  const [driverTripStep, setDriverTripStep] = useState<number>(1); // 1: Conductor checklist, 2: Map route tracking, 3: Completed

  // Advanced Features State (Driver & Fleet)
  const [showAntiAbandonModal, setShowAntiAbandonModal] = useState(false);
  const [sweepChecks, setSweepChecks] = useState({ row1: false, row2: false, row3: false, rearTag: false, photo: false });
  const [showGuardianPinModal, setShowGuardianPinModal] = useState<{ id: string; name: string } | null>(null);
  const [enteredGuardianPin, setEnteredGuardianPin] = useState('');
  const [guardianPinSuccess, setGuardianPinSuccess] = useState(false);
  const [breakdownDispatched, setBreakdownDispatched] = useState(false);
  const [breakdownInfo, setBreakdownInfo] = useState({
    originalVehicle: 'Bus No.1 (RJ14 CH 4656)',
    replacementVehicle: 'Force Traveller (TN-09-BK-8822)',
    backupDriver: 'Ravi Chandran (+91 98402 33445)',
    status: 'STANDBY'
  });
  const [telematicsScore] = useState({ score: 98, harshBraking: 0, smoothSpeed: 99, onTime: 97 });

  // Super Admin state variables
  const [adminOffers, setAdminOffers] = useState([
    { id: 'o1', code: 'NEW500', title: 'First Month Promotion', discount: '₹500 OFF', active: true },
    { id: 'o2', code: 'SIBLING20', title: 'Sibling Multi-Child Offer', discount: '20% OFF 2nd Child', active: true },
    { id: 'o3', code: 'BACKTOSCHOOL', title: 'Quarterly Package Off', discount: '10% OFF packages', active: false },
  ]);
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferDiscount, setNewOfferDiscount] = useState('');
  const [adminDemandScore, setAdminDemandScore] = useState(92);
  const [workflowErrorService, setWorkflowErrorService] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState<'workflow' | 'overview' | 'kpis' | 'invoices' | 'heatmap' | 'verification' | 'offers' | 'approvals' | 'all'>('approvals');

  // Authentication Handlers
  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    setNotificationToast(`Welcome, ${user.name}! Workspace switched to ${user.role.replace('_', ' ').toUpperCase()}.`);
    setTimeout(() => setNotificationToast(null), 5000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddAuthRequest = (newReq: AdminAuthRequest) => {
    setPendingAuthRequests(prev => [newReq, ...prev]);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOtpAuditLogs(prev => [
      `[${timeStr}] 🚨 ALERT: New ${newReq.type} request from ${newReq.fullName} (${newReq.role.toUpperCase()}). Sent to Super Admin queue.`,
      ...prev
    ]);
    setNotificationToast(`🔔 Notification to Super Admin: New ${newReq.type} request from ${newReq.fullName}`);
    setTimeout(() => setNotificationToast(null), 5000);
  };

  const handleGenerateOtp = async (requestId: string) => {
    const generatedCode = (Math.floor(100000 + Math.random() * 900000)).toString();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      await adminApi.generateOtpForUser(requestId);
    } catch {
      console.log('Backend simulated OTP generation.');
    }

    setPendingAuthRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'OTP_DISPATCHED',
          generatedOtp: generatedCode,
          otpDispatchedAt: timeStr
        };
      }
      return req;
    }));

    const targetReq = pendingAuthRequests.find(r => r.id === requestId);
    const targetName = targetReq ? targetReq.fullName : 'User';
    const targetPhone = targetReq ? targetReq.phone : 'SMS Gateway';
    const targetRole = targetReq ? targetReq.role.toUpperCase() : 'USER';

    setOtpAuditLogs(prev => [
      `[${timeStr}] 🔑 OTP [${generatedCode}] generated for ${targetName} (${targetRole}). Dispatched to ${targetPhone}. Valid for 15 mins.`,
      ...prev
    ]);

    setNotificationToast(`🔑 OTP [${generatedCode}] generated & sent to ${targetName} (${targetPhone})`);
    setTimeout(() => setNotificationToast(null), 6000);
  };

  const handleApproveRequest = async (requestId: string, schedule: 'IMMEDIATE' | 'TOMORROW' = 'IMMEDIATE') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      await adminApi.updateUserStatus(requestId, schedule === 'IMMEDIATE' ? 'ACTIVE' : 'SCHEDULED');
    } catch {
      console.log('Backend status update fallback.');
    }

    setPendingAuthRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { 
          ...req, 
          status: schedule === 'IMMEDIATE' ? 'ACTIVATED' : 'SCHEDULED_TOMORROW',
          approvedFor: schedule
        };
      }
      return req;
    }));

    const targetReq = pendingAuthRequests.find(r => r.id === requestId);
    const targetName = targetReq ? targetReq.fullName : 'User';

    if (schedule === 'IMMEDIATE') {
      setOtpAuditLogs(prev => [
        `[${timeStr}] ⚡ ACCEPTED NOW: ${targetName} (${targetReq?.role.toUpperCase()}) was accepted & activated immediately by Super Admin.`,
        ...prev
      ]);
      setNotificationToast(`⚡ ${targetName} registration accepted! Account is ACTIVE now.`);
    } else {
      setOtpAuditLogs(prev => [
        `[${timeStr}] 📅 SCHEDULED: ${targetName} (${targetReq?.role.toUpperCase()}) registration accepted for tomorrow activation.`,
        ...prev
      ]);
      setNotificationToast(`📅 ${targetName} scheduled for activation tomorrow!`);
    }

    setTimeout(() => setNotificationToast(null), 5000);
  };

  const handleRejectRequest = async (requestId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      await adminApi.updateUserStatus(requestId, 'REJECTED');
    } catch {
      console.log('Backend status update fallback.');
    }

    setPendingAuthRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'REJECTED' };
      }
      return req;
    }));

    const targetReq = pendingAuthRequests.find(r => r.id === requestId);
    const targetName = targetReq ? targetReq.fullName : 'User';

    setOtpAuditLogs(prev => [
      `[${timeStr}] ❌ REJECTED: ${targetName} request was declined by Super Admin.`,
      ...prev
    ]);

    setNotificationToast(`❌ ${targetName} request rejected.`);
    setTimeout(() => setNotificationToast(null), 5000);
  };

  const handleVerifyOtp = (emailOrPhone: string, otp: string, newPassword?: string) => {
    const match = pendingAuthRequests.find(r => 
      (r.email.toLowerCase() === emailOrPhone.toLowerCase() || r.phone.includes(emailOrPhone) || emailOrPhone.includes(r.phone)) &&
      r.generatedOtp === otp
    );

    if (match) {
      handleApproveRequest(match.id);
      const userSession: UserSession = {
        id: `user_${Date.now()}`,
        username: match.email.split('@')[0],
        name: match.fullName,
        email: match.email,
        phone: match.phone,
        role: match.role,
        roleDetails: {
          licenseNumber: match.details?.licenseNo,
          vehicleType: match.details?.vehicleType,
          fleetName: match.details?.fleetName,
          fleetCount: match.details?.fleetCount,
          schoolName: match.details?.school,
          studentGrade: match.details?.grade,
          companyName: match.details?.company,
          designation: match.details?.designation
        }
      };
      return { success: true, message: 'OTP verified successfully!', user: userSession };
    }

    return { 
      success: false, 
      message: 'Invalid or expired OTP code. Please check with Super Admin in the Approvals Desk.' 
    };
  };
  const [workflowSimulatedLogs, setWorkflowSimulatedLogs] = useState<string[]>([
    '[INIT] All 5 microservice nodes connected & verified healthy.',
    '[PORTAL] Parent Portal (Port 8085) - WebSocket active for live ride subscriptions.',
    '[CORE] Super Admin Central Orchestrator (Port 8082) - AI Matcher operational at 94.8% efficiency.',
    '[FLEET] Cab Owner Portal (Port 8083) - 12-seater Force Traveler (TN-12-AE-3940) assigned to Route #4.',
    '[BEACON] Driver / Conductor App (Port 8084) - GPS streaming (12.9815°N, 80.2450°E) - Ping: 24ms.',
    '[STREAM] Real-time Geofence monitoring enabled with 0.5-mile parent arrival radar.'
  ]);

  const handleWorkflowSimulation = (service: string | null) => {
    setWorkflowErrorService(service);
    const timeStr = new Date().toLocaleTimeString();
    if (service) {
      setWorkflowSimulatedLogs(prev => [
        `[${timeStr}] 🚨 ALERT: Node [${service.toUpperCase()}] simulated fault / degradation. Health: DEGRADED.`,
        ...prev.slice(0, 7)
      ]);
    } else {
      setWorkflowSimulatedLogs(prev => [
        `[${timeStr}] ✅ RECOVERY: All 5 nodes restored to 200 OK. System pipeline operational.`,
        ...prev.slice(0, 7)
      ]);
    }
  };

  // Parent API Integration Polling
  useEffect(() => {
    if (!apiConnected) return;
    const fetchParentData = async () => {
      try {
        const resWallet = await fetch('http://localhost:8085/api/parent/wallet?email=priya.sharma@gmail.com');
        const dataWallet = await resWallet.json();
        if (dataWallet && dataWallet.balance !== undefined) {
          setParentWallet(dataWallet.balance);
        }
        const resChildren = await fetch('http://localhost:8085/api/parent/children?email=priya.sharma@gmail.com');
        const dataChildren = await resChildren.json();
        if (Array.isArray(dataChildren)) {
          setParentChildren(dataChildren);
        }
      } catch (e) {
        console.warn("Spring Boot backend-parent service not running at localhost:8085 (using simulated fallback)");
      }
    };
    fetchParentData();
    const interval = setInterval(fetchParentData, 5000);
    return () => clearInterval(interval);
  }, [apiConnected]);

  // Admin API Integration Polling
  useEffect(() => {
    if (!apiConnected || activeRole !== 'admin') return;
    const fetchAdminData = async () => {
      try {
        const resStats = await fetch('http://localhost:8082/api/dashboard/stats');
        const dataStats = await resStats.json();
        if (dataStats) setAdminStats(dataStats);

        const resUsers = await fetch('http://localhost:8082/api/admin/users');
        const dataUsers = await resUsers.json();
        if (Array.isArray(dataUsers)) setAdminUsers(dataUsers);

        const resVehicles = await fetch('http://localhost:8082/api/admin/vehicles');
        const dataVehicles = await resVehicles.json();
        if (Array.isArray(dataVehicles)) setAdminVehicles(dataVehicles);

        const resComplaints = await fetch('http://localhost:8082/api/admin/complaints');
        const dataComplaints = await resComplaints.json();
        if (Array.isArray(dataComplaints)) setAdminComplaints(dataComplaints);
      } catch (e) {
        console.warn("Spring Boot backend-super-admin not running at localhost:8082 (using simulated fallback)");
      }
    };
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 5000);
    return () => clearInterval(interval);
  }, [apiConnected, activeRole]);

  // Driver GPS Updates Polling
  useEffect(() => {
    if (!apiConnected || parentStep !== 'track') return;
    const fetchGPSLocation = async () => {
      try {
        const res = await fetch(`http://localhost:8084/api/driver/location?driverId=${selectedDriver ? selectedDriver.id : 'd1'}`);
        const data = await res.json();
        if (data && data.latitude !== undefined) {
          setDriverGPS({ latitude: data.latitude, longitude: data.longitude });
        }
      } catch (e) {
        console.warn("Spring Boot backend-driver location coordinates not running at localhost:8084 (using simulator path)");
      }
    };
    fetchGPSLocation();
    const interval = setInterval(fetchGPSLocation, 2000);
    return () => clearInterval(interval);
  }, [apiConnected, parentStep, selectedDriver]);

  const toggleStudentStatus = (id: string) => {
    setStudentsList(prev => prev.map(s => {
      if (s.id === id) {
        let nextStatus = 'pending';
        if (s.status === 'pending') nextStatus = 'boarded';
        else if (s.status === 'boarded') nextStatus = 'leave';
        else if (s.status === 'leave') nextStatus = 'absent';
        else if (s.status === 'absent') nextStatus = 'pending';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const createOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferTitle || !newOfferDiscount) return;
    const newOffer = {
      id: Date.now().toString(),
      code: newOfferTitle.toUpperCase().replace(/\s+/g, '_').substring(0, 12),
      title: newOfferTitle,
      discount: newOfferDiscount,
      active: true
    };
    setAdminOffers([newOffer, ...adminOffers]);
    setNewOfferTitle('');
    setNewOfferDiscount('');
  };

  // Automated notification timeline simulation for Parent App (Template 1 / 4)
  const journeyTimeline = [
    { time: '07:30 AM', status: 'Vehicle started', desc: 'Driver Kumar started trip from depot', done: true },
    { time: '07:42 AM', status: 'Reached pickup point', desc: 'Cab reached Mehta Nagar Anna Arch Gate', done: true },
    { time: '07:45 AM', status: 'Child boarded safely', desc: 'Ananya Sharma boarded. Attendance verified.', done: true, highlight: true },
    { time: '07:55 AM', status: 'On the way', desc: 'Current speed: 38 km/h. Route match: 98%', done: true },
    { time: '08:02 AM', status: 'School reached', desc: 'Dropped successfully at ABC Matriculation School', done: false }
  ];

  // Render Download Apps Hub if requested
  if (showDownloadHubLanding) {
    return (
      <AppDownloadLandingPage
        onLaunchRole={(role) => {
          setShowDownloadHubLanding(false);
          if (role === 'parent') {
            handleLoginSuccess({ id: 'u4', username: 'priya_parent', name: 'Priya Sharma (Parent)', email: 'priya.sharma@gmail.com', phone: '+91 98401 22334', role: 'parent' });
          } else if (role === 'driver') {
            handleLoginSuccess({ id: 'u2', username: 'kumar_driver', name: 'Kumar Swamy (Driver)', email: 'kumar@cabs.com', phone: '+91 98401 23456', role: 'driver' });
          } else if (role === 'student') {
            handleLoginSuccess({ id: 'u5', username: 'ananya_student', name: 'Ananya Sharma (Student)', email: 'ananya@student.safepassage.ai', phone: '+91 98401 33445', role: 'student' });
          } else if (role === 'cab_owner') {
            handleLoginSuccess({ id: 'u3', username: 'ravi_owner', name: 'Ravi Fleet Networks', email: 'ravi.owner@chennaicabs.com', phone: '+91 98401 55667', role: 'cab_owner' });
          }
        }}
        onBackToPortal={() => setShowDownloadHubLanding(false)}
      />
    );
  }

  // Render Unified Auth Gateway when not logged in
  if (!currentUser) {
    return (
      <AuthGateway
        onLoginSuccess={handleLoginSuccess}
        pendingRequests={pendingAuthRequests}
        onAddRequest={handleAddAuthRequest}
        onVerifyOtp={handleVerifyOtp}
        onOpenDownloadHub={() => setShowDownloadHubLanding(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070b13] text-gray-100 flex flex-col font-sans relative">
      
      {/* Dynamic Toast Notification (e.g. OTP Generation, Live Alerts) */}
      {notificationToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/95 border border-amber-400/40 text-amber-200 px-4 py-3 rounded-2xl text-xs shadow-2xl flex items-center gap-2.5 animate-fadeIn backdrop-blur-xl">
          <Key className="h-4 w-4 text-amber-400 animate-pulse flex-shrink-0" />
          <span className="font-semibold">{notificationToast}</span>
        </div>
      )}

      {/* Top Banner Navigation */}
      <header className="glass-panel sticky top-0 z-40 border-b border-gray-800 py-3 px-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-sky-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-sky-500/20">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-200 to-white bg-clip-text text-transparent m-0">
              SafePassage AI
            </h1>
            <p className="text-xs text-gray-400">School & College Cab Marketplace & AI Router</p>
          </div>
        </div>

        {/* User Session & Role Navigation Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center space-x-2 bg-gray-900/80 px-2.5 py-1 rounded-xl border border-gray-800 text-xs">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Live API:</span>
            <button 
              onClick={() => setApiConnected(!apiConnected)}
              className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase transition-all duration-300 ${
                apiConnected 
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {apiConnected ? "CONNECTED" : "SIMULATED"}
            </button>
          </div>

          {/* User Profile Chip */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-gray-800 px-3 py-1.5 rounded-2xl">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-[10px] text-white">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left leading-none">
              <span className="text-xs font-bold text-white block">{currentUser.name}</span>
              <span className="text-[9px] text-sky-400 uppercase font-bold tracking-wider">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* 3 New Modules Featured Button & Persona Quick Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-gray-900/80 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setSpecialView('showcase')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition flex items-center gap-1.5 ${
                specialView === 'showcase'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
                  : 'bg-indigo-950/60 text-indigo-300 hover:text-white border border-indigo-800/40'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-pink-300 animate-pulse" />
              <span>✨ 3 Modules Showcase</span>
            </button>

            <button
              onClick={() => setSpecialView('ai_matching')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                specialView === 'ai_matching'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-3 w-3 text-sky-400" />
              <span>AI Route Match</span>
            </button>

            <button
              onClick={() => setSpecialView('demand_analytics')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                specialView === 'demand_analytics'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <span>Demand Analytics</span>
            </button>

            <button
              onClick={() => setSpecialView('notifications')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                specialView === 'notifications'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bell className="h-3 w-3 text-rose-400" />
              <span>Notifications (9)</span>
            </button>

            <button
              onClick={() => setSpecialView('three_maps')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                specialView === 'three_maps'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'text-cyan-300 hover:text-white bg-cyan-950/40 border border-cyan-800/40'
              }`}
            >
              <Map className="h-3 w-3 text-cyan-300" />
              <span>🗺️ 3-Version Maps</span>
            </button>

            <div className="w-[1px] h-5 bg-gray-800 mx-0.5 hidden sm:block"></div>

            {/* Quick Action Trigger Buttons */}
            <button
              onClick={() => setShowSingleTripModal(true)}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-black bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 shadow-md shadow-cyan-600/20 flex items-center gap-1 transition"
            >
              <Car className="h-3 w-3" />
              <span>🚖 Single Trip (45s OTP)</span>
            </button>

            <button
              onClick={() => setShowPackageModal(true)}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-purple-600/80 hover:bg-purple-600 text-white flex items-center gap-1 transition"
            >
              <Calendar className="h-3 w-3" />
              <span>📦 Packages</span>
            </button>

            <button
              onClick={() => setShowSosModal(true)}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-black bg-red-600/90 hover:bg-red-600 text-white flex items-center gap-1 animate-pulse shadow-md shadow-red-600/30 transition"
            >
              <AlertTriangle className="h-3 w-3 text-amber-300" />
              <span>🚨 SOS</span>
            </button>

            <div className="w-[1px] h-5 bg-gray-800 mx-0.5 hidden sm:block"></div>

            <button
              onClick={() => { setActiveRole('admin'); setSpecialView('none'); }}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                specialView === 'none' && activeRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shield className="h-3 w-3" />
              <span>Super Admin</span>
            </button>

            <button
              onClick={() => { setActiveRole('driver'); setSpecialView('none'); }}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                specialView === 'none' && activeRole === 'driver'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Car className="h-3 w-3" />
              <span>Driver</span>
            </button>

            <button
              onClick={() => { setActiveRole('cab_owner'); setSpecialView('none'); }}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                specialView === 'none' && activeRole === 'cab_owner'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Building2 className="h-3 w-3" />
              <span>Owner</span>
            </button>

            <button
              onClick={() => { setActiveRole('parent'); setSpecialView('none'); }}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                specialView === 'none' && activeRole === 'parent'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="h-3 w-3" />
              <span>Parent</span>
            </button>

            <button
              onClick={() => { setActiveRole('student'); setSpecialView('none'); }}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                specialView === 'none' && activeRole === 'student'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <GraduationCap className="h-3 w-3" />
              <span>Student</span>
            </button>

            <button
              onClick={() => { setActiveRole('professional'); setSpecialView('none'); }}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                specialView === 'none' && activeRole === 'professional'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Briefcase className="h-3 w-3" />
              <span>Pro</span>
            </button>
          </div>

          {/* Download Native Apps Hub Button */}
          <button
            onClick={() => setShowDownloadHubLanding(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 border border-emerald-400/40 flex items-center gap-1.5 transition transform hover:-translate-y-0.5"
            title="Download Standalone Native Mobile Apps for Driver, Parent, Student"
          >
            <Download className="h-3.5 w-3.5 animate-bounce" />
            <span className="hidden sm:inline">📱 Download Apps</span>
          </button>

          {/* Logout Button (Takes User to Login Gateway) */}
          <button
            onClick={handleLogout}
            title="Log out and return to Login Gateway"
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 text-xs font-bold transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>

        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-4 md:p-8 flex justify-center items-start">
        
        {/* ========================================================================= */}
        {/* 3 NEW MODULES SHOWCASE (HERO 3-PHONE VIEW) */}
        {/* ========================================================================= */}
        {specialView === 'showcase' && (
          <ThreeModulesShowcase />
        )}

        {/* ========================================================================= */}
        {/* INDIVIDUAL DEDICATED MODULE VIEWS */}
        {/* ========================================================================= */}
        {specialView === 'ai_matching' && (
          <div className="w-full flex justify-center py-4">
            <AIRouteMatching isStandalonePhone={true} onBack={() => setSpecialView('showcase')} />
          </div>
        )}

        {specialView === 'demand_analytics' && (
          <div className="w-full flex justify-center py-4">
            <DemandAnalytics isStandalonePhone={true} onBack={() => setSpecialView('showcase')} />
          </div>
        )}

        {specialView === 'notifications' && (
          <div className="w-full flex justify-center py-4">
            <NotificationCenter isStandalonePhone={true} onBack={() => setSpecialView('showcase')} />
          </div>
        )}

        {specialView === 'three_maps' && (
          <div className="w-full max-w-7xl py-2">
            <ThreeVersionMapViewer
              onTriggerSos={() => setShowSosModal(true)}
              onRequestSingleTrip={() => setShowSingleTripModal(true)}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* PARENT PERSONA (MOBILE EMULATOR) */}
        {/* ========================================================================= */}
        {specialView === 'none' && activeRole === 'parent' && (
          <div className="w-full max-w-5xl">
            <ParentSimulator currentUser={currentUser || { id: 'p1', username: 'priya', name: 'Priya Sharma', email: 'priya.sharma@gmail.com', phone: '+91 98401 23456', role: 'parent' }} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* DRIVER / CONDUCTOR PERSONA (MOBILE EMULATOR) */}
        {/* ========================================================================= */}
        {specialView === 'none' && activeRole === 'driver' && (
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center w-full max-w-6xl">
            
            {/* Phone Emulator */}
            <div className="phone-viewport relative flex-shrink-0 bg-[#090d16] border-[12px] border-slate-900 shadow-2xl rounded-[48px] overflow-hidden">
              <div className="phone-notch"></div>
              
              {/* Phone Screen Scrollable Area */}
              <div className="phone-screen bg-[#080d17] h-full overflow-y-auto flex flex-col pb-16">
                
                {/* Header (Template 3 Style) */}
                <div className="px-5 pt-6 pb-4 bg-gradient-to-b from-slate-900/90 to-transparent flex items-center justify-between border-b border-gray-800/40">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-600 flex items-center justify-center font-bold text-white text-xs">
                      JK
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 leading-none">Bus Conductor</p>
                      <h4 className="text-xs font-bold text-white">Sunil Kumar</h4>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/20">
                      🟢 Active Duty
                    </span>
                  </div>
                </div>

                {driverTripStep === 1 && (
                  <div className="px-4 py-4 flex-1 flex flex-col space-y-4">
                    {/* Active Route Details widget (Template 3 Conductor screen 1) */}
                    <div className="bg-slate-900 p-3 rounded-2xl border border-gray-850 space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-white font-bold flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                          Route: Kasturba Nagar → Green Valley
                        </span>
                        <span className="text-[8px] bg-slate-950 text-gray-400 px-1.5 py-0.5 rounded font-bold">Stop 2 of 4</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-850/60 text-[9px] text-gray-300">
                        <div>
                          <span className="text-gray-400 block text-[8px]">Active Vehicle</span>
                          <span className="text-white font-bold block mt-0.5">
                            {breakdownDispatched ? breakdownInfo.replacementVehicle : breakdownInfo.originalVehicle}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[8px]">Pickup Registered</span>
                          <span className="text-white font-bold block mt-0.5">16 Students (1 on Leave)</span>
                        </div>
                      </div>

                      {/* Breakdown Status / 1-Tap Cab Swap Action */}
                      <div className="pt-2 border-t border-gray-850/60 flex justify-between items-center text-[10px]">
                        {breakdownDispatched ? (
                          <div className="flex items-center gap-1 text-amber-300 font-bold text-[9px]">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>Backup Cab Active • Ravi Dispatched</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-[9px]">Emergency Fleet Protocol:</span>
                        )}
                        <button
                          onClick={() => {
                            setBreakdownDispatched(!breakdownDispatched);
                            setNotificationToast(
                              !breakdownDispatched
                                ? '🚨 Breakdown Alert: Backup Force Traveller TN-09-BK-8822 assigned & Parents notified!'
                                : '✅ Primary vehicle restored.'
                            );
                            setTimeout(() => setNotificationToast(null), 5000);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border transition ${
                            breakdownDispatched
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border-red-500/30'
                          }`}
                        >
                          {breakdownDispatched ? 'Reset Primary Cab' : '🚨 1-Tap Cab Swap'}
                        </button>
                      </div>

                      {/* Seat capacity management */}
                      <div className="p-2 bg-slate-950 rounded-xl border border-gray-900 flex justify-between items-center text-[10px]">
                        <span className="text-gray-400">Available Vacancies:</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setDriverAvailableSeats(Math.max(0, driverAvailableSeats - 1))}
                            className="bg-gray-800 text-white font-bold px-1.5 rounded"
                          >
                            -
                          </button>
                          <span className="font-bold text-white">{driverAvailableSeats} vacant</span>
                          <button 
                            onClick={() => setDriverAvailableSeats(Math.min(15, driverAvailableSeats + 1))}
                            className="bg-gray-800 text-white font-bold px-1.5 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Driver Telematics Index Widget */}
                    <div className="bg-gradient-to-r from-slate-900 to-emerald-950/30 p-2.5 rounded-2xl border border-emerald-500/20 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                          {telematicsScore.score}%
                        </div>
                        <div>
                          <span className="text-white font-bold block leading-tight">Eco-Safety Telematics</span>
                          <span className="text-gray-400 text-[8px]">0 Harsh Brakes • Max 40 km/h</span>
                        </div>
                      </div>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        Top Rated
                      </span>
                    </div>

                    {/* Template 3: Passenger Checklist Screen with Leave Auto-Skip & Guardian PIN */}
                    <div className="bg-slate-900 p-3.5 rounded-2xl border border-gray-850 space-y-3">
                      <div className="flex justify-between items-center">
                        <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <CheckSquare className="h-4 w-4 text-emerald-400" />
                          Student Pickup Checklist
                        </h5>
                        <button 
                          onClick={() => setStudentsList(prev => prev.map(s => ({ ...s, status: 'boarded' })))}
                          className="text-[9px] text-emerald-400 font-bold hover:underline"
                        >
                          Pick All
                        </button>
                      </div>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {studentsList.map((student) => (
                          <div 
                            key={student.id}
                            className={`p-2.5 rounded-xl border flex justify-between items-center gap-2 text-[10px] transition ${
                              student.status === 'leave'
                                ? 'bg-amber-950/20 border-amber-500/30'
                                : 'bg-slate-950 border-gray-900/60'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <strong className="text-white block">{student.name}</strong>
                                {student.status === 'leave' && (
                                  <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                                    Route Auto-Skipped (-8m)
                                  </span>
                                )}
                              </div>
                              <span className="text-gray-400 text-[8px]">{student.grade}</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              {/* Handover PIN Button */}
                              <button
                                onClick={() => {
                                  setShowGuardianPinModal({ id: student.id, name: student.name });
                                  setEnteredGuardianPin('');
                                  setGuardianPinSuccess(false);
                                }}
                                title="Verify Guardian Handover PIN"
                                className="p-1 rounded bg-sky-950 text-sky-400 hover:bg-sky-900 border border-sky-500/30"
                              >
                                <Key className="h-3 w-3" />
                              </button>

                              {/* Phone Link Call action */}
                              <a href={`tel:${student.phone}`} className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300">
                                <Phone className="h-3 w-3" />
                              </a>
                              
                              {/* Toggle Checkboxes */}
                              <button
                                onClick={() => toggleStudentStatus(student.id)}
                                className={`px-2 py-1 rounded text-[9px] font-bold transition ${
                                  student.status === 'boarded' 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                    : student.status === 'leave'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : student.status === 'absent'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-gray-800 text-gray-300 border border-gray-750'
                                }`}
                              >
                                {student.status === 'leave' ? 'LEAVE' : student.status.toUpperCase()}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => {
                        setDriverTripStarted(true);
                        setDriverTripStep(2);
                      }}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="h-4 w-4 text-white" />
                      Start Trip & Broadcast GPS
                    </button>
                  </div>
                )}

                {driverTripStep === 2 && (
                  <div className="px-4 py-4 flex-1 flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1">
                          <Navigation className="h-4 w-4 text-emerald-400" />
                          Trip Progress Tracking
                        </h4>
                        <button 
                          onClick={() => setDriverTripStep(1)}
                          className="text-[9px] text-gray-400 hover:text-white"
                        >
                          Checklist
                        </button>
                      </div>

                      {/* Real City Map display */}
                      <div className="h-[220px] w-full rounded-2xl overflow-hidden shadow-xl border border-gray-800">
                        <CityMap 
                          mode="driver" 
                          height="100%" 
                          currentGps={apiConnected ? driverGPS : undefined}
                        />
                      </div>

                      {/* Progress summary card */}
                      <div className="bg-slate-900 p-3 rounded-2xl border border-gray-850 space-y-2">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-gray-400">Trip Status</span>
                          <span className="text-emerald-400 font-bold">You have reached Kasturba Nagar ✅</span>
                        </div>
                        
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5">
                          <div className="bg-emerald-500 h-full w-[75%]"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-850/60 text-[9px] text-gray-400">
                          <span>Next Stop: <strong>Green Valley School Gate</strong></span>
                          <span className="text-right">Skipped on Leave: <strong className="text-amber-300">1</strong></span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowAntiAbandonModal(true)}
                      className="w-full bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <Shield className="w-4 h-4 text-emerald-300" />
                      Arrived at School • Safety Sweep & Finish
                    </button>
                  </div>
                )}

                {driverTripStep === 3 && (
                  <div className="px-4 py-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/25">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Trip Completed Safely!</h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-[240px] mx-auto">
                        All student check-ins and drop logs saved to audit registry.
                      </p>
                    </div>

                    {/* Anti-Abandonment Verification Badge */}
                    <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3 text-left w-full space-y-1.5 text-[10px]">
                      <span className="text-emerald-300 font-bold flex items-center gap-1 uppercase tracking-wider text-[9px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Anti-Abandonment Verification: PASS
                      </span>
                      <div className="text-gray-300 text-[9px]">
                        • Physical Cabin Check: <strong>Rows 1-3 Verified Clear</strong>
                      </div>
                      <div className="text-gray-300 text-[9px]">
                        • Rear Tag NFC Scan: <strong>TAG-REAR-001 at 08:35 AM</strong>
                      </div>
                      <div className="text-gray-300 text-[9px]">
                        • Sleeping Children Remaining: <strong className="text-emerald-400 font-mono">0 (CLEARED)</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setDriverTripStep(1);
                        setDriverTripStarted(false);
                        setSweepChecks({ row1: false, row2: false, row3: false, rearTag: false, photo: false });
                      }}
                      className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-4 py-2 rounded-xl font-bold"
                    >
                      Return to Checklist
                    </button>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* MODAL 1: REAR-SEAT ANTI-ABANDONMENT SAFETY SWEEP */}
                {/* ========================================================================= */}
                {showAntiAbandonModal && (
                  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
                      <div className="flex items-center gap-2 text-white">
                        <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold">Anti-Abandonment Safety Sweep</h3>
                          <p className="text-[10px] text-gray-400">Mandatory check before trip completion</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <p className="text-[11px] text-amber-200 bg-amber-950/40 p-2 rounded-xl border border-amber-500/30">
                          ⚠️ Driver must walk to the rear of the bus, verify no sleeping children/bags remain, and scan the rear tag.
                        </p>

                        <div className="space-y-1.5 pt-1">
                          <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-gray-800 cursor-pointer text-gray-300">
                            <input
                              type="checkbox"
                              checked={sweepChecks.row1}
                              onChange={(e) => setSweepChecks(prev => ({ ...prev, row1: e.target.checked }))}
                              className="rounded text-indigo-600"
                            />
                            <span>Inspected Rows 1 & 2 (Seats clear)</span>
                          </label>

                          <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-gray-800 cursor-pointer text-gray-300">
                            <input
                              type="checkbox"
                              checked={sweepChecks.row2}
                              onChange={(e) => setSweepChecks(prev => ({ ...prev, row2: e.target.checked }))}
                              className="rounded text-indigo-600"
                            />
                            <span>Inspected Rows 3 & Rear Bench</span>
                          </label>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => {
                                setSweepChecks(prev => ({ ...prev, rearTag: true }));
                                setNotificationToast('🏷️ Rear Seat NFC Tag [TAG-REAR-001] Verified!');
                                setTimeout(() => setNotificationToast(null), 4000);
                              }}
                              className={`flex-1 py-2 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 border transition ${
                                sweepChecks.rearTag
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                  : 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600/50'
                              }`}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              {sweepChecks.rearTag ? 'Rear Tag Scanned ✅' : 'Scan Rear QR/Tag'}
                            </button>

                            <button
                              onClick={() => {
                                setSweepChecks(prev => ({ ...prev, photo: true }));
                                setNotificationToast('📸 Vehicle Interior Photo Audit Stamped!');
                                setTimeout(() => setNotificationToast(null), 4000);
                              }}
                              className={`flex-1 py-2 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 border transition ${
                                sweepChecks.photo
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                  : 'bg-slate-800 text-gray-300 border-gray-700 hover:bg-slate-700'
                              }`}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              {sweepChecks.photo ? 'Cabin Photo Saved ✅' : 'Snap Cabin Photo'}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-gray-800">
                        <button
                          onClick={() => setShowAntiAbandonModal(false)}
                          className="flex-1 py-2 bg-gray-800 text-gray-300 text-xs font-bold rounded-xl"
                        >
                          Back
                        </button>
                        <button
                          disabled={!(sweepChecks.row1 && sweepChecks.row2 && sweepChecks.rearTag)}
                          onClick={() => {
                            setShowAntiAbandonModal(false);
                            setDriverTripStep(3);
                            setNotificationToast('✅ Anti-Abandonment Audit Certified. Trip Completed!');
                            setTimeout(() => setNotificationToast(null), 5000);
                          }}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl shadow-lg transition ${
                            sweepChecks.row1 && sweepChecks.row2 && sweepChecks.rearTag
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20'
                              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Certify & Finish Trip
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* MODAL 2: GUARDIAN HANDOVER PIN VERIFICATION */}
                {/* ========================================================================= */}
                {showGuardianPinModal && (
                  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-sky-500/40 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
                      <div className="flex items-center gap-2 text-white">
                        <div className="p-2 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30">
                          <Key className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold">Verify Guardian Handover PIN</h3>
                          <p className="text-[10px] text-gray-400">Student: {showGuardianPinModal.name}</p>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs">
                        <p className="text-[11px] text-slate-300">
                          Ask the picking-up relative/guardian for their 4-Digit Handover PIN generated in the Parent App.
                        </p>

                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Enter 4-Digit PIN</label>
                          <input
                            type="text"
                            maxLength={4}
                            placeholder="e.g. 7429"
                            value={enteredGuardianPin}
                            onChange={(e) => setEnteredGuardianPin(e.target.value)}
                            className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-center text-lg font-mono font-black text-sky-400 tracking-widest focus:outline-none focus:border-sky-500"
                          />
                        </div>

                        {guardianPinSuccess && (
                          <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-xl text-[10px] text-emerald-300 flex items-center gap-1.5 animate-fadeIn">
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>Authorized Guardian (Ramesh Sharma - Uncle) Verified! Safe to release student.</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-gray-800">
                        <button
                          onClick={() => setShowGuardianPinModal(null)}
                          className="flex-1 py-2 bg-gray-800 text-gray-300 text-xs font-bold rounded-xl"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => {
                            if (enteredGuardianPin === '7429' || enteredGuardianPin.length === 4) {
                              setGuardianPinSuccess(true);
                              setNotificationToast(`✅ Guardian Handover Authorized for ${showGuardianPinModal.name}!`);
                              setTimeout(() => setNotificationToast(null), 5000);
                            } else {
                              setNotificationToast('❌ Invalid Handover PIN. Please check parent pass.');
                              setTimeout(() => setNotificationToast(null), 4000);
                            }
                          }}
                          className="flex-1 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 text-white text-xs font-bold rounded-xl shadow"
                        >
                          Verify PIN
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Sidebar Description for Conductor mockup */}
            <div className="flex-1 glass-card p-6 rounded-3xl border border-gray-800 space-y-6 max-w-lg">
              <div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-bold">CONDUCTOR PERSONA ACTIVE</span>
                <h2 className="text-2xl font-bold mt-3 text-white">Student Checklist & Route Status</h2>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Conductors/drivers log in and check off students (Present / Absent / Boarded) during pickup rounds. Checking off a student automatically updates the Parent App's "Journey Passport" in real-time, giving peace of mind to parents.
                </p>
              </div>

              {/* Verified UI template connections */}
              <div className="space-y-3.5 border-t border-gray-800 pt-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Replicated Templates</h4>
                
                <div className="flex items-start gap-2.5">
                  <div className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-extrabold text-xs">T3</div>
                  <div>
                    <strong className="text-white text-xs block">Conductor Checklist & Student Tracker</strong>
                    <span className="text-xs text-gray-400">
                      Implements the student listing panel (Mahesh Kumar, Ananya Tiwari, Swapnil Vashistha) with colored toggles (Boarded, Absent, Pending) and quick phone call triggers.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-extrabold text-xs">T3</div>
                  <div>
                    <strong className="text-white text-xs block">Route Status Progression</strong>
                    <span className="text-xs text-gray-400">
                      Simulates the trip tracker bar notifying the driver "You have reached Kasturba Nagar Stop 2 of 4".
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-extrabold text-xs">NEW</div>
                  <div>
                    <strong className="text-white text-xs block">Anti-Abandonment Safety Sweep</strong>
                    <span className="text-xs text-gray-400">
                      Mandatory end-of-trip rear cabin physical check + rear NFC/QR tag scan to certify 0 sleeping children remain.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded font-extrabold text-xs">NEW</div>
                  <div>
                    <strong className="text-white text-xs block">Guardian Handover Pass Verifier</strong>
                    <span className="text-xs text-gray-400">
                      Allows driver to verify the 4-digit PIN generated by parents before releasing a student to an alternate guardian.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-extrabold text-xs">NEW</div>
                  <div>
                    <strong className="text-white text-xs block">Leave Sync & Route Auto-Skip</strong>
                    <span className="text-xs text-gray-400">
                      When parents mark leave, the driver checklist marks the student as 'On Leave' and auto-skips waypoint saving 8 mins.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-extrabold text-xs">NEW</div>
                  <div>
                    <strong className="text-white text-xs block">1-Tap Breakdown & Backup Cab Dispatch</strong>
                    <span className="text-xs text-gray-400">
                      Instant vehicle swap protocol migrating waypoints to backup Force Traveller with live parent notifications.
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUPER ADMIN PERSONA (DESKTOP PORTAL VIEW) */}
        {/* ========================================================================= */}
        {activeRole === 'admin' && (
          <div className="w-full max-w-6xl flex flex-col gap-6">

            {/* Super Admin Module Navigation Tabs Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-2.5 rounded-2xl border border-gray-800 shadow-2xl backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-1.5">
                
                <button
                  onClick={() => setAdminTab('approvals')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    adminTab === 'approvals'
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 border border-amber-400/40 ring-2 ring-amber-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  <Key className="h-4 w-4 text-amber-300" />
                  <span>OTP & Approvals Desk</span>
                  {pendingAuthRequests.filter(r => r.status === 'PENDING_APPROVAL').length > 0 && (
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                      {pendingAuthRequests.filter(r => r.status === 'PENDING_APPROVAL').length} NEW
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setAdminTab('workflow')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    adminTab === 'workflow'
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40 ring-2 ring-indigo-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
                  <span>Workflow & Route Flow</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-emerald-500/40 tracking-wider">
                    LIVE
                  </span>
                </button>

                <button
                  onClick={() => setAdminTab('kpis')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    adminTab === 'kpis' || adminTab === 'overview'
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/40 ring-2 ring-teal-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 text-teal-300" />
                  <span>KPI Analytics</span>
                </button>

                <button
                  onClick={() => setAdminTab('invoices')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    adminTab === 'invoices'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/40 ring-2 ring-purple-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  <Receipt className="h-4 w-4 text-purple-300" />
                  <span>GST Invoices & Billing</span>
                </button>

                <button
                  onClick={() => setAdminTab('heatmap')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    adminTab === 'heatmap'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30'
                      : 'text-gray-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <MapIcon className="h-4 w-4" />
                  <span>Demand Heatmap</span>
                </button>

                <button
                  onClick={() => setAdminTab('verification')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    adminTab === 'verification'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30'
                      : 'text-gray-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Verification Queue</span>
                </button>

                <button
                  onClick={() => setAdminTab('offers')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    adminTab === 'offers'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30'
                      : 'text-gray-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Percent className="h-4 w-4" />
                  <span>Offers Engine</span>
                </button>

                <button
                  onClick={() => setAdminTab('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    adminTab === 'all'
                      ? 'bg-slate-700 text-white shadow-md border border-gray-600'
                      : 'text-gray-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  <span>All Modules</span>
                </button>
              </div>

              {/* Live Status indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/90 rounded-xl border border-gray-800 text-[11px]">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    workflowErrorService || sosStatus ? 'bg-red-400' : 'bg-emerald-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    workflowErrorService || sosStatus ? 'bg-red-500' : 'bg-emerald-500'
                  }`}></span>
                </span>
                <span className="text-gray-200 font-semibold">
                  {workflowErrorService 
                    ? `Fault: [${workflowErrorService.toUpperCase()}] Interrupted` 
                    : sosStatus 
                    ? 'SOS Alarm Active' 
                    : 'All 5 Service Nodes Healthy (200 OK)'}
                </span>
              </div>
            </div>
            
            {/* Top Stat Metrics - Shown in Overview & All Modules */}
            {(adminTab === 'overview' || adminTab === 'all') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
                <div className="glass-card p-5 rounded-2xl border border-gray-800 flex justify-between items-center hover:border-indigo-500/40 transition">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Verified Drivers</span>
                    <h3 className="text-2xl font-black text-white mt-1">128</h3>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" /> +12% this month
                    </span>
                  </div>
                  <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-400">
                    <Users className="h-6 w-6" />
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-gray-800 flex justify-between items-center hover:border-emerald-500/40 transition">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Monthly Subscriptions</span>
                    <h3 className="text-2xl font-black text-white mt-1">₹4.82L</h3>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" /> +8.4% growth
                    </span>
                  </div>
                  <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-400">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-gray-800 flex justify-between items-center hover:border-sky-500/40 transition">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">AI Match Success Rate</span>
                    <h3 className="text-2xl font-black text-white mt-1">94.8%</h3>
                    <span className="text-[10px] text-sky-400 font-bold flex items-center gap-1 mt-1">
                      <Sparkles className="h-3 w-3" /> Optimized routes
                    </span>
                  </div>
                  <div className="bg-sky-500/10 p-3 rounded-xl text-sky-400">
                    <Sparkles className="h-6 w-6" />
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-gray-800 flex justify-between items-center hover:border-yellow-500/40 transition">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Opportunity Score</span>
                    <h3 className="text-2xl font-black text-white mt-1">{adminDemandScore}%</h3>
                    <span className="text-[10px] text-yellow-400 font-bold flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3" /> High parent demand
                    </span>
                  </div>
                  <div className="bg-yellow-500/10 p-3 rounded-xl text-yellow-400">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* DEDICATED OTP GENERATION & USER APPROVALS DESK */}
            {/* ===================================================================== */}
            {(adminTab === 'approvals' || adminTab === 'all') && (
              <AdminApprovalsDesk
                requests={pendingAuthRequests}
                onGenerateOtp={handleGenerateOtp}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
                auditLogs={otpAuditLogs}
              />
            )}

            {/* ===================================================================== */}
            {/* DEDICATED PLATFORM KPI & FINANCIAL YIELD ANALYTICS */}
            {/* ===================================================================== */}
            {(adminTab === 'kpis' || adminTab === 'overview' || adminTab === 'all') && (
              <AdminKpiAnalytics />
            )}

            {/* ===================================================================== */}
            {/* DEDICATED MASTER INVOICING & GST BILLING DESK */}
            {/* ===================================================================== */}
            {(adminTab === 'invoices' || adminTab === 'all') && (
              <AdminInvoicesDesk />
            )}

            {/* ===================================================================== */}
            {/* DEDICATED WORKFLOW & INTEGRATION ENGINE MODULE */}
            {/* ===================================================================== */}
            {(adminTab === 'workflow' || adminTab === 'all') && (
              <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-6 shadow-2xl animate-fadeIn">
                
                {/* Module Header */}
                <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-gray-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1">
                        <Cpu className="h-3 w-3 text-indigo-400" /> Multi-Service Orchestrator v2.4
                      </span>
                      <span className="bg-emerald-500/15 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Zero-Trust Pipeline
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
                      <GitMerge className="h-5 w-5 text-indigo-400" />
                      Live Route Flow & Multi-Portal Workflow Engine
                    </h2>
                    <p className="text-xs text-gray-400 max-w-2xl">
                      Directional event pipeline tracking cross-service handshakes: Parent ride booking ➔ Admin KYC & Route matching ➔ Cab Owner fleet provisioning ➔ Conductor student check-in ➔ Real-time GPS stream.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {workflowErrorService ? (
                      <button
                        onClick={() => handleWorkflowSimulation(null)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Restore All Nodes (200 OK)
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>All Pipelines Healthy</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Telemetry Ribbons Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-gray-800/80 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Radio className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Connected Nodes</span>
                      <strong className="text-sm font-bold text-white">5 Microservices</strong>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-gray-800/80 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Event Throughput</span>
                      <strong className="text-sm font-bold text-emerald-400">384 events/min</strong>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-gray-800/80 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Median Handshake</span>
                      <strong className="text-sm font-bold text-sky-400">24 ms latency</strong>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-gray-800/80 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Protocol Security</span>
                      <strong className="text-sm font-bold text-purple-300">TLS 1.3 + JWT</strong>
                    </div>
                  </div>
                </div>

                {/* 5-NODE DIRECTIONAL ARCHITECTURE PIPELINE */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                      Live Handshake Architecture (Click any node to simulate error or diagnose)
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Auto-Syncing every 2s</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-9 gap-2 items-center p-4 bg-slate-950/80 rounded-2xl border border-gray-800/90 shadow-inner">
                    
                    {/* NODE 1: PARENT PORTAL */}
                    <div 
                      onClick={() => handleWorkflowSimulation(workflowErrorService === 'parent' ? null : 'parent')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 ${
                        workflowErrorService === 'parent' || sosStatus
                          ? 'bg-red-500/15 border-red-500 text-red-200 shadow-lg shadow-red-500/20 scale-[1.02]'
                          : 'bg-slate-900 border-gray-800 text-gray-300 hover:border-indigo-500/50 hover:bg-slate-850'
                      }`}
                    >
                      <div className={`p-2 rounded-xl mb-1 ${workflowErrorService === 'parent' || sosStatus ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                        <Smartphone className={`h-5 w-5 ${workflowErrorService === 'parent' || sosStatus ? 'animate-bounce' : ''}`} />
                      </div>
                      <span className="text-[11px] font-black text-white text-center">Parent Portal</span>
                      <span className="text-[8px] text-indigo-300 font-mono mt-0.5">Port 8085</span>
                      <span className="text-[8px] text-gray-400 mt-1 text-center font-medium">Ride Booking & Pass</span>
                      <span className="mt-2 text-[7px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {workflowErrorService === 'parent' ? '503 FAULT' : sosStatus ? 'SOS TRIGGER' : '200 OK (18ms)'}
                      </span>
                      {(workflowErrorService === 'parent' || sosStatus) && (
                        <span className="absolute -top-2 -right-1 bg-red-600 text-white font-black text-[8px] px-1.5 py-0.5 rounded-full border border-red-400 animate-pulse flex items-center gap-0.5 shadow-lg">
                          <AlertTriangle className="h-2.5 w-2.5" /> {sosStatus ? 'SOS' : 'ERR'}
                        </span>
                      )}
                    </div>

                    {/* CONNECTOR 1 */}
                    <div className="flex flex-col items-center justify-center text-indigo-400 md:rotate-0 rotate-90 py-1">
                      <div className="text-xs font-black animate-pulse flex items-center justify-center">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                      <span className="text-[7px] font-mono text-gray-500 mt-0.5 md:block hidden">JSON</span>
                    </div>

                    {/* NODE 2: SUPER ADMIN CORE */}
                    <div 
                      onClick={() => handleWorkflowSimulation(workflowErrorService === 'admin' ? null : 'admin')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 ${
                        workflowErrorService === 'admin'
                          ? 'bg-red-500/15 border-red-500 text-red-200 shadow-lg shadow-red-500/20 scale-[1.02]'
                          : 'bg-slate-900 border-gray-800 text-gray-300 hover:border-indigo-500/50 hover:bg-slate-850'
                      }`}
                    >
                      <div className={`p-2 rounded-xl mb-1 ${workflowErrorService === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-sky-500/10 text-sky-400'}`}>
                        <Shield className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-black text-white text-center">Super Admin Core</span>
                      <span className="text-[8px] text-sky-300 font-mono mt-0.5">Port 8082</span>
                      <span className="text-[8px] text-gray-400 mt-1 text-center font-medium">KYC & AI Corridors</span>
                      <span className="mt-2 text-[7px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {workflowErrorService === 'admin' ? '500 BACKLOG' : '200 OK (28ms)'}
                      </span>
                      {workflowErrorService === 'admin' && (
                        <span className="absolute -top-2 -right-1 bg-red-600 text-white font-black text-[8px] px-1.5 py-0.5 rounded-full border border-red-400 animate-pulse flex items-center gap-0.5 shadow-lg">
                          <AlertTriangle className="h-2.5 w-2.5" /> ERR
                        </span>
                      )}
                    </div>

                    {/* CONNECTOR 2 */}
                    <div className="flex flex-col items-center justify-center text-indigo-400 md:rotate-0 rotate-90 py-1">
                      <div className="text-xs font-black animate-pulse flex items-center justify-center">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                      <span className="text-[7px] font-mono text-gray-500 mt-0.5 md:block hidden">DISPATCH</span>
                    </div>

                    {/* NODE 3: CAB OWNER PORTAL */}
                    <div 
                      onClick={() => handleWorkflowSimulation(workflowErrorService === 'owner' ? null : 'owner')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 ${
                        workflowErrorService === 'owner'
                          ? 'bg-red-500/15 border-red-500 text-red-200 shadow-lg shadow-red-500/20 scale-[1.02]'
                          : 'bg-slate-900 border-gray-800 text-gray-300 hover:border-indigo-500/50 hover:bg-slate-850'
                      }`}
                    >
                      <div className={`p-2 rounded-xl mb-1 ${workflowErrorService === 'owner' ? 'bg-red-500/20 text-red-400' : 'bg-teal-500/10 text-teal-400'}`}>
                        <Users className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-black text-white text-center">Cab Owner Fleet</span>
                      <span className="text-[8px] text-teal-300 font-mono mt-0.5">Port 8083</span>
                      <span className="text-[8px] text-gray-400 mt-1 text-center font-medium">Van Roster & Seats</span>
                      <span className="mt-2 text-[7px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {workflowErrorService === 'owner' ? '502 DOWN' : '200 OK (22ms)'}
                      </span>
                      {workflowErrorService === 'owner' && (
                        <span className="absolute -top-2 -right-1 bg-red-600 text-white font-black text-[8px] px-1.5 py-0.5 rounded-full border border-red-400 animate-pulse flex items-center gap-0.5 shadow-lg">
                          <AlertTriangle className="h-2.5 w-2.5" /> ERR
                        </span>
                      )}
                    </div>

                    {/* CONNECTOR 3 */}
                    <div className="flex flex-col items-center justify-center text-indigo-400 md:rotate-0 rotate-90 py-1">
                      <div className="text-xs font-black animate-pulse flex items-center justify-center">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                      <span className="text-[7px] font-mono text-gray-500 mt-0.5 md:block hidden">ROSTER</span>
                    </div>

                    {/* NODE 4: CONDUCTOR & DRIVER APP */}
                    <div 
                      onClick={() => handleWorkflowSimulation(workflowErrorService === 'driver' ? null : 'driver')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 ${
                        workflowErrorService === 'driver'
                          ? 'bg-red-500/15 border-red-500 text-red-200 shadow-lg shadow-red-500/20 scale-[1.02]'
                          : driverTripStarted
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-900 border-gray-800 text-gray-300 hover:border-indigo-500/50 hover:bg-slate-850'
                      }`}
                    >
                      <div className={`p-2 rounded-xl mb-1 ${workflowErrorService === 'driver' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        <Navigation className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-black text-white text-center">Conductor Mobile</span>
                      <span className="text-[8px] text-emerald-300 font-mono mt-0.5">Port 8084</span>
                      <span className="text-[8px] text-gray-400 mt-1 text-center font-medium">Checklist & GPS</span>
                      <span className="mt-2 text-[7px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {workflowErrorService === 'driver' ? '408 TIMEOUT' : '200 OK (35ms)'}
                      </span>
                      {workflowErrorService === 'driver' && (
                        <span className="absolute -top-2 -right-1 bg-red-600 text-white font-black text-[8px] px-1.5 py-0.5 rounded-full border border-red-400 animate-pulse flex items-center gap-0.5 shadow-lg">
                          <AlertTriangle className="h-2.5 w-2.5" /> ERR
                        </span>
                      )}
                    </div>

                    {/* CONNECTOR 4 */}
                    <div className="flex flex-col items-center justify-center text-indigo-400 md:rotate-0 rotate-90 py-1">
                      <div className="text-xs font-black animate-pulse flex items-center justify-center">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                      <span className="text-[7px] font-mono text-gray-500 mt-0.5 md:block hidden">STREAM</span>
                    </div>

                    {/* NODE 5: LIVE TRACKING & GEOFENCE */}
                    <div 
                      onClick={() => handleWorkflowSimulation(workflowErrorService === 'tracking' ? null : 'tracking')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 ${
                        workflowErrorService === 'tracking' || (sosStatus && driverTripStarted)
                          ? 'bg-red-500/15 border-red-500 text-red-200 shadow-lg shadow-red-500/20 scale-[1.02]'
                          : driverTripStarted
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-900 border-gray-800 text-gray-300 hover:border-indigo-500/50 hover:bg-slate-850'
                      }`}
                    >
                      <div className={`p-2 rounded-xl mb-1 ${workflowErrorService === 'tracking' || (sosStatus && driverTripStarted) ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/10 text-purple-400'}`}>
                        <Map className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-black text-white text-center">Live Tracking Map</span>
                      <span className="text-[8px] text-purple-300 font-mono mt-0.5">WebSocket Feed</span>
                      <span className="text-[8px] text-gray-400 mt-1 text-center font-medium">0.5-Mile Geofence</span>
                      <span className="mt-2 text-[7px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {workflowErrorService === 'tracking' ? '504 DROP' : '200 OK (15ms)'}
                      </span>
                      {(workflowErrorService === 'tracking' || (sosStatus && driverTripStarted)) && (
                        <span className="absolute -top-2 -right-1 bg-red-600 text-white font-black text-[8px] px-1.5 py-0.5 rounded-full border border-red-400 animate-pulse flex items-center gap-0.5 shadow-lg">
                          <AlertTriangle className="h-2.5 w-2.5" /> SOS
                        </span>
                      )}
                    </div>

                  </div>
                </div>

                {/* END-TO-END COMMUTE LIFECYCLE PROGRESSION */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-gray-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      End-to-End Commute Lifecycle Progression
                    </span>
                    <span className="text-[10px] text-indigo-400 font-bold">5 Stage Pipeline</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-gray-850 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-sky-400">STAGE 1</span>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <strong className="text-xs text-white block mt-1">Ride Request</strong>
                        <p className="text-[10px] text-gray-400 mt-0.5">Parent books pass for student & authorizes monthly wallet deduction.</p>
                      </div>
                      <span className="text-[8px] text-gray-500 font-mono mt-2">Source: backend-parent</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-gray-850 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-indigo-400">STAGE 2</span>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <strong className="text-xs text-white block mt-1">AI Route Match</strong>
                        <p className="text-[10px] text-gray-400 mt-0.5">Super Admin verifies driver KYC & maps student to safe school corridor.</p>
                      </div>
                      <span className="text-[8px] text-gray-500 font-mono mt-2">Source: backend-super-admin</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-gray-850 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-teal-400">STAGE 3</span>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <strong className="text-xs text-white block mt-1">Fleet Dispatch</strong>
                        <p className="text-[10px] text-gray-400 mt-0.5">Cab Owner accepts booking & locks available vehicle seat inventory.</p>
                      </div>
                      <span className="text-[8px] text-gray-500 font-mono mt-2">Source: backend-cab-owner</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-gray-850 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-emerald-400">STAGE 4</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        </div>
                        <strong className="text-xs text-white block mt-1">Check-in / Boarding</strong>
                        <p className="text-[10px] text-gray-400 mt-0.5">Conductor verifies student identity via digital checklist & triggers trip start.</p>
                      </div>
                      <span className="text-[8px] text-gray-500 font-mono mt-2">Source: backend-driver</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-gray-850 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-purple-400">STAGE 5</span>
                          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                        </div>
                        <strong className="text-xs text-white block mt-1">Live Tracking & SOS</strong>
                        <p className="text-[10px] text-gray-400 mt-0.5">Continuous GPS streaming with 0.5-mile parent arrival alerts & emergency SOS.</p>
                      </div>
                      <span className="text-[8px] text-gray-500 font-mono mt-2">Source: WebSocket / FCM</span>
                    </div>
                  </div>
                </div>

                {/* SIMULATED ERROR INJECTION & DIAGNOSTICS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
                  
                  {/* Error Injection Controls */}
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-gray-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        Interactive Fault Injection & Resilience Testing
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Test system resilience by simulating real-world packet drops, SOS interruptions, or service outages.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <button 
                        onClick={() => handleWorkflowSimulation(workflowErrorService === 'parent' ? null : 'parent')} 
                        className={`text-[9px] px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                          workflowErrorService === 'parent' ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'bg-slate-800 text-gray-300 hover:text-white'
                        }`}
                      >
                        <Smartphone className="h-3 w-3" /> Parent SOS
                      </button>
                      <button 
                        onClick={() => handleWorkflowSimulation(workflowErrorService === 'admin' ? null : 'admin')} 
                        className={`text-[9px] px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                          workflowErrorService === 'admin' ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'bg-slate-800 text-gray-300 hover:text-white'
                        }`}
                      >
                        <Shield className="h-3 w-3" /> Admin Lag
                      </button>
                      <button 
                        onClick={() => handleWorkflowSimulation(workflowErrorService === 'owner' ? null : 'owner')} 
                        className={`text-[9px] px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                          workflowErrorService === 'owner' ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'bg-slate-800 text-gray-300 hover:text-white'
                        }`}
                      >
                        <Users className="h-3 w-3" /> Fleet Drop
                      </button>
                      <button 
                        onClick={() => handleWorkflowSimulation(workflowErrorService === 'driver' ? null : 'driver')} 
                        className={`text-[9px] px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                          workflowErrorService === 'driver' ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'bg-slate-800 text-gray-300 hover:text-white'
                        }`}
                      >
                        <Navigation className="h-3 w-3" /> GPS Lost
                      </button>
                      <button 
                        onClick={() => handleWorkflowSimulation(workflowErrorService === 'tracking' ? null : 'tracking')} 
                        className={`text-[9px] px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                          workflowErrorService === 'tracking' ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'bg-slate-800 text-gray-300 hover:text-white'
                        }`}
                      >
                        <Map className="h-3 w-3" /> Socket Lag
                      </button>
                      <button 
                        onClick={() => handleWorkflowSimulation(null)} 
                        className="text-[9px] px-2.5 py-1.5 rounded-lg font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3" /> Reset All (OK)
                      </button>
                    </div>
                  </div>

                  {/* Real-time Diagnostics Terminal */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-gray-900 font-mono text-[10px] space-y-2 lg:col-span-2 shadow-inner">
                    <div className="flex justify-between items-center border-b border-gray-850 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Live Event Stream & Diagnostics Console</span>
                      </div>
                      <span className="text-[9px] text-gray-500">Auto-Scrolling</span>
                    </div>

                    <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                      {workflowSimulatedLogs.map((log, index) => (
                        <div 
                          key={index}
                          className={`leading-relaxed ${
                            log.includes('ALERT') || log.includes('FAULT')
                              ? 'text-red-400 font-bold'
                              : log.includes('RECOVERY')
                              ? 'text-emerald-400 font-bold'
                              : index === 0
                              ? 'text-sky-300'
                              : 'text-gray-400'
                          }`}
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Layout Grid: Demand Heatmap, Verification Queue & Offers */}
            {(adminTab === 'heatmap' || adminTab === 'verification' || adminTab === 'offers' || adminTab === 'all') && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
                
                {/* School Transport Demand Heatmap & AI Route Builder */}
                {(adminTab === 'heatmap' || adminTab === 'all') && (
                  <div className={`glass-card p-5 rounded-2xl border border-gray-800 space-y-4 ${adminTab === 'heatmap' ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <MapIcon className="h-4.5 w-4.5 text-indigo-400" />
                          School Transport Demand Map
                        </h3>
                        <p className="text-xs text-gray-400">Real-time Chennai parent request hotspots</p>
                      </div>
                      
                      <button 
                        onClick={() => setAdminDemandScore(Math.floor(Math.random() * 15) + 80)}
                        className="p-1 rounded bg-gray-800 text-gray-400 hover:text-white"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Real City Metropolitan Demand Heatmap */}
                    <div className="space-y-3">
                      <CityMap 
                        mode="admin" 
                        height="380px" 
                      />

                      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/90 rounded-xl border border-gray-800 text-[10px]">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                            <span className="text-gray-300 font-semibold">High Demand Cluster (&gt;30 students)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                            <span className="text-gray-300 font-semibold">College Commute Hub</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                            <span className="text-gray-300 font-semibold">Tambaram-OMR IT Corridor</span>
                          </div>
                        </div>
                        <div className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          AI Matched Corridors: 94.8% Capacity
                        </div>
                      </div>
                    </div>

                    {/* AI Router Console */}
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-gray-800 space-y-2">
                      <h4 className="text-xs font-bold text-white">AI Route Optimization Console</h4>
                      <p className="text-xs text-gray-400">Create new high-demand routes instantly and allocate them to pro-tier drivers.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition">
                          Map Kattur Route
                        </button>
                        <button className="bg-slate-800 hover:bg-slate-750 text-gray-300 font-bold py-2 px-3 rounded-lg text-xs transition">
                          Auto-Match Empty Seats
                        </button>
                        <button className="bg-slate-800 hover:bg-slate-750 text-gray-300 font-bold py-2 px-3 rounded-lg text-xs transition">
                          Notify Pro Drivers
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sidebar: Admin Verification & Offers Engine */}
                {(adminTab === 'verification' || adminTab === 'offers' || adminTab === 'all') && (
                  <div className={`space-y-6 ${adminTab === 'verification' || adminTab === 'offers' ? 'lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0' : ''}`}>
                    
                    {/* Driver KYC verification queue */}
                    {(adminTab === 'verification' || adminTab === 'all') && (
                      <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Shield className="h-4.5 w-4.5 text-sky-400" />
                          Verification Queue
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-gray-855 space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <strong className="text-white">Rajesh Pandian (Cab Host)</strong>
                              <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">Pending Aadhar</span>
                            </div>
                            <p className="text-gray-400 text-[10px]">Suzuki Swift 2021 (TN-07-CM-2291)</p>
                            
                            <div className="flex gap-2 justify-end pt-1">
                              <button className="bg-red-500/10 text-red-400 font-bold px-2.5 py-1 rounded text-[9px]">Reject</button>
                              <button className="bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded text-[9px]">Approve & List</button>
                            </div>
                          </div>

                          <div className="bg-slate-900/80 p-3 rounded-xl border border-gray-855 space-y-2 text-xs opacity-75">
                            <div className="flex justify-between items-center">
                              <strong className="text-white">Sathish Kumar (Van Host)</strong>
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">Verified ✅</span>
                            </div>
                            <p className="text-gray-400 text-[10px]">Force Traveler (TN-12-AE-3940)</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Promos & Offers engine */}
                    {(adminTab === 'offers' || adminTab === 'all') && (
                      <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Percent className="h-4.5 w-4.5 text-indigo-400" />
                          Super Admin Offers Engine
                        </h3>

                        {/* Create offer form */}
                        <form onSubmit={createOffer} className="space-y-2.5">
                          <div>
                            <input 
                              type="text" 
                              placeholder="Offer Title (e.g. Sibling Discount)" 
                              value={newOfferTitle}
                              onChange={(e) => setNewOfferTitle(e.target.value)}
                              className="w-full bg-slate-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Discount Value (e.g. 10% OFF)" 
                              value={newOfferDiscount}
                              onChange={(e) => setNewOfferDiscount(e.target.value)}
                              className="flex-1 bg-slate-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                            />
                            <button 
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold px-3 rounded-lg text-xs"
                            >
                              Add Offer
                            </button>
                          </div>
                        </form>

                        {/* Promos List */}
                        <div className="space-y-2 pt-2 border-t border-gray-800/60 max-h-[160px] overflow-y-auto pr-1">
                          {adminOffers.map((offer) => (
                            <div 
                              key={offer.id}
                              className="p-2.5 rounded-lg bg-slate-900/60 border border-gray-850 flex justify-between items-center text-[10px]"
                            >
                              <div>
                                <strong className="text-white block">{offer.title}</strong>
                                <span className="text-gray-400 font-mono text-[8px]">{offer.code}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="bg-indigo-500/10 text-indigo-300 font-bold px-1.5 py-0.5 rounded text-[8px]">{offer.discount}</span>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    setAdminOffers(prev => prev.map(o => o.id === offer.id ? { ...o, active: !o.active } : o));
                                  }}
                                  className={`px-2 py-0.5 rounded text-[8px] font-bold ${offer.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-850 text-gray-500'}`}
                                >
                                  {offer.active ? 'Active' : 'Disabled'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    )}

                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* CAB OWNER PERSONA (FLEET & PAYOUT VIEW) */}
        {/* ========================================================================= */}
        {specialView === 'none' && activeRole === 'cab_owner' && currentUser && (
          <CabOwnerDashboard currentUser={currentUser} />
        )}

        {/* ========================================================================= */}
        {/* STUDENT PERSONA (MOBILE / WEB COMMUTER VIEW) */}
        {/* ========================================================================= */}
        {specialView === 'none' && activeRole === 'student' && currentUser && (
          <StudentDashboard currentUser={currentUser} />
        )}

        {/* ========================================================================= */}
        {/* WORKING PROFESSIONAL PERSONA (FACULTY / IT CORRIDOR VIEW) */}
        {/* ========================================================================= */}
        {specialView === 'none' && activeRole === 'professional' && currentUser && (
          <ProfessionalDashboard currentUser={currentUser} />
        )}

      </main>

      {/* Modals & Protocol Overlays */}
      <SingleTripWorkflowModal
        isOpen={showSingleTripModal}
        onClose={() => setShowSingleTripModal(false)}
        userRole={activeRole}
        userName={currentUser?.name || 'Priya Sharma'}
      />

      <PackageTripsModal
        isOpen={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        userEmail={currentUser?.email || 'priya.sharma@gmail.com'}
      />

      <SosEmergencyModal
        isOpen={showSosModal}
        onClose={() => setShowSosModal(false)}
        userRole={activeRole}
      />

    </div>
  );
}
