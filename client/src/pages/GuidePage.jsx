import { useLang, useConvert } from '../context/LanguageContext';

function deepConvert(obj, fn) {
  if (typeof obj === 'string') return fn(obj);
  if (Array.isArray(obj)) return obj.map(item => deepConvert(item, fn));
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, deepConvert(v, fn)]));
  }
  return obj;
}

const CONTENT = {
  en: {
    title: "Explorer's Handbook",
    challenge: "Are you confident that you can capture every scenic spot and landmark Prague has to offer?",
    localChallenge: "And if you happen to be a Prague resident — a bold assumption, but statistically possible — the question still stands. Are you certain you know the story behind every cobblestone, every crumbling doorway, every suspiciously decorative skull in this city? You hesitated. That's why you're here.",
    tagline: "You have entered the city. The cobblestones are real. The XP is also real. Proceed.",
    whatTitle: "What Is This",
    what: [
      "Prague has real locations waiting to be discovered — castles, cemeteries, dynamite factories, a psychiatric hospital that hosts music festivals, a confluence of two rivers that almost nobody visits. You go there. You stand there. The app notices. You get XP.",
      "There are no orcs. There is, however, a bridge that has had more people thrown off it than any reasonable bridge should. That counts.",
    ],
    startTitle: "Quick Start",
    start: [
      { b: "Register", rest: " — choose a username you won't regret in six months. You begin at Level 1: Lost Tourist. This is accurate. Embrace it." },
      { b: "Allow location access", rest: " — this is how the app knows you're actually standing on Charles Bridge and not lying on your sofa in a different country claiming to have visited it. The system has seen this before. The system is not impressed." },
    ],
    installTitle: "Install as an App",
    installIntro: "Prague Stories runs full-screen on your phone with no browser bar and no pasting links every time. One-time setup.",
    installIOSTitle: "iPhone (Safari)",
    installIOS: [
      "Open Safari — must be Safari, not Chrome or any other browser.",
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
    installNote: "Once installed it opens full-screen like a native app — no address bar, no browser UI. Tap the icon and you are in Prague.",
    screensTitle: "The Screens",
    exploreTitle: "Explore Grid",
    explore: "Every location in the game. Filter by label or rarity, search by name (which defeats some of the mystery, but is allowed), or switch to My Collections to review past conquests smugly. Labels are granular and stackable — filter by Church, or by Hidden Gem, or by both at once.",
    cats: [],
    mapTitle: "Map",
    map: "Your command centre. Gold markers = yours. Grey = unclaimed. Walk within 100 m of an unvisited location and a gold banner rises from the bottom of the screen like a treasure chest surfacing from the Vltava. Tap it. Get XP.",
    detailTitle: "Location Detail",
    detail: "Tap any card. Pixel art, lore in three languages, XP value, Wikipedia link, Google Maps directions. At the bottom: the Collect button. Gold. Prominent. Beckoning.",
    dashTitle: "Dashboard",
    dash: "Your character sheet. Level badge, XP bar, progress ring, category breakdown, achievements, level roadmap. Very Skinner box. Very effective.",
    collectTitle: "How Collecting Works",
    steps: [
      "Go to the location. Physically. With your body.",
      "Open the location detail (from the map banner or the Explore grid).",
      "Tap Collect.",
      "The app silently requests your GPS coordinates.",
      "The server checks whether you are actually within range.",
      "If yes: XP lands, achievements may trigger, modal closes itself in 2.5 s with the quiet dignity of a job well done.",
      "If no: you receive an error and the strong implication that you are not where you said you were.",
    ],
    undoNote: "Changed your mind? The Uncollect button removes the check-in. The moral implications are yours to sit with.",
    xpTitle: "XP & Levels",
    xpIntro: "Each location pays XP based on its rarity — a card-style tier that tells you how rare a find it actually is:",
    diff: [
      "◆ Common — +10 XP. Not ordinary — just Prague-ordinary. Any other city would put these on a postcard.",
      "◆ Rare — +20 XP. Worth seeking out. Smart tourists find them. First-timers mostly walk past.",
      "◆ Superior — +30 XP. A step above rare. Not on the standard tourist radar, but rewarding for anyone willing to look just left of the obvious.",
      "◆ Epic — +50 XP. Hidden gems locals know and tourists don't. Requires effort, curiosity, and occasionally two tram transfers.",
      "◆ Mythic — +70 XP. Extremely hard to find, rarely visited, yet historically or culturally significant. You will not stumble upon these.",
      "◆ Legendary — +100 XP. Prague's most magnificent and iconic landmarks. If you haven't been here, you haven't really been to Prague.",
    ],
    xpOutro: "8 levels total: from Lost Tourist to Prague Legend. The gold cards know where you need to go.",
    achTitle: "Achievements",
    ach: "Ten achievements, unlocked automatically at certain milestones. You don't need to track them — they find you. Locked ones sit greyed-out on the Dashboard: visible enough to taunt, obscure enough to be mysterious. This is called design.",
    tipsTitle: "Tips From Those Who Went Before",
    tips: [
      { icon: "🚃", text: "Use the map on public transit. Watching your blue dot drift toward a pin while riding a tram is the correct way to experience Prague." },
      { icon: "💎", text: "Hidden Gems pay the most XP. Open the Explore filter, pick Hidden Gem, go to those places first. Thank yourself later." },
      { icon: "◆", text: "Mythic and Legendary locations pay the most XP (+70/+100). Open the Rarity filter, select those tiers, and go there first. The XP is proportional to the effort — and the effort is proportional to how few other tourists are present." },
      { icon: "📊", text: "The Dashboard category breakdown is your conscience. Zero Food & Drink entries? The game is gently suggesting you eat something." },
      { icon: "🌐", text: '"Žižkovský televizní vysílač" — if you can pronounce this correctly, consider it an unofficial achievement.' },
    ],
    faqTitle: "FAQ",
    faq: [
      { q: "Can I check in from my sofa?", a: "No. The server knows. The server is always watching. The server cares about geographic integrity more than you might expect from a hobby project." },
      { q: "What if my GPS drifts?", a: "The radius is generous enough for normal drift — not generous enough for 'I am in a different neighbourhood.' Stand closer." },
      { q: "Is there an end?", a: "100% completion. A progress ring filled entirely gold. Whether that's an ending or a beginning is a question the app declines to answer." },
      { q: "Which language should I use?", a: "All three work. EN for convenience, CZ for immersion, ZH for the delight of reading about a psychiatric hospital's music festival in Chinese." },
      { q: "Can I add my own locations?", a: "Yes. Hit + Add Location on the Explore page. The game does not discriminate between a medieval castle and a bench you like. Both earn XP." },
    ],
    loopTitle: "The Whole Point",
    loop: "Prague is one of the best-preserved medieval cities in Europe. Most visitors see the same ten postcards. Every location in this app comes with a Gemini-written story — part history, part RPG lore, enthusiastically embellished. The loop is simple: explore → collect → read the story → discover somewhere new → repeat. A virtuous cycle built on cobblestones, tram tickets, and a quietly growing appreciation for a city that has survived a remarkable amount.",
    pixelNote: "When you get home, flip through the pixel art illustrations one by one. They are beautiful — at least that's what the author thinks. If you disagree, please direct your feedback to Gemini, who generated them and presumably stands behind his work. Hopefully they make your day a little better either way.",
    outro: "Good luck out there. The city is waiting.",
  },

  cz: {
    title: "Průvodce Průzkumníka",
    challenge: "Troufáš si posbírat všechna panoramatická místa a historické památky, které Praha nabízí?",
    localChallenge: "A pokud jsi náhodou pražský rezident — odvážný předpoklad, ale statisticky možný — otázka stále platí. Jsi si opravdu jistý, že znáš příběh za každým dlažebním kamenem, každými oprýskanými dveřmi, každou podezřele dekorativní lebkou tohoto města? Zaváhal jsi. Proto jsi tady.",
    tagline: "Vstoupil jsi do města. Dlažební kameny jsou skutečné. XP jsou také skutečné. Pokračuj.",
    whatTitle: "Co to je",
    what: [
      "Praha ukrývá skutečná místa čekající na objevení — hrady, hřbitovy, továrny na dynamit, psychiatrická léčebna pořádající hudební festivaly, soutok dvou řek, kam skoro nikdo nejde. Jdeš tam. Stojíš tam. Aplikace si toho všimne. Dostáváš XP.",
      "Orci zde nejsou. Je tu však most, z nějž bylo svrženo více lidí, než by jakýkoli rozumný most měl. To se počítá.",
    ],
    startTitle: "Rychlý start",
    start: [
      { b: "Registrace", rest: " — vyber si uživatelské jméno, kterého nebudeš litovat za šest měsíců. Začínáš na Úrovni 1: Ztracený Turista. Toto je přesné. Přijmi to." },
      { b: "Povol přístup k poloze", rest: " — takto aplikace ví, že skutečně stojíš na Karlově mostě a neležíš na pohovce v jiné zemi a netvrdíš, že jsi ho navštívil. Systém to viděl. Systém není ohromen." },
    ],
    installTitle: "Nainstalovat jako aplikaci",
    installIntro: "Prague Stories běží v celé obrazovce telefonu bez adresního řádku. Jednorázové nastavení.",
    installIOSTitle: "iPhone (Safari)",
    installIOS: [
      "Otevři Safari — musí být Safari, ne Chrome ani jiný prohlížeč.",
      "Přejdi na URL aplikace.",
      "Klepni na tlačítko Sdílet (rámeček se šipkou nahoru) ve spodní části obrazovky.",
      'Sjeď dolů a klepni na „Přidat na plochu".',
      "Klepni na Přidat. Ikona aplikace se objeví na ploše.",
    ],
    installAndroidTitle: "Android (Chrome)",
    installAndroid: [
      "Otevři Chrome a přejdi na URL aplikace.",
      'Klepni na tři tečky (⋮) v pravém horním rohu.',
      'Klepni na „Přidat na plochu" nebo „Nainstalovat aplikaci".',
      "Klepni na Přidat. Ikona aplikace se objeví na ploše.",
    ],
    installNote: "Po instalaci se aplikace otevírá na celou obrazovku jako nativní aplikace — žádný adresní řádek. Klepni na ikonu a jsi v Praze.",
    screensTitle: "Obrazovky",
    exploreTitle: "Průzkum",
    explore: "Všechna místa ve hře. Filtruj podle štítku nebo vzácnosti, hledej podle jména (což kazí část záhady, ale je to povoleno), nebo přepni na Moje sbírka pro sebechvalnou prohlídku minulých výbojů. Štítky jsou detailní a kombinovatelné — filtruj podle Kostel, nebo podle Skrytý klenot, nebo obojí najednou.",
    cats: [],
    mapTitle: "Mapa",
    map: "Tvoje velitelské centrum. Zlaté značky = tvoje. Šedé = nevyžádané. Přijď do 100 m od nenavštíveného místa a ze spodní části obrazovky stoupne zlatý banner jako truhla s pokladem vynořující se z Vltavy. Klikni. Získej XP.",
    detailTitle: "Detail místa",
    detail: "Klikni na jakoukoli kartu. Pixel art, příběhy ve třech jazycích, hodnota XP, odkaz na Wikipedii, navigace v Mapách Google. Dole: tlačítko Sbírat. Zlaté. Výrazné. Lákající.",
    dashTitle: "Přehled",
    dash: "Tvůj charakterový list. Odznak úrovně, lišta XP, kruh pokroku, přehled kategorií, úspěchy, mapa úrovní. Velmi Skinnerova klec. Velmi efektivní.",
    collectTitle: "Jak funguje sbírání",
    steps: [
      "Jdi na místo. Fyzicky. Svým tělem.",
      "Otevři detail místa (z banneru mapy nebo Průzkumu).",
      "Klikni na Sbírat.",
      "Aplikace potichu požaduje tvoje GPS souřadnice.",
      "Server zkontroluje, zda jsi skutečně v dosahu.",
      "Pokud ano: XP přibývá, mohou se odemknout úspěchy, okno se samo zavře za 2,5 s s důstojností dobře odvedené práce.",
      "Pokud ne: dostaneš chybu a silný náznak, že nejsi tam, kde říkáš.",
    ],
    undoNote: "Změnil jsi názor? Tlačítko Odebrat odstraní check-in. Morální důsledky jsou tvoje.",
    xpTitle: "XP a úrovně",
    xpIntro: "Každé místo vyplácí XP podle své vzácnosti — systém karet, který přesně říká, jak vzácný je daný nález:",
    diff: [
      "◆ Běžné — +10 XP. Nic běžného — jen běžné na pražské poměry. Kdekoli jinde by z nich dělali pohlednice.",
      "◆ Vzácné — +20 XP. Stojí za to je hledat. Chytří turisté je najdou. Prvonávštěvníci většinou projdou kolem.",
      "◆ Výjimečné — +30 XP. O stupeň výše než vzácné. Nejsou na standardním turistickém radaru, ale odměňují každého, kdo se rozhodne podívat o kousek jinam.",
      "◆ Epické — +50 XP. Skryté klenoty, které znají místní. Vyžaduje úsilí, zvědavost a občas dva přestupy tramvají.",
      "◆ Mýtické — +70 XP. Nesmírně těžko dosažitelná, málokdy navštívená, přesto historicky nebo kulturně zásadní. Na tato místa se náhodou nenarazí.",
      "◆ Legendární — +100 XP. Nejvelkolepější a nejikoničtější pražské památky. Pokud jsi tu ještě nebyl, Prahu jsi vlastně neviděl.",
    ],
    xpOutro: "8 úrovní celkem: od Ztraceného Turisty po Pražskou Legendu. Zlaté karty ti ukážou, kam jít.",
    achTitle: "Úspěchy",
    ach: "Deset úspěchů, automaticky odemčených při dosažení určitých milníků. Nemusíš je sledovat — najdou tě. Zamčené sedí zašedlé na Přehledu: dost viditelné, aby dráždily, dost záhadné, aby zůstaly tajemstvím. Tomu se říká design.",
    tipsTitle: "Tipy od těch, kteří šli před tebou",
    tips: [
      { icon: "🚃", text: "Používej mapu v MHD. Sledovat svou modrou tečku mířící k pinnu v tramvaji je správný způsob, jak zažít Prahu." },
      { icon: "💎", text: "Skryté klenoty platí nejvíce XP. Otevři filtr, vyber Skrytý klenot, jdi tam jako první. Poděkuješ si." },
      { icon: "◆", text: "Mýtická a Legendární místa platí nejvíce XP (+70/+100). Otevři filtr Vzácnost, vyber tyto úrovně a jdi tam jako první. XP odpovídá úsilí — a úsilí odpovídá tomu, jak málo turistů tam bude." },
      { icon: "📊", text: "Přehled kategorií je tvědomí. Nula check-inů v Zábavě? Hra jemně naznačuje, že bys měl někde poobědvat." },
      { icon: "🌐", text: '"Žižkovský televizní vysílač" — pokud to dokážeš správně vyslovit, považuj to za neoficiální úspěch.' },
    ],
    faqTitle: "Časté dotazy",
    faq: [
      { q: "Mohu se přihlásit z pohovky?", a: "Ne. Server ví. Server vždy sleduje. Server dbá na geografickou integritu více, než bys od hobby projektu čekal." },
      { q: "Co když je GPS nepřesné?", a: "Poloměr je dostatečně velkorysý pro normální drift — ne pro 'jsem v jiné čtvrti'. Přijď blíže." },
      { q: "Existuje konec?", a: "100% dokončení. Kruh pokroku zcela zlatý. Zda to je konec nebo začátek, je filozofická otázka, na kterou aplikace odmítá odpovědět." },
      { q: "Jaký jazyk mám použít?", a: "Všechny tři fungují. EN pro pohodlí, CZ pro ponoření, ZH pro zvláštní radost ze čtení o hudebním festivalu v psychiatrické léčebně čínsky." },
      { q: "Mohu přidat vlastní místa?", a: "Ano. Stiskni + Přidat místo na stránce Průzkum. Hra nerozlišuje mezi středověkým hradem a lavičkou, kterou máš rád. Obě vydělávají XP." },
    ],
    loopTitle: "O co jde",
    loop: "Praha je jedno z nejlépe zachovaných středověkých měst v Evropě. Většina návštěvníků vidí těch stejných deset pohlednic. Každé místo v aplikaci přichází s příběhem napsaným Geminim — část história, část RPG legenda, nadšeně přikrášlená. Smyčka je jednoduchá: prozkoumej → sesbírej → přečti příběh → objevi nové místo → opakuj. Ctnostný cyklus postavený na dlažebních kamenech, tramvajových jízdenkách a tiše rostoucím obdivu k městu, které toho hodně přežilo.",
    pixelNote: "Až se vrátíš domů, prohlidni si pixel artové ilustrace jednu po druhé. Jsou krásné — alespoň tak si to myslí autor. Pokud nesouhlasíš, pošli svůj názor Geminimu, který je vygeneroval a pravděpodobně za nimi stojí. Doufáme, že ti každopádně trochu zpříjemní den.",
    outro: "Hodně štěstí tam venku. Město čeká.",
  },

  zh: {
    title: "探索者手册",
    challenge: "你有信心把布拉格的所有风景名胜以及地标建筑全部收入囊中吗？",
    localChallenge: "即使您是布拉格居民，我想您也需要这款应用——敢问阁下，您确定您对您城市的一草一木背后的故事都了如指掌吗？如果您迟疑了，请也加入吧！",
    tagline: "你已进入这座城市。鹅卵石是真实的。经验值也是真实的。继续前进。",
    whatTitle: "这是什么",
    what: [
      "布拉格有许多真实的地点等待被发现——城堡、墓地、炸药工厂、举办音乐节的精神病院，以及一个几乎无人造访的两河交汇处。你去那里，站在那里，应用注意到你的存在，你就获得经验值。",
      "这里没有兽人。不过，有一座桥——它抛下去的人比任何理智的桥都多。这也算。",
    ],
    startTitle: "快速开始",
    start: [
      { b: "注册", rest: "——选一个六个月后不会后悔的用户名。你从第1级：迷路的游客开始。这很准确，接受现实吧。" },
      { b: "允许位置权限", rest: "——这是应用确认你真的站在查理大桥上，而不是躺在另一个国家的沙发上声称自己去过的方式。系统见过这种情况，系统并不感动。" },
    ],
    installTitle: "安装为应用",
    installIntro: "Prague Stories 可以在手机上全屏运行，没有浏览器地址栏，无需每次粘贴链接。一次性设置。",
    installIOSTitle: "iPhone（Safari）",
    installIOS: [
      "打开 Safari——必须是 Safari，不能是 Chrome 或其他浏览器。",
      "前往应用的网址。",
      "点击屏幕底部的分享按钮（带向上箭头的方框）。",
      "向下滚动，点击「添加到主屏幕」。",
      "点击「添加」，应用图标将出现在主屏幕上。",
    ],
    installAndroidTitle: "Android（Chrome）",
    installAndroid: [
      "打开 Chrome，前往应用网址。",
      "点击右上角的三点菜单（⋮）。",
      "点击「添加到主屏幕」或「安装应用」。",
      "点击「添加」，应用图标将出现在主屏幕上。",
    ],
    installNote: "安装后，应用将像原生应用一样全屏启动——没有地址栏，没有浏览器界面。点击图标，即刻进入布拉格。",
    screensTitle: "各个页面",
    exploreTitle: "探索网格",
    explore: "游戏中的所有地点。按标签或稀有度筛选、按名字搜索（这会破坏一些神秘感，但仍然允许），或切换到我的收藏，自我陶醉地回顾过去的战绩。标签细致且可叠加——可以单选「教堂」，也可以同时选「教堂」和「小众景点」。",
    cats: [],
    mapTitle: "地图",
    map: "你的指挥中心。金色标记=已解锁。灰色=待征服。走进未访问地点100米范围内，屏幕底部会升起一条金色横幅，如同宝箱从伏尔塔瓦河中浮现。点击，获得经验值。",
    detailTitle: "地点详情",
    detail: "点击任意卡片。像素艺术、三语传说、经验值、维基百科链接、谷歌地图导航。底部：打卡按钮。金色，醒目，诱人。",
    dashTitle: "仪表盘",
    dash: "你的角色档案。等级徽章、经验值条、进度环、类别分布、成就、等级路线图。非常巴甫洛夫式，非常有效。",
    collectTitle: "如何打卡",
    steps: [
      "去那个地点。亲身前往，带上你的身体。",
      "打开地点详情（从地图横幅或探索网格）。",
      "点击打卡。",
      "应用悄悄请求你的GPS坐标。",
      "服务器检查你是否真的在范围内。",
      "如果是：经验值到账，成就可能触发，弹窗在2.5秒后以完成任务的尊严自动关闭。",
      "如果不是：你会收到错误提示，以及你不在你所说位置的强烈暗示。",
    ],
    undoNote: "改变主意了？取消收藏按钮可以撤销打卡。道德责任由你承担。",
    xpTitle: "经验值与等级",
    xpIntro: "每个地点根据其稀有度获得经验值——类似炉石传说的卡牌系统，直接告诉你这个地点有多稀有：",
    diff: [
      "◆ 常见 — +10 XP。并非真的普通——只是布拉格标准下的普通。换个城市，这里的每一处都能上明信片。",
      "◆ 稀有 — +20 XP。值得专程前往。有经验的游客能找到，第一次来的人大多擦肩而过。",
      "◆ 卓越 — +30 XP。高于稀有的存在。不在标准旅游路线上，但只要你愿意稍微偏离显眼之处，就会有所收获。",
      "◆ 史诗 — +50 XP。当地人才知道的隐藏宝藏。需要努力、好奇心，有时还要换两次电车。",
      "◆ 神话 — +70 XP。极难寻觅，鲜有人至，却具有重要的历史或文化意义。你不会偶然发现这些地方。",
      "◆ 传说 — +100 XP。布拉格最宏伟、最标志性的地标。没来过这里？那你其实还没真正到过布拉格。",
    ],
    xpOutro: "共8个等级：从迷路的游客到布拉格传奇。金色卡牌会告诉你该去哪里。",
    achTitle: "成就",
    ach: "十个成就，在达到特定里程碑时自动解锁。你不需要追踪它们——它们会找到你。锁定的成就在仪表盘上显示为灰色：够显眼，能让你心痒；够隐晦，保持神秘。这叫做设计。",
    tipsTitle: "前人留下的小贴士",
    tips: [
      { icon: "🚃", text: "在公共交通上使用地图。坐着有轨电车看着蓝点向标记点靠近，是体验布拉格的正确方式。" },
      { icon: "💎", text: "隐藏宝藏经验最高。打开筛选，选隐藏宝藏，优先去那里。之后你会感谢自己。" },
      { icon: "◆", text: "神话和传说地点经验最高（+70/+100）。打开稀有度筛选器，选择这两个等级，优先去那里。经验值与你付出的努力成正比——而努力程度通常与那里没有其他游客成正比。" },
      { icon: "📊", text: "仪表盘类别分布是你的良心。娱乐类零打卡？游戏在温柔地建议你该吃点东西了。" },
      { icon: "🌐", text: '"Žižkovský televizní vysílač"——如果你能正确发音，算作非官方成就。' },
    ],
    faqTitle: "常见问题",
    faq: [
      { q: "我能在沙发上打卡吗？", a: "不能。服务器知道。服务器一直在看。服务器对地理完整性的重视程度超出你对业余项目的预期。" },
      { q: "GPS不准怎么办？", a: '打卡半径对正常漂移足够宽容——但不足以宽容"我在另一个街区"。请站近一点。' },
      { q: "有终点吗？", a: "100%完成度。进度环完全变成金色。这是终点还是起点，是应用拒绝回答的哲学问题。" },
      { q: "用哪种语言？", a: "三种都可以。EN便于使用，CZ完全沉浸，ZH可以享受用中文阅读精神病院音乐节的独特乐趣。" },
      { q: "我能添加自己的地点吗？", a: "可以。在探索页面点击+添加地点。游戏不区分中世纪城堡和你喜欢的长椅。两者都有经验值。" },
    ],
    loopTitle: "核心理念",
    loop: "布拉格是欧洲保存最完好的中世纪城市之一。大多数游客只看那十张千篇一律的明信片。这个应用中的每个地点都有Gemini撰写的故事——一半历史，一半RPG传说，充满热情地加以渲染。循环很简单：探索 → 收藏 → 阅读故事 → 发现新地点 → 继续探索。这是一个建立在鹅卵石、有轨电车票和对这座历经沧桑之城日益增长的热爱上的良性循环。",
    pixelNote: "回到家后，一张一张翻看那些像素画吧。它们很精美——至少作者是这么认为的。如果你不同意，请把意见反馈给Gemini，是他生成了这些画，想必他愿意为自己的作品负责。无论如何，希望它们能让你的一天更美好一些。",
    outro: "祝你好运。这座城市在等待你。",
  },
};

export default function GuidePage() {
  const { lang } = useLang();
  const convert = useConvert();
  const c = deepConvert(CONTENT[lang] || CONTENT.en, convert);

  return (
    <div className="guide-page">
      <div className="guide-wrap">
        <h1 className="px-title" style={{ fontSize: 13, marginBottom: 6 }}>{c.title}</h1>
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
          {c.start.map((s, i) => (
            <div key={i} className="guide-step">
              <span className="guide-step-num">{i + 1}</span>
              <p className="guide-body"><strong>{s.b}</strong>{s.rest}</p>
            </div>
          ))}
        </section>

        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{c.installTitle}</h2>
          <p className="guide-body">{c.installIntro}</p>

          <h3 className="guide-h3" style={{ marginTop: 16 }}>📱 {c.installIOSTitle}</h3>
          {c.installIOS.map((step, i) => (
            <div key={i} className="guide-step">
              <span className="guide-step-num">{i + 1}</span>
              <p className="guide-body">{step}</p>
            </div>
          ))}

          <h3 className="guide-h3" style={{ marginTop: 16 }}>🤖 {c.installAndroidTitle}</h3>
          {c.installAndroid.map((step, i) => (
            <div key={i} className="guide-step">
              <span className="guide-step-num">{i + 1}</span>
              <p className="guide-body">{step}</p>
            </div>
          ))}

          <div className="guide-tip" style={{ marginTop: 16 }}>
            <span>{c.installNote}</span>
          </div>
        </section>

        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{c.screensTitle}</h2>

          <h3 className="guide-h3">{c.exploreTitle}</h3>
          <p className="guide-body">{c.explore}</p>

          <h3 className="guide-h3" style={{ marginTop: 16 }}>{c.mapTitle}</h3>
          <p className="guide-body">{c.map}</p>

          <h3 className="guide-h3" style={{ marginTop: 16 }}>{c.detailTitle}</h3>
          <p className="guide-body">{c.detail}</p>

          <h3 className="guide-h3" style={{ marginTop: 16 }}>{c.dashTitle}</h3>
          <p className="guide-body">{c.dash}</p>
        </section>

        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{c.collectTitle}</h2>
          {c.steps.map((step, i) => (
            <div key={i} className="guide-step">
              <span className="guide-step-num">{i + 1}</span>
              <p className="guide-body">{step}</p>
            </div>
          ))}
          <p className="guide-body" style={{ marginTop: 10 }}>{c.undoNote}</p>
        </section>

        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{c.xpTitle}</h2>
          <p className="guide-body">{c.xpIntro}</p>
          {c.diff.map((d, i) => (
            <div key={i} className="guide-step">
              <span className="guide-step-num">{i + 1}</span>
              <p className="guide-body">{d}</p>
            </div>
          ))}
          <p className="guide-body" style={{ marginTop: 10 }}>{c.xpOutro}</p>
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
