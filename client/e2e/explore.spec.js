import { test, expect } from '@playwright/test';

const LOCATIONS = [
  {
    _id: '1',
    name: 'Charles Bridge',
    slug: 'charles-bridge',
    localizedNames: { cz: 'Karlův most', zh: '查理大桥' },
    labels: ['bridge', 'historical', 'landmark'],
    coordinates: { lat: 50.0865, lng: 14.4114 },
    rarity: 'legend',
    xpReward: 100,
    coverImage: '',
    pixelArtKey: '',
    unlocked: true,
  },
  {
    _id: '2',
    name: 'Vyšehrad',
    slug: 'vysehrad',
    localizedNames: { cz: 'Vyšehrad', zh: '维谢赫拉德' },
    labels: ['historical', 'landmark'],
    coordinates: { lat: 50.0619, lng: 14.4208 },
    rarity: 'legend',
    xpReward: 100,
    coverImage: '',
    pixelArtKey: '',
    unlocked: false,
  },
];

// Mock the backend entirely so these scenarios run without a live API/DB.
async function mockLocations(page) {
  await page.route('**/api/locations', route =>
    route.fulfill({ json: LOCATIONS })
  );
}

test.describe('Guest explore flow', () => {
  test('guest lands on Explore and sees location cards, locked and unlocked', async ({ page }) => {
    await mockLocations(page);
    await page.goto('/explore');

    const cards = page.locator('.loc-card');
    await expect(cards).toHaveCount(2);
    await expect(page.getByText('Charles Bridge')).toBeVisible();
    // The locked card hides its real name behind '???'.
    await expect(page.getByText('Vyšehrad')).not.toBeVisible();
    await expect(cards.nth(1).locator('.loc-card__name')).toHaveText('???');
  });

  test('clicking an unlocked card opens its detail view', async ({ page }) => {
    await mockLocations(page);
    await page.route('**/api/locations/charles-bridge', route =>
      route.fulfill({
        json: {
          ...LOCATIONS[0],
          description: {
            en: 'A historic stone bridge crossing the Vltava river.',
            cz: 'Historický kamenný most přes Vltavu.',
            zh: '横跨伏尔塔瓦河的历史悠久的石桥。',
          },
        },
      })
    );
    await page.goto('/explore');

    await page.locator('.loc-card', { hasText: 'Charles Bridge' }).click();

    const modal = page.locator('.px-modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('A historic stone bridge crossing the Vltava river.')).toBeVisible();

    await page.locator('.px-modal__close').click();
    await expect(modal).not.toBeVisible();
  });
});

test.describe('Language switching', () => {
  test('switching language updates UI text and persists after reload', async ({ page }) => {
    await mockLocations(page);
    await page.goto('/explore');

    await expect(page.getByRole('heading', { name: 'Login to Explore Prague!' })).toBeVisible();

    await page.getByRole('button', { name: 'CZ' }).click();
    await expect(page.getByRole('heading', { name: 'Přihlaste se a prozkoumejte Prahu!' })).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Přihlaste se a prozkoumejte Prahu!' })).toBeVisible();
  });
});
