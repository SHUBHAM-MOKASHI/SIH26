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
      {/* 1. Total Posts Checked - Cyan/Blue Accent */}
      <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-slate-300 transition-all duration-300 relative overflow-hidden group shadow-sm shadow-blue-900/5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-semibold text-[#4A607A] uppercase tracking-wider">
            Total Posts Checked
          </span>
          <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-200 text-[#1769AA]">
            <TrendingUp className="w-4 h-4 text-[#19B5E6]" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-bold tracking-tight text-[#12355B] font-mono">
            {totalPosts.toLocaleString()}
          </div>
          <span className="text-xs font-mono text-[#1769AA] flex items-center gap-0.5 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200 font-semibold">
            <ArrowUpRight className="w-3 h-3 text-[#19B5E6]" /> +18 posts/hr
          </span>
        </div>

        <div className="mt-3 text-xs text-[#4A607A] flex items-center justify-between border-t border-slate-100 pt-2.5 font-sans">
          <span>Scanning Status</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Active Feed
          </span>
        </div>
      </div>

      {/* 2. Fake News & Scams Found - Critical / Soft Rose */}
      <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-slate-300 transition-all duration-300 relative overflow-hidden group shadow-sm shadow-blue-900/5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-semibold text-[#4A607A] uppercase tracking-wider">
            Fake News & Scams Found
          </span>
          <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-bold tracking-tight text-[#12355B] font-mono">
            {flaggedPosts}
          </div>
          <span className="text-xs font-mono text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full font-bold border border-rose-200">
            Flagged & Warned
          </span>
        </div>

        <div className="mt-3 text-xs text-[#4A607A] flex items-center justify-between border-t border-slate-100 pt-2.5 font-sans">
          <span>Main Threat Topics</span>
          <span className="text-rose-600 font-semibold">Bank Scams & Rumors</span>
        </div>
      </div>

      {/* 3. Fake Bot Accounts Detected - Warning / Soft Amber */}
      <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-slate-300 transition-all duration-300 relative overflow-hidden group shadow-sm shadow-blue-900/5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-semibold text-[#4A607A] uppercase tracking-wider">
            Fake Bot Accounts Detected
          </span>
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
            <Bot className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-bold tracking-tight text-[#12355B] font-mono">
            {botCount}
          </div>
          <span className="text-xs font-mono text-amber-800 flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-semibold">
            {botClusters} Fake Spam Groups
          </span>
        </div>

        <div className="mt-3 text-xs text-[#4A607A] flex items-center justify-between border-t border-slate-100 pt-2.5 font-sans">
          <span>Detection Accuracy</span>
          <span className="text-amber-700 font-semibold">92% Confidence</span>
        </div>
      </div>

      {/* 4. Dangerous Links Blocked - Soft Purple */}
      <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-slate-300 transition-all duration-300 relative overflow-hidden group shadow-sm shadow-blue-900/5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans font-semibold text-[#4A607A] uppercase tracking-wider">
            Dangerous Links Blocked
          </span>
          <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-600">
            <Link2 className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-3xl font-bold tracking-tight text-[#12355B] font-mono">
            {phishingCount}
          </div>
          <span className="text-xs font-mono text-purple-700 flex items-center gap-0.5 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 font-semibold">
            {totalLinks} Links Scanned
          </span>
        </div>

        <div className="mt-3 text-xs text-[#4A607A] flex items-center justify-between border-t border-slate-100 pt-2.5 font-sans">
          <span>Action Taken</span>
          <span className="text-purple-700 font-semibold font-mono">100% Blacklisted</span>
        </div>
      </div>
    </div>
  );
}
