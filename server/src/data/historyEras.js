// Static definition of the seven History Timeline eras — deliberately not a
// DB collection, same reasoning as RARITY_XP in rarityMap.js: this is a
// small, rarely-changing enum that's cheap to keep as code. `order` is
// documentation only — the frontend (HistorySidebar) renders eras by simply
// iterating this array in declaration order, it does not sort by `order`,
// so the array's own position IS the effective sequence; keep them in sync.
// `themeClass` is applied to the timeline track's era segment so
// client/src/styles/history.css can theme each era (background gradient,
// accent colour) with plain CSS — no extra art assets. `hasContent` lets the
// frontend show a "coming soon" segment for eras that don't have seeded
// HistoryEvent docs yet, without needing a live query just to know that.
// `tagline` is a one-line, in-voice joke summarizing the era, rendered on
// HistoryEraDivider — the banner HistoryPage's feed shows at each era
// boundary (see client/src/components/history/HistoryEraDivider.jsx). Only
// eras 1–2 have that banner actually appear today, since the other five have
// no events to precede it, but every era gets a tagline up front so nothing
// needs writing later when its events finally land.
//
// Eras 1 and 2 (legends-origins, bohemian-duchy) are built out — see
// server/src/data/seedHistoryEvents.js. Era 1 originally ran all the way to
// Wenceslas's murder (935), but that meant purely-legendary content
// (Libuše, Přemysl, seven unverifiable dukes) and documented-history content
// (Bořivoj onward, real sources, real dates) shared one heading, blurring a
// distinction the whole point of the timeline is to make legible. Split
// 2026-08: Era 1 now ends at 800 (last of the legendary dukes), and
// everything from Bořivoj (870, the first documented duke) through Otakar I
// securing a hereditary crown (1198/1212) became its own era, 2.
//
// Era 3/4 split (2026-08-23): what used to be one era, 'kingdom-golden-age'
// spanning 1199-1378, got split into two on the user's own observation that
// "Bohemia's golden age" in actual historiography means Charles IV's reign
// specifically (1346-1378: Prague as imperial capital, Charles University,
// St. Vitus construction, the Golden Bull) — not the 148 years before it,
// which cover Otakar II's rise-and-collapse at Marchfeld, the Wenceslas II
// guardianship crisis, the 1306 Přemyslid extinction, and John of
// Luxembourg's own reign (1310-1346), a "wandering king" rarely in Bohemia
// and famous for mortgaging crown lands, not building a golden age — he
// reads, in retrospect, as spending his whole reign banking the political
// capital his son Charles cashed in in 1346, the same father-sets-up-son
// pattern this timeline's own 'the-crown-he-didnt-win-1254' arc already
// used once before, just with vastly higher stakes. 'kingdom-golden-age'
// keeps its key and now refers ONLY to 1346-1378; the new era,
// 'rise-of-a-kingdom', takes over 1199-1345 (all ~32 previously-seeded
// events under the old single era got migrated to this new key, since none
// of them post-date 1345 — verified via startYear before migrating).
// yearRange corrected 2026-08-26 to 1199-1346 once the era's own content
// actually grew to include John's death and Charles's King-of-the-Romans
// election, both dated 1346 — the user's own explicit call to keep those as
// this era's closing bookend rather than kingdom-golden-age's opening one
// (see the History Timeline progress notes elsewhere in this file). The
// eras now share 1346 as a boundary year by design, not by mistake:
// kingdom-golden-age's own yearRange stays 1346-1378 unchanged.
//
// Era 5/6 split (2026-08-24, decided before any content existed for either —
// no migration needed, unlike the Era 3/4 split above): 'religious-turmoil'
// originally had no yearRange set at all and its tagline's plural "new and
// creative ways to throw people out of windows" implied it would cover both
// the First (1419) and Second (1618) Defenestrations of Prague — a ~240-year
// span, longer than the one that already triggered the Era 3/4 split above.
// Split at 1526 (Ferdinand I's accession, the start of Habsburg rule over
// Bohemia): 'religious-turmoil' now covers only 1378-1526 (the Great Schism,
// Hus, the First Defenestration, the Hussite Wars, the Basel Compacts,
// George of Poděbrady, the Jagiellonian dynasty, ending at the 1485 Peace of
// Kutná Hora) — a genuinely Bohemian-internal religious civil war. The new
// era, 'habsburg-rule' (1526-1620), covers the tense, superficially calm
// interval between the new Catholic Habsburg dynasty and Bohemia's Protestant
// nobility, ending at the Second Defenestration (1618) and the Battle of
// White Mountain (1620). Deliberately NOT named after a monarch (matching
// the 'kingdom-golden-age' precedent, which was reverted from a
// Charles-IV-specific title back to a thematic one) — but the user explicitly
// confirmed 'Habsburg Rule' itself is fine as a title despite naming a
// dynasty, since Habsburg rule continues for centuries after 1620 too: era
// titles describe each chapter's own narrative focus, not the full span of
// every fact that remains true afterward — later eras (Renaissance & Baroque,
// National Revival) simply pivot focus elsewhere while Habsburg rule
// continues unremarked in the background. The two taglines were written as a
// matched pair: era 5's now sets up "a new local tradition" (defenestration)
// that era 6's pays off as "one memorable encore" — don't edit one without
// checking the other still lands.
//
// Era 7/8 follow-up (2026-08-24, same session as the Era 5/6 split above):
// the user asked for the 1618-1689 stretch (Second Defenestration through
// the Great Fire of Prague) to become its own era too, rather than folding
// into 'habsburg-rule' or 'renaissance-baroque'. Fix: 'habsburg-rule' pulled
// back in from 1620 to 1618 (ending right at the Second Defenestration
// itself, the exact beat its own tagline's "one memorable encore" already
// pointed to), and a new era, originally 'thirty-years-war' — renamed to
// 'fire-and-ashes' (see the note below) — (order 7, 1618-1689), takes
// the war itself, White Mountain (1620), and the ~40-year gap after the
// Peace of Westphalia (1648) up to the 1689 fire. Rudolf II's Renaissance
// court (1583-1612) stays inside 'habsburg-rule' on the user's own call, even
// though it doesn't perfectly match that era's political-tension framing —
// simpler than carving out yet another era for one court's cultural output.
//
// This forced a rename of the old 'renaissance-baroque' (order 8, now
// 'age-of-absolutism'): with Rudolf II's Renaissance content staying in
// 'habsburg-rule', this era no longer covers two rebuilding waves (its old
// tagline said "rebuilt... twice") — just the post-1689 Baroque one, plus
// Habsburg absolutist consolidation (Maria Theresa 1740-1780, Joseph II's
// Enlightened-absolutism reforms 1780-1790: the Patent of Toleration, the
// abolition of serfdom). yearRange set to 1689-1790, ending at Joseph II's
// death — a clean bridge into 'revival-industrialization' next. Deliberately
// NOT named after the Czech historiographical term "Temno" ("the Dark Age"),
// which the user explicitly flagged as inappropriate for a title: that term
// was coined by 19th-century National Revival-era historians (via Alois
// Jirásek's novel of the same name) specifically to cast this period as
// bleak so the Revival's own "awakening" would read as more necessary and
// heroic by contrast — a loaded, retrospective nationalist framing, not a
// neutral description, and this period actually saw real Baroque cultural
// flourishing. 'Age of Absolutism' was the user's own pick, matching the
// period name used in Europa Universalis IV — plain, period-accurate,
// no value judgment baked in.
//
// Same session, one more rename: 'revival-independence' (order 9) became
// 'revival-industrialization', title "National Revival & Industrialization"
// — "Independence" described only the single event that ends the era
// (1918), not the 128-year throughline; industrialization (Bohemia was one
// of the Austro-Hungarian Empire's most industrialized regions through the
// 19th century) is the actual sustained content. 1918 independence is still
// exactly where the era's content ends — it's just not named in the title,
// same as 'kingdom-golden-age' doesn't name Charles IV's 1378 death. Key
// renamed too (nothing referenced the old key yet — zero seeded content, a
// free rename), yearRange set to 1790–1918.
//
// Era 10 split into three (2026-08-24, same session): the user's own call —
// the 20th century has far denser, far better-documented source material
// than any earlier era, so one single 'hasContent: false' placeholder
// ('20th-century-upheaval') wasn't going to hold up once real content
// started landing. Replaced with three eras:
// - 'brief-independence' (order 10, 1918-1938): the First Republic —
//   interwar Czechoslovakia's real, functioning democracy, ending at the
//   1938 Munich Agreement.
// - 'nazi-nightmare' (order 11, 1938-1945): Munich through the Protectorate
//   of Bohemia and Moravia, forced armaments production (Škoda, ČKD) for
//   the German war machine, Heydrich's rule and Operation Anthropoid, to
//   liberation in 1945. Deliberately solemn tagline, no joke — matching the
//   existing project convention for atrocity-heavy content (see
//   feedback_solemn_content_tone in memory) extended here to a whole era's
//   tagline for the first time, not just one HistoryEvent card.
// - 'cold-war-sorrow' (order 12, 1946-1992): Communist Czechoslovakia,
//   1968 and the Soviet invasion, to the Velvet Revolution (1989) and the
//   dissolution process that ends the unified state. Its tagline reuses and
//   narrows the old '20th-century-upheaval' tagline's "tanks... secret
//   police... one remarkably polite revolution" line almost verbatim — that
//   joke belonged here specifically, not to the whole century, so it moved
//   rather than getting rewritten from scratch.
// Titles/CZ went through several rounds before landing: the user first asked
// for 1938-1945 to read as "Fear Under Nazi Occupation," then wanted "fear"
// swapped for a more literary word (chose "nightmare"/梦魇 from several
// offered alternatives), then simplified the whole title down to just "The
// Nazi Nightmare" (纳粹梦魇) — don't assume the first framing offered is
// the one that sticks; this took three iterations. Renamed again 2026-10-09
// to "Occupation and Resistance" / "Okupace a odboj" / 占领与抵抗: names the
// era from the Czech side rather than the occupier's, matches the standard
// Czech phrase, and keeps the restrained 20th-century tone. Four-character
// ZH alternatives were rejected as less apt; the key stays 'nazi-nightmare'.
//
// Same day, 'cold-war-sorrow' (then 1946–1989) was split at the August 1968
// invasion: 'cold-war-sorrow' (order 15) is now "Dictatorship and Thaw"
// (1945–1968, closing on the Prague Spring) and the new
// 'occupation-and-dissent' (order 16) is "Occupation and Dissent"
// (1968–1989, opening on the invasion). The three titles deliberately rhyme
// (占领与抵抗 → 专政与解冻 → 占领与异见): the user saw 1938–1989 as one
// continuous run of occupation and resistance under different oppressors.
// The middle era says 专政 rather than 占领 on purpose, because 1945–1968 was
// a homegrown regime (the 1946 election, the 1948 coup) with no Soviet troops
// in the country; "occupation" is literal again from 1968, when Czechs
// themselves called it okupace and the troops stayed until 1991. The start
// year also moved from 1946 to 1945 to close the gap with era 14.
//
// Also 2026-10-09: 'habsburgs-move-in' (then 1526–1618) was split at 1583,
// when Rudolf II moved the imperial court to Prague. 'habsburgs-move-in'
// keeps "Under the Double-Headed Eagle" for 1526–1583; the new
// 'age-of-wonders' (order 9, 1583–1618) is the user's 奇珍盛世 /
// "An Age of Wonders" / "Věk divů", ending on the 1618 defenestration (shared
// year with 'fire-and-ashes'). 盛世 means material and cultural splendour,
// not good government (politically it was a slide: Rudolf's illness, the
// brothers' quarrel, the 1611 Passau invasion). Not named after Rudolf on
// purpose, see the rejected "Rudolf's Prague" above. Rejected alternatives:
// 炼金盛世 (alchemy is only half the story and partly legend), 帝都盛世,
// 浮华盛世, 星辰与炼金.
//
// Also 2026-10-09: 'baroque-and-darkness' (then 1648–1740, "Baroque and
// Darkness") was split at the 1689 Great Fire of Prague. New 'voiceless-years'
// (order 11, 1648–1689) is the user's 失语的岁月 / "The Voiceless Years" /
// "Oněmělá léta": 失语 = losing both one's public voice and one's language.
// 'baroque-and-darkness' keeps its key for 1689–1740, retitled 暗夜华章 /
// "Splendour in the Dark" / "Nádhera v temnotě": High Baroque splendour while
// the 'darkness' never lifts. Don't title the second half a "dawn"
// (巴洛克黎明 was rejected): Baroque began long before 1689, and
// Germanization deepened after 1740; the real dawn is the National Revival.
// 1689 is a Prague event, which suits a city-history boundary even though it
// was rejected as the end of the war era. Both titles lean toward the
// contested "Temno" view, so the background card on that debate is still due.
//
// Also 2026-10-09: 'revival-industrialization' (then 1790–1918) was split at
// 1848 (the Slavic Congress and the Whitsun uprising in Prague, the end of
// serfdom). It keeps its key for 1790–1848, now just 民族复兴 / "The National
// Revival" / "Národní obrození", which matches the Czech historiographical
// term's usual end date; the user's alternative 重拾文化 was less precise.
// New 'chimneys-and-song' (1848–1918) is the user's 烟囱与歌 / "Smokestacks and
// Songs" / "Komíny a písně": the chimneys for industry, the song both for the
// era's operas and for the national movement's march toward the 1918
// republic. It briefly shipped as 机器轰鸣 / "The Roar of the Machines", which
// the user dropped as too cold and one-sided. The National Theatre was
// considered for the title and rejected as only one card's worth.
//
// Also 2026-10-09: 'rise-of-a-kingdom' (then 1199–1346, 77 cards) was split
// at the 1306 extinction of the Přemyslids. It keeps its key and title for
// 1199–1306, closing on four-centuries-ended-1306 / seven-kings-then-none-1306;
// the 25 cards from crowned-twice-1307 on moved to the new
// 'crown-changes-hands' (order 4, 1306–1346), the user's 王冠易主 /
// "The Crown Changes Hands" / "Koruna mění majitele". The user preferred it to
// John-centred titles because several cards are about the 1306–1310
// interregnum and civil war, not John, and because it shows at a glance that
// the dynasty broke here.
//
// Final era added (2026-08-24, same session): 'freedom-and-prosperity'
// (order 13) — the Velvet Divorce and everything since (NATO/EU accession,
// the post-Communist recovery). Tone returns to the earlier-era wry-but-light
// register (see feedback_20th_century_tone in memory) rather than staying
// restrained — this era is genuinely about stability and prosperity, not
// more repression to write carefully around.
//
// Boundary correction, same session: the user initially asked for this era
// to start at 1993 (the Velvet Divorce itself), but caught their own
// conflation of the Velvet Revolution (Nov 1989, Communism falls — ends
// 'cold-war-sorrow') with the Velvet Divorce (1 Jan 1993, Czechoslovakia
// splits in two — a 'freedom-and-prosperity' event). Corrected: 'cold-war-
// sorrow' now ends at 1989 (not 1992), and 'freedom-and-prosperity' now
// starts at 1990 (not 1993) — its opening beat is the messy 1990-1992
// post-Communist transition (new social/economic problems surfacing once
// one-party rule was gone) that leads *into* the 1993 split, not the split
// itself as a cold open. Tagline rewritten to match: "Communism falls...
// solving one of them, eventually, by splitting into two countries."
//
// Rename (2026-08-24, same session, later): 'thirty-years-war' became
// 'fire-and-ashes'. An outside review (a second Claude instance, run by the
// user against this file) correctly flagged that a title literally named
// "The Thirty Years' War" covering 1618-1689 conflicts with that war's own
// internationally-recognized end date, the 1648 Peace of Westphalia — a
// title THIS specific, tied to a date THAT well-known, reads as an error to
// anyone who knows the history, even though the 1618-1689 range itself was
// a deliberate, already-discussed choice (see the note above: the user
// explicitly chose "The Thirty Years' War" over an offered "War and Its
// Aftermath" alternative, precisely trading off precision for brevity).
// Rather than reopening the year-range question, the fix was a title that
// sidesteps needing to match a famous date at all: 'Fire and Ashes' (战火与
// 灰烬) — "fire" doing double duty for both the war itself and the literal
// 1689 Great Fire of Prague that closes the era, "ashes" for the
// devastation left behind. No year-range change needed once the title no
// longer promises to be *the* Thirty Years' War specifically.
//
// One more rename from the same outside review, this one hitting harder:
// 'habsburg-rule' (1526-1618) became 'habsburgs-move-in'. The review's
// point, independently verified: Bohemia's monarchy stayed *legally
// elective* the whole 1526-1618 span — Ferdinand I won the crown in 1526
// via a vote of the Bohemian Estates, and while later Habsburgs kept
// re-winning it through dynastic momentum, the elective *right* itself
// wasn't actually abolished until Ferdinand II's 1627 Renewed Land
// Ordinance (Verneuerte Landesordnung), which imposed hereditary male-line
// Habsburg succession, stripped the Estates' autonomy, and legally
// established absolutism in its place. So "Habsburg Rule" as a title for
// 1526-1618 was quietly claiming a level of dynastic entrenchment that
// hadn't legally happened yet — the same shape of error the 'kingdom-
// golden-age' rename fixed once already (a title cashing a check the
// timeframe hadn't earned). Note: the review's own claim that 1627
// "almost exactly coincides" with where 'fire-and-ashes' ends (1689) does
// NOT hold up — 1627 sits just 9 years into that era (which starts 1618),
// 62 years short of its 1689 end. 1627 reads far more naturally as part of
// 'fire-and-ashes' own story (the direct legal codification of what White
// Mountain, 1620, already decided by force — its own tagline already says
// as much: "White Mountain ends Bohemian self-rule in a single
// afternoon"), so that era's boundaries were NOT touched. Of the three
// renamed titles the review offered, "Rudolf's Prague" was rejected outright
// (an individual-ruler-named era, the exact pattern 'kingdom-golden-age'
// already ruled out) and "Twilight of the Elective Throne"-style options
// were set aside as too literary against the user's own established
// preference for a plain register (see the round-1 naming lesson above) —
// landed on 'The Habsburgs Move In' / "哈布斯堡入主" instead, which keeps
// the dynasty name (still fine per that same round-1 ruling) but swaps
// "Rule" for a verb that doesn't overclaim how settled that rule already
// was. The user's own framing for why this works: it explicitly foreshadows
// the four centuries of Habsburg rule still to come, rather than asserting
// that rule as already fully arrived.
// Era 5/6 split (2026-10-07, at the user's request): 'religious-turmoil'
// had grown to 100+ cards that all fall in 1378-1437, a complete arc from
// the late-Luxembourg crisis through Hus and the Hussite Wars to the
// Compacts and Sigismund's death (the end of the Luxembourg line). It keeps
// its key (no migration) but is retitled "Chalice and Turmoil" and now ends
// at 1437. The rest of the old span became two eras, titles chosen by the
// user: 'lone-king' ("The Lone King" / "孤王守国", 1437-1471: Albert, the
// interregnum, Ladislaus Posthumous, and above all George of Poděbrady,
// elected 1458, excommunicated, fighting a crusade and Matthias Corvinus
// until his death in 1471) and 'rule-of-the-lords' ("Rule of the Lords" /
// "贵族之治", 1471-1526: the Jagiellonians, mostly absent in Buda, the
// estates in charge, the 1483 defenestration, the 1485 Peace of Kutná Hora,
// the 1500 Land Ordinance, ending at Mohács). Adjacent eras share their
// boundary years (1437, 1471), like the 1346 boundary of eras 3/4. A first
// draft named the 1437-1526 era 'king-of-two-peoples'; the user rejected
// the title. The 'habsburgs-move-in'
// tagline used to say "the tradition from the last chapter"; with a new era
// in between it now names the window outright.
//
// Renames and a further split (2026-10-07, the user's calls): era titles
// 'habsburgs-move-in' -> "Under the Double-Headed Eagle" / "双头鹰下",
// 'brief-independence' -> "The First Republic" / "第一共和" (keys kept, no
// content yet). 'age-of-absolutism' was split at 1740, Charles VI's death
// and Maria Theresa's accession, into 'baroque-and-darkness' and
// 'age-of-absolutism', now "Enlightened Absolutism" / "开明专制" (1740-1790:
// Maria Theresa and Joseph II's reforms). The user then moved the
// 'fire-and-ashes' end from 1689 to 1648: the Great Fire of 1689 only
// mattered to Prague, while the Peace of Westphalia is a boundary on the
// scale of the other eras' (and the war both began and ended in Prague,
// 1618 defenestration to the 1648 Swedish attack held off on the stone
// bridge). 'baroque-and-darkness' ("Baroque and Darkness" / "Baroko a temno"
// / "巴洛克与黑暗", 1648-1740) deliberately pairs the Baroque splendour with
// the "Temno" (dark age) view: Counter-Reformation, exile, Germanisation,
// the decline of Czech. "Temno" itself is a contested 19th-century
// nationalist label (popularised by Jirásek's 1915 novel, usually meaning
// 1620-1781), so the title pairs it rather than adopting it; explain the
// term and the historians' debate in a background card when the era is
// written. Its tagline calls back to the 1393 card on Nepomuk being thrown
// from the bridge. A first draft titled 1689-1740 "The Baroque Chapter" /
// "巴洛克华章". 16 eras.
//
export const HISTORY_ERAS = [
  {
    key: 'legends-origins',
    order: 1,
    themeClass: 'era-legends-origins',
    hasContent: true,
    title: {
      en: 'Legends & Origins',
      cz: 'Legendy a počátky',
      zh: '传说与起源',
    },
    yearRange: {
      en: 'Prehistory – 800',
      cz: 'Pravěk – 800',
      zh: '史前 – 800年',
    },
    tagline: {
      en: "Where the sourcing is shaky, the drama is not — and at least one of these dukes may never have existed at all.",
      cz: "Kde jsou prameny vratké, drama rozhodně ne — a přinejmenším jedno z těchhle knížat možná nikdy neexistovalo.",
      zh: "史料摇摇欲坠，戏剧性却毫不含糊——这些公爵里，至少有一位很可能压根就没存在过。",
    },
  },
  {
    key: 'bohemian-duchy',
    order: 2,
    themeClass: 'era-bohemian-duchy',
    hasContent: true,
    title: {
      en: 'Duchy of Bohemia',
      cz: 'České knížectví',
      zh: '波希米亚公国',
    },
    yearRange: {
      en: '870–1198',
      cz: '870–1198',
      zh: '870年－1198年',
    },
    tagline: {
      en: "Real names, real dates, and remarkably little improvement in how this family settles an argument.",
      cz: "Skutečná jména, skutečná data — a překvapivě žádné zlepšení v tom, jak si tahle rodina řeší spory.",
      zh: "有了真实的姓名和真实的年代——可这个家族解决分歧的方式，却丝毫没有长进。",
    },
  },
  {
    key: 'rise-of-a-kingdom',
    order: 3,
    themeClass: 'era-rise-of-a-kingdom',
    hasContent: true,
    title: {
      en: 'The Rise of a Kingdom',
      cz: 'Vzestup království',
      zh: '王国风云',
    },
    yearRange: {
      en: '1199–1306',
      cz: '1199–1306',
      zh: '1199年－1306年',
    },
    tagline: {
      en: "The crown finally stays put, silver turns up in the hills, and one king rides as far as the Adriatic. Then a dynasty four centuries old ends in a single afternoon in Olomouc.",
      cz: "Koruna konečně drží, v kopcích se najde stříbro a jeden král dojede až k Jadranu. Pak čtyři sta let starý rod skončí během jediného odpoledne v Olomouci.",
      zh: "王冠终于戴稳了，山里挖出了白银，一位国王一路打到了亚得里亚海边。然后，一个延续了四百年的王朝，在奥洛穆茨的一个下午突然断了。",
    },
  },
  {
    key: 'crown-changes-hands',
    order: 4,
    themeClass: 'era-crown-changes-hands',
    hasContent: true,
    title: {
      en: 'The Crown Changes Hands',
      cz: 'Koruna mění majitele',
      zh: '王冠易主',
    },
    yearRange: {
      en: '1306–1346',
      cz: '1306–1346',
      zh: '1306年－1346年',
    },
    tagline: {
      en: "Foreign claimants take turns on an empty throne, a civil war or two later a family arrives from Luxembourg, and its blind king spends his whole reign setting up his son's punchline.",
      cz: "Cizí uchazeči se střídají na prázdném trůnu, o občanskou válku či dvě později přichází rod z Lucemburska a jeho slepý král celou svou vládu stráví přípravou vtipu, jehož pointu pronese až jeho syn.",
      zh: "外来的竞争者轮流坐上空出来的王位，打了一两场内战之后，一个家族从卢森堡来到了这里；它那位失明的国王，耗尽整个统治期，只为给儿子的黄金时代当垫脚石。",
    },
  },
  {
    key: 'kingdom-golden-age',
    order: 5,
    themeClass: 'era-kingdom-golden-age',
    hasContent: true,
    title: {
      en: 'The Golden Age',
      cz: 'Zlatý věk',
      zh: '黄金时代',
    },
    yearRange: {
      en: '1346–1378',
      cz: '1346–1378',
      zh: '1346年－1378年',
    },
    tagline: {
      en: "The one stretch where nearly everything Bohemia built is still standing — try not to get used to it.",
      cz: "Ten jeden úsek, kdy skoro všechno, co Čechy postavily, ještě stále stojí — na to si radši nezvykejte.",
      zh: "波希米亚建的东西，罕见地大部分都保留至今——可别太习惯了。",
    },
  },
  {
    key: 'religious-turmoil',
    order: 6,
    themeClass: 'era-religious-turmoil',
    hasContent: true,
    title: {
      en: 'Chalice and Turmoil',
      cz: 'Kalich a nepokoje',
      zh: '圣杯乱世',
    },
    yearRange: {
      en: '1378–1437',
      cz: '1378–1437',
      zh: '1378年－1437年',
    },
    tagline: {
      en: "The Church splits in two, Jan Hus goes to the stake, and Prague founds a new local tradition: councillors, out of the window. Eighteen years of war later, the cup of wine is still there, and almost everyone who fought over it is gone.",
      cz: "Církev se rozštěpí vedví, Jan Hus skončí na hranici a Praha založí novou místní tradici: konšely z okna. Po osmnácti letech války kalich vína pořád stojí, ale skoro nikdo z těch, kdo o něj bojovali, už ne.",
      zh: "教会一分为二，扬·胡斯被烧死在火刑柱上，布拉格开创了一项地方新传统：把议员扔出窗外。打了十八年仗之后，那杯葡萄酒还在，为它而战的人却几乎都不在了。",
    },
  },
  {
    key: 'lone-king',
    order: 7,
    themeClass: 'era-lone-king',
    hasContent: true,
    title: {
      en: 'The Lone King',
      cz: 'Osamělý král',
      zh: '孤王守国',
    },
    yearRange: {
      en: '1437–1471',
      cz: '1437–1471',
      zh: '1437年－1471年',
    },
    tagline: {
      en: "The Luxembourgs are gone and the next kings do not last long, so the Czechs end up choosing one of their own. The pope calls him a heretic, a crusade comes for him, and he holds on anyway.",
      cz: "Lucemburkové jsou pryč a další králové dlouho nevydrží, a tak si Češi nakonec zvolí krále z vlastních řad. Papež ho prohlásí za kacíře, přitáhne na něj křížová výprava, a on přesto vydrží.",
      zh: "卢森堡王朝没了，后来的国王一个个都坐不长，捷克人最后选了一位自己人当国王。教皇说他是异端，十字军打上门来，他照样守住了。",
    },
  },
  {
    key: 'rule-of-the-lords',
    order: 8,
    themeClass: 'era-rule-of-the-lords',
    hasContent: true,
    title: {
      en: 'Rule of the Lords',
      cz: 'Vláda pánů',
      zh: '贵族之治',
    },
    yearRange: {
      en: '1471–1526',
      cz: '1471–1526',
      zh: '1471年－1526年',
    },
    tagline: {
      en: "The new kings are polite, foreign and mostly somewhere else. The lords of Bohemia run the country, and Prague, just to stay in practice, throws its councillors out of a window again.",
      cz: "Noví králové jsou zdvořilí, cizí a většinou někde jinde. Zemi vládnou čeští páni a Praha, jen aby nevyšla ze cviku, znovu vyhodí konšely z okna.",
      zh: "新来的国王们彬彬有礼，来自外国，而且大多不在家。波希米亚由贵族们说了算，布拉格为了手艺不生疏，又把议员扔出了一回窗外。",
    },
  },
  {
    key: 'habsburgs-move-in',
    order: 9,
    themeClass: 'era-habsburgs-move-in',
    hasContent: false,
    title: {
      en: 'Under the Double-Headed Eagle',
      cz: 'Pod dvouhlavým orlem',
      zh: '双头鹰下',
    },
    yearRange: {
      en: '1526–1583',
      cz: '1526–1583',
      zh: '1526年－1583年',
    },
    tagline: {
      en: "In 1526 the Bohemian estates elect a Habsburg, and the new house settles in for a long stay. The castle burns, the estates rebel and lose, the Jesuits arrive, and a summer palace in the Italian style goes up in the royal garden.",
      cz: "Roku 1526 zvolí čeští stavové Habsburka a nový rod se tu zabydlí nadlouho. Hrad vyhoří, stavové se vzbouří a prohrají, přijdou jezuité a v Královské zahradě vyroste letohrádek v italském stylu.",
      zh: "1526年，波希米亚的等级们选了一位哈布斯堡家的人当国王，这一家就此住了下来，一住就是很久。城堡烧了一回，等级们造了一回反又输了，耶稣会来了，王家花园里盖起了一座意大利式的夏宫。",
    },
  },
  {
    key: 'age-of-wonders',
    order: 10,
    themeClass: 'era-age-of-wonders',
    hasContent: false,
    title: {
      en: 'An Age of Wonders',
      cz: 'Věk divů',
      zh: '奇珍盛世',
    },
    yearRange: {
      en: '1583–1618',
      cz: '1583–1618',
      zh: '1583年－1618年',
    },
    tagline: {
      en: "An emperor who would rather collect than govern moves his court to Prague and fills the castle with astronomers, alchemists, painters and curiosities from across the world. Then the brothers fall out, the emperor dies, and Prague's oldest political tradition, the window, gets one more memorable encore.",
      cz: "Císař, který raději sbírá, než vládne, přestěhuje dvůr do Prahy a zaplní hrad astronomy, alchymisty, malíři a kuriozitami z celého světa. Pak se bratři pohádají, císař umře a nejstarší pražská politická tradice, okno, zažije ještě jeden nezapomenutelný přídavek.",
      zh: "一位爱收藏胜过爱治国的皇帝，把宫廷搬到了布拉格，让城堡里挤满了天文学家、炼金术士、画家，还有从世界各地搜罗来的奇珍异宝。然后兄弟反目，皇帝去世，布拉格最古老的政治传统，也就是那扇窗户，又迎来一次令人难忘的加演。",
    },
  },
  {
    key: 'fire-and-ashes',
    order: 11,
    themeClass: 'era-fire-and-ashes',
    hasContent: false,
    title: {
      en: 'Fire and Ashes',
      cz: 'Oheň a popel',
      zh: '战火与灰烬',
    },
    yearRange: {
      en: '1618–1648',
      cz: '1618–1648',
      zh: '1618年－1648年',
    },
    tagline: {
      en: "White Mountain ends Bohemian self-rule in a single afternoon. The war grinds on for another twenty-eight years without it, and ends where it began: in Prague, with Swedish soldiers held off on the stone bridge.",
      cz: "Bílá hora ukončí českou samosprávu za jediné odpoledne. Válka bez ní táhne dál ještě osmadvacet let a skončí tam, kde začala: v Praze, se švédskými vojáky zastavenými na kamenném mostě.",
      zh: "白山一役，一个下午就终结了波希米亚的自治。战争在那之后又拖了二十八年，最后在它开始的地方收场：布拉格，瑞典兵被挡在了石桥上。",
    },
  },
  {
    key: 'voiceless-years',
    order: 12,
    themeClass: 'era-voiceless-years',
    hasContent: false,
    title: {
      en: 'The Voiceless Years',
      cz: 'Oněmělá léta',
      zh: '失语的岁月',
    },
    yearRange: {
      en: '1648–1689',
      cz: '1648–1689',
      zh: '1648年－1689年',
    },
    tagline: {
      en: "Those who will not convert slip into exile, the lords learn to speak German, and Czech retreats to the villages. Prague slowly heals its war wounds, until in 1689 a great fire burns much of it down again.",
      cz: "Kdo nechce konvertovat, odchází do exilu, páni se učí mluvit německy a čeština ustupuje na venkov. Praha si pomalu léčí válečné rány, až ji roku 1689 velký požár z velké části znovu spálí.",
      zh: "不肯改宗的人流亡他乡，贵族们学起了德语，捷克语退回了乡间。布拉格慢慢养着战争留下的伤，直到1689年，一场大火又把它烧掉了一大片。",
    },
  },
  {
    key: 'baroque-and-darkness',
    order: 13,
    themeClass: 'era-baroque-and-darkness',
    hasContent: false,
    title: {
      en: 'Splendour in the Dark',
      cz: 'Nádhera v temnotě',
      zh: '暗夜华章',
    },
    yearRange: {
      en: '1689–1740',
      cz: '1689–1740',
      zh: '1689年－1740年',
    },
    tagline: {
      en: "Prague rebuilds itself in gold and stone and turns the man once thrown off its bridge into a saint, while Czech stays out in the villages. Light and shadow, just as the Baroque painters liked it.",
      cz: "Praha se přestaví ve zlatě a kameni a z muže, kterého kdysi shodili z jejího mostu, udělá světce, zatímco čeština zůstává na venkově. Světlo a stín, přesně jak to měli rádi barokní malíři.",
      zh: "布拉格用黄金和石头把自己重建了一遍，还把当年从桥上被扔下河的那个人封成了圣人，捷克语却仍待在乡间。光与影，正合巴洛克画家的口味。",
    },
  },
  {
    key: 'age-of-absolutism',
    order: 14,
    themeClass: 'era-age-of-absolutism',
    hasContent: false,
    title: {
      en: 'Enlightened Absolutism',
      cz: 'Osvícenský absolutismus',
      zh: '开明专制',
    },
    yearRange: {
      en: '1740–1790',
      cz: '1740–1790',
      zh: '1740年－1790年',
    },
    tagline: {
      en: "First a mother, then her son, run Bohemia from Vienna by decree: school for everyone, fewer monasteries, an end to serfdom, and German in every office, whether Bohemia asked for it or not.",
      cz: "Napřed matka, po ní syn řídí Čechy z Vídně dekrety: škola pro všechny, méně klášterů, konec nevolnictví a němčina v každém úřadě, ať o to Čechy stály, nebo ne.",
      zh: "先是母亲，后是儿子，从维也纳用一纸纸诏令治理波希米亚：人人都要上学，修道院少了，农奴制没了，每个衙门都得说德语，不管波希米亚愿不愿意。",
    },
  },
  {
    key: 'revival-industrialization',
    order: 15,
    themeClass: 'era-revival-industrialization',
    hasContent: false,
    title: {
      en: 'The National Revival',
      cz: 'Národní obrození',
      zh: '民族复兴',
    },
    yearRange: {
      en: '1790–1848',
      cz: '1790–1848',
      zh: '1790年－1848年',
    },
    tagline: {
      en: "A handful of scholars set out to rescue a language the cities have nearly forgotten: dictionaries, grammars, a history of the nation and a song that will one day be the anthem. Then, in 1848, revolution reaches Prague, and the cannon on the heights across the river settle it in a few days.",
      cz: "Hrstka učenců se pustí do záchrany jazyka, který města skoro zapomněla: slovníky, mluvnice, dějiny národa a písnička, ze které jednou bude hymna. Pak roku 1848 dorazí do Prahy revoluce a děla z výšin za řekou ji během pár dní vyřídí.",
      zh: "几个学者着手抢救一门城里人快要忘掉的语言：词典、语法书、一部民族的历史，还有一首将来会成为国歌的歌。然后，1848年，革命来到了布拉格，河对岸高地上的大炮几天就把它摆平了。",
    },
  },
  {
    key: 'chimneys-and-song',
    order: 16,
    themeClass: 'era-chimneys-and-song',
    hasContent: false,
    title: {
      en: 'Smokestacks and Songs',
      cz: 'Komíny a písně',
      zh: '烟囱与歌',
    },
    yearRange: {
      en: '1848–1918',
      cz: '1848–1918',
      zh: '1848年－1918年',
    },
    tagline: {
      en: "Serfdom ends, the villages pour into the factories, and Prague, run in German at the start, ends up run in Czech. Railways, chimneys, several very long operas, and, when the empire finally falls apart, a country of its own.",
      cz: "Nevolnictví skončí, venkov se nahrne do továren a Praha, kde zpočátku vládla němčina, nakonec mluví česky. Železnice, komíny, několik pořádně dlouhých oper a nakonec, když se říše rozpadne, i vlastní stát.",
      zh: "农奴制废除了，乡下人涌进了工厂，布拉格从一座德语说了算的城市，变成了捷克语说了算的城市。铁路，烟囱，好几部超长的歌剧，最后，帝国散了架，捷克人有了自己的国家。",
    },
  },
  {
    key: 'brief-independence',
    order: 17,
    themeClass: 'era-brief-independence',
    hasContent: false,
    title: {
      en: 'The First Republic',
      cz: 'První republika',
      zh: '第一共和',
    },
    yearRange: {
      en: '1918–1938',
      cz: '1918–1938',
      zh: '1918年－1938年',
    },
    tagline: {
      en: "Czechoslovakia builds one of interwar Europe's few real democracies — and watches its own allies hand it over to appease the neighbor next door.",
      cz: "Československo si vybuduje jednu z mála skutečných demokracií meziválečné Evropy — a sleduje, jak ho vlastní spojenci vydají, aby usmířili souseda za humny.",
      zh: "捷克斯洛伐克建起了两战之间的欧洲少有的真正民主国家——却眼睁睁看着自己的盟友把它双手奉上，去讨好隔壁那个邻居。",
    },
  },
  {
    key: 'nazi-nightmare',
    order: 18,
    themeClass: 'era-nazi-nightmare',
    hasContent: false,
    title: {
      en: 'Occupation and Resistance',
      cz: 'Okupace a odboj',
      zh: '占领与抵抗',
    },
    yearRange: {
      en: '1938–1945',
      cz: '1938–1945',
      zh: '1938年－1945年',
    },
    tagline: {
      en: "Six years under occupation — the Czech lands forced to arm the war machine tearing Europe apart, and terrorized worst of all under the man Prague came to know as its butcher.",
      cz: "Šest let okupace — české země donucené vyzbrojovat válečný stroj, který trhal Evropu na kusy, a nejhůř terorizované za vlády muže, kterého Praha znala jako svého řezníka.",
      zh: "六年占领——波希米亚被迫为那台正在把欧洲撕碎的战争机器打造武器，而恐怖统治的顶点，落在了那个被布拉格称为“屠夫”的人手里。",
    },
  },
  {
    key: 'cold-war-sorrow',
    order: 19,
    themeClass: 'era-cold-war-sorrow',
    hasContent: false,
    title: {
      en: 'Dictatorship and Thaw',
      cz: 'Diktatura a tání',
      zh: '专政与解冻',
    },
    yearRange: {
      en: '1945–1968',
      cz: '1945–1968',
      zh: '1945年－1968年',
    },
    tagline: {
      en: "Liberation, a free election in which the communists come first, and in February 1948 a coup that hands them everything else. Show trials, a giant Stalin on the hill above the river, and then, slowly, a thaw, until in 1968 Prague starts to believe that socialism could have a human face.",
      cz: "Osvobození, svobodné volby, v nichž komunisté zvítězí, a v únoru 1948 převrat, který jim dá i všechno ostatní. Politické procesy, obří Stalin na pláni nad řekou a pak pomalé tání, až Praha v roce 1968 uvěří, že socialismus může mít lidskou tvář.",
      zh: "解放，一场共产党拿了第一的自由选举，然后是1948年二月，一场政变把剩下的一切都交到了他们手里。政治审判，河边山坡上巨大的斯大林像，再然后，冰慢慢化了，直到1968年，布拉格开始相信，社会主义也可以有一张人的面孔。",
    },
  },
  {
    key: 'occupation-and-dissent',
    order: 20,
    themeClass: 'era-occupation-and-dissent',
    hasContent: false,
    title: {
      en: 'Occupation and Dissent',
      cz: 'Okupace a disent',
      zh: '占领与异见',
    },
    yearRange: {
      en: '1968–1989',
      cz: '1968–1989',
      zh: '1968年－1989年',
    },
    tagline: {
      en: "In August 1968 the tanks come, and this time they stay. Twenty years of \"normalization\" follow: quiet conformity, a student who sets himself on fire in protest, a charter with a few hundred signatures, and at last, in November 1989, a whole city jingling its keys at a regime that leaves remarkably politely.",
      cz: "V srpnu 1968 přijedou tanky a tentokrát zůstanou. Následuje dvacet let „normalizace“: tiché přizpůsobení, student, který se na protest zapálí, charta s několika sty podpisy a nakonec, v listopadu 1989, celé město, které zvoní klíči na režim, jenž odejde nápadně slušně.",
      zh: "1968年8月，坦克开了进来，而且这一回没有走。接下来是二十年的“正常化”：沉默的顺从，一个为抗议而自焚的学生，一份只有几百人签名的宪章；最后，1989年11月，整座城市冲着政权摇响钥匙，而那个政权，出奇有礼貌地退了场。",
    },
  },
  {
    key: 'freedom-and-prosperity',
    order: 21,
    themeClass: 'era-freedom-and-prosperity',
    hasContent: false,
    title: {
      en: 'Freedom and Prosperity',
      cz: 'Svoboda a prosperita',
      zh: '自由与繁荣',
    },
    yearRange: {
      en: '1990–present',
      cz: '1990–dnes',
      zh: '1990年－至今',
    },
    tagline: {
      en: "Communism falls, the country solves its biggest new problem by splitting in two, and the Czech Republic spends the three decades since joining NATO and the EU — while Prague, never quite losing its old-world charm, quietly becomes one of Europe's more comfortable places to live.",
      cz: "Komunismus padne, země vyřeší svůj největší nový problém tím, že se rozdělí na dva státy, a Česká republika stráví další tři desetiletí vstupem do NATO a EU — zatímco si Praha, aniž by ztratila kus svého starobylého půvabu, tiše najde cestu mezi nejpříjemnější místa k životu v Evropě.",
      zh: "共产主义倒台，这个国家靠分成两个国家解决了自己最大的新麻烦，此后三十年，捷克共和国一路加入北约、加入欧盟，而布拉格，在保持历史古韵的同时，悄悄把自己变成了欧洲生活最舒适的角落之一。",
    },
  },
];
