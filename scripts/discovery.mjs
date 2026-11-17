import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE_ORIGIN = 'https://www.balogunoluwasogo.com';

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)]
    .map(([, name, , value]) => [name.toLowerCase(), value]));
}

const escapeXml = (value) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[character]);

/** Regenerate discovery files from the canonical URLs in the built HTML pages. */
export function writeDiscoveryFiles(directory) {
  const urls = new Set();

  function visit(folder) {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const file = join(folder, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'assets') visit(file);
      } else if (entry.name.endsWith('.html')) {
        const html = readFileSync(file, 'utf8');
        const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
        const meta = [...head.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag));
        if (meta.some((tag) => /^(robots|googlebot)$/i.test(tag.name ?? '')
          && /\b(noindex|none)\b/i.test(tag.content ?? ''))) continue;

        const canonical = [...head.matchAll(/<link\b[^>]*>/gi)]
          .map(([tag]) => attributes(tag))
          .find((tag) => /\bcanonical\b/i.test(tag.rel ?? ''));
        if (!canonical?.href) throw new Error(`Missing canonical URL in ${file}`);
        const url = new URL(canonical.href);
        if (url.origin !== SITE_ORIGIN || url.search || url.hash) {
          throw new Error(`Unexpected canonical URL in ${file}: ${canonical.href}`);
        }
        urls.add(url.href);
      }
    }
  }

  visit(directory);
  const entries = [...urls].sort().map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`);
  writeFileSync(join(directory, 'sitemap.xml'), [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n'));
  writeFileSync(join(directory, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
}
