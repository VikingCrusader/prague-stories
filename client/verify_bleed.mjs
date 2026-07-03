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
await page.waitForTimeout(500);

const before = await page.evaluate(() => {
  const overlay = document.querySelector('.px-overlay');
  const modal = document.querySelector('.px-modal');
  return {
    bodyScrollY: window.scrollY,
    overlayPos: getComputedStyle(overlay).position,
    overlayOverflow: getComputedStyle(overlay).overflow,
    modalOverflow: getComputedStyle(modal).overflowY,
    modalMaxHeight: getComputedStyle(modal).maxHeight,
    modalHeight: modal.getBoundingClientRect().height,
    bodyOverflow: getComputedStyle(document.body).overflow,
  };
});
console.log('BEFORE scroll:', JSON.stringify(before, null, 2));

await page.locator('.px-modal .loc-card__labels').scrollIntoViewIfNeeded();
await page.waitForTimeout(300);

const after = await page.evaluate(() => {
  const overlay = document.querySelector('.px-overlay');
  const modal = document.querySelector('.px-modal');
  const addedEls = [...document.querySelectorAll('*')].filter(el => el.children.length === 0 && el.textContent && el.textContent.includes('Added at'));
  return {
    bodyScrollY: window.scrollY,
    overlayScrollTop: overlay.scrollTop,
    modalScrollTop: modal.scrollTop,
    addedElsCount: addedEls.length,
    addedElsRects: addedEls.map(el => el.getBoundingClientRect()),
  };
});
console.log('AFTER scroll:', JSON.stringify(after, null, 2));

await page.screenshot({ path: 'C:/Users/Yiwen/AppData/Local/Temp/claude/E--prague-stories/0323243d-934c-40f8-a3da-921a02fb1692/scratchpad/bleed-check.png' });
await browser.close();
