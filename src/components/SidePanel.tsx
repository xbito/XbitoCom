import React from 'react';
import { GameState } from '../types';
import { Users, Microscope, DollarSign, HelpCircle, Radio } from 'lucide-react';

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
    <div className="w-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center text-teal-400 font-mono">Command Center</h2>
      <div className="space-y-4">
        <div className="bg-slate-700 p-4 rounded-lg flex items-start gap-3 shadow-md">
          <HelpCircle className="text-teal-400 shrink-0 mt-1" size={20} />
          <div className="text-sm">
            <p className="font-medium mb-1 text-teal-300">How to Build a New Base</p>
            <p className="text-slate-300">Click on any continent on the world map to select a location for your new base. Different continents provide unique bonuses and challenges.</p>
            <p className="text-slate-400 mt-2">Required funds: ${(2000000).toLocaleString()}</p>
          </div>
        </div>
        <button 
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 shadow-md hover:shadow-lg"
          onClick={onManagePersonnel}
        >
          <Users size={20} />
          Manage Personnel
        </button>
        <button 
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 shadow-md hover:shadow-lg"
          onClick={onOpenResearch}
        >
          <Microscope size={20} />
          Research Lab
        </button>
        <button 
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 shadow-md hover:shadow-lg"
          onClick={onOpenFinancials}
        >
          <DollarSign size={20} />
          Financial Overview
        </button>
        <button 
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 shadow-md hover:shadow-lg"
          onClick={onToggleRadar}
        >
          <Radio size={20} />
          {gameState.showRadarCoverage ? 'Hide Radar Coverage' : 'Show Radar Coverage'}
        </button>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2 text-teal-300">Current Date</h3>
        <p className="text-xl text-teal-400 font-mono">
          {gameState && gameState.date ? gameState.date.toLocaleDateString() : 'Loading...'}
        </p>
      </div>
    </div>
  );
};

export default SidePanel;