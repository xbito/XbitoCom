import { describe, it, expect } from 'vitest';
import { spendEnergy } from '../cardUtils';
import type { BattleState } from '../../types';

function makeState(energy: number): BattleState {
  return {
    id: '1',
    stage: 'approach',
    turn: 0,
    initiative: { current: 'p1', order: [] },
    playerEnergy: energy,
    enemyEnergy: 0,
    playerHand: [],
    playerDeck: [],
    playerDiscard: [],
    activeEffects: [],
    vehicleStatus: {
      maxHealth: 100,
      currentHealth: 100,
      energyPerTurn: 2,
      maxEnergy: 10,
      currentEnergy: 10,
      accuracy: 0,
      evasion: 0,
      criticalChance: 0,
      cardSlots: 0,
      equipmentSlots: 0,
    },
    ufoStatus: {
      maxHealth: 100,
      currentHealth: 100,
      energyPerTurn: 2,
      maxEnergy: 10,
      currentEnergy: 10,
      accuracy: 0,
      evasion: 0,
      criticalChance: 0,
      behaviorDeck: [],
      threatLevel: 1,
    },
    stageObjectives: [],
    environmentalConditions: [],
    battleLog: [],
  };
}

describe('cardUtils', () => {
  it('spends player energy', () => {
    const state = makeState(5);
    spendEnergy(state, 3);
    expect(state.playerEnergy).toBe(2);
  });

  it('throws when not enough energy', () => {
    const state = makeState(2);
    expect(() => spendEnergy(state, 5)).toThrow();
  });
});
