import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Search, 
  Sparkles, 
  ShieldAlert, 
  Network, 
  UserCheck, 
  AlertTriangle, 
  Clock, 
  Users, 
  Radio, 
  Filter, 
  X, 
  ChevronRight, 
  ExternalLink,
  Lock,
  Layers,
  Share2
} from 'lucide-react';

export default function BotDetectionView({ onRefresh }) {
  const [bots, setBots] = useState([]);
  const [botStats, setBotStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [clusterFilter, setClusterFilter] = useState('');
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  // Single scan form
  const [scanUsername, setScanUsername] = useState('');
  const [scanning, setScanning] = useState(false);
  const [recentScanResult, setRecentScanResult] = useState(null);

  // Selected Account for Network Graph & Relationship Card Modal/Panel
  const [selectedBot, setSelectedBot] = useState(null);

  const fetchBotData = async () => {
    setLoading(true);
    try {
      const [botsRes, statsRes] = await Promise.allSettled([
        fetch('/api/bots?limit=100').then(r => r.json()),
        fetch('/api/bots/stats').then(r => r.json())
      ]);

      if (botsRes.status === 'fulfilled') setBots(botsRes.value);
      if (statsRes.status === 'fulfilled') setBotStats(statsRes.value);
    } catch (err) {
      console.error("Failed fetching bots:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBotData();
  }, []);

  const handleScanAccount = async (e) => {
    e.preventDefault();
    if (!scanUsername) return;
    setScanning(true);
    try {
      const res = await fetch('/api/bots/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: scanUsername })
      });
      const data = await res.json();
      setRecentScanResult(data);
      setSelectedBot(data);
      fetchBotData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const filteredBots = bots.filter((b) => {
    const matchesSearch = searchQuery
      ? b.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.abnormal_patterns.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCluster = clusterFilter
      ? b.network_cluster && b.network_cluster.toLowerCase().includes(clusterFilter.toLowerCase())
      : true;
    const matchesFlagged = flaggedOnly ? b.is_flagged : true;

    return matchesSearch && matchesCluster && matchesFlagged;
  });

  const getScoreColor = (score) => {
    if (score >= 70) return { bar: 'bg-red-500', text: 'text-red-400', badge: 'bg-red-950 text-red-400 border-red-800' };
    if (score >= 40) return { bar: 'bg-amber-500', text: 'text-amber-400', badge: 'bg-amber-950 text-amber-400 border-amber-800' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-400', badge: 'bg-emerald-950 text-emerald-400 border-emerald-800' };
  };

  // Mock relationship nodes for selected account
  const getNetworkConnections = (account) => {
    if (!account) return [];
    const cluster = account.network_cluster || 'Cluster-Astroturf-Alpha';
    return [
      { handle: '@bot_desi_trend_01', type: 'Synchronized Retweeter', delay: '0.4s sync', status: 'Flagged' },
      { handle: '@bot_desi_trend_02', type: 'Copypasta Re-poster', delay: '1.1s sync', status: 'Flagged' },
      { handle: '@bot_net_alpha_09', type: 'Master Campaign Node', delay: 'Root Seed', status: 'Active Bot' },
      { handle: '@free_recharge_5g_bot', type: 'Phishing Propagator', delay: 'Cross-platform', status: 'Flagged' }
    ];
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Live Scan Form */}
      <div className="p-6 rounded-2xl bg-[#0c1427]/90 border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-400">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Bot & Astroturfing Intelligence Center
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Automated cadence anomaly analysis, follower asymmetry heuristics & coordinated farm detection
            </p>
          </div>

          {/* KPI Summary Pills */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Monitored: </span>
              <span className="text-white font-bold">{botStats?.total_analyzed || bots.length}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-800/60 text-xs font-mono">
              <span className="text-red-300">Flagged Bots: </span>
              <span className="text-red-400 font-bold">{botStats?.flagged_bots_count || 0}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-xs font-mono">
              <span className="text-indigo-300">Clusters: </span>
              <span className="text-indigo-400 font-bold">{botStats?.active_clusters_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Live Handle Scan Bar */}
        <form onSubmit={handleScanAccount} className="flex flex-col sm:flex-row gap-3 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Scan any handle e.g. @bot_desi_trend_01, @crypto_fast_alert, or username"
              value={scanUsername}
              onChange={(e) => setScanUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none text-sm text-white font-mono placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={scanning}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs font-mono transition disabled:opacity-50 text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50"
          >
            <Sparkles className="w-4 h-4" />
            {scanning ? 'Analyzing Cadence...' : 'Scan Profile'}
          </button>
        </form>
      </div>

      {/* 2. Interactive Flagged Bots Table */}
      <div className="p-6 rounded-2xl bg-[#0c1427]/90 border border-slate-800 shadow-xl space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 font-mono">
            <Users className="w-4 h-4 text-indigo-400" />
            Flagged Account Profiles & Coordinated Nodes ({filteredBots.length})
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search handles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <select
              value={clusterFilter}
              onChange={(e) => setClusterFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none font-mono"
            >
              <option value="">All Clusters</option>
              <option value="Cluster-Astroturf-Alpha">Cluster-Astroturf-Alpha</option>
              <option value="Cluster-Phish-Syndicate">Cluster-Phish-Syndicate</option>
              <option value="Cluster-Disinfo-EchoNet">Cluster-Disinfo-EchoNet</option>
            </select>

            <button
              onClick={() => setFlaggedOnly(!flaggedOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition ${
                flaggedOnly
                  ? 'bg-red-950 text-red-300 border-red-700 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Flagged Only
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-3 font-semibold">Account Handle</th>
                <th className="pb-3 font-semibold">Bot Probability</th>
                <th className="pb-3 font-semibold">Account Age</th>
                <th className="pb-3 font-semibold">Network Cluster</th>
                <th className="pb-3 font-semibold">Detected Behaviors</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredBots.map((account) => {
                const scoreStyle = getScoreColor(account.bot_probability);
                return (
                  <tr
                    key={account.id}
                    className="hover:bg-slate-900/60 transition group cursor-pointer"
                    onClick={() => setSelectedBot(account)}
                  >
                    {/* Username */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-cyan-300 transition">
                          {account.username}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {account.platform}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {account.followers_count} followers / {account.following_count} following
                      </div>
                    </td>

                    {/* Bot Score with Progress Bar */}
                    <td className="py-3.5 pr-4 min-w-[140px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold ${scoreStyle.text}`}>
                          {account.bot_probability}%
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {account.posts_frequency_per_hr} posts/hr
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${scoreStyle.bar}`}
                          style={{ width: `${account.bot_probability}%` }}
                        />
                      </div>
                    </td>

                    {/* Account Age */}
                    <td className="py-3.5 pr-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{account.account_age_days} days</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {account.account_age_days < 10 ? 'Brand New' : 'Established'}
                      </span>
                    </td>

                    {/* Network Cluster */}
                    <td className="py-3.5 pr-4">
                      {account.network_cluster ? (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800 text-[11px] font-bold">
                          {account.network_cluster}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Independent Node</span>
                      )}
                    </td>

                    {/* Detected Behaviors */}
                    <td className="py-3.5 pr-4 max-w-xs">
                      <p className="text-slate-300 text-xs truncate font-sans">
                        {account.abnormal_patterns || 'Standard organic activity'}
                      </p>
                    </td>

                    {/* Inspect Button */}
                    <td className="py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBot(account);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold transition flex items-center gap-1 ml-auto"
                      >
                        <Network className="w-3.5 h-3.5" />
                        Network Card
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Account Relationship Card / Coordinated Network Modal */}
      {selectedBot && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c1427] border border-indigo-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-950/90 border border-indigo-500/50 text-indigo-400">
                  <Network className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white font-mono">
                    Account Relationship & Coordinated Network Map
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Cluster Linkage: {selectedBot.network_cluster || 'Independent Anomaly'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBot(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto font-mono">
              {/* Profile Overview Card */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{selectedBot.username}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">{selectedBot.platform}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Followers: <span className="text-white">{selectedBot.followers_count}</span> | Following: <span className="text-white">{selectedBot.following_count}</span> | Rate: <span className="text-amber-400">{selectedBot.posts_frequency_per_hr} posts/hr</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-black ${getScoreColor(selectedBot.bot_probability).text}`}>
                    {selectedBot.bot_probability}% BOT
                  </div>
                  <span className="text-[10px] text-slate-400">Confidence Score</span>
                </div>
              </div>

              {/* Visual Mock Relationship Nodes Graph */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Synchronized Interconnected Nodes in Cluster:
                </div>

                <div className="p-4 rounded-xl bg-[#070b14] border border-cyan-500/20 space-y-3">
                  {/* Central Node */}
                  <div className="flex items-center justify-center">
                    <div className="px-4 py-2 rounded-xl bg-indigo-950 border border-indigo-500 text-indigo-300 font-bold text-xs shadow-lg shadow-indigo-950">
                      🎯 Target Node: {selectedBot.username}
                    </div>
                  </div>

                  <div className="flex justify-center text-slate-600">↓ Coordinated Linkages ↓</div>

                  {/* Connected Nodes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {getNetworkConnections(selectedBot).map((conn, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-cyan-300">{conn.handle}</div>
                          <div className="text-[10px] text-slate-400">{conn.type}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                            {conn.delay}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Behavior Analysis Details */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
                <span className="font-semibold text-amber-400">Flagged Cadence Anomalies:</span>
                <p className="text-slate-300 font-sans leading-relaxed">
                  {selectedBot.abnormal_patterns}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between font-mono text-xs">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedBot, null, 2));
                  alert("Account forensic payload copied!");
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" /> Export Network JSON
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Quarantine mandate issued for ${selectedBot.username} and connected cluster nodes.`)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" /> Quarantine Bot Node
                </button>
                <button
                  onClick={() => setSelectedBot(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
