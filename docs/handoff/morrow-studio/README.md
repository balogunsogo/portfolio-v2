# Morrow Studio case study: implementation handoff

Build the Morrow Studio case study as the site's fifth case study, pixel-perfect to the approved design, and link it into the site as the **second** project, after JobTrackr.

- **URL:** `/work/morrow-studio`
- **Pixel targets:** `reference/desktop.html` at **1440 × 900** and `reference/mobile.html` at **390 × 844**.
- **Starting point:** JobTrackr, Acetrail, Artifacts and Now Playing are built and live (`src/work/*.html`, `src/scss/_case.scss`, `src/ts/media.ts`). This page is built **only from components those pages already have**: the shell, type, grid, text blocks, plates, video behaviour, the still pair, side figures, the definition list, the two-column lists, scores, process, stack, outcome and footer. There are no new components, tokens or section-gap entries.
- **Stack and rules:** unchanged (`CLAUDE.md`). Plain HTML, SCSS and TypeScript; no new dependencies, no new fonts.

> **Update 1 (7 October 2026).** The page is built and live. This update rewrites the Sanity part and replaces the home preview image. What changed, in short:
>
> - **The CMS (§5.7)** keeps its heading and first paragraph, gets a new second paragraph, and shows Oluwasogo's own Studio screenshot as captured instead of the laptop render. The still pair and the schema/Studio lists move out of it.
> - **Editing (§5.8)** is a new section after The CMS: two Studio screenshots as captured, a pair of 1:1 crops from his screenshots, and the schema/Studio lists.
> - **Preview (§5.9)** gets a new second paragraph.
> - **Media (§7):** eight new Studio files; the laptop render and the two 700px crops are no longer used and are deleted.
> - **Home preview:** `projects/morrow-studio.webp` and `morrow-studio-480.webp` are replaced in place (same names, same sizes) with a centred framing of the same desk, so the preview frame's centre crop keeps the whole display and phone. No code change.
> - Nothing else on the page changes. `PROMPT-UPDATE.md` is the prompt for this update.

---

## 1. Sources of truth

| Priority | File | What it settles |
|---|---|---|
| 1 | `reference/desktop.html`, `reference/mobile.html` | Exact appearance at 1440 and 390: sizes, gaps, grid spans, colours, ratios, line breaks and the final copy. Open them in a browser; they load the font and media from `src/assets`. Their inline styles are a reference only: build with classes. |
| 2 | `reference/desktop-1..3.webp`, `reference/mobile-1..3.webp` | Full-page screenshots of the two references, with reduced motion (videos show their posters). |
| 3 | This README | Reuse map, behaviour between and beyond the two widths, media, linking, `<head>` and acceptance checks. |
| 4 | `CLAUDE.md`, the other four handoffs, and the built pages | Every shared rule this README doesn't repeat (fluid type, optical alignment, video markup, images, footer, the screenshot-diff method). |

If the reference and this README disagree: the reference wins on **appearance at 1440 and 390**; this README wins on **behaviour**.

On the design canvas the page is four artboards per layout only because of the canvas's size limit. The real page is **one continuous page**, as the reference pages show it.

---

## 2. Files

**Create**

- `src/work/morrow-studio.html`. Copy the shell of `now-playing.html`: the `<head>` pattern (§9), the `.case` wrapper, the `.case-top` bar, `<main class="case__main">`, and the `.case-foot` footer with the clock and links.

**Already in place** (final; don't regenerate, recompress, re-crop or re-cut):

- `src/assets/images/case/morrow-studio/*.webp` and `og.jpg`, including the eight Studio files from update 1 (§7)
- `src/assets/video/morrow-studio/*.mp4`
- `src/assets/images/projects/morrow-studio.webp` and `morrow-studio-480.webp`
- `docs/handoff/morrow-studio/**`

**Modify**

- **Linking** (§8): `src/ts/projects.ts` (a new entry, second in the list) and `src/work/jobtrackr.html` (footer link only).
- `docs/handoff/jobtrackr/README.md` is already updated for the new footer link; nothing else in the JobTrackr handoff changes. Its reference pages keep the old footer text ("Acetrail"), so expect that one difference in its pixel diff.
- `README.md` and `CLAUDE.md`: document the fifth case study and the new chain (CLAUDE.md "Case studies" covers all five pages; add a short "Morrow Studio only" list).

**Delete (update 1):** `studio-laptop-1200.webp`, `studio-laptop-2400.webp`, `studio-home-700.webp` and `studio-about-700.webp` in `src/assets/images/case/morrow-studio/`, and the git-ignored `studio-laptop.png` there. Nothing uses them any more.

**Not expected to change:** `src/scss/_case.scss` and `src/ts/*` apart from `projects.ts`. If you find you need a SCSS change, keep it scoped and re-run all five pixel diffs.

**Out of scope:** the home page layout and styles, the other case studies apart from JobTrackr's footer link, and the Morrow Studio site itself.

---

## 3. Optical modifiers

The same rule as the other pages: every line in the display, subtitle, heading, statement, list-item and label styles gets the modifier for its first glyph. The reference carries the exact `margin-left` on each line. All of these modifiers exist already:

- **Display:** "Morrow Studio" `.case-display--stem`. The footer's "Acetrail" starts on A and gets none, as on JobTrackr's footer today.
- **Subtitle:** "Designing both sides…" `.case-subtitle--stem`.
- **Headings:**
  - `--stem`: "Mobile is an edit, not a stack.", "Edit a draft, see it in the site, then publish.", "Designed first, then built to match.", "Next.js in front, Sanity behind."
  - `--t`: "Ten case studies, one renderer.", "The site wasn't the only interface.", "Ten projects, moved in by script.", "The last stage removed differences."
  - `--round`: "Quiet frame, loud work.", "Organised like the site, in the editors' words."
  - `--s`: "Sanity holds the content. The code holds the layout."
  - none: "A fictional studio, built like a real one."
- **Outcome statement:** "What began as a way…" `--w` (the heading style's W modifier).
- **List items** (§5.9): "Edit", "Draft", "Preview", "Publish" `.case-item--stem`.
- **Labels:**
  - `--stem`: "Design", "Mobile", "Editing", "Preview", "Migration", "Process", "Next project"; the list labels "In Sanity", "In code", "Forma on desktop", "Forma on a phone", "In the schema", "In the Studio"; the score names "Projects published", "Images mapped", "Uploaded", "Reused"; the stack groups "Front end", "Images", "Hosting".
  - `--round`: "Context", "Content model", "QA", "Outcome", and the stack group "CMS".
  - `--t`: "Ten projects", "The CMS", and the stack group "Testing".
  - `--s`: "Stack".
  - The stack group "Preview" is `--stem`, like the section label.

If a line here and the reference disagree, the reference's `margin-left` wins: it was generated from the font's own side bearings.

---

## 4. Shell and section rhythm

Identical to the other pages: page padding, the 104px / 160px section gap, the top bar, the 12-column grid, `.case-text` for label, heading and body. Captions sit 12px under their media at both widths (`.case-figure--snug`, or the 12px gap the comparison items already have).

**Gap between a section's blocks**, all existing entries of `$case-section-gaps`:

| Section | Mobile | Desktop | Modifier |
|---|---|---|---|
| Context, Design, Ten projects, Mobile, The CMS, Editing, QA | 36px | 64px | none (default) |
| Content model | 40px | 80px | `case-section--engineering` |
| Preview | 40px | 80px | `case-section--rules` |
| Migration | 32px | 64px | `case-section--performance` |
| Process | 40px | 80px | `case-section--process` |
| Stack | 28px | 56px | `case-section--stack` |
| Outcome | 24px | 48px | `case-section--outcome` |

**Plates:** `.case-plate--medium` (12 / 32px) only, for the system stills and the Work archive video. Every other image and video on this page sits without a plate: the device renders carry their own setting, the Studio screenshots carry the Studio's own dark frame, and the QA sheet has its plate colour (`#ECEBE6`, `$plate-clip`) baked in.

---

## 5. Page structure, section by section

The copy is final: take every string **verbatim** from the reference HTML. Semantics follow the other pages: `<header>` for the top bar; `<main>` with one `<section aria-labelledby>` per block; `<footer>`; the title is the only `<h1>`, section headings are `<h2>`; each piece of media with a caption is a `<figure>` with a `<figcaption>`.

### 5.1 Hero

Same structure and classes as Now Playing's hero.

- **Copy:** title "Morrow Studio"; subtitle "Designing both sides of a portfolio: the experience visitors see and the CMS editors use behind it."
- **Meta:**
  - Role: "Design and engineering".
  - Year: 2026.
  - Stack: "Next.js, Sanity, / TypeScript, SCSS" (line break after "Sanity," on desktop).
  - Status: "Live". The site link `morrowstudio.balogunoluwasogo.com` goes to `https://morrowstudio.balogunoluwasogo.com/` in a new tab, with the visually hidden suffix.
- **Image: art-directed.** A `<picture>` switching at 1024px with `.case-media--hero` (4:5 below desktop, 3:2 from it):
  - **Desktop:** `hero-1200.webp` / `hero-2400.webp` (2400×1600, exactly 3:2): the home page on a display and a phone, on a stone table under an arch of afternoon light.
  - **Below desktop:** `hero-phone-1200.webp` / `hero-phone-1600.webp` (1600×2000, exactly 4:5): the home page on a phone lying on the same stone, in a band of light.
  - Both files are already cropped to their ratio, so no `object-position` is needed.
  - **Alt:** one for both sources, true of both renders: "Morrow Studio's home page on screen, on a stone table in afternoon light".
  - `fetchpriority="high"` and `sizes` as on the Now Playing hero.

### 5.2 Context

`.case-text`, then a full-width `.case-figure.case-figure--snug` holding the video **without a plate**: `home-motion.mp4` (1920×1080, **16:9**, `.case-video__media--widescreen`) in the standard `.case-video` markup. Caption in columns 1–6 on desktop.

### 5.3 Design

`.case-text` (heading "Quiet frame, loud work."), then the **still pair** exactly as Now Playing's scene pair: `.case-compare.case-compare--stack`, each item a `.case-plate.case-plate--medium` holding an `img.case-media.case-media--screen` (16:10), then its caption.

- `system-colour-1200.webp` / `system-colour-2400.webp` (2400×1500): "The principles and the palette."
- `system-type-1200.webp` / `system-type-2400.webp` (2400×1500): "The type scale, in Geist and Geist Mono."

### 5.4 Ten projects

`.case-text`, then:

1. A full-width `.case-figure.case-figure--snug` with `img.case-media.case-media--landscape` (3:2, no plate): `projects-phones-1200.webp` / `projects-phones-2400.webp` (2400×1600). Caption in columns 1–6.
2. A `.case-figure.case-figure--side.case-figure--snug` with `work-archive.mp4` (1440×900, **16:10**) in a **medium plate** as `.case-figure__media` (media in columns 5–12, caption in 1–4, bottom-aligned; stacked on mobile, media first), as Now Playing's artwork figure.

### 5.5 Content model

`.case-text` with two paragraphs, then `.case-lists`: "In Sanity" in columns 1–6 and "In code" in columns 7–12 on desktop, stacked 40px apart on mobile. Six lines each, in the reference's order. The lines are two separate lists, not pairs; keep them as two `<ul>`s as the component already is. Section modifier `case-section--engineering`.

### 5.6 Mobile

`.case-text` with two paragraphs, then:

1. A `.case-figure.case-figure--side.case-figure--snug` whose `.case-figure__media` holds the square video **without a plate**: `phone-motion.mp4` (1080×1080, **1:1**, `.case-video__media--square`). Caption in columns 1–4, bottom-aligned.
2. `.case-lists` with "Forma on desktop" and "Forma on a phone", nine lines each, in the reference's order. Row by row the two lists line up, so the reader can compare positions.

### 5.7 The CMS

`.case-text` with two paragraphs (the first unchanged, the second new; its example "01 · Hospitality · 2026" is joined by no-break spaces, as in the reference, so it never splits across lines), then one full-width `.case-figure.case-figure--snug` holding an **art-directed** `<picture>` with a plain `img.case-media` and **no plate**, exactly the QA sheet's pattern (§5.11): no ratio class, a `width` and `height` on the `<source>` and on the `<img>`, and both captions in the `<figcaption>` with `.case-from-desktop` / `.case-below-desktop`.

- **From 1024px:** `studio-projects-1366.webp` (1366×768): the whole screenshot, as captured. Caption: the desktop caption in the reference.
- **Below 1024px:** `studio-projects-mobile.webp` (642×632): a 1:1 crop of the same screenshot (the Content list and the ten projects). Caption: the mobile caption in the reference.
- One alt for both, from the reference. Each source is a single file (no larger one exists), so its `srcset` is the one URL with no `sizes`.

The still pair and the two-column lists that used to follow move to §5.8 (the lists) or go (the pair).

### 5.8 Editing (new in update 1)

A new `<section class="case-section" aria-labelledby="editing-heading">` straight after The CMS, at the default gap (36 / 64px).

1. `.case-text`: label "Editing" (`.case-label--stem`), heading "Organised like the site, in the editors' words." (`.case-h--round`, `id="editing-heading"`), two paragraphs.
2. A full-width figure built like §5.7: `studio-home-1366.webp` (1366×768) from 1024px, `studio-home-mobile.webp` (640×552) below. **One** caption for both layouts.
3. A pair: `.case-compare.case-compare--stack`, each item a `figure.case-compare__item` holding a plain `img.case-media` (no ratio class, no plate) and its `figcaption.case-caption`, as Artifacts' photo pairs but without a ratio class. Columns 1–6 and 7–12 on desktop, stacked 40px apart below.
   - `studio-availability.webp` (640×512, 5:4)
   - `studio-hero-image.webp` (640×512, 5:4)
4. A full-width figure built like §5.7: `studio-about-1366.webp` (1366×768) from 1024px, `studio-about-mobile.webp` (640×552) below. One caption.
5. `.case-lists` with "In the schema" and "In the Studio", seven lines each, moved here from The CMS unchanged (same markup and ids). The rows are pairs: each Studio line is what the schema line beside it became.

### 5.9 Preview

`.case-text` (the second paragraph is new in update 1), then JobTrackr's `.case-list` (a `<dl>`): four rows, the name in the list-item style in columns 1–4, the text muted in columns 5–10. Section modifier `case-section--rules`.

### 5.10 Migration

`.case-text`, then `.case-scores` with four items and **no vitals**, then the caption in `.case-cols` (columns 1–6 on desktop), as Now Playing's Performance block. Section modifier `case-section--performance`.

- **10** Projects published, **65** Images mapped, **56** Uploaded, **9** Reused.

### 5.11 QA

`.case-text`, then a full-width `.case-figure.case-figure--snug` holding an **art-directed** `<picture>` with a plain `img.case-media` (no ratio class: each source keeps its own shape, so give each `<source>` and the `<img>` their `width` and `height`):

- **From 1024px:** `widths-1400.webp` / `widths-2800.webp` (2800×729): the home page at six widths in a row. Caption: the desktop caption in the reference.
- **Below 1024px:** `widths-mobile-800.webp` / `widths-mobile-1600.webp` (1600×1200, 4:3): the three mobile widths. Caption: the mobile caption in the reference.

The caption changes with the image, so render both captions and show one per layout with the existing `.case-from-desktop` / `.case-below-desktop` helpers.

### 5.12 Process

Reuse `.case-process` with the five steps from the reference: Design, Build, Content model, Migration, Refinement.

### 5.13 Stack

Reuse `.case-stack`. Heading: "Next.js in front, Sanity behind." Six groups, in the reference's order.

### 5.14 Outcome

Reuse the outcome block: statement in columns 1–10, body in columns 7–11, disciplines line in columns 1–9, with a no-break space before each middle dot (`&nbsp;&middot; `).

### 5.15 Footer

Reuse `.case-foot`. "Next project": **Acetrail**, linking to `/work/acetrail` in the same tab, with `acetrail-480.webp` (480×360) as its thumb: the markup JobTrackr's footer uses for Acetrail today, moved here unchanged.

---

## 6. Components

There are no new components. The reuse map:

| On this page | Built with | From |
|---|---|---|
| Hero picture | `.case-media--hero` in a `<picture>` | Artifacts, Now Playing |
| Large video, no plate (§5.2) | `.case-figure--snug` + `.case-video__media--widescreen` | Artifacts' archive figure, without its plate |
| Still pair in plates (§5.3) | `.case-compare--stack` + `.case-plate--medium` + `.case-media--screen` | Now Playing's scene pair |
| Full-width photo (§5.4) | `.case-figure--snug` + `.case-media--landscape` | Artifacts |
| Studio screenshots, art-directed (§5.7, §5.8) | `.case-figure--snug` + `<picture>` + plain `.case-media`, captions with `.case-from-desktop` / `.case-below-desktop` where they differ | this page's QA sheet |
| Screenshot pair, no plate (§5.8) | `.case-compare--stack` + plain `.case-media` | Artifacts' photo pairs |
| Side video in a plate (§5.4) | `.case-figure--side` + `.case-plate--medium` | Now Playing |
| Side video, no plate (§5.6) | `.case-figure--side` + `.case-video__media--square` | Now Playing's side figure |
| Two-column lists (§5.5, §5.6, §5.8) | `.case-lists` | Acetrail, Now Playing |
| Definition list (§5.9) | `.case-list` | JobTrackr, Now Playing |
| Numbers (§5.10) | `.case-scores` without vitals | Now Playing |
| Art-directed sheet (§5.11) | `<picture>` + `.case-media` | the hero pattern |
| Process, stack, outcome, footer | as built | all |

---

## 7. Media

Give every `<img>` its `width` and `height`. Use `loading="lazy" decoding="async"` everywhere except the hero.

| Use | Files (intrinsic px) | Ratio | Alt / label (from the reference) |
|---|---|---|---|
| Hero, desktop | `hero-1200.webp`, `hero-2400.webp` (2400×1600) | 3:2 | see §5.1 |
| Hero, mobile | `hero-phone-1200.webp`, `hero-phone-1600.webp` (1600×2000) | 4:5 | see §5.1 |
| Home in motion | `video/morrow-studio/home-motion.mp4` (1920×1080, 25.6 s), `home-motion-poster.webp` | 16:9 | from the reference |
| System stills | `system-colour-1200/2400.webp`, `system-type-1200/2400.webp` (2400×1500) | 16:10 | from the reference |
| Three projects | `projects-phones-1200/2400.webp` (2400×1600) | 3:2 | from the reference |
| Work archive | `work-archive.mp4` (1440×900, 26.4 s), `work-archive-poster.webp` | 16:10 | from the reference |
| Phone in motion | `phone-motion.mp4` (1080×1080, 27.3 s), `phone-motion-poster.webp` | 1:1 | from the reference |
| Studio, Aster House (§5.7) | `studio-projects-1366.webp` (1366×768) from 1024px, `studio-projects-mobile.webp` (642×632) below | as captured | from the reference |
| Studio, Home (§5.8) | `studio-home-1366.webp` (1366×768), `studio-home-mobile.webp` (640×552) | as captured | from the reference |
| Studio, two fields (§5.8) | `studio-availability.webp`, `studio-hero-image.webp` (640×512) | 5:4 | from the reference |
| Studio, About (§5.8) | `studio-about-1366.webp` (1366×768), `studio-about-mobile.webp` (640×552) | as captured | from the reference |
| QA sheet | `widths-1400/2800.webp` (2800×729), `widths-mobile-800/1600.webp` (1600×1200) | natural / 4:3 | from the reference |
| Share image | `og.jpg` (1200×630) | — | — |
| Home list and footer thumb | `projects/morrow-studio.webp` (1200×800), `projects/morrow-studio-480.webp` (480×320), replaced in place in update 1 | 3:2 | — |

- **`sizes`:** copy them from the matching Now Playing or Artifacts element (hero, full-width photos, pairs, side figures).
- **Videos:** the standard markup and toggle, with `media.ts` unchanged. Every video is silent. Three videos; the keyboard order runs through their toggles in page order.
- **Where the media came from:**
  - **The site.** The recordings and screen stills are of the Morrow Studio site built from its repo at the live commit (`0798ad6`, 6 October 2026), with its published content, served locally and captured frame by frame: desktop at 1440 × 900, phone at 390 × 794 on a 2× (recordings) or 3× (stills) screen. The pointer and the touch circle are drawn in for the recording. The local render's text matched the live site's.
  - **The devices.** The display, phone and laptop scenes are 3D renders made for this case study, in the light the design system describes: limewash tones and natural light. The site's frames are composited onto each screen afterwards, in their own colours, so nothing on a screen is redrawn. The phone's status bar is drawn in.
  - **The system stills** are the "Visual language & system" board from the Morrow design file, rendered at 2×.
  - **The Studio.** Oluwasogo's own screenshots of the hosted Studio (1366×768, captured in his browser), shown as captured. The `-1366` files are the screenshots themselves, converted to lossless WebP, so every pixel is his. The mobile files and the 5:4 pair are 1:1 crops of the same screenshots: nothing is redrawn, retouched or enlarged in the files. On wide desktops the page scales them up like any full-width image; no larger capture exists. Two of his screenshots showed a browser address and are not used.
  - **The home preview** (`projects/morrow-studio.webp`, `-480`) is a third framing of the hero's desk: the same render setup, display and captured home page, with the camera centred on the display and the phone moved closer. The preview frame crops it with `object-fit: cover` to anything from about 1.1:1 (1280 wide) to 1.7:1 (1920), and 4:3 in the sheet; the display and phone stay inside all of those. The first version had a 13px black strip along its bottom edge, which is gone.

---

## 8. Linking the case studies

Do all of this **in the same change as the new page**, so no link points at a page that doesn't exist yet.

1. **`projects.ts`:** add Morrow Studio as the **second** entry, after Jobtrackr:

   ```ts
   {
     title: 'Morrow Studio',
     meta: 'Website and CMS · Design and engineering',
     description:
       'A portfolio for a fictional creative studio, with ten case studies and a Sanity CMS designed around the people who edit it.',
     role: 'I designed the studio and its site, built it in Next.js and Sanity, and designed the editing experience behind it.',
     image: 'assets/images/projects/morrow-studio.webp',
     href: 'https://morrowstudio.balogunoluwasogo.com/',
     external: true,
     caseStudy: '/work/morrow-studio',
     previewTone: '#DED6CB',
     previewInk: '#4A443C',
     stemAligned: true,
   },
   ```

   The home list (desktop) and the sheet's "Read case study" (mobile) then follow automatically.
2. **`jobtrackr.html` footer:** "Next project" becomes **Morrow Studio**, built exactly like Artifacts' footer link to Now Playing (a two-word name that wraps on phones): `<p class="case-display case-display--stem case-display--balance">`, the link to `/work/morrow-studio`, and `<span class="case-nowrap">` around the thumb and "Morrow". The thumb is `morrow-studio-480.webp` (`width="480" height="320"`). The JobTrackr handoff already says so.
3. **`morrow-studio.html` footer:** "Acetrail" links to `/work/acetrail` (§5.15).
4. **All That Is Kim** keeps linking to its live site from the home page. The top bars keep "Balogun Oluwasogo" and "All work" linking to `/`.

The chain is JobTrackr → Morrow Studio → Acetrail → Artifacts → Now Playing → JobTrackr.

---

## 9. `<head>`

Copy `now-playing.html`'s head and change:

- **`<title>`:** `Morrow Studio — Balogun Oluwasogo`.
- **Description** (meta and `og:description`): "A portfolio for a fictional creative studio, designed and built in Next.js with a Sanity CMS shaped around its editors: ten case studies, mobile edits, live preview and a scripted migration."
- **Canonical and `og:url`:** `https://www.balogunoluwasogo.com/work/morrow-studio`.
- **`og:image` and `twitter:image`:** `https://www.balogunoluwasogo.com/assets/images/case/morrow-studio/og.jpg` (1200×630).

---

## 10. Responsive behaviour

The rules of the other pages hold:

- **Below 1024px:** one column; text capped at `$measure` on tablets.
- **From 1024px:** the 12-column grid. Only the display, subtitle and heading sizes are fluid.
- **Never** size anything with `100vw`.

Specific to this page:

- **Hero picture, the three Studio screenshots and the QA sheet:** switch source at 1024px, with the layout. On tablets (600 to 1023px) the Studio crops fill the column like the other full-width media.
- **Still pairs and two-column lists:** two columns from 1024px, one column below (the pairs capped at `$measure` on tablets, as `.case-compare` already is).
- **Side figures:** media in columns 5–12 from 1024px; stacked, media first, below.
- **Height (after update 1):** the desktop page is about 17,727px tall, over Chrome's 16,384px screenshot limit, so capture its pixel diff in two parts, as JobTrackr's (CLAUDE.md, "Running the screenshot diff"). The mobile page is about 15,513px and still fits one capture.

---

## 11. Acceptance checks (run all of them before handing back)

1. `npm run typecheck` and `npm run build` pass, with no console errors on any of the six pages.
2. **Pixel match** against `reference/desktop.html` at 1440×900 and `reference/mobile.html` at 390×844: full page, fonts loaded, reduced motion emulated, the largest image served to both sides, the clock pinned. The desktop page needs two captures now (§10). Report any remaining difference and why.
3. **No horizontal scroll** at 320, 360, 390, 600, 768, 1023, 1024, 1280, 1366, 1440, 1920 and 2560, with real scrollbars.
4. **Keyboard:**
   - Tab runs through the top bar, the site link, each video toggle in page order, "Acetrail", then the footer links.
   - Focus-visible outlines stay on.
5. **Motion:**
   - With reduced motion, nothing plays and no `.mp4` is requested.
   - Without it, a video plays only in view and pauses on leaving.
   - Every video can be paused from the keyboard.
6. **Linking:**
   - From the home list (desktop) and the sheet (mobile), all five case studies open in the same tab, with Morrow Studio second.
   - JobTrackr's footer opens `/work/morrow-studio`, and Morrow Studio's opens `/work/acetrail`.
   - All That Is Kim still opens its site in a new tab from the home page.
   - `/work/morrow-studio` works in `npm run dev`, `npm run preview` and the built `dist/`.
7. **The other pages unchanged:** JobTrackr differs from its reference only in the footer's next project. If any shared SCSS changed, re-run the other four pixel matches. Otherwise confirm that `_case.scss` is untouched.
8. **Docs:** README and CLAUDE.md updated (§2).
9. **Update 1 only:** nothing in `src/` references `studio-laptop` or `studio-*-700` any more and those files are gone; the home preview shows the new image at 1280, 1366, 1440 and 1920 wide and in the mobile sheet, with the display and phone whole; the JobTrackr footer thumb is the new 480px file.
10. Summarise the files changed and the key decisions. Don't commit or push.

---

## 12. Facts to keep as written (checked against the Morrow repo at `0798ad6`, its migration reports and the live site)

- **Repo and history:** `balogunsogo/morrowstudio`. Created 4 October 2026; the site, the Studio and the migration tooling 5 October; responsive, navigation, performance and accessibility refinements 6 October. The design system board is dated "V1.0 — October 2026".
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, SCSS; Sanity Studio 5 with GROQ, Portable Text, Presentation, Visual Editing and Draft Mode; Playwright for QA; Vercel, and Sanity's Studio hosting at `morrow-studio.sanity.studio`.
- **Content:** ten projects, ranked by **Project order**; ten block types (text, full-width image, contained image, image pair, statement, image + text, gallery, video, quote, credits). Mobile overrides: mobile hero image, mobile project labels, mobile section order, Desktop + mobile / Desktop only / Mobile only on blocks, gallery and credit subsets. One shared renderer builds every project page; each project's composition (spans, offsets, image ratios) comes from presentation rules generated from the design source, keyed to the project and each block's stable key (`src/styles/_source-compositions.scss`). Editors get a few preset options (contained-image size and alignment, image position, statement and quote alignment, gallery layout, Home feature layout) but no free widths or offsets.
- **Aster House on a phone:** a shorter overview, a mobile-only "Direct booking" image-and-text block and film, and a gallery of four (six on desktop).
- **Forma's orders** are the two lists in §5.6, from its published document.
- **Preview:** changes save as drafts and the public site stays on the published version; Presentation shows the draft in the site with the text and images linked to their fields (stega and data attributes), at desktop and mobile sizes. The migration reports did not test field focus with a signed-in Studio session, so the copy says "linked back to the fields" rather than describing a click.
- **Studio language:** groups Overview / Archive / Case Study / Mobile (projects); Hero / Featured Work / Studio / Project Index / Footer / Mobile (Home); Intro / Images / Biography / Capabilities / Clients / Recognition / Contact / Mobile (About). Field titles as in the "In the Studio" list. Project previews read "01 · Hospitality · 2026". Placeholder copy raises a non-blocking warning; the films for Aster House, Nocturne and Kiln are poster-only, labelled "Poster only — video source pending".
- **The Studio, as update 1 describes it** (`structure.ts`, `schemaTypes/**`, `components/StudioGuidance.tsx`, `presentation/resolve.ts`, `docs/STUDIO-GUIDE.md`, `STUDIO-UX-FINAL.md`, and Oluwasogo's screenshots):
  - Hosted by Sanity at `morrow-studio.sanity.studio`, behind Sanity's normal login. The Content tool lists only Home, About and Projects; projects are ordered by Project order (`orderRank`) and preview with the cover image and "number · sector · year".
  - Every top-level field on Home (23), About (20) and Project (17) belongs to a group. Home opens on Hero and a project on Overview (the default groups); Sanity's own "All fields" tab comes first in the tab row.
  - The Mobile group is last on all three documents and only holds optional small-screen overrides; anything unset there falls back to the main content. (An explicitly empty mobile selection shows nothing; the copy says "unset" on purpose.)
  - Placeholder copy is matched in brackets (for example "[Founder name]", in About's portrait caption) and raised as a document-level warning, which marks the groups that hold it and doesn't block publishing.
  - The two custom checks the copy names are errors, so they block publishing, and both say how to fix them: a project hero image without alternative text, and a Project order another project already uses. Sanity's built-in required checks only say "Required", hence "the custom ones" in the copy.
  - "Used on N pages" comes from Presentation's document locations: Home and About list one page each; a project lists its own page and the Work archive. Projects also appear on Home, which the locations don't list, so the copy says "lists", not "appears on".
  - The editors' guide is `docs/STUDIO-GUIDE.md` in the Morrow repo: logging in through undoing and restoring edits.
  - The Presentation preview in the hosted Studio isn't in any screenshot, and the reports left a signed-in check of overlays and field focus to a person. The copy keeps the claims the earlier version made ("linked back to the fields", "on desktop and on mobile") and adds none.
- **Migration** (`migration/reports/FINAL-COMPLETION.md`): published 5 October 2026; 10 projects plus Home and About; 5 projects created, 5 patched, IDs preserved; 65 image binaries mapped, 56 uploaded, 9 reused; one unused source image skipped.
- **QA** (`VISUAL-REFINEMENT-FINAL.md`, `INTERACTION-POLISH-FINAL.md`): 13 routes captured at 1440, 1024, 768, 760, 390 and 320; the mobile layout starts at 760px and below; the final sweep passed 52/52 route-and-width checks and 60/60 interaction scenario groups; 41 tests.
- **Rules:**
  - Don't add claims, metrics or testimonials.
  - The Studio screenshots are Oluwasogo's; show them as captured (the files are already the right crops) and don't replace them with mockups of the Studio.
