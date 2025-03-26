import React, { useState } from 'react';
import { Vehicle, Base, Personnel, PersonnelStatus } from '../types';
import {
  calculateVehiclePerformance,
} from '../data/vehicles';
import BaseModal from './BaseModal';
import { Shield, Plane, Users } from 'lucide-react';

interface VehicleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  base: Base;
  updateVehicle: (vehicle: Vehicle) => void;
}

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  base,
  updateVehicle
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'crew'>('info');

  // Get performance modifiers based on crew
  const performanceModifiers = calculateVehiclePerformance(vehicle);

  // Get available personnel for assignment
  const availablePersonnel = base.personnel.filter(p => {
    return (p.role === 'pilot' || p.role === 'soldier' || p.role === 'engineer' || p.role === 'medic') && 
           p.status === 'available' && 
           p.assignedVehicleId === null;
  });

  // Handle crew assignment
  const handleAssignPersonnel = (personnel: Personnel) => {
    // Update the vehicle's crew with the updated personnel
    const updatedVehicle: Vehicle = {
      ...vehicle,
      crew: [...vehicle.crew, {
        ...personnel,
        status: 'working' as PersonnelStatus,
        assignedVehicleId: vehicle.id
      }]
    };

    // Update the vehicle (this should also update the base)
    updateVehicle(updatedVehicle);
  };

  // Handle crew removal
  const handleRemovePersonnel = (personnelId: string) => {
    // Find the personnel in the vehicle's crew
    const personnel = vehicle.crew.find(p => p.id === personnelId);
    if (!personnel) return;

    // Update the vehicle's crew, removing the personnel
    const updatedVehicle: Vehicle = {
      ...vehicle,
      crew: vehicle.crew.filter(p => p.id !== personnelId)
    };

    // Update the vehicle (this should also update the base)
    updateVehicle(updatedVehicle);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicle.name}
      width="lg"
    >
      <div className="flex flex-col h-full">
        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-700 mb-4">
          <button
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === 'info' 
                ? 'bg-blue-500 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('info')}
          >
            Info
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === 'crew' 
                ? 'bg-blue-500 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('crew')}
          >
            Crew
          </button>
        </div>
        
        {/* Content area */}
        <div className="flex-grow overflow-y-auto">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div>
                <div className="bg-slate-700 p-4 rounded-lg mb-4">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Plane className="text-blue-400" size={20} />
                    Vehicle Information
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-slate-400">Type:</div>
                    <div className="text-slate-200 font-medium capitalize">{vehicle.type}</div>
                    
                    <div className="text-slate-400">Status:</div>
                    <div className="text-slate-200 font-medium capitalize">{vehicle.status}</div>
                    
                    <div className="text-slate-400">Condition:</div>
                    <div className="text-slate-200 font-medium">
                      {vehicle.condition}%
                      <div className="w-full bg-slate-800 rounded-full h-2 mt-1">
                        <div 
                          className={`${
                            vehicle.condition < 30 ? 'bg-red-500' : 
                            vehicle.condition < 70 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          } h-2 rounded-full transition-all duration-300`} 
                          style={{ width: `${vehicle.condition}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-slate-400">Crew Size:</div>
                    <div className="text-slate-200 font-medium">{vehicle.crew.length}</div>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div>
                <div className="bg-slate-700 p-4 rounded-lg mb-4">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Shield className="text-blue-400" size={20} />
                    Vehicle Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-slate-400">Speed:</div>
                    <div className="text-slate-200 font-medium">
                      {vehicle.stats.speed} 
                      <span className="text-xs text-slate-400 ml-2">
                        (x{performanceModifiers.speedModifier.toFixed(2)})
                      </span>
                    </div>
                    
                    <div className="text-slate-400">Armor:</div>
                    <div className="text-slate-200 font-medium">{vehicle.stats.armor}</div>
                    
                    <div className="text-slate-400">Range:</div>
                    <div className="text-slate-200 font-medium">
                      {vehicle.stats.range}
                      <span className="text-xs text-slate-400 ml-2">
                        (x{performanceModifiers.rangeModifier.toFixed(2)})
                      </span>
                    </div>
                    
                    <div className="text-slate-400">Capacity:</div>
                    <div className="text-slate-200 font-medium">{vehicle.stats.capacity}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Crew Tab */}
          {activeTab === 'crew' && (
            <div className="space-y-6">
              {/* Current crew */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Users className="text-blue-400" size={20} />
                  Current Crew
                </h3>
                {vehicle.crew.length > 0 ? (
                  <div className="space-y-2">
                    {vehicle.crew.map(personnel => (
                      <div key={personnel.id} className="bg-slate-800 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium text-slate-200">{personnel.name}</div>
                          <div className="text-sm text-slate-400 capitalize">
                            {personnel.role} - Experience: {personnel.experience}
                          </div>
                          {personnel.role === 'pilot' && personnel.vehicleSpecialization && (
                            <div className="text-xs text-blue-400">
                              {personnel.vehicleSpecialization.vehicleType === vehicle.type && (
                                <span>
                                  Specialized in this vehicle ({personnel.vehicleSpecialization.proficiency}% proficiency)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleRemovePersonnel(personnel.id)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No crew assigned to this vehicle.</p>
                )}
              </div>
              
              {/* Available personnel */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Users className="text-green-400" size={20} />
                  Available Personnel
                </h3>
                {availablePersonnel.length > 0 ? (
                  <div className="space-y-2">
                    {availablePersonnel.map(personnel => (
                      <div key={personnel.id} className="bg-slate-800 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium text-slate-200">{personnel.name}</div>
                          <div className="text-sm text-slate-400 capitalize">
                            {personnel.role} - Experience: {personnel.experience}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleAssignPersonnel(personnel)}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Assign
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No available personnel to assign.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default VehicleDetailModal;