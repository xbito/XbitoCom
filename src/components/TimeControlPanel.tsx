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
    <div className="fixed bottom-24 right-4 bg-slate-800 rounded-lg shadow-lg p-4 w-64">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="text-blue-400" size={20} />
          <h3 className="font-semibold">Time Control</h3>
        </div>
        <span className="text-lg font-bold">
          {gameState && gameState.date ? formatDate(gameState.date) : 'Loading...'}
        </span>
      </div>

      {disabled && (
        <div className="mb-4 p-2 bg-red-900/30 rounded flex items-center gap-2 text-sm">
          <AlertTriangle size={16} className="text-red-400" />
          <span>Cannot advance time while actions are pending</span>
        </div>
      )}

      <button
        onClick={onAdvanceTime}
        disabled={disabled || !gameState}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
      >
        <Clock size={16} />
        Advance Month
      </button>
    </div>
  );
};

export default TimeControlPanel;