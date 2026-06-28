import { getArt, LABEL_DEFINITIONS, LABEL_COLORS } from '../utils/pixelArtMap.js';

describe('getArt', () => {
  describe('known pixelArtKey', () => {
    test('castle key returns castle emoji', () => {
      expect(getArt('castle', [])).toBe('🏰');
    });

    test('bridge key returns bridge emoji', () => {
      expect(getArt('bridge', 'historical')).toBe('🌉');
    });

    test('pub key returns beer emoji regardless of label', () => {
      expect(getArt('pub', 'church')).toBe('🍺');
    });

    test('museum key returns correct emoji', () => {
      expect(getArt('museum', [])).toBe('🏛️');
    });
  });

  describe('unknown pixelArtKey — falls back to label emoji', () => {
    test('falls back to LABEL_DEFINITIONS emoji for a string label', () => {
      expect(getArt('nonexistent-key', 'church')).toBe('⛪');
    });

    test('falls back using first element of an array label', () => {
      expect(getArt('nonexistent-key', ['historical', 'cultural'])).toBe('🏛️');
    });

    test('ignores subsequent labels — only first is used', () => {
      const withChurchFirst = getArt('nonexistent-key', ['church', 'bridge']);
      const withBridgeFirst = getArt('nonexistent-key', ['bridge', 'church']);
      expect(withChurchFirst).toBe('⛪');
      expect(withBridgeFirst).toBe('🌉');
    });
  });

  describe('ultimate fallback to pin emoji', () => {
    test('returns 📍 when key and label are both unknown', () => {
      expect(getArt('nonexistent', 'nonexistent-label')).toBe('📍');
    });

    test('returns 📍 when labels array is empty', () => {
      expect(getArt('nonexistent', [])).toBe('📍');
    });

    test('returns 📍 when label is undefined', () => {
      expect(getArt('nonexistent', undefined)).toBe('📍');
    });
  });
});

describe('LABEL_DEFINITIONS', () => {
  test('every entry has emoji, en, cz, and zh fields', () => {
    for (const [key, def] of Object.entries(LABEL_DEFINITIONS)) {
      expect(typeof def.emoji).toBe('string');
      expect(typeof def.en).toBe('string');
      expect(typeof def.cz).toBe('string');
      expect(typeof def.zh).toBe('string');
    }
  });

  test('no entry has an empty emoji', () => {
    const empty = Object.entries(LABEL_DEFINITIONS).filter(([, d]) => !d.emoji);
    expect(empty).toEqual([]);
  });

  test('includes core label types', () => {
    expect(LABEL_DEFINITIONS).toHaveProperty('church');
    expect(LABEL_DEFINITIONS).toHaveProperty('historical');
    expect(LABEL_DEFINITIONS).toHaveProperty('park');
    expect(LABEL_DEFINITIONS).toHaveProperty('hidden-gem');
    expect(LABEL_DEFINITIONS).toHaveProperty('landmark');
  });
});

describe('LABEL_COLORS', () => {
  test('every colour value is a valid hex string', () => {
    const hexPattern = /^#[0-9a-f]{6}$/i;
    const invalid = Object.entries(LABEL_COLORS).filter(([, c]) => !hexPattern.test(c));
    expect(invalid).toEqual([]);
  });

  test('all LABEL_DEFINITIONS keys also have a LABEL_COLORS entry', () => {
    const missing = Object.keys(LABEL_DEFINITIONS).filter(k => !(k in LABEL_COLORS));
    expect(missing).toEqual([]);
  });
});
