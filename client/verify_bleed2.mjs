import { chromium, devices } from '@playwright/test';
const TOKEN = process.argv[2];
const iPhone = devices['iPhone 13'];
const browser = await chromium.launch();
const context = await browser.newContext({ ...iPhone, permissions: ['geolocation'], geolocation: { latitude: 50.090576035199966, longitude: 14.40051081204455 } });
await context.addInitScript((token) => localStorage.setItem('token', token), TOKEN);
const page = await context.newPage();
await page.goto('http://localhost:5173/explore');
await page.waitForSelector('.loc-card', { timeout: 20000 });
await page.locator('.filter-bar__search').fill('Velká jižní věž');
await page.waitForTimeout(500);
await page.locator('.loc-card').first().click();
await page.waitForSelector('.px-modal', { timeout: 10000 });
await page.waitForTimeout(1000);

// Scroll the modal's own overflow container directly, instantly, no animation
await page.evaluate(() => {
  const modal = document.querySelector('.px-modal');
  modal.scrollTop = modal.scrollHeight; // scroll all the way down
});
await page.waitForTimeout(1000); // generous settle time

await page.screenshot({ path: 'C:/Users/Yiwen/AppData/Local/Temp/claude/E--prague-stories/0323243d-934c-40f8-a3da-921a02fb1692/scratchpad/bleed-check2.png' });

const rects = await page.evaluate(() => {
  const overlay = document.querySelector('.px-overlay');
  const navbar = document.querySelector('.navbar');
  return {
    overlayRect: overlay.getBoundingClientRect(),
    navbarRect: navbar.getBoundingClientRect(),
    overlayBg: getComputedStyle(overlay).backgroundColor,
    overlayZ: getComputedStyle(overlay).zIndex,
    navbarZ: getComputedStyle(navbar).zIndex,
  };
});
console.log(JSON.stringify(rects, null, 2));

await browser.close();
