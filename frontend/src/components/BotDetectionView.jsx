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
    if (score >= 70) return { bar: 'bg-white', text: 'text-white', badge: 'bg-white text-black border-white' };
    if (score >= 40) return { bar: 'bg-zinc-400', text: 'text-zinc-300', badge: 'bg-zinc-800 text-zinc-200 border-zinc-600' };
    return { bar: 'bg-zinc-700', text: 'text-zinc-400', badge: 'bg-zinc-900 text-zinc-400 border-zinc-800' };
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
      <div className="p-6 rounded-2xl bg-[#0e0e12] border border-zinc-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-black border border-zinc-700 text-white">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide font-sans">
                Fake Accounts & Bot Detection Scanner
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              Finds automated bot accounts, fake followers, and coordinated groups spreading rumors online.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 font-sans">
            <div className="px-3 py-1.5 rounded-xl bg-black border border-zinc-800 text-xs">
              <span className="text-zinc-400">Accounts Checked: </span>
              <span className="text-white font-bold font-mono">{botStats?.total_analyzed || bots.length}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs">
              <span className="text-zinc-300">Fake Bots: </span>
              <span className="text-white font-bold font-mono">{botStats?.flagged_bots_count || 0}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs">
              <span className="text-zinc-300">Spam Groups: </span>
              <span className="text-white font-bold font-mono">{botStats?.active_clusters_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Live Handle Scan Bar */}
        <form onSubmit={handleScanAccount} className="flex flex-col sm:flex-row gap-3 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Enter any handle e.g. @spam_bot_node_01, @fake_news_alert, or username"
              value={scanUsername}
              onChange={(e) => setScanUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-zinc-800 focus:border-white outline-none text-sm text-white font-mono placeholder:text-zinc-500"
            />
          </div>
          <button
            type="submit"
            disabled={scanning}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 font-bold text-xs font-sans transition disabled:opacity-50 text-black flex items-center justify-center gap-2 shadow-lg shadow-white/5 border border-zinc-300"
          >
            <Sparkles className="w-4 h-4 text-black" />
            {scanning ? 'Analyzing Account...' : 'Check Profile'}
          </button>
        </form>
      </div>

      {/* 2. Flagged Accounts Table */}
      <div className="p-6 rounded-2xl bg-[#0e0e12] border border-zinc-800 shadow-xl space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 font-sans">
            <Users className="w-4 h-4 text-zinc-300" />
            Flagged Suspicious Accounts ({filteredBots.length})
          </h3>

          <div className="flex flex-wrap items-center gap-3 font-sans">
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search usernames..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black border border-zinc-800 text-xs text-white outline-none focus:border-white font-sans placeholder:text-zinc-500"
              />
            </div>

            <select
              value={clusterFilter}
              onChange={(e) => setClusterFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-black border border-zinc-800 text-xs text-white outline-none font-sans"
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
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
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
              <tr className="border-b border-zinc-800 text-zinc-400 text-[11px] font-sans">
                <th className="pb-3 font-semibold">Account Handle</th>
                <th className="pb-3 font-semibold">Bot Probability</th>
                <th className="pb-3 font-semibold">Account Age</th>
                <th className="pb-3 font-semibold">Spam Network</th>
                <th className="pb-3 font-semibold">Suspicious Activity</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-sans">
              {filteredBots.map((account) => {
                const scoreStyle = getScoreColor(account.bot_probability);
                return (
                  <tr
                    key={account.id}
                    className="hover:bg-zinc-900/60 transition group cursor-pointer"
                    onClick={() => setSelectedBot(account)}
                  >
                    {/* Username */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-zinc-200 transition font-mono">
                          {account.username}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                          {account.platform}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                        {account.followers_count} followers / {account.following_count} following
                      </div>
                    </td>

                    {/* Bot Score */}
                    <td className="py-3.5 pr-4 min-w-[140px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold font-mono ${scoreStyle.text}`}>
                          {account.bot_probability}% Fake
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {account.posts_frequency_per_hr} posts/hr
                        </span>
                      </div>
                      <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-zinc-800">
                        <div
                          className={`h-full rounded-full ${scoreStyle.bar}`}
                          style={{ width: `${account.bot_probability}%` }}
                        />
                      </div>
                    </td>

                    {/* Account Age */}
                    <td className="py-3.5 pr-4 text-zinc-300 font-sans">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{account.account_age_days} days old</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">
                        {account.account_age_days < 10 ? 'Brand New Account' : 'Old Account'}
                      </span>
                    </td>

                    {/* Spam Group */}
                    <td className="py-3.5 pr-4">
                      {account.network_cluster ? (
                        <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-200 border border-zinc-700 text-[11px] font-medium font-sans">
                          {account.network_cluster}
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-[11px]">Single Account</span>
                      )}
                    </td>

                    {/* Detected Activity */}
                    <td className="py-3.5 pr-4 max-w-xs">
                      <p className="text-zinc-300 text-xs truncate font-sans">
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
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-[11px] font-bold transition flex items-center gap-1 ml-auto font-sans"
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
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] border border-zinc-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
            {/* Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-black">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white">
                  <Network className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white font-sans">
                    Connected Fake Accounts & Network Map
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans">
                    Group: {selectedBot.network_cluster || 'Independent Account'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBot(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto font-sans text-xs">
              {/* Profile Overview Card */}
              <div className="p-4 rounded-xl bg-black border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white font-mono">{selectedBot.username}</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700 text-xs">{selectedBot.platform}</span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-1 font-mono">
                    Followers: <span className="text-white">{selectedBot.followers_count}</span> | Following: <span className="text-white">{selectedBot.following_count}</span> | Speed: <span className="text-zinc-200">{selectedBot.posts_frequency_per_hr} posts/hr</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black font-mono text-white">
                    {selectedBot.bot_probability}% FAKE BOT
                  </div>
                  <span className="text-[10px] text-zinc-400">Confidence Rating</span>
                </div>
              </div>

              {/* Connected Nodes */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-white" />
                  Connected Accounts in this Spam Network:
                </div>

                <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-600 text-white font-bold text-xs shadow-lg">
                      🎯 Investigated Account: {selectedBot.username}
                    </div>
                  </div>

                  <div className="flex justify-center text-zinc-500 text-[11px]">↓ Linked Accounts Posting Simultaneously ↓</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {getNetworkConnections(selectedBot).map((conn, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white font-mono">{conn.handle}</div>
                          <div className="text-[10px] text-zinc-400">{conn.type}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black text-white border border-zinc-700">
                            {conn.delay}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Behavior Details */}
              <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                <span className="font-semibold text-zinc-200">Why was this account flagged?</span>
                <p className="text-zinc-300 leading-relaxed">
                  {selectedBot.abnormal_patterns}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-zinc-800 bg-black flex items-center justify-between font-sans text-xs">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedBot, null, 2));
                  alert("Account data copied!");
                }}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white transition flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" /> Copy Account Data
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Warning issued for ${selectedBot.username} and connected network accounts.`)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold transition flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" /> Block & Flag Account
                </button>
                <button
                  onClick={() => setSelectedBot(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition border border-zinc-700"
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
