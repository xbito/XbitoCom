import React, { useState, useRef, useEffect } from 'react';
import { Base, Continent, UFO, ContinentSelection, ResearchProject } from '../types';
import { CONTINENTS } from '../data/continents';
import { doesTrajectoryIntersectRadar } from '../utils/trajectory';
import { getRadarRadius, getRadarOpacity } from '../utils/baseUtils';

// Animation speed in pixels per second
const UFO_SPEED = 50;

interface WorldMapProps {
  bases: Base[];
  onBaseClick: (base: Base) => void;
  onContinentSelect?: (selection: ContinentSelection) => void;
  showRadarCoverage?: boolean;
  showAllUFOTrajectories?: boolean;
  activeUFOs?: UFO[];
  detectedUFOs?: UFO[];
  onUFOClick?: (ufo: UFO) => void;
  completedResearch: ResearchProject[]; // NEW PROP
}

const WorldMap: React.FC<WorldMapProps> = ({
  bases,
  onBaseClick,
  onContinentSelect,
  showRadarCoverage = false,
  showAllUFOTrajectories = false,
  activeUFOs = [],
  detectedUFOs = [],
  onUFOClick,
  completedResearch
}) => {
  const [hoveredContinent, setHoveredContinent] = useState<Continent | null>(null);
  const [hoveredUFO, setHoveredUFO] = useState<UFO | null>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Animation loop
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update UFO positions
      [...activeUFOs, ...detectedUFOs].forEach(ufo => {
        if (!ufo.trajectory) return;

        // Calculate new position based on speed and time
        const progress = ufo.trajectory.progress + (deltaTime / 1000) * (UFO_SPEED / 1000);
        
        if (progress <= 1) {
          const currentX = ufo.trajectory.start.x + (ufo.trajectory.end.x - ufo.trajectory.start.x) * progress;
          const currentY = ufo.trajectory.start.y + (ufo.trajectory.end.y - ufo.trajectory.start.y) * progress;

          // Update UFO position
          ufo.trajectory.progress = progress;
          ufo.trajectory.currentPosition = { x: currentX, y: currentY };
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeUFOs, detectedUFOs, bases, showRadarCoverage]);

  const handleMapClick = (e: React.MouseEvent<SVGElement>) => {
    if (!onContinentSelect) return;

    // Get click coordinates relative to SVG viewBox
    const svgElement = e.currentTarget;
    const rect = svgElement.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 900; // Scale to SVG width
    const clickY = ((e.clientY - rect.top) / rect.height) * 500;  // Scale to SVG height

    const clickedContinent = Object.values(CONTINENTS).find(continent => {
      const path = document.getElementById(`continent-${continent.id}`);
      if (!path) return false;
      return path.contains(e.target as Node);
    });

    if (clickedContinent) {
      onContinentSelect({
        continent: clickedContinent,
        clickX,
        clickY
      });
    }
  };

  const getBasePosition = (base: Base) => {
    const continent = base?.continent;
    if (!continent || !continent.coordinates) {
      return { x: 0, y: 0 };
    }

    // If base has specific SVG coordinates, use them directly
    if (base.x >= 0 && base.x <= 1000 && base.y >= 0 && base.y <= 500) {
      return { x: base.x, y: base.y };
    }

    // Otherwise convert from percentage coordinates
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

  const getVisibleUFOs = (ufos: UFO[], bases: Base[]): UFO[] => {
    // Only show UFOs whose trajectory intersects with at least one base's radar
    return ufos.filter(ufo => {
      if (!ufo.trajectory) return false;
      return bases.some(base => doesTrajectoryIntersectRadar(ufo.trajectory!, base));
    });
  };

  // Render UFO icon and trajectory
  const renderUFO = (ufo: UFO, isDetected: boolean) => {
    if (!ufo.trajectory) return null;

    const ufoSize = 4 + ufo.size * 2;
    const position = ufo.trajectory.currentPosition;
    
    const renderUFOShape = () => {
      switch (ufo.shape) {
        case 'triangle':
          return `M ${-ufoSize} ${ufoSize} L ${ufoSize} ${ufoSize} L 0 ${-ufoSize} Z`;
        case 'diamond':
          return `M ${-ufoSize} 0 L 0 ${ufoSize} L ${ufoSize} 0 L 0 ${-ufoSize} Z`;
        case 'rectangle':
          return `M ${-ufoSize} ${-ufoSize/2} H ${ufoSize} V ${ufoSize/2} H ${-ufoSize} Z`;
        case 'hexagon':
          const a = ufoSize * 0.866; // cos(30°) * size
          return `M ${-ufoSize} 0 L ${-ufoSize/2} ${-a} L ${ufoSize/2} ${-a} L ${ufoSize} 0 L ${ufoSize/2} ${a} L ${-ufoSize/2} ${a} Z`;
        case 'pentagon':
          const r = ufoSize;
          const points = Array.from({length: 5}).map((_, i) => {
            const angle = (i * 2 * Math.PI / 5) - Math.PI/2;
            return `${r * Math.cos(angle)},${r * Math.sin(angle)}`;
          }).join(' ');
          return `M ${points} Z`;
        case 'octagon':
          const s = ufoSize * 0.4142; // tan(22.5°) * size
          return `M ${-ufoSize} ${-s} L ${-s} ${-ufoSize} L ${s} ${-ufoSize} L ${ufoSize} ${-s} L ${ufoSize} ${s} L ${s} ${ufoSize} L ${-s} ${ufoSize} L ${-ufoSize} ${s} Z`;
        default:
          return undefined;
      }
    };

    return (
      <g key={ufo.id} className="ufo-group">
        {/* UFO Trajectory line */}
        {(isDetected || showAllUFOTrajectories) && (
          <path
            d={`M ${ufo.trajectory.start.x} ${ufo.trajectory.start.y} L ${ufo.trajectory.end.x} ${ufo.trajectory.end.y}`}
            stroke={isDetected ? "#ef4444" : "#666666"}
            strokeWidth={isDetected ? "2" : "1"}
            strokeDasharray={isDetected ? "4 4" : "1 2"}
            className="opacity-50"
            filter="url(#glow)"
          />
        )}

        {/* Current position marker */}
        {(isDetected || showAllUFOTrajectories) && (
          <line
            x1={ufo.trajectory.start.x}
            y1={ufo.trajectory.start.y}
            x2={position.x}
            y2={position.y}
            stroke={isDetected ? "#ef4444" : "#666666"}
            strokeWidth={isDetected ? "3" : "2"}
            className="opacity-75"
            filter="url(#glow)"
          />
        )}

        {/* UFO icon with shape and color */}
        <g
          transform={`translate(${position.x} ${position.y})`}
          onClick={() => onUFOClick?.(ufo)}
          onMouseEnter={() => setHoveredUFO(ufo)}
          onMouseLeave={() => setHoveredUFO(null)}
          className={`cursor-pointer ufo-${ufo.type}`}
        >
          {ufo.shape === 'circle' ? (
            <circle
              r={ufoSize}
              fill={isDetected ? ufo.color : "#666666"}
              className={`${isDetected ? "animate-pulse" : ""} transition-all duration-300`}
              filter={hoveredUFO?.id === ufo.id ? "url(#strongGlow)" : "url(#glow)"}
            />
          ) : (
            <path
              d={renderUFOShape()}
              fill={isDetected ? ufo.color : "#666666"}
              className={`${isDetected ? "animate-pulse" : ""} transition-all duration-300`}
              filter={hoveredUFO?.id === ufo.id ? "url(#strongGlow)" : "url(#glow)"}
            />
          )}
        </g>

        {/* UFO info tooltip */}
        {hoveredUFO?.id === ufo.id && (isDetected || showAllUFOTrajectories) && (
          <foreignObject
            x={position.x + ufoSize * 2}
            y={position.y - 60}
            width={200}
            height={120}
            className="pointer-events-none"
          >
            <div className="bg-black/80 text-white p-2 rounded text-sm border border-red-500/30">
              <div className="font-bold">{ufo.name}</div>
              <div>Type: {ufo.type}</div>
              <div>Speed: {ufo.speed} km/h</div>
              <div>Status: {ufo.status}</div>
              <div>Progress: {Math.round(ufo.trajectory.progress * 100)}%</div>
            </div>
          </foreignObject>
        )}
      </g>
    );
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

        {/* Render Radar Coverage */}
        {showRadarCoverage && bases.map((base) => {
          const position = getBasePosition(base);
          const radius = getRadarRadius(base, completedResearch);
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

        {/* Render UFOs */}
        {showAllUFOTrajectories
          ? getVisibleUFOs(activeUFOs, bases).map(ufo => renderUFO(ufo, false))
          : activeUFOs.map(ufo => renderUFO(ufo, false))}
        {showAllUFOTrajectories
          ? getVisibleUFOs(detectedUFOs, bases).map(ufo => renderUFO(ufo, true))
          : detectedUFOs.map(ufo => renderUFO(ufo, true))}

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