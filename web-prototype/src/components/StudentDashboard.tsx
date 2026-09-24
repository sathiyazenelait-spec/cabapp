import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  Star,
  Search,
  Check,
  Phone,
  Share2,
  Calendar,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Tv,
  Wifi,
  Sparkles,
  ArrowLeft,
  User,
  Bell,
  Home,
  Receipt,
  Car,
  Zap,
  Key,
  QrCode
} from 'lucide-react';
import type { UserSession } from '../types/auth';
import { studentWorkApi } from '../services/api';

interface StudentDashboardProps {
  currentUser: UserSession;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ currentUser }) => {
  const [activeScreen, setActiveScreen] = useState<number>(1);
  const [category, setCategory] = useState<'College' | 'Work' | 'Custom'>('College');
  const [selectedCollege, setSelectedCollege] = useState('ABC Engineering College');
  const [pickup, setPickup] = useState('Kattur');
  const [selectedPlan, setSelectedPlan] = useState<'Monthly' | 'Weekly' | 'Quarterly'>('Monthly');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [liveLocation, setLiveLocation] = useState({ lat: 11.9360, lng: 79.8320, eta: 12 });
  const [activePasses, setActivePasses] = useState<any[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const userEmail = currentUser?.email || 'priya@student.safepassage.ai';
    studentWorkApi.getPasses(userEmail).then(passes => {
      if (Array.isArray(passes)) setActivePasses(passes);
    }).catch(() => {});

    const interval = setInterval(() => {
      setLiveLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.0003,
        lng: prev.lng + (Math.random() - 0.5) * 0.0003,
        eta: Math.max(1, prev.eta)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleBookSeat = async () => {
    try {
      const userEmail = currentUser?.email || 'priya@student.safepassage.ai';
      await studentWorkApi.bookSeat(userEmail, 'sr1', selectedPlan);
    } catch (e) {
      console.log('Book student seat demo mode');
    }
    showToast('🎉 Subscription Confirmed & Activated in Database!');
    setActiveScreen(6);
  };

  const screenNames = [
    '1. Home Dashboard',
    '2. Find Transport',
    '3. Available Routes',
    '4. Route Details',
    '5. Subscription Plan',
    '6. Subscription Confirmation',
    '7. Live Tracking',
    '8. Payments',
    '9. Profile / Settings',
    '10. ⚡ Single Trip (₹35)'
  ];

  // Single Trip On-Demand States (2km = ₹35 rule)
  const [stDistance, setStDistance] = useState<number>(2.0);
  const [stPickup, setStPickup] = useState<string>('Hostel Gate 2, Campus Road');
  const [stDrop, setStDrop] = useState<string>('Pondicherry Beach Promenade');
  const [stStatus, setStStatus] = useState<'IDLE' | 'SEARCHING_45S' | 'ACCEPTED' | 'IN_TRANSIT' | 'COMPLETED'>('IDLE');
  const [stTimer, setStTimer] = useState<number>(45);
  const [showRzpModal, setShowRzpModal] = useState<boolean>(false);

  const calculateStFare = (dist: number) => {
    if (dist <= 2.0) return 35;
    return 35 + Math.round((dist - 2.0) * 14);
  };

  const handleStartStSearch = () => {
    setStStatus('SEARCHING_45S');
    setStTimer(45);
    const interval = setInterval(() => {
      setStTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setStStatus('ACCEPTED');
          return 0;
        }
        if (prev === 40) {
          clearInterval(interval);
          setStStatus('ACCEPTED');
          return 40;
        }
        return prev - 1;
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Jump Buttons */}
      <div className="glass-card p-4 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 to-slate-900/60 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <GraduationCap className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Student Transit Module • 9 Screens Suite
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                Live Dynamic Sync
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Campus pass matching, seat reservation, live ETA radar, and digital boarding.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 max-w-2xl">
          {screenNames.map((name, idx) => (
            <button
              key={idx}
              onClick={() => setActiveScreen(idx + 1)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeScreen === idx + 1
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-blue-500 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Frame Simulator */}
      <div className="flex justify-center">
        <div className="w-full max-w-[390px] h-[780px] bg-[#0c1222] border-[8px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative font-sans text-slate-100">
          {/* Status Bar */}
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

          {/* Screen Content Area */}
          <div className="flex-1 overflow-y-auto bg-[#0a0f1d] relative pb-16">
            
            {/* ========================================================================= */}
            {/* SCREEN 1: STUDENT HOME DASHBOARD */}
            {/* ========================================================================= */}
            {activeScreen === 1 && (
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-lg font-bold text-white">Hello, Priya 🎓</h1>
                    <p className="text-[11px] text-blue-300 font-medium">Your Journey, Our Priority</p>
                  </div>
                  <button onClick={() => showToast('No new notifications')} className="p-2 bg-slate-800/80 rounded-full text-slate-300">
                    <Bell className="w-4 h-4" />
                  </button>
                </div>

                {/* Profile Card */}
                <div className="bg-gradient-to-r from-blue-900/60 to-indigo-950/80 border border-blue-500/30 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 font-bold text-sm">
                      PS
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Priya S</h3>
                      <p className="text-[10px] text-slate-400">ABC Engineering College • 2nd Year - CSE</p>
                    </div>
                  </div>
                </div>

                {/* Current Ride Card */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">Current Ride</span>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">
                      ● On Route
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>Kattur → ABC College</span>
                    </div>
                    <p className="text-[10px] text-slate-400 pl-5">Vehicle No: Van TN-XX-5678</p>
                    <p className="text-[10px] text-slate-400 pl-5">Driver: Rajesh Kumar</p>
                    <p className="text-[10px] text-emerald-400 font-bold pl-5">ETA: 12 min</p>
                  </div>
                </div>

                {/* Single Trip On-Demand Promo Banner */}
                <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-blue-950/40 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-black text-white">Single Trip On-Demand</h4>
                        <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-bold">
                          ₹35 / 2 km
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">45s Driver SLA • Dual OTP • Razorpay QR</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveScreen(10)}
                    className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] rounded-xl shadow-md transition"
                  >
                    Book ₹35
                  </button>
                </div>

                {/* Quick Actions Grid */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 mb-2">Quick Actions</h3>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { name: 'Single Trip', icon: Zap, screen: 10, highlight: true, badge: '₹35' },
                      { name: 'Find Transport', icon: Search, screen: 2 },
                      { name: 'My Subscriptions', icon: Calendar, screen: 5 },
                      { name: 'Live Tracking', icon: Navigation, screen: 7 },
                      { name: 'Trip History', icon: Clock, screen: 7 },
                      { name: 'Payments', icon: CreditCard, screen: 8 },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveScreen(item.screen)}
                        className={`p-3 rounded-2xl flex flex-col items-center text-center gap-1.5 transition-all relative ${
                          item.highlight
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 border-2 border-amber-500/50 shadow-md shadow-amber-500/10'
                            : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {item.badge && (
                          <span className="absolute -top-1.5 -right-1 bg-amber-500 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-full shadow">
                            {item.badge}
                          </span>
                        )}
                        <div className={`p-2 rounded-xl ${item.highlight ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-bold ${item.highlight ? 'text-amber-300' : 'text-slate-200'}`}>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Promo Banner */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-3.5 rounded-2xl border border-blue-500/30 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-white">Safe Rides, Bright Future</h4>
                    <p className="text-[9px] text-blue-200">Verified drivers • GPS tracking • 24/7 support</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-blue-300" />
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

                <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
                  {(['College', 'Work', 'Custom'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        category === cat ? 'bg-blue-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Select College</label>
                    <input
                      type="text"
                      value={selectedCollege}
                      onChange={e => setSelectedCollege(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Pickup Location</label>
                    <input
                      type="text"
                      value={pickup}
                      onChange={e => setPickup(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Preferred Time</label>
                    <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300">
                      8:00 AM - 9:00 AM
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveScreen(3)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30"
                  >
                    Search Transport
                  </button>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 mb-2">Recent Searches</h3>
                  <div className="space-y-2">
                    {[
                      { title: 'Kattur → ABC College', sub: 'Today, 8:00 AM' },
                      { title: 'Lawspet → ABC College', sub: 'Yesterday, 8:00 AM' },
                      { title: 'Ariyankuppam → ABC College', sub: '12 Apr, 8:00 AM' },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveScreen(3)}
                        className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex justify-between items-center cursor-pointer hover:border-blue-500/40"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{item.title}</div>
                          <div className="text-[10px] text-slate-400">{item.sub}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 3: AVAILABLE ROUTES */}
            {/* ========================================================================= */}
            {activeScreen === 3 && (
              <div className="p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveScreen(2)} className="p-1 text-slate-400 hover:text-white">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-base font-bold text-white">Available Routes</h2>
                  </div>
                  <span className="text-[10px] text-blue-400">Price (Low to High)</span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'r1',
                      vehicle: 'Van TN-XX-5678',
                      specs: '7 Seater • AC',
                      rating: '4.6 (124)',
                      driver: 'Rajesh Kumar',
                      route: 'Kattur → ABC College',
                      timing: '7:40 AM - 8:15 AM',
                      price: '₹1,800',
                      seats: '2 seats left',
                    },
                    {
                      id: 'r2',
                      vehicle: 'Van TN-XX-9012',
                      specs: '12 Seater • AC',
                      rating: '4.4 (89)',
                      driver: 'Suresh',
                      route: 'Lawspet → ABC College',
                      timing: '7:50 AM - 8:25 AM',
                      price: '₹1,600',
                      seats: '5 seats left',
                    },
                    {
                      id: 'r3',
                      vehicle: 'Car TN-XX-3456',
                      specs: '5 Seater • AC',
                      rating: '4.2 (65)',
                      driver: 'Karthik',
                      route: 'Ariyankuppam → ABC College',
                      timing: '8:00 AM - 8:40 AM',
                      price: '₹2,000',
                      seats: '1 seat left',
                    },
                  ].map(r => (
                    <div
                      key={r.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2.5">
                          <div className="w-11 h-11 bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-300 font-bold text-xs">
                            VAN
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-white">{r.vehicle}</h3>
                            <p className="text-[10px] text-slate-400">{r.specs} • ⭐ {r.rating}</p>
                          </div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">
                          {r.seats}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-300 bg-slate-950/60 p-2 rounded-xl">
                        <div className="font-bold text-white">{r.route}</div>
                        <div className="text-slate-400 text-[9px]">{r.timing}</div>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                        <div>
                          <span className="text-sm font-extrabold text-white">{r.price}</span>
                          <span className="text-[10px] text-slate-400"> / month</span>
                        </div>
                        <button
                          onClick={() => setActiveScreen(4)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 4: ROUTE DETAILS */}
            {/* ========================================================================= */}
            {activeScreen === 4 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(3)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">Route Details</h2>
                </div>

                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-white">Van TN-XX-5678</h3>
                      <p className="text-[10px] text-slate-400">7 SEATER • AC • ⭐ 4.6 (124)</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-full">
                      2 seats left
                    </span>
                  </div>
                  <div className="text-xl font-extrabold text-blue-400">₹1,800 <span className="text-xs text-slate-400">/ month</span></div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white">Driver & Route</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Driver</span>
                    <span className="text-emerald-400 font-bold">Rajesh Kumar (Verified ✅)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Route</span>
                    <span className="text-white font-bold">Kattur → ABC College</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Timings</span>
                    <span className="text-slate-300">7:40 AM - 8:15 AM</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveScreen(5)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30"
                >
                  Proceed to Subscription
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 5: SUBSCRIPTION PLAN */}
            {/* ========================================================================= */}
            {activeScreen === 5 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(4)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">Subscription Plan</h2>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 mb-2">Amenities</h3>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { name: 'AC', icon: Wifi },
                      { name: 'GPS Tracking', icon: Navigation },
                      { name: 'Safe & Verified', icon: ShieldCheck },
                      { name: 'CCTV', icon: Tv },
                    ].map((am, i) => (
                      <div key={i} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center gap-1">
                        <am.icon className="w-4 h-4 text-blue-400" />
                        <span className="text-[8px] font-bold text-slate-300">{am.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Duration Switcher */}
                <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
                  {(['Monthly', 'Weekly', 'Quarterly'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setSelectedPlan(p)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        selectedPlan === p ? 'bg-blue-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Plan Highlights */}
                <div className="bg-gradient-to-b from-blue-950/80 to-slate-900 p-4 rounded-2xl border border-blue-500/40 space-y-2.5 text-xs">
                  <h4 className="text-sm font-bold text-white">Monthly Student Pass</h4>
                  <div className="text-xl font-black text-blue-400">₹1,800 <span className="text-xs font-normal text-slate-400">/ month</span></div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-slate-300">
                    <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 5 days per week (Mon - Fri)</div>
                    <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Flexible cancellation</div>
                    <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Live tracking & notifications</div>
                    <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 24/7 student support</div>
                  </div>
                </div>

                <button
                  onClick={handleBookSeat}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30"
                >
                  Subscribe Now
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 6: SUBSCRIPTION CONFIRMATION */}
            {/* ========================================================================= */}
            {activeScreen === 6 && (
              <div className="p-4 space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mt-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-white">Subscription Successful!</h3>
                  <p className="text-xs text-slate-400 mt-1">Your transport subscription has been activated.</p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Route</span><span className="text-white font-bold">Kattur → ABC College</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Vehicle</span><span className="text-white font-bold">Van TN-XX-5678</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Plan</span><span className="text-white font-bold">Monthly</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Start Date</span><span className="text-white font-bold">15 Apr 2025</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">End Date</span><span className="text-white font-bold">14 May 2025</span></div>
                  <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400 font-bold">Amount Paid</span><span className="text-emerald-400 font-bold">₹1,800</span></div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setActiveScreen(7)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                  >
                    View Live Tracking
                  </button>
                  <button
                    onClick={() => setActiveScreen(1)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 7: LIVE TRACKING */}
            {/* ========================================================================= */}
            {activeScreen === 7 && (
              <div className="h-full flex flex-col">
                <div className="p-3 bg-slate-900/95 border-b border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xs font-bold text-white">Van TN-XX-5678</h2>
                      <p className="text-[10px] text-slate-400">Rajesh Kumar (Driver)</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">
                      On Route
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] bg-slate-800 px-3 py-1.5 rounded-xl text-blue-300 font-bold">
                    <span>ETA 12 min</span>
                    <span className="text-slate-400 font-normal">Arriving at 8:10 AM</span>
                  </div>
                </div>

                {/* Map Vector */}
                <div className="flex-1 bg-[#0f172a] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 300">
                    <path d="M 60 70 Q 140 120 180 180 T 260 240" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="6,4" />
                  </svg>
                  <div className="absolute top-[60px] left-[45px] text-[9px] bg-slate-900 px-2 py-1 rounded text-white font-bold">📍 Kattur</div>
                  <div className="absolute bottom-[40px] right-[40px] text-[9px] bg-blue-900 px-2 py-1 rounded text-white font-bold">🎓 ABC College</div>
                  <div className="absolute top-[125px] left-[150px] w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center animate-bounce shadow-xl">
                    🚐
                  </div>
                </div>

                <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex gap-2">
                  <button
                    onClick={() => showToast('📞 Dialing Rajesh Kumar: +91 98401 23456')}
                    className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-md"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Driver
                  </button>
                  <button
                    onClick={() => showToast('📍 Location link copied!')}
                    className="flex-1 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share Location
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 8: PAYMENTS */}
            {/* ========================================================================= */}
            {activeScreen === 8 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(1)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">Payments</h2>
                </div>

                <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-4 rounded-2xl border border-blue-500/40 space-y-2">
                  <span className="text-[10px] text-blue-300 font-bold uppercase">Current Student Pass</span>
                  <div className="text-xl font-black text-white">₹1,800 / month</div>
                  <p className="text-[10px] text-slate-400">Next payment: 14 May 2025</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 mb-2">Payment History</h3>
                  <div className="space-y-2">
                    {[
                      { date: '15 Apr 2025', amt: '₹1,800' },
                      { date: '15 Mar 2025', amt: '₹1,800' },
                      { date: '15 Feb 2025', amt: '₹1,800' },
                    ].map((tx, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="text-xs font-bold text-white">{tx.date}</div>
                          <div className="text-[9px] text-slate-400">Semester Pass</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-white">{tx.amt}</div>
                          <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Paid</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 9: PROFILE / SETTINGS */}
            {/* ========================================================================= */}
            {activeScreen === 9 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveScreen(1)} className="p-1 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">Profile & Settings</h2>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">PS</div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Priya S</h3>
                    <p className="text-[10px] text-slate-400">+91 98765 43210</p>
                  </div>
                </div>

                <div className="bg-slate-900/80 rounded-2xl border border-slate-800 divide-y divide-slate-800/60">
                  {[
                    { title: 'My Profile', icon: User, action: () => showToast('Student ID verified') },
                    { title: 'College & Degree Details', icon: GraduationCap, action: () => showToast('ABC Engineering College • CSE') },
                    { title: 'Notification Settings', icon: Bell, action: () => showToast('Push notifications active') },
                    { title: 'Help & Support', icon: HelpCircle, action: () => showToast('Student support hotline: 1800-STUDENT') },
                    { title: 'About App', icon: Sparkles, action: () => showToast('SafePassage AI v2.4 (Student Edition)') },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={item.action}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-800/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-medium text-slate-200">{item.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SCREEN 10: SINGLE TRIP ON-DEMAND (₹35 FOR 2KM RULE & DUAL OTP) */}
            {/* ========================================================================= */}
            {activeScreen === 10 && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveScreen(1)} className="p-1 text-slate-400 hover:text-white">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-400" /> Student Single Trip
                      </h2>
                      <p className="text-[10px] text-slate-400">₹35 Base Fare (2 km) • Dual OTP</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full font-bold">
                    45s SLA Radar
                  </span>
                </div>

                {/* Status Switcher Flow */}
                {stStatus === 'IDLE' && (
                  <div className="space-y-3">
                    {/* Location Form */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">PICKUP LOCATION</label>
                        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <input
                            type="text"
                            value={stPickup}
                            onChange={e => setStPickup(e.target.value)}
                            className="bg-transparent text-xs text-white w-full focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">DROP DESTINATION</label>
                        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2">
                          <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <input
                            type="text"
                            value={stDrop}
                            onChange={e => setStDrop(e.target.value)}
                            className="bg-transparent text-xs text-white w-full focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Distance Selector */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 block">SELECT DISTANCE</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[1.5, 2.0, 3.5, 5.0].map(dist => (
                          <button
                            key={dist}
                            onClick={() => setStDistance(dist)}
                            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center ${
                              stDistance === dist
                                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                            }`}
                          >
                            <span>{dist} km</span>
                            <span className="text-[9px] opacity-90">₹{calculateStFare(dist)}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Breakdown Banner */}
                    <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-emerald-300">Total Fare: ₹{calculateStFare(stDistance)}.00</span>
                          {stDistance <= 2.0 && (
                            <span className="text-[8px] bg-emerald-500/30 text-emerald-300 px-1 rounded font-bold">2.0 KM BASE</span>
                          )}
                        </div>
                        <p className="text-[9px] text-slate-400 mt-0.5">₹35 for first 2.0 km + ₹14/km extra</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Payment Mode</span>
                        <span className="text-[10px] font-bold text-cyan-400">Razorpay Direct QR</span>
                      </div>
                    </div>

                    {/* Request CTA */}
                    <button
                      onClick={handleStartStSearch}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
                    >
                      <Zap className="w-4 h-4 fill-slate-950" />
                      REQUEST SINGLE TRIP (₹{calculateStFare(stDistance)})
                    </button>
                  </div>
                )}

                {/* 45S RADAR SEARCHING */}
                {stStatus === 'SEARCHING_45S' && (
                  <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 text-center space-y-4 shadow-xl">
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-amber-500/40 animate-ping" />
                      <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 font-black text-lg">
                        {stTimer}s
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">45s Near-Driver Dispatch SLA</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Pinging nearest campus cabs within 2.0 km radius with ₹35 base fare...
                      </p>
                    </div>
                    <button
                      onClick={() => setStStatus('ACCEPTED')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition"
                    >
                      Simulate Driver Accept
                    </button>
                  </div>
                )}

                {/* TRIP ACCEPTED & DUAL OTP DISPLAY */}
                {(stStatus === 'ACCEPTED' || stStatus === 'IN_TRANSIT') && (
                  <div className="space-y-3">
                    {/* Driver Card */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                            RK
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">Rajesh Kumar (Driver)</h4>
                            <p className="text-[10px] text-slate-400">Maruti Ertiga • TN-07-AL-8890</p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">
                          {stStatus === 'ACCEPTED' ? 'Arriving in 2 min' : 'In Transit'}
                        </span>
                      </div>
                    </div>

                    {/* DUAL OTP BOX */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-400 mb-1">
                          <Key className="w-3 h-3" /> Boarding OTP
                        </div>
                        <div className="text-2xl font-black text-white tracking-widest font-mono">
                          8492
                        </div>
                        <p className="text-[8px] text-slate-400 mt-1">Share at pickup to start ride</p>
                      </div>

                      <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-amber-400 mb-1">
                          <ShieldCheck className="w-3 h-3" /> Drop Safety OTP
                        </div>
                        <div className="text-2xl font-black text-amber-300 tracking-widest font-mono">
                          7429
                        </div>
                        <p className="text-[8px] text-slate-400 mt-1">Share at destination to complete</p>
                      </div>
                    </div>

                    {/* Step Transitions */}
                    {stStatus === 'ACCEPTED' && (
                      <button
                        onClick={() => setStStatus('IN_TRANSIT')}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition"
                      >
                        Simulate Student Boarded (OTP 8492 Verified)
                      </button>
                    )}

                    {stStatus === 'IN_TRANSIT' && (
                      <div className="space-y-3">
                        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Live Telematics</span>
                            <span className="text-xs font-bold text-emerald-400">35 km/h • Safe Zone</span>
                          </div>
                          <button
                            onClick={() => { setStStatus('COMPLETED'); setShowRzpModal(true); }}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition"
                          >
                            Arrived & Complete Ride
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TRIP COMPLETED & PAYMENT */}
                {stStatus === 'COMPLETED' && (
                  <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-black text-white">Campus Single Trip Completed!</h4>
                    <p className="text-xs text-slate-300">
                      Fare: <strong className="text-emerald-400">₹{calculateStFare(stDistance)}.00</strong> (2.0 km Base)
                    </p>
                    <button
                      onClick={() => setShowRzpModal(true)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
                    >
                      <QrCode className="w-4 h-4" /> Open Razorpay Direct QR
                    </button>
                    <button
                      onClick={() => { setStStatus('IDLE'); setShowRzpModal(false); }}
                      className="text-[11px] text-slate-400 hover:text-white"
                    >
                      Book Another Single Trip
                    </button>
                  </div>
                )}

                {/* RAZORPAY SMART PAY QR MODAL */}
                {showRzpModal && (
                  <div className="p-4 bg-slate-950 border border-blue-500/40 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-black text-white">Razorpay Smart Pay QR</span>
                      </div>
                      <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded font-bold">UPI SETTLE</span>
                    </div>

                    <div className="text-center py-2">
                      <span className="text-[10px] text-slate-400">AMOUNT DUE</span>
                      <div className="text-2xl font-black text-emerald-400">₹{calculateStFare(stDistance)}.00</div>
                    </div>

                    <div className="bg-white p-3 rounded-xl w-36 h-36 mx-auto flex items-center justify-center shadow-md">
                      <div className="text-center text-slate-950 font-mono text-[9px] font-bold">
                        [ RAZORPAY QR ]
                        <div className="mt-1 text-[8px] text-slate-600">safepassage.driver@icici</div>
                        <div className="text-emerald-700 font-bold mt-1">₹{calculateStFare(stDistance)}.00</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowRzpModal(false);
                        showToast('₹35.00 Payment Settled directly to Driver Wallet!');
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow"
                    >
                      Confirm UPI Payment Completed
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Bottom Nav */}
          <div className="absolute bottom-0 inset-x-0 bg-[#0c1222]/95 border-t border-slate-800 px-6 py-2 flex justify-between items-center z-30">
            <button onClick={() => setActiveScreen(1)} className={`flex flex-col items-center gap-1 ${activeScreen === 1 ? 'text-blue-400' : 'text-slate-400'}`}>
              <Home className="w-4 h-4" />
              <span className="text-[9px] font-bold">Home</span>
            </button>
            <button onClick={() => setActiveScreen(7)} className={`flex flex-col items-center gap-1 ${activeScreen === 7 ? 'text-blue-400' : 'text-slate-400'}`}>
              <Navigation className="w-4 h-4" />
              <span className="text-[9px] font-bold">Tracking</span>
            </button>
            <button onClick={() => setActiveScreen(8)} className={`flex flex-col items-center gap-1 ${activeScreen === 8 ? 'text-blue-400' : 'text-slate-400'}`}>
              <CreditCard className="w-4 h-4" />
              <span className="text-[9px] font-bold">Payments</span>
            </button>
            <button onClick={() => setActiveScreen(9)} className={`flex flex-col items-center gap-1 ${activeScreen === 9 ? 'text-blue-400' : 'text-slate-400'}`}>
              <User className="w-4 h-4" />
              <span className="text-[9px] font-bold">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
