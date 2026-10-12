import { test, expect } from '@playwright/test';

const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 40, explorerLevel: 1 };
const DRAW_RE = /\/api\/user\/random-draw(\?.*)?$/;
const GUESS_RE = /\/api\/user\/random-draw\/guess$/;

const TARGET = {
  _id: '1',
  name: 'Týn Church',
  slug: 'tyn-church',
  localizedNames: { cz: 'Týnský chrám', zh: '泰恩教堂' },
  labels: ['church', 'historical', 'tower'],
  coordinates: { lat: 50.0875, lng: 14.4224 },
  rarity: 'rare',
  xpReward: 20,
  coverImage: '',
  pixelArtKey: '',
  quarter: 'Staré Město',
  district: 'Praha 1',
};

const active = extra => ({
  active: true,
  canDraw: false,
  mode: 'hidden',
  drawnAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 20 * 3600 * 1000).toISOString(),
  bonusUsed: false,
  location: null,
  ...extra,
});

const hunt = extra => ({
  attempt: 1, maxAttempts: 5, multiplier: 10, radius: 3000,
  goldenUntil: new Date(Date.now() + 90 * 60 * 1000).toISOString(), goldenBonus: 1.5,
  rarity: null, xpReward: null, quarter: null, district: null,
  fromSquare: { near: false, direction: 'NE' },
  labels: ['church'], misses: [],
  proximity: { within: true, distance: null },
  ...extra,
});

async function loginAsUser(page) {
  await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
}

test.use({ permissions: ['geolocation'], geolocation: { latitude: 50.0875, longitude: 14.4224 } });

test.describe('Treasure hunt', () => {
  test('start a hunt, miss the first guess, and get the new clues', async ({ page }) => {
    await loginAsUser(page);
    let state = { active: false, canDraw: true, location: null, drawnAt: null, expiresAt: null };
    let drawBody = null;
    await page.route(DRAW_RE, route => {
      if (route.request().method() === 'POST') {
        drawBody = route.request().postDataJSON();
        state = active({ hunt: hunt() });
      }
      return route.fulfill({ json: state });
    });
    await page.route(GUESS_RE, route => {
      state = active({
        hunt: hunt({
          attempt: 2, multiplier: 7, radius: 2000,
          rarity: 'rare', xpReward: 20, labels: ['church'], misses: [{ direction: 'S', distance: null }],
          proximity: { within: false, distance: 2655, direction: null },
        }),
      });
      return route.fulfill({ json: { hit: false, draw: state } });
    });

    await page.goto('/random-draw');
    // Open Draw is the default tab, with its outside-Prague checkbox.
    await expect(page.getByText('Include cards outside Prague')).toBeVisible();
    await page.getByRole('tab', { name: 'Treasure Hunt' }).click();
    await expect(page.locator('h1')).toHaveText('Treasure Hunt');
    await expect(page.getByText('Things worth finding are hidden.')).toBeVisible();
    await expect(page.getByText('Include cards outside Prague')).toHaveCount(0);
    await expect(page.getByText('A treasure hunt hides the location from you', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Start the Hunt' }).click();
    expect(drawBody.mode).toBe('hidden');
    // While the hunt runs, the Open Draw tab is locked.
    await expect(page.getByRole('tab', { name: 'Open Draw' })).toBeDisabled();

    const panel = page.locator('.hunt-panel');
    await expect(panel.getByText('Guess 1 of 5')).toBeVisible();
    // No rarity, so no XP figure either (it would give the rarity away).
    await expect(panel.locator('.hunt-panel__reward')).toHaveText('10× XP');
    await expect(panel.getByText('Golden time (another ×1.5):')).toBeVisible();
    await expect(panel.getByText('Within 3 km')).toBeVisible();
    await expect(panel.getByText('The treasure lies north-east of Old Town Square.')).toBeVisible();
    // Just the one label, no rarity pill.
    await expect(panel.locator('.hunt-panel__clues .detail-label-pill')).toHaveCount(1);
    await expect(panel.getByText('Church & Cathedral')).toBeVisible();
    // No area clue before the first miss.
    await expect(panel.getByText('Old Town', { exact: true })).toHaveCount(0);

    await panel.getByRole('button', { name: "It's here!" }).click();
    await expect(panel.getByText('Use guess 1 here?')).toBeVisible();
    await panel.getByRole('button', { name: 'Yes, here' }).click();

    await expect(panel.getByText('Guess 2 of 5')).toBeVisible();
    // Only the direction from the miss so far; distances come on guess 4.
    await expect(panel.getByText('Guess 1: the treasure lies south of where you pressed.')).toBeVisible();
    // The area comes later too.
    await expect(panel.getByText('Prague 1')).toHaveCount(0);
    await expect(panel.getByText('Distance: 2.7 km', { exact: true })).toBeVisible();
    // Rarity and the XP figure (20 x 7 x 1.5) now show.
    await expect(panel.locator('.hunt-panel__reward')).toHaveText('7× XP · 210 XP');
    await expect(panel.getByText('Rare', { exact: true })).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Get closer to guess' })).toBeDisabled();
    await expect(panel.getByText('Unlocks within 2 km of the treasure')).toBeVisible();
  });

  test('the last guess needs no confirmation and reveals the card with its mark', async ({ page }) => {
    await loginAsUser(page);
    let state = active({
      hunt: hunt({
        attempt: 5, multiplier: 2, radius: 100, quarter: 'Staré Město', district: 'Praha 1', rarity: 'rare', xpReward: 20,
        labels: ['church', 'tower', 'historical'],
        misses: [
          { direction: 'S', distance: 2480 }, { direction: 'S', distance: 1460 },
          { direction: 'NE', distance: 742 }, { direction: 'W', distance: 310 },
        ],
        fromSquare: { near: true, direction: null },
        proximity: { within: true, distance: 40, direction: 'N' },
      }),
    });
    await page.route(DRAW_RE, route => route.fulfill({ json: state }));
    await page.route(GUESS_RE, route => {
      state = active({ bonusUsed: true, solvedAttempt: 5, xpEarned: 40, hunt: undefined, location: { ...TARGET, _guessAttempt: 5 } });
      return route.fulfill({
        status: 201,
        json: {
          hit: true, xpEarned: 40, guessAttempt: 5, totalXP: 80,
          levelInfo: { level: 1, title: 'Newcomer', progress: 80, nextLevelXP: 80 },
          newAchievements: [], draw: { ...state, xpEarned: 40 },
        },
      });
    });

    await page.goto('/random-draw');
    const panel = page.locator('.hunt-panel');
    await expect(panel.getByText('Distance: 40 m · Head north')).toBeVisible();
    await expect(panel.getByText('Guess 3: the treasure lies north-east of where you pressed, 742 m away.')).toBeVisible();
    await expect(panel.getByText('The treasure is near Old Town Square.')).toBeVisible();
    await expect(panel.getByText('Church & Cathedral')).toBeVisible();
    await panel.getByRole('button', { name: "It's here!" }).click();

    await expect(page.getByText('Found on guess 5! +40 XP')).toBeVisible();
    await expect(page.locator('.flip-card--revealed .loc-card__name')).toHaveText('Týn Church');
    await expect(page.locator('.flip-card--revealed .loc-card__hunt')).toHaveText('🎯 5th try');
  });

  test('an expired hunt shows its answer next to the draw buttons', async ({ page }) => {
    await loginAsUser(page);
    await page.route(DRAW_RE, route => route.fulfill({
      json: { active: false, canDraw: true, location: null, drawnAt: null, expiresAt: null, lastHunt: { location: TARGET } },
    }));
    await page.goto('/random-draw');
    await expect(page.getByText('Your last treasure was:')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Týn Church' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Draw a Location' })).toBeEnabled();
  });

  test('a draw can be re-rolled once, after confirming', async ({ page }) => {
    await loginAsUser(page);
    const OTHER = { ...TARGET, _id: '2', name: 'Powder Tower', slug: 'powder-tower', localizedNames: { cz: 'Prašná brána', zh: '火药塔' } };
    const base = {
      active: true, canDraw: false, mode: 'open', bonusUsed: false,
      drawnAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 20 * 3600 * 1000).toISOString(),
    };
    let state = { ...base, location: TARGET, canReroll: true };
    let rerolls = 0;
    await page.route(DRAW_RE, route => route.fulfill({ json: state }));
    await page.route(/\/api\/user\/random-draw\/reroll$/, route => {
      rerolls += 1;
      state = { ...base, location: OTHER, canReroll: false };
      return route.fulfill({ json: state });
    });

    await page.goto('/random-draw');
    await expect(page.locator('.flip-card--revealed .loc-card__name')).toHaveText('Týn Church');
    await page.getByRole('button', { name: 'Re-roll (once today)' }).click();
    await expect(page.getByText('You only get one re-roll per draw.', { exact: false })).toBeVisible();
    expect(rerolls).toBe(0);
    await page.getByRole('button', { name: 'Yes, re-roll' }).click();

    await expect(page.locator('.flip-card--revealed .loc-card__name')).toHaveText('Powder Tower');
    expect(rerolls).toBe(1);
    await expect(page.getByRole('button', { name: 'Re-roll (once today)' })).toHaveCount(0);
  });
});
