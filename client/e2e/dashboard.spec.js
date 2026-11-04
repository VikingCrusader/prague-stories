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

  test('"This week" shows the rank and how it moved, new cards and XP; the rank opens the leaderboard', async ({ page }) => {
    const card = page.locator('.week-card');
    await expect(card.locator('.stat-card__label')).toHaveText('This week(resets every Monday)');
    const rank = card.locator('.week-card__item--rank');
    await expect(rank).toContainText('Leaderboard rank');
    await expect(rank.locator('.week-card__n')).toHaveText('#12▲3');
    await expect(rank.locator('.rank-change--up')).toHaveText('▲3');
    await expect(rank.locator('a')).toHaveAttribute('href', '/leaderboard');
    await expect(card.locator('.week-card__item', { hasText: 'New cards' }).locator('.week-card__n')).toHaveText('+5');
    await expect(card.locator('.week-card__item', { hasText: 'XP gained' }).locator('.week-card__n')).toHaveText('+380');
    await expect(page.getByText('Total XP')).toHaveCount(0);

    const show = async (week, extra = {}) => {
      await page.unroute('**/api/user/progress');
      await page.route('**/api/user/progress', route => route.fulfill({ json: { ...PROGRESS, ...extra, week } }));
      await page.reload();
      await page.locator('.week-card').waitFor();
    };
    await show({ cards: 0, xp: 0, rankChange: { delta: -2 } });
    await expect(rank.locator('.rank-change--down')).toHaveText('▼2');
    await expect(card.locator('.week-card__item', { hasText: 'New cards' }).locator('.week-card__n')).toHaveText('0');
    await show({ cards: 0, xp: 0, rankChange: { delta: 0 } });
    await expect(rank.locator('.week-card__n')).toHaveText('#12');
    await show({ cards: 1, xp: 10, rankChange: { isNew: true } });
    await expect(rank.locator('.rank-change--up')).toHaveText('New');
    await show({ cards: 0, xp: 0, rankChange: null }, { rank: null });
    await expect(rank.locator('.week-card__n')).toHaveText('—');

    // On a desktop the rank isn't also shown beside the level badge.
    await expect(page.locator('a.stat-card--rank-top')).toBeHidden();

    // On a phone the rank sits beside the level badge instead, and the
    // "This week" card keeps only new cards and XP.
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(rank).toBeHidden();
    await expect(card.locator('.week-card__item', { hasText: 'New cards' })).toBeVisible();
    await expect(page.locator('a.stat-card--rank-top')).toBeVisible();
    const badge = await page.locator('.level-badge').boundingBox();
    const top = await page.locator('a.stat-card--rank-top').boundingBox();
    expect(top.x).toBeGreaterThan(badge.x + badge.width - 1);
    expect(Math.abs(top.y - badge.y)).toBeLessThan(20);
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

  test('first row is the newest, second the rarest of the rest; "All achievements" opens the other unlocked ones in place', async ({ page }) => {
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

    const names = () => page.locator('.ach-showcase .ach-tile .ach-tile__name').allTextContents();
    await expect(page.locator('.ach-showcase .ach-tile')).toHaveCount(6);
    expect(await names()).toEqual(['new-gold', 'new-bronze-2', 'new-bronze-1', 'old-diamond', 'old-gold', 'mid-silver']);

    await page.getByRole('button', { name: 'All achievements ↓' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('.ach-showcase .ach-tile')).toHaveCount(8); // unlocked only
    expect((await names()).slice(6)).toEqual(['old-silver', 'mid-bronze']);
    await expect(page.locator('.ach-showcase .ach-tile').nth(7)).toBeVisible();

    await page.getByRole('button', { name: 'Show less ↑' }).click();
    await expect(page.locator('.ach-showcase .ach-tile')).toHaveCount(6);
  });

  test('no "All achievements" button when everything fits in two rows', async ({ page }) => {
    await expect(page.locator('.ach-showcase .ach-tile')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'All achievements ↓' })).toHaveCount(0);
  });

  test('lists collected out of all cards for each district, Praha 1 to 22', async ({ page }) => {
    const rows = page.locator('.district-progress__row');
    await expect(page.getByText('By district')).toBeVisible();
    await expect(rows).toHaveCount(22);
    // collected = (i * 7) % 30: zero for Praha 1 only
    await expect(page.locator('.district-progress__summary')).toContainText('21 / 22');
    await expect(page.locator('.district-progress__summary')).toContainText('districts visited');
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
    await expect(treasure.getByRole('link', { name: 'All →' })).toHaveCount(0);

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

  test('"All →" on the expedition strip opens My Collections filtered to Expedition', async ({ page }) => {
    const card = (i, name, extra) => ({
      _id: String(i), name, slug: name.toLowerCase(), localizedNames: { cz: name, zh: name }, coverImage: '', pixelArtKey: '',
      unlocked: true, coordinates: { lat: 50.0865, lng: 14.4114 }, ...extra,
    });
    await page.route('**/api/locations', route => route.fulfill({ json: [
      card(1, 'Bridge', { labels: ['bridge'], rarity: 'legend', xpReward: 100 }),
      card(2, 'Melnik', { labels: ['castle', 'outside'], rarity: 'expedition', xpReward: 120 }),
      card(3, 'Roztoky', { labels: ['castle', 'outside'], rarity: 'expedition', xpReward: 60 }),
      card(4, 'Locked', { labels: ['castle', 'outside'], rarity: 'expedition', xpReward: 60, unlocked: false }),
    ] }));
    await page.locator('.card-strip').filter({ hasText: 'Expeditions' }).getByRole('link', { name: 'All →' }).click();
    await expect(page).toHaveURL(/\/explore/);
    await expect(page.locator('.loc-card')).toHaveCount(2);
    await expect(page.locator('.explore-rarity-blurb')).toContainText('beyond the city limits');
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
    await expect(page.locator('.explore-rarity-blurb')).toContainText('beyond the city limits');
  });

  test('"All →" on the treasure strip opens the finds on the Treasure Hunt page', async ({ page }) => {
    const find = { ...PROGRESS.recentFinds.expedition.cards[0], slug: 'gate', name: 'Gate', labels: ['gate'], rarity: 'rare', unlocked: true, _xpEarned: 200 };
    await page.route('**/api/user/progress', route => route.fulfill({ json: { ...PROGRESS, recentFinds: { ...PROGRESS.recentFinds, treasure: { count: 1, cards: [find] } } } }));
    await page.route('**/api/user/treasures', route => route.fulfill({ json: [find] }));
    await page.route('**/api/locations', route => route.fulfill({ json: [] }));
    await page.route(/\/api\/user\/(random-draw|hardcore-hunt)/, route => route.fulfill({ json: { active: false, canDraw: true } }));
    await page.reload();
    // Names in the treasure strip take their card's rarity colour.
    await expect(page.locator('.card-strip').filter({ hasText: 'Treasure Hunt Finds' }).locator('.card-strip__name'))
      .toHaveAttribute('style', /var\(--rarity-rare\)/);
    await expect(page.locator('.card-strip').filter({ hasText: 'Expeditions' }).locator('.card-strip__name').first())
      .not.toHaveAttribute('style', /rarity/);
    await expect(page.locator('.card-strip').filter({ hasText: 'Treasure Hunt Finds' }).locator('.card-strip__meta')).toHaveText(/Rare\s*\+200 XP/);
    await expect(page.locator('.card-strip').filter({ hasText: 'Expeditions' }).locator('.card-strip__meta')).toHaveCount(0);
    await page.locator('.card-strip').filter({ hasText: 'Treasure Hunt Finds' }).getByRole('link', { name: 'All →' }).click();
    await expect(page).toHaveURL(/\/treasure-hunt/);
    await expect(page.getByRole('button', { name: 'Hide my treasure finds' })).toBeVisible();
    await expect(page.locator('.hunt-finds .loc-card')).toHaveCount(1);
  });
});
