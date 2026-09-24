import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Check, 
  X, 
  Send, 
  Clock, 
  User, 
  Car, 
  Building2, 
  Users, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Smartphone 
} from 'lucide-react';
import type { AdminAuthRequest, AppRole } from '../types/auth';

interface AdminApprovalsDeskProps {
  requests: AdminAuthRequest[];
  onGenerateOtp: (requestId: string) => void;
  onApproveRequest: (requestId: string, schedule?: 'IMMEDIATE' | 'TOMORROW') => void;
  onRejectRequest: (requestId: string) => void;
  auditLogs: string[];
}

export const AdminApprovalsDesk: React.FC<AdminApprovalsDeskProps> = ({
  requests,
  onGenerateOtp,
  onApproveRequest,
  onRejectRequest,
  auditLogs
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'REGISTRATION' | 'FORGOT_PASSWORD'>('ALL');

  const filteredRequests = requests.filter(req => {
    if (filter === 'PENDING') return req.status === 'PENDING_APPROVAL';
    if (filter === 'REGISTRATION') return req.type === 'REGISTRATION';
    if (filter === 'FORGOT_PASSWORD') return req.type === 'FORGOT_PASSWORD';
    return true;
  });

  const getRoleBadge = (role: AppRole) => {
    switch (role) {
      case 'driver':
        return (
          <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
            <Car className="h-3 w-3" /> Cab Driver
          </span>
        );
      case 'cab_owner':
        return (
          <span className="bg-teal-500/15 text-teal-400 border border-teal-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
            <Building2 className="h-3 w-3" /> Cab Owner
          </span>
        );
      case 'parent':
        return (
          <span className="bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
            <Users className="h-3 w-3" /> Parent
          </span>
        );
      case 'student':
        return (
          <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
            <GraduationCap className="h-3 w-3" /> Student
          </span>
        );
      case 'professional':
        return (
          <span className="bg-purple-500/15 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
            <Briefcase className="h-3 w-3" /> Professional
          </span>
        );
      default:
        return (
          <span className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold">
            Super Admin
          </span>
        );
    }
  };

  const getStatusBadge = (status: AdminAuthRequest['status']) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return <span className="bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded text-[10px] font-bold">⏳ Awaiting Decision</span>;
      case 'OTP_DISPATCHED':
        return <span className="bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded text-[10px] font-bold">OTP Dispatched</span>;
      case 'ACTIVATED':
        return <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">Active Now ✅</span>;
      case 'SCHEDULED_TOMORROW':
        return <span className="bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold">Accepted for Tomorrow 📅</span>;
      case 'REJECTED':
        return <span className="bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold">Rejected ❌</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="glass-card p-5 rounded-2xl border border-gray-800 flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1">
              <Shield className="h-3 w-3" /> Central Authorization Desk
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Super Admin Gatekeeper
            </span>
          </div>
          <h3 className="text-lg font-black text-white mt-1 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            Direct Registration Approval & SLA Queue
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 max-w-2xl">
            Accept registration requests from Cab Drivers, Cab Owners, Parents, Students, and Professionals. Accept immediately (within 30 mins) or schedule activation for tomorrow.
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex flex-wrap gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-gray-800">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${filter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${filter === 'PENDING' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Pending ({requests.filter(r => r.status === 'PENDING_APPROVAL').length})
          </button>
          <button
            onClick={() => setFilter('REGISTRATION')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${filter === 'REGISTRATION' ? 'bg-sky-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Registrations ({requests.filter(r => r.type === 'REGISTRATION').length})
          </button>
          <button
            onClick={() => setFilter('FORGOT_PASSWORD')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${filter === 'FORGOT_PASSWORD' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Password Resets ({requests.filter(r => r.type === 'FORGOT_PASSWORD').length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Requests List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl border border-gray-800 text-center text-gray-400">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-bold text-white">No pending requests found</p>
              <p className="text-xs text-gray-500 mt-1">All user registrations and password reset requests have been processed.</p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                className="glass-card p-4 rounded-2xl border border-gray-800 hover:border-indigo-500/40 transition space-y-3"
              >
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-gray-800 flex items-center justify-center font-bold text-xs text-white">
                      {req.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-white">{req.fullName}</strong>
                        {getRoleBadge(req.role)}
                      </div>
                      <span className="text-[11px] text-gray-400">{req.email} • {req.phone}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* User Requested Timeframe SLA */}
                    {req.acceptanceTimeframe === 'WITHIN_30_MIN' && (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 animate-pulse">
                        <Clock className="h-3 w-3" /> ⚡ Requested: Accept within 30 min
                      </span>
                    )}
                    {req.acceptanceTimeframe === 'TOMORROW' && (
                      <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
                        <Clock className="h-3 w-3" /> 📅 Requested: Accept by Tomorrow
                      </span>
                    )}

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      req.type === 'REGISTRATION' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                      {req.type === 'REGISTRATION' ? 'Direct Registration' : 'Password Reset'}
                    </span>
                    {getStatusBadge(req.status)}
                  </div>
                </div>

                {/* Specific Role Context Details */}
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-gray-850 text-[10px] text-gray-300 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-gray-500 block">Requested At</span>
                    <span className="font-semibold text-gray-300">{req.requestedAt} (Today)</span>
                  </div>

                  {req.acceptanceTimeframe && (
                    <div>
                      <span className="text-gray-500 block">Requested SLA</span>
                      <span className="font-semibold text-amber-300">
                        {req.acceptanceTimeframe === 'WITHIN_30_MIN' ? '⚡ Within 30 Minutes' : '📅 By Tomorrow'}
                      </span>
                    </div>
                  )}

                  {req.details?.licenseNo && (
                    <div>
                      <span className="text-gray-500 block">License No</span>
                      <span className="font-semibold text-emerald-300">{req.details.licenseNo}</span>
                    </div>
                  )}

                  {req.details?.vehicleType && (
                    <div>
                      <span className="text-gray-500 block">Vehicle Spec</span>
                      <span className="font-semibold text-gray-300">{req.details.vehicleType}</span>
                    </div>
                  )}

                  {req.details?.fleetName && (
                    <div>
                      <span className="text-gray-500 block">Fleet Name</span>
                      <span className="font-semibold text-teal-300">{req.details.fleetName} ({req.details.fleetCount} Cabs)</span>
                    </div>
                  )}

                  {req.details?.school && (
                    <div>
                      <span className="text-gray-500 block">Institution / School</span>
                      <span className="font-semibold text-sky-300">{req.details.school}</span>
                    </div>
                  )}

                  {req.details?.grade && (
                    <div>
                      <span className="text-gray-500 block">Student Grade</span>
                      <span className="font-semibold text-gray-300">{req.details.grade}</span>
                    </div>
                  )}

                  {req.details?.company && (
                    <div>
                      <span className="text-gray-500 block">Corporate Office</span>
                      <span className="font-semibold text-purple-300">{req.details.company}</span>
                    </div>
                  )}

                  {req.details?.designation && (
                    <div>
                      <span className="text-gray-500 block">Designation</span>
                      <span className="font-semibold text-gray-300">{req.details.designation}</span>
                    </div>
                  )}

                  {req.details?.reason && (
                    <div className="col-span-2">
                      <span className="text-gray-500 block">Reset Reason</span>
                      <span className="font-semibold text-amber-300">{req.details.reason}</span>
                    </div>
                  )}
                </div>

                {/* Action Controls for Super Admin */}
                <div className="flex flex-wrap gap-2 justify-end pt-2 border-t border-gray-800/60">
                  {/* Immediate 1-Click Accept (Now / Within 30 min) */}
                  {req.status !== 'ACTIVATED' && (
                    <button
                      onClick={() => onApproveRequest(req.id, 'IMMEDIATE')}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                      <span>⚡ Accept & Activate Now</span>
                    </button>
                  )}

                  {/* Accept For Tomorrow Option */}
                  {req.status !== 'ACTIVATED' && req.status !== 'SCHEDULED_TOMORROW' && (
                    <button
                      onClick={() => onApproveRequest(req.id, 'TOMORROW')}
                      className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>📅 Accept for Tomorrow</span>
                    </button>
                  )}

                  {/* Optional Password Reset OTP Dispatch (For FORGOT_PASSWORD requests only) */}
                  {req.type === 'FORGOT_PASSWORD' && req.status === 'PENDING_APPROVAL' && (
                    <button
                      onClick={() => onGenerateOtp(req.id)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Key className="h-3.5 w-3.5" />
                      <span>Issue Reset OTP</span>
                    </button>
                  )}

                  {/* Reject Request */}
                  {req.status !== 'REJECTED' && req.status !== 'ACTIVATED' && (
                    <button
                      onClick={() => onRejectRequest(req.id)}
                      className="bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

        {/* Real-time Super Admin Audit Terminal */}
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-indigo-400" />
                Live Authorization Audit Stream
              </span>
              <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono font-bold">
                ACTIVE
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-gray-900 font-mono text-[10px] space-y-2 max-h-[360px] overflow-y-auto">
              {auditLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`leading-relaxed ${
                    log.includes('OTP') ? 'text-emerald-300' :
                    log.includes('ACTIVATED') ? 'text-sky-300 font-bold' :
                    log.includes('REJECTED') ? 'text-red-400' :
                    'text-gray-400'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[10px] text-gray-300 space-y-1">
              <span className="text-indigo-400 font-bold block">Super Admin Security Note:</span>
              <p>
                OTPs are cryptographically generated with SHA-256 seed and dispatched via simulated SMS gateway. The user must provide the generated OTP to activate their account or complete password recovery.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
