import request from 'supertest';
import app from '../src/app.js';
import Location from '../src/models/Location.js';
import User from '../src/models/User.js';
import { connectTestDB, closeTestDB, clearTestDB } from './testUtils/db.js';
import { createAuthedUser } from './testUtils/auth.js';

beforeAll(connectTestDB);
afterAll(closeTestDB);
afterEach(clearTestDB);

const CHARLES_BRIDGE = { lat: 50.0865, lng: 14.4114 };

async function checkIn(token, slug) {
  const original = process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';
  const res = await request(app).post(`/api/checkins/${slug}`).set('Authorization', `Bearer ${token}`).send({});
  process.env.NODE_ENV = original;
  return res;
}

describe('GET /api/user/profile', () => {
  test('401s without auth', async () => {
    const res = await request(app).get('/api/user/profile');
    expect(res.status).toBe(401);
  });

  test('returns the authenticated user', async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app).get('/api/user/profile').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe(user.username);
  });
});

describe('GET /api/user/progress', () => {
  test('returns zeroed defaults for a guest (no auth)', async () => {
    await Location.create({ name: 'A', slug: 'a', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10 });

    const res = await request(app).get('/api/user/progress');

    expect(res.status).toBe(200);
    expect(res.body.totalXP).toBe(0);
    expect(res.body.totalCheckins).toBe(0);
    expect(res.body.totalPreset).toBe(1);
    expect(res.body.unlockPercent).toBe(0);
  });

  test('reflects check-ins for an authenticated user', async () => {
    await Location.create({
      name: 'Charles Bridge', slug: 'charles-bridge', coordinates: CHARLES_BRIDGE,
      rarity: 'legend', xpReward: 100, labels: ['bridge', 'historical'],
    });
    await Location.create({
      name: 'Other', slug: 'other', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10,
    });
    const { token } = await createAuthedUser();
    await checkIn(token, 'charles-bridge');

    const res = await request(app).get('/api/user/progress').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totalXP).toBe(100);
    expect(res.body.totalCheckins).toBe(1);
    expect(res.body.presetCheckins).toBe(1);
    expect(res.body.totalPreset).toBe(2);
    expect(res.body.unlockPercent).toBe(50);
    expect(res.body.labelCount).toEqual({ bridge: 1, historical: 1 });
    expect(res.body.rarityCount.legend).toBe(1);
    expect(res.body.levelInfo.level).toBe(2);
  });
});

describe('GET /api/user/achievements', () => {
  test('returns the full achievement catalogue, unlocked:false for a guest', async () => {
    const res = await request(app).get('/api/user/achievements');
    expect(res.status).toBe(200);
    expect(res.body.achievements.length).toBeGreaterThan(0);
    expect(res.body.achievements.every(a => a.unlocked === false)).toBe(true);
    expect(res.body.levels.length).toBeGreaterThan(0);
  });

  test('marks first_step as unlocked after a check-in', async () => {
    await Location.create({
      name: 'Charles Bridge', slug: 'charles-bridge', coordinates: CHARLES_BRIDGE, rarity: 'legend', xpReward: 100,
    });
    const { token } = await createAuthedUser();
    await checkIn(token, 'charles-bridge');

    const res = await request(app).get('/api/user/achievements').set('Authorization', `Bearer ${token}`);

    const firstStep = res.body.achievements.find(a => a.id === 'first_step');
    expect(firstStep.unlocked).toBe(true);
    expect(firstStep.unlockedAt).not.toBeNull();
  });
});

describe('/api/user/history-progress', () => {
  test('requires authentication', async () => {
    expect((await request(app).get('/api/user/history-progress')).status).toBe(401);
    expect((await request(app).put('/api/user/history-progress').send({ slug: 'x' })).status).toBe(401);
  });

  test('starts empty, then returns the last saved slug', async () => {
    const { token } = await createAuthedUser();
    const empty = await request(app).get('/api/user/history-progress').set('Authorization', `Bearer ${token}`);
    expect(empty.body).toEqual({ slug: null, updatedAt: null });

    await request(app).put('/api/user/history-progress').set('Authorization', `Bearer ${token}`).send({ slug: 'libuse-prophecy' });
    const saved = await request(app).put('/api/user/history-progress').set('Authorization', `Bearer ${token}`).send({ slug: 'st-wenceslas-murder' });
    expect(saved.status).toBe(200);

    const res = await request(app).get('/api/user/history-progress').set('Authorization', `Bearer ${token}`);
    expect(res.body.slug).toBe('st-wenceslas-murder');
    expect(new Date(res.body.updatedAt).getTime()).toBeGreaterThan(0);
  });

  test('rejects a missing or non-string slug', async () => {
    const { token } = await createAuthedUser();
    const res = await request(app).put('/api/user/history-progress').set('Authorization', `Bearer ${token}`).send({ slug: 42 });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/user/preferences', () => {
  test('requires authentication', async () => {
    expect((await request(app).put('/api/user/preferences').send({ theme: 'light' })).status).toBe(401);
  });

  test('starts empty, saves partial updates, and shows up on /auth/me', async () => {
    const { token } = await createAuthedUser();
    const auth = { Authorization: `Bearer ${token}` };
    const before = await request(app).get('/api/auth/me').set(auth);
    expect(before.body.user.preferences).toEqual({ theme: null, lang: null, zhVariant: null });

    await request(app).put('/api/user/preferences').set(auth).send({ theme: 'light', lang: 'zh' });
    const res = await request(app).put('/api/user/preferences').set(auth).send({ zhVariant: 'tw' });
    expect(res.status).toBe(200);
    expect(res.body.preferences).toEqual({ theme: 'light', lang: 'zh', zhVariant: 'tw' });

    const me = await request(app).get('/api/auth/me').set(auth);
    expect(me.body.user.preferences).toEqual({ theme: 'light', lang: 'zh', zhVariant: 'tw' });
  });

  test('rejects an invalid value', async () => {
    const { token } = await createAuthedUser();
    const res = await request(app).put('/api/user/preferences').set('Authorization', `Bearer ${token}`).send({ theme: 'purple' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/user/random-draw', () => {
  async function seedCityAndOutside() {
    await Location.create({ name: 'City', slug: 'city', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10, labels: ['church'] });
    await Location.create({ name: 'Far', slug: 'far', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10, labels: ['castle', 'outside'] });
  }

  test('draws only city cards by default', async () => {
    await seedCityAndOutside();
    for (let i = 0; i < 5; i++) {
      const { token } = await createAuthedUser();
      const res = await request(app).post('/api/user/random-draw').set('Authorization', `Bearer ${token}`).send({});
      expect(res.status).toBe(200);
      expect(res.body.location.slug).toBe('city');
    }
  });

  test('can draw an outside card when includeOutside is set', async () => {
    await seedCityAndOutside();
    const { token } = await createAuthedUser();
    expect((await checkIn(token, 'city')).status).toBe(201);
    const res = await request(app).post('/api/user/random-draw').set('Authorization', `Bearer ${token}`).send({ includeOutside: true });
    expect(res.body.location.slug).toBe('far');
  });

  test('reports none left when only outside cards remain and the box is unticked', async () => {
    await seedCityAndOutside();
    const { token } = await createAuthedUser();
    await checkIn(token, 'city');
    const res = await request(app).post('/api/user/random-draw').set('Authorization', `Bearer ${token}`).send({});
    expect(res.body.noneLeft).toBe(true);
  });
});

describe('treasure hunt (mode: hidden)', () => {
  // Offsets north of CHARLES_BRIDGE; 0.009° of latitude ≈ 1 km.
  const north = m => ({ lat: CHARLES_BRIDGE.lat + m / 111195, lng: CHARLES_BRIDGE.lng });

  async function seedTarget(extra = {}) {
    await Location.create({
      name: 'Target', slug: 'target', coordinates: CHARLES_BRIDGE, rarity: 'rare', xpReward: 20,
      labels: ['church', 'museum', 'tower'], quarter: 'Staré Město', district: 'Praha 1', ...extra,
    });
  }

  async function startHunt(token) {
    return request(app).post('/api/user/random-draw').set('Authorization', `Bearer ${token}`).send({ mode: 'hidden' });
  }

  const guess = (token, pos) =>
    request(app).post('/api/user/random-draw/guess').set('Authorization', `Bearer ${token}`).send(pos);

  test('hides the location and gives only the first clues', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    const res = await startHunt(token);
    expect(res.status).toBe(200);
    expect(res.body.mode).toBe('hidden');
    expect(res.body.location).toBeNull();
    // No rarity or XP figure on the first guess, just one label.
    expect(res.body.hunt).toMatchObject({ attempt: 1, multiplier: 10, xpNow: null, rarity: null, xpReward: null, quarter: null, district: null });
    expect(res.body.hunt.labels).toHaveLength(1);
    // Charles Bridge is ~700 m from Old Town Square.
    expect(res.body.hunt.fromSquare).toEqual({ near: true, direction: null });
    const raw = JSON.stringify(res.body);
    expect(raw).not.toContain('target');
    expect(raw).not.toContain(String(CHARLES_BRIDGE.lat));
  });

  test('never picks an outside card or one without a quarter', async () => {
    await Location.create({ name: 'Far', slug: 'far', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10, labels: ['castle', 'outside'], quarter: 'X' });
    await Location.create({ name: 'NoQ', slug: 'noq', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10, labels: ['castle'] });
    const { token } = await createAuthedUser();
    const res = await startHunt(token);
    expect(res.body.noneLeft).toBe(true);
  });

  test('distance is exact outside the radius and fuzzy inside it', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    await startHunt(token);
    const r1 = await request(app).get('/api/user/random-draw').query(north(3500)).set('Authorization', `Bearer ${token}`);
    expect(r1.body.hunt.proximity.within).toBe(false);
    expect(r1.body.hunt.proximity.distance).toBeGreaterThan(3450);
    const r2 = await request(app).get('/api/user/random-draw').query(north(2500)).set('Authorization', `Bearer ${token}`);
    expect(r2.body.hunt.proximity).toEqual({ within: true, distance: null, direction: null });
  });

  test('refuses a guess outside the current radius', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    await startHunt(token);
    expect((await guess(token, north(3500))).status).toBe(403);
  });

  test('clues build up over five guesses, and the fifth always hits', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    await startHunt(token);

    // Guess 1 from 2.5 km away, on purpose, to buy clues.
    const m1 = await guess(token, north(2500));
    expect(m1.body.hit).toBe(false);
    let h = m1.body.draw.hunt;
    // Inside golden time: 20 x 7 x 1.5.
    expect(h).toMatchObject({ attempt: 2, maxAttempts: 5, multiplier: 7, radius: 2000, rarity: 'rare', xpNow: 210, district: null, quarter: null });
    expect(h.labels).toHaveLength(1);
    expect(h.misses).toEqual([{ direction: 'S', distance: null }]);
    expect(h.proximity.direction).toBeNull();

    expect((await guess(token, north(2500))).status).toBe(403);

    h = (await guess(token, north(1500))).body.draw.hunt;
    expect(h).toMatchObject({ attempt: 3, multiplier: 5, radius: 1000, district: 'Praha 1', quarter: null });
    expect(h.labels).toHaveLength(2);
    expect(h.misses.every(m => m.distance === null)).toBe(true);

    h = (await guess(token, north(800))).body.draw.hunt;
    expect(h).toMatchObject({ attempt: 4, multiplier: 3, radius: 500, quarter: 'Staré Město' });
    expect(h.labels).toHaveLength(2);
    // Now every miss gets its exact distance, and the live direction shows.
    expect(h.misses.map(m => Math.round(m.distance / 100))).toEqual([25, 15, 8]);
    expect(h.proximity.direction).toBe('S');

    h = (await guess(token, north(300))).body.draw.hunt;
    expect(h).toMatchObject({ attempt: 5, multiplier: 2, radius: 100 });
    expect([...h.labels].sort()).toEqual(['church', 'museum', 'tower']);
    expect(h.proximity.distance).toBeGreaterThan(280);

    // The fifth guess is only allowed within 100 m, so it can't miss.
    expect((await guess(token, north(300))).status).toBe(403);
    const hit = await guess(token, north(50));
    expect(hit.status).toBe(201);
    expect(hit.body).toMatchObject({ hit: true, xpEarned: 60, guessAttempt: 5 });
    expect(hit.body.draw.location.slug).toBe('target');

    const list = await request(app).get('/api/locations').set('Authorization', `Bearer ${token}`);
    expect(list.body.find(l => l.slug === 'target')._guessAttempt).toBe(5);
  });

  test('a first-guess hit pays 10x, and 1.5x more inside golden time', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    await startHunt(token);
    const hit = await guess(token, north(20));
    expect(hit.body).toMatchObject({ hit: true, xpEarned: 300, guessAttempt: 1 });
  });

  test('after golden time a first-guess hit pays plain 10x', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    await startHunt(token);
    const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000);
    await User.updateOne({ _id: user._id }, { $set: { 'randomDraw.drawnAt': threeHoursAgo, 'randomDraw.rolledAt': threeHoursAgo } });
    const hit = await guess(token, north(20));
    expect(hit.body).toMatchObject({ hit: true, xpEarned: 200, guessAttempt: 1 });
  });

  test('collecting the target through a normal check-in counts as a hit', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    await startHunt(token);
    await guess(token, north(2500));
    const res = await checkIn(token, 'target');
    expect(res.body).toMatchObject({ xpEarned: 210, guessAttempt: 2 });
  });

  test('shares the 24h timer with the open draw', async () => {
    await seedTarget();
    await Location.create({ name: 'Other', slug: 'other', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10, labels: ['park'], quarter: 'Smíchov' });
    const { token } = await createAuthedUser();
    await startHunt(token);
    const res = await request(app).post('/api/user/random-draw').set('Authorization', `Bearer ${token}`).send({});
    expect(res.body.mode).toBe('hidden');
    expect(res.body.location).toBeNull();
  });

  test('an expired unsolved hunt reveals its answer', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    await startHunt(token);
    await User.updateOne({ _id: user._id }, { $set: { 'randomDraw.drawnAt': new Date(Date.now() - 25 * 3600 * 1000) } });
    const res = await request(app).get('/api/user/random-draw').set('Authorization', `Bearer ${token}`);
    expect(res.body.active).toBe(false);
    expect(res.body.canDraw).toBe(true);
    expect(res.body.lastHunt.location.slug).toBe('target');
    // After it lapses, a normal check-in is plain 1x.
    expect((await checkIn(token, 'target')).body.xpEarned).toBe(20);
  });
});

describe('POST /api/user/random-draw/reroll', () => {
  const reroll = (token, body = {}) =>
    request(app).post('/api/user/random-draw/reroll').set('Authorization', `Bearer ${token}`).send(body);
  const draw = (token, body = {}) =>
    request(app).post('/api/user/random-draw').set('Authorization', `Bearer ${token}`).send(body);

  async function seedTwo() {
    for (const slug of ['one', 'two']) {
      await Location.create({ name: slug, slug, coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10, labels: ['church'], quarter: 'Staré Město', district: 'Praha 1' });
    }
  }

  test('swaps the card once, keeping the 24h window', async () => {
    await seedTwo();
    const { token } = await createAuthedUser();
    const first = await draw(token);
    expect(first.body.canReroll).toBe(true);

    const second = await reroll(token);
    expect(second.status).toBe(200);
    expect(second.body.location.slug).not.toBe(first.body.location.slug);
    expect(second.body.expiresAt).toBe(first.body.expiresAt);
    expect(second.body.canReroll).toBe(false);

    expect((await reroll(token)).status).toBe(409);
  });

  test('a treasure hunt starts over after a re-roll, golden time included', async () => {
    await seedTwo();
    const { token, user } = await createAuthedUser();
    await draw(token, { mode: 'hidden' });
    await request(app).post('/api/user/random-draw/guess').set('Authorization', `Bearer ${token}`)
      .send({ lat: CHARLES_BRIDGE.lat + 2500 / 111195, lng: CHARLES_BRIDGE.lng });
    // Push the original draw back 3 h, past its golden time.
    await User.updateOne({ _id: user._id }, { $set: {
      'randomDraw.drawnAt': new Date(Date.now() - 3 * 3600 * 1000),
      'randomDraw.rolledAt': new Date(Date.now() - 3 * 3600 * 1000),
    } });

    const res = await reroll(token);
    expect(res.body.mode).toBe('hidden');
    expect(res.body.location).toBeNull();
    expect(res.body.hunt).toMatchObject({ attempt: 1, misses: [] });
    expect(new Date(res.body.hunt.goldenUntil).getTime()).toBeGreaterThan(Date.now() + 3600 * 1000);
    expect(new Date(res.body.expiresAt).getTime()).toBeLessThan(Date.now() + 22 * 3600 * 1000);
  });

  test('not after the card is collected, and not without a draw', async () => {
    await seedTwo();
    const { token } = await createAuthedUser();
    expect((await reroll(token)).status).toBe(409);
    const d = await draw(token);
    await checkIn(token, d.body.location.slug);
    expect((await reroll(token)).status).toBe(409);
  });

  test('fails cleanly when no other card is left', async () => {
    await Location.create({ name: 'only', slug: 'only', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10, labels: ['church'] });
    const { token } = await createAuthedUser();
    await draw(token);
    const res = await reroll(token);
    expect(res.status).toBe(409);
    const status = await request(app).get('/api/user/random-draw').set('Authorization', `Bearer ${token}`);
    expect(status.body.location.slug).toBe('only');
    expect(status.body.canReroll).toBe(true);
  });
});

describe('GET /api/user/treasures', () => {
  test('lists only cards found through a treasure hunt, with the guess that found them', async () => {
    for (const slug of ['hunted', 'plain']) {
      await Location.create({ name: slug, slug, coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10, labels: ['church'], quarter: 'Staré Město', description: { en: 'long text' } });
    }
    const { token } = await createAuthedUser();
    // Make sure the hunt lands on 'hunted', then find it on the first guess.
    await checkIn(token, 'plain');
    await request(app).post('/api/user/random-draw').set('Authorization', `Bearer ${token}`).send({ mode: 'hidden' });
    await request(app).post('/api/user/random-draw/guess').set('Authorization', `Bearer ${token}`).send(CHARLES_BRIDGE);

    const res = await request(app).get('/api/user/treasures').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({ slug: 'hunted', unlocked: true, _guessAttempt: 1 });
    expect(res.body[0].description).toBeUndefined();
  });

  test('requires auth', async () => {
    expect((await request(app).get('/api/user/treasures')).status).toBe(401);
  });
});
