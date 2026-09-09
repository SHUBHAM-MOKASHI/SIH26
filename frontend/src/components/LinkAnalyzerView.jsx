import React, { useState, useEffect } from 'react';
import { 
  Link2, 
  Search, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  Globe, 
  Lock, 
  Unlock, 
  Clock, 
  ExternalLink,
  Copy,
  CheckCircle2,
  FileCode,
  Radio
} from 'lucide-react';

import { apiUrl } from '../services/api';

export default function LinkAnalyzerView({ onRefresh }) {
  const [links, setLinks] = useState([]);
  const [linkStats, setLinkStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scanner Input
  const [inputUrl, setInputUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const fetchLinkData = async () => {
    setLoading(true);
    try {
      const [linksRes, statsRes] = await Promise.allSettled([
        fetch(apiUrl('/api/links?limit=50')).then(r => r.json()),
        fetch(apiUrl('/api/links/stats')).then(r => r.json())
      ]);

      if (linksRes.status === 'fulfilled') setLinks(linksRes.value);
      if (statsRes.status === 'fulfilled') setLinkStats(statsRes.value);
    } catch (err) {
      console.error("Failed fetching links:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinkData();
  }, []);

  const handleScan = async (urlToScan) => {
    const target = urlToScan || inputUrl;
    if (!target) return;
    setScanning(true);
    try {
      const res = await fetch(apiUrl('/api/links/scan'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target })
      });
      const data = await res.json();
      setScanResult(data);
      fetchLinkData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  // Mock Redirection Chain builder based on scanned link
  const getRedirectionChain = (result) => {
    if (!result) return [];
    if (result.threat_type === 'Clean') {
      return [
        { hop: 1, url: result.url, status: 200, latency: '42ms', domain: result.domain, risk: 'Safe' }
      ];
    }

    return [
      { hop: 1, url: `http://t.co/${Math.random().toString(36).substring(7)}`, status: 301, latency: '35ms', domain: 't.co', risk: 'Shortener' },
      { hop: 2, url: `http://cdn-proxy-routing.xyz/gateway`, status: 302, latency: '89ms', domain: 'cdn-proxy-routing.xyz', risk: 'Proxy Redirect' },
      { hop: 3, url: result.url, status: 200, latency: '142ms', domain: result.domain, risk: result.threat_type }
    ];
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Clean':
        return { 
          bg: 'bg-emerald-950/80', 
          border: 'border-emerald-600', 
          text: 'text-emerald-400', 
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
          title: 'CLEAN & SAFE'
        };
      case 'Phishing':
        return { 
          bg: 'bg-red-950/80', 
          border: 'border-red-600', 
          text: 'text-red-400', 
          icon: <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />,
          title: 'CREDENTIAL PHISHING DETECTED'
        };
      case 'Malware':
        return { 
          bg: 'bg-purple-950/80', 
          border: 'border-purple-600', 
          text: 'text-purple-400', 
          icon: <AlertTriangle className="w-5 h-5 text-purple-400 animate-bounce" />,
          title: 'MALICIOUS EXECUTABLE / APK PAYLOAD'
        };
      default:
        return { 
          bg: 'bg-amber-950/80', 
          border: 'border-amber-600', 
          text: 'text-amber-400', 
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          title: 'SUSPICIOUS / FRAUDULENT'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Scanner Input */}
      <div className="p-6 rounded-2xl bg-[#0c1427]/90 border border-red-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-950/80 border border-red-500/40 text-red-400">
                <Link2 className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Phishing & Malicious URL Payload Scanner
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Deep inspection of typo-squatting, unverified TLDs, IP redirections & credential harvesters
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Inspected: </span>
              <span className="text-white font-bold">{linkStats?.total_scanned || links.length}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-800/60 text-xs font-mono">
              <span className="text-red-300">Phishing: </span>
              <span className="text-red-400 font-bold">{linkStats?.phishing_count || 0}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-xs font-mono">
              <span className="text-purple-300">Malware: </span>
              <span className="text-purple-400 font-bold">{linkStats?.malware_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Scan Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleScan(); }} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Paste any URL or shortened link e.g. http://secure-login-hdfc-kyc-update.xyz/verify-pan"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-red-500 outline-none text-sm text-white font-mono placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={scanning}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-xs font-mono transition disabled:opacity-50 text-white flex items-center justify-center gap-2 shadow-lg shadow-red-950/50"
          >
            <Sparkles className="w-4 h-4" />
            {scanning ? 'Inspecting Payload...' : 'Analyze URL'}
          </button>
        </form>

        {/* Quick Sample Triggers */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
          <span className="text-slate-500">Quick Test Samples:</span>
          <button
            onClick={() => {
              const url = "http://secure-login-hdfc-kyc-update.xyz/verify-pan";
              setInputUrl(url);
              handleScan(url);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500/50 text-red-300 transition"
          >
            KYC Phishing Link
          </button>

          <button
            onClick={() => {
              const url = "http://192.168.45.12/sbi-yono-apk-download.apk";
              setInputUrl(url);
              handleScan(url);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-purple-300 transition"
          >
            Obfuscated IP APK Payload
          </button>

          <button
            onClick={() => {
              const url = "https://cybercrime.gov.in";
              setInputUrl(url);
              handleScan(url);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-emerald-300 transition"
          >
            Clean Government Portal
          </button>
        </div>
      </div>

      {/* 2. Live Scan Inspection Results Panel */}
      {scanResult && (
        <div className="p-6 rounded-2xl bg-[#0c1427]/90 border border-slate-800 shadow-xl space-y-5 font-mono">
          {/* Status Verdict Header */}
          {(() => {
            const badge = getStatusBadge(scanResult.threat_type);
            return (
              <div className={`p-4 rounded-xl ${badge.bg} border ${badge.border} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                <div className="flex items-center gap-3">
                  {badge.icon}
                  <div>
                    <h3 className={`text-base font-extrabold ${badge.text}`}>
                      {badge.title}
                    </h3>
                    <p className="text-xs text-slate-300 truncate max-w-lg mt-0.5">
                      {scanResult.url}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-black ${badge.text}`}>
                    {scanResult.confidence_score}% Confidence
                  </div>
                  <span className="text-[10px] text-slate-400">AI Threat Heuristic</span>
                </div>
              </div>
            );
          })()}

          {/* Redirection Chain Visualizer */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Multi-Hop Redirection Chain Analysis:
            </div>

            <div className="p-4 rounded-xl bg-[#070b14] border border-cyan-500/20 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {getRedirectionChain(scanResult).map((hop) => (
                  <div
                    key={hop.hop}
                    className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-1 relative"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-cyan-400 font-bold">Hop {hop.hop}</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold ${
                        hop.status === 200 ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        HTTP {hop.status}
                      </span>
                    </div>
                    <div className="font-bold text-white truncate">{hop.domain}</div>
                    <div className="text-[10px] text-slate-400 truncate">{hop.url}</div>
                    <div className="flex justify-between items-center text-[10px] pt-1 text-slate-500">
                      <span>Latency: {hop.latency}</span>
                      <span className="text-amber-400">{hop.risk}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Threat Indicators & Forensic Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Detected Threat Indicators:
              </span>
              <p className="text-slate-300 font-sans leading-relaxed">
                {scanResult.risk_factors}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Host & Domain Intelligence:
              </span>
              <div className="space-y-1 text-slate-300">
                <div>Domain: <span className="text-white font-bold">{scanResult.domain}</span></div>
                <div>Redirect Count: <span className="text-white font-bold">{scanResult.redirect_count} Hops</span></div>
                <div>Status: <span className="text-red-400 font-bold">{scanResult.threat_type}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Historical Scanned URLs Table */}
      <div className="p-6 rounded-2xl bg-[#0c1427]/90 border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          Recently Inspected Link Intelligence Feed ({links.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-3 font-semibold">Target URL / Domain</th>
                <th className="pb-3 font-semibold">Threat Status</th>
                <th className="pb-3 font-semibold">Confidence</th>
                <th className="pb-3 font-semibold">Triggered Factors</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {links.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setScanResult(item)}
                  className="hover:bg-slate-900/60 transition group cursor-pointer"
                >
                  <td className="py-3.5 pr-4 max-w-sm">
                    <div className="font-bold text-white group-hover:text-cyan-300 truncate">
                      {item.url}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Host: {item.domain}
                    </div>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      item.threat_type === 'Clean' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      item.threat_type === 'Phishing' ? 'bg-red-950 text-red-400 border border-red-800' :
                      'bg-purple-950 text-purple-400 border border-purple-800'
                    }`}>
                      {item.threat_type}
                    </span>
                  </td>

                  <td className="py-3.5 pr-4 font-bold text-slate-200">
                    {item.confidence_score}%
                  </td>

                  <td className="py-3.5 pr-4 max-w-xs">
                    <p className="text-slate-400 text-xs truncate font-sans">
                      {item.risk_factors}
                    </p>
                  </td>

                  <td className="py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setScanResult(item);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-[11px] transition ml-auto"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
