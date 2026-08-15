// Static definition of the six History Timeline eras — deliberately not a DB
// collection, same reasoning as RARITY_XP in rarityMap.js: this is a small,
// rarely-changing enum that's cheap to keep as code. `order` drives the
// left-to-right sequence on the timeline; `themeClass` is applied to the
// timeline track's era segment so client/src/styles/history.css can theme
// each era (background gradient, accent colour) with plain CSS — no extra
// art assets. `hasContent` lets the frontend show a "coming soon" segment
// for eras that don't have seeded HistoryEvent docs yet, without needing a
// live query just to know that — Era 1 is the only one built out for now,
// see server/src/data/seedHistoryEvents.js.
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
  },
  {
    key: 'medieval-golden-age',
    order: 2,
    themeClass: 'era-medieval-golden-age',
    hasContent: false,
    title: {
      en: 'Medieval Golden Age',
      cz: 'Středověký zlatý věk',
      zh: '中世纪黄金时代',
    },
  },
  {
    key: 'religious-turmoil',
    order: 3,
    themeClass: 'era-religious-turmoil',
    hasContent: false,
    title: {
      en: 'Religious Turmoil',
      cz: 'Doba náboženských bouří',
      zh: '宗教动荡期',
    },
  },
  {
    key: 'renaissance-baroque',
    order: 4,
    themeClass: 'era-renaissance-baroque',
    hasContent: false,
    title: {
      en: 'Renaissance & Baroque',
      cz: 'Renesance a baroko',
      zh: '文艺复兴与巴洛克',
    },
  },
  {
    key: 'revival-independence',
    order: 5,
    themeClass: 'era-revival-independence',
    hasContent: false,
    title: {
      en: 'National Revival & Independence',
      cz: 'Národní obrození a nezávislost',
      zh: '民族复兴与独立',
    },
  },
  {
    key: '20th-century-upheaval',
    order: 6,
    themeClass: 'era-20th-century-upheaval',
    hasContent: false,
    title: {
      en: '20th Century Upheaval',
      cz: 'Bouřlivé 20. století',
      zh: '20世纪动荡',
    },
  },
];
