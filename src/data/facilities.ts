import { FacilityType, Facility } from '../types';

export const FACILITY_TYPES: Record<FacilityType['type'], FacilityType> = {
  powerPlant: {
    type: 'powerPlant',
    name: 'Power Plant',
    description: 'Generates power for base operations',
    baseCost: 500000,
    basePersonnel: 5,
    basePowerUsage: -50, // Negative because it generates power
    baseMaintenance: 10000,
    upgradeMultiplier: 1.5,
    size: 2,
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
    description: 'Houses and trains personnel',
    baseCost: 300000,
    basePersonnel: 5,
    basePowerUsage: 10,
    baseMaintenance: 5000,
    upgradeMultiplier: 1.3,
    size: 2,
  },
  hangar: {
    type: 'hangar',
    name: 'Aircraft Hangar',
    description: 'Houses and maintains aircraft for interception and transport missions',
    baseCost: 1500000,
    basePersonnel: 8,
    basePowerUsage: 30,
    baseMaintenance: 50000,
    upgradeMultiplier: 1.8,
    size: 4,
    vehicleCapacity: 3,
    vehicleCapacityMultiplier: 1.5,
    maintenanceBays: 1,
    repairSpeed: 1.0,
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
    facility.maintenanceBays = facilityType.maintenanceBays! * level;
    facility.repairSpeed = facilityType.repairSpeed! * (1 + (level - 1) * 0.2);
    facility.maintenanceQueue = [];
    facility.upgradeLevel = {
      equipmentQuality: 1,
      baySize: 1,
      crewTraining: 1
    };
  }

  return facility;
}