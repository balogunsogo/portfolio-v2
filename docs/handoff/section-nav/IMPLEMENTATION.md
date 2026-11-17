# Section navigation implementation and verification

Implemented 17 November 2026 on `feature/section-nav`.

## Changes

- Added `src/ts/section-nav.ts` and `src/scss/_section-nav.scss` from the approved references.
- Imported the SCSS in `src/scss/main.scss` and initialized navigation immediately after the top bar in `src/ts/main.ts`.
- Added only `data-toc` and `data-toc-end` attributes to the eight long-page HTML files. Existing IDs, classes, copy and line endings are preserved.
- Updated `CLAUDE.md` with the component notes and the 1px marks decoration exception.
- Retained the supplied brief, source references and visual targets in this handoff folder.

## Heading counts

| Page | Headings |
| --- | ---: |
| `/work/acetrail` | 12 |
| `/work/artifacts` | 15 |
| `/work/jobtrackr` | 15 |
| `/work/morrow-studio` | 13 |
| `/work/now-playing` | 13 |
| `/writing/building-job-url-extraction-into-jobtrackr` | 8 |
| `/writing/making-a-fighting-game-feel-right-in-the-browser` | 8 |
| `/writing/space-between-design-and-engineering` | 5 |
| **Total** | **89** |

## Headings in page order

### `/work/acetrail` (12)

1. `context-heading`: The old site asked before it explained.
2. `directions-heading`: Four directions, then one refined.
3. `hero-scroll-heading`: One photo that opens up as you scroll.
4. `classes-heading`: One open class, in focus.
5. `results-heading`: Let the score lead.
6. `how-heading`: From a paragraph to five steps.
7. `engineering-heading`: Off the Webflow export.
8. `performance-heading`: Measured on a mid-range phone.
9. `process-heading`: Specified first, built a section at a time.
10. `stack-heading`: A small stack for a marketing site.
11. `launch-heading`: Live, and still moving.
12. `outcome-label`: Outcome

### `/work/artifacts` (15)

1. `context-heading`: My best interactions were buried in other projects.
2. `archive-heading`: An index you scroll sideways.
3. `theme-heading`: Light or dark, settled before the first paint.
4. `rules-heading`: Ten artifacts, one set of rules.
5. `block-orbit-heading`: The first artifact is my own mark.
6. `split-menu-heading`: A menu that wipes in and follows the pointer.
7. `scroll-cinema-heading`: A video that grows as you scroll.
8. `now-playing-heading`: Three pieces of a music player, without the player.
9. `track-heading`: A track change in five phases.
10. `phone-heading`: Touch gets its own version, not a smaller one.
11. `engineering-heading`: Light enough to run ten at once.
12. `performance-heading`: Measured on a mid-range phone.
13. `process-heading`: Find it, take it out, rebuild it.
14. `stack-heading`: A static site with room for motion.
15. `outcome-label`: Outcome

### `/work/jobtrackr` (15)

1. `problem-heading`: A job search spreads across too many places.
2. `structure-heading`: Built around the life of an application.
3. `overview-heading`: See what matters. Know what comes next.
4. `applications-heading`: Every opportunity keeps its whole story.
5. `interviews-heading`: From tracking to preparation.
6. `analytics-heading`: Is the search actually working?
7. `architecture-heading`: Three layers, each with one job.
8. `data-heading`: Ten tables, shaped by the journey.
9. `process-heading`: One feature touches every layer.
10. `authentication-heading`: Who owns the data?
11. `security-heading`: Signed in isn’t the same as allowed.
12. `stack-heading`: Tools chosen around the product.
13. `shipping-heading`: Live, and in beta.
14. `beta-heading`: Shipping wasn’t the finish line.
15. `outcome-label`: Outcome

### `/work/morrow-studio` (13)

1. `context-heading`: A fictional studio, built like a real one.
2. `design-heading`: Quiet frame, loud work.
3. `projects-heading`: Ten case studies, one renderer.
4. `model-heading`: Sanity holds the content. The code holds the layout.
5. `mobile-heading`: Mobile is an edit, not a stack.
6. `cms-heading`: The site wasn’t the only interface.
7. `editing-heading`: Organised like the site, in the editors’ words.
8. `preview-heading`: Edit a draft, see it in the site, then publish.
9. `migration-heading`: Ten projects, moved in by script.
10. `qa-heading`: The last stage removed differences.
11. `process-heading`: Designed first, then built to match.
12. `stack-heading`: Next.js in front, Sanity behind.
13. `outcome-label`: Outcome

### `/work/now-playing` (13)

1. `context-heading`: A page about one thing: the music I'm listening to.
2. `data-heading`: Three questions to Spotify, in order.
3. `changes-heading`: A new track waits until it’s ready.
4. `scene-heading`: Every cover brings its own colours.
5. `artwork-heading`: The cover leans toward the pointer.
6. `previously-heading`: Four recent tracks, one tap away.
7. `phone-heading`: Smaller screens, and shorter ones.
8. `touch-heading`: The cover follows your finger.
9. `engineering-heading`: Doing less, especially in a hidden tab.
10. `performance-heading`: Measured on a mid-range phone.
11. `process-heading`: Built in passes, over five months.
12. `stack-heading`: No framework, no build step.
13. `outcome-label`: Outcome

### `/writing/building-job-url-extraction-into-jobtrackr` (8)

1. `url-heading`: Making the URL do some of the work
2. `ai-heading`: Why I didn’t use AI for extraction
3. `data-heading`: Getting the data was only part of the problem
4. `safe-heading`: Making it safe enough to ship
5. `prod-heading`: Getting it into production
6. `useful-heading`: Working wasn’t the same as being useful
7. `next-heading`: What comes next
8. `cta-heading`: See it in action

### `/writing/making-a-fighting-game-feel-right-in-the-browser` (8)

1. `start-heading`: It started with $100 I didn’t want to waste
2. `first-heading`: Getting the first version working
3. `fighters-heading`: Making the fighters feel like Taekwondo practitioners
4. `phone-heading`: A fighting game still has to feel good on a phone
5. `beaten-heading`: Getting beaten by my own game
6. `sound-heading`: Not everything is where I want it yet
7. `still-heading`: Still playing, still improving
8. `cta-heading`: Give DOJANG a try

### `/writing/space-between-design-and-engineering` (5)

1. `engineering-heading`: Getting into engineering
2. `mockup-heading`: The things you don’t always see in a mockup
3. `shift-heading`: A gradual shift in perspective
4. `between-heading`: Somewhere between the two
5. `learning-heading`: Still learning

## Reference adaptation

The approved 60% appearance, 55% footer and 40% current-section thresholds and every SCSS value are retained. Resize listeners are passive, as required by the brief.

The user approved one behavior deviation: hide the navigation when the document reaches its bottom, in addition to the 55% footer rule. At 1440 x 900, the existing short footers stop around 673?682px from the top and cannot reach the 495px threshold. The fallback avoids leaving the nav visible at the end without adding page space or changing any existing layout. It uses rounded scroll geometry rather than another percentage threshold.

## Verification

All checks passed in local Chromium 153.0.8010.12 against the production build. Browser QA scripts and machine-readable results are under `.tmp/section-nav/` (ignored).

| Check | Result |
| --- | --- |
| `npm.cmd run typecheck` and `npm.cmd run build` | Passed after the approved footer fallback. `npm.cmd` runs the requested npm scripts without the blocked PowerShell npm wrapper. |
| 1440 x 900, 1280 x 800, 1024 x 768 on all eight long pages | 24 page/viewport combinations passed: hidden at top, appearance at 60%, correct current links and marks at 40%, heading order, hover, jumps to 104px below the viewport top, hash update and heading focus. |
| Footer behavior at the three desktop sizes | All 24 combinations passed hide-at-bottom and reverse-scroll checks. A temporary browser-only spacer also made the original 55% rule reachable, verifying it independently without changing production layout. |
| Layout regression | 40 page/viewport comparisons against the pre-change build at 390 x 844, 1023 x 768, 1024 x 768, 1280 x 800 and 1440 x 900: identical page heights and bounding boxes for existing landmarks/headings/IDs. |
| Mobile/1023px | Nav has `display: none`, no rendered box, and no existing layout changes. |
| Keyboard and accessibility | Real Tab/Enter navigation passed on every long page: opens on focus, 2px title outline with 3px offset, correct hash and heading focus. Ordered links and hidden decorative marks retained. |
| Reduced motion | Every long page passed: all nav transitions disabled and jumps immediately land at the 104px offset. |
| Normal motion | 0.2s nav transition and smooth jump verified on JobTrackr; the final position is 104px. Navigation leaves browser storage unchanged. |
| TL;DR and print | All five case studies hide the nav in TL;DR and restore the correct section in Full story at all three desktop sizes. All eight long pages hide it in print. |
| Horizontal overflow | All ten pages passed at 75 widths from 320 through 2560px, including 390, 1023, 1024, 1280 and 1440. Open and collapsed nav states were checked wherever displayed. Resize-driven layout was allowed to settle before measurement. |
| Approved visual targets | Collapsed, open and keyboard-focus captures reviewed against all three supplied right-margin targets at 1440 x 900. Placement, marks, title wrapping, panel geometry and outline match. Small native font rasterization/compression differences remain; the approved SCSS declarations are unchanged. |
| Home, About and Writing index | Passed at 1440 and 390: About/Work switching, desktop hover/focus previews, mobile project sheet/Next/Close, Writing index links; no section navigation is created on these pages. |
| Every essay demo | All three essays at 1440 and 390 were exercised against the pre-change build. Form validation/reset, annotation tabs, extraction sources, protected edits, racing requests, keyboard dropdowns, video version switches/play/pause/replay, image versions, sound exclusivity, and DOJANG kick/hold-wheel/height/stick/version reset produced identical results. No fetch/XHR requests or script errors. |
| Source integrity | Stripping the requested attributes reproduces all eight original HTML files byte-for-byte. Home and Writing index HTML are unchanged. `main.ts` has CRLF throughout. No dependencies, storage, requests or analytics were added by the feature. |

## Deployment

Deployment uses the existing `main` to Vercel pipeline. Production verification and the shipped commit are reported in the final delivery message.
