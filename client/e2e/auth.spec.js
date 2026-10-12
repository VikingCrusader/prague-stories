import { test, expect } from '@playwright/test';

test.describe('Guest access', () => {
  test('visiting the app with no session auto-continues as guest and lands on Explore', async ({ page }) => {
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.goto('/');

    await expect(page).toHaveURL(/\/explore$/);
    await expect(page.getByRole('heading', { name: 'Login to Explore Prague!' })).toBeVisible();
    // Guests get a Login button in the navbar, not XP/logout.
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('an unknown route redirects back to Explore', async ({ page }) => {
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.goto('/some/nonexistent/path');

    await expect(page).toHaveURL(/\/explore$/);
  });
});

test.describe('Register', () => {
  test('successful registration logs the user in and redirects to Explore', async ({ page }) => {
    await page.route('**/api/auth/register', route =>
      route.fulfill({
        json: {
          token: 'fake-jwt-token',
          user: { _id: 'u1', username: 'newadventurer', email: 'new@example.com', totalXP: 0, explorerLevel: 1 },
        },
      })
    );
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));

    await page.goto('/register');
    await page.locator('input[name="username"]').fill('newadventurer');
    await page.locator('input[name="email"]').fill('new@example.com');
    await page.locator('input[name="password"]').fill('secret123');
    await page.getByRole('button', { name: '▶ Start Exploring' }).click();

    await expect(page).toHaveURL(/\/explore$/);
    await expect(page.getByText('0 XP · Lv 1')).toBeVisible();
  });

  test('registering with a taken email shows the server error', async ({ page }) => {
    await page.route('**/api/auth/register', route =>
      route.fulfill({ status: 409, json: { message: 'Email already registered' } })
    );

    await page.goto('/register');
    await page.locator('input[name="username"]').fill('duplicate');
    await page.locator('input[name="email"]').fill('taken@example.com');
    await page.locator('input[name="password"]').fill('secret123');
    await page.getByRole('button', { name: '▶ Start Exploring' }).click();

    await expect(page.getByText('Email already registered')).toBeVisible();
    await expect(page).toHaveURL(/\/register$/);
  });
});

test.describe('Login', () => {
  test('wrong credentials show an inline error and keep the user on the login page', async ({ page }) => {
    await page.route('**/api/auth/login', route =>
      route.fulfill({ status: 401, json: { message: 'Invalid email or password' } })
    );

    await page.goto('/login');
    await page.locator('input[name="email"]').fill('nobody@example.com');
    await page.locator('input[name="password"]').fill('wrongpass');
    await page.getByRole('button', { name: '▶ Enter Prague' }).click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('successful login redirects to Explore and shows XP in the navbar', async ({ page }) => {
    await page.route('**/api/auth/login', route =>
      route.fulfill({
        json: {
          token: 'fake-jwt-token',
          user: { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 40, explorerLevel: 2 },
        },
      })
    );
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));

    await page.goto('/login');
    await page.locator('input[name="email"]').fill('e@example.com');
    await page.locator('input[name="password"]').fill('secret123');
    await page.getByRole('button', { name: '▶ Enter Prague' }).click();

    await expect(page).toHaveURL(/\/explore$/);
    await expect(page.getByText('40 XP · Lv 2')).toBeVisible();
  });

  test('the guest fallback link on the login page skips auth entirely', async ({ page }) => {
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));

    await page.goto('/login');
    await page.getByRole('button', { name: 'Continue without login' }).click();

    await expect(page).toHaveURL(/\/explore$/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });
});

test.describe('Logout', () => {
  test('logging out clears the session and returns to the login page', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
    await page.route('**/api/auth/me', route =>
      route.fulfill({ json: { user: { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 40, explorerLevel: 2 } } })
    );
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));

    await page.goto('/explore');
    await expect(page.getByText('40 XP · Lv 2')).toBeVisible();

    // Logout lives on the Profile page, not in the navbar.
    await page.route('**/api/user/progress', route => route.fulfill({ json: {
      levelInfo: { level: 2, title: 'Wanderer', progress: 10, nextLevelXP: 100 },
      totalXP: 40, totalCheckins: 0, unlockPercent: 0, labelCount: {}, rarityCount: {}, totalPreset: 0,
    } }));
    await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: [], levels: [] } }));
    await page.getByRole('link', { name: 'Profile' }).click();
    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
  });
});

test.describe('Signed-in user and a cold-starting API', () => {
  test('a failed /auth/me is retried, and the guest title gives way to the signed-in one', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
    let calls = 0;
    await page.route('**/api/auth/me', route => {
      calls += 1;
      // The dev server runs React StrictMode, which fires the initial check
      // twice, so fail the first two calls.
      return calls <= 2
        ? route.fulfill({ status: 503, body: 'waking up' })
        : route.fulfill({ json: { user: { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 40, explorerLevel: 1 } } });
    });
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));

    await page.goto('/explore');
    await expect(page.getByRole('heading', { name: 'Login to Explore Prague!' })).toBeVisible();
    // The background retry (5 s) signs the user in without a reload.
    await expect(page.getByRole('heading', { name: 'Login to Explore Prague!' })).toHaveCount(0, { timeout: 10000 });
    await expect(page.getByText('40 XP', { exact: false }).first()).toBeVisible();

    // A later reload in the same tab starts signed in, not as a leftover guest.
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Login to Explore Prague!' })).toHaveCount(0);
  });
});
