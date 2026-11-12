import request from 'supertest';

const { default: app } = await import('../src/app.js');
const { default: HistoryEvent } = await import('../src/models/HistoryEvent.js');
const { default: Location } = await import('../src/models/Location.js');
const { default: CheckIn } = await import('../src/models/CheckIn.js');
const { connectTestDB, closeTestDB, clearTestDB } = await import('./testUtils/db.js');
const { createAuthedUser } = await import('./testUtils/auth.js');
const { clearHistoryCache } = await import('../src/controllers/historyController.js');

beforeAll(connectTestDB);
afterAll(closeTestDB);
afterEach(async () => {
  await clearTestDB();
  clearHistoryCache();
});

async function createEvent(overrides = {}) {
  return HistoryEvent.create({
    slug: 'libuse-prophecy',
    era: 'legends-origins',
    startYear: 720,
    year: { en: '8th century (legendary)', cz: '8. století (legenda)', zh: '8世纪（传说）' },
    title: { en: "Libuše's Prophecy", cz: 'Libušino proroctví', zh: '莉布谢的预言' },
    hookLine: { en: 'hook', cz: 'hook', zh: 'hook' },
    summary: { en: 'summary', cz: 'summary', zh: 'summary' },
    relatedLandmarks: [{ slug: 'sousosi-premysl-a-libuse', relation: { en: 'r', cz: 'r', zh: 'r' } }],
    ...overrides,
  });
}

describe('GET /api/history', () => {
  test('returns the full era roster alongside seeded events', async () => {
    await createEvent();

    const res = await request(app).get('/api/history');

    expect(res.status).toBe(200);
    expect(res.body.eras).toHaveLength(24);
    expect(res.body.eras[0].key).toBe('legends-origins');
    expect(res.body.events).toHaveLength(1);
    expect(res.body.events[0].slug).toBe('libuse-prophecy');
  });

  test('sorts events by startYear ascending', async () => {
    await createEvent({ slug: 'st-wenceslas-murder', startYear: 935, relatedLandmarks: [] });
    await createEvent({ slug: 'libuse-prophecy', startYear: 720 });

    const res = await request(app).get('/api/history');

    expect(res.body.events.map(e => e.slug)).toEqual(['libuse-prophecy', 'st-wenceslas-murder']);
  });

  test('enriches a resolvable relatedLandmarks slug with the joined location', async () => {
    await Location.create({
      name: 'Statue of Přemysl and Libuše',
      slug: 'sousosi-premysl-a-libuse',
      coordinates: { lat: 50.064, lng: 14.417 },
      rarity: 'rare',
    });
    await createEvent();

    const res = await request(app).get('/api/history');

    expect(res.body.events[0].relatedLandmarks).toHaveLength(1);
    expect(res.body.events[0].relatedLandmarks[0].landmark.slug).toBe('sousosi-premysl-a-libuse');
    expect(res.body.events[0].relatedLandmarks[0].landmark.name).toBe('Statue of Přemysl and Libuše');
    expect(res.body.events[0].relatedLandmarks[0].relation.en).toBe('r');
  });

  test('?lang= returns only that language, falling back to en when it is missing', async () => {
    await Location.create({
      name: 'Statue of Přemysl and Libuše',
      slug: 'sousosi-premysl-a-libuse',
      localizedNames: { cz: 'Sousoší Přemysla a Libuše', zh: '普热米斯尔与莉布谢雕像' },
      coordinates: { lat: 50.064, lng: 14.417 },
    });
    await createEvent({ hookLine: { en: 'hook en', cz: '', zh: '' } });

    const res = await request(app).get('/api/history?lang=zh');
    const event = res.body.events[0];

    expect(event.title).toEqual({ zh: '莉布谢的预言' });
    expect(event.hookLine).toEqual({ zh: 'hook en' });
    expect(event.relatedLandmarks[0].relation).toEqual({ zh: 'r' });
    // Not a { en, cz, zh } object (no en key), so left intact.
    expect(event.relatedLandmarks[0].landmark.localizedNames.cz).toBe('Sousoší Přemysla a Libuše');
    expect(res.body.eras[0].title).toEqual({ zh: expect.any(String) });
  });

  test('drops a relatedLandmarks slug that has no matching location instead of returning a dead link', async () => {
    await createEvent(); // 'sousosi-premysl-a-libuse' is never created as a Location here

    const res = await request(app).get('/api/history');

    expect(res.body.events[0].relatedLandmarks).toHaveLength(0);
  });

  test('marks a related landmark unlocked false for a guest, matching GET /api/locations', async () => {
    await Location.create({
      name: 'Statue of Přemysl and Libuše',
      slug: 'sousosi-premysl-a-libuse',
      coordinates: { lat: 50.064, lng: 14.417 },
      rarity: 'rare',
    });
    await createEvent();

    const res = await request(app).get('/api/history');

    expect(res.body.events[0].relatedLandmarks[0].landmark.unlocked).toBe(false);
  });

  test('marks a related landmark unlocked true when the authenticated requester has checked in', async () => {
    const location = await Location.create({
      name: 'Statue of Přemysl and Libuše',
      slug: 'sousosi-premysl-a-libuse',
      coordinates: { lat: 50.064, lng: 14.417 },
      rarity: 'rare',
    });
    await createEvent();
    const { token, user } = await createAuthedUser();
    await CheckIn.create({ user: user._id, location: location._id });

    const res = await request(app).get('/api/history').set('Authorization', `Bearer ${token}`);

    expect(res.body.events[0].relatedLandmarks[0].landmark.unlocked).toBe(true);
  });
});

describe('GET /api/history caching', () => {
  test('serves an edit made after the first request, without clearing the cache', async () => {
    await createEvent();
    const first = await request(app).get('/api/history?lang=en');
    expect(first.body.events[0].title).toEqual({ en: "Libuše's Prophecy" });

    // Same path the sync scripts use: a Mongoose updateOne bumps updatedAt.
    await new Promise(r => setTimeout(r, 5));
    await HistoryEvent.updateOne({ slug: 'libuse-prophecy' }, { $set: { 'title.en': 'Edited' } });

    const second = await request(app).get('/api/history?lang=en');
    expect(second.body.events[0].title).toEqual({ en: 'Edited' });
  });
});

test('a related landmark can be a card pack, which wins over a card of the same slug', async () => {
  await Location.create({ slug: 'vysehrad', name: 'Old card', labels: ['church'], coordinates: { lat: 50, lng: 14 }, description: { en: 'x', cz: 'x', zh: 'x' } });
  await createEvent({ relatedLandmarks: [{ slug: 'vysehrad', relation: { en: 'x', cz: 'x', zh: 'x' } }] });
  const res = await request(app).get('/api/history');
  const [{ landmark }] = res.body.events[0].relatedLandmarks;
  expect(landmark).toMatchObject({ isPack: true, slug: 'vysehrad', name: 'Vyšehrad' });
});

test('a background card lists the events it hangs on, leaving out those that do not exist', async () => {
  // data/backgroundHosts.js: Mongol invasion -> its own event; Moravia -> Chlumec, the 1142 siege, 1173.
  await createEvent({ slug: 'mongol-invasion-1241', startYear: 1241, relatedLandmarks: [] });
  await createEvent({ slug: 'what-was-the-mongol-invasion-1241', startYear: 1241.1, cardType: 'background', relatedLandmarks: [] });
  await createEvent({ slug: 'what-was-moravia-1127', startYear: 1127, cardType: 'background', relatedLandmarks: [] });
  await createEvent({ slug: 'siege-of-prague-1142', startYear: 1142, relatedLandmarks: [] });
  await createEvent({ slug: 'an-unlisted-aside', startYear: 1300, cardType: 'background', relatedLandmarks: [] });

  const res = await request(app).get('/api/history?lang=en');
  const bySlug = Object.fromEntries(res.body.events.map(e => [e.slug, e]));

  expect(bySlug['what-was-the-mongol-invasion-1241'].attachedTo).toEqual(['mongol-invasion-1241']);
  expect(bySlug['what-was-moravia-1127'].attachedTo).toEqual(['siege-of-prague-1142']);
  expect(bySlug['an-unlisted-aside'].attachedTo).toBeUndefined();
  expect(bySlug['mongol-invasion-1241'].attachedTo).toBeUndefined();
});
