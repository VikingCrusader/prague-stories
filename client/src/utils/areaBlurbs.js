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
      en: 'Žižkov territory: a TV tower with giant babies crawling up it, a one-eyed general on a horse on Vítkov hill, and a pub on what feels like every corner.',
      cz: 'Žižkovské území: televizní věž, po které lezou obří miminka, jednooký vojevůdce na koni na Vítkově a hospoda na každém druhém rohu.',
      zh: '日什科夫的地盘：一座爬满巨型婴儿的电视塔，维特科夫山上骑着马的独眼将军，还有差不多每个街角都有的一家小酒馆。',
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
      en: "An independent town until 1922, named after the one-eyed Hussite general. Famous for its pubs, its rebellious streak and its TV tower.",
      cz: 'Až do roku 1922 samostatné město, pojmenované po jednookém husitském vojevůdci. Proslulé hospodami, rebelstvím a televizní věží.',
      zh: '1922年以前还是个独立城镇，名字来自那位独眼的胡斯派将军。以小酒馆、叛逆脾气和电视塔闻名。',
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
  },
};
