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

async function loginAsUser(page) {
  await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
}

test.use({ permissions: ['geolocation'], geolocation: { latitude: 50.0865, longitude: 14.4114 } });

test.describe('Check-in flow', () => {
  test('checking in awards XP, flips the card, and shows a toast', async ({ page }) => {
    await loginAsUser(page);
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
          levelInfo: { level: 2, title: 'Apprentice Explorer', progress: 40, nextLevelXP: 300 },
          newAchievements: [],
        },
      })
    );

    await page.goto('/explore');
    await page.locator('.loc-card').first().click();

    const modal = page.locator('.px-modal');
    await modal.getByRole('button', { name: '★ Collect' }).click();

    await expect(modal.getByText('COLLECTED!')).toBeVisible();
    await expect(modal.locator('p', { hasText: '+100 XP' })).toBeVisible();
    await expect(page.getByText('+100 XP earned! Apprentice Explorer')).toBeVisible();

    // This check-in also crosses a level boundary (1 → 2), so the level-up
    // celebration layers on top and must be dismissed first — see
    // levelup.spec.js for dedicated coverage of that modal itself.
    await page.locator('.levelup-modal').getByRole('button', { name: 'Continue' }).click();

    await page.locator('.px-modal__close').click();
    await expect(page.locator('.loc-card--locked')).toHaveCount(0);
    await expect(page.locator('.loc-card__name')).toHaveText('Charles Bridge');
  });

  test('a check-in that unlocks an achievement shows both toasts', async ({ page }) => {
    await loginAsUser(page);
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
          levelInfo: { level: 2, title: 'Apprentice Explorer', progress: 40, nextLevelXP: 300 },
          newAchievements: [{ id: 'first_checkin', unlockedAt: new Date().toISOString() }],
        },
      })
    );

    await page.goto('/explore');
    await page.locator('.loc-card').first().click();
    await page.locator('.px-modal').getByRole('button', { name: '★ Collect' }).click();

    await expect(page.getByText('+100 XP earned! Apprentice Explorer')).toBeVisible();
    await expect(page.getByText('Achievement unlocked: first checkin')).toBeVisible();
  });
});
