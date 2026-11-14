Add the third essay to this repo: "Making a Fighting Game Feel Right in the Browser", at `/writing/making-a-fighting-game-feel-right-in-the-browser`.

The essay has:
- personal photos and a sparring clip;
- three game recordings;
- two before/after comparisons and a sound comparison;
- two interactive figures:
  - **Interactive 01:** a video switch between DOJANG's first version and now;
  - **Interactive 02:** a working copy of DOJANG's compact touch controls next to its first touch layout.

The essays' footers then form a loop. The repo is Portfolio V2.1: plain HTML, SCSS and TypeScript, with no framework. The Writing system and two essays are already merged. Build on them.

Read these first:
1. `docs/handoff/writing-dojang/README.md`, the spec:
   - §1 files; §2 the registry entry and index; §3 the page, its sections, metadata and the footer loop;
   - §4 every figure; §5 Interactive 02; §6 accessibility;
   - §7 provenance; §8 media and fonts; §9 acceptance checks; §10 CLAUDE.md.
2. `docs/handoff/writing-dojang/reference/`, the visual targets:
   - `article-desktop.html` / `article-mobile.html`: static renders of the whole essay. **`article-desktop.html` is the source of truth for the essay's copy.**
   - `article-*-1…6.webp`: screenshots at 1440 and 390.
   - `states/`: every state of Interactive 01, Media 03 and Interactive 02 (`.html` + `.webp`, desktop and mobile). `touch-current-real.webp` is the real game, the replica's pixel target.
   - `i02-markup.html`: the exact markup for Interactive 02. `controls-replica.css`: its exact values. `controls-logic.reference.js`: its behaviour as built on the canvas.
   - The design canvas isn't available to you. These files are the design. The references win on appearance; the README wins on behaviour.
3. CLAUDE.md (especially "Writing"), then the code this builds on:
   - `src/writing/building-job-url-extraction-into-jobtrackr.html`: the shell to copy, and its annotated-media figure;
   - `src/writing/space-between-design-and-engineering.html`: the media-switch markup to copy for Interactive 01;
   - `src/scss/_writing.scss`, `src/scss/posts/_job-url-extraction.scss` (`.jx-essay`, `.jx-cta`);
   - `src/ts/writing/media-switch.ts` and `annotated-media.ts`;
   - `src/ts/posts.ts`, `src/scss/_tokens.scss`, `src/scss/_fonts.scss`, `scripts/dev.mjs`, `vercel.json`.

How it works now:
- Two essays.
  - JobTrackr's footer points to The Space Between.
  - The Space Between's footer points to JobTrackr.
- `media-switch.ts` starts on its second version when the reader prefers reduced motion.
- `dev.mjs` has no `.mp3` content type. There's no `assets/audio/` yet.

What's required:
1. **Registry and index (§2):** the `posts.ts` entry, and the index's Blog JSON-LD.
2. **The essay page (§3):**
   - the header, with the meta under the subtitle (`.writing-meta--head`);
   - the eight sections in order, with each figure where §3's table puts it;
   - the CTA, and the "Next essay" footer pointing to JobTrackr.
3. **The first essay's footer (§3):** it now points to this essay. That's the only change on that page.
4. **The figures (§4):**
   - the annotated-media videos (sparring, Media 04, 05, 06);
   - Media 01's photo pair and Media 02's stills;
   - Interactive 01 on `media-switch.ts` with the new `data-media-start` option;
   - Media 03 on a new `image-switch.ts`;
   - the sound comparison on `sound-compare.ts`.
5. **Interactive 02 (§5):** `wheel.ts` and `controls-demo.ts`, with `i02-markup.html` as the markup and `controls-replica.css` as the styling.
6. **Fonts, tokens and audio (§8):** the two IBM Plex Sans faces, `$font-dojang`, the `.mp3` content type in `dev.mjs`, and the audio cache rule in `vercel.json`.
7. **The reusable `_writing.scss` modifier (§3):** `.writing-meta--head`.
8. **CLAUDE.md (§10).**

How to do it:
- **Branch first.** Run `git status`.
  - Already in the working tree, untracked:
    - `docs/handoff/writing-dojang/`;
    - `docs/font-licenses/IBMPlexSans-OFL.txt`;
    - `src/assets/fonts/ibm-plex-sans/`;
    - `src/assets/audio/writing/`;
    - the `src/assets/video/writing/dojang-*.mp4` files;
    - the `src/assets/images/writing/dojang-*` files.

    Leave them as they are.
  - If `git status` shows anything else uncommitted, stop and ask me.
  - Then run `git switch -c writing/dojang` and do all the work there.
- **A suggested order:**
  1. registry, page shell and prose (check against the article references before any figure);
  2. footers;
  3. the annotated-media videos;
  4. Media 01 and 02;
  5. Interactive 01, then Media 03;
  6. the sound comparison;
  7. fonts and tokens;
  8. Interactive 02: static markup and styles first (compare with `states/i02-compact-*` and `touch-current-real.webp`), then `wheel.ts`, then `controls-demo.ts`;
  9. metadata;
  10. CLAUDE.md.
- **Check each piece** against its reference at 1440 and 390 before moving on.
- **Line endings:** keep each file's own. `src/scss/_tokens.scss` and `src/ts/main.ts` are CRLF; the others you'll touch are LF. Use LF for new files.
- **Paths:** the project folder name contains a space. Quote paths in commands.

Rules:
- **Scope:** only the new and changed files in README §1. Don't touch:
  - `posts.mjs`, `shared.mjs`, `main.ts`, `annotated-media.ts`;
  - `_case.scss`, `_layout.scss`, `_index.scss`, `_job-url-extraction.scss`, `_space-between.scss`;
  - the JobTrackr essay, the case studies, home, About, the index layout, or the first essay beyond its footer.
- **`media-switch.ts`:** add only `data-media-start`, exactly as §4 shows. The Ace Trail switch must behave exactly as before.
- **Nothing new beyond what the README lists:**
  - no dependencies;
  - no fonts other than the two IBM Plex Sans files;
  - no client rendering of the post list;
  - no feed or sitemap.
  - Keep the existing architecture, names, data hooks and copy. Don't refactor unrelated code.
- **TS selectors:** `data-*` attributes only, never styling classes. Strict TypeScript; `.js` import extensions.
- **Reusable vs article-specific:** only `.writing-meta--head` goes in `_writing.scss`. Everything about DOJANG stays under `posts/dojang`.
- **Copy:**
  - The essay text comes exactly from `reference/article-desktop.html`, with its typographic apostrophes and the 😂.
  - Captions, labels, alt text, video `aria-label`s and Interactive 02's status lines come exactly from README §4–§5 and `i02-markup.html`.
  - Don't edit, add, reorder or "improve" any of it. The captions are dated on purpose.
- **Media and fonts are final:** don't re-encode, resize, trim, crop, subset or regenerate them.
  - No `autoplay`, `loop` or `data-case-video`.
  - Every video and audio element is `preload="none"`, and plays only after a control press.
- **The demos send nothing:** no `fetch` or XHR, no storage, no analytics events.
- **Faithful to DOJANG (Interactive 02):**
  - Port `CompactCluster`'s behaviour and the wheel geometry exactly as §5 specifies: 200ms hold, 14px slop, dead zone 26, lead edge 86, head ring 160, the item angles.
  - Don't invent gestures, kicks or game feedback. Nothing in the figure pretends to fight.
- **Design rules (outside the replica):**
  - no rules or borders, no numbering, no italics, no shadows, no rounded corners;
  - keep the optical edges the README gives;
  - never size anything with `100vw`;
  - tap targets 44px or more below 1024, except the replica's own controls, which stay DOJANG's real size (§6);
  - focus-visible outlines stay on.
- **Inside the replica (`.djt`)**, DOJANG's styling applies (§5): IBM Plex Sans, translucent fills, thin borders, round buttons, the dashed arc, gold presses and glow rings. This is the documented fifth exception. Don't let it leak outside the stage.

Edge cases:
- **Interactive 01:**
  - starts on First version even with reduced motion;
  - switching resumes from zero only if the video was playing;
  - each version keeps its own caption.
- **Media 03:** starts on Before; choosing the current version does nothing; without JS both versions show.
- **Sound:** one clip at a time; pressing the playing one stops and rewinds it; a rejected `play()` resets `aria-pressed`; `pagehide` pauses both.
- **Interactive 02:**
  - **Version switch:** starts on First layout. Switching never changes the figure's height (the status line keeps its space). Leaving Compact cancels the gesture and resets the replica.
  - **Kick:** a quick tap throws the selected kick. A 200ms hold opens the wheel without moving. Sliding past 14px opens it at once.
  - **Wheel release:** on an item it selects and throws (head height past 160px). Within 14px of the centre it throws the selected kick. Anywhere else it throws nothing.
  - **Lost pointers:** `pointercancel` and `lostpointercapture` close the wheel without throwing.
  - **Scaling:** distances are in phone pixels, so divide by the layer's scale on desktop.
  - **Joystick:** floats (the base follows past 52px) and returns home on release.
  - **Below 1024:** the stage is 667 × 375 at real size, cropped to its right side; at 768 the whole screen shows; no horizontal overflow from 320.
  - **Keyboard:** Enter or Space on Kick throws the selected kick; on the chip it toggles; on the others it shows their status line. No page-level key handlers.
  - **Lifecycle:** clear the hold timer on version change and `pagehide`; reset on a persisted `pageshow`.
- **Without JS:**
  - the native video and audio controls;
  - Media 03's and Interactive 02's versions stacked;
  - Interactive 02's compact version shows the real screenshot and "Trying these controls needs JavaScript."
- **If the spec and the current code disagree,** tell me before choosing.

Before handing back:
1. Run `npm run typecheck` and `npm run build`.
2. Run every acceptance check in README §9:
   - the pixel comparisons for the essay, every figure state, the index and the first essay;
   - mouse, touch and keyboard passes with zero network requests from the figures;
   - the no-JS pass;
   - the 320–2560 overflow sweep;
   - metadata;
   - Range requests and posters for every video and both audio files;
   - home, case-study and both existing essays' regressions, including the Ace Trail switch under reduced motion.
3. Update CLAUDE.md as README §10 says.
4. Summarise:
   - the files you added and changed;
   - the checks you ran, with their results;
   - any difference from the README or references, and why.
5. Don't commit, push or merge. I'll review on `writing/dojang` and commit myself.
