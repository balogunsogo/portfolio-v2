# Now Playing case study: implementation handoff

Build the Now Playing case study as the site's fourth case study, pixel-perfect to the approved design, and link it into the site.

- **URL:** `/work/now-playing`
- **Pixel targets:** `reference/desktop.html` at **1440 × 900** and `reference/mobile.html` at **390 × 844**.
- **Starting point:** JobTrackr, Acetrail and Artifacts are built and live (`src/work/*.html`, `src/scss/_case.scss`, `src/ts/media.ts`). This page is built **only from components those pages already have**: the shell, type, grid, text blocks, plates, video behaviour, photo pairs, side figures, the phone pair, the definition list, the Before / After lists, scores, process, stack, outcome and footer. There are no new components, tokens or section-gap entries.
- **Stack and rules:** unchanged (`CLAUDE.md`). Plain HTML, SCSS and TypeScript; no new dependencies, no new fonts.

---

## 1. Sources of truth

| Priority | File | What it settles |
|---|---|---|
| 1 | `reference/desktop.html`, `reference/mobile.html` | Exact appearance at 1440 and 390: sizes, gaps, grid spans, colours, ratios, line breaks and the final copy. Open them in a browser; they load fonts and media from `src/assets`. Their inline styles are a reference only: build with classes. |
| 2 | `reference/desktop-1..3.webp`, `reference/mobile-1..3.webp` | Full-page screenshots of the two references, with reduced motion (videos show their posters). |
| 3 | This README | Reuse map, behaviour between and beyond the two widths, media, linking, `<head>` and acceptance checks. |
| 4 | `CLAUDE.md`, the other three handoffs, and the built pages | Every shared rule this README doesn't repeat (fluid type, optical alignment, video markup, images, footer, the screenshot-diff method). |

If the reference and this README disagree: the reference wins on **appearance at 1440 and 390**; this README wins on **behaviour**.

On the design canvas the page is three artboards per layout only because of the canvas's size limit. The real page is **one continuous page**, as the reference pages show it.

---

## 2. Files

**Create**

- `src/work/now-playing.html`. Copy the shell of `artifacts.html`: the `<head>` pattern (§9), the `.case` wrapper, the `.case-top` bar, `<main class="case__main">`, and the `.case-foot` footer with the clock and links.

**Already in place** (final; don't regenerate, recompress or re-cut):

- `src/assets/images/case/now-playing/*.webp` and `og.jpg`
- `src/assets/video/now-playing/*.mp4`
- `docs/handoff/now-playing/**`

**Modify**

- **Linking** (§8): `src/ts/projects.ts` and `src/work/artifacts.html` (footer link only).
- `docs/handoff/artifacts/README.md` is already updated for the new footer link; nothing else in the Artifacts handoff changes, and its reference pages stay as they are (the link text is the same).
- `README.md` and `CLAUDE.md`: document the fourth case study and the finished chain (CLAUDE.md "Case studies" covers all four pages; add a short "Now Playing only" list).

**Not expected to change:** `src/scss/_case.scss` and `src/ts/*`. If you find you need a SCSS change, keep it scoped and re-run all four pixel diffs.

**Out of scope:** the home page layout and styles, the other three case studies apart from Artifacts' footer link, and the Now Playing site itself.

---

## 3. Optical modifiers

The same rule as the other pages: every line in the display, subtitle, heading, statement, list-item and label styles gets the modifier for its first glyph. The reference carries the exact `margin-left` on each line. All of these modifiers exist already:

- Display: "Now Playing" `.case-display--stem`; the footer's "JobTrackr" `.case-display--j`.
- Subtitle: "What I'm playing…" `.case-subtitle--w`.
- Headings: "Three questions…", "The cover leans…", "The cover follows…" `--t`; "Every cover…", "Four recent tracks…", "Doing less…", "Measured on…", "Built in passes…", "No framework…" `--stem`; "Smaller screens…" `--s`. "A page about one thing…", "A new track waits…" and the Outcome statement "A small page…" start on A and get none.
- List items (§5.3): "What's playing" `.case-item--w`; "Playback state", "Last played", "Nothing yet" `.case-item--stem`.
- Labels: "Context", "On a phone", "Outcome" `--round`; "Live data", "Previously", "Engineering", "Performance", "Process", "Before", "Next project", and the stack groups "Front end", "Motion", "Data", "Media", "Hosting" `--stem`; "Track changes", "The scene", "The artwork", "Touch" `--t`; "Stack", "Server", "SEO" `--s`. "After", "Analytics" and "Accessibility" get none.

---

## 4. Shell and section rhythm

Identical to the other three pages: page padding, the 104px / 160px section gap, the top bar, the 12-column grid, `.case-text` for label, heading and body. Captions sit 12px under their media at both widths (`.case-figure--snug`, or the 12px gap the comparison items already have).

**Gap between a section's blocks**, all existing entries of `$case-section-gaps`:

| Section | Mobile | Desktop | Modifier |
|---|---|---|---|
| Context, Track changes, The scene, The artwork, Previously, On a phone | 36px | 64px | none (default) |
| Live data | 40px | 80px | `case-section--rules` (Artifacts' Rules gap) |
| Touch | 40px | 64px | `case-section--phone` |
| Engineering | 40px | 80px | `case-section--engineering` |
| Performance | 32px | 64px | `case-section--performance` |
| Process | 40px | 80px | `case-section--process` |
| Stack | 28px | 56px | `case-section--stack` |
| Outcome | 24px | 48px | `case-section--outcome` |

**Plates:** `.case-plate` (large, 16 / 64px), `.case-plate--medium` (12 / 32px), `.case-plate--small` (10 / 24px).

---

## 5. Page structure, section by section

The copy is final: take every string **verbatim** from the reference HTML. Semantics follow the other pages: `<header>` for the top bar; `<main>` with one `<section aria-labelledby>` per block; `<footer>`; the title is the only `<h1>`, section headings are `<h2>`; each piece of media with a caption is a `<figure>` with a `<figcaption>`.

### 5.1 Hero

Same structure and classes as Artifacts' hero.

- **Copy:** title "Now Playing"; subtitle "What I'm playing on Spotify, live, on a page that takes its colours from the cover."
- **Meta:**
  - Role: "Design and / frontend development" (line break after "and" on desktop).
  - Year: 2026.
  - Stack: "HTML, CSS, JavaScript, / Spotify Web API" (line break after "JavaScript," on desktop).
  - Status: "Live". The site link `now-playing.balogunoluwasogo.com` goes to `https://now-playing.balogunoluwasogo.com/` in a new tab, with the visually hidden suffix.
- **Image: art-directed.** A `<picture>` switching at 1024px with `.case-media--hero` (4:5 below desktop, 3:2 from it):
  - **Desktop:** `hero-1200.webp` / `hero-2400.webp` (2400×1600, exactly 3:2): the page on a laptop, under someone's hands.
  - **Below desktop:** `hero-phone-1200.webp` / `hero-phone-1600.webp` (1600×2000, exactly 4:5): the page on a phone standing on a rock. Its larger file is 1600 wide (the render's full height), not 1800 like Artifacts'; use `1600w` in the `srcset` and `width="1600" height="2000"`.
  - Both files are already cropped to their ratio, so no `object-position` is needed.
  - **Alt:** one for both sources: "Now Playing showing Both Sides of a Smile on a laptop and on a phone".
  - `fetchpriority="high"` and `sizes` as on the Artifacts hero.

### 5.2 Context

`.case-text` (heading "A page about one thing: the music I work to."), then a **photo pair**: `.case-compare.case-compare--stack` holding two `figure.case-compare__item`s, each an `img.case-media.case-media--landscape` (3:2, no plate) and a caption, exactly as Artifacts' Theme pair.

- `online-1200.webp` / `online-1500.webp` (1500×1000): "Online, with a track playing."
- `offline-1200.webp` / `offline-2000.webp` (2000×1333): "Offline in the first version, with its note open."

### 5.3 Live data

`.case-text` with two paragraphs, then JobTrackr's `.case-list` (a `<dl>`, as Artifacts' Rules list): four rows, the name in the list-item style in columns 1–4, the text muted in columns 5–10. Section modifier `case-section--rules`.

### 5.4 Track changes

`.case-text`, then a full-width `.case-figure.case-figure--snug` with `track-changes.mp4` (1440×900, **16:10**) in a **large plate**, as Artifacts' archive figure. Caption (columns 1–6 on desktop): "Three track changes at 1440 × 900, recorded from the site's code with stand-in tracks. The waits between them are cut."

### 5.5 The scene

`.case-text`, then a **still pair**: `.case-compare.case-compare--stack` with two items, each a `.case-plate.case-plate--medium` holding an `img.case-media.case-media--screen` (16:10), then its caption.

- `scene-tornado-960.webp` / `scene-tornado-1440.webp` (1440×900): "Tornado."
- `scene-bang-960.webp` / `scene-bang-1440.webp` (1440×900): "Bang. Album artwork belongs to its artists and rights holders."

### 5.6 The artwork

`.case-text`, then a `.case-figure.case-figure--side.case-figure--snug` with `artwork-depth.mp4` (1440×900, **16:10**) in a **medium plate** as `.case-figure__media` (media in columns 5–12, caption in 1–4, bottom-aligned; stacked on mobile, media first). Caption: "Moving a pointer around the cover and away."

### 5.7 Previously

`.case-text`, then a `.case-figure.case-figure--side.case-figure--snug` whose `.case-figure__media` is a plain wrapper (no plate) around `img.case-media.case-media--landscape`: `previously-1200.webp` / `previously-2000.webp` (2000×1333, 3:2). Caption: "Previously on a laptop."

### 5.8 On a phone

`.case-text`, then a **photo pair** as in §5.2:

- `phone-jacket-1200.webp` / `phone-jacket-2000.webp` (2000×1333): "Gratitude by Asake, on a phone."
- `phone-shelf-1200.webp` / `phone-shelf-2000.webp` (2000×1333): "The same track, with the note open."

### 5.9 Touch

`.case-text` with two paragraphs, then Artifacts' **phone pair** (`.case-compare.case-compare--phones`, columns 5–8 and 9–12 on desktop, two columns below): each item a `.case-plate--small` with the video at **390 / 844** (`.case-video__media--phone-screen`), then its caption. Section modifier `case-section--phone`.

- `touch-artwork.mp4` (780×1688): "Dragging the cover, then opening it full screen."
- `phone-panels.mp4` (780×1688): "The note, then Previously, swiped sideways."

### 5.10 Engineering

`.case-text` with two paragraphs, then Acetrail's `.case-lists`: "Before" in columns 1–6 and "After" in columns 7–12 on desktop, stacked 40px apart on mobile. Six lines each, in the reference's order; each After line answers the Before line beside it.

### 5.11 Performance

Artifacts' Performance block: label and heading ("Measured on a mid-range phone.", `.case-h--stem`), `.case-scores`, then the caption (columns 1–6 on desktop).

- Scores: **81** Performance, **100** Accessibility, **100** Best practices, **100** SEO.
- Vitals: **2.7 s** First contentful paint, **3.7 s** Largest contentful paint, **130 ms** Total blocking time, **0.03** Cumulative layout shift.

### 5.12 Process

Reuse `.case-process` with the five steps from the reference: May, July, August, Early September, Late September.

### 5.13 Stack

Reuse `.case-stack`. Heading: "No framework, no build step." Seven groups, in the reference's order.

### 5.14 Outcome

Reuse the outcome block: statement in columns 1–10, body in columns 7–11, disciplines line in columns 1–9. In the disciplines line, the space before each middle dot is a no-break space (`&nbsp;&middot; `), so a dot never starts a line on mobile.

### 5.15 Footer

Reuse `.case-foot`. "Next project": **JobTrackr** (`.case-display--j`), linking to `/work/jobtrackr` in the same tab. Now Playing is the last project in the home list, so the chain loops back to the first case study.

---

## 6. Components

There are no new components. The reuse map:

| On this page | Built with | From |
|---|---|---|
| Hero picture | `.case-media--hero` in a `<picture>` | Artifacts |
| Photo pairs (§5.2, §5.8) | `.case-compare--stack` + `.case-media--landscape` | Artifacts |
| Still pair in plates (§5.5) | `.case-compare--stack` + `.case-plate--medium` + `.case-media--screen` | Artifacts' pairs, with plates as on its side figures |
| Chain list (§5.3) | `.case-list` | JobTrackr, Artifacts |
| Large video (§5.4) | `.case-figure--snug` + `.case-plate` | Artifacts |
| Side video (§5.6) | `.case-figure--side` + `.case-plate--medium` | Artifacts |
| Side photo (§5.7) | `.case-figure--side` + `.case-media--landscape`, no plate | Artifacts' side figure |
| Phone pair (§5.9) | `.case-compare--phones` + `.case-plate--small` | Artifacts |
| Before / After | `.case-lists` | Acetrail, Artifacts |
| Scores, process, stack, outcome, footer | as built | all |

---

## 7. Media

Give every `<img>` its `width` and `height`. Use `loading="lazy" decoding="async"` everywhere except the hero.

| Use | Files (intrinsic px) | Ratio | Alt / label (from the reference) |
|---|---|---|---|
| Hero, desktop | `hero-1200.webp`, `hero-2400.webp` (2400×1600) | 3:2 | see §5.1 |
| Hero, mobile | `hero-phone-1200.webp`, `hero-phone-1600.webp` (1600×2000) | 4:5 | see §5.1 |
| Online / offline pair | `online-1200/1500.webp` (1500×1000), `offline-1200/2000.webp` (2000×1333) | 3:2 | from the reference |
| Track changes | `video/now-playing/track-changes.mp4` (1440×900, 10.0 s), `track-changes-poster.webp` | 16:10 | from the reference |
| Scene stills | `scene-tornado-960/1440.webp`, `scene-bang-960/1440.webp` (1440×900) | 16:10 | from the reference |
| Artwork tilt | `artwork-depth.mp4` (1440×900, 10.2 s), `artwork-depth-poster.webp` | 16:10 | from the reference |
| Previously | `previously-1200/2000.webp` (2000×1333) | 3:2 | from the reference |
| Phone photos | `phone-jacket-1200/2000.webp`, `phone-shelf-1200/2000.webp` (2000×1333) | 3:2 | from the reference |
| Touch | `touch-artwork.mp4` (780×1688, 11.4 s), `touch-artwork-poster.webp` | 390/844 | from the reference |
| Note and Previously on a phone | `phone-panels.mp4` (780×1688, 11.8 s), `phone-panels-poster.webp` | 390/844 | from the reference |
| Share image | `og.jpg` (1200×630) | — | — |

- **`sizes`:** copy them from the matching Artifacts element (hero, pairs, side figures, phone pair). The scene stills are 960 and 1440 wide because they're screen captures at 1440.
- **Videos:** the standard markup and toggle, with `media.ts` unchanged. Every recording is silent. Four videos; the keyboard order runs through their toggles in page order.
- **Where the media came from:**
  - The recordings and the two scene stills are of the Now Playing site built from its repo at the live commit (`cf9fded`, 29 September 2026; the live files were checked byte for byte), served locally and captured frame by frame at 1440 × 900, and at 390 × 844 on a 2× screen for the phone recordings. The pointer and the touch circle are drawn in for the recording.
  - The live page shows whatever is playing at that moment, so the recordings answer the page's two endpoints with stand-in data in exactly the shape `lib/spotify.js` returns: eight tracks whose covers are stored in the Artifacts repo. The track-changes caption says so, and the waits between polls are cut from that recording.
  - The page's font stack starts with Inter, which it doesn't load; the recordings were made with Inter available, as on a machine that has it.
  - The laptop, tablet and phone renders are Oluwasogo's mockups, made from the live site. The offline tablet shows the first version of the page (May 2026).
  - Album artwork belongs to its artists and rights holders; the scene caption in §5.5 says so.

---

## 8. Linking the case studies

Do all of this **in the same change as the new page**, so no link points at a page that doesn't exist yet.

1. **`projects.ts`:** give Now Playing `caseStudy: '/work/now-playing'`. The home list (desktop) and the sheet's "Read case study" (mobile) then follow automatically.
2. **`artifacts.html` footer:** "Next project" stays **Now Playing** but links to `/work/now-playing` in the same tab: change the `href` and remove its `target`, `rel` and hidden suffix. The text and its `.case-display--stem` don't change, so the Artifacts reference still matches.
3. **`now-playing.html` footer:** "JobTrackr" links to `/work/jobtrackr` in the same tab (§5.15).
4. **All That Is Kim** keeps linking to its live site from the home page. The top bars keep "Balogun Oluwasogo" and "All work" linking to `/`.

The chain is JobTrackr → Acetrail → Artifacts → Now Playing → JobTrackr.

---

## 9. `<head>`

Copy `artifacts.html`'s head and change:

- **`<title>`:** `Now Playing — Balogun Oluwasogo`.
- **Description** (meta and `og:description`): "A live page of what I'm playing on Spotify, built without a framework: Spotify Web API data through a serverless function, colours from the cover, and staged track changes."
- **Canonical and `og:url`:** `https://www.balogunoluwasogo.com/work/now-playing`.
- **`og:image` and `twitter:image`:** `https://www.balogunoluwasogo.com/assets/images/case/now-playing/og.jpg` (1200×630).

---

## 10. Responsive behaviour

The rules of the other pages hold:

- **Below 1024px:** one column; text and the phone pair capped at `$measure` on tablets.
- **From 1024px:** the 12-column grid. Only the display, subtitle and heading sizes are fluid.
- **Never** size anything with `100vw`.

Specific to this page:

- **Hero picture:** switches source at 1024px, with the layout.
- **Photo and still pairs:** two columns from 1024px, one column below.
- **Phone pair:** two columns at every width; columns 5–8 and 9–12 from 1024px.
- **Height:** the desktop page is about 14,085px tall, under Chrome's 16,384px screenshot limit, so its pixel diff can be captured in one go. The mobile page is about 13,017px.

---

## 11. Acceptance checks (run all of them before handing back)

1. `npm run typecheck` and `npm run build` pass, with no console errors on any of the five pages.
2. **Pixel match** against `reference/desktop.html` at 1440×900 and `reference/mobile.html` at 390×844: full page, fonts loaded, reduced motion emulated, the largest image served to both sides, the clock pinned. Report any remaining difference and why.
3. **No horizontal scroll** at 320, 360, 390, 600, 768, 1023, 1024, 1280, 1366, 1440, 1920 and 2560, with real scrollbars.
4. **Keyboard:**
   - Tab runs through the top bar, the site link, each video toggle in page order, "JobTrackr", then the footer links.
   - Focus-visible outlines stay on.
5. **Motion:**
   - With reduced motion, nothing plays and no `.mp4` is requested.
   - Without it, a video plays only in view and pauses on leaving.
   - Every video can be paused from the keyboard.
6. **Linking:**
   - From the home list (desktop) and the sheet (mobile), JobTrackr, Acetrail, Artifacts and Now Playing open their case studies in the same tab.
   - Artifacts' footer opens `/work/now-playing` in the same tab, and Now Playing's opens `/work/jobtrackr`.
   - All That Is Kim still opens its site in a new tab from the home page.
   - `/work/now-playing` works in `npm run dev`, `npm run preview` and the built `dist/`.
7. **The other pages unchanged:** if any shared SCSS changed, re-run the JobTrackr, Acetrail and Artifacts pixel matches against their references. Otherwise confirm that `_case.scss` is untouched.
8. **Docs:** README and CLAUDE.md updated (§2).
9. Summarise the files changed and the key decisions. Don't commit or push.

---

## 12. Facts to keep as written (checked against the Now Playing repo at `cf9fded` and the live site)

- **Repo and history:** `balogunsogo/Spotify-Now-Playing`. First version 9 May 2026; analytics 15 May; a styling pass and the info button 5 July; rebuilt 30 August (colours from the cover, two background layers, staged changes, the pointer tilt, a recent list kept in the browser, the token cache, the Paused state, and polling that stops in a hidden tab); playback-state fallback 31 August; polling every 10 seconds from 1 September; the recently played endpoint, skeletons and a new 1200 × 630 share image 2 September (the May one was a 32 × 32 placeholder); `pagehide` and back-forward cache handling 2–3 September; touch tilt and the full-screen viewer 26 September; the name link moved to balogunoluwasogo.com 29 September.
- **First version:** polled every 5 seconds with `setInterval`, visible or not; redrew the clock every second; asked for a new access token on every request; asked Spotify only what was playing (if it was playing) or what was played last; swapped the cover by setting its `src`; its track key included the state and the played-at time.
- **Stack:** static HTML, CSS and JavaScript modules in `public/` with no framework and no build step (`vercel.json`: `framework: null`, output `public`); Node serverless functions in `api/`; Spotify Web API with a long-lived refresh token; Canvas for colour sampling; Google Analytics 4; Vercel.
- **Data:** `/api/spotify` asks `me/player/currently-playing`, then `me/player`, then `me/player/recently-played?limit=1`, and returns "Nothing yet" if all are empty. The access token is cached until 60 seconds before it expires, and concurrent requests share one refresh. Responses are `no-store`. `/api/spotify/recent` reads the last 20 plays, drops repeats by title and artist and returns up to 5; the page leaves out the current track and shows 4, with 4 skeleton cards while it loads.
- **States:** playing → "Online", "Currently listening to"; paused → "Paused", "Playback paused"; recent → "Offline", "Last played · N MIN ago". A failed request sets "Offline" and keeps the last track, with the status counting from the last moment a track was seen playing ("Last played · N min ago", refreshed every 30 seconds); "Spotify unavailable" and "Try again soon" only show if nothing has loaded yet.
- **Track changes:** the next cover is preloaded (8 s limit) and decoded (1.5 s limit) and its palette worked out before anything moves; the old track departs for 180 ms; the cover arrives over 820 ms; the status, artist, title and album rise over 520 ms, starting 20, 90, 150 and 220 ms in; title words take 420 ms each, 26 ms apart; the background blooms over 720 ms while playing; a generation number discards stale scenes; only a different track key starts a change; reduced motion commits at once.
- **The scene:** two layers cross-fade over 850 ms; each is the cover (at 94 % opacity) over three radial fields from the palette (accent, base and their mix) and a dark gradient, the whole layer blurred 12 px and scaled 1.12, with grain and shade on top; a 28-second drift while playing, paused and dimmed when paused or offline. Palette: a 32 × 32 canvas, every fourth pixel, pixels with alpha under 180 or luminance under 18 or over 242 skipped; the average is the base and the most vivid (saturation weighted by brightness) the accent; both clamped in brightness and spread; the last 16 cached. Double-clicking the status badge toggles the afterglow.
- **Pointer tilt:** fine pointers with hover only; up to 6.4° and a 6 px lift; eased toward the target on each animation frame; a highlight shifts with the tilt; off with reduced motion and while the tab is hidden.
- **Touch:** coarse pointers only; tilt and press on springs in the page, plus a shift toward the finger full screen; 1.75 × the desktop angle in the page and 2.6 × full screen (each scaled by a size factor, about 1.75 × and 2.7 × at 390 px); tanh resistance past 75 % of the way to the edge; a tap (under 10 px and 500 ms) opens the viewer; the real element moves into it with a FLIP animation (520 ms open, 460 ms close) and its radius, shadow and perspective compensated; the page behind is inert; Escape closes; Tab stays on Close; two-finger pinch stays with the browser.
- **Phone layout:** at 720 px and below the corners tighten and the cover is `min(78vw, 42vh, 350px)`, `min(82vw, 43vh, 330px)` at 420 px and below; smaller steps at heights of 700, 520 and 420 px (only at 720 px wide and below); `100svh` heights; the footer clears `safe-area-inset-bottom`; Previously becomes a horizontal strip of 118 px cards.
- **Performance:** PageSpeed Insights on the live page on **2 October 2026**, Lighthouse 13.5, emulated Moto G Power on slow 4G.
  - Mobile: 81 / 100 / 100 / 100; FCP 2.7 s, LCP 3.7 s, TBT 130 ms, CLS 0.03. The largest paint is the cover image: 1,220 ms of resource load delay (the page has to ask what's playing first) and 1,150 ms of render delay.
  - Desktop: 95 / 100 / 100 / 100.
- **Rules:**
  - Don't change these numbers without re-running PageSpeed, and update the date in the caption if you do.
  - Don't add claims, metrics or testimonials.
