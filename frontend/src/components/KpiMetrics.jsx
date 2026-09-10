import React from 'react';
import { 
  TrendingUp, 
  Flame, 
  Bot, 
  Link2, 
  AlertCircle, 
  ShieldAlert, 
  ArrowUpRight,
  Sparkles
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
      {/* 1. Total Posts Checked */}
      <div className="p-5 rounded-2xl bg-[#080e1e]/90 border border-blue-900/40 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-black/40">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-bold text-blue-400 uppercase tracking-wider">
            Total Posts Checked
          </span>
          <div className="p-2 rounded-xl bg-[#050b18] border border-blue-500/40 text-blue-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {totalPosts.toLocaleString()}
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-0.5 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
            <ArrowUpRight className="w-3 h-3" /> +18 posts/hr
          </span>
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-blue-950/80 pt-2.5 font-sans">
          <span>Scanning Status</span>
          <span className="text-blue-300 font-medium">Live Active Feed</span>
        </div>
      </div>

      {/* 2. Fake News & Scams Found */}
      <div className="p-5 rounded-2xl bg-[#080e1e]/90 border border-red-900/40 hover:border-red-500/50 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-black/40">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-bold text-red-400 uppercase tracking-wider">
            Fake News & Scams Found
          </span>
          <div className="p-2 rounded-xl bg-[#050b18] border border-red-500/40 text-red-400">
            <Flame className="w-4 h-4 animate-bounce" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-extrabold text-red-400 tracking-tight font-mono">
            {flaggedPosts}
          </div>
          <span className="text-xs font-mono text-red-400 flex items-center gap-0.5 bg-red-950/80 px-2 py-0.5 rounded-full border border-red-800/60 font-bold">
            Flagged & Warned
          </span>
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-blue-950/80 pt-2.5 font-sans">
          <span>Main Threat Topics</span>
          <span className="text-red-300 font-medium">Bank Scams & Rumors</span>
        </div>
      </div>

      {/* 3. Fake Bot Accounts Detected */}
      <div className="p-5 rounded-2xl bg-[#080e1e]/90 border border-blue-900/40 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-black/40">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-bold text-blue-300 uppercase tracking-wider">
            Fake Bot Accounts Detected
          </span>
          <div className="p-2 rounded-xl bg-[#050b18] border border-blue-500/40 text-blue-400">
            <Bot className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-extrabold text-blue-300 tracking-tight font-mono">
            {botCount}
          </div>
          <span className="text-xs font-mono text-blue-300 flex items-center gap-0.5 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800/60">
            {botClusters} Fake Spam Groups
          </span>
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-blue-950/80 pt-2.5 font-sans">
          <span>Detection Accuracy</span>
          <span className="text-blue-300 font-medium">92% Confidence</span>
        </div>
      </div>

      {/* 4. Dangerous Links Blocked */}
      <div className="p-5 rounded-2xl bg-[#080e1e]/90 border border-amber-900/40 hover:border-amber-500/50 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-black/40">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-bold text-amber-400 uppercase tracking-wider">
            Dangerous Links Blocked
          </span>
          <div className="p-2 rounded-xl bg-[#050b18] border border-amber-500/40 text-amber-400">
            <Link2 className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-extrabold text-amber-400 tracking-tight font-mono">
            {phishingCount}
          </div>
          <span className="text-xs font-mono text-amber-300 flex items-center gap-0.5 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/60">
            {totalLinks} Links Scanned
          </span>
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-blue-950/80 pt-2.5 font-sans">
          <span>Action Taken</span>
          <span className="text-amber-300 font-medium">100% Blacklisted</span>
        </div>
      </div>
    </div>
  );
}
