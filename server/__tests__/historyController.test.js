import request from 'supertest';

const { default: app } = await import('../src/app.js');
const { default: HistoryEvent } = await import('../src/models/HistoryEvent.js');
const { default: Location } = await import('../src/models/Location.js');
const { default: CheckIn } = await import('../src/models/CheckIn.js');
const { connectTestDB, closeTestDB, clearTestDB } = await import('./testUtils/db.js');
const { createAuthedUser } = await import('./testUtils/auth.js');

beforeAll(connectTestDB);
afterAll(closeTestDB);
afterEach(clearTestDB);

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
    expect(res.body.eras).toHaveLength(13);
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
