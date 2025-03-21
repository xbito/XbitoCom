import React from 'react';
import { GameState } from '../types';
import { Building2, Users, Microscope, Shield } from 'lucide-react';

interface ResourcePanelProps {
  gameState: GameState;
}

const ResourcePanel: React.FC<ResourcePanelProps> = ({ gameState }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-4 gap-4">
          <ResourceCard
            icon={<Building2 className="text-blue-400" />}
            title="Bases"
            value={gameState && gameState.bases ? gameState.bases.length : 0}
            description="Active installations"
          />
          <ResourceCard
            icon={<Users className="text-yellow-400" />}
            title="Personnel"
            value={gameState && gameState.personnel ? gameState.personnel : 0}
            description="Available agents"
          />
          <ResourceCard
            icon={<Microscope className="text-purple-400" />}
            title="Research"
            value={gameState && gameState.research !== undefined ? `${gameState.research}%` : '0%'}
            description="Current project progress"
          />
          <ResourceCard
            icon={<Shield className="text-red-400" />}
            title="Threat Level"
            value={gameState && gameState.threatLevel !== undefined ? gameState.threatLevel : 0}
            description="Global alert status"
          />
        </div>
      </div>
    </div>
  );
};

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  description: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ icon, title, value, description }) => {
  return (
    <div className="bg-slate-700 rounded-lg p-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ResourcePanel;