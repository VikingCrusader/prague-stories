import { getRarity, RARITY_XP } from '../src/data/rarityMap.js';

describe('RARITY_XP', () => {
  test('has all six tiers', () => {
    expect(Object.keys(RARITY_XP)).toEqual(['common', 'rare', 'superior', 'epic', 'mythic', 'legend']);
  });

  test('XP values are correct', () => {
    expect(RARITY_XP.common).toBe(10);
    expect(RARITY_XP.rare).toBe(20);
    expect(RARITY_XP.superior).toBe(30);
    expect(RARITY_XP.epic).toBe(50);
    expect(RARITY_XP.mythic).toBe(70);
    expect(RARITY_XP.legend).toBe(100);
  });

  test('values are strictly ascending', () => {
    const values = Object.values(RARITY_XP);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

describe('getRarity', () => {
  test('returns "legend" for top landmarks', () => {
    expect(getRarity('prague-castle')).toBe('legend');
    expect(getRarity('charles-bridge')).toBe('legend');
    expect(getRarity('astronomical-clock')).toBe('legend');
    expect(getRarity('national-theatre')).toBe('legend');
  });

  test('returns "epic" for off-the-beaten-path locations', () => {
    expect(getRarity('husuv-sbor-vinohrady')).toBe('epic');
    expect(getRarity('novy-svet')).toBe('epic');
    expect(getRarity('kafka-rotating-head')).toBe('epic');
    expect(getRarity('cisarsky-ostrov')).toBe('epic');
  });

  test('returns "rare" for smart-tourist locations', () => {
    expect(getRarity('pinkas-synagogue')).toBe('rare');
    expect(getRarity('mucha-museum')).toBe('rare');
    expect(getRarity('john-lennon-wall')).toBe('rare');
    expect(getRarity('zizkov-tv-tower')).toBe('rare');
  });

  test('returns "common" for unknown slugs', () => {
    expect(getRarity('this-does-not-exist')).toBe('common');
    expect(getRarity('random-place-xyz')).toBe('common');
  });

  test('returns "common" for empty string', () => {
    expect(getRarity('')).toBe('common');
  });

  test('all returned values are valid rarity tiers', () => {
    const validTiers = new Set(Object.keys(RARITY_XP));
    for (const slug of ['prague-castle', 'pinkas-synagogue', 'husuv-sbor-vinohrady', 'unknown']) {
      expect(validTiers.has(getRarity(slug))).toBe(true);
    }
  });
});
