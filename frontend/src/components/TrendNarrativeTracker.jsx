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

  // Sentiment Breakdown Data in Grayscale/Monochrome
  const sentimentOverview = analytics?.sentiment_overview || {
    positive: 15,
    neutral: 24,
    negative: 18,
    positive_pct: 26.3,
    neutral_pct: 42.1,
    negative_pct: 31.6
  };

  const sentimentData = [
    { name: 'Happy / Supportive', value: sentimentOverview.positive || 1, color: '#ffffff', pct: sentimentOverview.positive_pct },
    { name: 'Neutral / Informative', value: sentimentOverview.neutral || 1, color: '#71717a', pct: sentimentOverview.neutral_pct },
    { name: 'Angry / Panic / Hostile', value: sentimentOverview.negative || 1, color: '#27272a', pct: sentimentOverview.negative_pct },
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
        <div className="p-3 rounded-xl bg-black border border-zinc-700 shadow-2xl backdrop-blur-md text-xs font-mono">
          <p className="font-bold text-white mb-1.5">{label} Activity</p>
          <div className="space-y-1">
            <p className="text-white font-bold">Total Posts: {payload[0]?.value}</p>
            <p className="text-zinc-400 font-bold">Fake News / Rumors: {payload[1]?.value}</p>
            <p className="text-zinc-300">Safe Posts: {payload[2]?.value}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0e0e12] border border-zinc-800 flex flex-col justify-between shadow-xl space-y-4">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-white flex items-center gap-2 font-sans">
              <TrendingUp className="w-5 h-5 text-zinc-300" />
              Trending Topics & Rumor Tracker
            </h3>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white transition"
              title="How does this work?"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Tracks viral topics and reveals how much fake news is spreading.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex rounded-xl bg-black p-1 border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setActiveView('timeline')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeView === 'timeline'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Post Volume vs Rumors
          </button>
          <button
            onClick={() => setActiveView('sentiment')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeView === 'sentiment'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Public Mood
          </button>
        </div>
      </div>

      {/* Helpful Explanation Guide */}
      {showHelp ? (
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs space-y-1.5 font-sans animate-fadeIn">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Info className="w-4 h-4 text-zinc-300" /> How to read this tracker:
          </div>
          <p className="text-zinc-300 leading-relaxed">
            This module continuously scans social media. When a topic goes viral, the <strong>Solid White line</strong> shows how many people are posting. If scammers or bot accounts start spreading rumors, the <strong>Silver dashed line</strong> spikes upward to warn you immediately.
          </p>
        </div>
      ) : (
        /* Quick Guide Strip */
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-black border border-zinc-800 text-xs font-sans text-zinc-300">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
              <span><strong>White Line:</strong> Total Posts</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-500"></span>
              <span><strong>Silver Line:</strong> Fake News / Rumors</span>
            </span>
          </div>
          <button 
            onClick={() => setShowHelp(true)}
            className="text-white hover:underline text-[11px]"
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
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="misinfoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#71717a" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#71717a" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
              <XAxis dataKey="time" stroke="#71717a" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis stroke="#71717a" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="totalPosts"
                stroke="#ffffff"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#totalVolumeGrad)"
                name="Total Posts"
              />
              <Area
                type="monotone"
                dataKey="fakeNews"
                stroke="#a1a1aa"
                strokeWidth={2}
                strokeDasharray="4 4"
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
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0e0e12" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val, name, item) => [`${val} posts (${item.payload.pct}%)`, name]}
                    contentStyle={{ backgroundColor: '#000000', borderColor: '#52525b', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace', color: '#ffffff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment Legend & Stats */}
            <div className="space-y-2.5 font-sans text-xs w-full max-w-xs">
              <div className="p-2.5 rounded-xl bg-black border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-white"></span>
                  <span className="text-zinc-200 font-medium">Positive / Safe</span>
                </div>
                <span className="text-white font-bold font-mono">{sentimentOverview.positive_pct}% ({sentimentOverview.positive})</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-zinc-400"></span>
                  <span className="text-zinc-300 font-medium">Neutral / Info</span>
                </div>
                <span className="text-zinc-400 font-bold font-mono">{sentimentOverview.neutral_pct}% ({sentimentOverview.neutral})</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-zinc-700"></span>
                  <span className="text-zinc-400 font-medium">Angry / Panic</span>
                </div>
                <span className="text-zinc-500 font-bold font-mono">{sentimentOverview.negative_pct}% ({sentimentOverview.negative})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trending Topics Clickable Tags */}
      <div className="border-t border-zinc-800 pt-3">
        <div className="text-xs font-sans text-zinc-400 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-zinc-300" />
            <strong>Hot Topics Right Now (Click any to filter posts):</strong>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {topTopics.map((item) => (
            <button
              key={item.topic}
              onClick={() => onSelectTopic && onSelectTopic(item.topic)}
              className="px-2.5 py-1 rounded-lg bg-black border border-zinc-800 hover:border-white text-xs font-mono text-zinc-200 flex items-center gap-1.5 transition hover:scale-105"
            >
              <span>{item.topic}</span>
              <span className="px-1.5 py-0.2 rounded bg-zinc-900 text-[10px] text-zinc-400 font-bold border border-zinc-800">
                {item.count} posts
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
