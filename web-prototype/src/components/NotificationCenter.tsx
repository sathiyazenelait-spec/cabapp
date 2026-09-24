import React, { useState, useEffect } from 'react';
import {
  Bell,
  Settings,
  ArrowLeft,
  CheckCircle2,
  Car,
  CreditCard,
  AlertTriangle,
  ShieldAlert,
  Info,
  Gift,
  Megaphone,
  Cpu,
  ChevronRight,
  Home,
  Navigation,
  Calendar,
  User,
  Sliders,
  Check,
  Radio,
  Phone,
  Receipt,
  Sparkles
} from 'lucide-react';
import { parentApi } from '../services/api';

export type NotificationCategory = 'all' | 'transport' | 'payments' | 'system';

export interface NotificationItem {
  id: string;
  category: 'transport' | 'payments' | 'system';
  title: string;
  message: string;
  time: string;
  dateTag: string;
  iconType: 'check' | 'vehicle' | 'payment' | 'delay' | 'sos' | 'reminder' | 'offer' | 'route' | 'system';
  iconBg: string;
  iconColor: string;
  read: boolean;
  actionPayload?: {
    type?: 'live_track' | 'invoice' | 'sos' | 'renew' | 'route_match';
    vehicleNo?: string;
    studentName?: string;
    amount?: number;
    location?: string;
  };
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    category: 'transport',
    title: 'Child Boarded',
    message: 'Arun Kumar has boarded the vehicle TN-XX-1234 at Kattur (7:32 AM).',
    time: '7:32 AM',
    dateTag: 'Today',
    iconType: 'check',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    iconColor: '#10b981',
    read: false,
    actionPayload: { type: 'live_track', vehicleNo: 'TN-XX-1234', studentName: 'Arun Kumar' }
  },
  {
    id: 'n-2',
    category: 'transport',
    title: 'Vehicle Arrived',
    message: 'Van TN-XX-5678 is 5 minutes away from Green Valley School.',
    time: '7:25 AM',
    dateTag: 'Today',
    iconType: 'vehicle',
    iconBg: 'bg-blue-500/20 text-sky-400 border border-blue-500/30',
    iconColor: '#38bdf8',
    read: false,
    actionPayload: { type: 'live_track', vehicleNo: 'TN-XX-5678' }
  },
  {
    id: 'n-3',
    category: 'payments',
    title: 'Payment Successful',
    message: "Monthly subscription of ₹3,000 has been paid for your child's transport.",
    time: 'Yesterday',
    dateTag: 'Yesterday',
    iconType: 'payment',
    iconBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    iconColor: '#a855f7',
    read: true,
    actionPayload: { type: 'invoice', amount: 3000 }
  },
  {
    id: 'n-4',
    category: 'transport',
    title: 'Route Delay',
    message: 'Van TN-XX-3456 is delayed by 12 minutes due to traffic.',
    time: 'Yesterday',
    dateTag: 'Yesterday',
    iconType: 'delay',
    iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    iconColor: '#f59e0b',
    read: true,
    actionPayload: { type: 'live_track', vehicleNo: 'TN-XX-3456' }
  },
  {
    id: 'n-5',
    category: 'transport',
    title: 'SOS Alert',
    message: 'Emergency button pressed in vehicle TN-XX-9012. Location: Near Lawspet.',
    time: 'Yesterday',
    dateTag: 'Yesterday',
    iconType: 'sos',
    iconBg: 'bg-red-500/20 text-red-400 border border-red-500/30',
    iconColor: '#ef4444',
    read: true,
    actionPayload: { type: 'sos', vehicleNo: 'TN-XX-9012', location: 'Near Lawspet' }
  },
  {
    id: 'n-6',
    category: 'payments',
    title: 'Subscription Reminder',
    message: 'Your subscription will expire in 3 days. Renew now to avoid service interruption.',
    time: '2 Apr',
    dateTag: '2 Apr',
    iconType: 'reminder',
    iconBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
    iconColor: '#0ea5e9',
    read: true,
    actionPayload: { type: 'renew' }
  },
  {
    id: 'n-7',
    category: 'system',
    title: 'Special Offer',
    message: 'Get 10% discount on college transport for this month.',
    time: '1 Apr',
    dateTag: '1 Apr',
    iconType: 'offer',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    iconColor: '#10b981',
    read: true,
    actionPayload: { type: 'route_match' }
  },
  {
    id: 'n-8',
    category: 'transport',
    title: 'New Route Available',
    message: 'Kattur ➔ ABC College route is now live. Book now!',
    time: '31 Mar',
    dateTag: '31 Mar',
    iconType: 'route',
    iconBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    iconColor: '#a855f7',
    read: true,
    actionPayload: { type: 'route_match' }
  },
  {
    id: 'n-9',
    category: 'system',
    title: 'System Update',
    message: 'We have updated the tracking system for better accuracy and performance.',
    time: '30 Mar',
    dateTag: '30 Mar',
    iconType: 'system',
    iconBg: 'bg-slate-700/40 text-slate-300 border border-slate-600/30',
    iconColor: '#94a3b8',
    read: true
  }
];

interface NotificationCenterProps {
  onBack?: () => void;
  isStandalonePhone?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onBack,
  isStandalonePhone = false
}) => {
  const [activeTab, setActiveTab] = useState<NotificationCategory>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'tracking' | 'bookings' | 'notifications' | 'profile'>('notifications');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  // Settings Toggles
  const [settingsToggles, setSettingsToggles] = useState({
    boardAlerts: true,
    nearRadiusAlert: true,
    paymentAlerts: true,
    sosSirens: true,
    sound: true
  });

  useEffect(() => {
    parentApi.getNotificationCenter('priya.sharma@gmail.com').then((data: any) => {
      if (Array.isArray(data) && data.length > 0) {
        // Map any custom MySQL notification fields
        const mapped = data.map((item: any) => {
          const typeStr = (item.type || 'INFO').toUpperCase();
          let category: 'transport' | 'payments' | 'system' = 'transport';
          let iconType: NotificationItem['iconType'] = 'vehicle';
          let iconBg = 'bg-blue-500/20 text-sky-400 border border-blue-500/30';
          let iconColor = '#38bdf8';

          if (typeStr.includes('PAYMENT') || typeStr.includes('INVOICE') || typeStr.includes('BILL')) {
            category = 'payments';
            iconType = 'payment';
            iconBg = 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
            iconColor = '#a855f7';
          } else if (typeStr.includes('SOS') || typeStr.includes('ALERT')) {
            category = 'transport';
            iconType = 'sos';
            iconBg = 'bg-red-500/20 text-red-400 border border-red-500/30';
            iconColor = '#ef4444';
          } else if (typeStr.includes('ATTENDANCE') || typeStr.includes('BOARD')) {
            category = 'transport';
            iconType = 'check';
            iconBg = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            iconColor = '#10b981';
          } else if (typeStr.includes('SYSTEM') || typeStr.includes('UPDATE')) {
            category = 'system';
            iconType = 'system';
            iconBg = 'bg-slate-700/40 text-slate-300 border border-slate-600/30';
            iconColor = '#94a3b8';
          }

          return {
            id: String(item.id || Math.random()),
            category,
            title: item.title,
            message: item.message,
            time: item.sentTime ? new Date(item.sentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
            dateTag: 'Today',
            iconType,
            iconBg,
            iconColor,
            read: item.read || false,
            actionPayload: { type: typeStr.includes('SOS') ? 'sos' : typeStr.includes('PAYMENT') ? 'invoice' : 'live_track' }
          } as NotificationItem;
        });
        if (mapped.length >= 4) {
          setNotifications(mapped);
        }
      }
    }).catch(() => {});
  }, []);

  const getFilteredList = () => {
    if (activeTab === 'all') return notifications;
    return notifications.filter(n => n.category === activeTab);
  };

  const getCategoryCount = (cat: NotificationCategory) => {
    if (cat === 'all') return notifications.length;
    return notifications.filter(n => n.category === cat).length;
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    setSelectedNotification(item);
    parentApi.markNotificationAsRead(item.id).catch(() => {});
  };

  const handleSavePreferences = () => {
    parentApi.saveNotificationPreferences(settingsToggles).catch(() => {});
    setShowSettingsModal(false);
  };

  const renderIcon = (type: NotificationItem['iconType']) => {
    switch (type) {
      case 'check':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'vehicle':
        return <Car className="w-4 h-4 text-sky-400" />;
      case 'payment':
        return <Receipt className="w-4 h-4 text-purple-400" />;
      case 'delay':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'sos':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'reminder':
        return <Info className="w-4 h-4 text-sky-400" />;
      case 'offer':
        return <Gift className="w-4 h-4 text-emerald-400" />;
      case 'route':
        return <Megaphone className="w-4 h-4 text-purple-400" />;
      case 'system':
      default:
        return <Cpu className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className={`flex flex-col bg-[#081026] text-slate-100 ${isStandalonePhone ? 'w-full max-w-[390px] h-[820px] rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden relative' : 'w-full max-w-xl mx-auto rounded-3xl border border-purple-500/20 shadow-2xl overflow-hidden'}`}>
      
      {/* Mobile Top Status Bar */}
      <div className="px-6 pt-3 pb-1 flex justify-between items-center text-[11px] font-semibold text-slate-300 bg-[#081026] select-none">
        <span>9:41</span>
        <div className="flex items-center space-x-1.5 text-xs">
          <span>📶</span>
          <span>⚡ 5G</span>
          <span>🔋 100%</span>
        </div>
      </div>

      {/* Screen Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-purple-950/60 border-b border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-1.5">
            <Bell className="w-4 h-4 text-sky-400" />
            <h1 className="text-base font-bold text-white tracking-wide">Notifications</h1>
          </div>
        </div>

        <button 
          onClick={() => setShowSettingsModal(true)}
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
          title="Notification Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Category Tabs: All (12), Transport (6), Payments (2), System (4) */}
      <div className="px-4 py-2.5 bg-slate-900/70 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto custom-scrollbar select-none">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({getCategoryCount('all')})
        </button>

        <button
          onClick={() => setActiveTab('transport')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
            activeTab === 'transport'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          Transport ({getCategoryCount('transport')})
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
            activeTab === 'payments'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          Payments ({getCategoryCount('payments')})
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
            activeTab === 'system'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          System ({getCategoryCount('system')})
        </button>
      </div>

      {/* Scrollable Notification List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 custom-scrollbar">
        {getFilteredList().map((item) => (
          <div
            key={item.id}
            onClick={() => handleNotificationClick(item)}
            className={`group p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border ${
              !item.read ? 'border-blue-500/40 shadow-md shadow-blue-500/5' : 'border-slate-800'
            } cursor-pointer transition flex items-start space-x-3`}
          >
            {/* Category Icon Badge */}
            <div className={`w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              {renderIcon(item.iconType)}
            </div>

            {/* Notification Body */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-1.5">
                  <h3 className={`text-xs font-bold ${!item.read ? 'text-white' : 'text-slate-200'}`}>
                    {item.title}
                  </h3>
                  {!item.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-slate-400 group-hover:text-slate-200">
                  <span>{item.time}</span>
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                </div>
              </div>

              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                {item.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="px-4 py-2.5 bg-[#060c1e] border-t border-slate-800/80 flex justify-around items-center select-none">
        <button 
          onClick={() => setActiveBottomNav('home')}
          className={`flex flex-col items-center space-y-0.5 ${activeBottomNav === 'home' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px]">Home</span>
        </button>
        <button 
          onClick={() => setActiveBottomNav('tracking')}
          className={`flex flex-col items-center space-y-0.5 ${activeBottomNav === 'tracking' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Navigation className="w-4 h-4" />
          <span className="text-[9px]">Tracking</span>
        </button>
        <button 
          onClick={() => setActiveBottomNav('bookings')}
          className={`flex flex-col items-center space-y-0.5 ${activeBottomNav === 'bookings' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[9px]">Bookings</span>
        </button>
        <button 
          onClick={() => setActiveBottomNav('notifications')}
          className={`flex flex-col items-center space-y-0.5 relative ${activeBottomNav === 'notifications' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <div className="relative">
            <div className="p-1 rounded-full bg-blue-600/20 text-blue-400">
              <Bell className="w-4 h-4 text-blue-400" />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] font-black flex items-center justify-center">
              9
            </span>
          </div>
          <span className="text-[9px] text-blue-400 font-bold">Notifications</span>
        </button>
        <button 
          onClick={() => setActiveBottomNav('profile')}
          className={`flex flex-col items-center space-y-0.5 ${activeBottomNav === 'profile' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <User className="w-4 h-4" />
          <span className="text-[9px]">Profile</span>
        </button>
      </div>

      {/* Notification Action Modal */}
      {selectedNotification && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-blue-500/40 rounded-3xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full ${selectedNotification.iconBg} flex items-center justify-center`}>
                  {renderIcon(selectedNotification.iconType)}
                </div>
                <h3 className="text-sm font-bold text-white">{selectedNotification.title}</h3>
              </div>
              <button onClick={() => setSelectedNotification(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedNotification.message}
            </p>

            {selectedNotification.actionPayload?.type === 'sos' && (
              <div className="p-2.5 bg-red-950/40 border border-red-500/40 rounded-xl space-y-1.5 text-red-300">
                <div className="font-bold flex items-center gap-1 text-[11px]">
                  <ShieldAlert className="w-3.5 h-3.5" /> Emergency Response Triggered
                </div>
                <div className="text-[10px]">Location: {selectedNotification.actionPayload.location}</div>
                <div className="flex gap-2 pt-1">
                  <button className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-[10px]">
                    Call Driver Now
                  </button>
                  <button className="flex-1 py-1.5 bg-slate-800 text-slate-200 font-bold rounded-lg text-[10px]">
                    View SOS Radar
                  </button>
                </div>
              </div>
            )}

            {selectedNotification.actionPayload?.type === 'invoice' && (
              <div className="p-2.5 bg-purple-950/40 border border-purple-500/30 rounded-xl flex justify-between items-center text-[11px] text-purple-200">
                <span>Receipt #REC-2025-04-12</span>
                <span className="font-bold text-white">₹{selectedNotification.actionPayload.amount} Paid</span>
              </div>
            )}

            <button
              onClick={() => setSelectedNotification(null)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-sky-400" />
                Notification Preferences
              </h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Child Boarding & Drop-off SMS</span>
                <input 
                  type="checkbox" 
                  checked={settingsToggles.boardAlerts} 
                  onChange={(e) => setSettingsToggles(prev => ({ ...prev, boardAlerts: e.target.checked }))}
                  className="rounded accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <span className="text-slate-300">0.5 Mile Radar Proximity Alert</span>
                <input 
                  type="checkbox" 
                  checked={settingsToggles.nearRadiusAlert} 
                  onChange={(e) => setSettingsToggles(prev => ({ ...prev, nearRadiusAlert: e.target.checked }))}
                  className="rounded accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Payment Invoices & Receipts</span>
                <input 
                  type="checkbox" 
                  checked={settingsToggles.paymentAlerts} 
                  onChange={(e) => setSettingsToggles(prev => ({ ...prev, paymentAlerts: e.target.checked }))}
                  className="rounded accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Critical SOS Siren Override</span>
                <input 
                  type="checkbox" 
                  checked={settingsToggles.sosSirens} 
                  onChange={(e) => setSettingsToggles(prev => ({ ...prev, sosSirens: e.target.checked }))}
                  className="rounded accent-red-600"
                />
              </label>
            </div>

            <button
              onClick={handleSavePreferences}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition mt-2 shadow-lg shadow-blue-600/30"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
