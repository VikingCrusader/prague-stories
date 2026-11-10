import { test, expect } from '@playwright/test';

// Whatever backend happens to be running must not add its packs to the grid.
test.beforeEach(({ page }) => page.route('**/api/packs', route => route.fulfill({ json: [] })));

// The stacked layout; the side column has its own tests (exploreWide.spec.js).
test.use({ viewport: { width: 1100, height: 800 } });

const card = (i, name, extra) => ({
  _id: String(i), name, slug: name.toLowerCase().replace(/\W+/g, '-'),
  localizedNames: { cz: name, zh: name }, coverImage: '', pixelArtKey: '', unlocked: true,
  coordinates: { lat: 50.0865, lng: 14.4114 }, ...extra,
});

const LOCATIONS = [
  card(1, 'Charles Bridge', { labels: ['bridge'], rarity: 'legend', xpReward: 100 }),
  card(2, 'Petrin Tower', { labels: ['tower'], rarity: 'rare', xpReward: 20 }),
  card(3, 'Roztoky', { labels: ['castle', 'outside'], rarity: 'expedition', xpReward: 60 }),
  card(4, 'Melnik', { labels: ['castle', 'outside'], rarity: 'expedition', xpReward: 120 }),
  card(5, 'Kutna Hora', { labels: ['city', 'outside'], rarity: 'expedition', xpReward: 180 }),
  card(6, 'Karlstejn', { labels: ['castle', 'outside'], rarity: 'expedition', xpReward: 240 }),
  card(7, 'Cesky Krumlov', { labels: ['castle', 'outside'], rarity: 'expedition', xpReward: 300 }),
  card(8, 'Locked Far Place', { labels: ['castle', 'outside'], rarity: 'expedition', xpReward: 300, unlocked: false }),
];

// The City only / Show all switch sits in the area sheet (2026-11-10).
const toggleScope = async (page) => {
  await page.locator('.filter-bar .area-filter .filter-btn').click();
  await page.locator('.explore-drawer .scope-toggle__opt:not(.scope-toggle__opt--on)').click();
  await page.locator('.explore-drawer__view').click();
  await expect(page.locator('.explore-drawer')).toHaveCount(0);
};

test.beforeEach(async ({ page }) => {
  await page.route('**/api/locations', route => route.fulfill({ json: LOCATIONS }));
  await page.goto('/explore');
  await expect(page.locator('.loc-card')).toHaveCount(2); // City only by default
});

test('Expedition is only offered as a rarity filter with Show all', async ({ page }) => {
  await page.getByRole('button', { name: /^Rarity/ }).click();
  const panel = page.locator('.label-filter__panel');
  await expect(panel.getByRole('button', { name: /Expedition/ })).toHaveCount(0);
  await page.getByRole('button', { name: /^Rarity/ }).click();

  await toggleScope(page);
  await expect(page.locator('.loc-card')).toHaveCount(8);
  await page.getByRole('button', { name: /^Rarity/ }).click();
  await panel.getByRole('button', { name: /Expedition/ }).click();
  await expect(page.locator('.loc-card')).toHaveCount(6);
  // Its description replaces the day-trip intro line instead of joining it.
  await expect(page.locator('.explore-rarity-blurb')).toContainText('beyond the city limits');
  await expect(page.locator('.explore-area-blurb')).toHaveCount(0);

  // Back to City only: the expedition filter is dropped, not left emptying the grid.
  await page.getByRole('button', { name: /^Rarity/ }).click();
  await toggleScope(page);
  await expect(page.locator('.loc-card')).toHaveCount(2);
});

test('outside cards read "Expedition" and carry the stone for their XP', async ({ page }) => {
  await toggleScope(page);
  const gems = {};
  for (const name of ['Roztoky', 'Melnik', 'Kutna Hora', 'Karlstejn', 'Cesky Krumlov']) {
    const el = page.locator('.loc-card', { has: page.locator('.loc-card__name', { hasText: name }) });
    gems[name] = await el.getAttribute('data-gem');
    await expect(el.locator('.loc-card__xp')).toHaveText('Expedition');
    await expect(el.locator('.loc-card__gem--top')).toBeVisible();
  }
  expect(gems).toEqual({ Roztoky: 'bronze', Melnik: 'ruby', 'Kutna Hora': 'diamond', Karlstejn: 'diamond', 'Cesky Krumlov': 'diamond' });
  // A locked card shows no frame or stone, like every other tier.
  await expect(page.locator('.loc-card--locked .loc-card__gem--top')).toBeHidden();
});
