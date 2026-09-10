import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KpiMetrics from './components/KpiMetrics';
import TrendNarrativeTracker from './components/TrendNarrativeTracker';
import GeospatialThreatMap from './components/GeospatialThreatMap';
import LiveIncidentStream from './components/LiveIncidentStream';
import AnalysisModal from './components/AnalysisModal';
import BotDetectionView from './components/BotDetectionView';
import LinkAnalyzerView from './components/LinkAnalyzerView';
import ReportDossierModal from './components/ReportDossierModal';
import { apiUrl } from './services/api';
import { Bot, Link2, FileText, LayoutDashboard, Sparkles, Printer, ExternalLink, Shield, Activity, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'bots', 'links', 'reports'
  
  // Data States
  const [analytics, setAnalytics] = useState(null);
  const [posts, setPosts] = useState([]);
  const [heatmaps, setHeatmaps] = useState([]);
  const [botStats, setBotStats] = useState(null);
  const [linkStats, setLinkStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  // Selected Post for Detail Modal
  const [analyzingPost, setAnalyzingPost] = useState(null);

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTopic, setReportTopic] = useState('');

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, postsRes, heatmapRes, botRes, linkRes, reportsRes] = await Promise.allSettled([
        fetch(apiUrl('/api/trends/analytics')).then(r => r.json()),
        fetch(apiUrl('/api/posts?limit=100')).then(r => r.json()),
        fetch(apiUrl('/api/trends/heatmap')).then(r => r.json()),
        fetch(apiUrl('/api/bots/stats')).then(r => r.json()),
        fetch(apiUrl('/api/links/stats')).then(r => r.json()),
        fetch(apiUrl('/api/reports')).then(r => r.json())
      ]);

      if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value);
      if (postsRes.status === 'fulfilled') setPosts(postsRes.value);
      if (heatmapRes.status === 'fulfilled') setHeatmaps(heatmapRes.value);
      if (botRes.status === 'fulfilled') setBotStats(botRes.value);
      if (linkRes.status === 'fulfilled') setLinkStats(linkRes.value);
      if (reportsRes.status === 'fulfilled') setReports(reportsRes.value);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleFlagToggle = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_flagged: !p.is_flagged } : p));
    if (analyzingPost && analyzingPost.id === postId) {
      setAnalyzingPost(prev => ({ ...prev, is_flagged: !prev.is_flagged }));
    }
  };

  const handleOpenReportWithTopic = (topic) => {
    setReportTopic(topic || '');
    setIsReportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#12355B] flex flex-col font-sans">
      {/* 1. Navbar Header with Light Theme */}
      <Header 
        onRefresh={fetchAllData} 
        loading={loading}
        onOpenReportModal={() => handleOpenReportWithTopic(selectedTopic)}
      />

      {/* 2. Brand Hero Banner */}
      <section className="bg-gradient-to-b from-[#EBF5FB] via-[#F3F8FC] to-[#F7FAFC] border-b border-slate-200/80 px-6 py-6 sm:py-8 relative overflow-hidden">
        {/* Subtle Decorative SVG Network Nodes */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#19B5E6" strokeWidth="0.5" strokeOpacity="0.25" />
                <circle cx="40" cy="40" r="1.5" fill="#1769AA" fillOpacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heroGrid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-[#D4E8F8] text-[#1769AA] text-xs font-semibold shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#19B5E6]" />
              National Cybersecurity Intelligence Grid
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12355B] tracking-tight">
              See a <span className="text-[#1769AA]">Safer Tomorrow</span>
            </h2>
            <p className="text-sm text-[#4A607A] max-w-2xl leading-relaxed">
              Real-time misinformation tracking, fake bot account clustering, and malicious URL neutralization safeguarding citizens across India.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="text-xs">
                <span className="text-[#4A607A] block">Threat Status</span>
                <span className="font-bold text-[#12355B] font-mono">ALL FEEDS OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Navigation Bar - Clean Light Pill Tabs */}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 py-2.5 sticky top-[69px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
          {/* Tab 1: Main Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-[#1769AA] text-white shadow-sm shadow-[#1769AA]/20'
                : 'text-[#4A607A] hover:text-[#12355B] hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className={`w-3.5 h-3.5 ${activeTab === 'dashboard' ? 'text-white' : 'text-[#1769AA]'}`} />
            Main Dashboard
          </button>

          {/* Tab 2: Fake Accounts & Bot Scanner */}
          <button
            onClick={() => setActiveTab('bots')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition flex items-center gap-2 ${
              activeTab === 'bots'
                ? 'bg-[#1769AA] text-white shadow-sm shadow-[#1769AA]/20'
                : 'text-[#4A607A] hover:text-[#12355B] hover:bg-slate-100'
            }`}
          >
            <Bot className={`w-3.5 h-3.5 ${activeTab === 'bots' ? 'text-white' : 'text-amber-500]'}`} />
            Fake Accounts & Bot Scanner
          </button>

          {/* Tab 3: Dangerous Links & Scam Scanner */}
          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition flex items-center gap-2 ${
              activeTab === 'links'
                ? 'bg-[#1769AA] text-white shadow-sm shadow-[#1769AA]/20'
                : 'text-[#4A607A] hover:text-[#12355B] hover:bg-slate-100'
            }`}
          >
            <Link2 className={`w-3.5 h-3.5 ${activeTab === 'links' ? 'text-white' : 'text-rose-500'}`} />
            Dangerous Links & Scam Scanner
          </button>

          {/* Tab 4: Generated Safety Reports */}
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-[#1769AA] text-white shadow-sm shadow-[#1769AA]/20'
                : 'text-[#4A607A] hover:text-[#12355B] hover:bg-slate-100'
            }`}
          >
            <FileText className={`w-3.5 h-3.5 ${activeTab === 'reports' ? 'text-white' : 'text-purple-600'}`} />
            Generated Safety Reports ({reports.length})
          </button>
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* VIEW 1: MAIN DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            {/* KPI Cards */}
            <KpiMetrics analytics={analytics} botStats={botStats} linkStats={linkStats} />

            {/* Grid Layout: Trend Tracker + Interactive India Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Trending Topics & Rumor Tracker */}
              <TrendNarrativeTracker 
                analytics={analytics} 
                onSelectTopic={(topic) => {
                  setSelectedTopic(topic);
                  handleOpenReportWithTopic(topic);
                }} 
              />

              {/* Right Column: Live India Safety Map */}
              <GeospatialThreatMap 
                heatmaps={heatmaps} 
                selectedRegion={selectedRegion}
                onSelectRegion={(region) => setSelectedRegion(region)} 
              />
            </div>

            {/* Live Incident Stream */}
            <LiveIncidentStream
              posts={posts}
              onAnalyze={(post) => setAnalyzingPost(post)}
              onFlagToggle={handleFlagToggle}
              selectedTopic={selectedTopic}
              selectedRegion={selectedRegion}
              onClearFilters={() => {
                setSelectedTopic('');
                setSelectedRegion('');
              }}
            />
          </>
        )}

        {/* VIEW 2: FAKE ACCOUNTS & BOT SCANNER */}
        {activeTab === 'bots' && (
          <BotDetectionView onRefresh={fetchAllData} />
        )}

        {/* VIEW 3: DANGEROUS LINKS & SCAM SCANNER */}
        {activeTab === 'links' && (
          <LinkAnalyzerView onRefresh={fetchAllData} />
        )}

        {/* VIEW 4: GENERATED SAFETY REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-[#12355B] flex items-center gap-2 font-sans">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Official Safety Summary Reports
                </h3>
                <p className="text-xs text-[#4A607A] font-sans mt-1">
                  Download or print complete summaries with fake account findings, blocked links, and recommended safety steps.
                </p>
              </div>

              <button
                onClick={() => handleOpenReportWithTopic('')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-sans text-xs font-semibold transition flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Create New Report</span>
              </button>
            </div>

            <div className="space-y-4">
              {reports.map((r) => (
                <div key={r.id} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-3 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-bold text-[#12355B] text-base">{r.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold border ${
                        r.threat_level === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        r.threat_level === 'HIGH' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        Threat: {r.threat_level}
                      </span>
                      <button
                        onClick={() => handleOpenReportWithTopic(r.top_misinfo_narratives)}
                        className="px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-xs font-sans text-purple-700 border border-purple-200 flex items-center gap-1 transition"
                      >
                        <Printer className="w-3.5 h-3.5" /> Printable View
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-[#4A607A] leading-relaxed font-sans">{r.summary}</p>
                  
                  <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 text-xs space-y-1">
                    <div className="font-bold text-purple-900 font-sans">Recommended Safety Steps:</div>
                    <pre className="font-sans text-purple-800 whitespace-pre-wrap leading-relaxed">{r.actionable_recommendations}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 4. Footer with Deep Grounding Navy Background */}
      <footer className="bg-[#12355B] text-slate-300 border-t border-slate-700 mt-12 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Tech Netra Logo" 
              className="w-10 h-10 rounded-full object-cover bg-white p-0.5 border border-[#19B5E6]/40 shadow-sm" 
            />
            <div>
              <div className="font-bold text-white text-sm tracking-wide">TECH NETRA CYBER RADAR</div>
              <div className="text-xs text-slate-400">National Cyber Safety & Misinformation Threat Intelligence</div>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right space-y-1">
            <div>&copy; {new Date().getFullYear()} Tech Netra Platform. All rights reserved.</div>
            <div className="text-slate-500 font-mono">Version 2.4-Production // Encrypted Threat Feeds</div>
          </div>
        </div>
      </footer>

      {/* Detailed Post Inspection Modal */}
      <AnalysisModal
        post={analyzingPost}
        onClose={() => setAnalyzingPost(null)}
        onFlagToggle={handleFlagToggle}
      />

      {/* Printable Report Modal */}
      <ReportDossierModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialTopic={reportTopic}
      />
    </div>
  );
}
