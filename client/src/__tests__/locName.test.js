import { getLocName } from '../utils/locName.js';

describe('getLocName', () => {
  describe('null/undefined location', () => {
    test('returns empty string for null', () => {
      expect(getLocName(null, 'en')).toBe('');
    });

    test('returns empty string for undefined', () => {
      expect(getLocName(undefined, 'cz')).toBe('');
    });
  });

  describe('English language', () => {
    test('returns name for lang="en"', () => {
      const loc = { name: 'Charles Bridge', localizedNames: { cz: 'Karlův most', zh: '查理大桥' } };
      expect(getLocName(loc, 'en')).toBe('Charles Bridge');
    });

    test('uses English name even when localizedNames exist', () => {
      const loc = { name: 'Prague Castle', localizedNames: { cz: 'Pražský hrad' } };
      expect(getLocName(loc, 'en')).toBe('Prague Castle');
    });
  });

  describe('localized languages', () => {
    test('returns Czech name from localizedNames', () => {
      const loc = { name: 'Charles Bridge', localizedNames: { cz: 'Karlův most' } };
      expect(getLocName(loc, 'cz')).toBe('Karlův most');
    });

    test('returns Chinese name from localizedNames', () => {
      const loc = { name: 'Charles Bridge', localizedNames: { cz: 'Karlův most', zh: '查理大桥' } };
      expect(getLocName(loc, 'zh')).toBe('查理大桥');
    });

    test('falls back to name when localizedNames lacks the language', () => {
      const loc = { name: 'Charles Bridge', localizedNames: { cz: 'Karlův most' } };
      expect(getLocName(loc, 'zh')).toBe('Charles Bridge');
    });

    test('falls back to name when localizedNames is missing entirely', () => {
      const loc = { name: 'Charles Bridge' };
      expect(getLocName(loc, 'cz')).toBe('Charles Bridge');
    });
  });

  describe('empty/falsy name fallbacks', () => {
    test('returns empty string when name is empty and no localization', () => {
      expect(getLocName({ name: '' }, 'en')).toBe('');
    });

    test('returns empty string when name and localizedNames entry are both empty', () => {
      expect(getLocName({ name: '', localizedNames: { cz: '' } }, 'cz')).toBe('');
    });
  });
});
