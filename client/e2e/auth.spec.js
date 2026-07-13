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
    await expect(page.getByText('0XP LV1')).toBeVisible();
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
    await expect(page.getByText('40XP LV2')).toBeVisible();
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
    await expect(page.getByText('40XP LV2')).toBeVisible();

    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
  });
});
