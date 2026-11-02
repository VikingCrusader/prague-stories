import request from 'supertest';
import app from '../src/app.js';
import Location from '../src/models/Location.js';
import User from '../src/models/User.js';
import CheckIn from '../src/models/CheckIn.js';
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
    // 100 from the card, the rest from the achievements it unlocked.
    const me = await User.findOne({}).sort({ createdAt: -1 }).lean();
    expect(res.body.totalXP).toBe(me.totalXP);
    expect(res.body.totalXP).toBeGreaterThan(100);
    expect(res.body.totalCheckins).toBe(1);
    expect(res.body.presetCheckins).toBe(1);
    expect(res.body.totalPreset).toBe(2);
    expect(res.body.unlockPercent).toBe(50);
    expect(res.body.labelCount).toEqual({ bridge: 1, historical: 1 });
    expect(res.body.rarityCount.legend).toBe(1);
    expect(res.body.levelInfo.level).toBeGreaterThanOrEqual(2);
  });

  test('also counts the city proper on its own (cards without outside)', async () => {
    await Location.create({ name: 'In', slug: 'in', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10 });
    await Location.create({ name: 'In 2', slug: 'in-2', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10 });
    await Location.create({ name: 'Out', slug: 'out', coordinates: CHARLES_BRIDGE, labels: ['castle', 'outside'] });
    const { token } = await createAuthedUser();
    await checkIn(token, 'in');
    await checkIn(token, 'out');

    const res = await request(app).get('/api/user/progress').set('Authorization', `Bearer ${token}`);
    expect(res.body).toMatchObject({ presetCheckins: 2, totalPreset: 3, unlockPercent: 67, cityCheckins: 1, totalCity: 2, cityUnlockPercent: 50 });
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

  test('marks southern-pole as unlocked after checking in there', async () => {
    await Location.create({
      name: 'South Pole of Prague', slug: 'jizni-pol-prahy', coordinates: CHARLES_BRIDGE, rarity: 'rare', xpReward: 20,
    });
    const { token } = await createAuthedUser();
    await checkIn(token, 'jizni-pol-prahy');

    const res = await request(app).get('/api/user/achievements').set('Authorization', `Bearer ${token}`);

    const firstStep = res.body.achievements.find(a => a.id === 'southern-pole');
    expect(firstStep.unlocked).toBe(true);
    expect(firstStep.unlockedAt).not.toBeNull();
  });

  test('unlocks an achievement the user already qualifies for without a new check-in', async () => {
    await Location.create({ name: 'Pole', slug: 'jizni-pol-prahy', coordinates: CHARLES_BRIDGE, rarity: 'rare', xpReward: 20 });
    const { token, user } = await createAuthedUser();
    await checkIn(token, 'jizni-pol-prahy');
    // As if the achievement had been added after that check-in.
    await User.updateOne({ _id: user._id }, { $set: { achievements: [] } });

    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(me.body.user.achievements.map(a => a.id)).toContain('southern-pole');
    // Announced once, with what the banner shows.
    expect(me.body.newAchievements).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'southern-pole', icon: '🐧', name_zh: '为什么南极没有企鹅？' })]));
    const again = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(again.body.newAchievements).toEqual([]);
    const res = await request(app).get('/api/user/achievements').set('Authorization', `Bearer ${token}`);
    expect(res.body.achievements.find(a => a.id === 'southern-pole').unlocked).toBe(true);
    // Stored once, however many times it is synced.
    const stored = (await User.findById(user._id).lean()).achievements.filter(a => a.id === 'southern-pole');
    expect(stored).toHaveLength(1);
  });

  test('Spoilt for Choice counts the most check-ins inside any 5 minutes', async () => {
    const { token, user } = await createAuthedUser();
    const base = Date.parse('2026-10-01T10:00:00Z');
    for (let i = 0; i < 12; i++) {
      const loc = await Location.create({ name: `B${i}`, slug: `b${i}`, coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10 });
      // Nine within 4 minutes, then three more spread out.
      const at = i < 9 ? base + i * 30000 : base + 10 * 60000 + i * 600000;
      await CheckIn.create({ user: user._id, location: loc._id, checkedInAt: new Date(at), xpEarned: 10 });
    }
    let res = await request(app).get('/api/user/achievements').set('Authorization', `Bearer ${token}`);
    let a = res.body.achievements.find(x => x.id === 'spoilt_for_choice');
    expect(a).toMatchObject({ unlocked: false, progress: { current: 9, target: 10 } });

    const tenth = await Location.create({ name: 'B12', slug: 'b12', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10 });
    await CheckIn.create({ user: user._id, location: tenth._id, checkedInAt: new Date(base + 4.5 * 60000), xpEarned: 10 });
    res = await request(app).get('/api/user/achievements').set('Authorization', `Bearer ${token}`);
    a = res.body.achievements.find(x => x.id === 'spoilt_for_choice');
    expect(a).toMatchObject({ unlocked: true, progress: { current: 10, target: 10 } });
  });

  test('day stats use Prague time; a hunt that ran out unlocks Next Time', async () => {
    const { token, user } = await createAuthedUser();
    const north = await Location.create({ name: 'N', slug: 'n', coordinates: { lat: 50.17, lng: 14.42 }, district: 'Praha 8', rarity: 'common', xpReward: 10 });
    const south = await Location.create({ name: 'S', slug: 's', coordinates: { lat: 49.99, lng: 14.42 }, district: 'Praha 12', rarity: 'common', xpReward: 10 });
    // 22:30 UTC on 3 Oct and 03:30 UTC on 4 Oct = 00:30 and 05:30 the same
    // Prague day (CEST), 20 km apart; only the 05:30 one is an early bird.
    await CheckIn.create({ user: user._id, location: north._id, checkedInAt: new Date('2026-10-03T22:30:00Z'), xpEarned: 10 });
    await CheckIn.create({ user: user._id, location: south._id, checkedInAt: new Date('2026-10-04T03:30:00Z'), xpEarned: 10 });
    await User.updateOne({ _id: user._id }, { $set: { randomDraw: {
      slug: 'n', drawnAt: new Date(Date.now() - 25 * 3600 * 1000), bonusUsed: false, forfeited: false, mode: 'hidden',
    } } });

    const res = await request(app).get('/api/user/achievements').set('Authorization', `Bearer ${token}`);
    const get = id => res.body.achievements.find(a => a.id === id);
    expect(get('north_to_south')).toMatchObject({ unlocked: true, progress: { current: 20, target: 15, unit: 'km' } });
    expect(get('early_bird').unlocked).toBe(true);
    expect(get('early_bird').progress).toEqual({ current: 1, target: 1 }); // 00:30 is not counted
    expect(get('night_owl').unlocked).toBe(true); // ...but it is a night owl
    expect(get('next_time').unlocked).toBe(true);
    expect(get('dropping_by').progress).toEqual({ current: 2, target: 5 });
    expect(get('time_traveller').progress.labels).toHaveLength(6);
  });

  test('Back and Forth: six bank switches in 24 h; bridges and outside cards are skipped', async () => {
    const { token, user } = await createAuthedUser();
    const mk = (slug, quarter, labels = []) => Location.create({ name: slug, slug, coordinates: CHARLES_BRIDGE, quarter, labels, rarity: 'common', xpReward: 10 });
    // Old Town side, castle side, a bridge (skipped), Old Town, an outside
    // card (skipped), castle, Old Town, castle: six switches in nine hours.
    const seq = [
      await mk('o1', 'Staré Město'), await mk('c1', 'Malá Strana'), await mk('charles-bridge', 'Staré Město'),
      await mk('o2', 'Nové Město'), await mk('far', null, ['outside']), await mk('c2', 'Smíchov'),
      await mk('o3', 'Vinohrady'), await mk('c3', 'Hradčany'),
    ];
    for (let i = 0; i < seq.length; i++) {
      await CheckIn.create({ user: user._id, location: seq[i]._id, checkedInAt: new Date(Date.UTC(2026, 9, 10, 8 + i)), xpEarned: 10 });
    }
    let res = await request(app).get('/api/user/achievements').set('Authorization', `Bearer ${token}`);
    let get = id => res.body.achievements.find(a => a.id === id);
    expect(get('back_and_forth')).toMatchObject({ unlocked: true, progress: { current: 6, target: 6 } });

    // Same bank twice in a row starts over; a run longer than 24 h doesn't count.
    const other = await createAuthedUser({ username: 'zig', email: 'zig@example.com' });
    const hours = [0, 1, 2, 3, 4, 30];
    const sides = ['o1', 'c1', 'o2', 'c2', 'o3', 'c3'];
    for (let i = 0; i < sides.length; i++) {
      const loc = seq.find(l => l.slug === sides[i]);
      await CheckIn.create({ user: other.user._id, location: loc._id, checkedInAt: new Date(Date.UTC(2026, 9, 10, hours[i])), xpEarned: 10 });
    }
    res = await request(app).get('/api/user/achievements').set('Authorization', `Bearer ${other.token}`);
    get = id => res.body.achievements.find(a => a.id === id);
    expect(get('back_and_forth')).toMatchObject({ unlocked: false, progress: { current: 5, target: 6 } });
  });

  test('day totals and streaks use Prague days', async () => {
    const { token, user } = await createAuthedUser();
    // Seven Prague days in a row (1-7 Oct, 23:30 UTC = 01:30 next day CEST, so
    // 30 Sep 23:30 UTC counts as 1 Oct), then a gap, then one more day.
    const days = ['2026-09-30T23:30:00Z', '2026-10-02T10:00:00Z', '2026-10-03T10:00:00Z', '2026-10-04T10:00:00Z',
      '2026-10-05T10:00:00Z', '2026-10-06T10:00:00Z', '2026-10-07T10:00:00Z', '2026-10-09T10:00:00Z'];
    for (let i = 0; i < days.length; i++) {
      const loc = await Location.create({ name: `D${i}`, slug: `d${i}`, coordinates: CHARLES_BRIDGE, rarity: 'legend', xpReward: 100 });
      await CheckIn.create({ user: user._id, location: loc._id, checkedInAt: new Date(days[i]), xpEarned: i === 1 ? 1000 : 100 });
    }
    const res = await request(app).get('/api/user/achievements').set('Authorization', `Bearer ${token}`);
    const get = id => res.body.achievements.find(a => a.id === id);
    expect(get('rain_or_shine')).toMatchObject({ unlocked: true, progress: { current: 7, target: 7 } });
    expect(get('payday').unlocked).toBe(true);
    expect(get('marathon_day').progress).toEqual({ current: 1, target: 50 });
  });

  test('a guest gets no progress; every achievement has a flavor line and an unlock rate', async () => {
    const res = await request(app).get('/api/user/achievements');
    for (const a of res.body.achievements) {
      expect(a.progress).toBeNull();
      expect(a.flavor).toEqual(expect.any(String));
      expect(a.unlockRate).toBe(0);
    }
    expect(res.body.players).toBe(0);
  });

  test('reports progress, the places done, missing cards and the share of players', async () => {
    for (const slug of ['nemocnice-motol', 'haje', 'jizni-pol-prahy']) {
      await Location.create({ name: slug, slug, coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10 });
    }
    const { token } = await createAuthedUser();
    await checkIn(token, 'nemocnice-motol');
    await checkIn(token, 'jizni-pol-prahy');
    const other = await createAuthedUser();
    await checkIn(other.token, 'haje');

    const res = await request(app).get('/api/user/achievements').set('Authorization', `Bearer ${token}`);
    const metro = res.body.achievements.find(a => a.id === 'subway_maniac');
    expect(metro.progress).toMatchObject({ current: 1, target: 6 });
    expect(metro.progress.places.find(p => p.slug === 'nemocnice-motol')).toMatchObject({ done: true, name: 'nemocnice-motol' });
    expect(metro.progress.places.find(p => p.slug === 'haje')).toMatchObject({ done: false });
    expect(metro.progress.places.find(p => p.slug === 'ikea-zlicin')).toMatchObject({ missing: true, done: false });
    expect(res.body.achievements.find(a => a.id === 'century').progress).toEqual({ current: 2, target: 100 });

    expect(res.body.players).toBe(2);
    expect(res.body.achievements.find(a => a.id === 'southern-pole').unlockRate).toBe(50);
    expect(metro.unlockRate).toBe(0);
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
  // Started 5 km north of Charles Bridge (inside Prague) unless told otherwise.
  async function startHunt(token, pos = north(5000)) {
    return request(app).post('/api/user/random-draw').set('Authorization', `Bearer ${token}`).send(pos);
  }
  const status = (token, pos) => request(app).get('/api/user/random-draw').query(pos).set('Authorization', `Bearer ${token}`);
  const guess = (token, pos) =>
    request(app).post('/api/user/random-draw/guess').set('Authorization', `Bearer ${token}`).send(pos);
  const takeClue = (token, pos) =>
    request(app).post('/api/user/random-draw/clue').set('Authorization', `Bearer ${token}`).send(pos || {});
  test('hides the location and starts with nothing but the distance', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    const res = await startHunt(token, north(5000));
    expect(res.status).toBe(200);
    expect(res.body.mode).toBe('hidden');
    expect(res.body.location).toBeNull();
    expect(res.body.hunt).toMatchObject({
      multiplier: 10, missMultiplier: 3, clueMultiplier: 5, presses: 0, nextClue: 'side',
      riverSide: null, reading: { about: 5000 }, nextFree: { at: 3000, what: 'side' },
      rarity: null, xpReward: null, labels: [], district: null, quarter: null,
      freeClues: [], snapshots: [], misses: [],
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

  test('starts only from a position inside Prague', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    expect((await startHunt(token, {})).body.code).toBe('positionRequired');
    // Brno, then just past the city line at Zbraslav's southern edge.
    const brno = await startHunt(token, { lat: 49.1951, lng: 16.6068 });
    expect(brno.status).toBe(403);
    expect(brno.body.code).toBe('outsidePrague');
    expect((await startHunt(token, { lat: 49.93, lng: 14.40 })).status).toBe(403);
    expect((await User.findById(user._id).lean()).randomDraw?.slug ?? null).toBeNull();
    // Inside, on the edge of town (Ďáblice) as well as in the centre.
    expect((await startHunt(token, { lat: 50.155, lng: 14.48 })).body.active).toBe(true);
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
    await startHunt(token);
    expect((await status(token, north(2500))).body.hunt.riverSide).toBe('castle');
  });

  test('never hides the treasure on a bridge or island', async () => {
    await seedTarget({ slug: 'charles-bridge' });
    await Location.create({ name: 'Kampa', slug: 'kampa-island', coordinates: CHARLES_BRIDGE, rarity: 'common', xpReward: 10, labels: ['park'], quarter: 'Malá Strana' });
    const { token } = await createAuthedUser();
    const res = await startHunt(token);
    expect(res.body.noneLeft).toBe(true);
  });

  test('the distance: whole km, then half km within 3 km, then bands, never closer than 300 m', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    await startHunt(token);
    const reading = async m => (await status(token, north(m))).body.hunt.reading;
    expect(await reading(12400)).toEqual({ about: 12000 });
    expect(await reading(6400)).toEqual({ about: 6000 });
    expect(await reading(5800)).toEqual({ about: 6000 });
    expect(await reading(3400)).toEqual({ about: 3000 });
    expect(await reading(2800)).toEqual({ about: 3000 });
    expect(await reading(2600)).toEqual({ about: 2500 });
    expect(await reading(1700)).toEqual({ about: 1500 });
    expect(await reading(1100)).toEqual({ about: 1000 });
    expect(await reading(800)).toEqual({ band: [500, 1000] });
    expect(await reading(400)).toEqual({ band: [300, 500] });
    expect(await reading(250)).toEqual({ within: 300 });
    // No "within 100 m": that would tell the player a press can't miss.
    expect(await reading(50)).toEqual({ within: 300 });
  });

  test('says closer or farther after each step, until 500 m out', async () => {
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
    expect((await status(token, north(800))).body.hunt.trend).toBe('closer');
    expect((await status(token, north(600))).body.hunt.trend).toBe('closer');
    // Inside 500 m: none.
    expect((await status(token, north(450))).body.hunt.trend).toBeNull();
    expect((await status(token, north(250))).body.hunt.trend).toBeNull();
  });

  test('walking in gives the clues in order: bank, district, quarter, then the label or the rarity', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    await startHunt(token);

    expect((await status(token, north(3400))).body.hunt).toMatchObject({ riverSide: null, freeClues: [] });
    let h = (await status(token, north(2500))).body.hunt;
    expect(h).toMatchObject({
      multiplier: 10, riverSide: 'oldTown', district: null, freeClues: [{ key: 'side', within: 3000 }],
      nextFree: { at: 1000, what: 'district' }, nextClue: 'district',
    });
    h = (await status(token, north(800))).body.hunt;
    expect(h).toMatchObject({ district: 'Praha 1', quarter: null, nextFree: { at: 500, what: 'quarter' } });
    h = (await status(token, north(400))).body.hunt;
    expect(h).toMatchObject({ quarter: 'Staré Město', labels: [], rarity: null, nextFree: { at: 300, what: 'rarityOrLabel' } });

    h = (await status(token, north(250))).body.hunt;
    expect(h.freeClues).toHaveLength(4);
    const close = h.freeClues[3];
    expect(['rarity', 'label']).toContain(close.key);
    expect(close.within).toBe(300);
    // The other one can only be bought.
    const other = close.key === 'rarity' ? 'label' : 'rarity';
    expect(h).toMatchObject({ multiplier: 10, nextFree: null, nextClue: other, clueMultiplier: 5 });
    if (close.key === 'rarity') expect(h).toMatchObject({ rarity: 'rare', xpReward: 20, labels: [] });
    else expect(['church', 'gothic']).toContain(h.labels[0]);

    // Never more for walking, however close or however often.
    for (const m of [200, 50, 250]) {
      expect((await status(token, north(m))).body.hunt.freeClues).toHaveLength(4);
    }
    expect((await User.findById(user._id).lean()).randomDraw.clues).toHaveLength(4);
    const res = await takeClue(token, north(250));
    expect(res.body.clue).toBe(other);
    expect(res.body.draw.hunt).toMatchObject({ multiplier: 5, nextClue: null, clueMultiplier: null, rarity: 'rare' });
    expect(res.body.draw.hunt.labels).toHaveLength(1);
  });

  test('buying gets the next clue early; walking then skips what was bought', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    await startHunt(token);
    const keys = [];
    const mults = [];
    for (let i = 0; i < 3; i++) {
      // The player's own pick (`key`) is ignored.
      const res = await request(app).post('/api/user/random-draw/clue').set('Authorization', `Bearer ${token}`).send({ key: 'rarity' });
      keys.push(res.body.clue);
      mults.push(res.body.draw.hunt.multiplier);
    }
    expect(keys).toEqual(['side', 'district', 'quarter']);
    expect(mults).toEqual([5, 3, 2]);
    // Nothing new until 300 m, where the 4th comes free.
    let h = (await status(token, north(800))).body.hunt;
    expect(h).toMatchObject({ multiplier: 2, freeClues: [], quarter: 'Staré Město', nextFree: { at: 300, what: 'rarityOrLabel' } });
    h = (await status(token, north(250))).body.hunt;
    expect(h.freeClues).toHaveLength(1);
    expect(h.multiplier).toBe(2);
    // Then the last one, bought.
    expect((await takeClue(token)).body.draw.hunt).toMatchObject({ multiplier: 1, nextClue: null });
    expect((await takeClue(token)).status).toBe(409);
    // Found after four bought clues: 1x.
    expect((await guess(token, north(50))).body).toMatchObject({ hit: true, xpEarned: 20, guessAttempt: 1 });
  });

  test('a card with no labels gets the rarity at 300 m and nothing after it', async () => {
    await seedTarget({ labels: [] });
    const { token } = await createAuthedUser();
    await startHunt(token);
    const h = (await status(token, north(250))).body.hunt;
    expect(h).toMatchObject({ rarity: 'rare', labels: [], nextClue: null, clueMultiplier: null });
  });

  test('a press works from anywhere; a miss costs two rungs and gives its direction', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    await startHunt(token);

    let res = await guess(token, north(5000));
    expect(res.status).toBe(200);
    expect(res.body.hit).toBe(false);
    expect(res.body.draw.hunt).toMatchObject({ multiplier: 3, presses: 1, misses: [{ direction: 'S' }] });

    // Clue then miss: 3 → 2 → 1.
    await takeClue(token);
    res = await guess(token, north(400));
    expect(res.body.draw.hunt).toMatchObject({ multiplier: 1, presses: 2 });
    // The miss keeps no position or distance.
    const raw = await User.collection.findOne({ _id: (await User.findById(user._id))._id });
    expect(raw.randomDraw.misses[1]).not.toHaveProperty('lat');
    expect(raw.randomDraw.misses[1]).not.toHaveProperty('distance');

    // Never below 1x, and misses never end the hunt.
    for (let i = 0; i < 4; i++) res = await guess(token, north(400));
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
    // A 10x find earns Bounty Hunter; three hours is too slow for Fast and Curious.
    expect(hit.body.newAchievements.map(a => a.id)).toContain('bounty_hunter');
    expect(hit.body.newAchievements.map(a => a.id)).not.toContain('fast_and_curious');
  });

  test('a find below 10x does not earn Bounty Hunter', async () => {
    await seedTarget();
    const { token } = await createAuthedUser();
    await startHunt(token);
    await takeClue(token);
    const hit = await guess(token, north(20));
    expect(hit.body).toMatchObject({ hit: true, xpEarned: 100 });
    expect(hit.body.newAchievements.map(a => a.id)).not.toContain('bounty_hunter');
    // Found straight away: well within the hour.
    expect(hit.body.newAchievements.map(a => a.id)).toContain('fast_and_curious');
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

  test('a hunt dealt before the rework keeps working', async () => {
    await seedTarget();
    const { token, user } = await createAuthedUser();
    await User.updateOne({ _id: user._id }, { $set: { randomDraw: {
      slug: 'target', drawnAt: new Date(), mode: 'hidden', bonusUsed: false, labelOrder: ['church', 'gothic'],
      misses: [{ distance: 1500, direction: 'S' }, { skipped: true }], clues: [{ key: 'area' }, { key: 'label' }],
    } } });
    // One miss (two rungs), one skip and two clues (a rung each): 1x. It
    // keeps its river side, its area and its first label.
    const h = (await status(token, north(5000))).body.hunt;
    expect(h).toMatchObject({
      multiplier: 1, presses: 1, misses: [{ direction: 'S' }], riverSide: 'oldTown',
      district: 'Praha 1', quarter: 'Staré Město', labels: ['church'], nextClue: 'rarity',
    });
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
    await request(app).post('/api/user/random-draw').set('Authorization', `Bearer ${token}`).send({ mode: 'hidden', ...CHARLES_BRIDGE });
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

  test('is for signed-in users only', async () => {
    expect((await request(app).get('/api/user/leaderboard')).status).toBe(401);
    expect((await request(app).get('/api/user/explorers/ada')).status).toBe(401);
  });

  test('ranks users with XP, ties sharing a rank, without emails or hidden accounts', async () => {
    await seedUsers();
    const { token } = await createAuthedUser();
    const res = await request(app).get('/api/user/leaderboard').set('Authorization', `Bearer ${token}`);
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
    const res = await request(app).get('/api/user/leaderboard').set('Authorization', `Bearer ${token}`);
    const row = res.body.entries.find(e => e.username === user.username);
    expect(row.cards).toBe(2);
    expect(row.totalXP).toBe((await User.findById(user._id).lean()).totalXP); // 20 from cards + achievements
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

    const viewer = await createAuthedUser({ username: 'viewer', email: 'viewer@example.com' });
    const res = await request(app).get(`/api/user/explorers/${encodeURIComponent(user.username)}`).set('Authorization', `Bearer ${viewer.token}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ username: user.username, rank: 1, totalCards: 3, isMe: false });
    expect(res.body.totalXP).toBe((await User.findById(user._id).lean()).totalXP);
    expect(res.body.rarityCount).toMatchObject({ rare: 1, common: 1 });
    expect(res.body.cards.map(c => c.slug).sort()).toEqual(['a', 'b']);
    expect(res.body.cards[0]).toMatchObject({ unlocked: true });
    expect(res.body.cards[0].description).toBeUndefined();
    // Two of three city cards: a quarter and half of the city (an early-bird
    // unlock may join them when the tests run between 4:00 and 7:00 in Prague).
    expect(res.body.achievements.map(a => a.id)).toEqual(expect.arrayContaining(['a_quarter', 'half_the_city']));
    expect(res.body.achievements.map(a => a.id)).not.toContain('the_last_mile');
    expect(JSON.stringify(res.body)).not.toContain(user.email);

    const own = await request(app).get(`/api/user/explorers/${encodeURIComponent(user.username)}`).set('Authorization', `Bearer ${token}`);
    expect(own.body.isMe).toBe(true);
  });

  test('404s for hidden, zero-XP and unknown users', async () => {
    await User.create({ username: 'admin000', email: 'a@example.com', password: 'secret123', totalXP: 500, hideFromLeaderboard: true });
    await User.create({ username: 'newbie', email: 'n@example.com', password: 'secret123', totalXP: 0 });
    const { token } = await createAuthedUser();
    for (const name of ['admin000', 'newbie', 'nobody']) {
      expect((await request(app).get(`/api/user/explorers/${name}`).set('Authorization', `Bearer ${token}`)).status).toBe(404);
    }
  });
});
