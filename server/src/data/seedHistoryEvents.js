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
      en: "Long before anyone thought to write anything down, people were already living on the hills and riverbanks where Prague would one day stand — just farming, hunting, getting on with life. The first people we actually know by name showed up around 500 BC: a Celtic tribe called the Boii, who liked the place enough to name the whole region after themselves — Bohemia literally means 'land of the Boii,' and the name stuck around for two thousand years after the Boii themselves didn't.\n\nThen came the Germanic tribes, who pushed the Boii out and moved in — only to pack up themselves a few centuries later and head south toward the Danube, as if the whole region had a 'no long-term residents' rule. That left the land wide open just as a new group came wandering in from the west: Slavic settlers, quietly arriving with no idea they were about to become the ancestors of an entire nation — and the unwitting stars of the legend that's about to start.",
      cz: "Dávno předtím, než si kdokoli dal tu práci něco zapisovat, žili lidé na kopcích a březích řek, kde jednou bude stát Praha — prostě hospodařili, lovili, žili si svůj život. První lidé, které známe jménem, se tu objevili kolem roku 500 př. n. l.: keltský kmen Bójů, kterému se tu zalíbilo natolik, že po sobě pojmenoval celý kraj — Bohemia doslova znamená „země Bójů“, a jméno vydrželo dva tisíce let poté, co sami Bójové dávno zmizeli.\n\nPak přišly germánské kmeny, které Bóje vytlačily a usadily se samy — jenže o pár staletí později se sbalily zase ony a vydaly se na jih k Dunaji, jako by v kraji platilo pravidlo „žádné trvalé bydliště“. Země tak zůstala volná právě ve chvíli, kdy od západu přicházela nová skupina: slovanští osadníci, kteří netušili, že se právě stávají předky celého národa — a nic netušícími hvězdami legendy, která se za chvíli rozjede.",
      zh: "早在有人想起要把什么事情记下来之前，就已经有人住在未来布拉格所在的那片山丘和河岸边——种地、打猎，过着自己的日子。我们能叫得出名字的第一批人，大约在公元前500年出现：一支凯尔特波伊部落，他们喜欢这片土地，干脆把整个地区都用自己的名字命名——波希米亚这个名字，字面意思就是波伊人的土地，而在波伊人自己早已消失两千年后，这个名字却一直沿用了下来。\n\n接着日耳曼部落来了，把波伊人赶走，自己住了进去——结果几个世纪后，他们自己也收拾行李南迁到多瑙河流域，仿佛这片土地立下了一条不成文的规矩：谁也别想长住。这片土地就这样刚好空了出来，而恰在此时，一支新的族群从西边缓缓而来：斯拉夫定居者，他们完全没有意识到，自己即将成为一整个民族的祖先——也将成为接下来这个传说里，浑然不知情的主角。",
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
      en: "By the time our story reaches the 700s, the descendants of those wandering Slavic settlers had a ruler: a woman named Libuše, said to be wise enough to settle any dispute and — according to the old chronicles — occasionally able to see the future. She made most of her prophecies from her own castle at Libušín in central Bohemia, a real hillfort archaeologists have confirmed was already inhabited well before her time.\n\nOne of those prophecies was about Prague itself: in a vision, Libuše reportedly saw 'a great city whose glory will reach the stars' rising on a steep cliff above the Vltava, right where a man was carving a threshold — prah, in Czech — for his new house. That city, she declared, would be called Praha: 'princes and dukes will bow before its threshold,' and the whole world would come to know its name. The hill she pointed to became Prague Castle, and ever since, the city has enjoyed reminding every visitor that even its own name was predicted in advance — never mind that nobody can actually prove Libuše existed.",
      cz: "Než se náš příběh dostane do 8. století, potomci oněch bloudících slovanských osadníků už měli vládkyni: ženu jménem Libuše, o níž se říkalo, že je moudrá dost na to, aby rozsoudila jakýkoli spor, a podle starých kronik dokonce občas dokázala nahlédnout do budoucnosti. Většinu svých proroctví pronesla na vlastním hradišti Libušín ve středních Čechách — skutečném hradišti, o kterém archeologové potvrdili, že bylo osídlené už dávno před jejími časy.\n\nJedno z těch proroctví se týkalo přímo Prahy: ve vidění Libuše prý spatřila „veliké město, jehož sláva se dotkne hvězd“, jak povstává na strmém skalním srázu nad Vltavou, přesně v místě, kde nějaký muž právě vytesával práh svého nového domu. Tomu městu prý dala jméno Praha — „knížata a vévodové se budou před jeho prahem klanět“ a celý svět jednou pozná jeho jméno. Tím kopcem se stal Pražský hrad, a město si od té doby rádo připomíná, že dokonce i jeho vlastní jméno bylo předpovězeno předem — bez ohledu na to, zda vůbec někdo dokáže, že Libuše skutečně existovala.",
      zh: '当我们的故事来到8世纪时，那些四处迁徙的斯拉夫定居者的后代，已经有了一位统治者：一位名叫莉布谢的女性，据说她聪明到足以裁决任何争端，而根据古老的编年史记载，她偶尔还能预见未来。她的大部分预言，都是在自己位于中波希米亚的莉布新城堡中说出的——那是一座真实的古堡遗址，考古学家已经证实，早在她的时代之前这里就已经有人居住。\n\n其中一则预言，正是关于布拉格本身：据说莉布谢曾在异象中看见"一座伟大的城市，其荣耀将直抵星辰"，矗立在伏尔塔瓦河畔一处险峻的悬崖上——就在那个地方，一名男子正为自己的新房凿刻门槛，捷克语称之为"prah"。她宣告，那座城市将被命名为布拉格："王公贵族都将在它的门槛前躬身行礼"，而全世界终将知晓它的名字。她所指的那座山丘，后来成了布拉格城堡，而这座城市从此以后，一直乐此不疲地提醒每一位访客：就连自己的名字，都是被预言过的——尽管没人能证明莉布谢真的存在过。',
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
      en: "Here's the catch about being a female ruler in the 8th century: plenty of people weren't thrilled about it, no matter how good your prophecies were. So when Libuše's subjects started grumbling that she needed a husband to rule properly, she reportedly just... already knew who it would be.\n\nShe sent her horse off alone, and it came back leading a farmer named Přemysl, found mid-plough in a field, wearing plain leather sandals, entirely unaware his life was about to change. He left the oxen standing in the furrow, married Libuše, and became the founder of a dynasty — the Přemyslids — that would rule Bohemia, on and off, for the next five hundred years. And in a nice touch, the family reportedly kept his old sandals and farm tools in the royal treasury forever, just to remember where they came from.",
      cz: "V tom je ten háček s ženskou vládkyní v 8. století: spoustě lidí se to nezamlouvalo, ať byla proroctví sebelepší. Když si tedy Libušini poddaní začali stěžovat, že by měla mít po boku manžela, který bude vládnout pořádně, prý už dopředu věděla, kdo to bude.\n\nPoslala svého koně samotného, a ten se vrátil s rolníkem jménem Přemysl, nalezeným při orání pole, v obyčejných kožených sandálech, naprosto netušícím, že se mu právě mění život. Nechal voly stát uprostřed brázdy, oženil se s Libuší a stal se zakladatelem dynastie — Přemyslovců —, která pak s přestávkami vládla Čechám dalších pět set let. A jako pěkný detail navíc rod prý navždy uchovával jeho staré sandály a nářadí v knížecí pokladnici, jen aby nezapomněl, odkud vzešel.",
      zh: "这就是8世纪女性统治者的麻烦所在：不管你的预言有多准，总有人不买账。于是，当莉布谢的臣民开始抱怨她该有个丈夫来好好治理国家时，据说她早就心中有数了。\n\n她放开自己的马，让它独自离开，结果马带回来一位农夫——普热米斯尔，当时正在田里犁地，脚上穿着一双朴素的皮凉鞋，完全不知道自己的人生即将天翻地覆。他把牛留在半耕的田垄间，迎娶了莉布谢，成为了此后断断续续统治波希米亚长达五百年的普热米斯尔王朝的开创者。而作为一个有趣的细节，据说这个家族此后一直把他那双旧凉鞋和农具珍藏在王室宝库里，就是为了不忘记自己从哪里出身。",
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
      en: "Libuše's death didn't go smoothly. According to legend, the women of her old court weren't ready to hand power over to Přemysl and his male successors, so under a leader named Vlasta — said to have been one of Libuše's closest confidantes — they moved out entirely and raised their own rival stronghold, Děvín, on a ridge facing Vyšehrad across the river.\n\nWhat followed was several years of ambushes and standoffs, capped by one genuinely wild trick: a warrior named Šárka, acting on Vlasta's orders, let herself be chained to a tree as bait, luring a lovestruck enemy commander and his soldiers straight into a fatal trap. Vlasta herself didn't outlast the war she'd started — she was killed leading a final assault on Vyšehrad, and with Děvín burned to the ground behind her, the whole experiment in women's rule came to an end. The men eventually won the war — but lost the naming rights, since the valley where Šárka's trap played out is still called Šárka to this day.",
      cz: "Libušina smrt neproběhla hladce. Podle legendy se ženy z jejího bývalého dvora nechtěly smířit s tím, že moc přejde na Přemysla a jeho mužské nástupce, a tak se pod vedením ženy jménem Vlasta — údajně jedné z Libušiných nejbližších důvěrnic — úplně odstěhovaly a na hřebeni naproti Vyšehradu si přes řeku postavily vlastní soupeřící pevnost, Děvín.\n\nNásledovalo několik let přepadů a patových situací, korunovaných jedním opravdu šíleným trikem: bojovnice Šárka se z Vlastina rozkazu nechala jako návnada přivázat ke stromu a do smrtelné pasti tak vlákala zamilovaného nepřátelského velitele i jeho vojáky. Sama Vlasta válku, kterou rozpoutala, nepřežila — padla při posledním útoku na Vyšehrad, a s Děvínem vypáleným do základů skončil celý experiment se ženskou vládou. Muži válku nakonec vyhráli — ale prohráli právo na pojmenování, protože údolí, kde se Šárčina léčka odehrála, se dodnes jmenuje Šárka.",
      zh: "莉布谢的死并不平静。据传说，她昔日宫廷中的女性并不甘心把权力交给普热米斯尔和他之后的男性继承人，于是在一位名叫弗拉斯塔的女子率领下——据说她是莉布谢最亲近的密友之一——她们干脆彻底搬离，在隔河正对维谢赫拉德的一道山脊上，修建了属于自己的对立堡垒：女儿堡。\n\n随之而来的是长达数年的伏击与对峙，其中最疯狂的一招，莫过于女战士沙尔卡：她奉弗拉斯塔之命，自愿被锁在树上充当诱饵，把一位为她倾心的敌方指挥官连同他的士兵，一起引入了死亡陷阱。弗拉斯塔本人却没能活过这场由她挑起的战争——她在对维谢赫拉德发起的最后一次进攻中阵亡，女儿堡也随之被付之一炬，女性统治的这场实验就此终结。男人们最终打赢了这场战争——却输掉了命名权，因为沙尔卡设下埋伏的那道山谷，至今仍然叫作沙尔卡。",
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
      en: "So where exactly did all this ruling happen? Ask nineteenth-century Czech storytellers and they'll point confidently at Vyšehrad, a dramatic rocky outcrop across the river from Prague Castle, insisting it was Libuše's original seat of power — older, grander, and altogether more impressive than the castle her prophecy would supposedly found later. It's a great story.\n\nIt's just not a very well-documented one: real evidence for Vyšehrad only starts showing up centuries later, with a duke minting coins there around 995, and its oldest surviving building wasn't built until roughly 1080. So take the legend with a pinch of salt — but the hilltop itself is real, dramatic, and clearly worth arguing about for two hundred years.",
      cz: "Kde přesně se tedy všechno to vládnutí odehrávalo? Zeptejte se devatenáctého století a čeští vypravěči s jistotou ukážou na Vyšehrad, dramatický skalní ostroh na druhém břehu řeky naproti Pražskému hradu, a budou tvrdit, že to bylo Libušino původní sídlo — starší, velkolepější a celkově působivější než hrad, který její proroctví údajně založilo později. Je to skvělý příběh.\n\nJen není moc dobře doložený: skutečné doklady o Vyšehradu se objevují až o staletí později, kdy tam kolem roku 995 kníže razil mince, a jeho nejstarší dochovaná stavba vznikla teprve kolem roku 1080. Berte tedy legendu s rezervou — ale samotný ten kopec je skutečný, dramatický a evidentně stál za dvě stě let hádek.",
      zh: "那么，这一切统治究竟发生在哪里呢？如果你去问19世纪的捷克说书人，他们会一脸笃定地指向维谢赫拉德——一处隔河与布拉格城堡相望、地势险峻的岩岬，并坚称这里才是莉布谢最初的居所，比她预言中后来建立的城堡更古老、更宏伟、也更气派。这是个精彩的故事。\n\n只可惜证据不太站得住脚：关于维谢赫拉德真正确凿的记录，要晚上好几个世纪才出现——公爵约在995年在此铸造钱币，而现存最古老的建筑，也要到约1080年才建成。所以这个传说不妨打个折扣来听——但这座山岬本身是真实存在的，地势险峻，也确实值得让人争论上整整两百年。",
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
      en: "Between the legendary founders and the first duke we can actually verify, Cosmas of Prague's 12th-century chronicle lists seven more rulers in a row — Nezamysl, Mnata, Vojen, Vnislav, Křesomysl, Neklan, and Hostivít, traditionally held to be Bořivoj's own father. Between them, they're credited with almost nothing: no battles, no buildings, no decisions worth recording, just names inherited by nineteenth-century histories that needed an unbroken bloodline connecting myth to fact. Some historians suspect the list is exactly that — padding, invented or half-remembered names stretched across roughly 137 years to make the family tree look continuous, at an average reign length just long enough to be barely plausible and not one day longer.\n\nThe sole exception livening up this very long paragraph of nothing: a nobleman named Horymír, said to have ridden his horse Šemík off the cliffs of Vyšehrad to escape execution during Křesomysl's reign — a genuinely great story, undercut slightly by the fact that nobody wrote it down until a 16th-century chronicler with a well-earned reputation for making things up got to it first.",
      cz: "Mezi legendárními zakladateli a prvním knížetem, kterého už dokážeme skutečně doložit, uvádí Kosmova kronika z 12. století v řadě dalších sedm vládců — Nezamysla, Mnatu, Vojena, Vnislava, Křesomysla, Neklana a Hostivíta, tradičně považovaného za Bořivojova vlastního otce. Dohromady se jim nepřipisuje skoro nic: žádné bitvy, žádné stavby, žádná rozhodnutí hodná záznamu, jen jména, která si od nich devatenácté století vypůjčilo, protože potřebovalo nepřerušenou krevní linii spojující mýtus s fakty. Někteří historikové mají podezření, že seznam je přesně tohle — výplň, vymyšlená nebo napůl zapomenutá jména natažená přes zhruba 137 let, aby rodokmen vypadal souvisle, s průměrnou délkou vlády tak akorát věrohodnou a ani o den delší.\n\nJedinou výjimkou, která tenhle dlouhý odstavec o ničem trochu oživí, je šlechtic jménem Horymír, jenž prý za vlády Křesomysla ujel na koni Šemíkovi z vyšehradských skal, aby unikl popravě — opravdu skvělý příběh, jen mírně pokažený tím, že ho nikdo nezapsal až do 16. století, kdy se k němu dostal kronikář s poctivě vydobytou pověstí, že si věci prostě vymýšlí.",
      zh: "在传说中的开国者与我们真正能够确证的第一位公爵之间，科斯马斯12世纪编年史又一口气列出了七位统治者——涅扎米斯尔、姆纳塔、沃因、弗尼斯拉夫、克热索米斯尔、涅克兰，以及霍斯提维特（传统上被认为是博日沃伊本人的父亲）。这七人加起来，几乎什么事迹都没留下：没有战役，没有建筑，没有一个值得记录的决定，只有一串被19世纪史书借用的名字——因为那时候的史家需要一条不间断的血脉，把神话和信史连接起来。有些历史学家怀疑，这份名单本身就是凑数：为了让家谱显得绵延不绝，硬是把虚构或半记半忘的名字拉长到大约137年，每人在位年限刚好长得勉强说得过去，绝不多留一天破绽。\n\n唯一为这段“什么都没有”的漫长叙述增添一点色彩的例外，是一位名叫霍雷米尔的贵族——据说他在克热索米斯尔在位期间，为了逃脱死刑，骑着自己的骏马舍米克从维谢赫拉德的悬崖一跃而下。这是个相当精彩的故事，只可惜稍微打了点折扣：因为直到16世纪，才有一位以“擅长编故事”闻名的编年史家把它记录下来。",
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
    era: "bohemian-duchy",
    startYear: 870,
    year: {
      en: "c. 870 (documented history begins)",
      cz: "kolem roku 870 (začátek doložených dějin)",
      zh: "约870年（信史的开端）",
    },
    image: "/history/borivoj-first-duke.webp",
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
      en: "Hostivít, last of those seven placeholder dukes, is credited with exactly one lasting deed: fathering a son whose life we can actually document. Meet Bořivoj I, the first Duke of Bohemia to step out of legend and into real sources — the true starting point of the Přemyslid dynasty as a documented royal house, as opposed to the folk-tale version Libuše and Přemysl represent.\n\nHis rise wasn't exactly a triumph of independence, though: Bohemia in the 870s was a junior partner to its much larger neighbour, Great Moravia, and Bořivoj held his dukedom only because Great Moravia's own ruler, Svatopluk I, recognised him as a loyal vassal around 872. And Svatopluk's court came with a resident celebrity: Bishop Methodius, who together with his brother Cyril had spent years single-handedly bringing both Christianity and a written alphabet to the entire Slavic world — not a man Bořivoj could stay a stranger to for long.",
      cz: "Hostivít, poslední ze sedmi jmen do počtu, si připsal přesně jeden trvalý čin: zplodil syna, jehož život už dokážeme doložit. Seznamte se s Bořivojem I., prvním českým knížetem, který vystoupil z legendy do skutečných pramenů — opravdovým počátkem přemyslovské dynastie coby doloženého panovnického rodu, na rozdíl od pohádkové verze, kterou představují Libuše a Přemysl.\n\nJeho nástup ale nebyl žádným triumfem samostatnosti: Čechy byly v 70. letech 9. století jen menším partnerem svého mnohem většího souseda, Velké Moravy, a Bořivoj své knížectví držel jen díky tomu, že ho kolem roku 872 uznal za věrného vazala velkomoravský vládce Svatopluk I. A na Svatoplukově dvoře měli svou vlastní celebritu: biskupa Metoděje, který spolu se svým bratrem Cyrilem strávil roky téměř sám budováním křesťanství i celého nového písma pro celý slovanský svět — člověka, kterému se Bořivoj neměl šanci dlouho vyhýbat.",
      zh: "霍斯提维特，那七位凑数公爵中的最后一位，一生只留下了一件实实在在的功绩：生了一个儿子，而这个儿子的生平，我们终于能够确证了。他就是博日沃伊一世——第一位从传说走入真实史料的波希米亚公爵，普热米斯尔王朝作为一个有据可查的统治家族，真正意义上的起点，而不再是莉布谢与普热米斯尔所代表的那个民间传说版本。\n\n不过，他的崛起可算不上什么独立的凯歌：9世纪70年代的波希米亚，只是邻近那个庞大得多的大摩拉维亚帝国麾下的一个小伙伴，博日沃伊之所以能保住公爵之位，全靠大摩拉维亚统治者斯瓦托普鲁克一世大约在872年承认他为忠诚的附庸。而斯瓦托普鲁克的宫廷里，本就住着一位当红人物：美多德主教。他与兄弟西里尔一起，几乎凭两人之力，把基督教和一整套全新的斯拉夫文字体系带给了整个斯拉夫世界——这样一个人物，博日沃伊注定用不了多久就要与他打上交道。",
    },
    relatedLandmarks: [
      {
        slug: "church-of-our-lady-prague-castle",
        relation: {
          en: "The church Bořivoj built on this hill in the 880s — Prague's oldest, gone by the 13th century and rediscovered only in 1950–51, now also the resting place of his own son, Duke Spytihněv I.",
          cz: "Kostel, který Bořivoj postavil na tomto kopci v 80. letech 9. století — nejstarší pražský kostel, zaniklý do 13. století a znovuobjevený až v letech 1950–51, dnes zároveň místem posledního odpočinku jeho vlastního syna, knížete Spytihněva I.",
          zh: "博日沃伊在9世纪80年代于这座山丘上建造的教堂——布拉格最古老的教堂，13世纪便已消失，直到1950至1951年才重见天日，如今也是他亲生儿子——斯皮蒂赫涅夫一世公爵的安息之地。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bo%C5%99ivoj_I_of_Bohemia",
  },
  {
    slug: "borivoj-conversion-and-exile",
    era: "bohemian-duchy",
    startYear: 883,
    year: {
      en: "883–885",
      cz: "883–885",
      zh: "883年－885年",
    },
    image: "/history/borivoj-conversion-and-exile.webp",
    tone: "humorous",
    title: {
      en: "Baptized, Deposed, Restored",
      cz: "Pokřtěn, svržen, navrácen",
      zh: "受洗、被逐、复位",
    },
    hookLine: {
      en: "Methodius wasted no time working on Bořivoj — and what he started nearly cost him his throne.",
      cz: "Metoděj se do Bořivoje pustil bez váhání — a to, co tím spustil, ho málem stálo trůn.",
      zh: "美多德在博日沃伊身上下起功夫来毫不含糊——而他点燃的这把火，几乎让博日沃伊丢了王位。",
    },
    summary: {
      en: "Legend traces the spark to a bad seat at dinner: visiting Svatopluk's court, Bořivoj was turned away from the Christian nobles' table for still being pagan and sat with the servants instead — until Bishop Methodius, watching, promised he'd rule his enemies and see his line flourish. Pride, faith, or cold political math? The chroniclers never quite say.\n\nAround 883, Methodius baptized Bořivoj and his wife Ludmila, making them the first Christian rulers in the family line — a milestone that should have been simple good news. Instead, it nearly ended Bořivoj's rule entirely: Bohemia's pagan nobility saw the new religion as a foreign imposition threatening their old customs and authority, and a faction backing his own kinsman Strojmír rose up and drove him out of the country, forcing him into hiding at a string of remote fortresses. He got his dukedom back in 885, but only with Moravian troops behind him — Svatopluk's soldiers helped Bořivoj crush the pagan revolt and retake control, a debt to his overlord that would soon matter a great deal.",
      cz: "Legenda vidí jiskru v nepříjemném místě u stolu: při návštěvě Svatoplukova dvora byl Bořivoj coby pohan odmítnut od stolu křesťanské šlechty a musel usednout se služebnictvem — dokud mu přihlížející biskup Metoděj neslíbil, že jednou bude vládnout svým nepřátelům a jeho rod se rozroste jako řeka. Zraněná pýcha, upřímná víra, nebo chladná politická kalkulace? Kronikáři to nikdy pořádně neřekli.\n\nKolem roku 883 pokřtil Metoděj Bořivoje i jeho manželku Ludmilu, čímž se stali prvními křesťanskými vládci v rodové linii — milník, který měl být jednoduše dobrou zprávou. Místo toho Bořivojovu vládu málem úplně ukončil: pohanská šlechta v Čechách vnímala nové náboženství jako cizí vnucenou věc ohrožující staré zvyky a autority, a frakce podporující jeho vlastního příbuzného Strojmíra povstala a vyhnala ho ze země, což ho donutilo skrývat se na řadě vzdálených hradišť. Své knížectví získal zpět v roce 885, ale jen s pomocí moravského vojska — Svatoplukovi vojáci pomohli Bořivojovi rozdrtit pohanské povstání a znovu se chopit moci, dluh vůči svému pánovi, na kterém brzy hodně záleželo.",
      zh: "传说的火花，据说是从宴席上的一个尴尬座位开始的：博日沃伊到访斯瓦托普鲁克的宫廷时，因仍是异教徒，被拒于基督徒贵族的餐桌之外，只能与仆从同席而坐——直到一旁的美多德主教许下预言：他终将统治自己的敌人，子孙也将如江河般繁盛。是屈辱刺激，是虔诚信仰，还是精明的政治算计？波希米亚的编年史家从未说清楚。\n\n约在883年，美多德为博日沃伊和他的妻子鲁德米拉施洗，使他们成为这一家族世系中第一代基督徒统治者——这本该是一件单纯的喜事。结果却几乎彻底终结了博日沃伊的统治：波希米亚的异教贵族把这个新信仰视为外来强加之物，认为它威胁到了旧有的习俗与权威，一股支持他本家亲属斯特罗伊米尔的势力揭竿而起，将他逐出国境，迫使他躲藏在一连串偏远的要塞据点之中。直到885年，他才夺回公爵之位——但靠的是摩拉维亚的军队：斯瓦托普鲁克的士兵帮助博日沃伊镇压了这场异教叛乱、重新掌权，而这份欠下宗主的人情，很快就变得举足轻重。",
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
      {
        slug: "obelisk-prague-castle",
        relation: {
          en: "The moment he got his dukedom back in 885, Bořivoj made good on the vow implied by that Moravian banquet: he built Prague's first church right beside Žiži, the pagan hilltop shrine and ducal coronation stone — filling in its sacred ditch and quietly retiring the old gods' altar for good.",
          cz: "Sotva si v roce 885 vydobyl zpátky své knížectví, splnil Bořivoj slib, který v sobě nesla ona moravská hostina: postavil první pražský kostel hned vedle Žiži, pohanského obětiště na vrcholku a zároveň knížecí korunovační kamenné stolice — zasypal jeho posvátný příkop a starým bohům tiše sebral oltář navždy.",
          zh: "885年一夺回公爵之位，博日沃伊就兑现了那场摩拉维亚宴会上暗藏的誓言：他在日日丘——那处异教山顶圣地兼公爵登基石座——旁边建起了布拉格第一座教堂，填平了它的祭祀壕沟，悄悄让旧神的祭坛彻底退场。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bo%C5%99ivoj_I_of_Bohemia",
  },
  {
    slug: "founding-of-prague-castle",
    era: "bohemian-duchy",
    startYear: 886,
    year: {
      en: "c. 880s (exact date disputed)",
      cz: "80. léta 9. století (přesné datum sporné)",
      zh: "9世纪80年代（确切年份尚有争议）",
    },
    image: "/history/founding-of-prague-castle.webp",
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
      en: "Sometime in the 880s — sources disagree on whether it was Bořivoj himself or, more likely, his son Spytihněv a decade or so later — the Přemyslid seat of power shifted from the old fort at Levý Hradec to a rocky ridge overlooking the Vltava, and Prague Castle began. The very first building raised there was a modest Church of the Virgin Mary; the far more famous St. George's and St. Vitus churches wouldn't be added for another two generations.\n\nNobody at the time could have known it, but this unglamorous administrative move would end up anchoring the most important address in Czech history for the next eleven hundred years and counting.",
      cz: "Někdy v 80. letech 9. století — prameny se neshodnou, zda to udělal sám Bořivoj, nebo spíš, o dekádu později, jeho syn Spytihněv — se přemyslovské sídlo přesunulo ze starého hradiště na Levém Hradci na skalnatý hřeben nad Vltavou, a začal tak vznikat Pražský hrad. Úplně první stavbou, která tu vyrostla, byl skromný kostel Panny Marie; mnohem slavnější kostely svatého Jiří a svatého Víta přibyly až o dvě generace později.\n\nNikdo tehdy netušil, že tenhle nenápadný administrativní přesun na dalších jedenáct set let a stále se počítajících ukotví to nejdůležitější místo v českých dějinách.",
      zh: "9世纪80年代的某个时候——史料对此说法不一，究竟是博日沃伊本人所为，还是十年左右之后由他的儿子斯皮蒂赫涅夫完成——普热米斯尔王朝的权力中心，从利维赫拉德茨的旧要塞，迁到了俯瞰伏尔塔瓦河的一道岩石山脊上，布拉格城堡由此开始成形。这里最早建起的建筑，只是一座朴素的圣母教堂；更为著名的圣乔治教堂与圣维特教堂，要再过两代人才会出现。\n\n当时谁都没能料到，这次看似平淡无奇的行政迁址，竟会在接下来的一千一百多年里——而且还在继续——稳稳占据捷克历史上最重要的那个地址。",
    },
    relatedLandmarks: [
      {
        slug: "church-of-our-lady-prague-castle",
        relation: {
          en: "This is the modest little church the summary above is actually describing — the very first building raised on the ridge, years before St. George's or St. Vitus ever existed.",
          cz: "Tohle je ten skromný kostelík, o kterém mluví text výše — úplně první stavba na tomto hřebeni, o léta dřív, než tu vůbec byl svatý Jiří nebo svatý Vít.",
          zh: "这就是上文提到的那座朴素小教堂本尊——这道山脊上最早建起的建筑，比圣乔治或圣维特出现都要早上好些年。",
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
      {
        slug: "prague-castle",
        relation: {
          en: "Not part of the original founding either — St. Vitus wouldn't rise on this hill for another two generations — but it's the cathedral that eventually eclipsed everything else this move ever produced.",
          cz: "Ani ona nebyla součástí původního založení — svatý Vít se na tomto kopci objevil až o dvě generace později — ale nakonec je to právě tahle katedrála, která zastínila úplně všechno ostatní, co tento přesun kdy přinesl.",
          zh: "同样不是最初奠基时就有的——圣维特要再过两代人才会在这座山丘上出现——但最终，正是这座大教堂，盖过了这次迁址所催生的一切其他成果。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Prague_Castle",
  },
  {
    slug: "bohemia-independence-895",
    era: "bohemian-duchy",
    startYear: 895,
    year: {
      en: "895 (formal break completed by 898)",
      cz: "895 (definitivní odtržení dokončeno do roku 898)",
      zh: "895年（正式脱离于898年完成）",
    },
    image: "/history/bohemia-independence-895.webp",
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
      en: "Bořivoj's sons were still minors when he died, so Great Moravia's Svatopluk I simply took over as regent — Bohemia stayed a dependency either way.\n\nEverything changed when Svatopluk himself died in 894 and his own sons fell to fighting over the inheritance: Bořivoj's son Spytihněv, now old enough to rule in his own right, saw his opening. In 895 he travelled to the Imperial Diet at Regensburg and swore loyalty directly to the East Frankish king Arnulf instead, and within a few more years of allying with Bavaria against a crumbling Great Moravia, Bohemia had shaken off its old overlord for good — the closest thing this whole story has to an actual founding of an independent Bohemian state.",
      cz: "Bořivojovi synové byli v době jeho smrti ještě nezletilí, takže se velkomoravský Svatopluk I. jednoduše ujal regentství — Čechy tak zůstaly závislým územím tak jako tak.\n\nVšechno se změnilo, když v roce 894 zemřel sám Svatopluk a jeho vlastní synové se pustili do boje o dědictví: Bořivojův syn Spytihněv, už dost starý na to, aby vládl sám za sebe, viděl svou příležitost. V roce 895 odcestoval na říšský sněm do Řezna a přísahal věrnost přímo východofranskému králi Arnulfovi, a během několika dalších let, kdy se spojil s Bavorskem proti rozpadající se Velké Moravě, se Čechy definitivně zbavily svého starého pána — což je ze všech částí tohoto příběhu nejblíž tomu, čemu se dá říkat skutečné založení samostatného českého státu.",
      zh: "博日沃伊去世时，他的儿子们尚未成年，于是大摩拉维亚的斯瓦托普鲁克一世干脆自任摄政——不管怎样，波希米亚仍是附庸。\n\n直到894年斯瓦托普鲁克本人去世、他的几个儿子为争夺继承权大打出手，局面才彻底改变：博日沃伊之子斯皮蒂赫涅夫，此时已经足以独当一面，抓住了这个机会。895年，他前往雷根斯堡帝国议会，转而直接向东法兰克国王阿努尔夫宣誓效忠，此后又用了几年时间与巴伐利亚结盟，共同对抗日渐崩溃的大摩拉维亚，波希米亚终于彻底摆脱了昔日的宗主——这是整个故事里，最接近“波希米亚独立建国”这一说法的一刻。",
    },
    relatedLandmarks: [
      {
        slug: "budec",
        relation: {
          en: "Shortly after this same 895 oath, Spytihněv used his newly independent authority to build a rotunda here — one that later became the schoolroom where a young Prince Wenceslas learned his letters, and today survives as the oldest standing building in the entire country.",
          cz: "Krátce po téže přísaze z roku 895 využil Spytihněv svou nově nabytou samostatnou moc k tomu, aby tu nechal postavit rotundu — tu, kde se později mladý kníže Václav učil číst, a která dodnes stojí jako nejstarší dochovaná budova v celé zemi.",
          zh: "就在这同一场895年的宣誓之后不久，斯皮蒂赫涅夫用他新获得的独立权力在此建起了一座圆形教堂——后来年幼的瓦茨拉夫王子正是在这里学会认字，如今它仍是全捷克现存最古老的建筑。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Spytihn%C4%9Bv_I_of_Bohemia",
  },
  {
    slug: "st-ludmila-martyrdom",
    era: "bohemian-duchy",
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
      en: "Ludmila outlived Bořivoj by decades, and by the time her grandson Wenceslas was a child, being Bohemia's first Christian consort had made her one thing above all: enormously influential over the boy in line to rule next.\n\nThat's exactly what turned her into a target. In 921, locked in a bitter dispute with her own daughter-in-law Drahomíra over who would raise young Wenceslas, Ludmila was strangled on Drahomíra's orders — making her Bohemia's first native saint, and, rather awkwardly, the family's first recorded political assassination.",
      cz: "Ludmila přežila Bořivoje o desítky let, a v době, kdy byl její vnuk Václav ještě dítě, z ní to, že byla první křesťanskou kněžnou v Čechách, udělalo především jedno: ženu s obrovským vlivem na chlapce, který měl jednou vládnout.\n\nA přesně to z ní udělalo terč. V roce 921, uprostřed hořkého sporu s vlastní snachou Drahomírou o to, kdo bude vychovávat mladého Václava, dala Drahomíra Ludmilu uškrtit. Ludmila se tak stala první domácí svatou v Čechách a — poněkud trapně pro rodinu — zároveň první doloženou politickou vraždou v jejích dějinách.",
      zh: "鲁德米拉比博日沃伊多活了几十年，到她孙子瓦茨拉夫还是个孩子的时候，作为波希米亚第一位基督徒公爵夫人的身份，让她首先意味着一件事：对这位未来的统治者拥有巨大的影响力。\n\n而这，恰恰让她成了众矢之的。921年，在与自己儿媳德拉霍米拉围绕由谁抚养年幼的瓦茨拉夫而爆发的激烈争执中，德拉霍米拉下令将鲁德米拉勒死。鲁德米拉由此成为波希米亚本土第一位圣徒——同时也颇为尴尬地，成了这个家族史上第一起有记载的政治暗杀。",
    },
    relatedLandmarks: [
      {
        slug: "melnik-stare-mesto",
        relation: {
          en: "Long before Tetín, before the marriage, before any of it — this fortified hilltop above the Elbe and Vltava confluence, then known as Pšov, is traditionally held to be where Ludmila was born around 860, daughter of a local Slavic prince.",
          cz: "Dlouho před Tetínem, před sňatkem, před vším ostatním — na tomto opevněném návrší nad soutokem Labe a Vltavy, tehdy zvaném Pšov, se podle tradice kolem roku 860 narodila Ludmila jako dcera místního slovanského knížete.",
          zh: "早在泰钦、早在她的婚姻、早在这一切故事发生之前——在这座俯瞰易北河与伏尔塔瓦河交汇处的设防山丘上，当年名为普肖夫（Pšov），传统上认为鲁德米拉大约在860年就诞生于此，是当地一位斯拉夫王公的女儿。",
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
        slug: "st-georges-basilica",
        relation: {
          en: "Where Duke Wenceslas had his grandmother's remains reburied in 925 — the resting place her murder site never got to be.",
          cz: "Kam kníže Václav v roce 925 nechal přenést ostatky své babičky — místo posledního odpočinku, kterým se místo vraždy nikdy nestalo.",
          zh: "瓦茨拉夫公爵于925年将祖母遗骸迁葬于此——这才是她最终的安息之地，而非当年遇害的现场。",
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
      {
        slug: "kaple-sv-ludmily",
        relation: {
          en: "A chapel dedicated to the saint — not the site of her death, but part of the long afterlife of devotion the murder unexpectedly kicked off.",
          cz: "Kaple zasvěcená této světici — nikoli místo její smrti, ale součást dlouhé posmrtné úcty, kterou vražda nečekaně rozpoutala.",
          zh: "一座献给这位圣徒的小教堂——并非她遇害的地点，而是这场谋杀意外催生的漫长信仰追思的一部分。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Ludmila_of_Bohemia",
  },
  {
    slug: "wenceslas-life-and-reign",
    era: "bohemian-duchy",
    startYear: 924,
    year: {
      en: "924–935 (his reign)",
      cz: "924–935 (jeho vláda)",
      zh: "924年－935年（在位期间）",
    },
    image: "/history/wenceslas-life-and-reign.webp",
    tone: "humorous",
    title: {
      en: "Wenceslas, the Good Duke",
      cz: "Dobrý kníže Václav",
      zh: "好公爵瓦茨拉夫",
    },
    hookLine: {
      en: "Raised by the grandmother his own family had just had killed, Wenceslas grew up to be Bohemia's most famous ruler — mostly by refusing to fight anyone.",
      cz: "Vychován babičkou, kterou jeho vlastní rodina právě nechala zavraždit, vyrostl Václav v nejslavnějšího vládce Čech — většinou tím, že se prostě odmítal s kýmkoli prát.",
      zh: "由那位刚被自家人下令杀害的祖母一手带大，瓦茨拉夫长大后成了波希米亚历史上最著名的统治者——而他成名的方式，主要就是拒绝跟任何人开战。",
    },
    summary: {
      en: "Raised by his grandmother Ludmila after the custody fight that got her killed, Wenceslas came into his own rule around 924–925, still a teenager, and spent the next decade actually earning the 'good' in front of his name — though not, it turns out, by winning battles. When the East Frankish king Henry the Fowler marched on Prague in 929, Wenceslas chose to resume paying tribute rather than fight a war Bohemia was unlikely to win, buying his duchy a decade of peace it badly needed.\n\nThe relationship paid off in an unexpected currency: Henry sent him a relic of St. Vitus — a shoulder-bone, by most accounts — and Wenceslas built a rotunda at Prague Castle specifically to house it, on the very spot where St. Vitus Cathedral stands today. He poured comparable energy into the Church more broadly, backing Christian institutions across Bohemia at a moment when a fair chunk of his own nobility would rather he hadn't.\n\nNone of it made for thrilling chronicle material at the time. It made for something better: a thousand years later, a Victorian carol turned him into the reigning international template for what a 'good king' is even supposed to look like.",
      cz: "Vychován babičkou Ludmilou po sporu o jeho výchovu, který ji stál život, se Václav ujal vlastní vlády kolem let 924–925, ještě jako teenager, a další desetiletí strávil tím, že si to „dobrý\" před svým jménem skutečně zasloužil — jak se ukázalo, rozhodně ne vyhranými bitvami. Když v roce 929 přitáhl k Praze východofranský král Jindřich Ptáčník, rozhodl se Václav raději obnovit placení tributu, než vést válku, kterou by Čechy sotva vyhrály — a koupil si tak svému knížectví desetiletí míru, který zoufale potřeboval.\n\nTen vztah se vyplatil i v neočekávané měně: Jindřich mu poslal ostatek svatého Víta — podle většiny pramenů lopatku — a Václav kvůli němu nechal na Pražském hradě postavit rotundu, přesně na místě, kde dnes stojí katedrála svatého Víta. Podobnou energii věnoval i církvi obecně a podporoval křesťanské instituce po celých Čechách, a to v době, kdy si notná část jeho vlastní šlechty přála pravý opak.\n\nNic z toho tehdy nedalo do kronik žádnou vzrušující četbu. Vyneslo mu to ale něco lepšího: o tisíc let později z něj viktoriánská koleda udělala celosvětový vzor toho, jak má vlastně vypadat „dobrý král\".",
      zh: "在那场夺走了祖母鲁德米拉性命的监护权之争后，瓦茨拉夫由她一手带大；大约924至925年间，还是个十几岁的少年，他便开始亲政，并用接下来的十年，实实在在地配得上自己名字前面那个“好”字——不过事实证明，靠的可不是打胜仗。929年，东法兰克国王“捕鸟者”亨利一世兵临布拉格城下，瓦茨拉夫选择恢复纳贡，而不是打一场波希米亚几乎不可能赢的战争——用这个办法，他为自己的公国换来了整整十年、极其需要的和平。\n\n这段关系也带来了一份意想不到的回报：亨利送给他一件圣维特的圣物——据多数记载是一块肩胛骨——瓦茨拉夫为此专门在布拉格城堡建了一座罗通达教堂来安放它，位置就在今天圣维特大教堂所在的地方。他在教会事务上也投入了同样的心力，大力扶持波希米亚各地的基督教机构，尽管他自己麾下相当一部分贵族其实并不乐见此事。\n\n这些事在当时都算不上什么能写进编年史的精彩段落。但它们换来了更好的东西：一千年后，一首维多利亚时代的圣诞颂歌，把他变成了全世界“好国王”这个形象的标准范本。",
    },
    relatedLandmarks: [
      {
        slug: "pomnik-sv-vaclava",
        relation: {
          en: "Sculpted by Josef Václav Myslbek, 1887–1924 — a modern monument, not a relic of his own era. Ludmila stands among the four saints at its base: the grandson she died raising ended up on Bohemia's most important statue, and she never left his feet.",
          cz: "Vytesal ho Josef Václav Myslbek v letech 1887–1924 — moderní pomník, ne pozůstalost z Václavovy doby. Mezi čtyřmi světci u podstavce stojí i jeho babička Ludmila: vnuk, o jehož výchovu bojovala až do smrti, skončil na nejdůležitějším pomníku v Čechách — a ona od něj nikdy neodešla.",
          zh: "由约瑟夫·瓦茨拉夫·米斯尔贝克创作于1887–1924年间——一件近现代作品，并非瓦茨拉夫时代的遗存。基座四位圣人中就有他的祖母鲁德米拉：她为之搭上性命的这个孙子，如今站上了波希米亚最重要的纪念碑，而她也从未离开过他的脚边。",
        },
      },
      {
        slug: "svatovaclavska-vinice",
        relation: {
          en: "According to tradition, Wenceslas personally planted and tended these vines himself in the early tenth century, growing grapes for sacramental wine — a hands-on detail that fits the rest of his reign rather well.",
          cz: "Podle tradice tu Václav v první polovině 10. století osobně vysázel a obdělával vinnou révu, aby měl hrozny na mešní víno — detail, který se do zbytku jeho vlády docela hodí.",
          zh: "相传瓦茨拉夫本人在10世纪初就亲手在此栽种、打理这片葡萄园，种葡萄是为了酿制圣餐用酒——这个亲力亲为的细节，倒是很符合他整个在位期间的风格。",
        },
      },
      {
        slug: "wenceslas-square",
        relation: {
          en: "Founded in 1348 as a horse market under Charles IV, this 750-metre boulevard wasn't renamed Svatováclavské náměstí — Wenceslas Square — until 1848, nine centuries after his death. What happened here after that is a story for a much later chapter.",
          cz: "Založeno roku 1348 jako koňský trh za Karla IV., přejmenoval se tento sedmset padesátimetrový bulvár na Svatováclavské náměstí až v roce 1848 — devět století po Václavově smrti. To, co se tu odehrálo potom, patří do mnohem pozdější kapitoly.",
          zh: "1348年由查理四世下令建立，最初只是一处马市；直到1848年——瓦茨拉夫去世九个世纪之后——这条750米长的林荫大道才被更名为“圣瓦茨拉夫广场”。此后在这里发生的事，则要留给更晚的篇章来讲。",
        },
      },
      {
        slug: "kostel-sv-vaclava-smichov",
        relation: {
          en: "One of at least six or seven churches in Prague alone dedicated to him — naming a church after Wenceslas has been roughly as common in Bohemia as naming a son Václav, which is to say: very.",
          cz: "Jeden z nejméně šesti nebo sedmi pražských kostelů zasvěcených právě jemu — zasvětit kostel Václavovi bylo v Čechách zhruba stejně běžné jako pojmenovat syna Václavem, tedy: hodně.",
          zh: "光是布拉格一地，供奉他的教堂就至少有六七座——在波希米亚，把教堂献给瓦茨拉夫，就跟给儿子取名“瓦茨拉夫”一样普遍，也就是说：非常普遍。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Wenceslaus_I,_Duke_of_Bohemia",
  },
  {
    slug: "st-wenceslas-murder",
    era: "bohemian-duchy",
    startYear: 935,
    year: {
      en: "935 (traditional date)",
      cz: "935 (tradičně uváděný rok)",
      zh: "935年（传统纪年）",
    },
    image: "/history/st-wenceslas-murder.webp",
    tone: "humorous",
    title: {
      en: "Brother Against Brother",
      cz: "Bratr proti bratrovi",
      zh: "手足相残",
    },
    hookLine: {
      en: "All that peacemaking and church-building didn't impress everyone in the family — least of all his own brother.",
      cz: "Všechno to udržování míru a budování kostelů neimponovalo úplně každému v rodině — nejméně ze všech jeho vlastnímu bratrovi.",
      zh: "这些和平外交与扶持教会的作为，并不是家里每个人都买账——最不买账的，正是他自己的亲弟弟。",
    },
    summary: {
      en: "Boleslav despised his older brother's whole approach — the tribute, the church-building, the leash it put on Bohemian ambition — and by 935 that resentment had curdled into something final.\n\nHe had Wenceslas murdered at a church door in the town now called Stará Boleslav — then spent the rest of his own long reign quietly rebuilding his dead brother's reputation into that of Bohemia's patron saint, a title the country has never let go of since.",
      cz: "Boleslav celý bratrův přístup nesnášel — tribut, budování kostelů, i to, jak to svazovalo české ambice — a do roku 935 se ta zatrpklost proměnila v něco definitivního.\n\nNechal Václava zavraždit u dveří kostela v dnešní Staré Boleslavi — a zbytek své vlastní dlouhé vlády pak strávil tichým budováním pověsti svého mrtvého bratra jako zemského patrona, titulu, kterého se země od té doby nikdy nevzdala.",
      zh: "博莱斯拉夫厌恶哥哥的整套做法——纳贡、扶持教会，以及这一切给波希米亚野心套上的缰绳——到935年，这份积怨终于酿成了最终的决裂。\n\n他派人在如今旧博莱斯拉夫的教堂门口将瓦茨拉夫杀害——此后，他用自己漫长统治的余下岁月，悄悄把这位亡兄的形象重塑为波希米亚的守护圣人，而这个称号，这个国家自此再也没有放弃过。",
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
      {
        slug: "bazilika-sv-vaclava-stara-boleslav",
        relation: {
          en: "The actual church door — a century later, Duke Břetislav I built this basilica around the original murder-site church rather than replace it, folding it whole into a crypt that still holds Wenceslas's traditional first grave.",
          cz: "Ty samé dveře kostela — o století později kolem původního kostela z místa vraždy postavil kníže Břetislav I. tuto baziliku, místo aby ho zbořil, a celý ho zakomponoval do krypty, která dodnes ukrývá Václavův tradiční první hrob.",
          zh: "就是那扇真正的教堂门——一个世纪后，布热季斯拉夫一世公爵没有拆掉案发地那座教堂，而是围绕它建起了这座圣殿，把它整体纳入了一座地下墓室，至今仍保存着传统认定的瓦茨拉夫最初墓穴。",
        },
      },
      {
        slug: "kostel-svateho-vaclava-prosek",
        relation: {
          en: "Decades after his death, Duke Boleslav II is said to have founded this church after the now-sainted Wenceslas appeared to him in a dream — one small piece of how thoroughly a murdered duke got rebuilt into a patron saint.",
          cz: "O desítky let později prý kníže Boleslav II. založil tento kostel poté, co se mu ve snu zjevil už svatořečený Václav — jeden drobný důkaz toho, jak důkladně se ze zavražděného knížete stal zemský patron.",
          zh: "据传，在他去世几十年后，博莱斯拉夫二世公爵梦见了已被封圣的瓦茨拉夫显灵，于是下令建了这座教堂——这正是那位被谋杀的公爵，如何被彻底重塑为守护圣人的一个小小例证。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Wenceslaus_I,_Duke_of_Bohemia",
  },
  {
    slug: "battle-of-lechfeld-955",
    era: "bohemian-duchy",
    startYear: 955,
    year: {
      en: "955",
      cz: "955",
      zh: "955年",
    },
    tone: "humorous",
    title: {
      en: "The Fratricide's Other Legacy",
      cz: "Druhá stránka bratrovraha",
      zh: "弑兄者的另一面",
    },
    hookLine: {
      en: "Killing his brother didn't cost Boleslav his throne — he held onto it for another thirty-seven years, and 955 is where you can see exactly what he did with the power.",
      cz: "Vražda bratra Boleslava trůnu nepřipravila — držel si ho dalších sedmatřicet let, a rok 955 je přesně to místo, kde je vidět, co s tou mocí vlastně dělal.",
      zh: "杀害兄长并没有让博莱斯拉夫丢掉王位——他又统治了三十七年，而955年，正是能看清他到底用这份权力做了什么的一年。",
    },
    summary: {
      en: "By 955, Boleslav had spent two decades expanding Bohemia into something close to a regional power, pushing its borders outward while fending off Otto I's own campaigns to bring him to heel.\n\nThat August, the two former enemies fought on the same side: Boleslav's troops joined Otto's coalition at the Battle of Lechfeld, where allied Christian forces broke the Magyar raiding armies that had been terrorising Central Europe for half a century — a battle historians still treat as one of the decisive turning points of the era. Boleslav didn't stop there; when the retreating Magyar remnant fled into Bohemian territory afterward, his own forces hunted them down and finished the job. None of this erased what he'd done to Wenceslas — Bohemian chroniclers never let him forget it — but it left behind an uncomfortable historical fact all the same: the man who murdered his own brother also built the country his brother never got the chance to.",
      cz: "Do roku 955 Boleslav strávil dvě desetiletí rozšiřováním Čech v cosi blízkého regionální mocnosti, posouval hranice směrem ven a přitom odrážel Otova I. vlastní tažení, jimiž ho chtěl přinutit k poslušnosti.\n\nToho srpna stáli bývalí nepřátelé poprvé na stejné straně: Boleslavovy oddíly se přidaly k Otově koalici v bitvě na Lechu, kde spojené křesťanské síly zlomily maďarské nájezdnické vojsko, které půl století terorizovalo střední Evropu — bitvě, kterou historici dodnes řadí mezi rozhodující momenty tehdejší doby. Boleslav u toho nezůstal: když se ustupující zbytky maďarského vojska stáhly na české území, jeho vlastní síly je dostihly a dorazily. Nic z toho nesmazalo, co udělal Václavovi — čeští kronikáři mu to nikdy nezapomněli — ale zůstává tu i tak nepohodlný historický fakt: muž, který zavraždil vlastního bratra, také vybudoval zemi, kterou jeho bratr nikdy nedostal šanci vybudovat sám.",
      zh: "到955年，博莱斯拉夫已经花了二十年时间，把波希米亚扩张成了一个接近地区强权的存在，一边向外拓展疆域，一边还要抵御奥托一世试图迫使他臣服的多次征讨。\n\n那年8月，这对昔日的敌人首次站到了同一边：博莱斯拉夫的部队加入了奥托的联军，参加了莱希费尔德战役——联合的基督教军队在此役中彻底击溃了半个世纪以来一直在中欧四处劫掠的马扎尔骑兵，这场战役至今仍被史学界视为那个时代最具决定性的转折点之一。博莱斯拉夫没有就此收手：当溃退的马扎尔残部逃入波希米亚境内时，他自己的军队追上去，将其彻底肃清。这一切都无法抹去他对瓦茨拉夫做过的事——波希米亚的编年史家从未让他忘记这一点——但它同时也留下了一个令人不太舒服的历史事实：那个亲手杀害了自己兄长的人，最终建起了他兄长本该有机会、却从未得到机会去建立的那个国家。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Battle_of_Lechfeld",
  },
  {
    slug: "prague-bishopric-973",
    era: "bohemian-duchy",
    startYear: 973,
    year: {
      en: "973",
      cz: "973",
      zh: "973年",
    },
    tone: "humorous",
    title: {
      en: "Prague Gets Its Own Bishop",
      cz: "Praha dostává vlastního biskupa",
      zh: "布拉格拥有了自己的主教区",
    },
    hookLine: {
      en: "Fighting off Magyars was one legacy. The other, quieter one took longer to finish — and it was his son who closed it out.",
      cz: "Boj s Maďary byl jedno dědictví. To druhé, tišší, trvalo déle, než ho někdo dotáhl do konce — a udělal to až jeho syn.",
      zh: "打退马扎尔人是他留下的一份遗产。另一份更安静的遗产，则花了更久才真正完成——最终是他的儿子把它收尾的。",
    },
    summary: {
      en: "For nearly a century, Bohemia's church affairs weren't even run from Bohemia: since the collapse of Great Moravia, the territory had answered to the bishopric of Regensburg, over the border in Bavaria. Boleslav — yes, that Boleslav, Wenceslas's own killer — spent part of his long reign trying to fix that, opening negotiations with Pope John XII around 968 for a bishopric of Bohemia's own. He died in 972 with the deal unfinished; his son Boleslav II closed it out in 973, working with Emperor Otto I and Otto II to establish the Diocese of Prague, seated at St. Vitus.\n\nIt still answered to the Archbishop of Mainz rather than standing fully alone, and its first bishop, a Saxon monk named Dětmar, wasn't even Czech — but for the first time, Bohemia's religious life was governed from inside its own borders instead of somebody else's. Small print aside, it was the moment Bohemia stopped being administered as somebody else's back office and started looking, on paper at least, like a proper member of Christian Europe.",
      cz: "Téměř sto let se církevní záležitosti Čech neřídily ani z Čech: po rozpadu Velké Moravy spadalo území pod biskupství v Řezně, za hranicemi v Bavorsku. Boleslav — ano, přesně ten Boleslav, bratrovrah svého vlastního bratra Václava — strávil část své dlouhé vlády snahou to napravit a kolem roku 968 zahájil s papežem Janem XII. jednání o vlastním českém biskupství. Zemřel v roce 972, aniž by dohodu dotáhl do konce; dokončil ji až jeho syn Boleslav II. v roce 973, ve spolupráci s císařem Otou I. a Otou II., čímž vzniklo pražské biskupství se sídlem u svatého Víta.\n\nStále podléhalo mohučskému arcibiskupovi, takže o úplné samostatnosti řeč ještě nebyla, a jeho první biskup, saský mnich jménem Dětmar, dokonce nebyl ani Čech — ale poprvé se náboženský život Čech řídil z jejich vlastního území, ne odjinud. Nehledě na drobná ale — to byl okamžik, kdy Čechy přestaly být administrativně cizí přílohou a začaly, aspoň na papíře, vypadat jako řádný člen křesťanské Evropy.",
      zh: "在将近一个世纪的时间里，波希米亚的教会事务甚至都不是在波希米亚境内管理的：自大摩拉维亚崩溃以来，这片土地一直隶属于巴伐利亚境外的雷根斯堡主教区。博莱斯拉夫——没错，就是那位杀害了兄长瓦茨拉夫的博莱斯拉夫——在他漫长的统治生涯中，曾花了一部分精力想要纠正这一点，大约在968年，他开始与教皇约翰十二世就波希米亚自设主教区一事展开谈判。972年他去世时，这笔交易尚未谈成；直到973年，他的儿子博莱斯拉夫二世才最终促成此事，联合奥托一世和奥托二世皇帝，正式建立了以圣维特为驻地的布拉格主教区。\n\n这个主教区仍隶属于美因茨大主教，算不上真正独立，而它的第一任主教德特马尔（Dětmar），还是位撒克逊修士，甚至都不是捷克人——但这是波希米亚的宗教生活第一次，是由自己境内、而非别处，来治理的。撇开这些小小的但书不谈，这一刻，波希米亚终于不再是别人教务体系里一个挂靠的边区，至少在纸面上，开始看起来像基督教欧洲一个像样的正式成员了。",
    },
    relatedLandmarks: [
      {
        slug: "prague-castle",
        relation: {
          en: "The seat of this new bishopric — though what stood here in 973 was a modest stone rotunda, not the soaring Gothic cathedral you're looking at now, which wouldn't even begin for another three and a half centuries.",
          cz: "Sídlo tohoto nového biskupství — i když v roce 973 tu stála skromná kamenná rotunda, ne ta vzdušná gotická katedrála, na kterou se díváš teď a jejíž stavba začala až o tři a půl století později.",
          zh: "这个新设主教区的驻地——不过973年这里矗立着的，还只是一座朴素的石造罗通达，而不是你现在眼前这座高耸的哥特式大教堂，后者的建造要再等三个半世纪才会开始。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bishopric_of_Prague",
  },
  {
    slug: "libice-massacre-995",
    era: "bohemian-duchy",
    startYear: 995,
    year: {
      en: "995 (September 28)",
      cz: "995 (28. září)",
      zh: "995年（9月28日）",
    },
    tone: "humorous",
    title: {
      en: "The Same Date, Again",
      cz: "Znovu to samé datum",
      zh: "同一个日子，再度上演",
    },
    hookLine: {
      en: "Sixty years after one Boleslav killed his own brother in the name of power, another Boleslav picked the exact same calendar date to do something considerably worse.",
      cz: "Šedesát let poté, co jeden Boleslav zavraždil vlastního bratra kvůli moci, si další Boleslav vybral přesně to samé datum v kalendáři k něčemu podstatně horšímu.",
      zh: "六十年前，一位博莱斯拉夫为了权力杀害了自己的兄长；六十年后，另一位博莱斯拉夫选在了日历上完全相同的一天，做出了一件严重得多的事。",
    },
    summary: {
      en: "The Slavník family was the one Bohemian dynasty that could still rival the Přemyslids — their own coinage, their own foreign contacts, their own fortress at Libice, roughly fifty kilometres east of Prague. Boleslav II — the same duke who'd just spent decades building Bohemia's own bishopric — decided that rivalry needed to end for good. On 28 September 995, the feast of St. Wenceslas and, pointedly, the sixtieth anniversary of his own uncle's murder, Boleslav's men struck Libice while its family was gathered to mark the same holy day and its most capable defenders were away. Nearly everyone present was killed, including those who'd fled into the church for sanctuary — chroniclers record the attackers taunting their victims with a line that could not have been more direct about what this was: if Wenceslas was their saint, Boleslav was his.\n\nOnly a handful of family members survived, having been elsewhere at the time — among them a son named Vojtěch, who happened, at that exact moment, to be in Rome. Postscript: the Vršovci, quite possibly rewarded with Libice for carrying this out, got the same treatment 113 years later — purged almost to extinction on Duke Svatopluk's orders, who was himself assassinated by one of their survivors the following year.",
      cz: "Rod Slavníkovců byl jediným českým rodem, který ještě dokázal konkurovat Přemyslovcům — měli vlastní mincovnictví, vlastní zahraniční styky, vlastní hradiště v Libici, zhruba padesát kilometrů východně od Prahy. Boleslav II. — týž kníže, který právě strávil desetiletí budováním vlastního českého biskupství — se rozhodl, že tahle konkurence musí jednou provždy skončit. 28. září 995, na svátek svatého Václava a příznačně přesně na šedesáté výročí vraždy jeho vlastního strýce, udeřili Boleslavovi muži na Libici, právě když se rodina sešla oslavit tentýž svátek a její nejschopnější obránci byli pryč. Zabiti byli téměř všichni přítomní, včetně těch, kdo se uchýlili do kostela hledat azyl — kronikáři zaznamenali, že útočníci své oběti posměšně provolávali větu, jasnější už snad ani být nemohla: je-li Václav jejich svatým, pak Boleslav je tím jejich.\n\nPřežila jen hrstka členů rodu, kteří v tu chvíli byli jinde — mezi nimi i syn jménem Vojtěch, který se právě v tu dobu nacházel v Římě. Dodatek: Vršovci, možná právě za tento čin odměnění Libicí, si o 113 let později prošli tím samým — vyvražděni téměř do posledního z rozkazu knížete Svatopluka, který byl sám o rok později zavražděn jedním z jejich přeživších.",
      zh: "斯拉夫尼克家族，是当时唯一还能与普热美斯尔家族分庭抗礼的波希米亚贵族——他们有自己的铸币、自己的对外关系，还有自己的据点利比采，位于布拉格以东约五十公里处。博莱斯拉夫二世——就是那位刚刚花了数十年建立起波希米亚自有主教区的公爵——决定彻底终结这种竞争。995年9月28日，圣瓦茨拉夫瞻礼日，也是（这一点相当刺眼）他自己叔父被害整整六十周年的这一天，博莱斯拉夫的人马突袭了利比采——当时斯拉夫尼克一族正聚在一起庆祝同一个节日，家族中最有能力自保的成员恰巧都不在场。在场的几乎所有人都被杀害，包括那些逃入教堂寻求庇护的人也未能幸免——编年史家记载，攻击者对着受害者喊出的话，再直白不过：如果瓦茨拉夫是你们的圣徒，那博莱斯拉夫就是我们的。\n\n家族中只有寥寥几人因当时不在场而幸存——其中就包括一个名叫沃伊捷赫的儿子，他此刻恰好身在罗马。后记：维尔绍夫奇家族——很可能正是因这场屠杀而获封利比采——113年后也遭遇了同样的命运，在公爵斯瓦托普鲁克的命令下几乎被屠戮殆尽；而他自己，也在次年被家族幸存者刺杀身亡。",
    },
    relatedLandmarks: [
      {
        slug: "hradiste-libice",
        relation: {
          en: "The Slavník stronghold itself — today just the outlined foundations of a palace, church, and gate, rediscovered by archaeologists rather than preserved by anyone who wanted them found.",
          cz: "Samotné hradiště Slavníkovců — dnes jen vyznačené základy paláce, kostela a brány, znovuobjevené archeology, ne zachované někým, kdo by si přál, aby byly nalezeny.",
          zh: "斯拉夫尼克家族的据点本身——如今只剩下宫殿、教堂与城门的轮廓地基，是考古学家重新发掘出来的，而不是被谁刻意保存下来供人寻访的。",
        },
      },
    ],
    wikipediaUrl: "https://cs.wikipedia.org/wiki/Libice_nad_Cidlinou_(hradi%C5%A1t%C4%9B)",
  },
  {
    slug: "st-adalbert-martyrdom-997",
    era: "bohemian-duchy",
    startYear: 997,
    year: {
      en: "983–997 (bishopric to martyrdom)",
      cz: "983–997 (biskupem až po mučednickou smrt)",
      zh: "983年－997年（任主教至殉道）",
    },
    tone: "humorous",
    title: {
      en: "St. Adalbert — The Bishop Who Kept Leaving",
      cz: "Svatý Vojtěch — biskup, který pořád odcházel",
      zh: "圣阿达尔伯特——那位一直在出走的主教",
    },
    hookLine: {
      en: "The one Slavník who survived Libice went on to become Bohemia's second bishop — and spent most of that job trying to leave it.",
      cz: "Jediný Slavníkovec, který Libici přežil, se stal druhým českým biskupem — a většinu té funkce strávil snahou z ní odejít.",
      zh: "利比采唯一的幸存者，后来成了波希米亚的第二任主教——而他大半个任期，都在试图离开这个职位。",
    },
    summary: {
      en: "Vojtěch — better known by his confirmation name Adalbert — became Bohemia's second bishop in 983, the first native Czech to hold the post, and spent much of the job locked in conflict with a Bohemian nobility that had no interest in reforming polygamy, clerical marriage, or fasting discipline. He walked out on Prague twice, fleeing to Rome each time rather than fight it out at home; between the two trips, he founded Břevnov Monastery in 993, the first monastery on Bohemian soil. He was in Rome for the second time when his own family was slaughtered at Libice in 995, and he never really came back to run the diocese again — instead he headed north to preach to the pagan Prussians, who killed him for it in 997.\n\nHis relics eventually made their way home. So, in a sense, did his face: centuries later, sculptor Josef Václav Myslbek placed him at the base of the Wenceslas statue in Wenceslas Square, standing alongside Ludmila, Procopius, and Agnes — the same four saints already introduced back in Wenceslas's own chapter. The bishop who could never stay in Prague for long ended up permanently fixed there in bronze.",
      cz: "Vojtěch — lépe známý pod biřmovacím jménem Adalbert — se stal roku 983 druhým pražským biskupem, prvním rodilým Čechem v této funkci, a většinu úřadu strávil v neustálém sporu s českou šlechtou, která neměla nejmenší zájem reformovat mnohoženství, kněžské sňatky ani postní kázeň. Z Prahy dvakrát odešel a pokaždé uprchl do Říma, místo aby to doma dovedl do konce; mezi oběma cestami založil roku 993 Břevnovský klášter, první klášter na českém území. Byl v Římě podruhé, když byla roku 995 v Libici vyvražděna jeho vlastní rodina, a k vedení diecéze se už nikdy pořádně nevrátil — místo toho odešel na sever kázat pohanským Prusům, kteří ho za to roku 997 zabili.\n\nJeho ostatky se nakonec vrátily domů. V jistém smyslu i jeho tvář: o staletí později umístil sochař Josef Václav Myslbek jeho postavu k patě sochy svatého Václava na Václavském náměstí, vedle Ludmily, Prokopa a Anežky — stejné čtveřice světců, která už byla představena v kapitole o Václavovi samotném. Biskup, který v Praze nikdy dlouho nevydržel, tam nakonec zůstal navždy — v bronzu.",
      zh: "沃伊捷赫——更为人熟知的坚振教名是阿达尔伯特——于983年成为波希米亚第二任主教，也是首位土生土长的捷克裔主教，他大半个任期都陷在与波希米亚贵族的持续冲突之中——一夫多妻、教士婚姻、斋戒纪律，这些他想改革的事，贵族们根本没兴趣配合。他两次出走布拉格，每次都逃往罗马，而不是留在国内把事情争到底；两次出走之间，他于993年创立了布热夫诺夫修道院，是波希米亚土地上的第一座修道院。995年利比采屠杀发生时，他正第二次身在罗马，此后他再也没有真正回来主持教区事务——而是北上向异教普鲁士人传教，997年，他们为此杀害了他。\n\n他的遗骨最终被带回了故土。从某种意义上说，他的容貌也一样：几个世纪后，雕塑家约瑟夫·瓦茨拉夫·米斯尔贝克把他的雕像立在了瓦茨拉夫广场骑马像的基座上，与鲁德米拉、普罗科普、阿格尼丝并列——正是在瓦茨拉夫那一章里已经介绍过的同一组四位圣人。这位在布拉格从未久留的主教，最终却在那里永远留了下来——以青铜的形式。",
    },
    relatedLandmarks: [
      {
        slug: "bazilika-sv-margarety",
        relation: {
          en: "Adalbert founded this monastery in 993, between his two exiles to Rome — the oldest monastery in Bohemia, though what stands today is an 18th-century Baroque rebuild by Christoph Dientzenhofer, with only a Romanesque crypt surviving from his own time.",
          cz: "Vojtěch tento klášter založil v roce 993, mezi svými dvěma útěky do Říma — nejstarší klášter v Čechách, ačkoli to, co tu stojí dnes, je barokní přestavba Christopha Dientzenhofera z 18. století, z jeho vlastní doby se dochovala jen románská krypta.",
          zh: "阿达尔伯特于993年、在他两次流亡罗马之间创立了这座修道院——波希米亚最古老的修道院，不过如今矗立的建筑，是18世纪克里斯托夫·迪岑霍费尔主持的巴洛克式重建，只有一座罗马式地下墓室，是他自己那个年代留下的原物。",
        },
      },
      {
        slug: "pomnik-sv-vaclava",
        relation: {
          en: "The same statue introduced back in Wenceslas's own chapter — Adalbert is one of the four saints standing at its base, alongside Ludmila, Procopius, and Agnes.",
          cz: "Tatáž socha, která byla představena už v kapitole o Václavovi — Vojtěch je jedním ze čtyř světců stojících u jejího podstavce, vedle Ludmily, Prokopa a Anežky.",
          zh: "就是“好公爵瓦茨拉夫”那一节里介绍过的同一座雕像——阿达尔伯特正是站在基座上的四位圣人之一，与鲁德米拉、普罗科普、阿格尼丝并列。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Adalbert_of_Prague",
  },
  {
    slug: "poles-take-prague-1003",
    era: "bohemian-duchy",
    startYear: 1003,
    year: {
      en: "1003–1004",
      cz: "1003–1004",
      zh: "1003年－1004年",
    },
    tone: "humorous",
    title: {
      en: "The Poles Are Here",
      cz: "Poláci jsou tu",
      zh: "波兰人来了",
    },
    hookLine: {
      en: "Six years after Adalbert died trying to convert the Prussians, Bohemia's own ruling family managed to lose the country to its neighbours without a single battle.",
      cz: "Šest let po tom, co Vojtěch zemřel při pokusu obrátit Prusy na víru, se vlastní česká panovnická rodina dokázala připravit o zemi ve prospěch sousedů, aniž by padla jediná bitva.",
      zh: "阿达尔伯特为感化普鲁士人而殉道六年后，波希米亚自己的统治家族，竟然在没打一仗的情况下，就把国家拱手让给了邻居。",
    },
    summary: {
      en: "Duke Boleslaus II died in 999, and what followed was one of the messiest successions Bohemia ever produced. His son Boleslaus III — remembered, not fondly, as 'the Red' — proved so violent and erratic a ruler that he was deposed within three years, restored in 1003 with Polish military backing, and then immediately undermined himself by massacring the Vršovci noble clan at Vyšehrad.\n\nThe survivors fled straight to the same Polish duke who'd just helped restore him, Bolesław the Brave, begging for rescue instead. Bolesław obliged — by invading Bohemia himself, walking into Prague without a fight, trapping Boleslaus III, blinding him, and locking him away for the rest of his life (he never set foot in Bohemia again, dying in captivity some thirty years later). For over a year, Bohemia was, in every practical sense, a Polish possession, with Bolesław ruling from Prague as its duke. It took the German king Henry II stepping in on Boleslaus III's brother's behalf to reverse it: in 1004, Jaromír retook Prague with Henry's backing and received the duchy back as an imperial fief. Bohemia's own royal family, in other words, briefly managed to lose the country to a neighbour — through nothing more than sheer incompetence.",
      cz: "Kníže Boleslav II. zemřel roku 999 a to, co následovalo, patří k nejzmatenějším nástupnictvím, jaké kdy Čechy zažily. Jeho syn Boleslav III. — v paměti přezdívaný, nikoli z lásky, „Ryšavý\" — se ukázal jako natolik násilnický a nevyzpytatelný vládce, že byl do tří let sesazen, roku 1003 obnoven na trůně s pomocí polského vojska, a vzápětí se sám podkopal masakrem rodu Vršovců na Vyšehradě.\n\nPřeživší uprchli rovnou za tím samým polským knížetem, který ho právě předtím pomohl dosadit zpět — Boleslavem Chrabrým — a prosili tentokrát o záchranu před ním. Boleslav Chrabrý vyhověl — vpádem do Čech na vlastní pěst, vstupem do Prahy bez jediné bitvy, zajetím Boleslava III., jeho oslepením a doživotním uvězněním (do Čech se už nikdy nevrátil a zemřel v zajetí asi o třicet let později). Přes rok byly Čechy prakticky polským majetkem, s Boleslavem vládnoucím z Prahy jako jejich kníže. Zvrátit to dokázal až německý král Jindřich II., který se postavil na stranu bratra Boleslava III.: roku 1004 dobyl Jaromír s Jindřichovou podporou zpět Prahu a přijal knížectví zpátky jako říšské léno. Vlastní česká panovnická rodina tak na čas dokázala přijít o zemi ve prospěch souseda — a to čirou neschopností.",
      zh: "公爵博莱斯拉夫二世于999年去世，随之而来的，是波希米亚历史上最混乱的一次继承。他的儿子博莱斯拉夫三世——史书上并不友善地称他为“赤发王”——统治残暴失序，不到三年就被赶下台，1003年靠波兰军队协助复位，却又立刻在维谢赫拉德屠杀维尔绍夫奇贵族家族，把自己彻底作死。\n\n幸存者径直逃去投奔那位刚刚帮他复位的波兰公爵——“勇敢者”博莱斯瓦夫一世——这次是求他来“解救”波希米亚。博莱斯瓦夫一世倒也没推辞——他索性亲自出兵波希米亚，不费一兵一卒就进了布拉格，将博莱斯拉夫三世擒获、弄瞎双眼、终身囚禁（此后他再未踏上波希米亚的土地，约三十年后死于囚禁之中）。此后一年多的时间里，波希米亚实质上成了波兰的属地，博莱斯瓦夫一世本人坐镇布拉格，以公爵身份统治。最终是德意志国王亨利二世介入，站在博莱斯拉夫三世的兄弟一边，才扭转了局面：1004年，雅罗米尔在亨利二世的支持下夺回布拉格，重新以帝国封臣的身份获得公国。换句话说，波希米亚自己的王室，曾一度靠着纯粹的无能，把国家白白让给了邻居。",
    },
    relatedLandmarks: [
      {
        slug: "vysehrad-wall-walkway",
        relation: {
          en: "This is where Boleslaus III massacred the Vršovci clan in 1003 — the very act of self-sabotage that triggered the Polish invasion and briefly cost Bohemia its independence altogether.",
          cz: "Právě tady nechal Boleslav III. v roce 1003 vyvraždit rod Vršovců — přesně ten sebedestruktivní čin, který spustil polskou invazi a na čas stál Čechy úplně celou samostatnost.",
          zh: "博莱斯拉夫三世正是在这里于1003年屠杀了维尔绍夫奇家族——正是这个自毁式的举动，引爆了波兰的入侵，一度让波希米亚彻底丧失了独立地位。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Boleslaus_III,_Duke_of_Bohemia",
  },
  {
    slug: "kidnapped-duchess-1019",
    era: "bohemian-duchy",
    startYear: 1019,
    year: {
      en: "c. 1019–1021",
      cz: "kolem 1019–1021",
      zh: "约1019年－1021年",
    },
    tone: "humorous",
    title: {
      en: "The Kidnapped Duchess",
      cz: "Unesená kněžna",
      zh: "绑来的公爵夫人",
    },
    hookLine: {
      en: "A generation after Bohemia briefly lost itself to a neighbour, a young nobleman with no legal right to marry well decided to just take what the rules wouldn't give him.",
      cz: "O generaci později, poté co Čechy na čas ztratily samy sebe ve prospěch souseda, se mladý šlechtic bez zákonného nároku na výhodný sňatek rozhodl si prostě vzít to, co mu pravidla nechtěla dát.",
      zh: "一代人之后，就在波希米亚刚刚差点把自己弄丢给邻国不久，一位没有资格靠正当途径娶到好人家的年轻贵族，决定干脆自己动手，抢来规矩不肯给他的东西。",
    },
    summary: {
      en: "Břetislav — decades before anyone called him the 'Bohemian Achilles,' let alone before he wrote the rulebook Bohemia's succession would follow for the next century and a half — had a problem: he was the illegitimate son of Duke Oldřich, which made marrying into a family as well-connected as he needed both socially awkward and practically impossible through normal channels.\n\nSo, around 1019, he simply skipped the normal channels. He rode into Schweinfurt in Bavaria, entered the convent where Judith, daughter of the local margrave, was staying, and carried her off to marry her himself — an abduction chroniclers recorded without recording any punishment for it. It worked. Bohemia got a duchess, Břetislav got the connections his birth alone couldn't buy him, and the same man who'd later spend his final years imposing a rigid, orderly rule for who gets to inherit power began his own adult life by simply deciding the rules didn't apply to him.",
      cz: "Břetislav — desítky let předtím, než mu kdokoli začal říkat „český Achilles\", natož než sepsal pravidlo, podle kterého se české nástupnictví řídilo dalších sto padesát let — měl jeden problém: byl nemanželským synem knížete Oldřicha, což sňatek s natolik dobře napojenou rodinou, jakou potřeboval, dělalo společensky trapným i prakticky nemožným běžnou cestou.\n\nKolem roku 1019 tedy tu běžnou cestu jednoduše přeskočil. Přijel do bavorského Schweinfurtu, vstoupil do kláštera, kde pobývala Jitka, dcera tamního markraběte, a odvezl si ji s sebou, aby si ji vzal za ženu — únos, který kronikáři zaznamenali, aniž by zaznamenali za něj jakýkoli trest. Fungovalo to. Čechy získaly kněžnu, Břetislav získal spojenectví, které mu samotný jeho původ nikdy nemohl zajistit — a tentýž muž, který na sklonku života prosadil přísné, uspořádané pravidlo, kdo smí zdědit moc, začal svůj dospělý život prostým rozhodnutím, že pravidla se ho netýkají.",
      zh: "布热季斯拉夫——在任何人称他为“捷克的阿基里斯”之前几十年，更早于他后来立下那条支配波希米亚继承制度长达一个半世纪的规矩之前——曾面对一个难题：他是奥尔德里希公爵的私生子，这个出身让他想通过正常途径迎娶一位门当户对、家世显赫的女子，既尴尬又几乎不可能。\n\n于是大约在1019年，他索性绕开了正常途径。他策马赶到巴伐利亚的施瓦因富特，闯入当地边区伯爵之女尤迪特所在的修道院，把她带走，强行娶她为妻——编年史家记下了这场绑架，却没有记下任何惩罚。这招奏效了。波希米亚由此有了一位公爵夫人，布热季斯拉夫也因此得到了单凭出身永远换不来的人脉与联姻关系——而正是这个人，日后在生命的最后阶段确立了一套严格有序、规定谁有权继承权力的规矩，他自己的成年生活，却是从“规矩管不着我”这个决定开始的。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Judith_of_Schweinfurt",
  },
  {
    slug: "bretislav-succession-law-1055",
    era: "bohemian-duchy",
    startYear: 1055,
    year: {
      en: "1039–1055",
      cz: "1039–1055",
      zh: "1039年－1055年",
    },
    tone: "humorous",
    title: {
      en: "The Rule That Explains Everything After",
      cz: "Pravidlo, které vysvětluje všechno, co přišlo potom",
      zh: "一条解释了后来一切的规矩",
    },
    hookLine: {
      en: "Nicknamed the 'Bohemian Achilles' for his military record, Duke Břetislav I left Bohemia one more thing on his deathbed: the reason its royal crowns kept slipping off.",
      cz: "Kníže Břetislav I., přezdívaný pro své vojenské úspěchy „český Achilles\", zanechal Čechám na smrtelné posteli ještě jednu věc: důvod, proč jim ty královské koruny pořád sklouzávaly z hlavy.",
      zh: "布热季斯拉夫一世公爵，因战功显赫而被称为“捷克的阿基里斯”，在临终前还给波希米亚留下了另一样东西：解释了此后王冠为何总是戴不稳的那条规矩。",
    },
    summary: {
      en: "Břetislav I earned his 'Bohemian Achilles' nickname the hard way: raiding into Poland in 1039, sacking Gniezno, and bringing home the relics of St. Adalbert — the same bishop killed in Prussia four decades earlier — to install at St. Vitus.\n\nBut his more consequential legacy came right at the end of his life, in a decree issued around 1055 that set the rule for who got to be duke next: not the eldest son, but the eldest surviving male of the entire Přemyslid line, with the duchy kept whole rather than divided among heirs. The idea was to spare Bohemia from being ruled by children and to hold the dynasty together as one house. What it actually produced was three-quarters of a century of cousins, uncles, and nephews jockeying for a title that could land on almost any of them — which is exactly the unstable backdrop against which Vratislaus II and Vladislaus II later had to go begging emperors for personal, one-generation crowns instead of anything more permanent. Bohemia wouldn't get a succession an emperor could safely make hereditary until Otakar I broke the pattern in 1198.",
      cz: "Břetislav I. si přezdívku „český Achilles\" vysloužil tvrdě: v roce 1039 vpadl do Polska, vyplenil Hnězdno a přivezl domů ostatky svatého Vojtěcha — téhož biskupa, který byl o čtyři desetiletí dřív zabit v Prusku — aby je uložil u svatého Víta.\n\nJeho důležitější odkaz ale přišel až na samém konci jeho života, ve výnosu vydaném kolem roku 1055, který stanovil pravidlo, kdo se dál stane knížetem: ne nejstarší syn, ale nejstarší žijící muž z celé přemyslovské linie, přičemž knížectví mělo zůstat celistvé, ne rozdělené mezi dědice. Myšlenka byla ušetřit Čechy vlády dětí a udržet dynastii pohromadě jako jeden rod. Co to skutečně přineslo, byly tři čtvrtiny století bratranců, strýců a synovců, kteří se přetahovali o titul, jenž mohl připadnout téměř komukoli z nich — a přesně na tomhle nestabilním pozadí museli Vratislav II. a Vladislav II. později prosit císaře o osobní, jednogenerační koruny místo čehokoli trvalejšího. Nástupnictví, které by si císař mohl bezpečně dovolit učinit dědičným, Čechy nedostaly, dokud Otakar I. v roce 1198 tenhle vzorec neprolomil.",
      zh: "布热季斯拉夫一世靠的是实打实的战功，才赢得了“捷克的阿基里斯”这个绰号：1039年他挥师波兰，攻陷格涅兹诺，并把圣阿达尔伯特的遗骨——正是四十年前在普鲁士遇害的那位主教——带回布拉格，安放在圣维特。\n\n但他真正影响更深远的遗产，是在他生命的最后阶段颁布的一道法令，大约在1055年，确立了此后由谁继任公爵的规矩：不是长子继承，而是由整个普热美斯尔家族里在世的最年长男性继承，公国要保持完整，不再在诸子间分割。这个想法的初衷，是让波希米亚免于由孩童执政，并把整个家族维系为一体。但它实际造成的结果，是接下来四分之三个世纪里，堂表兄弟、叔伯侄甥为一个几乎人人都有资格染指的头衔明争暗斗——而正是在这样一片动荡不安的背景之下，弗拉季斯拉夫二世和弗拉迪斯拉夫二世后来才不得不向皇帝乞求那种仅限个人、只管一代的王冠，而非任何更持久的东西。直到1198年奥托卡一世打破了这个循环之前，波希米亚始终没能等来一套让皇帝敢于放心确立为世袭的继承制度。",
    },
    relatedLandmarks: [
      {
        slug: "prague-castle",
        relation: {
          en: "Where Břetislav installed St. Adalbert's recovered relics in 1039 — the same cathedral site that, by now, had already anchored a bishopric and would go on to anchor a kingdom.",
          cz: "Kam Břetislav v roce 1039 uložil znovuzískané ostatky svatého Vojtěcha — totéž katedrální místo, které v tu dobu už neslo biskupství a časem poneslo i království.",
          zh: "布热季斯拉夫在1039年将寻回的圣阿达尔伯特遗骨安放于此——同一处大教堂所在地，此时已经承载过一个主教区，日后还将承载起一个王国。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bretislav_I",
  },
  {
    slug: "vysehrad-revival-1070",
    era: "bohemian-duchy",
    startYear: 1070,
    year: {
      en: "1070",
      cz: "1070",
      zh: "1070年",
    },
    tone: "humorous",
    title: {
      en: "Vyšehrad's Second Act, Courtesy of a Feuding Brother",
      cz: "Druhé dějství Vyšehradu, díky sourozenecké při",
      zh: "维谢赫拉德的复兴，缘于兄弟阋墙",
    },
    hookLine: {
      en: "Břetislav's tidy succession rule didn't stop his own sons from fighting — it just gave the fighting a slightly more formal shape.",
      cz: "Břetislavovo úhledné pravidlo nástupnictví jeho vlastním synům rvačky nezabránilo — jen jim dalo o něco formálnější podobu.",
      zh: "布热季斯拉夫那套整整齐齐的继承规矩，并没能阻止他自己的儿子们互相争斗——只是让这场争斗多了几分表面上的规矩。",
    },
    summary: {
      en: "Vratislaus, the future king of 1085, spent years locked in a very personal feud with his own younger brother — Jaromír, who'd become Bishop of Prague. The two needled each other constantly: Vratislaus reportedly wore bishop's vestments around Jaromír just to provoke him; Jaromír retaliated by ignoring the new Moravian diocese Vratislaus had created, and at one point even seized church relics by force to make his point.\n\nIn 1070, Vratislaus found a more permanent way to win the argument: he richly endowed the Vyšehrad Chapter, based at the Basilica of Saints Peter and Paul — the same hilltop stronghold whose founding this timeline covered generations earlier — and had it placed under the direct authority of Rome, answerable to the Pope rather than to his own brother. It was, in effect, a second act for Vyšehrad: no longer just the legendary seat from Bohemia's earliest days, but now a genuine rival religious power centre, deliberately built to outflank the one institution in Prague his brother actually controlled.",
      cz: "Vratislav, budoucí král z roku 1085, strávil léta ve velmi osobním sporu s vlastním mladším bratrem — Jaromírem, který se stal pražským biskupem. Oba se soustavně škádlili: Vratislav prý kolem Jaromíra chodil v biskupském rouchu, jen aby ho popíchl; Jaromír mu to oplácel ignorováním nové moravské diecéze, kterou Vratislav založil, a jednou dokonce z principu násilím zabavil církevní ostatky.\n\nV roce 1070 našel Vratislav trvalejší způsob, jak spor vyhrát: bohatě obdaroval vyšehradskou kapitulu, sídlící při bazilice svatého Petra a Pavla — na témže návrší, jehož založení tato časová osa popsala už o generace dřív — a podřídil ji přímo Římu, tedy papeži, nikoli vlastnímu bratrovi. Byl to fakticky druhý akt Vyšehradu: už nejen legendární sídlo z nejranějších českých dějin, ale teď i skutečné konkurenční církevní mocenské centrum, záměrně vybudované tak, aby obešlo tu jedinou pražskou instituci, kterou jeho bratr skutečně ovládal.",
      zh: "未来1085年的国王弗拉季斯拉夫，曾多年陷于一场与自己弟弟——后来成为布拉格主教的亚罗米尔——之间十分私人的恩怨。两人不断互相刁难：据记载，弗拉季斯拉夫会特意穿上主教礼服在亚罗米尔面前晃悠，就为了惹恼他；亚罗米尔的回击，则是无视弗拉季斯拉夫新设立的摩拉维亚教区，甚至有一次直接动用武力夺走教会圣物，以示不满。\n\n1070年，弗拉季斯拉夫找到了一个更持久的方式来赢下这场较量：他大手笔资助了维谢赫拉德教士团——驻地正是圣彼得保罗教堂，也就是这条时间轴早在几代人之前就已经讲过其奠基故事的那座山丘据点——并让这个教士团直接隶属于罗马教廷，只听命于教皇，而不是自己的亲弟弟。这实质上是维谢赫拉德的“第二幕”：它不再只是波希米亚最早岁月里那个传说中的据点，如今更成了一个真正的、与布拉格分庭抗礼的宗教权力中心，专为绕开弟弟真正掌控的那个机构而精心打造。",
    },
    relatedLandmarks: [
      {
        slug: "basilika-sv-petra-pavla",
        relation: {
          en: "The very hilltop this timeline first introduced generations ago, in the legendary founding of Vyšehrad — this 1070 chapter is its real second act: no longer myth, but genuine institutional power, deliberately built to answer to Rome instead of Vratislaus's own brother.",
          cz: "Totéž návrší, které tato časová osa poprvé představila o generace dřív, při legendárním založení Vyšehradu — kapitula z roku 1070 je jeho skutečným druhým dějstvím: už ne mýtus, ale opravdová institucionální moc, záměrně podřízená Římu místo Vratislavova vlastního bratra.",
          zh: "就是这条时间轴几代人之前、在维谢赫拉德的传说建立之节中最早介绍过的那座山丘——1070年的这个教士团，是它真正的“第二幕”：不再只是传说，而是货真价实的建制权力，专门设计成只听命于罗马、而非弗拉季斯拉夫自己的弟弟。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vratislaus_II_of_Bohemia",
  },
  {
    slug: "vratislaus-ii-first-crown-1085",
    era: "bohemian-duchy",
    startYear: 1085,
    year: {
      en: "1085–1092",
      cz: "1085–1092",
      zh: "1085年－1092年",
    },
    tone: "humorous",
    title: {
      en: "Bohemia's First Borrowed Crown",
      cz: "První vypůjčená koruna Čech",
      zh: "波希米亚第一次借来的王冠",
    },
    hookLine: {
      en: "With his brother's church neatly outflanked, Vratislaus went looking for an even bigger prize — and in 1085, he got it, on loan.",
      cz: "S bratrovou církví elegantně obejitou se Vratislav poohlédl po ještě větší trofeji — a v roce 1085 ji dostal, ovšem jen na dobu určitou.",
      zh: "巧妙绕开了弟弟掌控的教会之后，弗拉季斯拉夫又把目光投向了一份更大的奖赏——1085年，他如愿以偿，只不过是租来的。",
    },
    summary: {
      en: "In 1085, Vratislaus talked Holy Roman Emperor Henry IV into a royal crown — a personal, one-time honour, not a hereditary title for his house. He spent the seven years he had it as king based at Vyšehrad, the power centre he'd already spent fifteen years building up specifically to answer to no one in Prague, least of all his brother.\n\nWhen Vratislaus died in 1092 after a hunting accident, the crown reverted to plain 'duke' along with everyone else — but he was buried at the Basilica of Saints Peter and Paul all the same, in the ground he'd already made unmistakably his own.",
      cz: "V roce 1085 přemluvil Vratislav římského krále Jindřicha IV. ke královské koruně — osobnímu, jednorázovému vyznamenání, ne dědičnému titulu pro celý rod. Sedm let, po která ji nosil jako král, strávil sídlem na Vyšehradě, mocenském centru, které si už patnáct let předtím vybudoval přesně proto, aby v Praze nemusel nikomu skládat účty — nejméně ze všech vlastnímu bratrovi.\n\nKdyž Vratislav v roce 1092 zemřel po loveckém úrazu, vrátila se koruna spolu se vším ostatním zpátky ke knížecímu titulu — pohřben byl ale přesto u baziliky svatého Petra a Pavla, na půdě, kterou si už dávno nezpochybnitelně učinil svou.",
      zh: "1085年，弗拉季斯拉夫说服神圣罗马皇帝亨利四世授予自己国王头衔——这是一份个人的、仅限终身的荣誉，并非授予整个家族的世袭头衔。他以国王身份在位的这七年里，始终驻扎在维谢赫拉德——那个他早在十五年前就已经开始经营的权力中心，专门为了不必对布拉格的任何人负责而打造，尤其是不必对自己的弟弟负责。\n\n1092年，弗拉季斯拉夫因狩猎事故去世，王冠连同其他一切一起重新降回“公爵”头衔——但他仍然被安葬在了圣彼得保罗圣殿，那片他早就毫无争议地据为己有的土地上。",
    },
    relatedLandmarks: [
      {
        slug: "basilika-sv-petra-pavla",
        relation: {
          en: "Where Vratislaus was buried in 1092 after his crown reverted — not a new claim on this hilltop, just the final one, on ground he'd already spent fifteen years making unmistakably his.",
          cz: "Kam byl Vratislav v roce 1092 pohřben poté, co se jeho koruna vrátila zpět — ne nový nárok na tomto návrší, jen ten poslední, na půdě, kterou si už patnáct let předtím nezpochybnitelně učinil svou.",
          zh: "弗拉季斯拉夫王冠被收回后、于1092年安葬于此——这并非他在这座山丘上提出的新主张，而是最后一个：这片土地，他早在十五年前就已经毫无争议地据为己有。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vratislaus_II_of_Bohemia",
  },
  {
    slug: "battle-of-chlumec-1126",
    era: "bohemian-duchy",
    startYear: 1126,
    year: {
      en: "1126 (February 18)",
      cz: "1126 (18. února)",
      zh: "1126年（2月18日）",
    },
    tone: "humorous",
    title: {
      en: "The Battle Bohemia Actually Won",
      cz: "Bitva, kterou Čechy skutečně vyhrály",
      zh: "波希米亚真正打赢的那一仗",
    },
    hookLine: {
      en: "Vratislaus's own descendants spent the next generation fighting each other for the succession he'd left behind — and one of those fights actually mattered.",
      cz: "Vratislavovi vlastní potomci strávili další generaci vzájemným bojem o dědictví, které po sobě zanechal — a jedna z těch bitev na tom skutečně záležela.",
      zh: "弗拉季斯拉夫的后代们，接下来一代人的时间都在为他留下的继承权互相争斗——而其中有一场，是真正有分量的。",
    },
    summary: {
      en: "Břetislav's 1055 decree was meant to prevent exactly this, and failed: the next three decades saw dukes come and go at a startling rate — one lasting eight months, one assassinated, one deposed twice — cousins fighting cousins for the title again and again. By 1126, one more round was due.\n\nWhen Duke Vladislav I died in 1125, his brother Soběslav I claimed the succession — not Vladislav's own son, the future king Vladislaus II, still a generation away. A rival cousin, Otto II of Olomouc, contested the claim and brought in Holy Roman Emperor Lothar III himself, marching an invading army into Bohemia to install Otto instead.\n\nOn 18 February 1126, near the village of Chlumec, Soběslav's forces crushed them — Otto was killed in the fighting, and Lothar III himself was taken prisoner. Soběslav released the emperor in exchange for formal investiture as duke, a face-saving technicality that let Lothar go home without admitting the obvious: Bohemia had just beaten the Holy Roman Empire on its own soil.\n\nSoběslav commemorated the win by rebuilding and enlarging an existing rotunda on the summit of Říp — the same hill Czech legend already credited as the mythical resting place of the first Czechs to settle the land — one of the oldest monuments the country still has. It was, for once, a Bohemian ruler securing his position through outright victory rather than a borrowed crown or a lucky marriage, and it bought Soběslav an untroubled fifteen years on the throne.",
      cz: "Břetislavův výnos z roku 1055 měl přesně tomuhle zabránit, a nezabránil: další tři desetiletí přinesla rychlý sled knížat — jedno vydrželo osm měsíců, jedno bylo zavražděno, jedno bylo dvakrát sesazeno — bratranci se o titul rvali s bratranci znovu a znovu. Do roku 1126 zbývalo ještě jedno kolo.\n\nKdyž v roce 1125 zemřel kníže Vladislav I., nárokoval si nástupnictví jeho bratr Soběslav I. — ne jeho vlastní syn, budoucí král Vladislav II., na kterého ještě čekala celá generace. Soupeřící bratranec, Ota II. Olomoucký, nárok napadl a přivedl samotného římského krále Lothara III., který vtáhl s vojskem do Čech, aby na trůn dosadil Otu místo Soběslava.\n\n18. února 1126, poblíž vesnice Chlumec, jejich vojska Soběslavovy oddíly rozdrtily — Ota v boji padl a samotný Lothar III. byl zajat. Soběslav propustil krále výměnou za formální investituru coby kníže, tvářnost zachraňující formalitu, díky které se Lothar mohl vrátit domů, aniž by musel přiznat to zjevné: Čechy právě porazily Svatou říši římskou na jejím vlastním území.\n\nSoběslav vítězství oslavil přestavbou a rozšířením už existující rotundy na vrcholu Řípu — téže hory, kterou česká pověst už dřív spojovala s legendárním místem odpočinku prvních Čechů, kteří tuto zemi osídlili — jedné z nejstarších dochovaných památek v zemi. Byl to, tentokrát výjimečně, český panovník, který si upevnil postavení skutečným vítězstvím, ne vypůjčenou korunou nebo šťastným sňatkem — a vykoupilo mu to patnáct klidných let na trůně.",
      zh: "布热季斯拉夫1055年颁布的那道法令，本该防止的正是这种局面，结果却没能防止：接下来三十年里，波希米亚公爵走马灯般更迭——一位在位仅八个月，一位遇刺身亡，一位两度被废——堂兄弟之间为这个头衔一次又一次地互相开战。到1126年，这场循环还剩最后一轮。\n\n1125年，公爵弗拉迪斯拉夫一世去世，他的弟弟索别斯拉夫一世宣称继承权——并非他本人的儿子、日后的国王弗拉迪斯拉夫二世，后者还要再等一代人才轮到自己。竞争对手、堂兄弟奥洛穆茨的奥托二世对此提出异议，并搬来了神圣罗马帝国皇帝洛泰尔三世本人，亲率大军入侵波希米亚，试图改立奥托。\n\n1126年2月18日，在赫卢梅茨村附近，索别斯拉夫的军队将其彻底击溃——奥托战死沙场，洛泰尔三世本人也被俘虏。索别斯拉夫最终释放了这位皇帝，条件是换取一份正式的册封仪式——这是一个给足了皇帝面子的形式，让洛泰尔得以体面回国，而不必承认那个明摆着的事实：波希米亚刚刚在自己的国土上，打赢了神圣罗马帝国。\n\n索别斯拉夫用重建并扩建日普山顶上一座既有的圆形教堂来纪念这场胜利——而这座山，早已被捷克传说认定为最早定居这片土地的捷克人的传说安息之地——如今仍是这个国家现存最古老的古迹之一。这一次，难得地，是一位波希米亚统治者靠着堂堂正正的军事胜利、而非借来的王冠或幸运的联姻，稳固了自己的地位——也换来了他此后十五年安稳的统治。",
    },
    relatedLandmarks: [
      {
        slug: "rotunda-svateho-jiri-rip",
        relation: {
          en: "Soběslav had this rotunda enlarged right after Chlumec to commemorate the win — on a hill Czech legend already considered sacred ground long before any battle was fought here.",
          cz: "Soběslav nechal tuto rotundu rozšířit hned po Chlumci na oslavu vítězství — na kopci, který česká pověst považovala za posvátnou půdu dávno předtím, než se tu odehrála jakákoli bitva.",
          zh: "索别斯拉夫在赫卢梅茨战役后立刻下令扩建了这座圆形教堂，以纪念这场胜利——而这座山，早在这里发生任何战役之前，就已经被捷克传说视为圣地。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Battle_of_Chlumec_(1126)",
  },
  {
    slug: "vladislaus-ii-second-crown-1158",
    era: "bohemian-duchy",
    startYear: 1158,
    year: {
      en: "1158–1173",
      cz: "1158–1173",
      zh: "1158年－1173年",
    },
    tone: "humorous",
    title: {
      en: "Bohemia's Second Borrowed Crown",
      cz: "Druhá vypůjčená koruna Čech",
      zh: "波希米亚第二次借来的王冠",
    },
    hookLine: {
      en: "Soběslav's own nephew inherited the duchy in 1140 — and picked up right where his father and uncle had left off, chasing the same not-quite-permanent prize.",
      cz: "Soběslavův vlastní synovec zdědil knížectví v roce 1140 — a navázal přesně tam, kde jeho otec a strýc přestali, honbou za stejnou, ne tak docela trvalou trofejí.",
      zh: "索别斯拉夫自己的侄子于1140年继承了公国——并且延续了他父亲和叔叔未竟的事业，追逐着同一份并不那么持久的荣耀。",
    },
    summary: {
      en: "Vladislaus II — son of the Vladislav I who'd died in 1125, and nephew of Soběslav I, whose victory at Chlumec he inherited the benefits of — became duke in 1140 and spent nearly two decades looking for the same prize his uncle Vratislaus had briefly held seventy years earlier. He got it in 1158, when Holy Roman Emperor Frederick Barbarossa crowned him king in gratitude for Bohemian troops backing his campaigns in Lombardy.\n\nVladislaus wore the crown for fifteen years before abdicating in 1173 in favour of his own son — at which point, exactly like his uncle before him, the title reverted to plain duke for whoever came next. Twice now, Bohemia had tried on a crown that fit for exactly one lifetime and no longer.",
      cz: "Vladislav II. — syn Vladislava I., který zemřel v roce 1125, a synovec Soběslava I., jehož vítězství u Chlumce po něm zdědil výhody — se stal knížetem roku 1140 a téměř dvě desetiletí hledal stejnou trofej, kterou jeho strýc Vratislav krátce držel o sedmdesát let dřív. Dočkal se jí roku 1158, kdy ho římský král Fridrich Barbarossa korunoval králem jako vděk za české oddíly podporující jeho tažení v Lombardii.\n\nVladislav nosil korunu patnáct let, než v roce 1173 abdikoval ve prospěch vlastního syna — a přesně jako u jeho strýce před ním se titul vrátil zpátky ke knížecímu, ať už po něm nastoupil kdokoli. Čechy si tak podruhé vyzkoušely korunu, která padla přesně na jeden život a ani o den déle.",
      zh: "弗拉迪斯拉夫二世——1125年去世的弗拉迪斯拉夫一世之子，也是索别斯拉夫一世的侄子，承袭了叔叔在赫卢梅茨战役中赢得的政治红利——于1140年成为公爵，并花了将近二十年时间，追寻着他叔叔弗拉季斯拉夫七十年前曾短暂拥有过的那份荣耀。1158年，他终于如愿：神圣罗马帝国皇帝“红胡子”腓特烈一世，为答谢波希米亚军队支援他在伦巴第的战事，加冕他为国王。\n\n弗拉迪斯拉夫戴着这顶王冠十五年，直到1173年主动退位、传给自己的儿子——而就像他叔叔当年一样，这个头衔随即又降回了公爵，无论接下来是谁继位。波希米亚由此第二次尝到了一顶只合身一辈子、绝不多留一天的王冠。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vladislaus_II,_Duke_and_King_of_Bohemia",
  },
  {
    // Deliberate cross-chapter foreshadowing (2026-08): the Judith Bridge is
    // Prague's first stone crossing, destroyed in the 1342 flood and rebuilt
    // on nearly the same site as Charles Bridge under Charles IV. That
    // future event — expected in Era 3 (medieval-golden-age), not yet
    // seeded — should explicitly reference this one back (Charles Bridge
    // exists because this bridge didn't survive) rather than introducing
    // Charles Bridge as if the Vltava had no crossing before it.
    slug: "judith-bridge-1170",
    era: "bohemian-duchy",
    startYear: 1170,
    year: {
      en: "c. 1170",
      cz: "kolem 1170",
      zh: "约1170年",
    },
    tone: "humorous",
    title: {
      en: "The River's First Bridge",
      cz: "První most přes řeku",
      zh: "河上第一座桥",
    },
    hookLine: {
      en: "Somewhere in his fifteen years as king, Vladislaus also found time to give Prague something considerably more useful than a crown he wouldn't get to keep.",
      cz: "Někde během těch patnácti let na trůně si Vladislav našel čas i na to, dát Praze něco podstatně užitečnějšího než korunu, kterou si stejně neponechá.",
      zh: "在他十五年的国王任期里，弗拉迪斯拉夫还抽出时间，给布拉格留下了一样比他终将失去的王冠有用得多的东西。",
    },
    summary: {
      en: "Sometime around 1170, Vladislaus had Prague's first stone bridge built across the Vltava, linking the Old Town to the settlements below Prague Castle — one of the earliest stone bridges anywhere in Central Europe, named the Judith Bridge after his wife. Before it, crossing the river meant a ford or a ferry; after it, Prague had a permanent stone spine holding its two halves together, over a century and a half before anyone had heard of Charles IV.\n\nThe bridge stood for roughly 170 years, until a catastrophic flood in 1342 swept most of it away — and its replacement, commissioned a few years later by Charles IV on almost the same site, is the one every visitor photographs today. Before there was a Charles Bridge, in other words, there was this one, and Charles Bridge exists more or less because this one didn't survive.",
      cz: "Někdy kolem roku 1170 nechal Vladislav postavit první kamenný most v Praze přes Vltavu, spojující Staré Město s osadami pod Pražským hradem — jeden z nejstarších kamenných mostů kdekoli ve střední Evropě, pojmenovaný Juditin most po jeho manželce. Před ním se řeka překonávala brodem nebo převozem; po něm měla Praha trvalou kamennou páteř držící obě její poloviny pohromadě, a to víc než století a půl předtím, než kdokoli slyšel o Karlu IV.\n\nMost stál zhruba sto sedmdesát let, dokud ho ničivá povodeň v roce 1342 z velké části nestrhla — a jeho náhradu, kterou o pár let později nechal na téměř stejném místě postavit Karel IV., dnes fotí každý návštěvník. Jinými slovy: než byl Karlův most, byl tenhle — a Karlův most vlastně existuje hlavně proto, že tenhle nepřežil.",
      zh: "大约在1170年前后，弗拉迪斯拉夫下令在伏尔塔瓦河上建起了布拉格第一座石桥，将老城与布拉格城堡脚下的聚落连接起来——这是中欧现存最早的石桥之一，以他的妻子尤蒂特命名，即“尤蒂特桥”。在它建成之前，过河只能靠涉水或摆渡；有了它之后，布拉格终于有了一条永久性的石造脊梁，把这座城市的两半连在了一起——比任何人听说过查理四世都要早上一个半世纪还多。\n\n这座桥矗立了大约一百七十年，直到1342年一场毁灭性的洪水将其大部分冲毁——几年后，查理四世下令几乎在同一位置建起了它的替代者，也就是今天每一位游客都会拍照留念的那座桥。换句话说：在有查理大桥之前，先有的是这座桥——而查理大桥之所以存在，很大程度上正是因为这座桥没能撑下来。",
    },
    relatedLandmarks: [
      {
        slug: "malostranska-mostecka-vez",
        relation: {
          en: "The shorter of the two towers here is the one genuine physical survivor of the Judith Bridge — everything else of Vladislaus's original crossing is gone, replaced by the Charles Bridge you're standing on today.",
          cz: "Kratší z obou zdejších věží je jediným skutečným fyzickým pozůstatkem Juditina mostu — všechno ostatní z Vladislavova původního přemostění je pryč, nahrazeno Karlovým mostem, na kterém dnes stojíš.",
          zh: "这里较矮的那座塔，是尤蒂特桥留下的唯一真实物理遗存——弗拉迪斯拉夫当年那座桥的其余部分已经不复存在，取而代之的，正是你此刻脚下站立的这座查理大桥。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Judith_Bridge",
  },
  {
    slug: "otakar-hereditary-kingdom-1198",
    era: "bohemian-duchy",
    startYear: 1198,
    year: {
      en: "1198 (crowned), confirmed hereditary 1212",
      cz: "1198 (korunovace), dědičnost potvrzena 1212",
      zh: "1198年（加冕），1212年（确立世袭）",
    },
    tone: "humorous",
    title: {
      en: "A Crown That Finally Stuck",
      cz: "Koruna, která konečně vydržela",
      zh: "这一次，王冠终于戴稳了",
    },
    hookLine: {
      en: "Third time's the charm: this crown didn't get taken back.",
      cz: "Do třetice všeho dobrého: tuhle korunu už nikdo nesebral.",
      zh: "事不过三：这一次，没有人再把王冠收回去。",
    },
    summary: {
      en: "Přemysl Otakar I got his royal title the same way Vratislaus and Vladislaus had — as a reward for backing the right side in someone else's war, this time picking Philip of Swabia's claim to the German throne in 1198.\n\nWhat made this one different only became clear over the following years: rival claimant Otto IV recognised the title too in 1204, so did Pope Innocent III, and by the time Frederick II issued the Golden Bull of Sicily in 1212, the crown wasn't a personal favour anymore — it was made explicitly hereditary, binding on every future ruler of Bohemia. No one ever handed it back. The Duchy of Bohemia that had spent three centuries answering to Great Moravia, then Regensburg, then a rotating cast of emperors who lent out royal titles like library books, became the Kingdom of Bohemia and simply stayed that way.",
      cz: "Přemysl Otakar I. získal královský titul stejnou cestou jako předtím Vratislav a Vladislav — jako odměnu za podporu té správné strany v cizí válce, tentokrát tím, že se v roce 1198 postavil za nárok Filipa Švábského na německý trůn.\n\nCo bylo na tomhle případě jiné, se ukázalo až v následujících letech: soupeřící uchazeč Ota IV. titul v roce 1204 uznal také, stejně jako papež Inocenc III., a když v roce 1212 vydal Fridrich II. Zlatou bulu sicilskou, koruna už nebyla osobní laskavostí — byla výslovně prohlášena za dědičnou, závaznou pro každého budoucího panovníka Čech. Nikdo ji už nikdy nevrátil. České knížectví, které tři století odpovídalo nejdřív Velké Moravě, pak Řeznu, pak celé řadě císařů, kteří si královské tituly půjčovali jako knihy z knihovny, se stalo Českým královstvím — a prostě jím zůstalo.",
      zh: "普热米斯尔·奥托卡一世获得国王头衔的方式，跟弗拉季斯拉夫和弗拉迪斯拉夫如出一辙——都是靠在别人的战争里站对了队而换来的奖赏，这一次，他在1198年选择支持施瓦本的腓力争夺德意志王位。\n\n这一次真正不同之处，要到接下来的几年里才显现出来：竞争对手奥托四世在1204年也承认了他的王位，教皇英诺森三世同样如此，而当腓特烈二世于1212年颁布《西西里金玺诏书》时，这顶王冠已经不再是一份个人的恩惠——它被明确宣布为世袭，对波希米亚此后每一位统治者都具有约束力。此后再也没有人把它收回去。这个曾三百年来先后依附于大摩拉维亚、雷根斯堡、以及一连串像图书馆借书一样把国王头衔借来借去的历代皇帝的波希米亚公国，就此变成了波希米亚王国——并且，就这样一直是王国了。",
    },
    relatedLandmarks: [
      {
        slug: "old-royal-palace",
        relation: {
          en: "By the time Otakar I's crown became permanently hereditary in 1212, this was already the palace that came with it — three centuries after Bořivoj's modest first church, the same hilltop institution had grown all the way into the seat of an actual, permanent kingdom.",
          cz: "Když se v roce 1212 stala Otakarova koruna natrvalo dědičnou, byl tenhle palác už tím, co k ní patřilo — tři století po Bořivojově skromném prvním kostele dorostla táž instituce na tomtéž návrší až k sídlu skutečného, trvalého království.",
          zh: "到1212年奥托卡一世的王冠正式确立为世袭之时，这座宫殿早已是与这顶王冠相配的所在——距博日沃伊那座朴素的第一座教堂已过去了三个世纪，同一座山丘上的同一个机构，终于成长为一个真正、永久的王国的所在地。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Ottokar_I_of_Bohemia",
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
