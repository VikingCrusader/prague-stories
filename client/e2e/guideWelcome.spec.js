import { test, expect } from '@playwright/test';

// A guest's Explore: the welcome board (GuideWelcome) comes before the location
// consent dialog, shrinks into the Open the Guide button, shows once per guest
// session and again after each "Continue without login". The config switches it
// off; this spec starts clean.

test.use({ storageState: { cookies: [], origins: [] } });

async function setUp(page) {
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
  await page.route('**/api/packs', route => route.fulfill({ json: [] }));
}

test('welcome first, then consent; once per guest session', async ({ page }) => {
  await setUp(page);
  await page.goto('/explore');
  const welcome = page.locator('.guide-welcome');
  await expect(welcome).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('.location-consent')).toHaveCount(0);
  await expect(welcome.locator('.guide-tile')).toHaveCount(5);

  await welcome.locator('.guide-welcome__later').click();
  await expect(welcome).toHaveCount(0);
  await expect(page.locator('.location-consent')).toBeVisible();
  await page.locator('.location-consent').getByRole('button').nth(1).click();
  await expect(page.locator('.location-consent')).toHaveCount(0); // saved once it has shrunk
  await expect(page.locator('[data-guide-anchor]')).toBeVisible();

  // Coming back within the session: no welcome.
  await page.reload();
  await expect(page.locator('[data-guide-anchor]')).toBeVisible();
  await page.waitForTimeout(2000);
  await expect(page.locator('.guide-welcome')).toHaveCount(0);

  // "Continue without login" starts a new guest visit: it shows again.
  await page.goto('/login');
  await page.getByRole('button', { name: 'Continue without login' }).click();
  await expect(page).toHaveURL(/\/explore/);
  await expect(page.locator('.guide-welcome')).toBeVisible({ timeout: 10_000 });
});

test('a tile opens its section over the board, and closing it comes back to the board', async ({ page }) => {
  await setUp(page);
  await page.goto('/explore');
  const welcome = page.locator('.guide-welcome');
  await expect(welcome).toBeVisible({ timeout: 10_000 });
  await welcome.locator('.guide-tile--hunt').click();
  const section = page.locator('.guide-window');
  await expect(section).toBeVisible();
  await expect(section.locator('.guide-window__demo')).toBeVisible();
  await expect(page).toHaveURL(/\/explore$/);

  // Escape closes only the section; the board stays for the next tile.
  await page.keyboard.press('Escape');
  await expect(section).toHaveCount(0);
  await expect(welcome).toBeVisible();
  await welcome.locator('.guide-tile--packs').click();
  await expect(section).toBeVisible();
  await section.locator('.px-modal__close').click();
  await expect(section).toHaveCount(0);
  await expect(welcome).toBeVisible();

  // Open the Guide still leads to the whole Guide.
  await welcome.locator('.guide-welcome__open').click();
  await expect(page).toHaveURL(/\/guide$/);
});
