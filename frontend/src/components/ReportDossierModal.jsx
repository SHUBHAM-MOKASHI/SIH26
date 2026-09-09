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
  Radio, 
  Sparkles,
  Share2,
  Lock,
  ExternalLink,
  ChevronDown
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
      console.error("Failed generating dossier:", err);
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Container with print isolation styles */}
      <div className="bg-[#0c1427] border border-cyan-500/40 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-w-none print:max-h-none print:border-none print:shadow-none print:rounded-none print:bg-white print:text-black">
        
        {/* Top Operational Action Bar (Hidden on Print) */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-400">
              <FileText className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
                Tech Netra | Intelligence Dossier Compiler
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Automated threat synthesis & law enforcement briefing generator
              </p>
            </div>
          </div>

          {/* Quick Topic Filter & Print Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1">
              <span className="text-[11px] font-mono text-slate-400">Focus Topic:</span>
              <select
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  fetchDossier(e.target.value);
                }}
                className="bg-transparent text-xs font-mono text-cyan-300 outline-none cursor-pointer"
              >
                <option value="" className="bg-slate-900 text-white">All Monitored Threats</option>
                <option value="#BankingScam" className="bg-slate-900 text-white">#BankingScam (KYC/UPI Fraud)</option>
                <option value="#DeepfakeAlert" className="bg-slate-900 text-white">#DeepfakeAlert (Synthetic Media)</option>
                <option value="#UPSCProtest" className="bg-slate-900 text-white">#UPSCProtest (Civil Unrest)</option>
                <option value="#BoycottECommerce" className="bg-slate-900 text-white">#BoycottECommerce (Astroturf)</option>
              </select>
            </div>

            <button
              onClick={handlePrint}
              disabled={loading || !dossier}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-lg shadow-cyan-950 disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Dossier Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 font-sans print:p-0 print:overflow-visible">
          {loading ? (
            <div className="py-24 text-center space-y-3 font-mono">
              <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-sm text-cyan-300">Synthesizing threat intelligence vectors & bot clusters...</p>
            </div>
          ) : dossier ? (
            <div className="space-y-6 print:text-black">
              {/* Classification Top Header Banner */}
              <div className="bg-slate-900 border border-cyan-500/30 text-cyan-400 text-center py-2 font-mono text-[11px] font-bold tracking-widest uppercase rounded-lg print:bg-slate-100 print:text-black print:border-black">
                {dossier.classification_banner}
              </div>

              {/* Dossier Header Info */}
              <div className="border-b-2 border-cyan-500/40 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 print:border-black">
                <div>
                  <div className="text-xs font-mono text-cyan-400 tracking-wider font-bold print:text-slate-700">
                    GOVERNMENT OF INDIA // TECH NETRA INTELLIGENCE SOC
                  </div>
                  <h1 className="text-2xl font-black text-white mt-1 print:text-black">
                    {dossier.title}
                  </h1>
                  <div className="text-xs font-mono text-slate-400 mt-1 flex flex-wrap items-center gap-3 print:text-slate-600">
                    <span>REF: <strong>{dossier.reference_id}</strong></span>
                    <span>•</span>
                    <span>GENERATED: {new Date(dossier.generated_at).toUTCString()}</span>
                    <span>•</span>
                    <span>TOPIC VECTOR: <strong>{dossier.topic}</strong></span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-md font-mono text-xs font-extrabold tracking-wider ${
                    dossier.threat_level === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800 print:bg-red-100 print:text-red-800' :
                    dossier.threat_level === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800 print:bg-amber-100 print:text-amber-800' :
                    'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}>
                    THREAT SEVERITY: {dossier.threat_level}
                  </span>
                </div>
              </div>

              {/* Section 1: Executive Summary & Reach Metrics */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1 flex items-center gap-2 print:text-black print:border-black">
                  1. Narrative Executive Summary & Incident Scope
                </h2>
                <p className="text-sm text-slate-200 leading-relaxed print:text-slate-900">
                  {dossier.executive_summary}
                </p>

                {/* KPI Overview Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                    <span className="text-[11px] text-slate-400 block">Inspected Posts</span>
                    <span className="text-lg font-bold text-white print:text-black">{dossier.total_posts_analyzed}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                    <span className="text-[11px] text-slate-400 block">Estimated Social Reach</span>
                    <span className="text-lg font-bold text-cyan-300 print:text-blue-700">{dossier.estimated_reach.toLocaleString()} impressions</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                    <span className="text-[11px] text-slate-400 block">Negative / Hostile Polarity</span>
                    <span className="text-lg font-bold text-red-400 print:text-red-700">{dossier.sentiment_polarity.negative_pct}%</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Coordinated Bot Clusters */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-1 flex items-center gap-2 print:text-black print:border-black">
                  2. Identified Coordinated Bot Clusters & Astroturfing Nodes
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border border-slate-800 rounded-xl overflow-hidden print:border-black">
                    <thead className="bg-slate-900 text-slate-300 print:bg-slate-100 print:text-black">
                      <tr className="border-b border-slate-800 print:border-black">
                        <th className="p-2.5">Cluster ID</th>
                        <th className="p-2.5">Estimated Nodes</th>
                        <th className="p-2.5">Avg Bot Score</th>
                        <th className="p-2.5">Coordination Vector</th>
                        <th className="p-2.5">Sample Handles</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                      {dossier.top_bot_clusters.map((c) => (
                        <tr key={c.cluster_id} className="bg-slate-900/40 print:bg-white">
                          <td className="p-2.5 font-bold text-cyan-300 print:text-black">{c.cluster_id}</td>
                          <td className="p-2.5">{c.node_count} nodes</td>
                          <td className="p-2.5 text-red-400 font-bold print:text-red-700">{c.avg_bot_score}%</td>
                          <td className="p-2.5 text-slate-300 print:text-slate-800 font-sans">{c.coordination_type}</td>
                          <td className="p-2.5 text-indigo-300 print:text-indigo-800">{c.sample_handles.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Flagged Deceptive Links */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1 flex items-center gap-2 print:text-black print:border-black">
                  3. Flagged Deceptive Links & Phishing Infrastructure
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border border-slate-800 rounded-xl overflow-hidden print:border-black">
                    <thead className="bg-slate-900 text-slate-300 print:bg-slate-100 print:text-black">
                      <tr className="border-b border-slate-800 print:border-black">
                        <th className="p-2.5">Target URL</th>
                        <th className="p-2.5">Domain</th>
                        <th className="p-2.5">Threat Verdict</th>
                        <th className="p-2.5">Confidence</th>
                        <th className="p-2.5">Triggered Risk Indicators</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                      {dossier.deceptive_links.map((link, idx) => (
                        <tr key={idx} className="bg-slate-900/40 print:bg-white">
                          <td className="p-2.5 font-mono text-slate-200 truncate max-w-[200px] print:text-black">{link.url}</td>
                          <td className="p-2.5 font-bold text-white print:text-black">{link.domain}</td>
                          <td className="p-2.5 font-bold text-red-400 print:text-red-700">{link.threat_type}</td>
                          <td className="p-2.5">{link.confidence_score}%</td>
                          <td className="p-2.5 text-slate-300 print:text-slate-800 font-sans">{link.risk_factors}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4: Actionable Countermeasures */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 flex items-center gap-2 print:text-black print:border-black">
                  4. Actionable Directives for Law Enforcement & SOC Countermeasures
                </h2>

                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 text-xs font-mono print:bg-emerald-50 print:border-emerald-700">
                  {dossier.actionable_countermeasures.map((item, idx) => (
                    <div key={idx} className="text-slate-200 leading-relaxed font-sans print:text-black">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Seal & Watermark */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 print:border-black print:text-black">
                <span>TECH NETRA AI OPS // FOR INTERNAL LEA & SOC DISSEMINATION ONLY</span>
                <span>AUTHENTICATED DIGITAL BRIEF</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
