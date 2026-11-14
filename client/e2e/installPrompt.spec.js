import { test, expect, devices } from '@playwright/test';

// The one-time "put it on your home screen" card after signing up
// (InstallPrompt.jsx, utils/installPrompt.js).

const { defaultBrowserType, ...pixel } = devices['Pixel 7'];

async function register(page) {
  await page.route('**/api/auth/register', route => route.fulfill({
    json: { token: 'fake-jwt-token', user: { _id: 'u1', username: 'newadventurer', email: 'new@example.com', totalXP: 0, explorerLevel: 1 } },
  }));
  await page.route('**/api/auth/me', route => route.fulfill({
    json: { user: { _id: 'u1', username: 'newadventurer', email: 'new@example.com', totalXP: 0, explorerLevel: 1 } },
  }));
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
  await page.goto('/register');
  await page.locator('input[name="username"]').fill('newadventurer');
  await page.locator('input[name="email"]').fill('new@example.com');
  await page.locator('input[name="password"]').fill('secret123');
  await page.getByRole('button', { name: '▶ Start Exploring' }).click();
  await expect(page).toHaveURL(/\/explore$/);
}

test.describe('on a phone', () => {
  test.use(pixel);

  test('after signing up it waits for the alerts opt-in, then shows once; Show me how opens the Guide\'s Install window', async ({ page }) => {
    // Headless Chromium answers "denied" without asking; a phone browser starts at "default".
    await page.addInitScript(() => {
      window.Notification = class { static permission = 'default'; static requestPermission() { return Promise.resolve('default'); } };
    });
    await register(page);
    const card = page.locator('.install-prompt');
    // The alerts opt-in comes first, and the two never stack.
    await expect(page.getByText('Enable location alerts?')).toBeVisible();
    await expect(card).toHaveCount(0);
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(card).toBeVisible();
    await expect(card).toContainText('Put Praguedex on your home screen');
    await card.getByRole('button', { name: 'Show me how' }).click();
    await expect(page).toHaveURL(/\/guide\?open=install/);
    await expect(card).toHaveCount(0);

    // Answered once, it never comes back.
    await page.goto('/explore');
    await expect(page.locator('.navbar')).toBeVisible();
    await page.waitForTimeout(500);
    await expect(card).toHaveCount(0);
  });

  test('Not now puts it away for good', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('prox-notif-asked', '1'));
    await register(page);
    const card = page.locator('.install-prompt');
    await card.getByRole('button', { name: 'Not now' }).click();
    await expect(card).toHaveCount(0);
    await page.reload();
    await expect(page.locator('.navbar')).toBeVisible();
    await page.waitForTimeout(500);
    await expect(card).toHaveCount(0);
  });

  test('a player who signs in (not up) is not asked', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('prox-notif-asked', '1');
      localStorage.setItem('token', 'fake-jwt-token');
    });
    await page.route('**/api/auth/me', route => route.fulfill({
      json: { user: { _id: 'u1', username: 'old', email: 'o@example.com', totalXP: 0, explorerLevel: 1 } },
    }));
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.goto('/explore');
    await expect(page.locator('.navbar')).toBeVisible();
    await page.waitForTimeout(500);
    await expect(page.locator('.install-prompt')).toHaveCount(0);
  });
});

test('on a computer, signing up asks nothing', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('prox-notif-asked', '1'));
  await register(page);
  await page.waitForTimeout(500);
  await expect(page.locator('.install-prompt')).toHaveCount(0);
});
