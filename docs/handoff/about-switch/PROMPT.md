Add the Work / About switch to the home page (`src/index.html`) in this repo. The repo is Portfolio V2.1: plain HTML, SCSS and TypeScript, no framework. The About reveal stays exactly as it is. This adds a way in that people can see, because they don't discover that the portrait opens it.

Read these first:
1. `docs/handoff/about-switch/README.md`, the spec: §1 what changes, §2 the look, §3 the behaviour and the flow layout, §4 accessibility, §5 files, §6 edge cases, §7 the acceptance checks.
2. `docs/handoff/about-switch/about-switch.patch`, the reference implementation. It was tested against this repo as it stood on 14 October 2026, and applies with or without the TL;DR patch.
3. `docs/handoff/about-switch/reference/*.webp`, the visual targets at 1440 × 900, 390 × 844 and 1280 × 600.
4. `docs/handoff/about/README.md`, for how the About works today, and CLAUDE.md.

How it works now:
- The "Work" label over the project list is a muted `<h2 class="index__heading">`.
- The About opens only from the portrait in the name: hover on desktop, tap on touch, Enter / Space from the keyboard. Nothing on the page says so.
- The About has its own muted "About" label.

What's required:
1. **A two-word switch over the list, "Work" and "About".** The lit word (ink) is what the stage shows, and the other is muted and turns ink on hover. There are no borders, underlines, pills or icons. It's 16px apart below 1024px and `$gutter` from 1024px.
2. **"About" opens the About** with the existing reveal, and it stays open until "Work", Escape or the portrait closes it. A pointer passing over the portrait doesn't close it.
3. **"Work" closes it.** The portrait keeps all of today's behaviour.
4. **Desktop (1024px and up):** the switch row stays on the "Work" line in both states, and only the lit word changes. The list and the About swap below it in their current positions. The About's own label isn't shown.
5. **Below desktop:** the About brings its own "Work About" row in place of today's "About" label. When a keyboard user presses a word whose row then fades out, focus moves to the matching control in the incoming row.
6. **Flow fallback on desktop:** it also triggers when the statement would come within 32px of the switch row, or the About would rise above the list's first line. In the flow layout on desktop the switch row stays visible above the About.

How to do it:
- **Apply the patch.** Run `git apply --check docs/handoff/about-switch/about-switch.patch`, then `git apply docs/handoff/about-switch/about-switch.patch`.
- **If it doesn't apply** because these files have moved on, implement the same changes by hand from README §5 and the patch. Don't change the values, names or behaviour.
- **Line endings:** `src/index.html`, `src/scss/_index.scss` and `src/ts/about.ts` have CRLF line endings in the working tree; keep them.

Rules:
- **Scope:** only those three files and the docs listed at the end.
- **Don't change:**
  - `main.ts` (`initAbout` finds the switch inside `page`);
  - `_layout.scss` or `_tokens.scss`;
  - the case studies, `preview.ts`, `modal.ts` or `projects.ts`.
- **Nothing new:** no tokens, fonts or dependencies. Keep the existing architecture, class names, data hooks and copy, and don't refactor unrelated code.
- **TS selectors:** select with `data-*` attributes only, never styling classes.
- **Design rules:**
  - no rules or borders, no numbering, no italics;
  - keep the W optical edge (`-$lsb-w-book`) on both rows;
  - never size anything with `100vw`;
  - tap targets 44px or more below desktop;
  - focus-visible outlines stay on.
- **Accessibility (README §4):**
  - "Work" stays inside the section's `<h2 id="featured-heading">`.
  - All three switch buttons keep `aria-pressed` in step, and the portrait keeps `aria-expanded`.
  - A row that isn't showing can't take focus.
- **Edge cases:**
  - The project-type line still shows beside the switch on project hover.
  - Resizing across 1024px closes the About, as today.
  - Hybrid devices: a mouse leaving the portrait doesn't close a tap- or switch-opened About.
  - The flow layout table in README §3 must hold.

Before handing back:
1. Run `npm run typecheck` and `npm run build`.
2. Run every acceptance check in README §7:
   - the pixel comparison with today's site, where only the switch row's box differs;
   - the behaviour table with mouse, touch and keyboard;
   - focus moves at 768 × 1024, with and without reduced motion;
   - the flow layout at 1024 × 768, 1280 × 600, 1280 × 720, 1366 × 768, 1440 × 900 and 1920 × 1080;
   - the overflow sweep from 320 to 2560, closed and open;
   - all five case studies unchanged.
3. Docs:
   - update CLAUDE.md as README §8 says;
   - add the one-line pointer at the top of `docs/handoff/about/README.md`.
4. Summarise the files changed, the checks you ran with their results, and any difference from the patch and why. Don't commit or push; I'll do that myself.
