# Section navigation ("On this page")

**Status:** 17 November 2026. Approved on the design canvas ("iudoh.me Layout Variations", page Writing, "Section navigation · prototype").

**What it is:** a quiet table of contents for long pages, desktop only.
- **Collapsed:** one short mark per section in the right page margin. The current section's mark is longer and in ink.
- **Open (hover or keyboard focus):** the section titles replace the marks, right-aligned, in a small box of the page colour.
- **Click a title:** the page scrolls to that section.

**Where:** every case study (`src/work/*.html`) and every essay (`src/writing/*.html` except `index.html`). Not on home, About or the Writing index. Never below 1024px.

**In this folder** (`docs/handoff/section-nav/` once unzipped):
- `reference/section-nav.ts`: a reference implementation (strict TypeScript, typechecks). Adapt it to the repo's conventions; keep the behaviour.
- `reference/_section-nav.scss`: the approved values (compiles against the site's tokens and `desktop` mixin).
- `reference/collapsed-right-1440.webp`, `open-right-1440.webp`, `keyboard-right-1440.webp`: the right 600px of a 1440 × 900 screen in each state, at 1x. These are the visual targets.
- `reference/open-in-context.webp`: the whole screen with it open (half size).

---

## 1. Files

**New:**
- `src/ts/section-nav.ts`: builds the nav from the page's `[data-toc]` headings and runs it (§3). Shared by every page; it must not know about individual pages.
- `src/scss/_section-nav.scss`: its styles (§4).

**Changed:**
- `src/scss/main.scss`: `@use 'section-nav';`.
- `src/ts/main.ts` (CRLF): after the top bar is set up, `if (document.querySelector('[data-toc]')) initSectionNav({ onJump: resyncTopBar });`, the same way the reading switch receives `onJump`.
- **The pages (markup only):**
  - add `data-toc` to each listed heading (§2);
  - add `data-toc-end` to the page's footer (`<footer class="case-foot …">`).
- `CLAUDE.md`: §7.

**Nothing else changes:** no layout, copy, spacing or behaviour of any existing component.

---

## 2. Which headings are listed

The nav lists, in page order, every element with `data-toc` that has an `id`. `data-toc=""` uses the element's own text. A value (`data-toc="Short label"`) would override it; none is needed now. The list uses the existing heading text, so there is no new copy.

- **Case studies:** each `.case-section`'s heading (`h2.case-text__heading`, e.g. "A job search spreads across too many places."), plus the Outcome section's label (`p#outcome-label`, "Outcome"). Not the hero title.
  - As of 4 November: JobTrackr 14 headings + Outcome; Acetrail 11 + Outcome; Artifacts 14 + Outcome; Morrow Studio 12 + Outcome; Now Playing 12 + Outcome. Use what's in the files now.
- **Essays:** every visible `h2.writing-heading`. **Not** the visually hidden "Introduction" heading on the JobTrackr essay.
  - The Space Between: 5. JobTrackr: 8. DOJANG (if it's in the repo): 8.
- Every listed element already has an `id`. Don't rename any.

---

## 3. Behaviour (port `reference/section-nav.ts`)

- **Built by script** from the headings and inserted right after `[data-case-top]`, as `<nav class="section-nav" aria-label="On this page">` with:
  - an `aria-hidden` marks column;
  - an `<ol>` of links (`href="#id"`), each holding the title and its own small mark.
- Without JS there's no nav. The headings and their ids are unchanged, so nothing is lost.
- **Appears** once the first listed heading has risen to 60% down the viewport. **Leaves** once the footer (`[data-toc-end]`) rises above 55%. It's never shown over the page's title area. It fades in and out over 0.2s.
- **Current section:** the last listed heading whose top is at or above 40% of the viewport height.
  - It gets `.is-active` on its mark, its row mark and its link, and `aria-current="location"` on the link.
  - Updates are rAF-throttled on scroll and resize (passive listeners). A `MutationObserver` on `<html>`'s class re-checks when the reading mode changes.
- **Opens** on hover over the marks (a 20px pad around them counts) and on keyboard focus inside it. It closes when neither applies, after 0.12s, so moving the pointer from the marks into the box doesn't flicker.
- **Click a title:**
  - scroll the heading into view (`smooth`, or `auto` with reduced motion) and set the hash with `history.replaceState`;
  - focus the heading (`tabindex="-1"` if it has none) with `preventScroll`, so keyboard and screen-reader users land there;
  - call `onJump`.
  - Headings get `scroll-margin-top: 104px` so the sticky top bar never covers them.
- **Hidden:**
  - below 1024px (`display: none`);
  - in TL;DR mode (`.is-tldr`), because most headings are hidden there;
  - in print.
- **No** storage, network requests or analytics events. **No** new dependencies.

---

## 4. Look (the approved prototype; values in `reference/_section-nav.scss`)

- **Position:** fixed, right edge of the screen, vertically centred. `z-index: 9`, under `.case-top` (10).
- **Collapsed marks:**
  - 1px tall, 9px apart, right-aligned, their right edge 20px from the screen edge;
  - other sections 14px wide, `$color-muted` at 0.45 opacity;
  - the current section 24px wide in `$color-ink`, growing towards the left (0.2s).
- **Open box:**
  - `$color-ground` background, 16px padding, no border, shadow or radius;
  - its rows' marks sit exactly where the collapsed marks were (box `right: 4px` + 16px padding);
  - it slides 6px in from the right while fading in.
  - Each row: the title right-aligned (16px, line-height 1.4, max 260px wide, `text-wrap: balance`), 20px gap, then a fixed 24px mark column centred on the title's first line. Rows 6px apart, 3px vertical padding.
  - Titles are `$color-muted`; the current one and hovered ones are `$color-ink`.
  - On short windows the box scrolls inside (`max-height: calc(100vh - 96px)`).
- **Focus-visible:** the site's 2px outline around the title text (offset 3px).
- **Reduced motion:** no transitions; jumps are instant.
- **Overlap:** at 1440 the open box stays right of the text column. Between 1024 and about 1280 it covers the last 80–120px of some text lines while open; its background keeps the titles readable. That's approved.

---

## 5. Accessibility

- `<nav aria-label="On this page">` with an ordered list of real links; the marks are `aria-hidden`.
- `aria-current="location"` follows the current section.
- Tabbing into the nav opens it; every link shows the focus outline.
- After a jump, focus moves to the heading.
- Pointer and keyboard behave the same: nothing is hover-only.
- The open box is a transient overlay, not a dialog: no focus trap.

---

## 6. Acceptance checks

1. `npm run typecheck` and `npm run build` pass.
2. **At 1440 × 900 on every case study and essay:**
   - hidden at the top; appears once the first section reaches 60%;
   - the current mark follows the scroll;
   - it opens on hover and on Tab, and the titles match the headings in order;
   - clicking scrolls to the heading, below the top bar, and the hash updates;
   - it leaves at the footer.
   - Compare with `reference/*-right-1440.webp`.
3. **At 1024 × 768 and 1280 × 800:** same behaviour; the open box may cover the ends of text lines (§4).
4. **At 1023 and 390:** no nav in the layout, and no layout change at all.
5. **TL;DR on a case study:** the nav hides. Back to Full story: it returns with the right current section.
6. **Reduced motion:** no fades or slides; jumps are instant.
7. **Keyboard:** Tab reaches it, Enter jumps, focus lands on the heading, and outlines show.
8. **Regressions:** home, About, the Writing index, the case studies' TL;DR switch, the sticky top bar and every essay demo work exactly as before. No horizontal overflow from 320 to 2560.

---

## 7. CLAUDE.md

- **Section navigation:** add a short paragraph.
  - `src/ts/section-nav.ts` and `src/scss/_section-nav.scss` build a desktop-only "On this page" nav from `[data-toc]` headings on case studies and essays.
  - It sits in the right page margin. It appears after the first section and leaves at the footer.
  - It opens on hover or focus into a small ground-coloured box of right-aligned titles.
  - It's hidden below 1024, in TL;DR and in print. `data-toc-end` marks the footer.
  - New long pages add `data-toc` to their section headings.
- **Decoration:** add the nav's 1px section marks as a deliberate exception, next to the clock ring.
