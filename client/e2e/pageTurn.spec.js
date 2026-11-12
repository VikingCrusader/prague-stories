import { test, expect } from '@playwright/test';

// Pages turn in when you move between them, and a page you have already
// opened shows its figures at once (no spinner on the way back).
test.beforeEach(({ page }) => page.route('**/api/packs', route => route.fulfill({ json: [] })));

test('moving to another page turns it in, and coming back to Explore shows no spinner', async ({ page }) => {
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
  await page.goto('/explore');
  await expect(page.locator('.page-turn')).toBeVisible();
  await page.evaluate(() => { window.history.pushState({}, '', '/map'); window.dispatchEvent(new PopStateEvent('popstate')); });
  await expect(page.locator('.page-turn--back, .page-turn--forward')).toHaveCount(1);
  await page.evaluate(() => { window.history.pushState({}, '', '/explore'); window.dispatchEvent(new PopStateEvent('popstate')); });
  await expect(page.locator('.spinner')).toHaveCount(0);
});
