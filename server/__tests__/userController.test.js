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

describe('PUT /api/user/location-consent', () => {
  test('requires authentication', async () => {
    expect((await request(app).put('/api/user/location-consent').send({ granted: true, version: 1 })).status).toBe(401);
  });

  test('starts undecided, records the decision with its version and time, and shows up on /auth/me', async () => {
    const { token } = await createAuthedUser();
    const auth = { Authorization: `Bearer ${token}` };
    const before = await request(app).get('/api/auth/me').set(auth);
    expect(before.body.user.locationConsent).toEqual({ granted: null, version: null, decidedAt: null });

    const res = await request(app).put('/api/user/location-consent').set(auth).send({ granted: true, version: 1 });
    expect(res.status).toBe(200);
    expect(res.body.locationConsent).toMatchObject({ granted: true, version: 1 });
    expect(Date.parse(res.body.locationConsent.decidedAt)).not.toBeNaN();

    const me = await request(app).get('/api/auth/me').set(auth);
    expect(me.body.user.locationConsent).toMatchObject({ granted: true, version: 1 });
  });

  test('rejects a missing or malformed decision', async () => {
    const { token } = await createAuthedUser();
    const auth = { Authorization: `Bearer ${token}` };
    expect((await request(app).put('/api/user/location-consent').set(auth).send({ granted: 'yes', version: 1 })).status).toBe(400);
    expect((await request(app).put('/api/user/location-consent').set(auth).send({ granted: true })).status).toBe(400);
  });
});

describe('treasure hunt', () => {
  // Offsets north of CHARLES_BRIDGE; 0.009° of latitude ≈ 1 km.
  const north = m => ({ lat: CHARLES_BRIDGE.lat + m / 111195, lng: CHARLES_BRIDGE.lng });

  async function seedTarget(extra = {}) {
    await Location.create({
      name: 'Target', slug: 'target', coordinates: CHARLES_BRIDGE, rarity: 'rare', xpReward: 20,
      labels: ['church', 'museum', 'tower'], quarter: 'Staré Město', district: 'Praha 1', ...extra,
    });
  }

  async function startHunt(token) {
    return request(app).post('/api/user/random-draw').set('Authorization', `Bearer ${token}`).send({});
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
    // Staré Město is on the right bank.
    expect(res.body.hunt.riverSide).toBe('oldTown');
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

  test('gives the castle side for a left-bank quarter', async () => {
    await seedTarget({ quarter: 'Malá Strana' });
    const { token } = await createAuthedUser();
    const res = await startHunt(token);
    expect(res.body.hunt.riverSide).toBe('castle');
  });

  test('never hides the treasure on a bridge or island', async () => {
    await seedTarget({ slug: 'charles-bridge' });
    await Location.create({ name: 'Kampa', slug: 'kampa-island', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10, labels: ['park'], quarter: 'Malá Strana' });
    const { token } = await createAuthedUser();
    const res = await startHunt(token);
    expect(res.body.noneLeft).toBe(true);
  });

  const status = (token, pos) => request(app).get('/api/user/random-draw').query(pos).set('Authorization', `Bearer ${token}`);

  test('the first guess shows a rough band (3–10 km, over 10 km), then "within" once the button unlocks', async () => {
    await seedTarget({ labels: ['church'] });
    const { token } = await createAuthedUser();
    await startHunt(token);
    const far = await status(token, north(6000));
    expect(far.body.hunt.proximity).toEqual({ within: false, distance: null, band: { min: 3000, max: 10000 }, direction: null });
    const farther = await status(token, north(12000));
    expect(farther.body.hunt.proximity.band).toEqual({ min: 10000, max: null });
    const near = await status(token, north(1500));
    expect(near.body.hunt.proximity).toEqual({ within: true, distance: null, band: null, direction: null });
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

    // Guess 1 from 1.8 km away, on purpose, to buy clues.
    const m1 = await guess(token, north(1800));
    expect(m1.body.hit).toBe(false);
    let h = m1.body.draw.hunt;
    // 20 x 5.
    expect(h).toMatchObject({ attempt: 2, maxAttempts: 5, multiplier: 5, radius: 2000, rarity: 'rare', xpNow: 100, district: null, quarter: null });
    expect(h.labels).toHaveLength(1);
    expect(h.misses).toEqual([{ direction: 'S' }]);
    expect(h.proximity.direction).toBeNull();
    // Outside the 2 km radius: a band, never the exact figure. No minimum
    // number of cards after the first guess, so it isn't widened.
    const far = (await status(token, north(2500))).body.hunt;
    expect(far.proximity).toMatchObject({ within: false, distance: null, band: { min: 2000, max: 3000 } });

    expect((await guess(token, north(2500))).status).toBe(403);

    h = (await guess(token, north(1500))).body.draw.hunt;
    expect(h).toMatchObject({ attempt: 3, multiplier: 3, radius: 1000, district: 'Praha 1', quarter: null });
    expect(h.labels).toHaveLength(2);
    expect(h.misses).toEqual([{ direction: 'S' }, { direction: 'S' }]);

    h = (await guess(token, north(800))).body.draw.hunt;
    expect(h).toMatchObject({ attempt: 4, multiplier: 2, radius: 500, quarter: 'Staré Město' });
    expect(h.labels).toHaveLength(2);
    // The live direction shows now; misses still only give their direction.
    expect(h.misses).toEqual([{ direction: 'S' }, { direction: 'S' }, { direction: 'S' }]);
    expect(h.proximity.direction).toBe('S');
    // Guess 4, outside its 500 m radius: still only a band.
    expect(h.proximity).toMatchObject({ within: false, distance: null, band: { min: 500, max: 1000 } });

    h = (await guess(token, north(300))).body.draw.hunt;
    expect(h).toMatchObject({ attempt: 5, multiplier: 1, radius: 100 });
    expect([...h.labels].sort()).toEqual(['church', 'museum', 'tower']);
    expect(h.proximity.distance).toBeGreaterThan(280);

    // The fifth guess is only allowed within 100 m, so it can't miss.
    expect((await guess(token, north(300))).status).toBe(403);
    const hit = await guess(token, north(50));
    expect(hit.status).toBe(201);
    expect(hit.body).toMatchObject({ hit: true, xpEarned: 20, guessAttempt: 5 });
    expect(hit.body.draw.location.slug).toBe('target');

    const list = await request(app).get('/api/locations').set('Authorization', `Bearer ${token}`);
    expect(list.body.find(l => l.slug === 'target')._guessAttempt).toBe(5);
  });

  test('skipping a guess moves on to the next clues from anywhere, but not past the last guess', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    await startHunt(token);
    const skip = () => request(app).post('/api/user/random-draw/skip').set('Authorization', `Bearer ${token}`).send(north(20000));

    // 20 km away, far outside the 3 km radius, and no guess needed.
    let res = await skip();
    expect(res.status).toBe(200);
    expect(res.body.draw.hunt).toMatchObject({ attempt: 2, multiplier: 5, nextMultiplier: 3, rarity: 'rare' });
    // A skip records no position, so it gives no direction clue.
    expect(res.body.draw.hunt.misses).toEqual([{ skipped: true }]);

    for (let i = 0; i < 3; i++) res = await skip();
    expect(res.body.draw.hunt).toMatchObject({ attempt: 5, multiplier: 1, nextMultiplier: null });
    expect((await skip()).status).toBe(409);

    // Found on the fifth guess after four skips: plain 1x.
    const hit = await guess(token, north(50));
    expect(hit.body).toMatchObject({ hit: true, xpEarned: 20, guessAttempt: 5 });
  });

  test('a first-guess hit pays 10x, however long it took', async () => {
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
    await guess(token, north(1500));
    const res = await checkIn(token, 'target');
    expect(res.body).toMatchObject({ xpEarned: 100, guessAttempt: 2 });
  });

  test('one hunt per 24h: starting again hands back the running one', async () => {
    await seedTarget();
    await Location.create({ name: 'Other', slug: 'other', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10, labels: ['park'], quarter: 'Smíchov' });
    const { token } = await createAuthedUser();
    const first = await startHunt(token);
    const again = await startHunt(token);
    expect(again.body.location).toBeNull();
    expect(again.body.drawnAt).toBe(first.body.drawnAt);
  });

  test('a leftover open draw from before the switch pays no bonus and does not block a hunt', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    await User.updateOne({ _id: user._id }, { $set: { randomDraw: { slug: 'target', drawnAt: new Date(), mode: 'open', bonusUsed: false } } });
    const status = await request(app).get('/api/user/random-draw').set('Authorization', `Bearer ${token}`);
    expect(status.body).toMatchObject({ active: false, canDraw: true });
    expect(status.body.lastHunt).toBeUndefined();
    expect((await checkIn(token, 'target')).body.xpEarned).toBe(20);
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
    const slugNow = async () => (await User.findOne({}).lean()).randomDraw.slug;
    const first = await draw(token);
    expect(first.body.canReroll).toBe(true);
    const firstSlug = await slugNow();

    const second = await reroll(token);
    expect(second.status).toBe(200);
    expect(await slugNow()).not.toBe(firstSlug);
    expect(second.body.expiresAt).toBe(first.body.expiresAt);
    expect(second.body.canReroll).toBe(false);

    expect((await reroll(token)).status).toBe(409);
  });

  test('a treasure hunt starts over after a re-roll', async () => {
    await seedTwo();
    const { token, user } = await createAuthedUser();
    await draw(token);
    await request(app).post('/api/user/random-draw/guess').set('Authorization', `Bearer ${token}`)
      .send({ lat: CHARLES_BRIDGE.lat + 1500 / 111195, lng: CHARLES_BRIDGE.lng });
    // Push the original draw back 3 h.
    await User.updateOne({ _id: user._id }, { $set: {
      'randomDraw.drawnAt': new Date(Date.now() - 3 * 3600 * 1000),
      'randomDraw.rolledAt': new Date(Date.now() - 3 * 3600 * 1000),
    } });

    const res = await reroll(token);
    expect(res.body.mode).toBe('hidden');
    expect(res.body.location).toBeNull();
    expect(res.body.hunt).toMatchObject({ attempt: 1, misses: [] });
    expect(new Date(res.body.expiresAt).getTime()).toBeLessThan(Date.now() + 22 * 3600 * 1000);
  });

  test('not after the card is collected, and not without a draw', async () => {
    await seedTwo();
    const { token } = await createAuthedUser();
    expect((await reroll(token)).status).toBe(409);
    await draw(token);
    const { randomDraw } = await User.findOne({}).lean();
    await checkIn(token, randomDraw.slug);
    expect((await reroll(token)).status).toBe(409);
  });

  test('fails cleanly when no other card is left', async () => {
    await Location.create({ name: 'only', slug: 'only', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10, labels: ['church'], quarter: 'Staré Město' });
    const { token } = await createAuthedUser();
    await draw(token);
    const res = await reroll(token);
    expect(res.status).toBe(409);
    const status = await request(app).get('/api/user/random-draw').set('Authorization', `Bearer ${token}`);
    expect(status.body.active).toBe(true);
    expect(status.body.canReroll).toBe(true);
    expect((await User.findOne({}).lean()).randomDraw.slug).toBe('only');
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

describe('GET /api/user/leaderboard', () => {
  async function seedUsers() {
    const people = [['ada', 500], ['bob', 300], ['cyd', 300], ['dan', 10], ['eve', 0], ['admin000', 46010]];
    for (const [username, totalXP] of people) {
      await User.create({ username, email: `${username}@example.com`, password: 'secret123', totalXP, hideFromLeaderboard: username === 'admin000' });
    }
  }

  test('ranks users with XP, ties sharing a rank, without emails or hidden accounts', async () => {
    await seedUsers();
    const res = await request(app).get('/api/user/leaderboard');
    expect(res.status).toBe(200);
    expect(res.body.entries.map(e => [e.rank, e.username, e.totalXP])).toEqual([
      [1, 'ada', 500], [2, 'bob', 300], [2, 'cyd', 300], [4, 'dan', 10],
    ]);
    expect(res.body.total).toBe(4);
    expect(res.body.entries[0]).toMatchObject({ level: expect.any(Number), title: expect.any(String), isMe: false });
    expect(JSON.stringify(res.body)).not.toContain('@example.com');
    expect(res.body.me).toBeNull();
  });

  test('marks the signed-in user\'s own row', async () => {
    await seedUsers();
    const { token, user } = await createAuthedUser();
    await User.updateOne({ _id: user._id }, { $set: { totalXP: 400 } });
    const res = await request(app).get('/api/user/leaderboard').set('Authorization', `Bearer ${token}`);
    const mine = res.body.entries.find(e => e.isMe);
    expect(mine).toMatchObject({ rank: 2, username: user.username, totalXP: 400 });
  });

  test('counts each explorer\'s collected cards', async () => {
    await Location.create({ name: 'A', slug: 'a', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10 });
    await Location.create({ name: 'B', slug: 'b', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10 });
    const { token, user } = await createAuthedUser();
    await checkIn(token, 'a');
    await checkIn(token, 'b');
    const res = await request(app).get('/api/user/leaderboard');
    expect(res.body.entries.find(e => e.username === user.username)).toMatchObject({ cards: 2, totalXP: 20 });
  });
});

describe('GET /api/user/explorers/:username', () => {
  test('shows a listed explorer\'s level, rank, cards and achievements, without their email', async () => {
    await Location.create({ name: 'A', slug: 'a', coordinates: CHARLES_BRIDGE, rarity: 'rare', xpReward: 20 });
    await Location.create({ name: 'B', slug: 'b', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10 });
    await Location.create({ name: 'C', slug: 'c', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10 });
    const { token, user } = await createAuthedUser();
    await checkIn(token, 'a');
    await checkIn(token, 'b');

    const res = await request(app).get(`/api/user/explorers/${encodeURIComponent(user.username)}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ username: user.username, totalXP: 30, rank: 1, totalCards: 3, isMe: false });
    expect(res.body.rarityCount).toMatchObject({ rare: 1, common: 1 });
    expect(res.body.cards.map(c => c.slug).sort()).toEqual(['a', 'b']);
    expect(res.body.cards[0]).toMatchObject({ unlocked: true });
    expect(res.body.cards[0].description).toBeUndefined();
    expect(res.body.achievements.length).toBeGreaterThan(0); // first check-in
    expect(JSON.stringify(res.body)).not.toContain(user.email);

    const own = await request(app).get(`/api/user/explorers/${encodeURIComponent(user.username)}`).set('Authorization', `Bearer ${token}`);
    expect(own.body.isMe).toBe(true);
  });

  test('404s for hidden, zero-XP and unknown users', async () => {
    await User.create({ username: 'admin000', email: 'a@example.com', password: 'secret123', totalXP: 500, hideFromLeaderboard: true });
    await User.create({ username: 'newbie', email: 'n@example.com', password: 'secret123', totalXP: 0 });
    for (const name of ['admin000', 'newbie', 'nobody']) {
      expect((await request(app).get(`/api/user/explorers/${name}`)).status).toBe(404);
    }
  });
});

describe('hardcore treasure hunt', () => {
  const north = m => ({ lat: CHARLES_BRIDGE.lat + m / 111195, lng: CHARLES_BRIDGE.lng });
  const seedTarget = (extra = {}) => Location.create({
    name: 'Target', slug: 'target', coordinates: CHARLES_BRIDGE, rarity: 'rare', xpReward: 20,
    labels: ['church', 'gothic'], quarter: 'Staré Město', district: 'Praha 1', ...extra,
  });
  const start = (token, pos) => request(app).post('/api/user/hardcore-hunt').set('Authorization', `Bearer ${token}`).send(pos || {});
  const status = (token, pos) => request(app).get('/api/user/hardcore-hunt').query(pos).set('Authorization', `Bearer ${token}`);
  const press = (token, pos) => request(app).post('/api/user/hardcore-hunt/guess').set('Authorization', `Bearer ${token}`).send(pos);

  test('gives no clues at all from afar, only a rough distance', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    const res = await start(token, north(12000));
    expect(res.body.active).toBe(true);
    expect(res.body.location).toBeUndefined();
    expect(res.body.hunt).toMatchObject({ attempt: 1, maxAttempts: 3, multiplier: 10, labels: [], quarter: null, rarity: null, canGuess: false });
    expect(res.body.hunt.reading).toEqual({ over: 10000 });
    expect((await status(token, north(4400))).body.hunt.reading).toEqual({ about: 4000 });
    expect((await status(token, north(2300))).body.hunt.reading).toEqual({ about: 2500 });
    expect(JSON.stringify(res.body)).not.toContain('target');
  });

  test('keeps no position for a miss, and drops the trend reference point when consent is withdrawn', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    await start(token);
    await status(token, north(2000));
    expect((await User.findById(user._id).lean()).hardcoreDraw.trendRef).toMatchObject({ distance: 2000 });

    await press(token, north(300));
    const afterMiss = await User.collection.findOne({ _id: (await User.findById(user._id))._id });
    expect(afterMiss.hardcoreDraw.misses).toHaveLength(1);
    expect(afterMiss.hardcoreDraw.misses[0].lat).toBeUndefined();
    expect(afterMiss.hardcoreDraw.misses[0].lng).toBeUndefined();

    await request(app).put('/api/user/location-consent').set('Authorization', `Bearer ${token}`).send({ granted: false, version: 1 });
    const after = await User.findById(user._id).lean();
    expect(after.hardcoreDraw.trendRef).toBeNull();
    expect(after.hardcoreDraw.misses).toHaveLength(1); // the hunt itself goes on
    expect(after.locationConsent).toMatchObject({ granted: false, version: 1 });
  });

  test('reveals a label and the quarter within 1 km, more within 500 m, and keeps them', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    await start(token);
    const at800 = (await status(token, north(800))).body.hunt;
    expect(at800).toMatchObject({ reading: { about: 800 }, quarter: 'Staré Město', rarity: null, canGuess: false });
    expect(at800.labels).toHaveLength(1);
    const at350 = (await status(token, north(350))).body.hunt;
    expect(at350).toMatchObject({ reading: { about: 400 }, rarity: 'rare', canGuess: true });
    expect(at350.labels).toHaveLength(2);
    // Walking away again keeps what was revealed.
    const back = (await status(token, north(5000))).body.hunt;
    expect(back).toMatchObject({ quarter: 'Staré Město', rarity: 'rare', canGuess: false });
    expect(back.labels).toHaveLength(2);
  });

  test('three misses end the hunt and reveal the answer', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    await start(token);
    expect((await press(token, north(800))).status).toBe(403);
    const m1 = await press(token, north(300));
    expect(m1.body).toMatchObject({ hit: false, hunt: { hunt: { attempt: 2, multiplier: 5 } } });
    await press(token, north(300));
    const m3 = await press(token, north(300));
    expect(m3.body.hunt).toMatchObject({ failed: true, location: { slug: 'target' } });
    expect((await press(token, north(10))).status).toBe(409);
  });

  test('a hit pays the press multiplier and is marked hardcore', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    await start(token);
    await press(token, north(300));
    const hit = await press(token, north(20));
    expect(hit.status).toBe(201);
    expect(hit.body).toMatchObject({ hit: true, xpEarned: 100, guessAttempt: 2 });
    expect(hit.body.hunt).toMatchObject({ found: true, solvedAttempt: 2 });
    const detail = await request(app).get('/api/locations/target').set('Authorization', `Bearer ${token}`);
    expect(detail.body).toMatchObject({ guessAttempt: 2, huntMode: 'hardcore' });
    expect((await User.findById(user._id)).totalXP).toBe(100);
  });

  test('reveals the river side within 3 km and keeps it', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    expect((await start(token, north(5000))).body.hunt.riverSide).toBeNull();
    expect((await status(token, north(2500))).body.hunt.riverSide).toBe('oldTown');
    expect((await status(token, north(6000))).body.hunt.riverSide).toBe('oldTown');
  });

  test('says closer or farther after each step outside 1 km, nothing inside it', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    expect((await start(token, north(5000))).body.hunt.trend).toBeNull();
    // Less than a step away: no verdict yet.
    expect((await status(token, north(4950))).body.hunt.trend).toBeNull();
    expect((await status(token, north(4850))).body.hunt.trend).toBe('closer');
    expect((await status(token, north(5100))).body.hunt.trend).toBe('farther');
    // Sideways, the distance barely changes.
    const side = { lat: north(5100).lat, lng: CHARLES_BRIDGE.lng + 200 / (111195 * Math.cos(CHARLES_BRIDGE.lat * Math.PI / 180)) };
    expect((await status(token, side)).body.hunt.trend).toBe('same');
    expect((await status(token, north(800))).body.hunt.trend).toBeNull();
  });

  test('only one mode at a time: neither starts while the other is being played', async () => {
    await seedTarget();
    await Location.create({ name: 'Other', slug: 'other', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10, labels: ['park'], quarter: 'Staré Město', district: 'Praha 1' });
    const { token } = await createAuthedUser();
    const clue = (t2) => request(app).post('/api/user/random-draw').set('Authorization', `Bearer ${t2}`).send({});
    expect((await clue(token)).body.active).toBe(true);
    expect((await status(token)).body).toMatchObject({ active: false, blockedBy: 'clues' });
    const blocked = await start(token);
    expect(blocked.status).toBe(409);
    expect(blocked.body.blockedBy).toBe('clues');

    const { token: t2 } = await createAuthedUser();
    expect((await start(t2)).body.active).toBe(true);
    const draw = await request(app).get('/api/user/random-draw').set('Authorization', `Bearer ${t2}`);
    expect(draw.body.blockedBy).toBe('hardcore');
    expect((await clue(t2)).status).toBe(409);
  });

  test('the other mode may start once a hunt is over', async () => {
    await seedTarget();
    await Location.create({ name: 'Other', slug: 'other', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10, labels: ['park'], quarter: 'Staré Město', district: 'Praha 1' });
    const { token } = await createAuthedUser();
    await start(token);
    await press(token, north(20)); // both cards sit on the same spot, so this hits
    const clue = await request(app).post('/api/user/random-draw').set('Authorization', `Bearer ${token}`).send({});
    expect(clue.body.active).toBe(true);
  });
});

describe('hardcore hunt pool', () => {
  test('leaves bridges and islands out, like the classic hunt', async () => {
    await Location.create({ name: 'Charles Bridge', slug: 'charles-bridge', coordinates: CHARLES_BRIDGE, rarity: 'legend', xpReward: 100, labels: ['bridge'], quarter: 'Staré Město' });
    const { token } = await createAuthedUser();
    const classic = await request(app).post('/api/user/random-draw').set('Authorization', `Bearer ${token}`).send({});
    expect(classic.body.noneLeft).toBe(true);
    const hard = await request(app).post('/api/user/hardcore-hunt').set('Authorization', `Bearer ${token}`).send({});
    expect(hard.body.noneLeft).toBe(true);
  });
});
