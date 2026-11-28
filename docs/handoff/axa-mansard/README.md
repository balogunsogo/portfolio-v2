# AXA Mansard: implementation handoff

Build the AXA Mansard experience page as a case study, add AXA Mansard to the top of the home page's Work list, and link it into the case-study chain. The design, copy and demos are approved on the design canvas ("AXA Mansard" page).

- **URL:** `/work/axa-mansard`
- **Pixel targets:** `reference/desktop.html` at **1440 × 900** and `reference/mobile.html` at **390 × 844** (Full story, every demo in its default state).
- **Reading mode (TL;DR):** works with the existing rules in `docs/handoff/tldr/README.md`. Targets: `reference/tldr-desktop.webp` and `reference/tldr-mobile.webp`.
- **Starting point:** the five live case studies (`src/work/*.html`, `src/scss/_case.scss`, `src/ts/media.ts`, `src/ts/tldr.ts`, `src/ts/section-nav.ts`). The page uses that shell and its classes, plus a few new components (§5) and three interactive demos (§6).
- **Stack and rules:** unchanged (`CLAUDE.md`). Plain HTML, SCSS and TypeScript; no new dependencies, no new fonts, no framework.

---

## 1. Sources of truth

| Priority | File | What it settles |
|---|---|---|
| 1 | `reference/desktop.html`, `reference/mobile.html` | Exact appearance at 1440 and 390, the final copy and the markup structure. Open them in a browser; they load the font and images from `src/assets`. Their styles are flattened for one width; build with classes and real media queries. |
| 2 | `reference/desktop-1..3.webp`, `reference/mobile-1..4.webp` | Full-page screenshots of the two references, with reduced motion. |
| 3 | `reference/axa-mansard.reference.css` | The new components' CSS with its media queries, as approved. Port it to SCSS (§5) and keep every value. |
| 4 | `reference/demos.reference.js`, `reference/demo-templates.html` | The demos' rules and view models, and their markup structure (§6). |
| 5 | `reference/tldr-*.webp`, `reference/home-*.webp`, `reference/demo-states.webp` | TL;DR mode, the home page states, and key demo states. |
| 6 | This README | Files, behaviour between and beyond the two widths, demos, linking, `<head>` and acceptance checks. |
| 7 | `CLAUDE.md` and the other case-study handoffs | Every shared rule this README doesn't repeat. |

If the reference and this README disagree: the reference wins on **appearance at 1440 and 390**; this README wins on **behaviour**. On the canvas the page is split into five artboards per layout; the real page is one continuous page.

---

## 2. Files

**Create**

- `src/work/axa-mansard.html`. Copy the shell of `now-playing.html`: the `<head>` pattern (§9), `.case`, `.case-top` with the reading switch, `<main class="case__main">`, and `.case-foot` with the clock and links. Load the page module after `main.js`: `<script type="module" src="/assets/js/work/axa-mansard/main.js"></script>`.
- `src/scss/work/_axa-mansard.scss`, added to `main.scss` after `case` (`@use 'work/axa-mansard';`).
- `src/ts/work/axa-mansard/main.ts` plus one module per demo (`translator.ts`, `settlement.ts`, `turnaround.ts`). Loaded only by this page; `main.ts` initialises each demo only when its data hook exists.

**Already in place** (final; don't regenerate, recompress or re-cut):

- `src/assets/images/case/axa-mansard/profile-qr.webp`: the QR code for my public profile, supplied by me. A lossless WebP of `source/profile-qr.png`, pixel-identical (PNGs under `images/` are source-only and never deploy). It decodes to the profile URL in §6.4.
- `src/assets/images/case/axa-mansard/og.jpg`: share image, 1200 × 630.
- `src/assets/images/projects/axa-mansard.webp` (1200 × 800) and `axa-mansard-480.webp` (480 × 320): the home preview and footer thumbnail. The official AXA logo from axamansard.com (`source/axa-logo-200.png`) at its native size, centred on `#ECEBE6`. The logo itself isn't resized, recoloured or redrawn in the 1200 file.
- The portrait in the profile card reuses `src/assets/images/portrait/portrait-480.webp` (the same photo as the public profile).

**Modify**

- `src/ts/projects.ts`: AXA Mansard as the first project (§7).
- `src/work/now-playing.html`: footer link only (§8).
- `src/scss/_tokens.scss`: add `$axa-fill-light: #b4b1a9;` (the matrix's "extended" cell, the turnaround clock's elapsed fill and ignored-event marks, the demo slider track).
- `README.md` and `CLAUDE.md`: document the sixth case study, the new design-rule exception (§5.4), the new chain (§8) and an "AXA Mansard only" list.

**Not expected to change:** `_case.scss`, `media.ts`, `tldr.ts`, `section-nav.ts`, the home page layout and styles, and every other page apart from Now Playing's footer link. If you do touch `_case.scss`, re-run all five case-study pixel diffs.

---

## 3. Accuracy and confidentiality

- **The copy is final.** It describes real work at a real employer and was checked line by line against my own records. Don't reword, shorten, add or "improve" any sentence, heading, label, caption, demo string or status message. Don't add claims, metrics, outcomes, testimonials or technologies.
- **Demos and diagrams use fictional data.** Every product code, field name, reference ID, name, account and amount in the three demos is invented. Don't replace them with anything realistic, and don't add internal system names, endpoints, schemas or business rules.
- **Real items, used as given:** the AXA logo (home preview only), my public profile details (name, title, company, email), the profile URL and the QR code. Don't edit, crop, recolour or regenerate the logo or the QR.
- **No AXA branding on the case page itself.** No AXA colours, logo or typeface on `/work/axa-mansard`.
- **This repo is public.** Don't add any other AXA material to it (internal notes, screenshots, documents).

---

## 4. Page structure

Sections in order, as in the references. Every heading listed carries `data-toc` (six entries in the section nav); the footer carries `data-toc-end`.

| # | Section | Label / heading (modifiers) | Contents |
|---|---|---|---|
| 0 | Hero `.case-hero` | Display "AXA Mansard" (none); subtitle "Enterprise software engineering and systems integration." `.case-subtitle--stem` | `.case-meta` with Role, Years, Domain, Scope (`.case-break` as in the reference), then the contribution matrix figure (§5.1) with its caption. |
| 1 | Context `.case-section` | "Context" `--round` / "From frontend features to systems integration." `--stem` | Two paragraphs. |
| 2 | Applications `.case-section--rules` | "Applications" (none) / "Enterprise application development." `--stem` | Three paragraphs, the two-requests timing chart (existing `.case-timing` in `.case-cols__span-5-12`, fills positioned with `--from` / `--width`), then a `.case-list` with three items: "Hybrid sales app" `.case-item--stem`, "Marine administration" `--stem`, "Core policy application" `--round`. |
| 3 | Profiles `.case-section` | "Profiles" `--stem` / "Digital employee profiles." `--stem` | Two paragraphs and the profile figure (§5.2). |
| 4 | Integration `.case-section` | "Integration" `--stem` / "Connecting a modern platform to a legacy core." `--round` | Two paragraphs, the Request translator (§6.1), then two paragraphs in `.case-cols > .case-copy.case-cols__span-7-11`. |
| 5 | Claims `.case-section` | "Claims" `--round` / "Claims settlement and turnaround time." `--round` | Two paragraphs, Settlement allocation (§6.2), two paragraphs (as in 4), the Turnaround clock (§6.3), one paragraph, then `.case-process` with five steps (arrows on the first four). |
| 6 | Stack `.case-section--stack` | "Stack" `--s` / "Tools and technologies." `--t` | `.case-stack` with four groups (labels "Frontend", "Backend", "Data", "Engineering practices", all `--stem`), then the disclaimer as `.case-caption` in `.case-cols__span-1-6`. |
| | Footer `.case-foot` | "Next project" `--stem` | "JobTrackr" `.case-display--j` with the JobTrackr thumbnail, linking to `/work/jobtrackr`. |

There is no Outcome section on this page.

---

## 5. New components

All in `src/scss/work/_axa-mansard.scss`, ported from `reference/axa-mansard.reference.css`. Fluid sizes and grids follow the same 12-column, 1024px breakpoint rules as `_case.scss`.

### 5.1 Contribution matrix (hero figure)

- A `.case-plate.axa-map` with `role="img"` and the full `aria-label` from the reference; everything inside is `aria-hidden`.
- Six rows (systems) by five columns (Frontend, Workflows, Backend, Data, Integration). Each row is the system name plus five **separate** cells: `.axa-map__cell` on ground, `.is-on` in ink (contributed), `.is-light` in `$axa-fill-light` (extended existing code). Cells have gaps (4px below desktop, 8px from desktop) so they read as discrete areas, not progress bars.
- Desktop: names in columns 1–4 at the list-item size, cells in columns 5–12, 22px tall. Mobile: name above its row of cells, 16px tall, column labels at 12px.
- Below the rows: the key ("Contributed", "Extended existing code") and the note "" Both align with the cells on desktop.
- The figcaption (confidentiality line) stays outside the plate.

### 5.2 Profile figure

- A `.case-plate.axa-card-plate`: the reconstructed card (columns 2–5 on desktop) and the request-order steps (columns 7–11). Stacked below desktop.
- The card shows real public profile details as **real text** (not `aria-hidden`): portrait, name, title, then Company and Email with each label above its value.
- The QR image is a link to the profile (`target="_blank" rel="noopener"`, alt "QR code for my public AXA Mansard profile", visually hidden "(opens in a new tab)"). Below it, a text link "Open my public profile" to the same URL. QR width 176px on desktop and 160px below; keep its white quiet zone (don't crop the image).
- The steps use `.axa-seq`: "Order of requests" label, three steps with ↓ between, and the note.

### 5.3 Demo shell (shared by all three)

`figure.case-figure.axa-demo` containing `.axa-demo__plate` (the plate colour, 16px padding below desktop, 40 / 48 / 36px from desktop), a bar with the title, the "Reconstruction, fictional data" tag and Reset, the demo body, and the "Try an edge case" row of buttons on ground-coloured fills. The figcaption sits outside the plate.

### 5.4 Design-rule exception (add to CLAUDE.md)

Seventh exception: **inside the AXA Mansard demos only**, form controls are drawn as ground-coloured fields without borders, an invalid field gets a 2px ink underline (`box-shadow: inset 0 -2px 0`), the turnaround slider has a 2px track with a square thumb, and status lines start with an 8px square (filled when held, outlined when OK). Checkboxes use `accent-color` ink. No other rules or borders are introduced.

---

## 6. The demos

Implement each demo in TypeScript from `reference/demos.reference.js` (the rules) and `reference/demo-templates.html` (the markup). In the templates, `{{ … }}` values come from the demo's view model (`trVals`, `stVals`, `ttVals`), `<sc-for>` repeats and `<sc-if>` branches. Render with DOM APIs and `textContent` (never `innerHTML` with input values), select elements with `data-axa-*` hooks, and keep the approved classes.

Shared behaviour:

- **Server-rendered default state.** The HTML ships each demo already in its default state (as in the references), with its controls `disabled`. The module enables them on init. Without JS the default state stays readable.
- **Nothing leaves the page.** No requests, storage, cookies or analytics events.
- **Status lines** are `role="status"`. Inputs have labels and `aria-invalid`; option buttons use `aria-pressed`.
- **Edge-case buttons** set the scenario and keep focus on themselves. **Reset** restores the default state and keeps focus on Reset.
- **Timers:** Reset, scrubbing and `pagehide` clear the turnaround timer; a persisted `pageshow` resets the demo.
- **Reduced motion:** no transitions; Play jumps straight to day 14.
- Height may change with content (rows added, errors shown); nothing else on the page should move sideways.

### 6.1 Request translator

Three columns on desktop with → between them (stacked with ↓ below desktop): "The platform sends" (product options and fields), "The service checks" (one check per value) and "The core receives" (the translated record and status).

- **Products:** Motor (Colour, Body type), Engineering (Risk category, Equipment colour, which shares Motor's colour table) and Term life (Occupation, plus beneficiaries and shares: add up to 5, remove any).
- **Lookup:** exact match after trimming and ignoring case. A name marked as recently added is found after one reload. Duplicate matches resolve to the lowest ID. No match, or an empty value, holds the request and never sends a default ID.
- **Beneficiaries:** names required, whole-number shares adding up to 100, at most 3 fixed slots in the core record (empty slots read "Empty").
- **Record:** `PRODUCT_CODE` and one key per field; held values read "Held".

### 6.2 Settlement allocation

- Money is whole kobo and shares are basis points. The amount accepts up to 9 digits with commas and up to 2 decimals.
- Amounts are the floor of each share, and leftover kobo go to the largest remainders (ties to the earlier row) when shares add up to exactly 100%.
- **Paid rows** keep their recorded amount. Rounding only moves among unpaid rows, and once anything is paid the settlement amount and "Split equally" lock.
- **Validation order:** invalid amount, invalid share, missing account digits, duplicate account, then under or over 100%.
- "Mark paid" only works when the allocation reconciles.
- **Rows:** the default beneficiary can't be removed. Removal is soft ("Removed, kept on record", with Restore). Add up to 4 active beneficiaries.

### 6.3 Turnaround clock

- Ten synthetic events over 14 days. Three are fixed (day 0 registered, day 2 documents complete, day 12 settled); the other seven can be switched on and off.
- **Rules:** the clock starts on complete documents, pauses on a request and resumes on a receipt. Anything else is recorded as ignored with its reason ("already paused", "the clock hasn't started", "nothing outstanding", "the claim is closed").
- The intervals give Active, Paused and Elapsed time up to the viewed day.
- **State line:** the dt reads "Viewing day N" and the dd reads "Running since day N", "Paused since day N", "Stopped on day 12" or "Not started". These must not be confused: at day 14 the clock reads "Stopped on day 12".
- **Chart:** event marks (ignored ones in the light fill), an Elapsed lane and an Active lane that fill up to the viewed day, a day axis and a "now" line.
- **Controls:** a range input (0 to 14, step 0.5, `aria-valuetext` "Day N") and a Play / Pause button (0.25 days every 70ms).

### 6.4 Expected strings (acceptance)

| Action | Status |
|---|---|
| Translator default | "Ready to send. 3 values translated." |
| A typo | "Held. 1 problem to fix before sending." (check: "No match after one reload. Held, with no default ID.") |
| A duplicate name | check: "2 matches. Using the lowest ID · C-0107 (motor’s colour table)" |
| A newly added value | check: "Not cached. Found after one reload · C-0391" |
| Four beneficiaries | check: "4 beneficiaries, but the core has 3 slots. Held." |
| Settlement default | "Reconciled, with no rounding left over." |
| An awkward amount | "Reconciled. 2 kobo of rounding went to Tunde and Ngozi, the largest remainders." |
| Three equal shares | "Reconciled. 1 kobo of rounding went to Adaeze, the largest remainder." |
| The same account twice | "Two beneficiaries use the account ending 4821. An account can only be paid once." |
| Clock default | Active 6 days · Paused 4 days · Elapsed 10 days · "Stopped on day 12" |

Profile link and QR target: `https://online.axamansard.com/digitalprofiles.web/profiles/f11063bb-c4b3-4f7d-8a10-0b579c0ae9ba`

---

## 7. Home page

Data only; no layout or style changes. Add as the **first** entry in `projects.ts`:

```ts
{
  title: 'AXA Mansard',
  meta: 'Enterprise · Software engineering',
  description: 'Software engineering for insurance and financial services, across enterprise applications, backend services and systems integration.',
  role: 'I joined in 2023 and am now an Intermediate Software Engineer.',
  image: 'assets/images/projects/axa-mansard.webp',
  href: '/work/axa-mansard',
  caseStudy: '/work/axa-mansard',
  previewTone: '#ECEBE6',
  previewInk: '#3F423F',
},
```

The title starts on A, so there's no stem modifier. The list now has seven items. At 390 × 844 the clock and links sit just below the fold and the page scrolls, as short viewports already do. Targets: `reference/home-desktop-hover.webp`, `home-mobile.webp` and `home-mobile-sheet.webp` (the sheet reads "Read case study" and "Next: Jobtrackr"). Don't change the About text.

---

## 8. Linking

- **Chain:** AXA Mansard → JobTrackr → Morrow Studio → Acetrail → Artifacts → Now Playing → AXA Mansard. All in the same tab, with no `target`, `rel` or hidden suffix.
- Now Playing's footer link becomes "AXA Mansard" to `/work/axa-mansard`, with `axa-mansard-480.webp` as its thumbnail and `.case-display` (no glyph modifier).
- The AXA Mansard footer links to JobTrackr exactly as Now Playing's does today.

---

## 9. `<head>`

As on the other case studies:

- **Title:** "AXA Mansard — Balogun Oluwasogo".
- **Description:** "Enterprise software engineering and systems integration at AXA Mansard: enterprise applications, digital employee profiles, a legacy core integration and claims settlement."
- **Canonical and `og:url`:** `https://www.balogunoluwasogo.com/work/axa-mansard`.
- **Open Graph and Twitter:** `og:type` article, with `og:image` and `twitter:image` set to `/assets/images/case/axa-mansard/og.jpg` (1200 × 630).
- **Other tags:** the TL;DR head script, `main.css`, `main.js` and the page module.

The build adds the Google tag and the sitemap entry.

---

## 10. Responsive behaviour, TL;DR and section nav

- **Below 1024px:** one column, as in `mobile.html`. Tablets (600–1023px) use the mobile layout; text follows the existing `$measure` guard and the plates span the full width.
- **From 1024px:** the 12-column grid. The three demo columns, the matrix and the card layout scale with the grid between 1024 and 2560px. Check 1024, 1280 and 1920px for wrapping in the translator columns and the settlement rows.
- Never size anything with `100vw`; no horizontal scroll from 320 to 2560px with classic scrollbars.
- **TL;DR:** no rule changes. All the figures (matrix, profile, three demos) count as media, so TL;DR shows the hero, those figures without captions, the Stack section with its disclaimer, and the footer.
- **Section nav:** six entries (Context, Enterprise application development, Digital employee profiles, Connecting…, Claims…, Tools…). Hidden below 1024px and in TL;DR, as everywhere.

---

## 11. Acceptance checks

1. `npm run typecheck` and `npm run build` pass.
2. **Screenshot diffs** against `reference/desktop.html` at 1440 × 900 and `reference/mobile.html` at 390 × 844, with reduced motion, fonts loaded and a pinned clock. Both pages are under 16384px, so one capture each works. Demos in their default state.
3. **TL;DR** matches `tldr-desktop.webp` and `tldr-mobile.webp`, and the Full story stays pixel-identical after switching back.
4. **Home:** hover and focus on AXA Mansard show the preview, meta and description as in `home-desktop-hover.webp`. The mobile sheet matches `home-mobile-sheet.webp`. The other six projects are unchanged.
5. **Demos:**
   - Every edge-case button and Reset gives the strings in §6.4.
   - The keyboard reaches every control in order, with focus visible.
   - Reduced motion removes transitions and Play jumps to day 14.
   - There are no network requests or storage writes from the demos.
6. **QR and link:** the QR decodes to the URL in §6.4, and both the QR and the text link open it in a new tab.
7. **No horizontal overflow** from 320 to 2560px, with classic scrollbars.
8. **Chain:** the loop in §8 works end to end, and the section nav lists the six sections.
9. **Other pages:** the other five case studies are pixel-identical if `_case.scss` changed. It shouldn't need to.
