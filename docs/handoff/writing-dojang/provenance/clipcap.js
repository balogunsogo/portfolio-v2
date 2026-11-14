// node clipcap.js <port> <outDir> [every=1] [w] [h]
const { chromium } = require('playwright');
const fs = require('fs');
const [port, out, everyArg = '1', w = '1280', h = '720'] = process.argv.slice(2);
const every = Number(everyArg);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-proxy-server'] });
  const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) } });
  page.on('console', (m) => { if (m.type() === 'error') console.log('console:', m.text()); });
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  await page.goto(`http://localhost:${port}/?lab=clip&w=${w}&h=${h}`);
  await page.waitForFunction(() => window.__clip && window.__clip.ready, null, { timeout: 120000 });
  const box = await page.evaluate(() => { const r = document.querySelector('canvas').getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
  console.log('box', JSON.stringify(box));
  const t0 = Date.now();
  let n = 0;
  for (;;) {
    const more = await page.evaluate(() => window.__clip.frame());
    if (n % every === 0) {
      await page.screenshot({ path: `${out}/f${String(n).padStart(5, '0')}.png`, clip: box });
    }
    n++;
    if (!more || n > 2000) break;
  }
  const log = await page.evaluate(() => window.__clip.log);
  console.log(JSON.stringify({ frames: n, secs: (Date.now() - t0) / 1000, log }));
  await browser.close();
})();
