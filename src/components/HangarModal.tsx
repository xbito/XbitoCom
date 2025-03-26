import React, { useState, useEffect } from 'react';
import { Base, Facility, Vehicle, VehicleType, VehicleStatus } from '../types';
import { VEHICLE_TYPES, generateVehicle } from '../data/vehicles';
import BaseModal from './BaseModal';
import VehicleDetailModal from './VehicleDetailModal';
import { Shield, Plane, Navigation, DollarSign } from 'lucide-react';

interface HangarModalProps {
  isOpen: boolean;
  onClose: () => void;
  base: Base;
  updateBase: (base: Base) => void;
  availableFunds: number;
  updateFunds: (amount: number) => void;
  completedResearch: string[];
}

const HangarModal: React.FC<HangarModalProps> = ({
  isOpen,
  onClose,
  base,
  updateBase,
  availableFunds,
  updateFunds,
  completedResearch,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [vehicleDetailOpen, setVehicleDetailOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'purchase'>('purchase');

  // Initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      const hangar = base.facilities.find(f => f.type === 'hangar');
      setSelectedFacility(hangar || null);
    }
  }, [isOpen, base]);

  // Handle selecting a vehicle
  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleDetailOpen(true);
  };

  // Update the base after vehicle changes
  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    const updatedVehicles = base.vehicles.map(v => 
      v.id === updatedVehicle.id ? updatedVehicle : v);
    
    const updatedBase = { ...base, vehicles: updatedVehicles };
    updateBase(updatedBase);
  };

  // Get available capacity
  const getAvailableCapacity = () => {
    if (!selectedFacility) return 0;
    const capacity = selectedFacility.vehicleCapacity || 0;
    const used = base.vehicles.length;
    return capacity - used;
  };

  // Enhanced status indicator with tooltip
  const renderStatusIndicator = (status: VehicleStatus) => {
    const getStatusInfo = () => {
      switch (status) {
        case 'ready':
          return { color: 'bg-green-500', label: 'Ready for Mission' };
        case 'mission':
          return { color: 'bg-blue-500', label: 'On Mission' };
        case 'damaged':
          return { color: 'bg-red-500', label: 'Damaged' };
        default:
          return { color: 'bg-gray-500', label: 'Unknown Status' };
      }
    };

    const statusInfo = getStatusInfo();
    return (
      <div className="group relative inline-block">
        <span className={`inline-block w-3 h-3 rounded-full ${statusInfo.color} mr-2`}></span>
        <span className="hidden group-hover:block absolute z-10 bg-slate-800 text-white text-xs rounded p-1 -mt-8">
          {statusInfo.label}
        </span>
      </div>
    );
  };

  // Purchase vehicle handler
  const handlePurchaseVehicle = (variantKey: string, variant: typeof VEHICLE_TYPES[string]) => {
    if (!selectedFacility) return;
    
    const canAfford = availableFunds >= variant.baseCost;
    const hasCapacity = getAvailableCapacity() > 0;
    
    if (!canAfford || !hasCapacity) {
      return;
    }

    const newVehicle = generateVehicle(variantKey, base.id);
    const updatedVehicles = [...base.vehicles, newVehicle];
    
    // Update base and funds
    updateFunds(availableFunds - variant.baseCost);
    updateBase({
      ...base,
      vehicles: updatedVehicles
    });
    
    // Switch to vehicles tab if this is the first vehicle
    if (base.vehicles.length === 0) {
      setActiveTab('vehicles');
    }
  };

  return (
    <div>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Vehicle Management"
        width="2xl"
      >
        <div className="flex flex-col h-full">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-700 mb-4">
            <button
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === 'vehicles' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              onClick={() => setActiveTab('vehicles')}
            >
              Vehicles
            </button>
            <button
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === 'purchase' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              onClick={() => setActiveTab('purchase')}
            >
              Purchase
            </button>
          </div>

          {/* Content area */}
          <div className="flex-grow overflow-y-auto">
            {activeTab === 'vehicles' && base.vehicles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {base.vehicles.map(vehicle => (
                  <div 
                    key={vehicle.id} 
                    className="bg-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-600 transition-colors duration-200"
                    onClick={() => handleSelectVehicle(vehicle)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg flex items-center">
                        {renderStatusIndicator(vehicle.status)}
                        {vehicle.name}
                        {vehicle.status === 'damaged' && (
                          <span className="ml-2 text-red-400 text-sm font-normal">DAMAGED</span>
                        )}
                      </h3>
                      <span className="capitalize bg-slate-600 px-2 py-1 rounded text-sm">
                        {vehicle.type}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Shield className="w-4 h-4 mr-2 text-blue-400" />
                          <span>Armor: {vehicle.stats.armor}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Navigation className="w-4 h-4 mr-2 text-green-400" />
                          <span>Speed: {vehicle.stats.speed}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Plane className="w-4 h-4 mr-2 text-purple-400" />
                          <span>Range: {vehicle.stats.range}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="text-yellow-400">Crew: {vehicle.crew.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'vehicles' && base.vehicles.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 bg-slate-700 rounded-lg p-6">
                <p className="text-slate-400 mb-4">No vehicles available. Purchase vehicles in the Purchase tab.</p>
                <button
                  onClick={() => setActiveTab('purchase')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <DollarSign size={16} />
                  Go to Purchase
                </button>
              </div>
            )}

            {activeTab === 'purchase' && (
              <div>
                <div className="flex justify-between items-center mb-4 bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-bold flex items-center gap-2">
                    <DollarSign className="text-green-400" size={20} />
                    Purchase New Vehicles
                  </h3>
                  <span className="text-green-400 font-bold">${availableFunds.toLocaleString()}</span>
                </div>
                
                <div className="space-y-6">
                  {(['interceptor', 'transport', 'scout'] as VehicleType[]).map((type) => {
                    const variants = Object.entries(VEHICLE_TYPES)
                      .filter(([_, variant]) => {
                        if (variant.type !== type) return false;
                        if (!variant.researchRequired) return true;
                        return variant.researchRequired.every(r => completedResearch.includes(r));
                      });

                    if (variants.length === 0) return null;

                    return (
                      <div key={type} className="bg-slate-700 rounded-lg p-4">
                        <h4 className="font-bold mb-3 capitalize">{type} Aircraft</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {variants.map(([variantKey, variant]) => {
                            const canAfford = availableFunds >= variant.baseCost;
                            const hasCapacity = getAvailableCapacity() > 0;

                            return (
                              <div key={variantKey} className="bg-slate-800 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="font-bold text-lg">{variant.name}</h5>
                                  <span className="text-green-400">${variant.baseCost.toLocaleString()}</span>
                                </div>
                                
                                <p className="text-sm text-slate-400 mb-3">{variant.description}</p>
                                
                                <div className="grid grid-cols-2 gap-x-4 mt-3 text-sm">
                                  <div className="text-slate-300"><span className="text-slate-400">Speed:</span> {variant.baseStats.speed}</div>
                                  <div className="text-slate-300"><span className="text-slate-400">Armor:</span> {variant.baseStats.armor}</div>
                                  <div className="text-slate-300"><span className="text-slate-400">Range:</span> {variant.baseStats.range}</div>
                                  <div className="text-slate-300"><span className="text-slate-400">Capacity:</span> {variant.baseStats.capacity}</div>
                                </div>
                                
                                <button
                                  disabled={!canAfford || !hasCapacity}
                                  onClick={() => handlePurchaseVehicle(variantKey, variant)}
                                  className={`w-full mt-4 py-2 rounded flex items-center justify-center gap-2 ${
                                    canAfford && hasCapacity
                                      ? 'bg-green-500 hover:bg-green-600 text-white'
                                      : 'bg-slate-600 cursor-not-allowed'
                                  }`}
                                >
                                  <DollarSign size={16} />
                                  {!canAfford 
                                    ? 'Insufficient Funds' 
                                    : !hasCapacity
                                      ? 'No Hangar Space'
                                      : 'Purchase'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </BaseModal>

      {selectedVehicle && (
        <VehicleDetailModal
          isOpen={vehicleDetailOpen}
          onClose={() => setVehicleDetailOpen(false)}
          vehicle={selectedVehicle}
          base={base}
          updateVehicle={(updatedVehicle) => {
            handleUpdateVehicle(updatedVehicle);
            setSelectedVehicle(updatedVehicle);
          }}
        />
      )}
    </div>
  );
};

export default HangarModal;