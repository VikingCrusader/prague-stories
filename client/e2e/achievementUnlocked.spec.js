import { test, expect } from '@playwright/test';

const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 140, explorerLevel: 2 };
const ach = (id, name) => ({ id, icon: '🐧', name, name_cz: name, name_zh: name, flavor: `${name} flavor.`, unlockedAt: '2026-11-02T10:00:00.000Z' });

test('achievements unlocked on app load are announced one after another; a tap opens the list', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER, newAchievements: [ach('a', 'First One'), ach('b', 'Second One')] } }));
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
  await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: [], players: 0, levels: [], newAchievements: [] } }));

  await page.goto('/explore');
  const banner = page.locator('.ach-unlock__banner');
  await expect(banner).toContainText('Achievement unlocked');
  await expect(banner).toContainText('First One');
  await expect(banner).toContainText('First One flavor.');

  // Closing it brings the next one.
  await page.locator('.ach-unlock__close').click();
  await expect(banner).toContainText('Second One');

  await banner.click();
  await expect(page).toHaveURL(/\/achievements$/);
  await expect(page.locator('.ach-unlock')).toHaveCount(0);
});
