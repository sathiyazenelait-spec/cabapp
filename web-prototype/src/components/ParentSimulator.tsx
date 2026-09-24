import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Shield,
  Phone,
  User,
  Users,
  AlertCircle,
  Calendar,
  Clock,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Send,
  ArrowRight,
  ArrowLeft,
  Car,
  Building2,
  Briefcase,
  Receipt,
  Download,
  Share2,
  FileCheck,
  CreditCard,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Zap,
  SlidersHorizontal,
  Home,
  Map,
  DollarSign,
  Plus,
  Compass,
  AlertOctagon,
  RefreshCw,
  Award,
  Check,
  Key,
  ShieldCheck,
  UserCheck,
  QrCode,
  Lock,
  XCircle,
  Copy,
  FileText
} from 'lucide-react';
import type { UserSession } from '../types/auth';
import { parentApi } from '../services/api';

interface ParentSimulatorProps {
  currentUser: UserSession;
}

export const ParentSimulator: React.FC<ParentSimulatorProps> = ({ currentUser }) => {
  // Current active screen ID (1 to 17)
  const [activeScreen, setActiveScreen] = useState<number>(1);
  const [searchCategory, setSearchCategory] = useState<'School' | 'College' | 'Work'>('School');
  const [pickupLocation, setPickupLocation] = useState('Kattur, Puducherry');
  const [dropLocation, setDropLocation] = useState('Green Valley School');
  const [selectedPlanType, setSelectedPlanType] = useState<'Weekly' | 'Monthly' | 'Quarterly'>('Monthly');
  const [subscriptionTab, setSubscriptionTab] = useState<'Active' | 'Upcoming' | 'Past'>('Active');
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const [liveLocation, setLiveLocation] = useState({ lat: 11.9360, lng: 79.8320, eta: 12 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [complaintText, setComplaintText] = useState('');
  const [showFaqModal, setShowFaqModal] = useState<string | null>(null);

  // New Feature 1: One-Tap Leave / Absenteeism Planner State
  const [leaveActive, setLeaveActive] = useState(false);
  const [leaveSlot, setLeaveSlot] = useState<'Morning Only' | 'Evening Only' | 'Full Day'>('Morning Only');
  const [leaveReason, setLeaveReason] = useState('Feeling Unwell / Fever');
  const [leaveDate, setLeaveDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveHistory, setLeaveHistory] = useState([
    { id: 'lh1', date: 'Yesterday', slot: 'Evening Only', reason: 'Doctor Appointment', status: 'Completed (Saved 8 min)', child: 'Arun Kumar' }
  ]);

  // New Feature 2: Secure Guardian Handover Pass State
  const [guardianPasses, setGuardianPasses] = useState([
    {
      id: 'gp1',
      name: 'Ramesh Sharma',
      relation: 'Uncle / Paternal Brother',
      phone: '+91 98409 88771',
      pin: '7429',
      expiresAt: 'Today, 06:00 PM',
      status: 'Active (Verified by Parent)',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    }
  ]);
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');
  const [newGuardianRelation, setNewGuardianRelation] = useState('Grandparent');

  // Tambaram 6:35 AM Pick-up & Weekly Subscription State
  const [tambaramRideActive, setTambaramRideActive] = useState(true);
  const [expiryAlertActive, setExpiryAlertActive] = useState(true);
  const [boardingOtpVerified, setBoardingOtpVerified] = useState(true);

  // New Feature 3: Emergency Vehicle Breakdown & 1-Tap Cab Swap Alert
  const [breakdownAlert, setBreakdownAlert] = useState<{
    active: boolean;
    oldVehicle: string;
    newVehicle: string;
    newDriver: string;
    reason: string;
    time: string;
  }>({
    active: false,
    oldVehicle: 'Van TN-XX-1234',
    newVehicle: 'Force Traveller TN-09-BK-8822',
    newDriver: 'Ravi Chandran (+91 98402 33445)',
    reason: 'Radiator Overheating Handled at Waypoint 2',
    time: '07:48 AM'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live Backend Data Synchronization
  useEffect(() => {
    const userEmail = currentUser?.email || 'priya.sharma@gmail.com';
    
    // Fetch live children profiles
    parentApi.getChildren(userEmail).then(children => {
      if (Array.isArray(children) && children.length > 0) {
        console.log('Live children profiles loaded from MySQL backend:', children.length);
      }
    }).catch(() => {});

    // Fetch live registered leaves
    parentApi.getLeaves(userEmail).then(leaves => {
      if (Array.isArray(leaves) && leaves.length > 0) {
        setLeaveHistory(leaves.map((l: any) => ({
          id: l.id ? String(l.id) : String(Date.now()),
          date: l.leave_date || l.date || 'Today',
          slot: l.slot || 'Morning Only',
          reason: l.reason || 'Medical / Fever',
          status: l.status || 'Active (Auto-Skipped)',
          child: l.child_name || l.childName || 'Ananya Sharma'
        })));
      }
    }).catch(() => {});

    // Fetch live guardian passes
    parentApi.getGuardianPasses(userEmail).then(passes => {
      if (Array.isArray(passes) && passes.length > 0) {
        setGuardianPasses(passes.map((p: any) => ({
          id: String(p.id || Date.now()),
          name: p.guardian_name || p.guardianName || 'Ramesh Sharma',
          relation: p.relation || 'Uncle',
          phone: p.phone || '+91 98409 88771',
          pin: p.pin || '7429',
          expiresAt: p.expires_at || p.expiresAt || 'Today, 06:00 PM',
          status: p.status || 'Active (Verified by Parent)',
          photoUrl: p.photo_url || p.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        })));
      }
    }).catch(() => {});

    // Fetch live breakdown alert
    parentApi.getBreakdownAlert().then(alert => {
      if (alert && alert.active) {
        setBreakdownAlert(alert as any);
      }
    }).catch(() => {});
  }, [currentUser]);

  // Simulate live car movement on tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.0004,
        lng: prev.lng + (Math.random() - 0.5) * 0.0004,
        eta: Math.max(1, prev.eta)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const screenTitles = [
    { id: 1, name: '1. Home Dashboard' },
    { id: 2, name: '2. Find Transport (Search)' },
    { id: 3, name: '3. Available Transport' },
    { id: 4, name: '4. Subscription Plan' },
    { id: 5, name: '5. Live Tracking' },
    { id: 6, name: '6. Subscription Management' },
    { id: 7, name: '7. Journey Timeline' },
    { id: 8, name: '8. Notifications' },
    { id: 9, name: '9. Payments' },
    { id: 10, name: '10. Complaints & Support' },
    { id: 11, name: '11. Profile / Settings' },
    { id: 12, name: '12. Emergency SOS' },
    { id: 13, name: '13. Route Details' },
    { id: 14, name: '14. Vehicle & Driver Info' },
    { id: 15, name: '15. Payment Invoice' },
    { id: 16, name: '16. Leave / Absenteeism Planner' },
    { id: 17, name: '17. Guardian Handover Pass' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Jump Buttons */}
      <div className="glass-card p-4 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 to-slate-900/60 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Parent Mobile Application • 15 Complete Screens
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  Live Dynamic Sync
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Pixel-perfect implementation of the 15-screen safe transit mobile experience.
              </p>
            </div>
          </div>
        </div>

        {/* Screen Picker Tabs */}
        <div className="flex flex-wrap gap-1.5 max-w-2xl">
          {screenTitles.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveScreen(s.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeScreen === s.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Device Simulator Frame */}
      <div className="flex justify-center">
        <div className="w-full max-w-[390px] h-[780px] bg-[#0c1222] border-[8px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative font-sans text-slate-100">
          
          {/* iOS / Mobile Status Bar */}
          <div className="bg-[#0c1222] px-6 pt-3 pb-2 flex justify-between items-center text-[11px] font-semibold text-slate-300 z-20">
            <span>9:41</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">5G</span>
              <div className="w-4 h-2.5 border border-slate-400 rounded-sm p-0.5">
                <div className="w-full h-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Main Mobile Screen View Area */}
          <div className="flex-1 overflow-y-auto bg-[#0a0f1d] relative pb-16">

            {/* ========================================================================= */}
            {/* SCREEN 1: HOME DASHBOARD */}
            {/* ========================================================================= */}
            {activeScreen === 1 && (
              <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-lg font-bold text-white">Hello, Priya 👋</h1>
                    <p className="text-[11px] text-indigo-300 font-medium">Safe Journeys. Brighter Futures.</p>
                  </div>
                  <button 
                    onClick={() => setActiveScreen(8)} 
                    className="p-2 bg-slate-800/80 rounded-full text-slate-300 relative"
                  >
                    <span className="w-2 h-2 bg-indigo-500 rounded-full absolute top-1 right-1" />
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>

                {/* Breakdown Alert Banner (if active) */}
                {breakdownAlert.active && (
                  <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-2xl p-3.5 space-y-2 animate-pulse shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        Vehicle Breakdown Handled
                      </span>
                      <span className="text-[9px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full font-mono font-bold">
                        {breakdownAlert.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-200 leading-snug">
                      <strong>{breakdownAlert.oldVehicle}</strong> encountered an issue ({breakdownAlert.reason}). Backup Cab <strong>{breakdownAlert.newVehicle}</strong> dispatched instantly!
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-amber-300/90 pt-1 border-t border-amber-500/20">
                      <span>New Driver: {breakdownAlert.newDriver}</span>
                      <button onClick={() => setActiveScreen(5)} className="underline font-bold text-white">Track Live →</button>
                    </div>
                  </div>
                )}

                {/* 1-Day Before Subscription Expiry Alert Warning */}
                {expiryAlertActive && (
                  <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/60 rounded-2xl p-3.5 space-y-2 animate-pulse shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        ⚠️ Subscription Expiring Tomorrow!
                      </span>
                      <span className="text-[9px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full font-mono font-bold">
                        1 DAY LEFT
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-200 leading-snug">
                      Your <strong>Weekly Commute Plan (Tambaram 6:35 AM Pick-up)</strong> for child <strong>Ananya Sharma</strong> will expire tomorrow. Auto-renewal scheduled or renew manually now.
                    </p>
                    <div className="flex gap-2 pt-1 border-t border-amber-500/20">
                      <button
                        onClick={() => {
                          showToast('🎉 Weekly Plan renewed successfully for ₹750!');
                          setExpiryAlertActive(false);
                        }}
                        className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
                      >
                        Renew Weekly Plan (₹750) ➔
                      </button>
                      <button 
                        onClick={() => setActiveScreen(6)} 
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                )}

                {/* Child Card: Ananya Sharma (Tambaram Case) */}
                <div className="bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/40 rounded-2xl p-3.5 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-sm">
                      AS
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Ananya Sharma (Daughter)</h3>
                      <p className="text-[11px] text-amber-300 font-semibold">Tambaram High School & College • Grade 8</p>
                      <p className="text-[10px] text-slate-400">Pickup: Tambaram Sanatorium (6:35 AM)</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    6:35 AM Active
                  </span>
                </div>

                {/* Driver Nearest Match & Dynamic OTP Boarding Verification Card */}
                <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-3.5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          Maruti Ertiga / Cab (TN-02-CD-5678)
                        </div>
                        <div className="text-[10px] text-slate-300">
                          Driver: Ravi Chandran • Nearest Match (0.4 km away in Tambaram)
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                      Driver Accepted
                    </span>
                  </div>

                  {/* Boarding OTP Verification Display */}
                  <div className="bg-slate-950/90 p-2.5 rounded-xl border border-amber-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Boarding Dynamic OTP:</span>
                        <span className="font-mono font-black text-amber-300 tracking-widest text-sm">4829</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-emerald-400 font-bold block">✓ OTP Matched & Accepted</span>
                      <span className="text-[9px] text-slate-400">Driver verified at 6:35 AM</span>
                    </div>
                  </div>

                  {/* Commute Pipeline Timeline Bar */}
                  <div className="pt-2">
                    <div className="relative flex justify-between items-center z-10">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px] ring-2 ring-emerald-400/30">
                          ✓
                        </div>
                        <span className="text-[9px] font-bold text-emerald-400 mt-1">
                          Tambaram Pick-up
                        </span>
                        <span className="text-[8px] text-slate-400">6:35 AM</span>
                      </div>

                      <div className="flex-1 h-0.5 bg-amber-500 mx-2" />

                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px] ring-4 ring-amber-500/30 animate-pulse">
                          ●
                        </div>
                        <span className="text-[9px] font-bold text-amber-300 mt-1">GST Road</span>
                        <span className="text-[8px] text-slate-400">6:45 AM</span>
                      </div>

                      <div className="flex-1 h-0.5 bg-slate-800 mx-2" />

                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[9px]">
                          🏫
                        </div>
                        <span className="text-[9px] font-medium text-slate-400 mt-1">School Campus</span>
                        <span className="text-[8px] text-slate-400">7:05 AM</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveScreen(5)}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Track Cab on Original Satellite Map ➔
                  </button>
                </div>

                {/* Feature Spotlight: Leave & Guardian Passes */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setActiveScreen(16)}
                    className="p-3 bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 hover:border-amber-500/60 rounded-2xl flex flex-col items-start gap-1 text-left transition group shadow-md"
                  >
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-extrabold uppercase tracking-wide">Leave Planner</span>
                    </div>
                    <span className="text-xs font-bold text-white mt-1">Mark Child Leave</span>
                    <span className="text-[10px] text-slate-400">Auto-skips pickup stop</span>
                  </button>

                  <button
                    onClick={() => setActiveScreen(17)}
                    className="p-3 bg-gradient-to-br from-sky-950/40 to-slate-900 border border-sky-500/30 hover:border-sky-500/60 rounded-2xl flex flex-col items-start gap-1 text-left transition group shadow-md"
                  >
                    <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 group-hover:scale-105 transition-transform flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-extrabold uppercase tracking-wide">Guardian Pass</span>
                    </div>
                    <span className="text-xs font-bold text-white mt-1">Handover Pass (PIN)</span>
                    <span className="text-[10px] text-slate-400">Secure pickup authorization</span>
                  </button>
                </div>

                {/* Quick Action Grid (6 items) */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 mb-2.5">Standard Modules</h3>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      onClick={() => setActiveScreen(2)}
                      className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 rounded-2xl flex flex-col items-center text-center gap-1.5 group transition-all"
                    >
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                        <Search className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-200">Find Transport</span>
                    </button>

                    <button
                      onClick={() => setActiveScreen(6)}
                      className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 rounded-2xl flex flex-col items-center text-center gap-1.5 group transition-all"
                    >
                      <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-200">My Subscriptions</span>
                    </button>

                    <button
                      onClick={() => setActiveScreen(5)}
                      className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 rounded-2xl flex flex-col items-center text-center gap-1.5 group transition-all"
                    >
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                        <Navigation className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-200">Live Tracking</span>
                    </button>

                    <button
                      onClick={() => setActiveScreen(9)}
                      className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 rounded-2xl flex flex-col items-center text-center gap-1.5 group transition-all"
                    >
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-200">Payments</span>
                    </button>

                    <button
                      onClick={() => setActiveScreen(10)}
                      className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 rounded-2xl flex flex-col items-center text-center gap-1.5 group transition-all"
                    >
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-200">Complaints</span>
                    </button>

                    <button
                      onClick={() => setActiveScreen(12)}
                      className="p-3 bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 rounded-2xl flex flex-col items-center text-center gap-1.5 group transition-all"
                    >
                      <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
                        <Shield className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-red-400">Emergency SOS</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 2: FIND TRANSPORT (SEARCH) */}
            {/* ========================================================================= */}
            {activeScreen === 2 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(1)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">Find Transport</h2>
                </div>

                {/* Category Picker (School / College / Work) */}
                <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
                  {(['School', 'College', 'Work'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSearchCategory(cat)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        searchCategory === cat
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Form Fields */}
                <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Pickup Location</label>
                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={e => setPickupLocation(e.target.value)}
                        className="bg-transparent text-xs text-white flex-1 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Drop Location (Daughter School)</label>
                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <input
                        type="text"
                        value={dropLocation}
                        onChange={e => setDropLocation(e.target.value)}
                        className="bg-transparent text-xs text-white flex-1 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Pickup & Arrival Window</label>
                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="text-xs text-slate-200 font-bold">10:10 PM Night Pick-up Case</span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold ml-auto">SPECIAL SHIFT</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveScreen(3)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    Search Transport (Thoraipakkam & OMR)
                  </button>
                </div>

                {/* Recent Searches */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 mb-2">Popular & Recent Searches</h3>
                  <div className="space-y-2">
                    <div 
                      onClick={() => {
                        setPickupLocation('Thoraipakkam Tollgate / Anand Nagar');
                        setDropLocation('Oakridge School, Thoraipakkam OMR');
                        setActiveScreen(3);
                      }}
                      className="p-3 bg-gradient-to-r from-sky-950/40 to-slate-900 border border-sky-500/40 rounded-xl flex items-center justify-between cursor-pointer hover:border-sky-400 shadow-md"
                    >
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Thoraipakkam → Oakridge School</span>
                          <span className="text-[8px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded font-bold">THORAIPAKKAM</span>
                        </div>
                        <div className="text-[10px] text-sky-300">Daughter School • 10:10 PM Night Pick-up Case • Weekly Plan</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-sky-400" />
                    </div>

                    <div 
                      onClick={() => setActiveScreen(3)}
                      className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-indigo-500/40"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">Mehta Nagar → ABC Matriculation School</div>
                        <div className="text-[10px] text-slate-400">School • 08:00 AM Morning Shift</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 3: AVAILABLE TRANSPORT (COMPARE & CHOOSE) */}
            {/* ========================================================================= */}
            {activeScreen === 3 && (
              <div className="p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveScreen(2)} className="p-1 text-slate-400 hover:text-white">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-base font-bold text-white">Available Transport</h2>
                  </div>
                  <span className="text-[11px] text-amber-400 font-semibold">3 routes found</span>
                </div>

                {/* Card 1: TAMBARAM 6:35 AM ROUTE (PRIMARY) */}
                <div className="bg-gradient-to-b from-amber-950/90 to-slate-900 border-2 border-amber-500/60 rounded-2xl p-3.5 space-y-3 shadow-xl relative">
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-[9px] rounded-full uppercase tracking-wider shadow-md">
                    🌟 Featured Tambaram Commute
                  </span>

                  <div className="flex justify-between items-start pt-1">
                    <div className="flex gap-2.5">
                      <div className="w-12 h-12 bg-amber-900/60 rounded-xl flex items-center justify-center text-amber-300 font-bold text-xs border border-amber-500/30">
                        CAB
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white">Maruti Ertiga / AC Cab (TN-02-CD-5678)</h3>
                        <p className="text-[10px] text-slate-300">6 Seater AC • GPS Live • Emergency SOS</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] font-bold text-slate-200">4.95 (62 reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-400">Ravi Chandran</span>
                      <div className="text-[9px] text-emerald-400 flex items-center gap-0.5 justify-end">
                        <CheckCircle className="w-2.5 h-2.5" /> Verified Driver
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-amber-900/40 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Tambaram Sanatorium (GST Rd) → Tambaram High School & Campus</span>
                    </div>
                    <div className="text-amber-300 text-[9.5px] flex items-center gap-2">
                      <span>Via: GST Road, Hindu Colony</span>
                      <span className="text-amber-200 font-bold bg-amber-500/20 px-1.5 py-0.2 rounded">⏰ 6:35 AM Morning Shift</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                    <div>
                      <span className="text-sm font-extrabold text-white">₹750</span>
                      <span className="text-[10px] text-slate-400"> / week</span>
                      <div className="text-[9px] text-emerald-400 font-bold">3 seats left • Weekly Plan Available</div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPlanType('Weekly');
                        setActiveScreen(4);
                      }}
                      className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-amber-500/30"
                    >
                      Select Plan
                    </button>
                  </div>
                </div>

                {/* Recommended Card: THORAIPAKKAM ROUTE */}
                <div className="bg-gradient-to-b from-sky-950/90 to-slate-900 border-2 border-sky-500/60 rounded-2xl p-3.5 space-y-3 shadow-xl relative">
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-[9px] rounded-full uppercase tracking-wider shadow-md">
                    🌟 Recommended for Thoraipakkam
                  </span>

                  <div className="flex justify-between items-start pt-1">
                    <div className="flex gap-2.5">
                      <div className="w-12 h-12 bg-sky-900/60 rounded-xl flex items-center justify-center text-sky-300 font-bold text-xs border border-sky-500/30">
                        CAB
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white">Force Traveller TN-01-AB-1234</h3>
                        <p className="text-[10px] text-slate-300">12 Seater • AC • CCTV Monitored</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] font-bold text-slate-200">4.9 (48 reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-sky-400">Kumar Swamy</span>
                      <div className="text-[9px] text-emerald-400 flex items-center gap-0.5 justify-end">
                        <CheckCircle className="w-2.5 h-2.5" /> Verified Driver
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-sky-900/40 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span>Thoraipakkam Radial Rd → Oakridge School, Thoraipakkam</span>
                    </div>
                    <div className="text-sky-300 text-[9.5px] flex items-center gap-2">
                      <span>Via: Thoraipakkam Tollgate, Anand Nagar OMR</span>
                      <span className="text-amber-300 font-bold">⏰ 10:10 PM Night Pick-up</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                    <div>
                      <span className="text-sm font-extrabold text-white">₹750</span>
                      <span className="text-[10px] text-slate-400"> / week</span>
                      <div className="text-[9px] text-emerald-400 font-bold">4 seats left • Weekly Plan Available</div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPlanType('Weekly');
                        setActiveScreen(4);
                      }}
                      className="px-4 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/30"
                    >
                      Select Plan
                    </button>
                  </div>
                </div>

                {/* Card 2: Standard Route */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2.5">
                      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs">
                        VAN
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white">Van TN-09-BK-8822</h3>
                        <p className="text-[10px] text-slate-400">7 Seater • AC</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] font-bold text-slate-200">4.7 (24)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-300">Ravi Chandran</span>
                      <div className="text-[9px] text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle className="w-2.5 h-2.5" /> Verified Driver
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                    <div>
                      <span className="text-sm font-extrabold text-white">₹800</span>
                      <span className="text-[10px] text-slate-400"> / week</span>
                      <div className="text-[9px] text-amber-400 font-bold">2 seats left</div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPlanType('Weekly');
                        setActiveScreen(4);
                      }}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
                    >
                      Select Plan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 4: SUBSCRIPTION PLAN */}
            {/* ========================================================================= */}
            {activeScreen === 4 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(3)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">Subscription Plan</h2>
                </div>

                {/* Mini Vehicle Header */}
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-sky-900/50 rounded-xl flex items-center justify-center text-xs text-sky-300 font-bold">
                      CAB
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Force Traveller (TN-01-AB-1234)</div>
                      <div className="text-[10px] text-slate-300">Driver: Kumar Swamy • Thoraipakkam Route</div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                    Active Route
                  </span>
                </div>

                {/* Select Plan Switcher */}
                <div>
                  <h3 className="text-xs font-bold text-slate-300 mb-2">Select Duration Plan</h3>
                  <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
                    {(['Weekly', 'Monthly', 'Quarterly'] as const).map(plan => (
                      <button
                        key={plan}
                        onClick={() => setSelectedPlanType(plan)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          selectedPlanType === plan
                            ? 'bg-sky-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {plan}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plan Highlights Card */}
                <div className="bg-gradient-to-b from-sky-950/90 to-slate-900 p-4 rounded-2xl border border-sky-500/40 space-y-3 relative shadow-xl">
                  <span className="absolute top-4 right-4 px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold text-[9px] rounded-full border border-amber-500/30">
                    {selectedPlanType === 'Weekly' ? 'Weekly Active' : 'Flexible Plan'}
                  </span>

                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {selectedPlanType === 'Weekly' ? 'Weekly Daughter Commute Plan' : `${selectedPlanType} Plan`}
                    </h3>
                    <div className="text-xl font-extrabold text-sky-400 mt-1">
                      {selectedPlanType === 'Weekly' ? '₹750' : selectedPlanType === 'Monthly' ? '₹3,000' : '₹8,200'}
                      <span className="text-xs font-normal text-slate-400"> / {selectedPlanType.toLowerCase()}</span>
                    </div>
                  </div>

                  {/* Pick up Timing Callout */}
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-sky-800/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>10:10 PM Night Pick-up & Arrival Case</span>
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Route: Thoraipakkam Tollgate ↔ Oakridge School, Thoraipakkam
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>5 days per week (Mon - Fri) pickup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Dedicated driver: Kumar Swamy (Verified)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Real-time GPS tracking & 0.5-mile arrival alert</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Emergency SOS & Guardian Handover PIN Protection</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    showToast('🎉 Weekly Subscription Confirmed for Daughter! 10:10 PM Pickup Active.');
                    setActiveScreen(15);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/40 transition-all"
                >
                  Register & Subscribe ({selectedPlanType} - ₹{selectedPlanType === 'Weekly' ? '750' : '3,000'})
                </button>

                <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3 text-slate-500" />
                  Secure payment via Razorpay, UPI, & Parent Wallet
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 5: LIVE TRACKING (MAP VIEW) */}
            {/* ========================================================================= */}
            {activeScreen === 5 && (
              <div className="h-full flex flex-col">
                {/* Top Vehicle / ETA Card */}
                <div className="p-3 bg-slate-900/95 border-b border-slate-800 z-10 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setActiveScreen(1)} className="p-1 text-slate-400 hover:text-white">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
                          {breakdownAlert.active ? breakdownAlert.newVehicle : 'Force Traveller TN-01-AB-1234'}
                          {breakdownAlert.active ? (
                            <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-500/30">
                              Backup Cab Active
                            </span>
                          ) : (
                            <span className="text-[8px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-bold border border-sky-500/30">
                              Thoraipakkam 10:10 PM Ride
                            </span>
                          )}
                        </h2>
                        <p className="text-[10px] text-slate-400">
                          {breakdownAlert.active ? 'Ravi Chandran (+91 98402 33445)' : 'Kumar Swamy (+91 98401 23456)'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">
                      Live Tracking
                    </span>
                  </div>

                  {/* Route & ETA Banner */}
                  <div className="flex justify-between items-center text-[11px] bg-sky-950/40 px-3 py-1.5 rounded-xl border border-sky-800/40">
                    <span className="font-bold text-sky-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      ETA 4 min (Speed 38 km/h)
                    </span>
                    <span className="text-amber-300 font-bold">Pickup: 10:10 PM Night Case</span>
                  </div>

                  {/* Guardian Pass Active Pill (if available) */}
                  {guardianPasses.length > 0 && (
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1 flex justify-between items-center text-[10px]">
                      <span className="text-slate-300 flex items-center gap-1">
                        <Key className="w-3 h-3 text-sky-400" />
                        Guardian Handover PIN: <strong className="font-mono text-amber-300 tracking-widest">{guardianPasses[0].pin}</strong>
                      </span>
                      <button onClick={() => setActiveScreen(17)} className="text-[9px] text-sky-400 font-bold underline">
                        View Pass
                      </button>
                    </div>
                  )}
                </div>

                {/* Interactive Simulated Vector Map */}
                <div className="flex-1 bg-[#070b13] relative overflow-hidden flex items-center justify-center">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

                  {/* SVG Route Path */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 300">
                    <path
                      d="M 50 60 Q 130 110 170 170 T 270 230"
                      fill="none"
                      stroke={breakdownAlert.active ? '#f59e0b' : '#38bdf8'}
                      strokeWidth="5"
                      strokeDasharray="6,4"
                    />
                  </svg>

                  {/* Origin Marker (Thoraipakkam Tollgate) */}
                  <div className="absolute top-[50px] left-[35px] flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[9px] shadow-lg">
                      📍
                    </div>
                    <span className="text-[9px] font-bold text-white bg-slate-900/90 px-1.5 rounded mt-0.5 border border-slate-700 shadow">
                      Thoraipakkam Tollgate
                    </span>
                  </div>

                  {/* Waypoint Marker */}
                  <div className="absolute top-[155px] right-[115px] flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center font-bold text-[8px]">
                      ●
                    </div>
                    <span className="text-[8px] font-medium text-sky-200 bg-slate-900/80 px-1 rounded mt-0.5">
                      OMR Radial Rd
                    </span>
                  </div>

                  {/* Destination Marker (Oakridge School) */}
                  <div className="absolute bottom-[40px] right-[35px] flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shadow-lg ring-2 ring-indigo-400">
                      🏫
                    </div>
                    <span className="text-[9px] font-bold text-white bg-slate-900/90 px-1.5 rounded mt-0.5 border border-slate-700 shadow">
                      Oakridge School, Thoraipakkam
                    </span>
                  </div>

                  {/* Moving Live Cab Radar Marker */}
                  <div className="absolute top-[115px] left-[140px] flex flex-col items-center animate-bounce">
                    <div className="relative">
                      <div className={`w-9 h-9 rounded-full ${breakdownAlert.active ? 'bg-amber-500/30' : 'bg-sky-500/30'} animate-ping absolute inset-0`} />
                      <div className={`w-9 h-9 rounded-full ${breakdownAlert.active ? 'bg-amber-600' : 'bg-sky-600'} border-2 border-white flex items-center justify-center text-white shadow-xl text-xs`}>
                        🚖
                      </div>
                    </div>
                    <span className="text-[8px] font-extrabold bg-slate-900/95 text-sky-300 border border-sky-500 px-2 py-0.5 rounded shadow mt-1">
                      TN-01-AB-1234 (38 km/h)
                    </span>
                  </div>
                </div>

                {/* Bottom Floating Child & Action Controls */}
                <div className="p-3 bg-slate-900/95 border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-sky-400/20 text-sky-300 flex items-center justify-center font-bold text-xs">
                        AS
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Ananya Sharma (Daughter)</h4>
                        <p className="text-[9px] text-slate-400">Oakridge School, Thoraipakkam • Weekly Plan Active</p>
                      </div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-full">
                      On Board (10:10 PM)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveScreen(8)}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold rounded-xl border border-sky-500/30 flex items-center justify-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Journey Timeline
                    </button>
                    <button
                      onClick={() => setActiveScreen(17)}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 flex items-center justify-center gap-1"
                    >
                      <Key className="w-3.5 h-3.5" /> Guardian Pass (PIN)
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => showToast('📍 Live Thoraipakkam GPS tracking link copied!')}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border border-slate-700"
                    >
                      <Share2 className="w-3 h-3 text-sky-400" /> Share Location
                    </button>
                    <button
                      onClick={() => showToast('📞 Dialing Kumar Swamy: +91 98401 23456')}
                      className="py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-md shadow-sky-600/30"
                    >
                      <Phone className="w-3 h-3" /> Call Driver
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 6: SUBSCRIPTION MANAGEMENT */}
            {/* ========================================================================= */}
            {activeScreen === 6 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(1)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">My Subscriptions</h2>
                </div>

                {/* Child Mini Card */}
                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center">
                    AK
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Arun Kumar</h3>
                    <p className="text-[10px] text-slate-400">Green Valley School • Class 3</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
                  {(['Active', 'Upcoming', 'Past'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setSubscriptionTab(tab)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        subscriptionTab === tab
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* 1-Day Before Subscription Expiry Alert Warning */}
                {expiryAlertActive && (
                  <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/60 rounded-2xl p-3.5 space-y-2 animate-pulse shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        ⚠️ Subscription Expiring in 24 Hours!
                      </span>
                      <span className="text-[9px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full font-mono font-bold">
                        1 DAY LEFT
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-200 leading-snug">
                      Your <strong>Weekly Commute Plan (Tambaram 6:35 AM Pick-up)</strong> for child <strong>Ananya Sharma</strong> will expire tomorrow. Auto-renewal scheduled or renew manually now.
                    </p>
                    <button
                      onClick={() => {
                        showToast('🎉 Weekly Plan renewed successfully for ₹750!');
                        setExpiryAlertActive(false);
                      }}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
                    >
                      Renew Weekly Plan (₹750) ➔
                    </button>
                  </div>
                )}

                {/* Active Plan Card: Tambaram 6:35 AM Weekly Plan */}
                <div className="bg-gradient-to-br from-amber-950/90 to-slate-900 p-4 rounded-2xl border-2 border-amber-500/50 space-y-3 shadow-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                        Tambaram 6:35 AM Morning Shift
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1">Weekly Plan (Child: Ananya Sharma)</h3>
                      <div className="text-base font-extrabold text-amber-400">₹750 / week</div>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-full border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-200/90">
                    Route: Tambaram Sanatorium (6:35 AM) ➔ Tambaram High School • Vehicle: TN-02-CD-5678 (Ravi Chandran)
                  </p>
                  <p className="text-[10px] text-slate-400">Expires: Tomorrow, 6:35 AM (1 Day Remaining)</p>

                  <div className="flex gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setActiveScreen(15)}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700"
                    >
                      View Invoice
                    </button>
                    <button
                      onClick={() => {
                        showToast('🎉 Weekly Plan renewed successfully for ₹750!');
                        setExpiryAlertActive(false);
                      }}
                      className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-amber-500/30"
                    >
                      Renew (₹750)
                    </button>
                  </div>
                </div>

                {/* Payment History List */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-slate-400">Payment History</h3>
                    <button onClick={() => setActiveScreen(9)} className="text-[10px] text-indigo-400 font-bold">
                      View All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { date: '5 Mar 2025', amt: '₹3,000' },
                      { date: '5 Feb 2025', amt: '₹3,000' },
                      { date: '5 Jan 2025', amt: '₹3,000' },
                    ].map((tx, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveScreen(15)}
                        className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-700"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{tx.date}</div>
                          <div className="text-[10px] text-slate-400">Subscription Payment</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-white">{tx.amt}</div>
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            Paid
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 7: LIVE TRACKING - JOURNEY TIMELINE */}
            {/* ========================================================================= */}
            {activeScreen === 7 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(5)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">Journey Timeline</h2>
                </div>

                {/* Map Mini Banner */}
                <div 
                  onClick={() => setActiveScreen(5)} 
                  className="h-28 bg-slate-900 rounded-2xl border border-indigo-500/30 overflow-hidden relative cursor-pointer flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />
                  <div className="text-center z-10">
                    <Navigation className="w-6 h-6 text-indigo-400 mx-auto animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-300 mt-1 block">Tap to expand Live Map</span>
                  </div>
                </div>

                {/* Timeline Nodes */}
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white">Thoraipakkam 10:10 PM Night Commute</h3>
                    <span className="text-[9px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-bold">Weekly Active</span>
                  </div>

                  <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-sky-600/40">
                    {/* Node 1 */}
                    <div className="flex items-start gap-3 relative">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px] z-10 ring-4 ring-emerald-500/20">
                        ✓
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-400">10:05 PM • Cab Arrived at Pickup</div>
                        <p className="text-[10px] text-slate-300">Thoraipakkam Tollgate (Anand Nagar OMR)</p>
                      </div>
                    </div>

                    {/* Node 2 */}
                    <div className="flex items-start gap-3 relative">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px] z-10 ring-4 ring-emerald-500/20">
                        ✓
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-300">10:10 PM • Daughter Boarded Safely</div>
                        <p className="text-[10px] text-slate-300">Ananya Sharma (Verified with Driver Kumar Swamy)</p>
                      </div>
                    </div>

                    {/* Node 3 */}
                    <div className="flex items-start gap-3 relative">
                      <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px] z-10 ring-4 ring-sky-600/30 animate-pulse">
                        ●
                      </div>
                      <div>
                        <div className="text-xs font-bold text-sky-300">10:18 PM • On Route (OMR Radial Rd)</div>
                        <p className="text-[10px] text-slate-400">Speed: 38 km/h • Route Match: 99%</p>
                      </div>
                    </div>

                    {/* Node 4 */}
                    <div className="flex items-start gap-3 relative">
                      <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px] z-10">
                        ⏳
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-400">10:25 PM • Expected Drop-off</div>
                        <p className="text-[10px] text-slate-500">Oakridge School, Thoraipakkam Gate</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => showToast('📞 Calling Kumar: +91 98401 23456')}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" /> Call Driver
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 8: NOTIFICATIONS */}
            {/* ========================================================================= */}
            {activeScreen === 8 && (
              <div className="p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveScreen(1)} className="p-1 text-slate-400 hover:text-white">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-base font-bold text-white">Notifications</h2>
                  </div>
                  <button onClick={() => showToast('All notifications marked as read')} className="text-[10px] text-indigo-400 font-bold">
                    Clear All
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-900/90 border-l-4 border-emerald-500 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">Your child has boarded the vehicle</span>
                      <span className="text-[9px] text-slate-400">7:32 AM</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Arun boarded Van TN-XX-1234 safely.</p>
                  </div>

                  <div className="p-3 bg-slate-900/90 border-l-4 border-indigo-500 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">Vehicle is 12 minutes away</span>
                      <span className="text-[9px] text-slate-400">7:45 AM</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Van TN-XX-1234 will reach at 7:50 AM.</p>
                  </div>

                  <div className="p-3 bg-slate-900/90 border-l-4 border-emerald-500 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">Your child has reached school</span>
                      <span className="text-[9px] text-slate-400">8:10 AM</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Arun safely checked-in at Green Valley School.</p>
                  </div>

                  <div className="p-3 bg-slate-900/90 border-l-4 border-red-500 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">Subscription renewal reminder</span>
                      <span className="text-[9px] text-slate-400">Yesterday</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Your monthly plan expires on 5 Apr 2025.</p>
                  </div>

                  <div className="p-3 bg-slate-900/90 border-l-4 border-amber-500 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">New transport offer</span>
                      <span className="text-[9px] text-slate-400">Yesterday</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Special 10% discount on sibling registrations.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 9: PAYMENTS */}
            {/* ========================================================================= */}
            {activeScreen === 9 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(1)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">Payments</h2>
                </div>

                {/* Total Due Card */}
                <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 p-4 rounded-2xl border border-indigo-500/40 space-y-3 shadow-xl">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Total Due</span>
                    <div className="text-2xl font-black text-white mt-0.5">₹3,000</div>
                    <p className="text-[10px] text-slate-400 mt-1">Due on 5 Apr 2025</p>
                  </div>

                  <button
                    onClick={() => {
                      showToast('💳 Razorpay Checkout Complete! Paid ₹3,000');
                      setActiveScreen(15);
                    }}
                    className="w-full py-2 bg-white hover:bg-slate-100 text-indigo-950 text-xs font-extrabold rounded-xl shadow-lg"
                  >
                    Pay Now
                  </button>
                </div>

                {/* Recent Transactions */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-slate-400">Recent Transactions</h3>
                    <button className="text-[10px] text-indigo-400 font-bold">View All</button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { date: '5 Mar 2025', id: 'INV-001234', amt: '₹3,000' },
                      { date: '5 Feb 2025', id: 'INV-001092', amt: '₹3,000' },
                      { date: '5 Jan 2025', id: 'INV-000841', amt: '₹3,000' },
                      { date: '5 Dec 2024', id: 'INV-000620', amt: '₹3,000' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveScreen(15)}
                        className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                            <Receipt className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{item.date}</div>
                            <div className="text-[9px] text-slate-400">{item.id}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-white">{item.amt}</div>
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            Paid
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 10: COMPLAINTS & SUPPORT */}
            {/* ========================================================================= */}
            {activeScreen === 10 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(1)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">Complaints & Support</h2>
                </div>

                {/* Category Grid */}
                <div>
                  <h3 className="text-xs font-bold text-slate-300 mb-2">Raise a Complaint</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Driver Issue', icon: User },
                      { name: 'Late Pickup', icon: Clock },
                      { name: 'Vehicle Issue', icon: Car },
                      { name: 'Route Issue', icon: MapPin },
                      { name: 'Safety Issue', icon: Shield },
                      { name: 'Other', icon: SlidersHorizontal },
                    ].map(c => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setSelectedComplaint(c.name);
                          showToast(`Category selected: ${c.name}`);
                        }}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                          selectedComplaint === c.name
                            ? 'bg-indigo-600/30 border-indigo-500 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <c.icon className="w-4 h-4 text-indigo-400" />
                        <span className="text-[9px] font-bold">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Complaint Input & Submit */}
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    placeholder="Describe your issue in detail..."
                    value={complaintText}
                    onChange={e => setComplaintText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => {
                      if (!complaintText.trim()) {
                        showToast('Please enter complaint details');
                        return;
                      }
                      showToast('✅ Complaint ticket #CP-8921 submitted!');
                      setComplaintText('');
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Submit Ticket
                  </button>
                </div>

                {/* Need Help Banner */}
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-white">Need Help?</div>
                  <p className="text-[10px] text-slate-400">Our safety and support team is available 24/7.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => showToast('📞 Dialing support hotline: 1800-SAFE-CAB')}
                      className="flex-1 py-1.5 bg-slate-800 text-indigo-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1 border border-slate-700"
                    >
                      <Phone className="w-3 h-3" /> Call Us
                    </button>
                    <button
                      onClick={() => showToast('💬 Live agent connected in chat!')}
                      className="flex-1 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-md"
                    >
                      <MessageSquare className="w-3 h-3" /> Chat
                    </button>
                  </div>
                </div>

                {/* FAQs */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400">FAQs</h3>
                  {[
                    'How to change pick-up location?',
                    'How to cancel subscription?'
                  ].map((faq, i) => (
                    <div
                      key={i}
                      onClick={() => setShowFaqModal(faq)}
                      className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-[10px] font-semibold text-slate-300 flex justify-between items-center cursor-pointer hover:border-slate-700"
                    >
                      <span>{faq}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 11: PROFILE & SETTINGS */}
            {/* ========================================================================= */}
            {activeScreen === 11 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(1)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">My Profile</h2>
                </div>

                {/* Profile Card */}
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                      PS
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">Priya Sharma</h3>
                      <p className="text-[10px] text-slate-400">Parent of Arun Kumar (Class 3)</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => showToast('Profile editor opened')}
                    className="text-[10px] text-indigo-400 font-bold px-2 py-1 bg-indigo-500/10 rounded-lg"
                  >
                    Edit
                  </button>
                </div>

                {/* Settings Menu List */}
                <div className="bg-slate-900/80 rounded-2xl border border-slate-800 divide-y divide-slate-800/60">
                  {[
                    { title: 'Child Information', icon: User, action: () => setActiveScreen(1) },
                    { title: 'Emergency Contacts', icon: Phone, action: () => showToast('Emergency Contacts: +91 98401 23456 (Dad)') },
                    { title: 'Transport Details', icon: Car, action: () => setActiveScreen(13) },
                    { title: 'Notification Settings', icon: AlertCircle, action: () => showToast('Push notifications enabled') },
                    { title: 'Help & Support', icon: HelpCircle, action: () => setActiveScreen(10) },
                    { title: 'About App', icon: Info, action: () => showToast('SafePassage AI v2.4 (Enterprise Edition)') },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={item.action}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-800/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-medium text-slate-200">{item.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 12: EMERGENCY SOS */}
            {/* ========================================================================= */}
            {activeScreen === 12 && (
              <div className="h-full bg-gradient-to-b from-red-900 via-red-950 to-slate-950 p-6 flex flex-col items-center justify-between text-center relative">
                <div className="w-full flex justify-start">
                  <button onClick={() => setActiveScreen(1)} className="p-1 text-slate-300 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full bg-red-500/20 animate-ping absolute inset-0" />
                    <div className="w-28 h-28 rounded-full bg-red-600 border-4 border-white flex items-center justify-center text-white shadow-2xl shadow-red-600/60">
                      <Shield className="w-14 h-14" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-white tracking-wide">EMERGENCY SOS</h2>
                    <p className="text-xs text-red-200/80 mt-2 max-w-xs leading-relaxed">
                      In case of an emergency, press the SOS button. Your location will be shared immediately with your emergency contacts and the school control center.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSosActive(true);
                      showToast('🚨 EMERGENCY SOS DISPATCHED TO SCHOOL DISPATCH & POLICE!');
                    }}
                    className="w-full py-3.5 bg-white hover:bg-slate-100 text-red-700 text-sm font-black rounded-2xl shadow-2xl shadow-red-600/50 flex items-center justify-center gap-2 uppercase tracking-wider active:scale-95 transition-all"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-600" /> Send SOS
                  </button>
                </div>

                <div className="w-full space-y-2">
                  <p className="text-[10px] text-red-300/70">You can also call the driver directly</p>
                  <button
                    onClick={() => showToast('📞 Dialing driver: +91 98401 23456')}
                    className="w-full py-2.5 bg-red-950/80 border border-red-500/40 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-400" /> Call Driver
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 13: ROUTE DETAILS */}
            {/* ========================================================================= */}
            {activeScreen === 13 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(5)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">Route Details</h2>
                </div>

                {/* Route Header Card */}
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                  <h3 className="text-xs font-bold text-white">Kattur → Green Valley School</h3>
                  <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-800">
                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-[9px] text-slate-400 block">Total Distance</span>
                      <span className="text-xs font-bold text-white">12 km</span>
                    </div>
                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-[9px] text-slate-400 block">Estimated Time</span>
                      <span className="text-xs font-bold text-indigo-400">45 min</span>
                    </div>
                  </div>
                </div>

                {/* Stops Timeline */}
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300">Stops Schedule</h4>

                  <div className="space-y-3 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-600/40">
                    {[
                      { time: '7:30 AM', name: 'Kattur (Pickup)', done: true },
                      { time: '7:45 AM', name: 'Lawspet (Pickup)', done: true },
                      { time: '8:05 AM', name: 'Manaveli (Pickup)', done: false },
                      { time: '8:10 AM', name: 'Green Valley School (Drop)', done: false },
                    ].map((stop, idx) => (
                      <div key={idx} className="flex items-center gap-3 relative">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] z-10 ${
                            stop.done
                              ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-500/20'
                              : 'bg-slate-800 border border-slate-700 text-slate-400'
                          }`}
                        >
                          {stop.done ? '✓' : '●'}
                        </div>
                        <div className="flex-1 flex justify-between items-center text-xs">
                          <span className={stop.done ? 'font-bold text-white' : 'text-slate-400'}>
                            {stop.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{stop.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveScreen(5)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  View on Map
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 14: VEHICLE & DRIVER INFO */}
            {/* ========================================================================= */}
            {activeScreen === 14 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(4)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">Vehicle & Driver Info</h2>
                </div>

                {/* Vehicle Specs */}
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-900/60 rounded-xl flex items-center justify-center text-indigo-300 font-bold text-xs">
                      VAN
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">Van TN-XX-1234</h3>
                      <p className="text-[10px] text-slate-400">7 SEATER • AC</p>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-full">
                    Verified ✅
                  </span>
                </div>

                {/* Driver Profile */}
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm">
                      👨‍✈️
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">Kumar</h3>
                      <p className="text-[10px] text-slate-400">⭐ 4.8 (32 Reviews)</p>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-full">
                    Verified
                  </span>
                </div>

                {/* Documents Grid */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 mb-2">Verified Documents</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Driving Licence', icon: FileCheck },
                      { name: 'Vehicle RC', icon: FileCheck },
                      { name: 'Insurance', icon: Shield },
                      { name: 'Fitness Certificate', icon: Award },
                    ].map(doc => (
                      <div
                        key={doc.name}
                        className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2"
                      >
                        <doc.icon className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-bold text-slate-200">{doc.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => showToast('📞 Calling Kumar: +91 98401 23456')}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Contact Driver
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 15: PAYMENT INVOICE */}
            {/* ========================================================================= */}
            {activeScreen === 15 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(9)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">Payment Invoice</h2>
                </div>

                {/* Invoice Card */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-2xl relative">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-xs font-black text-white">Green Valley School</h3>
                      <p className="text-[10px] text-slate-400">Monthly Transport Subscription</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-slate-400 block">Invoice #INV-001234</span>
                      <span className="text-[9px] text-slate-400">5 Mar 2025</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Child Name</span>
                      <span className="font-bold text-white">Arun Kumar</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Route</span>
                      <span className="font-bold text-white">Kattur → Green Valley</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Vehicle</span>
                      <span className="font-bold text-white">Van TN-XX-1234</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Plan</span>
                      <span className="font-bold text-white">Monthly</span>
                    </div>
                    <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-2">
                      <span className="text-slate-400 font-bold">Amount Paid</span>
                      <span className="font-extrabold text-emerald-400 text-sm">₹3,000</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400 font-bold">Status</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        PAID ✅
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => showToast('📥 PDF Invoice downloaded to device storage!')}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" /> Download
                  </button>
                  <button
                    onClick={() => showToast('🔗 Invoice share link generated!')}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 16: LEAVE / ABSENTEEISM PLANNER */}
            {/* ========================================================================= */}
            {activeScreen === 16 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(1)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      Leave / Absenteeism Planner
                    </h2>
                    <p className="text-[10px] text-slate-400">Auto-skips pickup stop & saves driver 8 mins</p>
                  </div>
                </div>

                {/* Child Selection Header */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-400/30">
                      AK
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Arun Kumar</h4>
                      <p className="text-[10px] text-slate-400">Class 3 • Green Valley School</p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                    Van TN-XX-1234
                  </span>
                </div>

                {/* Active Leave Toggle Switch / Status Box */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  leaveActive 
                    ? 'bg-gradient-to-br from-amber-950/60 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10' 
                    : 'bg-slate-900/80 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {leaveActive ? '⚠️ Leave Active for Today' : 'Mark Child Absent / On Leave'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {leaveActive ? `Route will auto-skip your stop (${leaveSlot})` : 'Inform driver ahead of time'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const next = !leaveActive;
                        setLeaveActive(next);
                        if (next) {
                          showToast(`✅ Leave registered for ${leaveSlot}. Driver Kumar notified & stop auto-skipped!`);
                          setLeaveHistory(prev => [
                            { id: Date.now().toString(), date: 'Today', slot: leaveSlot, reason: leaveReason, status: 'Active (Auto-Skipped)', child: 'Arun Kumar' },
                            ...prev
                          ]);
                        } else {
                          showToast('🔄 Leave cancelled. Pickup stop restored in route.');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                        leaveActive 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30' 
                          : 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-black'
                      }`}
                    >
                      {leaveActive ? 'Cancel Leave' : 'Confirm Leave'}
                    </button>
                  </div>
                </div>

                {/* Slot Selection */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">Select Leave Slot</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Morning Only', 'Evening Only', 'Full Day'] as const).map(slot => (
                      <button
                        key={slot}
                        onClick={() => setLeaveSlot(slot)}
                        className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all border ${
                          leaveSlot === slot
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reason Selection */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">Reason for Absence</label>
                  <select
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Feeling Unwell / Fever">🤒 Feeling Unwell / Fever</option>
                    <option value="Family Function / Out of Town">✈️ Family Function / Out of Town</option>
                    <option value="Parent Drop & Pickup Today">🚗 Parent Drop & Pickup Today</option>
                    <option value="School Event / Holiday">🏫 School Event / Holiday</option>
                    <option value="Other Personal Reason">📝 Other Personal Reason</option>
                  </select>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">Effective Date</label>
                  <input
                    type="date"
                    value={leaveDate}
                    onChange={(e) => setLeaveDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                {/* Leave History Log */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 flex items-center justify-between">
                    <span>Recent Leave Log</span>
                    <span className="text-[9px] text-emerald-400 font-mono">100% On-Time Sync</span>
                  </h4>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {leaveHistory.map(lh => (
                      <div key={lh.id} className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex justify-between items-center text-[10px]">
                        <div>
                          <div className="font-bold text-white flex items-center gap-1">
                            <span>{lh.slot}</span>
                            <span className="text-slate-400 font-normal">({lh.date})</span>
                          </div>
                          <div className="text-[9px] text-slate-400">{lh.reason}</div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {lh.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 17: GUARDIAN HANDOVER PASS */}
            {/* ========================================================================= */}
            {activeScreen === 17 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(1)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-sky-400" />
                      Guardian Handover Pass
                    </h2>
                    <p className="text-[10px] text-slate-400">Secure 4-Digit PIN for Alternate Pickups</p>
                  </div>
                </div>

                {/* Active Pass Card Display */}
                {guardianPasses.map(pass => (
                  <div key={pass.id} className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-sky-950/40 border border-sky-500/40 rounded-3xl p-4 space-y-3.5 shadow-2xl relative">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={pass.photoUrl}
                          alt={pass.name}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-sky-400/60 shadow"
                        />
                        <div>
                          <h3 className="text-sm font-black text-white">{pass.name}</h3>
                          <span className="text-[10px] text-sky-300 font-medium block">{pass.relation}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{pass.phone}</span>
                        </div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">
                        ACTIVE
                      </span>
                    </div>

                    {/* PIN Display Showcase */}
                    <div className="bg-slate-950/90 p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">One-Time Handover PIN</span>
                      <div className="text-2xl font-black text-white tracking-[0.3em] font-mono text-sky-400">
                        {pass.pin}
                      </div>
                      <span className="text-[8px] text-slate-500 block">Conductor must enter this PIN before child release</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>Valid until: <strong className="text-slate-200">{pass.expiresAt}</strong></span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(pass.pin);
                            showToast(`📋 Handover PIN ${pass.pin} copied!`);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg border border-slate-700"
                          title="Copy PIN"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => showToast(`📲 Pass sent to ${pass.phone} via WhatsApp!`)}
                          className="p-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg shadow"
                          title="Share via WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Create New Guardian Pass Card */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    Authorize New Pickup Guardian
                  </h3>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Guardian Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Grandma Sunita"
                        value={newGuardianName}
                        onChange={(e) => setNewGuardianName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Relationship</label>
                        <select
                          value={newGuardianRelation}
                          onChange={(e) => setNewGuardianRelation(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                        >
                          <option value="Grandparent">Grandparent</option>
                          <option value="Uncle / Aunt">Uncle / Aunt</option>
                          <option value="Neighbour">Neighbour</option>
                          <option value="Emergency Contact">Emergency Contact</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+91 98..."
                          value={newGuardianPhone}
                          onChange={(e) => setNewGuardianPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!newGuardianName.trim()) {
                          showToast('⚠️ Please enter guardian name');
                          return;
                        }
                        const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
                        const newPass = {
                          id: Date.now().toString(),
                          name: newGuardianName,
                          relation: newGuardianRelation,
                          phone: newGuardianPhone || '+91 98400 00000',
                          pin: randomPin,
                          expiresAt: 'Today, 07:00 PM',
                          status: 'Active (Verified by Parent)',
                          photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
                        };
                        setGuardianPasses([newPass, ...guardianPasses]);
                        setNewGuardianName('');
                        setNewGuardianPhone('');
                        showToast(`🎉 Guardian Pass generated! PIN: ${randomPin}`);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1 mt-1"
                    >
                      <Key className="w-3.5 h-3.5" /> Generate 4-Digit Handover PIN
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Persistent Navigation Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-[#0c1222]/95 border-t border-slate-800 px-6 py-2 flex justify-between items-center z-30">
            <button
              onClick={() => setActiveScreen(1)}
              className={`flex flex-col items-center gap-1 ${activeScreen === 1 ? 'text-indigo-400' : 'text-slate-400'}`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[9px] font-bold">Home</span>
            </button>

            <button
              onClick={() => setActiveScreen(5)}
              className={`flex flex-col items-center gap-1 ${activeScreen === 5 || activeScreen === 7 ? 'text-indigo-400' : 'text-slate-400'}`}
            >
              <Navigation className="w-4 h-4" />
              <span className="text-[9px] font-bold">Tracking</span>
            </button>

            <button
              onClick={() => setActiveScreen(9)}
              className={`flex flex-col items-center gap-1 ${activeScreen === 9 || activeScreen === 15 ? 'text-indigo-400' : 'text-slate-400'}`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-[9px] font-bold">Payments</span>
            </button>

            <button
              onClick={() => setActiveScreen(11)}
              className={`flex flex-col items-center gap-1 ${activeScreen === 11 ? 'text-indigo-400' : 'text-slate-400'}`}
            >
              <User className="w-4 h-4" />
              <span className="text-[9px] font-bold">Profile</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
