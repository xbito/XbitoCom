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
    // Runtime validation
    if (!(date instanceof Date)) {
      throw new Error('Date must be a valid Date object');
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  };

  return (
    <div className="fixed bottom-24 right-4 bg-gradient-to-b from-gray-900 to-gray-950 rounded-lg border border-gray-800 shadow-lg p-4 w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-900/30 rounded flex items-center justify-center glow-sm">
            <Clock className="text-green-400" size={16} />
          </div>
          <h3 className="font-mono text-green-300">Time Control</h3>
        </div>
        <div className="font-mono text-lg text-green-400 tracking-wider glow-text">
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
        className="w-full bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 
                  disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed
                  text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2
                  shadow-lg shadow-green-900/30 hover:shadow-green-800/40 transition-all duration-200"
      >
        <Clock size={16} />
        Advance Month
      </button>
    </div>
  );
};

export default TimeControlPanel;