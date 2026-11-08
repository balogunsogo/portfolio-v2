# Writing: Building Job URL Extraction into JobTrackr

**Status:** 8 November 2026. Ready to build.

**What this adds:**
- the second essay, **Building Job URL Extraction into JobTrackr**, at `/writing/building-job-url-extraction-into-jobtrackr`;
- one screen recording (Media 01), two interactive demos (Interaction 02 and Interaction 03), a release timeline and an early-numbers figure;
- a "Next essay" footer on both essays, each linking to the other.

**It builds on the Writing system that's already merged** (`docs/handoff/writing/README.md`, CLAUDE.md "Writing"):
- the post registry (`posts.ts`), the index list, the essay shell, `_writing.scss`;
- the explicit-playback video module, `annotated-media.ts`.
- Reuse them. Don't change their behaviour.

**The design:**
- On the design canvas "iudoh.me Layout Variations", page **Writing**, column "Building Job URL Extraction into JobTrackr · the essay".
- The boards:
  - `JxOpen`, `JxSources`, `JxEdits`, `JxShip` and `JxEnd`, desktop and mobile;
  - "Interaction 02 · every state" and "Interaction 03 · every state".
- Both demos are clickable on the canvas with Play.

**References in this folder (`reference/`):**
- `article-desktop.html` and `article-mobile.html`:
  - static renders of the whole essay, with the demos in their first state, the clock at 11:05 and the real fonts and poster from `src/assets`;
  - open them straight from the repo;
  - **`article-desktop.html` is the source of truth for every word of the essay.**
- `article-desktop-1…4.webp` (1440 wide, 15,309px in all) and `article-mobile-1…4.webp` (390 wide, 15,573px in all):
  - screenshots of those pages at 1x, top to bottom, with reduced motion.
- `02-*.html|webp` and `03-*.html|webp`: every state of each demo, at 1440 (`-desktop`) and 390 (`-mobile`), rendered from the same markup and CSS as the canvas.
  - `02-careers-how` has the drawer body scrolled 520px (the `<body data-scroll>` attribute records it).
  - `02-status-open` shows a dropdown open: the listbox on desktop and the sheet on mobile.
- Screenshots use Neue Montreal Regular for both 400 and 500, as the site does (CLAUDE.md "Fonts in the repo").
  - The canvas uses a separate Medium face, so it looks slightly bolder. **Match the references, not the canvas.**
- The date field shows the browser's locale format (11/08/2026 in the screenshots).
- **The references win on appearance at 1440 and 390. This README wins on behaviour.**

**Media and fonts:** already in the working tree (§10). Don't regenerate, recompress, re-cut or subset them.

**Copy:** final and approved.
- The essay text is the approved draft with typographic apostrophes (’). Two recorded differences:
  - the numbers paragraph uses the user-approved 28 / 27 / 19 wording;
  - the draft's italics are set upright (house rule: no italics).
- The demo, caption and explanation copy in §7–§9 is approved too. JobTrackr's own UI strings are copied from its codebase and must stay exactly as written, including "Use suggestions for salary" and "− Fewer details" (a real minus sign, U+2212).
- Don't edit, add to or reorder any copy.

---

## 1. Routes and files

| URL | Source file |
|---|---|
| `/writing/building-job-url-extraction-into-jobtrackr` | `src/writing/building-job-url-extraction-into-jobtrackr.html` |

**New files:**
- `src/writing/building-job-url-extraction-into-jobtrackr.html`: the essay page.
- `src/scss/posts/_job-url-extraction.scss`: everything only this essay needs: the demo plates, the JobTrackr drawer replica, the timeline, the numbers and the CTA link.
- `src/ts/posts/job-url-extraction/`: this essay's demos, loaded only by this page's own `<script type="module">`. A suggested split:
  - `extraction.ts`: pure state and rules, no DOM (§6);
  - `drawer.ts`: binds one replica drawer to that state (§5);
  - `sources-demo.ts`: Interaction 02 (§7);
  - `edits-demo.ts`: Interaction 03 (§8);
  - `main.ts`: the entry the page loads (`/assets/js/posts/job-url-extraction/main.js`).
  - Each module initialises only when its `data-*` hook is on the page. Imports use the `.js` extension.
- `src/assets/fonts/geist/Geist-Variable.woff2` and `GeistMono-Regular.woff2`, plus `docs/font-licenses/Geist-OFL.txt` (already in the working tree).
- `src/assets/video/writing/jobtrackr-url-extraction.mp4`, `src/assets/images/writing/jobtrackr-url-extraction-poster.webp` and `src/assets/images/writing/job-url-extraction-og.jpg` (already in the working tree).

**Changed files:**
- `src/ts/posts.ts`: the new entry (§2).
- `src/writing/index.html`: add the post to the Blog JSON-LD `blogPosting` array. The list itself is injected at build time.
- `src/writing/space-between-design-and-engineering.html`: the footer becomes "Next essay" (§3). Nothing else on that page changes.
- `src/scss/_writing.scss`: three small reusable additions:
  - heading and title optical-edge modifiers;
  - the essay-to-essay footer link (§3).
- `src/scss/_fonts.scss`: the two Geist faces (§10).
- `src/scss/_tokens.scss` (CRLF): `$font-jobtrackr`, `$font-jobtrackr-mono` and the two digit side-bearings for the numbers (§9).
- `src/scss/main.scss`: `@use 'posts/job-url-extraction';`.
- `CLAUDE.md`: §13.

**Not changed:**
- `posts.mjs`, `shared.mjs`, `main.ts`, `media-switch.ts`, `annotated-media.ts`;
- `_case.scss`, `_layout.scss`, `_index.scss`;
- the case studies, home, About and the Writing index layout.

---

## 2. Registry entry

Add it to `posts` in `src/ts/posts.ts`. `shownPosts` sorts it above the first essay.

```ts
{
  slug: 'building-job-url-extraction-into-jobtrackr',
  title: 'Building Job URL Extraction into JobTrackr',
  description: 'How a small improvement to adding job applications turned into a series of product decisions, engineering challenges, and lessons from shipping.',
  published: '2026-11-08',
  readingMinutes: 10, // 1,948 words of body copy, at about 200 words a minute.
},
```

- **Index:** two posts now. The existing rule applies: on desktop the list grows upward from its bottom-aligned position.
  - Check it at 1440 × 900 and 1320 × 700.
  - Below desktop, posts flow under the navigation.
- **Blog JSON-LD in `src/writing/index.html`:** add a `BlogPosting` for this post, first in the `blogPosting` array, with the same fields the existing entry uses.

---

## 3. The essay page

### Shell, header and metadata

- **Same shell as the first essay:** `case writing`, the `case-top` bar (`data-case-top`, name + "Writing"), `writing-head`, `writing-body`, the case footer, `main.css`, `main.js` and this page's module script.
  - The top bar hides and shows through `top.ts`, as on the first essay.
- **Title:** "Building Job URL Extraction into JobTrackr". It starts on a B stem, so it needs the stem edge.
  - `.writing-title` currently pulls left by `$lsb-t`. Add a reusable modifier, `.writing-title--stem { margin-left: -$lsb-stem-medium; }`.
  - Desktop: two lines, balanced, as in the reference.
- **Subtitle:** the registry description.
- **Meta:** Published "8 November 2026" (`<time datetime="2026-11-08">`), Reading time "10 minutes", in the existing `writing-meta` rail.
- **Head:** copy the first essay's head and change the values:
  - title `Building Job URL Extraction into JobTrackr — Balogun Oluwasogo`;
  - description: the subtitle;
  - canonical and `og:url` `https://www.balogunoluwasogo.com/writing/building-job-url-extraction-into-jobtrackr`;
  - `og:image` / `twitter:image` `https://www.balogunoluwasogo.com/assets/images/writing/job-url-extraction-og.jpg` (1200 × 630), alt `Building Job URL Extraction into JobTrackr, by Balogun Oluwasogo`;
  - `article:published_time` `2026-11-08`;
  - `BlogPosting` JSON-LD with `datePublished` and `dateModified` `2026-11-08`.
  - Keep the Neue Montreal preload. **Don't preload Geist:** it's only needed once a reader reaches the demos.

### Body order

Use the reference for each section's text. Heading edge modifiers follow each heading's first glyph. Add `.writing-heading--stem` (`$lsb-stem-medium`) and `.writing-heading--w` (`$lsb-w-medium`) to `_writing.scss`; `--round` and `--s` already exist.

| Section | Heading (edge) | What follows the prose |
|---|---|---|
| Introduction | visually hidden "Introduction" (as in the first essay), with the meta rail | — |
| `url-heading` | Making the URL do some of the work (stem) | Media 01 (§4) |
| `ai-heading` | Why I didn’t use AI for extraction (w) | Interaction 02 (§7) |
| `data-heading` | Getting the data was only part of the problem (round) | Interaction 03 (§8), then a `writing-after` prose block (the salary and expired-posting paragraphs) |
| `safe-heading` | Making it safe enough to ship (stem) | — |
| `prod-heading` | Getting it into production (round) | the release timeline (§9) |
| `useful-heading` | Working wasn’t the same as being useful (w) | the numbers figure (§9) |
| `next-heading` | What comes next (w) | — |
| `cta-heading` | See it in action (s) | one paragraph, then the large "Try JobTrackr" link (§9) |

- **Demos:** each demo figure spans the full content width, like the first essay's demos. Each uses `writing-demo` spacing: 72px above on desktop, 48px below desktop.

### Footer: "Next essay" on both essays

- **The label** changes from "Back to" to **"Next essay"** (`writing-foot__label`).
- **The link** is the other essay's title:
  - On this essay: "The Space Between Design and Engineering" → `/writing/space-between-design-and-engineering`. It starts on a T, so it takes `$lsb-t`.
  - On the first essay: "Building Job URL Extraction into JobTrackr" → `/writing/building-job-url-extraction-into-jobtrackr`. It starts on a B stem, so it takes `$lsb-stem-medium`.
- **Its size:** an essay title is too long for `.case-display` (up to 11.5rem). Add a reusable `.writing-foot__essay` in `_writing.scss`, matching the reference:
  - 40px below desktop and 72px from 1024;
  - weight 500, line-height 0.95, letter-spacing −0.04em;
  - `max-width: 900px` on desktop, `text-wrap: balance`;
  - the edge modifier comes from the title's first glyph.
- **Unchanged:** the clock, the links and the rest of the case footer.
- **On the first essay** this is the only change. Its metadata and everything else stay as they are.

---

## 4. Media 01: the screen recording

- **Markup:** a `data-annotated-media` wrapper with one figure and no notes. `annotated-media.ts` already handles that: one video, explicit Play/Pause and Replay.
- **Video:**
  - `/assets/video/writing/jobtrackr-url-extraction.mp4`, poster `/assets/images/writing/jobtrackr-url-extraction-poster.webp`;
  - `muted playsinline preload="none" controls`;
  - no `autoplay`, `loop` or `data-case-video`.
- **Frame shape:** the recording is 1316 × 720, not 16:10. Give this figure's frame `aspect-ratio: 1316 / 720` with an article-specific class in `_job-url-extraction.scss`. Don't change `.writing-frame`.
- **Video `aria-label`:** "JobTrackr, signed in with a test account: a public job URL is pasted into Add application, the role and company fill in, Source is set to Company website, and the application is added."
- **Controls label (desktop only, as in the shared controls):** "Pasting a job URL, reviewing the details, then adding the application"
- **Caption:** "Recorded on jobtrackr.site with a test account and a public job posting. Nothing is saved until Add application is pressed."

---

## 5. The JobTrackr drawer replica (Interactions 02 and 03)

Both demos put a working copy of JobTrackr's **Add application** drawer inside a portfolio plate. **Inside the drawer, JobTrackr's look wins over the portfolio's rules.** That's deliberate, and recorded in CLAUDE.md (§13).

### Source of truth

- The drawer copies JobTrackr's production code, checked on 8 November 2026 at JobTrackr `main` `f6d264a`. You don't need the JobTrackr repo: every value you need is in this README and in the references.
- **Field order and copy:** `application-form.tsx` (Add mode).
- **Status and suggestion copy:** `job-extraction-feedback.tsx`, `use-job-extraction.ts`, `job-extraction.ts`.
- **Styles:** `components/ui/{field,button,overlay,select,spinner}.module.scss`, `form-layout.module.scss`, `job-extraction-feedback.module.scss`, and the light tokens in `styles/_tokens.scss`.
- **Dropdowns:** `components/ui/select.tsx` (JobTrackr's own Select, not a native `<select>`; see "Dropdowns" below).
- **Icons:** `components/icons.tsx` (24 viewBox, 1.75 stroke, round caps).
- The reference HTML files hold the complete markup and CSS. Port them to SCSS under a `.jt` namespace (or your own BEM block) in `_job-url-extraction.scss`. Keep the values.

### Structure (top to bottom)

1. **Header:** "Add application" (16px, 600, −0.01em, line-height 24px) and a 32px × close button (`aria-label="Close"`). A 1px `#EBEBEB` rule sits below it.
2. **Body** (scrolls inside the drawer; 20px padding; the form starts 12px down; 16px between fields):
   1. Job URL: the link icon, placeholder `https://`. **Read-only in both demos** (§7, §8).
   2. The extraction feedback section (`aria-label="Job details extraction"`), in this order:
      - the button;
      - the status line (`role="status"`, `aria-live="polite"`);
      - an optional warning list;
      - an optional salary hint;
      - suggestion rows.
   3. Role* (placeholder "e.g. Frontend Engineer") and Company* ("e.g. Linear"). The `*` is `#C4281C`, with a 2px gap.
   4. A two-column row of dropdowns: Source ("Select source", LinkedIn, Contra, Upwork, Company website, Referral, Other; default "Select source") and Status (Saved, Applied, Assessment, Interviewing; default Applied).
   5. Date applied:
      - 200px wide, calendar icon, Geist Mono 13px, default **today**;
      - hint "Leave blank if unknown. Undated applications appear in all-time totals, not date-based charts."
      - If Status is Saved, it's replaced by the 13px muted line "Saved jobs are not counted as submitted applications. You can add the application date when you apply."
   6. "+ More details" / "− Fewer details": a 13px, 500 text button with `aria-expanded` and `aria-controls`, underlined on hover.
   7. The details, `hidden` until expanded:
      - Company URL (link icon, placeholder `https://`), hint "The company’s website. We’ll use its icon as the logo when we can find one.";
      - Location;
      - Work mode (Not specified, Remote, Hybrid, On-site) / Employment type (Not specified, Full-time, Part-time, Contract, Internship, Freelance, Other), both defaulting to Not specified;
      - Priority (Low, Medium, High; default Medium);
      - Salary minimum / Salary maximum (number inputs, `min="0" step="0.01"`, Geist Mono 13px);
      - Currency (200px, placeholder "USD", `maxlength="3"`);
      - Job description (textarea, 5 rows) and Notes (4 rows).
3. **Footer:** a 1px `#EBEBEB` rule above it, 14px 20px padding, buttons aligned right with an 8px gap: **Cancel** (secondary) and **Add application** (primary, black).

### Values (light tokens)

| Thing | Value |
|---|---|
| Surface | `#FFFFFF`, ink `#171717`, muted `#6B6B6B`, hairlines `#EBEBEB` |
| Font | Geist (400/500/600), Geist Mono 400 for the date and salary. Base 14px |
| Label | 13px, 500, line-height 18px; label to control gap 6px |
| Hint | 12px / 16px, `#6B6B6B` |
| Control | 40px tall, 0 12px padding, 1px `#DEDEDE` border, 6px radius, 8px gap to its icon (16px icon, `#6B6B6B`). Text 14px `#171717`, placeholder `#6B6B6B` |
| Control states | hover border `#C2C2C2`; focus-within border `#171717` + `0 0 0 3px rgb(23 23 23 / 8%)`; keyboard focus: a 2px `#0B63E5` outline, 2px offset, on the whole box |
| Invalid | border `#D92D20`; focused: `0 0 0 3px rgb(217 45 32 / 10%)`. The error replaces the hint: 13px `#C4281C`, an AlertCircle icon at 14px with stroke 2, a 6px gap |
| Dropdown (closed) | the control box with 40px right padding; a `role="combobox"` button fills it, value truncated with an ellipsis; a 14px chevron (stroke 2), `#6B6B6B`, 12px from the right. "Select source" and "Not specified" are ordinary options, so they show in ink, not placeholder grey |
| Textarea | padding 10px 12px, min-height 60px, line-height 20px, vertical resize |
| Button (secondary) | 36px tall, 0 14px, 1px `#DEDEDE`, 6px radius, 14px 500, −0.005em; hover `#F4F4F4` / `#C2C2C2` |
| Button (primary) | `#171717` on white text; hover `#383838` |
| Busy button | `#F4F4F4` fill, `#EBEBEB` border, `#8F8F8F` label, `cursor: progress`, with a 14px spinner before the label (2px ring `rgb(23 23 23 / 15%)`, top `#171717`, 0.7s linear; 1.8s with reduced motion) |
| Feedback section | grid, 8px gap, **12px / 1.5**, `overflow-wrap: anywhere`. The button stays its own size |
| Suggestion row | 10px 0 padding, 1px `#e5e7eb` top rule, buttons 6px below in a wrapping row with 8px gaps. "**{Label} suggestion:** value", label in 600 |
| Transitions | 120ms `cubic-bezier(0.2, 0, 0, 1)` on border, shadow and background; none with reduced motion |

### Dropdowns (JobTrackr's Select)

All five dropdowns (Source, Status, Work mode, Employment type, Priority) copy JobTrackr's `Select`: the select-only combobox pattern, with every option listed (none is a hidden placeholder). See `02-status-open-desktop|mobile`.

**Desktop: a listbox under the field.**
- Width: exactly the field box's border width. Position: 4px below its bottom edge, flipping above if it wouldn't fit inside the drawer (8px margin). Reposition on scroll and resize, like JobTrackr.
- Style: 6px padding, 1px gaps between options, 1px `#EBEBEB` border, 8px radius, white, `box-shadow: 0 1px 2px rgb(0 0 0 / 4%), 0 12px 32px -8px rgb(0 0 0 / 16%)`, max-height 296px (then it scrolls).
- Opening animation: `pop`, 180ms `cubic-bezier(0.2, 0, 0, 1)`, from `opacity: 0; transform: translateY(4px) scale(.98)`. With reduced motion, a 120ms fade.
- Options: at least 32px tall, 0 8px padding, 6px radius, 13px / 18px. The active option (hovered or reached by keyboard) gets `#F4F4F4`. The selected option shows a 14px check (stroke 2) at the right.
- Render it inside the drawer, not portalled to the page. Keep it above the body's scroll, so the body doesn't clip it.

**Below 1024: a bottom sheet.**
- In JobTrackr this sheet covers the whole screen. Here it's contained in the replica's own sheet: a `rgb(10 10 10 / 32%)` scrim over the drawer, with the list sheet rising from the drawer's bottom edge.
- Sheet: 16px top corners, the grab bar, max-height 88%, shadow `0 -12px 40px -12px rgb(0 0 0 / 25%)`; animation `up`, 240ms (`opacity: .6; translateY(24px)` → none).
- Header: the field's label as title (17px, 600, −0.01em, line-height 24px), padding 12px 8px 12px 20px, with a 44px close button (`aria-label="Close"`).
- List: rows at least 48px tall, 0 20px padding, 16px text, 12px gap, `#F4F4F4` on hover, a 2px inset blue focus ring, and an 18px check on the selected row. 32px of padding below the list.
- The sheet is `role="dialog"` with `aria-modal="true"`, labelled by its title. The list is a `role="listbox"` of `role="option"` buttons.

**Behaviour (from `select.tsx`):**
- **Trigger:** `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`; on desktop, `aria-activedescendant` points at the active option. The field's label labels it (`aria-labelledby`).
- **Opening:** click, Enter, Space, ArrowDown or ArrowUp opens with the selected option active. Home and End open on the first or last option.
- **Typeahead:** typing jumps to a matching option (keystrokes within 0.5 s build a prefix), and opens the list if it's closed.
- **While open:** ArrowDown/ArrowUp step, Home/End jump, PageDown/PageUp move 10, Enter or Space chooses, Alt+ArrowUp chooses, Tab chooses the active option and moves on, Escape closes without changing.
  - Escape must not also trigger anything outside the dropdown.
- **Closing:** choosing closes the list and returns focus to the trigger. A press outside the list closes it without changing the value. Mouse-down inside the list must not blur the trigger.
- **Choosing the current option** changes nothing. It doesn't mark the field as touched.
- **Values:** Source, Work mode and Employment type are extractable, so choosing a different one marks them touched (§6). Status and Priority aren't.

### Below 1024: JobTrackr's phone sheet

- The drawer becomes JobTrackr's bottom sheet, filling the plate's width.
- **Shape:** 16px top corners, a 36 × 4px `#DEDEDE` grab bar 8px from the top, and **600px tall, with the body scrolling inside**.
- **Header:** padding 12px 8px 12px 20px, no rule, title 17px, close button 44px.
- **Body:** padding 4px 20px 20px.
- **Footer:** padding 12px 20px 20px. Cancel and Add application share the row 1 : 2.
- **Controls:** 44px tall, input text 16px (stops iOS zooming), buttons 44px tall at 15px.
- **Layout:** the two-column rows stack, and 200px fields go full width.
- **Scrolling:** the sheet's body doesn't contain overscroll, so a swipe that reaches its end carries on scrolling the page.

### What's different from the product, and why

- **The dropdowns' sheet below 1024 stays inside the replica** instead of covering the whole page (see "Dropdowns").
- **The busy button keeps focus** with `aria-disabled="true"` and `aria-busy="true"`. JobTrackr disables it natively, which drops keyboard focus. Presses while busy are ignored.
- **Job URL is read-only** with a visually hidden description:
  - Interaction 02: "Example link. Choose another example beside the form."
  - Interaction 03: "Example link, pasted from beside the form."
- **Saving doesn't close anything.** See each demo.
- **The demos aren't forms that submit:** use `<form novalidate>` with no `action` and no `name` attributes, call `preventDefault`, and send nothing.

### Focus

- After **Use suggestion**, focus the field it filled (Salary minimum for the salary group).
- After **Dismiss**, focus the next suggestion's first button, or the extraction button if none are left.
- **Add application** with errors focuses the first invalid field, as JobTrackr does.
- **Cancel** and **×** reset the demo and focus the extraction button.
- Changing the example or scenario keeps focus on the option.

### Without JavaScript

- The plates render with every control `disabled`.
- Each plate's foot note reads "This demo needs JavaScript. Nothing you type is sent or stored." (the first essay's pattern). JS replaces it with the demo's own label.
- The explanation in Interaction 02 is hidden until a result, so it isn't shown without JS.

---

## 6. The extraction rules (shared, `extraction.ts`)

These mirror JobTrackr's `use-job-extraction.ts`. Use the same rules in both demos.

**State:**
- the URL and the field values (Role, Company, Company URL, Source, Location, Work mode, Employment type, Salary minimum, Salary maximum, Currency, Job description, plus Status, Date applied, Priority, Notes);
- three sets: **touched** fields, **owned** fields (filled by extraction), and **suggestions**;
- the last result, the status message, busy, More details open, and errors.

**Typing in an extractable field** marks it touched and no longer owned. Touching any salary field touches all three.

**Applying a result** (fields are checked in JobTrackr's order: Role, Company, Company URL, Source, Location, Work mode, Employment type, Salary minimum, Salary maximum, Currency, Job description):
- A field **fills** only if all of these hold:
  - it's blank;
  - it hasn't been touched;
  - it isn't a salary field while salary is protected (any salary field touched or non-empty);
  - the value didn't come from page metadata.
- Otherwise, a **different** value becomes a **suggestion**. An equal value does nothing.
- More details **opens on its own** if the result has, or warns about, any field other than Role, Company and Source.

**Suggestions:**
- **Use suggestion:** puts the value in the field, marks it touched, removes the row.
- **Salary is a group.** Each salary suggestion's button reads "Use suggestions for salary". Pressing it sets minimum, maximum and currency from the result together, clearing any bound the result doesn't have.
  - While any salary suggestion shows, the line "Salary suggestions replace minimum, maximum and currency together. Missing bounds are cleared." sits above the rows.
  - That line is the salary buttons' `aria-describedby`.
- **Dismiss:** removes the row; the salary group dismisses together.
- Work mode, Employment type and Source suggestions show their labels (Remote, Full-time…), not their values.
- Values longer than 300 characters show the first 300 and "…".
- Buttons carry `aria-label="Accept {Label} suggestion"` / `"Dismiss {Label} suggestion"`.

**Extraction button and status line:**

| State | Button | Status line |
|---|---|---|
| Nothing run yet | Extract details | Paste a public job URL to fill available details automatically. |
| Busy | the same label, with the spinner, busy style | Looking for job details… You can keep editing. |
| Success | Retry extraction | Details added. Review them before saving. |
| Partial (any warning, or no role or company) | Retry extraction | Some details were found. Review suggestions and complete missing fields. |
| Blocked | Retry extraction | This site prevents automatic extraction. Enter details manually or paste the job description below. |
| No URL (Interaction 03 only) | Extract details | Enter a valid public job URL first. |

- **Starting a run** clears the message, the result, the warnings and the suggestions. The fields stay editable throughout.
- **A newer run wins:** each run takes a generation number, and a reply applies only if its generation and URL are still current.

**Add application:**
- Cancels any run in progress.
- Validates: an empty (trimmed) Role shows "Role is required." and an empty Company shows "Company is required."
  - Errors stay until the next press, as in JobTrackr. Set `aria-invalid`, and point `aria-describedby` at the error.
- If both are filled, the demo shows its saved note (§7, §8). Nothing else happens.

---

## 7. Interaction 02: Where the details come from

### Layout

- **Desktop:** a plate (`$plate-clip`), **800px tall**: a side column (`minmax(0, 1fr)`) beside the 480px drawer. The drawer sits flush with the plate's top, right and bottom edges, like the real drawer against the screen edge.
  - **Side column:** padding 32px 40px, a column with 32px gaps, 16px / 1.4 Neue Montreal. It scrolls if it ever overflows.
  - **Top to bottom:**
    - the name "Where the details come from" (500);
    - the examples (§ below), under a muted "Example link" label, stacked with 8px gaps;
    - the prompt or the explanation;
    - at the bottom, the CTA link, and then the foot: the simulation label (14px muted) with **Reset** beside it.
  - **Text widths:** prompt, notes and explanation max 440–520px, as in the reference.
- **Below 1024:**
  - the plate has 20px padding top and sides at 15px;
  - the name, then the examples stacked as 44px rows (no visible label), then the prompt;
  - then the sheet, full width;
  - then a block (padding 20px, 20px gaps) with the saved note, the explanation, the CTA and the foot (13px).
- **Caption below the plate** (`writing-caption`): "Recognised Greenhouse and Lever links use the job board’s public API. Other pages can still describe the job with JobPosting data. A page title or description is only ever a suggestion."

### The examples

Use a `fieldset` of native radios styled as words (the first essay's Demo 01 pattern), with a visually hidden legend "Example link". The selected word is ink and the rest are muted. Below desktop, each has a 44px target.

| Option | Job URL | Result after Extract details (0.9 s) |
|---|---|---|
| **Greenhouse posting** (selected first) | `https://job-boards.greenhouse.io/northwind/jobs/4012345` | Success, from the Greenhouse API. Fills Role "Senior Product Designer", Company "Northwind", Location "London", Job description "About the role" + blank line + "Northwind is looking for a senior product designer to lead the design of our scheduling tools, from early research to shipped interfaces." Work mode stays Not specified (JobTrackr only sets it from Greenhouse when the location is literally "Remote", "Hybrid" or "On-site"). Source is never filled. |
| **Careers page with job data** | `https://careers.haldenlabs.example/jobs/ux-engineer` | Success, from JobPosting JSON-LD. Fills Role "UX Engineer", Company "Halden Labs", Company URL `https://haldenlabs.example`, Location "Remote — United Kingdom", Work mode Remote, Employment type Full-time, Salary 70000 / 85000, Currency GBP, Job description "Halden Labs builds research tools for small teams. As a UX engineer you’ll turn designs into accessible, production-ready interfaces." |
| **Title and description only** | `https://fernway.example/careers/content-designer` | Partial, from page metadata. **Nothing fills.** Warning list item "Only page metadata was found. Review the title; the description is a page summary, not the full job description." Suggestions: Role "Content Designer \| Fernway Careers" and Job description "Join Fernway as a content designer and help shape how people plan their trips." More details opens. |
| **Blocked page** | `https://jobs.boardly.example/view/88213` | Unavailable (BLOCKED). The blocked status line; the form stays as it is, so the reader can type. Retry gives the same answer. |

- **Choosing an example** cancels any run and resets the drawer to a fresh Add application with that link: today's date, Applied, Medium. It also closes the explanation and clears the saved note.
- **Nothing runs until Extract details is pressed.** A pasted link would start at once in JobTrackr; here the link is placed, not pasted.

### The side column through the flow

| When | Shows |
|---|---|
| Before a result | The prompt, muted: "Press Extract details in the form to see what JobTrackr finds for this link." |
| After a result (any example) | A text button, "How did JobTrackr get these details?" (500 ink, `aria-expanded`, `aria-controls`), closed by default |
| Open | The three places JobTrackr looks, in order, then two paragraphs (below) |
| Add application with Role and Company filled | Above that, a note with `role="status"`: "This is where JobTrackr would save the application. Nothing is saved here." It clears on Extract, Reset, Cancel or a new example |

**The three places** are an `<ol aria-label="Where JobTrackr looked, in order">`. Each row is a 236px name column plus its state, both muted, with the used step's name in ink. Below desktop, the state sits under the name.
- The names: "Greenhouse or Lever API", "JobPosting data on the page", "Page title and description".

| Example | States, in order (used step) | Paragraphs |
|---|---|---|
| Greenhouse posting | Used · Checked, to fill any gaps · Not used (first) | "This is a Greenhouse job link, so JobTrackr asked Greenhouse’s public job board API for this posting. It returned the role, company, location and description." / "JobTrackr then read the posting page itself, in case its structured data could fill anything still missing. Lever links work the same way, through Lever’s API." |
| Careers page with job data | Not a Greenhouse or Lever link · Used · Not needed (second) | "This careers page isn’t on Greenhouse or Lever, so JobTrackr read the page itself and found JobPosting structured data, written as JSON-LD." / "That data names the role, the hiring organisation, the location, the employment type, the salary and the description. Salary only fills when the page gives an annual amount with a currency." |
| Title and description only | Not a Greenhouse or Lever link · None on the page · Used, as suggestions (third) | "The page had no JobPosting data, so JobTrackr fell back to its title and description tags." / "Those are less certain. A page title often carries the site’s name, and the description is a summary, not the full posting. So they’re offered as suggestions, and nothing fills on its own." |
| Blocked page | Not a Greenhouse or Lever link · Couldn’t read the page · Couldn’t read the page (none) | "The site refused JobTrackr’s request, so there was nothing to read. JobTrackr says so and leaves the form to you." / "Everything can still be entered by hand, and the job description can be pasted in." |

- **CTA (always shown):**
  - text: "Try it with your own job links on JobTrackr";
  - link: `https://jobtrackr.site`, `target="_blank" rel="noopener"`, visually hidden " (opens in a new tab)";
  - style: 500 ink, muted on hover.
- **Foot label (with JS):** "Interactive simulation. It runs in your browser and doesn’t contact JobTrackr. Nothing you type is sent or saved."
- **Reset:** resets the selected example (same as choosing it again).

---

## 8. Interaction 03: Your edits win (restyled; same behaviour)

- **This replaces the canvas's earlier version.** The surface is the drawer replica of §5, and suggestions now sit in the feedback section under the status line, as in JobTrackr. They used to sit under each field.
- **The plate** has the layout of §7: the same 800px desktop plate and side column, and the same 600px sheet below 1024.
- **Side column, top to bottom:**
  - the name "Your edits win";
  - a scenario fieldset with a muted "Try" label (visually hidden legend "Scenario"): **Edit while it looks** (first) and **Change the URL**;
  - a live region (`aria-live="polite"`) with:
    - the prompt (ink, 500);
    - the action text buttons;
    - the log (muted, ink once set);
  - the foot at the bottom, with Reset.
- **Below 1024:** name, scenarios, then the live region, then the sheet, then the foot.
- **Caption:** "The status lines are JobTrackr’s own. Untouched blank fields fill; a field you’ve changed keeps your value, and the incoming one is offered as a suggestion."
- **Foot label (with JS):** "A simulation running in your browser. It doesn’t contact JobTrackr."

**The two jobs:**
- URL A `https://job-boards.greenhouse.io/northwind/jobs/4012345` → Senior Product Designer / Northwind / London.
- URL B `https://careers.haldenlabs.example/jobs/ux-engineer` → UX Engineer / Halden Labs / Remote.
- Both succeed. Location opens More details.

**Edit while it looks:**

| Step | Prompt | Actions |
|---|---|---|
| Start (empty URL) | Paste the example URL, then change the Role while JobTrackr is looking. | "Paste example URL" |
| Looking (resolves at 4 s) | While it’s looking, change the Role. | "Paste example URL" disabled; "Change it for me" (sets Role to "Product Designer" as a touched edit) until Role is touched |
| Done | Try the suggestion buttons, or Reset and try again. | "Paste example URL" disabled |

- **Paste** sets URL A and starts a 4 s run.
- **When it applies**, the log reads:
  - with an edit: "Your edit stayed. The extracted value is offered as a suggestion, and the blank fields filled.";
  - without one: "Every field was blank, so everything filled. Reset, then change the Role while it’s looking."

**Change the URL:**

| Step | Prompt | Actions |
|---|---|---|
| Start | Paste URL A, then replace it with URL B before A finishes. | "Paste URL A" |
| A looking (4 s) | Before it finishes, paste a different job. | "Paste URL B" |
| After B | URL B was the newer request, so its answer wins. | "Paste URL B" disabled |

- **Paste URL A** starts a 4 s run.
- **Paste URL B** before it ends does JobTrackr's URL change, then starts a 1.2 s run for B. Log: "Waiting for URL A as well…".
  - **The URL change:** forget the old run, and clear any untouched field still holding its extracted value.
- **B applies at 1.2 s.** At 4 s, A's reply arrives, no longer matches, and is ignored. Log: "URL A’s answer arrived late and was ignored. The form still shows URL B."
- **If B never replaced it**, A applies. Log: "URL A finished first because nothing replaced it. Reset and paste URL B before it finishes."

**Both scenarios:**
- The drawer's own button works:
  - with no URL: "Enter a valid public job URL first.";
  - otherwise: a 1.2 s run for the current URL, without touching the scenario's step or log.
- **Add application:** with Role and Company filled, the log becomes "This is where JobTrackr would save the application. Nothing is saved here."
- **Reset**, Cancel, × and switching scenario clear all timers and start the scenario again.

**Timers (both demos):**
- Clear every timer on reset, on scenario or example change, and on `pagehide`.
- On a `pageshow` with `persisted`, reset the current scenario or example, so the page can't come back stuck mid-run.

---

## 9. Timeline, numbers and the CTA link

- **Release timeline**, after "Getting it into production":
  - an `<ol>` of five rows; on desktop, the time sits in the rail (columns 1–3, 16px muted) and the text in the prose column (20px / 1.5);
  - below desktop, the time stacks above the text (14px / 17px);
  - 28px between rows (20px below desktop);
  - caption "Release timeline. Times come from the commit history, in West Africa Time."
  - No numbering and no rules. Text as in the reference.
- **Numbers**, after "Working wasn’t the same as being useful": in the prose column, three columns: 28 · 27 · 19.
  - **Figures:** 96px desktop / 56px below; 500; line-height 0.9. Labels below: 16px / 13px muted.
  - Note: "An early 30-day snapshot from JobTrackr’s extraction analytics, taken on 8 November 2026. Attempts aren’t unique users, and analytics started after launch. Saved applications can include details completed by hand. None of this measures time saved."
  - **Use proportional figures:** `font-variant-numeric: proportional-nums`. Neue Montreal's tabular digits are padded to one width, which left wide gaps (worst in "19").
  - **Tracking:** −0.03em desktop, −0.025em below.
  - **Optical left edge:** −0.029em for the numbers starting with 2 and −0.013em for 19 (Regular's side bearings). Add `$lsb-two: 0.029em` and `$lsb-one: 0.013em` to `_tokens.scss`.
- **CTA:** after the "See it in action" paragraph, the link "Try JobTrackr":
  - to `https://jobtrackr.site`, new tab, visually hidden " (opens in a new tab)";
  - 48px desktop / 28px below, 500, line-height 1.1, −0.022em, `$lsb-t`;
  - below desktop, at least 44px tall.

---

## 10. Media and fonts (final; already in the working tree)

| File | What it is |
|---|---|
| `src/assets/video/writing/jobtrackr-url-extraction.mp4` | 1316 × 720, 60 fps, H.264, no audio, 32.97 s, about 2.2 MB, `moov` before `mdat` (fast start). Recorded at real speed on jobtrackr.site with a test account; browser chrome cropped out; ends on the saved application. |
| `src/assets/images/writing/jobtrackr-url-extraction-poster.webp` | 1316 × 720, the frame at 9.2 s (about 50 KB). |
| `src/assets/images/writing/job-url-extraction-og.jpg` | 1200 × 630, the first essay's share-image layout with this title (about 35 KB). |
| `src/assets/fonts/geist/Geist-Variable.woff2` | Geist 1.3.1 (npm `geist`), variable 100–900, about 56 KB. |
| `src/assets/fonts/geist/GeistMono-Regular.woff2` | Geist Mono 1.3.1, 400, about 41 KB. |
| `docs/font-licenses/Geist-OFL.txt` | Geist's SIL Open Font License. |

- Delivered files may carry a small Content Credentials manifest, so byte sizes can differ slightly. That's expected; don't strip or re-encode.
- **`_fonts.scss`:** declare `'Geist'` (`font-weight: 100 900`) and `'Geist Mono'` (400) with `font-display: swap` and a licence comment, like Figtree.
  - Browsers only download a face when it's used, so only this essay loads them, and only once the demos render. No preload.
- **`_tokens.scss`:**
  - `$font-jobtrackr: 'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;`
  - `$font-jobtrackr-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;`
- **The replica's colours** are JobTrackr's, not the portfolio's. Keep them in one namespaced map at the top of `_job-url-extraction.scss`, with a comment naming their source, rather than in the global tokens.
- `vercel.json` already caches `/assets/fonts/` immutably. No change.

---

## 11. Accessibility, motion and performance

- **Every field has a real `<label for>`.** Required fields carry `aria-required`, and errors are wired as in §6.
- **Live regions:** the status line is the drawer's live region. Interaction 03's side column is a second, polite one. The saved note is `role="status"`.
- **The drawer** is a `role="group"` labelled by its "Add application" heading (an `h3`). It isn't a dialog: no focus trap, no scrim.
- **Keyboard:**
  - native radios move with the arrow keys;
  - Tab reaches every control in visual order (side column first on desktop, then the drawer);
  - focus-visible outlines stay on: the portfolio's on the plate, JobTrackr's blue one in the drawer.
- **Tap targets** below 1024 are at least 44px: the sheet controls, the examples, the text buttons, the CTA and Reset.
- **Reduced motion:** the spinner slows to 1.8s and transitions are removed. Nothing else moves.
- **Privacy:**
  - no requests, no storage and no analytics events from either demo;
  - no `name` attributes and no form `action`;
  - zero network requests while using both demos (check in DevTools).
- **Performance:**
  - no new dependencies;
  - the video is `preload="none"`;
  - Geist loads only on this page;
  - the demo script is this page's only extra module.

---

## 12. Acceptance checks

1. `npm run typecheck` and `npm run build` pass.
2. **Essay:** compare with `reference/article-desktop-*.webp` at 1440 and `article-mobile-*.webp` at 390, with reduced motion and the clock frozen at 11:05.
   - Text must match the reference HTML exactly.
   - Allowed differences: the date field's locale format, and anti-aliasing.
3. **Demo states:** walk through every state in `reference/02-*` and `03-*` with mouse, touch (390 × 844) and keyboard, and compare.
   - Check the salary group with the careers example after typing a salary first: all three salary values become suggestions, and one press fills the group.
   - Check Status = Saved swaps the date for its line.
   - Check every dropdown against `02-status-open` and the keyboard behaviour in §5 "Dropdowns", with mouse, keyboard and touch.
   - Check Add application's errors and focus.
4. **Index:** two posts, newest first, correct dates (UTC) and reading times, at 1440 × 900, 1320 × 700 and 390 × 844. The Blog JSON-LD lists both.
5. **First essay:** the footer reads "Next essay / Building Job URL Extraction into JobTrackr" and links correctly. Nothing else on the page changes (pixel-compare the rest).
6. **Media 01:** nothing downloads before Play; the Range requests work; Replay restarts; a rejected `play()` restores "Play".
7. **No JS:** disabled controls with the fallback note, and the native video controls.
8. **No horizontal overflow** from 320 to 2560 with classic scrollbars, including the drawer's long URL.
9. **Metadata:** canonical, OG and Twitter tags, `BlogPosting` JSON-LD; the OG image resolves.
10. **Regressions:** home (closed and About open), the five case studies and the first essay's demos are unchanged.

---

## 13. CLAUDE.md

Under "Writing", add:
- **Second essay:** "Building Job URL Extraction into JobTrackr", 8 November 2026. Spec and references in `docs/handoff/writing-job-url-extraction/`. Its prose is copied from `reference/article-desktop.html`.
- **Article-specific code:** `src/ts/posts/job-url-extraction/` and `src/scss/posts/_job-url-extraction.scss`, loaded only by that essay.
  - Interactions 02 and 03 share a JobTrackr Add application replica whose copy, field order, styles and dropdowns (JobTrackr's Select: a listbox on desktop, a sheet below 1024) come from JobTrackr `main` `f6d264a`, and the extraction rules of §6.
  - The demos send nothing, store nothing and record nothing.
  - Record the timings (0.9 s; 4 s and 1.2 s) and the focus rules.
- **Design-rule exception:** inside the JobTrackr drawer replica only, JobTrackr's own styling applies: Geist, 1px borders and hairlines, 6px radii, its colours. Add it to "Decoration" as the fourth deliberate exception.
- **Fonts:** Geist and Geist Mono (OFL, `docs/font-licenses/Geist-OFL.txt`) ship as WOFF2 and are used only by that replica.
- **Footer:** essay footers use "Next essay" with the other essay's title (`.writing-foot__essay`). When a third essay arrives, decide which essay each footer points to.
- **Numbers:** display figures use proportional digits with the `$lsb-two` / `$lsb-one` edges.
