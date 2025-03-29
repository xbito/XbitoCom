import React, { useState } from 'react';
import { Base, Continent } from '../types';
import { CONTINENTS } from '../data/continents';

interface WorldMapProps {
  bases: Base[];
  onBaseClick: (base: Base) => void;
  onContinentSelect?: (continent: Continent) => void;
  showRadarCoverage?: boolean;
}

const WorldMap: React.FC<WorldMapProps> = ({
  bases,
  onBaseClick,
  onContinentSelect,
  showRadarCoverage = false
}) => {
  const [hoveredContinent, setHoveredContinent] = useState<Continent | null>(null);

  // Calculate radar coverage radius based on radar level and effectiveness
  const getRadarRadius = (base: Base): number => {
    const radarFacility = base.facilities.find(f => f.type === 'radar');
    if (!radarFacility) return 0;
    
    const baseRange = 60; // Increased base radius for better visibility
    const radarBonus = radarFacility.level * 0.2; // 20% per level
    return baseRange * (1 + radarBonus);
  };

  // Get radar coverage opacity based on facility level
  const getRadarOpacity = (base: Base): number => {
    const radarFacility = base.facilities.find(f => f.type === 'radar');
    if (!radarFacility) return 0;
    
    // Increased base opacity for better visibility (0.25 to 0.45)
    return 0.25 + (radarFacility.level * 0.05);
  };

  const handleMapClick = (e: React.MouseEvent<SVGElement>) => {
    if (!onContinentSelect) return;

    const clickedContinent = Object.values(CONTINENTS).find(continent => {
      const path = document.getElementById(`continent-${continent.id}`);
      if (!path) return false;
      return path.contains(e.target as Node);
    });

    if (clickedContinent) {
      onContinentSelect(clickedContinent);
    }
  };

  const getBasePosition = (base: Base) => {
    const continent = base?.continent;
    if (!continent || !continent.coordinates) {
      // Return default position if continent or coordinates are missing
      return {
        x: 0,
        y: 0
      };
    }

    const x = continent.coordinates.x1 + 
      ((continent.coordinates.x2 - continent.coordinates.x1) * (base.x / 100));
    const y = continent.coordinates.y1 + 
      ((continent.coordinates.y2 - continent.coordinates.y1) * (base.y / 100));
    
    // Convert percentage to SVG coordinates
    return {
      x: (x / 100) * 1000,
      y: (y / 100) * 500
    };
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-black border border-green-900/30">
      {/* Dark radial gradient background - brighter in center, darker at borders */}
      <div className="absolute inset-0 bg-gradient-radial from-zinc-800/30 via-zinc-900/60 to-black pointer-events-none" />
      
      {/* Subtle green overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-700/5 to-black/30 pointer-events-none" />
      
      <svg 
        viewBox="0 0 900 500" 
        className="w-full h-full"
        style={{ cursor: onContinentSelect ? 'crosshair' : 'default' }}
        onClick={handleMapClick}
      >
        {/* Enhanced tactical grid background */}
        <defs>
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path 
              d="M 20 0 L 0 0 0 20" 
              fill="none" 
              stroke="rgba(34, 197, 94, 0.1)" 
              strokeWidth="0.5"
              className="animate-pulse"
            />
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path 
              d="M 100 0 L 0 0 0 100" 
              fill="none" 
              stroke="rgba(34, 197, 94, 0.15)" 
              strokeWidth="1"
            />
          </pattern>
          
          {/* Enhanced glow effect for continents */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Stronger glow effect for hover state */}
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial gradient for background */}
          <radialGradient id="mapBackground" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#1c1c1c" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#0f0f0f" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Dark background with radial gradient */}
        <rect width="100%" height="100%" fill="url(#mapBackground)" />

        {/* Tactical grid background */}
        <rect width="100%" height="100%" fill="url(#grid)" className="opacity-40" />

        {/* Continents with enhanced neon outlines and glow */}
        {/* North America */}
        <path
          id="continent-northAmerica"
          d="M 150 50 L 300 50 Q 350 100 350 150 L 300 200 L 200 220 L 150 180 Q 100 150 150 50"
          className="continent-path"
          fill={hoveredContinent?.id === 'northAmerica' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.12)'}
          stroke={hoveredContinent?.id === 'northAmerica' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(34, 197, 94, 0.6)'}
          strokeWidth="2.5"
          filter={hoveredContinent?.id === 'northAmerica' ? 'url(#strongGlow)' : 'url(#glow)'}
          onMouseEnter={() => setHoveredContinent(CONTINENTS.northAmerica)}
          onMouseLeave={() => setHoveredContinent(null)}
        />

        {/* South America */}
        <path
          id="continent-southAmerica"
          d="M 250 250 L 300 250 Q 320 300 320 350 L 280 400 L 230 380 Q 200 350 250 250"
          className="continent-path"
          fill={hoveredContinent?.id === 'southAmerica' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.12)'}
          stroke={hoveredContinent?.id === 'southAmerica' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(34, 197, 94, 0.6)'}
          strokeWidth="2.5"
          filter={hoveredContinent?.id === 'southAmerica' ? 'url(#strongGlow)' : 'url(#glow)'}
          onMouseEnter={() => setHoveredContinent(CONTINENTS.southAmerica)}
          onMouseLeave={() => setHoveredContinent(null)}
        />

        {/* Europe */}
        <path
          id="continent-europe"
          d="M 400 50 L 500 50 Q 520 80 520 120 L 480 150 L 420 140 Q 380 120 400 50"
          className="continent-path"
          fill={hoveredContinent?.id === 'europe' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.12)'}
          stroke={hoveredContinent?.id === 'europe' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(34, 197, 94, 0.6)'}
          strokeWidth="2.5"
          filter={hoveredContinent?.id === 'europe' ? 'url(#strongGlow)' : 'url(#glow)'}
          onMouseEnter={() => setHoveredContinent(CONTINENTS.europe)}
          onMouseLeave={() => setHoveredContinent(null)}
        />

        {/* Africa */}
        <path
          id="continent-africa"
          d="M 450 200 L 550 200 Q 580 250 580 300 L 550 350 Q 500 380 450 350 L 420 300 Q 420 250 450 200"
          className="continent-path"
          fill={hoveredContinent?.id === 'africa' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.12)'}
          stroke={hoveredContinent?.id === 'africa' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(34, 197, 94, 0.6)'}
          strokeWidth="2.5"
          filter={hoveredContinent?.id === 'africa' ? 'url(#strongGlow)' : 'url(#glow)'}
          onMouseEnter={() => setHoveredContinent(CONTINENTS.africa)}
          onMouseLeave={() => setHoveredContinent(null)}
        />

        {/* Asia */}
        <path
          id="continent-asia"
          d="M 600 50 L 800 50 Q 850 100 850 200 L 800 300 L 700 320 L 600 300 L 580 250 L 600 150 Z"
          className="continent-path"
          fill={hoveredContinent?.id === 'asia' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.12)'}
          stroke={hoveredContinent?.id === 'asia' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(34, 197, 94, 0.6)'}
          strokeWidth="2.5"
          filter={hoveredContinent?.id === 'asia' ? 'url(#strongGlow)' : 'url(#glow)'}
          onMouseEnter={() => setHoveredContinent(CONTINENTS.asia)}
          onMouseLeave={() => setHoveredContinent(null)}
        />

        {/* Oceania */}
        <path
          id="continent-oceania"
          d="M 750 350 Q 800 350 800 400 L 780 430 Q 750 450 720 430 L 700 400 Q 700 350 750 350"
          className="continent-path"
          fill={hoveredContinent?.id === 'oceania' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.12)'}
          stroke={hoveredContinent?.id === 'oceania' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(34, 197, 94, 0.6)'}
          strokeWidth="2.5"
          filter={hoveredContinent?.id === 'oceania' ? 'url(#strongGlow)' : 'url(#glow)'}
          onMouseEnter={() => setHoveredContinent(CONTINENTS.oceania)}
          onMouseLeave={() => setHoveredContinent(null)}
        />

        {/* Enhanced Radar Coverage with green color scheme */}
        {showRadarCoverage && bases.map((base) => {
          const position = getBasePosition(base);
          const radius = getRadarRadius(base);
          const opacity = getRadarOpacity(base);
          
          if (radius === 0) return null;

          return (
            <g key={`radar-${base.id}`}>
              <defs>
                <radialGradient id={`radar-gradient-${base.id}`}>
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={opacity * 0.9} />
                  <stop offset="50%" stopColor="#15803d" stopOpacity={opacity * 0.5} />
                  <stop offset="100%" stopColor="#15803d" stopOpacity={0} />
                </radialGradient>
              </defs>
              
              {/* Main radar coverage area */}
              <circle
                cx={position.x}
                cy={position.y}
                r={radius}
                fill={`url(#radar-gradient-${base.id})`}
                className="animate-pulse pointer-events-none"
              />
              
              {/* Primary radar ring with centered rotation */}
              <g transform={`translate(${position.x} ${position.y})`}>
                <g className="animate-spin" style={{ transformOrigin: '0 0', animationDuration: '10s' }}>
                  <circle
                    cx="0"
                    cy="0"
                    r={radius}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="pointer-events-none"
                  />
                </g>
              </g>

              {/* Secondary radar ring with centered rotation */}
              <g transform={`translate(${position.x} ${position.y})`}>
                <g className="animate-spin" style={{ transformOrigin: '0 0', animationDuration: '15s' }}>
                  <circle
                    cx="0"
                    cy="0"
                    r={radius * 0.75}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="1"
                    strokeDasharray="8 8"
                    className="pointer-events-none"
                    opacity={0.7}
                  />
                </g>
              </g>

              {/* Tertiary radar ring with centered rotation */}
              <g transform={`translate(${position.x} ${position.y})`}>
                <g className="animate-spin" style={{ transformOrigin: '0 0', animationDuration: '8s' }}>
                  <circle
                    cx="0"
                    cy="0"
                    r={radius * 0.5}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="0.75"
                    strokeDasharray="4 4"
                    className="pointer-events-none"
                    opacity={0.5}
                  />
                </g>
              </g>
            </g>
          );
        })}

        {/* Bases with enhanced visualization and glow effect */}
        {bases.map((base) => {
          const position = getBasePosition(base);
          
          return (
            <g key={base.id} onClick={(e) => {
              e.stopPropagation();
              onBaseClick(base);
            }}>
              {/* Enhanced pulse effect */}
              <circle
                cx={position.x}
                cy={position.y}
                r="12"
                className="animate-ping"
                fill="#22c55e"
                fillOpacity="0.2"
              />
              
              {/* Base marker with stronger glow */}
              <circle
                cx={position.x}
                cy={position.y}
                r="6"
                fill="#22c55e"
                className="cursor-pointer hover:fill-green-300"
                filter="url(#strongGlow)"
              />
            </g>
          );
        })}

        {/* Distant stars/dots effect in the background */}
        {Array.from({ length: 50 }).map((_, i) => (
          <circle
            key={`star-${i}`}
            cx={Math.random() * 900}
            cy={Math.random() * 500}
            r={Math.random() * 1.5}
            fill="#ffffff"
            opacity={Math.random() * 0.5 + 0.1}
            className={i % 2 === 0 ? "animate-pulse" : ""}
          />
        ))}
      </svg>

      {/* Enhanced scanning effect with red accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-scan pointer-events-none" 
           style={{ backgroundSize: '100% 10px' }} />
           
      {/* Subtle red alert scan line */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent animate-scan-slow pointer-events-none" 
           style={{ backgroundSize: '100% 5px', animationDelay: '0.5s' }} />
    </div>
  );
};

export default WorldMap;