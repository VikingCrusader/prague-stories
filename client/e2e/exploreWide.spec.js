import { test, expect } from '@playwright/test';

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

test.describe('Explore on a 2K screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1300 });
    await page.goto('/explore');
    await page.locator('.district-map__area').first().waitFor();
  });

  test('the title, filters and map sit in a side column, the cards fill the rest, eight to a row', async ({ page }) => {
    const side = page.locator('.explore-side');
    await expect(side.locator('.explore-title')).toBeVisible();
    await expect(side.locator('.filter-bar__search')).toBeVisible();
    await expect(side.locator('.explore-stats')).toBeVisible();
    await expect(side.locator('.area-filter')).toHaveCount(0);
    const tops = await Promise.all(['.filter-bar__search', '.scope-toggle', '.filter-bar__bottom'].map(s => side.locator(s).boundingBox()));
    expect(tops[0].y).toBeLessThan(tops[1].y);
    expect(tops[1].y).toBeLessThan(tops[2].y);
    await expect.poll(() => page.locator('.explore-main .loc-card').evaluateAll(els => new Set(els.map(e => Math.round(e.getBoundingClientRect().left))).size)).toBe(8);
  });

  test('clicking the map filters the cards, a second click clears; it works inside My Collections', async ({ page }) => {
    const cards = page.locator('.explore-main .loc-card');
    await expect(cards).toHaveCount(32); // the city
    const area = page.locator('.district-map__area').nth(5); // Praha 11
    await area.click();
    await expect(cards).toHaveCount(20);
    await expect(page.locator('.district-map__selected')).toHaveCount(1);
    await expect(page.locator('.explore-side .explore-title')).toContainText('11');

    await page.getByRole('button', { name: 'My Collections' }).click();
    await expect(cards).toHaveCount(10); // collected, in that district

    await area.click();
    await expect(cards).toHaveCount(10); // every collected card
    await expect(page.locator('.district-map__selected')).toHaveCount(0);
  });

  test('the filters that are on show under the map with their lines, and clear from there', async ({ page }) => {
    const applied = page.locator('.explore-side__applied .explore-applied__item');
    await expect(applied).toHaveCount(0);
    await expect(page.locator('.explore-applied__default')).toContainText('Tip'); // no position: a tip

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

    await page.locator('.explore-side .scope-toggle').click();
    await expect(notes).toHaveCount(1);
    await expect(notes.first()).toContainText('Bohemia');
    expect(await top()).toBe(start);
    await page.locator('.explore-side .scope-toggle').click();

    await page.getByRole('button', { name: 'My Collections' }).click();
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

    await page.locator('.explore-side .scope-toggle').click();
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
    await page.locator('.explore-side .scope-toggle').click();
    await expect(cards).toHaveCount(32);
    await expect(item).toHaveCount(0);
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

  test('Show all lights up the land around the city', async ({ page }) => {
    const glow = page.locator('.district-map__glow');
    await expect(glow).toHaveCSS('opacity', '0');
    await page.locator('.explore-side .scope-toggle').click();
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
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/locations', route => route.fulfill({ json: CARDS }));
  await page.goto('/explore');
  const marked = page.locator('.district-map__selected');
  await expect(marked).toHaveCount(1);
  await expect(marked).toHaveCSS('fill', 'rgb(224, 32, 44)');
  await expect(page.locator('.explore-main .loc-card')).toHaveCount(32); // only marked, not filtered
  const card = page.locator('.explore-applied__default');
  await expect(card).toContainText('Prague 12');
  await expect(card).toContainText('Your nearest uncollected card is');
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

test('a guest gets a link to the guide under the tip; a signed-in player does not', async ({ browser, page }) => {
  await page.setViewportSize({ width: 2560, height: 1300 });
  await page.goto('/explore');
  await expect(page.locator('.explore-applied__default')).toContainText('Tip');
  await expect(page.locator('.explore-applied__default a')).toHaveCount(0);

  const context = await browser.newContext({
    viewport: { width: 2560, height: 1300 }, baseURL: 'http://localhost:5173',
    storageState: { cookies: [], origins: [{ origin: 'http://localhost:5173', localStorage: [{ name: 'locationConsent', value: JSON.stringify({ granted: true, version: 2, at: '2026-10-22T00:00:00.000Z' }) }] }] },
  });
  const guestPage = await context.newPage();
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
  const cards = page.locator('.location-grid .loc-card');
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

test('below 2K Explore is unchanged', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/explore');
  await page.locator('.location-grid .loc-card').first().waitFor();
  await expect(page.locator('.explore-side')).toHaveCount(0);
  await expect(page.locator('.area-filter').first()).toBeVisible();
  await expect(page.locator('.district-map')).toHaveCount(0);
});
