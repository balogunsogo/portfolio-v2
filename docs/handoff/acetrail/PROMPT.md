Implement the Acetrail case study page in this repo (Portfolio V2.1: plain HTML, SCSS and TypeScript, no framework, deployed on Vercel), and link the two case studies together. It must be pixel-perfect.

Read these first, in this order:
1. CLAUDE.md, for the stack, design rules and conventions, and the "Case study" section on how JobTrackr was built. They all still apply.
2. docs/handoff/acetrail/README.md, the full spec: files, tokens, section gaps, section-by-section layout, the five new components, media, linking, `<head>`, responsive rules and acceptance checks.
3. docs/handoff/acetrail/reference/desktop.html (1440 wide) and mobile.html (390 wide). These are the pixel targets and the source of the final copy. Open them in a browser; they load fonts and assets from src/assets.
4. The built JobTrackr page (src/work/jobtrackr.html, src/scss/_case.scss, src/ts/media.ts). This page reuses its shell and classes.

What to build:
- src/work/acetrail.html, served at /work/acetrail, built with the existing `_case.scss` classes plus the new components in README §6 (`.case-compare`, `.case-options`, `.case-system`, `.case-timing`, `.case-scores`). Don't copy the reference's inline styles.
- The tokens, Figtree `@font-face`, subtitle optical modifier, section-gap entries and caption-gap modifier in README §3 and §4.
- The linking in README §8, in the same change as the page:
  - Acetrail gets `caseStudy: '/work/acetrail'` in projects.ts.
  - JobTrackr's footer "Acetrail" link goes to /work/acetrail in the same tab.
  - Acetrail's footer links to All That Is Kim's live site in a new tab.
  - Change nothing else on the home page.

Rules:
- The assets are already in src/assets/images/case/acetrail, src/assets/video/acetrail and src/assets/fonts. Don't regenerate, recompress or re-cut them.
- media.ts needs no changes. Use the standard video markup and toggle for all five videos.
- Don't change copy, add sections, add claims or metrics, or refactor unrelated code. Keep the existing architecture and class names. The Performance numbers are a dated measurement; keep them exactly as written.
- Keep the design rules: no borders or rules, no numbering, no italics. Apply the optical left-alignment modifiers to every display, subtitle, heading, statement and label line (README §3).
- Never size anything with 100vw. There must be no horizontal scroll at any width, including with classic scrollbars.
- Shared SCSS changes must not move anything on the JobTrackr page.
- Edge cases: tablet widths (600 to 1023px) use the mobile layout with the `$measure` guard; desktop widths from 1024 to 1439px and above 1440px follow the clamps and notes in README §6 and §10.

Before handing back:
- Run npm run typecheck and npm run build.
- Run every acceptance check in README §11, including:
  - the screenshot diff against the reference at 1440×900 and 390×844, with reduced motion;
  - the same diff for JobTrackr against its own reference, to show it hasn't moved;
  - the no-horizontal-overflow sweep with real scrollbars;
  - keyboard, reduced-motion and linking behaviour.
- Update README.md and CLAUDE.md.
- Summarise the files changed and the key decisions. Don't commit or push; I'll do that myself.
