import React from 'react';
import { UFO } from '../types';
import { Radar, AlertTriangle, Shield, Zap, Navigation } from 'lucide-react';

interface UFODetailPanelProps {
  ufo: UFO;
  onClose?: () => void;
}

const UFODetailPanel: React.FC<UFODetailPanelProps> = ({ ufo, onClose }) => {
  return (
    <div className="fixed bottom-4 left-4 w-96 bg-black/90 border border-red-500/50 rounded-lg p-4 text-white shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-bold text-red-500 flex items-center gap-2">
          <Radar className="h-5 w-5" />
          {ufo.name}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ×
        </button>
      </div>

      <div className="space-y-4">
        {/* Status Section */}
        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="font-medium">Status:</span>
          <span className="text-red-400">{ufo.status}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-400" />
            <span>Armor: {ufo.armor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span>Weapons: {ufo.weapons}</span>
          </div>
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-green-400" />
            <span>Speed: {ufo.speed} km/h</span>
          </div>
        </div>

        {/* Trajectory Info */}
        {ufo.trajectory && (
          <div className="mt-4 text-sm">
            <div className="font-medium mb-1">Flight Path:</div>
            <div className="opacity-80">
              Crossing: {ufo.trajectory?.crossedContinents?.join(', ') || 'None'}
            </div>
            <div className="mt-1 opacity-80">
              Progress: {Math.round(ufo.trajectory.progress * 100)}%
            </div>
          </div>
        )}

        {/* Detection Info */}
        {ufo.detectedBy && (
          <div className="mt-4 text-sm">
            <div className="font-medium mb-1">Detection:</div>
            <div className="opacity-80">
              First detected by Base: {ufo.detectedBy}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UFODetailPanel;