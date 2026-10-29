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
  {
    slug: "era-guide-habsburgs-move-in",
    era: "habsburgs-move-in",
    cardType: "overview",
    startYear: 1526,
    tone: "humorous",
    year: { en: "1526–1583", cz: "1526–1583", zh: "1526年－1583年" },
    title: {
      en: "The Guest Who Came to Stay",
      cz: "Host, který zůstal",
      zh: "来了就不走的客人",
    },
    summary: {
      en: "In the autumn of 1526 the Bohemian estates sit down and solemnly elect a new king, Archduke Ferdinand of Austria, and make him sign a paper confirming that the crown was given by election, not inheritance. Ferdinand signs it cheerfully, then turns round and explains that the crown actually came to him as the dowry of his wife Anne, the very girl who, eleven years earlier in Vienna, had been married to his grandfather. Each side is sure it has won, and the understanding holds for quite a while. The first thing the new king does that Prague remembers is to show Jan Pašek the door of the town hall. Then he starts building his queen an Italian summer palace in the garden north of the castle; before it is finished, the castle and the Lesser Town burn down, and with them the land registry of the whole kingdom, so the lords have to re-declare their own estates from memory and whatever copies they can find. One day the estates finally work up the courage to take on the king, and the result is written on the square in front of the castle. The king's second son comes to Prague as governor, builds a hunting lodge in the shape of a six-pointed star and secretly marries a merchant's daughter from Augsburg; the Jesuits arrive too, take over a monastery in the Old Town and open a school. Utraquists, Lutherans, the Brethren and Catholics crowd into one city, each saying their own prayers, until the next king promises, out loud only, that everyone may believe as they please; why he never writes it down, he does not explain. And all of this, once again, happens under a king who does not live in Prague. The last one lived in Buda; this one lives in Vienna.",
      cz: "Na podzim 1526 zasednou čeští stavové a slavnostně zvolí nového krále, rakouského arcivévodu Ferdinanda, a nechají ho podepsat listinu, že korunu dostal volbou, ne dědictvím. Ferdinand ji ochotně podepíše, pak se otočí a vysvětlí, že koruna mu vlastně připadla jako věno jeho ženy Anny, té dívky, kterou si před jedenácti lety ve Vídni vzal jeho dědeček. Obě strany jsou si jisté, že vyhrály, a tahle shoda vydrží docela dlouho. První věc, kterou si Praha z nového krále zapamatuje, je, že Janu Paškovi ukáže dveře radnice. Pak začne své královně stavět v zahradě severně od hradu italský letohrádek; než ho dostaví, vyhoří hrad i Malá Strana a s nimi zemské desky celého království, takže páni musejí své statky přiznávat znovu, zpaměti a z opisů, které se kde najdou. Jednoho dne stavové konečně seberou odvahu a postaví se králi, a jak to dopadne, se dá přečíst na náměstí před hradem. Králův druhý syn přijde do Prahy jako místodržitel, postaví si letohrádek ve tvaru šesticípé hvězdy a tajně se ožení s dcerou augsburského kupce; přijdou i jezuité, zaberou klášter na Starém Městě a otevřou školu. Kališníci, luteráni, bratři a katolíci se tísní v jednom městě a každý se modlí po svém, dokud další král neslíbí, ovšem jen ústně, že každý smí věřit, jak chce; proč to nikdy nedá písemně, nevysvětlí. A to všechno se zase jednou děje pod vládou krále, který v Praze nebydlí. Ten minulý bydlel v Budíně, tenhle bydlí ve Vídni.",
      zh: "1526年秋天，波希米亚的等级们坐下来，郑重其事地选了一位新国王：奥地利大公斐迪南，还特意让他签字承认，这顶王冠是选出来的，不是继承来的。斐迪南痛痛快快地签了，转过身又跟大家解释，这顶王冠其实是他妻子安娜带过来的嫁妆。安娜，就是十一年前在维也纳嫁给了他爷爷的那个小新娘。两边都认定自己赢了，这份默契居然维持了好些年。新国王头一件让布拉格人记住的事，是把扬·帕谢克请出了市政厅。接着，他在城堡北边的花园里给王后盖一座意大利式的夏宫；夏宫还没盖完，城堡和小城先烧了一场大火，整个王国的地产登记簿也跟着烧没了，老爷们只好凭着记忆和东拼西凑的抄本，把自家的田产重新报一遍。后来，等级们终于鼓起勇气，跟国王较了一回劲，结果就写在城堡前面的广场上。国王的二儿子来布拉格当总督，盖了一座六角星形的猎宫，还偷偷娶了一位奥格斯堡商人的女儿；耶稣会士也来了，在老城占下一座修道院，办起了学校。圣杯派、路德派、弟兄会和天主教徒挤在同一座城里，各念各的经，直到下一任国王开口答应：大家爱信什么就信什么。只不过是口头答应，至于为什么不写下来，他没解释。而这一切，又一次发生在一个不住在布拉格的国王治下。上一位住在布达，这一位住在维也纳。",
    },
  },
  {
    slug: "era-guide-age-of-wonders",
    era: "age-of-wonders",
    cardType: "overview",
    startYear: 1583,
    tone: "humorous",
    year: { en: "1583–1618", cz: "1583–1618", zh: "1583年－1618年" },
    title: {
      en: "The Emperor Who Collected Everything",
      cz: "Císař, který sbíral všechno",
      zh: "什么都收的皇帝",
    },
    summary: {
      en: "In 1583 a young emperor who had worn the crown since his mid-twenties, but could never quite work up any enthusiasm for governing, decided that Vienna was unbearably dull and moved the entire imperial court to Prague. Overnight Prague became the capital of the Holy Roman Empire, and the castle soon filled up with the emperor's favourite kind of people: painters, clockmakers, gem cutters, astronomers, astrologers, and a whole crowd of alchemists who claimed they could turn lead into gold, one of whom had reportedly lost his ears for forgery and prospered all the same. The emperor's cabinet of curiosities held unicorn horns (narwhal tusks, in fact), bezoar stones said to cure any poison and clocks with figures that moved by themselves, and a lion lived at the castle. An Italian painter made the emperor's portrait entirely out of fruit and vegetables, and the emperor, so it is said, was delighted. A Danish astronomer with a metal nose arrived, and is said to have died because he would not leave a banquet table to relieve himself; his German assistant inherited his observations and worked out that the planets travel round the sun in ellipses. The Jewish Town had its own golden age, and the later legend of a rabbi and his man of clay is set in exactly these decades. The emperor never married, put off every decision he could, and when things upset him shut himself away and saw no one. His younger brother Matthias lost patience and began collecting the emperor's crowns, one at a time. The Bohemians seized their chance and got from him a piece of paper they had been waiting for for over thirty years. The paper was signed, but nobody slept any easier for it, and in the end a few lords at the castle began to take a keen interest in a certain window.",
      cz: "Roku 1583 se mladý císař, který nosil korunu od svých pětadvaceti let, ale vládnutí ho nikdy moc nebavilo, rozhodl, že Vídeň je k nevydržení nudná, a přestěhoval celý císařský dvůr do Prahy. Ze dne na den se Praha stala hlavním městem Svaté říše římské a hrad se brzy zaplnil lidmi, jaké měl císař nejradši: malíři, hodináři, brusiči drahokamů, astronomy, astrology a celým zástupem alchymistů, kteří tvrdili, že umějí udělat z olova zlato; jednomu z nich prý za padělání uřízli uši, a dařilo se mu i tak. V císařově kunstkomoře ležely rohy jednorožců (ve skutečnosti kly narvala), bezoárové kameny, které prý léčily jakýkoli jed, a hodiny s figurkami, které se hýbaly samy, a na hradě žil lev. Italský malíř složil císařův portrét celý z ovoce a zeleniny a císař byl prý nadšený. Přijel dánský astronom s kovovým nosem a údajně zemřel, protože nechtěl od hostiny odejít ulevit si; jeho německý pomocník zdědil jeho pozorování a přišel na to, že planety obíhají kolem Slunce po elipsách. Židovské Město zažilo svůj zlatý věk a pozdější pověst o rabínovi a jeho hliněném muži se odehrává právě v těch desetiletích. Císař se nikdy neoženil, každé rozhodnutí odkládal, jak jen to šlo, a když ho něco rozrušilo, zavřel se a nikoho k sobě nepustil. Jeho mladší bratr Matyáš ztratil trpělivost a začal mu sbírat koruny, jednu po druhé. Češi se chopili příležitosti a dostali od něj kus papíru, na který čekali přes třicet let. Papír byl podepsán, jenže klidněji kvůli tomu nikdo nespal, a nakonec se několik pánů na hradě začalo nápadně zajímat o jedno okno.",
      zh: "1583年，一位二十五岁上下就戴上皇冠、却怎么也提不起劲来治国的年轻皇帝，觉得维也纳实在无聊透顶，干脆把整个帝国宫廷搬到了布拉格。布拉格一夜之间成了神圣罗马帝国的首都，城堡里很快挤满了这位皇帝最喜欢的那种人：画家、钟表匠、宝石匠、天文学家、占星师，还有一大群自称能把铅炼成金子的炼金术士，其中一位据说因为造假被割掉了耳朵，照样混得风生水起。皇帝的珍奇屋里，摆着独角兽的角（其实是一角鲸的牙）、据说能解百毒的胃石，还有小人会自己动的机械钟；城堡里，还养着一头狮子。一位意大利画家用水果和蔬菜拼出了皇帝的肖像，据说皇帝看了还挺高兴。一位戴着金属假鼻子的丹麦天文学家来了，据说后来是在宴席上憋着不肯离席，活活憋死的；他的德意志助手接过他的观测记录，算出了行星绕着太阳走的是椭圆。犹太城迎来了自己的黄金时代，后来那个拉比捏泥人的传说，讲的正是这几十年里的事。皇帝一辈子没结婚，国事能拖就拖，遇到烦心事，就把自己关在屋里谁也不见。他的弟弟马蒂亚斯看不下去了，开始把哥哥的王冠一顶一顶地收走。波希米亚人趁机从他手里讨来了一张等了三十多年的纸。纸是签了，可谁也没因此睡得更踏实；到了最后，城堡里有几位老爷，开始格外留意起一扇窗户来。",
    },
  },
  // 2026-10-18, the user asked for a slightly more restrained voice for this
  // era. Hints rather than names (White Mountain, the 1621 executions,
  // Wallenstein); the defenestration's survivors are kept for the opening card.
  {
    slug: "era-guide-fire-and-ashes",
    era: "fire-and-ashes",
    cardType: "overview",
    startYear: 1618,
    tone: "serious",
    year: { en: "1618–1648", cz: "1618–1648", zh: "1618年－1648年" },
    title: {
      en: "It Began at a Window",
      cz: "Začalo to oknem",
      zh: "从一扇窗开始",
    },
    summary: {
      en: "One May morning in 1618, a window was thrown open in Prague Castle. The war that began at that window lasted thirty years. The Bohemian estates stopped recognising their Habsburg king and fetched a young Protestant prince from Germany to wear the crown instead; people later gave him a nickname, saying he had been king for a single winter. In the autumn of 1620, on a low hill on the western edge of Prague, a battle of about two hours decided what the kingdom would look like for centuries to come. The following summer a scaffold went up on the Old Town Square. After that Prague changed its masters and its faith: some changed their religion, some stayed and kept their mouths shut, and some packed their books and their children and left home, never to return. A general born in Bohemia rose high on the war and built himself a palace in the Lesser Town grander than the castle, though his end was anything but grand. The fire spread from Bohemia across half of Europe and, in its very last year, came back to Prague: in the summer of 1648 Swedish soldiers climbed into the Lesser Town and the castle and loaded the treasures the emperors had spent decades collecting onto their wagons, while across the river the students, townsmen and Jews of the Old Town held the stone bridge until word came that a peace had been signed far away. The war began in Prague, and it ended in Prague.",
      cz: "Jednoho květnového rána roku 1618 se na Pražském hradě otevřelo okno. Válka, která tím oknem začala, trvala třicet let. Čeští stavové přestali uznávat svého habsburského krále a z Německa si přivedli mladého protestantského knížete, aby místo něj nosil korunu; lidé mu později dali přezdívku, podle níž byl králem jedinou zimu. Na podzim 1620 rozhodla na nízkém návrší na západním okraji Prahy bitva, která trvala asi dvě hodiny, o tom, jak bude království vypadat na staletí dopředu. Příštího léta vyrostlo na Staroměstském náměstí popraviště. Od té doby Praha vyměnila pány i víru: někdo změnil vyznání, někdo zůstal a mlčel a někdo sbalil knihy a děti a odešel z domova, aby se už nikdy nevrátil. Generál, rodák z Čech, vystoupal na té válce vysoko a postavil si na Malé Straně palác okázalejší než hrad, i když jeho konec byl všechno, jen ne okázalý. Požár se z Čech rozšířil přes půl Evropy a v úplně posledním roce se vrátil do Prahy: v létě 1648 přelezli švédští vojáci na Malou Stranu a na hrad a naložili na vozy poklady, které císaři celá desetiletí shromažďovali, zatímco na druhém břehu drželi studenti, měšťané a Židé ze Starého Města kamenný most, dokud nepřišla zpráva, že kdesi daleko byl podepsán mír. Válka začala v Praze a v Praze také skončila.",
      zh: "1618年5月的一个早晨，布拉格城堡里的一扇窗户被推开了。从这扇窗开始的战争，打了整整三十年。波希米亚的等级们不再承认哈布斯堡家的国王，从德意志请来一位年轻的新教亲王，把王冠戴到了他的头上；后来人们给他起了个外号，说他只当了一个冬天的国王。1620年秋天，布拉格西郊一座不高的山岗上，一场打了两个钟头左右的仗，决定了这个王国此后几百年的样子。第二年夏天，老城广场上搭起了刑台。从那以后，布拉格换了主人，也换了信仰：有人改了宗，有人留了下来、闭上了嘴，也有人带着书和孩子离开了家乡，再也没能回来。一位出身波希米亚的将军借着这场战争飞黄腾达，在小城盖起了一座比城堡还气派的宫殿，结局却一点也不体面。战火从波希米亚一直烧到了半个欧洲，又在最后一年烧回了布拉格：1648年夏天，瑞典兵翻进了小城和城堡，把皇帝们攒了几十年的珍宝装上了马车；河对岸，老城的学生、市民和犹太人守着那座石桥，一直守到远方签订和约的消息传来。这场战争从布拉格开始，也在布拉格结束。",
    },
  },
  // 2026-10-28. Ends on the 1689 fire without naming who was blamed for it
  // (the user's call: no spoiler). Hints: the 1654 university merger, the
  // Berní rula, Balbín's unpublished defence of Czech, Marci sending the
  // Voynich manuscript to Kircher, Leopold I fleeing the Vienna plague to
  // Prague (1679-80) and the 1680 peasant revolt, the first statue on
  // Charles Bridge (St John of Nepomuk, 1683).
  {
    slug: "era-guide-voiceless-years",
    era: "voiceless-years",
    cardType: "overview",
    startYear: 1648,
    tone: "serious",
    year: { en: "1648–1689", cz: "1648–1689", zh: "1648年－1689年" },
    title: {
      en: "Keep Your Voice Down",
      cz: "Mluvte potichu",
      zh: "说话小声点",
    },
    summary: {
      en: "The Swedes went home and Prague began to clear up. The emperor put up a column on the Old Town Square to thank the Virgin, then wrapped the city in a new ring of star-shaped walls so that the next enemy would stay outside. The Jesuits merged the old university with their own college and gave it a new name: the first half for Charles IV, who founded it, the second for the reigning emperor, Ferdinand. In the countryside, tax commissioners went from village to village with their ledgers, filling page after page with deserted farms; in town, the nobles raced each other to build Baroque palaces and switched to German in their drawing rooms. One Jesuit father had fallen in love with the Czech language and wrote a whole book in its defence, then did not dare send it to the printer. A court physician posted a strange book that nobody could read to a friend in Rome, and nobody can read it to this day. An emperor fleeing the plague in Vienna came to Prague, and the plague followed him; that same year the peasants out in the country took up their sticks. In 1683 the first statue went up on Charles Bridge, and the bridge has never been empty since. So life went carefully on, and people's voices grew quieter and quieter, until one summer day in 1689 a fire of suspicious origin burned down a great part of the Old Town and the Jewish Town.",
      cz: "Švédové odtáhli domů a Praha začala uklízet. Císař postavil na Staroměstském náměstí sloup jako díky Panně Marii a pak obehnal město novým věncem hvězdicových hradeb, aby příští nepřítel zůstal venku. Jezuité spojili starou univerzitu se svou kolejí a dali jí nové jméno: první půlku po Karlu IV., který ji založil, druhou po panujícím císaři Ferdinandovi. Na venkově obcházeli berní komisaři ves za vsí s účetními knihami a plnili stránku za stránkou pustými usedlostmi; ve městě se šlechta předháněla v stavbě barokních paláců a ve svých salonech přecházela na němčinu. Jeden jezuitský páter se zamiloval do češtiny a napsal na její obranu celou knihu, a pak se ji neodvážil dát do tisku. Dvorní lékař poslal příteli do Říma podivnou knihu, kterou nikdo nedokázal přečíst, a nikdo ji nedokáže přečíst dodnes. Císař, který utíkal před vídeňským morem, přijel do Prahy a mor šel za ním; téhož roku se na venkově chopili sedláci klacků. Roku 1683 stanula na Karlově mostě první socha a od té doby už most nikdy nebyl prázdný. Tak se žilo opatrně dál a hlasy lidí byly čím dál tišší, až jednoho letního dne roku 1689 požár podezřelého původu spálil velkou část Starého Města a Židovského Města.",
      zh: "瑞典人回家了，布拉格开始收拾残局。皇帝在老城广场立起一根柱子感谢圣母，又给城市围上了一圈新的星形城墙，好让下一回的敌人进不来。耶稣会士把老大学和自己的学院并成了一所，还换了个新名字：前一半给建校的查理四世，后一半给在位的皇帝斐迪南。乡下，税务官带着账本一村一村地登记，荒掉的农庄写满了一页又一页；城里，贵族们比赛似的盖起巴洛克府邸，在自家客厅里改说了德语。一位耶稣会神父偏偏爱上了捷克语，写了一整本书替它辩护，写完了，却不敢拿去付印。一位御医把一本谁也读不懂的怪书寄给了罗马的朋友，这本书到今天也还没人读懂。一位皇帝为了躲维也纳的瘟疫跑到布拉格，瘟疫也跟着来了；就在同一年，乡下的农民抄起了棍棒。1683年，查理大桥上立起了第一尊雕像，从那以后，桥上就再也没空过。日子就这样小心翼翼地往前过，人们说话的声音越来越轻，直到1689年夏天的一天，一场来历蹊跷的大火，把老城和犹太城烧掉了一大片。",
    },
  },
  // 2026-10-29. Opens on the rebuilding after the 1689 fire (the user's plan:
  // the era's first card is the rebuilding, see CLAUDE.md). Hints without
  // spoiling: the Dientzenhofers and St Nicholas (dome finished only 1751),
  // the Charles Bridge statues (1706–1714), the 1713 plague and the Lesser
  // Town plague column, the 1719 opening of Nepomuk's grave and the
  // canonization (not named), the Pragmatic Sanction (Bohemian diet 1720) and
  // the 1723 Prague coronation with Fux's Costanza e Fortezza, Czech in the
  // villages, secret Protestants emigrating to Saxony/Prussia; ends on Charles
  // VI's death (20 Oct 1740) without saying what followed.
  {
    slug: "era-guide-baroque-and-darkness",
    era: "baroque-and-darkness",
    cardType: "overview",
    startYear: 1689,
    tone: "humorous",
    year: { en: "1689–1740", cz: "1689–1740", zh: "1689年－1740年" },
    title: {
      en: "Look Up",
      cz: "Dívejte se nahoru",
      zh: "抬头看",
    },
    summary: {
      en: "Prague came out of the fire and got down to building. Fathers and sons of the Dientzenhofer family began raising domes over the Lesser Town, sculptors filled Charles Bridge with saints until there was hardly room left on the parapets, and the nobility bought up burnt plots for palaces with terraced gardens climbing the hill below the castle. Inside the churches the ceilings opened into painted heavens, and the faithful had to tip their heads right back to see them. In 1713 the plague came back, killed thousands, and left behind a new column in the Lesser Town square. A few years later a commission opened a grave in St Vitus that was more than three hundred years old, studied what it found inside, and set about making its owner a saint. The emperor, who had no son, spent years collecting signatures from every land he ruled and every court in Europe on a document saying his daughter could inherit; the Bohemian estates signed too, and in 1723 he came to Prague to be crowned, with a grand opera at the castle to mark the day. Out in the villages, meanwhile, people still spoke Czech, prayed from books the Jesuits had approved and hid the ones they had not, and now and then a family packed up quietly in the night and left for Saxony or Prussia to keep its old faith. The light grew brighter and the shadows deeper, just as the Baroque painters liked it, until in the autumn of 1740 the emperor died and it was time to find out what all those signatures were worth.",
      cz: "Praha vyšla z požáru a pustila se do stavění. Otcové a synové z rodu Dientzenhoferů začali nad Malou Stranou zvedat kupole, sochaři zaplnili Karlův most světci, až na zábradlí skoro nezbylo místo, a šlechta skupovala vypálené parcely pro paláce s terasovitými zahradami, které šplhaly do svahu pod hradem. V kostelech se stropy otevřely do malovaných nebes a věřící museli zaklonit hlavu, aby je viděli. Roku 1713 se vrátil mor, zabil tisíce lidí a zanechal po sobě nový sloup na malostranském náměstí. O pár let později otevřela komise ve svatovítské katedrále přes tři sta let starý hrob, prozkoumala, co v něm našla, a dala se do toho, aby z jeho majitele udělala světce. Císař, který neměl syna, sbíral celá léta podpisy všech svých zemí i všech evropských dvorů pod listinu, podle níž po něm smí dědit dcera; podepsali i čeští stavové a roku 1723 přijel do Prahy ke korunovaci, kterou na hradě oslavila velkolepá opera. Na venkově zatím lidé dál mluvili česky, modlili se z knížek, které schválili jezuité, a schovávali ty, které neschválili, a tu a tam se nějaká rodina potichu v noci sbalila a odešla do Saska nebo do Pruska, aby si uchovala starou víru. Světla přibývalo a stíny houstly, přesně jak to měli rádi barokní malíři, až na podzim roku 1740 císař zemřel a nastal čas zjistit, kolik všechny ty podpisy doopravdy stojí.",
      zh: "布拉格从大火里走出来，动手盖房子。丁岑霍费尔家的父子开始在小城上空架起穹顶，雕塑家们往查理大桥上一尊接一尊地摆圣人，摆到桥栏上快没地方了，贵族们买下烧光的地皮，盖起府邸，后花园一层一层爬上城堡下的山坡。教堂里，天花板化成了画出来的天堂，信徒们得把头仰到最后面才看得见。1713年，瘟疫又来了，死了几千人，在小城广场上留下了一根新的柱子。又过了几年，一个委员会在圣维特大教堂里打开了一座三百多年的老坟，仔细研究了里面的东西，然后着手把坟的主人封成圣人。没有儿子的皇帝，花了好些年，让他统治的每一块领地、欧洲的每一个宫廷都在一份文件上签字，承认他的女儿可以继承一切；波希米亚的等级们也签了，1723年他来布拉格加冕，城堡里还上演了一出盛大的歌剧来庆贺。与此同时，乡下的人还说着捷克语，念着耶稣会士批准的祈祷书，把没批准的藏起来；时不时有一家人趁着夜色悄悄收拾好行李，去了萨克森或普鲁士，好守住祖上的信仰。光越来越亮，影子也越来越深，正合巴洛克画家的口味。直到1740年秋天，皇帝去世了，那些签名到底值多少，就要见分晓了。",
    },
  },
];
