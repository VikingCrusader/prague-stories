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

await page.evaluate(() => {
  const modal = document.querySelector('.px-modal');
  modal.scrollTop = modal.scrollHeight;
});
await page.waitForTimeout(1000);

const info = await page.evaluate(() => {
  const addedEl = [...document.querySelectorAll('*')].find(el => el.children.length === 0 && el.textContent && el.textContent.includes('Added at'));
  const modal = document.querySelector('.px-modal');
  const overlay = document.querySelector('.px-overlay');
  return {
    addedRect: addedEl.getBoundingClientRect(),
    addedComputed: { position: getComputedStyle(addedEl).position, transform: getComputedStyle(addedEl).transform },
    parentChain: (() => {
      let el = addedEl, chain = [];
      while (el && el !== document.body) {
        chain.push({ tag: el.tagName, cls: el.className, position: getComputedStyle(el).position });
        el = el.parentElement;
      }
      return chain;
    })(),
    modalScrollTop: modal.scrollTop,
    modalScrollHeight: modal.scrollHeight,
    modalClientHeight: modal.clientHeight,
    overlayScrollTop: overlay.scrollTop,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
