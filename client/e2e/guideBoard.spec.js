import { test, expect } from '@playwright/test';

// The Guide's overview board on a 2K screen (GuideBoard.jsx).
test.use({ viewport: { width: 2560, height: 1300 } });

const card = (slug, name, rarity, xpReward) => ({
  _id: slug, slug, name, localizedNames: { cz: name, zh: name }, labels: ['church'],
  coordinates: { lat: 50.08, lng: 14.42 }, rarity, xpReward, coverImage: '', pixelArtKey: '',
  quarter: 'Staré Město', district: 'Praha 1',
});
const CARDS = [
  card('golden-lane', 'Golden Lane', 'common', 10),
  card('dancing-house', 'Dancing House', 'rare', 20),
  card('national-theatre', 'National Theatre', 'superior', 30),
  card('tyn-church', 'Týn Church', 'epic', 50),
  card('astronomical-clock', 'Astronomical Clock', 'mythic', 70),
  card('charles-bridge', 'Charles Bridge', 'legend', 100),
  { ...card('zizkov-tv-tower', 'Far Castle', 'expedition', 300), labels: ['castle', 'outside'] },
];

test.beforeEach(async ({ page }) => {
  await page.route('**/api/packs', route => route.fulfill({ json: [] }));
  await page.route('**/api/locations', route => route.fulfill({ json: CARDS }));
  await page.route('**/api/locations/*', route => route.fulfill({ json: { ...CARDS[5], description: { en: 'A bridge.' }, storyLocked: true } }));
  await page.goto('/guide');
});

// Screenshots for a human look, only when GUIDE_SHOTS names a folder.
const shot = (page, name) => (process.env.GUIDE_SHOTS ? page.screenshot({ path: `${process.env.GUIDE_SHOTS}/${name}.png` }) : null);

const settled = page => page.evaluate(() => Promise.all(
  [...document.querySelectorAll('.px-overlay, .px-modal')].flatMap(el => el.getAnimations()).map(a => a.finished.catch(() => {})),
));

test('the board shows every section as a tile and fits the screen', async ({ page }) => {
  const tiles = page.locator('.guide-tile');
  await expect(tiles).toHaveCount(14);
  await expect(page.locator('.guide-wrap')).toHaveCount(0);
  const last = await tiles.last().boundingBox();
  expect(last.y + last.height).toBeLessThanOrEqual(1300);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(2560);
  await page.waitForTimeout(900);
  await shot(page, 'board');
});

test('a tile opens its section in a window, Escape closes it', async ({ page }) => {
  await page.locator('.guide-tile--faq').click();
  const win = page.locator('.guide-window');
  await expect(win.locator('.guide-window__title')).toHaveText('FAQ');
  await win.locator('summary').first().click();
  await expect(win.locator('.guide-faq__a').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(win).toHaveCount(0);
});

test('rarity demo: seven real cards, locked and collected', async ({ page }) => {
  await page.locator('.guide-tile--rarity').click();
  const win = page.locator('.guide-window--demo');
  await expect(win.locator('.guide-rarity__row .loc-card')).toHaveCount(7);
  await win.locator('.guide-rarity__row .loc-card[data-rarity="epic"]').click();
  await expect(win.locator('.guide-rarity__big .loc-card')).toHaveAttribute('data-rarity', 'epic');
  await win.getByRole('button', { name: 'Locked' }).click();
  await expect(win.locator('.guide-rarity__big .loc-card')).toHaveClass(/loc-card--locked/);
  await settled(page);
  await shot(page, 'rarity');
});

test('demo cards show a distance, and the big card opens its detail over the window', async ({ page }) => {
  await page.locator('.guide-tile--rarity').click();
  const win = page.locator('.guide-window--demo');
  await expect(win.locator('.guide-rarity__row .loc-card__dist')).toHaveCount(7);
  await settled(page);
  await win.locator('.guide-rarity__big .loc-card').click();
  const detail = page.locator('.guide-detail .px-modal--detail');
  await expect(detail).toBeVisible();
  await expect(win).toBeVisible();
  await page.keyboard.press('Escape'); // the Guide's window stays while the detail is on top
  await expect(win).toBeVisible();
  await detail.locator('.px-modal__close').first().click();
  await expect(detail).toHaveCount(0);
  await expect(win).toBeVisible();
});

test('check-in demo: the button works once you are within 100 m', async ({ page }) => {
  await page.locator('.guide-tile--collect').click();
  const win = page.locator('.guide-window--demo');
  const collect = win.getByRole('button', { name: 'Collect' });
  await expect(collect).toBeDisabled();
  await settled(page);
  const map = await win.locator('.guide-checkin__map').boundingBox();
  await page.mouse.move(map.x + map.width * 0.25, map.y + map.height * 0.25);
  await page.mouse.down();
  await page.mouse.move(map.x + map.width * 0.53, map.y + map.height * 0.52, { steps: 8 });
  await page.mouse.up();
  await expect(win.locator('.guide-checkin__alert')).toBeVisible();
  await expect(collect).toBeEnabled();
  await collect.click();
  await expect(win.locator('.guide-checkin__status')).toContainText('Collected!');
  await shot(page, 'checkin');
});

test('hunt demo: walking brings clues, a miss drops two rungs, a find pays', async ({ page }) => {
  await page.locator('.guide-tile--hunt').click();
  const win = page.locator('.guide-window--demo');
  const slider = win.locator('.guide-hunt__slider input');
  const rung = win.locator('.guide-hunt__ladder li.is-on');
  await expect(rung).toHaveText('10×');
  await slider.fill(String(6000 - 2900)); // 2.9 km: the river bank comes free
  await expect(win.locator('.hunt-panel__square')).toContainText('castle side');
  await win.getByRole('button', { name: "It's here!" }).click();
  await win.locator('.hunt-panel__confirm .px-btn--gold').click();
  await expect(rung).toHaveText('3×');
  await slider.fill(String(6000 - 50));
  await win.getByRole('button', { name: "It's here!" }).click();
  await win.locator('.hunt-panel__confirm .px-btn--gold').click();
  await expect(win.locator('.hunt-panel__flash')).toContainText('+150 XP');
  await shot(page, 'hunt');
});

test('install window: three sketches each for iPhone and Android, each with its step', async ({ page }) => {
  await page.locator('.guide-tile--install').click();
  const win = page.locator('.guide-window--install');
  await expect(win.locator('.guide-install__row').first().locator('.guide-install__step')).toHaveCount(3);
  await expect(win.locator('.guide-install__row--android .guide-install__step')).toHaveCount(3);
  await expect(win.locator('.guide-mock__hit')).toHaveCount(8);
  await expect(win.locator('.guide-install__caption').first()).toContainText('Safari');
  await shot(page, 'install');
});

test('other screens get the board too: four columns, two, one on phones', async ({ page }) => {
  const columns = () => page.locator('.guide-board__grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  for (const [w, h, n] of [[1920, 950, 4], [1000, 800, 2], [390, 844, 1]]) {
    await page.setViewportSize({ width: w, height: h });
    await expect(page.locator('.guide-tile')).toHaveCount(14);
    expect(await columns()).toBe(n);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(w);
  }
  // On a phone a tile still opens its window, demo under the text.
  await page.locator('.guide-tile--hunt').click();
  await expect(page.locator('.guide-window .guide-hunt')).toBeVisible();
});
