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
  const facilityType = FACILITY_TYPES[type];
  if (!facilityType) {
    throw new Error(`Unknown facility type: ${type}`);
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
}

/**
 * Upgrade barracks facility
 * @param barracks The barracks facility to upgrade
 * @param cost Optional cost of the upgrade (will be calculated if not provided)
 * @returns Object containing the upgraded barracks facility, success status, message, and cost
 */
export function upgradeBarracks(
  barracks: Facility,
  cost?: number
): {
  success: boolean;
  message: string;
  barracks: Facility;
  cost: number;
} {
  if (barracks.type !== 'barracks') {
    return { 
      success: false, 
      message: 'Facility is not a barracks', 
      barracks, 
      cost: 0 
    };
  }
  
  const newLevel = barracks.level + 1;
  
  // Calculate upgrade cost if not provided
  if (cost === undefined) {
    const facilityType = FACILITY_TYPES[barracks.type];
    const baseCost = facilityType.baseCost;
    const levelMultiplier = Math.pow(facilityType.upgradeMultiplier, newLevel - 1);
    cost = Math.floor(baseCost * levelMultiplier);
  }
  
  // Calculate new personnel capacity (for the base)
  // First level gives 15 capacity, additional levels give 10 each
  const newPersonnelCapacity = newLevel === 1 ? 15 : 15 + ((newLevel - 1) * 10);
  
  // Calculate upgrade effects
  const powerMultiplier = Math.pow(1.2, newLevel - 1);
  const facilityType = FACILITY_TYPES.barracks;
  
  // Create upgraded barracks
  const upgradedBarracks = {
    ...barracks,
    level: newLevel,
    personnelCapacity: newPersonnelCapacity,
    powerUsage: Math.floor(facilityType.basePowerUsage * powerMultiplier),
    maintenance: Math.floor(facilityType.baseMaintenance * Math.pow(facilityType.upgradeMultiplier, newLevel - 1)),
    // Preserve existing personnel and commander status
    personnel: barracks.personnel || [],
    commanderAssigned: barracks.commanderAssigned || false
  };
  
  return {
    success: true,
    message: `Upgraded barracks to level ${newLevel}, new housing capacity: ${newPersonnelCapacity} personnel`,
    barracks: upgradedBarracks,
    cost,
  };
}