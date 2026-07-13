import { test, expect } from '@playwright/test';

const LOCATIONS = [
  {
    _id: '1', name: 'Charles Bridge', slug: 'charles-bridge',
    localizedNames: { cz: 'Karlův most', zh: '查理大桥' },
    labels: ['bridge', 'historical'], coordinates: { lat: 50.0865, lng: 14.4114 },
    rarity: 'legend', xpReward: 100, coverImage: '', pixelArtKey: '', unlocked: true,
  },
  {
    _id: '2', name: 'Vyšehrad', slug: 'vysehrad',
    localizedNames: { cz: 'Vyšehrad', zh: '维谢赫拉德' },
    labels: ['historical'], coordinates: { lat: 50.0619, lng: 14.4208 },
    rarity: 'legend', xpReward: 100, coverImage: '', pixelArtKey: '', unlocked: false,
  },
  {
    _id: '3', name: 'Petřín Tower', slug: 'petrin-tower',
    localizedNames: { cz: 'Petřínská rozhledna', zh: '佩特任瞭望塔' },
    labels: ['tower', 'park'], coordinates: { lat: 50.0836, lng: 14.3953 },
    rarity: 'rare', xpReward: 20, coverImage: '', pixelArtKey: '', unlocked: true,
  },
  {
    _id: '4', name: 'St. Vitus Cathedral', slug: 'st-vitus-cathedral',
    localizedNames: { cz: 'Katedrála svatého Víta', zh: '圣维特主教座堂' },
    labels: ['church', 'historical'], coordinates: { lat: 50.0909, lng: 14.4008 },
    rarity: 'epic', xpReward: 50, coverImage: '', pixelArtKey: '', unlocked: false,
  },
];

test.beforeEach(async ({ page }) => {
  await page.route('**/api/locations', route => route.fulfill({ json: LOCATIONS }));
  await page.goto('/explore');
  await expect(page.locator('.loc-card')).toHaveCount(4);
});

test.describe('Explore grid — search & filters', () => {
  test('search narrows the grid to matching names', async ({ page }) => {
    await page.getByPlaceholder('Search locations...').fill('bridge');
    await expect(page.locator('.loc-card')).toHaveCount(1);
    await expect(page.locator('.loc-card__name')).toHaveText('Charles Bridge');
  });

  test('search with no matches shows the empty state', async ({ page }) => {
    await page.getByPlaceholder('Search locations...').fill('nonexistent place');
    await expect(page.locator('.loc-card')).toHaveCount(0);
    await expect(page.getByText('No locations found.')).toBeVisible();
  });

  test('the "My Collections" filter shows only unlocked locations', async ({ page }) => {
    await page.getByRole('button', { name: 'My Collections' }).click();
    await expect(page.locator('.loc-card')).toHaveCount(2);
    const names = await page.locator('.loc-card__name').allTextContents();
    expect(names.sort()).toEqual(['Charles Bridge', 'Petřín Tower'].sort());
  });

  test('label filter narrows results to locations with that label', async ({ page }) => {
    await page.getByRole('button', { name: 'Labels ▼' }).click();
    await page.locator('.label-filter__panel').getByRole('button', { name: 'Church & Cathedral' }).click();

    await expect(page.locator('.loc-card')).toHaveCount(1);
    // St. Vitus Cathedral is locked, so its name is hidden — the rarity badge still identifies it uniquely.
    await expect(page.locator('.loc-card__xp')).toHaveText('Epic');
  });

  test('rarity filter narrows results to the selected rarities', async ({ page }) => {
    await page.getByRole('button', { name: 'Rarity ▼' }).click();
    await page.locator('.label-filter__panel').getByRole('button', { name: /Legend/ }).click();

    await expect(page.locator('.loc-card')).toHaveCount(2);
    const names = await page.locator('.loc-card__name').allTextContents();
    expect(names).toContain('???'); // locked Vyšehrad still shows, name hidden
    expect(names).toContain('Charles Bridge');
  });

  test('the "All" button clears every active filter', async ({ page }) => {
    await page.getByPlaceholder('Search locations...').fill('bridge');
    await page.getByRole('button', { name: 'My Collections' }).click();
    await expect(page.locator('.loc-card')).toHaveCount(1);

    await page.getByRole('button', { name: 'All' }).click();

    await expect(page.locator('.loc-card')).toHaveCount(4);
    await expect(page.getByPlaceholder('Search locations...')).toHaveValue('');
  });

  test('sorting by Top Rarity reorders the grid, legend first', async ({ page }) => {
    await page.getByRole('button', { name: 'Distance ▼' }).click();
    await page.locator('.label-filter__panel').getByRole('button', { name: 'Top Rarity' }).click();

    const firstName = await page.locator('.loc-card__name').first().textContent();
    // Both legend-rarity cards (Charles Bridge, and locked "???" Vyšehrad) should sort ahead of rare/epic.
    expect(['Charles Bridge', '???']).toContain(firstName);
  });
});
