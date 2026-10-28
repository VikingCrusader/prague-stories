"""Museum "showcase" frame for a real object image (rebuilt 2026-10-28 to match
father-of-the-fatherland-1378-banknote.webp): dark wall with a soft vignette,
object on a black velvet panel inside a thin gold double-line frame with small
gold diamond corners. Usage: python client/scripts/showcaseFrame.py <in> <out.webp>"""
import sys
from PIL import Image, ImageDraw, ImageFilter

W, H = 1024, 576
WALL = (36, 30, 25)
GOLD = (196, 160, 82)
GOLD_DARK = (120, 92, 40)

src = Image.open(sys.argv[1]).convert('RGB')

# wall with vignette and a soft spotlight from above
wall = Image.new('RGB', (W, H), WALL)
shade = Image.new('L', (W, H), 0)
d = ImageDraw.Draw(shade)
d.ellipse((-W * 0.1, -H * 0.35, W * 1.1, H * 1.25), fill=255)
shade = shade.filter(ImageFilter.GaussianBlur(120))
dark = Image.new('RGB', (W, H), (14, 11, 9))
wall = Image.composite(wall, dark, shade)

# panel size: keep the object's aspect, fill most of the height
margin_y = 44
inner_h = H - 2 * margin_y - 2 * 18
scale = inner_h / src.height
obj = src.resize((round(src.width * scale), inner_h), Image.LANCZOS)
pad = 18
pw, ph = obj.width + 2 * pad, obj.height + 2 * pad
px, py = (W - pw) // 2, (H - ph) // 2

# drop shadow under the panel
sh = Image.new('L', (W, H), 0)
ImageDraw.Draw(sh).rectangle((px + 6, py + 10, px + pw + 6, py + ph + 10), fill=170)
sh = sh.filter(ImageFilter.GaussianBlur(14))
wall = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), wall, sh)

panel = Image.new('RGB', (pw, ph), (0, 0, 0))
panel.paste(obj, (pad, pad))
wall.paste(panel, (px, py))

d = ImageDraw.Draw(wall)
# gold double-line frame just outside the panel
for off, col, w in ((10, GOLD, 2), (5, GOLD_DARK, 1), (1, GOLD, 1)):
    d.rectangle((px - off, py - off, px + pw + off - 1, py + ph + off - 1), outline=col, width=w)
# diamond corners
r = 10
for cx, cy in ((px - 10, py - 10), (px + pw + 9, py - 10), (px - 10, py + ph + 9), (px + pw + 9, py + ph + 9)):
    d.polygon([(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)], fill=WALL, outline=GOLD)
    d.polygon([(cx, cy - r + 4), (cx + r - 4, cy), (cx, cy + r - 4), (cx - r + 4, cy)], outline=GOLD)

wall.save(sys.argv[2], 'WEBP', quality=90, method=6)
print(sys.argv[2], wall.size)
