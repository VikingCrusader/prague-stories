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
    year: { en: "1199–1346", cz: "1199–1346", zh: "1199年－1346年" },
    title: {
      en: "A Crown Worth Fighting For",
      cz: "Koruna, o kterou stálo za to bojovat",
      zh: "一顶值得争的王冠",
    },
    summary: {
      en: "The crown finally stays put, and the Přemyslids immediately start testing how far it can reach. Silver turns up in the hills, German settlers arrive by invitation, and wooden Prague slowly turns to stone. A princess turns down an emperor, a king nicknamed \"Iron and Golden\" collects duchies all the way to the Adriatic, and a boy king turns silver into a coin the whole region ends up copying. Then the story changes hands: a new family arrives from Luxembourg with a fourteen-year-old king who speaks no Czech, and years later his son comes home to a kingdom badly in need of repairs.",
      cz: "Koruna konečně drží a Přemyslovci okamžitě zkoušejí, kam až dosáhne. V kopcích se objeví stříbro, na pozvání přicházejí němečtí osadníci a dřevěná Praha se pomalu mění v kamennou. Princezna odmítne císaře, král přezdívaný „železný a zlatý“ sbírá vévodství až k Jadranu a chlapec na trůně promění stříbro v minci, kterou nakonec napodobí celý region. Pak příběh změní majitele: z Lucemburska přichází nový rod se čtrnáctiletým králem, který neumí česky, a o léta později se jeho syn vrací domů do království, které nutně potřebuje opravit.",
      zh: "王冠终于戴稳了，普热米斯尔家族马上开始试探它的手能伸多远。山里挖出了白银，德意志移民受邀而来，木头搭的布拉格慢慢变成了石头城。一位公主拒绝了皇帝的求婚，一位外号“铁与金”的国王把公国一路收集到了亚得里亚海边，一位少年国王把白银铸成了整个地区后来都照着铸的钱币。然后，故事换了主人：一个新家族从卢森堡来到这里，带着一位不会说捷克语的十四岁国王。许多年后，他的儿子回到故土，看到的是一个急需修缮的王国。",
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
    slug: "era-guide-religious-turmoil",
    era: "religious-turmoil",
    cardType: "overview",
    startYear: 1378,
    tone: "humorous",
    year: { en: "1378–1437", cz: "1378–1437", zh: "1378年－1437年" },
    title: {
      en: "Out of the Window, Into the Wagons",
      cz: "Z okna k vozům",
      zh: "从窗口到战车",
    },
    summary: {
      en: "Charles IV leaves his son two crowns and a Church with two popes. The son prefers hunting to deciding anything. Soon a preacher at Prague's Bethlehem Chapel is saying, in Czech, that forgiveness shouldn't be for sale, and Prague takes up his cause in its own way: town councillors go out of a window. Then peasants with farm wagons and the first handguns hold off crusade after crusade, led by a one-eyed general who never loses a battle. The war over a cup of communion wine outlasts nearly everyone who started it, and the enemy who finally beats the Hussite armies is one nobody had expected.",
      cz: "Karel IV. zanechá synovi dvě koruny a církev se dvěma papeži. Syn má raději lov než rozhodování. Brzy začne kazatel v pražské Betlémské kapli česky říkat, že odpuštění by se nemělo prodávat, a Praha se jeho věci ujme po svém: konšelé letí z okna. Pak sedláci s hospodářskými vozy a prvními ručnicemi odrážejí jednu křížovou výpravu za druhou pod vedením jednookého vojevůdce, který neprohraje jedinou bitvu. Válka o kalich vína přežije skoro všechny, kdo ji začali, a nepřítel, který husitská vojska nakonec porazí, je ten, se kterým nikdo nepočítal.",
      zh: "查理四世给儿子留下了两顶王冠，外加一个同时有两位教皇的教会。这个儿子比起拿主意，更喜欢去打猎。很快，布拉格伯利恒礼拜堂里的一位布道者开始用捷克语说：赦罪不该拿来卖钱。布拉格用自己的方式接过了他的主张：市议员们被扔出了窗外。接着，赶着自家大车、拿着最早一批手铳的农民，在一位从未输过一仗的独眼将军带领下，一次又一次挡住了十字军。这场为一杯圣餐葡萄酒打响的战争，比挑起它的几乎所有人都活得更久。而最终打垮胡斯派大军的，是一个谁也没料到的对手。",
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
];
