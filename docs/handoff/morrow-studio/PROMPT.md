Implement the Morrow Studio case study page in this repo (Portfolio V2.1: plain HTML, SCSS and TypeScript, no framework, deployed on Vercel), and link it in as the second project. It must be pixel-perfect.

Read these first, in this order:
1. CLAUDE.md, for the stack, design rules and conventions, and the "Case studies" section on how JobTrackr, Acetrail, Artifacts and Now Playing were built (including how to run the screenshot diff). They all still apply.
2. docs/handoff/morrow-studio/README.md, the full spec: files, section gaps, the section-by-section layout, the reuse map, media, linking, `<head>`, responsive rules and acceptance checks.
3. docs/handoff/morrow-studio/reference/desktop.html (1440 wide) and mobile.html (390 wide). These are the pixel targets and the source of the final copy. Open them in a browser; they load the font and assets from src/assets.
4. The built Now Playing page (src/work/now-playing.html) and the shared src/scss/_case.scss and src/ts/media.ts. This page reuses their shell and classes.

What to build:
- src/work/morrow-studio.html, served at /work/morrow-studio, built only with the existing `_case.scss` classes, as mapped in README §6: the hero picture, the full-width video without a plate, the still pairs in medium plates (16:10 and 4:3), the full-width photos, the side figures (a video in a medium plate, and a square video without one), `.case-lists` three times, the `.case-list`, scores without vitals, the art-directed QA sheet with its two captions, process, stack, outcome and footer. There are no new components, tokens or section-gap entries, so `_case.scss` shouldn't need to change. Don't copy the reference's inline styles.
- The linking in README §8, in the same change as the page:
  - Add the Morrow Studio entry to projects.ts as the second project, exactly as written in README §8.1.
  - JobTrackr's footer "Next project" becomes Morrow Studio, linking to /work/morrow-studio in the same tab, with the morrow-studio-480.webp thumb (480 × 320), built like Artifacts' footer link to Now Playing (`.case-display--stem` and `--balance`, the thumb and "Morrow" in `.case-nowrap`).
  - The Morrow Studio footer's "Acetrail" links to /work/acetrail in the same tab.
  - All That Is Kim stays as it is on the home page. Change nothing else there.

Rules:
- The assets are already in src/assets/images/case/morrow-studio, src/assets/video/morrow-studio and src/assets/images/projects. Don't regenerate, recompress, re-crop or re-cut them. The two Studio crops exist at one width only (700px); use them as they are.
- media.ts needs no changes. Use the standard video markup and toggle for all three videos.
- Don't change copy, add sections, add claims or metrics, or refactor unrelated code. Keep the existing architecture and class names. The migration and QA numbers come from the Morrow repo's reports; keep them exactly as written.
- Keep the design rules: no borders or rules, no numbering, no italics. Apply the optical left-alignment modifiers to every display, subtitle, heading, statement, list-item and label line (README §3; the reference's `margin-left` values are the authority).
- Never size anything with 100vw. There must be no horizontal scroll at any width, including with classic scrollbars.
- If you do touch shared SCSS, it must not move anything on the other four case studies.
- Edge cases: tablet widths (600 to 1023px) use the mobile layout with the `$measure` guard; the hero and QA pictures switch source at 1024px; desktop widths from 1024 to 1439px and above 1440px follow README §10.

Before handing back:
- Run npm run typecheck and npm run build.
- Run every acceptance check in README §11, including:
  - the screenshot diff against the reference at 1440×900 and 390×844, with reduced motion (the desktop page is under 16384px, so one capture works);
  - the no-horizontal-overflow sweep with real scrollbars;
  - keyboard, reduced-motion and linking behaviour, including the full chain JobTrackr → Morrow Studio → Acetrail → Artifacts → Now Playing → JobTrackr.
- Update README.md and CLAUDE.md.
- Summarise the files changed and the key decisions. Don't commit or push; I'll do that myself.
