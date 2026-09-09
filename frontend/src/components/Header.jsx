import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Bell, 
  RefreshCw, 
  Activity, 
  ShieldCheck, 
  Clock, 
  FileText,
  Sparkles,
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
    { id: 1, title: 'Disinformation Flare', desc: 'Coordinated bot surge detected on #BankingScam in Mumbai', time: '2m ago', severity: 'Critical' },
    { id: 2, title: 'Malicious Phishing APK', desc: 'Direct download APK link detected targeting SBI users', time: '8m ago', severity: 'High' },
    { id: 3, title: 'Synthetic Voice Leak', desc: 'Deepfake audio detected impersonating state minister', time: '18m ago', severity: 'High' },
    { id: 4, title: 'Astroturfing Spike', desc: '5 bot accounts banned in #BoycottECommerce network', time: '32m ago', severity: 'Medium' }
  ];

  const activeAlerts = notifications.length > 0 ? notifications : defaultNotifications;

  return (
    <header className="border-b border-cyan-500/20 bg-[#0c1427]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Brand & Operation Title */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-950 to-blue-950 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-950/60">
          <ShieldAlert className="w-6 h-6 animate-pulse text-cyan-400" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-400 bg-clip-text text-transparent">
              TECH NETRA
            </h1>
            <span className="text-slate-500 font-light">|</span>
            <span className="text-sm font-semibold tracking-wide text-slate-300">
              Intelligence Operations
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-700/60">
              DEFCON 2
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Monitoring 6 Networks Active (X, TG, IG, YT, WA, Reddit)
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {currentTime}
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls, Generate Brief, and Notifications */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        {/* Generate Intelligence Brief Button */}
        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono text-xs font-bold transition shadow-lg shadow-cyan-950/60 border border-cyan-400/40 hover:scale-105 active:scale-95"
          title="Compile and Generate Intelligence Dossier"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Generate Intelligence Brief</span>
        </button>

        {/* Sync Feed Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-slate-200 hover:text-cyan-300 transition text-xs font-mono disabled:opacity-50"
          title="Sync Realtime Social Telemetry"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'SYNCING...' : 'LIVE SYNC'}</span>
        </button>

        {/* Notifications Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setUnreadCount(0);
            }}
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300 transition"
            title="Incident Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0c1427] border border-cyan-500/30 shadow-2xl z-50 p-4 space-y-3 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 font-semibold text-sm text-white">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Real-time Incident Alerts</span>
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
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 transition space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300 font-mono">{alert.title}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        alert.severity === 'Critical' ? 'bg-red-950 text-red-400 border border-red-800' :
                        alert.severity === 'High' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-blue-950 text-blue-400 border border-blue-800'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{alert.desc}</p>
                    <span className="text-[10px] text-slate-500 font-mono block text-right">{alert.time}</span>
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
