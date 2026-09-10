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
    <header className="border-b border-slate-800 bg-[#0B0F17]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Brand & Platform Title */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600/30 to-slate-900 border border-indigo-500/40 text-indigo-400 shadow-md">
          <ShieldAlert className="w-5 h-5 animate-pulse text-indigo-400" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-wider text-white font-sans">
              TECH NETRA
            </h1>
            <span className="text-slate-700 font-light">|</span>
            <span className="text-sm font-semibold tracking-wide text-slate-300 font-sans">
              National Cyber Safety & Misinformation Radar
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Active Protection
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-sans mt-0.5">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Monitoring: X, Telegram, Instagram, YouTube, WhatsApp
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1 text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
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
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-semibold transition shadow-sm shadow-indigo-500/20 hover:scale-[1.02] active:scale-95"
          title="Create a printable summary report of all current safety alerts"
        >
          <FileText className="w-3.5 h-3.5 text-white" />
          <span>Create Safety Report</span>
        </button>

        {/* Refresh Data Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition text-xs font-sans disabled:opacity-50 font-medium"
          title="Refresh live posts and alerts"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>

        {/* Recent Alerts Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setUnreadCount(0);
            }}
            className="relative p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition"
            title="View Recent Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#111827] border border-slate-700 shadow-2xl z-50 p-4 space-y-3 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-100">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Recent Safety Alerts</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl bg-[#0B0F17] border border-slate-800 hover:border-slate-700 transition space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{alert.title}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                        alert.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                        alert.severity === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{alert.desc}</p>
                    <div className="text-[10px] text-slate-500 font-mono pt-1">{alert.time}</div>
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
