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
  multiplier: 10, missMultiplier: 3, clueMultiplier: 5, presses: 0, nextClue: 'side',
  reading: { about: 5000 }, trend: null, riverSide: null,
  freeClues: [], nextFree: { at: 3000, what: 'side' },
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
          multiplier: 3, missMultiplier: 1, clueMultiplier: 2, presses: 1, nextClue: 'district',
          misses: [{ direction: 'S' }], reading: { about: 1500 }, trend: 'closer',
          riverSide: 'oldTown', freeClues: [{ key: 'side', within: 3000 }], nextFree: { at: 1000, what: 'district' },
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
    // Nothing but the distance at the start, not even the river bank: the
    // ladder at 10x, five clues on the track, none had, the river bank next.
    await expect(panel.locator('.hunt-ladder li.is-on .hunt-ladder__mult')).toHaveText('10×');
    await expect(panel.locator('.hunt-track__row')).toHaveCount(5);
    await expect(panel.locator('.hunt-track__row.is-had')).toHaveCount(0);
    const next = panel.locator('.hunt-track__row.is-next');
    await expect(next.locator('.hunt-track__name')).toHaveText('Which bank of the Vltava');
    await expect(next.locator('.hunt-track__tag')).toHaveText('free within 3 km');
    // About 5 km: the pin stands before the first row.
    await expect(panel.locator('.hunt-track > li').first()).toHaveClass(/hunt-track__pin/);

    // The button works from anywhere, after a confirm that quotes the cost.
    await panel.getByRole('button', { name: "It's here!" }).click();
    await expect(panel.getByText('Press here? A miss drops the reward to 3×.')).toBeVisible();
    // The ladder marks the rung a miss would leave.
    await expect(panel.locator('.hunt-ladder--miss li.is-preview .hunt-ladder__mult')).toHaveText('3×');
    await panel.getByRole('button', { name: 'Yes, here' }).click();

    await expect(panel.getByText('Presses: 1')).toBeVisible();
    await expect(panel.getByText('Press 1: the treasure lies south of where you pressed.')).toBeVisible();
    await expect(panel.getByText('Not here. Check the new clues.')).toBeVisible();
    await expect(panel.getByText('Distance from you: about 1.5 km · closer than before', { exact: true })).toBeVisible();
    await expect(panel.locator('.hunt-panel__reward')).toHaveText('3× XP');
    await expect(panel.locator('.hunt-ladder li.is-on .hunt-ladder__mult')).toHaveText('3×');
    await expect(panel.locator('.hunt-ladder li.is-gone')).toHaveCount(2);
    const had = panel.locator('.hunt-track__row.is-had');
    await expect(had).toHaveCount(1);
    await expect(had.locator('.hunt-track__value')).toHaveText('Right bank, Old Town side');
    await expect(had.locator('.hunt-track__tag')).toHaveText('free');
    await expect(panel.locator('.hunt-track__row.is-next .hunt-track__tag')).toHaveText('free within 1 km');
    // About 1.5 km: past 3 km, not yet 1 km, so the pin is second.
    await expect(panel.locator('.hunt-track > li').nth(1)).toHaveClass(/hunt-track__pin/);
  });

  test('buying a clue: confirm names the next one in the order, then it shows at one rung down', async ({ page }) => {
    await loginAsUser(page);
    let state = active({ hunt: hunt() });
    let taken = null;
    await page.route(DRAW_RE, route => route.fulfill({ json: state }));
    await page.route(CLUE_RE, route => {
      taken = route.request().postDataJSON();
      state = active({
        hunt: hunt({ multiplier: 5, missMultiplier: 2, clueMultiplier: 3, nextClue: 'district', riverSide: 'castle', nextFree: { at: 1000, what: 'district' } }),
      });
      return route.fulfill({ json: { clue: 'side', draw: state } });
    });

    await page.goto('/treasure-hunt');
    const panel = page.locator('.hunt-panel');
    await panel.getByRole('button', { name: 'Buy the next clue: Which bank of the Vltava (then 5×)' }).click();
    await expect(panel.getByText('Buy the next clue (Which bank of the Vltava)? A find then pays 5×.')).toBeVisible();
    expect(taken).toBeNull();
    await panel.getByRole('button', { name: 'Yes, buy it' }).click();

    const had = panel.locator('.hunt-track__row.is-had');
    await expect(had.locator('.hunt-track__value')).toHaveText('Left bank, castle side');
    await expect(had.locator('.hunt-track__tag')).toHaveText('bought');
    await expect(panel.locator('.hunt-panel__reward')).toHaveText('5× XP');
    expect(taken).toEqual({ lat: 50.0875, lng: 14.4224 });
    await expect(panel.getByRole('button', { name: 'Buy the next clue: District (then 3×)' })).toBeVisible();
  });

  test('even within 300 m a press asks first; a hit reveals the card', async ({ page }) => {
    await loginAsUser(page);
    let state = active({
      hunt: hunt({
        multiplier: 2, missMultiplier: 1, clueMultiplier: null, nextClue: null, presses: 3,
        riverSide: 'oldTown', rarity: 'rare', xpReward: 20, labels: ['church'], nextFree: null,
        freeClues: [{ key: 'side', within: 3000 }, { key: 'district', within: 1000 }, { key: 'quarter', within: 500 }, { key: 'rarity', within: 300 }],
        district: 'Praha 1', quarter: 'Staré Město',
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
    await expect(panel.getByText("Within 300 m of you: it's right around you!", { exact: true })).toBeVisible();
    await expect(panel.getByText('Rare', { exact: true })).toBeVisible();
    await expect(panel.getByText('Prague 1')).toBeVisible();
    await expect(panel.getByText('Old Town', { exact: true })).toBeVisible();
    // The rarity came free at 300 m, so it holds the fourth slot and the
    // label, bought, the fifth.
    await expect(panel.locator('.hunt-track__row').nth(3).locator('.hunt-track__name')).toHaveText('Rarity');
    await expect(panel.locator('.hunt-track__row').nth(4).locator('.hunt-track__tag')).toHaveText('bought');
    await expect(panel.locator('.hunt-track__row.is-had')).toHaveCount(5);
    // Each rung shows what a find would pay once the rarity is known.
    await expect(panel.locator('.hunt-ladder li').first().locator('.hunt-ladder__xp')).toHaveText('200 XP');
    await expect(panel.getByText('Press 2: the treasure lies north-east of where you pressed.')).toBeVisible();
    await expect(panel.locator('.hunt-panel__reward')).toHaveText('2× XP · 40 XP');
    // Every clue is out, so there is none left to take.
    await expect(panel.getByRole('button', { name: /Buy the next clue/ })).toHaveCount(0);
    await panel.getByRole('button', { name: "It's here!" }).click();
    await expect(panel.getByText('Press here? A miss drops the reward to 1×.')).toBeVisible();
    await panel.getByRole('button', { name: 'Yes, here' }).click();

    await expect(page.getByText('Found on press 4! +30 XP')).toBeVisible();
    await expect(page.locator('.flip-card--revealed .loc-card__name')).toHaveText('Týn Church');
    // The card itself carries no hunt badge; its detail view says it.
    await expect(page.locator('.flip-card--revealed .loc-card__hunt')).toHaveCount(0);
  });

  test('starting outside Prague is refused with a message', async ({ page }) => {
    await loginAsUser(page);
    await page.route(DRAW_RE, route => {
      if (route.request().method() === 'POST') {
        return route.fulfill({ status: 403, json: { code: 'outsidePrague', message: 'A treasure hunt can only be started in Prague' } });
      }
      return route.fulfill({ json: { active: false, canDraw: true, location: null, drawnAt: null, expiresAt: null } });
    });
    await page.goto('/treasure-hunt');
    await page.getByRole('button', { name: 'Start the Hunt' }).click();
    await expect(page.getByRole('alert')).toHaveText('You can only start a treasure hunt inside Prague.');
    await expect(page.getByRole('button', { name: 'Start the Hunt' })).toBeEnabled();
    await expect(page.locator('.hunt-panel')).toHaveCount(0);
  });

  test('an expired hunt shows its answer next to the start button', async ({ page }) => {
    await loginAsUser(page);
    await page.route(DRAW_RE, route => route.fulfill({
      json: { active: false, canDraw: true, location: null, drawnAt: null, expiresAt: null, lastHunt: { location: TARGET } },
    }));
    await page.goto('/treasure-hunt');
    await expect(page.getByText('Your last treasure was:')).toBeVisible();
    await expect(page.locator('.hunt-last').getByRole('button', { name: /Týn Church/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start the Hunt' })).toBeEnabled();
  });

  test('a treasure collected with a normal check-in ends the hunt without a find', async ({ page }) => {
    await loginAsUser(page);
    await page.route(DRAW_RE, route => route.fulfill({
      json: active({ forfeited: true, hunt: null, lastHunt: { location: TARGET } }),
    }));
    await page.goto('/treasure-hunt');
    await expect(page.getByText("You collected this hunt's treasure with a normal check-in, so it paid normal XP. It was:")).toBeVisible();
    await expect(page.locator('.hunt-last').getByRole('button', { name: /Týn Church/ })).toBeVisible();
    await expect(page.locator('.hunt-panel')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Start the Hunt' })).toHaveCount(0);
  });

  test('the distance bands under 1 km read as sentences', async ({ page }) => {
    await loginAsUser(page);
    await page.route(DRAW_RE, route => route.fulfill({ json: active({ hunt: hunt({ reading: { band: [300, 500] } }) }) }));
    await page.goto('/treasure-hunt');
    await expect(page.locator('.hunt-panel__distance')).toHaveText('Very close: under 500 m, but more than 300 m.');
  });

  test('past finds sit in the side column with their figures, and open their card', async ({ page }) => {
    await loginAsUser(page);
    await page.route(DRAW_RE, route => route.fulfill({ json: { active: false, canDraw: true, location: null } }));
    const found = { ...TARGET, unlocked: true, _guessAttempt: 1, _xpEarned: 100, _checkedInAt: '2026-01-01T00:00:00.000Z' };
    await page.route('**/api/user/treasures', route => route.fulfill({ json: [found] }));
    await page.goto('/treasure-hunt');
    const box = page.locator('.hunt-col--right .hunt-finds-box');
    await expect(box.locator('.hunt-finds-box__stat strong')).toHaveText(['1', '5×', '1']);
    await page.route('**/api/locations/tyn-church', route => route.fulfill({
      json: { ...found, description: { en: 'A church.' }, checkedInAt: '2026-01-01T00:00:00.000Z', guessAttempt: 1, xpEarned: 100 },
    }));
    await box.locator('.card-strip__item').click();
    await expect(page.getByText(/found on a treasure hunt on guess 1, \+100 XP/)).toBeVisible();
  });

  test('the board: card, hunt and clue map side by side, the page never scrolls', async ({ page }) => {
    await loginAsUser(page);
    await page.route('**/api/user/treasures', route => route.fulfill({ json: [] }));
    await page.route(DRAW_RE, route => route.fulfill({
      json: active({ hunt: hunt({ multiplier: 3, riverSide: 'oldTown', district: 'Praha 1', quarter: 'Staré Město', nextClue: 'rarityOrLabel', misses: [{ direction: 'S' }] }) }),
    }));
    await page.goto('/treasure-hunt');
    await expect(page.locator('.hunt-col--mid .hunt-panel')).toBeVisible();
    await expect(page.locator('.hunt-col--right .hunt-map__quarter.is-lit')).toHaveCount(1);
    await expect(page.locator('.hunt-map__caption')).toContainText('Prague 1');
    await expect(page.locator('.hunt-compass .hunt-compass__arrow')).toHaveCount(1);
    const scroll = await page.evaluate(() => document.scrollingElement.scrollHeight - window.innerHeight);
    expect(scroll).toBeLessThanOrEqual(1);
    // How to play is on the page, under the panel, never folded away.
    await expect(page.locator('.hunt-col--mid .guide-h2', { hasText: 'The Rules' })).toHaveCount(1);
    await expect(page.locator('.hunt-col--mid .hunt-table')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'How to play' })).toHaveCount(0);
  });

  test('a guest sees the rules but has to log in to play', async ({ page }) => {
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.goto('/treasure-hunt');
    await expect(page.getByRole('button', { name: 'Start the Hunt' })).toBeDisabled();
    await expect(page.getByText('Log in to play Treasure Hunt.')).toBeVisible();
    await expect(page.locator('.hunt-table tbody tr')).toHaveCount(6);
  });

  test.describe('on a phone', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('the buttons sit in the panel, under the card and above the map; the rules and finds are on the page', async ({ page }) => {
      await loginAsUser(page);
      await page.route(DRAW_RE, route => route.fulfill({ json: active({ hunt: hunt() }) }));
      await page.route('**/api/user/treasures', route => route.fulfill({ json: [] }));
      await page.goto('/treasure-hunt');

      const actions = page.locator('.hunt-panel .hunt-panel__actions');
      await expect(actions.getByRole('button', { name: "It's here!" })).toBeVisible();
      await expect(page.locator('.hunt-dock')).toHaveCount(0);
      const card = await page.locator('.hunt-stage').boundingBox();
      const here = await actions.boundingBox();
      const map = await page.locator('.hunt-stack__map').boundingBox();
      expect(here.y).toBeGreaterThan(card.y + card.height);
      expect(here.y + here.height).toBeLessThan(map.y);
      // Full width on a phone, and the confirm opens in place.
      const panel = await page.locator('.hunt-panel').boundingBox();
      const button = await actions.getByRole('button', { name: "It's here!" }).boundingBox();
      expect(button.width).toBeGreaterThan(panel.width - 40);
      await actions.getByRole('button', { name: "It's here!" }).click();
      await expect(actions.getByText('Press here? A miss drops the reward to 3×.')).toBeVisible();
      await actions.getByRole('button', { name: 'Cancel' }).click();

      // The rules are on the page below the hunt, not in a sheet.
      await expect(page.locator('.hunt-howto .guide-h2', { hasText: 'The Rules' })).toHaveCount(1);
      // The finds are at the bottom of the page, after the rules; no buttons under the title.
      await expect(page.locator('.hunt-tools')).toHaveCount(0);
      await expect(page.locator('.hunt-howto + .hunt-stack__finds .hunt-finds-box__empty')).toHaveCount(1);

    });
  });

  test.describe('on a 2K screen', () => {
    test.use({ viewport: { width: 2560, height: 1440 } });
    const overflow = page => page.evaluate(() => [
      document.scrollingElement.scrollHeight - innerHeight,
      ...[...document.querySelectorAll('.hunt-col')].map(c => c.scrollHeight - c.clientHeight),
      ...[...document.querySelectorAll('.hunt-howto')].map(h => h.scrollWidth - h.clientWidth),
    ].map(n => Math.max(0, n)));
    const finds = Array.from({ length: 7 }, (_, i) => ({ ...TARGET, slug: `f${i}`, unlocked: true, _guessAttempt: 1, _xpEarned: 200 }));

    for (const lang of ['en', 'cz', 'zh']) {
      test(`nothing scrolls, in ${lang}: before a hunt, during one, and with a confirm open`, async ({ page }) => {
        await page.addInitScript(l => localStorage.setItem('lang', l), lang);
        await loginAsUser(page);
        await page.route('**/api/user/treasures', route => route.fulfill({ json: finds }));
        let state = { active: false, canDraw: true, location: null, lastHunt: { location: TARGET } };
        await page.route(DRAW_RE, route => route.fulfill({ json: state }));
        await page.goto('/treasure-hunt');
        await expect(page.locator('.hunt-board--wide')).toBeVisible();
        await expect(page.locator('.hunt-finds-box__stat strong').first()).toHaveText('7');
        expect(await overflow(page)).toEqual([0, 0, 0, 0, 0]);

        state = active({ hunt: hunt({ multiplier: 3, riverSide: 'oldTown', district: 'Praha 1', quarter: 'Staré Město', nextClue: 'rarityOrLabel', presses: 2, misses: [{ direction: 'S' }, { direction: 'N' }] }) });
        await page.reload();
        await expect(page.locator('.hunt-col--mid .hunt-panel')).toBeVisible();
        await expect(page.locator('.hunt-finds-box__stat strong').first()).toHaveText('7');
        expect(await overflow(page)).toEqual([0, 0, 0, 0, 0]);
        await page.locator('.hunt-panel .px-btn--lg').click();
        await expect(page.locator('.hunt-panel__confirm')).toBeVisible();
        expect(await overflow(page)).toEqual([0, 0, 0, 0, 0]);
      });
    }
  });
});
