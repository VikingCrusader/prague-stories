import { test, expect } from '@playwright/test';

const LOCATION = {
  _id: '1',
  name: 'Charles Bridge',
  slug: 'charles-bridge',
  localizedNames: { cz: 'Karlův most', zh: '查理大桥' },
  labels: ['bridge', 'historical'],
  coordinates: { lat: 50.0865, lng: 14.4114 },
  rarity: 'legend',
  xpReward: 100,
  coverImage: '',
  pixelArtKey: '',
  unlocked: true,
};

const EXPECTED_HREF = 'https://www.google.com/maps/dir/?api=1&destination=50.0865,14.4114';

// A tiny valid 1x1 PNG so <img> elements resolve instead of erroring out.
const PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
);

async function mockLocations(page, overrides = {}) {
  const loc = { ...LOCATION, ...overrides };
  await page.route('**/api/locations', route => route.fulfill({ json: [loc] }));
  await page.route('**/api/locations/charles-bridge', route =>
    route.fulfill({
      json: { ...loc, description: { en: 'A historic stone bridge.', cz: '', zh: '' } },
    })
  );
}

// Stub the Google Maps navigation target so clicking the link doesn't hit the
// real internet — we only care that the browser is sent to the right URL.
// Registered on the context (not just `page`) so it also applies to the
// popup window the target="_blank" link opens.
async function stubGoogleMaps(page) {
  await page.context().route('https://www.google.com/**', route =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<html></html>' })
  );
}

async function mockMapTiles(page) {
  await page.route('https://*.tile.openstreetmap.org/**', route =>
    route.fulfill({ status: 200, contentType: 'image/png', body: PIXEL_PNG })
  );
}

test.describe('Click image to navigate on Google Maps — Location Detail View', () => {
  test('clicking the cover image opens Google Maps directions to the location', async ({ page }) => {
    await mockLocations(page);
    await stubGoogleMaps(page);
    await page.goto('/explore');
    await page.locator('.loc-card', { hasText: 'Charles Bridge' }).click();

    const modal = page.locator('.px-modal');
    await expect(modal).toBeVisible();

    // Exactly one non-text-button link should wrap the image itself.
    const imageLink = modal.locator('a:not(.detail-wiki)');
    await expect(imageLink).toHaveCount(1);
    await expect(imageLink).toHaveAttribute('href', EXPECTED_HREF);
    await expect(imageLink).toHaveAttribute('target', '_blank');
    await expect(imageLink).toHaveAttribute('rel', 'noopener noreferrer');

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      imageLink.click(),
    ]);
    await expect(popup).toHaveURL(EXPECTED_HREF);
    await popup.close();
  });

  test('clicking the fallback art (no image available) also navigates on Google Maps', async ({ page }) => {
    await mockLocations(page);
    await stubGoogleMaps(page);
    // Force the pixel-art image to fail so the emoji-art fallback header renders.
    await page.route('**/pixel-art/*.webp', route => route.abort());

    await page.goto('/explore');
    await page.locator('.loc-card', { hasText: 'Charles Bridge' }).click();

    const modal = page.locator('.px-modal');
    await expect(modal).toBeVisible();

    const imageLink = modal.locator('a:not(.detail-wiki)');
    await expect(imageLink).toHaveCount(1);
    await expect(imageLink).toHaveAttribute('href', EXPECTED_HREF);

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      imageLink.click(),
    ]);
    await expect(popup).toHaveURL(EXPECTED_HREF);
    await popup.close();
  });
});

test.describe('Click image to navigate on Google Maps — Map Sidebar', () => {
  test('clicking the sidebar image opens Google Maps directions to the location', async ({ page }) => {
    await mockLocations(page);
    await stubGoogleMaps(page);
    await mockMapTiles(page);

    await page.goto('/map');
    await expect(page.locator('path.leaflet-interactive')).toHaveCount(1);
    await page.locator('path.leaflet-interactive').first().click();

    const sidebar = page.locator('.map-sidebar');
    const imageLink = sidebar.locator('a:not(.detail-wiki)');
    await expect(imageLink).toHaveCount(1);
    await expect(imageLink).toHaveAttribute('href', EXPECTED_HREF);
    await expect(imageLink).toHaveAttribute('target', '_blank');
    await expect(imageLink).toHaveAttribute('rel', 'noopener noreferrer');

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      imageLink.click(),
    ]);
    await expect(popup).toHaveURL(EXPECTED_HREF);
    await popup.close();
  });
});
