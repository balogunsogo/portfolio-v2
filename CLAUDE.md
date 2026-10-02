# CLAUDE.md — Portfolio V2.1

Context and rules for anyone (human or AI) working in this repo.

## What this is

Balogun Oluwasogo's personal portfolio: a home page and one case study (`/work/jobtrackr`, see "Case study" below). The home page is a single screen, built from the "Neue Montreal" board and the "Two halves" direction of the design canvas "iudoh.me Layout Variations". The layout is a restrained, lineless 12-column grid.

- **Top:** the name as display type, with the role line under it at about a third of the name's size.
- **Bottom of the viewport, left half:** "Featured work" and the project list, flush left under the name (columns 1–4).
- **Bottom of the viewport, right half:** an aside in columns 9–12 acts as the counterweight. It holds an analog clock for Lagos time beside the links (LinkedIn, GitHub, Contra, Email, in that order), and sits on the last project's line. The clock is a 96px inline SVG (`$clock-size`) with a thin ring, two hands, and the digital time and "GMT+1" on either side of the pivot; the time and "Lagos, Nigeria" remain as visually hidden text for screen readers. The ring is the one deliberate exception to the no-rules decoration rule.
- **Hover preview:** columns 9–12. It is hidden until a project is hovered or focused. While it shows, the aside fades out, using `.index:has(.preview.is-visible)` with no JS. It only exists on desktop pointers (`min-width: 1024px` with `hover: hover` and `pointer: fine`).
- **Project links:** open in a new tab (`target="_blank" rel="noopener"`), with a visually hidden "(opens in a new tab)" for screen readers. The preview label reads `[data-work-title]`, so that suffix never shows.
- **Description column (desktop):** columns 5–8, beside the list. On hover or focus it shows the project's type (muted, on the "Featured work" line) and a short description underneath, fading with the preview. Other list items dim to muted while one is active.
- **Mobile:** stacks the name, role and list. The aside sits below them: the clock on the left, links right-aligned on the right. Tapping a project opens a bottom sheet (`src/ts/modal.ts`) with title, type, image, description, "Visit site" and "Next: <project>". The sheet keeps one height for every project: all titles, types and descriptions are stacked in one grid cell per slot, so the longest sets the size. It closes via Close, the scrim, Escape or dragging the header down; opened from the keyboard, focus moves to Close, is trapped inside and returns to the project; opened by touch, the panel takes focus silently and no focus ring is drawn.
- **Project data:** lives in `src/ts/projects.ts` (title, `meta` type line, description, image, URL, optional `caseStudy`). The list, preview, description column and sheet all read from it.
- **Case-study links:** a project with `caseStudy` links there in the same tab from the desktop list (no `target`, no hidden suffix), and its sheet link reads "Read case study". Every other project keeps "Visit site" in a new tab.

## Stack (do not change without asking)

- Plain HTML (`src/index.html`, `src/work/*.html`), SCSS (`src/scss`, compiled by `sass`) and TypeScript (`src/ts`, compiled by `tsc` to ES modules).
- No framework, bundler, CSS framework or runtime dependencies. Tailwind is explicitly out.
- Build and dev tooling live in `scripts/*.mjs` and use only Node built-ins. They run the `sass` and `typescript` JS entry points directly, because the folder path has a space in it on Windows.

## Design rules

- **Typeface:** PP Neue Montreal, weight 400 for small text and 500 for display, list items and role. The fallback stack is in `$font-sans`.
- **Colour:** ground `#FAFAF8`, ink `#111110`, muted `#65635D`. There are no accent colours.
- **Decoration:** no rules or borders, no numbering, no italics. Spacing does the separating.
- **Type scale (desktop board at 1440):** name 136px, role 48px, projects 30px, meta 16px.
- **Type scale (mobile board at 390):** name 64px on two lines, role 24px on two lines, projects 28px, meta 15px.
- **Fluid sizes:** implemented with `clamp()` in `_layout.scss` and `_index.scss`.
- **Alignment rules that must hold on desktop:**
  - The GMT+1 line, the "Featured work" label and the top of the preview frame share one top edge (grid row 1).
  - The list's left edge matches the name's left edge, measured on the ink rather than the box. Lines are pulled left by their first glyph's side bearing (`$lsb-*` in `_tokens.scss`), so the B of the name, the S of the role and the F of "Featured work" sit on the same pixel column. A new line or project title that starts on a straight stem (B, D, F, N…) needs the same correction; use `.work__link--stem` for projects.
  - The aside's last line (the location and Contra) sits level with the last project. This is driven by `$work-pad-desktop`.
  - The project list hugs its longest title (`justify-self: start`).
- **Brand mark:** the `b.` wordmark from the Artifacts project (`balo.svg` / `public/favicon.svg` there). Copy it exactly and never redraw it. The favicon and touch icon are white on `#262626`. The share image is `#262626` on white.
- **Accessibility:**
  - Projects are real links, and focus shows the preview just as hover does.
  - The preview is `aria-hidden`.
  - Focus-visible outlines stay on.
  - Tap targets stay at 44px or more on mobile.
  - `prefers-reduced-motion` removes transitions.

## Conventions

- BEM-style class names (`block__element`), and `data-*` attributes for JS hooks. Never select on styling classes in TS.
- SCSS uses `@use` modules. Tokens and mixins live in `_tokens.scss`, so add values there before using them.
- TypeScript is strict. Imports inside `src/ts` use the `.js` extension so the emitted ES modules resolve in the browser.
- Keep changes scoped: no unrelated refactors, and preserve the existing structure and class names.

## Before handing work back

1. `npm run typecheck`
2. `npm run build`
3. Check 1440×900 and 390×844 on both pages, including the hover state and keyboard focus on the project list.
4. Summarise the files changed and the key decisions.

## Assets

- **Only web formats ship.** Fonts are served as `.woff2`, images as WebP (previews at 1200px, case-study images in two widths) and video as `.mp4`.
- **Build:** `copyStatic()` copies every `.html` under `src/` with its folder, plus `src/assets`. The dev server resolves extensionless paths to `.html` (like Vercel's `cleanUrls`) and answers `Range` requests, which Safari needs for video.
- **Raw sources stay in `src/assets` but are never deployed.** That means the `.otf` fonts and the full-size `.png` exports. They're filtered out by `SOURCE_ONLY` in `scripts/shared.mjs` and git-ignored.
- **Fonts in the repo:** the two PP Neue Montreal `.woff2` files are committed (Oluwasogo's call) so the Vercel build includes them. The `.otf` originals stay git-ignored.
- **Deploy:** Vercel builds `main` using `vercel.json` (`npm ci`, `npm run build`, output `dist`). Don't add a framework preset.

## Case study (`/work/jobtrackr`)

Spec: `docs/handoff/jobtrackr/README.md`. Pixel targets: `reference/desktop.html` at 1440×900 and `reference/mobile.html` at 390×844. The reference wins on appearance at those two widths; the handoff README wins on behaviour.

- **Files:** `src/work/jobtrackr.html`, `src/scss/_case.scss`, `src/ts/media.ts`. The page uses root-absolute URLs (`/assets/...`). `main.ts` runs on both pages and skips whatever a page doesn't have.
- **Copy:** final and checked against the product. Don't change it, and don't add sections, claims, metrics or testimonials.
- **Layout:** one column below 1024px (text capped at `$measure` on tablets), the 12-column grid from 1024px. Sections are 104px apart on mobile and 160px on desktop. Body, labels, captions and spacing are fixed; only the display, subtitle and heading sizes are fluid.
- **Fluid sizes:** the slopes are exact fractions (`calc(10vw / 3)`, not `3.3333vw`) so sizes land on whole pixels at 390 and 1440. A size of 47.9995px shifts glyph spacing in Chrome and breaks the pixel match.
- **Never size anything with `100vw`.** There must be no horizontal scroll from 320 to 2560px, including with classic scrollbars.
- **Optical left edge:** every line in the display, heading, statement, list-item and label styles carries the modifier for its first glyph (`.case-h--stem`, `.case-label--round`, `.case-item--s`…; tokens `$lsb-*`). Lines starting on A, body copy, captions and diagram text get none. If a line's first word changes, its modifier changes with it.
- **Tokens added for this page:** `$status-*` (dots only, always beside the status name), `$diagram-*`, `$plate-video`, `$plate-clip`, `$measure`, `$bp-diagram-wide`, `$clock-size-case-mobile`, the extra `$lsb-*` values, and the `below-desktop` and `visually-hidden` mixins.
- **Decoration:** the home rules hold. The only lines on the page are the diagram connectors and the clock ring.
- **Diagrams:** inlined from `docs/handoff/jobtrackr/diagrams/` without their `<metadata>` block, otherwise untouched. Wide versions show from 1280px (max 1312px), tall versions below (max 440px). The hidden one is `display: none`. Keep each SVG's `role="img"`, `<title>` and unique IDs.
- **Video:** the markup is `<video muted loop playsinline preload="none" poster data-case-video>` with no `autoplay`, followed by a `<button data-case-video-toggle hidden>`. `media.ts` plays a video while at least 25% of it is visible and pauses it when it leaves. With `prefers-reduced-motion` nothing starts on its own. The button ("Pause video" / "Play video") is visually hidden until focused, and clicking the video toggles it too. A video the person paused stays paused.
- **Images:** `width` and `height` on every `<img>`, `srcset` with two widths, and `loading="lazy" decoding="async"` except the hero (`fetchpriority="high"`).
- **Analytics pair:** the laptop image's ratio is `2266 / 1512` (3:2, rounded to the board's 504px at 1440). The phone image fills the same row.
- **Footer:** the home page's clock markup and classes, at 88px below desktop, with proportional figures as on the board. "Next project" links to Acetrail's live site (the same URL as in `projects.ts`) until it has a case study.
- **Media files are final:** don't regenerate, recompress or re-cut them. The screen recording was cut to leave out a third party's email address, so never re-cut it from the raw file.
- **Checks:** the acceptance list in the handoff README §13: the screenshot diff against both reference pages with reduced motion, the overflow sweep with real scrollbars, keyboard order and motion.

## Open items

None right now.
