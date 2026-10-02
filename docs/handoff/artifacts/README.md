# Artifacts case study: implementation handoff

Build the Artifacts case study as the site's third case study, pixel-perfect to the approved design, and link it into the site.

- **URL:** `/work/artifacts`
- **Pixel targets:** `reference/desktop.html` at **1440 × 900** and `reference/mobile.html` at **390 × 844**.
- **Starting point:** JobTrackr and Acetrail are built and live (`src/work/jobtrackr.html`, `src/work/acetrail.html`, `src/scss/_case.scss`, `src/ts/media.ts`). This page uses the same shell, type, grid, text blocks, plates, video behaviour, lists, scores, process, stack, outcome and footer. Reuse those classes as they are. Only the components in §6 are new.
- **Stack and rules:** unchanged (`CLAUDE.md`). Plain HTML, SCSS and TypeScript; no new dependencies, no new fonts.

---

## 1. Sources of truth

| Priority | File | What it settles |
|---|---|---|
| 1 | `reference/desktop.html`, `reference/mobile.html` | Exact appearance at 1440 and 390: sizes, gaps, grid spans, colours, ratios, line breaks and the final copy. Open them in a browser; they load fonts and media from `src/assets`. Their inline styles are a reference only: build with classes. |
| 2 | `reference/desktop-1..3.webp`, `reference/mobile-1..3.webp` | Full-page screenshots of the two references, with reduced motion (videos show their posters). They were captured in 4000px slices, so they're correct below 16384px. |
| 3 | This README | Reuse map, new components, behaviour between and beyond the two widths, media, linking, `<head>` and acceptance checks. |
| 4 | `CLAUDE.md`, the Acetrail and JobTrackr handoffs, and the built pages | Every shared rule this README doesn't repeat (fluid type, optical alignment, video markup, images, footer, the screenshot-diff method). |

If the reference and this README disagree: the reference wins on **appearance at 1440 and 390**; this README wins on **behaviour**.

On the design canvas the page is four artboards per layout only because of the canvas's size limit. The real page is **one continuous page**, as the reference pages show it.

---

## 2. Files

**Create**

- `src/work/artifacts.html`. Copy the shell of `acetrail.html`: the `<head>` pattern (§9), the `.case` wrapper, the `.case-top` bar, `<main class="case__main">`, and the `.case-foot` footer with the clock and links.

**Already in place** (final; don't regenerate, recompress or re-cut):

- `src/assets/images/case/artifacts/*.webp` and `og.jpg`
- `src/assets/video/artifacts/*.mp4`
- `docs/handoff/artifacts/**`
- `docs/handoff/acetrail/reference/*`: regenerated so Acetrail's footer reads "Artifacts" (§8). Nothing else in it changed: same copy, same page heights (17247px desktop, 14031px mobile).

**Modify**

- `src/scss/_case.scss`: the section-gap entries in §4 and the components in §6.
- **Linking** (§8): `src/ts/projects.ts` and `src/work/acetrail.html` (footer only).
- `README.md` and `CLAUDE.md`: document the third case study and the new linking (CLAUDE.md "Case studies" covers all three pages; add an "Artifacts only" list like Acetrail's).

**Out of scope:** the home page layout and styles, the JobTrackr page, the Acetrail page apart from its footer link, and the Artifacts site itself.

---

## 3. Tokens and optical modifiers

**No new tokens.** Everything comes from what's there:

- `$plate-clip` for every plate on this page.
- `$diagram-card` for the timing-chart tracks.
- The palette chips (§6.3) are content: their colours are inline in the markup, not tokens.

**Optical left edge.** It's the same rule as before: every line in the display, subtitle, heading, statement, list-item and label styles gets the modifier for its first glyph. The reference carries the exact `margin-left` on each line. There's nothing new to add:

- The display ("Artifacts") and subtitle ("An archive…") start on A and get none.
- "Now Playing" in the footer is the display with `--stem`.
- In the collection (§6.1) the titles are the list-item style and take `.case-item--*` (Block → stem, Split → s, Three → t, Ambient → none, Palette → stem, Card → round…). Its column labels ("Artifact", "Type", "From") are the label style and take `.case-label--*` even though they don't start at the page edge, as the reference shows.
- The Rules names (§5.5) use `.case-item--*` as JobTrackr's `.case-list` does.

---

## 4. Shell and section rhythm

Identical to the other two pages: page padding, the 104px / 160px section gap, the top bar, the 12-column grid, `.case-text` for label, heading and body.

**Gap between a section's blocks.** Add the new entries to `$case-section-gaps` and reuse the existing ones:

| Section | Mobile | Desktop | Modifier |
|---|---|---|---|
| The archive, Theme, Block Orbit, Split Menu, Scroll Cinema | 36px | 64px | none (default) |
| Context | 40px | 64px | new `collection` |
| Rules | 40px | 80px | new `rules` |
| From Now Playing | 40px | 64px | new `palette` |
| Track Transition | 40px | 64px | new `track` |
| On a phone | 40px | 64px | new `phone` |
| Engineering | 40px | 80px | existing `engineering` |
| Performance | 32px | 64px | existing `performance` |
| Process | 40px | 80px | existing `process` |
| Stack | 28px | 56px | existing `stack` |
| Outcome | 24px | 48px | existing `outcome` |

**Captions** sit 12px under their media at both widths, as on Acetrail (`.case-figure--snug`, or the 12px gap the §6 components already have). On a full-width figure the caption stays in columns 1–6 on desktop (`.case-figure__caption`).

**Plates:** `.case-plate` (large, 16 / 64px), `.case-plate--medium` (12 / 32px), `.case-plate--small` (10 / 24px), as on Acetrail.

---

## 5. Page structure, section by section

The copy is final: take every string **verbatim** from the reference HTML. Semantics follow the other two pages: `<header>` for the top bar; `<main>` with one `<section aria-labelledby>` per block; `<footer>`; the title is the only `<h1>`, section headings are `<h2>`; each piece of media with a caption is a `<figure>` with a `<figcaption>`.

### 5.1 Hero

Same structure and classes as Acetrail's hero.

- **Copy:** title "Artifacts"; subtitle "An archive of interactions, taken out of my projects and rebuilt to stand alone."
- **Meta:**
  - Role: "Design and / frontend development" (line break after "and" on desktop).
  - Year: 2026.
  - Stack: "Next.js, TypeScript, / SCSS, GSAP" (line break after "TypeScript," on desktop).
  - Status: "Live". The site link `artifacts.balogunoluwasogo.com` goes to `https://artifacts.balogunoluwasogo.com/` in a new tab, with the visually hidden suffix.
- **Image: art-directed.** A `<picture>` switching at 1024px with `.case-media--hero` (4:5 below desktop, 3:2 from it):
  - **Desktop:** `hero-1200.webp` / `hero-2400.webp` (2400×1600, exactly 3:2): the index on a desktop monitor.
  - **Below desktop:** `hero-phone-1200.webp` / `hero-phone-1800.webp` (1800×2250, exactly 4:5): the index on a phone in someone's hand.
  - Both files are already cropped to their ratio, so no `object-position` is needed.
  - **Alt:** one for both sources: "The Artifacts index on a desktop monitor and on a phone". This replaces the per-board alts in the reference HTML.
  - `fetchpriority="high"` and `sizes` as on the other heroes.

### 5.2 Context

`.case-text` (heading "My best interactions were buried in other projects."), then the **collection** (§6.1): all ten artifacts with their number, type and origin.

### 5.3 The archive

`.case-text`, then a full-width `.case-figure` with `index-desktop.mp4` (1440×900, **16:10**) in a **large plate**. Caption: "The index at 1440 × 900, scrolled from Block Orbit to Card Flip."

### 5.4 Theme

`.case-text`, then a **photo pair** (§6.2): `theme-dark-*.webp` and `theme-light-*.webp`, both **3:2**, no plate.

- Captions: "Dark: the index on a laptop." and "Light: Block Orbit on the same laptop."

### 5.5 Rules

`.case-text` with two paragraphs, then:

1. JobTrackr's `.case-list` (a `<dl>`): five rows, the name in the list-item style in columns 1–4, the text muted in columns 5–10. On desktop at 1024px "Touch as well as pointer" wraps to two lines; that's fine.
2. A `.case-figure--side` (caption in columns 1–4, bottom-aligned; media in 5–12): `information-*.webp` at **16:10** in a **medium plate**. Caption: "Block Orbit with its Information panel open." On mobile the image comes first.

### 5.6 Block Orbit

`.case-text`, then a **photo pair** (§6.2): `block-orbit-cube-*.webp` and `block-orbit-phone-*.webp`, both **3:2**, no plate.

- Captions: "The share image." and "Block Orbit on a phone, in dark mode."

### 5.7 Split Menu

`.case-text`, then a `.case-figure--side` with `split-menu.mp4` (1440×900, **16:10**) in a **medium plate**. Caption: "Opening the menu, moving across the four cards, and closing it."

### 5.8 Scroll Cinema

`.case-text`, then a full-width `.case-figure` with `scroll-cinema.mp4` (1440×900, **16:10**) in a **large plate**. Caption: "Scrolling through the pinned section at 1440 × 900."

### 5.9 From Now Playing

`.case-text` (label "From Now Playing", heading "Three pieces of a music player, without the player."), then:

1. A `.case-figure--side` with `palette-shift.mp4` (1440×900, **16:10**) in a **medium plate**. Caption: "Choosing each of the four covers. Album artwork belongs to its artists and rights holders."
2. The **palettes** (§6.3), labelled "Extracted colours".

### 5.10 Track Transition

`.case-text`, then:

1. A `.case-figure--side` with `track-transition.mp4` (1440×900, **16:10**) in a **medium plate**. Caption: "Next three times, then Previous."
2. The **timing chart** (§6.4). On desktop it sits in columns 5–12, under the video. On mobile it follows the figure.

### 5.11 On a phone

`.case-text`, then the **phone pair** (§6.5): `index-mobile.mp4` and `ambient-touch.mp4` (each 780×1688, ratio **390 / 844**) in **small plates**.

- Captions: "The index on a 390-pixel-wide phone." and "Dragging and tapping Ambient Artwork."

### 5.12 Engineering

`.case-text` with two paragraphs, then Acetrail's `.case-lists`: "Before" in columns 1–6 and "After" in columns 7–12 on desktop, stacked 40px apart on mobile. Six lines each, in the reference's order; each After line answers the Before line beside it.

### 5.13 Performance

Acetrail's Performance block: label and heading ("Measured on a mid-range phone.", `.case-h--stem`), `.case-scores`, then the caption (columns 1–6 on desktop).

- Scores: **98** Performance, **96** Accessibility, **100** Best practices, **100** SEO.
- Vitals: **0.9 s** First contentful paint, **2.4 s** Largest contentful paint, **40 ms** Total blocking time, **0** Cumulative layout shift.

### 5.14 Process

Reuse `.case-process` with the five steps from the reference: Find, Extract, Rebuild, Fit the rules, Publish.

### 5.15 Stack

Reuse `.case-stack`. Heading: "A static site with room for motion." Seven groups, in the reference's order.

### 5.16 Outcome

Reuse the outcome block: statement in columns 1–10, body in columns 7–11, disciplines line in columns 1–9.

### 5.17 Footer

Reuse `.case-foot`. "Next project": **Now Playing** (`.case-display--stem`), linking to `/work/now-playing` in the same tab. (It linked to Now Playing's live site in a new tab at first; the Now Playing handoff, `docs/handoff/now-playing/README.md` §8, changes it in the same change that builds `/work/now-playing`. The text doesn't change, so the reference here still matches.)

---

## 6. New components

All values are exact at 1440 / 390.

### 6.1 Collection: `.case-index`

The ten artifacts as a table. Use a real `<table>` with a visually hidden `<caption>` ("The ten artifacts in the archive") and header cells "Artifact", "Type" and "From" (the number column's header is visually hidden: "Number"). Style it with grid so the cells land where the reference has them.

- **Desktop** (12-column grid on each row):
  - Header row: "Artifact" in columns 2–5, "Type" in 6–8, "From" in 9–12, in the label style. **24px** below it, the rows.
  - Rows **14px** apart, cells aligned on their baseline:
    - Number in column 1: small style (16px), muted, `font-variant-numeric: tabular-nums`.
    - Title in columns 2–5: list-item style (30px, 500).
    - Type in 6–8 and origin in 9–12: body style (20px), muted.
- **Mobile:** no header row (it stays for screen readers, visually hidden). Rows **20px** apart. Each row:
  - Line 1: the title (list-item style, 24px) on the left and the number (small, muted, tabular) on the right, sharing a baseline, 12px apart at least.
  - Line 2, **4px** below: "Type · Origin" in the small style, muted (a middle dot with a space either side).
- **Tablet guard:** cap the table at `$measure` below 1024px so the number doesn't drift far from its title.
- At 1024 the widest title ("Three Image Orbit", 227px at 30px) still fits columns 2–5 (283px).

### 6.2 Photo pair

Reuse `.case-compare` with `--stack`: two figures, columns 1–6 and 7–12 on desktop; below desktop one column, **40px** apart. The figures hold the image directly (no plate) with a new `.case-media--landscape` (`aspect-ratio: 3 / 2` at every width), and the caption 12px below.

### 6.3 Palettes: `.case-palettes`

What Palette Shift extracted from each of the four covers.

- A column: the label "Extracted colours", then the grid: **32px** apart on desktop, **20px** on mobile.
- **Grid:** desktop, the 12-column grid with four items spanning 3 columns each. Mobile: 2 columns, 12px column gap, 20px row gap. Cap it at `$measure` on tablets.
- **Item:** two square chips side by side (8px apart, `aspect-ratio: 1`), base then accent, `aria-hidden="true"`. **10px** below, small style: the track name in 500, a line break, then "Base #xxxxxx, accent #xxxxxx" muted. The hex values are text.

| Track | Base | Accent |
|---|---|---|
| Back Outside | `#403936` | `#AA4044` |
| VILLAIN | `#4B3724` | `#A15436` |
| GLORY II | `#211F1F` | `#636261` |
| Bang | `#3E3A2D` | `#9A5633` |

### 6.4 Timing chart: reuse `.case-timing`

Same component as Acetrail (label, rows, track, axis; `role="img"` with the reference's `aria-label`; the insides `aria-hidden`; no motion). What changes is the data, so the fills need positions per row:

- Give `.case-timing__fill` `left: var(--from, 0)` and `width: var(--width, 100%)`, and set those two custom properties on each Artifacts fill (inline `style="--from: 16.7%; --width: 57.4%"`). Acetrail's `--out` and `--in` fills must keep exactly their current positions.
- A new gradient fill without a position (ink at alpha 0 to ink, like `--in`), e.g. `.case-timing__fill--rise`.
- Label: "Time after the next track is ready". Axis: "0, the next track is ready" and "1,080 ms".

| Row | Detail | From | Width | Fill |
|---|---|---|---|---|
| Step back | Artwork drops and fades to 48%; the text fades out | 0% | 16.7% | solid ink |
| Artwork returns | 620 ms, once the new track is swapped in | 16.7% | 57.4% | rise |
| Title, word by word | 420 ms a word, 26 ms apart | 22.2% | 41.3% | rise |
| Label, artist, album, controls | 520 ms each, starting 20 to 220 ms in | 18.5% | 66.7% | rise |
| Background blooms in | The old colour layer is cleared at 1,080 ms | 16.7% | 83.3% | rise |

- **Placement:** desktop, columns 5–12 (a 12-column row holding the chart). Mobile, full width, capped at `$measure` on tablets.

### 6.5 Phone pair

Reuse `.case-compare` (two columns, 12px gap, from 320px up) with a new `--phones` modifier: on desktop the first figure spans columns **5–8** and the second **9–12**. Each figure is a small plate with the video at **390 / 844** (`.case-video__media--phone-screen`), then the caption. Cap the pair at `$measure` below 1024px.

---

## 7. Media

Give every `<img>` its `width` and `height`. Use `loading="lazy" decoding="async"` everywhere except the hero.

| Use | Files (intrinsic px) | Ratio | Alt / label (from the reference) |
|---|---|---|---|
| Hero, desktop | `hero-1200.webp`, `hero-2400.webp` (2400×1600) | 3:2 | see §5.1 |
| Hero, mobile | `hero-phone-1200.webp`, `hero-phone-1800.webp` (1800×2250) | 4:5 | see §5.1 |
| Theme pair | `theme-dark-1200/2000.webp`, `theme-light-1200/2000.webp` (2000×1333) | 3:2 | from the reference |
| Information panel | `information-1200.webp`, `information-2400.webp` (2400×1500) | 16:10 | from the reference |
| Block Orbit pair | `block-orbit-cube-1200/1412.webp` (1412×941), `block-orbit-phone-1200/2000.webp` (2000×1333) | 3:2 | from the reference |
| The index | `video/artifacts/index-desktop.mp4` (1440×900, 13.3 s), `index-desktop-poster.webp` | 16:10 | from the reference |
| Split Menu | `split-menu.mp4` (1440×900, 14.3 s), `split-menu-poster.webp` | 16:10 | from the reference |
| Scroll Cinema | `scroll-cinema.mp4` (1440×900, 6.4 s), `scroll-cinema-poster.webp` | 16:10 | from the reference |
| Palette Shift | `palette-shift.mp4` (1440×900, 12.5 s), `palette-shift-poster.webp` | 16:10 | from the reference |
| Track Transition | `track-transition.mp4` (1440×900, 10.3 s), `track-transition-poster.webp` | 16:10 | from the reference |
| Index on a phone | `index-mobile.mp4` (780×1688, 11.6 s), `index-mobile-poster.webp` | 390/844 | from the reference |
| Ambient Artwork, touch | `ambient-touch.mp4` (780×1688, 8.6 s), `ambient-touch-poster.webp` | 390/844 | from the reference |
| Share image | `og.jpg` (1200×630) | — | — |

- **Videos:** the standard markup and toggle, with `media.ts` unchanged. Every recording is silent. Seven videos; the keyboard order runs through their toggles in page order.
- **Where the media came from:**
  - The recordings are of the Artifacts site built from its repo at the live commit (`1d810e5`, 27 September 2026), captured frame by frame at 1440 × 900 and at 390 × 844 on a 2× screen. The pointer and the touch circle are drawn in for the recording.
  - The Information still is the same build.
  - The monitor, laptop and phone photos and the cube are Oluwasogo's mockups; the share image is the Artifacts site's own.
  - Album artwork in the Palette Shift, Track Transition and Ambient Artwork recordings belongs to its artists and rights holders; the caption in §5.9 says so, as the Artifacts site does.

---

## 8. Linking the case studies

Do all of this **in the same change as the new page**, so no link points at a page that doesn't exist yet.

1. **`projects.ts`:** give Artifacts `caseStudy: '/work/artifacts'`. The home list (desktop) and the sheet's "Read case study" (mobile) then follow automatically.
2. **`acetrail.html` footer:** "Next project" becomes **Artifacts**, linking to `/work/artifacts` in the same tab. Change the link text from "All That Is Kim" to "Artifacts" and remove its `target`, `rel` and hidden suffix. "Artifacts" starts on A, so the display line takes no optical modifier. The regenerated Acetrail reference shows it.
3. **`artifacts.html` footer:** "Now Playing" links to the Now Playing case study (§5.17), switched in the same change that builds `/work/now-playing`.
4. **All That Is Kim** has no case study (its site is about to be redesigned), so the case-study chain skips it. On the home page it keeps linking to its live site, unchanged.
5. **The top bars** keep "Balogun Oluwasogo" and "All work" linking to `/`.

The order is JobTrackr → Acetrail → Artifacts → Now Playing, and Now Playing's footer loops back to JobTrackr.

---

## 9. `<head>`

Copy `acetrail.html`'s head and change:

- **`<title>`:** `Artifacts — Balogun Oluwasogo`.
- **Description** (meta and `og:description`): "An archive of interface interactions and motion studies from my projects, each rebuilt as a standalone piece in Next.js, TypeScript and GSAP."
- **Canonical and `og:url`:** `https://www.balogunoluwasogo.com/work/artifacts`.
- **`og:image` and `twitter:image`:** `https://www.balogunoluwasogo.com/assets/images/case/artifacts/og.jpg` (1200×630).
- No Figtree: drop anything the Acetrail head has for it.

---

## 10. Responsive behaviour

The rules of the other two pages hold:

- **Below 1024px:** one column; text, the collection, the palettes, the timing chart and the phone pair capped at `$measure` on tablets.
- **From 1024px:** the 12-column grid. Only the display, subtitle and heading sizes are fluid.
- **Never** size anything with `100vw`.

Specific to this page:

- **Hero picture:** switches source at 1024px, with the layout.
- **Photo pairs:** two columns from 1024px, one column below.
- **Phone pair:** two columns at every width; columns 5–8 and 9–12 from 1024px.
- **Timing chart:** the 5fr / 7fr rows hold down to 1024px inside columns 5–12; below that the rows stack.

---

## 11. Acceptance checks (run all of them before handing back)

1. `npm run typecheck` and `npm run build` pass, with no console errors on any of the four pages.
2. **Pixel match** against `reference/desktop.html` at 1440×900 and `reference/mobile.html` at 390×844: full page, fonts loaded, reduced motion emulated, the largest image served to both sides, the clock pinned. The desktop page is about 18,340px tall, so capture it in slices (CLAUDE.md, "Running the screenshot diff"). Report any remaining difference and why.
3. **No horizontal scroll** at 320, 360, 390, 600, 768, 1023, 1024, 1280, 1366, 1440, 1920 and 2560, with real scrollbars.
4. **Keyboard:**
   - Tab runs through the top bar, the site link, each video toggle in page order, "Now Playing", then the footer links.
   - Focus-visible outlines stay on.
5. **Motion:**
   - With reduced motion, nothing plays and no `.mp4` is requested.
   - Without it, a video plays only in view and pauses on leaving.
   - Every video can be paused from the keyboard.
6. **Linking:**
   - From the home list (desktop) and the sheet (mobile), JobTrackr, Acetrail and Artifacts open their case studies in the same tab.
   - Acetrail's footer opens `/work/artifacts` in the same tab.
   - Artifacts' footer opens `/work/now-playing` in the same tab (once that page is built).
   - All That Is Kim still opens its site in a new tab from the home page.
   - `/work/artifacts` works in `npm run dev`, `npm run preview` and the built `dist/`.
7. **JobTrackr and Acetrail unchanged:** re-run both pixel matches against their references after the shared SCSS changes. Acetrail's reference now has "Artifacts" in the footer; nothing else on either page may move.
8. **Docs:** README and CLAUDE.md updated (§2).
9. Summarise the files changed and the key decisions. Don't commit or push.

---

## 12. Facts to keep as written (checked against the Artifacts repo at `1d810e5` and the live site)

- **The collection:** ten artifacts, numbered 001–010, with the types and origins in the registry (`src/artifacts/artifact.data.ts`). Six existed on 19 September 2026; the rest were added by 26 September.
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, SCSS Modules, GSAP with ScrollTrigger, `next/image` with AVIF and WebP, Inter Tight and Syne, Google Analytics 4, hosted on Vercel. Every route is statically generated.
- **The archive:** the wheel maps to sideways scrolling only from 901px, only when the vertical movement is larger and only while there's room to move; the position is kept in session storage and used once; the theme script runs in the document head.
- **Block Orbit:** six faces, one turn every 16 seconds, pointer tilt on fine pointers only, paused off screen or in a hidden tab, a fixed angle with reduced motion.
- **Split Menu:** a native modal dialog; the panel wipes in from the right, the cards rise 55 ms apart; with a mouse the card under the pointer widens and grows; on touch the cards become a vertical list with the middle one highlighted.
- **Scroll Cinema:** a ScrollTrigger scrub over 1.8 viewport heights (1.15 at 700px and below), overscanned 1.015; the cinema view is a separate video with sound in a modal dialog.
- **Palette Shift:** a 32 × 32 canvas, every fourth pixel, transparent and very dark or light pixels skipped, clamped and cached. The four palettes in §6.3 were read from the running page.
- **Track Transition:** phases idle, preparing, departing (180 ms), committing, arriving; artwork 620 ms, details 520 ms from 20 to 220 ms, title words 420 ms, 26 ms apart; clean-up at 900 ms after arrival; a generation number and an abort for every request.
- **The performance pass (27 September 2026):** the 10 MB 4K clip replaced in the card by a 6-second 960 × 540 clip (about 290 KB); the eight covers recompressed from 2.5 MB to 0.99 MB; 640-pixel copies (about 300 KB together) for the previews; deferred palette work; `content-visibility` on previews; transform-only preview animations; analytics loaded after the page.
- **Performance:** PageSpeed Insights on the live site on **2 October 2026**, Lighthouse 13.5, emulated Moto G Power on slow 4G.
  - Index: 98 / 96 / 100 / 100; FCP 0.9 s, LCP 2.4 s, TBT 40 ms, CLS 0.
  - Index on desktop: 100 / 96 / 100 / 100.
  - Scroll Cinema page: 99 / 95 / 100 / 100.
- **Rules:**
  - Don't change these numbers without re-running PageSpeed, and update the date in the caption if you do.
  - Don't add claims, metrics or testimonials.
