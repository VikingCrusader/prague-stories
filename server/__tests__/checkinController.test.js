import request from 'supertest';
import app from '../src/app.js';
import Location from '../src/models/Location.js';
import CheckIn from '../src/models/CheckIn.js';
import User from '../src/models/User.js';
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
    expect(res.body.totalXP).toBe(100);
    expect(res.body.levelInfo.level).toBe(2);
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

  test('unlocks the first_step achievement on a first check-in', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    await createLocation();
    const { token } = await createAuthedUser();

    const res = await request(app).post('/api/checkins/charles-bridge').set('Authorization', `Bearer ${token}`).send({});

    expect(res.body.newAchievements.map(a => a.id)).toContain('first_step');
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

describe('DELETE /api/checkins/:slug', () => {
  test('401s without auth', async () => {
    await createLocation();
    const res = await request(app).delete('/api/checkins/charles-bridge');
    expect(res.status).toBe(401);
  });

  test('404s when there is no existing check-in', async () => {
    await createLocation();
    const { token } = await createAuthedUser();
    const res = await request(app).delete('/api/checkins/charles-bridge').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  test('removes the check-in and refunds XP', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    await createLocation();
    const { token, user } = await createAuthedUser();
    await request(app).post('/api/checkins/charles-bridge').set('Authorization', `Bearer ${token}`).send({});

    const res = await request(app).delete('/api/checkins/charles-bridge').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totalXP).toBe(0);
    expect(res.body.levelInfo.level).toBe(1);

    const remaining = await CheckIn.find({ user: user._id });
    expect(remaining).toHaveLength(0);
    process.env.NODE_ENV = original;
  });

  test('never lets XP go negative', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    await createLocation();
    const { token, user } = await createAuthedUser();
    await request(app).post('/api/checkins/charles-bridge').set('Authorization', `Bearer ${token}`).send({});

    // Manually drop the user's XP below the location's reward, then undo.
    await User.updateOne({ _id: user._id }, { $set: { totalXP: 20 } });

    const res = await request(app).delete('/api/checkins/charles-bridge').set('Authorization', `Bearer ${token}`);

    expect(res.body.totalXP).toBe(0);
    process.env.NODE_ENV = original;
  });
});
