import { UFO, UFOType, GameState } from '../types';
import { generateTrajectory } from '../utils/trajectory';

const SPAWN_CHANCE = 0.3; // 30% chance per turn to spawn a UFO
const FIRST_SPAWN_TURN = 2;
const INITIAL_DATE = new Date('2025-01-01');

export const UFO_TYPES: Record<UFOType, {
  name: string;
  description: string;
  size: number;
  baseSpeed: number;
  baseArmor: number;
  baseWeapons: number;
  baseStealth: number;
  threatLevel: number;
}> = {
  scout: {
    name: 'Scout UFO',
    description: 'Small, fast reconnaissance craft',
    size: 1,
    baseSpeed: 90,
    baseArmor: 30,
    baseWeapons: 20,
    baseStealth: 80,
    threatLevel: 1
  },
  fighter: {
    name: 'Fighter UFO',
    description: 'Aggressive combat vessel',
    size: 2,
    baseSpeed: 80,
    baseArmor: 60,
    baseWeapons: 70,
    baseStealth: 50,
    threatLevel: 2
  },
  transport: {
    name: 'Transport UFO',
    description: 'Large vessel for moving alien forces',
    size: 3,
    baseSpeed: 50,
    baseArmor: 70,
    baseWeapons: 40,
    baseStealth: 30,
    threatLevel: 3
  },
  harvester: {
    name: 'Harvester UFO',
    description: 'Resource collection vessel',
    size: 4,
    baseSpeed: 40,
    baseArmor: 80,
    baseWeapons: 50,
    baseStealth: 40,
    threatLevel: 3
  },
  mothership: {
    name: 'Mothership',
    description: 'Massive command and control vessel',
    size: 5,
    baseSpeed: 30,
    baseArmor: 100,
    baseWeapons: 100,
    baseStealth: 60,
    threatLevel: 5
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
    isFirstSpawn
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

function calculateTypeWeights(
  threatLevel: number
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