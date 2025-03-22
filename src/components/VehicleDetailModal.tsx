import React, { useState } from 'react';
import { Vehicle, Base, Personnel, VehicleWeapon, VehicleComponent } from '../types';
import {
  calculatePilotEffectiveness,
  calculateVehiclePerformance,
  reloadVehicleWeapons,
  performVehicleMaintenance,
  getAvailableUpgrades,
  upgradeVehicle,
  WEAPON_TYPES,
  COMPONENT_TYPES
} from '../data/vehicles';
import { assignPilotToVehicle, removePilotFromVehicle } from '../data/personnel';
import BaseModal from './BaseModal';
import { Shield, Wrench, Plane, Navigation, Users, Target, Cpu, ArrowUpCircle, DollarSign } from 'lucide-react';

interface VehicleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  base: Base;
  updateVehicle: (vehicle: Vehicle) => void;
  availableFunds: number;
  updateFunds: (amount: number) => void;
  completedResearch: string[];
}

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  base,
  updateVehicle,
  availableFunds,
  updateFunds,
  completedResearch
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'crew' | 'weapons' | 'components' | 'upgrades'>('info');
  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState<string | null>(null);

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
    // Update the personnel's status and assignedVehicleId
    const updatedPersonnel = {
      ...personnel,
      status: 'working',
      assignedVehicleId: vehicle.id
    };

    // Update the vehicle's crew
    const updatedVehicle = {
      ...vehicle,
      crew: [...vehicle.crew, updatedPersonnel]
    };

    // Update the base personnel
    const updatedBasePersonnel = base.personnel.map(p => 
      p.id === personnel.id ? updatedPersonnel : p
    );

    // Update the base
    const updatedBase = {
      ...base,
      personnel: updatedBasePersonnel
    };

    // Update the vehicle (this should also update the base)
    updateVehicle(updatedVehicle);
  };

  // Handle crew removal
  const handleRemovePersonnel = (personnelId: string) => {
    // Find the personnel in the vehicle's crew
    const personnel = vehicle.crew.find(p => p.id === personnelId);
    if (!personnel) return;

    // Update the personnel's status and assignedVehicleId
    const updatedPersonnel = {
      ...personnel,
      status: 'available',
      assignedVehicleId: null
    };

    // Update the vehicle's crew
    const updatedVehicle = {
      ...vehicle,
      crew: vehicle.crew.filter(p => p.id !== personnelId)
    };

    // Update the base personnel
    const updatedBasePersonnel = base.personnel.map(p => 
      p.id === personnelId ? updatedPersonnel : p
    );

    // Update the base
    const updatedBase = {
      ...base,
      personnel: updatedBasePersonnel
    };

    // Update the vehicle (this should also update the base)
    updateVehicle(updatedVehicle);
  };

  // Handle weapon reload
  const handleReloadWeapons = () => {
    const result = reloadVehicleWeapons(vehicle);
    
    if (result.success && result.cost > 0) {
      // Update vehicle
      updateVehicle(result.vehicle);
      
      // Deduct funds
      updateFunds(availableFunds - result.cost);
    }
  };

  // Handle vehicle upgrade
  const handleUpgradeVehicle = (variantKey: string) => {
    // Find the variant
    const variant = require('../data/vehicles').VEHICLE_TYPES[variantKey];
    if (!variant) return;
    
    // Calculate cost
    const result = upgradeVehicle(vehicle, variantKey, true);
    
    if (result.success && result.vehicle && result.cost) {
      // Check if we can afford it
      if (availableFunds < result.cost) {
        alert('Insufficient funds for upgrade');
        return;
      }
      
      // Update the vehicle
      updateVehicle(result.vehicle);
      
      // Deduct funds
      updateFunds(availableFunds - result.cost);
      
      // Close the upgrade confirm dialog
      setShowUpgradeConfirm(null);
    }
  };

  // Get the weapon type name
  const getWeaponTypeName = (type: string) => {
    switch (type) {
      case 'cannon': return 'Cannon';
      case 'missile': return 'Missile';
      case 'laser': return 'Laser';
      case 'plasma': return 'Plasma';
      case 'bomb': return 'Bomb';
      case 'torpedo': return 'Torpedo';
      default: return type;
    }
  };
  
  // Get the component type name
  const getComponentTypeName = (type: string) => {
    switch (type) {
      case 'engine': return 'Engine';
      case 'armor': return 'Armor';
      case 'radar': return 'Radar';
      case 'navigation': return 'Navigation';
      case 'stealth': return 'Stealth';
      case 'shield': return 'Shield';
      case 'medical': return 'Medical';
      case 'cargo': return 'Cargo';
      default: return type;
    }
  };

  // Calculate ammo reload cost
  const calculateReloadCost = () => {
    let totalCost = 0;
    
    vehicle.weapons.forEach(weapon => {
      if (weapon.currentAmmo < weapon.ammoCapacity) {
        const ammoNeeded = weapon.ammoCapacity - weapon.currentAmmo;
        const ammoCostPerUnit = weapon.cost * 0.01; // 1% of weapon cost per ammo unit
        totalCost += Math.round(ammoNeeded * ammoCostPerUnit);
      }
    });
    
    return totalCost;
  };

  const needsReload = vehicle.weapons.some(w => w.currentAmmo < w.ammoCapacity);
  const reloadCost = calculateReloadCost();
  const availableUpgrades = getAvailableUpgrades(
    // This is a simplification - would need to determine the actual variant key
    `${vehicle.type}-basic`, 
    completedResearch
  );

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
          <button
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === 'weapons' 
                ? 'bg-blue-500 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('weapons')}
          >
            Weapons
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === 'components' 
                ? 'bg-blue-500 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('components')}
          >
            Components
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === 'upgrades' 
                ? 'bg-blue-500 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab('upgrades')}
          >
            Upgrades
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
                    
                    <div className="text-slate-400">Weapons:</div>
                    <div className="text-slate-200 font-medium">{vehicle.weapons.length}/{vehicle.hardpoints}</div>
                    
                    <div className="text-slate-400">Components:</div>
                    <div className="text-slate-200 font-medium">{vehicle.components.length}/{vehicle.componentSlots}</div>
                  </div>
                </div>
                
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <DollarSign className="text-green-400" size={20} />
                    Maintenance
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-slate-400">Monthly Cost:</div>
                    <div className="text-slate-200 font-medium">${vehicle.maintenance.toLocaleString()}</div>
                    
                    <div className="text-slate-400">Fuel Cost:</div>
                    <div className="text-slate-200 font-medium">${vehicle.fuelCost.toLocaleString()}</div>
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
                    
                    <div className="text-slate-400">Firepower:</div>
                    <div className="text-slate-200 font-medium">
                      {vehicle.stats.firepower}
                      <span className="text-xs text-slate-400 ml-2">
                        (x{performanceModifiers.firepowerModifier.toFixed(2)})
                      </span>
                    </div>
                    
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
                
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Wrench className="text-yellow-400" size={20} />
                    Actions
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      disabled={!needsReload || reloadCost > availableFunds || vehicle.status !== 'ready'}
                      onClick={handleReloadWeapons}
                      className={`w-full py-2 rounded flex items-center justify-center gap-2 ${
                        !needsReload || reloadCost > availableFunds || vehicle.status !== 'ready'
                          ? 'bg-slate-600 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      <DollarSign size={16} />
                      {!needsReload 
                        ? 'All Weapons Loaded' 
                        : `Reload Weapons ($${reloadCost.toLocaleString()})`}
                    </button>
                    
                    {/* More actions could be added here */}
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
                          {personnel.role === 'pilot' && (
                            <div className="grid grid-cols-2 gap-x-4 mt-1 text-xs text-slate-300">
                              <div>Piloting: {personnel.skills.piloting}</div>
                              {personnel.pilotAttributes && (
                                <>
                                  <div>Reflexes: {personnel.pilotAttributes.reflexes}</div>
                                  <div>Combat Awareness: {personnel.pilotAttributes.combatAwareness}</div>
                                  <div>Technical Aptitude: {personnel.pilotAttributes.technicalAptitude}</div>
                                </>
                              )}
                            </div>
                          )}
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
          
          {/* Weapons Tab */}
          {activeTab === 'weapons' && (
            <div className="space-y-6">
              {/* Current weapons */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Target className="text-red-400" size={20} />
                    Current Weapons
                  </h3>
                  <span className="text-sm bg-slate-600 px-2 py-1 rounded">
                    {vehicle.weapons.length}/{vehicle.hardpoints} Hardpoints Used
                  </span>
                </div>
                
                {vehicle.weapons.length > 0 ? (
                  <div className="space-y-2">
                    {vehicle.weapons.map(weapon => (
                      <div key={weapon.id} className="bg-slate-800 rounded-lg p-3">
                        <div className="flex justify-between">
                          <div className="font-medium text-slate-200">{weapon.name}</div>
                          <div className="text-sm bg-slate-700 px-2 py-0.5 rounded capitalize">
                            {getWeaponTypeName(weapon.type)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                          <div><span className="text-slate-400">Damage:</span> <span className="text-slate-200">{weapon.damage}</span></div>
                          <div><span className="text-slate-400">Accuracy:</span> <span className="text-slate-200">{weapon.accuracy}%</span></div>
                          <div><span className="text-slate-400">Range:</span> <span className="text-slate-200">{weapon.range}</span></div>
                          <div><span className="text-slate-400">Weight:</span> <span className="text-slate-200">{weapon.weight}</span></div>
                        </div>
                        
                        {/* Ammo status */}
                        <div className="mt-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Ammo</span>
                            <span className="text-slate-200">{weapon.currentAmmo}/{weapon.ammoCapacity}</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(weapon.currentAmmo / weapon.ammoCapacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Additional weapon properties */}
                        <div className="flex gap-2 mt-2 text-xs">
                          {weapon.armorPiercing && (
                            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                              Armor Piercing: {weapon.armorPiercing}%
                            </span>
                          )}
                          {weapon.explosiveRadius && (
                            <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                              Explosive Radius: {weapon.explosiveRadius}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No weapons installed on this vehicle.</p>
                )}
              </div>
              
              {/* Available weapons */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Target className="text-blue-400" size={20} />
                  Available Weapons
                </h3>
                <p className="text-slate-400 text-sm">
                  Purchasing and installing new weapons will be available in a future update.
                </p>
                {/* We'll implement this in a future phase */}
              </div>
            </div>
          )}
          
          {/* Components Tab */}
          {activeTab === 'components' && (
            <div className="space-y-6">
              {/* Current components */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Cpu className="text-purple-400" size={20} />
                    Current Components
                  </h3>
                  <span className="text-sm bg-slate-600 px-2 py-1 rounded">
                    {vehicle.components.length}/{vehicle.componentSlots} Slots Used
                  </span>
                </div>
                
                {vehicle.components.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vehicle.components.map(component => (
                      <div key={component.id} className="bg-slate-800 rounded-lg p-3">
                        <div className="flex justify-between">
                          <div className="font-medium text-slate-200">{component.name}</div>
                          <div className="text-sm bg-slate-700 px-2 py-0.5 rounded capitalize">
                            {getComponentTypeName(component.type)}
                          </div>
                        </div>
                        
                        <div className="text-sm mt-1">
                          <div className="text-slate-300">Level {component.level} Component</div>
                          <div className="mt-1">
                            <span className="text-slate-400">Condition:</span> <span className="text-slate-200">{component.condition}%</span>
                            <div className="w-full bg-slate-900 rounded-full h-1 mt-1">
                              <div 
                                className={`${
                                  component.condition < 30 ? 'bg-red-500' : 
                                  component.condition < 70 ? 'bg-yellow-500' : 
                                  'bg-green-500'
                                } h-1 rounded-full`} 
                                style={{ width: `${component.condition}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Component stat effects */}
                        {component.stats && Object.keys(component.stats).length > 0 && (
                          <div className="mt-2 text-xs">
                            <div className="font-medium text-slate-300">Stats Affected:</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(component.stats).map(([stat, value]) => (
                                <span 
                                  key={stat} 
                                  className={`px-2 py-0.5 rounded ${
                                    Number(value) > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                  }`}
                                >
                                  {stat.charAt(0).toUpperCase() + stat.slice(1)}: {value > 0 ? '+' : ''}{value}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No components installed on this vehicle.</p>
                )}
              </div>
              
              {/* Available components */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Cpu className="text-blue-400" size={20} />
                  Available Components
                </h3>
                <p className="text-slate-400 text-sm">
                  Purchasing and installing new components will be available in a future update.
                </p>
                {/* We'll implement this in a future phase */}
              </div>
            </div>
          )}
          
          {/* Upgrades Tab */}
          {activeTab === 'upgrades' && (
            <div>
              <div className="bg-slate-700 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <ArrowUpCircle className="text-blue-400" size={20} />
                  Available Upgrades
                </h3>
                {availableUpgrades.length > 0 ? (
                  <div className="space-y-3">
                    {availableUpgrades.map(upgradeKey => {
                      const upgradeVariant = require('../data/vehicles').VEHICLE_TYPES[upgradeKey];
                      const estimatedCost = Math.round((upgradeVariant.baseCost - 
                        require('../data/vehicles').VEHICLE_TYPES[`${vehicle.type}-basic`].baseCost) * 1.2);
                      const canAfford = availableFunds >= estimatedCost;
                      
                      return (
                        <div key={upgradeKey} className="bg-slate-800 rounded-lg p-3">
                          <div className="flex justify-between">
                            <div className="font-medium text-slate-200">{upgradeVariant.name}</div>
                            <div className="text-sm text-green-400">
                              Est. Cost: ${estimatedCost.toLocaleString()}
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-400 mt-1">
                            {upgradeVariant.description}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                            <div className="text-slate-300"><span className="text-slate-400">Speed:</span> {upgradeVariant.baseStats.speed}</div>
                            <div className="text-slate-300"><span className="text-slate-400">Armor:</span> {upgradeVariant.baseStats.armor}</div>
                            <div className="text-slate-300"><span className="text-slate-400">Firepower:</span> {upgradeVariant.baseStats.firepower}</div>
                            <div className="text-slate-300"><span className="text-slate-400">Range:</span> {upgradeVariant.baseStats.range}</div>
                          </div>
                          
                          <div className="mt-3">
                            <button
                              disabled={!canAfford}
                              onClick={() => setShowUpgradeConfirm(upgradeKey)}
                              className={`w-full py-2 rounded flex items-center justify-center gap-2 ${
                                !canAfford 
                                  ? 'bg-slate-600 cursor-not-allowed' 
                                  : 'bg-blue-500 text-white hover:bg-blue-600'
                              }`}
                            >
                              <ArrowUpCircle size={16} />
                              {canAfford ? 'Upgrade' : 'Insufficient Funds'}
                            </button>
                          </div>
                          
                          {/* Confirmation dialog */}
                          {showUpgradeConfirm === upgradeKey && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                              <div className="bg-slate-800 rounded-lg p-6 max-w-md border border-slate-700">
                                <h3 className="font-bold text-lg text-slate-200">Confirm Upgrade</h3>
                                <p className="my-4 text-slate-300">
                                  Are you sure you want to upgrade to the {upgradeVariant.name}? 
                                  This will cost ${estimatedCost.toLocaleString()}.
                                </p>
                                <p className="my-4 text-sm text-slate-400">
                                  Crew will be transferred, but some components may be incompatible.
                                </p>
                                <div className="flex justify-end space-x-3">
                                  <button
                                    onClick={() => setShowUpgradeConfirm(null)}
                                    className="px-4 py-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleUpgradeVehicle(upgradeKey)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                  >
                                    Confirm
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400">
                    No upgrades available for this vehicle. Research new technologies to unlock upgrades.
                  </p>
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