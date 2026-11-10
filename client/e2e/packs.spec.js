import { test, expect } from '@playwright/test';

const USER = { _id: 'u1', username: 'tester', email: 't@t.cz', totalXP: 500, explorerLevel: 3, achievements: [], levelInfo: { level: 3, title: 'T', progress: 10, nextLevelXP: 900 }, preferences: {} };
const LOC = { _id: '1', name: 'Golden Lane', slug: 'golden-lane', labels: ['museum'], rarity: 'epic', xpReward: 50, coordinates: { lat: 50.092, lng: 14.404 }, quarter: 'Hradčany', district: 'Praha 1', localizedNames: { cz: 'Zlatá ulička', zh: '黄金巷' }, unlocked: true };
const base = { foil: '#7a1f2b', districts: ['Praha 1'], quarters: ['Hradčany'], unlockAt: 3, unlockXp: 20 };
const SEALED = { ...base, slug: 'prague-castle', name: 'Prague Castle', localizedNames: { cz: 'Pražský hrad', zh: '布拉格城堡' }, total: 29, collected: 1, unlocked: false, completed: false, completeXp: 435 };
const OPEN = { ...base, foil: '#155e63', slug: 'vysehrad', name: 'Vyšehrad', localizedNames: { cz: 'Vyšehrad', zh: '维谢赫拉德' }, districts: ['Praha 2'], quarters: ['Vyšehrad'], total: 18, collected: 7, unlocked: true, completed: false, completeXp: 270 };
const DONE = { ...OPEN, slug: 'vysehrad2', collected: 18, completed: true };
const DETAIL = { ...SEALED, description: { en: 'Only the preview.', cz: 'x', zh: '只有预览。' }, storyLocked: true, members: [LOC, { ...LOC, _id: '2', slug: 'dalibor-tower', name: 'Dalibor Tower', unlocked: false }] };

async function setup(page, extra = {}) {
  await page.addInitScript(() => { localStorage.setItem('lang', 'en'); localStorage.setItem('token', 'fake-jwt-token'); });
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER, newPacks: extra.newPacks ?? [] } }));
  await page.route('**/api/locations', route => route.fulfill({ json: [LOC] }));
  await page.route('**/api/locations/golden-lane', route => route.fulfill({ json: { ...LOC, description: { en: 'A lane.', cz: 'x', zh: 'x' }, packs: [{ slug: 'prague-castle', name: 'Prague Castle', localizedNames: SEALED.localizedNames, foil: SEALED.foil }] } }));
  await page.route('**/api/packs', route => route.fulfill({ json: [SEALED, OPEN, DONE] }));
  await page.route('**/api/packs/prague-castle', route => route.fulfill({ json: DETAIL }));
}

test.describe('card packs', () => {
  test.use({ viewport: { width: 2560, height: 1300 } });

  test('the filter swaps the cards for packs and closes the filters that do not apply', async ({ page }) => {
    await setup(page);
    await page.goto('/explore');
    const main = page.locator('.explore-main');
    await expect(main.locator('.loc-card[data-slug="golden-lane"]')).toBeVisible();
    await page.locator('.filter-btn', { hasText: 'Packs' }).click();
    await expect(main.locator('.pack-card')).toHaveCount(3);
    await expect(main.locator('.loc-card[data-slug]')).toHaveCount(0);
    await expect(page.locator('.pack-card--sealed .pack-card__lock')).toBeVisible();
    await expect(page.locator('.pack-card--complete')).toHaveCount(1);
    await expect(page.locator('.explore-stats')).toHaveText('3 card packs, 1 fully collected');
    await expect(page.locator('.filter-btn', { hasText: 'Rarity' })).toBeDisabled();
    await page.locator('.filter-bar__search').fill('castle');
    await expect(main.locator('.pack-card')).toHaveCount(1);
  });

  test('a pack opens with its preview and its cards, the missing ones locked', async ({ page }) => {
    await setup(page);
    await page.goto('/explore');
    await page.locator('.filter-btn', { hasText: 'Packs' }).click();
    await page.locator('.explore-main .pack-card[data-pack="prague-castle"]').click();
    const detail = page.locator('.pack-detail');
    await expect(detail.getByText('Only the preview.')).toBeVisible();
    await expect(detail.getByText('Collect 2 more of its cards')).toBeVisible();
    await expect(detail.locator('.pack-detail__cards .loc-card')).toHaveCount(2);
    await expect(detail.locator('.pack-detail__cards .loc-card__lock')).toHaveCount(1);
    // Every card in it names the pack at the bottom, and that button leads back.
    await detail.locator('.pack-detail__cards .loc-card').first().click();
    const row = page.locator('.px-modal--detail .detail-packs__pack');
    // Between the area pills and the story.
    const order = await page.locator('.px-modal--detail').evaluate(el => {
      const [pills, packs, story] = ['.area-guide-pill', '.detail-packs', '.detail-desc'].map(s => el.querySelector(s).getBoundingClientRect().top);
      return pills < packs && packs < story;
    });
    expect(order).toBe(true);
    await row.click();
    await expect(row).toHaveCount(0);
    await expect(page.locator('.pack-detail')).toHaveCount(1);
    await page.keyboard.press('Escape');
    await expect(detail).toHaveCount(0);
  });

  test('a pack shows every area its cards are in, and each opens its guide', async ({ page }) => {
    await setup(page);
    const at = (slug, quarter, district) => ({ ...LOC, _id: slug, slug, quarter, district });
    await page.route('**/api/packs/prague-castle', route => route.fulfill({ json: { ...DETAIL, members: [
      at('a', 'Smíchov', 'Praha 5'), at('b', 'Malá Strana', 'Praha 1'), at('c', 'Malá Strana', 'Praha 1'), at('d', 'Hradčany', 'Praha 1'),
    ] } }));
    await page.goto('/explore');
    await page.locator('.filter-btn', { hasText: 'Packs' }).click();
    await page.locator('.explore-main .pack-card[data-pack="prague-castle"]').click();
    const pills = page.locator('.pack-detail__areas button.area-guide-pill');
    await expect(pills).toHaveText(['Lesser Town', 'Smíchov', 'Hradčany', 'Prague 1', 'Prague 5']);
    await pills.filter({ hasText: 'Smíchov' }).click();
    const guide = page.locator('.area-guide');
    await expect(guide).toBeVisible();
    // On top of the pack, and Escape closes only the guide.
    const topmost = await guide.evaluate(el => {
      const r = el.getBoundingClientRect();
      return el.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2));
    });
    expect(topmost).toBe(true);
    await page.keyboard.press('Escape');
    await expect(guide).toHaveCount(0);
    await expect(page.locator('.pack-detail')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.pack-detail')).toHaveCount(0);
  });

  test('a pack shows its labels; a note closes alone and its link leaves the pack', async ({ page }) => {
    await setup(page);
    await page.route('**/api/packs/prague-castle', route => route.fulfill({ json: { ...DETAIL, labels: ['gothic', 'medieval'] } }));
    await page.goto('/explore');
    await page.locator('.filter-btn', { hasText: 'Packs' }).click();
    await page.locator('.explore-main .pack-card[data-pack="prague-castle"]').click();
    const pills = page.locator('.pack-detail__labels button');
    await expect(pills).toHaveCount(2);
    await pills.first().click();
    await expect(page.locator('.tag-info')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.tag-info')).toHaveCount(0);
    await expect(page.locator('.pack-detail')).toBeVisible();
    await pills.first().click();
    await page.locator('.tag-info__go').click();
    await expect(page.locator('.pack-detail')).toHaveCount(0);
  });

  test('a card names its pack, which opens over it', async ({ page }) => {
    await setup(page);
    await page.goto('/explore');
    await page.locator('.explore-main .loc-card[data-slug="golden-lane"]').click();
    await page.locator('.detail-packs__pack').click();
    await expect(page.locator('.pack-detail')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.pack-detail')).toHaveCount(0);
    await expect(page.locator('.detail-packs__pack')).toBeVisible();
  });

  test('an unlocked pack can be picked up and turned over; a sealed one cannot', async ({ page }) => {
    await setup(page);
    await page.goto('/explore');
    await page.locator('.filter-btn', { hasText: 'Packs' }).click();
    await page.locator('.explore-main .pack-card[data-pack="prague-castle"]').dblclick();
    await page.waitForTimeout(400);
    await expect(page.locator('.card-showcase')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await page.locator('.explore-main .pack-card[data-pack="vysehrad"]').dblclick();
    const showcase = page.locator('.card-showcase');
    await expect(showcase.locator('.card-showcase__face .pack-card').first()).toBeVisible();
    await expect(page.locator('.pack-detail')).toHaveCount(0);
    const flip = showcase.locator('.card-showcase__flip');
    const box = await flip.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 340, box.y + box.height / 2, { steps: 12 });
    await page.mouse.up();
    await expect.poll(() => flip.evaluate(el => el.style.transform)).toMatch(/rotateY\((-?180|180)(\.\d+)?deg\)/);
    await expect(showcase.locator('.pack-back__mark')).toHaveText('Prague Stories');
    await page.keyboard.press('Escape');
    await expect(showcase).toHaveCount(0);
  });

  test('a pack earned shows the opening moment once', async ({ page }) => {
    await setup(page, { newPacks: [{ slug: 'prague-castle', name: 'Prague Castle', localizedNames: SEALED.localizedNames, foil: SEALED.foil, stage: 'unlock', xp: 20, collected: 3, total: 29, cards: ['golden-lane', 'dalibor-tower', 'st-vitus-cathedral'] }] });
    await page.goto('/explore');
    const moment = page.locator('.pack-open');
    await expect(moment).toBeVisible();
    await expect(moment).toContainText('+20 XP');
    await moment.locator('.pack-open__go').click();
    await expect(page.locator('.pack-detail')).toBeVisible();
    await expect(moment).toHaveCount(0);
  });
});

test('on the History page a related landmark can be a pack, with the player\'s progress', async ({ page }) => {
  const T = (s) => ({ en: s, cz: s, zh: s });
  const event = { slug: 'first', era: 'one', startYear: 1, cardType: 'event', tone: 'serious', year: T('1'), title: T('Title'), hookLine: T('Hook'), summary: T('Summary.'), images: [],
    relatedLandmarks: [{ landmark: { isPack: true, slug: 'prague-castle', name: 'Prague Castle', localizedNames: SEALED.localizedNames, foil: SEALED.foil }, relation: T('Where it happened') }] };
  await setup(page);
  await page.route('**/api/history*', route => route.fulfill({ json: { eras: [{ key: 'one', order: 1, themeClass: 'era-1', title: T('Era'), yearRange: T('1'), tagline: T('Tag'), hasContent: true }], events: [event] } }));
  await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: [] } }));
  await page.route('**/api/user/history-progress*', route => route.fulfill({ json: { slug: null, updatedAt: null } }));
  await page.goto('/history');
  const pack = page.locator('.history-landmark-item .pack-card');
  await expect(pack).toContainText('1/29');
  await pack.click();
  await expect(page.locator('.pack-detail').getByText('Only the preview.')).toBeVisible();
});

test.describe('packs among the cards on Explore', () => {
  test.use({ viewport: { width: 2560, height: 1300 }, permissions: ['geolocation'], geolocation: { latitude: 50.092, longitude: 14.404 } });
  const card = (slug, lat, labels) => ({ ...LOC, _id: slug, slug, name: slug, coordinates: { lat, lng: 14.404 }, labels });
  const order = page => page.locator('.explore-main .loc-card[data-slug], .explore-main .loc-card[data-pack]')
    .evaluateAll(els => els.map(e => e.dataset.pack || e.dataset.slug));

  async function setupMixed(page) {
    await setup(page);
    // 0 m away; about 89 m away, in the near pack; about 3 km away, in the far pack.
    await page.route('**/api/locations', route => route.fulfill({ json: [card('far-card', 50.12, ['park']), card('in-pack', 50.0928, ['park']), card('here', 50.092, ['gothic'])] }));
    await page.route('**/api/packs', route => route.fulfill({ json: [
      { ...OPEN, slug: 'far-pack', memberSlugs: ['far-card'], labels: ['park'] },
      { ...SEALED, slug: 'near-pack', memberSlugs: ['in-pack'], labels: ['gothic'] },
    ] }));
    await page.goto('/explore');
  }

  test('a pack within 100 m of one of its cards goes first, the others stand at their nearest card', async ({ page }) => {
    await setupMixed(page);
    await expect.poll(() => order(page)).toEqual(['near-pack', 'here', 'in-pack', 'far-pack', 'far-card']);
  });

  test('labels filter packs too, with or without the Packs button; a rarity leaves only cards', async ({ page }) => {
    await setupMixed(page);
    await expect.poll(() => order(page)).toHaveLength(5);
    await page.locator('.filter-btn', { hasText: 'Labels' }).click();
    await page.locator('.label-filter__panel .label-pill', { hasText: 'Gothic' }).click();
    await page.mouse.click(1500, 5);
    await expect.poll(() => order(page)).toEqual(['near-pack', 'here']);
    await page.locator('.filter-btn', { hasText: 'Packs' }).click();
    await expect.poll(() => order(page)).toEqual(['near-pack']);
    await expect(page.locator('.filter-btn', { hasText: 'Labels' })).toBeEnabled();
    await expect(page.locator('.filter-btn', { hasText: 'Rarity' })).toBeDisabled();
    await page.locator('.filter-btn', { hasText: 'Packs' }).click();
    await page.locator('.filter-btn', { hasText: 'Rarity' }).click();
    await page.locator('.label-filter__panel .label-pill', { hasText: 'Epic' }).click();
    await expect.poll(() => order(page)).toEqual(['here']);
  });
});
