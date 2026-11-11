import { diverseOrder, firstVisitOrder, featuredPacksFirst, interleavePacks, packsAtTheirCards, packsByRelease, PACK_EVERY, FEATURED_SLUGS, FEATURED_PACK_SLUGS } from '../utils/gridOrder';

describe('the hand-picked first page', () => {
  it('has no slug twice', () => {
    expect(new Set(FEATURED_SLUGS).size).toBe(FEATURED_SLUGS.length);
    expect(new Set(FEATURED_PACK_SLUGS).size).toBe(FEATURED_PACK_SLUGS.length);
  });

  it('exactly fills a first page of 60 together with the 12 packs', () => {
    expect(FEATURED_SLUGS.length + FEATURED_PACK_SLUGS.length).toBe(60);
    expect(FEATURED_SLUGS.length / FEATURED_PACK_SLUGS.length).toBe(PACK_EVERY - 1);
  });

  it('puts the featured cards first in their own order, whatever order they arrive in', () => {
    const cards = [{ slug: 'obscure', rarity: 'legend' }, { slug: FEATURED_SLUGS[1], rarity: 'legend' }, { slug: FEATURED_SLUGS[0], rarity: 'legend' }];
    expect(firstVisitOrder(cards).map(c => c.slug)).toEqual([FEATURED_SLUGS[0], FEATURED_SLUGS[1], 'obscure']);
  });

  it('orders the packs by fame and keeps an unlisted pack after them', () => {
    const packs = [{ slug: 'new-pack' }, { slug: 'pankrac' }, { slug: 'prague-castle' }];
    expect(featuredPacksFirst(packs).map(p => p.slug)).toEqual(['prague-castle', 'pankrac', 'new-pack']);
  });
});

const RARITIES = { common: 413, rare: 282, superior: 225, epic: 156, mythic: 86, legend: 60 };
const deck = Object.entries(RARITIES).flatMap(([rarity, n]) =>
  Array.from({ length: n }, (_, i) => ({ slug: `${rarity}-${i}`, rarity })));

describe('diverseOrder', () => {
  const ordered = diverseOrder(deck);

  it('keeps every card exactly once', () => {
    expect(ordered).toHaveLength(deck.length);
    expect(new Set(ordered.map(c => c.slug)).size).toBe(deck.length);
  });

  it('shows every rarity equally on the first page', () => {
    const counts = {};
    ordered.slice(0, 60).forEach(c => { counts[c.rarity] = (counts[c.rarity] || 0) + 1; });
    expect(Object.values(counts)).toEqual([10, 10, 10, 10, 10, 10]);
  });

  it('has all six rarities in the first six cards', () => {
    expect(new Set(ordered.slice(0, 6).map(c => c.rarity)).size).toBe(6);
  });

  it('never puts the same rarity twice in a row while others remain', () => {
    const firstPages = ordered.slice(0, 360);
    firstPages.slice(1).forEach((card, i) => expect(card.rarity).not.toBe(firstPages[i].rarity));
  });

  it('gives the same order whatever order the cards arrive in', () => {
    expect(diverseOrder([...deck].reverse()).map(c => c.slug)).toEqual(ordered.map(c => c.slug));
  });

  it('treats a card with no rarity as common', () => {
    expect(diverseOrder([{ slug: 'a' }, { slug: 'b', rarity: 'common' }])).toHaveLength(2);
  });
});

describe('interleavePacks', () => {
  const cards = Array.from({ length: 30 }, (_, i) => ({ slug: `c${i}` }));
  const packs = [{ slug: 'p0' }, { slug: 'p1' }, { slug: 'p2' }];

  it('puts a pack at every PACK_EVERY-th place, in order', () => {
    const items = interleavePacks(packs, cards);
    expect(items).toHaveLength(33);
    packs.forEach((pack, i) => expect(items[(i + 1) * PACK_EVERY - 1]).toBe(pack));
  });

  it('never opens with a pack', () => {
    expect(interleavePacks(packs, cards)[0].slug).toBe('c0');
  });

  it('keeps the leftover packs at the end when cards run out', () => {
    expect(interleavePacks(packs, cards.slice(0, 2)).map(i => i.slug)).toEqual(['c0', 'c1', 'p0', 'p1', 'p2']);
  });

  it('copes with no packs', () => {
    expect(interleavePacks([], cards)).toHaveLength(30);
  });
});

describe('packsAtTheirCards', () => {
  const cards = ['c0', 'c1', 'c2', 'c3'].map(slug => ({ slug }));
  const order = (packs, list = cards) => packsAtTheirCards(packs, list).map(i => i.slug);

  it('puts each pack just before the first of its own cards', () => {
    expect(order([{ slug: 'pA', memberSlugs: ['c2', 'c0'] }, { slug: 'pB', memberSlugs: ['c3'] }]))
      .toEqual(['pA', 'c0', 'c1', 'c2', 'pB', 'c3']);
  });

  it('never brings a pack forward ahead of its cards, whatever its fame', () => {
    expect(order([{ slug: 'prague-castle', memberSlugs: ['c3'] }])).toEqual(['c0', 'c1', 'c2', 'prague-castle', 'c3']);
  });

  it('keeps packs with none of their cards in the list at the end', () => {
    expect(order([{ slug: 'pX', memberSlugs: ['elsewhere'] }, { slug: 'pY' }])).toEqual(['c0', 'c1', 'c2', 'c3', 'pX', 'pY']);
  });
});

describe('packsByRelease', () => {
  const cards = [
    { slug: 'c-new', createdAt: '2026-11-11T10:00:00Z' },
    { slug: 'c-mid', createdAt: '2026-11-10T10:00:00Z' },
    { slug: 'c-old', createdAt: '2026-10-01T10:00:00Z' },
  ];
  const order = packs => packsByRelease(packs, cards).map(i => i.slug);

  it('puts the packs newest first, among the cards by release time', () => {
    expect(order([
      { slug: 'p-first', released: '2026-11-09T20:00:00Z' },
      { slug: 'p-latest', released: '2026-11-11T12:00:00Z' },
      { slug: 'p-second', released: '2026-11-10T15:00:00Z' },
    ])).toEqual(['p-latest', 'c-new', 'p-second', 'c-mid', 'p-first', 'c-old']);
  });

  it('keeps packs released together in their own order, and those without a time at the end', () => {
    expect(order([
      { slug: 'pA', released: '2026-11-10T15:00:00Z' }, { slug: 'pB', released: '2026-11-10T15:00:00Z' }, { slug: 'pZ' },
    ])).toEqual(['c-new', 'pA', 'pB', 'c-mid', 'c-old', 'pZ']);
  });
});
