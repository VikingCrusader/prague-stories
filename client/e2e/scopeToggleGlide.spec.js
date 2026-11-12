import { test, expect } from '@playwright/test';

// The city / all switch's lit frame glides over to the other half.
test.beforeEach(({ page }) => {
  page.route('**/api/packs', route => route.fulfill({ json: [] }));
  page.route('**/api/locations', route => route.fulfill({ json: [
    { _id: '1', name: 'Charles Bridge', slug: 'charles-bridge', labels: ['bridge'], coordinates: { lat: 50.08, lng: 14.41 }, rarity: 'legend', xpReward: 100, coverImage: '', pixelArtKey: '', unlocked: false },
  ] }));
});

test('the frame glides to the other half of the scope switch', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto('/explore');
  const toggle = page.locator('.scope-toggle:visible').first();
  const thumb = toggle.locator('.scope-toggle__thumb');
  const opts = toggle.locator('.scope-toggle__opt');
  await expect(toggle).toHaveAttribute('data-ready', '');
  // The frame lies above the halves: they have their own opaque background,
  // which hid it completely when it lay beneath them.
  const [thumbZ, optZ] = await Promise.all([
    thumb.evaluate(el => Number(getComputedStyle(el).zIndex)),
    opts.first().evaluate(el => Number(getComputedStyle(el).zIndex)),
  ]);
  expect(thumbZ).toBeGreaterThan(optZ);
  await expect(thumb).toHaveCSS('opacity', '1');
  const on = await opts.evaluateAll(els => els.findIndex(e => e.classList.contains('scope-toggle__opt--on')));
  const next = opts.nth(on === 0 ? 1 : 0);
  await next.click();
  await expect(next).toHaveClass(/scope-toggle__opt--on/);
  await expect.poll(() => thumb.evaluate(el => el.getAnimations().length)).toBeGreaterThan(0);
  await expect.poll(() => thumb.evaluate(el => el.getAnimations().length)).toBe(0);
  const frame = await thumb.evaluate(el => el.getBoundingClientRect().left);
  const target = await next.evaluate(el => el.getBoundingClientRect().left);
  expect(Math.abs(frame - target)).toBeLessThan(2);
});
