// How Explore lines up its grid when there is no distance to sort by. A first
// visit decides whether someone signs up, so the first page is hand-picked:
// Prague's best-known places, every rarity among them, with the packs spread in.

// A pack at every 5th place, so all 12 are on the first page of 60.
export const PACK_EVERY = 5;

// Hand-picked and hand-ordered, four cards to each gap between packs: exactly
// the rest of the first page (48). The very first rows are the most famous.
export const FEATURED_SLUGS = [
  'charles-bridge', 'astronomical-clock', 'john-lennon-wall', 'st-vitus-cathedral',
  'dancing-house', 'old-new-synagogue-1782601630704', 'tyn-church', 'pomnik-sv-vaclava',
  'golden-lane', 'zizkov-tv-tower', 'pamatnik-jana-husa', 'national-theatre',
  'kafka-rotating-head', 'old-jewish-cemetery', 'strahov-library', 'st-nicholas-mala-strana',
  'miminka-kampa', 'powder-tower', 'kafka-statue', 'municipal-house',
  'national-museum', 'rudolfinum', 'kafka-museum', 'loreta-prague',
  'josefov', 'tynsky-dvur-ungelt', 'national-library-czech-republic', 'kino-lucerna',
  'pinkas-synagogue', 'petrin-tower', 'old-town-hall', 'quo-vadis-trabant',
  'zizkov-horse-statue', 'wallenstein-palace', 'wallenstein-garden-1783750953785', 'curajici-postavy-david-cerny',
  'strahov-monastery', 'prague-zoo', 'cathedral-cyril-methodius', 'dalibor-tower',
  'troja-chateau-garden', 'letna-park', 'heydrich-assassination-site', 'nusle-bridge',
  'praha-hlavni-nadrazi', 'novy-svet', 'emmaus-monastery-1782494564055', 'bevnov-monastery-1782583396582',
];

const FEATURED = new Set(FEATURED_SLUGS);
export const isFeatured = slug => FEATURED.has(slug);

// Best known first; a pack not listed here keeps its place after these.
export const FEATURED_PACK_SLUGS = [
  'prague-castle', 'old-town-square', 'wenceslas-square', 'vysehrad', 'petrin', 'kampa-island',
  'malostranske-namesti', 'namesti-republiky', 'letna', 'na-prikope', 'pankrac', 'prokopske-valley',
];

const featuredRank = list => {
  const rank = new Map(list.map((slug, i) => [slug, i]));
  return item => rank.get(item.slug) ?? Infinity;
};

export function featuredPacksFirst(packs) {
  const rankOf = featuredRank(FEATURED_PACK_SLUGS);
  return [...packs].sort((a, b) => {
    const [ra, rb] = [rankOf(a), rankOf(b)];
    return ra === rb ? 0 : ra - rb;
  });
}

// The featured cards in their order, then everything else with the rarities mixed.
export function firstVisitOrder(cards) {
  const rankOf = featuredRank(FEATURED_SLUGS);
  const featured = cards.filter(c => rankOf(c) !== Infinity).sort((a, b) => rankOf(a) - rankOf(b));
  return [...featured, ...diverseOrder(cards.filter(c => rankOf(c) === Infinity))];
}

// FNV-1a: the same text always lands in the same place, so the order doesn't
// change between visits or when the list is filtered.
function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Takes one card of each rarity in turn, so any stretch of the list holds them
// all until the scarcer ones run out. Within a rarity the order is a fixed
// shuffle, and each round visits the rarities in its own order, so the grid
// doesn't repeat one visible pattern; the same rarity never stands twice in a
// row across two rounds while another is left.
export function diverseOrder(cards) {
  const byRarity = new Map();
  for (const card of cards) {
    const rarity = card.rarity ?? 'common';
    if (!byRarity.has(rarity)) byRarity.set(rarity, []);
    byRarity.get(rarity).push(card);
  }
  for (const group of byRarity.values()) group.sort((a, b) => hash(a.slug) - hash(b.slug));

  const order = [];
  let last = null;
  for (let round = 0; order.length < cards.length; round += 1) {
    const tiers = [...byRarity.keys()]
      .filter(rarity => byRarity.get(rarity).length > round)
      .sort((a, b) => hash(`${round}:${a}`) - hash(`${round}:${b}`));
    if (tiers.length > 1 && tiers[0] === last) tiers.push(tiers.shift());
    for (const rarity of tiers) order.push(byRarity.get(rarity)[round]);
    last = tiers[tiers.length - 1];
  }
  return order;
}

// Puts a pack at every PACK_EVERY-th place, in the packs' own order; packs left
// over when the cards run out go at the end.
export function interleavePacks(packs, cards) {
  const items = [];
  let nextPack = 0;
  for (const card of cards) {
    if (nextPack < packs.length && (items.length + 1) % PACK_EVERY === 0) {
      items.push(packs[nextPack]);
      nextPack += 1;
    }
    items.push(card);
  }
  return [...items, ...packs.slice(nextPack)];
}
