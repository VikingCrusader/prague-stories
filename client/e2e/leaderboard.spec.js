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

    await page.goto('/explore');
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

  test('guests can look, with a nudge to log in', async ({ page }) => {
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.route('**/api/user/leaderboard', route => route.fulfill({ json: { entries: [row(1, 'ada', 11310)], me: null, total: 1 } }));
    await page.goto('/leaderboard');
    await expect(page.locator('table.leaderboard tbody tr')).toHaveCount(1);
    await expect(page.getByText('Log in to join the leaderboard.')).toBeVisible();
  });
});
