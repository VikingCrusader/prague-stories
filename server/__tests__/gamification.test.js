import { calculateLevel, evaluateAchievements, ACHIEVEMENTS, saintOf, LEVELS, huntStep, huntXp, huntReading, HUNT_MULTIPLIERS } from '../src/services/gamification.js';

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

  test('unlocks century at 100 preset check-ins, not at 99', () => {
    expect(evaluateAchievements({ ...baseStats, presetCheckins: 100 }, []).map(a => a.id)).toContain('century');
    expect(evaluateAchievements({ ...baseStats, presetCheckins: 99 }, []).map(a => a.id)).not.toContain('century');
  });

  test('does not re-unlock already earned achievements', () => {
    const stats = { ...baseStats, checkedSlugs: ['jizni-pol-prahy'] };
    expect(evaluateAchievements(stats, ['southern-pole']).map(a => a.id)).not.toContain('southern-pole');
  });

  test('unlocks subway_maniac when all six metro terminals are checked', () => {
    const stats = {
      ...baseStats,
      checkedSlugs: ['nemocnice-motol', 'depo-hostivar', 'haje', 'letňany', 'cerny-most', 'ikea-zlicin'],
    };
    expect(evaluateAchievements(stats, []).map(a => a.id)).toContain('subway_maniac');
  });

  test('does not unlock subway_maniac when only some terminals are checked', () => {
    const stats = { ...baseStats, checkedSlugs: ['nemocnice-motol', 'depo-hostivar', 'haje'] };
    expect(evaluateAchievements(stats, []).map(a => a.id)).not.toContain('subway_maniac');
  });

  test('unlocks southern-pole when jizni-pol-prahy is checked', () => {
    const stats = { ...baseStats, checkedSlugs: ['jizni-pol-prahy'] };
    expect(evaluateAchievements(stats, []).map(a => a.id)).toContain('southern-pole');
  });

  test('bounty_hunter needs one 10x treasure-hunt find', () => {
    expect(evaluateAchievements({ ...baseStats, huntTenX: 1 }, []).map(a => a.id)).toContain('bounty_hunter');
    expect(evaluateAchievements({ ...baseStats, huntTenX: 0 }, []).map(a => a.id)).not.toContain('bounty_hunter');
  });

  test('half_the_city unlocks at half the city cards, rounding up', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ cityCheckins: 50, cityTotal: 101 })).not.toContain('half_the_city');
    expect(ids({ cityCheckins: 51, cityTotal: 101 })).toContain('half_the_city');
    expect(ids({ cityCheckins: 0, cityTotal: 0 })).not.toContain('half_the_city');
  });

  test('hradcany_conqueror needs all seven places and 60% of Hradčany', () => {
    const seven = ['st-vitus-cathedral', 'new-royal-palace', 'old-royal-palace', 'st-georges-basilica',
      'kralovska-zahrada', 'strahov-monastery', 'queen-annes-summer-palace-1782584407663'];
    const ids = s => evaluateAchievements({ ...baseStats, quarterTotal: { 'Hradčany': 70 }, ...s }, []).map(a => a.id);
    expect(ids({ checkedSlugs: seven, quarterCount: { 'Hradčany': 42 } })).toContain('hradcany_conqueror');
    expect(ids({ checkedSlugs: seven, quarterCount: { 'Hradčany': 41 } })).not.toContain('hradcany_conqueror');
    expect(ids({ checkedSlugs: seven.slice(1), quarterCount: { 'Hradčany': 70 } })).not.toContain('hradcany_conqueror');
  });

  test('out_of_town needs one expedition card', () => {
    expect(evaluateAchievements({ ...baseStats, expeditionCheckins: 1 }, []).map(a => a.id)).toContain('out_of_town');
    expect(evaluateAchievements({ ...baseStats, expeditionCheckins: 0 }, []).map(a => a.id)).not.toContain('out_of_town');
  });

  test('devout_believer needs 30 church cards', () => {
    expect(evaluateAchievements({ ...baseStats, labelCount: { church: 30 } }, []).map(a => a.id)).toContain('devout_believer');
    expect(evaluateAchievements({ ...baseStats, labelCount: { church: 29 } }, []).map(a => a.id)).not.toContain('devout_believer');
  });

  test('veni_vidi_vici needs every legend card', () => {
    const legendSlugs = ['a', 'b'];
    expect(evaluateAchievements({ ...baseStats, legendSlugs, checkedSlugs: ['a', 'b'] }, []).map(a => a.id)).toContain('veni_vidi_vici');
    expect(evaluateAchievements({ ...baseStats, legendSlugs, checkedSlugs: ['a'] }, []).map(a => a.id)).not.toContain('veni_vidi_vici');
    expect(evaluateAchievements({ ...baseStats, legendSlugs: [] }, []).map(a => a.id)).not.toContain('veni_vidi_vici');
  });

  test('all_the_colours needs one card of each city rarity, expedition not needed', () => {
    const six = { common: 1, rare: 1, superior: 1, epic: 1, mythic: 1, legend: 1 };
    expect(evaluateAchievements({ ...baseStats, rarityCount: six }, []).map(a => a.id)).toContain('all_the_colours');
    expect(evaluateAchievements({ ...baseStats, rarityCount: { ...six, legend: 0, expedition: 3 } }, []).map(a => a.id)).not.toContain('all_the_colours');
  });

  test('hidden_depths needs 20 mythic cards', () => {
    expect(evaluateAchievements({ ...baseStats, rarityCount: { mythic: 20 } }, []).map(a => a.id)).toContain('hidden_depths');
    expect(evaluateAchievements({ ...baseStats, rarityCount: { mythic: 19 } }, []).map(a => a.id)).not.toContain('hidden_depths');
  });

  test('angel_in_white needs all nine hospitals', () => {
    const nine = ['nemocnice-motol', 'nemocnice-krc', 'porodnice-podoli', 'porodnice-apolinar', 'nemocnice-na-frantisku',
      'italian-hospital-1782409426667', 'nemocnice-milosrdnych-sester', 'fakultni-nemocnice-bulovka', 'psychiatricka-nemocnice-bohnice'];
    expect(evaluateAchievements({ ...baseStats, checkedSlugs: nine }, []).map(a => a.id)).toContain('angel_in_white');
    expect(evaluateAchievements({ ...baseStats, checkedSlugs: nine.slice(1) }, []).map(a => a.id)).not.toContain('angel_in_white');
  });

  test('top_of_the_class needs all nine schools and libraries', () => {
    const nine = ['kampus-albertov', 'karolinum', 'cvut', 'narodni-technicka-knihovna', 'dum-u-lazara', 'vse-praha',
      'czech-university-of-life-sciences-prague-1782583672397', 'national-library-czech-republic', 'akademie-vytvarnych-umeni'];
    expect(evaluateAchievements({ ...baseStats, checkedSlugs: nine }, []).map(a => a.id)).toContain('top_of_the_class');
    expect(evaluateAchievements({ ...baseStats, checkedSlugs: nine.slice(1) }, []).map(a => a.id)).not.toContain('top_of_the_class');
  });

  test('spoilt_for_choice needs 10 check-ins inside 5 minutes', () => {
    expect(evaluateAchievements({ ...baseStats, burst5min: 10 }, []).map(a => a.id)).toContain('spoilt_for_choice');
    expect(evaluateAchievements({ ...baseStats, burst5min: 9 }, []).map(a => a.id)).not.toContain('spoilt_for_choice');
  });

  test('local needs every card of one district, and reports the closest one', () => {
    const districtTotal = { 'Praha 1': 300, 'Praha 20': 3 };
    const stats = (c) => ({ ...baseStats, districtTotal, districtCount: c });
    const local = ACHIEVEMENTS.find(a => a.id === 'local');
    expect(local.check(stats({ 'Praha 20': 3 }))).toBe(true);
    expect(local.check(stats({ 'Praha 20': 2, 'Praha 1': 299 }))).toBe(false);
    expect(local.progress(stats({ 'Praha 20': 1, 'Praha 1': 290 }))).toEqual({ current: 290, target: 300, district: 'Praha 1' });
  });

  test('mind_the_window and chalice_be_with_you need all their places', () => {
    const win = ['novomestska-radnice', 'old-royal-palace', 'slavatuv-obelisk'];
    const ids = s => evaluateAchievements({ ...baseStats, checkedSlugs: s }, []).map(a => a.id);
    expect(ids(win)).toContain('mind_the_window');
    expect(ids(win.slice(1))).not.toContain('mind_the_window');
    const chalice = ['tyn-church', 'pamatnik-jana-husa', 'bethlehem-chapel', 'kostel-sv-martina-ve-zdi',
      'kostel-panny-marie-snezne', 'zizkov-horse-statue', 'namesti-jiriho-z-podebrad', 'husuv-sbor-vrsovice', 'husuv-sbor-vinohrady', 'novomestska-radnice'];
    expect(ids(chalice)).toContain('chalice_be_with_you');
    expect(ids(chalice.slice(1))).not.toContain('chalice_be_with_you');
  });

  test('metamorphosis needs all its places', () => {
    const all = ["kafkuv-dum", "palac-goltz-kinskych", "golden-lane", "kafka-museum", "kafka-statue", "kafka-rotating-head", "new-jewish-cemetery-1782861254358"];
    const ids = s => evaluateAchievements({ ...baseStats, checkedSlugs: s }, []).map(a => a.id);
    expect(ids(all)).toContain('metamorphosis');
    expect(ids(all.slice(1))).not.toContain('metamorphosis');
  });

  test('prague_understands_me needs all its places', () => {
    const all = ["muzeum-antonina-dvoraka", "rudolfinum", "smetana-museum", "pomnik-bedricha-smetany", "national-theatre", "municipal-house", "vysehrad-cemetery", "bertramka-villa-1782603107689", "estates-theatre"];
    const ids = s => evaluateAchievements({ ...baseStats, checkedSlugs: s }, []).map(a => a.id);
    expect(ids(all)).toContain('prague_understands_me');
    expect(ids(all.slice(1))).not.toContain('prague_understands_me');
  });

  test('operation_anthropoid needs all its places', () => {
    const all = ["heydrich-assassination-site", "cathedral-cyril-methodius", "petschek-palace-1782567720752", "-1782584125681", "pankrc-prison-1782564726175"];
    const ids = s => evaluateAchievements({ ...baseStats, checkedSlugs: s }, []).map(a => a.id);
    expect(ids(all)).toContain('operation_anthropoid');
    expect(ids(all.slice(1))).not.toContain('operation_anthropoid');
  });

  test('may_barricades needs all its places', () => {
    const all = ["czech-radio-building-1782668063575", "socha-barikadniku", "pomnik-padlych-barikadniku", "most-barikadniku", "old-town-hall", "stanice-metra-prazskeho-povstani", "pomnik-obetem-prazskeho-povstani-doudlebska", "valecny-hrbitov-olsany"];
    const ids = s => evaluateAchievements({ ...baseStats, checkedSlugs: s }, []).map(a => a.id);
    expect(ids(all)).toContain('may_barricades');
    expect(ids(all.slice(1))).not.toContain('may_barricades');
  });

  test('prague_spring needs all its places', () => {
    const all = ["czech-radio-building-1782668063575", "wenceslas-square", "national-museum", "pamatnik-palacha-zajice", "pamatnik-jana-palacha-sousosi", "faculty-of-arts-uk", "olsanske-hrbitovy"];
    const ids = s => evaluateAchievements({ ...baseStats, checkedSlugs: s }, []).map(a => a.id);
    expect(ids(all)).toContain('prague_spring');
    expect(ids(all.slice(1))).not.toContain('prague_spring');
  });

  test('jingling_keys needs all its places', () => {
    const all = ["kampus-albertov", "pamatnik-sametove-revoluce", "wenceslas-square", "melantrich", "letn-plain-1782906159291", "lavicka-vaclava-havla", "srdce-pro-vaclava-havla"];
    const ids = s => evaluateAchievements({ ...baseStats, checkedSlugs: s }, []).map(a => a.id);
    expect(ids(all)).toContain('jingling_keys');
    expect(ids(all.slice(1))).not.toContain('jingling_keys');
  });

  test('behind_the_iron_curtain needs all its places', () => {
    const all = ["palac-goltz-kinskych", "stara-celnice", "memorial-to-the-victims-of-communism-1782565714871", "statni-bezpecnost-bartolomejska", "namesti-hrdinu", "pankrc-prison-1782564726175", "ruzyn-prison-1782570848316", "letna-park", "john-lennon-wall"];
    const ids = s => evaluateAchievements({ ...baseStats, checkedSlugs: s }, []).map(a => a.id);
    expect(ids(all)).toContain('behind_the_iron_curtain');
    expect(ids(all.slice(1))).not.toContain('behind_the_iron_curtain');
  });

  test('never_forget needs all five places, Lidice and Terezín included', () => {
    const all = ['pinkas-synagogue', 'praha-hlavni-nadrazi', 'petschek-palace-1782567720752', 'lidice', 'koncentracni-tabor-terezin'];
    const ids = s => evaluateAchievements({ ...baseStats, checkedSlugs: s }, []).map(a => a.id);
    expect(ids(all)).toContain('never_forget');
    expect(ids(all.slice(0, 4))).not.toContain('never_forget');
  });

  test('charles_iv needs all six places, Karlštejn included', () => {
    const all = ['emmaus-monastery-1782494564055', 'kostel-panny-marie-snezne', 'karolinum',
      'karlstejn-castle', 'charles-bridge', 'monument-to-charles-iv-1783353104539'];
    const ids = s => evaluateAchievements({ ...baseStats, checkedSlugs: s }, []).map(a => a.id);
    expect(ids(all)).toContain('charles_iv');
    expect(ids(all.filter(s => s !== 'karlstejn-castle'))).not.toContain('charles_iv');
  });

  test('time_traveller and architect need one card of each era / style', () => {
    const eras = ['prehistory', 'medieval', 'early-modern', 'national-revival', 'world-wars', 'communism'];
    const ids = labelSet => evaluateAchievements({ ...baseStats, labelSet }, []).map(a => a.id);
    expect(ids(eras)).toContain('time_traveller');
    expect(ids(eras.slice(1))).not.toContain('time_traveller');
    const styles = ['romanesque', 'gothic', 'renaissance', 'baroque', 'classicism', 'historicism',
      'art-nouveau', 'cubism', 'functionalism', 'brutalism', 'contemporary'];
    expect(ids(styles)).toContain('architect');
    expect(ids(styles.slice(1))).not.toContain('architect');
  });

  test('namesakes needs five churches of one saint and names the closest one', () => {
    const ns = ACHIEVEMENTS.find(a => a.id === 'namesakes');
    expect(ns.check({ ...baseStats, saintCount: { vaclav: 5 } })).toBe(true);
    expect(ns.check({ ...baseStats, saintCount: { vaclav: 4, maria: 4 } })).toBe(false);
    expect(ns.progress({ ...baseStats, saintCount: { vaclav: 3, jakub: 1 } }))
      .toEqual({ current: 3, target: 5, note: { en: 'St Wenceslas', cz: 'sv. Václav', zh: '圣瓦茨拉夫' } });
  });

  test('saintOf reads the saint from the Czech name', () => {
    expect(saintOf({ localizedNames: { cz: 'Kostel sv. Václava (Smíchov)' } })).toBe('vaclav');
    expect(saintOf({ localizedNames: { cz: 'Chrám Matky Boží před Týnem' } })).toBe('maria');
    expect(saintOf({ localizedNames: { cz: 'Kostel sv. Jana Nepomuckého na Skalce' } })).toBe('jan_nepomuk');
    expect(saintOf({ localizedNames: { cz: 'Kostel Nejsvětějšího Srdce Páně' } })).toBeNull();
  });

  test('the city-share ladder: a quarter, half, 80%', () => {
    const ids = n => evaluateAchievements({ ...baseStats, cityCheckins: n, cityTotal: 100 }, []).map(a => a.id);
    expect(ids(24)).not.toContain('a_quarter');
    expect(ids(25)).toContain('a_quarter');
    expect(ids(79)).not.toContain('the_last_mile');
    expect(ids(80)).toEqual(expect.arrayContaining(['a_quarter', 'half_the_city', 'the_last_mile']));
  });

  test('day, hunt and time achievements read their stats', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ earlyBird: 1 })).toContain('early_bird');
    expect(ids({ dayMaxKm: 15.2 })).toContain('north_to_south');
    expect(ids({ dayMaxKm: 14.9 })).not.toContain('north_to_south');
    expect(ids({ dayMaxDistricts: 5 })).toContain('dropping_by');
    expect(ids({ districtsVisited: 22 })).toContain('a_mere_twenty_two');
    expect(ids({ districtsVisited: 21 })).not.toContain('a_mere_twenty_two');
    expect(ids({ huntComeback: 1 })).toContain('never_give_up');
    expect(ids({ huntFinds: 10 })).toContain('raiders');
    expect(ids({ huntTimedOut: true })).toContain('next_time');
    expect(ids({})).toEqual([]);
  });

  test('first_step, full_deck and fast_and_curious', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ totalCheckins: 1 })).toContain('first_step');
    expect(ids({ totalCheckins: 53 })).not.toContain('full_deck');
    expect(ids({ totalCheckins: 54 })).toContain('full_deck');
    expect(ids({ fastestHuntMs: 59 * 60 * 1000 })).toContain('fast_and_curious');
    expect(ids({ fastestHuntMs: 61 * 60 * 1000 })).not.toContain('fast_and_curious');
  });

  test('new_faces and other_side need their places and their label counts', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    const two = ['dancing-house', 'pankrac-skyline'];
    expect(ids({ checkedSlugs: two, labelCount: { contemporary: 15 } })).toContain('new_faces');
    expect(ids({ checkedSlugs: two, labelCount: { contemporary: 14 } })).not.toContain('new_faces');
    expect(ids({ checkedSlugs: two.slice(1), labelCount: { contemporary: 40 } })).not.toContain('new_faces');
    const three = ['haje', 'dum-zelenohorska', 'budova-centrotex'];
    expect(ids({ checkedSlugs: three, labelCount: { brutalism: 5, communism: 5 } })).toContain('other_side');
    expect(ids({ checkedSlugs: three, labelCount: { brutalism: 5, communism: 4 } })).not.toContain('other_side');
    const p = ACHIEVEMENTS.find(a => a.id === 'other_side').progress({ ...baseStats, checkedSlugs: ['haje'], labelCount: { brutalism: 7, communism: 2 } });
    expect(p).toMatchObject({ current: 1 + 5 + 2, target: 13 });
    expect(p.counts).toEqual([{ label: 'brutalism', current: 7, target: 5 }, { label: 'communism', current: 2, target: 5 }]);
  });

  test('seven_bridges and castaway need all their places', () => {
    const ids = s => evaluateAchievements({ ...baseStats, checkedSlugs: s }, []).map(a => a.id);
    const bridges = ['stefanikuv-most', 'cechuv-most', 'manesuv-most', 'charles-bridge', 'most-legii', 'jiraskuv-most', 'palackeho-most'];
    expect(ids(bridges)).toContain('seven_bridges');
    expect(ids(bridges.slice(1))).not.toContain('seven_bridges');
    const islands = ['kampa-island', 'strelecky-ostrov', 'slovansky-ostrov', 'detsky-ostrov'];
    expect(ids(islands)).toContain('castaway');
    expect(ids(islands.slice(1))).not.toContain('castaway');
  });

  test('trainspotter needs all seven stations', () => {
    const st = ['praha-hlavni-nadrazi', 'masarykovo-nadrazi', 'praha-holesovice-nadrazi', 'smichovske-nadrazi',
      'praha-bubny-station', 'praha-liben-nadrazi', 'nadrazi-praha-podbaba'];
    const ids = s => evaluateAchievements({ ...baseStats, checkedSlugs: s }, []).map(a => a.id);
    expect(ids(st)).toContain('trainspotter');
    expect(ids(st.slice(1))).not.toContain('trainspotter');
  });

  test('manchester_of_prague needs half of the Smíchov cards', () => {
    const ids = n => evaluateAchievements({ ...baseStats, quarterTotal: { 'Smíchov': 41 }, quarterCount: { 'Smíchov': n } }, []).map(a => a.id);
    expect(ids(20)).not.toContain('manchester_of_prague');
    expect(ids(21)).toContain('manchester_of_prague');
  });

  test('each unlocked achievement has id (string) and unlockedAt (Date)', () => {
    const stats = { ...baseStats, checkedSlugs: ['jizni-pol-prahy'] };
    const [ach] = evaluateAchievements(stats, []);
    expect(typeof ach.id).toBe('string');
    expect(ach.unlockedAt).toBeInstanceOf(Date);
  });
});

describe('treasure hunt multiplier ladder', () => {
  const mult = (misses, clues) => HUNT_MULTIPLIERS[huntStep(misses, clues)];

  test('a miss drops two rungs, a clue one', () => {
    // Without clues two presses pay a bonus, then 1x for good.
    expect([0, 1, 2, 3].map(m => mult(m, 0))).toEqual([10, 3, 1, 1]);
    expect([0, 1, 2].map(m => mult(m, 1))).toEqual([5, 2, 1]);
    expect([0, 1, 2, 3, 4].map(c => mult(0, c))).toEqual([10, 5, 3, 2, 1]);
  });

  test('a clue always costs less than a miss', () => {
    for (let m = 0; m < 3; m++) for (let c = 0; c < 3; c++) {
      expect(mult(m, c + 1)).toBeGreaterThanOrEqual(mult(m + 1, c));
    }
  });

  test('never drops below 1x', () => {
    expect(mult(10, 10)).toBe(1);
    expect(huntXp(20, huntStep(5, 5))).toBe(20);
  });
});

describe('huntReading', () => {
  test('whole km from 3 km out, half km down to 1 km, then bands', () => {
    expect(huntReading(5800)).toEqual({ about: 6000 });
    expect(huntReading(6400)).toEqual({ about: 6000 });
    expect(huntReading(3400)).toEqual({ about: 3000 });
    expect(huntReading(2800)).toEqual({ about: 3000 });
    expect(huntReading(2600)).toEqual({ about: 2500 });
    expect(huntReading(1200)).toEqual({ about: 1000 });
    expect(huntReading(999)).toEqual({ band: [500, 1000] });
    expect(huntReading(400)).toEqual({ band: [300, 500] });
    expect(huntReading(50)).toEqual({ within: 300 });
  });
});
