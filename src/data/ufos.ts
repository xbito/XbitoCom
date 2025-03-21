import { UFO, UFOType, UFOMission } from '../types';

export const UFO_TYPES: Record<UFOType, {
  name: string;
  description: string;
  size: number;
  baseSpeed: number;
  baseArmor: number;
  baseWeapons: number;
  baseStealth: number;
  threatLevel: number;
  possibleMissions: UFOMission[];
  researchValue: number;
  salvageValue: number;
}> = {
  scout: {
    name: 'Scout UFO',
    description: 'Small, fast reconnaissance craft',
    size: 1,
    baseSpeed: 90,
    baseArmor: 30,
    baseWeapons: 20,
    baseStealth: 80,
    threatLevel: 1,
    possibleMissions: ['reconnaissance', 'infiltration'],
    researchValue: 500,
    salvageValue: 200000
  },
  fighter: {
    name: 'Fighter UFO',
    description: 'Aggressive combat vessel',
    size: 2,
    baseSpeed: 80,
    baseArmor: 60,
    baseWeapons: 70,
    baseStealth: 50,
    threatLevel: 2,
    possibleMissions: ['attack', 'reconnaissance'],
    researchValue: 800,
    salvageValue: 500000
  },
  transport: {
    name: 'Transport UFO',
    description: 'Large vessel for moving alien forces',
    size: 3,
    baseSpeed: 50,
    baseArmor: 70,
    baseWeapons: 40,
    baseStealth: 30,
    threatLevel: 3,
    possibleMissions: ['abduction', 'infiltration'],
    researchValue: 1000,
    salvageValue: 800000
  },
  harvester: {
    name: 'Harvester UFO',
    description: 'Resource collection vessel',
    size: 4,
    baseSpeed: 40,
    baseArmor: 80,
    baseWeapons: 50,
    baseStealth: 40,
    threatLevel: 3,
    possibleMissions: ['harvest', 'abduction'],
    researchValue: 1200,
    salvageValue: 1000000
  },
  mothership: {
    name: 'Mothership',
    description: 'Massive command and control vessel',
    size: 5,
    baseSpeed: 30,
    baseArmor: 100,
    baseWeapons: 100,
    baseStealth: 60,
    threatLevel: 5,
    possibleMissions: ['attack', 'abduction', 'harvest'],
    researchValue: 2000,
    salvageValue: 2000000
  }
};

export const MISSION_DESCRIPTIONS: Record<UFOMission, string> = {
  reconnaissance: 'Gathering intelligence on Earth defenses',
  abduction: 'Capturing human subjects for experimentation',
  attack: 'Direct assault on human installations',
  harvest: 'Collecting Earth resources',
  infiltration: 'Covert insertion of alien agents'
};

export function generateUFO(
  gameDate: Date,
  threatLevel: number,
  completedResearch: string[]
): UFO {
  // Calculate probability weights based on threat level and game progress
  const weights = calculateTypeWeights(threatLevel, completedResearch);
  
  // Select UFO type based on weights
  const type = selectWeightedType(weights);
  const ufoType = UFO_TYPES[type];
  
  // Select mission based on UFO type
  const mission = ufoType.possibleMissions[
    Math.floor(Math.random() * ufoType.possibleMissions.length)
  ];
  
  // Calculate advanced stats based on game progress
  const progressMultiplier = 1 + (threatLevel * 0.1);
  
  // Generate random spawn location
  const location = generateSpawnLocation();
  
  return {
    id: crypto.randomUUID(),
    type,
    name: `${ufoType.name} ${Math.floor(Math.random() * 1000)}`,
    size: ufoType.size,
    speed: Math.floor(ufoType.baseSpeed * progressMultiplier),
    armor: Math.floor(ufoType.baseArmor * progressMultiplier),
    weapons: Math.floor(ufoType.baseWeapons * progressMultiplier),
    stealthRating: Math.floor(ufoType.baseStealth * progressMultiplier),
    status: 'approaching',
    location,
    mission,
    detectedBy: null,
    interceptedBy: null
  };
}

function calculateTypeWeights(
  threatLevel: number,
  completedResearch: string[]
): Record<UFOType, number> {
  const weights: Record<UFOType, number> = {
    scout: 1,
    fighter: 0,
    transport: 0,
    harvester: 0,
    mothership: 0
  };

  // Adjust weights based on threat level
  if (threatLevel >= 2) weights.fighter = 0.5;
  if (threatLevel >= 3) weights.transport = 0.3;
  if (threatLevel >= 4) weights.harvester = 0.2;
  if (threatLevel >= 5) weights.mothership = 0.1;

  // Increase weights based on research
  if (completedResearch.includes('advanced-radar')) {
    weights.fighter *= 1.2;
    weights.transport *= 1.2;
  }
  if (completedResearch.includes('alien-propulsion')) {
    weights.harvester *= 1.3;
    weights.mothership *= 1.2;
  }

  return weights;
}

function selectWeightedType(weights: Record<UFOType, number>): UFOType {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (const [type, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) return type as UFOType;
  }
  
  return 'scout'; // Fallback
}

function generateSpawnLocation() {
  // Generate random edge location
  const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
  let x, y;
  
  switch (edge) {
    case 0: // top
      x = Math.random() * 100;
      y = 0;
      break;
    case 1: // right
      x = 100;
      y = Math.random() * 100;
      break;
    case 2: // bottom
      x = Math.random() * 100;
      y = 100;
      break;
    default: // left
      x = 0;
      y = Math.random() * 100;
  }
  
  return {
    x,
    y,
    altitude: 30000 + Math.random() * 20000 // Between 30,000 and 50,000 feet
  };
}