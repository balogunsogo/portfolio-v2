// Shared build helpers used by build.mjs and dev.mjs. No dependencies beyond Node.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const src = join(root, 'src');
export const dist = join(root, 'dist');

// Run the tools' JS entry points with the current Node binary. This avoids shell
// quoting problems on Windows (the project folder name contains a space).
const entries = {
  sass: join(root, 'node_modules', 'sass', 'sass.js'),
  tsc: join(root, 'node_modules', 'typescript', 'bin', 'tsc'),
};

export function clean() {
  rmSync(dist, { recursive: true, force: true });
  mkdirSync(dist, { recursive: true });
}

// Source-only files that live in src/assets for editing but must never ship:
// desktop font formats (.otf/.ttf — only .woff2 is served), design files, placeholder
// .gitkeep files, and the full-size PNG exports in images/ (the site serves optimised
// .webp versions). PNGs at the assets root — og-image, touch icon — do ship.
const SOURCE_ONLY = /(\.(otf|ttf|psd|fig)|\.gitkeep|[\\/]images[\\/].*\.png)$/i;

/** Copies web-ready static files (HTML, woff2 fonts, webp/svg images) from src/ into dist/. */
export function copyStatic() {
  mkdirSync(dist, { recursive: true });
  cpSync(join(src, 'index.html'), join(dist, 'index.html'));
  const assets = join(src, 'assets');
  if (existsSync(assets)) {
    cpSync(assets, join(dist, 'assets'), {
      recursive: true,
      filter: (path) => !SOURCE_ONLY.test(path),
    });
  }
}

/** Runs a local binary (sass, tsc). Resolves on exit code 0, rejects otherwise. */
export function run(name, args, { wait = true } = {}) {
  if (!existsSync(entries[name])) {
    throw new Error(`${name} is not installed. Run "npm install" first.`);
  }
  const child = spawn(process.execPath, [entries[name], ...args], { cwd: root, stdio: 'inherit' });
  if (!wait) return child;
  return new Promise((resolvePromise, reject) => {
    child.on('exit', (code) =>
      code === 0 ? resolvePromise() : reject(new Error(`${name} exited with code ${code}`))
    );
  });
}

export const sassArgs = ['src/scss/main.scss', 'dist/assets/css/main.css'];
