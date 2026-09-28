# CLAUDE.md — Portfolio V2.1

Context and rules for anyone (human or AI) working in this repo.

## What this is

Balogun Oluwasogo's personal portfolio: a single page, built from the "Neue Montreal" board and the "Two halves" direction of the design canvas "iudoh.me Layout Variations". The layout is a restrained, lineless 12-column grid.

- **Top:** the name as display type, with the role line under it at about a third of the name's size.
- **Bottom of the viewport, left half:** "Featured work" and the project list, flush left under the name (columns 1–6).
- **Bottom of the viewport, right half:** an aside in columns 9–12 acts as the counterweight. It holds the time and "Lagos, Nigeria" beside the links (LinkedIn, GitHub, Contra, in that order), and sits on the last project's line.
- **Hover preview:** columns 9–12. It is hidden until a project is hovered or focused. While it shows, the aside fades out, using `.index:has(.preview.is-visible)` with no JS. It only exists on desktop pointers (`min-width: 1024px` with `hover: hover` and `pointer: fine`).
- **Project links:** open in a new tab (`target="_blank" rel="noopener"`), with a visually hidden "(opens in a new tab)" for screen readers. The preview label reads `[data-work-title]`, so that suffix never shows.
- **Mobile:** stacks the name, role and list. The aside sits below them: time and location on the left, links right-aligned on the right. There is no preview.

## Stack (do not change without asking)

- Plain HTML (`src/index.html`), SCSS (`src/scss`, compiled by `sass`) and TypeScript (`src/ts`, compiled by `tsc` to ES modules).
- No framework, bundler, CSS framework or runtime dependencies. Tailwind is explicitly out.
- Build and dev tooling live in `scripts/*.mjs` and use only Node built-ins. They run the `sass` and `typescript` JS entry points directly, because the folder path has a space in it on Windows.

## Design rules

- **Typeface:** PP Neue Montreal, weight 400 for small text and 500 for display, list items and role. The fallback stack is in `$font-sans`.
- **Colour:** ground `#FAFAF8`, ink `#111110`, muted `#65635D`. There are no accent colours.
- **Decoration:** no rules or borders, no numbering, no italics. Spacing does the separating.
- **Type scale (desktop board at 1440):** name 136px, role 48px, projects 30px, meta 16px.
- **Type scale (mobile board at 390):** name 64px on two lines, role 24px on two lines, projects 28px, meta 15px.
- **Fluid sizes:** implemented with `clamp()` in `_layout.scss` and `_index.scss`.
- **Alignment rules that must hold on desktop:**
  - The GMT+1 line, the "Featured work" label and the top of the preview frame share one top edge (grid row 1).
  - The list's left edge matches the name's left edge, measured on the ink rather than the box. Lines are pulled left by their first glyph's side bearing (`$lsb-*` in `_tokens.scss`), so the B of the name, the F of the role and the F of "Featured work" sit on the same pixel column. A new line or project title that starts on a straight stem (B, D, F, N…) needs the same correction; use `.work__link--stem` for projects.
  - The aside's last line (the location and Contra) sits level with the last project. This is driven by `$work-pad-desktop`.
  - The project list hugs its longest title (`justify-self: start`).
- **Brand mark:** the `b.` wordmark from the Artifacts project (`balo.svg` / `public/favicon.svg` there). Copy it exactly and never redraw it. The favicon and touch icon are white on `#262626`. The share image is `#262626` on white.
- **Accessibility:**
  - Projects are real links, and focus shows the preview just as hover does.
  - The preview is `aria-hidden`.
  - Focus-visible outlines stay on.
  - Tap targets stay at 44px or more on mobile.
  - `prefers-reduced-motion` removes transitions.

## Conventions

- BEM-style class names (`block__element`), and `data-*` attributes for JS hooks. Never select on styling classes in TS.
- SCSS uses `@use` modules. Tokens and mixins live in `_tokens.scss`, so add values there before using them.
- TypeScript is strict. Imports inside `src/ts` use the `.js` extension so the emitted ES modules resolve in the browser.
- Keep changes scoped: no unrelated refactors, and preserve the existing structure and class names.

## Before handing work back

1. `npm run typecheck`
2. `npm run build`
3. Check 1440×900 and 390×844, including the hover state and keyboard focus on the project list.
4. Summarise the files changed and the key decisions.

## Assets

- **Only web formats ship.** Fonts are served as `.woff2`, and preview images as 1200px WebP.
- **Raw sources stay in `src/assets` but are never deployed.** That means the `.otf` fonts and the full-size `.png` exports. They're filtered out by `SOURCE_ONLY` in `scripts/shared.mjs` and git-ignored.
- **Fonts in the repo:** the two PP Neue Montreal `.woff2` files are committed (Oluwasogo's call) so the Vercel build includes them. The `.otf` originals stay git-ignored.
- **Deploy:** Vercel builds `main` using `vercel.json` (`npm ci`, `npm run build`, output `dist`). Don't add a framework preset.

## Open items

None right now.
