import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Car, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Users, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Receipt,
  Download,
  Eye,
  Fuel,
  Award,
  Zap,
  Percent
} from 'lucide-react';
import type { UserSession } from '../types/auth';
import { MOCK_OWNER_INVOICES, type Invoice, type FleetKpiData } from '../types/billing';
import { InvoiceModal } from './InvoiceModal';
import { cabOwnerApi } from '../services/api';

interface CabOwnerDashboardProps {
  currentUser: UserSession;
}

interface FleetVehicle {
  id: string;
  regNumber: string;
  type: string;
  capacity: number;
  seatsFilled: number;
  driverName: string;
  driverPhone: string;
  route: string;
  status: 'ON_ROUTE' | 'IDLE' | 'MAINTENANCE';
  rcStatus: 'VERIFIED' | 'PENDING';
  fitnessStatus: 'VERIFIED' | 'PENDING';
}

export const CabOwnerDashboard: React.FC<CabOwnerDashboardProps> = ({ currentUser }) => {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([
    {
      id: 'v1',
      regNumber: 'TN 01 AB 1234',
      type: 'Force Traveller Van',
      capacity: 12,
      seatsFilled: 10,
      driverName: 'Kumar Swamy',
      driverPhone: '+91 98401 23456',
      route: 'Kasturba Nagar ➔ ABC Matriculation School',
      status: 'ON_ROUTE',
      rcStatus: 'VERIFIED',
      fitnessStatus: 'VERIFIED'
    },
    {
      id: 'v2',
      regNumber: 'TN 02 CD 5678',
      type: 'Maruti Ertiga (AC Cab)',
      capacity: 6,
      seatsFilled: 5,
      driverName: 'Ravi Chandran',
      driverPhone: '+91 98401 23457',
      route: 'Tambaram ➔ Chennai IT Park Corridor',
      status: 'ON_ROUTE',
      rcStatus: 'VERIFIED',
      fitnessStatus: 'VERIFIED'
    },
    {
      id: 'v3',
      regNumber: 'TN 14 EF 9012',
      type: 'Force Traveller Van',
      capacity: 15,
      seatsFilled: 0,
      driverName: 'Suresh Kumar',
      driverPhone: '+91 98401 23458',
      route: 'Anna Nagar ➔ Loyola College Campus',
      status: 'IDLE',
      rcStatus: 'VERIFIED',
      fitnessStatus: 'PENDING'
    },
    {
      id: 'v4',
      regNumber: 'TN 07 GH 3456',
      type: 'Tata Winger Executive',
      capacity: 10,
      seatsFilled: 0,
      driverName: 'Murugan P',
      driverPhone: '+91 98401 23459',
      route: 'Depot Standby',
      status: 'MAINTENANCE',
      rcStatus: 'PENDING',
      fitnessStatus: 'PENDING'
    }
  ]);

  // Invoices & Billing State
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_OWNER_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceFilter, setInvoiceFilter] = useState<'ALL' | 'PAID' | 'PROCESSING'>('ALL');

  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newRegNo, setNewRegNo] = useState('');
  const [newType, setNewType] = useState('Force Traveller Van (12 Seater)');
  const [newDriver, setNewDriver] = useState('');
  const [newCapacity, setNewCapacity] = useState('12');

  // Dynamic Fleet Fetching
  useEffect(() => {
    const loadFleet = async () => {
      try {
        const data = await cabOwnerApi.getFleet();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: FleetVehicle[] = data.map((v: any) => ({
            id: `v_${v.id || v.regNumber}`,
            regNumber: v.regNumber || v.reg_number,
            type: v.vehicleType || v.type || 'Van (12 Seater)',
            capacity: v.capacity || 12,
            seatsFilled: v.seatsFilled || 8,
            driverName: v.driverName || 'Kumar Swamy',
            driverPhone: v.driverPhone || '+91 98401 23456',
            route: v.route || 'Chennai Metro Corridor',
            status: (v.status || 'ON_ROUTE') as any,
            rcStatus: v.rc ? 'VERIFIED' : 'PENDING',
            fitnessStatus: v.fitnessCertificate ? 'VERIFIED' : 'PENDING'
          }));
          setVehicles(mapped);
        }
      } catch (e) {
        console.warn('Could not sync cab owner fleet from backend:', e);
      }
    };
    loadFleet();
  }, []);

  // KPI Calculations
  const totalCapacity = vehicles.reduce((acc, v) => acc + v.capacity, 0);
  const totalOccupied = vehicles.reduce((acc, v) => acc + v.seatsFilled, 0);
  const onRouteCabs = vehicles.filter(v => v.status === 'ON_ROUTE');
  const activeCapacity = onRouteCabs.reduce((acc, v) => acc + v.capacity, 0);
  const fleetUtilizationRate = activeCapacity > 0 ? Math.round((totalOccupied / activeCapacity) * 100) : 83;

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegNo || !newDriver) return;

    try {
      await cabOwnerApi.registerCab({
        regNumber: newRegNo.toUpperCase(),
        vehicleType: newType,
        capacity: parseInt(newCapacity),
        ownerEmail: currentUser.email || 'kumar@cabs.com',
        verificationStatus: 'PENDING'
      });
    } catch (err) {
      console.warn('Cab registration backend sync warning:', err);
    }

    const newV: FleetVehicle = {
      id: `v_${Date.now()}`,
      regNumber: newRegNo.toUpperCase(),
      type: newType,
      capacity: parseInt(newCapacity),
      seatsFilled: 0,
      driverName: newDriver,
      driverPhone: '+91 98401 77889',
      route: 'Pending Route Assignment',
      status: 'IDLE',
      rcStatus: 'PENDING',
      fitnessStatus: 'PENDING'
    };

    setVehicles([newV, ...vehicles]);
    setShowAddVehicleModal(false);
    setNewRegNo('');
    setNewDriver('');
  };

  const filteredInvoices = invoices.filter(inv => {
    if (invoiceFilter === 'ALL') return true;
    return inv.status === invoiceFilter;
  });

  return (
    <div className="w-full max-w-6xl flex flex-col gap-6 animate-fadeIn pb-12">
      
      {/* Owner Header Profile Card */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-wrap justify-between items-center gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-tr from-teal-500 to-emerald-600 p-3 rounded-2xl shadow-lg shadow-teal-500/20">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {currentUser.roleDetails?.fleetName || 'Kumar Cab Owners Ltd.'}
              </h2>
              <span className="bg-emerald-500/15 text-emerald-400 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Verified RTO Operator
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Operator: {currentUser.name} • Contact: {currentUser.phone} • GSTIN: 33AABCK1234F1Z2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddVehicleModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-1.5 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. DEDICATED FLEET KPI PERFORMANCE CENTER */}
      {/* ===================================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-teal-400" />
            Fleet Key Performance Indicators (KPIs)
          </h3>
          <span className="text-[10px] text-gray-400">Live 30-Day Operational Performance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* KPI 1: Fleet Utilization / Occupancy Rate */}
          <div className="glass-card p-4 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-2 hover:border-teal-500/40 transition">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Fleet Utilization</span>
              <div className="bg-teal-500/10 p-1.5 rounded-lg text-teal-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h4 className="text-2xl font-black text-white">{fleetUtilizationRate}%</h4>
                <span className="text-[10px] text-emerald-400 font-bold">+4.2% vs last week</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{totalOccupied} of {activeCapacity} active route seats booked</p>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full rounded-full" style={{ width: `${fleetUtilizationRate}%` }}></div>
            </div>
          </div>

          {/* KPI 2: On-Time Arrival Performance */}
          <div className="glass-card p-4 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-2 hover:border-teal-500/40 transition">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">On-Time Arrival</span>
              <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h4 className="text-2xl font-black text-white">99.2%</h4>
                <span className="text-[10px] text-emerald-400 font-bold">Top 5% in Chennai</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Average stop delay: &lt; 1.4 minutes</p>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '99.2%' }}></div>
            </div>
          </div>

          {/* KPI 3: Driver Safety & Rating */}
          <div className="glass-card p-4 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-2 hover:border-teal-500/40 transition">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Driver Safety Rating</span>
              <div className="bg-amber-500/10 p-1.5 rounded-lg text-amber-400">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h4 className="text-2xl font-black text-white">4.85<span className="text-sm text-gray-400">/5</span></h4>
                <span className="text-[10px] text-amber-400 font-bold">0 Overspeeding Alerts</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Evaluated across 420 parent trip reviews</p>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '97%' }}></div>
            </div>
          </div>

          {/* KPI 4: Fuel & Maintenance Readiness */}
          <div className="glass-card p-4 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-2 hover:border-teal-500/40 transition">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Fleet Readiness</span>
              <div className="bg-indigo-500/10 p-1.5 rounded-lg text-indigo-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h4 className="text-2xl font-black text-white">{onRouteCabs.length} / {vehicles.length}</h4>
                <span className="text-[10px] text-teal-300 font-bold">Cabs On Route</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">2 Cabs pending fitness certificate renewal</p>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${(onRouteCabs.length / vehicles.length) * 100}%` }}></div>
            </div>
          </div>

        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. FLEET ROSTER MANAGEMENT */}
      {/* ===================================================================== */}
      <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Car className="h-4.5 w-4.5 text-teal-400" />
              Active Commercial Fleet Enrolled ({vehicles.length} Vehicles)
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Real-time occupancy, allocated drivers, and RTO certificate status.</p>
          </div>
          <span className="text-xs font-mono text-gray-400">Total Fleet Capacity: {totalCapacity} Seats</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((v) => (
            <div 
              key={v.id} 
              className="bg-slate-900/80 p-4 rounded-2xl border border-gray-800 space-y-3 hover:border-teal-500/40 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white tracking-wide">{v.regNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      v.status === 'ON_ROUTE' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : v.status === 'IDLE' 
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {v.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{v.type}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-teal-300">
                    {v.seatsFilled} / {v.capacity} Filled
                  </span>
                  <div className="w-20 bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1">
                    <div 
                      className="bg-teal-400 h-full rounded-full"
                      style={{ width: `${(v.seatsFilled / v.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-gray-850 text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Assigned Driver:</span>
                  <strong className="text-white">{v.driverName} ({v.driverPhone})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Corridor:</span>
                  <span className="text-gray-300">{v.route}</span>
                </div>
              </div>

              {/* RTO Document Compliance Tags */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-850 text-[10px]">
                <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                  v.rcStatus === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  <FileText className="h-3 w-3" />
                  RC: {v.rcStatus}
                </span>
                <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                  v.fitnessStatus === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  <ShieldCheck className="h-3 w-3" />
                  Fitness: {v.fitnessStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. DEDICATED INVOICING & GST PAYOUT SETTLEMENT CENTER */}
      {/* ===================================================================== */}
      <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4 shadow-xl">
        
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="h-4.5 w-4.5 text-emerald-400" />
                GST Invoices & Bank Payout Settlements
              </h3>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                SAC 9964 Transport
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Official tax invoices for student subscription collections and direct weekly NEFT vendor disbursements.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-gray-800 text-xs">
            <button
              onClick={() => setInvoiceFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                invoiceFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              All Invoices
            </button>
            <button
              onClick={() => setInvoiceFilter('PAID')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                invoiceFilter === 'PAID' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setInvoiceFilter('PROCESSING')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                invoiceFilter === 'PROCESSING' ? 'bg-sky-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Processing
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-[10px] text-gray-400 uppercase tracking-wider">
                <th className="pb-3 px-3">Invoice #</th>
                <th className="pb-3 px-3">Settlement Cycle</th>
                <th className="pb-3 px-3">Gross Fare</th>
                <th className="pb-3 px-3">SafePassage (10%)</th>
                <th className="pb-3 px-3 font-bold text-white">Net Disbursed</th>
                <th className="pb-3 px-3">UTR / Transaction Ref</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-3 px-3 font-sans font-bold text-white flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{inv.invoiceNumber}</span>
                  </td>
                  <td className="py-3 px-3 font-sans text-gray-300">{inv.billingPeriod}</td>
                  <td className="py-3 px-3 text-gray-300">₹{inv.subtotal.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-red-400">-₹{inv.platformCommissionAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">₹{inv.netPayable.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-[11px] text-gray-400">{inv.utrNumber || 'PENDING'}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      inv.status === 'PAID' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 ml-auto"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View GST Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* GST Note Banner */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-gray-800/80 flex justify-between items-center text-[11px] text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-teal-400 flex-shrink-0" />
            <span>TDS under Section 194C is deducted at 1% for commercial transport contractors. All invoices meet GST E-Invoicing requirements.</span>
          </div>
          <span className="font-mono text-gray-300 font-semibold">TDS Rate: 1.0%</span>
        </div>

      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-fadeIn">
            <h3 className="text-base font-bold text-white mb-2">Enroll Commercial Fleet Vehicle</h3>
            <p className="text-xs text-gray-400 mb-4">
              Enter vehicle registration details and upload Commercial RC & Fitness documents for Super Admin verification.
            </p>

            <form onSubmit={handleAddVehicle} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Registration Number</label>
                <input
                  type="text"
                  required
                  value={newRegNo}
                  onChange={(e) => setNewRegNo(e.target.value)}
                  placeholder="e.g. TN 09 BK 4521"
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 uppercase"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Vehicle Model & Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option>Force Traveller Van (12 Seater)</option>
                  <option>Force Traveller Super (15 Seater)</option>
                  <option>Maruti Ertiga / Suzuki Cab (6 Seater)</option>
                  <option>College / School Coach Bus (40 Seater)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Total Seats</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Assign Driver</label>
                  <input
                    type="text"
                    required
                    value={newDriver}
                    onChange={(e) => setNewDriver(e.target.value)}
                    placeholder="e.g. Anand Kumar"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-gray-800 text-[10px] text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Upload className="h-4 w-4 text-teal-400" />
                  RC & Fitness PDF Upload
                </span>
                <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">
                  Simulated Ready
                </span>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="flex-1 bg-gray-800 text-gray-300 py-2 rounded-xl text-xs font-bold hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-2 rounded-xl text-xs font-bold shadow-lg shadow-teal-500/20 hover:from-teal-600 hover:to-emerald-700 transition"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-Screen Digital Tax Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

    </div>
  );
};
