import { test, expect } from '@playwright/test';

const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 40, explorerLevel: 1 };

const LOCKED_LOCATION = {
  _id: '1',
  name: 'Charles Bridge',
  slug: 'charles-bridge',
  localizedNames: { cz: 'Karlův most', zh: '查理大桥' },
  labels: ['bridge', 'historical'],
  coordinates: { lat: 50.0865, lng: 14.4114 },
  rarity: 'legend',
  xpReward: 100,
  coverImage: '',
  pixelArtKey: '',
  unlocked: false,
};

// A tiny valid 1x1 PNG so map tile <img> requests resolve instead of erroring out.
const PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
);

async function loginAsUser(page, user = USER) {
  await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user } }));
}

// Records every navigator.vibrate(pattern) call into window.__vibrateCalls so
// the test can assert the distinct level-up vibration pattern actually fired,
// not just that the modal rendered.
async function spyOnVibrate(page) {
  await page.addInitScript(() => {
    window.__vibrateCalls = [];
    navigator.vibrate = (pattern) => { window.__vibrateCalls.push(pattern); return true; };
  });
}

function vibrateCalls(page) {
  return page.evaluate(() => window.__vibrateCalls);
}

async function mockMapTiles(page) {
  await page.route('https://*.tile.openstreetmap.org/**', route =>
    route.fulfill({ status: 200, contentType: 'image/png', body: PIXEL_PNG })
  );
}

test.use({ permissions: ['geolocation'], geolocation: { latitude: 50.0865, longitude: 14.4114 } });

test.describe('Level-up celebration — Explore page', () => {
  test('a check-in that crosses a level boundary shows the level-up modal and vibrates', async ({ page }) => {
    await loginAsUser(page);
    await spyOnVibrate(page);
    await page.route('**/api/locations', route => route.fulfill({ json: [LOCKED_LOCATION] }));
    await page.route('**/api/locations/charles-bridge', route =>
      route.fulfill({
        json: { ...LOCKED_LOCATION, description: { en: 'A historic stone bridge.', cz: '', zh: '' } },
      })
    );
    await page.route('**/api/checkins/charles-bridge', route =>
      route.fulfill({
        status: 201,
        json: {
          message: 'Checked in!',
          xpEarned: 100,
          totalXP: 140,
          levelInfo: { level: 2, title: 'Tourist', title_cz: 'Turista', title_zh: '游客', progress: 40, nextLevelXP: 240 },
          newAchievements: [],
        },
      })
    );

    await page.goto('/explore');
    await page.locator('.loc-card').first().click();
    await page.locator('.px-modal').getByRole('button', { name: '★ Collect' }).click();

    // The regular check-in summary still shows...
    await expect(page.locator('.px-modal').getByText('COLLECTED!')).toBeVisible();

    // ...and now a dedicated level-up celebration layers on top of it.
    const levelUpModal = page.locator('.levelup-modal');
    await expect(levelUpModal).toBeVisible();
    await expect(levelUpModal.getByText('LEVEL UP!')).toBeVisible();
    await expect(levelUpModal.getByText('LEVEL 2')).toBeVisible();
    await expect(levelUpModal.getByText('Tourist')).toBeVisible();

    await expect.poll(() => vibrateCalls(page)).toContainEqual([90, 50, 90, 50, 90, 50, 260]);

    await levelUpModal.getByRole('button', { name: 'Continue' }).click();
    await expect(levelUpModal).not.toBeVisible();
  });

  test('a check-in that stays within the same level does not show the level-up modal', async ({ page }) => {
    await loginAsUser(page, { ...USER, explorerLevel: 2, totalXP: 100 });
    await spyOnVibrate(page);
    await page.route('**/api/locations', route => route.fulfill({ json: [LOCKED_LOCATION] }));
    await page.route('**/api/locations/charles-bridge', route =>
      route.fulfill({
        json: { ...LOCKED_LOCATION, description: { en: 'A historic stone bridge.', cz: '', zh: '' } },
      })
    );
    await page.route('**/api/checkins/charles-bridge', route =>
      route.fulfill({
        status: 201,
        json: {
          message: 'Checked in!',
          xpEarned: 20,
          totalXP: 120,
          levelInfo: { level: 2, title: 'Tourist', progress: 60, nextLevelXP: 240 },
          newAchievements: [],
        },
      })
    );

    await page.goto('/explore');
    await page.locator('.loc-card').first().click();
    await page.locator('.px-modal').getByRole('button', { name: '★ Collect' }).click();

    await expect(page.locator('.px-modal').getByText('COLLECTED!')).toBeVisible();
    await expect(page.locator('.levelup-modal')).toHaveCount(0);
    expect(await vibrateCalls(page)).not.toContainEqual([90, 50, 90, 50, 90, 50, 260]);
  });

  test('undoing a check-in never shows the level-up modal, even though the server returns levelInfo', async ({ page }) => {
    await loginAsUser(page);
    await spyOnVibrate(page);
    const unlocked = { ...LOCKED_LOCATION, unlocked: true, checkedInAt: '2026-01-01T00:00:00.000Z' };
    await page.route('**/api/locations', route => route.fulfill({ json: [unlocked] }));
    await page.route('**/api/locations/charles-bridge', route =>
      route.fulfill({ json: { ...unlocked, description: { en: 'A historic stone bridge.', cz: '', zh: '' } } })
    );
    await page.route('**/api/checkins/charles-bridge', route =>
      route.fulfill({
        json: { message: 'Check-in removed', totalXP: 0, levelInfo: { level: 1, title: 'Newcomer', progress: 0, nextLevelXP: 80 } },
      })
    );

    await page.goto('/explore');
    await page.locator('.loc-card', { hasText: 'Charles Bridge' }).click();
    await page.locator('.px-modal').getByRole('button', { name: '✕ Uncollect' }).click();

    await expect(page.locator('.px-modal')).not.toBeVisible();
    await expect(page.locator('.levelup-modal')).toHaveCount(0);
  });
});

test.describe('Level-up celebration — Map sidebar', () => {
  test('collecting from the map sidebar also shows the level-up modal', async ({ page }) => {
    await loginAsUser(page);
    await spyOnVibrate(page);
    await mockMapTiles(page);
    await page.route('**/api/locations', route => route.fulfill({ json: [LOCKED_LOCATION] }));
    await page.route('**/api/locations/charles-bridge', route =>
      route.fulfill({
        json: { ...LOCKED_LOCATION, description: { en: 'A historic stone bridge.', cz: '', zh: '' } },
      })
    );
    await page.route('**/api/checkins/charles-bridge', route =>
      route.fulfill({
        status: 201,
        json: {
          message: 'Checked in!',
          xpEarned: 100,
          totalXP: 140,
          levelInfo: { level: 2, title: 'Tourist', progress: 40, nextLevelXP: 240 },
          newAchievements: [],
        },
      })
    );

    await page.goto('/map');
    await expect(page.locator('path.leaflet-interactive')).toHaveCount(1);
    await page.locator('path.leaflet-interactive').first().click();

    const sidebar = page.locator('.map-sidebar');
    await sidebar.getByRole('button', { name: /★ Collect/ }).click();

    const levelUpModal = page.locator('.levelup-modal');
    await expect(levelUpModal).toBeVisible();
    await expect(levelUpModal.getByText('LEVEL 2')).toBeVisible();

    // Both the base unlock feedback and the level-up fanfare should have fired.
    await expect.poll(() => vibrateCalls(page)).toContainEqual([80, 40, 80, 40, 200]); // legend-tier unlock
    await expect.poll(() => vibrateCalls(page)).toContainEqual([90, 50, 90, 50, 90, 50, 260]); // level-up
  });
});
