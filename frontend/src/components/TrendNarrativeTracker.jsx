import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { TrendingUp, Activity, BarChart2, PieChart as PieIcon, ShieldAlert } from 'lucide-react';

export default function TrendNarrativeTracker({ analytics, onSelectTopic }) {
  const [activeView, setActiveView] = useState('timeline'); // 'timeline' or 'sentiment'

  // Time-series mock data based on recent ingestion
  const timelineData = [
    { time: '16:00', totalVolume: 120, misinfoSpikes: 14, organic: 106 },
    { time: '17:00', totalVolume: 240, misinfoSpikes: 38, organic: 202 },
    { time: '18:00', totalVolume: 390, misinfoSpikes: 92, organic: 298 },
    { time: '19:00', totalVolume: 510, misinfoSpikes: 164, organic: 346 },
    { time: '20:00', totalVolume: 680, misinfoSpikes: 215, organic: 465 },
    { time: '21:00', totalVolume: 840, misinfoSpikes: 290, organic: 550 },
    { time: '22:00', totalVolume: 960, misinfoSpikes: 345, organic: 615 },
  ];

  // Sentiment Breakdown Data
  const sentimentOverview = analytics?.sentiment_overview || {
    positive: 15,
    neutral: 24,
    negative: 18,
    positive_pct: 26.3,
    neutral_pct: 42.1,
    negative_pct: 31.6
  };

  const sentimentData = [
    { name: 'Positive', value: sentimentOverview.positive || 1, color: '#10b981', pct: sentimentOverview.positive_pct },
    { name: 'Neutral', value: sentimentOverview.neutral || 1, color: '#64748b', pct: sentimentOverview.neutral_pct },
    { name: 'Negative / Hostile', value: sentimentOverview.negative || 1, color: '#ef4444', pct: sentimentOverview.negative_pct },
  ];

  const topTopics = analytics?.top_topics || [
    { topic: '#BankingScam', count: 18 },
    { topic: '#DeepfakeAlert', count: 12 },
    { topic: '#BoycottECommerce', count: 8 },
    { topic: '#UPSCProtest', count: 7 },
    { topic: '#DigitalIndia2026', count: 6 },
    { topic: '#InfraUpdate', count: 6 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-[#0c1427]/95 border border-cyan-500/40 shadow-xl backdrop-blur-md text-xs font-mono">
          <p className="font-bold text-white mb-1.5">{label} IST Telemetry</p>
          <div className="space-y-1">
            <p className="text-cyan-400">Total Posts: {payload[0]?.value}</p>
            <p className="text-red-400 font-bold">Misinfo Spikes: {payload[1]?.value}</p>
            <p className="text-emerald-400">Organic: {payload[2]?.value}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0c1427]/85 border border-slate-800 flex flex-col justify-between shadow-xl space-y-4">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Trend & Narrative Tracker
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Realtime volume timeline vs. malicious amplification spikes
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveView('timeline')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeView === 'timeline'
                ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-700/60 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Volume Timeline
          </button>
          <button
            onClick={() => setActiveView('sentiment')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeView === 'sentiment'
                ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-700/60 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Sentiment Breakdown
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="h-64 w-full pt-2">
        {activeView === 'timeline' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="totalVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00f2ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="misinfoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff2a55" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#ff2a55" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="totalVolume"
                stroke="#00f2ff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#totalVolumeGrad)"
                name="Total Posts"
              />
              <Area
                type="monotone"
                dataKey="misinfoSpikes"
                stroke="#ff2a55"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#misinfoGrad)"
                name="Misinfo Spikes"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-around h-full gap-4">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val, name, item) => [`${val} posts (${item.payload.pct}%)`, name]}
                    contentStyle={{ backgroundColor: '#0c1427', borderColor: '#00f2ff', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment Legend & Stats */}
            <div className="space-y-2.5 font-mono text-xs w-full max-w-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-300">Positive</span>
                </div>
                <span className="text-emerald-400 font-bold">{sentimentOverview.positive_pct}% ({sentimentOverview.positive})</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-500"></span>
                  <span className="text-slate-300">Neutral</span>
                </div>
                <span className="text-slate-400 font-bold">{sentimentOverview.neutral_pct}% ({sentimentOverview.neutral})</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-slate-300">Negative / Hostile</span>
                </div>
                <span className="text-red-400 font-bold">{sentimentOverview.negative_pct}% ({sentimentOverview.negative})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trending Narrative Filter Tags */}
      <div className="border-t border-slate-800/80 pt-3">
        <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Narrative Clusters (Click to filter live stream):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {topTopics.map((item) => (
            <button
              key={item.topic}
              onClick={() => onSelectTopic && onSelectTopic(item.topic)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition hover:scale-105"
            >
              <span>{item.topic}</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 font-bold">
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
