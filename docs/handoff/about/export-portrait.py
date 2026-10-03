"""Export the home-page portrait from the original photo.

The photo has a plain white background. Instead of blending it into the page at runtime
(mix-blend-mode changes how Chrome renders every line of text on the page), the page's ground
colour is multiplied into the pixels here, so the background comes out as #FAFAF8 and only the
head and shoulders read on the page.

Crop: the full width, from 2px above the top of the hair, at the portrait's ratio
(0.9em x 0.715em, see $portrait-width and $cap-height-medium), so the hair touches the cap line
and the shoulders sit on the baseline.

Usage (from the repo root, needs Pillow):
    python docs/handoff/about/export-portrait.py "Balogun Oluwasogo Profile.jpg"
If the ground colour ever changes, update GROUND and run it again.
"""
import sys
from pathlib import Path

from PIL import Image

GROUND = (250, 250, 248)  # $color-ground, #FAFAF8
RATIO = 0.9 / 0.715  # $portrait-width / $cap-height-medium
TOP = 126  # 2px above the top of the hair in the 1254 x 1254 original
WIDTHS = (240, 480)
OUT = Path('src/assets/images/portrait')


def main(source: str) -> None:
    photo = Image.open(source).convert('RGB')
    width = photo.width
    crop = photo.crop((0, TOP, width, TOP + round(width / RATIO)))
    # The background is 254 white: lift it to 255, then multiply the ground in.
    channels = []
    for band, ground in zip(crop.split(), GROUND):
        channels.append(band.point(lambda v, g=ground: round(min(255, v * 255 / 254) * g / 255)))
    baked = Image.merge('RGB', channels)
    OUT.mkdir(parents=True, exist_ok=True)
    for w in WIDTHS:
        h = round(w / RATIO)
        baked.resize((w, h), Image.LANCZOS).save(OUT / f'portrait-{w}.webp', quality=86, method=6)
        print(f'{OUT}/portrait-{w}.webp  {w}x{h}')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'Balogun Oluwasogo Profile.jpg')
