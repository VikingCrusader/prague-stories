import { groupPages } from '../utils/historyPages.js';

const ev = (slug, extra) => ({ slug, cardType: 'event', ...extra });
const bg = (slug, attachedTo) => ({ slug, cardType: 'background', ...(attachedTo ? { attachedTo } : {}) });
const slugs = (cards) => (cards ?? []).map(c => c.slug);

describe('groupPages', () => {
  test('a background card takes no page and hangs on the page before it by default', () => {
    const { pages, backgrounds, hostOf } = groupPages([ev('a'), bg('x'), ev('b')]);
    expect(slugs(pages)).toEqual(['a', 'b']);
    expect(slugs(backgrounds.get('a'))).toEqual(['x']);
    expect(backgrounds.has('b')).toBe(false);
    expect(hostOf.get('x')).toBe('a');
  });

  test('attachedTo hangs a card on several pages, later ones too; the first is its home', () => {
    const { backgrounds, hostOf } = groupPages([ev('a'), bg('x', ['b', 'c']), ev('b'), ev('c')]);
    expect(backgrounds.has('a')).toBe(false);
    expect(slugs(backgrounds.get('b'))).toEqual(['x']);
    expect(slugs(backgrounds.get('c'))).toEqual(['x']);
    expect(hostOf.get('x')).toBe('b');
  });

  test('a page lists the cards at home on it before the others', () => {
    const { backgrounds } = groupPages([ev('a'), bg('far', ['a', 'b']), ev('b'), bg('near')]);
    expect(slugs(backgrounds.get('b'))).toEqual(['near', 'far']);
  });

  test('unknown hosts are ignored, falling back to the page before', () => {
    const { backgrounds, hostOf } = groupPages([ev('a'), bg('x', ['gone', 'x'])]);
    expect(slugs(backgrounds.get('a'))).toEqual(['x']);
    expect(hostOf.get('x')).toBe('a');
  });

  test('a card with nowhere to hang is left out', () => {
    const { pages, hostOf } = groupPages([bg('x'), ev('a')]);
    expect(slugs(pages)).toEqual(['a']);
    expect(hostOf.has('x')).toBe(false);
  });
});
