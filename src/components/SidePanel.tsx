import React from 'react';
import { GameState } from '../types';
import { AlertCircle, Users, Beaker, DollarSign, Radio } from 'lucide-react';

interface SidePanelProps {
  gameState: GameState;
  onManagePersonnel: () => void;
  onOpenResearch: () => void;
  onOpenFinancials: () => void;
  onToggleRadar: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  gameState,
  onManagePersonnel,
  onOpenResearch,
  onOpenFinancials,
  onToggleRadar,
}) => {
  return (
    <div className="w-64 bg-black/50 backdrop-blur-sm rounded-lg border border-slate-800 p-4">
      <h2 className="text-lg font-medium text-slate-300 mb-4">Control Panel</h2>
      <div className="space-y-2">
        <div className="bg-gray-800 p-4 rounded-lg flex items-start gap-3 shadow-md">
          <AlertCircle className="text-green-400 shrink-0 mt-1" size={20} />
          <div className="text-sm">
            <p className="font-medium mb-1 text-green-300">How to Build a New Base</p>
            <p className="text-gray-300">Click on any continent on the world map to select a location for your new base.</p>
            <p className="text-gray-400 mt-2">Required funds: ${(2000000).toLocaleString()}</p>
          </div>
        </div>

        <button
          className="w-full bg-gray-800 text-green-300 font-bold py-2 px-4 flex items-center gap-2 transition-colors hover:bg-gray-700 hover:text-green-200"
          onClick={onManagePersonnel}
        >
          <Users size={20} />
          Manage Personnel
        </button>

        <button
          className="w-full bg-gray-800 text-green-300 font-bold py-2 px-4 flex items-center gap-2 transition-colors hover:bg-gray-700 hover:text-green-200"
          onClick={onOpenResearch}
        >
          <Beaker size={20} />
          Research Lab
        </button>

        <button
          className="w-full bg-gray-800 text-green-300 font-bold py-2 px-4 flex items-center gap-2 transition-colors hover:bg-gray-700 hover:text-green-200"
          onClick={onOpenFinancials}
        >
          <DollarSign size={20} />
          Financial Overview
        </button>

        <button
          onClick={onToggleRadar}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50"
        >
          <Radio size={18} className="text-green-500" />
          <span className="text-sm text-slate-300">
            {gameState.showRadarCoverage ? 'Hide' : 'Show'} Radar Coverage
          </span>
        </button>
      </div>
    </div>
  );
};

export default SidePanel;