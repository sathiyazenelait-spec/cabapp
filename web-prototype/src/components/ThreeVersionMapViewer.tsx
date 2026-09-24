import React, { useState } from 'react';
import {
  Map,
  Shield,
  Layers,
  Compass,
  Navigation,
  Sparkles,
  Users,
  Activity,
  AlertTriangle,
  Radio,
  Sliders,
  CheckCircle2,
  Maximize2,
  Minimize2,
  RefreshCw,
  Zap,
  Phone,
  Car
} from 'lucide-react';
import { CityMap } from './CityMap';

interface ThreeVersionMapViewerProps {
  onTriggerSos?: () => void;
  onRequestSingleTrip?: () => void;
}

export const ThreeVersionMapViewer: React.FC<ThreeVersionMapViewerProps> = ({
  onTriggerSos,
  onRequestSingleTrip
}) => {
  const [viewMode, setViewMode] = useState<'parent' | 'driver' | 'admin' | 'split'>('split');
  const [alertDistance, setAlertDistance] = useState<number>(0.5);
  const [theme, setTheme] = useState<'dark' | 'streets' | 'satellite'>('dark');
  const [activeSimulation, setActiveSimulation] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                🗺️ 3-Version Map Architecture
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Leaflet GPS Engine
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2 tracking-wide">
              Parent Radar vs Driver Waypoints vs Admin Heatmap
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Compare all 3 specialized map engines concurrently in Split Screen or inspect individual views with live telemetry and simulated vehicle routing.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onRequestSingleTrip && (
              <button
                onClick={onRequestSingleTrip}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-black rounded-xl shadow-md shadow-cyan-500/25 flex items-center gap-1.5 transition active:scale-95"
              >
                <Car className="w-4 h-4" /> Single Trip 45s Dispatch
              </button>
            )}
            {onTriggerSos && (
              <button
                onClick={onTriggerSos}
                className="px-4 py-2 bg-red-600/90 hover:bg-red-500 text-white text-xs font-black rounded-xl shadow-md shadow-red-600/30 flex items-center gap-1.5 transition active:scale-95"
              >
                <AlertTriangle className="w-4 h-4" /> Test SOS Siren
              </button>
            )}
          </div>
        </div>

        {/* View Mode Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-700/60">
          <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                viewMode === 'split'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> 3-Way Split Screen
            </button>
            <button
              onClick={() => setViewMode('parent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                viewMode === 'parent'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Version 1: Parent Radar
            </button>
            <button
              onClick={() => setViewMode('driver')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                viewMode === 'driver'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" /> Version 2: Driver Waypoints
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                viewMode === 'admin'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Version 3: Admin Heatmap
            </button>
          </div>

          {/* Parent Geofence Distance Slider */}
          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 font-semibold">Parent Radar Geofence:</span>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.1"
              value={alertDistance}
              onChange={(e) => setAlertDistance(parseFloat(e.target.value))}
              className="w-24 accent-cyan-400 cursor-pointer"
            />
            <span className="font-mono font-bold text-cyan-300">{alertDistance.toFixed(1)} miles</span>
          </div>
        </div>
      </div>

      {/* MAP DISPLAY AREA */}

      {/* SPLIT SCREEN: 3 MAPS SIDE-BY-SIDE */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Version 1: Parent View */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Version 1: Parent Radar Map
                </h4>
              </div>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                {alertDistance} mi Geofence
              </span>
            </div>
            <div className="h-96 relative bg-slate-950">
              <CityMap mode="parent" alertDistanceMiles={alertDistance} />
            </div>
            <div className="p-3 bg-slate-950 text-xs text-slate-300 border-t border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Child: Ananya Sharma</span>
                <span className="text-emerald-400">ETA: 6 Mins</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Safe Passage Radar notifies parent when cab crosses {alertDistance}-mile geofence perimeter.
              </p>
            </div>
          </div>

          {/* Version 2: Driver View */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Version 2: Driver Waypoints Map
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                Turn-by-Turn
              </span>
            </div>
            <div className="h-96 relative bg-slate-950">
              <CityMap mode="driver" />
            </div>
            <div className="p-3 bg-slate-950 text-xs text-slate-300 border-t border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Next Stop: Kasturba Nagar</span>
                <span className="text-cyan-400">Speed: 36 km/h</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Integrated stop checklist, conductor digital roster & dynamic OTP verification.
              </p>
            </div>
          </div>

          {/* Version 3: Super Admin View */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Version 3: Admin Heatmap Map
                </h4>
              </div>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                City Hotspots
              </span>
            </div>
            <div className="h-96 relative bg-slate-950">
              <CityMap mode="admin" />
            </div>
            <div className="p-3 bg-slate-950 text-xs text-slate-300 border-t border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Hotspots: 6 Clusters</span>
                <span className="text-amber-400">Demand: Very High 🔥</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Metropolitan aggregate demand clusters, corridor optimization & active fleet tracking.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE EXPANDED FULL VIEW */}
      {viewMode !== 'split' && (
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="text-base font-black text-white capitalize">
                {viewMode === 'parent' && 'Parent Radar Geofence Engine (0.5 to 2.0 mi)'}
                {viewMode === 'driver' && 'Driver Turn-by-Turn Waypoint & Passenger Boarding Engine'}
                {viewMode === 'admin' && 'Super Admin Metropolitan Aggregate Heatmap & Fleet Telemetry Engine'}
              </h3>
            </div>
            <span className="text-xs font-bold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-lg border border-cyan-800">
              Interactive Full-Screen Mode
            </span>
          </div>

          <div className="h-[550px] relative bg-slate-950">
            <CityMap mode={viewMode} alertDistanceMiles={alertDistance} />
          </div>
        </div>
      )}
    </div>
  );
};
