import React, { useState } from 'react';
import { MapPin, Globe2, AlertTriangle, ShieldCheck, Flame, RotateCcw, Activity } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Pan & Zoom Controller Component for dynamic state selection
function MapController({ selectedCoords }) {
  const map = useMap();
  React.useEffect(() => {
    if (selectedCoords) {
      map.flyTo(selectedCoords, 6, { duration: 1.2 });
    }
  }, [selectedCoords, map]);
  return null;
}

export default function GeospatialThreatMap({ heatmaps = [], selectedRegion = '', onSelectRegion }) {
  // Master List of Geospatial Threat Hotspots in India
  const hotspotNodes = [
    { 
      name: "Mumbai", 
      state: "Maharashtra", 
      lat: 19.0760, 
      lng: 72.8777, 
      level: "High Danger", 
      threats: 42, 
      posts: 58, 
      topic: "Financial Phishing Surge",
      summary: "Multiple fraudulent bank KYC SMS broadcasts and APK mirrors detected."
    },
    { 
      name: "Delhi NCR", 
      state: "Delhi", 
      lat: 28.6139, 
      lng: 77.2090, 
      level: "High Danger", 
      threats: 36, 
      posts: 52, 
      topic: "Misinformation Deepfake",
      summary: "AI voice clones and fake political rally videos circulating across social groups."
    },
    { 
      name: "Bengaluru", 
      state: "Karnataka", 
      lat: 12.9716, 
      lng: 77.5946, 
      level: "Medium Risk", 
      threats: 19, 
      posts: 34, 
      topic: "Job Scam Wave",
      summary: "Deceptive recruitment portals requesting registration fees via fake UPI gateways."
    },
    { 
      name: "Lucknow", 
      state: "Uttar Pradesh", 
      lat: 26.8467, 
      lng: 80.9462, 
      level: "Medium Risk", 
      threats: 15, 
      posts: 29, 
      topic: "Fake Public Notice",
      summary: "Forged government exam cancellation notices spreading on messaging apps."
    },
    { 
      name: "Hyderabad", 
      state: "Telangana", 
      lat: 17.3850, 
      lng: 78.4867, 
      level: "Medium Risk", 
      threats: 14, 
      posts: 24, 
      topic: "UPI Payment Fraud",
      summary: "QR code scam campaigns targeting small merchant accounts."
    },
    { 
      name: "Kolkata", 
      state: "West Bengal", 
      lat: 22.5726, 
      lng: 88.3639, 
      level: "Monitored", 
      threats: 11, 
      posts: 20, 
      topic: "Phishing Links",
      summary: "Deceptive prize lottery links hosted on short-lived domains."
    },
    { 
      name: "Ahmedabad", 
      state: "Gujarat", 
      lat: 23.0225, 
      lng: 72.5714, 
      level: "Monitored", 
      threats: 8, 
      posts: 16, 
      topic: "Banking KYC Scam",
      summary: "Automated robocalls asking users to download remote access software."
    },
    { 
      name: "Chennai", 
      state: "Tamil Nadu", 
      lat: 13.0827, 
      lng: 80.2707, 
      level: "Monitored", 
      threats: 7, 
      posts: 15, 
      topic: "Fake Alert Weather",
      summary: "Exaggerated cyclone panic posts with old unverified storm footage."
    },
    { 
      name: "Patna", 
      state: "Bihar", 
      lat: 25.5941, 
      lng: 85.1376, 
      level: "Monitored", 
      threats: 6, 
      posts: 14, 
      topic: "Recruitment Hoax",
      summary: "Fake railway admit cards shared in student community groups."
    },
    { 
      name: "Jaipur", 
      state: "Rajasthan", 
      lat: 26.9124, 
      lng: 75.7873, 
      level: "Low / Safe", 
      threats: 3, 
      posts: 12, 
      topic: "Exam Safety Notice",
      summary: "Minor rumors promptly debunked by official fact-checker channels."
    },
    { 
      name: "Bhopal", 
      state: "Madhya Pradesh", 
      lat: 23.2599, 
      lng: 77.4126, 
      level: "Low / Safe", 
      threats: 2, 
      posts: 10, 
      topic: "Student Forum Spam",
      summary: "Uncoordinated promotional spam links, low misinformation risk."
    },
    { 
      name: "Guwahati", 
      state: "Assam", 
      lat: 26.1445, 
      lng: 91.7362, 
      level: "Low / Safe", 
      threats: 2, 
      posts: 8, 
      topic: "Relief Fund Notice",
      summary: "Verified flood helpline notifications active."
    },
    { 
      name: "Chandigarh", 
      state: "Punjab", 
      lat: 30.7333, 
      lng: 76.7794, 
      level: "Low / Safe", 
      threats: 1, 
      posts: 7, 
      topic: "Agri Subsidy Rumors",
      summary: "Routine chatter regarding harvest price announcements."
    },
    { 
      name: "Srinagar", 
      state: "Jammu and Kashmir", 
      lat: 34.0837, 
      lng: 74.7973, 
      level: "Monitored", 
      threats: 5, 
      posts: 11, 
      topic: "Weather Advisory",
      summary: "Routine traffic updates and highway status tracking."
    }
  ];

  // Helper to map threat level to color tokens
  const getThreatColor = (level) => {
    switch (level) {
      case 'High Danger':
        return '#F43F5E'; // Rose/Red
      case 'Medium Risk':
        return '#F59E0B'; // Amber
      case 'Monitored':
        return '#06B6D4'; // Cyan
      case 'Low / Safe':
      default:
        return '#10B981'; // Emerald
    }
  };

  const getThreatBadgeClass = (level) => {
    switch (level) {
      case 'High Danger':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'Medium Risk':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'Monitored':
        return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
      case 'Low / Safe':
      default:
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
  };

  // Find coords for selected region if any
  const selectedNode = hotspotNodes.find(
    n => selectedRegion && (n.state.toLowerCase().includes(selectedRegion.toLowerCase()) || n.name.toLowerCase().includes(selectedRegion.toLowerCase()))
  );

  const selectedCoords = selectedNode ? [selectedNode.lat, selectedNode.lng] : null;

  const handleSelectNode = (node) => {
    if (onSelectRegion) {
      onSelectRegion(node.state);
    }
  };

  const handleClearSelection = () => {
    if (onSelectRegion) {
      onSelectRegion('');
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/80 flex flex-col justify-between shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2 font-sans">
            <Globe2 className="w-5 h-5 text-indigo-400" />
            Live India Safety Map
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-time geospatial threat radar and active rumor clusters
          </p>
        </div>

        {/* Selected Region Status Pill */}
        <div className="flex items-center gap-2">
          {selectedRegion ? (
            <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold shadow-sm">
              <span>Showing: <strong>{selectedRegion}</strong></span>
              <button 
                onClick={handleClearSelection}
                className="ml-1 text-cyan-400 hover:text-white font-bold"
                title="Reset map view"
              >
                ×
              </button>
            </div>
          ) : (
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Active
            </span>
          )}
        </div>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-sans px-3 py-2 rounded-xl bg-[#0B0F17] border border-slate-800">
        <span className="text-slate-400 font-medium">Threat Level Scale:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E] shadow-sm shadow-rose-500/50"></span>
          <span className="text-rose-400 font-mono font-medium">High Danger</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-sm shadow-amber-500/50"></span>
          <span className="text-amber-400 font-mono font-medium">Medium Risk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] shadow-sm shadow-cyan-500/50"></span>
          <span className="text-cyan-400 font-mono font-medium">Monitored</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-sm shadow-emerald-500/50"></span>
          <span className="text-emerald-400 font-mono font-medium">Low / Safe</span>
        </div>
      </div>

      {/* Leaflet Map View Container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 h-[440px] z-10">
        <MapContainer
          center={[22.5937, 78.9629]}
          zoom={4.8}
          minZoom={4}
          maxZoom={8}
          maxBounds={[[6.0, 65.0], [38.0, 100.0]]}
          scrollWheelZoom={false}
          className="w-full h-full"
          attributionControl={true}
        >
          {/* CartoDB Dark Matter Base Tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          <MapController selectedCoords={selectedCoords} />

          {/* Render All Threat Node Hotspots */}
          {hotspotNodes.map((node) => {
            const isSelected = selectedRegion && (
              node.state.toLowerCase().includes(selectedRegion.toLowerCase()) || 
              node.name.toLowerCase().includes(selectedRegion.toLowerCase())
            );
            const isHighDanger = node.level === 'High Danger';
            const threatColor = getThreatColor(node.level);
            const radius = 7 + Math.min(10, node.threats / 4);

            return (
              <React.Fragment key={node.name}>
                {/* Outer Radar Wave for High Danger Nodes */}
                {isHighDanger && (
                  <CircleMarker
                    center={[node.lat, node.lng]}
                    radius={radius + 10}
                    pathOptions={{
                      color: '#F43F5E',
                      fillColor: '#F43F5E',
                      fillOpacity: 0.15,
                      weight: 1.5,
                      dashArray: '4 4'
                    }}
                  />
                )}

                {/* Primary Interactive Circle Marker */}
                <CircleMarker
                  center={[node.lat, node.lng]}
                  radius={radius}
                  pathOptions={{
                    fillColor: threatColor,
                    color: isSelected ? '#FFFFFF' : '#0B0F17',
                    weight: isSelected ? 2.5 : 1.5,
                    fillOpacity: 0.9
                  }}
                  eventHandlers={{
                    click: () => handleSelectNode(node)
                  }}
                >
                  {/* Hover Tooltip */}
                  <Tooltip direction="top" offset={[0, -radius]} opacity={0.95}>
                    <div className="font-mono">
                      <strong>{node.name}</strong>: {node.threats} Active Threats
                    </div>
                  </Tooltip>

                  {/* Detailed Click Popup */}
                  <Popup>
                    <div className="p-3.5 space-y-2.5 font-sans min-w-[220px]">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div>
                          <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                            {node.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{node.state}, India</div>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${getThreatBadgeClass(node.level)}`}>
                          {node.level}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span className="text-slate-400">Active Alerts:</span>
                          <span className="font-bold font-mono text-white">{node.threats} Threats ({node.posts} posts)</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span className="text-slate-400">Main Narrative:</span>
                          <span className="font-medium text-cyan-300 truncate max-w-[130px]">{node.topic}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 pt-1 leading-relaxed border-t border-slate-800">
                          {node.summary}
                        </p>
                      </div>

                      <button
                        onClick={() => handleSelectNode(node)}
                        className="w-full mt-2 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-500/20"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        Filter Dashboard to {node.name}
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>

      {/* State List with Threat Metrics */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Click any hotspot to center map & filter incident stream:</span>
          {selectedRegion && (
            <button 
              onClick={handleClearSelection}
              className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" /> Show All States
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 font-mono text-xs">
          {hotspotNodes.slice(0, 8).map((node) => {
            const isSelected = selectedRegion && (
              node.state.toLowerCase().includes(selectedRegion.toLowerCase()) || 
              node.name.toLowerCase().includes(selectedRegion.toLowerCase())
            );

            return (
              <div
                key={node.name}
                onClick={() => handleSelectNode(node)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 text-white shadow-md'
                    : 'bg-[#0B0F17] border-slate-800 hover:border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className={`w-3.5 h-3.5 ${
                    node.level === 'High Danger' ? 'text-rose-400' :
                    node.level === 'Medium Risk' ? 'text-amber-400' :
                    node.level === 'Monitored' ? 'text-cyan-400' : 'text-emerald-400'
                  }`} />
                  <div>
                    <div className="font-bold text-slate-100 text-xs">{node.name}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                      {node.topic}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${getThreatBadgeClass(node.level)}`}>
                    {node.threats} Threats
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{node.posts} posts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
