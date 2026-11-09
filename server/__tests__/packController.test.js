import request from 'supertest';

const { default: app } = await import('../src/app.js');
const { default: Location } = await import('../src/models/Location.js');
const { default: CheckIn } = await import('../src/models/CheckIn.js');
const { default: User } = await import('../src/models/User.js');
const { PACKS, PACK_UNLOCK_XP, packCompleteXp } = await import('../src/data/packs.js');
const { connectTestDB, closeTestDB, clearTestDB } = await import('./testUtils/db.js');
const { createAuthedUser } = await import('./testUtils/auth.js');

beforeAll(connectTestDB);
afterAll(closeTestDB);
afterEach(clearTestDB);

const PACK = PACKS.find(p => p.slug === 'vysehrad');
const members = PACK.members;

async function seedMembers() {
  await Location.insertMany(members.map((slug, i) => ({
    slug,
    name: slug,
    labels: ['church'],
    coordinates: { lat: 50.06 + i / 1000, lng: 14.41 },
    description: { en: 'x', cz: 'x', zh: 'x' },
    quarter: 'Vyšehrad',
    district: 'Praha 2',
  })));
}
const auth = token => ['Authorization', `Bearer ${token}`];
const checkIn = (token, slug) => request(app).post(`/api/checkins/${slug}`).set(...auth(token)).send({ lat: 0, lng: 0 });

describe('card packs', () => {
  const env = process.env.NODE_ENV;
  beforeAll(() => { process.env.NODE_ENV = 'development'; });
  afterAll(() => { process.env.NODE_ENV = env; });

  test('a guest sees the preview only, with no cards collected', async () => {
    await seedMembers();
    const res = await request(app).get('/api/packs/vysehrad');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ total: members.length, collected: 0, unlocked: false, storyLocked: true });
    expect(res.body.description.en.length).toBeLessThan(PACK.description.en.length);
    expect(res.body.quarters).toEqual(['Vyšehrad']);
    expect(res.body.memberSlugs).toEqual(members);
  });

  test('the third card unlocks the pack once, and the text comes with it', async () => {
    await seedMembers();
    const { token, user } = await createAuthedUser();
    await checkIn(token, members[0]);
    const second = await checkIn(token, members[1]);
    expect(second.body.newPacks).toEqual([]);
    const third = await checkIn(token, members[2]);
    expect(third.body.newPacks).toHaveLength(1);
    expect(third.body.newPacks[0]).toMatchObject({ slug: 'vysehrad', stage: 'unlock', xp: PACK_UNLOCK_XP, collected: 3 });
    const fourth = await checkIn(token, members[3]);
    expect(fourth.body.newPacks).toEqual([]);
    const res = await request(app).get('/api/packs/vysehrad').set(...auth(token));
    expect(res.body).toMatchObject({ collected: 4, unlocked: true, storyLocked: false });
    expect(res.body.description.en).toBe(PACK.description.en);
    expect((await User.findById(user._id)).packs).toHaveLength(1);
  });

  test('the last card pays by the number of cards', async () => {
    await seedMembers();
    const { token } = await createAuthedUser();
    let last;
    for (const slug of members) last = await checkIn(token, slug);
    expect(last.body.newPacks[0]).toMatchObject({ stage: 'complete', xp: packCompleteXp(members.length) });
    const list = await request(app).get('/api/packs').set(...auth(token));
    expect(list.body.find(p => p.slug === 'vysehrad')).toMatchObject({ completed: true });
  });

  test('app load settles earlier check-ins and pays only once', async () => {
    await seedMembers();
    const { token, user } = await createAuthedUser();
    const locs = await Location.find({ slug: { $in: members.slice(0, 3) } });
    await CheckIn.insertMany(locs.map(l => ({ user: user._id, location: l._id, xpEarned: 10 })));
    const before = (await User.findById(user._id)).totalXP;
    const first = await request(app).get('/api/auth/me').set(...auth(token));
    expect(first.body.newPacks.map(p => p.slug)).toEqual(['vysehrad']);
    const second = await request(app).get('/api/auth/me').set(...auth(token));
    expect(second.body.newPacks).toEqual([]);
    expect((await User.findById(user._id)).totalXP - before).toBeGreaterThanOrEqual(PACK_UNLOCK_XP);
    expect((await User.findById(user._id)).packs).toHaveLength(1);
  });

  test('a card names its packs', async () => {
    await seedMembers();
    const res = await request(app).get(`/api/locations/${members[0]}`);
    expect(res.body.packs.map(p => p.slug)).toEqual(['vysehrad']);
  });

  test('no slug is listed twice in a pack', () => {
    for (const p of PACKS) expect(new Set(p.members).size).toBe(p.members.length);
  });
});
