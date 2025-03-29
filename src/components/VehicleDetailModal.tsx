import React, { useState } from 'react';
import { Vehicle, Base, Personnel, PersonnelStatus } from '../types';
import { calculateVehiclePerformance } from '../data/vehicles';
import BaseModal from './BaseModal';
import ConfirmationDialog from './ConfirmationDialog';
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'assign' | 'remove';
    personnel: Personnel;
  } | null>(null);

  // Get performance modifiers based on crew
  const performanceModifiers = calculateVehiclePerformance(vehicle);

  // Get available personnel for assignment
  const availablePersonnel = base.personnel.filter(p => {
    return (p.role === 'pilot' || p.role === 'soldier' || p.role === 'engineer' || p.role === 'medic') && 
           p.status === 'available' && 
           p.assignedVehicleId === null;
  });

  // Handle crew assignment with confirmation
  const handleAssignPersonnel = (personnel: Personnel) => {
    setPendingAction({ type: 'assign', personnel });
    setShowConfirmation(true);
  };

  // Handle crew removal with confirmation
  const handleRemovePersonnel = (personnelId: string) => {
    const personnel = vehicle.crew.find(p => p.id === personnelId);
    if (personnel) {
      setPendingAction({ type: 'remove', personnel });
      setShowConfirmation(true);
    }
  };

  // Execute the pending action after confirmation
  const handleConfirmAction = () => {
    if (!pendingAction) return;

    try {
      if (!pendingAction.personnel || !pendingAction.personnel.id) {
        throw new Error('Invalid personnel data');
      }
      
      if (pendingAction.type === 'assign') {
        const updatedVehicle: Vehicle = {
          ...vehicle,
          crew: [...vehicle.crew, {
            ...pendingAction.personnel,
            status: 'working' as PersonnelStatus,
            assignedVehicleId: vehicle.id
          }]
        };
        updateVehicle(updatedVehicle);
      } else {
        const updatedVehicle: Vehicle = {
          ...vehicle,
          crew: vehicle.crew.filter(p => p.id !== pendingAction.personnel.id)
        };
        updateVehicle(updatedVehicle);
      }
    } catch (error) {
      console.error('Failed to update vehicle crew:', error);
      alert('An error occurred while updating vehicle crew');
    }

    setShowConfirmation(false);
    setPendingAction(null);
  };

  return (
    <>
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
                  ? 'bg-green-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              } transition-colors`}
              onClick={() => setActiveTab('info')}
            >
              Info
            </button>
            <button
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === 'crew' 
                  ? 'bg-green-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              } transition-colors`}
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
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg mb-4 border border-slate-700">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Plane className="text-green-400" size={20} />
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
                        <div className="w-full bg-slate-900 rounded-full h-2 mt-1">
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
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg mb-4 border border-slate-700">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Shield className="text-green-400" size={20} />
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
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Users className="text-green-400" size={20} />
                    Current Crew
                  </h3>
                  {vehicle.crew.length > 0 ? (
                    <div className="space-y-2">
                      {vehicle.crew.map(personnel => (
                        <div key={personnel.id} className="bg-slate-900 rounded-lg p-3 flex justify-between items-center border border-slate-800">
                          <div>
                            <div className="font-medium text-slate-200">{personnel.name}</div>
                            <div className="text-sm text-slate-400 capitalize">
                              {personnel.role} - Experience: {personnel.experience}
                            </div>
                            {personnel.role === 'pilot' && personnel.vehicleSpecialization && (
                              <div className="text-xs text-green-400">
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
                            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
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
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Users className="text-green-400" size={20} />
                    Available Personnel
                  </h3>
                  {availablePersonnel.length > 0 ? (
                    <div className="space-y-2">
                      {availablePersonnel.map(personnel => (
                        <div key={personnel.id} className="bg-slate-900 rounded-lg p-3 flex justify-between items-center border border-slate-800">
                          <div>
                            <div className="font-medium text-slate-200">{personnel.name}</div>
                            <div className="text-sm text-slate-400 capitalize">
                              {personnel.role} - Experience: {personnel.experience}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleAssignPersonnel(personnel)}
                            className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
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

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setPendingAction(null);
        }}
        onConfirm={handleConfirmAction}
        title={pendingAction?.type === 'assign' ? 'Confirm Assignment' : 'Confirm Removal'}
        message={
          pendingAction?.type === 'assign'
            ? `Are you sure you want to assign ${pendingAction.personnel.name} to ${vehicle.name}?`
            : `Are you sure you want to remove ${pendingAction?.personnel.name} from ${vehicle.name}?`
        }
        confirmText={pendingAction?.type === 'assign' ? 'Assign' : 'Remove'}
      />
    </>
  );
};

export default VehicleDetailModal;