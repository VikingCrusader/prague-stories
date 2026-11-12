import { BACKGROUND_HOSTS, MAX_BACKGROUNDS_PER_EVENT } from '../src/data/backgroundHosts.js';
import { historyEvents } from '../src/data/seedHistoryEvents.js';

const typeOf = new Map(historyEvents.map(e => [e.slug, e.cardType ?? 'event']));

describe('BACKGROUND_HOSTS', () => {
  test('every key is a background card', () => {
    const wrong = Object.keys(BACKGROUND_HOSTS).filter(slug => typeOf.get(slug) !== 'background');
    expect(wrong).toEqual([]);
  });

  test('every host is a dated event, listed once', () => {
    const wrong = Object.entries(BACKGROUND_HOSTS).flatMap(([card, hosts]) =>
      hosts.filter((slug, i) => typeOf.get(slug) !== 'event' || hosts.indexOf(slug) !== i).map(slug => `${card} -> ${slug}`));
    expect(wrong).toEqual([]);
  });

  test('every card has a home', () => {
    expect(Object.values(BACKGROUND_HOSTS).filter(hosts => !hosts.length)).toEqual([]);
  });

  test(`no event carries more than ${MAX_BACKGROUNDS_PER_EVENT} cards`, () => {
    const count = {};
    for (const hosts of Object.values(BACKGROUND_HOSTS)) for (const slug of hosts) count[slug] = (count[slug] ?? 0) + 1;
    expect(Object.entries(count).filter(([, n]) => n > MAX_BACKGROUNDS_PER_EVENT)).toEqual([]);
  });
});
