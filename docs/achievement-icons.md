# Achievement icon prompts

Prompts for the achievement icons (2026-11-02). **One icon per generation**
(the user's tool can't do three at once): paste the style block below, then
one SUBJECT line from the groups further down. The tool returns 1024 x 1024;
Claude scales it to 256 px (cropping away any inner panel or margin the
generator drew; the style block now asks it to fill the square) and saves it as
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

### Group 3: kinds of cards (五颜六色 · 出城去 · 愿主保佑), all three done

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

### Group 12: occupation (类人猿行动 · 五月的街垒 · 八万个名字)  *solemn*, all three done

```
LEFT (operation_anthropoid): a single parachute descending through a night sky
over the dark silhouette of a Baroque church.
MIDDLE (may_barricades): a street barricade of stacked cobblestones and an
overturned tram, with a small white-red-blue flag on top, in grey dawn light.
RIGHT (never_forget): one lit memorial candle in front of a stone wall covered
in rows of tiny handwritten names (illegible lines, not real text).
```

Added 2026-11-05, done (light tone, no solemn line):

```
city_villages (城中村): a tiny old village chapel with a duck pond in front of it,
large in the foreground, with tall grey panel apartment blocks looming right
behind it on all sides.
```

Added 2026-11-05, *solemn*, done (add "large and fill most of the square" to the subject):

```
eighty_two_children (八十二个孩子): a single rose lying on the grass at the feet of
a small bronze child figure, in an empty green field at dusk.
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

### Group 17: 火车迷, done

```
trainspotter: a trainspotter in an anorak with a notebook and binoculars on a
station platform, an old steam locomotive puffing past under an iron-and-glass
station roof.
```

### Group 18: 布拉格的曼彻斯特, done

```
manchester_of_prague: old red-brick factory halls with tall smoking chimneys
by a river, a big copper brewing kettle in front, one modern glass building
peeking in at the edge.
```

### Group 19: the evening batch, done

```
wild_prague: a deep rocky gorge with a stream and wild trees, a hiker's boot
on a rock in front, a red city tram crossing a viaduct far in the background.
tower_and_general: a tall grey TV tower with little bronze babies climbing up
it, and at its foot a huge bronze one-eyed general on horseback, both looking
mildly at each other.
valley_of_laments (solemn-ish, no jokes): a misty green valley with an old
cannon on the ridge, smoke drifting, and a huge modern concrete bridge
spanning the valley in the background.
libuse_prophecy: a legendary princess in a long robe on a high rock above a
river, one arm stretched toward a distant city of spires with stars rising
above it.
golem_in_the_attic: a dusty synagogue attic under old roof beams, a big clay
Golem figure sleeping under a blanket, one candle, a curious tourist peeking
up through the trapdoor.
a_bowl_of_pho: a steaming bowl of phở with chopsticks, herbs and lime, on a
market stall counter with paper lanterns.
king_died_of_anger: a medieval king in a crown going red with fury, steam
coming out of his ears, reading a letter, in a ruined castle hall.
after_white_mountain (solemn, redrawn at the user's request): a low grey hill
with the white six-pointed-star summer palace (Hvězda) on top, and a fallen
red Bohemian lion flag crumpled in the grass of the slope.
```

### Group 20: day records (春风得意马蹄疾 · 日进斗金 · 风雨无阻), done

```
marathon_day: a galloping horse with a cheerful rider holding up a fan of cards, motion lines, a sun racing across the sky.
payday: a big leather money bag overflowing with gold coins stamped with tiny card symbols, a pay envelope beside it.
rain_or_shine: a walker under an umbrella, half the picture in rain and half in sunshine, seven little card icons in a row above.
```

### Group 21: 夜猫子 · 千里迢迢, done

```
night_owl: a wide-eyed owl on an old gas street lamp at night, a full moon and dark church spires behind, a black cat sitting below.
the_long_way_round: a winding country road over green hills to a distant castle, a backpack and walking stick in front, a sparkling diamond in the sky.
```

### Group 22: 为了市民 · 周游列国 · 这里没有游客, done

```
for_the_citizens: a tall teetering stack of paper forms on an old office desk, a rubber stamp mid-air about to come down, a town hall clock tower seen through the window.
around_the_world: a row of colourful little embassy flags (generic, no real national flags) on the facade of a Baroque palace, a tourist with an unstamped passport walking past.
no_tourists_here: a quiet outer-district street with panel houses, a small corner shop and a tram stop, a cat asleep on a bench, not a single tourist in sight, a lonely tour-guide umbrella left on the ground.
```

### Group 23: 特洛伊不在希腊 · 中立球迷, done

```
troy_not_in_greece: a big wooden horse on wheels standing in a garden in front of a red-and-white Baroque chateau, a giraffe peeking over the garden wall behind.
neutral_fan: a football fan in a scarf that is half red-and-white and half red-yellow-blue, shrugging, between two stadium floodlights.
```

### Group 24: 白银之城

```
city_of_silver (done; the accepted image has a miner's pick instead of the skull): a heap of shining silver Prague groschen coins in the foreground, behind them the three tent-shaped spires of St. Barbara's Cathedral in Kutná Hora, and a small skull resting among the coins.
```

### Group 25: 反复横跳

```
back_and_forth: a winding blue river running down the middle of the picture, a castle on a hill on the left bank and Gothic Old Town spires on the right bank; a small walker in a red scarf, slightly dizzy with little stars circling the head, leaps across the river, and a dotted golden footprint trail zigzags back and forth across the water five or six times behind them. The walker and the zigzag trail are large and clear. (No bridge: bridge cards don't count for this one.)
```

### Group 26: emperors and a general (AEIOU · 珍奇柜 · 大元帅), all three done (the general's hat came out a Napoleonic bicorne, accepted)

AEIOU done, regenerated on a gold background (an exception to the dark
background, user's call: black eagle on gold, the Habsburg colours). For that
one the style block's palette line was changed to "black, charcoal, warm gold,
brick red, parchment, on a bright golden-yellow background (the Habsburg
black-and-gold colours) with a soft vignette of slightly deeper gold at the
edges", and the subject asked for the crown and letters in a deeper gold with
dark outlines.

```
LEFT (aeiou): a big black double-headed eagle with one crown above both
heads; a red ribbon in its talons reads "AEIOU" in gold letters (the only
text allowed). The two heads turn to each other with puzzled looks, as if
neither knows what the letters mean.
MIDDLE (cabinet_of_curiosities): an open wooden curiosity cabinet crammed
with odd treasures: a brass telescope, a glass flask bubbling green smoke, a
narwhal tusk and a stuffed crocodile on top; a small lion cub peeks out of
the half-open bottom drawer.
RIGHT (generalissimo): a gold-tipped commander's baton lying across a black
general's hat with a huge red plume; beside them an unrolled star chart
covered in planet symbols and circles, a compass needle pointing at one star
(the general trusted his horoscope more than his officers).
```

### Group 27: the nation and its kings (真理必胜 · 国王之庭 · 以人为本), all three done

```
LEFT (truth_prevails), redrawn 2026-11-04 when it became Gold (the first one
was a fist holding the flag): a large old book lying open, a LARGE Czech flag
on a slim pole rising out of its pages as if growing from the writing, a quill
in an inkwell beside it, a few glowing illegible letters drifting up, the
green dome of the National Museum small in the distance. The revival "wrote"
the nation into being.
MIDDLE (aula_regia): a royal gold crown resting on a carved stone tomb slab
in a quiet Gothic cloister; a small monk sits at the slab's end writing in a
thick open chronicle, his quill moving fast.
RIGHT (renaissance_man): a Renaissance house facade covered in black-and-white
sgraffito; drawn on the wall in white chalk, a large circle with a square
inside it, and a small cheerful man standing in the middle with arms and legs
spread to touch the lines, as if measuring the building with himself.
```

### Group 28: Old Town, Lesser Town, Baroque (老城常客 · 小城不小 · 金碧辉煌), all three done (the first altar try came back as a giant key; it was redone with the altar spelled out and "NOT a key, NOT a castle, NOT soldiers")

```
LEFT (old_town_regular): a big astronomical clock dial in blue and gold with
its zodiac ring, Gothic stone around it; the little skeleton figure beside
the dial raises his hourglass like a toast to a coffee cup steaming on a café
table in the foreground. Clock large.
MIDDLE (lesser_town_not_less): a dense cluster of red-roofed Baroque houses
climbing a hill to a large green copper dome and a bell tower; a yellow tape
measure is stretched across the rooftops and runs out of the picture on both
sides, still not long enough.
RIGHT (all_that_glitters): a swirling gilded Baroque altar with twisted
columns and golden sunrays; a chubby cherub on top polishes the gold with a
small cloth, sweating, and sparkles fly everywhere.
```

### Group 29: rocks, hills, art (巴兰德的学徒 · 爬山虎 · 文艺青年), all three done

```
LEFT (barrandes_apprentice): a large fossil trilobite in a slab of layered
grey limestone, seen through a big brass magnifying glass, with a geologist's
hammer beside it; through the lens, the trilobite's eye looks back at the
viewer in surprise. Trilobite large.
MIDDLE (virginia_creeper): a climbing vine with bright red autumn leaves
creeping up a steep green hill toward a small steel lattice lookout tower on
the top; the vine's leading tip wears a tiny backpack.
RIGHT (art_lover): a white marble bust wearing a black beret and a long red
scarf, a tiny coffee cup and a sketchbook in front of it, red theatre curtains
half open behind it.
```

### Group 30: an achievement of achievements (五福临门), done

```
high_five: two hands meeting in a high five in the middle of the picture, a
burst of gold sparks at the touch, and five small gold medals flying out of
the burst like fireworks. Hands large.
```

### Group 31: 游侠骑士, done

```
knight_errant: a small knight on a horse riding along a winding road; along the road, three castles on wooded hills one behind the other, the nearest two with a small gold pennant planted on their towers and the farthest still without one. The knight and the nearest castle large.
```

### Group 32: 复乐园, done

```
paradise_found: tall pale sandstone rock towers rising out of a green pine forest, and on a steep hill behind them a ruined castle with two tall towers of different heights on two rock peaks; a small open gate in the foreground, made of two rock pillars, as if the way into paradise. The rock towers and the two-towered ruin large.
```

### Group 33: 皇帝的温泉 · 南方的玫瑰, both done (the rose came with a painted border, cropped off)

```
emperors_spring: a steaming hot spring bubbling up in an elegant stone colonnade with columns, a small porcelain spa cup with a spout in front of it; a hunting dog sits beside the spring with wet ears, looking very pleased with itself. The colonnade, cup and dog large.
rose_of_the_south: a large red five-petalled heraldic rose with a gold centre, carved on a stone castle gate, with a round painted Renaissance castle tower behind it rising over red rooftops and a river bend.
```

### Group 34: 铁与金之王, done

```
iron_and_golden_king: a king's crown split down the middle, the left half dark iron and the right half shining gold, resting on a stone tomb slab; behind it, a small map of Bohemia dotted with tiny towns and castles, each with a little flag stuck in it like pins.
```

### Group 35: early Bronze (小有收获 · 渐入佳境 · 冰箱贴三件套 · 明天见), all four done

```
small_harvest (redrawn 2026-11-04 with game cards instead of playing cards): a round wicker basket with a tall arched handle on a dark grey stone ledge, a shiny red apple at the front right and a few autumn leaves around it; inside, about ten plain game cards (NOT playing cards; white, blue, green, purple, red, gold) stand up slightly fanned out, as if just picked.
getting_the_hang (redrawn 2026-11-04; the first one was a map in a jeans pocket, then a card path uphill was tried twice): a hand rising from the bottom, palm open, fingers spread as if casting a spell, with about twenty plain game cards (NOT playing cards; white, blue, green, purple, red, gold) floating in a ring around it, sparkles and glowing trails between them, a dim blue Prague skyline at dusk behind. The pair to first_step's single card in a hand.
tourist_trio: a white fridge door with three big colourful souvenir fridge magnets stuck on it: one shaped like the two dark Gothic spires of Týn Church, one like a stone bridge with statues and a bridge tower, one like a big Gothic cathedral on a hill; a hand is pressing the last magnet into place. The three magnets large.
see_you_tomorrow: a pocket calendar with two pages side by side, each with a small gold tick, a sunrise over red rooftops and church spires behind it.
```

### Group 36: 翻开史书, done

```
turning_the_page: a big old leather-bound history book lying open, one page caught mid-turn; on the left page a small drawing of a dragon and a crowned legendary princess, on the right page a small drawing of a real stone castle and a king with a sword; a reading candle beside it.
```

### Group 37: 新手村, done

```
starter_pack: Old Town Square drawn like the starting village of an old role-playing game: the astronomical clock tower and the two dark spires of Týn Church around a cobbled square, a column with a gold statue in the middle; a tiny new adventurer with a wooden sword and a backpack stands in the centre, and a big gold exclamation mark floats above the clock like a quest marker (the only symbol allowed). Square, clock and adventurer large.
```

### Group 38: 城春草木深, done

```
spring_among_the_ruins: a ruined castle tower with half its wall fallen away and no roof, a young tree growing straight out of the top and ivy and spring blossoms climbing the stones; a small bird sits in the empty window. The tower and the tree large.
```

### Group 39: 跌宕起伏, done with the redraw prompt below (the first image, drawn for the Teleček-only 一览众山小, showed only the high point; it stays as the Teleček card's cover)

Redraw prompt for both ends:

```
highs_and_lows: a split scene in one picture: on the upper left, a tiny climber in mountaineering gear planting a little flag on top of a gently sloping farm field with a motorway behind it; a winding dotted footpath zigzags down across the picture to the lower right, where the same tiny figure sits relaxed on the bank of a wide blue river next to a small railway platform with a train, dangling their feet over the water. The two figures, the flag and the river large.
```

```
highs_and_lows (as drawn): a tiny climber in full mountaineering gear (rope, ice axe, goggles) planting a little flag in the middle of a perfectly flat, ordinary farm field; a motorway with small cars in the background and a gentle hill on the horizon. The climber and flag large.
```

### Group 40: 波希米亚海岸, done

```
coast_of_bohemia: a tiny Prague pond with reeds and a single duck, on whose shore stand a striped beach umbrella, a deckchair and a little sandcastle; a toy sailing ship floats in the pond and a lighthouse no taller than the reeds stands at its edge. The pond, umbrella and lighthouse large.
```

### Group 41: 金光闪闪 · 它们晚上会发光 · 两河交汇, all three done

```
pure_gold: a fan of five golden playing cards, each with a small crown, shining so brightly that a tiny figure in front shields their eyes with one hand and puts on sunglasses with the other.
they_glow_at_night: a dark bedroom at night, a half-open wooden drawer glowing from inside with purple, red, gold and silver light from a stack of cards; a sleepy figure in a nightcap peeks over the blanket at it, eyes wide open.
where_two_rivers_meet: seen from above, two rivers meeting in a Y shape among green meadows, one narrower and a little browner, one wide and blue; a small walker with a backpack stands on the tip of land between them, a pair of binoculars raised.
```

### Group 42: 从伏尔塔瓦到易北河, done

```
vltava_to_elbe: a castle on a hill above a wide river bend where two rivers meet; on the water below, a small boat carries a wooden signpost with two arrows, the boatman cheerfully taking down one painted river sign and putting up another, as if the river were changing its name right there. Castle, boat and signpost large.
```

### Group 43: 布拉格的小波兰, done (second try)

```
little_poland (redrawn: the first try's flag was too small, and the user asked for a Czech flag too, for the Czech-Polish friendship the estate was built to show): two LARGE flags, fully unfurled side by side and clearly lit, flying from the roof of a grey concrete panel block of flats: the Polish flag (a white stripe on top, a red stripe below, no emblem) and the Czech flag (a white stripe on top, a red stripe below and a blue triangle at the pole), their poles leaning toward each other like a handshake; below, a hospital park with an old fence, over which a little stage with musicians and a cheerful crowd can be seen. The two flags large. NOT a picture frame, NO border.
```

### Group 44: 吸血鬼, done

```
vampire: a pale, polite cartoon vampire in a black high-collared cape (an original character, not Dracula from any film), standing at the gate of a dark Gothic castle on a crag under a full moon, holding a thick stack of playing cards like a proud collector; a few bats circle the towers. The vampire and the castle large.
```

### Group 45: 此岸彼岸 · 埃菲尔铁塔的弟弟 · 两匹马 (埃菲尔铁塔的弟弟 and 两匹马 done; 此岸彼岸 done with the redraw prompt below, plus "a SQUARE composition" and "Do NOT write any text" (one try wrote the prompt text into the picture))

```
both_banks (redrawn: the first try drew a fairy-tale castle, and the walkers stood on the bridge): a wide river seen from above with a stone bridge across it. On the left bank, on a hill, Prague Castle: a LONG, LOW row of pale palace buildings stretched along the ridge, with the tall dark Gothic spires of a cathedral rising from behind its middle; NOT a fairy-tale castle, NOT a cluster of round towers with pointed roofs. On the right bank, Gothic spires and red roofs. A tiny walker stands on each riverbank (on the grass, not on the bridge) waving at the other, and they are clearly the same person, with the same red scarf.
little_eiffel: a slim steel lattice lookout tower on a green wooded hill, unmistakably shaped like a small Eiffel Tower; at its foot a tiny red funicular car climbing the slope, and in the corner a much bigger Eiffel Tower silhouette far away on the horizon, looking jealous. The hill tower large.
two_horses: side by side, a proud bronze statue of a knight on a horse on a tall stone pedestal, and the same knight sitting on a horse that hangs upside down by its legs from the ceiling of an elegant glass-roofed arcade, as if it were the most normal thing in the world. Both horses large.
```

### Group 46: 前任, done (redrawn with the cracked photo on the wall; its inner panel border was cropped off)

```
the_ex: two people sitting in two separate armchairs a polite little distance apart, both turned toward an old box television showing an ice-hockey game; between them a shared bowl of popcorn. Each holds a small flag: on the left the Czech flag (white stripe on top, red below, blue triangle at the pole), on the right the Slovak flag (white, blue and red horizontal stripes with a small red shield bearing a white double cross). A half-packed cardboard box of their split-up belongings sits on the floor between the armchairs. On the wall above the television hangs a framed photo of the two of them standing arm in arm, its glass cracked straight down the middle, splitting the two apart. The two figures, their flags and the cracked photo large.
```

### Group 47: 门儿清, done (second try: the book became a phone, at the user's request; the generator drew a rounded inner panel again, cropped away)

```
know_the_area: a passenger sitting by the window of an old red-and-cream Prague tram, absorbed in a smartphone held in both hands; the glowing phone screen shows a little map of a city district with a big gold location pin on it, its light falling on the passenger's face. Through the tram window, red roofs and a church spire slide past, the very place on the screen. The passenger, the glowing phone and the window large.
```

### Group 48: 司空见惯 · 高耸入云 · 此心安处 · 圣鲁德米拉的面纱 · 冰箱贴四件套, all five done (inner panels and vignettes cropped away; tourist_trio redrawn with four magnets)

```
seen_it_all: a bored tourist slumped on a bench in front of a magnificent old Prague street of pastel Baroque houses, yawning hugely with one hand over the mouth, not looking at any of it; beside the tourist a tall, teetering stack of plain cream-coloured game cards.
reaching_for_the_sky: looking up from the ground at a soaring dark Gothic cathedral tower, its pointed arches and spires narrowing as they rise, the very tip disappearing into a bank of cloud; a tiny pigeon sits on a gargoyle halfway up, looking dizzy.
good_place_to_live: a neat small-town square with a little white town hall tower and a green lawn; in the middle a large gold first-place rosette ribbon pinned to a garden fence, and a contented person in a deck chair with a cup of coffee, a small train in the background heading off toward a distant city.
ludmilas_veil: a long pale veil lying across dark stone on a hilltop, with the low broken walls of a small ruined castle behind it under a cold moon; a single gold cross of light rests on the veil. Solemn and quiet, no figures, NO joke.
tourist_trio: a white fridge door with FOUR big colourful souvenir fridge magnets stuck on it: one shaped like the two dark Gothic spires of Týn Church, one like the round gold Astronomical Clock, one like a stone bridge with statues, one like a tall Gothic cathedral with a green spire.
```

### Group 49: 一路向北, done (its inner panel cropped away)

```
down_the_vltava: a small wooden rowing boat drifting down a wide river seen from slightly above, the rower resting the oars and letting the current do the work; along the banks, one after another into the distance, a small white chateau on a rock, a broken castle ruin on a cliff and a little church on a hill; a gold compass needle on the boat's bow points forward, north.
```
