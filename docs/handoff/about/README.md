# About on the home page: implementation handoff

Add an About to the home page without a page of its own. A portrait set inside the name ("Balogun [photo] Oluwasogo") is the trigger. While the pointer is on it (desktop), or after a tap (touch), the role line becomes a statement and the work list becomes the About. Moving off it, or tapping again, puts the home page back.

- **Design:** the design canvas "iudoh.me Layout Variations", page "About, three directions", row **D · Portrait in the name**.
- **Pixel target:** `reference/index.html` at **1440 × 900** and **390 × 844**, in both states. Add `?about` to the URL to open it on load.
- **Reference implementation:** `reference.patch`. It's a tested implementation of this README against `src/` as it stood on 3 October 2026, the uncommitted home-page edits included. The reference page was generated from it, and the two match to the pixel.
- **Starting point:** the home page as built (`src/index.html`, `_layout.scss`, `_index.scss`, `main.ts`, `preview.ts`, `modal.ts`).
- **Stack and rules:** unchanged (`CLAUDE.md`): plain HTML, SCSS and TypeScript, with no new dependencies or fonts.

---

## 1. Sources of truth

| Priority | File | What it settles |
|---|---|---|
| 1 | `reference/index.html` | Exact appearance at 1440 and 390, default and open: sizes, gaps, line breaks, the photo and the final copy. It's a snapshot of the built page with the compiled CSS and the About script inlined; the clock is frozen at 11:05. Fonts and the photo load from `src/assets`. |
| 2 | `reference/*.webp` | Screenshots with reduced motion: `desktop-default`, `desktop-open`, `mobile-default`, `mobile-open`, and `mobile-short-open` (375 × 667, the flow fallback in §5). `desktop-motion` shows the opening at 0, 80, 140, 200, 300 and 600 ms (left to right, top to bottom). |
| 3 | This README | Behaviour, motion, accessibility, edge cases and the acceptance checks. |
| 4 | `reference.patch` | The code that produces all of the above. |
| 5 | `CLAUDE.md` and the built home page | Every rule this README doesn't repeat. |

If the reference and this README disagree, the reference wins on **appearance** and this README wins on **behaviour**. The canvas boards are the design. The reference supersedes them where they differ: the real photo and the final timings.

---

## 2. Files

**Already in place** (final; don't regenerate or recompress):

- `src/assets/images/portrait/portrait-240.webp` and `portrait-480.webp`
- `docs/handoff/about/**`

**Create**

- `src/ts/about.ts`: the behaviour in §5.

**Modify**

- `src/index.html`: the portrait in the `<h1>`, `.intro__lead` around the role and the statement, `.index__stage` around the heading and list, the About block, and `data-page` on `<main>`.
- `src/scss/_tokens.scss`:
  - `$lsb-w-book`, `$cap-height-medium` and `$portrait-width`;
  - `$about-out` and `$about-delay`;
  - the mixins `about-layer-hidden` and `about-layer-shown`.
- `src/scss/_layout.scss`: the portrait, `.intro__lead`, `.intro__statement`, and the role's open and flow states.
- `src/scss/_index.scss`:
  - `.index` gets `position: relative`;
  - add `.index__stage`;
  - fix the heading's optical edge (§8);
  - add the About block, its open and flow states, and the reduced-motion delays.
- `src/ts/main.ts`: import and call `initAbout`.
- `.gitignore`: add `/Balogun Oluwasogo Profile.jpg` (the original photo in the repo root) to the design-session section. It isn't shipped or committed.
- `README.md` and `CLAUDE.md` (§10).

**Don't touch:** the case-study pages, `_case.scss`, `preview.ts`, `modal.ts` or `projects.ts`. `main.ts` already skips what a page doesn't have, and only the home page has `[data-page]`.

---

## 3. The portrait

- **Size:**
  - `width: 0.9em; height: 0.715em` (`$portrait-width`, `$cap-height-medium`).
  - 0.715em is PP Neue Montreal's cap height (OS/2 `sCapHeight` 715 / 1000).
  - The photo's bottom sits on the baseline and the hair touches the cap line, so it reads as one more glyph.
  - `vertical-align: baseline` on an inline-block `<button>` with `line-height: 0` does this.
  - At 1440 it's 122.4 × 97.2px, from x 527 to 650 and y 59 to 156 (the B's cap top is at 59).
- **Spacing:**
  - Real spaces either side, plus `margin-right: -0.03em`.
  - That evens the optical gaps: 23.8px from the n's ink to the photo and 22.8px from the photo to the O's ink at 1440. The O carries its own side bearing.
- **Placement:**
  - On desktop the name stays on one line (`white-space: nowrap` as now).
  - Below 1024 the photo ends the first line ("Balogun [photo]"), and that line never wraps.
- **The photo:**
  - The original has a plain white background. `export-portrait.py` crops it full width from 2px above the hair, at the portrait's ratio.
  - It then multiplies the ground colour (#FAFAF8) into the pixels and writes 240w and 480w WebP files.
  - On the page only the head and shoulders read; the rest is ground.
  - **Don't use `mix-blend-mode: multiply` instead.** It changes how Chrome rasterises every line of text on the page: I measured the project titles and aside links shifting by up to 54 grey levels. Baking the ground in gives the same picture without that side effect.
  - If the ground colour ever changes, run the script again.
- **Markup:** see the patch for the exact HTML.
  - The `<h1>` keeps the name "Balogun Oluwasogo" through `aria-labelledby="name-first name-last"`; without it the heading would read "Balogun, About Oluwasogo, Oluwasogo".
  - `<button class="intro__portrait" type="button" aria-label="About Oluwasogo" aria-expanded="false" aria-controls="about-statement about" data-about-toggle>`.
  - Inside the button: `<img>` with `alt=""`, `width="480" height="381"`, the two-width `srcset`, `sizes="(min-width: 1024px) 9vw, 15vw"` and `decoding="async"`. It's above the fold, so no `loading="lazy"`.
- **Cursor:**
  - On a desktop with a mouse it's `cursor: default`, because hovering is the interaction and a click does nothing.
  - Everywhere else it's `cursor: pointer`.
- **Focus:** the site's ring, `outline: 2px solid currentColor; outline-offset: 3px`, on `:focus-visible` only.
- **While the About shows:** the image scales to 1.08 from its bottom centre over 0.6s with `$ease-out`, so the portrait leans in from the baseline. The button doesn't clip it.

---

## 4. Layout

**The default layout doesn't move.** The statement and the About are laid over what they replace, and neither takes part in layout:

- `.intro__lead` is `position: relative`. `.intro__statement` is absolute at `top: 0`, over the role, and runs into the space below it.
- `.index` is `position: relative`. `.index__stage` wraps the heading and the list; it's `position: relative` below 1024 and `display: contents` from 1024, so the heading and list stay items of the 12-column grid.
- The About (`.about`) is absolutely positioned:
  - **Below 1024:** against `.index__stage`, at `bottom: 0`.
  - **From 1024:** it's a grid item (`grid-column: 1 / span 8; grid-row: 2`). An absolutely positioned grid item uses its grid area as the containing block, so `bottom: 9px` puts its last line on the last project's line, as the aside already is.
- It grows upward. If there's no room, see the flow fallback in §5.

**Desktop** (measured at 1440 × 900):

| Element | Spec | At 1440 |
|---|---|---|
| Statement | The role's type (clamp, 500, 1.12, −0.022em), `margin-left: −$lsb-stem-medium` (it starts on an I stem), `max-width: 23em`, so two lines breaking after "gets" | y 188 to 297 |
| About heading + bio | Columns 1–4. Heading as "Work" (16px, 400, muted). The bio is the description column's type (1.25rem, 1.35, −0.008em), paragraphs 12px apart, 16px under the heading. | Heading top 596; the last line ends at 835 |
| Now / Open to | Columns 5–8, a `<dl>`: each label in the first of four columns, its items in the other three; groups 12px apart; 16px / 1.4; labels muted and `nowrap`. Bottom-aligned with the bio. | Top 711, ends at 835 |
| Aside | Unchanged; stays visible | |
| Hidden while open | The role line, the "Work" heading and the list | |

**Mobile** (measured at 390 × 844):

| Element | Spec | At 390 |
|---|---|---|
| Portrait | End of the first line | x 238 to 295, y 33 to 79 (57.6 × 45.8; a valid tap target) |
| Statement | Same type as the role; three lines | y 157 to 241 |
| About heading + bio | Heading 15px muted, then the bio at 1rem / 1.45 (paragraphs 10px apart, 12px under the heading) | Heading top 304 |
| Now / Open to | 20px under the bio, on two columns with the aside's 16px gap; items use `text-wrap: balance` so they break into even lines | y 529 to 640 |
| Aside | Unchanged, 40px below | |

---

## 5. Behaviour

The state is one class, `.page.is-about-open` on `<main data-page>`, set by `ts/about.ts`. It keeps `aria-expanded` in step.

| Input | Opens | Closes |
|---|---|---|
| **Mouse on a desktop** (`(min-width: 1024px) and (hover: hover) and (pointer: fine)`, the same query as the project preview) | Pointer enters the portrait (at once) | Pointer leaves, after **100ms**; re-entering within that cancels it. A mouse click does nothing. |
| **Touch, pen, and any device without that match** (every width below 1024, plus iPads and touch laptops) | Tap | Tap the portrait again. Tapping elsewhere leaves it open. |
| **Keyboard** | Enter or Space on the portrait | Enter or Space again; Escape (focus stays on the portrait); Tab or Shift+Tab (it closes before focus moves). On a desktop, focus leaving also closes it. |

- **Why focus alone doesn't open it:**
  - The portrait is the page's first tab stop, so opening on focus would swap the page on the first Tab.
  - While the About shows, the project links are `visibility: hidden`, which also takes them out of the tab order.
  - So it's a disclosure: Enter opens it, and Tab closes it first so focus lands on the first project.
- **Switching layouts:** crossing the media query (resize, rotation) closes it.
- **Screen readers:**
  - The button announces "About Oluwasogo, collapsed / expanded".
  - Hidden layers are `visibility: hidden`, so they're out of the accessibility tree in either state.
- **While it's open:** the project list is hidden, so neither the project preview nor the sheet can open. The aside's links stay usable.
- **Flow fallback (short screens):**
  - When it opens, and on resize while open, `about.ts` measures the About's top against the statement's bottom, ignoring the 8px rise in progress.
  - If the gap is under **32px**, it adds `.page.is-about-flow`. Then the role and the list are `display: none`, and the statement and the About go back into the flow, so the page scrolls instead of overlapping.
  - Measured:

| Viewport | Layout | Gap |
|---|---|---|
| 320 × 568, 375 × 667 | Flow | — |
| 1280 × 600 | Flow | — |
| 390 × 844 | Overlay | 63px |
| 430 × 932 | Overlay | 159px |
| 768 × 1024 | Overlay | 255px |
| 1024 × 700 | Overlay | 47px |
| 1024 × 768 | Overlay | 115px |
| 1366 × 768 | Overlay | 177px |

---

## 6. Motion

The role and the statement share one place, as do the list and the About, so the two sets must not overlap for long: two lines of text crossfading in the same spot read as a smudge.

| Layer | Opening | Closing |
|---|---|---|
| Role, "Work" heading, list | Fade out over 0.15s (`$about-out`); `visibility` flips at the end | Fade in over 0.24s, 0.1s in |
| Statement, About heading + bio | Fade in over 0.24s and rise 8px over 0.32s `$ease-out`, both starting 0.1s in (`$about-delay`) | Fade out and drop over 0.15s |
| Now / Open to | The same, starting 0.16s in | The same as the bio |
| Portrait | Scale to 1.08 over 0.6s `$ease-out` | Back to 1 |

**Reduced motion:** the global rule in `_base.scss` already zeroes durations. The About's layers also get `transition-delay: 0s !important`, so the swap is immediate.

---

## 7. Copy (as written; change it only in `index.html`)

- **Statement:** I design and build digital experiences, from the way they work to the details that make them feel good to use.
- **Heading:** About
- **Bio:**
  - I’m Oluwasogo, a software engineer and digital designer in Lagos, Nigeria. I work on product interfaces, websites, and the small interactions that make them feel considered.
  - By day I build enterprise insurance systems at AXA Mansard. Alongside that I take on freelance work and keep an archive of interaction studies.
- **Now:**
  - Software Developer, AXA Mansard
  - Design and frontend, Ace Trail Tutors
- **Open to:**
  - Product design and development
  - Custom websites and Webflow builds
  - Interaction design and motion

Don't add claims, metrics or testimonials. The curly apostrophe in "I’m" is intended.

---

## 8. A fix in the same block

The "Work" heading still carries the F's optical correction from when it read "Featured work" (`−$lsb-stem-book`, 0.076em). The W in Book has a 0.017em side bearing, so add `$lsb-w-book: 0.017em` and use it. "Work" moves about 1px right, onto the same edge as the name.

---

## 9. Responsive behaviour

- **Below 1024 (phones and tablets):**
  - The mobile layout in tap mode.
  - 600–1023 behaves like 390, with more room above the About.
- **1024–1439:**
  - The desktop layout.
  - At 1024 the name with the photo ends at x 936; the content edge is at 960, or 943 with a classic scrollbar, so it stays on one line.
  - The facts' first column is about 52px wide: "Open to" stays on one line (`nowrap`), and the items wrap into balanced lines.
- **1440 and up:**
  - The name stops growing at 11.5rem (184px), so the photo is at most 166px wide; the 480w file covers it at 2×.
- **Touch at desktop widths** (iPad landscape, touch laptops): the desktop layout, tap to toggle.
- **Short screens:** the flow fallback (§5).
- **Never size anything with `100vw`.** There's no horizontal scroll from 320 to 2560.

---

## 10. Docs

- **`CLAUDE.md`:** add an "About" bullet to the home-page description: the portrait in the name, the hover / tap / keyboard model, the flow fallback, and the baked photo with the reason not to use blend modes. Add the new tokens to the token list, and keep "Open items" current. The alignment rule still names the F of "Work"; it's a W now (§8).
- **`README.md`:** one line on the About under the home page, and `docs/handoff/about/` in the handoff list.

---

## 11. Acceptance checks (run all of them before handing back)

1. **Build:** `npm run typecheck` and `npm run build` pass, with no console errors on the home page or the four case studies.
2. **Pixel match** against `reference/index.html`:
   - At 1440 × 900 (desktop) and 390 × 844 (mobile, 2×), in the default state and open. Open it with `?about` on the reference, and by hovering or tapping on the site.
   - Fonts loaded, reduced motion emulated, the clock pinned to 11:05 Lagos (for example, Playwright's clock at `2026-10-03T10:05:00Z`).
   - The reference implementation gives **0 differing pixels**; report anything else and why.
3. **Default state unchanged:** against a build of the current home page, the only differences are the name line (the photo) and the "Work" heading (§8).
4. **No horizontal scroll** at 320, 360, 390, 600, 768, 1023, 1024, 1280, 1366, 1440, 1920 and 2560, with real scrollbars, in both states. The name stays on one line from 1024.
5. **Mouse:**
   - Hover opens it.
   - A mouse click leaves it open.
   - It's still open 50ms after leaving and closed by 200ms.
   - Re-entering within 100ms keeps it open.
   - The project preview still works after it closes.
6. **Keyboard:**
   - The first Tab focuses the portrait without opening it.
   - Enter opens it; Escape closes it with focus kept on the portrait; Space opens it.
   - Tab closes it and lands on "Jobtrackr", whose preview shows.
   - Shift+Tab away closes it.
   - Focus rings show on `:focus-visible` only.
7. **Touch:**
   - A tap opens it; a tap elsewhere leaves it open; a tap on the portrait closes it.
   - After it closes, tapping a project still opens the sheet.
8. **Fallback:** flow at 375 × 667, 320 × 568 and 1280 × 600; overlay at 390 × 844, 430 × 932, 768 × 1024, 1024 × 700, 1024 × 768, 1366 × 768 and 1440 × 900.
9. **Reduced motion:** the swap is immediate.
10. **Names:** the heading is "Balogun Oluwasogo"; the button is "About Oluwasogo" with the right `aria-expanded`.
11. **Case studies untouched:** `_case.scss` is unchanged and the four pages render as before.
12. **Docs:** README and CLAUDE.md updated (§10).
13. **Summary:** summarise the files changed and the key decisions. Don't commit or push.
