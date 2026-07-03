import { chromium, devices } from '@playwright/test';
const TOKEN = process.argv[2];
const iPhone = devices['iPhone 13'];
const browser = await chromium.launch();
const context = await browser.newContext({ ...iPhone });
await context.addInitScript((token) => localStorage.setItem('token', token), TOKEN);
const page = await context.newPage();
await page.goto('http://localhost:5173/explore');
await page.waitForSelector('.loc-card', { timeout: 20000 });
const info = await page.evaluate(() => {
  const vw = window.innerWidth;
  const get = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { fontSize: cs.fontSize, display: cs.display, flexWrap: cs.flexWrap, padding: cs.padding };
  };
  return {
    innerWidth: vw,
    navbar: get('.navbar'),
    logo: get('.navbar__logo'),
    langTab: get('.lang-tab'),
    btnSm: get('.px-btn--sm'),
    navUser: get('.navbar__user'),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
