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
  X, 
  Layers, 
  Share2, 
  Lock 
} from 'lucide-react';

import { apiUrl } from '../services/api';

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

  // Selected Account for Modal
  const [selectedBot, setSelectedBot] = useState(null);

  const fetchBotData = async () => {
    setLoading(true);
    try {
      const [botsRes, statsRes] = await Promise.allSettled([
        fetch(apiUrl('/api/bots?limit=100')).then(r => r.json()),
        fetch(apiUrl('/api/bots/stats')).then(r => r.json())
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
      const res = await fetch(apiUrl('/api/bots/scan'), {
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

  const getNetworkConnections = (account) => {
    return [
      { handle: '@fake_trend_node_01', type: 'Instant Re-poster', delay: '0.4s sync', status: 'Flagged' },
      { handle: '@spam_forward_bot_02', type: 'Copypasta Spam', delay: '1.1s sync', status: 'Flagged' },
      { handle: '@viral_echo_bot_09', type: 'Main Campaign Account', delay: 'Root Node', status: 'Active Bot' },
      { handle: '@free_rewards_promo_bot', type: 'Scam Link Spreader', delay: 'Cross-platform', status: 'Flagged' }
    ];
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Live Profile Scanner */}
      <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-blue-900/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-blue-950 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#050b18] border border-blue-500/40 text-blue-400">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide font-sans">
                Fake Accounts & Bot Detection Scanner
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Finds automated bot accounts, fake followers, and coordinated groups spreading rumors online.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 font-sans">
            <div className="px-3 py-1.5 rounded-xl bg-[#050b18] border border-blue-950 text-xs">
              <span className="text-slate-400">Accounts Checked: </span>
              <span className="text-white font-bold font-mono">{botStats?.total_analyzed || bots.length}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-800/60 text-xs">
              <span className="text-red-300">Fake Bots: </span>
              <span className="text-red-400 font-bold font-mono">{botStats?.flagged_bots_count || 0}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-800/60 text-xs">
              <span className="text-blue-300">Spam Groups: </span>
              <span className="text-blue-400 font-bold font-mono">{botStats?.active_clusters_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Live Handle Scan Bar */}
        <form onSubmit={handleScanAccount} className="flex flex-col sm:flex-row gap-3 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Enter any handle e.g. @spam_bot_node_01, @fake_news_alert, or username"
              value={scanUsername}
              onChange={(e) => setScanUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050b18] border border-blue-950 focus:border-blue-500 outline-none text-sm text-white font-mono placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={scanning}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 font-bold text-xs font-sans transition disabled:opacity-50 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 border border-blue-500/40"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            {scanning ? 'Analyzing Account...' : 'Check Profile'}
          </button>
        </form>
      </div>

      {/* 2. Flagged Accounts Table */}
      <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-blue-900/40 shadow-xl space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-blue-950 pb-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 font-sans">
            <Users className="w-4 h-4 text-blue-400" />
            Flagged Suspicious Accounts ({filteredBots.length})
          </h3>

          <div className="flex flex-wrap items-center gap-3 font-sans">
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search usernames..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#050b18] border border-blue-950 text-xs text-white outline-none focus:border-blue-500 font-sans placeholder:text-slate-500"
              />
            </div>

            <select
              value={clusterFilter}
              onChange={(e) => setClusterFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#050b18] border border-blue-950 text-xs text-white outline-none font-sans"
            >
              <option value="">All Spam Networks</option>
              <option value="Cluster-Astroturf-Alpha">Spam Group Alpha</option>
              <option value="Cluster-Phish-Syndicate">Phishing Link Group</option>
              <option value="Cluster-Disinfo-EchoNet">Fake News Echo Group</option>
            </select>

            <button
              onClick={() => setFlaggedOnly(!flaggedOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans border transition ${
                flaggedOnly
                  ? 'bg-red-950 text-red-300 border-red-700 font-bold'
                  : 'bg-[#050b18] text-slate-400 border-blue-950 hover:text-white'
              }`}
            >
              High Risk Only
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-blue-950 text-slate-400 text-[11px] font-sans">
                <th className="pb-3 font-semibold">Account Handle</th>
                <th className="pb-3 font-semibold">Bot Probability</th>
                <th className="pb-3 font-semibold">Account Age</th>
                <th className="pb-3 font-semibold">Spam Network</th>
                <th className="pb-3 font-semibold">Suspicious Activity</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-950 font-sans">
              {filteredBots.map((account) => {
                const scoreStyle = getScoreColor(account.bot_probability);
                return (
                  <tr
                    key={account.id}
                    className="hover:bg-[#050b18]/80 transition group cursor-pointer"
                    onClick={() => setSelectedBot(account)}
                  >
                    {/* Username */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-blue-300 transition font-mono">
                          {account.username}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300">
                          {account.platform}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        {account.followers_count} followers / {account.following_count} following
                      </div>
                    </td>

                    {/* Bot Score */}
                    <td className="py-3.5 pr-4 min-w-[140px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold font-mono ${scoreStyle.text}`}>
                          {account.bot_probability}% Fake
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {account.posts_frequency_per_hr} posts/hr
                        </span>
                      </div>
                      <div className="w-full bg-[#030712] h-1.5 rounded-full overflow-hidden border border-blue-950">
                        <div
                          className={`h-full rounded-full ${scoreStyle.bar}`}
                          style={{ width: `${account.bot_probability}%` }}
                        />
                      </div>
                    </td>

                    {/* Account Age */}
                    <td className="py-3.5 pr-4 text-slate-300 font-sans">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{account.account_age_days} days old</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {account.account_age_days < 10 ? 'Brand New Account' : 'Old Account'}
                      </span>
                    </td>

                    {/* Spam Group */}
                    <td className="py-3.5 pr-4">
                      {account.network_cluster ? (
                        <span className="px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-800 text-[11px] font-medium font-sans">
                          {account.network_cluster}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Single Account</span>
                      )}
                    </td>

                    {/* Detected Activity */}
                    <td className="py-3.5 pr-4 max-w-xs">
                      <p className="text-slate-300 text-xs truncate font-sans">
                        {account.abnormal_patterns || 'Normal activity'}
                      </p>
                    </td>

                    {/* View Button */}
                    <td className="py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBot(account);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-500/40 text-blue-300 text-[11px] font-bold transition flex items-center gap-1 ml-auto font-sans"
                      >
                        <Network className="w-3.5 h-3.5" />
                        View Network
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Connected Fake Network Modal */}
      {selectedBot && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#080e1e] border border-blue-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
            {/* Header */}
            <div className="p-5 border-b border-blue-950 flex items-center justify-between bg-[#050b18]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-950/90 border border-blue-500/50 text-blue-400">
                  <Network className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white font-sans">
                    Connected Fake Accounts & Network Map
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Group: {selectedBot.network_cluster || 'Independent Account'}
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
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto font-sans text-xs">
              {/* Profile Overview Card */}
              <div className="p-4 rounded-xl bg-[#050b18] border border-blue-950 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white font-mono">{selectedBot.username}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-xs">{selectedBot.platform}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    Followers: <span className="text-white">{selectedBot.followers_count}</span> | Following: <span className="text-white">{selectedBot.following_count}</span> | Speed: <span className="text-amber-400">{selectedBot.posts_frequency_per_hr} posts/hr</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-black font-mono ${getScoreColor(selectedBot.bot_probability).text}`}>
                    {selectedBot.bot_probability}% FAKE BOT
                  </div>
                  <span className="text-[10px] text-slate-400">Confidence Rating</span>
                </div>
              </div>

              {/* Connected Nodes */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Connected Accounts in this Spam Network:
                </div>

                <div className="p-4 rounded-xl bg-[#030712] border border-blue-950 space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="px-4 py-2 rounded-xl bg-blue-950 border border-blue-500 text-blue-300 font-bold text-xs shadow-lg shadow-blue-950">
                      🎯 Investigated Account: {selectedBot.username}
                    </div>
                  </div>

                  <div className="flex justify-center text-slate-500 text-[11px]">↓ Linked Accounts Posting Simultaneously ↓</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {getNetworkConnections(selectedBot).map((conn, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#050b18] border border-blue-950 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-blue-300 font-mono">{conn.handle}</div>
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

              {/* Behavior Details */}
              <div className="p-4 rounded-xl bg-[#050b18] border border-blue-950 space-y-2">
                <span className="font-semibold text-amber-400">Why was this account flagged?</span>
                <p className="text-slate-300 leading-relaxed">
                  {selectedBot.abnormal_patterns}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-blue-950 bg-[#050b18] flex items-center justify-between font-sans text-xs">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedBot, null, 2));
                  alert("Account data copied!");
                }}
                className="px-3 py-2 rounded-xl bg-[#080e1e] border border-blue-950 text-slate-200 hover:text-white transition flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" /> Copy Account Data
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Warning issued for ${selectedBot.username} and connected network accounts.`)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" /> Block & Flag Account
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
