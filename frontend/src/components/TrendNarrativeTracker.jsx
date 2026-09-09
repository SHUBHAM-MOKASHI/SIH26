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
import { TrendingUp, Activity, BarChart2, PieChart as PieIcon, HelpCircle, Info } from 'lucide-react';

export default function TrendNarrativeTracker({ analytics, onSelectTopic }) {
  const [activeView, setActiveView] = useState('timeline'); // 'timeline' or 'sentiment'
  const [showHelp, setShowHelp] = useState(false);

  // Time-series mock data based on recent ingestion
  const timelineData = [
    { time: '4:00 PM', totalPosts: 120, fakeNews: 14, safePosts: 106 },
    { time: '5:00 PM', totalPosts: 240, fakeNews: 38, safePosts: 202 },
    { time: '6:00 PM', totalPosts: 390, fakeNews: 92, safePosts: 298 },
    { time: '7:00 PM', totalPosts: 510, fakeNews: 164, safePosts: 346 },
    { time: '8:00 PM', totalPosts: 680, fakeNews: 215, safePosts: 465 },
    { time: '9:00 PM', totalPosts: 840, fakeNews: 290, safePosts: 550 },
    { time: '10:00 PM', totalPosts: 960, fakeNews: 345, safePosts: 615 },
  ];

  // Sentiment Breakdown Data in Plain English
  const sentimentOverview = analytics?.sentiment_overview || {
    positive: 15,
    neutral: 24,
    negative: 18,
    positive_pct: 26.3,
    neutral_pct: 42.1,
    negative_pct: 31.6
  };

  const sentimentData = [
    { name: 'Happy / Supportive', value: sentimentOverview.positive || 1, color: '#10b981', pct: sentimentOverview.positive_pct },
    { name: 'Neutral / Informative', value: sentimentOverview.neutral || 1, color: '#64748b', pct: sentimentOverview.neutral_pct },
    { name: 'Angry / Panic / Hostile', value: sentimentOverview.negative || 1, color: '#ef4444', pct: sentimentOverview.negative_pct },
  ];

  const topTopics = analytics?.top_topics || [
    { topic: '#BankingScam', count: 18, isRisky: true },
    { topic: '#DeepfakeAlert', count: 12, isRisky: true },
    { topic: '#UPSCProtest', count: 7, isRisky: false },
    { topic: '#BoycottOnlineRetailers', count: 8, isRisky: true },
    { topic: '#DigitalIndia2026', count: 6, isRisky: false },
    { topic: '#CitySafetyUpdate', count: 6, isRisky: false }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-[#0c1427]/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md text-xs font-mono">
          <p className="font-bold text-white mb-1.5">{label} Activity</p>
          <div className="space-y-1">
            <p className="text-cyan-400 font-bold">Total Posts: {payload[0]?.value}</p>
            <p className="text-red-400 font-bold">Fake News / Rumors: {payload[1]?.value}</p>
            <p className="text-emerald-400">Safe Posts: {payload[2]?.value}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0c1427]/85 border border-slate-800 flex flex-col justify-between shadow-xl space-y-4">
      {/* Tracker Header with Plain English */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Trending Topics & Rumor Tracker
            </h3>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 transition"
              title="How does this work?"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Tracks viral topics and reveals how much fake news is spreading.
          </p>
        </div>

        {/* View Switcher Tabs in Simple English */}
        <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveView('timeline')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeView === 'timeline'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/60 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Post Volume vs Rumors
          </button>
          <button
            onClick={() => setActiveView('sentiment')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeView === 'sentiment'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/60 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Public Mood
          </button>
        </div>
      </div>

      {/* Helpful Explanation Guide (Toggleable or Visible) */}
      {showHelp ? (
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs space-y-1.5 font-sans animate-fadeIn">
          <div className="font-bold text-cyan-300 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-cyan-400" /> How to read this tracker:
          </div>
          <p className="text-slate-300 leading-relaxed">
            This module continuously scans social media. When a topic goes viral, the <strong>Cyan line</strong> shows how many people are posting. If scammers or bot accounts start spreading rumors, the <strong>Red line</strong> spikes upward to warn you immediately.
          </p>
        </div>
      ) : (
        /* Quick Guide Strip */
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-sans text-slate-300">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span><strong>Cyan Line:</strong> Total Posts</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span><strong>Red Line:</strong> Fake News / Rumors</span>
            </span>
          </div>
          <button 
            onClick={() => setShowHelp(true)}
            className="text-cyan-400 hover:text-cyan-300 text-[11px] underline"
          >
            Learn more
          </button>
        </div>
      )}

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
                dataKey="totalPosts"
                stroke="#00f2ff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#totalVolumeGrad)"
                name="Total Posts"
              />
              <Area
                type="monotone"
                dataKey="fakeNews"
                stroke="#ff2a55"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#misinfoGrad)"
                name="Fake News / Rumors"
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

            {/* Sentiment Legend & Stats in Clear English */}
            <div className="space-y-2.5 font-sans text-xs w-full max-w-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-300 font-medium">Happy / Positive</span>
                </div>
                <span className="text-emerald-400 font-bold font-mono">{sentimentOverview.positive_pct}% ({sentimentOverview.positive})</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-500"></span>
                  <span className="text-slate-300 font-medium">Neutral / Informative</span>
                </div>
                <span className="text-slate-400 font-bold font-mono">{sentimentOverview.neutral_pct}% ({sentimentOverview.neutral})</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-slate-300 font-medium">Angry / Panic</span>
                </div>
                <span className="text-red-400 font-bold font-mono">{sentimentOverview.negative_pct}% ({sentimentOverview.negative})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trending Topics Clickable Tags */}
      <div className="border-t border-slate-800/80 pt-3">
        <div className="text-xs font-sans text-slate-400 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <strong>Hot Topics Right Now (Click any to filter posts):</strong>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {topTopics.map((item) => (
            <button
              key={item.topic}
              onClick={() => onSelectTopic && onSelectTopic(item.topic)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition hover:scale-105"
            >
              <span>{item.topic}</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 font-bold">
                {item.count} posts
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
