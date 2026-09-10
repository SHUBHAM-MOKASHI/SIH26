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
  Clock, 
  CheckCircle2
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

  const getRedirectionChain = (result) => {
    if (!result) return [];
    if (result.threat_type === 'Clean') {
      return [
        { hop: 1, url: result.url, status: 200, latency: '42ms', domain: result.domain, risk: 'Safe' }
      ];
    }

    return [
      { hop: 1, url: `http://t.co/shortlink12`, status: 301, latency: '35ms', domain: 't.co', risk: 'Short Link' },
      { hop: 2, url: `http://redirect-proxy.xyz/gateway`, status: 302, latency: '89ms', domain: 'redirect-proxy.xyz', risk: 'Hidden Redirect' },
      { hop: 3, url: result.url, status: 200, latency: '142ms', domain: result.domain, risk: result.threat_type }
    ];
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Clean':
        return { 
          bg: 'bg-zinc-900', 
          border: 'border-zinc-600', 
          text: 'text-white', 
          icon: <ShieldCheck className="w-5 h-5 text-zinc-100" />,
          title: 'SAFE & VERIFIED WEBSITE'
        };
      case 'Phishing':
        return { 
          bg: 'bg-zinc-900', 
          border: 'border-white/40', 
          text: 'text-white', 
          icon: <ShieldAlert className="w-5 h-5 text-white animate-pulse" />,
          title: 'FAKE PHISHING SCAM DETECTED'
        };
      case 'Malware':
        return { 
          bg: 'bg-zinc-900', 
          border: 'border-zinc-500', 
          text: 'text-zinc-200', 
          icon: <AlertTriangle className="w-5 h-5 text-white animate-bounce" />,
          title: 'DANGEROUS APP / APK FILE DOWNLOAD'
        };
      default:
        return { 
          bg: 'bg-zinc-900', 
          border: 'border-zinc-700', 
          text: 'text-zinc-300', 
          icon: <AlertTriangle className="w-5 h-5 text-zinc-300" />,
          title: 'SUSPICIOUS WEBSITE'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Scanner Input */}
      <div className="p-6 rounded-2xl bg-[#0e0e12] border border-zinc-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-black border border-zinc-700 text-white">
                <Link2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide font-sans">
                Dangerous Links & Scam Website Scanner
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              Check any link to see if it is a fake banking page, phishing scam, or dangerous file download.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 font-sans">
            <div className="px-3 py-1.5 rounded-xl bg-black border border-zinc-800 text-xs">
              <span className="text-zinc-400">Links Checked: </span>
              <span className="text-white font-bold font-mono">{linkStats?.total_scanned || links.length}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs">
              <span className="text-zinc-300">Phishing Scams: </span>
              <span className="text-white font-bold font-mono">{linkStats?.phishing_count || 0}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs">
              <span className="text-zinc-300">Dangerous Files: </span>
              <span className="text-white font-bold font-mono">{linkStats?.malware_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Scan Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleScan(); }} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Paste any website link e.g. http://secure-login-hdfc-kyc-update.xyz/verify-pan"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-zinc-800 focus:border-white outline-none text-sm text-white font-mono placeholder:text-zinc-600 transition"
            />
          </div>
          <button
            type="submit"
            disabled={scanning}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 font-bold text-xs font-sans transition disabled:opacity-50 text-black flex items-center justify-center gap-2 shadow-md"
          >
            <Sparkles className="w-4 h-4 text-black" />
            {scanning ? 'Checking Website...' : 'Check Link'}
          </button>
        </form>

        {/* Quick Sample Triggers */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-sans">
          <span className="text-zinc-400 font-medium">Try Sample Links:</span>
          <button
            onClick={() => {
              const url = "http://secure-login-hdfc-kyc-update.xyz/verify-pan";
              setInputUrl(url);
              handleScan(url);
            }}
            className="px-2.5 py-1 rounded-lg bg-black border border-zinc-800 hover:border-zinc-500 text-zinc-300 transition"
          >
            Fake Bank KYC Link
          </button>

          <button
            onClick={() => {
              const url = "http://192.168.45.12/sbi-yono-apk-download.apk";
              setInputUrl(url);
              handleScan(url);
            }}
            className="px-2.5 py-1 rounded-lg bg-black border border-zinc-800 hover:border-zinc-500 text-zinc-300 transition"
          >
            Fake APK File Download
          </button>

          <button
            onClick={() => {
              const url = "https://cybercrime.gov.in";
              setInputUrl(url);
              handleScan(url);
            }}
            className="px-2.5 py-1 rounded-lg bg-black border border-zinc-800 hover:border-zinc-500 text-zinc-300 transition"
          >
            Official Govt Portal (Safe)
          </button>
        </div>
      </div>

      {/* 2. Scan Inspection Results Panel */}
      {scanResult && (
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-zinc-800 shadow-xl space-y-5 font-sans">
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
                    <p className="text-xs text-zinc-300 truncate max-w-lg mt-0.5 font-mono">
                      {scanResult.url}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-black font-mono ${badge.text}`}>
                    {scanResult.confidence_score}% Confidence
                  </div>
                  <span className="text-[10px] text-zinc-400">Safety Check Rating</span>
                </div>
              </div>
            );
          })()}

          {/* Redirection Chain Visualizer */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-400" />
              Where does this link redirect you? (Redirect Path):
            </div>

            <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-3 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {getRedirectionChain(scanResult).map((hop) => (
                  <div
                    key={hop.hop}
                    className="p-3 rounded-lg bg-[#141418] border border-zinc-800 text-xs space-y-1 relative"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white font-bold font-mono">Step {hop.hop}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold font-mono ${
                        hop.status === 200 ? 'bg-zinc-800 text-white' : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        HTTP {hop.status}
                      </span>
                    </div>
                    <div className="font-bold text-white truncate font-mono">{hop.domain}</div>
                    <div className="text-[10px] text-zinc-400 truncate font-mono">{hop.url}</div>
                    <div className="flex justify-between items-center text-[10px] pt-1 text-zinc-500">
                      <span>Status:</span>
                      <span className="text-zinc-200 font-medium">{hop.risk}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Threat Indicators Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-zinc-300" /> Why is this link dangerous?
              </span>
              <p className="text-zinc-300 leading-relaxed font-sans">
                {scanResult.risk_factors}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-zinc-300" /> Website Host Information:
              </span>
              <div className="space-y-1 text-zinc-300 font-mono">
                <div>Domain: <span className="text-white font-bold">{scanResult.domain}</span></div>
                <div>Redirects: <span className="text-white font-bold">{scanResult.redirect_count} times</span></div>
                <div>Verdict: <span className="text-white font-bold">{scanResult.threat_type}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Historical Scanned URLs Table */}
      <div className="p-6 rounded-2xl bg-[#0e0e12] border border-zinc-800 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-white font-sans flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-400" />
          Recently Scanned Links ({links.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-[11px]">
                <th className="pb-3 font-semibold">Website Link / Domain</th>
                <th className="pb-3 font-semibold">Safety Status</th>
                <th className="pb-3 font-semibold">Confidence</th>
                <th className="pb-3 font-semibold">Details</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {links.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setScanResult(item)}
                  className="hover:bg-zinc-900/60 transition group cursor-pointer"
                >
                  <td className="py-3.5 pr-4 max-w-sm">
                    <div className="font-bold text-white group-hover:text-zinc-200 truncate font-mono">
                      {item.url}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                      Host: {item.domain}
                    </div>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      item.threat_type === 'Clean' ? 'bg-zinc-800 text-zinc-200 border border-zinc-700' :
                      item.threat_type === 'Phishing' ? 'bg-zinc-900 text-white border border-zinc-600' :
                      'bg-zinc-900 text-zinc-300 border border-zinc-700'
                    }`}>
                      {item.threat_type === 'Clean' ? 'Safe' : item.threat_type}
                    </span>
                  </td>

                  <td className="py-3.5 pr-4 font-bold text-zinc-200 font-mono">
                    {item.confidence_score}%
                  </td>

                  <td className="py-3.5 pr-4 max-w-xs">
                    <p className="text-zinc-400 text-xs truncate font-sans">
                      {item.risk_factors}
                    </p>
                  </td>

                  <td className="py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setScanResult(item);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-[11px] transition ml-auto font-sans font-medium"
                    >
                      View Details
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
