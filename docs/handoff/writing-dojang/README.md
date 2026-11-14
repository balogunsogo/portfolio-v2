# Writing: Making a Fighting Game Feel Right in the Browser

**Status:** 14 November 2026. Approved. Ready to build.

**What this adds:**
- the third essay, **Making a Fighting Game Feel Right in the Browser**, at `/writing/making-a-fighting-game-feel-right-in-the-browser`;
- personal photos and a sparring clip, three game recordings, two before/after comparisons, a sound comparison, and two interactive figures:
  - **Interactive 01:** the same scripted exchange in DOJANG's first version and now (a video switch);
  - **Interactive 02:** the first touch layout next to a working copy of the compact touch controls;
- a footer change on the first essay, so the three essays form a loop.

**It builds on the Writing system that's already merged** (`docs/handoff/writing/README.md`, `docs/handoff/writing-job-url-extraction/README.md`, CLAUDE.md "Writing"):
- the registry, the index list, the essay shell, `_writing.scss`;
- `annotated-media.ts` (one video, explicit playback) and `media-switch.ts` (versioned video).
- Reuse them. Their behaviour for the existing essays must not change.

**The design:**
- On the design canvas "iudoh.me Layout Variations", page **Writing**, column "Making a Fighting Game Feel Right in the Browser · the essay".
- The boards:
  - `DjOpen`, `DjFighters`, `DjPhone`, `DjMatches` and `DjEnd`, desktop and mobile;
  - "Interactive 02 · every state, desktop and phone".
- `DjFighters` and `DjPhone` are clickable on the canvas with Play.

**References in this folder (`reference/`):**
- `article-desktop.html` and `article-mobile.html`:
  - static renders of the whole essay, with every figure in its first state, the clock at 11:05, and the real fonts and images from `src/assets`;
  - open them straight from the repo;
  - **`article-desktop.html` is the source of truth for every word of the essay.**
- `article-desktop-1…6.webp` (1440 wide, 17,403px in all) and `article-mobile-1…5.webp` (390 wide, 14,758px in all): screenshots of those pages at 1x, top to bottom, with reduced motion.
- `states/`: every state of the interactive figures, at 1440 (`-desktop`) and 390 (`-mobile`), as `.html` and `.webp`:
  - `i01-first`, `i01-now`: Interactive 01;
  - `m03-before`, `m03-after`: Media 03;
  - `i02-first`, `i02-compact`, `i02-wheel-open`, `i02-wheel-side`, `i02-wheel-head`, `i02-wheel-lead`, `i02-side-selected`, `i02-head-chip`, `i02-guard`, `i02-joystick`: Interactive 02;
  - `touch-current-real.webp`: the real current build, captured with its controls on 14 November (the replica's pixel target, §5).
- `i02-markup.html`: the exact markup for Interactive 02, with its data hooks.
- `controls-replica.css`: the replica's exact values, for `_dojang.scss`.
- `controls-logic.reference.js`: the canvas board's behaviour for Interactive 02, for porting to TypeScript.
- The references use the canvas's class names (`.page`, `.frame`, `.i2stage`…). Build with the site's classes (`writing-*`, `dj-*`) and match the result.
- Screenshots use Neue Montreal Regular for both 400 and 500, as the site does. **Match the references, not the canvas.**
- **The references win on appearance at 1440 and 390. This README wins on behaviour.**

**Media and fonts:** already in the working tree (§8). Don't regenerate, recompress, re-cut or subset them.

**Copy:** final and approved by the author.
- The essay text is his approved manuscript, with typographic apostrophes (’). It keeps his wording exactly, including "Most things that are good, or, I believe most things take time to get right." and the 😂.
- Captions, labels, alt text and the Interactive 02 status lines in §4–§6 are approved too. Captions are dated and say what each recording is. They must not be reworded to suggest a later recording shows an earlier moment.
- Don't edit, add to or reorder any copy.

---

## 1. Routes and files

| URL | Source file |
|---|---|
| `/writing/making-a-fighting-game-feel-right-in-the-browser` | `src/writing/making-a-fighting-game-feel-right-in-the-browser.html` |

**New files:**
- `src/writing/making-a-fighting-game-feel-right-in-the-browser.html`: the essay page.
- `src/scss/posts/_dojang.scss`: everything only this essay needs: the figure frames, the photo pair, the two-up pairs, the knockdown labels, the sound comparison, the touch-controls replica and the CTA link. Everything sits under `.dj-essay`.
- `src/ts/posts/dojang/`, loaded only by this page's own `<script type="module">`:
  - `image-switch.ts`: Media 03 (§4);
  - `sound-compare.ts`: the sound comparison (§4);
  - `wheel.ts`: the kick wheel's data and `pickWheel()`, pure, no DOM (§5);
  - `controls-demo.ts`: Interactive 02 (§5);
  - `main.ts`: the entry the page loads (`/assets/js/posts/dojang/main.js`).
  - Each initialises only when its `data-*` hook is on the page. Imports use the `.js` extension.
- Media, fonts and the licence (§8): already in the working tree.

**Changed files:**
- `src/ts/posts.ts`: the new entry (§2).
- `src/writing/index.html`: the post goes first in the Blog JSON-LD `blogPosting` array.
- `src/writing/space-between-design-and-engineering.html`: its footer now points to this essay (§3). Nothing else on that page changes.
- `src/ts/writing/media-switch.ts`: one backward-compatible option, `data-media-start` (§4, Interactive 01).
- `src/scss/_writing.scss`: one reusable modifier, `.writing-meta--head` (§3).
- `src/scss/_fonts.scss`: two IBM Plex Sans faces (§8).
- `src/scss/_tokens.scss` (CRLF): `$font-dojang` (§8).
- `src/scss/main.scss`: `@use 'posts/dojang';`.
- `scripts/dev.mjs`: `'.mp3': 'audio/mpeg'` in the content types, so the dev server serves the sound files correctly (§8).
- `vercel.json`: an `/assets/audio/(.*)` cache rule identical to the video one.
- `CLAUDE.md`: §10.

**Not changed:**
- `posts.mjs`, `shared.mjs`, `main.ts`, `annotated-media.ts`;
- `_case.scss`, `_layout.scss`, `_index.scss`, `_job-url-extraction.scss`, `_space-between.scss`;
- the JobTrackr essay (its footer already points to the first essay), the case studies, home, About and the Writing index layout.

---

## 2. Registry entry

Add it to `posts` in `src/ts/posts.ts`. `shownPosts` sorts it first.

```ts
{
  slug: 'making-a-fighting-game-feel-right-in-the-browser',
  title: 'Making a Fighting Game Feel Right in the Browser',
  description: 'How $100 in expiring Claude credits turned into DOJANG, a playable 3D Taekwondo game, and the iterations that followed.',
  published: '2026-11-14',
  readingMinutes: 9, // 1,786 words of body copy, at about 200 words a minute.
},
```

- **Index:** three posts now, newest first. The existing rule applies: on desktop the list grows upward from its bottom-aligned position, then extends the page. Check 1440 × 900, 1320 × 700 and 390 × 844.
- **Blog JSON-LD in `src/writing/index.html`:** add a `BlogPosting` for this post, first in `blogPosting`, with the same fields as the others (`image`: the OG image in §3).

---

## 3. The essay page

### Shell, header and metadata

- **Same shell as the other essays:** `<div class="case writing dj-essay">`, the `case-top` bar (`data-case-top`, name + "Writing"), `writing-head`, `writing-body`, the case footer, `main.css`, `main.js` and this page's module script.
  - Mirror `.jx-essay`'s page-level rule for `.dj-essay` (desktop `padding-bottom: 160px`) and its `[hidden] { display: none !important; }` guard.
- **Title:** "Making a Fighting Game Feel Right in the Browser", `.writing-title.writing-title--stem` (it starts on an M). Two lines on desktop, as in the reference.
- **Subtitle:** the registry description. The dollar amount is plain text.
- **Meta: in the header, under the subtitle.** This essay opens with a titled section, so the meta can't sit in the first section's rail as it does on the other two.
  - Markup: `<dl class="writing-meta writing-meta--head">` with Published "14 November 2026" (`<time datetime="2026-11-14">`) and Reading time "9 minutes", as the last child of `.writing-head`.
  - Add to `_writing.scss` (reusable): `.writing-meta--head { margin-top: 16px; }` below desktop; from 1024 `flex-direction: row; gap: 48px; padding-top: 0; margin-top: 12px;` (the existing desktop `.writing-meta` is a flex column).
  - Result: 32px below the subtitle on mobile (16px head gap + 16px), 40px on desktop (28px + 12px), as in the reference.
- **Head:** copy the JobTrackr essay's head and change the values:
  - title `Making a Fighting Game Feel Right in the Browser — Balogun Oluwasogo`;
  - description: the subtitle;
  - canonical and `og:url` `https://www.balogunoluwasogo.com/writing/making-a-fighting-game-feel-right-in-the-browser`;
  - `og:image` / `twitter:image` `https://www.balogunoluwasogo.com/assets/images/writing/dojang-og.jpg` (1200 × 630), alt `Making a Fighting Game Feel Right in the Browser, by Balogun Oluwasogo`;
  - `article:published_time` `2026-11-14`;
  - `BlogPosting` JSON-LD with `datePublished` and `dateModified` `2026-11-14`.
  - Keep the Neue Montreal preload. **Don't preload IBM Plex Sans.**
  - Module script: `<script type="module" src="/assets/js/posts/dojang/main.js"></script>`.

### Body order

Take each section's text from the reference. Heading edge modifiers follow each heading's first glyph; all four exist already.

| `id` | Heading (edge) | Inside the section, in order |
|---|---|---|
| `start-heading` | It started with $100 I didn’t want to waste (stem) | prose to "That’s how DOJANG started." · **Media 01** · `writing-after` prose (one paragraph) |
| `first-heading` | Getting the first version working (round) | prose · **Media 02** |
| `fighters-heading` | Making the fighters feel like Taekwondo practitioners (stem) | prose to "…preparing to react." · **Sparring clip** · `writing-after` prose to "…what still needed attention." · **Interactive 01** · `writing-after` prose to "…what I had in mind." · **Media 03** · `writing-after` prose (three paragraphs) |
| `phone-heading` | A fighting game still has to feel good on a phone (none: starts on A) | prose · **Interactive 02** · `writing-after` prose (two paragraphs) |
| `beaten-heading` | Getting beaten by my own game (round) | prose · **Media 04** · `writing-after` prose · **Media 05** |
| `sound-heading` | Not everything is where I want it yet (stem) | prose to "…sound more natural." · **Sound comparison** · `writing-after` prose |
| `still-heading` | Still playing, still improving (s) | prose · **Media 06** · `writing-after` prose |
| `cta-heading` | Give DOJANG a try (round) | one paragraph, then the large "Play DOJANG" link |

- **Figures** span the full content width, with the shared `writing-demo` spacing: 72px above on desktop, 48px below desktop. The canvas boards drew 32px on mobile; the shared values win, as on the other essays.
- **The CTA link:** "Play DOJANG" → `https://dojang.balogunoluwasogo.com`, `target="_blank" rel="noopener"`, with the visually hidden " (opens in a new tab)". `.dj-cta` copies `.jx-cta` exactly (28px, 48px from 1024, `margin-left: -$lsb-stem-medium` because P starts on a stem, `min-height: 44px` below desktop).

### Footers: the three essays form a loop

| Essay | "Next essay" link | Edge |
|---|---|---|
| This essay | Building Job URL Extraction into JobTrackr → `/writing/building-job-url-extraction-into-jobtrackr` | `case-display--stem` |
| The Space Between Design and Engineering | **changes to** Making a Fighting Game Feel Right in the Browser → `/writing/making-a-fighting-game-feel-right-in-the-browser` | `case-display--stem` |
| Building Job URL Extraction into JobTrackr | unchanged: The Space Between Design and Engineering | unchanged |

- Same markup as today: `.writing-foot__label` "Next essay", then `.writing-foot__essay`. The clock and links are unchanged.

---

## 4. The figures

All videos are muted (they have no audio track), `playsinline preload="none"`, with a poster. Never `autoplay`, `loop` or `data-case-video`. Explicit play only, through the existing modules.

### Single videos: annotated-media, as in the JobTrackr essay's Media 01

Markup pattern (wrap in `<div data-annotated-media>`):

```html
<figure class="writing-demo"><div class="writing-plate"><div class="writing-frame dj-frame--…"><video class="writing-video" muted playsinline preload="none" controls src="…" poster="…" aria-label="…" data-media-video></video></div><div class="writing-controls" data-media-controls hidden><p class="writing-controls__label">LABEL</p><div class="writing-control-group writing-controls__actions"><button class="writing-control" type="button" data-media-replay hidden>Replay</button><button class="writing-control writing-control--ink" type="button" data-media-toggle>Play</button></div></div></div><figcaption class="writing-row writing-caption"><p>CAPTION</p></figcaption></figure>
```

Frame ratios (`_dojang.scss`): `.dj-frame--video { aspect-ratio: 16 / 9; }`, `.dj-frame--recording { aspect-ratio: 1320 / 720; }`, `.dj-frame--knockdown { aspect-ratio: 1280 / 324; }`.

| Figure | Video / poster | Frame | Label | `aria-label` | Caption |
|---|---|---|---|---|---|
| **Sparring clip** | `dojang-sparring.mp4` / `dojang-sparring-poster.webp` | video | Sparring in November 2025 | Sparring outdoors in November 2025: me in a white dobok and chest protector, exchanging kicks with my partner. | Cut from a longer recording down to the busiest exchanges. I’m the one in the white dobok. |
| **Media 04** | `dojang-black-belt.mp4` / `dojang-black-belt-poster.webp` | recording | Against the Black Belt AI | A match against the Black Belt AI, from choosing the opponent to the result: the AI wins the first round by knockout, then I win the next two. | A recent match, recorded on 14 November 2026 with a keyboard. It knocked me out in the first round, and I came back to win 2–1. |
| **Media 05** | `dojang-online.mp4` / `dojang-online-poster.webp` | recording | An online match | An online match from the lobby countdown to the result: one player on a keyboard, the other on a touch screen. I win 2–0. | Recorded on 14 November 2026: me on a keyboard, my opponent on a touch screen, joined through a room link. It’s a later match, not the first session with my colleague. |
| **Media 06** | `dojang-knockdown.mp4` / `dojang-knockdown-poster.webp` | knockdown | The same knockout, before and after | The same knockout twice, side by side. Left, before the change: the knocked-out fighter freezes in the pose they were hit in. Right, after: they fall to the mat. | The knockdown fall, added on 9 November 2026. Before it, a knocked-out fighter froze in the pose they were hit in. |

- **Media 06** has a row of two labels between the frame and the controls, each over its half: `<div class="dj-halves" aria-hidden="true"><p>Before</p><p>After</p></div>`. A two-column grid, 12px below the frame on desktop (16px muted), 8px below desktop (13px muted). The video's `aria-label` carries the same information.

### Media 01: the two photos (no plate)

```html
<figure class="dj-photos" aria-label="Me, training at home in 2020 and in my dobok in November 2025">
  <div class="writing-row"><div class="dj-photos__pair">
    <img src="/assets/images/writing/dojang-taekwondo-2020-1200.webp" srcset="/assets/images/writing/dojang-taekwondo-2020-600.webp 600w, /assets/images/writing/dojang-taekwondo-2020-1200.webp 1200w" sizes="(min-width: 1024px) 31vw, 50vw" width="1200" height="1600" alt="Me at home in 2020, in a dobok and red belt, holding a high kick with my foot above my head." loading="lazy" decoding="async">
    <img … dojang-taekwondo-2025 … alt="Me in November 2025, standing on an outdoor court in a dobok with a yellow belt.">
  </div></div>
  <figcaption class="writing-row writing-caption"><p>Training at home in 2020, and in my dobok in November 2025.</p></figcaption>
</figure>
```

- Desktop: the pair spans **columns 5–12** (it starts on the prose's left edge and runs to the right margin): `grid-column: 5 / span 8`, two equal columns, `$gutter` apart. Images are 3:4, `object-fit: cover`.
- Below desktop: two columns 12px apart.
- Spacing: `writing-demo` spacing (72px / 48px above). The caption uses the shared caption styles.

### Media 02: the first version, two stills (no controls)

- One plate (`writing-demo` › `writing-plate`) holding `.dj-pair`: two `.writing-frame.dj-frame--video` frames with `<img class="dj-img">` (`display: block; width: 100%; height: 100%; object-fit: cover`).
- `.dj-pair`: desktop a two-column grid, 24px gap; below desktop a column, 12px gap.
- Images: `dojang-first-exchange.webp` alt "The first version: the two fighters squaring up on the mat, with health bars, a round timer and a performance readout at the top."; `dojang-first-roundhouse.webp` alt "The first version: the blue fighter’s roundhouse kick landing on the red fighter’s body." (960 × 540, `loading="lazy"`).
- No controls row: the plate's bottom padding is the plate's own.
- Caption: "The first version, on 1 November 2026: the fighters squaring up, then a roundhouse kick landing. The figures at the top left are the game’s performance readout."

### Interactive 01: First version / Now (media-switch)

- **Markup:** copy the first essay's Ace Trail switch exactly (`<div class="writing-demo" data-media-switch data-media-start="0">`, two `figure.writing-version` with `data-media-version`), with:
  - group `aria-label="Version"`; versions **"First version"** then **"Now"**;
  - frames `.writing-frame.dj-frame--video`;
  - videos `dojang-motion-first.mp4` / `dojang-motion-first-poster.webp` and `dojang-motion-now.mp4` / `dojang-motion-now-poster.webp`;
  - `aria-label`s: "DOJANG’s first version: thin, jointed figures run the scripted exchange, with a roundhouse kick that lands, a blocked side kick, a back kick and a head kick." and "DOJANG now: fighters in doboks, gloves and headgear run the same scripted exchange."
- **Captions** (one per version, as in the Ace Trail switch):
  - First version: "DOJANG’s first version, from 1 November 2026. Both clips run the same scripted exchange through that build’s own simulation and animation: a roundhouse kick that lands, a blocked side kick, a back kick and a head kick. Rendered on 14 November 2026 with the same fixed camera."
  - Now: "DOJANG as it is now. Both clips run the same scripted exchange through that build’s own simulation and animation: a roundhouse kick that lands, a blocked side kick, a back kick and a head kick. Rendered on 14 November 2026 with the same fixed camera."
- **`media-switch.ts` change (the only change to shared playback):** today it starts on version 2 when the reader prefers reduced motion, which suits the Ace Trail figure only. Add an opt-out:
  ```ts
  const start = root.dataset.mediaStart;
  select(start !== undefined ? Number(start) : window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0);
  ```
  The first essay doesn't set the attribute, so it behaves exactly as before. Everything else (switching keeps one video, resumes only if it was playing, no `load()`, no seeking) stays as is.

### Media 03: the fighters and their faces, before and after (`image-switch.ts`)

Two images per version, switched with Before / After. It works like the media switch, without video.

```html
<div class="writing-demo" data-image-switch>
<figure class="writing-version" data-image-version="Before">
  <div class="writing-plate" data-image-plate>
    <div class="dj-pair">
      <div class="writing-frame dj-frame--video"><img class="dj-img" src="/assets/images/writing/dojang-fighters-before.webp" width="1280" height="720" alt="Before: two thin, painted figures squaring up in the dojang." loading="lazy" decoding="async"></div>
      <div class="writing-frame dj-frame--video"><img class="dj-img" src="/assets/images/writing/dojang-faces-before.webp" width="1280" height="720" alt="Before: four close-ups of the fighters’ heads in headgear, with smooth, featureless faces." loading="lazy" decoding="async"></div>
    </div>
    <div class="writing-controls" data-image-controls hidden><div class="writing-control-group" role="group" aria-label="Characters" data-image-versions></div></div>
  </div>
  <figcaption class="writing-row writing-caption"><p>Before: the fighters as painted figures, and their first faces, with no features. Both changes were made on 3 November 2026.</p></figcaption>
</figure>
<figure class="writing-version" data-image-version="After">
  … the same, with dojang-fighters-after.webp ("After: the same fighters in loose doboks with belts, hogu, headgear, gloves and foot protectors.")
  and dojang-faces-after.webp ("After: the same close-ups with simple eyes, noses and mouths."), no controls …
  <figcaption …><p>After: doboks, belts, hogu, headgear, gloves and foot protectors, then simple faces. Both changes were made on 3 November 2026.</p></figcaption>
</figure>
</div>
```

- **Without JS:** both versions show, stacked, each with its caption (the existing `.writing-version + .writing-version` spacing).
- **With JS:**
  - build one `button.writing-control` per version in `[data-image-versions]`, with `aria-pressed`;
  - show the chosen version only, move the controls into its plate, and keep focus on the pressed button;
  - start on **Before**. Choosing the current one does nothing.
- On desktop the controls row is left-aligned (no actions group), as in the reference.

### The sound comparison (`sound-compare.ts`)

Placed after "But I still think there’s room to make it sound more natural." Text-only, in the prose column.

```html
<figure class="writing-row dj-sound" aria-labelledby="dj-sound-label" data-sound-compare>
  <div class="dj-sound__body">
    <p class="dj-sound__label" id="dj-sound-label">The same four-second sequence</p>
    <div class="dj-sound__items" data-sound-items>
      <div class="dj-sound__item"><p>The first sound set</p><audio controls preload="none" src="/assets/audio/writing/dojang-sound-first.mp3" data-sound-audio="Play the first sound set"></audio></div>
      <div class="dj-sound__item"><p>The current sound</p><audio controls preload="none" src="/assets/audio/writing/dojang-sound-now.mp3" data-sound-audio="Play the current sound"></audio></div>
    </div>
    <figcaption class="dj-sound__cap">Both exported from DOJANG’s sound lab on 3 November 2026: the first set, all generated, then the mix of recorded and generated sounds that replaced it.</figcaption>
  </div>
</figure>
```

- **Layout:**
  - desktop: the body in columns 5–10 (max `$measure`), 12px gaps;
  - label 16px muted; buttons 20px ink, 32px apart; caption 16px muted;
  - 56px above, and the next `writing-after` block 56px below (`.dj-sound + .writing-after`).
  - Below desktop: 32px above; label 15px muted; buttons stacked, 17px, each at least 44px tall; caption 15px muted, 4px gap.
- **Without JS:** the two native players with their names.
- **With JS:**
  - replace each item with a `button.writing-control.writing-control--ink` labelled by its `data-sound-audio` ("Play the first sound set", "Play the current sound");
  - keep the `<audio>` elements without `controls` (hidden), and set `aria-pressed="false"`.
  - A press plays that clip from 0 and pauses and rewinds the other. Pressing it again while it plays stops it and rewinds.
  - `aria-pressed` is `true` while playing and returns to `false` on pause, end or a rejected `play()`.
  - Nothing downloads before a press. `pagehide` pauses both.

---

## 5. Interactive 02: the touch controls (`controls-demo.ts`, `wheel.ts`)

**What it shows:** the first touch layout (a real 1 November screenshot) beside the compact layout. In the compact layout the reader can try a working copy of DOJANG's touch controls. A status line names each action and its keyboard key.

### Source of truth

- DOJANG `main` `b34f80c` (14 November 2026): `src/styles.css` ("Touch controls" and "Compact scheme"), `src/ui/TouchControls.tsx` (`CompactCluster`, `TapButton`, `HoldButton`, the joystick) and `src/ui/wheel.ts`.
- `reference/controls-replica.css` has those styles resolved for an iPhone SE in landscape (667 × 375):
  - `--edge-r: 14px`, `--edge-b: 10px`;
  - `--bp-scale: 0.88` (the game's `max-height: 390px` rule);
  - control opacity 0.7 (the default);
  - the joystick's 0.9 scale and the top buttons at `top: 40px`, 32px.
- **Pixel check:** the replica over `dojang-touch-frame.webp` matched the real capture (`states/touch-current-real.webp`) to the pixel at 667 × 375 @2x. Only the 3D frame behind it differs, because the scene moved between the two captures.
- `reference/controls-logic.reference.js` is the canvas board's port of the behaviour.

### Markup

Use `reference/i02-markup.html` exactly. In outline:
- `div.writing-demo.dj-touch[data-touch-demo]` holds two `figure.writing-version`: **First layout** and **Compact layout**. Each has a `data-touch-coverage` readout and its own caption.
- Each plate has a `.dj-stage` with the screenshot.
- The compact stage also holds `.dj-stage__layer[data-touch-layer]`, a 667 × 375 layer containing the replica (`.djt`). Every control is a real `<button>`, disabled in the HTML.
- `.dj-touch__bar[data-touch-bar]` holds the switch row (`[data-touch-controls]`: the version buttons and the coverage readout) and the status line (`[data-touch-say]`, `aria-live="polite"`).

### Replica styling (the fifth decoration exception)

- Inside `.djt` only, DOJANG's own styling applies: IBM Plex Sans (500 for the small Korean names, 600 for everything set at 700), translucent dark fills, 1–1.5px light borders, round buttons, the 2px dashed arc, the gold press colour `#E8C34A`, and its two glow rings (`box-shadow`).
- Copy `controls-replica.css` into `_dojang.scss` under `.dj-essay`, renaming nothing inside `.djt`. Use `$font-dojang`.
- Don't let any of it leak outside the stage.

### The stage

- **Desktop (from 1024):**
  - `.dj-stage` is the frame: `aspect-ratio: 667 / 375`, `overflow: hidden`, background `#15120F`;
  - the screenshot fills it (`position: absolute; inset: 0; width: 100%; height: 100%`);
  - the layer is 667 × 375 at the top left with `transform: scale(var(--dj-scale)); transform-origin: 0 0`.
  - A `ResizeObserver` on the stage sets `--dj-scale = stage width / 667`. At 1440 that's 1184 / 667 ≈ 1.775.
- **Below 1024:** the screen is shown **at its real size, cropped to its right side**, so the controls are thumb-sized on a phone.
  - `.dj-stage { width: 100%; max-width: 667px; height: 375px; aspect-ratio: auto; }`;
  - the screenshot and the layer are each 667 × 375, `right: 0`, no transform.
  - At 390 the plate shows the right 326px (the whole cluster and wheel). Once the stage reaches 667px (at 768, for example) the whole screen shows.
  - The caption's `.dj-phone-note` span shows only below 1024.
- Both versions use the same stage size, so switching never changes the figure's height.

### Without JavaScript

- Both versions show, stacked, each with its caption.
- The compact version shows the **real** 14 November screenshot (`dojang-touch-compact.webp`, with its controls).
- The layer stays hidden, and the status line reads "Trying these controls needs JavaScript."

### With JavaScript

- **Switch:** build "First layout" and "Compact layout" buttons in `[data-touch-versions]` (`aria-pressed`). Start on **First layout**.
  - Show one version, move the bar into its plate, and set the readout from `data-touch-coverage`: "Covers 32.4% of the screen" / "Covers 17.6% of the screen".
  - In First layout the status line keeps its space but is `visibility: hidden`.
  - Choosing the current version does nothing.
  - Leaving Compact cancels any gesture and resets the replica: Round selected, Body, wheel closed, joystick home, status back to the first line.
- **Go live:**
  - swap the compact screenshot to `data-live-src` (`dojang-touch-frame.webp`, the clean frame) and its alt to `data-live-alt`;
  - unhide the layer and enable its buttons;
  - set the status line to: **"Tap Kick to repeat your selected kick. Slide from it, or hold it, to open the wheel."**
- **Pointer maths:** gesture distances are in phone pixels: `k = layer.getBoundingClientRect().width / 667` (1 below desktop), `dx = (clientX − kickCentreX) / k`. The kick centre is the Kick button's bounding-box centre at pointer-down.

### Behaviour (a port of `CompactCluster`; don't invent more)

- **Kick:**
  - `pointerdown`: capture the pointer, mark it pressed (`.is-down`), and start a **200ms** hold timer that opens the wheel.
  - `pointermove`: past **14px** (`TAP_SLOP`) the wheel opens at once. While open, `pickWheel(dx, dy)` highlights an item: `.is-on`, and `.is-head` with its small label reading **HEAD**.
  - `pointerup`:
    - wheel never opened → throw the selected kick;
    - released on an item → select it (if new) and throw it, at head height if picked past the head ring;
    - released within 14px of the centre → throw the selected kick;
    - otherwise nothing is thrown.
  - `pointercancel` / `lostpointercapture` close everything without throwing.
  - While open, the cluster gets `.is-open`: the other buttons fade to 0.12. The selected item has `.is-sel`.
- **`pickWheel` (port exactly):** dead zone 26; inner (lead) ring below 86, items at radius 58; outer (rear) ring items at 118; head height from 160; angle `atan2(−dy, dx)` in degrees, plus 360 below −60; nearest item on that ring within 22 + 8 degrees.
  - Items: L·Front 95°, L·Round 140°, L·Side 185° (lead; small names "lead", "lead", "cut") and Front 92°, Round 127°, Side 162°, Back 197° (rear; Ap, Dollyeo, Yeop, Dwi).
- **The Kick button's labels** follow the selection: Round / Dollyeo, Front / Ap, Side / Yeop, Back / Dwi, L·Front / lead leg, L·Round / lead leg, L·Side / cut kick.
- **Head/Body chip:** toggles; label BODY / HEAD; `.is-on` and `aria-pressed`. While on, Kick has `.is-head` and every kick goes to the head.
- **Guard:** pressed while held. **Dash, Punch, ⇄:** pressed while the pointer is down.
- **Pause, Lock-on:** status line only. Nothing pauses.
- **Joystick (desktop only; it's off-crop on phones):** the zone is the left 42% from 24% down.
  - On press the base jumps under the pointer (`left/top = point − 52`, `.is-active`), and the knob follows within 52px.
  - Beyond 52px the base is dragged along (floating joystick).
  - On release it returns to `left: 36px; top: 229px`.
- **Keyboard:** every control is a button.
  - Enter or Space on Kick throws the selected kick. On the other controls they show their status line; the chip toggles.
  - Detect keyboard activation as a `click` with `detail === 0`. Pointer clicks are already handled by the pointer events.
  - The wheel is a pointer gesture. Don't add keyboard shortcuts to the page.

### Status lines (exact copy)

| Action | Status line |
|---|---|
| Throw a kick | `{Name} to the {body/head}.` + ` Kick now repeats it.` when the selection changed (` Kick now repeats it at body height.` if it was picked past the head ring with the chip off) + ` On a keyboard: …` |
| Keyboard part | no modifier: `On a keyboard: L.`; one: `On a keyboard: hold E and press L.`; two: `On a keyboard: hold F and E, then press K.` (F for lead-leg kicks, E for head height) |
| Names and keys | Front kick K · Roundhouse kick L · Side kick U · Back kick I · Lead-leg front kick K · Lead-leg roundhouse kick L · Lead-leg side kick U |
| Released away from the kicks | Released away from the kicks, so nothing was thrown. |
| Head chip on / off | Kicks now go to the head. On a keyboard: hold E. / Kicks go to the body again. |
| Guard | Guarding while you hold Guard. On a keyboard: hold Space. |
| Dash / Punch / ⇄ | Dash. On a keyboard: Shift. / Punch. On a keyboard: J. / Switched stance. On a keyboard: Q. |
| Joystick | Moving. On a keyboard: W, A, S and D, or the arrow keys. |
| Pause / Lock-on | Pause. On a keyboard: Esc or P. / Lock-on. On a keyboard: Tab. |

- The keyboard keys come from DOJANG's `KEY_BINDINGS` (`src/game/input/InputManager.ts`).

### Lifecycle

- Clear the hold timer and release any gesture on version change, `pagehide` and `lostpointercapture`.
- On a persisted `pageshow`, reset to the go-live state.
- Disconnect the `ResizeObserver` on `pagehide` and reconnect on `pageshow`.
- No network requests, no storage, no analytics.

---

## 6. Accessibility, motion and performance

- **Alt text and video labels** are in §4 and `i02-markup.html`. Decorative wheel rings are inside an `aria-hidden` wheel. The status line is the replica's only live region.
- **Tap targets below 1024:** the version buttons and media controls use the shared 44px hit areas.
  - The replica's controls are DOJANG's real sizes on a phone (Kick 74px, Guard 56px, Dash and Punch 44px, ⇄ 38.7px, the chip 56 × 26px). That's the point of the figure, so don't enlarge them.
  - The sound buttons are 44px tall.
- **Focus-visible:** the portfolio's outline everywhere. Inside `.djt` a 2px white outline with a 2px offset, because the stage is dark.
- **Reduced motion:** the replica has no animation beyond DOJANG's 60ms press transitions; remove them under `prefers-reduced-motion`. Videos never start on their own.
- **Performance:**
  - posters and images lazy-load below the fold;
  - videos and audio are `preload="none"`;
  - IBM Plex Sans is used only inside the replica, so it downloads only when the compact layout renders;
  - no new dependencies; this page's module is its only extra script.

---

## 7. Provenance (why the captions say what they say)

- **Personal photos and the sparring clip:** supplied by the author, who approved publishing them (the clip shows his sparring partner and children in the background). The clip is cut from a 1-minute-plus phone recording made on 8 November 2025 down to 24 s of the busiest exchanges. EXIF and location data removed.
- **Interactive 01:** rendered on 14 November 2026 by `provenance/clipLab.ts`, dropped unchanged into two checkouts:
  - DOJANG `af3f767` (1 November, the first version's animation, just before Phase 1.5);
  - `main` `b34f80c`.
  - Same scripted inputs, each build's own simulation, animator, characters, dojang and hit effects. 533 frames at 60 fps, fixed camera.
  - Both builds logged the same events at the same ticks: hit round 109, block side 221, hit back 323, hit head round 443.
- **Interactive 02:**
  - `dojang-touch-first.webp` is DOJANG's own evidence from 1 November (`docs/media/phase1.5/hud-before-iphonese.jpg`, measured 32.4%).
  - `dojang-touch-compact.webp` and `dojang-touch-frame.webp` were captured from `main` on 14 November by `provenance/mobcap.js` (iPhone SE landscape, touch). It measured 17.6%, with the same method as DOJANG's `scripts/ux-capture.mjs`, identical to the 1 November figure.
- **Media 02 and 03:** DOJANG's own evidence screenshots (`docs/media/desktop-*.jpg`, 1 November; `phase8/`, `phase8_1/`, 3 November), unaltered apart from WebP encoding.
- **Media 04 and 05:** the author's screen recordings of 14 November 2026. Browser chrome cropped; cut to the busiest moments. They are recent matches, not the original Black Belt loss or the first online session.
- **Media 06:** DOJANG's `docs/media/ko-fall/ko-before-after.mp4` (9 November), with its "Before (main)" / "After" burned-in labels cropped off. The page labels the halves instead.
- **Sound:** DOJANG's `docs/media/phase9_1/sequence-v9.mp3` and `sequence-v91.mp3`, exported by its sound lab on 3 November. The current game uses the second.

---

## 8. Media and fonts (final; already in the working tree)

| File | What it is |
|---|---|
| `src/assets/video/writing/dojang-sparring.mp4` | 1280 × 720, 29.97 fps, H.264, no audio, 23.99 s, 6.3 MB, fast start |
| `src/assets/video/writing/dojang-motion-first.mp4` | 1280 × 720, 60 fps, no audio, 8.88 s, 2.4 MB, fast start |
| `src/assets/video/writing/dojang-motion-now.mp4` | 1280 × 720, 60 fps, no audio, 8.88 s, 2.5 MB, fast start |
| `src/assets/video/writing/dojang-black-belt.mp4` | 1320 × 720, 29.97 fps, no audio, 24.62 s, 3.4 MB, fast start |
| `src/assets/video/writing/dojang-online.mp4` | 1320 × 720, 29.97 fps, no audio, 24.32 s, 3.7 MB, fast start |
| `src/assets/video/writing/dojang-knockdown.mp4` | 1280 × 324, 30 fps, no audio, 3.37 s, 230 KB, fast start |
| `src/assets/audio/writing/dojang-sound-first.mp3`, `dojang-sound-now.mp3` | 4.05 s each, 44.1 kHz stereo, 37 KB / 74 KB |
| `src/assets/images/writing/dojang-*-poster.webp` | one per video, at the video's size |
| `src/assets/images/writing/dojang-taekwondo-2020-{600,1200}.webp`, `dojang-taekwondo-2025-{600,1200}.webp` | the two photos, 3:4 |
| `src/assets/images/writing/dojang-first-exchange.webp`, `dojang-first-roundhouse.webp` | 960 × 540 |
| `src/assets/images/writing/dojang-fighters-{before,after}.webp`, `dojang-faces-{before,after}.webp` | 1280 × 720 |
| `src/assets/images/writing/dojang-touch-first.webp`, `dojang-touch-compact.webp`, `dojang-touch-frame.webp` | 1334 × 750 (667 × 375 @2x) |
| `src/assets/images/writing/dojang-og.jpg` | 1200 × 630, the other essays' share-image layout with this title |
| `src/assets/fonts/ibm-plex-sans/plex-sans-latin-500.woff2`, `-600.woff2` | IBM Plex Sans Latin 500 and 600, byte-identical to DOJANG's self-hosted files (Fontsource 5.x) |
| `docs/font-licenses/IBMPlexSans-OFL.txt` | its SIL Open Font License |

- **`_fonts.scss`:** two `@font-face` rules for `'IBM Plex Sans'` (500 and 600, `font-display: swap`) with a licence comment: "DOJANG touch-controls replica only." No preload.
  - Only 500 and 600 ship: DOJANG's labels ask for 700 and resolve to its 600 face, which this reproduces. Don't add 700.
- **`_tokens.scss`:** `$font-dojang: 'IBM Plex Sans', system-ui, sans-serif;`.
- **Audio:**
  - `scripts/dev.mjs` gains `'.mp3': 'audio/mpeg'`; its Range handling already covers it.
  - `vercel.json` gains an `/assets/audio/(.*)` rule with the video rule's `Cache-Control`.
  - `copyStatic()` already copies `src/assets`.

---

## 9. Acceptance checks

1. `npm run typecheck` and `npm run build` pass.
2. **Essay:** compare with `reference/article-desktop-*.webp` at 1440 and `article-mobile-*.webp` at 390, reduced motion, clock frozen at 11:05.
   - The text matches `reference/article-desktop.html` exactly.
   - Allowed differences: anti-aliasing, the shared 48px mobile figure spacing (§3), and the case footer's own markup.
3. **Interactive 01:** starts on First version with and without reduced motion. Switching keeps one video, resumes from zero only if it was playing, and swaps the caption. Nothing downloads before Play.
   - **The first essay's Ace Trail switch still starts on Reduced motion when that's preferred.**
4. **Media 03:** Before / After switch with mouse, touch and keyboard; both versions are readable without JS.
5. **Interactive 02:** walk every state in `reference/states/i02-*` with a mouse at 1440, touch at 390 × 844 and the keyboard, and compare.
   - Tap Kick → Roundhouse kick to the body.
   - Hold 200ms → the wheel opens without moving.
   - Slide onto Side → Side highlights; release → Kick reads Side / Yeop.
   - Past the head ring on Round → HEAD.
   - The inner ring → lead-leg kicks.
   - Release away → nothing thrown.
   - The chip → HEAD and the Kick ring.
   - Guard held. The joystick floats and returns (desktop).
   - Switching back to First layout resets everything.
   - At 768 the whole 667 × 375 screen shows at real size.
   - Zero network requests while using it.
6. **Sound:** one clip at a time, press again stops, nothing downloads before a press; native players without JS.
7. **Index:** three posts, newest first, dates in UTC, reading times 9 / 10 / 6. The Blog JSON-LD lists all three.
8. **Footers:** DOJANG → JobTrackr; Space Between → DOJANG; JobTrackr → Space Between unchanged. Nothing else on the first essay changes (pixel-compare).
9. **Media:** every video and both audio files answer Range requests. Replay restarts; a rejected `play()` restores "Play".
10. **No horizontal overflow** from 320 to 2560 with classic scrollbars, including the stage at 320.
11. **Metadata:** canonical, OG and Twitter tags and `BlogPosting` JSON-LD; the OG image resolves.
12. **Regressions:** home (closed and About open), the five case studies, and both existing essays' demos are unchanged.

---

## 10. CLAUDE.md

Under "Writing", add:
- **Third essay:** "Making a Fighting Game Feel Right in the Browser", 14 November 2026. Spec, references and provenance: `docs/handoff/writing-dojang/`. Its prose is copied from `reference/article-desktop.html`. Its meta sits in the header (`.writing-meta--head`) because it opens with a titled section.
- **Its code:** `src/ts/posts/dojang/` and `src/scss/posts/_dojang.scss`, loaded only by that essay.
  - Interactive 01 uses `media-switch.ts` with `data-media-start="0"`. Without the attribute the switch keeps its reduced-motion default.
  - Media 03 uses `image-switch.ts`. The sound comparison uses `sound-compare.ts`: one clip at a time, explicit play.
  - Interactive 02 replicates DOJANG's compact touch controls from DOJANG `main` `b34f80c`: the 200ms hold, 14px slop, the wheel thresholds 26 / 86 / 160 and the status-line copy in spec §5.
  - Phones see the stage at real size, cropped to the right side. It sends, stores and records nothing.
- **Design-rule exception (the fifth):** inside the DOJANG touch-controls replica only, DOJANG's own styling applies: IBM Plex Sans, translucent fills, thin light borders, round buttons, the dashed arc, gold press colour and glow rings.
- **Fonts:** IBM Plex Sans 500 and 600 (OFL, `docs/font-licenses/IBMPlexSans-OFL.txt`), used only by that replica.
- **Audio:** `assets/audio/writing/` MP3s; `dev.mjs` serves `.mp3` as `audio/mpeg`.
- **Footers:** the essays form a loop, newest to oldest: DOJANG → JobTrackr → Space Between → DOJANG. Replace the "When a third essay arrives…" note with this.
- **Captions:** recordings are dated and say what they show. Never caption a later recording as an earlier moment.
