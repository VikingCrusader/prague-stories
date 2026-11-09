import { test, expect } from '@playwright/test';

// The stacked layout; the side column has its own tests (exploreWide.spec.js).
test.use({ viewport: { width: 1100, height: 800 } });

const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 140, explorerLevel: 2 };
const LOC = {
  _id: '1', name: 'Karlín Palace', slug: 'palac-karlin', localizedNames: { cz: 'Palác Karlín', zh: '卡林宫' },
  labels: ['architecture'], coordinates: { lat: 50.0926, lng: 14.452 }, rarity: 'epic', xpReward: 50,
  coverImage: '', pixelArtKey: '', quarter: 'Karlín', district: 'Praha 8',
};

// Standing at Holešovice market, Prague 7.
test.use({ permissions: ['geolocation'], geolocation: { latitude: 50.1035, longitude: 14.4385 } });

async function open(page, { lang = 'en', signedIn = true } = {}) {
  await page.addInitScript(([l, s]) => { localStorage.setItem('lang', l); if (s) localStorage.setItem('token', 'fake-jwt-token'); }, [lang, signedIn]);
  if (signedIn) await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/locations', route => route.fulfill({ json: [LOC] }));
  await page.goto('/explore');
}

test.describe('Explore header: where you are', () => {
  test('a signed-in user sees their district and quarter instead of the intro', async ({ page }) => {
    await open(page);
    await expect(page.locator('.explore-here')).toHaveText('Prague 7, Holešovice');
  });

  test('in Czech and Chinese too', async ({ page }) => {
    await open(page, { lang: 'cz' });
    await expect(page.locator('.explore-here')).toHaveText('Praha 7, Holešovice');
    await page.getByRole('button', { name: '中文' }).click();
    await expect(page.locator('.explore-here')).toHaveText('布拉格7区，霍莱绍维采（Holešovice）');
  });

  test('a guest keeps the intro line', async ({ page }) => {
    await open(page, { signedIn: false });
    await expect(page.getByText('Walk to real places', { exact: false }).first()).toBeAttached();
    await expect(page.locator('.explore-here')).toHaveCount(0);
  });
});

test.describe('Explore header without a position', () => {
  test.use({ permissions: [] });
  test('keeps the intro line', async ({ page }) => {
    await open(page);
    await expect(page.getByText('Walk to real places', { exact: false }).first()).toBeAttached();
    await expect(page.locator('.explore-here')).toHaveCount(0);
  });
});

test.describe('a landmark in the area guide pop-up', () => {
  test.use({ viewport: { width: 2560, height: 1300 }, permissions: ['geolocation'], geolocation: { latitude: 50.075, longitude: 14.44 } });
  const CARD = { ...LOC, _id: '2', name: 'Peace Square', slug: 'namesti-miru', quarter: 'Vinohrady', district: 'Praha 2', labels: ['square'] };
  const openGuide = async (page, path) => {
    await page.route('**/api/locations/namesti-miru', route => route.fulfill({ json: { ...CARD, description: { en: 'A square with a church.', cz: 'x', zh: 'x' } } }));
    await page.addInitScript(() => { localStorage.setItem('lang', 'en'); localStorage.setItem('token', 'fake-jwt-token'); });
    await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
    await page.route('**/api/locations', route => route.fulfill({ json: [CARD] }));
    await page.goto(path);
    await page.locator('.explore-here__part').last().click();
    await page.locator('.area-guide-overlay .area-guide__landmark button').filter({ hasText: 'Peace Square' }).click();
    await expect(page.getByText('A square with a church.')).toBeVisible();
  };
  const closeCard = page => page.locator('.area-guide-detail .px-modal__close').click();

  test('on Explore it replaces the guide', async ({ page }) => {
    await openGuide(page, '/explore');
    await expect(page.locator('.area-guide__title')).toHaveCount(0);
    await closeCard(page);
    await expect(page.getByText('A square with a church.')).toHaveCount(0);
    await expect(page.locator('.area-guide__title')).toHaveCount(0);
  });

  test('elsewhere it opens on top of the guide', async ({ page }) => {
    await openGuide(page, '/map');
    await page.getByText('A square with a church.').click(); // reachable, so on top
    await closeCard(page);
    await expect(page.locator('.area-guide-overlay .area-guide__title')).toHaveText('Vinohrady');
  });
});
