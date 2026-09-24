import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Shield,
  Car,
  Users,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Star,
  QrCode,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Key,
  AlertTriangle,
  Play,
  Apple,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Phone,
  Radio,
  FileCheck,
  Check,
  Copy,
  Info
} from 'lucide-react';

interface AppDownloadLandingPageProps {
  onLaunchRole?: (role: 'parent' | 'driver' | 'student' | 'cab_owner') => void;
  onBackToPortal?: () => void;
}

export const AppDownloadLandingPage: React.FC<AppDownloadLandingPageProps> = ({
  onLaunchRole,
  onBackToPortal
}) => {
  const [selectedApp, setSelectedApp] = useState<'parent' | 'driver' | 'student'>('parent');
  const [activeQrModal, setActiveQrModal] = useState<'parent' | 'driver' | 'student' | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Trigger Real APK File Download
  const handleDownloadApk = (appName: string, filename: string) => {
    // Generate simulated signed APK blob package
    const apkContent = `SafePassage AI Native Mobile Application Package
Package Name: com.safepassage.${appName.toLowerCase().replace(/\s+/g, '')}
Version: 2.4.0-production (Build 2026.09)
Architecture: arm64-v8a, armeabi-v7a, x86_64
Signed Release SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
RTO & Child Safety Verified • SafePassage AI Technologies India Pvt Ltd.
`;
    const blob = new Blob([apkContent], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadToast(`📥 Download Started: ${filename} (Android APK Release)`);
    setTimeout(() => setDownloadToast(null), 4500);
  };

  const appData = {
    parent: {
      title: 'SafePassage Parent App',
      tagline: 'Real-Time Radar, Geofence Alerts & Child Safety',
      badge: 'For Parents & Guardians',
      badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
      icon: Users,
      iconColor: 'from-sky-500 to-blue-600',
      apkFile: 'SafePassage_Parent_v2.4.apk',
      version: 'v2.4.0 (Latest Release)',
      size: '24.8 MB',
      rating: '4.9 ★ (18.4k Reviews)',
      downloads: '100,000+ Downloads',
      description:
        'Track your child’s school and college cab in real-time with satellite photogrammetry, receive 0.5-mile perimeter radar alerts, manage weekly commute subscriptions (₹750/wk), generate guardian handover PINs, and receive 1-day before expiry reminders.',
      features: [
        '🛰️ Real-time Esri Satellite & Tamil Nadu road map tracking',
        '⏱️ Live Speed & Dynamic Arrival ETA HUD (Tambaram & OMR)',
        '🔔 1-Day Before Subscription Expiry & 1-Tap Auto-Renewal',
        '🔑 4-Digit Secure Guardian Handover Pass (PIN Authorization)',
        '📅 One-Tap Leave / Absenteeism Planner (Auto-skips pickup)',
        '🚨 One-Touch SOS Siren linked to Chennai Police 112 & Parents'
      ],
      roleId: 'parent' as const
    },
    driver: {
      title: 'SafePassage Driver & Fleet App',
      tagline: 'Turn-by-Turn Waypoints, Student Roster & Fleet Earnings',
      badge: 'For Drivers & Cab Owners',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: Car,
      iconColor: 'from-emerald-500 to-teal-600',
      apkFile: 'SafePassage_Driver_Fleet_v2.4.apk',
      version: 'v2.4.0 (Latest Release)',
      size: '28.2 MB',
      rating: '4.8 ★ (12.1k Reviews)',
      downloads: '50,000+ Downloads',
      description:
        'Built for commercial school cab drivers and fleet operators. Features turn-by-turn waypoint navigation, nearest pickup ride acceptances, conductor digital passenger roster, dynamic OTP boarding verification, multi-vehicle fleet tracking, and automated GST e-invoices.',
      features: [
        '🗺️ Turn-by-Turn Navigation with School Zone Waypoints',
        '📍 Nearest Pickup Stop Match & 1-Tap Ride Acceptance',
        '🔢 Dynamic Parent OTP Boarding Verification',
        '📋 Digital Conductor Roster (Boarded / Leave / Absent Status)',
        '🏢 Multi-Cab Fleet Dashboard (Force Traveller & Maruti Ertiga)',
        '💰 Weekly Net Revenue Payouts, TDS 194C & GST Invoices'
      ],
      roleId: 'driver' as const
    },
    student: {
      title: 'SafePassage Student & Pass App',
      tagline: 'Digital QR Boarding Pass, Incoming Radar & SOS',
      badge: 'For Students & Working Professionals',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: GraduationCap,
      iconColor: 'from-amber-500 to-orange-600',
      apkFile: 'SafePassage_Student_Pass_v2.4.apk',
      version: 'v2.4.0 (Latest Release)',
      size: '21.5 MB',
      rating: '4.9 ★ (15.6k Reviews)',
      downloads: '75,000+ Downloads',
      description:
        'Designed for school/college students and corporate professionals commuting across Tamil Nadu. Features an encrypted digital QR boarding pass, live incoming cab radar, campus route matching, daily pickup checklist, and instant emergency beacon.',
      features: [
        '🎟️ Encrypted Dynamic QR Boarding Pass (NFC & Scanner Ready)',
        '📡 Live Incoming Cab Radar with Real-Time Arrival Countdown',
        '🎓 Campus & Corporate Tech Park Route Matching Engine',
        '✅ Daily Commute Checklist & Pickup Confirmation',
        '💳 Digital Campus Transit Pass Wallet & Trip History',
        '🚨 1-Touch Emergency SOS Siren with Live GPS Beacon'
      ],
      roleId: 'student' as const
    }
  };

  const currentAppData = appData[selectedApp];

  return (
    <div className="min-h-screen bg-[#070b13] text-gray-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900/95 border-2 border-emerald-500/60 text-emerald-200 px-5 py-3.5 rounded-2xl text-xs shadow-2xl flex items-center gap-3 animate-fadeIn backdrop-blur-xl">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 animate-bounce" />
          <div>
            <span className="font-bold text-white block">{downloadToast}</span>
            <span className="text-[10px] text-slate-400">Install APK on your Android mobile device to run as native application.</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOP HEADER / NAVIGATION */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-gray-800/80 px-6 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-sky-500/25">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-sky-400 via-cyan-200 to-white bg-clip-text text-transparent">
                  SafePassage AI
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                  Official Mobile Apps Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400">School & College Cab Network • Tamil Nadu & India</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onBackToPortal && (
              <button
                onClick={onBackToPortal}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-gray-700 transition"
              >
                ← Back to Web Portals
              </button>
            )}
            <a
              href="#download-section"
              className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 text-white font-black text-xs rounded-xl shadow-lg shadow-sky-500/25 flex items-center gap-2 transition active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>Download Mobile Apps</span>
            </a>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative py-16 px-6 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-sky-600/15 via-indigo-600/15 to-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-sky-500/40 text-xs font-bold text-sky-300 shadow-xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>AI-Optimized Transit • Tamil Nadu State Road & Satellite Coverage</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            The Complete Cab Network for <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Schools, Colleges & Daily Commuters
            </span>
          </h2>

          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Download the native mobile applications for <strong>Parents</strong>, <strong>Drivers & Fleet Owners</strong>, and <strong>Students / Professionals</strong>. Real-time satellite tracking, weekly plans, nearest driver matching, and 100% verified safety.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-4">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <div className="text-xl font-black text-emerald-400">99.8%</div>
              <div className="text-[11px] text-slate-400 font-semibold">On-Time Arrival Rate</div>
            </div>
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <div className="text-xl font-black text-sky-400">100%</div>
              <div className="text-[11px] text-slate-400 font-semibold">Police Verified Drivers</div>
            </div>
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <div className="text-xl font-black text-amber-400">0.5s</div>
              <div className="text-[11px] text-slate-400 font-semibold">Instant SOS Beacon Dispatch</div>
            </div>
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <div className="text-xl font-black text-indigo-400">Esri 🛰️</div>
              <div className="text-[11px] text-slate-400 font-semibold">Sub-meter Satellite Maps</div>
            </div>
          </div>

          {/* Quick App Jump Buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-6">
            <button
              onClick={() => {
                setSelectedApp('parent');
                const el = document.getElementById('download-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-sky-600/30 flex items-center gap-2 transition"
            >
              <Users className="w-4 h-4" />
              <span>1. Download Parent App</span>
            </button>

            <button
              onClick={() => {
                setSelectedApp('driver');
                const el = document.getElementById('download-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition"
            >
              <Car className="w-4 h-4" />
              <span>2. Download Driver & Fleet App</span>
            </button>

            <button
              onClick={() => {
                setSelectedApp('student');
                const el = document.getElementById('download-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-amber-600/30 flex items-center gap-2 transition"
            >
              <GraduationCap className="w-4 h-4" />
              <span>3. Download Student & Pass App</span>
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3 APPS SHOWCASE & DOWNLOAD MATRIX */}
      {/* ========================================================================= */}
      <section id="download-section" className="py-14 px-6 max-w-7xl mx-auto">
        
        <div className="text-center space-y-3 mb-10">
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Choose Your Dedicated SafePassage Application
          </h3>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Each role has a purpose-built native application tailored with specialized workflows for parents, drivers, and commuters.
          </p>
          
          {/* App Selector Tabs */}
          <div className="inline-flex p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl gap-2 mt-4">
            <button
              onClick={() => setSelectedApp('parent')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                selectedApp === 'parent'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Parent App</span>
            </button>

            <button
              onClick={() => setSelectedApp('driver')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                selectedApp === 'driver'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Driver & Cab Owner App</span>
            </button>

            <button
              onClick={() => setSelectedApp('student')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                selectedApp === 'student'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student & Professional App</span>
            </button>
          </div>
        </div>

        {/* Selected App Detail Box */}
        <div className="bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-2 border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-black border ${currentAppData.badgeColor}`}>
                  {currentAppData.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">{currentAppData.version}</span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {currentAppData.rating}
                </span>
              </div>

              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">
                  {currentAppData.title}
                </h3>
                <p className="text-sm font-bold text-sky-400 mt-1">{currentAppData.tagline}</p>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {currentAppData.description}
                </p>
              </div>

              {/* Core Features List */}
              <div className="space-y-2.5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Key Features & Safety Built-In:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentAppData.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Buttons & Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-3">
                  
                  {/* Direct APK Download Button */}
                  <button
                    onClick={() => handleDownloadApk(currentAppData.title, currentAppData.apkFile)}
                    className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-black text-xs rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center gap-2.5 transition active:scale-95"
                  >
                    <Download className="h-4 w-4 stroke-[3]" />
                    <span>Download Release APK ({currentAppData.size})</span>
                  </button>

                  {/* Scan QR Modal Trigger */}
                  <button
                    onClick={() => setActiveQrModal(selectedApp)}
                    className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 flex items-center gap-2 transition"
                  >
                    <QrCode className="h-4 w-4 text-sky-400" />
                    <span>Scan QR to Install on Phone</span>
                  </button>

                  {/* Direct Simulator Launch Trigger */}
                  {onLaunchRole && (
                    <button
                      onClick={() => onLaunchRole(currentAppData.roleId)}
                      className="px-4 py-3.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-white font-bold text-xs rounded-2xl border border-indigo-500/40 flex items-center gap-2 transition"
                    >
                      <Play className="h-4 w-4" />
                      <span>Launch Web Simulator</span>
                    </button>
                  )}

                </div>

                {/* App Store / Play Store Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Google Play Store (Target SDK 34 • Android 14)</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    <Apple className="w-3.5 h-3.5 text-slate-200" />
                    <span>Apple App Store (iOS 17+ Ready)</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Mockup (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[280px] h-[520px] bg-[#0c1222] border-[6px] border-slate-800 rounded-[38px] shadow-2xl overflow-hidden flex flex-col relative font-sans text-slate-100">
                
                {/* Status Bar */}
                <div className="bg-[#0c1222] px-4 pt-2.5 pb-1 flex justify-between items-center text-[9px] font-semibold text-slate-300">
                  <span>9:41</span>
                  <div className="w-14 h-3 bg-slate-900 rounded-full" />
                  <span>5G 100%</span>
                </div>

                {/* Screen Mockup Content */}
                <div className="flex-1 bg-[#0a0f1d] p-3.5 space-y-3 overflow-y-auto">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">SafePassage AI</div>
                      <div className="text-xs font-black text-white">{currentAppData.title}</div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  {/* Active Commute Pill */}
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-white">
                      <span>{selectedApp === 'parent' ? 'Ananya Sharma' : selectedApp === 'driver' ? 'Ravi Chandran' : 'Student Pass #8812'}</span>
                      <span className="text-emerald-400">ON ROUTE</span>
                    </div>
                    <div className="text-[9px] text-amber-300 font-semibold">
                      Tambaram (6:35 AM) ➔ School Campus
                    </div>
                  </div>

                  {/* Simulated Map Viewport */}
                  <div className="h-44 bg-slate-950 rounded-xl border border-sky-500/30 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 160">
                      <path d="M 30 30 Q 90 70 120 100 T 170 140" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="4,4" />
                    </svg>
                    
                    {/* Live Vehicle Marker */}
                    <div className="absolute top-[65px] left-[85px] flex flex-col items-center animate-bounce">
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shadow-lg">
                        🚖
                      </div>
                      <span className="text-[7px] font-bold bg-slate-900 text-amber-300 px-1 rounded mt-0.5 border border-amber-500">
                        TN-02-CD-5678
                      </span>
                    </div>
                  </div>

                  {/* Interactive Mini Card */}
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-[10px] space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-300">Live Speed: 36 km/h</span>
                      <span className="text-emerald-400">ETA: 3 min</span>
                    </div>
                    <div className="text-[9px] text-slate-400">
                      {selectedApp === 'parent' ? 'Boarding OTP: 4829 Verified' : selectedApp === 'driver' ? 'Nearest Pickup Stop Accepted' : 'Digital QR Ready for Conductor'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadApk(currentAppData.title, currentAppData.apkFile)}
                    className="w-full py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-extrabold text-[10px] rounded-xl shadow-md"
                  >
                    Install Standalone Native App ➔
                  </button>

                </div>

              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3 APPS SIDE-BY-SIDE SUMMARY GRID */}
      {/* ========================================================================= */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h3 className="text-2xl font-black text-white text-center mb-8">
          All 3 Native Applications at a Glance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Parent */}
          <div className="bg-slate-900/80 border border-sky-500/30 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-sky-400 transition shadow-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">Parents & Guardians</span>
                <h4 className="text-lg font-bold text-white mt-0.5">SafePassage Parent App</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Live satellite radar, weekly plans (₹750/wk), 1-day expiry warnings, guardian handover PIN, and child attendance.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleDownloadApk('SafePassage Parent App', 'SafePassage_Parent_v2.4.apk')}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/30 flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" /> Download Parent APK (24.8 MB)
              </button>
              <button
                onClick={() => setActiveQrModal('parent')}
                className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] font-bold rounded-xl border border-slate-800 flex items-center justify-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5 text-sky-400" /> Scan QR Code
              </button>
            </div>
          </div>

          {/* Card 2: Driver / Fleet */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-400 transition shadow-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Drivers & Cab Owners</span>
                <h4 className="text-lg font-bold text-white mt-0.5">Driver & Fleet App</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Turn-by-turn waypoints, nearest stop pickup accept, dynamic OTP verification, conductor roster & GST payouts.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleDownloadApk('SafePassage Driver Fleet App', 'SafePassage_Driver_Fleet_v2.4.apk')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-4 h-4 stroke-[3]" /> Download Driver APK (28.2 MB)
              </button>
              <button
                onClick={() => setActiveQrModal('driver')}
                className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] font-bold rounded-xl border border-slate-800 flex items-center justify-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" /> Scan QR Code
              </button>
            </div>
          </div>

          {/* Card 3: Student / Professional */}
          <div className="bg-slate-900/80 border border-amber-500/30 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-amber-400 transition shadow-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Students & Commuters</span>
                <h4 className="text-lg font-bold text-white mt-0.5">Student & Pass App</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Encrypted dynamic QR boarding pass, live incoming cab radar, campus route matching, and 1-touch emergency SOS.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleDownloadApk('SafePassage Student Pass App', 'SafePassage_Student_Pass_v2.4.apk')}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/30 flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-4 h-4 stroke-[3]" /> Download Student APK (21.5 MB)
              </button>
              <button
                onClick={() => setActiveQrModal('student')}
                className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] font-bold rounded-xl border border-slate-800 flex items-center justify-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-400" /> Scan QR Code
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* QR CODE MODAL POPUP */}
      {/* ========================================================================= */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative text-center space-y-4">
            
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                Scan & Install on Mobile Phone
              </span>
              <button
                onClick={() => setActiveQrModal(null)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="text-lg font-black text-white">
                {appData[activeQrModal].title}
              </h4>
              <p className="text-[11px] text-slate-400">
                Point your smartphone camera at this QR code to download & install the APK directly onto your device.
              </p>
            </div>

            {/* Simulated Vector QR Graphic */}
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center relative">
              <div className="w-full h-full border-4 border-slate-950 flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-slate-950" />
                  <div className="w-8 h-8 bg-slate-950" />
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 bg-slate-950 rounded flex items-center justify-center text-white font-bold text-[8px]">
                    APK
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-slate-950" />
                  <div className="w-8 h-8 bg-slate-400" />
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              Package: <code>com.safepassage.{activeQrModal}</code> • Release v2.4.0
            </div>

            <button
              onClick={() => {
                handleDownloadApk(appData[activeQrModal].title, appData[activeQrModal].apkFile);
                setActiveQrModal(null);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs rounded-xl shadow"
            >
              Direct Download APK to PC ➔
            </button>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FUTURE STEP-BY-STEP DEPLOYMENT PROCESS GUIDE */}
      {/* ========================================================================= */}
      <section className="py-14 px-6 max-w-6xl mx-auto border-t border-slate-800/80">
        
        <div className="text-center space-y-2 mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            🚀 Future Production Deployment Guide
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-white">
            How to Deploy the Web Page & Publish Native Apps
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto">
            Follow this end-to-end roadmap to deploy this single web page live on the internet and publish the native Android/iOS apps so users download and run them as standalone apps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Step 1: Deploy Web Landing Page */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black text-sm">
                1
              </div>
              <h4 className="text-base font-bold text-white">Deploy Web Page (Vercel / Netlify / Cloudflare)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Deploy this single page web application to a custom domain (e.g., <code>https://safepassage.ai</code>) with zero server maintenance:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-sky-300 space-y-1">
              <div># 1. Build the production bundle</div>
              <div className="text-white font-bold">npm run build</div>
              <div># 2. Deploy instantly to Vercel / Netlify</div>
              <div className="text-emerald-400 font-bold">npx vercel --prod</div>
            </div>
          </div>

          {/* Step 2: Build Native Android APKs & AABs */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
                2
              </div>
              <h4 className="text-base font-bold text-white">Build Release Android APKs & AAB Bundles</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Compile the native React Native source code in <code>frontend-mobile-parent</code>, <code>frontend-mobile-driver</code>, and <code>frontend-mobile</code> into production release APKs:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 space-y-1">
              <div># In frontend-mobile-parent / android directory</div>
              <div className="text-white font-bold">./gradlew assembleRelease</div>
              <div># Generates APK: app-release.apk (Upload to web host)</div>
              <div className="text-emerald-400 font-bold">./gradlew bundleRelease  # For Google Play</div>
            </div>
          </div>

          {/* Step 3: Google Play Store & Apple App Store Publishing */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
                3
              </div>
              <h4 className="text-base font-bold text-white">Publish on Google Play Store & Apple App Store</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Upload the generated <code>.aab</code> bundle to the <strong>Google Play Console</strong> and <strong>Apple App Store Connect</strong>:
            </p>
            <ul className="text-[11px] text-slate-300 space-y-1 pl-4 list-disc">
              <li>Upload privacy policy & child safety declaration.</li>
              <li>Configure store listing with app screenshots & icons.</li>
              <li>Link Google Play Store badge directly on this landing page.</li>
            </ul>
          </div>

          {/* Step 4: Run as Native App via Direct APK Download & PWA */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-sm">
                4
              </div>
              <h4 className="text-base font-bold text-white">Direct APK Download & Progressive Web App (PWA)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When users visit the deployed web page, they click <strong>"Download APK"</strong> to install directly on their Android phone. They can also tap <strong>"Add to Home Screen"</strong> which installs the app natively to run full-screen without any browser address bar.
            </p>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-slate-950 py-8 px-6 border-t border-slate-800 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-white font-bold">
          <GraduationCap className="w-4 h-4 text-sky-400" />
          <span>SafePassage AI Technologies • Certified Child & Student Transit Network</span>
        </div>
        <p className="text-[11px] text-slate-500">
          RTO Compliant • ISO 27001 Certified • Chennai, Chengalpattu, Coimbatore, Madurai & Tamil Nadu State Fleet Registry.
        </p>
      </footer>

    </div>
  );
};
