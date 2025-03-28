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
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-4 gap-4">
          <ResourceCard
            icon={<Building2 className="text-teal-400" size={20} />}
            title="Global Network"
            value={gameState && gameState.bases ? gameState.bases.length : 0}
            description="Active Installations"
            bgColor="from-teal-500/5 to-transparent"
            iconBg="bg-teal-500/10"
          />
          <ResourceCard
            icon={<Users className="text-yellow-400" size={20} />}
            title="Personnel Status"
            value={`${availablePersonnel} / ${totalPersonnel}`}
            description="Available / Total Agents"
            bgColor="from-yellow-500/5 to-transparent"
            iconBg="bg-yellow-500/10"
          />
          <ResourceCard
            icon={<Microscope className="text-purple-400" size={20} />}
            title="Research Progress"
            value={gameState && gameState.research !== undefined ? `${gameState.research}%` : '0%'}
            description="Current Project Status"
            bgColor="from-purple-500/5 to-transparent"
            iconBg="bg-purple-500/10"
          />
          <ResourceCard
            icon={<Shield className="text-red-400" size={20} />}
            title="Threat Analysis"
            value={gameState && gameState.threatLevel !== undefined ? gameState.threatLevel : 0}
            description="Global Alert Status"
            bgColor="from-red-500/5 to-transparent"
            iconBg="bg-red-500/10"
          />
        </div>
      </div>
      
      {/* Overlay gradient for better blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none" />
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
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  icon, 
  title, 
  value, 
  description,
  bgColor,
  iconBg
}) => {
  return (
    <div className={`bg-gradient-to-r ${bgColor} backdrop-blur-sm rounded-lg p-4 border border-slate-700/50`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-300 font-mono uppercase tracking-wide">{title}</h3>
          <p className="text-2xl font-bold font-mono tracking-wider bg-gradient-to-r from-white to-slate-300 text-transparent bg-clip-text">
            {value}
          </p>
          <p className="text-xs text-slate-400 font-mono">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ResourcePanel;