# CLAUDE.md — Portfolio V2.1

Context and rules for anyone (human or AI) working in this repo.

## What this is

Balogun Oluwasogo's personal portfolio: a home page and four case studies (`/work/jobtrackr`, `/work/acetrail`, `/work/artifacts` and `/work/now-playing`, see "Case studies" below). The home page is a single screen, built from the "Neue Montreal" board and the "Two halves" direction of the design canvas "iudoh.me Layout Variations". The layout is a restrained, lineless 12-column grid.

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
3. Check 1440×900 and 390×844 on every page, including the hover state and keyboard focus on the project list.
4. Summarise the files changed and the key decisions.

## Assets

- **Only web formats ship.** Fonts are served as `.woff2`, images as WebP (previews at 1200px, case-study images in two widths) and video as `.mp4`.
- **Build:** `copyStatic()` copies every `.html` under `src/` with its folder, plus `src/assets`. The dev server resolves extensionless paths to `.html` (like Vercel's `cleanUrls`) and answers `Range` requests, which Safari needs for video.
- **Raw sources stay in `src/assets` but are never deployed.** That means the `.otf` fonts and the full-size `.png` exports. They're filtered out by `SOURCE_ONLY` in `scripts/shared.mjs` and git-ignored.
- **Fonts in the repo:** the two PP Neue Montreal `.woff2` files are committed (Oluwasogo's call) so the Vercel build includes them. The `.otf` originals stay git-ignored.
- **Deploy:** Vercel builds `main` using `vercel.json` (`npm ci`, `npm run build`, output `dist`). Don't add a framework preset.

## Case studies (`/work/jobtrackr`, `/work/acetrail`, `/work/artifacts`, `/work/now-playing`)

Specs: `docs/handoff/jobtrackr/README.md`, `docs/handoff/acetrail/README.md`, `docs/handoff/artifacts/README.md` and `docs/handoff/now-playing/README.md`. Pixel targets: each handoff's `reference/desktop.html` at 1440×900 and `reference/mobile.html` at 390×844. The reference wins on appearance at those two widths; the handoff README wins on behaviour.

The rules below apply to all four pages unless a bullet names one. Acetrail reuses JobTrackr's shell, type, grid, text blocks, video behaviour, process, stack, outcome and footer; what it adds is listed under "Acetrail only". Artifacts reuses all of that plus Acetrail's plates, comparison pairs, lists, scores and timing chart; what it adds is under "Artifacts only". Now Playing adds nothing: it is built only from the other pages' classes, as mapped under "Now Playing only".

- **Files:** `src/work/jobtrackr.html`, `src/work/acetrail.html`, `src/work/artifacts.html`, `src/work/now-playing.html`, `src/scss/_case.scss`, `src/ts/media.ts`. The pages use root-absolute URLs (`/assets/...`). `main.ts` runs on every page and skips whatever a page doesn't have.
- **Shared SCSS:** a change to `_case.scss` must not move anything on any of the four pages. Re-run all four pixel diffs after touching it.
- **Copy:** final and checked against the product. Don't change it, and don't add sections, claims, metrics or testimonials.
- **Layout:** one column below 1024px (text capped at `$measure` on tablets), the 12-column grid from 1024px. Sections are 104px apart on mobile and 160px on desktop. Body, labels, captions and spacing are fixed; only the display, subtitle and heading sizes are fluid.
- **Fluid sizes:** the slopes are exact fractions (`calc(10vw / 3)`, not `3.3333vw`) so sizes land on whole pixels at 390 and 1440. A size of 47.9995px shifts glyph spacing in Chrome and breaks the pixel match.
- **Never size anything with `100vw`.** There must be no horizontal scroll from 320 to 2560px, including with classic scrollbars.
- **Optical left edge:** every line in the display, subtitle, heading, statement, list-item and label styles carries the modifier for its first glyph (`.case-h--stem`, `.case-subtitle--t`, `.case-label--round`, `.case-item--s`…; tokens `$lsb-*`). M uses the stem modifier. Lines starting on A, body copy, captions and diagram text get none. If a line's first word changes, its modifier changes with it.
- **Tokens added for these pages:** `$acetrail-*` and `$font-acetrail` (Ace Trail's palette and typeface, for the swatches and specimen only), `$status-*` (dots only, always beside the status name), `$diagram-*`, `$plate-video`, `$plate-clip`, `$measure`, `$bp-diagram-wide`, `$clock-size-case-mobile`, the extra `$lsb-*` values, and the `below-desktop` and `visually-hidden` mixins.
- **Decoration:** the home rules hold. The only lines on the pages are the diagram connectors and the clock ring.
- **Diagrams:** inlined from `docs/handoff/jobtrackr/diagrams/` without their `<metadata>` block, otherwise untouched. Wide versions show from 1280px (max 1312px), tall versions below (max 440px). The hidden one is `display: none`. Keep each SVG's `role="img"`, `<title>` and unique IDs.
- **Video:** the markup is `<video muted loop playsinline preload="none" poster data-case-video>` with no `autoplay`, followed by a `<button data-case-video-toggle hidden>`. `media.ts` plays a video while at least 25% of it is visible and pauses it when it leaves. With `prefers-reduced-motion` nothing starts on its own. The button ("Pause video" / "Play video") is visually hidden until focused, and clicking the video toggles it too. A video the person paused stays paused.
- **Images:** `width` and `height` on every `<img>`, `srcset` with two widths, and `loading="lazy" decoding="async"` except the hero (`fetchpriority="high"`).
- **Analytics pair:** the laptop image's ratio is `2266 / 1512` (3:2, rounded to the board's 504px at 1440). The phone image fills the same row.
- **Footer:** the home page's clock markup and classes, at 88px below desktop, with proportional figures as on the board.
- **Linking:** the chain is a loop: JobTrackr → Acetrail → Artifacts → Now Playing → JobTrackr. Each "Next project" link goes to the next case study in the same tab, with no `target`, `rel` or hidden suffix. All That Is Kim has no case study (its site is about to be redesigned), so the chain skips it and the home page keeps linking to its live site in a new tab. If it gets one, it slots in between Acetrail and Artifacts, following the home list. Every top bar links to `/`.
- **Media files are final:** don't regenerate, recompress or re-cut them. The screen recording was cut to leave out a third party's email address, so never re-cut it from the raw file.
- **Checks:** the acceptance lists in the handoff READMEs (JobTrackr §13, Acetrail §11, Artifacts §11, Now Playing §11): the screenshot diff against both reference pages with reduced motion, the overflow sweep with real scrollbars, keyboard order, motion and linking.
- **Running the screenshot diff:** the references always load the largest image, while the pages pick from `srcset`, so serve the largest file to both before comparing; otherwise the photos differ by resampling. Chrome repeats the top of a page past 16384px in one screenshot, and the JobTrackr, Acetrail and Artifacts desktop pages are taller than that, so capture the lower part separately from a fresh page load. (A second screenshot of the same page load comes out a few pixels off, so don't reuse the page.) Now Playing's desktop page (14085px) fits in one capture. Run one browser at a time and make sure the machine has memory to spare: when it is short, Chrome leaves a large photo blank or changes how text and video posters are antialiased, in different places on each run.

### Acetrail only

- **Copy and facts:** final. The product is "Acetrail" in the title and "Ace Trail Tutors" or "Ace Trail" in the prose, on purpose. The Performance numbers are a dated PageSpeed measurement (2 October 2026): don't change them without re-running it and updating the date.
- **Section gaps:** the `directions`, `hero-scroll`, `classes`, `results`, `engineering` and `performance` entries in `$case-section-gaps`.
- **Captions:** 12px under the media on desktop as well as mobile (`.case-figure--snug`). JobTrackr's figures keep 16px.
- **Plates:** all `$plate-clip`. `.case-plate` is the large one (16 / 64px); `.case-plate--medium` is 12 / 32px and `.case-plate--small` is 10 / 24px.
- **Hero image:** a `<picture>` that switches at 1024px with the layout: the phone photo at 4:5 below, the laptop photo at 3:2 from it, each with its own `object-position` (`.case-media--hero-acetrail`). One alt covers both.
- **`.case-compare`:** before / after pair. Two columns from 320px (12px gap), columns 1–6 and 7–12 on desktop, capped at `$measure` on tablets. `--stack` (Results) is one column below desktop. The Context pair uses a `<picture>` per side (phone screenshots below desktop, desktop screenshots from it) and a short and a long caption (`.case-below-desktop`, `.case-from-desktop`).
- **`.case-options`:** the four directions, two per row, in small plates.
- **`.case-system`:** label, swatches (`.case-swatches`, hex labels are text and the colour blocks are `aria-hidden`) and the Figtree specimen. The specimen is 48px at 390 and 112px at 1440. Below desktop it breaks after "the"; on desktop it stays on one line and its clamp shrinks it 9px per 100px so it still fits columns 1–9 at 1024. Figtree isn't preloaded.
- **`.case-timing`:** the scroll timing chart, in HTML. Its fades are `.case-timing__fill--out` (0 to 55.6%) and `--in` (60% to 100%); keep those positions exactly. `role="img"` with the label; everything inside is `aria-hidden`. The fades end on the ink at alpha 0. It never animates. Beside the phone recording on desktop (`.case-scroll`), under it on mobile.
- **`.case-lists`:** the Engineering Before / After lists, `<ul>`s labelled by their headings.
- **`.case-scores`:** a `<dl>` where each name comes first in the markup and `column-reverse` draws the value above it, so screen readers hear "Performance, 100".
- **Video:** five videos, all with the standard markup and toggle. `media.ts` is unchanged.

### Artifacts only

- **Copy and facts:** final, checked against the Artifacts repo at `1d810e5` and the live site. The Performance numbers (2 October 2026) and the four palettes are measurements: don't change them without measuring again.
- **Section gaps:** the `collection`, `rules`, `palette`, `track` and `phone` entries in `$case-section-gaps`, plus Acetrail's `engineering` and `performance`.
- **No new tokens or fonts.** The palette chip colours are content, set inline in the markup.
- **Hero image:** a `<picture>` switching at 1024px. Both files are already cropped to their ratio (4:5 and 3:2), so there's no `object-position`.
- **`.case-index`:** the ten artifacts as a real `<table>` laid out with grid, with explicit ARIA table roles because the cells aren't `display: table-cell`. Desktop: number, title, type and origin on the 12 columns under a header row. Below desktop: the title and number share a line and "Type · Origin" sits under them; the header row is visually hidden. That second line is one text run inside the type cell (the origin is repeated in an `aria-hidden` span) and the origin cell is visually hidden, so screen readers still get one value per column. Capped at `$measure` on tablets.
- **Photo pairs:** `.case-compare--stack` holding `.case-media--landscape` (3:2) images with no plate.
- **`.case-palettes`:** label, then four items of two square chips (base, accent; `aria-hidden`) with the track name and hex values as text.
- **Timing chart:** Acetrail's `.case-timing`, with each fill positioned by `--from` and `--width` set inline, and `.case-timing__fill--rise` for the fade-in gradient. On desktop it sits in columns 5–12 (`.case-cols__span-5-12`).
- **`.case-compare--phones`:** two phone recordings in small plates; columns 5–8 and 9–12 on desktop, two columns below.
- **Rules list:** JobTrackr's `.case-list`.
- **Video:** seven videos, all with the standard markup and toggle. `media.ts` is unchanged.
- **Known pixel difference:** on mobile about 110 pixels of antialiasing differ in the collection's "Type · Origin" lines, because the reference sets each line as one text node and the page splits it at the span.

### Now Playing only

- **Copy and facts:** final, checked against the Now Playing repo at `cf9fded` and the live site. The Performance numbers are a dated PageSpeed measurement (2 October 2026): don't change them without re-running it and updating the date.
- **No new components, tokens or section gaps.** `_case.scss` didn't change for this page. The section gaps reuse Artifacts' `rules` (Live data) and `phone` (Touch) entries, plus `engineering`, `performance`, `process`, `stack` and `outcome`.
- **Reuse map:**
  - Hero: a `<picture>` with `.case-media--hero`, as Artifacts. The phone file is 1600 wide (`1600w`, `width="1600" height="2000"`).
  - Photo pairs (Context, On a phone): `.case-compare--stack` with `.case-media--landscape`, no plate.
  - Scene stills: the same pair, each image in a `.case-plate--medium` with `.case-media--screen`. Their two widths are 960 and 1440.
  - Live data: JobTrackr's `.case-list`.
  - Track changes: a full-width `.case-figure--snug` in a large plate. The artwork tilt: `.case-figure--side` in a medium plate.
  - Previously: `.case-figure--side` whose media is a plain wrapper around a `.case-media--landscape` image, no plate.
  - Touch: `.case-compare--phones` with small plates.
  - Before / After, scores, process, stack, outcome and footer: as built.
- **Outcome line:** the space before each middle dot is a no-break space, so a dot never starts a line on mobile.
- **Footer:** "JobTrackr" with `.case-display--j`, linking to `/work/jobtrackr` in the same tab.
- **Video:** four videos, all with the standard markup and toggle. `media.ts` is unchanged.

## Open items

None right now.
