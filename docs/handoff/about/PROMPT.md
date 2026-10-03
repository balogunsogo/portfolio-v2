Add the About to the home page of this repo (Portfolio V2.1: plain HTML, SCSS and TypeScript, no framework, deployed on Vercel). A portrait sits inside the name. Hovering it on desktop, or tapping it on touch, swaps the role line for a statement and the work list for the About; leaving it, or tapping again, puts the home page back. It must match the reference to the pixel.

Read these first, in this order:
1. CLAUDE.md: the stack, the design rules, and how the home page is built.
2. docs/handoff/about/README.md: the full spec, covering the portrait, the layout, behaviour, motion, copy, responsive rules and the acceptance checks.
3. docs/handoff/about/reference/index.html, the pixel target at 1440×900 and 390×844 (add ?about to open it on load), and the screenshots beside it.
4. docs/handoff/about/reference.patch: a tested implementation of the README against src/ as it stood when the handoff was written.

What to do:
- Run `git apply --check docs/handoff/about/reference.patch`.
  - If it applies, apply it, then read every hunk against the README and the current code. You own the result, so don't apply it blind.
  - If it doesn't apply because src/ has changed since, make the same changes by hand. Keep the class names, tokens, data attributes and values from the patch.
- The changes:
  - src/index.html: the portrait button inside the <h1>, the h1's aria-labelledby, .intro__lead with the statement, .index__stage, the About block and data-page on <main>.
  - _tokens.scss, _layout.scss and _index.scss: as listed in the README.
  - New: src/ts/about.ts, called from main.ts.
- Also fix the "Work" heading's optical edge with the new $lsb-w-book token (README §8).
- Add `/Balogun Oluwasogo Profile.jpg` (the original photo in the repo root) to .gitignore, in the design-session section.

Rules:
- The portrait files in src/assets/images/portrait are final. Don't regenerate or recompress them. Don't use mix-blend-mode on the photo; README §3 explains why.
- Don't change the copy, add claims, or touch the case-study pages, _case.scss, preview.ts, modal.ts or projects.ts. Don't refactor unrelated code.
- Keep the design rules: no borders, rules, numbering or italics. Apply the optical-edge modifiers, and never size anything with 100vw.
- Keep the behaviour model in README §5 exactly:
  - Mouse: hover, with a 100ms close delay.
  - Touch, and anything without a hover-capable fine pointer: tap to toggle.
  - Keyboard: Enter and Space toggle; Escape, Tab and blur close; focus alone does not open it.
  - The 32px flow fallback.

Before handing back:
- Run npm run typecheck and npm run build.
- Run every acceptance check in README §11, including the pixel match in both states at both sizes (fonts loaded, reduced motion, clock pinned to 11:05 Lagos), the default-state diff against the current home page, the overflow sweep with real scrollbars, the mouse, keyboard and touch sequences, the flow-fallback viewports and reduced motion.
- Update README.md and CLAUDE.md (README §10).
- Summarise the files changed and the key decisions. Don't commit or push; I'll do that myself.
