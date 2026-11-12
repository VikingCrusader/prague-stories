import { test, expect } from '@playwright/test';

// While the list is on its way the page shows placeholder rows, not a spinner.
test('achievements: placeholder rows while loading, no spinner', async ({ page }) => {
  await page.route('**/api/packs', route => route.fulfill({ json: [] }));
  let release;
  const held = new Promise(r => { release = r; });
  await page.route('**/api/user/achievements', async route => {
    await held;
    route.fulfill({ json: { achievements: [], players: 0, levels: [], newAchievements: [], achievementProgress: null } });
  });
  await page.goto('/achievements');
  await expect(page.locator('.ach-row--ghost')).toHaveCount(8);
  await expect(page.locator('.spinner')).toHaveCount(0);
  release();
  await expect(page.locator('.ach-row--ghost')).toHaveCount(0);
});

test('achievements: the first rows drop in once the list arrives', async ({ page }) => {
  await page.route('**/api/packs', route => route.fulfill({ json: [] }));
  const ach = Array.from({ length: 20 }, (_, i) => ({
    id: `a${i}`, name: `Achievement ${i}`, flavor: 'x', icon: '🏅', difficulty: 'easy',
    unlocked: false, progress: { current: 0, target: 1 }, description: 'd', historyEvents: [],
  }));
  await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: ach, players: 1, levels: [], newAchievements: [], achievementProgress: null } }));
  await page.goto('/achievements');
  await expect(page.locator('.ach-list > li[data-enter-brick]')).toHaveCount(12);
  const running = await page.locator('.ach-list > li').first().evaluate(el => el.getAnimations().length);
  expect(running).toBeGreaterThan(0);
});
