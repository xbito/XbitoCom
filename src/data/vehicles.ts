import { 
  VehicleType, 
  Vehicle, 
  Personnel, 
  VehicleStats 
} from '../types';

// Define base vehicle types
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
  size: number;
  researchRequired?: string[];
}> = {
  "interceptor-basic": {
    type: 'interceptor',
    name: 'F-35X Interceptor',
    description: 'Advanced fighter aircraft modified for high-altitude UFO interception',
    baseCost: 2000000,
    baseStats: {
      speed: 80,
      armor: 40,
      range: 60,
      capacity: 2,
    },
    crewRequirements: {
      pilot: 1,
    },
    size: 2
  },
  "transport-basic": {
    type: 'transport',
    name: 'C-130X Skyrider',
    description: 'Modified transport aircraft for rapid deployment of ground teams',
    baseCost: 3000000,
    baseStats: {
      speed: 50,
      armor: 60,
      range: 80,
      capacity: 12,
    },
    crewRequirements: {
      pilot: 2,
      soldier: 2,
    },
    size: 4
  },
  "scout-basic": {
    type: 'scout',
    name: 'A-12X Scout',
    description: 'Standard reconnaissance aircraft for initial UFO detection missions',
    baseCost: 1500000,
    baseStats: {
      speed: 75,
      armor: 25,
      range: 70,
      capacity: 2,
    },
    crewRequirements: {
      pilot: 1,
    },
    size: 2
  }
};

// Get base vehicle type
export function getBaseVehicleType(variantKey: string): VehicleType {
  const variant = VEHICLE_TYPES[variantKey];
  return variant ? variant.type : 'scout';
}

// Get a list of all variants for a specific vehicle type
export function getVariantsByType(vehicleType: VehicleType): string[] {
  return Object.entries(VEHICLE_TYPES)
    .filter(([, variant]) => variant.type === vehicleType)
    .map(([key]) => key);
}

// Generate a new vehicle instance
export function generateVehicle(variantKey: string, baseId: string): Vehicle {
  const vehicleVariant = VEHICLE_TYPES[variantKey];
  
  if (!vehicleVariant) {
    throw new Error(`Unknown vehicle variant: ${variantKey}`);
  }
  
  return {
    id: crypto.randomUUID(),
    type: vehicleVariant.type,
    name: `${vehicleVariant.name} ${Math.floor(Math.random() * 1000)}`,
    status: 'ready',
    condition: 100,
    crew: [],
    baseId,
    stats: { ...vehicleVariant.baseStats }
  };
}

// Calculate pilot effectiveness in a specific vehicle
export function calculatePilotEffectiveness(pilot: Personnel, vehicleType: VehicleType): number {
  // Base effectiveness from piloting skill (0-100)
  let effectiveness = pilot.skills.piloting;
  
  // Add bonuses from pilot attributes if they exist
  if (pilot.pilotAttributes) {
    effectiveness += pilot.pilotAttributes.reflexes * 0.2;
    effectiveness += pilot.pilotAttributes.technicalAptitude * 0.2;
    effectiveness += pilot.pilotAttributes.combatAwareness * 0.2;
    effectiveness += pilot.pilotAttributes.stressHandling * 0.2;
  }
  
  // Add specialization bonus
  if (pilot.vehicleSpecialization && pilot.vehicleSpecialization.vehicleType === vehicleType) {
    effectiveness += pilot.vehicleSpecialization.proficiency * 0.3;
  }
  
  // Normalize to 0-100 range
  return Math.min(100, Math.max(0, effectiveness));
}

// Calculate vehicle performance modifiers based on crew
export function calculateVehiclePerformance(vehicle: Vehicle): {
  speedModifier: number;
  rangeModifier: number;
} {
  const pilots = vehicle.crew.filter(p => p.role === 'pilot');
  const vehicleType = vehicle.type;
  
  // If no pilots, severe penalty
  if (pilots.length === 0) {
    return {
      speedModifier: 0.5,
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
    rangeModifier: 1 + performanceBonus,
  };
}