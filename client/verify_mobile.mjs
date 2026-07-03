import { chromium, devices } from '@playwright/test';

const TOKEN = process.argv[2];
const iPhone = devices['iPhone 13'];
const OUT = 'C:/Users/Yiwen/AppData/Local/Temp/claude/E--prague-stories/0323243d-934c-40f8-a3da-921a02fb1692/scratchpad';

const browser = await chromium.launch();
const context = await browser.newContext({
  ...iPhone,
  permissions: ['geolocation'],
  geolocation: { latitude: 50.090576035199966, longitude: 14.40051081204455 },
});
await context.addInitScript((token) => localStorage.setItem('token', token), TOKEN);
const page = await context.newPage();
const errors = [];
page.on('pageerror', (err) => errors.push(err.message));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

// 1. Explore grid
await page.goto('http://localhost:5173/explore');
await page.waitForSelector('.loc-card', { timeout: 20000 });
await page.screenshot({ path: `${OUT}/m1-explore.png`, fullPage: false });
await page.screenshot({ path: `${OUT}/m1-explore-full.png`, fullPage: true });

// 2. Location detail modal
await page.locator('.filter-bar__search').fill('Velká jižní věž');
await page.waitForTimeout(500);
await page.locator('.loc-card').first().click();
await page.waitForSelector('.px-modal', { timeout: 10000 });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/m2-detail-top.png` });
await page.locator('.px-modal .loc-card__labels').scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/m3-detail-mid.png` });
await page.locator('.px-modal .px-btn--outline, .px-modal button:has-text("Edit")').first().scrollIntoViewIfNeeded().catch(() => {});
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/m4-detail-bottom.png` });
await page.keyboard.press('Escape').catch(() => {});
await page.locator('.px-modal__close').click().catch(() => {});
await page.waitForTimeout(300);

// 3. Map page + sidebar
await page.goto('http://localhost:5173/map');
await page.waitForSelector('path.leaflet-interactive', { timeout: 15000 });
await page.screenshot({ path: `${OUT}/m5-map.png`, fullPage: true });
try {
  await page.locator('path.leaflet-interactive').first().click({ force: true, timeout: 5000 });
  await page.waitForTimeout(800);
} catch (e) {
  console.log('Map marker click failed:', e.message.split('\n')[0]);
}
await page.screenshot({ path: `${OUT}/m6-map-sidebar.png`, fullPage: true });

// 4. Dashboard
await page.goto('http://localhost:5173/dashboard');
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/m7-dashboard.png`, fullPage: true });

// 5. Guide
await page.goto('http://localhost:5173/guide');
await page.waitForTimeout(1000);
await page.screenshot({ path: `${OUT}/m8-guide.png`, fullPage: true });

// 6. Login page (logged out view)
await page.evaluate(() => localStorage.removeItem('token'));
await page.goto('http://localhost:5173/login');
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/m9-login.png` });

console.log('Console/page errors captured:', errors.length);
errors.forEach(e => console.log(' -', e));

await browser.close();
