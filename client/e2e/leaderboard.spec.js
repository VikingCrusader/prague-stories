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

  test('clicking a name opens that explorer\'s profile, laid out like your own, without their whole collection', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
    await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.route('**/api/user/leaderboard', route => route.fulfill({ json: { entries: [row(1, 'ada', 11310)], me: null, total: 1 } }));
    const card = (slug, name, rarity) => ({ slug, name, localizedNames: {}, labels: ['castle', 'outside'], rarity, coverImage: '', pixelArtKey: '' });
    await page.route('**/api/user/explorers/ada', route => route.fulfill({ json: {
      username: 'ada', isMe: false, joinedAt: '2026-01-01',
      progress: {
        totalCheckins: 2, presetCheckins: 2, totalPreset: 1300, unlockPercent: 0, cityCheckins: 0, totalCity: 1100, cityUnlockPercent: 0,
        districtProgress: [{ district: 'Praha 1', total: 40, collected: 0 }],
        labelCount: { castle: 2 }, rarityCount: { common: 0, rare: 0, superior: 0, epic: 0, mythic: 0, legend: 0, expedition: 2 },
        levelInfo: { level: 6, title: 'Cartographer', progress: 50, nextLevelXP: 20000 }, totalXP: 11310, rank: 1,
        recentFinds: { treasure: { count: 0, cards: [] }, expedition: { count: 2, cards: [card('karlstejn', 'Karlštejn', 'expedition'), card('melnik', 'Mělník', 'expedition')] } },
      },
      achievements: [
        { id: 'first', name: 'First Steps', description: 'x', icon: '🥾', difficulty: 'easy', unlocked: true, unlockedAt: '2026-01-01', progress: null },
        { id: 'ten', name: 'Ten', description: 'y', icon: '🎯', difficulty: 'easy', unlocked: false, unlockedAt: null, progress: null },
      ],
    } }));
    await page.goto('/leaderboard');
    await page.getByRole('link', { name: 'ada' }).click();
    await expect(page).toHaveURL(/\/explorer\/ada$/);
    await expect(page.getByRole('heading', { name: 'ada', exact: true })).toBeVisible();
    await expect(page.locator('.level-badge__num')).toHaveText('LVL 6');
    await expect(page.locator('.week-card__item--rank .week-card__n')).toHaveText('#1');
    await expect(page.locator('.rarity-compact')).toBeVisible();
    await expect(page.locator('.ach-showcase .ach-tile')).toHaveCount(1);
    // Their achievements heading isn't a link to the viewer's own list.
    await expect(page.locator('h2.px-title', { hasText: 'Achievements' })).toBeVisible();
    await expect(page.locator('h2.px-title a')).toHaveCount(0);
    const exp = page.locator('.card-strip').filter({ hasText: 'Expeditions' });
    await expect(exp.locator('.card-strip__item')).toHaveCount(2);
    await expect(exp.getByRole('link', { name: 'All →' })).toHaveCount(0);
    // No nudge to the viewer's own treasure hunt, just the plain line.
    const treasure = page.locator('.card-strip').filter({ hasText: 'Treasure Hunt Finds' });
    await expect(treasure).toContainText('No treasure found yet.');
    await expect(treasure.getByRole('link')).toHaveCount(0);
    await expect(page.locator('.district-progress__row')).toHaveCount(1);
    await expect(page.locator('.location-grid')).toHaveCount(0); // no full collection
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
