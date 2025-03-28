import React from 'react';
import { GameState } from '../types';
import { Building2, Users, Microscope, Shield } from 'lucide-react';

interface ResourcePanelProps {
  gameState: GameState;
}

const ResourcePanel: React.FC<ResourcePanelProps> = ({ gameState }) => {
  // Calculate total personnel (available + assigned)
  const calculateTotalPersonnel = () => {
    let total = gameState?.availablePersonnel?.length || 0;
    
    // Add personnel assigned to bases
    gameState?.bases?.forEach(base => {
      base.personnel.forEach(() => total++);
      
      // Add personnel assigned to facilities
      base.facilities.forEach(facility => {
        total += facility.personnel.length;
      });
      
      // Add personnel assigned to vehicles
      base.vehicles.forEach(vehicle => {
        total += vehicle.crew.length;
      });
    });
    
    return total;
  };
  
  const availablePersonnel = gameState?.availablePersonnel?.length || 0;
  const totalPersonnel = calculateTotalPersonnel();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-700 shadow-lg">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-4 gap-4">
          <ResourceCard
            icon={<Building2 className="text-teal-400" />}
            title="Bases"
            value={gameState && gameState.bases ? gameState.bases.length : 0}
            description="Active installations"
          />
          <ResourceCard
            icon={<Users className="text-yellow-400" />}
            title="Personnel"
            value={`${availablePersonnel} / ${totalPersonnel}`}
            description="Available / Total agents"
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
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 shadow-md hover:shadow-lg">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h3 className="text-lg font-semibold text-teal-300 font-mono">{title}</h3>
          <p className="text-2xl font-bold text-teal-400 font-mono">{value}</p>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ResourcePanel;