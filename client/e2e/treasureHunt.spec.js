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
  rarity: null, xpReward: null, quarter: null, district: null,
  fromSquare: { near: false, direction: 'NE' },
  labels: ['church'], misses: [],
  proximity: { within: true, distance: null, band: { min: 0, max: 3000 } },
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
    let started = 0;
    await page.route(DRAW_RE, route => {
      if (route.request().method() === 'POST') {
        started += 1;
        state = active({ hunt: hunt() });
      }
      return route.fulfill({ json: state });
    });
    await page.route(GUESS_RE, route => {
      state = active({
        hunt: hunt({
          attempt: 2, multiplier: 5, radius: 2000,
          rarity: 'rare', xpReward: 20, labels: ['church'], misses: [{ direction: 'S' }],
          proximity: { within: false, distance: null, band: { min: 2000, max: 3000 }, direction: null },
        }),
      });
      return route.fulfill({ json: { hit: false, draw: state } });
    });

    // The old Draw page address still lands here.
    await page.goto('/random-draw');
    await expect(page).toHaveURL(/\/treasure-hunt$/);
    await expect(page.locator('h1')).toHaveText('Treasure Hunt');
    await expect(page.getByText('Things worth finding are hidden.')).toBeVisible();
    // No mode tabs any more: the hunt is the only game here.
    await expect(page.getByRole('tab')).toHaveCount(0);
    await expect(page.getByText('A treasure hunt hides the location from you', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Start the Hunt' }).click();
    expect(started).toBe(1);

    const panel = page.locator('.hunt-panel');
    await expect(panel.getByText('Guess 1 of 5')).toBeVisible();
    // No rarity, so no XP figure either (it would give the rarity away).
    await expect(panel.locator('.hunt-panel__reward')).toHaveText('10× XP');
    // Guess 1 only gets a rough distance band.
    await expect(panel.getByText('Distance from you: under 3 km', { exact: true })).toBeVisible();
    await expect(panel.getByText('The treasure lies in the north-east of Prague (measured from Old Town Square).')).toBeVisible();
    // Just the one label, no rarity pill.
    await expect(panel.locator('.hunt-panel__clues .detail-label-pill')).toHaveCount(1);
    await expect(panel.getByText('Church & Cathedral')).toBeVisible();
    // No area clue before the first miss.
    await expect(panel.getByText('Old Town', { exact: true })).toHaveCount(0);

    await panel.getByRole('button', { name: "It's here!" }).click();
    await expect(panel.getByText('Use guess 1 here?')).toBeVisible();
    await panel.getByRole('button', { name: 'Yes, here' }).click();

    await expect(panel.getByText('Guess 2 of 5')).toBeVisible();
    // A miss only ever gives its direction.
    await expect(panel.getByText('Guess 1: the treasure lies south of where you pressed.')).toBeVisible();
    // The area comes later too.
    await expect(panel.getByText('Prague 1')).toHaveCount(0);
    await expect(panel.getByText('Distance from you: 2–3 km', { exact: true })).toBeVisible();
    // Rarity and the XP figure (20 x 5) now show.
    await expect(panel.locator('.hunt-panel__reward')).toHaveText('5× XP · 100 XP');
    await expect(panel.getByText('Rare', { exact: true })).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Get closer to guess' })).toBeDisabled();
    await expect(panel.getByText('Unlocks within 2 km of the treasure')).toBeVisible();
  });

  test('giving up a round asks first, then shows the next clues', async ({ page }) => {
    await loginAsUser(page);
    // Far away: the guess button stays locked, but giving up works anywhere.
    let state = active({ hunt: hunt({ nextMultiplier: 5, proximity: { within: false, distance: null, band: { min: 5000, max: 10000 } } }) });
    let skips = 0;
    await page.route(DRAW_RE, route => route.fulfill({ json: state }));
    await page.route(/\/api\/user\/random-draw\/skip$/, route => {
      skips += 1;
      state = active({
        hunt: hunt({
          attempt: 2, multiplier: 5, nextMultiplier: 3, radius: 2000, rarity: 'rare', xpReward: 20,
          misses: [{ skipped: true }], proximity: { within: false, distance: null, band: { min: 3000, max: null } },
        }),
      });
      return route.fulfill({ json: { draw: state } });
    });

    await page.goto('/treasure-hunt');
    const panel = page.locator('.hunt-panel');
    await expect(panel.getByRole('button', { name: 'Get closer to guess' })).toBeDisabled();
    await panel.getByRole('button', { name: 'Give up this round, take the clues' }).click();
    await expect(panel.getByText('Give up guess 1? You get the next clues right away, but a find pays only 5× from now on.')).toBeVisible();
    expect(skips).toBe(0);
    await panel.getByRole('button', { name: 'Yes, give up' }).click();

    await expect(panel.getByText('Guess 2 of 5')).toBeVisible();
    await expect(panel.getByText('Guess 1: given up.')).toBeVisible();
    await expect(panel.getByText('Round given up. Here are the new clues.')).toBeVisible();
    expect(skips).toBe(1);
  });

  test('the last guess needs no confirmation and reveals the card with its mark', async ({ page }) => {
    await loginAsUser(page);
    let state = active({
      hunt: hunt({
        attempt: 5, multiplier: 1, radius: 100, quarter: 'Staré Město', district: 'Praha 1', rarity: 'rare', xpReward: 20,
        labels: ['church', 'tower', 'historical'],
        misses: [
          { direction: 'S' }, { direction: 'S' }, { direction: 'NE' }, { direction: 'W' },
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

    await page.goto('/treasure-hunt');
    const panel = page.locator('.hunt-panel');
    await expect(panel.getByText('Distance from you: 40 m · Head north')).toBeVisible();
    await expect(panel.getByText('Guess 3: the treasure lies north-east of where you pressed.')).toBeVisible();
    await expect(panel.getByText('The treasure is near Old Town Square.')).toBeVisible();
    await expect(panel.getByText('Church & Cathedral')).toBeVisible();
    // Nothing comes after the last guess, so it can't be given up.
    await expect(panel.getByRole('button', { name: 'Give up this round, take the clues' })).toHaveCount(0);
    await panel.getByRole('button', { name: "It's here!" }).click();

    await expect(page.getByText('Found on guess 5! +40 XP')).toBeVisible();
    await expect(page.locator('.flip-card--revealed .loc-card__name')).toHaveText('Týn Church');
    // The card itself carries no hunt badge; its detail view says it.
    await expect(page.locator('.flip-card--revealed .loc-card__hunt')).toHaveCount(0);
  });

  test('an expired hunt shows its answer next to the start button', async ({ page }) => {
    await loginAsUser(page);
    await page.route(DRAW_RE, route => route.fulfill({
      json: { active: false, canDraw: true, location: null, drawnAt: null, expiresAt: null, lastHunt: { location: TARGET } },
    }));
    await page.goto('/treasure-hunt');
    await expect(page.getByText('Your last treasure was:')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Týn Church' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start the Hunt' })).toBeEnabled();
  });

  test('a guest sees the rules but has to log in to play', async ({ page }) => {
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.goto('/treasure-hunt');
    await expect(page.getByRole('button', { name: 'Start the Hunt' })).toBeDisabled();
    await expect(page.getByText('Log in to play Treasure Hunt.')).toBeVisible();
    await expect(page.locator('.hunt-table tbody tr')).toHaveCount(5);
  });

  test('a hunt can be re-rolled once, after confirming', async ({ page }) => {
    await loginAsUser(page);
    let state = active({ hunt: hunt(), canReroll: true });
    let rerolls = 0;
    await page.route(DRAW_RE, route => route.fulfill({ json: state }));
    await page.route(/\/api\/user\/random-draw\/reroll$/, route => {
      rerolls += 1;
      state = active({ hunt: hunt({ labels: ['tower'] }), canReroll: false });
      return route.fulfill({ json: state });
    });

    await page.goto('/treasure-hunt');
    const panel = page.locator('.hunt-panel');
    await expect(panel.getByText('Church & Cathedral')).toBeVisible();
    await page.getByRole('button', { name: 'Re-roll (once per hunt)' }).click();
    await expect(page.getByText('you only get one re-roll per hunt.', { exact: false })).toBeVisible();
    expect(rerolls).toBe(0);
    await page.getByRole('button', { name: 'Yes, re-roll' }).click();

    await expect(panel.getByText('Church & Cathedral')).toHaveCount(0);
    expect(rerolls).toBe(1);
    await expect(page.getByRole('button', { name: 'Re-roll (once per hunt)' })).toHaveCount(0);
  });
});
