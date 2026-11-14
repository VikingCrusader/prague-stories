import { test, expect } from '@playwright/test';

// Whatever backend happens to be running must not add its packs to the grid.
test.beforeEach(({ page }) => page.route('**/api/packs', route => route.fulfill({ json: [] })));

const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 140, explorerLevel: 2 };
const card = (i, district, quarter, unlocked, extra) => ({
  _id: String(i), name: `Card ${i}`, slug: `card-${i}`, localizedNames: { cz: `Card ${i}`, zh: `Card ${i}` }, labels: ['castle'], coverImage: '', pixelArtKey: '',
  rarity: 'rare', xpReward: 20, unlocked, _checkedInAt: unlocked ? '2026-01-01T00:00:00.000Z' : null, district, quarter, coordinates: { lat: 50.05, lng: 14.5 }, createdAt: '2026-01-01T00:00:00.000Z', ...extra,
});
const CARDS = [
  ...Array.from({ length: 20 }, (_, i) => card(i, 'Praha 11', 'Chodov', i % 2 === 0)),
  ...Array.from({ length: 12 }, (_, i) => card(20 + i, 'Praha 1', 'Staré Město', false)),
  card(40, undefined, undefined, false, { labels: ['castle', 'outside'], rarity: 'expedition' }),
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/locations', route => route.fulfill({ json: CARDS }));
});

test('with the side column My Collections stays lit and disabled, and a long Back to Explore under the map leads out, without moving the map', async ({ page }) => {
  await page.setViewportSize({ width: 1180, height: 700 });
  await page.goto('/explore');
  await page.locator('.district-map__area').first().waitFor();
  const cards = page.locator('.explore-main .loc-card');
  const map = page.locator('.district-map__svg');
  const mapTop = async () => (await map.boundingBox()).y;
  const start = await mapTop();
  await page.getByRole('button', { name: 'Collected', exact: true }).click();
  const back = page.getByRole('button', { name: 'Back to the Dex' });
  await expect(cards).toHaveCount(10);
  await expect(page.locator('.explore-side .explore-title')).toHaveText("All You've Collected So Far");
  const mine = page.getByRole('button', { name: 'Collected', exact: true });
  await expect(mine).toBeDisabled();
  await expect(mine).toHaveClass(/filter-btn--active/);
  await expect(page.locator('.explore-side__exit .filter-btn')).toHaveCount(1);
  const [backBox, mapBox, sideBox] = await Promise.all([back.boundingBox(), map.boundingBox(), page.locator('.explore-side__filters').boundingBox()]);
  expect(backBox.y).toBeGreaterThan(mapBox.y + mapBox.height - 1);
  expect(Math.abs(backBox.width - sideBox.width)).toBeLessThan(2);
  expect(await back.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  expect(await mapTop()).toBe(start);
  await back.click();
  await expect(cards).toHaveCount(32);
  await expect(page.locator('.explore-side .explore-title')).toHaveText('Collect Every Card in Prague');
  await expect(page.getByRole('button', { name: 'Collected', exact: true })).toBeVisible();
});

test('a card off screen pauses its animations and restarts them when it comes back', async ({ page }) => {
  const MYTHIC = Array.from({ length: 60 }, (_, i) => card(i, 'Praha 11', 'Chodov', true, { rarity: 'mythic', xpReward: 70 }));
  await page.route('**/api/locations', route => route.fulfill({ json: MYTHIC }));
  await page.setViewportSize({ width: 1920, height: 940 });
  await page.goto('/explore');
  await page.locator('.district-map__area').first().waitFor();
  const cards = page.locator('.explore-main .loc-card');
  await expect(cards).toHaveCount(60);
  const states = at => cards.nth(at).evaluate(el => [...new Set(el.getAnimations({ subtree: true }).map(a => a.playState))].join());
  await expect.poll(() => states(0)).toBe('running');
  await expect.poll(() => states(59)).toBe('paused');
  await cards.nth(59).scrollIntoViewIfNeeded();
  await expect.poll(() => states(59)).toBe('running');
  await expect.poll(() => states(0)).toBe('paused');
});

test('Treasure Hunt Finds in the collection card shows the count and filters to those cards', async ({ page }) => {
  await page.route('**/api/user/treasures', route => route.fulfill({ json: [{ slug: 'card-0' }, { slug: 'card-2' }, { slug: 'card-4' }, { slug: 'card-6' }] }));
  await page.setViewportSize({ width: 2560, height: 1300 });
  await page.goto('/explore');
  await page.locator('.district-map__area').first().waitFor();
  await page.getByRole('button', { name: 'Collected', exact: true }).click();
  const cards = page.locator('.explore-main .loc-card');
  await expect(cards).toHaveCount(10);
  const row = page.locator('.explore-collection__hunt');
  await expect(row).toContainText('Treasure Hunt Finds: 4');
  await row.getByRole('button', { name: 'Show' }).click();
  await expect(cards).toHaveCount(4);
  await expect(page.locator('.explore-collection')).toHaveCount(0);
  await expect(page.locator('.explore-applied__item')).toContainText('Treasure Hunt Finds');
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(cards).toHaveCount(10);
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: 'Show' }).click();
  await expect(cards).toHaveCount(4);
  await page.getByRole('button', { name: 'Back to the Dex' }).click();
  await expect(cards).toHaveCount(32);
  await page.getByRole('button', { name: 'Collected', exact: true }).click();
  await expect(cards).toHaveCount(10); // the treasure filter did not stay on
});

test('with no treasure found the Show button is off', async ({ page }) => {
  await page.route('**/api/user/treasures', route => route.fulfill({ json: [] }));
  await page.setViewportSize({ width: 2560, height: 1300 });
  await page.goto('/explore');
  await page.locator('.district-map__area').first().waitFor();
  await page.getByRole('button', { name: 'Collected', exact: true }).click();
  const row = page.locator('.explore-collection__hunt');
  await expect(row).toContainText('Treasure Hunt Finds: 0');
  await expect(row.getByRole('button', { name: 'Show' })).toBeDisabled();
});

test.describe('Explore on a 2K screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1300 });
    await page.goto('/explore');
    await page.locator('.district-map__area').first().waitFor();
  });

  test('the title, filters and map sit in a side column, the cards fill the rest, nine to a row', async ({ page }) => {
    const side = page.locator('.explore-side');
    await expect(side.locator('.explore-title')).toBeVisible();
    await expect(side.locator('.filter-bar__search')).toBeVisible();
    await expect(page.locator('.explore-main .explore-stats')).toBeVisible(); // by the sort button
    await expect(side.locator('.explore-stats')).toHaveCount(0);
    await expect(side.locator('.area-filter')).toHaveCount(0);
    const tops = await Promise.all(['.filter-bar__search', '.scope-toggle', '.filter-bar__bottom'].map(s => side.locator(s).boundingBox()));
    expect(tops[0].y).toBeLessThan(tops[1].y);
    expect(tops[1].y).toBeLessThan(tops[2].y);
    await expect.poll(() => page.locator('.explore-main .loc-card').evaluateAll(els => new Set(els.map(e => Math.round(e.getBoundingClientRect().left))).size)).toBe(9);
  });

  test('clicking the map filters the cards, a second click clears; it works inside My Collections', async ({ page }) => {
    const cards = page.locator('.explore-main .loc-card');
    await expect(cards).toHaveCount(32); // the city
    const area = page.locator('.district-map__area').nth(5); // Praha 11
    await area.click();
    await expect(cards).toHaveCount(20);
    await expect(page.locator('.district-map__selected')).toHaveCount(1);
    await expect(page.locator('.explore-side .explore-title')).toContainText('11');

    await page.getByRole('button', { name: 'Collected', exact: true }).click();
    await expect(cards).toHaveCount(10); // collected, in that district

    await area.click();
    await expect(cards).toHaveCount(10); // every collected card
    await expect(page.locator('.district-map__selected')).toHaveCount(0);
  });

  test('My Collections with no filter shows the ring and rarity counts; any filter replaces them', async ({ page }) => {
    const summary = page.locator('.explore-collection');
    await expect(summary).toHaveCount(0);
    await page.getByRole('button', { name: 'Collected', exact: true }).click();
    await expect(summary.locator('svg text').first()).toHaveText('31%'); // 10 of the 32 city cards
    await expect(summary.locator('.stat-card__value')).toHaveText('10');
    await expect(summary.locator('.rarity-compact__item')).toHaveCount(7);
    await expect(summary.locator('.rarity-compact__item').nth(1)).toContainText('10'); // rare
    await expect(summary.locator('.rarity-compact__item').nth(0).locator('button')).toHaveCount(0); // none collected, nothing to filter
    await expect(page.locator('.explore-stats')).not.toContainText('/');

    await summary.locator('.rarity-compact__item').nth(1).locator('button').click(); // filters the collection
    await expect(summary).toHaveCount(0);
    await expect(page.locator('.explore-applied__item')).toContainText('Rare');
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(summary).toHaveCount(1);

    await page.locator('.district-map__area').nth(5).click();
    await expect(summary).toHaveCount(0);
    await expect(page.locator('.explore-applied__item')).toHaveCount(1);
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(summary).toHaveCount(1);

    await page.getByRole('button', { name: 'Back to the Dex' }).click();
    await expect(summary).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Collected', exact: true })).toBeVisible();
  });

  test('with no filter a second card shows the next level and the achievements closest to done', async ({ page }) => {
    const ach = (id, current, target) => ({ id, name: `Ach ${id}`, flavor: 'x', description: 'y', difficulty: 'easy', unlocked: false, progress: { current, target } });
    await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: [ach('far', 1, 10), ach('near', 9, 10), ach('none', 0, 5)], levels: [{ level: 1, xpRequired: 0, title: 'One' }, { level: 2, xpRequired: 80, title: 'Two' }, { level: 3, xpRequired: 240, title: 'Market-Goer' }] } }));
    const draw = { active: true, expiresAt: new Date(Date.now() + 3600 * 1000 * 2.5).toISOString() };
    await page.route('**/api/user/random-draw', route => route.fulfill({ json: draw }));
    await page.route('**/api/user/history-progress*', route => route.fulfill({ json: { slug: 'a', updatedAt: null, summary: { read: 12, total: 300, title: { en: 'The Goose and the Swan' }, era: { en: 'On the Eve of the Storm' }, startYear: 1415.3 } } }));
    await page.reload();
    const next = page.locator('.explore-next');
    await expect(next).toContainText('100 XP to level 3 · Market-Goer');
    await expect(next.locator('.explore-next__hunt')).toHaveText(/^Treasure hunt: 02:(29|30):\d\d$/);
    await expect(next.locator('.explore-next__hunt')).toHaveAttribute('href', '/treasure-hunt');
    await expect(next.locator('.explore-next__sub')).toHaveText('Almost there');
    await expect(next.locator('.explore-next__reading')).toHaveText('History: On the Eve of the Storm · 1415 · The Goose and the Swan');
    await expect(next.locator('.explore-next__reading')).toHaveAttribute('href', '/history');
    await expect(next.locator('.ach-bar')).toHaveCount(2); // only the achievements' own bars
    const looks = await next.locator('.explore-next__row').evaluateAll(els => els.map(e => { const c = getComputedStyle(e); return `${c.fontSize} ${c.color}`; }));
    expect(new Set(looks).size).toBe(1);
    const order = await next.locator('.explore-next__row').evaluateAll(els => els.map(e => e.className.split('__').pop()));
    expect(order).toEqual(['level', 'hunt', 'reading']); // no position here, so no nearest-card row
    await next.locator('.explore-next__level').click();
    await expect(page.locator('.levels-modal')).toContainText('Market-Goer');
    await page.locator('.levels-modal .px-modal__close').click();
    const rows = next.locator('.explore-next__ach');
    await expect(rows).toHaveCount(2);
    await expect(rows.first()).toContainText('Ach near');
    await expect(rows.first()).toContainText('9 / 10');
    await expect(rows.first().locator('.ach-badge-pill')).toHaveText('Bronze');
    const [nameBox, pillBox] = await Promise.all([rows.first().locator('.explore-next__name').boundingBox(), rows.first().locator('.ach-badge-pill').boundingBox()]);
    expect(pillBox.width).toBeLessThan(90); // only as wide as its word, leaving the name room
    expect(pillBox.x).toBeGreaterThan(nameBox.x + nameBox.width - 1); // on the name's line, to its right
    expect(Math.abs((pillBox.y + pillBox.height / 2) - (nameBox.y + nameBox.height / 2))).toBeLessThan(4);
    const [card, panel] = await Promise.all([next.boundingBox(), page.locator('.explore-side__applied').boundingBox()]);
    expect(Math.abs(card.y + card.height - panel.y - panel.height)).toBeLessThan(1); // fills the column
    await rows.first().click();
    await expect(page.locator('.ach-modal')).toContainText('Ach near');
    await page.locator('.ach-modal .px-modal__close').click();

    await page.locator('.district-map__area').nth(5).click();
    await expect(next).toHaveCount(0); // a filter takes its place
  });

  test('long level, era and event names stay on one line and end in dots', async ({ page }) => {
    const long = 'A Very Long Name That Goes On And On Well Past The Width Of The Whole Column Here';
    await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: [], levels: [{ level: 1, xpRequired: 0, title: 'One' }, { level: 2, xpRequired: 900, title: long }] } }));
    await page.route('**/api/user/history-progress*', route => route.fulfill({ json: { slug: 'a', updatedAt: null, summary: { read: 1, total: 9, title: { en: long }, era: { en: long }, startYear: 1415 } } }));
    await page.reload();
    await page.locator('.explore-next__reading').waitFor();
    for (const selector of ['.explore-next__level', '.explore-next__reading']) {
      const box = await page.locator(selector).first().evaluate(e => ({ cut: e.scrollWidth > e.clientWidth, height: e.getBoundingClientRect().height, ellipsis: getComputedStyle(e).textOverflow }));
      expect(box.cut, selector).toBe(true);
      expect(box.ellipsis, selector).toBe('ellipsis');
      expect(box.height, selector).toBeLessThan(30);
    }
  });

  test('at 2K the column never scrolls with the second card showing, however short the window', async ({ page }) => {
    const ach = id => ({ id, name: `Ach ${id}`, flavor: 'x', description: 'y', difficulty: 'hard', unlocked: false, progress: { current: 9, target: 10 } });
    await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: ['a', 'b', 'c', 'd', 'e'].map(ach), levels: [{ level: 1, xpRequired: 0, title: 'One' }, { level: 2, xpRequired: 900, title: 'Two' }] } }));
    await page.route('**/api/user/history-progress*', route => route.fulfill({ json: { slug: 'a', updatedAt: null, summary: { read: 1, total: 9, title: { en: 'Title' }, era: { en: 'Era' }, startYear: 1415 } } }));
    await page.reload();
    await page.locator('.explore-next__ach').first().waitFor();
    for (const height of [1400, 1254, 1100, 900]) {
      await page.setViewportSize({ width: 2560, height });
      await expect.poll(() => page.evaluate(() => {
        const panel = document.querySelector('.explore-side__applied');
        const side = document.querySelector('.explore-side');
        return panel.scrollHeight <= panel.clientHeight && side.scrollHeight <= side.clientHeight;
      }), `${height}`).toBe(true);
    }
  });

  test('with no hunt running the second card says one can start', async ({ page }) => {
    await page.route('**/api/user/random-draw', route => route.fulfill({ json: { active: false, canDraw: true, location: null, drawnAt: null, expiresAt: null } }));
    await page.reload();
    const hunt = page.locator('.explore-next .explore-next__hunt');
    await expect(hunt).toHaveText('A treasure hunt is ready to start');
    await expect(hunt).toHaveAttribute('href', '/treasure-hunt');
  });

  test('the filters that are on show under the map with their lines, and clear from there', async ({ page }) => {
    const applied = page.locator('.explore-side__applied .explore-applied__item');
    await expect(applied).toHaveCount(0);
    await expect(page.locator('.explore-applied__default:not(.explore-next)')).toContainText('Tip'); // no position: a tip

    await page.locator('.district-map__area').nth(5).click(); // Praha 11
    await expect(applied).toHaveCount(1);
    await expect(applied.first()).not.toContainText('More about this area');
    await expect(applied.first().locator('.explore-applied__name--link')).toHaveText('Prague 11');
    await expect(page.locator('.explore-header .explore-area-blurb .area-guide-link')).toHaveCount(0); // not at the top any more

    const buttons = page.locator('.explore-side .label-filter > .filter-btn');
    await buttons.nth(1).click();
    await page.locator('.explore-side .label-pill', { hasText: 'Rare' }).click();
    await buttons.nth(1).click();
    await buttons.nth(0).click();
    await page.locator('.explore-side .label-pill', { hasText: /Castle/ }).click();
    await buttons.nth(0).click();
    await expect(applied).toHaveCount(3);
    await expect(applied.nth(1)).toContainText("You'll walk past, stop, and walk back.");
    await expect(applied.nth(2)).toContainText('Built to keep everyone out');
    await expect(page.locator('.explore-header .explore-rarity-blurb')).toHaveCount(0);

    await applied.nth(2).getByRole('button', { name: /clear/i }).click();
    await expect(applied).toHaveCount(2);
    await applied.first().getByRole('button', { name: /clear/i }).click();
    await applied.first().getByRole('button', { name: /clear/i }).click();
    await expect(applied).toHaveCount(0);
    await expect(page.locator('.explore-main .loc-card')).toHaveCount(32);
  });

  test('switching mode leaves the map in place, and its line goes under the map above the filters', async ({ page }) => {
    await page.route('**/api/locations', route => route.fulfill({ json: CARDS }));
    const top = () => page.locator('.district-map__svg').evaluate(e => Math.round(e.getBoundingClientRect().top));
    const notes = page.locator('.explore-side__applied .explore-applied__note');
    const start = await top();
    await expect(notes).toHaveCount(0);

    await page.locator('.explore-side .scope-toggle__opt:not(.scope-toggle__opt--on)').click();
    await expect(notes).toHaveCount(1);
    await expect(notes.first()).toContainText('Bohemia');
    expect(await top()).toBe(start);
    await page.locator('.explore-side .scope-toggle__opt:not(.scope-toggle__opt--on)').click();

    await page.getByRole('button', { name: 'Collected', exact: true }).click();
    await expect(notes).toHaveCount(1);
    expect(await top()).toBe(start);

    await page.locator('.district-map__area').nth(5).click();
    await expect(page.locator('.explore-side .explore-title')).toContainText('11');
    await expect(page.locator('.explore-side__applied > *').first()).toHaveClass(/explore-applied__note/);
    await expect(page.locator('.explore-applied__item')).toHaveCount(1);
    expect(await top()).toBe(start);
  });

  test('in Show all, a click on the land around Prague shows only the expedition cards', async ({ page }) => {
    const cards = page.locator('.explore-main .loc-card');
    const clickOutside = async () => {
      const box = await page.locator('.district-map__svg').boundingBox();
      await page.mouse.click(box.x + 6, box.y + 6); // a corner of the map, beyond the boundary
    };
    await clickOutside(); // the land isn't clickable in city mode
    await expect(cards).toHaveCount(32);

    await page.locator('.explore-side .scope-toggle__opt:not(.scope-toggle__opt--on)').click();
    await expect(cards).toHaveCount(33);
    await clickOutside();
    await expect(cards).toHaveCount(1);
    await expect(page.locator('.explore-side .explore-title')).toHaveText('Expedition');
    await expect(page.locator('.district-map__glow--picked')).toHaveCount(1);
    expect(await page.locator('#district-map-glow stop').first().evaluate(e => e.style.stopColor)).toBe('var(--map-selected)');
    const item = page.locator('.explore-applied__item');
    await expect(item).toContainText('Bring a sandwich');
    await expect(item.locator('.explore-applied__name--link')).toHaveCount(0); // no guide for outside Prague

    await clickOutside();
    await expect(cards).toHaveCount(33);
    expect(await page.locator('#district-map-glow stop').first().evaluate(e => e.style.stopColor)).toBe('var(--gold)');

    // Back to the city, the filter goes with it.
    await clickOutside();
    await expect(cards).toHaveCount(1);
    await page.locator('.explore-side .scope-toggle__opt:not(.scope-toggle__opt--on)').click();
    await expect(cards).toHaveCount(32);
    await expect(item).toHaveCount(0);
  });

  test('at 2K the map has no fold button', async ({ page }) => {
    await expect(page.locator('.explore-map-fold')).toHaveCount(0);
  });

  test('the side column does not move at all when the cards scroll', async ({ page }) => {
    const top = () => page.locator('.explore-side').evaluate(e => e.getBoundingClientRect().top);
    await page.setViewportSize({ width: 2560, height: 500 });
    const start = await top();
    for (const y of [1, 3, 10, 200]) {
      await page.evaluate(v => window.scrollTo(0, v), y);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(y);
      expect(await top()).toBe(start);
    }
  });

  test('each picked rarity gets its own line under the map and clears on its own', async ({ page }) => {
    const buttons = page.locator('.explore-side .label-filter > .filter-btn');
    await buttons.nth(1).click();
    await page.locator('.explore-side .label-pill', { hasText: 'Rare' }).click();
    await page.locator('.explore-side .label-pill', { hasText: 'Common' }).click();
    await buttons.nth(1).click();
    const items = page.locator('.explore-applied__item');
    await expect(items).toHaveCount(2);
    await expect(page.locator('.explore-main .loc-card')).toHaveCount(32); // all the mock's city cards are Rare
    await items.filter({ hasText: 'Common' }).locator('.explore-applied__clear').click();
    await expect(items).toHaveCount(1);
    await expect(items).toContainText('Rare');
  });

  test('the label and rarity dropdowns stay inside the side column, on screen', async ({ page }) => {
    const col = await page.locator('.explore-side').boundingBox();
    const buttons = page.locator('.explore-side .label-filter > .filter-btn');
    for (const i of [0, 1]) {
      await buttons.nth(i).click();
      const panel = await page.locator('.explore-side .label-filter__panel').boundingBox();
      expect(panel.x).toBeGreaterThanOrEqual(col.x - 1);
      expect(panel.x + panel.width).toBeLessThanOrEqual(col.x + col.width + 1);
      await buttons.nth(i).click();
    }
  });

  test('one button clears the area, rarity and labels together', async ({ page }) => {
    const clear = page.getByRole('button', { name: 'Clear filters' });
    await expect(clear).toHaveCount(0);
    await page.locator('.district-map__area').nth(5).click();
    const buttons = page.locator('.explore-side .label-filter > .filter-btn');
    await buttons.nth(1).click();
    await page.locator('.explore-side .label-pill', { hasText: 'Rare' }).click();
    await buttons.nth(1).click();
    await buttons.nth(0).click();
    await page.locator('.explore-side .label-pill', { hasText: /Castle/ }).click();
    await buttons.nth(0).click();
    await expect(page.locator('.explore-applied__item')).toHaveCount(3);
    await clear.click();
    await expect(page.locator('.explore-applied__item')).toHaveCount(0);
    await expect(clear).toHaveCount(0);
    await expect(page.locator('.district-map__selected')).toHaveCount(0);
    await expect(page.locator('.explore-main .loc-card')).toHaveCount(32);
  });

  test('the side column never runs past the screen, however many filters are on', async ({ page }) => {
    const buttons = page.locator('.explore-side .label-filter > .filter-btn');
    await page.locator('.district-map__area').nth(5).click();
    await buttons.nth(0).click();
    for (const i of [1, 5, 9, 13, 17, 21, 25, 29]) await page.locator('.explore-side .label-pill').nth(i).click();
    await buttons.nth(0).click();
    for (const height of [1440, 1300, 950, 800]) {
      await page.setViewportSize({ width: 2560, height });
      await expect.poll(() => page.locator('.explore-side').evaluate(e => e.getBoundingClientRect().bottom <= innerHeight)).toBe(true);
      const sizes = await page.evaluate(() => {
        const box = s => document.querySelector(s).getBoundingClientRect();
        return { svg: box('.district-map__svg').height, stage: box('.district-map__stage').height, last: box('.district-map__caption').bottom, side: box('.explore-side').bottom };
      });
      expect(sizes.svg, `${height}`).toBeGreaterThan(60);
      expect(sizes.svg).toBeLessThanOrEqual(sizes.stage);
      expect(sizes.last).toBeLessThanOrEqual(sizes.side);
    }
  });

  test('the count has a total and a share in the city only', async ({ page }) => {
    const stats = page.locator('.explore-stats');
    await expect(stats).toContainText('/');
    await expect(stats).toContainText('%');
    await page.locator('.explore-side .scope-toggle__opt:not(.scope-toggle__opt--on)').click();
    await expect(stats).not.toContainText('/');
    await expect(stats).not.toContainText('%');
    await expect(stats).toContainText('10');
  });

  test('Show all lights up the land around the city', async ({ page }) => {
    const glow = page.locator('.district-map__glow');
    await expect(glow).toHaveCSS('opacity', '0');
    await page.locator('.explore-side .scope-toggle__opt:not(.scope-toggle__opt--on)').click();
    await expect(glow).toHaveClass(/district-map__glow--on/);
    await expect(glow).toHaveCSS('opacity', '1');
    await expect(page.locator('.explore-main .loc-card')).toHaveCount(33);
  });
});

test('with nothing chosen the map marks where the player is, without filtering', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 2560, height: 1300 }, baseURL: 'http://localhost:5173',
    geolocation: { latitude: 50.02, longitude: 14.44 }, permissions: ['geolocation'],
    storageState: { cookies: [], origins: [{ origin: 'http://localhost:5173', localStorage: [{ name: 'locationConsent', value: JSON.stringify({ granted: true, version: 2, at: '2026-10-22T00:00:00.000Z' }) }, { name: 'token', value: 'fake-jwt-token' }, { name: 'theme', value: 'dark' }] }] },
  });
  const page = await context.newPage();
  await context.route('**/api/packs', route => route.fulfill({ json: [] })); // the beforeEach mock doesn't reach a new context
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/locations', route => route.fulfill({ json: CARDS }));
  await page.goto('/explore');
  const marked = page.locator('.district-map__selected');
  await expect(marked).toHaveCount(1);
  await expect(marked).toHaveCSS('fill', 'rgb(224, 32, 44)');
  await expect(page.locator('.explore-main .loc-card')).toHaveCount(32); // only marked, not filtered
  const card = page.locator('.explore-applied__default:not(.explore-next)');
  const [badge, title] = await Promise.all([page.locator('.explore-here').boundingBox(), page.locator('.explore-side .explore-header').boundingBox()]);
  expect(Math.abs((badge.x + badge.width / 2) - (title.x + title.width / 2))).toBeLessThan(1); // centred in the column
  await expect(card).toContainText('Prague 12');
  await expect(page.locator('.explore-next')).toContainText('Your nearest uncollected card is');
  await expect(card).toContainText('Kamýk');
  await expect(card).not.toContainText('Cards collected here');
  await expect(card.locator('.explore-applied__name--link')).toHaveCount(2); // district and quarter
  await expect(card.locator('.area-guide-link')).toHaveCount(0);
  await expect(card).not.toContainText('Tip');
  const here = await marked.getAttribute('d');

  await page.locator('.explore-side').getByRole('tab').nth(1).click();
  await expect(marked).toHaveCount(1); // the quarter, in the quarter view
  expect(await marked.getAttribute('d')).not.toBe(here);
  await page.locator('.explore-side').getByRole('tab').nth(0).click();

  // A choice takes over from it, and it comes back when the choice is cleared.
  const area = page.locator('.district-map__area').nth(5); // Praha 11
  await area.click();
  await expect(page.locator('.explore-main .loc-card')).toHaveCount(20);
  await expect(marked).toHaveCount(1);
  expect(await marked.getAttribute('d')).not.toBe(here);
  await expect(card).toHaveCount(0); // a filter takes its place
  await expect(page.locator('.explore-applied__item .explore-applied__name--link')).toHaveCount(1);
  await expect(page.locator('.explore-applied__item .area-guide-link')).toHaveCount(0);
  await area.click();
  await expect(marked).toHaveAttribute('d', here);
  await expect(card).toContainText('Prague 12');
  await card.locator('.explore-applied__name--link').first().click();
  await expect(page.locator('.area-guide')).toBeVisible();
  await context.close();
});

test('clicking the area card anywhere but a name filters to district and quarter together', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 2560, height: 1300 }, baseURL: 'http://localhost:5173',
    geolocation: { latitude: 50.02, longitude: 14.44 }, permissions: ['geolocation'],
    storageState: { cookies: [], origins: [{ origin: 'http://localhost:5173', localStorage: [{ name: 'locationConsent', value: JSON.stringify({ granted: true, version: 2, at: '2026-10-22T00:00:00.000Z' }) }, { name: 'token', value: 'fake-jwt-token' }] }] },
  });
  const page = await context.newPage();
  await context.route('**/api/packs', route => route.fulfill({ json: [] })); // the beforeEach mock doesn't reach a new context
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/locations', route => route.fulfill({ json: [card(1, 'Praha 12', 'Kamýk', false), card(2, 'Praha 4', 'Kamýk', false), card(3, 'Praha 12', 'Modřany', false)] }));
  await page.goto('/explore');
  const cards = page.locator('.explore-main .loc-card');
  const here = page.locator('.explore-here-card');
  await here.locator('.explore-applied__name--link').first().click();
  await expect(page.locator('.area-guide')).toBeVisible(); // a name still opens its guide
  await expect(cards).toHaveCount(3);
  await page.keyboard.press('Escape');
  await page.locator('.px-modal__close').first().click({ timeout: 1000 }).catch(() => {});
  await here.locator('.explore-applied__text').first().click();
  await expect(cards).toHaveCount(1);
  await expect(page.locator('.explore-side .explore-title')).toContainText('12');
  await expect(page.locator('.explore-side .explore-title')).toContainText('Kamýk');
  await expect(page.locator('.district-map__selected')).toHaveCount(1); // on the quarter map
  const items = page.locator('.explore-applied__item');
  await expect(items).toHaveCount(2); // two filters, not one
  await expect(items.first()).toContainText('Prague 12');
  await expect(items.nth(1)).toContainText('Kamýk');
  await items.first().locator('.explore-applied__clear').click(); // only the district goes
  await expect(cards).toHaveCount(2);
  await expect(items).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(cards).toHaveCount(3);
  await context.close();
});

test('the nearest-card row opens that card, and it comes first', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 2560, height: 1300 }, baseURL: 'http://localhost:5173',
    geolocation: { latitude: 50.02, longitude: 14.44 }, permissions: ['geolocation'],
    storageState: { cookies: [], origins: [{ origin: 'http://localhost:5173', localStorage: [{ name: 'locationConsent', value: JSON.stringify({ granted: true, version: 2, at: '2026-10-22T00:00:00.000Z' }) }, { name: 'token', value: 'fake-jwt-token' }] }] },
  });
  const page = await context.newPage();
  await context.route('**/api/packs', route => route.fulfill({ json: [] })); // the beforeEach mock doesn't reach a new context
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/locations', route => route.fulfill({ json: CARDS }));
  await page.route('**/api/locations/*', route => route.fulfill({ json: { ...CARDS[1], description: { en: 'x', cz: 'x', zh: 'x' }, storyLocked: true } }));
  await page.goto('/explore');
  const row = page.locator('.explore-next__row').first();
  await expect(row).toHaveClass(/explore-next__nearest/);
  await row.click();
  await expect(page.locator('.px-modal--detail')).toBeVisible();
  await context.close();
});

test('a guest gets a link to the guide under the tip; a signed-in player does not', async ({ browser, page }) => {
  await page.setViewportSize({ width: 2560, height: 1300 });
  await page.goto('/explore');
  await expect(page.locator('.explore-applied__default:not(.explore-next)')).toContainText('Tip');
  await expect(page.locator('.explore-applied__default a')).toHaveCount(0);

  const context = await browser.newContext({
    viewport: { width: 2560, height: 1300 }, baseURL: 'http://localhost:5173',
    storageState: { cookies: [], origins: [{ origin: 'http://localhost:5173', localStorage: [{ name: 'locationConsent', value: JSON.stringify({ granted: true, version: 2, at: '2026-10-22T00:00:00.000Z' }) }] }] },
  });
  const guestPage = await context.newPage();
  await context.route('**/api/packs', route => route.fulfill({ json: [] })); // the beforeEach mock doesn't reach a new context
  await guestPage.route('**/api/locations', route => route.fulfill({ json: CARDS }));
  await guestPage.addInitScript(() => sessionStorage.setItem('guest', 'true'));
  await guestPage.goto('/explore');
  const intro = guestPage.locator('.explore-applied__default');
  await expect(intro).toContainText('What is this?');
  await expect(intro).toContainText('Within 100 m');
  await expect(intro).not.toContainText('Tip');
  await expect(intro.locator('a')).toHaveText('Learn more ›');
  await guestPage.locator('.explore-applied__default a').click();
  await expect(guestPage).toHaveURL(/\/guide$/);
  await context.close();
});

test('a long Czech name stays on one line and ends in dots, on any screen', async ({ page }) => {
  const long = 'Výzkumný ústav pro sdělovací techniku Alexandra Stěpanoviče Popova v Praze';
  await page.addInitScript(() => localStorage.setItem('lang', 'zh'));
  await page.route('**/api/locations', route => route.fulfill({ json: [card(1, 'Praha 11', 'Chodov', true, { localizedNames: { cz: long, zh: 'TESLA' } })] }));
  for (const width of [2560, 1920, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/explore');
    const name = page.locator('.loc-card__cz-name').first();
    await expect(name).toHaveText(long);
    const m = await name.evaluate(e => ({ cut: e.scrollWidth > e.clientWidth, overflow: getComputedStyle(e).textOverflow, height: e.getBoundingClientRect().height, line: parseFloat(getComputedStyle(e).lineHeight) || parseFloat(getComputedStyle(e).fontSize) * 1.4 }));
    expect(m.cut, `${width}`).toBe(true);
    expect(m.overflow).toBe('ellipsis');
    expect(m.height).toBeLessThan(m.line * 1.6);
  }
});

test('every card on Explore is the same size, whatever it holds', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lang', 'zh'));
  const rarities = ['common', 'rare', 'superior', 'epic', 'mythic', 'legend', 'expedition'];
  const long = 'Výzkumný ústav pro sdělovací techniku Alexandra Stěpanoviče Popova v Praze';
  const json = rarities.flatMap((rarity, r) => [
    card(r * 10 + 1, 'Praha 11', 'Chodov', false, { rarity }),
    card(r * 10 + 2, 'Praha 11', 'Chodov', true, { rarity }),
    card(r * 10 + 3, 'Praha 11', 'Chodov', true, { rarity, localizedNames: { zh: 'X' } }),
    card(r * 10 + 4, 'Praha 11', 'Chodov', true, { rarity, localizedNames: { cz: long, zh: 'Y' } }),
  ]);
  await page.route('**/api/locations', route => route.fulfill({ json }));
  for (const width of [2560, 1920, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/explore');
    const cards = page.locator('.location-grid .loc-card');
    await expect(cards).toHaveCount(json.length);
    await page.evaluate(() => document.fonts.ready);
    const heights = await cards.evaluateAll(els => [...new Set(els.map((e) => { e.style.alignSelf = 'start'; return Math.round(e.getBoundingClientRect().height); }))]);
    expect(heights, `${width}`).toHaveLength(1);
  }
});

test('hovering a card previews its names, status, labels and first paragraph', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lang', 'zh'));
  let fetched = 0;
  await page.route('**/api/locations', route => route.fulfill({ json: [
    card(1, 'Praha 11', 'Chodov', true, { labels: ['castle and fortress', 'bridge'], localizedNames: { cz: 'Velmi dlouhý český název karty', zh: '第一张' } }),
    card(2, 'Praha 11', 'Chodov', false, { localizedNames: { cz: 'Zamčená', zh: '第二张' } }),
  ] }));
  await page.route('**/api/locations/card-*', (route) => {
    fetched += 1;
    return route.fulfill({ json: { slug: 'x', description: { en: 'E', zh: '第一段内容。\n\n第二段内容。' } } });
  });
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto('/explore');
  const cards = { first: () => page.locator('.location-grid .loc-card[data-slug="card-1"]'), nth: () => page.locator('.location-grid .loc-card[data-slug="card-2"]') };
  const preview = page.locator('.card-preview');
  await cards.first().waitFor();
  await expect(cards.first()).not.toHaveAttribute('title');

  await cards.first().hover();
  await expect(preview).toContainText('第一张');
  await expect(preview).toContainText('Velmi dlouhý český název karty');
  await expect(preview).toContainText('已收集');
  await expect(preview.locator('.detail-label-pill')).toHaveCount(4); // two labels, then quarter and district
  await expect(preview).toContainText('布拉格11区');
  expect(await preview.locator('.detail-label-pill').first().evaluate(e => getComputedStyle(e).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  await expect(preview.locator('.card-preview__text')).toHaveText('第一段内容。');
  const box = await preview.boundingBox();
  const cardBox = await cards.first().boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(cardBox.x + cardBox.width);

  await cards.nth(1).hover();
  await expect(preview).toContainText('第二张');
  await expect(preview).toContainText('未收集');

  // Clicking through and moving away both close it; a card is fetched once.
  await page.mouse.move(1, 1);
  await expect(preview).toHaveCount(0);
  await cards.first().hover();
  await expect(preview.locator('.card-preview__text')).toHaveText('第一段内容。');
  expect(fetched).toBe(2);
  await page.mouse.down();
  await expect(preview).toHaveCount(0);
  await page.mouse.up();
});

test('below 2K the cards shrink with the window; Windows at 125% gets six to a row', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 730 });
  await page.goto('/explore');
  const grid = page.locator('.explore-main .location-grid');
  await page.locator('.explore-main .loc-card').first().waitFor();
  await expect.poll(() => grid.evaluate(e => getComputedStyle(e).gridTemplateColumns.split(' ').length)).toBe(6);
  const zoom = await grid.evaluate(e => parseFloat(e.style.zoom));
  expect(zoom).toBeGreaterThan(0.72);
  expect(zoom).toBeLessThan(0.8);
  // At 2K the same fit, for three rows: at this height one more column than usual.
  await page.setViewportSize({ width: 2560, height: 1300 });
  await expect.poll(() => grid.evaluate(e => getComputedStyle(e).gridTemplateColumns.split(' ').length)).toBe(9);
});

test('the toolbar stays at the top, and past the third row offers the way back', async ({ page }) => {
  const many = Array.from({ length: 58 }, (_, i) => card(i, 'Praha 1', 'Staré Město', true));
  await page.route('**/api/locations', route => route.fulfill({ json: many }));
  await page.setViewportSize({ width: 1920, height: 940 });
  await page.goto('/explore');
  await page.locator('.explore-main .loc-card').first().waitFor();
  const bar = page.locator('.explore-toolbar');
  const back = page.getByRole('button', { name: 'Back to top' });
  await expect(back).toHaveCount(0);
  const columns = await page.locator('.explore-main .location-grid').evaluate(e => getComputedStyle(e).gridTemplateColumns.split(' ').length);

  const third = page.locator('.explore-main .loc-card').nth(columns * 2);
  await page.evaluate(() => window.scrollTo(0, 40));
  await expect.poll(async () => (await bar.boundingBox()).y).toBe(60); // right under the navbar
  await expect(back).toHaveCount(0);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(back).toBeVisible();
  const [barBox, backBox, sortBox] = await Promise.all([bar.boundingBox(), back.boundingBox(), bar.locator('.label-filter .filter-btn').boundingBox()]);
  expect(barBox.y).toBe(60);
  expect(backBox.x + backBox.width).toBeLessThanOrEqual(sortBox.x); // left of the sort button
  expect((await third.boundingBox()).y).toBeLessThan(barBox.y + barBox.height);

  await back.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(back).toHaveCount(0);
});

test('only the admin gets the Edit button; logout sits in the navbar on desktop and on the profile on phones', async ({ page }) => {
  await page.route('**/api/locations/*', route => route.fulfill({ json: { ...CARDS[0], description: { en: 'x', cz: 'x', zh: 'x' } } }));
  await page.setViewportSize({ width: 1920, height: 940 });
  await page.goto('/explore');
  await expect(page.locator('.navbar__github')).toHaveCount(0);
  await expect(page.locator('.navbar__logout')).toBeVisible();
  await page.locator('.explore-main .loc-card').first().click();
  const edit = page.locator('.px-modal--detail').getByRole('button', { name: 'Edit', exact: true });
  await expect(page.locator('.px-modal--detail')).toBeVisible();
  await expect(edit).toHaveCount(0);

  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: { ...USER, isAdmin: true } } }));
  await page.reload();
  await page.locator('.explore-main .loc-card').first().click();
  await expect(edit).toBeVisible();

  await page.setViewportSize({ width: 412, height: 800 });
  await expect(page.locator('.navbar__logout')).toBeHidden();
});

test('without the column the area filter opens the map in a bottom sheet; the back button closes it', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 800 });
  await page.goto('/explore');
  await page.locator('.location-grid .loc-card').first().waitFor();
  await expect(page.locator('.explore-drawer')).toHaveCount(0);
  await expect(page.locator('.filter-bar__search')).toBeVisible();
  // My Collections and Packs share one row; Area, Labels and Rarity the next.
  const box = s => page.locator(s).first().boundingBox();
  const [areaBtn, labelsBtn, rarityBtn, mineBtn, packsBtn] = await Promise.all([
    box('.filter-bar__bottom .area-filter .filter-btn'),
    page.getByRole('button', { name: /^Labels/ }).boundingBox(),
    page.getByRole('button', { name: /^Rarity/ }).boundingBox(),
    box('.filter-bar__bottom > .filter-btn'),
    box('.filter-bar__bottom > .filter-btn:nth-of-type(2)'),
  ]);
  expect(Math.abs(areaBtn.y - labelsBtn.y)).toBeLessThan(2);
  expect(Math.abs(areaBtn.y - rarityBtn.y)).toBeLessThan(2);
  expect(areaBtn.y).toBeGreaterThan(mineBtn.y + mineBtn.height - 1);
  expect(Math.abs(mineBtn.y - packsBtn.y)).toBeLessThan(2);
  // The City only / Show all switch is in the sheet, not on the page.
  await expect(page.locator('.explore-page > .explore-header .scope-toggle, .filter-bar .scope-toggle')).toHaveCount(0);
  await page.locator('.filter-bar__bottom .area-filter .filter-btn').click();
  await expect(page.locator('.explore-drawer .district-map')).toBeVisible();
  await expect(page.locator('.explore-drawer .scope-toggle')).toBeVisible();
  await expect(page.locator('.explore-drawer .filter-bar')).toHaveCount(0);
  await expect(page.locator('.explore-drawer__clear')).toHaveCount(0);
  await page.goBack();
  await expect(page.locator('.explore-drawer')).toHaveCount(0);
  await expect(page).toHaveURL(/\/explore/);
  await expect(page.locator('.location-grid .loc-card').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('without the column the Packs button puts its line under the title, like a rarity', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 800 });
  await page.goto('/explore');
  await page.locator('.location-grid .loc-card').first().waitFor();
  await expect(page.locator('.explore-rarity-blurb')).toHaveCount(0);
  await page.locator('.filter-bar__bottom > .filter-btn').nth(1).click(); // Packs
  await expect(page.locator('.explore-rarity-blurb')).toHaveText(/walkable corner of the city/);
  await page.locator('.filter-bar__bottom > .filter-btn').nth(1).click();
  await expect(page.locator('.explore-rarity-blurb')).toHaveCount(0);
});

test('without the column the filters and search fold away and stay folded', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 800 });
  await page.goto('/explore');
  await page.locator('.location-grid .loc-card').first().waitFor();
  await page.locator('.filter-bar__search').fill('Card');
  const fold = page.locator('.explore-filters-fold');
  await fold.click();
  await expect(page.locator('.filter-bar')).toHaveCount(0);
  await expect(page.locator('.explore-title')).toBeVisible();
  await expect(fold).toContainText('(1)'); // the search still applies
  await page.reload();
  await page.locator('.explore-filters-fold').waitFor();
  await expect(page.locator('.filter-bar')).toHaveCount(0);
  await page.locator('.explore-filters-fold').click();
  await expect(page.locator('.filter-bar__search')).toBeVisible();
});

test('without the column, Clear filters appears with any filter and clears them all', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 800 });
  await page.goto('/explore');
  await page.locator('.location-grid .loc-card').first().waitFor();
  const clear = page.locator('.explore-clear-filters');
  await expect(clear).toHaveCount(0);
  const search = page.locator('.filter-bar__search');
  await search.fill('zzz-nothing');
  await expect(page.locator('.location-grid .loc-card')).toHaveCount(0);
  await page.locator('.filter-bar__bottom > .filter-btn').first().click(); // My Collections
  await clear.click();
  await expect(clear).toHaveCount(0);
  await expect(search).toHaveValue('');
  // Clearing keeps My Collections, which is not a filter: only its own button is left.
  await expect(page.locator('.filter-bar__bottom > .filter-btn').first()).toHaveClass(/filter-btn--active/);
  await expect(page.locator('.explore-view-filters')).toHaveCount(0);
  await expect(page.locator('.explore-filter-actions button')).toHaveCount(1);
  await page.locator('.explore-leave-collection').click();
  await expect(page.locator('.explore-leave-collection')).toHaveCount(0);
  await expect(page.locator('.filter-bar__bottom > .filter-btn').first()).not.toHaveClass(/filter-btn--active/);
  await expect(page.locator('.location-grid .loc-card').first()).toBeVisible();
});

test('without the column, View filters lists the filters with their lines; clearing the last one closes it', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 800 });
  await page.goto('/explore');
  await page.locator('.location-grid .loc-card').first().waitFor();
  await page.locator('.filter-bar__search').fill('a');
  await page.locator('.explore-view-filters').click();
  const items = page.locator('.explore-drawer .explore-applied__item');
  await expect(items).toHaveCount(1);
  await expect(items.first()).toContainText('“a”');
  await expect(page.locator('.explore-drawer .explore-applied__default')).toHaveCount(0);
  await items.first().locator('.explore-applied__clear').click();
  await expect(page.locator('.explore-drawer')).toHaveCount(0);
  await expect(page.locator('.explore-view-filters')).toHaveCount(0);
  await expect(page).toHaveURL(/\/explore/);
});

test('without the column a signed-in player has a level bar that opens Next up', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('token', 'x'));
  await page.route('**/api/auth/me', r => r.fulfill({ json: { user: { _id: 'u1', username: 'p', totalXP: 20500, explorerLevel: 37, levelInfo: { level: 37, title: 'Keeper', xp: 20500, nextLevelXP: 21000, progress: 50 } } } }));
  await page.route('**/api/user/achievements', r => r.fulfill({ json: { achievements: [], levels: [{ level: 37, xpRequired: 20000, title: 'A' }, { level: 38, xpRequired: 21000, title: 'B' }] } }));
  await page.setViewportSize({ width: 412, height: 800 });
  await page.goto('/explore');
  const bar = page.locator('.explore-level');
  await expect(bar).toContainText('Lv 37');
  await expect(bar).toContainText('500');
  await expect(page.locator('.explore-level__fill')).toHaveAttribute('style', /50%/);
  await bar.click();
  await expect(page.locator('.explore-drawer .explore-next')).toBeVisible();
  await page.goBack();
  await expect(page.locator('.explore-drawer')).toHaveCount(0);
  await page.setViewportSize({ width: 1536, height: 730 });
  await expect(page.locator('.explore-header .explore-level')).toHaveCount(0);
  const meter = page.locator('.explore-toolbar .explore-level');
  await expect(meter).toContainText('Keeper');
  await expect(meter).toContainText('500');
  await expect(page.locator('.navbar__user')).toContainText('Lv 37');
});

test('too narrow or too short for the column, Explore stays stacked', async ({ page }) => {
  for (const [width, height] of [[1100, 900], [1366, 650]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/explore');
    await page.locator('.location-grid .loc-card').first().waitFor();
    await expect(page.locator('.explore-side')).toHaveCount(0);
    await expect(page.locator('.area-filter').first()).toBeVisible();
    await expect(page.locator('.district-map')).toHaveCount(0);
  }
});

for (const [name, width, height, column] of [['13-inch MacBook', 1440, 790, 340], ['1080p', 1920, 940, 440], ['iPad sideways', 1194, 760, 340]]) {
  test(`a compact side column on a ${name}, inside the screen`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/explore');
    await page.locator('.district-map__area').first().waitFor();
    const side = await page.locator('.explore-side').boundingBox();
    expect(side.width).toBe(column);
    expect(side.y + side.height).toBeLessThanOrEqual(height);
    expect((await page.locator('.district-map__svg').boundingBox()).width).toBeGreaterThan(column - 30); // as big as the column allows
    await expect(page.locator('.explore-next')).toBeVisible();
    await expect(page.locator('.explore-side')).toHaveCSS('overflow-y', 'auto');
    await expect(page.locator('.explore-side')).toHaveCSS('scrollbar-width', 'none');

    await expect(page.locator('.explore-main .explore-stats')).toHaveCount(1); // by the sort button
    await expect(page.locator('.explore-side .explore-stats')).toHaveCount(0);
    const statsBox = await page.locator('.explore-main .explore-stats').boundingBox();
    expect(statsBox.height).toBeLessThan(40); // one line

    const dropdown = page.locator('.explore-side .filter-bar__bottom .label-filter .filter-btn').first();
    await dropdown.click();
    const panel = await page.locator('.explore-side .label-filter__panel').boundingBox();
    expect(panel.x).toBeGreaterThanOrEqual(side.x); // not clipped by the scrolling column
    expect(panel.x + panel.width).toBeLessThanOrEqual(side.x + side.width);
    await dropdown.click();

    const fold = page.locator('.explore-map-fold');
    await expect(fold).toHaveText('Hide map');
    await fold.click();
    await expect(page.locator('.district-map')).toHaveCount(0);
    await expect(fold).toHaveText('Show map');
    await fold.click();
    await page.locator('.district-map__area').first().waitFor();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.setViewportSize({ width, height: height - 1 });
    await page.setViewportSize({ width, height });
    const start = (await page.locator('.explore-side').boundingBox()).y;
    await page.evaluate(() => window.scrollTo(0, 30));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(30);
    expect((await page.locator('.explore-side').boundingBox()).y).toBe(start); // doesn't hop when scrolling starts
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('.district-map__area').nth(5).click();
    await expect(page.locator('.explore-main .loc-card')).toHaveCount(20);
  });
}
