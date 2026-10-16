import { jest } from '@jest/globals';
import request from 'supertest';

const mockGenerateLocationDescription = jest.fn();
jest.unstable_mockModule('../src/services/claudeService.js', () => ({
  generateLocationDescription: mockGenerateLocationDescription,
}));

const { default: app } = await import('../src/app.js');
const { default: Location } = await import('../src/models/Location.js');
const { default: CheckIn } = await import('../src/models/CheckIn.js');
const { connectTestDB, closeTestDB, clearTestDB } = await import('./testUtils/db.js');
const { createAuthedUser } = await import('./testUtils/auth.js');

beforeAll(connectTestDB);
afterAll(closeTestDB);
afterEach(() => {
  mockGenerateLocationDescription.mockReset();
  return clearTestDB();
});

const CHARLES_BRIDGE = { lat: 50.0865, lng: 14.4114 };

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

describe('GET /api/locations', () => {
  test('excludes the description field and marks everything locked for a guest', async () => {
    await createLocation({ description: { en: 'A bridge.', cz: 'Most.', zh: '桥。' } });

    const res = await request(app).get('/api/locations');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].description).toBeUndefined();
    expect(res.body[0].unlocked).toBe(false);
  });

  test('marks a location unlocked when the authenticated user has checked in', async () => {
    const location = await createLocation();
    const { token, user } = await createAuthedUser();
    await CheckIn.create({ user: user._id, location: location._id });

    const res = await request(app).get('/api/locations').set('Authorization', `Bearer ${token}`);

    expect(res.body[0].unlocked).toBe(true);
  });

  test('filters by the labels query param', async () => {
    await createLocation({ slug: 'charles-bridge', labels: ['bridge'] });
    await createLocation({ slug: 'a-park', name: 'A Park', labels: ['park'] });

    const res = await request(app).get('/api/locations?labels=park');

    expect(res.body).toHaveLength(1);
    expect(res.body[0].slug).toBe('a-park');
  });
});

describe('GET /api/locations/:slug', () => {
  test('404s for an unknown slug', async () => {
    const res = await request(app).get('/api/locations/does-not-exist');
    expect(res.status).toBe(404);
  });

  test('returns the full location including description when present', async () => {
    await createLocation({ description: { en: 'A bridge.', cz: 'Most.', zh: '桥。' } });

    const res = await request(app).get('/api/locations/charles-bridge');

    expect(res.status).toBe(200);
    expect(res.body.description.en).toBe('A bridge.');
    expect(mockGenerateLocationDescription).not.toHaveBeenCalled();
  });

  test('lazily generates and persists a missing description', async () => {
    await createLocation();
    mockGenerateLocationDescription.mockResolvedValue({ en: 'Generated EN', cz: 'Generated CZ', zh: 'Generated ZH' });

    const res = await request(app).get('/api/locations/charles-bridge');

    expect(res.status).toBe(200);
    expect(res.body.description.en).toBe('Generated EN');
    expect(mockGenerateLocationDescription).toHaveBeenCalledTimes(1);

    const stored = await Location.findOne({ slug: 'charles-bridge' });
    expect(stored.description.en).toBe('Generated EN');
  });

  test('still returns the location if AI description generation fails', async () => {
    await createLocation();
    mockGenerateLocationDescription.mockRejectedValue(new Error('Gemini is down'));

    const res = await request(app).get('/api/locations/charles-bridge');

    expect(res.status).toBe(200);
    expect(res.body.description.en).toBe('');
  });

  test('reflects unlocked + checkedInAt for the authenticated user', async () => {
    const location = await createLocation({ description: { en: 'A bridge.', cz: 'Most.', zh: '桥。' } });
    const { token, user } = await createAuthedUser();
    await CheckIn.create({ user: user._id, location: location._id });

    const res = await request(app).get('/api/locations/charles-bridge').set('Authorization', `Bearer ${token}`);

    expect(res.body.unlocked).toBe(true);
    expect(res.body.checkedInAt).not.toBeNull();
    expect(res.body.guessAttempt).toBeNull();
  });

  test('sends an uncollected card only the opening of its story', async () => {
    const story = l => ['Opening.', 'Second.', 'Third.', 'Fourth.', 'Bonus.'].map(x => `${l} ${x}`).join('\n\n');
    const location = await createLocation({ description: { en: story('EN'), cz: story('CZ'), zh: story('ZH') } });
    const guest = await request(app).get('/api/locations/charles-bridge');
    expect(guest.body.storyLocked).toBe(true);
    expect(guest.body.description.en).toBe('EN Opening.\n\nEN Second.');
    expect(guest.body.description.zh).toBe('ZH Opening.\n\nZH Second.');
    expect(JSON.stringify(guest.body)).not.toContain('Bonus');

    const { token, user } = await createAuthedUser();
    expect((await request(app).get('/api/locations/charles-bridge').set('Authorization', `Bearer ${token}`)).body.storyLocked).toBe(true);
    await CheckIn.create({ user: user._id, location: location._id });
    const mine = await request(app).get('/api/locations/charles-bridge').set('Authorization', `Bearer ${token}`);
    expect(mine.body.storyLocked).toBeUndefined();
    expect(mine.body.description.en).toBe(story('EN'));
  });

  test('the user who added a card can read its whole story', async () => {
    const { token, user } = await createAuthedUser();
    await createLocation({ addedBy: user._id, description: { en: 'One.\n\nTwo.\n\nThree.\n\nFour.', cz: '', zh: '' } });
    const res = await request(app).get('/api/locations/charles-bridge').set('Authorization', `Bearer ${token}`);
    expect(res.body.storyLocked).toBeUndefined();
    expect(res.body.description.en).toContain('Four.');
  });

  test('reports the treasure-hunt guess and XP for a card found on a hunt', async () => {
    const location = await createLocation({ description: { en: 'A bridge.', cz: 'Most.', zh: '桥。' } });
    const { token, user } = await createAuthedUser();
    await CheckIn.create({ user: user._id, location: location._id, guessAttempt: 2, xpEarned: 500 });

    const res = await request(app).get('/api/locations/charles-bridge').set('Authorization', `Bearer ${token}`);

    expect(res.body.guessAttempt).toBe(2);
    expect(res.body.xpEarned).toBe(500);
  });
});

describe('POST /api/locations', () => {
  test('401s without auth', async () => {
    const res = await request(app).post('/api/locations').send({ name: 'New Place', coordinates: CHARLES_BRIDGE });
    expect(res.status).toBe(401);
  });

  test('400s when name or coordinates are missing', async () => {
    const { token } = await createAuthedUser();
    const res = await request(app)
      .post('/api/locations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Place' });
    expect(res.status).toBe(400);
  });

  test('creates a location with a generated slug and rarity-synced XP', async () => {
    const { token, user } = await createAuthedUser();
    const res = await request(app)
      .post('/api/locations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Place!', coordinates: CHARLES_BRIDGE, rarity: 'epic' });

    expect(res.status).toBe(201);
    expect(res.body.slug).toMatch(/^new-place-\d+$/);
    expect(res.body.rarity).toBe('epic');
    expect(res.body.xpReward).toBe(50);
    expect(res.body.addedBy).toBe(user._id);
  });

  test('defaults to common rarity when none or an invalid one is given', async () => {
    const { token } = await createAuthedUser();
    const res = await request(app)
      .post('/api/locations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Place', coordinates: CHARLES_BRIDGE, rarity: 'not-a-real-rarity' });

    expect(res.body.rarity).toBe('common');
    expect(res.body.xpReward).toBe(10);
  });

  test('makes an outside card expedition, priced by its distance, whatever rarity is sent', async () => {
    const { token } = await createAuthedUser();
    const res = await request(app)
      .post('/api/locations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Far Castle', labels: ['castle', 'outside'], coordinates: { lat: 49.0, lng: 14.4 }, rarity: 'legend' });

    expect(res.body.rarity).toBe('expedition');
    expect(res.body.xpReward).toBe(240); // ~121 km from Charles Bridge
  });
});

describe('PUT /api/locations/:slug', () => {
  test('401s without auth', async () => {
    await createLocation();
    const res = await request(app).put('/api/locations/charles-bridge').send({ name: 'Renamed' });
    expect(res.status).toBe(401);
  });

  test('404s for an unknown slug', async () => {
    const { token } = await createAuthedUser();
    const res = await request(app)
      .put('/api/locations/does-not-exist')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Renamed' });
    expect(res.status).toBe(404);
  });

  test('updates fields and keeps rarity/xpReward in sync', async () => {
    await createLocation();
    const { token } = await createAuthedUser();

    const res = await request(app)
      .put('/api/locations/charles-bridge')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Karlův most',
        rarity: 'mythic',
        localizedNames: { cz: 'Karlův most', zh: '查理大桥' },
        coordinates: { lat: 50.1, lng: 14.5 },
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Karlův most');
    expect(res.body.rarity).toBe('mythic');
    expect(res.body.xpReward).toBe(70);
    expect(res.body.localizedNames.cz).toBe('Karlův most');
    expect(res.body.coordinates.lat).toBe(50.1);
  });

  test('adding the outside label turns a card into expedition, removing it drops it to common', async () => {
    await createLocation();
    const { token } = await createAuthedUser();
    const put = body => request(app).put('/api/locations/charles-bridge').set('Authorization', `Bearer ${token}`).send(body);

    let res = await put({ labels: ['castle', 'outside'], coordinates: { lat: 50.3, lng: 14.4 } });
    expect(res.body.rarity).toBe('expedition');
    expect(res.body.xpReward).toBe(60); // ~24 km

    res = await put({ rarity: 'mythic' });
    expect(res.body.rarity).toBe('expedition'); // a city tier can't be picked for an outside card

    res = await put({ labels: ['castle'] });
    expect(res.body.rarity).toBe('common');
    expect(res.body.xpReward).toBe(10);
  });

  test("refuses to change the story of a card the user hasn't collected", async () => {
    const location = await createLocation({ description: { en: 'A bridge.', cz: 'Most.', zh: '桥。' } });
    const { token, user } = await createAuthedUser();
    const put = () => request(app).put('/api/locations/charles-bridge').set('Authorization', `Bearer ${token}`)
      .send({ description: { en: 'Changed.' } });
    expect((await put()).status).toBe(403);
    await CheckIn.create({ user: user._id, location: location._id });
    const ok = await put();
    expect(ok.status).toBe(200);
    expect(ok.body.description.en).toBe('Changed.');
  });
});

describe('DELETE /api/locations/:slug', () => {
  test('401s without auth', async () => {
    await createLocation();
    const res = await request(app).delete('/api/locations/charles-bridge');
    expect(res.status).toBe(401);
  });

  test('404s for an unknown slug', async () => {
    const { token } = await createAuthedUser();
    const res = await request(app).delete('/api/locations/does-not-exist').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  test('deletes the location and any of its check-ins', async () => {
    const location = await createLocation();
    const { token, user } = await createAuthedUser();
    await CheckIn.create({ user: user._id, location: location._id });

    const res = await request(app).delete('/api/locations/charles-bridge').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(await Location.findOne({ slug: 'charles-bridge' })).toBeNull();
    expect(await CheckIn.find({ location: location._id })).toHaveLength(0);
  });
});

describe('POST /api/locations/:slug/cover', () => {
  test('401s without auth', async () => {
    await createLocation();
    const res = await request(app).post('/api/locations/charles-bridge/cover');
    expect(res.status).toBe(401);
  });

  test('400s when no file is attached', async () => {
    await createLocation();
    const { token } = await createAuthedUser();
    const res = await request(app)
      .post('/api/locations/charles-bridge/cover')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  test('404s for an unknown slug even with a file attached', async () => {
    const { token } = await createAuthedUser();
    const res = await request(app)
      .post('/api/locations/does-not-exist/cover')
      .set('Authorization', `Bearer ${token}`)
      .attach('cover', Buffer.from('not-really-an-image'), { filename: 'cover.png', contentType: 'image/png' });
    expect(res.status).toBe(404);
  });
});
