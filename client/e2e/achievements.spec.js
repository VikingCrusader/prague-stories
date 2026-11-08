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
    await expect(rows.nth(0)).not.toContainText('of players');   // share hidden for now
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

  test('the difficulty filter narrows the list but not the unlocked count', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
    await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.route('**/api/user/achievements', route => route.fulfill({ json: SIGNED_IN }));
    await page.goto('/achievements');
    await expect(page.locator('.ach-row')).toHaveCount(3);
    // All three test achievements are 'hard'.
    await expect(page.locator('.ach-filter__chip[data-difficulty="hard"]')).toContainText('3');
    await expect(page.locator('.ach-filter__chip[data-difficulty="easy"]')).toHaveCount(0);
    await page.locator('.ach-filter__chip[data-difficulty="hard"]').click();
    await expect(page.locator('.ach-row')).toHaveCount(3);
    await expect(page.getByText('1 of 3 unlocked (33%)')).toBeVisible();
    await page.locator('.ach-filter__chip').first().click();
    await expect(page.locator('.ach-row')).toHaveCount(3);
  });

  test('"Not yet unlocked" hides the unlocked ones and works with the difficulty chips', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
    await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.route('**/api/user/achievements', route => route.fulfill({ json: { ...SIGNED_IN, achievements: [
      ...SIGNED_IN.achievements,
      ach('first_step', 'First Step', { difficulty: 'easy', unlocked: true, unlockedAt: '2026-10-01T10:00:00.000Z', progress: { current: 1, target: 1 } }),
    ] } }));
    await page.goto('/achievements');
    const rows = page.locator('.ach-row');
    const toggle = page.getByRole('button', { name: /Not yet unlocked/ });
    const easy = page.locator('.ach-filter__chip[data-difficulty="easy"]');
    await expect(rows).toHaveCount(4);
    await toggle.click();
    await expect(rows).toHaveCount(2);
    await expect(page.locator('.ach-row--unlocked')).toHaveCount(0);
    await expect(page.locator('.ach-filter__chip[data-difficulty="hard"]')).toContainText('2');
    await expect(page.getByText('2 of 4 unlocked (50%)')).toBeVisible();
    // A tier with nothing left stays on the bar and says so.
    await expect(easy).toContainText('0');
    await easy.click();
    await expect(rows).toHaveCount(0);
    await expect(page.getByText('you have unlocked them all')).toBeVisible();
    await toggle.click();
    await expect(rows).toHaveCount(1);
  });

  test('desktop shows three columns from 1200 px, phones keep one', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
    await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.route('**/api/user/achievements', route => route.fulfill({ json: SIGNED_IN }));
    const lefts = () => page.locator('.ach-row').evaluateAll(els => new Set(els.map(e => Math.round(e.getBoundingClientRect().left))).size);
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto('/achievements');
    await expect(page.locator('.ach-row')).toHaveCount(3);
    expect(await lefts()).toBe(3);
    // "All" and "Not yet unlocked" come first; one line on desktop, their own line on phones.
    const chips = page.locator('.ach-filter__chip');
    const tops = () => chips.evaluateAll(els => els.map(e => Math.round(e.getBoundingClientRect().top)));
    await expect(chips.nth(0)).toContainText('All');
    await expect(chips.nth(1)).toContainText('Not yet unlocked');
    expect(new Set(await tops()).size).toBe(1);
    await page.setViewportSize({ width: 412, height: 915 });
    expect(await lefts()).toBe(1);
    const [all, toggle, hard] = await tops();
    expect(all).toBe(toggle);
    expect(hard).toBeGreaterThan(all);
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
    await expect(page.getByRole('button', { name: /Not yet unlocked/ })).toHaveCount(0);
  });
});
