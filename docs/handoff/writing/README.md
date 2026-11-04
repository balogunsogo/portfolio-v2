# Writing: the blog and its first essay

**Status:** 4 November 2026. Ready to build.

**What this adds:**
- a **Writing** link on the home page, beside Work and About;
- a Writing index at `/writing`;
- the first essay, **The Space Between Design and Engineering**, at `/writing/space-between-design-and-engineering`, with three demos.

**The design:**
- On the design canvas "iudoh.me Layout Variations", page **Writing**. It has the home entry, the index, the essay (opening, demos, closing) at desktop and mobile, and every state of the form demo.
- The home, index and essay boards are clickable with Play. The form demo, the motion switch and the notes tabs all work there.

**References in this folder:**
- `reference/*.html` are static renders of those boards, in their default state, with the real fonts and media from `src/assets`. Open them straight from the repo.
- `reference/*.webp` are screenshots of those pages at 1x with reduced motion and the clock frozen at 11:05:
  - `home-desktop` and `index-desktop` at 1440 × 900;
  - `home-mobile` and `index-mobile` at 390 × 844;
  - `article-desktop-1…4` (1440 wide, top to bottom, 9,567px in all) and `article-mobile-1…4` (390 wide, 8,930px in all);
  - `form-states` (1440 × 1200).
- **The reference wins on appearance at 1440 and 390. This README wins on behaviour.**
- **The article references were regenerated on 4 November 2026.** The first set dropped the components' minimum heights: the 312px card, the 44px message area and the 44px mobile control rows. They also showed an old controls label for Demo 03 on mobile. Both are fixed.

**Media:** already in the repo (see §10). Don't regenerate, recompress or re-cut it.

**Essay copy:** final. The source of truth is the text in `reference/article-desktop.html`. All visible copy, including the demos and notes in §7–§9, uses typographic apostrophes (’).
- It's the approved draft with typographic apostrophes.
- The three demo introductions are the draft's own sentences.
- Don't edit, add to or reorder the copy.

---

## 1. Routes and files

| URL | Source file |
|---|---|
| `/writing` | `src/writing/index.html` |
| `/writing/space-between-design-and-engineering` | `src/writing/space-between-design-and-engineering.html` |

**Why the index is `writing/index.html` and not `writing.html`:**
- The dev server already resolves a directory to its `index.html`.
- Vercel (`cleanUrls`, `trailingSlash: false`) serves `writing/index.html` at `/writing`.
- A `writing.html` next to a `writing/` folder would be ambiguous.

**Both pages:**
- use root-absolute URLs (`/assets/...`), like the case studies;
- load `/assets/css/main.css` and `/assets/js/main.js`;
- get the Google tag from `copyPages()` like every other page.

**New files:**
- `src/writing/index.html` and `src/writing/space-between-design-and-engineering.html`.
- `src/ts/posts.ts`: the typed post registry (§2).
- `scripts/posts.mjs`: renders the index list at build time, the same way `projects.mjs` renders the work list.
- `src/scss/_writing.scss`: reusable editorial styles (article header, rail, prose, metadata, media plate, controls, captions, notes, the index list, the footer label).
- `src/ts/writing/media-switch.ts`: reusable. A video with versions, play/pause and replay (Demo 02).
- `src/ts/writing/annotated-media.ts`: reusable. A figure followed by tabbed notes (Demo 03).
- `src/scss/posts/_space-between.scss` and `src/ts/posts/space-between/form-demo.ts`: Demo 01 only.

**Changed files:**
- `src/index.html`: the Writing link (§3).
- `src/scss/_index.scss`: only if the link needs a selector (§3).
- `src/ts/about.ts`: the `/#about` deep link (§3).
- `src/ts/main.ts`: wires the two reusable components when they're on the page.
- `src/scss/main.scss`: `@use` the new partials.
- `scripts/shared.mjs`: the post-list injection (§2).
- `CLAUDE.md`: see §13.

**Keep reusable and article-specific code apart:**
- Anything a future post could reuse goes in `_writing.scss` and `src/ts/writing/`.
- Anything only this essay needs goes under `posts/space-between/`.
- The form-demo module loads only on this essay, through its own `<script type="module">`.

---

## 2. Content model

The posts follow the projects pattern: typed data in `src/ts`, plus hand-authored HTML for each page.

**`src/ts/posts.ts`:**

```ts
export interface Post {
  slug: string;            // the URL segment under /writing/
  title: string;
  description: string;     // the subtitle; also the meta description
  published: string;       // ISO date, e.g. '2026-11-04'
  readingMinutes: number;  // whole minutes at ~200 words a minute
  hidden?: boolean;        // keeps a draft out of the index
}

export const posts: readonly Post[] = [
  {
    slug: 'space-between-design-and-engineering',
    title: 'The Space Between Design and Engineering',
    description: 'Some thoughts on how learning to build software changed the way I think about design.',
    published: '2026-11-04',
    readingMinutes: 6, // 1,173 words of body copy
  },
];

export const shownPosts = posts
  .filter((post) => !post.hidden)
  .sort((a, b) => b.published.localeCompare(a.published));

export function formatPostDate(iso: string): string; // '4 November 2026' (en-GB, UTC)
```

**Build:**
- `scripts/posts.mjs` exports `postListMarkup(file)`. It transpiles and evaluates `posts.ts` exactly as `projects.mjs` does, and returns the `<li>` items described in §4.
- `copyPages()` replaces `<ol class="posts" data-post-list></ol>` with `<ol class="posts" data-post-list data-posts-rendered>…</ol>`, the same way it handles the work list.
- No client-side rendering is needed. The list is static.

**Not in this pass:**
- **An RSS feed** (`/writing/feed.xml`, built from `posts.ts`). It's a small addition but hasn't been approved yet, so leave it out.
- **The sitemap.** The site doesn't have one, so don't add one.

---

## 3. Home: Writing beside Work and About

**Boards:** "Home · Writing beside Work and About". **References:** `home-desktop.webp`, `home-mobile.webp`.

**The link:**
- Add `<a class="index__switch-word index__switch-word--link" href="/writing">Writing</a>` after the About button in `.index__switch` (`[data-about-switch]`).
- That's the only place. Today there's one switch row on every screen size, and it stays put while the About opens. The About doesn't bring a row of its own.
- Give the link no `data-about-show`, so `initAbout()` never picks it up as a switch.

**How it looks:**
- It uses the switch words' existing type, muted colour, hover-to-ink, focus outline and the `::after` 44px hit area below desktop.
- It's a link, not a toggle: no `aria-pressed`, and it's never "lit" on the home page.
- Make sure `a.index__switch-word` has no underline and inherits the muted colour. Add only the selectors that needs.

**What doesn't move:**
- The switch row keeps its `$gutter` / 16px spacing.
- Nothing else on the home page moves. A pixel comparison with today's site should differ only inside the switch row's box, closed and open.

**Deep link to the About:**
- `/#about` opens the home page with the About showing, as if "About" had been pressed (source "switch").
- In `initAbout()`, check `location.hash === '#about'` once on load and open it with the existing open path. Reduced motion makes that instant, as it already does.
- "Work" still closes it.
- Don't add a scroll jump. Remove the hash with `history.replaceState` once it's open, so a reload starts fresh.

---

## 4. The Writing index (`/writing`)

**Boards:** "Writing index, desktop / mobile". **References:** `index-desktop.webp`, `index-mobile.webp`.

The index is the home page's composition with "Writing" in place of the name. It has these parts, top to bottom.

**1. Top bar:** the case-study top bar (`.case-top` with `data-case-top`).
- "Balogun Oluwasogo" on the left, linking to `/`.
- Nothing on the right.

**2. Display:** `<h1>Writing</h1>`.
- Use the home name's sizes: `clamp(3.5rem, 16.4vw, 7rem)` below desktop and `clamp(6rem, 9.45vw, 11.5rem)` from 1024, at 500, with the name's line height and tracking.
- W optical edge: `-$lsb-w-medium`.
- **Gap from the top bar:** 104px at 1440, 56px at 390.

**3. Line under it:** "Essays on design and engineering."
- Use the home role line's style: `clamp(1.5rem, 1rem + 2.28vw, 3.5rem)`, 500, ink.
- **Gap:** 20px desktop, 14px mobile.

**4. Bottom block:** sits at the bottom of the viewport (`margin-top: auto`) when the page is short, and flows normally when it's long.
- **Switch row:**
  - "Work" links to `/` and "About" links to `/#about`.
  - "Writing" is the current page: `<h2 aria-current="page">` in ink.
  - It uses the same type and spacing as the home switch row.
- **Post list:** `<ol class="posts" data-post-list>`, columns 1–6 on desktop. Each item has three lines:
  - **Title:** a link to `/writing/<slug>`, 30px / 28px, 500, `-0.02em`, balanced wrap. T optical edge: `-$lsb-t`. It turns muted on hover, like the work links.
  - **Description:** 20px / 16px, muted, max 30em.
  - **Meta:** `<time datetime="2026-11-04">4 November 2026</time> · 6 min read`, 16px / 15px, muted.
  - Spacing: 8px between the lines, 32px between posts (28px on mobile), 9px above the first post.
- **Aside:** the clock and the four links, exactly as on the home page. Columns 9–12 on desktop, level with the list's last line. On mobile it's the home page's two-column row, 40px below the list.

**Padding:** the home page's (48/64/56 on desktop, 28/20/32 on mobile). No preview, no description column and no sheet.

---

## 5. The essay page

**Boards:** "Essay · Opening / Ace Trail and JobTrackr demos / Closing", desktop and mobile. **References:** `article-desktop-1…4.webp`, `article-mobile-1…4.webp`, `article-*.html`.

### Shell

- **Top bar:** `.case-top` with `data-case-top`, so `top.ts` hides it on the way down and brings it back on the way up.
  - "Balogun Oluwasogo" on the left, linking to `/`.
  - "Writing" on the right, linking to `/writing`.
  - There's no TL;DR switch on posts.
- **Page padding:** the case pages' (`$case-pad-*`).
- **Markup:** use `<article>` for the post and `<header>` for its head. Each section is a `<section aria-labelledby>`.

### Header

- **Title:** `<h1>`, 500, line height 0.92 (0.95 on mobile), `-0.04em`, balanced wrap.
  - Size: `clamp(2.5rem, 1.2rem + calc(16vw / 3), 6rem)`, which is exactly 40px at 390 and 96px at 1440.
  - Max width: columns 1–10 (1,089px at 1440).
  - T optical edge: `-$lsb-t`.
- **Subtitle:** `<p>`, muted, 400. 32px with line height 1.25 from 1024 (max columns 1–8); 20px with line height 1.3 below. No italics.
- **Spacing:** 104px (56px on mobile) from the top bar to the title, and 28px (16px on mobile) from the title to the subtitle.
- **Metadata:** a `<dl>` with "Published" → `<time datetime="2026-11-04">4 November 2026</time>` and "Reading time" → "6 minutes". Labels are muted and values ink, 16px (15px on mobile).
  - **Desktop:** it sits in the rail (columns 1–3) beside the first paragraph of the introduction.
  - **Mobile:** two columns under the subtitle, 16px below it.

### Body grid (from 1024)

- **Rail:** each section's `<h2>` sits in columns 1–3, level with its first paragraph.
  - 30px, 500, line height 1.2, `-0.02em`, balanced wrap.
  - Optical edges: "Getting…" `-$lsb-round-medium`; "The things…" `-$lsb-t`; "A gradual…" none; "Somewhere…" and "Still learning" `-$lsb-s-medium`.
- **Prose:** starts at column 5, max width `$measure` (36rem).
  - 20px, line height 1.55, `-0.008em`, `text-wrap: pretty`.
  - 20px between paragraphs.
- **Section spacing:** 120px between sections. 120px from the header block to the introduction.
- **Optional:** the rail heading may be `position: sticky` within its own text block (top: the top bar's height plus 24px). Its containing block ends where a demo begins, so it never overlaps a demo. Skip this if it causes any jump.

### Below 1024

- One column. Text is capped at `$measure` on tablets, as the case studies do.
- `<h2>`: 26px, line height 1.15, 16px above the prose.
- Prose: 17px, line height 1.55, `-0.005em`, 16px between paragraphs.
- 80px between sections. 48px from the header to the introduction.

### Demo placement

Each demo is a full-width `<figure>`, columns 1–12, directly after its introduction paragraph.
- 72px above it on desktop, 32px on mobile.
- Prose that continues after a demo sits 72px (32px) below it.
- Captions sit under their plate, aligned with the prose column (column 5, max `$measure`), 16px / 15px, muted, 16px (12px) below the plate.

### Footer

The case-study footer (`.case-foot`):
- **Left:** the label "Back to" (muted), then the `case-display` link "Writing" to `/writing`, with the W optical edge.
- **Right:** the clock and the four links, as on the case studies.
- 160px from the last paragraph on desktop, 104px on mobile.
- When there's more than one post, this becomes "Next essay" and the next title. Not now.

### Metadata

- `<title>The Space Between Design and Engineering — Balogun Oluwasogo</title>`
- **Meta description:** the subtitle.
- **Canonical:** `https://www.balogunoluwasogo.com/writing/space-between-design-and-engineering`.
- **Open Graph:** `og:type` article, plus title, description and url.
- **Share image:**
  - `og:image` → `https://www.balogunoluwasogo.com/assets/images/writing/space-between-og.jpg` (1200 × 630), with width and height;
  - `og:image:alt` "The Space Between Design and Engineering, by Balogun Oluwasogo".
- **Article tags:** `article:published_time` 2026-11-04 and `article:author` Balogun Oluwasogo.
- **Twitter:** `summary_large_image` with the same image.
- **Structured data:** a JSON-LD `BlogPosting` with:
  - `headline` and `description`;
  - `datePublished` and `dateModified` (both 2026-11-04);
  - `author` (`Person`, name, url `https://www.balogunoluwasogo.com/`);
  - `image`, `mainEntityOfPage` (the canonical URL) and `inLanguage` "en".
- **Index page:**
  - `<title>Writing — Balogun Oluwasogo</title>`;
  - description "Essays on design and engineering by Balogun Oluwasogo.";
  - canonical `/writing`, `og:type` website, the site's existing share image;
  - a JSON-LD `Blog` with one `blogPosting` entry.

---

## 6. Shared media plate and controls

All three demos sit on `$plate-clip` (#ECEBE6). There are no borders, rules, shadows or rounded corners.

- **Video plates:**
  - Padding 48px 64px 28px from 1024, 12px 12px 4px below.
  - The frame is 16:10, black behind the video, `object-fit: cover`.
- **Controls row:** under the frame, 20px gap on desktop, 44px tall on mobile.
  - Controls are text words in the switch style: muted, ink when on or on hover, 16px / 15px.
  - The action word ("Play"/"Pause") is always ink.
  - Hit areas extend with `::after` to at least 44px on touch.
- **Videos:**
  - `<video muted playsinline preload="none" poster="…">` with no `autoplay` and no `loop`.
  - **Nothing ever starts on its own.** These figures do not use `media.ts`'s in-view autoplay.
  - "Play" plays and becomes "Pause". When playback ends, or the reader has played it once, "Replay" appears to its left and restarts from 0. A video the reader paused stays paused.
- **Focus:** the site's 2px `currentColor` outline with a 3px offset on every control.

---

## 7. Demo 01: One form, different realities

**Board:** "Essay · Opening" (playable) and "Demo 01 · every state". **Reference:** `form-states.webp`.

This is a local simulation only. **It must not send anything anywhere.**
- No `fetch`, no form `action` and no `name` on the input.
- No analytics events carrying the value.
- Nothing is written to storage.

### Layout

**Desktop plate:**
- Height 600, padding 32px 40px, three rows.
- **Top row:** the name "One form, different realities" (500) on the left. On the right, the conditions: a muted "Network" label, then "Normal", "Slow" and "Server error".
- **Middle:** the card, centred.
- **Bottom row:** on the left, 14px muted: "A demo running in your browser. Nothing you type is sent or stored." On the right, a muted "Reset" button.

**Mobile plate:** padding 20px. The name is above the conditions, and the bottom row text is 13px.

**The card:**
- Background `$color-ground`. 480px wide with 40px padding on desktop; full width with 24px padding on mobile. 24px gaps (20px on mobile). Minimum height 312px on desktop, so states don't jump.
- **Heading:** "Join the waitlist", 28px / 24px, 500.
- **Text:** "Leave your email and we’ll let you know when it opens.", 16px / 15px, muted.
- **Field:**
  - A label "Email address" (15px), then the input and the button.
  - Desktop: they sit in one row with a 12px gap. Mobile: they stack, and the button is full width.
  - **Input:** 48px tall, no box. The only line is a 1px `$color-muted` bottom border, which becomes 2px ink on focus and when invalid. 18px text (16px on mobile, so iOS doesn't zoom). Placeholder `name@example.com` in `$color-muted`.
  - **This underline is a deliberate exception to "no borders"** (like the clock ring): a field needs a visible edge. Record it in CLAUDE.md.
- **Button:** "Join", 48px tall, 0 22px padding, ink background, ground text, 500, square corners. While pending it reads "Joining…" on `$color-muted` with `cursor: progress`, and carries `aria-disabled="true"`, not `disabled`, so it keeps focus. The pending state already ignores repeat submits.
- **Message area:** minimum height 44px, 15px, line height 1.45. It holds the messages and the text buttons ("Try again" and "Start over", 500, ink).

### Behaviour

| Event | What happens |
|---|---|
| Submit, invalid email | The trimmed value must match `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`, so `ada@example` is invalid (the browser's own email check would accept it). No delay. `aria-invalid="true"`, ink underline, message "Enter an email address, like name@example.com.", focus returns to the input. The message clears as soon as the value becomes valid. |
| Submit, valid, Normal | Pending (button `aria-disabled`, "Joining…", `aria-busy`), then success after **0.7s**. |
| Submit, valid, Slow | Pending. At **1.5s** a muted line appears: "Still working. This is taking longer than usual." Success at **3.5s**. |
| Submit, valid, Server error | Pending, then at **1.2s**: "Something went wrong on our side, so you haven’t joined yet. Your email is still here." plus a "Try again" button. The typed value stays in the field. |
| Try again (after the error) | Focus moves to the Join button before the message clears. Pending, then success after **0.9s**. The first attempt in this scenario fails and the retry goes through. |
| Success | The card shows "You’re on the list." and "We’ll email {value} when it opens." ({value} is the trimmed value) with "Start over". Focus moves to the heading (`tabindex="-1"`). |
| Start over / Reset | Clears every timer, the value and the state. Focus goes to the input. Reset works from any state. |
| Change conditions | Allowed except while pending (the radios are disabled then). From error or success it returns to the form with the value kept. The retry counter resets. |
| Submit while pending | Ignored. That covers double-clicks and repeated Enter. |

### Accessibility and fallback

- **Conditions:** native radios in a `<fieldset>` with a visually hidden `<legend>` "Network conditions". The labels are styled as the switch words. Arrow keys work natively.
- **Form:** `<form novalidate>`, with `<label for>`. The input is `type="email" inputmode="email" autocomplete="email"`.
- **Announcements:** messages go in a polite live region tied to the input with `aria-describedby`. Success moves focus as described above.
- **Reduced motion:** there's nothing to animate. State changes are instant either way, and there's no spinner.
- **Without JavaScript:**
  - the card renders with the input, button and radios `disabled`;
  - the footnote reads "This demo needs JavaScript. Nothing you type is sent or stored.";
  - the script enables the controls and swaps the footnote back.
- **Cleanup:** clear the timers on reset and on `pagehide`.

---

## 8. Demo 02: Ace Trail, with and without the full animation

**Component:** `media-switch.ts` (reusable) with `data-media-switch` hooks.

- **Versions:** "Full motion" and "Reduced motion", as `aria-pressed` buttons in a group labelled "Animation". Each version has its own `src`, poster and caption.
  - Full: `/assets/video/writing/ace-trail-normal.mp4`, poster `/assets/images/writing/ace-trail-normal-poster.webp`.
  - Reduced: `/assets/video/writing/ace-trail-reduced.mp4`, poster `/assets/images/writing/ace-trail-reduced-poster.webp`.
- **Default:** "Full motion", unless the reader prefers reduced motion, in which case it's "Reduced motion".
- **Switching:**
  - Swap the `src` and poster. Changing `src` already resets the position to 0.
  - Don't call `load()`: in Chromium it starts a download even with `preload="none"`. Nothing may download before a control is pressed.
  - If the video is playing when the reader switches, play the new version from the start. If it's paused, stay paused on the new poster.
  - The caption's first sentence changes with the version.
- **Captions** (the version sentence, then the fixed sentence):
  - Full: "With full motion, the hero rises into place as the page loads, and the photo grows to fill the window as you scroll. Both recordings use the same 1440 × 900 window and the same scroll."
  - Reduced: "With reduced motion, the hero appears in place, and the photo jumps to full size halfway through the scroll instead of growing. Both recordings use the same 1440 × 900 window and the same scroll."
- **Video `aria-label`:**
  - Full: "The Ace Trail Tutors hero with full motion: the headline and photo rise into place, then the photo grows to fill the window as the page scrolls."
  - Reduced: "The Ace Trail Tutors hero with reduced motion: nothing rises in, and the photo jumps to full size halfway through the scroll."
- **Without JavaScript:** both videos render one after the other, each with `controls` and its own caption. The script hides the second and builds the switch.

---

## 9. Demo 03: JobTrackr, behind the interface

**Component:** `annotated-media.ts` (reusable) with `data-annotated-media` hooks. It uses the plate and controls from §6.

### Video

- `/assets/video/writing/jobtrackr-workflow.mp4` (17.9s), poster `/assets/images/writing/jobtrackr-workflow-poster.webp`.
- **Controls row:** "Adding an application, then moving it from Saved to Applied" (muted) on the left; "Replay" and "Play" on the right. On mobile, drop the label.
- **`aria-label`:** "JobTrackr, signed in as a sample account: a new application for Product Designer at Northwind is added as Saved, opened, and moved to Applied, which adds ‘Application submitted’ to its activity."
- **Caption:** "Recorded from JobTrackr running locally, with a sample account and sample data. The video shows the interface. The notes describe the code behind it."
- **The video stays where it is and keeps playing while the notes change.**

### Notes

Notes appear under the caption, 56px below on desktop and 28px on mobile.
- **Desktop:** the tab list sits in columns 1–4 as stacked words in the home work-list style (30px, 500, line height 1.4, 9px vertical padding; muted, ink when selected or on hover). The panel sits from column 5, max `$measure`, in prose style.
- **Optical edges:** I and D use `-$lsb-stem-medium`; "API & authentication" gets none.
- **Mobile:** 24px tabs, stacked, at least 44px tall, with the panel below in 17px prose.

**The notes' copy (final; checked against the JobTrackr code on 3 November 2026):**

**Interface**
> Adding an application opens a drawer. The form checks what you’ve entered when you save, and the server checks it again. A new record gets a confirmation with a link to open it, and moving it from Saved to Applied adds the submission to its activity.
>
> If the server doesn’t answer, the form says the save couldn’t be confirmed and keeps what you typed, so you can check before adding it a second time.

**API & authentication**
> Saving runs a server action in the Next.js app. It reads the signed-in session on the server and calls the NestJS API with the access token in an Authorization header.
>
> Every API route that isn’t marked public sits behind a guard. It checks the token’s signature against Supabase’s published keys, along with its issuer and audience, before any handler runs. Without a valid token, the API answers 401 and the app asks you to sign in again.

**Data permissions**
> The API takes your user ID from the verified token, never from the request body. Every application query is filtered by it, so asking for someone else’s record finds nothing and returns a 404.
>
> In the database, row-level security policies tie each table to its owner. They’re a second layer for anything that reaches the database with a user’s token, and client roles can’t write the fields that record where an application came from.

**Where each claim comes from (JobTrackr repo):**
- **Interface:**
  - `features/applications/components/application-form.tsx` (`validateApplicationForm` on submit) and `app/(app)/applications/actions.ts` (validated again in `createApplicationAction`);
  - `features/applications/creation.ts` (`unconfirmedSaveMessage`) and `application-creation.tsx` ("View application");
  - `apps/api/src/applications/applications.repository.ts` (`updateStatus` writes `application_submitted` when leaving Saved).
- **API & authentication:**
  - `lib/auth/server.ts` (`getClaims`, `getSession`) and `lib/api/client.ts` (Bearer header);
  - `apps/api/src/auth/auth.module.ts` (global `APP_GUARD`), `guards/supabase-auth.guard.ts` and `services/supabase-jwt.service.ts` (JWKS, issuer, audience);
  - `actions.ts` `failure()` (401 → "Your session expired. Sign in again.").
- **Data permissions:**
  - `applications.repository.ts` (`userId: this.currentUser.id` on insert; `eq(applications.userId, this.currentUser.id)` on every read and write) and `applications.service.ts` (`NotFoundException`);
  - `apps/api/drizzle/0001_*.sql` (RLS policies, `auth.uid()`) and `0009_application_provenance_permissions.sql` (client roles can't write `external_provider` / `external_job_id`).
- **The API connects as the table owner,** so RLS isn't what guards the API's own queries. The copy deliberately says RLS is the second layer "for anything that reaches the database with a user's token". Keep that wording.

### Pattern and fallback

- **Pattern:** ARIA tabs.
  - `role="tablist"` labelled "Behind the interface".
  - Tabs carry `aria-selected` and `aria-controls`, with a roving `tabindex`.
  - Left/Right and Up/Down move between tabs, and Home/End jump to the ends. Selection follows focus.
  - Panels are `role="tabpanel"`, labelled by their tab; inactive panels are `hidden`.
- **Without JavaScript:** the three notes render as stacked sections, each under its own `<h3>` title in the tab style. The script converts them to tabs.

---

## 10. Media

**Everything below is real, already in the repo, and final.** Don't re-encode it.

| File | What it is | Size |
|---|---|---|
| `src/assets/video/writing/ace-trail-normal.mp4` | Ace Trail hero, full motion. 7.0s, 1440 × 900, 30fps, H.264, no audio | 570 KB |
| `src/assets/video/writing/ace-trail-reduced.mp4` | The same hero and scroll with `prefers-reduced-motion: reduce`. 7.0s, same settings | 144 KB |
| `src/assets/video/writing/jobtrackr-workflow.mp4` | JobTrackr: add an application as Saved, open it, move it to Applied. 17.9s, 1440 × 900, 30fps | 429 KB |
| `src/assets/images/writing/ace-trail-normal-poster.webp` | First settled frame of the full-motion take (1.0s) | 38 KB |
| `src/assets/images/writing/ace-trail-reduced-poster.webp` | First frame of the reduced take | 38 KB |
| `src/assets/images/writing/jobtrackr-workflow-poster.webp` | The Applications page at the start of the take | 41 KB |
| `src/assets/images/writing/space-between-og.jpg` | Share image: the title in Neue Montreal on the ground colour, 1200 × 630 | 54 KB |

**Content Credentials:** every file above, and the reference screenshots, carries an embedded C2PA manifest, added when Claude delivered it to this repo. It says Claude provided the file and may have created or modified it. It adds about 6 KB and changes no frame or pixel. Leave it in place.

### How they were made

All three recordings were made frame by frame with Playwright at 1440 × 900 and 1x, on a paused, stepped browser clock. That way the motion shows the real code's timing, not the recording machine's frame drops.

**Ace Trail:**
- The site was served locally from the repo's `main` branch. Its `js/redesign.js` is byte-identical to acetrailtutors.com's after line-ending normalisation (checked 3 November 2026).
- Both takes used the same scripted input: 1.0s idle, then 860px of wheel input over 3.6s (runway 740px + 120px), then a 2.4s hold.
- Full motion included Lenis and GSAP, loaded as they would be after a visitor's first scroll.
- Reduced motion used the site's own reduced-motion paths: no intro animation, native scrolling, and the photo snapping at 50% of the runway.

**JobTrackr:**
- **Stack:** a production build of the real web app (the `feature/homepage` working tree), with the real NestJS API built from source and the real Drizzle migrations 0000–0009 applied to a throwaway local Postgres.
- **Account:** a local signing key stood in for Supabase Auth, through a local JWKS that the web app and the API both verified against. The session is a sample account, "Alex Sample" / alex@example.com.
- **Data:** sample records for fictional companies (Meridian, Parcelwise, Halden Labs, Lumen Health, Oakline, and Northwind, which was added on camera).
- **Discover:** its tab is visible, as in production. It wasn't used, because searching needs the live job provider.
- **Nothing private:** no production data, credentials or tokens are involved or shown.
- **Cursor:** a drawn pointer, because headless screenshots have none.

**Reference-only change:** one homepage stylesheet selector, `:global(html:has(.hpRoot))` → `:global(html):has(.hpRoot)`, was rewritten in the throwaway copy only, so webpack's CSS modules would accept it. It doesn't touch any screen in the recording.

---

## 11. Accessibility, motion and performance

- **Semantics:**
  - one `<h1>` per page and `<h2>` for each section;
  - each demo is a `<figure>` with a `<figcaption>` (Demo 01's footnote is its caption);
  - `<time datetime>` for dates.
- **Keyboard:**
  - Tab order is top bar → content → demo controls in visual order → footer.
  - Every control has a visible focus outline.
  - Touch targets are at least 44px below desktop.
- **Motion:**
  - The pages add no scroll-driven or entrance motion.
  - `prefers-reduced-motion` removes the colour transitions, as the global rule already does.
  - No video ever autoplays.
- **Performance:**
  - Videos use `preload="none"`, so only their posters load up front. Every demo is below the fold, so any `<img>` on these pages gets `loading="lazy"`.
  - No new dependencies.
  - The form demo's script loads only on this essay.
- **Layout:**
  - No horizontal scroll from 320 to 2560px.
  - Never size anything with `100vw`.
  - Plates never exceed the content width.
- **Without JavaScript:** the essay reads completely, and the demos fall back as described in §7–§9.

---

## 12. Acceptance checks

1. `npm run typecheck` and `npm run build` pass.
2. **Pixel comparison** with reduced motion and the clock frozen at 11:05:
   - `/writing` at 1440 × 900 and 390 × 844 against `index-*.webp`;
   - the essay at 1440 and 390, full height, against `article-*.webp`. Capture past 16,384px in parts from a fresh load, as CLAUDE.md describes.
   - **Allowed differences:**
     - the real `<video>` posters where the static reference shows the same frames;
     - Demo 01's placeholder colour (`$color-muted` instead of the board's lighter grey);
     - Demo 02 under reduced motion: it defaults to "Reduced motion" (its poster, pressed word and caption), where the static reference shows the "Full motion" default;
     - the clock readout's figures (the site's clock is reused as it is);
     - sub-pixel text wrap.
3. **Home:** against today's site at 1440 × 900 and 390 × 844, closed and open, only the switch row's box differs. `/#about` opens the About, and the hash is cleared.
4. **Case studies:** all five are unchanged (re-run their diffs; `_case.scss` must not change).
5. **Demo 01:**
   - Every row of §7's table works with mouse, touch (390 × 844) and keyboard.
   - **The network log shows zero requests** while using it.
   - The value survives an error and its retry.
   - Double submits are ignored.
6. **Demo 02:**
   - Switching versions restarts the video.
   - The default follows the reduced-motion preference.
   - Captions change with the version.
   - Nothing autoplays, with or without reduced motion.
7. **Demo 03:**
   - Arrow, Home and End keys work on the tabs.
   - The video keeps playing while tabs change.
   - Panels are labelled.
8. **No JavaScript** (disable it): the essay is fully readable; Demo 01 is disabled with the note; Demo 02 shows both videos with controls; Demo 03 shows all three notes.
9. **Overflow sweep** 320 → 2560 with classic scrollbars on `/writing`, the essay and the home page.
10. **Metadata:** the JSON-LD parses, and the canonical, OG and Twitter tags are present on both pages. The share image loads.
11. **Media:** the dev server answers `Range` requests for the three videos. Posters show before play.

---

## 13. Docs

Update CLAUDE.md:
- **"What this is":** add the Writing index and posts.
- **New section, "Writing (`/writing`, `/writing/<slug>`)":** the content model (`posts.ts` and the build injection), the page structure, the reusable components and where article-specific code goes, the demo behaviour summary, and the media rule (posts' media are final, like the case studies').
- **Design rules:** add the form-field underline in Demo 01 as the third deliberate exception, beside the clock ring and the diagram connectors.
- **Case-study linking:** unchanged.
