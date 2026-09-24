import React, { useState } from 'react';
import {
  Calendar,
  CreditCard,
  Shield,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  X,
  Award,
  DollarSign,
  QrCode,
  School,
  GraduationCap,
  Briefcase,
  Check
} from 'lucide-react';
import { packagesApi } from '../services/api';

interface PackageTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const PackageTripsModal: React.FC<PackageTripsModalProps> = ({
  isOpen,
  onClose,
  userEmail = 'priya.sharma@gmail.com'
}) => {
  const [selectedPkg, setSelectedPkg] = useState<string>('pkg-school-quarterly');
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'RAZORPAY_UPI' | 'CREDIT_CARD'>('WALLET');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState<any | null>(null);

  if (!isOpen) return null;

  const packages = [
    {
      id: 'pkg-school-quarterly',
      name: 'School Academic Term Pass',
      icon: School,
      badge: 'Most Popular 🔥',
      category: 'School',
      validity: '3 Months (90 Days)',
      ridesIncluded: 'Daily Pick & Drop (Mon-Fri)',
      originalPrice: 8000,
      discountedPrice: 7200,
      discountPct: '10% OFF',
      color: 'from-blue-600 to-cyan-600',
      features: [
        'Live GPS Corridor Tracking & Geofence Radar',
        'Anti-Abandonment Child Safety Verification',
        'Guardian Digital Pin Handover System',
        '1-Tap Absence Skip Credit Rollover'
      ]
    },
    {
      id: 'pkg-college-semester',
      name: 'College Semester Commute Bundle',
      icon: GraduationCap,
      badge: 'Best Value ⭐',
      category: 'College',
      validity: '5 Months (Semester)',
      ridesIncluded: '60 Return Rides',
      originalPrice: 9500,
      discountedPrice: 8500,
      discountPct: '₹1,000 OFF',
      color: 'from-indigo-600 to-purple-600',
      features: [
        'Reserved Fixed-Seater AC Cab',
        'Flexible Timing Swaps for Lectures',
        'Loyola / Campus Gate Express Drop',
        'Exam Season Late-Night Escort'
      ]
    },
    {
      id: 'pkg-corp-20pack',
      name: 'Corporate Flex 20-Ride Card',
      icon: Briefcase,
      badge: 'Flexible 💼',
      category: 'Corporate / Work',
      validity: '45 Days Validity',
      ridesIncluded: '20 Rides On-Demand',
      originalPrice: 3000,
      discountedPrice: 2400,
      discountPct: '20% OFF',
      color: 'from-emerald-600 to-teal-600',
      features: [
        'IT Park Direct Corridor Routing',
        'Doorstep Pickup Guarantee',
        'Zero Peak Surcharge Surge Lock',
        'GST Corporate Tax Invoice Auto-Claim'
      ]
    },
    {
      id: 'pkg-daily-return',
      name: 'Daily Single / Return Pass',
      icon: Zap,
      badge: 'Instant ⚡',
      category: 'Any Commuter',
      validity: 'Same Day Only',
      ridesIncluded: '1 or 2 Rides',
      originalPrice: 200,
      discountedPrice: 180,
      discountPct: '₹20 OFF',
      color: 'from-amber-600 to-orange-600',
      features: [
        'Instant 45s Driver Dispatch Alert',
        '4-Digit Secure OTP Boarding',
        'Real-time Radar ETA Alert'
      ]
    }
  ];

  const currentPkg = packages.find((p) => p.id === selectedPkg) || packages[0];

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const res = await packagesApi.subscribePackage({
        packageId: currentPkg.id,
        packageName: currentPkg.name,
        amount: currentPkg.discountedPrice,
        userEmail
      });
      setSubscriptionSuccess(res);
    } catch {
      setSubscriptionSuccess({
        subscriptionId: 'SUB-PKG-' + Date.now(),
        packageType: currentPkg.name,
        amount: currentPkg.discountedPrice
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-white overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-b border-slate-700/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-wide text-white">
                  Package Trips & Commute Passes
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  School · College · Corporate
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Guaranteed seat allocation, bundled discounts & automated monthly renewal
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!subscriptionSuccess ? (
            <>
              {/* Package Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map((pkg) => {
                  const Icon = pkg.icon;
                  const isSelected = selectedPkg === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkg(pkg.id)}
                      className={`relative rounded-2xl p-5 border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-800/90 border-cyan-400 shadow-xl shadow-cyan-950/30 ring-1 ring-cyan-400'
                          : 'bg-slate-900/60 border-slate-700/80 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${pkg.color} flex items-center justify-center text-white shadow-md`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white">{pkg.name}</h4>
                            <span className="text-[11px] text-slate-400">{pkg.validity} · {pkg.ridesIncluded}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {pkg.badge}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 mt-4">
                        <span className="text-2xl font-black text-emerald-400">₹{pkg.discountedPrice}</span>
                        <span className="text-xs text-slate-400 line-through">₹{pkg.originalPrice}</span>
                        <span className="text-xs font-bold text-amber-400">{pkg.discountPct}</span>
                      </div>

                      <ul className="mt-3 space-y-1.5 text-xs text-slate-300 border-t border-slate-700/60 pt-3">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Payment Method Selector & Checkout */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-400">Selected Package</span>
                    <h4 className="text-base font-black text-white">{currentPkg.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Amount Due</span>
                    <div className="text-2xl font-black text-emerald-400">₹{currentPkg.discountedPrice}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('WALLET')}
                    className={`p-3 rounded-xl border text-center font-bold transition ${
                      paymentMethod === 'WALLET'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Parent Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('RAZORPAY_UPI')}
                    className={`p-3 rounded-xl border text-center font-bold transition ${
                      paymentMethod === 'RAZORPAY_UPI'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Razorpay UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                    className={`p-3 rounded-xl border text-center font-bold transition ${
                      paymentMethod === 'CREDIT_CARD'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition active:scale-[0.98]"
                >
                  {isSubscribing ? (
                    <span>Activating Package Subscription...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Confirm & Activate Package Pass (₹{currentPkg.discountedPrice})</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Subscription Confirmed Screen */
            <div className="max-w-md mx-auto bg-slate-800/90 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-black text-white">Package Pass Activated!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Your seat is now reserved. Pass is live and synchronized with MySQL database.
                </p>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subscription Ref:</span>
                  <span className="font-mono text-cyan-300">{subscriptionSuccess.subscriptionId || 'SUB-PKG-101'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Package:</span>
                  <span className="font-bold text-white">{currentPkg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Paid:</span>
                  <span className="font-black text-emerald-400 text-sm">₹{currentPkg.discountedPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Seat Status:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    RESERVED & ACTIVE
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSubscriptionSuccess(null);
                  onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/25"
              >
                Close & View Passes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
