# Achievement icon prompts

Prompts for the achievement icons (2026-11-02). **One icon per generation**
(the user's tool can't do three at once): paste the style block below, then
one SUBJECT line from the groups further down. The tool returns 1024 x 1024;
Claude scales it to 256 px and saves it as
`client/public/achievements/<id>.webp` (the id is given per subject).
`AchievementIcon.jsx` shows the file when it exists and falls back to the
emoji otherwise.

The app draws the gold frame and greys out locked icons itself, so the art
must have **no frame and no grey version**. Lesson from the first batch: keep
the main subject (a person, a flag) large; a tiny figure vanishes at 64 px.

## Style block (paste before every subject)

```
A single square video-game achievement icon, 1:1 (512 x 512).

STYLE: pixel art in the spirit of the achievement icons of a historical grand
strategy game, but original: one bold central object or scene, readable at
64 px; the main subject large and clearly visible. Chunky pixels (about a
48 x 48 grid, upscaled crisply, NO anti-aliasing, NO blur, NO gradients
smoother than 3 steps). Limited palette of about 16 colours: warm gold, brick
red, parchment, slate blue, moss green, on a deep navy / charcoal background
with a soft dark vignette. Light from the top left. A dry visual joke.

NOT: no frame, no border, no rounded corners, no badge shape (the app adds its
own gold frame). No text, letters or numbers unless the subject asks for them.
No logos, no real people's faces, no watermark, no signature.

SUBJECT: <one subject from the list below>
```

For the two solemn groups (12 and 13) add this line to the style block:

```
TONE: dignified and quiet, muted palette, no jokes, no cartoon expressions.
```

## Groups

### Group 1: how much of Prague (略懂略懂 · 半数囊中 · 行百里者半八十), all three done

```
LEFT (a_quarter): a folded paper city map with a river curving through it; one
quarter of the map is coloured gold, the rest still blank parchment. A small
hand-held compass beside it points hesitantly sideways.
MIDDLE (half_the_city): a small leather coin pouch stuffed with half of a city
map; the map is torn neatly in two along the river, the gold half in the pouch,
the grey half lying outside.
RIGHT (the_last_mile), DONE, redrawn as: a mountain path seen from the side;
for most of its length a gentle cobblestone slope, then for the last short part
an almost vertical cliff with a small gold flag on top; a walker with a
backpack stands at the foot of the cliff looking up. Walker and flag large.
```

### Group 2: the big collections (布拉格百景 · 我来，我见，我征服 · 深藏不露), all three done

```
LEFT (century): a thick fanned-out deck of playing cards, with a gold ribbon
across it showing the number "100".
MIDDLE (veni_vidi_vici): a Roman laurel wreath around a single golden playing
card marked with a crown.
RIGHT (hidden_depths): a deep, dark stone well seen from above; at the very
bottom, only the corner of a glowing red card is visible.
```

### Group 3: kinds of cards (五颜六色 · 出城去 · 虔诚的信徒), all three done

```
LEFT (all_the_colours): a painter's palette with exactly six paint blobs:
cream white, sky blue, green, purple, red and gold, and a small brush.
MIDDLE (out_of_town): a small travel suitcase with a silver luggage tag,
standing at a road sign whose arrow points away from a tiny city skyline.
RIGHT (devout_believer): a tiny pilgrim inside a tall church, neck craned
straight up at a huge rose window; a small "sore neck" spark at the neck.
```

### Group 4: treasure hunt (赏金猎人 · 屡败屡战 · 夺宝奇兵), all three done

```
LEFT (bounty_hunter): a closed treasure chest hit dead centre by a single
arrow, with a small gold "10x" floating above it.
MIDDLE (never_give_up): a parchment treasure map with one red X crossed out,
and a second X a little further on circled in gold beside an open chest.
RIGHT (raiders): a battered brown explorer's fedora and a coiled whip lying on
a heap of golden cards (a generic adventurer's hat, no character).
```

### Group 5: time and timing (下次一定 · 早起的鸟儿 · 应接不暇), all three done

```
LEFT (next_time): an empty open treasure chest with a cobweb inside, a fully
run-out hourglass next to it, and one moth fluttering out of the chest.
MIDDLE (early_bird): a small bird perched on an old gas street lamp at dawn,
holding a playing card in its beak instead of a worm; church spires as dark
silhouettes against a pink-orange sky.
RIGHT (spoilt_for_choice): a tiny tourist with spiral dizzy eyes, a ring of
ten small playing cards whirling around their head.
```

### Group 6: crossing the city (南来北往 · 串门儿 · 区区二十二), all three done

```
LEFT (north_to_south): a brass compass whose needle is a walking boot, with
the letters "N" and "S" at its ends.
MIDDLE (dropping_by): a small red-and-cream city tram seen from the side,
passing five tiny house doors, each with a doorbell.
RIGHT (a_mere_twenty_two): an open passport page with a neat grid of 22 small
round ink stamps, every one of them stamped.
```

### Group 7: knowing the place (本地人 · 穿越时空 · 建筑学家), all three done

```
LEFT (local): an old lady leaning out of a window with a flower box, giving a
friendly nod, with a beer mug on the sill.
MIDDLE (time_traveller): an hourglass whose falling sand is made of tiny
playing cards; a medieval tower sits in the top bulb and a concrete block of
flats in the bottom bulb.
RIGHT (architect): a drafting compass and set square lying over a building
facade split into three vertical strips: a Gothic pointed arch, a curvy
Baroque gable and a jagged Cubist zigzag.
```

### Group 8: odd places (为什么南极没有企鹅？ · 地铁跑酷 · 撞名), all three done (penguin redrawn with a crossed-out PRAHA boundary sign, train redrawn red and white, both at the user's request)

```
LEFT (southern-pole): a puzzled penguin in a knitted scarf standing on a green
city meadow next to a small signpost with a snowflake on it.
MIDDLE (subway_maniac): a tiny figure surfing on the roof of an underground
train that has stopped at the red-and-white buffer stop at the end of the line.
RIGHT (namesakes): five identical little churches in a row, each with the
same haloed saint statue in front; the saint on the last one wipes his brow.
```

### Group 9: castle, emperor, window (城堡征服者 · 查理大帝 · 别看窗户), all three done (the castle flies the Bohemian lion flag instead of a white flag, user's call)

```
LEFT (hradcany_conqueror): a castle on a hill with a small white flag of
surrender hanging from its tower, and a tiny visitor's flag planted at its gate.
MIDDLE (charles_iv): an old banknote with the portrait of a bearded old
emperor wearing a crown, and the number "100" in its corner.
RIGHT (mind_the_window): an open Gothic window high in a stone tower, a pair
of boots and a feathered hat flying out of it, a soft pile of hay waiting below.
```

### Group 10: Hussites, Kafka, music (圣杯与我同在 · 变形记 · 知音), all three done

```
LEFT (chalice_be_with_you): a golden chalice glowing with light, standing in
front of a plain black-and-red banner.
MIDDLE (metamorphosis): a large brown beetle wearing a black bowler hat,
sitting at a small writing desk with a quill and a sheet of paper.
RIGHT (prague_understands_me): a powdered white wig resting on a music stand,
with a sheet of music whose notes rise into a small heart.
```

### Group 11: schools, hospitals, keys (学霸 · 白衣天使 · 钥匙叮当响), all three done (hospital icon: a feverish card on a pillow, no red cross)

```
LEFT (top_of_the_class): a black graduation cap on top of a tall wobbly stack
of books, with a gold star above it.
MIDDLE (angel_in_white): a white nurse's cap and a stethoscope lying next to a
playing card with a small bandage stuck on it.
RIGHT (jingling_keys): a raised hand shaking a big bunch of keys, with little
motion lines, and a white-red-blue ribbon tied to the key ring.
```

(Group 11 is light in tone; it does not need the solemn line.)

### Group 12: occupation (类人猿行动 · 五月的街垒 · 勿忘)  *solemn*, all three done

```
LEFT (operation_anthropoid): a single parachute descending through a night sky
over the dark silhouette of a Baroque church.
MIDDLE (may_barricades): a street barricade of stacked cobblestones and an
overturned tram, with a small white-red-blue flag on top, in grey dawn light.
RIGHT (never_forget): one lit memorial candle in front of a stone wall covered
in rows of tiny handwritten names (illegible lines, not real text).
```

### Group 13: the Cold War, plus a default icon (坦克与春天 · 铁幕之下 · 默认图标)  *solemn*, all three done

```
LEFT (prague_spring): a small green sprout growing out of a tank track print
pressed into a cobblestone street.
MIDDLE (behind_the_iron_curtain): heavy rusted iron bars, and through a gap
between them a small patch of wall covered in colourful painted flowers and a
heart.
RIGHT (default): a plain tarnished brass trophy cup, slightly dented, on a
dark background (used for any achievement that has no icon yet).
```

Group 13's right icon is not solemn; it is a neutral fallback.

### Group 14: added later (第一步 · 一沓扑克牌 · 速度与激情), all three done

```
first_step (redrawn at the user's request): a hand reaching in from the
bottom of the frame, holding up a single playing card that shines with gold
sparkles, like a first prize.
full_deck: a neat, thick deck of playing cards fanned out in a perfect arc,
with two jester-hat joker cards standing out in front, one red and one black.
fast_and_curious: a red-and-cream city tram racing round a corner with speed
lines behind it, a playing card held in its front window like a prize, a
pocket watch hanging from its side showing the hands near the top of the hour.
```

### Group 15: modern Prague (古城的新面孔 · 布拉格的另一面), both done

```
new_faces (redrawn so both required places show): in front, old red-roofed
Baroque houses with a curvy two-tower "dancing" building (one glass, one cream
concrete) squeezed in among them, the old houses leaning away in surprise; on
a hill on the horizon, a small cluster of tall glass skyscrapers (Pankrác).
other_side: a tall grey concrete panel block of flats under an overcast sky,
rows of identical windows, one single window lit warm yellow with a small
pot of red geraniums on its sill.
```

### Group 16: river (七桥问题 · 伏尔塔瓦河上的鲁滨逊), both done

```
seven_bridges: a river seen from high above, crossed by seven little bridges
in a row, a dotted walking trail looping back and forth over them; a small
rolled-up mathematician's scroll lies in the corner.
castaway: a small green island in a blue river with one tree, a deckchair
and a tiny shipwrecked-style figure in a straw hat waving happily, a city
tram crossing a bridge in the background.
```

### Group 17: 火车迷

```
trainspotter: a trainspotter in an anorak with a notebook and binoculars on a
station platform, an old steam locomotive puffing past under an iron-and-glass
station roof.
```

### Group 18: 布拉格的曼彻斯特

```
manchester_of_prague: old red-brick factory halls with tall smoking chimneys
by a river, a big copper brewing kettle in front, one modern glass building
peeking in at the edge.
```
