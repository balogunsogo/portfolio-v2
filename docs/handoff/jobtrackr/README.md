# JobTrackr case study: implementation handoff

Build the JobTrackr case study as a second page of this site, pixel-perfect to the approved design. This folder holds everything needed. Nothing here needs the design canvas.

- **URL:** `/work/jobtrackr`
- **Stack:** the existing one — plain HTML, SCSS and TypeScript. No framework, bundler or new runtime dependencies (see `CLAUDE.md`).
- **Pixel targets:** `reference/desktop.html` at **1440 × 900** and `reference/mobile.html` at **390 × 844**.

---

## 1. Sources of truth

| Priority | File | What it settles |
|---|---|---|
| 1 | `reference/desktop.html`, `reference/mobile.html` | Exact appearance at 1440 and 390: every size, gap, grid span, colour, aspect ratio, line break and the final copy. Open them directly in a browser (they load fonts and assets from `src/assets`). They use inline styles **only as a reference** — rebuild them with SCSS classes. |
| 2 | `reference/desktop-1..3.webp`, `reference/mobile-1..3.webp` | Full-page screenshots of the two reference pages (reduced motion, so videos show their posters). |
| 3 | `diagrams/*.svg` | The four diagrams, production-ready. Inline them as they are. |
| 4 | This README | Structure, behaviour between and beyond the two widths, media, accessibility, build changes and acceptance checks. |

If the reference and this README disagree: the reference wins on **appearance at 1440 and 390**; this README wins on **behaviour**.

On the design canvas the page is split into four artboards per layout only because of the canvas's size limit. The real page is **one continuous page**, with the same section gap throughout (the reference pages already show it that way).

---

## 2. Files

**Create**

- `src/work/jobtrackr.html` — the page. Use **root-absolute** asset URLs (`/assets/...`); the home page's relative `assets/...` paths would break one folder down.
- `src/scss/_case.scss` — all case-study styles, `@use`d from `main.scss` (one stylesheet for the site).
- `src/ts/media.ts` — video behaviour (§8), started from `main.ts` only when the page has `[data-case-video]` elements. `main.ts` already skips the home modules when their elements are missing; keep it that way.

**Already in place** (added with this handoff; do not regenerate):

- `src/assets/images/case/jobtrackr/*.webp`, `og.jpg`
- `src/assets/video/jobtrackr/*.mp4`
- `docs/handoff/jobtrackr/**`

**Modify**

- `scripts/shared.mjs` → `copyStatic()`: copy every `*.html` under `src/` with its folder structure, not just `index.html` (so `src/work/jobtrackr.html` → `dist/work/jobtrackr.html`). Vercel's `cleanUrls: true` then serves `/work/jobtrackr`.
- `scripts/dev.mjs`:
  - serve `<path>.html` for extensionless paths, matching `cleanUrls`;
  - add `'.mp4': 'video/mp4'`;
  - answer HTTP `Range` requests for video, which Safari requires.
- `vercel.json`: add a cache header for `/assets/video/(.*)`, the same as images (`public, max-age=604800, stale-while-revalidate=86400`).
- `src/scss/_tokens.scss`: the new tokens in §3 and §5.
- Home integration (§10): `src/ts/projects.ts`, `src/ts/modal.ts`, and only the home markup that's needed.
- `README.md` and `CLAUDE.md`: document the new page, folders and rules.

**Out of scope:** the home page's layout and styles, other case studies, and anything on the canvas.

---

## 3. Shell, grid and tokens

| | Mobile (< 1024px) | Desktop (≥ 1024px, `@include desktop`) |
|---|---|---|
| Page padding | `28px 20px 32px` (same as home `.page`) | `48px 64px 56px` (same as home) |
| Gap between sections | **104px** | **160px** |
| Grid | single column | 12 columns, `repeat(12, minmax(0, 1fr))`, 24px gutter; 1312px wide at 1440 |
| Ground / ink / muted | `$color-ground #FAFAF8`, `$color-ink #111110`, `$color-muted #65635D` | same |

**New tokens** (add to `_tokens.scss` and use by name):

```scss
// JobTrackr status colours, sampled from the product. Used only for the small dots.
$status-saved: $color-ink;
$status-applied: #3e83ee;
$status-assessment: #d9a145;
$status-interviewing: #8b68e8;
$status-offer: #36996a;
$status-refused: #c8463d;

// Diagrams
$diagram-line: #8a877f;
$diagram-band: #f3f2ee;
$diagram-card: #ebeae5;

// Media plates
$plate-video: #000000;   // behind the three motion videos (they were exported on black)
$plate-clip: #ecebe6;    // around the screen recording (64px desktop / 16px mobile padding)
```

The style rules from the home page still apply: no rules or borders, no numbering, no italics. The only lines on the page are the diagram connectors.

---

## 4. Type

Values are exact at 1440 (desktop) and 390 (mobile). PP Neue Montreal is weight 400 or 500 only.

| Role | Desktop @1440 | Mobile @390 | Weight | Line height | Tracking | Fluid rule |
|---|---|---|---|---|---|---|
| Display: "JobTrackr" title, "Acetrail" next-project link | 136px | 64px | 500 | 0.88 / 0.9 | -0.045em | Reuse home `.intro__name` clamps: desktop `clamp(6rem, 9.45vw, 11.5rem)`, mobile `clamp(3.5rem, 16.4vw, 7rem)` |
| Subtitle | 48px | 24px | 500 | 1.1 / 1.15 | -0.025em / -0.02em | desktop `clamp(2.25rem, 3.3333vw, 3.5rem)`, mobile `clamp(1.5rem, 6.1538vw, 2.25rem)` |
| Section heading (`h2`) and the three statements | 48px | 28px | 500 | 1.08 / 1.12 | -0.025em / -0.02em | desktop as subtitle; mobile `clamp(1.75rem, 7.1795vw, 2.5rem)`; `text-wrap: balance` |
| List item (five areas, defence layers) | 30px | 24px | 500 | 1.3 / 1.25 | -0.02em | fixed |
| Body | 20px | 17px | 400 | 1.4 / 1.45 | -0.008em / -0.005em | fixed; `text-wrap: pretty` |
| Label (small muted line above a heading or list) | 16px | 15px | 400 | 1.4 | 0 | fixed; muted |
| Caption | 16px | 15px | 400 | 1.4 | 0 | fixed; muted; `text-wrap: pretty` |
| Small (step and flow descriptions; mobile list descriptions) | 16px | 15px | 400 | 1.45 | 0 | fixed |
| Step name (Process) | 20px | 17px | 500 | 1.3 / 1.35 | -0.01em / 0 | fixed |
| Flow name (Authentication) | 20px | 17px | 500 | 1.35 | 0 | fixed |
| Top bar and footer links | 16px | 15px | 500 (name) / 400 | 1.4 | 0 | fixed |

**Tablet guard (mobile layout only):** cap headings, paragraphs and captions at `max-width: 36rem` so lines don't run to 100+ characters between 600 and 1023px. It has no effect at 390.

---

## 5. Optical left alignment (same rule as the home page)

Every line set in the **display, subtitle, heading, statement, list item and label** styles is pulled left by its first glyph's left side bearing, so the ink sits on the grid edge. Body copy, captions and diagram text are not corrected.

In the reference, every corrected line carries `margin-left: -<value>em`. Values are measured from the font files (units per em = 1000):

| First letter | Medium (500) | Book (400) | Token |
|---|---|---|---|
| B D E F H I L N P R (straight stems) | 0.071em | 0.076em | `$lsb-stem-medium` (exists) / `$lsb-stem-book` (exists) |
| O C | 0.036em | 0.040em | `$lsb-round-medium` (exists) / add `$lsb-round-book: 0.04em` |
| S | 0.024em | 0.027em | `$lsb-s-medium` (exists) / add `$lsb-s-book: 0.027em` |
| J | 0.018em | — | add `$lsb-j-medium: 0.018em` |
| T | 0.015em | 0.015em | add `$lsb-t: 0.015em` |
| W | 0.014em | — | add `$lsb-w-medium: 0.014em` |
| A | 0.004em | 0.009em | ignored (below 0.01em) |

Implement this with modifier classes per style, e.g. `.case-h--stem`, `.case-label--round`. CSS can't read the first letter or the weight, so each element gets the class that matches its text. Use `margin-left`, not `text-indent`, as the home page does. The reference shows which lines need which value.

---

## 6. Page structure, section by section

The copy is final: take every string **verbatim** from the reference HTML. A few strings intentionally differ from the original docx. The product name on this page is **JobTrackr**.

Semantics:

- `<header>` for the top bar.
- `<main>` holding one `<section aria-labelledby>` per block below.
- `<footer>` for next project and links.
- The title is the page's only `<h1>`; section headings are `<h2>`.
- Labels are `<p>`.
- Statements are `<p>`, not headings.

### The shared text-block pattern

Used by: The problem, Structure, Overview, Applications, Interviews, Analytics, Data model, Process, Authentication, Security, Shipping, Beta.

- **Desktop:** a 12-column grid with `row-gap: 20px`.
  - Row 1: label, columns 1–4.
  - Row 2: `h2` in columns 1–6, and the body in **columns 7–11** (span 5), top-aligned with the heading.
  - Paragraphs have a 20px gap.
- **Mobile:** a column with a 14px gap: label, `h2`, then the body with `padding-top: 6px`. Paragraphs have a 16px gap.

### Gap between the text block and the media within each section

| Section | Desktop | Mobile |
|---|---|---|
| default | 64px | 36px |
| Structure | 96px | 64px |
| Applications | 64px | 40px |
| Interviews | 64px | 40px |
| Architecture | 120px | 48px |
| Data model | 80px | 40px |
| Process | 80px | 40px |
| Authentication | 64px | 40px |
| Security | 104px | 64px |
| Stack | 56px | 28px |
| Outcome | 48px | 24px |

### Sections

1. **Top bar and hero**
   - **Top bar:** a flex row, `justify-content: space-between`, `align-items: baseline`. "Balogun Oluwasogo" (500) links to `/`; "All work" links to `/`.
   - **Spacing:** the top bar is 104px above the hero body on desktop and 56px on mobile.
   - **Desktop hero body:** a column with a 56px gap.
     1. `h1` and subtitle, 20px apart.
     2. 72px below them, the meta grid: 4 groups, each spanning 3 columns. Each group is a muted label over its value, 4px apart, at 16px/1.4.
     3. The hero image at full width, **3:2**.
   - **Mobile hero body:** a column with a 36px gap.
     1. `h1` and subtitle, 14px apart.
     2. The meta block: a 2-column grid (column gap 16px, row gap 20px, 15px text, label and value 2px apart), with the site link 20px below it.
     3. The hero image at **4:5** (`object-fit: cover`).
   - **Meta copy:**
     - Role: "Product design and / full-stack engineering". On desktop there is a line break after "and"; "full-stack" never breaks.
     - Year: 2026.
     - Stack: "Next.js, NestJS, / Supabase, Drizzle". On desktop there is a break after "NestJS,".
     - Status: "Live, in beta". On desktop the link `jobtrackr.balogunoluwasogo.com` sits under it; on mobile it goes below the grid. It goes to `https://jobtrackr.balogunoluwasogo.com/`, opens in a new tab, and has a visually hidden "(opens in a new tab)".
2. **The problem:** text block only.
3. **Structure:** text block, then two blocks.
   - **The lifecycle:**
     - **Desktop:** label, a 20px gap, then a flex row with a 28px gap at 30px/500. Each stage is a dot (12px desktop, 10px mobile, in its status colour) 14px before its name. Muted "→" separators (400) sit between stages. The caption sits 20px below.
     - **Mobile:** a vertical list with an 8px gap at 24px/500/1.2. Muted "↓" (17px, 400, line height 1) sits between stages, and the caption is 16px below.
   - **Five areas:** label, then rows.
     - **Desktop:** rows are 14px apart. Each is a grid aligned on the baseline: the name in the list-item style in columns 1–4, and the description in the body style in columns 5–10 (muted).
     - **Mobile:** rows are 20px apart. Each is the name (24px) with the description below it in the small style (muted), 4px apart.
4. **Overview**
   - **Desktop:** a grid with the caption in columns 1–4 (`align-self: end`) and the video in columns 5–12 at **1:1**.
   - **Mobile:** the video, then the caption, 12px apart.
5. **Applications**
   - **Desktop:**
     - The laptop image at full width, **3:2**.
     - Then a pair in a grid with `row-gap: 12px`: the video in columns 1–6 at **1:1**, the phone image in columns 7–12 at **1:1** (cover), and the caption under the video in columns 1–6.
     - Then the statement: a grid with `row-gap: 20px` and `padding-top: 32px`. Label "The decision" in columns 1–4; the statement in the heading style in columns 1–10.
   - **Mobile:**
     - The laptop image at **4:3**.
     - The video, phone image and caption, 12px apart.
     - The statement block: 14px gap, `padding-top: 16px`.
6. **Interviews**
   - **Desktop:** a grid with the photo in columns 1–8 at **4:3**. The "Documents" block (label and body, 14px apart) sits in columns 9–12 with `align-self: end`.
   - **Mobile:** the photo, then the Documents block (label and body, 10px apart).
7. **Analytics**
   - **Desktop:** the laptop image in columns 1–7 at **3:2** (504px tall at 1440). The phone image in columns 8–12 fills the same row height (`height: 100%`, cover), so the two always match.
   - **Mobile:** the laptop image at **3:2**, then the phone image at **1:1**, 12px apart.
8. **Architecture**
   - **Desktop:**
     - The left column (columns 1–6, a column with a 20px gap): label, `h2`, and the body with `padding-top: 20px`.
     - The right column (columns 8–12): `layers.webp`, aspect ratio **650 / 880**.
     - Then the architecture diagram, with its caption 32px below it in columns 1–6.
   - **Mobile:** the text block, then the layers image with `padding: 0 40px`, then the diagram and its caption, 20px apart.
9. **Data model:** text block, then the data-model diagram.
10. **Process**
    - **Desktop:** text block, then five equal columns (24px gap). Each step is a column with a 12px gap: the step name, followed by a muted `&nbsp;&nbsp;→` on every step except the last, and the description in the small style.
    - **Mobile:** steps stack 20px apart. Within each step, the name and description are 4px apart.
11. **Authentication**
    - **Desktop:** a grid with the "Every request" block in columns 1–4 (`align-self: end`). The block is the label and four flow items, 20px apart; each item is a name and a muted description, 2px apart. The video is in columns 5–12 at **4:3**.
    - **Mobile:** the video, then the block (14px gap).
12. **Security:** text block, then three blocks.
    - **The two-account test**
      - **Desktop:** a column with a 14px gap. The label has `padding-bottom: 6px`. Then a header row in the label style and two rows in the body style, each a grid aligned on the baseline: columns 1–3, 4–8 and 9–12. Each result is a 10px status dot 12px before the word "Returned" (offer green) or "Refused" (refused red).
      - **Mobile:** each case stacks as: "Signed in as User A, asks for" (small, muted), then what was asked for (body), then the result with a 9px dot.
    - **Defence in depth:** the same layout as Five areas.
    - **Statement:** heading style, columns 1–10.
13. **Stack:** label and `h2` ("Tools chosen around the product.") as in the text block, but with no body.
    - **Desktop:** a grid with `row-gap: 48px`; each group spans 3 columns. A group is its label and its lines in the body style, 6px apart.
    - **Mobile:** a 2-column grid (column gap 16px, row gap 28px). A group's label and lines are 4px apart.
14. **Shipping**
    - **Desktop:** text block, then the screen recording at **109:60**, centred on the clip plate with 64px padding. The caption is in columns 1–6, 16px below.
    - **Mobile:** the plate has 16px padding and the caption is 12px below.
15. **Beta:** text block only.
16. **Outcome**
    - **Desktop:** label and statement (`row-gap: 20px`, statement in columns 1–10). The body is in columns 7–11. The disciplines line is in the caption style in columns 1–9. The three blocks are 48px apart.
    - **Mobile:** the same blocks in a column, 24px apart.
17. **Footer: next project and links**
    - **Desktop:** a 12-column grid. Columns 1–8 hold the label "Next project" and "Acetrail" (display size, a link), 20px apart. Columns 9–12, with `align-self: end`, hold a 2-column grid (24px gap, aligned to the end): the 96px clock and the links column.
    - **Mobile:** a column with a 48px gap. First the label and "Acetrail" (64px), 12px apart. Then a row (`space-between`, aligned to the end) with the clock at 88px and the links at 15px.
    - **Clock and links:** reuse the home page's clock markup, classes and `clock.ts` (live time). The reference shows a static 11:05. The links are the same as home: LinkedIn, GitHub, Contra, Email, in that order, right-aligned, 4px apart.
    - **Next project link:** Acetrail has no case study yet, so link to its live site (`https://acetrailtutors.com/`) in a new tab, with the visually hidden suffix. Take the URL from `projects.ts`.

---

## 7. Media

All files are in `src/assets`. Large images come in two widths for `srcset`. Give each `<img>` its `width` and `height`; use `loading="lazy" decoding="async"` everywhere except the hero, which gets `fetchpriority="high"`.

| Use | Files (intrinsic px) | Display ratio | `alt` / `aria-label` (from the reference) |
|---|---|---|---|
| Hero | `hero-1200.webp` (1200×800), `hero-2400.webp` (2400×1600) | 3:2 desktop, 4:5 mobile | JobTrackr's Overview on a phone, resting on a concrete block |
| Applications, laptop | `applications-laptop-1200.webp`, `-2250.webp` (2250×1500) | 3:2 / 4:3 | The applications table on a laptop |
| Applications, phone | `applications-phone-1200.webp`, `-2000.webp` (2000×1500) | 1:1 | The applications list on a phone, filtered by status and source |
| Interviews | `interview-laptop-1200.webp`, `-2064.webp` (2064×1548) | 4:3 | A technical interview open in JobTrackr on a laptop |
| Analytics, laptop | `analytics-laptop-1200.webp`, `-2400.webp` (2400×1600) | 3:2 | Analytics on a laptop: funnel, application trend and status breakdown |
| Analytics, phone | `analytics-phone-1200.webp`, `-2400.webp` (2400×1600) | fills row / 1:1 | Analytics on a phone |
| Layers | `layers.webp` (650×880) | 650/880 | An exploded view of JobTrackr in five layers: interface, API, identity and access, data, and production |
| Overview video | `video/jobtrackr/overview.mp4` (1080², 16s), poster `overview-poster.webp` | 1:1 | The Overview on desktop and mobile |
| Application video | `application.mp4` (1080², 19s), `application-poster.webp` | 1:1 | Moving through an application's tabs |
| Login video | `login.mp4` (1440×1080, 6s), `login-poster.webp` | 4:3 | The JobTrackr login screen |
| Real session | `real-use.mp4` (1308×720, 23s), `real-use-poster.webp` | 109:60 | A real session: adding an application from a LinkedIn posting, then opening it |
| Share image | `og.jpg` (1200×630) | — | — |

- **Hero `sizes`:** `(min-width: 1024px) calc(100vw - 128px), calc(100vw - 40px)`. Derive the other images' `sizes` from their grid spans.
- **The screen recording:** it was trimmed, cropped and sped up 2×. The Google account picker and an unrelated LinkedIn page were cut on purpose. **Don't re-cut it from the raw recording**: the raw file shows a third party's email address.

---

## 8. Video behaviour (`media.ts`)

- **Markup:** `<video muted loop playsinline preload="none" poster="…">`. There is no `autoplay` attribute: JS decides whether to play.
- **When to play:** an `IntersectionObserver` with `threshold: 0.25` calls `play()` once a video is at least 25% visible and `pause()` when it leaves. Nothing downloads before then.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, never autoplay. The poster stays until the person presses play.
- **Pause control (WCAG 2.2.2):** each video gets a real `<button>` toggle that reads "Pause video" or "Play video". It is visually hidden until focused, then shown over the video's bottom-left corner in the site's focus style. Clicking the video itself also toggles it. No other controls appear, so the design stays pixel-identical.
- **Background:** keep `background: $plate-video` on the video element, so the black plate shows before the first frame.

---

## 9. Diagrams

Inline the four files from `diagrams/` exactly. They were generated from the reference layout, so the positions, line breaks and baselines match it.

| File | Layout | Native size |
|---|---|---|
| `arch-desktop.svg` | wide | 1312 × 556 |
| `data-desktop.svg` | wide | 1312 × 512 |
| `arch-mobile.svg` | tall | 350 × 584 |
| `data-mobile.svg` | tall | 350 × 908 |

- **Which version shows where:**
  - Wide versions show from **1280px** up, at `width: 100%; max-width: 1312px`. They render 1:1 at 1440.
  - Tall versions show below 1280px, at `width: 100%; max-width: 440px`. They render 1:1 at 390.
  - The 1280px switch keeps diagram text readable: a wide diagram squeezed to the 896px content width at 1024 would shrink 14px text to about 9.6px.
  - Hide the inactive version with `display: none`, so it's also hidden from assistive technology.
- **Styles:** the SVGs use classes. Add these to `_case.scss` with the tokens:

```scss
.dg { display: block; width: 100%; height: auto; overflow: visible; font-family: inherit; }
.dg-band { fill: $diagram-band; }
.dg-card { fill: $diagram-card; }
.dg-line { fill: none; stroke: $diagram-line; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.dg-head { fill: $diagram-line; }
.dg-name { fill: $color-ink; font-weight: 500; }
.dg-desc, .dg-tag { fill: $color-muted; font-weight: 400; }
```

- **Accessibility:** each SVG has `role="img"` and a `<title>` it points to with `aria-labelledby`. The IDs are unique per file; keep them that way.
- **Accuracy:** text positions match the HTML reference to within 1px.
- **Metadata:** the SVG, image and video files in this repo carry a content-credentials (C2PA) block that was added when they were saved to this folder. It has no visual effect, and the pixels and markup are unchanged.

---

## 10. Home page integration

1. In `projects.ts`, add `caseStudy?: string` and set JobTrackr's to `/work/jobtrackr`.
2. **Desktop list:** when a project has `caseStudy`, its link goes there in the same tab. It gets no `target`, no `rel`, and no hidden "(opens in a new tab)". The hover preview stays as it is.
3. **Mobile sheet:** when the project has `caseStudy`, the primary link reads **"Read case study"** and goes there in the same tab. Otherwise it stays "Visit site". Don't change the sheet's layout, sizes or behaviour.
4. Change nothing else on the home page.

---

## 11. `<head>` of the case page

- **`<title>`:** `JobTrackr — Balogun Oluwasogo`.
- **Meta description:** "A job-search workspace, designed and built end to end: product design, a Next.js frontend, a NestJS API on Supabase, authentication and per-user data security."
- **Canonical and `og:url`:** `https://www.balogunoluwasogo.com/work/jobtrackr`.
- **`og:image` and `twitter:image`:** `https://www.balogunoluwasogo.com/assets/images/case/jobtrackr/og.jpg` (1200×630). Set `twitter:card` to `summary_large_image`.
- **Copied from `index.html`:** the favicon links (`?v=3`) and the font preload, rewritten to root-absolute paths.
- **Scripts and styles:** `/assets/css/main.css` and `/assets/js/main.js` (module).

---

## 12. Responsive behaviour summary

- **Mobile layout (< 1024px):** a single column with 20px side padding. Media go full width at the ratios in §6. The tablet text guard from §4 applies.
- **Desktop layout (1024–1439px):**
  - The grid columns shrink in proportion.
  - Display and heading sizes follow their clamps; body, labels, captions and all spacing stay fixed.
  - Media keep their aspect ratios.
  - The Analytics phone still matches the laptop's height.
  - Diagrams use the tall version below 1280px.
- **Desktop layout (≥ 1440px):** there is no maximum page width, as on the home page. Headings stop at 56px and the display size at 184px; wide diagrams stop at 1312px.
- **Horizontal overflow:** none at any width from 320 to 2560px, **including with classic (non-overlay) scrollbars**. Never size anything with `100vw`. A width-fixed layout plus a 15px scrollbar is exactly what caused the sideways scroll seen on the design artboards.

---

## 13. Acceptance checks (run all of them before handing back)

1. `npm run typecheck` and `npm run build` both pass, with no console errors on either page.
2. **Pixel match.**
   - Screenshot the built page full-page at **1440×900** and at **390×844**, with fonts loaded and `prefers-reduced-motion: reduce` emulated (so videos show their posters).
   - Screenshot the matching `reference/*.html` the same way.
   - Diff the two. The only acceptable differences are about 1px of antialiasing or positional drift. Section tops, image boxes and text line breaks must match exactly.
3. **No horizontal scroll.** At widths 320, 390, 768, 1023, 1024, 1280, 1366, 1440 and 1920, with real scrollbars, `document.documentElement.scrollWidth === clientWidth`. In Playwright, launch Chromium with `ignoreDefaultArgs: ['--hide-scrollbars']`.
4. **Keyboard.**
   - The Tab order runs: top bar, then the site link, then each video toggle in page order, then "Acetrail", then the footer links.
   - Focus-visible outlines stay on (the site's 2px `currentColor`).
5. **Motion.**
   - With reduced motion, nothing autoplays.
   - Without it, videos play only while visible and pause when scrolled away.
   - Every video can be paused from the keyboard.
6. **Routing.** `/work/jobtrackr` works in `npm run dev` and in the production build. From the home page, the JobTrackr list link (desktop) and "Read case study" in the sheet (mobile) both open it.
7. **Docs.** Update `README.md` (structure, assets, route) and `CLAUDE.md` (case-study rules, new tokens, video rules). Remove the "JobTrackr case study" open item.
8. Summarise the files changed and the key decisions.

---

## 14. Facts to keep as written (verified against the product)

The copy was checked against the live app, the motion videos and the stack slide:

- the tagline and greeting lines;
- that Export CSV exists;
- the interview tabs and the line "logged as they happen";
- the analytics highlights;
- the IDOR test with two accounts;
- ten tables with Row Level Security;
- frontend and API on Vercel.

**Don't add claims, metrics or testimonials.** If a fact needs changing, change it in the reference and here too.
