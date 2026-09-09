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

  // Selected Post for Deep Forensic Modal
  const [analyzingPost, setAnalyzingPost] = useState(null);

  // Report Dossier Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTopic, setReportTopic] = useState('');

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, postsRes, heatmapRes, botRes, linkRes, reportsRes] = await Promise.allSettled([
        fetch('/api/trends/analytics').then(r => r.json()),
        fetch('/api/posts?limit=100').then(r => r.json()),
        fetch('/api/trends/heatmap').then(r => r.json()),
        fetch('/api/bots/stats').then(r => r.json()),
        fetch('/api/links/stats').then(r => r.json()),
        fetch('/api/reports').then(r => r.json())
      ]);

      if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value);
      if (postsRes.status === 'fulfilled') setPosts(postsRes.value);
      if (heatmapRes.status === 'fulfilled') setHeatmaps(heatmapRes.value);
      if (botRes.status === 'fulfilled') setBotStats(botRes.value);
      if (linkRes.status === 'fulfilled') setLinkStats(linkRes.value);
      if (reportsRes.status === 'fulfilled') setReports(reportsRes.value);
    } catch (err) {
      console.error("Error fetching telemetry:", err);
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
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-cyan-500/30 font-sans">
      {/* 1. Header & Navigation with "Generate Intelligence Brief" */}
      <Header 
        onRefresh={fetchAllData} 
        loading={loading}
        onOpenReportModal={() => handleOpenReportWithTopic(selectedTopic)}
      />

      {/* Module Navigation Tabs */}
      <div className="border-b border-slate-800 bg-[#0c1427]/60 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Operations Command Center
          </button>

          <button
            onClick={() => setActiveTab('bots')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 ${
              activeTab === 'bots'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/50 shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            Bot & Astroturf Scanner
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 ${
              activeTab === 'links'
                ? 'bg-red-950 text-red-300 border border-red-500/50 shadow-md shadow-red-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-red-400" />
            Phishing & Payload Scanner
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-purple-950 text-purple-300 border border-purple-500/50 shadow-md shadow-purple-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            Intelligence Briefs ({reports.length})
          </button>
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* VIEW 1: PRIMARY OPERATIONS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            {/* 2. KPI Top Metric Cards */}
            <KpiMetrics analytics={analytics} botStats={botStats} linkStats={linkStats} />

            {/* 3. Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Trend & Narrative Tracker */}
              <TrendNarrativeTracker 
                analytics={analytics} 
                onSelectTopic={(topic) => {
                  setSelectedTopic(topic);
                  handleOpenReportWithTopic(topic);
                }} 
              />

              {/* Right Column: Geospatial Threat Heatmap */}
              <GeospatialThreatMap 
                heatmaps={heatmaps} 
                onSelectRegion={(region) => setSelectedRegion(region)} 
              />
            </div>

            {/* 4. Live Incident Stream */}
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

        {/* VIEW 2: DEDICATED BOT & ASTROTURF SCANNER */}
        {activeTab === 'bots' && (
          <BotDetectionView onRefresh={fetchAllData} />
        )}

        {/* VIEW 3: DEDICATED PHISHING & LINK SCANNER */}
        {activeTab === 'links' && (
          <LinkAnalyzerView onRefresh={fetchAllData} />
        )}

        {/* VIEW 4: INTELLIGENCE BRIEFS */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0c1427] border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Synthesized Threat Intelligence Briefs & Dossiers
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Compile comprehensive dossiers with executive summaries, bot cluster mappings, and legal countermeasures
                </p>
              </div>

              <button
                onClick={() => handleOpenReportWithTopic('')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-950/60"
              >
                <Sparkles className="w-4 h-4" />
                <span>Compile New Dossier</span>
              </button>
            </div>

            <div className="space-y-4">
              {reports.map((r) => (
                <div key={r.id} className="p-6 rounded-2xl bg-[#0c1427] border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-bold text-cyan-300 text-base">{r.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-red-950 border border-red-800 text-red-400 font-mono font-bold">
                        Threat: {r.threat_level}
                      </span>
                      <button
                        onClick={() => handleOpenReportWithTopic(r.top_misinfo_narratives)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> Printable Dossier
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">{r.summary}</p>
                  
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1 font-mono">
                    <div className="font-bold text-amber-400">Actionable Countermeasures:</div>
                    <pre className="font-sans text-slate-400 whitespace-pre-wrap leading-relaxed">{r.actionable_recommendations}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Deep Forensic AI Modal for Post */}
      <AnalysisModal
        post={analyzingPost}
        onClose={() => setAnalyzingPost(null)}
        onFlagToggle={handleFlagToggle}
      />

      {/* Comprehensive Printable Intelligence Dossier Modal */}
      <ReportDossierModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialTopic={reportTopic}
      />
    </div>
  );
}
