import React, { useState } from 'react';
import {
  Sparkles,
  BarChart3,
  Bell,
  Smartphone,
  Layers,
  ArrowRight,
  Maximize2,
  RefreshCw,
  Send,
  Zap,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { AIRouteMatching } from './AIRouteMatching';
import { DemandAnalytics } from './DemandAnalytics';
import { NotificationCenter } from './NotificationCenter';

export const ThreeModulesShowcase: React.FC = () => {
  const [selectedModuleView, setSelectedModuleView] = useState<'all' | 'ai_match' | 'analytics' | 'notifications'>('all');
  const [liveToast, setLiveToast] = useState<string | null>(null);

  const triggerLiveAlert = (title: string, msg: string) => {
    setLiveToast(`🔔 [${title}]: ${msg}`);
    setTimeout(() => setLiveToast(null), 4000);
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Top Banner with Module Selector */}
      <div className="glass-card p-5 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px] px-3 py-1 rounded-full border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> 3-in-1 NextGen Core Suite
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Live Interactive Simulator
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            AI Route Matching • Demand Analytics • Notification Center
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl">
            Interactive side-by-side showcase of the 3 newly built modules designed for commuters, fleet operators, parents, and platform administrators.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedModuleView('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedModuleView === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20 border border-indigo-400/40'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>3-Device Showcase</span>
          </button>

          <button
            onClick={() => setSelectedModuleView('ai_match')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedModuleView === 'ai_match'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 border border-blue-400/40'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>1. AI Route Matching</span>
          </button>

          <button
            onClick={() => setSelectedModuleView('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedModuleView === 'analytics'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/40'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-300" />
            <span>2. Demand Analytics</span>
          </button>

          <button
            onClick={() => setSelectedModuleView('notifications')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedModuleView === 'notifications'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20 border border-rose-400/40'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-rose-300" />
            <span>3. Notifications</span>
          </button>
        </div>
      </div>

      {/* Simulated Live Broadcast Bar */}
      <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-200">Interactive Simulation Hub:</span>
          <span className="text-slate-400 hidden sm:inline">Trigger cross-module events across all 3 phone screens simultaneously</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerLiveAlert('Child Boarded', 'Arun Kumar boarded Van TN-XX-1234 at Kattur')}
            className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] font-semibold transition flex items-center gap-1"
          >
            <span>🟢 Simulate Boarding</span>
          </button>

          <button
            onClick={() => triggerLiveAlert('Demand Spike', 'New batch of 14 commuters requested Kattur route')}
            className="px-2.5 py-1 bg-blue-500/15 hover:bg-blue-500/25 text-sky-300 border border-blue-500/30 rounded-lg text-[11px] font-semibold transition flex items-center gap-1"
          >
            <span>📈 Simulate Demand Spike</span>
          </button>

          <button
            onClick={() => triggerLiveAlert('Emergency SOS', 'SOS triggered in vehicle TN-XX-9012 near Lawspet')}
            className="px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-lg text-[11px] font-semibold transition flex items-center gap-1"
          >
            <span>🚨 Simulate SOS Alert</span>
          </button>
        </div>
      </div>

      {/* Floating Simulation Toast */}
      {liveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-indigo-500 px-4 py-3 rounded-2xl shadow-2xl animate-bounce flex items-center gap-2 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>{liveToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3-PHONE SIDE-BY-SIDE SHOWCASE (MATCHING USER'S EXACT HERO LAYOUT) */}
      {/* ========================================================================= */}
      {selectedModuleView === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start justify-center max-w-[1360px] mx-auto pt-2">
          
          {/* 1. AI Route Matching Column */}
          <div className="flex flex-col items-center space-y-3">
            {/* Header Pill & Subtitle Banner */}
            <div className="text-center space-y-1.5 w-full max-w-[390px]">
              <div className="inline-block bg-[#3c41cf] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                1. AI Route Matching Module
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Find the best routes, matched with people going your way.
              </p>
            </div>

            {/* Phone Frame 1 */}
            <AIRouteMatching isStandalonePhone={true} />
          </div>

          {/* 2. Demand Analytics Column */}
          <div className="flex flex-col items-center space-y-3">
            {/* Header Pill & Subtitle Banner */}
            <div className="text-center space-y-1.5 w-full max-w-[390px]">
              <div className="inline-block bg-[#0e8a57] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                2. Demand Analytics Module
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                See real-time demand and make better decisions.
              </p>
            </div>

            {/* Phone Frame 2 */}
            <DemandAnalytics isStandalonePhone={true} />
          </div>

          {/* 3. Notification Center Column */}
          <div className="flex flex-col items-center space-y-3">
            {/* Header Pill & Subtitle Banner */}
            <div className="text-center space-y-1.5 w-full max-w-[390px]">
              <div className="inline-block bg-[#d93848] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                3. Notification Center Module
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Stay updated with all important alerts and messages.
              </p>
            </div>

            {/* Phone Frame 3 */}
            <NotificationCenter isStandalonePhone={true} />
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* DEDICATED EXPANDED VIEWS */}
      {/* ========================================================================= */}
      {selectedModuleView === 'ai_match' && (
        <div className="flex flex-col items-center justify-center py-4 animate-fadeIn">
          <div className="text-center space-y-1.5 mb-4">
            <div className="inline-block bg-[#3c41cf] text-white text-sm font-bold px-5 py-2 rounded-full shadow-md">
              1. AI Route Matching Module
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Find the best routes, matched with people going your way.
            </p>
          </div>
          <AIRouteMatching isStandalonePhone={true} />
        </div>
      )}

      {selectedModuleView === 'analytics' && (
        <div className="flex flex-col items-center justify-center py-4 animate-fadeIn">
          <div className="text-center space-y-1.5 mb-4">
            <div className="inline-block bg-[#0e8a57] text-white text-sm font-bold px-5 py-2 rounded-full shadow-md">
              2. Demand Analytics Module
            </div>
            <p className="text-xs text-slate-300 font-medium">
              See real-time demand and make better decisions.
            </p>
          </div>
          <DemandAnalytics isStandalonePhone={true} />
        </div>
      )}

      {selectedModuleView === 'notifications' && (
        <div className="flex flex-col items-center justify-center py-4 animate-fadeIn">
          <div className="text-center space-y-1.5 mb-4">
            <div className="inline-block bg-[#d93848] text-white text-sm font-bold px-5 py-2 rounded-full shadow-md">
              3. Notification Center Module
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Stay updated with all important alerts and messages.
            </p>
          </div>
          <NotificationCenter isStandalonePhone={true} />
        </div>
      )}

    </div>
  );
};
