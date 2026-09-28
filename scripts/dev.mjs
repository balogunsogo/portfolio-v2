// Dev server: builds into dist/, watches src/, and serves dist/ on http://localhost:5173.
// Pass --no-watch to serve a one-off build (used by `npm run preview`).
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync, watch } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { clean, copyStatic, dist, run, sassArgs, src } from './shared.mjs';

const PORT = Number(process.env.PORT) || 5173;
const shouldWatch = !process.argv.includes('--no-watch');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.map': 'application/json',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

clean();
copyStatic();
await run('sass', [...sassArgs, '--embed-source-map']);
await run('tsc', ['--project', 'tsconfig.json']);

if (shouldWatch) {
  run('sass', [...sassArgs, '--embed-source-map', '--watch'], { wait: false });
  run('tsc', ['--project', 'tsconfig.json', '--watch', '--preserveWatchOutput'], { wait: false });

  // Re-copy HTML and assets when they change (SCSS/TS are handled by their own watchers).
  let pending;
  watch(src, { recursive: true }, (_event, file) => {
    if (!file || /\.(scss|ts)$/.test(file)) return;
    clearTimeout(pending);
    pending = setTimeout(() => {
      copyStatic();
      console.log(`[copy] ${file}`);
    }, 50);
  });
}

createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://localhost:${PORT}`);
  let filePath = normalize(join(dist, decodeURIComponent(url.pathname)));
  if (!filePath.startsWith(dist)) {
    response.writeHead(403).end();
    return;
  }
  if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
  if (!existsSync(filePath)) {
    response.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
    return;
  }
  response.writeHead(200, {
    'Content-Type': types[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  createReadStream(filePath).pipe(response);
}).listen(PORT, () => {
  console.log(`\nServing dist/ at http://localhost:${PORT}${shouldWatch ? ' (watching src/)' : ''}\n`);
});
