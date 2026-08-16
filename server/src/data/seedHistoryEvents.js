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
      en: "Libuše's death didn't go smoothly. According to legend, the women of her old court weren't ready to hand power over to Přemysl and his male successors, so they built their own fortress on a ridge facing Vyšehrad and simply refused to leave. What followed was several years of ambushes and standoffs, capped by one genuinely wild trick: a warrior named Šárka let herself be chained to a tree as bait, luring a lovestruck enemy commander and his soldiers straight into a fatal trap. The men eventually won the war — but lost the naming rights, since the valley where it happened is still called Šárka to this day.",
      cz: "Libušina smrt neproběhla hladce. Podle legendy se ženy z jejího bývalého dvora nechtěly smířit s tím, že moc přejde na Přemysla a jeho mužské nástupce, a tak si na hřebeni naproti Vyšehradu postavily vlastní pevnost a prostě odmítly odejít. Následovalo několik let přepadů a patových situací, korunovaných jedním opravdu šíleným trikem: bojovnice Šárka se nechala jako návnada přivázat ke stromu a do smrtelné pasti tak vlákala zamilovaného nepřátelského velitele i jeho vojáky. Muži válku nakonec vyhráli — ale prohráli právo na pojmenování, protože údolí, kde se to odehrálo, se dodnes jmenuje Šárka.",
      zh: "莉布谢的死并不平静。据传说，她昔日宫廷中的女性并不甘心把权力交给普热米斯尔和他之后的男性继承人，于是在正对着维谢赫拉德的一道山脊上，修建了自己的堡垒，并且干脆拒绝离开。随之而来的是长达数年的伏击与对峙，其中最疯狂的一招，莫过于女战士沙尔卡：她自愿被锁在树上充当诱饵，把一位为她倾心的敌方指挥官连同他的士兵，一起引入了死亡陷阱。男人们最终打赢了这场战争——却输掉了命名权，因为这场战役发生的山谷，至今仍然叫作沙尔卡。",
    },
    relatedLandmarks: [
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
        slug: "vysehrad-wall-walkway",
        relation: {
          en: "The fortress hill itself — its visible walls are 17th-century Baroque, built on ground the legend insists is far older.",
          cz: "Samotný pevnostní kopec — jeho viditelné hradby jsou barokní ze 17. století, postavené na půdě, kterou legenda tvrdošíjně považuje za mnohem starší.",
          zh: "这座堡垒山本身——如今可见的城墙建于17世纪巴洛克时期，而传说坚称脚下这片土地远比城墙古老得多。",
        },
      },
      {
        slug: "rotunda-sv-martina",
        relation: {
          en: "The oldest building still standing in Prague, raised around 1080 — the first Vyšehrad structure that doesn't need a legend to prove its age.",
          cz: "Nejstarší dodnes stojící stavba v Praze, vztyčená kolem roku 1080 — první vyšehradská stavba, která k prokázání svého stáří legendu nepotřebuje.",
          zh: "布拉格现存最古老的建筑，建于约1080年——维谢赫拉德第一座无需借助传说、便能自证年代的建筑。",
        },
      },
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vy%C5%A1ehrad",
  },
  {
    slug: "st-ludmila-martyrdom",
    era: "legends-origins",
    startYear: 921,
    year: {
      en: "874 (baptism) – 921 (martyrdom)",
      cz: "874 (křest) – 921 (mučednická smrt)",
      zh: "874年（受洗）－921年（殉道）",
    },
    tone: "humorous",
    title: {
      en: "St. Ludmila — Christianization & Martyrdom",
      cz: "Svatá Ludmila — christianizace a mučednictví",
      zh: "圣鲁德米拉——基督教化与殉道",
    },
    hookLine: {
      en: "Skip forward a couple of centuries, past the ambushes and the sandals, and the Přemyslid family drama gets a lot more serious — and a lot more fatal.",
      cz: "Přeskočte pár století za přepady a sandály dopředu a rodinné drama Přemyslovců se najednou stává o dost vážnějším — a o dost smrtelnějším.",
      zh: "时间快进几个世纪，越过那些伏击和凉鞋的故事，普热米斯尔家族的恩怨突然变得严肃了许多——也致命了许多。",
    },
    summary: {
      en: "By the late 800s, the Přemyslid dynasty Přemysl and Libuše started was several generations deep, and its rulers, Bořivoj and his wife Ludmila, made a decision that would shape the whole region: they converted to Christianity, becoming the first Christian rulers in the family line. It should have been a happy legacy. Instead, it turned Ludmila into a target. In 921, locked in a bitter dispute with her own daughter-in-law Drahomíra over who would raise the young future ruler Wenceslas, Ludmila was strangled on Drahomíra's orders — making her Bohemia's first native saint, and, rather awkwardly, the family's first recorded political assassination.",
      cz: "Na konci 9. století už byla přemyslovská dynastie, kterou založili Přemysl s Libuší, o několik generací dál a její vládci, Bořivoj a jeho žena Ludmila, učinili rozhodnutí, které mělo formovat celý kraj: přijali křest a stali se prvními křesťanskými vládci v rodové linii. Mohl z toho být šťastný odkaz. Místo toho se z Ludmily stal terč. V roce 921, uprostřed hořkého sporu s vlastní snachou Drahomírou o to, kdo bude vychovávat mladého budoucího vládce Václava, dala Drahomíra Ludmilu uškrtit. Ludmila se tak stala první domácí svatou v Čechách a — poněkud trapně pro rodinu — zároveň první doloženou politickou vraždou v jejích dějinách.",
      zh: "到9世纪末，普热米斯尔与莉布谢开创的这个王朝，已经繁衍了好几代人，而当时的统治者波日沃伊和他的妻子鲁德米拉，做出了一个将影响整个地区的决定：他们皈依了基督教，成为这个家族世系中第一代信奉基督教的统治者。这本该是一段令人欣慰的家族遗产。结果却让鲁德米拉成了众矢之的。921年，在与自己儿媳德拉霍米拉围绕由谁抚养年幼的未来统治者瓦茨拉夫而爆发的激烈争执中，德拉霍米拉下令将鲁德米拉勒死。鲁德米拉由此成为波希米亚本土第一位圣徒——同时也颇为尴尬地，成了这个家族史上第一起有记载的政治暗杀。",
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
