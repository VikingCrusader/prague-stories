// Era-overview cards ("Era Guide", cardType 'overview'): one per era,
// rendered first in its era with a key-moments strip, "who to watch" chips
// and a few landmarks (see HistoryEventSection). Written as trailers, not
// summaries: they set up the stage, the cast and the conflicts, name the
// turning points, and deliberately leave each era's biggest outcomes open.
// Kept in their own file and appended to `historyEvents` in
// seedHistoryEvents.js.
//
// `milestones[].slug` / `keyFigures[].slug` point at the event card a chip
// jumps to. Leave `slug` empty for something not written yet (Era 5 after
// 1437); fill it in once that card exists. When an era gains new cards,
// check whether its overview should mention them.

export const historyOverviews = [
  // ── Era 1 ────────────────────────────────────────────────────────────
  {
    slug: "era-guide-legends-origins",
    era: "legends-origins",
    cardType: "overview",
    startYear: -600,
    tone: "humorous",
    year: { en: "Prehistory – 800", cz: "Pravěk – 800", zh: "史前 – 800年" },
    title: {
      en: "Before Anyone Wrote It Down",
      cz: "Dřív, než to kdokoli zapsal",
      zh: "在有人动笔之前",
    },
    hookLine: {
      en: "A prophetess, a ploughman, a castle on a cliff and an army of women who refused to take orders. Bohemia's founding story has everything except proof.",
      cz: "Věštkyně, oráč, hrad na skále a vojsko žen, které odmítly poslouchat. Příběh o počátcích Čech má všechno kromě důkazů.",
      zh: "一位女先知，一个犁田的农夫，一座悬崖上的城堡，还有一支不肯听命的女子军。波希米亚的开国故事什么都不缺，唯独缺证据。",
    },
    summary: {
      en: "Every country likes a good origin story. Bohemia's was mostly written down by one priest, Cosmas of Prague, in the 1120s, a good three or four centuries after the events it describes. Later chroniclers then added the scenes he had somehow forgotten. So this era comes with a warning label: almost nothing in it can be proven, and all of it matters anyway.\n\nThe stage comes first. Over roughly a thousand years, three peoples passed through the Bohemian basin. [[link:early-history]]The Celtic Boii[[/link]] left the land its name, Germanic tribes moved in after them, and by the 6th century the Slavs had arrived to stay. They brought farms and hillforts and no written records at all, which is exactly the kind of gap a legend likes to move into.\n\nThen the story proper begins, and it begins with a woman. [[link:libuse-prophecy]]Libuše[[/link]], judge and seer, looks out over the Vltava and foresees a city whose glory will touch the stars. Her council is less impressed by the vision than annoyed at being ruled by a woman, and demands a husband. She sends a horse out into the countryside to find one. It stops beside [[link:premysl-the-ploughman]]a man ploughing a field[[/link]]. Bohemia's rulers will call him their ancestor for centuries to come.\n\n[[b]]This era is less about what happened than about the story Bohemia later decided to tell about itself.[[/b]] Each card is worth reading twice: once for the legend, and once for who wrote it down, when, and what they added.\n\nKeep three questions in mind. Which hill did the dynasty really start on? Vyšehrad and Prague Castle have been arguing about it for two centuries. What happens when Libuše's women decide they would rather [[link:girls-war]]build their own castle[[/link]] than go back to the spinning wheel? And of the seven dukes who follow Přemysl, how many actually existed?\n\nIn Prague you can still stand on the rock at Vyšehrad where Libuše is supposed to have prophesied, and walk past her and Přemysl carved in stone by 19th-century patriots who very much wanted all of it to be true. Whether it was is the one thing nobody can promise you.",
      cz: "Každá země má ráda pořádný příběh o svém začátku. Ten český z velké části sepsal jediný kněz, Kosmas, ve 20. letech 12. století, tedy dobré tři čtyři sta let po událostech, které popisuje. Pozdější kronikáři pak doplnili scény, na které nějak zapomněl. Tahle éra proto přichází s varováním: skoro nic z ní nejde dokázat, a přesto na tom všem záleží.\n\nNejdřív jeviště. Zhruba tisíc let se Českou kotlinou střídaly tři národy. [[link:early-history]]Keltští Bójové[[/link]] zemi zanechali jméno, po nich přišly germánské kmeny a v 6. století dorazili Slované, aby už zůstali. Přinesli pole a hradiště, ale žádné písemné záznamy, což je přesně ten druh mezery, do které se ráda nastěhuje pověst.\n\nPak teprve začíná vlastní příběh, a začíná ženou. [[link:libuse-prophecy]]Libuše[[/link]], soudkyně a věštkyně, hledí přes Vltavu a vidí město, jehož sláva se bude dotýkat hvězd. Její rada není z vize nijak nadšená, zato ji dost rozlaďuje, že jí vládne žena, a tak žádá muže. Libuše vyšle do kraje koně, aby ho našel. Kůň se zastaví u [[link:premysl-the-ploughman]]muže, který orá pole[[/link]]. Čeští panovníci se k němu budou hlásit jako k předkovi celá staletí.\n\n[[b]]Tahle éra není ani tak o tom, co se stalo, jako o příběhu, který si o sobě Čechy později rozhodly vyprávět.[[/b]] Každou kartu se vyplatí přečíst dvakrát: jednou kvůli pověsti a podruhé kvůli tomu, kdo ji zapsal, kdy a co k ní přidal.\n\nMějte na paměti tři otázky. Na kterém kopci rod doopravdy začal? Vyšehrad a Pražský hrad se o to přou už dvě stě let. Co se stane, když se Libušiny ženy rozhodnou, že si raději [[link:girls-war]]postaví vlastní hrad[[/link]], než aby se vrátily ke kolovratu? A kolik ze sedmi knížat, kteří přijdou po Přemyslovi, skutečně existovalo?\n\nV Praze se dodnes můžete postavit na vyšehradskou skálu, odkud prý Libuše věštila, a projít kolem ní a Přemysla, vytesaných do kamene vlastenci 19. století, kteří si moc přáli, aby to všechno byla pravda. Jestli byla, to vám nikdo slíbit nemůže.",
      zh: "每个国家都喜欢一个像样的开国故事。波希米亚的这一个，大部分出自一位神父之手：布拉格的科斯马斯，写于12世纪20年代，离他笔下的事件少说也隔了三四百年。后来的编年史家，又把他“漏掉”的情节一一补上。所以这个时代自带一张警示标签：里面几乎没有一件事能被证实，可每一件都很重要。\n\n先说舞台。大约一千年里，先后有三批民族经过波希米亚盆地。[[link:early-history]]凯尔特的波伊人[[/link]]给这片土地留下了名字，日耳曼部落随后迁入，到了6世纪，斯拉夫人来了，而且留了下来。他们带来了农田和山寨，却没带来任何文字记录。传说最喜欢住进的，正是这种空白。\n\n然后，故事才正式开场，而且是由一位女性开场。[[link:libuse-prophecy]]莉布谢[[/link]]身兼法官与先知，她远眺伏尔塔瓦河，预见了一座荣光将触及星辰的城市。她的臣民对这番预言兴趣不大，倒是对被一个女人统治很有意见，于是要求她找个丈夫。她放出一匹马去乡间寻人。马在[[link:premysl-the-ploughman]]一个正在犁田的男人[[/link]]身边停了下来。此后好几百年，波希米亚的统治者都会认他做祖先。\n\n[[b]]这个时代讲的，与其说是发生了什么，不如说是波希米亚后来决定怎样讲述自己。[[/b]]每张卡都值得读两遍：一遍读传说本身，一遍读是谁、在什么时候把它写了下来，又往里添了些什么。\n\n读的时候，不妨带着三个问题。这个王朝究竟是在哪座山上起家的？维谢赫拉德和布拉格城堡为此已经争了两百年。当莉布谢身边的女人们宁可[[link:girls-war]]自己筑一座城堡[[/link]]，也不愿回去纺线，会发生什么？普热米斯尔之后的七位公爵，又有几位真的存在过？\n\n如今在布拉格，你仍然可以站上维谢赫拉德的那块岩石，据说莉布谢就是在这里说出了预言。附近还立着她和普热米斯尔的石像，出自19世纪一群爱国者之手，他们非常希望这一切都是真的。至于是不是真的，没有人能向你打包票。",
    },
    milestones: [
      { year: { en: "To 6th c.", cz: "Do 6. stol.", zh: "至6世纪" }, label: { en: "Before the legend", cz: "Před pověstí", zh: "传说之前" }, slug: "early-history" },
      { year: { en: "8th c.", cz: "8. stol.", zh: "8世纪" }, label: { en: "Libuše's prophecy", cz: "Libušino proroctví", zh: "莉布谢的预言" }, slug: "libuse-prophecy" },
      { year: { en: "8th c.", cz: "8. stol.", zh: "8世纪" }, label: { en: "The ploughman", cz: "Oráč", zh: "犁田者" }, slug: "premysl-the-ploughman" },
      { year: { en: "8th c.", cz: "8. stol.", zh: "8世纪" }, label: { en: "Vyšehrad", cz: "Vyšehrad", zh: "维谢赫拉德" }, slug: "founding-of-vysehrad" },
      { year: { en: "8th c.", cz: "8. stol.", zh: "8世纪" }, label: { en: "The Girls' War", cz: "Dívčí válka", zh: "少女之战" }, slug: "girls-war" },
      { year: { en: "730–867", cz: "730–867", zh: "730–867" }, label: { en: "Seven dukes", cz: "Sedm knížat", zh: "七位公爵" }, slug: "seven-legendary-dukes" },
    ],
    keyFigures: [
      { name: { en: "Libuše", cz: "Libuše", zh: "莉布谢" }, slug: "libuse-prophecy" },
      { name: { en: "Přemysl the Ploughman", cz: "Přemysl Oráč", zh: "犁田者普热米斯尔" }, slug: "premysl-the-ploughman" },
      { name: { en: "Vlasta", cz: "Vlasta", zh: "弗拉斯塔" }, slug: "girls-war" },
      { name: { en: "Cosmas of Prague", cz: "Kosmas", zh: "科斯马斯" }, slug: "seven-legendary-dukes" },
    ],
    relatedLandmarks: [
      { slug: "vysehrad", relation: { en: "The rock of Libuše's prophecy, and the 19th-century statues of the legend", cz: "Skála Libušina proroctví a sochy pověsti z 19. století", zh: "莉布谢预言的岩石，以及19世纪的传说人物雕像" } },
      { slug: "hradiste-libusin", relation: { en: "The hillfort legend names as Libuše's seat", cz: "Hradiště, které pověst označuje za Libušino sídlo", zh: "传说中莉布谢居住的城寨" } },
      { slug: "pomnik-premysla-orace", relation: { en: "Stadice, where the horse found its ploughman", cz: "Stadice, kde kůň našel svého oráče", zh: "斯塔迪采，那匹马找到农夫的地方" } },
    ],
  },

  // ── Era 2 ────────────────────────────────────────────────────────────
  {
    slug: "era-guide-bohemian-duchy",
    era: "bohemian-duchy",
    cardType: "overview",
    startYear: 870,
    tone: "humorous",
    year: { en: "870–1198", cz: "870–1198", zh: "870年－1198年" },
    title: {
      en: "One Family, Three Hundred Years of Arguments",
      cz: "Jedna rodina, tři sta let hádek",
      zh: "一个家族，吵了三百年",
    },
    hookLine: {
      en: "The legends end and real people take over: saints, murderers, kidnappers and crusaders, nearly all of them from the same family, and nearly all of them after the same chair.",
      cz: "Pověsti končí a slova se ujímají skuteční lidé: světci, vrazi, únosci i křižáci, skoro všichni z jedné rodiny a skoro všichni po stejné židli.",
      zh: "传说落幕，真人登场：圣徒、凶手、绑匪、十字军，几乎全出自同一个家族，也几乎全盯着同一把椅子。",
    },
    summary: {
      en: "Around 870 the fog lifts. One of those vague legendary names turns into [[link:borivoj-first-duke]]a real duke[[/link]] with a real date, a foreign overlord, and a brand-new hill fort above the Vltava that will one day be Prague Castle. From here on there are sources, and the sources are not kind.\n\nThe stage is small. Bohemia is a duchy, not a kingdom, squeezed between Great Moravia, the Magyars, Poland and an ever-present German emperor. Its capital isn't even settled: Prague Castle, Vyšehrad and a handful of Moravian strongholds all compete for the title.\n\nThe cast is mostly one family, the Přemyslids, and its favourite hobby is fighting itself. Within three generations it produces a martyred grandmother, a saintly duke and the brother who has an opinion about him. Later come a duke who loses the entire country without a battle, a brother who blinds a brother, and a young nobleman who solves his marriage problem by [[link:kidnapped-duchess-1019]]kidnapping the bride from a convent[[/link]].\n\n[[b]]The real story of this era is a family slowly learning, by trial and a great deal of error, how to pass on power without killing each other.[[/b]] One duke writes a [[link:bretislav-succession-law-1055]]succession rule[[/link]] meant to settle the matter for good. It settles nothing. It just gives the fighting a more formal shape.\n\nMeanwhile Bohemia keeps reaching for the one thing that would set it apart: a crown. It gets one in 1085, and another in 1158, and each time the crown is personal, a reward for one man that dies with him. Watch how that happens twice. Then ask whether the third attempt, at the very end of the era, will go any differently.\n\nPrague grows up in the middle of all this. It gets a castle, a bishop, its first stone churches and, in the 1170s, its first stone bridge across the Vltava. Much of that is still standing, if you know where to look.",
      cz: "Kolem roku 870 se mlha rozplyne. Z jednoho z těch mlhavých bájných jmen se stane [[link:borivoj-first-duke]]skutečný kníže[[/link]] se skutečným datem, cizím pánem nad sebou a čerstvě postaveným hradištěm nad Vltavou, ze kterého jednou bude Pražský hrad. Od téhle chvíle existují prameny, a ty nejsou nijak shovívavé.\n\nJeviště je malé. Čechy jsou knížectví, ne království, sevřené mezi Velkou Moravou, Maďary, Polskem a věčně přítomným německým císařem. Nemají ani pevné hlavní město: o ten titul soupeří Pražský hrad, Vyšehrad a hrstka moravských center.\n\nHlavní obsazení tvoří hlavně jedna rodina, Přemyslovci, a její oblíbenou zábavou jsou spory sama se sebou. Během tří generací vydá umučenou babičku, svatého knížete a bratra, který na něj má vlastní názor. Později přijde kníže, který přijde o celou zemi bez jediné bitvy, bratr, který oslepí bratra, a mladý šlechtic, který svůj sňatkový problém vyřeší tím, že [[link:kidnapped-duchess-1019]]unese nevěstu z kláštera[[/link]].\n\n[[b]]Skutečným příběhem téhle éry je rodina, která se pomalu, metodou pokusu a velkého množství omylů, učí předávat moc tak, aby se přitom navzájem nepovraždila.[[/b]] Jeden kníže sepíše [[link:bretislav-succession-law-1055]]nástupnický řád[[/link]], který měl celou věc jednou provždy vyřešit. Nevyřeší nic. Jen dá bojům formálnější podobu.\n\nČechy mezitím pořád natahují ruku po jediné věci, která by je odlišila od ostatních: po koruně. Jednu dostanou roku 1085, další roku 1158, a pokaždé je koruna osobní, odměna pro jednoho muže, která s ním zemře. Sledujte, jak se to stane dvakrát. A pak se zeptejte, jestli třetí pokus na samém konci éry dopadne jinak.\n\nUprostřed toho všeho Praha dospívá. Dostane hrad, biskupa, první kamenné kostely a v 70. letech 12. století i první kamenný most přes Vltavu. Hodně z toho dodnes stojí, když víte, kam se dívat.",
      zh: "870年前后，迷雾散去。那些模糊的传说名字里，终于有一个变成了[[link:borivoj-first-duke]]真实存在的公爵[[/link]]：有确切的年代，有一位外国宗主，还在伏尔塔瓦河畔的山上新筑了一座要塞，这里日后将成为布拉格城堡。从此开始有了史料，而史料一点都不客气。\n\n舞台很小。波希米亚只是一个公国，算不上王国，夹在大摩拉维亚、马扎尔人、波兰，还有一位无处不在的德意志皇帝之间。它连首都都还没定下来：布拉格城堡、维谢赫拉德，加上几座摩拉维亚的据点，都在争这个名分。\n\n主角基本是同一个家族，普热米斯尔家族，而这个家族最大的爱好就是窝里斗。短短三代人，它就出了一位殉道的祖母、一位圣徒公爵，还有一个对这位圣徒很有意见的弟弟。后来又有一位没打一仗就把整个国家弄丢了的公爵，一个把亲兄弟弄瞎的弟弟，还有一个年轻贵族，他解决婚姻难题的办法，是直接[[link:kidnapped-duchess-1019]]从修道院里把新娘抢走[[/link]]。\n\n[[b]]这个时代真正的故事，是一个家族在一次次试错中慢慢学会：怎样交接权力，而不必互相残杀。[[/b]]有一位公爵定下了一条[[link:bretislav-succession-law-1055]]继承规矩[[/link]]，本想一劳永逸。结果什么都没解决，只是让争斗换了一副更正式的样子。\n\n与此同时，波希米亚一直在够一样能让它与众不同的东西：王冠。1085年它拿到了一顶，1158年又拿到一顶，可每一次都只属于国王个人，是给某一个人的奖赏，人一死，王冠也就跟着没了。看看这件事怎样发生了两次。然后问问自己：这个时代的最后一次尝试，会不会有什么不同？\n\n布拉格就在这一片混乱中长大。它有了城堡、主教、第一批石砌教堂，到12世纪70年代，还有了伏尔塔瓦河上的第一座石桥。其中不少至今还在，只要你知道该往哪儿看。",
    },
    milestones: [
      { year: { en: "870", cz: "870", zh: "870" }, label: { en: "The first real duke", cz: "První skutečný kníže", zh: "第一位真实的公爵" }, slug: "borivoj-first-duke" },
      { year: { en: "935", cz: "935", zh: "935" }, label: { en: "Brother against brother", cz: "Bratr proti bratrovi", zh: "手足相残" }, slug: "st-wenceslas-murder" },
      { year: { en: "973", cz: "973", zh: "973" }, label: { en: "A bishop for Prague", cz: "Biskup pro Prahu", zh: "布拉格有了主教" }, slug: "prague-bishopric-973" },
      { year: { en: "1055", cz: "1055", zh: "1055" }, label: { en: "The succession rule", cz: "Nástupnický řád", zh: "继承规矩" }, slug: "bretislav-succession-law-1055" },
      { year: { en: "1085", cz: "1085", zh: "1085" }, label: { en: "The first crown", cz: "První koruna", zh: "第一顶王冠" }, slug: "vratislaus-ii-first-crown-1085" },
      { year: { en: "1158", cz: "1158", zh: "1158" }, label: { en: "The second crown", cz: "Druhá koruna", zh: "第二顶王冠" }, slug: "vladislaus-ii-second-crown-1158" },
      { year: { en: "1198", cz: "1198", zh: "1198" }, label: { en: "The third attempt", cz: "Třetí pokus", zh: "第三次尝试" }, slug: "otakar-hereditary-kingdom-1198" },
    ],
    keyFigures: [
      { name: { en: "Bořivoj", cz: "Bořivoj", zh: "博日沃伊" }, slug: "borivoj-first-duke" },
      { name: { en: "St. Ludmila", cz: "sv. Ludmila", zh: "圣鲁德米拉" }, slug: "st-ludmila-martyrdom" },
      { name: { en: "St. Wenceslas", cz: "sv. Václav", zh: "圣瓦茨拉夫" }, slug: "wenceslas-life-and-reign" },
      { name: { en: "Boleslav I", cz: "Boleslav I.", zh: "博莱斯拉夫一世" }, slug: "st-wenceslas-murder" },
      { name: { en: "St. Adalbert", cz: "sv. Vojtěch", zh: "圣阿达尔伯特" }, slug: "st-adalbert-martyrdom-997" },
      { name: { en: "Břetislav I", cz: "Břetislav I.", zh: "布热季斯拉夫一世" }, slug: "kidnapped-duchess-1019" },
      { name: { en: "Vratislaus II", cz: "Vratislav II.", zh: "弗拉季斯拉夫二世" }, slug: "vysehrad-revival-1070" },
      { name: { en: "Vladislaus II", cz: "Vladislav II.", zh: "弗拉迪斯拉夫二世" }, slug: "siege-of-prague-1142" },
    ],
    relatedLandmarks: [
      { slug: "levy-hradec", relation: { en: "Bořivoj's seat, where Bohemia's first church stood", cz: "Bořivojovo sídlo, kde stál první kostel v Čechách", zh: "博日沃伊的居所，波希米亚第一座教堂所在地" } },
      { slug: "st-georges-basilica", relation: { en: "Prague Castle's oldest surviving church, and St. Ludmila's tomb", cz: "Nejstarší dochovaný kostel Pražského hradu a hrob sv. Ludmily", zh: "布拉格城堡现存最古老的教堂，圣鲁德米拉安葬于此" } },
      { slug: "hradiste-libice", relation: { en: "The stronghold of the rival Slavník clan", cz: "Hradiště soupeřícího rodu Slavníkovců", zh: "敌对的斯拉夫尼克家族的城寨" } },
    ],
  },

  // ── Era 3 ────────────────────────────────────────────────────────────
  {
    slug: "era-guide-rise-of-a-kingdom",
    era: "rise-of-a-kingdom",
    cardType: "overview",
    startYear: 1199,
    tone: "humorous",
    year: { en: "1199–1346", cz: "1199–1346", zh: "1199年－1346年" },
    title: {
      en: "A Crown Worth Fighting For",
      cz: "Koruna, o kterou stálo za to bojovat",
      zh: "一顶值得争的王冠",
    },
    hookLine: {
      en: "Bohemia finally has a crown that stays put. For a century and a half, everyone from Rome to the Baltic tries to find out how far it can reach.",
      cz: "Čechy konečně mají korunu, která drží. Půldruhého století pak všichni od Říma po Baltské moře zjišťují, kam až dosáhne.",
      zh: "波希米亚终于有了一顶戴得稳的王冠。接下来的一个半世纪，从罗马到波罗的海，所有人都想知道它的手能伸多远。",
    },
    summary: {
      en: "The era opens with a problem solved. After two crowns that died with their owners, Bohemia's third one is hereditary. The Přemyslids are now kings by right, and they immediately start acting like it.\n\nThe stage gets much bigger. Silver turns up in the hills, German settlers arrive by invitation, and wooden Prague slowly [[link:stone-prague-1230]]turns to stone[[/link]]. Gothic architecture shows up. A king founds a whole new town below the castle, today's Malá Strana, and a Mongol army passes close enough to make everyone nervous.\n\nThe cast is a family at its peak. A princess [[link:st-agnes-of-bohemia-1211]]turns down an emperor[[/link]] and becomes a saint instead. Her nephew, the \"Iron and Golden King\" Otakar II, collects duchies until his lands run from the Sudetes to the Adriatic, and then meets a modest count named Rudolf of Habsburg whom nobody took seriously. A boy king survives three \"guardians\" and an ambitious stepfather, and then turns Kutná Hora's silver into a coin the whole region will end up copying.\n\n[[b]]This is the era where Bohemia stops being somebody's fief and starts being somebody's problem.[[/b]] For a little over a year, one family holds three crowns at once. Neighbours take note, and neighbours start forming coalitions.\n\nThen the story changes hands. A new dynasty arrives from Luxembourg, married in through a Přemyslid princess who once had to flee her own capital, with a fourteen-year-old king who speaks no Czech and a court at war with itself. That king will be famous across Europe and almost never at home. His son, sent back to a kingdom in ruins, will start rebuilding it one castle at a time.\n\nTwo questions to carry with you. How long can a family stay this high before somebody pulls it down? And how does a king who has gone completely blind end up riding into one last battle in France? The answers are in the cards. Some of them arrive in a single afternoon.\n\nIn Prague, this is the era that laid the first stone of St. Vitus Cathedral, built the Convent of St. Agnes and gave Malá Strana its streets.",
      cz: "Éra začíná vyřešeným problémem. Po dvou korunách, které zemřely se svými majiteli, je ta třetí dědičná. Přemyslovci jsou teď králi z práva a okamžitě se tak začnou chovat.\n\nJeviště se výrazně zvětší. V kopcích se objeví stříbro, na pozvání přicházejí němečtí osadníci a dřevěná Praha se pomalu [[link:stone-prague-1230]]mění v kamennou[[/link]]. Dorazí gotika. Jeden král založí pod hradem úplně nové město, dnešní Malou Stranu, a mongolské vojsko projde dost blízko na to, aby byli všichni nervózní.\n\nObsazení tvoří rod na vrcholu sil. Jedna princezna [[link:st-agnes-of-bohemia-1211]]odmítne císaře[[/link]] a stane se místo toho světicí. Její synovec, „král železný a zlatý“ Přemysl Otakar II., sbírá vévodství, dokud jeho země nesahají od Krkonoš po Jadran, a pak narazí na nenápadného hraběte Rudolfa Habsburského, kterého nikdo nebral vážně. Chlapec na trůně přežije tři „poručníky“ i ctižádostivého otčíma a pak promění kutnohorské stříbro v minci, kterou nakonec napodobí celý region.\n\n[[b]]V téhle éře Čechy přestávají být něčím lénem a začínají být něčím problémem.[[/b]] Na něco přes rok drží jeden rod tři koruny najednou. Sousedé si toho všimnou a sousedé začnou uzavírat koalice.\n\nPak příběh změní majitele. Z Lucemburska přichází nová dynastie, přiženěná přes přemyslovskou princeznu, která kdysi musela utíkat z vlastního hlavního města, se čtrnáctiletým králem, který neumí česky, a s dvorem, který válčí sám se sebou. Ten král bude slavný po celé Evropě a doma skoro nikdy. Jeho syn, poslaný zpátky do zničeného království, ho začne stavět znovu, hrad po hradu.\n\nDvě otázky na cestu. Jak dlouho může rod vydržet takhle vysoko, než ho někdo stáhne dolů? A jak se stane, že král, který úplně oslepl, vyrazí do poslední bitvy ve Francii? Odpovědi najdete v kartách. Některé z nich přijdou během jediného odpoledne.\n\nV Praze tahle éra položila základní kámen katedrály sv. Víta, postavila Anežský klášter a dala Malé Straně její ulice.",
      zh: "这个时代以一个已经解决的难题开场。前两顶王冠都跟着主人一起进了坟墓，第三顶终于可以世袭了。普热米斯尔家族如今是名正言顺的国王，而且立刻就摆出了国王的派头。\n\n舞台一下子大了许多。山里挖出了白银，德意志移民受邀而来，木头搭的布拉格慢慢[[link:stone-prague-1230]]变成了石头城[[/link]]。哥特式建筑来了。一位国王在城堡脚下建起一整座新城，也就是今天的小城区；一支蒙古大军从不远处经过，让所有人都捏了一把汗。\n\n主角是一个正处在巅峰的家族。一位公主[[link:st-agnes-of-bohemia-1211]]拒绝了皇帝的求婚[[/link]]，后来成了圣徒。她的侄子、“铁与金之王”奥托卡二世四处收集公国，直到领土从苏台德一直铺到亚得里亚海，然后撞上了一位谁都没当回事的低调伯爵：哈布斯堡的鲁道夫。一个少年国王熬过了三位“监护人”和一个野心勃勃的继父，随后把库特纳霍拉的白银铸成了一种钱币，整个地区后来都照着它铸币。\n\n[[b]]正是在这个时代，波希米亚不再是别人的封地，而成了别人的心病。[[/b]]有那么一年多，一个家族同时握着三顶王冠。邻居们看在眼里，邻居们开始结盟。\n\n然后，故事换了主人。一个新王朝从卢森堡而来，靠着与一位曾被迫逃离自己都城的普热米斯尔公主联姻入主波希米亚，带来了一位不会说捷克语的十四岁国王，和一个自己跟自己打仗的宫廷。这位国王将名扬全欧，却几乎从不在家。他的儿子被派回一个满目疮痍的王国，从一座城堡开始，一点点把它重建起来。\n\n带着两个问题往下读。一个家族能在这么高的位置待多久，才会被人拉下来？一位双目完全失明的国王，又是怎么骑马冲进了法国的最后一场战役？答案都在卡片里。其中有些，只用了一个下午。\n\n在布拉格，正是这个时代为圣维特大教堂奠下了第一块基石，建起了圣阿格尼丝修道院，也给小城区铺出了街道。",
    },
    milestones: [
      { year: { en: "1241", cz: "1241", zh: "1241" }, label: { en: "The Mongols pass by", cz: "Mongolové táhnou kolem", zh: "蒙古人过境" }, slug: "mongol-invasion-1241" },
      { year: { en: "1257", cz: "1257", zh: "1257" }, label: { en: "A new town below the castle", cz: "Nové město pod hradem", zh: "城堡下的新城" }, slug: "founding-of-mala-strana-1257" },
      { year: { en: "1278", cz: "1278", zh: "1278" }, label: { en: "Marchfeld", cz: "Moravské pole", zh: "马尔希费尔德" }, slug: "battle-of-marchfeld-1278" },
      { year: { en: "1300", cz: "1300", zh: "1300" }, label: { en: "The Prague groschen", cz: "Pražský groš", zh: "布拉格格罗申" }, slug: "from-ore-to-order-1300" },
      { year: { en: "1306", cz: "1306", zh: "1306" }, label: { en: "An afternoon in Olomouc", cz: "Odpoledne v Olomouci", zh: "奥洛穆茨的一个下午" }, slug: "four-centuries-ended-1306" },
      { year: { en: "1310", cz: "1310", zh: "1310" }, label: { en: "The Luxembourgs arrive", cz: "Přicházejí Lucemburkové", zh: "卢森堡家族到来" }, slug: "dawn-of-the-luxembourgs-1310" },
      { year: { en: "1344", cz: "1344", zh: "1344" }, label: { en: "A cathedral's first stone", cz: "Základní kámen katedrály", zh: "大教堂的第一块石头" }, slug: "dawn-over-prague-1344" },
    ],
    keyFigures: [
      { name: { en: "Otakar I", cz: "Přemysl Otakar I.", zh: "奥托卡一世" }, slug: "otakar-i-family-purge-1199" },
      { name: { en: "St. Agnes", cz: "sv. Anežka", zh: "圣阿格尼丝" }, slug: "st-agnes-of-bohemia-1211" },
      { name: { en: "Otakar II", cz: "Přemysl Otakar II.", zh: "奥托卡二世" }, slug: "the-boy-king-1246" },
      { name: { en: "Rudolf of Habsburg", cz: "Rudolf Habsburský", zh: "哈布斯堡的鲁道夫" }, slug: "rudolf-of-habsburg-elected-1273" },
      { name: { en: "Záviš of Falkenstein", cz: "Záviš z Falkenštejna", zh: "扎维什·冯·法尔肯斯坦" }, slug: "enemies-on-every-side-1276" },
      { name: { en: "Wenceslas II", cz: "Václav II.", zh: "瓦茨拉夫二世" }, slug: "three-guardians-1279" },
      { name: { en: "Elizabeth", cz: "Eliška Přemyslovna", zh: "伊丽莎白" }, slug: "the-fleeing-princess-1310" },
      { name: { en: "John of Luxembourg", cz: "Jan Lucemburský", zh: "卢森堡的约翰" }, slug: "dawn-of-the-luxembourgs-1310" },
      { name: { en: "Young Charles", cz: "Mladý Karel", zh: "少年查理" }, slug: "the-prince-who-came-to-put-out-the-fire-1333" },
    ],
    relatedLandmarks: [
      { slug: "klaster-sv-anezky-ceske", relation: { en: "The convent Agnes founded, and some of Prague's earliest Gothic", cz: "Klášter, který Anežka založila, s jednou z nejstarších gotik v Praze", zh: "阿格尼丝创立的修道院，布拉格最早的哥特式建筑之一" } },
      { slug: "old-town-square", relation: { en: "The heart of the stone city the German settlers helped build", cz: "Srdce kamenného města, které pomohli postavit němečtí osadníci", zh: "德意志移民参与建起的石头城的中心" } },
      { slug: "st-vitus-cathedral", relation: { en: "First stone laid in 1344 by a blind king and his son", cz: "Základní kámen položili roku 1344 slepý král a jeho syn", zh: "1344年，一位失明的国王和他的儿子在这里奠基" } },
      { slug: "klaster-zlata-koruna", relation: { en: "Otakar II's monastery, built to keep a rival family in check", cz: "Klášter Přemysla Otakara II., založený jako protiváha mocného rodu", zh: "奥托卡二世建来牵制一个敌对家族的修道院" } },
    ],
  },

  // ── Era 4 ────────────────────────────────────────────────────────────
  {
    slug: "era-guide-kingdom-golden-age",
    era: "kingdom-golden-age",
    cardType: "overview",
    startYear: 1346,
    tone: "humorous",
    year: { en: "1346–1378", cz: "1346–1378", zh: "1346年－1378年" },
    title: {
      en: "One Man's Building Site",
      cz: "Staveniště jednoho muže",
      zh: "一个人的工地",
    },
    hookLine: {
      en: "Thirty-two years, one king, and a plan to turn a muddy provincial capital into the centre of the Holy Roman Empire. Most of it is still standing.",
      cz: "Dvaatřicet let, jeden král a plán udělat z blátivého provinčního hlavního města střed Svaté říše římské. Většina z toho dodnes stojí.",
      zh: "三十二年，一位国王，一个计划：把一座满街泥泞的地方首府，变成神圣罗马帝国的中心。这个计划的大部分成果，至今还立在那里。",
    },
    summary: {
      en: "The era opens with a strange kind of victory. Charles has just been elected King of the Romans, but half of Germany refuses to recognise him, and he has to [[link:the-king-who-came-home-in-disguise-1347]]sneak home disguised as his own servant[[/link]]. His blind father is dead. His rival still holds the imperial regalia. It is not an obvious start for a golden age.\n\nThe stage is Prague, and Prague is about to change more in thirty years than in the three centuries before. Charles has grown up at the French court and seen what a real capital looks like. He wants one, and he has very clear ideas about where to put it.\n\n[[b]]This is the rare era where one man's plans and a city's fortunes line up almost perfectly.[[/b]] In a single year Charles founds the New Town, Central Europe's first university and the castle of Karlštejn. Later come a stone bridge across the Vltava, a law for electing emperors that lasts four hundred years, and a wall on Petřín Hill that gives the hungry poor paid work.\n\nThe cast is smaller than in earlier eras, because Charles keeps most of the stage to himself. Around him are four wives, a pope who was once his tutor, rivals he either buys off or marries into, a son-in-law who forges himself a title, and Petrarch, who keeps writing to ask when the emperor will finally fix Italy. The Black Death sweeps across Europe and, for reasons nobody fully understands, mostly passes Bohemia by.\n\nWatch how Charles wins. Almost never on a battlefield. He wins with marriages, money, paperwork and patience, and with ceremony staged so carefully that pilgrims travel across Europe to see it.\n\nAnd keep one question open. Charles spends decades arranging every crown his family will need after him. What happens to the one problem he runs out of time to arrange?\n\nIn Prague you are surrounded by this era: Charles Bridge, Charles Square, Charles University, the Hunger Wall and the cathedral rising on the castle hill. The man was not modest about naming things.",
      cz: "Éra začíná podivným druhem vítězství. Karel byl právě zvolen římským králem, jenže polovina Německa ho odmítá uznat a on musí [[link:the-king-who-came-home-in-disguise-1347]]proklouznout domů v přestrojení za vlastního sluhu[[/link]]. Jeho slepý otec je mrtvý. Jeho soupeř pořád drží říšské klenoty. Na začátek zlatého věku to nevypadá.\n\nJevištěm je Praha a Praha se má za třicet let změnit víc než za tři předchozí staletí. Karel vyrostl na francouzském dvoře a viděl, jak vypadá skutečné hlavní město. Chce také jedno a má velmi jasnou představu, kam ho postavit.\n\n[[b]]Tohle je vzácná éra, kdy se plány jednoho muže a osud jednoho města sejdou téměř dokonale.[[/b]] Během jediného roku Karel založí Nové Město, první univerzitu ve střední Evropě a hrad Karlštejn. Později přibude kamenný most přes Vltavu, zákon o volbě císařů, který vydrží čtyři sta let, a zeď na Petříně, která dá hladovějící chudině placenou práci.\n\nObsazení je menší než v dřívějších érách, protože Karel si většinu jeviště nechává pro sebe. Kolem něj jsou čtyři manželky, papež, který byl kdysi jeho učitelem, soupeři, které buď uplatí, nebo se do jejich rodin přižení, zeť, který si padělá titul, a Petrarca, který mu pořád píše, kdy už konečně dá do pořádku Itálii. Evropou se přežene černá smrt a z důvodů, kterým nikdo úplně nerozumí, se Čechám z velké části vyhne.\n\nSledujte, jak Karel vítězí. Skoro nikdy na bojišti. Vítězí sňatky, penězi, listinami a trpělivostí a obřady připravenými tak pečlivě, že se na ně poutníci vydávají přes půl Evropy.\n\nA nechte si otevřenou jednu otázku. Karel celá desetiletí zařizuje každou korunu, kterou bude jeho rod po něm potřebovat. Co se stane s jediným problémem, na který už nebude mít čas?\n\nV Praze vás tahle éra obklopuje: Karlův most, Karlovo náměstí, Karlova univerzita, Hladová zeď i katedrála rostoucí na hradním kopci. Skromný v pojmenovávání ten muž opravdu nebyl.",
      zh: "这个时代以一场古怪的胜利开场。查理刚刚当选罗马人的国王，可半个德意志拒不承认，他只好[[link:the-king-who-came-home-in-disguise-1347]]乔装成自己的侍从溜回家[[/link]]。他那位失明的父亲已经去世，对手手里还攥着帝国的御宝。怎么看，这都不像一个黄金时代的开头。\n\n舞台是布拉格。接下来的三十年里，布拉格的变化将超过此前三个世纪的总和。查理在法国宫廷长大，见过真正的都城是什么样子。他也想要一座，而且对该建在哪儿心里非常有数。\n\n[[b]]这是一个难得的时代：一个人的蓝图与一座城市的命运，几乎严丝合缝地重叠在了一起。[[/b]]短短一年之内，查理建起了新城，创办了中欧第一所大学，又修了卡尔什泰因城堡。此后还有横跨伏尔塔瓦河的石桥，一部沿用了四百年的皇帝选举法，以及佩特任山上的一道城墙，让挨饿的穷人有了一份拿工钱的活计。\n\n这个时代的配角比以前少，因为舞台大多被查理一个人占着。他身边有四任妻子，一位曾经当过他老师的教皇，几个要么被他用钱打发、要么被他娶进门来化解的对手，一个给自己伪造头衔的女婿，还有彼特拉克，一封接一封地写信追问皇帝什么时候才肯收拾意大利。黑死病席卷欧洲，却不知为何大体绕开了波希米亚。\n\n留意查理是怎么赢的。他几乎从不在战场上赢。他靠联姻、靠金钱、靠文书、靠耐心，还靠一场场精心编排的典礼，让朝圣者不远千里赶来观看。\n\n再留一个问题在心里。查理花了几十年，把家族日后需要的每一顶王冠都安排得妥妥当当。那个他终于没来得及安排的问题，又会怎样？\n\n在布拉格，你几乎走到哪儿都身处这个时代：查理大桥、查理广场、查理大学、饥饿之墙，还有城堡山上一点点长高的大教堂。给东西起名字这件事上，这位国王确实一点也不谦虚。",
    },
    milestones: [
      { year: { en: "1346", cz: "1346", zh: "1346" }, label: { en: "An unrecognised crown", cz: "Neuznaná koruna", zh: "不被公认的王冠" }, slug: "the-crown-nobody-recognized-1346" },
      { year: { en: "1348", cz: "1348", zh: "1348" }, label: { en: "The great year", cz: "Velký rok", zh: "伟大的一年" }, slug: "the-great-year-1348" },
      { year: { en: "1355", cz: "1355", zh: "1355" }, label: { en: "Crowned in Rome", cz: "Korunovace v Římě", zh: "罗马加冕" }, slug: "crowned-in-the-eternal-city-1355" },
      { year: { en: "1356", cz: "1356", zh: "1356" }, label: { en: "The Golden Bull", cz: "Zlatá bula", zh: "金玺诏书" }, slug: "the-golden-bull-1356" },
      { year: { en: "1357", cz: "1357", zh: "1357" }, label: { en: "The bridge", cz: "Most", zh: "大桥" }, slug: "the-great-bridge-1357" },
      { year: { en: "1361", cz: "1361", zh: "1361" }, label: { en: "A son at last", cz: "Konečně syn", zh: "老来得子" }, slug: "a-son-at-last-1361" },
      { year: { en: "1378", cz: "1378", zh: "1378" }, label: { en: "Father of the Fatherland", cz: "Otec vlasti", zh: "祖国之父" }, slug: "father-of-the-fatherland-1378" },
    ],
    keyFigures: [
      { name: { en: "Charles IV", cz: "Karel IV.", zh: "查理四世" }, slug: "the-crown-nobody-recognized-1346" },
      { name: { en: "Louis IV", cz: "Ludvík IV.", zh: "路易四世" }, slug: "a-first-show-of-strength-1347" },
      { name: { en: "Petrarch", cz: "Petrarca", zh: "彼特拉克" }, slug: "italy-still-couldnt-forget-him-1350" },
      { name: { en: "Rudolf IV of Austria", cz: "Rudolf IV. Habsburský", zh: "鲁道夫四世" }, slug: "the-forged-archduke-1358" },
      { name: { en: "Wenceslas IV", cz: "Václav IV.", zh: "瓦茨拉夫四世" }, slug: "a-son-at-last-1361" },
    ],
    relatedLandmarks: [
      { slug: "charles-bridge", relation: { en: "Begun in 1357, at a minute picked by the stars", cz: "Založen roku 1357, v minutě vybrané podle hvězd", zh: "1357年动工，奠基时刻依星象而定" } },
      { slug: "karlovo-namesti", relation: { en: "The cattle market at the heart of Charles's New Town", cz: "Dobytčí trh v srdci Karlova Nového Města", zh: "查理新城中心的牲口市场" } },
      { slug: "charles-university", relation: { en: "Central Europe's first university, founded 1348", cz: "První univerzita ve střední Evropě, založená roku 1348", zh: "1348年创立的中欧第一所大学" } },
      { slug: "karlstejn-castle", relation: { en: "The castle built to guard the crown jewels and relics", cz: "Hrad postavený k ochraně korunovačních klenotů a relikvií", zh: "为守护王冠珠宝与圣物而建的城堡" } },
    ],
  },

  // ── Era 5 ────────────────────────────────────────────────────────────
  {
    slug: "era-guide-religious-turmoil",
    era: "religious-turmoil",
    cardType: "overview",
    startYear: 1378,
    tone: "humorous",
    year: { en: "1378–1526", cz: "1378–1526", zh: "1378年－1526年" },
    title: {
      en: "The Century of the Chalice",
      cz: "Století kalicha",
      zh: "圣杯的世纪",
    },
    hookLine: {
      en: "Two popes, one burned preacher, a one-eyed general and a cup of wine. For a century and a half Bohemia argues about God, and Europe sends armies to join in.",
      cz: "Dva papežové, jeden upálený kazatel, jednooký vojevůdce a kalich vína. Půldruhého století se Čechy přou o Boha a Evropa posílá vojska, aby se přidala.",
      zh: "两位教皇，一个被烧死的布道者，一位独眼将军，还有一杯葡萄酒。整整一个半世纪，波希米亚为上帝争论不休，而欧洲派来了一支又一支军队加入争论。",
    },
    summary: {
      en: "Charles IV leaves his son two crowns and one crisis. Two months before he dies, the Church elects [[link:the-papal-schism-1378]]two popes at once[[/link]], and Europe has to pick one. The golden age does not end with a bang. It ends with a seventeen-year-old trying to keep both popes happy.\n\nThat son, Wenceslas IV, is the stage's first problem. He hesitates for years, drinks, quarrels with his archbishop, has a priest [[link:the-priest-thrown-into-the-river-1393]]thrown off a bridge[[/link]], and gets locked up twice by his own nobles and his own brother. Meanwhile the Church is selling forgiveness for cash, and a preacher at Prague's Bethlehem Chapel starts saying so out loud, in Czech.\n\n[[b]]The preacher, Jan Hus, asks a simple question: who decides what is true, the Church or Scripture? Answering it will cost Bohemia two decades of war.[[/b]] Hus travels to Constance under a promise of safe conduct. He does not come back. Hundreds of Bohemian nobles put their seals on a protest. Four years later, in Prague's New Town, an angry crowd throws the town councillors out of a window.\n\nThen comes the war almost nobody expects Bohemia to win. Peasants with farm wagons and the first handguns face five crusades sent by the pope and the emperor. A one-eyed, later completely blind, minor nobleman named Jan Žižka never loses a battle. After him a priest who carries no sword leads Hussite armies on raids deep into the Empire, and one of them marches all the way to the Baltic. Prague, Tábor and the Orphans fly the same chalice on their banners and agree on almost nothing else.\n\nWatch two things. First, how a quarrel about whether ordinary people may drink the wine at communion grows into a revolution. Second, the question the crusaders never manage to answer: if no foreign army can break a Hussite wagon fort, who can?\n\nThe war is not the end. Later in the era Bohemia elects a Hussite king of its own, George of Poděbrady, and the pope calls a crusade against him too. Then come the Polish-Lithuanian Jagiellons, a king so agreeable his subjects nickname him \"King Fine\", a new royal hall at Prague Castle, a religious peace signed at Kutná Hora, and Prague throwing officials out of a window at least once more. The era ends in 1526, in a marsh in southern Hungary called Mohács. What happens there decides who rules Bohemia for the next four hundred years.\n\nIn Prague, start at Bethlehem Chapel, where Hus preached, then the New Town Hall with its famous window, and climb Vítkov Hill, where a few dozen defenders turned back an imperial army.",
      cz: "Karel IV. zanechá synovi dvě koruny a jednu krizi. Dva měsíce před jeho smrtí zvolí církev [[link:the-papal-schism-1378]]dva papeže najednou[[/link]] a Evropa si musí jednoho vybrat. Zlatý věk nekončí třeskem. Končí sedmnáctiletým mladíkem, který se snaží vyjít s oběma papeži zároveň.\n\nTen syn, Václav IV., je prvním problémem celého jeviště. Celé roky váhá, pije, hádá se se svým arcibiskupem, nechá [[link:the-priest-thrown-into-the-river-1393]]shodit kněze z mostu[[/link]] a dvakrát ho zavřou, jednou vlastní šlechta a jednou vlastní bratr. Církev mezitím prodává odpuštění za peníze a kazatel v pražské Betlémské kapli to začne nahlas říkat, a to česky.\n\n[[b]]Ten kazatel, Jan Hus, položí jednoduchou otázku: kdo rozhoduje, co je pravda, církev, nebo Písmo? Odpověď bude Čechy stát dvě desetiletí války.[[/b]] Hus odjede do Kostnice s příslibem bezpečného průvodu. Už se nevrátí. Stovky českých šlechticů připojí pečeti k protestu. O čtyři roky později vyhodí rozlícený dav na pražském Novém Městě konšely z okna.\n\nPak přijde válka, ve které skoro nikdo nečeká, že by Čechy mohly vyhrát. Sedláci s vozy z hospodářství a prvními ručnicemi stojí proti pěti křížovým výpravám, které posílá papež a císař. Jednooký, později úplně slepý drobný zeman Jan Žižka neprohraje jedinou bitvu. Po něm vede husitská vojska na výpravy hluboko do Říše kněz, který nenosí meč, a jedno z nich dojde až k Baltu. Praha, Tábor i sirotci mají na korouhvích stejný kalich a skoro v ničem jiném se neshodnou.\n\nSledujte dvě věci. Zaprvé, jak ze sporu o to, jestli smějí obyčejní lidé při přijímání pít víno, vyroste revoluce. Zadruhé otázku, na kterou křižáci nikdy nenajdou odpověď: když husitskou vozovou hradbu nedokáže prolomit žádné cizí vojsko, kdo to dokáže?\n\nVálkou to nekončí. Později si Čechy zvolí vlastního husitského krále, Jiřího z Poděbrad, a papež vyhlásí kruciátu i proti němu. Pak přijdou polsko-litevští Jagellonci, král tak povolný, že mu poddaní přezdívají „Král Dobře“, nový královský sál na Pražském hradě, náboženský mír podepsaný v Kutné Hoře a Praha, která alespoň ještě jednou vyhodí úředníky z okna. Éra končí roku 1526 v bažinách jižních Uher u Moháče. Co se tam stane, rozhodne, kdo bude Čechám vládnout dalších čtyři sta let.\n\nV Praze začněte v Betlémské kapli, kde Hus kázal, pokračujte k Novoměstské radnici s jejím slavným oknem a vystoupejte na Vítkov, kde pár desítek obránců zahnalo říšské vojsko.",
      zh: "查理四世给儿子留下了两顶王冠和一场危机。就在他去世前两个月，教会[[link:the-papal-schism-1378]]同时选出了两位教皇[[/link]]，整个欧洲都得选边站。黄金时代没有在轰然巨响中落幕，它落幕时，是一个十七岁的年轻人想方设法同时讨好两位教皇。\n\n这个儿子，瓦茨拉夫四世，就是舞台上的第一个难题。他一犹豫就是好几年，嗜酒，跟自己的大主教吵个不停，下令把一位神父[[link:the-priest-thrown-into-the-river-1393]]从桥上扔进河里[[/link]]，还两度被人关了起来，一次是自己的贵族，一次是自己的亲弟弟。与此同时，教会正在明码标价地出售赦罪，而布拉格伯利恒礼拜堂里的一位布道者，开始用捷克语把这件事大声说了出来。\n\n[[b]]这位布道者叫扬·胡斯，他问了一个简单的问题：什么是真理，由谁说了算，教会还是《圣经》？为了回答这个问题，波希米亚将付出二十年的战争。[[/b]]胡斯带着一纸安全通行的承诺前往康斯坦茨，再也没有回来。数百位波希米亚贵族在抗议书上盖了印。四年后，在布拉格新城，愤怒的人群把市议员们扔出了窗外。\n\n接下来，是一场几乎没人相信波希米亚能打赢的战争。农民赶着自家的大车，拿着最早的手铳，迎战教皇和皇帝派来的五次十字军。一位独眼、后来双目全盲的小贵族扬·杰式卡，从未输过一场仗。在他之后，一位不佩剑的神父率领胡斯派大军远征帝国腹地，其中一支甚至一路打到了波罗的海边。布拉格、塔博尔和孤儿军的旗帜上画着同一只圣杯，除此之外几乎什么都谈不拢。\n\n留意两件事。第一，一场关于普通信徒领圣餐时能不能喝那杯葡萄酒的争论，是怎样长成一场革命的。第二，十字军始终答不上来的那个问题：既然没有哪支外国军队能攻破胡斯派的车阵，那么谁能？\n\n战争并不是结局。这个时代后半段，波希米亚选出了自己的胡斯派国王，波杰布拉迪的伊日，教皇随即也对他发动了十字军。再往后，来了波兰—立陶宛的雅盖隆王朝，来了一位好说话到被臣民起外号叫“好好国王”的君主，布拉格城堡里建起了一座新的王宫大厅，库特纳霍拉签下了一份宗教和约，布拉格也至少又往窗外扔了一次官员。这个时代在1526年结束，地点是匈牙利南部一片叫作莫哈奇的沼泽。那里发生的事，将决定此后四百年由谁来统治波希米亚。\n\n在布拉格，可以从胡斯讲道的伯利恒礼拜堂出发，再去看看新城市政厅那扇著名的窗户，最后爬上维特科夫山，当年几十名守军就是在这里击退了帝国大军。",
    },
    milestones: [
      { year: { en: "1378", cz: "1378", zh: "1378" }, label: { en: "Two popes", cz: "Dva papežové", zh: "两位教皇" }, slug: "the-papal-schism-1378" },
      { year: { en: "1393", cz: "1393", zh: "1393" }, label: { en: "A priest in the river", cz: "Kněz v řece", zh: "河里的神父" }, slug: "the-priest-thrown-into-the-river-1393" },
      { year: { en: "1415", cz: "1415", zh: "1415" }, label: { en: "Constance", cz: "Kostnice", zh: "康斯坦茨" }, slug: "the-goose-and-the-swan-1415" },
      { year: { en: "1419", cz: "1419", zh: "1419" }, label: { en: "Out the window", cz: "Z okna", zh: "抛出窗外" }, slug: "the-first-defenestration-1419" },
      { year: { en: "1420", cz: "1420", zh: "1420" }, label: { en: "Vítkov Hill", cz: "Vítkov", zh: "维特科夫山" }, slug: "victory-at-vitkov-hill-1420" },
      { year: { en: "1434", cz: "1434", zh: "1434" }, label: { en: "Lipany", cz: "Lipany", zh: "利帕尼" }, slug: "lipany-1434" },
      { year: { en: "1458", cz: "1458", zh: "1458" }, label: { en: "A Hussite king", cz: "Husitský král", zh: "胡斯派国王" }, slug: "" },
      { year: { en: "1485", cz: "1485", zh: "1485" }, label: { en: "Peace at Kutná Hora", cz: "Mír v Kutné Hoře", zh: "库特纳霍拉和约" }, slug: "" },
      { year: { en: "1526", cz: "1526", zh: "1526" }, label: { en: "Mohács", cz: "Moháč", zh: "莫哈奇" }, slug: "" },
    ],
    keyFigures: [
      { name: { en: "Wenceslas IV", cz: "Václav IV.", zh: "瓦茨拉夫四世" }, slug: "the-papal-schism-1378" },
      { name: { en: "Sigismund", cz: "Zikmund", zh: "西吉斯蒙德" }, slug: "a-throne-on-shaky-ground-1386" },
      { name: { en: "Jan Hus", cz: "Jan Hus", zh: "扬·胡斯" }, slug: "who-is-jan-hus-1412" },
      { name: { en: "Jan Želivský", cz: "Jan Želivský", zh: "扬·柴利夫斯基" }, slug: "the-first-defenestration-1419" },
      { name: { en: "Jan Žižka", cz: "Jan Žižka", zh: "扬·杰式卡" }, slug: "the-first-defenestration-1419" },
      { name: { en: "Prokop the Bald", cz: "Prokop Holý", zh: "普罗科普" }, slug: "orphans-grow-up-fast-1425" },
      { name: { en: "Oldřich of Rožmberk", cz: "Oldřich z Rožmberka", zh: "罗日姆贝克的奥尔德日赫" }, slug: "who-was-oldrich-of-rozmberk-1434" },
      { name: { en: "George of Poděbrady", cz: "Jiří z Poděbrad", zh: "波杰布拉迪的伊日" }, slug: "" },
      { name: { en: "Vladislaus Jagiellon", cz: "Vladislav Jagellonský", zh: "雅盖隆的弗拉迪斯拉夫" }, slug: "" },
    ],
    relatedLandmarks: [
      { slug: "bethlehem-chapel", relation: { en: "Where Hus preached to Prague in Czech", cz: "Kde Hus kázal Praze česky", zh: "胡斯用捷克语向布拉格人讲道的地方" } },
      { slug: "novomestska-radnice", relation: { en: "The window of the First Defenestration, 1419", cz: "Okno první pražské defenestrace, 1419", zh: "1419年第一次抛窗事件的那扇窗" } },
      { slug: "vitkov-national-memorial", relation: { en: "The hill where Žižka turned back the first crusade", cz: "Vrch, kde Žižka odrazil první křížovou výpravu", zh: "杰式卡击退第一次十字军的山头" } },
      { slug: "powder-tower", relation: { en: "Begun in 1475 under the Jagiellons, and never quite finished as planned", cz: "Založena roku 1475 za Jagellonců a nikdy dostavěna podle plánu", zh: "1475年雅盖隆王朝时期动工，始终没按原计划完工" } },
    ],
  },
];
