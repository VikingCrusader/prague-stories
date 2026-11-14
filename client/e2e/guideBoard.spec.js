import { test, expect } from '@playwright/test';

// The Guide's overview board on a 2K screen (GuideBoard.jsx).
test.use({ viewport: { width: 2560, height: 1300 } });

const card = (slug, name, rarity, xpReward) => ({
  _id: slug, slug, name, localizedNames: { cz: name, zh: name }, labels: ['church'],
  coordinates: { lat: 50.08, lng: 14.42 }, rarity, xpReward, coverImage: '', pixelArtKey: '',
  quarter: 'Staré Město', district: 'Praha 1',
});
const CARDS = [
  card('golden-lane', 'Golden Lane', 'common', 10),
  card('dancing-house', 'Dancing House', 'rare', 20),
  card('national-theatre', 'National Theatre', 'superior', 30),
  card('tyn-church', 'Týn Church', 'epic', 50),
  card('astronomical-clock', 'Astronomical Clock', 'mythic', 70),
  card('charles-bridge', 'Charles Bridge', 'legend', 100),
  { ...card('zizkov-tv-tower', 'Far Castle', 'expedition', 300), labels: ['castle', 'outside'] },
];

test.beforeEach(async ({ page }) => {
  await page.route('**/api/packs', route => route.fulfill({ json: [] }));
  await page.route('**/api/locations', route => route.fulfill({ json: CARDS }));
  await page.route('**/api/locations/*', route => route.fulfill({ json: { ...CARDS[5], description: { en: 'A bridge.' }, storyLocked: true } }));
  await page.goto('/guide');
});

// Screenshots for a human look, only when GUIDE_SHOTS names a folder.
const shot = (page, name) => (process.env.GUIDE_SHOTS ? page.screenshot({ path: `${process.env.GUIDE_SHOTS}/${name}.png` }) : null);

const settled = page => page.evaluate(() => Promise.all(
  [...document.querySelectorAll('.px-overlay, .px-modal')].flatMap(el => el.getAnimations()).map(a => a.finished.catch(() => {})),
));

test('the board shows every section as a tile and fits the screen', async ({ page }) => {
  const tiles = page.locator('.guide-tile');
  await expect(tiles).toHaveCount(16);
  await expect(page.locator('.guide-wrap')).toHaveCount(0);
  const last = await tiles.last().boundingBox();
  expect(last.y + last.height).toBeLessThanOrEqual(1300);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(2560);
  await page.waitForTimeout(900);
  await shot(page, 'board');
});

test('signed in, a few tiles show the player figures', async ({ page }) => {
  const USER = { _id: 'u1', username: 'explorer', email: 'e@example.com', totalXP: 140, explorerLevel: 2,
    levelInfo: { level: 2, title: 'Apprentice', title_cz: 'Učeň', title_zh: '学徒', xp: 140, nextLevelXP: 300, progress: 40 } };
  await page.addInitScript(() => localStorage.setItem('token', 'fake-jwt-token'));
  await page.route('**/api/auth/me', route => route.fulfill({ json: { user: USER } }));
  await page.route('**/api/locations', route => route.fulfill({ json: CARDS.map((c, i) => ({ ...c, unlocked: i < 3 })) }));
  await page.route('**/api/packs', route => route.fulfill({ json: [{ slug: 'a', name: 'A', total: 5, unlocked: true }, { slug: 'b', name: 'B', total: 5 }] }));
  await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: [{ id: 'x', unlocked: true }, { id: 'y' }, { id: 'z' }] } }));
  await page.reload();
  await expect(page.locator('.guide-tile--collect .guide-tile__mine')).toHaveText('You have collected 3 so far.');
  await expect(page.locator('.guide-tile--packs .guide-tile__mine')).toHaveText('You have opened 1 of 2 packs.');
  await expect(page.locator('.guide-tile--ach .guide-tile__mine')).toHaveText('You have unlocked 1 of 3.');
  await expect(page.locator('.guide-tile--xp .guide-mini--mine')).toContainText('Lv 2');
  await expect(page.locator('.guide-tile--xp .guide-tile__mine')).toHaveText('Apprentice');
  expect(await page.locator('.guide-tile--xp .guide-mini__bar > span').evaluate(el => el.style.width)).toBe('40%');
});

test('?open= opens a tile window, and opening one puts it in the address', async ({ page }) => {
  await page.goto('/guide?open=hunt');
  await expect(page.locator('.guide-window .guide-hunt')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.guide-window')).toHaveCount(0);
  await expect(page).toHaveURL(/\/guide$/);
  await page.locator('.guide-tile--packs').click();
  await expect(page).toHaveURL(/open=packs/);
});

test('the Treasure Hunt page links to the practice hunt', async ({ page }) => {
  await page.goto('/treasure-hunt');
  // The rules, practice link included, are on the page itself.
  await page.getByRole('link', { name: /practice hunt/ }).click();
  await expect(page).toHaveURL(/\/guide\?open=hunt/);
  await expect(page.locator('.guide-window .guide-hunt')).toBeVisible();
});

test('on a phone, installing comes right after the opening tile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const tops = await page.locator('.guide-tile').evaluateAll(els => els.map(e => [e.className.match(/guide-tile--(\w+)/)[1], e.getBoundingClientRect().top]).sort((a, b) => a[1] - b[1]).map(x => x[0]));
  expect(tops.slice(0, 3)).toEqual(['what', 'install', 'collect']);
});

test('the Screens window shows each page beside its screenshot, which enlarges', async ({ page }) => {
  await page.locator('.guide-tile--screens').click();
  const win = page.locator('.guide-window--screens');
  await expect(win.locator('.guide-screens__item')).toHaveCount(6);
  const first = win.locator('.guide-screens__shot img').first();
  await expect(first).toHaveAttribute('src', /\/guide\/screens\/explore-(light|dark)\.webp/);
  await expect.poll(() => first.evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  await settled(page);
  await win.locator('.guide-screens__shot').first().click();
  await expect(page.locator('.guide-screens__zoom')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.guide-screens__zoom')).toHaveCount(0);
  await expect(win).toBeVisible();
});

test('the Screens and Hunt windows have buttons to their pages', async ({ page }) => {
  await page.locator('.guide-tile--screens').click();
  const win = page.locator('.guide-window--screens');
  await expect(win.locator('.guide-goto')).toHaveCount(6);
  await expect(win.getByRole('link', { name: 'Open a card on Explore →' })).toHaveAttribute('href', '/explore');
  await win.getByRole('link', { name: 'Go to History →' }).click();
  await expect(page).toHaveURL(/\/history/);
  await page.goto('/guide?open=hunt');
  await page.locator('.guide-window').getByRole('link', { name: /Go to Treasure/ }).click();
  await expect(page).toHaveURL(/\/treasure-hunt/);
});

test('the opening window carries the tile picture as its banner', async ({ page }) => {
  await page.locator('.guide-tile--what').click();
  await expect(page.locator('.guide-window .guide-window__banner')).toBeVisible();
});

test('districts demo: a district on the map shows its line and opens its guide', async ({ page }) => {
  await page.locator('.guide-tile--areas').click();
  const win = page.locator('.guide-window--areas');
  await expect(win.locator('.district-map__area').first()).toBeVisible();
  await expect(win.locator('.guide-areas__side .district-line, .guide-areas__side button').first()).toBeVisible();
  await settled(page);
  await win.locator('.district-map__area').first().click();
  await expect(win.locator('.guide-areas__name')).toBeVisible();
  await win.getByRole('button', { name: /Read about this area/ }).click();
  await expect(page.locator('.area-guide')).toBeVisible();
});

test('expedition demo: the slider walks through real expedition cards and their XP', async ({ page }) => {
  const trip = (slug, lat, lng, xp) => ({ ...card(slug, slug, 'expedition', xp), coordinates: { lat, lng }, labels: ['castle', 'outside'] });
  await page.route('**/api/locations', route => route.fulfill({ json: [
    trip('golden-lane', 50.10, 14.60, 60), trip('karlstejn-castle', 49.94, 14.19, 240), trip('tyn-church', 48.81, 14.32, 300),
  ] }));
  await page.reload();
  await page.locator('.guide-tile--expedition').click();
  const win = page.locator('.guide-window--expedition');
  await expect(win.locator('.guide-expedition__card .loc-card')).toHaveAttribute('data-slug', 'karlstejn-castle');
  await expect(win.locator('.guide-expedition__xp')).toHaveText('+240 XP');
  await expect(win.locator('.guide-demo__hint').last()).toContainText('would pay 60');
  await win.locator('.guide-expedition input[type=range]').fill('2');
  await expect(win.locator('.guide-expedition__xp')).toHaveText('+300 XP');
  await expect(win.locator('.guide-expedition__steps li.is-on')).toContainText('240'); // 142 km, set by hand to 300
});

test('expedition demo: five examples in XP order, by distance or raised by hand', async ({ page }) => {
  const trip = (slug, lat, lng, xp) => ({ ...card(slug, slug, 'expedition', xp), coordinates: { lat, lng }, labels: ['outside'] });
  await page.route('**/api/locations', route => route.fulfill({ json: [
    trip('karlstejn-castle', 49.94, 14.19, 240), trip('kutna-hora', 49.95, 15.27, 180), trip('ricany', 49.99, 14.65, 60),
    trip('muzeum-pamatniku-lidice', 50.14, 14.20, 120), trip('zamek-melnik', 50.35, 14.47, 120),
  ] }));
  await page.reload();
  await page.locator('.guide-tile--expedition').click();
  const win = page.locator('.guide-window--expedition');
  const examples = win.locator('.guide-expedition__example .loc-card');
  await expect(examples).toHaveCount(5);
  expect(await examples.evaluateAll(els => els.map(e => e.dataset.slug))).toEqual(['ricany', 'zamek-melnik', 'muzeum-pamatniku-lidice', 'kutna-hora', 'karlstejn-castle']);
  expect(await win.locator('.guide-expedition__how').allTextContents()).toEqual(['By distance', 'By distance', 'Raised by hand', 'By distance', 'Raised by hand']);
  await settled(page);
  await examples.nth(3).click();
  await expect(win.locator('.guide-expedition__card .loc-card')).toHaveAttribute('data-slug', 'kutna-hora');
  await expect(win.locator('.guide-expedition__xp')).toHaveText('+180 XP');
});

test('history demo: every era in a table, a click shows its line', async ({ page }) => {
  await page.locator('.guide-tile--history').click();
  const win = page.locator('.guide-window--history');
  await expect(win.locator('.guide-history__row')).toHaveCount(24);
  await win.locator('.guide-history__head', { hasText: 'Chalice and Turmoil' }).click();
  await expect(win.locator('.guide-history__line')).toContainText('Hussite Wars');
  await win.locator('.guide-history__head', { hasText: 'Fire and Ashes' }).click();
  await expect(win.locator('.guide-history__line')).toHaveCount(1);
  await expect(win.locator('.guide-history__line')).toContainText("Thirty Years' War");
  await win.getByRole('link', { name: /Start reading in History/ }).click();
  await expect(page).toHaveURL(/\/history/);
});

test('quick start window: three sketches of the app, each with its step', async ({ page }) => {
  await page.locator('.guide-tile--start').click();
  const win = page.locator('.guide-window--start');
  await expect(win.locator('.guide-start .guide-install__step')).toHaveCount(3);
  await expect(win.locator('.guide-start .guide-mock__hit')).toHaveCount(3);
  await expect(win.locator('.guide-start .guide-install__caption').first()).toContainText('Register.');
  await expect(win.locator('.guide-start')).toContainText('May we use your location?');
});

test('old ?open=faq links open the merged Tips & FAQ window', async ({ page }) => {
  await page.goto('/guide?open=faq');
  await expect(page.locator('.guide-window__title')).toHaveText('Tips & FAQ');
});

test('a guest sees no personal figures', async ({ page }) => {
  await expect(page.locator('.guide-tile')).toHaveCount(16);
  await expect(page.locator('.guide-tile__mine')).toHaveCount(0);
});

test('a tile opens its section in a window, Escape closes it', async ({ page }) => {
  await page.locator('.guide-tile--tipsFaq').click();
  const win = page.locator('.guide-window');
  await expect(win.locator('.guide-window__title')).toHaveText('Tips & FAQ');
  await win.locator('summary').first().click();
  await expect(win.locator('.guide-faq__a').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(win).toHaveCount(0);
});

test('rarity demo: seven real cards, locked and collected', async ({ page }) => {
  await page.locator('.guide-tile--rarity').click();
  const win = page.locator('.guide-window--demo');
  await expect(win.locator('.guide-rarity__row .loc-card')).toHaveCount(7);
  await win.locator('.guide-rarity__row .loc-card[data-rarity="epic"]').click();
  await expect(win.locator('.guide-rarity__big .loc-card')).toHaveAttribute('data-rarity', 'epic');
  await win.getByRole('button', { name: 'Locked' }).click();
  await expect(win.locator('.guide-rarity__big .loc-card')).toHaveClass(/loc-card--locked/);
  await settled(page);
  await shot(page, 'rarity');
});

test('demo cards show a distance, and the big card opens its detail over the window', async ({ page }) => {
  await page.locator('.guide-tile--rarity').click();
  const win = page.locator('.guide-window--demo');
  await expect(win.locator('.guide-rarity__row .loc-card__dist')).toHaveCount(7);
  await settled(page);
  await win.locator('.guide-rarity__big .loc-card').click();
  const detail = page.locator('.guide-detail .px-modal--detail');
  await expect(detail).toBeVisible();
  await expect(win).toBeVisible();
  await page.keyboard.press('Escape'); // the Guide's window stays while the detail is on top
  await expect(win).toBeVisible();
  await detail.locator('.px-modal__close').first().click();
  await expect(detail).toHaveCount(0);
  await expect(win).toBeVisible();
});

test('locked demo: Týn Church shows its opening, collecting it unfolds the rest and the bonus', async ({ page }) => {
  await page.locator('.guide-tile--locked').click();
  const win = page.locator('.guide-window--locked');
  await expect(win.locator('.guide-locked__card .loc-card')).toHaveClass(/loc-card--locked/);
  await expect(win.locator('.guide-locked__wait')).toBeVisible();
  await expect(win.locator('.guide-locked__bonus')).toHaveCount(0);
  await settled(page);
  await win.locator('.guide-locked__card .loc-card').click(); // the lock: a note on Google Maps
  await expect(win.locator('.guide-locked__note')).toBeVisible();
  await win.getByRole('button', { name: "I'm here: collect" }).click();
  await expect(win.locator('.guide-locked__bonus')).toContainText('Tycho Brahe');
  await expect(win.locator('.guide-locked__wait')).toHaveCount(0);
  await page.waitForTimeout(1300);
  await shot(page, 'locked');
  await win.getByRole('button', { name: 'Lock it again' }).click();
  await expect(win.locator('.guide-locked__bonus')).toHaveCount(0);
});

test('achievements demo: six real achievements open their detail, and a link leads to the page', async ({ page }) => {
  const ach = (id, difficulty) => ({ id, difficulty, icon: '🏆', name: `Name ${id}`, flavor: 'Flavor', description: 'Do it.', unlocked: false });
  await page.route('**/api/user/achievements', route => route.fulfill({ json: { achievements: [
    ach('first_step', 'easy'), ach('mind_the_window', 'easy'), ach('golem_in_the_attic', 'medium'),
    ach('night_owl', 'medium'), ach('chalice_be_with_you', 'hard'), ach('veni_vidi_vici', 'extreme'), ach('other', 'easy'),
  ] } }));
  await page.reload();
  // The count in the texts is the real one, not a number written down once.
  await expect(page.locator('.guide-tile--ach .guide-tile__teaser')).toHaveText('7 achievements, and every one pays.');
  await page.locator('.guide-tile--ach').click();
  const win = page.locator('.guide-window--ach');
  await expect(win.locator('.guide-window__text')).toContainText('7 achievements, from your very first card');
  await expect(win.locator('.guide-ach__row')).toHaveCount(6);
  await settled(page);
  await win.locator('.guide-ach__row').nth(2).click();
  const modal = page.locator('.guide-detail .ach-modal');
  await expect(modal).toContainText('Name golem_in_the_attic');
  await modal.locator('.px-modal__close').click();
  await expect(modal).toHaveCount(0);
  await expect(win).toBeVisible();
  await win.getByRole('link', { name: /See all achievements/ }).click();
  await expect(page).toHaveURL(/\/achievements/);
});

test('packs demo: four packs open their detail, and a link opens Explore on the Packs filter', async ({ page }) => {
  const pack = (slug, name) => ({ slug, name, localizedNames: { cz: name, zh: name }, total: 10, collected: 0, labels: [], foil: '#8a6' });
  await page.route('**/api/packs', route => route.fulfill({ json: [
    pack('prague-castle', 'Prague Castle'), pack('vysehrad', 'Vyšehrad'), pack('old-town-square', 'Old Town Square'), pack('narodni-trida', 'Národní třída'), pack('karlin', 'Karlín'),
  ] }));
  await page.route('**/api/packs/*', route => route.fulfill({ json: { ...pack('vysehrad', 'Vyšehrad'), members: [], description: { en: 'A rock.' } } }));
  await page.reload();
  await page.locator('.guide-tile--packs').click();
  const win = page.locator('.guide-window--packs');
  await expect(win.locator('.guide-packs__pack .pack-card')).toHaveCount(4);
  await settled(page);
  await win.locator('.guide-packs__pack .pack-card').nth(1).click();
  const detail = page.locator('.pack-detail');
  await expect(detail).toBeVisible();
  await detail.locator('.px-modal__close').first().click();
  await expect(detail).toHaveCount(0);
  await expect(win).toBeVisible();
  await win.getByRole('link', { name: /See all packs/ }).click();
  await expect(page).toHaveURL(/\/explore/);
  await expect(page.getByRole('button', { name: 'Packs' })).toHaveAttribute('aria-pressed', 'true');
});

test('check-in demo: the button works once you are within 100 m', async ({ page }) => {
  await page.locator('.guide-tile--collect').click();
  const win = page.locator('.guide-window--demo');
  const collect = win.getByRole('button', { name: 'Collect' });
  await expect(collect).toBeDisabled();
  await settled(page);
  const map = await win.locator('.guide-checkin__map').boundingBox();
  await page.mouse.move(map.x + map.width * 0.25, map.y + map.height * 0.25);
  await page.mouse.down();
  await page.mouse.move(map.x + map.width * 0.53, map.y + map.height * 0.52, { steps: 8 });
  await page.mouse.up();
  await expect(win.locator('.guide-checkin__alert')).toBeVisible();
  await expect(collect).toBeEnabled();
  // The lock shakes even with card animations switched off in Settings.
  await page.evaluate(() => document.documentElement.setAttribute('data-card-motion', 'off'));
  const lock = win.locator('.guide-checkin__card .loc-card__lock');
  await expect.poll(() => lock.evaluate(el => `${getComputedStyle(el).animationName}/${getComputedStyle(el).animationPlayState}`)).toBe('nearby-wobble/running');
  await page.evaluate(() => document.documentElement.removeAttribute('data-card-motion'));
  // Tapping the shaking card collects it, like on Explore.
  await win.locator('.guide-checkin__card .loc-card').click();
  await expect(win.locator('.guide-checkin__status')).toContainText('Collected!');
  await shot(page, 'checkin');
});

test('hunt demo: walking brings clues, a miss drops two rungs, a find pays', async ({ page }) => {
  await page.locator('.guide-tile--hunt').click();
  const win = page.locator('.guide-window--demo');
  const slider = win.locator('.guide-hunt__slider input');
  const rung = win.locator('.hunt-ladder li.is-on .hunt-ladder__mult');
  await expect(rung).toHaveText('10×');
  await slider.fill(String(6000 - 2900)); // 2.9 km: the river bank comes free
  await expect(win.locator('.hunt-track__row.is-had .hunt-track__value')).toContainText('castle side');
  await win.getByRole('button', { name: "It's here!" }).click();
  await win.locator('.hunt-panel__confirm .px-btn--gold').click();
  await expect(rung).toHaveText('3×');
  await slider.fill(String(6000 - 50));
  await win.getByRole('button', { name: "It's here!" }).click();
  await win.locator('.hunt-panel__confirm .px-btn--gold').click();
  await expect(win.locator('.hunt-panel__flash')).toContainText('+150 XP');
  await shot(page, 'hunt');
});

test('install window: three sketches each for iPhone and Android, each with its step', async ({ page }) => {
  await page.locator('.guide-tile--install').click();
  const win = page.locator('.guide-window--install');
  await expect(win.locator('.guide-install__row').first().locator('.guide-install__step')).toHaveCount(3);
  await expect(win.locator('.guide-install__row--android .guide-install__step')).toHaveCount(3);
  await expect(win.locator('.guide-mock__hit')).toHaveCount(8);
  await expect(win.locator('.guide-install__caption').first()).toContainText('Safari');
  await shot(page, 'install');
});

test('other screens get the board too: four columns, two, one on phones', async ({ page }) => {
  const columns = () => page.locator('.guide-board__grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  for (const [w, h, n] of [[1920, 950, 4], [1000, 800, 2], [390, 844, 1]]) {
    await page.setViewportSize({ width: w, height: h });
    await expect(page.locator('.guide-tile')).toHaveCount(16);
    expect(await columns()).toBe(n);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(w);
  }
  // On a phone a tile still opens its window, demo under the text.
  await page.locator('.guide-tile--hunt').click();
  await expect(page.locator('.guide-window .guide-hunt')).toBeVisible();
});
