# Portfolio V2.1

A single-page portfolio for Balogun Oluwasogo, built with plain HTML, SCSS and TypeScript.
There is no framework and no bundler: Sass compiles the styles, `tsc` compiles the scripts, and a small Node script serves everything during development.

## Getting started

```bash
npm install
npm run dev        # builds to dist/, watches src/, serves http://localhost:5173
```

| Script              | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | Dev build with source maps, file watching and a local server        |
| `npm run build`     | Production build into `dist/` (compressed CSS, compiled JS)         |
| `npm run typecheck` | Type-checks `src/ts` without emitting                               |
| `npm run preview`   | Serves a one-off build without watching                             |

## Deploying

The site is deployed on Vercel from the `main` branch. `vercel.json` pins the settings:

- **Install:** `npm ci`
- **Build:** `npm run build`
- **Output:** `dist/`
- **Headers:** long-lived cache for fonts, a week for images, and revalidation for CSS/JS (their filenames aren't hashed).

Every push to `main` deploys to production.

## Structure

```
src/
  index.html            page markup (copied to dist/ as is)
  assets/
    favicon.svg / .ico  b. wordmark (white on #262626, from the Artifacts project)
    apple-touch-icon.png
    og-image.png        1200×630 share image, b. wordmark
    fonts/              PP Neue Montreal .woff2 files go here (not committed)
    images/projects/    featured-work preview images
  scss/
    main.scss           entry, only @use statements
    _tokens.scss        colours, type stack, grid, breakpoints, mixins
    _fonts.scss         @font-face for PP Neue Montreal
    _base.scss          reset, body, links, reduced motion
    _layout.scss        page shell and intro (name + role)
    _index.scss         featured work, hover preview, time, links
  ts/
    main.ts             entry, wires up the modules
    clock.ts            live Lagos time (GMT+1)
    preview.ts          hover / focus preview for featured work
scripts/                build + dev server (Node only, no dependencies)
```

## Assets

- **Fonts:** `src/assets/fonts/` holds the licensed PP Neue Montreal files. The site loads `PPNeueMontreal-Book.woff2` (400) and `PPNeueMontreal-Medium.woff2` (500). The `.otf` originals stay in the folder but are not deployed.
- **Project images:** `src/assets/images/projects/` keeps the full-size PNG exports for editing. The site loads 1200px-wide WebP versions (`<slug>.webp`, 20–180KB each) through `data-preview-src` in `index.html`. The PNGs are not deployed.
- **Adding or replacing an image:** export a 1200px-wide WebP at quality 80, name it in lowercase kebab-case, and point the project's `data-preview-src` at it.
- **Excluded from the build:** `.otf`, `.ttf`, `.psd`, `.fig` and `.gitkeep` files, plus the `.png` exports under `images/`, are never copied to `dist/` (see `SOURCE_ONLY` in `scripts/shared.mjs`). PNGs at the assets root (the share image and touch icon) do ship.
- **Wordmark:** the `b.` in the favicon, touch icon and share image is the exact mark from the Artifacts project (`balo.svg`). Don't redraw it.
- **Git:** the `.woff2` fonts are committed so Vercel can build with them; the `.otf` originals and the PNG exports are git-ignored.

## Content

- **Projects:** each project link in `index.html` points to its live site and opens in a new tab.
- **Links:** LinkedIn, GitHub, Contra and Email (`mailto:balogunoluwasogo@gmail.com`).
