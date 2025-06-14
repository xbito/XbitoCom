// Utility functions for card deck management and basic battle operations
import { BattleCard, BattleState, CardEffect } from '../types';
import { validate, validateArray, validateDefined } from './validation';

/** Shuffle an array in place using Fisher-Yates algorithm */
export function shuffleDeck<T>(deck: T[]): T[] {
  validateArray(deck, 'deck');
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/**
 * Draws a number of cards from the player's deck into their hand. If the deck
 * is empty, the discard pile is shuffled back into the deck automatically.
 */
export function drawCards(state: BattleState, count: number): void {
  validateDefined(state, 'state');
  validateArray(state.playerDeck, 'state.playerDeck');
  validateArray(state.playerHand, 'state.playerHand');
  validateArray(state.playerDiscard, 'state.playerDiscard');

  for (let i = 0; i < count; i++) {
    if (state.playerDeck.length === 0 && state.playerDiscard.length > 0) {
      state.playerDeck.push(...shuffleDeck(state.playerDiscard.splice(0)));
    }
    if (state.playerDeck.length === 0) break;
    const card = state.playerDeck.shift();
    if (card) state.playerHand.push(card);
  }
}

/** Discards a card from the player's hand to the discard pile by id */
export function discardCard(state: BattleState, cardId: string): void {
  validateDefined(state, 'state');
  const index = state.playerHand.findIndex(c => c.id === cardId);
  if (index !== -1) {
    const [card] = state.playerHand.splice(index, 1);
    state.playerDiscard.push(card);
  }
}

/** Spend player energy, throwing an error if insufficient */
export function spendEnergy(state: BattleState, amount: number): void {
  validateDefined(state, 'state');
  validate(amount >= 0, 'amount must be non-negative');
  if (state.playerEnergy < amount) {
    throw new Error('Not enough energy to perform action');
  }
  state.playerEnergy -= amount;
}

/** Starts a new turn, resetting energy based on vehicle stats and advancing the counter */
export function startTurn(state: BattleState): void {
  validateDefined(state, 'state');
  state.turn += 1;
  state.playerEnergy = Math.min(
    state.vehicleStatus.maxEnergy,
    state.vehicleStatus.currentEnergy + state.vehicleStatus.energyPerTurn
  );
}

/** Applies the effects of a card to the battle state */
export function applyCardEffects(state: BattleState, card: BattleCard): void {
  validateDefined(state, 'state');
  validateDefined(card, 'card');
  for (const effect of card.effects) {
    processEffect(state, effect);
  }
}

function processEffect(state: BattleState, effect: CardEffect): void {
  switch (effect.type) {
    case 'damage':
      if (effect.target === 'enemy') {
        state.ufoStatus.currentHealth = Math.max(
          0,
          state.ufoStatus.currentHealth - Number(effect.value)
        );
      } else if (effect.target === 'self') {
        state.vehicleStatus.currentHealth = Math.max(
          0,
          state.vehicleStatus.currentHealth - Number(effect.value)
        );
      }
      break;
    case 'heal':
      if (effect.target === 'self') {
        state.vehicleStatus.currentHealth = Math.min(
          state.vehicleStatus.maxHealth,
          state.vehicleStatus.currentHealth + Number(effect.value)
        );
      }
      break;
    case 'buff':
    case 'debuff':
    case 'special':
      // Buffs, debuffs and special effects are added to activeEffects for later processing
      state.activeEffects.push({
        id: `${card.id}-${Date.now()}`,
        name: card.name,
        type: effect.type === 'buff' ? 'buff' : effect.type === 'debuff' ? 'debuff' : 'special',
        value: Number(effect.value) || 0,
        duration: effect.duration ?? 1,
        source: card.id,
        description: card.description,
      });
      break;
    default:
      break;
  }
}

/** Validates basic card play conditions */
export function canPlayCard(state: BattleState, card: BattleCard): boolean {
  if (state.playerEnergy < card.cost) return false;
  if (!card.requirements) return true;
  // Requirement validation hooks can be expanded in later sprints
  return true;
}

/** Plays a card from hand if possible */
export function playCard(state: BattleState, cardId: string): void {
  const card = state.playerHand.find(c => c.id === cardId);
  if (!card) throw new Error('Card not in hand');
  if (!canPlayCard(state, card)) throw new Error('Cannot play card');
  spendEnergy(state, card.cost);
  applyCardEffects(state, card);
  discardCard(state, cardId);
}
