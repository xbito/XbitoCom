import { FacilityType, Facility } from '../types';

export const FACILITY_TYPES: Record<string, FacilityType> = {
  powerPlant: {
    type: 'powerPlant',
    name: 'Power Plant',
    description: 'Generates power for base operations',
    baseCost: 400000,
    basePersonnel: 5,
    basePowerUsage: -50, // Negative because it generates power
    baseMaintenance: 10000,
    upgradeMultiplier: 1.5,
    size: 2, // Land usage in facility spaces
  },
  research: {
    type: 'research',
    name: 'Research Lab',
    description: 'Conducts research on alien technology',
    baseCost: 1000000,
    basePersonnel: 10,
    basePowerUsage: 20,
    baseMaintenance: 25000,
    upgradeMultiplier: 2,
    size: 3,
  },
  barracks: {
    type: 'barracks',
    name: 'Barracks',
    description: 'Houses and manages base personnel',
    baseCost: 300000,
    basePersonnel: 1, // Staff required to operate the facility
    basePowerUsage: 10,
    baseMaintenance: 5000,
    upgradeMultiplier: 1.3,
    size: 2, // Land usage in facility spaces
    personnelCapacity: 15, // Initial barracks capacity for housing personnel
    personnelCapacityMultiplier: 1.5,
  },
  hangar: {
    type: 'hangar',
    name: 'Aircraft Hangar',
    description: 'Houses and manages aircraft for interception and transport missions',
    baseCost: 1500000,
    basePersonnel: 5,
    basePowerUsage: 30,
    baseMaintenance: 50000,
    upgradeMultiplier: 1.8,
    size: 4,
    vehicleCapacity: 3,
    vehicleCapacityMultiplier: 1.5
  },
  radar: {
    type: 'radar',
    name: 'Radar Array',
    description: 'Detects UFO activity',
    baseCost: 600000,
    basePersonnel: 3,
    basePowerUsage: 25,
    baseMaintenance: 15000,
    upgradeMultiplier: 1.6,
    size: 1,
    baseRadarRange: 1200, // Increased from 1000 to 1200 (20% more)
    baseEffectiveness: 1.0 // Base effectiveness multiplier
  },
  defense: {
    type: 'defense',
    name: 'Defense System',
    description: 'Protects the base from attacks',
    baseCost: 750000,
    basePersonnel: 6,
    basePowerUsage: 30,
    baseMaintenance: 18000,
    upgradeMultiplier: 1.7,
    size: 2,
  },
};

export function createFacility(type: FacilityType['type'], level: number = 1): Facility {
  try {
    const facilityType = FACILITY_TYPES[type];
    if (!facilityType) {
      throw new Error(`Unknown facility type: ${type}`);
    }

    if (level < 1) {
      throw new Error(`Invalid level: ${level}. Level must be at least 1`);
    }

    // For radar facilities, enforce max level of 5
    if (type === 'radar' && level > 5) {
      throw new Error('Radar facility cannot be created above level 5');
    }

    const facility: Facility = {
      id: crypto.randomUUID(),
      type: type as 'barracks' | 'hangar' | 'radar' | 'defense' | 'research' | 'powerPlant',
      level,
      personnel: [],
      powerUsage: facilityType.basePowerUsage * level,
      maintenance: facilityType.baseMaintenance * Math.pow(facilityType.upgradeMultiplier, level - 1),
    };

    // Add hangar-specific properties
    if (type === 'hangar') {
      facility.vehicles = [];
      facility.vehicleCapacity = Math.floor(facilityType.vehicleCapacity! * Math.pow(facilityType.vehicleCapacityMultiplier!, level - 1));
    }

    // Add barracks-specific properties
    if (type === 'barracks') {
      // First level barracks gives 15 personnel capacity
      // Each subsequent level adds 10 personnel capacity
      if (level === 1) {
        facility.personnelCapacity = facilityType.personnelCapacity;
      } else {
        // Base capacity of 15 + 10 per additional level
        facility.personnelCapacity = 15 + ((level - 1) * 10);
      }
      facility.commanderAssigned = false;
    }

    // Add personnel capacity to other facilities based on their level
    if (['research', 'powerPlant', 'radar', 'defense'].includes(type)) {
      facility.personnelCapacity = facilityType.basePersonnel * level;
    }

    return facility;
  } catch (error) {
    console.error('[Create Facility] Failed:', error, {
      facilityType: type,
      level,
      availableTypes: Object.keys(FACILITY_TYPES)
    });
    throw error;
  }
}

/**
 * Generic facility upgrade function
 * @param facility The facility to upgrade
 * @param cost Optional cost of the upgrade (will be calculated if not provided)
 * @returns Object containing the upgraded facility, success status, message, and cost
 */
export function upgradeFacility(
  facility: Facility,
  cost?: number
): {
  success: boolean;
  message: string;
  facility: Facility;
  cost: number;
  baseProperties?: {
    radarRange?: number;
    radarEffectiveness?: number;
  };
} {
  try {
    const facilityType = FACILITY_TYPES[facility.type];
    if (!facilityType) {
      return { 
        success: false, 
        message: `Invalid facility type: ${facility.type}`, 
        facility, 
        cost: 0 
      };
    }

    const newLevel = facility.level + 1;

    // Check max level for radar facilities
    if (facility.type === 'radar' && newLevel > 5) {
      return {
        success: false,
        message: 'Radar facility cannot be upgraded beyond level 5',
        facility,
        cost: 0
      };
    }
    
    // Calculate upgrade cost if not provided
    if (cost === undefined) {
      const baseCost = facilityType.baseCost;
      const levelMultiplier = Math.pow(facilityType.upgradeMultiplier, newLevel - 1);
      cost = Math.floor(baseCost * levelMultiplier);
    }

    // Create upgraded facility starting with base properties
    const upgradedFacility = {
      ...facility,
      level: newLevel,
      // For power plants, scale power generation linearly with level
      // For other facilities, use a power multiplier
      powerUsage: facility.type === 'powerPlant'
        ? facilityType.basePowerUsage * newLevel
        : Math.floor(facilityType.basePowerUsage * Math.pow(1.2, newLevel - 1)),
      maintenance: Math.floor(facilityType.baseMaintenance * Math.pow(facilityType.upgradeMultiplier, newLevel - 1)),
      personnel: facility.personnel || []
    };

    // Handle special facility type upgrades
    switch (facility.type) {
      case 'barracks':
        upgradedFacility.personnelCapacity = newLevel === 1 ? 15 : 15 + ((newLevel - 1) * 10);
        upgradedFacility.commanderAssigned = facility.commanderAssigned || false;
        break;
      case 'hangar':
        upgradedFacility.vehicleCapacity = Math.floor(
          facilityType.vehicleCapacity! * Math.pow(facilityType.vehicleCapacityMultiplier!, newLevel - 1)
        );
        upgradedFacility.vehicles = facility.vehicles || [];
        break;
      case 'radar':
        // Return radar properties to be set at base level instead of facility level
        return {
          success: true,
          message: `Upgraded ${facilityType.name} to level ${newLevel}, detection range +${Math.floor((Math.pow(1.1, newLevel - 1) - 1) * 100)}%`,
          facility: upgradedFacility,
          cost,
          baseProperties: {
            radarRange: facilityType.baseRadarRange! * Math.pow(1.1, newLevel - 1),
            radarEffectiveness: facilityType.baseEffectiveness! * Math.pow(1.05, newLevel - 1)
          }
        };
      default:
        // For research, defense, and power plant, just update personnel capacity
        upgradedFacility.personnelCapacity = facilityType.basePersonnel * newLevel;
        break;
    }

    const upgradeEffect = facility.type === 'powerPlant'
      ? `power generation: ${Math.abs(upgradedFacility.powerUsage)}`
      : facility.type === 'barracks'
      ? `housing capacity: ${upgradedFacility.personnelCapacity} personnel`
      : `efficiency: +${Math.floor((Math.pow(1.2, newLevel - 1) - 1) * 100)}%`;

    return {
      success: true,
      message: `Upgraded ${facilityType.name} to level ${newLevel}, new ${upgradeEffect}`,
      facility: upgradedFacility,
      cost,
    };
  } catch (error) {
    console.error('[Facility Upgrade] Failed:', error, { facility });
    return {
      success: false,
      message: 'Failed to upgrade facility',
      facility,
      cost: 0
    };
  }
}