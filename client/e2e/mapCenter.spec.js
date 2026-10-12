import { test, expect } from '@playwright/test';

const PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
);

async function setup(page, context, coords) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation(coords);
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
  await page.route('https://*.tile.openstreetmap.org/**', route =>
    route.fulfill({ status: 200, contentType: 'image/png', body: PIXEL_PNG })
  );
}

// Distance in px between the user's red dot and the centre of the map.
async function userDotOffset(page) {
  const dot = page.locator('.leaflet-container path[fill="#e63946"]');
  await expect(dot).toHaveCount(1);
  const d = await dot.boundingBox();
  const m = await page.locator('.leaflet-container').boundingBox();
  return Math.hypot(d.x + d.width / 2 - (m.x + m.width / 2), d.y + d.height / 2 - (m.y + m.height / 2));
}

test('map opens centred on the user when they are in Prague', async ({ page, context }) => {
  // Prague Castle, well away from the default centre.
  await setup(page, context, { latitude: 50.0909, longitude: 14.4005 });
  await page.goto('/map');
  await expect.poll(() => userDotOffset(page)).toBeLessThan(5);
});

test('map stays on Prague when the user is far outside it', async ({ page, context }) => {
  // Brno: outside the "City only" area, so the dot is off-screen and the map doesn't move.
  await setup(page, context, { latitude: 49.1951, longitude: 16.6068 });
  await page.goto('/map');
  await page.waitForSelector('.leaflet-container');
  await page.waitForTimeout(1500);
  const dot = page.locator('.leaflet-container path[fill="#e63946"]');
  if (await dot.count()) {
    expect(await userDotOffset(page)).toBeGreaterThan(200);
  }
});
