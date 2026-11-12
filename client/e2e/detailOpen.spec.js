import { test, expect } from '@playwright/test';

// The card detail opens filled in from the list (no spinner), with grey lines
// where the story will be, and grows out of its card (slides up on phones).
test.beforeEach(({ page }) => page.route('**/api/packs', route => route.fulfill({ json: [] })));

const CARD = {
  _id: '1',
  name: 'Charles Bridge',
  slug: 'charles-bridge',
  localizedNames: { cz: 'Karlův most', zh: '查理大桥' },
  labels: ['bridge', 'gothic'],
  coordinates: { lat: 50.0865, lng: 14.4114 },
  rarity: 'legend',
  xpReward: 100,
  coverImage: '',
  pixelArtKey: '',
  unlocked: true,
};

async function openSlowly(page) {
  let release;
  const held = new Promise(r => { release = r; });
  await page.route('**/api/locations', route => route.fulfill({ json: [CARD] }));
  await page.route('**/api/locations/charles-bridge', async route => {
    await held;
    route.fulfill({ json: { ...CARD, description: { en: 'A story about the bridge.\nSecond paragraph.' } } });
  });
  await page.goto('/explore');
  await page.locator('.loc-card').first().click();
  return release;
}

test('the detail shows the card at once and the story when it arrives', async ({ page }) => {
  const release = await openSlowly(page);
  const modal = page.locator('.px-modal--detail');
  await expect(modal.getByRole('heading', { name: 'Charles Bridge' })).toBeVisible();
  await expect(modal.locator('.detail-skeleton__line').first()).toBeVisible();
  await expect(modal.locator('.spinner')).toHaveCount(0);
  release();
  await expect(modal.getByText('A story about the bridge.')).toBeVisible();
  await expect(modal.locator('.detail-skeleton')).toHaveCount(0);
});

test('on a computer the window grows out of the card and shrinks back on close', async ({ page }) => {
  const release = await openSlowly(page);
  release();
  const modal = page.locator('.px-modal--detail');
  await expect(modal).toBeVisible();
  // Right after opening the window is still scaled down towards the card.
  const started = await modal.evaluate(el => el.getAnimations().length > 0);
  expect(started).toBe(true);
  await page.waitForTimeout(400);
  await page.locator('.px-modal__close').click();
  await expect(modal).toHaveCount(0);
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('the window slides up from the bottom', async ({ page }) => {
    const release = await openSlowly(page);
    release();
    const modal = page.locator('.px-modal--detail');
    await expect(modal).toBeVisible();
    const transform = await modal.evaluate(el => {
      const anim = el.getAnimations()[0];
      return anim ? anim.effect.getKeyframes()[0].transform : null;
    });
    expect(transform).toBe('translateY(100%)');
  });
});
