"""Fill the white margin around a History illustration's parchment frame with
the History page's panel color, so it disappears into the page.

Image generators tend to draw the frame as a torn sheet on a white canvas,
leaving white in the corners and along the ragged outer edge. This floods
from the image border through near-white pixels only, so white that sits
inside the artwork (a scroll, a sky, a caption plaque) is never touched.

Usage (native Windows paths):
    python client/scripts/fillMargins.py <input.png|jpg|webp> <output.webp> [#rrggbb]

The default fill is --bg-card (global.css), the background of
.history-detail-panel that event images sit on. Keep it in sync if that changes.
"""
import sys
from collections import deque

from PIL import Image

FILL = '#111428'

# A pixel counts as margin if it is light and nearly grey. The parchment frame
# is a saturated tan, so it fails the grey test even where it is pale.
LIGHT_MIN = 200
GREY_SPREAD = 28
# Anti-aliased fringe between the margin and the frame: lighter than the frame
# but not quite white. Filled only if it touches the flooded margin.
FRINGE_MIN = 170
FRINGE_SPREAD = 60


def is_margin(p):
    r, g, b = p[:3]
    return min(r, g, b) >= LIGHT_MIN and max(r, g, b) - min(r, g, b) <= GREY_SPREAD


def is_fringe(p):
    r, g, b = p[:3]
    return min(r, g, b) >= FRINGE_MIN and max(r, g, b) - min(r, g, b) <= FRINGE_SPREAD


def main(src, dst, fill=FILL):
    fill = tuple(int(fill.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4))
    img = Image.open(src).convert('RGB')
    w, h = img.size
    px = img.load()
    seen = bytearray(w * h)
    queue = deque()

    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))

    margin = []
    while queue:
        x, y = queue.popleft()
        i = y * w + x
        if seen[i]:
            continue
        seen[i] = 1
        if not is_margin(px[x, y]):
            continue
        margin.append((x, y))
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                queue.append((nx, ny))

    # One pass of fringe cleanup so no light halo is left around the frame edge.
    fringe = set()
    for x, y in margin:
        for dx in (-2, -1, 0, 1, 2):
            for dy in (-2, -1, 0, 1, 2):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and is_fringe(px[nx, ny]):
                    fringe.add((nx, ny))

    for x, y in margin:
        px[x, y] = fill
    for x, y in fringe:
        px[x, y] = fill

    img.save(dst, 'WEBP', quality=90)
    print(f'{src} -> {dst}: {len(margin)} margin + {len(fringe)} fringe pixels filled')


if __name__ == '__main__':
    main(*sys.argv[1:4])
