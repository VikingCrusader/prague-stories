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
      labels: ['church', 'gothic'], quarter: 'Staré Město', district: 'Praha 1', ...extra,
    });
  }
  // Cards around the target, so the first clue and the quarter pass the
  // check (HUNT_MIN_FIRST_CANDIDATES, HUNT_MIN_QUARTER_CANDIDATES). They sit
  // 2 km east of the target, so presses near it never hit them.
  async function seedNeighbours(n, extra = {}) {
    for (let i = 0; i < n; i++) {
      await Location.create({
        name: `N${i}`, slug: `n${i}`, coordinates: { lat: CHARLES_BRIDGE.lat, lng: CHARLES_BRIDGE.lng + 0.028 },
        rarity: 'rare', xpReward: 20, labels: ['church', 'gothic'], quarter: 'Staré Město', district: 'Praha 1', ...extra,
      });
    }
  }
  // Starts hunts until one lands on the target (the pick is random).
  async function startOnTarget(token, user) {
    for (let i = 0; i < 60; i++) {
      await User.updateOne({ _id: user._id }, { $unset: { randomDraw: '' } });
      const res = await startHunt(token);
      if ((await User.findById(user._id).lean()).randomDraw.slug === 'target') return res;
    }
    throw new Error('never drew the target');
  }

  async function startHunt(token, pos) {
    return request(app).post('/api/user/random-draw').set('Authorization', `Bearer ${token}`).send(pos || {});
  }
  const status = (token, pos) => request(app).get('/api/user/random-draw').query(pos).set('Authorization', `Bearer ${token}`);
  const guess = (token, pos) =>
    request(app).post('/api/user/random-draw/guess').set('Authorization', `Bearer ${token}`).send(pos);
  const takeClue = (token, pos) =>
    request(app).post('/api/user/random-draw/clue').set('Authorization', `Bearer ${token}`).send(pos || {});
  // Takes clues (random, the player can't pick) until `key` comes up.
  async function takeClueUntil(token, key, pos) {
    for (let i = 0; i < 4; i++) {
      const res = await takeClue(token, pos);
      if (res.body.clue === key) return res;
    }
    throw new Error(`never drew ${key}`);
  }

  test('hides the location and starts with only the river side and the distance', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    const res = await startHunt(token, north(5000));
    expect(res.status).toBe(200);
    expect(res.body.mode).toBe('hidden');
    expect(res.body.location).toBeNull();
    expect(res.body.hunt).toMatchObject({
      multiplier: 10, missMultiplier: 6, clueMultiplier: 8, presses: 0,
      availableClues: ['rarity', 'label', 'area', 'direction'],
      riverSide: 'oldTown', reading: { about: 5000 },
      firstRevealed: false, areaRevealed: false,
      rarity: null, xpReward: null, labels: [], district: null, quarter: null,
      snapshots: [], misses: [],
    });
    const raw = JSON.stringify(res.body);
    expect(raw).not.toContain('target');
    expect(raw).not.toContain(String(CHARLES_BRIDGE.lat));
  });

  test('picks a treasure at least 4 km from the player, or any card when none is that far', async () => {
    await seedTarget();
    await Location.create({ name: 'Far', slug: 'far', coordinates: north(6000), rarity: 'common', xpReward: 10, labels: ['park'], quarter: 'Holešovice' });
    const { token, user } = await createAuthedUser();
    for (let i = 0; i < 10; i++) {
      await User.updateOne({ _id: user._id }, { $unset: { randomDraw: '' } });
      // Standing on the target: only the far card qualifies.
      await startHunt(token, north(10));
      expect((await User.findById(user._id).lean()).randomDraw.slug).toBe('far');
    }
    // Halfway between the two, both are within 4 km: either will do.
    await User.updateOne({ _id: user._id }, { $unset: { randomDraw: '' } });
    expect((await startHunt(token, north(3000))).body.active).toBe(true);
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

  test('the distance: about N km, then 500 m steps within 3 km, then within 1 km / 300 m, never closer', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    await startHunt(token);
    const reading = async m => (await status(token, north(m))).body.hunt.reading;
    expect(await reading(12400)).toEqual({ about: 12000 });
    expect(await reading(6600)).toEqual({ about: 7000 });
    expect(await reading(2800)).toEqual({ about: 3000 });
    expect(await reading(2600)).toEqual({ about: 2500 });
    expect(await reading(1700)).toEqual({ about: 1500 });
    expect(await reading(1100)).toEqual({ about: 1000 });
    expect(await reading(800)).toEqual({ within: 1000 });
    expect(await reading(250)).toEqual({ within: 300 });
    // No "within 100 m": that would tell the player a press can't miss.
    expect(await reading(50)).toEqual({ within: 300 });
  });

  test('says closer or farther after each step, all the way in', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    expect((await startHunt(token, north(5000))).body.hunt.trend).toBeNull();
    // Less than a step away: no verdict yet.
    expect((await status(token, north(4950))).body.hunt.trend).toBeNull();
    expect((await status(token, north(4850))).body.hunt.trend).toBe('closer');
    expect((await status(token, north(5100))).body.hunt.trend).toBe('farther');
    // Sideways, the distance barely changes.
    const side = { lat: north(5100).lat, lng: CHARLES_BRIDGE.lng + 200 / (111195 * Math.cos(CHARLES_BRIDGE.lat * Math.PI / 180)) };
    expect((await status(token, side)).body.hunt.trend).toBe('same');
    // Inside 1 km too.
    expect((await status(token, north(800))).body.hunt.trend).toBe('closer');
    expect((await status(token, north(600))).body.hunt.trend).toBe('closer');
  });

  test('walking in gives exactly one free clue, at random, within 300 m', async () => {
    await seedTarget();
    await seedNeighbours(5);
    const { token, user } = await createAuthedUser();
    await startOnTarget(token, user);

    const nothing = {
      multiplier: 10, freeClue: null, firstRevealed: false, areaRevealed: false, labels: [], rarity: null,
      district: null, quarter: null, snapshots: [], availableClues: ['rarity', 'label', 'area', 'direction'],
    };
    for (const m of [3500, 2500, 800, 350]) {
      expect((await status(token, north(m))).body.hunt).toMatchObject(nothing);
    }

    let h = (await status(token, north(250))).body.hunt;
    expect(['rarity', 'label', 'area', 'direction']).toContain(h.freeClue);
    // Free: the multiplier and the clue price haven't moved.
    expect(h).toMatchObject({ multiplier: 10, clueMultiplier: 8 });
    expect(h.availableClues).toHaveLength(3);
    expect(h.availableClues).not.toContain(h.freeClue);
    const free = h.freeClue;

    // Never a second one, however close or however often.
    for (const m of [200, 50, 250]) {
      h = (await status(token, north(m))).body.hunt;
      expect(h).toMatchObject({ freeClue: free, multiplier: 10 });
      expect(h.availableClues).toHaveLength(3);
    }
    expect((await User.findById(user._id).lean()).randomDraw.clues).toHaveLength(1);

    // A bought clue after it costs the usual half step.
    expect((await takeClue(token, north(250))).body.draw.hunt.multiplier).toBe(8);
  });

  test('a label that fits too few nearby cards is swapped for one that fits more', async () => {
    await seedTarget({ labels: ['church', 'jewish'] });
    // Six other churches nearby and no other jewish card: only the church
    // label passes the check.
    await seedNeighbours(6, { rarity: 'common', xpReward: 10, labels: ['church'] });
    const { token, user } = await createAuthedUser();
    await startOnTarget(token, user);
    const { firstClue } = (await User.findById(user._id).lean()).randomDraw;
    expect(firstClue).toEqual({ kind: 'label', value: 'church' });
    expect((await User.findById(user._id).lean()).randomDraw.clueLabel).toBe('church');
  });

  test('cards across the river or more than 3 km away do not count for the check', async () => {
    await seedTarget({ labels: ['church'] });
    await seedNeighbours(6, { quarter: 'Malá Strana', rarity: 'common', xpReward: 10, labels: ['park'] });
    for (let i = 0; i < 6; i++) {
      await Location.create({ name: `F${i}`, slug: `f${i}`, coordinates: north(5000), rarity: 'rare', xpReward: 20, labels: ['museum'], quarter: 'Staré Město' });
    }
    const { token, user } = await createAuthedUser();
    await startOnTarget(token, user);
    // Nothing passes; it falls back to the label that fits the most cards
    // (here the only one).
    const { clueLabel } = (await User.findById(user._id).lean()).randomDraw;
    expect(clueLabel).toBe('church');
  });

  test('a card with no usable label gets no label clue', async () => {
    await seedTarget({ labels: ['hidden-gem'] });
    const { token } = await createAuthedUser();
    await startHunt(token);
    const h = (await status(token, north(5000))).body.hunt;
    expect(h.availableClues).toEqual(['rarity', 'area', 'direction']);
  });

  test('the quarter is left out when too few cards in it carry the label', async () => {
    await seedTarget();
    // Plenty of matches nearby, but in the next quarter over.
    await seedNeighbours(6, { quarter: 'Josefov' });
    const { token, user } = await createAuthedUser();
    await startOnTarget(token, user);
    expect((await User.findById(user._id).lean()).randomDraw.showQuarter).toBe(false);
    const h = (await takeClueUntil(token, 'area')).body.draw.hunt;
    expect(h).toMatchObject({ areaRevealed: true, district: 'Praha 1', quarter: null });
  });

  test('clues are drawn at random, cost half a step each, once each, and the direction keeps what it said then', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    await startHunt(token);

    // Without a position the direction is never drawn, and the player's own
    // pick (`key`) is ignored.
    const seen = [];
    const mults = [];
    for (let i = 0; i < 3; i++) {
      const res = await request(app).post('/api/user/random-draw/clue').set('Authorization', `Bearer ${token}`).send({ key: 'direction' });
      expect(res.status).toBe(200);
      seen.push(res.body.clue);
      mults.push(res.body.draw.hunt.multiplier);
    }
    expect([...seen].sort()).toEqual(['area', 'label', 'rarity']);
    expect(mults).toEqual([8, 6, 5]);
    const h = (await status(token)).body.hunt;
    expect(h).toMatchObject({ rarity: 'rare', xpReward: 20, district: 'Praha 1', availableClues: ['direction'] });
    expect(['church', 'gothic']).toContain(h.labels[0]);

    // Only the direction is left: it needs a position.
    expect((await takeClue(token)).status).toBe(400);
    const res = await takeClue(token, north(3000));
    expect(res.body.clue).toBe('direction');
    expect(res.body.draw.hunt).toMatchObject({ multiplier: 4, availableClues: [], clueMultiplier: null });
    expect(res.body.draw.hunt.snapshots).toEqual([{ key: 'direction', direction: 'S' }]);
    // Walking on doesn't change it.
    const later = (await status(token, { lat: CHARLES_BRIDGE.lat - 0.02, lng: CHARLES_BRIDGE.lng })).body.hunt;
    expect(later.snapshots).toEqual([{ key: 'direction', direction: 'S' }]);
    expect((await takeClue(token, north(3000))).status).toBe(409);

    // Found after four clues: 20 x 4.
    const hit = await guess(token, north(50));
    expect(hit.body).toMatchObject({ hit: true, xpEarned: 80, guessAttempt: 1 });
  });

  test('a press works from anywhere; a miss costs a full step and gives its direction', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    await startHunt(token);

    let res = await guess(token, north(5000));
    expect(res.status).toBe(200);
    expect(res.body.hit).toBe(false);
    expect(res.body.draw.hunt).toMatchObject({ multiplier: 6, presses: 1, misses: [{ direction: 'S' }] });

    // Clue then miss: 6 → 5 → 3.
    await takeClue(token);
    res = await guess(token, north(300));
    expect(res.body.draw.hunt).toMatchObject({ multiplier: 3, presses: 2 });
    // The miss keeps no position or distance.
    const raw = await User.collection.findOne({ _id: (await User.findById(user._id))._id });
    expect(raw.randomDraw.misses[1]).not.toHaveProperty('lat');
    expect(raw.randomDraw.misses[1]).not.toHaveProperty('distance');

    // Never below 1x, and misses never end the hunt.
    for (let i = 0; i < 4; i++) res = await guess(token, north(300));
    expect(res.body.draw.hunt.multiplier).toBe(1);
    const hit = await guess(token, north(50));
    expect(hit.body).toMatchObject({ hit: true, xpEarned: 20, guessAttempt: 7 });
    expect(hit.body.draw.location.slug).toBe('target');

    const list = await request(app).get('/api/locations').set('Authorization', `Bearer ${token}`);
    expect(list.body.find(l => l.slug === 'target')._guessAttempt).toBe(7);
  });

  test('a first-press hit pays 10x, however long it took', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    await startHunt(token);
    await User.updateOne({ _id: user._id }, { $set: { 'randomDraw.drawnAt': new Date(Date.now() - 3 * 3600 * 1000) } });
    const hit = await guess(token, north(20));
    expect(hit.body).toMatchObject({ hit: true, xpEarned: 200, guessAttempt: 1 });
    expect(hit.body.draw).toMatchObject({ bonusUsed: true, solvedAttempt: 1, xpEarned: 200 });
  });

  test('collecting the target through a normal check-in pays plain XP and ends the hunt unfound', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    await startHunt(token);
    await status(token, north(2000));
    const res = await checkIn(token, 'target');
    expect(res.body).toMatchObject({ xpEarned: 20, bonusApplied: false });
    expect(res.body.guessAttempt ?? null).toBeNull();

    const s = (await status(token, north(20))).body;
    expect(s).toMatchObject({ active: true, canDraw: false, forfeited: true, bonusUsed: false, hunt: null });
    expect(s.lastHunt.location.slug).toBe('target');
    expect((await guess(token, north(20))).status).toBe(409);
    expect((await takeClue(token, north(20))).status).toBe(409);
    expect((await User.findById(user._id).lean()).randomDraw.trendRef).toBeNull();
  });

  test('keeps the trend reference point only while needed', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    await startHunt(token);
    await status(token, north(2000));
    expect((await User.findById(user._id).lean()).randomDraw.trendRef).toMatchObject({ distance: 2000 });

    // Withdrawing consent erases it; the hunt itself goes on.
    await request(app).put('/api/user/location-consent').set('Authorization', `Bearer ${token}`).send({ granted: false, version: 2 });
    expect((await User.findById(user._id).lean()).randomDraw.trendRef).toBeNull();

    await status(token, north(2000));
    await guess(token, north(20));
    // Found: erased too.
    expect((await User.findById(user._id).lean()).randomDraw.trendRef).toBeNull();
  });

  test('a hunt left over from the old clue mode keeps working', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    await User.updateOne({ _id: user._id }, { $set: { randomDraw: {
      slug: 'target', drawnAt: new Date(), mode: 'hidden', bonusUsed: false, labelOrder: ['church', 'gothic'],
      misses: [{ distance: 1500, direction: 'S' }, { skipped: true }],
    } } });
    // One miss (a full step) and one skip (counted as a clue, half a step);
    // its label clue, once taken, is its first label.
    const h = (await status(token, north(800))).body.hunt;
    expect(h).toMatchObject({ multiplier: 5, presses: 1, misses: [{ direction: 'S' }], labels: [], quarter: null });
    const label = await takeClueUntil(token, 'label');
    expect(label.body.draw.hunt.labels).toEqual(['church']);
    const hit = await guess(token, north(20));
    expect(hit.body).toMatchObject({ hit: true, guessAttempt: 2 });
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
    const res = await status(token);
    expect(res.body).toMatchObject({ active: false, canDraw: true });
    expect(res.body.lastHunt).toBeUndefined();
    expect((await checkIn(token, 'target')).body.xpEarned).toBe(20);
  });

  test('an expired unsolved hunt reveals its answer and drops the reference point', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    await startHunt(token);
    await status(token, north(2000));
    await User.updateOne({ _id: user._id }, { $set: { 'randomDraw.drawnAt': new Date(Date.now() - 25 * 3600 * 1000) } });
    const res = await status(token);
    expect(res.body.active).toBe(false);
    expect(res.body.canDraw).toBe(true);
    expect(res.body.lastHunt.location.slug).toBe('target');
    expect((await User.findById(user._id).lean()).randomDraw.trendRef).toBeNull();
    // After it lapses, a normal check-in is plain 1x.
    expect((await checkIn(token, 'target')).body.xpEarned).toBe(20);
  });

  test('the old re-roll, skip and hardcore routes are gone', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    await startHunt(token);
    for (const path of ['/api/user/random-draw/reroll', '/api/user/random-draw/skip', '/api/user/hardcore-hunt']) {
      expect((await request(app).post(path).set('Authorization', `Bearer ${token}`).send({})).status).toBe(404);
    }
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
