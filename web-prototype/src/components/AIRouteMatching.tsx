import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  ArrowLeft,
  Clock,
  Users,
  Star,
  ShieldCheck,
  ChevronRight,
  Lightbulb,
  Home,
  Search,
  Calendar,
  User,
  CheckCircle2,
  Sliders,
  MapPin,
  Car,
  Filter,
  DollarSign,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { studentWorkApi } from '../services/api';

interface RouteMatch {
  id: string;
  matchScore: number;
  matchColor: string;
  category: string;
  pickup: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  seatsAvailable: number;
  vehicleType: string;
  vehiclePlate: string;
  seater: string;
  isAc: boolean;
  rating: number;
  isVerified: boolean;
  priceMonthly: number;
  priceDaily: number;
  driverName: string;
  driverPhone: string;
}

const mockMatches: RouteMatch[] = [
  {
    id: 'rm-tambaram-635',
    matchScore: 99,
    matchColor: 'bg-amber-500 text-slate-950 font-black',
    category: 'School & College / 6:35 AM Tambaram Shift',
    pickup: 'Tambaram Sanatorium / Railway Station (GST Rd)',
    destination: 'Tambaram High School & College Campus',
    departureTime: '6:35 AM',
    arrivalTime: '7:05 AM',
    seatsAvailable: 5,
    vehicleType: 'Maruti Ertiga / AC Cab',
    vehiclePlate: 'TN-02-CD-5678',
    seater: '6 Seater AC',
    isAc: true,
    rating: 4.95,
    isVerified: true,
    priceMonthly: 3000,
    priceDaily: 75,
    driverName: 'Ravi Chandran',
    driverPhone: '+91 98401 23457'
  },
  {
    id: 'rm-thoraipakkam',
    matchScore: 98,
    matchColor: 'bg-sky-500 text-white',
    category: 'School / Late Pickup Case',
    pickup: 'Thoraipakkam Tollgate (OMR)',
    destination: 'Oakridge School, Thoraipakkam',
    departureTime: '9:45 PM',
    arrivalTime: '10:10 PM',
    seatsAvailable: 4,
    vehicleType: 'Force Traveller / Cab',
    vehiclePlate: 'TN-01-AB-1234',
    seater: '12 Seater',
    isAc: true,
    rating: 4.9,
    isVerified: true,
    priceMonthly: 3000,
    priceDaily: 75,
    driverName: 'Kumar Swamy',
    driverPhone: '+91 98401 23456'
  },
  {
    id: 'rm-1',
    matchScore: 95,
    matchColor: 'bg-emerald-500 text-white',
    category: 'Shared Ride',
    pickup: 'Kattur',
    destination: 'ABC College',
    departureTime: '7:30 AM',
    arrivalTime: '8:15 AM',
    seatsAvailable: 20,
    vehicleType: 'Van',
    vehiclePlate: 'TN-XX-5678',
    seater: '5 Seater',
    isAc: true,
    rating: 4.9,
    isVerified: true,
    priceMonthly: 2800,
    priceDaily: 93,
    driverName: 'Ramesh Kumar',
    driverPhone: '+91 98401 23456'
  },
  {
    id: 'rm-2',
    matchScore: 88,
    matchColor: 'bg-blue-600 text-white',
    category: 'College Route',
    pickup: 'Kattur',
    destination: 'Sri Venkateswara College',
    departureTime: '7:20 AM',
    arrivalTime: '8:10 AM',
    seatsAvailable: 12,
    vehicleType: 'Car',
    vehiclePlate: 'TN-XX-9012',
    seater: '4 Seater',
    isAc: true,
    rating: 4.8,
    isVerified: true,
    priceMonthly: 3200,
    priceDaily: 106,
    driverName: 'Sathish Verma',
    driverPhone: '+91 98401 77889'
  },
  {
    id: 'rm-3',
    matchScore: 82,
    matchColor: 'bg-amber-500 text-white',
    category: 'Work Route',
    pickup: 'Lawspet',
    destination: 'IT Park (Chennai)',
    departureTime: '8:00 AM',
    arrivalTime: '9:00 AM',
    seatsAvailable: 8,
    vehicleType: 'Van',
    vehiclePlate: 'TN-XX-3456',
    seater: '7 Seater',
    isAc: true,
    rating: 4.9,
    isVerified: true,
    priceMonthly: 3500,
    priceDaily: 116,
    driverName: 'K. Balaji',
    driverPhone: '+91 98401 99001'
  }
];

const mockNearbyMatches: RouteMatch[] = [
  {
    id: 'rm-4',
    matchScore: 78,
    matchColor: 'bg-indigo-600 text-white',
    category: 'Shared Ride',
    pickup: 'Kattur Outer Ring',
    destination: 'ABC College Campus 2',
    departureTime: '7:45 AM',
    arrivalTime: '8:30 AM',
    seatsAvailable: 6,
    vehicleType: 'Van',
    vehiclePlate: 'TN-XX-1122',
    seater: '6 Seater',
    isAc: true,
    rating: 4.7,
    isVerified: true,
    priceMonthly: 2900,
    priceDaily: 96,
    driverName: 'M. Anand',
    driverPhone: '+91 98401 33221'
  },
  {
    id: 'rm-5',
    matchScore: 74,
    matchColor: 'bg-sky-600 text-white',
    category: 'College Route',
    pickup: 'Gorimedu',
    destination: 'Sri Venkateswara College',
    departureTime: '7:15 AM',
    arrivalTime: '8:05 AM',
    seatsAvailable: 9,
    vehicleType: 'Traveller',
    vehiclePlate: 'TN-XX-4490',
    seater: '12 Seater',
    isAc: true,
    rating: 4.6,
    isVerified: true,
    priceMonthly: 2600,
    priceDaily: 86,
    driverName: 'D. Pandian',
    driverPhone: '+91 98401 55667'
  }
];

interface AIRouteMatchingProps {
  onBack?: () => void;
  onSelectRoute?: (route: RouteMatch) => void;
  isStandalonePhone?: boolean;
}

export const AIRouteMatching: React.FC<AIRouteMatchingProps> = ({
  onBack,
  onSelectRoute,
  isStandalonePhone = false
}) => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'nearby'>('recommended');
  const [selectedRoute, setSelectedRoute] = useState<RouteMatch | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'search' | 'aimatch' | 'bookings' | 'profile'>('aimatch');
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [filterPickup, setFilterPickup] = useState('Kattur');
  const [filterDestination, setFilterDestination] = useState('ABC College');
  const [filterMaxBudget, setFilterMaxBudget] = useState(4000);
  const [recommendedMatches, setRecommendedMatches] = useState<RouteMatch[]>(mockMatches);
  const [nearbyMatches, setNearbyMatches] = useState<RouteMatch[]>(mockNearbyMatches);
  const [insightText, setInsightText] = useState<string>('High demand for Kattur ➔ ABC College route. Consider adding 2 more vehicles to increase availability.');

  useEffect(() => {
    studentWorkApi.getAIMatches(filterPickup, filterDestination, activeTab, filterMaxBudget).then((res: any) => {
      if (res && res.recommended && Array.isArray(res.recommended)) {
        setRecommendedMatches(res.recommended);
      }
      if (res && res.nearby && Array.isArray(res.nearby)) {
        setNearbyMatches(res.nearby);
      }
      if (res && res.aiInsight) {
        setInsightText(res.aiInsight);
      }
    }).catch(() => {});
  }, [filterPickup, filterDestination, activeTab, filterMaxBudget]);

  const displayMatches = activeTab === 'recommended' ? recommendedMatches : nearbyMatches;

  const handleRouteClick = (route: RouteMatch) => {
    setSelectedRoute(route);
    setShowBookingModal(true);
    setBookingConfirmed(false);
    if (onSelectRoute) {
      onSelectRoute(route);
    }
  };

  const handleConfirmReservation = async () => {
    if (selectedRoute) {
      try {
        await studentWorkApi.bookSeat('student@safepassage.ai', selectedRoute.id, 'MONTHLY');
      } catch (err) {
        console.log('Book seat live fallback');
      }
    }
    setBookingConfirmed(true);
  };

  return (
    <div className={`flex flex-col bg-[#0b1329] text-slate-100 ${isStandalonePhone ? 'w-full max-w-[390px] h-[820px] rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden relative' : 'w-full max-w-xl mx-auto rounded-3xl border border-blue-500/20 shadow-2xl overflow-hidden'}`}>
      
      {/* Mobile Top Status Bar */}
      <div className="px-6 pt-3 pb-1 flex justify-between items-center text-[11px] font-semibold text-slate-300 bg-[#0b1329] select-none">
        <span>9:41</span>
        <div className="flex items-center space-x-1.5 text-xs">
          <span>📶</span>
          <span>⚡ 5G</span>
          <span>🔋 100%</span>
        </div>
      </div>

      {/* Screen Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-blue-900/60 border-b border-blue-500/20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
            <h1 className="text-base font-bold text-white tracking-wide">AI Route Matching</h1>
          </div>
        </div>

        <button 
          onClick={() => setShowPreferencesModal(true)}
          className="p-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 relative"
          title="AI Assistant & Match Parameters"
        >
          <Bot className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      </div>

      {/* Scrollable Main Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 custom-scrollbar">
        
        {/* Smart Match For You Top Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/40 to-indigo-900/30 border border-blue-500/20 shadow-md">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-xs shadow-md shadow-blue-500/30 flex-shrink-0">
              AI
            </div>
            <div className="flex-1">
              <h2 className="text-xs font-bold text-white leading-tight">Smart Match for You</h2>
              <p className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">
                Based on your location, destination, time, budget and travel preference.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Recommended Routes / Nearby Options */}
        <div className="p-1 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center">
          <button
            onClick={() => setActiveTab('recommended')}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition ${
              activeTab === 'recommended'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Recommended Routes
          </button>
          <button
            onClick={() => setActiveTab('nearby')}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition ${
              activeTab === 'nearby'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Nearby Options
          </button>
        </div>

        {/* Route Match Cards List */}
        <div className="space-y-3">
          {displayMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => handleRouteClick(match)}
              className="group p-3.5 rounded-2xl bg-slate-900/95 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/40 shadow-lg hover:shadow-blue-500/10 cursor-pointer transition transform active:scale-[0.99]"
            >
              {/* Header Badges: Match % and Category Pill */}
              <div className="flex justify-between items-center mb-2">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${match.matchColor} shadow-sm`}>
                  {match.matchScore}% Match
                </span>
                <span className="text-[10px] font-semibold text-blue-300 border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                  {match.category}
                </span>
              </div>

              {/* Route Direction */}
              <div className="flex items-center space-x-2 my-1.5">
                <div className="flex flex-col items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <div className="w-0.5 h-3 bg-slate-600"></div>
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-white flex-1">
                  <span>{match.pickup}</span>
                  <span className="text-slate-400">➔</span>
                  <span className="text-blue-200">{match.destination}</span>
                </div>
              </div>

              {/* Timings & Capacity Info */}
              <div className="flex items-center justify-between text-[11px] text-slate-300 my-2 pt-1 border-t border-slate-800/80">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{match.departureTime} - {match.arrivalTime}</span>
                </div>
                <div className="flex items-center space-x-1 text-slate-300">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{match.seatsAvailable} seats available</span>
                </div>
              </div>

              {/* Vehicle & Driver Info Row + Price Box */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center space-x-2.5">
                  {/* Vehicle Graphic Thumbnail */}
                  <div className="w-12 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300 group-hover:border-blue-500/40">
                    <Car className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">
                      {match.vehicleType} {match.vehiclePlate}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {match.seater} • {match.isAc ? 'AC' : 'Non-AC'}
                    </div>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-amber-300">{match.rating}</span>
                      <span className="text-[9px] text-sky-400 font-semibold flex items-center gap-0.5 ml-1">
                        <ShieldCheck className="w-2.5 h-2.5" /> Verified Driver
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="text-right">
                  <div className="text-xs font-black text-white">
                    ₹{match.priceMonthly.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/month</span>
                  </div>
                  <div className="text-[9px] text-slate-400">
                    ₹{match.priceDaily}/day
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights Banner at Bottom */}
        <div 
          onClick={() => setShowInsightModal(true)}
          className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/70 to-indigo-950/60 border border-blue-500/30 hover:border-blue-400 cursor-pointer shadow-md flex items-start space-x-2.5 transition"
        >
          <div className="p-1.5 rounded-xl bg-blue-600/30 text-sky-400 flex-shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">AI Insights</div>
            <p className="text-[10px] text-slate-200 mt-0.5 leading-snug">
              {insightText}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 self-center" />
        </div>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="px-4 py-2.5 bg-[#090f20] border-t border-slate-800/80 flex justify-around items-center select-none">
        <button 
          onClick={() => setActiveBottomNav('home')}
          className={`flex flex-col items-center space-y-0.5 ${activeBottomNav === 'home' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px]">Home</span>
        </button>
        <button 
          onClick={() => setActiveBottomNav('search')}
          className={`flex flex-col items-center space-y-0.5 ${activeBottomNav === 'search' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Search className="w-4 h-4" />
          <span className="text-[9px]">Search</span>
        </button>
        <button 
          onClick={() => setActiveBottomNav('aimatch')}
          className={`flex flex-col items-center space-y-0.5 relative ${activeBottomNav === 'aimatch' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <div className="p-1 rounded-full bg-blue-600/20 text-blue-400">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-[9px] text-blue-400 font-bold">AI Match</span>
        </button>
        <button 
          onClick={() => setActiveBottomNav('bookings')}
          className={`flex flex-col items-center space-y-0.5 ${activeBottomNav === 'bookings' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[9px]">Bookings</span>
        </button>
        <button 
          onClick={() => setActiveBottomNav('profile')}
          className={`flex flex-col items-center space-y-0.5 ${activeBottomNav === 'profile' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <User className="w-4 h-4" />
          <span className="text-[9px]">Profile</span>
        </button>
      </div>

      {/* Booking Confirmation / Route Detail Modal */}
      {showBookingModal && selectedRoute && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-blue-500/40 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${selectedRoute.matchColor}`}>
                  {selectedRoute.matchScore}% Match
                </span>
                <span className="text-xs font-bold text-white">{selectedRoute.category}</span>
              </div>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            {!bookingConfirmed ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{selectedRoute.pickup} ➔ {selectedRoute.destination}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>Time: {selectedRoute.departureTime} to {selectedRoute.arrivalTime}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Vehicle: {selectedRoute.vehicleType} ({selectedRoute.vehiclePlate}) - {selectedRoute.seater}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Driver: {selectedRoute.driverName} ({selectedRoute.driverPhone})</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/20 flex justify-between items-center">
                  <span className="text-[11px] text-slate-300 font-medium">Monthly Seat Fee:</span>
                  <span className="text-sm font-black text-white">₹{selectedRoute.priceMonthly.toLocaleString()}</span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReservation}
                    className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30"
                  >
                    Confirm & Reserve
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-white">Smart Match Reserved!</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Your seat on <strong>{selectedRoute.vehiclePlate}</strong> is provisionally reserved. Driver {selectedRoute.driverName} has been notified.
                </p>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Preferences Modal */}
      {showPreferencesModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-blue-500/40 rounded-3xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-sky-400" />
                AI Match Parameters
              </h3>
              <button onClick={() => setShowPreferencesModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Pickup Area</label>
              <input 
                type="text" 
                value={filterPickup}
                onChange={(e) => setFilterPickup(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Destination</label>
              <input 
                type="text" 
                value={filterDestination}
                onChange={(e) => setFilterDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 flex justify-between mb-1">
                <span>Max Monthly Budget</span>
                <span className="text-sky-400 font-bold">₹{filterMaxBudget}</span>
              </label>
              <input 
                type="range" 
                min="1500" 
                max="6000" 
                step="200"
                value={filterMaxBudget}
                onChange={(e) => setFilterMaxBudget(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <button
              onClick={() => setShowPreferencesModal(false)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition mt-2"
            >
              Apply AI Re-ranking
            </button>
          </div>
        </div>
      )}

      {/* AI Insights Modal */}
      {showInsightModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-sky-400" />
                AI Fleet Route Recommendation
              </h3>
              <button onClick={() => setShowInsightModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-500/20 space-y-2">
              <p className="text-[11px] text-slate-200">
                <strong>Route:</strong> Kattur ➔ ABC College (Morning 7:30 AM peak)
              </p>
              <p className="text-[11px] text-slate-300">
                <strong>Current Demand:</strong> 68 Commuters seeking rides.
              </p>
              <p className="text-[11px] text-slate-300">
                <strong>Supply:</strong> 2 Active Cabs (20 Seats Available).
              </p>
              <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                💡 Suggested Action: Deploy 2 additional 7-seater vans to capture ₹56,000/mo additional revenue.
              </div>
            </div>

            <button
              onClick={() => setShowInsightModal(false)}
              className="w-full py-2 bg-slate-800 text-slate-200 font-bold rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
