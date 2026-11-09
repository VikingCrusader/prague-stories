import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 412, height: 860 } });

async function setup(page, context, coords) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation(coords);
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
}

// Distance in px between the user's red dot and the centre of the map.
async function userDotOffset(page) {
  const dot = page.locator('.leaflet-container path[fill="#e63946"]');
  await expect(dot).toHaveCount(1);
  const d = await dot.boundingBox();
  const m = await page.locator('.leaflet-container').boundingBox();
  return Math.hypot(d.x + d.width / 2 - (m.x + m.width / 2), d.y + d.height / 2 - (m.y + m.height / 2));
}

test('the map opens on the whole city and goes to the user only when asked', async ({ page, context }) => {
  // Prague Castle, well away from the city's centre on the map.
  await setup(page, context, { latitude: 50.0909, longitude: 14.4005 });
  await page.goto('/map');
  const locate = page.locator('.map-view-buttons .filter-btn').first();
  await expect(locate).toHaveText('Go to My Location');
  await page.waitForTimeout(800);
  expect(await userDotOffset(page)).toBeGreaterThan(5);
  await locate.click();
  await expect.poll(() => userDotOffset(page)).toBeLessThan(5);
});

test('with the user far outside Prague there is nothing to go to', async ({ page, context }) => {
  await setup(page, context, { latitude: 49.1951, longitude: 16.6068 });
  await page.goto('/map');
  await expect(page.locator('.map-view-buttons .filter-btn')).toHaveText(['View Whole City']);
});
