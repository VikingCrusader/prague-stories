import { calculateLevel, evaluateAchievements, LEVELS } from '../src/services/gamification.js';

describe('calculateLevel', () => {
  describe('level thresholds', () => {
    const cases = [
      [0,     1,  'Newcomer',               80,  0],
      [80,    2,  'Tourist',                240, 0],
      [240,   3,  'Wanderer',               450, 0],
      [450,   4,  'Explorer',               700, 0],
      [700,   5,  'Trailblazer',            980, 0],
      [980,   6,  'Adventurer',            1310, 0],
      [1310,  7,  'Pathfinder',            1660, 0],
      [1660,  8,  'Urban Scout',           2040, 0],
      [2040,  9,  'Cartographer',          2450, 0],
      [2450,  10, 'Chronicler',            2880, 0],
      [2880,  11, 'Journeyman Traveler',   3340, 0],
      [3340,  12, 'City Sage',             3820, 0],
      [3820,  13, 'Old Town Regular',      4330, 0],
      [4330,  14, 'Riverside Ranger',      4850, 0],
      [4850,  15, 'Vltava Voyager',        5400, 0],
      [5400,  16, 'Bohemian Scholar',      5970, 0],
      [5970,  17, 'Castle Page',           6560, 0],
      [6560,  18, "Alchemist's Apprentice",7160, 0],
      [7160,  19, 'Golem Tamer',           7790, 0],
      [7790,  20, 'Court Herald',          8430, 0],
      [8430,  21, 'Royal Cartographer',    9100, 0],
      [9100,  22, 'Keeper of Secrets',     9780, 0],
      [9780,  23, 'Bridge Sentinel',      10470, 0],
      [10470, 24, "Castellan's Squire",   11190, 0],
      [11190, 25, 'Hradčany Vanguard',    11920, 0],
      [11920, 26, 'Master Alchemist',     12660, 0],
      [12660, 27, 'Tournament Champion',  13430, 0],
      [13430, 28, 'Medieval Duelist',     14210, 0],
      [14210, 29, 'Conqueror of the Vltava', 15000, 0],
      [15000, 30, 'Charles Bridge Watchman', 15750, 0],
      [15750, 31, 'Silver Knight',        16510, 0],
      [16510, 32, 'Prague Paladin',       17270, 0],
      [17270, 33, 'Knight of the Golden Lane', 18040, 0],
      [18040, 34, 'Castellan of Hradčany', 18810, 0],
      [18810, 35, 'Seneschal of Vyšehrad', 19590, 0],
      [19590, 36, 'Warden of the Old Town', 20370, 0],
      [20370, 37, 'Reeve of Nové Město',  21160, 0],
      [21160, 38, 'Bailiff of the Realm', 21960, 0],
      [21960, 39, 'Court Chronicler',     22760, 0],
      [22760, 40, 'Royal Chamberlain',    23570, 0],
      [23570, 41, 'Baron of the Vltava',  24380, 0],
      [24380, 42, 'Viscount of Malá Strana', 25200, 0],
      [25200, 43, 'Count of Bohemia',     26020, 0],
      [26020, 44, 'Count Palatine',       26850, 0],
      [26850, 45, 'Marquess of Vyšehrad', 27690, 0],
      [27690, 46, 'Margrave of Moravia',  28530, 0],
      [28530, 47, 'Landgrave of Karlštejn', 29380, 0],
      [29380, 48, 'Burgrave of the Castle', 30230, 0],
      [30230, 49, 'Duke of Malá Strana',  31090, 0],
      [31090, 50, 'Archduke of Prague',   31960, 0],
      [31960, 51, 'Grand Elector',        32830, 0],
      [32830, 52, 'Prince of Bohemia',    33710, 0],
      [33710, 53, 'Crown Prince of the Realm', 34590, 0],
      [34590, 54, 'King of the Vltava',   35480, 0],
      [35480, 55, 'High King of Bohemia', 36370, 0],
      [36370, 56, 'Holy Roman Emperor',   37270, 0],
      [37270, 57, 'Immortal Wanderer',    38180, 0],
      [38180, 58, 'Eternal Watchman of Prague', 39090, 0],
      [39090, 59, 'Mythic Sovereign',     40000, 0],
      [40000, 60, 'Prague Legend',          null, 100],
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
    test('40 XP → 50% through level 1 (0–80)', () => {
      expect(calculateLevel(40).progress).toBe(50);
    });

    test('79 XP → 99% through level 1', () => {
      expect(calculateLevel(79).progress).toBe(99);
    });

    test('160 XP → 50% through level 2 (80–240)', () => {
      expect(calculateLevel(160).progress).toBe(50);
    });

    test('575 XP → 50% through level 4 (450–700)', () => {
      expect(calculateLevel(575).progress).toBe(50);
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
    test('stays at level 60 above 40000 XP', () => {
      const result = calculateLevel(99999);
      expect(result.level).toBe(60);
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

    test('level 30 has correct multilingual titles', () => {
      const result = calculateLevel(15000);
      expect(result.title_cz).toBe('Strážce Karlova mostu');
      expect(result.title_zh).toBe('查理大桥守望者');
    });

    test('level 60 has correct multilingual titles', () => {
      const result = calculateLevel(40000);
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
