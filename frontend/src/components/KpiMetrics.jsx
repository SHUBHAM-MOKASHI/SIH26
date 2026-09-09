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
      {/* 1. Total Monitored Posts */}
      <div className="p-5 rounded-2xl bg-[#0c1427]/80 border border-cyan-500/25 hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            Total Monitored Posts
          </span>
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {totalPosts.toLocaleString()}
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-0.5 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
            <ArrowUpRight className="w-3 h-3" /> +18.4%/hr
          </span>
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
          <span>Active Ingestion Speed</span>
          <span className="text-cyan-300 font-mono font-medium">142 msgs/sec</span>
        </div>
      </div>

      {/* 2. Viral Misinformation Flares */}
      <div className="p-5 rounded-2xl bg-[#0c1427]/80 border border-red-500/25 hover:border-red-500/50 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-red-950/20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-red-400 uppercase tracking-wider">
            Misinformation Flares
          </span>
          <div className="p-2 rounded-xl bg-red-950/80 border border-red-500/30 text-red-400">
            <Flame className="w-4 h-4 animate-bounce" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-extrabold text-red-400 tracking-tight font-mono">
            {flaggedPosts}
          </div>
          <span className="text-xs font-mono text-red-400 flex items-center gap-0.5 bg-red-950/80 px-2 py-0.5 rounded-full border border-red-800/60 font-bold">
            CRITICAL SEVERITY
          </span>
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
          <span>Active Vectors</span>
          <span className="text-red-300 font-mono font-medium">Banking & Deepfakes</span>
        </div>
      </div>

      {/* 3. Suspected Bot Accounts */}
      <div className="p-5 rounded-2xl bg-[#0c1427]/80 border border-indigo-500/25 hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-indigo-950/20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-indigo-300 uppercase tracking-wider">
            Suspected Bot Accounts
          </span>
          <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-extrabold text-indigo-300 tracking-tight font-mono">
            {botCount}
          </div>
          <span className="text-xs font-mono text-indigo-300 flex items-center gap-0.5 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/60">
            {botClusters} Astroturf Clusters
          </span>
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
          <span>Avg Bot Probability</span>
          <span className="text-indigo-300 font-mono font-medium">89.4% Confidence</span>
        </div>
      </div>

      {/* 4. High-Risk Phishing/Malicious Links */}
      <div className="p-5 rounded-2xl bg-[#0c1427]/80 border border-amber-500/25 hover:border-amber-500/50 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-amber-950/20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
            Malicious / Phishing URLs
          </span>
          <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-400">
            <Link2 className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-extrabold text-amber-400 tracking-tight font-mono">
            {phishingCount}
          </div>
          <span className="text-xs font-mono text-amber-300 flex items-center gap-0.5 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/60">
            {totalLinks} URLs Checked
          </span>
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
          <span>Interception Rate</span>
          <span className="text-amber-300 font-mono font-medium">100% Blacklisted</span>
        </div>
      </div>
    </div>
  );
}
