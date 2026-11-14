import { test, expect } from '@playwright/test';

// Whatever backend happens to be running must not add its packs to the grid.
test.beforeEach(({ page }) => page.route('**/api/packs', route => route.fulfill({ json: [] })));

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
  test('checking in awards XP, flips the card, and shows the reward with its progress', async ({ page }) => {
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
          achievementGains: [{ id: 'bridge_walker', icon: '🌉', difficulty: 'medium', name: 'Bridge Walker', before: 2, current: 3, target: 10 }],
          moreAchievementGains: 2,
          packProgress: [{ slug: 'old-town-square', name: 'Old Town Square', collected: 1, total: 12, unlocked: false, unlockAt: 3 }],
        },
      })
    );

    await page.goto('/explore');
    await page.locator('.loc-card').first().click();

    const modal = page.locator('.px-modal');
    // Within 50 m, opening a locked card collects it automatically (no Collect click).

    await expect(modal.getByText('COLLECTED!')).toBeVisible();
    await expect(modal.locator('p', { hasText: '+100 XP' })).toBeVisible();
    const reward = page.locator('.ci-reward');
    await expect(reward).toContainText('+100 XP');
    await expect(reward).toContainText('Lv 2 · Apprentice Explorer');
    await expect(reward).toContainText('Bridge Walker');
    await expect(reward).toContainText('3/10');
    await expect(reward).toContainText('and 2 more moved on');
    await expect(reward).toContainText('Old Town Square');
    await expect(reward).toContainText('2 more to open it');

    // This check-in also crosses a level boundary (1 → 2), so the level-up
    // celebration layers on top and must be dismissed first — see
    // levelup.spec.js for dedicated coverage of that modal itself.
    await page.locator('.levelup-modal').getByRole('button', { name: 'Continue' }).click();

    await page.locator('.px-modal__close').click();
    await expect(page.locator('.loc-card--locked')).toHaveCount(0);
    await expect(page.locator('.loc-card__name')).toHaveText('Charles Bridge');
  });

  test('a check-in that unlocks an achievement shows the XP reward and the achievement banner', async ({ page }) => {
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
          newAchievements: [{ id: 'southern-pole', icon: '🐧', name: 'South Pole', name_cz: 'Jižní pól', name_zh: '南极', flavor: 'No penguins.', unlockedAt: new Date().toISOString() }],
        },
      })
    );

    await page.goto('/explore');
    await page.locator('.loc-card').first().click();
    // Within 50 m, opening a locked card collects it automatically (no Collect click).

    await expect(page.locator('.ci-reward')).toContainText('+100 XP');
    // Level 1 -> 2: the level-up modal comes first and the banner waits for it.
    await page.waitForTimeout(1500);
    await expect(page.locator('.levelup-modal')).toBeVisible();
    await expect(page.locator('.ach-unlock__banner')).toHaveCount(0);
    await page.locator('.levelup-modal .px-btn--gold').click();
    await expect(page.locator('.ach-unlock__banner')).toContainText('South Pole');
  });
});
