import { chromium, devices } from '@playwright/test';
const TOKEN = process.argv[2];
const iPhone = devices['iPhone 13'];
const browser = await chromium.launch();
const context = await browser.newContext({ ...iPhone });
await context.addInitScript((token) => localStorage.setItem('token', token), TOKEN);
const page = await context.newPage();
await page.goto('http://localhost:5173/explore');
await page.waitForSelector('.loc-card', { timeout: 20000 });
await page.locator('.navbar').screenshot({ path: 'C:/Users/Yiwen/AppData/Local/Temp/claude/E--prague-stories/0323243d-934c-40f8-a3da-921a02fb1692/scratchpad/navbar-crop.png' });
// dump bounding boxes of navbar children
const info = await page.evaluate(() => {
  const nav = document.querySelector('.navbar');
  const rects = [];
  nav.querySelectorAll('*').forEach(el => {
    if (el.children.length === 0 || el.classList.length) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) rects.push({ tag: el.tagName, cls: el.className, text: el.textContent?.slice(0,20), x: r.x, y: r.y, w: r.width, h: r.height });
    }
  });
  return { navRect: nav.getBoundingClientRect(), rects };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
