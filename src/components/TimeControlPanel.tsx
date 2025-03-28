import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { GameState } from '../types';

interface TimeControlPanelProps {
  gameState: GameState;
  onAdvanceTime: () => void;
  disabled?: boolean;
}

const TimeControlPanel: React.FC<TimeControlPanelProps> = ({
  gameState,
  onAdvanceTime,
  disabled
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  };

  return (
    <div className="fixed bottom-24 right-4 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border border-slate-700/50 shadow-lg p-4 w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500/10 rounded flex items-center justify-center">
            <Clock className="text-cyan-400" size={16} />
          </div>
          <h3 className="font-mono text-cyan-100">Time Control</h3>
        </div>
        <div className="font-mono text-lg text-cyan-400 tracking-wider">
          {gameState && gameState.date ? formatDate(gameState.date) : 'Loading...'}
        </div>
      </div>

      {/* Warning message */}
      {disabled && (
        <div className="mb-4 p-2 bg-gradient-to-r from-red-900/30 to-red-800/20 rounded-lg flex items-center gap-2 text-sm border border-red-900/50">
          <AlertTriangle size={16} className="text-red-400" />
          <span className="text-red-300">Cannot advance time while actions are pending</span>
        </div>
      )}

      {/* Advance button */}
      <button
        onClick={onAdvanceTime}
        disabled={disabled || !gameState}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                  disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed
                  text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2
                  shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
      >
        <Clock size={16} />
        Advance Month
      </button>
    </div>
  );
};

export default TimeControlPanel;