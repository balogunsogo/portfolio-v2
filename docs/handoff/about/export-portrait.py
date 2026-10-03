"""Export the home-page portrait from the original photo.

The photo has a plain white background. Instead of blending it at runtime (mix-blend-mode
changes how Chrome renders every line of text on the page), a backdrop colour is multiplied into
the pixels here. It's $plate-clip (#ECEBE6), one step darker than the #FAFAF8 ground, so the
portrait reads as a small tile in the name rather than a head floating on the page. (The first
export baked the ground itself; that looked like a floating head.)

Crop: the full width, from 70px above the top of the hair, at the portrait's ratio
(0.9em x 0.715em, see $portrait-width and $cap-height-medium), so there's a little headroom
inside the tile and the shoulders sit on the baseline. (The first export started 2px above the
hair, which made the head touch the top of the frame.)

Usage (from the repo root, needs Pillow):
    python docs/handoff/about/export-portrait.py "Balogun Oluwasogo Profile.jpg"
If the backdrop should change, update BACKDROP and run it again. Bump the ?v= on the portrait
URLs in src/index.html too, because images are cached for a week.
"""
import sys
from pathlib import Path

from PIL import Image

BACKDROP = (236, 235, 230)  # $plate-clip, #ECEBE6
RATIO = 0.9 / 0.715  # $portrait-width / $cap-height-medium
TOP = 56  # 70px above the top of the hair (row 126) in the 1254 x 1254 original
WIDTHS = (240, 480)
OUT = Path('src/assets/images/portrait')


def main(source: str) -> None:
    photo = Image.open(source).convert('RGB')
    width = photo.width
    crop = photo.crop((0, TOP, width, TOP + round(width / RATIO)))
    # The background is 254 white: lift it to 255, then multiply the backdrop in.
    channels = []
    for band, backdrop in zip(crop.split(), BACKDROP):
        channels.append(band.point(lambda v, b=backdrop: round(min(255, v * 255 / 254) * b / 255)))
    baked = Image.merge('RGB', channels)
    OUT.mkdir(parents=True, exist_ok=True)
    for w in WIDTHS:
        h = round(w / RATIO)
        baked.resize((w, h), Image.LANCZOS).save(OUT / f'portrait-{w}.webp', quality=86, method=6)
        print(f'{OUT}/portrait-{w}.webp  {w}x{h}')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'Balogun Oluwasogo Profile.jpg')
