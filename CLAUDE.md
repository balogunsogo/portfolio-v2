# CLAUDE.md — Portfolio V2.1

Context and rules for anyone (human or AI) working in this repo.

## What this is

Balogun Oluwasogo's personal portfolio: a home page, a Writing index (`/writing`) with hand-authored posts (`/writing/<slug>`), and six case studies (`/work/axa-mansard`, `/work/jobtrackr`, `/work/morrow-studio`, `/work/acetrail`, `/work/artifacts` and `/work/now-playing`, see "Case studies" below). The home page is a single screen, built from the "Neue Montreal" board and the "Two halves" direction of the design canvas "iudoh.me Layout Variations". The layout is a restrained, lineless 12-column grid.

- **Top:** the name as display type, with the role line under it at about a third of the name's size.
- **Shared section layout:** Work, About and the Writing index use `.page` and `.intro`. Title and description tracks reserve the same height at each viewport size, with room for two title lines below desktop, one above, and responsive description space. On mobile, Writing uses one title line and the normal 14px subtitle gap, leaving the remaining reserved height below its description. The Work / About / Writing row follows those tracks in normal flow and never moves when switching views. On desktop, Work and both About columns align to the bottom of the clock and links; below desktop they start directly below the navigation. Short viewports scroll. The project list stays flush left under the name (columns 1–4).
- **Bottom of the viewport, right half:** an aside in columns 9–12 acts as the counterweight. It holds an analog clock for Lagos time beside the links (LinkedIn, GitHub, Contra, Email, in that order), and rests at the bottom of the shared content area. On desktop, the Writing index inherits the same 9px bottom padding as Work and About so the clock and links do not shift between sections. The clock is a 96px inline SVG (`$clock-size`) with a thin ring, two hands, and the digital time and "GMT+1" on either side of the pivot; the time and "Lagos, Nigeria" remain as visually hidden text for screen readers. The clock ring and the section navigation's 1px marks are deliberate exceptions to the no-rules decoration rule.
- **Hover preview:** columns 9–12. It is hidden until a project is hovered or focused. While it shows, the aside fades out, using `.index:has(.preview.is-visible)` with no JS. It only exists on desktop pointers (`min-width: 1024px` with `hover: hover` and `pointer: fine`).
- **Project links:** open in a new tab (`target="_blank" rel="noopener"`), with a visually hidden "(opens in a new tab)" for screen readers. The preview label reads `[data-work-title]`, so that suffix never shows.
- **Description column (desktop):** columns 5–8, beside the list. On hover or focus it shows the project's type (muted, on the "Work" line) and a short description whose first line aligns with Jobtrackr, the first project, whichever item is active. The description fades with the preview. Other list items dim to muted while one is active.
- **Mobile:** stacks the name, role and list. The aside sits below them: the clock on the left, links right-aligned on the right. Tapping a project opens a bottom sheet (`src/ts/modal.ts`) with title, type, image, description, "Visit site" and "Next: <project>". The sheet keeps one height for every project: all titles, types and descriptions are stacked in one grid cell per slot, so the longest sets the size. It closes via Close, the scrim, Escape or dragging the header down; opened from the keyboard, focus moves to Close, is trapped inside and returns to the project; opened by touch, the panel takes focus silently and no focus ring is drawn.
- **About:** a portrait sits inside the name ("Balogun [photo] Oluwasogo") as one more glyph: cap height tall (`$cap-height-medium`), bottom on the baseline, `$portrait-width` wide. It's a `<button>` ("About Oluwasogo", with `aria-expanded`); the `<h1>` keeps its name through `aria-labelledby`. Opening it sets `.page.is-about-open` (`src/ts/about.ts`): the role line becomes a statement and the list becomes the About (bio, then Now / Open to), in shared grid cells so the intro and navigation never move. Spec: `docs/handoff/about/README.md`.
  - **Work / About:** the navigation contains the Work / About switch and a regular Writing link (`.index__switch`, `[data-about-show]`): the lit word is what the stage shows, as in the case studies' reading switch.
    - "About" opens the About until "Work", Escape or the portrait closes it.
    - The portrait's hover peek and tap toggle are unchanged.
    - The same row stays in place in both states at every size, and focus stays on the pressed word. The two intro layers share a grid cell at every size. About joins the content grid when opened and grows the page downward. CSS owns the layout; `about.ts` only handles the interaction state.
    - Spec: `docs/handoff/about-switch/README.md`.
  - **Input:** on desktop with a mouse (the preview's media query) hover opens it at once and leaving closes it after 100ms; a mouse click does nothing. Touch, pen and anything without that match tap to toggle. Keyboard: Enter and Space toggle; Escape, Tab, Shift+Tab and (on desktop) blur close it. Focus alone never opens it, because the portrait is the first tab stop.
  - **Content growth:** the shared header reserves room for the About statement in every state. The content row grows with the bio; no measured offset or flow-fallback class is needed. Changing view keeps the navigation's document position, while normal scrolling remains available.
  - **The photo:** `src/assets/images/portrait/` is final. Its white background is baked to an off-white backdrop, `$plate-clip` (#ECEBE6), by `docs/handoff/about/export-portrait.py`, so it reads as a small tile in the name; baking the ground colour itself made the head look like it was floating. To change the backdrop, re-run the script and bump the `?v=` on the portrait URLs in `index.html`. Never use `mix-blend-mode` on it: it changes how Chrome rasterises every line of text on the page.
  - **Tokens:** `$lsb-w-book`, `$cap-height-medium`, `$portrait-width`, `$about-out`, `$about-delay`, and the `about-layer-hidden` / `about-layer-shown` mixins.
- **Project data:** lives in `src/ts/projects.ts` (title, `meta` type line, `description` and `role` paragraphs, image, URL, optional `caseStudy` and `hidden`). The list, preview, description column and sheet all read from it.
- **Desktop Work height:** `src/scss/_work-fit.scss`, loaded only by `home.scss`, fits the seven projects into the space below the existing intro and navigation by reducing link padding, then the bottom inset. Type sizes, the shared header and navigation positions stay fixed; preview copy and the aside follow the link padding to retain alignment. The rule excludes the open About and all widths below 1024px. Very short windows retain normal scrolling once link padding reaches zero and the bottom inset reaches 16px. Keep its project count in sync with the visible registry.
- **Case-study links:** a project with `caseStudy` links there in the same tab from the desktop list (no `target`, no hidden suffix), and its sheet link reads "Read case study". Every other project keeps "Visit site" in a new tab.

## Stack (do not change without asking)

- Plain HTML (`src/index.html`, `src/work/*.html`), SCSS (`src/scss`, compiled by `sass`) and TypeScript (`src/ts`, compiled by `tsc` to ES modules).
- No framework, bundler, CSS framework or runtime dependencies. Tailwind is explicitly out.
- Build and dev tooling live in `scripts/*.mjs` and use only Node built-ins. They run the `sass` and `typescript` JS entry points directly, because the folder path has a space in it on Windows.

## Design rules

- **Typeface:** PP Neue Montreal, weight 400 for small text and 500 for display, list items and role. The fallback stack is in `$font-sans`.
- **Colour:** ground `#FAFAF8`, ink `#111110`, muted `#65635D`. There are no accent colours.
- **Decoration:** no rules or borders, no numbering, no italics. Spacing does the separating. Seven deliberate exceptions: the clock ring, the section navigation's 1px marks, diagram connectors, the form-field underline in Writing Demo 01, the JobTrackr drawer replica in the second essay, the DOJANG touch-controls replica in the third essay, and the AXA Mansard demo controls (see “AXA Mansard only”). Inside the JobTrackr replica only, JobTrackr’s styling applies: Geist, 1px borders and hairlines, 6px radii and its colours.
- **Type scale (desktop board at 1440):** name 136px, role 48px, projects 30px, meta 16px.
- **Type scale (mobile board at 390):** name 64px on two lines, role 24px on one line, projects 28px, meta 15px.
- **Fluid sizes:** implemented with `clamp()` in `_layout.scss` and `_index.scss`.
- **Alignment rules that must hold on desktop:**
  - The GMT+1 line, the "Work" label and the top of the preview frame share one top edge (grid row 1).
  - The list's left edge matches the name's left edge, measured on the ink rather than the box. Lines are pulled left by their first glyph's side bearing (`$lsb-*` in `_tokens.scss`), so the B of the name, the S of the role and the W of "Work" (`$lsb-w-book`) sit on the same pixel column. The About's statement starts on an I stem and carries the stem correction. A new line or project title that starts on a straight stem (B, D, F, N…) needs the same correction; use `.work__link--stem` for projects.
  - Work and both About columns rest at the bottom of the shared content row, aligned with the clock and links. The home preview spans the navigation and available content height.
  - The project list hugs its longest title (`justify-self: start`).
- **Brand mark:** the `b.` wordmark from the Artifacts project (`balo.svg` / `public/favicon.svg` there). Copy it exactly and never redraw it. The favicon and touch icon are white on `#262626`. The share image is `#262626` on white.
- **Accessibility:**
  - Projects are real links, and focus shows the preview just as hover does.
  - The preview is `aria-hidden`.
  - Focus-visible outlines stay on.
  - The Work / About words keep `aria-pressed` in step.
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
- **Fonts in the repo:** official v3.0 `PPNeueMontreal-Regular.otf` is committed and included in the Vercel build, registered for CSS 400 and 500. Its native weight is 400; semantic 500 intentionally uses the same Regular outlines to better match production Medium. Semibold is not shipped. Other desktop font files stay git-ignored. The supplied EULA is in `docs/font-licenses/`.
- **Deploy:** Vercel builds `main` using `vercel.json` (`npm ci`, `npm run build`, output `dist`). Don't add a framework preset.

## Section navigation

`src/ts/section-nav.ts` and `src/scss/_section-nav.scss` build a desktop-only "On this page" nav from `[data-toc]` headings on case studies and essays. It sits in the right page margin, appears after the first section and leaves at the footer, marked with `data-toc-end`. The 55% footer threshold also has a hide-at-page-bottom fallback for short footers. Hover or keyboard focus opens a small ground-coloured box of right-aligned titles. It is hidden below 1024px, in TL;DR mode and in print. New long pages add `data-toc` to their section headings. Spec and approved values: `docs/handoff/section-nav/README.md` and `reference/`.

## Case studies (`/work/axa-mansard`, `/work/jobtrackr`, `/work/morrow-studio`, `/work/acetrail`, `/work/artifacts`, `/work/now-playing`)

Specs: `docs/handoff/axa-mansard/README.md`, `docs/handoff/jobtrackr/README.md`, `docs/handoff/morrow-studio/README.md`, `docs/handoff/acetrail/README.md`, `docs/handoff/artifacts/README.md` and `docs/handoff/now-playing/README.md`. Pixel targets: each handoff's `reference/desktop.html` at 1440×900 and `reference/mobile.html` at 390×844. The reference wins on appearance at those two widths; the handoff README wins on behaviour.

The rules below apply to all six pages unless a bullet names one. Acetrail reuses JobTrackr's shell, type, grid, text blocks, video behaviour, process, stack, outcome and footer; what it adds is listed under "Acetrail only". Artifacts reuses all of that plus Acetrail's plates, comparison pairs, lists, scores and timing chart; what it adds is under "Artifacts only". Now Playing and Morrow Studio use the existing components, as mapped under their respective lists below.

- **Files:** `src/work/axa-mansard.html`, `src/work/jobtrackr.html`, `src/work/morrow-studio.html`, `src/work/acetrail.html`, `src/work/artifacts.html`, `src/work/now-playing.html`, `src/scss/_case.scss`, `src/ts/media.ts`, `src/ts/top.ts` (the sticky name hides while scrolling down and returns on the way up). The pages use root-absolute URLs (`/assets/...`). `main.ts` runs on every page and skips whatever a page doesn't have.
- **Reading mode (TL;DR):** every case study has a "Full story / TL;DR" switch at the right of the sticky top bar (`src/ts/tldr.ts`, `.case-reading` and the TL;DR rule in `_case.scss`). TL;DR keeps the hero, everything in `$tldr-media` without captions, Stack, Outcome and the footer, and hides the rest; sections with nothing left hide whole. `$tldr-media` covers figures, pairs, bare images and videos, Acetrail's directions and its colour and type study, the hero-scroll recording, the split, analytics and architecture media, and the diagrams. `$tldr-media-text` hides the text inside those wrappers.
  - State: `html.is-tldr`, set before the first paint by the head script on each page from `localStorage.tldr`. `html.has-tldr` means the browser supports `:has()`, so the switch shows.
  - Switching keeps the reader's place and cross-fades unless reduced motion is on.
  - A new picture component goes in `$tldr-media`; new text needs nothing.
  - Spec: `docs/handoff/tldr/README.md`.
- **Shared SCSS:** a change to `_case.scss` must not move anything on any of the six pages. Re-run all six pixel diffs after touching it.
- **Copy:** final and checked against the product. Don't change it, and don't add sections, claims, metrics or testimonials.
- **Layout:** one column below 1024px (text capped at `$measure` on tablets), the 12-column grid from 1024px. Sections are 104px apart on mobile and 160px on desktop. Body, labels, captions and spacing are fixed; only the display, subtitle and heading sizes are fluid.
- **Fluid sizes:** the slopes are exact fractions (`calc(10vw / 3)`, not `3.3333vw`) so sizes land on whole pixels at 390 and 1440. A size of 47.9995px shifts glyph spacing in Chrome and breaks the pixel match.
- **Never size anything with `100vw`.** There must be no horizontal scroll from 320 to 2560px, including with classic scrollbars.
- **Optical left edge:** every line in the display, subtitle, heading, statement, list-item and label styles carries the modifier for its first glyph (`.case-h--stem`, `.case-subtitle--t`, `.case-label--round`, `.case-item--s`…; tokens `$lsb-*`). M uses the stem modifier. Lines starting on A, body copy, captions and diagram text get none. If a line's first word changes, its modifier changes with it.
- **Tokens added for these pages:** `$acetrail-*` and `$font-acetrail` (Ace Trail's palette and typeface, for the swatches and specimen only), `$status-*` (dots only, always beside the status name), `$diagram-*`, `$plate-video`, `$plate-clip`, `$measure`, `$bp-diagram-wide`, `$clock-size-case-mobile`, the extra `$lsb-*` values, `$color-ink-difference` and `$color-muted-difference` (the sticky name's difference-blend colours), and the `below-desktop` and `visually-hidden` mixins.
- **Decoration:** the home rules hold. The lines on the pages are the diagram connectors, the clock ring, the section navigation's 1px marks and the scoped AXA Mansard demo-control exception below.
- **Diagrams:** inlined from `docs/handoff/jobtrackr/diagrams/` without their `<metadata>` block, otherwise untouched. Wide versions show from 1280px (max 1312px), tall versions below (max 440px). The hidden one is `display: none`. Keep each SVG's `role="img"`, `<title>` and unique IDs.
- **Video:** the markup is `<video muted loop playsinline preload="none" poster data-case-video>` with no `autoplay`, followed by a `<button data-case-video-toggle hidden>`. `media.ts` plays a video while at least 25% of it is visible and pauses it when it leaves. With `prefers-reduced-motion` nothing starts on its own. The button ("Pause video" / "Play video") is visually hidden until focused, and clicking the video toggles it too. A video the person paused stays paused.
- **Images:** `width` and `height` on every `<img>`, `srcset` with two widths, and `loading="lazy" decoding="async"` except the hero (`fetchpriority="high"`).
- **Analytics pair:** the laptop image's ratio is `2266 / 1512` (3:2, rounded to the board's 504px at 1440). The phone image fills the same row.
- **Footer:** the home page's clock markup and classes, at 88px below desktop, with proportional figures as on the board. On JobTrackr, the clock hides while the Morrow Studio next-project link is hovered or keyboard-focused on desktop, so its expanding thumbnail does not overlap the clock.
- **Linking:** the chain is a loop: AXA Mansard → JobTrackr → Morrow Studio → Acetrail → Artifacts → Now Playing → AXA Mansard. AXA Mansard is first on the home page; JobTrackr and Morrow Studio follow. Each "Next project" link goes to the next case study in the same tab, with no `target`, `rel` or hidden suffix. All That Is Kim has no case study (its site is about to be redesigned), so the chain skips it, and it's `hidden: true` in `projects.ts`: its data stays, but the home list, preview and sheet leave it out. If it gets one, remove the flag and it slots in between Acetrail and Artifacts, following the home list. Every top bar links to `/`.
- **Media files are final:** don't regenerate, recompress or re-cut them. The screen recording was cut to leave out a third party's email address, so never re-cut it from the raw file.
- **Checks:** the acceptance lists in the handoff READMEs (JobTrackr §13, Morrow Studio §11, Acetrail §11, Artifacts §11, Now Playing §11): the screenshot diff against both reference pages with reduced motion, the overflow sweep with real scrollbars, keyboard order, motion and linking. TL;DR: the full story must stay pixel-identical, and TL;DR must match `docs/handoff/tldr/reference/blocks.json`.
- **Running the screenshot diff:** the references always load the largest image, while the pages pick from `srcset`, so serve the largest file to both before comparing; otherwise the photos differ by resampling. Chrome repeats the top of a page past 16384px in one screenshot, and the JobTrackr, Morrow Studio, Acetrail and Artifacts desktop pages are taller than that, so capture the lower part separately from a fresh page load. (A second screenshot of the same page load comes out a few pixels off, so don't reuse the page.) Now Playing's desktop page (14085px) fits in one capture. Run one browser at a time and make sure the machine has memory to spare: when it is short, Chrome leaves a large photo blank or changes how text and video posters are antialiased, in different places on each run.

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

- **Copy and facts:** final, checked against the Artifacts repo at `1d810e5` and the live site. The Performance numbers (mobile scores and vitals from 3 October 2026; the desktop and Scroll Cinema figures in the note from 2 October) and the four palettes are measurements: don't change them without measuring again.
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
- **Footer:** "AXA Mansard" with `.case-display` (no optical modifier), linking to `/work/axa-mansard` in the same tab with its supplied thumbnail.
- **Video:** four videos, all with the standard markup and toggle. `media.ts` is unchanged.

### Morrow Studio only

- **Copy and facts:** final, checked against the Morrow repo at `0798ad6`, its migration reports and the live site. Keep the migration and QA figures as written.
- **No new components, tokens or section gaps.** Reuse `engineering` for Content model, `rules` for Preview, `performance` for Migration, and `process`, `stack` and `outcome`.
- **Media (update 1):** hero and three Studio pictures switch sources at 1024px. The CMS shows the Projects screenshot; Editing shows Home, the two field crops and About. Studio screenshots use plain `.case-media`, their natural ratios and no plates; each desktop screenshot and mobile crop exists at one size only, with no `sizes` attribute. The field pair uses `.case-compare--stack`, capped at `$measure` below desktop. Medium plates remain only on the 16:10 system stills and side archive video. Full-width photos and the home and square phone videos have no plate. The old Studio laptop render and 700px crops are deleted; all remaining assets are final. The QA sheet and both captions were subsequently removed at the user's request; the QA heading and text remain.
- **Lists and numbers:** three `.case-lists` blocks (the schema/Studio pair moves unchanged to Editing), a `.case-list` for Preview, and migration scores without vitals. The CMS captions switch with the picture; Home and About share one caption each across layouts. The CMS project-preview example was subsequently removed at the user's request. Outcome disciplines keep a no-break space before each middle dot.
- **Home preview (update 1):** the 1200×800 preview and 480×320 footer thumb are replaced in place, with centred framing that keeps the whole display and phone inside the existing desktop preview and mobile sheet crops. No home or linking code changes.
- **Video:** three standard videos and toggles; `media.ts` is unchanged.
- **Footer:** Acetrail in the same tab. JobTrackr links here with the Morrow thumb and first word in `.case-nowrap`, using `.case-display--stem` and `--balance`.
- **Screenshot diff (update 1):** the desktop reference is about 17727px and needs two captures, with a fresh page load for the lower part. The mobile reference is about 15513px and fits one capture. Load fonts, serve the largest images to both pages, pin the clock and emulate reduced motion.
- **Reference differences:** retain the built sticky name-only top bar (the reference also shows "All work") and the required Acetrail footer thumbnail (absent from the reference). Update 1 matched the reference content before subsequent user copy edits and the removal of the QA sheet and CMS project-preview example; preserve those later edits rather than restoring the reference's copy or media. Status reuses the metadata label's 4px desktop margin with the score-name ink colour; Uploaded uses the existing item stem modifier for the reference's 0.071em bearing.

### AXA Mansard only

- **Sources and copy:** the approved spec, copy, demo models and pixel targets are in `docs/handoff/axa-mansard/`. All copy and fictional demo data are final. No added employer material, claims, metrics or internal system names. No AXA branding on the case page; the supplied logo is for project previews only. Keep the personal-portfolio disclaimer at the end of Stack in both reading modes.
- **Files:** `src/work/axa-mansard.html`, `src/scss/work/_axa-mansard.scss`, and page-only `src/ts/work/axa-mansard/main.ts`, with `translator.ts`, `settlement.ts`, `turnaround.ts` and local DOM helpers. Shared case-study SCSS, TL;DR, media and section-nav rules are unchanged.
- **Components:** contribution matrix, reconstructed public profile card with the untouched supplied QR, staff journey and three demo figures. Light matrix cells, elapsed fill, ignored-event marks and slider track use `$axa-fill-light: #b4b1a9`. Tablets below 1024px use the mobile layout.
- **Profile figure, author revision:** the card and journey each span six grid columns on desktop (50/50), stacking below 1024px. The smaller four-step journey is Staff login → Create QR code and link → Share with a recipient → Public view. This replaces the original request-order sequence and narrow card in the reference; preserve this later revision. The supplied portrait, QR and profile links remain unchanged.
- **Demo presentation, author revisions:** Request translator and Settlement allocation figures are temporarily commented out, including captions; preserve their markup and TypeScript for restoration. The Turnaround clock is a guided, fixed example ending at settlement on day 12: three totals, Active/Paused chart lanes, one changing caption and one Play example / Pause / Continue / Replay button. It starts complete (6 active + 4 paused = 10 elapsed days), has no slider, Reset or event checkboxes, and never autoplays. Reduced motion shows the final result immediately; pagehide clears playback and persisted pageshow restores the complete default. These changes supersede the original interactive reference.
- **AXA home preview, author revision:** the supplied image renders at 2× scale inside the existing clipped desktop preview frame. Other projects, the mobile sheet, case-page media and the source assets are unchanged.
- **Seventh design-rule exception:** inside the AXA Mansard demos only, form controls use ground-coloured fields without borders; invalid fields use a 2px ink underline (`box-shadow: inset 0 -2px 0`), the slider has a 2px track and square thumb, status lines start with an 8px square (held: filled; OK: outlined), and checkboxes use ink `accent-color`.
- **Demos:** approved fictional lookup, fixed beneficiary-slot, integer-kobo allocation and synthetic clock rules. DOM APIs and `textContent`, with `data-axa-*` hooks. HTML ships readable defaults with disabled demo controls; page-only initialization enables them. No requests, storage, cookies or analytics events. Reset and edge-case buttons retain focus; paid allocations stay fixed. Reset, scrub and pagehide clear the timer, persisted pageshow resets it, and reduced-motion Play shows the completed example.
- **Reading and navigation:** hero, five figures, Stack with its disclaimer and footer remain in TL;DR. The profile and demo captions hide; the hero’s confidentiality caption stays, as in the approved TL;DR bitmaps. Six section-nav entries; no Outcome section. Sixth case study and first home Work item. The chain is AXA Mansard → JobTrackr → Morrow Studio → Acetrail → Artifacts → Now Playing → AXA Mansard, all in the same tab. Supplied project images and QR are final; never regenerate, crop or recolour them.
- **Checks:** handoff §11 covers typecheck/build, full-page reduced-motion screenshot diffs at 1440×900 and 390×844 with fonts loaded and a pinned clock, TL;DR and home references, every §6.4 string, keyboard/touch/mouse, no-JS defaults, timer cleanup, QR decoding, classic-scrollbar overflow from 320–2560px and the full chain.

## Writing (`/writing`, `/writing/<slug>`)

Spec and visual references: `docs/handoff/writing/README.md` and `reference/`. The first essay is "The Space Between Design and Engineering", published 4 November 2026. Its approved prose is copied exactly from `reference/article-desktop.html`.

- **Content model:** `src/ts/posts.ts` exports the typed registry, visible posts sorted newest first, and `formatPostDate` (en-GB, UTC). `scripts/posts.mjs` transpiles and evaluates that registry with the existing TypeScript dependency, following `projects.mjs`. `copyPages()` injects static items into `<ol class="posts" data-post-list></ol>` and marks it `data-posts-rendered`. Hidden drafts never appear. No client rendering, feed or sitemap. A future post needs its registry entry, HTML page and any article-specific code.
- **Home:** Writing is a regular link after About in the single switch row, without `data-about-show` or pressed state. `/#about` uses the existing About open path with source "switch", then clears the hash without scrolling. The existing portrait and switch behavior remains.
- **Pages:** root-absolute asset URLs, shared `main.css` and `main.js`, and the build-injected Google tag. The index uses the home page's shared header slots, with Writing aligned to the name and its subtitle aligned to the role/statement. It has no separate name top bar. Navigation shares the Work/About baseline. On desktop, the static post list aligns to the bottom of the remaining content area: one post keeps its existing position, more posts grow upward to the common content start, then extend the page downward. Below desktop, posts flow directly below navigation. The clock and links remain below or beside the content. Posts use an article header, metadata, a 12-column rail/prose grid from 1024, one column below, full-width demo figures and the existing case footer with a Next link. Both pages have canonical, OG, Twitter and JSON-LD metadata (Blog / BlogPosting).
- **Reusable code:** `_writing.scss` contains editorial layout, index, plates, controls, captions, notes and footer labels. `src/ts/writing/media-switch.ts` handles versioned media and shared explicit playback; `annotated-media.ts` progressively enhances stacked notes to labelled ARIA tabs, with roving focus, arrows and Home/End. Main initializes each only when its data hook exists. These modules and shared styles must not know about individual essays.
- **Article-specific code:** `src/ts/posts/space-between/form-demo.ts` and `src/scss/posts/_space-between.scss`. The form script is loaded only by this essay's own module script. It validates trimmed email values against `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` (so `ada@example` is invalid) and displays the trimmed email on success. Visible demo and notes copy uses typographic apostrophes. It simulates Normal (0.7s), Slow (notice at 1.5s, success at 3.5s), and Server error (1.2s, successful retry at 0.9s). It sends no requests, serializes no input, stores nothing and records no analytics events. Duplicate submits are ignored; reset/pagehide clear all timers; persisted pageshow restores the form with its value kept. Join stays focusable while pending via `aria-disabled="true"`, with the same muted background and progress cursor; repeated submits are ignored. Try again focuses Join before clearing its message. Success focuses the heading, reset the input. Native condition radios are disabled while pending. The input underline is a deliberate decoration exception.
- **Media:** final supplied assets under `assets/{images,video}/writing/`; never regenerate, recompress or re-cut them. Videos have `muted playsinline preload="none" poster`, never `autoplay`, `loop` or `data-case-video`. Playback requires a control press even with reduced motion disabled. Replay starts at zero; rejected play restores "Play". The animation version defaults to the motion preference. Switching changes src/poster without `load()` or seeking: it resumes from zero only if the video was playing at the moment of the switch; paused stays paused, with Replay visibility kept. No MP4 downloads before a control is pressed. Notes never pause or seek their video.
- **Fallbacks:** without JS the form controls are disabled with their explanatory notes, both animation videos have native controls and captions, and all three first-essay notes are readable sections. The second essay’s video also keeps native controls without JS. No added dependencies. Select TS elements using data attributes.
- **References:** article references regenerated on 4 November 2026 include the message/card and mobile control minimum heights. README §12 lists allowed differences. Mobile spacing and footer gaps follow the visual references, including their combined margins/gaps. The essay retains the case top bar and SVG clock. The Writing index's shared header/navigation layout supersedes its original static references; its type now uses the same fluid sizes as the home page. The supplied WebPs differ from fresh renders of their own HTML in this browser; use both comparisons to distinguish rasterization from layout.
- **Checks:** typecheck/build; reduced-motion, fixed-clock pixel comparisons at 1440 and 390; home closed/open and all five case-study regressions; mouse/touch/keyboard demo states with no form network requests; no-JS fallbacks; overflow 320-2560 with classic scrollbars; metadata, posters and video Range responses.

- **Second essay:** “Building Job URL Extraction into JobTrackr”, 8 November 2026. Spec and references: `docs/handoff/writing-job-url-extraction/`. Prose is copied exactly from `reference/article-desktop.html`.
- **Second essay’s code:** `src/ts/posts/job-url-extraction/` and `src/scss/posts/_job-url-extraction.scss`; its module is loaded only by that essay. Interactions 02 and 03 share a JobTrackr Add application replica. Copy, field order, styles and dropdowns (JobTrackr’s Select: desktop listbox, sheet below 1024) come from JobTrackr `main` `f6d264a`, with the extraction rules in spec §6. The demos send nothing, store nothing and record nothing. Source examples resolve after 0.9s; edit/request scenarios use 4s and 1.2s. Newer generations win; touched values are protected and salary suggestions apply as a group. Reset, example/scenario changes and pagehide clear timers; persisted pageshow resets the current choice.
  - **Focus:** accepting a suggestion focuses its field (Salary minimum for the group); dismissing focuses the next suggestion’s first button or Extract details. Validation focuses the first invalid field. Cancel and × reset and focus Extract details. Example/scenario changes keep focus on the option. Busy extraction uses `aria-disabled`, keeps focus and ignores presses. Dropdowns support arrows, Home/End, PageUp/PageDown, typeahead, Enter/Space, Alt+ArrowUp, Tab and Escape; Escape stops propagation. The 600px phone sheet scrolls inside and allows page scrolling at its ends.
- **Replica fonts:** Geist and Geist Mono ship as WOFF2, used only inside this replica, without preloads. OFL: `docs/font-licenses/Geist-OFL.txt`.
- **Essay footers:** “Next” links use `.writing-foot__essay`. The essays form a loop, newest to oldest: Explaining What I Do → DOJANG → JobTrackr → Space Between → Explaining What I Do.
- **Display numbers:** proportional digits with the `$lsb-two` / `$lsb-one` optical edges.

- **Third essay:** “Making a Fighting Game Feel Right in the Browser”, 14 November 2026. Spec, references and provenance: `docs/handoff/writing-dojang/`. Its prose comes from `reference/article-desktop.html`, with the author’s later revision to the paragraph beginning “I believe in iterating over time” (rushing or 'one-shotting'). Its meta sits in the header (`.writing-meta--head`) because it opens with a titled section.
- **Third essay’s code:** `src/ts/posts/dojang/` and `src/scss/posts/_dojang.scss`, loaded only by that essay.
  - Interactive 01 uses `media-switch.ts` with `data-media-start="0"`. Without the attribute the switch keeps its reduced-motion default.
  - Media 03 uses `image-switch.ts`. The sound comparison uses `sound-compare.ts`: one clip at a time, explicit play.
  - Interactive 02 replicates DOJANG’s compact touch controls from DOJANG `main` `b34f80c`: the 200ms hold, 14px slop, wheel thresholds 26 / 86 / 160 and exact status-line copy in spec §5. Phones see the stage at real size, cropped to the right side. It sends, stores and records nothing. Version changes and pagehide cancel gestures and clear the hold timer; persisted pageshow resets the replica. The stage and status area keep their height; captions retain their natural reference heights (author-approved clarification of spec §5).
- **Sixth design-rule exception:** inside the DOJANG touch-controls replica only, DOJANG’s own styling applies: IBM Plex Sans, translucent fills, thin light borders, round buttons, the dashed arc, gold press colour and glow rings.
- **DOJANG fonts:** IBM Plex Sans 500 and 600 (OFL, `docs/font-licenses/IBMPlexSans-OFL.txt`), used only by that replica, without preloads.
- **Audio:** `assets/audio/writing/` MP3s; `dev.mjs` serves `.mp3` as `audio/mpeg`.
- **Captions:** recordings are dated and say what they show. Never caption a later recording as an earlier moment.

- **Fourth essay:** “The Challenge of Explaining What I Do”, 20 November 2026, at `/writing/the-challenge-of-explaining-what-i-do`. Text only: the first essay’s shell (intro with the meta rail, three `data-toc` sections), no article-specific code, scripts or media beyond its share image (`assets/images/writing/explaining-what-i-do-og.jpg`). Its approved manuscript is copied exactly, with typographic apostrophes, the italic subtitle set upright and its one bold phrase as `<strong class="case-strong">`.

## Open items

None right now.
