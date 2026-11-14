import request from 'supertest';
import app from '../src/app.js';
import Location from '../src/models/Location.js';
import CheckIn from '../src/models/CheckIn.js';
import { connectTestDB, closeTestDB, clearTestDB } from './testUtils/db.js';
import { createAuthedUser } from './testUtils/auth.js';

beforeAll(connectTestDB);
afterAll(closeTestDB);
afterEach(clearTestDB);

const CHARLES_BRIDGE = { lat: 50.0865, lng: 14.4114 };
const FAR_AWAY = { lat: 51.5074, lng: -0.1278 }; // London, ~1000km away

async function createLocation(overrides = {}) {
  return Location.create({
    name: 'Charles Bridge',
    slug: 'charles-bridge',
    coordinates: CHARLES_BRIDGE,
    rarity: 'legend',
    xpReward: 100,
    labels: ['bridge', 'historical'],
    ...overrides,
  });
}

describe('POST /api/checkins/:slug', () => {
  test('401s without auth', async () => {
    await createLocation();
    const res = await request(app).post('/api/checkins/charles-bridge').send({});
    expect(res.status).toBe(401);
  });

  test('404s for an unknown slug', async () => {
    const { token } = await createAuthedUser();
    const res = await request(app)
      .post('/api/checkins/not-a-real-place')
      .set('Authorization', `Bearer ${token}`)
      .send({ lat: CHARLES_BRIDGE.lat, lng: CHARLES_BRIDGE.lng });
    expect(res.status).toBe(404);
  });

  test('400s when coordinates are missing (GPS validation enforced outside development)', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    await createLocation();
    const { token } = await createAuthedUser();

    const res = await request(app)
      .post('/api/checkins/charles-bridge')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    process.env.NODE_ENV = original;
  });

  test('403s when the user is too far from the location', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    await createLocation();
    const { token } = await createAuthedUser();

    const res = await request(app)
      .post('/api/checkins/charles-bridge')
      .set('Authorization', `Bearer ${token}`)
      .send({ lat: FAR_AWAY.lat, lng: FAR_AWAY.lng });

    expect(res.status).toBe(403);
    process.env.NODE_ENV = original;
  });

  test('succeeds when within range, awarding XP and updating level info', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    await createLocation();
    const { token } = await createAuthedUser();

    const res = await request(app)
      .post('/api/checkins/charles-bridge')
      .set('Authorization', `Bearer ${token}`)
      .send({ lat: CHARLES_BRIDGE.lat, lng: CHARLES_BRIDGE.lng });

    expect(res.status).toBe(201);
    expect(res.body.xpEarned).toBe(100);
    // The card's XP plus whatever the achievements it unlocked pay.
    const achXp = res.body.newAchievements.reduce((n, a) => n + a.xp, 0);
    expect(achXp).toBeGreaterThan(0); // first_step at least
    expect(res.body.totalXP).toBe(100 + achXp);
    expect(res.body.levelInfo.level).toBeGreaterThanOrEqual(2);
    process.env.NODE_ENV = original;
  });

  test('bypasses GPS validation in development mode', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    await createLocation();
    const { token } = await createAuthedUser();

    const res = await request(app)
      .post('/api/checkins/charles-bridge')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(201);
    process.env.NODE_ENV = original;
  });

  test('409s on a duplicate check-in', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    await createLocation();
    const { token } = await createAuthedUser();

    await request(app).post('/api/checkins/charles-bridge').set('Authorization', `Bearer ${token}`).send({});
    const res = await request(app).post('/api/checkins/charles-bridge').set('Authorization', `Bearer ${token}`).send({});

    expect(res.status).toBe(409);
    process.env.NODE_ENV = original;
  });

  test('unlocks the southern-pole achievement on checking in there', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    await createLocation({ slug: 'jizni-pol-prahy', name: 'South Pole of Prague' });
    const { token } = await createAuthedUser();

    const res = await request(app).post('/api/checkins/jizni-pol-prahy').set('Authorization', `Bearer ${token}`).send({});

    expect(res.body.newAchievements.map(a => a.id)).toContain('southern-pole');
    process.env.NODE_ENV = original;
  });

  test('reports the achievement and pack progress the card made', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    await createLocation({ slug: 'matyasova-brana', name: 'Matthias Gate' });
    await createLocation({ slug: 'new-royal-palace', name: 'New Royal Palace', coordinates: { lat: 50.09, lng: 14.40 } });
    const { token } = await createAuthedUser();

    const res = await request(app).post('/api/checkins/matyasova-brana').set('Authorization', `Bearer ${token}`).send({});

    expect(res.status).toBe(201);
    const pack = res.body.packProgress.find(p => p.slug === 'prague-castle');
    expect(pack).toMatchObject({ collected: 1, total: 2, unlocked: false, unlockAt: 2 });
    expect(res.body.achievementGains.length).toBeGreaterThan(0);
    const unlocked = new Set(res.body.newAchievements.map(a => a.id));
    for (const g of res.body.achievementGains) {
      expect(g.current).toBeGreaterThan(g.before);
      expect(g.current).toBeLessThanOrEqual(g.target);
      expect(unlocked.has(g.id)).toBe(false);
    }
    expect(res.body.achievementGains.length).toBeLessThanOrEqual(3);
    process.env.NODE_ENV = original;
  });
});

describe('GET /api/checkins', () => {
  test('401s without auth', async () => {
    const res = await request(app).get('/api/checkins');
    expect(res.status).toBe(401);
  });

  test('lists the authenticated user\'s check-ins with populated locations', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    await createLocation();
    const { token } = await createAuthedUser();
    await request(app).post('/api/checkins/charles-bridge').set('Authorization', `Bearer ${token}`).send({});

    const res = await request(app).get('/api/checkins').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].location.slug).toBe('charles-bridge');
    process.env.NODE_ENV = original;
  });
});

