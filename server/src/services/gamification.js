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
    current: Math.min(n || 0, SAINT_TARGET),
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
// A share of one quarter's cards (The Manchester of Prague: half of Smíchov).
const quarterShare = (quarter, share) => ({ quarterCount = {}, quarterTotal = {} }) => ({
  current: quarterCount[quarter] || 0,
  target: Math.max(1, Math.ceil((quarterTotal[quarter] || 0) * share)),
});

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
    progress: ({ totalCheckins }) => ({ current: Math.min(totalCheckins || 0, 1), target: 1 }),
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
    difficulty: "medium",
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
    progress: ({ huntTenX }) => ({ current: Math.min(huntTenX || 0, 1), target: 1 }),
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
    difficulty: "hard",
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
    progress: ({ expeditionCheckins }) => ({ current: Math.min(expeditionCheckins || 0, 1), target: 1 }),
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
    difficulty: "medium",
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
    difficulty: "hard",
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
    difficulty: "medium",
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
    difficulty: "medium",
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
    difficulty: "medium",
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
    difficulty: "medium",
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
    difficulty: "medium",
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
    difficulty: "extreme",
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
    progress: ({ earlyBird }) => ({ current: Math.min(earlyBird || 0, 1), target: 1 }),
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
    difficulty: "hard",
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
    difficulty: "medium",
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
    progress: ({ huntComeback }) => ({ current: Math.min(huntComeback || 0, 1), target: 1 }),
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
    difficulty: "medium",
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
    difficulty: "hard",
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
    difficulty: "medium",
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
    difficulty: "medium",
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
    description: "Collect half of the cards in Smíchov.",
    description_cz: "Sesbírejte polovinu karet na Smíchově.",
    description_zh: "收集斯米霍夫一半的卡片。",
    difficulty: "medium",
    check: (stats) => done(quarterShare("Smíchov", 0.5)(stats)),
    progress: quarterShare("Smíchov", 0.5),
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
export function describeAchievement({ id, unlockedAt }) {
  const a = ACHIEVEMENTS.find((x) => x.id === id);
  if (!a) return { id, unlockedAt };
  return {
    id, unlockedAt, icon: a.icon,
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
