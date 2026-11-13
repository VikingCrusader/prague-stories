# Guide board illustrations

Prompts for the pictures on the Guide's overview board (2K screens,
`GuideBoard.jsx`; first written 2026-11-13, redone the same day once the tile
shapes were fixed). **One picture per generation**: paste the style block
with the right FORMAT line, then the tile's SCENE. A tile shows
`client/public/guide/<key>.webp` when it exists, otherwise an existing
picture or its emoji.

Two shapes, fixed by the CSS (`styles/guide.css`):

- **4:3 (1024 x 768)**, the seven wide tiles (collect, rarity, hunt, xp,
  packs, screens, tips): the picture sits whole on the left, the text beside
  it, so the whole picture can be busy. Saved at 720 x 540.
- **3:2 (1536 x 1024)**, the opening tile and the six small ones (what,
  start, install, locked, showcase, ach, faq): the picture fills the tile and
  the text lies on a band over its **bottom 40%**, so that part must be calm
  (plain ground, water, a dark table). Saved at 1200 x 800 (what) or
  720 x 480 (the small ones).

Claude converts the generated PNG to WebP at those sizes; crop to the exact
ratio first if the tool returns something slightly off.

## Style block (paste before every scene)

```
FORMAT: <4:3 landscape, 1024 x 768 | 3:2 landscape, 1536 x 1024>, NOT square.

STYLE: detailed pixel art in the style of the illustrated covers of a Prague
collectible card game: crisp visible pixels (as if drawn at about a quarter of
the final size and upscaled with NO smoothing), NO anti-aliasing, NO blur, NO
photographic texture. Limited warm palette: terracotta roofs, sandstone,
weathered copper green, Gothic charcoal, gold highlights, deep evening blue.
Warm late-afternoon light from the top left, long soft shadows. Prague's real
architecture drawn faithfully. One clear subject, readable as a small
thumbnail. A single dry visual joke, never slapstick.

ALL PICTURES IN THIS SET SHARE THIS STYLE, LIGHT AND PALETTE.

NOT: no text, letters, numbers or signs anywhere; no frame, no border, no
vignette, no logo, no watermark, no signature; no real people's faces (small
figures seen from behind or far away only).

SCENE: <the tile's scene below>
```

For a **3:2** picture also add a CAMERA AND LAYOUT block. **Lesson from
`start` (2026-11-13):** "keep the bottom 40% empty" was ignored twice (the
generator kept the subject near the bottom edge); what worked was concrete
geometry: a raised viewpoint, the subject's foot at exactly the middle height,
and the whole lower half named as one plain surface. Write it like this:

```
CAMERA AND LAYOUT, STRICT: a high viewpoint, looking slightly DOWN. <The
subject's foot / the edge of the table / the waterline> runs EXACTLY across
the middle height of the picture (50% from the top). The subject is SMALL in
the frame and fits in the upper half. The ENTIRE LOWER HALF is <one plain
surface: empty cobbles, still water, a bare table top>, in soft even light,
with no people, no objects and no strong light patches in it.
```

## Scenes

### 3:2, the opening tile and the small ones

- `what` (opening tile): Golden hour on Charles Bridge seen from the Old Town
  end, looking along the bridge to Prague Castle and St Vitus Cathedral on
  the hill; the Baroque statues line the parapets. A lone explorer seen from
  behind, small, with a backpack, holds up a glowing playing card towards the
  castle as if comparing the two. Bottom 40%: the calm dark Vltava below the
  bridge arches, with soft gold reflections.
- `start`: The Powder Tower's Gothic archway at dusk, its passage glowing
  with warm light; on the cobbles in front, a red doormat with a brass key and
  a folded paper map lying on it, as if left for a new arrival. Bottom 40%:
  plain cobblestones in shadow.
- `install` (**side layout**: the tile's text lies over the right half, so
  the phone stands on the left; user's call 2026-11-13): an upright
  smartphone held in a hand on the left, filling nearly the full height, its
  screen showing the app's big moment (a card flipping open in a burst of
  gold light, the padlock flying off, "+50 XP" rising, an achievement trophy
  sliding in); a small glowing Apple-style apple and Android robot head
  beside it; the right half a calm, dark, out-of-focus night skyline.
- `locked`: The heavy oak door of an old Malá Strana house with a house sign
  above it (a carved golden key, no lettering), shut with a huge iron padlock
  and chain; a thin line of golden light and the corner of an old book page
  slip out from under the door. Bottom 40%: a plain worn stone doorstep.
- `showcase`: A hand holding up a single collectible card with an ornate gold
  frame, its picture showing the Astronomical Clock; a spotlight cone falls
  on it from the top left in a dark room, dust sparkling in the beam. Bottom
  40%: dark, nearly black.
- `ach`: A glass display cabinet of curiosities with a gold, a silver and a
  bronze trophy cup and one blue diamond on velvet; a Prague pigeon has
  perched on the gold cup and looks very pleased with itself. Bottom 40%: the
  cabinet's plain dark wooden base.
- `faq`: A comfortable old sofa by a window with a view of Prague Castle; a
  big iron padlock and chain are wrapped round the sofa cushion, and a
  smartphone lies on it with its screen glowing red. Bottom 40%: plain
  wooden floorboards.

### 4:3, the wide tiles

- `collect`: A bird's-eye view straight down on a cobbled Old Town square:
  in the middle a glowing gold map pin, round it two dashed gold rings
  painted on the cobbles (a wide one and a small one), a tiny walker just
  stepping over the outer ring, pigeons scattering away from the pin.
- `rarity`: Seven collectible cards fanned out on dark green velvet, their
  frames from left to right plain grey, blue, green, purple, crimson, gold
  and silver set with a blue diamond; the gold one glows softly; a brass
  magnifying glass rests on the fan.
- `hunt`: An old hand-drawn treasure map of Prague on a wooden table (the
  bend of the Vltava, Charles Bridge sketched across it, the castle as a tiny
  drawing), a dotted line winding to a red X; a brass compass, an iron key
  and a lit lantern lie on the map.
- `xp`: Inside a Gothic stone tower, a spiral staircase seen from below
  climbing towards a bright gold light at the top; the lower steps are plain
  grey stone, the higher ones turn gold; a tiny figure halfway up, pausing
  for breath.
- `packs`: A sealed foil card pack with crimped, ribbed ends and a
  holographic sheen standing on a dark table, torn open at the top corner;
  three cards fan out of the tear with warm golden light pouring out behind
  them.
- `screens`: A writing desk seen from above with five things in a loose row:
  a brass spyglass, an unrolled map of Prague, an open history book with an
  illustration, a treasure-hunt compass and a small stack of cards; warm
  lamplight.
- `tips`: A Malá Strana street corner at dusk, a lit cast-iron gas lamp; on
  the bench beneath it a walking stick, a pair of worn walking boots and a
  folded paper tram ticket, as if their owner had just left good advice
  behind.
