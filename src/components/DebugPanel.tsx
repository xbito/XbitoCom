import React from 'react';
import { GameState } from '../types';
import { Bug, Radio, RadioTower, AlertTriangle } from 'lucide-react';

interface DebugPanelProps {
  isVisible: boolean;
  gameState: GameState;
  onToggleRadar: () => void;
  onToggleUFOPaths: () => void;
  onToggleForceSpawn: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  isVisible,
  gameState,
  onToggleRadar,
  onToggleUFOPaths,
  onToggleForceSpawn
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 w-80 bg-black/90 backdrop-blur-sm rounded-lg border border-red-500/30 p-4 shadow-lg z-50">
      <div className="flex items-center gap-2 mb-4">
        <Bug className="text-red-500" size={20} />
        <h2 className="text-lg font-medium text-red-500">Debug Controls</h2>
      </div>

      <div className="space-y-3">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Display Options</div>
        
        <button
          onClick={onToggleRadar}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800/50"
        >
          <Radio size={16} className="text-green-500" />
          <span className="text-sm text-gray-300">
            {gameState.showRadarCoverage ? 'Hide' : 'Show'} Radar Coverage
          </span>
        </button>

        <button
          onClick={onToggleUFOPaths}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800/50"
        >
          <RadioTower size={16} className="text-blue-500" />
          <span className="text-sm text-gray-300">
            {gameState.showAllUFOTrajectories ? 'Hide' : 'Show'} All UFO Paths
          </span>
        </button>

        <div className="text-xs text-gray-500 uppercase tracking-wider mt-4 mb-2">UFO Controls</div>

        <button
          onClick={onToggleForceSpawn}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800/50"
        >
          <AlertTriangle size={16} className="text-yellow-500" />
          <div className="flex flex-col items-start">
            <span className="text-sm text-gray-300">
              Force UFO Spawn Next Turn
            </span>
            <span className="text-xs text-gray-500">
              Status: {gameState.forceUFOSpawn ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-600 border-t border-gray-800 pt-3">
        Press 'D' to toggle debug panel
      </div>
    </div>
  );
};

export default DebugPanel;