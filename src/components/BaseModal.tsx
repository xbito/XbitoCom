import React, { useState } from 'react';
import { X, Building2, Zap, Plus, ChevronUp, MapPin, Plane, Users } from 'lucide-react';
import type { Base, Facility, Continent } from '../types';
import { FACILITY_TYPES } from '../data/facilities';

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

  // Calculate personnel capacity based on facilities
  const calculatePersonnelCapacity = (baseOrFacilities: Base | Facility[]) => {
    const facilitiesList = 'facilities' in baseOrFacilities 
      ? baseOrFacilities.facilities 
      : baseOrFacilities;
    
    return facilitiesList.reduce((total, facility) => {
      // Special handling for barracks - they provide base personnel capacity
      if (facility.type === 'barracks') {
        // First level gives 10 capacity, additional levels give 5 each
        return total + (facility.level === 1 ? 10 : 10 + ((facility.level - 1) * 5));
      }
      
      // For other facilities, personnel capacity is just how many can be assigned there
      return total;
    }, 0);
  };
  
  // Calculate continent personnel bonus
  const getPersonnelMultiplier = () => {
    return selectedContinent?.personnelMultiplier || 1;
  };

  // For new bases, calculate initial personnel capacity
  const getInitialPersonnelCapacity = () => {
    // Initial facilities include a level 1 barracks
    // Level 1 barracks provides 10 personnel capacity
    const baseCapacity = 10; // Fixed value for Level 1 barracks
    
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
        {
          id: crypto.randomUUID(),
          type: 'powerPlant',
          level: 1,
          personnel: [],
          powerUsage: FACILITY_TYPES.powerPlant.basePowerUsage,
          maintenance: FACILITY_TYPES.powerPlant.baseMaintenance,
        },
        {
          id: crypto.randomUUID(),
          type: 'barracks',
          level: 1,
          personnel: [],
          powerUsage: FACILITY_TYPES.barracks.basePowerUsage,
          maintenance: FACILITY_TYPES.barracks.baseMaintenance,
        },
        // Radar facility removed from default setup
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
    const newFacility = {
      id: crypto.randomUUID(),
      type: facilityType as any,
      level: 1,
      personnel: [],
      powerUsage: FACILITY_TYPES[facilityType].basePowerUsage,
      maintenance: FACILITY_TYPES[facilityType].baseMaintenance,
    };
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
                    const totalBaseCapacity = existingBase.facilities
                      .filter(f => f.type === 'barracks')
                      .reduce((total, barracks) => {
                        const level = barracks.level;
                        return total + (level === 1 ? 10 : 10 + ((level - 1) * 5));
                      }, 0);
                    return (
                      <p className="text-lg font-bold">{totalBaseCapacity}</p>
                    );
                  })()}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Personnel Assigned</p>
                  <p className="text-lg font-bold">
                    {(() => {
                      // Count all personnel assigned to base and facilities
                      const basePersonnel = existingBase.personnel?.length || 0;
                      const facilityPersonnel = existingBase.facilities.reduce(
                        (total, facility) => total + (facility.personnel?.length || 0),
                        0
                      );
                      return basePersonnel + facilityPersonnel;
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Available Slots</p>
                  <p className="text-lg font-bold">
                    {(() => {
                      const totalCapacity = existingBase.facilities
                        .filter(f => f.type === 'barracks')
                        .reduce((total, barracks) => {
                          const level = barracks.level;
                          return total + (level === 1 ? 10 : 10 + ((level - 1) * 5));
                        }, 0);
                      const totalAssigned = existingBase.personnel?.length || 0 +
                        existingBase.facilities.reduce(
                          (total, facility) => total + (facility.personnel?.length || 0),
                          0
                        );
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Personnel Capacity</label>
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-700 rounded px-3 py-2 text-white w-full">
                      <div className="flex justify-between">
                        <span>{getInitialPersonnelCapacity()} personnel</span>
                        <span className="text-slate-400 text-xs">
                          Based on initial facilities & location
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    Total available personnel: {availablePersonnel}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Cost</label>
                  <p className="text-xl font-bold text-green-400">
                    ${(baseCost ?? 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Available: ${(availableFunds ?? 0).toLocaleString()}
                  </p>
                </div>

                {selectedContinent && (
                  <div className="bg-slate-700 p-4 rounded">
                    <h3 className="font-medium mb-2">Location: {selectedContinent.name}</h3>
                    <div className="space-y-2 text-sm">
                      <p>Base Size Limit: {selectedContinent.maxBaseSize}</p>
                      <p>Personnel Efficiency: +{((selectedContinent.personnelMultiplier - 1) * 100).toFixed(0)}%</p>
                      <p>Research Efficiency: +{((selectedContinent.researchMultiplier - 1) * 100).toFixed(0)}%</p>
                      <p>Defense Strength: +{((selectedContinent.defenseMultiplier - 1) * 100).toFixed(0)}%</p>
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
                              Base Personnel Capacity: {facility.level === 1 ? 10 : 10 + ((facility.level - 1) * 5)}
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