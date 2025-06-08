import React from 'react';
import { GameState } from '../types';
import { Building2, Users, Microscope, Shield } from 'lucide-react';

interface ResourcePanelProps {
  gameState: GameState;
}

const ResourcePanel: React.FC<ResourcePanelProps> = ({ gameState }) => {
  // Calculate total personnel (available + assigned) without double counting
  const calculateTotalPersonnel = () => {
    const ids = new Set<string>();

    // Available personnel not attached to any base yet
    gameState?.availablePersonnel?.forEach(p => ids.add(p.id));

    gameState?.bases?.forEach(base => {
      // Personnel assigned directly to the base
      base.personnel.forEach(p => ids.add(p.id));

      // Personnel assigned to facilities
      base.facilities.forEach(facility => {
        facility.personnel.forEach(p => ids.add(p.id));
      });

      // Personnel assigned to vehicles
      base.vehicles.forEach(vehicle => {
        vehicle.crew.forEach(p => ids.add(p.id));
      });
    });

    return ids.size;
  };
  
  const availablePersonnel = gameState?.availablePersonnel?.length || 0;
  const totalPersonnel = calculateTotalPersonnel();

  // Runtime validation
  if (typeof availablePersonnel !== 'number') {
    throw new Error('Available personnel must be a number');
  }
  if (typeof totalPersonnel !== 'number') {
    throw new Error('Total personnel must be a number');
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-4 gap-4">
          <ResourceCard
            icon={<Building2 className="text-green-400" size={20} />}
            title="Global Network"
            value={gameState && gameState.bases ? gameState.bases.length : 0}
            description="Active Installations"
            bgColor="from-green-900/20 to-gray-950"
            iconBg="bg-green-900/30"
            textColor="text-green-300"
          />
          <ResourceCard
            icon={<Users className="text-green-400" size={20} />}
            title="Personnel Status"
            value={`${availablePersonnel} / ${totalPersonnel}`}
            description="Available / Total Agents"
            bgColor="from-green-900/20 to-gray-950"
            iconBg="bg-green-900/30"
            textColor="text-green-300"
          />
          <ResourceCard
            icon={<Microscope className="text-green-400" size={20} />}
            title="Research Progress"
            value={gameState && gameState.research !== undefined ? `${gameState.research}%` : '0%'}
            description="Current Project Status"
            bgColor="from-green-900/20 to-gray-950"
            iconBg="bg-green-900/30"
            textColor="text-green-300"
          />
          <ResourceCard
            icon={<Shield className="text-red-400" size={20} />}
            title="Threat Analysis"
            value={gameState && gameState.threatLevel !== undefined ? gameState.threatLevel : 0}
            description="Global Alert Status"
            bgColor="from-red-900/20 to-gray-950"
            iconBg="bg-red-900/30"
            textColor="text-red-300"
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
  bgColor: string;
  iconBg: string;
  textColor: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  icon, 
  title, 
  value, 
  description,
  bgColor,
  iconBg,
  textColor
}) => {
  return (
    <div className={`bg-gradient-to-r ${bgColor} backdrop-blur-sm rounded-lg p-4 border border-gray-800 shadow-lg shadow-black/50`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center glow-sm`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-sm font-medium ${textColor} font-mono uppercase tracking-wide`}>{title}</h3>
          <p className="text-2xl font-bold font-mono tracking-wider text-white glow-text">
            {value}
          </p>
          <p className="text-xs text-gray-400 font-mono">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ResourcePanel;