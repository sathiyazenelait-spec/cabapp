import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Car,
  GitFork,
  Percent,
  ChevronDown,
  MapPin,
  Flame,
  Home,
  FileText,
  User,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { adminApi } from '../services/api';

interface RouteDemandRow {
  id: number;
  origin: string;
  destination: string;
  category: 'College' | 'Work' | 'School';
  categoryColor: string;
  demandCount: number;
  availableSeats: number;
  fillRate: number;
}

const mockTopRoutes: RouteDemandRow[] = [
  {
    id: 1,
    origin: 'Kattur',
    destination: 'ABC College',
    category: 'College',
    categoryColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    demandCount: 68,
    availableSeats: 12,
    fillRate: 85
  },
  {
    id: 2,
    origin: 'Kattur',
    destination: 'IT Park',
    category: 'Work',
    categoryColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    demandCount: 54,
    availableSeats: 10,
    fillRate: 84
  },
  {
    id: 3,
    origin: 'Ariyankuppam',
    destination: 'School',
    category: 'School',
    categoryColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    demandCount: 48,
    availableSeats: 8,
    fillRate: 86
  },
  {
    id: 4,
    origin: 'Lawspet',
    destination: 'College',
    category: 'College',
    categoryColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    demandCount: 41,
    availableSeats: 15,
    fillRate: 73
  },
  {
    id: 5,
    origin: 'Villupuram',
    destination: 'IT Park',
    category: 'Work',
    categoryColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    demandCount: 37,
    availableSeats: 9,
    fillRate: 80
  }
];

interface DemandAnalyticsProps {
  onBack?: () => void;
  isStandalonePhone?: boolean;
}

export const DemandAnalytics: React.FC<DemandAnalyticsProps> = ({
  onBack,
  isStandalonePhone = false
}) => {
  const [selectedDate, setSelectedDate] = useState('Apr 15, 2025');
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'analytics' | 'routes' | 'reports' | 'profile'>('analytics');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'School' | 'College' | 'Work'>('all');
  const [activeHeatZone, setActiveHeatZone] = useState<string | null>(null);
  const [showFullMapModal, setShowFullMapModal] = useState(false);

  // Live Backend State
  const [kpiStats, setKpiStats] = useState({
    totalDemand: 1248,
    totalDemandTrend: '12% vs last week',
    availableSeats: 892,
    availableSeatsTrend: '8% vs last week',
    activeRoutes: 86,
    activeRoutesTrend: '6% vs last week',
    avgFillRate: 71,
    avgFillRateTrend: '14% vs last week',
  });
  const [topRoutesList, setTopRoutesList] = useState<RouteDemandRow[]>(mockTopRoutes);

  useEffect(() => {
    adminApi.getDemandOverview(selectedDate).then((res: any) => {
      if (res) {
        setKpiStats({
          totalDemand: res.totalDemand || 1248,
          totalDemandTrend: res.totalDemandTrend || '12% vs last week',
          availableSeats: res.availableSeats || 892,
          availableSeatsTrend: res.availableSeatsTrend || '8% vs last week',
          activeRoutes: res.activeRoutes || 86,
          activeRoutesTrend: res.activeRoutesTrend || '6% vs last week',
          avgFillRate: res.avgFillRate || 71,
          avgFillRateTrend: res.avgFillRateTrend || '14% vs last week',
        });
        if (res.topDemandRoutes && Array.isArray(res.topDemandRoutes)) {
          setTopRoutesList(res.topDemandRoutes);
        }
      }
    }).catch(() => {});
  }, [selectedDate]);

  const datesList = ['Apr 15, 2025', 'Apr 14, 2025', 'Apr 13, 2025', 'Last 7 Days', 'This Month'];

  const filteredRoutes = selectedCategoryFilter === 'all' 
    ? topRoutesList 
    : topRoutesList.filter(r => r.category === selectedCategoryFilter);

  return (
    <div className={`flex flex-col bg-[#081024] text-slate-100 ${isStandalonePhone ? 'w-full max-w-[390px] h-[820px] rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden relative' : 'w-full max-w-xl mx-auto rounded-3xl border border-emerald-500/20 shadow-2xl overflow-hidden'}`}>
      
      {/* Mobile Top Status Bar */}
      <div className="px-6 pt-3 pb-1 flex justify-between items-center text-[11px] font-semibold text-slate-300 bg-[#081024] select-none">
        <span>9:41</span>
        <div className="flex items-center space-x-1.5 text-xs">
          <span>📶</span>
          <span>⚡ 5G</span>
          <span>🔋 100%</span>
        </div>
      </div>

      {/* Screen Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-950/60 via-slate-900/70 to-slate-900/80 border-b border-emerald-500/20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h1 className="text-base font-bold text-white tracking-wide">Demand Analytics</h1>
          </div>
        </div>

        {/* Date Selector Dropdown Button */}
        <div className="relative">
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px]">{selectedDate}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showDatePicker && (
            <div className="absolute right-0 mt-1.5 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs animate-fadeIn">
              {datesList.map(date => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[11px] hover:bg-slate-800 ${
                    selectedDate === date ? 'text-emerald-400 font-bold bg-emerald-950/30' : 'text-slate-300'
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Main Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 custom-scrollbar">
        
        {/* 4 Stat KPI Cards Grid (2x2) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Total Demand */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Total Demand</span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-black text-white">{kpiStats.totalDemand.toLocaleString()}</div>
              <div className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> {kpiStats.totalDemandTrend}
              </div>
            </div>
          </div>

          {/* Available Seats */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-sky-400 flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Available Seats</span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-black text-white">{kpiStats.availableSeats.toLocaleString()}</div>
              <div className="text-[9px] font-bold text-rose-400 flex items-center gap-0.5 mt-0.5">
                <TrendingDown className="w-2.5 h-2.5" /> {kpiStats.availableSeatsTrend}
              </div>
            </div>
          </div>

          {/* Active Routes */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <GitFork className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Active Routes</span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-black text-white">{kpiStats.activeRoutes}</div>
              <div className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> {kpiStats.activeRoutesTrend}
              </div>
            </div>
          </div>

          {/* Avg. Fill Rate */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Avg. Fill Rate</span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-black text-white">{kpiStats.avgFillRate}%</div>
              <div className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> {kpiStats.avgFillRateTrend}
              </div>
            </div>
          </div>
        </div>

        {/* Demand by Category Card with Donut Chart */}
        <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-md space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-white">Demand by Category</h2>
            <div className="flex gap-1 text-[9px]">
              {(['all', 'School', 'College', 'Work'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded-md font-semibold transition ${
                    selectedCategoryFilter === cat 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-around py-1">
            {/* SVG Donut Chart */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="12"
                />
                {/* Segment 1: Work (40% -> Teal #10b981) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray="238.76"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* Segment 2: School (32% -> Blue #3b82f6) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDasharray="76.4 238.76"
                  strokeDashoffset="-95.5"
                  strokeLinecap="round"
                />
                {/* Segment 3: College (28% -> Indigo #6366f1) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#6366f1"
                  strokeWidth="12"
                  strokeDasharray="66.8 238.76"
                  strokeDashoffset="-171.9"
                  strokeLinecap="round"
                />
              </svg>

              {/* Donut Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[8px] text-slate-400 font-semibold uppercase">Total Demand</span>
                <span className="text-sm font-black text-white leading-none mt-0.5">1,248</span>
              </div>
            </div>

            {/* Donut Chart Legend Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                <div className="flex justify-between w-32">
                  <span className="text-slate-300 font-semibold text-[11px]">School</span>
                  <div className="text-right">
                    <span className="text-white font-bold text-[11px]">32%</span>
                    <span className="text-[9px] text-slate-400 ml-1.5">399</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
                <div className="flex justify-between w-32">
                  <span className="text-slate-300 font-semibold text-[11px]">College</span>
                  <div className="text-right">
                    <span className="text-white font-bold text-[11px]">28%</span>
                    <span className="text-[9px] text-slate-400 ml-1.5">349</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                <div className="flex justify-between w-32">
                  <span className="text-slate-300 font-semibold text-[11px]">Work</span>
                  <div className="text-right">
                    <span className="text-white font-bold text-[11px]">40%</span>
                    <span className="text-[9px] text-slate-400 ml-1.5">500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Demand Routes Card with Ranked Table */}
        <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-md space-y-2.5">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-white">Top Demand Routes</h2>
            <button 
              onClick={() => setSelectedCategoryFilter('all')}
              className="text-[10px] font-bold text-blue-400 hover:text-blue-300"
            >
              View All
            </button>
          </div>

          {/* Ranked Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[10px]">
                  <th className="pb-1.5 font-semibold">#</th>
                  <th className="pb-1.5 font-semibold">Route</th>
                  <th className="pb-1.5 font-semibold">Category</th>
                  <th className="pb-1.5 font-semibold text-right">Demand</th>
                  <th className="pb-1.5 font-semibold text-right">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2 text-slate-400 font-mono font-bold text-[10px]">{route.id}</td>
                    <td className="py-2 font-semibold text-white">
                      <div className="flex items-center space-x-1">
                        <span>{route.origin}</span>
                        <span className="text-slate-500">➔</span>
                        <span className="text-blue-200">{route.destination}</span>
                      </div>
                    </td>
                    <td className="py-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${route.categoryColor}`}>
                        {route.category}
                      </span>
                    </td>
                    <td className="py-2 text-right font-black text-white">{route.demandCount}</td>
                    <td className="py-2 text-right font-bold text-slate-300">{route.availableSeats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demand Heat Map Section */}
        <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-md space-y-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <h2 className="text-xs font-bold text-white">Demand Heat Map</h2>
            </div>
            <button 
              onClick={() => setShowFullMapModal(true)}
              className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
            >
              <span>View Map</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Interactive Heat Map Graphics Box */}
          <div className="relative w-full h-40 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shadow-inner group">
            {/* Map Graphic Layer with stylized roads & coastline */}
            <svg className="w-full h-full opacity-60" viewBox="0 0 340 160">
              {/* Coastline */}
              <path
                d="M 270 0 Q 250 80 290 160"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="6"
                opacity="0.3"
              />
              <path
                d="M 275 0 Q 255 80 295 160 L 340 160 L 340 0 Z"
                fill="#0369a1"
                opacity="0.15"
              />

              {/* Road Grid Lines */}
              <line x1="20" y1="120" x2="260" y2="30" stroke="#334155" strokeWidth="2" strokeDasharray="4 2" />
              <line x1="60" y1="20" x2="220" y2="140" stroke="#334155" strokeWidth="2" strokeDasharray="4 2" />
              <line x1="120" y1="140" x2="280" y2="110" stroke="#334155" strokeWidth="1.5" />
              
              {/* Main Active Corridor Line (Kattur -> ABC College) */}
              <line 
                x1="110" 
                y1="110" 
                x2="230" 
                y2="45" 
                stroke="#ef4444" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>

            {/* Glowing Heat Spots */}
            {/* Hotspot 1: Kattur (Very High - Red) */}
            <div 
              onClick={() => setActiveHeatZone('Kattur: 68 Commuters')}
              className="absolute left-[26%] top-[62%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group-hover:scale-110 transition"
            >
              <div className="w-14 h-14 rounded-full bg-red-500/30 blur-md animate-ping"></div>
              <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-red-500/70 blur-sm flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-white shadow-lg"></span>
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white bg-slate-900/90 px-1 py-0.2 rounded border border-red-500/40 whitespace-nowrap">
                Kattur
              </span>
            </div>

            {/* Hotspot 2: ABC College (High - Orange) */}
            <div 
              onClick={() => setActiveHeatZone('ABC College: 45 Arrivals')}
              className="absolute left-[68%] top-[26%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group-hover:scale-110 transition"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/30 blur-md"></div>
              <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-amber-500/70 blur-sm flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-white shadow-lg"></span>
              </div>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white bg-slate-900/90 px-1 py-0.2 rounded border border-amber-500/40 whitespace-nowrap">
                ABC College
              </span>
            </div>

            {/* Hotspot 3: IT Park (Medium - Green/Teal) */}
            <div 
              onClick={() => setActiveHeatZone('IT Park: 54 Commuters')}
              className="absolute left-[80%] top-[70%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group-hover:scale-110 transition"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/30 blur-md"></div>
              <div className="absolute inset-0 m-auto w-5 h-5 rounded-full bg-emerald-500/70 blur-sm flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white shadow-lg"></span>
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white bg-slate-900/90 px-1 py-0.2 rounded border border-emerald-500/40 whitespace-nowrap">
                IT Park
              </span>
            </div>

            {/* Hotspot 4: Lawspet Cluster (Green/Medium) */}
            <div className="absolute left-[45%] top-[78%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-emerald-500/25 blur-sm"></div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 block mx-auto"></span>
            </div>

            {/* Heat Zone Popup Indicator */}
            {activeHeatZone && (
              <div className="absolute top-2 left-2 bg-slate-900/95 border border-slate-700 text-[10px] text-white font-semibold px-2 py-1 rounded-lg shadow-xl animate-fadeIn">
                📍 {activeHeatZone}
              </div>
            )}
          </div>

          {/* Heat Intensity Legend */}
          <div className="flex items-center justify-between px-1 text-[9px] text-slate-300 pt-0.5">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Very High</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              <span>Low</span>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="px-4 py-2.5 bg-[#070e20] border-t border-slate-800/80 flex justify-around items-center select-none">
        <button 
          onClick={() => setActiveBottomNav('home')}
          className={`flex flex-col items-center space-y-0.5 ${activeBottomNav === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px]">Home</span>
        </button>
        <button 
          onClick={() => setActiveBottomNav('analytics')}
          className={`flex flex-col items-center space-y-0.5 relative ${activeBottomNav === 'analytics' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <div className="p-1 rounded-full bg-emerald-600/20 text-emerald-400">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[9px] text-emerald-400 font-bold">Analytics</span>
        </button>
        <button 
          onClick={() => setActiveBottomNav('routes')}
          className={`flex flex-col items-center space-y-0.5 ${activeBottomNav === 'routes' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <GitFork className="w-4 h-4" />
          <span className="text-[9px]">Routes</span>
        </button>
        <button 
          onClick={() => setActiveBottomNav('reports')}
          className={`flex flex-col items-center space-y-0.5 ${activeBottomNav === 'reports' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[9px]">Reports</span>
        </button>
        <button 
          onClick={() => setActiveBottomNav('profile')}
          className={`flex flex-col items-center space-y-0.5 ${activeBottomNav === 'profile' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <User className="w-4 h-4" />
          <span className="text-[9px]">Profile</span>
        </button>
      </div>

      {/* Full Heat Map Expansion Modal */}
      {showFullMapModal && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                Live City-Wide Heat Zones
              </h3>
              <button onClick={() => setShowFullMapModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="font-bold text-white mb-1">Top Bottleneck Corridors:</div>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  <li>🔴 <strong>Kattur ➔ ABC College:</strong> 68 Commuters (Deficit: 8 seats)</li>
                  <li>🟠 <strong>Lawspet ➔ IT Park:</strong> 54 Commuters (Deficit: 4 seats)</li>
                  <li>🟢 <strong>Villupuram ➔ Campus:</strong> Balanced (37 Commuters, 9 seats)</li>
                </ul>
              </div>

              <div className="p-2 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-[10px] text-emerald-300">
                ⚡ Recommendation: Auto-assign 2 standby cabs to Kattur Hub for morning 7:30 AM dispatch.
              </div>
            </div>

            <button
              onClick={() => setShowFullMapModal(false)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
            >
              Return to Analytics
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
