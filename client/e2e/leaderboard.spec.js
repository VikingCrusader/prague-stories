import { test, expect } from '@playwright/test';

const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 140, explorerLevel: 2 };

const row = (rank, username, totalXP, isMe = false) => ({
  rank, username, totalXP, cards: Math.round(totalXP / 20), level: 2, title: 'Apprentice Explorer', title_zh: '见习探索者', isMe,
});

test.describe('Leaderboard', () => {
  test('lists explorers by XP and highlights your own row', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
    await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
    await page.route('**/api/user/leaderboard', route => route.fulfill({
      json: { entries: [row(1, 'ada', 11310), row(2, 'bob', 460), row(2, 'cyd', 460)], me: row(140, 'explorer', 140, true), total: 141 },
    }));

    // The way in is a button on the dashboard (not the navbar, since 2026-11-02).
    await page.route('**/api/user/progress', route => route.fulfill({ json: {
      totalCheckins: 0, presetCheckins: 0, totalPreset: 10, unlockPercent: 0, labelCount: {}, rarityCount: {},
      levelInfo: { level: 2, title: 'Apprentice Explorer', progress: 40, nextLevelXP: 200 }, totalXP: 140,
    } }));
    await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: [], levels: [] } }));
    await page.route('**/api/user/treasures', route => route.fulfill({ json: [] }));
    await page.goto('/dashboard');
    await expect(page.locator('.navbar').getByRole('link', { name: 'Ranking' })).toHaveCount(0);
    await page.getByRole('link', { name: 'Ranking' }).click();
    await expect(page).toHaveURL(/\/leaderboard$/);
    await expect(page.getByRole('heading', { name: 'Leaderboard' })).toBeVisible();
    await expect(page.getByText('141 explorers with XP')).toBeVisible();

    const rows = page.locator('table.leaderboard tbody tr');
    await expect(rows).toHaveCount(5); // three entries, a gap row, and your own row
    await expect(rows.nth(0)).toContainText('ada');
    await expect(rows.nth(0)).toContainText('11,310');
    await expect(rows.nth(0).locator('.leaderboard__cards')).toHaveText('566');
    await expect(rows.nth(2).locator('.leaderboard__rank')).toHaveText('2');
    await expect(page.locator('.leaderboard__me')).toContainText('explorer');
    await expect(page.locator('.leaderboard__me .leaderboard__you')).toHaveText('you');
  });

  test('guests can\'t see it: no button on the dashboard, the pages send them to log in', async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('guest', 'true'));
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.route('**/api/user/progress', route => route.fulfill({ json: {
      totalCheckins: 0, presetCheckins: 0, totalPreset: 10, unlockPercent: 0, labelCount: {}, rarityCount: {},
      levelInfo: { level: 1, title: 'Newcomer', progress: 0, nextLevelXP: 100 }, totalXP: 0,
    } }));
    await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: [], levels: [] } }));
    await page.goto('/dashboard');
    await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ranking' })).toHaveCount(0);
    await page.goto('/leaderboard');
    await expect(page).toHaveURL(/\/login$/);
    await page.goto('/explorer/ada');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('clicking a name opens that explorer\'s profile and collection', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
    await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.route('**/api/user/leaderboard', route => route.fulfill({ json: { entries: [row(1, 'ada', 11310)], me: null, total: 1 } }));
    const card = (slug, name, rarity) => ({ _id: slug, slug, name, localizedNames: {}, labels: ['church'], rarity, xpReward: 20, coverImage: '', pixelArtKey: '', coordinates: { lat: 50.08, lng: 14.42 }, unlocked: true });
    await page.route('**/api/user/explorers/ada', route => route.fulfill({ json: {
      username: 'ada', totalXP: 11310, rank: 1, totalCards: 1300, totalAchievements: 20, isMe: false,
      levelInfo: { level: 6, title: 'Cartographer', progress: 50, nextLevelXP: 20000 },
      rarityCount: { common: 0, rare: 1, superior: 0, epic: 1, mythic: 0, legend: 0 },
      achievements: [{ id: 'first', name: 'First Steps', description: 'x', icon: '🥾', unlocked: true, unlockedAt: '2026-01-01' }],
      cards: [card('tyn-church', 'Týn Church', 'epic'), card('st-giles', 'St. Giles', 'rare')],
    } }));
    await page.goto('/leaderboard');
    await page.getByRole('link', { name: 'ada' }).click();
    await expect(page).toHaveURL(/\/explorer\/ada$/);
    await expect(page.getByRole('heading', { name: 'ada' })).toBeVisible();
    await expect(page.getByText('#1')).toBeVisible();
    await expect(page.getByText('2 / 1,300')).toBeVisible();
    await expect(page.locator('.location-grid .loc-card')).toHaveCount(2);
    await expect(page.locator('.location-grid')).toContainText('Týn Church');
    await page.getByRole('link', { name: '← Leaderboard' }).click();
    await expect(page).toHaveURL(/\/leaderboard$/);
  });

  test('an unknown explorer shows a not-found message', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
    await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.route('**/api/user/explorers/ghost', route => route.fulfill({ status: 404, json: { message: 'Explorer not found' } }));
    await page.goto('/explorer/ghost');
    await expect(page.getByText('This explorer could not be found.')).toBeVisible();
  });
});
