import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  ShieldAlert, 
  Bot, 
  Link2, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Share2
} from 'lucide-react';

import { apiUrl } from '../services/api';

export default function ReportDossierModal({ isOpen, onClose, initialTopic = '' }) {
  const [topic, setTopic] = useState(initialTopic);
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDossier = async (targetTopic) => {
    setLoading(true);
    try {
      const queryParam = targetTopic ? `?topic=${encodeURIComponent(targetTopic)}` : '';
      const res = await fetch(apiUrl(`/api/reports/generate${queryParam}`));
      const data = await res.json();
      setDossier(data);
    } catch (err) {
      console.error("Failed generating report:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchDossier(initialTopic);
    }
  }, [isOpen, initialTopic]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Container with print isolation styles */}
      <div className="bg-[#0e0e12] border border-zinc-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-w-none print:max-h-none print:border-none print:shadow-none print:rounded-none print:bg-white print:text-black">
        
        {/* Top Operational Action Bar (Hidden on Print) */}
        <div className="p-4 bg-black border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 print:hidden font-sans">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                Tech Netra | Safety Summary Report
              </h3>
              <p className="text-[11px] text-zinc-400">
                Automated summary of fake news, scams, and recommended public safety steps.
              </p>
            </div>
          </div>

          {/* Quick Topic Filter & Print Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#141418] border border-zinc-800 rounded-xl px-2.5 py-1">
              <span className="text-[11px] text-zinc-400">Filter Topic:</span>
              <select
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  fetchDossier(e.target.value);
                }}
                className="bg-transparent text-xs text-white outline-none cursor-pointer"
              >
                <option value="" className="bg-black text-white">All Monitored Threats</option>
                <option value="#BankingScam" className="bg-black text-white">#BankingScam (Fake Bank Messages)</option>
                <option value="#DeepfakeAlert" className="bg-black text-white">#DeepfakeAlert (AI Fake Audio/Video)</option>
                <option value="#UPSCProtest" className="bg-black text-white">#UPSCProtest (Student Rallies)</option>
                <option value="#BoycottOnlineRetailers" className="bg-black text-white">#BoycottOnlineRetailers (Spam)</option>
              </select>
            </div>

            <button
              onClick={handlePrint}
              disabled={loading || !dossier}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold flex items-center gap-1.5 transition shadow-md disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5 text-black" />
              Print / Save PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Report Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 font-sans print:p-0 print:overflow-visible">
          {loading ? (
            <div className="py-24 text-center space-y-3 font-sans">
              <Sparkles className="w-8 h-8 text-white animate-spin mx-auto" />
              <p className="text-sm text-zinc-300">Compiling safety summary and fake account findings...</p>
            </div>
          ) : dossier ? (
            <div className="space-y-6 print:text-black">
              {/* Top Classification Header */}
              <div className="bg-black border border-zinc-700 text-zinc-200 text-center py-2 text-[11px] font-bold tracking-widest uppercase rounded-lg print:bg-slate-100 print:text-black print:border-black font-mono">
                {dossier.classification_banner || 'OFFICIAL CYBER SAFETY ADVISORY // TECH NETRA'}
              </div>

              {/* Header Info */}
              <div className="border-b-2 border-zinc-700 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 print:border-black">
                <div>
                  <div className="text-xs text-zinc-400 tracking-wider font-bold print:text-slate-700">
                    NATIONAL CYBER INCIDENT SUMMARY
                  </div>
                  <h1 className="text-2xl font-black text-white mt-1 print:text-black">
                    {dossier.title}
                  </h1>
                  <div className="text-xs text-zinc-400 mt-1 flex flex-wrap items-center gap-3 print:text-slate-600 font-mono">
                    <span>REF: <strong>{dossier.reference_id}</strong></span>
                    <span>•</span>
                    <span>GENERATED: {new Date(dossier.generated_at).toUTCString()}</span>
                    <span>•</span>
                    <span>MAIN TOPIC: <strong>{dossier.topic}</strong></span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-md text-xs font-extrabold tracking-wider ${
                    dossier.threat_level === 'CRITICAL' ? 'bg-zinc-800 text-white border border-zinc-600 print:bg-slate-200 print:text-black' :
                    dossier.threat_level === 'HIGH' ? 'bg-zinc-900 text-zinc-200 border border-zinc-700 print:bg-slate-200 print:text-black' :
                    'bg-zinc-900 text-zinc-300 border border-zinc-800'
                  }`}>
                    THREAT SEVERITY: {dossier.threat_level}
                  </span>
                </div>
              </div>

              {/* Section 1: Executive Summary & Reach Metrics */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-1 flex items-center gap-2 print:text-black print:border-black font-sans">
                  1. Executive Summary & Rumor Spread
                </h2>
                <p className="text-sm text-zinc-300 leading-relaxed print:text-slate-900 font-sans">
                  {dossier.executive_summary}
                </p>

                {/* KPI Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-sans">
                  <div className="p-3.5 rounded-xl bg-black border border-zinc-800 print:bg-slate-50 print:border-slate-300">
                    <span className="text-[11px] text-zinc-400 block">Total Messages Scanned</span>
                    <span className="text-lg font-bold text-white font-mono print:text-black">{dossier.total_posts_analyzed}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black border border-zinc-800 print:bg-slate-50 print:border-slate-300">
                    <span className="text-[11px] text-zinc-400 block">Estimated Audience Reach</span>
                    <span className="text-lg font-bold text-white font-mono print:text-black">{dossier.estimated_reach.toLocaleString()} people</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black border border-zinc-800 print:bg-slate-50 print:border-slate-300">
                    <span className="text-[11px] text-zinc-400 block">Panic / Hostile Sentiment</span>
                    <span className="text-lg font-bold text-zinc-200 font-mono print:text-black">{dossier.sentiment_polarity.negative_pct}%</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Fake Bot Accounts */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-1 flex items-center gap-2 print:text-black print:border-black font-sans">
                  2. Detected Fake Accounts & Spam Networks
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-zinc-800 rounded-xl overflow-hidden print:border-black font-sans">
                    <thead className="bg-black text-zinc-300 print:bg-slate-100 print:text-black">
                      <tr className="border-b border-zinc-800 print:border-black">
                        <th className="p-2.5">Spam Group</th>
                        <th className="p-2.5">Fake Accounts</th>
                        <th className="p-2.5">Bot Score</th>
                        <th className="p-2.5">Behavior Type</th>
                        <th className="p-2.5">Sample Usernames</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 print:divide-slate-300 font-sans">
                      {dossier.top_bot_clusters.map((c) => (
                        <tr key={c.cluster_id} className="bg-black/50 print:bg-white">
                          <td className="p-2.5 font-bold text-white print:text-black font-mono">{c.cluster_id}</td>
                          <td className="p-2.5 font-mono text-zinc-300">{c.node_count} bots</td>
                          <td className="p-2.5 text-white font-bold font-mono print:text-black">{c.avg_bot_score}%</td>
                          <td className="p-2.5 text-zinc-300 print:text-slate-800">{c.coordination_type}</td>
                          <td className="p-2.5 text-zinc-300 print:text-black font-mono">{c.sample_handles.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Blocked Phishing Links */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-1 flex items-center gap-2 print:text-black print:border-black font-sans">
                  3. Blocked Phishing Links & Fake Websites
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-zinc-800 rounded-xl overflow-hidden print:border-black font-sans">
                    <thead className="bg-black text-zinc-300 print:bg-slate-100 print:text-black">
                      <tr className="border-b border-zinc-800 print:border-black">
                        <th className="p-2.5">Target Web Link</th>
                        <th className="p-2.5">Domain</th>
                        <th className="p-2.5">Safety Verdict</th>
                        <th className="p-2.5">Confidence</th>
                        <th className="p-2.5">Why Flagged?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 print:divide-slate-300 font-sans">
                      {dossier.deceptive_links.map((link, idx) => (
                        <tr key={idx} className="bg-black/50 print:bg-white">
                          <td className="p-2.5 font-mono text-zinc-300 truncate max-w-[200px] print:text-black">{link.url}</td>
                          <td className="p-2.5 font-bold text-white print:text-black font-mono">{link.domain}</td>
                          <td className="p-2.5 font-bold text-white print:text-black">{link.threat_type}</td>
                          <td className="p-2.5 font-mono text-zinc-300">{link.confidence_score}%</td>
                          <td className="p-2.5 text-zinc-400 print:text-slate-800">{link.risk_factors}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4: Recommended Safety Steps */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-1 flex items-center gap-2 print:text-black print:border-black font-sans">
                  4. Recommended Public Safety & Countermeasure Steps
                </h2>

                <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2 text-xs font-sans print:bg-slate-50 print:border-slate-300">
                  {dossier.actionable_countermeasures.map((item, idx) => (
                    <div key={idx} className="text-zinc-300 leading-relaxed print:text-black">
                      • {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 print:border-black print:text-black font-mono">
                <span>TECH NETRA // NATIONAL CYBER SAFETY ADVISORY</span>
                <span>AUTHENTICATED DIGITAL REPORT</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
