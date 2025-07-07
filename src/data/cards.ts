import { BattleCard, CardEffect, CardRequirement, CardType, CardRarity } from '../types';

// Helper functions for creating card parts
const createEffect = (
  type: CardEffect['type'],
  target: CardEffect['target'],
  value: number | string,
  duration?: number
): CardEffect => ({ type, target, value, duration });

const createRequirement = (
  type: CardRequirement['type'],
  value: number | string,
  operator: CardRequirement['operator']
): CardRequirement => ({ type, value, operator });

// Cards organized by their primary effect type for easier manipulation
// Note: Ensuring all cards use createEffect and createRequirement for consistency

export const DAMAGE_CARDS: BattleCard[] = [
  {
    id: 'fire_missiles', // ID from existing, card_missiles_01 from my plan
    name: 'Fire Missiles',
    description: 'Launch a missile salvo dealing heavy damage.', // Existing description
    type: 'action' as CardType,
    cost: 3,
    effects: [createEffect('damage', 'enemy', '40-60')], // My plan's effect, existing was static 50
    requirements: [createRequirement('equipment', 'Missile Weapons', '=')], // My plan, existing was 'missiles' >=
    cooldown: 0,
    rarity: 'common' as CardRarity,
    imageUrl: '/images/cards/fire_missiles.png',
  },
  {
    id: 'cannon_burst', // ID from existing, card_cannon_01 from my plan
    name: 'Cannon Burst',
    description: 'Short cannon burst that can be fired repeatedly.', // Existing description
    type: 'action' as CardType,
    cost: 2,
    effects: [createEffect('damage', 'enemy', '25-35')], // My plan's effect, existing was static 30
    requirements: [createRequirement('equipment', 'Cannon', '=')], // My plan, existing was 'cannon' >=
    cooldown: 0,
    rarity: 'common' as CardRarity,
    imageUrl: '/images/cards/cannon_burst.png',
  },
  {
    id: 'focus_fire',
    name: 'Focus Fire',
    description: 'All pilots concentrate fire on the target.',
    type: 'action' as CardType,
    cost: 3,
    effects: [createEffect('damage', 'enemy', 40)],
    rarity: 'common' as CardRarity,
    imageUrl: '/images/cards/focus_fire.png',
  },
  {
    id: 'machine_gun_rake',
    name: 'Machine Gun Rake',
    description: 'Spray the target with light machine gun fire.',
    type: 'action' as CardType,
    cost: 1,
    effects: [createEffect('damage', 'enemy', 20)],
    requirements: [createRequirement('equipment', 'machine_gun', '>=')],
    rarity: 'common' as CardRarity,
    imageUrl: '/images/cards/machine_gun_rake.png',
  },
  {
    id: 'precision_strike',
    name: 'Precision Strike',
    description: 'Target weak points for increased accuracy.',
    type: 'action' as CardType,
    cost: 3,
    effects: [createEffect('damage', 'enemy', 45)],
    requirements: [createRequirement('skill', 'targeting:70', '>=')],
    rarity: 'uncommon' as CardRarity,
    imageUrl: '/images/cards/precision_strike.png',
  },
];

export const HEAL_CARDS: BattleCard[] = [
  {
    id: 'engineers_patch',
    name: "Engineer's Patch",
    description: 'Quick repair to restore some health.',
    type: 'crew' as CardType,
    cost: 1,
    effects: [createEffect('heal', 'self', 20)],
    rarity: 'common' as CardRarity,
    imageUrl: '/images/cards/engineers_patch.png',
  },
  {
    id: 'medic_support',
    name: 'Medic Support',
    description: 'Treat injuries and remove debuffs.',
    type: 'crew' as CardType,
    cost: 2,
    effects: [
      createEffect('heal', 'self', 15),
      createEffect('special', 'self', 'cleanse'),
    ],
    rarity: 'uncommon' as CardRarity,
    imageUrl: '/images/cards/medic_support.png',
  },
];

export const BUFF_CARDS: BattleCard[] = [
  {
    id: 'evasive_maneuvers', // ID from existing, card_evasive_01 from my plan
    name: 'Evasive Maneuvers',
    description: 'Increase dodge chance for a turn. Gain stealth.', // Merged description
    type: 'action' as CardType,
    cost: 2,
    effects: [ // From my plan
      createEffect('buff', 'self', '+30% dodge', 1),
      createEffect('buff', 'self', '+10 stealth', 1),
    ],
    requirements: [createRequirement('skill', 'piloting', '>=50')], // My plan, existing was 'piloting:50'
    cooldown: 1,
    rarity: 'uncommon' as CardRarity,
    imageUrl: '/images/cards/evasive_maneuvers.png',
  },
  {
    id: 'emergency_boost', // ID from existing, card_boost_01 from my plan
    name: 'Emergency Boost',
    description: 'Overload engines for extra damage next attack and initiative.', // Merged description
    type: 'action' as CardType,
    cost: 4, // My plan, existing was 2
    effects: [ // From my plan
      createEffect('buff', 'self', '+50% damage next attack', 1),
      createEffect('buff', 'self', '+20 initiative', 0)
    ],
    requirements: [createRequirement('equipment', 'Advanced Engines', '=')], // My plan, existing was 'advanced-engines' >=
    cooldown: 2,
    rarity: 'rare' as CardRarity, // My plan, existing was 'uncommon'
    imageUrl: '/images/cards/emergency_boost.png',
  },
  {
    id: 'combat_awareness',
    name: 'Combat Awareness',
    description: 'Predict enemy action and gain critical chance.',
    type: 'crew' as CardType,
    cost: 2,
    effects: [createEffect('buff', 'self', 25, 2)], // Existing: value: 25, duration: 2. My plan: +25% critical hit
    requirements: [createRequirement('skill', 'awareness:80', '>=')], // Existing. My plan: Combat Awareness > 80
    cooldown: 3,
    rarity: 'rare' as CardRarity,
    imageUrl: '/images/cards/combat_awareness.png',
  },
  {
    id: 'pilot_focus',
    name: 'Pilot Focus',
    description: 'Boost pilot initiative for one turn.',
    type: 'crew' as CardType,
    cost: 1,
    effects: [createEffect('buff', 'self', 20, 1)],
    rarity: 'common' as CardRarity,
    imageUrl: '/images/cards/pilot_focus.png',
  },
  {
    id: 'plasma_cannon_equip', // Renamed from 'plasma_cannon' to avoid conflict if a playable 'Plasma Cannon' card is added
    name: 'Plasma Cannon Tech', // My name was 'Plasma Cannon Tech'
    description: 'Grants +40% damage and ignores 25% armor for equipped cannons. (+1 energy cost to attacks)', // My description
    type: 'equipment' as CardType,
    cost: 0, // Passive
    effects: [
      // Effects for passive equipment are tricky. They usually modify player/vehicle stats directly
      // or modify other cards. For now, let's assume it grants a status effect.
      createEffect('buff', 'self', 'plasma_cannons_active')
    ],
    requirements: [createRequirement('research', 'plasma-weapons', '>=')], // Existing, my plan was 'Plasma Weapons' =
    rarity: 'rare' as CardRarity,
    imageUrl: '/images/cards/plasma_cannon.png',
  },
  {
    id: 'stealth_coating_equip', // Renamed
    name: 'Stealth Coating',
    description: 'Begin battle with additional stealth.',
    type: 'equipment' as CardType,
    cost: 0,
    effects: [createEffect('buff', 'self', 'stealth_coating_active')], // Similar to above
    requirements: [createRequirement('research', 'stealth-systems', '>=')],
    rarity: 'uncommon' as CardRarity,
    imageUrl: '/images/cards/stealth_coating.png',
  },
  {
    id: 'advanced_targeting_equip', // Renamed
    name: 'Advanced Targeting',
    description: 'Greatly improve accuracy of next attack.',
    type: 'equipment' as CardType,
    cost: 1, // This could be an activatable equipment card
    effects: [createEffect('buff', 'self', '+50% accuracy next attack', 1)], // Effect more specific
    requirements: [createRequirement('research', 'advanced-avionics', '>=')],
    rarity: 'uncommon' as CardRarity,
    imageUrl: '/images/cards/advanced_targeting.png',
  },
  {
    id: 'reinforced_armor_equip', // Renamed
    name: 'Reinforced Armor',
    description: 'Increase maximum health of the aircraft.',
    type: 'equipment' as CardType,
    cost: 0,
    effects: [createEffect('buff', 'self', 'reinforced_armor_active')], // Passive
    rarity: 'common' as CardRarity,
    imageUrl: '/images/cards/reinforced_armor.png',
  },
  {
    id: 'high_impact_missiles_equip', // Renamed
    name: 'High-Impact Missiles',
    description: 'Missiles that deal additional damage.',
    type: 'equipment' as CardType,
    cost: 0,
    effects: [createEffect('buff', 'self', 'high_impact_missiles_active')], // Passive
    requirements: [createRequirement('research', 'explosives', '>=')],
    rarity: 'uncommon' as CardRarity,
    imageUrl: '/images/cards/high_impact_missiles.png',
  },
  {
    id: 'countermeasure_system_equip', // Renamed
    name: 'Countermeasure System',
    description: 'Increase evasion for one turn when activated.',
    type: 'equipment' as CardType,
    cost: 1, // Activatable
    effects: [createEffect('buff', 'self', '+20% evasion', 1)], // Effect more specific
    rarity: 'common' as CardRarity,
    imageUrl: '/images/cards/countermeasure_system.png',
  },
  {
    id: 'clear_skies',
    name: 'Clear Skies',
    description: 'Improve accuracy but reduce stealth bonuses.',
    type: 'environmental' as CardType,
    cost: 0,
    effects: [createEffect('buff', 'all', '+15% accuracy', 2), createEffect('debuff', 'all', '-15% stealth effectiveness', 2)], // More specific
    rarity: 'common' as CardRarity,
    imageUrl: '/images/cards/clear_skies.png',
  },
  {
    id: 'night_operations',
    name: 'Night Operations',
    description: 'Gain stealth bonuses while vision is limited.',
    type: 'environmental' as CardType,
    cost: 0,
    effects: [createEffect('buff', 'all', '+20% stealth effectiveness', 2)], // Target 'all' for environmental usually
    rarity: 'uncommon' as CardRarity,
    imageUrl: '/images/cards/night_operations.png',
  },
  {
    id: 'mountain_terrain',
    name: 'Mountain Terrain',
    description: 'Altitude advantage but radar interference.',
    type: 'environmental' as CardType,
    cost: 0,
    effects: [
      createEffect('buff', 'all', '+10% altitude advantage', 2), // More descriptive
      createEffect('debuff', 'all', '-10% radar effectiveness', 2),
    ],
    rarity: 'common' as CardRarity,
    imageUrl: '/images/cards/mountain_terrain.png',
  },
];

export const DEBUFF_CARDS: BattleCard[] = [
  {
    id: 'storm_front',
    name: 'Storm Front',
    description: 'Heavy weather reduces accuracy for both sides.',
    type: 'environmental' as CardType,
    cost: 0,
    effects: [createEffect('debuff', 'all', '-20% accuracy', 2)],
    rarity: 'common' as CardRarity,
    imageUrl: '/images/cards/storm_front.png',
  },
  {
    id: 'urban_area',
    name: 'Urban Area',
    description: 'Risk of collateral damage in populated zones.',
    type: 'environmental' as CardType,
    cost: 0,
    effects: [createEffect('special', 'all', 'collateral_damage_risk', 0)], // Special effect
    rarity: 'common' as CardRarity,
    imageUrl: '/images/cards/urban_area.png',
  },
];

export const SPECIAL_CARDS: BattleCard[] = [
  {
    id: 'overwatch',
    name: 'Overwatch',
    description: 'Prepare to respond to the next UFO action.',
    type: 'action' as CardType,
    cost: 1,
    effects: [createEffect('special', 'self', 'enter_overwatch_stance')], // More descriptive
    rarity: 'uncommon' as CardRarity,
    imageUrl: '/images/cards/overwatch.png',
  },
  {
    id: 'veterans_instinct', // ID from existing, card_veteran_instinct_01 from my plan
    name: "Veteran's Instinct",
    description: 'Draw 2 cards. Gain +10% accuracy this turn.', // My plan's description
    type: 'crew' as CardType,
    cost: 1,
    effects: [ // From my plan
      createEffect('special', 'self', 'draw_2_cards'),
      createEffect('buff', 'self', '+10% accuracy', 1),
    ],
    requirements: [createRequirement('skill', 'experience', '>=75')], // My plan, existing 'experience:75'
    cooldown: 3, // Existing cooldown
    rarity: 'rare' as CardRarity, // Existing rarity
    imageUrl: '/images/cards/veterans_instinct.png',
  },
  {
    id: 'stress_management',
    name: 'Stress Management',
    description: 'Remove negative status effects from the crew.',
    type: 'crew' as CardType,
    cost: 0,
    effects: [createEffect('special', 'self', 'cleanse_debuffs_self')], // More descriptive
    requirements: [createRequirement('skill', 'stress:70', '>=')],
    cooldown: 2,
    rarity: 'uncommon' as CardRarity,
    imageUrl: '/images/cards/stress_management.png',
  },
  {
    id: 'ocean_approach',
    name: 'Ocean Approach',
    description: 'Long approach over open water.',
    type: 'environmental' as CardType,
    cost: 0,
    effects: [createEffect('special', 'all', 'ocean_engagement_rules')], // Special effect
    rarity: 'common' as CardRarity,
    imageUrl: '/images/cards/ocean_approach.png',
  },
];

// Consolidate all cards into a single array for easier global access
export const ALL_CARDS: BattleCard[] = [
  ...DAMAGE_CARDS,
  ...HEAL_CARDS,
  ...BUFF_CARDS,
  ...DEBUFF_CARDS,
  ...SPECIAL_CARDS,
];

// Function to get a full deck for a player (e.g., all common action cards for starting)
export const getStarterDeck = (): BattleCard[] => {
  return ALL_CARDS.filter(card =>
    card.rarity === ('common' as CardRarity) &&
    card.type === ('action' as CardType)
  );
};

// Function to shuffle a deck
export const shuffleDeck = (deck: BattleCard[]): BattleCard[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function to draw cards from a deck
export const drawCards = (
  deck: BattleCard[],
  hand: BattleCard[],
  discardPile: BattleCard[],
  count: number
): { newDeck: BattleCard[], newHand: BattleCard[], newDiscardPile: BattleCard[] } => {
  let currentDeck = [...deck];
  let currentHand = [...hand];
  let currentDiscardPile = [...discardPile];

  const cardsToDraw = [];

  for (let i = 0; i < count; i++) {
    if (currentDeck.length === 0) {
      if (currentDiscardPile.length === 0) {
        // No cards left anywhere to draw
        break;
      }
      // Reshuffle discard pile into deck
      console.log("Reshuffling discard pile into deck.");
      currentDeck = shuffleDeck(currentDiscardPile);
      currentDiscardPile = [];
      if (currentDeck.length === 0) { // Still no cards (empty discard)
        break;
      }
    }
    const drawnCard = currentDeck.shift(); // Removes the first card
    if (drawnCard) {
      cardsToDraw.push(drawnCard);
    }
  }

  currentHand = [...currentHand, ...cardsToDraw];

  return { newDeck: currentDeck, newHand: currentHand, newDiscardPile: currentDiscardPile };
};


// The old export default BASE_CARDS might not be needed if ALL_CARDS is used,
// or it can be an alias for ALL_CARDS. For now, let's keep it as ALL_CARDS.
export default ALL_CARDS;
