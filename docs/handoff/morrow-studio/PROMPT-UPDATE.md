Update the Morrow Studio case study (`src/work/morrow-studio.html`, served at /work/morrow-studio) in this repo (Portfolio V2.1: plain HTML, SCSS and TypeScript, no framework). The page is already built and matches its first reference. This update rewrites the Sanity part of the page and swaps the home preview image. The result must be pixel-perfect to the updated reference.

Read these first:
1. `docs/handoff/morrow-studio/README.md`: the "Update 1" note at the top, then §2 (files to delete), §3 (optical modifiers), §5.7 The CMS, §5.8 Editing, §5.9 Preview, §6, §7, §10, §11 and the new bullets at the end of §12. The rest of the README is unchanged from the first build.
2. `docs/handoff/morrow-studio/reference/desktop.html` (1440 wide) and `mobile.html` (390 wide). These are the pixel targets and the source of every new string, alt and caption. Take them verbatim.
3. CLAUDE.md, and in particular "Running the screenshot diff". The desktop page is now about 17,727px tall, so its diff needs two captures, as JobTrackr's does.

Current page, from "The CMS" to "Preview":
- The CMS: two paragraphs, a laptop render (`studio-laptop-*.webp`), a pair of 700px crops in medium plates (`studio-home-700.webp`, `studio-about-700.webp`), then the "In the schema" / "In the Studio" lists.
- Preview: two paragraphs and the four-row `.case-list`.

What the page needs:
1. **The CMS:** keep the label, heading and first paragraph. Replace the second paragraph with the reference's. Replace the laptop figure with one full-width `.case-figure.case-figure--snug` holding an art-directed `<picture>`. Build it exactly like this page's QA sheet: a `<source media="(min-width: 1024px)">` for `studio-projects-1366.webp` (1366×768), and a plain `img.case-media` with no ratio class for `studio-projects-mobile.webp` (642×632). Give the source and the img their own `width` and `height`. Each file is the only size there is, so `srcset` is just the one URL, with no `sizes`. Put both captions in the figcaption with `.case-from-desktop` and `.case-below-desktop`. Use one alt. No plate. Remove the old pair from the page, and move the lists to Editing.
2. **Editing**, a new section straight after The CMS. Use `<section class="case-section" aria-labelledby="editing-heading">` at the default gap. Its parts, in order:
   - `.case-text`: the label "Editing" (`.case-label--stem`), the heading "Organised like the site, in the editors' words." (`.case-h--round`, `id="editing-heading"`), and two paragraphs.
   - A full-width figure built like item 1, with `studio-home-1366.webp` from 1024px and `studio-home-mobile.webp` (640×552) below. It has one caption.
   - A pair, `.case-compare.case-compare--stack`. Each item is a `figure.case-compare__item` holding a plain `img.case-media` (640×512, no ratio class, no plate) and its figcaption: `studio-availability.webp`, then `studio-hero-image.webp`.
   - A full-width figure built like item 1, with `studio-about-1366.webp` from 1024px and `studio-about-mobile.webp` (640×552) below. It has one caption.
   - The `.case-lists` moved from The CMS, with the same markup and ids.
3. **Preview:** replace the second paragraph with the reference's. Nothing else in the section changes.
4. **Delete** these unused files and anything that still points at them:
   - `src/assets/images/case/morrow-studio/studio-laptop-1200.webp`
   - `studio-laptop-2400.webp`
   - `studio-home-700.webp`
   - `studio-about-700.webp`
   - the git-ignored `studio-laptop.png` in the same folder.
5. **Home preview:** `src/assets/images/projects/morrow-studio.webp` (1200×800) and `morrow-studio-480.webp` (480×320) have already been replaced in place, with the same names and sizes. Don't change any code for them. Check that the home list preview (at 1280, 1366, 1440 and 1920 wide), the mobile sheet and JobTrackr's footer thumb all show the new image, with the display and the phone whole.

Rules:
- The new images are already in `src/assets/images/case/morrow-studio/`. They are Oluwasogo's own Studio screenshots and 1:1 crops of them, final as delivered: don't regenerate, recompress, crop, retouch or upscale them, and don't put them in device mockups or plates.
- Use only existing `_case.scss` classes, as mapped in README §6. You shouldn't need new components, tokens, section-gap entries or SCSS changes. If you do touch shared SCSS, it must not move anything on the other four case studies, so re-run their pixel diffs.
- Don't change any copy, sections or media outside The CMS, Editing and Preview. Don't add claims or metrics, and don't refactor unrelated code. Keep the existing architecture and class names. Don't copy the reference's inline styles.
- Keep the design rules: no borders or rules, no numbering, no italics. Every label, heading and list-item line keeps its optical modifier (README §3; the reference's `margin-left` values are the authority).
- Never size anything with `100vw`. There must be no horizontal scroll at any width, including with classic scrollbars.
- Edge cases:
  - Tablets (600 to 1023px) use the mobile layout and the mobile crops.
  - All three Studio pictures switch source at 1024px.
  - The pair is two columns from 1024px and stacked 40px apart below, capped at `$measure` on tablets as `.case-compare` already is.
  - Between 1024 and 1439px, and above 1440px, the full screenshots simply scale with the column.

Before handing back:
- Run `npm run typecheck` and `npm run build`.
- Run the README §11 checks:
  - the screenshot diff against the updated reference at 1440×900 (in two captures) and at 390×844, with reduced motion;
  - the no-horizontal-overflow sweep with real scrollbars;
  - keyboard order, reduced motion and linking (the chain is unchanged);
  - check 9, which is specific to this update.
- Update the Morrow Studio notes in CLAUDE.md and README.md where they describe this page's sections and media.
- Summarise the files changed and the key decisions. Don't commit or push; I'll do that myself.
