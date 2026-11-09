import { test, expect } from '@playwright/test';

const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 140, explorerLevel: 2 };

const PROGRESS = {
  totalCheckins: 5,
  presetCheckins: 4,
  totalPreset: 10,
  unlockPercent: 40,
  cityCheckins: 3,
  totalCity: 8,
  cityUnlockPercent: 38,
  labelCount: { historical: 2, church: 1 },
  rarityCount: { common: 1, rare: 2, superior: 1, epic: 0, mythic: 0, legend: 1 },
  levelInfo: { level: 2, title: 'Apprentice Explorer', progress: 40, nextLevelXP: 200 },
  totalXP: 140,
  rank: 12,
  week: { cards: 5, xp: 380, rankChange: { delta: 3 } },
  recentFinds: {
    treasure: { count: 0, cards: [] },
    expedition: {
      count: 8,
      cards: ['Karlstejn', 'Melnik', 'Roztoky', 'Kutna Hora', 'Cesky Krumlov', 'Krivoklat'].map(name => ({
        slug: name.toLowerCase().replace(/\W+/g, '-'), name, localizedNames: { cz: name, zh: name },
        labels: ['castle', 'outside'], rarity: 'expedition', coverImage: '', pixelArtKey: '',
      })),
    },
  },
  districtProgress: Array.from({ length: 22 }, (_, i) => ({ district: `Praha ${i + 1}`, total: 40 + i, collected: (i * 7) % 30 })),
};

const ACHIEVEMENTS = {
  achievements: [
    {
      id: 'first_checkin', name: 'First Steps', name_cz: 'První kroky', name_zh: '第一步',
      description: 'Check in to your first location.', description_cz: '', description_zh: '',
      flavor: 'Every collection starts somewhere.', icon: '🥾', unlocked: true, unlockedAt: '2026-01-01T00:00:00.000Z',
      unlockRate: 12.5, difficulty: 'easy', progress: { current: 1, target: 1 },
    },
    {
      id: 'ten_checkins', name: 'Getting Serious', name_cz: '', name_zh: '',
      description: 'Check in to ten locations.', description_cz: '', description_zh: '',
      flavor: 'Ten is a start.', icon: '🎯', unlocked: false, unlockedAt: null,
      unlockRate: 40, difficulty: 'easy', progress: { current: 5, target: 10 },
    },
  ],
  levels: [
    { level: 1, title: 'Newcomer', xpRequired: 0 },
    { level: 2, title: 'Apprentice Explorer', xpRequired: 100 },
  ],
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/user/progress', route => route.fulfill({ json: PROGRESS }));
  await page.route('**/api/user/achievements', route => route.fulfill({ json: ACHIEVEMENTS }));
  await page.route('**/api/user/treasures', route => route.fulfill({ json: [] }));
  await page.goto('/dashboard');
});

test.describe('Dashboard', () => {
  test('shows level, XP, and stat cards for a logged-in explorer', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Explorer Profile' })).toBeVisible();
    await expect(page.locator('.level-badge__num')).toHaveText('LVL 2');
    await expect(page.locator('.level-badge__title')).toHaveText('Apprentice Explorer');
    await expect(page.getByText('140 / 200')).toBeVisible();
    // The ring is the city share; the number is every card, with both totals.
    await expect(page.locator('.stat-card--ring svg')).toContainText('38%');
    await expect(page.locator('.stat-card--ring .stat-card__value')).toHaveText('4');
    await expect(page.getByText('8 cards in Prague, 2 outside')).toBeVisible();
    // Cards by rarity, compact, beside the ring (the rarity mock: legend 1).
    const rarity = page.locator('.rarity-compact');
    await expect(rarity.locator('.rarity-compact__item')).toHaveCount(7);
    await expect(rarity.locator('.rarity-compact__item', { hasText: 'Legendary' })).toContainText('1');
  });

  test('the rank and how it moved sit beside the level badge, and "This week" has left the profile', async ({ page }) => {
    await expect(page.locator('.week-card')).toHaveCount(0);
    const rank = page.locator('a.stat-card--rank-top');
    await expect(rank).toBeVisible();
    await expect(rank).toHaveAttribute('href', '/leaderboard');
    await expect(rank.locator('.stat-card__value')).toHaveText('#12▲3');
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(rank).toBeVisible();
    const badge = await page.locator('.level-badge').boundingBox();
    const top = await rank.boundingBox();
    expect(top.x).toBeGreaterThan(badge.x + badge.width - 1);
    expect(Math.abs(top.y - badge.y)).toBeLessThan(20);
  });

  test('opened packs stand on the profile, whole, finished ones first; sealed ones stay away', async ({ page }) => {
    const base = { foil: '#7a1f2b', districts: ['Praha 1'], quarters: ['Hradčany'], unlockAt: 3, unlockXp: 20, completeXp: 435, memberSlugs: [], localizedNames: { cz: 'x', zh: 'x' }, total: 20 };
    const packs = [
      { ...base, slug: 'half', name: 'Half', collected: 10, unlocked: true, completed: false },
      { ...base, slug: 'done', name: 'Done', collected: 20, unlocked: true, completed: true },
      { ...base, slug: 'shut', name: 'Shut', collected: 1, unlocked: false, completed: false },
    ];
    await page.route('**/api/packs', route => route.fulfill({ json: packs }));
    await page.route('**/api/packs/done', route => route.fulfill({ json: { ...packs[1], description: { en: 'Text.', cz: 'x', zh: 'x' }, storyLocked: false, members: [] } }));
    for (const [width, height, layout] of [[1536, 730, 'compact'], [2560, 1300, 'side'], [390, 844, 'stack']]) {
      await page.setViewportSize({ width, height });
      await page.reload();
      const items = page.locator(`.pack-shelf--${layout} .pack-card`);
      await expect(items).toHaveCount(2);
      await expect(items.first()).toHaveAttribute('data-pack', 'done');
      if (layout !== 'stack') expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(true);
    }
    await page.setViewportSize({ width: 1536, height: 730 });
    await page.reload();
    await page.locator('.pack-shelf .pack-card').first().click();
    await expect(page.locator('.pack-detail').getByText('Text.')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.locator('.pack-shelf__all').click();
    await expect(page.locator('.profile-gallery .pack-card')).toHaveCount(2);
  });

  test('levels are listed from the navbar XP figure, not on the profile', async ({ page }) => {
    await expect(page.locator('.rarity-compact')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Explorer Levels' })).toHaveCount(0);

    await page.locator('.navbar__user').click();
    const modal = page.locator('.levels-modal');
    await expect(modal.getByRole('heading', { name: 'Explorer Levels' })).toBeVisible();
    await expect(modal.locator('.levels-modal__level')).toHaveCount(2);
    await expect(modal.getByText('Apprentice Explorer')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modal).toHaveCount(0);

    // The profile's level badge opens the same list (the navbar figure is
    // hidden on phones).
    await page.locator('.level-badge').click();
    await expect(page.locator('.levels-modal .levels-modal__level')).toHaveCount(2);
  });

  test('shows the share unlocked and the rarest achievements; a tile opens the detail', async ({ page }) => {
    await expect(page.getByText('1 of 2 unlocked (50%)')).toBeVisible();
    const tiles = page.locator('.ach-showcase .ach-tile');
    await expect(tiles).toHaveCount(1); // only unlocked ones
    await expect(tiles.first()).toContainText('First Steps');
    await expect(tiles.first().locator('.ach-tile__date')).toHaveText('1 Jan 2026');
    await expect(tiles.first()).not.toContainText('of players');   // share hidden for now

    await tiles.first().click();
    const modal = page.locator('.ach-modal');
    await expect(modal.getByText('Check in to your first location.')).toBeVisible();
    await expect(modal.getByText('Unlocked 1 Jan 2026')).toBeVisible();
    await page.locator('.px-modal__close').click();
    await expect(modal).toHaveCount(0);
  });

  test('first row is the newest, second the rarest of the rest; "All achievements" opens every unlocked one in a window', async ({ page }) => {
    // Phone width: three columns. Day n = unlocked on 2026-01-n.
    const ach = (id, difficulty, day) => ({
      id, name: id, name_cz: '', name_zh: '', description: `${id} desc`, description_cz: '', description_zh: '',
      flavor: '', icon: '⭐', unlocked: true, unlockedAt: `2026-01-${String(day).padStart(2, '0')}T00:00:00.000Z`,
      unlockRate: 10, difficulty, progress: { current: 1, target: 1 },
    });
    const list = [
      ach('old-diamond', 'extreme', 1), ach('old-gold', 'hard', 2), ach('old-silver', 'medium', 3),
      ach('mid-bronze', 'easy', 4), ach('mid-silver', 'medium', 5),
      ach('new-bronze-1', 'easy', 10), ach('new-bronze-2', 'easy', 11), ach('new-gold', 'hard', 12),
      { ...ach('locked-one', 'easy', 1), unlocked: false, unlockedAt: null, progress: { current: 0, target: 1 } },
    ];
    await page.route('**/api/user/achievements', route => route.fulfill({ json: { ...ACHIEVEMENTS, achievements: list } }));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();

    const names = () => page.locator('.ach-showcase .ach-tile:not(.ach-tile--extra) .ach-tile__name').allTextContents();
    await expect(page.locator('.ach-showcase .ach-tile:not(.ach-tile--extra)')).toHaveCount(6);
    expect(await names()).toEqual(['new-gold', 'new-bronze-2', 'new-bronze-1', 'old-diamond', 'old-gold', 'mid-silver']);

    await page.getByRole('button', { name: 'All achievements →' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    const gallery = page.locator('.profile-gallery');
    await expect(gallery.locator('.ach-tile')).toHaveCount(8); // unlocked only
    await expect(gallery.locator('.card-strip__count')).toHaveText('8');
    expect(await gallery.locator('.ach-tile__name').allTextContents()).toEqual(['old-diamond', 'new-gold', 'old-gold', 'mid-silver', 'old-silver', 'new-bronze-2', 'new-bronze-1', 'mid-bronze']);
    await expect(page.locator('.ach-showcase .ach-tile:not(.ach-tile--extra)')).toHaveCount(6); // the profile doesn't grow

    // A tile's detail opens on top; closing it (or Escape meanwhile) leaves the window.
    await gallery.locator('.ach-tile').first().click();
    await expect(page.locator('.ach-modal')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(gallery).toBeVisible();
    await page.locator('.ach-modal .px-modal__close').click();
    await expect(page.locator('.ach-modal')).toHaveCount(0);
    await expect(gallery).toBeVisible();

    await gallery.locator('.px-modal__close').click();
    await expect(gallery).toHaveCount(0);
    await page.getByRole('button', { name: 'All achievements →' }).click();
    await expect(gallery).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(gallery).toHaveCount(0);
  });

  test('"All achievements" sits top right in the card head, like the strips', async ({ page }) => {
    const ach = i => ({ ...ACHIEVEMENTS.achievements[0], id: `a${i}`, name: 'From the Vltava to the Elbe' });
    await page.route('**/api/user/achievements', route => route.fulfill({ json: { ...ACHIEVEMENTS, achievements: Array.from({ length: 30 }, (_, i) => ach(i)) } }));
    await page.reload();
    const button = page.getByRole('button', { name: 'All achievements →' });
    const card = page.locator('.profile-card', { has: page.locator('.ach-showcase') });
    await expect(card.locator('.card-strip__head').getByRole('button')).toHaveText('All achievements →');
    const b = await button.boundingBox();
    const showcase = await card.locator('.ach-showcase').boundingBox();
    expect(b.y).toBeLessThan(showcase.y);
    expect(b.x + b.width).toBeGreaterThan(showcase.x + showcase.width - 8);
    // A long English name takes two lines without being cut.
    const name = card.locator('.ach-tile__name').first();
    expect(await name.evaluate(e => e.scrollHeight <= e.clientHeight + 1)).toBe(true);
  });

  test('no "All achievements" button when everything fits in two rows', async ({ page }) => {
    await expect(page.locator('.ach-showcase .ach-tile')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'All achievements →' })).toHaveCount(0);
  });

  test('lists collected out of all cards for each district, Praha 1 to 22', async ({ page }) => {
    const rows = page.locator('.district-progress__row');
    await expect(page.getByText('By district')).toBeVisible();
    await page.locator('.district-progress__toggle').click();
    await expect(rows).toHaveCount(22);
    // collected = (i * 7) % 30: zero for Praha 1 only
    await expect(page.locator('.district-details .district-progress__summary')).toContainText('21 / 22');
    await expect(page.locator('.district-details .district-progress__summary')).toContainText('districts visited');
    await expect(page.locator('.district-progress__row--unvisited')).toHaveCount(1);
    await expect(rows.first()).toContainText('Prague 1');
    await expect(rows.first()).toContainText('0 / 40');
    await expect(rows.nth(21)).toContainText('Prague 22');
    await expect(rows.nth(21)).toContainText('27 / 61');
  });

  test('shows the newest expedition cards as small covers; empty treasure strip nudges to a hunt', async ({ page }) => {
    const treasure = page.locator('.card-strip').filter({ hasText: 'Treasure Hunt Finds' });
    await expect(treasure).toContainText('No treasure found yet.');
    await expect(treasure.getByRole('link', { name: 'Start a treasure hunt.' })).toHaveAttribute('href', '/treasure-hunt');
    await expect(treasure.getByRole('button', { name: 'All →' })).toHaveCount(0);

    const exp = page.locator('.card-strip').filter({ hasText: 'Expeditions' });
    await expect(exp.locator('.card-strip__count')).toHaveText('8');
    await expect(exp.locator('.card-strip__item')).toHaveCount(4);
    await expect(exp.locator('.card-strip__name').first()).toHaveText('Karlstejn');
    const box = await exp.locator('.card-strip__cover').first().boundingBox();
    expect(box.width).toBeLessThanOrEqual(112); // a thumbnail, not a full card
    // One row only, four at most (2026-11-04), on a phone too.
    const tops = await exp.locator('.card-strip__item').evaluateAll(els => els.map(e => e.getBoundingClientRect().top));
    expect(new Set(tops).size).toBe(1);
    await page.setViewportSize({ width: 390, height: 844 });
    const shown = exp.locator('.card-strip__item:visible');
    await expect(shown).toHaveCount(4);
    const phoneTops = await shown.evaluateAll(els => els.map(e => e.getBoundingClientRect().top));
    expect(new Set(phoneTops).size).toBe(1);
    // The ring's totals go on two lines on a phone.
    const parts = page.locator('.ring-stats__part');
    const [a, b] = [await parts.nth(0).boundingBox(), await parts.nth(1).boundingBox()];
    expect(b.y).toBeGreaterThan(a.y);
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.route('**/api/locations/karlstejn', route => route.fulfill({ json: { ...PROGRESS.recentFinds.expedition.cards[0], description: { en: 'A castle.' }, coordinates: { lat: 49.9, lng: 14.2 } } }));
    await exp.locator('.card-strip__item').first().click();
    await expect(page.locator('.modal-overlay, .px-modal').first()).toBeVisible();
  });

  test('"All →" on the expedition strip opens a window with every expedition card, on a phone too', async ({ page }) => {
    const cards = Array.from({ length: 8 }, (_, i) => ({
      slug: `out-${i}`, name: `Out ${i}`, localizedNames: { cz: `Out ${i}`, zh: `Out ${i}` }, labels: ['castle', 'outside'], rarity: 'expedition', coverImage: '', pixelArtKey: '',
    }));
    await page.route('**/api/user/expeditions', route => route.fulfill({ json: cards }));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.card-strip').filter({ hasText: 'Expeditions' }).getByRole('button', { name: 'All →' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    const gallery = page.locator('.profile-gallery');
    await expect(gallery.locator('.card-strip__item:visible')).toHaveCount(8);
    await expect(gallery.locator('.card-strip__meta')).toHaveCount(0);

    await page.route('**/api/locations/out-0', route => route.fulfill({ json: { ...cards[0], description: { en: 'A castle.' }, coordinates: { lat: 49.9, lng: 14.2 } } }));
    await gallery.locator('.card-strip__item').first().click();
    await expect(page.locator('.px-modal--detail')).toBeVisible();
    await expect(gallery).toBeVisible();
  });

  test('a rarity opens its collected cards whole, at Explore\'s size, as many to a row as fit', async ({ page }) => {
    const card = (i, rarity, unlocked) => ({
      _id: String(i), name: `Card ${i}`, slug: `card-${i}`, localizedNames: { cz: `Card ${i}`, zh: `Card ${i}` }, labels: ['castle'], coverImage: '', pixelArtKey: '',
      rarity, xpReward: 100, unlocked, _checkedInAt: unlocked ? `2026-01-${String(i + 1).padStart(2, '0')}T00:00:00.000Z` : null, coordinates: { lat: 50.0865, lng: 14.4114 },
    });
    await page.route('**/api/locations', route => route.fulfill({ json: [
      ...Array.from({ length: 20 }, (_, i) => card(i, 'legend', true)),
      card(20, 'legend', false),
      card(21, 'rare', true),
    ] }));
    const columns = () => page.locator('.profile-gallery .loc-card').evaluateAll(els => new Set(els.map(e => Math.round(e.getBoundingClientRect().left))).size);
    const widthOn = async selector => page.locator(`${selector} .loc-card`).first().evaluate(e => e.getBoundingClientRect().width);

    for (const [width, height, wide] of [[2560, 1440, true], [1280, 800, false], [700, 900, false], [390, 844, false]]) {
      await page.setViewportSize({ width, height });
      await page.goto('/explore');
      await page.locator('.location-grid .loc-card').first().waitFor();
      const onExplore = await widthOn('.location-grid');
      await page.goto('/dashboard');
      await page.locator('.rarity-compact__item', { hasText: 'Legendary' }).getByRole('button').click();
      await expect(page.locator('.profile-gallery .loc-card')).toHaveCount(20); // collected ones of this rarity only
      await expect(page.locator('.profile-gallery .card-strip__count')).toHaveText('20');
      // With the side column Explore scales its cards to fit whole rows; the window keeps them full size.
      if (width >= 1180 && height >= 700) expect(await widthOn('.profile-gallery')).toBeGreaterThanOrEqual(onExplore - 1);
      else expect(Math.abs(await widthOn('.profile-gallery') - onExplore)).toBeLessThan(1);
      if (wide) expect(await columns()).toBeGreaterThan(6); // Explore stops at six
    }
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('.profile-gallery .loc-card__name').first()).toHaveText('Card 19'); // newest first

    await page.route('**/api/locations/card-19', route => route.fulfill({ json: { ...card(19, 'legend', true), description: { en: 'A castle.' } } }));
    await page.locator('.profile-gallery .loc-card').first().click();
    await expect(page.locator('.px-modal--detail')).toBeVisible();
    await expect(page.locator('.profile-gallery')).toBeVisible();
  });

  test('empty strips never widen the page, and their text fits, in any language', async ({ page }) => {
    await page.route('**/api/user/progress', route => route.fulfill({ json: { ...PROGRESS, recentFinds: { treasure: { count: 0, cards: [] }, expedition: { count: 0, cards: [] } } } }));
    for (const lang of ['zh', 'en', 'cz']) {
      await page.addInitScript(l => localStorage.setItem('lang', l), lang);
      for (const width of [390, 700, 900]) {
        await page.setViewportSize({ width, height: 844 });
        await page.goto('/dashboard');
        await page.locator('.card-strip__empty').first().waitFor();
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(150);
        const m = await page.evaluate(() => ({
          page: document.documentElement.scrollWidth,
          cut: [...document.querySelectorAll('.card-strip__empty')].filter(e => e.scrollWidth > e.clientWidth + 1).length,
        }));
        expect(m, `${lang} at ${width}`).toEqual({ page: width, cut: 0 });
      }
    }
  });

  test('from the map, a district opens its guide beside the cards collected there on a wide screen', async ({ page }) => {
    const card = (i, district, unlocked) => ({
      _id: String(i), name: `Card ${i}`, slug: `card-${i}`, localizedNames: { cz: `Card ${i}`, zh: `Card ${i}` }, labels: ['castle'], coverImage: '', pixelArtKey: '',
      rarity: 'rare', xpReward: 20, unlocked, _checkedInAt: unlocked ? `2026-01-${String(i + 1).padStart(2, '0')}T00:00:00.000Z` : null, district, quarter: 'Dejvice', coordinates: { lat: 50.1, lng: 14.39 },
    });
    await page.route('**/api/locations', route => route.fulfill({ json: [
      ...Array.from({ length: 12 }, (_, i) => card(i, 'Praha 11', true)),
      card(12, 'Praha 11', false),
      card(13, 'Praha 1', true),
    ] }));
    await page.route('**/api/user/area-guide-read', route => route.fulfill({ json: {} }));
    const openDistrict = async () => {
      const area = page.locator('.district-map__area').nth(5); // Praha 11 in the map's order
      await area.waitFor();
      await area.hover();
      await area.click();
    };
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.reload();
    await openDistrict();
    const guide = page.locator('.area-guide--split');
    await expect(guide.locator('.area-guide__section').first()).toBeVisible();
    const cards = guide.locator('.area-guide__collection .loc-card');
    await expect(guide.locator('.area-guide__title')).toHaveText('Prague 11');
    await expect(cards).toHaveCount(12); // collected, in this district only
    const text = await guide.locator('.area-guide__text').boundingBox();
    const shelf = await guide.locator('.area-guide__collection').boundingBox();
    expect(shelf.x).toBeGreaterThanOrEqual(text.x + text.width - 1);
    expect((await guide.boundingBox()).width).toBeGreaterThan(2400);

    // A card's detail opens on top; Escape leaves both, then closes the guide once it's alone.
    await page.route('**/api/locations/card-*', route => route.fulfill({ json: { ...card(11, 'Praha 11', true), description: { en: 'A castle.' } } }));
    await cards.first().click();
    const detail = page.locator('.px-modal--detail');
    await expect(detail).toBeVisible();
    const box = await detail.boundingBox();
    const top = await page.evaluate(({ x, y }) => !!document.elementFromPoint(x, y)?.closest('.px-modal--detail'), { x: box.x + box.width / 2, y: box.y + box.height / 2 });
    expect(top).toBe(true);
    await page.keyboard.press('Escape');
    await expect(guide).toBeVisible();
    await detail.locator('.px-modal__close').first().click();
    await expect(detail).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(guide).toHaveCount(0);

    // Narrower screens stack the cards under the text.
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.reload();
    await openDistrict();
    await expect(page.locator('.area-guide--stacked .loc-card')).toHaveCount(12);
    await expect(page.locator('.area-guide--split')).toHaveCount(0);
  });

  test('the progress list opens in its own window on every screen', async ({ page }) => {
    const list = page.locator('.district-details .district-progress__list');
    const toggle = page.locator('.district-progress__toggle');
    for (const [width, height] of [[2560, 1440], [1920, 1080], [390, 844]]) {
      await page.setViewportSize({ width, height });
      await expect(list).toHaveCount(0);
      await expect(page.locator('.district-map')).toBeVisible();
      await expect(toggle).toHaveText('View details');
      await toggle.click();
      await expect(list).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(list).toHaveCount(0);
    }
  });

  test('a progress row opens the same guide window instead of going to Explore', async ({ page }) => {
    await page.route('**/api/locations', route => route.fulfill({ json: [
      { _id: '1', name: 'Bridge', slug: 'bridge', localizedNames: { cz: 'Bridge', zh: 'Bridge' }, labels: ['bridge'], coverImage: '', pixelArtKey: '', rarity: 'rare', xpReward: 20, unlocked: true, district: 'Praha 2', quarter: 'Nové Město', coordinates: { lat: 50.07, lng: 14.42 } },
    ] }));
    await page.route('**/api/user/area-guide-read', route => route.fulfill({ json: {} }));
    await page.reload();
    await page.locator('.district-progress__toggle').click();
    const row = name => page.locator('.district-progress__row').filter({ has: page.getByText(name, { exact: true }) }).getByRole('button');

    await row('Prague 2').click();
    const guide = page.locator('.area-guide--split');
    await expect(guide.locator('.area-guide__title')).toHaveText('Prague 2');
    await expect(guide.locator('.area-guide__collection .loc-card')).toHaveCount(1);
    await expect(page).toHaveURL(/\/dashboard/);
    await page.keyboard.press('Escape');
    await expect(guide).toHaveCount(0);

    // A district with nothing collected yet opens too, as on the map.
    await row('Prague 1').click();
    await expect(guide.locator('.area-guide__title')).toHaveText('Prague 1');
    await expect(guide).toContainText('No cards collected here yet.');
    await page.keyboard.press('Escape');

    // Phones: the overview only, the rest folded, the cards underneath.
    await page.setViewportSize({ width: 390, height: 844 });
    await row('Prague 2').click();
    const stacked = page.locator('.area-guide--stacked');
    const sections = stacked.locator('.area-guide__section');
    await expect(guide).toHaveCount(0);
    await expect(sections).toHaveCount(1);
    await expect(stacked.locator('.area-guide__collection .loc-card')).toHaveCount(1);
    expect(Math.abs(await stacked.locator('.loc-card').evaluate(e => e.getBoundingClientRect().width) - 176)).toBeLessThan(1); // Explore's two columns at this width
    const more = stacked.getByRole('button', { name: 'Read more' });
    await more.click();
    expect(await sections.count()).toBeGreaterThan(1);
    await stacked.evaluate(el => { el.scrollTop = el.scrollHeight; });
    await expect(stacked.locator('.px-modal__close')).toBeInViewport(); // pinned while scrolling
    await stacked.getByRole('button', { name: 'Show less' }).click();
    await expect(sections).toHaveCount(1);
    await expect(stacked.getByRole('button', { name: 'Read more' })).toBeVisible();

    await page.route('**/api/locations/bridge', route => route.fulfill({ json: { slug: 'bridge', name: 'Bridge', localizedNames: {}, labels: ['bridge'], rarity: 'rare', unlocked: true, description: { en: 'A bridge.' }, coordinates: { lat: 50.07, lng: 14.42 } } }));
    await stacked.locator('.loc-card').click();
    const detail = page.locator('.px-modal--detail');
    await expect(detail).toBeVisible();
    const box = await detail.boundingBox();
    expect(await page.evaluate(({ x, y }) => !!document.elementFromPoint(x, y)?.closest('.px-modal--detail'), { x: box.x + box.width / 2, y: box.y + box.height / 2 })).toBe(true);
  });

  test('the window says so when the cards cannot be loaded', async ({ page }) => {
    await page.route('**/api/user/expeditions', route => route.fulfill({ status: 500, json: {} }));
    await page.locator('.card-strip').filter({ hasText: 'Expeditions' }).getByRole('button', { name: 'All →' }).click();
    await expect(page.locator('.profile-gallery')).toContainText('could not be loaded');
  });

  test('with no expedition cards yet, the nudge opens Explore on Show all, filtered to Expedition', async ({ page }) => {
    await page.route('**/api/user/progress', route => route.fulfill({ json: { ...PROGRESS, recentFinds: { ...PROGRESS.recentFinds, expedition: { count: 0, cards: [] } } } }));
    const card = (i, name, extra) => ({
      _id: String(i), name, slug: name.toLowerCase(), localizedNames: { cz: name, zh: name }, coverImage: '', pixelArtKey: '',
      unlocked: false, coordinates: { lat: 50.0865, lng: 14.4114 }, ...extra,
    });
    await page.route('**/api/locations', route => route.fulfill({ json: [
      card(1, 'Bridge', { labels: ['bridge'], rarity: 'legend', xpReward: 100, unlocked: true }),
      card(2, 'Melnik', { labels: ['castle', 'outside'], rarity: 'expedition', xpReward: 120 }),
      card(3, 'Roztoky', { labels: ['castle', 'outside'], rarity: 'expedition', xpReward: 60 }),
    ] }));
    await page.reload();
    const exp = page.locator('.card-strip').filter({ hasText: 'Expeditions' });
    await expect(exp).toContainText('No expedition cards yet.');
    await exp.getByRole('link', { name: 'See the places beyond Prague.' }).click();
    await expect(page).toHaveURL(/\/explore/);
    await expect(page.locator('.loc-card')).toHaveCount(2); // both outside cards, neither collected
    await expect(page.locator('.explore-applied__item')).toContainText('Bring a sandwich'); // the side column's filter line
  });

  test('"All →" on the treasure strip opens the finds in a window, with rarity and XP', async ({ page }) => {
    const find = { ...PROGRESS.recentFinds.expedition.cards[0], slug: 'gate', name: 'Gate', labels: ['gate'], rarity: 'rare', unlocked: true, _xpEarned: 200 };
    await page.route('**/api/user/progress', route => route.fulfill({ json: { ...PROGRESS, recentFinds: { ...PROGRESS.recentFinds, treasure: { count: 1, cards: [find] } } } }));
    await page.route('**/api/user/treasures', route => route.fulfill({ json: [find] }));
    await page.reload();
    // Names in the treasure strip take their card's rarity colour.
    await expect(page.locator('.card-strip').filter({ hasText: 'Treasure Hunt Finds' }).locator('.card-strip__name'))
      .toHaveAttribute('style', /var\(--rarity-rare\)/);
    await expect(page.locator('.card-strip').filter({ hasText: 'Expeditions' }).locator('.card-strip__name').first())
      .not.toHaveAttribute('style', /rarity/);
    await expect(page.locator('.card-strip').filter({ hasText: 'Treasure Hunt Finds' }).locator('.card-strip__meta')).toHaveText(/Rare\s*\+200 XP/);
    await expect(page.locator('.card-strip').filter({ hasText: 'Expeditions' }).locator('.card-strip__meta')).toHaveCount(0);
    await page.locator('.card-strip').filter({ hasText: 'Treasure Hunt Finds' }).getByRole('button', { name: 'All →' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    const gallery = page.locator('.profile-gallery');
    await expect(gallery.locator('.card-strip__item')).toHaveCount(1);
    await expect(gallery.locator('.card-strip__meta')).toHaveText(/Rare\s*\+200 XP/);
  });
});
