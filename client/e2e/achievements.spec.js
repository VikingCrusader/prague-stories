import { test, expect } from '@playwright/test';

const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 140, explorerLevel: 2 };

const ach = (id, name, extra) => ({
  id, name, name_cz: name, name_zh: name, icon: '🏅',
  flavor: `${name} flavor.`, description: `${name} requirement.`,
  difficulty: 'hard', unlockRate: 0, unlocked: false, unlockedAt: null, progress: null, ...extra,
});

const SIGNED_IN = {
  players: 4,
  levels: [],
  achievements: [
    ach('century', 'Prague Century', { unlockRate: 25, progress: { current: 37, target: 100 } }),
    ach('subway_maniac', 'Subway Maniac', {
      progress: {
        current: 1, target: 3,
        places: [
          { slug: 'haje', name: 'Háje', localizedNames: { cz: 'Háje', zh: '哈耶' }, done: true },
          { slug: 'cerny-most', name: 'Černý Most', localizedNames: {}, done: false },
          { slug: 'letnany', missing: true, done: false },
        ],
      },
    }),
    ach('southern-pole', 'South Pole', { unlockRate: 50, unlocked: true, unlockedAt: '2026-10-05T10:00:00.000Z', progress: { current: 1, target: 1 } }),
  ],
};

test.describe('Achievements page', () => {
  test('is in the navbar and lists achievements Steam-style, unlocked first', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
    await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.route('**/api/user/achievements', route => route.fulfill({ json: SIGNED_IN }));

    await page.goto('/explore');
    await page.locator('.navbar').getByRole('link', { name: 'Achievements' }).click();
    await expect(page).toHaveURL(/\/achievements$/);
    await expect(page.getByText('1 of 3 unlocked (33%)')).toBeVisible();

    const rows = page.locator('.ach-row');
    await expect(rows).toHaveCount(3);
    await expect(rows.nth(0)).toContainText('South Pole');          // unlocked first
    await expect(rows.nth(0)).toContainText('Unlocked 5 Oct 2026');
    await expect(rows.nth(0)).toContainText('50% of players');
    await expect(rows.nth(1)).toContainText('Prague Century');      // 37% along beats 33%
    await expect(rows.nth(1)).toContainText('37 / 100');
    await expect(rows.nth(1)).toContainText('Prague Century flavor.');
    await expect(rows.nth(0)).toContainText('1 / 1');              // every row has a bar, even one-step ones

    await rows.nth(2).click();
    const modal = page.locator('.ach-modal');
    await expect(modal.getByText('Subway Maniac requirement.')).toBeVisible();
    await expect(modal.getByText('1 / 3')).toBeVisible();
    await expect(modal.locator('.ach-places__item--done')).toHaveText(/Háje/);
    await expect(modal.getByText('letnany · no card yet')).toBeVisible();
    await expect(modal.getByText('LOCKED')).toBeVisible();
  });

  test('guests see the list without progress and a nudge to log in', async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('guest', 'true'));
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.route('**/api/user/achievements', route => route.fulfill({ json: {
      players: 4, levels: [], achievements: [ach('century', 'Prague Century', { unlockRate: 25 })],
    } }));
    await page.goto('/achievements');
    await expect(page.locator('.ach-row')).toHaveCount(1);
    await expect(page.locator('.ach-row .ach-bar')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Log in to track your progress.' })).toBeVisible();
  });
});
