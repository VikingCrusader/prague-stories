import request from 'supertest';
import app from '../../src/app.js';

let counter = 0;

export async function createAuthedUser(overrides = {}) {
  counter += 1;
  const payload = {
    username: overrides.username || `user${Date.now()}${counter}`,
    email: overrides.email || `user${Date.now()}${counter}@test.com`,
    password: overrides.password || 'password123',
  };
  const res = await request(app).post('/api/auth/register').send(payload);
  return { token: res.body.token, user: res.body.user, credentials: payload };
}
