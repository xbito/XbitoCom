import { 
  VehicleType, 
  VehicleStats, 
  Vehicle, 
  Personnel, 
  VehicleWeapon, 
  WeaponType,
  VehicleComponent,
  ComponentType
} from '../types';

// Expanded vehicle variants - added specialized versions for each vehicle type
export const VEHICLE_TYPES: Record<string, {
  type: VehicleType;
  name: string;
  description: string;
  baseCost: number;
  baseStats: VehicleStats;
  crewRequirements: {
    pilot: number;
    soldier?: number;
    engineer?: number;
    medic?: number;
  };
  hardpoints: number;
  componentSlots: number;
  maintenanceCost: number;
  fuelCost: number;
  size: number;
  variant?: string;
  researchRequired?: string[];
  defaultWeapons?: string[];
  defaultComponents?: string[];
}> = {
  // Interceptor variants
  "interceptor-basic": {
    type: 'interceptor',
    name: 'F-35X Interceptor',
    description: 'Advanced fighter aircraft modified for high-altitude UFO interception',
    baseCost: 2000000,
    baseStats: {
      speed: 80,
      armor: 40,
      firepower: 70,
      range: 60,
      capacity: 2,
    },
    crewRequirements: {
      pilot: 1,
    },
    hardpoints: 4,
    componentSlots: 4,
    maintenanceCost: 50000,
    fuelCost: 10000,
    size: 2,
    defaultWeapons: ['vulcanCannon', 'sidewinderMissile'],
    defaultComponents: ['basicEngine', 'basicArmor', 'basicRadar', 'basicNavigation']
  },
  "interceptor-heavy": {
    type: 'interceptor',
    name: 'F-35H Heavy Interceptor',
    description: 'Heavily armed variant with additional weapon hardpoints for maximum firepower',
    baseCost: 2800000,
    baseStats: {
      speed: 70,
      armor: 60,
      firepower: 90,
      range: 50,
      capacity: 2,
    },
    crewRequirements: {
      pilot: 1,
      engineer: 1,
    },
    hardpoints: 6,
    componentSlots: 4,
    maintenanceCost: 60000,
    fuelCost: 12000,
    size: 3,
    variant: 'heavy',
    researchRequired: ['advanced-weapons-systems'],
    defaultWeapons: ['vulcanCannon', 'sidewinderMissile', 'sidewinderMissile'],
    defaultComponents: ['basicEngine', 'titaniumArmor', 'basicRadar', 'basicNavigation']
  },
  "interceptor-stealth": {
    type: 'interceptor',
    name: 'F-35S Stealth Interceptor',
    description: 'Stealth variant with reduced radar signature and enhanced speed',
    baseCost: 3500000,
    baseStats: {
      speed: 90,
      armor: 30,
      firepower: 60,
      range: 70,
      capacity: 2,
    },
    crewRequirements: {
      pilot: 1,
    },
    hardpoints: 3,
    componentSlots: 5,
    maintenanceCost: 70000,
    fuelCost: 9000,
    size: 2,
    variant: 'stealth',
    researchRequired: ['stealth-systems'],
    defaultWeapons: ['vulcanCannon', 'sidewinderMissile'],
    defaultComponents: ['advancedEngine', 'basicArmor', 'advancedRadar', 'basicNavigation', 'advancedStealth']
  },
  "interceptor-beam": {
    type: 'interceptor',
    name: 'F-35L Beam Interceptor',
    description: 'Experimental interceptor equipped with directed energy weapons',
    baseCost: 4500000,
    baseStats: {
      speed: 85,
      armor: 45,
      firepower: 100,
      range: 65,
      capacity: 2,
    },
    crewRequirements: {
      pilot: 2,
      engineer: 1,
    },
    hardpoints: 4,
    componentSlots: 5,
    maintenanceCost: 80000,
    fuelCost: 15000,
    size: 3,
    variant: 'beam',
    researchRequired: ['directed-energy-weapons'],
    defaultWeapons: ['laserWeapon', 'laserWeapon'],
    defaultComponents: ['advancedEngine', 'titaniumArmor', 'advancedRadar', 'advancedNavigation']
  },

  // Transport variants
  "transport-basic": {
    type: 'transport',
    name: 'C-130X Skyrider',
    description: 'Modified transport aircraft for rapid deployment of ground teams',
    baseCost: 3000000,
    baseStats: {
      speed: 50,
      armor: 60,
      firepower: 20,
      range: 80,
      capacity: 12,
    },
    crewRequirements: {
      pilot: 2,
      soldier: 2,
    },
    hardpoints: 2,
    componentSlots: 6,
    maintenanceCost: 75000,
    fuelCost: 15000,
    size: 4,
    defaultWeapons: ['vulcanCannon'],
    defaultComponents: ['basicEngine', 'basicArmor', 'basicNavigation', 'basicMedical', 'basicCargo']
  },
  "transport-heavy": {
    type: 'transport',
    name: 'C-17X Globemaster',
    description: 'Heavy transport with expanded capacity for troops and equipment',
    baseCost: 4200000,
    baseStats: {
      speed: 45,
      armor: 75,
      firepower: 25,
      range: 90,
      capacity: 20,
    },
    crewRequirements: {
      pilot: 2,
      soldier: 3,
      engineer: 1,
    },
    hardpoints: 3,
    componentSlots: 8,
    maintenanceCost: 100000,
    fuelCost: 20000,
    size: 6,
    variant: 'heavy',
    researchRequired: ['heavy-transport-systems'],
    defaultWeapons: ['vulcanCannon', 'jdamBomb'],
    defaultComponents: ['basicEngine', 'titaniumArmor', 'basicNavigation', 'advancedMedical', 'expandedCargo', 'expandedCargo']
  },
  "transport-stealth": {
    type: 'transport',
    name: 'V-22X Nighthawk',
    description: 'Stealth transport for covert operations and personnel extraction',
    baseCost: 5000000,
    baseStats: {
      speed: 60,
      armor: 50,
      firepower: 15,
      range: 70,
      capacity: 8,
    },
    crewRequirements: {
      pilot: 2,
      soldier: 1,
    },
    hardpoints: 1,
    componentSlots: 7,
    maintenanceCost: 85000,
    fuelCost: 14000,
    size: 3,
    variant: 'stealth',
    researchRequired: ['stealth-systems', 'covert-operations'],
    defaultWeapons: [],
    defaultComponents: ['advancedEngine', 'basicArmor', 'advancedRadar', 'advancedNavigation', 'advancedStealth', 'basicMedical']
  },
  "transport-medical": {
    type: 'transport',
    name: 'C-130M Medivac',
    description: 'Specialized medical transport with advanced field hospital',
    baseCost: 3800000,
    baseStats: {
      speed: 55,
      armor: 65,
      firepower: 10,
      range: 85,
      capacity: 10,
    },
    crewRequirements: {
      pilot: 2,
      medic: 3,
      engineer: 1,
    },
    hardpoints: 1,
    componentSlots: 7,
    maintenanceCost: 80000,
    fuelCost: 16000,
    size: 4,
    variant: 'medical',
    researchRequired: ['field-medicine'],
    defaultWeapons: ['vulcanCannon'],
    defaultComponents: ['basicEngine', 'titaniumArmor', 'basicNavigation', 'advancedMedical', 'advancedMedical', 'basicCargo']
  },

  // Scout variants
  "scout-basic": {
    type: 'scout',
    name: 'SR-71X Shadowhawk',
    description: 'High-altitude reconnaissance aircraft for UFO detection',
    baseCost: 2500000,
    baseStats: {
      speed: 90,
      armor: 30,
      firepower: 0,
      range: 90,
      capacity: 2,
    },
    crewRequirements: {
      pilot: 1,
    },
    hardpoints: 1,
    componentSlots: 5,
    maintenanceCost: 60000,
    fuelCost: 12000,
    size: 2,
    researchRequired: ['stealth-systems'],
    defaultWeapons: [],
    defaultComponents: ['advancedEngine', 'basicArmor', 'basicRadar', 'basicNavigation', 'basicStealth']
  },
  "scout-recon": {
    type: 'scout',
    name: 'RQ-180X Ghost',
    description: 'Advanced unmanned reconnaissance drone with superior sensors',
    baseCost: 3200000,
    baseStats: {
      speed: 95,
      armor: 20,
      firepower: 0,
      range: 120,
      capacity: 0,
    },
    crewRequirements: {
      pilot: 1, // Remote pilot
    },
    hardpoints: 0,
    componentSlots: 6,
    maintenanceCost: 55000,
    fuelCost: 10000,
    size: 2,
    variant: 'recon',
    researchRequired: ['drone-technology', 'advanced-sensors'],
    defaultWeapons: [],
    defaultComponents: ['advancedEngine', 'basicArmor', 'advancedRadar', 'advancedRadar', 'advancedNavigation', 'advancedStealth']
  },
  "scout-strike": {
    type: 'scout',
    name: 'MQ-9X Reaper',
    description: 'Scout variant with attack capabilities for light engagements',
    baseCost: 2800000,
    baseStats: {
      speed: 80,
      armor: 35,
      firepower: 40,
      range: 85,
      capacity: 0,
    },
    crewRequirements: {
      pilot: 1,
    },
    hardpoints: 3,
    componentSlots: 4,
    maintenanceCost: 65000,
    fuelCost: 13000,
    size: 2,
    variant: 'strike',
    researchRequired: ['drone-technology', 'precision-munitions'],
    defaultWeapons: ['sidewinderMissile', 'jdamBomb'],
    defaultComponents: ['advancedEngine', 'basicArmor', 'basicRadar', 'advancedNavigation']
  },
  "scout-hypersonic": {
    type: 'scout',
    name: 'X-43X Screamer',
    description: 'Experimental hypersonic scout with unprecedented speed',
    baseCost: 6000000,
    baseStats: {
      speed: 150,
      armor: 25,
      firepower: 0,
      range: 70,
      capacity: 1,
    },
    crewRequirements: {
      pilot: 1,
      engineer: 1,
    },
    hardpoints: 1,
    componentSlots: 4,
    maintenanceCost: 90000,
    fuelCost: 25000,
    size: 2,
    variant: 'hypersonic',
    researchRequired: ['scramjet-technology', 'advanced-materials'],
    defaultWeapons: [],
    defaultComponents: ['hypersonicEngine', 'titaniumArmor', 'advancedRadar', 'advancedNavigation']
  }
};

// Define available weapons
export const WEAPON_TYPES: Record<string, {
  name: string;
  type: WeaponType;
  damage: number;
  accuracy: number;
  range: number;
  ammoCapacity: number;
  reloadTime: number;
  cost: number;
  weight: number;
  armorPiercing?: number;
  explosiveRadius?: number;
  description: string;
  researchRequired?: string[];
}> = {
  vulcanCannon: {
    name: 'M61 Vulcan 20mm Cannon',
    type: 'cannon',
    damage: 60,
    accuracy: 70,
    range: 30,
    ammoCapacity: 500,
    reloadTime: 1,
    cost: 200000,
    weight: 1,
    description: 'Standard autocannon for air combat',
  },
  sidewinderMissile: {
    name: 'AIM-9 Sidewinder',
    type: 'missile',
    damage: 120,
    accuracy: 85,
    range: 60,
    ammoCapacity: 4,
    reloadTime: 4,
    cost: 400000,
    weight: 2,
    explosiveRadius: 5,
    description: 'Air-to-air heat seeking missile',
  },
  amraamMissile: {
    name: 'AIM-120 AMRAAM',
    type: 'missile',
    damage: 150,
    accuracy: 90,
    range: 100,
    ammoCapacity: 2,
    reloadTime: 6,
    cost: 800000,
    weight: 3,
    explosiveRadius: 7,
    description: 'Advanced medium-range air-to-air missile',
    researchRequired: ['advanced-guidance-systems'],
  },
  laserWeapon: {
    name: 'XL-1 Laser Cannon',
    type: 'laser',
    damage: 80,
    accuracy: 95,
    range: 80,
    ammoCapacity: 10,
    reloadTime: 2,
    cost: 1200000,
    weight: 2,
    armorPiercing: 40,
    description: 'Experimental directed energy weapon',
    researchRequired: ['directed-energy-weapons'],
  },
  plasmaCannon: {
    name: 'XP-1 Plasma Cannon',
    type: 'plasma',
    damage: 200,
    accuracy: 85,
    range: 50,
    ammoCapacity: 5,
    reloadTime: 8,
    cost: 2000000,
    weight: 4,
    armorPiercing: 80,
    description: 'Experimental high-energy plasma weapon',
    researchRequired: ['alien-power-systems', 'plasma-containment'],
  },
  jdamBomb: {
    name: 'JDAM Guided Bomb',
    type: 'bomb',
    damage: 250,
    accuracy: 90,
    range: 40,
    ammoCapacity: 2,
    reloadTime: 12,
    cost: 300000,
    weight: 4,
    explosiveRadius: 15,
    description: 'Joint Direct Attack Munition for ground targets',
  },
  torpedoWeapon: {
    name: 'Mk-48 Torpedo',
    type: 'torpedo',
    damage: 300,
    accuracy: 75,
    range: 30,
    ammoCapacity: 2,
    reloadTime: 10,
    cost: 350000,
    weight: 5,
    explosiveRadius: 10,
    description: 'Anti-submarine torpedo for naval targets',
  }
};

// Define available components
export const COMPONENT_TYPES: Record<string, {
  name: string;
  type: ComponentType;
  level: number;
  maintenanceInterval: number;
  cost: number;
  stats: Partial<VehicleStats>;
  description: string;
  researchRequired?: string[];
}> = {
  // Engines
  basicEngine: {
    name: 'Baseline Jet Engine',
    type: 'engine',
    level: 1,
    maintenanceInterval: 100,
    cost: 200000,
    stats: { speed: 10, range: 10 },
    description: 'Standard jet engine for aircraft',
  },
  advancedEngine: {
    name: 'Advanced Turbofan',
    type: 'engine',
    level: 2,
    maintenanceInterval: 120,
    cost: 500000,
    stats: { speed: 20, range: 20 },
    description: 'High-performance turbofan engine',
    researchRequired: ['advanced-propulsion'],
  },
  hypersonicEngine: {
    name: 'Hypersonic Scramjet',
    type: 'engine',
    level: 4,
    maintenanceInterval: 80,
    cost: 1500000,
    stats: { speed: 40, range: 15 },
    description: 'Experimental hypersonic engine',
    researchRequired: ['scramjet-technology'],
  },
  
  // Armor
  basicArmor: {
    name: 'Composite Plating',
    type: 'armor',
    level: 1,
    maintenanceInterval: 200,
    cost: 150000,
    stats: { armor: 15 },
    description: 'Standard composite armor plating',
  },
  titaniumArmor: {
    name: 'Titanium-Ceramic Armor',
    type: 'armor',
    level: 2,
    maintenanceInterval: 250,
    cost: 400000,
    stats: { armor: 30, speed: -5 },
    description: 'Advanced titanium-ceramic composite armor',
    researchRequired: ['advanced-materials'],
  },
  alienAlloyArmor: {
    name: 'Alien Alloy Plating',
    type: 'armor',
    level: 4,
    maintenanceInterval: 300,
    cost: 1000000,
    stats: { armor: 60 },
    description: 'Reverse-engineered alien alloy armor',
    researchRequired: ['alien-materials'],
  },
  
  // Radar systems
  basicRadar: {
    name: 'Standard Radar Array',
    type: 'radar',
    level: 1,
    maintenanceInterval: 150,
    cost: 100000,
    stats: { range: 15 },
    description: 'Basic radar detection system',
  },
  advancedRadar: {
    name: 'AESA Radar System',
    type: 'radar',
    level: 3,
    maintenanceInterval: 180,
    cost: 350000,
    stats: { range: 30 },
    description: 'Active Electronically Scanned Array radar system',
    researchRequired: ['advanced-sensors'],
  },
  
  // Navigation
  basicNavigation: {
    name: 'GPS Navigation',
    type: 'navigation',
    level: 1,
    maintenanceInterval: 300,
    cost: 50000,
    stats: { range: 5 },
    description: 'Standard GPS navigation system',
  },
  advancedNavigation: {
    name: 'Inertial Navigation System',
    type: 'navigation',
    level: 2,
    maintenanceInterval: 400,
    cost: 120000,
    stats: { range: 10, speed: 5 },
    description: 'Advanced inertial navigation with GPS backup',
    researchRequired: ['inertial-guidance'],
  },
  
  // Stealth
  basicStealth: {
    name: 'Radar Absorbing Paint',
    type: 'stealth',
    level: 1,
    maintenanceInterval: 100,
    cost: 200000,
    stats: {},
    description: 'Basic radar-absorbing coating',
  },
  advancedStealth: {
    name: 'Stealth Geometry',
    type: 'stealth',
    level: 3,
    maintenanceInterval: 150,
    cost: 800000,
    stats: { speed: -5 },
    description: 'Advanced stealth geometry and materials',
    researchRequired: ['stealth-systems'],
  },
  
  // Medical
  basicMedical: {
    name: 'First Aid Kit',
    type: 'medical',
    level: 1,
    maintenanceInterval: 100,
    cost: 30000,
    stats: { capacity: 1 },
    description: 'Basic medical supplies',
  },
  advancedMedical: {
    name: 'Field Hospital',
    type: 'medical',
    level: 3,
    maintenanceInterval: 100,
    cost: 150000,
    stats: { capacity: 3 },
    description: 'Mobile field hospital for combat casualties',
    researchRequired: ['field-medicine'],
  },
  
  // Cargo
  basicCargo: {
    name: 'Cargo Bay',
    type: 'cargo',
    level: 1,
    maintenanceInterval: 200,
    cost: 50000,
    stats: { capacity: 5 },
    description: 'Standard cargo storage',
  },
  expandedCargo: {
    name: 'Expanded Cargo Bay',
    type: 'cargo',
    level: 2,
    maintenanceInterval: 200,
    cost: 100000,
    stats: { capacity: 10, speed: -5 },
    description: 'Expanded cargo capacity',
  }
};

// Get base vehicle type from variant
export function getBaseVehicleType(variantKey: string): VehicleType {
  const variant = VEHICLE_TYPES[variantKey];
  return variant ? variant.type : 'interceptor';
}

// Get a list of all variants for a specific vehicle type
export function getVariantsByType(vehicleType: VehicleType): string[] {
  return Object.keys(VEHICLE_TYPES).filter(key => VEHICLE_TYPES[key].type === vehicleType);
}

// Get available upgrades for a specific vehicle
export function getAvailableUpgrades(currentVariantKey: string, completedResearch: string[]): string[] {
  const currentVariant = VEHICLE_TYPES[currentVariantKey];
  
  // If the variant doesn't exist, return empty array
  if (!currentVariant) {
    return [];
  }
  
  // Find all variants of the same type
  const sameTypeVariants = getVariantsByType(currentVariant.type);
  
  // Filter out variants that don't meet research requirements or are the current variant
  return sameTypeVariants.filter(variantKey => {
    // Skip the current variant
    if (variantKey === currentVariantKey) return false;
    
    const variant = VEHICLE_TYPES[variantKey];
    
    // If no research required, always available
    if (!variant.researchRequired || variant.researchRequired.length === 0) {
      return true;
    }
    
    // Check if all required research is completed
    return variant.researchRequired.every(research => completedResearch.includes(research));
  });
}

// Enhanced function to generate vehicles with weapons and components
export function generateVehicle(variantKey: string, baseId: string): Vehicle {
  const vehicleVariant = VEHICLE_TYPES[variantKey];
  
  if (!vehicleVariant) {
    throw new Error(`Unknown vehicle variant: ${variantKey}`);
  }
  
  // Generate default weapons based on the variant
  let defaultWeapons: VehicleWeapon[] = [];
  if (vehicleVariant.defaultWeapons && vehicleVariant.defaultWeapons.length > 0) {
    defaultWeapons = vehicleVariant.defaultWeapons.map(weaponType => createWeapon(weaponType));
  }
  
  // Generate default components based on the variant
  let defaultComponents: VehicleComponent[] = [];
  if (vehicleVariant.defaultComponents && vehicleVariant.defaultComponents.length > 0) {
    defaultComponents = vehicleVariant.defaultComponents.map(componentType => createComponent(componentType));
  }
  
  return {
    id: crypto.randomUUID(),
    type: vehicleVariant.type,
    name: `${vehicleVariant.name} ${Math.floor(Math.random() * 1000)}`,
    status: 'ready',
    condition: 100,
    crew: [],
    baseId,
    stats: { ...vehicleVariant.baseStats },
    maintenance: vehicleVariant.maintenanceCost,
    fuelCost: vehicleVariant.fuelCost,
    weapons: defaultWeapons,
    components: defaultComponents,
    hardpoints: vehicleVariant.hardpoints,
    componentSlots: vehicleVariant.componentSlots
  };
}

// Upgrade a vehicle to a different variant
export function upgradeVehicle(
  vehicle: Vehicle, 
  targetVariantKey: string, 
  keepComponents: boolean = true
): { 
  success: boolean, 
  message: string, 
  vehicle?: Vehicle, 
  cost?: number 
} {
  // Get the current variant key
  const currentVariantKey = Object.keys(VEHICLE_TYPES).find(key => {
    const variant = VEHICLE_TYPES[key];
    return variant.type === vehicle.type && 
           variant.baseStats.speed === vehicle.stats.speed &&
           variant.baseStats.armor === vehicle.stats.armor;
  });
  
  if (!currentVariantKey) {
    return { 
      success: false, 
      message: 'Cannot determine current vehicle variant' 
    };
  }
  
  const targetVariant = VEHICLE_TYPES[targetVariantKey];
  if (!targetVariant) {
    return { 
      success: false, 
      message: `Unknown vehicle variant: ${targetVariantKey}` 
    };
  }
  
  // Check if the target variant is of the same basic type
  if (targetVariant.type !== vehicle.type) {
    return { 
      success: false, 
      message: `Cannot upgrade ${vehicle.type} to ${targetVariant.type} type` 
    };
  }
  
  // Calculate upgrade cost based on the difference in base cost and condition
  const currentVariant = VEHICLE_TYPES[currentVariantKey];
  const costDifference = targetVariant.baseCost - currentVariant.baseCost;
  const conditionFactor = vehicle.condition / 100; // Better condition means higher trade-in value
  const upgradeCost = Math.max(0, costDifference + (targetVariant.baseCost * 0.2 * (1 - conditionFactor)));
  
  // Create a new vehicle of the target variant type
  const upgradedVehicle = generateVehicle(targetVariantKey, vehicle.baseId);
  
  // Transfer crew
  upgradedVehicle.crew = [...vehicle.crew];
  
  // Optionally transfer compatible components
  if (keepComponents) {
    // Only keep components that fit in the new slot count
    const compatibleComponents = vehicle.components.slice(0, upgradedVehicle.componentSlots);
    upgradedVehicle.components = compatibleComponents;
  }
  
  // Update stats based on components
  updateVehicleStats(upgradedVehicle);
  
  return { 
    success: true, 
    message: `Upgraded ${vehicle.name} to ${upgradedVehicle.name}`, 
    vehicle: upgradedVehicle, 
    cost: Math.round(upgradeCost) 
  };
}

// Create a weapon instance
export function createWeapon(weaponTypeId: string): VehicleWeapon {
  const weaponTemplate = WEAPON_TYPES[weaponTypeId];
  if (!weaponTemplate) {
    throw new Error(`Unknown weapon type: ${weaponTypeId}`);
  }
  
  return {
    id: crypto.randomUUID(),
    name: weaponTemplate.name,
    type: weaponTemplate.type,
    damage: weaponTemplate.damage,
    accuracy: weaponTemplate.accuracy,
    range: weaponTemplate.range,
    ammoCapacity: weaponTemplate.ammoCapacity,
    currentAmmo: weaponTemplate.ammoCapacity, // Start with full ammo
    reloadTime: weaponTemplate.reloadTime,
    cost: weaponTemplate.cost,
    weight: weaponTemplate.weight,
    armorPiercing: weaponTemplate.armorPiercing,
    explosiveRadius: weaponTemplate.explosiveRadius,
    researchRequired: weaponTemplate.researchRequired
  };
}

// Create a component instance
export function createComponent(componentTypeId: string): VehicleComponent {
  const componentTemplate = COMPONENT_TYPES[componentTypeId];
  if (!componentTemplate) {
    throw new Error(`Unknown component type: ${componentTypeId}`);
  }
  
  return {
    id: crypto.randomUUID(),
    name: componentTemplate.name,
    type: componentTemplate.type,
    level: componentTemplate.level,
    condition: 100, // Start with perfect condition
    installDate: new Date(),
    maintenanceInterval: componentTemplate.maintenanceInterval,
    hoursSinceLastMaintenance: 0,
    cost: componentTemplate.cost,
    stats: { ...componentTemplate.stats },
    researchRequired: componentTemplate.researchRequired
  };
}

// Function to assign crew members to a vehicle
export function assignCrewToVehicle(vehicle: Vehicle, personnel: Personnel): Vehicle {
  // Check if the vehicle already has this crew member
  if (vehicle.crew.some(crewMember => crewMember.id === personnel.id)) {
    return vehicle;
  }
  
  // Check crew requirements
  const vehicleType = VEHICLE_TYPES[vehicle.type];
  const currentPilots = vehicle.crew.filter(p => p.role === 'pilot').length;
  const currentSoldiers = vehicle.crew.filter(p => p.role === 'soldier').length;
  
  // Validate assignment based on role
  if (personnel.role === 'pilot') {
    if (currentPilots >= vehicleType.crewRequirements.pilot) {
      throw new Error(`Vehicle already has the maximum number of pilots (${vehicleType.crewRequirements.pilot})`);
    }
  } else if (personnel.role === 'soldier') {
    const requiredSoldiers = vehicleType.crewRequirements.soldier || 0;
    if (currentSoldiers >= requiredSoldiers) {
      throw new Error(`Vehicle already has the maximum number of soldiers (${requiredSoldiers})`);
    }
  } else {
    throw new Error(`Personnel with role ${personnel.role} cannot be assigned to this vehicle`);
  }
  
  // Update the vehicle and add the crew member
  vehicle.crew.push(personnel);
  
  return vehicle;
}

// Function to remove a crew member from a vehicle
export function removeCrewFromVehicle(vehicle: Vehicle, personnelId: string): Vehicle {
  const crewIndex = vehicle.crew.findIndex(p => p.id === personnelId);
  
  if (crewIndex === -1) {
    return vehicle; // Personnel not found in crew
  }
  
  // Remove the crew member
  vehicle.crew.splice(crewIndex, 1);
  
  return vehicle;
}

// Calculate the effectiveness of a pilot in a specific vehicle based on specialization
export function calculatePilotEffectiveness(pilot: Personnel, vehicleType: VehicleType): number {
  if (pilot.role !== 'pilot') {
    return 0;
  }
  
  // Base effectiveness from pilot's piloting skill
  let effectiveness = pilot.skills.piloting;
  
  // Add bonuses from pilot attributes if they exist
  if (pilot.pilotAttributes) {
    // Different vehicle types benefit from different attributes
    if (vehicleType === 'interceptor') {
      effectiveness += (pilot.pilotAttributes.reflexes * 0.3);
      effectiveness += (pilot.pilotAttributes.combatAwareness * 0.4);
    } else if (vehicleType === 'transport') {
      effectiveness += (pilot.pilotAttributes.stressHandling * 0.3);
      effectiveness += (pilot.pilotAttributes.technicalAptitude * 0.3);
    } else if (vehicleType === 'scout') {
      effectiveness += (pilot.pilotAttributes.reflexes * 0.2);
      effectiveness += (pilot.pilotAttributes.technicalAptitude * 0.2);
    }
  }
  
  // Add specialization bonus if the pilot is specialized in this vehicle type
  if (pilot.vehicleSpecialization && pilot.vehicleSpecialization.vehicleType === vehicleType) {
    // Add bonus based on proficiency and training level
    const { proficiency, trainingLevel } = pilot.vehicleSpecialization;
    
    // Apply proficiency bonus
    effectiveness += proficiency * 0.5;
    
    // Apply training level bonus
    if (trainingLevel === 'advanced') {
      effectiveness += 10;
    } else if (trainingLevel === 'expert') {
      effectiveness += 25;
    }
  }
  
  return effectiveness;
}

// Calculate performance modifiers for a vehicle based on its crew
export function calculateVehiclePerformance(vehicle: Vehicle): {
  speedModifier: number;
  firepowerModifier: number;
  rangeModifier: number;
} {
  const pilots = vehicle.crew.filter(p => p.role === 'pilot');
  const vehicleType = vehicle.type;
  
  // Default modifiers (no bonuses)
  const defaultModifiers = {
    speedModifier: 1,
    firepowerModifier: 1,
    rangeModifier: 1,
  };
  
  // If no pilots, severe penalty
  if (pilots.length === 0) {
    return {
      speedModifier: 0.5,
      firepowerModifier: 0.5,
      rangeModifier: 0.5,
    };
  }
  
  // Calculate average pilot effectiveness
  const totalEffectiveness = pilots.reduce((sum, pilot) => {
    return sum + calculatePilotEffectiveness(pilot, vehicleType);
  }, 0);
  
  const avgEffectiveness = totalEffectiveness / pilots.length;
  
  // Convert effectiveness to modifiers (effectiveness of 100 = +20% bonus)
  const performanceBonus = (avgEffectiveness - 50) / 250; // -0.2 to +0.2 range
  
  return {
    speedModifier: 1 + performanceBonus,
    firepowerModifier: 1 + performanceBonus,
    rangeModifier: 1 + performanceBonus,
  };
}

// Function to calculate maintenance requirements based on condition and crew
export function calculateMaintenanceCost(vehicle: Vehicle): number {
  const baseMaintenanceCost = VEHICLE_TYPES[vehicle.type].maintenanceCost;
  
  // Condition factor: Lower condition means higher maintenance
  const conditionFactor = 2 - (vehicle.condition / 100);
  
  // Find engineers in crew who can reduce maintenance costs
  const engineers = vehicle.crew.filter(p => p.role === 'engineer');
  let engineerBonus = 1;
  
  if (engineers.length > 0) {
    // Each engineer can reduce maintenance by up to 15% based on their engineering skill
    const totalEngineeringSkill = engineers.reduce((sum, engineer) => {
      return sum + engineer.skills.engineering;
    }, 0);
    
    // Max 30% reduction with highly skilled engineers
    engineerBonus = Math.max(0.7, 1 - (totalEngineeringSkill / 500));
  }
  
  return Math.round(baseMaintenanceCost * conditionFactor * engineerBonus);
}

// Add a new weapon to a vehicle
export function addWeaponToVehicle(vehicle: Vehicle, weaponTypeId: string): { 
  success: boolean, 
  message: string, 
  vehicle: Vehicle 
} {
  // Check if the weapon type exists
  if (!WEAPON_TYPES[weaponTypeId]) {
    return { 
      success: false, 
      message: `Unknown weapon type: ${weaponTypeId}`, 
      vehicle 
    };
  }
  
  // Check if research requirements are met (would need to check against completed research)
  const weaponTemplate = WEAPON_TYPES[weaponTypeId];
  
  // Check if the vehicle has available hardpoints
  if (vehicle.weapons.length >= vehicle.hardpoints) {
    return { 
      success: false, 
      message: 'No available hardpoints for additional weapons', 
      vehicle 
    };
  }
  
  // Create and add the weapon
  const newWeapon = createWeapon(weaponTypeId);
  vehicle.weapons.push(newWeapon);
  
  // Recalculate vehicle stats
  updateVehicleStats(vehicle);
  
  return { 
    success: true, 
    message: `${newWeapon.name} added to ${vehicle.name}`, 
    vehicle 
  };
}

// Remove a weapon from a vehicle
export function removeWeaponFromVehicle(vehicle: Vehicle, weaponId: string): { 
  success: boolean, 
  message: string, 
  vehicle: Vehicle, 
  removedWeapon?: VehicleWeapon 
} {
  const weaponIndex = vehicle.weapons.findIndex(w => w.id === weaponId);
  
  if (weaponIndex === -1) {
    return { 
      success: false, 
      message: 'Weapon not found on vehicle', 
      vehicle 
    };
  }
  
  const removedWeapon = vehicle.weapons[weaponIndex];
  vehicle.weapons.splice(weaponIndex, 1);
  
  // Recalculate vehicle stats
  updateVehicleStats(vehicle);
  
  return { 
    success: true, 
    message: `${removedWeapon.name} removed from ${vehicle.name}`, 
    vehicle, 
    removedWeapon 
  };
}

// Add a component to a vehicle
export function addComponentToVehicle(vehicle: Vehicle, componentTypeId: string): { 
  success: boolean, 
  message: string, 
  vehicle: Vehicle 
} {
  // Check if the component type exists
  if (!COMPONENT_TYPES[componentTypeId]) {
    return { 
      success: false, 
      message: `Unknown component type: ${componentTypeId}`, 
      vehicle 
    };
  }
  
  // Check if research requirements are met (would need to check against completed research)
  const componentTemplate = COMPONENT_TYPES[componentTypeId];
  
  // Check if the vehicle has available component slots
  if (vehicle.components.length >= vehicle.componentSlots) {
    return { 
      success: false, 
      message: 'No available slots for additional components', 
      vehicle 
    };
  }
  
  // Check if there's already a component of this type
  // Some component types like engines should replace existing ones
  const existingComponentIndex = vehicle.components.findIndex(
    c => c.type === componentTemplate.type
  );
  
  if (existingComponentIndex !== -1) {
    // For simplicity, we'll replace the component (could also have an error or confirm)
    vehicle.components.splice(existingComponentIndex, 1);
  }
  
  // Create and add the component
  const newComponent = createComponent(componentTypeId);
  vehicle.components.push(newComponent);
  
  // Recalculate vehicle stats
  updateVehicleStats(vehicle);
  
  return { 
    success: true, 
    message: `${newComponent.name} installed on ${vehicle.name}`, 
    vehicle 
  };
}

// Remove a component from a vehicle
export function removeComponentFromVehicle(vehicle: Vehicle, componentId: string): { 
  success: boolean, 
  message: string, 
  vehicle: Vehicle, 
  removedComponent?: VehicleComponent
} {
  const componentIndex = vehicle.components.findIndex(c => c.id === componentId);
  
  if (componentIndex === -1) {
    return { 
      success: false, 
      message: 'Component not found on vehicle', 
      vehicle 
    };
  }
  
  const removedComponent = vehicle.components[componentIndex];
  vehicle.components.splice(componentIndex, 1);
  
  // Recalculate vehicle stats
  updateVehicleStats(vehicle);
  
  return { 
    success: true, 
    message: `${removedComponent.name} removed from ${vehicle.name}`, 
    vehicle, 
    removedComponent 
  };
}

// Update vehicle stats based on components
export function updateVehicleStats(vehicle: Vehicle): Vehicle {
  // Start with base stats from vehicle type
  const baseStats = { ...VEHICLE_TYPES[vehicle.type].baseStats };
  
  // Apply component stat effects
  vehicle.components.forEach(component => {
    if (component.stats) {
      Object.entries(component.stats).forEach(([stat, value]) => {
        if (stat in baseStats && typeof value === 'number') {
          baseStats[stat as keyof VehicleStats] += value;
        }
      });
    }
  });
  
  // Calculate firepower from weapons
  let totalFirepower = 0;
  vehicle.weapons.forEach(weapon => {
    // Calculate a firepower value based on weapon stats
    const weaponFirepower = (weapon.damage * weapon.accuracy * weapon.range) / 100;
    totalFirepower += weaponFirepower;
  });
  
  // Update firepower stat if we have weapons, otherwise keep base firepower
  if (vehicle.weapons.length > 0) {
    baseStats.firepower = Math.round(totalFirepower);
  }
  
  // Ensure no stats go below minimum values
  baseStats.speed = Math.max(10, baseStats.speed);
  baseStats.armor = Math.max(5, baseStats.armor);
  baseStats.range = Math.max(10, baseStats.range);
  baseStats.capacity = Math.max(1, baseStats.capacity);
  
  // Update vehicle stats
  vehicle.stats = baseStats;
  
  return vehicle;
}

// Reload all weapons on a vehicle
export function reloadVehicleWeapons(vehicle: Vehicle): { 
  success: boolean, 
  message: string, 
  vehicle: Vehicle, 
  cost: number 
} {
  let totalCost = 0;
  let reloadedCount = 0;
  
  vehicle.weapons.forEach(weapon => {
    if (weapon.currentAmmo < weapon.ammoCapacity) {
      // Calculate ammo cost based on weapon type and amount needed
      const ammoNeeded = weapon.ammoCapacity - weapon.currentAmmo;
      const ammoCostPerUnit = weapon.cost * 0.01; // 1% of weapon cost per ammo unit
      const reloadCost = Math.round(ammoNeeded * ammoCostPerUnit);
      
      // Update ammo and add to total cost
      weapon.currentAmmo = weapon.ammoCapacity;
      totalCost += reloadCost;
      reloadedCount++;
    }
  });
  
  return { 
    success: true, 
    message: reloadedCount > 0 ? 
      `Reloaded ${reloadedCount} weapons on ${vehicle.name} for $${totalCost.toLocaleString()}` : 
      'All weapons are already fully loaded', 
    vehicle, 
    cost: totalCost 
  };
}

// Perform maintenance on all vehicle components
export function performVehicleMaintenance(vehicle: Vehicle): { 
  success: boolean, 
  message: string, 
  vehicle: Vehicle, 
  cost: number 
} {
  let totalCost = 0;
  let maintenanceNeeded = false;
  
  // Reset components maintenance hours
  vehicle.components.forEach(component => {
    if (component.hoursSinceLastMaintenance > 0) {
      // Calculate maintenance cost based on component value and condition
      const maintenanceCost = Math.round(component.cost * 0.05); // 5% of component cost
      
      // Reset maintenance counter
      component.hoursSinceLastMaintenance = 0;
      
      totalCost += maintenanceCost;
      maintenanceNeeded = true;
    }
    
    // Also restore some condition
    if (component.condition < 100) {
      const repairAmount = 10; // Restore 10% condition
      component.condition = Math.min(100, component.condition + repairAmount);
      maintenanceNeeded = true;
    }
  });
  
  return { 
    success: true, 
    message: maintenanceNeeded ? 
      `Performed maintenance on ${vehicle.name} components for $${totalCost.toLocaleString()}` : 
      'No maintenance currently needed for vehicle components', 
    vehicle, 
    cost: totalCost 
  };
}

// Calculate total maintenance cost for a vehicle, including components
export function calculateTotalMaintenanceCost(vehicle: Vehicle): number {
  // Get base maintenance from our existing function
  const baseMaintenance = calculateMaintenanceCost(vehicle);
  
  // Add component-specific maintenance costs
  const componentMaintenanceCost = vehicle.components.reduce((total, component) => {
    // More worn components cost more to maintain
    const wearFactor = 1 + (component.hoursSinceLastMaintenance / component.maintenanceInterval) * 0.5;
    const componentCost = Math.round((component.cost * 0.01) * wearFactor); // 1% of cost + wear factor
    return total + componentCost;
  }, 0);
  
  // Add weapon maintenance costs
  const weaponMaintenanceCost = vehicle.weapons.reduce((total, weapon) => {
    const weaponCost = Math.round(weapon.cost * 0.005); // 0.5% of weapon cost
    return total + weaponCost;
  }, 0);
  
  return Math.round(baseMaintenance + componentMaintenanceCost + weaponMaintenanceCost);
}