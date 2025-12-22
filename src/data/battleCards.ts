import type { BattleCard, UFOBehaviorCard } from '../types';

// Battle-focused subset.
// Intentionally requirement-free so the battle loop is playable now;
// later we can gate these behind equipment/research.

export const PLAYER_BATTLE_CARDS: BattleCard[] = [
  {
    id: 'cannon_burst_battle',
    name: 'Cannon Burst',
    description: 'A reliable burst of cannon fire.',
    type: 'action',
    cost: 1,
    effects: [{ type: 'damage', target: 'enemy', value: 18 }],
    rarity: 'common'
  },
  {
    id: 'machine_gun_rake_battle',
    name: 'Machine Gun Rake',
    description: 'Low cost, low damage suppression fire.',
    type: 'action',
    cost: 1,
    effects: [{ type: 'damage', target: 'enemy', value: 14 }],
    rarity: 'common'
  },
  {
    id: 'focus_fire_battle',
    name: 'Focus Fire',
    description: 'Concentrate fire on a single target.',
    type: 'action',
    cost: 2,
    effects: [{ type: 'damage', target: 'enemy', value: 30 }],
    rarity: 'common'
  },
  {
    id: 'fire_missiles_battle',
    name: 'Fire Missiles',
    description: 'Heavy strike with a chance to miss.',
    type: 'action',
    cost: 3,
    effects: [{ type: 'damage', target: 'enemy', value: 55 }],
    rarity: 'uncommon'
  },
  {
    id: 'engineers_patch_battle',
    name: "Engineer's Patch",
    description: 'Quick repair to restore some health.',
    type: 'crew',
    cost: 1,
    effects: [{ type: 'heal', target: 'self', value: 18 }],
    rarity: 'common'
  },
  {
    id: 'medic_support_battle',
    name: 'Medic Support',
    description: 'Stabilize the craft and recover.',
    type: 'crew',
    cost: 2,
    effects: [{ type: 'heal', target: 'self', value: 14 }],
    rarity: 'common'
  },
  {
    id: 'pilot_focus_battle',
    name: 'Pilot Focus',
    description: 'Increase accuracy briefly.',
    type: 'crew',
    cost: 1,
    effects: [{ type: 'buff', target: 'self', value: 20, duration: 2 }],
    rarity: 'common'
  },
  {
    id: 'evasive_maneuvers_battle',
    name: 'Evasive Maneuvers',
    description: 'Increase evasion briefly.',
    type: 'action',
    cost: 2,
    effects: [{ type: 'buff', target: 'self', value: 25, duration: 2 }],
    rarity: 'uncommon'
  },
  {
    id: 'overwatch_battle',
    name: 'Overwatch',
    description: 'Reduce damage from the next UFO hit.',
    type: 'action',
    cost: 1,
    effects: [{ type: 'special', target: 'self', value: 'overwatch' }],
    rarity: 'uncommon'
  }
];

export const UFO_BEHAVIOR_CARDS_V0: UFOBehaviorCard[] = [
  {
    id: 'ufo_plasma_bolt',
    name: 'Plasma Bolt',
    description: 'A focused plasma discharge.',
    type: 'ufo_response',
    cost: 0,
    effects: [{ type: 'damage', target: 'enemy', value: 18 }],
    rarity: 'common',
    aiConditions: [{ triggerOn: 'turn', threshold: 1, comparison: '>=' }]
  },
  {
    id: 'ufo_barrage',
    name: 'Ion Barrage',
    description: 'Sustained fire to overwhelm defenses.',
    type: 'ufo_response',
    cost: 0,
    effects: [{ type: 'damage', target: 'enemy', value: 26 }],
    rarity: 'uncommon',
    aiConditions: [{ triggerOn: 'turn', threshold: 2, comparison: '>=' }]
  },
  {
    id: 'ufo_cloak',
    name: 'Cloak Pulse',
    description: 'Boost evasion for a short time.',
    type: 'ufo_response',
    cost: 0,
    effects: [{ type: 'buff', target: 'self', value: 20, duration: 2 }],
    rarity: 'common',
    aiConditions: [{ triggerOn: 'health', threshold: 60, comparison: '<=' }]
  },
  {
    id: 'ufo_overcharge',
    name: 'Overcharge',
    description: 'Boost accuracy for a short time.',
    type: 'ufo_response',
    cost: 0,
    effects: [{ type: 'buff', target: 'self', value: 15, duration: 2 }],
    rarity: 'common',
    aiConditions: [{ triggerOn: 'turn', threshold: 3, comparison: '>=' }]
  }
];
