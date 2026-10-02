Implement the Now Playing case study page in this repo (Portfolio V2.1: plain HTML, SCSS and TypeScript, no framework, deployed on Vercel), and close the case-study chain. It must be pixel-perfect.

Read these first, in this order:
1. CLAUDE.md, for the stack, design rules and conventions, and the "Case studies" section on how JobTrackr, Acetrail and Artifacts were built (including how to run the screenshot diff). They all still apply.
2. docs/handoff/now-playing/README.md, the full spec: files, section gaps, the section-by-section layout, the reuse map, media, linking, `<head>`, responsive rules and acceptance checks.
3. docs/handoff/now-playing/reference/desktop.html (1440 wide) and mobile.html (390 wide). These are the pixel targets and the source of the final copy. Open them in a browser; they load fonts and assets from src/assets.
4. The built Artifacts page (src/work/artifacts.html) and the shared src/scss/_case.scss and src/ts/media.ts. This page reuses their shell and classes.

What to build:
- src/work/now-playing.html, served at /work/now-playing, built only with the existing `_case.scss` classes, as mapped in README §6: the hero picture, the photo pairs, the still pair in plates, the `.case-list`, the large and side video figures, the side photo, the phone pair, the Before / After lists, scores, process, stack, outcome and footer. There are no new components, tokens or section-gap entries, so `_case.scss` shouldn't need to change. Don't copy the reference's inline styles.
- The linking in README §8, in the same change as the page:
  - Now Playing gets `caseStudy: '/work/now-playing'` in projects.ts.
  - Artifacts' footer "Now Playing" links to /work/now-playing in the same tab (drop its target, rel and hidden suffix; the text and class stay).
  - The Now Playing footer's "JobTrackr" links to /work/jobtrackr in the same tab, which closes the chain.
  - All That Is Kim stays as it is on the home page. Change nothing else there.

Rules:
- The assets are already in src/assets/images/case/now-playing and src/assets/video/now-playing. Don't regenerate, recompress or re-cut them.
- media.ts needs no changes. Use the standard video markup and toggle for all four videos.
- Don't change copy, add sections, add claims or metrics, or refactor unrelated code. Keep the existing architecture and class names. The Performance numbers are a dated measurement; keep them exactly as written.
- Keep the design rules: no borders or rules, no numbering, no italics. Apply the optical left-alignment modifiers to every display, subtitle, heading, statement, list-item and label line (README §3).
- Never size anything with 100vw. There must be no horizontal scroll at any width, including with classic scrollbars.
- If you do touch shared SCSS, it must not move anything on the JobTrackr, Acetrail or Artifacts pages.
- Edge cases: tablet widths (600 to 1023px) use the mobile layout with the `$measure` guard; desktop widths from 1024 to 1439px and above 1440px follow README §10.

Before handing back:
- Run npm run typecheck and npm run build.
- Run every acceptance check in README §11, including:
  - the screenshot diff against the reference at 1440×900 and 390×844, with reduced motion (the desktop page is under 16384px, so one capture works);
  - the no-horizontal-overflow sweep with real scrollbars;
  - keyboard, reduced-motion and linking behaviour, including the full chain JobTrackr → Acetrail → Artifacts → Now Playing → JobTrackr.
- Update README.md and CLAUDE.md.
- Summarise the files changed and the key decisions. Don't commit or push; I'll do that myself.
