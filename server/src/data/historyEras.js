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
    key: 'kingdom-golden-age',
    order: 3,
    themeClass: 'era-kingdom-golden-age',
    hasContent: true,
    title: {
      en: "The Kingdom's Golden Age",
      cz: 'Zlatý věk království',
      zh: '王国的黄金时代',
    },
    yearRange: {
      en: '1199–1378',
      cz: '1199–1378',
      zh: '1199年－1378年',
    },
    tagline: {
      en: "The one stretch where nearly everything Bohemia built is still standing — try not to get used to it.",
      cz: "Ten jeden úsek, kdy skoro všechno, co Čechy postavily, ještě stále stojí — na to si radši nezvykejte.",
      zh: "波希米亚建的东西，罕见地大部分都保留至今——可别太习惯了。",
    },
  },
  {
    key: 'religious-turmoil',
    order: 4,
    themeClass: 'era-religious-turmoil',
    hasContent: false,
    title: {
      en: 'Religious Turmoil',
      cz: 'Doba náboženských bouří',
      zh: '宗教动荡期',
    },
    tagline: {
      en: "Several centuries of Bohemia discovering new and creative ways to throw people out of windows.",
      cz: "Několik století, během nichž Čechy objevovaly nové a tvůrčí způsoby, jak někoho vyhodit z okna.",
      zh: "波希米亚花了好几个世纪，不断发明把人从窗户扔出去的新花样。",
    },
  },
  {
    key: 'renaissance-baroque',
    order: 5,
    themeClass: 'era-renaissance-baroque',
    hasContent: false,
    title: {
      en: 'Renaissance & Baroque',
      cz: 'Renesance a baroko',
      zh: '文艺复兴与巴洛克',
    },
    tagline: {
      en: "Prague gets rebuilt in gold leaf and guilt, twice, mostly by people who weren't from here.",
      cz: "Praha se nechává přestavět ve zlaté fólii a pocitu viny, a to dvakrát, většinou lidmi, kteří odsud nebyli.",
      zh: "布拉格被外来者用金箔和愧疚感重建了两次。",
    },
  },
  {
    key: 'revival-independence',
    order: 6,
    themeClass: 'era-revival-independence',
    hasContent: false,
    title: {
      en: 'National Revival & Independence',
      cz: 'Národní obrození a nezávislost',
      zh: '民族复兴与独立',
    },
    tagline: {
      en: "Bohemia remembers it's a nation, writes several very long operas about it, and eventually gets a country out of the deal.",
      cz: "Čechy si vzpomenou, že jsou národ, složí o tom několik pořádně dlouhých oper, a nakonec z toho vzejde i vlastní stát.",
      zh: "波希米亚突然想起自己是个民族，为此写了好几部超长的歌剧，最后还真换来了一个国家。",
    },
  },
  {
    key: '20th-century-upheaval',
    order: 7,
    themeClass: 'era-20th-century-upheaval',
    hasContent: false,
    title: {
      en: '20th Century Upheaval',
      cz: 'Bouřlivé 20. století',
      zh: '20世纪动荡',
    },
    tagline: {
      en: "The twentieth century, delivered in full: occupation, tanks, secret police, and one remarkably polite revolution.",
      cz: "Dvacáté století v plné síle: okupace, tanky, tajná policie a jedna nápadně slušná revoluce.",
      zh: "整整一个二十世纪：占领、坦克、秘密警察，外加一场出奇有礼貌的革命。",
    },
  },
];
