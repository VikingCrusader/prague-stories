import { test, expect } from '@playwright/test';

const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 40, explorerLevel: 1 };
const HC_RE = /\/api\/user\/hardcore-hunt(\?.*)?$/;
const GUESS_RE = /\/api\/user\/hardcore-hunt\/guess$/;
const expiresAt = () => new Date(Date.now() + 20 * 3600 * 1000).toISOString();
const running = hunt => ({
  active: true, canDraw: false, expiresAt: expiresAt(),
  hunt: { attempt: 1, maxAttempts: 3, multiplier: 10, radius: 500, reading: { about: 4000 }, canGuess: false,
    labels: [], quarter: null, rarity: null, xpReward: null, ...hunt },
});

async function loginAsUser(page) {
  await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
  await page.route(/\/api\/user\/random-draw(\?.*)?$/, route => route.fulfill({ json: { active: false, canDraw: true } }));
}

test.use({ permissions: ['geolocation'], geolocation: { latitude: 50.0875, longitude: 14.4224 } });

test.describe('Hardcore treasure hunt', () => {
  test('starts with no clues, reveals them when close, and a miss uses a press', async ({ page }) => {
    await loginAsUser(page);
    let state = { active: false, canDraw: true };
    await page.route(HC_RE, route => {
      if (route.request().method() === 'POST') state = running();
      return route.fulfill({ json: state });
    });
    await page.goto('/treasure-hunt');
    await page.getByRole('tab', { name: 'Hardcore' }).click();
    await expect(page.locator('h1')).toHaveText('Hardcore Hunt');
    await page.getByRole('button', { name: 'Start the Hardcore Hunt' }).click();

    const panel = page.locator('.hunt-panel');
    await expect(panel.getByText('Distance from you: about 4 km')).toBeVisible();
    await expect(panel.getByText('No clues yet. They appear within 1 km.')).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Get closer to guess' })).toBeDisabled();

    // Walked within 500 m: two labels, the quarter and the rarity.
    state = running({ reading: { about: 400 }, canGuess: true, labels: ['church', 'gothic'], quarter: 'Staré Město', rarity: 'rare', xpReward: 20 });
    await page.reload();
    await expect(panel.getByText('Distance from you: about 400 m')).toBeVisible({ timeout: 15000 });
    await expect(panel.getByText('Gothic')).toBeVisible();
    await expect(panel.getByText('Old Town')).toBeVisible();
    await expect(panel.locator('.hunt-panel__reward')).toHaveText('10× XP · 200 XP');
    await page.screenshot({ path: 'C:/Users/Yiwen/AppData/Local/Temp/claude/E--prague-stories/df402c4c-b02e-40b4-8b81-96be18f0f867/scratchpad/hardcore-near.png' });

    await page.route(GUESS_RE, route => {
      state = running({ attempt: 2, multiplier: 5, reading: { about: 400 }, canGuess: true, labels: ['church', 'gothic'], quarter: 'Staré Město', rarity: 'rare', xpReward: 20 });
      return route.fulfill({ json: { hit: false, hunt: state } });
    });
    await panel.getByRole('button', { name: "It's here!" }).click();
    await expect(panel.getByText('Use press 1 of 3 here?', { exact: false })).toBeVisible();
    await panel.getByRole('button', { name: 'Yes, here' }).click();
    await expect(panel.getByText('Not here.')).toBeVisible();
    await expect(panel.getByText('Guess 2 of 3')).toBeVisible();
    await expect(panel.locator('.hunt-panel__reward')).toHaveText('5× XP · 100 XP');
  });
});
