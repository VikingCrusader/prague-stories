import { RARITY_XP, RARITY_COLOR, RARITY_LABEL } from '../utils/rarity.js';

const TIERS = ['common', 'rare', 'superior', 'epic', 'mythic', 'legend'];

describe('RARITY_XP', () => {
  test('covers all six tiers in order', () => {
    expect(Object.keys(RARITY_XP)).toEqual(TIERS);
  });

  test('matches server-side values', () => {
    expect(RARITY_XP).toEqual({ common: 10, rare: 20, superior: 30, epic: 50, mythic: 70, legend: 100 });
  });

  test('values are strictly ascending', () => {
    const values = Object.values(RARITY_XP);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

describe('RARITY_COLOR', () => {
  test('has an entry for every tier', () => {
    expect(Object.keys(RARITY_COLOR)).toEqual(TIERS);
  });

  test('every value is a valid six-digit hex colour', () => {
    const invalid = Object.entries(RARITY_COLOR).filter(([, c]) => !/^#[0-9a-fA-F]{6}$/.test(c));
    expect(invalid).toEqual([]);
  });

  test('superior tier uses the distinctive green (#2c8c03)', () => {
    expect(RARITY_COLOR.superior).toBe('#2c8c03');
  });

  test('legend tier uses gold (#FFD700)', () => {
    expect(RARITY_COLOR.legend).toBe('#FFD700');
  });
});

describe('RARITY_LABEL', () => {
  test('has English, Czech, and Chinese entries', () => {
    expect(Object.keys(RARITY_LABEL)).toEqual(expect.arrayContaining(['en', 'cz', 'zh']));
  });

  test('each language covers all six tiers', () => {
    for (const labels of Object.values(RARITY_LABEL)) {
      expect(Object.keys(labels)).toEqual(TIERS);
    }
  });

  test('no label value is an empty string', () => {
    const empty = Object.entries(RARITY_LABEL).flatMap(([lang, labels]) =>
      Object.entries(labels).filter(([, v]) => !v).map(([k]) => `${lang}.${k}`)
    );
    expect(empty).toEqual([]);
  });
});
