# Homepage mobile performance — 9 October 2026

The homepage now renders the project list in its initial HTML, serves only its own stylesheet, starts its module requests earlier, and loads mobile project images on demand. Its layout, copy, links, transitions and input controls are preserved. The official font file, font declarations, font preload and font cache headers are unchanged.

## Findings

- The deployed homepage downloads no project images before interaction. Morrow's 1200×800 preview is 34,224 bytes; its PNG source is excluded from the build. It is not the initial LCP resource: the name text is.
- Touching a project previously warmed all five full-size previews: 390,744 bytes. The desktop preload listener also ran on mobile even though the hover preview was unavailable.
- The work list was inserted after JavaScript loaded. Under mobile Lighthouse throttling, that moved the lower homepage block and produced CLS 0.14024. Adding Morrow increased the height of this existing insertion. No historical performance reports were supplied, so this does not establish the exact change in the previous production score.
- The homepage loaded the case-study CSS, although it uses none of those components.

## Changes

- `scripts/projects.mjs` renders the list from the existing `projects.ts` data during the build. It uses the already-installed TypeScript compiler and Node's VM to evaluate the data exports; its DOM functions are not called. Hidden projects, optical alignment classes, case-study URLs, external-link attributes and accessibility suffixes use the same rules as the browser renderer. Browser initialization retains these links and existing focus. The original renderer remains a fallback for unbuilt markup. Development refreshes the HTML when project data changes.
- `home.scss` imports the existing fonts, base, layout and index modules. Case studies retain `main.scss`. No shared style rules were edited. Both production and development compile both entries.
- The homepage preloads the modules already imported by `main.js`, reducing their discovery delay without changing when they execute.
- Morrow's mobile image uses 480w, 800w and 1200w sources, with sizes matching the sheet's 576px maximum width and 20px side padding. The new 800px WebP is derived from the existing preview at quality 90. The original image and desktop preview remain intact.
- Mobile starts the selected image on pointerdown and warms the next image at low priority after the selected image loads. Desktop warmup is gated by the same media query as the hover preview.

## Measurements

Lighthouse 13.5.0, Chrome 154, default mobile simulation. Compared the original HEAD homepage with the optimized production build on local servers using Brotli compression and production-style asset cache headers. The real, unchanged Google Analytics script was loaded in both runs. These are individual local lab measurements, not deployed PageSpeed scores; third-party timing varies.

| Metric | Before | After |
| --- | ---: | ---: |
| Performance score | 74 | 87 |
| Largest Contentful Paint | 1.99 s | 1.87 s |
| Cumulative Layout Shift | 0.14024 | 0 |
| Total Blocking Time | 822 ms | 512.5 ms |
| Homepage CSS, uncompressed | 39,985 B | 13,395 B |
| Homepage CSS, local Brotli quality 5 | 6,954 B | 3,056 B |
| Morrow image, 390px viewport at DPR 2 | 34,224 B | 16,448 B |
| Images after opening Morrow, including next-image warmup | 390,744 B | 89,484–108,686 B |

Analytics remains the largest attributed JavaScript execution cost in the final run (about 598 ms including parsing). Its timing and tracking behavior were preserved. The blocking-time score improvement cannot be attributed entirely to these changes because the third-party script varies between runs.

## Verification

- `npm run typecheck`, production build and development smoke check passed; project-data watch regenerated the homepage HTML.
- All six pages compared at 1440×900 and 390×844: zero changed pixels after fonts and the clock SVG settled. Case-study source and shared style rules are unchanged.
- Mobile image selection verified at DPR 1, 2 and 3; initial project-image requests remain zero. Opening Morrow requests only its selected source and Acetrail, the next project. Switching to another project clears Morrow's srcset.
- Mobile sheet height stays constant throughout the five-project cycle. Links, Next, normal and reduced-motion transitions, Close, Escape, scrim dismissal, touch drag, keyboard focus trapping and restoration, and resize dismissal passed.
- About toggle, desktop hover and keyboard previews passed. No application errors or failed local resources. Visual/interaction checks stubbed analytics to isolate application behavior; Lighthouse loaded the real script.
- Homepage overflow checks passed from 320px to 2560px.
- Scratch scripts, screenshots, live network evidence and Lighthouse HTML/JSON reports are in the ignored `.tmp/performance/` directory. The measurements above were taken before deployment.

References: [MDN responsive image selection](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images), [Google's LCP optimization guidance](https://web.dev/articles/optimize-lcp).
