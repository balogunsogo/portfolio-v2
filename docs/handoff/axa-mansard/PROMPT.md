Implement the AXA Mansard case study in this repo (Portfolio V2.1: plain HTML, SCSS and TypeScript, no framework, deployed on Vercel), add it to the top of the home page's Work list, and link it into the case-study chain. Match the approved design pixel for pixel.

Read these first, in this order:
1. CLAUDE.md, for the stack, design rules and conventions, and the "Case studies" section on how the five existing case studies were built (including how to run the screenshot diff). All of it still applies.
2. docs/handoff/axa-mansard/README.md, the full spec: files, accuracy and confidentiality rules, page structure and optical modifiers, the new components, the three demos and their expected strings, home page data, linking, `<head>`, responsive rules and acceptance checks.
3. docs/handoff/axa-mansard/reference/desktop.html (1440 wide) and mobile.html (390 wide). These are the pixel targets and the source of the final copy. Open them in a browser; they load the font and images from src/assets.
4. docs/handoff/axa-mansard/reference/axa-mansard.reference.css (the new components' CSS, with media queries), demos.reference.js (the demos' rules and view models; it runs as is in Node) and demo-templates.html (the demos' markup structure).
5. The built Now Playing page (src/work/now-playing.html) and the shared src/scss/_case.scss. This page reuses their shell and classes.

What to build:
- src/work/axa-mansard.html at /work/axa-mansard, using the existing case-study classes plus the new components in README §5.
- src/scss/work/_axa-mansard.scss, ported from the reference CSS, with tokens and `@include desktop`. Add `$axa-fill-light` to _tokens.scss.
- src/ts/work/axa-mansard/main.ts with one module per demo (Request translator, Settlement allocation, Turnaround clock), loaded only by this page.
  - Port the rules from demos.reference.js to TypeScript.
  - Render with DOM APIs and textContent, and select elements with data-axa-* hooks.
  - Ship each demo's default state in the HTML with its controls disabled, and enable them on init.
- The home page entry in README §7 (first in projects.ts; data only).
- The linking in README §8: Now Playing's footer now goes to AXA Mansard, and AXA Mansard's footer goes to JobTrackr.

Rules:
- The copy, demo strings and data are final and were checked for accuracy and confidentiality. Don't reword, add or remove any text. Don't add claims, metrics or technologies. Keep the demos' data fictional, and don't add internal system names.
- The assets are already in src/assets/images/case/axa-mansard and src/assets/images/projects. Don't regenerate, recompress, crop or recolour them. The QR code and the AXA logo must stay exactly as supplied.
- Don't put AXA branding on the case page itself. Keep the disclaimer at the end of the Stack section. Don't add any other AXA material to this public repo.
- Keep the design rules: no borders or rules except the one new exception in README §5.4, no numbering, no italics. Apply the optical left-alignment modifiers listed in README §4.
- The demos send, store and record nothing. They must work with keyboard, touch and mouse, respect reduced motion and clear their timer on Reset, scrub and pagehide.
- Never size anything with 100vw. There must be no horizontal scroll from 320 to 2560px, including with classic scrollbars.
- No unrelated refactors. Keep the existing architecture and class names. If you touch _case.scss, it must not move anything on the other five case studies.
- Edge cases: tablet widths (600 to 1023px) use the mobile layout. Check 1024, 1280 and 1920px for wrapping in the translator columns and settlement rows. TL;DR and the section nav must work with no rule changes (README §10).

Before handing back:
- Run npm run typecheck and npm run build.
- Run every acceptance check in README §11, including:
  - the screenshot diffs at 1440×900 and 390×844 with reduced motion;
  - the TL;DR and home page references;
  - every demo string in §6.4;
  - the QR code decoding to the profile URL;
  - the overflow sweep;
  - the full chain AXA Mansard → JobTrackr → Morrow Studio → Acetrail → Artifacts → Now Playing → AXA Mansard.
- Update README.md and CLAUDE.md: the sixth case study, the design-rule exception, the chain, and an "AXA Mansard only" list.
- Summarise the files changed and the key decisions. Don't commit or push; I'll do that myself.
