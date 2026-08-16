// Seed script for the History Timeline's HistoryEvent documents. Mirrors the
// upsert pattern in seedLocations.js: idempotent, $setOnInsert so re-running
// never clobbers manual edits made after the fact.
//
// Only Era 1 (Legends & Origins) is populated for now — per the product call
// to build one era well before writing the rest. See data/historyEras.js for
// the full six-era roster; eras beyond this one stay `hasContent: false`
// until they get their own batch here.
//
// Every relatedLandmarks slug below was checked against the live locations
// collection before being used — see the conversation this shipped in for
// the audit. Do not add a slug here without checking it resolves first: an
// unresolved slug renders as a dead link on the timeline.
import "dotenv/config";
import { connectDB } from "../config/db.js";
import HistoryEvent from "../models/HistoryEvent.js";

export const historyEvents = [
  {
    slug: "early-history",
    era: "legends-origins",
    startYear: -500,
    year: {
      en: "Prehistory – 6th century AD",
      cz: "Pravěk – 6. století n. l.",
      zh: "史前时代至公元6世纪",
    },
    image: "/history/prehistory.webp",
    tone: "humorous",
    title: {
      en: "Before the Legend",
      cz: "Před legendou",
      zh: "传说之前",
    },
    hookLine: {
      en: "Every good story needs a stage before it needs a hero — and this one took three different peoples about a thousand years just to build the stage.",
      cz: "Každý dobrý příběh potřebuje nejdřív jeviště, a ne hrdinu — a tomuhle trvalo tři různým národům skoro tisíc let, než to jeviště vůbec postavily.",
      zh: "任何一个好故事开场前，总得先把舞台搭好——而这一次，足足有三批不同的民族，花了差不多一千年才把这个舞台搭起来。",
    },
    summary: {
      en: "Long before anyone thought to write anything down, people were already living on the hills and riverbanks where Prague would one day stand — just farming, hunting, getting on with life. The first people we actually know by name showed up around 500 BC: a Celtic tribe called the Boii, who liked the place enough to name the whole region after themselves — Bohemia literally means 'land of the Boii,' and the name stuck around for two thousand years after the Boii themselves didn't. Then came the Germanic tribes, who pushed the Boii out and moved in — only to pack up themselves a few centuries later and head south toward the Danube, as if the whole region had a 'no long-term residents' rule. That left the land wide open just as a new group came wandering in from the west: Slavic settlers, quietly arriving with no idea they were about to become the ancestors of an entire nation — and the unwitting stars of the legend that's about to start.",
      cz: "Dávno předtím, než si kdokoli dal tu práci něco zapisovat, žili lidé na kopcích a březích řek, kde jednou bude stát Praha — prostě hospodařili, lovili, žili si svůj život. První lidé, které známe jménem, se tu objevili kolem roku 500 př. n. l.: keltský kmen Bójů, kterému se tu zalíbilo natolik, že po sobě pojmenoval celý kraj — Bohemia doslova znamená „země Bójů“, a jméno vydrželo dva tisíce let poté, co sami Bójové dávno zmizeli. Pak přišly germánské kmeny, které Bóje vytlačily a usadily se samy — jenže o pár staletí později se sbalily zase ony a vydaly se na jih k Dunaji, jako by v kraji platilo pravidlo „žádné trvalé bydliště“. Země tak zůstala volná právě ve chvíli, kdy od západu přicházela nová skupina: slovanští osadníci, kteří netušili, že se právě stávají předky celého národa — a nic netušícími hvězdami legendy, která se za chvíli rozjede.",
      zh: "早在有人想起要把什么事情记下来之前，就已经有人住在未来布拉格所在的那片山丘和河岸边——种地、打猎，过着自己的日子。我们能叫得出名字的第一批人，大约在公元前500年出现：一支凯尔特波伊部落，他们喜欢这片土地，干脆把整个地区都用自己的名字命名——波希米亚这个名字，字面意思就是波伊人的土地，而在波伊人自己早已消失两千年后，这个名字却一直沿用了下来。接着日耳曼部落来了，把波伊人赶走，自己住了进去——结果几个世纪后，他们自己也收拾行李南迁到多瑙河流域，仿佛这片土地立下了一条不成文的规矩：谁也别想长住。这片土地就这样刚好空了出来，而恰在此时，一支新的族群从西边缓缓而来：斯拉夫定居者，他们完全没有意识到，自己即将成为一整个民族的祖先——也将成为接下来这个传说里，浑然不知情的主角。",
    },
    relatedLandmarks: [
      {
        slug: "vinorsky-rondel",
        relation: {
          en: "A Neolithic circular earthwork some 7,000 years old — older than Stonehenge, and proof this land was hosting large communal building projects millennia before anyone here had a name.",
          cz: "Neolitické kruhové zemní dílo staré zhruba 7000 let — starší než Stonehenge, a důkaz, že tahle země hostila velké společné stavební projekty celá tisíciletí předtím, než tu kdokoli měl jméno.",
          zh: "一座约七千年前的新石器时代环形土木建筑——比巨石阵还要古老，证明这片土地早在有人拥有姓名之前的数千年，就已经承载着大规模的集体建筑工程。",
        },
      },
      {
        slug: "keltske-oppidum-zavist",
        relation: {
          en: "The largest Celtic oppidum ever built in the Czech lands — about as close as Bohemia gets to a Boii return address.",
          cz: "Největší keltské oppidum, jaké kdy na území Čech vzniklo — asi nejbližší věc, jakou má Bohemia k adrese Bójů.",
          zh: "捷克境内曾建成的最大凯尔特山寨——大概是波希米亚地界上离波伊人最近的一处旧址了。",
        },
      },
      {
        slug: "hradiste-sarka",
        relation: {
          en: "Occupied on and off since the Stone Age, and — for a stretch right up until Prague Castle's rise — the most important address in the region.",
          cz: "Osídlené s přestávkami už od doby kamenné a — po jistou dobu, než se vzedmul Pražský hrad — nejdůležitější adresa v regionu.",
          zh: "自石器时代起便断断续续有人居住——在布拉格城堡崛起之前的一段时期，这里曾是整个地区最重要的据点。",
        },
      },
      {
        slug: "zarove-pohrebiste-pichora",
        relation: {
          en: "Where the Germanic tribes who displaced the Boii finally get a name and a face: the burial ground of Marobud's Marcomanni warrior retinue.",
          cz: "Místo, kde germánské kmeny, jež vytlačily Bóje, konečně dostávají jméno a tvář — pohřebiště válečnické družiny Marobudových Markomanů.",
          zh: "在这里，那些赶走波伊人的日耳曼部落终于有了名字与面貌——这是马罗博杜麾下马科曼尼战士亲兵的埋骨之地。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/History_of_Prague",
  },
  {
    slug: "libuse-prophecy",
    era: "legends-origins",
    startYear: 720,
    year: {
      en: "8th century (legendary)",
      cz: "8. století (legenda)",
      zh: "8世纪（传说）",
    },
    image: "/history/libuse.webp",
    tone: "humorous",
    title: {
      en: "Libuše's Prophecy",
      cz: "Libušino proroctví",
      zh: "莉布谢的预言",
    },
    hookLine: {
      en: "That legend starts, as all the best ones do, with someone standing on a cliff and making a decision nobody asked them to make.",
      cz: "A ta legenda začíná, jak se na pořádnou legendu sluší, tím, že někdo stojí na skále a udělá rozhodnutí, o které ho nikdo nežádal.",
      zh: "而这个传说的开场，跟所有精彩传说一样：一个人站在悬崖上，做出了一个没人拜托她做的决定。",
    },
    summary: {
      en: "By the time our story reaches the 700s, the descendants of those wandering Slavic settlers had a ruler: a woman named Libuše, said to be wise enough to settle any dispute and — according to the old chronicles — occasionally able to see the future. She made most of her prophecies from her own castle at Libušín in central Bohemia, a real hillfort archaeologists have confirmed was already inhabited well before her time. One of those prophecies was about Prague itself: in a vision, Libuše reportedly saw 'a great city whose glory will reach the stars' rising on a steep cliff above the Vltava, right where a man was carving a threshold — prah, in Czech — for his new house. That city, she declared, would be called Praha: 'princes and dukes will bow before its threshold,' and the whole world would come to know its name. The hill she pointed to became Prague Castle, and ever since, the city has enjoyed reminding every visitor that even its own name was predicted in advance — never mind that nobody can actually prove Libuše existed.",
      cz: "Než se náš příběh dostane do 8. století, potomci oněch bloudících slovanských osadníků už měli vládkyni: ženu jménem Libuše, o níž se říkalo, že je moudrá dost na to, aby rozsoudila jakýkoli spor, a podle starých kronik dokonce občas dokázala nahlédnout do budoucnosti. Většinu svých proroctví pronesla na vlastním hradišti Libušín ve středních Čechách — skutečném hradišti, o kterém archeologové potvrdili, že bylo osídlené už dávno před jejími časy. Jedno z těch proroctví se týkalo přímo Prahy: ve vidění Libuše prý spatřila „veliké město, jehož sláva se dotkne hvězd“, jak povstává na strmém skalním srázu nad Vltavou, přesně v místě, kde nějaký muž právě vytesával práh svého nového domu. Tomu městu prý dala jméno Praha — „knížata a vévodové se budou před jeho prahem klanět“ a celý svět jednou pozná jeho jméno. Tím kopcem se stal Pražský hrad, a město si od té doby rádo připomíná, že dokonce i jeho vlastní jméno bylo předpovězeno předem — bez ohledu na to, zda vůbec někdo dokáže, že Libuše skutečně existovala.",
      zh: '当我们的故事来到8世纪时，那些四处迁徙的斯拉夫定居者的后代，已经有了一位统治者：一位名叫莉布谢的女性，据说她聪明到足以裁决任何争端，而根据古老的编年史记载，她偶尔还能预见未来。她的大部分预言，都是在自己位于中波希米亚的莉布新城堡中说出的——那是一座真实的古堡遗址，考古学家已经证实，早在她的时代之前这里就已经有人居住。其中一则预言，正是关于布拉格本身：据说莉布谢曾在异象中看见"一座伟大的城市，其荣耀将直抵星辰"，矗立在伏尔塔瓦河畔一处险峻的悬崖上——就在那个地方，一名男子正为自己的新房凿刻门槛，捷克语称之为"prah"。她宣告，那座城市将被命名为布拉格："王公贵族都将在它的门槛前躬身行礼"，而全世界终将知晓它的名字。她所指的那座山丘，后来成了布拉格城堡，而这座城市从此以后，一直乐此不疲地提醒每一位访客：就连自己的名字，都是被预言过的——尽管没人能证明莉布谢真的存在过。',
    },
    relatedLandmarks: [
      {
        slug: "sousosi-premysl-a-libuse",
        relation: {
          en: "The 19th-century statue that gives the myth a face — Libuše depicted beside the husband her prophecy would soon require.",
          cz: "Sousoší z 19. století, které mýtu dalo tvář — Libuše zobrazená vedle manžela, kterého si její proroctví brzy vyžádalo.",
          zh: "这座19世纪的雕像群为这则神话赋予了面容——莉布谢与她的预言不久后所需要的那位丈夫并肩而立。",
        },
      },
      {
        slug: "hradiste-libusin",
        relation: {
          en: "The real hillfort where the legend places Libuše's own court and the prophecy itself — the archaeological site standing behind the myth.",
          cz: "Skutečné hradiště, kam legenda klade Libušin vlastní dvůr i samotné proroctví — archeologická lokalita stojící za mýtem.",
          zh: "传说中莉布谢宫廷与这则预言诞生之地的真实城寨遗址——神话背后那处货真价实的考古现场。",
        },
      },
      {
        slug: "libusina-lazen",
        relation: {
          en: "A far less flattering Libuše legend — a scandalous 19th-century tale bolted onto a ruin many centuries too young to have ever known her.",
          cz: "O poznání méně lichotivá legenda o Libuši — skandální pověst z 19. století přilepená ke zřícenině, která je o celá staletí příliš mladá na to, aby ji vůbec mohla poznat.",
          zh: "一则远没那么正面的莉布谢传说——一段19世纪的丑闻故事，被硬安在了一处年代晚了她好几百年的废墟之上。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Libu%C5%A1e",
  },
  {
    slug: "premysl-the-ploughman",
    era: "legends-origins",
    startYear: 722,
    year: {
      en: "8th century (legendary)",
      cz: "8. století (legenda)",
      zh: "8世纪（传说）",
    },
    image: "/history/premysl.webp",
    tone: "humorous",
    title: {
      en: "Přemysl the Ploughman",
      cz: "Přemysl Oráč",
      zh: "犁田者普热米斯尔",
    },
    hookLine: {
      en: "A prophecy is a nice piece of theatre, but a kingdom still needs someone to actually run it — and Libuše's council had strong opinions about who that someone should be.",
      cz: "Proroctví je hezké divadlo, jenže království pořád potřebuje někoho, kdo ho bude skutečně řídit — a Libušina rada měla na to, kdo by to měl být, dost pevný názor.",
      zh: "预言固然是一出精彩的戏，但一个国家终究需要有人真正去治理——而莉布谢的臣民，对这个人该是谁，意见十分强烈。",
    },
    summary: {
      en: "Here's the catch about being a female ruler in the 8th century: plenty of people weren't thrilled about it, no matter how good your prophecies were. So when Libuše's subjects started grumbling that she needed a husband to rule properly, she reportedly just... already knew who it would be. She sent her horse off alone, and it came back leading a farmer named Přemysl, found mid-plough in a field, wearing plain leather sandals, entirely unaware his life was about to change. He left the oxen standing in the furrow, married Libuše, and became the founder of a dynasty — the Přemyslids — that would rule Bohemia, on and off, for the next five hundred years. And in a nice touch, the family reportedly kept his old sandals and farm tools in the royal treasury forever, just to remember where they came from.",
      cz: "V tom je ten háček s ženskou vládkyní v 8. století: spoustě lidí se to nezamlouvalo, ať byla proroctví sebelepší. Když si tedy Libušini poddaní začali stěžovat, že by měla mít po boku manžela, který bude vládnout pořádně, prý už dopředu věděla, kdo to bude. Poslala svého koně samotného, a ten se vrátil s rolníkem jménem Přemysl, nalezeným při orání pole, v obyčejných kožených sandálech, naprosto netušícím, že se mu právě mění život. Nechal voly stát uprostřed brázdy, oženil se s Libuší a stal se zakladatelem dynastie — Přemyslovců —, která pak s přestávkami vládla Čechám dalších pět set let. A jako pěkný detail navíc rod prý navždy uchovával jeho staré sandály a nářadí v knížecí pokladnici, jen aby nezapomněl, odkud vzešel.",
      zh: "这就是8世纪女性统治者的麻烦所在：不管你的预言有多准，总有人不买账。于是，当莉布谢的臣民开始抱怨她该有个丈夫来好好治理国家时，据说她早就心中有数了。她放开自己的马，让它独自离开，结果马带回来一位农夫——普热米斯尔，当时正在田里犁地，脚上穿着一双朴素的皮凉鞋，完全不知道自己的人生即将天翻地覆。他把牛留在半耕的田垄间，迎娶了莉布谢，成为了此后断断续续统治波希米亚长达五百年的普热米斯尔王朝的开创者。而作为一个有趣的细节，据说这个家族此后一直把他那双旧凉鞋和农具珍藏在王室宝库里，就是为了不忘记自己从哪里出身。",
    },
    relatedLandmarks: [
      {
        slug: "sousosi-premysl-a-libuse",
        relation: {
          en: "The same statue pair — this half shows the ploughman mid-story, still being fetched from his field to become a duke.",
          cz: "Stejné sousoší — tato polovina zachycuje oráče uprostřed příběhu, ještě než byl odveden z pole, aby se stal knížetem.",
          zh: "同一座雕像群——这一侧描绘的正是犁田者本人，尚未被从田间接走、成为一方之主前的那一刻。",
        },
      },
      {
        slug: "levy-hradec",
        relation: {
          en: "The dynasty Přemysl founded needed a seat before Prague Castle existed — this hillfort was it, hosting the Přemyslids two centuries before his descendants moved on to grander things.",
          cz: "Dynastie, kterou Přemysl založil, potřebovala sídlo dřív, než vůbec existoval Pražský hrad — a tímhle hradištěm bylo právě tohle, dvě staletí předtím, než se jeho potomci přesunuli za něčím honosnějším.",
          zh: "普热米斯尔一手创立的这个王朝，在布拉格城堡出现之前就需要一处根据地——而这座古城堡遗址正是普热米斯尔王朝早年的驻地，足足早了两个世纪，后来他的后代才迁往更宏伟的地方。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/P%C5%99emysl_the_Ploughman",
  },
  {
    slug: "girls-war",
    era: "legends-origins",
    startYear: 730,
    year: {
      en: "8th century (legendary)",
      cz: "8. století (legenda)",
      zh: "8世纪（传说）",
    },
    image: "/history/sarka.webp",
    tone: "humorous",
    title: {
      en: "The Girls' War",
      cz: "Dívčí válka",
      zh: "少女之战",
    },
    hookLine: {
      en: "Every founding dynasty eventually faces its first rebellion — and Bohemia's came, rather memorably, from the women Libuše left behind.",
      cz: "Každá zakládající dynastie si dřív nebo později musí projít první vzpourou — a ta česká přišla, dost nezapomenutelně, od žen, které po sobě Libuše zanechala.",
      zh: "任何一个开国王朝，迟早都要面对第一场叛乱——而波希米亚的这一场，颇为令人难忘地，来自莉布谢留下的那些女人。",
    },
    summary: {
      en: "Libuše's death didn't go smoothly. According to legend, the women of her old court weren't ready to hand power over to Přemysl and his male successors, so under a leader named Vlasta — said to have been one of Libuše's closest confidantes — they moved out entirely and raised their own rival stronghold, Děvín, on a ridge facing Vyšehrad across the river. What followed was several years of ambushes and standoffs, capped by one genuinely wild trick: a warrior named Šárka, acting on Vlasta's orders, let herself be chained to a tree as bait, luring a lovestruck enemy commander and his soldiers straight into a fatal trap. Vlasta herself didn't outlast the war she'd started — she was killed leading a final assault on Vyšehrad, and with Děvín burned to the ground behind her, the whole experiment in women's rule came to an end. The men eventually won the war — but lost the naming rights, since the valley where Šárka's trap played out is still called Šárka to this day.",
      cz: "Libušina smrt neproběhla hladce. Podle legendy se ženy z jejího bývalého dvora nechtěly smířit s tím, že moc přejde na Přemysla a jeho mužské nástupce, a tak se pod vedením ženy jménem Vlasta — údajně jedné z Libušiných nejbližších důvěrnic — úplně odstěhovaly a na hřebeni naproti Vyšehradu si přes řeku postavily vlastní soupeřící pevnost, Děvín. Následovalo několik let přepadů a patových situací, korunovaných jedním opravdu šíleným trikem: bojovnice Šárka se z Vlastina rozkazu nechala jako návnada přivázat ke stromu a do smrtelné pasti tak vlákala zamilovaného nepřátelského velitele i jeho vojáky. Sama Vlasta válku, kterou rozpoutala, nepřežila — padla při posledním útoku na Vyšehrad, a s Děvínem vypáleným do základů skončil celý experiment se ženskou vládou. Muži válku nakonec vyhráli — ale prohráli právo na pojmenování, protože údolí, kde se Šárčina léčka odehrála, se dodnes jmenuje Šárka.",
      zh: "莉布谢的死并不平静。据传说，她昔日宫廷中的女性并不甘心把权力交给普热米斯尔和他之后的男性继承人，于是在一位名叫弗拉斯塔的女子率领下——据说她是莉布谢最亲近的密友之一——她们干脆彻底搬离，在隔河正对维谢赫拉德的一道山脊上，修建了属于自己的对立堡垒：女儿堡。随之而来的是长达数年的伏击与对峙，其中最疯狂的一招，莫过于女战士沙尔卡：她奉弗拉斯塔之命，自愿被锁在树上充当诱饵，把一位为她倾心的敌方指挥官连同他的士兵，一起引入了死亡陷阱。弗拉斯塔本人却没能活过这场由她挑起的战争——她在对维谢赫拉德发起的最后一次进攻中阵亡，女儿堡也随之被付之一炬，女性统治的这场实验就此终结。男人们最终打赢了这场战争——却输掉了命名权，因为沙尔卡设下埋伏的那道山谷，至今仍然叫作沙尔卡。",
    },
    relatedLandmarks: [
      {
        slug: "dvn-hillfort-ruins-1783473947717",
        relation: {
          en: "Vlasta's own stronghold — the women's fortress facing Vyšehrad across the river, and, fittingly, another case where the real archaeology (Bronze Age and early Slavic, not 8th-century Amazons) predates the legend it's named for.",
          cz: "Vlastina vlastní pevnost — ženská tvrz stojící přes řeku naproti Vyšehradu, a případně další ukázka toho, jak skutečná archeologie (doba bronzová a raně slovanské osídlení, ne 8. stoleté Amazonky) předchází legendu, po níž je místo pojmenováno.",
          zh: "弗拉斯塔自己的据点——隔河与维谢赫拉德相望的女性堡垒，而且恰好又是一个真实考古年代（青铜时代与早期斯拉夫定居，而非8世纪的亚马逊女战士）早于传说本身的例子。",
        },
      },
      {
        slug: "hradiste-sarka",
        relation: {
          en: "The hillfort above the Šárka valley — long a real seat of regional power in its own right, and the legendary battleground's namesake.",
          cz: "Hradiště nad údolím Šárka — samo o sobě dlouho skutečné centrum regionální moci, a zároveň jmenovkyně legendárního bojiště.",
          zh: "沙尔卡山谷上方的古堡遗址——它本身早就是这一地区真实的权力中心，也正是这场传说战役所在山谷名字的由来。",
        },
      },
      {
        slug: "divoka-sarka",
        relation: {
          en: "The valley itself — Šárka's namesake and, by legend, the very ground the ambush played out on. Today it's a wild nature reserve, no chains or trees-as-bait required.",
          cz: "Samotné údolí — jmenovkyně Šárky a podle legendy přesně to místo, kde se odehrála léčka. Dnes je to divoká přírodní rezervace, řetězy ani strom coby návnada už nejsou potřeba.",
          zh: "山谷本身——沙尔卡这个名字的由来，据传说也正是当年设下埋伏的地方。如今这里是一片野生自然保护区，用不着锁链，也用不着拿人当诱饵了。",
        },
      },
    ],
    wikipediaUrl:
      "https://en.wikipedia.org/wiki/D%C3%ADv%C4%8D%C3%AD_v%C3%A1lka",
  },
  {
    slug: "founding-of-vysehrad",
    era: "legends-origins",
    startYear: 725,
    year: {
      en: "8th century by legend; 10th century by record",
      cz: "8. století podle legendy; 10. století podle záznamů",
      zh: "传说为8世纪；有据可查的历史为10世纪",
    },
    image: "/history/vysehrad.webp",
    tone: "humorous",
    title: {
      en: "The Founding of Vyšehrad",
      cz: "Založení Vyšehradu",
      zh: "维谢赫拉德的建立",
    },
    hookLine: {
      en: "Every growing dynasty eventually needs a proper address — and Bohemia's has spent two centuries arguing about which hill that address actually was.",
      cz: "Každá rostoucí dynastie časem potřebuje pořádnou adresu — a ta česká se už dvě stě let hádá o to, které kopce se to vlastně týkalo.",
      zh: "任何一个不断壮大的王朝，迟早都需要一个像样的地址——而波希米亚人，已经为了这个地址到底是哪座山丘，争论了整整两百年。",
    },
    summary: {
      en: "So where exactly did all this ruling happen? Ask nineteenth-century Czech storytellers and they'll point confidently at Vyšehrad, a dramatic rocky outcrop across the river from Prague Castle, insisting it was Libuše's original seat of power — older, grander, and altogether more impressive than the castle her prophecy would supposedly found later. It's a great story. It's just not a very well-documented one: real evidence for Vyšehrad only starts showing up centuries later, with a duke minting coins there around 995, and its oldest surviving building wasn't built until roughly 1080. So take the legend with a pinch of salt — but the hilltop itself is real, dramatic, and clearly worth arguing about for two hundred years.",
      cz: "Kde přesně se tedy všechno to vládnutí odehrávalo? Zeptejte se devatenáctého století a čeští vypravěči s jistotou ukážou na Vyšehrad, dramatický skalní ostroh na druhém břehu řeky naproti Pražskému hradu, a budou tvrdit, že to bylo Libušino původní sídlo — starší, velkolepější a celkově působivější než hrad, který její proroctví údajně založilo později. Je to skvělý příběh. Jen není moc dobře doložený: skutečné doklady o Vyšehradu se objevují až o staletí později, kdy tam kolem roku 995 kníže razil mince, a jeho nejstarší dochovaná stavba vznikla teprve kolem roku 1080. Berte tedy legendu s rezervou — ale samotný ten kopec je skutečný, dramatický a evidentně stál za dvě stě let hádek.",
      zh: "那么，这一切统治究竟发生在哪里呢？如果你去问19世纪的捷克说书人，他们会一脸笃定地指向维谢赫拉德——一处隔河与布拉格城堡相望、地势险峻的岩岬，并坚称这里才是莉布谢最初的居所，比她预言中后来建立的城堡更古老、更宏伟、也更气派。这是个精彩的故事。只可惜证据不太站得住脚：关于维谢赫拉德真正确凿的记录，要晚上好几个世纪才出现——公爵约在995年在此铸造钱币，而现存最古老的建筑，也要到约1080年才建成。所以这个传说不妨打个折扣来听——但这座山岬本身是真实存在的，地势险峻，也确实值得让人争论上整整两百年。",
    },
    relatedLandmarks: [
      {
        slug: "rotunda-sv-martina",
        relation: {
          en: "The oldest building still standing in Prague, raised around 1080 — the first Vyšehrad structure that doesn't need a legend to prove its age.",
          cz: "Nejstarší dodnes stojící stavba v Praze, vztyčená kolem roku 1080 — první vyšehradská stavba, která k prokázání svého stáří legendu nepotřebuje.",
          zh: "布拉格现存最古老的建筑，建于约1080年——维谢赫拉德第一座无需借助传说、便能自证年代的建筑。",
        },
      },
      {
        slug: "basilika-sv-petra-pavla",
        relation: {
          en: "Founded in 1070 alongside the Vyšehrad chapter, one of the oldest institutions on the hill — though the twin-spired silhouette you actually see today is a 19th-century Neo-Gothic remake, not the original Romanesque building.",
          cz: "Založena roku 1070 spolu s vyšehradskou kapitulou, jednou z nejstarších institucí na kopci — ačkoli dvouvěžová silueta, kterou dnes vidíš, je novogotickou přestavbou z 19. století, ne původní románskou stavbou.",
          zh: "1070年与维谢赫拉德教士团一同创建——教士团是这座山丘上最古老的机构之一——不过你今天看到的那对双塔剪影，其实是19世纪新哥特式重建的结果，并非最初的罗马式建筑。",
        },
      },
      {
        slug: "romansky-most-vysehrad",
        relation: {
          en: "Older than the rotunda by a full generation — an 11th-century stone bridge quietly holding a strong claim to oldest of its kind in Central Europe.",
          cz: "O celou generaci starší než rotunda — kamenný most z 11. století, který si tiše drží silný nárok na titul nejstaršího svého druhu ve střední Evropě.",
          zh: "比圆形教堂还要早整整一代人——一座11世纪的石桥，静静地握着“中欧同类建筑中最古老”这一有力头衔。",
        },
      },
      {
        slug: "brana-spicka",
        relation: {
          en: "Vyšehrad's real fortifications, centuries after the legend — a 14th-century gate-fortress guarding the one side the cliffs didn't defend for free.",
          cz: "Skutečné vyšehradské opevnění, staletí po legendě — brána-pevnost ze 14. století, střežící tu jedinou stranu, kterou skály samy neubránily zdarma.",
          zh: "在传说过去几百年之后，维谢赫拉德真正拥有的防御工事——一座14世纪的堡垒式城门，守卫着唯一一处悬崖没有免费提供防护的方向。",
        },
      },
      {
        slug: "v-pevnosti-street-in-the-fortness-1783208618265",
        relation: {
          en: "The street tying the whole fortress together, running past its grandest surviving gates — a good reminder that Vyšehrad's real history is mostly Baroque, not legendary.",
          cz: "Ulice spojující celou pevnost dohromady, vedoucí kolem jejích nejokázalejších dochovaných bran — dobrá připomínka, že skutečná historie Vyšehradu je většinou barokní, ne legendární.",
          zh: "把整座要塞串联在一起的街道，沿途经过维谢赫拉德现存最壮观的几座城门——提醒着人们，这座要塞真正的历史大多来自巴洛克时期，而非传说。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vy%C5%A1ehrad",
  },
  {
    slug: "seven-legendary-dukes",
    era: "legends-origins",
    startYear: 800,
    year: {
      en: "c. 730 – 867 (seven dukes)",
      cz: "asi 730–867 (sedm bájných knížat)",
      zh: "约730年－867年（七位传说公爵）",
    },
    image: "/history/seven-dukes.webp",
    tone: "humorous",
    title: {
      en: "Seven Dukes and One Good Story",
      cz: "Sedm knížat a jeden pořádný příběh",
      zh: "七位公爵，一个像样的故事",
    },
    hookLine: {
      en: "With that battle won, Bohemia's chroniclers needed the family tree to keep going — so for the next century and a half, it does, in the thinnest possible sense.",
      cz: "Po vyhrané bitvě potřebovali čeští kronikáři, aby rodokmen nějak pokračoval — a tak dalších sto padesát let pokračuje, v tom nejtenčím možném smyslu.",
      zh: "打赢了那场仗之后，波希米亚的编年史家还得让家谱继续往下写——于是接下来的一个半世纪，家谱确实往下写了，只是写得薄得不能再薄。",
    },
    summary: {
      en: "Between the legendary founders and the first duke we can actually verify, Cosmas of Prague's 12th-century chronicle lists seven more rulers in a row — Nezamysl, Mnata, Vojen, Vnislav, Křesomysl, Neklan, and Hostivít, traditionally held to be Bořivoj's own father. Between them, they're credited with almost nothing: no battles, no buildings, no decisions worth recording, just names inherited by nineteenth-century histories that needed an unbroken bloodline connecting myth to fact. Some historians suspect the list is exactly that — padding, invented or half-remembered names stretched across roughly 137 years to make the family tree look continuous, at an average reign length just long enough to be barely plausible and not one day longer. The sole exception livening up this very long paragraph of nothing: a nobleman named Horymír, said to have ridden his horse Šemík off the cliffs of Vyšehrad to escape execution during Křesomysl's reign — a genuinely great story, undercut slightly by the fact that nobody wrote it down until a 16th-century chronicler with a well-earned reputation for making things up got to it first.",
      cz: "Mezi legendárními zakladateli a prvním knížetem, kterého už dokážeme skutečně doložit, uvádí Kosmova kronika z 12. století v řadě dalších sedm vládců — Nezamysla, Mnatu, Vojena, Vnislava, Křesomysla, Neklana a Hostivíta, tradičně považovaného za Bořivojova vlastního otce. Dohromady se jim nepřipisuje skoro nic: žádné bitvy, žádné stavby, žádná rozhodnutí hodná záznamu, jen jména, která si od nich devatenácté století vypůjčilo, protože potřebovalo nepřerušenou krevní linii spojující mýtus s fakty. Někteří historikové mají podezření, že seznam je přesně tohle — výplň, vymyšlená nebo napůl zapomenutá jména natažená přes zhruba 137 let, aby rodokmen vypadal souvisle, s průměrnou délkou vlády tak akorát věrohodnou a ani o den delší. Jedinou výjimkou, která tenhle dlouhý odstavec o ničem trochu oživí, je šlechtic jménem Horymír, jenž prý za vlády Křesomysla ujel na koni Šemíkovi z vyšehradských skal, aby unikl popravě — opravdu skvělý příběh, jen mírně pokažený tím, že ho nikdo nezapsal až do 16. století, kdy se k němu dostal kronikář s poctivě vydobytou pověstí, že si věci prostě vymýšlí.",
      zh: "在传说中的开国者与我们真正能够确证的第一位公爵之间，科斯马斯12世纪编年史又一口气列出了七位统治者——涅扎米斯尔、姆纳塔、沃因、弗尼斯拉夫、克热索米斯尔、涅克兰，以及霍斯提维特（传统上被认为是博日沃伊本人的父亲）。这七人加起来，几乎什么事迹都没留下：没有战役，没有建筑，没有一个值得记录的决定，只有一串被19世纪史书借用的名字——因为那时候的史家需要一条不间断的血脉，把神话和信史连接起来。有些历史学家怀疑，这份名单本身就是凑数：为了让家谱显得绵延不绝，硬是把虚构或半记半忘的名字拉长到大约137年，每人在位年限刚好长得勉强说得过去，绝不多留一天破绽。唯一为这段“什么都没有”的漫长叙述增添一点色彩的例外，是一位名叫霍雷米尔的贵族——据说他在克热索米斯尔在位期间，为了逃脱死刑，骑着自己的骏马舍米克从维谢赫拉德的悬崖一跃而下。这是个相当精彩的故事，只可惜稍微打了点折扣：因为直到16世纪，才有一位以“擅长编故事”闻名的编年史家把它记录下来。",
    },
    relatedLandmarks: [
      {
        slug: "vysehrad-wall-walkway",
        relation: {
          en: "The cliff-top fortress walls Horymír's horse Šemík is said to have leapt from — the one memorable scene in this whole stretch of otherwise blank history.",
          cz: "Skalní hradby pevnosti, z nichž prý skočil Horymírův kůň Šemík — jediná zapamatovatelná scéna z celého tohoto jinak prázdného úseku dějin.",
          zh: "霍雷米尔的坐骑舍米克据说就是从这段悬崖峭壁上的城墙一跃而下的——这是这整段近乎空白的历史里，唯一让人记得住的一幕。",
        },
      },
      {
        slug: "pahorek-krlis",
        relation: {
          en: "Neklan's own legend — a warrior's mound from his war against the Lučané, its story sourced from a manuscript later exposed as a forgery, sitting on a burial site that's genuinely ancient anyway.",
          cz: "Neklanova vlastní legenda — mohyla bojovníka z jeho války proti Lučanům, jejíž příběh čerpá z rukopisu, který se později ukázal jako falzum, a přitom leží na pohřebišti, které je opravdu prastaré.",
          zh: "涅克兰自己的传说——他对抗卢查内人的战争中一位战士的坟冢，故事出自一份后来被揭穿为伪作的手稿，而坟冢本身却坐落在一处确实古老的墓地之上。",
        },
      },
      {
        slug: "kubisticky-dum-neklanova",
        relation: {
          en: "A world-class piece of Cubist architecture on a street named for Neklan — proof this list of placeholder names outlived the men and gave its address to a masterpiece instead.",
          cz: "Světová špička kubistické architektury na ulici pojmenované po Neklanovi — důkaz, že tenhle seznam jmen do počtu přežil samotné muže a svou adresu nakonec věnoval mistrovskému dílu.",
          zh: "一座世界级的立体主义建筑杰作，坐落在以涅克兰命名的街道上——证明这份凑数的名单，最终比这些男人本身活得更久，还把自己的门牌地址留给了一件传世杰作。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/K%C5%99esomysl",
  },
  {
    slug: "borivoj-first-duke",
    era: "legends-origins",
    startYear: 870,
    year: {
      en: "c. 870 (documented history begins)",
      cz: "kolem roku 870 (začátek doložených dějin)",
      zh: "约870年（信史的开端）",
    },
    tone: "humorous",
    title: {
      en: "Where the Legend Ends",
      cz: "Kde končí legenda",
      zh: "传说结束的地方",
    },
    hookLine: {
      en: "Then, finally, the fog lifts — one of these vague names turns out to be a real person, with a real date, and a very real foreign boss.",
      cz: "Pak se konečně mlha rozplyne — jedno z těch mlhavých jmen se ukáže být skutečnou osobou, se skutečným datem a velmi skutečným zahraničním pánem.",
      zh: "然后，迷雾终于散去——这些模糊的名字里，终于有一个变成了真实存在的人，有真实的年代，还有一位非常真实的外国宗主。",
    },
    summary: {
      en: "Meet Bořivoj I, the first Duke of Bohemia we can actually pin down with real sources — the true starting point of the Přemyslid dynasty as a documented royal house, as opposed to the folk-tale version Libuše and Přemysl represent. His rise wasn't exactly a triumph of independence, though: Bohemia in the 870s was a junior partner to its much larger neighbour, Great Moravia, and Bořivoj held his dukedom only because Great Moravia's own ruler, Svatopluk I, recognised him as a loyal vassal around 872. Svatopluk didn't just grant him a title, either — he sent Bishop Methodius, the Byzantine missionary already converting Moravia, west to start working on Bohemia next.",
      cz: "Seznamte se s Bořivojem I., prvním českým knížetem, kterého už dokážeme doložit skutečnými prameny — opravdovým počátkem přemyslovské dynastie coby doloženého panovnického rodu, na rozdíl od pohádkové verze, kterou představují Libuše a Přemysl. Jeho nástup ale nebyl žádným triumfem samostatnosti: Čechy byly v 70. letech 9. století jen menším partnerem svého mnohem většího souseda, Velké Moravy, a Bořivoj své knížectví držel jen díky tomu, že ho kolem roku 872 uznal za věrného vazala velkomoravský vládce Svatopluk I. Svatopluk mu přitom nedal jen titul — poslal na západ i byzantského misionáře biskupa Metoděje, který už obracel na víru Moravu, aby se teď pustil do Čech.",
      zh: "认识一下博日沃伊一世，第一位真正能被可靠史料确证的波希米亚公爵——普热米斯尔王朝作为一个有据可查的统治家族，真正意义上的起点，而不再是莉布谢与普热米斯尔所代表的那个民间传说版本。不过，他的崛起可算不上什么独立的凯歌：9世纪70年代的波希米亚，只是邻近那个庞大得多的大摩拉维亚帝国麾下的一个小伙伴，博日沃伊之所以能保住公爵之位，全靠大摩拉维亚统治者斯瓦托普鲁克一世大约在872年承认他为忠诚的附庸。斯瓦托普鲁克给他的可不只是一个头衔——他还派出了已经在摩拉维亚传教的拜占庭传教士美多德主教，西行前往波希米亚，接着开始下一步的传教工作。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bo%C5%99ivoj_I_of_Bohemia",
  },
  {
    slug: "borivoj-conversion-and-exile",
    era: "legends-origins",
    startYear: 883,
    year: {
      en: "883–885",
      cz: "883–885",
      zh: "883年－885年",
    },
    tone: "humorous",
    title: {
      en: "Baptized, Deposed, Restored",
      cz: "Pokřtěn, svržen, navrácen",
      zh: "受洗、被逐、复位",
    },
    hookLine: {
      en: "Methodius didn't waste time once he arrived — and what he started nearly cost Bořivoj his throne.",
      cz: "Metoděj po příjezdu neztrácel čas — a to, co tím spustil, stálo Bořivoje málem trůn.",
      zh: "美多德一到波希米亚就毫不拖延地动了手——而他点燃的这把火，几乎让博日沃伊丢了王位。",
    },
    summary: {
      en: "Around 883, Methodius baptized Bořivoj and his wife Ludmila, making them the first Christian rulers in the family line — a milestone that should have been simple good news. Instead, it nearly ended Bořivoj's rule entirely: Bohemia's pagan nobility saw the new religion as a foreign imposition threatening their old customs and authority, and a faction backing his own kinsman Strojmír rose up and drove him out of the country, forcing him into hiding at a string of remote fortresses. He got his dukedom back in 885, but only with Moravian troops behind him — Svatopluk's soldiers helped Bořivoj crush the pagan revolt and retake control, a debt to his overlord that would soon matter a great deal.",
      cz: "Kolem roku 883 pokřtil Metoděj Bořivoje i jeho manželku Ludmilu, čímž se stali prvními křesťanskými vládci v rodové linii — milník, který měl být jednoduše dobrou zprávou. Místo toho Bořivojovu vládu málem úplně ukončil: pohanská šlechta v Čechách vnímala nové náboženství jako cizí vnucenou věc ohrožující staré zvyky a autority, a frakce podporující jeho vlastního příbuzného Strojmíra povstala a vyhnala ho ze země, což ho donutilo skrývat se na řadě vzdálených hradišť. Své knížectví získal zpět v roce 885, ale jen s pomocí moravského vojska — Svatoplukovi vojáci pomohli Bořivojovi rozdrtit pohanské povstání a znovu se chopit moci, dluh vůči svému pánovi, na kterém brzy hodně záleželo.",
      zh: "约在883年，美多德为博日沃伊和他的妻子鲁德米拉施洗，使他们成为这一家族世系中第一代基督徒统治者——这本该是一件单纯的喜事。结果却几乎彻底终结了博日沃伊的统治：波希米亚的异教贵族把这个新信仰视为外来强加之物，认为它威胁到了旧有的习俗与权威，一股支持他本家亲属斯特罗伊米尔的势力揭竿而起，将他逐出国境，迫使他躲藏在一连串偏远的要塞据点之中。直到885年，他才夺回公爵之位——但靠的是摩拉维亚的军队：斯瓦托普鲁克的士兵帮助博日沃伊镇压了这场异教叛乱、重新掌权，而这份欠下宗主的人情，很快就变得举足轻重。",
    },
    relatedLandmarks: [
      {
        slug: "levy-hradec",
        relation: {
          en: "The church Bořivoj built here around 883–884, right after his baptism — the first Christian church on Bohemian soil, and ground zero for the backlash that briefly cost him his throne.",
          cz: "Kostel, který tu Bořivoj postavil kolem let 883–884, hned po svém křtu — první křesťanský kostel na českém území, a zároveň místo, kde vznikl odpor, jenž ho na čas stál trůn.",
          zh: "博日沃伊在受洗后不久、约883至884年间在此建造的教堂——波希米亚土地上第一座基督教教堂，也是那场一度让他丢掉王位的反弹浪潮的策源地。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bo%C5%99ivoj_I_of_Bohemia",
  },
  {
    slug: "founding-of-prague-castle",
    era: "legends-origins",
    startYear: 886,
    year: {
      en: "c. 880s (exact date disputed)",
      cz: "80. léta 9. století (přesné datum sporné)",
      zh: "9世纪80年代（确切年份尚有争议）",
    },
    tone: "humorous",
    title: {
      en: "The Birth of Prague Castle",
      cz: "Zrod Pražského hradu",
      zh: "布拉格城堡的诞生",
    },
    hookLine: {
      en: "Back in power, Bořivoj made a decision that would outlast every other thing he ever did: he moved house.",
      cz: "Zpátky u moci učinil Bořivoj rozhodnutí, které přežilo úplně všechno ostatní, co kdy udělal: přestěhoval se.",
      zh: "重新掌权后，博日沃伊做出了一个远比他其他所有作为都更长久留存下来的决定：他搬家了。",
    },
    summary: {
      en: "Sometime in the 880s — sources disagree on whether it was Bořivoj himself or, more likely, his son Spytihněv a decade or so later — the Přemyslid seat of power shifted from the old fort at Levý Hradec to a rocky ridge overlooking the Vltava, and Prague Castle began. The very first building raised there was a modest Church of the Virgin Mary; the far more famous St. George's and St. Vitus churches wouldn't be added for another two generations. Nobody at the time could have known it, but this unglamorous administrative move would end up anchoring the most important address in Czech history for the next eleven hundred years and counting.",
      cz: "Někdy v 80. letech 9. století — prameny se neshodnou, zda to udělal sám Bořivoj, nebo spíš, o dekádu později, jeho syn Spytihněv — se přemyslovské sídlo přesunulo ze starého hradiště na Levém Hradci na skalnatý hřeben nad Vltavou, a začal tak vznikat Pražský hrad. Úplně první stavbou, která tu vyrostla, byl skromný kostel Panny Marie; mnohem slavnější kostely svatého Jiří a svatého Víta přibyly až o dvě generace později. Nikdo tehdy netušil, že tenhle nenápadný administrativní přesun na dalších jedenáct set let a stále se počítajících ukotví to nejdůležitější místo v českých dějinách.",
      zh: "9世纪80年代的某个时候——史料对此说法不一，究竟是博日沃伊本人所为，还是十年左右之后由他的儿子斯皮蒂赫涅夫完成——普热米斯尔王朝的权力中心，从利维赫拉德茨的旧要塞，迁到了俯瞰伏尔塔瓦河的一道岩石山脊上，布拉格城堡由此开始成形。这里最早建起的建筑，只是一座朴素的圣母教堂；更为著名的圣乔治教堂与圣维特教堂，要再过两代人才会出现。当时谁都没能料到，这次看似平淡无奇的行政迁址，竟会在接下来的一千一百多年里——而且还在继续——稳稳占据捷克历史上最重要的那个地址。",
    },
    relatedLandmarks: [
      {
        slug: "levy-hradec",
        relation: {
          en: "The old seat this move left behind — Bořivoj's power base before Prague Castle existed at all.",
          cz: "Staré sídlo, které tímto přesunem zůstalo opuštěné — Bořivojova mocenská základna dřív, než Pražský hrad vůbec existoval.",
          zh: "这次迁址所抛下的旧日据点——早在布拉格城堡还未存在之前，这里就是博日沃伊的权力根据地。",
        },
      },
      {
        slug: "st-georges-basilica",
        relation: {
          en: "Not part of the original founding — it was added a generation later — but the oldest surviving piece of the castle complex this move set in motion.",
          cz: "Nebyla součástí původního založení — přibyla až o generaci později — ale je nejstarší dochovanou částí hradního komplexu, který tento přesun uvedl do pohybu.",
          zh: "并非最初奠基时就有的建筑——它是晚了一代人才加建的——却是这次迁址所开启的整座城堡建筑群中，现存最古老的一部分。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Prague_Castle",
  },
  {
    slug: "bohemia-independence-895",
    era: "legends-origins",
    startYear: 895,
    year: {
      en: "895 (formal break completed by 898)",
      cz: "895 (definitivní odtržení dokončeno do roku 898)",
      zh: "895年（正式脱离于898年完成）",
    },
    tone: "humorous",
    title: {
      en: "Cutting Loose from Great Moravia",
      cz: "Odpoutání se od Velké Moravy",
      zh: "脱离大摩拉维亚",
    },
    hookLine: {
      en: "Bořivoj died around 889 still answering to Moravia — it took his son to actually do something about it.",
      cz: "Bořivoj zemřel kolem roku 889 stále jako moravský vazal — bylo na jeho synovi, aby s tím konečně něco udělal.",
      zh: "博日沃伊约于889年去世时，仍是大摩拉维亚的附庸——真正对此采取行动的，是他的儿子。",
    },
    summary: {
      en: "Bořivoj's sons were still minors when he died, so Great Moravia's Svatopluk I simply took over as regent — Bohemia stayed a dependency either way. Everything changed when Svatopluk himself died in 894 and his own sons fell to fighting over the inheritance: Bořivoj's son Spytihněv, now old enough to rule in his own right, saw his opening. In 895 he travelled to the Imperial Diet at Regensburg and swore loyalty directly to the East Frankish king Arnulf instead, and within a few more years of allying with Bavaria against a crumbling Great Moravia, Bohemia had shaken off its old overlord for good — the closest thing this whole story has to an actual founding of an independent Bohemian state.",
      cz: "Bořivojovi synové byli v době jeho smrti ještě nezletilí, takže se velkomoravský Svatopluk I. jednoduše ujal regentství — Čechy tak zůstaly závislým územím tak jako tak. Všechno se změnilo, když v roce 894 zemřel sám Svatopluk a jeho vlastní synové se pustili do boje o dědictví: Bořivojův syn Spytihněv, už dost starý na to, aby vládl sám za sebe, viděl svou příležitost. V roce 895 odcestoval na říšský sněm do Řezna a přísahal věrnost přímo východofranskému králi Arnulfovi, a během několika dalších let, kdy se spojil s Bavorskem proti rozpadající se Velké Moravě, se Čechy definitivně zbavily svého starého pána — což je ze všech částí tohoto příběhu nejblíž tomu, čemu se dá říkat skutečné založení samostatného českého státu.",
      zh: "博日沃伊去世时，他的儿子们尚未成年，于是大摩拉维亚的斯瓦托普鲁克一世干脆自任摄政——不管怎样，波希米亚仍是附庸。直到894年斯瓦托普鲁克本人去世、他的几个儿子为争夺继承权大打出手，局面才彻底改变：博日沃伊之子斯皮蒂赫涅夫，此时已经足以独当一面，抓住了这个机会。895年，他前往雷根斯堡帝国议会，转而直接向东法兰克国王阿努尔夫宣誓效忠，此后又用了几年时间与巴伐利亚结盟，共同对抗日渐崩溃的大摩拉维亚，波希米亚终于彻底摆脱了昔日的宗主——这是整个故事里，最接近“波希米亚独立建国”这一说法的一刻。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Spytihn%C4%9Bv_I_of_Bohemia",
  },
  {
    slug: "st-ludmila-martyrdom",
    era: "legends-origins",
    startYear: 921,
    year: {
      en: "883 (baptism) – 921 (martyrdom)",
      cz: "883 (křest) – 921 (mučednická smrt)",
      zh: "883年（受洗）－921年（殉道）",
    },
    image: "/history/ludmila.webp",
    tone: "humorous",
    title: {
      en: "St. Ludmila — Christianization & Martyrdom",
      cz: "Svatá Ludmila — christianizace a mučednictví",
      zh: "圣鲁德米拉——基督教化与殉道",
    },
    hookLine: {
      en: "Spytihněv got Bohemia its independence — but back home, his own mother was about to become the family's next headline, for far darker reasons.",
      cz: "Spytihněv Čechám vydobyl samostatnost — jenže doma mezitím měla jeho vlastní matka co nevidět nastoupit jako další rodinná titulní zpráva, tentokrát z mnohem temnějších důvodů.",
      zh: "斯皮蒂赫涅夫为波希米亚赢得了独立——可与此同时，在家里，他自己的母亲即将成为这个家族的下一条头条新闻，只是原因要黑暗得多。",
    },
    summary: {
      en: "Ludmila outlived Bořivoj by decades, and by the time her grandson Wenceslas was a child, being Bohemia's first Christian consort had made her one thing above all: enormously influential over the boy in line to rule next. That's exactly what turned her into a target. In 921, locked in a bitter dispute with her own daughter-in-law Drahomíra over who would raise young Wenceslas, Ludmila was strangled on Drahomíra's orders — making her Bohemia's first native saint, and, rather awkwardly, the family's first recorded political assassination.",
      cz: "Ludmila přežila Bořivoje o desítky let, a v době, kdy byl její vnuk Václav ještě dítě, z ní to, že byla první křesťanskou kněžnou v Čechách, udělalo především jedno: ženu s obrovským vlivem na chlapce, který měl jednou vládnout. A přesně to z ní udělalo terč. V roce 921, uprostřed hořkého sporu s vlastní snachou Drahomírou o to, kdo bude vychovávat mladého Václava, dala Drahomíra Ludmilu uškrtit. Ludmila se tak stala první domácí svatou v Čechách a — poněkud trapně pro rodinu — zároveň první doloženou politickou vraždou v jejích dějinách.",
      zh: "鲁德米拉比博日沃伊多活了几十年，到她孙子瓦茨拉夫还是个孩子的时候，作为波希米亚第一位基督徒公爵夫人的身份，让她首先意味着一件事：对这位未来的统治者拥有巨大的影响力。而这，恰恰让她成了众矢之的。921年，在与自己儿媳德拉霍米拉围绕由谁抚养年幼的瓦茨拉夫而爆发的激烈争执中，德拉霍米拉下令将鲁德米拉勒死。鲁德米拉由此成为波希米亚本土第一位圣徒——同时也颇为尴尬地，成了这个家族史上第一起有记载的政治暗杀。",
    },
    relatedLandmarks: [
      {
        slug: "kaple-sv-ludmily",
        relation: {
          en: "A chapel dedicated to the saint — not the site of her death, but part of the long afterlife of devotion the murder unexpectedly kicked off.",
          cz: "Kaple zasvěcená této světici — nikoli místo její smrti, ale součást dlouhé posmrtné úcty, kterou vražda nečekaně rozpoutala.",
          zh: "一座献给这位圣徒的小教堂——并非她遇害的地点，而是这场谋杀意外催生的漫长信仰追思的一部分。",
        },
      },
      {
        slug: "zricenina-hradu-tetin",
        relation: {
          en: "The actual stronghold where Ludmila lived out her final years and was strangled in 921 — the real ground behind the story.",
          cz: "Skutečné sídlo, kde Ludmila prožila poslední léta a v roce 921 byla uškrcena — skutečná půda, na které se příběh odehrál.",
          zh: "鲁德米拉度过晚年、并于921年在此被勒死的真实据点——这个故事真正发生的土地。",
        },
      },
      {
        slug: "kriz-svate-ludmily-tetin",
        relation: {
          en: "Local tradition marks this modest wayside cross as where the assassins hid, waiting for their moment.",
          cz: "Podle místní tradice právě u tohoto skromného kříže čekali vrazi ukrytí na svou příležitost.",
          zh: "当地传说称，刺客当年正是躲藏在这座朴素的路边十字架附近，等待动手的时机。",
        },
      },
      {
        slug: "kostel-sv-jana-nepomuckeho-tetin",
        relation: {
          en: "Tradition holds this church started life as the wooden funeral chapel raised directly over Ludmila's first grave.",
          cz: "Podle tradice tento kostel vznikl z dřevěné pohřební kaple postavené přímo nad Ludmiliným prvním hrobem.",
          zh: "相传这座教堂的前身，正是一座直接建在鲁德米拉最初墓地之上的木造殡葬礼拜堂。",
        },
      },
      {
        slug: "kostel-svate-ludmily-tetin",
        relation: {
          en: "Tetín's main pilgrimage church, holding under glass the very stone she's said to have died on.",
          cz: "Hlavní tetínský poutní kostel, který pod sklem uchovává kámen, na němž prý Ludmila zemřela.",
          zh: "泰钦的主要朝圣教堂，玻璃罩下保存着据说是她死时所倚的那块石头。",
        },
      },
      {
        slug: "st-georges-basilica",
        relation: {
          en: "Where Duke Wenceslas had his grandmother's remains reburied in 925 — the resting place her murder site never got to be.",
          cz: "Kam kníže Václav v roce 925 nechal přenést ostatky své babičky — místo posledního odpočinku, kterým se místo vraždy nikdy nestalo.",
          zh: "瓦茨拉夫公爵于925年将祖母遗骸迁葬于此——这才是她最终的安息之地，而非当年遇害的现场。",
        },
      },
      {
        slug: "socha-sv-ludmily-karluv-most",
        relation: {
          en: "A copy of the original Braun-workshop statue, showing Ludmila teaching her grandson Wenceslas to read — with the very veil she was strangled with still in her hand.",
          cz: "Kopie původní sochy z dílny Matyáše Bernarda Brauna, zobrazující Ludmilu, jak učí vnuka Václava číst — se závojem, jímž byla uškrcena, stále v ruce.",
          zh: "布劳恩工作坊原作的复制品，描绘鲁德米拉教导孙子瓦茨拉夫认字的场景——她手中仍握着当年勒死自己的那条头纱。",
        },
      },
      {
        slug: "namesti-miru",
        relation: {
          en: "The only Basilica of St. Ludmila in the world — a soaring 19th-century tribute to a woman murdered a thousand years before it was built.",
          cz: "Jediná bazilika svaté Ludmily na světě — velkolepý devatenáctistoletý hold ženě, zavražděné tisíc let předtím, než tahle stavba vůbec vznikla.",
          zh: "全世界唯一一座圣鲁德米拉宗座圣殿——一座19世纪的宏伟建筑，献给一位在它建成整整一千年前就已遇害的女性。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Ludmila_of_Bohemia",
  },
  {
    slug: "st-wenceslas-murder",
    era: "legends-origins",
    startYear: 935,
    year: {
      en: "935 (traditional date)",
      cz: "935 (tradičně uváděný rok)",
      zh: "935年（传统纪年）",
    },
    tone: "humorous",
    title: {
      en: "St. Wenceslas — The Good King and His Murder",
      cz: "Svatý Václav — dobrý kníže a jeho vražda",
      zh: "圣瓦茨拉夫——好公爵与他的谋杀案",
    },
    hookLine: {
      en: "And the boy at the center of that custody dispute? He grew up — and inherited the family's talent for dying at the hands of a relative.",
      cz: "A ten chlapec, o kterého se v tom sporu o výchovu bojovalo? Vyrostl — a zdědil po rodině talent umírat rukou vlastního příbuzného.",
      zh: '而那场监护权之争的主角，那个孩子呢？他长大了——也继承了家族"死于亲人之手"的这门"手艺"。',
    },
    summary: {
      en: 'That "young future ruler" fought over in the last chapter was Wenceslas — Ludmila\'s own grandson, partly raised by her, and later immortalised worldwide in a Christmas carol as "Good King Wenceslas." As duke, he leaned heavily on the Church and kept an uneasy peace with Bohemia\'s powerful neighbours, choices his own brother Boleslav despised. In 935, Boleslav had him murdered at a church door in the town now called Stará Boleslav — then spent the rest of his long reign quietly rebuilding his dead brother\'s reputation into that of Bohemia\'s patron saint, a title the country has never let go of since.',
      cz: 'Ten „mladý budoucí vládce" z minulé kapitoly byl Václav — Ludmilin vlastní vnuk, kterého zčásti vychovala ona sama, a později po celém světě zvěčněný ve vánoční koledě jako „Good King Wenceslas". Jako kníže se silně opíral o církev a udržoval křehký mír s mocnými sousedy Čech, což jeho vlastní bratr Boleslav nesnášel. V roce 935 nechal Boleslav bratra zavraždit u dveří kostela v dnešní Staré Boleslavi — a zbytek své dlouhé vlády pak strávil tichým budováním pověsti svého mrtvého bratra jako zemského patrona, titulu, kterého se země od té doby nikdy nevzdala.',
      zh: '上一章里那位"年幼的未来统治者"，正是瓦茨拉夫——鲁德米拉的亲孙子，部分由她一手带大，后来更是被写进一首圣诞颂歌、传遍全世界，被永远铭记为"好国王温塞斯拉斯"。作为公爵，他大力扶持教会，并与波希米亚周边强邻维持着一段并不稳固的和平，而这些做法都让他的亲弟弟博莱斯拉夫深恶痛绝。935年，博莱斯拉夫派人在如今旧博莱斯拉夫的教堂门口将他杀害——此后，他用自己漫长统治的余下岁月，悄悄把这位亡兄的形象重塑为波希米亚的守护圣人，而这个称号，这个国家自此再也没有放弃过。',
    },
    relatedLandmarks: [
      {
        slug: "stara-boleslav",
        relation: {
          en: "Where it happened — the church door, the ambush, the whole unhappy family reunion, still marked and visited nearly eleven centuries later.",
          cz: "Místo, kde se to stalo — dveře kostela, přepadení, celé to nešťastné rodinné setkání, dodnes vyznačené a navštěvované téměř jedenáct set let poté.",
          zh: "事发之地——教堂门口、伏击现场、这场并不愉快的家庭重逢的全部场景，近十一个世纪后的今天仍标记完好、供人探访。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Wenceslaus_I,_Duke_of_Bohemia",
  },
];

async function run() {
  await connectDB();
  let added = 0,
    updated = 0,
    failed = 0;

  for (const data of historyEvents) {
    try {
      const result = await HistoryEvent.findOneAndUpdate(
        { slug: data.slug },
        { $setOnInsert: data },
        { upsert: true, new: true },
      );
      const wasNew = result.createdAt.getTime() === result.updatedAt.getTime();
      if (wasNew) {
        console.log(`ADD    ${data.slug}`);
        added++;
      } else {
        console.log(`SKIP   ${data.slug}`);
      }
    } catch (err) {
      console.log(`FAIL   ${data.slug} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${added} added, ${updated} updated, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

run();
