# TL;DR mode for the case studies

**Status:** 14 October 2026. On all five case studies: JobTrackr, Morrow Studio, Acetrail, Artifacts and Now Playing. Morrow Studio was the sample page; the same switch and the same rule now cover the rest. All five pages were built and checked in both modes.

**The reference implementation** is `tldr.patch` in this folder. It applies cleanly to the repo as it stood on 14 October 2026, after "Improve mobile homepage performance without changing interactions". Every value and behaviour below is what that patch does.

**This replaces** the first, Morrow-only version of this handoff. Its two references, `reference/desktop-tldr.webp` and `reference/mobile-tldr.webp`, are superseded by the per-page files listed in §3 and can be deleted.

---

## 1. What it does

Every case study can be read two ways: the full story (the default), or TL;DR.

**TL;DR keeps:**
- the hero: title, subtitle, Role / Year / Stack / Status and the live link, and the hero picture;
- everything you look at rather than read, in the same order, place and size, without captions:
  - photos, screenshots and videos;
  - the diagrams;
  - Acetrail's four directions and its colour and type study;
- the Stack and Outcome sections, complete;
- the footer.

**TL;DR removes:** every other piece of text, which means labels, headings, paragraphs, captions, lists, tables, scores, notes, timing charts and the process steps. A section left with nothing to look at is removed whole.

The reader switches with two words in the sticky top bar, "Full story" and "TL;DR". The choice is remembered, so the next case study opens in the same mode.

**Measured at 1440 × 900 and 390 × 844** (JobTrackr after its update 1, 15 October 2026, which added Insights):

| Page | Full, desktop | TL;DR, desktop | Full, mobile | TL;DR, mobile |
|---|---|---|---|---|
| JobTrackr | 22,092px | 14,041px | 20,278px | 9,603px |
| Morrow Studio | 17,192px | 10,475px | 14,963px | 6,308px |
| Acetrail | 17,114px | 12,001px | 13,705px | 7,048px |
| Artifacts | 18,202px | 10,210px | 16,177px | 6,317px |
| Now Playing | 13,982px | 8,191px | 13,039px | 5,664px |

---

## 2. The switch

See `reference/switch.webp`.

- **Where:** in the existing sticky top bar (`.case-top`), at its right edge, on the name's baseline. It's the same markup on every page. The bar keeps everything it already does:
  - the difference blend;
  - hiding while scrolling down and returning on the way up;
  - staying visible while anything in it has keyboard focus.
- **Type:** the bar's own size (15px below 1024, 16px from 1024), line height 1.4, PP Neue Montreal at 400. No new tokens.
- **States:** the current mode is lit in ink (`$color-ink-difference`). The other word is muted (`$color-muted-difference`) and turns ink on hover. This is how the home list dims every project but the active one.
- **Decoration:** none. There's no pill, track, border, underline or icon, and spacing does the separating:
  - 16px between the words below 1024;
  - 24px (`$gutter`) from 1024.
- **Hit area below 1024:** each word is 44px tall and reaches 8px either side, using the `::after` pattern the name and the meta link already use.
- **Fit:** at 320px wide the switch still clears the name by 39px.
- **Focus:** the same 2px `currentColor` outline as the links, with a 3px offset.
- **Bar width:** the bar now spans the page so the switch can sit at the right. It has `pointer-events: none`, and only its children take clicks, so it still never covers anything clickable but itself.
- **The name:** it's now a flex item. Its glyphs don't move by a pixel, but its box is the full line height, so its focus ring and mobile tap area grow by a pixel or two.
- **Full story is unchanged:** on every page, the full story is pixel-identical to before apart from the switch's own box. Every block's position and size is identical at 320, 390, 768, 1024, 1280, 1440 and 1920.

---

## 3. What TL;DR shows

One rule in `_case.scss` does all of it. Within every `.case-section` except `--stack` and `--outcome`:

1. Every direct child that isn't in `$tldr-media` is set to `display: none`.
2. Every `figcaption`, and anything in `$tldr-media-text`, is hidden.
3. A section with nothing from `$tldr-media` left is hidden whole.

Sections are flex columns with `gap`, so hidden children leave no space behind. The 104 / 160px rhythm between sections holds, and so do the existing gaps between pictures inside a section.

**`$tldr-media`, what counts as a picture:**

| Selector | What it is |
|---|---|
| `figure` | Every figure, including the diagram figures and Acetrail's directions |
| `.case-compare` | Every pair |
| `.case-media` | Bare images: JobTrackr Applications, Acetrail Results |
| `.case-video` | A bare video: Acetrail Since launch |
| `.case-options` | Acetrail's four directions |
| `.case-system` | Acetrail's colour and type study, kept whole: label, swatches with names and hex values, the specimen and its note |
| `.case-scroll` | Acetrail's hero-scroll phone recording |
| `.case-split` | The media beside text: JobTrackr Interviews, Authentication and Insights (update 1) |
| `.case-analytics` | JobTrackr's laptop and phone analytics |
| `.case-arch` | JobTrackr's exploded layers image |
| `.case-art` | JobTrackr's data-model diagrams |

**`$tldr-media-text`, text inside a kept wrapper:** `.case-scroll__chart` (Acetrail's timing chart), `.case-split__side` (the Documents note and the request steps) and `.case-arch__text` (the Architecture copy).

### Per page

| Page | In TL;DR | Hidden whole |
|---|---|---|
| JobTrackr | Overview's two screenshots. Applications' laptop photo and the video-and-phone pair; "The decision" hides. Interviews' laptop photo. Analytics' laptop and phone. Architecture's layers image and diagram. The data-model diagram. Authentication's sign-in recording. Insights' laptop video, its phone video and still, and its laptop still; the text block, "Reporting rules" and the "Owner only" note hide (JobTrackr update 1). Stack. Shipping's recording. Outcome. | The problem, Structure, Process, Security, Beta |
| Morrow Studio | Context's video, Design's pair, the three phones and the Work archive, the Mobile video, the CMS screenshot, Editing's three pictures, Stack, Outcome. | Content model, Preview, Migration, QA, Process |
| Acetrail | Context's pair. The four directions and the colour and type study. The hero's desktop and phone recordings, without the timing chart. Classes, Results and How it works. Stack. Since launch. Outcome. | Engineering, Performance, Process |
| Artifacts | Every section's figure or pair: Archive, Theme, Rules (without its list), Block Orbit, Split Menu, Scroll Cinema, Now Playing, Palette (without the chips), Track (without the timing chart), Phone. Stack, Outcome. | Context (the collection table), Engineering, Performance, Process |
| Now Playing | Every section's figure or pair: Context, Track changes, Scene, Artwork, Previously, On a phone, Touch. Stack, Outcome. | Live data, Engineering, Performance, Process |

**Side figures and media beside text** keep their desktop columns, so the space their caption or text left reads as an offset, not a gap.

**Sections after Stack** keep their place: JobTrackr's Shipping and Acetrail's Since launch still sit between Stack and Outcome.

### Decisions
- **Kept as pictures (your call):** Acetrail's colour and type study and JobTrackr's diagrams.
- **Hidden as text (the defaults you approved):** the two timing charts (Acetrail's hero scroll and Artifacts' Track) and Artifacts' palette chips.
- **Flipping one:** keeping a timing chart is a one-line change. Remove `.case-scroll__chart` from `$tldr-media-text`, or add `.case-cols:has(> .case-timing)` to `$tldr-media` for Artifacts. Keeping the palette chips means adding `.case-palettes` to `$tldr-media`.

### References
- `reference/<page>-desktop.webp` (1440 wide) and `reference/<page>-mobile.webp` (390 wide) for each of the five pages. They are TL;DR, at 1x, with reduced motion and every lazy image loaded.
- `reference/blocks.json`: for each page at 1440 × 900 and 390 × 844, every shown block with its top and height in CSS px, plus the hidden sections. Wrappers laid out with `display: contents` are listed as their children. This is the exact check.

---

## 4. Behaviour

### State
- **The mode is a class on `<html>`:** `is-tldr`. A second class, `has-tldr`, means the switch can work.
- **A one-line inline script in each page's `<head>` sets both before the first paint.** It runs only in browsers with `:has()`, and adds `is-tldr` when `localStorage.tldr === '1'`. A page never flashes the wrong mode.
- **The switch's lit word follows `html.is-tldr` in CSS,** so it's right on first paint, before any module runs.
- **No JavaScript, or no `:has()`:**
  - `has-tldr` is never set and the switch stays `display: none`;
  - the page is the full story, exactly as today.
- **Storage:**
  - the key is `tldr`, value `'1'`, and it's removed for the full story;
  - it's shared by all five pages, and following "Next project" keeps the mode;
  - if storage is blocked, the switch still works but the choice lasts for that page only.
- **Back and forward:** a page restored from the back-forward cache re-reads the saved choice on `pageshow`, without animating.

### Keeping the reader's place
- **The blocks:** every direct child of a `main > section`. A wrapper laid out with `display: contents` (the split, scroll and architecture layouts below 1024) has no box of its own, so its children stand in for it.
- **The anchor:** the block under a reading line a quarter of the way down the screen, or the first block after it that is still shown afterwards.
- **After switching:** the page scrolls so the anchor is where it was. If it was further down than a third of the screen, it lands at one third.
- **Results:**
  - Switching while looking at a picture keeps that picture still, and the text appears or disappears around it. This was checked within 1px on every page at 1440 and 390, including the split, scroll, architecture and diagram layouts.
  - Switching while reading text that TL;DR removes brings up the next picture, or Stack.
- **No styling classes:** the script selects structurally (`main`, `section`, children, computed `display`), following the repo rule.
- **The top bar:** `initTopBar` returns a resync function. The reading switch calls it after moving the page, so the jump isn't read as a scroll and never hides the bar, even in Safari, where a clicked button doesn't keep focus.

### Motion
- **The change is a 0.25s cross-fade:** the browser's default View Transition, through `document.startViewTransition`.
- **Without the cross-fade:** the change is instant with `prefers-reduced-motion: reduce`, and in browsers without View Transitions.
- **No new keyframes or CSS:** none are added for this.

### Video
- **`media.ts` is unchanged.** Every video is a picture, so none is hidden by TL;DR.
- **Videos still play only when in view.** They play when they come into view and pause when they leave, as they do now.

---

## 5. Accessibility

- **The markup:** two real `<button type="button">`s in a `role="group"` labelled "Reading mode", each with `aria-pressed`. The script sets `aria-pressed` on load and on every change.
- **Tab order:** the name, Full story, TL;DR, then the hero link.
- **Announcements:** a visually hidden `role="status"` in the group announces the change. It says "TL;DR: the pictures, the videos, the stack and the outcome." or "The full story."
- **Screen readers:** hidden text is `display: none`, so they get the same short version.
  - Images keep their alt text, videos their labels, and diagrams their titles.
  - The colour and type study keeps its text.
  - The full story is the default and is always one button away.
- **Contrast:** the muted word is 5.9:1 on the ground, the same as every muted label on the site.

---

## 6. Files

The patch touches nine files and adds no tokens, fonts, dependencies or section gaps.

**All five pages, `src/work/*.html`:**
- the inline head script, placed just before the stylesheet link;
- the switch markup in the header, identical on every page.

```html
<script>(function(r){if(!window.CSS||!CSS.supports('selector(:has(*))'))return;r.classList.add('has-tldr');try{if(localStorage.getItem('tldr')==='1')r.classList.add('is-tldr')}catch(e){}})(document.documentElement)</script>
```

```html
<header class="case-top" data-case-top>
  <a class="case-top__name" href="/">Balogun Oluwasogo</a>
  <div class="case-reading" role="group" aria-label="Reading mode" data-reading>
    <button class="case-reading__option case-reading__option--full" type="button" aria-pressed="true" data-reading-option="full">Full story</button>
    <button class="case-reading__option case-reading__option--tldr" type="button" aria-pressed="false" data-reading-option="tldr">TL;DR</button>
    <p class="visually-hidden" role="status" data-reading-status></p>
  </div>
</header>
```

**`src/scss/_case.scss`:**
- `.case-top`:
  - `align-self: flex-start` becomes a full-width flex row (`justify-content: space-between; align-items: baseline; gap: $gutter`);
  - `pointer-events: none`, with `> * { pointer-events: auto; }`.
- New `.case-reading` and `.case-reading__option` (with `--full` and `--tldr`), next to the top bar's rules.
- New `$tldr-media`, `$tldr-media-text` and the TL;DR rule, right after the section-gap loop.

**`src/ts/tldr.ts` (new):**
- `initReadingMode({ group, status, onJump })`;
- place keeping, including the `display: contents` wrappers;
- storage, the cross-fade and `pageshow`.

**`src/ts/top.ts`:** `initTopBar` returns `() => void`, which resets its last scroll position.

**`src/ts/main.ts`:**
- keeps that function;
- calls `initReadingMode` when `[data-reading]` exists.

`main.ts` has CRLF line endings in the working tree, and the patch keeps them.

---

## 7. Edge cases

- **Default state:**
  - The first visit is always the full story.
  - Crawlers and link previews see the full story.
  - Text hidden in TL;DR is still in the HTML.
- **Find in page:** with TL;DR on, find-in-page can't reach the hidden text. That's expected, and the switch is visible at the top.
- **Tablets (600–1023):** they use the mobile layout and the mobile switch spacing.
- **Diagrams:**
  - JobTrackr's wide diagrams still show from 1280 and the tall ones below; TL;DR doesn't touch their breakpoints.
  - Between 1024 and 1279, the tall diagrams show, as in the full story.
- **Fast double clicks:** they can't leave a page between modes. The state flips at once, and a second click on the lit word does nothing.
- **Hero meta:** it repeats the stack in one line. That's intended: the full Stack section stays at the end.
- **No horizontal scroll:** none from 320 to 2560 on any page, in either mode.
- **A new component later:** if it's a picture, add its wrapper to `$tldr-media`, and put any text inside it in `$tldr-media-text`. Anything not listed hides in TL;DR, so new text components need nothing.

---

## 8. Acceptance checks

1. `npm run typecheck` and `npm run build` pass.
2. **Full story, all five pages:** identical to before at 1440 × 900, 1024 × 768 and 390 × 844, except the switch's own box.
   - The box is about x 1249–1376, y 52–67 at 1440; x 833–960, y 52–67 at 1024; and x 259–370, y 32–46 at 390.
   - Check the top of each page and a scrolled position with the bar showing.
   - Every block's position and size is unchanged; compare them with the build before the patch.
3. **TL;DR, all five pages:** set `localStorage.tldr = '1'` and reload, with reduced motion and every lazy image loaded.
   - The page heights and every block in `reference/blocks.json` match within 1px.
   - Each page matches its `reference/<page>-desktop.webp` and `<page>-mobile.webp`. Those are lossy, so judge the photos by eye or serve the largest file to both, as CLAUDE.md describes.
4. **Place keeping** at 1440 × 900 and 390 × 844, on these blocks:
   - JobTrackr: the Interviews photo, the Architecture layers image and the data-model diagram;
   - Acetrail: the hero-scroll phone and the colour and type study;
   - Artifacts: the Track figure;
   - Now Playing: the Touch pair;
   - Morrow Studio: the Editing pair.

   Scroll each to 240px from the top, switch to TL;DR, then back. It stays at 240 (±1), and the top bar is never hidden after a switch.
5. **Persistence:**
   - Switch to TL;DR on JobTrackr and follow "Next project". Morrow Studio opens in TL;DR with "TL;DR" pressed.
   - Switch back and reload: full story, and `localStorage.tldr` is gone.
   - With storage blocked, the switch still works.
6. **Keyboard:**
   - Tab order is name, Full story, TL;DR, live link.
   - Enter and Space switch.
   - The focus ring shows.
   - `aria-pressed` and the status text update.
7. **Motion:**
   - With motion allowed, each switch cross-fades once and logs no console errors.
   - With reduced motion, the change is instant.
8. **Overflow:** no horizontal scroll from 320 to 2560 on any page, in either mode, including with classic scrollbars.
9. **No `:has()`:** remove `has-tldr` from `<html>` in DevTools. The switch disappears, and the page is the full story.

---

## 9. CLAUDE.md

Add this bullet under "Case studies", after the "Files" bullet:

- **Reading mode (TL;DR):** every case study has a "Full story / TL;DR" switch at the right of the sticky top bar (`src/ts/tldr.ts`, `.case-reading` and the TL;DR rule in `_case.scss`). TL;DR keeps the hero, everything in `$tldr-media` without captions, Stack, Outcome and the footer, and hides the rest; sections with nothing left hide whole. `$tldr-media` covers figures, pairs, bare images and videos, Acetrail's directions and its colour and type study, the hero-scroll recording, the split, analytics and architecture media, and the diagrams. `$tldr-media-text` hides the text inside those wrappers.
  - State: `html.is-tldr`, set before the first paint by the head script on each page from `localStorage.tldr`. `html.has-tldr` means the browser supports `:has()`, so the switch shows.
  - Switching keeps the reader's place and cross-fades unless reduced motion is on.
  - A new picture component goes in `$tldr-media`; new text needs nothing.
  - Spec: `docs/handoff/tldr/README.md`.

Also add "TL;DR" to the "Checks" bullet: the full story must stay pixel-identical, and TL;DR must match `docs/handoff/tldr/reference/blocks.json`.

---

## 10. Not built (options)

- **A share link** (`/work/<page>?tldr`) that opens a case study in TL;DR without changing the saved choice. It's useful for sending a recruiter the short version, and is about six lines in the head script.
- **A reduced-motion switch like the reference site's.** The site already follows the system setting everywhere, so a second control would duplicate it.
