import React, { useState } from 'react';
import { MapPin, Globe2, AlertTriangle, ShieldCheck, Flame, ExternalLink } from 'lucide-react';

export default function GeospatialThreatMap({ heatmaps = [], onSelectRegion }) {
  const [selectedState, setSelectedState] = useState(null);

  const defaultHeatmaps = [
    { region: "Maharashtra", latitude: 19.076, longitude: 72.8777, post_count: 14, high_risk_count: 6, dominant_topic: "#BankingScam" },
    { region: "Delhi", latitude: 28.6139, longitude: 77.209, post_count: 12, high_risk_count: 5, dominant_topic: "#UPSCProtest" },
    { region: "Karnataka", latitude: 12.9716, longitude: 77.5946, post_count: 9, high_risk_count: 2, dominant_topic: "#DeepfakeAlert" },
    { region: "Uttar Pradesh", latitude: 26.8467, longitude: 80.9462, post_count: 7, high_risk_count: 3, dominant_topic: "#PaperLeakHoax" },
    { region: "Telangana", latitude: 17.385, longitude: 78.4867, post_count: 5, high_risk_count: 2, dominant_topic: "#CyberThreatAlert" },
    { region: "West Bengal", latitude: 22.5726, longitude: 88.3639, post_count: 4, high_risk_count: 1, dominant_topic: "#Elections2026" },
  ];

  const data = heatmaps.length > 0 ? heatmaps : defaultHeatmaps;

  const handleStateClick = (item) => {
    setSelectedState(item);
    if (onSelectRegion) {
      onSelectRegion(item.region);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0c1427]/85 border border-slate-800 flex flex-col justify-between shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-amber-400" />
            Geospatial Threat Heatmap (India)
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            State-level coordination density & live geo-incident radar
          </p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/60 font-bold">
          15 REGIONS ACTIVE
        </span>
      </div>

      {/* Visual Radar Map Simulation */}
      <div className="relative h-44 rounded-xl bg-[#070b14] border border-cyan-500/20 overflow-hidden flex items-center justify-center p-4">
        {/* Background Grid & Radar Sweep */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        <div className="absolute w-40 h-40 rounded-full border border-cyan-500/20"></div>
        <div className="absolute w-24 h-24 rounded-full border border-cyan-500/30"></div>
        <div className="absolute w-64 h-64 border-r border-t border-cyan-500/40 rounded-full animate-radar origin-center pointer-events-none opacity-50"></div>

        {/* Pulsing Regional Radar Pins */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Delhi */}
          <div 
            onClick={() => handleStateClick(data.find(d => d.region === 'Delhi') || data[0])}
            className="absolute top-4 left-[44%] cursor-pointer group flex items-center gap-1"
          >
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border border-white"></span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 opacity-80 group-hover:opacity-100">Delhi</span>
          </div>

          {/* Mumbai / Maharashtra */}
          <div 
            onClick={() => handleStateClick(data.find(d => d.region === 'Maharashtra') || data[0])}
            className="absolute top-20 left-[28%] cursor-pointer group flex items-center gap-1"
          >
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 border border-white"></span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 opacity-80 group-hover:opacity-100">Mumbai</span>
          </div>

          {/* Bengaluru / Karnataka */}
          <div 
            onClick={() => handleStateClick(data.find(d => d.region === 'Karnataka') || data[0])}
            className="absolute bottom-4 left-[38%] cursor-pointer group flex items-center gap-1"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-white"></span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 opacity-80 group-hover:opacity-100">Bengaluru</span>
          </div>

          {/* Hyderabad / Telangana */}
          <div 
            onClick={() => handleStateClick(data.find(d => d.region === 'Telangana') || data[0])}
            className="absolute top-24 left-[46%] cursor-pointer group flex items-center gap-1"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-white"></span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 opacity-80 group-hover:opacity-100">Hyderabad</span>
          </div>

          {/* Kolkata / West Bengal */}
          <div 
            onClick={() => handleStateClick(data.find(d => d.region === 'West Bengal') || data[0])}
            className="absolute top-16 right-[24%] cursor-pointer group flex items-center gap-1"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border border-white"></span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 opacity-80 group-hover:opacity-100">Kolkata</span>
          </div>
        </div>
      </div>

      {/* Regional Risk Breakdown List */}
      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
        {data.slice(0, 6).map((item) => {
          const isHighRisk = item.high_risk_count > 0;
          return (
            <div
              key={item.region}
              onClick={() => handleStateClick(item)}
              className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                selectedState?.region === item.region
                  ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className={`w-4 h-4 ${isHighRisk ? 'text-red-400' : 'text-cyan-400'}`} />
                <div>
                  <div className="text-xs font-bold text-white font-mono">{item.region}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Narrative: <span className="text-cyan-300">{item.dominant_topic}</span>
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <span className={`px-2 py-0.5 rounded font-bold ${
                  item.high_risk_count >= 3 ? 'bg-red-950 text-red-400 border border-red-800' :
                  item.high_risk_count >= 1 ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {item.high_risk_count} Threats
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{item.post_count} posts</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
