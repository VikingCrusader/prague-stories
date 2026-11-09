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
// `slugs` involved (the controller adds which are done); "any N of these"
// ones put each such list in `picks: [{ need, slugs, label? }]`, with `slugs`
// left for the places that are required, so the detail can list them apart
// (`label` names a group, { en, cz, zh }, when there is more than one). Stats come from
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
// Straight-A Student (学霸): nine universities and libraries (user's list, 2026-11-02).
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
  "zamek-panenske-brezany",
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
  "kaple-sv-vaclava-vinohradsky-hrbitov",
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
  "dablicky-hrbitov",
  "letna-park",
  "john-lennon-wall",
];
// Never Forget: the occupation and the Holocaust. The Pinkas Synagogue's
// walls of names, the station Winton's trains left from, the Gestapo HQ,
// and two places outside Prague (Lidice, Terezín), which make it the first
// "extreme" achievement (user's call, 2026-11-02).
// Eighty Thousand Names: the Holocaust in Prague (the id is older than the name).
const NEVER_FORGET_SLUGS = [
  "pinkas-synagogue", "praha-bubny-station", "hagibor", "praha-hlavni-nadrazi",
  "koncentracni-tabor-terezin",
];
// Eighty-Two Children: Lidice, split out of the above on 2026-11-05.
const LIDICE_SLUGS = [
  "lidice", "pamatnik-detskych-obeti-valky", "hromadny-hrob-lidice", "muzeum-pamatniku-lidice",
  "pamatnik-lidickych-zen-zena-s-ruzi",
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
// The Coast of Bohemia: ten Waterbody cards, four of them required (user's
// list, 2026-11-04). Named after the coast Shakespeare gave landlocked
// Bohemia in The Winter's Tale.
const COAST_OF_BOHEMIA = placesAndLabels(
  ["rudolfuv-rybnik", "prokopske-jezirko", "hostiva-reservoir-1783430212752", "meandry-botice"],
  [["waterbody", 10]]);
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
  [["nature", 25]]);
const ZIZKOV = quarterShareWith("Žižkov", 0.5, ["zizkov-tv-tower", "zizkov-horse-statue"]);
// Nusle: the valley's old nickname Jamrtál (Jammertal, valley of laments)
// comes from the Swedish guns of 1639 and 1648; the valley card is required
// next to the bridge so the name reads as that history, not as the bridge's
// sad reputation.
// Little Poland: half of the Bohnice cards, with the housing estate (its
// streets are named after Polish cities), the Krakov shopping centre (its
// card lies just over the line in Troja) and the psychiatric hospital, whose
// grounds host the Mezi ploty festival. User's idea, 2026-11-04.
const BOHNICE = quarterShareWith("Bohnice", 0.5, ["bohnice", "oc-krakov", "psychiatricka-nemocnice-bohnice"]);
const NUSLE = quarterShareWith("Nusle", 0.4, ["nusle-bridge", "nuselske-udoli"]);
const VYSEHRAD = quarterShareWith("Vyšehrad", 0.8, ["sousosi-premysl-a-libuse"]);
// The slug "josefov" is the Spanish Synagogue's card, not the whole quarter.
const JOSEFOV = quarterShareWith("Josefov", 0.8, ["old-new-synagogue-1782601630704", "josefov"]);
// City of Silver: Kutná Hora and its four big sights (user's list, 2026-11-03).
const SILVER_CITY = placesOnly(["kutna-hora", "vlassky-dvur", "kostel-svate-barbory", "kostnice-sedlec", "sedlecky-klaster"]);
const PHO = placesOnly(["sapa-praha"]);
// The Ex: the Slovak Embassy, and the New Building of the National Museum,
// once the Federal Assembly, which voted Czechoslovakia out of existence on
// 25 November 1992 (user's idea, 2026-11-04; Silver for the second place).
// To be linked to the Velvet Divorce event once the timeline gets there.
const THE_EX = placesOnly(["velvyslanectvi-slovenske-republiky", "nova-budova-narodniho-muzea"]);
// Where Two Rivers Meet: the Berounka flows into the Vltava at Lahovice.
// One card, but out of the way, hence Silver (user's call, 2026-11-04).
const CONFLUENCE = placesOnly(["soutok-berounky-vltavy"]);
// From the Vltava to the Elbe: any two of four places on the Elbe (user's
// list and call, 2026-11-04: the point is the Elbe, so no stricter rule).
const ELBE_SLUGS = ["zamek-brandys-nad-labem", "melnik-stare-mesto", "zamek-melnik", "stara-boleslav"];
function ELBE({ checkedSlugs = [] }) {
  return { current: Math.min(2, ELBE_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length), target: 2, slugs: [], picks: [{ need: 2, slugs: ELBE_SLUGS }] };
}
// They Glow at Night: cards of Epic rarity or higher, Expedition included.
const GLOWING_RARITIES = ["epic", "mythic", "legend", "expedition"];
const glowingCount = ({ rarityCount = {} }) => GLOWING_RARITIES.reduce((n, r) => n + (rarityCount[r] || 0), 0);
// Highs and Lows: Teleček, the city's highest point (399 m), and Praha-Sedlec
// station on the Vltava, standing in for the lowest point (about 177 m, where
// the river leaves the city at Suchdol; there is no exact point). User's
// design, 2026-11-04.
const HIGHS_AND_LOWS = placesOnly(["telecek-nejvyssi-bod-prahy", "nadrazi-praha-sedlec"]);
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
const STADIUMS = placesOnly(["fortuna-arena", "epet-arena", "o2-arena", "strahov-stadium", "stadion-juliska", "dolicek", "stadion-viktoria-zizkov"]);
// The Fridge Magnet Four (冰箱贴四件套; the id keeps "trio"): the four sights nearly every visitor sees first.
const TOURIST_TRIO = placesOnly(["tyn-church", "astronomical-clock", "charles-bridge", "st-vitus-cathedral"]);
// A Good Place to Live: Říčany, first in the Czech quality-of-life index.
const RICANY = placesOnly(["ricany"]);
// St Ludmila's Veil: Beroun, Králův Dvůr and the castle at Tetín, where she was killed in 921.
const LUDMILA_VEIL = placesOnly(["beroun", "kraluv-dvur", "zricenina-hradu-tetin"]);
// Down the Vltava (一路向北; the user's first name 溯游北上 means upstream, but north of Prague the river flows north).
const DOWN_THE_VLTAVA = placesOnly(["zamek-stredoceskeho-muzea-roztoky", "roztoky-u-prahy", "levy-hradec", "libehrad",
  "kostel-nanebevzeti-p-marie-a-sv-vaclava-kralupy", "zamek-nelahozeves", "zamek-veltrusy"]);
// Eiffel's Little Brother (埃菲尔铁塔的弟弟): Petřín Tower and the funicular, plus the Rose Garden or the
// Mirror Maze (Bronze, 2026-11-04).
function LITTLE_EIFFEL({ checkedSlugs = [] }) {
  const must = ["petrin-tower", "lanova-draha-petrin"];
  const pick = ["ruzovy-sad-petrin", "mirror-maze-petrin"];
  return {
    current: must.filter((slug) => checkedSlugs.includes(slug)).length + (pick.some((slug) => checkedSlugs.includes(slug)) ? 1 : 0),
    target: 3,
    slugs: must,
    picks: [{ need: 1, slugs: pick }],
  };
}
// Two Horses: St Wenceslas on Wenceslas Square, and David Černý's version
// in the Lucerna passage, riding an upside-down dead horse.
const TWO_HORSES = placesOnly(["pomnik-sv-vaclava", "kino-lucerna"]);
// Starter Pack (新手村, Bronze): the six landmarks of Old Town Square, plus
// any four of the other fourteen cards on and right around it (within about
// 130 m of its centre; the next ring, Celetná and Melantrichova, is left
// out). Four, not ten, so one walk round the square does it (user's call,
// 2026-11-04).
const OLD_TOWN_SQUARE_MUST = ["old-town-square", "tyn-church", "mariansky-sloup", "old-town-hall", "astronomical-clock", "pamatnik-jana-husa"];
const OLD_TOWN_SQUARE_SLUGS = [
  "27-krizu-staromestske-namesti", "palac-goltz-kinskych", "stone-bell-house",
  "dum-u-bileho-jednorozce", "storch-house", "dum-u-lazara", "schieruv-dum", "park-u-staromestskeho-namesti",
  "prazska-mestska-pojistovna", "dum-u-clovicku", "dum-zlaty-kriz", "kostel-sv-mikulase-stare-mesto",
  "dum-u-zlateho-slona", "dum-u-minuty",
];
function STARTING_ZONE({ checkedSlugs = [] }) {
  const must = OLD_TOWN_SQUARE_MUST.filter((slug) => checkedSlugs.includes(slug)).length;
  const n = OLD_TOWN_SQUARE_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length;
  return {
    current: must + Math.min(n, 4),
    target: OLD_TOWN_SQUARE_MUST.length + 4,
    slugs: OLD_TOWN_SQUARE_MUST,
    picks: [{ need: 4, slugs: OLD_TOWN_SQUARE_SLUGS }],
  };
}

// Batch of 2026-11-04 (user's ideas, names partly Claude's).
// Truth Prevails: the motto's story from Hus to the First Republic.
// Raised to Gold on 2026-11-04 (user's call: it is the national motto),
// following the motto's own story: Hus ("the truth of the Lord prevails"),
// the revival (its men and houses, Vyšehrad Cemetery where many of them lie)
// and the First Republic, which put it on the presidential standard in 1920
// (Masaryk, and Lány, where he died and is buried); 20 National Revival cards.
const TRUTH_PREVAILS = placesAndLabels(
  ["pamatnik-jana-husa", "palackeho-namesti", "pomnik-josefa-jungmanna", "national-museum", "national-theatre",
    "vysehrad-cemetery", "pamatnik-tg-masaryka", "zamek-lany"],
  [["national-revival", 20]]);
// Generalissimo: Wallenstein's palace in the Lesser Town and what belongs to it.
const WALLENSTEIN = placesOnly([
  "wallenstein-palace", "wallenstein-garden-1783750953785", "valdstejnska-jizdarna",
  "herkulova-fontana-valdstejnska-zahrada", "artificial-stalactite-wall-1783751377817",
]);
// AEIOU: the Habsburgs from Ferdinand I to Maria Theresa (Rudolf II has his
// own, Cabinet of Curiosities, so the two lists don't share a place).
const HABSBURG = placesOnly([
  "kralovska-zahrada", "queen-annes-summer-palace-1782584407663", "hvezda-game-reserve",
  "micovna-prazskeho-hradu", "new-royal-palace", "socha-marie-terezie",
]);
const RUDOLF = placesOnly([
  "new-royal-palace", "golden-lane", "jeleni-prikop", "rudolfova-stola", "rudolfuv-rybnik",
  "speculum-alchemiae", "tycho-brahe-kepler-monument",
]);
// Aula Regia: Zbraslav, where the Cistercian monastery (now the chateau)
// buried Wenceslas II. St James's church, where his remains are, is not
// required: it can only be entered with a ticket (user's call, 2026-11-04);
// its card still counts toward the 80%.
const ZBRASLAV = quarterShareWith("Zbraslav", 0.8, ["zbraslavsky-zamek"]);
// Amateur Geologist (地理爱好者; the id keeps Barrande): Barrandov is named after the geologist Joachim Barrande.
const BARRANDE = placesAndLabels(
  ["barrandovske-skaly", "brank-rock-cliff-1783427336440", "tramvajova-zastavka-geologicka",
    "podol-profile-1783209955360", "letensky-profil", "prazsky-zlom"],
  [["geology", 15]]);
const OLD_TOWN = quarterShareWith("Staré Město", 0.9, []);
const LESSER_TOWN = quarterShareWith("Malá Strana", 0.9, []);
// Virginia Creeper: one card on each of the city's ten hills. Each entry is
// a hill's cards, the first one the one shown while none is done.
const HILLS = [
  ["petrin-tower", "ruzovy-sad-petrin", "lanova-draha-petrin", "mirror-maze-petrin"],
  ["vitkov-national-memorial", "vinicni-svah-vitkov"],
  ["vysehrad", "basilika-sv-petra-pavla", "vysehrad-cemetery", "rotunda-sv-martina", "kaple-sv-ludmily",
    "stare-purkrabstvi", "sousosi-premysl-a-libuse", "vysehrad-wall-walkway", "libusina-lazen",
    "kaple-panny-marie-sancovske", "taborska-brana", "cihelna-brana", "vysehrad-leopold-gate",
    "pracharna-goticky-sklep", "v-pevnosti-street-in-the-fortness-1783208618265", "brana-spicka",
    "nove-dekanstvi-vysehrad", "romansky-most-vysehrad"],
  ["vyhlidka-na-letne", "letn-plain-1782906159291", "letna-park", "letensky-zamecek",
    "letenske-jezirko", "the-letn-carousel--1783352292475"],
  ["dvn-hillfort-ruins-1783473947717", "maidens-castles-dvn-1783211067574"],
  ["geodeticka-vez-ladvi"],
  ["mohyla-bile-hory", "the-pilgrimage-site-of-our-lady-of-victory-on-white-mountain-1783352113593"],
  ["parukarka"],
  ["tyrsuv-vrch"],
  ["televizni-stredisko-kavci-hory", "residence-building-kav-hory-1782866857630"],
];
// Knight Errant: any three of eight great Bohemian castles (user's list,
// 2026-11-04; Točník and Žebrák share one card). Kost and Trosky belong to
// Paradise Found instead, so the two lists don't overlap.
const CASTLE_TOUR_SLUGS = [
  "karlstejn-castle", "krivoklat-castle", "zamek-konopiste", "hrad-cesky-sternberk",
  "bezdez-castle", "zamek-orlik", "zvikov-castle", "hrady-tocnik-a-zebrak",
];
// Paradise Found: any three of five places in the heart of the Bohemian
// Paradise (Český ráj); three is what a day trip without a car manages
// (user's call, 2026-11-04).
const PARADISE_SLUGS = ["hrad-trosky", "kost-castle", "hrad-valdstejn", "hruboskalsko", "zricenina-hradu-rotstejn"];
function PARADISE({ checkedSlugs = [] }) {
  return { current: Math.min(3, PARADISE_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length), target: 3, slugs: [], picks: [{ need: 3, slugs: PARADISE_SLUGS }] };
}
// City Villages (城中村, user's list, 2026-11-05): old village centres the city grew around.
const CITY_VILLAGE_SLUGS = [
  "stare-stodulky", "stara-hostivar", "stary-zlicin", "velka-chuchle", "old-hluboepy-town-1783210594463",
  "holyne", "lipence", "klukovice", "ujezd-nad-lesy", "sobin", "trebonice", "zadni-kopanina", "komorany",
  "cholupice", "sterboholy", "dolni-mecholupy", "tocna", "psnice-1783428724036", "benice-praha", "hostavice",
  "miskovice", "nedvezi-u-rican", "hajek-u-uhrinevsi", "kolovraty", "brezineves", "v-sedlci",
];
const CITY_VILLAGES_NEEDED = 12;
function CITY_VILLAGES({ checkedSlugs }) {
  const current = CITY_VILLAGE_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length;
  return { current: Math.min(CITY_VILLAGES_NEEDED, current), target: CITY_VILLAGES_NEEDED, slugs: [], picks: [{ need: CITY_VILLAGES_NEEDED, slugs: CITY_VILLAGE_SLUGS }] };
}
function CASTLE_TOUR({ checkedSlugs = [] }) {
  return { current: Math.min(3, CASTLE_TOUR_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length), target: 3, slugs: [], picks: [{ need: 3, slugs: CASTLE_TOUR_SLUGS }] };
}
// One place that must be done plus any one of the others (The Emperor's
// Spring: Karlovy Vary and one more in West Bohemia; Rose of the South:
// Český Krumlov and one more in South Bohemia). Two places, so a day trip
// without a car manages it (user's call, 2026-11-04).
const anchorPlusOne = (main, others) => ({ checkedSlugs = [] }) => ({
  current: (checkedSlugs.includes(main) ? 1 : 0) + (others.some((slug) => checkedSlugs.includes(slug)) ? 1 : 0),
  target: 2,
  slugs: [main],
  picks: [{ need: 1, slugs: others }],
});
const WEST_SPA = anchorPlusOne("karlovy-vary", ["loket-castle", "jachymov", "cheb", "cheb-castle"]);
const SOUTH_ROSE = anchorPlusOne("cesky-krumlov", [
  "hrad-rozmberk", "klaster-zlata-koruna", "zamek-hluboka-nad-vltavou", "ceske-budejovice", "trebon", "jindrichuv-hradec",
]);
// The Iron and Golden King: Otakar II's tomb in St Vitus, plus at least
// one castle or monastery and one town he founded or built (2026-11-04,
// user's design: the castle builder and the town founder). Only his own
// foundations: towns he merely made royal (Jihlava, Ústí) and Houska were
// tried and dropped (user's call). Vysoké Mýto is there as his statue's card.
const OTAKAR_CASTLES = ["bezdez-castle", "zvikov-castle", "klaster-zlata-koruna"];
const OTAKAR_TOWNS = ["ceske-budejovice", "pisek", "nymburk", "caslav", "socha-premysla-otakara-ii"];
function OTAKAR({ checkedSlugs = [] }) {
  const has = (list) => (list.some((slug) => checkedSlugs.includes(slug)) ? 1 : 0);
  return {
    current: (checkedSlugs.includes("st-vitus-cathedral") ? 1 : 0) + has(OTAKAR_CASTLES) + has(OTAKAR_TOWNS),
    target: 3,
    slugs: ["st-vitus-cathedral"],
    picks: [
      { need: 1, slugs: OTAKAR_CASTLES, label: { en: "Castles or monastery", cz: "Hrady nebo klášter", zh: "城堡或修道院" } },
      { need: 1, slugs: OTAKAR_TOWNS, label: { en: "Towns", cz: "Města", zh: "城市" } },
    ],
  };
}
// Art Lover: the Barrandov Film Studios (film has no other card), one place
// for each other art, picked from a group (user's call, 2026-11-04: the
// achievement is about covering the arts, not a fixed list), plus 50 cards
// with either art label (one bar). The Mucha Museum is the old museum's
// card, not Savarin Palace (user's call).
const ART_GROUPS = [
  { slugs: ["mucha-museum", "veletrzni-palace", "museum-kampa-1782563427306", "klaster-sv-anezky-ceske", "dox-centre"],
    label: { en: "Galleries", cz: "Galerie", zh: "美术馆" } },
  { slugs: ["rudolfinum", "state-opera", "muzeum-antonina-dvoraka", "smetana-museum"],
    label: { en: "Music", cz: "Hudba", zh: "音乐" } },
  { slugs: ["national-theatre", "estates-theatre"],
    label: { en: "Theatre", cz: "Divadlo", zh: "戏剧" } },
  { slugs: ["kafka-rotating-head", "musoleum-david-cerny", "miminka-kampa", "curajici-postavy-david-cerny", "quo-vadis-trabant"],
    label: { en: "Sculpture", cz: "Sochařství", zh: "雕塑" } },
];
function ART_PROGRESS({ checkedSlugs = [], artCount = 0 }) {
  const film = checkedSlugs.includes("filmove-ateliery-barrandov") ? 1 : 0;
  const groupsDone = ART_GROUPS.filter((g) => g.slugs.some((slug) => checkedSlugs.includes(slug))).length;
  return {
    current: film + groupsDone + Math.min(artCount, 50),
    target: 1 + ART_GROUPS.length + 50,
    slugs: ["filmove-ateliery-barrandov"],
    picks: ART_GROUPS.map((g) => ({ need: 1, slugs: g.slugs, label: g.label })),
    counts: [{ label: "sculpture|cultural", current: artCount, target: 50 }],
  };
}
function HILLS_PROGRESS({ checkedSlugs = [] }) {
  const slugs = HILLS.map((hill) => hill.find((slug) => checkedSlugs.includes(slug)) || hill[0]);
  return { current: slugs.filter((slug) => checkedSlugs.includes(slug)).length, target: HILLS.length, slugs };
}

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
  // Early Bronze steps (2026-11-04, user's call: new players got nothing
  // between their first card and the 54th).
  {
    id: "small_harvest",
    icon: "🧺",
    name: "A Small Harvest",
    name_cz: "Malá úroda",
    name_zh: "小有收获",
    flavor: "Ten cards in, and the deck is starting to feel heavy in your pocket.",
    flavor_cz: "Deset karet a balíček už začíná v kapse vážit.",
    flavor_zh: "十张卡片到手，口袋里的这副牌开始有点分量了。",
    description: "Collect 10 cards.",
    description_cz: "Sesbírejte 10 karet.",
    description_zh: "收集10张卡片。",
    difficulty: "easy",
    check: ({ totalCheckins }) => (totalCheckins || 0) >= 10,
    progress: ({ totalCheckins }) => ({ current: totalCheckins || 0, target: 10 }),
  },
  {
    id: "getting_the_hang",
    icon: "🧭",
    name: "Getting the Hang of It",
    name_cz: "Už to jde",
    name_zh: "渐入佳境",
    flavor: "Twenty-five cards, and you've stopped checking the map every five minutes.",
    flavor_cz: "Pětadvacet karet a už se nedíváte do mapy každých pět minut.",
    flavor_zh: "二十五张卡片，你已经不用每五分钟看一次地图了。",
    description: "Collect 25 cards.",
    description_cz: "Sesbírejte 25 karet.",
    description_zh: "收集25张卡片。",
    difficulty: "easy",
    check: ({ totalCheckins }) => (totalCheckins || 0) >= 25,
    progress: ({ totalCheckins }) => ({ current: totalCheckins || 0, target: 25 }),
  },
  {
    id: "tourist_trio",
    icon: "🧲",
    name: "The Fridge Magnet Four",
    name_cz: "Magnetky na lednici",
    name_zh: "冰箱贴四件套",
    flavor: "Týn, the clock, the bridge, the cathedral: the four on every fridge magnet in town. Now you've seen the real ones.",
    flavor_cz: "Týn, orloj, most, katedrála: ta čtveřice z každé magnetky ve městě. Teď jste viděli i ty skutečné.",
    flavor_zh: "泰恩教堂、天文钟、查理大桥、圣维特大教堂，城里每块冰箱贴上都是这四样。现在你见过真的了。",
    description: "Check in at the Church of Our Lady before Týn, the Astronomical Clock, Charles Bridge and St. Vitus Cathedral.",
    description_cz: "Přihlaste se v chrámu Matky Boží před Týnem, u orloje, na Karlově mostě a v katedrále svatého Víta.",
    description_zh: "打卡泰恩前的圣母教堂、天文钟、查理大桥和圣维特大教堂。",
    difficulty: "easy",
    check: (stats) => done(TOURIST_TRIO(stats)),
    progress: TOURIST_TRIO,
  },
  {
    id: "starter_pack",
    icon: "🗺️",
    name: "Starter Pack",
    name_cz: "Startovní balíček",
    name_zh: "新手村",
    flavor: "Every adventurer in Prague starts here: a clock, a column, two spires, and a crowd that never leaves.",
    flavor_cz: "Každý pražský dobrodruh začíná tady: orloj, sloup, dvě věže a dav, který nikdy neodejde.",
    flavor_zh: "每个布拉格冒险者都从这里出发：一座钟、一根柱子、两座尖塔，还有永远散不去的人群。",
    description: "Check in at Old Town Square, the Church of Our Lady before Týn, the Marian Column, the Old Town Hall, the Astronomical Clock and the Jan Hus Monument, and at any 4 of the other 14 places on and around the square.",
    description_cz: "Přihlaste se na Staroměstském náměstí, v chrámu Matky Boží před Týnem, u Mariánského sloupu, na Staroměstské radnici, u orloje a u Pomníku mistra Jana Husa a na libovolných 4 z dalších 14 míst na náměstí a kolem něj.",
    description_zh: "打卡老城广场、泰恩前的圣母教堂、圣母柱、老城市政厅、天文钟和扬·胡斯纪念碑，再在广场及周边的其余14个地点中任选4个打卡。",
    difficulty: "easy",
    check: (stats) => done(STARTING_ZONE(stats)),
    progress: STARTING_ZONE,
  },
  {
    id: "both_banks",
    icon: "🌉",
    name: "Both Banks",
    name_cz: "Na obou březích",
    name_zh: "此岸彼岸",
    flavor: "Castle side, Old Town side: you've stood on both, and the Vltava kept flowing in between.",
    flavor_cz: "Hradní strana, staroměstská strana: stáli jste na obou a Vltava mezi nimi klidně tekla dál.",
    flavor_zh: "城堡这边、老城那边，你都站过了，伏尔塔瓦河在中间照常流。",
    description: "Collect a card on each bank of the Vltava (cards on bridges and islands don't count).",
    description_cz: "Seberte kartu na každém břehu Vltavy (karty na mostech a ostrovech se nepočítají).",
    description_zh: "在伏尔塔瓦河两岸各收集一张卡片（桥上和岛上的卡片不算）。",
    difficulty: "easy",
    check: ({ banksVisited }) => (banksVisited || 0) >= 2,
    progress: ({ banksVisited }) => ({ current: banksVisited || 0, target: 2 }),
  },
  {
    id: "little_eiffel",
    icon: "🗼",
    name: "Eiffel's Little Brother",
    name_cz: "Mladší bratr Eiffelovky",
    name_zh: "埃菲尔铁塔的弟弟",
    flavor: "A fifth of the height of the Eiffel Tower, but it stands on a hill.",
    flavor_cz: "Pětina výšky Eiffelovy věže, ale zato stojí na kopci.",
    flavor_zh: "只有埃菲尔铁塔的五分之一高，但人家站在山上。",
    description: "Check in at Petřín Observation Tower and the Petřín Funicular, and at the Petřín Rose Garden or the Mirror Maze.",
    description_cz: "Přihlaste se u Rozhledny na Petříně a u Lanové dráhy na Petřín a v Růžovém sadu nebo v Zrcadlovém bludišti.",
    description_zh: "打卡佩特任瞭望塔和佩特任缆车，再打卡佩特任玫瑰园或镜子迷宫中的一处。",
    difficulty: "easy",
    check: (stats) => done(LITTLE_EIFFEL(stats)),
    progress: LITTLE_EIFFEL,
  },
  {
    id: "two_horses",
    icon: "🐴",
    name: "Two Horses",
    name_cz: "Dva koně",
    name_zh: "两匹马",
    flavor: "On the square, St Wenceslas rides proudly. In the Lucerna passage, David Černý has him riding a dead horse hung upside down.",
    flavor_cz: "Na náměstí svatý Václav hrdě jede na koni. V pasáži Lucerna ho David Černý posadil na mrtvého koně zavěšeného hlavou dolů.",
    flavor_zh: "广场上，圣瓦茨拉夫骑着马威风凛凛；卢采尔纳宫的拱廊里，大卫·切尔尼让他骑在一匹倒挂的死马上。",
    description: "Check in at the St. Wenceslas Statue and at Lucerna Palace.",
    description_cz: "Přihlaste se u Pomníku svatého Václava a v paláci Lucerna.",
    description_zh: "打卡圣瓦茨拉夫骑马雕像和卢采尔纳宫。",
    difficulty: "easy",
    check: (stats) => done(TWO_HORSES(stats)),
    progress: TWO_HORSES,
  },
  {
    id: "see_you_tomorrow",
    icon: "🌅",
    name: "See You Tomorrow",
    name_cz: "Zítra zase",
    name_zh: "明天见",
    flavor: "You came back the next day. Prague noticed.",
    flavor_cz: "Druhý den jste se vrátili. Praha si toho všimla.",
    flavor_zh: "第二天你又来了，布拉格都看在眼里。",
    description: "Collect at least one new card on two days in a row (Prague time).",
    description_cz: "Seberte alespoň jednu novou kartu ve dvou po sobě jdoucích dnech (podle pražského času).",
    description_zh: "连续两天（布拉格时间）每天至少收集一张新卡片。",
    difficulty: "easy",
    check: ({ longestStreak }) => (longestStreak || 0) >= 2,
    progress: ({ longestStreak }) => ({ current: Math.min(longestStreak || 0, 2), target: 2 }),
  },
  {
    id: "turning_the_page",
    icon: "📖",
    name: "Turning the Page",
    name_cz: "Obracíme list",
    name_zh: "翻开史书",
    flavor: "The legends are behind you. Real history starts here.",
    flavor_cz: "Pověsti máte za sebou. Tady začínají skutečné dějiny.",
    flavor_zh: "传说翻过去了，真正的历史从这里开始。",
    description: "Reach the second era of the History Timeline, reading on or jumping there from the contents.",
    description_cz: "Dostaňte se na Časové ose k druhému období, ať už čtením, nebo skokem z obsahu.",
    description_zh: "在历史时间线中读到第二个时代，顺着读下去或从目录跳过去都算。",
    difficulty: "easy",
    check: ({ historyEraReached }) => (historyEraReached || 0) >= 2,
    progress: ({ historyEraReached }) => ({ current: (historyEraReached || 0) >= 2 ? 1 : 0, target: 1 }),
  },
  {
    id: "know_the_area",
    icon: "🧭",
    name: "Know Your Way Around",
    name_cz: "Vyznám se tu",
    name_zh: "门儿清",
    flavor: "A few tram stops, and you know the place inside out.",
    flavor_cz: "Pár zastávek tramvají a víte, kde co je.",
    flavor_zh: "几站电车的工夫，就把这片地方摸得门儿清。",
    description: "Open the guides to 10 different districts or quarters and get to know their history and everyday life.",
    description_cz: "Otevřete průvodce k 10 různým obvodům nebo čtvrtím a poznejte jejich historii i všední život.",
    description_zh: "打开10个不同行政区或地籍区的简介，了解它们的历史和日常。",
    difficulty: "easy",
    check: ({ areaGuidesRead }) => (areaGuidesRead || 0) >= 10,
    progress: ({ areaGuidesRead }) => ({ current: areaGuidesRead || 0, target: 10 }),
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
    description: "Collect 100 cards.",
    description_cz: "Sesbírejte 100 karet.",
    description_zh: "收集100张卡片。",
    difficulty: "hard",
    // Every card counts, user-added ones too (2026-11-04, user's call: no
    // more "preset locations"; was presetCheckins).
    check: ({ totalCheckins }) => (totalCheckins || 0) >= 100,
    progress: ({ totalCheckins }) => ({ current: totalCheckins || 0, target: 100 }),
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
    id: "highs_and_lows",
    icon: "🏔️",
    name: "Highs and Lows",
    name_cz: "Nahoře i dole",
    name_zh: "跌宕起伏",
    flavor: "From a field at 399 metres to the river at about 177: all of Prague's ups and downs in two stops.",
    flavor_cz: "Z pole ve výšce 399 metrů k řece ve výšce asi 177: všechna pražská nahoru a dolů na dvou zastávkách.",
    flavor_zh: "从海拔399米的田野到约177米的河边，布拉格所有的起起落落，两站就走完了。",
    description: "Check in at Teleček, the highest point of Prague, and at Praha-Sedlec station by the lowest. Prague has no exact lowest point: it lies roughly where the Vltava leaves the city at Suchdol, and the station stands for it.",
    description_cz: "Přihlaste se na Telečku, nejvyšším bodě Prahy, a na nádraží Praha-Sedlec u toho nejnižšího. Přesný nejnižší bod Praha nemá: leží zhruba tam, kde Vltava opouští město u Suchdola, a nádraží ho zastupuje.",
    description_zh: "打卡布拉格最高点泰莱切克，以及最低点附近的布拉格-塞德莱茨火车站。布拉格没有一个确切的最低点，它大致在伏尔塔瓦河流出城市的苏赫多尔一带，这座火车站就代表那里。",
    difficulty: "medium",
    check: (stats) => done(HIGHS_AND_LOWS(stats)),
    progress: HIGHS_AND_LOWS,
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
    difficulty: "medium",
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
    name: "God Be With You",
    name_cz: "Pánbůh s vámi",
    name_zh: "愿主保佑",
    flavor: "Forty churches, and you still look up every time you walk in.",
    flavor_cz: "Čtyřicet kostelů, a pořád se pokaždé po vstupu podíváte nahoru.",
    flavor_zh: "四十座教堂，每次进门，你还是会抬头看。",
    description: "Collect 40 cards with the “church” label.",
    description_cz: "Sesbírejte 40 karet se štítkem „Kostel“.",
    description_zh: "收集40张带“教堂”标签的卡片。",
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount.church || 0) >= 40,
    progress: ({ labelCount }) => ({ current: labelCount.church || 0, target: 40, countsLabel: "church" }),
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
    name: "Straight-A Student",
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
    description: "Check in at these 6 places: Reinhard Heydrich Assassination Site, Cathedral of Saints Cyril and Methodius, Petschek Palace, Kobylisy Shooting Range, Pankrác Prison and Panenské Břežany Upper Castle, Heydrich's home outside Prague.",
    description_cz: "Přihlaste se na těchto 6 místech: Místo atentátu na Heydricha, Katedrála sv. Cyrila a Metoděje, Petschkův palác, Památník protifašistického odboje Střelnice Kobylisy, Vazební věznice Praha Pankrác a Horní zámek Panenské Břežany, Heydrichovo sídlo za Prahou.",
    description_zh: "打卡以下6个地点：海德里希暗杀地点、圣西里尔与美多德大教堂、佩切克宫(前布拉格盖世太保总部)、科比利西射击场(反法西斯抵抗运动纪念碑)、潘克拉茨监狱和海德里希在布拉格城外的住所帕内内斯凯布热扎尼上城堡。",
    difficulty: "hard",
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
    description: "Check in at these 8 places: Albertov Campus, Velvet Revolution Memorial, Václav Square, Melantrich, Letná Plain, Václav Havel's Bench, Heart for Václav Havel and the Chapel of St. Wenceslas (Vinohrady Cemetery), where Havel is buried.",
    description_cz: "Přihlaste se na těchto 8 místech: Kampus Albertov, Památník sametové revoluce 17. listopadu 1989, Václavské náměstí, Palác Hvězda (Melantrich), Letenská pláň, Lavička Václava Havla, Srdce pro Václava Havla a Kaple sv. Václava (Vinohradský hřbitov), kde je Havel pohřben.",
    description_zh: "打卡以下8个地点：阿尔贝托夫校区、天鹅绒革命纪念碑（1989年11月17日）、瓦茨拉夫广场、梅兰特里赫大楼（星辰宫）、莱特纳广场、瓦茨拉夫·哈维尔长椅、哈维尔之心和哈维尔长眠的圣瓦茨拉夫小教堂（维诺赫拉迪公墓）。",
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
    description: "Check in at these 10 places: Goltz-Kinský Palace, Old Customs House (Museum of Communism), Memorial to the Victims of Communism, State Security (StB) Headquarters, Heroes' Square and Milada Horáková Memorial, Pankrác Prison, Ruzyně Prison, Ďáblice Cemetery, Letná Prague Metronome and John Lennon Wall.",
    description_cz: "Přihlaste se na těchto 10 místech: Palác Goltz-Kinských, Stará celnice (Muzeum komunismu), Pomník obětem komunismu, Sídlo Státní bezpečnosti (StB), Náměstí Hrdinů a památník Milady Horákové, Vazební věznice Praha Pankrác, Vazební věznice Praha Ruzyně, Ďáblický hřbitov, Letenské Pražský metronom a Lennonova zeď.",
    description_zh: "打卡以下10个地点：戈尔兹-金斯基宫、老海关大楼(共产主义博物馆)、共产主义受害者纪念碑、国家安全局（StB）总部、英雄广场和米拉达·霍拉科娃博士纪念碑、潘克拉茨监狱、鲁济涅监狱、达布利采公墓、莱特纳节拍器和列侬墙。",
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
    name: "Eighty Thousand Names",
    name_cz: "Osmdesát tisíc jmen",
    name_zh: "八万个名字",
    flavor: "Nearly 80,000 names on the walls of a synagogue, and the small station they left from. Remember them.",
    flavor_cz: "Téměř 80 000 jmen na zdech synagogy a malé nádraží, odkud odjížděli. Pamatujte na ně.",
    flavor_zh: "一座会堂墙上近八万个名字，一座他们离开时的小车站。记住他们。",
    description: "Check in at these 5 places, one of them outside Prague: Pinkas Synagogue, Praha-Bubny Station, Hagibor, Prague Main Station and Terezín Concentration Camp.",
    description_cz: "Přihlaste se na těchto 5 místech, z nichž jedno je mimo Prahu: Pinkasova synagoga, nádraží Praha-Bubny, Hagibor, Praha hlavní nádraží a Koncentrační tábor Terezín.",
    description_zh: "打卡以下5个地点，其中一处在布拉格以外：平卡斯犹太会堂、布布尼车站、哈吉博、布拉格主火车站和特雷津集中营。",
    difficulty: "extreme",
    check: ({ checkedSlugs }) => NEVER_FORGET_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: NEVER_FORGET_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: NEVER_FORGET_SLUGS.length,
      slugs: NEVER_FORGET_SLUGS,
    }),
  },
  {
    id: "eighty_two_children",
    icon: "🌹",
    name: "Eighty-Two Children",
    name_cz: "Dvaaosmdesát dětí",
    name_zh: "八十二个孩子",
    flavor: "On 10 June 1942 a village was wiped off the map. Eighty-two of its children never came home.",
    flavor_cz: "10. června 1942 zmizela z mapy jedna vesnice. Dvaaosmdesát jejích dětí se už nevrátilo domů.",
    flavor_zh: "1942年6月10日，一座村庄被从地图上抹去。村里八十二个孩子再也没有回家。",
    description: "Check in at these 5 places in Lidice, outside Prague: Lidice, Memorial to the Child Victims of War, Mass Grave of the Lidice Men, Lidice Memorial Museum and Memorial to the Lidice Women (Woman with a Rose).",
    description_cz: "Přihlaste se na těchto 5 místech v Lidicích mimo Prahu: Lidice, Památník dětských obětí války, Hromadný hrob zavražděných lidických mužů, Muzeum Památníku Lidice a Památník lidických žen (socha Žena s růží).",
    description_zh: "打卡布拉格以外利迪策的以下5个地点：利迪策、二战儿童受难者纪念碑、利迪策遇难男性集体墓、利迪策纪念馆博物馆和利迪策妇女纪念碑（“持玫瑰的女人”雕像）。",
    difficulty: "hard",
    check: ({ checkedSlugs }) => LIDICE_SLUGS.every((slug) => checkedSlugs.includes(slug)),
    progress: ({ checkedSlugs }) => ({
      current: LIDICE_SLUGS.filter((slug) => checkedSlugs.includes(slug)).length,
      target: LIDICE_SLUGS.length,
      slugs: LIDICE_SLUGS,
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
    description: "Collect at least 25 Nature and Landscape cards, including Prokopské Valley, Divoká Šárka, the Crucifix on the Motol Rock, Modřany Gorge, the Dobeška viewpoint and the Cibulka lookout tower.",
    description_cz: "Sesbírejte alespoň 25 karet Příroda a krajina, mezi nimi Prokopské údolí, Divoká Šárka, Krucifix v Motole, Modřanská rokle, Vyhlídka Dobeška a Rozhledna Cibulka.",
    description_zh: "收集至少25张“自然与风景”卡片，其中必须包括普罗科普山谷、狂野沙尔卡、莫托尔岩上的十字架、莫德扎尼峡谷、多贝什卡观景台和奇布尔卡瞭望塔。",
    difficulty: "hard",
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
    id: "little_poland",
    icon: "🏢",
    name: "Little Poland",
    name_cz: "Malé Polsko",
    name_zh: "布拉格的小波兰",
    flavor: "Streets named after Polish cities, a shopping centre called Kraków, and a psychiatric hospital that throws a music festival.",
    flavor_cz: "Ulice pojmenované po polských městech, obchodní centrum Krakov a psychiatrická nemocnice, která pořádá hudební festival.",
    flavor_zh: "街道以波兰城市命名，购物中心叫克拉科夫，还有一座会办音乐节的精神病院。",
    description: "Collect half of the cards in Bohnice, including the Bohnice Housing Area, Krakov Shopping Centre and Bohnice Psychiatric Hospital.",
    description_cz: "Sesbírejte polovinu karet v Bohnicích, mezi nimi Sídliště Bohnice, OC Krakov a Psychiatrická nemocnice Bohnice.",
    description_zh: "收集波赫尼采一半的卡片，其中必须包括波赫尼采住宅区、克拉科夫购物中心和波赫尼采精神病院。",
    difficulty: "medium",
    check: (stats) => done(BOHNICE(stats)),
    progress: BOHNICE,
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
    id: "the_ex",
    icon: "💔",
    name: "The Ex",
    name_cz: "Ex",
    name_zh: "前任",
    flavor: "Seventy-four years together, then an amicable split in 1993. They still watch hockey together.",
    flavor_cz: "Sedmdesát čtyři let spolu, v roce 1993 rozchod v dobrém. Na hokej se dívají spolu dodnes.",
    flavor_zh: "在一起七十四年，1993年和平分手。现在还常常一起看冰球。",
    description: "Check in at the Slovak Embassy and at the New Building of the National Museum, once the Federal Assembly, which voted to dissolve Czechoslovakia in November 1992.",
    description_cz: "Přihlaste se u Velvyslanectví Slovenské republiky a v Nové budově Národního muzea, bývalém Federálním shromáždění, které v listopadu 1992 odhlasovalo zánik Československa.",
    description_zh: "打卡斯洛伐克大使馆，以及国家博物馆新馆。新馆原是联邦议会大楼，1992年11月，联邦议会在这里投票解散了捷克斯洛伐克。",
    difficulty: "medium",
    check: (stats) => done(THE_EX(stats)),
    progress: THE_EX,
  },
  {
    id: "after_white_mountain",
    icon: "⚔️",
    name: "Two Hours",
    name_cz: "Dvě hodiny",
    name_zh: "两个钟头",
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
    progress: ({ labelCount = {} }) => ({ current: labelCount.municipal || 0, target: 10, countsLabel: "municipal" }),
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
    description: "Check in at Fortuna Arena, epet ARENA, O2 Arena Praha, the Great Strahov Stadium, Juliska Stadium, Ďolíček Stadium and Viktoria Žižkov Stadium.",
    description_cz: "Přihlaste se ve Fortuna Areně, epet ARENĚ, O2 Areně Praha, na Velkém strahovském stadionu, na Julisce, v Ďolíčku a na stadionu Viktorie Žižkov.",
    description_zh: "打卡幸运竞技场、epet竞技场、O2竞技场、斯特拉霍夫大球场、尤利斯卡球场、德约利切克球场和日什科夫维多利亚球场。",
    difficulty: "medium",
    check: (stats) => done(STADIUMS(stats)),
    progress: STADIUMS,
  },
  {
    id: "city_of_silver",
    icon: "🪙",
    name: "City of Silver",
    name_cz: "Stříbrné město",
    name_zh: "白银之城",
    flavor: "Silver minted the Prague groschen, raised a cathedral for the miners and, in the end, decorated a chapel with bones.",
    flavor_cz: "Stříbro razilo pražské groše, postavilo horníkům katedrálu a nakonec vyzdobilo kapli kostmi.",
    flavor_zh: "白银铸出了布拉格格罗申，为矿工盖起了大教堂，最后还用人骨装点了一座小礼拜堂。",
    description: "Check in at these 5 places in and around Kutná Hora: Kutná Hora, the Italian Court, St. Barbara's Cathedral, the Sedlec Ossuary and Sedlec Monastery.",
    description_cz: "Přihlaste se na těchto 5 místech v Kutné Hoře a okolí: Kutná Hora, Vlašský dvůr, Chrám svaté Barbory, Kostnice Sedlec a Sedlecký klášter.",
    description_zh: "打卡库特纳霍拉及其周边的5个地点：库特纳霍拉、意大利宫、圣芭芭拉大教堂、塞德莱茨藏骨堂和塞德莱茨修道院。",
    difficulty: "extreme",
    check: (stats) => done(SILVER_CITY(stats)),
    progress: SILVER_CITY,
  },
  {
    id: "back_and_forth",
    icon: "↔️",
    name: "Back and Forth",
    name_cz: "Sem a tam",
    name_zh: "反复横跳",
    flavor: "Old Town side, castle side, Old Town side... Even the Vltava is getting dizzy.",
    flavor_cz: "Staroměstská strana, hradní strana, zase staroměstská… I Vltavě se z vás točí hlava.",
    flavor_zh: "老城侧，城堡侧，再老城侧……伏尔塔瓦河都被你看晕了。",
    description: "Collect 6 cards in a row, switching banks of the Vltava each time (either bank first), all within 24 hours. Cards on bridges and islands and cards outside Prague don't count: they neither add to the run nor break it.",
    description_cz: "Seberte 6 karet za sebou, pokaždé na opačném břehu Vltavy (začít můžete na kterémkoli), vše do 24 hodin. Karty na mostech a ostrovech a karty mimo Prahu se nepočítají: řadu neprodlouží ani nepřeruší.",
    description_zh: "连续收集6张卡片，每一张都要换到伏尔塔瓦河的另一岸（从哪一岸开始都行），并在24小时内完成。桥上和岛上的卡片以及布拉格以外的卡片不算：既不计入，也不会打断连续。",
    difficulty: "medium",
    check: ({ zigzag }) => (zigzag || 0) >= 6,
    progress: ({ zigzag }) => ({ current: zigzag || 0, target: 6 }),
  },
  {
    id: "truth_prevails",
    icon: "🇨🇿",
    name: "Truth Prevails",
    name_cz: "Pravda vítězí",
    name_zh: "真理必胜",
    flavor: "A dictionary, a history, a theatre, a museum, and a republic at the end of it all.",
    flavor_cz: "Slovník, dějiny, divadlo, muzeum a na konci toho všeho republika.",
    flavor_zh: "一部词典，一部历史，一座剧院，一座博物馆，最后换来一个共和国。",
    description: "Check in at the Jan Hus Monument, Palacký Square, the Josef Jungmann Monument, the National Museum, the National Theatre, Vyšehrad Cemetery, the T. G. Masaryk Memorial and Lány Chateau, and collect at least 20 National Revival cards.",
    description_cz: "Přihlaste se u Památníku Jana Husa, na Palackého náměstí, u Pomníku Josefa Jungmanna, v Národním muzeu, v Národním divadle, na Vyšehradském hřbitově, u Památníku Tomáše Garrigua Masaryka a na zámku Lány a sesbírejte alespoň 20 karet Národní obrození.",
    description_zh: "打卡扬·胡斯纪念碑、帕拉茨基广场、约瑟夫·荣格曼纪念碑、国家博物馆、国家剧院、维谢赫拉德公墓、托马斯·马萨里克纪念像和拉尼城堡，并收集至少20张“民族复兴”卡片。",
    difficulty: "hard",
    check: (stats) => done(TRUTH_PREVAILS(stats)),
    progress: TRUTH_PREVAILS,
  },
  {
    id: "renaissance_man",
    icon: "📐",
    name: "Renaissance Man",
    name_cz: "Renesanční člověk",
    name_zh: "以人为本",
    flavor: "Arcades, sgraffito and gables: you've learned to spot an Italian idea in a Bohemian town.",
    flavor_cz: "Arkády, sgrafita a štíty: italský nápad v českém městě už poznáte na první pohled.",
    flavor_zh: "拱廊、五彩刮画和山墙：你已经能一眼认出波希米亚城里的意大利点子。",
    description: "Collect 13 Renaissance cards.",
    description_cz: "Sesbírejte 13 karet Renesance.",
    description_zh: "收集13张“文艺复兴”卡片。",
    difficulty: "medium",
    check: ({ labelCount }) => (labelCount.renaissance || 0) >= 13,
    progress: ({ labelCount }) => ({ current: labelCount.renaissance || 0, target: 13, countsLabel: "renaissance" }),
  },
  {
    id: "generalissimo",
    icon: "⚔️",
    name: "Generalissimo",
    name_cz: "Generalissimus",
    name_zh: "大元帅",
    flavor: "He tore down twenty-six houses to make room for one palace, and paid for it with estates seized after White Mountain.",
    flavor_cz: "Pro jeden palác dal zbořit šestadvacet domů a zaplatil ho statky zabavenými po Bílé hoře.",
    flavor_zh: "为了一座宫殿，他拆了二十六栋房子，花的是白山战役后没收来的庄园。",
    description: "Check in at Wallenstein Palace, the Wallenstein Garden, the Wallenstein Riding School, the Hercules Fighting the Dragon Fountain and the artificial stalactite wall.",
    description_cz: "Přihlaste se ve Valdštejnském paláci, ve Valdštejnské zahradě, ve Valdštejnské jízdárně, u Herkulovy kašny a u Umělé krápníkové stěny.",
    description_zh: "打卡华伦斯坦宫、华伦斯坦花园、华伦斯坦骑术学校、赫拉克勒斯战龙喷泉和钟乳石墙。",
    difficulty: "easy",
    check: (stats) => done(WALLENSTEIN(stats)),
    progress: WALLENSTEIN,
  },
  {
    id: "aeiou",
    icon: "🦅",
    name: "AEIOU",
    name_cz: "AEIOU",
    name_zh: "AEIOU",
    flavor: "The Habsburgs ruled Prague for almost four hundred years; their motto supposedly meant \"Austria rules the world\", and in the end they couldn't even keep Bohemia.",
    flavor_cz: "Habsburkové vládli Praze skoro čtyři sta let; jejich heslo prý znamenalo „Rakousko vládne světu“, a nakonec si neudrželi ani Čechy.",
    flavor_zh: "哈布斯堡家族在布拉格坐了近四百年江山，座右铭据说是“奥地利统治全世界”，最后连波希米亚都没留住。",
    description: "Check in at the Royal Garden, Queen Anne's Summer Palace, Hvězda Game Reserve, the Ball Game Hall of Prague Castle, the New Royal Palace and the Maria Theresa Statue.",
    description_cz: "Přihlaste se v Královské zahradě, v Letohrádku královny Anny, v oboře Hvězda, v Míčovně Pražského hradu, v Novém královském paláci a u Sochy Marie Terezie.",
    description_zh: "打卡皇家花园、安娜王后夏宫、星形猎苑、布拉格城堡球场馆、新皇宫和玛丽亚·特蕾莎雕像。",
    difficulty: "medium",
    check: (stats) => done(HABSBURG(stats)),
    progress: HABSBURG,
  },
  {
    id: "all_that_glitters",
    icon: "✨",
    name: "All That Glitters",
    name_cz: "Zlato a štuk",
    name_zh: "金碧辉煌",
    flavor: "Gold, marble that is really painted plaster, and saints who never stand still.",
    flavor_cz: "Zlato, mramor, který je ve skutečnosti malovaný štuk, a světci, kteří nikdy nestojí klidně.",
    flavor_zh: "金箔、其实是彩绘灰泥的大理石，还有从来站不安稳的圣人。",
    description: "Collect 50 Baroque cards.",
    description_cz: "Sesbírejte 50 karet Baroko.",
    description_zh: "收集50张“巴洛克”卡片。",
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount.baroque || 0) >= 50,
    progress: ({ labelCount }) => ({ current: labelCount.baroque || 0, target: 50, countsLabel: "baroque" }),
  },
  {
    id: "pure_gold",
    icon: "🌟",
    name: "Pure Gold",
    name_cz: "Ryzí zlato",
    name_zh: "金光闪闪",
    flavor: "Five legendary cards. Mind your eyes.",
    flavor_cz: "Pět legendárních karet. Pozor na oči.",
    flavor_zh: "五张传说卡，小心闪到眼睛。",
    description: "Collect 5 Legendary cards.",
    description_cz: "Sesbírejte 5 legendárních karet.",
    description_zh: "收集5张“传说”卡片。",
    difficulty: "easy",
    check: ({ rarityCount = {} }) => (rarityCount.legend || 0) >= 5,
    progress: ({ rarityCount = {} }) => ({ current: rarityCount.legend || 0, target: 5 }),
  },
  {
    id: "they_glow_at_night",
    icon: "✨",
    name: "They Glow at Night",
    name_cz: "V noci svítí",
    name_zh: "它们晚上会发光",
    flavor: "Keep them in a drawer, or nobody in the house will get any sleep.",
    flavor_cz: "Schovejte je do šuplíku, jinak se v domě nikdo nevyspí.",
    flavor_zh: "把它们收进抽屉吧，不然家里谁都睡不着。",
    description: "Collect 30 cards of Epic rarity or higher (Epic, Mythic and Legendary; Expedition cards count too).",
    description_cz: "Sesbírejte 30 karet vzácnosti Epická a vyšší (Epická, Mýtická a Legendární; počítají se i karty Výpravy).",
    description_zh: "收集30张稀有度在“史诗”及以上的卡片（史诗、神话、传说，远征卡也算）。",
    difficulty: "medium",
    check: (stats) => glowingCount(stats) >= 30,
    progress: (stats) => ({ current: glowingCount(stats), target: 30 }),
  },
  {
    id: "where_two_rivers_meet",
    icon: "🏞️",
    name: "Where Two Rivers Meet",
    name_cz: "Kde se řeky potkávají",
    name_zh: "两河交汇",
    flavor: "The Berounka comes all the way from Plzeň to end here. The Vltava doesn't even slow down.",
    flavor_cz: "Berounka teče celou cestu z Plzně, aby tady skončila. Vltava ani nezpomalí.",
    flavor_zh: "贝罗温卡河从比尔森一路流来，在这里走到尽头；伏尔塔瓦河连脚步都没放慢。",
    description: "Check in at the Berounka–Vltava Confluence.",
    description_cz: "Přihlaste se u Soutoku Berounky a Vltavy.",
    description_zh: "打卡贝罗温卡与伏尔塔瓦河交汇处。",
    difficulty: "medium",
    check: (stats) => done(CONFLUENCE(stats)),
    progress: CONFLUENCE,
  },
  {
    id: "vltava_to_elbe",
    icon: "⛵",
    name: "From the Vltava to the Elbe",
    name_cz: "Od Vltavy k Labi",
    name_zh: "从伏尔塔瓦到易北河",
    flavor: "At Mělník the Vltava gives up its name and flows on as the Elbe, all the way to Hamburg.",
    flavor_cz: "U Mělníka se Vltava vzdá svého jména a teče dál jako Labe, až do Hamburku.",
    flavor_zh: "到了梅尔尼克，伏尔塔瓦河交出名字，改叫易北河，一路流到汉堡。",
    description: "Check in at any 2 of these 4 places on the Elbe: Brandýs nad Labem Castle, Mělník Old Town, Mělník Chateau and Stará Boleslav.",
    description_cz: "Přihlaste se na libovolných 2 z těchto 4 míst na Labi: zámek Brandýs nad Labem, Staré město Mělník, zámek Mělník a Stará Boleslav.",
    description_zh: "在易北河畔的以下4个地点中任选2个打卡：拉贝河畔布兰迪斯城堡、梅尔尼克老城、梅尔尼克城堡和旧博莱斯拉夫。",
    difficulty: "hard",
    check: (stats) => done(ELBE(stats)),
    progress: ELBE,
  },
  {
    id: "spring_among_the_ruins",
    icon: "🏚️",
    name: "Spring Among the Ruins",
    name_cz: "Jaro mezi troskami",
    name_zh: "城春草木深",
    flavor: "The castles fell, and the trees moved in.",
    flavor_cz: "Hrady padly a nastěhovaly se do nich stromy.",
    flavor_zh: "城堡塌了，树住了进来。",
    description: "Collect 15 Ruin cards.",
    description_cz: "Sesbírejte 15 karet Zřícenina.",
    description_zh: "收集15张“遗迹”卡片。",
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount.ruin || 0) >= 15,
    progress: ({ labelCount }) => ({ current: labelCount.ruin || 0, target: 15, countsLabel: "ruin" }),
  },
  {
    id: "vampire",
    icon: "🧛",
    name: "Vampire",
    name_cz: "Upír",
    name_zh: "吸血鬼",
    flavor: "Twenty-five castles. People are starting to ask whether you sleep in a coffin.",
    flavor_cz: "Pětadvacet hradů. Lidé se začínají ptát, jestli nespíte v rakvi.",
    flavor_zh: "二十五座城堡了，大家开始怀疑你是不是睡在棺材里。",
    description: "Collect 25 Castle & Fortress cards.",
    description_cz: "Sesbírejte 25 karet Hrad & Pevnost.",
    description_zh: "收集25张“城堡与要塞”卡片。",
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount["castle and fortress"] || 0) >= 25,
    progress: ({ labelCount }) => ({ current: labelCount["castle and fortress"] || 0, target: 25, countsLabel: "castle and fortress" }),
  },
  {
    id: "coast_of_bohemia",
    icon: "🌊",
    name: "The Coast of Bohemia",
    name_cz: "Pobřeží Čech",
    name_zh: "波希米亚海岸",
    flavor: "Shakespeare gave Bohemia a coast. You'll have to make do with ponds.",
    flavor_cz: "Shakespeare dal Čechám mořské pobřeží. Vy si budete muset vystačit s rybníky.",
    flavor_zh: "莎士比亚给了波希米亚一片海岸，你就将就着逛逛池塘吧。",
    description: "Collect at least 10 Waterbody cards, including Rudolf's Pond, Prokopské Pond, the Hostivař Reservoir and the Meanders of the Botič.",
    description_cz: "Sesbírejte alespoň 10 karet Vodní plocha, mezi nimi Rudolfův rybník, Prokopské jezírko, Vodní nádrž Hostivař a Meandry Botiče.",
    description_zh: "收集至少10张“水体”卡片，其中必须包括鲁道夫池塘、普罗科普斯克池塘、霍斯蒂瓦日水库和博季奇河曲。",
    difficulty: "hard",
    check: (stats) => done(COAST_OF_BOHEMIA(stats)),
    progress: COAST_OF_BOHEMIA,
  },
  {
    id: "aula_regia",
    icon: "👑",
    name: "Aula Regia",
    name_cz: "Aula Regia",
    name_zh: "国王之庭",
    flavor: "A king founded a monastery here to be buried in, and the abbots wrote his chronicle.",
    flavor_cz: "Král tu založil klášter, aby v něm byl pohřben, a opati mu sepsali kroniku.",
    flavor_zh: "一位国王在这里建了修道院，好让自己长眠于此；院长们则替他写下了编年史。",
    description: "Collect 80% of the cards in Zbraslav, including Zbraslav Chateau.",
    description_cz: "Sesbírejte 80 % karet na Zbraslavi, mezi nimi Zbraslavský zámek.",
    description_zh: "收集兹布拉斯拉夫80%的卡片，其中必须包括兹布拉斯拉夫宫。",
    difficulty: "medium",
    check: (stats) => done(ZBRASLAV(stats)),
    progress: ZBRASLAV,
  },
  {
    id: "barrandes_apprentice",
    icon: "🪨",
    name: "Amateur Geologist",
    name_cz: "Amatérský geolog",
    name_zh: "地理爱好者",
    flavor: "Prague stands on a seabed some 400 million years old. Everyone else looks at the churches; you went to read the rocks.",
    flavor_cz: "Praha stojí na mořském dně starém asi 400 milionů let. Ostatní koukají na kostely, vy jste šli číst skály.",
    flavor_zh: "布拉格脚下是约四亿年前的海底。别人看教堂，你蹲下来读石头。",
    description: "Collect at least 15 Geology cards, including the Barrandov Rocks, the Braník Rock Cliff, the Geologická tram stop, the Podolí Profile, the Letná Profile and the Prague Fault.",
    description_cz: "Sesbírejte alespoň 15 karet Geologie, mezi nimi Barrandovské skály, Bránické skály, Tramvajová zastávka Geologická, Podolský profil, Letenský profil a Pražský zlom.",
    description_zh: "收集至少15张“地质”卡片，其中必须包括巴兰多夫岩层、布拉尼克岩壁、Geologická电车站、波多尔剖面、莱特纳地质剖面和布拉格断层。",
    difficulty: "hard",
    check: (stats) => done(BARRANDE(stats)),
    progress: BARRANDE,
  },
  {
    id: "old_town_regular",
    icon: "🕰️",
    name: "Old Town Regular",
    name_cz: "Staroměstský štamgast",
    name_zh: "老城常客",
    flavor: "You know which alley skips the crowd at the clock, and you no longer wait for the apostles.",
    flavor_cz: "Víte, kterou uličkou obejít dav u orloje, a na apoštoly už nečekáte.",
    flavor_zh: "你知道哪条小巷能绕开天文钟前的人群，也早就不再等那些使徒出场了。",
    description: "Collect 90% of the cards in the Old Town.",
    description_cz: "Sesbírejte 90 % karet na Starém Městě.",
    description_zh: "收集老城90%的卡片。",
    difficulty: "extreme",
    check: (stats) => done(OLD_TOWN(stats)),
    progress: OLD_TOWN,
  },
  {
    id: "lesser_town_not_less",
    icon: "🏘️",
    name: "Not So Lesser",
    name_cz: "Malá Strana není malá",
    name_zh: "小城不小",
    flavor: "The Lesser Town isn't so lesser after all, and neither is its list of sights.",
    flavor_cz: "Malá Strana zas tak malá není, a ani seznam jejích pamětihodností.",
    flavor_zh: "小城其实不算小，景点也不算少。",
    description: "Collect 90% of the cards in the Lesser Town.",
    description_cz: "Sesbírejte 90 % karet na Malé Straně.",
    description_zh: "收集小城90%的卡片。",
    difficulty: "extreme",
    check: (stats) => done(LESSER_TOWN(stats)),
    progress: LESSER_TOWN,
  },
  {
    id: "art_lover",
    icon: "🎨",
    name: "Art Lover",
    name_cz: "Milovník umění",
    name_zh: "文艺青年",
    flavor: "Statues, stages and galleries: you came for the city and stayed for the art.",
    flavor_cz: "Sochy, jeviště a galerie: přišli jste kvůli městu a zůstali kvůli umění.",
    flavor_zh: "雕像、舞台和画廊：你为了城市而来，却为了艺术留下。",
    description: "Check in at the Barrandov Film Studios and at one place for each of the other arts: a gallery, a music venue, a theatre and a sculpture (the choices are listed below), and collect 50 cards with the Sculpture or the Culture and Art label (a card with both counts once).",
    description_cz: "Přihlaste se ve Filmových ateliérech Barrandov a na jednom místě za každé další umění: v galerii, v hudebním sále nebo muzeu, v divadle a u sochy (na výběr níže), a sesbírejte 50 karet se štítkem Socha nebo Kultura a umění (karta s oběma se počítá jednou).",
    description_zh: "打卡巴兰多夫电影制片厂，再为其他每门艺术各打卡一处：美术馆、音乐、戏剧、雕塑（可选地点见下方），并收集50张带“雕塑”或“文化与艺术”标签的卡片（两个标签都有的卡片只算一次）。",
    difficulty: "hard",
    check: (stats) => done(ART_PROGRESS(stats)),
    progress: ART_PROGRESS,
  },
  {
    id: "cabinet_of_curiosities",
    icon: "🔭",
    name: "Cabinet of Curiosities",
    name_cz: "Kabinet kuriozit",
    name_zh: "珍奇柜",
    flavor: "Astronomers, alchemists and lions at the castle: Rudolf II collected everything, people included.",
    flavor_cz: "Astronomové, alchymisté a lvi na Hradě: Rudolf II. sbíral všechno, lidi nevyjímaje.",
    flavor_zh: "天文学家、炼金术士，还有城堡里的狮子：鲁道夫二世什么都收藏，连人也不例外。",
    description: "Check in at the New Royal Palace, Golden Lane, the Deer Moat, the Rudolf Tunnel, Rudolf's Pond, Speculum Alchemiae and the Tycho Brahe and Johannes Kepler Monument.",
    description_cz: "Přihlaste se v Novém královském paláci, ve Zlaté uličce, v Jelením příkopu, u Rudolfovy štoly, u Rudolfova rybníka, v Speculum Alchemiae a u Sousoší Tychona Brahe a Johanna Keplera.",
    description_zh: "打卡新皇宫、黄金巷、鹿沟、鲁道夫水道、鲁道夫池塘、炼金术之镜和第谷·布拉赫与约翰内斯·开普勒纪念雕像。",
    difficulty: "medium",
    check: (stats) => done(RUDOLF(stats)),
    progress: RUDOLF,
  },
  {
    id: "virginia_creeper",
    icon: "⛰️",
    name: "Virginia Creeper",
    name_cz: "Přísavník",
    name_zh: "爬山虎",
    flavor: "Prague has more hills than Rome, and you've climbed every one of them.",
    flavor_cz: "Praha má víc kopců než Řím a vy jste vylezli na všechny.",
    flavor_zh: "布拉格的山比罗马还多，而你一座不落地爬了个遍。",
    description: "Collect one card on each of Prague's ten hills: Petřín, Vítkov, Vyšehrad, Letná, Děvín, Ládví, White Mountain, Parukářka, Tyršův vrch and Kavčí hory.",
    description_cz: "Seberte jednu kartu na každém z deseti pražských kopců: Petřín, Vítkov, Vyšehrad, Letná, Děvín, Ládví, Bílá hora, Parukářka, Tyršův vrch a Kavčí hory.",
    description_zh: "在布拉格十座山上各收集一张卡片：佩特任山、维特科夫山、高堡、莱特纳、德文山、拉德维山、白山、帕鲁卡日卡山、蒂尔什山和卡夫奇山。",
    difficulty: "hard",
    check: (stats) => done(HILLS_PROGRESS(stats)),
    progress: HILLS_PROGRESS,
  },
  {
    id: "city_villages",
    icon: "🏘️",
    name: "City Villages",
    name_cz: "Vesnice ve městě",
    name_zh: "城中村",
    flavor: "Prague swallowed them whole. They kept their ponds and chapels anyway.",
    flavor_cz: "Praha je spolkla celé. Své rybníky a kapličky si přesto nechaly.",
    flavor_zh: "布拉格把它们整个吞了下去，它们还是留着自己的池塘和小教堂。",
    description: "Check in at any 12 of these 26 old villages inside Prague.",
    description_cz: "Přihlaste se v libovolných 12 z těchto 26 starých vesnic na území Prahy.",
    description_zh: "在布拉格城内以下26个老村子中任选12个打卡。",
    difficulty: "hard",
    check: (stats) => done(CITY_VILLAGES(stats)),
    progress: CITY_VILLAGES,
  },
  {
    id: "knight_errant",
    icon: "🏰",
    name: "Knight Errant",
    name_cz: "Potulný rytíř",
    name_zh: "游侠骑士",
    flavor: "One castle is a trip. Three castles is a quest.",
    flavor_cz: "Jeden hrad je výlet. Tři hrady jsou výprava rytíře.",
    flavor_zh: "去一座城堡叫出游，去三座城堡才叫游侠。",
    description: "Check in at any 3 of these 8 castles: Karlštejn, Křivoklát, Konopiště, Český Šternberk, Bezděz, Orlík, Zvíkov, and Točník and Žebrák.",
    description_cz: "Přihlaste se na libovolných 3 z těchto 8 hradů a zámků: Karlštejn, Křivoklát, Konopiště, Český Šternberk, Bezděz, Orlík, Zvíkov a Točník se Žebrákem.",
    description_zh: "在以下8处城堡中任选3处打卡：卡尔什泰因、克日沃克拉特、科诺皮什捷、切斯基什滕贝克、贝兹杰兹、奥尔利克、兹维科夫，以及托奇尼克与热布拉克。",
    difficulty: "extreme",
    check: (stats) => done(CASTLE_TOUR(stats)),
    progress: CASTLE_TOUR,
  },
  {
    id: "paradise_found",
    icon: "🪨",
    name: "Paradise Found",
    name_cz: "Ráj nalezen",
    name_zh: "复乐园",
    flavor: "Sandstone towers, castles grown out of the rock, and a two-towered ruin you can see from miles away.",
    flavor_cz: "Pískovcové věže, hrady vyrostlé ze skály a zřícenina se dvěma věžemi, vidět na míle daleko.",
    flavor_zh: "砂岩石塔、从岩石里长出来的城堡，还有一座几十里外都看得见的双塔废墟。",
    description: "Check in at any 3 of these 5 places in the Bohemian Paradise: Trosky Castle, Kost Castle, Valdštejn Castle, Hruboskalsko and the Rotštejn Castle Ruins.",
    description_cz: "Přihlaste se na libovolných 3 z těchto 5 míst v Českém ráji: hrad Trosky, hrad Kost, hrad Valdštejn, Hruboskalsko a zřícenina hradu Rotštejn.",
    description_zh: "在波希米亚天堂的以下5个地点中任选3个打卡：特罗斯基城堡、科斯特城堡、瓦尔德什特因城堡、赫鲁博斯卡尔斯科和罗特什捷因城堡遗迹。",
    difficulty: "extreme",
    check: (stats) => done(PARADISE(stats)),
    progress: PARADISE,
  },
  {
    id: "emperors_spring",
    icon: "♨️",
    name: "The Emperor's Spring",
    name_cz: "Císařský pramen",
    name_zh: "皇帝的温泉",
    flavor: "Legend says Charles IV's hound fell into a hot spring. Six centuries later, people still queue to drink from it.",
    flavor_cz: "Podle pověsti spadl Karlu IV. pes do horkého pramene. O šest století později na něj lidé pořád stojí frontu.",
    flavor_zh: "传说查理四世的猎犬掉进了一眼热泉。六百年后，人们还在排队喝那里的水。",
    description: "Check in at Karlovy Vary and at any one of Loket Castle, Jáchymov, Cheb and Cheb Castle.",
    description_cz: "Přihlaste se v Karlových Varech a na kterémkoli z těchto míst: hrad Loket, Jáchymov, Cheb a Chebský hrad.",
    description_zh: "打卡卡罗维发利，以及洛克特城堡、雅希莫夫、海布、赫布城堡中的任意一处。",
    difficulty: "extreme",
    check: (stats) => done(WEST_SPA(stats)),
    progress: WEST_SPA,
  },
  {
    id: "rose_of_the_south",
    icon: "🌹",
    name: "Rose of the South",
    name_cz: "Růže jihu",
    name_zh: "南方的玫瑰",
    flavor: "In Krumlov the Rožmberks' red rose blooms on every gate. South Bohemia has plenty more where that came from.",
    flavor_cz: "V Krumlově kvete rožmberská červená růže na každé bráně. Jižní Čechy jich mají v zásobě ještě víc.",
    flavor_zh: "在克鲁姆洛夫，罗森贝格家族的红玫瑰开在每一道城门上。南波希米亚还有的是好地方。",
    description: "Check in at Český Krumlov and at any one of Rožmberk Castle, Zlatá Koruna Monastery, Hluboká Castle, České Budějovice, Třeboň and Jindřichův Hradec Castle.",
    description_cz: "Přihlaste se v Českém Krumlově a na kterémkoli z těchto míst: hrad Rožmberk, klášter Zlatá Koruna, zámek Hluboká nad Vltavou, České Budějovice, Třeboň a Jindřichův Hradec.",
    description_zh: "打卡克鲁姆洛夫，以及罗森贝格城堡、金冕修道院、赫卢博卡城堡、捷克布杰约维采、特热邦、因德日赫城堡中的任意一处。",
    difficulty: "extreme",
    check: (stats) => done(SOUTH_ROSE(stats)),
    progress: SOUTH_ROSE,
  },
  {
    id: "iron_and_golden_king",
    icon: "👑",
    name: "The Iron and Golden King",
    name_cz: "Král železný a zlatý",
    name_zh: "铁与金之王",
    flavor: "Otakar II founded towns all over Bohemia, and Königsberg on the Baltic was named after him. Then he lost it all on the Marchfeld.",
    flavor_cz: "Přemysl Otakar II. zakládal města po celých Čechách a po něm se jmenoval i Královec u Baltu. Pak o všechno přišel na Moravském poli.",
    flavor_zh: "奥托卡二世在波希米亚各地建城，连波罗的海边的柯尼斯堡都以他命名。然后，他在马尔希费尔德输掉了一切。",
    description: "Check in at St. Vitus Cathedral, where Otakar II is buried, at one castle or monastery he built (Bezděz Castle, Zvíkov Castle or Zlatá Koruna Monastery) and at one town he founded (České Budějovice, Písek, Nymburk, Čáslav, or Vysoké Mýto with his statue).",
    description_cz: "Přihlaste se v katedrále svatého Víta, kde je pohřben Přemysl Otakar II., na jednom hradu nebo v klášteře, které postavil (hrad Bezděz, hrad Zvíkov nebo klášter Zlatá Koruna), a v jednom městě, které založil (České Budějovice, Písek, Nymburk, Čáslav nebo Vysoké Mýto s jeho sochou).",
    description_zh: "打卡奥托卡二世长眠的圣维特大教堂，再打卡一处他修建的城堡或修道院（贝兹杰兹城堡、兹维科夫城堡或金冕修道院），以及一座他创建的城市（捷克布杰约维采、皮塞克、宁布尔克、恰斯拉夫，或立着他雕像的维索凯米托）。",
    difficulty: "extreme",
    check: (stats) => done(OTAKAR(stats)),
    progress: OTAKAR,
  },
  // Checked after all the others (evaluateAchievements), so the ones
  // unlocked in the same pass count too.
  {
    id: "high_five",
    icon: "🖐️",
    name: "High Five",
    name_cz: "Plácni si!",
    name_zh: "五福临门",
    flavor: "The achievement of achievements.",
    flavor_cz: "Úspěch všech úspěchů.",
    flavor_zh: "成就的成就。",
    description: "Unlock 5 achievements on the same day (Prague time).",
    description_cz: "Odemkněte 5 úspěchů během jednoho dne (podle pražského času).",
    description_zh: "在同一天（布拉格时间）内解锁5个成就。",
    difficulty: "medium",
    after: true,
    check: ({ unlockDayMax }) => (unlockDayMax || 0) >= 5,
    progress: ({ unlockDayMax }) => ({ current: unlockDayMax || 0, target: 5 }),
  },
  {
    id: "seen_it_all",
    icon: "🥱",
    name: "Seen It All Before",
    name_cz: "To už jsme viděli",
    name_zh: "司空见惯",
    flavor: "Two hundred places any other city would put on a postcard, and you barely looked up.",
    flavor_cz: "Dvě stě míst, která by jinde dali na pohlednici, a vy jste skoro ani nezvedli hlavu.",
    flavor_zh: "别的城市要印上明信片的地方，你走了两百处，眼皮都不抬一下。",
    description: "Collect 200 Common cards.",
    description_cz: "Sesbírejte 200 karet vzácnosti Běžné.",
    description_zh: "收集200张“常见”卡片。",
    difficulty: "extreme",
    check: ({ rarityCount = {} }) => (rarityCount.common || 0) >= 200,
    progress: ({ rarityCount = {} }) => ({ current: rarityCount.common || 0, target: 200 }),
  },
  {
    id: "reaching_for_the_sky",
    icon: "⛪",
    name: "Reaching for the Sky",
    name_cz: "Až do nebe",
    name_zh: "高耸入云",
    flavor: "Forty Gothic buildings, every stone of them trying to get a little closer to heaven.",
    flavor_cz: "Čtyřicet gotických staveb a každý jejich kámen se snaží být o kousek blíž nebi.",
    flavor_zh: "四十处哥特式建筑，每一块石头都想离天堂再近一点。",
    description: "Collect 40 Gothic cards.",
    description_cz: "Sesbírejte 40 karet Gotika.",
    description_zh: "收集40张“哥特式”卡片。",
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount.gothic || 0) >= 40,
    progress: ({ labelCount }) => ({ current: labelCount.gothic || 0, target: 40, countsLabel: "gothic" }),
  },
  {
    id: "good_place_to_live",
    icon: "🏡",
    name: "A Good Place to Live",
    name_cz: "Tady se žije dobře",
    name_zh: "此心安处",
    flavor: "Year after year the quality-of-life index puts Říčany first in the country. You went to see why.",
    flavor_cz: "Index kvality života staví Říčany rok co rok na první místo v zemi. Jeli jste se podívat proč.",
    flavor_zh: "生活质量指数年年把日查尼排在全国第一。你专程来看看为什么。",
    description: "Check in at Říčany.",
    description_cz: "Přihlaste se v Říčanech.",
    description_zh: "打卡日查尼。",
    difficulty: "medium",
    check: (stats) => done(RICANY(stats)),
    progress: RICANY,
  },
  {
    id: "ludmilas_veil",
    icon: "🧣",
    name: "St Ludmila's Veil",
    name_cz: "Závoj svaté Ludmily",
    name_zh: "圣鲁德米拉的面纱",
    flavor: "Two towns on the Berounka, and the hill at Tetín where in 921 a duchess was strangled with her own veil.",
    flavor_cz: "Dvě města na Berounce a návrší v Tetíně, kde byla roku 921 kněžna uškrcena vlastním závojem.",
    flavor_zh: "贝罗温卡河边的两座小城，和921年一位公爵夫人被自己的面纱勒死的泰钦山头。",
    description: "Check in at Beroun, Králův Dvůr and the Tetín Castle Ruins.",
    description_cz: "Přihlaste se v Berouně, v Králově Dvoře a na Pozůstatcích hradu Tetína.",
    description_zh: "打卡贝隆、国王庭院和泰钦城堡遗迹。",
    difficulty: "hard",
    check: (stats) => done(LUDMILA_VEIL(stats)),
    progress: LUDMILA_VEIL,
  },
  {
    id: "down_the_vltava",
    icon: "🛶",
    name: "Down the Vltava",
    name_cz: "Po proudu Vltavy",
    name_zh: "一路向北",
    flavor: "The Vltava leaves Prague heading north. Follow it: a hillfort where Bohemia's Christianity began, a ruin on a cliff, Dvořák's birthplace and a Baroque summer palace.",
    flavor_cz: "Vltava opouští Prahu směrem na sever. Jeďte za ní: hradiště, kde začínalo české křesťanství, zřícenina na skále, Dvořákův rodný kraj a barokní letní sídlo.",
    flavor_zh: "伏尔塔瓦河出了布拉格，就朝北流去。跟着它走：波希米亚基督教起步的古城堡、悬崖上的废墟、德沃夏克的故乡和一座巴洛克夏宫。",
    description: "Check in at these 7 places on the Vltava north of Prague: Central Bohemian Museum Chateau, Roztoky u Prahy, Levý Hradec Hillfort, Liběhrad Ruin, the Church of the Assumption of the Virgin Mary and St. Wenceslas in Kralupy nad Vltavou, Nelahozeves Chateau and Veltrusy Chateau.",
    description_cz: "Přihlaste se na těchto 7 místech na Vltavě severně od Prahy: Zámek Středočeského muzea v Roztokách u Prahy, Roztoky u Prahy, Hradiště Levý Hradec, Zřícenina hradu Liběhrad, Kostel Nanebevzetí Panny Marie a svatého Václava v Kralupech nad Vltavou, Zámek Nelahozeves a Zámek Veltrusy.",
    description_zh: "打卡布拉格以北伏尔塔瓦河畔的以下7个地点：罗兹托基中波希米亚博物馆城堡、罗兹托基、莱维赫拉德茨古城堡遗址、利别赫拉德城堡遗址、克拉卢皮圣母升天暨圣瓦茨拉夫教堂、内拉霍泽维斯城堡和维尔特鲁西城堡。",
    difficulty: "extreme",
    check: (stats) => done(DOWN_THE_VLTAVA(stats)),
    progress: DOWN_THE_VLTAVA,
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
    if (ach.after || existingIds.includes(ach.id)) continue;
    if (ach.check(stats))
      newlyUnlocked.push({ id: ach.id, unlockedAt: new Date() });
  }
  // Achievements about achievements (High Five) run last, with today's
  // count raised by what this pass just unlocked.
  const today = (stats.unlockToday || 0) + newlyUnlocked.length;
  const after = { ...stats, unlockDayMax: Math.max(stats.unlockDayMax || 0, today) };
  for (const ach of ACHIEVEMENTS) {
    if (!ach.after || existingIds.includes(ach.id)) continue;
    if (ach.check(after))
      newlyUnlocked.push({ id: ach.id, unlockedAt: new Date() });
  }
  return newlyUnlocked;
}
