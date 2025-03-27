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
    <div className="w-80 bg-slate-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Command Center</h2>
      
      <div className="space-y-4">
        <div className="bg-slate-700 p-4 rounded-lg flex items-start gap-3">
          <HelpCircle className="text-blue-400 shrink-0 mt-1" size={20} />
          <div className="text-sm">
            <p className="font-medium mb-1">How to Build a New Base</p>
            <p className="text-slate-300">Click on any continent on the world map to select a location for your new base. Different continents provide unique bonuses and challenges.</p>
            <p className="text-slate-400 mt-2">Required funds: ${(2000000).toLocaleString()}</p>
          </div>
        </div>
        
        <button 
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
          onClick={onManagePersonnel}
        >
          <Users size={20} />
          Manage Personnel
        </button>
        
        <button 
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
          onClick={onOpenResearch}
        >
          <Microscope size={20} />
          Research Lab
        </button>
        
        <button 
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
          onClick={onOpenFinancials}
        >
          <DollarSign size={20} />
          Financial Overview
        </button>

        <button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
          onClick={onToggleRadar}
        >
          <Radio size={20} />
          {gameState.showRadarCoverage ? 'Hide Radar Coverage' : 'Show Radar Coverage'}
        </button>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Current Date</h3>
        <p className="text-xl">
          {gameState && gameState.date ? gameState.date.toLocaleDateString() : 'Loading...'}
        </p>
      </div>
    </div>
  );
};

export default SidePanel;