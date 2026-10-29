import { useLang, useConvert } from '../context/LanguageContext';
import { RARITY_VAR, RARITY_XP, RARITY_ICON, RARITY_LABEL } from '../utils/rarity';
import { RARITY_BLURB } from '../utils/rarityBlurbs';

const DIFF_RARITIES = ['common', 'rare', 'superior', 'epic', 'mythic', 'legend', 'expedition'];

// The rarity list: icon, name, XP and the shared one-line description
// (utils/rarityBlurbs.js), plus a Guide-only note on Expedition.
const EXPEDITION_XP_TEXT = { en: '+60 to +300 XP', cz: '+60 až +300 XP', zh: '+60 到 +300 XP' };
function rarityLines(lang, expeditionNote) {
  return DIFF_RARITIES.map(r => {
    const xpText = r === 'expedition' ? EXPEDITION_XP_TEXT[lang] : `+${RARITY_XP[r]} XP`;
    const name = `${RARITY_ICON[r]} ${RARITY_LABEL[lang][r]}`;
    const blurb = RARITY_BLURB[lang][r] + (r === 'expedition' ? (lang === 'zh' ? '' : ' ') + expeditionNote : '');
    return lang === 'zh' ? `${name}：${xpText}。${blurb}` : `${name}: ${xpText}. ${blurb}`;
  });
}

function deepConvert(obj, fn) {
  if (typeof obj === 'string') return fn(obj);
  if (Array.isArray(obj)) return obj.map(item => deepConvert(item, fn));
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, deepConvert(v, fn)]));
  }
  return obj;
}

// Content is mirrored in GUIDE.md at the repo root; keep the two in step.
// Facts worth re-checking when mechanics change: NEARBY_REVEAL_M (100 m,
// utils/geolocation.js), the 50 m alert radius (hooks/useProximityDetection.js),
// the server's 100 m check-in limit (checkinController.js), LEVELS and
// ACHIEVEMENTS (server services/gamification.js) and the treasure hunt's
// HUNT_* constants.
const CONTENT = {
  en: {
    title: "Explorer's Handbook",
    challenge: "Are you confident that you can capture every scenic spot and landmark Prague has to offer?",
    localChallenge: "And if you happen to live in Prague (a bold assumption, but statistically possible), the question still stands. Do you really know the story behind every cobblestone, every crumbling doorway, every suspiciously decorative skull in this city? You hesitated. That's why you're here.",
    tagline: "You have entered the city. The cobblestones are real. The XP is also real. Proceed.",
    whatTitle: "What Is This",
    what: [
      "Prague and the rest of Bohemia are full of real places waiting to be found: castles, cemeteries, dynamite factories, a psychiatric hospital that hosts a music festival, a river confluence that almost nobody visits. You go there. You stand there. The app notices. You get XP.",
      "There are no orcs. There is, however, a bridge that has had more people thrown off it than any reasonable bridge should. That counts.",
    ],
    loopTitle: "The Whole Point",
    loop: "Prague is one of the best-preserved medieval cities in Europe, and most visitors see the same ten postcards. Every location in this app comes with its own story: part history, part legend, told with more enthusiasm than strictly necessary. The loop is simple: explore, collect, read the story, find somewhere new, repeat. A virtuous cycle built on cobblestones, tram tickets and a slowly growing affection for a city that has survived a remarkable amount.",
    startTitle: "Quick Start",
    start: [
      { b: "Register.", rest: " Pick a username you won't regret in six months. You begin at Level 1: Newcomer. This is accurate. Embrace it." },
      { b: "Allow location access.", rest: " This is how the app knows you're actually standing on Charles Bridge and not lying on a sofa in another country claiming you've been. The system has seen this before. The system is not impressed." },
      { b: "Allow notifications.", rest: " Optional, but recommended. It's how the app taps you on the shoulder when you walk past something you haven't collected yet." },
    ],
    installTitle: "Install as an App",
    installIntro: "Prague Stories runs full-screen on your phone, with no browser bar and no pasting links every time. One-time setup.",
    installIOSTitle: "iPhone (Safari)",
    installIOS: [
      "Open Safari. It has to be Safari, not Chrome or any other browser.",
      "Go to the app URL.",
      "Tap the Share button (the box with an arrow pointing up) at the bottom of the screen.",
      'Scroll down and tap "Add to Home Screen".',
      "Tap Add. The app icon appears on your home screen.",
    ],
    installAndroidTitle: "Android (Chrome)",
    installAndroid: [
      "Open Chrome and go to the app URL.",
      'Tap the three-dot menu (⋮) in the top-right corner.',
      'Tap "Add to Home Screen" or "Install App".',
      "Tap Add. The app icon appears on your home screen.",
    ],
    installNote: "Once installed, it opens full-screen like a native app, with no address bar and no browser UI. Tap the icon and you're in Prague.",
    screensTitle: "The Screens",
    exploreTitle: "Explore",
    explore: "Every location in the game, as a wall of cards sorted by distance, so the nearest mystery is always first. Filter by label or rarity, search by name (which spoils some of the mystery, but is allowed), or switch to My Collections to admire past conquests. Labels stack: filter by Church, by Castle, or by both at once if you're feeling specific. Cards you haven't collected yet show a lock and a coy \"???\" where the name should be. By default the wall shows only Prague itself (City only). Tap the toggle to Show all, and the castles, battlefields and towns beyond the city limits join in. In City only mode, the District button narrows things to one part of town: pick a modern district (Prague 1 to 22) or a historical quarter such as the Old Town or Žižkov, and the title swaps to that area's name and a short introduction.",
    mapTitle: "Map",
    map: "Your command centre. Gold markers are yours, grey ones are still up for grabs, and the red dot is you. Tap a marker to see what's there. While the app is open it quietly keeps track of where you are, which is how the 50-metre alerts below work. The map follows the same City only / Show all toggle, District filter included, and keeps you on the area in play: you can zoom out as far as all of Prague (all of the Czech Republic in Show all), and if you drag past the edge, it springs back.",
    detailTitle: "Location Detail",
    detail: "Tap any card to open it: the pixel-art cover, the story in three languages, the rarity, a Wikipedia link and directions in Google Maps. On a card you haven't collected, the Collect button waits at the bottom. Gold. Prominent. Beckoning. Under the labels, one more row tells you where the place is: its historical quarter and modern district (say, Smíchov and Prague 5), or Outside Prague for day-trip destinations.",
    historyTitle: "History Timeline",
    history: "The History page tells Bohemia's story from the founding legends onwards, one event at a time, with illustrations and the odd quote from a medieval chronicler who clearly had opinions. Many events end with a row of cards: the real places where it all happened. Tap one and its location opens right there, without leaving the page. Reading about a defenestration is one thing; standing under the actual window is better, and it pays XP. The page also remembers where you stopped reading, so you can pick up the Middle Ages exactly where you left them.",
    drawTitle: "Treasure Hunt",
    draw: "Can't decide where to go? Once every 24 hours, the Treasure Hunt hides one place you haven't found yet and names nothing at all: you only know which bank of the Vltava it's on and roughly how far away it is, and every hundred metres or so you walk, whether you're getting warmer. The city turns into a very large game of hot and cold. Get closer and it starts to give itself away; lose patience and you can buy a clue, at the cost of some XP. The Treasure Hunt page has the fine print.",
    dashTitle: "Profile",
    dash: "Your character sheet: level badge, XP bar, progress ring, a breakdown by category, achievements and the full level roadmap. Very Skinner box. Very effective. The Logout button lives here too.",
    collectTitle: "How Collecting Works",
    collectIntro: "Collecting a location means turning up there in person. The app has several ways of noticing that you have, depending on how close you get:",
    collect: [
      { b: "Within 100 m, the lock starts to shake.", rest: " On the Explore page, a locked card near you suddenly shows its name, gets its colours back (all except the cover, which stays grey until it's yours) and its lock starts trembling, like a parcel that knows it's about to be opened." },
      { b: "Within 100 m, tap the shaking card.", rest: " The location opens and collects itself on the spot. No buttons to hunt for, no forms, just a card that has been waiting for you." },
      { b: "Within 50 m, the alert.", rest: " Walk within 50 m of anything you haven't collected and your phone gets a notification, even if you're in another app (on iPhone, keep Prague Stories open in the background). Tap it and the app opens the location and collects it for you. On a computer, the alert appears as a banner inside the app, and its Collect button does the same. Each place alerts you once per session, so it won't nag." },
      { b: "Anywhere within 100 m, the Collect button.", rest: " Open the location yourself and tap Collect. Old-fashioned, reliable, always works." },
    ],
    collectCheck: "Whichever way you choose, the server checks your real GPS position, and you have to be within 100 m. If you aren't, you get an error and the strong implication that you are not where you said you were. If you are, the card flips open, the XP lands and any achievements you've earned pop up. The location stays open so you can start reading straight away; close it whenever you're done.",
    collectPermanent: "Collections are permanent. There is no undo button. You were there, and the archive remembers.",
    lockedTitle: "Locked and Unlocked",
    locked: [
      { b: "Locked:", rest: " you get the opening paragraph of the story and not a word more. After that, the archive politely declines to say anything further until you show up in person. Less a spoiler policy, more a very effective extortion mechanism." },
      { b: "The lock is a signpost:", rest: " tap the big lock on a locked location's cover and Google Maps opens with directions straight to it. Install Google Maps on your phone so it opens in the app instead of a browser tab." },
      { b: "Unlocked:", rest: " the whole story opens up. The full history, plus the bonus paragraph at the end: the little extra the archive was saving for people who actually came. The cover gets its colours back, and tapping it still gets you directions." },
    ],
    effectsTitle: "The Unlock Show",
    effectsIntro: "Every collection comes with a ceremony: the lock falls away, an open lock takes its place and the card flips over with a flash of light and a sound effect to match (epic and above get a grander fanfare). After that, the card wears its rank for good, and the rarer it is, the more it shows off:",
    effects: [
      "● Common: a clean border. Dignified. Understated. Prague-ordinary.",
      "▲ Rare: a thin inner line, like a picture frame.",
      "◆ Superior: a double line with little corner pieces.",
      "★ Epic: all of that, plus a soft band of purple light drifting across the card.",
      "✶ Mythic: a crimson rim that slowly breathes, a drifting red glow and a few embers rising from the bottom.",
      "♛︎ Legendary: a gold frame with a highlight circling it, a golden shine sweeping up and down, and gold embers rising through the card. Subtle it is not.",
    ],
    effectsOutro: "Locked cards show none of this. You have to earn the sparkle.",
    showcaseTitle: "Showing Off",
    showcaseIntro: "A collected card is more than a tile in a grid. Pick it up and have a proper look:",
    showcase: [
      { b: "Hold it up.", rest: " On a phone, press and hold a collected card; on a computer, double-click it. It fills the screen at full size and everything else dims, as if the rest of the city had stepped back out of respect." },
      { b: "Turn it over.", rest: " Drag sideways (finger or mouse) and the card turns over to show its back. It follows your hand, then settles with a little wobble, and a quick flick sends it further. Entirely useless. Deeply satisfying." },
      { b: "Read it.", rest: " On a phone, swipe up and the picture gives way to the card's story, right there inside the frame. Scroll to read, swipe down from the top to get the picture back." },
    ],
    showcaseOutro: "Tap anywhere outside the card to put it away. Locked cards can't be picked up; they just cling to their padlock a little harder. The My Collections filter on Explore is the natural place for this.",
    xpTitle: "XP & Levels",
    xpIntro: "Each location pays XP according to its rarity, a card-style tier that tells you how rare a find it really is:",
    diff: rarityLines('en', "These cards only appear with Show all."),
    diffBeyond: "Seen enough of the city? Look further out, to the rest of Bohemia around it: longer drives, finer views, more XP.",
    xpOutro: "There are 60 levels, from Newcomer at 0 XP to Prague Legend at 40,000 XP. The early ones come quickly. The later ones are a long-term project, on purpose, because the map keeps growing.",
    tripleTitle: "Bonus XP: the Treasure Hunt",
    triple: "A Treasure Hunt pays up to ten times as much, if you walk all the way there and find it on the first press. Every wrong press costs a step, and every clue you buy costs half a step, so asking for a hint is always cheaper than guessing blind. Run out of time and the answer is revealed. You lose nothing but your pride.",
    achTitle: "Achievements",
    ach: "Fifteen achievements, unlocked automatically when you hit certain milestones. You don't need to track them; they find you. Locked ones sit greyed out on the Dashboard: visible enough to taunt, vague enough to stay mysterious. This is called design.",
    tipsTitle: "Tips From Those Who Went Before",
    tips: [
      { icon: "📳", text: "Let the cards come to you. With alerts on, you can simply wander and let your phone buzz when you pass something. Some of the best finds are the ones you weren't looking for." },
      { icon: "🔒", text: "No plan for the afternoon? Explore is sorted by distance, so the first lock is the nearest one. Open it, tap the lock, and let Google Maps do the rest." },
      { icon: "🚃", text: "Keep the app open on the tram. Watching your red dot drift towards a grey marker is the correct way to experience Prague." },
      { icon: "◆", text: "Mythic and Legendary locations pay the most (+70 and +100). Open the Rarity filter, pick those tiers and go there first. The XP is proportional to the effort, and the effort is proportional to how few other tourists are there." },
      { icon: "📜", text: "Read the History Timeline before a day trip. Every place is twice as good when you know who was thrown out of which window there." },
      { icon: "🎲", text: "Can't pick a location? Start a Treasure Hunt. Find it with no misses and no bought clues and it pays ten times the usual XP." },
      { icon: "📊", text: "The Profile's category breakdown is your conscience. Seventeen churches and zero places to eat? The game is gently suggesting lunch." },
      { icon: "🌐", text: '"Žižkovský televizní vysílač". If you can pronounce this correctly, consider it an unofficial achievement.' },
    ],
    faqTitle: "FAQ",
    faq: [
      { q: "Can I collect from my sofa?", a: "No. The server knows. The server is always watching. The server cares about geographic integrity more than you might expect from a hobby project." },
      { q: "What if my GPS drifts?", a: "You need to be within 100 m, which covers normal GPS wobble but not \"I'm in a different neighbourhood.\" If it fails, step closer or give your phone a few seconds to find you properly." },
      { q: "Why didn't I get an alert?", a: "Alerts need notification permission, and each place only alerts you once per session. Missed it? If the card's lock is shaking, just tap the card." },
      { q: "Can I undo a collection?", a: "No. Collections are permanent. You were there." },
      { q: "Is there an end?", a: "100% completion: a progress ring filled entirely with gold. Whether that's an ending or a beginning is a question the app declines to answer." },
      { q: "Which language should I use?", a: "All three work. EN for convenience, CZ for immersion, ZH for the particular joy of reading about a psychiatric hospital's music festival in Chinese." },
      { q: "Can I add my own locations?", a: "Not any more. New places are now added by hand, so each one arrives with its full story in all three languages, not just a name and a pin." },
    ],
    pixelNote: "When you get home, flip through the pixel art one card at a time. They're beautiful, or at least the author thinks so. If you disagree, please send your feedback to Gemini, who drew them and presumably stands behind his work. Either way, we hope they make your day a little better.",
    outro: "Good luck out there. The city is waiting.",
  },

  cz: {
    title: "Průvodce Průzkumníka",
    challenge: "Troufáš si posbírat všechna panoramatická místa a historické památky, které Praha nabízí?",
    localChallenge: "A pokud v Praze náhodou bydlíš (odvážný předpoklad, ale statisticky možný), otázka pořád platí. Opravdu znáš příběh každého dlažebního kamene, každých oprýskaných dveří, každé podezřele dekorativní lebky v tomhle městě? Zaváhal jsi. Proto jsi tady.",
    tagline: "Vstoupil jsi do města. Dlažební kameny jsou skutečné. XP jsou také skutečné. Pokračuj.",
    whatTitle: "Co to je",
    what: [
      "Praha a celé Čechy jsou plné skutečných míst, která čekají, až je objevíš: hrady, hřbitovy, továrny na dynamit, psychiatrická léčebna, kde se pořádá hudební festival, soutok dvou řek, kam skoro nikdo nechodí. Jdeš tam. Stojíš tam. Aplikace si toho všimne. Dostaneš XP.",
      "Orci tu nejsou. Je tu ale most, ze kterého bylo shozeno víc lidí, než by kterýkoli rozumný most měl unést. To se počítá.",
    ],
    loopTitle: "O co jde",
    loop: "Praha je jedno z nejzachovalejších středověkých měst v Evropě a většina návštěvníků vidí pořád stejných deset pohlednic. Každé místo v aplikaci má svůj příběh: napůl historii, napůl legendu, vyprávěné s větším nadšením, než je nezbytně nutné. Smyčka je jednoduchá: prozkoumej, sesbírej, přečti si příběh, najdi další místo, opakuj. Ctnostný kruh z dlažebních kostek, tramvajových jízdenek a pomalu rostoucí náklonnosti k městu, které toho přežilo opravdu hodně.",
    startTitle: "Rychlý start",
    start: [
      { b: "Zaregistruj se.", rest: " Vyber si jméno, za které se za půl roku nebudeš stydět. Začínáš na Úrovni 1: Nováček. Sedí to. Smiř se s tím." },
      { b: "Povol přístup k poloze.", rest: " Jen tak aplikace ví, že opravdu stojíš na Karlově mostě, a ne že ležíš na gauči v jiné zemi a tvrdíš, že jsi tam byl. Systém už to viděl. Systém není ohromen." },
      { b: "Povol oznámení.", rest: " Nepovinné, ale doporučené. Takhle ti aplikace poklepe na rameno, když jdeš kolem něčeho, co ještě nemáš." },
    ],
    installTitle: "Nainstalovat jako aplikaci",
    installIntro: "Prague Stories běží v telefonu na celou obrazovku, bez adresního řádku a bez věčného vkládání odkazu. Stačí jednou nastavit.",
    installIOSTitle: "iPhone (Safari)",
    installIOS: [
      "Otevři Safari. Musí to být Safari, ne Chrome ani jiný prohlížeč.",
      "Přejdi na adresu aplikace.",
      "Klepni na tlačítko Sdílet (rámeček se šipkou nahoru) dole na obrazovce.",
      'Sjeď dolů a klepni na „Přidat na plochu".',
      "Klepni na Přidat. Ikona aplikace se objeví na ploše.",
    ],
    installAndroidTitle: "Android (Chrome)",
    installAndroid: [
      "Otevři Chrome a přejdi na adresu aplikace.",
      'Klepni na tři tečky (⋮) v pravém horním rohu.',
      'Klepni na „Přidat na plochu" nebo „Nainstalovat aplikaci".',
      "Klepni na Přidat. Ikona aplikace se objeví na ploše.",
    ],
    installNote: "Po instalaci se aplikace otevírá na celou obrazovku jako nativní, bez adresního řádku a bez prohlížeče kolem. Klepneš na ikonu a jsi v Praze.",
    screensTitle: "Obrazovky",
    exploreTitle: "Průzkum",
    explore: "Všechna místa ve hře jako stěna karet seřazená podle vzdálenosti, takže nejbližší záhada je vždycky první. Filtruj podle štítku nebo vzácnosti, hledej podle jména (trochu to kazí tajemství, ale je to povolené), nebo přepni na Moje sbírka a pokochej se minulými výboji. Štítky se dají kombinovat: Kostel, Hrad, nebo obojí najednou, pokud máš konkrétní náladu. Karty, které ještě nemáš, ukazují zámek a nevinné „???\" místo jména. Ve výchozím stavu ukazuje stěna jen samotnou Prahu (Jen Praha). Přepni na Vše a přidají se hrady, bojiště a města za hranicemi Prahy. V režimu Jen Praha zúží tlačítko Čtvrť výběr na jednu část města: vyber moderní obvod (Praha 1 až 22) nebo historickou čtvrť, třeba Staré Město nebo Žižkov, a nadpis se změní na její jméno s krátkým představením.",
    mapTitle: "Mapa",
    map: "Tvoje velitelské centrum. Zlaté značky jsou tvoje, šedé ještě čekají a červená tečka jsi ty. Klepni na značku a uvidíš, co tam je. Dokud je aplikace otevřená, potichu sleduje, kde jsi, a právě díky tomu fungují upozornění na 50 metrů popsaná níže. Mapa poslouchá stejný přepínač Jen Praha / Vše, včetně filtru Čtvrť, a drží tě v hrané oblasti: oddálit se dá nejvýš na celou Prahu (v režimu Vše na celé Česko), a když mapu odtáhneš za okraj, pruží zpátky.",
    detailTitle: "Detail místa",
    detail: "Klepni na kteroukoli kartu: pixel-artový obrázek, příběh ve třech jazycích, vzácnost, odkaz na Wikipedii a navigace v Mapách Google. Na kartě, kterou ještě nemáš, čeká dole tlačítko Sbírat. Zlaté. Výrazné. Lákavé. Pod štítky je ještě jeden řádek, který říká, kde místo leží: historická čtvrť a moderní obvod (třeba Smíchov a Praha 5), u výletních cílů pak Mimo Prahu.",
    historyTitle: "Historická osa",
    history: "Stránka Historie vypráví příběh Čech od pověstí o počátcích dál, událost po události, s ilustracemi a občasným citátem středověkého kronikáře, který měl zjevně vyhraněné názory. Mnoho událostí končí řadou karet: skutečnými místy, kde se to celé odehrálo. Klepni na jednu a místo se otevře rovnou tam, bez opuštění stránky. Číst o defenestraci je jedna věc; stát pod tím oknem je lepší a dostaneš za to XP. Stránka si navíc pamatuje, kde jsi přestal číst, takže na středověk navážeš přesně tam, kde jsi ho nechal.",
    drawTitle: "Hledání pokladu",
    draw: "Nemůžeš se rozhodnout, kam jít? Jednou za 24 hodin ti Hledání pokladu schová jedno místo, které ještě nemáš, a neprozradí o něm nic: víš jen, na kterém břehu Vltavy leží a jak je zhruba daleko, a zhruba každých sto metrů chůze se dozvíš, jestli přihořívá. Z města se stane hodně velká hra na přihořívá a samá voda. Čím blíž budeš, tím víc se prozradí; když ti dojde trpělivost, nápovědu si můžeš koupit za trochu XP. Drobné písmo najdeš přímo na stránce Hledání pokladu.",
    dashTitle: "Profil",
    dash: "Tvůj charakterový list: odznak úrovně, lišta XP, kruh pokroku, přehled podle kategorií, úspěchy a celá mapa úrovní. Velmi Skinnerova krabice. Velmi účinné. Najdeš tu i tlačítko Odhlásit.",
    collectTitle: "Jak funguje sbírání",
    collectIntro: "Sebrat místo znamená osobně se tam dostavit. Aplikace si toho umí všimnout několika způsoby, podle toho, jak blízko jsi:",
    collect: [
      { b: "Do 100 m se zámek rozklepe.", rest: " Na stránce Průzkum zamčená karta poblíž tebe náhle ukáže své jméno, dostane zpátky barvy (kromě obrázku, ten zůstane šedý, dokud nebude tvůj) a její zámek se začne třást jako balík, který tuší, že ho za chvíli někdo otevře." },
      { b: "Do 100 m klepni na třesoucí se kartu.", rest: " Místo se otevře a samo se na místě sebere. Žádné hledání tlačítek, žádné formuláře, jen karta, která na tebe čekala." },
      { b: "Do 50 m přijde upozornění.", rest: " Přiblížíš se na 50 m k něčemu, co ještě nemáš, a telefon ti pošle oznámení, i když máš otevřenou jinou aplikaci (na iPhonu nech Prague Stories otevřené na pozadí). Klepneš na něj a aplikace místo otevře a sebere za tebe. Na počítači se upozornění objeví jako lišta přímo v aplikaci a její tlačítko Sbírat udělá totéž. Každé místo tě upozorní jen jednou za relaci, takže otravovat nebude." },
      { b: "Kdekoli do 100 m tlačítko Sbírat.", rest: " Otevři místo sám a klepni na Sbírat. Postaru, spolehlivě, funguje vždycky." },
    ],
    collectCheck: "Ať zvolíš kteroukoli cestu, server zkontroluje tvou skutečnou polohu z GPS a musíš být do 100 m. Pokud nejsi, dostaneš chybu a silný náznak, že nejsi tam, kde tvrdíš. Pokud jsi, karta se otočí, XP přistanou a vyskočí případné nové úspěchy. Detail místa zůstane otevřený, abys mohl hned začít číst; zavřeš ho, až budeš chtít.",
    collectPermanent: "Sesbírané je navždy. Tlačítko Zpět neexistuje. Byl jsi tam a archiv si to pamatuje.",
    lockedTitle: "Zamčené a odemčené",
    locked: [
      { b: "Zamčené:", rest: " dostaneš úvodní odstavec příběhu a ani slovo navíc. Pak archiv zdvořile odmítne cokoli prozradit, dokud se nedostavíš osobně. Méně ochrana proti spoilerům, víc velmi účinné vydírání." },
      { b: "Zámek je rozcestník:", rest: " klepni na velký zámek na obrázku zamčeného místa a otevřou se Mapy Google s navigací přímo k němu. Nainstaluj si do telefonu Mapy Google, ať se otevřou v aplikaci, a ne v záložce prohlížeče." },
      { b: "Odemčené:", rest: " otevře se celý příběh. Kompletní historie a navíc bonusový odstavec na konci: malá třešnička, kterou si archiv šetřil pro ty, kdo opravdu přišli. Obrázek dostane zpátky barvy a klepnutím na něj se pořád dostaneš k navigaci." },
    ],
    effectsTitle: "Odemykací show",
    effectsIntro: "Každé sebrání má svůj obřad: zámek odpadne, na jeho místo naskočí otevřený a karta se otočí se zábleskem světla a odpovídajícím zvukem (epické a vyšší dostanou slavnostnější fanfáru). Potom karta nosí svou hodnost natrvalo a čím je vzácnější, tím víc se předvádí:",
    effects: [
      "● Běžné: čistý rámeček. Důstojné. Střídmé. Běžné po pražsku.",
      "▲ Vzácné: tenká vnitřní linka jako u obrazu.",
      "◆ Výjimečné: dvojitá linka s malými rohovými ozdobami.",
      "★ Epické: to vše a navíc jemný pruh fialového světla, který se líně přesouvá přes kartu.",
      "✶ Mýtické: karmínový okraj, který pomalu dýchá, putující červená záře a pár jisker stoupajících zespodu.",
      "♛︎ Legendární: zlatý rám s odleskem, který ho obíhá, zlatý lesk přejíždějící nahoru a dolů a zlaté jiskry stoupající kartou. Skromnost to není.",
    ],
    effectsOutro: "Zamčené karty nic z toho neukazují. Třpyt si musíš zasloužit.",
    showcaseTitle: "Chlubení",
    showcaseIntro: "Sesbíraná karta je víc než dlaždice v mřížce. Vezmi ji do ruky a pořádně si ji prohlédni:",
    showcase: [
      { b: "Zvedni ji.", rest: " Na telefonu podrž prst na sesbírané kartě, na počítači na ni dvakrát klikni. Roztáhne se přes celou obrazovku a všechno ostatní ztmavne, jako by celé město uctivě ustoupilo o krok." },
      { b: "Otoč ji.", rest: " Táhni do strany (prstem nebo myší) a karta se otočí rubem nahoru. Jde ti za rukou, pak se s lehkým zakolébáním usadí a rychlé švihnutí ji pošle dál. Naprosto k ničemu. Hluboce uspokojivé." },
      { b: "Přečti si ji.", rest: " Na telefonu přejeď nahoru a obrázek uvolní místo příběhu karty, přímo uvnitř rámečku. Posouváním čteš, přejetím dolů úplně nahoře se vrátíš k obrázku." },
    ],
    showcaseOutro: "Klepnutím kamkoli mimo kartu ji zase odložíš. Zamčené karty zvednout nejdou, jen se o něco pevněji drží svého zámku. Přirozené místo na tohle je filtr Moje sbírka na stránce Průzkum.",
    xpTitle: "XP a úrovně",
    xpIntro: "Každé místo vyplácí XP podle své vzácnosti, karetní úrovně, která říká, jak vzácný nález to doopravdy je:",
    diff: rarityLines('cz', "Tyhle karty se ukážou jen s volbou Vše."),
    diffBeyond: "Máš-li města dost, podívej se dál, na celé Čechy kolem: delší cesta, krásnější krajina, víc XP.",
    xpOutro: "Úrovní je 60, od Nováčka s 0 XP po Pražskou legendu se 40 000 XP. Ty první přijdou rychle. Ty pozdější jsou dlouhodobý projekt, a to záměrně, protože mapa pořád roste.",
    tripleTitle: "Bonusové XP: Hledání pokladu",
    triple: "Hledání pokladu vyplatí až desetinásobek, pokud k pokladu dojdeš pěšky a najdeš ho hned prvním stiskem. Každý stisk vedle stojí jeden stupeň a každá koupená nápověda půl stupně, takže zeptat se je vždycky levnější než hádat naslepo. Když čas vyprší, odpověď se odhalí. Nepřijdeš o nic kromě hrdosti.",
    achTitle: "Úspěchy",
    ach: "Patnáct úspěchů, které se odemknou samy, když dosáhneš určitých milníků. Nemusíš je hlídat; najdou si tě. Zamčené sedí zašedlé na Přehledu: dost viditelné, aby dráždily, dost neurčité, aby zůstaly tajemné. Tomu se říká design.",
    tipsTitle: "Tipy od těch, kteří šli před tebou",
    tips: [
      { icon: "📳", text: "Nech karty přijít za tebou. Se zapnutými upozorněními se můžeš prostě toulat a nechat telefon zabzučet, když jdeš kolem něčeho zajímavého. Nejlepší nálezy bývají ty, které jsi nehledal." },
      { icon: "🔒", text: "Nemáš plán na odpoledne? Průzkum je seřazený podle vzdálenosti, takže první zámek je ten nejbližší. Otevři ho, klepni na zámek a zbytek nech na Mapách Google." },
      { icon: "🚃", text: "Měj aplikaci otevřenou v tramvaji. Sledovat, jak se tvoje červená tečka sune k šedé značce, je ten správný způsob, jak zažít Prahu." },
      { icon: "◆", text: "Mýtická a legendární místa platí nejvíc (+70 a +100). Otevři filtr Vzácnost, vyber tyto úrovně a vyraž tam jako první. XP odpovídá úsilí a úsilí odpovídá tomu, jak málo turistů tam potkáš." },
      { icon: "📜", text: "Před výletem si přečti Historickou osu. Každé místo je dvakrát lepší, když víš, kdo tam z kterého okna vyletěl." },
      { icon: "🎲", text: "Nemůžeš si vybrat? Vyraž hledat poklad. Najdeš-li ho bez jediné chyby a bez koupené nápovědy, vyplatí desetinásobek obvyklého XP." },
      { icon: "📊", text: "Přehled kategorií na Profilu je tvoje svědomí. Sedmnáct kostelů a ani jedna hospoda? Hra ti jemně naznačuje, že je čas na oběd." },
      { icon: "🌐", text: "„Žižkovský televizní vysílač\". Pokud to dokážeš vyslovit bez zakoktání, považuj to za neoficiální úspěch." },
    ],
    faqTitle: "Časté dotazy",
    faq: [
      { q: "Můžu sbírat z gauče?", a: "Ne. Server to ví. Server pořád sleduje. Server dbá na zeměpisnou poctivost víc, než bys od hobby projektu čekal." },
      { q: "Co když GPS ujíždí?", a: "Musíš být do 100 m, což pokryje běžné kolísání GPS, ale ne „jsem v úplně jiné čtvrti\". Když to nevyjde, popojdi blíž nebo dej telefonu pár vteřin, ať tě pořádně najde." },
      { q: "Proč mi nepřišlo upozornění?", a: "Upozornění potřebují povolená oznámení a každé místo tě upozorní jen jednou za relaci. Propásl jsi ho? Pokud se zámek na kartě třese, prostě na kartu klepni." },
      { q: "Můžu sebrání vrátit?", a: "Ne. Sesbírané je navždy. Byl jsi tam." },
      { q: "Má to konec?", a: "Stoprocentní sbírka: kruh pokroku celý zlatý. Jestli je to konec, nebo začátek, je otázka, na kterou aplikace odmítá odpovědět." },
      { q: "Jaký jazyk mám používat?", a: "Fungují všechny tři. EN pro pohodlí, CZ pro ponoření, ZH pro zvláštní radost číst čínsky o hudebním festivalu v psychiatrické léčebně." },
      { q: "Můžu přidat vlastní místa?", a: "Už ne. Nová místa teď přidáváme ručně, aby každé dorazilo s celým příběhem ve všech třech jazycích, ne jen se jménem a špendlíkem." },
    ],
    pixelNote: "Až přijdeš domů, prolistuj si pixel art kartu po kartě. Jsou krásné, nebo si to aspoň myslí autor. Pokud nesouhlasíš, pošli svůj názor Geminimu, který je nakreslil a nejspíš si za nimi stojí. Tak či tak doufáme, že ti trochu zpříjemní den.",
    outro: "Hodně štěstí tam venku. Město čeká.",
  },

  zh: {
    title: "探索者手册",
    challenge: "你有信心把布拉格的所有风景名胜以及地标建筑全部收入囊中吗？",
    localChallenge: "即使您是布拉格居民，我想您也需要这款应用。敢问阁下，您确定您对这座城市一草一木背后的故事都了如指掌吗？如果您迟疑了，请也加入吧！",
    tagline: "你已进入这座城市。鹅卵石是真实的。经验值也是真实的。继续前进。",
    whatTitle: "这是什么",
    what: [
      "布拉格和整个波西米亚到处都是等你去发现的真实地点：城堡、墓地、炸药工厂、举办音乐节的精神病院，还有一个几乎无人问津的两河交汇处。你去那里，站在那里，应用注意到你，你就获得经验值。",
      "这里没有兽人。不过有一座桥，被扔下去的人比任何一座讲道理的桥都多。这也算。",
    ],
    loopTitle: "核心理念",
    loop: "布拉格是欧洲保存最完好的中世纪城市之一，可大多数游客只看了那十张千篇一律的明信片。这个应用里的每个地点都有自己的故事：一半是历史，一半是传说，讲述时的热情明显超出了必要。玩法很简单：探索、打卡、读故事、发现新地点，然后再来一遍。一个由鹅卵石、电车票和对这座饱经沧桑之城日渐加深的喜爱组成的良性循环。",
    startTitle: "快速开始",
    start: [
      { b: "注册。", rest: "选一个半年后不会后悔的用户名。你从第1级「新来者」开始。很准确，接受现实吧。" },
      { b: "允许位置权限。", rest: "应用就是靠这个确认你真的站在查理大桥上，而不是躺在另一个国家的沙发上声称自己去过。系统见过这种情况，系统并不感动。" },
      { b: "允许通知。", rest: "不是必须，但强烈推荐。你路过还没收集的地点时，应用就靠它拍拍你的肩膀。" },
    ],
    installTitle: "安装为应用",
    installIntro: "Prague Stories 可以在手机上全屏运行，没有浏览器地址栏，也不用每次粘贴链接。设置一次就好。",
    installIOSTitle: "iPhone（Safari）",
    installIOS: [
      "打开 Safari。必须是 Safari，不能用 Chrome 或其他浏览器。",
      "前往应用的网址。",
      "点击屏幕底部的分享按钮（带向上箭头的方框）。",
      "向下滚动，点击「添加到主屏幕」。",
      "点击「添加」，应用图标就会出现在主屏幕上。",
    ],
    installAndroidTitle: "Android（Chrome）",
    installAndroid: [
      "打开 Chrome，前往应用网址。",
      "点击右上角的三点菜单（⋮）。",
      "点击「添加到主屏幕」或「安装应用」。",
      "点击「添加」，应用图标就会出现在主屏幕上。",
    ],
    installNote: "安装后，应用会像原生应用一样全屏启动，没有地址栏，也没有浏览器界面。点一下图标，你就在布拉格了。",
    screensTitle: "各个页面",
    exploreTitle: "探索",
    explore: "游戏里的所有地点，排成一整面卡牌墙，按距离排序，离你最近的谜题永远排在第一个。可以按标签或稀有度筛选，按名字搜索（会破坏一点神秘感，但允许），也可以切换到「我的收藏」，自我陶醉地回顾战绩。标签可以叠加：单选「教堂」或「城堡」，想精确一点也可以两个一起选。还没收集的卡片会挂着一把锁，名字的位置只有一行害羞的「???」。默认只显示布拉格市区（「显示市区」）。点一下切换到「显示全部」，市界外的城堡、古战场和小城镇也会加入进来。在「显示市区」模式下，「区域」按钮可以只看城里的某一块：选一个现代行政区（布拉格1区到22区），或者老城、日什科夫这样的历史分区，标题就会换成这个区的名字，外加一段简短的介绍。",
    mapTitle: "地图",
    map: "你的指挥中心。金色标记是你的，灰色标记还等着你去拿，红点就是你自己。点一下标记就能看看那里有什么。应用开着的时候会默默留意你的位置，下面说的「50米提醒」就是靠这个实现的。地图也有同样的「显示市区／显示全部」切换和「区域」筛选，而且会把你留在当前范围里：最多只能缩小到看见整个布拉格（「显示全部」时是整个捷克），把地图拖出边界，松手就会弹回来。",
    detailTitle: "地点详情",
    detail: "点开任意一张卡片：像素画封面、三种语言的故事、稀有度、维基百科链接，以及谷歌地图导航。还没收集的地点，底部有一个打卡按钮在等你。金色，醒目，诱人。标签下面还有一行，告诉你这个地方在哪儿：所属的历史分区和现代行政区（比如斯米霍夫、布拉格5区），一日游的目的地则显示「布拉格以外」。",
    historyTitle: "历史时间线",
    history: "「历史」页面从建国传说讲起，一件事一件事地讲完波西米亚的故事，配有插画，偶尔还引用几句明显很有个人观点的中世纪编年史家的原话。很多事件下面附着一排卡片，就是当年真正发生这些事的地方。点一下，地点详情直接在当前页面打开，不用跳走。读一段「扔出窗外」的故事是一回事，站在那扇真正的窗户下面又是另一回事，而且还有经验值拿。这个页面还会记住你读到哪儿了，下次打开，中世纪原地等你。",
    drawTitle: "寻宝",
    draw: "不知道该去哪儿？每24小时，寻宝会把一个你还没去过的地点藏起来，什么都不告诉你：你只知道它在伏尔塔瓦河哪一岸、大概有多远，每走一百米左右，再告诉你是不是在靠近。整座城市就成了一场超大的“冷热游戏”。走得越近，它露出的马脚越多；等不及了，也可以花点经验买条线索。具体规则寻宝页面里都有。",
    dashTitle: "个人主页",
    dash: "你的角色档案：等级徽章、经验值条、进度环、分类统计、成就，以及完整的等级路线图。非常巴甫洛夫，非常有效。「退出」按钮也在这里。",
    collectTitle: "如何打卡",
    collectIntro: "打卡就是本人亲自到场。根据你离得有多近，应用有好几种办法察觉到你来了：",
    collect: [
      { b: "100米内，锁头开始颤抖。", rest: "在「探索」页面，你附近的上锁卡片会突然显出名字、恢复颜色（封面除外，封面要等它归你之后才变彩色），锁头也开始发抖，就像一个知道自己马上要被拆开的快递。" },
      { b: "100米内，点一下发抖的卡片。", rest: "地点详情打开，当场自动打卡。不用找按钮，不用填表，只有一张等了你很久的卡片。" },
      { b: "50米内，收到提醒。", rest: "走到任何未收集地点的50米以内，手机就会弹出通知，哪怕你正在用别的应用（iPhone 需要让 Prague Stories 在后台开着）。点一下通知，应用会打开这个地点并自动帮你打卡。在电脑上，提醒会以横幅形式出现在应用里，横幅上的打卡按钮效果一样。每个地点每次打开应用只提醒一次，不会烦你。" },
      { b: "100米内任何时候，点打卡按钮。", rest: "自己打开地点详情，点「打卡」。老派，可靠，永远好用。" },
    ],
    collectCheck: "不管用哪种方式，服务器都会核对你的真实GPS位置，你必须在100米以内。如果不在，你会收到一条错误提示，以及「你并不在你声称的地方」的强烈暗示。如果在，卡片翻开，经验值到账，新解锁的成就也会弹出来。详情页会一直开着，方便你立刻开始阅读，看完了自己关掉就行。",
    collectPermanent: "打卡是永久的，没有撤销按钮。你去过了，档案会记住。",
    lockedTitle: "上锁与解锁",
    locked: [
      { b: "上锁时：", rest: "你只能看到故事的第一段，多一个字都没有。之后档案会礼貌地拒绝透露更多，直到你亲自到场。与其说是防剧透，不如说是一种非常有效的勒索手段。" },
      { b: "锁头就是路标：", rest: "点一下上锁地点封面上的大锁头，谷歌地图就会打开，直接导航到那里。记得在手机上装好谷歌地图，这样会直接在应用里打开，而不是开一个浏览器标签页。" },
      { b: "解锁后：", rest: "整个故事全部展开。完整的历史，再加上结尾的彩蛋段落，那是档案专门留给真正来过的人的一点小惊喜。封面恢复彩色，点封面照样可以导航。" },
    ],
    effectsTitle: "解锁大秀",
    effectsIntro: "每次打卡都有一场小仪式：锁头脱落，一把打开的锁取而代之，卡片带着一道闪光翻转过来，还配有音效（史诗及以上会响起更隆重的号角）。从此以后，卡片会一直佩戴它的等级，越稀有越花哨：",
    effects: [
      "● 常见：干净的边框。端庄，低调，布拉格式普通。",
      "▲ 稀有：一条细细的内框线，像画框一样。",
      "◆ 卓越：双线内框，外加小小的角饰。",
      "★ 史诗：以上全部，再加一道柔和的紫光，在卡片上缓缓飘过。",
      "✶ 神话：一圈缓缓呼吸的深红内框，一抹游移的红光，还有几点从底部升起的火星。",
      "♛︎ 传说：金色边框，一道高光绕着它转圈，一层金光上下扫过，金色火星在卡片里升腾。低调是不可能低调的。",
    ],
    effectsOutro: "上锁的卡片一样都没有。闪光是要靠自己挣的。",
    showcaseTitle: "拿出来炫耀",
    showcaseIntro: "收集到的卡片不只是网格里的一个格子。拿起来，好好看看：",
    showcase: [
      { b: "举起来。", rest: "手机上长按一张已收集的卡片，电脑上双击它。卡片会放大到整个屏幕，周围的一切都暗下去，仿佛整座城市都识趣地往后退了一步。" },
      { b: "翻过来。", rest: "左右拖动（手指或鼠标都行），卡片就会翻到背面。它跟着你的手走，松手后晃两下才停稳，甩得快一点还能多转半圈。毫无用处，但非常解压。" },
      { b: "读一读。", rest: "手机上往上划，卡面的图片会让位给这张卡的故事，就在卡框里面。上下滑动阅读，滑到顶部再往下划，图片就回来了。" },
    ],
    showcaseOutro: "点卡片外面任意地方就能收起来。上锁的卡片拿不起来，只会把锁抱得更紧一点。最适合这么玩的地方，是探索页的“我的收藏”。",
    xpTitle: "经验值与等级",
    xpIntro: "每个地点按稀有度给经验值。稀有度类似卡牌游戏的等级，告诉你这个发现到底有多难得：",
    diff: rarityLines('zh', "这些卡只在「显示全部」时出现。"),
    diffBeyond: "如果城里已经逛够了，不妨把目光投向布拉格周围的整个波希米亚：车程更远，风景更美，经验值也更多。",
    xpOutro: "一共60级，从0经验值的「新来者」到40,000经验值的「布拉格传奇」。前面几级升得很快，后面几级是长期工程，这是故意的，因为地图一直在变大。",
    tripleTitle: "额外经验：寻宝",
    triple: "寻宝最高十倍，前提是一路走到宝藏跟前，第一次按就中。每猜错一次降一级，每买一条线索只降半级，所以开口要提示永远比闭眼瞎猜划算。时间到了还没找到，答案会揭晓。你损失的只有面子。",
    achTitle: "成就",
    ach: "一共十五个成就，达到特定里程碑时自动解锁。你不需要追踪它们，它们会自己找上门。还没解锁的成就在仪表盘上显示为灰色：显眼到让你心痒，模糊到保持神秘。这叫做设计。",
    tipsTitle: "前人留下的小贴士",
    tips: [
      { icon: "📳", text: "让卡片来找你。打开提醒之后，你可以随便逛，路过好东西时手机自然会震一下。最好的发现，往往是你没在找的那些。" },
      { icon: "🔒", text: "下午没计划？「探索」页面按距离排序，第一把锁就是离你最近的。打开它，点一下锁头，剩下的交给谷歌地图。" },
      { icon: "🚃", text: "坐电车时把应用开着。看着你的红点一点点挪向灰色标记，才是体验布拉格的正确方式。" },
      { icon: "◆", text: "神话和传说地点经验值最高（+70和+100）。打开稀有度筛选，选这两档，优先去。经验值和你付出的努力成正比，而努力程度又和那里有多少游客成反比。" },
      { icon: "📜", text: "出发一日游之前先读读历史时间线。知道谁在那里被从哪扇窗户扔出去之后，每个地方都会好玩两倍。" },
      { icon: "🎲", text: "选不出去哪？去寻宝。一次没猜错、一条线索没买就找到，经验值是平常的十倍。" },
      { icon: "📊", text: "个人主页的分类统计就是你的良心。十七座教堂、零家餐馆？游戏在温柔地提醒你该吃午饭了。" },
      { icon: "🌐", text: "「Žižkovský televizní vysílač」。如果你能一口气念对，就算你解锁了一个非官方成就。" },
    ],
    faqTitle: "常见问题",
    faq: [
      { q: "我能在沙发上打卡吗？", a: "不能。服务器知道。服务器一直在看。服务器对地理诚信的重视程度，远超你对一个业余项目的预期。" },
      { q: "GPS不准怎么办？", a: "你需要在100米以内，这足够覆盖正常的GPS漂移，但不够覆盖「我在另一个街区」。如果失败了，就走近一点，或者等几秒让手机把你定位准。" },
      { q: "为什么我没收到提醒？", a: "提醒需要通知权限，而且每个地点每次打开应用只提醒一次。错过了？只要卡片上的锁头在发抖，直接点卡片就行。" },
      { q: "打卡可以撤销吗？", a: "不可以。打卡是永久的。你去过了。" },
      { q: "有终点吗？", a: "100%完成度：进度环全部变成金色。这是终点还是起点，是应用拒绝回答的哲学问题。" },
      { q: "用哪种语言？", a: "三种都行。EN方便，CZ沉浸，ZH则可以享受用中文读精神病院音乐节的独特乐趣。" },
      { q: "我能添加自己的地点吗？", a: "现在不行了。新地点改为人工添加，这样每一个都会带着完整的三语故事上线，而不只是一个名字加一个图钉。" },
    ],
    pixelNote: "回到家后，一张一张翻看那些像素画吧。它们很精美，至少作者是这么认为的。如果你不同意，请把意见反馈给 Gemini，这些画是他生成的，想必他愿意为自己的作品负责。无论如何，希望它们能让你的一天更美好一些。",
    outro: "祝你好运。这座城市在等你。",
  },
};

export default function GuidePage() {
  const { lang } = useLang();
  const convert = useConvert();
  const c = deepConvert(CONTENT[lang] || CONTENT.en, convert);

  const steps = (items, colorOf, offset = 0) => items.map((item, i) => (
    <div key={i + offset} className="guide-step">
      <span className="guide-step-num">{i + offset + 1}</span>
      {typeof item === 'string'
        ? <p className="guide-body" style={colorOf ? { color: colorOf(i + offset) } : undefined}>{item}</p>
        : <p className="guide-body"><strong>{item.b}</strong>{item.rest}</p>}
    </div>
  ));
  const rarityColor = i => RARITY_VAR[DIFF_RARITIES[i]];
  const h3Gap = { marginTop: 16 };

  return (
    <div className="guide-page">
      <div className="guide-wrap">
        <h1 className="px-title" style={{ fontSize: 26, marginBottom: 6 }}>{c.title}</h1>
        <p className="guide-intro">{c.tagline}</p>

        <div className="guide-challenge">
          {c.challenge}
        </div>

        <div className="guide-tip" style={{ borderLeftColor: 'var(--text-muted)', marginBottom: 24 }}>
          <span>{c.localChallenge}</span>
        </div>

        <section className="guide-section">
          <h2 className="guide-h2">{c.whatTitle}</h2>
          {c.what.map((p, i) => <p key={i} className="guide-body">{p}</p>)}
        </section>

        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{c.loopTitle}</h2>
          <p className="guide-body">{c.loop}</p>
        </section>

        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{c.startTitle}</h2>
          {steps(c.start)}
        </section>

        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{c.installTitle}</h2>
          <p className="guide-body">{c.installIntro}</p>

          <h3 className="guide-h3" style={h3Gap}>{c.installIOSTitle}</h3>
          {steps(c.installIOS)}

          <h3 className="guide-h3" style={h3Gap}>{c.installAndroidTitle}</h3>
          {steps(c.installAndroid)}

          <div className="guide-tip" style={h3Gap}>
            <span>{c.installNote}</span>
          </div>
        </section>

        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{c.screensTitle}</h2>

          <h3 className="guide-h3">{c.exploreTitle}</h3>
          <p className="guide-body">{c.explore}</p>

          <h3 className="guide-h3" style={h3Gap}>{c.mapTitle}</h3>
          <p className="guide-body">{c.map}</p>

          <h3 className="guide-h3" style={h3Gap}>{c.detailTitle}</h3>
          <p className="guide-body">{c.detail}</p>

          <h3 className="guide-h3" style={h3Gap}>{c.historyTitle}</h3>
          <p className="guide-body">{c.history}</p>

          <h3 className="guide-h3" style={h3Gap}>{c.drawTitle}</h3>
          <p className="guide-body">{c.draw}</p>

          <h3 className="guide-h3" style={h3Gap}>{c.dashTitle}</h3>
          <p className="guide-body">{c.dash}</p>
        </section>

        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{c.collectTitle}</h2>
          <p className="guide-body">{c.collectIntro}</p>
          {steps(c.collect)}
          <p className="guide-body" style={{ marginTop: 10 }}>{c.collectCheck}</p>
          <div className="guide-tip" style={h3Gap}>
            <span>{c.collectPermanent}</span>
          </div>
        </section>

        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{c.lockedTitle}</h2>
          {c.locked.map((item, i) => (
            <p key={i} className="guide-body"><strong>{item.b}</strong>{item.rest}</p>
          ))}
        </section>

        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{c.effectsTitle}</h2>
          <p className="guide-body">{c.effectsIntro}</p>
          {steps(c.effects, rarityColor)}
          <p className="guide-body" style={{ marginTop: 10 }}>{c.effectsOutro}</p>

          <h3 className="guide-h3" style={h3Gap}>{c.showcaseTitle}</h3>
          <p className="guide-body">{c.showcaseIntro}</p>
          {steps(c.showcase)}
          <p className="guide-body" style={{ marginTop: 10 }}>{c.showcaseOutro}</p>
        </section>

        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{c.xpTitle}</h2>
          <p className="guide-body">{c.xpIntro}</p>
          {/* The six city tiers, then a line leading out of town to Expedition. */}
          {steps(c.diff.slice(0, 6), rarityColor)}
          <p className="guide-body" style={{ margin: '12px 0' }}>{c.diffBeyond}</p>
          {steps(c.diff.slice(6), rarityColor, 6)}
          <p className="guide-body" style={{ marginTop: 10 }}>{c.xpOutro}</p>

          <h3 className="guide-h3" style={h3Gap}>{c.tripleTitle}</h3>
          <p className="guide-body">{c.triple}</p>
        </section>

        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{c.achTitle}</h2>
          <p className="guide-body">{c.ach}</p>
        </section>

        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{c.tipsTitle}</h2>
          {c.tips.map((tip, i) => (
            <div key={i} className="guide-tip">
              <span>{tip.text}</span>
            </div>
          ))}
        </section>

        <hr className="px-divider" />

        <div className="guide-tip" style={{ borderLeftColor: 'var(--text-muted)', marginBottom: 24 }}>
          <span>{c.pixelNote}</span>
        </div>

        <section className="guide-section">
          <h2 className="guide-h2">{c.faqTitle}</h2>
          {c.faq.map((item, i) => (
            <div key={i} className="guide-faq">
              <p className="guide-faq__q">{item.q}</p>
              <p className="guide-faq__a">{item.a}</p>
            </div>
          ))}
        </section>

        <p className="guide-intro" style={{ marginTop: 8, marginBottom: 40 }}>{c.outro}</p>
      </div>
    </div>
  );
}
