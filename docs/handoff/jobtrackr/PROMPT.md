Implement the JobTrackr case study page in this repo (Portfolio V2.1: plain HTML, SCSS and TypeScript, no framework, deployed on Vercel). It must be pixel-perfect.

Read these first, in this order:
1. CLAUDE.md, for the stack, design rules and conventions. They still apply.
2. docs/handoff/jobtrackr/README.md, the full spec: files, tokens, type scale, section-by-section layout, media, video behaviour, diagrams, home integration, `<head>`, responsive rules and acceptance checks.
3. docs/handoff/jobtrackr/reference/desktop.html (1440 wide) and mobile.html (390 wide). These are the pixel targets and the source of the final copy. Open them in a browser; they load fonts and assets from src/assets.

What to build:
- src/work/jobtrackr.html, served at /work/jobtrackr, built with SCSS classes in a new src/scss/_case.scss, not the reference's inline styles.
- src/ts/media.ts for video play and pause: in view only, respects reduced motion, keyboard pause toggle.
- The four diagrams inlined from docs/handoff/jobtrackr/diagrams/*.svg: the wide versions from 1280px up, the tall versions below.
- Build and dev-server changes so extra HTML pages and .mp4 files are copied and served (README §2).
- The home integration in README §10: the JobTrackr list link and the mobile sheet's "Read case study" go to the case study. Change nothing else on the home page.

Rules:
- The assets are already in src/assets/images/case/jobtrackr and src/assets/video/jobtrackr. Don't regenerate, recompress or re-cut them.
- Don't change copy, add sections, add claims, or refactor unrelated code. Keep the existing architecture and class names.
- Keep the design rules: no borders or rules (diagram connectors excepted), no numbering, no italics. Apply the optical left-alignment corrections listed in README §5.
- Never size anything with 100vw. There must be no horizontal scroll at any width, including with classic scrollbars.
- Edge cases: tablet widths (600 to 1023px) use the mobile layout with the text-width guard; desktop widths from 1024 to 1439px and above 1440px follow the clamps in README §4 and §12.

Before handing back:
- Run npm run typecheck and npm run build.
- Run every acceptance check in README §13, including:
  - the screenshot diff against the reference at 1440×900 and 390×844, with reduced motion;
  - the no-horizontal-overflow sweep with real scrollbars;
  - keyboard and reduced-motion behaviour.
- Update README.md and CLAUDE.md.
- Summarise the files changed and the key decisions. Don't commit or push; I'll do that myself.
