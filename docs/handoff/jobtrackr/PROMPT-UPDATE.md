Update the JobTrackr case study (`src/work/jobtrackr.html`, served at /work/jobtrackr) in this repo (Portfolio V2.1: plain HTML, SCSS and TypeScript, no framework). The page is built and live. This update adds one new section, **Insights**, between Security and Stack, about the private analytics area that was just added to JobTrackr. The result must be pixel-perfect to the updated reference.

Read these first:
1. `docs/handoff/jobtrackr/README.md`: the "Update 1" note at the top, then §6 item 13 (Insights), the update-1 rows and bullets in §7, check 8 in §13, and the Insights facts in §14. The rest of the README is unchanged from the first build.
2. `docs/handoff/jobtrackr/insights.patch`, the reference implementation: the new section in `src/work/jobtrackr.html` plus the CLAUDE.md and README.md notes, made against this repo as it stood on 15 October 2026.
3. `docs/handoff/jobtrackr/reference/desktop.html` (1440 wide) and `mobile.html` (390 wide). They now include the section, between Security and Stack. They're the pixel targets and the source of every new string, alt, aria-label and caption: take them verbatim, but don't copy their inline styles.
4. CLAUDE.md, in particular "Case studies", "Running the screenshot diff" and "Reading mode (TL;DR)".

How the page is now:
- Security ends with its statement ("The interface is never the security boundary…"), and Stack (`section.case-section--stack`) follows straight after it.
- The page has three videos, in Applications, Authentication and Shipping.

What's required:
1. **A new `<section class="case-section" aria-labelledby="insights-heading">`** between Security and Stack, with no section modifier (the default 64px / 36px gap). Its parts, in this order:
   - `.case-text`: the label "Insights" (`.case-label--stem`), the `h2` "Only what the data can prove." (`.case-h--round`, `id="insights-heading"`), and two paragraphs in `.case-text__body.case-copy`.
   - A full-width `figure.case-figure`, no plate, holding the standard video markup (`<div class="case-video">`, the `<video … data-case-video>` with `.case-video__media--widescreen`, `muted loop playsinline preload="none"`, no `autoplay`, `width="1920" height="1080"`, `src="/assets/video/jobtrackr/insights.mp4"`, `poster="/assets/images/case/jobtrackr/insights-poster.webp"`, the reference's `aria-label`, then the `data-case-video-toggle` button), and its `figcaption.case-caption.case-figure__caption`. It's built like Morrow Studio's home video.
   - A `figure.case-figure.case-figure--pair`, built exactly like Applications' pair: the phone video (`.case-video__media--square`, `insights-phone.mp4`, `width="1080" height="1080"`, poster `insights-phone-poster.webp`, with its toggle), then `img.case-media.case-media--square` with `insights-phone-1200.webp 1200w, insights-phone-2000.webp 2000w`, `sizes="(min-width: 1024px) calc(50vw - 76px), calc(100vw - 40px)"`, `width="2000" height="2000"`, `loading="lazy" decoding="async"`, then the caption.
   - A `.case-block` with the label "Reporting rules" (`.case-label--stem`) and a five-row `dl.case-list`, marked up like Five areas. The `dt` modifiers are `.case-item--stem`, `--stem`, `--stem`, `--round` and none, in that order (README §6).
   - A `.case-split`, built exactly like Interviews: `img.case-media.case-media--photo.case-split__media` with `insights-laptop-1200.webp 1200w, insights-laptop-2064.webp 2064w`, `sizes="(min-width: 1024px) calc(66.67vw - 93px), calc(100vw - 40px)"`, `width="2064" height="1548"`, lazy and async; then `.case-block.case-block--note.case-split__side` with the label "Owner only" (`.case-label--round`) and one `p.case-body`.
2. **Nothing else changes.** Don't touch any other section, the copy, the media, `media.ts`, `tldr.ts` or `_case.scss`. Every class you need already exists, and the TL;DR rule already treats this section's figures and split as pictures and the note as text.
3. **Docs:** the patch adds a CLAUDE.md bullet for the section (under "Case studies"), notes that JobTrackr's mobile page now also needs a split capture, and extends JobTrackr's line in README.md. `docs/handoff/jobtrackr/README.md`, the references and the TL;DR references are already updated; don't edit them.

How to do it:
- **Apply the patch:** `git apply --check docs/handoff/jobtrackr/insights.patch`, then `git apply docs/handoff/jobtrackr/insights.patch`.
- **Line endings:** `src/work/jobtrackr.html` has CRLF line endings in the working tree, and the patch carries them; keep them. CLAUDE.md and README.md are LF.
- **If it doesn't apply** because the files have moved on, make the same changes by hand from README §6 item 13 and the reference. Don't change the strings, classes, attributes or order.

The new files are already in place, final as delivered (don't regenerate, recompress, crop or re-encode them):
- `src/assets/video/jobtrackr/insights.mp4` and `insights-phone.mp4`
- `src/assets/images/case/jobtrackr/insights-poster.webp`, `insights-phone-poster.webp`, `insights-phone-1200.webp`, `insights-phone-2000.webp`, `insights-laptop-1200.webp` and `insights-laptop-2064.webp`
- The updated references: `docs/handoff/jobtrackr/reference/*` and `docs/handoff/tldr/reference/jobtrackr-*.webp` plus the `jobtrackr` entry in its `blocks.json`.

Rules:
- Keep the existing architecture, class names and data hooks. No new components, tokens, section gaps, fonts or dependencies, and no refactoring of unrelated code.
- Design rules: no rules or borders, no numbering, no italics. Every label, heading and list-item line carries its optical modifier (the reference's `margin-left` values are the authority). Never size anything with `100vw`.
- Use the curly apostrophe (’) in the copy, as the rest of the page does, and `&amp;` for the ampersands.
- Every screen in the new media shows sample data. The first figure's caption says so; keep it exactly as written.

Edge cases:
- Below 1024px everything is one column: the 16:9 video, then the phone video, the phone still and the caption (12px apart), the list, then the laptop still and the note (the split steps aside with `display: contents`). Tablets use this layout.
- From 1024px: the phone video and still are columns 1–6 and 7–12, the list names sit in columns 1–4 and their text in 5–10, and the laptop still is columns 1–8 with the note in 9–12, aligned to its bottom. The list names may wrap to two lines between 1024 and about 1200px, as Defence in depth's do.
- No horizontal scroll from 320 to 2560px, with classic scrollbars.
- With reduced motion neither new video starts on its own. A video someone paused stays paused.
- In TL;DR mode, Insights keeps its two figures (no captions) and the laptop still (no note); the text block and the list hide.

Before handing back:
1. Run `npm run typecheck` and `npm run build`.
2. Run README §13, including check 8:
   - the screenshot diff against the updated references at 1440 × 900 and 390 × 844 with reduced motion. Both pages are now too tall for one capture, so take the lower part separately from a fresh page load, and serve the largest image to both sides (CLAUDE.md);
   - the overflow sweep with real scrollbars;
   - keyboard order (the two new toggles come after Authentication's and before Shipping's);
   - motion, and TL;DR against the regenerated `blocks.json`;
   - the full story of the other four case studies must be untouched (you shouldn't have changed anything they use).
3. Summarise the files changed, the checks you ran with their results, and any difference from the reference and why. Don't commit or push; I'll do that myself.
