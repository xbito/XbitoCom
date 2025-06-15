import { BattleState, BattleStage, Vehicle, UFO, BattleCard, ObjectiveStatus, VehicleBattleStats, UFOBattleStats } from '../types';
import { shuffleDeck, drawCards, startTurn } from './cardUtils';

/** Default turns per stage before automatic progression */
const STAGE_TURNS: Record<BattleStage, number> = {
  approach: 1,
  engagement: 3,
  pursuit: 2,
  recovery: 0,
  aftermath: 0,
};

/** Create basic battle stats for a vehicle using its base stats */
function buildVehicleBattleStats(vehicle: Vehicle): VehicleBattleStats {
  const maxHealth = Math.max(50, vehicle.stats.armor * 2);
  const energyPerTurn = vehicle.stats.speed ? Math.round(vehicle.stats.speed / 25) : 1;
  const maxEnergy = energyPerTurn * 5;
  return {
    maxHealth,
    currentHealth: maxHealth,
    energyPerTurn,
    maxEnergy,
    currentEnergy: maxEnergy,
    accuracy: 70,
    evasion: Math.round(vehicle.stats.speed / 5),
    criticalChance: 5,
    cardSlots: vehicle.stats.cardSlots ?? 3,
    equipmentSlots: vehicle.stats.equipmentSlots ?? 2,
  };
}

/** Create basic battle stats for a UFO using its base properties */
function buildUFOBattleStats(ufo: UFO): UFOBattleStats {
  const maxHealth = Math.max(50, ufo.armor * 2);
  const energyPerTurn = Math.round(ufo.speed / 25) || 1;
  const maxEnergy = energyPerTurn * 5;
  return {
    maxHealth,
    currentHealth: maxHealth,
    energyPerTurn,
    maxEnergy,
    currentEnergy: maxEnergy,
    accuracy: 60,
    evasion: Math.round(ufo.speed / 5),
    criticalChance: 5,
    behaviorDeck: [],
    threatLevel: 1,
  };
}

/** Initialize a new battle state */
export function initializeBattle(vehicle: Vehicle, ufo: UFO, deck: BattleCard[]): BattleState {
  const vehicleStats = buildVehicleBattleStats(vehicle);
  const ufoStats = buildUFOBattleStats(ufo);
  const shuffled = shuffleDeck(deck.slice());

  const objectives: ObjectiveStatus[] = [
    { id: 'approach', type: 'primary', description: 'Close distance with the UFO', completed: false },
    { id: 'destroy', type: 'primary', description: 'Disable or destroy the UFO', completed: false },
    { id: 'prevent_escape', type: 'primary', description: 'Prevent the UFO from escaping', completed: false },
  ];

  const state: BattleState = {
    id: crypto.randomUUID(),
    stage: 'approach',
    turn: 0,
    initiative: { current: vehicle.id, order: [vehicle.id, ufo.id] },
    playerEnergy: vehicleStats.maxEnergy,
    enemyEnergy: ufoStats.maxEnergy,
    playerHand: [],
    playerDeck: shuffled,
    playerDiscard: [],
    activeEffects: [],
    vehicleStatus: vehicleStats,
    ufoStatus: ufoStats,
    stageObjectives: objectives,
    environmentalConditions: [],
    battleLog: [],
  };

  // Initial draw and turn start
  startTurn(state);
  drawCards(state, 5);

  return state;
}

/** Advance the battle stage and track objectives */
export function advanceStage(state: BattleState): void {
  switch (state.stage) {
    case 'approach':
      state.stageObjectives.find(o => o.id === 'approach')!.completed = true;
      state.stage = 'engagement';
      state.turn = 0;
      break;
    case 'engagement':
      state.stageObjectives.find(o => o.id === 'destroy')!.completed = state.ufoStatus.currentHealth <= 0;
      state.stage = 'pursuit';
      state.turn = 0;
      break;
    case 'pursuit':
      state.stageObjectives.find(o => o.id === 'prevent_escape')!.completed = state.ufoStatus.currentHealth <= 0;
      break;
    default:
      break;
  }
}

/** Evaluate victory or defeat conditions */
export function evaluateOutcome(state: BattleState): 'victory' | 'defeat' | null {
  if (state.ufoStatus.currentHealth <= 0) return 'victory';
  if (state.vehicleStatus.currentHealth <= 0) return 'defeat';
  if (state.stage === 'pursuit' && state.turn >= STAGE_TURNS.pursuit) return 'defeat';
  return null;
}

/** Process end-of-turn logic and handle stage transitions */
export function endTurn(state: BattleState): 'victory' | 'defeat' | null {
  const outcome = evaluateOutcome(state);
  if (outcome) return outcome;

  state.turn += 1;
  if (state.turn >= STAGE_TURNS[state.stage] && state.stage !== 'pursuit') {
    advanceStage(state);
  }
  startTurn(state);
  drawCards(state, 5);

  return evaluateOutcome(state);
}
