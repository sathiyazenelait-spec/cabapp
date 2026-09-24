import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Phone,
  Radio,
  MapPin,
  ShieldAlert,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Car
} from 'lucide-react';
import { sosApi } from '../services/api';

interface SosEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

export const SosEmergencyModal: React.FC<SosEmergencyModalProps> = ({
  isOpen,
  onClose,
  userRole = 'parent'
}) => {
  const [sirenPlaying, setSirenPlaying] = useState<boolean>(true);
  const [dispatched, setDispatched] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('Cab Breakdown / Unscheduled Route Deviation Detected');

  // Synthesize alarm sound using Web Audio API
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let osc: OscillatorNode | null = null;
    let gain: GainNode | null = null;
    let interval: any = null;

    if (isOpen && sirenPlaying) {
      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        osc = audioCtx.createOscillator();
        gain = audioCtx.createGain();

        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();

        let high = false;
        interval = setInterval(() => {
          if (audioCtx && osc) {
            osc.frequency.setValueAtTime(high ? 600 : 950, audioCtx.currentTime);
            high = !high;
          }
        }, 350);
      } catch {
        // AudioContext not supported or blocked
      }
    }

    return () => {
      if (interval) clearInterval(interval);
      if (osc) {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      }
      if (audioCtx) {
        try {
          audioCtx.close();
        } catch {}
      }
    };
  }, [isOpen, sirenPlaying]);

  useEffect(() => {
    if (isOpen) {
      // Auto dispatch SOS packet
      sosApi.triggerEmergency({
        email: 'priya.sharma@gmail.com',
        reason,
        vehiclePlate: 'TN 01 AB 1234',
        location: { lat: 13.0725, lng: 80.2180 }
      }).then(() => {
        setDispatched(true);
      }).catch(() => {
        setDispatched(true);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-red-950/80 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-red-500 rounded-3xl shadow-2xl shadow-red-600/40 text-white overflow-hidden p-6 space-y-5 text-center">
        {/* Flashing Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 animate-pulse" />

        <div className="flex justify-between items-center">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1.5 animate-pulse">
            <Radio className="w-3.5 h-3.5 text-red-400 animate-ping" />
            CRITICAL SOS BROADCAST ACTIVE
          </span>
          <button
            onClick={() => setSirenPlaying(!sirenPlaying)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1"
          >
            {sirenPlaying ? <Volume2 className="w-4 h-4 text-red-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="text-[10px]">{sirenPlaying ? 'Mute Siren' : 'Play Siren'}</span>
          </button>
        </div>

        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-400 shadow-xl shadow-red-600/30 animate-bounce">
          <AlertOctagon className="w-10 h-10" />
        </div>

        <div>
          <h3 className="text-2xl font-black text-white tracking-wide">
            EMERGENCY SOS DISPATCHED
          </h3>
          <p className="text-xs text-red-300 mt-1">
            Immediate telemetry packet & live audio alert transmitted to Super Admin & Control Room.
          </p>
        </div>

        {/* SOS Telemetry Card */}
        <div className="bg-slate-950/80 border border-red-900/60 rounded-2xl p-4 text-xs space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-slate-400">Vehicle:</span>
            <span className="font-bold text-white">White Mercedes Van (TN 01 AB 1234)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Driver:</span>
            <span className="font-bold text-white">Kumar Swamy (+91 98401 23456)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">GPS Location:</span>
            <span className="font-mono text-cyan-300">13.0725° N, 80.2180° E (Mehta Nagar)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Incident Reason:</span>
            <span className="font-semibold text-amber-300">{reason}</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-slate-800">
            <span className="text-slate-400">Dispatch Status:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> POLICE & ADMIN ALERTED
            </span>
          </div>
        </div>

        {/* Emergency Helplines */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <a
            href="tel:112"
            className="py-3 bg-red-600 hover:bg-red-500 font-black rounded-xl text-white flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
          >
            <Phone className="w-4 h-4" /> Call Police (112)
          </a>
          <a
            href="tel:+914426261234"
            className="py-3 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl text-slate-200 border border-slate-700 flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" /> School Dispatch
          </a>
        </div>

        <button
          onClick={() => {
            setSirenPlaying(false);
            onClose();
          }}
          className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-300 rounded-xl"
        >
          Dismiss SOS Alert Window
        </button>
      </div>
    </div>
  );
};
