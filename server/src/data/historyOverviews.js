// Era-overview cards (cardType 'overview'): one per era, rendered by
// HistoryOverviewCard in place of the era banner. The card shows the era's
// title, years and tagline (from historyEras.js), then this card's `title`
// as a subtitle, then `summary`: a single humorous paragraph that sets the
// era up concretely (real people, real details) without giving away its
// biggest outcomes. Nothing else: no hookLine, sidebar entry, images or
// landmarks. Appended to `historyEvents` in seedHistoryEvents.js. The seed
// is $setOnInsert, so sync an edit by deleting and re-creating the doc.

export const historyOverviews = [
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
    summary: {
      en: "Before anyone in Bohemia could write, the land was already busy: the Celts left it a name, Germanic tribes came and went, and the Slavs moved in to stay. What happened next was written down centuries later by a priest named Cosmas, who supplied a prophetess on a cliff, a ploughman chosen by a horse, and a war started by women who were tired of taking orders. Later chroniclers added whatever he forgot. Almost none of it can be proven, which has never stopped anyone, least of all the 19th-century sculptors who carved it all in stone.",
      cz: "Dřív, než v Čechách kdokoli uměl psát, bylo v zemi rušno: Keltové jí zanechali jméno, germánské kmeny přišly a zase odešly a Slované se nastěhovali natrvalo. Co se dělo potom, sepsal o staletí později kněz Kosmas, a nešetřil: věštkyně na skále, oráč, kterého vybral kůň, a válka, kterou rozpoutaly ženy, jež už nechtěly poslouchat. Pozdější kronikáři doplnili, na co zapomněl. Skoro nic z toho nejde dokázat, což ještě nikoho nezastavilo, a už vůbec ne sochaře 19. století, kteří to všechno vytesali do kamene.",
      zh: "在波希米亚还没有人会写字的时候，这片土地已经很热闹了：凯尔特人给它留下了名字，日耳曼部落来了又走，斯拉夫人搬进来，就再也没走。接下来的故事，要等好几个世纪后才由一位叫科斯马斯的神父写下来。他笔下有悬崖上的女先知，有被一匹马选中的农夫，还有一场由受够了听命于人的女人们挑起的战争。后来的编年史家又把他漏掉的情节一一补齐。这些几乎都无从证实，可这从来没拦住过任何人，尤其是19世纪那些把它们全刻进石头里的雕塑家。",
    },
  },
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
    summary: {
      en: "Around 870 the fog lifts, and the first duke with a real date turns out to answer to a foreign boss. From there the Přemyslid family spends three centuries running Bohemia the way some families run Christmas dinner. Saints and murderers share the same table, one brother blinds another, a young nobleman solves his marriage problem by kidnapping the bride from a convent, and a carefully drafted succession law mainly gives the fighting better paperwork. Twice Bohemia wins a royal crown, and twice it goes into the grave with the man who wore it. Meanwhile Prague quietly acquires a castle, a bishop and its first stone bridge.",
      cz: "Kolem roku 870 se mlha rozplyne a první kníže se skutečným datem má, jak se ukáže, nad sebou cizího šéfa. Pak Přemyslovci tři sta let vládnou Čechám tak, jak některé rodiny slaví Vánoce. Světci a vrazi sedí u jednoho stolu, bratr oslepí bratra, mladý šlechtic vyřeší svůj sňatek únosem nevěsty z kláštera a pečlivě sepsaný nástupnický řád dodá bojům hlavně lepší papíry. Dvakrát Čechy získají královskou korunu a dvakrát skončí v hrobě s tím, kdo ji nosil. Praha mezitím potichu získá hrad, biskupa a svůj první kamenný most.",
      zh: "870年前后，迷雾散去，第一位有确切年代的公爵登场，结果发现他头上还有个外国老板。此后三百年，普热米斯尔家族治理波希米亚的方式，很像某些家庭过年吃团圆饭：圣徒和凶手坐在同一张桌上，有人亲手弄瞎了自己的哥哥，一位年轻贵族解决婚事的办法是直接从修道院里抢新娘，一部精心起草的继承法，主要作用是让争斗的手续更齐全。波希米亚两次赢来王冠，两次都跟着戴它的人进了坟墓。与此同时，布拉格悄悄有了城堡、主教，还有第一座石桥。",
    },
  },
  {
    slug: "era-guide-rise-of-a-kingdom",
    era: "rise-of-a-kingdom",
    cardType: "overview",
    startYear: 1199,
    tone: "humorous",
    year: { en: "1199–1306", cz: "1199–1306", zh: "1199年－1306年" },
    title: {
      en: "A Crown Worth Fighting For",
      cz: "Koruna, o kterou stálo za to bojovat",
      zh: "一顶值得争的王冠",
    },
    summary: {
      en: "The crown finally stays put, and the Přemyslids immediately start testing how far it can reach. Silver turns up in the hills, German settlers arrive by invitation, and wooden Prague slowly turns to stone. A princess turns down an emperor, a king nicknamed \"Iron and Golden\" collects duchies all the way to the Adriatic, and a boy king turns silver into a coin the whole region ends up copying. For a hundred years it looks as though the Přemyslids will never run out of heirs.",
      cz: "Koruna konečně drží a Přemyslovci okamžitě zkoušejí, kam až dosáhne. V kopcích se objeví stříbro, na pozvání přicházejí němečtí osadníci a dřevěná Praha se pomalu mění v kamennou. Princezna odmítne císaře, král přezdívaný „železný a zlatý“ sbírá vévodství až k Jadranu a chlapec na trůně promění stříbro v minci, kterou nakonec napodobí celý region. Celých sto let to vypadá, že Přemyslovcům dědicové nikdy nedojdou.",
      zh: "王冠终于戴稳了，普热米斯尔家族马上开始试探它的手能伸多远。山里挖出了白银，德意志移民受邀而来，木头搭的布拉格慢慢变成了石头城。一位公主拒绝了皇帝的求婚，一位外号“铁与金”的国王把公国一路收集到了亚得里亚海边，一位少年国王把白银铸成了整个地区后来都照着铸的钱币。整整一百年里，看上去普热米斯尔家族的继承人永远也用不完。",
    },
  },
  {
    slug: "era-guide-crown-changes-hands",
    era: "crown-changes-hands",
    cardType: "overview",
    startYear: 1306,
    tone: "humorous",
    year: { en: "1306–1346", cz: "1306–1346", zh: "1306年－1346年" },
    title: {
      en: "Help Wanted: King",
      cz: "Hledá se král",
      zh: "诚聘国王",
    },
    summary: {
      en: "With the old dynasty gone, the Bohemian crown goes to whoever can grab it. A Habsburg wears it for less than a year, a duke of Carinthia proves so useless that his own nobles go looking for a replacement, and a teenage princess slips out of Prague in secret to marry the replacement herself. The new family comes from Luxembourg, and its king is fourteen and speaks no Czech. He turns out to be a knight in love with tournaments, crusades and other people's wars, who comes home mostly when he needs money, while his queen, his barons and in the end his own son argue over who actually runs the kingdom.",
      cz: "Starý rod je pryč a česká koruna připadne tomu, kdo ji dokáže urvat. Habsburk ji nosí necelý rok, korutanský vévoda se ukáže tak neschopný, že mu vlastní páni začnou hledat náhradu, a dospívající princezna tajně uprchne z Prahy, aby si tu náhradu sama vzala. Nový rod přichází z Lucemburska a jeho král je čtrnáctiletý a neumí česky. Ukáže se, že je to rytíř zamilovaný do turnajů, křížových výprav a cizích válek, který se domů vrací hlavně tehdy, když potřebuje peníze, zatímco jeho královna, jeho páni a nakonec i vlastní syn se přou o to, kdo tu vlastně vládne.",
      zh: "老王朝没了，波希米亚的王冠成了谁抢到就归谁的东西。一位哈布斯堡家的人戴了不到一年，一位克恩滕公爵无能到连自己手下的贵族都开始替他物色接班人，一位十几岁的公主偷偷逃出布拉格，亲自去嫁给那个接班人。新的家族来自卢森堡，新国王十四岁，一句捷克语也不会说。后来大家发现，他是个迷恋比武、十字军和别人家战争的骑士，缺钱的时候才回家，留下王后、贵族，最后连他自己的儿子，为了到底谁说了算争个不停。",
    },
  },
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
    summary: {
      en: "Charles begins his reign sneaking home disguised as his own servant, because half of Germany won't recognise him. Thirty-two years later he dies as Holy Roman Emperor, and Prague has become the leading city of the Empire. In between he founds a New Town, a university and a castle in a single year, starts a stone bridge at a minute picked by the stars, and writes the rulebook for electing emperors. He rarely wins on a battlefield. He wins with weddings, money and paperwork. Look around Prague today and you'll notice he was not modest about naming things.",
      cz: "Karel začíná vládu tak, že se domů plíží převlečený za vlastního sluhu, protože ho polovina Německa neuznává. O dvaatřicet let později umírá jako císař Svaté říše římské a Praha je předním městem říše. Mezitím během jediného roku založí Nové Město, univerzitu i hrad, začne stavět kamenný most v minutě vybrané podle hvězd a sepíše pravidla pro volbu císařů. Na bojišti vítězí málokdy. Vítězí svatbami, penězi a listinami. Rozhlédněte se dnes po Praze a zjistíte, že v pojmenovávání skromný nebyl.",
      zh: "查理的统治，是从乔装成自己的侍从、偷偷溜回家开始的，因为半个德意志都不承认他。三十二年后，他以神圣罗马帝国皇帝的身份离世，布拉格也成了帝国的头号城市。这中间，他在一年之内建起新城、创办大学、修了一座城堡，按星象挑了一分钟给石桥奠基，还给皇帝选举写了一部规则手册。他很少在战场上赢，他靠的是婚礼、金钱和文书。今天在布拉格四下看看，你会发现，给东西起名这件事，他一点也不谦虚。",
    },
  },
  {
    slug: "era-guide-before-the-storm",
    era: "before-the-storm",
    cardType: "overview",
    startYear: 1378,
    tone: "humorous",
    year: { en: "1378–1419", cz: "1378–1419", zh: "1378年－1419年" },
    title: {
      en: "Two Popes and a Preacher",
      cz: "Dva papežové a kazatel",
      zh: "两位教皇，一位布道者",
    },
    summary: {
      en: "Charles IV leaves his son two crowns and a Church with two popes. The son prefers hunting to deciding anything, so his own lords lock him up, and later his own brother does the same. A vicar general who crosses him ends up in the Vltava and, centuries later, on the bridge as a saint. Meanwhile, in Prague's Bethlehem Chapel, a preacher starts saying in Czech that forgiveness shouldn't be for sale. The Church invites him to explain himself at a council far from home, with a safe-conduct from the king's own brother in his pocket.",
      cz: "Karel IV. zanechá synovi dvě koruny a církev se dvěma papeži. Syn má raději lov než rozhodování, a tak ho vlastní páni zavřou a později totéž udělá i jeho bratr. Generální vikář, který se mu postaví, skončí ve Vltavě a o staletí později jako světec na mostě. Mezitím v pražské Betlémské kapli začne kazatel česky říkat, že odpuštění by se nemělo prodávat. Církev ho pozve, aby se vysvětlil na koncilu daleko od domova, s ochranným listem od králova vlastního bratra v kapse.",
      zh: "查理四世给儿子留下了两顶王冠，外加一个同时有两位教皇的教会。这个儿子比起拿主意，更喜欢去打猎，于是他被自己的贵族关了起来，后来，连他的亲弟弟也这么干了一回。一位跟他作对的总代理主教被扔进了伏尔塔瓦河，几百年后，又以圣人的身份站上了查理大桥。与此同时，布拉格伯利恒礼拜堂里的一位布道者，开始用捷克语说：赦罪不该拿来卖钱。教会请他去远方的一场公会议上把话说清楚，他兜里还揣着国王亲弟弟签发的安全通行证。",
    },
  },
  {
    slug: "era-guide-religious-turmoil",
    era: "religious-turmoil",
    cardType: "overview",
    startYear: 1419,
    tone: "humorous",
    year: { en: "1419–1437", cz: "1419–1437", zh: "1419年－1437年" },
    title: {
      en: "Out of the Window, Into the Wagons",
      cz: "Z okna k vozům",
      zh: "从窗口到战车",
    },
    summary: {
      en: "In the summer of 1419 Prague takes up the cause of its burned preacher in its own way: town councillors go out of a window, and within weeks the king is dead. Then peasants with farm wagons and the first handguns hold off crusade after crusade, led by a one-eyed general who never loses a battle. The war over a cup of communion wine outlasts nearly everyone who started it, and the enemy who finally beats the Hussite armies is one nobody had expected.",
      cz: "V létě 1419 se Praha ujme věci svého upáleného kazatele po svém: konšelé letí z okna a za pár týdnů je po králi. Pak sedláci s hospodářskými vozy a prvními ručnicemi odrážejí jednu křížovou výpravu za druhou pod vedením jednookého vojevůdce, který neprohraje jedinou bitvu. Válka o kalich vína přežije skoro všechny, kdo ji začali, a nepřítel, který husitská vojska nakonec porazí, je ten, se kterým nikdo nepočítal.",
      zh: "1419年夏天，布拉格用自己的方式，接过了那位被烧死的布道者的主张：市议员们被扔出了窗外，没过几个星期，国王也死了。接着，赶着自家大车、拿着最早一批手铳的农民，在一位从未输过一仗的独眼将军带领下，一次又一次挡住了十字军。这场为一杯圣餐葡萄酒打响的战争，比挑起它的几乎所有人都活得更久。而最终打垮胡斯派大军的，是一个谁也没料到的对手。",
    },
  },
  {
    slug: "era-guide-lone-king",
    era: "lone-king",
    cardType: "overview",
    startYear: 1437,
    tone: "humorous",
    year: { en: "1437–1471", cz: "1437–1471", zh: "1437年－1471年" },
    title: {
      en: "Not Born to Be King",
      cz: "Králem se nenarodil",
      zh: "生来不是王",
    },
    summary: {
      en: "The Habsburg the Czechs elect in 1437 lasts less than two years, and dies of dysentery on campaign against the Turks before he has had time to make enemies in Prague. His son is born four months after his father's death, which gives him a claim to two kingdoms and a Habsburg guardian with no intention of handing him over. So Bohemia spends the 1440s with no king at all, run by regional leagues of lords who meet, argue and now and then besiege one another. One of them is a young lord from Poděbrady who fought at Lipany at fourteen, on the side that won. He has no royal blood, an Utraquist's faith and a knack for getting into Prague at night. The pope he will eventually have to deal with is an old acquaintance: Aeneas Silvius Piccolomini, the man who wrote Sigismund's epitaph, who has his own views about the chalice.",
      cz: "Habsburk, kterého Češi v roce 1437 zvolí, vydrží na trůnu necelé dva roky a umře na úplavici na tažení proti Turkům dřív, než si v Praze stihne udělat nepřátele. Jeho syn se narodí čtyři měsíce po otcově smrti, a tak má nárok na dvě království a habsburského poručníka, který ho nehodlá nikomu vydat. Čechy proto prožijí čtyřicátá léta úplně bez krále. Spravují je krajské landfrídy pánů, kteří se scházejí, hádají a tu a tam se navzájem obléhají. Jedním z nich je mladý pán z Poděbrad, který ve čtrnácti bojoval u Lipan, na straně, která vyhrála. Královskou krev nemá, je kališník a má talent dostat se do Prahy potmě. Papež, se kterým bude jednou muset jednat, je starý známý: Enea Silvio Piccolomini, autor Zikmundova epitafu, který má o kalichu své vlastní mínění.",
      zh: "捷克人在1437年选出的那位哈布斯堡国王，只坐了不到两年，还没来得及在布拉格结下什么仇，就在征讨土耳其人的路上死于痢疾。他的儿子在父亲死后四个月才出生，一落地就有了两个王国的继承权，外加一位哈布斯堡亲戚当监护人，而这位亲戚压根没打算把孩子交出来。于是整个15世纪40年代，波希米亚干脆没有国王，各地由贵族结成的地区同盟管着，大家开会、吵架，偶尔互相围城。其中有一位来自波杰布拉迪的年轻贵族，十四岁就上过利帕尼战场，站的是赢的那一边。他没有王室血统，信的是圣杯派，还特别擅长趁夜摸进布拉格。日后要跟他打交道的那位教皇，是我们的老熟人：埃涅阿斯·西尔维乌斯·皮科洛米尼，当年给西吉斯蒙德写盖棺之论的那位，而他对圣杯自有一番看法。",
    },
  },
  {
    slug: "era-guide-rule-of-the-lords",
    era: "rule-of-the-lords",
    cardType: "overview",
    startYear: 1471,
    tone: "humorous",
    year: { en: "1471–1526", cz: "1471–1526", zh: "1471年－1526年" },
    title: {
      en: "The King Who Said \"Fine\"",
      cz: "Král Dobře",
      zh: "国王说“好”",
    },
    summary: {
      en: "The fifteen-year-old Polish prince the Czechs crown in 1471 inherits a kingdom, a war and a rival who still calls himself King of Bohemia from Buda, and it will take years of fighting and one very creative compromise before the two of them stop. Vladislaus is gentle, pious and so reluctant to refuse anyone that he answers almost every request with a single Latin word, bene, \"fine\", which is how the Czechs come to call him King Dobře, King Fine. The lords of Bohemia find this an excellent quality in a monarch. While they divide offices, castles and crown lands among themselves and quarrel with the royal towns over who gets to brew beer, Prague shows that it has not forgotten its favourite way of settling arguments, and the king builds the largest hall in Central Europe at Prague Castle, with a staircase wide enough for knights to ride up it on horseback. The Utraquists and the Catholics, meanwhile, sign a peace at Kutná Hora and discover they can live with each other after all. Up in the Ore Mountains a silver mine starts striking a big new coin, whose name will one day cross the ocean as the dollar. And somewhere to the south-east, the Turks have not gone away.",
      cz: "Patnáctiletý polský princ, kterého Češi roku 1471 korunují, zdědí království, válku a soka, který se z Budína dál tituluje českým králem, a potrvá léta bojů a jeden velmi vynalézavý kompromis, než toho oba nechají. Vladislav je mírný, zbožný a tak nerad někoho odmítá, že skoro na každou žádost odpoví jediným latinským slovem, bene, a tak mu Češi začnou říkat Král Dobře. Čeští páni považují tuto vlastnost u panovníka za výbornou. Zatímco si mezi sebou dělí úřady, hrady a korunní statky a hádají se s královskými městy o to, kdo smí vařit pivo, Praha ukáže, že nezapomněla na svůj oblíbený způsob, jak řešit spory, a král dá na Pražském hradě postavit největší sál ve střední Evropě, se schodištěm tak širokým, že po něm rytíři mohou vyjet na koni. Kališníci a katolíci mezitím uzavřou v Kutné Hoře mír a zjistí, že spolu nakonec vyjít dokážou. Nahoře v Krušných horách začne stříbrný důl razit velkou novou minci, jejíž jméno jednou přepluje oceán jako dolar. A kdesi na jihovýchodě Turci pořád nikam neodešli.",
      zh: "1471年加冕的这位十五岁波兰王子，接手的是一个王国、一场战争，外加一个还在布达自称“波希米亚国王”的对手；两人要打上好些年，再加上一个极富创意的妥协，才算罢手。弗拉迪斯拉夫性情温和、虔诚，又特别不好意思拒绝人，几乎对什么请求都只回一个拉丁词：bene，“好”。于是捷克人管他叫“好的国王”。波希米亚的贵族们觉得，这真是一位君主最难得的美德。他们忙着瓜分官职、城堡和王室领地，还跟王室城市吵谁有权酿啤酒；布拉格则证明，它还没忘记自己最拿手的解决争端的办法；国王呢，在布拉格城堡盖起了中欧最大的大厅，楼梯宽得能让骑士直接骑着马上去。与此同时，圣杯派和天主教徒在库特纳霍拉签了和约，发现原来彼此也能过得下去。北边的克鲁什内山里，一座银矿开始铸造一种大个头的新银币，它的名字有一天会漂洋过海，变成“美元”。而在东南方的某个地方，土耳其人一直都没走。",
    },
  },
];
