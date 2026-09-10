import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Bell, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  FileText,
  AlertTriangle,
  X
} from 'lucide-react';

export default function Header({ onRefresh, loading, onOpenReportModal, notifications = [] }) {
  const [currentTime, setCurrentTime] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(4);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) + ' IST'
      );
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const defaultNotifications = [
    { id: 1, title: 'Fake Banking Scam Alert', desc: 'Multiple fake bank SMS messages reported in Mumbai asking users to update PAN card.', time: '2m ago', severity: 'Critical' },
    { id: 2, title: 'Dangerous Phishing Link', desc: 'Fake SBI APK download link detected in WhatsApp & Telegram groups.', time: '8m ago', severity: 'High' },
    { id: 3, title: 'AI Voice Clone Warning', desc: 'Fake deepfake voice audio pretending to be an official minister was flagged.', time: '18m ago', severity: 'High' },
    { id: 4, title: 'Automated Bot Network', desc: '5 fake bot accounts found repeating the same spam messages.', time: '32m ago', severity: 'Medium' }
  ];

  const activeAlerts = notifications.length > 0 ? notifications : defaultNotifications;

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      {/* Brand & Platform Title */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#1769AA] to-[#12355B] text-white shadow-sm shadow-[#1769AA]/20">
          <ShieldAlert className="w-5 h-5 animate-pulse text-white" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold tracking-wider text-[#12355B] font-sans">
              TECH NETRA
            </h1>
            <span className="text-slate-300 font-light hidden sm:inline">|</span>
            <span className="text-sm font-semibold tracking-wide text-[#4A607A] font-sans">
              National Cyber Safety & Misinformation Radar
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active Protection
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#4A607A] font-sans mt-0.5">
            <span className="flex items-center gap-1.5 text-[#12355B] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Monitoring: X, Telegram, Instagram, YouTube, WhatsApp
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-[#4A607A] font-mono">
              <Clock className="w-3.5 h-3.5 text-[#1769AA]" />
              {currentTime}
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        {/* Create Safety Report Button */}
        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1769AA] hover:bg-[#13558A] text-white font-sans text-xs font-semibold transition shadow-sm hover:scale-[1.02] active:scale-95"
          title="Create a printable summary report of all current safety alerts"
        >
          <FileText className="w-3.5 h-3.5 text-white" />
          <span>Create Safety Report</span>
        </button>

        {/* Refresh Data Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-[#12355B] transition text-xs font-sans disabled:opacity-50 font-medium shadow-sm"
          title="Refresh live posts and alerts"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#1769AA] ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>

        {/* Recent Alerts Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setUnreadCount(0);
            }}
            className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-[#12355B] transition shadow-sm"
            title="View Recent Alerts"
          >
            <Bell className="w-4 h-4 text-[#1769AA]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2 font-semibold text-sm text-[#12355B]">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Recent Safety Alerts</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-[#12355B] hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#12355B]">{alert.title}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                        alert.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        alert.severity === 'High' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-[#4A607A] leading-relaxed font-sans">{alert.desc}</p>
                    <div className="text-[10px] text-slate-400 font-mono pt-1">{alert.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
