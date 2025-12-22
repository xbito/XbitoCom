import type { BattleCard, CardEffect, UFO, UFOBehaviorCard, Vehicle, VehicleType } from '../types';
import { PLAYER_BATTLE_CARDS, UFO_BEHAVIOR_CARDS_V0 } from '../data/battleCards';
import { assertDefined, assert } from '../utils/assert';

const MAX_TURNS = 10;
const MAX_DECK_CAP = 14;
const MAX_HAND_SIZE_CAP = 7;
const MAX_PLAYS_PER_TURN_CAP = 4;
const MAX_LOG = 40;

export type BattleResult = {
  success: boolean;
  endedBy: 'destroyed' | 'crashed' | 'escaped';
  vehicleDamage: number; // 0..100 (condition damage)
  ufoDamage: number; // 0..9999
  message: string;
};

export type BattleLogEntryV0 = {
  turn: number;
  message: string;
};

export type BattleStateV0 = {
  id: string;
  turn: number;
  maxTurns: number;
  player: {
    vehicleType: VehicleType;
    maxHp: number;
    hp: number;
    maxEnergy: number;
    energy: number;
    energyPerTurn: number;
    handSize: number;
    drawPerTurn: number;
    deckSize: number;
    accuracy: number; // 0..100
    evasion: number; // 0..100
    basicAttackCost: number;
    basicAttackDamage: number;
    overwatchTurns: number;
    accuracyBuffTurns: number;
    accuracyBuffValue: number;
    evasionBuffTurns: number;
    evasionBuffValue: number;
    playsPerTurn: number;
    playsLeft: number;
  };
  enemy: {
    maxHp: number;
    hp: number;
    accuracy: number;
    evasion: number;
    weapons: number;
    accuracyBuffTurns: number;
    accuracyBuffValue: number;
    evasionBuffTurns: number;
    evasionBuffValue: number;
    behaviorDeck: UFOBehaviorCard[];
  };
  deck: BattleCard[];
  hand: BattleCard[];
  discard: BattleCard[];
  log: BattleLogEntryV0[];
  finished: boolean;
  result: BattleResult | null;
};

export function createBattleV0(vehicle: Vehicle, ufo: UFO): BattleStateV0 {
  assertDefined(vehicle, 'vehicle');
  assertDefined(ufo, 'ufo');

  const playerConfig = computePlayerBattleConfig(vehicle);

  const baseDeck = getBattleDeckV0();
  const deck = shuffleFixed(baseDeck, playerConfig.deckSize).slice(0, playerConfig.deckSize);

  const vehicleHp = clampInt(80 + vehicle.stats.armor, 50, 200);
  const ufoHp = clampInt(70 + ufo.armor, 40, 250);

  const state: BattleStateV0 = {
    id: crypto.randomUUID(),
    turn: 1,
    maxTurns: MAX_TURNS,
    player: {
      vehicleType: vehicle.type,
      maxHp: vehicleHp,
      hp: vehicleHp,
      maxEnergy: playerConfig.maxEnergy,
      energy: playerConfig.startingEnergy,
      energyPerTurn: playerConfig.energyPerTurn,
      handSize: playerConfig.handSize,
      drawPerTurn: playerConfig.drawPerTurn,
      deckSize: playerConfig.deckSize,
      accuracy: clampInt(55 + Math.floor(vehicle.stats.firepower / 4), 30, 90),
      evasion: clampInt(25 + Math.floor(vehicle.stats.speed / 4), 10, 80),
      basicAttackCost: playerConfig.basicAttackCost,
      basicAttackDamage: playerConfig.basicAttackDamage,
      overwatchTurns: 0,
      accuracyBuffTurns: 0,
      accuracyBuffValue: 0,
      evasionBuffTurns: 0,
      evasionBuffValue: 0,
      playsPerTurn: playerConfig.playsPerTurn,
      playsLeft: playerConfig.playsPerTurn
    },
    enemy: {
      maxHp: ufoHp,
      hp: ufoHp,
      accuracy: clampInt(45 + Math.floor(ufo.weapons / 4), 25, 85),
      evasion: clampInt(20 + Math.floor(ufo.stealthRating / 5), 10, 80),
      weapons: clampInt(ufo.weapons, 10, 120),
      accuracyBuffTurns: 0,
      accuracyBuffValue: 0,
      evasionBuffTurns: 0,
      evasionBuffValue: 0,
      behaviorDeck: getEnemyBehaviorDeckV0(ufo)
    },
    deck,
    hand: [],
    discard: [],
    log: [],
    finished: false,
    result: null
  };

  const afterDraw = drawCards(state, state.player.handSize);
  const afterMulligan = performMulliganIfNeeded(afterDraw);
  return addLog(afterMulligan, `Intercept initiated: ${vehicle.name} vs ${ufo.name}`);
}

export function playCardV0(state: BattleStateV0, cardId: string): BattleStateV0 {
  assertDefined(state, 'state');
  assert(typeof cardId === 'string', 'cardId must be a string');
  if (state.finished) return state;
  if (state.player.playsLeft <= 0) return addLog(state, 'No plays remaining this turn.');

  const cardIndex = state.hand.findIndex(c => c.id === cardId);
  if (cardIndex < 0) return addLog(state, 'Card not in hand.');

  const card = state.hand[cardIndex];
  if (state.player.energy < card.cost) return addLog(state, 'Insufficient energy.');

  const next = clone(state);
  next.player.energy = clampInt(next.player.energy - card.cost, 0, next.player.maxEnergy);
  next.player.playsLeft = clampInt(next.player.playsLeft - 1, 0, next.player.playsPerTurn);

  const [kept, removed] = removeFromHand(next.hand, cardId);
  next.hand = kept;
  next.discard = [...next.discard, ...removed].slice(0, next.player.deckSize);

  return applyCardEffects(next, card);
}

export function playBasicAttackV0(state: BattleStateV0): BattleStateV0 {
  assertDefined(state, 'state');
  if (state.finished) return state;
  if (state.player.playsLeft <= 0) return addLog(state, 'No plays remaining this turn.');
  if (state.player.energy < state.player.basicAttackCost) return addLog(state, 'Insufficient energy.');

  const next = clone(state);
  next.player.energy = clampInt(next.player.energy - next.player.basicAttackCost, 0, next.player.maxEnergy);
  next.player.playsLeft = clampInt(next.player.playsLeft - 1, 0, next.player.playsPerTurn);

  const hit = rollHitChance(getPlayerAccuracy(next), getEnemyEvasion(next));
  if (!hit) return addLog(next, 'Basic attack missed.');

  const raw = Math.floor(next.player.basicAttackDamage + next.player.energyPerTurn);
  const dmg = clampInt(raw, 1, 120);
  next.enemy.hp = clampInt(next.enemy.hp - dmg, 0, next.enemy.maxHp);
  return checkFinish(addLog(next, `Basic attack hit for ${dmg} damage.`));
}

export function endTurnV0(state: BattleStateV0): BattleStateV0 {
  assertDefined(state, 'state');
  if (state.finished) return state;

  const afterEnemy = enemyActs(state);
  const afterFinish = checkFinish(afterEnemy);
  if (afterFinish.finished) return afterFinish;

  const progressed = progressTurn(afterFinish);
  const afterDraw = drawCards(progressed, progressed.player.drawPerTurn);
  const afterMulligan = performMulliganIfNeeded(afterDraw);
  return addLog(afterMulligan, `Turn ${afterMulligan.turn} begins.`);
}

function getBattleDeckV0(): BattleCard[] {
  const safe = PLAYER_BATTLE_CARDS.slice(0, 50);
  assert(safe.length >= 3, 'Not enough battle cards available for Battle v0');
  return safe.slice(0, MAX_DECK_CAP);
}

function performMulliganIfNeeded(state: BattleStateV0): BattleStateV0 {
  if (state.finished) return state;
  if (state.hand.length <= 0) return state;
  if (hasDamageCard(state.hand)) return state;
  if (state.deck.length + state.discard.length <= 0) return state;

  const pick = takeRandomDamageCardFromDeckOrDiscard(state);
  if (!pick) return state;

  const next = clone(state);
  const swapOut = next.hand[0];
  if (!swapOut) return state;

  next.hand = [pick.card, ...next.hand.slice(1)].slice(0, next.player.handSize);
  next.discard = [...next.discard, swapOut].slice(0, next.player.deckSize);

  if (pick.from === 'deck') {
    next.deck = removeByIndex(next.deck, pick.index).slice(0, next.player.deckSize);
  } else {
    next.discard = removeByIndex(next.discard, pick.index).slice(0, next.player.deckSize);
  }

  return addLog(next, `Mulligan: replaced a card with ${pick.card.name}.`);
}

function hasDamageCard(hand: BattleCard[]): boolean {
  const safe = hand.slice(0, MAX_HAND_SIZE_CAP);
  for (let i = 0; i < safe.length && i < MAX_HAND_SIZE_CAP; i++) {
    if (isDamageCard(safe[i])) return true;
  }
  return false;
}

function isDamageCard(card: BattleCard): boolean {
  const effects = (card.effects ?? []).slice(0, 5);
  for (let i = 0; i < effects.length; i++) {
    const e = effects[i];
    if (e.type === 'damage' && e.target === 'enemy' && typeof e.value === 'number' && e.value > 0) return true;
  }
  return false;
}

function takeRandomDamageCardFromDeckOrDiscard(
  state: BattleStateV0
): { from: 'deck' | 'discard'; index: number; card: BattleCard } | null {
  const deckPick = pickRandomDamageCard(state.deck);
  if (deckPick) return { from: 'deck', index: deckPick.index, card: deckPick.card };

  const discardPick = pickRandomDamageCard(state.discard);
  if (discardPick) return { from: 'discard', index: discardPick.index, card: discardPick.card };

  return null;
}

function pickRandomDamageCard(cards: BattleCard[]): { index: number; card: BattleCard } | null {
  const candidates: number[] = [];
  const limit = Math.min(cards.length, 30);

  for (let i = 0; i < limit; i++) {
    const c = cards[i];
    if (c && isDamageCard(c)) candidates.push(i);
  }

  if (candidates.length <= 0) return null;
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  const card = cards[chosen];
  if (!card) return null;
  return { index: chosen, card };
}

function removeByIndex<T>(items: T[], index: number): T[] {
  const safe = items.slice(0, 50);
  if (index < 0 || index >= safe.length) return safe;
  return [...safe.slice(0, index), ...safe.slice(index + 1)];
}

function computePlayerBattleConfig(vehicle: Vehicle): {
  handSize: number;
  drawPerTurn: number;
  deckSize: number;
  maxEnergy: number;
  startingEnergy: number;
  energyPerTurn: number;
  playsPerTurn: number;
  basicAttackCost: number;
  basicAttackDamage: number;
} {
  assertDefined(vehicle, 'vehicle');

  const statsCardSlots = vehicle.stats.cardSlots;
  const battleCardSlots = vehicle.battleStats?.cardSlots;
  const cardSlots = clampInt((battleCardSlots ?? statsCardSlots) ?? 3, 1, 6);

  const handSize = clampInt(3 + Math.floor(cardSlots / 2), 3, MAX_HAND_SIZE_CAP);
  const drawPerTurn = clampInt(1 + Math.floor(cardSlots / 3), 1, 3);
  const deckSize = clampInt(8 + cardSlots, 8, MAX_DECK_CAP);

  const maxEnergyFromBattle = vehicle.battleStats?.maxEnergy;
  const maxEnergy = clampInt(maxEnergyFromBattle ?? 6, 4, 9);

  const energyPerTurnFromBattle = vehicle.battleStats?.energyPerTurn;
  const energyPerTurnFromStats = vehicle.stats.energyGeneration;
  const energyPerTurn = clampInt(energyPerTurnFromBattle ?? energyPerTurnFromStats ?? 2, 1, 6);

  const playsPerTurnBase = vehicle.type === 'interceptor' ? 3 : vehicle.type === 'scout' ? 3 : 2;
  const playsPerTurn = clampInt(playsPerTurnBase + (cardSlots >= 5 ? 1 : 0), 2, MAX_PLAYS_PER_TURN_CAP);

  const startingEnergy = clampInt(Math.floor(maxEnergy / 2), 2, 5);

  const basicAttackCost = 1;
  const vehicleBase = vehicle.type === 'interceptor' ? 18 : vehicle.type === 'scout' ? 14 : 12;
  const scaled = Math.floor((vehicle.stats.firepower ?? 20) / 6);
  const basicAttackDamage = clampInt(vehicleBase + scaled, 10, 35);

  return {
    handSize,
    drawPerTurn,
    deckSize,
    maxEnergy,
    startingEnergy,
    energyPerTurn,
    playsPerTurn,
    basicAttackCost,
    basicAttackDamage
  };
}

function getEnemyBehaviorDeckV0(ufo: UFO): UFOBehaviorCard[] {
  assertDefined(ufo, 'ufo');
  const fromUfo = (ufo.battleStats?.behaviorDeck ?? []).slice(0, 20);
  if (fromUfo.length >= 1) return fromUfo.slice(0, 10);
  return UFO_BEHAVIOR_CARDS_V0.slice(0, 10);
}

function applyCardEffects(state: BattleStateV0, card: BattleCard): BattleStateV0 {
  let next = addLog(state, `Played: ${card.name}`);

  const effects = card.effects.slice(0, 5);
  for (let i = 0; i < effects.length; i++) {
    next = applyEffect(next, effects[i], card.id);
  }

  return checkFinish(next);
}

function applyEffect(state: BattleStateV0, effect: CardEffect, cardId: string): BattleStateV0 {
  const next = clone(state);

  if (effect.type === 'damage' && effect.target === 'enemy' && typeof effect.value === 'number') {
    const hit = rollHitChance(getPlayerAccuracy(next), getEnemyEvasion(next));
    if (!hit) return addLog(next, 'Attack missed.');
    const raw = Math.floor(effect.value + next.player.energyPerTurn * 2);
    const dmg = clampInt(raw, 1, 200);
    next.enemy.hp = clampInt(next.enemy.hp - dmg, 0, next.enemy.maxHp);
    return addLog(next, `Hit for ${dmg} damage.`);
  }

  if (effect.type === 'heal' && effect.target === 'self' && typeof effect.value === 'number') {
    const heal = clampInt(Math.floor(effect.value), 1, 100);
    next.player.hp = clampInt(next.player.hp + heal, 0, next.player.maxHp);
    return addLog(next, `Repaired ${heal} HP.`);
  }

  if (effect.type === 'buff' && effect.target === 'self' && typeof effect.value === 'number') {
    const duration = clampInt(effect.duration ?? 1, 1, 3);
    const value = clampInt(Math.floor(effect.value), 1, 80);

    if (cardId.includes('pilot_focus')) {
      next.player.accuracyBuffTurns = duration;
      next.player.accuracyBuffValue = value;
      return addLog(next, `Accuracy boosted for ${duration} turn(s).`);
    }

    // Generic buff: small evasion bump
    next.player.evasionBuffTurns = duration;
    next.player.evasionBuffValue = Math.floor(value / 2);
    return addLog(next, `Evasion boosted for ${duration} turn(s).`);
  }

  if (effect.type === 'special' && typeof effect.value === 'string') {
    if (effect.value === 'overwatch' || effect.value === 'counter' || cardId.includes('overwatch')) {
      next.player.overwatchTurns = clampInt((next.player.overwatchTurns ?? 0) + 1, 0, 2);
      return addLog(next, 'Overwatch active: next hit reduced.');
    }

    if (effect.value.startsWith('draw:')) {
      const parts = effect.value.split(':');
      const extra = clampInt(Number(parts[1] ?? 0), 0, 3);
      return drawCards(addLog(next, `Drew ${extra} card(s).`), extra);
    }

    return addLog(next, 'Special effect applied.');
  }

  return state;
}

function enemyActs(state: BattleStateV0): BattleStateV0 {
  const next = clone(state);
  const card = pickEnemyCard(next);
  if (!card) return addLog(next, 'UFO hesitates.');

  let after = addLog(next, `UFO played: ${card.name}`);
  const effects = card.effects.slice(0, 5);
  for (let i = 0; i < effects.length; i++) {
    after = applyEnemyEffect(after, effects[i], card.id);
  }

  return after;
}

function pickEnemyCard(state: BattleStateV0): UFOBehaviorCard | null {
  const deck = state.enemy.behaviorDeck.slice(0, 10);
  if (deck.length === 0) return null;

  const hpPct = Math.round((state.enemy.hp / Math.max(1, state.enemy.maxHp)) * 100);

  for (let i = 0; i < deck.length; i++) {
    const card = deck[i];
    const conds = (card.aiConditions ?? []).slice(0, 3);
    if (conds.length === 0) return card;
    let ok = true;

    for (let j = 0; j < conds.length; j++) {
      const c = conds[j];
      const value = c.triggerOn === 'turn' ? state.turn : c.triggerOn === 'health' ? hpPct : 0;
      if (!compareNumber(value, c.comparison, c.threshold)) {
        ok = false;
        break;
      }
    }

    if (ok) return card;
  }

  // fallback: deterministic pick to keep behavior stable
  return deck[(state.turn - 1) % deck.length] ?? null;
}

function compareNumber(value: number, comparison: '>' | '>=' | '=' | '<=' | '<', threshold: number): boolean {
  if (comparison === '>') return value > threshold;
  if (comparison === '>=') return value >= threshold;
  if (comparison === '=') return value === threshold;
  if (comparison === '<=') return value <= threshold;
  return value < threshold;
}

function applyEnemyEffect(state: BattleStateV0, effect: CardEffect, cardId: string): BattleStateV0 {
  const next = clone(state);

  if (effect.type === 'damage' && effect.target === 'enemy' && typeof effect.value === 'number') {
    const hit = rollHitChance(getEnemyAccuracy(next), getPlayerEvasion(next));
    if (!hit) return addLog(next, 'UFO attack missed.');

    const raw = Math.floor(effect.value + next.enemy.weapons / 10);
    const base = clampInt(raw, 1, 120);
    const reduced = next.player.overwatchTurns > 0 ? Math.floor(base * 0.5) : base;
    const dmg = clampInt(reduced, 1, 90);

    next.player.hp = clampInt(next.player.hp - dmg, 0, next.player.maxHp);
    if (next.player.overwatchTurns > 0) next.player.overwatchTurns = clampInt(next.player.overwatchTurns - 1, 0, 2);
    return addLog(next, `UFO hit for ${dmg} damage.`);
  }

  if (effect.type === 'buff' && effect.target === 'self' && typeof effect.value === 'number') {
    const duration = clampInt(effect.duration ?? 1, 1, 3);
    const value = clampInt(Math.floor(effect.value), 1, 80);

    if (cardId.includes('cloak')) {
      next.enemy.evasionBuffTurns = duration;
      next.enemy.evasionBuffValue = value;
      return addLog(next, `UFO evasion boosted for ${duration} turn(s).`);
    }

    next.enemy.accuracyBuffTurns = duration;
    next.enemy.accuracyBuffValue = value;
    return addLog(next, `UFO accuracy boosted for ${duration} turn(s).`);
  }

  return state;
}

function progressTurn(state: BattleStateV0): BattleStateV0 {
  const next = clone(state);

  // Decrement buffs
  if (next.player.accuracyBuffTurns > 0) next.player.accuracyBuffTurns -= 1;
  if (next.player.evasionBuffTurns > 0) next.player.evasionBuffTurns -= 1;
  if (next.enemy.accuracyBuffTurns > 0) next.enemy.accuracyBuffTurns -= 1;
  if (next.enemy.evasionBuffTurns > 0) next.enemy.evasionBuffTurns -= 1;

  next.turn = clampInt(next.turn + 1, 1, next.maxTurns + 1);
  next.player.playsLeft = next.player.playsPerTurn;
  next.player.energy = clampInt(next.player.energy + next.player.energyPerTurn, 0, next.player.maxEnergy);

  return next;
}

function checkFinish(state: BattleStateV0): BattleStateV0 {
  if (state.finished) return state;

  if (state.enemy.hp <= 0) {
    return finish(state, {
      success: true,
      endedBy: 'destroyed',
      vehicleDamage: computeVehicleDamage(state),
      ufoDamage: state.enemy.maxHp,
      message: 'UFO destroyed in engagement.'
    });
  }

  if (state.player.hp <= 0) {
    return finish(state, {
      success: false,
      endedBy: 'crashed',
      vehicleDamage: 100,
      ufoDamage: state.enemy.maxHp - state.enemy.hp,
      message: 'Interceptor lost during engagement.'
    });
  }

  if (state.turn > state.maxTurns) {
    return finish(state, {
      success: false,
      endedBy: 'escaped',
      vehicleDamage: computeVehicleDamage(state),
      ufoDamage: state.enemy.maxHp - state.enemy.hp,
      message: 'UFO escaped after extended pursuit.'
    });
  }

  return state;
}

function finish(state: BattleStateV0, result: BattleResult): BattleStateV0 {
  const next = clone(state);
  next.finished = true;
  next.result = result;
  return addLog(next, `Battle ended: ${result.message}`);
}

function drawCards(state: BattleStateV0, count: number): BattleStateV0 {
  const next = clone(state);
  const handSize = clampInt(next.player.handSize, 3, MAX_HAND_SIZE_CAP);
  const capped = clampInt(count, 0, handSize);
  const space = handSize - next.hand.length;
  const drawCount = clampInt(Math.min(space, capped), 0, handSize);

  for (let i = 0; i < drawCount && i < MAX_HAND_SIZE_CAP; i++) {
    if (next.deck.length === 0) {
      const reshuffled = shuffleFixed(next.discard, next.player.deckSize).slice(0, next.player.deckSize);
      next.deck = reshuffled;
      next.discard = [];
    }

    const card = next.deck[0];
    if (!card) break;
    next.deck = next.deck.slice(1);
    next.hand = [...next.hand, card].slice(0, handSize);
  }

  return next;
}

function removeFromHand(hand: BattleCard[], cardId: string): [BattleCard[], BattleCard[]] {
  const kept: BattleCard[] = [];
  const removed: BattleCard[] = [];

  const safe = hand.slice(0, MAX_HAND_SIZE_CAP);
  for (let i = 0; i < safe.length && i < MAX_HAND_SIZE_CAP; i++) {
    const c = safe[i];
    if (c.id === cardId) removed.push(c);
    else kept.push(c);
  }

  return [kept, removed];
}

function addLog(state: BattleStateV0, message: string): BattleStateV0 {
  const next = clone(state);
  const entry: BattleLogEntryV0 = { turn: next.turn, message };
  next.log = [...next.log, entry].slice(-MAX_LOG);
  return next;
}

function getPlayerAccuracy(state: BattleStateV0): number {
  const buff = state.player.accuracyBuffTurns > 0 ? state.player.accuracyBuffValue : 0;
  return clampInt(state.player.accuracy + buff, 5, 95);
}

function getPlayerEvasion(state: BattleStateV0): number {
  const buff = state.player.evasionBuffTurns > 0 ? state.player.evasionBuffValue : 0;
  return clampInt(state.player.evasion + buff, 5, 95);
}

function getEnemyAccuracy(state: BattleStateV0): number {
  const buff = state.enemy.accuracyBuffTurns > 0 ? state.enemy.accuracyBuffValue : 0;
  return clampInt(state.enemy.accuracy + buff, 5, 95);
}

function getEnemyEvasion(state: BattleStateV0): number {
  const buff = state.enemy.evasionBuffTurns > 0 ? state.enemy.evasionBuffValue : 0;
  return clampInt(state.enemy.evasion + buff, 5, 95);
}

function rollHitChance(attackerAccuracy: number, defenderEvasion: number): boolean {
  const chance = clampFloat(0.15 + (attackerAccuracy - defenderEvasion) / 120, 0.1, 0.9);
  return Math.random() < chance;
}

function computeVehicleDamage(state: BattleStateV0): number {
  const ratio = 1 - state.player.hp / Math.max(1, state.player.maxHp);
  return clampInt(Math.round(ratio * 100), 0, 100);
}

function clampInt(value: number, min: number, max: number): number {
  const safe = Number.isFinite(value) ? Math.trunc(value) : min;
  return Math.max(min, Math.min(max, safe));
}

function clampFloat(value: number, min: number, max: number): number {
  const safe = Number.isFinite(value) ? value : min;
  return Math.max(min, Math.min(max, safe));
}

function shuffleFixed(cards: BattleCard[], max: number): BattleCard[] {
  const copy = cards.slice(0, 50);
  const cap = clampInt(max, 1, MAX_DECK_CAP);
  const capped = copy.slice(0, cap);

  for (let i = capped.length - 1; i > 0 && i < MAX_DECK_CAP; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = capped[i];
    capped[i] = capped[j];
    capped[j] = tmp;
  }

  return capped;
}

function clone(state: BattleStateV0): BattleStateV0 {
  return {
    ...state,
    player: { ...state.player },
    enemy: { ...state.enemy, behaviorDeck: state.enemy.behaviorDeck.slice(0, 10) },
    deck: state.deck.slice(0, state.player.deckSize),
    hand: state.hand.slice(0, state.player.handSize),
    discard: state.discard.slice(0, state.player.deckSize),
    log: state.log.slice(0, MAX_LOG)
  };
}
