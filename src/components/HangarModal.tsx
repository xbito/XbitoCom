import React, { useState, useEffect } from 'react';
import { Base, Facility, Vehicle, Personnel, VehicleType } from '../types';
import { getHangarStatusReport } from '../data/hangar';
import { getVariantsByType, getAvailableUpgrades } from '../data/vehicles';
import BaseModal from './BaseModal';
import VehicleDetailModal from './VehicleDetailModal';

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
  const [activeTab, setActiveTab] = useState<'vehicles' | 'maintenance' | 'purchase'>('vehicles');

  useEffect(() => {
    // Find first hangar facility in the base
    if (isOpen && base.facilities) {
      const hangar = base.facilities.find(f => f.type === 'hangar');
      if (hangar) {
        setSelectedFacility(hangar);
      }
    }
  }, [isOpen, base.facilities]);

  // Handle selecting a vehicle
  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleDetailOpen(true);
  };

  // Get status report for the hangar
  const getStatusReport = () => {
    if (!selectedFacility || selectedFacility.type !== 'hangar') {
      return null;
    }
    return getHangarStatusReport(selectedFacility);
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
    
    const updatedBase = { ...base, facilities: updatedFacilities };
    updateBase(updatedBase);
    setSelectedFacility(updatedHangar);
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
    
    // Import needed but use dynamic import for laziness
    import('../data/hangar').then(({ queueVehicleForMaintenance }) => {
      const result = queueVehicleForMaintenance(selectedFacility, vehicle.id, type);
      
      if (result.success) {
        // Update the vehicle status
        const updatedVehicle = { ...vehicle, status: 'maintenance' };
        handleUpdateVehicle(updatedVehicle);
        
        // Update the hangar
        handleUpdateHangar(result.hangar);
      }
    });
  };
  
  // Render vehicle status indicators
  const renderStatusIndicator = (status: string) => {
    switch (status) {
      case 'ready':
        return <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>;
      case 'maintenance':
        return <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>;
      case 'mission':
        return <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>;
      case 'damaged':
        return <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>;
      default:
        return <span className="inline-block w-3 h-3 rounded-full bg-gray-500 mr-2"></span>;
    }
  };

  // Render condition bar
  const renderConditionBar = (condition: number) => {
    let color = 'bg-green-500';
    if (condition < 30) color = 'bg-red-500';
    else if (condition < 70) color = 'bg-yellow-500';
    
    return (
      <div className="w-full bg-gray-300 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${condition}%` }}></div>
      </div>
    );
  };

  const statusReport = getStatusReport();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Hangar - ${base.name}`}
      width="lg"
    >
      <div className="flex flex-col h-full">
        {/* Tabs Navigation */}
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'vehicles' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('vehicles')}
          >
            Vehicles
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'maintenance' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('maintenance')}
          >
            Maintenance
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'purchase' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('purchase')}
          >
            Purchase
          </button>
        </div>

        {/* Hangar Status */}
        {selectedFacility && (
          <div className="flex justify-between p-2 bg-gray-100 text-sm">
            <div>
              <span className="font-bold">Capacity:</span>{' '}
              {statusReport?.capacity.used || 0}/{statusReport?.capacity.total || 0}
            </div>
            <div>
              <span className="font-bold">Maintenance Bays:</span>{' '}
              {statusReport?.maintenance.active || 0}/{statusReport?.maintenance.bays || 0}
            </div>
            <div>
              <span className="font-bold">Engineering Staff:</span>{' '}
              {statusReport?.engineers || 0}
            </div>
            <div>
              <span className="font-bold">Level:</span>{' '}
              {selectedFacility.level}
            </div>
          </div>
        )}

        {/* Content area */}
        <div className="flex-grow overflow-y-auto p-4">
          {activeTab === 'vehicles' && base.vehicles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {base.vehicles.map(vehicle => (
                <div 
                  key={vehicle.id} 
                  className="border rounded p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelectVehicle(vehicle)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center">
                      {renderStatusIndicator(vehicle.status)}
                      {vehicle.name}
                    </h3>
                    <span className="capitalize bg-gray-200 px-2 py-1 rounded text-sm">
                      {vehicle.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <div><span className="font-semibold">Crew:</span> {vehicle.crew.length}</div>
                      <div><span className="font-semibold">Weapons:</span> {vehicle.weapons.length}/{vehicle.hardpoints}</div>
                    </div>
                    <div>
                      <div><span className="font-semibold">Speed:</span> {vehicle.stats.speed}</div>
                      <div><span className="font-semibold">Range:</span> {vehicle.stats.range}</div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Condition</span>
                      <span>{vehicle.condition}%</span>
                    </div>
                    {renderConditionBar(vehicle.condition)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'vehicles' && base.vehicles.length === 0 && (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500">No vehicles available. Purchase vehicles in the Purchase tab.</p>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded">
                <h3 className="font-bold">Maintenance Queue</h3>
                {statusReport && statusReport.maintenance.queue.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {statusReport.maintenance.queue.map(item => {
                      const vehicle = base.vehicles.find(v => v.id === item.vehicleId);
                      return (
                        <div key={item.vehicleId} className="bg-white p-2 border rounded">
                          <div className="flex justify-between">
                            <span className="font-semibold">{item.vehicleName}</span>
                            <span className="capitalize bg-yellow-100 px-2 py-0.5 rounded-full text-xs">
                              {item.repairType}
                            </span>
                          </div>
                          <div className="mt-1">
                            <div className="bg-gray-200 h-2 rounded-full">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                              <span>{item.progress}% Complete</span>
                              <span>
                                {item.timeRemaining < 1 
                                  ? 'Less than 1 hour remaining' 
                                  : `${Math.ceil(item.timeRemaining)} hours remaining`}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No vehicles currently in maintenance.</p>
                )}
              </div>
              
              <div>
                <h3 className="font-bold">Available Vehicles</h3>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {base.vehicles
                    .filter(vehicle => vehicle.status === 'ready' || vehicle.status === 'damaged')
                    .map(vehicle => (
                      <div key={vehicle.id} className="flex justify-between items-center border p-2 rounded">
                        <div className="flex items-center">
                          {renderStatusIndicator(vehicle.status)}
                          <span>{vehicle.name}</span>
                          {vehicle.status === 'damaged' && (
                            <span className="ml-2 text-red-500 text-xs">DAMAGED</span>
                          )}
                        </div>
                        <div className="flex">
                          <span className="text-sm mr-2">Condition: {vehicle.condition}%</span>
                          <button
                            disabled={getAvailableBays() <= 0}
                            onClick={() => queueForMaintenance(vehicle, vehicle.condition < 50 ? 'damage' : 'routine')}
                            className={`px-3 py-1 text-xs rounded ${
                              getAvailableBays() <= 0 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            Send to Maintenance
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {base.vehicles.filter(v => v.status === 'ready' || v.status === 'damaged').length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">No vehicles available for maintenance.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'purchase' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Purchase New Vehicles</h3>
                <span className="text-sm">Available Funds: ${availableFunds.toLocaleString()}</span>
              </div>
              
              <div className="space-y-6">
                {['interceptor', 'transport', 'scout'].map((type: string) => {
                  const variants = getVariantsByType(type as VehicleType)
                    .filter(variantKey => {
                      const variant = require('../data/vehicles').VEHICLE_TYPES[variantKey];
                      if (!variant.researchRequired) return true;
                      return variant.researchRequired.every(r => completedResearch.includes(r));
                    });

                  return (
                    <div key={type} className="border-t pt-4">
                      <h4 className="font-semibold capitalize mb-2">{type} Aircraft</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {variants.map(variantKey => {
                          const variant = require('../data/vehicles').VEHICLE_TYPES[variantKey];
                          const canAfford = availableFunds >= variant.baseCost;
                          const hasCapacity = statusReport && statusReport.capacity.available > 0;
                          
                          return (
                            <div key={variantKey} className="border rounded p-3">
                              <div className="flex justify-between">
                                <h5 className="font-medium">{variant.name}</h5>
                                <span className="text-sm font-semibold">${variant.baseCost.toLocaleString()}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{variant.description}</p>
                              
                              <div className="grid grid-cols-2 gap-x-4 mt-2 text-xs">
                                <div><span className="font-semibold">Speed:</span> {variant.baseStats.speed}</div>
                                <div><span className="font-semibold">Armor:</span> {variant.baseStats.armor}</div>
                                <div><span className="font-semibold">Range:</span> {variant.baseStats.range}</div>
                                <div><span className="font-semibold">Firepower:</span> {variant.baseStats.firepower}</div>
                              </div>
                              
                              <div className="mt-3">
                                <button
                                  disabled={!canAfford || !hasCapacity}
                                  onClick={() => {
                                    // Purchase logic - would need to implement
                                    const newVehicle = require('../data/vehicles')
                                      .generateVehicle(variantKey, base.id);
                                      
                                    // Update base with new vehicle
                                    updateBase({
                                      ...base,
                                      vehicles: [...base.vehicles, newVehicle]
                                    });
                                    
                                    // Deduct funds
                                    updateFunds(availableFunds - variant.baseCost);
                                  }}
                                  className={`w-full py-1 rounded text-center ${
                                    canAfford && hasCapacity
                                      ? 'bg-green-500 text-white hover:bg-green-600'
                                      : 'bg-gray-300 cursor-not-allowed'
                                  }`}
                                >
                                  {!canAfford 
                                    ? 'Insufficient Funds' 
                                    : !hasCapacity
                                      ? 'No Hangar Space'
                                      : 'Purchase'}
                                </button>
                              </div>
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

      {/* Vehicle detail modal */}
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
    </BaseModal>
  );
};

export default HangarModal;