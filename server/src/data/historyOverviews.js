// Era-overview cards ("Era Guide", cardType 'overview'): one per era,
// rendered first in its era by HistoryOverviewCard as a chapter title page,
// deliberately unlike event and background cards: no prose summary,
// images, Wikipedia link or landmarks. Fields:
//   title      the card's own name (the era divider above already shows
//              the era's name and years)
//   hookLine   the one-line logline, shown centred under the header
//   stage      2–3 sentences: where things stand as the era opens
//   cast       { name, role, slug }: one-line role; slug = the card where
//              that person first appears
//   milestones { year, label, slug }: the clickable key-moments strip
//   questions  open questions to read with; never answered here
//   teaser     a closing one-liner
// Written as trailers: set up the stage, cast and conflicts, leave each
// era's biggest outcomes open. Leave `slug` empty for anything not written
// yet (Era 5 after 1437) and fill it in once that card exists. Appended to
// `historyEvents` in seedHistoryEvents.js.

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
    stage: {
      en: "Before 870, Bohemia has no written records of its own. What it has is a story, written down mostly by one priest, Cosmas, in the 1120s, centuries after the fact, with later chroniclers adding the scenes he forgot. Read every card here as two things at once: a legend, and a clue to who wanted it told.",
      cz: "Před rokem 870 nemají Čechy žádné vlastní písemné záznamy. Mají jen příběh, který z velké části sepsal jediný kněz, Kosmas, ve 20. letech 12. století, staletí po událostech, a pozdější kronikáři k němu doplnili scény, na které zapomněl. Čtěte proto každou kartu jako dvě věci zároveň: jako pověst a jako stopu k tomu, kdo chtěl, aby se vyprávěla.",
      zh: "870年之前，波希米亚没有任何自己的文字记录。它有的只是一个故事，大部分出自神父科斯马斯之手，写于12世纪20年代，离故事发生已经隔了好几个世纪，后来的编年史家又补上了他漏掉的情节。所以这里的每张卡都要当成两样东西来读：一段传说，也是一条线索，告诉你是谁希望它被讲述。",
    },
    cast: [
      { name: { en: "The Boii", cz: "Bójové", zh: "波伊人" }, role: { en: "Celts who left the land its name", cz: "Keltové, kteří zemi zanechali jméno", zh: "给这片土地留下名字的凯尔特人" }, slug: "early-history" },
      { name: { en: "Libuše", cz: "Libuše", zh: "莉布谢" }, role: { en: "judge, seer, and the first to see Prague", cz: "soudkyně, věštkyně a první, kdo uviděl Prahu", zh: "法官兼先知，第一个预见布拉格的人" }, slug: "libuse-prophecy" },
      { name: { en: "Přemysl", cz: "Přemysl", zh: "普热米斯尔" }, role: { en: "a ploughman picked by a horse", cz: "oráč, kterého vybral kůň", zh: "被一匹马选中的农夫" }, slug: "premysl-the-ploughman" },
      { name: { en: "Vlasta", cz: "Vlasta", zh: "弗拉斯塔" }, role: { en: "leader of the women who won't go home", cz: "vůdkyně žen, které se odmítly vrátit domů", zh: "那群不肯回家的女人的首领" }, slug: "girls-war" },
      { name: { en: "Cosmas", cz: "Kosmas", zh: "科斯马斯" }, role: { en: "the chronicler who wrote it all down, centuries late", cz: "kronikář, který to všechno zapsal, o staletí později", zh: "把这一切写下来的编年史家，晚了几百年" }, slug: "seven-legendary-dukes" },
    ],
    milestones: [
      { year: { en: "To 6th c.", cz: "Do 6. stol.", zh: "至6世纪" }, label: { en: "Before the legend", cz: "Před pověstí", zh: "传说之前" }, slug: "early-history" },
      { year: { en: "8th c.", cz: "8. stol.", zh: "8世纪" }, label: { en: "Libuše's prophecy", cz: "Libušino proroctví", zh: "莉布谢的预言" }, slug: "libuse-prophecy" },
      { year: { en: "8th c.", cz: "8. stol.", zh: "8世纪" }, label: { en: "The ploughman", cz: "Oráč", zh: "犁田者" }, slug: "premysl-the-ploughman" },
      { year: { en: "8th c.", cz: "8. stol.", zh: "8世纪" }, label: { en: "Vyšehrad", cz: "Vyšehrad", zh: "维谢赫拉德" }, slug: "founding-of-vysehrad" },
      { year: { en: "8th c.", cz: "8. stol.", zh: "8世纪" }, label: { en: "The Girls' War", cz: "Dívčí válka", zh: "少女之战" }, slug: "girls-war" },
      { year: { en: "730–867", cz: "730–867", zh: "730–867" }, label: { en: "Seven dukes", cz: "Sedm knížat", zh: "七位公爵" }, slug: "seven-legendary-dukes" },
    ],
    questions: [
      { en: "Which hill did the dynasty really start on, Vyšehrad or Prague Castle?", cz: "Na kterém kopci rod doopravdy začal, na Vyšehradě, nebo na Pražském hradě?", zh: "这个王朝究竟起家于哪座山，维谢赫拉德还是布拉格城堡？" },
      { en: "What happens when Libuše's women decide to build their own castle instead of going back to the spinning wheel?", cz: "Co se stane, když se Libušiny ženy rozhodnou postavit si vlastní hrad, místo aby se vrátily ke kolovratu?", zh: "当莉布谢身边的女人们决定自己筑城，而不是回去纺线，会发生什么？" },
      { en: "Of the seven dukes who follow Přemysl, how many actually existed?", cz: "Kolik ze sedmi knížat, kteří přijdou po Přemyslovi, skutečně existovalo?", zh: "普热米斯尔之后的七位公爵，有几位真的存在过？" },
    ],
    teaser: {
      en: "Almost none of it can be proven. Prague put up the statues anyway.",
      cz: "Skoro nic z toho nejde dokázat. Praha jim sochy postavila stejně.",
      zh: "这些几乎都无从证实。布拉格还是给他们立了雕像。",
    },
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
    stage: {
      en: "Bohemia is a duchy, not a kingdom, squeezed between Great Moravia, the Magyars, Poland and an ever-present German emperor. It doesn't even have a settled capital: Prague Castle, Vyšehrad and several Moravian strongholds all compete for the title. And for the first time there are written sources, which are not kind to anyone.",
      cz: "Čechy jsou knížectví, ne království, sevřené mezi Velkou Moravou, Maďary, Polskem a věčně přítomným německým císařem. Nemají ani pevné hlavní město: o ten titul soupeří Pražský hrad, Vyšehrad a několik moravských center. A poprvé tu jsou písemné prameny, které nejsou shovívavé k nikomu.",
      zh: "波希米亚只是一个公国，算不上王国，夹在大摩拉维亚、马扎尔人、波兰和一位无处不在的德意志皇帝之间。它连首都都没定下来：布拉格城堡、维谢赫拉德和几座摩拉维亚据点都在争这个名分。这也是第一次有了文字史料，而史料对谁都不客气。",
    },
    cast: [
      { name: { en: "Bořivoj", cz: "Bořivoj", zh: "博日沃伊" }, role: { en: "the first duke who definitely existed", cz: "první kníže, který prokazatelně existoval", zh: "第一位确实存在过的公爵" }, slug: "borivoj-first-duke" },
      { name: { en: "St. Ludmila", cz: "sv. Ludmila", zh: "圣鲁德米拉" }, role: { en: "the grandmother who raised a saint", cz: "babička, která vychovala světce", zh: "一手带大圣徒的祖母" }, slug: "st-ludmila-martyrdom" },
      { name: { en: "St. Wenceslas", cz: "sv. Václav", zh: "圣瓦茨拉夫" }, role: { en: "the duke who preferred praying to fighting", cz: "kníže, který se raději modlil, než bojoval", zh: "宁愿祈祷也不愿打仗的公爵" }, slug: "wenceslas-life-and-reign" },
      { name: { en: "Boleslav I", cz: "Boleslav I.", zh: "博莱斯拉夫一世" }, role: { en: "his brother, who had other plans", cz: "jeho bratr, který měl jiné plány", zh: "他的弟弟，另有打算" }, slug: "st-wenceslas-murder" },
      { name: { en: "Břetislav I", cz: "Břetislav I.", zh: "布热季斯拉夫一世" }, role: { en: "a war hero who started out by kidnapping a bride", cz: "válečný hrdina, který začal únosem nevěsty", zh: "从抢新娘起家的战争英雄" }, slug: "kidnapped-duchess-1019" },
      { name: { en: "Vratislaus II", cz: "Vratislav II.", zh: "弗拉季斯拉夫二世" }, role: { en: "the emperor's most reliable fireman", cz: "císařův nejspolehlivější hasič", zh: "皇帝最靠得住的救火队员" }, slug: "vysehrad-revival-1070" },
      { name: { en: "Vladislaus II", cz: "Vladislav II.", zh: "弗拉迪斯拉夫二世" }, role: { en: "a duke who wanted a crown, and a bridge", cz: "kníže, který chtěl korunu, a k tomu most", zh: "既想要王冠、也想要一座桥的公爵" }, slug: "siege-of-prague-1142" },
    ],
    milestones: [
      { year: { en: "870", cz: "870", zh: "870" }, label: { en: "The first real duke", cz: "První skutečný kníže", zh: "第一位真实的公爵" }, slug: "borivoj-first-duke" },
      { year: { en: "935", cz: "935", zh: "935" }, label: { en: "Brother against brother", cz: "Bratr proti bratrovi", zh: "手足相残" }, slug: "st-wenceslas-murder" },
      { year: { en: "973", cz: "973", zh: "973" }, label: { en: "A bishop for Prague", cz: "Biskup pro Prahu", zh: "布拉格有了主教" }, slug: "prague-bishopric-973" },
      { year: { en: "1055", cz: "1055", zh: "1055" }, label: { en: "The succession rule", cz: "Nástupnický řád", zh: "继承规矩" }, slug: "bretislav-succession-law-1055" },
      { year: { en: "1085", cz: "1085", zh: "1085" }, label: { en: "The first crown", cz: "První koruna", zh: "第一顶王冠" }, slug: "vratislaus-ii-first-crown-1085" },
      { year: { en: "1158", cz: "1158", zh: "1158" }, label: { en: "The second crown", cz: "Druhá koruna", zh: "第二顶王冠" }, slug: "vladislaus-ii-second-crown-1158" },
      { year: { en: "1198", cz: "1198", zh: "1198" }, label: { en: "The third attempt", cz: "Třetí pokus", zh: "第三次尝试" }, slug: "otakar-hereditary-kingdom-1198" },
    ],
    questions: [
      { en: "Can one family learn to pass on power without killing each other?", cz: "Naučí se jedna rodina předávat moc, aniž by se navzájem povraždila?", zh: "一个家族能不能学会交接权力，而不必互相残杀？" },
      { en: "Why does every crown Bohemia wins die with the man who wore it?", cz: "Proč každá koruna, kterou Čechy získají, zemře s mužem, který ji nosil?", zh: "为什么波希米亚每赢来一顶王冠，都会跟着戴它的人一起进坟墓？" },
      { en: "Will the third try, at the very end of the era, go any differently?", cz: "Dopadne třetí pokus na samém konci éry jinak?", zh: "这个时代末尾的第三次尝试，会不会有什么不同？" },
    ],
    teaser: {
      en: "By the end, Prague will have a castle, a bishop and a stone bridge. The family will still be arguing.",
      cz: "Na konci bude mít Praha hrad, biskupa i kamenný most. Rodina se bude hádat pořád.",
      zh: "到这个时代结束，布拉格将有城堡、有主教、有石桥。这个家族，还在吵。",
    },
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
    stage: {
      en: "Bohemia finally has a hereditary crown, and the Přemyslids are kings by right. Silver is turning up in the hills, German settlers are arriving by invitation, and wooden Prague is slowly turning to stone.",
      cz: "Čechy konečně mají dědičnou korunu a Přemyslovci jsou králi z práva. V kopcích se objevuje stříbro, na pozvání přicházejí němečtí osadníci a dřevěná Praha se pomalu mění v kamennou.",
      zh: "波希米亚终于有了一顶可以世袭的王冠，普热米斯尔家族成了名正言顺的国王。山里挖出了白银，德意志移民受邀而来，木头搭的布拉格正一点点变成石头城。",
    },
    cast: [
      { name: { en: "Otakar I", cz: "Přemysl Otakar I.", zh: "奥托卡一世" }, role: { en: "won the crown that stuck", cz: "získal korunu, která vydržela", zh: "赢来了那顶戴得稳的王冠" }, slug: "otakar-i-family-purge-1199" },
      { name: { en: "St. Agnes", cz: "sv. Anežka", zh: "圣阿格尼丝" }, role: { en: "the princess who turned down an emperor", cz: "princezna, která odmítla císaře", zh: "拒绝了皇帝的公主" }, slug: "st-agnes-of-bohemia-1211" },
      { name: { en: "Otakar II", cz: "Přemysl Otakar II.", zh: "奥托卡二世" }, role: { en: "the Iron and Golden King", cz: "král železný a zlatý", zh: "铁与金之王" }, slug: "the-boy-king-1246" },
      { name: { en: "Rudolf of Habsburg", cz: "Rudolf Habsburský", zh: "哈布斯堡的鲁道夫" }, role: { en: "a count nobody took seriously", cz: "hrabě, kterého nikdo nebral vážně", zh: "一个谁都没当回事的伯爵" }, slug: "rudolf-of-habsburg-elected-1273" },
      { name: { en: "Záviš of Falkenstein", cz: "Záviš z Falkenštejna", zh: "扎维什·冯·法尔肯斯坦" }, role: { en: "rebel first, then the king's stepfather", cz: "nejdřív vzbouřenec, pak králův otčím", zh: "先是叛臣，后成了国王的继父" }, slug: "enemies-on-every-side-1276" },
      { name: { en: "Wenceslas II", cz: "Václav II.", zh: "瓦茨拉夫二世" }, role: { en: "a boy king who turns silver into power", cz: "chlapec na trůně, který promění stříbro v moc", zh: "把白银变成权力的少年国王" }, slug: "three-guardians-1279" },
      { name: { en: "Elizabeth", cz: "Eliška Přemyslovna", zh: "伊丽莎白" }, role: { en: "the princess who had to flee her own capital", cz: "princezna, která musela utéct z vlastního hlavního města", zh: "被迫逃离自己都城的公主" }, slug: "the-fleeing-princess-1310" },
      { name: { en: "John of Luxembourg", cz: "Jan Lucemburský", zh: "卢森堡的约翰" }, role: { en: "famous across Europe, almost never at home", cz: "slavný po celé Evropě, doma skoro nikdy", zh: "名扬全欧，却几乎从不在家" }, slug: "dawn-of-the-luxembourgs-1310" },
      { name: { en: "Young Charles", cz: "Mladý Karel", zh: "少年查理" }, role: { en: "sent home to a kingdom in ruins", cz: "poslaný domů do zničeného království", zh: "被派回一个满目疮痍的王国" }, slug: "the-prince-who-came-to-put-out-the-fire-1333" },
    ],
    milestones: [
      { year: { en: "1241", cz: "1241", zh: "1241" }, label: { en: "The Mongols pass by", cz: "Mongolové táhnou kolem", zh: "蒙古人过境" }, slug: "mongol-invasion-1241" },
      { year: { en: "1257", cz: "1257", zh: "1257" }, label: { en: "A new town below the castle", cz: "Nové město pod hradem", zh: "城堡下的新城" }, slug: "founding-of-mala-strana-1257" },
      { year: { en: "1278", cz: "1278", zh: "1278" }, label: { en: "Marchfeld", cz: "Moravské pole", zh: "马尔希费尔德" }, slug: "battle-of-marchfeld-1278" },
      { year: { en: "1300", cz: "1300", zh: "1300" }, label: { en: "The Prague groschen", cz: "Pražský groš", zh: "布拉格格罗申" }, slug: "from-ore-to-order-1300" },
      { year: { en: "1306", cz: "1306", zh: "1306" }, label: { en: "An afternoon in Olomouc", cz: "Odpoledne v Olomouci", zh: "奥洛穆茨的一个下午" }, slug: "four-centuries-ended-1306" },
      { year: { en: "1310", cz: "1310", zh: "1310" }, label: { en: "The Luxembourgs arrive", cz: "Přicházejí Lucemburkové", zh: "卢森堡家族到来" }, slug: "dawn-of-the-luxembourgs-1310" },
      { year: { en: "1344", cz: "1344", zh: "1344" }, label: { en: "A cathedral's first stone", cz: "Základní kámen katedrály", zh: "大教堂的第一块石头" }, slug: "dawn-over-prague-1344" },
    ],
    questions: [
      { en: "How far can this crown reach before its neighbours unite against it?", cz: "Kam až může tahle koruna dosáhnout, než se proti ní sousedé spojí?", zh: "这顶王冠的手能伸多远，邻居们才会联手对付它？" },
      { en: "How long can one family stay this high before somebody pulls it down?", cz: "Jak dlouho může jeden rod vydržet takhle vysoko, než ho někdo stáhne dolů?", zh: "一个家族能在这么高的位置待多久，才会被人拉下来？" },
      { en: "Why would a king who has gone completely blind ride into one last battle in France?", cz: "Proč by král, který úplně oslepl, vyrážel do poslední bitvy ve Francii?", zh: "一位双目完全失明的国王，为什么还要骑马冲进法国的最后一场战役？" },
    ],
    teaser: {
      en: "Some of the answers take decades. One of them takes a single afternoon.",
      cz: "Některé odpovědi zaberou desetiletí. Jedna z nich jediné odpoledne.",
      zh: "有些答案要等几十年。有一个，只用了一个下午。",
    },
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
    stage: {
      en: "Charles has just been elected King of the Romans, but half of Germany refuses to recognise him, his rival still holds the imperial regalia, and his blind father is dead. He grew up at the French court and knows what a real capital looks like. Prague, for now, doesn't.",
      cz: "Karel byl právě zvolen římským králem, jenže polovina Německa ho odmítá uznat, jeho soupeř pořád drží říšské klenoty a jeho slepý otec je mrtvý. Vyrostl na francouzském dvoře a ví, jak vypadá skutečné hlavní město. Praha tak zatím nevypadá.",
      zh: "查理刚刚当选罗马人的国王，可半个德意志拒不承认，对手手里还攥着帝国御宝，他那位失明的父亲也已经去世。他在法国宫廷长大，知道真正的都城是什么样子。眼下的布拉格，还不是。",
    },
    cast: [
      { name: { en: "Charles IV", cz: "Karel IV.", zh: "查理四世" }, role: { en: "king, emperor, builder, and fond of naming things after himself", cz: "král, císař, stavitel a milovník pojmenovávání věcí po sobě", zh: "国王、皇帝、建造者，还爱拿自己的名字给东西命名" }, slug: "the-crown-nobody-recognized-1346" },
      { name: { en: "Louis IV", cz: "Ludvík IV.", zh: "路易四世" }, role: { en: "the rival emperor who won't step aside", cz: "soupeřící císař, který odmítá ustoupit", zh: "不肯让位的对手皇帝" }, slug: "a-first-show-of-strength-1347" },
      { name: { en: "Petrarch", cz: "Petrarca", zh: "彼特拉克" }, role: { en: "the poet who keeps asking about Italy", cz: "básník, který se pořád ptá na Itálii", zh: "一直追问意大利的诗人" }, slug: "italy-still-couldnt-forget-him-1350" },
      { name: { en: "Rudolf IV of Austria", cz: "Rudolf IV. Habsburský", zh: "鲁道夫四世" }, role: { en: "a son-in-law with a talent for forgery", cz: "zeť s talentem na padělky", zh: "颇有造假天赋的女婿" }, slug: "the-forged-archduke-1358" },
      { name: { en: "Wenceslas IV", cz: "Václav IV.", zh: "瓦茨拉夫四世" }, role: { en: "the son he waited twenty years for", cz: "syn, na kterého čekal dvacet let", zh: "他等了二十年的儿子" }, slug: "a-son-at-last-1361" },
    ],
    milestones: [
      { year: { en: "1346", cz: "1346", zh: "1346" }, label: { en: "An unrecognised crown", cz: "Neuznaná koruna", zh: "不被公认的王冠" }, slug: "the-crown-nobody-recognized-1346" },
      { year: { en: "1348", cz: "1348", zh: "1348" }, label: { en: "The great year", cz: "Velký rok", zh: "伟大的一年" }, slug: "the-great-year-1348" },
      { year: { en: "1355", cz: "1355", zh: "1355" }, label: { en: "Crowned in Rome", cz: "Korunovace v Římě", zh: "罗马加冕" }, slug: "crowned-in-the-eternal-city-1355" },
      { year: { en: "1356", cz: "1356", zh: "1356" }, label: { en: "The Golden Bull", cz: "Zlatá bula", zh: "金玺诏书" }, slug: "the-golden-bull-1356" },
      { year: { en: "1357", cz: "1357", zh: "1357" }, label: { en: "The bridge", cz: "Most", zh: "大桥" }, slug: "the-great-bridge-1357" },
      { year: { en: "1361", cz: "1361", zh: "1361" }, label: { en: "A son at last", cz: "Konečně syn", zh: "老来得子" }, slug: "a-son-at-last-1361" },
      { year: { en: "1378", cz: "1378", zh: "1378" }, label: { en: "Father of the Fatherland", cz: "Otec vlasti", zh: "祖国之父" }, slug: "father-of-the-fatherland-1378" },
    ],
    questions: [
      { en: "How does a king who rarely fights end up beating every rival he has?", cz: "Jak to, že král, který skoro nebojuje, nakonec porazí všechny své soupeře?", zh: "一位很少打仗的国王，怎么就把所有对手都赢下了？" },
      { en: "Why does the Black Death empty Europe's cities and mostly leave Bohemia alone?", cz: "Proč černá smrt vylidňuje evropská města a Čechy z velké části nechá být?", zh: "黑死病掏空了欧洲的一座座城市，为什么大体放过了波希米亚？" },
      { en: "Charles arranges every crown his family will need. What about the one problem he runs out of time for?", cz: "Karel zařídí každou korunu, kterou bude jeho rod potřebovat. Co ten jediný problém, na který mu dojde čas?", zh: "查理把家族需要的每一顶王冠都安排妥当了。那个他来不及安排的问题呢？" },
    ],
    teaser: {
      en: "Look around Prague: the bridge, the square, the university. He was not modest about names.",
      cz: "Rozhlédněte se po Praze: most, náměstí, univerzita. Skromný v pojmenovávání nebyl.",
      zh: "在布拉格四下看看：大桥、广场、大学。给东西起名这件事，他一点也不谦虚。",
    },
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
    stage: {
      en: "Charles IV leaves his son two crowns and one crisis: two months before he dies, the Church elects [[link:the-papal-schism-1378]]two popes at once[[/link]]. The son, Wenceslas IV, is seventeen. Meanwhile the Church is selling forgiveness for cash, and someone in Prague is about to say so out loud, in Czech.",
      cz: "Karel IV. zanechá synovi dvě koruny a jednu krizi: dva měsíce před jeho smrtí zvolí církev [[link:the-papal-schism-1378]]dva papeže najednou[[/link]]. Synovi, Václavu IV., je sedmnáct. Církev mezitím prodává odpuštění za peníze a kdosi v Praze to brzy řekne nahlas, a to česky.",
      zh: "查理四世给儿子留下了两顶王冠和一场危机：就在他去世前两个月，教会[[link:the-papal-schism-1378]]同时选出了两位教皇[[/link]]。他的儿子瓦茨拉夫四世才十七岁。与此同时，教会正明码标价地出售赦罪，而布拉格很快就会有人用捷克语把这件事大声说出来。",
    },
    cast: [
      { name: { en: "Wenceslas IV", cz: "Václav IV.", zh: "瓦茨拉夫四世" }, role: { en: "a king who can hesitate for years", cz: "král, který umí váhat celé roky", zh: "一犹豫就是好几年的国王" }, slug: "the-papal-schism-1378" },
      { name: { en: "Sigismund", cz: "Zikmund", zh: "西吉斯蒙德" }, role: { en: "his ambitious younger brother", cz: "jeho ctižádostivý mladší bratr", zh: "他野心勃勃的弟弟" }, slug: "a-throne-on-shaky-ground-1386" },
      { name: { en: "Jan Hus", cz: "Jan Hus", zh: "扬·胡斯" }, role: { en: "the preacher who asks who decides what is true", cz: "kazatel, který se ptá, kdo rozhoduje o pravdě", zh: "追问真理由谁说了算的布道者" }, slug: "who-is-jan-hus-1412" },
      { name: { en: "Jan Želivský", cz: "Jan Želivský", zh: "扬·柴利夫斯基" }, role: { en: "a priest who leads a crowd to a window", cz: "kněz, který dovede dav k oknu", zh: "把人群领到窗前的神父" }, slug: "the-first-defenestration-1419" },
      { name: { en: "Jan Žižka", cz: "Jan Žižka", zh: "扬·杰式卡" }, role: { en: "a one-eyed minor nobleman who never loses a battle", cz: "jednooký zeman, který neprohraje jedinou bitvu", zh: "从未输过一仗的独眼小贵族" }, slug: "the-first-defenestration-1419" },
      { name: { en: "Prokop the Bald", cz: "Prokop Holý", zh: "普罗科普" }, role: { en: "a priest who leads armies but carries no sword", cz: "kněz, který vede vojska, ale nenosí meč", zh: "统率大军却从不佩剑的神父" }, slug: "orphans-grow-up-fast-1425" },
      { name: { en: "Oldřich of Rožmberk", cz: "Oldřich z Rožmberka", zh: "罗日姆贝克的奥尔德日赫" }, role: { en: "a lord whose weapon of choice is paperwork", cz: "pán, jehož oblíbenou zbraní jsou listiny", zh: "最爱拿文书当武器的领主" }, slug: "who-was-oldrich-of-rozmberk-1434" },
      { name: { en: "George of Poděbrady", cz: "Jiří z Poděbrad", zh: "波杰布拉迪的伊日" }, role: { en: "Bohemia's own Hussite king", cz: "vlastní husitský král Čech", zh: "波希米亚自己选出的胡斯派国王" }, slug: "" },
      { name: { en: "Vladislaus Jagiellon", cz: "Vladislav Jagellonský", zh: "雅盖隆的弗拉迪斯拉夫" }, role: { en: "a king so agreeable he's nicknamed \"King Fine\"", cz: "král tak povolný, že mu říkají „Král Dobře“", zh: "好说话到被叫作“好好国王”的君主" }, slug: "" },
    ],
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
    questions: [
      { en: "How does an argument over who may drink the communion wine grow into a revolution?", cz: "Jak ze sporu o to, kdo smí při přijímání pít víno, vyroste revoluce?", zh: "一场关于谁能喝圣餐葡萄酒的争论，怎么会长成一场革命？" },
      { en: "If no foreign army can break a Hussite wagon fort, who can?", cz: "Když husitskou vozovou hradbu nedokáže prolomit žádné cizí vojsko, kdo to dokáže?", zh: "既然没有哪支外国军队能攻破胡斯派的车阵，那么谁能？" },
      { en: "Can a kingdom the pope calls heretical keep a king of its own choosing?", cz: "Udrží si království, které papež prohlásí za kacířské, krále, kterého si samo zvolilo?", zh: "一个被教皇判为异端的王国，能保住自己选出来的国王吗？" },
    ],
    teaser: {
      en: "The era ends in 1526, in a Hungarian marsh called Mohács. What happens there decides who rules Bohemia for the next four hundred years.",
      cz: "Éra končí roku 1526 v uherských bažinách u Moháče. Co se tam stane, rozhodne, kdo bude Čechám vládnout dalších čtyři sta let.",
      zh: "这个时代结束于1526年，在匈牙利一片叫莫哈奇的沼泽。那里发生的事，将决定此后四百年由谁统治波希米亚。",
    },
  },
];
