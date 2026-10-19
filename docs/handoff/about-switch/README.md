# About on the home page: the Work / About switch

**Status:** 14 October 2026. Ready to build.

**The problem:** people didn't know that the portrait in the name opens the About. The reveal itself stays exactly as it is; this adds a way in that people can see.

**The design:**
- direction B, "Work / About";
- on the design canvas "iudoh.me Layout Variations", page **About, Work / About**: desktop and mobile, closed and open, all clickable with Play;
- the earlier comparison of the three directions is the "About Entry Points" page.

**Reference implementation:** `about-switch.patch` in this folder. It's a tested implementation of this README.
- It applies cleanly to the repo as it stood on 14 October 2026, with or without the TL;DR patch (`docs/handoff/tldr/`); the two touch different files.
- It changes three files: `src/index.html`, `src/scss/_index.scss` and `src/ts/about.ts`.

---

## 1. What changes

**The label:** the "Work" label over the project list becomes two words, **Work** and **About**.
- The lit word (ink) is what the stage shows.
- The other word is muted and turns ink on hover.
- It's the same switch as "Full story / TL;DR" on the case studies.

**What the words do:**
- **"About"** opens the About, with the same reveal as the portrait: the role line becomes the statement and the list becomes the About. It stays open until "Work", Escape or the portrait closes it.
- **"Work"** closes it.

**The portrait keeps everything it does today.** Hover peeks on desktop, a tap toggles on touch, and Enter / Space toggle from the keyboard.

**Desktop (1024 and up):**
- The switch row stays on the "Work" line in both states. Only the lit word changes.
- The list and the About swap below it, exactly where they are today.
- The About's own "About" label is no longer shown on desktop; the row above does that job.

**Below desktop:** the About is taller than the list there and rises over it, so it brings its own "Work About" row, which sits where the About label is today.

**The one visible change in the closed state:** "Work" is now ink (the lit word), where today it's muted, and "About" sits beside it.

---

## 2. Look

**References:** `reference/desktop-default.webp`, `desktop-open.webp`, `mobile-default.webp`, `mobile-open.webp` and `desktop-short-open.webp` (1280 × 600, the flow layout). All are 1x, with reduced motion and the clock frozen at 11:05.

- **Type:** the "Work" label's existing style, with no new tokens.
  - 15px below 1024 and 16px from 1024, at 400.
  - Ink `$color-ink` when lit, `$color-muted` when not.
  - A 0.15s colour transition on hover.
- **Spacing:** 16px between the words below desktop, and `$gutter` (24px) from 1024. There are no rules, underlines, pills or icons.
- **Optical edge:** both rows start on the W of "Work" and keep `-$lsb-w-book`. The About's row below desktop now starts on a W too.
- **Hit areas below desktop:** each word is 44px tall and reaches 8px either side (`::after`, the pattern the case-study links use), so neighbouring targets meet halfway across the gap.
- **Focus:** the same 2px `currentColor` outline with a 3px offset as the links.
- **The rest of the page doesn't move.** Against today's site, only the switch row's pixels differ:
  - **1440, closed and open:** y 510–521, x 64–165.
  - **390, closed:** y 377–387, x 20–107.
  - **390, open:** y 321–331, x 19–107.

  The bio, the facts, the statement, the list, the clock and the links are all where they are now.

---

## 3. Behaviour

| Input | Result |
|---|---|
| Hover the portrait (desktop, mouse) | Peeks, as today: shows while the pointer is on it, hides 100ms after it leaves. The lit word flips to "About" while it shows. |
| Click "About" | Opens and stays. Moving the pointer over and off the portrait doesn't close it. |
| Click "About" during a peek | The peek becomes a choice: it stays open. |
| Click "Work" | Closes. |
| Escape | Closes, whatever opened it. |
| Tap "About" / "Work" (touch) | Same as a click. |
| Tap the portrait (touch) | Toggles, as today. |
| Enter / Space on the portrait | Toggles, as today. Tab from the portrait closes a portrait-opened About, as today; an About opened from the switch stays open, and Tab moves on to the switch. |
| Enter / Space on a switch word | Same as a click. |

- **Focus:**
  - **Desktop:** the pressed word stays where it is, so focus doesn't move.
  - **Below desktop:** the pressed word's row fades out, so focus moves to the row that takes its place. After "About" it goes to the About's "Work"; after "Work" it goes to the list's "About".
  - **Reduced motion:** the incoming row's visibility runs a 0.01ms transition that starts hidden, so the focus move retries for up to five frames.
- **Resizing across 1024:** the About closes, as today. That's the existing `hoverDesktop` change listener.

### The flow layout

Today the About falls back to the flow layout (`.is-about-flow`: statement and About in the page, which scrolls) when it would come within 32px of the statement.

**On desktop it now also falls back when:**
- the statement would come within 32px of the switch row; or
- the About would rise above the list's first line (16px under the row).

**In the flow layout on desktop:**
- the switch row stays visible above the About;
- the list is hidden;
- the About sits in the flow under the row.

**Measured, with "About" pressed:**

| Window | Layout | Row to About |
|---|---|---|
| 1024 × 768 | flow (fits without scrolling) | 16px |
| 1280 × 600 | flow (scrolls 81px) | 16px |
| 1280 × 720 | in place | 52px |
| 1280 × 800 | in place | 52px |
| 1366 × 768 | in place | 79px |
| 1440 × 900 | in place | 106px |
| 1536 × 864 | in place | 106px |
| 1920 × 1080 | in place | 133px |

**Phones are unchanged.** At 390 × 844 the open About is in the flow layout, as today.

---

## 4. Accessibility

- **The list's row:**
  - `<div class="index__heading index__switch" data-about-switch>`.
  - "Work" is a button inside the section's `<h2 id="featured-heading">`, so the section is still labelled "Work".
  - "About" is a button beside it.
  - Both carry `aria-pressed`. "About" also has `aria-controls="about-statement about"`, like the portrait.
- **The About's row:**
  - a "Work" button, `aria-pressed="false"`;
  - the About's `<h2>About</h2>`, lit.
  - It's only ever visible while the About is open.
- **`about.ts` keeps `aria-pressed` on all three buttons in step,** and `aria-expanded` on the portrait as today.
- **Tab order (closed):** portrait, Work, About, then the projects. While the About is open on desktop the list is hidden, so after "About" comes LinkedIn.
- **Hidden rows can't be reached:** a row that isn't showing is `visibility: hidden`, so Tab and screen readers skip it.

---

## 5. Files

**`src/index.html`:**
- The list's row replaces `<h2 class="index__heading" id="featured-heading">Work</h2>`.
- The About's row replaces `<h2 class="about__heading">About</h2>`.
- Two comments are updated.

**`src/scss/_index.scss`:**
- `.index__heading` becomes a flex row (gap 16px, `$gutter` on desktop).
- New `.index__switch-heading` (an `h2` reset to the row's type) and `.index__switch-word` (the button reset, colours, focus ring and mobile hit area).
- The lit rule: `.page:not(.is-about-open) .index__switch-word--work, .page.is-about-open .index__switch-word--about { color: $color-ink; cursor: default; }`.
- Desktop only: the row stays visible while open (`.page.is-about-open .index__heading.index__switch`), and in the flow layout (`.page.is-about-flow .index__heading.index__switch { display: flex }`).
- `.about__heading` becomes the About's own row: flex, gap 16px, the W's optical edge, and `display: none` from 1024. Its desktop size and margin go, because it's no longer shown there.

**`src/ts/about.ts`:**
- A third source, `'switch'`. An About opened from the switch closes only on "Work", Escape or the portrait.
- `set()` no longer turns a tap- or switch-opened About back into a peek when the pointer enters the portrait. It also updates `aria-pressed`.
- A click handler for `[data-about-show]` (`"about"` / `"work"`), with the focus move below desktop (`focusWhenShown`).
- `fitLayout()` gains the two desktop checks in §3.
- Tab from the portrait doesn't close an About opened from the switch.
- The header comment describes all of this.

**Not touched:**
- `main.ts`: `initAbout` finds the switch buttons inside `page` itself.
- `_layout.scss`, `_tokens.scss`, the case studies, `preview.ts`, `modal.ts`, `projects.ts`.
- No new tokens, fonts or dependencies.

All three files have CRLF line endings in the working tree, and the patch keeps them.

---

## 6. Edge cases

- **Project hover on desktop:** while a project is hovered, the "Work" line still shows that project's type in columns 5–8 (`.preview-meta`), beside the switch, as before.
- **The About's facts** keep their columns (5–8 on desktop).
- **The work list stays hidden** while the About is open, so its links can't take focus.
- **Moving the pointer from the portrait to "About" during a peek:** the peek closes 100ms after the pointer leaves the portrait, then the click opens it again, now to stay.
- **Hybrid devices:** a mouse hovering the portrait while a tap- or switch-opened About shows no longer closes it on leaving. That was a small existing quirk, fixed by the `set()` change.
- **Very short desktop windows:** the flow layout scrolls, and the switch row stays above the About.

---

## 7. Acceptance checks

1. `npm run typecheck` and `npm run build` pass.
2. **Pixels:** against today's site at 1440 × 900 and 390 × 844, closed and open (frozen clock, reduced motion), only the switch row's box differs (§2). Every other element keeps its position and size. The new pages match `reference/*.webp`.
3. **Behaviour:** every row of the table in §3, with a mouse at 1440 × 900 and by touch at 390 × 844.
4. **Keyboard:**
   - Tab order is portrait, Work, About, Jobtrackr.
   - At 1440, Enter on "About" opens it with focus staying on "About", and Space on "Work" closes it with focus on "Work".
   - At 768 × 1024, Enter on "About" moves focus to the About's "Work", and Enter there closes it with focus on the list's "About". Check this with reduced motion on as well as off.
5. **Flow layout:** the table in §3 holds at those window sizes, and the switch row is visible above the About in every desktop case.
6. **Overflow:** no horizontal scroll from 320 to 2560, closed and open.
7. **Case studies:** all five are pixel-identical; nothing they use changed.

---

## 8. Docs

Update the About bullet in **CLAUDE.md** ("What this is"). After its first sentence about `.page.is-about-open`, add:

- **Work / About:** the "Work" label over the list is a two-word switch, "Work" and "About" (`.index__switch`, `[data-about-show]`): the lit word is what the stage shows, as in the case studies' reading switch.
  - "About" opens the About until "Work", Escape or the portrait closes it.
  - The portrait's hover peek and tap toggle are unchanged.
  - On desktop the row stays on the "Work" line in both states; below desktop the About brings its own row (`.about__switch`).
  - On desktop the flow fallback also triggers when the statement would reach the row or the About would rise past the list's first line.
  - Spec: `docs/handoff/about-switch/README.md`.

In the Accessibility bullets, add "the Work / About words keep `aria-pressed` in step".

In **`docs/handoff/about/README.md`**, add one line at the top: "Update, 14 October 2026: the Work / About switch adds a visible way in; see `docs/handoff/about-switch/README.md`."
