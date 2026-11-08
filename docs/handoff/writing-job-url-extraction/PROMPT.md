Add the second essay to this repo: "Building Job URL Extraction into JobTrackr", at `/writing/building-job-url-extraction-into-jobtrackr`. It has a screen recording, two interactive demos built on a copy of JobTrackr's Add application drawer, a release timeline and an early-numbers figure. Both essays' footers then point to each other. The repo is Portfolio V2.1: plain HTML, SCSS and TypeScript, with no framework. The Writing system (registry, index, essay shell, plates and the playback module) is already merged. Build on it.

Read these first:
1. `docs/handoff/writing-job-url-extraction/README.md`, the spec:
   - §1 files;
   - §2 the registry entry and index;
   - §3 the page, its sections, metadata and both footers;
   - §4 Media 01;
   - §5 the JobTrackr drawer replica;
   - §6 the shared extraction rules;
   - §7 Interaction 02;
   - §8 Interaction 03;
   - §9 the timeline, numbers and CTA;
   - §10 media and fonts;
   - §11 accessibility;
   - §12 acceptance checks;
   - §13 CLAUDE.md.
2. `docs/handoff/writing-job-url-extraction/reference/`, the visual targets:
   - `article-desktop.html` / `article-mobile.html`: static renders of the whole essay. **`article-desktop.html` is the source of truth for the essay's copy.**
   - `article-*-1…4.webp`: screenshots at 1440 and 390.
   - `02-*` and `03-*` (`.html` + `.webp`, desktop and mobile): every demo state, with the drawer's complete markup and CSS.
   - The design canvas isn't available to you. These files are the design. The references win on appearance; the README wins on behaviour.
3. CLAUDE.md (especially "Writing"), `docs/handoff/writing/README.md`, then the code this builds on:
   - `src/writing/space-between-design-and-engineering.html` (the shell to copy);
   - `src/scss/_writing.scss`, `src/scss/posts/_space-between.scss`, `src/ts/posts/space-between/form-demo.ts` (the demo pattern: native radios, timers, no-JS fallback);
   - `src/ts/writing/annotated-media.ts` and `media-switch.ts`;
   - `src/ts/posts.ts`, `src/scss/_tokens.scss`, `src/scss/_fonts.scss`.

How it works now:
- There's one essay. Its footer reads "Back to / Writing".
- `annotated-media.ts` already handles a single video with no notes.
- Neue Montreal Regular serves both 400 and 500.
- Only Figtree is declared as an extra font.

What's required:
1. **Registry and index (§2):** the `posts.ts` entry, and the index's Blog JSON-LD.
2. **The essay page (§3):** header, metadata, the nine sections in order, and the "Next essay" footer.
3. **The first essay's footer (§3):** the only change on that page.
4. **Media 01 (§4):** an annotated-media figure with no notes, in a 1316:720 frame.
5. **The drawer replica (§5) and extraction rules (§6),** shared by both demos, under `src/ts/posts/job-url-extraction/` and `src/scss/posts/_job-url-extraction.scss`.
6. **Interaction 02 (§7) and Interaction 03 (§8),** desktop plate and mobile sheet.
7. **Timeline, numbers and CTA (§9).** The numbers use proportional figures.
8. **Fonts and tokens (§10):** the Geist faces, `$font-jobtrackr*` and `$lsb-two` / `$lsb-one`.
9. **The small reusable `_writing.scss` additions (§3):** `.writing-title--stem`, `.writing-heading--stem`, `.writing-heading--w` and `.writing-foot__essay`.
10. **CLAUDE.md (§13).**

How to do it:
- **Branch first.** Run `git status`.
  - Already in the working tree, untracked: `docs/handoff/writing-job-url-extraction/`, `docs/font-licenses/Geist-OFL.txt`, `src/assets/fonts/geist/`, `src/assets/video/writing/jobtrackr-url-extraction.mp4`, `src/assets/images/writing/jobtrackr-url-extraction-poster.webp` and `src/assets/images/writing/job-url-extraction-og.jpg`. Leave them as they are.
  - If `git status` shows anything else uncommitted, stop and ask me.
  - Then run `git switch -c writing/job-url-extraction` and do all the work there.
- **A suggested order:**
  1. registry, page shell and prose (check against the article references before any demo);
  2. footers;
  3. Media 01;
  4. tokens and fonts;
  5. the replica's static markup and styles (compare the `02-idle` and `03-idle` references);
  6. `extraction.ts`, then each demo;
  7. timeline, numbers and CTA;
  8. metadata;
  9. CLAUDE.md.
- **Check each piece** against its reference at 1440 and 390 before moving on.
- **Line endings:** keep each file's own. `src/scss/_tokens.scss` and `src/ts/main.ts` are CRLF; the files you'll touch otherwise are LF. Use LF for new files.
- **Paths:** the project folder name contains a space. Quote paths in commands.

Rules:
- **Scope:** only the new and changed files in README §1. Don't touch:
  - `posts.mjs`, `shared.mjs`, `main.ts`, `media-switch.ts`, `annotated-media.ts`;
  - `_case.scss`, `_layout.scss`, `_index.scss`;
  - the case studies, home, About, the index layout, or the first essay beyond its footer.
- **Nothing new beyond what the README lists:**
  - no dependencies;
  - no fonts other than the two Geist files;
  - no client rendering of the post list;
  - no feed or sitemap.
  - Keep the existing architecture, names, data hooks and copy. Don't refactor unrelated code.
- **TS selectors:** `data-*` attributes only, never styling classes. Strict TypeScript; `.js` import extensions.
- **Reusable vs article-specific:** only the four modifiers/classes in §3 go in `_writing.scss`. Everything about JobTrackr, the demos, the timeline and the numbers stays under `posts/job-url-extraction`.
- **Copy:**
  - The essay text comes exactly from `reference/article-desktop.html`, with its typographic apostrophes.
  - Demo, caption, explanation and JobTrackr UI copy comes exactly from README §4–§9, including "Use suggestions for salary" and "− Fewer details" (U+2212).
  - Don't edit, add, reorder or "improve" any of it.
- **Media and fonts are final:** don't re-encode, resize, trim, subset or regenerate them. No `autoplay`, `loop` or `data-case-video`.
- **The demos send nothing:**
  - no `fetch` or XHR;
  - no form `action` and no `name` attributes;
  - no storage and no analytics events;
  - nothing contacts JobTrackr.
- **Faithful to JobTrackr:**
  - Don't invent extraction behaviour, providers, field mappings, auto-acceptance or fallbacks. Implement exactly the rules in §6 and the results in §7–§8.
  - The only deliberate differences from the product are listed in §5.
- **Design rules (outside the drawer):**
  - no rules or borders, no numbering, no italics, no shadows, no rounded corners;
  - keep the optical edges the README gives;
  - never size anything with `100vw`;
  - tap targets 44px or more below 1024;
  - focus-visible outlines stay on.
- **Inside the drawer**, JobTrackr's styling applies (§5): Geist, borders, hairlines, 6px radii, its colours. This is the documented exception. Don't let those styles leak outside the drawer.

Edge cases:
- **Interaction 02:**
  - Choosing another example mid-run cancels the run. Its reply must never apply.
  - Retry re-runs and clears suggestions first.
  - Typing during a run is kept: a touched field gets a suggestion instead of being overwritten.
  - Blocked leaves the fields editable.
  - Status = Saved swaps the date for its line.
- **Interaction 03:**
  - URL A's late reply never overwrites URL B's result.
  - The URL change clears only untouched extracted values.
  - "Change it for me" appears only while looking and before Role is touched.
- **Dropdowns:**
  - All five are JobTrackr's Select (README §5 "Dropdowns"), not native `<select>`s: a listbox under the field on desktop and a sheet below 1024, with its full keyboard behaviour.
  - Choosing the current option changes nothing.
- **Salary:**
  - If the reader typed a salary first, all three salary values become suggestions, and one press applies the group (clearing missing bounds).
- **Focus and timers:**
  - Follow §5's focus rules.
  - Busy buttons keep focus (`aria-disabled`) and ignore presses.
  - Clear every timer on reset, change and `pagehide`; reset on a persisted `pageshow`.
- **Mobile:**
  - The 600px sheet scrolls inside without trapping the page at its ends.
  - No horizontal overflow from 320px, including the long Job URL.
- **Without JS:** disabled controls and the fallback note; native video controls.
- **If the spec and the current code disagree,** tell me before choosing.

Before handing back:
1. Run `npm run typecheck` and `npm run build`.
2. Run every acceptance check in README §12:
   - the pixel comparisons for the essay, every demo state, the index and the first essay;
   - mouse, touch and keyboard passes with zero network requests from the demos;
   - the no-JS pass;
   - the 320–2560 overflow sweep;
   - metadata;
   - Media 01's Range requests and poster;
   - home and case-study regressions.
3. Update CLAUDE.md as README §13 says.
4. Summarise:
   - the files you added and changed;
   - the checks you ran, with their results;
   - any difference from the README or references, and why.
5. Don't commit, push or merge. I'll review on `writing/job-url-extraction` and commit myself.
