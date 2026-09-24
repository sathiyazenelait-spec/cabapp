import React, { useState, useEffect, useRef } from 'react';
import {
  Car,
  MapPin,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Phone,
  ArrowRight,
  Sparkles,
  Zap,
  RotateCcw,
  Navigation,
  X,
  Copy,
  Check,
  Award,
  DollarSign,
  Send,
  AlertOctagon,
  KeyRound
} from 'lucide-react';
import { singleTripApi, sosApi } from '../services/api';
import { CityMap } from './CityMap';

interface SingleTripWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
  userName?: string;
}

type TripStage = 'REQUEST' | 'DISPATCH_45S' | 'ACCEPTED' | 'ARRIVED_OTP_VERIFY' | 'IN_PROGRESS' | 'COMPLETED';

export const SingleTripWorkflowModal: React.FC<SingleTripWorkflowModalProps> = ({
  isOpen,
  onClose,
  userRole = 'parent',
  userName = 'Priya Sharma'
}) => {
  const [stage, setStage] = useState<TripStage>('REQUEST');
  const [countdown, setCountdown] = useState<number>(45);
  const [pickup, setPickup] = useState('Mehta Nagar Anna Arch Gate, Chennai');
  const [destination, setDestination] = useState('ABC Matriculation School, Shenoy Nagar');
  const [passengerType, setPassengerType] = useState<'School Student' | 'College Student' | 'Office Commuter'>('School Student');
  const [estimatedFare, setEstimatedFare] = useState<number>(180);
  const [generatedOtp, setGeneratedOtp] = useState<string>('8492');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [copiedOtp, setCopiedOtp] = useState<boolean>(false);
  const [tripId, setTripId] = useState<number>(Date.now());
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [driverSpeed, setDriverSpeed] = useState<number>(36);
  const [rating, setRating] = useState<number>(5);

  const timerRef = useRef<any>(null);

  // Sound generator using Web Audio API for timer ding, success chime, and siren
  const playAudioTone = (type: 'tick' | 'success' | 'alert' | 'siren') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'tick') {
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch {
      // AudioContext not allowed or unsupported
    }
  };

  // 45-Second Countdown Effect
  useEffect(() => {
    if (stage === 'DISPATCH_45S') {
      setCountdown(45);
      playAudioTone('alert');
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          if (prev % 5 === 0) playAudioTone('tick');
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  if (!isOpen) return null;

  // Handle Request Trip (Dispatches to near driver with 45s countdown)
  const handleRequestTrip = async () => {
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    const newTripId = Date.now();
    setTripId(newTripId);

    try {
      await singleTripApi.requestTrip({
        passengerName: userName,
        passengerEmail: 'priya.sharma@gmail.com',
        passengerPhone: '+91 98401 22334',
        pickupAddress: pickup,
        dropAddress: destination,
        fare: estimatedFare,
      });
    } catch {
      // Fallback already handled
    }

    setStage('DISPATCH_45S');
  };

  // Handle Driver Accepting within 45s
  const handleDriverAccept = async () => {
    playAudioTone('success');
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      await singleTripApi.acceptTrip(tripId, 1);
    } catch {}
    setStage('ACCEPTED');
  };

  // Handle Driver Arriving at Pickup
  const handleDriverArrived = async () => {
    playAudioTone('alert');
    try {
      await singleTripApi.markArrived(tripId);
    } catch {}
    setStage('ARRIVED_OTP_VERIFY');
  };

  // Handle OTP Submission by Driver
  const handleVerifyOtp = async () => {
    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setOtpError('Invalid OTP! Please ask passenger for the 4-digit PIN shown on their screen.');
      playAudioTone('alert');
      return;
    }

    setOtpError(null);
    playAudioTone('success');
    try {
      await singleTripApi.verifyOtp(tripId, enteredOtp);
    } catch {}
    setStage('IN_PROGRESS');
  };

  // Handle Trip Completion
  const handleCompleteTrip = async () => {
    playAudioTone('success');
    try {
      await singleTripApi.completeTrip(tripId);
    } catch {}
    setStage('COMPLETED');
  };

  // Handle SOS
  const handleToggleSos = async () => {
    const newSos = !sosActive;
    setSosActive(newSos);
    if (newSos) {
      playAudioTone('alert');
      try {
        await sosApi.triggerEmergency({
          email: 'priya.sharma@gmail.com',
          reason: 'Emergency SOS triggered during Single Trip ID ' + tripId,
          vehiclePlate: 'TN 01 AB 1234',
        });
      } catch {}
    }
  };

  // Circular progress math for 45s timer
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (countdown / 45) * circumference;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-950/40 text-white overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-b border-slate-700/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-wide text-white">
                  Single Trip Instant Dispatch Protocol
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  45s Timer & OTP Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-end near driver dispatch, dynamic 4-digit PIN boarding & live telematics sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Stage Step Progression Bar */}
        <div className="grid grid-cols-5 bg-slate-950/60 border-b border-slate-800 px-6 py-2.5 text-xs text-center">
          <div className={`flex items-center justify-center gap-1.5 font-bold ${stage === 'REQUEST' ? 'text-cyan-400' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-slate-800 border border-slate-700">1</span>
            <span>Request</span>
          </div>
          <div className={`flex items-center justify-center gap-1.5 font-bold ${stage === 'DISPATCH_45S' ? 'text-amber-400 animate-pulse' : stage !== 'REQUEST' ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-slate-800 border border-slate-700">2</span>
            <span>45s Dispatch</span>
          </div>
          <div className={`flex items-center justify-center gap-1.5 font-bold ${stage === 'ACCEPTED' ? 'text-cyan-400' : ['ARRIVED_OTP_VERIFY', 'IN_PROGRESS', 'COMPLETED'].includes(stage) ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-slate-800 border border-slate-700">3</span>
            <span>Driver Arriving</span>
          </div>
          <div className={`flex items-center justify-center gap-1.5 font-bold ${stage === 'ARRIVED_OTP_VERIFY' ? 'text-amber-400 animate-pulse' : ['IN_PROGRESS', 'COMPLETED'].includes(stage) ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-slate-800 border border-slate-700">4</span>
            <span>OTP Verify</span>
          </div>
          <div className={`flex items-center justify-center gap-1.5 font-bold ${['IN_PROGRESS', 'COMPLETED'].includes(stage) ? 'text-emerald-400 font-black' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-slate-800 border border-slate-700">5</span>
            <span>Live Monitor</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STAGE 1: TRIP REQUEST FORM */}
          {stage === 'REQUEST' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-3">
                  <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                    <Navigation className="w-4 h-4" /> Trip Details
                  </h4>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300">Passenger Type</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {(['School Student', 'College Student', 'Office Commuter'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setPassengerType(t)}
                          className={`px-2.5 py-2 rounded-lg text-xs font-bold border transition ${
                            passengerType === t
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
                              : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300">Pickup Address</label>
                    <div className="flex items-center gap-2 mt-1 px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-xs">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <input
                        type="text"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="bg-transparent w-full text-slate-200 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300">Dropoff Destination</label>
                    <div className="flex items-center gap-2 mt-1 px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-xs">
                      <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="bg-transparent w-full text-slate-200 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Fare & Vehicle Preview */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Estimated Fare (Single Ride)</span>
                    <div className="text-2xl font-black text-emerald-400 mt-0.5">₹{estimatedFare}</div>
                    <span className="text-[10px] text-slate-400">4.2 km · 12 mins ETA · 0 Peak Surcharge</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      AC Van TN 01 AB 1234
                    </span>
                    <div className="text-xs text-slate-300 mt-1">Driver: Kumar Swamy (4.8 ★)</div>
                  </div>
                </div>

                <button
                  onClick={handleRequestTrip}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  Dispatch Single Trip (Auto-Alert Near Driver)
                </button>
              </div>

              {/* Map Preview */}
              <div className="h-72 md:h-full min-h-[280px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
                <CityMap mode="parent" />
              </div>
            </div>
          )}

          {/* STAGE 2: 45-SECOND COUNTDOWN DISPATCH */}
          {stage === 'DISPATCH_45S' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left: Driver Dispatch & Circular Timer */}
              <div className="bg-slate-800/80 border border-amber-500/40 rounded-2xl p-6 text-center space-y-4 shadow-xl shadow-amber-950/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 animate-pulse" />

                <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r={radius}
                      className="text-slate-700"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r={radius}
                      className="text-amber-400 transition-all duration-1000 ease-linear"
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-amber-400 font-mono">
                      00:{countdown < 10 ? `0${countdown}` : countdown}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-300/80 tracking-widest">
                      Remaining
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-black text-white">
                    Pinging Nearest Driver: Kumar Swamy
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    White Mercedes Van (TN 01 AB 1234) is 0.4 km away. Driver has 45 seconds to accept before next nearby cab is routed.
                  </p>
                </div>

                {/* Simulated Driver Actions Bar */}
                <div className="pt-2 border-t border-slate-700 flex gap-3">
                  <button
                    onClick={handleDriverAccept}
                    className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 animate-bounce"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Driver Accepts (45s)
                  </button>
                  <button
                    onClick={() => {
                      setCountdown(45);
                      playAudioTone('alert');
                    }}
                    className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold rounded-xl text-slate-300"
                  >
                    Pass
                  </button>
                </div>
              </div>

              {/* Right: Passenger OTP Preview Card */}
              <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/40 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" /> Passenger Pickup OTP
                  </span>
                  <span className="text-xs text-slate-400">Show to driver upon arrival</span>
                </div>

                <div className="bg-slate-900/90 border-2 border-dashed border-cyan-500/60 rounded-xl p-5 text-center space-y-2">
                  <div className="text-4xl font-black text-cyan-300 tracking-[0.3em] font-mono select-all">
                    {generatedOtp}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedOtp);
                      setCopiedOtp(true);
                      setTimeout(() => setCopiedOtp(false), 2500);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition"
                  >
                    {copiedOtp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedOtp ? 'Copied OTP!' : 'Copy OTP'}</span>
                  </button>
                </div>

                <div className="text-xs text-slate-300 space-y-1.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pickup:</span>
                    <span className="font-semibold text-white">{pickup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Destination:</span>
                    <span className="font-semibold text-white">{destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fare:</span>
                    <span className="font-bold text-emerald-400">₹{estimatedFare}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: DRIVER ACCEPTED & EN ROUTE */}
          {stage === 'ACCEPTED' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                    <CheckCircle2 className="w-5 h-5" /> Driver Accepted Trip!
                  </div>
                  <p className="text-xs text-slate-300">
                    Driver <strong>Kumar Swamy</strong> accepted the single trip within the 45s SLA and is currently navigating to your boarding gate.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-[10px] text-slate-400">Estimated Arrival</span>
                      <div className="text-base font-bold text-cyan-300">3 Mins</div>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-[10px] text-slate-400">Vehicle</span>
                      <div className="text-base font-bold text-cyan-300">TN 01 AB 1234</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Your Boarding OTP</span>
                    <div className="text-2xl font-black text-cyan-400 font-mono tracking-wider">{generatedOtp}</div>
                  </div>
                  <button
                    onClick={handleDriverArrived}
                    className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/30 flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" /> Driver Arrives at Gate
                  </button>
                </div>
              </div>

              <div className="h-64 bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                <CityMap mode="driver" />
              </div>
            </div>
          )}

          {/* STAGE 4: ARRIVED - DRIVER VERIFIES PASSENGER OTP */}
          {stage === 'ARRIVED_OTP_VERIFY' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="bg-slate-800/90 border border-cyan-500/60 rounded-2xl p-6 space-y-4 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">
                    Driver Verification Terminal
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Enter the 4-digit PIN provided by passenger <strong>{userName}</strong> to authorize boarding and start route tracking.
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 4-digit OTP"
                    className="w-48 mx-auto px-4 py-3 bg-slate-950 border-2 border-cyan-400 rounded-xl text-center text-2xl font-black text-cyan-300 tracking-[0.3em] font-mono outline-none shadow-inner"
                  />
                  {otpError && <p className="text-xs text-red-400 font-bold mt-2">{otpError}</p>}
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setEnteredOtp(generatedOtp)}
                    className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-bold rounded-lg border border-cyan-500/30"
                  >
                    Quick Auto-Fill ({generatedOtp})
                  </button>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Verify OTP & Start Single Trip
                </button>
              </div>

              {/* Passenger Side View Reminder */}
              <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Passenger View</span>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-300">Your Security Boarding PIN:</div>
                  <div className="text-3xl font-black text-cyan-300 font-mono tracking-widest">{generatedOtp}</div>
                  <p className="text-[11px] text-slate-400">
                    Verify that cab plate reads <strong>TN 01 AB 1234</strong> before sharing this PIN.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 5: IN PROGRESS & LIVE MONITORING */}
          {stage === 'IN_PROGRESS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-slate-800/80 border border-emerald-500/40 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400">Trip Status</span>
                  <div className="text-sm font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <Radio className="w-4 h-4 animate-ping text-emerald-400" /> IN PROGRESS
                  </div>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400">Telematics Speed</span>
                  <div className="text-sm font-black text-cyan-300 mt-0.5">{driverSpeed} km/h (Smooth)</div>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400">ETA to Destination</span>
                  <div className="text-sm font-black text-amber-300 mt-0.5">8 Mins Remaining</div>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400">SOS Siren</span>
                    <div className={`text-xs font-bold ${sosActive ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
                      {sosActive ? 'SIREN ACTIVE' : 'Normal'}
                    </div>
                  </div>
                  <button
                    onClick={handleToggleSos}
                    className={`p-2 rounded-lg font-bold text-xs border ${
                      sosActive
                        ? 'bg-red-600 text-white border-red-500 animate-bounce'
                        : 'bg-red-950/40 text-red-400 border-red-800/60 hover:bg-red-900/40'
                    }`}
                  >
                    <AlertOctagon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live Map */}
              <div className="h-72 bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                <CityMap mode="driver" />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-400">
                  Passenger: {userName} · Boarded via OTP {generatedOtp}
                </span>
                <button
                  onClick={handleCompleteTrip}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Complete Single Trip (Dropoff)
                </button>
              </div>
            </div>
          )}

          {/* STAGE 6: COMPLETED RECEIPT */}
          {stage === 'COMPLETED' && (
            <div className="max-w-md mx-auto bg-slate-800/90 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300">
                <Award className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-lg font-black text-white">Trip Completed Successfully!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Thank you for riding with SafePassage AI. Receipt logged into MySQL database.
                </p>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Trip ID:</span>
                  <span className="font-mono text-cyan-300">TRIP-SGL-{tripId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver:</span>
                  <span className="font-bold text-white">Kumar Swamy (TN 01 AB 1234)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Distance Traveled:</span>
                  <span className="font-bold text-white">4.2 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Amount Paid:</span>
                  <span className="font-black text-emerald-400 text-sm">₹{estimatedFare}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Mode:</span>
                  <span className="text-slate-200">Parent Wallet (Instant Settle)</span>
                </div>
              </div>

              {/* Rate Driver */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-1.5">Rate Your Trip Experience</span>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`text-xl transition ${s <= rating ? 'text-amber-400 scale-110' : 'text-slate-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setStage('REQUEST');
                  onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/25"
              >
                Done & Close Protocol
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
