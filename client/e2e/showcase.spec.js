import { test, expect, devices } from '@playwright/test';

// The card showcase on a phone: long press opens it, swipe up shows the
// story, swipe down brings the cover back, a sideways drag turns it over.
// Touches go through CDP so they reach the page as real touch input.
const { defaultBrowserType, ...pixel } = devices['Pixel 7'];
test.use(pixel);

const LOC = {
  _id: '1', name: 'Charles Bridge', slug: 'charles-bridge',
  localizedNames: { cz: 'Karlův most', zh: '查理大桥' },
  labels: ['bridge', 'historical'], coordinates: { lat: 50.0865, lng: 14.4114 },
  rarity: 'epic', xpReward: 50, coverImage: '', pixelArtKey: '', unlocked: true,
};

// Long enough that the story panel has to scroll.
const STORY = Array.from({ length: 12 }, (_, i) => `Paragraph ${i}. ` + 'Lorem ipsum dolor sit amet. '.repeat(12)).join('\n');

test('long press, story and flip on a collected card', async ({ page }) => {
  await page.route('**/api/locations', r => r.fulfill({ json: [LOC] }));
  await page.route('**/api/locations/charles-bridge', r =>
    r.fulfill({ json: { ...LOC, description: { en: STORY } } }));
  await page.goto('/explore');

  const cdp = await page.context().newCDPSession(page);
  const touch = (type, x, y) =>
    cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  const swipe = async (x0, y0, x1, y1) => {
    await touch('touchStart', x0, y0);
    for (let i = 1; i <= 10; i++) {
      await touch('touchMove', x0 + ((x1 - x0) * i) / 10, y0 + ((y1 - y0) * i) / 10);
      await page.waitForTimeout(16);
    }
    await touch('touchEnd', x1, y1);
  };

  const b = await page.locator('.loc-card').first().boundingBox();
  await touch('touchStart', b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForTimeout(700);
  await touch('touchEnd', b.x + b.width / 2, b.y + b.height / 2);
  // Lifting the finger must not close the showcase it just opened.
  const showcase = page.locator('.card-showcase');
  await expect(showcase).toBeVisible();
  await page.waitForTimeout(300);
  await expect(showcase).toBeVisible();
  await expect(page.locator('.px-modal')).toHaveCount(0);
  // A stray click from the opening press (iOS sends one after its own
  // long-press handling) must not close it either; only a new tap does.
  await page.mouse.click(10, 10);
  await expect(showcase).toBeVisible();
  // Nothing on the enlarged card is selectable.
  expect(await page.locator('.card-showcase .loc-card').evaluate(e => getComputedStyle(e).userSelect)).toBe('none');

  const { width: W, height: H } = page.viewportSize();
  await swipe(W / 2, H / 2 + 100, W / 2, H / 2 - 50);
  const story = showcase.locator('.loc-card__story');
  await expect(story).toContainText('Paragraph 11.');

  // A swipe up inside the story scrolls it rather than doing anything else.
  await page.waitForTimeout(300);
  await swipe(W / 2, H / 2 + 150, W / 2, H / 2 - 150);
  await expect.poll(() => story.evaluate(e => e.scrollTop)).toBeGreaterThan(50);
  await story.evaluate(e => { e.scrollTop = 0; });

  await swipe(W / 2, H / 2 - 100, W / 2, H / 2 + 50);
  await expect(showcase.locator('.loc-card__story')).toHaveCount(0);

  await swipe(W / 2 - 100, H / 2, W / 2 + 140, H / 2);
  await expect(page.locator('.card-showcase__flip')).toHaveAttribute('style', /rotateY\(180deg\)/, { timeout: 5000 });
  await expect(showcase).toBeVisible();

  // A fresh tap outside the card puts it away.
  await touch('touchStart', 10, 10);
  await touch('touchEnd', 10, 10);
  await expect(showcase).toHaveCount(0);
});
