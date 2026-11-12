import { test, expect } from '@playwright/test';

// A pack's window shows placeholder lines while its text is on its way, not a
// spinner, and a pack opened before shows its text at once.
const USER = { _id: 'u1', username: 'tester', email: 't@t.cz', totalXP: 500, explorerLevel: 3, achievements: [], levelInfo: { level: 3, title: 'T', progress: 10, nextLevelXP: 900 }, preferences: {} };
const PACK = { slug: 'prague-castle', name: 'Prague Castle', localizedNames: { cz: 'Pražský hrad', zh: '布拉格城堡' }, foil: '#7a1f2b', districts: ['Praha 1'], quarters: ['Hradčany'], unlockAt: 3, unlockXp: 20, total: 1, collected: 0, unlocked: false, completed: false, completeXp: 435 };
const DETAIL = { ...PACK, description: { en: 'Only the preview.', cz: 'x', zh: '只有预览。' }, storyLocked: true, members: [] };

test.use({ viewport: { width: 2560, height: 1300 } });

test('opening a pack shows placeholder lines, then its text', async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('lang', 'en'); localStorage.setItem('token', 'fake-jwt-token'); });
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER, newPacks: [] } }));
  await page.route('**/api/locations', route => route.fulfill({ json: [] }));
  await page.route('**/api/packs', route => route.fulfill({ json: [PACK] }));
  let release;
  const held = new Promise(r => { release = r; });
  await page.route('**/api/packs/prague-castle', async route => { await held; route.fulfill({ json: DETAIL }); });
  await page.goto('/explore');
  await page.locator('.filter-btn', { hasText: 'Packs' }).click();
  await page.locator('.explore-main .pack-card[data-pack="prague-castle"]').click();
  await expect(page.locator('.pack-detail .detail-skeleton__line').first()).toBeVisible();
  await expect(page.locator('.pack-detail .spinner')).toHaveCount(0);
  release();
  await expect(page.locator('.pack-detail').getByText('Only the preview.')).toBeVisible();
});
