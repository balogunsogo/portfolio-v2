# Acetrail case study: implementation handoff

Build the Acetrail case study as the site's second case study, pixel-perfect to the approved design, and link it into the site.

- **URL:** `/work/acetrail`
- **Pixel targets:** `reference/desktop.html` at **1440 × 900** and `reference/mobile.html` at **390 × 844**.
- **Starting point:** the JobTrackr case study (`src/work/jobtrackr.html`, `src/scss/_case.scss`, `src/ts/media.ts`) is built and live. This page uses the same shell, type, grid, text blocks, video behaviour, stack, outcome and footer. Reuse those classes as they are. Only the components in §6 are new.
- **Stack and rules:** unchanged (`CLAUDE.md`). Plain HTML, SCSS and TypeScript; no new dependencies.

---

## 1. Sources of truth

| Priority | File | What it settles |
|---|---|---|
| 1 | `reference/desktop.html`, `reference/mobile.html` | Exact appearance at 1440 and 390: sizes, gaps, grid spans, colours, ratios, line breaks and the final copy. Open them in a browser; they load fonts and media from `src/assets`. Their inline styles are a reference only: build with classes. |
| 2 | `reference/desktop-1..3.webp`, `reference/mobile-1..3.webp` | Full-page screenshots of the two references, with reduced motion (videos show their posters). |
| 3 | This README | Reuse map, new components, behaviour between and beyond the two widths, media, linking, `<head>` and acceptance checks. |
| 4 | `docs/handoff/jobtrackr/README.md` and the built JobTrackr page | Every shared rule this README doesn't repeat (fluid type, optical alignment, video markup, images, footer). |

If the reference and this README disagree: the reference wins on **appearance at 1440 and 390**; this README wins on **behaviour**.

On the design canvas the page is three artboards per layout only because of the canvas's size limit. The real page is **one continuous page**, as the reference pages show it.

---

## 2. Files

**Create**

- `src/work/acetrail.html`. Copy the shell of `jobtrackr.html`: the `<head>` pattern (§9), the `.case` wrapper, the `.case-top` bar, `<main class="case__main">`, and the `.case-foot` footer with the clock and links.

**Already in place** (final; don't regenerate, recompress or re-cut):

- `src/assets/images/case/acetrail/*.webp` and `og.jpg`
- `src/assets/video/acetrail/*.mp4`
- `src/assets/fonts/figtree-latin-wght.woff2`. This is Ace Trail's own typeface, used only for the type specimen in §5.4. Figtree is under the SIL Open Font License.
- `docs/handoff/acetrail/**`

**Modify**

- `src/scss/_case.scss`: the new components in §6, the section-gap entries and figure modifier in §4, and the subtitle optical modifiers in §3.
- `src/scss/_tokens.scss`: the tokens in §3.
- `src/scss/_fonts.scss`: the Figtree `@font-face` in §3.
- **Linking** (§8): `src/ts/projects.ts` and `src/work/jobtrackr.html`.
- `README.md` and `CLAUDE.md`: document the second case study and the linking. Generalise the "Case study (`/work/jobtrackr`)" section in CLAUDE.md to cover both pages.

**Out of scope:** the home page layout and styles, the JobTrackr page apart from its footer link, and any other case study.

---

## 3. Tokens, font and optical modifiers

Add to `_tokens.scss`:

```scss
// Ace Trail's palette. Used only in the Directions swatches and the type specimen.
$acetrail-ground: #f6f3eb;
$acetrail-ink: #111111;
$acetrail-yellow: #ffd300;
$acetrail-yellow-pale: #fff3c4;
```

Add to `_fonts.scss` (browsers only download it when the specimen renders):

```scss
@font-face {
  font-family: 'Figtree';
  src: url('../fonts/figtree-latin-wght.woff2') format('woff2');
  font-weight: 300 900;
  font-style: normal;
  font-display: swap;
}
```

Reuse what exists:

- `$plate-clip` (`#ECEBE6`) for every plate on this page.
- `$diagram-card` (`#EBEAE5`) for the timing-chart tracks.

**Optical left edge.** It's the same rule as JobTrackr: every line in the display, subtitle, heading, statement and label styles gets the modifier for its first glyph. The reference carries the exact `margin-left` on each line. Two things are new here:

- The **subtitle** starts on T ("The site for an online IELTS school…"). Add the subtitle style to the medium-weight modifier loop so `.case-subtitle--t` exists. JobTrackr didn't need it.
- Lines starting on **M** use the **stem** modifier: M's side bearing equals the stems' (0.071em medium, 0.076em book). Examples are "Measured on a mid-range phone." and "Markup and styles".

The Performance score labels and stack group labels are in the label style, so they get the label modifiers too. The display lines ("Acetrail", and "Artifacts" in the footer) start on A and get none.

---

## 4. Shell and section rhythm

Identical to JobTrackr:

- **Page padding:** `28px 20px 32px` on mobile, `48px 64px 56px` on desktop.
- **Section gap:** 104px on mobile, 160px on desktop.
- **Top bar:** 56px above the hero on mobile, 104px on desktop.
- **Grid:** 12 columns with a 24px gutter from 1024px.
- **Text blocks:** use `.case-text` (label, heading, body in columns 7–11) everywhere a section opens with label, heading and body.

**Gap between a section's blocks.** Add the new entries to `$case-section-gaps`, and reuse the existing ones:

| Section | Mobile | Desktop | Modifier |
|---|---|---|---|
| Context, How it works, Since launch | 36px | 64px | none (default) |
| Directions | 56px | 96px | new `directions` |
| The hero (scroll) | 40px | 64px | new `hero-scroll` |
| Classes | 40px | 64px | new `classes` |
| Results | 40px | 64px | new `results` |
| Engineering | 40px | 80px | new `engineering` |
| Performance | 32px | 64px | new `performance` |
| Process | 40px | 80px | existing `process` |
| Stack | 28px | 56px | existing `stack` |
| Outcome | 24px | 48px | existing `outcome` |

**Caption gap.** Every figure on this page puts its caption **12px** under the media, on desktop as well as mobile. JobTrackr's `.case-figure` uses 16px on desktop, so add a modifier (for example `.case-figure--snug`, `row-gap: 12px`) and use it on every Acetrail figure. Don't change JobTrackr's figures. The new components in §6 already use 12px.

---

## 5. Page structure, section by section

The copy is final: take every string **verbatim** from the reference HTML. The product is written **Acetrail** in the title and **Ace Trail Tutors** or **Ace Trail** in the prose. That's deliberate, matching the brand's own usage.

Semantics follow JobTrackr:

- `<header>` for the top bar; `<main>` with one `<section aria-labelledby>` per block; `<footer>` for next project and links.
- The title is the only `<h1>`. Section headings are `<h2>`. Labels, captions and statements are `<p>`.
- Each piece of media with a caption is a `<figure>` with a `<figcaption>`.

### 5.1 Hero

Same structure and classes as JobTrackr's hero (`.case-hero`, `.case-meta`).

- **Copy:** title "Acetrail"; subtitle "The site for an online IELTS school, redesigned and rebuilt." (with `.case-subtitle--t`).
- **Meta:**
  - Role: "Design and / frontend development". On desktop there's a line break after "and".
  - Year: 2026.
  - Stack: "HTML, CSS, / JavaScript, GSAP". On desktop there's a line break after "CSS,".
  - Status: "Live". The site link `acetrailtutors.com` goes to `https://acetrailtutors.com/` in a new tab, with the visually hidden suffix.
- **Image: art-directed, not just resized.** Use a `<picture>`:
  - **Desktop** (`media="(min-width: 1024px)"`): the laptop photo `hero-1200.webp` / `hero-2064.webp` at **3:2**, `object-position: 50% 45%`.
  - **Below desktop:** the phone photo `hero-phone-1200.webp` / `hero-phone-2064.webp` at **4:5**, `object-position: 46% 50%`.
  - **Alt text:** a `<picture>` has one `alt` for both sources, so use "The Ace Trail Tutors homepage on a laptop and on a phone". This replaces the per-board alts in the reference HTML.
  - `fetchpriority="high"` and `sizes` as on JobTrackr.

### 5.2 Context

`.case-text`, then a **before/after pair** (new component, §6.1):

- **Desktop:** the desktop screenshots `home-before-desktop.webp` and `home-after-desktop.webp` at **16:10**.
  - Captions: "Before: the Webflow site." and "After: the redesign, at the same width."
- **Mobile:** the phone screenshots `home-before-mobile.webp` and `home-after-mobile.webp` at **390 / 844**.
  - Captions: "Before." and "After."
- **Implementation:** a `<picture>` per side, so each breakpoint loads only its own screenshot, plus the two caption texts in spans that show per breakpoint. The longer caption would wrap badly in a 169px column.

### 5.3 Directions

`.case-text`, then the **options grid** (§6.2) with four figures in this order:

| File | Name | Description |
|---|---|---|
| `direction-editorial.webp` | Editorial. | A large headline over a wide photo. |
| `direction-proof-cards.webp` | Proof cards. | Student photos as expanding cards. |
| `direction-study-plan.webp` | Study plan. | The five-week plan as a floating card. |
| `direction-editorial-sticky.webp` | Editorial, sticky, refined. | A single photo that grows on scroll. The one we built. |

Then the **System** block (§6.3): the label "System", four swatches, and the type specimen.

### 5.4 The hero (scroll)

Section label "The hero"; heading "One photo that opens up as you scroll."

- **Desktop:**
  1. A `.case-figure` holding the desktop video in a **large plate** (the existing `.case-plate`: 64px desktop, 16px mobile). The video is `hero-scroll-desktop.mp4`, 1440×900, **16:10**. Caption full width under it, as in `.case-figure` (the text runs about 600px, on one line): "Desktop, 1440 × 900: the photo grows over 740px of scroll, scaled to the window's height."
  2. 64px below, a 12-column row aligned to the end:
     - Columns 1–7: the **timing chart** (§6.4).
     - Columns 9–12: a figure with the phone video in a **small plate** (24px desktop, 10px mobile). The video is `hero-scroll-mobile.mp4`, 780×1688, ratio **390 / 844**. Caption: "On a phone the photo grows to the full width over 620px."
- **Mobile (40px apart):** the desktop video figure (16px plate), then the phone video figure inset `padding: 0 48px`, then the timing chart.

### 5.5 Classes

`.case-text`, then:

- A **before/after pair**: `classes-before.webp` and `classes-after.webp` at **4:3** on both breakpoints.
  - Captions: "Before: three equal cards." and "After: a table, with the open class open."
- A `.case-figure--side` (caption columns 1–4, media columns 5–12) with `classes-phone-1200/2064.webp` at **4:3**.
  - Caption: "On a phone the same row stacks: price, format and status first, then what's included."
  - On mobile the image comes first, then the caption.

### 5.6 Results

`.case-text`, then:

1. `results-1200/2064.webp` at full width, **4:3**, no plate.
2. A **before/after pair**:
   - Left: `testimonials-before.webp` at **16:9**, caption "Before: one quote at a time, in a slider."
   - Right: the video `results.mp4` (1440×810) at **16:9**, caption "After: choosing Hephzibah, Queen, then Fawaz."
   - **Mobile:** this pair **stacks** (one per row, 40px apart) instead of sitting in two columns. Use a modifier, e.g. `.case-compare--stack`.

### 5.7 How it works

`.case-text`, then a `.case-figure--side`: the caption "Scrolling through How it works on desktop." in columns 1–4, with the video `how.mp4` (1440×900) at **16:10** in a **medium plate** (32px desktop, 12px mobile) in columns 5–12.

### 5.8 Engineering

`.case-text` with three paragraphs, then two lists:

- **Desktop:** "Before" in columns 1–6 and "After" in columns 7–12.
- **Mobile:** stacked, 40px apart.
- Each list is a label followed by lines in the body style, **6px** apart on both breakpoints. Use `<ul>` with the list reset.

### 5.9 Performance

A label and heading with **no body**, set like the Stack section header: "Performance", "Measured on a mid-range phone." (`.case-h--stem`). Then the **scores grid** (§6.5), then the caption: in columns 1–6 on desktop, full width on mobile.

### 5.10 Process

Reuse `.case-process` with the five steps from the reference (Explore, Decide, Specify, Build, Verify).

### 5.11 Stack

Reuse `.case-stack`. Heading: "A small stack for a marketing site." Seven groups, in the reference's order.

### 5.12 Since launch

`.case-text`, then the reel `reel.mp4` (1440×1080) at full width, **4:3**, no plate. Use the standard video markup and toggle.

### 5.13 Outcome

Reuse the JobTrackr outcome block: statement in columns 1–10, body in columns 7–11, disciplines line in columns 1–9.

### 5.14 Footer

Reuse `.case-foot`.

- "Next project": **Artifacts**, linking to `/work/artifacts` in the same tab. (It was All That Is Kim at first; the Artifacts handoff, `docs/handoff/artifacts/README.md` §8, changed it, and the reference here shows it. All That Is Kim has no case study for now.)
- The display line uses `text-wrap: balance` so it never leaves a lone word at narrow desktop widths.

---

## 6. New components

All values are exact at 1440 / 390. Plates use `$plate-clip`.

### 6.1 Before/after pair: `.case-compare`

- **Desktop:** the 12-column grid. Figure A in columns 1–6, figure B in columns 7–12.
- **Mobile:** `grid-template-columns: repeat(2, minmax(0, 1fr))` with a **12px** column gap. The `--stack` modifier makes it one column with a 40px gap.
- **Figure:** a plate, then the caption **12px** below.
  - Plate padding: **32px** desktop, **12px** mobile (the "medium" plate).
  - The image fills the plate at the stated ratio, `object-fit: cover; object-position: 50% 0` (top-aligned, so the top of each screen shows).
- **Tablet guard:** below 1024px, cap the pair at `$measure`, so the tall phone screenshots don't grow past about 600px each.

### 6.2 Options grid: `.case-options`

- **Desktop:** the 12-column grid. Each figure spans 6; **40px** row gap.
- **Mobile:** 2 columns, **12px** column gap, **24px** row gap.
- **Figure:** a "small" plate (**24px** desktop, **10px** mobile) with the image at **16:10**, top-aligned. The caption sits **12px** below in the small style: the name in 500 weight followed by the description in muted.

### 6.3 System: `.case-system`

A column with the label, swatches and specimen: **32px** apart on desktop, **20px** on mobile.

- **Swatches:**
  - **Desktop:** 4 per row, each spanning 3 columns. Each is a colour block at **3:2**, then **10px** below it the small-style name (500) with the hex on the next line (muted).
  - **Mobile:** 2 columns (12px column gap, 20px row gap), blocks at **1:1**. Cap the swatch grid at `$measure` on tablets.
  - **Colours:** Off-white `$acetrail-ground`, Ink `$acetrail-ink`, Ace Trail yellow `$acetrail-yellow`, Pale yellow `$acetrail-yellow-pale`. The hex labels are text, not computed.
  - The colour blocks are decorative: `aria-hidden="true"`. The names and hex values carry the meaning.
- **Specimen** ("Get on the Ace Trail.", Figtree 800, colour `$acetrail-ink`, `letter-spacing: -0.05em`):
  - **Desktop:** a grid aligned to the end. The specimen sits in columns 1–9 at **112px**, `line-height: 0.9`, on one line with a non-breaking space between "Ace" and "Trail". The note sits in columns 10–12 (small, muted).
  - **Mobile:** **48px**, `line-height: 0.92`, broken after "the". The note sits 12px below.
  - **Fluid:** 48px at 390 to 112px at 1440, clamped within those bounds and with exact-fraction slopes as for the other fluid sizes. At 1024 the desktop one-line specimen must still fit columns 1–9; reduce it with the clamp, not by wrapping.

### 6.4 Timing chart: `.case-timing`

This is an HTML chart, not an SVG. It's a figure: `role="img"` with the `aria-label` from the reference; the parts inside are `aria-hidden`.

- **Layout:** a column (28px apart on desktop, 24px on mobile) of the label "Scroll progress, p", four rows, then the axis.
- **Row:**
  - **Desktop:** `grid-template-columns: 5fr 7fr`, 24px column gap, items centred. The text is on the left, the bar on the right.
  - **Mobile:** a column, with the text 10px above the bar.
  - **Text:** small style. The name in 500 weight, then a line break, then the detail in muted.
- **Bar:**
  - Track: 12px tall, `$diagram-card`.
  - Fill: positioned by `left` and `width` as percentages of the track.

| Row | Fill from | Width | Fill |
|---|---|---|---|
| Photo grows | 0% | 100% | solid ink |
| Photo settles | 0% | 100% | solid ink |
| Headline fades out | 0% | 55.6% | gradient, ink to transparent |
| Caption fades in | 60% | 40% | gradient, transparent to ink |

- **Axis:** a row (`space-between`) at 13px / 16px line height, muted: "0, top of the hero" and "1, 740px later". On desktop it sits under the bar column only (the same 5fr / 7fr grid, with an empty first cell).
- The gradient ends use the ink at alpha 0 (`rgba($color-ink, 0)`), not `transparent`, so the fade stays neutral.
- **No motion:** this is a static explanation of the scroll. It doesn't animate.

### 6.5 Scores grid: `.case-scores`

- **Desktop:** the 12-column grid with a **48px** row gap.
  - **Row 1:** four scores, each spanning 3 columns. The number is "100" at **96px** in 500 weight (`line-height: 0.9`, `letter-spacing: -0.04em`); **8px** below it, the category in the label style but **ink** colour.
  - **Row 2:** four vitals, each spanning 3 columns. The value is in the body style; **2px** below it, the name in the small style (muted).
- **Mobile:** 2 columns, 16px column gap, 28px row gap. The numbers are **56px** with the label 6px below. The vitals follow the scores in the same grid.
- Use a `<dl>`, with each number or value as the `<dd>` and its name as the `<dt>`. Keep the visual order (value above name) with flex `column-reverse`, or by ordering the markup and styling it. Screen readers should hear "Performance, 100".
- **Fluid:** the 96px number is fixed between 1024 and 1440. At 1024 a 3-column span is about 206px, which fits "100".

---

## 7. Media

Give every `<img>` its `width` and `height`. Use `loading="lazy" decoding="async"` everywhere except the hero.

| Use | Files (intrinsic px) | Ratio | Alt / label (from the reference) |
|---|---|---|---|
| Hero, desktop | `hero-1200.webp`, `hero-2064.webp` (2064×1548) | 3:2 | see §5.1 |
| Hero, mobile | `hero-phone-1200.webp`, `hero-phone-2064.webp` (2064×1548) | 4:5 | see §5.1 |
| Home before / after, desktop | `home-before-desktop.webp`, `home-after-desktop.webp` (1440×900) | 16:10 | from the reference |
| Home before / after, mobile | `home-before-mobile.webp`, `home-after-mobile.webp` (780×1688) | 390/844 | from the reference |
| Directions | `direction-*.webp` (1440×900) | 16:10 | "Homepage direction: …" |
| Classes before / after | `classes-before.webp`, `classes-after.webp` (1440×1080) | 4:3 | from the reference |
| Classes on a phone | `classes-phone-1200.webp`, `-2064.webp` (2064×1548) | 4:3 | from the reference |
| Results graphic | `results-1200.webp`, `-2064.webp` (2064×1548) | 4:3 | from the reference |
| Testimonials before | `testimonials-before.webp` (1440×810) | 16:9 | from the reference |
| Hero scroll, desktop | `video/acetrail/hero-scroll-desktop.mp4` (1440×900, 6.6s), `hero-scroll-desktop-poster.webp` | 16:10 | from the reference |
| Hero scroll, phone | `hero-scroll-mobile.mp4` (780×1688, 6.6s), `hero-scroll-mobile-poster.webp` | 390/844 | from the reference |
| Results | `results.mp4` (1440×810, 6.4s), `results-poster.webp` | 16:9 | from the reference |
| How it works | `how.mp4` (1440×900, 13s), `how-poster.webp` | 16:10 | from the reference |
| Reel | `reel.mp4` (1440×1080, 8s), `reel-poster.webp` | 4:3 | from the reference |
| Share image | `og.jpg` (1200×630) | — | — |

- **Videos:** the standard markup and toggle from JobTrackr, with `media.ts` unchanged. Every recording is silent.
- **Where the media came from:**
  - The screenshots and recordings were captured from Ace Trail's own repo: the redesign, and the pre-redesign Webflow site from its `pre-redesign` branch.
  - The four directions are renders of the exploration boards.
  - The laptop, phone and results images are Oluwasogo's mockups. The reel is his.

---

## 8. Linking the case studies

Do all four steps **in the same change as the new page**, so no link ever points at a page that doesn't exist yet.

1. **`projects.ts`:** give Acetrail `caseStudy: '/work/acetrail'`. The home list (desktop) and the sheet's "Read case study" (mobile) then follow automatically, through the logic JobTrackr already added.
2. **`jobtrackr.html` footer:** the "Acetrail" next-project link becomes `href="/work/acetrail"`, opening in the same tab. Remove its `target`, `rel` and hidden suffix.
3. **`acetrail.html` footer:** links to the Artifacts case study (§5.14), switched in the same change that builds `/work/artifacts`.
4. **The top bars** of both case pages keep "Balogun Oluwasogo" and "All work" linking to `/`.

The order is JobTrackr → Acetrail → Artifacts. All That Is Kim is skipped while it has no case study.

---

## 9. `<head>`

Copy `jobtrackr.html`'s head and change:

- **`<title>`:** `Acetrail — Balogun Oluwasogo`.
- **Description** (meta and `og:description`): "The website for Ace Trail Tutors, an online IELTS school: redesigned in the browser, specified, and rebuilt in plain HTML, CSS and JavaScript."
- **Canonical and `og:url`:** `https://www.balogunoluwasogo.com/work/acetrail`.
- **`og:image` and `twitter:image`:** `https://www.balogunoluwasogo.com/assets/images/case/acetrail/og.jpg` (1200×630).
- **Don't preload Figtree:** it's below the fold.

---

## 10. Responsive behaviour

The JobTrackr rules hold:

- **Below 1024px:** one column; text and the tall media capped on tablets.
- **From 1024px:** the 12-column grid. Only the display, subtitle, heading and specimen sizes are fluid.
- **Never** size anything with `100vw`.

Specific to this page:

- **Hero picture:** switches source at 1024px, together with the layout.
- **Before/after pairs:** two columns from 320px up (except the Results pair on mobile, §5.6); capped at `$measure` below 1024px.
- **Phone video in the hero-scroll section:** capped at `$case-art-max` (440px) below 1024px.
- **Timing chart:** on desktop the 5fr / 7fr split holds down to 1024px. Below that, it stacks.

---

## 11. Acceptance checks (run all of them before handing back)

1. `npm run typecheck` and `npm run build` pass, with no console errors on any of the three pages.
2. **Pixel match** against `reference/desktop.html` at 1440×900 and `reference/mobile.html` at 390×844, as for JobTrackr: full page, fonts loaded, reduced motion emulated. Section tops, media boxes and text line breaks must match. Report any remaining difference and why.
3. **No horizontal scroll** at 320, 360, 390, 600, 768, 1023, 1024, 1280, 1366, 1440, 1920 and 2560, with real scrollbars (`ignoreDefaultArgs: ['--hide-scrollbars']`).
4. **Keyboard:**
   - Tab runs through the top bar, the site link, each video toggle in page order, "Artifacts", then the footer links.
   - Focus-visible outlines stay on.
5. **Motion:**
   - With reduced motion, nothing plays and no `.mp4` is requested.
   - Without it, a video plays only in view and pauses on leaving.
   - Every video can be paused from the keyboard.
6. **Linking:**
   - From the home list (desktop) and the sheet (mobile), both JobTrackr and Acetrail open their case studies in the same tab.
   - JobTrackr's footer opens `/work/acetrail` in the same tab.
   - Acetrail's footer opens `/work/artifacts` in the same tab.
   - The other projects still open their sites in a new tab.
   - `/work/acetrail` works in `npm run dev`, `npm run preview` and the built `dist/`.
7. **JobTrackr unchanged:** re-run JobTrackr's pixel match against its own reference after the shared SCSS changes (the new section gaps, the subtitle modifiers, the Figtree face). It must still match.
8. **Docs:** README and CLAUDE.md updated (§2).
9. Summarise the files changed and the key decisions. Don't commit or push.

---

## 12. Facts to keep as written (checked against the Ace Trail repo and the live site)

- **The redesign's history:** the old site was a Webflow export (2023), with three stylesheets, jQuery 3.5, webflow.js, luxy.js and a Web Font Loader requesting fourteen Figtree styles.
- **The rebuild:**
  - Inlined CSS, and one deferred script.
  - On desktop, GSAP and ScrollTrigger load on first scroll once the page is idle; on phones the hero scrubs on native scroll.
  - Lenis is for desktop wheels only.
  - One self-hosted 20 KB variable font with metric-matched fallbacks.
- **Hero scroll values:** 740px (desktop) and 620px (phone) of scroll, scaled to the viewport height. The image zooms from 1.12 to 1. The headline opacity is 1 − 1.8p; the caption fades in over 0.6 to 1.
- **Interaction behaviours:** results selection is click or tap only, built as tabs with a live quote region; How it works steps are scroll-linked; since launch, each class row opens and closes on its own.
- **Integrations kept:** Paystack, Mailchimp and Google Analytics; the old anchor links still land; hosting is on Netlify.
- **Performance:** PageSpeed Insights on the live site on **2 October 2026**, Lighthouse 13.5, emulated Moto G Power on slow 4G.
  - Scores: 100 / 100 / 100 / 100.
  - Vitals: FCP 1.0 s, LCP 1.4 s, TBT 0 ms, CLS 0.
  - Desktop also scored 100 in all four.
- **Rules:**
  - Don't change these numbers without re-running PageSpeed, and update the date in the caption if you do.
  - Don't add claims, metrics or testimonials.
