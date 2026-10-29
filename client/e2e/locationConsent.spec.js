import { test, expect } from '@playwright/test';

// GDPR: nothing may ask the browser for a position before the user agrees.
// Starts with no stored decision (the config pre-agrees for other specs) and
// counts every call into navigator.geolocation.

const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 40, explorerLevel: 1 };

test.use({
  storageState: { cookies: [], origins: [] },
  permissions: ['geolocation'],
  geolocation: { latitude: 50.0865, longitude: 14.4114 },
});

async function setUp(page) {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'fake-jwt-token');
    window.__geoCalls = 0;
    const geo = navigator.geolocation;
    for (const fn of ['getCurrentPosition', 'watchPosition']) {
      const orig = geo[fn].bind(geo);
      geo[fn] = (...args) => { window.__geoCalls += 1; return orig(...args); };
    }
  });
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
  await page.route('**/api/user/location-consent', route =>
    route.fulfill({ json: { locationConsent: JSON.parse(route.request().postData()) } }));
}

const geoCalls = page => page.evaluate(() => window.__geoCalls);

test('asks before any location request, and "Not now" keeps the GPS untouched', async ({ page }) => {
  await setUp(page);
  await page.goto('/explore');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('May we use your location?')).toBeVisible();
  expect(await geoCalls(page)).toBe(0);

  const saved = page.waitForRequest('**/api/user/location-consent');
  await dialog.getByRole('button', { name: 'Not now' }).click();
  expect(JSON.parse((await saved).postData())).toEqual({ granted: false, version: 2 });
  await expect(dialog).toBeHidden();

  await page.reload();
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.waitForTimeout(500);
  expect(await geoCalls(page)).toBe(0);
});

test('location is used only after "Allow", and can be withdrawn on the Privacy page', async ({ page }) => {
  await setUp(page);
  await page.goto('/explore');
  expect(await geoCalls(page)).toBe(0);
  await page.getByRole('dialog').getByRole('button', { name: 'Allow location' }).click();
  await expect.poll(() => geoCalls(page)).toBeGreaterThan(0);

  await page.goto('/privacy');
  await expect(page.getByText(/^Allowed since/)).toBeVisible();
  // (Signing in again on the reload also saves the earlier "allow".)
  const saved = page.waitForRequest(r => r.url().endsWith('/api/user/location-consent') && r.postData()?.includes('"granted":false'));
  await page.getByRole('button', { name: 'Withdraw consent' }).click();
  expect(JSON.parse((await saved).postData())).toEqual({ granted: false, version: 2 });
  await expect(page.getByText(/^Turned off since/)).toBeVisible();

  await page.goto('/explore');
  await page.waitForTimeout(500);
  expect(await geoCalls(page)).toBe(0);
});
