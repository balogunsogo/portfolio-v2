Add Writing to this repo: a "Writing" link on the home page, a Writing index at `/writing`, and the first essay, "The Space Between Design and Engineering", at `/writing/space-between-design-and-engineering`, with its three demos. The repo is Portfolio V2.1: plain HTML, SCSS and TypeScript, no framework. Build it so the next post only needs a new entry in `posts.ts`, its own HTML page and any article-specific code.

Read these first:
1. `docs/handoff/writing/README.md`, the spec:
   - §1 routes and files; §2 the content model; §3 the home link and `/#about`;
   - §4 the index; §5 the essay page; §6 the media plate and controls;
   - §7–§9 the three demos; §10 the media; §11 accessibility, motion and performance;
   - §12 the acceptance checks; §13 the CLAUDE.md updates.
2. `docs/handoff/writing/reference/`, the visual targets:
   - `*.html` are static renders you can open straight from the repo. `article-desktop.html` is the source of truth for the essay's copy.
   - `*.webp` are screenshots at 1440 and 390, with reduced motion and the clock at 11:05.
   - The design canvas isn't available to you. These files are the design. The references win on appearance; the README wins on behaviour.
3. CLAUDE.md, then the code the spec builds on:
   - `scripts/shared.mjs` and `scripts/projects.mjs` (the build-time list injection to copy);
   - `src/work/acetrail.html` and `src/scss/_case.scss` (the top bar, case padding, display link and footer the posts reuse);
   - `src/index.html`, `src/scss/_index.scss`, `src/ts/about.ts` and `docs/handoff/about-switch/README.md` (the switch row);
   - `src/ts/main.ts`, `top.ts`, `clock.ts` and `media.ts`.

How it works now:
- The home switch row has two words, "Work" and "About". There's no Writing anywhere.
- `copyPages()` injects only the work list.
- `media.ts` autoplays any `[data-case-video]` when it scrolls into view.
- `main.ts` wires each component only when its `data-*` hook is on the page.

What's required:
1. **Home (README §3):**
   - a "Writing" link after "About" in the switch row (there's one row on every screen size);
   - `/#about` opens the About through the existing open path, then clears the hash.
2. **Content model (§2):**
   - `src/ts/posts.ts` holds the typed registry;
   - `scripts/posts.mjs` renders the index list at build time;
   - `copyPages()` injects it into `<ol class="posts" data-post-list></ol>`.
3. **The index page (§4):** `src/writing/index.html`.
4. **The essay page (§5):** `src/writing/space-between-design-and-engineering.html`, with its header, rail grid, prose, footer and metadata.
5. **The shared plate and controls (§6),** reusable, in `_writing.scss`.
6. **Demo 01 (§7):** the form simulation, in `src/ts/posts/space-between/form-demo.ts` and `src/scss/posts/_space-between.scss`. It loads only on this essay.
7. **Demo 02 (§8):** `src/ts/writing/media-switch.ts`, reusable.
8. **Demo 03 (§9):** `src/ts/writing/annotated-media.ts`, reusable.
9. **Docs (§13):** CLAUDE.md.

How to do it:
- **Branch first.** Run `git status`.
  - Already in the working tree: `docs/handoff/writing/`, `src/assets/video/writing/` and `src/assets/images/writing/`. Leave them as they are.
  - If `git status` shows any other uncommitted change, stop and ask me.
  - Then run `git switch -c writing/space-between` and do all the work there.
- **A suggested order:**
  1. the home link and `/#about`;
  2. `posts.ts`, `posts.mjs` and the injection;
  3. the index;
  4. the essay shell and prose;
  5. the plate and controls;
  6. Demos 01, 02 and 03;
  7. the metadata;
  8. CLAUDE.md.
- **Check each piece against its reference** at 1440 and 390 before moving on.
- **Line endings:** keep each file's existing ones. `src/scss/_index.scss`, `_case.scss`, `_tokens.scss`, `src/ts/about.ts`, `main.ts` and `top.ts` are CRLF; the rest are LF. Use LF for new files.
- **Paths:** the project folder name contains a space. Quote paths in any command.

Rules:
- **Scope:** the new files in README §1 and the changed files it lists. Nothing else.
- **Don't change:**
  - `_case.scss`, `_layout.scss`, `_tokens.scss`;
  - the case-study pages, `projects.ts`, `preview.ts`, `modal.ts`, `media.ts`, `tldr.ts`, `top.ts`, `clock.ts`;
  - the About's reveal and the existing switch behaviour.
  - Reuse those modules and classes rather than copying them.
- **Nothing new:**
  - no dependencies, fonts or tokens;
  - no client-side rendering of the post list;
  - no RSS feed and no sitemap (README §2).
  - Keep the existing architecture, names, data hooks and copy, and don't refactor unrelated code.
- **TS selectors:** select with `data-*` attributes only, never styling classes.
- **Reusable vs article-specific:** follow README §1. Nothing under `src/ts/writing/` or in `_writing.scss` may know about this essay.
- **Copy:**
  - Use the essay text exactly as it is in `reference/article-desktop.html`, with its typographic apostrophes.
  - Use the demo copy, captions, `aria-label`s and notes exactly as in README §7–§9.
  - Don't edit, add, reorder or "improve" any of it.
- **Media:**
  - The files in §10 are final. Don't re-encode, resize, trim or regenerate them.
  - Don't put `data-case-video` on these videos. Nothing on these pages may autoplay.
- **Demo 01 sends nothing:**
  - no `fetch`, no form `action`, no `name` on the input;
  - no storage and no analytics events.
- **Design rules:**
  - no rules or borders, except the form field's underline, which README §7 records as a deliberate exception;
  - no numbering, no italics, no shadows, no rounded corners;
  - keep the optical edges the README gives;
  - never size anything with `100vw`;
  - tap targets 44px or more below desktop;
  - focus-visible outlines stay on.

Edge cases:
- **Home:**
  - The link carries no `data-about-show`, so `initAbout()` never treats it as a switch. Keyboard focus stays on the pressed word, as today.
  - Tab order in the row is Work → About → Writing, with the About open or closed.
  - `/#about` works in the flow layout and with reduced motion.
  - Without JavaScript, the home page shows the work list as today.
- **Index:**
  - Hidden posts never appear.
  - Dates format in UTC, so 4 November never shows as the 3rd.
  - The bottom block sits at the bottom of a short viewport and flows on a long one.
- **Videos:**
  - If `play()` rejects (for example, Low Power Mode), the word goes back to "Play".
  - Switching Demo 02's version mid-play restarts the new version from 0.
  - Changing Demo 03's tab never pauses or seeks its video.
- **Demo 01:**
  - Double submits and repeated Enter are ignored.
  - Browser autofill counts as a value.
  - Clear every timer on reset and on `pagehide`. On a `pageshow` with `persisted` (back/forward cache), return to the form with the value kept, so it can't come back stuck on "Joining…".
- **Top bar:** `top.ts` hides and shows the top bar on both new pages, as it does on the case studies.
- **If the spec and the current code disagree,** tell me before choosing.

Before handing back:
1. Run `npm run typecheck` and `npm run build`.
2. Run every acceptance check in README §12:
   - the pixel comparisons against the references, and against today's home page;
   - all five case studies unchanged;
   - each demo's behaviour with mouse, touch (390 × 844) and keyboard, including zero network requests from Demo 01;
   - the no-JavaScript pass;
   - the overflow sweep from 320 to 2560;
   - the metadata and JSON-LD;
   - Range requests and posters for the three videos.
3. Update CLAUDE.md as README §13 says.
4. Summarise:
   - the files you added and changed;
   - the checks you ran, with their results;
   - any difference from the README or the references, and why.
5. Don't commit, push or merge. I'll review on the `writing/space-between` branch and commit myself.
