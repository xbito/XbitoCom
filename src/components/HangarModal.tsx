import React, { useState, useEffect } from 'react';
import { Base, Facility, Vehicle, VehicleType, VehicleStatus } from '../types';
import { getHangarStatusReport, addVehicleToHangar } from '../data/hangar';
import { getVariantsByType, VEHICLE_TYPES, generateVehicle } from '../data/vehicles';
import BaseModal from './BaseModal';
import VehicleDetailModal from './VehicleDetailModal';
import { Shield, Wrench, Plane, Navigation, DollarSign } from 'lucide-react';

interface HangarModalProps {
  isOpen: boolean;
  onClose: () => void;
  base: Base;
  updateBase: (base: Base) => void;
  availableFunds: number;
  updateFunds: (newAmount: number) => void;
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
  const [activeTab, setActiveTab] = useState<'vehicles' | 'maintenance' | 'purchase'>('purchase');
  const [statusReport, setStatusReport] = useState<any>(null);

  useEffect(() => {
    // Find first hangar facility in the base
    if (isOpen && base.facilities) {
      const hangar = base.facilities.find(f => f.type === 'hangar');
      if (hangar) {
        // Ensure the hangar has a valid vehicle capacity
        if (!hangar.vehicleCapacity) {
          hangar.vehicleCapacity = 3; // Base capacity from FACILITY_TYPES
        }
        
        setSelectedFacility(hangar);
        
        // Calculate and set the status report immediately
        const report = getHangarStatusReport(hangar);
        setStatusReport(report);
        
        // Set default tab to vehicles only if there are vehicles
        setActiveTab(base.vehicles.length > 0 ? 'vehicles' : 'purchase');
      }
    }
  }, [isOpen, base.facilities]);

  // Handle selecting a vehicle
  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleDetailOpen(true);
  };

  // Get status report for the hangar - now just returns the stored report
  const getStatusReport = () => {
    if (!selectedFacility || selectedFacility.type !== 'hangar') {
      return null;
    }
    
    // Return the calculated status report
    return statusReport;
  };

  // Update the base after vehicle changes
  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    const updatedVehicles = base.vehicles.map(v => 
      v.id === updatedVehicle.id ? updatedVehicle : v);
    
    const updatedBase = { ...base, vehicles: updatedVehicles };
    updateBase(updatedBase);
  };

  // Update the hangar facility
  const handleUpdateHangar = (updatedHangar: Facility) => {
    const updatedFacilities = base.facilities.map(f => 
      f.id === updatedHangar.id ? updatedHangar : f);
    
    // Create a new base object with both updated facilities and vehicles
    const updatedBase = {
      ...base,
      facilities: updatedFacilities,
      vehicles: updatedHangar.type === 'hangar' ? updatedHangar.vehicles || [] : base.vehicles
    };
    
    updateBase(updatedBase);
    setSelectedFacility(updatedHangar);
    
    // Update the status report whenever the hangar changes
    if (updatedHangar.type === 'hangar') {
      const newReport = getHangarStatusReport(updatedHangar);
      setStatusReport(newReport);
    }
  };

  // Calculate available maintenance bays
  const getAvailableBays = () => {
    if (!selectedFacility) return 0;
    const maintenanceBays = selectedFacility.maintenanceBays || 0;
    const activeMaintenanceCount = selectedFacility.maintenanceQueue?.length || 0;
    return maintenanceBays - activeMaintenanceCount;
  };

  // Queue a vehicle for maintenance
  const queueForMaintenance = (vehicle: Vehicle, type: 'routine' | 'damage' | 'overhaul') => {
    if (!selectedFacility || selectedFacility.type !== 'hangar') return;
    
    import('../data/hangar').then(({ queueVehicleForMaintenance }) => {
      const result = queueVehicleForMaintenance(selectedFacility, vehicle.id, type);
      
      if (result.success) {
        // Update the vehicle status
        const updatedVehicle = { ...vehicle, status: 'maintenance' as VehicleStatus };
        handleUpdateVehicle(updatedVehicle);
        
        // Update the hangar
        handleUpdateHangar(result.hangar);
      }
    });
  };
  
  // Enhanced status indicator with tooltip
  const renderStatusIndicator = (status: VehicleStatus) => {
    const getStatusInfo = () => {
      switch (status) {
        case 'ready':
          return { color: 'bg-green-500', label: 'Ready for Mission' };
        case 'maintenance':
          return { color: 'bg-yellow-500', label: 'Under Maintenance' };
        case 'mission':
          return { color: 'bg-blue-500', label: 'On Mission' };
        case 'damaged':
          return { color: 'bg-red-500', label: 'Damaged - Needs Repair' };
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
    const hasCapacity = statusReport && statusReport.capacity.available > 0;
    
    if (!canAfford || !hasCapacity) return;

    const newVehicle = generateVehicle(variantKey, base.id);
    const result = addVehicleToHangar(selectedFacility, newVehicle);
    
    if (result.success) {
      // Deduct funds first
      updateFunds(availableFunds - variant.baseCost);
      
      // Update the hangar and base state
      handleUpdateHangar(result.hangar);
      
      // Switch to vehicles tab if this is the first vehicle
      if (base.vehicles.length === 0) {
        setActiveTab('vehicles');
      }
    }
  };

  return (
    <div className="relative">
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Hangar Management"
        width="lg"
      >
        <div className="flex flex-col h-full">
          {/* Tabs Navigation */}
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
                activeTab === 'maintenance' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              onClick={() => setActiveTab('maintenance')}
            >
              Maintenance
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

          {/* Hangar Status */}
          {selectedFacility && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-sm text-slate-400 mb-1">Capacity</h3>
                <p className="text-xl font-bold">
                  {statusReport?.capacity.used || 0}/{statusReport?.capacity.total || 0}
                </p>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-sm text-slate-400 mb-1">Maintenance Bays</h3>
                <p className="text-xl font-bold">
                  {statusReport?.maintenance.active || 0}/{statusReport?.maintenance.bays || 0}
                </p>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-sm text-slate-400 mb-1">Engineering Staff</h3>
                <p className="text-xl font-bold">{statusReport?.engineers || 0}</p>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-sm text-slate-400 mb-1">Hangar Level</h3>
                <p className="text-xl font-bold">{selectedFacility.level}</p>
              </div>
            </div>
          )}

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
                          <Wrench className="w-4 h-4 mr-2 text-yellow-400" />
                          <span>Condition: {vehicle.condition}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-slate-800 p-2 rounded">
                      <div>
                        <span className="text-slate-400">Crew:</span> {vehicle.crew.length}
                      </div>
                      <div>
                        <span className="text-slate-400">Weapons:</span> {vehicle.weapons.length}/{vehicle.hardpoints}
                      </div>
                      <div>
                        <span className="text-slate-400">Components:</span> {vehicle.components.length}/{vehicle.componentSlots}
                      </div>
                      <div>
                        <span className="text-slate-400">Monthly Cost:</span> ${vehicle.maintenance.toLocaleString()}
                      </div>
                    </div>

                    {/* Condition bar */}
                    <div className="mt-3">
                      <div className="w-full bg-slate-800 rounded-full h-2">
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

            {activeTab === 'maintenance' && (
              <div className="space-y-4">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Wrench className="text-yellow-400" size={20} />
                    Maintenance Queue
                  </h3>
                  {statusReport && statusReport.maintenance.queue.length > 0 ? (
                    <div className="space-y-2">
                      {statusReport.maintenance.queue.map(item => (
                        <div key={item.vehicleId} className="bg-slate-800 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <span className="font-semibold">{item.vehicleName}</span>
                            <span className="capitalize bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full text-xs">
                              {item.repairType}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="bg-slate-900 h-2 rounded-full">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs mt-1 text-slate-400">
                              <span>{item.progress}% Complete</span>
                              <span>
                                {item.timeRemaining < 1 
                                  ? 'Less than 1 hour remaining' 
                                  : `${Math.ceil(item.timeRemaining)} hours remaining`}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400">No vehicles currently in maintenance.</p>
                  )}
                </div>
                
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-bold mb-4">Available Vehicles</h3>
                  <div className="space-y-2">
                    {base.vehicles
                      .filter(vehicle => vehicle.status === 'ready' || vehicle.status === 'damaged')
                      .map(vehicle => (
                        <div key={vehicle.id} className="flex justify-between items-center bg-slate-800 p-4 rounded-lg">
                          <div className="flex items-center">
                            {renderStatusIndicator(vehicle.status)}
                            <span>{vehicle.name}</span>
                            {vehicle.status === 'damaged' && (
                              <span className="ml-2 text-red-400 text-xs">DAMAGED</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm">Condition: {vehicle.condition}%</span>
                            <button
                              disabled={getAvailableBays() <= 0}
                              onClick={() => queueForMaintenance(vehicle, vehicle.condition < 50 ? 'damage' : 'routine')}
                              className={`px-4 py-2 rounded flex items-center gap-2 ${
                                getAvailableBays() <= 0 
                                  ? 'bg-slate-600 cursor-not-allowed' 
                                  : 'bg-blue-500 hover:bg-blue-600'
                              }`}
                            >
                              <Wrench size={16} />
                              Send to Maintenance
                            </button>
                          </div>
                        </div>
                      ))}
                    {base.vehicles.filter(v => v.status === 'ready' || v.status === 'damaged').length === 0 && (
                      <p className="text-slate-400">No vehicles available for maintenance.</p>
                    )}
                  </div>
                </div>
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
                    const variants = getVariantsByType(type)
                      .filter(variantKey => {
                        const variant = VEHICLE_TYPES[variantKey];
                        if (!variant.researchRequired) return true;
                        return variant.researchRequired.every(r => completedResearch.includes(r));
                      });

                    return (
                      <div key={type} className="bg-slate-700 p-4 rounded-lg">
                        <h4 className="font-semibold capitalize mb-4 flex items-center gap-2">
                          <Plane className="text-blue-400" size={20} />
                          {type} Aircraft
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {variants.map(variantKey => {
                            const variant = VEHICLE_TYPES[variantKey];
                            const canAfford = availableFunds >= variant.baseCost;
                            const hasCapacity = statusReport && statusReport.capacity.available > 0;
                            
                            return (
                              <div key={variantKey} className="bg-slate-800 rounded-lg p-4">
                                <div className="flex justify-between">
                                  <h5 className="font-medium">{variant.name}</h5>
                                  <span className="text-sm font-semibold text-green-400">${variant.baseCost.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-slate-400 mt-1">{variant.description}</p>
                                
                                <div className="grid grid-cols-2 gap-x-4 mt-3 text-sm">
                                  <div className="text-slate-300"><span className="text-slate-400">Speed:</span> {variant.baseStats.speed}</div>
                                  <div className="text-slate-300"><span className="text-slate-400">Armor:</span> {variant.baseStats.armor}</div>
                                  <div className="text-slate-300"><span className="text-slate-400">Range:</span> {variant.baseStats.range}</div>
                                  <div className="text-slate-300"><span className="text-slate-400">Firepower:</span> {variant.baseStats.firepower}</div>
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
          availableFunds={availableFunds}
          updateFunds={updateFunds}
          completedResearch={completedResearch}
        />
      )}
    </div>
  );
};

export default HangarModal;