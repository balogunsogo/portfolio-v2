# Portfolio V2.1

A portfolio for Balogun Oluwasogo, built with plain HTML, SCSS and TypeScript: the home page and two case studies (`/work/jobtrackr` and `/work/acetrail`).
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
- **Headers:** long-lived cache for fonts, a week for images and video, and revalidation for CSS/JS (their filenames aren't hashed).
- **Routes:** `cleanUrls` serves every page without its extension, so `src/work/jobtrackr.html` is `/work/jobtrackr` and `src/work/acetrail.html` is `/work/acetrail`. The dev server does the same.

Every push to `main` deploys to production.

## Structure

```
src/
  index.html            home page markup (copied to dist/ as is)
  work/
    jobtrackr.html      JobTrackr case study, served at /work/jobtrackr
    acetrail.html       Acetrail case study, served at /work/acetrail
  assets/
    favicon.svg / .ico  b. wordmark (white on #262626, from the Artifacts project)
    apple-touch-icon.png
    og-image.png        1200×630 share image, b. wordmark
    fonts/              PP Neue Montreal .woff2 files (committed), plus Figtree for the Acetrail case study
    images/projects/    featured-work preview images
    images/case/        case-study images (webp, two widths each), video posters and share images
    video/              case-study videos (mp4, h.264, no audio)
  scss/
    main.scss           entry, only @use statements
    _tokens.scss        colours, type stack, grid, breakpoints, mixins
    _fonts.scss         @font-face for PP Neue Montreal, and Figtree for the Acetrail specimen
    _base.scss          reset, body, links, reduced motion
    _layout.scss        page shell and intro (name + role)
    _index.scss         featured work, hover preview, description column, bottom sheet, time, links
    _case.scss          case-study pages: shell, type, text blocks, media, diagrams, comparisons, charts, footer
  ts/
    main.ts             entry, wires up the modules a page has
    clock.ts            live Lagos time (GMT+1), on every page
    media.ts            case-study videos: play in view only, pause toggle, reduced motion
    projects.ts         project data (title, type, description, image, URL, case study) and list rendering
    preview.ts          desktop hover / focus preview and description column
    modal.ts            mobile bottom sheet (initProjectSheet)
scripts/                build + dev server (Node only, no dependencies)
docs/handoff/           implementation handoffs (spec, reference pages, diagrams); never deployed
```

## Assets

- **Fonts:** `src/assets/fonts/` holds the licensed PP Neue Montreal files. The site loads `PPNeueMontreal-Book.woff2` (400) and `PPNeueMontreal-Medium.woff2` (500). The `.otf` originals stay in the folder but are not deployed. `figtree-latin-wght.woff2` is Ace Trail's own typeface (SIL Open Font License), used only for the type specimen on the Acetrail case study.
- **Project images:** `src/assets/images/projects/` keeps the full-size PNG exports for editing. The site loads 1200px-wide WebP versions (`<slug>.webp`, 20–180KB each) through each project's `image` in `src/ts/projects.ts`. The PNGs are not deployed.
- **Adding or replacing an image:** export a 1200px-wide WebP at quality 80, name it in lowercase kebab-case, and point the project's `image` in `projects.ts` at it.
- **Case-study media:** `src/assets/images/case/<project>/` and `src/assets/video/<project>/`. Large images come in two widths for `srcset`, and each video has a poster. They are final: don't regenerate, recompress or re-cut them. The JobTrackr screen recording was cut to leave out a third party's email address.
- **Diagrams:** the four JobTrackr diagrams are inlined in `src/work/jobtrackr.html` from `docs/handoff/jobtrackr/diagrams/`, without the files' content-credentials `<metadata>` block. The `.dg-*` classes in `_case.scss` style them.
- **Excluded from the build:** `.otf`, `.ttf`, `.psd`, `.fig` and `.gitkeep` files, plus the `.png` exports under `images/`, are never copied to `dist/` (see `SOURCE_ONLY` in `scripts/shared.mjs`). PNGs at the assets root (the share image and touch icon) do ship.
- **Wordmark:** the `b.` in the favicon, touch icon and share image is the exact mark from the Artifacts project (`balo.svg`). Don't redraw it.
- **Git:** the `.woff2` fonts are committed so Vercel can build with them; the `.otf` originals and the PNG exports are git-ignored.

## Content

- **Projects:** each project link on the home page points to its live site and opens in a new tab. A project with `caseStudy` set in `projects.ts` (JobTrackr and Acetrail) links to its case study in the same tab instead, and the mobile sheet's link reads "Read case study".
- **Pages:** any `.html` file under `src/` is copied to `dist/` with its folder. Pages below the root use root-absolute URLs (`/assets/...`).
- **Case studies:**
  - **JobTrackr** (built): the spec and pixel targets are in `docs/handoff/jobtrackr/`. The copy is final and was checked against the product.
  - **Acetrail** (built): the spec, pixel targets and implementation prompt are in `docs/handoff/acetrail/`. The copy is final and its facts were checked against the Ace Trail repo and the live site; the Performance numbers are a PageSpeed measurement from 2 October 2026.
  - **Order:** each case study's footer links to the next project in the home list. JobTrackr's goes to `/work/acetrail`; Acetrail's goes to All That Is Kim's live site in a new tab, until that project has a case study.
- **Links:** LinkedIn, GitHub, Contra and Email (`mailto:balogunoluwasogo@gmail.com`).
