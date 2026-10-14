Add a TL;DR reading mode to all five case studies in this repo: `src/work/jobtrackr.html`, `morrow-studio.html`, `acetrail.html`, `artifacts.html` and `now-playing.html`. The repo is Portfolio V2.1: plain HTML, SCSS and TypeScript, no framework.

Read these first:
1. `docs/handoff/tldr/README.md`, the spec. §1–5 describe the design and behaviour, including §3's per-page table and decisions. §6 covers the files, §7 the edge cases and §8 the acceptance checks.
2. `docs/handoff/tldr/tldr.patch`, the reference implementation for all five pages, built and checked against this repo as it stood on 14 October 2026.
3. `docs/handoff/tldr/reference/`:
   - `switch.webp`;
   - `<page>-desktop.webp` (1440 wide) and `<page>-mobile.webp` (390 wide) for each page;
   - `blocks.json`, the exact TL;DR block positions.
4. CLAUDE.md, in particular "Case studies", "Running the screenshot diff" and the conventions.

How the pages work now:
- The sticky top bar (`.case-top`, `[data-case-top]`) holds only the name. It is `align-self: flex-start`, so it spans just the name. `src/ts/top.ts` hides it while the page scrolls down and shows it on the way up.
- Every section shows its full text.

What's required, on every case study:
1. **A "Full story / TL;DR" switch at the right of the top bar.** It's identical markup on all five pages: two text buttons with `aria-pressed` in a `role="group"` labelled "Reading mode", with a visually hidden `role="status"`. The current mode is lit in `$color-ink-difference` and the other word is muted in `$color-muted-difference`, with no borders, pill, underline or icon. Full story is the default.
2. **TL;DR mode** (`html.is-tldr`). It keeps:
   - the hero;
   - everything in `$tldr-media`, without captions, and with the text in `$tldr-media-text` hidden;
   - Stack and Outcome, complete;
   - the footer.

   It removes every other piece of text, and any section left with nothing to look at is removed whole.
3. **What counts as a picture:**
   - **Keep, as you decided:** Acetrail's colour and type study (`.case-system`, kept whole) and JobTrackr's diagrams (the diagram figures and `.case-art`).
   - **Hide, as specified:** the timing charts (`.case-scroll__chart`, and Artifacts' Track timing chart in `.case-cols`), Artifacts' palette chips (`.case-palettes`) and the collection table.
   - **Full selector lists** are in README §3.
4. **No flash on load.** A one-line inline head script on each page sets `html.has-tldr` (only when `:has()` is supported) and `html.is-tldr` (from `localStorage.tldr === '1'`) before the first paint. The choice is shared by all five pages.
5. **`src/ts/tldr.ts`.** It keeps the reader's place when switching, including through the `display: contents` wrappers below 1024px. It also saves the choice, cross-fades with a View Transition unless reduced motion is on, and syncs on `pageshow` from the back-forward cache.
6. **`initTopBar` returns a resync function.** The reading mode calls it after moving the page, so the jump never hides the bar.

How to do it:
- **Apply the patch.** Run `git apply --check docs/handoff/tldr/tldr.patch`, then `git apply docs/handoff/tldr/tldr.patch`.
- **If it doesn't apply** because the files have moved on, implement the same changes by hand from README §6 and the patch. Don't change the values, names or behaviour.
- **Line endings:** `src/ts/main.ts` has CRLF line endings in the working tree; keep them. The new `tldr.ts` uses LF, per `.editorconfig`.
- **Old references:** delete `docs/handoff/tldr/reference/desktop-tldr.webp` and `mobile-tldr.webp`. They're the superseded Morrow-only references.

Rules:
- **Scope:** only touch the five `src/work/*.html` pages, `src/scss/_case.scss`, `src/ts/top.ts`, `src/ts/main.ts`, the new `src/ts/tldr.ts`, and the docs listed at the end.
- **Don't change:**
  - any copy, media, section or class on any page;
  - `media.ts`;
  - the build scripts.
- **Nothing new:** no tokens, fonts, dependencies or section gaps. Keep the existing architecture, class names and data hooks, and don't refactor unrelated code.
- **TS selectors:** select with `data-*` attributes or structural selectors, never with styling classes, per CLAUDE.md.
- **Design rules:**
  - no rules or borders, no numbering, no italics;
  - never size anything with `100vw`;
  - no horizontal scroll from 320 to 2560px on any page, in either mode, including with classic scrollbars.
- **The full story must not move:** every page stays pixel-identical except the switch's own box.
- **Edge cases:**
  - Below 1024px the words are 16px apart, with 44px-tall hit areas that reach 8px either side. From 1024px they're 24px apart.
  - Tablets use the mobile layout.
  - At 320px the switch must still clear the name.
  - Side figures and media beside text keep their desktop columns in TL;DR.
  - JobTrackr's wide and tall diagrams keep their 1280px switch.
  - Sections after Stack (JobTrackr's Shipping, Acetrail's Since launch) keep their place.
  - With storage blocked, the switch still works for the page.
  - Without `:has()` or JavaScript, the switch is absent and every page is the full story.

Before handing back:
1. Run `npm run typecheck` and `npm run build`.
2. Run every acceptance check in README §8 on all five pages:
   - the full story pixel-identical except the switch box, at 1440 × 900, 1024 × 768 and 390 × 844, with every block's geometry unchanged;
   - TL;DR page heights and every block in `reference/blocks.json` within 1px, with reduced motion;
   - place keeping on the listed blocks, persistence through "Next project", keyboard, motion, the overflow sweep and the no-`:has()` check.
3. Docs:
   - add the CLAUDE.md bullet and the "Checks" addition from README §9;
   - add one line to each of the five case-study READMEs in `docs/handoff/*/README.md` pointing to `docs/handoff/tldr/README.md`.
4. Summarise the files changed, the checks you ran with their results, and any difference from the patch and why. Don't commit or push; I'll do that myself.
