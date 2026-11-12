import { test, expect } from '@playwright/test';

// The card animations switch lives in the profile's settings: it turns the
// cards' loops off everywhere, is remembered across reloads, and the cards still
// show when it is off.
const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 140, explorerLevel: 2 };
const LOC = { _id: '1', name: 'Charles Bridge', slug: 'charles-bridge', labels: ['bridge'], coordinates: { lat: 50.08, lng: 14.41 }, rarity: 'legend', xpReward: 100, coverImage: '', pixelArtKey: '', unlocked: true };

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/user/progress', route => route.fulfill({ json: { totalCheckins: 0, presetCheckins: 0, totalPreset: 1, unlockPercent: 0, cityCheckins: 0, totalCity: 1, cityUnlockPercent: 0, labelCount: {}, rarityCount: {}, levelInfo: { level: 2, title: 'T', progress: 10, nextLevelXP: 200 }, totalXP: 140, rank: 1, week: { cards: 0, xp: 0, rankChange: { delta: 0 } }, recentFinds: { treasure: { count: 0, cards: [] }, expedition: { count: 0, cards: [] } }, districtProgress: [] } }));
  await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: [] } }));
  await page.route('**/api/user/treasures', route => route.fulfill({ json: [] }));
  await page.route('**/api/packs', route => route.fulfill({ json: [] }));
  await page.route('**/api/locations', route => route.fulfill({ json: [LOC] }));
});

const motionSwitch = page => page.locator('.settings-window .settings-row', { hasText: 'Card animations' }).locator('.settings-switch');
const openSettings = async page => { await page.getByRole('button', { name: 'Settings' }).click(); await expect(page.locator('.settings-window')).toBeVisible(); };

test('the settings switch turns card animations off, remembers it, and keeps the cards visible', async ({ page }) => {
  await page.goto('/dashboard');
  await openSettings(page);
  await expect(motionSwitch(page)).toHaveAttribute('aria-pressed', 'true');
  await motionSwitch(page).click();
  await expect(motionSwitch(page)).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press('Escape');
  await expect(page.locator('.settings-window')).toHaveCount(0);

  await page.goto('/explore');
  const card = page.locator('.loc-card').first();
  await expect(card).toBeVisible();
  expect(await card.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await expect(card).toHaveCSS('opacity', '1');

  await page.goto('/dashboard');
  await openSettings(page);
  await expect(motionSwitch(page)).toHaveAttribute('aria-pressed', 'false');
  await motionSwitch(page).click();
  await expect(motionSwitch(page)).toHaveAttribute('aria-pressed', 'true');
});
