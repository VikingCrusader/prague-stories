import { test, expect } from '@playwright/test';

const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 140, explorerLevel: 2 };

const PROGRESS = {
  totalCheckins: 5,
  presetCheckins: 4,
  totalPreset: 10,
  unlockPercent: 40,
  cityCheckins: 3,
  totalCity: 8,
  cityUnlockPercent: 38,
  labelCount: { historical: 2, church: 1 },
  rarityCount: { common: 1, rare: 2, superior: 1, epic: 0, mythic: 0, legend: 1 },
  levelInfo: { level: 2, title: 'Apprentice Explorer', progress: 40, nextLevelXP: 200 },
  totalXP: 140,
};

const ACHIEVEMENTS = {
  achievements: [
    {
      id: 'first_checkin', name: 'First Steps', name_cz: 'První kroky', name_zh: '第一步',
      description: 'Check in to your first location.', description_cz: '', description_zh: '',
      flavor: 'Every collection starts somewhere.', icon: '🥾', unlocked: true, unlockedAt: '2026-01-01T00:00:00.000Z',
      unlockRate: 12.5, difficulty: 'easy', progress: { current: 1, target: 1 },
    },
    {
      id: 'ten_checkins', name: 'Getting Serious', name_cz: '', name_zh: '',
      description: 'Check in to ten locations.', description_cz: '', description_zh: '',
      flavor: 'Ten is a start.', icon: '🎯', unlocked: false, unlockedAt: null,
      unlockRate: 40, difficulty: 'easy', progress: { current: 5, target: 10 },
    },
  ],
  levels: [
    { level: 1, title: 'Newcomer', xpRequired: 0 },
    { level: 2, title: 'Apprentice Explorer', xpRequired: 100 },
  ],
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/user/progress', route => route.fulfill({ json: PROGRESS }));
  await page.route('**/api/user/achievements', route => route.fulfill({ json: ACHIEVEMENTS }));
  await page.route('**/api/user/treasures', route => route.fulfill({ json: [] }));
  await page.goto('/dashboard');
});

test.describe('Dashboard', () => {
  test('shows level, XP, and stat cards for a logged-in explorer', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Explorer Profile' })).toBeVisible();
    await expect(page.locator('.level-badge__num')).toHaveText('LVL 2');
    await expect(page.locator('.level-badge__title')).toHaveText('Apprentice Explorer');
    await expect(page.getByText('140 / 200')).toBeVisible();
    // The ring is the city share; the number is every card, with both totals.
    await expect(page.locator('.stat-card--ring svg')).toContainText('38%');
    await expect(page.locator('.stat-card--ring .stat-card__value')).toHaveText('4');
    await expect(page.getByText('8 cards in Prague, 2 outside')).toBeVisible();
    await expect(page.getByText('1 / 2')).toBeVisible(); // achievements unlocked count
  });

  test('levels are listed from the navbar XP figure, not on the profile', async ({ page }) => {
    await expect(page.getByText('1 / 2')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Explorer Levels' })).toHaveCount(0);
    // The treasure-hunt finds section is gone (2026-11-02).
    await expect(page.getByRole('heading', { name: /Treasure Hunt Finds/ })).toHaveCount(0);

    await page.locator('.navbar__user').click();
    const modal = page.locator('.levels-modal');
    await expect(modal.getByRole('heading', { name: 'Explorer Levels' })).toBeVisible();
    await expect(modal.locator('.levels-modal__level')).toHaveCount(2);
    await expect(modal.getByText('Apprentice Explorer')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modal).toHaveCount(0);

    // The profile's level badge opens the same list (the navbar figure is
    // hidden on phones).
    await page.locator('.level-badge').click();
    await expect(page.locator('.levels-modal .levels-modal__level')).toHaveCount(2);
  });

  test('shows the share unlocked and the rarest achievements; a tile opens the detail', async ({ page }) => {
    await expect(page.getByText('1 of 2 unlocked (50%)')).toBeVisible();
    const tiles = page.locator('.ach-showcase .ach-tile');
    await expect(tiles).toHaveCount(1); // only unlocked ones
    await expect(tiles.first()).toContainText('First Steps');
    await expect(tiles.first()).not.toContainText('of players');   // share hidden for now
    await expect(page.getByRole('link', { name: 'All achievements →' })).toHaveAttribute('href', '/achievements');

    await tiles.first().click();
    const modal = page.locator('.ach-modal');
    await expect(modal.getByText('Check in to your first location.')).toBeVisible();
    await expect(modal.getByText('Unlocked 1 Jan 2026')).toBeVisible();
    await page.locator('.px-modal__close').click();
    await expect(modal).toHaveCount(0);
  });
});
