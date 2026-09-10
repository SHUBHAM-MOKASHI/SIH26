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
      <div className="p-5 rounded-2xl bg-[#0e0e12] border border-zinc-800 hover:border-zinc-500 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-black/60">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-bold text-zinc-300 uppercase tracking-wider">
            Total Posts Checked
          </span>
          <div className="p-2 rounded-xl bg-black border border-zinc-700 text-white">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {totalPosts.toLocaleString()}
          </div>
          <span className="text-xs font-mono text-zinc-200 flex items-center gap-0.5 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-700 font-semibold">
            <ArrowUpRight className="w-3 h-3 text-white" /> +18 posts/hr
          </span>
        </div>

        <div className="mt-3 text-xs text-zinc-400 flex items-center justify-between border-t border-zinc-800/80 pt-2.5 font-sans">
          <span>Scanning Status</span>
          <span className="text-white font-semibold">Live Active Feed</span>
        </div>
      </div>

      {/* 2. Fake News & Scams Found */}
      <div className="p-5 rounded-2xl bg-[#0e0e12] border border-zinc-800 hover:border-zinc-500 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-black/60">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-bold text-zinc-300 uppercase tracking-wider">
            Fake News & Scams Found
          </span>
          <div className="p-2 rounded-xl bg-black border border-zinc-700 text-white">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {flaggedPosts}
          </div>
          <span className="text-xs font-mono text-black bg-white px-2.5 py-0.5 rounded-full font-bold border border-zinc-200">
            Flagged & Warned
          </span>
        </div>

        <div className="mt-3 text-xs text-zinc-400 flex items-center justify-between border-t border-zinc-800/80 pt-2.5 font-sans">
          <span>Main Threat Topics</span>
          <span className="text-zinc-200 font-medium">Bank Scams & Rumors</span>
        </div>
      </div>

      {/* 3. Fake Bot Accounts Detected */}
      <div className="p-5 rounded-2xl bg-[#0e0e12] border border-zinc-800 hover:border-zinc-500 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-black/60">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-bold text-zinc-300 uppercase tracking-wider">
            Fake Bot Accounts Detected
          </span>
          <div className="p-2 rounded-xl bg-black border border-zinc-700 text-white">
            <Bot className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {botCount}
          </div>
          <span className="text-xs font-mono text-zinc-200 flex items-center gap-0.5 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-700 font-semibold">
            {botClusters} Fake Spam Groups
          </span>
        </div>

        <div className="mt-3 text-xs text-zinc-400 flex items-center justify-between border-t border-zinc-800/80 pt-2.5 font-sans">
          <span>Detection Accuracy</span>
          <span className="text-zinc-200 font-medium">92% Confidence</span>
        </div>
      </div>

      {/* 4. Dangerous Links Blocked */}
      <div className="p-5 rounded-2xl bg-[#0e0e12] border border-zinc-800 hover:border-zinc-500 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-black/60">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-bold text-zinc-300 uppercase tracking-wider">
            Dangerous Links Blocked
          </span>
          <div className="p-2 rounded-xl bg-black border border-zinc-700 text-white">
            <Link2 className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {phishingCount}
          </div>
          <span className="text-xs font-mono text-zinc-200 flex items-center gap-0.5 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-700 font-semibold">
            {totalLinks} Links Scanned
          </span>
        </div>

        <div className="mt-3 text-xs text-zinc-400 flex items-center justify-between border-t border-zinc-800/80 pt-2.5 font-sans">
          <span>Action Taken</span>
          <span className="text-zinc-200 font-medium">100% Blacklisted</span>
        </div>
      </div>
    </div>
  );
}
