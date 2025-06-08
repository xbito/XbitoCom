import { BattleCard } from '../types';

// Cards organized by their primary effect type for easier manipulation

export const DAMAGE_CARDS: BattleCard[] = [
  {
    id: 'fire_missiles',
    name: 'Fire Missiles',
    description: 'Launch a missile salvo dealing heavy damage.',
    type: 'action',
    cost: 3,
    effects: [{ type: 'damage', target: 'enemy', value: 50 }],
    requirements: [{ type: 'equipment', value: 'missiles', operator: '>=' }],
    rarity: 'common',
    imageUrl: '/images/cards/fire_missiles.png'
  },
  {
    id: 'cannon_burst',
    name: 'Cannon Burst',
    description: 'Short cannon burst that can be fired repeatedly.',
    type: 'action',
    cost: 2,
    effects: [{ type: 'damage', target: 'enemy', value: 30 }],
    requirements: [{ type: 'equipment', value: 'cannon', operator: '>=' }],
    rarity: 'common',
    imageUrl: '/images/cards/cannon_burst.png'
  },
  {
    id: 'focus_fire',
    name: 'Focus Fire',
    description: 'All pilots concentrate fire on the target.',
    type: 'action',
    cost: 3,
    effects: [{ type: 'damage', target: 'enemy', value: 40 }],
    rarity: 'common',
    imageUrl: '/images/cards/focus_fire.png'
  },
  {
    id: 'machine_gun_rake',
    name: 'Machine Gun Rake',
    description: 'Spray the target with light machine gun fire.',
    type: 'action',
    cost: 1,
    effects: [{ type: 'damage', target: 'enemy', value: 20 }],
    requirements: [{ type: 'equipment', value: 'machine_gun', operator: '>=' }],
    rarity: 'common',
    imageUrl: '/images/cards/machine_gun_rake.png'
  },
  {
    id: 'precision_strike',
    name: 'Precision Strike',
    description: 'Target weak points for increased accuracy.',
    type: 'action',
    cost: 3,
    effects: [{ type: 'damage', target: 'enemy', value: 45 }],
    requirements: [{ type: 'skill', value: 'targeting:70', operator: '>=' }],
    rarity: 'uncommon',
    imageUrl: '/images/cards/precision_strike.png'
  }
];

export const HEAL_CARDS: BattleCard[] = [
  {
    id: 'engineers_patch',
    name: "Engineer's Patch",
    description: 'Quick repair to restore some health.',
    type: 'crew',
    cost: 1,
    effects: [{ type: 'heal', target: 'self', value: 20 }],
    rarity: 'common',
    imageUrl: '/images/cards/engineers_patch.png'
  },
  {
    id: 'medic_support',
    name: 'Medic Support',
    description: 'Treat injuries and remove debuffs.',
    type: 'crew',
    cost: 2,
    effects: [
      { type: 'heal', target: 'self', value: 15 },
      { type: 'special', target: 'self', value: 'cleanse' }
    ],
    rarity: 'uncommon',
    imageUrl: '/images/cards/medic_support.png'
  }
];

export const BUFF_CARDS: BattleCard[] = [
  {
    id: 'evasive_maneuvers',
    name: 'Evasive Maneuvers',
    description: 'Increase dodge chance for a turn.',
    type: 'action',
    cost: 2,
    effects: [{ type: 'buff', target: 'self', value: 30, duration: 1 }],
    requirements: [{ type: 'skill', value: 'piloting:50', operator: '>=' }],
    cooldown: 1,
    rarity: 'uncommon',
    imageUrl: '/images/cards/evasive_maneuvers.png'
  },
  {
    id: 'emergency_boost',
    name: 'Emergency Boost',
    description: 'Overload engines for extra damage next attack.',
    type: 'action',
    cost: 4,
    effects: [{ type: 'buff', target: 'self', value: 50, duration: 1 }],
    requirements: [{ type: 'equipment', value: 'advanced-engines', operator: '>=' }],
    cooldown: 2,
    rarity: 'uncommon',
    imageUrl: '/images/cards/emergency_boost.png'
  },
  {
    id: 'combat_awareness',
    name: 'Combat Awareness',
    description: 'Predict enemy action and gain critical chance.',
    type: 'crew',
    cost: 2,
    effects: [{ type: 'buff', target: 'self', value: 25, duration: 2 }],
    requirements: [{ type: 'skill', value: 'awareness:80', operator: '>=' }],
    cooldown: 3,
    rarity: 'rare',
    imageUrl: '/images/cards/combat_awareness.png'
  },
  {
    id: 'pilot_focus',
    name: 'Pilot Focus',
    description: 'Boost pilot initiative for one turn.',
    type: 'crew',
    cost: 1,
    effects: [{ type: 'buff', target: 'self', value: 20, duration: 1 }],
    rarity: 'common',
    imageUrl: '/images/cards/pilot_focus.png'
  },
  {
    id: 'plasma_cannon',
    name: 'Plasma Cannon',
    description: 'Powerful weapon that ignores armor.',
    type: 'equipment',
    cost: 0,
    effects: [{ type: 'buff', target: 'self', value: 40 }],
    requirements: [{ type: 'research', value: 'plasma-weapons', operator: '>=' }],
    rarity: 'rare',
    imageUrl: '/images/cards/plasma_cannon.png'
  },
  {
    id: 'stealth_coating',
    name: 'Stealth Coating',
    description: 'Begin battle with additional stealth.',
    type: 'equipment',
    cost: 0,
    effects: [{ type: 'buff', target: 'self', value: 50 }],
    requirements: [{ type: 'research', value: 'stealth-systems', operator: '>=' }],
    rarity: 'uncommon',
    imageUrl: '/images/cards/stealth_coating.png'
  },
  {
    id: 'advanced_targeting',
    name: 'Advanced Targeting',
    description: 'Greatly improve accuracy of next attack.',
    type: 'equipment',
    cost: 1,
    effects: [{ type: 'buff', target: 'self', value: 50, duration: 1 }],
    requirements: [{ type: 'research', value: 'advanced-avionics', operator: '>=' }],
    rarity: 'uncommon',
    imageUrl: '/images/cards/advanced_targeting.png'
  },
  {
    id: 'reinforced_armor',
    name: 'Reinforced Armor',
    description: 'Increase maximum health of the aircraft.',
    type: 'equipment',
    cost: 0,
    effects: [{ type: 'buff', target: 'self', value: 25 }],
    rarity: 'common',
    imageUrl: '/images/cards/reinforced_armor.png'
  },
  {
    id: 'high_impact_missiles',
    name: 'High-Impact Missiles',
    description: 'Missiles that deal additional damage.',
    type: 'equipment',
    cost: 0,
    effects: [{ type: 'buff', target: 'self', value: 30 }],
    requirements: [{ type: 'research', value: 'explosives', operator: '>=' }],
    rarity: 'uncommon',
    imageUrl: '/images/cards/high_impact_missiles.png'
  },
  {
    id: 'countermeasure_system',
    name: 'Countermeasure System',
    description: 'Increase evasion for one turn when activated.',
    type: 'equipment',
    cost: 1,
    effects: [{ type: 'buff', target: 'self', value: 20, duration: 1 }],
    rarity: 'common',
    imageUrl: '/images/cards/countermeasure_system.png'
  },
  {
    id: 'clear_skies',
    name: 'Clear Skies',
    description: 'Improve accuracy but reduce stealth bonuses.',
    type: 'environmental',
    cost: 0,
    effects: [{ type: 'buff', target: 'all', value: 15, duration: 2 }],
    rarity: 'common',
    imageUrl: '/images/cards/clear_skies.png'
  },
  {
    id: 'night_operations',
    name: 'Night Operations',
    description: 'Gain stealth bonuses while vision is limited.',
    type: 'environmental',
    cost: 0,
    effects: [{ type: 'buff', target: 'self', value: 20, duration: 2 }],
    rarity: 'uncommon',
    imageUrl: '/images/cards/night_operations.png'
  },
  {
    id: 'mountain_terrain',
    name: 'Mountain Terrain',
    description: 'Altitude advantage but radar interference.',
    type: 'environmental',
    cost: 0,
    effects: [
      { type: 'buff', target: 'self', value: 10, duration: 2 },
      { type: 'debuff', target: 'self', value: 10, duration: 2 }
    ],
    rarity: 'common',
    imageUrl: '/images/cards/mountain_terrain.png'
  }
];

export const DEBUFF_CARDS: BattleCard[] = [
  {
    id: 'storm_front',
    name: 'Storm Front',
    description: 'Heavy weather reduces accuracy for both sides.',
    type: 'environmental',
    cost: 0,
    effects: [{ type: 'debuff', target: 'all', value: 20, duration: 2 }],
    rarity: 'common',
    imageUrl: '/images/cards/storm_front.png'
  },
  {
    id: 'urban_area',
    name: 'Urban Area',
    description: 'Risk of collateral damage in populated zones.',
    type: 'environmental',
    cost: 0,
    effects: [{ type: 'debuff', target: 'self', value: 10, duration: 2 }],
    rarity: 'common',
    imageUrl: '/images/cards/urban_area.png'
  }
];

export const SPECIAL_CARDS: BattleCard[] = [
  {
    id: 'overwatch',
    name: 'Overwatch',
    description: 'Prepare to respond to the next UFO action.',
    type: 'action',
    cost: 1,
    effects: [{ type: 'special', target: 'enemy', value: 'counter' }],
    rarity: 'uncommon',
    imageUrl: '/images/cards/overwatch.png'
  },
  {
    id: 'veterans_instinct',
    name: "Veteran's Instinct",
    description: 'Draw additional cards and improve accuracy.',
    type: 'crew',
    cost: 1,
    effects: [
      { type: 'special', target: 'self', value: 'draw:2' },
      { type: 'buff', target: 'self', value: 10, duration: 1 }
    ],
    requirements: [{ type: 'skill', value: 'experience:75', operator: '>=' }],
    cooldown: 3,
    rarity: 'rare',
    imageUrl: '/images/cards/veterans_instinct.png'
  },
  {
    id: 'stress_management',
    name: 'Stress Management',
    description: 'Remove negative status effects from the crew.',
    type: 'crew',
    cost: 0,
    effects: [{ type: 'special', target: 'self', value: 'cleanse' }],
    requirements: [{ type: 'skill', value: 'stress:70', operator: '>=' }],
    cooldown: 2,
    rarity: 'uncommon',
    imageUrl: '/images/cards/stress_management.png'
  },
  {
    id: 'ocean_approach',
    name: 'Ocean Approach',
    description: 'Long approach over open water.',
    type: 'environmental',
    cost: 0,
    effects: [{ type: 'special', target: 'self', value: 'long-range' }],
    rarity: 'common',
    imageUrl: '/images/cards/ocean_approach.png'
  }
];

export const BASE_CARDS: BattleCard[] = [
  ...DAMAGE_CARDS,
  ...HEAL_CARDS,
  ...BUFF_CARDS,
  ...DEBUFF_CARDS,
  ...SPECIAL_CARDS
];

export default BASE_CARDS;
