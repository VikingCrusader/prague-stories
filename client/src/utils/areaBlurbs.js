// Short, wry intros shown under the Explore title when the area filter is set
// (AreaFilter.jsx). Keyed like Location.district / Location.quarter. German
// falls back to English.
export const AREA_BLURBS = {
  district: {
    'Praha 1': {
      en: 'The castle, the bridge, the astronomical clock and roughly every tourist in Central Europe, packed into one district. Locals mostly come here on their way to somewhere else.',
      cz: 'Hrad, most, orloj a zhruba všichni turisté střední Evropy v jedné městské části. Místní sem chodí hlavně cestou někam jinam.',
      zh: '城堡、查理大桥、天文钟，外加差不多整个中欧的游客，全挤在这一个区里。本地人来这儿，通常只是路过。',
    },
    'Praha 2': {
      en: "Charles IV's New Town, the legends of Vyšehrad and the most elegant streets of Vinohrady. Small on the map, generous with Art Nouveau facades.",
      cz: 'Nové Město Karla IV., vyšehradské pověsti a nejelegantnější ulice Vinohrad. Na mapě malá, na secesní fasády štědrá.',
      zh: '查理四世的新城、维谢赫拉德的传说、维诺赫拉迪最优雅的几条街。地图上不大，新艺术风格的立面倒是给得很大方。',
    },
    'Praha 3': {
      en: 'Žižkov territory: a TV tower with giant babies crawling up it, a one-eyed general on a horse on Vítkov hill, and a pub on what feels like every corner. A traditionally working-class district, full of Hussite sites, with streets named after Hussite figures.',
      cz: 'Žižkovské území: televizní věž, po které lezou obří miminka, jednooký vojevůdce na koni na Vítkově a hospoda na každém druhém rohu. Tradiční dělnická čtvrť plná husitských míst, s ulicemi pojmenovanými po husitských osobnostech.',
      zh: '日什科夫的地盘：一座爬满巨型婴儿的电视塔，维特科夫山上骑着马的独眼将军，还有差不多每个街角都有的一家小酒馆。这里是传统的工人街区，胡斯派相关的地点很多，街道也多以胡斯运动人物命名。',
    },
    'Praha 4': {
      en: "Prague's most populous district: a bridge with a metro line inside it, a swimming stadium, a brewery town that stopped brewing, and a great many housing blocks.",
      cz: 'Nejlidnatější městská část Prahy: most, kterým uvnitř jezdí metro, plavecký stadion, pivovarská čtvrť, která přestala vařit, a spousta paneláků.',
      zh: '布拉格人口最多的区：一座肚子里跑地铁的大桥，一座游泳馆，一个不再酿酒的啤酒街区，以及非常多的住宅楼。',
    },
    'Praha 5': {
      en: 'Smíchov beer, Barrandov film studios and the hills of Košíře. Industrial on the riverbank, leafy and villa-lined further up.',
      cz: 'Smíchovské pivo, barrandovské ateliéry a košířské kopce. U řeky průmyslová, o kus výš zelená a vilová.',
      zh: '斯米霍夫的啤酒、巴兰多夫电影制片厂、科希热的山坡。河边一带是工业风，往上走就是绿树和别墅。',
    },
    'Praha 6': {
      en: "Embassies, villas, the oldest monastery in Bohemia and the airport. Prague's most respectable district, and it knows it.",
      cz: 'Velvyslanectví, vily, nejstarší klášter v Čechách a letiště. Nejsolidnější čtvrť Prahy, a moc dobře to ví.',
      zh: '大使馆、别墅、波希米亚最古老的修道院，还有机场。布拉格最体面的一个区，它自己也心知肚明。',
    },
    'Praha 7': {
      en: 'Letná plain, Stromovka park, the zoo and Troja chateau, all inside a river bend. Its former factories now mostly host art.',
      cz: 'Letenská pláň, Stromovka, zoo a Trojský zámek, to vše v jednom říčním meandru. Bývalé továrny dnes většinou hostí umění.',
      zh: '莱特纳高地、斯特罗莫夫卡公园、动物园和特洛亚宫，全都装在伏尔塔瓦河的一个大河湾里。旧工厂如今大多用来放艺术品。',
    },
    'Praha 8': {
      en: "Karlín's post-flood glow-up, Libeň's history-heavy streets, and Bohnice, whose name every Czech knows thanks to its large psychiatric hospital.",
      cz: 'Karlín, který se po povodni vyfintil, Libeň plná dějin a Bohnice, jejichž jméno každý Čech zná díky velké psychiatrické léčebně.',
      zh: '洪水后焕然一新的卡林，满街都是历史的利本，还有博赫尼采：因为那里有一座大型精神病院，这个地名全捷克都知道。',
    },
    'Praha 9': {
      en: "Vysočany, once the engine room of Prague's heavy industry. The factories have mostly made way for offices, flats and the city's biggest arena.",
      cz: 'Vysočany, kdysi strojovna pražského těžkého průmyslu. Továrny většinou uvolnily místo kancelářím, bytům a největší hale ve městě.',
      zh: '维索恰尼，过去是布拉格重工业的发动机舱。工厂大多已经让位给写字楼、住宅，还有全城最大的体育馆。',
    },
    'Praha 10': {
      en: "Vršovice, Strašnice and Malešice: tidy residential streets, a football club with a kangaroo for a mascot, and Prague's largest crematorium.",
      cz: 'Vršovice, Strašnice a Malešice: spořádané obytné ulice, fotbalový klub s klokanem ve znaku a největší pražské krematorium.',
      zh: '弗尔绍维采、斯特拉什尼采、马莱谢采：整齐的住宅街，一支以袋鼠为吉祥物的足球俱乐部，还有布拉格最大的火葬场。',
    },
    'Praha 11': {
      en: "Jižní Město, the largest panelák housing estate in the country. Tens of thousands of people live here; tourists, so far, do not.",
      cz: 'Jižní Město, největší panelové sídliště v republice. Bydlí tu desítky tisíc lidí, turisté zatím ne.',
      zh: '南城，全捷克最大的预制板住宅区。这里住着好几万人，游客嘛，暂时还没有。',
    },
    'Praha 12': {
      en: 'Modřany and the Vltava valley south of the city, up to the village of Točná on its windy plateau. Prague, but with a lot of sky.',
      cz: 'Modřany a údolí Vltavy na jih od města, až po Točnou na větrné planině. Pořád Praha, jen s větším kusem nebe.',
      zh: '莫德扎尼和城南的伏尔塔瓦河谷，一路延伸到风很大的高地上的托奇纳村。还是布拉格，只是头顶的天空大了不少。',
    },
    'Praha 13': {
      en: 'Jihozápadní Město and its housing blocks, plus Řeporyje, a village that still remembers it was a village.',
      cz: 'Jihozápadní Město se sídlišti a k tomu Řeporyje, vesnice, která si pořád pamatuje, že je vesnice.',
      zh: '西南城和它的住宅楼群，外加热波里耶：一个至今还记得自己是村子的村子。',
    },
    'Praha 14': {
      en: "Černý Most, Kyje and Hloubětín on the city's eastern edge: a housing estate, a shopping centre, and medieval churches older than both put together.",
      cz: 'Černý Most, Kyje a Hloubětín na východním okraji města: sídliště, nákupní centrum a středověké kostely starší než obojí dohromady.',
      zh: '城东边缘的黑桥、基耶、赫罗贝京：一片住宅区，一座购物中心，还有比两者加起来都老的中世纪教堂。',
    },
    'Praha 15': {
      en: 'Hostivař and its neighbours, built around a reservoir that Prague treats as its local seaside.',
      cz: 'Hostivař a okolí, rozložené kolem přehrady, kterou Pražané berou jako své domácí moře.',
      zh: '霍斯蒂瓦日和它的邻居们，围着一座水库展开，布拉格人把这水库当成自家门口的海边。',
    },
    'Praha 16': {
      en: "Radotín, Zbraslav and Velká Chuchle in the city's far south-west: a horse racecourse, a royal monastery, and the Berounka meeting the Vltava.",
      cz: 'Radotín, Zbraslav a Velká Chuchle na dalekém jihozápadě: dostihové závodiště, královský klášter a soutok Berounky s Vltavou.',
      zh: '城市西南尽头的拉多丁、兹布拉斯拉夫、大胡赫莱：一座赛马场，一座王家修道院，还有贝龙卡河汇入伏尔塔瓦河的地方。',
    },
    'Praha 17': {
      en: "Řepy and Zličín on the western edge, where the metro gives up and the IKEA begins.",
      cz: 'Řepy a Zličín na západním okraji, tam kde končí metro a začíná IKEA.',
      zh: '西边缘的热皮和兹利钦：地铁到这里就放弃了，宜家从这里开始。',
    },
    'Praha 18': {
      en: "Letňany and Čakovice up north: an airfield, a trade-fair ground and, near Třeboradice, the marker for Prague's North Pole.",
      cz: 'Letňany a Čakovice na severu: letiště, výstaviště a u Třeboradic sloupek pražského severního pólu.',
      zh: '北边的莱特尼和查科维采：一座机场，一片展览场地，还有特热博拉迪采附近那根标着"布拉格北极"的石桩。',
    },
    'Praha 19': {
      en: 'Kbely, Vinoř and Satalice, where Prague keeps its aviation museum and still lets a few villages look like villages.',
      cz: 'Kbely, Vinoř a Satalice, kde má Praha své letecké muzeum a kde ještě nechává pár vesnic vypadat jako vesnice.',
      zh: '克贝利、维诺日和萨塔利采：布拉格把航空博物馆放在这里，也还留着几个看起来像村子的村子。',
    },
    'Praha 20': {
      en: 'Horní Počernice, which joined Prague in 1974 and has kept behaving like a small town of its own ever since.',
      cz: 'Horní Počernice, které se k Praze připojily v roce 1974 a od té doby se dál chovají jako samostatné městečko.',
      zh: '上波切尔尼采，1974年并入布拉格，此后一直过得像个独立的小镇。',
    },
    'Praha 21': {
      en: "Újezd nad Lesy, Klánovice and Běchovice: pine forests, first-republic villas and the starting line of Europe's oldest road race.",
      cz: 'Újezd nad Lesy, Klánovice a Běchovice: borové lesy, prvorepublikové vily a start nejstaršího silničního běhu v Evropě.',
      zh: '乌耶兹德、克拉诺维采、贝霍维采：松林、第一共和国时期的别墅，还有欧洲最古老公路赛跑的起点。',
    },
    'Praha 22': {
      en: 'Uhříněves and the rural south-east: fields, ponds, village greens and a medieval fortress. Officially Prague, spiritually the countryside.',
      cz: 'Uhříněves a venkovský jihovýchod: pole, rybníky, návsi a středověká tvrz. Úředně Praha, duší venkov.',
      zh: '乌赫日涅维斯和乡野味十足的东南角：田地、池塘、村中心的草坪，还有一座中世纪要塞。户口上是布拉格，灵魂上是乡下。',
    },
  },
  quarter: {
    'Hradčany': {
      en: 'The castle town: Prague Castle, the archbishop, several ministries and a queue for the changing of the guard. Very few people actually live here.',
      cz: 'Hradní město: Pražský hrad, arcibiskup, několik ministerstev a fronta na střídání stráží. Skutečně tu bydlí jen málokdo.',
      zh: '城堡下的小城：布拉格城堡、大主教、好几个政府部门，还有排队看换岗的人群。真正住在这里的人倒没几个。',
    },
    'Malá Strana': {
      en: 'Founded by Otakar II in 1257 for German settlers, and German-speaking for centuries. Today: both houses of parliament, a dozen embassies and a great many cobblestones.',
      cz: 'Založena Otakarem II. roku 1257 pro německé osadníky a po staletí převážně německá. Dnes sídlo obou komor parlamentu, tuctu velvyslanectví a nespočtu dlažebních kostek.',
      zh: '1257年由奥托卡二世为德意志移民所建，此后几百年都以德意志人为主。如今住着议会两院、十几个大使馆，以及数不清的鹅卵石。',
    },
    'Staré Město': {
      en: "Prague's historic heart: the Old Town Square, the astronomical clock and a maze of medieval lanes. The clock has been ticking since 1410; the crowd under it seems about as permanent.",
      cz: 'Historické srdce Prahy: Staroměstské náměstí, orloj a bludiště středověkých uliček. Orloj tiká od roku 1410 a dav pod ním působí podobně trvale.',
      zh: '布拉格的历史中心：老城广场、天文钟和一座中世纪小巷迷宫。天文钟从1410年走到今天，钟下的人群看起来也差不多一样永恒。',
    },
    'Josefov': {
      en: 'The old Jewish Town, named after Joseph II and mostly demolished around 1900. The synagogues and the old cemetery survived, and so did the legend of the Golem.',
      cz: 'Bývalé židovské město, pojmenované po Josefu II. a kolem roku 1900 z velké části zbourané. Synagogy a starý hřbitov přežily, legenda o Golemovi taky.',
      zh: '昔日的犹太城，以约瑟夫二世命名，1900年前后大半被拆。犹太会堂和老墓地留了下来，魔像的传说也是。',
    },
    'Nové Město': {
      en: "Founded by Charles IV in 1348, and 'new' ever since. In the Hussite years it was Prague's most radical quarter, and in 1419 and 1483 its town hall windows were unusually busy.",
      cz: 'Založeno Karlem IV. roku 1348 a od té doby pořád „nové“. V husitských dobách nejradikálnější čtvrť Prahy; v letech 1419 a 1483 měla okna zdejší radnice nezvykle napilno.',
      zh: '查理四世1348年建的城，从那以后就一直叫"新城"。胡斯运动时这里是布拉格最激进的地方，1419年和1483年，市政厅的窗户都格外忙碌。',
    },
    'Vyšehrad': {
      en: "Prague's legendary seat of Princess Libuše, though the archaeologists keep quiet on that point. Dvořák and Smetana rest in its cemetery.",
      cz: 'Legendární sídlo kněžny Libuše, i když archeologové k tomu raději mlčí. Na hřbitově tu odpočívají Dvořák a Smetana.',
      zh: '传说中莉布谢公主的居所，虽然考古学家对此一直保持沉默。德沃夏克和斯美塔那都安葬在这里的墓地。',
    },
    'Smíchov': {
      en: 'Factories, a brewery and the Anděl crossroads. Folk etymology says the name comes from laughter (smích); the Staropramen brewery may help explain why.',
      cz: 'Továrny, pivovar a křižovatka na Andělu. Lidová etymologie odvozuje jméno od smíchu; pivovar Staropramen to možná trochu vysvětluje.',
      zh: '工厂、啤酒厂和安德尔路口。民间说法认为地名来自"笑"（smích）；老泉啤酒厂大概能解释一部分原因。',
    },
    'Vinohrady': {
      en: "Named after the royal vineyards Charles IV planted on the hillside. The vines are mostly gone, replaced by Art Nouveau apartment blocks and a great many cafés.",
      cz: 'Jméno má po královských vinicích, které tu založil Karel IV. Révu většinou vystřídaly secesní činžáky a spousta kaváren.',
      zh: '得名于查理四世在山坡上种下的王家葡萄园。如今葡萄藤大多换成了新艺术风格的公寓楼，还有非常多的咖啡馆。',
    },
    'Žižkov': {
      en: "An independent town until 1922, named after the one-eyed Hussite general. Full of Hussite sites, with streets named after other Hussite figures. A traditionally working-class quarter, famous for its pubs, its rebellious streak and its TV tower.",
      cz: 'Až do roku 1922 samostatné město, pojmenované po jednookém husitském vojevůdci. Plné husitských míst, ulice nesou jména dalších husitských osobností. Tradiční dělnická čtvrť, proslulá hospodami, rebelstvím a televizní věží.',
      zh: '1922年以前还是个独立城镇，名字来自那位独眼的胡斯派将军。胡斯派相关的地点很多，街道也多以其他胡斯运动人物命名。传统的工人街区，以小酒馆、叛逆脾气和电视塔闻名。',
    },
    'Karlín': {
      en: 'Named after Empress Caroline Augusta in 1817. The 2002 flood went through it badly; it came back as one of the trendiest quarters in Prague.',
      cz: 'Pojmenován roku 1817 po císařovně Karolíně Augustě. Povodeň v roce 2002 ho těžce zasáhla, vrátil se jako jedna z nejvyhledávanějších čtvrtí Prahy.',
      zh: '1817年以卡罗利娜·奥古斯塔皇后命名。2002年的洪水让它元气大伤，回来时却成了布拉格最时髦的街区之一。',
    },
    'Libeň': {
      en: 'Where two Habsburg brothers signed a peace in 1608 and where Heydrich was ambushed in 1942. Bohumil Hrabal also lived and wrote here.',
      cz: 'Tady roku 1608 dva habsburští bratři uzavřeli mír a roku 1942 tu byl spáchán atentát na Heydricha. Žil a psal tu i Bohumil Hrabal.',
      zh: '1608年，两位哈布斯堡兄弟在这里签了和约；1942年，海德里希在这里遇袭。赫拉巴尔也曾在这里生活和写作。',
    },
    'Holešovice': {
      en: 'A former river port and slaughterhouse district that turned into galleries, clubs and a market hall. The cattle have been replaced by curators.',
      cz: 'Bývalý přístav a jatka, z nichž se staly galerie, kluby a tržnice. Dobytek vystřídali kurátoři.',
      zh: '昔日的河港和屠宰场区，摇身一变成了画廊、俱乐部和市场。牛群被策展人取代了。',
    },
    'Bubeneč': {
      en: "Stromovka, once the royal game park, plus a lot of embassies and villas. The kings' deer have been replaced by joggers.",
      cz: 'Stromovka, kdysi královská obora, a k tomu spousta velvyslanectví a vil. Královskou zvěř vystřídali běžci.',
      zh: '斯特罗莫夫卡，从前是王家猎苑，外加许多大使馆和别墅。国王的鹿群如今换成了晨跑的人。',
    },
    'Dejvice': {
      en: 'Victory Square, the Technical University and a Stalinist hotel with a star on top. Very orderly, very student-heavy.',
      cz: 'Vítězné náměstí, technika a stalinistický hotel s hvězdou na špici. Velmi spořádané, velmi studentské.',
      zh: '胜利广场、捷克理工大学，还有一座顶着红星的斯大林式酒店。非常整齐，学生非常多。',
    },
    'Břevnov': {
      en: "Home to Bohemia's oldest monastery, founded in 993. The monks had a brewery going early, and so, naturally, does the monastery today.",
      cz: 'Domov nejstaršího kláštera v Čechách, založeného roku 993. Mniši tu brzy vařili pivo, a klášter ho samozřejmě vaří dodnes.',
      zh: '波希米亚最古老的修道院就在这里，建于993年。修士们很早就开始酿啤酒，修道院当然到今天还在酿。',
    },
    'Střešovice': {
      en: "Quiet villa streets with Adolf Loos's Müller Villa and a depot full of retired trams.",
      cz: 'Tiché vilové ulice s Loosovou Müllerovou vilou a vozovnou plnou vysloužilých tramvají.',
      zh: '安静的别墅街区，有阿道夫·路斯设计的穆勒别墅，还有一座停满退役电车的车库。',
    },
    'Vršovice': {
      en: "Residential streets, lively cafés and Bohemians football club, whose mascot is a kangaroo. Yes, really, and it dates back to a 1927 tour of Australia.",
      cz: 'Obytné ulice, živé kavárny a Bohemians, jejichž maskotem je klokan. Opravdu, a pochází z turné po Austrálii v roce 1927.',
      zh: '住宅街、热闹的咖啡馆，还有波西米亚人足球俱乐部，吉祥物是一只袋鼠。真的，这要追溯到1927年的澳大利亚巡回赛。',
    },
    'Nusle': {
      en: 'A deep valley with a giant bridge over it, and a metro line running inside the bridge. Down below, ordinary life carries on with a permanent view of concrete.',
      cz: 'Hluboké údolí, přes ně obří most a uvnitř mostu metro. Dole se dál žije obyčejný život s trvalým výhledem na beton.',
      zh: '一道深谷，上面架着一座巨大的桥，桥肚子里还跑着地铁。谷底的日子照常过，只是永远望得见头顶的混凝土。',
    },
    'Košíře': {
      en: "Hills, gardens and the romantic Klamovka and Cibulka parks. One of Prague's former villages that never quite stopped being green.",
      cz: 'Kopce, zahrady a romantické parky Klamovka a Cibulka. Jedna z bývalých vesnic, která nikdy tak úplně nepřestala být zelená.',
      zh: '山坡、花园，还有浪漫的克拉莫夫卡和齐布尔卡公园。它曾是布拉格周边的一个村子，至今都没完全褪去那份绿意。',
    },
    'Podolí': {
      en: "A swimming stadium, a functionalist waterworks that looks like a palace, and the Vltava riverbank. Prague's place for getting wet on purpose.",
      cz: 'Plavecký stadion, funkcionalistická vodárna, která vypadá jako palác, a vltavské nábřeží. Místo, kde se v Praze moká schválně.',
      zh: '一座游泳馆，一座长得像宫殿的功能主义水厂，还有伏尔塔瓦河岸。布拉格人专门来这里把自己弄湿。',
    },
    'Braník': {
      en: "Known for its limestone cliffs and its beer, though the Braník brewery closed in 2007. The cliffs, at least, are still here.",
      cz: 'Proslulý vápencovými skalami a pivem, i když branický pivovar zavřel roku 2007. Skály tu aspoň zůstaly.',
      zh: '以石灰岩峭壁和啤酒出名，不过布拉尼克啤酒厂2007年就关了。好在峭壁还在。',
    },
    'Troja': {
      en: 'A Baroque chateau, the zoo and a botanical garden with its own vineyard. Possibly the only place in Prague where giraffes and grapes share a hillside.',
      cz: 'Barokní zámek, zoo a botanická zahrada s vlastní vinicí. Možná jediné místo v Praze, kde žirafy a réva sdílejí jeden svah.',
      zh: '一座巴洛克宫殿、动物园，还有一座自带葡萄园的植物园。长颈鹿和葡萄藤共享一面山坡，在布拉格大概只此一家。',
    },
    'Vysočany': {
      en: "Once all factory chimneys. In August 1968, with Soviet tanks in the streets, the Communist Party held a secret emergency congress in one of those factories.",
      cz: 'Kdysi samé tovární komíny. V srpnu 1968, se sovětskými tanky v ulicích, se v jedné z těch továren tajně sešel mimořádný sjezd KSČ.',
      zh: '从前满眼都是工厂烟囱。1968年8月，苏军坦克还在街上，捷共就在其中一座工厂里秘密召开了特别代表大会。',
    },
    'Strašnice': {
      en: "The name sounds like the Czech word for scaring someone, and the district does hold Prague's largest crematorium. Otherwise it is a calm, green place to live.",
      cz: 'Jméno zní jako strašení a čtvrť opravdu hostí největší pražské krematorium. Jinak je to klidné a zelené místo k životu.',
      zh: '地名听起来像捷克语的"吓人"，这里也确实有布拉格最大的火葬场。除此之外，倒是个安静又绿意盎然的住处。',
    },
    'Zbraslav': {
      en: "A town of its own until 1974, with a monastery founded by Wenceslas II in 1292 as the Přemyslid burial church. The last kings of the dynasty lie here.",
      cz: 'Až do roku 1974 samostatné město s klášterem, který roku 1292 založil Václav II. jako pohřebiště Přemyslovců. Leží tu poslední králové rodu.',
      zh: '1974年以前还是独立的小镇，镇上的修道院由瓦茨拉夫二世于1292年创建，作为普舍米斯尔家族的墓葬教堂。这个王朝的最后几位国王就长眠于此。',
    },
    'Krč': {
      en: 'Hospitals, research institutes and a neo-Gothic castle on the edge of a big forest, with the tallest residential tower in Prague to the north.',
      cz: 'Nemocnice, výzkumné ústavy a novogotický zámek na kraji velkého lesa, na severu nejvyšší obytná věž Prahy.',
      zh: '医院、研究所和一座新哥特式小城堡，都挨着一大片森林；北边立着布拉格最高的住宅楼。',
    },
    'Michle': {
      en: "An old hill village that became the city's gasworks and then one of its biggest office districts. Not pretty, but very honest about how Prague grew.",
      cz: 'Stará vesnice na kopci, ze které se stala městská plynárna a pak jedno z největších kancelářských center. Není krásná, ale poctivě ukazuje, jak Praha rostla.',
      zh: '山坡上的老村子，先变成了全城的煤气厂，后来又成了最大的写字楼区之一。不漂亮，却很诚实地展示了布拉格是怎么长大的。',
    },
    'Kunratice': {
      en: 'A small town in all but name, where a king died at his forest castle in 1419 and the ruins still hide among the trees.',
      cz: 'Městečko ve všem kromě jména, kde v roce 1419 zemřel král na svém lesním hradě, jehož zřícenina se dodnes skrývá mezi stromy.',
      zh: '除了名字，样样都像一座小镇：1419年一位国王死在这里的森林城堡里，城堡的废墟至今藏在林子里。',
    },
    'Záběhlice': {
      en: 'A village on the Botič with a Baroque chateau and a big pond, plus Spořilov, the 1920s garden suburb of identical little houses.',
      cz: 'Vesnice na Botiči s barokním zámkem a velkým rybníkem a k tomu Spořilov, zahradní město z dvacátých let se stejnými domky.',
      zh: '博季奇河边的村子，有一座巴洛克小城堡和一个大池塘，还有1920年代那片一模一样小房子组成的花园城斯波日洛夫。',
    },
    'Hlubočepy': {
      en: 'A village in a valley, cliffs of ancient sea floor, the Barrandov film studios and a housing estate on top. All within one tram ride.',
      cz: 'Vesnice v údolí, skály z prastarého mořského dna, barrandovské ateliéry a nahoře sídliště. Všechno v dosahu jedné tramvaje.',
      zh: '山谷里的老村子，远古海底变成的峭壁，巴兰多夫电影制片厂，还有崖顶的住宅区，坐一趟电车就能全看到。',
    },
    'Motol': {
      en: 'A stream valley with an old chateau, a mill and an early golf course, under the hill with the largest hospital in the country.',
      cz: 'Údolí potoka se starým zámkem, mlýnem a jedním z prvních golfových hřišť, pod kopcem s největší nemocnicí v zemi.',
      zh: '一条小溪流过的山谷，有老城堡、老磨坊和一座早年的高尔夫球场，山坡上是全国最大的医院。',
    },
    'Jinonice': {
      en: 'Office blocks on one side, the Prokop valley on the other, with a Slavic stronghold older than Prague Castle deep inside it.',
      cz: 'Na jedné straně kanceláře, na druhé Prokopské údolí a hluboko v něm slovanské hradiště starší než Pražský hrad.',
      zh: '一边是写字楼，一边是普罗科普峡谷，峡谷深处有一座比布拉格城堡还老的斯拉夫城堡遗址。',
    },
    'Liboc': {
      en: 'A quiet village beside a walled game reserve with a star-shaped Renaissance summer palace. White Mountain is just outside the wall.',
      cz: 'Tichá ves vedle obory obehnané zdí s renesančním letohrádkem ve tvaru hvězdy. Bílá hora je hned za zdí.',
      zh: '一个安静的村子，挨着一片围墙环绕的林苑，林苑中间是一座星形的文艺复兴夏宫，白山就在墙外。',
    },
    'Ruzyně': {
      en: 'The airport, a barracks, a prison and the mound on White Mountain. For many visitors, the first piece of Prague they ever see.',
      cz: 'Letiště, kasárna, věznice a mohyla na Bílé hoře. Pro spoustu návštěvníků první kousek Prahy, který kdy uvidí.',
      zh: '机场、兵营、监狱和白山上的土冢。对很多游客来说，这是他们看到的第一块布拉格。',
    },
    'Vokovice': {
      en: 'A 1960s housing estate next to Divoká Šárka, the wildest valley in Prague, with cliffs, a stream and a reservoir to swim in.',
      cz: 'Sídliště ze šedesátých let vedle Divoké Šárky, nejdivočejšího pražského údolí se skalami, potokem a nádrží ke koupání.',
      zh: '1960年代的住宅区，旁边就是布拉格最野的山谷野沙尔卡，有峭壁、溪流和一座可以游泳的水库。',
    },
    'Sedlec': {
      en: 'A one-street fishing village between the Vltava and the cliffs, near where the river leaves Prague. Not the Sedlec with the bone church.',
      cz: 'Rybářská ves o jedné ulici mezi Vltavou a skalami, kousek od místa, kde řeka opouští Prahu. Ne ten Sedlec s kostnicí.',
      zh: '夹在伏尔塔瓦河和峭壁之间、只有一条街的渔村，伏尔塔瓦河就在附近流出布拉格。不是那个有人骨教堂的塞德莱茨。',
    },
    'Suchdol': {
      en: 'A farming village on the plateau that became home to Prague\'s agricultural university, above the deep valley of the Vltava.',
      cz: 'Zemědělská ves na planině, kde se usadila pražská zemědělská univerzita, nad hlubokým údolím Vltavy.',
      zh: '高原上的农业村子，后来成了布拉格农业大学的所在地，脚下是伏尔塔瓦河的深谷。',
    },
    'Bohnice': {
      en: 'An old village, a 1970s housing estate with Polish street names, and a psychiatric hospital so big it is a small town of its own.',
      cz: 'Stará ves, sídliště ze sedmdesátých let s ulicemi pojmenovanými po polských městech a psychiatrická nemocnice tak velká, že je sama malým městem.',
      zh: '一座老村子，一片用波兰城市命名街道的1970年代住宅区，还有一座大得像小城的精神病院。',
    },
    'Kobylisy': {
      en: 'An ordinary neighbourhood of flats on the heights of Prague 8, and the site of the 1942 executions at the Kobylisy shooting range.',
      cz: 'Obyčejná čtvrť činžáků na výšinách Prahy 8 a místo poprav na kobyliské střelnici v roce 1942.',
      zh: '8区高地上一片普通的公寓街区，也是1942年科贝利西射击场处决发生的地方。',
    },
    'Prosek': {
      en: 'A Romanesque church more than eight hundred years old, one of Prague\'s first big housing estates, and a sandstone cliff with a view east.',
      cz: 'Románský kostel starý přes osm set let, jedno z prvních velkých pražských sídlišť a pískovcové skály s výhledem na východ.',
      zh: '一座八百多年的罗曼式教堂，布拉格最早的大型住宅区之一，还有一道能远眺城东的砂岩崖。',
    },
    'Hloubětín': {
      en: 'A village on the Rokytka with a knights\' farmstead, a small chateau and the Prague Fault, where rocks of two different ages meet.',
      cz: 'Ves na Rokytce s křižovnickým dvorem, malým zámkem a Pražským zlomem, kde se potkávají horniny dvou různých období.',
      zh: '罗基特卡河边的村子，有骑士团的庄园、一座小城堡，还有两种不同年代岩石相遇的「布拉格断层」。',
    },
    'Malešice': {
      en: 'An old village, an early prefab housing estate, the incinerator that heats much of Prague and a railway viaduct across the valley.',
      cz: 'Stará ves, jedno z prvních panelových sídlišť, spalovna, která vytápí velkou část Prahy, a železniční viadukt přes údolí.',
      zh: '老村子、早期的预制板住宅区、给大半个布拉格供暖的焚烧厂，还有一座横跨山谷的铁路高架桥。',
    },
    'Hostivař': {
      en: 'A reservoir built against floods that became one of Prague\'s favourite beaches, with the Botič winding through a forest park below it.',
      cz: 'Přehrada postavená proti povodním, ze které se stala jedna z nejoblíbenějších pražských pláží, a pod ní Botič vinoucí se lesoparkem.',
      zh: '一座为防洪而修、结果成了全城最受欢迎「海滩」之一的水库，下游的博季奇河在森林公园里蜿蜒。',
    },
    'Černý Most': {
      en: 'One of Prague\'s youngest housing estates, at the end of metro line B, with a station called Paradise Garden and a shopping centre next to it.',
      cz: 'Jedno z nejmladších pražských sídlišť na konečné béčka, se stanicí jménem Rajská zahrada a obchodním centrem hned vedle.',
      zh: '布拉格最年轻的住宅区之一，在地铁B线的终点，车站叫「天堂花园」，旁边就是购物中心。',
    },
    'Dolní Počernice': {
      en: 'A small town of its own with a chateau park, a herd of European bison and the largest pond in Prague.',
      cz: 'Samostatné městečko se zámeckým parkem, stádem zubrů a největším rybníkem v Praze.',
      zh: '一座独立的小镇，有城堡公园、一群欧洲野牛，还有布拉格最大的池塘。',
    },
    'Kyje': {
      en: 'An old village with one of Prague\'s best-preserved Romanesque churches and a big pond, right at the foot of the Černý Most tower blocks.',
      cz: 'Stará ves s jedním z nejzachovalejších pražských románských kostelů a velkým rybníkem, přímo pod paneláky Černého Mostu.',
      zh: '一座老村子，有布拉格保存最好的罗曼式教堂之一和一个大池塘，就在黑桥的高楼脚下。',
    },
    'Chodov': {
      en: 'The northern half of South Town: tower blocks, a huge shopping centre, the National Archives and a medieval castle with a moat among them.',
      cz: 'Severní polovina Jižního Města: paneláky, obří obchodní centrum, Národní archiv a mezi nimi středověká tvrz s vodním příkopem.',
      zh: '「南城」的北半部：高楼、巨大的购物中心、国家档案馆，中间还藏着一座带护城河的中世纪小城堡。',
    },
    'Háje': {
      en: 'The southern half of South Town and the end of metro line C, whose terminus was called Cosmonauts until 1990.',
      cz: 'Jižní polovina Jižního Města a konečná linky C, která se až do roku 1990 jmenovala Kosmonautů.',
      zh: '「南城」的南半部，也是地铁C线的终点，那座车站1990年以前叫「宇航员站」。',
    },
    'Písnice': {
      en: "An old farming village on the 50th parallel that ended up, on the site of a former meat plant, with Prague's Little Hanoi and the best pho in the city.",
      cz: 'Stará zemědělská ves na 50. rovnoběžce, která v areálu bývalého masokombinátu přišla k pražské Malé Hanoji a nejlepšímu phở ve městě.',
      zh: '北纬50度线上的老农村，在一座旧肉类加工厂的地皮上，长出了布拉格的「小河内」和全城最好吃的河粉。',
    },
    'Modřany': {
      en: 'An old riverside village with a former sugar refinery, a big housing estate on the slope, a wild gorge and a working vineyard.',
      cz: 'Stará ves u řeky s bývalým cukrovarem, velkým sídlištěm ve svahu, divokou roklí a vinicí, kde se pořád dělá víno.',
      zh: '河边的老村子，有一座旧糖厂、山坡上的大型住宅区、一道野性的峡谷和一片还在酿酒的葡萄园。',
    },
    'Stodůlky': {
      en: 'The heart of South-West Town, with a big Central Park, the old village church and a reconstructed 14th-century village.',
      cz: 'Srdce Jihozápadního Města s velkým Centrálním parkem, kostelem staré vsi a zrekonstruovanou vesnicí ze 14. století.',
      zh: '「西南城」的中心，有很大的中央公园、老村子的教堂，还有一座复原的14世纪村庄。',
    },
    'Řeporyje': {
      en: 'An old village in a limestone valley with lime kilns and a railway viaduct, which made the international news over a monument in 2020.',
      cz: 'Stará ves ve vápencovém údolí s vápenkami a železničním viaduktem, která se v roce 2020 kvůli jednomu pomníku dostala do světových zpráv.',
      zh: '石灰岩山谷里的老村子，有老石灰窑和铁路高架桥，2020年因为一座纪念碑上了国际新闻。',
    },
    'Radotín': {
      en: 'A small town on the Berounka with a big cement works and limestone quarries full of fossils, next to a quiet valley reserve.',
      cz: 'Městečko na Berounce s velkou cementárnou a vápencovými lomy plnými zkamenělin, hned vedle tichého údolí v rezervaci.',
      zh: '贝龙卡河边的小城，有一座大水泥厂和满是化石的石灰岩采石场，旁边就是安静的山谷保护区。',
    },
    'Velká Chuchle': {
      en: 'A riverside village with one of the country\'s most important racecourses, open since 1906.',
      cz: 'Ves u řeky s jedním z nejdůležitějších dostihových závodišť v zemi, otevřeným v roce 1906.',
      zh: '河边的小村子，有一座1906年开张、全国最重要的赛马场之一。',
    },
    'Malá Chuchle': {
      en: 'A little riverside village that was once a small spa, with a spring said to heal, an old church and a petting zoo.',
      cz: 'Vesnička u řeky, kdysi malé lázně, s pramenem, který prý léčí, starým kostelem a zookoutkem.',
      zh: '河边的小村子，从前是一个小温泉镇，有一眼据说能治病的泉水、一座老教堂和一个小动物角。',
    },
    'Řepy': {
      en: 'A 1980s housing estate at the foot of White Mountain, with the Baroque pilgrimage church built by the battle\'s winners.',
      cz: 'Sídliště z osmdesátých let pod Bílou horou s barokním poutním kostelem, který postavili vítězové bitvy.',
      zh: '白山脚下的1980年代住宅区，旁边是战役获胜一方修建的巴洛克朝圣教堂。',
    },
    'Letňany': {
      en: 'The northern end of metro line C, with an exhibition centre and the airfield where the Czech aircraft industry began.',
      cz: 'Severní konečná linky C s výstavištěm a letištěm, kde začínal český letecký průmysl.',
      zh: '地铁C线的北端，有展览中心，还有捷克航空工业起步的那座机场。',
    },
    'Čakovice': {
      en: 'A small town with a Baroque chateau and park, a former sugar refinery and Prague\'s northernmost point just next door.',
      cz: 'Městečko s barokním zámkem a parkem, bývalým cukrovarem a nejsevernějším bodem Prahy hned vedle.',
      zh: '有巴洛克城堡和公园、一座旧糖厂的小镇，布拉格的最北端就在隔壁。',
    },
    'Kbely': {
      en: 'Czechoslovakia\'s first military airfield, where the national airline\'s first flight took off in 1923, and a free aviation museum.',
      cz: 'První vojenské letiště Československa, odkud v roce 1923 odstartoval první let národních aerolinií, a letecké muzeum bez vstupného.',
      zh: '捷克斯洛伐克的第一座军用机场，1923年国家航空公司的第一次航班从这里起飞，还有一座免费的航空博物馆。',
    },
    'Horní Počernice': {
      en: 'Prague 20 all by itself: a small town grown from three villages, with a theatre and an old chateau that is now a cultural centre.',
      cz: 'Sama o sobě Praha 20: městečko srostlé ze tří vsí, s divadlem a starým zámkem, z něhož je dnes kulturní centrum.',
      zh: '自己就是整个20区：三个村子连成的小城，有剧院，还有一座改成文化中心的老城堡。',
    },
    'Klánovice': {
      en: 'An 1870s summer-villa colony hidden in one of the largest forests around Prague, twenty minutes from the centre by train.',
      cz: 'Kolonie letních vil ze sedmdesátých let 19. století schovaná v jednom z největších lesů kolem Prahy, dvacet minut vlakem od centra.',
      zh: '1870年代的避暑别墅区，藏在布拉格周边最大的森林之一里，坐火车二十分钟到市中心。',
    },
    'Uhříněves': {
      en: 'A small market town with its own square, an old Jewish cemetery and a national institute of animal science in its chateau.',
      cz: 'Malé městečko s vlastním náměstím, starým židovským hřbitovem a státním ústavem živočišné výroby v zámku.',
      zh: '有自己广场的小市镇，有一座老犹太墓地，城堡里是一所国家级的畜牧研究所。',
    },
    "Hodkovičky": {
      en: "A strip of riverside villas under a railway bridge nicknamed the Bridge of the Intelligentsia. Why? It depends who built it.",
      cz: "Pás vil u řeky pod železničním mostem přezdívaným Most inteligence. Proč? Záleží na tom, kdo ho stavěl.",
      zh: "河边一溜别墅，头顶的铁路桥外号“知识分子之桥”，至于为什么，得看是谁修的。",
    },
    "Lhotka": {
      en: "Half old village, half 1970s estate, with a swimming pond and a name that roughly means a new village let off its taxes.",
      cz: "Napůl stará vesnice, napůl sídliště ze sedmdesátých let, s koupacím rybníkem a jménem, které zhruba znamená novou vesnici osvobozenou od daní.",
      zh: "一半老村子，一半1970年代住宅区，有个游泳池塘，名字大意是“免了税的新村子”。",
    },
    "Holyně": {
      en: "A few farmsteads, a green and a limestone valley: one of the smallest and quietest corners of Prague.",
      cz: "Pár statků, náves a vápencové údolí: jeden z nejmenších a nejtišších koutů Prahy.",
      zh: "几座农庄、一块绿地、一道石灰岩山谷，布拉格最小最安静的角落之一。",
    },
    "Radlice": {
      en: "Old factories and new office blocks at the bottom of a valley, where a big bank decided the future was.",
      cz: "Staré továrny a nové kanceláře na dně údolí, kde se jedna velká banka rozhodla mít budoucnost.",
      zh: "谷底是老工厂和新写字楼，一家大银行认定未来就在这条山沟里。",
    },
    "Slivenec": {
      en: "A Gothic church, open fields and the red-veined limestone that Prague spent centuries carting off as marble.",
      cz: "Gotický kostel, pole a vápenec s červenými žilkami, který si Praha staletí odvážela jako mramor.",
      zh: "哥特式老教堂、大片田野，还有被布拉格当大理石运了几百年的红纹石灰岩。",
    },
    "Lysolaje": {
      en: "A valley village with a convent, a swimming pond and little more than a thousand residents.",
      cz: "Vesnice v údolí s klášterem, koupacím rybníkem a sotva tisícovkou obyvatel.",
      zh: "山谷里的小村，一座修女院、一个游泳池塘，人口才一千多。",
    },
    "Nebušice": {
      en: "Farm fields turned family houses above the Šárka valley, with Prague's international school drawing families from abroad.",
      cz: "Z polí nad Šárkou jsou rodinné domy a mezinárodní škola sem láká rodiny ze zahraničí.",
      zh: "沙尔卡山谷北边的田野盖满了独栋房，国际学校又引来了不少外国家庭。",
    },
    "Přední Kopanina": {
      en: "An eight-hundred-year-old church on a hill, with planes from the airport next door for company.",
      cz: "Osm set let starý kostel na kopečku a za sousedy letadla z letiště.",
      zh: "小山上一座八百多年的教堂，邻居是隔壁机场的飞机。",
    },
    "Veleslavín": {
      en: "A quiet stop on the airport road, whose name was carried by the publisher who gave a whole literary era its title.",
      cz: "Tichá zastávka na cestě na letiště, jejíž jméno nesl nakladatel, po němž se jmenuje celá literární éra.",
      zh: "去机场路上的安静一站，16世纪那位大出版商名字里的“韦莱斯拉温”就是这里。",
    },
    "Březiněves": {
      en: "A village named after birch trees, and the quietest corner of Prague 8.",
      cz: "Vesnice pojmenovaná po břízách a nejtišší kout Prahy 8.",
      zh: "名字里有白桦的小村，8区最安静的角落。",
    },
    "Dolní Chabry": {
      en: "An old village with a prehistoric standing stone said to be a farmhand turned to stone. There are many versions, and only one stone.",
      cz: "Stará vesnice s pravěkým menhirem, o němž se vypráví, že to býval zkamenělý čeledín. Verzí je mnoho, kámen jen jeden.",
      zh: "老村边立着一块史前立石，传说是个被变成石头的长工。版本很多，石头只有一块。",
    },
    "Čimice": {
      en: "An estate on one side, a deep wooded valley on the other: the place Prague 8 goes for a run.",
      cz: "Z jedné strany sídliště, z druhé hluboké zalesněné údolí, kam si Praha 8 chodí zaběhat.",
      zh: "一边是住宅区，一边是深谷，8区的人都来这儿跑步。",
    },
    "Ďáblice": {
      en: "It sounds like the devil but is an ordinary village, with an observatory, a big wood and a cemetery that holds the graves of the executed.",
      cz: "Zní to jako čert, ale je to obyčejná vesnice s hvězdárnou, velkým lesem a hřbitovem, kde leží popravení.",
      zh: "名字听着像魔鬼，其实是个普通村子，有天文台、大树林，和一座埋着被处决者的公墓。",
    },
    "Hrdlořezy": {
      en: "The name means throat-cutters. Linguists say it's innocent; the locals enjoy the effect.",
      cz: "Jméno znamená přesně to, co si myslíte. Jazykovědci tvrdí, že je nevinné, místní si ten efekt užívají.",
      zh: "名字直译是“割喉的人”。语言学家说跟杀人无关，本地人很享受这个效果。",
    },
    "Střížkov": {
      en: "Housing estates on the heights, and a metro station under what looks like a giant glass caterpillar.",
      cz: "Sídliště na kopci a stanice metra pod něčím, co vypadá jako obří skleněná housenka.",
      zh: "高地上的住宅区，地铁站顶着一只巨大的玻璃毛毛虫。",
    },
    "Křeslice": {
      en: "Entirely rural, a few kilometres from South Town's towers, with a ring of stones jokingly called the Průhonice Stonehenge.",
      cz: "Úplný venkov pár kilometrů od věžáků Jižního Města, s kruhem kamenů přezdívaným průhonický Stonehenge.",
      zh: "离南城高楼才几公里，却完全是乡下，村边还有一圈“普鲁霍尼采巨石阵”。",
    },
    "Újezd u Průhonic": {
      en: "One of countless Czech Újezds, with 'by Průhonice' added so nobody gets the wrong one.",
      cz: "Jeden z nespočtu českých Újezdů, ten u Průhonic, aby se nepletl.",
      zh: "捷克有无数个乌耶兹德，这个特意注明“普鲁霍尼采旁”，免得认错。",
    },
    "Šeberov": {
      en: "Old fish ponds, a wood and family houses: South Town's quiet back garden.",
      cz: "Staré rybníky, les a rodinné domy: tichá zahrádka Jižního Města.",
      zh: "老鱼塘、树林、独栋房，南城安静的后花园。",
    },
    "Cholupice": {
      en: "One of Prague's southernmost spots, beside a forest where nobles once raised pheasants.",
      cz: "Jedno z nejjižnějších míst Prahy, vedle lesa, kde šlechta kdysi chovala bažanty.",
      zh: "布拉格最南的地方之一，旁边的森林曾是贵族养野鸡的雉苑。",
    },
    "Kamýk": {
      en: "A 1980s estate with a weather station that sends up a balloon every day. Complaints about the forecast may be addressed here.",
      cz: "Sídliště z osmdesátých let s meteorologickou stanicí, která každý den vypouští balon. Stížnosti na předpověď směřujte sem.",
      zh: "1980年代的住宅区，气象台每天放探空气球。天气预报不准，可以来这儿投诉。",
    },
    "Komořany": {
      en: "A riverside village that houses the national weather institute and got flooded in 2002 anyway.",
      cz: "Vesnice u řeky, kde sídlí hydrometeorologický ústav, a v roce 2002 ji stejně zaplavilo.",
      zh: "捷克水文气象局就设在这个河边小村，2002年它还是被淹了。",
    },
    "Libuš": {
      en: "Nothing to do with Princess Libuše, but a great deal to do with a metro line planned for decades.",
      cz: "S kněžnou Libuší nemá nic společného, zato už desítky let čeká na metro D.",
      zh: "跟公主莉布谢没关系，倒是跟规划了几十年的地铁D线很有关系。",
    },
    "Točná": {
      en: "A plateau with an old village, gliders overhead and the earth ramparts of a stronghold older than all of it.",
      cz: "Planina se starou vesnicí, kluzáky nad hlavou a valy hradiště, které je starší než to všechno.",
      zh: "高原上有老村子和滑翔机，还有比这些都老得多的城堡土墙。",
    },
    "Třebonice": {
      en: "You have probably been here: it's where the IKEA everyone calls Zličín actually stands.",
      cz: "Nejspíš jste tu byli: právě tady stojí IKEA, které všichni říkají Zličín.",
      zh: "你多半来过：大家嘴里的“兹利钦宜家”，其实就在这儿。",
    },
    "Zadní Kopanina": {
      en: "A few dozen households, fields, valleys and an old clay pit, on land whose name means dug and cleared.",
      cz: "Pár desítek domácností, pole, údolí a staré hliniště na půdě, jejíž jméno znamená vykopaná a vymýcená.",
      zh: "几十户人家，田野、山谷和一个老黏土坑。名字的意思就是“开垦出来的地”。",
    },
    "Hostavice": {
      en: "An old farming village holding its ground between Černý Most and the new houses on its edge.",
      cz: "Stará zemědělská vesnice, která si drží místo mezi Černým Mostem a novými domy.",
      zh: "夹在黑桥和新住宅之间，老村子的中心硬是留了下来。",
    },
    "Dolní Měcholupy": {
      en: "Factories and warehouses all round, and an old farming village tucked away in the middle.",
      cz: "Kolem dokola továrny a sklady, uprostřed schovaná stará vesnice.",
      zh: "四周是工厂和仓库，老村子藏在正中间。",
    },
    "Dubeč": {
      en: "Two villages, ponds, and a Romanesque church more than eight hundred years old on a little hill.",
      cz: "Dvě vesnice, rybníky a na kopečku románský kostel starý přes osm set let.",
      zh: "两个小村、几片池塘，小山上一座八百多岁的罗曼式教堂。",
    },
    "Horní Měcholupy": {
      en: "Tens of thousands moved in around a village that kept its little bell tower.",
      cz: "Kolem vesnice se nastěhovaly desetitisíce lidí a ona si nechala svou zvoničku.",
      zh: "几万人搬到村子周围，老村子只守住了一座小钟楼。",
    },
    "Petrovice": {
      en: "A small chateau and a church left standing in the middle of a 1980s housing estate.",
      cz: "Zámeček a kostel, které zůstaly stát uprostřed sídliště z osmdesátých let.",
      zh: "一座小城堡和一座教堂，被留在了1980年代住宅区的正中间。",
    },
    "Štěrboholy": {
      en: "The Battle of Prague was fought here in 1757; today the fiercest fighting is at the outlet centre.",
      cz: "Roku 1757 se tu bojovala bitva u Prahy, dnes se nejtvrději bojuje v outletu.",
      zh: "1757年的布拉格战役打在这里，如今最激烈的争夺发生在奥特莱斯。",
    },
    "Lahovice": {
      en: "A tiny village where the Berounka meets the Vltava, which is lovely until they both rise.",
      cz: "Malá vesnice na soutoku Berounky s Vltavou. Krásné místo, dokud nestoupnou obě.",
      zh: "贝龙卡河和伏尔塔瓦河在这儿交汇，风景很好，只要两条河别一起涨水。",
    },
    "Lipence": {
      en: "An old watermill, wooded slopes and the Berounka: named after lime trees and in no hurry.",
      cz: "Starý mlýn, zalesněné stráně a Berounka. Pojmenováno po lípách a nikam nespěchá.",
      zh: "老水磨、山坡树林、贝龙卡河，名字来自椴树，日子也过得不紧不慢。",
    },
    "Lochkov": {
      en: "A small chateau among limestone quarries, and about a thousand residents.",
      cz: "Zámeček mezi vápencovými lomy a asi tisíc obyvatel.",
      zh: "石灰岩采石场中间有座小城堡，全村一千人左右。",
    },
    "Sobín": {
      en: "Home of Prague's highest point, 399 metres up and indistinguishable from a field.",
      cz: "Tady je nejvyšší bod Prahy, 399 metrů nad mořem a k nerozeznání od pole.",
      zh: "布拉格的最高点在这儿，海拔399米，看上去就是一块田。",
    },
    "Zličín": {
      en: "The end of metro line B, where shopping centres landed on the fields and the old village hid behind them.",
      cz: "Konečná béčka, kde na pole přistála nákupní centra a stará vesnice se schovala za ně.",
      zh: "地铁B线的终点，田野上落满了购物中心，老村子躲在它们身后。",
    },
    "Miškovice": {
      en: "One main road, a few farmsteads and a field: the complete village, nothing added.",
      cz: "Jedna hlavní silnice, pár statků a pole: vesnice v plném rozsahu.",
      zh: "一条主路、几座农庄、一片田，村子该有的都有了。",
    },
    "Třeboradice": {
      en: "An old church, a heating plant and, out in the fields, Prague's North Pole.",
      cz: "Starý kostel, teplárna a v polích pražský severní pól.",
      zh: "老教堂、供热厂，田野里还有“布拉格北极”。",
    },
    "Satalice": {
      en: "Family houses beside a forest of centuries-old oaks where nobles once raised pheasants.",
      cz: "Rodinné domy vedle lesa se staletými duby, kde šlechta kdysi chovala bažanty.",
      zh: "独栋房旁边是几百岁的老橡树林，当年贵族在这儿养野鸡。",
    },
    "Vinoř": {
      en: "It sounds like wine and has two chateaux, which is a fair consolation.",
      cz: "Zní to jako víno a má dva zámky, což je slušná náhrada.",
      zh: "名字听着像葡萄酒，酒没有，城堡倒有两座。",
    },
    "Běchovice": {
      en: "Coaches once changed horses here; since 1897 runners have set off for Prague in Europe's oldest road race.",
      cz: "Kdysi se tu přepřahalo, od roku 1897 odtud běžci vyrážejí do Prahy v nejstarším silničním závodě Evropy.",
      zh: "当年马车在这儿换马，1897年起长跑选手从这儿奔向布拉格，欧洲最古老的公路长跑。",
    },
    "Koloděje": {
      en: "A Baroque chateau kept for official receptions, so you are welcome to admire the outside.",
      cz: "Barokní zámek pro oficiální přijetí, takže si ho můžete prohlédnout zvenčí.",
      zh: "巴洛克城堡专门用来接待贵宾，所以欢迎你从外面欣赏。",
    },
    "Újezd nad Lesy": {
      en: "Family houses beside the Klánovice forest, and Prague's easternmost point.",
      cz: "Rodinné domy u klánovického lesa a nejvýchodnější bod Prahy.",
      zh: "克拉诺维采森林边的独栋房，布拉格的最东端也在这儿。",
    },
    "Benice": {
      en: "A few hundred people, and fields that carry on past the city limits without noticing.",
      cz: "Pár set lidí a pole, která pokračují za hranici města, aniž by si toho všimla.",
      zh: "几百口人，田野一直延伸到城市边界之外，压根没注意到边界。",
    },
    "Hájek u Uhříněvsi": {
      en: "Its name means little grove, and it has ponds and fields to go with it.",
      cz: "Malý háj, rybníky a pole, nic víc a nic míň.",
      zh: "名字意思是“小树林”，四周是田野和池塘，名副其实。",
    },
    "Kolovraty": {
      en: "The village that lent its name to the Kolowrats, one of Bohemia's oldest noble houses.",
      cz: "Vesnice, která dala jméno Kolovratům, jednomu z nejstarších českých šlechtických rodů.",
      zh: "波希米亚最古老的贵族之一科洛夫拉特家族，名字就来自这个村子。",
    },
    "Královice": {
      en: "The king's people, as the name goes, and one of Prague's best-preserved small medieval castles.",
      cz: "Jméno prozrazuje královské lidi a ve vsi stojí jeden z nejzachovalejších středověkých hrádků v Praze.",
      zh: "名字意思是“国王的人”，村里有布拉格保存最好的中世纪小城堡之一。",
    },
    "Lipany": {
      en: "Not that Lipany: the battle of 1434 happened beside another village of the same name.",
      cz: "Tohle nejsou ty Lipany: bitva roku 1434 se odehrála u jiné vesnice stejného jména.",
      zh: "不是那个利帕尼：1434年的决战打在另一个同名的村子旁边。",
    },
    "Nedvězí u Říčan": {
      en: "A few hundred residents, fields, woods and one of the quietest corners of Prague.",
      cz: "Pár set obyvatel, pole, lesy a jeden z nejtišších koutů Prahy.",
      zh: "几百口人，田野和树林，布拉格最安静的角落之一。",
    },
    "Pitkovice": {
      en: "A village beside a never-ploughed slope where rare steppe flowers have quietly carried on.",
      cz: "Vesnice pod nikdy neoranou strání, kde si vzácné stepní květiny žijí dál.",
      zh: "村边的山坡从没被开垦过，罕见的草原野花就这么一直开着。",
    },
  },
};
