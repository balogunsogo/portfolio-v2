Implement the Artifacts case study page in this repo (Portfolio V2.1: plain HTML, SCSS and TypeScript, no framework, deployed on Vercel), and link it into the case-study chain. It must be pixel-perfect.

Read these first, in this order:
1. CLAUDE.md, for the stack, design rules and conventions, and the "Case studies" section on how JobTrackr and Acetrail were built (including how to run the screenshot diff). They all still apply.
2. docs/handoff/artifacts/README.md, the full spec: files, section gaps, the section-by-section layout, the new components, media, linking, `<head>`, responsive rules and acceptance checks.
3. docs/handoff/artifacts/reference/desktop.html (1440 wide) and mobile.html (390 wide). These are the pixel targets and the source of the final copy. Open them in a browser; they load fonts and assets from src/assets.
4. The built Acetrail page (src/work/acetrail.html) and the shared src/scss/_case.scss and src/ts/media.ts. This page reuses their shell and classes.

What to build:
- src/work/artifacts.html, served at /work/artifacts, built with the existing `_case.scss` classes plus the components in README §6: the collection table (`.case-index`), the photo pair (`.case-compare--stack` with `.case-media--landscape`), the palettes (`.case-palettes`), the timing chart with per-row fill positions, and the phone pair (`.case-compare--phones`). Don't copy the reference's inline styles.
- The section-gap entries in README §4.
- The linking in README §8, in the same change as the page:
  - Artifacts gets `caseStudy: '/work/artifacts'` in projects.ts.
  - Acetrail's footer "Next project" becomes "Artifacts", linking to /work/artifacts in the same tab (its reference is already updated).
  - The Artifacts footer links to Now Playing's live site in a new tab.
  - All That Is Kim stays as it is on the home page. Change nothing else there.

Rules:
- The assets are already in src/assets/images/case/artifacts and src/assets/video/artifacts. Don't regenerate, recompress or re-cut them.
- media.ts needs no changes. Use the standard video markup and toggle for all seven videos.
- Don't change copy, add sections, add claims or metrics, or refactor unrelated code. Keep the existing architecture and class names. The Performance numbers and the palette values are measurements; keep them exactly as written.
- Keep the design rules: no borders or rules, no numbering beyond the artifacts' own IDs, no italics. Apply the optical left-alignment modifiers to every display, subtitle, heading, statement, list-item and label line (README §3).
- Never size anything with 100vw. There must be no horizontal scroll at any width, including with classic scrollbars.
- Shared SCSS changes must not move anything on the JobTrackr or Acetrail pages. Acetrail's timing chart must keep its fill positions exactly.
- Edge cases: tablet widths (600 to 1023px) use the mobile layout with the `$measure` guard; desktop widths from 1024 to 1439px and above 1440px follow README §6 and §10.

Before handing back:
- Run npm run typecheck and npm run build.
- Run every acceptance check in README §11, including:
  - the screenshot diff against the reference at 1440×900 and 390×844, with reduced motion, captured in slices for the tall desktop page;
  - the same diff for JobTrackr and Acetrail against their own references, to show they haven't moved (Acetrail's footer now reads "Artifacts");
  - the no-horizontal-overflow sweep with real scrollbars;
  - keyboard, reduced-motion and linking behaviour.
- Update README.md and CLAUDE.md.
- Summarise the files changed and the key decisions. Don't commit or push; I'll do that myself.
