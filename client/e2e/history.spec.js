import { test, expect } from '@playwright/test';

const T = (s) => ({ en: s, cz: s, zh: s });
const landmark = {
  slug: 'bridge', name: 'Bridge', localizedNames: { cz: 'Bridge', zh: 'Bridge' }, labels: ['bridge'], rarity: 'rare', xpReward: 20,
  coverImage: '', pixelArtKey: '', unlocked: true, coordinates: { lat: 50.08, lng: 14.41 },
};
const event = (slug, startYear, extra) => ({
  slug, era: 'one', startYear, cardType: 'event', tone: 'serious', year: T(String(startYear)), title: T(`Title ${slug}`),
  hookLine: T(`Hook ${slug}`), summary: T(`Summary of ${slug}.`), relatedLandmarks: [], images: [], ...extra,
});
const DATA = {
  eras: [{ key: 'one', order: 1, themeClass: 'era-1', title: T('Era One'), yearRange: T('1–10'), tagline: T('Tag'), hasContent: true }],
  events: [
    event('first', 1, { summary: T('See [[link:aside]]the aside[[/link]].'), relatedLandmarks: [{ landmark, relation: T('A crossing') }] }),
    event('aside', 1.5, { cardType: 'background' }),
    event('second', 2),
    event('third', 3),
  ],
};

test.beforeEach(async ({ page }) => {
  await page.route('**/api/history*', route => route.fulfill({ json: DATA }));
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
  await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: [] } }));
  await page.addInitScript(() => sessionStorage.setItem('guest', 'true'));
});

test.describe('History below 2K', () => {
  test('one event a time under the timeline, its extras after the text; turned with buttons and keys', async ({ page }) => {
    await page.goto('/history');
    await expect(page.locator('.history-axis')).toBeVisible();
    await expect(page.locator('.history-paged__page .history-event__title')).toHaveText('Title first');
    const summary = await page.locator('.history-event__summary').first().boundingBox();
    // Polled: the landmark wall is remounted when it measures again after the fonts load.
    await expect.poll(async () => {
      const landmarks = await page.locator('.history-event__landmarks').boundingBox();
      return !!landmarks && landmarks.x > summary.x + summary.width - 1; // text left, the rest right
    }).toBe(true);
    await expect(page.locator('.history-paged__reading')).toContainText('Related Reading');
    const [text, side] = await Promise.all(['.history-paged__text', '.history-paged__side'].map(c => page.locator(c).boundingBox()));
    expect(Math.abs(text.y + text.height - (side.y + side.height))).toBeLessThan(2); // the two end level
    await expect(page.locator('.history-sidebar')).toHaveCount(0);
    await expect(page.locator('.history-book')).toHaveCount(0);

    await page.getByRole('button', { name: 'Next ›' }).click();
    await expect(page).toHaveURL(/event=second/);
    await expect(page.locator('.history-paged__page .history-event__title')).toHaveText('Title second');
    await expect(page.locator('.history-book__count')).toHaveText('2 / 3');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.history-paged__page .history-event__title')).toHaveText('Title third');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('.history-paged__page .history-event__title')).toHaveText('Title second');
  });

  test('a new page starts at its top, and an in-text link to a background card stays on the page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 400 });
    await page.goto('/history');
    await page.locator('.history-event__title').first().waitFor();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.getByRole('button', { name: 'Next ›' }).click();
    await expect(page.locator('.history-paged__page .history-event__title')).toHaveText('Title second');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    await page.getByRole('button', { name: '‹ Previous' }).click();
    await page.getByText('the aside', { exact: true }).click();
    await expect(page.locator('.history-paged__page .history-event__title')).toHaveText(['Title first', 'Title aside']);
    expect(page.url()).not.toContain('event=aside');
  });

  test('achievements and reading go under the landmarks, under a short text, or else across the bottom', async ({ page }) => {
    const long = T(Array.from({ length: 60 }, () => 'A long paragraph of history that takes up a good deal of room on the page.').join('\n'));
    const many = Array.from({ length: 40 }, (_, i) => ({ landmark: { ...landmark, slug: `b${i}`, name: `B${i}` }, relation: T('A crossing') }));
    const links = { wikipediaUrl: 'https://en.wikipedia.org/wiki/Prague' };
    const data = {
      ...DATA,
      events: [
        event('roomy', 1, { summary: long, relatedLandmarks: [{ landmark, relation: T('A crossing') }], ...links }),
        event('short-text', 2, { relatedLandmarks: many, ...links }),
        event('no-room', 3, { summary: T('Line.'), relatedLandmarks: many, images: [], ...links }),
      ],
    };
    await page.route('**/api/history*', route => route.fulfill({ json: data }));
    await page.setViewportSize({ width: 1920, height: 950 });
    await page.goto('/history');
    const reading = page.locator('.history-paged__reading');
    await expect(reading).toBeVisible();
    await expect(page.locator('.history-paged__side .history-paged__reading')).toHaveCount(1); // room under the landmarks
    await expect(page.locator('.history-paged__bottom')).toHaveCount(0);

    await page.getByRole('button', { name: 'Next ›' }).click();
    await expect(page.locator('.history-paged__page .history-event__title')).toHaveText('Title short-text');
    await expect(page.locator('.history-paged__reading')).toHaveCount(1);
    await expect(page.locator('.history-paged__bottom')).toHaveCount(0); // room in one column or the other

    // Both columns ending level whichever way it went.
    const [text, side] = await Promise.all([page.locator('.history-paged__text').boundingBox(), page.locator('.history-paged__side').boundingBox()]);
    expect(Math.abs(text.height - side.height)).toBeLessThan(2);
  });

  test('more landmarks than a page holds turn pages, four to a row on a wide screen', async ({ page }) => {
    const many = Array.from({ length: 14 }, (_, i) => ({ landmark: { ...landmark, slug: `b${i}`, name: `B${i}` }, relation: T('A crossing') }));
    const data = { ...DATA, events: [event('first', 1, { relatedLandmarks: many }), ...DATA.events.slice(2)] };
    await page.route('**/api/history*', route => route.fulfill({ json: data }));
    await page.setViewportSize({ width: 1920, height: 950 });
    await page.goto('/history');
    const cards = page.locator('.history-paged__side .loc-card');
    await expect(page.locator('.history-book__links-pager')).toBeVisible();
    await expect.poll(() => cards.evaluateAll(els => new Set(els.map(e => Math.round(e.getBoundingClientRect().left))).size)).toBe(4);
    const shown = await cards.count();
    expect(shown).toBeLessThan(14);
    await page.locator('.history-book__links-pager button').last().click();
    await expect(cards.first().locator('.loc-card__name')).not.toHaveText('B0');
  });

  test('nine landmarks show whole however long the text is; a tenth starts paging', async ({ page }) => {
    const wall = n => Array.from({ length: n }, (_, i) => ({ landmark: { ...landmark, slug: `b${i}`, name: `B${i}` }, relation: T('A crossing') }));
    const data = { ...DATA, events: [event('nine', 1, { relatedLandmarks: wall(9) }), event('ten', 2, { relatedLandmarks: wall(10) })] };
    await page.route('**/api/history*', route => route.fulfill({ json: data }));
    await page.setViewportSize({ width: 1440, height: 790 });
    await page.goto('/history');
    const cards = page.locator('.history-paged__side .loc-card');
    await expect(cards).toHaveCount(9);
    await expect(page.locator('.history-book__links-pager')).toHaveCount(0);

    await page.getByRole('button', { name: 'Next ›' }).click();
    await expect(cards).toHaveCount(9);
    await expect(page.locator('.history-book__links-pager span')).toHaveText('1 / 2');
    const before = await page.locator('.history-book__links').boundingBox();
    await page.locator('.history-book__links-pager button').last().click();
    await expect(cards).toHaveCount(1);
    expect((await page.locator('.history-book__links').boundingBox()).height).toBeCloseTo(before.height, 0); // the page doesn't jump
  });

  test('on a phone the landmarks are two to a row', async ({ page }) => {
    const four = Array.from({ length: 4 }, (_, i) => ({ landmark: { ...landmark, slug: `b${i}`, name: `B${i}` }, relation: T('A crossing') }));
    await page.route('**/api/history*', route => route.fulfill({ json: { ...DATA, events: [event('first', 1, { relatedLandmarks: four })] } }));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/history');
    const cards = page.locator('.history-paged__side .loc-card');
    await expect(cards).toHaveCount(4);
    expect(await cards.evaluateAll(els => new Set(els.map(e => Math.round(e.getBoundingClientRect().left))).size)).toBe(2);
  });

  test('on a phone, pulling on past the end of a page turns it; a short pull does not', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, baseURL: 'http://localhost:5173',
      storageState: { cookies: [], origins: [{ origin: 'http://localhost:5173', localStorage: [{ name: 'locationConsent', value: JSON.stringify({ granted: true, version: 2, at: '2026-10-22T00:00:00.000Z' }) }] }] } });
    const page = await context.newPage();
    await page.route('**/api/history*', route => route.fulfill({ json: DATA }));
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: [] } }));
    await page.addInitScript(() => sessionStorage.setItem('guest', 'true'));
    await page.goto('/history?event=second');
    await expect(page.locator('.history-paged__page .history-event__title')).toHaveText('Title second');
    await expect(page.locator('.history-sidebar')).toHaveCount(0);
    await expect(page.locator('.history-paged__pull')).toBeVisible();

    const cdp = await context.newCDPSession(page);
    const drag = async (from, to) => {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(100);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: from }] });
      for (let y = from; y >= to; y -= 20) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 200, y }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    };
    await drag(600, 560);
    await page.waitForTimeout(200);
    await expect(page.locator('.history-paged__page .history-event__title')).toHaveText('Title second');
    await drag(600, 460);
    await expect(page.locator('.history-paged__page .history-event__title')).toHaveText('Title third');
    await context.close();
  });
});

test('a Mac or iPad gets the book view below 2K, and a tap opens a cut-off caption', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 790 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
    baseURL: 'http://localhost:5173',
    storageState: { cookies: [], origins: [{ origin: 'http://localhost:5173', localStorage: [{ name: 'locationConsent', value: JSON.stringify({ granted: true, version: 2, at: '2026-10-22T00:00:00.000Z' }) }] }] },
  });
  const page = await context.newPage();
  await page.route('**/api/history*', route => route.fulfill({ json: DATA }));
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
  await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: [] } }));
  await page.addInitScript(() => sessionStorage.setItem('guest', 'true'));
  await page.goto('/history');
  await expect(page.locator('.history-book')).toBeVisible();
  await expect(page.locator('.history-paged')).toHaveCount(0);
  const caption = page.locator('.history-book__links .history-landmark-caption > span').first();
  await caption.click();
  await expect(caption).toHaveClass(/is-open/);
  await context.close();
});

test('a 2K screen keeps the one-screen book view', async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1300 });
  await page.goto('/history');
  await expect(page.locator('.history-book')).toBeVisible();
  await expect(page.locator('.history-paged')).toHaveCount(0);
});
