import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import { connectTestDB, closeTestDB, clearTestDB } from './testUtils/db.js';

beforeAll(connectTestDB);
afterAll(closeTestDB);
afterEach(clearTestDB);

describe('POST /api/auth/register', () => {
  test('creates a user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'novak',
      email: 'novak@test.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.username).toBe('novak');
    expect(res.body.user.email).toBe('novak@test.com');
    expect(res.body.user.totalXP).toBe(0);
    expect(res.body.user.explorerLevel).toBe(1);
    expect(res.body.user.password).toBeUndefined();
  });

  test('persists a bcrypt-hashed password, not the plaintext', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'novak',
      email: 'novak@test.com',
      password: 'password123',
    });

    const stored = await User.findOne({ email: 'novak@test.com' });
    expect(stored.password).not.toBe('password123');
    expect(await stored.comparePassword('password123')).toBe(true);
  });

  test.each([
    ['username', { email: 'a@test.com', password: 'password123' }],
    ['email', { username: 'novak', password: 'password123' }],
    ['password', { username: 'novak', email: 'a@test.com' }],
  ])('400s when %s is missing', async (_field, body) => {
    const res = await request(app).post('/api/auth/register').send(body);
    expect(res.status).toBe(400);
  });

  test('409s on duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'novak', email: 'dupe@test.com', password: 'password123',
    });
    const res = await request(app).post('/api/auth/register').send({
      username: 'someoneelse', email: 'dupe@test.com', password: 'password123',
    });
    expect(res.status).toBe(409);
  });

  test('409s on duplicate username', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'dupeuser', email: 'a@test.com', password: 'password123',
    });
    const res = await request(app).post('/api/auth/register').send({
      username: 'dupeuser', email: 'b@test.com', password: 'password123',
    });
    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      username: 'novak', email: 'novak@test.com', password: 'password123',
    });
  });

  test('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'novak@test.com', password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.email).toBe('novak@test.com');
  });

  test('401s on wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'novak@test.com', password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });

  test('401s on unknown email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'ghost@test.com', password: 'password123',
    });
    expect(res.status).toBe(401);
  });

  test('400s when email or password is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'novak@test.com' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  test('returns the authenticated user', async () => {
    const register = await request(app).post('/api/auth/register').send({
      username: 'novak', email: 'novak@test.com', password: 'password123',
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${register.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe('novak');
  });

  test('401s without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('401s with an invalid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });
});
