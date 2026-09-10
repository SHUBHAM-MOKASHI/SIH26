import React, { useState } from 'react';
import { MapPin, Globe2, AlertTriangle, ShieldCheck, Flame, RotateCcw } from 'lucide-react';
import IndiaSvgMap from './IndiaSvgMap';

export default function GeospatialThreatMap({ heatmaps = [], selectedRegion = '', onSelectRegion }) {
  const [activeState, setActiveState] = useState(null);

  const defaultHeatmaps = [
    { region: "Maharashtra", latitude: 19.076, longitude: 72.8777, post_count: 14, high_risk_count: 6, dominant_topic: "#BankingScam" },
    { region: "Delhi", latitude: 28.6139, longitude: 77.209, post_count: 12, high_risk_count: 5, dominant_topic: "#ExamRumor" },
    { region: "Karnataka", latitude: 12.9716, longitude: 77.5946, post_count: 9, high_risk_count: 3, dominant_topic: "#DeepfakeAlert" },
    { region: "Uttar Pradesh", latitude: 26.8467, longitude: 80.9462, post_count: 8, high_risk_count: 4, dominant_topic: "#PaperLeakRumor" },
    { region: "Telangana", latitude: 17.385, longitude: 78.4867, post_count: 6, high_risk_count: 2, dominant_topic: "#UPIFraud" },
    { region: "West Bengal", latitude: 22.5726, longitude: 88.3639, post_count: 5, high_risk_count: 2, dominant_topic: "#FakeNotice" },
    { region: "Gujarat", latitude: 23.2156, longitude: 72.6369, post_count: 4, high_risk_count: 1, dominant_topic: "#KYCPhish" },
    { region: "Tamil Nadu", latitude: 13.0827, longitude: 80.2707, post_count: 4, high_risk_count: 1, dominant_topic: "#WeatherAlert" },
    { region: "Bihar", latitude: 25.5941, longitude: 85.1376, post_count: 3, high_risk_count: 1, dominant_topic: "#FactCheck" },
    { region: "Rajasthan", latitude: 26.9124, longitude: 75.7873, post_count: 3, high_risk_count: 0, dominant_topic: "#ExamSafety" }
  ];

  const data = heatmaps.length > 0 ? heatmaps : defaultHeatmaps;

  const handleStateSelect = (regionName) => {
    const item = data.find(d => d.region.toLowerCase().includes(regionName.toLowerCase()));
    setActiveState(item || { region: regionName, post_count: 0, high_risk_count: 0, dominant_topic: 'Safe' });
    if (onSelectRegion) {
      onSelectRegion(regionName);
    }
  };

  const handleClearSelection = () => {
    setActiveState(null);
    if (onSelectRegion) {
      onSelectRegion('');
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0e0e12] border border-zinc-800 flex flex-col justify-between shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2 font-sans">
            <Globe2 className="w-5 h-5 text-zinc-300" />
            Live India Safety Map
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            See which states have active rumors, scams, or fake news right now.
          </p>
        </div>

        {/* Selected Region Status Pill */}
        <div className="flex items-center gap-2">
          {selectedRegion ? (
            <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-white text-black font-bold shadow-sm">
              <span>Showing: <strong>{selectedRegion}</strong></span>
              <button 
                onClick={handleClearSelection}
                className="ml-1 text-zinc-600 hover:text-black font-bold"
                title="Reset map view"
              >
                ×
              </button>
            </div>
          ) : (
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700 font-bold">
              All States Active
            </span>
          )}
        </div>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-sans px-3 py-2 rounded-xl bg-black border border-zinc-800">
        <span className="text-zinc-400 font-medium">State Threat Colors:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-white border border-zinc-400"></span>
          <span className="text-zinc-100 font-mono">High Danger</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-zinc-400"></span>
          <span className="text-zinc-300 font-mono">Medium Risk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-zinc-600"></span>
          <span className="text-zinc-400 font-mono">Monitored</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-600"></span>
          <span className="text-zinc-500 font-mono">Low / Safe</span>
        </div>
      </div>

      {/* Accurate Interactive India Map Container */}
      <div className="relative rounded-xl bg-black border border-zinc-800 overflow-hidden p-2 flex items-center justify-center min-h-[360px]">
        <IndiaSvgMap 
          heatmaps={data} 
          selectedRegion={selectedRegion || activeState?.region || ''} 
          onSelectRegion={handleStateSelect} 
        />
      </div>

      {/* State List with Easy English Indicators */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>Click any state below to view its posts:</span>
          {selectedRegion && (
            <button 
              onClick={handleClearSelection}
              className="text-white hover:underline flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" /> Show All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 font-mono text-xs">
          {data.slice(0, 8).map((item) => {
            const isHighRisk = item.high_risk_count >= 3;
            const isMediumRisk = item.high_risk_count >= 1 && item.high_risk_count < 3;
            const isSelected = selectedRegion && item.region.toLowerCase().includes(selectedRegion.toLowerCase());

            return (
              <div
                key={item.region}
                onClick={() => handleStateSelect(item.region)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-zinc-800 border-white text-white shadow-lg'
                    : 'bg-black border-zinc-800 hover:border-zinc-600 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className={`w-3.5 h-3.5 ${isHighRisk ? 'text-white' : isMediumRisk ? 'text-zinc-300' : 'text-zinc-500'}`} />
                  <div>
                    <div className="font-bold text-white text-xs">{item.region}</div>
                    <div className="text-[10px] text-zinc-400 truncate max-w-[120px]">
                      Topic: <span className="text-zinc-200">{item.dominant_topic}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    isHighRisk ? 'bg-white text-black border border-white' :
                    isMediumRisk ? 'bg-zinc-800 text-zinc-200 border border-zinc-700' :
                    'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}>
                    {item.high_risk_count > 0 ? `${item.high_risk_count} Threats` : 'Safe'}
                  </span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">{item.post_count} posts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
