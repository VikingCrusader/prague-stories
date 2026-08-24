// Static definition of the seven History Timeline eras — deliberately not a
// DB collection, same reasoning as RARITY_XP in rarityMap.js: this is a
// small, rarely-changing enum that's cheap to keep as code. `order` is
// documentation only — the frontend (HistorySidebar) renders eras by simply
// iterating this array in declaration order, it does not sort by `order`,
// so the array's own position IS the effective sequence; keep them in sync.
// `themeClass` is applied to the timeline track's era segment so
// client/src/styles/history.css can theme each era (background gradient,
// accent colour) with plain CSS — no extra art assets. `hasContent` lets the
// frontend show a "coming soon" segment for eras that don't have seeded
// HistoryEvent docs yet, without needing a live query just to know that.
// `tagline` is a one-line, in-voice joke summarizing the era, rendered on
// HistoryEraDivider — the banner HistoryPage's feed shows at each era
// boundary (see client/src/components/history/HistoryEraDivider.jsx). Only
// eras 1–2 have that banner actually appear today, since the other five have
// no events to precede it, but every era gets a tagline up front so nothing
// needs writing later when its events finally land.
//
// Eras 1 and 2 (legends-origins, bohemian-duchy) are built out — see
// server/src/data/seedHistoryEvents.js. Era 1 originally ran all the way to
// Wenceslas's murder (935), but that meant purely-legendary content
// (Libuše, Přemysl, seven unverifiable dukes) and documented-history content
// (Bořivoj onward, real sources, real dates) shared one heading, blurring a
// distinction the whole point of the timeline is to make legible. Split
// 2026-08: Era 1 now ends at 800 (last of the legendary dukes), and
// everything from Bořivoj (870, the first documented duke) through Otakar I
// securing a hereditary crown (1198/1212) became its own era, 2.
//
// Era 3/4 split (2026-08-23): what used to be one era, 'kingdom-golden-age'
// spanning 1199-1378, got split into two on the user's own observation that
// "Bohemia's golden age" in actual historiography means Charles IV's reign
// specifically (1346-1378: Prague as imperial capital, Charles University,
// St. Vitus construction, the Golden Bull) — not the 148 years before it,
// which cover Otakar II's rise-and-collapse at Marchfeld, the Wenceslas II
// guardianship crisis, the 1306 Přemyslid extinction, and John of
// Luxembourg's own reign (1310-1346), a "wandering king" rarely in Bohemia
// and famous for mortgaging crown lands, not building a golden age — he
// reads, in retrospect, as spending his whole reign banking the political
// capital his son Charles cashed in in 1346, the same father-sets-up-son
// pattern this timeline's own 'the-crown-he-didnt-win-1254' arc already
// used once before, just with vastly higher stakes. 'kingdom-golden-age'
// keeps its key and now refers ONLY to 1346-1378; the new era,
// 'rise-of-a-kingdom', takes over 1199-1345 (all ~32 previously-seeded
// events under the old single era got migrated to this new key, since none
// of them post-date 1345 — verified via startYear before migrating).
//
// Era 5/6 split (2026-08-24, decided before any content existed for either —
// no migration needed, unlike the Era 3/4 split above): 'religious-turmoil'
// originally had no yearRange set at all and its tagline's plural "new and
// creative ways to throw people out of windows" implied it would cover both
// the First (1419) and Second (1618) Defenestrations of Prague — a ~240-year
// span, longer than the one that already triggered the Era 3/4 split above.
// Split at 1526 (Ferdinand I's accession, the start of Habsburg rule over
// Bohemia): 'religious-turmoil' now covers only 1378-1526 (the Great Schism,
// Hus, the First Defenestration, the Hussite Wars, the Basel Compacts,
// George of Poděbrady, the Jagiellonian dynasty, ending at the 1485 Peace of
// Kutná Hora) — a genuinely Bohemian-internal religious civil war. The new
// era, 'habsburg-rule' (1526-1620), covers the tense, superficially calm
// interval between the new Catholic Habsburg dynasty and Bohemia's Protestant
// nobility, ending at the Second Defenestration (1618) and the Battle of
// White Mountain (1620). Deliberately NOT named after a monarch (matching
// the 'kingdom-golden-age' precedent, which was reverted from a
// Charles-IV-specific title back to a thematic one) — but the user explicitly
// confirmed 'Habsburg Rule' itself is fine as a title despite naming a
// dynasty, since Habsburg rule continues for centuries after 1620 too: era
// titles describe each chapter's own narrative focus, not the full span of
// every fact that remains true afterward — later eras (Renaissance & Baroque,
// National Revival) simply pivot focus elsewhere while Habsburg rule
// continues unremarked in the background. The two taglines were written as a
// matched pair: era 5's now sets up "a new local tradition" (defenestration)
// that era 6's pays off as "one memorable encore" — don't edit one without
// checking the other still lands.
//
// Era 7/8 follow-up (2026-08-24, same session as the Era 5/6 split above):
// the user asked for the 1618-1689 stretch (Second Defenestration through
// the Great Fire of Prague) to become its own era too, rather than folding
// into 'habsburg-rule' or 'renaissance-baroque'. Fix: 'habsburg-rule' pulled
// back in from 1620 to 1618 (ending right at the Second Defenestration
// itself, the exact beat its own tagline's "one memorable encore" already
// pointed to), and a new era, originally 'thirty-years-war' — renamed to
// 'fire-and-ashes' (see the note below) — (order 7, 1618-1689), takes
// the war itself, White Mountain (1620), and the ~40-year gap after the
// Peace of Westphalia (1648) up to the 1689 fire. Rudolf II's Renaissance
// court (1583-1612) stays inside 'habsburg-rule' on the user's own call, even
// though it doesn't perfectly match that era's political-tension framing —
// simpler than carving out yet another era for one court's cultural output.
//
// This forced a rename of the old 'renaissance-baroque' (order 8, now
// 'age-of-absolutism'): with Rudolf II's Renaissance content staying in
// 'habsburg-rule', this era no longer covers two rebuilding waves (its old
// tagline said "rebuilt... twice") — just the post-1689 Baroque one, plus
// Habsburg absolutist consolidation (Maria Theresa 1740-1780, Joseph II's
// Enlightened-absolutism reforms 1780-1790: the Patent of Toleration, the
// abolition of serfdom). yearRange set to 1689-1790, ending at Joseph II's
// death — a clean bridge into 'revival-industrialization' next. Deliberately
// NOT named after the Czech historiographical term "Temno" ("the Dark Age"),
// which the user explicitly flagged as inappropriate for a title: that term
// was coined by 19th-century National Revival-era historians (via Alois
// Jirásek's novel of the same name) specifically to cast this period as
// bleak so the Revival's own "awakening" would read as more necessary and
// heroic by contrast — a loaded, retrospective nationalist framing, not a
// neutral description, and this period actually saw real Baroque cultural
// flourishing. 'Age of Absolutism' was the user's own pick, matching the
// period name used in Europa Universalis IV — plain, period-accurate,
// no value judgment baked in.
//
// Same session, one more rename: 'revival-independence' (order 9) became
// 'revival-industrialization', title "National Revival & Industrialization"
// — "Independence" described only the single event that ends the era
// (1918), not the 128-year throughline; industrialization (Bohemia was one
// of the Austro-Hungarian Empire's most industrialized regions through the
// 19th century) is the actual sustained content. 1918 independence is still
// exactly where the era's content ends — it's just not named in the title,
// same as 'kingdom-golden-age' doesn't name Charles IV's 1378 death. Key
// renamed too (nothing referenced the old key yet — zero seeded content, a
// free rename), yearRange set to 1790–1918.
//
// Era 10 split into three (2026-08-24, same session): the user's own call —
// the 20th century has far denser, far better-documented source material
// than any earlier era, so one single 'hasContent: false' placeholder
// ('20th-century-upheaval') wasn't going to hold up once real content
// started landing. Replaced with three eras:
// - 'brief-independence' (order 10, 1918-1938): the First Republic —
//   interwar Czechoslovakia's real, functioning democracy, ending at the
//   1938 Munich Agreement.
// - 'nazi-nightmare' (order 11, 1938-1945): Munich through the Protectorate
//   of Bohemia and Moravia, forced armaments production (Škoda, ČKD) for
//   the German war machine, Heydrich's rule and Operation Anthropoid, to
//   liberation in 1945. Deliberately solemn tagline, no joke — matching the
//   existing project convention for atrocity-heavy content (see
//   feedback_solemn_content_tone in memory) extended here to a whole era's
//   tagline for the first time, not just one HistoryEvent card.
// - 'cold-war-sorrow' (order 12, 1946-1992): Communist Czechoslovakia,
//   1968 and the Soviet invasion, to the Velvet Revolution (1989) and the
//   dissolution process that ends the unified state. Its tagline reuses and
//   narrows the old '20th-century-upheaval' tagline's "tanks... secret
//   police... one remarkably polite revolution" line almost verbatim — that
//   joke belonged here specifically, not to the whole century, so it moved
//   rather than getting rewritten from scratch.
// Titles/CZ went through several rounds before landing: the user first asked
// for 1938-1945 to read as "Fear Under Nazi Occupation," then wanted "fear"
// swapped for a more literary word (chose "nightmare"/梦魇 from several
// offered alternatives), then simplified the whole title down to just "The
// Nazi Nightmare" (纳粹梦魇) — don't assume the first framing offered is
// the one that sticks; this took three iterations.
//
// Final era added (2026-08-24, same session): 'freedom-and-prosperity'
// (order 13) — the Velvet Divorce and everything since (NATO/EU accession,
// the post-Communist recovery). Tone returns to the earlier-era wry-but-light
// register (see feedback_20th_century_tone in memory) rather than staying
// restrained — this era is genuinely about stability and prosperity, not
// more repression to write carefully around.
//
// Boundary correction, same session: the user initially asked for this era
// to start at 1993 (the Velvet Divorce itself), but caught their own
// conflation of the Velvet Revolution (Nov 1989, Communism falls — ends
// 'cold-war-sorrow') with the Velvet Divorce (1 Jan 1993, Czechoslovakia
// splits in two — a 'freedom-and-prosperity' event). Corrected: 'cold-war-
// sorrow' now ends at 1989 (not 1992), and 'freedom-and-prosperity' now
// starts at 1990 (not 1993) — its opening beat is the messy 1990-1992
// post-Communist transition (new social/economic problems surfacing once
// one-party rule was gone) that leads *into* the 1993 split, not the split
// itself as a cold open. Tagline rewritten to match: "Communism falls...
// solving one of them, eventually, by splitting into two countries."
//
// Rename (2026-08-24, same session, later): 'thirty-years-war' became
// 'fire-and-ashes'. An outside review (a second Claude instance, run by the
// user against this file) correctly flagged that a title literally named
// "The Thirty Years' War" covering 1618-1689 conflicts with that war's own
// internationally-recognized end date, the 1648 Peace of Westphalia — a
// title THIS specific, tied to a date THAT well-known, reads as an error to
// anyone who knows the history, even though the 1618-1689 range itself was
// a deliberate, already-discussed choice (see the note above: the user
// explicitly chose "The Thirty Years' War" over an offered "War and Its
// Aftermath" alternative, precisely trading off precision for brevity).
// Rather than reopening the year-range question, the fix was a title that
// sidesteps needing to match a famous date at all: 'Fire and Ashes' (战火与
// 灰烬) — "fire" doing double duty for both the war itself and the literal
// 1689 Great Fire of Prague that closes the era, "ashes" for the
// devastation left behind. No year-range change needed once the title no
// longer promises to be *the* Thirty Years' War specifically.
export const HISTORY_ERAS = [
  {
    key: 'legends-origins',
    order: 1,
    themeClass: 'era-legends-origins',
    hasContent: true,
    title: {
      en: 'Legends & Origins',
      cz: 'Legendy a počátky',
      zh: '传说与起源',
    },
    yearRange: {
      en: 'Prehistory – 800',
      cz: 'Pravěk – 800',
      zh: '史前 – 800年',
    },
    tagline: {
      en: "Where the sourcing is shaky, the drama is not — and at least one of these dukes may never have existed at all.",
      cz: "Kde jsou prameny vratké, drama rozhodně ne — a přinejmenším jedno z těchhle knížat možná nikdy neexistovalo.",
      zh: "史料摇摇欲坠，戏剧性却毫不含糊——这些公爵里，至少有一位很可能压根就没存在过。",
    },
  },
  {
    key: 'bohemian-duchy',
    order: 2,
    themeClass: 'era-bohemian-duchy',
    hasContent: true,
    title: {
      en: 'Duchy of Bohemia',
      cz: 'České knížectví',
      zh: '波希米亚公国',
    },
    yearRange: {
      en: '870–1198',
      cz: '870–1198',
      zh: '870年－1198年',
    },
    tagline: {
      en: "Real names, real dates, and remarkably little improvement in how this family settles an argument.",
      cz: "Skutečná jména, skutečná data — a překvapivě žádné zlepšení v tom, jak si tahle rodina řeší spory.",
      zh: "有了真实的姓名和真实的年代——可这个家族解决分歧的方式，却丝毫没有长进。",
    },
  },
  {
    key: 'rise-of-a-kingdom',
    order: 3,
    themeClass: 'era-rise-of-a-kingdom',
    hasContent: true,
    title: {
      en: 'The Rise of a Kingdom',
      cz: 'Vzestup království',
      zh: '王国风云',
    },
    yearRange: {
      en: '1199–1345',
      cz: '1199–1345',
      zh: '1199年－1345年',
    },
    tagline: {
      en: "Three dynasties, one battlefield death after another, and a blind king who spends his whole reign setting up his son's punchline.",
      cz: "Tři dynastie, jedna smrt na bojišti za druhou, a slepý král, který celou svou vládu stráví přípravou vtipu, jehož pointu pronese až jeho syn.",
      zh: "三个王朝更迭，一次接一次地战死沙场，还有一位失明的国王——耗尽整个统治期，只为给儿子的黄金时代当垫脚石。",
    },
  },
  {
    key: 'kingdom-golden-age',
    order: 4,
    themeClass: 'era-kingdom-golden-age',
    hasContent: false,
    title: {
      en: 'The Golden Age',
      cz: 'Zlatý věk',
      zh: '黄金时代',
    },
    yearRange: {
      en: '1346–1378',
      cz: '1346–1378',
      zh: '1346年－1378年',
    },
    tagline: {
      en: "The one stretch where nearly everything Bohemia built is still standing — try not to get used to it.",
      cz: "Ten jeden úsek, kdy skoro všechno, co Čechy postavily, ještě stále stojí — na to si radši nezvykejte.",
      zh: "波希米亚建的东西，罕见地大部分都保留至今——可别太习惯了。",
    },
  },
  {
    key: 'religious-turmoil',
    order: 5,
    themeClass: 'era-religious-turmoil',
    hasContent: false,
    title: {
      en: 'Religious Turmoil',
      cz: 'Doba náboženských bouří',
      zh: '宗教动荡期',
    },
    yearRange: {
      en: '1378–1526',
      cz: '1378–1526',
      zh: '1378年－1526年',
    },
    tagline: {
      en: "The Church splits in two, Jan Hus goes to the stake, and Bohemia responds by founding a new local tradition: city officials, out a window.",
      cz: "Církev se rozštěpí vedví, Jan Hus skončí na hranici, a Čechy na to zareagují založením nové místní tradice: vyhazovat radní z oken.",
      zh: "教会一分为二，扬·胡斯被烧死在火刑柱上，波希米亚的回应是开创了一项地方新传统：把市政官员扔出窗外。",
    },
  },
  {
    key: 'habsburg-rule',
    order: 6,
    themeClass: 'era-habsburg-rule',
    hasContent: false,
    title: {
      en: 'Habsburg Rule',
      cz: 'Habsburská vláda',
      zh: '哈布斯堡统治',
    },
    yearRange: {
      en: '1526–1618',
      cz: '1526–1618',
      zh: '1526年－1618年',
    },
    tagline: {
      en: "A century of borrowed calm under a new royal house — until the tradition from the last chapter gets one memorable encore.",
      cz: "Století vypůjčeného klidu pod novým královským rodem — než tradice z minulé kapitoly zažije jeden nezapomenutelný přídavek.",
      zh: "在新王朝治下，波希米亚借来了将近一个世纪的平静——直到上一章那项传统，迎来了一次令人难忘的加演。",
    },
  },
  {
    key: 'fire-and-ashes',
    order: 7,
    themeClass: 'era-fire-and-ashes',
    hasContent: false,
    title: {
      en: 'Fire and Ashes',
      cz: 'Oheň a popel',
      zh: '战火与灰烬',
    },
    yearRange: {
      en: '1618–1689',
      cz: '1618–1689',
      zh: '1618年－1689年',
    },
    tagline: {
      en: "White Mountain ends Bohemian self-rule in a single afternoon — the war grinds on for another twenty-eight years without it, and Prague barely catches its breath before catching fire.",
      cz: "Bílá hora ukončí českou samosprávu za jediné odpoledne — válka bez ní táhne dál ještě osmadvacet let, a Praha si sotva stačí oddechnout, než chytne.",
      zh: "白山一役，一个下午就终结了波希米亚的自治——战争在那之后又拖了二十八年，布拉格才刚喘口气，就又着了火。",
    },
  },
  {
    key: 'age-of-absolutism',
    order: 8,
    themeClass: 'era-age-of-absolutism',
    hasContent: false,
    title: {
      en: 'Age of Absolutism',
      cz: 'Doba absolutismu',
      zh: '专制主义时代',
    },
    yearRange: {
      en: '1689–1790',
      cz: '1689–1790',
      zh: '1689年－1790年',
    },
    tagline: {
      en: "A century of absolute monarchs, rebuilt Baroque skylines, and reforms handed down from Vienna whether Bohemia asked for them or not.",
      cz: "Století absolutních panovníků, přestavěných barokních panoramat a reforem seslaných z Vídně, ať už si o ně Čechy řekly, nebo ne.",
      zh: "一个世纪的绝对君主、重建的巴洛克天际线，以及从维也纳一路发号施令下来的改革——不管波希米亚乐不乐意。",
    },
  },
  {
    key: 'revival-industrialization',
    order: 9,
    themeClass: 'era-revival-industrialization',
    hasContent: false,
    title: {
      en: 'National Revival & Industrialization',
      cz: 'Národní obrození a industrializace',
      zh: '民族复兴与工业化',
    },
    yearRange: {
      en: '1790–1918',
      cz: '1790–1918',
      zh: '1790年－1918年',
    },
    tagline: {
      en: "Bohemia remembers it's a nation, industrializes faster than most of its neighbors, writes several very long operas about the whole thing, and eventually gets a country out of the deal.",
      cz: "Čechy si vzpomenou, že jsou národ, industrializují se rychleji než většina sousedů, složí o tom všem několik pořádně dlouhých oper, a nakonec z toho vzejde i vlastní stát.",
      zh: "波希米亚突然想起自己是个民族，工业化速度比大多数邻居都快，为这一切写了好几部超长的歌剧，最后还真换来了一个国家。",
    },
  },
  {
    key: 'brief-independence',
    order: 10,
    themeClass: 'era-brief-independence',
    hasContent: false,
    title: {
      en: 'Brief Independence and Democracy',
      cz: 'Krátká nezávislost a demokracie',
      zh: '短暂的独立与民主',
    },
    yearRange: {
      en: '1918–1938',
      cz: '1918–1938',
      zh: '1918年－1938年',
    },
    tagline: {
      en: "Czechoslovakia builds one of interwar Europe's few real democracies — and watches its own allies hand it over to appease the neighbor next door.",
      cz: "Československo si vybuduje jednu z mála skutečných demokracií meziválečné Evropy — a sleduje, jak ho vlastní spojenci vydají, aby usmířili souseda za humny.",
      zh: "捷克斯洛伐克建起了两战之间的欧洲少有的真正民主国家——却眼睁睁看着自己的盟友把它双手奉上，去讨好隔壁那个邻居。",
    },
  },
  {
    key: 'nazi-nightmare',
    order: 11,
    themeClass: 'era-nazi-nightmare',
    hasContent: false,
    title: {
      en: 'The Nazi Nightmare',
      cz: 'Nacistická noční můra',
      zh: '纳粹梦魇',
    },
    yearRange: {
      en: '1938–1945',
      cz: '1938–1945',
      zh: '1938年－1945年',
    },
    tagline: {
      en: "Six years under occupation — the Czech lands forced to arm the war machine tearing Europe apart, and terrorized worst of all under the man Prague came to know as its butcher.",
      cz: "Šest let okupace — české země donucené vyzbrojovat válečný stroj, který trhal Evropu na kusy, a nejhůř terorizované za vlády muže, kterého Praha znala jako svého řezníka.",
      zh: "六年占领——波希米亚被迫为那台正在把欧洲撕碎的战争机器打造武器，而恐怖统治的顶点，落在了那个被布拉格称为“屠夫”的人手里。",
    },
  },
  {
    key: 'cold-war-sorrow',
    order: 12,
    themeClass: 'era-cold-war-sorrow',
    hasContent: false,
    title: {
      en: "The Cold War's Sorrow",
      cz: 'Žal studené války',
      zh: '冷战之殇',
    },
    yearRange: {
      en: '1946–1989',
      cz: '1946–1989',
      zh: '1946年－1989年',
    },
    tagline: {
      en: "Forty-odd years of secret police, purges, and Soviet tanks rolling in whenever Prague gets too many ideas of its own — ending, eventually, in one remarkably polite revolution.",
      cz: "Přes čtyřicet let tajné policie, čistek a sovětských tanků, které vyrazí pokaždé, když má Praha příliš mnoho vlastních nápadů — a nakonec to všechno skončí jednou nápadně slušnou revolucí.",
      zh: "四十多年的秘密警察、政治清洗，外加每当布拉格自己的想法太多时就开进来的苏联坦克——最后，却以一场出奇有礼貌的革命收场。",
    },
  },
  {
    key: 'freedom-and-prosperity',
    order: 13,
    themeClass: 'era-freedom-and-prosperity',
    hasContent: false,
    title: {
      en: 'Freedom and Prosperity',
      cz: 'Svoboda a prosperita',
      zh: '自由与繁荣',
    },
    yearRange: {
      en: '1990–present',
      cz: '1990–dnes',
      zh: '1990年－至今',
    },
    tagline: {
      en: "Communism falls, the country solves its biggest new problem by splitting in two, and the Czech Republic spends the three decades since joining NATO and the EU — while Prague, never quite losing its old-world charm, quietly becomes one of Europe's more comfortable places to live.",
      cz: "Komunismus padne, země vyřeší svůj největší nový problém tím, že se rozdělí na dva státy, a Česká republika stráví další tři desetiletí vstupem do NATO a EU — zatímco si Praha, aniž by ztratila kus svého starobylého půvabu, tiše najde cestu mezi nejpříjemnější místa k životu v Evropě.",
      zh: "共产主义倒台，这个国家靠分成两个国家解决了自己最大的新麻烦，此后三十年，捷克共和国一路加入北约、加入欧盟，而布拉格，在保持历史古韵的同时，悄悄把自己变成了欧洲生活最舒适的角落之一。",
    },
  },
];
