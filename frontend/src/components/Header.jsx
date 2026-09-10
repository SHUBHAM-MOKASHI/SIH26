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
    <header className="border-b border-blue-900/60 bg-[#05112e]/95 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-blue-950/40">
      {/* Brand & Platform Title */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 border border-blue-400/50 text-white shadow-lg shadow-blue-900/60">
          <ShieldAlert className="w-6 h-6 animate-pulse text-white" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold tracking-wider text-white font-sans">
              TECH NETRA
            </h1>
            <span className="text-blue-500 font-light">|</span>
            <span className="text-sm font-semibold tracking-wide text-blue-100 font-sans">
              National Cyber Safety & Misinformation Radar
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-600">
              Active Protection
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-blue-300/80 font-sans mt-0.5">
            <span className="flex items-center gap-1.5 text-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Live Monitoring: X, Telegram, Instagram, YouTube, WhatsApp
            </span>
            <span className="text-blue-700">•</span>
            <span className="flex items-center gap-1 text-blue-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
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
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-950 font-sans text-xs font-bold transition shadow-lg shadow-blue-500/20 border border-blue-200 hover:scale-105 active:scale-95"
          title="Create a printable summary report of all current safety alerts"
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Create Safety Report</span>
        </button>

        {/* Refresh Data Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#081836] border border-blue-800 hover:border-blue-400 text-blue-200 hover:text-white transition text-xs font-sans disabled:opacity-50 font-medium"
          title="Refresh live posts and alerts"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>

        {/* Recent Alerts Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setUnreadCount(0);
            }}
            className="relative p-2.5 rounded-xl bg-[#081836] border border-blue-800 hover:border-blue-400 text-blue-200 hover:text-white transition"
            title="View Recent Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-blue-500 text-white font-mono text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#081836] border border-blue-700 shadow-2xl z-50 p-4 space-y-3 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-blue-900 pb-2.5">
                <div className="flex items-center gap-2 font-semibold text-sm text-white">
                  <AlertTriangle className="w-4 h-4 text-blue-400" />
                  <span>Recent Safety Alerts</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-lg text-blue-300 hover:text-white hover:bg-blue-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl bg-[#05112e] border border-blue-900 hover:border-blue-500 transition space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{alert.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-blue-950 text-blue-300 border border-blue-700">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-blue-200/90 leading-relaxed font-sans">{alert.desc}</p>
                    <div className="text-[10px] text-blue-400 font-mono pt-1">{alert.time}</div>
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
