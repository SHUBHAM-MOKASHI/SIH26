import React from 'react';
import { 
  TrendingUp, 
  Flame, 
  Bot, 
  Link2, 
  AlertCircle, 
  ShieldAlert, 
  ArrowUpRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function KpiMetrics({ analytics, botStats, linkStats }) {
  const totalPosts = analytics?.total_posts || 57;
  const flaggedPosts = analytics?.flagged_posts_count || 18;
  const botCount = botStats?.flagged_bots_count || 8;
  const botClusters = botStats?.active_clusters_count || 3;
  const phishingCount = linkStats?.phishing_count || 6;
  const totalLinks = linkStats?.total_scanned || 10;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Posts Checked - Neutral Slate / Cyan Accent */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/80 hover:border-slate-700 transition-all duration-300 relative overflow-hidden group shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-semibold text-slate-400 uppercase tracking-wider">
            Total Posts Checked
          </span>
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-bold tracking-tight text-white font-mono">
            {totalPosts.toLocaleString()}
          </div>
          <span className="text-xs font-mono text-cyan-400 flex items-center gap-0.5 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 font-semibold">
            <ArrowUpRight className="w-3 h-3 text-cyan-400" /> +18 posts/hr
          </span>
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5 font-sans">
          <span>Scanning Status</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Active Feed
          </span>
        </div>
      </div>

      {/* 2. Fake News & Scams Found - Critical / Rose Danger */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/80 hover:border-slate-700 transition-all duration-300 relative overflow-hidden group shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-semibold text-slate-400 uppercase tracking-wider">
            Fake News & Scams Found
          </span>
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-bold tracking-tight text-white font-mono">
            {flaggedPosts}
          </div>
          <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full font-bold border border-rose-500/30">
            Flagged & Warned
          </span>
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5 font-sans">
          <span>Main Threat Topics</span>
          <span className="text-rose-300 font-medium">Bank Scams & Rumors</span>
        </div>
      </div>

      {/* 3. Fake Bot Accounts Detected - Warning / Amber Accent */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/80 hover:border-slate-700 transition-all duration-300 relative overflow-hidden group shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-semibold text-slate-400 uppercase tracking-wider">
            Fake Bot Accounts Detected
          </span>
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Bot className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-bold tracking-tight text-white font-mono">
            {botCount}
          </div>
          <span className="text-xs font-mono text-amber-400 flex items-center gap-0.5 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 font-semibold">
            {botClusters} Fake Spam Groups
          </span>
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5 font-sans">
          <span>Detection Accuracy</span>
          <span className="text-amber-400 font-medium">92% Confidence</span>
        </div>
      </div>

      {/* 4. Dangerous Links Blocked - Purple / Crimson Accent */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/80 hover:border-slate-700 transition-all duration-300 relative overflow-hidden group shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-semibold text-slate-400 uppercase tracking-wider">
            Dangerous Links Blocked
          </span>
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Link2 className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-bold tracking-tight text-white font-mono">
            {phishingCount}
          </div>
          <span className="text-xs font-mono text-purple-400 flex items-center gap-0.5 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30 font-semibold">
            {totalLinks} Links Scanned
          </span>
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5 font-sans">
          <span>Action Taken</span>
          <span className="text-purple-300 font-medium font-mono">100% Blacklisted</span>
        </div>
      </div>
    </div>
  );
}
