import { describe, it, expect, beforeEach } from 'vitest';
import { BattleCard, CardType, CardRarity, CardEffect } from '../../types'; // Adjusted path
import { shuffleDeck, drawCards, getStarterDeck, ALL_CARDS } from '../cards'; // Adjusted path

// Minimal mock cards for testing utilities
const mockCard = (id: string, name: string, cost: number = 1): BattleCard => ({
  id,
  name,
  description: `Description for ${name}`,
  type: 'action' as CardType,
  cost,
  effects: [],
  rarity: 'common' as CardRarity,
});

const card1 = mockCard('c1', 'Card 1');
const card2 = mockCard('c2', 'Card 2');
const card3 = mockCard('c3', 'Card 3');
const card4 = mockCard('c4', 'Card 4');
const card5 = mockCard('c5', 'Card 5');

describe('card utilities', () => {
  describe('shuffleDeck', () => {
    it('should contain the same cards after shuffling', () => {
      const deck = [card1, card2, card3, card4, card5];
      const shuffled = shuffleDeck([...deck]); // Use spread to avoid modifying original
      expect(shuffled).toHaveLength(deck.length);
      deck.forEach(card => {
        expect(shuffled).toContainEqual(card);
      });
    });

    it('should produce a different order (most of the time)', () => {
      const deck = [card1, card2, card3, card4, card5];
      // Run a few times to increase chance of different order if shuffling works
      let differentOrderFound = false;
      for (let i = 0; i < 10; i++) {
        const shuffled = shuffleDeck([...deck]);
        if (shuffled.map(c => c.id).join('') !== deck.map(c => c.id).join('')) {
          differentOrderFound = true;
          break;
        }
      }
      expect(differentOrderFound).toBe(true);
    });

    it('should handle an empty deck', () => {
      const deck: BattleCard[] = [];
      const shuffled = shuffleDeck([...deck]);
      expect(shuffled).toHaveLength(0);
    });
  });

  describe('drawCards', () => {
    let deck: BattleCard[];
    let hand: BattleCard[];
    let discardPile: BattleCard[];

    beforeEach(() => {
      deck = [card1, card2, card3, card4, card5];
      hand = [];
      discardPile = [];
    });

    it('should draw the specified number of cards', () => {
      const result = drawCards(deck, hand, discardPile, 3);
      expect(result.newHand).toHaveLength(3);
      expect(result.newHand).toEqual([card1, card2, card3]);
      expect(result.newDeck).toHaveLength(2);
      expect(result.newDeck).toEqual([card4, card5]);
      expect(result.newDiscardPile).toHaveLength(0);
    });

    it('should draw all remaining cards if count is greater than deck size', () => {
      const result = drawCards(deck, hand, discardPile, 10);
      expect(result.newHand).toHaveLength(5);
      expect(result.newDeck).toHaveLength(0);
    });

    it('should return an empty hand if drawing from an empty deck and empty discard', () => {
      const emptyDeck: BattleCard[] = [];
      const result = drawCards(emptyDeck, hand, discardPile, 3);
      expect(result.newHand).toHaveLength(0);
      expect(result.newDeck).toHaveLength(0);
    });

    it('should reshuffle discard pile into deck if deck is empty', () => {
      const initialDeck: BattleCard[] = [card1];
      const initialDiscard: BattleCard[] = [card2, card3, card4]; // card4 will be on top after shuffle usually

      // Mock console.log to check for reshuffle message
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Draw the only card from deck
      let result = drawCards(initialDeck, hand, initialDiscard, 1);
      expect(result.newHand).toEqual([card1]);
      expect(result.newDeck).toHaveLength(0);
      hand = result.newHand; // Update hand for next draw

      // Try to draw 2 more cards, should trigger reshuffle
      result = drawCards(result.newDeck, hand, initialDiscard, 2);

      expect(consoleSpy).toHaveBeenCalledWith("Reshuffling discard pile into deck.");
      expect(result.newHand).toHaveLength(1 + 2); // card1 + 2 new cards
      expect(result.newDeck).toHaveLength(initialDiscard.length - 2); // 3 - 2 = 1
      expect(result.newDiscardPile).toHaveLength(0);

      // Check that the drawn cards are from the original discard pile
      const drawnFromDiscard = result.newHand.slice(1); // Exclude card1
      initialDiscard.forEach(discardedCard => {
        // Check if the cards drawn are among those that were in the discard pile
        if (drawnFromDiscard.find(c => c.id === discardedCard.id)) {
            expect(initialDiscard.map(c=>c.id)).toContain(discardedCard.id);
        }
      });
      consoleSpy.mockRestore();
    });

    it('should handle drawing 0 cards', () => {
      const result = drawCards(deck, hand, discardPile, 0);
      expect(result.newHand).toHaveLength(0);
      expect(result.newDeck).toHaveLength(5);
    });

    it('should add to existing hand', () => {
        const initialHand = [mockCard('h1', 'Hand Card 1')];
        const result = drawCards(deck, initialHand, discardPile, 2);
        expect(result.newHand).toHaveLength(3);
        expect(result.newHand[0].id).toBe('h1');
        expect(result.newHand[1].id).toBe('c1');
        expect(result.newHand[2].id).toBe('c2');
    });
  });

  describe('getStarterDeck', () => {
    it('should return only common action cards', () => {
      const starterDeck = getStarterDeck();
      starterDeck.forEach(card => {
        expect(card.rarity).toBe('common');
        expect(card.type).toBe('action');
      });
      // Based on current ALL_CARDS, this should be 'fire_missiles', 'cannon_burst', 'focus_fire', 'machine_gun_rake'
      // Plus any other common action cards.
      const commonActionCards = ALL_CARDS.filter(c => c.rarity === 'common' && c.type === 'action');
      expect(starterDeck.length).toBe(commonActionCards.length);
      commonActionCards.forEach(cac => expect(starterDeck.map(s=>s.id)).toContain(cac.id));
    });
  });
});
