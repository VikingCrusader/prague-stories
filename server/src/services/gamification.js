// Treasure hunt ("寻宝"): the location stays hidden and the user tracks it
// down from clues. One hunt every 24h (the "random draw" names in the code
// and API date from the retired open draw, which revealed the card for 3x
// XP). See userController.buildHuntClues / drawRandomLocation and
// checkinController.
export const RANDOM_DRAW_WINDOW_MS = 24 * 60 * 60 * 1000;

// One hunt since 2026-10-29, merging the old clue hunt and hardcore hunt
// (user's call), built on the hardcore hunt's exploring: the player mostly
// walks by a rough distance and a hot-and-cold hint. Clues that are card
// attributes (labels, rarity, quarter, district) are filters on the Explore
// page and the map, where every locked card shows its labels and distance,
// so they come late and one at a time.
//
// Reworked 2026-10-31 (user's call, for the thrill of a treasure slowly
// giving itself away): the clues come in a fixed order (HUNT_CLUE_ORDER),
// all within the last 3 km, nothing before. Walking brings the next one for
// free at each distance in HUNT_FREE_CLUE_AT: the river bank within 3 km,
// the district within 1 km, the quarter within 500 m, and within 300 m the
// label or the rarity, 50/50 (a label is any of the card's labels, each as
// likely: the luck is part of the game). The other of the two can only be
// bought. Buying a clue gets the next one in the order early, whatever the
// distance; a clue already had is not given again when walking reaches it.
// There is no bought direction: the direction only comes with a miss.
//
// The multiplier ladder: a clue moves one rung down, a miss two (10 → 3
// → 1: without clues only two presses pay a bonus, so a press is a real
// gamble). It never goes below 1x (the card's plain XP), and misses never
// end the hunt; only the 24h window does.
export const HUNT_MULTIPLIERS = [10, 5, 3, 2, 1];
export const HUNT_MISS_STEPS = 2;
export const HUNT_CLUE_STEPS = 1;
// A press within this distance of the treasure finds it. The button works
// anywhere; a miss tells which way the treasure lies from the pressed spot.
export const HIDDEN_DRAW_HIT_M = 100;
// The clue order. 'close' is the label or the rarity, whichever is drawn
// first (HUNT_CLOSE_KEYS, 50/50), 'other' the one left.
export const HUNT_CLUE_ORDER = ['side', 'district', 'quarter', 'close', 'other'];
export const HUNT_CLOSE_KEYS = ['label', 'rarity'];
// Where walking in brings each clue of HUNT_CLUE_ORDER for free (by index;
// the last one is never free).
export const HUNT_FREE_CLUE_AT = [3000, 1000, 500, 300];
// A new treasure is at least this far from where the player starts the hunt
// (when anything that far is left), so a hunt is always a walk.
export const HUNT_MIN_START_M = 4000;
// Hot and cold: every HUNT_TREND_STEP_M walked the player is told whether
// they got closer or farther (no figure, no direction); a change under
// HUNT_TREND_SAME_M reads as "about the same". It fixed the old hardcore
// hunt's blind opening, a whole kilometre walked before a wrong heading
// showed. Within HUNT_TREND_MAX_M it stops (user's call, 2026-10-31): there
// the clues are enough, and a verdict every 100 m in a 300 m circle would
// point the way, which only a miss should do.
export const HUNT_TREND_STEP_M = 100;
export const HUNT_TREND_SAME_M = 40;
export const HUNT_TREND_MAX_M = 500;

/** Where on HUNT_MULTIPLIERS a hunt stands, from its misses and clues taken. */
export function huntStep(misses, clues) {
  return Math.min(misses * HUNT_MISS_STEPS + clues * HUNT_CLUE_STEPS, HUNT_MULTIPLIERS.length - 1);
}

/** Presses that missed so far (a leftover "skipped" entry is not a press). */
export function huntMissCount(draw) {
  return (draw?.misses || []).filter(m => !m.skipped).length;
}

/**
 * A hunt's current step on HUNT_MULTIPLIERS: bought clues count, free ones
 * don't (old skipped guesses count as clues).
 */
export function huntStepOf(draw) {
  const skipped = (draw?.misses || []).length - huntMissCount(draw);
  const bought = (draw?.clues || []).filter(c => !c.free).length;
  return huntStep(huntMissCount(draw), bought + skipped);
}

/** XP for collecting a treasure at ladder step `step`. */
export function huntXp(xpReward, step) {
  return Math.round(xpReward * HUNT_MULTIPLIERS[step]);
}

// The distance clue, always shown and deliberately coarse: an exact distance
// plus Explore's card distances picks out the treasure, and two readings a
// short walk apart triangulate it. Rounded to the nearest km from 3 km out
// (5.8 and 6.4 km both read "about 6 km"), to the nearest 0.5 km from 3 km
// down to 1 km, then only the bands 500 m–1 km, 300–500 m and "within
// 300 m" (user's call, 2026-10-31). There is deliberately no "within
// 100 m" (the hit radius): with it a press could never miss (dropped
// 2026-10-29).
export function huntReading(d) {
  if (d < 300) return { within: 300 };
  if (d < 500) return { band: [300, 500] };
  if (d < 1000) return { band: [500, 1000] };
  if (d < 2750) return { about: Math.round(d / 500) * 500 };
  return { about: Math.round(d / 1000) * 1000 };
}

// The first clue besides a label: which side of the Vltava the treasure is
// on (2026-10-15; it replaced the direction from Old Town Square, which with
// the fine-grained era/style labels narrowed guess 1 to a handful of cards).
// Every katastrální území with a hunt card lies wholly on one bank, so the
// side comes from the card's `quarter`. These are the left-bank ("castle
// side") quarters; every other Prague quarter is on the right bank ("Old
// Town side"). Left/right, not west/east: in the north the river runs
// east-west, with Holešovice and Bubeneč on the left bank facing Troja.
export const LEFT_BANK_QUARTERS = new Set([
  'Malá Strana', 'Hradčany', 'Smíchov', 'Holešovice', 'Bubeneč', 'Dejvice', 'Střešovice',
  'Břevnov', 'Vokovice', 'Veleslavín', 'Liboc', 'Ruzyně', 'Řepy', 'Zličín', 'Sobín',
  'Třebonice', 'Stodůlky', 'Jinonice', 'Radlice', 'Košíře', 'Motol', 'Hlubočepy',
  'Slivenec', 'Holyně', 'Řeporyje', 'Lochkov', 'Velká Chuchle', 'Malá Chuchle', 'Radotín',
  'Lahovice', 'Lipence', 'Zbraslav', 'Sedlec', 'Suchdol', 'Lysolaje', 'Nebušice',
  'Přední Kopanina', 'Zadní Kopanina',
]);
// Cards that are on neither bank (bridges over the Vltava, the statues on
// Charles Bridge, the islands and what stands on them, the Old Town Weir, the
// Podbaba ferry) can't be hunted: the side clue would mislead (user's call,
// 2026-10-15). Bridges over other water (Nusle Bridge, the Hlubočepy
// viaducts) and bridge towers on a bank stay in.
export const HUNT_EXCLUDED_SLUGS = [
  // bridges over the Vltava and what stands on them
  'charles-bridge', 'socha-svateho-jana-nepomuckeho', 'socha-sv-ludmily-karluv-most', 'kalvarie-karluv-most',
  'socha-sv-vojtecha-karluv-most', 'cechuv-most', 'sochy-geniu-cechuv-most', 'most-legii',
  'manesuv-most', 'jiraskuv-most', 'palackeho-most', 'stefanikuv-most', 'hlavkuv-most',
  'stvanicka-lavka-holka', 'negrelliho-viadukt', 'libensky-most', 'most-barikadniku',
  'trojsky-most', 'trojska-lavka', 'novy-most-cisarsky-ostrov', 'vysehrad-railway-bridge',
  'dvorecky-most', 'branicky-most', 'barrandovsky-most', 'radotinsky-most', 'most-zavodu-miru',
  // islands and what stands on them
  'kampa-island', 'museum-kampa-1782563427306', 'liechtenstein-palace-on-kampa-1782495483416',
  'strelecky-ostrov', 'slovansky-ostrov', 'palac-zofin', 'galerie-manes', 'cisarsky-ostrov',
  'vodni-elektrarna-stvanice', 'fuchs2', 'detsky-ostrov', 'socha-vltavy',
  // across the river
  'staromestsky-jez', 'privoz-podbaba-podhori',
];
export function riverSideOf(quarter) {
  if (!quarter) return null;
  return LEFT_BANK_QUARTERS.has(quarter) ? 'castle' : 'oldTown';
}
// A card with any of these counts as a "historical location" for the
// History Fan achievement: the era and architectural-style labels that
// replaced the old catch-all "historical" label (2026-10-15).
export const HISTORY_LABELS = new Set([
  'communism',
  'prehistory', 'medieval', 'early-modern', 'national-revival', 'world-wars',
  'romanesque', 'gothic', 'renaissance', 'baroque', 'classicism', 'historicism',
  'art-nouveau', 'cubism', 'functionalism', 'brutalism',
]);

// 100 levels (2026-11-02, user's call): the thresholds of levels 1-60 are
// unchanged; 61-100 climb from 40,000 to 100,000 XP. The titles follow
// one path through Prague's history: newcomer and street trades, guilds,
// scholars, town offices, knights and nobles, the kingdom's high offices
// up to king, emperors, legends, the city's keepers, and its soul.
export const LEVELS = [
  { level: 1, title: "Newcomer at the Gate", title_cz: "Příchozí u brány", title_zh: "城门外的来客", xpRequired: 0 },
  { level: 2, title: "Pilgrim", title_cz: "Poutník", title_zh: "朝圣者", xpRequired: 80 },
  { level: 3, title: "Market-Goer", title_cz: "Návštěvník trhu", title_zh: "赶集的人", xpRequired: 240 },
  { level: 4, title: "Water Carrier", title_cz: "Nosič vody", title_zh: "挑水夫", xpRequired: 450 },
  { level: 5, title: "Ferryman's Helper", title_cz: "Převozníkův pomocník", title_zh: "摆渡人的帮手", xpRequired: 700 },
  { level: 6, title: "Messenger", title_cz: "Posel", title_zh: "信使", xpRequired: 980 },
  { level: 7, title: "Lamplighter", title_cz: "Lampář", title_zh: "点灯人", xpRequired: 1310 },
  { level: 8, title: "Night Watchman", title_cz: "Ponocný", title_zh: "守夜人", xpRequired: 1660 },
  { level: 9, title: "Bridge Toll Collector", title_cz: "Mostný", title_zh: "桥头收税人", xpRequired: 2040 },
  { level: 10, title: "Burgher", title_cz: "Měšťan", title_zh: "市民", xpRequired: 2450 },
  { level: 11, title: "Apprentice", title_cz: "Učeň", title_zh: "学徒", xpRequired: 2880 },
  { level: 12, title: "Journeyman", title_cz: "Tovaryš", title_zh: "帮工", xpRequired: 3340 },
  { level: 13, title: "Brewer", title_cz: "Sládek", title_zh: "酿酒师", xpRequired: 3820 },
  { level: 14, title: "Glassmaker", title_cz: "Sklář", title_zh: "玻璃匠", xpRequired: 4330 },
  { level: 15, title: "Goldsmith of Golden Lane", title_cz: "Zlatník ze Zlaté uličky", title_zh: "黄金巷的金匠", xpRequired: 4850 },
  { level: 16, title: "Bell-Founder", title_cz: "Zvonař", title_zh: "铸钟匠", xpRequired: 5400 },
  { level: 17, title: "Printer", title_cz: "Knihtiskař", title_zh: "印刷匠", xpRequired: 5970 },
  { level: 18, title: "Clockmaker", title_cz: "Hodinář", title_zh: "钟表匠", xpRequired: 6560 },
  { level: 19, title: "Stonemason of St Vitus", title_cz: "Kameník svatovítské huti", title_zh: "圣维特教堂的石匠", xpRequired: 7160 },
  { level: 20, title: "Guild Master", title_cz: "Cechmistr", title_zh: "行会会长", xpRequired: 7790 },
  { level: 21, title: "Student of the Karolinum", title_cz: "Student Karolina", title_zh: "卡罗林学院的学生", xpRequired: 8430 },
  { level: 22, title: "Bachelor", title_cz: "Bakalář", title_zh: "学士", xpRequired: 9100 },
  { level: 23, title: "Master of Arts", title_cz: "Mistr svobodných umění", title_zh: "文科硕士", xpRequired: 9780 },
  { level: 24, title: "Scribe", title_cz: "Písař", title_zh: "书记员", xpRequired: 10470 },
  { level: 25, title: "Town Clerk", title_cz: "Městský písař", title_zh: "市政书记", xpRequired: 11190 },
  { level: 26, title: "Chronicler", title_cz: "Kronikář", title_zh: "编年史家", xpRequired: 11920 },
  { level: 27, title: "Alchemist at Rudolf's Court", title_cz: "Alchymista na Rudolfově dvoře", title_zh: "鲁道夫宫廷的炼金术士", xpRequired: 12660 },
  { level: 28, title: "Kepler's Assistant", title_cz: "Keplerův pomocník", title_zh: "开普勒的助手", xpRequired: 13430 },
  { level: 29, title: "Court Astronomer", title_cz: "Dvorní astronom", title_zh: "宫廷天文学家", xpRequired: 14210 },
  { level: 30, title: "Rector", title_cz: "Rektor", title_zh: "大学校长", xpRequired: 15000 },
  { level: 31, title: "Alderman", title_cz: "Konšel", title_zh: "议员", xpRequired: 15750 },
  { level: 32, title: "Town Judge", title_cz: "Rychtář", title_zh: "城镇法官", xpRequired: 16510 },
  { level: 33, title: "Sworn Juror", title_cz: "Přísežný", title_zh: "陪审", xpRequired: 17270 },
  { level: 34, title: "Burgomaster of the Lesser Town", title_cz: "Purkmistr Malé Strany", title_zh: "小城市长", xpRequired: 18040 },
  { level: 35, title: "Burgomaster of the New Town", title_cz: "Purkmistr Nového Města", title_zh: "新城市长", xpRequired: 18810 },
  { level: 36, title: "Burgomaster of the Old Town", title_cz: "Purkmistr Starého Města", title_zh: "老城市长", xpRequired: 19590 },
  { level: 37, title: "Keeper of the Town Seal", title_cz: "Strážce městské pečeti", title_zh: "城市印信保管人", xpRequired: 20370 },
  { level: 38, title: "Captain of the Town Guard", title_cz: "Hejtman městské stráže", title_zh: "城防队长", xpRequired: 21160 },
  { level: 39, title: "Defender of the Bridge Tower", title_cz: "Obránce mostecké věže", title_zh: "桥塔守卫者", xpRequired: 21960 },
  { level: 40, title: "Hussite Captain", title_cz: "Husitský hejtman", title_zh: "胡斯军统领", xpRequired: 22760 },
  { level: 41, title: "Squire", title_cz: "Panoš", title_zh: "侍从", xpRequired: 23570 },
  { level: 42, title: "Herald", title_cz: "Herold", title_zh: "传令官", xpRequired: 24380 },
  { level: 43, title: "Knight", title_cz: "Rytíř", title_zh: "骑士", xpRequired: 25200 },
  { level: 44, title: "Vladyka", title_cz: "Vladyka", title_zh: "乡绅", xpRequired: 26020 },
  { level: 45, title: "Castellan", title_cz: "Kastelán", title_zh: "城堡主管", xpRequired: 26850 },
  { level: 46, title: "Burgrave of Vyšehrad", title_cz: "Purkrabí vyšehradský", title_zh: "维谢赫拉德城堡伯爵", xpRequired: 27690 },
  { level: 47, title: "Burgrave of Prague Castle", title_cz: "Purkrabí Pražského hradu", title_zh: "布拉格城堡伯爵", xpRequired: 28530 },
  { level: 48, title: "Lord", title_cz: "Pán", title_zh: "领主", xpRequired: 29380 },
  { level: 49, title: "Baron", title_cz: "Svobodný pán", title_zh: "男爵", xpRequired: 30230 },
  { level: 50, title: "Count", title_cz: "Hrabě", title_zh: "伯爵", xpRequired: 31090 },
  { level: 51, title: "Royal Chamberlain", title_cz: "Královský komoří", title_zh: "王室内侍", xpRequired: 31960 },
  { level: 52, title: "Supreme Scribe", title_cz: "Nejvyšší písař", title_zh: "王国最高书记", xpRequired: 32830 },
  { level: 53, title: "Supreme Judge", title_cz: "Nejvyšší sudí", title_zh: "王国最高法官", xpRequired: 33710 },
  { level: 54, title: "Supreme Chancellor", title_cz: "Nejvyšší kancléř", title_zh: "王国最高大法官", xpRequired: 34590 },
  { level: 55, title: "Supreme Burgrave", title_cz: "Nejvyšší purkrabí", title_zh: "王国最高城堡伯爵", xpRequired: 35480 },
  { level: 56, title: "Margrave", title_cz: "Markrabě", title_zh: "藩侯", xpRequired: 36370 },
  { level: 57, title: "Duke", title_cz: "Vévoda", title_zh: "公爵", xpRequired: 37270 },
  { level: 58, title: "Prince", title_cz: "Kníže", title_zh: "亲王", xpRequired: 38180 },
  { level: 59, title: "Elector", title_cz: "Kurfiřt", title_zh: "选帝侯", xpRequired: 39090 },
  { level: 60, title: "King of Bohemia", title_cz: "Král český", title_zh: "波希米亚国王", xpRequired: 40000 },
  { level: 61, title: "Keeper of the Crown Jewels", title_cz: "Strážce korunovačních klenotů", title_zh: "王冠珍宝守护人", xpRequired: 41200 },
  { level: 62, title: "Holder of the Seven Keys", title_cz: "Držitel sedmi klíčů", title_zh: "七把钥匙的持有者", xpRequired: 42420 },
  { level: 63, title: "King of the Romans", title_cz: "Římský král", title_zh: "罗马人的国王", xpRequired: 43650 },
  { level: 64, title: "Holy Roman Emperor", title_cz: "Římský císař", title_zh: "神圣罗马皇帝", xpRequired: 44890 },
  { level: 65, title: "Founder of the New Town", title_cz: "Zakladatel Nového Města", title_zh: "新城的缔造者", xpRequired: 46150 },
  { level: 66, title: "Builder of the Stone Bridge", title_cz: "Stavitel kamenného mostu", title_zh: "石桥的建造者", xpRequired: 47430 },
  { level: 67, title: "Founder of the University", title_cz: "Zakladatel univerzity", title_zh: "大学的创立者", xpRequired: 48720 },
  { level: 68, title: "Lord of Karlštejn", title_cz: "Pán Karlštejna", title_zh: "卡尔什泰因之主", xpRequired: 50030 },
  { level: 69, title: "The Iron and Golden King", title_cz: "Král železný a zlatý", title_zh: "铁与金之王", xpRequired: 51350 },
  { level: 70, title: "Heir of the Přemyslids", title_cz: "Dědic Přemyslovců", title_zh: "普热米斯尔王朝的继承人", xpRequired: 52690 },
  { level: 71, title: "Heir of Přemysl the Ploughman", title_cz: "Dědic Přemysla Oráče", title_zh: "农夫普热米斯尔的传人", xpRequired: 54050 },
  { level: 72, title: "Libuše's Seer", title_cz: "Libušin věštec", title_zh: "莉布谢的先知", xpRequired: 55420 },
  { level: 73, title: "Keeper of the Orloj", title_cz: "Strážce orloje", title_zh: "天文钟守护者", xpRequired: 56800 },
  { level: 74, title: "Rabbi Loew's Pupil", title_cz: "Žák rabiho Löwa", title_zh: "罗威拉比的弟子", xpRequired: 58200 },
  { level: 75, title: "Master of the Golem", title_cz: "Pán golema", title_zh: "魔像之主", xpRequired: 59620 },
  { level: 76, title: "Bruncvík's Sword-Bearer", title_cz: "Bruncvíkův zbrojnoš", title_zh: "布伦茨维克的持剑侍从", xpRequired: 61050 },
  { level: 77, title: "Knight of Blaník", title_cz: "Blanický rytíř", title_zh: "布拉尼克骑士", xpRequired: 62490 },
  { level: 78, title: "Guardian of Vyšehrad", title_cz: "Strážce Vyšehradu", title_zh: "维谢赫拉德守护者", xpRequired: 63950 },
  { level: 79, title: "Companion of St Wenceslas", title_cz: "Druh svatého Václava", title_zh: "圣瓦茨拉夫的同伴", xpRequired: 65430 },
  { level: 80, title: "Heir to the Crown of St Wenceslas", title_cz: "Dědic Svatováclavské koruny", title_zh: "圣瓦茨拉夫王冠的继承者", xpRequired: 66920 },
  { level: 81, title: "Keeper of a Hundred Spires", title_cz: "Strážce sta věží", title_zh: "百塔守护者", xpRequired: 68430 },
  { level: 82, title: "Master of the Bridges", title_cz: "Pán mostů", title_zh: "众桥之主", xpRequired: 69950 },
  { level: 83, title: "Lord of the Seven Hills", title_cz: "Pán sedmi pahorků", title_zh: "七丘之主", xpRequired: 71490 },
  { level: 84, title: "Keeper of the Vltava", title_cz: "Strážce Vltavy", title_zh: "伏尔塔瓦河守护者", xpRequired: 73050 },
  { level: 85, title: "Witness of Three Defenestrations", title_cz: "Svědek tří defenestrací", title_zh: "三次抛窗的见证者", xpRequired: 74620 },
  { level: 86, title: "Living Atlas of Prague", title_cz: "Živý atlas Prahy", title_zh: "布拉格活地图", xpRequired: 76200 },
  { level: 87, title: "Wanderer of All Bohemia", title_cz: "Poutník celých Čech", title_zh: "走遍波希米亚的人", xpRequired: 77800 },
  { level: 88, title: "Grandmaster of the Hunt", title_cz: "Velmistr hledání pokladů", title_zh: "寻宝宗师", xpRequired: 79420 },
  { level: 89, title: "Keeper of Every Card", title_cz: "Strážce všech karet", title_zh: "万卡守护者", xpRequired: 81050 },
  { level: 90, title: "Guardian of Golden Prague", title_cz: "Strážce Zlaté Prahy", title_zh: "金色布拉格守护者", xpRequired: 82690 },
  { level: 91, title: "Voice of the Bells", title_cz: "Hlas zvonů", title_zh: "钟声", xpRequired: 84350 },
  { level: 92, title: "Memory of the Old Town", title_cz: "Paměť Starého Města", title_zh: "老城的记忆", xpRequired: 86030 },
  { level: 93, title: "Spirit of the Lesser Town", title_cz: "Duch Malé Strany", title_zh: "小城之灵", xpRequired: 87720 },
  { level: 94, title: "Spirit of the Vltava", title_cz: "Duch Vltavy", title_zh: "伏尔塔瓦之灵", xpRequired: 89430 },
  { level: 95, title: "Heart of Bohemia", title_cz: "Srdce Čech", title_zh: "波希米亚之心", xpRequired: 91150 },
  { level: 96, title: "Living Chronicle", title_cz: "Živá kronika", title_zh: "活着的编年史", xpRequired: 92890 },
  { level: 97, title: "Prague's Last Secret", title_cz: "Poslední tajemství Prahy", title_zh: "布拉格最后的秘密", xpRequired: 94650 },
  { level: 98, title: "Darling of the Mother of Cities", title_cz: "Miláček matky měst", title_zh: "万城之母的宠儿", xpRequired: 96420 },
  { level: 99, title: "Legend of Prague", title_cz: "Pražská legenda", title_zh: "布拉格传奇", xpRequired: 98200 },
  { level: 100, title: "Soul of Prague", title_cz: "Duše Prahy", title_zh: "布拉格之魂", xpRequired: 100000 },
];

// Trimmed to three on 2026-11-02 (user's call: the rest were outdated, too easy,
// near impossible or dull); three new ones by the user added the same day.
//
// Each achievement: name and `flavor` (the one-line description shown in the
// list, Steam style), `description` (the exact requirement, shown in the
// detail), `icon`, `check(stats)` (unlocked?) and `progress(stats)`, which
// returns { current, target } and, for "check in at these places" ones, the
// `slugs` involved (the controller adds which are done). Stats come from
// buildAchievementStats (services/achievementStats.js).
// Zličín's terminal card is IKEA Zličín (next to the station); the Letňany
// card's slug really does keep the ň.
const CITY_RARITIES = ["common", "rare", "superior", "epic", "mythic", "legend"];
// Angel in White: nine hospitals (user's list, 2026-11-02).
const HOSPITAL_SLUGS = [
  "nemocnice-motol", "nemocnice-krc", "porodnice-podoli", "porodnice-apolinar",
  "nemocnice-na-frantisku", "italian-hospital-1782409426667", "nemocnice-milosrdnych-sester",
  "fakultni-nemocnice-bulovka", "psychiatricka-nemocnice-bohnice",
];
// Top of the Class: nine universities and libraries (user's list, 2026-11-02).
const SCHOOL_SLUGS = [
  "kampus-albertov", "karolinum", "cvut", "narodni-technicka-knihovna", "dum-u-lazara", "vse-praha",
  "czech-university-of-life-sciences-prague-1782583672397", "national-library-czech-republic",
  "akademie-vytvarnych-umeni",
];
// Local: one administrative district (Praha 1-22) fully collected; only
// districts, not quarters, since many quarters hold a single card (user's
// call, 2026-11-02). Progress shows the district the user is closest to
// finishing (highest share, then fewest cards left).
function LOCAL_PROGRESS({ districtCount = {}, districtTotal = {} }) {
  let best = null;
  for (const [name, total] of Object.entries(districtTotal)) {
    const current = Math.min(districtCount[name] || 0, total);
    const share = total ? current / total : 0;
    if (!best || share > best.share || (share === best.share && total - current < best.total - best.current)) {
      best = { name, current, total, share };
    }
  }
  if (!best) return { current: 0, target: 1 };
  return { current: best.current, target: best.total, district: best.name };
}

// Mind the Window: the three defenestration sites (1419 New Town Hall,
// 1618 Old Royal Palace, and the obelisk where Slavata landed).
const WINDOW_SLUGS = ["novomestska-radnice", "old-royal-palace", "slavatuv-obelisk"];
// May the Chalice Be With You: the user's seven Hussite places plus St Martin
// in the Wall (first Utraquist communion, 1414) and Our Lady of the Snows
// (Jan Želivský's church, start of the 1419 march to the New Town Hall),
// and the New Town Hall itself (user's addition, 2026-11-02).
const CHALICE_SLUGS = [
  "tyn-church", "pamatnik-jana-husa", "bethlehem-chapel", "kostel-sv-martina-ve-zdi",
  "kostel-panny-marie-snezne", "zizkov-horse-statue", "namesti-jiriho-z-podebrad",
  "husuv-sbor-vrsovice", "husuv-sbor-vinohrady", "novomestska-radnice",
];
// 20th-century and composer/writer achievements (2026-11-02, ahead of the
// timeline reaching those eras; names drafted by Claude, user to confirm).
// Metamorphosis: Kafka's Prague, from his birthplace and school to his grave.
const KAFKA_SLUGS = [
  "kafkuv-dum",
  "palac-goltz-kinskych",
  "golden-lane",
  "kafka-museum",
  "kafka-statue",
  "kafka-rotating-head",
  "new-jewish-cemetery-1782861254358",
];
// My Praguers Understand Me: Dvořák, Smetana and Mozart in Prague.
const MUSIC_SLUGS = [
  "muzeum-antonina-dvoraka",
  "rudolfinum",
  "smetana-museum",
  "pomnik-bedricha-smetany",
  "national-theatre",
  "municipal-house",
  "vysehrad-cemetery",
  "bertramka-villa-1782603107689",
  "estates-theatre",
];
// Operation Anthropoid (1942): the attack, the crypt, the Gestapo and the reprisals.
const ANTHROPOID_SLUGS = [
  "heydrich-assassination-site",
  "cathedral-cyril-methodius",
  "petschek-palace-1782567720752",
  "-1782584125681",
  "pankrc-prison-1782564726175",
];
// Barricades in May: the Prague Uprising of 5-9 May 1945.
const UPRISING_SLUGS = [
  "czech-radio-building-1782668063575",
  "socha-barikadniku",
  "pomnik-padlych-barikadniku",
  "most-barikadniku",
  "old-town-hall",
  "stanice-metra-prazskeho-povstani",
  "pomnik-obetem-prazskeho-povstani-doudlebska",
  "valecny-hrbitov-olsany",
];
// Prague Spring: 1968, the invasion and Jan Palach.
const SPRING_SLUGS = [
  "czech-radio-building-1782668063575",
  "wenceslas-square",
  "national-museum",
  "pamatnik-palacha-zajice",
  "pamatnik-jana-palacha-sousosi",
  "faculty-of-arts-uk",
  "olsanske-hrbitovy",
];
// Jingling Keys: the Velvet Revolution of November 1989.
const VELVET_SLUGS = [
  "kampus-albertov",
  "pamatnik-sametove-revoluce",
  "wenceslas-square",
  "melantrich",
  "letn-plain-1782906159291",
  "lavicka-vaclava-havla",
  "srdce-pro-vaclava-havla",
];
// Behind the Iron Curtain: 1948, the show trials, the StB and the wall of John Lennon.
const IRON_CURTAIN_SLUGS = [
  "palac-goltz-kinskych",
  "stara-celnice",
  "memorial-to-the-victims-of-communism-1782565714871",
  "statni-bezpecnost-bartolomejska",
  "namesti-hrdinu",
  "pankrc-prison-1782564726175",
  "ruzyn-prison-1782570848316",
  "letna-park",
  "john-lennon-wall",
];
// Never Forget: the occupation and the Holocaust. The Pinkas Synagogue's
// walls of names, the station Winton's trains left from, the Gestapo HQ,
// and two places outside Prague (Lidice, Terezín), which make it the first
// "extreme" achievement (user's call, 2026-11-02).
const NEVER_FORGET_SLUGS = [
  "pinkas-synagogue", "praha-hlavni-nadrazi", "petschek-palace-1782567720752",
  "lidice", "koncentracni-tabor-terezin",
];
// Charles IV (user's list, 2026-11-02), in the order he founded them:
// Emmaus and Our Lady of the Snows (1347), the university (1348),
// Karlštejn (1348, outside Prague, hence "extreme"), the bridge (1357),
// and his 1848 statue at its Old Town end.
const CHARLES_SLUGS = [
  "emmaus-monastery-1782494564055", "kostel-panny-marie-snezne", "karolinum",
  "karlstejn-castle", "charles-bridge", "monument-to-charles-iv-1783353104539",
];
// ── Helpers for the 2026-11-02 "how, when, what kind" achievements ──────
const ERA_LABELS = ["prehistory", "medieval", "early-modern", "national-revival", "world-wars", "communism"];
const STYLE_LABELS = ["romanesque", "gothic", "renaissance", "baroque", "classicism", "historicism",
  "art-nouveau", "cubism", "functionalism", "brutalism", "contemporary"];

// Namesakes: which saint a church card is dedicated to, read from its Czech
// name (St John of Nepomuk and St John the Baptist are two different saints;
// every church of Our Lady counts as one).
const SAINTS = [
  { key: "maria", rx: /panny marie|matky bozi|sv(\.|at[a-z]*) marie/, en: "Our Lady", cz: "Panna Maria", zh: "圣母" },
  { key: "vaclav", rx: /sv(\.|at[a-z]*) vaclava/, en: "St Wenceslas", cz: "sv. Václav", zh: "圣瓦茨拉夫" },
  { key: "jan_nepomuk", rx: /jana nepomuck/, en: "St John of Nepomuk", cz: "sv. Jan Nepomucký", zh: "圣约翰·内波穆克" },
  { key: "jan_krtitel", rx: /jana krtitele/, en: "St John the Baptist", cz: "sv. Jan Křtitel", zh: "施洗约翰" },
  { key: "petr_pavel", rx: /sv(\.|at[a-z]*) petra/, en: "St Peter (and Paul)", cz: "sv. Petr (a Pavel)", zh: "圣彼得（与圣保罗）" },
  { key: "jakub", rx: /sv(\.|at[a-z]*) jakuba/, en: "St James", cz: "sv. Jakub", zh: "圣雅各" },
  { key: "mikulas", rx: /sv(\.|at[a-z]*) mikulase/, en: "St Nicholas", cz: "sv. Mikuláš", zh: "圣尼古拉" },
  { key: "anna", rx: /sv(\.|at[a-z]*) anny/, en: "St Anne", cz: "sv. Anna", zh: "圣安妮" },
  { key: "michael", rx: /sv(\.|at[a-z]*) michal|archandela michaela/, en: "St Michael", cz: "sv. Michael", zh: "圣米迦勒" },
  { key: "jiri", rx: /sv(\.|at[a-z]*) jiri/, en: "St George", cz: "sv. Jiří", zh: "圣乔治" },
  { key: "ludmila", rx: /sv(\.|at[a-z]*) ludmil/, en: "St Ludmila", cz: "sv. Ludmila", zh: "圣卢德米拉" },
  { key: "vojtech", rx: /sv(\.|at[a-z]*) vojtech/, en: "St Adalbert", cz: "sv. Vojtěch", zh: "圣沃伊捷赫" },
  { key: "prokop", rx: /sv(\.|at[a-z]*) prokop/, en: "St Procopius", cz: "sv. Prokop", zh: "圣普罗科普" },
  { key: "martin", rx: /sv(\.|at[a-z]*) martin/, en: "St Martin", cz: "sv. Martin", zh: "圣马丁" },
  { key: "havel", rx: /sv(\.|at[a-z]*) havl/, en: "St Gall", cz: "sv. Havel", zh: "圣加卢斯" },
  { key: "krize", rx: /sv(\.|at[a-z]*) kriz/, en: "the Holy Cross", cz: "sv. Kříž", zh: "圣十字" },
];
const fold = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function saintOf(location) {
  const name = fold(location.localizedNames?.cz || location.name);
  return SAINTS.find((s) => s.rx.test(name))?.key || null;
}
const SAINT_TARGET = 5;
function SAINT_PROGRESS({ saintCount = {} }) {
  const [key, n] = Object.entries(saintCount).sort((a, b) => b[1] - a[1])[0] || [];
  const saint = SAINTS.find((s) => s.key === key);
  return {
    current: n || 0,
    target: SAINT_TARGET,
    ...(saint ? { note: { en: saint.en, cz: saint.cz, zh: saint.zh } } : {}),
  };
}

// A share of the city cards (Quarter Local, Half the City, The Last Mile).
const cityShare = (share) => ({ cityCheckins, cityTotal }) => ({
  current: cityCheckins || 0,
  target: Math.max(1, Math.ceil((cityTotal || 0) * share)),
});
const labelChecklist = (list) => ({ labelSet = [] }) => ({
  current: list.filter((l) => labelSet.includes(l)).length,
  target: list.length,
  labels: list.map((label) => ({ label, done: labelSet.includes(label) })),
});
const done = (p) => p.current >= p.target;

// Places plus label counts (New Faces in an Old Town, The Other Side of
// Prague): every listed place, and at least N cards of each listed label.
// Progress adds up the places done and each label count up to its target;
// `slugs` gives the place checklist, `counts` one small bar per label.
const placesAndLabels = (slugs, counts) => ({ checkedSlugs = [], labelCount = {} }) => {
  const placesDone = slugs.filter((slug) => checkedSlugs.includes(slug)).length;
  const bars = counts.map(([label, target]) => ({ label, current: labelCount[label] || 0, target }));
  return {
    current: placesDone + bars.reduce((n, b) => n + Math.min(b.current, b.target), 0),
    target: slugs.length + bars.reduce((n, b) => n + b.target, 0),
    slugs,
    counts: bars,
  };
};
const NEW_FACES = placesAndLabels(["dancing-house", "pankrac-skyline"], [["contemporary", 15]]);
const OTHER_SIDE = placesAndLabels(["haje", "dum-zelenohorska", "budova-centrotex"], [["brutalism", 5], ["communism", 5]]);

// Seven Bridges: the seven central Vltava bridges, a walk from Štefánik
// Bridge down to Palacký Bridge (user asked for the famous ones, nothing
// remote, about six or seven).
const BRIDGE_SLUGS = [
  "stefanikuv-most", "cechuv-most", "manesuv-most", "charles-bridge",
  "most-legii", "jiraskuv-most", "palackeho-most",
];
// Castaway: the four islands in the centre (Štvanice has no card yet).
const ISLAND_SLUGS = ["kampa-island", "strelecky-ostrov", "slovansky-ostrov", "detsky-ostrov"];

// Trainspotter: seven railway stations (user's list, 2026-11-02).
const STATION_SLUGS = [
  "praha-hlavni-nadrazi", "masarykovo-nadrazi", "praha-holesovice-nadrazi", "smichovske-nadrazi",
  "praha-bubny-station", "praha-liben-nadrazi", "nadrazi-praha-podbaba",
];
// A share of one quarter's cards plus some places that must be among them
// (The Manchester of Prague: half of Smíchov, including the brewery, the
// distillery and the station). Progress adds the places done and the
// quarter's cards up to the share; the detail shows both.
const quarterShareWith = (quarter, share, slugs) => ({ checkedSlugs = [], quarterCount = {}, quarterTotal = {} }) => {
  const target = Math.max(1, Math.ceil((quarterTotal[quarter] || 0) * share));
  const have = quarterCount[quarter] || 0;
  return {
    current: slugs.filter((slug) => checkedSlugs.includes(slug)).length + Math.min(have, target),
    target: slugs.length + target,
    slugs,
    quarter: { name: quarter, current: have, target },
  };
};
const MANCHESTER = quarterShareWith("Smíchov", 0.5,
  ["staropramen-navstevnicke-centrum", "lihovar", "smichovske-nadrazi"]);

// Batch of 2026-11-02 evening (user's list, Claude's names where the user
// left them open): area shares with must-visit places, single-place easter
// eggs and the White Mountain trio.
const placesOnly = (slugs) => ({ checkedSlugs = [] }) => ({
  current: slugs.filter((slug) => checkedSlugs.includes(slug)).length,
  target: slugs.length,
  slugs,
});
const WILD_PRAGUE = placesAndLabels(
  ["prokopske-valley", "divoka-sarka", "krucifix-motol", "modranska-rokle",
    "viewpoint-dobeka-1782864480282", "rozhledna-cibulka"],
  [["nature", 15]]);
const ZIZKOV = quarterShareWith("Žižkov", 0.5, ["zizkov-tv-tower", "zizkov-horse-statue"]);
// Nusle: the valley's old nickname Jamrtál (Jammertal, valley of laments)
// comes from the Swedish guns of 1639 and 1648; the valley card is required
// next to the bridge so the name reads as that history, not as the bridge's
// sad reputation.
const NUSLE = quarterShareWith("Nusle", 0.4, ["nusle-bridge", "nuselske-udoli"]);
const VYSEHRAD = quarterShareWith("Vyšehrad", 0.8, ["sousosi-premysl-a-libuse"]);
// The slug "josefov" is the Spanish Synagogue's card, not the whole quarter.
const JOSEFOV = quarterShareWith("Josefov", 0.8, ["old-new-synagogue-1782601630704", "josefov"]);
const PHO = placesOnly(["sapa-praha"]);
const KUNRATICE_KING = placesOnly(["new-castle-ruins-near-kunratice-1783003399902"]);
const WHITE_MOUNTAIN = placesOnly([
  "mohyla-bile-hory", "hvezda-game-reserve",
  "the-pilgrimage-site-of-our-lady-of-victory-on-white-mountain-1783352113593",
]);

// No Tourists Here: cards in Prague 8-22, away from the visitors' centre
// (Prague 7, Letná and Holešovice, still sees plenty of them; user's call).
const OUTER_DISTRICT_CARDS = (districtCount) =>
  Object.entries(districtCount).filter(([d]) => +d.replace("Praha ", "") >= 8).reduce((n, [, c]) => n + c, 0);

// A number of cards in one quarter, some places among them (Troy Is Not in
// Greece: five Troja cards including the Trojan Horse).
const quarterCountWith = (quarter, count, slugs) => ({ checkedSlugs = [], quarterCount = {} }) => {
  const have = quarterCount[quarter] || 0;
  return {
    current: slugs.filter((slug) => checkedSlugs.includes(slug)).length + Math.min(have, count),
    target: slugs.length + count,
    slugs,
    quarter: { name: quarter, current: have, target: count },
  };
};
const TROJA = quarterCountWith("Troja", 5, ["trojsky-kun"]);
// Neutral Fan: both sides of the Prague derby (Slavia's Fortuna Arena,
// Sparta's epet ARENA), the O2 Arena and the Great Strahov Stadium.
const STADIUMS = placesOnly(["fortuna-arena", "epet-arena", "o2-arena", "strahov-stadium"]);

const METRO_TERMINALS = ["nemocnice-motol", "depo-hostivar", "haje", "letňany", "cerny-most", "ikea-zlicin"];

// Castle Conqueror: these seven places plus 60% of the Hradčany cards.
// Progress counts the places done plus the Hradčany cards up to the 60%
// mark, so the bar only fills when both parts are complete.
const CASTLE_SLUGS = [
  "st-vitus-cathedral", "new-royal-palace", "old-royal-palace", "st-georges-basilica",
  "kralovska-zahrada", "strahov-monastery", "queen-annes-summer-palace-1782584407663",
];
const CASTLE_QUARTER = "Hradčany";
const CASTLE_QUARTER_SHARE = 0.6;
function CASTLE_PROGRESS({ checkedSlugs, quarterCount = {}, quarterTotal = {} }) {
  const places = CASTLE_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length;
  const qTarget = Math.max(1, Math.ceil((quarterTotal[CASTLE_QUARTER] || 0) * CASTLE_QUARTER_SHARE));
  const qCurrent = Math.min(quarterCount[CASTLE_QUARTER] || 0, qTarget);
  return {
    current: places + qCurrent,
    target: CASTLE_SLUGS.length + qTarget,
    slugs: CASTLE_SLUGS,
    quarter: { name: CASTLE_QUARTER, current: quarterCount[CASTLE_QUARTER] || 0, target: qTarget },
  };
}

export const ACHIEVEMENTS = [
  {
    id: "first_step",
    icon: "👣",
    name: "First Step",
    name_cz: "První krok",
    name_zh: "第一步",
    flavor: "A journey of a thousand miles begins with a single card.",
    flavor_cz: "I cesta dlouhá tisíc mil začíná jedinou kartou.",
    flavor_zh: "千里之行，始于第一张卡。",
    description: "Collect your first card.",
    description_cz: "Sesbírejte svou první kartu.",
    description_zh: "收集第一张卡。",
    difficulty: "easy",
    check: ({ totalCheckins }) => (totalCheckins || 0) >= 1,
    progress: ({ totalCheckins }) => ({ current: totalCheckins || 0, target: 1 }),
  },
  {
    id: "century",
    icon: "💯",
    name: "Prague Century",
    name_cz: "Pražské století",
    name_zh: "布拉格百景",
    flavor: "A hundred stories, and Prague still has more.",
    flavor_cz: "Sto příběhů, a Praha jich má pořád víc.",
    flavor_zh: "一百个故事，布拉格还有更多。",
    description: "Check in to 100 of the preset locations.",
    description_cz: "Přihlaste se na 100 přednastavených míst.",
    description_zh: "打卡100个预设地点。",
    difficulty: "hard",
    check: ({ presetCheckins }) => presetCheckins >= 100,
    progress: ({ presetCheckins }) => ({ current: presetCheckins, target: 100 }),
  },
  {
    id: "subway_maniac",
    icon: "🚇",
    name: "Subway Surfer",
    name_cz: "Metró maniak",
    name_zh: "地铁跑酷",
    flavor: "End of the line. Six times.",
    flavor_cz: "Konečná stanice. Šestkrát.",
    flavor_zh: "终点站，到了六次。",
    description:
      "Ride the metro to the end of all three lines and check in at all six terminal stations: Nemocnice Motol, Depo Hostivař, Háje, Letňany, Černý Most and Zličín.",
    description_cz:
      "Dojeďte metrem na konec všech tří linek a přihlaste se na všech šesti konečných stanicích: Nemocnice Motol, Depo Hostivař, Háje, Letňany, Černý Most a Zličín.",
    description_zh:
      "坐地铁到三条线路的尽头，在全部六个终点站打卡：Nemocnice Motol、Depo Hostivař、Háje、Letňany、Černý Most、Zličín。",
    difficulty: "hard",
    check: ({ checkedSlugs }) => METRO_TERMINALS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: METRO_TERMINALS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: METRO_TERMINALS.length,
      slugs: METRO_TERMINALS,
    }),
  },
  {
    id: "southern-pole",
    icon: "🐧",
    name: "Why are there no penguins in southern pole?",
    name_cz: "Proč nejsou tučňáci na jižním pólu?",
    name_zh: "为什么南极没有企鹅？",
    flavor: "Prague has a South Pole. Nobody has told the penguins.",
    flavor_cz: "Praha má jižní pól. Tučňákům to zatím nikdo neřekl.",
    flavor_zh: "布拉格有个南极，只是没人通知企鹅。",
    description: "Check in at the South Pole of Prague.",
    description_cz: "Přihlaste se na Jižním pólu Prahy.",
    description_zh: "打卡布拉格南极。",
    difficulty: "easy",
    check: ({ checkedSlugs }) => checkedSlugs.includes("jizni-pol-prahy"),
    progress: ({ checkedSlugs }) => ({
      current: checkedSlugs.includes("jizni-pol-prahy") ? 1 : 0,
      target: 1,
      slugs: ["jizni-pol-prahy"],
    }),
  },
  {
    id: "bounty_hunter",
    icon: "🎯",
    name: "Bounty Hunter",
    name_cz: "Lovec odměn",
    name_zh: "赏金猎人",
    flavor: "No clues bought, no second guess, ten times the bounty.",
    flavor_cz: "Žádná koupená nápověda, žádný druhý pokus, desetinásobná odměna.",
    flavor_zh: "不买线索，一猜即中，十倍赏金。",
    description: "Find a treasure on the Treasure Hunt page for 10x XP (the first press hits and no clue was bought).",
    description_cz: "Najděte poklad na stránce hledání pokladu za desetinásobek XP (trefa hned prvním stiskem, bez koupené nápovědy).",
    description_zh: "在寻宝页面找到宝藏，并获得10倍经验（第一次按下就猜中，且没有买过线索）。",
    difficulty: "hard",
    check: ({ huntTenX }) => (huntTenX || 0) >= 1,
    progress: ({ huntTenX }) => ({ current: huntTenX || 0, target: 1 }),
  },
  {
    id: "half_the_city",
    icon: "🗺️",
    name: "Half the City",
    name_cz: "Půl města v kapse",
    name_zh: "半数囊中",
    flavor: "Half of Prague in your pocket. The other half knows you're coming.",
    flavor_cz: "Půl Prahy v kapse. Ta druhá polovina už ví, že přijdete.",
    flavor_zh: "半个布拉格已经到手，另一半知道你要来了。",
    description: "Collect half of the cards inside Prague (cards outside the city don't count). Once earned it stays, even when new cards are added.",
    description_cz: "Sesbírejte polovinu karet v Praze (karty mimo město se nepočítají). Jednou získaný úspěch zůstane, i když přibudou nové karty.",
    description_zh: "收集布拉格市内一半的地点卡片（城外的卡片不算）。一旦达成就永久保留，以后新增卡片也不会收回。",
    difficulty: "extreme",
    // Achievements are stored once earned, so new cards never take it back.
    check: ({ cityCheckins, cityTotal }) => cityTotal > 0 && (cityCheckins || 0) * 2 >= cityTotal,
    progress: ({ cityCheckins, cityTotal }) => ({ current: cityCheckins || 0, target: Math.max(1, Math.ceil((cityTotal || 0) / 2)) }),
  },
  {
    id: "hradcany_conqueror",
    icon: "🏰",
    name: "Castle Conqueror",
    name_cz: "Dobyvatel hradu",
    name_zh: "城堡征服者",
    flavor: "The castle has surrendered, and most of Hradčany with it.",
    flavor_cz: "Hrad se vzdal, a s ním většina Hradčan.",
    flavor_zh: "城堡投降了，城堡区也降了大半。",
    description: "Check in at St Vitus Cathedral, the New Royal Palace, the Old Royal Palace, St George's Basilica, the Royal Garden, Strahov Monastery and Queen Anne's Summer Palace, and collect at least 60% of the cards in Hradčany.",
    description_cz: "Přihlaste se v katedrále sv. Víta, Novém královském paláci, Starém královském paláci, bazilice sv. Jiří, Královské zahradě, Strahovském klášteře a Letohrádku královny Anny a sesbírejte alespoň 60 % karet na Hradčanech.",
    description_zh: "打卡圣维特大教堂、新皇宫、旧皇宫、圣乔治圣殿、皇家花园、斯特拉霍夫修道院和安娜皇后夏宫，并且收集城堡区（Hradčany）至少60%的卡片。",
    difficulty: "hard",
    check: (stats) => {
      const p = CASTLE_PROGRESS(stats);
      return p.current >= p.target;
    },
    progress: (stats) => CASTLE_PROGRESS(stats),
  },
  {
    id: "out_of_town",
    icon: "🧳",
    name: "Out of Town",
    name_cz: "Za humna",
    name_zh: "出城去",
    flavor: "Prague is lovely. So is the rest of the country.",
    flavor_cz: "Praha je krásná. Zbytek země taky.",
    flavor_zh: "布拉格很好，城外也不赖。",
    description: "Collect one Expedition card (a place outside Prague).",
    description_cz: "Sesbírejte jednu kartu Výprava (místo mimo Prahu).",
    description_zh: "收集一张“远征”卡（布拉格以外的地点）。",
    difficulty: "easy",
    check: ({ expeditionCheckins }) => (expeditionCheckins || 0) >= 1,
    progress: ({ expeditionCheckins }) => ({ current: expeditionCheckins || 0, target: 1 }),
  },
  {
    id: "devout_believer",
    icon: "⛪",
    name: "Devout Believer",
    name_cz: "Zbožný věřící",
    name_zh: "虔诚的信徒",
    flavor: "Thirty churches, and you still look up every time you walk in.",
    flavor_cz: "Třicet kostelů, a pořád se pokaždé po vstupu podíváte nahoru.",
    flavor_zh: "三十座教堂，每次进门，你还是会抬头看。",
    description: "Collect 30 cards with the “church” label.",
    description_cz: "Sesbírejte 30 karet se štítkem „Kostel“.",
    description_zh: "收集30张带“教堂”标签的卡片。",
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount.church || 0) >= 30,
    progress: ({ labelCount }) => ({ current: labelCount.church || 0, target: 30 }),
  },
  {
    id: "veni_vidi_vici",
    icon: "🏛️",
    name: "Veni, Vidi, Vici",
    name_cz: "Přišel jsem, viděl jsem, zvítězil jsem",
    name_zh: "我来，我见，我征服",
    flavor: "Every legend in the city, down to the last one.",
    flavor_cz: "Všechny legendy města, do jedné.",
    flavor_zh: "全城的传说，一个不落。",
    description: "Collect every Legendary card. Once earned it stays, even when new Legendary cards are added.",
    description_cz: "Sesbírejte všechny karty vzácnosti Legendární. Jednou získaný úspěch zůstane, i když přibudou nové.",
    description_zh: "收集所有“传说”稀有度的卡片。一旦达成就永久保留，以后新增传说卡也不会收回。",
    difficulty: "extreme",
    // A new id would be cleaner, but nobody ever earned the old landmark
    // version (it needed exactly 14 landmark cards and only 12 existed).
    check: ({ checkedSlugs, legendSlugs = [] }) =>
      legendSlugs.length > 0 && legendSlugs.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs, legendSlugs = [] }) => ({
      current: legendSlugs.filter((slug) => checkedSlugs.includes(slug)).length,
      target: Math.max(1, legendSlugs.length),
      slugs: legendSlugs,
    }),
  },
  {
    id: "all_the_colours",
    icon: "🎨",
    name: "All the Colours",
    name_cz: "Všechny barvy",
    name_zh: "五颜六色",
    flavor: "White, blue, green, purple, red and gold: one of each.",
    flavor_cz: "Bílá, modrá, zelená, fialová, červená a zlatá: od každé jedna.",
    flavor_zh: "白、蓝、绿、紫、红、金，每种来一张。",
    description: "Collect at least one card of each city rarity: Common, Rare, Superior, Epic, Mythic and Legendary (Expedition doesn't count).",
    description_cz: "Sesbírejte alespoň jednu kartu od každé městské vzácnosti: Běžné, Vzácné, Výjimečné, Epické, Mýtické a Legendární (Výprava se nepočítá).",
    description_zh: "每种稀有度至少收集一张卡：常见、稀有、卓越、史诗、神话、传说（远征不算）。",
    difficulty: "easy",
    check: ({ rarityCount = {} }) => CITY_RARITIES.every((r) => (rarityCount[r] || 0) > 0),
    progress: ({ rarityCount = {} }) => ({
      current: CITY_RARITIES.filter((r) => (rarityCount[r] || 0) > 0).length,
      target: CITY_RARITIES.length,
      rarities: CITY_RARITIES.map((r) => ({ rarity: r, done: (rarityCount[r] || 0) > 0 })),
    }),
  },
  {
    id: "hidden_depths",
    icon: "🔮",
    name: "Hidden Depths",
    name_cz: "Tichá voda",
    name_zh: "深藏不露",
    flavor: "Mythic cards hide in the deepest corners of the city. You dug out twenty.",
    flavor_cz: "Mýtické karty se schovávají v nejhlubších koutech města. Vy jste jich vyhrabali dvacet.",
    flavor_zh: "神话卡总藏在城市最深的角落，你却挖出了二十张。",
    description: "Collect 20 cards of Mythic rarity.",
    description_cz: "Sesbírejte 20 karet vzácnosti Mýtické.",
    description_zh: "收集20张“神话”稀有度的卡片。",
    difficulty: "hard",
    check: ({ rarityCount = {} }) => (rarityCount.mythic || 0) >= 20,
    progress: ({ rarityCount = {} }) => ({ current: rarityCount.mythic || 0, target: 20 }),
  },
  {
    id: "angel_in_white",
    icon: "🏥",
    name: "Doctor's Orders",
    name_cz: "Velká vizita",
    name_zh: "白衣天使",
    flavor: "Nine hospitals, and luckily you only came for the card.",
    flavor_cz: "Devět nemocnic, a naštěstí jen kvůli kartě.",
    flavor_zh: "九家医院走了个遍，幸好只是来打卡的。",
    description: "Check in at nine Prague hospitals: Motol, Thomayer, the Podolí and Apolinář maternity hospitals, Na Františku, the Italian Hospital, the Sisters of Mercy of St Charles Borromeo, Bulovka and the Bohnice Psychiatric Hospital.",
    description_cz: "Přihlaste se v devíti pražských nemocnicích: Nemocnice Motol, Fakultní Thomayerova nemocnice, Porodnice Podolí, Porodnice Apolinář, Nemocnice Na Františku, Vlašský špitál, Nemocnice Milosrdných sester sv. Karla Boromejského, Fakultní nemocnice Bulovka a Psychiatrická nemocnice Bohnice.",
    description_zh: "打卡布拉格的九家医院：莫托尔大学医院、托马耶大学医院、波多利产科医院、阿波利纳日妇产医院、弗朗西斯医院、意大利医院、圣博罗梅乌仁慈姐妹医院、布洛夫卡大学医院和波赫尼采精神病院。",
    difficulty: "hard",
    check: ({ checkedSlugs }) => HOSPITAL_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: HOSPITAL_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: HOSPITAL_SLUGS.length,
      slugs: HOSPITAL_SLUGS,
    }),
  },
  {
    id: "top_of_the_class",
    icon: "🎓",
    name: "Top of the Class",
    name_cz: "Premiant",
    name_zh: "学霸",
    flavor: "Nine schools and libraries, and not a single exam.",
    flavor_cz: "Devět škol a knihoven, a ani jedna zkouška.",
    flavor_zh: "九所学府走了一圈，一场考试都不用考。",
    description: "Check in at Albertov Campus, the Karolinum, the Czech Technical University, the National Technical Library, the House at the Lazarus, the Prague University of Economics and Business, the Czech University of Life Sciences, the Klementinum (National Library) and the Academy of Fine Arts.",
    description_cz: "Přihlaste se na místech Kampus Albertov, Karolinum, ČVUT v Praze, Národní technická knihovna, Dům U Lazara, Vysoká škola ekonomická v Praze, Česká zemědělská univerzita v Praze, Klementinum (Národní knihovna České republiky) a Akademie výtvarných umění v Praze.",
    description_zh: "打卡阿尔贝托夫校区、卡罗利努姆、布拉格捷克技术大学、国家技术图书馆、拉扎尔之家、布拉格经济大学、布拉格生命科学大学、克莱门特学院（捷克国家图书馆）和布拉格美术学院。",
    difficulty: "hard",
    check: ({ checkedSlugs }) => SCHOOL_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: SCHOOL_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: SCHOOL_SLUGS.length,
      slugs: SCHOOL_SLUGS,
    }),
  },
  {
    id: "spoilt_for_choice",
    icon: "⚡",
    name: "Spoilt for Choice",
    name_cz: "Kam se podívám",
    name_zh: "应接不暇",
    flavor: "Ten cards in five minutes. Some corners of Prague are just that crowded.",
    flavor_cz: "Deset karet za pět minut. Některé kouty Prahy jsou prostě tak nabité.",
    flavor_zh: "五分钟，十张卡。布拉格有些角落，就是这么挤。",
    description: "Check in at 10 places within 5 minutes.",
    description_cz: "Přihlaste se na 10 místech během 5 minut.",
    description_zh: "在五分钟内打卡10个地点。",
    difficulty: "medium",
    check: ({ burst5min }) => (burst5min || 0) >= 10,
    progress: ({ burst5min }) => ({ current: burst5min || 0, target: 10 }),
  },
  {
    id: "local",
    icon: "🏠",
    name: "Local",
    name_cz: "Místňák",
    name_zh: "本地人",
    flavor: "Every card in one district. The neighbours have started to nod at you.",
    flavor_cz: "Všechny karty v jednom obvodu. Sousedé vás už začínají zdravit.",
    flavor_zh: "一个区的卡全收齐了，街坊邻居都开始跟你点头打招呼了。",
    description: "Collect every card in any one of Prague's administrative districts (Prague 1 to 22).",
    description_cz: "Sesbírejte všechny karty v kterémkoli pražském správním obvodu (Praha 1 až 22).",
    description_zh: "收集布拉格任意一个行政区（布拉格1区到22区）的全部卡片。",
    difficulty: "medium",
    check: (stats) => {
      const p = LOCAL_PROGRESS(stats);
      return p.target > 0 && p.current >= p.target;
    },
    progress: (stats) => LOCAL_PROGRESS(stats),
  },
  {
    id: "mind_the_window",
    icon: "🪟",
    name: "Mind the Window",
    name_cz: "Pozor na okna",
    name_zh: "别看窗户",
    flavor: "Prague has an old tradition for settling disagreements.",
    flavor_cz: "Praha má na řešení sporů jednu starou tradici.",
    flavor_zh: "布拉格人解决分歧，有一个老传统。",
    description: "Check in at the New Town Hall, the Old Royal Palace and the Slavata Obelisk.",
    description_cz: "Přihlaste se u Novoměstské radnice, Starého královského paláce a Slavatova obelisku.",
    description_zh: "打卡新城市政厅、旧皇宫和斯拉瓦塔方尖碑。",
    difficulty: "easy",
    check: ({ checkedSlugs }) => WINDOW_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: WINDOW_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: WINDOW_SLUGS.length,
      slugs: WINDOW_SLUGS,
    }),
  },
  {
    id: "chalice_be_with_you",
    icon: "🍷",
    name: "May the Chalice Be With You",
    name_cz: "Kalich buď s tebou",
    name_zh: "圣杯与我同在",
    flavor: "From the pulpit of the Bethlehem Chapel to the rider on Vítkov hill, following the chalice all the way.",
    flavor_cz: "Od kazatelny Betlémské kaple až k jezdci na Vítkově, celou cestu za kalichem.",
    flavor_zh: "从伯利恒礼拜堂的讲坛，到维特科夫山上的骑士，一路追随圣杯。",
    description: "Check in at ten Hussite places: the Týn Church, the Jan Hus Monument, the Bethlehem Chapel, St Martin in the Wall, Our Lady of the Snows, the New Town Hall, the Jan Žižka Monument, Jiřího z Poděbrad Square and the Hussite congregations in Vršovice and Vinohrady.",
    description_cz: "Přihlaste se na deseti husitských místech: Chrám Matky Boží před Týnem, Památník Jana Husa, Betlémská kaple, kostel sv. Martina ve zdi, kostel Panny Marie Sněžné, Novoměstská radnice, Pomník Jana Žižky, náměstí Jiřího z Poděbrad, Husův sbor ve Vršovicích a Husův sbor Vinohrady.",
    description_zh: "打卡十处胡斯派地点：泰恩前的圣母教堂、扬·胡斯纪念碑、伯利恒礼拜堂、墙中圣马丁教堂、雪地圣母教堂、新城市政厅、扬·杰式卡纪念像、波杰布拉德的伊日广场，以及弗尔绍维采和维诺赫拉迪的胡斯集会堂。",
    difficulty: "hard",
    check: ({ checkedSlugs }) => CHALICE_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: CHALICE_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: CHALICE_SLUGS.length,
      slugs: CHALICE_SLUGS,
    }),
  },
  {
    id: "metamorphosis",
    icon: "🪲",
    name: "Metamorphosis",
    name_cz: "Proměna",
    name_zh: "变形记",
    flavor: "One morning you woke up to find yourself transformed into a Kafka fan.",
    flavor_cz: "Jednoho rána jste se probudili a zjistili, že jste se proměnili v obdivovatele Kafky.",
    flavor_zh: "一天早上醒来，你发现自己变成了一个卡夫卡迷。",
    description: "Check in at these 7 places: Kafka's House, Goltz-Kinský Palace, Golden Lane, Kafka Museum, Franz Kafka Statue, Kafka's Rotating Head (Quadrio) and New Jewish Cemetery.",
    description_cz: "Přihlaste se na těchto 7 místech: Kafkův dům, Palác Goltz-Kinských, Zlatá ulička, Muzeum Franze Kafky, Socha Franze Kafky, Kafkova točící se hlava a Nový židovský hřbitov.",
    description_zh: "打卡以下7个地点：卡夫卡故居、戈尔兹-金斯基宫、黄金巷、卡夫卡博物馆、卡夫卡雕像、卡夫卡旋转头像和新犹太公墓。",
    difficulty: "medium",
    check: ({ checkedSlugs }) => KAFKA_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: KAFKA_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: KAFKA_SLUGS.length,
      slugs: KAFKA_SLUGS,
    }),
  },
  {
    id: "prague_understands_me",
    icon: "🎼",
    name: "My Praguers Understand Me",
    name_cz: "Moji Pražané mi rozumějí",
    name_zh: "知音",
    flavor: "Mozart is said to have written, \"My Praguers understand me.\" Now you understand them too.",
    flavor_cz: "Mozart prý napsal: „Moji Pražané mi rozumějí.“ Teď rozumíte i vy jim.",
    flavor_zh: "相传莫扎特说过：“我的布拉格人懂我。”现在，你也懂他们了。",
    description: "Check in at these 9 places: Antonín Dvořák Museum, Rudolfinum, Smetana Museum, Bedřich Smetana Monument, National Theatre, Municipal House, Vyšehrad Cemetery, Bertramka Villa and Estates Theatre.",
    description_cz: "Přihlaste se na těchto 9 místech: Muzeum Antonína Dvořáka, Rudolfinum, Muzeum Bedřicha Smetany, Pomník Bedřicha Smetany, Národní divadlo, Obecní dům, Vyšehradský hřbitov, Bertramka a Stavovské divadlo.",
    description_zh: "打卡以下9个地点：安东宁·德沃夏克博物馆、鲁道夫音乐厅、斯美塔那博物馆、斯美塔那纪念像、国家剧院、布拉格市民会馆、维谢赫拉德公墓、贝尔特拉姆卡别墅和庄园剧院。",
    difficulty: "medium",
    check: ({ checkedSlugs }) => MUSIC_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: MUSIC_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: MUSIC_SLUGS.length,
      slugs: MUSIC_SLUGS,
    }),
  },
  {
    id: "operation_anthropoid",
    icon: "🪂",
    name: "Operation Anthropoid",
    name_cz: "Operace Anthropoid",
    name_zh: "类人猿行动",
    flavor: "Seven paratroopers, one church crypt, and a story that must not be forgotten.",
    flavor_cz: "Sedm parašutistů, jedna kostelní krypta a příběh, na který se nesmí zapomenout.",
    flavor_zh: "七名伞兵，一座教堂的地下室，和一段不该被遗忘的故事。",
    description: "Check in at these 5 places: Reinhard Heydrich Assassination Site, Cathedral of Saints Cyril and Methodius, Petschek Palace, Kobylisy Shooting Range and Pankrác Prison.",
    description_cz: "Přihlaste se na těchto 5 místech: Místo atentátu na Heydricha, Katedrála sv. Cyrila a Metoděje, Petschkův palác, Památník protifašistického odboje Střelnice Kobylisy a Vazební věznice Praha Pankrác.",
    description_zh: "打卡以下5个地点：海德里希暗杀地点、圣西里尔与美多德大教堂、佩切克宫(前布拉格盖世太保总部)、科比利西射击场(反法西斯抵抗运动纪念碑)和潘克拉茨监狱。",
    difficulty: "medium",
    check: ({ checkedSlugs }) => ANTHROPOID_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: ANTHROPOID_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: ANTHROPOID_SLUGS.length,
      slugs: ANTHROPOID_SLUGS,
    }),
  },
  {
    id: "may_barricades",
    icon: "🧱",
    name: "Barricades in May",
    name_cz: "Květnové barikády",
    name_zh: "五月的街垒",
    flavor: "In May 1945, Praguers tore up the cobblestones and built barricades.",
    flavor_cz: "V květnu 1945 Pražané vytrhali dlažbu a postavili barikády.",
    flavor_zh: "1945年5月，布拉格人撬起路上的石块，筑起了街垒。",
    description: "Check in at these 8 places: Czech Radio Building, Monument to the Prague Barricade Fighters, Memorial to the Fallen of Barikádníků Bridge, Barikádníků Bridge, Old Town Hall, Pražského povstání Metro Station, Memorial to the Victims of the Prague Uprising (Doudlebská) and War Cemetery for the Victims of World War II.",
    description_cz: "Přihlaste se na těchto 8 místech: Český rozhlas, Pomník pražských barikádníků, Pomník padlým v květnu 1945 u mostu Barikádníků, Most Barikádníků, Staroměstská radnice, Stanice metra Pražského povstání, Pomník obětem Pražského povstání (Doudlebská) a Válečný hřbitov obětem 2. světové války.",
    description_zh: "打卡以下8个地点：捷克广播电台总部大楼、布拉格街垒战士纪念碑、街垒战士桥阵亡者纪念碑、街垒战士桥、老城市政厅、布拉格起义地铁站、布拉格起义遇难者纪念碑（杜德莱布斯卡街）和二战遇难者战争公墓。",
    difficulty: "medium",
    check: ({ checkedSlugs }) => UPRISING_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: UPRISING_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: UPRISING_SLUGS.length,
      slugs: UPRISING_SLUGS,
    }),
  },
  {
    id: "prague_spring",
    icon: "🌱",
    name: "Tanks and Spring",
    name_cz: "Tanky a jaro",
    name_zh: "坦克与春天",
    flavor: "The spring was short. The tanks came in August.",
    flavor_cz: "Jaro bylo krátké. Tanky přijely v srpnu.",
    flavor_zh: "春天很短，八月，坦克就来了。",
    description: "Check in at these 7 places: Czech Radio Building, Václav Square, National Museum, Jan Palach and Jan Zajíc Memorial, Jan Palach Memorial — House of the Son and House of the Mother, Charles University Faculty of Arts and Olšany Cemeteries.",
    description_cz: "Přihlaste se na těchto 7 místech: Český rozhlas, Václavské náměstí, Národní muzeum, Památník Jana Palacha a Jana Zajíce, Památník Jana Palacha — sousoší Dům syna a Dům matky, Filozofická fakulta UK a Olšanské hřbitovy.",
    description_zh: "打卡以下7个地点：捷克广播电台总部大楼、瓦茨拉夫广场、国家博物馆、帕拉赫与扎伊茨纪念碑、扬·帕拉赫纪念碑——子之家与母之家、查理大学文学系大楼和奥尔萨内公墓。",
    difficulty: "medium",
    check: ({ checkedSlugs }) => SPRING_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: SPRING_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: SPRING_SLUGS.length,
      slugs: SPRING_SLUGS,
    }),
  },
  {
    id: "jingling_keys",
    icon: "🔑",
    name: "Jingling Keys",
    name_cz: "Cinkání klíčů",
    name_zh: "钥匙叮当响",
    flavor: "In November 1989, hundreds of thousands jingled their keys: time to go home.",
    flavor_cz: "V listopadu 1989 zacinkaly statisíce klíčů: je čas jít domů.",
    flavor_zh: "1989年11月，几十万人一起摇响钥匙：该走的，可以走了。",
    description: "Check in at these 7 places: Albertov Campus, Velvet Revolution Memorial, Václav Square, Melantrich, Letná Plain, Václav Havel's Bench and Heart for Václav Havel.",
    description_cz: "Přihlaste se na těchto 7 místech: Kampus Albertov, Památník sametové revoluce 17. listopadu 1989, Václavské náměstí, Palác Hvězda (Melantrich), Letenská pláň, Lavička Václava Havla a Srdce pro Václava Havla.",
    description_zh: "打卡以下7个地点：阿尔贝托夫校区、天鹅绒革命纪念碑（1989年11月17日）、瓦茨拉夫广场、梅兰特里赫大楼（星辰宫）、莱特纳广场、瓦茨拉夫·哈维尔长椅和哈维尔之心。",
    difficulty: "medium",
    check: ({ checkedSlugs }) => VELVET_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: VELVET_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: VELVET_SLUGS.length,
      slugs: VELVET_SLUGS,
    }),
  },
  {
    id: "behind_the_iron_curtain",
    icon: "⛓️",
    name: "Behind the Iron Curtain",
    name_cz: "Za železnou oponou",
    name_zh: "铁幕之下",
    flavor: "In those years some were locked up, and others wrote freedom on a wall.",
    flavor_cz: "V těch letech jedny zavírali do vězení a jiní psali svobodu na zeď.",
    flavor_zh: "那些年，有人被关进监狱，有人在墙上写下自由。",
    description: "Check in at these 9 places: Goltz-Kinský Palace, Old Customs House (Museum of Communism), Memorial to the Victims of Communism, State Security (StB) Headquarters, Heroes' Square and Milada Horáková Memorial, Pankrác Prison, Ruzyně Prison, Letná Prague Metronome and John Lennon Wall.",
    description_cz: "Přihlaste se na těchto 9 místech: Palác Goltz-Kinských, Stará celnice (Muzeum komunismu), Pomník obětem komunismu, Sídlo Státní bezpečnosti (StB), Náměstí Hrdinů a památník Milady Horákové, Vazební věznice Praha Pankrác, Vazební věznice Praha Ruzyně, Letenské Pražský metronom a Lennonova zeď.",
    description_zh: "打卡以下9个地点：戈尔兹-金斯基宫、老海关大楼(共产主义博物馆)、共产主义受害者纪念碑、国家安全局（StB）总部、英雄广场和米拉达·霍拉科娃博士纪念碑、潘克拉茨监狱、鲁济涅监狱、莱特纳节拍器和列侬墙。",
    difficulty: "hard",
    check: ({ checkedSlugs }) => IRON_CURTAIN_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: IRON_CURTAIN_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: IRON_CURTAIN_SLUGS.length,
      slugs: IRON_CURTAIN_SLUGS,
    }),
  },
  {
    id: "never_forget",
    icon: "🕯️",
    name: "Never Forget",
    name_cz: "Nezapomeneme",
    name_zh: "勿忘",
    flavor: "Nearly 80,000 names on the walls of a synagogue, and a village razed to the ground. Remember them.",
    flavor_cz: "Téměř 80 000 jmen na zdech synagogy a vesnice srovnaná se zemí. Pamatujte na ně.",
    flavor_zh: "一座会堂墙上近八万个名字，一个被夷为平地的村庄。记住他们。",
    description: "Check in at these 5 places, two of them outside Prague: Pinkas Synagogue, Prague Main Station, Petschek Palace, Lidice and Terezín Concentration Camp.",
    description_cz: "Přihlaste se na těchto 5 místech, z nichž dvě jsou mimo Prahu: Pinkasova synagoga, Praha hlavní nádraží, Petschkův palác, Lidice a Koncentrační tábor Terezín.",
    description_zh: "打卡以下5个地点，其中两处在布拉格以外：平卡斯犹太会堂、布拉格主火车站、佩切克宫(前布拉格盖世太保总部)、利迪策和特雷津集中营。",
    difficulty: "extreme",
    check: ({ checkedSlugs }) => NEVER_FORGET_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: NEVER_FORGET_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: NEVER_FORGET_SLUGS.length,
      slugs: NEVER_FORGET_SLUGS,
    }),
  },
  {
    id: "charles_iv",
    icon: "👑",
    name: "Father of the Country",
    name_cz: "Otec vlasti",
    name_zh: "查理大帝",
    flavor: "The old emperor on the 100-crown note? That's him.",
    flavor_cz: "Ten starý císař na stokorunové bankovce? To je on.",
    flavor_zh: "100克朗纸币上的那个老皇帝，就是他。",
    description: "Check in at these 6 places, one of them outside Prague: Emmaus Monastery, Church of Our Lady of the Snows, Karolinum, Karlštejn Castle, Charles Bridge and Monument to Charles IV.",
    description_cz: "Přihlaste se na těchto 6 místech, z nichž jedno je mimo Prahu: Emauzské opatství, Kostel Panny Marie Sněžné, Karolinum, Hrad Karlštejn, Karlův most a Pomník Karla IV.",
    description_zh: "打卡以下6个地点，其中一处在布拉格以外：艾玛乌斯修道院、雪地圣母教堂、卡罗利努姆、卡尔什泰因城堡、查理大桥和查理四世纪念碑。",
    difficulty: "hard",
    check: ({ checkedSlugs }) => CHARLES_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: CHARLES_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: CHARLES_SLUGS.length,
      slugs: CHARLES_SLUGS,
    }),
  },
  {
    id: "early_bird",
    icon: "🐦",
    name: "Early Bird",
    name_cz: "Ranní ptáče",
    name_zh: "早起的鸟儿",
    flavor: "The early bird catches the card. Before seven, Prague is all yours.",
    flavor_cz: "Ranní ptáče dál doskáče. Před sedmou je Praha jen vaše.",
    flavor_zh: "早起的鸟儿有卡打。七点之前，布拉格是你一个人的。",
    description: "Check in anywhere between 4:00 and 7:00 in the morning (Prague time). A late night out doesn't count.",
    description_cz: "Přihlaste se kdekoli mezi čtvrtou a sedmou ráno (pražského času). Ponocování se nepočítá.",
    description_zh: "在早上4点到7点之间（布拉格时间）打卡一次。熬夜到凌晨不算。",
    difficulty: "medium",
    check: ({ earlyBird }) => (earlyBird || 0) >= 1,
    progress: ({ earlyBird }) => ({ current: earlyBird || 0, target: 1 }),
  },
  {
    id: "north_to_south",
    icon: "🧭",
    name: "From North to South",
    name_cz: "Ze severu na jih",
    name_zh: "南来北往",
    flavor: "North in the morning, south by the afternoon. Prague isn't that big after all.",
    flavor_cz: "Ráno na severu, odpoledne na jihu. Praha zas tak velká není.",
    flavor_zh: "早上在城北，下午在城南，布拉格也就这么大。",
    description: "On one day, check in at two places in Prague at least 15 km apart.",
    description_cz: "Během jednoho dne se přihlaste na dvou místech v Praze vzdálených od sebe alespoň 15 km.",
    description_zh: "在同一天里，打卡布拉格城内两个相距至少15公里的地点。",
    difficulty: "medium",
    check: ({ dayMaxKm }) => (dayMaxKm || 0) >= 15,
    progress: ({ dayMaxKm }) => ({ current: Math.floor(dayMaxKm || 0), target: 15, unit: "km" }),
  },
  {
    id: "dropping_by",
    icon: "🚋",
    name: "Dropping By",
    name_cz: "Na návštěvě",
    name_zh: "串门儿",
    flavor: "Five districts in one day. The postman would be proud.",
    flavor_cz: "Pět obvodů za jeden den. Pošťák by na vás byl hrdý.",
    flavor_zh: "一天串了五个区的门，比邮递员还勤快。",
    description: "On one day, check in in 5 different districts (Prague 1 to 22).",
    description_cz: "Během jednoho dne se přihlaste v 5 různých obvodech (Praha 1 až 22).",
    description_zh: "在同一天里，在5个不同的行政区（布拉格1区到22区）打卡。",
    difficulty: "medium",
    check: ({ dayMaxDistricts }) => (dayMaxDistricts || 0) >= 5,
    progress: ({ dayMaxDistricts }) => ({ current: dayMaxDistricts || 0, target: 5 }),
  },
  {
    id: "a_mere_twenty_two",
    icon: "🗺️",
    name: "A Mere Twenty-Two",
    name_cz: "Pouhých dvaadvacet",
    name_zh: "区区二十二",
    flavor: "A mere twenty-two districts, and you missed none of them.",
    flavor_cz: "Pouhých dvaadvacet obvodů, a ani jeden jste nevynechali.",
    flavor_zh: "区区二十二个区，一个都没落下。",
    description: "Check in at least once in each of the 22 districts (Prague 1 to 22).",
    description_cz: "Přihlaste se alespoň jednou v každém z 22 obvodů (Praha 1 až 22).",
    description_zh: "在布拉格1区到22区的每个区都至少打卡一次。",
    difficulty: "extreme",
    check: ({ districtsVisited }) => (districtsVisited || 0) >= 22,
    progress: ({ districtsVisited }) => ({ current: districtsVisited || 0, target: 22 }),
  },
  {
    id: "time_traveller",
    icon: "⏳",
    name: "Time Traveller",
    name_cz: "Cestovatel časem",
    name_zh: "穿越时空",
    flavor: "From the age of legends to the Iron Curtain: one card from each of six eras.",
    flavor_cz: "Od doby pověstí po železnou oponu: jedna karta z každé ze šesti epoch.",
    flavor_zh: "从传说时代到铁幕，六个时代，各留一张卡。",
    description: "Collect a card from each era: Prehistory, Middle Ages, Early Modern, National Revival, World Wars and Communism.",
    description_cz: "Sesbírejte kartu z každé epochy: pravěk, středověk, raný novověk, národní obrození, světové války a komunismus.",
    description_zh: "每个时代各收集一张卡：史前、中世纪、近代早期、民族复兴、世界大战和共产主义时期。",
    difficulty: "medium",
    check: (stats) => done(labelChecklist(ERA_LABELS)(stats)),
    progress: labelChecklist(ERA_LABELS),
  },
  {
    id: "architect",
    icon: "📐",
    name: "Architect",
    name_cz: "Architekt",
    name_zh: "建筑学家",
    flavor: "Romanesque to Brutalism: eleven styles, and now you can tell them apart at a glance.",
    flavor_cz: "Od románského slohu po brutalismus: jedenáct slohů a teď je rozeznáte na první pohled.",
    flavor_zh: "从罗马式到粗野主义，十一种风格，你现在一眼就能认出来。",
    description: "Collect a card in each of the 11 architectural styles, from Romanesque to Contemporary.",
    description_cz: "Sesbírejte kartu v každém z 11 architektonických slohů, od románského po současnou architekturu.",
    description_zh: "11种建筑风格各收集一张卡，从罗马式一直到当代建筑。",
    difficulty: "hard",
    check: (stats) => done(labelChecklist(STYLE_LABELS)(stats)),
    progress: labelChecklist(STYLE_LABELS),
  },
  {
    id: "namesakes",
    icon: "⛪",
    name: "Namesakes",
    name_cz: "Jmenovci",
    name_zh: "撞名",
    flavor: "Five churches for the same saint. Does he ever get a day off?",
    flavor_cz: "Pět kostelů pro jednoho světce. Má vůbec někdy volno?",
    flavor_zh: "五座教堂供着同一位圣人，他忙得过来吗？",
    description: "Check in at 5 churches dedicated to the same saint (or to Our Lady).",
    description_cz: "Přihlaste se v 5 kostelech zasvěcených stejnému světci (nebo Panně Marii).",
    description_zh: "打卡5座供奉同一位圣人（或圣母）的教堂。",
    difficulty: "medium",
    check: (stats) => done(SAINT_PROGRESS(stats)),
    progress: SAINT_PROGRESS,
  },
  {
    id: "never_give_up",
    icon: "💪",
    name: "Back on Your Feet",
    name_cz: "Kdo se nevzdá, vyhraje",
    name_zh: "屡败屡战",
    flavor: "Missed once, pressed again, and found it.",
    flavor_cz: "Poprvé vedle, podruhé to sedlo.",
    flavor_zh: "第一下按错了，第二下照样按下去，找到了。",
    description: "Find a treasure on the Treasure Hunt page after at least one wrong guess.",
    description_cz: "Najděte poklad na stránce hledání pokladu po alespoň jednom špatném tipu.",
    description_zh: "在寻宝中至少猜错一次之后，最终找到宝藏。",
    difficulty: "medium",
    check: ({ huntComeback }) => (huntComeback || 0) >= 1,
    progress: ({ huntComeback }) => ({ current: huntComeback || 0, target: 1 }),
  },
  {
    id: "raiders",
    icon: "🗝️",
    name: "Raider of the Lost Cards",
    name_cz: "Dobyvatel ztracených karet",
    name_zh: "夺宝奇兵",
    flavor: "Ten hunts, ten treasures brought home.",
    flavor_cz: "Deset honů na poklad, deset pokladů doma.",
    flavor_zh: "十次寻宝，十次满载而归。",
    description: "Find 10 treasures on the Treasure Hunt page.",
    description_cz: "Najděte 10 pokladů na stránce hledání pokladu.",
    description_zh: "在寻宝页面累计找到10次宝藏。",
    difficulty: "hard",
    check: ({ huntFinds }) => (huntFinds || 0) >= 10,
    progress: ({ huntFinds }) => ({ current: huntFinds || 0, target: 10 }),
  },
  {
    id: "next_time",
    icon: "⌛",
    name: "Next Time, For Sure",
    name_cz: "Příště určitě",
    name_zh: "下次一定",
    flavor: "No treasure this time. Lesson learned: Prague is bigger than it looks.",
    flavor_cz: "Tentokrát bez pokladu. Poučení: Praha je větší, než vypadá.",
    flavor_zh: "这次没找到宝藏。学到了：布拉格比看起来大。",
    description: "Let a treasure hunt run out of time without finding the treasure.",
    description_cz: "Nechte hledání pokladu vypršet, aniž byste poklad našli.",
    description_zh: "让一次寻宝超时，没有找到宝藏。",
    difficulty: "easy",
    check: ({ huntTimedOut }) => !!huntTimedOut,
    progress: ({ huntTimedOut }) => ({ current: huntTimedOut ? 1 : 0, target: 1 }),
  },
  {
    id: "a_quarter",
    icon: "🥉",
    name: "Getting the Hang of It",
    name_cz: "Trochu se vyznám",
    name_zh: "略懂略懂",
    flavor: "A quarter of Prague collected. Ask you the way, and you can say: \"I know a little.\"",
    flavor_cz: "Čtvrtina Prahy sesbírána. Když se vás někdo zeptá na cestu, můžete říct: „Trochu se vyznám.“",
    flavor_zh: "布拉格收集了四分之一，有人问路，你可以说一句：“略懂略懂。”",
    description: "Collect a quarter of the cards inside Prague (cards outside the city don't count).",
    description_cz: "Sesbírejte čtvrtinu karet v Praze (karty mimo město se nepočítají).",
    description_zh: "收集布拉格市内四分之一的卡片（城外的卡片不算）。",
    difficulty: "hard",
    check: (stats) => (stats.cityTotal || 0) > 0 && done(cityShare(0.25)(stats)),
    progress: cityShare(0.25),
  },
  {
    id: "the_last_mile",
    icon: "🏁",
    name: "The Last Mile",
    name_cz: "Poslední kilometr",
    name_zh: "行百里者半八十",
    flavor: "Eighty per cent done. The last twenty is the real half of the journey.",
    flavor_cz: "Osmdesát procent hotovo. Zbylých dvacet je ta skutečná polovina cesty.",
    flavor_zh: "收集了八成，剩下的两成，才是真正的一半。",
    description: "Collect 80% of the cards inside Prague (cards outside the city don't count). Once earned it stays, even when new cards are added.",
    description_cz: "Sesbírejte 80 % karet v Praze (karty mimo město se nepočítají). Jednou získaný úspěch zůstane, i když přibudou nové karty.",
    description_zh: "收集布拉格市内80%的卡片（城外的卡片不算）。一旦达成就永久保留，以后新增卡片也不会收回。",
    difficulty: "extreme",
    check: (stats) => (stats.cityTotal || 0) > 0 && done(cityShare(0.8)(stats)),
    progress: cityShare(0.8),
  },
  {
    id: "full_deck",
    icon: "🃏",
    name: "A Full Deck",
    name_cz: "Celý balíček",
    name_zh: "一沓扑克牌",
    flavor: "Fifty-four cards: a full deck, jokers included.",
    flavor_cz: "Padesát čtyři karet: celý balíček i s žolíky.",
    flavor_zh: "54张，一副扑克牌，大小王都齐了。",
    description: "Collect 54 cards.",
    description_cz: "Sesbírejte 54 karet.",
    description_zh: "收集54张卡。",
    difficulty: "easy",
    check: ({ totalCheckins }) => (totalCheckins || 0) >= 54,
    progress: ({ totalCheckins }) => ({ current: totalCheckins || 0, target: 54 }),
  },
  {
    id: "fast_and_curious",
    icon: "🏎️",
    name: "The Fast and the Curious",
    name_cz: "Rychle a zvědavě",
    name_zh: "速度与激情",
    flavor: "Treasure found within the hour: half skill, half whether the tram was on time.",
    flavor_cz: "Poklad do hodiny: napůl šikovnost, napůl jestli jela tramvaj včas.",
    flavor_zh: "一小时内找到宝藏：一半靠本事，一半看今天的电车堵不堵。",
    description: "Find a treasure on the Treasure Hunt page within one hour of starting the hunt.",
    description_cz: "Najděte poklad na stránce hledání pokladu do hodiny od začátku hledání.",
    description_zh: "在寻宝页面开始寻宝后，一小时内找到宝藏。",
    difficulty: "hard",
    check: ({ fastestHuntMs }) => fastestHuntMs != null && fastestHuntMs <= 60 * 60 * 1000,
    progress: ({ fastestHuntMs }) => ({ current: fastestHuntMs != null && fastestHuntMs <= 60 * 60 * 1000 ? 1 : 0, target: 1 }),
  },
  {
    id: "new_faces",
    icon: "🏙️",
    name: "New Faces in an Old Town",
    name_cz: "Nové tváře starého města",
    name_zh: "古城的新面孔",
    flavor: "In a thousand-year-old city, you went looking for the new buildings.",
    flavor_cz: "V tisícileté Praze jste se šli dívat na nové domy.",
    flavor_zh: "在一座千年古城里，你专挑新房子看。",
    description: "Collect at least 15 Contemporary Architecture cards, including the Dancing House and the Pankrác Skyline.",
    description_cz: "Sesbírejte alespoň 15 karet Současná architektura, mezi nimi Tančící dům a Panorama Pankráce.",
    description_zh: "收集至少15张“当代建筑”卡片，其中必须包括跳舞房子和潘克拉茨天际线。",
    difficulty: "medium",
    check: (stats) => done(NEW_FACES(stats)),
    progress: NEW_FACES,
  },
  {
    id: "other_side",
    icon: "🏢",
    name: "The Other Side of Prague",
    name_cz: "Odvrácená tvář Prahy",
    name_zh: "布拉格的另一面",
    flavor: "Tourists see the red roofs. You also saw the panel blocks and the concrete.",
    flavor_cz: "Turisté vidí červené střechy. Vy jste viděli i paneláky a beton.",
    flavor_zh: "游客只看到红屋顶，你还看到了板楼和混凝土。",
    description: "Collect at least 5 Brutalism cards and 5 Communism and Cold War cards, and check in at Háje (Jižní Město), the Zelenohorská Panel House and the Centrotex Building.",
    description_cz: "Sesbírejte alespoň 5 karet Brutalismus a 5 karet Komunismus a přihlaste se na místech Háje (Jižní město), Dům v ulici Zelenohorská a Budova Centrotex.",
    description_zh: "收集至少5张“粗野主义”和5张“共产主义与冷战”卡片，并打卡哈耶（南城）、泽莱诺霍尔斯卡街板楼和中心纺织大楼。",
    difficulty: "medium",
    check: (stats) => done(OTHER_SIDE(stats)),
    progress: OTHER_SIDE,
  },
  {
    id: "seven_bridges",
    icon: "🌉",
    name: "The Seven Bridges Problem",
    name_cz: "Úloha o sedmi mostech",
    name_zh: "七桥问题",
    flavor: "Euler proved you can't cross Königsberg's seven bridges once each. Prague's seven you can cross as often as you like.",
    flavor_cz: "Euler dokázal, že sedm královeckých mostů nejde přejít každý právě jednou. Těch sedm pražských můžete přecházet, jak chcete.",
    flavor_zh: "欧拉证明了柯尼斯堡的七座桥没法每座只走一次。布拉格的七座桥，你想走几次就走几次。",
    description: "Check in at the seven central bridges over the Vltava: Štefánik Bridge, Čech Bridge, Mánes Bridge, Charles Bridge, Legion Bridge, Jirásek Bridge and Palacký Bridge.",
    description_cz: "Přihlaste se na sedmi mostech přes Vltavu v centru: Štefánikův most, Čechův most, Mánesův most, Karlův most, Most Legií, Jiráskův most a Palackého most.",
    description_zh: "打卡市中心伏尔塔瓦河上的七座桥：斯特凡尼克桥、切赫桥、马内斯桥、查理大桥、军团桥、伊拉塞克桥和帕拉茨基大桥。",
    difficulty: "medium",
    check: ({ checkedSlugs }) => BRIDGE_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: BRIDGE_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: BRIDGE_SLUGS.length,
      slugs: BRIDGE_SLUGS,
    }),
  },
  {
    id: "castaway",
    icon: "🏝️",
    name: "Castaway on the Vltava",
    name_cz: "Robinson na Vltavě",
    name_zh: "伏尔塔瓦河上的鲁滨逊",
    flavor: "Four islands, one river, and no need to build a raft.",
    flavor_cz: "Čtyři ostrovy, jedna řeka a není třeba stavět vor.",
    flavor_zh: "四座岛，一条河，用不着自己造木筏。",
    description: "Check in on the four islands in the centre of Prague: Kampa, Střelecký Island, Slavonic Island and Children's Island.",
    description_cz: "Přihlaste se na čtyřech ostrovech v centru Prahy: Kampa, Střelecký ostrov, Slovanský ostrov a Dětský ostrov.",
    description_zh: "打卡布拉格市中心的四座岛：坎帕岛、射手岛、斯拉夫岛和儿童岛。",
    difficulty: "easy",
    check: ({ checkedSlugs }) => ISLAND_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: ISLAND_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: ISLAND_SLUGS.length,
      slugs: ISLAND_SLUGS,
    }),
  },
  {
    id: "trainspotter",
    icon: "🚂",
    name: "Trainspotter",
    name_cz: "Šotouš",
    name_zh: "火车迷",
    flavor: "Seven stations, and you didn't catch a single train.",
    flavor_cz: "Sedm nádraží a ani jeden vlak jste nechytili.",
    flavor_zh: "七座火车站跑了个遍，一趟火车都没坐。",
    description: "Check in at seven Prague railway stations: Prague Main Station, Masaryk Station, Prague-Holešovice, Smíchov, Praha-Bubny, Praha-Libeň and Praha-Podbaba.",
    description_cz: "Přihlaste se na sedmi pražských nádražích: Praha hlavní nádraží, Masarykovo nádraží, Nádraží Praha-Holešovice, Smíchovské nádraží, Nádraží Praha-Bubny, Praha-Libeň (nádraží) a Nádraží Praha-Podbaba.",
    description_zh: "打卡布拉格的七座火车站：布拉格主火车站、马萨里克火车站、布拉格－霍勒绍维采火车站、斯米霍夫站、布布尼车站、布拉格利本火车站和布拉格-波德巴巴火车站。",
    difficulty: "medium",
    check: ({ checkedSlugs }) => STATION_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: STATION_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: STATION_SLUGS.length,
      slugs: STATION_SLUGS,
    }),
  },
  {
    id: "manchester_of_prague",
    icon: "🏭",
    name: "The Manchester of Prague",
    name_cz: "Pražský Manchester",
    name_zh: "布拉格的曼彻斯特",
    flavor: "Factories, a brewery and smoking chimneys: Smíchov was Prague's industrial heart, and you have seen half of it.",
    flavor_cz: "Továrny, pivovar a kouřící komíny: Smíchov býval průmyslovým srdcem Prahy a vy jste prošli jeho polovinu.",
    flavor_zh: "工厂、啤酒厂和冒烟的烟囱：斯米霍夫曾是布拉格的工业心脏，如今你已经逛了一半。",
    description: "Collect half of the cards in Smíchov, including the Staropramen Visitor Centre, Lihovar and Smíchov Station.",
    description_cz: "Sesbírejte polovinu karet na Smíchově, mezi nimi Návštěvnické centrum Staropramen, Lihovar a Smíchovské nádraží.",
    description_zh: "收集斯米霍夫一半的卡片，其中必须包括Staropramen参观中心、利霍瓦尔酒厂和斯米霍夫站。",
    difficulty: "hard",
    check: (stats) => done(MANCHESTER(stats)),
    progress: MANCHESTER,
  },
  {
    id: "wild_prague",
    icon: "🌲",
    name: "Trailblazer",
    name_cz: "Dobrodruh",
    name_zh: "探险家",
    flavor: "Gorges, cliffs and wild woods, all within reach of a tram stop.",
    flavor_cz: "Rokle, skály a divoké lesy, a všechno kousek od tramvajové zastávky.",
    flavor_zh: "峡谷、悬崖和野林子，全在电车站走得到的地方。",
    description: "Collect at least 15 Nature and Landscape cards, including Prokopské Valley, Divoká Šárka, the Crucifix on the Motol Rock, Modřany Gorge, the Dobeška viewpoint and the Cibulka lookout tower.",
    description_cz: "Sesbírejte alespoň 15 karet Příroda a krajina, mezi nimi Prokopské údolí, Divoká Šárka, Krucifix v Motole, Modřanská rokle, Vyhlídka Dobeška a Rozhledna Cibulka.",
    description_zh: "收集至少15张“自然与风景”卡片，其中必须包括普罗科普山谷、狂野沙尔卡、莫托尔岩上的十字架、莫德扎尼峡谷、多贝什卡观景台和奇布尔卡瞭望塔。",
    difficulty: "medium",
    check: (stats) => done(WILD_PRAGUE(stats)),
    progress: WILD_PRAGUE,
  },
  {
    id: "tower_and_general",
    icon: "📡",
    name: "The Tower and the One-Eyed General",
    name_cz: "Věž a jednooký vojevůdce",
    name_zh: "电视塔和独眼将军",
    flavor: "On one side, a TV tower crawling with babies; on the other, a one-eyed general on horseback. That's Žižkov.",
    flavor_cz: "Na jedné straně televizní věž s lezoucími miminky, na druhé jednooký vojevůdce na koni. To je Žižkov.",
    flavor_zh: "一边是爬满婴儿的电视塔，一边是骑着马的独眼将军，日什科夫就是这么混搭。",
    description: "Collect half of the cards in Žižkov, including the Žižkov TV Tower and the Jan Žižka Monument.",
    description_cz: "Sesbírejte polovinu karet na Žižkově, mezi nimi Žižkovský televizní vysílač a Pomník Jana Žižky.",
    description_zh: "收集日什科夫一半的卡片，其中必须包括日什科夫电视塔和扬·杰式卡纪念像。",
    difficulty: "medium",
    check: (stats) => done(ZIZKOV(stats)),
    progress: ZIZKOV,
  },
  {
    id: "valley_of_laments",
    icon: "🌫️",
    name: "The Valley of Laments",
    name_cz: "Jamrtál",
    name_zh: "哀叹之谷",
    flavor: "In the Thirty Years' War the Swedes set up their guns here, and the valley earned its old nickname: the Valley of Laments.",
    flavor_cz: "Za třicetileté války tu Švédové postavili děla a údolí dostalo starou přezdívku Jamrtál, údolí nářků.",
    flavor_zh: "三十年战争时，瑞典人在这里架起大炮，山谷从此得了个老外号：“哀叹之谷”。",
    description: "Collect 40% of the cards in Nusle, including the Nusle Bridge and the Nusle Valley.",
    description_cz: "Sesbírejte 40 % karet v Nuslích, mezi nimi Nuselský most a Nuselské údolí.",
    description_zh: "收集努斯莱40%的卡片，其中必须包括努斯莱大桥和努斯莱山谷。",
    difficulty: "medium",
    check: (stats) => done(NUSLE(stats)),
    progress: NUSLE,
  },
  {
    id: "libuse_prophecy",
    icon: "✨",
    name: "Libuše's Prophecy",
    name_cz: "Libušino proroctví",
    name_zh: "莉布谢的传说",
    flavor: "Libuše foresaw a great city whose glory would touch the stars. You have seen nearly all of the rock she stood on.",
    flavor_cz: "Libuše prý viděla velké město, jehož sláva se bude dotýkat hvězd. Vy jste prošli skoro celou skálu, na které stála.",
    flavor_zh: "莉布谢预言过一座荣耀将触及星辰的城市。她当年站过的这块岩石，你几乎走遍了。",
    description: "Collect 80% of the cards in Vyšehrad, including the Statue of Přemysl and Libuše.",
    description_cz: "Sesbírejte 80 % karet na Vyšehradě, mezi nimi Sousoší Přemysl a Libuše.",
    description_zh: "收集维谢赫拉德80%的卡片，其中必须包括普热米斯尔与莉布谢雕像。",
    difficulty: "hard",
    check: (stats) => done(VYSEHRAD(stats)),
    progress: VYSEHRAD,
  },
  {
    id: "golem_in_the_attic",
    icon: "🗿",
    name: "Streets Beneath the Star of David",
    name_cz: "Uličky pod Davidovou hvězdou",
    name_zh: "六芒星下的街巷",
    flavor: "Legend says the Golem still lies in the attic of the Old-New Synagogue. You've seen almost all of Josefov, just not the attic.",
    flavor_cz: "Podle pověsti Golem dodnes leží na půdě Staronové synagogy. Prošli jste skoro celý Josefov, jen na půdu ne.",
    flavor_zh: "传说魔像至今还躺在老新犹太会堂的阁楼上。约瑟夫城你几乎逛遍了，就是没上过那个阁楼。",
    description: "Collect 80% of the cards in Josefov, including the Old-New Synagogue and the Spanish Synagogue.",
    description_cz: "Sesbírejte 80 % karet v Josefově, mezi nimi Staronová synagoga a Španělská synagoga.",
    description_zh: "收集约瑟夫城80%的卡片，其中必须包括老新犹太会堂和西班牙犹太会堂。",
    difficulty: "medium",
    check: (stats) => done(JOSEFOV(stats)),
    progress: JOSEFOV,
  },
  {
    id: "a_bowl_of_pho",
    icon: "🍜",
    name: "A Bowl of Phở, Please",
    name_cz: "Jedno phở, prosím",
    name_zh: "来一碗河粉吧",
    flavor: "Prague's own little Hanoi. You don't really know the city until you've had a bowl of phở here.",
    flavor_cz: "Pražská malá Hanoj. Prahu neznáte, dokud jste tu nesnědli misku phở.",
    flavor_zh: "布拉格的“小河内”。不在这儿吃上一碗河粉，就不算真的认识这座城。",
    description: "Check in at Sapa Praha.",
    description_cz: "Přihlaste se v Sapě.",
    description_zh: "打卡Sapa Praha。",
    difficulty: "easy",
    check: (stats) => done(PHO(stats)),
    progress: PHO,
  },
  {
    id: "king_died_of_anger",
    icon: "😤",
    name: "The King Who Died of Anger",
    name_cz: "Král, který se uzlobil k smrti",
    name_zh: "被气死的国王",
    flavor: "In 1419 Wenceslas IV heard here that councillors had been thrown out of a window in Prague. He flew into a rage, and a stroke soon finished him.",
    flavor_cz: "Roku 1419 se tu Václav IV. dozvěděl, že v Praze vyhazovali konšely z oken. Rozzuřil se a brzy nato ho ranila mrtvice.",
    flavor_zh: "1419年，瓦茨拉夫四世在这里听说布拉格的议员被扔出了窗外，大发雷霆，不久便中风而死。",
    description: "Check in at the New Castle ruins near Kunratice.",
    description_cz: "Přihlaste se na zřícenině Nového hradu u Kunratic.",
    description_zh: "打卡昆拉蒂采附近的新城堡遗址。",
    difficulty: "easy",
    check: (stats) => done(KUNRATICE_KING(stats)),
    progress: KUNRATICE_KING,
  },
  {
    id: "after_white_mountain",
    icon: "⚔️",
    name: "After White Mountain",
    name_cz: "Po Bílé hoře",
    name_zh: "白山之后",
    flavor: "A battle of barely two hours on a hill west of Prague, and it decided Bohemia's fate for the next three centuries.",
    flavor_cz: "Bitva, která na kopci za Prahou trvala sotva dvě hodiny, a rozhodla o osudu Čech na další tři století.",
    flavor_zh: "布拉格西郊的一座山坡，一场不到两个小时的战役，决定了波希米亚此后三百年的命运。",
    description: "Check in at the Battle of White Mountain memorial mound, the Hvězda Game Reserve and the pilgrimage site of Our Lady of Victory on White Mountain.",
    description_cz: "Přihlaste se u Mohyly bitvy na Bílé hoře, v oboře Hvězda a na Poutním místě Panny Marie Vítězné na Bílé hoře.",
    description_zh: "打卡白山战役纪念丘、星形狩猎园和白山胜利圣母朝圣地。",
    difficulty: "easy",
    check: (stats) => done(WHITE_MOUNTAIN(stats)),
    progress: WHITE_MOUNTAIN,
  },
  {
    id: "marathon_day",
    icon: "🏃",
    name: "Marathon Day",
    name_cz: "Maratonský den",
    name_zh: "春风得意马蹄疾",
    flavor: "Fifty cards in one day. Either your soles or your phone battery gives out first.",
    flavor_cz: "Padesát karet za jeden den. Dřív to vzdají buď podrážky, nebo baterka v telefonu.",
    flavor_zh: "一天五十张卡，鞋底和手机电量，总有一个先撑不住。",
    description: "Collect 50 cards in a single day (midnight to midnight, Prague time).",
    description_cz: "Sesbírejte 50 karet během jediného dne (od půlnoci do půlnoci, pražského času).",
    description_zh: "在同一天内（布拉格时间0:00到24:00）收集50张卡。",
    difficulty: "extreme",
    check: ({ dayMaxCards }) => (dayMaxCards || 0) >= 50,
    progress: ({ dayMaxCards }) => ({ current: dayMaxCards || 0, target: 50 }),
  },
  {
    id: "payday",
    icon: "💰",
    name: "Payday",
    name_cz: "Výplata",
    name_zh: "日进斗金",
    flavor: "A thousand XP in one day. Today the streets of Prague were your gold mine.",
    flavor_cz: "Tisíc XP za jeden den. Dnes byly pražské ulice vaším zlatým dolem.",
    flavor_zh: "一天进账一千经验，今天布拉格的大街小巷，都是你的金矿。",
    description: "Earn 1,000 XP in a single day (midnight to midnight, Prague time).",
    description_cz: "Získejte 1 000 XP během jediného dne (od půlnoci do půlnoci, pražského času).",
    description_zh: "在同一天内（布拉格时间0:00到24:00）获得1000点经验。",
    difficulty: "hard",
    check: ({ dayMaxXp }) => (dayMaxXp || 0) >= 1000,
    progress: ({ dayMaxXp }) => ({ current: dayMaxXp || 0, target: 1000, unit: "XP" }),
  },
  {
    id: "rain_or_shine",
    icon: "🌦️",
    name: "Come Rain or Shine",
    name_cz: "Za každého počasí",
    name_zh: "风雨无阻",
    flavor: "Seven days in a row, a new card every day. Prague's weather didn't make it easy.",
    flavor_cz: "Sedm dní v řadě, každý den nová karta. Pražské počasí vám to zrovna neulehčilo.",
    flavor_zh: "连续七天，天天都有新卡进账。布拉格的天气可没那么给面子。",
    description: "Collect at least one new card on seven days in a row (Prague time).",
    description_cz: "Sesbírejte alespoň jednu novou kartu sedm dní po sobě (pražského času).",
    description_zh: "连续七天（布拉格时间），每天都至少收集一张新卡。",
    difficulty: "hard",
    check: ({ longestStreak }) => (longestStreak || 0) >= 7,
    progress: ({ longestStreak }) => ({ current: longestStreak || 0, target: 7 }),
  },
  {
    id: "night_owl",
    icon: "🦉",
    name: "Night Owl",
    name_cz: "Noční sova",
    name_zh: "夜猫子",
    flavor: "Prague after midnight: just you, the street lamps and a cat that won't go to bed.",
    flavor_cz: "Praha po půlnoci: jen vy, lampy a kocour, který nechce jít spát.",
    flavor_zh: "凌晨的布拉格，只剩你、路灯和一只不睡觉的猫。",
    description: "Check in anywhere between midnight and 4:00 in the morning (Prague time).",
    description_cz: "Přihlaste se kdekoli mezi půlnocí a čtvrtou ráno (pražského času).",
    description_zh: "在凌晨0点到4点之间（布拉格时间）打卡一次。",
    difficulty: "medium",
    check: ({ nightOwl }) => (nightOwl || 0) >= 1,
    progress: ({ nightOwl }) => ({ current: nightOwl || 0, target: 1 }),
  },
  {
    id: "the_long_way_round",
    icon: "💎",
    name: "The Long Way Round",
    name_cz: "Za horami, za doly",
    name_zh: "千里迢迢",
    flavor: "A hundred kilometres and more, all for one card with a diamond in its frame.",
    flavor_cz: "Přes sto kilometrů, a to všechno kvůli jedné kartě s diamantem v rámu.",
    flavor_zh: "为了一张镶着钻石的卡，跑了一百多公里。",
    description: "Collect an Expedition card with a diamond in its frame (180 XP or more, roughly 100 km or further from Prague).",
    description_cz: "Sesbírejte kartu Výprava s diamantem v rámu (180 XP a víc, zhruba 100 km a dál od Prahy).",
    description_zh: "收集一张卡框上镶钻石的“远征”卡（经验180及以上，大约离布拉格100公里开外）。",
    difficulty: "hard",
    check: ({ diamondExpeditions }) => (diamondExpeditions || 0) >= 1,
    progress: ({ diamondExpeditions }) => ({ current: diamondExpeditions || 0, target: 1 }),
  },
  {
    id: "for_the_citizens",
    icon: "🏛️",
    name: "Red Tape",
    name_cz: "Úřední šiml",
    name_zh: "为了市民",
    flavor: "Ten town halls and offices, and somewhere a form is still waiting for your stamp.",
    flavor_cz: "Deset radnic a úřadů, a někde na vás pořád čeká formulář s razítkem.",
    flavor_zh: "十个市政厅和衙门都跑遍了，总有一张表格还在等你盖章。",
    description: "Collect 10 cards with the Municipal label.",
    description_cz: "Sesbírejte 10 karet se štítkem Obecní.",
    description_zh: "收集10张带“市政”标签的卡片。",
    difficulty: "easy",
    check: ({ labelCount = {} }) => (labelCount.municipal || 0) >= 10,
    progress: ({ labelCount = {} }) => ({ current: labelCount.municipal || 0, target: 10 }),
  },
  {
    id: "around_the_world",
    icon: "🌍",
    name: "Around the World in Prague",
    name_cz: "Cesta kolem světa",
    name_zh: "周游列国",
    flavor: "A dozen countries before lunch, and not one passport stamp.",
    flavor_cz: "Tucet zemí ještě před obědem, a ani jedno razítko v pasu.",
    flavor_zh: "一上午走了十几个国家，护照上一个章都没盖。",
    description: "Collect every card with the Embassy label. Once earned it stays, even when new embassy cards are added.",
    description_cz: "Sesbírejte všechny karty se štítkem Velvyslanectví. Jednou získaný úspěch zůstane, i když přibudou nové.",
    description_zh: "收集所有带“大使馆”标签的卡片。一旦达成就永久保留，以后新增大使馆卡也不会收回。",
    difficulty: "hard",
    check: ({ checkedSlugs, embassySlugs = [] }) => embassySlugs.length > 0 && embassySlugs.every((s) => checkedSlugs.includes(s)),
    progress: ({ checkedSlugs, embassySlugs = [] }) => ({ current: embassySlugs.filter((s) => checkedSlugs.includes(s)).length, target: Math.max(1, embassySlugs.length), slugs: embassySlugs }),
  },
  {
    id: "no_tourists_here",
    icon: "🏘️",
    name: "No Tourists Here",
    name_cz: "Tady turisti nejsou",
    name_zh: "这里没有游客",
    flavor: "Thirty cards where no tour group ever goes. Out here, Prague is just home.",
    flavor_cz: "Třicet karet tam, kam žádný zájezd nikdy nedojde. Tady je Praha prostě doma.",
    flavor_zh: "三十张卡，都在旅行团从来不去的地方。在这里，布拉格就只是家。",
    description: "Collect 30 cards in Prague 8 to 22 (outside Prague 1 to 7; cards outside the city don't count).",
    description_cz: "Sesbírejte 30 karet v Praze 8 až 22 (mimo Prahu 1 až 7; karty mimo město se nepočítají).",
    description_zh: "收集30张位于布拉格8区到22区的卡片（不在1到7区；城外的卡片不算）。",
    difficulty: "hard",
    check: ({ districtCount = {} }) => OUTER_DISTRICT_CARDS(districtCount) >= 30,
    progress: ({ districtCount = {} }) => ({ current: OUTER_DISTRICT_CARDS(districtCount), target: 30 }),
  },
  {
    id: "troy_not_in_greece",
    icon: "🐴",
    name: "Troy, Prague 7",
    name_cz: "Trója není v Řecku",
    name_zh: "特洛伊不在希腊",
    flavor: "A chateau, a vineyard, a zoo and a wooden horse. No Greeks, though.",
    flavor_cz: "Zámek, vinice, zoo a dřevěný kůň. Jen Řekové tu nejsou.",
    flavor_zh: "城堡、葡萄园、动物园，还有一匹木马，就是没有希腊人。",
    description: "Collect 5 cards in Troja, including the Trojan Horse.",
    description_cz: "Sesbírejte 5 karet v Tróji, mezi nimi Trojský kůň.",
    description_zh: "收集特罗亚的5张卡片，其中必须包括“特洛伊木马”。",
    difficulty: "easy",
    check: (stats) => done(TROJA(stats)),
    progress: TROJA,
  },
  {
    id: "neutral_fan",
    icon: "⚽",
    name: "Neutral Fan",
    name_cz: "Nestranný fanoušek",
    name_zh: "中立球迷",
    flavor: "You've been to both Slavia's ground and Sparta's. Now you have to pick a side.",
    flavor_cz: "Byli jste na Slavii i na Spartě. Teď si musíte vybrat stranu.",
    flavor_zh: "斯拉维亚和斯巴达的主场你都去过了，现在总得选一边了吧。",
    description: "Check in at Fortuna Arena, epet ARENA, O2 Arena Praha and the Great Strahov Stadium.",
    description_cz: "Přihlaste se ve Fortuna Areně, epet ARENĚ, O2 Areně Praha a na Velkém strahovském stadionu.",
    description_zh: "打卡幸运竞技场、epet竞技场、O2竞技场和斯特拉霍夫大球场。",
    difficulty: "medium",
    check: (stats) => done(STADIUMS(stats)),
    progress: STADIUMS,
  },
];

export function calculateLevel(xp) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
    else break;
  }
  const nextLevel = LEVELS.find((l) => l.xpRequired > xp) || null;
  return {
    level: current.level,
    title: current.title,
    title_cz: current.title_cz,
    title_zh: current.title_zh,
    xp,
    nextLevelXP: nextLevel?.xpRequired ?? null,
    progress: nextLevel
      ? Math.round(
          ((xp - current.xpRequired) /
            (nextLevel.xpRequired - current.xpRequired)) *
            100,
        )
      : 100,
  };
}

// What the client needs to announce a freshly unlocked achievement
// ({ id, unlockedAt } as stored, plus its icon, names and flavor).
// XP an achievement pays when it unlocks, by difficulty (user's numbers,
// 2026-11-02: generous, so they are worth going after).
export const ACHIEVEMENT_XP = { easy: 25, medium: 150, hard: 400, extreme: 800 };
export function achievementXp(id) {
  const a = ACHIEVEMENTS.find((x) => x.id === id);
  return a ? ACHIEVEMENT_XP[a.difficulty] || 0 : 0;
}

export function describeAchievement({ id, unlockedAt }) {
  const a = ACHIEVEMENTS.find((x) => x.id === id);
  if (!a) return { id, unlockedAt };
  return {
    id, unlockedAt, icon: a.icon, difficulty: a.difficulty, xp: ACHIEVEMENT_XP[a.difficulty] || 0,
    name: a.name, name_cz: a.name_cz, name_zh: a.name_zh,
    flavor: a.flavor, flavor_cz: a.flavor_cz, flavor_zh: a.flavor_zh,
  };
}

export function evaluateAchievements(stats, existingIds) {
  const newlyUnlocked = [];
  for (const ach of ACHIEVEMENTS) {
    if (existingIds.includes(ach.id)) continue;
    if (ach.check(stats))
      newlyUnlocked.push({ id: ach.id, unlockedAt: new Date() });
  }
  return newlyUnlocked;
}
