import { UFO, UFOType, GameState, UFOTypeDefinition } from '../types';
import { generateTrajectory } from '../utils/trajectory';
import { UFO_COLORS } from './visual';

const SPAWN_CHANCE = 0.3;
const FIRST_SPAWN_TURN = 2;
const INITIAL_DATE = new Date('2025-01-01');

export const UFO_TYPES: Record<UFOType, UFOTypeDefinition> = {
  scout: {
    name: 'Scout UFO',
    description: 'Small, fast reconnaissance craft designed for stealth observation. Often automated.',
    size: 1,
    baseSpeed: 90,
    baseArmor: 30,
    baseWeapons: 20,
    baseStealth: 80,
    threatLevel: 1,
    automated: true,
    shape: 'triangle',
    color: UFO_COLORS.SCOUT_BLUE,
    crewRequirements: {
      pilots: 1,
      maxPilots: 2,
      maxScientists: 2,
      totalCapacity: 4
    }
  },
  fighter: {
    name: 'Fighter UFO',
    description: 'Aggressive combat vessel with advanced weapons systems.',
    size: 2,
    baseSpeed: 80,
    baseArmor: 60,
    baseWeapons: 70,
    baseStealth: 50,
    threatLevel: 2,
    automated: false,
    crewRequirements: {
      pilots: 1,
      engineers: 1,
      maxPilots: 2,
      maxEngineers: 2,
      maxSoldiers: 2,
      totalCapacity: 6
    },
    shape: 'diamond',
    color: UFO_COLORS.FIGHTER_RED
  },
  transport: {
    name: 'Transport UFO',
    description: 'Large vessel for moving alien forces and equipment.',
    size: 3,
    baseSpeed: 50,
    baseArmor: 70,
    baseWeapons: 40,
    baseStealth: 30,
    threatLevel: 3,
    automated: false,
    crewRequirements: {
      pilots: 2,
      engineers: 1,
      maxPilots: 3,
      maxEngineers: 3,
      maxScientists: 4,
      maxSoldiers: 8,
      totalCapacity: 15
    },
    shape: 'rectangle',
    color: UFO_COLORS.TRANSPORT_GRAY
  },
  harvester: {
    name: 'Harvester UFO',
    description: 'Resource collection vessel with specialized equipment.',
    size: 4,
    baseSpeed: 40,
    baseArmor: 80,
    baseWeapons: 50,
    baseStealth: 40,
    threatLevel: 3,
    automated: false,
    crewRequirements: {
      pilots: 2,
      engineers: 2,
      scientists: 1,
      maxPilots: 4,
      maxEngineers: 4,
      maxScientists: 3,
      maxSoldiers: 6,
      totalCapacity: 12
    },
    shape: 'hexagon',
    color: UFO_COLORS.HARVESTER_PURPLE
  },
  mothership: {
    name: 'Mothership',
    description: 'Massive command and control vessel, housing alien leadership.',
    size: 5,
    baseSpeed: 30,
    baseArmor: 100,
    baseWeapons: 100,
    baseStealth: 60,
    threatLevel: 5,
    automated: false,
    crewRequirements: {
      pilots: 4,
      engineers: 3,
      scientists: 2,
      maxPilots: 8,
      maxEngineers: 6,
      maxScientists: 6,
      maxSoldiers: 20,
      totalCapacity: 40
    },
    shape: 'circle',
    color: UFO_COLORS.MOTHERSHIP_GOLD
  },
  science: {
    name: 'Science Vessel',
    description: 'Advanced research and experimentation craft with cloaking capabilities.',
    size: 2,
    baseSpeed: 70,
    baseArmor: 50,
    baseWeapons: 30,
    baseStealth: 90,
    threatLevel: 2,
    automated: false,
    crewRequirements: {
      pilots: 1,
      scientists: 3,
      maxPilots: 2,
      maxEngineers: 2,
      maxScientists: 6,
      maxSoldiers: 4,
      totalCapacity: 10
    },
    shape: 'pentagon',
    color: UFO_COLORS.SCIENCE_GREEN
  },
  builder: {
    name: 'Builder UFO',
    description: 'Constructs and repairs alien structures. Highly automated.',
    size: 3,
    baseSpeed: 60,
    baseArmor: 40,
    baseWeapons: 20,
    baseStealth: 70,
    threatLevel: 2,
    automated: true,
    crewRequirements: {
      totalCapacity: 0 // Automated, no crew capacity
    },
    shape: 'octagon',
    color: UFO_COLORS.BUILDER_ORANGE
  }
};

export function shouldSpawnUFO(gameState: GameState): boolean {
  const currentTurn = Math.floor((gameState.date.getTime() - INITIAL_DATE.getTime()) / (30 * 24 * 60 * 60 * 1000)) + 1;
  
  console.log(`[UFO Spawn] Checking spawn on turn ${currentTurn}. Active UFOs: ${gameState.activeUFOs.length}`);

  // Force spawn takes precedence
  if (gameState.forceUFOSpawn) {
    console.log('[UFO Spawn] Force spawn enabled');
    return true;
  }

  // First UFO should appear on turn 2 with 100% chance
  if (currentTurn === FIRST_SPAWN_TURN && gameState.activeUFOs.length === 0) {
    console.log('[UFO Spawn] First UFO spawn triggered on turn 2');
    return true;
  }

  // Regular spawn chance for subsequent UFOs
  const roll = Math.random();
  console.log(`[UFO Spawn] Spawn roll: ${roll.toFixed(2)} < ${SPAWN_CHANCE}? ${roll < SPAWN_CHANCE}`);
  return roll < SPAWN_CHANCE;
}

export function generateUFO(gameState: GameState): UFO {
  const threatLevel = gameState.threatLevel;
  
  // Calculate type weights based on threat level
  const typeWeights = calculateTypeWeights(threatLevel);
  const selectedType = selectWeightedType(typeWeights);
  
  // Get type data
  const typeData = UFO_TYPES[selectedType];
  
  // Calculate UFO size variation (±10%)
  const sizeVariation = 0.9 + Math.random() * 0.2;
  
  // Calculate if this is first spawn
  const currentTurn = Math.floor((gameState.date.getTime() - INITIAL_DATE.getTime()) / (30 * 24 * 60 * 60 * 1000)) + 1;
  const isFirstSpawn = currentTurn === FIRST_SPAWN_TURN;
  
  // Create the UFO
  const ufo: UFO = {
    id: crypto.randomUUID(),
    type: selectedType,
    name: `${typeData.name} ${crypto.randomUUID().slice(0, 4)}`,
    size: Math.round(typeData.size * sizeVariation),
    speed: typeData.baseSpeed,
    armor: typeData.baseArmor,
    weapons: typeData.baseWeapons,
    stealthRating: typeData.baseStealth,
    status: 'approaching',
    location: { x: 0, y: 0, altitude: 10000 },
    detectedBy: null,
    interceptedBy: null,
    progressPerTurn: Math.random() * 0.1 + 0.1,
    isFirstSpawn,
    automated: typeData.automated,
    crewRequirements: typeData.crewRequirements,
    shape: typeData.shape,
    color: typeData.color
  };

  // Generate trajectory
  try {
    ufo.trajectory = generateTrajectory(gameState.bases, isFirstSpawn);
  } catch (error) {
    console.error('[UFO Generation] Failed to generate trajectory:', error);
    throw error;
  }

  return ufo;
}

// Utility functions for UFO type weights and selection
/**
 * Calculate type weights based on the current threat level.
 * @param threatLevel The current threat level in the game
 * @returns A record of UFO types with their corresponding weights
 */
function calculateTypeWeights(
  threatLevel: number
): Record<UFOType, number> {
  // Initial weights for each UFO type at threat level 0
  const weights: Record<UFOType, number> = {
    scout: 1,
    fighter: 0,
    transport: 0,
    harvester: 0,
    mothership: 0,
    science: 0,
    builder: 0
  };

  // Adjust weights based on threat level
  if (threatLevel >= 2) { 
    weights.fighter = 0.5;
    weights.science = 0.4;
  }
  if (threatLevel >= 3) {
    weights.builder = 0.3;
    weights.transport = 0.3;
  } 
  if (threatLevel >= 4) {
    weights.harvester = 0.2;
  }
  if (threatLevel >= 5) {
    weights.mothership = 0.1;
  }

  return weights;
}

// Function to select a UFO type based on weighted probabilities
/**
 * Select a UFO type based on weighted probabilities.
 * @param weights A record of UFO types with their corresponding weights
 * @returns The selected UFO type
 */
function selectWeightedType(weights: Record<UFOType, number>): UFOType {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (const [type, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) return type as UFOType;
  }
  
  return 'scout'; // Fallback
}