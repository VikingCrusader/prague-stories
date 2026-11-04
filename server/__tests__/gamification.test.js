import { calculateLevel, evaluateAchievements, ACHIEVEMENTS, saintOf, LEVELS, huntStep, huntXp, huntReading, HUNT_MULTIPLIERS } from '../src/services/gamification.js';

describe('calculateLevel', () => {
  describe('level thresholds', () => {
    test('100 levels, 1-60 unchanged, 100,000 XP at the top', () => {
      expect(LEVELS).toHaveLength(100);
      expect(LEVELS.slice(0, 60).map(l => l.xpRequired)).toEqual([0, 80, 240, 450, 700, 980, 1310, 1660, 2040, 2450, 2880, 3340, 3820, 4330, 4850, 5400, 5970, 6560, 7160, 7790, 8430, 9100, 9780, 10470, 11190, 11920, 12660, 13430, 14210, 15000, 15750, 16510, 17270, 18040, 18810, 19590, 20370, 21160, 21960, 22760, 23570, 24380, 25200, 26020, 26850, 27690, 28530, 29380, 30230, 31090, 31960, 32830, 33710, 34590, 35480, 36370, 37270, 38180, 39090, 40000]);
      expect(LEVELS[99].xpRequired).toBe(100000);
      for (let i = 1; i < LEVELS.length; i++) expect(LEVELS[i].xpRequired).toBeGreaterThan(LEVELS[i - 1].xpRequired);
      for (const l of LEVELS) for (const k of ['title', 'title_cz', 'title_zh']) expect(l[k]).toEqual(expect.any(String));
    });

    test.each([
      [0, 1, 'Newcomer at the Gate', 80, 0],
      [16350, 31, 'Alderman', 16510, 79],
      [40000, 60, 'King of Bohemia', 41200, 0],
      [100000, 100, 'Soul of Prague', null, 100],
      [250000, 100, 'Soul of Prague', null, 100],
    ])('xp=%i → level %i "%s"', (xp, level, title, nextLevelXP, progress) => {
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
    test('stays at level 100 above 100,000 XP', () => {
      const result = calculateLevel(150000);
      expect(result.level).toBe(100);
      expect(result.progress).toBe(100);
      expect(result.nextLevelXP).toBeNull();
    });
  });

  describe('multilingual titles', () => {
    test('level 1 has Czech and Chinese titles', () => {
      const result = calculateLevel(0);
      expect(result.title_cz).toBe('Příchozí u brány');
      expect(result.title_zh).toBe('城门外的来客');
    });

    test('level 30 has correct multilingual titles', () => {
      const result = calculateLevel(15000);
      expect(result.title_cz).toBe('Rektor');
      expect(result.title_zh).toBe('大学校长');
    });

    test('level 60 has correct multilingual titles', () => {
      const result = calculateLevel(40000);
      expect(result.title_cz).toBe('Král český');
      expect(result.title_zh).toBe('波希米亚国王');
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

  test('unlocks century at 100 cards, not at 99', () => {
    expect(evaluateAchievements({ ...baseStats, totalCheckins: 100 }, []).map(a => a.id)).toContain('century');
    expect(evaluateAchievements({ ...baseStats, totalCheckins: 99 }, []).map(a => a.id)).not.toContain('century');
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

  test('devout_believer needs 40 church cards', () => {
    expect(evaluateAchievements({ ...baseStats, labelCount: { church: 40 } }, []).map(a => a.id)).toContain('devout_believer');
    expect(evaluateAchievements({ ...baseStats, labelCount: { church: 39 } }, []).map(a => a.id)).not.toContain('devout_believer');
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

  test('manchester_of_prague needs half of the Smíchov cards, the three places among them', () => {
    const three = ['staropramen-navstevnicke-centrum', 'lihovar', 'smichovske-nadrazi'];
    const ids = (n, s) => evaluateAchievements({ ...baseStats, checkedSlugs: s, quarterTotal: { 'Smíchov': 41 }, quarterCount: { 'Smíchov': n } }, []).map(a => a.id);
    expect(ids(20, three)).not.toContain('manchester_of_prague');
    expect(ids(21, three)).toContain('manchester_of_prague');
    expect(ids(41, three.slice(1))).not.toContain('manchester_of_prague');
  });

  test('the evening batch: area shares with places, easter eggs, White Mountain', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    const wild = ['prokopske-valley', 'divoka-sarka', 'krucifix-motol', 'modranska-rokle', 'viewpoint-dobeka-1782864480282', 'rozhledna-cibulka'];
    expect(ids({ checkedSlugs: wild, labelCount: { nature: 25 } })).toContain('wild_prague');
    expect(ids({ checkedSlugs: wild.slice(1), labelCount: { nature: 30 } })).not.toContain('wild_prague');
    const q = (quarter, total, n, slugs) => ({ checkedSlugs: slugs, quarterTotal: { [quarter]: total }, quarterCount: { [quarter]: n } });
    expect(ids(q('Žižkov', 30, 15, ['zizkov-tv-tower', 'zizkov-horse-statue']))).toContain('tower_and_general');
    expect(ids(q('Žižkov', 30, 14, ['zizkov-tv-tower', 'zizkov-horse-statue']))).not.toContain('tower_and_general');
    expect(ids(q('Nusle', 31, 13, ['nusle-bridge', 'nuselske-udoli']))).toContain('valley_of_laments');
    expect(ids(q('Vyšehrad', 22, 18, ['sousosi-premysl-a-libuse']))).toContain('libuse_prophecy');
    expect(ids(q('Vyšehrad', 22, 17, ['sousosi-premysl-a-libuse']))).not.toContain('libuse_prophecy');
    expect(ids(q('Josefov', 13, 11, ['old-new-synagogue-1782601630704', 'josefov']))).toContain('golem_in_the_attic');
    expect(ids({ checkedSlugs: ['sapa-praha'] })).toContain('a_bowl_of_pho');
    expect(ids({ checkedSlugs: ['new-castle-ruins-near-kunratice-1783003399902'] })).toContain('king_died_of_anger');
    const wm = ['mohyla-bile-hory', 'hvezda-game-reserve', 'the-pilgrimage-site-of-our-lady-of-victory-on-white-mountain-1783352113593'];
    expect(ids({ checkedSlugs: wm })).toContain('after_white_mountain');
    expect(ids({ checkedSlugs: wm.slice(1) })).not.toContain('after_white_mountain');
  });

  test('marathon_day, payday and rain_or_shine', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ dayMaxCards: 50 })).toContain('marathon_day');
    expect(ids({ dayMaxCards: 49 })).not.toContain('marathon_day');
    expect(ids({ dayMaxXp: 1000 })).toContain('payday');
    expect(ids({ dayMaxXp: 999 })).not.toContain('payday');
    expect(ids({ longestStreak: 7 })).toContain('rain_or_shine');
    expect(ids({ longestStreak: 6 })).not.toContain('rain_or_shine');
  });

  test('night_owl and the_long_way_round', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ nightOwl: 1 })).toContain('night_owl');
    expect(ids({ diamondExpeditions: 1 })).toContain('the_long_way_round');
    expect(ids({})).not.toEqual(expect.arrayContaining(['night_owl']));
  });

  test('for_the_citizens, around_the_world and no_tourists_here', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ labelCount: { municipal: 10 } })).toContain('for_the_citizens');
    expect(ids({ labelCount: { municipal: 9 } })).not.toContain('for_the_citizens');
    expect(ids({ embassySlugs: ['a', 'b'], checkedSlugs: ['a', 'b'] })).toContain('around_the_world');
    expect(ids({ embassySlugs: ['a', 'b'], checkedSlugs: ['a'] })).not.toContain('around_the_world');
    expect(ids({ embassySlugs: [] })).not.toContain('around_the_world');
    expect(ids({ districtCount: { 'Praha 1': 50, 'Praha 8': 20, 'Praha 22': 10 } })).toContain('no_tourists_here');
    expect(ids({ districtCount: { 'Praha 1': 50, 'Praha 7': 40, 'Praha 8': 29 } })).not.toContain('no_tourists_here');
  });

  test('back_and_forth needs a run of 6', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ zigzag: 6 })).toContain('back_and_forth');
    expect(ids({ zigzag: 5 })).not.toContain('back_and_forth');
  });

  test('city_of_silver needs all five Kutná Hora places', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    const five = ['kutna-hora', 'vlassky-dvur', 'kostel-svate-barbory', 'kostnice-sedlec', 'sedlecky-klaster'];
    expect(ids({ checkedSlugs: five })).toContain('city_of_silver');
    expect(ids({ checkedSlugs: five.slice(0, 4) })).not.toContain('city_of_silver');
  });

  test('troy_not_in_greece and neutral_fan', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ checkedSlugs: ['trojsky-kun'], quarterCount: { Troja: 5 } })).toContain('troy_not_in_greece');
    expect(ids({ checkedSlugs: [], quarterCount: { Troja: 9 } })).not.toContain('troy_not_in_greece');
    expect(ids({ checkedSlugs: ['trojsky-kun'], quarterCount: { Troja: 4 } })).not.toContain('troy_not_in_greece');
    const four = ['fortuna-arena', 'epet-arena', 'o2-arena', 'strahov-stadium'];
    expect(ids({ checkedSlugs: four })).toContain('neutral_fan');
    expect(ids({ checkedSlugs: four.slice(1) })).not.toContain('neutral_fan');
  });

  test('each unlocked achievement has id (string) and unlockedAt (Date)', () => {
    const stats = { ...baseStats, checkedSlugs: ['jizni-pol-prahy'] };
    const [ach] = evaluateAchievements(stats, []);
    expect(typeof ach.id).toBe('string');
    expect(ach.unlockedAt).toBeInstanceOf(Date);
  });

  test('the 2026-11-04 batch', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    const truth = ['pamatnik-jana-husa', 'palackeho-namesti', 'pomnik-josefa-jungmanna', 'national-museum', 'national-theatre',
      'vysehrad-cemetery', 'pamatnik-tg-masaryka', 'zamek-lany'];
    expect(ids({ checkedSlugs: truth, labelCount: { 'national-revival': 20 } })).toContain('truth_prevails');
    expect(ids({ checkedSlugs: truth, labelCount: { 'national-revival': 19 } })).not.toContain('truth_prevails');
    expect(ids({ checkedSlugs: truth.slice(0, 7), labelCount: { 'national-revival': 25 } })).not.toContain('truth_prevails');
    expect(ids({ labelCount: { renaissance: 13 } })).toContain('renaissance_man');
    expect(ids({ labelCount: { baroque: 49 } })).not.toContain('all_that_glitters');
    expect(ids({ labelCount: { baroque: 50 } })).toContain('all_that_glitters');
    const art = ['filmove-ateliery-barrandov', 'dox-centre', 'state-opera', 'estates-theatre', 'miminka-kampa'];
    expect(ids({ artCount: 50, checkedSlugs: art })).toContain('art_lover');
    expect(ids({ artCount: 50, checkedSlugs: art.slice(1) })).not.toContain('art_lover');
    expect(ids({ artCount: 50, checkedSlugs: [...art.slice(0, 4), 'rudolfinum'] })).not.toContain('art_lover');
    expect(ids({ artCount: 49, checkedSlugs: art })).not.toContain('art_lover');
    const sm = { quarterTotal: { 'Staré Město': 120 } };
    expect(ids({ ...sm, quarterCount: { 'Staré Město': 108 } })).toContain('old_town_regular');
    expect(ids({ ...sm, quarterCount: { 'Staré Město': 107 } })).not.toContain('old_town_regular');
    const z = ['zbraslavsky-zamek'];
    expect(ids({ checkedSlugs: z, quarterTotal: { Zbraslav: 12 }, quarterCount: { Zbraslav: 10 } })).toContain('aula_regia');
    expect(ids({ checkedSlugs: z, quarterTotal: { Zbraslav: 12 }, quarterCount: { Zbraslav: 9 } })).not.toContain('aula_regia');
  });

  test('knight_errant (any three of eight castles) and paradise_found', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ checkedSlugs: ['hrady-tocnik-a-zebrak', 'zamek-orlik', 'bezdez-castle'] })).toContain('knight_errant');
    expect(ids({ checkedSlugs: ['kost-castle', 'zamek-orlik', 'bezdez-castle'] })).not.toContain('knight_errant');
    const paradise = ['hrad-trosky', 'kost-castle', 'hrad-valdstejn', 'hruboskalsko', 'zricenina-hradu-rotstejn'];
    expect(ids({ checkedSlugs: paradise.slice(2) })).toContain('paradise_found');
    expect(ids({ checkedSlugs: paradise.slice(3) })).not.toContain('paradise_found');
  });

  test('emperors_spring and rose_of_the_south: the main city plus any one more', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ checkedSlugs: ['karlovy-vary', 'cheb-castle'] })).toContain('emperors_spring');
    expect(ids({ checkedSlugs: ['loket-castle', 'jachymov', 'cheb'] })).not.toContain('emperors_spring');
    expect(ids({ checkedSlugs: ['karlovy-vary'] })).not.toContain('emperors_spring');
    expect(ids({ checkedSlugs: ['cesky-krumlov', 'trebon'] })).toContain('rose_of_the_south');
    expect(ids({ checkedSlugs: ['hrad-rozmberk', 'trebon'] })).not.toContain('rose_of_the_south');
  });

  test('iron_and_golden_king: St Vitus, one castle or monastery, one town', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ checkedSlugs: ['st-vitus-cathedral', 'klaster-zlata-koruna', 'nymburk'] })).toContain('iron_and_golden_king');
    expect(ids({ checkedSlugs: ['st-vitus-cathedral', 'pisek', 'nymburk', 'caslav'] })).not.toContain('iron_and_golden_king');
    expect(ids({ checkedSlugs: ['pisek', 'bezdez-castle', 'zvikov-castle'] })).not.toContain('iron_and_golden_king');
  });

  test('early bronze: 10 and 25 cards, the tourist trio, two days in a row', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ totalCheckins: 10 })).toContain('small_harvest');
    expect(ids({ totalCheckins: 24 })).not.toContain('getting_the_hang');
    expect(ids({ totalCheckins: 25 })).toContain('getting_the_hang');
    expect(ids({ checkedSlugs: ['tyn-church', 'charles-bridge', 'st-vitus-cathedral'] })).toContain('tourist_trio');
    expect(ids({ checkedSlugs: ['tyn-church', 'charles-bridge'] })).not.toContain('tourist_trio');
    expect(ids({ longestStreak: 2 })).toContain('see_you_tomorrow');
    expect(ids({ longestStreak: 1 })).not.toContain('see_you_tomorrow');
  });

  test('turning_the_page: reading position in the second era or later', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ historyEraReached: 2 })).toContain('turning_the_page');
    expect(ids({ historyEraReached: 7 })).toContain('turning_the_page');
    expect(ids({ historyEraReached: 1 })).not.toContain('turning_the_page');
  });

  test('starter_pack: the six square landmarks plus any four of the other fourteen', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    const must = ['old-town-square', 'tyn-church', 'mariansky-sloup', 'old-town-hall', 'astronomical-clock', 'pamatnik-jana-husa'];
    const four = ['27-krizu-staromestske-namesti', 'stone-bell-house', 'dum-u-minuty', 'dum-zlaty-kriz'];
    expect(ids({ checkedSlugs: [...must, ...four] })).toContain('starter_pack');
    expect(ids({ checkedSlugs: [...must, ...four.slice(1)] })).not.toContain('starter_pack');
    expect(ids({ checkedSlugs: [...must.slice(1), ...four, 'storch-house'] })).not.toContain('starter_pack');
  });

  test('spring_among_the_ruins needs 15 ruin cards', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ labelCount: { ruin: 15 } })).toContain('spring_among_the_ruins');
    expect(ids({ labelCount: { ruin: 14 } })).not.toContain('spring_among_the_ruins');
  });

  test('highs_and_lows: Teleček and Praha-Sedlec station', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ checkedSlugs: ['telecek-nejvyssi-bod-prahy', 'nadrazi-praha-sedlec'] })).toContain('highs_and_lows');
    expect(ids({ checkedSlugs: ['telecek-nejvyssi-bod-prahy'] })).not.toContain('highs_and_lows');
  });

  test('coast_of_bohemia: ten waterbody cards with the four required', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    const four = ['rudolfuv-rybnik', 'prokopske-jezirko', 'hostiva-reservoir-1783430212752', 'meandry-botice'];
    expect(ids({ checkedSlugs: four, labelCount: { waterbody: 10 } })).toContain('coast_of_bohemia');
    expect(ids({ checkedSlugs: four, labelCount: { waterbody: 9 } })).not.toContain('coast_of_bohemia');
    expect(ids({ checkedSlugs: four.slice(1), labelCount: { waterbody: 12 } })).not.toContain('coast_of_bohemia');
  });

  test('pure_gold, they_glow_at_night, where_two_rivers_meet', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ rarityCount: { legend: 5 } })).toContain('pure_gold');
    expect(ids({ rarityCount: { legend: 4 } })).not.toContain('pure_gold');
    expect(ids({ rarityCount: { epic: 10, mythic: 5, legend: 5, expedition: 10, superior: 50 } })).toContain('they_glow_at_night');
    expect(ids({ rarityCount: { epic: 10, mythic: 5, legend: 5, expedition: 9, superior: 50 } })).not.toContain('they_glow_at_night');
    expect(ids({ checkedSlugs: ['soutok-berounky-vltavy'] })).toContain('where_two_rivers_meet');
    expect(ids({ checkedSlugs: ['zamek-brandys-nad-labem', 'zamek-melnik'] })).toContain('vltava_to_elbe');
    expect(ids({ checkedSlugs: ['stara-boleslav'] })).not.toContain('vltava_to_elbe');
  });

  test('little_poland: half of Bohnice with the estate, Krakov and the hospital', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    const three = ['bohnice', 'oc-krakov', 'psychiatricka-nemocnice-bohnice'];
    const q = (n, slugs) => ({ checkedSlugs: slugs, quarterTotal: { Bohnice: 20 }, quarterCount: { Bohnice: n } });
    expect(ids(q(10, three))).toContain('little_poland');
    expect(ids(q(9, three))).not.toContain('little_poland');
    expect(ids(q(15, three.slice(1)))).not.toContain('little_poland');
  });

  test('vampire needs 25 castle and fortress cards', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ labelCount: { 'castle and fortress': 25 } })).toContain('vampire');
    expect(ids({ labelCount: { 'castle and fortress': 24 } })).not.toContain('vampire');
  });

  test('both_banks, little_eiffel, two_horses', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ banksVisited: 2 })).toContain('both_banks');
    expect(ids({ banksVisited: 1 })).not.toContain('both_banks');
    expect(ids({ checkedSlugs: ['petrin-tower', 'lanova-draha-petrin', 'mirror-maze-petrin'] })).toContain('little_eiffel');
    expect(ids({ checkedSlugs: ['petrin-tower', 'ruzovy-sad-petrin', 'mirror-maze-petrin'] })).not.toContain('little_eiffel');
    expect(ids({ checkedSlugs: ['pomnik-sv-vaclava', 'kino-lucerna'] })).toContain('two_horses');
  });

  test('the_ex: the Slovak Embassy and the old Federal Assembly', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    expect(ids({ checkedSlugs: ['velvyslanectvi-slovenske-republiky', 'nova-budova-narodniho-muzea'] })).toContain('the_ex');
    expect(ids({ checkedSlugs: ['velvyslanectvi-slovenske-republiky'] })).not.toContain('the_ex');
  });

  test('virginia_creeper needs any one card on each of the ten hills', () => {
    const ids = s => evaluateAchievements({ ...baseStats, ...s }, []).map(a => a.id);
    const hills = ['lanova-draha-petrin', 'vinicni-svah-vitkov', 'rotunda-sv-martina', 'letenske-jezirko',
      'maidens-castles-dvn-1783211067574', 'geodeticka-vez-ladvi', 'mohyla-bile-hory', 'parukarka', 'tyrsuv-vrch',
      'televizni-stredisko-kavci-hory'];
    expect(ids({ checkedSlugs: hills })).toContain('virginia_creeper');
    expect(ids({ checkedSlugs: [...hills.slice(1), 'vitkov-national-memorial'] })).not.toContain('virginia_creeper');
    const p = ACHIEVEMENTS.find(a => a.id === 'virginia_creeper').progress({ checkedSlugs: ['lanova-draha-petrin'] });
    expect(p).toMatchObject({ current: 1, target: 10 });
    expect(p.slugs[0]).toBe('lanova-draha-petrin');
    expect(p.slugs[1]).toBe('vitkov-national-memorial');
  });

  test('high_five counts the ones unlocked in the same pass', () => {
    const ids = (s, have = []) => evaluateAchievements({ ...baseStats, ...s }, have).map(a => a.id);
    expect(ids({ unlockDayMax: 5 })).toContain('high_five');
    expect(ids({ unlockDayMax: 4, unlockToday: 2 })).not.toContain('high_five');
    // four earlier today, plus Renaissance Man now
    expect(ids({ unlockToday: 4, labelCount: { renaissance: 13 } })).toContain('high_five');
    expect(ids({ unlockDayMax: 9 }, ['high_five'])).not.toContain('high_five');
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
