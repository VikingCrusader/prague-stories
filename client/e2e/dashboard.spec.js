import { test, expect } from '@playwright/test';

const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 140, explorerLevel: 2 };

const PROGRESS = {
  totalCheckins: 5,
  presetCheckins: 4,
  totalPreset: 10,
  unlockPercent: 40,
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
      icon: '🥾', unlocked: true, unlockedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'ten_checkins', name: 'Getting Serious', name_cz: '', name_zh: '',
      description: 'Check in to ten locations.', description_cz: '', description_zh: '',
      icon: '🎯', unlocked: false, unlockedAt: null,
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
  await page.goto('/dashboard');
});

test.describe('Dashboard', () => {
  test('shows level, XP, and stat cards for a logged-in explorer', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Explorer Dashboard' })).toBeVisible();
    await expect(page.locator('.level-badge__num')).toHaveText('LVL 2');
    await expect(page.locator('.level-badge__title')).toHaveText('Apprentice Explorer');
    await expect(page.getByText('140 / 200')).toBeVisible();
    await expect(page.getByText('of 10 location cards')).toBeVisible();
    await expect(page.getByText('1 / 2')).toBeVisible(); // achievements unlocked count
  });

  test('clicking an unlocked achievement opens a modal with its name, description, and date', async ({ page }) => {
    await page.locator('.ach-badge--unlocked').first().click();

    const modal = page.locator('.px-modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('First Steps')).toBeVisible();
    await expect(modal.getByText('Check in to your first location.')).toBeVisible();
    await expect(modal.getByText('1/1/2026')).toBeVisible();

    await page.locator('.px-modal__close').click();
    await expect(modal).not.toBeVisible();
  });

  test('clicking a locked achievement shows it as LOCKED with no unlock date', async ({ page }) => {
    await page.locator('.ach-badge--locked').first().click();

    const modal = page.locator('.px-modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Getting Serious')).toBeVisible();
    await expect(modal.getByText('LOCKED')).toBeVisible();
  });
});
