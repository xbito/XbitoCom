import React, { useState, useEffect } from 'react';
import { X, Zap, Plus, ChevronUp, Plane, Users, MapPin, HardHat, Construction, BrickWall, LandPlot } from 'lucide-react';
import type { Base, Facility, Continent, ContinentSelection } from '../types';
import { FACILITY_TYPES, createFacility, upgradeFacility } from '../data/facilities';
import { calculateBasePersonnelCapacity, calculateUsedPersonnelCapacity } from '../data/basePersonnel';
import { 
  calculatePowerStatus, 
  getContinent, 
  getInitialPersonnelCapacity,
  calculateUpgradeCost,
  calculateBaseSize
} from '../utils/baseUtils';

interface BaseModalProps {
  onClose: () => void;
  onCreate?: (base: Base) => void;
  onUpgrade?: (baseId: string, facilityId: string) => void;
  onAddFacility?: (baseId: string, facilityType: string) => void;
  onOpenHangar?: (base: Base) => void;
  existingBase?: Base | null;
  availableFunds?: number;
  selectedContinent?: Continent | ContinentSelection | null;
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
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className={`bg-gradient-to-b from-slate-900 to-slate-950 rounded-lg p-6 border border-slate-700 shadow-lg ${
          width === 'sm' ? 'w-[400px]' :
          width === 'md' ? 'w-[600px]' :
          width === 'lg' ? 'w-[800px]' :
          width === 'xl' ? 'w-[1000px]' :
          width === '2xl' ? 'w-[1200px]' :
          'w-[600px]'
        } max-h-[80vh] overflow-y-auto`}>
          {title && (
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
              <h2 className="text-2xl font-bold text-green-400">{title}</h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-green-400 transition-colors"
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
  const [localFacilities, setLocalFacilities] = useState<Facility[]>(existingBase?.facilities || []);
  const [powerStatus, setPowerStatus] = useState(() => 
    existingBase ? calculatePowerStatus(existingBase) : { generation: 0, usage: 0, surplus: 0 }
  );
  const [availableFacilities, setAvailableFacilities] = useState<typeof FACILITY_TYPES[keyof typeof FACILITY_TYPES][]>([]);

  // Keep state in sync with existingBase prop
  useEffect(() => {
    if (existingBase) {
      setName(existingBase.name);
      setLocalFacilities(existingBase.facilities);
      setPowerStatus(calculatePowerStatus(existingBase));
    }
  }, [existingBase]);

  // Update power status whenever facilities change
  useEffect(() => {
    if (existingBase) {
      setPowerStatus(calculatePowerStatus({
        ...existingBase,
        facilities: localFacilities
      }));
    }
  }, [localFacilities, existingBase]);

  // Update available facilities whenever localFacilities changes
  useEffect(() => {
    if (existingBase) {
      try {
        const existingTypes = new Set(localFacilities.map(f => f.type));
        
        // Only filter out facilities that are already built, don't filter by size or funds
        const available = Object.values(FACILITY_TYPES).filter(f => 
          !existingTypes.has(f.type as Facility['type'])
        );
        
        setAvailableFacilities(available);
        
        // Auto-close the facility select if there are no available facilities
        if (available.length === 0 && showFacilitySelect) {
          setShowFacilitySelect(false);
        }
      } catch (error) {
        console.error('[BaseModal] Error updating available facilities:', error, {
          localFacilities,
          existingBase
        });
        setAvailableFacilities([]);
      }
    }
  }, [localFacilities, existingBase, showFacilitySelect]);

  // Keep localFacilities in sync when upgrades happen
  const handleFacilityUpgrade = (baseId: string, facilityId: string) => {
    if (!onUpgrade) return;

    try {
      onUpgrade(baseId, facilityId);

      // Update local state immediately to reflect the upgrade
      setLocalFacilities(prev => {
        const facilityToUpgrade = prev.find(f => f.id === facilityId);
        if (!facilityToUpgrade) {
          console.error('[Facility Upgrade] Could not find facility to upgrade:', {
            facilityId,
            baseId,
            allFacilityIds: prev.map(f => f.id)
          });
          return prev;
        }
        
        const result = upgradeFacility(facilityToUpgrade);
        if (!result.success) {
          console.error('[Facility Upgrade] Failed to upgrade facility:', {
            facility: facilityToUpgrade,
            error: result.message
          });
          return prev;
        }
        
        return prev.map(f => f.id === facilityId ? result.facility : f);
      });
    } catch (error) {
      console.error('[Facility Upgrade] Unexpected error during upgrade:', error, {
        baseId,
        facilityId,
        existingBase
      });
    }
  };

  const baseCost = 2000000; // $2M for a new base

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !selectedContinent || !onCreate) return;
    
    try {
      // Randomize position within a small radius if click coordinates are provided
      let x: number, y: number;
      
      if ('clickX' in selectedContinent && 'clickY' in selectedContinent) {
        // Add random offset between 10 and 35 pixels
        const minRadius = 10;
        const maxRadius = 35;
        const randomRadius = minRadius + Math.random() * (maxRadius - minRadius);
        const randomAngle = Math.random() * Math.PI * 2;

        // Calculate base position with primary offset
        x = selectedContinent.clickX + Math.cos(randomAngle) * randomRadius;
        y = selectedContinent.clickY + Math.sin(randomAngle) * randomRadius;

        // Add a small secondary random offset (-5 to +5 pixels) for more natural placement
        const secondaryOffset = 5;
        x += (Math.random() * secondaryOffset * 2) - secondaryOffset;
        y += (Math.random() * secondaryOffset * 2) - secondaryOffset;
      } else {
        // Fallback to random position within continent if no click coordinates
        x = Math.random() * 100;
        y = Math.random() * 100;
      }

      const continent = getContinent(selectedContinent);
      const newBase: Base = {
        id: existingBase?.id || crypto.randomUUID(),
        name,
        x,
        y,
        level: 1,
        personnel: [],
        power: 0,
        powerUsage: 0,
        continent,
        maxSize: continent.maxBaseSize,
        facilities: [
          createFacility('powerPlant'),
          createFacility('barracks')
        ],
        vehicles: [],
        radarRange: 0,
        radarEffectiveness: 0,
        personnelCapacity: getInitialPersonnelCapacity(selectedContinent),
      };

      onCreate(newBase);
    } catch (error) {
      console.error('Error creating base:', error);
    }
  };

  const canCreate = name && (!existingBase && availableFunds >= baseCost);

  const handleAddNewFacility = (facilityType: string) => {
    if (!existingBase || !onAddFacility) return;
    
    try {
      onAddFacility(existingBase.id, facilityType);
      setShowFacilitySelect(false);
      
      // Create the new facility
      const newFacility = createFacility(facilityType);
      const updatedFacilities = [...localFacilities, newFacility];
      setLocalFacilities(updatedFacilities);

      // Update the base's state to reflect new facility immediately
      const updatedBase: Base = {
        ...existingBase,
        facilities: updatedFacilities,
        // Recalculate personnel capacity if it's a barracks
        personnelCapacity: newFacility.type === 'barracks' 
          ? calculateBasePersonnelCapacity({ ...existingBase, facilities: updatedFacilities })
          : existingBase.personnelCapacity
      };

      // Update other base properties based on the new facility
      if (newFacility.powerUsage) {
        updatedBase.power = calculatePowerStatus(updatedBase).generation;
        updatedBase.powerUsage = calculatePowerStatus(updatedBase).usage;
      }
    } catch (error) {
      console.error('Failed to add facility:', error);
      alert('An error occurred while adding the facility');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto relative border border-slate-700 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-green-400 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
          <HardHat className="text-green-400" size={24} />
          <div>
            <h2 className="text-2xl font-bold text-white">
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
            <div className="mb-6 bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-yellow-400" size={20} />
                <h3 className="font-semibold">Power Status</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-slate-400">Generation</p>
                  <p className="text-lg font-bold text-green-400">{powerStatus.generation}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Usage</p>
                  <p className="text-lg font-bold text-red-400">{powerStatus.usage}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Surplus</p>
                  <p className={`text-lg font-bold ${powerStatus.surplus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {powerStatus.surplus}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4 bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
              <h3 className="font-semibold mb-2">Base Land Usage</h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ 
                      width: `${(calculateBaseSize({...existingBase, facilities: localFacilities}) / existingBase.maxSize) * 100}%`
                    }}
                  />
                </div>
                <span className="text-sm text-slate-400">
                  {calculateBaseSize({...existingBase, facilities: localFacilities})} / {existingBase.maxSize} facility spaces
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Each facility requires space to be constructed
              </p>
            </div>

            <div className="mb-4 bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-green-400" size={20} />
                <h3 className="font-semibold">Personnel Housing</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-slate-400">Housing Capacity</p>
                  {(() => {
                    const totalBarracksCapacity = calculateBasePersonnelCapacity(existingBase);
                    return (
                      <p className="text-lg font-bold text-white">{totalBarracksCapacity}</p>
                    );
                  })()}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Personnel Housed</p>
                  <p className="text-lg font-bold text-white">
                    {(() => {
                      return calculateUsedPersonnelCapacity(existingBase);
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Available Bunks</p>
                  <p className="text-lg font-bold text-white">
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
                  <label className="block text-sm font-medium mb-1 text-slate-300">Base Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 rounded px-3 py-2 text-white border border-slate-700 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="Enter base name"
                    autoFocus
                  />
                </div>

                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <BrickWall size={16} className="text-green-400" />
                    Initial Facilities
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span>Power Plant (Level 1)</span>
                      <span className="text-yellow-400">Power: +50</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Barracks (Level 1)</span>
                      <span className="text-green-400">Personnel: 15</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    Additional facilities can be built after base construction
                  </div>
                </div>

                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Construction size={16} className="text-green-400" />
                    Construction Details
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
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
                      <div className="text-sm text-slate-400 mb-1">Initial Land Usage</div>
                      <div className="text-xl font-bold text-white">
                        2 / {getContinent(selectedContinent)?.maxBaseSize ?? 0} spaces
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Power Plant (1) + Barracks (1)
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Initial Housing Capacity</div>
                      <div className="text-xl font-bold text-white">{getInitialPersonnelCapacity(selectedContinent)}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        From Level 1 Barracks
                      </div>
                    </div>
                  </div>
                </div>

                {selectedContinent && (
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <LandPlot size={16} className="text-green-400" />
                      Regional Advantages: {getContinent(selectedContinent).name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span>Maximum Land Usage</span>
                        <span className="text-green-400">{getContinent(selectedContinent).maxBaseSize} facility spaces</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Personnel Efficiency</span>
                        <span className="text-green-400">+{((getContinent(selectedContinent).personnelMultiplier - 1) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Research Efficiency</span>
                        <span className="text-purple-400">+{((getContinent(selectedContinent).researchMultiplier - 1) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Defense Strength</span>
                        <span className="text-yellow-400">+{((getContinent(selectedContinent).defenseMultiplier - 1) * 100).toFixed(0)}%</span>
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
                    disabled={availableFacilities.length === 0 || (availableFunds ?? 0) < Math.min(...availableFacilities.map(f => f.baseCost))}
                    className="text-sm bg-green-600 hover:bg-green-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded flex items-center gap-1 transition-colors"
                  >
                    <Plus size={16} />
                    Add Facility
                  </button>
                </div>

                {showFacilitySelect && (
                  <div className="mb-4 bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-medium mb-2">Select Facility to Add</h4>
                    <div className="space-y-2">
                      {availableFacilities.map(facility => {
                        // Calculate current base size based on the latest localFacilities state
                        const currentBaseSize = localFacilities.reduce(
                          (acc, f) => acc + FACILITY_TYPES[f.type].size, 
                          0
                        );
                        
                        const canAfford = (availableFunds ?? 0) >= facility.baseCost;
                        const hasEnoughSpace = existingBase && 
                          currentBaseSize + facility.size <= existingBase.maxSize;
                        const canBuild = canAfford && hasEnoughSpace;
                        
                        // Create tooltip text based on what's preventing construction
                        let tooltipText = "";
                        if (!canAfford) {
                          tooltipText = `Not enough funds: $${availableFunds.toLocaleString()} / $${facility.baseCost.toLocaleString()} required`;
                        } else if (!hasEnoughSpace) {
                          tooltipText = `Not enough space: ${currentBaseSize + facility.size} / ${existingBase.maxSize} max facility spaces`;
                        }
                        
                        return (
                          <div key={facility.type} className="relative group">
                            <button
                              type="button"
                              onClick={() => canBuild && handleAddNewFacility(facility.type)}
                              disabled={!canBuild}
                              className={`w-full text-left p-3 rounded flex justify-between items-center border ${
                                canBuild 
                                  ? "border-slate-700 bg-slate-900 hover:bg-slate-800" 
                                  : "border-slate-800 bg-slate-900/80 cursor-not-allowed opacity-70"
                              }`}
                            >
                              <div>
                                <p className={`font-medium ${!canBuild ? "text-slate-400" : ""}`}>{facility.name}</p>
                                <p className="text-sm text-slate-400">{facility.description}</p>
                              </div>
                              <div className="text-right">
                                <p className={canAfford ? "text-green-400" : "text-red-400"}>
                                  ${facility.baseCost.toLocaleString()}
                                </p>
                                <p className={`text-sm ${hasEnoughSpace ? "text-slate-400" : "text-red-400"}`}>
                                  Size: {facility.size}
                                </p>
                              </div>
                            </button>
                            
                            {/* Tooltip that shows on hover when building is not possible */}
                            {!canBuild && (
                              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-slate-950 text-white text-xs p-2 rounded shadow-lg left-1/2 -translate-x-1/2 -bottom-1 transform translate-y-full w-max max-w-xs pointer-events-none border border-slate-700">
                                {tooltipText}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {localFacilities.map((facility) => {
                    const facilityType = FACILITY_TYPES[facility.type];
                    const upgradeCost = calculateUpgradeCost(facility);
                    return (
                      <div
                        key={facility.id}
                        className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg flex justify-between items-center border border-slate-700"
                      >
                        <div>
                          <h4 className="font-medium">{facilityType?.name}</h4>
                          <p className="text-sm text-slate-400">Level {facility.level}</p>
                          <div className="flex gap-4 mt-1 text-sm">
                            <span className="text-yellow-400">Power: {facility.powerUsage}</span>
                            {facility.type === 'barracks' ? (
                              <span className="text-green-400">
                                Commander: {facility.personnel?.some(p => p.role === 'commander') ? '1' : '0'}/1
                              </span>
                            ) : (
                              <span className="text-green-400">
                                Personnel: {facility.personnel?.length ?? 0}/{facilityType?.basePersonnel * facility.level}
                              </span>
                            )}
                            <span className="text-purple-400">Size: {facilityType?.size ?? 0}</span>
                          </div>
                          {facility.type === 'barracks' && (
                            <div className="text-sm text-green-400 mt-1">
                              Housing Capacity: {facility.level === 1 ? 15 : 15 + ((facility.level - 1) * 10)} personnel
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {facility.type === 'hangar' && (
                            <button
                              type="button"
                              onClick={() => onOpenHangar?.(existingBase)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-2 transition-colors"
                            >
                              <Plane size={16} />
                              <span>Manage</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleFacilityUpgrade(existingBase?.id ?? '', facility.id)}
                            disabled={(availableFunds ?? 0) < (upgradeCost ?? 0)}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded flex items-center gap-2 transition-colors"
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
              className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded transition-colors"
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