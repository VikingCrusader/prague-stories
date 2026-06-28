import { calculateLevel, evaluateAchievements, LEVELS } from '../src/services/gamification.js';

describe('calculateLevel', () => {
  describe('level thresholds', () => {
    const cases = [
      [0,    1, 'Newcomer',      100,  0],
      [100,  2, 'Tourist',       300,  0],
      [300,  3, 'Wanderer',      600,  0],
      [600,  4, 'Explorer',     1000,  0],
      [1000, 5, 'Adventurer',   1500,  0],
      [1500, 6, 'Veteran',      3000,  0],
      [3000, 7, 'Conqueror',    6000,  0],
      [6000, 8, 'Prague Legend', null, 100],
    ];

    test.each(cases)('xp=%i → level %i "%s"', (xp, level, title, nextLevelXP, progress) => {
      const result = calculateLevel(xp);
      expect(result.level).toBe(level);
      expect(result.title).toBe(title);
      expect(result.nextLevelXP).toBe(nextLevelXP);
      expect(result.progress).toBe(progress);
    });
  });

  describe('progress within a level', () => {
    test('50 XP → 50% through level 1 (0–100)', () => {
      expect(calculateLevel(50).progress).toBe(50);
    });

    test('99 XP → 99% through level 1', () => {
      expect(calculateLevel(99).progress).toBe(99);
    });

    test('200 XP → 50% through level 2 (100–300)', () => {
      expect(calculateLevel(200).progress).toBe(50);
    });

    test('800 XP → 50% through level 4 (600–1000)', () => {
      expect(calculateLevel(800).progress).toBe(50);
    });
  });

  describe('xp field passthrough', () => {
    test('returns the input XP unchanged', () => {
      expect(calculateLevel(750).xp).toBe(750);
      expect(calculateLevel(0).xp).toBe(0);
      expect(calculateLevel(99999).xp).toBe(99999);
    });
  });

  describe('max level', () => {
    test('stays at level 8 above 6000 XP', () => {
      const result = calculateLevel(99999);
      expect(result.level).toBe(8);
      expect(result.progress).toBe(100);
      expect(result.nextLevelXP).toBeNull();
    });
  });

  describe('multilingual titles', () => {
    test('level 1 has Czech and Chinese titles', () => {
      const result = calculateLevel(0);
      expect(result.title_cz).toBe('Nováček');
      expect(result.title_zh).toBe('新来者');
    });

    test('level 8 has correct multilingual titles', () => {
      const result = calculateLevel(6000);
      expect(result.title_cz).toBe('Pražská legenda');
      expect(result.title_zh).toBe('布拉格传奇');
    });
  });
});

describe('evaluateAchievements', () => {
  const baseStats = {
    totalCheckins: 0,
    presetCheckins: 0,
    totalLocations: 150,
    labelCount: {},
    checkedSlugs: [],
  };

  test('returns empty array when no conditions are met', () => {
    expect(evaluateAchievements(baseStats, [])).toEqual([]);
  });

  test('unlocks first_step on first check-in', () => {
    const stats = { ...baseStats, totalCheckins: 1 };
    const ids = evaluateAchievements(stats, []).map(a => a.id);
    expect(ids).toContain('first_step');
  });

  test('does not re-unlock already earned achievements', () => {
    const stats = { ...baseStats, totalCheckins: 1 };
    const ids = evaluateAchievements(stats, ['first_step']).map(a => a.id);
    expect(ids).not.toContain('first_step');
  });

  test('unlocks explorer_10 and first_step together at 10 check-ins', () => {
    const stats = { ...baseStats, totalCheckins: 10 };
    const ids = evaluateAchievements(stats, []).map(a => a.id);
    expect(ids).toContain('first_step');
    expect(ids).toContain('explorer_10');
  });

  test('unlocks adventurer_25 at 25 check-ins', () => {
    const stats = { ...baseStats, totalCheckins: 25 };
    const ids = evaluateAchievements(stats, []).map(a => a.id);
    expect(ids).toContain('adventurer_25');
  });

  test('unlocks castle_conqueror when prague-castle is in checkedSlugs', () => {
    const stats = { ...baseStats, totalCheckins: 1, checkedSlugs: ['prague-castle'] };
    expect(evaluateAchievements(stats, []).map(a => a.id)).toContain('castle_conqueror');
  });

  test('does not unlock castle_conqueror without prague-castle', () => {
    const stats = { ...baseStats, totalCheckins: 1, checkedSlugs: ['charles-bridge'] };
    expect(evaluateAchievements(stats, []).map(a => a.id)).not.toContain('castle_conqueror');
  });

  test('unlocks subway_maniac when all six metro terminals are checked', () => {
    const stats = {
      ...baseStats,
      checkedSlugs: ['nemocnice-motol', 'depo-hostivar', 'haje', 'letnany', 'cerny-most', 'zlicin'],
    };
    expect(evaluateAchievements(stats, []).map(a => a.id)).toContain('subway_maniac');
  });

  test('does not unlock subway_maniac when only some terminals are checked', () => {
    const stats = { ...baseStats, checkedSlugs: ['nemocnice-motol', 'depo-hostivar', 'haje'] };
    expect(evaluateAchievements(stats, []).map(a => a.id)).not.toContain('subway_maniac');
  });

  test('unlocks history_buff at exactly 30 historical check-ins', () => {
    const stats = { ...baseStats, labelCount: { historical: 30 } };
    expect(evaluateAchievements(stats, []).map(a => a.id)).toContain('history_buff');
  });

  test('does not unlock history_buff at 29 historical check-ins', () => {
    const stats = { ...baseStats, labelCount: { historical: 29 } };
    expect(evaluateAchievements(stats, []).map(a => a.id)).not.toContain('history_buff');
  });

  test('unlocks gem_hunter at 10 hidden-gem check-ins', () => {
    const stats = { ...baseStats, labelCount: { 'hidden-gem': 10 } };
    expect(evaluateAchievements(stats, []).map(a => a.id)).toContain('gem_hunter');
  });

  test('unlocks southern-pole when jizni-pol-prahy is checked', () => {
    const stats = { ...baseStats, checkedSlugs: ['jizni-pol-prahy'] };
    expect(evaluateAchievements(stats, []).map(a => a.id)).toContain('southern-pole');
  });

  test('leisure_seeker combines restaurants-and-cafes + park labels', () => {
    const stats = { ...baseStats, labelCount: { 'restaurants-and-cafes': 15, park: 15 } };
    expect(evaluateAchievements(stats, []).map(a => a.id)).toContain('leisure_seeker');
  });

  test('king_of_prague unlocks when totalCheckins >= totalLocations', () => {
    const stats = { ...baseStats, totalCheckins: 150, totalLocations: 150 };
    expect(evaluateAchievements(stats, []).map(a => a.id)).toContain('king_of_prague');
  });

  test('each unlocked achievement has id (string) and unlockedAt (Date)', () => {
    const stats = { ...baseStats, totalCheckins: 1 };
    const [ach] = evaluateAchievements(stats, []);
    expect(typeof ach.id).toBe('string');
    expect(ach.unlockedAt).toBeInstanceOf(Date);
  });

  test('skipping existing ids prevents duplicates', () => {
    const stats = { ...baseStats, totalCheckins: 25 };
    const existingIds = ['first_step', 'explorer_10'];
    const ids = evaluateAchievements(stats, existingIds).map(a => a.id);
    expect(ids).not.toContain('first_step');
    expect(ids).not.toContain('explorer_10');
    expect(ids).toContain('adventurer_25');
  });
});
