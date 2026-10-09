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
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
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
    if (!file || (/\.(scss|ts)$/.test(file) && !/(^|[\\/])projects\.ts$/.test(file))) return;
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
  // Extensionless paths resolve to their .html file, like Vercel's cleanUrls (/work/jobtrackr).
  if (!existsSync(filePath) && !extname(filePath) && existsSync(`${filePath}.html`)) filePath = `${filePath}.html`;
  if (!existsSync(filePath)) {
    response.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
    return;
  }
  const headers = {
    'Content-Type': types[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
    'Accept-Ranges': 'bytes',
  };
  const { size } = statSync(filePath);

  // Byte ranges: Safari won't play a video from a server that ignores them.
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range ?? '');
  if (range && (range[1] || range[2])) {
    // "bytes=-500" asks for the last 500 bytes; otherwise the end is optional.
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start > end || start >= size) {
      response.writeHead(416, { ...headers, 'Content-Range': `bytes */${size}` }).end();
      return;
    }
    response.writeHead(206, {
      ...headers,
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': end - start + 1,
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(filePath, { start, end }).pipe(response);
    return;
  }

  response.writeHead(200, { ...headers, 'Content-Length': size });
  if (request.method === 'HEAD') response.end();
  else createReadStream(filePath).pipe(response);
}).listen(PORT, () => {
  console.log(`\nServing dist/ at http://localhost:${PORT}${shouldWatch ? ' (watching src/)' : ''}\n`);
});
