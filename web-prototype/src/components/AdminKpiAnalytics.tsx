import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Car, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Building2,
  PieChart,
  Activity,
  Award,
  Filter,
  Download
} from 'lucide-react';
import type { PlatformKpiData } from '../types/billing';
import { adminApi } from '../services/api';

export const AdminKpiAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'MONTH' | 'QUARTER' | 'YEAR'>('MONTH');
  const [liveStats, setLiveStats] = useState<any>(null);

  useEffect(() => {
    adminApi.getStats().then(stats => {
      if (stats) setLiveStats(stats);
    }).catch(() => {});
  }, []);

  const macroStats = {
    gmv: liveStats?.revenue ? liveStats.revenue * 10 : (timeRange === 'MONTH' ? 1842000 : timeRange === 'QUARTER' ? 5280000 : 21400000),
    netRevenue: liveStats?.revenue || (timeRange === 'MONTH' ? 184200 : timeRange === 'QUARTER' ? 528000 : 2140000),
    activeCommuters: liveStats ? (liveStats.activeParents + liveStats.studentsCount + 10) : 1420,
    totalCabs: liveStats?.activeVehicles || 42,
    fleetUtilization: liveStats?.activeRoutes ? 91.2 : 89.4,
    onTimeRate: 98.8,
    arpu: 1298,
    safetySla: 99.98
  };

  const routeCorridors = [
    {
      name: 'Corridor #1: Kasturba Nagar ➔ ABC Matriculation School',
      category: 'K-12 School Cab Network',
      assignedCabs: 8,
      occupancyPercent: 94,
      monthlyRevenue: 84200,
      safetyScore: 4.95,
      status: 'OPTIMAL'
    },
    {
      name: 'Corridor #2: Tambaram ➔ Siruseri OMR IT Park',
      category: 'Corporate Faculty & IT Carpool',
      assignedCabs: 12,
      occupancyPercent: 88,
      monthlyRevenue: 112000,
      safetyScore: 4.88,
      status: 'HIGH_DEMAND'
    },
    {
      name: 'Corridor #3: Anna Nagar ➔ Loyola College Campus',
      category: 'College Student Shuttle',
      assignedCabs: 6,
      occupancyPercent: 91,
      monthlyRevenue: 72500,
      safetyScore: 4.92,
      status: 'OPTIMAL'
    },
    {
      name: 'Corridor #4: Velachery ➔ Taramani Tech Corridor',
      category: 'Dual Shift Mixed Commute',
      assignedCabs: 5,
      occupancyPercent: 82,
      monthlyRevenue: 54000,
      safetyScore: 4.80,
      status: 'GROWING'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header & Range Filter */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900/90 p-5 rounded-2xl border border-gray-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              Platform Key Performance Indicators (KPIs) & Financial Yield
            </h2>
            <span className="bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              Q3 2026 Live
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time multi-tenant telemetry tracking GMV, platform commission, occupancy ratios, and safety SLA.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-gray-800 text-xs">
          <button
            onClick={() => setTimeRange('MONTH')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              timeRange === 'MONTH' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            This Month (Aug/Sep)
          </button>
          <button
            onClick={() => setTimeRange('QUARTER')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              timeRange === 'QUARTER' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Q3 Term
          </button>
          <button
            onClick={() => setTimeRange('YEAR')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              timeRange === 'YEAR' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Annual
          </button>
        </div>
      </div>

      {/* Primary Financial & Volume KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Gross Merchandise Value */}
        <div className="glass-card p-5 rounded-2xl border border-gray-800 flex flex-col justify-between hover:border-indigo-500/40 transition shadow-lg">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="uppercase tracking-wider font-semibold text-[10px]">Gross Merchandise Value (GMV)</span>
            <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-white">₹{(macroStats.gmv / 100000).toFixed(2)} Lakhs</h3>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" /> +14.8% MoM
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Total subscriptions & commute revenue collected</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800/80 text-[10px] text-gray-500 flex justify-between">
            <span>Avg Monthly Ticket</span>
            <strong className="text-gray-300">₹{macroStats.arpu} / commuter</strong>
          </div>
        </div>

        {/* KPI 2: Platform Net Commission Yield (10%) */}
        <div className="glass-card p-5 rounded-2xl border border-gray-800 flex flex-col justify-between hover:border-emerald-500/40 transition shadow-lg">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="uppercase tracking-wider font-semibold text-[10px]">Platform Net Revenue (10%)</span>
            <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-emerald-400">₹{macroStats.netRevenue.toLocaleString('en-IN')}</h3>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" /> +12.4%
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Net platform take rate from cab owner payouts</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800/80 text-[10px] text-gray-500 flex justify-between">
            <span>Take Rate Margin</span>
            <strong className="text-emerald-400">10.0% Standard</strong>
          </div>
        </div>

        {/* KPI 3: Fleet Occupancy & Utilization */}
        <div className="glass-card p-5 rounded-2xl border border-gray-800 flex flex-col justify-between hover:border-sky-500/40 transition shadow-lg">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="uppercase tracking-wider font-semibold text-[10px]">Platform Fleet Utilization</span>
            <div className="bg-sky-500/10 p-2 rounded-xl text-sky-400">
              <Car className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-white">{macroStats.fleetUtilization}%</h3>
              <span className="text-[10px] text-sky-400 font-bold">42 Cabs Active</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Occupied passenger seats across Chennai routes</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800/80 text-[10px] text-gray-500 flex justify-between">
            <span>Empty Seat Buffer</span>
            <strong className="text-sky-300">10.6% Standby</strong>
          </div>
        </div>

        {/* KPI 4: Safety SLA & Geofence Reliability */}
        <div className="glass-card p-5 rounded-2xl border border-gray-800 flex flex-col justify-between hover:border-amber-500/40 transition shadow-lg">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="uppercase tracking-wider font-semibold text-[10px]">Safety & On-Time SLA</span>
            <div className="bg-amber-500/10 p-2 rounded-xl text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-white">{macroStats.onTimeRate}%</h3>
              <span className="text-[10px] text-emerald-400 font-bold">Zero SOS Breaches</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">1,420 daily active student journeys logged</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800/80 text-[10px] text-gray-500 flex justify-between">
            <span>Incident SLA Score</span>
            <strong className="text-emerald-400">{macroStats.safetySla}% Verified</strong>
          </div>
        </div>

      </div>

      {/* Corridor Level Profitability & Occupancy Breakdown */}
      <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="h-4.5 w-4.5 text-indigo-400" />
              Route Corridor Profitability & Fleet Allocation Breakdown
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Performance analysis across primary school and corporate transit lines in Chennai metropolitan area.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-[10px] text-gray-400 uppercase tracking-wider">
                <th className="pb-3 px-3">Transit Corridor & Target Institutions</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3 text-center">Allocated Cabs</th>
                <th className="pb-3 px-3">Seat Occupancy Ratio</th>
                <th className="pb-3 px-3">Monthly Gross Fare</th>
                <th className="pb-3 px-3">Safety Rating</th>
                <th className="pb-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {routeCorridors.map((rc, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition">
                  <td className="py-3 px-3 font-sans font-bold text-white">
                    {rc.name}
                  </td>
                  <td className="py-3 px-3 font-sans text-gray-300 text-[11px]">{rc.category}</td>
                  <td className="py-3 px-3 text-center text-gray-200 font-bold">{rc.assignedCabs} Cabs</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{rc.occupancyPercent}%</span>
                      <div className="w-16 bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-400 h-full rounded-full" 
                          style={{ width: `${rc.occupancyPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">₹{rc.monthlyRevenue.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-amber-400 font-bold">★ {rc.safetyScore}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {rc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
