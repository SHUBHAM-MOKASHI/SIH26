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
import { Bot, Link2, FileText, LayoutDashboard, Sparkles, Printer, ExternalLink } from 'lucide-react';

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
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-blue-600/40 font-sans">
      {/* 1. Header with Navy Blue & Black Theme */}
      <Header 
        onRefresh={fetchAllData} 
        loading={loading}
        onOpenReportModal={() => handleOpenReportWithTopic(selectedTopic)}
      />

      {/* Navigation Bar - Navy & Black Theme */}
      <div className="border-b border-blue-950/80 bg-[#080e1e]/90 backdrop-blur-md px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
          {/* Tab 1: Main Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-blue-950 text-blue-300 border border-blue-500/60 shadow-md shadow-blue-950/60'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
            Main Dashboard
          </button>

          {/* Tab 2: Fake Accounts & Bot Scanner */}
          <button
            onClick={() => setActiveTab('bots')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition flex items-center gap-2 ${
              activeTab === 'bots'
                ? 'bg-blue-900/50 text-blue-200 border border-blue-500/60 shadow-md shadow-blue-950/60'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-blue-400" />
            Fake Accounts & Bot Scanner
          </button>

          {/* Tab 3: Dangerous Links & Scam Scanner */}
          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition flex items-center gap-2 ${
              activeTab === 'links'
                ? 'bg-red-950/60 text-red-300 border border-red-500/50 shadow-md shadow-red-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-red-400" />
            Dangerous Links & Scam Scanner
          </button>

          {/* Tab 4: Generated Safety Reports */}
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/50 shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
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
            <div className="p-6 rounded-2xl bg-[#080e1e] border border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-sans">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Official Safety Summary Reports
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Download or print complete summaries with fake account findings, blocked links, and recommended safety steps.
                </p>
              </div>

              <button
                onClick={() => handleOpenReportWithTopic('')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-sans text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-950/60 border border-blue-500/40"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Create New Report</span>
              </button>
            </div>

            <div className="space-y-4">
              {reports.map((r) => (
                <div key={r.id} className="p-6 rounded-2xl bg-[#080e1e] border border-blue-950 space-y-3 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-bold text-blue-300 text-base">{r.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-400 font-mono font-bold">
                        Threat: {r.threat_level}
                      </span>
                      <button
                        onClick={() => handleOpenReportWithTopic(r.top_misinfo_narratives)}
                        className="px-3 py-1 rounded-lg bg-[#050b18] hover:bg-slate-900 text-xs font-sans text-blue-300 border border-blue-950 flex items-center gap-1 transition"
                      >
                        <Printer className="w-3.5 h-3.5" /> Printable View
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">{r.summary}</p>
                  
                  <div className="p-4 rounded-xl bg-[#050b18] border border-blue-950/80 text-xs space-y-1">
                    <div className="font-bold text-blue-400 font-sans">Recommended Safety Steps:</div>
                    <pre className="font-sans text-slate-400 whitespace-pre-wrap leading-relaxed">{r.actionable_recommendations}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

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
