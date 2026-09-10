import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Search, 
  Filter, 
  Eye, 
  Flag, 
  Download, 
  CheckCircle,
  AlertTriangle,
  Radio,
  Copy
} from 'lucide-react';

export default function LiveIncidentStream({ 
  posts = [], 
  onAnalyze, 
  onFlagToggle,
  selectedTopic,
  selectedRegion,
  onClearFilters
}) {
  const [platformFilter, setPlatformFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter((p) => {
    const matchesPlatform = platformFilter ? p.platform.toLowerCase() === platformFilter.toLowerCase() : true;
    const matchesRisk = riskFilter ? p.risk_level.toLowerCase() === riskFilter.toLowerCase() : true;
    const matchesTopic = selectedTopic ? p.topic.toLowerCase().includes(selectedTopic.toLowerCase()) : true;
    const matchesRegion = selectedRegion ? p.region.toLowerCase().includes(selectedRegion.toLowerCase()) : true;
    const matchesSearch = searchQuery
      ? (p.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
         p.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
         p.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.topic.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    return matchesPlatform && matchesRisk && matchesTopic && matchesRegion && matchesSearch;
  });

  const exportFilteredIncidents = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredPosts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `technetra_alerts_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getPlatformBadge = (platform) => {
    switch (platform.toLowerCase()) {
      case 'x':
        return 'bg-[#050b18] text-blue-300 border-blue-900/60';
      case 'telegram':
        return 'bg-sky-950/80 text-sky-400 border-sky-800/60';
      case 'instagram':
        return 'bg-pink-950/80 text-pink-400 border-pink-800/60';
      case 'youtube':
        return 'bg-red-950/80 text-red-400 border-red-800/60';
      default:
        return 'bg-[#050b18] text-slate-300 border-blue-950';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#080e1e]/90 border border-blue-900/40 shadow-xl space-y-4">
      {/* Stream Header & Active Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-blue-950 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-white flex items-center gap-2 font-sans">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              Live Safety Feed & Flagged Posts
            </h3>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800 text-xs font-mono font-bold">
              <Radio className="w-3 h-3 animate-ping" /> {filteredPosts.length} ALERTS
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-time messages flagged as fake news, bank scams, or misleading rumors.
          </p>
        </div>

        {/* Global Filter Tags & Download Button */}
        <div className="flex items-center gap-2">
          {(selectedTopic || selectedRegion) && (
            <div className="flex items-center gap-1.5 text-xs font-mono bg-blue-950/80 border border-blue-500/40 px-3 py-1.5 rounded-xl text-blue-300">
              <span>Filter: <strong>{selectedTopic || selectedRegion}</strong></span>
              <button 
                onClick={onClearFilters}
                className="ml-1 text-slate-400 hover:text-white font-bold"
              >
                ×
              </button>
            </div>
          )}

          <button
            onClick={exportFilteredIncidents}
            className="px-3.5 py-2 rounded-xl bg-[#050b18] border border-blue-950 hover:border-blue-500/60 text-slate-200 hover:text-blue-300 text-xs font-sans font-medium transition flex items-center gap-1.5"
            title="Download list of alerts"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" /> Download Feed
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search keywords, usernames, or states..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#050b18] border border-blue-950 text-xs text-white outline-none focus:border-blue-500 font-sans placeholder:text-slate-500"
          />
        </div>

        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#050b18] border border-blue-950 text-xs text-white outline-none font-sans"
        >
          <option value="">All Social Platforms</option>
          <option value="X">X (Twitter)</option>
          <option value="Telegram">Telegram</option>
          <option value="Instagram">Instagram</option>
          <option value="YouTube">YouTube</option>
        </select>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#050b18] border border-blue-950 text-xs text-white outline-none font-sans"
        >
          <option value="">All Threat Levels</option>
          <option value="High">High Risk / Scam</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk / Safe</option>
        </select>
      </div>

      {/* Incident Stream List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`p-4 rounded-xl bg-[#050b18] border transition-all duration-200 hover:shadow-lg ${
                post.is_flagged
                  ? 'border-red-500/40 hover:border-red-500 bg-red-950/10'
                  : 'border-blue-950/80 hover:border-blue-500/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                {/* User & Location */}
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-bold text-xs text-blue-300 font-mono">
                    {post.username}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getPlatformBadge(post.platform)}`}>
                    {post.platform}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-slate-300 border border-blue-900/40 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-400" /> {post.region}
                  </span>
                  <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                    {post.topic}
                  </span>
                </div>

                {/* Threat Badge */}
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    post.risk_level === 'High' ? 'bg-red-950 text-red-400 border-red-800' :
                    post.risk_level === 'Medium' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                    'bg-emerald-950 text-emerald-400 border-emerald-800'
                  }`}>
                    Threat: {post.risk_level}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <p className="text-sm text-slate-200 leading-relaxed font-sans pt-1">
                {post.text}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 pt-2.5 border-t border-blue-950/80 text-xs font-sans">
                <div className="flex items-center gap-4 text-slate-400 font-mono text-xs">
                  <span>❤️ {post.likes}</span>
                  <span>🔁 {post.retweets}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => onAnalyze(post)}
                    className="px-3 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-500/50 text-blue-300 transition flex items-center gap-1 text-[11px] font-bold"
                  >
                    <Eye className="w-3 h-3 text-blue-400" />
                    Check Details
                  </button>

                  <button
                    onClick={() => onFlagToggle(post.id)}
                    className={`px-3 py-1 rounded-lg border transition flex items-center gap-1 text-[11px] font-bold ${
                      post.is_flagged
                        ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 hover:bg-amber-900'
                        : 'bg-red-950/80 border-red-500/60 text-red-300 hover:bg-red-900'
                    }`}
                  >
                    <Flag className="w-3 h-3" />
                    {post.is_flagged ? 'Flagged as Scam' : 'Flag Post'}
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`[TECH NETRA ALERT] ${post.username} on ${post.platform}: "${post.text}" (Risk: ${post.risk_level})`);
                      alert("Alert copied to clipboard!");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#050b18] hover:bg-slate-900 border border-blue-950 text-slate-300 transition text-[11px]"
                    title="Copy Alert Message"
                  >
                    <Copy className="w-3 h-3 inline mr-1" />
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500 font-sans text-xs border border-dashed border-blue-950 rounded-xl">
            No posts found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
