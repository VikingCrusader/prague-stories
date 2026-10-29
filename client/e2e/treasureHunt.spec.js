import { test, expect } from '@playwright/test';

const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 40, explorerLevel: 1 };
const DRAW_RE = /\/api\/user\/random-draw(\?.*)?$/;
const GUESS_RE = /\/api\/user\/random-draw\/guess$/;
const CLUE_RE = /\/api\/user\/random-draw\/clue$/;

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
  multiplier: 10, missMultiplier: 6, clueMultiplier: 8, presses: 0,
  availableClues: ['rarity', 'label', 'area', 'direction'],
  reading: { about: 5000 }, trend: null, riverSide: 'oldTown',
  firstRevealed: false, areaRevealed: false, nextFree: { at: 3000, what: 'label' },
  rarity: null, xpReward: null, labels: [], district: null, quarter: null,
  snapshots: [], misses: [],
  ...extra,
});

async function loginAsUser(page) {
  await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
}

test.use({ permissions: ['geolocation'], geolocation: { latitude: 50.0875, longitude: 14.4224 } });

test.describe('Treasure hunt', () => {
  test('start a hunt, miss a press, and get its direction', async ({ page }) => {
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
          multiplier: 6, missMultiplier: 4, clueMultiplier: 5, presses: 1,
          misses: [{ direction: 'S' }], reading: { about: 1500 }, trend: 'closer',
          firstRevealed: true, labels: ['church'], availableClues: ['rarity', 'area', 'direction'],
          nextFree: { at: 1000, what: 'area' },
        }),
      });
      return route.fulfill({ json: { hit: false, draw: state } });
    });

    // The old Draw page address still lands here.
    await page.goto('/random-draw');
    await expect(page).toHaveURL(/\/treasure-hunt$/);
    await expect(page.locator('h1')).toHaveText('Treasure Hunt');
    await expect(page.getByText('Things worth finding are hidden.')).toBeVisible();
    // One hunt, no mode tabs.
    await expect(page.getByRole('tab')).toHaveCount(0);
    await page.getByRole('button', { name: 'Start the Hunt' }).click();
    expect(started).toBe(1);

    const panel = page.locator('.hunt-panel');
    await expect(panel.getByText('Presses: 0')).toBeVisible();
    // No rarity yet, so no XP figure.
    await expect(panel.locator('.hunt-panel__reward')).toHaveText('10× XP');
    await expect(panel.getByText('Distance from you: about 5 km', { exact: true })).toBeVisible();
    await expect(panel.getByText('The treasure is on the right bank of the Vltava (the Old Town side).')).toBeVisible();
    // No labels at the start.
    await expect(panel.locator('.hunt-panel__clues .detail-label-pill')).toHaveCount(0);
    await expect(panel.getByText('Within 3 km: the rarity or one label, free.')).toBeVisible();

    // The button works from anywhere, after a confirm that quotes the cost.
    await panel.getByRole('button', { name: "It's here!" }).click();
    await expect(panel.getByText('Press here? A miss drops the reward to 6×.')).toBeVisible();
    await panel.getByRole('button', { name: 'Yes, here' }).click();

    await expect(panel.getByText('Presses: 1')).toBeVisible();
    await expect(panel.getByText('Press 1: the treasure lies south of where you pressed.')).toBeVisible();
    await expect(panel.getByText('Not here. Check the new clues.')).toBeVisible();
    await expect(panel.getByText('Distance from you: about 1.5 km · closer than before', { exact: true })).toBeVisible();
    await expect(panel.locator('.hunt-panel__reward')).toHaveText('6× XP');
    // Within 3 km the first clue came, and the next one is announced.
    await expect(panel.getByText('Church & Cathedral')).toBeVisible();
    await expect(panel.getByText('Within 1 km: the district and the quarter, free.')).toBeVisible();
  });

  test('taking a clue: pick one, then it shows at half a step', async ({ page }) => {
    await loginAsUser(page);
    let state = active({ hunt: hunt() });
    let taken = null;
    await page.route(DRAW_RE, route => route.fulfill({ json: state }));
    await page.route(CLUE_RE, route => {
      taken = route.request().postDataJSON();
      state = active({
        hunt: hunt({
          multiplier: 8, missMultiplier: 5, clueMultiplier: 6, availableClues: ['rarity', 'label', 'area'],
          snapshots: [{ key: 'direction', direction: 'NE' }],
        }),
      });
      return route.fulfill({ json: { clue: 'direction', draw: state } });
    });

    await page.goto('/treasure-hunt');
    const panel = page.locator('.hunt-panel');
    await panel.getByRole('button', { name: 'Take a clue (then 8×)' }).click();
    await expect(panel.getByText('Pick a clue. A find then pays 8×:')).toBeVisible();
    expect(taken).toBeNull();
    await panel.getByRole('button', { name: 'Direction now' }).click();

    await expect(panel.getByText('When you took the clue, the treasure lay north-east of you.')).toBeVisible();
    await expect(panel.locator('.hunt-panel__reward')).toHaveText('8× XP');
    expect(taken).toMatchObject({ key: 'direction', lat: 50.0875, lng: 14.4224 });
    await panel.getByRole('button', { name: 'Take a clue (then 6×)' }).click();
    await expect(panel.getByRole('button', { name: 'Direction now' })).toHaveCount(0);
    await expect(panel.getByRole('button', { name: 'Rarity' })).toBeVisible();
    await expect(panel.getByRole('button', { name: 'A label' })).toBeVisible();
  });

  test('even within 300 m a press asks first; a hit reveals the card', async ({ page }) => {
    await loginAsUser(page);
    let state = active({
      hunt: hunt({
        multiplier: 1.5, missMultiplier: 1, clueMultiplier: null, availableClues: [], presses: 3,
        firstRevealed: true, areaRevealed: true, rarity: 'rare', xpReward: 20, nextFree: null,
        district: 'Praha 1', quarter: 'Staré Město',
        snapshots: [{ key: 'direction', direction: 'N' }],
        misses: [{ direction: 'S' }, { direction: 'NE' }, { direction: 'W' }],
        reading: { within: 300 },
      }),
    });
    await page.route(DRAW_RE, route => route.fulfill({ json: state }));
    await page.route(GUESS_RE, route => {
      state = active({ bonusUsed: true, solvedAttempt: 4, xpEarned: 30, hunt: undefined, location: { ...TARGET, _guessAttempt: 4 } });
      return route.fulfill({
        status: 201,
        json: {
          hit: true, xpEarned: 30, guessAttempt: 4, totalXP: 70,
          levelInfo: { level: 1, title: 'Newcomer', progress: 70, nextLevelXP: 80 },
          newAchievements: [], draw: state,
        },
      });
    });

    await page.goto('/treasure-hunt');
    const panel = page.locator('.hunt-panel');
    await expect(panel.getByText('Distance from you: within 300 m', { exact: true })).toBeVisible();
    await expect(panel.getByText('Rare', { exact: true })).toBeVisible();
    await expect(panel.getByText('Prague 1')).toBeVisible();
    await expect(panel.getByText('When you took the clue, the treasure lay north of you.')).toBeVisible();
    await expect(panel.getByText('Press 2: the treasure lies north-east of where you pressed.')).toBeVisible();
    await expect(panel.locator('.hunt-panel__reward')).toHaveText('1.5× XP · 30 XP');
    // Every clue is out, so there is none left to take.
    await expect(panel.getByRole('button', { name: /Take a clue/ })).toHaveCount(0);
    await panel.getByRole('button', { name: "It's here!" }).click();
    await expect(panel.getByText('Press here? A miss drops the reward to 1×.')).toBeVisible();
    await panel.getByRole('button', { name: 'Yes, here' }).click();

    await expect(page.getByText('Found on press 4! +30 XP')).toBeVisible();
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
    await expect(page.locator('.hunt-table tbody tr')).toHaveCount(6);
  });
});
