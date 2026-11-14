# How the DOJANG essay's media was made

A record, not something to run during the build. The media in `src/assets` is final.

## Interactive 01: `clipLab.ts` and `clipcap.js`

1. Two checkouts of `github.com/balogunsogo/dojang`:
   - `af3f767` (1 November 2026: the first version's animation, with the motion lab, just before "Phase 1.5: natural fighter animation");
   - `main` `b34f80c` (14 November 2026).
2. In each, `src/lab/clipLab.ts` (this folder, byte-identical in both) and one route in `src/main.tsx`:
   `else if (params.get('lab') === 'clip') import('./lab/clipLab').then((m) => m.runClipLab(root));`
3. `npx vite --port 5101` (first) and `5102` (now), then `node clipcap.js <port> <outDir>`.
   - Headless Chromium with SwiftShader, 1280 × 720, one 60 Hz tick per frame, 533 frames.
4. `ffmpeg -framerate 60 -i f%05d.png -c:v libx264 -preset slow -crf 22 -profile:v high -pix_fmt yuv420p -movflags +faststart`.
5. Posters: frame 106 of each (the roundhouse landing).

The harness runs each build's own simulation, animator, characters, dojang and hit effects with the same scripted inputs and a fixed camera. Both builds logged hit round (tick 109), block side (221), hit back (323) and hit head round (443).

## Interactive 02: `mobcap.js`

- `main` at 667 × 375, device scale 2, touch, `?start=normal&seed=7`, after 240 ticks of the fight, paused.
- It writes three things:
  - the screenshot with controls (`dojang-touch-compact.webp`);
  - the same scene with the touch controls hidden (`dojang-touch-frame.webp`; the 3D scene moved slightly between the two captures);
  - the coverage, measured exactly as DOJANG's `scripts/ux-capture.mjs` does: **17.6%**.
- `dojang-touch-first.webp` is DOJANG's `docs/media/phase1.5/hud-before-iphonese.jpg` (1 November, 32.4% in its `ux-before.json`).

## The recordings

- **Sparring** (`2025-11-08-142308287.mp4`, the author's phone): segments 7.0–12.0, 20.0–29.5, 46.5–49.0, 50.0–54.0 and 55.5–58.5 s, scaled to 1280 × 720, audio removed. Poster: the high kick at 22.2 s.
- **Black Belt** (screen recording, 14 November 2026, 16:44): `crop=1320:720:46:44` removes the browser chrome. Segments 0.3–2.5 (choosing Black belt), 31.0–35.5, 49.5–56.5 (the AI's knockout), 110.0–113.0 and 129.0–137.0 s (to "You win 2–1").
- **Online** (screen recording, 14 November 2026, 16:42): same crop. Segments 5.0–7.3 (the lobby countdown), 17.0–26.0, 41.0–48.5 and 77.5–83.0 s (to "You win 2–0").
- **Knockdown:** DOJANG `docs/media/ko-fall/ko-before-after.mp4` with `crop=1280:324:0:36` to remove the burned-in labels.
- **Encoding:** H.264, CRF 26 (recordings) / 22 (renders), `+faststart`, no audio.

## Photos

- 2020 kick and November 2025 portrait, supplied by the author.
- Resized to 1200 and 600 wide (3:4) and encoded as WebP. EXIF removed; the originals had no location data.
