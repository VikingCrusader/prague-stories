import { test, expect } from '@playwright/test';

// The gold frame of the current page glides to the next link instead of jumping.
test.beforeEach(({ page }) => {
  page.route('**/api/packs', route => route.fulfill({ json: [] }));
  page.route('**/api/locations', route => route.fulfill({ json: [] }));
});

test('switching pages glides the frame to the new link', async ({ page }) => {
  await page.goto('/explore');
  const frame = page.locator('.navbar__indicator');
  const map = page.locator('.navbar__links a[href="/map"]');
  await expect(page.locator('.navbar__links[data-ready]')).toHaveCount(1);
  const before = await frame.evaluate(el => el.getBoundingClientRect().left);
  await page.locator('.navbar__links a[href="/map"]').click();
  // Mid-glide: the frame is still moving between the two links.
  await expect.poll(() => frame.evaluate(el => el.getAnimations().length)).toBeGreaterThan(0);
  await expect(map).toHaveClass(/navbar__link--active/);
  await expect.poll(() => frame.evaluate(el => el.getAnimations().length)).toBe(0);
  const after = await frame.evaluate(el => el.getBoundingClientRect().left);
  const target = await map.evaluate(el => el.getBoundingClientRect().left);
  expect(Math.abs(after - target)).toBeLessThan(2);
  expect(after).toBeGreaterThan(before);
});
