import { test, expect } from '@playwright/test';

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
