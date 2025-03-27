import React, { useState } from 'react';
import { Base, Continent } from '../types';
import { CONTINENTS } from '../data/continents';

interface WorldMapProps {
  bases: Base[];
  onBaseClick: (base: Base) => void;
  onContinentSelect?: (continent: Continent) => void;
  showRadarCoverage?: boolean;
}

const WorldMap: React.FC<WorldMapProps> = ({ bases, onBaseClick, onContinentSelect, showRadarCoverage = false }) => {
  const [hoveredContinent, setHoveredContinent] = useState<Continent | null>(null);

  // Calculate radar coverage radius based on radar level and effectiveness
  const getRadarRadius = (base: Base): number => {
    const radarFacility = base.facilities.find(f => f.type === 'radar');
    if (!radarFacility) return 0;
    
    const baseRange = 50; // Base radius in SVG units
    const radarBonus = radarFacility.level * 0.2; // 20% per level
    return baseRange * (1 + radarBonus);
  };

  // Get radar coverage opacity based on facility level
  const getRadarOpacity = (base: Base): number => {
    const radarFacility = base.facilities.find(f => f.type === 'radar');
    if (!radarFacility) return 0;
    
    // Opacity increases with radar level (0.15 to 0.35)
    return 0.15 + (radarFacility.level * 0.05);
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
    <div className="bg-slate-800 rounded-lg p-4 h-[600px] relative">
      <h2 className="text-xl font-bold mb-4">Global Operations Map</h2>
      
      <div className="relative h-[calc(100%-2rem)] w-full">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full"
          onClick={handleMapClick}
          style={{ cursor: onContinentSelect ? 'crosshair' : 'default' }}
        >
          {/* World Map Background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* North America */}
          <path
            id="continent-northAmerica"
            d="M 150 50 L 300 50 Q 350 100 350 150 L 300 200 L 200 220 L 150 180 Q 100 150 150 50"
            fill={hoveredContinent?.id === 'northAmerica' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)'}
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="2"
            onMouseEnter={() => setHoveredContinent(CONTINENTS.northAmerica)}
            onMouseLeave={() => setHoveredContinent(null)}
          />

          {/* South America */}
          <path
            id="continent-southAmerica"
            d="M 250 250 L 300 230 L 320 300 Q 320 350 280 400 L 250 420 Q 200 400 200 350 L 220 300 Z"
            fill={hoveredContinent?.id === 'southAmerica' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)'}
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="2"
            onMouseEnter={() => setHoveredContinent(CONTINENTS.southAmerica)}
            onMouseLeave={() => setHoveredContinent(null)}
          />

          {/* Europe */}
          <path
            id="continent-europe"
            d="M 450 80 L 550 80 Q 580 100 580 130 L 550 180 L 480 170 Q 450 150 450 120 Z"
            fill={hoveredContinent?.id === 'europe' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)'}
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="2"
            onMouseEnter={() => setHoveredContinent(CONTINENTS.europe)}
            onMouseLeave={() => setHoveredContinent(null)}
          />

          {/* Africa */}
          <path
            id="continent-africa"
            d="M 450 200 L 550 200 Q 580 250 580 300 L 550 350 Q 500 380 450 350 L 420 300 Q 420 250 450 200"
            fill={hoveredContinent?.id === 'africa' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)'}
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="2"
            onMouseEnter={() => setHoveredContinent(CONTINENTS.africa)}
            onMouseLeave={() => setHoveredContinent(null)}
          />

          {/* Asia */}
          <path
            id="continent-asia"
            d="M 600 50 L 800 50 Q 850 100 850 200 L 800 300 L 700 320 L 600 300 L 580 250 L 600 150 Z"
            fill={hoveredContinent?.id === 'asia' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)'}
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="2"
            onMouseEnter={() => setHoveredContinent(CONTINENTS.asia)}
            onMouseLeave={() => setHoveredContinent(null)}
          />

          {/* Oceania */}
          <path
            id="continent-oceania"
            d="M 750 350 Q 800 350 850 350 L 870 400 Q 870 430 840 450 L 780 450 Q 750 430 750 400 Z"
            fill={hoveredContinent?.id === 'oceania' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)'}
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="2"
            onMouseEnter={() => setHoveredContinent(CONTINENTS.oceania)}
            onMouseLeave={() => setHoveredContinent(null)}
          />

          {/* Radar Coverage */}
          {showRadarCoverage && bases.map((base) => {
            const position = getBasePosition(base);
            const radius = getRadarRadius(base);
            const opacity = getRadarOpacity(base);
            
            if (radius === 0) return null;

            return (
              <g key={`radar-${base.id}`}>
                {/* Radar gradient */}
                <defs>
                  <radialGradient id={`radar-gradient-${base.id}`}>
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={opacity} />
                    <stop offset="70%" stopColor="#3b82f6" stopOpacity={opacity * 0.7} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </radialGradient>
                </defs>
                
                {/* Radar coverage area */}
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={radius}
                  fill={`url(#radar-gradient-${base.id})`}
                  className="pointer-events-none"
                />
                
                {/* Radar range indicator (border) */}
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={radius}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  className="pointer-events-none"
                />
              </g>
            );
          })}

          {/* Bases */}
          {bases.map((base) => {
            const position = getBasePosition(base);
            
            return (
              <g key={base.id} onClick={(e) => {
                e.stopPropagation();
                onBaseClick(base);
              }}>
                {/* Pulse effect */}
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="10"
                  className="animate-ping"
                  fill="rgba(59, 130, 246, 0.3)"
                />
                {/* Base marker */}
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="6"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer hover:fill-blue-400"
                />
                {/* Base name */}
                <text
                  x={position.x + 10}
                  y={position.y}
                  fill="white"
                  fontSize="12"
                  className="pointer-events-none"
                >
                  {base.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Info */}
        {hoveredContinent && (
          <div 
            className="absolute bottom-4 left-4 bg-slate-900 p-3 rounded shadow-lg"
            style={{ maxWidth: '300px' }}
          >
            <h3 className="font-bold text-lg mb-1">{hoveredContinent.name}</h3>
            <div className="space-y-1 text-sm">
              <p>Base Size Limit: {hoveredContinent.maxBaseSize}</p>
              <p>Personnel Efficiency: +{((hoveredContinent.personnelMultiplier - 1) * 100).toFixed(0)}%</p>
              <p>Research Efficiency: +{((hoveredContinent.researchMultiplier - 1) * 100).toFixed(0)}%</p>
              <p>Defense Strength: +{((hoveredContinent.defenseMultiplier - 1) * 100).toFixed(0)}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldMap;