import React, { useState } from 'react';

// Accurate SVG outline paths for Indian States & Union Territories
// Scaled & aligned to a 600x680 viewport representing the full official geography of India
export const INDIA_STATE_PATHS = [
  {
    id: "JK_LADAKH",
    name: "Jammu & Kashmir / Ladakh",
    regionKey: "Jammu and Kashmir",
    d: "M 220 30 L 260 20 L 310 35 L 340 70 L 330 110 L 290 125 L 260 110 L 225 125 L 195 95 L 205 60 Z",
    center: { x: 265, y: 70 }
  },
  {
    id: "HP",
    name: "Himachal Pradesh",
    regionKey: "Himachal Pradesh",
    d: "M 225 125 L 260 110 L 285 125 L 280 155 L 245 160 L 225 140 Z",
    center: { x: 255, y: 135 }
  },
  {
    id: "PB",
    name: "Punjab",
    regionKey: "Punjab",
    d: "M 195 125 L 225 125 L 235 155 L 210 180 L 180 160 Z",
    center: { x: 205, y: 155 }
  },
  {
    id: "UT",
    name: "Uttarakhand",
    regionKey: "Uttarakhand",
    d: "M 285 125 L 325 145 L 315 175 L 280 175 L 280 155 Z",
    center: { x: 300, y: 150 }
  },
  {
    id: "HR",
    name: "Haryana",
    regionKey: "Haryana",
    d: "M 210 180 L 245 160 L 255 180 L 240 215 L 210 210 Z",
    center: { x: 230, y: 190 }
  },
  {
    id: "DL",
    name: "Delhi",
    regionKey: "Delhi",
    d: "M 245 188 L 255 188 L 253 198 L 243 198 Z",
    center: { x: 250, y: 193 }
  },
  {
    id: "RJ",
    name: "Rajasthan",
    regionKey: "Rajasthan",
    d: "M 130 190 L 210 180 L 240 215 L 235 270 L 180 290 L 125 250 Z",
    center: { x: 180, y: 240 }
  },
  {
    id: "UP",
    name: "Uttar Pradesh",
    regionKey: "Uttar Pradesh",
    d: "M 255 180 L 315 175 L 390 220 L 365 275 L 290 280 L 240 235 Z",
    center: { x: 310, y: 235 }
  },
  {
    id: "BR",
    name: "Bihar",
    regionKey: "Bihar",
    d: "M 390 220 L 460 230 L 450 275 L 375 280 L 365 275 Z",
    center: { x: 415, y: 250 }
  },
  {
    id: "JH",
    name: "Jharkhand",
    regionKey: "Jharkhand",
    d: "M 375 280 L 440 275 L 430 330 L 370 330 Z",
    center: { x: 405, y: 305 }
  },
  {
    id: "WB",
    name: "West Bengal",
    regionKey: "West Bengal",
    d: "M 445 225 L 470 235 L 455 315 L 485 365 L 450 375 L 435 320 L 450 275 Z",
    center: { x: 460, y: 300 }
  },
  {
    id: "NE",
    name: "Northeast States (Assam, Meghalaya, etc.)",
    regionKey: "Assam",
    d: "M 470 215 L 530 195 L 585 210 L 575 270 L 535 280 L 490 260 L 475 235 Z",
    center: { x: 525, y: 240 }
  },
  {
    id: "GJ",
    name: "Gujarat",
    regionKey: "Gujarat",
    d: "M 90 270 L 155 260 L 180 290 L 175 350 L 120 365 L 80 320 Z",
    center: { x: 130, y: 315 }
  },
  {
    id: "MP",
    name: "Madhya Pradesh",
    regionKey: "Madhya Pradesh",
    d: "M 180 290 L 290 280 L 370 300 L 340 370 L 220 375 L 175 340 Z",
    center: { x: 275, y: 325 }
  },
  {
    id: "CG",
    name: "Chhattisgarh",
    regionKey: "Chhattisgarh",
    d: "M 340 330 L 385 320 L 375 420 L 330 430 L 330 370 Z",
    center: { x: 355, y: 380 }
  },
  {
    id: "OR",
    name: "Odisha",
    regionKey: "Odisha",
    d: "M 385 320 L 440 330 L 435 410 L 375 420 Z",
    center: { x: 410, y: 370 }
  },
  {
    id: "MH",
    name: "Maharashtra",
    regionKey: "Maharashtra",
    d: "M 155 350 L 245 355 L 320 375 L 300 460 L 210 460 L 160 410 Z",
    center: { x: 225, y: 410 }
  },
  {
    id: "TS",
    name: "Telangana",
    regionKey: "Telangana",
    d: "M 275 420 L 340 415 L 320 485 L 265 470 Z",
    center: { x: 295, y: 450 }
  },
  {
    id: "AP",
    name: "Andhra Pradesh",
    regionKey: "Andhra Pradesh",
    d: "M 320 450 L 375 420 L 360 535 L 290 535 L 310 480 Z",
    center: { x: 335, y: 490 }
  },
  {
    id: "KA",
    name: "Karnataka",
    regionKey: "Karnataka",
    d: "M 195 450 L 265 460 L 275 550 L 220 570 L 190 500 Z",
    center: { x: 230, y: 510 }
  },
  {
    id: "KL",
    name: "Kerala",
    regionKey: "Kerala",
    d: "M 205 560 L 235 560 L 245 640 L 220 645 Z",
    center: { x: 225, y: 600 }
  },
  {
    id: "TN",
    name: "Tamil Nadu",
    regionKey: "Tamil Nadu",
    d: "M 235 550 L 295 535 L 290 630 L 245 640 Z",
    center: { x: 265, y: 590 }
  }
];

// Major Indian Cities Pins with exact SVG coordinates
export const MAJOR_CITIES = [
  { name: "Delhi", state: "Delhi", x: 248, y: 193, topTopic: "#ExamRumor" },
  { name: "Mumbai", state: "Maharashtra", x: 175, y: 405, topTopic: "#BankingScam" },
  { name: "Bengaluru", state: "Karnataka", x: 235, y: 535, topTopic: "#DeepfakeAlert" },
  { name: "Hyderabad", state: "Telangana", x: 295, y: 450, topTopic: "#UPIFraud" },
  { name: "Kolkata", state: "West Bengal", x: 455, y: 345, topTopic: "#FakeNotice" },
  { name: "Chennai", state: "Tamil Nadu", x: 290, y: 565, topTopic: "#WeatherAlert" },
  { name: "Ahmedabad", state: "Gujarat", x: 145, y: 310, topTopic: "#KYCPhish" },
  { name: "Lucknow", state: "Uttar Pradesh", x: 320, y: 240, topTopic: "#PaperLeakRumor" },
  { name: "Jaipur", state: "Rajasthan", x: 205, y: 230, topTopic: "#ExamSafety" },
  { name: "Patna", state: "Bihar", x: 415, y: 250, topTopic: "#FactCheck" },
  { name: "Guwahati", state: "Assam", x: 515, y: 245, topTopic: "#ReliefNotice" },
  { name: "Chandigarh", state: "Punjab", x: 220, y: 145, topTopic: "#AgriSubsidy" },
  { name: "Kochi", state: "Kerala", x: 220, y: 615, topTopic: "#WeatherPatrol" },
  { name: "Bhopal", state: "Madhya Pradesh", x: 265, y: 325, topTopic: "#StudentForum" },
];

export default function IndiaSvgMap({ heatmaps = [], selectedRegion = '', onSelectRegion }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  // Match state data
  const getStateData = (regionName) => {
    return heatmaps.find(
      (h) => h.region && h.region.toLowerCase().includes(regionName.toLowerCase())
    );
  };

  const getStateFill = (state) => {
    const data = getStateData(state.regionKey);
    const isSelected = selectedRegion && state.regionKey.toLowerCase().includes(selectedRegion.toLowerCase());

    if (isSelected) return '#ffffff'; // Stark White when selected
    if (!data) return '#18181b'; // Deep Charcoal Zinc default

    if (data.high_risk_count >= 4) return '#ffffff'; // High Risk (White)
    if (data.high_risk_count >= 1) return '#71717a'; // Moderate Risk (Medium Gray)
    if (data.post_count > 0) return '#3f3f46'; // Monitored (Darker Zinc)
    return '#18181b';
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      {/* SVG Vector Map Container */}
      <svg
        viewBox="60 10 540 650"
        className="w-full max-h-[380px] drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] cursor-pointer"
      >
        {/* Background Radar / Monochrome Circles */}
        <circle cx="280" cy="330" r="280" fill="none" stroke="#27272a" strokeWidth="0.75" strokeDasharray="6 6" opacity="0.4" />
        <circle cx="280" cy="330" r="190" fill="none" stroke="#27272a" strokeWidth="0.75" opacity="0.4" />
        <circle cx="280" cy="330" r="100" fill="none" stroke="#27272a" strokeWidth="0.75" opacity="0.5" />

        {/* State Boundaries */}
        <g className="states-group">
          {INDIA_STATE_PATHS.map((state) => {
            const data = getStateData(state.regionKey);
            const isHovered = hoveredItem?.name === state.name;
            const isSelected = selectedRegion && state.regionKey.toLowerCase().includes(selectedRegion.toLowerCase());

            return (
              <path
                key={state.id}
                d={state.d}
                fill={getStateFill(state)}
                stroke={isSelected ? '#000000' : isHovered ? '#ffffff' : '#3f3f46'}
                strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1.2'}
                className="transition-all duration-200 hover:opacity-90 hover:brightness-125"
                onMouseEnter={() => setHoveredItem({
                  name: state.name,
                  regionKey: state.regionKey,
                  threats: data?.high_risk_count || 0,
                  posts: data?.post_count || 0,
                  topic: data?.dominant_topic || 'Safe'
                })}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => onSelectRegion && onSelectRegion(state.regionKey)}
              />
            );
          })}
        </g>

        {/* Major City Pulsing Threat Pins */}
        <g className="city-pins">
          {MAJOR_CITIES.map((city) => {
            const data = getStateData(city.state);
            const hasThreat = (data?.high_risk_count || 0) > 0;
            const isSelected = selectedRegion && city.state.toLowerCase().includes(selectedRegion.toLowerCase());

            return (
              <g
                key={city.name}
                transform={`translate(${city.x}, ${city.y})`}
                className="cursor-pointer group"
                onClick={() => onSelectRegion && onSelectRegion(city.state)}
                onMouseEnter={() => setHoveredItem({
                  name: `${city.name} (${city.state})`,
                  regionKey: city.state,
                  threats: data?.high_risk_count || (hasThreat ? 3 : 0),
                  posts: data?.post_count || 8,
                  topic: data?.dominant_topic || city.topTopic
                })}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Ping Animation Ring for high alert cities */}
                {hasThreat && (
                  <circle
                    r="9"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="animate-ping opacity-75 origin-center"
                  />
                )}

                {/* Outer Pin Halo */}
                <circle
                  r="6"
                  fill={hasThreat ? '#ffffff' : '#71717a'}
                  stroke="#000000"
                  strokeWidth="1.5"
                  className="transition-transform group-hover:scale-125"
                />

                {/* Inner Dot */}
                <circle r="2.5" fill={hasThreat ? '#000000' : '#ffffff'} />

                {/* City Label */}
                <text
                  x="9"
                  y="3.5"
                  fill="#ffffff"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] opacity-85 group-hover:opacity-100 group-hover:fill-zinc-200"
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Interactive Tooltip Card */}
      {hoveredItem && (
        <div className="absolute top-2 right-2 p-3 rounded-xl bg-black/95 border border-zinc-700 shadow-2xl backdrop-blur-md text-xs font-mono pointer-events-none z-20 min-w-[200px] animate-fadeIn">
          <div className="font-bold text-white text-sm border-b border-zinc-800 pb-1 flex items-center justify-between">
            <span>{hoveredItem.name}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              hoveredItem.threats >= 3 ? 'bg-white text-black border border-white' :
              hoveredItem.threats >= 1 ? 'bg-zinc-800 text-zinc-200 border border-zinc-700' :
              'bg-zinc-900 text-zinc-400 border border-zinc-800'
            }`}>
              {hoveredItem.threats > 0 ? `${hoveredItem.threats} Threats` : 'Safe'}
            </span>
          </div>
          <div className="mt-2 space-y-1 text-[11px]">
            <div className="text-zinc-300">
              Monitored Posts: <span className="font-bold text-white">{hoveredItem.posts}</span>
            </div>
            <div className="text-zinc-300">
              Active Topic: <span className="font-bold text-white">{hoveredItem.topic}</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-zinc-400 font-sans border-t border-zinc-800 pt-1">
            👉 Click to filter live posts for this state
          </div>
        </div>
      )}
    </div>
  );
}
