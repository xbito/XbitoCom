import React, { useState } from 'react';
import { X, Building2, Zap, Plus, ChevronUp, MapPin, Plane, Users, DollarSign } from 'lucide-react';
import type { Base, Facility, Continent } from '../types';
import { FACILITY_TYPES } from '../data/facilities';
import { calculateBasePersonnelCapacity, calculateUsedPersonnelCapacity } from '../data/basePersonnel';
import { createFacility } from '../data/facilities';

interface BaseModalProps {
  onClose: () => void;
  onCreate?: (base: Base) => void;
  onUpgrade?: (baseId: string, facilityId: string) => void;
  onAddFacility?: (baseId: string, facilityType: string) => void;
  onOpenHangar?: (base: Base) => void;
  existingBase?: Base | null;
  availablePersonnel?: number;
  availableFunds?: number;
  selectedContinent?: Continent | null;
  isOpen?: boolean;
  width?: string;
  title?: string;
  children?: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({
  onClose,
  onCreate,
  onUpgrade,
  onAddFacility,
  onOpenHangar,
  existingBase,
  availablePersonnel = 0,
  availableFunds = 0,
  selectedContinent,
  isOpen = true,
  width = 'md',
  title,
  children
}) => {
  // If component is not open, don't render anything
  if (!isOpen) return null;

  // If this is being used as a generic modal with children
  if (children) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`bg-slate-800 rounded-lg p-6 ${
          width === 'sm' ? 'w-[400px]' :
          width === 'md' ? 'w-[600px]' :
          width === 'lg' ? 'w-[800px]' :
          width === 'xl' ? 'w-[1000px]' :
          'w-[600px]'
        } max-h-[80vh] overflow-y-auto`}>
          {title && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{title}</h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    );
  }

  // Base creation/management UI code
  const [name, setName] = useState(existingBase?.name || '');
  const [showFacilitySelect, setShowFacilitySelect] = useState(false);
  const [facilities, setFacilities] = useState(existingBase?.facilities || []);

  const baseCost = 2000000; // $2M for a new base
  
  // Calculate continent personnel bonus
  const getPersonnelMultiplier = () => {
    return selectedContinent?.personnelMultiplier || 1;
  };

  // For new bases, calculate initial personnel capacity
  const getInitialPersonnelCapacity = () => {
    // Initial facilities include a level 1 barracks
    // Level 1 barracks provides 15 personnel capacity
    const baseCapacity = 15;
    
    // Apply continent multiplier
    return Math.round(baseCapacity * getPersonnelMultiplier());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !selectedContinent || !onCreate) return;
    
    const newBase: Base = {
      id: existingBase?.id || crypto.randomUUID(),
      name,
      x: Math.random() * 100, // Random position within the continent
      y: Math.random() * 100, // Random position within the continent
      level: 1,
      personnel: [], // Personnel will be assigned later by the user from Personnel modal
      power: 0,
      powerUsage: 0,
      continent: selectedContinent,
      maxSize: selectedContinent.maxBaseSize,
      facilities: [
        createFacility('powerPlant'),
        createFacility('barracks')
      ],
      vehicles: [],
      radarRange: 0, // No radar range since there's no radar
      radarEffectiveness: 0, // No radar effectiveness since there's no radar
      personnelCapacity: getInitialPersonnelCapacity(),
    };

    onCreate(newBase);
  };

  const calculateUpgradeCost = (facility: Facility) => {
    const facilityType = FACILITY_TYPES[facility.type];
    return Math.floor(facilityType.baseCost * Math.pow(facilityType.upgradeMultiplier, facility.level));
  };

  const canCreate = name && (!existingBase && availableFunds >= baseCost);

  const getAvailableFacilities = () => {
    if (!existingBase) return [];
    
    const existingTypes = new Set(existingBase.facilities.map(f => f.type));
    const currentSize = existingBase.facilities.reduce((acc, f) => acc + FACILITY_TYPES[f.type].size, 0);
    
    return Object.values(FACILITY_TYPES).filter(f => 
      !existingTypes.has(f.type as Facility['type']) && 
      currentSize + f.size <= existingBase.maxSize
    );
  };

  const handleAddNewFacility = (facilityType: string) => {
    if (!existingBase || !onAddFacility) return;
    onAddFacility(existingBase.id, facilityType);
    setShowFacilitySelect(false);
    
    // Update local state to show new facility immediately
    const newFacility = createFacility(facilityType);
    setFacilities([...facilities, newFacility]);
  };

  const calculatePowerStatus = (base: Base) => {
    const totalGeneration = base.facilities
      .filter(f => f.powerUsage < 0)
      .reduce((acc, f) => acc + Math.abs(f.powerUsage), 0);
    
    const totalUsage = base.facilities
      .filter(f => f.powerUsage > 0)
      .reduce((acc, f) => acc + f.powerUsage, 0);

    return {
      generation: totalGeneration,
      usage: totalUsage,
      surplus: totalGeneration - totalUsage,
    };
  };

  const calculateBaseSize = (base: Base) => {
    return base.facilities.reduce((acc, f) => acc + FACILITY_TYPES[f.type].size, 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Building2 className="text-blue-400" size={24} />
          <div>
            <h2 className="text-2xl font-bold">
              {existingBase ? `${existingBase.name} - Level ${existingBase.level}` : 'Create New Base'}
            </h2>
            {existingBase && (
              <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                <MapPin size={14} />
                {existingBase.continent.name}
              </p>
            )}
          </div>
        </div>

        {existingBase && (
          <>
            <div className="mb-6 bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-yellow-400" size={20} />
                <h3 className="font-semibold">Power Status</h3>
              </div>
              {(() => {
                const status = calculatePowerStatus(existingBase);
                
                return (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-slate-400">Generation</p>
                      <p className="text-lg font-bold text-green-400">{status.generation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Usage</p>
                      <p className="text-lg font-bold text-red-400">{status.usage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Surplus</p>
                      <p className={`text-lg font-bold ${status.surplus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {status.surplus}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mb-4 bg-slate-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Base Capacity</h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500"
                    style={{ 
                      width: `${(calculateBaseSize(existingBase) / existingBase.maxSize) * 100}%`
                    }}
                  />
                </div>
                <span className="text-sm text-slate-400">
                  {calculateBaseSize(existingBase)} / {existingBase.maxSize}
                </span>
              </div>
            </div>

            <div className="mb-4 bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-blue-400" size={20} />
                <h3 className="font-semibold">Base Personnel</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-slate-400">Base Capacity</p>
                  {(() => {
                    // Calculate total base capacity from all barracks
                    const totalBaseCapacity = calculateBasePersonnelCapacity(existingBase);
                    return (
                      <p className="text-lg font-bold">{totalBaseCapacity}</p>
                    );
                  })()}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Personnel Assigned</p>
                  <p className="text-lg font-bold">
                    {(() => {
                      return calculateUsedPersonnelCapacity(existingBase);
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Available Slots</p>
                  <p className="text-lg font-bold">
                    {(() => {
                      const totalCapacity = calculateBasePersonnelCapacity(existingBase);
                      const totalAssigned = calculateUsedPersonnelCapacity(existingBase);
                      return Math.max(0, totalCapacity - totalAssigned);
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!existingBase && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Base Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-700 rounded px-3 py-2 text-white"
                    placeholder="Enter base name"
                    autoFocus
                  />
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Building2 size={16} className="text-blue-400" />
                    Initial Facilities
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span>Power Plant (Level 1)</span>
                      <span className="text-yellow-400">Power: +50</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Barracks (Level 1)</span>
                      <span className="text-blue-400">Personnel: 15</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    Additional facilities can be built after base construction
                  </div>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <DollarSign size={16} className="text-green-400" />
                    Construction Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Base Cost</div>
                      <div className="text-xl font-bold text-green-400">
                        ${(baseCost ?? 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Available: ${(availableFunds ?? 0).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Initial Personnel Capacity</div>
                      <div className="text-xl font-bold">{getInitialPersonnelCapacity()}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        Available Personnel: {availablePersonnel}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedContinent && (
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <MapPin size={16} className="text-red-400" />
                      Regional Advantages: {selectedContinent.name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span>Maximum Base Size</span>
                        <span className="text-blue-400">{selectedContinent.maxBaseSize} facilities</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Personnel Efficiency</span>
                        <span className="text-green-400">+{((selectedContinent.personnelMultiplier - 1) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Research Efficiency</span>
                        <span className="text-purple-400">+{((selectedContinent.researchMultiplier - 1) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Defense Strength</span>
                        <span className="text-yellow-400">+{((selectedContinent.defenseMultiplier - 1) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {existingBase && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Facilities</h3>
                  <button
                    type="button"
                    onClick={() => setShowFacilitySelect(true)}
                    disabled={getAvailableFacilities().length === 0 || (availableFunds ?? 0) < Math.min(...getAvailableFacilities().map(f => f.baseCost))}
                    className="text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Facility
                  </button>
                </div>

                {showFacilitySelect && (
                  <div className="mb-4 bg-slate-700 p-4 rounded">
                    <h4 className="font-medium mb-2">Select Facility to Add</h4>
                    <div className="space-y-2">
                      {getAvailableFacilities().map(facility => (
                        <button
                          key={facility.type}
                          type="button"
                          onClick={() => handleAddNewFacility(facility.type)}
                          disabled={availableFunds < facility.baseCost}
                          className="w-full text-left p-2 rounded hover:bg-slate-600 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">{facility.name}</p>
                            <p className="text-sm text-slate-400">{facility.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400">${facility.baseCost.toLocaleString()}</p>
                            <p className="text-sm text-slate-400">Size: {facility.size}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {facilities.map((facility) => {
                    const facilityType = FACILITY_TYPES[facility.type];
                    const upgradeCost = calculateUpgradeCost(facility);
                    return (
                      <div
                        key={facility.id}
                        className="bg-slate-700 p-4 rounded flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-medium">{facilityType?.name}</h4>
                          <p className="text-sm text-slate-400">Level {facility.level}</p>
                          <div className="flex gap-4 mt-1 text-sm">
                            <span className="text-yellow-400">Power: {facility.powerUsage}</span>
                            {facility.type === 'barracks' ? (
                              <span className="text-blue-400">
                                Commander: {facility.personnel?.some(p => p.role === 'commander') ? '1' : '0'}/1
                              </span>
                            ) : (
                              <span className="text-blue-400">
                                Personnel: {facility.personnel?.length ?? 0}/{facilityType?.basePersonnel * facility.level}
                              </span>
                            )}
                            <span className="text-purple-400">Size: {facilityType?.size ?? 0}</span>
                          </div>
                          {facility.type === 'barracks' && (
                            <div className="text-sm text-green-400 mt-1">
                              Base Personnel Capacity: {facility.level === 1 ? 15 : 15 + ((facility.level - 1) * 10)}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {facility.type === 'hangar' && (
                            <button
                              type="button"
                              onClick={() => onOpenHangar?.(existingBase)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2"
                            >
                              <Plane size={16} />
                              <span>Manage</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onUpgrade?.(existingBase?.id ?? '', facility.id)}
                            disabled={(availableFunds ?? 0) < (upgradeCost ?? 0)}
                            className="bg-green-500 hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded flex items-center gap-2"
                          >
                            <ChevronUp size={16} />
                            <div>
                              <div>Upgrade</div>
                              <div className="text-xs">${(upgradeCost ?? 0).toLocaleString()}</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {!existingBase && (
            <button
              type="submit"
              disabled={!canCreate}
              className="mt-6 w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
            >
              Create Base
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default BaseModal;