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
// so given freely they pick out the treasure at once. So they come step by
// step as the player closes in (user's call): within 3 km one label, within
// 1 km the district and quarter, within 300 m the rarity. The label and the
// quarter are checked when the hunt is dealt (planHuntClues in
// userController) so neither narrows the treasure down to a handful of cards
// on its own.
//
// Pressing costs multiplier. The multiplier sits on a ladder of half steps;
// a miss moves it down a full step (10 → 6 → 4 → 2 → 1), taking a clue only
// half a step (10 → 8, 6 → 5, 4 → 3, 2 → 1.5), so a clue is always cheaper
// than a blind guess (user's call). It never goes below 1x, and misses never
// end the hunt; only the 24h window does.
export const HUNT_MULTIPLIERS = [10, 8, 6, 5, 4, 3, 2, 1.5, 1];
export const HUNT_MISS_STEPS = 2;
export const HUNT_CLUE_STEPS = 1;
// A press within this distance of the treasure finds it. The button works
// anywhere; a miss tells which way the treasure lies from the pressed spot.
export const HIDDEN_DRAW_HIT_M = 100;
// Clues a player can take for half a step each, once each. The player
// doesn't pick: each take draws one at random from those still left.
// Walking in brings two for free, no more (user's calls, 2026-10-30, after
// a playtest where a free label at 3 km all but located the card): within
// HUNT_FREE_AREA_M the area (that close it mostly keeps the player from
// wandering out of the right quarter, it doesn't point anywhere), and
// within HUNT_FREE_CLUE_M one of HUNT_FREE_CLUE_KEYS at random, whichever
// the player doesn't have yet. The direction is never free:
//   label:     one of the card's labels (planHuntClues picks which);
//   rarity:    the rarity;
//   area:      the district and (if it passed the check) the quarter;
//   direction: which way the treasure lies from here, at that moment only
//              (not a filter: using it means walking and working it out).
// A distance snapshot was tried and dropped the same day: the distance
// reading already says as much (user's call).
export const HUNT_CLUES = ['rarity', 'label', 'area', 'direction'];
export const HUNT_FREE_AREA_M = 1000;
export const HUNT_FREE_CLUE_M = 300;
export const HUNT_FREE_CLUE_KEYS = ['rarity', 'label'];
// The check on the label and quarter clues. The label must fit at least
// HUNT_MIN_FIRST_CANDIDATES of the cards it could be: uncollected, on the
// same bank, within HUNT_LABEL_CHECK_M of the treasure. The quarter is only
// given if at least HUNT_MIN_QUARTER_CANDIDATES uncollected cards in it also
// carry that label (Explore filters by quarter); otherwise the area clue is
// the district alone. Both counts include the treasure.
export const HUNT_MIN_FIRST_CANDIDATES = 6;
export const HUNT_LABEL_CHECK_M = 3000;
// A new treasure is at least this far from where the player starts the hunt
// (when anything that far is left), so a hunt is always a walk.
export const HUNT_MIN_START_M = 4000;
export const HUNT_MIN_QUARTER_CANDIDATES = 3;
// Hot and cold: every HUNT_TREND_STEP_M walked the player is told whether
// they got closer or farther (no figure, no direction), all the way to the
// end; a change under HUNT_TREND_SAME_M reads as "about the same". It fixed
// the old hardcore hunt's blind opening, a whole kilometre walked before a
// wrong heading showed.
export const HUNT_TREND_STEP_M = 100;
export const HUNT_TREND_SAME_M = 40;

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
// short walk apart triangulate it. About N km (whole km) from 3 km out, about
// 3 / 2.5 / 2 / 1.5 / 1 km within 3 km (user's call), then only "within
// 1 km" and "within 300 m". There is deliberately no "within 100 m" (the hit
// radius): with it the best play was to never press until it showed, so a
// press could never miss and carried no risk (dropped 2026-10-29). The last
// stretch is found by hot and cold, the clues and looking around.
export function huntReading(d) {
  for (const r of [300, 1000]) if (d < r) return { within: r };
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
// A label on more than this share of the possible cards (e.g. the old
// catch-all "historical", once on over half of them) says next to nothing, so it is never the opening
// clue while the card has a more telling one.
export const HIDDEN_DRAW_GENERIC_LABEL_SHARE = 0.25;
// Labels treated as generic however rare they are: "hidden-gem" says the
// place is little known, not what it is.
export const HIDDEN_DRAW_VAGUE_LABELS = ['hidden-gem'];

// A card with any of these counts as a "historical location" for the
// History Fan achievement: the era and architectural-style labels that
// replaced the old catch-all "historical" label (2026-10-15).
export const HISTORY_LABELS = new Set([
  'communism',
  'prehistory', 'medieval', 'early-modern', 'national-revival', 'world-wars',
  'romanesque', 'gothic', 'renaissance', 'baroque', 'classicism', 'historicism',
  'art-nouveau', 'cubism', 'functionalism', 'brutalism',
]);

/**
 * The order a treasure's labels are revealed in (the first from the start,
 * the second within 1 km or as a clue taken), given the label lists of every
 * card it could be. Generic labels (on more than
 * HIDDEN_DRAW_GENERIC_LABEL_SHARE of the cards, e.g. "historical", or in
 * HIDDEN_DRAW_VAGUE_LABELS) go last: as an opening clue they make the start
 * pure guesswork. The rest go most common first, so a rare label like
 * "jewish" isn't the opening clue that gives it away. A card with only
 * generic labels opens with the least common of them. `shuffle` breaks ties.
 */
export function orderHuntLabels(labels, poolLabels, shuffle = a => [...a]) {
  const count = lb => poolLabels.filter(ls => ls?.includes(lb)).length;
  const generic = lb => HIDDEN_DRAW_VAGUE_LABELS.includes(lb) || count(lb) > poolLabels.length * HIDDEN_DRAW_GENERIC_LABEL_SHARE;
  return shuffle(labels).sort((a, b) =>
    (generic(a) - generic(b)) || (generic(a) ? count(a) - count(b) : count(b) - count(a)));
}

export const LEVELS = [
  { level: 1, title: "Newcomer", title_cz: "Nováček", title_zh: "新来者", xpRequired: 0 },
  { level: 2, title: "Tourist", title_cz: "Turista", title_zh: "游客", xpRequired: 80 },
  { level: 3, title: "Wanderer", title_cz: "Tulák", title_zh: "漫游者", xpRequired: 240 },
  { level: 4, title: "Explorer", title_cz: "Průzkumník", title_zh: "探索者", xpRequired: 450 },
  { level: 5, title: "Trailblazer", title_cz: "Průkopník", title_zh: "开拓者", xpRequired: 700 },
  { level: 6, title: "Adventurer", title_cz: "Dobrodruh", title_zh: "冒险者", xpRequired: 980 },
  { level: 7, title: "Pathfinder", title_cz: "Stopař", title_zh: "寻路者", xpRequired: 1310 },
  { level: 8, title: "Urban Scout", title_cz: "Městský skaut", title_zh: "城市侦察兵", xpRequired: 1660 },
  { level: 9, title: "Cartographer", title_cz: "Kartograf", title_zh: "制图师", xpRequired: 2040 },
  { level: 10, title: "Chronicler", title_cz: "Kronikář", title_zh: "编年史家", xpRequired: 2450 },
  { level: 11, title: "Journeyman Traveler", title_cz: "Tovaryš poutník", title_zh: "旅行学徒", xpRequired: 2880 },
  { level: 12, title: "City Sage", title_cz: "Městský mudrc", title_zh: "城市智者", xpRequired: 3340 },
  { level: 13, title: "Old Town Regular", title_cz: "Štamgast Starého Města", title_zh: "老城常客", xpRequired: 3820 },
  { level: 14, title: "Riverside Ranger", title_cz: "Strážce nábřeží", title_zh: "河畔守望者", xpRequired: 4330 },
  { level: 15, title: "Vltava Voyager", title_cz: "Poutník Vltavy", title_zh: "伏尔塔瓦河旅人", xpRequired: 4850 },
  { level: 16, title: "Bohemian Scholar", title_cz: "Bohemistický učenec", title_zh: "波西米亚学者", xpRequired: 5400 },
  { level: 17, title: "Castle Page", title_cz: "Hradní páže", title_zh: "城堡侍从", xpRequired: 5970 },
  { level: 18, title: "Alchemist's Apprentice", title_cz: "Alchymistův učeň", title_zh: "炼金术士学徒", xpRequired: 6560 },
  { level: 19, title: "Golem Tamer", title_cz: "Krotitel golema", title_zh: "魔像驯服者", xpRequired: 7160 },
  { level: 20, title: "Court Herald", title_cz: "Dvorní herold", title_zh: "宫廷传令官", xpRequired: 7790 },
  { level: 21, title: "Royal Cartographer", title_cz: "Královský kartograf", title_zh: "皇家制图师", xpRequired: 8430 },
  { level: 22, title: "Keeper of Secrets", title_cz: "Strážce tajemství", title_zh: "秘密守护者", xpRequired: 9100 },
  { level: 23, title: "Bridge Sentinel", title_cz: "Strážný mostu", title_zh: "桥梁哨兵", xpRequired: 9780 },
  { level: 24, title: "Castellan's Squire", title_cz: "Panoš kastelána", title_zh: "城堡总管的侍从", xpRequired: 10470 },
  { level: 25, title: "Hradčany Vanguard", title_cz: "Hradčanský předvoj", title_zh: "赫拉德恰尼先锋", xpRequired: 11190 },
  { level: 26, title: "Master Alchemist", title_cz: "Mistr alchymista", title_zh: "炼金术大师", xpRequired: 11920 },
  { level: 27, title: "Tournament Champion", title_cz: "Vítěz turnaje", title_zh: "比武冠军", xpRequired: 12660 },
  { level: 28, title: "Medieval Duelist", title_cz: "Středověký duelant", title_zh: "中世纪决斗士", xpRequired: 13430 },
  { level: 29, title: "Conqueror of the Vltava", title_cz: "Dobyvatel Vltavy", title_zh: "伏尔塔瓦征服者", xpRequired: 14210 },
  { level: 30, title: "Charles Bridge Watchman", title_cz: "Strážce Karlova mostu", title_zh: "查理大桥守望者", xpRequired: 15000 },
  { level: 31, title: "Silver Knight", title_cz: "Stříbrný rytíř", title_zh: "银骑士", xpRequired: 15750 },
  { level: 32, title: "Prague Paladin", title_cz: "Pražský paladin", title_zh: "布拉格圣骑士", xpRequired: 16510 },
  { level: 33, title: "Knight of the Golden Lane", title_cz: "Rytíř Zlaté uličky", title_zh: "黄金巷骑士", xpRequired: 17270 },
  { level: 34, title: "Castellan of Hradčany", title_cz: "Kastelán Hradčan", title_zh: "赫拉德恰尼城堡总管", xpRequired: 18040 },
  { level: 35, title: "Seneschal of Vyšehrad", title_cz: "Senešal Vyšehradu", title_zh: "维谢赫拉德总管", xpRequired: 18810 },
  { level: 36, title: "Warden of the Old Town", title_cz: "Strážce Starého Města", title_zh: "旧城守护官", xpRequired: 19590 },
  { level: 37, title: "Reeve of Nové Město", title_cz: "Rychtář Nového Města", title_zh: "新城执行官", xpRequired: 20370 },
  { level: 38, title: "Bailiff of the Realm", title_cz: "Zemský fojt", title_zh: "王国执法官", xpRequired: 21160 },
  { level: 39, title: "Court Chronicler", title_cz: "Dvorní kronikář", title_zh: "宫廷编年史家", xpRequired: 21960 },
  { level: 40, title: "Royal Chamberlain", title_cz: "Královský komoří", title_zh: "皇室内侍", xpRequired: 22760 },
  { level: 41, title: "Baron of the Vltava", title_cz: "Baron Vltavy", title_zh: "伏尔塔瓦男爵", xpRequired: 23570 },
  { level: 42, title: "Viscount of Malá Strana", title_cz: "Vikomt Malé Strany", title_zh: "小城子爵", xpRequired: 24380 },
  { level: 43, title: "Count of Bohemia", title_cz: "Hrabě český", title_zh: "波希米亚伯爵", xpRequired: 25200 },
  { level: 44, title: "Count Palatine", title_cz: "Falckrabě", title_zh: "巴拉丁伯爵", xpRequired: 26020 },
  { level: 45, title: "Marquess of Vyšehrad", title_cz: "Markýz Vyšehradu", title_zh: "维谢赫拉德侯爵", xpRequired: 26850 },
  { level: 46, title: "Margrave of Moravia", title_cz: "Markrabě moravský", title_zh: "摩拉维亚藩侯", xpRequired: 27690 },
  { level: 47, title: "Landgrave of Karlštejn", title_cz: "Lankrabě karlštejnský", title_zh: "卡尔什特因伯爵", xpRequired: 28530 },
  { level: 48, title: "Burgrave of the Castle", title_cz: "Purkrabí hradu", title_zh: "城堡总督", xpRequired: 29380 },
  { level: 49, title: "Duke of Malá Strana", title_cz: "Vévoda Malé Strany", title_zh: "小城公爵", xpRequired: 30230 },
  { level: 50, title: "Archduke of Prague", title_cz: "Arcivévoda Prahy", title_zh: "布拉格大公", xpRequired: 31090 },
  { level: 51, title: "Grand Elector", title_cz: "Velký kurfiřt", title_zh: "大选帝侯", xpRequired: 31960 },
  { level: 52, title: "Prince of Bohemia", title_cz: "Kníže Čech", title_zh: "波希米亚王子", xpRequired: 32830 },
  { level: 53, title: "Crown Prince of the Realm", title_cz: "Korunní princ království", title_zh: "王国王储", xpRequired: 33710 },
  { level: 54, title: "King of the Vltava", title_cz: "Král Vltavy", title_zh: "伏尔塔瓦之王", xpRequired: 34590 },
  { level: 55, title: "High King of Bohemia", title_cz: "Nejvyšší král český", title_zh: "波希米亚至尊王", xpRequired: 35480 },
  { level: 56, title: "Holy Roman Emperor", title_cz: "Svatý římský císař", title_zh: "神圣罗马皇帝", xpRequired: 36370 },
  { level: 57, title: "Immortal Wanderer", title_cz: "Nesmrtelný poutník", title_zh: "不朽旅人", xpRequired: 37270 },
  { level: 58, title: "Eternal Watchman of Prague", title_cz: "Věčný strážce Prahy", title_zh: "布拉格永恒守望者", xpRequired: 38180 },
  { level: 59, title: "Mythic Sovereign", title_cz: "Mýtický vladař", title_zh: "神话君主", xpRequired: 39090 },
  { level: 60, title: "Prague Legend", title_cz: "Pražská legenda", title_zh: "布拉格传奇", xpRequired: 40000 },
];

export const ACHIEVEMENTS = [
  // First Step: Complete your very first check-in.
  {
    id: "first_step",
    name: "First Step",
    name_cz: "První krok",
    name_zh: "第一步",
    description: "Complete your very first check-in.",
    description_cz: "Dokončete svůj první check-in.",
    description_zh: "完成你的第一次打卡。",
    difficulty: "easy",
    check: ({ totalCheckins }) => totalCheckins >= 1,
  },
  // Urban Explorer: Check in to 10 locations.
  {
    id: "explorer_10",
    name: "Urban Explorer",
    name_cz: "Městský průzkumník",
    name_zh: "城市探索者",
    description: "Check in to 10 locations.",
    description_cz: "Přihlaste se na 10 míst.",
    description_zh: "打卡10个地点。",
    difficulty: "easy",
    check: ({ totalCheckins }) => totalCheckins >= 10,
  },
  // Adventurer: Check in to 25 locations.
  {
    id: "adventurer_25",
    name: "Adventurer",
    name_cz: "Dobrodruh",
    name_zh: "冒险者",
    description: "Check in to 25 locations.",
    description_cz: "Přihlaste se na 25 míst.",
    description_zh: "打卡25个地点。",
    difficulty: "medium",
    check: ({ totalCheckins }) => totalCheckins >= 25,
  },
  // Prague Century: Unlock 100 locations.
  {
    id: "century",
    name: "Prague Century",
    name_cz: "Pražské století",
    name_zh: "布拉格百景",
    description: "Unlock all 100 preset locations.",
    description_cz: "Odemkněte všech 100 přednastavených míst.",
    description_zh: "解锁100个地点卡片。",
    difficulty: "hard",
    check: ({ presetCheckins }) => presetCheckins >= 100,
  },
  // I'm the king of Prague: Check in all locations.
  {
    id: "king_of_prague",
    name: "I'm the King of Prague",
    name_cz: "Jsem král Prahy",
    name_zh: "我是布拉格之王",
    description: "Check in all locations.",
    description_cz: "Přihlaste se na všechna místa.",
    description_zh: "打卡所有地点。",
    difficulty: "hard",
    check: ({ totalCheckins, totalLocations }) =>
      totalCheckins >= totalLocations,
  },
  // History Fan: Check in to 30 historical locations.
  {
    id: "history_buff",
    name: "History Fan",
    name_cz: "Milovník historie",
    name_zh: "历史迷",
    description: "Check in to 30 historical locations.",
    description_cz: "Přihlaste se na 30 historických míst.",
    description_zh: "打卡30个历史地点。",
    difficulty: "medium",
    check: ({ historyCount }) => (historyCount || 0) >= 30,
  },
  // Leisure Seeker: Check in to 30 Entertainment and Leisure locations.
  {
    id: "leisure_seeker",
    name: "Leisure Seeker",
    name_cz: "Hledač volného času",
    name_zh: "休闲游客",
    description: "Check in to 30 Entertainment and Leisure locations.",
    description_cz: "Přihlaste se na 30 zábavních míst.",
    description_zh: "打卡30个休闲娱乐地点。",
    difficulty: "medium",
    check: ({ labelCount }) => (labelCount["restaurants-and-cafes"] || 0) + (labelCount["park"] || 0) >= 30,
  },
  // Hidden Gem Hunter: Discover 10 hidden gem locations.
  {
    id: "gem_hunter",
    name: "Hidden Gem Hunter",
    name_cz: "Lovec skrytých klenotů",
    name_zh: "隐藏宝藏猎人",
    description: "Discover 5 hidden gem locations.",
    description_cz: "Objevte 10 míst skrytých klenotů.",
    description_zh: "发现10个隐藏宝藏地点。",
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount["hidden-gem"] || 0) >= 10,
  },
  //Castle Conqueror: Check in to Prague Castle
  {
    id: "castle_conqueror",
    name: "Castle Conqueror",
    name_cz: "Dobyvatel hradu",
    name_zh: "城堡征服者",
    description: "Check in to St. Vitus Cathedral.",
    description_cz: "Přihlaste se ke katedrále sv. Víta.",
    description_zh: "打卡圣维特大教堂。",
    difficulty: "easy",
    check: ({ checkedSlugs }) => checkedSlugs.includes("st-vitus-cathedral"),
  },
  //Veni, vidi, vici: Check in all locations having the "landmark" label
  {
    id: "veni_vidi_vici",
    name: "Veni, Vidi, Vici",
    name_cz: "Přišel, viděl, zvítězil",
    name_zh: "我来，我见，我征服",
    description: 'Check in all locations having the "landmark" label.',
    description_cz: 'Přihlaste se na všechna místa s označením "landmark".',
    description_zh: "打卡所有带有“地标”标签的地点。",
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount["landmark"] || 0) == 14,
  },
  //Subway Maniac: take prague metro, arrive and check in all terminal stations of 3 lines :"Nemocnice Motol", "Depo Hostivař", "Haje", "Letbnany", "Cerny Most", "Zlicin"
  {
    id: "subway_maniac",
    name: "Subway Maniac",
    name_cz: "Metró maniak",
    name_zh: "地铁狂人",
    description:
      'Take Prague metro, arrive and check in all terminal stations of 3 lines: "Nemocnice Motol", "Depo Hostivař", "Háje", "Letňany", "Černý Most", "Zličín".',
    description_cz:
      'Vezměte pražské metro, dorazte a přihlaste se na všechna koncová stanoviště 3 linek: "Nemocnice Motol", "Depo Hostivař", "Háje", "Letňany", "Černý Most", "Zličín".',
    description_zh:
      '乘坐布拉格地铁，抵达并打卡3条线路的所有终点站："Nemocnice Motol"、"Depo Hostivař"、"Háje"、"Letňany"、"Černý Most"、"Zličín"。',
    difficulty: "hard",
    check: ({ checkedSlugs }) =>
      [
        "nemocnice-motol",
        "depo-hostivar",
        "haje",
        "letnany",
        "cerny-most",
        "zlicin",
      ].every((slug) => checkedSlugs.includes(slug)),
  },
  //Why are there no penguins in southern pole? : check in the card slugged "jizni-pol-prahy"
  {
    id: "southern-pole",
    name: "Why are there no penguins in southern pole?",
    name_cz: "Proč nejsou tučňáci na jižním pólu?",
    name_zh: "为什么南极没有企鹅？",
    description: "Check in Jižní pól Prahy.",
    description_cz: "Přihlaste se na Jižní pól Prahy.",
    description_zh: "打卡布拉格南极",
    difficulty: "medium",
    check: ({ checkedSlugs }) => checkedSlugs.includes("jizni-pol-prahy"),
  },
  //Bridge Collector: Check in 10 locations having the “bridge” label
  {
    id: "bridge_collector",
    name: "Bridge Collector",
    name_cz: "Sbírka mostů",
    name_zh: "桥梁收藏家",
    description: 'Check in 10 locations having the “bridge” label.',
    description_cz: 'Přihlaste se na 10 míst s označením “bridge”.',
    description_zh: "打卡10个带有“桥梁”标签的地点。",
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount["bridge"] || 0) >= 10,
  },
  //Artist: Check in 20 locations having the “culture and art” label
  {
    id: "artist",
    name: "Artist",
    name_cz: "Umělec",
    name_zh: "艺术家",
    description: 'Check in 20 locations having the “cultural” label.',
    description_cz: 'Přihlaste se na 20 míst s označením “cultural”.',
    description_zh: '打卡20个带有”文化与艺术”标签的地点。',
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount["cultural"] || 0) >= 20,
  },
  //church passionate: check in 50 locations having the “church” label
  {
    id: "church_passionate",
    name: "Church Passionate",
    name_cz: "Nadšenec kostelů",
    name_zh: "教堂爱好者",
    description: 'Check in 50 locations having the “church” label.',
    description_cz: 'Přihlaste se na 50 míst s označením “church”.',
    description_zh: '打卡50个带有”教堂”标签的地点。',
    difficulty: "hard",
    check: ({ labelCount }) => (labelCount["church"] || 0) >= 50,
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

export function evaluateAchievements(stats, existingIds) {
  const newlyUnlocked = [];
  for (const ach of ACHIEVEMENTS) {
    if (existingIds.includes(ach.id)) continue;
    if (ach.check(stats))
      newlyUnlocked.push({ id: ach.id, unlockedAt: new Date() });
  }
  return newlyUnlocked;
}
