// Current build, iPhone SE landscape (667 x 375, touch): a screenshot with the
// controls, the same frame with the touch controls hidden, the controls' boxes,
// and UI coverage measured exactly as scripts/ux-capture.mjs does.
// node mobcap.js <port> <outDir>
const { chromium } = require('playwright');
const fs = require('fs');
const [port, out] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-proxy-server'] });
  const ctx = await browser.newContext({ viewport: { width: 667, height: 375 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    try {
      const raw = localStorage.getItem('dojang.settings.v1');
      const s = raw ? JSON.parse(raw) : {};
      localStorage.setItem('dojang.settings.v1', JSON.stringify({ ...s, quality: 'high', showPerf: false, volume: 0 }));
    } catch {}
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  await page.goto(`http://localhost:${port}/?start=normal&seed=7`);
  await page.waitForFunction(() => window.__dojang?.session?.ready, null, { timeout: 120000 });
  await page.waitForFunction(() => window.__dojang.session.world.phase === 'fight', null, { timeout: 120000 });
  await page.evaluate(() => new Promise((r) => { const w = window.__dojang.session.world; const t = w.tick; const id = setInterval(() => { if (w.tick - t > 240) { clearInterval(id); r(); } }, 50); }));
  // Freeze the fight so both screenshots show the same frame.
  await page.evaluate(() => { window.__dojang.session.paused = true; });
  await page.waitForTimeout(800);
  const data = await page.evaluate(() => {
    const W = innerWidth, H = innerHeight, G = 4;
    const sel = '.hud-top, .hud-status, .hud-mini, .tb, .tbtn, .kick-main, .wheel, .chip, .stick-base, .pts';
    const vis = (e) => { const cs = getComputedStyle(e); return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.05; };
    const boxes = [...document.querySelectorAll(sel)].filter(vis).map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0);
    let covered = 0, total = 0;
    for (let y = 0; y < H; y += G) for (let x = 0; x < W; x += G) { total++; if (boxes.some((b) => x >= b.left && x < b.right && y >= b.top && y < b.bottom)) covered++; }
    const named = [...document.querySelectorAll('.touch .tb, .touch .kick-main, .touch .tbtn, .touch .stick-base, .touch .cluster, .hud-top')].map((e) => {
      const r = e.getBoundingClientRect();
      return { cls: e.className, label: e.getAttribute('aria-label') || e.textContent.trim(), x: r.left, y: r.top, w: r.width, h: r.height, opacity: getComputedStyle(e).opacity };
    });
    return { uiCoverage: covered / total, boxes: named, scheme: document.querySelector('.touch')?.className };
  });
  console.log(JSON.stringify(data, null, 1));
  fs.writeFileSync(`${out}/se-current.json`, JSON.stringify(data, null, 2));
  await page.screenshot({ path: `${out}/se-current-controls.png` });
  await page.addStyleTag({ content: '.touch .tb, .touch .kick-main, .touch .tbtn, .touch .stick-base { visibility: hidden !important; }' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/se-current-clean.png` });
  await browser.close();
})();
