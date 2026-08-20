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
    images: ["/history/prehistory.webp"],
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
    images: ["/history/libuse.webp"],
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
    images: ["/history/premysl.webp"],
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
        slug: "pomnik-premysla-orace",
        relation: {
          en: "The actual field, according to legend — where Přemysl was found mid-plough by Libuše's envoys, marked since 1841 by a monument built on the spot.",
          cz: "Skutečné pole, alespoň podle pověsti — kde Libušini poslové našli Přemysla uprostřed orání, od roku 1841 označené pomníkem postaveným přímo na místě.",
          zh: "传说中真正的那片田地——莉布谢的使团正是在这里找到正在犁地的普热米斯尔，自1841年起，此地立有一座纪念碑加以标记。",
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
    images: ["/history/sarka.webp"],
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
    images: ["/history/vysehrad.webp"],
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
    relatedLandmarks: [],
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
    images: ["/history/seven-dukes.webp"],
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
    images: ["/history/borivoj-first-duke.webp"],
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
    images: ["/history/borivoj-conversion-and-exile.webp"],
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
    images: ["/history/founding-of-prague-castle.webp"],
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
    images: ["/history/bohemia-independence-895.webp"],
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
    images: ["/history/ludmila.webp"],
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
    images: ["/history/wenceslas-life-and-reign.webp"],
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
    images: ["/history/st-wenceslas-murder.webp"],
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
    images: ["/history/lechfeld-955.webp"],
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
      en: "By 955, Boleslav had spent two decades expanding Bohemia into something close to a regional power, pushing its borders outward while fending off Otto I's own campaigns to bring him to heel.\n\nThat August, the two former enemies fought on the same side: Boleslav's troops joined Otto's coalition at the Battle of Lechfeld, where allied Christian forces broke the Magyar raiding armies that had been terrorising Central Europe for half a century — a battle historians still treat as one of the decisive turning points of the era, and one that did Otto's own reputation no harm either: the prestige it earned him helped carry him to Rome seven years later, where the pope crowned him Holy Roman Emperor. Boleslav didn't stop there; when the retreating Magyar remnant fled into Bohemian territory afterward, his own forces hunted them down and finished the job. By the time he died in 972, that same outward push had carried Bohemia's border east as far as Kraków — a stretch of what's now southern Poland that briefly answered to Prague before slipping away to the rising Piast dynasty a generation later.\n\nHe backed all that expansion with an equally telling first: Bohemia's own native coinage, the Prague denarius, meaning the country no longer had to run its economy on borrowed foreign coin. Some of the earliest surviving examples even carry his wife Biagota's name alongside his own, stamped right into the silver.\n\nBut none of this erased what he'd done to Wenceslas — Bohemian chroniclers never let him forget it — it left behind an uncomfortable historical fact all the same: the man who murdered his own brother also built the country his brother never got the chance to.",
      cz: "Do roku 955 Boleslav strávil dvě desetiletí rozšiřováním Čech v cosi blízkého regionální mocnosti, posouval hranice směrem ven a přitom odrážel Otova I. vlastní tažení, jimiž ho chtěl přinutit k poslušnosti.\n\nToho srpna stáli bývalí nepřátelé poprvé na stejné straně: Boleslavovy oddíly se přidaly k Otově koalici v bitvě na Lechu, kde spojené křesťanské síly zlomily maďarské nájezdnické vojsko, které půl století terorizovalo střední Evropu — bitvě, kterou historici dodnes řadí mezi rozhodující momenty tehdejší doby, a která neuškodila ani Otově vlastní pověsti: prestiž, kterou si tu vysloužil, mu o sedm let později pomohla až do Říma, kde ho papež korunoval římským císařem. Boleslav u toho nezůstal: když se ustupující zbytky maďarského vojska stáhly na české území, jeho vlastní síly je dostihly a dorazily. Než v roce 972 zemřel, stejná výbojná politika posunula českou hranici na východě až ke Krakovu — pás území v dnešním jižním Polsku, který na čas podléhal Praze, než o generaci později připadl vzmáhající se piastovské dynastii.\n\nTuto expanzi podepřel i stejně výmluvným prvenstvím: vlastní domácí ražbou, pražským denárem — země si tak už nemusela vypůjčovat cizí minci, aby vůbec mohla fungovat její vlastní hospodářství. Na některých z nejstarších dochovaných kusů je vedle jeho jména vyraženo přímo do stříbra i jméno jeho manželky Biagoty.\n\nAle nic z toho nesmazalo, co udělal Václavovi — čeští kronikáři mu to nikdy nezapomněli — zůstává tu i tak nepohodlný historický fakt: muž, který zavraždil vlastního bratra, také vybudoval zemi, kterou jeho bratr nikdy nedostal šanci vybudovat sám.",
      zh: "到955年，博莱斯拉夫已经花了二十年时间，把波希米亚扩张成了一个接近地区强权的存在，一边向外拓展疆域，一边还要抵御奥托一世试图迫使他臣服的多次征讨。\n\n那年8月，这对昔日的敌人首次站到了同一边：博莱斯拉夫的部队加入了奥托的联军，参加了莱希费尔德战役——联合的基督教军队在此役中彻底击溃了半个世纪以来一直在中欧四处劫掠的马扎尔骑兵（匈牙利人的祖先部族），这场战役至今仍被史学界视为那个时代最具决定性的转折点之一，也为奥托本人攒下了不少政治资本：正是这份声望，帮他在七年后走进罗马，接受教皇加冕为神圣罗马帝国皇帝。博莱斯拉夫没有就此收手：当溃退的马扎尔残部逃入波希米亚境内时，他自己的军队追上去，将其彻底肃清。到972年他去世时，同样这股扩张势头已经把波希米亚的东部疆界一路推到了克拉科夫附近——如今波兰南部的这片土地，曾一度归布拉格管辖，直到一代人之后才落入崛起中的皮亚斯特王朝手中。\n\n支撑这场扩张的，还有一项同样能说明问题的“第一次”：波希米亚本土货币——布拉格第纳尔的铸造，从此这个国家再也不用依赖外来货币来维持自己的经济运转。现存最早的一批银币上，甚至直接把他妻子比亚戈塔的名字，和他自己的名字一起刻进了银币里。\n\n但这一切都无法抹去他对瓦茨拉夫做过的事——波希米亚的编年史家从未让他忘记这一点——它同时也留下了一个令人不太舒服的历史事实：那个亲手杀害了自己兄长的人，最终建起了他兄长本该有机会、却从未得到机会去建立的那个国家。",
    },
    relatedLandmarks: [
      {
        slug: "kourim",
        relation: {
          en: "One of the rival power centers Boleslav snuffed out along the way — around the same years he was turning Bohemia into a force even Otto had to reckon with, he had this once-thriving hillfort deliberately extinguished and replaced with a stronghold answering directly to Prague.",
          cz: "Jedno z konkurenčních mocenských center, které Boleslav cestou vyhasil — zhruba ve stejných letech, kdy z Čech dělal sílu, se kterou musel počítat i sám Ota, nechal toto kdysi vzkvétající hradiště záměrně zaniknout a nahradil ho pevností podléhající přímo Praze.",
          zh: "这是博莱斯拉夫一路扫除的对手权力中心之一——就在他把波希米亚打造成连奥托本人都不得不认真对待的势力的同一段岁月里，他下令让这座曾经繁荣一时的堡寨彻底废弃，取而代之的是一座直接听命于布拉格的要塞。",
        },
      },
      {
        slug: "hradiste-libusin",
        relation: {
          en: "The same hillfort tied to Libuše's own prophecy, centuries before Vyšehrad claimed that legend for itself — but the fortress you'd have found here in Boleslav's day had nothing to do with her. Raised during these same expansion years, most likely on his own orders, it was one of the strongholds that turned scattered Přemyslid territory into an actual, governable state.",
          cz: "Totéž hradiště, které je spjaté s Libušiným věštěním — staletí předtím, než si tuto legendu pro sebe přivlastnil Vyšehrad. Pevnost, kterou byste tu ale našli za Boleslavovy vlády, s ní už neměla nic společného: vznikla v týchž letech expanze, nejspíš přímo z jeho příkazu, jako jedna z pevností, díky nimž se z roztroušeného přemyslovského území stal skutečný, spravovatelný stát.",
          zh: "这正是与莉布谢预言相连的那座城寨——早在维谢赫拉德在几个世纪后把这个传说据为己有之前。但博莱斯拉夫年代你在这里会看到的要塞，跟她已经没有任何关系了：它建于同一段扩张岁月，很可能出自博莱斯拉夫本人的命令，是把分散的普热美斯家族领地真正变成可治理国家的要塞之一。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Battle_of_Lechfeld",
    referenceMaps: {
      caption: {
        en: "See Bohemia's borders right before and right after the Battle of Lechfeld.",
        cz: "Podívejte se na hranice Čech těsně před bitvou na Lechu a těsně po ní.",
        zh: "查看波希米亚在莱希费尔德战役前后的疆域变化。",
      },
      links: [
        {
          label: "954",
          description: {
            en: "Duchy of Bohemia's territory before the Battle of Lechfeld",
            cz: "Území Českého knížectví před bitvou na Lechu",
            zh: "莱希费尔德战役之前，波希米亚公国的疆域",
          },
          url: "https://www.oldmapsonline.org/en/history/regions/Duchy_of_Bohemia?region_id=862#position=5.6207/48.69/18.96&year=954",
        },
        {
          label: "955",
          description: {
            en: "Duchy of Bohemia's territory right after the Battle of Lechfeld",
            cz: "Území Českého knížectví hned po bitvě na Lechu",
            zh: "莱希费尔德战役刚结束时，波希米亚公国的疆域",
          },
          url: "https://www.oldmapsonline.org/en/history/regions/Duchy_of_Bohemia?region_id=862#position=5.4868/49.79/23.07&goog_rewarded=&year=955",
        },
      ],
    },
  },
  {
    slug: "bohemia-poland-alliance-965",
    era: "bohemian-duchy",
    startYear: 965,
    year: {
      en: "965",
      cz: "965",
      zh: "965年",
    },
    images: ["/history/bohemia-poland-alliance-965.webp"],
    tone: "humorous",
    title: {
      en: "A Seat at the Table",
      cz: "Místo u stolu",
      zh: "谈判桌上的公主",
    },
    hookLine: {
      en: "The Magyars' collapse didn't just clear Bohemia's own borders — it opened up a reshuffling table across the whole of Central Europe, and Boleslav made sure one of his own daughters had a seat at it.",
      cz: "Pád Maďarů nezbavil hranic jen Čechy — otevřel přerozdělovací stůl napříč celou střední Evropou, a Boleslav se postaral, aby u něj měla místo i jedna z jeho dcer.",
      zh: "马扎尔人的溃败，清空的可不只是波希米亚自己的边境——它给整个中欧腾出了一张重新洗牌的桌子，而博莱斯拉夫确保了自己的一个女儿，也在这张桌子旁占了一席之地。",
    },
    summary: {
      en: "Poland's own Piast dynasty began consolidating its territory and converting to Christianity at almost exactly the same moment Boleslav was doing the same thing at home. In 965 he married his daughter Doubravka off to Mieszko I, ruler of that same rising Piast dynasty that would later reclaim Kraków from Bohemia, sealing an alliance between the two states.\n\nDoubravka's Christian marriage is traditionally credited with nudging Mieszko toward his own baptism the following year — modern historians think the conversion was probably already part of the alliance's terms, but either way, one of Boleslav's own daughters helped set an entire neighboring nation on the road to Christianity.\n\nFair warning: this chapter doesn't have a landmark waiting for you back in Prague — the whole thing happened somewhere else entirely. If that's a problem, there's a train to Kraków.",
      cz: "Polská piastovská dynastie začala téměř ve stejné době slučovat své území a přecházet ke křesťanství jako Boleslav doma. V roce 965 provdal svou dceru Doubravku za Měška I., vládce téže vzmáhající se piastovské dynastie, která později Čechám zase odebere Krakov, a zpečetil tím spojenectví mezi oběma státy.\n\nDoubravčin křesťanský sňatek bývá tradičně spojován s tím, že o rok později přiměla Měška k vlastnímu křtu — dnešní historici se spíš přiklánějí k názoru, že obrácení na víru bylo pravděpodobně součástí samotné spojenecké dohody, ale tak či onak, jedna z Boleslavových dcer pomohla nasměrovat celý sousední národ k christianizaci.\n\nUpozornění: tahle kapitola na tebe v Praze nečeká s žádnou památkou — celý příběh se odehrál jinde. Pokud ti to vadí, do Krakova jezdí vlak.",
      zh: "波兰的皮亚斯特王朝，几乎在博莱斯拉夫忙着在国内做同样的事情的同一时期，也开始整合领土、皈依基督教。965年，他把女儿多布拉瓦嫁给了梅什科一世——正是那个后来又从波希米亚手里夺回克拉科夫的、同一支崛起中的皮亚斯特王朝的统治者——借此巩固了两国间的联盟。\n\n传统说法认为，正是多布拉瓦这桩基督徒婚姻，促成了梅什科次年的受洗；不过今天的历史学家更倾向于认为，皈依很可能早就是联盟条款本身的一部分，未必全是她个人游说的结果——但无论如何，博莱斯拉夫的一个女儿，确实把整个邻国推上了基督教化的道路。\n\n提醒一句：这一节在布拉格没有等着你去打卡的地标——整件事从头到尾都发生在别处。如果你不甘心，现在就去买一张去克拉科夫的车票吧。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Doubravka_of_Bohemia",
    referenceMaps: {
      caption: {
        en: "See Bohemia's territory the year this marriage was made.",
        cz: "Podívejte se na české území v roce, kdy byl tento sňatek uzavřen.",
        zh: "查看这桩联姻缔结那一年，波希米亚的疆域。",
      },
      links: [
        {
          label: "965",
          description: {
            en: "Territory the year Boleslav married his daughter Doubravka to Mieszko I of Poland",
            cz: "Území v roce, kdy Boleslav provdal svou dceru Doubravku za Měška I. Polského",
            zh: "博莱斯拉夫将女儿多布拉瓦嫁给波兰梅什科一世那一年的疆域",
          },
          url: "https://www.oldmapsonline.org/en/history/regions/Duchy_of_Bohemia?region_id=862#position=5.6207/48.69/18.96&year=965",
        },
      ],
    },
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
    images: ["/history/prague-bishopric-973.webp"],
    tone: "humorous",
    title: {
      en: "The Princess Who Went to Rome",
      cz: "Princezna, která odjela do Říma",
      zh: "远赴罗马的公主",
    },
    hookLine: {
      en: "Fighting off the Magyars and marrying his daughter off to Poland — one legacy built with his fists, the other across a negotiating table — Boleslav pulled off both himself. But there was a third legacy he spent most of his life chasing and never lived to see finished — it was his son who closed out that last piece of unfinished business.",
      cz: "Odražení Maďarů a provdání dcery do Polska — jedno dědictví vydobyté pěstmi, druhé u vyjednávacího stolu — to obojí Boleslav zvládl sám. Ale bylo tu i třetí dědictví, o které usiloval většinu života a nikdy se nedožil jeho dokončení — poslední nedodělaný účet za něj nakonec vyrovnal až jeho syn.",
      zh: "打退马扎尔人、把女儿嫁去波兰——这两份遗产，一份靠拳头，一份靠谈判桌，博莱斯拉夫都在自己手上办成了。但还有第三份遗产，他花了大半辈子去争取，却没能亲眼看到它完成——最终是他的儿子，替他把这最后一笔账收了尾。",
    },
    summary: {
      en: "Behind the two dukes usually credited with this stood someone who actually did the legwork: Mlada, Boleslav I's youngest daughter. Around 965 — the same year her sister Doubravka was married off to seal the Polish alliance, as if the family had simply split its diplomacy in two directions at once — her father sent her to Rome to petition Pope John XIII directly for a bishopric of Bohemia's own.\n\nShe stayed for years and came home with two prizes instead of one. While in Rome, she personally joined the Benedictine order, took the name Maria, and was ordained an abbess by the pope himself — and alongside the diocese, she secured papal approval to found Bohemia's very first convent. She left Rome in the winter of 972, the same year her father died with the diocese still formally unconfirmed. Confirmation came a few months later, in March 973, at an imperial council at Quedlinburg — Otto I, by then Holy Roman Emperor, presided just two months before his own death, with his son and successor Otto II picking up where he left off. It took until 976 for the diocese's first bishop, a Saxon monk named Dětmar, to actually be ordained and take up the seat at St. Vitus.\n\nBack in Prague, Mlada became the founding abbess of St. George's Convent at the castle, meaning the same trip to Rome produced both institutions Bohemia had been missing: a bishopric that finally answered to itself instead of Regensburg, and the country's first religious house for women. It still answered to the Archbishop of Mainz rather than standing fully independent — small print aside, this was the moment Bohemia's religious life started looking, on paper at least, like a proper member of Christian Europe. And credit for actually making the trip belongs less to either of the two dukes whose names get attached to the story than to the sister standing between them.",
      cz: "Za oběma vévody, kterým se tahle zásluha obvykle připisuje, stála osoba, která tu skutečnou dřinu odvedla sama: Mlada, nejmladší dcera Boleslava I. Kolem roku 965 — téhož roku, kdy byla její sestra Doubravka provdána, aby zpečetila polské spojenectví, jako by si rodina prostě rozdělila diplomacii na dva směry najednou — ji otec vyslal do Říma, aby přímo u papeže Jana XIII. vyjednala vlastní české biskupství.\n\nZůstala tam léta a vrátila se ne s jedním, ale se dvěma úlovky. V Římě osobně vstoupila do benediktinského řádu, přijala jméno Marie a byla samotným papežem vysvěcena na abatyši — a vedle biskupství si vyjednala i papežské svolení založit v Čechách vůbec první klášter. Řím opustila v zimě roku 972, téhož roku, kdy zemřel její otec, aniž by bylo biskupství formálně potvrzeno. Potvrzení přišlo o pár měsíců později, v březnu 973, na říšském sněmu v Quedlinburku — předsedal mu Ota I., tou dobou už římský císař, jen dva měsíce před vlastní smrtí, a tam, kde skončil, pokračoval jeho syn a nástupce Ota II. Prvního pražského biskupa, saského mnicha jménem Dětmar, se podařilo skutečně vysvětit a dosadit u svatého Víta až v roce 976.\n\nZpátky v Praze se Mlada stala zakládající abatyší kláštera svatého Jiří na Hradě — táž cesta do Říma tak přinesla obě instituce, které Čechám dosud chyběly: biskupství, jež konečně podléhalo samo sobě místo Řezna, a první ženský řeholní dům v zemi. Stále podléhalo mohučskému arcibiskupovi, takže o úplné samostatnosti řeč ještě nebyla — nehledě na tohle drobné ale, byl to okamžik, kdy náboženský život Čech začal, aspoň na papíře, vypadat jako řádný člen křesťanské Evropy. A zásluha za to, že se ta cesta vůbec uskutečnila, patří méně oběma vévodům, jejichž jména se k tomuhle příběhu obvykle připojují, než sestře stojící mezi nimi.",
      zh: "在通常被归功的这两位公爵背后，真正跑腿办成这件事的，其实是另有其人：姆拉达，博莱斯拉夫一世最小的女儿。大约965年——正是她姐姐多布拉瓦出嫁、巩固波兰联盟的同一年，仿佛这个家族干脆把外交分成了两个方向同时展开——她的父亲派她远赴罗马，亲自向教皇约翰十三世请求为波希米亚设立独立主教区。\n\n她在罗马一待就是好几年，回来时带回的不是一份，而是两份成果。在罗马期间，她本人正式加入本笃会，改名玛丽亚，并由教皇亲自册封为修道院院长——除了主教区之外，她还获准在波希米亚建立第一座修道院。972年冬天她离开罗马，同一年，她的父亲去世了，主教区当时仍未正式获批。几个月后，973年3月，教廷在奎德林堡帝国议会上正式确认——主持会议的正是此时已是神圣罗马帝国皇帝的奥托一世，就在他自己去世前两个月，而他儿子兼继承人奥托二世则接过了后续事务。直到976年，第一任布拉格主教、撒克逊修士德特马尔，才真正获得册封、正式就任圣维特教区。\n\n回到布拉格后，姆拉达成为了城堡内圣乔治修道院的首任院长——同一趟罗马之行，就此为波希米亚补上了两个一直缺失的建制：一个终于不再隶属雷根斯堡、而是自己管自己的主教区，以及这个国家第一座供女性修行的宗教场所。它仍然隶属于美因茨大主教，算不上真正独立——撇开这个小小的但书，这一刻，波希米亚的宗教生活终于开始，至少在纸面上，看起来像基督教欧洲一个像样的正式成员了。而真正促成这一切成行的功劳，与其说属于这个故事里通常挂名的那两位公爵，不如说属于站在他们中间的那位公主。",
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
      {
        slug: "st-georges-basilica",
        relation: {
          en: "Mlada became the founding abbess here in 973 — the same Rome trip that won Prague its own bishopric also won Bohemia its first convent, and this is where she ran it.",
          cz: "Zde se Mlada v roce 973 stala zakládající abatyší — táž cesta do Říma, která Praze vydobyla vlastní biskupství, vydobyla Čechám i první klášter, a právě tady ho vedla.",
          zh: "973年，姆拉达在这里成为了首任院长——同一趟罗马之行，既为布拉格争取到了独立主教区，也为波希米亚带回了第一座修道院，而她就在这里主持修道院事务。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bishopric_of_Prague",
  },
  {
    slug: "polish-bohemian-war-990",
    era: "bohemian-duchy",
    startYear: 990,
    year: {
      en: "990",
      cz: "990",
      zh: "990年",
    },
    images: ["/history/polish-bohemian-war-990.webp"],
    tone: "humorous",
    title: {
      en: "Picking the Wrong Side",
      cz: "Špatná volba strany",
      zh: "站错了队",
    },
    hookLine: {
      en: "A marriage can buy an alliance a decade or two — but not enough to survive someone else's succession crisis.",
      cz: "Sňatek dokáže koupit spojenectví na deset, možná patnáct let — ale ne dost na to, aby přežilo cizí nástupnickou krizi.",
      zh: "一桩联姻能买来十几年的和平——但买不来一场别人家皇位继承危机之后仍旧屹立不倒的同盟。",
    },
    summary: {
      en: "The alliance sealed by Doubravka's marriage held for about a dozen years, but it was really only ever as strong as the people who'd made it. She died in 977, and without her, the personal tie between the two courts started to fray; by around 980, Bohemian-Polish relations were visibly cooling.\n\nThe real break came from somewhere else entirely. When Emperor Otto II died in 983, leaving the throne to his toddler son Otto III, the whole Holy Roman Empire tipped into a regency crisis — and Bohemia and Poland ended up on opposite sides of it almost by accident. Boleslav II threw his support behind the rebellious Duke Henry the Quarrelsome of Bavaria, who was trying to seize the regency for himself; Mieszko I backed the boy-emperor and his regents instead. It wasn't a fight about Bohemia and Poland at all — but it left the two former in-laws facing each other from opposite camps.\n\nBy 990, that political split had hardened into open war. Boleslav II and Mieszko I fought over Silesia and Lesser Poland — the same stretch of borderland, Kraków included, that had briefly answered to Prague a generation earlier. Bohemia lost, and Silesia went to Poland for good; whether Kraków itself had already slipped away before the fighting even started is something historians still argue about. Either way, the marriage that once tied the two dynasties together now marked the border between two rivals — a reminder that no alliance outlives the people who agreed to it, once someone else's crisis forces everyone to pick a side.",
      cz: "Spojenectví zpečetěné Doubravčiným sňatkem vydrželo asi tucet let, ale ve skutečnosti bylo silné jen tak, jak silní byli lidé, kteří ho uzavřeli. Doubravka zemřela v roce 977, a bez ní se osobní pouto mezi oběma dvory začalo trhat; kolem roku 980 už bylo česko-polské ochlazení vztahů zjevné.\n\nSkutečný zlom přišel odjinud. Když v roce 983 zemřel císař Ota II. a trůn zanechal svému batolecímu synovi Otovi III., celá Svatá říše římská upadla do krize regentství — a Čechy s Polskem se ocitly na opačných stranách takřka náhodou. Boleslav II. podpořil vzbouřeného bavorského vévodu Jindřicha Svárlivého, který se pokoušel uchvátit regentství pro sebe; Měšek I. se naopak postavil za dětského císaře a jeho regenty. Vůbec nešlo o spor mezi Čechami a Polskem — ale postavil to bývalé švagry do opačných táborů.\n\nDo roku 990 se tento politický rozkol proměnil v otevřenou válku. Boleslav II. a Měšek I. bojovali o Slezsko a Malopolsko — tentýž pás pohraničí, včetně Krakova, který o generaci dříve na čas podléhal Praze. Čechy prohrály a Slezsko připadlo Polsku natrvalo; zda samotný Krakov nepřipadl Polsku už dřív, ještě před vypuknutím bojů, o tom se historici dodnes přou. Ať tak či onak, sňatek, který kdysi spojoval obě dynastie, teď vyznačoval hranici mezi dvěma soupeři — připomínka, že žádné spojenectví nepřežije lidi, kteří ho uzavřeli, jakmile je cizí krize donutí vybrat si stranu.",
      zh: "多布拉瓦这桩婚姻缔结的同盟维持了大约十几年，但说到底，它的牢固程度取决于当初缔结它的那两个人。977年她去世后，两国宫廷之间的这条私人纽带便开始松动；到980年前后，波希米亚和波兰的关系已经明显转冷。\n\n真正的裂痕来自完全另一个方向。983年，皇帝奥托二世驾崩，把皇位留给了还是幼童的儿子奥托三世，整个神圣罗马帝国因此陷入摄政危机——波希米亚和波兰几乎是被动地被推到了对立的两个阵营。博莱斯拉夫二世支持了起兵造反、企图夺取摄政权的巴伐利亚公爵“吵闹者”海因里希二世；梅什科一世则选择支持这位幼年皇帝及其摄政团。这场纷争压根跟波希米亚、波兰无关——却让这对昔日的姻亲被摆到了彼此对立的阵营里。\n\n到990年，这场政治分裂彻底演变成了公开战争。博莱斯拉夫二世和梅什科一世为了西里西亚和小波兰开战——正是同一片边境地带，包括克拉科夫，一代人之前曾一度归布拉格管辖。波希米亚战败，西里西亚从此归了波兰；至于克拉科夫本身是不是在开战之前就已经易主，史学界至今仍有争论。但无论如何，那桩曾经把两大家族联系在一起的婚姻，如今标记的却是两个对手之间的边界——这提醒着人们：一旦别人的危机逼着所有人选边站队，再牢固的同盟，也活不过缔结它的那代人。",
    },
    relatedLandmarks: [
      {
        slug: "hrad-mlada-boleslav",
        relation: {
          en: "Traditionally linked to Boleslav II himself — a fortified settlement here from the late 10th century took his name, and the town of Mladá Boleslav ('Boleslav the Younger,' as opposed to Stará Boleslav, tied to his own father) eventually grew up around it.",
          cz: "Tradičně spojováno se samotným Boleslavem II. — opevněné sídliště zde z konce 10. století neslo jeho jméno, a kolem něj později vyrostlo město Mladá Boleslav (na rozdíl od Staré Boleslavi, spojené s jeho vlastním otcem).",
          zh: "传统上与博莱斯拉夫二世本人有关——10世纪末，这里有一座设防聚落以他命名，“姆拉达·博莱斯拉夫”（意为“年轻的博莱斯拉夫”，与他父亲那座“老博莱斯拉夫”相对）这座集镇后来便在此基础上发展起来。",
        },
      },
      {
        slug: "kostel-svateho-fabiana-a-sebestiana-liboc",
        relation: {
          en: "Legend — via the notoriously unreliable 16th-century chronicler Václav Hájek — credits Boleslav II with founding a church here around 992, marking the spot where a missionary priest was killed for preaching too effectively. Reliable history only picks the site up centuries later, but it's one more claim on his religious-building resume, the year before Bohemia's first monastery went up.",
          cz: "Legenda — podle notoricky nespolehlivého kronikáře ze 16. století Václava Hájka z Libočan — připisuje Boleslavu II. založení kostela zde kolem roku 992, na místě, kde byl zabit misijní kněz za příliš úspěšné kázání. Spolehlivá historie se k místu vrací až o staletí později, ale je to další nárok na jeho stavitelské renomé v církevních věcech — rok předtím, než v zemi vyrostl první klášter.",
          zh: "传说——出自那位出了名不靠谱的16世纪编年史家瓦茨拉夫·哈耶克——将这里的一座教堂归功于博莱斯拉夫二世，约建于992年，纪念一位因传教过于成功而遇害的传教士。可靠的史料要到几个世纪后才提到这个地方，但这仍算得上是他宗教建筑履历上又一笔记录——就在波希米亚第一座修道院落成的前一年。",
        },
      },
      {
        slug: "bevnov-monastery-1782583396582",
        relation: {
          en: "The monastery the Liboc church's founding legend was warming up for — Boleslav II and Bishop Adalbert co-founded this Benedictine house together in 993, Bohemia's first monastery and, unlike the Liboc story, solidly documented rather than legendary.",
          cz: "Klášter, na který se legenda o založení kostela v Liboci teprve chystala — Boleslav II. a biskup Vojtěch tento benediktinský dům společně založili v roce 993, první klášter v Čechách, a na rozdíl od liboceckého příběhu jde o spolehlivě doloženou událost, ne legendu.",
          zh: "利博茨那座教堂的创立传说，其实是在为这座修道院“热身”——博莱斯拉夫二世与主教阿达尔伯特于993年共同创立了这座本笃会修道院，是波希米亚第一座修道院，而且跟利博茨那个传说不同，这件事有可靠史料确凿记载，不是传说。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Polish%E2%80%93Bohemian_War_(990)",
    referenceMaps: {
      caption: {
        en: "See Bohemia's territory after this war with Poland.",
        cz: "Podívejte se na české území po této válce s Polskem.",
        zh: "查看这场对波兰战争之后，波希米亚的疆域。",
      },
      links: [
        {
          label: "990",
          description: {
            en: "Duchy of Bohemia's territory after the war — Silesia now gone to Poland",
            cz: "Území Českého knížectví po válce — Slezsko už připadlo Polsku",
            zh: "战争结束后，波希米亚公国的疆域——西里西亚已经归了波兰",
          },
          url: "https://www.oldmapsonline.org/en/history/regions/Duchy_of_Bohemia?region_id=862#position=5.4868/49.79/23.07&goog_rewarded=&year=990",
        },
      ],
    },
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
    images: ["/history/libice-massacre-995.webp"],
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
    images: ["/history/st-adalbert-martyrdom-997.webp"],
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
      en: "Vojtěch — better known by his confirmation name Adalbert — became Bohemia's second bishop in 983, the first native Czech to hold the post, and spent much of the job locked in conflict with a Bohemian nobility that had no interest in reforming polygamy, clerical marriage, or fasting discipline. He walked out on Prague twice, fleeing to Rome each time rather than fight it out at home; between the two trips, he founded Břevnov Monastery in 993, the first monastery on Bohemian soil. He was in Rome for the second time when his own family was slaughtered at Libice in 995, and he never really came back to run the diocese again — instead he headed north to preach to the pagan Prussians, who killed him for it in 997.\n\nNone of that domestic record made him a saint — what did was dying for it, and dying with the right people paying attention. Emperor Otto III, who'd been Adalbert's close friend and advisor, had him canonized within two years of his death — a startlingly fast turnaround for the era — and made a personal pilgrimage on foot to his tomb in 1000. Poland moved just as fast in the other direction: Duke Bolesław the Brave ransomed the body back from the Prussians for its own weight in gold and enshrined it at Gniezno, instantly turning the town into Poland's own ecclesiastical capital. Bohemia, in other words, mostly inherited a finished cult rather than building one — the empire and Poland did the canonizing; Bohemia just got to claim the man as its own native son.\n\nHis relics eventually made their way home. So, in a sense, did his face: centuries later, sculptor Josef Václav Myslbek placed him at the base of the Wenceslas statue in Wenceslas Square, standing alongside Ludmila, Procopius, and Agnes — the same four saints already introduced back in Wenceslas's own chapter. The bishop who could never stay in Prague for long ended up permanently fixed there in bronze.",
      cz: "Vojtěch — lépe známý pod biřmovacím jménem Adalbert — se stal roku 983 druhým pražským biskupem, prvním rodilým Čechem v této funkci, a většinu úřadu strávil v neustálém sporu s českou šlechtou, která neměla nejmenší zájem reformovat mnohoženství, kněžské sňatky ani postní kázeň. Z Prahy dvakrát odešel a pokaždé uprchl do Říma, místo aby to doma dovedl do konce; mezi oběma cestami založil roku 993 Břevnovský klášter, první klášter na českém území. Byl v Římě podruhé, když byla roku 995 v Libici vyvražděna jeho vlastní rodina, a k vedení diecéze se už nikdy pořádně nevrátil — místo toho odešel na sever kázat pohanským Prusům, kteří ho za to roku 997 zabili.\n\nNic z toho, co dokázal doma, ho světcem neudělalo — udělalo ho jím to, že za to zemřel, a že si toho všimli ti správní lidé. Císař Ota III., Vojtěchův blízký přítel a rádce, ho nechal svatořečit do dvou let od jeho smrti — na tehdejší dobu překvapivě rychle — a v roce 1000 osobně pěšky putoval k jeho hrobu. Polsko si počínalo neméně rychle opačným směrem: kníže Boleslav Chrabrý vykoupil tělo od Prusů za jeho váhu ve zlatě a uložil ho v Hnězdně, čímž z města okamžitě udělal církevní centrum Polska. Čechy tak víceméně zdědily hotový kult, místo aby si ho samy vybudovaly — svatořečení odvedla říše a Polsko, Čechy si jen mohly nárokovat, že je to jejich rodák.\n\nJeho ostatky se nakonec vrátily domů. V jistém smyslu i jeho tvář: o staletí později umístil sochař Josef Václav Myslbek jeho postavu k patě sochy svatého Václava na Václavském náměstí, vedle Ludmily, Prokopa a Anežky — stejné čtveřice světců, která už byla představena v kapitole o Václavovi samotném. Biskup, který v Praze nikdy dlouho nevydržel, tam nakonec zůstal navždy — v bronzu.",
      zh: "沃伊捷赫——更为人熟知的坚振教名是阿达尔伯特——于983年成为波希米亚第二任主教，也是首位土生土长的捷克裔主教，他大半个任期都陷在与波希米亚贵族的持续冲突之中——一夫多妻、教士婚姻、斋戒纪律，这些他想改革的事，贵族们根本没兴趣配合。他两次出走布拉格，每次都逃往罗马，而不是留在国内把事情争到底；两次出走之间，他于993年创立了布热夫诺夫修道院，是波希米亚土地上的第一座修道院。995年利比采屠杀发生时，他正第二次身在罗马，此后他再也没有真正回来主持教区事务——而是北上向异教普鲁士人传教，997年，他们为此杀害了他。\n\n他生前在国内的这些政绩，没有一样真正让他成为圣人——真正让他封圣的，是他为此而死，而且死后正好被对的人注意到了。皇帝奥托三世生前是阿达尔伯特的密友兼顾问，他去世后不到两年就推动教廷将其封圣——在那个年代快得反常——1000年，奥托三世还亲自徒步朝圣，走到他的墓前。波兰的动作也毫不逊色：“勇敢者”博莱斯瓦夫公爵用与遗体等重的黄金，把遗体从普鲁士人手中赎了回来，供奉在格涅兹诺，一举把这座小城变成了波兰的教会中心。换句话说，波希米亚基本上是继承了一个现成的圣徒崇拜，而不是自己一手打造出来的——真正操办封圣的是帝国和波兰，波希米亚能做的，只是宣称这位圣人是自己的儿子。\n\n他的遗骨最终被带回了故土。从某种意义上说，他的容貌也一样：几个世纪后，雕塑家约瑟夫·瓦茨拉夫·米斯尔贝克把他的雕像立在了瓦茨拉夫广场骑马像的基座上，与鲁德米拉、普罗科普、阿格尼丝并列——正是在瓦茨拉夫那一章里已经介绍过的同一组四位圣人。这位在布拉格从未久留的主教，最终却在那里永远留了下来——以青铜的形式。",
    },
    relatedLandmarks: [
      {
        slug: "bevnov-monastery-1782583396582",
        relation: {
          en: "The one thing Adalbert built that didn't move — founded jointly with Boleslav II in 993, in the brief calm between his two departures, it's still an active Benedictine community today, brewing beer under the same rule he brought back from Rome.",
          cz: "Jediná věc, kterou Vojtěch vybudoval a která se nikam nehnula — založena společně s Boleslavem II. v roce 993, v krátkém klidu mezi jeho dvěma odchody, dodnes je aktivní benediktinskou komunitou, vařící pivo podle téhož řádu, který přivezl z Říma.",
          zh: "这是阿达尔伯特唯一一件“没有离开”的作品——993年，在他两次出走之间那段短暂的平静期，他与博莱斯拉夫二世共同创立了这里，至今仍是一个活跃的本笃会团体，酿的啤酒依旧遵循着他从罗马带回的那套会规。",
        },
      },
      {
        slug: "bazilika-sv-margarety",
        relation: {
          en: "The basilica itself — a soaring 18th-century Baroque hall by Christoph Dientzenhofer, replacing the original church Adalbert consecrated here in 993. Only the Romanesque crypt below survives from his own lifetime; everything above it is centuries younger than the man it's named for.",
          cz: "Samotná bazilika — vzdušná barokní stavba Christopha Dientzenhofera z 18. století, která nahradila původní kostel, jenž tu Vojtěch vysvětil v roce 993. Z jeho vlastní doby se dochovala jen románská krypta pod ní; všechno nad ní je o staletí mladší než muž, po němž je pojmenována.",
          zh: "圣殿建筑本身——克里斯托夫·迪岑霍费尔18世纪设计的宏伟巴洛克式大殿，取代了阿达尔伯特993年在此祝圣的那座原始教堂。只有殿下的罗马式地下墓室，是他自己那个年代留下的原物；地面以上的一切，都比这座教堂所纪念的这个人晚了好几个世纪。",
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
      {
        slug: "kostel-sv-vojtecha",
        relation: {
          en: "A church that only exists because Charles IV filled his new 14th-century district with a parish for every neighbourhood — this one just happens to carry Adalbert's name. Its own Easter egg makes the same point as above: his actual bones never came back from Gniezno, so Prague's patron saint doesn't rest in Prague.",
          cz: "Kostel, který vznikl jen proto, že Karel IV. naplnil svou novou čtvrť ze 14. století farním kostelem pro každé sousedství — tenhle prostě nese Vojtěchovo jméno. Jeho vlastní easter egg říká totéž, co výše: jeho skutečné ostatky se z Hnězdna nikdy nevrátily, takže patron Prahy v Praze vlastně neodpočívá.",
          zh: "这座教堂之所以存在，纯粹是因为查理四世14世纪扩建新城时，给每个街区都配了一座堂区教堂——这一座恰好用了阿达尔伯特的名字。它自己的彩蛋说的其实跟上面是同一件事：他真正的遗骨从未从格涅兹诺回归，布拉格的这位守护圣人，骸骨其实并不在布拉格。",
        },
      },
      {
        slug: "sousosi-sv-vojtecha-a-radima-libice",
        relation: {
          en: "Back where it all started: this statue at Libice pairs Adalbert with his half-brother Radim, the other family member who made it out of 995 alive — and who was standing right beside Adalbert two years later when the spears came, escaping to become the first Archbishop of Gniezno himself.",
          cz: "Zpátky tam, kde to všechno začalo: sousoší v Libici staví Vojtěcha vedle jeho nevlastního bratra Radima, dalšího člena rodiny, který přežil rok 995 — a který stál po Vojtěchově boku i o dva roky později, když přišly kopí, aby sám vyvázl a stal se prvním hnězdenským arcibiskupem.",
          zh: "回到一切开始的地方：利比采的这组雕像把阿达尔伯特和他的异母弟弟拉迪姆并列在一起——拉迪姆是995年那场屠杀中另一位幸存的家族成员，两年后长矛袭来时他就站在阿达尔伯特身边，最终逃过一劫，后来还成为了格涅兹诺的首任大主教。",
        },
      },
      {
        slug: "socha-sv-vojtecha-karluv-most",
        relation: {
          en: "One of thirty saints lining Charles Bridge, carved in 1709 — proof that whatever Prague failed to give Adalbert while he was alive, it's spent the centuries since making up for in statues.",
          cz: "Jedna ze třiceti soch světců lemujících Karlův most, vytesaná roku 1709 — důkaz, že cokoliv mu Praha za jeho života odpírala, snaží se to od té doby vynahradit alespoň v sochách.",
          zh: "查理大桥上排列的三十尊圣人像之一，1709年雕刻——证明了布拉格生前没能给阿达尔伯特的东西，这几个世纪以来都在靠一尊又一尊雕像来补偿。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Adalbert_of_Prague",
  },
  {
    slug: "vladivoj-imperial-fief-1002",
    era: "bohemian-duchy",
    startYear: 1002,
    year: {
      en: "1002",
      cz: "1002",
      zh: "1002年",
    },
    images: ["/history/vladivoj-imperial-fief-1002.webp"],
    tone: "humorous",
    title: {
      en: "The Drunkard Who Outlasted Himself",
      cz: "Opilec, který přežil sám sebe",
      zh: "醉鬼公爵不朽的一笔",
    },
    hookLine: {
      en: "He ruled for less than a year and is remembered, if at all, for drinking himself into an early grave — and yet the one thing he actually did outlived every duke who came after him for the next two centuries.",
      cz: "Vládl necelý rok a pamatuje se na něj, pokud vůbec, hlavně to, že se doslova upil k smrti — a přece to jediné, co skutečně udělal, přežilo každého vévodu, který po něm ještě dvě století nastoupil.",
      zh: "他在位不到一年，如果历史还记得他，记住的多半也只是“喝酒喝死了自己”这一件事——可他真正做成的那件事，却比接下来两个世纪里的每一位公爵都活得更久。",
    },
    summary: {
      en: "Duke Boleslaus II died in 999, and what followed was one of the messiest successions Bohemia ever produced. His son Boleslaus III — remembered, not fondly, as 'the Red' — proved so violent and erratic a ruler that a revolt led by the Vršovci clan drove him out in May 1002. With Polish backing from Bolesław the Brave, the Bohemian nobles put a kinsman named Vladivoj on the throne instead — a man so thinly recorded that almost the only thing chroniclers bothered to note about him was his fondness for drink.\n\nAnd yet Vladivoj is the reason Bohemia's constitutional status actually changed. That November, he traveled to swear fealty to King Henry II of Germany and formally received Bohemia as an imperial fief — a different kind of act than Spytihněv's more personal homage back in 895, and one that made Bohemia, for the first time in clear legal terms, a proper Imperial State within the structure of the Holy Roman Empire. It's a status that would hold, in one form or another, until Bohemia was elevated to a full kingdom two centuries later.\n\nVladivoj never got to see any of it matter. He died within the year, in January 1003, reportedly drinking himself into the grave before he turned twenty-three. With the throne empty again, the same Poles who'd installed him simply reversed course and put the man they'd just watched Bohemia's own nobles throw out back in charge: Boleslaus III. It would not go well for anyone.\n\nNo landmark for this one in Prague either — not even the exact spot where Vladivoj knelt survives in the record. If you want to stand somewhere Henry II actually was that same year, try Mainz: he'd been crowned King of Germany there five months earlier.",
      cz: "Kníže Boleslav II. zemřel roku 999 a to, co následovalo, patří k nejzmatenějším nástupnictvím, jaké kdy Čechy zažily. Jeho syn Boleslav III. — v paměti přezdívaný, nikoli z lásky, „Ryšavý\" — se ukázal jako natolik násilnický a nevyzpytatelný vládce, že ho v květnu 1002 vyhnalo povstání vedené rodem Vršovců. S polskou podporou Boleslava Chrabrého dosadila česká šlechta na trůn místo něj příbuzného jménem Vladivoj — muže, o němž se dochovalo tak málo, že kronikáři si o něm skoro jediné, co považovali za hodné zaznamenat, byla jeho záliba v pití.\n\nA přesto je to právě Vladivoj, kdo skutečně změnil ústavní postavení Čech. Téhož listopadu se vydal přísahat věrnost německému králi Jindřichovi II. a formálně přijal Čechy jako říšské léno — jiný druh aktu než Spytihněvova osobnější poklona z roku 895, a takový, který z Čech poprvé v jasných právních pojmech udělal řádný stav Svaté říše římské. Tohle postavení, v té či oné podobě, vydrželo až do doby, kdy byly Čechy o dvě staletí později povýšeny na plnohodnotné království.\n\nVladivoj se ničeho z toho nedožil. Zemřel do roka, v lednu 1003, údajně se doslova upil k smrti, ještě než mu bylo třiadvacet. Trůn byl znovu prázdný, a titíž Poláci, kteří ho tam dosadili, prostě otočili kurz a vrátili k moci muže, kterého sami před chvílí sledovali, jak ho čeští šlechtici vyhnali: Boleslava III. Nikomu z toho nakonec nevzešlo nic dobrého.\n\nAni tady na tebe v Praze nečeká žádná památka — nedochovalo se dokonce ani přesné místo, kde Vladivoj klečel. Pokud chceš stát někde, kde Jindřich II. skutečně téhož roku byl, zkus Mohuč: o pět měsíců dřív tam byl korunován německým králem.",
      zh: "公爵博莱斯拉夫二世于999年去世，随之而来的，是波希米亚历史上最混乱的一次继承。他的儿子博莱斯拉夫三世——史书上并不友善地称他为“赤发王”——统治残暴失序，1002年5月，一场由维尔绍夫奇家族发起的叛乱把他赶下了台。在波兰“勇敢者”博莱斯瓦夫的支持下，波希米亚贵族转而扶植了他的一位亲戚瓦拉迪沃伊登上公位——此人留下的史料极其稀少，编年史家几乎唯一觉得值得记上一笔的，就是他嗜酒的毛病。\n\n然而，真正让波希米亚的宪制地位发生改变的，正是这位瓦拉迪沃伊。同年11月，他亲自前往向德意志国王亨利二世宣誓效忠，正式接受波希米亚作为封地——这跟895年斯皮蒂赫涅夫那次更偏向个人化的朝觐性质不同，这一次，波希米亚第一次在明确的法律意义上，成为了神圣罗马帝国名副其实的一个邦国。这个法理地位，此后以各种形式一直延续，直到两个世纪后波希米亚正式升格为王国。\n\n瓦拉迪沃伊没能活着看到这一切真正发挥作用。不到一年，1003年1月，他便离世了，据说是在还不到二十三岁时就把自己喝死了。王位再度空悬，而当初扶植他上位的那些波兰人，索性调转方向，把波希米亚贵族刚刚亲手赶下台的那个人——博莱斯拉夫三世——重新扶了回去。这对谁都没什么好下场。\n\n这一节同样没有布拉格的相关地标——甚至连瓦拉迪沃伊当年下跪的确切地点，史料都没记录下来。如果你想站在亨利二世同一年真正去过的地方，可以去美因茨——五个月前，他正是在那里加冕为德意志国王的。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vladivoj,_Duke_of_Bohemia",
  },
  {
    // Background-knowledge card. startYear is deliberately non-integer
    // (1002.5) purely as a sort anchor to slot this between
    // vladivoj-imperial-fief-1002 and poles-take-prague-1003 in the feed —
    // background cards don't claim a sidebar year slot (filtered out in
    // HistorySidebar/HistoryPage) so this never renders anywhere.
    slug: "what-was-the-holy-roman-empire-1002",
    era: "bohemian-duchy",
    startYear: 1002.5,
    cardType: "background",
    year: {
      en: "962–1806",
      cz: "962–1806",
      zh: "962年－1806年",
    },
    tone: "humorous",
    title: {
      en: "What, Exactly, Was the Holy Roman Empire?",
      cz: "Co vlastně byla Svatá říše římská?",
      zh: "神圣罗马帝国，到底是个什么东西？",
    },
    hookLine: {
      en: "Vladivoj just made Bohemia a fief of something called the Holy Roman Empire — which raises an obvious question this timeline should probably answer before it comes up another two hundred times.",
      cz: "Vladivoj právě udělal z Čech léno něčeho, čemu se říkalo Svatá říše římská — což vyvolává zjevnou otázku, kterou by tahle časová osa měla nejspíš zodpovědět dřív, než se objeví ještě dalších dvě stě krát.",
      zh: "瓦拉迪沃伊刚刚把波希米亚变成了一个叫“神圣罗马帝国”的东西的封地——这理应引出一个明摆着的问题，这条时间线最好趁早讲清楚，不然接下来两百年它还要反复出现。",
    },
    summary: {
      en: "The 18th-century French writer Voltaire wrote the single most quoted line about this institution, and it's worth starting there because it's essentially correct: the Holy Roman Empire, he said, was 'neither Holy, nor Roman, nor an Empire.' Bohemia's rulers are about to spend the next thousand years managing their relationship with this thing, so it's worth knowing upfront what it actually was — not a country in any sense we'd recognize today, but a sprawling patchwork of several hundred practically independent duchies, prince-bishoprics, free cities, and margraviates, Bohemia now among them, all nominally answering to one shared emperor while each ran its own government, army, coinage, and laws. Picture the EU with a king glued on top, and you're closer than you'd expect.\n\nThe 'Roman' part traces back to Christmas Day, 800, when Pope Leo III crowned the Frankish king Charlemagne 'Emperor of the Romans' in Rome — over three centuries after the actual Western Roman Empire had collapsed. It wasn't a literal continuation; it was medieval Europe's favorite move, borrowing Rome's old prestige and pinning it on whoever currently held the most swords. Charlemagne's own empire didn't survive him intact, but the title did, and in 962 the German king Otto I revived it for good — the year most historians mark as the Empire's real starting point. ('Holy' got tacked onto the name later, in the 12th century, mostly to needle the Pope right back.)\n\nThe emperor wasn't born into the job — he was elected, by a handful of the Empire's most powerful nobles and archbishops, seven of them for most of its history. Winning that vote made you King of the Germans, crowned at Aachen; only a separate trip south to be crowned again by the Pope made you Emperor. In practice, the same wealthy families kept winning re-election generation after generation — the Ottonians, then the Salians, then the Hohenstaufens, and for the last few centuries almost nobody but the Habsburgs — so 'elective' monarchy ended up looking a lot like a hereditary one that just had to keep reapplying for the job.\n\nNone of this had anything to do with ethnicity. Membership was a matter of feudal law and political geography, not language or bloodline — by the time Vladivoj knelt before Henry II, the Empire already held Italian-speaking regions and French-speaking Burgundy, and now a Slavic-speaking Bohemia joined the same web of oaths and obligations. What his 1002 fealty actually won Bohemia was the rank of a fully-fledged Imperial State, answering straight to the emperor rather than to some lesser lord in between — the medieval equivalent of reporting directly to the CEO instead of a regional manager. Bohemia would eventually climb even higher inside the club: by the 13th century its king was one of the seven electors himself, with a personal vote in choosing the very emperor his ancestors had once knelt to.\n\nThere's one wrinkle Voltaire's joke doesn't quite cover: the actual, unbroken continuation of the Roman Empire was still very much alive in 1002, in Constantinople, where what modern historians call the Byzantine Empire had never stopped calling itself simply the Roman Empire the whole time. From Constantinople's point of view, Charlemagne's coronation in 800 wasn't reviving anything; it was a German warlord shoplifting a brand name that already had a legitimate owner behind the counter. The two empires spent centuries arguing, occasionally through actual war, over who got to use the label 'Roman' — a trademark dispute that outlasted both companies.\n\nSo: not holy (the Pope and the Emperor spent as much time excommunicating each other as cooperating), not Roman (its capital was never Rome, and most of its subjects spoke German), and not really an empire (no central government worth the name, just several hundred quarrelling shareholders sharing one letterhead). It nonetheless outlasted almost every tidier, better-run kingdom in Europe, limping on until Napoleon finally put it out of its misery in 1806 — which, if nothing else, suggests running a coherent state was never really the point.",
      cz: "Francouzský spisovatel Voltaire z 18. století je autorem nejcitovanější věty o téhle instituci, a stojí za to od ní začít, protože je v podstatě přesná: Svatá říše římská prý nebyla „ani svatá, ani římská, ani říše\". Čeští panovníci se s tímhle útvarem chystají udržovat vztahy po další celé tisíciletí, takže se vyplatí hned na začátku vědět, co to vlastně bylo — v žádném smyslu, který bychom dnes uznali, to nebyla země, ale rozlehlá mozaika několika stovek prakticky nezávislých knížectví, biskupství, svobodných měst a markrabství — Čechy teď mezi nimi — z nichž každé formálně odpovídalo jedinému společnému císaři, ale samo si vedlo vlastní vládu, vojsko, měnu i zákony. Představ si Evropskou unii s králem přilepeným navrch, a jsi blíž pravdě, než bys čekal.\n\nSlovo „římská\" sahá zpátky ke Štědrému dni roku 800, kdy papež Lev III. v Římě korunoval franského krále Karla Velikého na „císaře Římanů\" — přes tři století poté, co skutečná Západořímská říše zanikla. Nešlo o doslovné pokračování; byl to oblíbený tah středověké Evropy, půjčit si starou římskou prestiž a připnout ji na toho, kdo zrovna velel nejvíc mečům. Karlova říše ho samotného nepřežila vcelku, ale titul ano, a roku 962 ho německý král Ota I. natrvalo obnovil — rok, který většina historiků označuje za skutečný počátek Říše. („Svatá\" se k názvu přidalo až později, ve 12. století, hlavně aby to popíchlo papeže zpátky.)\n\nCísař se do funkce nerodil — byl volen, hrstkou nejmocnějších říšských knížat a arcibiskupů, po většinu dějin Říše sedmi kurfiřty. Vítězství v té volbě z tebe udělalo německého krále, korunovaného v Cáchách; teprve samostatná cesta na jih, ke druhé korunovaci papežem, z tebe udělala císaře. V praxi ve volbách znovu a znovu vyhrávaly tytéž bohaté rody — nejdřív Otonové, pak Sálci, pak Štaufové, a posledních pár století skoro nikdo jiný než Habsburkové — takže „volitelná\" monarchie nakonec vypadala skoro jako dědičná, jen si musela pořád znovu podávat žádost.\n\nS etnickým původem to nemělo nic společného. Členství bylo věcí lenního práva a politické zeměpisy, ne jazyka nebo krve — v době, kdy Vladivoj klečel před Jindřichem II., Říše už zahrnovala italsky mluvící oblasti i francouzsky mluvící Burgundsko, a teď se do stejné sítě přísah a povinností zapojily i slovansky mluvící Čechy. Co mu jeho léno z roku 1002 skutečně vydobylo, bylo postavení plnohodnotného říšského stavu, odpovídajícího přímo císaři, ne nějakému nižšímu pánovi mezi tím — středověký ekvivalent hlášení přímo generálnímu řediteli místo oblastnímu manažerovi. Čechy se v tomhle klubu časem vyšplhaly ještě výš: ve 13. století byl český král sám jedním ze sedmi kurfiřtů, s vlastním hlasem při volbě téhož císaře, před kterým kdysi klečeli jeho předkové.\n\nJe tu ještě jedna vráska, kterou Voltairův vtip úplně nepokrývá: skutečné, nepřerušené pokračování Římské říše bylo v roce 1002 stále naživu — v Konstantinopoli, kde si to, čemu dnešní historici říkají Byzantská říše, po celou dobu samo pořád říkalo prostě Římská říše. Z pohledu Konstantinopole korunovace Karla Velikého v roce 800 nic neobnovovala; byl to germánský válečník na Západě, který ukradl obchodní značku, jež už měla legitimního majitele za pultem. Obě říše strávily staletí hádkami, občas i skutečnou válkou, o to, kdo smí používat označení „římská\" — spor o ochrannou známku, který přežil obě firmy.\n\nTakže: ani svatá (papež a císař strávili exkomunikováním jeden druhého skoro tolik času jako spoluprací), ani římská (hlavním městem nikdy nebyl Řím a většina poddaných mluvila německy), ani doopravdy říše (žádná ústřední vláda hodná toho jména, jen několik set hašteřících se akcionářů se společnou hlavičkou dopisu). Přesto přežila skoro každé úhlednější a lépe fungující království v Evropě a belhala se dál, dokud ji roku 1806 konečně nevysvobodil Napoleon — což, pokud nic jiného, naznačuje, že vést soudržný stát nikdy nebylo tak úplně to hlavní.",
      zh: "18世纪的法国作家伏尔泰留下了关于这个机构最广为流传的一句吐槽，值得从这里开场，因为这句话其实说得相当准确：神圣罗马帝国，他说，“既不神圣，也不罗马，更不是一个帝国”。波希米亚的统治者接下来整整一千年都要跟这个东西打交道，所以最好先弄清楚它到底是个什么玩意儿——它完全不是我们今天理解意义上的“一个国家”，而是由几百个实际上各自独立的公国、采邑主教区、自由城市和藩侯国拼凑而成的大杂烩——如今波希米亚也在其中——名义上都听命于同一位皇帝，但各自管着自己的政府、军队、货币和法律。可以想象成一个欧盟，上面再粘一顶王冠，这个比喻比听上去要贴切得多。\n\n“罗马”这个词，要追溯到公元800年的圣诞节，教皇利奥三世在罗马为法兰克国王查理曼加冕，封他为“罗马人的皇帝”——那时距离真正的西罗马帝国灭亡，已经过去了三百多年。这并不是什么名副其实的“延续”，而是中世纪欧洲最爱玩的一手：把古罗马的旧招牌借来，随手挂在当下手握最多刀剑的人身上。查理曼的帝国没能在他死后完整保留下来，但这个头衔留了下来，962年，德意志国王奥托一世把它彻底复活——大多数历史学家把这一年当作神圣罗马帝国真正的起点。（“神圣”这个字是后来才加上去的，12世纪的事，主要是为了反过来膈应教皇一下。）\n\n皇帝这个位子不是生来就有的——它是选出来的，由帝国境内最有权势的一小撮诸侯和大主教投票产生，帝国历史上的大多数时间里，这个投票团只有七个人，也就是所谓的“选帝侯”。赢得这场选举，只能让你当上“德意志人的国王”，在亚琛加冕；只有再单独跑一趟罗马，让教皇给你二次加冕，你才算真正的皇帝。实际操作中，赢得连任的往往是同一批富有家族——先是奥托王朝，然后是萨利安王朝，接着是霍亨斯陶芬王朝，最后几个世纪几乎清一色是哈布斯堡家族——所以这套“选举制”君主，到头来看起来跟世袭制没什么两样，只不过每一代都得重新“竞选连任”一次。\n\n这些事跟民族血统完全没关系。加入这个帝国靠的是封建法律和政治地理，不是语言或血缘——瓦拉迪沃伊跪在亨利二世面前的时候，帝国境内早就已经有讲意大利语的地区，还有讲法语的勃艮第，如今又轮到讲斯拉夫语的波希米亚加入这张由誓约和义务织成的大网。他在1002年那次效忠真正为波希米亚换来的，是一个正式“帝国直属邦国”的等级——直接向皇帝本人负责，而不是隔着某个中间层级的领主打交道，用今天的话说，相当于直接向CEO汇报，而不是向某个区域经理汇报。波希米亚在这个圈子里后来还爬得更高：到了13世纪，波希米亚国王本人就成了那七位选帝侯之一，亲自握有一票，去挑选那个自己祖先曾经跪拜过的皇帝人选。\n\n伏尔泰那句吐槽还漏掉了一层更绕的关系：真正一脉相承、从未中断的罗马帝国，在1002年其实还活得好好的——就在君士坦丁堡，也就是今天的历史学家习惯称之为“拜占庭帝国”的那个政权，它自己从头到尾都只管自称“罗马帝国”，从没换过名字。站在君士坦丁堡的角度看，公元800年查理曼那场加冕根本谈不上什么“复兴”，那不过是西边一个日耳曼军阀，把一块早就有正牌老板守在柜台后面的招牌顺手偷走挂了出去。这两个帝国为了谁才有资格用“罗马”这个名号，吵了好几个世纪，偶尔还真刀真枪打了起来——一场比这两家公司本身都活得更久的商标官司。\n\n所以：不神圣（教皇和皇帝互相开除对方教籍的时间，跟他们合作的时间差不多长），不罗马（首都从来都不是罗马，大多数臣民说的也是德语），更算不上一个真正的帝国（没有一个像样的中央政府，只有几百个整天互相拌嘴、却共用同一份公司抬头信纸的“股东”）。可它偏偏比欧洲大多数组织得更整齐、治理得更像样的王国都活得长久，一路苟延残喘，直到1806年才被拿破仑彻底送终——这如果能说明什么，那大概就是：把一个国家治理得井井有条，从来都不是这个帝国真正在乎的事。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Holy_Roman_Empire",
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
    images: ["/history/vysehrad-massacre-1003.webp", "/history/poles-take-prague-1003.webp"],
    tone: "humorous",
    title: {
      en: "The Duke Who Misplaced a Country",
      cz: "Kníže, který zemi jaksi ztratil",
      zh: "弄丢国家的昏君",
    },
    hookLine: {
      en: "Six years after Adalbert died trying to convert the Prussians, Bohemia's own ruling family managed to lose the country to its neighbours without a single battle.",
      cz: "Šest let po tom, co Vojtěch zemřel při pokusu obrátit Prusy na víru, se vlastní česká panovnická rodina dokázala připravit o zemi ve prospěch sousedů, aniž by padla jediná bitva.",
      zh: "阿达尔伯特为感化普鲁士人而殉道六年后，波希米亚自己的统治家族，竟然在没打一仗的情况下，就把国家拱手让给了邻居。",
    },
    summary: {
      en: "After the drunkard duke who'd briefly replaced him drank himself into an early grave, Boleslaus III — remembered, not fondly, as 'the Red' — got his throne back on 9 February 1003, restored with Polish military backing from Bolesław the Brave. It was a decision Bolesław would come to regret almost immediately.\n\nBoleslaus knew exactly who to blame: the Vršovci were the same clan behind the revolt that had deposed him back in 1002, and historians read what came next less as random cruelty than as him settling that score. That same Lent, he had the clan massacred at Vyšehrad — personally cutting down his own son-in-law with his sword, a man some accounts place among the rebels who'd driven him out the year before. It wasn't the last time this particular family would end up on the wrong side of a Bohemian purge — they'd helped carry one out in 995, and would be on the receiving end of a far larger one in 1108.\n\nThe survivors who lived through it fled straight to the same Polish duke who'd just put Boleslaus back on the throne, begging him to save them from the man he'd restored. Bolesław obliged — not by marching on Prague, but by inviting his Czech namesake to visit him at his own castle, probably in Kraków, where he trapped him, blinded him, and locked him away for the rest of his life (he never set foot in Bohemia again, dying in captivity some thirty years later). Bolesław then simply took Bohemia for himself, ruling from Prague as its duke for a little over a year, until the German king Henry II stepped in on behalf of Boleslaus's brother: in 1004, Jaromír retook Prague with Henry's backing and received the duchy back as an imperial fief. Bohemia's own royal family, in other words, briefly managed to lose the country to a neighbour — through nothing more than sheer incompetence.",
      cz: "Poté, co se opilecký kníže, který ho na čas nahradil, sám upil k smrti, získal Boleslav III. — v paměti přezdívaný, nikoli z lásky, „Ryšavý\" — zpět svůj trůn 9. února 1003, obnoven s vojenskou podporou Boleslava Chrabrého z Polska. Bylo to rozhodnutí, kterého Boleslav Chrabrý začal litovat téměř okamžitě.\n\nBoleslav přesně věděl, koho vinit: Vršovci byli tentýž rod, který stál za povstáním, jež ho v roce 1002 sesadilo, a historici to, co následovalo, čtou spíš jako vyrovnání účtů než jako bezdůvodnou krutost. Téhož postního období nechal rod na Vyšehradě vyvraždit — vlastního zetě zabil vlastnoručně mečem, muže, kterého některé prameny řadí mezi rebely, kteří ho o rok dřív vyhnali. Nebylo to naposledy, co se tento rod ocitl na špatné straně české čistky — v roce 995 se na jedné sami podíleli, a v roce 1108 na sebe schytali mnohem větší.\n\nPřeživší, kteří to přežili, uprchli rovnou za tím samým polským knížetem, který Boleslava právě dosadil zpět na trůn, a prosili ho, aby je zachránil před mužem, jehož sám obnovil. Boleslav Chrabrý vyhověl — ne tažením na Prahu, ale pozváním svého českého jmenovce na návštěvu svého vlastního hradu, nejspíš v Krakově, kde ho zajal, oslepil a doživotně uvěznil (do Čech se už nikdy nevrátil a zemřel v zajetí asi o třicet let později). Boleslav si pak Čechy jednoduše vzal pro sebe a vládl z Prahy jako jejich kníže přes rok, dokud nezasáhl německý král Jindřich II. ve prospěch Boleslavova bratra: roku 1004 dobyl Jaromír s Jindřichovou podporou zpět Prahu a přijal knížectví zpátky jako říšské léno. Vlastní česká panovnická rodina tak na čas dokázala přijít o zemi ve prospěch souseda — a to čirou neschopností.",
      zh: "在那位短暂取代他的醉鬼公爵把自己喝死之后，博莱斯拉夫三世——史书上并不友善地称他为“赤发王”——于1003年2月9日，在波兰“勇敢者”博莱斯瓦夫的军事支持下重新夺回了王位。这是一个博莱斯瓦夫几乎立刻就开始后悔的决定。\n\n博莱斯拉夫三世很清楚该找谁算账：维尔绍夫奇正是1002年那场把他赶下台的叛乱背后的那个家族，历史学家倾向于把接下来发生的事，读作一次清算旧账，而不是无缘无故的残暴。同一个大斋期，他下令在维谢赫拉德将这个家族屠戮殆尽——亲手用剑砍死了自己的女婿，据部分史料记载，这位女婿正是一年前把他赶下台的叛乱者之一。这已经不是这个家族第一次栽在波希米亚的清洗上——995年，他们曾是那场屠杀的帮凶；而到了1108年，他们自己也会遭遇一场规模大得多的清洗。\n\n侥幸活下来的人径直逃去投奔那位刚刚帮博莱斯拉夫三世复位的波兰公爵，求他解救自己，躲开这个他亲手扶上位的人。“勇敢者”博莱斯瓦夫一世倒也没推辞——但他没有出兵直捣布拉格，而是邀请这位波希米亚同名者前来做客，地点大概率是他自己的城堡（多半在克拉科夫），一到那里，就将他擒获、弄瞎双眼、终身囚禁（此后他再未踏上波希米亚的土地，约三十年后死于囚禁之中）。博莱斯瓦夫一世随后干脆自己接管了波希米亚，坐镇布拉格以公爵身份统治了一年多，直到德意志国王亨利二世出手，站在博莱斯拉夫三世的兄弟一边：1004年，雅罗米尔在亨利二世的支持下夺回布拉格，重新以帝国封臣的身份获得公国。换句话说，波希米亚自己的王室，曾一度靠着纯粹的无能，把国家白白让给了邻居。",
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
    slug: "oldrich-blinds-jaromir-1012",
    era: "bohemian-duchy",
    startYear: 1012,
    year: {
      en: "1004–1018",
      cz: "1004–1018",
      zh: "1004年－1018年",
    },
    images: ["/history/oldrich-blinds-jaromir-1012.webp"],
    tone: "humorous",
    title: {
      en: "Family Tradition?",
      cz: "Rodinná tradice?",
      zh: "这是家族传统吗？",
    },
    hookLine: {
      en: "Jaromír got Prague back in 1004, but not much else — Moravia, Silesia, and Lusatia stayed Polish, and within a decade his own brother would take even that smaller prize away from him, the same way their family always seems to settle these things.",
      cz: "Jaromír v roce 1004 sice dostal zpět Prahu, ale skoro nic víc — Morava, Slezsko i Lužice zůstaly polské, a během deseti let mu i tenhle zmenšený zbytek sebral vlastní bratr, přesně tím způsobem, jakým to tahle rodina odjakživa řeší.",
      zh: "1004年，雅罗米尔虽然夺回了布拉格，却几乎没夺回别的什么——摩拉维亚、西里西亚、卢萨蒂亚仍然是波兰的地盘，而不出十年，连这个缩水的公国，都被自己的亲弟弟夺走了，用的还是这个家族一贯的解决方式。",
    },
    summary: {
      en: "Jaromír got Prague back in 1004 with German troops, formally swearing loyalty to Henry II and folding Bohemia into the Holy Roman Empire as a vassal duchy — but the country he actually got back was smaller than the one he'd lost. Moravia, Silesia, and Lusatia all stayed in Polish hands, held by Bolesław the Brave, and for the next decade and a half Bohemia served as the Empire's most reliable ally in an on-and-off war against him. That war finally ground to a halt with the Peace of Bautzen in 1018 — Lusatia stayed Polish, held as an imperial fief, while Bohemia's own status as a duchy of the Empire was confirmed for good.\n\nNone of that outside pressure was what actually cost Jaromír his throne, though. In 1012, his own younger brother Oldřich — the same brother he'd once fled into exile with, both of them driven out of Prague in 1001 after their eldest brother Boleslaus III had Jaromír castrated — turned on him too, deposed him, and had him blinded. It's a move this family keeps making: Wenceslas killed by his brother in 935, Boleslav II slaughtering a rival clan in 995, Boleslaus III blinded by a foreign rival just eight years earlier — and now one Přemyslid duke blinding another, this time for no reason grander than the throne itself. Jaromír, maimed twice over now by his own family, never really recovered political relevance; he lived on, blind, until his death around 1035, reportedly murdered by a member of the Vršovci clan.\n\nOldřich spent the rest of his reign chasing the one thing Jaromír never got back: Moravia. He never quite managed it himself. Years before any of that, back when he was still just a prince and not yet duke, legend has it he'd already fallen for a peasant girl named Božena, met by a well while out hunting — the kind of story Bohemia had already told once before, about a plowman named Přemysl. The son she gave him, an illegitimate boy named Břetislav, was already growing up by the time his father took the throne — in a duchy still missing a third of what it used to be. Nobody called him anything special yet. That would take a while longer.",
      cz: "Jaromír získal Prahu zpět v roce 1004 s pomocí německých vojsk, formálně přísahal věrnost Jindřichovi II. a začlenil Čechy do Svaté říše římské jako vazalské knížectví — jenže země, kterou tím získal zpět, byla menší než ta, o kterou přišel. Morava, Slezsko i Lužice zůstaly v polských rukou, v držení Boleslava Chrabrého, a Čechy dalších patnáct let sloužily jako nejspolehlivější říšský spojenec v přerušovaně vedené válce proti němu. Ta válka se nakonec zastavila mírem v Budyšíně roku 1018 — Lužice zůstala polská, držená jako říšské léno, zatímco postavení Čech jako knížectví Svaté říše římské bylo natrvalo potvrzeno.\n\nTrůn ale Jaromírovi nakonec nesebral žádný vnější tlak. V roce 1012 se proti němu obrátil i jeho vlastní mladší bratr Oldřich — tentýž bratr, se kterým kdysi společně uprchl do vyhnanství, oba vyhnaní z Prahy v roce 1001 poté, co jejich nejstarší bratr Boleslav III. nechal Jaromíra vykastrovat — sesadil ho a nechal oslepit. Je to tah, který tahle rodina opakuje pořád dokola: Václav zabitý vlastním bratrem v roce 935, Boleslav II. vyvražďující konkurenční rod v roce 995, Boleslav III. oslepený cizím soupeřem jen o osm let dřív — a teď jeden přemyslovský kníže oslepuje druhého, tentokrát kvůli ničemu vznešenějšímu než samotnému trůnu. Jaromír, teď už dvakrát zmrzačený vlastní rodinou, se ke skutečné moci už nikdy nevrátil; dožil, slepý, až do své smrti kolem roku 1035, údajně zavražděn příslušníkem rodu Vršovců.\n\nOldřich strávil zbytek své vlády honbou za jedinou věcí, kterou Jaromír nikdy nedostal zpět: Moravou. Sám se to nikdy docela nepovedlo. Léta předtím, ještě když byl pouhým knížecím synem a ne vévodou, se podle pověsti stihl zamilovat do venkovské dívky jménem Božena, kterou potkal u studny při lovu — příběh, jaký Čechy vyprávěly už jednou, o oráči jménem Přemysl. Syn, kterého mu porodila, nemanželský chlapec jménem Břetislav, už v době, kdy jeho otec usedl na trůn, vyrůstal — v knížectví, kterému stále chybí třetina toho, co kdysi mělo. Nikdo mu zatím neříkal nic zvláštního. To mělo přijít až později.",
      zh: "1004年，雅罗米尔靠着德意志军队夺回了布拉格，正式向亨利二世宣誓效忠，把波希米亚正式纳入神圣罗马帝国、成为一个附庸公国——但他实际收回的这个国家，比他失去的那个要小得多。摩拉维亚、西里西亚、卢萨蒂亚仍然掌握在波兰“勇敢者”博莱斯瓦夫手中，此后十五年间，波希米亚一直是帝国对抗他最可靠的盟友，双方断断续续交战不休。这场战争最终在1018年的《布迪申和约》中告一段落——卢萨蒂亚仍归波兰，作为帝国的封地，而波希米亚作为帝国一个公国的地位则从此被永久确认下来。\n\n然而真正让雅罗米尔丢掉王位的，并不是这些外部压力。1012年，他自己的弟弟奥尔德日赫——正是那位曾与他一同流亡的弟弟，两人1001年一同被赶出布拉格，起因正是他们的长兄博莱斯拉夫三世曾下令阉割雅罗米尔——如今也转而对付他，将他废黜，还弄瞎了他的双眼。这个家族似乎总在重演同一种戏码：935年瓦茨拉夫被亲弟弟杀害，995年博莱斯拉夫二世血洗竞争家族，就在八年前，博莱斯拉夫三世还被一位外族对手弄瞎——如今，轮到了一位普热美斯家族的公爵弄瞎另一位公爵，而这一次，起因不过是王位本身，没有别的更宏大的理由。雅罗米尔如今已经被自己的家人伤害了两次，此后再也没能真正重返权力核心；他带着失明一直活到约1035年去世，据说是被一名维尔绍夫奇家族成员刺杀身亡。\n\n奥尔德日赫用他余下的统治岁月，一直在追逐雅罗米尔始终没能夺回的那样东西：摩拉维亚。他自己始终没能真正做到。而在这一切发生的许多年前，那时他还只是个尚未继位的公子，据传说，他就已经爱上了一位在打猎时于水井边邂逅的农家女子博热娜——这个故事波希米亚早就讲过一次，主角是那位犁地的普热米斯尔。她为他生下的儿子，一个私生子，名叫布热季斯拉夫，等他父亲真正登上公位时，已经在这个仍然缺了三分之一疆域的公国里长大了。此时还没有人叫他什么特别的称号。那要等到更晚以后了。",
    },
    relatedLandmarks: [
      {
        slug: "klaster-sazava",
        relation: {
          en: "Founded in 1032 at Oldřich's own initiative, near the end of his reign — the one monument that's unambiguously his, rather than shared credit with a brother, a Pole, or a son.",
          cz: "Založen roku 1032 z Oldřichovy vlastní iniciativy, ke konci jeho vlády — jediná památka, která je jednoznačně jeho vlastní, a ne sdílená se sourozencem, Polákem nebo synem.",
          zh: "1032年由奥尔德日赫本人倡议创立，就在他统治末期——是唯一一处完全属于他自己的功绩，不用跟兄弟、波兰人或儿子分享。",
        },
      },
      {
        slug: "peruc",
        relation: {
          en: "Where Oldřich, still just a prince, is said to have met the peasant girl Božena by a well — the encounter that produced Břetislav, the illegitimate son growing up in the background of this very story.",
          cz: "Místo, kde se Oldřich, tehdy ještě jen kníže bez trůnu, měl u studánky setkat s venkovskou dívkou Boženou — setkání, z něhož vzešel Břetislav, nemanželský syn vyrůstající v pozadí právě tohoto příběhu.",
          zh: "传说中，尚未继位的奥尔德日赫正是在这里，于一口水井边邂逅了农家女子博热娜——这场相遇，生下了正在这个故事背景里悄悄长大的私生子布热季斯拉夫。",
        },
      },
      {
        slug: "lysa-nad-labem",
        relation: {
          en: "Where Jaromír was held after Oldřich had him blinded, and where he was murdered on the toilet in 1035 by an assassin sent by the Vršovci — the actual end of the story this event's title gestures at.",
          cz: "Místo, kde byl Jaromír vězněn poté, co ho Oldřich nechal oslepit, a kde ho v roce 1035 na záchodě zavraždil nájemný vrah vyslaný Vršovci — skutečný konec příběhu, na který název této události naráží.",
          zh: "雅罗米尔被奥尔德日赫弄瞎之后被囚禁于此，1035年也正是在这里，他在如厕时被维尔绍夫奇家族派来的刺客杀害——这才是本词条标题所暗指的那个故事的真正结局。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Old%C5%99ich,_Duke_of_Bohemia",
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
    images: ["/history/kidnapped-duchess-1019.webp"],
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
      en: "Břetislav — decades before anyone called him the 'Bohemian Achilles,' let alone before he wrote the rulebook Bohemia's succession would follow for the next century and a half — had a problem: he was the illegitimate son of Duke Oldřich, which made marrying into a family as well-connected as he needed both socially awkward and practically impossible through normal channels.\n\nSo, around 1019, he simply skipped the normal channels. He rode into Schweinfurt in Bavaria, entered the convent where Judith, daughter of the local margrave, was staying, and carried her off to marry her himself — an abduction chroniclers recorded without recording any punishment for it. It worked. Bohemia got a duchess, Břetislav got the connections his birth alone couldn't buy him, and the same man who'd later spend his final years imposing a rigid, orderly rule for who gets to inherit power began his own adult life by simply deciding the rules didn't apply to him.\n\nFair warning: none of this happened anywhere near Prague either — the abduction itself took place in Schweinfurt, deep in Germany. Břetislav and Judith didn't settle in Prague afterward, either; they set up house in Olomouc, Moravia, where he governed as the deputy of his father Oldřich — still very much alive and still Duke of Bohemia — and it was from Olomouc, in 1029, that he'd launch the campaign to win Moravia back for good. Olomouc sits a good 250 kilometres from Prague, well outside this app's day-trip radius, so this chapter goes landmark-free too.",
      cz: "Břetislav — desítky let předtím, než mu kdokoli začal říkat „český Achilles\", natož než sepsal pravidlo, podle kterého se české nástupnictví řídilo dalších sto padesát let — měl jeden problém: byl nemanželským synem knížete Oldřicha, což sňatek s natolik dobře napojenou rodinou, jakou potřeboval, dělalo společensky trapným i prakticky nemožným běžnou cestou.\n\nKolem roku 1019 tedy tu běžnou cestu jednoduše přeskočil. Přijel do bavorského Schweinfurtu, vstoupil do kláštera, kde pobývala Jitka, dcera tamního markraběte, a odvezl si ji s sebou, aby si ji vzal za ženu — únos, který kronikáři zaznamenali, aniž by zaznamenali za něj jakýkoli trest. Fungovalo to. Čechy získaly kněžnu, Břetislav získal spojenectví, které mu samotný jeho původ nikdy nemohl zajistit — a tentýž muž, který na sklonku života prosadil přísné, uspořádané pravidlo, kdo smí zdědit moc, začal svůj dospělý život prostým rozhodnutím, že pravidla se ho netýkají.\n\nUpozornění: ani tohle se neodehrálo nikde poblíž Prahy — samotný únos proběhl v bavorském Schweinfurtu, hluboko v Německu. Břetislav s Jitkou se navíc po návratu neusadili v Praze, ale na Moravě v Olomouci, kde vládl jako zástupce svého otce Oldřicha — tehdy ještě živého a stále vládnoucího knížete — a právě odtud v roce 1029 vytáhl na tažení, které mu mělo Moravu vrátit nadobro. Olomouc leží dobrých 250 kilometrů od Prahy, daleko za hranicí jednodenního výletu, takže ani tahle kapitola nemá svou památku.",
      zh: "布热季斯拉夫——在任何人称他为“波希米亚的阿喀琉斯”之前几十年，更早于他后来立下那条支配波希米亚继承制度长达一个半世纪的规矩之前——曾面对一个难题：他是奥尔德里希公爵的私生子，这个出身让他想通过正常途径迎娶一位门当户对、家世显赫的女子，既尴尬又几乎不可能。\n\n于是大约在1019年，他索性绕开了正常途径。他策马赶到巴伐利亚的施瓦因富特，闯入当地边区伯爵之女尤迪特所在的修道院，把她带走，强行娶她为妻——编年史家记下了这场绑架，却没有记下任何惩罚。这招奏效了。波希米亚由此有了一位公爵夫人，布热季斯拉夫也因此得到了单凭出身永远换不来的人脉与联姻关系——而正是这个人，日后在生命的最后阶段确立了一套严格有序、规定谁有权继承权力的规矩，他自己的成年生活，却是从“规矩管不着我”这个决定开始的。\n\n提醒一句：这件事从头到尾也没发生在布拉格附近——绑亲本身发生在德国腹地的施瓦因富特。布热季斯拉夫和尤迪特回国后，也没有留在布拉格，而是定居在摩拉维亚的奥洛穆茨，他在那里以父亲奥尔德日赫（当时依然在世、仍是波希米亚公爵本人）代理人的身份统治摩拉维亚，1029年正是从奥洛穆茨出发，发起了收复摩拉维亚的军事行动。奥洛穆茨距布拉格足有250公里，远超本应用“一日游”范围，所以这一节同样没有配套地标。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Judith_of_Schweinfurt",
  },
  {
    slug: "bohemian-achilles-1029",
    era: "bohemian-duchy",
    startYear: 1029,
    year: {
      en: "1029–1041 (his campaigns)",
      cz: "1029–1041 (jeho tažení)",
      zh: "1029年－1041年（军事生涯）",
    },
    images: ["/history/bohemian-achilles-1029.webp"],
    tone: "serious",
    title: {
      en: "The Bohemian Achilles",
      cz: "Český Achilles",
      zh: "波希米亚的阿喀琉斯",
    },
    hookLine: {
      en: "For a dozen years, Duke Břetislav I did what almost no Přemyslid before him had managed: he kept winning. It would not, in the end, be enough.",
      cz: "Kníže Břetislav I. po dvanáct let dokazoval to, co se skoro žádnému přemyslovci před ním nepodařilo: prostě vyhrával. Nakonec to ale nestačilo.",
      zh: "在长达十二年的时间里，布热季斯拉夫一世公爵做到了几乎没有一位普热美斯家族先辈能做到的事——他一直在赢。可到头来，这还是不够。",
    },
    summary: {
      en: "Břetislav's first taste of independent command came in 1029, while still just a prince stationed in Olomouc as his father's man in Moravia: backed by Holy Roman Emperor Conrad II, he drove the Poles out of Moravia and brought it back under Bohemian control — a rare piece of good news after years of watching Poland carve the country up. The following year, still under Conrad's banner, he marched into Hungary alongside the emperor to check King Stephen I's ambitions — Bohemia's first real taste of playing offense on that frontier rather than defense.\n\nIn 1034, with his father Oldřich dead and his blinded uncle Jaromír declining a second turn at a throne that had already cost him both his eyes, Břetislav finally became Duke of Bohemia in his own right — not by conquest or intrigue this time, simply by outliving the alternatives.\n\nHis defining campaign came five years later. In 1039, Břetislav invaded Greater and Lesser Poland, captured the Polish capital at Poznań, sacked Gniezno itself, and seized the relics of St. Adalbert, his companion Radim Gaudentius, and the so-called Five Brothers, carrying them home to Bohemia — picking up part of Silesia on the way back. For one brief moment Bohemian authority reached deep into Poland, Kraków included, territory no Přemyslid duke had held before or would hold so completely again. It's the raid that earned Břetislav his lasting epithet, 'the Bohemian Achilles,' from Cosmas of Prague, writing his chronicle a century later — the single line he's still best remembered by.\n\nEmperor Henry III did not share the enthusiasm — an unauthorized Bohemian reach stretching to Kraków was not the obedient client duchy the Empire had signed up for. His first invasion was ambushed and turned back at Brůdek in 1040, but a second attempt the next year succeeded, helped along by a mutiny among Břetislav's own nobles and, by one account, an outright betrayal from Bishop Šebíř of Prague. Břetislav submitted, swore fealty to Henry III, and handed back nearly everything he'd taken: Poland in full, and even the sliver of Silesia he was allowed to keep as a fief rather than a conquest slipped back within a few years. Only Moravia, and the relics, stayed Bohemian for good — the pattern this whole era keeps circling back to: winning the war, and somehow still losing the peace.",
      cz: "Břetislavovo první samostatné vojenské velení přišlo v roce 1029, kdy byl ještě jen knížecím synem sídlícím v Olomouci jako otcův zástupce na Moravě: s podporou císaře Konráda II. vytlačil Poláky z Moravy a vrátil ji pod českou správu — vzácná dobrá zpráva po letech, kdy Čechy sledovaly, jak jim Polsko odkrajuje kus po kuse. O rok později, stále po boku Konráda, táhl s císařem do Uher zarazit ambice krále Štěpána I. — poprvé si Čechy na téhle hranici vyzkoušely roli útočníka, ne jen obránce.\n\nV roce 1034, po smrti otce Oldřicha a poté, co se oslepený strýc Jaromír vzdal druhé šance na trůn, který ho už jednou stál obě oči, se Břetislav konečně stal knížetem sám za sebe — tentokrát ne dobytím ani intrikou, ale prostým přežitím všech ostatních možností.\n\nJeho rozhodující tažení přišlo o pět let později. V roce 1039 vpadl Břetislav do Velkopolska i Malopolska, dobyl polské hlavní město Poznaň, vyplenil samotné Hnězdno a uchvátil ostatky svatého Vojtěcha, jeho druha Radima Gaudentia a takzvaných Pěti bratří, které odvezl domů do Čech — cestou zpátky si ještě přidal část Slezska. Na jeden krátký okamžik sahala česká moc hluboko do Polska, včetně Krakova, na území, jaké před ním žádný přemyslovský kníže nedržel a jaké už žádný jiný nikdy tak úplně neudrží znovu. Právě tohle tažení mu o století později vyneslo od kronikáře Kosmy trvalou přezdívku „český Achilles\" — jedinou větu, podle které si ho dodnes nejvíc pamatujeme.\n\nCísař Jindřich III. z toho nadšený nebyl — neschválené české panství sahající až ke Krakovu nebylo tou poslušnou provincií, na jakou byla Říše zvyklá. Jeho první invaze skončila přepadením a porážkou u Brůdku v roce 1040, ale druhý pokus o rok později uspěl, k čemuž napomohla vzpoura mezi Břetislavovými vlastními šlechtici a podle jednoho podání i vyložená zrada pražského biskupa Šebíře. Břetislav se podrobil, přísahal Jindřichovi III. věrnost a vrátil téměř všechno, co dobyl: Polsko úplně celé, a i ten kousek Slezska, který si směl ponechat jako léno místo dobytí, se během několika let opět sesul zpátky k Polsku. Natrvalo Čechám zůstala jen Morava a ostatky — přesně ten vzorec, ke kterému se celá tahle éra pořád vrací: vyhrát válku, a přesto nějak prohrát mír.",
      zh: "布热季斯拉夫第一次独立领兵，是在1029年——那时他还只是驻守奥洛穆茨、替父亲管理摩拉维亚的公子。在神圣罗马皇帝康拉德二世的支持下，他把波兰人赶出摩拉维亚，重新收归波希米亚——在波希米亚眼睁睁看着波兰蚕食国土多年之后，这是难得的好消息。次年，他仍在康拉德麾下，随皇帝一同出兵匈牙利，遏制国王伊什特万一世的扩张势头——这是波希米亚第一次在这条边境线上尝到进攻、而非防守的滋味。\n\n1034年，父亲奥尔德日赫去世后，双目失明的叔父雅罗米尔放弃了再次登上那个已经让他失去双眼的宝座的机会，布热季斯拉夫终于正式成为公爵——这一次，靠的既不是征服，也不是阴谋，只是熬到了所有其他人选都不在场。\n\n他真正决定性的一战，出现在五年之后。1039年，布热季斯拉夫挥师入侵大波兰与小波兰，攻陷了波兰都城波兹南，血洗格涅兹诺本城，夺走了圣阿达尔伯特及其同伴拉迪姆·高登提乌斯，还有所谓“五兄弟”的遗骨，带回波希米亚——回师途中，又顺手拿下了部分西里西亚。就在这短暂的一瞬间，波希米亚的势力一路深入波兰腹地，克拉科夫也不例外，这片疆域此前从没有哪位普热美斯公爵真正握有过，此后也再没有人能如此彻底地把它握在手里。正是这场远征，让一个世纪后写下编年史的科斯马斯，给他冠上了“波希米亚的阿喀琉斯”这个流传至今的称号——人们记住他，多半也就靠这一句。\n\n神圣罗马皇帝亨利三世可完全高兴不起来——一个未经批准、势力延伸到克拉科夫的波希米亚，根本不是帝国想要的那种听话附庸。1040年，他第一次入侵就在布鲁德克遭遇伏击、铩羽而归；第二年再度出兵，这次成功了，布热季斯拉夫自己的贵族发生哗变，据说布拉格主教舍比日也彻底倒戈，都帮了忙。布热季斯拉夫最终屈服，向亨利三世宣誓效忠，几乎交还了打下的一切：波兰领土悉数归还，就连获准以封地名义保留的那一小片西里西亚，也在数年后重新滑回波兰手中。波希米亚永久留住的，只有摩拉维亚和那批遗骨——这也正是这整段历史反复兜回的同一个模式：赢下了战争，却不知怎的，还是输掉了和平。",
    },
    relatedLandmarks: [
      {
        slug: "chrudim",
        relation: {
          en: "Where Břetislav's military career actually ended — not in battle, but mid-muster, as he assembled troops here in January 1055 for a planned third invasion of Hungary and died before he could lead it.",
          cz: "Místo, kde Břetislavova vojenská kariéra doopravdy skončila — ne v boji, ale uprostřed shromažďování vojska, když zde v lednu 1055 sbíral síly na plánovanou třetí výpravu proti Uhrám a zemřel dřív, než ji stihl vést.",
          zh: "布热季斯拉夫的军事生涯真正落幕之处——不是死于战场，而是死在集结军队的途中：1055年1月，他正在这里为计划中的第三次匈牙利远征招兵备战，却在出征之前就已去世。",
        },
      },
      {
        slug: "chlumec",
        relation: {
          en: "A quieter footnote to the same 1029–1041 campaign years: in September 1040, weeks after Henry III's main army was routed at Brůdek, a second Saxon column advancing near here under Eckard II of Meissen chose to negotiate a withdrawal rather than fight — Chlumec's own name wouldn't get attached to a real battle for another 86 years.",
          cz: "Tišší poznámka pod čarou ke stejným letům 1029–1041: v září 1040, pár týdnů po tom, co bylo Jindřichovo hlavní vojsko rozprášeno u Brůdku, se druhá saská kolona postupující poblíž pod velením Ekkeharda Míšeňského raději dohodla na ústupu, než aby bojovala — jméno Chlumec si na skutečnou bitvu počkalo ještě dalších 86 let.",
          zh: "同属1029–1041年这段征战岁月里一个更安静的小注脚：1040年9月，就在亨利三世主力在布鲁德克溃败几周之后，由迈森的埃克哈德二世率领的另一支萨克森偏师推进到此附近，最终选择谈判撤军，而没有真正开战——“赫卢梅茨”这个名字要跟一场真正打起来的战役挂上钩，还得再等86年。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bretislav_I",
  },
  {
    slug: "bretislav-succession-law-1055",
    era: "bohemian-duchy",
    startYear: 1055,
    year: {
      en: "1054–1055",
      cz: "1054–1055",
      zh: "1054年－1055年",
    },
    images: ["/history/bretislav-succession-law-1055.webp"],
    tone: "humorous",
    title: {
      en: "The Rule That Explains Everything After",
      cz: "Pravidlo, které vysvětluje všechno, co přišlo potom",
      zh: "一条解释了后来一切的规矩",
    },
    hookLine: {
      en: "Nicknamed the 'Bohemian Achilles' for his military record, Duke Břetislav I left Bohemia one more thing on his deathbed: the reason its royal crowns kept slipping off.",
      cz: "Kníže Břetislav I., přezdívaný pro své vojenské úspěchy „český Achilles\", zanechal Čechám na smrtelné posteli ještě jednu věc: důvod, proč jim ty královské koruny pořád sklouzávaly z hlavy.",
      zh: "布热季斯拉夫一世公爵，因战功显赫而被称为“波希米亚的阿喀琉斯”，在临终前还给波希米亚留下了另一样东西：解释了此后王冠为何总是戴不稳的那条规矩。",
    },
    summary: {
      en: "By the time Břetislav I turned to his final and most consequential piece of statecraft, he'd already earned his 'Bohemian Achilles' nickname on the battlefield — the full story of how has its own chapter earlier on this timeline. That reputation wasn't what secured Bohemia's future, though. In 1054, near the end of his life, he turned from conquest to a much quieter kind of threat: the throne itself, and what would happen to it once he was gone. He bound his own sons and the kingdom's nobles to a single rule for who ruled next — a decree he confirmed once more from his deathbed, dying at Chrudim on 10 January 1055 while readying yet another campaign, this one against Hungary, that he never lived to lead.\n\nThe rule it set was simple to state and brutal to live under: not the eldest son, but the eldest surviving male of the entire Přemyslid line would become duke next, with the duchy kept whole rather than divided among heirs. The idea was to spare Bohemia from being ruled by children and to hold the dynasty together as one house. What it actually produced was three-quarters of a century of cousins, uncles, and nephews jockeying for a title that could land on almost any of them — which is exactly the unstable backdrop against which Vratislaus II and Vladislaus II later had to go begging emperors for personal, one-generation crowns instead of anything more permanent. Bohemia wouldn't get a succession an emperor could safely make hereditary until Otakar I broke the pattern in 1198.",
      cz: "V době, kdy se Břetislav I. pustil do svého posledního a nejzávažnějšího státnického kroku, si už dávno vysloužil přezdívku „český Achilles\" na bojišti — celý příběh, jak k tomu došlo, má na téhle časové ose vlastní, dřívější kapitolu. Tahle pověst ale nebyla tím, co zajistilo budoucnost Čech. V roce 1054, ke konci svého života, se od dobývání obrátil k mnohem tišší hrozbě: k samotnému trůnu a k tomu, co se s ním stane, až tu nebude. Zavázal vlastní syny i šlechtu království jediným pravidlem, kdo bude vládnout dál — výnos, který ještě jednou potvrdil na smrtelné posteli, když 10. ledna 1055 umíral v Chrudimi, kde se právě chystal na další tažení, tentokrát proti Uhrám, jež už nikdy nevedl.\n\nPravidlo samo bylo snadné vyslovit a kruté žít pod ním: knížetem se dál nestane nejstarší syn, ale nejstarší žijící muž z celé přemyslovské linie, přičemž knížectví mělo zůstat celistvé, ne rozdělené mezi dědice. Myšlenka byla ušetřit Čechy vlády dětí a udržet dynastii pohromadě jako jeden rod. Co to skutečně přineslo, byly tři čtvrtiny století bratranců, strýců a synovců, kteří se přetahovali o titul, jenž mohl připadnout téměř komukoli z nich — a přesně na tomhle nestabilním pozadí museli Vratislav II. a Vladislav II. později prosit císaře o osobní, jednogenerační koruny místo čehokoli trvalejšího. Nástupnictví, které by si císař mohl bezpečně dovolit učinit dědičným, Čechy nedostaly, dokud Otakar I. v roce 1198 tenhle vzorec neprolomil.",
      zh: "到布热季斯拉夫一世着手他这一生最后、也是最重要的一次治国举措时，他早已凭战功赢得了“波希米亚的阿喀琉斯”这个绰号——完整的故事，本时间线更早的一节里已经讲过。但真正关系到波希米亚未来的，并不是这份战功。1054年，临近生命尽头，他把注意力从征服转向了一种安静得多的威胁：公位本身，以及他百年之后它将何去何从。他让自己的儿子们和王国的贵族们，都立誓遵守同一条继位规矩——这道法令，他在临终之际又再一次确认：1055年1月10日，他病逝于赫鲁季姆，当时正准备着又一次远征——这次目标是匈牙利，只是他再也没能亲自领军出征。\n\n这条规矩说起来简单，活在其中却很残酷：此后继任公爵的，不是长子，而是整个普热美斯家族里在世的最年长男性，公国要保持完整，不再在诸子间分割。这个想法的初衷，是让波希米亚免于由孩童执政，并把整个家族维系为一体。但它实际造成的结果，是接下来四分之三个世纪里，堂表兄弟、叔伯侄甥为一个几乎人人都有资格染指的头衔明争暗斗——而正是在这样一片动荡不安的背景之下，弗拉季斯拉夫二世和弗拉迪斯拉夫二世后来才不得不向皇帝乞求那种仅限个人、只管一代的王冠，而非任何更持久的东西。直到1198年奥托卡一世打破了这个循环之前，波希米亚始终没能等来一套让皇帝敢于放心确立为世袭的继承制度。",
    },
    relatedLandmarks: [
      {
        slug: "chrudim",
        relation: {
          en: "Where the decree was confirmed for the last time — Břetislav summoned his sons to his deathbed here and died days later, on 10 January 1055, having settled who would rule after him.",
          cz: "Místo, kde byl výnos naposledy potvrzen — Břetislav sem k svému smrtelnému loži svolal syny a o pár dní později, 10. ledna 1055, zemřel, poté co vyřešil, kdo bude vládnout po něm.",
          zh: "这道法令最后一次被确认之地——布热季斯拉夫把儿子们召到病榻前，几天后，1055年1月10日，在解决了身后由谁继位的问题之后，他在此去世。",
        },
      },
      {
        slug: "prague-castle",
        relation: {
          en: "Where Břetislav I and his wife Judith of Schweinfurt were ultimately laid to rest together, and where the relics of St. Adalbert he had recovered at Gniezno had already been resting for sixteen years by the time he joined them.",
          cz: "Kde byli Břetislav I. a jeho žena Jitka ze Svinibrodu nakonec společně pohřbeni, a kam už šestnáct let před jeho vlastním pohřbem doputovaly ostatky svatého Vojtěcha, které sám dobyl zpět v Hnězdně.",
          zh: "布热季斯拉夫一世与妻子施瓦因富特的尤迪特最终合葬于此，而他当年在格涅兹诺夺回的圣阿达尔伯特遗骨，早在他本人安葬于此的十六年前，就已经先一步安放在这里。",
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
    images: ["/history/vysehrad-revival-1070.webp"],
    tone: "humorous",
    title: {
      en: "Brother Rivalry",
      cz: "Bratrská rivalita",
      zh: "兄弟争宠",
    },
    hookLine: {
      en: "Břetislav's tidy succession rule didn't stop his own sons from fighting — it just gave the fighting a slightly more formal shape.",
      cz: "Břetislavovo úhledné pravidlo nástupnictví jeho vlastním synům rvačky nezabránilo — jen jim dalo o něco formálnější podobu.",
      zh: "布热季斯拉夫那套整整齐齐的继承规矩，并没能阻止他自己的儿子们互相争斗——只是让这场争斗多了几分表面上的规矩。",
    },
    summary: {
      en: "Břetislav's succession law worked fine the first time it was used. He died in 1055, and his eldest son, Spytihněv II, simply became duke — no dispute, no drama. Spytihněv held the job for six years, until his own death in 1061.\n\nNext came Vratislaus II — the same man who'd become Bohemia's first king in 1085. Quick warning: that's Vratislaus (with a T), not Vladislaus (with a D) — the guy who'd build that bridge a century later. The Přemyslid family's imagination for names, it turns out, aged about as well as their succession law.\n\nHis reign was a lot less peaceful than his brother's. For years, he was locked in a bitter feud with his own younger brother, Jaromír, who'd become Bishop of Prague. The two needled each other constantly — Vratislaus reportedly wore bishop's vestments around Jaromír, just to provoke him. The real blow came in 1063, when Vratislaus carved a new Moravian diocese out of Olomouc, stripping the Prague bishopric of a large chunk of territory and income. Jaromír never let it go. He once marched in with armed men and seized church relics by force, just to make his point.\n\nIn 1070, Vratislaus found a more permanent way to win. He richly endowed the Vyšehrad Chapter and placed it directly under Rome's authority — answerable to the Pope, not to his own brother the bishop. It gave Vyšehrad a genuine second act: no longer just a legendary seat from Bohemia's earliest days, but a real rival religious power centre, built specifically to outflank his brother.\n\nThe brothers kept one-upping each other for years after that, too. In 1075, Vratislaus personally led Bohemian troops to victory alongside Emperor Henry IV at the Battle of Langensalza, crushing a Saxon revolt and banking a serious favour with the emperor. Jaromír, not to be outdone, found his own way into Henry's good graces two years later: in 1077 he became the emperor's chancellor and rebranded himself with a brand-new, thoroughly German name — Gebhard. Somewhere along the way, apparently, 'annoy your sibling by any means available' became the family's real inheritance rule.\n\nThe investment paid off in one more way, too — though that part of the story wouldn't play out for another couple of decades: the very basilica he'd built up would end up being where he was laid to rest as well.",
      cz: "Břetislavovo nástupnické pravidlo fungovalo hned napoprvé bez problémů. Zemřel v roce 1055 a jeho nejstarší syn Spytihněv II. se prostě stal knížetem — žádný spor, žádné drama. Spytihněv vydržel v úřadu šest let, až do vlastní smrti v roce 1061.\n\nNa řadě byl Vratislav II. — tentýž muž, který se v roce 1085 stane prvním českým králem. Malé upozornění: je to Vratislav (s T), ne Vladislav (s D) — ten, co o sto let později postaví ten most. Fantazie přemyslovského rodu na jména očividně zestárla stejně dobře jako jejich nástupnický řád.\n\nJeho vláda byla o poznání méně klidná než bratrova. Léta byl ve vleklém sporu s vlastním mladším bratrem Jaromírem, který se stal pražským biskupem. Oba se soustavně škádlili — Vratislav prý kolem Jaromíra chodil v biskupském rouchu, jen aby ho popíchl. Skutečná rána přišla v roce 1063, kdy Vratislav vyčlenil z Olomouce novou moravskou diecézi a připravil pražské biskupství o velký kus území i příjmů. Jaromír to nikdy nespolkl. Jednou dokonce přitáhl s ozbrojenci a násilím zabavil církevní ostatky, jen aby dal najevo svůj postoj.\n\nV roce 1070 našel Vratislav trvalejší způsob, jak vyhrát. Bohatě obdaroval vyšehradskou kapitulu a podřídil ji přímo Římu — tedy papeži, ne vlastnímu bratrovi biskupovi. Dal tím Vyšehradu skutečné druhé dějství: už ne jen legendární sídlo z nejranějších českých dějin, ale opravdové konkurenční církevní mocenské centrum, postavené přímo proto, aby obešlo jeho bratra.\n\nBratři se pak ještě léta předháněli dál. V roce 1075 vedl Vratislav osobně české oddíly po boku císaře Jindřicha IV. k vítězství v bitvě u Langensalzy, kde rozdrtili saské povstání, a vysloužil si tím u císaře pořádný vděk. Jaromír si nenechal ujít příležitost a o dva roky později, v roce 1077, si u Jindřicha vysloužil vlastní přízeň — stal se jeho kancléřem a přijal zbrusu nové, důkladně německé jméno: Gebhard. Zdá se, že „otravovat sourozence jakýmkoli dostupným způsobem\" se v té rodině nakonec stalo skutečným dědičným pravidlem.\n\nInvestice se vyplatila ještě jinak — i když tahle část příběhu se odehraje až o pár desetiletí později: ta samá bazilika, kterou pozvedl, se nakonec stane i místem jeho posledního odpočinku.",
      zh: "布热季斯拉夫的继承规矩，第一次用起来还算顺利：1055年他一去世，长子斯皮蒂赫涅夫二世就顺顺当当当上了公爵，没有争议，没有波折，一坐就是六年，直到1061年自己也去世。\n\n接下来继位的是弗拉季斯拉夫二世——也就是1085年将成为波希米亚第一位“国王”的那位。提醒一句：是弗拉季斯拉夫二世（“季”字那个），不是一百年后建了那座桥的弗拉迪斯拉夫二世（“迪”字那个）——普热美斯尔家族取名的想象力，显然和他们家的继承制度一样，都没能与时俱进。\n\n他的日子可比哥哥太平不了多少：多年来，他一直和亲弟弟——后来当上布拉格主教的亚罗米尔——闹得很僵。两人互相较劲：弗拉季斯拉夫会故意穿上主教的礼服，跑到亚罗米尔面前晃来晃去，就为了气他。真正的重手是1063年：弗拉季斯拉夫在奥洛穆茨另立了一个摩拉维亚教区，一下子削掉了布拉格主教辖区一大块地盘和收入。亚罗米尔咽不下这口气，甚至有一次带着人马冲过去，硬生生把教会的圣物抢了回来，就为了表明态度。\n\n1070年，弗拉季斯拉夫想出了一招更持久的：他大手笔资助维谢赫拉德教士团，把这个据点直接挂靠到罗马教廷名下，只听教皇的，不归弟弟这位布拉格主教管。这一招等于是给维谢赫拉德开了“第二春”——它不再只是波希米亚早年传说里那个古老据点，而是变成了一个真正能跟布拉格分庭抗礼的宗教权力中心，专门用来架空弟弟。\n\n这对兄弟此后还较了好几年劲。1075年，弗拉季斯拉夫亲自率领波希米亚军队，跟随亨利四世皇帝在兰根萨察战役中获胜，镇压了一场萨克森叛乱，狠狠在皇帝那儿刷了一波好感。亚罗米尔当然不甘落后：两年后，1077年，他也找到了讨好亨利四世的门路——当上了皇帝的大法官，还给自己改了个彻头彻尾的德语名字：“格布哈特”。看来“想方设法气对方”这条家规，才是这家人真正代代相传的东西。\n\n这笔投资后来还多了一层意义——只是这部分故事要再过二十来年才会揭晓：他一手扶植起来的这座教堂，最终也会成为他自己的长眠之地。",
    },
    relatedLandmarks: [
      {
        slug: "basilika-sv-petra-pavla",
        relation: {
          en: "Vratislaus didn't just fund this basilica to spite his brother — he was buried here himself in 1092, making it both the direct beneficiary of his 1070 power play and, in the end, his own final resting place.",
          cz: "Vratislav tuto baziliku nefinancoval jen proto, aby naštval bratra — sám tu byl v roce 1092 pohřben, takže je to zároveň přímý příjemce jeho mocenského tahu z roku 1070 i jeho vlastní poslední místo odpočinku.",
          zh: "弗拉季斯拉夫资助这座教堂，可不只是为了气弟弟——他本人1092年也安葬于此，使这里既是他1070年这场权力布局的直接受益者，最终也成了他自己的长眠之地。",
        },
      },
      {
        slug: "rotunda-sv-martina",
        relation: {
          en: "Also raised under Vratislaus at the very end of the 11th century — smaller and humbler than the basilica, but Prague's oldest still-standing building, and proof he was building up the whole hill, not just the chapter he'd set against his brother.",
          cz: "Také postavena za Vratislava, na samém konci 11. století — menší a skromnější než bazilika, ale nejstarší dodnes stojící budova v Praze, a důkaz, že budoval celý kopec, ne jen kapitulu, kterou postavil proti svému bratrovi.",
          zh: "同样建于弗拉季斯拉夫治下、11世纪末——比大教堂小得多、朴素得多，却是布拉格现存最古老的建筑，证明他经营的是整座山丘，而不只是那个用来对抗弟弟的教士团。",
        },
      },
      {
        slug: "romansky-most-vysehrad",
        relation: {
          en: "The bridge King Vratislaus had built to connect his princely and royal quarter to the basilica he'd just endowed — infrastructure for the very power centre he was assembling to outflank his brother.",
          cz: "Most, který nechal král Vratislav postavit, aby propojil svůj knížecí a královský okrsek s bazilikou, kterou právě obdaroval — infrastruktura pro totéž mocenské centrum, jež budoval, aby obešel svého bratra.",
          zh: "国王弗拉季斯拉夫下令建造的这座桥，连接着他的王公与王室辖区和他刚刚资助的那座大教堂——正是他用来架空弟弟而打造的这整套权力中心的配套基础设施。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vratislaus_II_of_Bohemia",
  },
  {
    slug: "vratislaus-emperors-fireman-1081",
    era: "bohemian-duchy",
    startYear: 1080,
    year: {
      en: "1080–1083",
      cz: "1080–1083",
      zh: "1080年－1083年",
    },
    images: ["/history/vratislaus-emperors-fireman-1081.webp"],
    tone: "humorous",
    title: {
      en: "The Emperor's Fireman",
      cz: "Císařův hasič",
      zh: "帝国救火队员",
    },
    hookLine: {
      en: "Wherever Emperor Henry IV had a fire to put out in the early 1080s, Duke Vratislaus of Bohemia was already on his way.",
      cz: "Kdekoli měl císař Jindřich IV. na počátku 80. let 11. století nějaký požár k uhašení, český kníže Vratislav už byl na cestě.",
      zh: "11世纪80年代初，只要亨利四世皇帝哪里有火要救，波希米亚公爵弗拉季斯拉夫就已经在路上了。",
    },
    summary: {
      en: "By the early 1080s, Emperor Henry IV was fighting on every front at once — the Investiture Controversy against Pope Gregory VII, a Saxon nobility that kept rebelling no matter how many times it lost, and soon a third front in Austria as well. Vratislaus II of Bohemia had already been there for one of them: Bohemian troops helped buy Henry a battlefield win at Langensalza back in 1075. He was about to be asked for a lot more.\n\nThe Saxon front flared back up first, in January 1080. At the Battle of Flarchheim, fought in a snowstorm, only Vratislaus's own contingent kept the imperial army from losing the field outright — and in the chaos, he personally cut down the Saxon rebels' standard and captured the golden lance of Henry's rival anti-king, Rudolf of Rheinfelden, supposedly a guarantee of invincibility and God's favour. It guaranteed neither.\n\nIn 1081, Margrave Leopold II of Austria — under pressure from his own wife and from the exiled Bishop Altmann of Passau, a committed papal loyalist — finally broke with Henry outright, backing a rival anti-king at a diet he convened at Tulln. Henry's response was blunt: he declared Leopold deposed and handed his march to the one ally he trusted to actually go collect it. Vratislaus obliged. In 1082 he invaded Austria, crushed Leopold's army at Mailberg, and came close to killing him outright — Leopold survived by the length of his own retreat. He kept his title in the end, but not all his territory: a strip of southern Moravia along the Thaya went instead to Prince Luitpold of Znojmo, in a twist Cosmas barely needed to embellish — Leopold's own son-in-law. It was also, quietly, revenge nobody had specifically asked Vratislaus to collect: that same stretch of border Bohemia had been forced to give up back in 1041, under his own father Břetislav I, came back into Bohemian hands with this one battle.\n\nThat same stretch of years, Vratislaus was also marching with Henry's own army into Italy — a campaign that ran from 1081 to 1084 with one purpose: physically removing Pope Gregory VII from Rome. In 1083, Bohemian troops entered the city itself alongside the emperor's. By this point, Vratislaus had fought Henry's enemies on three separate fronts in under a decade — Saxons, Austrians, and now the Pope's own capital.\n\nNone of it was charity. Two years later, in 1085, Henry finally settled the account — with a crown. It's the one thing in this whole run of campaigns Vratislaus didn't have to fight for.\n\nFair warning: none of this happened anywhere near Prague either — Mailberg was in Austria, Rome was rather more than a day trip away, and even Langensalza was deep in Saxony. This chapter goes without a landmark of its own.",
      cz: "Na počátku 80. let 11. století bojoval císař Jindřich IV. na všech frontách najednou — v boji o investituru proti papeži Řehořovi VII., proti saské šlechtě, která se bouřila znovu a znovu bez ohledu na to, kolikrát prohrála, a brzy i na třetí frontě v Rakousku. Vratislav II. u jedné z nich už byl: čeští vojáci mu pomohli vybojovat vítězství u Langensalzy už v roce 1075. Teď od něj Jindřich chtěl mnohem víc.\n\nSaská fronta vzplanula znovu jako první, v lednu 1080. V bitvě u Flarchheimu, svedené za sněhové bouře, jedině Vratislavův oddíl zabránil tomu, aby císařské vojsko úplně neztratilo bojiště — a v tom zmatku Vratislav osobně skolil saský prapor a ukořistil zlaté kopí Jindřichova protikrále Rudolfa Švábského, údajně záruku neporazitelnosti a boží přízně. Nezaručovalo ani jedno.\n\nV roce 1081 se rakouský markrabě Leopold II. — pod tlakem vlastní manželky a vyhnaného pasovského biskupa Altmanna, zapřisáhlého stoupence papeže — konečně otevřeně rozešel s Jindřichem a na sněmu, který svolal do Tullnu, podpořil soupeřícího protikrále. Jindřichova odpověď byla stručná: prohlásil Leopolda za sesazeného a jeho marku přenechal jedinému spojenci, o kterém věděl, že si ji skutečně přijde vyzvednout. Vratislav neváhal. V roce 1082 vpadl do Rakous, rozdrtil Leopoldovo vojsko u Mailberka a jen o vlásek ho nezabil — Leopold přežil díky vlastnímu útěku. Titul si nakonec podržel, ale ne celé území: pruh jižní Moravy podél Dyje připadl místo toho knížeti Litoldovi ze Znojma — a v obratu, který by ani Kosmas nemusel přikrášlovat, to byl Leopoldův vlastní zeť. Byla to zároveň, docela nenápadně, i pomsta, o kterou Vratislava nikdo výslovně nežádal: stejný kus hranice, který Čechy musely v roce 1041 odevzdat za vlády jeho vlastního otce Břetislava I., se touhle jedinou bitvou vrátil zpátky do českých rukou.\n\nVe stejných letech táhl Vratislav s Jindřichovým vlastním vojskem i do Itálie — tažení, které trvalo od roku 1081 do roku 1084 a mělo jediný cíl: fyzicky vypudit papeže Řehoře VII. z Říma. V roce 1083 vstoupily české oddíly do samotného města po boku císařových. Vratislav do té doby bojoval proti Jindřichovým nepřátelům na třech různých frontách za necelou dekádu — proti Sasům, proti Rakušanům a teď i proti samotnému papežskému hlavnímu městu.\n\nNic z toho nebyla dobročinnost. O dva roky později, v roce 1085, Jindřich účet konečně vyrovnal — korunou. Je to jediná věc z celé téhle série tažení, o kterou Vratislav nemusel bojovat.\n\nUpozornění: ani tohle se neodehrálo nikde poblíž Prahy — Mailberk ležel v Rakousku, do Říma to bylo o poznání víc než na jednodenní výlet, a i Langensalza byla hluboko v Sasku. Tahle kapitola tak zůstává bez vlastní památky.",
      zh: "11世纪80年代初，亨利四世皇帝同时在好几条战线上作战——对教皇格里高利七世的叙任权斗争、屡败屡战的萨克森贵族叛乱，很快又要在奥地利再开一条战线。弗拉季斯拉夫二世早就在其中一条战线上出过力：1075年兰根萨察战役，波希米亚军队就曾替亨利赢过一仗。这一次，亨利要的更多。\n\n萨克森战线率先在1080年1月重新燃起。在暴风雪中打响的弗拉赫海姆战役里，全靠弗拉季斯拉夫自己的部队，帝国军队才没有直接丢掉战场——混战之中，他亲手砍倒了萨克森叛军的军旗，还夺下了亨利的对头、伪王鲁道夫的那支金矛——传说这支金矛能保佑持有者战无不胜、蒙受神佑。事实证明，两样它都保证不了。\n\n1081年，奥地利藩侯利奥波德二世——在妻子和被流放的帕绍主教阿尔特曼（一位坚定的教皇党人）的双重压力下——终于跟亨利四世彻底决裂，在自己召集的图尔恩议会上公开支持敌对的伪王。亨利四世的回应很直接：宣布废黜利奥波德二世，把这块封地转授给他唯一信得过、真会亲自去接管的盟友。弗拉季斯拉夫毫不犹豫。1082年，他挥师入侵奥地利，在美尔贝格击溃利奥波德二世的军队，差一点就要了他的命——利奥波德全靠一路逃跑才捡回一条命。他最终保住了藩侯头衔，却没能保住全部领土：摩拉维亚南部沿塔亚河一带的土地，转手给了兹诺伊莫的柳特波尔德亲王——而这位亲王，说来讽刺，连科斯马斯都不用刻意渲染，正是利奥波德二世自己的女婿。这同时也是一场没人特意要求弗拉季斯拉夫去讨的报复：1041年，波希米亚曾在他自己父亲布热季斯拉夫一世治下被迫割让给奥地利的那同一片边境土地，如今仅凭这一战，就重新回到了波希米亚手中。\n\n同一段岁月里，弗拉季斯拉夫也随亨利四世的大军远征意大利——这场从1081年打到1084年的战役，目的只有一个：把教皇格里高利七世彻底赶出罗马。1083年，波希米亚军队随皇帝本人一同攻入罗马城。到这时，弗拉季斯拉夫已经在不到十年间，替亨利四世在三条完全不同的战线上打过仗——萨克森人、奥地利人，如今还有教皇自己的都城。\n\n这一切都不是白帮忙。两年后，1085年，亨利四世终于把账结清了——用一顶王冠。这是他这一连串征战里，唯一一样弗拉季斯拉夫不用靠打仗去争取的东西。\n\n提醒一句：这一切同样都没有发生在布拉格附近——美尔贝格在奥地利，罗马更是远超一日游范围，就连兰根萨察也是深入萨克森腹地。这一节因此没有专属的地标。",
    },
    relatedLandmarks: [],
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
    images: ["/history/vratislaus-ii-first-crown-1085.webp"],
    tone: "humorous",
    title: {
      en: "Bohemia's First Borrowed Crown",
      cz: "První vypůjčená koruna Čech",
      zh: "波希米亚第一次借来的王冠",
    },
    hookLine: {
      en: "A decade of real battlefield victories bought Vratislaus something spectacular in 1085 — a crown that would die with him.",
      cz: "Deset let opravdových vítězství na bojišti vyneslo Vratislavovi v roce 1085 něco velkolepého — korunu, která měla zemřít spolu s ním.",
      zh: "整整十年真刀真枪的战场胜利，在1085年给弗拉季斯拉夫换来了一样极其风光的东西——一顶注定要跟他一起死去的王冠。",
    },
    summary: {
      en: "By 1085, Vratislaus had spent the better part of a decade fighting Emperor Henry IV's wars for him — the previous chapter of this timeline covers all of it, campaign by campaign. Henry noticed. In April 1085, at an imperial assembly in Mainz, he offered Vratislaus the one reward he still had left to give: a crown.\n\nThe actual ceremony followed two months later, on 15 June 1085, at St. Vitus Cathedral in Prague Castle, where the Archbishop of Trier crowned Vratislaus and his wife Svatava together, with the chronicler Cosmas watching from the crowd. On paper, it was everything a decade of battlefield loyalty could buy — except for the fine print. The title was personal, not hereditary: valid for exactly one lifetime, expiring the moment Vratislaus did. Real battles, a captured lance, reconquered border towns — and what he actually walked away with was a crown he couldn't leave to anyone.\n\nThat moment came in 1092, when a hunting accident cut his reign short — and the crown reverted to plain 'duke' right on schedule. Bohemia would wait another 106 years, until 1198, before a duke got to be king again — and even that crown didn't become permanently hereditary until 1212. This one was a loan. The buyout was still generations away.\n\nThe ceremony left one more thing behind, at least. Around the same time, scribes in Regensburg produced the Vyšehrad Codex — a lavishly illuminated coronation gospel book made to commemorate the event, today a Czech national cultural monument held at Prague's National Library. The crown didn't survive three generations. The book did.",
      cz: "Do roku 1085 už Vratislav strávil většinu jednoho desetiletí bojováním ve válkách císaře Jindřicha IV. za něj — předchozí kapitola téhle časové osy je pokrývá celé, tažení po tažení. Jindřich si toho všiml. V dubnu 1085, na říšském sněmu v Mohuči, mu nabídl jedinou odměnu, kterou mu ještě mohl dát: korunu.\n\nSamotný obřad následoval o dva měsíce později, 15. června 1085, v katedrále svatého Víta na Pražském hradě, kde trevírský arcibiskup korunoval Vratislava i jeho ženu Svatavu společně, zatímco kronikář Kosmas přihlížel z davu. Na papíře to bylo všechno, co si desetiletí věrnosti na bojišti mohlo koupit — až na drobné písmenko. Titul byl osobní, ne dědičný: platný přesně na jeden lidský život, propadající ve chvíli, kdy Vratislav zemřel. Skutečné bitvy, ukořistěné kopí, znovudobytá pohraniční města — a to, co si z toho všeho skutečně odnesl, byla koruna, kterou nemohl nikomu odkázat.\n\nTa chvíle přišla v roce 1092, kdy jeho vládu předčasně ukončila lovecká nehoda — a koruna se přesně podle plánu vrátila zpátky ke knížecímu titulu. Čechy pak měly čekat dalších 106 let, až do roku 1198, než se z knížete znovu stal král — a ani tenhle titul se natrvalo dědičným nestal až do roku 1212. Tohle byla půjčka. Do splátky zbývalo ještě celé generace.\n\nObřad po sobě aspoň zanechal ještě jednu věc. Přibližně ve stejné době vyhotovili písaři v Řezně Vyšehradský kodex — bohatě iluminovaný korunovační evangeliář vzniklý na památku této události, dnes národní kulturní památka uložená v Národní knihovně v Praze. Koruna nevydržela ani tři generace. Kniha ano.",
      zh: "到1085年，弗拉季斯拉夫已经替皇帝亨利四世打了将近十年的仗——本时间线的上一节，一场一场都讲过了。亨利注意到了。1085年4月，在美因茨的帝国大会上，他把手里仅剩的一份赏赐，给了弗拉季斯拉夫：一顶王冠。\n\n真正的加冕仪式在两个月后才举行，1085年6月15日，地点在布拉格城堡的圣维特大教堂——特里尔大主教为弗拉季斯拉夫与妻子斯瓦塔娃一同加冕，编年史家科斯马斯就在人群中亲眼见证。账面上看，这是十年战场忠诚能换来的一切——除了那行小字。这个头衔是个人的，不是世袭的：有效期正好是一辈子，弗拉季斯拉夫一死就作废。真刀真枪的战役、夺来的金矛、收复的边境城镇——到头来他真正带走的，却是一顶谁都传不下去的王冠。\n\n那一刻在1092年到来——一场狩猎事故提前终结了他的统治，王冠也按部就班地降回了“公爵”头衔。波希米亚还要再等106年，直到1198年，才会重新有一位公爵当上国王——而就连那顶王冠，也要等到1212年才真正永久世袭。这一次，只是租借。距离真正买断，还要再等好几代人。\n\n这场典礼好歹留下了一样东西。差不多同一时期，雷根斯堡的抄写工坊制作出了维谢赫拉德法典——一部为纪念这次加冕而制作的华丽福音书，如今是捷克国家文化纪念物，收藏在布拉格国家图书馆。王冠没能撑过三代人。这本书撑住了。",
    },
    relatedLandmarks: [
      {
        slug: "prague-castle",
        relation: {
          en: "Where the actual ceremony happened — 15 June 1085, when the Archbishop of Trier crowned Vratislaus and his wife Svatava together, with the chronicler Cosmas watching from the crowd. The crown didn't last; the cathedral, and the record of the day it happened, did.",
          cz: "Kde se odehrál samotný obřad — 15. června 1085, kdy trevírský arcibiskup korunoval Vratislava i jeho ženu Svatavu společně, zatímco kronikář Kosmas přihlížel z davu. Koruna nevydržela; katedrála, a záznam o tom dni, ano.",
          zh: "真正的加冕典礼在此举行——1085年6月15日，特里尔大主教为弗拉季斯拉夫与妻子斯瓦塔娃一同加冕，编年史家科斯马斯就在人群中亲眼见证。王冠没能留住，但这座大教堂、还有关于那一天的记载，都留了下来。",
        },
      },
      {
        slug: "national-library-czech-republic",
        relation: {
          en: "Home today to the Vyšehrad Codex — the illuminated gospel book made to commemorate this very coronation, and the one souvenir of 1085 that never had to be handed back.",
          cz: "Dnešní domov Vyšehradského kodexu — iluminovaného evangeliáře vzhotoveného na památku právě téhle korunovace, a jediného suvenýru z roku 1085, který nikdy nemusel být vrácen.",
          zh: "维谢赫拉德法典如今就收藏在这里——这本为纪念这场加冕而制作的插图福音书，是1085年唯一一件从没被收回过的纪念品。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vratislaus_II_of_Bohemia",
  },
  {
    slug: "duke-go-round-1092",
    era: "bohemian-duchy",
    startYear: 1092,
    year: {
      en: "1092–1125",
      cz: "1092–1125",
      zh: "1092年－1125年",
    },
    images: ["/history/duke-go-round-1092.webp"],
    tone: "humorous",
    title: {
      en: "The Duke-Go-Round",
      cz: "Kolotoč knížat",
      zh: "波希米亚公爵走马灯",
    },
    hookLine: {
      en: "Bohemia's fancy new succession law was supposed to end the fighting over the throne. Instead, it just kept the throne moving.",
      cz: "Nové české nástupnické pravidlo mělo ukončit boje o trůn. Místo toho jen udrželo trůn v neustálém pohybu.",
      zh: "波希米亚那套精心设计的继承法令，本该终结王位之争的。结果它只是让王位一直在动。",
    },
    summary: {
      en: "Břetislav I's 1055 succession law was supposed to stop Bohemia's dukes from murdering each other over the throne. What it actually produced, across the next thirty-three years, was a duke-go-round nobody could get off. Conrad I lasted eight months. Bretislav II, Vratislaus's own son, held on for eight years before a hired assassin speared him in the back on his way home from a hunt at Zbečno in 1100 — the Vršovci clan again, the same family this timeline has already caught doing this twice before. Bořivoj II got the job next, lost it, got it back, and lost it again. Svatopluk grabbed the throne in 1107, ordered the near-total massacre of the Vršovci clan in 1108 for reasons that will surprise absolutely no one at this point, and was assassinated himself the following year — this timeline already flagged that one coming, several chapters ago. By the time Vladislaus I finally settled in for a comparatively marathon sixteen-year reign, Bohemia had gone through five different dukes in seventeen years, most of them related, several of them at war with each other simultaneously.\n\nAcross the border, the other half of the story was quietly rearranging itself too. Emperor Henry IV — the man Bohemia had bled for at Langensalza, Flarchheim, Mailberg, and the gates of Rome — died in 1106, succeeded by his son Henry V. When Henry V himself died in 1125 without an heir, the Salian dynasty that had ruled the Empire for a century simply ran out of Salians. German princes elected a new emperor, Lothair III of Saxony, passing over Henry V's own nephew and presumptive heir, Frederick II of Swabia — the first Hohenstaufen to just miss the throne, though not the last time that family would come knocking. Whatever personal loyalty Vratislaus had spent a decade building with the old Salian emperors, it didn't transfer. Lothair owed Bohemia nothing, and knew it.\n\nTwo unstable successions, running on separate tracks for over thirty years, were about to collide. In 1125, Vladislaus I died — and Bohemia found itself picking a new duke at the exact moment the Empire had just finished picking a new emperor who'd never met any of them.",
      cz: "Břetislavův nástupnický zákon z roku 1055 měl zabránit tomu, aby se čeští knížata navzájem vraždili kvůli trůnu. Co ve skutečnosti přinesl, bylo za dalších třiatřicet let kolotoč knížat, ze kterého nešlo seskočit. Konrád I. vydržel osm měsíců. Břetislav II., vlastní syn Vratislava, se udržel osm let, než ho na cestě z lovu u Zbečna v roce 1100 zezadu probodl kopím najatý vrah — zase Vršovci, tentýž rod, který tahle časová osa přistihla už dvakrát předtím. Bořivoj II. dostal úřad příště, přišel o něj, dostal ho zpátky a zase o něj přišel. Svatopluk se chopil trůnu v roce 1107, v roce 1108 nechal téměř vyvraždit rod Vršovců — z důvodů, které v tomhle bodě nikoho ani trochu nepřekvapí — a rok nato byl sám zavražděn, což tahle časová osa avizovala už před několika kapitolami. Než se Vladislav I. konečně usadil na poměrech téhle éry nepředstavitelně dlouhých šestnáct let, prošly Čechy za sedmnáct let pěti různými knížaty, většinou navzájem příbuznými, několik z nich zároveň ve válce jeden s druhým.\n\nZa hranicemi se přitom potichu přeskupovala i druhá polovina příběhu. Císař Jindřich IV. — muž, za kterého Čechy krvácely u Langensalzy, Flarchheimu, Mailberka i před branami Říma — zemřel v roce 1106 a nahradil ho syn Jindřich V. Když v roce 1125 zemřel bez dědice i on sám, sálské dynastii, jež říši vládla přes sto let, jednoduše došli Sálcové. Němečtí kurfiřti zvolili nového císaře, saského Lotara III., a přeskočili přitom vlastního synovce a domnělého dědice Jindřicha V., Fridricha II. Švábského — prvního štaufského knížete, který právě přišel o trůn o vlásek, i když ne posledního, kdo si přijde zaklepat. Ať už si Vratislav u starých sálských císařů vybudoval jakoukoli osobní důvěru za celé to desetiletí, na Lotara se nepřenesla. Lotar Čechám nic nedlužil a dobře to věděl.\n\nDvě nestabilní nástupnické linie, běžící přes třicet let po oddělených kolejích, se právě chystaly srazit. V roce 1125 zemřel Vladislav I. — a Čechy si musely vybrat nového knížete přesně ve chvíli, kdy si říše právě vybrala nového císaře, který se s žádným z nich nikdy nesetkal.",
      zh: "布热季斯拉夫1055年颁布的继承法令，本来是要阻止波希米亚公爵们为了王位自相残杀的。可它接下来三十三年间实际造成的，却是一场谁也下不来的“公爵走马灯”。康拉德一世只撑了八个月。弗拉季斯拉夫的亲儿子布热季斯拉夫二世，撑了八年，1100年打猎回程途中，在兹别奇诺被一名雇佣杀手从背后一矛刺穿——又是维尔绍夫奇家族，这条时间轴已经逮到他们干过两次同样的事了。博日沃伊二世接过了这个位子，丢了，又拿回来，又丢了。斯瓦托普鲁克1107年夺得王位，1108年下令几乎灭绝维尔绍夫奇家族——理由到这个份上，恐怕没人会觉得意外——第二年他自己也被刺杀身亡，这条时间轴早在好几节之前就已经预告过这个结局。等到弗拉迪斯拉夫一世终于坐稳了这个年代里堪称“超长待机”的十六年，波希米亚已经在十七年间换了五位公爵，大多数还是亲戚，好几位甚至同时互相开战。\n\n与此同时，边境线另一侧，故事的另一半也在悄悄改朝换代。亨利四世皇帝——波希米亚曾为他在兰根萨察、弗拉赫海姆、美尔贝格乃至罗马城下流过血——1106年去世，由儿子亨利五世继位。1125年，亨利五世本人也在没有子嗣的情况下去世，统治帝国已逾百年的萨利安王朝，就这样断了香火。德意志的选帝侯们选出了一位新皇帝——萨克森的洛泰尔三世，跳过了亨利五世自己的侄子、理应继位的施瓦本的腓特烈二世——这是霍亨斯陶芬家族第一次与皇位擦肩而过，却不是最后一次上门敲门。不管弗拉季斯拉夫当年花了整整十年在萨利安老皇帝那里攒下多少私人交情，都没能传下去。洛泰尔不欠波希米亚什么，他自己也很清楚这一点。\n\n两条各自动荡了三十多年的继承线索，眼看就要撞在一起。1125年，弗拉迪斯拉夫一世去世——波希米亚这边正要挑选新公爵，帝国那边也刚刚选出了一位谁都没见过的新皇帝。\n\n如果这套“继承规矩留了空子→各方各自去搬外部靠山→靠山每帮一次忙，内斗就再深一层”的剧本让你觉得有点眼熟——某种程度上，这跟春秋战国时期大国借小国君位真空扶植代理人的老套路，确实有几分神似，只是这边从始至终搬来搬去的，就只有普热美斯尔家的堂兄弟们和境外的神圣罗马皇帝，没有第三方势力搅局。",
    },
    relatedLandmarks: [
      {
        slug: "hradiste-libice",
        relation: {
          en: "The same fortress, a different massacre: over a century after the Slavník family was wiped out here, the Vršovci — who may well have been rewarded with Libice for helping carry that massacre out — were hunted down and killed at the same site in 1108, on Duke Svatopluk's orders. Two purges, one hilltop.",
          cz: "Totéž hradiště, jiná vražda: přes sto let poté, co tu byl vyhlazen rod Slavníkovců, byli na stejném místě v roce 1108 na příkaz knížete Svatopluka pronásledováni a pobiti Vršovci — rod, který za pomoc při té první vraždě možná dostal Libici jako odměnu. Dvě čistky, jeden kopec.",
          zh: "同一座要塞，另一场屠杀：斯拉夫尼克家族在这里被灭族一百多年后，1108年，维尔绍夫奇家族——很可能正是当年因协助那场屠杀而被赏赐利比采的那个家族——又在同一个地方，奉斯瓦托普鲁克公爵之命被追杀殆尽。两场清洗，同一座山丘。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vladislaus_I,_Duke_of_Bohemia",
  },
  {
    slug: "bohemia-not-one-city-1101",
    era: "bohemian-duchy",
    startYear: 1101,
    cardType: "background",
    year: {
      en: "11th–12th century",
      cz: "11.–12. století",
      zh: "11至12世纪",
    },
    // Image deliberately removed from display (2026-08) per user call: this
    // and future background-knowledge cards default to pure text, witty
    // tone, no illustration — matches what-was-moravia-1127 and
    // what-was-the-holy-roman-empire-1002. The file itself is left in place
    // at client/public/history/bohemia-not-one-city-1101.webp, just unused.
    tone: "serious",
    title: {
      en: "Bohemia Wasn't a One-City Story (Yet)",
      cz: "Čechy ještě nebyly příběhem jednoho města",
      zh: "波希米亚，还不是布拉格一城独大",
    },
    hookLine: {
      en: "Before this timeline gets to Chlumec — a war fought entirely over who controls Moravia — it's worth pausing to map out just how many power centers 11th-century Bohemia actually had.",
      cz: "Než se tahle časová osa dostane k Chlumci — válce vedené výhradně o to, kdo ovládá Moravu — stojí za to se na chvíli zastavit a zmapovat, kolik mocenských center měly Čechy 11. století vlastně najednou.",
      zh: "在时间线走到赫卢梅茨——一场完全围绕“谁掌控摩拉维亚”打的仗——之前，值得先停下来，把11世纪波希米亚到底有几个权力中心这件事理清楚。",
    },
    summary: {
      en: "By the 11th and 12th centuries, Bohemia was nowhere near the 'Prague as the one obvious center' story it would later become. Even the power center itself kept moving: Bořivoj I first ruled from Levý Hradec, only shifting to Prague Castle in the 880s. In 1070, Vratislaus II moved his own base to Vyšehrad. Later still, under Soběslav I, the center of gravity shifted back to Prague Castle again. Even within 'Prague,' the Castle and Vyšehrad traded places as the real seat of power more than once.\n\nMoravia was a genuine second power center, not just a frontier province. The 1055 succession law itself split Moravia into appanages — Olomouc, Brno, Znojmo — handed out to younger sons, institutionally creating several regional power bases able to rival Prague directly. At the Battle of Chlumec in 1126, Otto II of Olomouc could credibly challenge the entire duchy's succession, and even talk the Holy Roman Emperor into invading on his behalf, precisely because this structure existed.\n\nCentral Bohemia itself was dotted with local strongholds of real weight: Kouřim (a rival power base back in Boleslaus I's day), Litoměřice and Žatec (the Vršovci clan's traditional territory), and the ring of border fortresses Spytihněv built — Mělník, Libušín, Tetín, Boleslav. These local noble families and fortress towns held real autonomy and real military strength of their own.\n\nEven religious authority wasn't in Prague for a while: before 973, Bohemia's church affairs answered to the bishopric of Regensburg, outside the country entirely — Prague itself spent decades as a peripheral diocese answering to somewhere else.\n\nWhat finally turned Prague from 'one power center among several' into the unquestioned center came a full two centuries later, under Charles IV: the New Town, the university, and Prague's 1344 promotion to its own independent archbishopric — no longer subordinate to Mainz. That's the moment this scattered, multi-centered Bohemia finally consolidates into one city's story — a chapter still a long way down this timeline.",
      cz: "Ve 11. a 12. století neměly Čechy zdaleka k příběhu „Praha jako jednoznačné centrum“ tak blízko, jak by se dalo čekat z pozdějších dob. I samotné mocenské centrum se neustále stěhovalo: Bořivoj I. vládl nejdřív z Levého Hradce a na Pražský hrad se přesunul až v 80. letech 9. století. V roce 1070 přesunul Vratislav II. své vlastní sídlo na Vyšehrad. Ještě později, za Soběslava I., se těžiště moci vrátilo zpátky na Pražský hrad. I v rámci samotné „Prahy“ si hrad a Vyšehrad roli skutečného sídla moci vyměnily víckrát než jednou.\n\nMorava byla opravdovým druhým mocenským pólem, ne jen pohraniční provincií. Sám nástupnický zákon z roku 1055 rozdělil Moravu na úděly — Olomouc, Brno, Znojmo — přidělené mladším synům, čímž institucionálně vytvořil hned několik regionálních mocenských center schopných přímo konkurovat Praze. V bitvě u Chlumce roku 1126 mohl Ota II. Olomoucký věrohodně zpochybnit nástupnictví celého knížectví a dokonce přemluvit římského císaře, aby v jeho prospěch vtrhl do země, právě díky téhle struktuře.\n\nStřední Čechy samy byly poseté místními mocenskými centry se skutečnou váhou: Kouřim (soupeřící centrum moci ještě za Boleslava I.), Litoměřice a Žatec (tradiční území rodu Vršovců) a řetěz pohraničních hradů, které nechal postavit Spytihněv — Mělník, Libušín, Tetín, Boleslav. Tyto místní šlechtické rody a hradní města měly reálnou samostatnost i reálnou vojenskou sílu.\n\nAni církevní autorita nějakou dobu nebyla v Praze: před rokem 973 podléhaly české církevní záležitosti řezenskému biskupství, mimo zemi úplně — Praha sama strávila desetiletí jako okrajová diecéze odpovídající někam jinam.\n\nCo nakonec proměnilo Prahu z „jednoho centra mezi několika“ v nezpochybnitelné centrum, přišlo až o celá dvě staletí později, za Karla IV.: Nové Město, univerzita a povýšení Prahy v roce 1344 na vlastní samostatné arcibiskupství — už ne podřízené Mohuči. Přesně v tu chvíli se tahle roztříštěná, mnohostředisková Bohemia konečně slévá v příběh jednoho města — kapitola, která je na téhle časové ose ještě pěkně daleko.",
      zh: "11到12世纪的波希米亚，跟后来那个“布拉格一城独大”的印象差得远。就连权力中心本身，都一直在搬家：博日沃伊一世最早驻扎在莱维赫拉德茨，直到880年代才迁往布拉格城堡；1070年，弗拉季斯拉夫二世又把自己的驻地搬去了维谢赫拉德；再往后，到了索别斯拉夫一世时期，权力重心才又搬回布拉格城堡。哪怕只看“布拉格”内部，城堡和维谢赫拉德这两个据点，也不止一次互换过“真正权力中心”这个角色。\n\n摩拉维亚是名副其实的第二权力极，而不只是个边疆行政区。1055年那道继承法令本身，就把摩拉维亚拆成了奥洛穆茨、布尔诺、兹诺伊莫几块封地，分授给了诸子——制度上主动制造出了好几个能跟布拉格分庭抗礼的区域权力中心。1126年赫卢梅茨战役中，奥洛穆茨的奥托二世能够挑战整个公国的最高继承权，甚至说动神圣罗马帝国皇帝亲自出兵支持他，靠的正是这套格局。\n\n中波希米亚地区本身也散布着好几个分量不轻的地方势力：库日姆（博莱斯拉夫一世时代的对头据点）、利托梅日采与扎泰茨（维尔绍夫奇家族的传统领地），还有斯皮蒂赫涅夫修建的那一圈边境要塞——梅尔尼克、利布欣、泰廷、波列斯拉夫。这些地方贵族家族和要塞城镇，都拥有相当的自主权和军事实力。\n\n就连宗教权威，也一度不在布拉格：973年之前，波希米亚的教会事务归境外的雷根斯堡主教区管辖，布拉格本身长期只是个仰仗外部宗教权威鼻息的边缘辖区。\n\n真正让布拉格从“众多权力中心之一”变成毫无疑问的绝对核心，要等到整整两个世纪后的查理四世时代——新城规划、大学、1344年布拉格升格为独立大主教区、不再隶属美因茨——正是这些举措，最终终结了这种多中心并存的格局。这也是本时间线还要走很久，才会抵达的一章。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "",
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
    images: ["/history/chlumec.webp"],
    tone: "humorous",
    title: {
      en: "The Bohemian War of Succession",
      cz: "Válka o české nástupnictví",
      zh: "波希米亚王位继承战争",
    },
    hookLine: {
      en: "By 1126, Bohemia had one more succession fight left in it — and this was the one that actually mattered.",
      cz: "Do roku 1126 měly Čechy před sebou ještě jeden spor o nástupnictví — a byl to ten, na kterém skutečně záleželo.",
      zh: "到1126年，波希米亚还剩最后一场继承权之争——而这一次，真正有分量。",
    },
    summary: {
      en: "By 1125, the pattern this timeline just spent a whole chapter cataloguing was still running. When Duke Vladislaus I died that year, his brother Soběslav I claimed the succession — not Vladislaus's own son, the future king Vladislaus II, still a generation away. A rival cousin, Otto II of Olomouc, contested the claim, appealing to the same seniority principle from the opposite direction, and found a useful ally: Holy Roman Emperor Lothair III, freshly elected, owing Bohemia nothing, and until the year before simply Duke of Saxony — the same neighboring duchy whose rebellious nobles Bohemian troops had spent 1075 and 1080 helping the previous emperor put down. This time, Saxony was the one making trouble for Bohemia. According to one chronicler, Lothair took a substantial bribe from Otto before marching an invading army into Bohemia to install him instead — officially because Soběslav had never properly sought imperial confirmation of his claim.\n\nSoběslav met the threat with more than soldiers. According to legend, he'd dreamed that the lost banner of St. Adalbert lay hidden in the village of Vrbčany — and when his men searched a walled-up niche behind the church altar there, they found an old banner exactly where the dream had said. Soběslav had it mounted on the spear of St. Wenceslas himself and carried into battle, and chroniclers later swore Wenceslas rode with the Bohemian ranks that day, in white robes on a white horse.\n\nOn 18 February 1126, near the village of Chlumec, Soběslav sprang the trap: his forces ambushed Lothair's advance guard in a narrow mountain pass, then closed on the main imperial army with no room left to retreat. Otto was killed in the fighting; Lothair himself, along with several of his leading nobles, was taken prisoner.\n\nSoběslav released the emperor in exchange for formal investiture as duke — a face-saving technicality that let Lothair go home without admitting the obvious: Bohemia had just beaten the Holy Roman Empire on its own soil, and the bribe hadn't even worked.\n\nSoběslav commemorated the win by rebuilding and enlarging an existing rotunda on the summit of Říp — the same hill Czech legend already credited as the mythical resting place of the first Czechs to settle the land — one of the oldest monuments the country still has. It was, for once, a Bohemian ruler securing his position through outright victory rather than a borrowed crown or a lucky marriage, and it bought Soběslav an untroubled fifteen years on the throne.",
      cz: "V roce 1125 pořád běžel ten stejný vzorec, který tahle časová osa právě probrala v celé jedné kapitole. Když toho roku zemřel kníže Vladislav I., nárokoval si nástupnictví jeho bratr Soběslav I. — ne jeho vlastní syn, budoucí král Vladislav II., na kterého ještě čekala celá generace. Soupeřící bratranec, Ota II. Olomoucký, nárok napadl — odvolával se na tentýž seniorátní princip, jen z opačné strany — a našel si užitečného spojence: čerstvě zvoleného římského krále Lothara III., který Čechám nic nedlužil a ještě rok předtím byl prostě saským vévodou — téhož sousedního vévodství, jehož vzbouřené šlechtice čeští vojáci v letech 1075 a 1080 pomáhali dřívějšímu císaři potlačit. Tentokrát bylo Sasko tím, kdo dělal potíže Čechám. Podle jednoho kronikáře od Oty přijal značný úplatek, než vtáhl s vojskem do Čech, aby na trůn dosadil jeho místo Soběslava — oficiálně proto, že si Soběslav nikdy řádně nevyžádal císařské potvrzení svého nároku.\n\nSoběslav se hrozbě nepostavil jen s vojáky. Podle pověsti se mu zdálo, že ztracená korouhev svatého Vojtěcha leží ukrytá ve vsi Vrbčany — a když jeho muži prohledali zazděnou výklenku za tamním kostelním oltářem, skutečně tam našli starou korouhev, přesně tam, kde ji sen sliboval. Soběslav ji nechal upevnit na kopí samotného svatého Václava a nést do bitvy, a kronikáři později přísahali, že sám Václav toho dne jel v bílém rouchu na bílém koni po boku českých šiků.\n\n18. února 1126, poblíž vesnice Chlumec, Soběslav past sklapl: jeho oddíly přepadly Lotarův předvoj v úzkém horském průsmyku a poté sevřely hlavní císařské vojsko, kterému už nezbylo kam ustoupit. Ota v boji padl; samotný Lothar, spolu s několika svými předními velmoži, byl zajat.\n\nSoběslav propustil krále výměnou za formální investituru coby kníže — tvářnost zachraňující formalitu, díky které se Lothar mohl vrátit domů, aniž by musel přiznat to zjevné: Čechy právě porazily Svatou říši římskou na jejím vlastním území, a její vlastní úplatek k ničemu nebyl.\n\nSoběslav vítězství oslavil přestavbou a rozšířením už existující rotundy na vrcholu Řípu — téže hory, kterou česká pověst už dřív spojovala s legendárním místem odpočinku prvních Čechů, kteří tuto zemi osídlili — jedné z nejstarších dochovaných památek v zemi. Byl to, tentokrát výjimečně, český panovník, který si upevnil postavení skutečným vítězstvím, ne vypůjčenou korunou nebo šťastným sňatkem — a vykoupilo mu to patnáct klidných let na trůně.",
      zh: "1125年，本时间线刚刚用整整一节讲过的那个模式，依然在继续上演。这一年公爵弗拉迪斯拉夫一世去世，他的弟弟索别斯拉夫一世宣称继承权——并非他本人的儿子、日后的国王弗拉迪斯拉夫二世，后者还要再等一代人才轮到自己。竞争对手、堂兄弟奥洛穆茨的奥托二世对此提出异议——援引的还是同一条长者继承原则，只是从另一个方向解读——并找到了一位有用的盟友：刚刚当选、对波希米亚毫无亏欠的神圣罗马帝国皇帝洛泰尔三世——就在前一年，他还只是萨克森公爵，而这个邻近的公国，波希米亚军队在1075年和1080年可没少替上一任皇帝出力，帮着镇压过它境内叛乱的贵族。这一次，轮到萨克森来给波希米亚找麻烦了。据一位编年史家记载，他收了奥托一笔可观的贿赂，随后亲率大军入侵波希米亚，打算改立奥托——官方理由是索别斯拉夫从未正式向皇帝申请对其继承权的确认。\n\n索别斯拉夫应对这场威胁靠的不只是军队。传说他梦见圣阿达尔伯特那面失落已久的旗帜，藏在弗尔布恰尼村；他的部下搜查了当地教堂祭坛后面一处被封死的壁龛，果然在梦里指明的地方找到了一面古旧的旗帜。索别斯拉夫把它绑在圣瓦茨拉夫本人的长矛上，带上了战场——后来的编年史家信誓旦旦地说，那一天，瓦茨拉夫本人身披白袍、骑着白马，就在波希米亚的军阵之中并肩作战。\n\n1126年2月18日，在赫卢梅茨村附近，索别斯拉夫的陷阱收网：他的部队在一处狭窄的山口伏击了洛泰尔的先锋部队，随后合围了已经无路可退的帝国主力。奥托二世战死沙场；洛泰尔本人与几位重臣一同被俘。\n\n索别斯拉夫最终释放了这位皇帝，条件是换取一份正式的册封仪式——这是一个给足了皇帝面子的形式，让洛泰尔得以体面回国，而不必承认那个明摆着的事实：波希米亚刚刚在自己的国土上，打赢了神圣罗马帝国，而对方那笔贿赂，压根没起作用。\n\n索别斯拉夫用重建并扩建日普山顶上一座既有的圆形教堂来纪念这场胜利——而这座山，早已被捷克传说认定为最早定居这片土地的捷克人的传说安息之地——如今仍是这个国家现存最古老的古迹之一。这一次，难得地，是一位波希米亚统治者靠着堂堂正正的军事胜利、而非借来的王冠或幸运的联姻，稳固了自己的地位——也换来了他此后十五年安稳的统治。",
    },
    relatedLandmarks: [
      {
        slug: "chlumec",
        relation: {
          en: "The village and pass this whole battle is named for — a strategic gap between Saxony and Bohemia that saw fighting across eight centuries, from Přemyslid-era skirmishes to this decisive 1126 victory to Napoleon's bloodiest Bohemian battle here in 1813.",
          cz: "Vesnice a průsmyk, po kterých je celá tahle bitva pojmenovaná — strategická brána mezi Saskem a Čechami, kde se bojovalo napříč osmi stoletími, od přemyslovských potyček přes toto rozhodující vítězství z roku 1126 až po Napoleonovu nejkrvavější bitvu na českém území, svedenou tady v roce 1813.",
          zh: "整场战役得名的那座村庄和山口——萨克森与波希米亚之间的战略要冲，八个世纪里在此断断续续打了好几仗：从普热美斯尔王朝时期的零星冲突，到这场1126年的决定性胜利，再到1813年拿破仑在波希米亚境内打得最血腥的一战，都发生在这里。",
        },
      },
      {
        slug: "rotunda-svateho-jiri-rip",
        relation: {
          en: "Soběslav had this rotunda enlarged right after Chlumec to commemorate the win — on a hill Czech legend already considered sacred ground long before any battle was fought here.",
          cz: "Soběslav nechal tuto rotundu rozšířit hned po Chlumci na oslavu vítězství — na kopci, který česká pověst považovala za posvátnou půdu dávno předtím, než se tu odehrála jakákoli bitva.",
          zh: "索别斯拉夫在赫卢梅茨战役后立刻下令扩建了这座圆形教堂，以纪念这场胜利——而这座山，早在这里发生任何战役之前，就已经被捷克传说视为圣地。",
        },
      },
      {
        slug: "old-royal-palace",
        relation: {
          en: "Soběslav had this Romanesque palace built around 1135, not long after Chlumec — its foundations still survive underground and are among the oldest surviving structures on this whole site, laid down by a duke who'd just proven he could actually hold onto power.",
          cz: "Soběslav si nechal kolem roku 1135, nedlouho po Chlumci, postavit tento románský palác — jeho základy se dochovaly v podzemí dodnes a patří k nejstarším dochovaným stavbám na celém tomto místě, položeným knížetem, který právě dokázal, že si moc dokáže i skutečně udržet.",
          zh: "索别斯拉夫在赫卢梅茨战役后不久、约1135年，下令建造了这座罗曼式宫殿——它的地基至今仍保存在地下，是整个城堡遗址现存最古老的建筑之一，由一位刚刚证明自己真能守住权力的公爵下令建造。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Battle_of_Chlumec_(1126)",
  },
  {
    slug: "what-was-moravia-1127",
    era: "bohemian-duchy",
    startYear: 1127,
    cardType: "background",
    year: {
      en: "1055–1247",
      cz: "1055–1247",
      zh: "1055年－1247年",
    },
    tone: "serious",
    title: {
      en: "What Was Moravia, Exactly?",
      cz: "Co vlastně byla Morava?",
      zh: "摩拉维亚，到底算什么？",
    },
    hookLine: {
      en: "Chlumec just showed a Moravian prince challenging the entire Bohemian succession — which only makes sense once you know what Moravia's relationship to Bohemia actually was.",
      cz: "Chlumec právě ukázal moravského knížete, jak zpochybňuje celé české nástupnictví — což dává smysl, až když víte, jaký byl skutečný vztah Moravy k Čechám.",
      zh: "赫卢梅茨战役里，一位摩拉维亚亲王挑战了整个波希米亚的继承权——这件事要读懂，得先弄明白摩拉维亚跟波希米亚到底是什么关系。",
    },
    summary: {
      en: "Moravia's status during this period doesn't fit a simple 'independent' or 'just a province' binary — it shifted through several distinct stages, and the 1126 Battle of Chlumec sits right in the middle of the first one.\n\nFrom 1055 on, Moravia was carved into appanages — Olomouc, Brno, Znojmo — and handed to younger sons of the same Přemyslid family that held the Bohemian throne in Prague. These weren't foreign rulers seizing territory; they were cousins, formally subordinate to the Duke of Bohemia's overlordship but running their own armies and their own territory with real autonomy. That's exactly the structure that made Chlumec possible: Otto II of Olomouc could credibly challenge the whole duchy's succession precisely because he was already a fully qualified member of the same ruling family, not an outsider.\n\nThen, briefly, Moravia came close to real independence. In 1174, the Moravian branch of the Přemyslids died out except for one line, and Prince Conrad Otto of Znojmo unified all three appanages under himself. In 1182, Holy Roman Emperor Frederick Barbarossa — looking for a way to weaken the Bohemian duke — formally elevated Moravia into its own margraviate, answering directly to the emperor rather than to Prague. For a few years, Moravia genuinely was a separate state. The two Přemyslid branches fought it out directly at the Battle of Loděnice in 1185 — a brutal, all-day fight commanded on the Bohemian side by Duke Frederick's own younger brother, the future King Přemysl Otakar I.\n\nThe two sides made peace at Knín after the battle: the Margrave of Moravia recognized the Bohemian duke's overlordship again, and Moravia settled into a permanent middle status it would keep for the rest of its existence — not a fully separate country, but not simply 'part of Bohemia' either. It stayed a margraviate in its own right, one of the Lands of the Bohemian Crown, all the way until 1918. Starting in 1247, King Wenceslas I began a custom of granting the title 'Margrave of Moravia' specifically to the Bohemian heir apparent — his son, the future Otakar II, was the first — turning Moravia into something close to a training post for the next king.\n\nIf there's a term for this, it's 'appanage' — land and authority granted to a cadet branch of the ruling family, technically subordinate to the main line but functionally running its own show. Moravia's specific case just kept oscillating between how subordinate and how independent that actually meant, for centuries.",
      cz: "Postavení Moravy v tomto období nejde vměstnat do jednoduché dvojice „nezávislá\" versus „jen provincie\" — procházelo několika zřetelnými fázemi, a bitva u Chlumce v roce 1126 stojí přímo uprostřed té první.\n\nOd roku 1055 byla Morava rozdělena na úděly — Olomouc, Brno, Znojmo — a svěřena mladším synům téhož přemyslovského rodu, který seděl na českém trůně v Praze. Nešlo o cizí vládce zabírající území; byli to bratranci, formálně podřízení svrchovanosti českého knížete, ale se skutečnou samostatností spravující vlastní vojsko a vlastní území. Přesně tahle struktura umožnila Chlumec: Ota II. Olomoucký mohl věrohodně zpochybnit nástupnictví celého knížectví právě proto, že byl už plnohodnotným členem téže vládnoucí rodiny, ne cizincem.\n\nPak se Morava na chvíli přiblížila skutečné nezávislosti. V roce 1174 vymřela moravská větev Přemyslovců až na jednu linii a kníže Konrád Ota Znojemský sjednotil všechny tři úděly pod sebou. V roce 1182 římský císař Fridrich Barbarossa — hledající způsob, jak oslabit českého knížete — formálně povýšil Moravu na samostatné markrabství, odpovídající přímo císaři, ne Praze. Na pár let byla Morava opravdu samostatným státem. Obě přemyslovské větve si to vyřídily přímo v bitvě u Loděnice roku 1185 — brutálním, celodenním boji, na české straně velenému vlastním mladším bratrem knížete Bedřicha, budoucím králem Přemyslem Otakarem I.\n\nObě strany po bitvě uzavřely mír v Kníně: moravský markrabě znovu uznal svrchovanost českého knížete, a Morava se usadila v trvalém mezistavu, který si udržela po zbytek své existence — ne úplně samostatná země, ale ani prostě „součást Čech\". Zůstala vlastním markrabstvím, jednou ze zemí Koruny české, až do roku 1918. Od roku 1247 začal král Václav I. se zvykem udělovat titul „moravský markrabě\" přímo českému následníku trůnu — jako první ho dostal jeho syn, budoucí Otakar II. — čímž se Morava proměnila v cosi na způsob výcvikového místa pro budoucího krále.\n\nPokud pro tohle existuje pojem, je to „údělné knížectví\" — území a moc svěřené vedlejší větvi vládnoucí rodiny, formálně podřízené hlavní linii, ale fakticky spravující si vlastní záležitosti. U Moravy se jen po staletí měnilo, co přesně ta podřízenost a ta samostatnost v praxi znamenaly.",
      zh: "摩拉维亚在这段时期的地位，没法简单套进“完全独立”或“只是行省”这种二元框架——它经历了好几个明显不同的阶段，而1126年的赫卢梅茨战役，正好落在第一个阶段的正中间。\n\n从1055年起，摩拉维亚被拆成几块封地——奥洛穆茨、布尔诺、兹诺伊莫——分给了坐镇布拉格的那支波希米亚普热美斯尔家族里的诸子。这些人不是外来夺权者，而是自家堂兄弟：名义上从属于波希米亚公爵的宗主权，但实际统辖自己的军队和地盘，享有相当的自主权。赫卢梅茨战役之所以能打起来，靠的正是这套结构——奥洛穆茨的奥托二世能够挑战整个公国的继承权，正是因为他本来就是这个统治家族里够格的一员，而不是外人。\n\n接下来，摩拉维亚一度差点真正独立。1174年，摩拉维亚这支普热美斯尔旁支只剩下一条血脉，兹诺伊莫的康拉德·奥托亲王统一了全部三块封地。1182年，神圣罗马皇帝腓特烈·巴巴罗萨——正想办法削弱波希米亚公爵的势力——正式把摩拉维亚提升为独立的藩侯国，直接效忠皇帝本人，不再从属于布拉格。有那么几年，摩拉维亚确实成了一个独立的国家。两支普热美斯尔家族的矛盾最终在1185年的洛杰尼采战役中正面爆发——一场血腥的、打了一整天的战役，波希米亚一方的指挥官，正是当时在位的弗雷德里克公爵的亲弟弟、日后的国王普热米斯尔·奥托卡一世。\n\n战后，双方在克宁议和：摩拉维亚藩侯重新承认了波希米亚公爵的宗主权，摩拉维亚从此定型在一种长期的“中间状态”——既不是完全独立的国家，也不只是“波希米亚的一部分”。它继续以独立藩侯国的身份存在，作为“波希米亚王冠领地”之一，一直延续到1918年。从1247年起，波希米亚国王瓦茨拉夫一世开始了一项惯例——把“摩拉维亚藩侯”这个头衔专门授予波希米亚的王储：第一位获此头衔的，是他的儿子、日后的奥托卡二世——摩拉维亚由此某种程度上变成了未来国王的“历练封地”。\n\n如果要打个比方，这有点像中国历史上的“宗藩分封”：同一个家族的旁支拿到一块地盘、自组军政班底，名义上尊奉宗主、实际上相当自治——只是波希米亚和摩拉维亚之间，这条“从属”与“自治”的分界线，此后几百年里一直在来回摆动，并不是一成不变的。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Margraviate_of_Moravia",
  },
  {
    slug: "vladislaus-ii-crusade-1147",
    era: "bohemian-duchy",
    startYear: 1147,
    year: {
      en: "1147–1148",
      cz: "1147–1148",
      zh: "1147年－1148年",
    },
    images: ["/history/vladislaus-ii-crusade-1147.webp"],
    tone: "humorous",
    title: {
      en: "The Crusade He Didn't Finish",
      cz: "Křížová výprava, kterou nedokončil",
      zh: "他没走完的十字军之路",
    },
    hookLine: {
      en: "In 1147, Duke Vladislaus II went on crusade — less out of conviction than calculation, and, true to form, he wouldn't even see the whole thing through himself.",
      cz: "V roce 1147 se kníže Vladislav II. vydal na křížovou výpravu — méně z přesvědčení, více z vypočítavosti, a jak už to u něj bývalo zvykem, sám ji nakonec ani nedotáhl do konce.",
      zh: "1147年，弗拉迪斯拉夫二世公爵踏上了十字军之路——与其说是出于信仰，不如说是出于算计，而且一如既往，他自己连这趟东征都没走完。",
    },
    summary: {
      en: "Vladislaus II — nephew of Soběslav I, whose victory at Chlumec he inherited the benefits of — became duke in 1140. That wasn't exactly the plan Soběslav had spent his final years arranging: in 1138, he'd gotten the newly elected King Conrad III to formally confirm the succession for his own son at the Diet of Bamberg — a son who, confusingly, was also named Vladislav, sharing a name with the cousin who'd eventually get the job instead. It didn't settle anything. After Soběslav died in February 1140, that same confirmation got reaffirmed all over again, and the Bohemian nobility still elected the nephew, with Conrad III's backing. The son didn't just step aside quietly, either — Vladislaus II had to beat back his cousin's rival claim through continued fighting, with his marriage to Gertrude of Babenberg, Conrad III's own half-sister, helping cement the emperor's support before the succession was truly settled.\n\nBy the mid-1140s, with the throne secured, Vladislaus had spent years leaning on Bishop Henry Zdík of Olomouc as a political partner, using the alliance to outmaneuver rival branches of his own Přemyslid family. When Pope Eugene III called for a new crusade to the Holy Land in 1145 and Conrad III of Germany — Vladislaus's own overlord, and by now his brother-in-law as well — signed on, Zdík saw an opening: crusading, he argued, could do double duty as a show of piety and a way to rally domestic support around the duke. Vladislaus organized a Bohemian contingent and set out with Conrad's army in May 1147, alongside his brother Henry and his cousin Spytihněv.\n\nThe march did not go smoothly. That September, tension between the Germans and their Byzantine hosts boiled over into the Battle of Constantinople, a real clash fought right outside Emperor Manuel I's own capital, before the crusaders were hastily ferried across the Bosporus into Asia Minor. Vladislaus himself went no further: citing logistics and a reassessment of the campaign, he turned back at Constantinople, having technically discharged his feudal obligation to Conrad and banked the political credit at home either way. His retinue kept going without him — and paid for it. In the fighting around Dorylaeum that October, part of the broader collapse of Conrad's army in Anatolia, Vladislaus's own marshal, Jurik, was killed, and his chancellor, Bartholomew, was taken prisoner. The duke got the credit; his household got the casualty list.\n\nVladislaus made his own way home along a much older road — through Kiev and Kraków, a trade route linking Bohemia to the Black Sea that had already been in use for two or three centuries, running roughly parallel to the Danube-Balkans road that carried Western pilgrims and crusaders toward Constantinople in the other direction. Back home, his brother Děpolt I had been governing Bohemia as regent in his absence, and governing firmly: when the young Soběslav — son of the elder Soběslav I, the same cousin the nobility had passed over for the throne back in 1140 — tried to seize the moment, Děpolt shut it down before it went anywhere. Between a dead marshal, a captured chancellor, and a coup attempt back home, crusading by proxy turned out to be the safer half of the plan — for the duke, anyway. Everyone he brought with him got the real war.",
      cz: "Vladislav II. — synovec Soběslava I., jehož vítězství u Chlumce po něm zdědil výhody — se stal knížetem v roce 1140. Nebyl to tak úplně ten plán, který si Soběslav poslední léta svého života pečlivě chystal: v roce 1138 si na nově zvoleném králi Konrádu III. na sněmu v Bamberku vymohl formální potvrzení nástupnictví pro vlastního syna — syna, který se matoucím způsobem jmenoval stejně jako bratranec, jenž nakonec místo něj usedl na trůn: Vladislav. Nic to nevyřešilo. Po Soběslavově smrti v únoru 1140 bylo totéž potvrzení znovu stvrzeno — a čeští velmoži přesto zvolili synovce, s podporou Konráda III. Syn se ale tiše nestáhl: Vladislav II. musel bratrancův soupeřící nárok srazit pokračujícími boji, přičemž jeho sňatek s Gertrudou Babenberskou, vlastní nevlastní sestrou Konráda III., pomohl utužit císařovu podporu, než bylo nástupnictví doopravdy uzavřeno.\n\nV polovině 40. let 12. století, s trůnem už zajištěným, se Vladislav léta opíral o olomouckého biskupa Jindřicha Zdíka jako o politického spojence, s jehož pomocí přehrával soupeřící větve vlastní přemyslovské rodiny. Když papež Evžen III. v roce 1145 vyhlásil novou křížovou výpravu do Svaté země a k výpravě se připojil Vladislavův vlastní lenní pán, německý král Konrád III. — teď už i jeho švagr —, uviděl v tom Zdík příležitost: účast na výpravě podle něj mohla posloužit dvěma věcem najednou — jako projev zbožnosti a jako způsob, jak kolem knížete stmelit domácí podporu. Vladislav sestavil český oddíl a v květnu 1147 vyrazil s Konrádovým vojskem, po boku bratra Jindřicha a bratrance Spytihněva.\n\nTažení neproběhlo hladce. Toho září vyvrcholilo napětí mezi Němci a jejich byzantskými hostiteli bitvou u Konstantinopole, opravdovým střetem přímo před hlavním městem císaře Manuela I., než byli křižáci narychlo přepraveni přes Bospor do Malé Asie. Sám Vladislav dál nešel: s odkazem na logistiku a přehodnocení tažení se vrátil od Konstantinopole zpět, čímž technicky splnil svou lenní povinnost vůči Konrádovi a zároveň si doma zajistil politický zisk. Jeho doprovod pokračoval dál bez něj — a zaplatil za to. V bojích kolem Dorylaea toho října, součásti širšího zhroucení Konrádova vojska v Malé Asii, padl Vladislavův vlastní maršálek Jiljí a jeho kancléř Bartoloměj upadl do zajetí. Kníže si odnesl zásluhy; jeho družina odnesla ztráty.\n\nVladislav se domů vydal po mnohem starší cestě — přes Kyjev a Krakov, obchodní trase spojující Čechy s Černým mořem, která byla v provozu už dvě nebo tři století a vedla zhruba souběžně s dunajsko-balkánskou cestou, jež naopak vedla západní poutníky a křižáky ke Konstantinopoli. Doma zatím Čechy v jeho nepřítomnosti spravoval jako regent bratr Děpolt I. — a spravoval je pevnou rukou: když se mladý Soběslav, syn staršího Soběslava I., týž bratranec, kterého šlechta v roce 1140 přeskočila při volbě knížete, pokusil využít knížecí nepřítomnosti, Děpolt to zarazil dřív, než se to k něčemu rozvinulo. Mezi mrtvým maršálkem, zajatým kancléřem a pokusem o převrat doma vyšlo najevo, že křižáctví na dálku bylo pro knížete tou bezpečnější polovinou plánu — přinejmenším pro něj samotného. Skutečnou válku si odnesl každý, koho si s sebou vzal.",
      zh: "弗拉迪斯拉夫二世——索别斯拉夫一世的侄子，承袭了叔叔在赫卢梅茨战役中赢得的政治红利——于1140年成为公爵。但这并不是索别斯拉夫本人临终前精心安排的结果：他生前还在担心自己的安排能不能算数。1138年，他让新当选的康拉德三世在班贝格议会上正式确认了自己儿子（巧合的是也叫弗拉迪斯拉夫，跟后来继位的这位堂兄弟同名）的继承权。可情况并没因此定案——1140年2月索别斯拉夫去世后，这份批准居然还被又确认了一次，但最终坐上公爵之位的，还是他的侄子。儿子那边也没就此乖乖让步：弗拉迪斯拉夫二世靠着持续的军事冲突压下了堂兄弟的挑战，他与康拉德三世异母妹妹格特鲁德·冯·巴本贝格的联姻，也帮着稳住了皇帝这边的支持，继承权才算真正尘埃落定。\n\n12世纪40年代中期，公爵之位已经坐稳，弗拉迪斯拉夫这些年一直和奥洛穆茨主教亨利·兹迪克合作，靠着这层政治同盟来压制普热美斯尔家族内部的对手分支。1145年，教皇尤金三世号召发起新一轮十字军东征，而弗拉迪斯拉夫的宗主、德意志国王康拉德三世——如今也是他的姻亲——也随即响应：兹迪克从中看到了机会，他劝说弗拉迪斯拉夫，参与东征可以一举两得，既是虔诚的表态，也是一次凝聚国内支持、巩固公爵地位的政治操作。1147年5月，弗拉迪斯拉夫组织了一支波希米亚部队，与弟弟亨利、堂兄斯皮蒂赫涅夫一同随康拉德的大军出发。\n\n这趟行军并不顺利。同年9月，德意志人和拜占庭东道主之间的紧张关系彻底爆发，双方在皇帝曼努埃尔一世的都城君士坦丁堡城下真刀真枪打了一仗——史称“1147年君士坦丁堡之战”，之后十字军才匆匆渡过博斯普鲁斯海峡进入小亚细亚。弗拉迪斯拉夫本人没有再往前走：他以后勤压力和战略重新评估为由，就此在君士坦丁堡止步返程——名义上，他已经完成了对康拉德的封建义务，国内的政治红利也已稳稳收入囊中。他的随从却没有跟他一起回去，继续跟着大军前进——而代价随之而来。同年10月，在多利来姆一带的战事中——那场德意志十字军在小亚细亚全面崩溃的一部分——弗拉迪斯拉夫麾下的元帅尤里克战死，他的大法官巴塞洛缪则被俘虏。荣耀归了公爵，代价却由他的随从来扛。\n\n弗拉迪斯拉夫自己走的，是一条古老得多的路——经基辅、克拉科夫返回波希米亚，这是一条连接波希米亚与黑海、已经通行了两三个世纪的传统商路，大致与另一条经多瑙河、穿越巴尔干、通往君士坦丁堡的道路平行——后者正是西方朝圣者和十字军惯常前往圣地的路线。与此同时，波希米亚国内由他的弟弟德波尔德一世代为监国，而且手腕强硬：当年轻的索别斯拉夫——老索别斯拉夫一世之子，也就是1140年被贵族绕过、没能继位的那位堂兄弟——试图趁公爵不在国内夺权时，德波尔德在事情闹大之前就将其压了下去。元帅战死、大法官被俘，家里还差点被人夺了权——算下来，这趟“假手于人”的十字军，对公爵本人而言反倒是相对安全的那一半——真正上了战场的，是他带去的那些人。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Second_Crusade",
  },
  {
    // Background-knowledge card. startYear is deliberately non-integer
    // (1147.5) purely as a sort anchor to slot this right after
    // vladislaus-ii-crusade-1147 and before vladislaus-ii-second-crown-1158
    // — background cards don't claim a sidebar year slot (filtered out in
    // HistorySidebar/HistoryPage) so this never renders anywhere.
    slug: "what-were-the-crusades-1147",
    era: "bohemian-duchy",
    startYear: 1147.5,
    cardType: "background",
    year: {
      en: "1095–1291",
      cz: "1095–1291",
      zh: "1095年－1291年",
    },
    tone: "humorous",
    title: {
      en: "What, Exactly, Were the Crusades?",
      cz: "Co vlastně byly křížové výpravy?",
      zh: "十字军东征，到底是怎么回事？",
    },
    hookLine: {
      en: "Vladislaus just crusaded halfway and sent his household the rest of the way — which raises the obvious question of what a 'crusade' actually was, and why medieval Europe kept launching them for two centuries.",
      cz: "Vladislav se právě vydal na křížovou výpravu jen do půli cesty a zbytek poslal svou družinu — což vyvolává zjevnou otázku, co „křížová výprava\" vlastně byla a proč je středověká Evropa dvě stě let pořád znovu vyhlašovala.",
      zh: "弗拉迪斯拉夫刚刚只走了半程十字军之路，剩下的路让自己的随从替他走完——这理应引出一个明摆着的问题：“十字军东征”到底是怎么回事，中世纪欧洲又为什么一连折腾了两百年。",
    },
    summary: {
      en: "Pope Urban II kicked the whole thing off in 1095, at the Council of Clermont in France, with a speech calling on Western Christians to march east and reclaim Jerusalem and the Holy Land from Muslim rule. The pitch came with a genuinely revolutionary sales pitch attached: anyone who took up the cross and fought would receive a plenary indulgence, wiping out the temporal punishment for all their confessed sins. For a medieval Christian who took the afterlife seriously, that was an extraordinary offer — a battlefield that doubled as a shortcut through purgatory.\n\nThe immediate trigger was a request from the other direction. Byzantine Emperor Alexios I Komnenos, watching the Seljuk Turks overrun most of Anatolia in the decades after their crushing 1071 victory at Manzikert, had asked Urban for a modest favor: some Western mercenaries to help shore up his eastern frontier. What he got instead was tens of thousands of independent nobles, knights, and commoners marching east under their own banners, with their own agendas, largely uninterested in taking orders from Constantinople. Alexios had asked for a plumber and gotten an entire construction crew that immediately started renovating rooms he hadn't opened yet.\n\nThat First Crusade (1096–1099) was brutal and chaotic, but it worked, at least by its own violent standard: the crusaders captured Jerusalem in 1099, massacring much of its population in the process, and carved out a cluster of Western-ruled statelets along the eastern Mediterranean coast — the Kingdom of Jerusalem, the County of Edessa, the Principality of Antioch, the County of Tripoli — collectively known as the Crusader States, a patchwork of European rule stranded deep in hostile territory and permanently dependent on reinforcements from home.\n\nThose reinforcements are exactly what brought Vladislaus II into the story. When Edessa, the northernmost and most exposed of the Crusader States, fell to the Muslim ruler Zengi in 1144, Bernard of Clairvaux and Pope Eugene III called for a Second Crusade (1147–1149) to shore things up — the first crusade led by reigning kings, Conrad III of Germany and Louis VII of France, rather than assorted nobles. It was, by any measure, a disaster: Conrad's army collapsed in Anatolia before it even reached the Holy Land, as this timeline just covered, and the combined Western force went on to fail spectacularly at besieging Damascus in 1148 — a siege abandoned after four days. It was the first time a crusade had visibly, undeniably failed, and it wouldn't be the last.\n\nAltogether, historians conventionally count about eight numbered Crusades to the Holy Land, running until the fall of Acre in 1291 finally wiped out the last mainland Crusader territory. But 'crusade' didn't stay confined to the Holy Land for long — the Church stamped the same label, complete with the same indulgences, on wars against pagans in the Baltic, heretics in southern France, and even political rivals in Italy. In that sense, the Church did to the word 'crusade' roughly what the Holy Roman Empire did to the word 'Roman': borrowed a name with real prestige attached and applied it to whatever war needed extra legitimacy that decade.\n\nFor the rulers who signed up — Vladislaus II very much included — genuine faith was rarely the whole story. It came bundled with feudal obligation, a shot at glory and papal goodwill, and, as this timeline's own version just demonstrated, a useful excuse to consolidate power back home. The people who actually paid crusading's steepest price, then and generally, were the soldiers who did the marching and dying — not the kings who did the calling.",
      cz: "Papež Urban II. celou věc odstartoval v roce 1095 na koncilu v Clermontu ve Francii proslovem, který vyzýval západní křesťany, aby vytáhli na východ a vydobyli Jeruzalém a Svatou zemi zpět z muslimské nadvlády. K nabídce se pojila skutečně revoluční pobídka: kdokoli vzal na sebe kříž a bojoval, měl získat plnomocné odpustky, jež mazaly časný trest za všechny vyznané hříchy. Pro středověkého křesťana, který bral posmrtný život vážně, to byla mimořádná nabídka — bojiště, které zároveň fungovalo jako zkratka skrz očistec.\n\nBezprostředním podnětem byla žádost z opačné strany. Byzantský císař Alexios I. Komnenos, sledující, jak seldžučtí Turci po svém drtivém vítězství u Mantzikertu roku 1071 v následujících desetiletích ovládli většinu Malé Asie, požádal Urbana o skromnou laskavost: pár západních žoldnéřů na posílení východní hranice. Místo toho dostal desetitisíce nezávislých šlechticů, rytířů a prostých lidí, táhnoucích na východ pod vlastními korouhvemi a s vlastními zájmy, kteří se od Konstantinopole nechtěli nechat příliš poroučet. Alexios si objednal instalatéra a dostal celou stavební četu, která se rovnou pustila do přestavby pokojů, o které vůbec nepožádal.\n\nPrvní křížová výprava (1096–1099) byla brutální a chaotická, ale podle svého vlastního, násilného měřítka fungovala: křižáci roku 1099 dobyli Jeruzalém, přičemž při tom povraždili velkou část jeho obyvatel, a podél východního pobřeží Středozemního moře vyřezali shluk západních panství — Jeruzalémské království, hrabství Edessa, knížectví Antiochie, hrabství Tripolis — souhrnně zvaných křižácké státy, mozaiku evropské vlády uvízlou hluboko v nepřátelském území a natrvalo závislou na posilách z domova.\n\nPřesně tyhle posily přivedly do příběhu Vladislava II. Když roku 1144 padla Edessa, nejsevernější a nejzranitelnější z křižáckých států, do rukou muslimského vládce Zengího, vyzvali Bernard z Clairvaux a papež Evžen III. k druhé křížové výpravě (1147–1149) — první, kterou vedli přímo vládnoucí králové, německý Konrád III. a francouzský Ludvík VII., ne jen sebraní šlechtici. Podle jakéhokoli měřítka to byla katastrofa: Konrádovo vojsko se zhroutilo v Malé Asii ještě dřív, než dorazilo do Svaté země, jak tahle časová osa právě popsala, a spojené západní síly pak efektně selhaly při obléhání Damašku roku 1148 — obléhání, které vzdaly po čtyřech dnech. Byla to poprvé, co křížová výprava viditelně a nepopiratelně selhala, a nebylo to naposledy.\n\nHistorikové obvykle napočítají celkem osm číslovaných křížových výprav do Svaté země, táhnoucích se až do pádu Akkonu roku 1291, který definitivně vymazal poslední pevninské křižácké území. Ale slovo „křížová výprava\" dlouho nezůstalo omezené jen na Svatou zemi — církev stejným označením, se stejnými odpustky, opatřila i války proti pohanům v Pobaltí, kacířům na jihu Francie a dokonce politickým soupeřům v Itálii. V tomhle smyslu udělala církev se slovem „křížová výprava\" zhruba to samé, co Svatá říše římská se slovem „římská\": vypůjčila si jméno se skutečnou prestiží a nalepila ho na jakoukoli válku, která zrovna potřebovala víc legitimity.\n\nU vládců, kteří se přihlásili — Vladislava II. rozhodně nevyjímaje — jen zřídkakdy šlo výhradně o víru. Přidávala se k ní lenní povinnost, šance na slávu a papežskou přízeň a, jak právě předvedla tahle časová osa ve své vlastní verzi, i užitečná záminka k upevnění moci doma. Ti, kdo za křížové výpravy platili nejvyšší cenu, tehdy i obecně, byli vojáci, kteří táhli a umírali — ne králové, kteří k tomu vyzývali.",
      zh: "教皇乌尔班二世在1095年法国克莱蒙宗教会议上发表演说，正式拉开了这一切的序幕：他号召西方基督徒东征，从穆斯林手中夺回耶路撒冷和圣地。这个号召还附带了一项真正意义上颠覆性的许诺——任何背上十字、参与作战的人，都能获得全大赦，抵消他们已忏悔罪行应受的现世惩罚。对一个真心相信来世的中世纪基督徒来说，这是个极具诱惑力的条件——一片战场，同时也是一条穿越炼狱的捷径。\n\n直接的导火索，其实来自对面阵营的一次求助。拜占庭皇帝阿莱克修斯一世眼看塞尔柱突厥人自1071年曼齐刻尔特战役大获全胜以来，几十年间不断蚕食小亚细亚，便向乌尔班提出了一个不大的请求：派些西方雇佣兵来，帮忙巩固一下东部边境。结果他等来的却是几万名各自为战的贵族、骑士和平民，打着自己的旗号、怀着自己的盘算浩浩荡荡东进，压根不太把君士坦丁堡的号令当回事。阿莱克修斯本想找个水管工来修修管子，结果来了一整支施工队，二话不说就开始装修他根本没让他们碰的房间。\n\n第一次十字军东征（1096年－1099年）过程血腥混乱，但按它自己那套残酷的标准来说，确实达成了目的：十字军1099年攻陷耶路撒冷，屠杀了城中大批居民，并沿着地中海东岸切割出了一片西方统治的小邦国——耶路撒冷王国、埃德萨伯国、安条克公国、的黎波里伯国——统称“十字军国家”，一块深陷敌境、永远指望本土增援的欧式统治拼图。\n\n而正是这份“增援”，把弗拉迪斯拉夫二世也拉进了这段故事。1144年，十字军国家里位置最靠北、也最暴露在外的埃德萨伯国，落入了穆斯林统治者赞吉之手，圣伯尔纳和教皇尤金三世随即号召发起第二次十字军东征（1147年－1149年）——这是第一次由在位国王亲自领军的十字军，德意志的康拉德三世和法兰西的路易七世，而非零散贵族凑起来的队伍。可无论怎么看，这都是一场灾难：正如这条时间线刚讲过的，康拉德的军队还没抵达圣地，就已经在小亚细亚土崩瓦解；东西方联军随后又在1148年围攻大马士革一役上惨遭失败——围城仅仅四天就被迫放弃。这是十字军史上第一次如此明显、无可争辩的失败，而且远不是最后一次。\n\n历史学家通常把前往圣地的十字军东征算作八次，一路延续到1291年阿卡陷落，彻底抹去了十字军在陆上最后的据点。可“十字军”这个名号并没有长期局限于圣地——教会很快把同一个标签、同一套大赦承诺，套用到了波罗的海对异教徒的战争、法国南部对异端的战争，甚至意大利境内针对政治对手的战争上。从这个角度看，教会对“十字军”这个词干的事，跟神圣罗马帝国对“罗马”这个词干的事其实差不多：借来一个自带光环的名号，哪场战争当年需要多一点合法性，就往哪场战争身上一贴。\n\n对那些报名参加的统治者来说——弗拉迪斯拉夫二世当然也不例外——信仰很少是全部的理由。跟信仰捆绑在一起的，往往还有封建义务、博取荣耀和教皇好感的机会，以及——正如这条时间线自己这版故事刚刚展示的——巩固国内权力的一个好借口。而真正为十字军东征付出最惨重代价的，无论是这一次还是别的哪一次，从来都是那些真正远征、真正战死的士兵——不是那些振臂一呼、发号施令的国王。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Crusades",
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
    images: ["/history/vladislaus-ii-second-crown-1158.webp"],
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
      en: "Once his position as duke was secure, Vladislaus spent nearly two decades chasing the same prize his uncle Vratislaus had briefly held seventy years earlier. He got it in 1158, when Holy Roman Emperor Frederick I crowned him king in gratitude for Bohemian troops backing his campaigns in Lombardy. Frederick is better known today by his nickname, Barbarossa — Italian for 'red beard,' reportedly coined by the famously unruly Italians he spent his reign trying to govern. It's the same nickname either way, not two different men, in case that's ever confusing; players of a certain strategy game might also recognize him as Civilization VI's German leader since the game's 2016 launch, bonus combat strength against city-states included. The name got borrowed once more, far more gravely, eight centuries later: Nazi Germany's 1941 invasion of the Soviet Union was originally codenamed Operation Fritz, until Hitler personally renamed it Operation Barbarossa, invoking the old German legend that the emperor never really died — just slept beneath the Kyffhäuser mountains, waiting to wake and restore Germany to greatness.\n\nVladislaus wore his own, far less mythologized crown for fifteen years before abdicating in 1173 in favour of his own son — at which point, exactly like his uncle before him, the title reverted to plain duke for whoever came next. His reign left a deeper mark in stone than in politics: alongside Strahov and Plasy, his years on the throne saw a wave of new Premonstratensian and Cistercian monasteries founded across Bohemia. Vladislaus himself retired to the Thuringian estates of his second wife, Judith of Thuringia, after abdicating, and died there in January 1174 — buried first at Meissen Cathedral, before his remains were eventually brought home to rest at Strahov, the monastery he'd founded three decades earlier. Twice now, Bohemia had tried on a crown that fit for exactly one lifetime and no longer.",
      cz: "Jakmile měl své postavení knížete zajištěné, Vladislav téměř dvě desetiletí honil stejnou trofej, kterou jeho strýc Vratislav krátce držel o sedmdesát let dřív. Dočkal se jí roku 1158, kdy ho římský císař Fridrich I. korunoval králem jako vděk za české oddíly podporující jeho tažení v Lombardii. Fridrich je dnes známější pod svou přezdívkou Barbarossa — italsky „ryšavý vous\", kterou mu prý vymysleli právě ti pověstně neposlušní Italové, jimž se celou vládu snažil podřídit. Je to pořád jedna a tatáž přezdívka, ne dva různí muži, kdyby to bylo někdy matoucí; hráči jisté strategické hry ho možná poznají i jako německého vůdce v Civilization VI, kde je od vydání hry v roce 2016 — bonus za útok na městské státy nevyjímaje. Jméno si o osm století později vypůjčil ještě jednou, mnohem těžším způsobem: nacistické Německo v roce 1941 pojmenovalo invazi do Sovětského svazu původně jako operaci Fritz, než ji Hitler osobně přejmenoval na operaci Barbarossa — s odkazem na starou německou pověst, že císař ve skutečnosti nezemřel, jen usnul pod horou Kyffhäuser a čeká, až se probudí a vrátí Německu jeho slávu.\n\nVladislav nosil svou vlastní, o poznání méně opředenou korunu patnáct let, než v roce 1173 abdikoval ve prospěch vlastního syna — a přesně jako u jeho strýce před ním se titul vrátil zpátky ke knížecímu, ať už po něm nastoupil kdokoli. Jeho vláda zanechala hlubší stopu v kamení než v politice: vedle Strahova a Plasů se za jeho let na trůně po Čechách rozšířila celá vlna nových premonstrátských a cisterciáckých klášterů. Sám Vladislav se po abdikaci odebral na duryňská panství své druhé manželky, Judity Durynské, a zemřel tam v lednu 1174 — pohřben nejprve v míšeňské katedrále, než byly jeho ostatky nakonec převezeny domů na Strahov, do kláštera, který sám před třiceti lety založil. Čechy si tak podruhé vyzkoušely korunu, která padla přesně na jeden život a ani o den déle.",
      zh: "弗拉迪斯拉夫坐稳公爵之位后，又花了将近二十年追寻他叔叔弗拉季斯拉夫七十年前曾短暂拥有过的那份荣耀。1158年，他终于如愿：神圣罗马帝国皇帝腓特烈一世，为答谢波希米亚军队支援他在伦巴第的战事，加冕他为国王。腓特烈一世今天更广为人知的称呼是他的绰号“巴巴罗萨”——意大利语“红胡子”的音译，据说正是他试图统治的那些出了名桀骜不驯的意大利臣民给他起的。“红胡子”和“巴巴罗萨”其实是同一个绰号，一个意译、一个音译，指的是同一个人，不是两个人，以免读者混淆；对某款策略游戏有印象的玩家，可能还认得他——自2016年发售起，他就一直是《文明6》里德意志文明的领袖，攻击城邦还能拿到额外加成。这个名字后来还被借用过一次，而且这次的分量重得多：八百年后，纳粹德国1941年入侵苏联的行动，最初代号叫“弗里茨行动”，后来希特勒亲自下令改名为“巴巴罗萨行动”——借用的正是德国民间流传的那个传说：这位皇帝并没有真正死去，只是沉睡在基夫霍伊泽山中，等待有朝一日苏醒，带领德国重返辉煌。\n\n弗拉迪斯拉夫戴着这顶远没那么多传说加身的王冠十五年，直到1173年主动退位、传给自己的儿子——而就像他叔叔当年一样，这个头衔随即又降回了公爵，无论接下来是谁继位。他这一朝，在石头上留下的印记，比在政治上留下的更深远：除了斯特拉霍夫和普拉西，他在位期间波希米亚各地还兴建了一整批新的普雷蒙特雷会和熙笃会修道院。退位后，弗拉迪斯拉夫本人回到了第二任妻子、图林根的朱迪思家族的领地，1174年1月在那里去世——先安葬于迈森大教堂，遗骨后来才被迁回斯特拉霍夫，回到他三十年前亲手创建的那座修道院。波希米亚由此第二次尝到了一顶只合身一辈子、绝不多留一天的王冠。",
    },
    relatedLandmarks: [
      {
        slug: "strahov-monastery",
        relation: {
          en: "Vladislaus founded this Premonstratensian monastery in 1143 — the grandest building project of his reign, and the mother house of a whole monastic network, spinning off daughter foundations at Litomyšl (1145) and Hradisko (1150) within just a few years. He died far from home in Thuringia in 1174 and was buried first at Meissen Cathedral — but his remains eventually made their way back here, to rest permanently in the monastery he'd founded three decades before.",
          cz: "Vladislav založil tento premonstrátský klášter v roce 1143 — nejvýstavnější stavební počin svého panování, a zároveň mateřský dům celé klášterní sítě, z níž během pár let vzešly dceřiné kláštery v Litomyšli (1145) a na Hradisku (1150). Zemřel daleko od domova, v Duryňsku, roku 1174, a byl nejprve pohřben v míšeňské katedrále — jeho ostatky ale nakonec našly cestu zpátky sem, aby natrvalo spočinuly v klášteře, který sám před třiceti lety založil.",
          zh: "弗拉迪斯拉夫1143年创建了这座普雷蒙特雷修道院——他在位期间布拉格最宏伟的建筑工程，也是一整套修道院网络的“母院”，短短几年内就分支出了利托米什尔（1145年）和赫拉迪斯科（1150年）两座子修道院。1174年，他客死于远在图林根的异乡，最初安葬在迈森大教堂——但他的遗骨最终还是被迁回了这里，永远安息在这座他三十年前亲手创建的修道院中。",
        },
      },
      {
        slug: "klaster-plasy",
        relation: {
          en: "A year after Strahov, Vladislaus founded this Cistercian monastery too — a different order entirely, but the same pattern of a duke using new monastic foundations to shore up his legitimacy and piety at once.",
          cz: "Rok po Strahovu založil Vladislav i tento cisterciácký klášter — úplně jiný řád, ale stejný vzorec: kníže si novými klášterními fundacemi budoval zbožnost i legitimitu zároveň.",
          zh: "在斯特拉霍夫修道院之后一年，弗拉迪斯拉夫又创建了这座熙笃会修道院——完全不同的修会，却是同一个套路：公爵靠着不断新建修道院，同时给自己攒虔诚人设和政治合法性。",
        },
      },
      {
        slug: "sedlecky-klaster",
        relation: {
          en: "Not Vladislaus's own project — this one predates his reign's monastery-building spree by a few years and was founded by a Bohemian nobleman instead — but it's the actual first Cistercian house in Bohemia, arriving two years before his own Plasy foundation.",
          cz: "Tohle nebyl Vladislavův vlastní projekt — vznikl o pár let dřív, než se pustil do zakládání klášterů, a založil ho místo toho český šlechtic — ale je to skutečně první cisterciácký dům v Čechách, o dva roky starší než jeho vlastní Plasy.",
          zh: "这个不是弗拉迪斯拉夫本人的项目——它比他开始大兴修道院早了几年，出资的是一位波希米亚贵族——但它确确实实是波希米亚第一座熙笃会修道院，比他自己那座普拉西修道院还早两年。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vladislaus_II,_Duke_and_King_of_Bohemia",
  },
  {
    // Deliberate cross-chapter foreshadowing (2026-08): the Judith Bridge is
    // Prague's first stone crossing, destroyed in the 1342 flood and rebuilt
    // on nearly the same site as Charles Bridge under Charles IV. That
    // future event — expected in Era 3 (kingdom-golden-age), not yet
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
    images: ["/history/judith-bridge-1170.webp"],
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
      en: "Sometime around 1170, Vladislaus had Prague's first stone bridge built across the Vltava, linking the Old Town to the settlements below Prague Castle — one of the earliest stone bridges anywhere in Central Europe, named the Judith Bridge after his second wife, Judith of Thuringia. Before it, crossing the river meant a ford or a ferry; after it, Prague had a permanent stone spine holding its two halves together, over a century and a half before anyone had heard of Charles IV.\n\nThe bridge stood for roughly 170 years, until a catastrophic flood in 1342 swept most of it away — and its replacement, commissioned a few years later by Charles IV on almost the same site, is the one every visitor photographs today. Before there was a Charles Bridge, in other words, there was this one, and Charles Bridge exists more or less because this one didn't survive.",
      cz: "Někdy kolem roku 1170 nechal Vladislav postavit první kamenný most v Praze přes Vltavu, spojující Staré Město s osadami pod Pražským hradem — jeden z nejstarších kamenných mostů kdekoli ve střední Evropě, pojmenovaný Juditin most po jeho druhé manželce, Juditě Durynské. Před ním se řeka překonávala brodem nebo převozem; po něm měla Praha trvalou kamennou páteř držící obě její poloviny pohromadě, a to víc než století a půl předtím, než kdokoli slyšel o Karlu IV.\n\nMost stál zhruba sto sedmdesát let, dokud ho ničivá povodeň v roce 1342 z velké části nestrhla — a jeho náhradu, kterou o pár let později nechal na téměř stejném místě postavit Karel IV., dnes fotí každý návštěvník. Jinými slovy: než byl Karlův most, byl tenhle — a Karlův most vlastně existuje hlavně proto, že tenhle nepřežil.",
      zh: "大约在1170年前后，弗拉迪斯拉夫下令在伏尔塔瓦河上建起了布拉格第一座石桥，将老城与布拉格城堡脚下的聚落连接起来——这是中欧现存最早的石桥之一，以他的第二任妻子、图林根的尤蒂特命名，即“尤蒂特桥”。在它建成之前，过河只能靠涉水或摆渡；有了它之后，布拉格终于有了一条永久性的石造脊梁，把这座城市的两半连在了一起——比任何人听说过查理四世都要早上一个半世纪还多。\n\n这座桥矗立了大约一百七十年，直到1342年一场毁灭性的洪水将其大部分冲毁——几年后，查理四世下令几乎在同一位置建起了它的替代者，也就是今天每一位游客都会拍照留念的那座桥。换句话说：在有查理大桥之前，先有的是这座桥——而查理大桥之所以存在，很大程度上正是因为这座桥没能撑下来。",
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
    slug: "quarter-century-of-dukes-1173",
    era: "bohemian-duchy",
    startYear: 1173,
    year: {
      en: "1173–1198",
      cz: "1173–1198",
      zh: "1173年－1198年",
    },
    images: [
      "/history/quarter-century-of-dukes-1173-frederick.webp",
      "/history/quarter-century-of-dukes-1173-otakar.webp",
    ],
    tone: "humorous",
    title: {
      en: "The Most Calculating Přemyslid",
      cz: "Nejvypočítavější z Přemyslovců",
      zh: "最擅长权衡的那个普热美斯尔人",
    },
    hookLine: {
      en: "If this succession chaos looks familiar, it should — Bohemia is about to run through five more rulers in twenty-five years, same as it did the last time.",
      cz: "Pokud ti tenhle nástupnický chaos připadá povědomý, není divu — Čechy se chystají za pětadvacet let vystřídat dalších pět panovníků, stejně jako minule.",
      zh: "如果这场继承混乱看着眼熟，那很正常——波希米亚又要在二十五年里换掉五位统治者，跟上次一模一样。",
    },
    summary: {
      en: "If this feels familiar, that's the idea: Bohemia is about to run almost the same play it ran between 1092 and 1125, just with a new cast. When Vladislaus II abdicated in 1173, he arranged the succession for Frederick, his son by his first wife Gertrude — without bothering to clear it with Emperor Frederick Barbarossa first. That omission alone was enough: an imperial diet formally deposed both Vladislaus and Frederick within the year. Next came Soběslav II, remembered as 'the Peasant Prince' for his sympathy toward the common farmers, though he had far less patience for anyone with actual power: he dodged Barbarossa's summons to Italy and picked a fight with Austria's Babenberg dukes that got an imperial relative killed.\n\nFrederick's comeback, starting in 1178 with Austrian and Moravian allies, didn't go smoothly either: on 23 January 1179, Soběslav's army routed him outright at the village of Loděnice, southwest of Prague, and Frederick was forced to flee. Four days later, on 27 January, he regrouped and won a decisive battle outside Prague's own walls, finally driving Soběslav from power for good — and this time held on until his death in 1189. His second reign wasn't calm either: in 1174, Conrad II Otto of Znojmo reunited all of Moravia's scattered appanages under himself, and in 1182 Emperor Frederick Barbarossa — looking for a way to weaken the Bohemian duke — formally elevated Moravia into its own independent margraviate, answering directly to the emperor instead of Prague. The two rival Přemyslid branches collided head-on in 1185 at a different village that just happened to share the same name — this one down in Moravia — the Bohemian side commanded by Frederick's own much younger brother, years before that brother got a turn on the throne himself. Conrad Otto inherited the Bohemian job next in 1189, followed by Wenceslas II, who lasted three months before being deposed by his own predecessor's rival: a half-brother about to become the main character of this entire era.\n\nThat half-brother was Otakar I — son of Vladislaus II and his second wife, Judith of Thuringia, the same queen this timeline just watched get a bridge named after her — and his own rise wasn't any smoother. He seized the duchy the moment Wenceslas fell in 1192, then lost it barely a year later for conspiring with German princes against the very Hohenstaufen dynasty he'd eventually need on his side. Bohemia spent the next four years, extraordinarily, under the rule of the Bishop of Prague — installed by imperial decree after neither rival claimant could produce the payment the emperor wanted. Otakar's real second chance, in 1197, came at his own family's expense: he pushed his younger brother, Vladislaus III, out of Bohemia entirely, compensating him with permanent, hereditary rule over Moravia instead. It wasn't a hostile takeover by this family's usual standards — the brothers negotiated the handover and stayed close for the rest of their lives — but it was still one more Přemyslid claiming the throne by removing a relative from it.\n\nWhoever finally held on this time was about to do something none of the previous five managed.",
      cz: "Pokud ti tohle připadá povědomé, tak právě proto: Čechy se chystají zopakovat skoro tu samou hru, kterou hrály mezi lety 1092 a 1125, jen s novým obsazením. Když Vladislav II. v roce 1173 abdikoval, zařídil nástupnictví pro Fridricha, svého syna z prvního manželství s Gertrudou — aniž by se obtěžoval to napřed projednat s císařem Fridrichem Barbarossou. Samotné tohle opomenutí stačilo: říšský sněm do roka formálně sesadil Vladislava i Fridricha. Dalším na řadě byl Soběslav II., v paměti zapsaný jako „kníže sedláků\" pro svou náklonnost k prostým rolníkům, i když s kýmkoli, kdo měl skutečnou moc, měl trpělivosti podstatně méně: vyhýbal se Barbarossovu předvolání do Itálie a vyvolal spor s rakouskými Babenberky, který stál život jednoho z císařových příbuzných.\n\nFridrichův návrat, který začal v roce 1178 s rakouskou a moravskou pomocí, taky neproběhl hladce: 23. ledna 1179 ho Soběslavovo vojsko rovnou rozdrtilo u vesnice Loděnice jihozápadně od Prahy, a Fridrich musel uprchnout. O čtyři dny později, 27. ledna, se přeskupil a vybojoval rozhodující vítězství přímo pod pražskými hradbami, čímž Soběslava definitivně zbavil moci — a tentokrát se udržel až do své smrti v roce 1189. Ani jeho druhá vláda nebyla klidná: v roce 1174 Konrád Ota Znojemský znovu sjednotil všechny roztříštěné moravské úděly pod sebou, a v roce 1182 císař Fridrich Barbarossa — hledající způsob, jak oslabit českého knížete — formálně povýšil Moravu na samostatné markrabství, odpovídající přímo císaři místo Praze. Obě soupeřící přemyslovské větve se přímo srazily v roce 1185 u jiné vesnice, která náhodou nesla stejné jméno — tahle ležela dole na Moravě — na české straně velel Fridrichův vlastní, o mnoho mladší bratr, ještě léta předtím, než se on sám dostal na trůn. Konrád Ota po Fridrichovi úřad zdědil v roce 1189, následován Václavem II., který vydržel tři měsíce, než ho sesadil soupeř jeho vlastního předchůdce: nevlastní bratr, který se za chvíli stane hlavní postavou celé téhle éry.\n\nTím nevlastním bratrem byl Otakar I. — syn Vladislava II. a jeho druhé manželky Judity Durynské, téže královny, které tahle časová osa právě sledovala pojmenovat po ní most — a jeho vlastní vzestup nebyl o nic hladší. Knížectví se zmocnil ve chvíli, kdy padl Václav, v roce 1192, a sotva o rok později o něj zase přišel — za spiknutí s německými knížaty proti štaufské dynastii, kterou by nakonec potřeboval na své straně. Čechy pak neobvykle další čtyři roky spravoval pražský biskup — dosazený císařským nařízením poté, co ani jeden ze soupeřících uchazečů nedokázal zaplatit, co po nich císař žádal. Otakarova skutečná druhá šance, v roce 1197, přišla na úkor vlastní rodiny: přinutil svého mladšího bratra Vladislava III., aby se Čech úplně vzdal, výměnou za trvalou, dědičnou vládu nad Moravou. Podle standardů téhle rodiny to nebyl násilný převrat — bratři si předání moci vyjednali a zůstali si blízcí až do konce života — ale pořád to byl další přemyslovec, který se dostal k trůnu tím, že z něj odstranil příbuzného.\n\nKdokoli tentokrát nakonec udrží trůn, chystá se udělat něco, co se nepovedlo žádnému z předchozích pěti.",
      zh: "如果这一幕让你有种似曾相识的感觉，那就是故意的：波希米亚又要把1092年到1125年那出戏几乎原样重演一遍，只是换了一批演员。1173年，弗拉迪斯拉夫二世宣布退位，把继承人定为他与第一任妻子格特鲁德所生的儿子弗雷德里克——却压根没先跟皇帝腓特烈·巴巴罗萨打招呼商量这件事。光是这个“没请示”，就足以把皇帝惹恼：帝国议会不到一年，就把弗拉迪斯拉夫二世和弗雷德里克父子俩一起正式废黜了。接下来轮到索别斯拉夫二世，史书上称他“农民王子”，因为他同情普通农民——可对任何真正握有权力的人，他的耐心就少得多：他躲开了巴巴罗萨征意大利的征召令，还跟奥地利的巴本贝格家族结了梁子，闹出了一位皇室近亲丧命的事故。\n\n弗雷德里克1178年靠着奥地利和摩拉维亚的援手杀了回来，可这次复位同样不顺：1179年1月23日，索别斯拉夫的军队在布拉格西南方的洛杰尼采村把他彻底打垮，弗雷德里克被迫仓皇撤退。四天后，1月27日，他重整旗鼓，在布拉格城墙外打赢了一场决定性的胜仗，彻底把索别斯拉夫赶下了台——这一次，他一直坐到1189年去世为止。他的第二次在位同样不太平：1174年，兹诺伊莫的康拉德·奥托重新统一了摩拉维亚原本分散的几块封地；1182年，皇帝腓特烈·巴巴罗萨——正想办法削弱波希米亚公爵的势力——正式把摩拉维亚提升为独立藩侯国，直接效忠皇帝本人，不再从属于布拉格。两支互相竞争的普热美斯尔家族分支，最终在1185年正面碰撞——地点是另一座碰巧同名的村庄，这座在摩拉维亚境内——波希米亚一方的指挥官，正是弗雷德里克那位年纪小得多的弟弟——这时候离他自己登上王位，还有好几年呢。1189年，康拉德·奥托接下了公爵之位。再往后是瓦茨拉夫二世，可他只坐了三个月，就被人赶下了台——动手的正是刚才提到的那位异母兄弟，很快就会成为这整个时代的主角。\n\n这位异母兄弟就是奥托卡一世——弗拉迪斯拉夫二世与第二任妻子、图林根的尤蒂特之子，正是这条时间线刚刚讲过、那座以她之名命名石桥的王后——他自己的崛起同样一波三折。1192年瓦茨拉夫倒台的那一刻，他就夺过了公国，可不到一年又因为参与德意志诸侯反霍亨斯陶芬王朝的密谋而丢了位子——而这个王朝，他日后偏偏还得靠拢才能真正坐稳王位。接下来极不寻常的四年里，波希米亚居然是由布拉格主教统治的——两位竞争对手都拿不出皇帝索要的那笔钱，皇帝索性下令让主教兼任公爵。奥托卡真正的第二次机会，出现在1197年，而且是以牺牲自家人为代价换来的：他逼迫弟弟弗拉迪斯拉夫三世彻底放弃波希米亚，作为交换，让他永久世袭统治摩拉维亚。按这个家族一贯的标准，这算不上一场血腥夺权——兄弟俩协商完成了交接，此后余生也一直关系密切——但归根结底，这仍然是又一位普热美斯尔家的人，靠把亲戚挤下台才登上了王位。\n\n这一次，最后能站稳脚跟的人，会做一件之前五位统治者谁都没做成的事。",
    },
    relatedLandmarks: [
      {
        slug: "lodenice-beroun",
        relation: {
          en: "This is where Frederick's forces were routed on 23 January 1179, four days before he turned it around outside Prague — the one battle from this whole chaotic quarter-century with an actual place-name attached.",
          cz: "Právě tady bylo 23. ledna 1179 rozprášeno Fridrichovo vojsko, čtyři dny předtím, než to u Prahy obrátil ve svůj prospěch — jediná bitva z celého tohohle chaotického čtvrtstoletí, ke které se váže konkrétní místní jméno.",
          zh: "1179年1月23日，弗雷德里克的军队正是在这里被彻底击溃，四天后他才在布拉格城外扳回一局——这整整二十五年的混乱期里，唯一一场能对应上具体地名的战役。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/List_of_Bohemian_monarchs",
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
    images: ["/history/otakar-hereditary-kingdom-1198.webp"],
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
      en: "This is the same bloodline this era has been tracking for three generations now, finally reaching the part of the story it was building toward. What Otakar was about to do, none of the five rulers before him had managed.\n\nPřemysl Otakar I got his royal title the same way Vratislaus and Vladislaus had — as a reward for backing the right side in someone else's war, this time picking Philip of Swabia's claim to the German throne in 1198.\n\nWhat made this one different only became clear over the following years: Otto IV — Philip's own rival for the German throne — recognised Otakar's Bohemian title too in 1204, so did Pope Innocent III, and by the time Frederick II issued the Golden Bull of Sicily in 1212, the crown wasn't a personal favour anymore — it was made explicitly hereditary, binding on every future ruler of Bohemia. No one ever handed it back. The Duchy of Bohemia that had spent three centuries answering to Great Moravia, then Regensburg, then a rotating cast of emperors who lent out royal titles like library books, became the Kingdom of Bohemia and simply stayed that way.",
      cz: "Je to přesně ta krev, kterou tahle éra sleduje už tři generace, a právě teď konečně dochází k té části příběhu, ke které celou dobu směřovala. To, co se Otakar chystal udělat, se nepovedlo žádnému z pěti panovníků před ním.\n\nPřemysl Otakar I. získal královský titul stejnou cestou jako předtím Vratislav a Vladislav — jako odměnu za podporu té správné strany v cizí válce, tentokrát tím, že se v roce 1198 postavil za nárok Filipa Švábského na německý trůn.\n\nCo bylo na tomhle případě jiné, se ukázalo až v následujících letech: Ota IV. — Filipův vlastní soupeř o německý trůn — Otakarův český titul v roce 1204 uznal také, stejně jako papež Inocenc III., a když v roce 1212 vydal Fridrich II. Zlatou bulu sicilskou, koruna už nebyla osobní laskavostí — byla výslovně prohlášena za dědičnou, závaznou pro každého budoucího panovníka Čech. Nikdo ji už nikdy nevrátil. České knížectví, které tři století odpovídalo nejdřív Velké Moravě, pak Řeznu, pak celé řadě císařů, kteří si královské tituly půjčovali jako knihy z knihovny, se stalo Českým královstvím — a prostě jím zůstalo.",
      zh: "这正是这个时代已经追踪了三代人的同一条血脉，如今终于走到了这个故事一直在铺垫的这个结局。奥托卡接下来要做的这件事，之前那五位统治者，谁都没能做成。\n\n普热米斯尔·奥托卡一世获得国王头衔的方式，跟弗拉季斯拉夫和弗拉迪斯拉夫如出一辙——都是靠在别人的战争里站对了队而换来的奖赏，这一次，他在1198年选择支持施瓦本的腓力争夺德意志王位。\n\n这一次真正不同之处，要到接下来的几年里才显现出来：奥托四世——腓力争夺德意志王位的竞争对手——1204年也承认了奥托卡的波希米亚王位，教皇英诺森三世同样如此，而当腓特烈二世于1212年颁布《西西里金玺诏书》时，这顶王冠已经不再是一份个人的恩惠——它被明确宣布为世袭，对波希米亚此后每一位统治者都具有约束力。此后再也没有人把它收回去。这个曾三百年来先后依附于大摩拉维亚、雷根斯堡、以及一连串像图书馆借书一样把国王头衔借来借去的历代皇帝的波希米亚公国，就此变成了波希米亚王国——并且，就这样一直是王国了。",
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
      {
        slug: "narodni-archiv",
        relation: {
          en: "The original 1212 document itself — the Golden Bull of Sicily — now sits in a climate-controlled vault at the National Archives, rarely displayed and kept far from the palace it made permanent.",
          cz: "Samotný originál listiny z roku 1212 — Zlatá bula sicilská — dnes leží v klimatizovaném trezoru Národního archivu, jen zřídka vystavovaný a bezpečně daleko od paláce, který natrvalo zajistil.",
          zh: "1212年那份文件的真正原件——《西西里金玺诏书》——如今就保存在国家档案馆恒温恒湿的保险库里，极少公开展示，远离它曾经永久保住的那座王宫。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Ottokar_I_of_Bohemia",
  },
  // ─────────────────────────────────────────────────────────────────────
  // Era 3: kingdom-golden-age (1212–1378). First batch, 2026-08-21,
  // covering 1199–1253 (Otakar I's family maneuvering through Wenceslas
  // I's death). See project memory for the Era 3/Era 4 boundary decision
  // (Wenceslas IV's 1378–1419 reign belongs to Era 4, not this one).
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "otakar-i-family-purge-1199",
    era: "kingdom-golden-age",
    startYear: 1199,
    year: {
      en: "1199–1230",
      cz: "1199–1230",
      zh: "1199年－1230年",
    },
    images: ["/history/otakar-i-family-purge-1199.webp"],
    tone: "humorous",
    title: {
      en: "The Second Thing He Made Permanent",
      cz: "Druhá věc, kterou udělal natrvalo",
      zh: "他做的第二件“永久”的事",
    },
    hookLine: {
      en: "Otakar I had just spent his whole reign making sure Bohemia's crown could never be taken back. The next thing he made permanent was considerably more personal.",
      cz: "Otakar I. právě strávil celou svou vládu tím, že zajistil, aby se česká koruna už nikdy nedala vzít zpátky. Další věc, kterou udělal natrvalo, byla podstatně osobnější.",
      zh: "奥托卡一世刚刚用整个统治生涯，确保了波希米亚的王冠再也不会被收回去。他接下来要把“永久”这两个字用在的下一件事，可就私人多了。",
    },
    summary: {
      en: "In 1199, freshly styling himself duke (still years before the Golden Bull made it official), Otakar divorced his first wife, Adelaide of Meissen, on grounds of consanguinity — the two were distant cousins, a technicality convenient enough when a marriage stops being useful. He remarried within the year, to Constance of Hungary. Adelaide refused to go quietly: she spent the next decade fighting the annulment through the papal courts, and didn't definitively lose until 1210.\n\nThe real complication wasn't Adelaide — it was her son, Vratislav, Otakar's own firstborn. (Yes, another Vratislav; this family has now recycled the name often enough that it's worth double-checking every time.) When Constance produced a son of her own in 1205 — the future Wenceslas I — Otakar spent the following decade quietly working to make sure Vratislav would never sit on the throne he himself had just made hereditary. It came to a head around 1215–1217: a related falling-out with the Děpoltici, descendants of Duke Vladislaus II's own capable regent brother Děpolt I, ended with that branch of the family driven out, clearing the way. On 8 June 1216, a general assembly of Bohemian nobles elected Wenceslas king outright; on 26 July, Emperor Frederick II formally granted Bohemia to him as an imperial fief, making it stick. Vratislav lived on for years afterward, still with in-laws willing to back him, but never got anywhere near the crown.\n\nOtakar I died on 15 December 1230, in his mid-to-late seventies, and was buried at St. Vitus Cathedral. The succession he'd spent two decades rigging held without a hitch — Wenceslas I simply became king, no drama required, which for this family counted as a genuine achievement.",
      cz: "V roce 1199, ještě coby čerstvě titulovaný kníže (roky předtím, než to Zlatá bula sicilská učinila oficiálním), se Otakar rozvedl se svou první manželkou Adlétou Míšeňskou z důvodu příbuzenství — byli vzdálení bratranci, technikálie dost pohodlná ve chvíli, kdy manželství přestane být užitečné. Do roka se oženil znovu, s Konstancií Uherskou. Adléta se nehodlala smířit potichu: dalších deset let bojovala proti anulaci u papežských soudů a definitivně prohrála až v roce 1210.\n\nSkutečnou komplikací nebyla Adléta — byl jím její syn Vratislav, Otakarův vlastní prvorozený. (Ano, další Vratislav; tahle rodina už tohle jméno recyklovala natolik často, že se pokaždé vyplatí dvakrát zkontrolovat, o koho jde.) Když Konstancie roku 1205 porodila vlastního syna — budoucího Václava I. — strávil Otakar následující desetiletí tichou prací na tom, aby Vratislav nikdy neusedl na trůn, který sám právě učinil dědičným. Vyvrcholilo to kolem let 1215–1217: související roztržka s Děpoltici, potomky schopného regenta a bratra knížete Vladislava II., Děpolta I., skončila vyhnáním této rodové větve a uvolněním cesty. 8. června 1216 zvolilo obecné shromáždění českých velmožů Václava přímo králem; 26. července mu císař Fridrich II. formálně udělil Čechy jako říšské léno, čímž to zpečetil. Vratislav žil ještě léta poté, stále s tchány ochotnými ho podpořit, ale ke koruně se už nikdy ani nepřiblížil.\n\nOtakar I. zemřel 15. prosince 1230, v pokročilých sedmdesátkách, a byl pohřben ve svatovítské katedrále. Nástupnictví, které dvě desetiletí pečlivě chystal, proběhlo bez zaškobrtnutí — Václav I. se prostě stal králem, bez jakéhokoli dramatu, což se u téhle rodiny počítalo za opravdový úspěch.",
      zh: "1199年，还只是刚刚自称公爵的时候（离《金玺诏书》正式确立王位还有好几年），奥托卡以“血缘过近”为由，跟第一任妻子阿德莱德·冯·梅森离了婚——两人是远房表亲，这个说辞在婚姻不再有用的时候，正好方便得很。不到一年，他就迎娶了匈牙利的康斯坦丝。阿德莱德可不打算就这么算了：接下来整整十年，她都在教廷法庭上为这桩婚姻的效力据理力争，直到1210年才彻底败诉。\n\n真正的麻烦不是阿德莱德，而是她的儿子弗拉季斯拉夫——奥托卡自己的长子。（没错，又一个弗拉季斯拉夫；这个家族用这个名字用得实在太频繁，每次出现都得留个心眼确认到底是哪一位。）1205年，康斯坦丝也生下了自己的儿子——也就是日后的瓦茨拉夫一世——奥托卡此后花了将近十年，悄悄铺路，确保弗拉季斯拉夫永远坐不上这顶他自己刚刚才变成世袭的王冠。这件事在1215-1217年间迎来了收尾：一场跟“德波尔德家族”（弗拉迪斯拉夫二世那位能干的摄政弟弟德波尔德一世的后代）的相关冲突，以这支旁系被逐出而告终，扫清了道路。1216年6月8日，波希米亚贵族大会直接选举瓦茨拉夫为王；同年7月26日，皇帝腓特烈二世正式将波希米亚册封给他作为帝国封地，让这一切板上钉钉。弗拉季斯拉夫此后又活了许多年，身后依然有姻亲愿意支持他，却始终没能再靠近王位一步。\n\n奥托卡一世1230年12月15日去世，享年七十好几，安葬于圣维特大教堂。他花了整整二十年精心设计的继承安排，最终顺顺当当地兑现——瓦茨拉夫一世就这么平静地当上了国王，没有任何戏剧性——对这个家族来说，这本身就已经算得上是一项真正的成就。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Ottokar_I_of_Bohemia",
  },
  {
    slug: "st-agnes-of-bohemia-1211",
    era: "kingdom-golden-age",
    startYear: 1211,
    year: {
      en: "1211–1282",
      cz: "1211–1282",
      zh: "1211年－1282年",
    },
    images: ["/history/st-agnes-of-bohemia-1211.webp"],
    tone: "humorous",
    title: {
      en: "The Bohemian Princess Who Refused the Emperor",
      cz: "Česká princezna, která odmítla císaře",
      zh: "拒绝皇帝求婚的那个波希米亚公主",
    },
    hookLine: {
      en: "Every royal marriage this timeline has covered so far was decided by someone other than the bride. Agnes of Bohemia was the exception — and she turned down an emperor to prove it.",
      cz: "Každý královský sňatek, který tahle časová osa dosud probrala, rozhodoval někdo jiný než nevěsta. Anežka Česká byla výjimkou — a na důkaz odmítla samotného císaře.",
      zh: "这条时间线迄今讲过的每一桩王室婚姻，拍板的都是新娘以外的其他人。阿格尼丝是唯一的例外——为了证明这一点，她连皇帝的求婚都拒绝了。",
    },
    summary: {
      en: "Every royal marriage this timeline has covered so far was arranged, cancelled, or renegotiated by someone other than the bride. Agnes of Bohemia — born 20 January 1211, the daughter of Otakar I and Constance of Hungary — is the one clear exception, and she spent much of her early life proving it, one collapsed engagement at a time.\n\nThe politics started before she could plausibly consent to any of it. At three, she was betrothed to a Silesian duke's son, who died before the marriage could happen. At nine, she was engaged to Henry, son of Holy Roman Emperor Frederick II himself — a match that dragged on for six years and still came to nothing. When a proposed marriage to King Henry III of England came up next, Frederick II personally vetoed it: he'd decided, by then, that he wanted her for himself.\n\nThat proposal — from a widowed emperor, arranged through her own brother Wenceslas I in 1235 — was, on paper, one of the most prestigious offers a medieval European woman could receive. Agnes turned it down anyway. She petitioned Pope Gregory IX directly, the pope interceded, and Frederick released her from the engagement. According to the chroniclers, when the emperor's anger eventually cooled, he put it more gracefully than most jilted suitors manage: 'If she had left me for a mortal man, I would have taken vengeance with the sword, but I cannot take offense, because in preference to me she has chosen the King of Heaven.'\n\nShe'd already been building her actual future before that refusal was even final. With her brother's backing, Agnes founded a monastery and convent complex in Prague in the early 1230s, attached to a hospital — a combined house of Franciscan friars and Poor Clare nuns, the first of its kind anywhere north of the Alps, and one of the earliest Gothic buildings in the city. She joined the community herself in 1234, and the following year became abbess of the Prague Clares — the same year she donated the Bohemian property of the Teutonic Knights to the hospital outright. Abbess or not, she kept doing the actual work herself: cooking for lepers and paupers and mending their clothes with her own hands, a habit she never gave up across the forty-seven years she held the post, right until her death. The complex doubled as more than a convent: it became the Přemyslid family's own necropolis and, on at least one occasion, a coronation site — and decades later, her own brother Wenceslas I would be buried there among the rest of the family. Separately, she maintained a correspondence with Clare of Assisi herself that lasted more than twenty years — written, on Clare's side, with real maternal warmth — even though the two women never once met in person.\n\nAgnes wasn't finished founding things. Sometime in the 1230s, she organized the lay staff running her hospital into a proper military order — the Knights of the Cross with the Red Star, dedicated specifically to nursing and hospital work, recognized by Pope Gregory IX in the process. It remains, to this day, the only military order ever founded on Bohemian soil, and it's still active now.\n\nShe wasn't formally declared a saint for a remarkably long time — Pope John Paul II finally canonized her on 12 November 1989. That date landed just five days before the Velvet Revolution began. Nobody planned that timing, but plenty of people afterward decided it meant something, and Agnes picked up a nickname for it: the saint who brought down communism. This timeline isn't finished with 1989 yet — we'll be back there, and so will she.",
      cz: "Každý královský sňatek, který tahle časová osa dosud probrala, domlouval, rušil nebo předělával někdo jiný než nevěsta. Anežka Česká — narozená 20. ledna 1211 jako dcera Otakara I. a Konstancie Uherské — je tím jasným výjimkou, a velkou část svého mládí strávila tím, že to dokazovala, jedno zmařené zasnoubení za druhým.\n\nPolitika kolem ní začala dřív, než mohla k čemukoli věrohodně dát souhlas. Ve třech letech byla zasnoubena se synem slezského vévody, který zemřel dřív, než se sňatek mohl uskutečnit. V devíti byla zasnoubena s Jindřichem, synem samotného císaře Fridricha II. — zásnuby se táhly šest let a stejně z nich nakonec nic nebylo. Když přišla na řadu nabídka sňatku s anglickým králem Jindřichem III., Fridrich II. ji osobně vetoval: mezitím se rozhodl, že ji chce pro sebe.\n\nTahle nabídka — od ovdovělého císaře, dojednaná v roce 1235 prostřednictvím jejího vlastního bratra Václava I. — byla na papíře jednou z nejprestižnějších nabídek, jakou mohla středověká Evropanka dostat. Anežka ji přesto odmítla. Obrátila se přímo na papeže Řehoře IX., papež zasáhl a Fridrich ji ze zasnoubení propustil. Podle kronikářů to císař, když jeho hněv nakonec vychladl, vyjádřil s větší grácií, než dokáže většina odmítnutých nápadníků: „Kdyby mě opustila pro smrtelníka, pomstil bych se mečem, ale nemohu se urazit, protože přede mnou dala přednost Králi nebeskému.\"\n\nSvou skutečnou budoucnost si přitom začala stavět ještě dřív, než bylo tohle odmítnutí definitivní. S bratrovou podporou založila Anežka na počátku 30. let 13. století v Praze klášterní komplex při špitálu — společný dům františkánských bratří a klarisek, první svého druhu kdekoli severně od Alp, a jednu z nejstarších gotických staveb ve městě. Sama do komunity vstoupila v roce 1234 a rok nato se stala abatyší pražských klarisek — téhož roku, kdy věnovala špitálu bez výhrad české statky řádu německých rytířů. Abatyší nebo ne, dál dělala tu skutečnou práci sama: vařila malomocným a chudým a vlastníma rukama jim spravovala šaty, což nepřestala dělat po celých sedmačtyřicet let, co funkci zastávala, až do své smrti. Komplex byl víc než jen klášter: stal se přemyslovskou rodovou nekropolí a přinejmenším jednou i místem korunovace — a o desetiletí později tam bude pohřben i její vlastní bratr Václav I., spolu se zbytkem rodiny. Zvlášť si udržovala i korespondenci se samotnou Klárou z Assisi, trvající přes dvacet let — psanou z Klářiny strany se skutečně mateřskou vřelostí — ačkoli se ty dvě ženy nikdy osobně nesetkaly.\n\nAnežka nebyla se zakládáním u konce. Někdy ve 30. letech 13. století zorganizovala laické zaměstnance svého špitálu do řádného rytířského řádu — Křižovníků s červenou hvězdou, zaměřeného výslovně na ošetřovatelství a špitální práci, uznaného v tomto procesu papežem Řehořem IX. Zůstává dodnes jediným rytířským řádem, jaký kdy vznikl na české půdě, a stále funguje.\n\nZa svatou nebyla oficiálně prohlášena pozoruhodně dlouho — papež Jan Pavel II. ji nakonec svatořečil 12. listopadu 1989. To datum padlo pouhých pět dní před začátkem sametové revoluce. To načasování nikdo neplánoval, ale spousta lidí si po tom myslela, že něco znamená, a Anežka si za to vysloužila přezdívku: světice, která svrhla komunismus. Tahle časová osa s rokem 1989 ještě nekončí — vrátíme se k němu, a ona s námi.",
      zh: "这条时间线迄今讲过的每一桩王室婚姻，拍板、取消或重新谈判的，都是新娘以外的其他人。阿格尼丝——1211年1月20日出生，奥托卡一世与匈牙利的康斯坦丝之女——是其中唯一一个明确的例外，而她大半个青年时期，都在用一次又一次告吹的婚约，反复证明这一点。\n\n这些政治操作，早在她还没资格对任何事表示同意之前就已经开始了。三岁时，她被许配给一位西里西亚公爵的儿子，对方还没等到婚礼就去世了。九岁时，她被许配给神圣罗马皇帝腓特烈二世本人的儿子亨利——这桩婚约拖了整整六年，最终还是没有结果。接下来轮到跟英格兰国王亨利三世的联姻提议，腓特烈二世亲自否决了它：这时他已经打定主意，要把她留给自己。\n\n而这份来自一位丧偶皇帝的求婚——1235年经由她自己的兄长瓦茨拉夫一世牵线——在纸面上，正是当时一位中世纪欧洲女性能拿到的最显赫的婚约之一。阿格尼丝还是拒绝了。她直接向教皇格里高利九世提出申诉，教皇出面调解，腓特烈也就此解除了这桩婚约。据编年史家记载，皇帝的怒气最终平息之后，说出的这句话，比大多数被拒的求婚者能说出来的都要体面得多：“若她是为了一个凡人而离开我，我定会拔剑复仇；可我无法动怒，因为比起我，她选择了天堂之王。”\n\n其实早在这桩婚约正式解除之前，她就已经在为自己真正的未来铺路了。在兄长的支持下，阿格尼丝于13世纪30年代初在布拉格创建了一座紧邻医院的修道院建筑群——方济各会修士与克拉利斯修女合一的院舍，是阿尔卑斯山以北地区第一座这样的建筑，也是布拉格现存最早的哥特式建筑之一。她本人于1234年入院，次年就成为布拉格克拉利斯修女会的院长——同一年，她还把条顿骑士团在波希米亚境内的全部产业，毫无保留地捐给了这所医院。不管当没当院长，她始终亲力亲为：为麻风病人和穷人做饭，亲手为他们缝补衣服，这个习惯她一直保持了下来，从未间断，直到1282年去世，前后长达四十七年。这座建筑群远不止是一座修道院：它后来成了普热美斯尔家族的墓地，至少有一次还充当过加冕地点——几十年后，她的亲哥哥瓦茨拉夫一世本人也将与家族其他成员一同安葬于此。此外，她还与阿西西的圣克拉拉本人保持了长达二十多年的书信往来——从克拉拉这一方的信件看，字里行间满是真切的母性温情——尽管两人终生未曾谋面。\n\n阿格尼丝创立事业的脚步并未就此停下。13世纪30年代的某个时候，她把自己医院里的世俗工作人员组织成了一支正式的骑士团——红星十字骑士团，专门致力于护理和医院工作，并在这个过程中获得了教皇格里高利九世的正式认可。它至今仍是波希米亚土地上唯一诞生过的骑士团，而且如今依然存续。\n\n她被正式册封为圣徒，等待的时间长得出奇——教皇约翰·保罗二世最终于1989年11月12日为她封圣。这个日期距离天鹅绒革命爆发，只差五天。没有人刻意安排过这个时间点，但事后很多人都觉得这里面藏着某种意味，阿格尼丝也因此得到了一个称号：那位推翻了共产主义的圣徒。这条时间线跟1989年的故事，还远没讲完——我们后面还会回到这里，她也会。",
    },
    relatedLandmarks: [
      {
        slug: "klaster-sv-anezky-ceske",
        relation: {
          en: "This is the convent Agnes founded and personally led as abbess for forty-seven years — Prague's oldest Gothic building, doubling as the Přemyslid family's own burial ground, and eventually her own brother Wenceslas I's final resting place too.",
          cz: "Právě tento klášter Anežka založila a osobně vedla jako abatyše čtyřicet sedm let — nejstarší gotickou stavbu v Praze, sloužící zároveň jako pohřebiště přemyslovské rodiny, kam byl nakonec uložen i její vlastní bratr Václav I.",
          zh: "这正是阿格尼丝亲手创立、并亲自担任院长长达四十七年的修道院——布拉格现存最古老的哥特式建筑，同时也是普热美斯尔家族自己的墓地，最终连她的亲哥哥瓦茨拉夫一世，也安葬于此。",
        },
      },
      {
        slug: "kostel-sv-frantiska-z-assisi",
        relation: {
          en: "This is the headquarters church of the Knights of the Cross with the Red Star, Agnes's own order — founded on this exact spot in 1252, its original Gothic building since buried beneath a Baroque replacement, sitting noticeably below today's square but never actually torn down.",
          cz: "Tohle je sídelní kostel Křižovníků s červenou hvězdou, Anežčina vlastního řádu — založeného přesně na tomhle místě roku 1252, jehož původní gotická stavba je dnes pohřbená pod barokní náhradou, citelně pod úrovní dnešního náměstí, ale nikdy skutečně zbouraná.",
          zh: "这里正是红星十字骑士团——阿格尼丝亲手创立的骑士团——的总部教堂，1252年就建在这个确切地点，它最初的哥特式建筑如今埋在一座巴洛克替代建筑之下，明显低于今天广场的地面，却从未真正被拆除。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Agnes_of_Bohemia",
  },
  {
    slug: "stone-prague-1230",
    era: "kingdom-golden-age",
    startYear: 1230,
    year: {
      en: "1230s–1250s",
      cz: "30.–50. léta 13. století",
      zh: "13世纪30年代－50年代",
    },
    tone: "humorous",
    title: {
      en: "Bohemia Goes Stone",
      cz: "Čechy se dávají do kamene",
      zh: "波希米亚，从木头到石头",
    },
    hookLine: {
      en: "Wenceslas I inherited a kingdom built mostly of wood. He spent his reign quietly turning it into one built of stone.",
      cz: "Václav I. zdědil království postavené hlavně ze dřeva. Vlastní vládu strávil tichou proměnou v království postavené z kamene.",
      zh: "瓦茨拉夫一世继承了一个大部分靠木头搭起来的王国。他用自己的统治，悄悄把它变成了一个用石头砌起来的王国。",
    },
    summary: {
      en: "While his father spent two decades rigging a succession fight, Wenceslas I spent his own reign on something considerably less dramatic and, in the long run, probably more important: turning Bohemia from a country built largely out of wood into one built out of stone.\n\nThe mechanism was colonization. Wenceslas actively invited German settlers — miners, craftsmen, merchants — into Bohemia and Moravia, offering them town charters modeled on German municipal law that granted real self-governance: their own courts, their own councils, protection from arbitrary noble interference. A wave of towns took shape or formalized their status this way through the 1230s and 1240s — Olomouc around 1240, Žatec, Jihlava (whose silver deposits would matter enormously within a few decades), Loket around 1250, among others.\n\nPrague itself changed under the same logic. What would become the Old Town received formal borough status around 1230, complete with a defensive wall circuit — and with German master builders and their techniques now settled locally in numbers, the city's wooden buildings began giving way to stone ones at a pace nothing before it had managed.\n\nNone of this made for the kind of story chroniclers liked to tell — no battles, no betrayals, nobody thrown out of a castle. But three-quarters of a century later, when a much more famous king starts laying out an entirely new town of his own, he'll be building on top of exactly this kind of unglamorous groundwork.",
      cz: "Zatímco jeho otec strávil dvě desetiletí vychytráváním nástupnického sporu, Václav I. věnoval vlastní vládu něčemu podstatně méně dramatickému a z dlouhodobého hlediska pravděpodobně důležitějšímu: proměně Čech ze země postavené převážně ze dřeva v zemi postavenou z kamene.\n\nNástrojem byla kolonizace. Václav aktivně zval německé osadníky — havíře, řemeslníky, kupce — do Čech a na Moravu a nabízel jim městská práva podle vzoru německého obecního práva, která zaručovala skutečnou samosprávu: vlastní soudy, vlastní radu, ochranu před svévolným zásahem šlechty. Ve 30. a 40. letech 13. století se touto cestou zformovala nebo formalizovala celá vlna měst — Olomouc kolem roku 1240, Žatec, Jihlava (jejíž stříbrná ložiska budou během pár desetiletí mít obrovský význam), Loket kolem roku 1250, a další.\n\nStejnou logikou se proměnila i samotná Praha. To, co se stane Starým Městem, získalo kolem roku 1230 formální status městyse, včetně opevnění hradbami — a s německými staviteli a jejich technikami, kteří se teď usazovali v Čechách ve větším počtu, začaly dřevěné stavby ustupovat kamenným tempem, jaké tu předtím nikdo nezvládl.\n\nNic z tohohle nebyl ten typ příběhu, který by kronikáři rádi vyprávěli — žádné bitvy, žádné zrady, nikoho nevyhodili z hradu. Ale o tři čtvrtě století později, když jeden mnohem slavnější král začne zakládat úplně nové město vlastní, bude stavět přímo na takovéhle nepříliš okázalé přípravné práci.",
      zh: "他父亲花了二十年精心设计一场继承权的算计，瓦茨拉夫一世却把自己的统治，投入到了一件远没那么戏剧化、但从长远来看很可能更重要的事情上：把波希米亚，从一个大部分靠木头搭起来的国家，变成一个用石头砌起来的国家。\n\n具体手段是移民殖民。瓦茨拉夫主动招揽德意志移民——矿工、工匠、商人——前来波希米亚和摩拉维亚定居，给他们授予仿照德意志市镇法制定的城市特许权，赋予真正的自治：自己的法庭、自己的议会，还能免受贵族的任意干预。整个1230年代到1240年代，一大批城镇借此成型或正式确立地位——大约1240年的奥洛穆茨、扎泰茨、伊赫拉瓦（它的银矿几十年后将变得举足轻重）、大约1250年的洛凯特，等等。\n\n布拉格本身也在同一套逻辑下发生了改变。日后成为“老城”的这片区域，大约在1230年获得了正式的市镇地位，还修起了防御城墙——随着德意志的能工巧匠成批定居下来，木造建筑开始以前所未有的速度被石造建筑取代。\n\n这些事没有一件是编年史家爱讲的那种故事——没有战役，没有背叛，没人被从城堡里扔出去。可四分之三个世纪之后，当一位更加声名显赫的国王开始规划自己那座崭新的城区时，他脚下踩的，正是这样一片毫不起眼、却打得扎扎实实的地基。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Wenceslaus_I_of_Bohemia",
  },
  {
    slug: "mongol-invasion-1241",
    era: "kingdom-golden-age",
    startYear: 1241,
    year: {
      en: "1241",
      cz: "1241",
      zh: "1241年",
    },
    tone: "serious",
    title: {
      en: "The Storm That Passed Bohemia By",
      cz: "Bouře, která se Čechám vyhnula",
      zh: "掠过波希米亚的风暴",
    },
    hookLine: {
      en: "In 1241, the Mongol Empire tore through Poland and Silesia in weeks. Bohemia survived largely by not being where the fighting was.",
      cz: "V roce 1241 mongolská říše během týdnů prošla Polskem a Slezskem jako nůž máslem. Čechy přežily hlavně tím, že nebyly tam, kde se bojovalo.",
      zh: "1241年，蒙古帝国仅用数周便横扫了波兰和西里西亚。波希米亚之所以能幸存，很大程度上是因为它不在战火中心。",
    },
    summary: {
      en: "By 1241, the Mongol Empire had already conquered more territory in a generation than Rome had in centuries, and that spring its westernmost army turned its full attention on Poland and Silesia. Duchies fell in weeks. Kraków was burned in March. What happened next in Bohemia says less about heroism than about geography and timing — and Bohemia, unusually for this era, came out of it relatively intact.\n\nKing Wenceslas I marched north with an army reportedly twice the size of what Duke Henry II the Pious of Silesia could field, hoping to combine forces before meeting the Mongols in open battle. He never got the chance. Still two days away, Wenceslas learned that Henry — either out of overconfidence or simple impatience — had already engaged the Mongol army near Legnica on 9 April 1241, without waiting for Bohemian reinforcements. The result was a massacre: Henry's army was annihilated and the duke himself was killed, his head reportedly displayed on a spear outside the besieged town of Legnica.\n\nWenceslas did not press forward to avenge him. He pulled his army back into Bohemia's mountainous frontier, gathered further reinforcements from Thuringia and Saxony, and settled into terrain that would badly hamper Mongol cavalry rather than risk a second Legnica. It worked, though not entirely for the reasons he might have hoped: the Mongol commanders had never actually intended to push deep into Bohemia. Their assignment was to neutralize the northern flank before the invasion's main body regrouped in Hungary, and Henry's destruction had already accomplished that. Moravia, less defensible and directly in their path south, was not so lucky — its countryside was thoroughly devastated before the Mongol army moved on.\n\nBohemia's core territory survived the single most destructive military campaign to hit medieval Central Europe largely intact — a genuinely rare outcome that year, and one owed about equally to Wenceslas's caution, Bohemia's mountain ring, and an enemy that was already looking past it toward Hungary.",
      cz: "Do roku 1241 už Mongolská říše za jednu generaci dobyla víc území, než Řím za celá staletí, a na jaře toho roku obrátila svá nejzápadnější vojska naplno na Polsko a Slezsko. Knížectví padala během týdnů. Krakov byl v březnu vypálen. To, co se pak stalo v Čechách, vypovídá míň o hrdinství a víc o zeměpisu a načasování — a Čechy z toho, neobvykle na tuhle dobu, vyšly poměrně nedotčené.\n\nKrál Václav I. táhl na sever s vojskem údajně dvakrát tak velkým, jaké dokázal postavit slezský kníže Jindřich II. Pobožný, v naději, že se jejich síly spojí ještě před střetem s mongolskou armádou. Tu příležitost nikdy nedostal. Byl ještě dva dny cesty daleko, když se dozvěděl, že Jindřich — buď z přílišné sebedůvěry, nebo z prosté netrpělivosti — se s mongolským vojskem už střetl u Lehnice 9. dubna 1241, aniž by počkal na české posily. Výsledkem byl masakr: Jindřichovo vojsko bylo zničeno a sám kníže padl, jeho hlava byla údajně vystavena na kopí před obleženým městem.\n\nVáclav se za ním nevydal pomstít ho. Stáhl své vojsko zpátky do hornatého českého pohraničí, sehnal další posily z Duryňska a Saska a usadil se v terénu, který by mongolské jízdě citelně znesnadnil pohyb, místo aby riskoval druhou Lehnici. Fungovalo to, i když ne úplně z důvodů, v jaké možná doufal: mongolští velitelé nikdy vlastně neměli v úmyslu tlačit hluboko do Čech. Jejich úkolem bylo zneškodnit severní křídlo ještě předtím, než se hlavní síly invaze přeskupí v Uhrách, a Jindřichovo zničení tenhle úkol už splnilo. Morava, méně bránitelná a přímo na jejich cestě na jih, takové štěstí neměla — její venkov byl důkladně zpustošen, než mongolské vojsko táhlo dál.\n\nJádro českého území přežilo jedinou nejničivější vojenskou kampaň, jaká kdy zasáhla středověkou střední Evropu, do značné míry nedotčené — toho roku opravdu vzácný výsledek, a to zhruba stejnou měrou díky Václavově opatrnosti, českému horskému prstenci a nepříteli, který se už tak jako tak díval dál, směrem k Uhrám.",
      zh: "到1241年，蒙古帝国用一代人的时间征服的领土，已经超过了罗马几个世纪的成果。那年春天，蒙古最西端的一支大军把矛头彻底转向了波兰和西里西亚。各公国接连在几周内沦陷，克拉科夫3月就被焚毁。接下来在波希米亚发生的事情，与其说是英雄壮举，不如说是地理和时机使然——而波希米亚，在那一年算是个罕见的例外，核心领土基本保全了下来。\n\n瓦茨拉夫一世率军北上，据说兵力是西里西亚公爵“虔诚者”亨利二世所能集结兵力的两倍，希望能在与蒙古军队正面交锋前完成会师。可他从没等到这个机会。就在还差两天路程的时候，瓦茨拉夫得知亨利——要么是过于自信，要么纯粹是等不及了——已经在1241年4月9日于莱格尼察与蒙古军队交战，没有等波希米亚援军赶到。结果是一场屠杀：亨利的军队全军覆没，公爵本人阵亡，据说他的首级还被挑在长矛上，示众于被围困的莱格尼察城外。\n\n瓦茨拉夫没有继续北上为他复仇。他把军队撤回波希米亚多山的边境地带，又从图林根和萨克森招募了增援，选择在这种会大大限制蒙古骑兵机动性的地形里驻扎下来，而不是冒险再打一场莱格尼察。这一招奏效了——虽然原因未必完全如他所愿：蒙古指挥官本来就从没打算深入波希米亚境内。他们的任务是在主力大军于匈牙利重新集结之前扫平北翼威胁，而亨利的覆灭已经达成了这个目标。摩拉维亚就没这么幸运了——地形更难防守，又正好挡在蒙古军队南下的必经之路上，境内乡村在蒙古大军继续前进之前，遭到了彻底的蹂躏。\n\n波希米亚的核心领土，就这样在中世纪中欧遭受过的破坏力最强的一场军事行动中，基本保全了下来——这在那一年堪称罕见的结局，而这份幸运，大致要归功于瓦茨拉夫的谨慎、波希米亚天然的山地屏障，以及一个早已把目光投向匈牙利、心思根本不在这里的对手。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Battle_of_Legnica",
  },
  {
    slug: "the-boy-king-1246",
    era: "kingdom-golden-age",
    startYear: 1246,
    year: {
      en: "1246–1249",
      cz: "1246–1249",
      zh: "1246年－1249年",
    },
    tone: "humorous",
    title: {
      en: "The Boy King",
      cz: "Mladší král",
      zh: "少年王",
    },
    hookLine: {
      en: "Before he became the 'King of Iron and Gold,' Otakar II's first real political act was throwing his own father out of Prague Castle.",
      cz: "Než se stal „Králem železným a zlatým\", byl Otakarův první opravdový politický čin ten, že vyhnal vlastního otce z Pražského hradu.",
      zh: "在成为“铁与金之王”之前，奥托卡二世第一次真正意义上的政治行动，是把自己的父亲从布拉格城堡里赶了出去。",
    },
    summary: {
      en: "Austria's five-generation Babenberg dynasty ended abruptly on 15 June 1246, when Duke Frederick II — 'the Quarrelsome,' a nickname he'd earned honestly — was killed fighting Hungary at the Battle of the Leitha River, leaving no son behind. King Wenceslas I moved fast: he arranged a marriage between his own eldest son, Vladislaus, Margrave of Moravia, and Gertrude of Babenberg, Frederick's niece and closest surviving heir, hoping to fold Austria into Bohemia's orbit through simple family connection. (Yes, another Vladislaus — this family's naming conventions remain relentlessly unhelpful.) The wedding went ahead. Vladislaus did not: he died on 3 January 1247, before ever taking possession of the duchy his marriage was supposed to secure.\n\nThat left the succession, and the Austrian question, to Wenceslas's next son — the boy who would eventually be remembered as Otakar II, 'the King of Iron and Gold.' He was made Margrave of Moravia in his dead brother's place and sent to Brno, where his actual job was considerably less glamorous than his future epithet: overseeing the reconstruction of a region the Mongols had devastated only a few years earlier.\n\nHis first real appearance in Bohemian politics, though, wasn't heroic. In 1248, a group of nobles dissatisfied with Wenceslas — reportedly encouraged by supporters of Emperor Frederick II, who had his own reasons to want Bohemia destabilized — talked the young margrave into open rebellion against his own father. On 31 July 1248, Otakar was proclaimed 'the younger king' and drove Wenceslas bodily out of Prague Castle, holding the throne himself for the next fourteen months. Pope Innocent IV excommunicated him for it. It took until November 1249 for Wenceslas to finally crush the revolt and imprison his son at Přimda — Bohemia's oldest surviving stone castle, and, for a while, his son's own personal cell.\n\nThe man who would go on to build the largest domain any Přemyslid ever controlled started his political career, in other words, by throwing his own father out of the family castle.",
      cz: "Pětigenerační babenberská dynastie v Rakousku náhle skončila 15. června 1246, když vévoda Fridrich II. — přezdívaný „Svárlivý\", a to zaslouženě — padl v boji s Uhrami v bitvě na řece Litavě, aniž by zanechal syna. Král Václav I. jednal rychle: zařídil sňatek svého vlastního nejstaršího syna, moravského markraběte Vladislava, s Gertrudou Babenberskou, Fridrichovou neteří a nejbližší žijící dědičkou, v naději, že tím Rakousko prostou rodinnou vazbou vtáhne do české orbity. (Ano, další Vladislav — pojmenovací zvyklosti téhle rodiny zůstávají neúprosně nešikovné.) Svatba se konala. Vladislav ne dlouho: zemřel 3. ledna 1247, ještě než stihl převzít vévodství, které měl jeho sňatek zajistit.\n\nNástupnictví, a s ním i rakouská otázka, tak připadly dalšímu Václavovu synovi — chlapci, který bude jednou vzpomínán jako Otakar II., „Král železný a zlatý\". Na místě mrtvého bratra se stal moravským markrabětem a byl poslán do Brna, kde ho čekal úkol podstatně méně okázalý než jeho budoucí přídomek: dohlížet na obnovu kraje, který jen o pár let dřív zpustošili Mongolové.\n\nJeho skutečně první vystoupení v české politice ale hrdinské nebylo. V roce 1248 skupina šlechticů nespokojených s Václavem — údajně podněcovaná stoupenci císaře Fridricha II., který měl svoje vlastní důvody chtít Čechy destabilizovat — přemluvila mladého markraběte k otevřené vzpouře proti vlastnímu otci. 31. července 1248 byl Otakar prohlášen „mladším králem\" a svého otce doslova vyhnal z Pražského hradu, přičemž trůn sám držel dalších čtrnáct měsíců. Papež Inocenc IV. ho za to exkomunikoval. Trvalo až do listopadu 1249, než Václav vzpouru konečně potlačil a syna uvěznil na Přimdě — nejstarším dochovaném kamenném hradu v Čechách, a na čas i jeho vlastní osobní celou.\n\nMuž, který jednou vybuduje největší panství, jaké kdy měl jakýkoli přemyslovec pod kontrolou, tak svou politickou kariéru zahájil tím, že vlastního otce vyhodil z rodinného hradu.",
      zh: "奥地利延续了五代人的巴本贝格王朝，1246年6月15日戛然而止——公爵腓特烈二世，绰号“好斗者”（这个绰号可谓实至名归），在莱塔河战役中与匈牙利交战阵亡，身后没有留下儿子。瓦茨拉夫一世动作很快：他安排自己的长子、摩拉维亚藩侯瓦拉迪斯拉夫，迎娶腓特烈的侄女、也是最近的在世继承人格特鲁德·冯·巴本贝格，指望靠这层姻亲关系把奥地利拉进波希米亚的势力范围。（没错，又一个瓦拉迪斯拉夫——这个家族取名的习惯，始终是一如既往地添乱。）婚礼如期举行了。瓦拉迪斯拉夫却没能撑太久：1247年1月3日，他就去世了，还没来得及真正接管这场婚姻本该为他换来的那个公国。\n\n继承权和奥地利这道难题，就这样落到了瓦茨拉夫的下一个儿子头上——这个男孩日后会被人记住的名字，是“铁与金之王”奥托卡二世。他接替亡兄成为摩拉维亚藩侯，被派往布尔诺，等着他的差事，跟日后那个响亮的称号比起来朴素得多：监督重建几年前刚被蒙古人蹂躏过的这片地区。\n\n不过，他在波希米亚政坛上真正意义上的首秀，可一点也不英雄。1248年，一批对瓦茨拉夫不满的贵族——据说背后还有皇帝腓特烈二世的支持者煽风点火，毕竟皇帝自己也有理由希望波希米亚陷入不稳——说动了这位年轻的藩侯公开造反，反对自己的亲生父亲。1248年7月31日，奥托卡被拥立为“少年王”，直接把父亲从布拉格城堡赶了出去，自己坐上王位长达十四个月。教皇英诺森四世为此将他处以绝罚。直到1249年11月，瓦茨拉夫才终于平定叛乱，把儿子囚禁在了普日姆达——波希米亚现存最古老的石造城堡，也在那段日子里，成了他自己儿子的私人牢房。\n\n换句话说，这位日后将建立起普热美斯尔家族有史以来最大版图的国王，他的政治生涯的第一步，是把自己的父亲从家族城堡里赶了出去。",
    },
    relatedLandmarks: [
      {
        slug: "primda",
        relation: {
          en: "This is where Wenceslas I locked up his own son after finally crushing the 1248–49 revolt — Bohemia's oldest surviving stone castle, repurposed for a while as a prison for the future 'King of Iron and Gold.'",
          cz: "Právě sem Václav I. zavřel vlastního syna poté, co konečně potlačil vzpouru z let 1248–49 — nejstarší dochovaný kamenný hrad v Čechách, na čas přeměněný na vězení pro budoucího „Krále železného a zlatého\".",
          zh: "瓦茨拉夫一世正是把儿子囚禁在了这里，就在他终于平定1248-49年那场叛乱之后——这是波希米亚现存最古老的石造城堡，一度被改造成了日后“铁与金之王”的监狱。",
        },
      },
      {
        slug: "old-royal-palace",
        relation: {
          en: "This is the palace Otakar drove his own father out of in 1248 — not the last time this hilltop institution changed hands within a single family, but the only time it happened between father and son.",
          cz: "Právě z tohoto paláce vyhnal Otakar v roce 1248 vlastního otce — nebylo to naposledy, co tahle instituce na kopci změnila majitele v rámci jedné rodiny, ale bylo to jedinkrát, kdy se to stalo mezi otcem a synem.",
          zh: "1248年，奥托卡正是把自己的父亲从这座宫殿里赶了出去——这座山丘上的机构在同一个家族内部易主，这不是第一次，但发生在父子之间，这却是唯一一次。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Ottokar_II_of_Bohemia",
  },
  {
    slug: "otakar-gets-austria-1251",
    era: "kingdom-golden-age",
    startYear: 1251,
    year: {
      en: "1250–1252",
      cz: "1250–1252",
      zh: "1250年－1252年",
    },
    tone: "humorous",
    title: {
      en: "Father, Son, and Austria",
      cz: "Otec, syn a Rakousko",
      zh: "父子与奥地利",
    },
    hookLine: {
      en: "Reconciliation, for this family, usually came with a territorial reward attached.",
      cz: "Smíření v téhle rodině mělo obvykle v zápětí nějakou územní odměnu.",
      zh: "在这个家族里，和解通常都伴随着一块领地作为奖赏。",
    },
    summary: {
      en: "Reconciliation, in this family, tended to come with a territorial reward attached. After fourteen months in prison, Otakar and his father found their way back to something workable — helped enormously by the fact that they both still wanted the same thing: Austria, still sitting there without a ruler since Frederick the Quarrelsome's death five years earlier. Wenceslas released his son, restored him as Margrave of Moravia, and in 1251 backed him in person as he marched into Austria itself. The Austrian estates, worn down by years without a duke, acclaimed Otakar as their ruler on arrival.\n\nAcclamation wasn't quite the same as a settled claim, so Otakar did what his own father had once done to a marriage: he made it explicitly political. On 11 February 1252, he married Margaret of Babenberg — Frederick the Quarrelsome's own sister, already once widowed as the wife of a German king, and thirty years his senior. She was around forty-eight; he was not yet twenty. The marriage did exactly what it was built to do, legally cementing his hold on the duchy — and exactly what a thirty-year gap tends to do as well: Margaret could no longer bear children, a complication Otakar would spend the rest of the decade quietly working around.\n\nFor now, though, the arrangement held. Bohemia had a king, an Austrian duchy attached to it, and, for the moment, a father and son who'd stopped trying to throw each other out of buildings.",
      cz: "Smíření v téhle rodině mělo obvykle v zápětí nějakou územní odměnu. Po čtrnácti měsících vězení našli Otakar a jeho otec cestu k něčemu funkčnímu — nemalou měrou díky tomu, že oba pořád chtěli totéž: Rakousko, které tam už pět let, od smrti Fridricha Svárlivého, sedělo bez vládce. Václav syna propustil, znovu ho dosadil jako moravského markraběte a v roce 1251 ho osobně podpořil, když vytáhl přímo do Rakouska. Rakouské stavy, unavené lety bez vévody, Otakara po jeho příjezdu okamžitě přijaly za svého vládce.\n\nAklamace ale nebyla totéž co ustálený nárok, a tak Otakar udělal to, co kdysi jeho vlastní otec udělal s manželstvím: vysloveně z něj udělal politický nástroj. 11. února 1252 se oženil s Markétou Babenberskou — vlastní sestrou Fridricha Svárlivého, už jednou ovdovělou po německém králi, a o třicet let starší než on sám. Bylo jí kolem osmačtyřiceti; jemu ještě nebylo dvacet. Sňatek udělal přesně to, k čemu byl určen — právně upevnil jeho držení vévodství — a taky přesně to, co třicetiletý rozdíl obvykle dělá: Markéta už nemohla mít děti, komplikace, s níž se Otakar potichu potýkal celý zbytek desetiletí.\n\nProzatím ale dohoda držela. Čechy měly krále, k němu připojené rakouské vévodství, a na chvíli i otce a syna, kteří se přestali navzájem vyhazovat z budov.",
      zh: "在这个家族里，和解通常都伴随着一块领地作为奖赏。囚禁十四个月后，奥托卡和父亲总算找回了某种可以运作的关系——很大程度上是因为两人这时候要的其实是同一样东西：奥地利，自五年前“好斗者”腓特烈去世以来，那个位子一直空着。瓦茨拉夫释放了儿子，重新任命他为摩拉维亚藩侯，1251年还亲自出面撑腰，看着他率军开进奥地利。奥地利各邦，早已被这几年群龙无首的日子拖得疲惫不堪，一见奥托卡到来，当即拥立他为统治者。\n\n不过，被拥立不等于名分坐实，于是奥托卡照搬了他父亲当年对待婚姻的那一套：把这件事彻底变成了一场政治操作。1252年2月11日，他迎娶了玛格丽特·冯·巴本贝格——“好斗者”腓特烈的亲妹妹，此前已经嫁过一位德意志国王、守寡在身，年纪比奥托卡整整大三十岁。她当时大约四十八岁，他还不到二十岁。这桩婚姻确实达成了它的既定目的，从法律上坐实了他对公国的统治——但也顺带带来了三十岁年龄差通常会带来的那个后果：玛格丽特已经无法生育，这个麻烦，奥托卡此后接下来整整十年都得悄悄想办法应付。\n\n不过眼下，这套安排总算维持住了。波希米亚有了国王，国王名下多了一个奥地利公国，而这对父子，也总算暂时不再把彼此互相扔出建筑物了。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Margaret_of_Austria,_Queen_of_Bohemia",
  },
  {
    slug: "wenceslas-i-death-1253",
    era: "kingdom-golden-age",
    startYear: 1253,
    year: {
      en: "1253",
      cz: "1253",
      zh: "1253年",
    },
    tone: "humorous",
    title: {
      en: "The Baton Passes",
      cz: "Štafeta se předává",
      zh: "接力棒传下去",
    },
    hookLine: {
      en: "Wenceslas I died having done the one thing almost none of his predecessors managed: leave behind an orderly transition.",
      cz: "Václav I. zemřel poté, co dokázal jednu věc, kterou skoro žádný z jeho předchůdců nezvládl: zanechat po sobě klidné předání moci.",
      zh: "瓦茨拉夫一世去世时，做成了几乎没有哪位前任做到过的一件事：留下了一次平稳的权力交接。",
    },
    summary: {
      en: "Wenceslas I died on 23 September 1253, twenty-three years into a reign that had, on the whole, gone remarkably smoothly for this family — stone towns instead of wooden ones, a functioning kingdom, and an heir already tested, imprisoned, forgiven, and married into an entire second duchy. Otakar wasn't crowned immediately; it took three months, until 23 December, for the formalities to catch up with the reality that had been obvious since the reconciliation in Austria. When they did, Bohemia had its next king — the one who would spend the following quarter-century turning everything his father and grandfather had quietly built into the largest domain any Přemyslid ever controlled.",
      cz: "Václav I. zemřel 23. září 1253, po třiadvaceti letech vlády, která pro tuhle rodinu proběhla celkem vzato pozoruhodně hladce — kamenná města místo dřevěných, fungující království a následník, který už měl za sebou vlastní zkoušku, vězení, odpuštění i sňatek, jenž mu přinesl celé druhé vévodství. Otakar nebyl korunován hned; formalitám trvalo tři měsíce, až do 23. prosince, než dohnaly realitu, která byla zřejmá už od smíření v otázce Rakouska. Když se tak stalo, měly Čechy svého dalšího krále — toho, kdo příští čtvrtstoletí promění všechno, co jeho otec a děd tiše vybudovali, v největší panství, jaké kdy měl jakýkoli přemyslovec pod kontrolou.",
      zh: "瓦茨拉夫一世1253年9月23日去世，结束了长达二十三年的统治——对这个家族来说，这段统治总体上算得上格外平顺：石头砌成的城镇取代了木头搭的，一个运转正常的王国，还有一位继承人——已经经历过造反、囚禁、被原谅，甚至靠联姻拿下了整整第二个公国。奥托卡并没有立刻加冕；正式手续又拖了三个月，直到12月23日，才追上了自奥地利和解以来早已明摆着的现实。等一切尘埃落定，波希米亚迎来了自己的下一位国王——接下来的四分之一个世纪里，他将把父亲和祖父悄悄积攒下来的一切，变成普热美斯尔家族有史以来控制过的最大版图。",
    },
    relatedLandmarks: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Wenceslaus_I_of_Bohemia",
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
