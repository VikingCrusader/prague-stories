import { test, expect } from '@playwright/test';

const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 140, explorerLevel: 2 };
const CARDS = Array.from({ length: 12 }, (_, i) => ({
  _id: String(i), name: `Card ${i}`, slug: `card-${i}`, localizedNames: { cz: 'x', zh: 'x' }, labels: ['church'], coverImage: '', pixelArtKey: '',
  rarity: 'rare', xpReward: 20, unlocked: false, district: 'Praha 2', quarter: 'Vinohrady',
  coordinates: { lat: 50.05 + (i % 4) * 0.015, lng: 14.3 + (i % 6) * 0.06 }, createdAt: '2026-01-01T00:00:00.000Z',
}));
const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/locations', route => route.fulfill({ json: CARDS }));
  await page.route('**/api/locations/*', route => route.fulfill({ json: { ...CARDS[0], description: { en: 'x', cz: 'x', zh: 'x' } } }));
  await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: [], levels: [] } }));
});

for (const [name, options, cls, tiles] of [
  ['2K', { viewport: { width: 2560, height: 1300 } }, null, 6],
  ['a 1080p screen', { viewport: { width: 1920, height: 1080 } }, 'map-board--compact', 5],
  ['Windows at 125%', { viewport: { width: 1536, height: 730 } }, 'map-board--compact', 4],
  ['a MacBook', { viewport: { width: 1440, height: 900 }, userAgent: MAC }, 'map-board--scaled', 6],
  ['an iPad', { viewport: { width: 1180, height: 820 }, userAgent: MAC, hasTouch: true }, 'map-board--narrow', 4],
]) {
  test.describe(`on ${name}`, () => {
    test.use(options);
    test(`the board layout has ${tiles} tiles and a left column that doesn't scroll`, async ({ page }) => {
      await page.goto('/map');
      await expect(page.locator('.map-bottom .map-tile')).toHaveCount(tiles);
      if (cls) await expect(page.locator('.map-page')).toHaveClass(new RegExp(cls));
      expect(await page.locator('.map-slot--left').evaluate(s => s.scrollHeight <= s.clientHeight)).toBe(true);
    });
  });
}

test.describe('on a phone', () => {
  test.use({ viewport: { width: 412, height: 860 } });
  test('the map fills the page and the rest opens in sheets; the back button closes them', async ({ page }) => {
    await page.goto('/map');
    await expect(page.locator('.map-board--phone')).toHaveCount(1);
    await expect(page.locator('.map-slot--left')).toHaveCount(0);
    const actions = page.locator('.map-phone-actions .filter-btn');
    await actions.nth(0).click();
    const area = page.locator('.explore-drawer .district-map__area');
    await expect(area.first()).toBeVisible();
    await page.goBack();
    await expect(page.locator('.explore-drawer')).toHaveCount(0);
    await actions.nth(2).click();
    const tile = page.locator('.explore-drawer .map-tile').first();
    await expect(tile).toBeVisible();
    await tile.click();
    await expect(page.locator('.explore-drawer .map-card h3')).toBeVisible();
    await page.goBack();
    await expect(page.locator('.explore-drawer')).toHaveCount(0);
    await expect(page).toHaveURL(/\/map/);
  });
});

test.describe('on an ordinary screen', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });
  test('a chosen card has the right column to itself', async ({ page }) => {
    await page.goto('/map');
    await page.locator('.map-bottom .map-tile').first().click();
    await expect(page.locator('.map-card h3')).toBeVisible();
    await expect(page.locator('.map-slot--right .map-info__block')).toHaveCount(0);
  });
});

test.describe('on a narrow screen', () => {
  test.use({ viewport: { width: 1280, height: 720 } });
  const selectedDot = page => page.locator('.leaflet-overlay-pane path[stroke-width="3"]');

  test('the right column slides out for a card and closes again', async ({ page }) => {
    await page.goto('/map');
    const panel = page.locator('.map-slot--right');
    await expect(page.locator('.map-bottom .map-tile').first()).toBeVisible();
    await expect(panel).toBeHidden();
    await page.locator('.map-bottom .map-tile').first().click();
    await expect(page.locator('.map-card h3')).toBeVisible();
    await page.locator('.map-card__close').click();
    await expect(panel).toBeHidden();
  });

  test('a marker the panel would cover moves clear of it', async ({ page }) => {
    await page.goto('/map');
    const dots = page.locator('.leaflet-overlay-pane path');
    await expect(dots).toHaveCount(12);
    await page.waitForTimeout(1500); // the map settles on the whole city
    const map = await page.locator('.map-container').boundingBox();
    const rightmost = await dots.evaluateAll((els, m) => els
      .map((e, i) => { const b = e.getBoundingClientRect(); return { i, x: b.x + b.width / 2, y: b.y + b.height / 2 }; })
      .filter(p => p.x < m.x + m.width - 30)
      .sort((a, b) => b.x - a.x)[0], map);
    await page.mouse.click(rightmost.x, rightmost.y);
    await expect(page.locator('.map-card h3')).toBeVisible();
    await page.waitForTimeout(1200);
    const [dot, panel] = await Promise.all([selectedDot(page).boundingBox(), page.locator('.map-slot--right').boundingBox()]);
    expect(dot.x + dot.width).toBeLessThan(panel.x);
  });
});

for (const [name, options] of [
  ['2K', { viewport: { width: 2560, height: 1300 } }],
  ['a laptop', { viewport: { width: 1280, height: 720 } }],
  ['a phone', { viewport: { width: 412, height: 860 } }],
]) {
  test.describe(`clicking the map on ${name}`, () => {
    test.use(options);
    test('goes to the district, then the quarter', async ({ page }) => {
      await page.route('**/api/locations', route => route.fulfill({ json: [] }));
      await page.goto('/map');
      const lines = page.locator('.leaflet-boundaries-pane path');
      await expect(lines).toHaveCount(2);
      await page.waitForTimeout(1200);
      const box = await page.locator('.map-container').boundingBox();
      const middle = () => page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await middle();
      await expect(lines).toHaveCount(3); // the quarter lines appear
      await page.waitForTimeout(1200);
      await middle();
      await expect(lines).toHaveCount(4); // and the chosen quarter's outline
      await expect(page.locator('.leaflet-area-dim-pane path')).toHaveCount(2);
    });

    test('a marker opens its card without changing the area', async ({ page }) => {
      await page.goto('/map');
      const dots = page.locator('.leaflet-overlay-pane path');
      await expect(dots).toHaveCount(12);
      await page.waitForTimeout(1200);
      const dot = await dots.nth(5).boundingBox();
      await page.mouse.click(dot.x + dot.width / 2, dot.y + dot.height / 2);
      await expect(page.locator('.map-card h3')).toBeVisible();
      await expect(page.locator('.leaflet-boundaries-pane path')).toHaveCount(2);
      await expect(dots).toHaveCount(12);
    });
  });
}

test.describe('a landmark in an area guide', () => {
  test.use({ viewport: { width: 2560, height: 1300 } });
  const LANDMARK = { ...CARDS[0], _id: 'm', name: 'Peace Square', slug: 'namesti-miru', labels: ['square'], district: 'Praha 2', quarter: 'Vinohrady' };
  const chooseVinohrady = async page => {
    await page.route('**/api/locations', route => route.fulfill({ json: [...CARDS, LANDMARK] }));
    await page.route('**/api/locations/namesti-miru', route => route.fulfill({ json: { ...LANDMARK, description: { en: 'x', cz: 'x', zh: 'x' } } }));
    await page.goto('/map');
    const areas = page.locator('.map-slot--left .district-map .district-map__area');
    await areas.first().waitFor();
    await page.waitForTimeout(500);
    await areas.nth(await areas.evaluateAll(els => els.findIndex(e => /Prague 2 ·/.test(e.querySelector('title').textContent)))).click();
    const label = page.locator('.map-slot--left .district-sub__name').filter({ hasText: 'Vinohrady' });
    await label.waitFor();
    await page.waitForTimeout(500);
    const box = await label.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  };
  const tag = page => page.locator('.map-slot--right .area-guide__landmark button').filter({ hasText: 'Peace Square' });

  test('selects its card', async ({ page }) => {
    await chooseVinohrady(page);
    await tag(page).click();
    await expect(page.locator('.map-card h3')).toHaveText('Peace Square');
  });

  test('still selects it when a filter hides the card', async ({ page }) => {
    await chooseVinohrady(page);
    await expect(tag(page)).toBeVisible();
    await page.locator('.map-topbar__controls .filter-bar__search').fill('zzz');
    await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(0);
    await tag(page).click();
    await expect(page.locator('.map-card h3')).toHaveText('Peace Square');
    await expect(page.locator('.map-topbar__controls .filter-bar__search')).toHaveValue('');
  });
});
