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
    year: "Prehistory – 6th century AD",
    image: "/history/prehistory.webp",
    tone: "humorous",
    title: {
      en: "Before the Legend",
      cz: "Před legendou",
      zh: "传说之前",
    },
    hookLine: {
      en: "Before princesses prophesied castles, three different peoples took turns figuring out where to put a town in Bohemia.",
      cz: "Než kněžny věštily hrady, museli tři různé národy postupně přijít na to, kam v Čechách vlastně postavit město.",
      zh: "在公主预言城堡之前，已经有三批不同的民族轮流琢磨过该把城镇建在波希米亚的哪里。",
    },
    summary: {
      en: "People have been living around the future site of Prague since the Palaeolithic, but the first name on the lease belongs to the Boii, a Celtic tribe who arrived around 500 BC and gave the region its name — Bohemia is literally 'land of the Boii,' a label that outlived the Boii themselves by roughly two thousand years. Germanic tribes pushed them out next, then largely moved on themselves by the 6th century AD, drifting south toward the Danube and leaving the land conveniently vacant for a Slavic tribe drifting in from the west to settle it — the same people who would, within a couple of centuries, start telling stories about a prophetic princess on a cliff.",
      cz: "Lidé žili v okolí budoucí Prahy už od paleolitu, ale první jméno na nájemní smlouvě patří Bójům, keltskému kmeni, který sem dorazil kolem roku 500 př. n. l. a dal kraji jméno — Bohemia doslova znamená „země Bójů“, nálepka, která své jmenovce přežila o zhruba dva tisíce let. Bóje odsud pak vytlačily germánské kmeny, které se ale samy do 6. století n. l. z velké části přesunuly dál na jih k Dunaji, a uvolnily tak místo slovanskému kmeni přicházejícímu od západu — právě těm, kdo si během několika dalších staletí začnou vyprávět příběhy o věštící kněžně na skále.",
      zh: "早在旧石器时代，就已经有人在未来的布拉格一带定居，但在这片土地上留下第一个名字的，是大约公元前500年抵达此地的凯尔特波伊部落——波希米亚这个名字，字面意思就是波伊人的土地，这个称呼比波伊人本身多存活了大约两千年。之后，日耳曼部落把波伊人赶走，但他们自己到了公元6世纪也大多南迁至多瑙河流域，恰好把这片土地空了出来，让一支从西边而来的斯拉夫部落趁虚而入、定居于此——正是这群人，会在此后的几个世纪里，开始讲述那位在悬崖上做出预言的公主的故事。",
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
    year: "8th century (legendary)",
    tone: "humorous",
    title: {
      en: "Libuše's Prophecy",
      cz: "Libušino proroctví",
      zh: "莉布谢的预言",
    },
    hookLine: {
      en: "A princess stands on a cliff, points at some trees, and accidentally founds a great city.",
      cz: "Kněžna stojí na skále, ukáže na pár stromů a nechtěně založí velké město.",
      zh: "一位公主站在悬崖上，指向几棵树，就这样意外建立了一座伟大的城市。",
    },
    summary: {
      en: "According to the chronicler Kosmas, the legendary ruler Libuše once stood above the Vltava, fell into a prophetic trance, and declared that a great city — one whose glory would touch the stars — would rise on a wooded hill where a man was building the threshold of his house. That hill became Prague Castle, and the city has never quite stopped reminding visitors that the whole thing was foretold, whether or not anyone can prove Libuše existed at all.",
      cz: "Podle kronikáře Kosmy stála legendární kněžna Libuše kdysi nad Vltavou, upadla do věšteckého vytržení a prohlásila, že na zalesněném kopci, kde jistý muž právě stavěl práh svého domu, povstane velké město, jehož sláva se dotkne hvězd. Tím kopcem se stal Pražský hrad a město od té doby návštěvníkům nepřestává připomínat, že celé to bylo předpovězeno — bez ohledu na to, zda vůbec někdo dokáže, že Libuše skutečně existovala.",
      zh: "根据编年史家科斯马斯的记载，传说中的女公爵莉布谢曾站在伏尔塔瓦河上方，陷入一场预言式的出神状态，宣告在一座林木茂密的山丘上——彼时正有一名男子在那里搭建自家房屋的门槛——将崛起一座荣耀直抵星辰的伟大城市。那座山丘后来成了布拉格城堡的所在地，而这座城市至今仍不厌其烦地提醒每一位访客：这一切早已被预言——尽管没人能证明莉布谢真的存在过。",
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
    year: "8th century (legendary)",
    tone: "humorous",
    title: {
      en: "Přemysl the Ploughman",
      cz: "Přemysl Oráč",
      zh: "犁田者普热米斯尔",
    },
    hookLine: {
      en: "Prague's founding dynasty starts with a farmer who forgot to take his boots off.",
      cz: "Zakladatelská dynastie Prahy začíná rolníkem, který zapomněl přezout se z lýčáků.",
      zh: "布拉格开国王朝的起点，是一位忘了脱下草鞋的农夫。",
    },
    summary: {
      en: "When Libuše's subjects grumbled that a woman shouldn't rule alone, she sent her horse to fetch the husband she'd already foreseen: Přemysl, found ploughing a field in the village of Stadice, plain leather sandals and all. He left the oxen mid-furrow, married Libuše, and founded the Přemyslid dynasty that would rule Bohemia, on and off, for the next five centuries — reportedly keeping his old sandals and ploughing gear in the princely treasury as a reminder of where the family started.",
      cz: "Když si Libušini poddaní stěžovali, že by jim neměla vládnout jen žena, poslala svého koně pro manžela, kterého už dávno předvídala: Přemysla, nalezeného při orání pole ve vsi Stadice, i s jeho koženými sandály. Nechal voly uprostřed brázdy, oženil se s Libuší a založil přemyslovskou dynastii, která pak s přestávkami vládla Čechám dalších pět set let — a jeho staré sandály i orební nářadí prý knížecí rod dodnes uchovával v pokladnici jako připomínku, odkud vzešel.",
      zh: "当莉布谢的臣民抱怨一位女性不应独自统治时，她派马去找她早已预见的丈夫：普热米斯尔，他正在斯塔迪采村里犁田，脚上穿着普通的皮凉鞋。他在犁沟中间停下牛群，娶了莉布谢，并建立了普热米斯尔王朝，这个王朝在接下来的五个世纪里断断续续地统治着波希米亚——据说他把旧凉鞋和犁具都保存在王室的宝库里，以提醒家族的起源。",
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
    year: "8th century (legendary)",
    tone: "humorous",
    title: {
      en: "The Girls' War",
      cz: "Dívčí válka",
      zh: "少女之战",
    },
    hookLine: {
      en: "After Libuše died, her former handmaidens declared war on every man in Bohemia.",
      cz: "Po Libušině smrti její bývalé družky vyhlásily válku všem mužům v Čechách.",
      zh: "莉布谢死后，她昔日的侍女们向波希米亚的所有男人宣战了。",
    },
    summary: {
      en: "Legend holds that once Libuše was gone, the women of her court — led by a warrior named Vlasta — refused to accept Přemysl's rule and built their own fortress, Děvín, on a ridge facing Vyšehrad across the valley. What followed was several years of ambush, siege, and at least one infamous trick — a warrior named Šárka, chained to a tree as bait, who lured a smitten commander named Ctirad and his men into a fatal ambush. The men eventually won, but the valley kept her name.",
      cz: "Podle pověsti se ženy z Libušina dvora, vedené bojovnicí Vlastou, po její smrti odmítly podřídit vládě Přemysla a vystavěly si vlastní pevnost Děvín, na hřebeni naproti Vyšehradu přes údolí. Následovalo několik let přepadů, obléhání a přinejmenším jednoho proslulého úskoku — bojovnice Šárka se nechala jako návnada přivázat ke stromu a do smrtelné léčky tak vlákala zamilovaného velitele Ctirada i jeho muže. Muži nakonec zvítězili, ale údolí si její jméno podrželo dodnes.",
      zh: "传说莉布谢死后，她宫廷中的女性——由女战士芙拉丝塔率领——拒绝接受普热米斯尔的统治，在山谷对岸、正对着维谢赫拉德的一道山脊上，修建了自己的堡垒德维恩。随后是长达数年的伏击与围攻，其中至少有一场臭名昭著的诡计：女战士沙尔卡自愿被锁在树上充当诱饵，引诱倾心于她的指挥官奇特拉德及其部下走入死亡陷阱。男人们最终获胜，但这道山谷至今仍沿用着她的名字。",
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
    ],
    wikipediaUrl:
      "https://en.wikipedia.org/wiki/D%C3%ADv%C4%8D%C3%AD_v%C3%A1lka",
  },
  {
    slug: "founding-of-vysehrad",
    era: "legends-origins",
    startYear: 725,
    year: "8th century by legend; 10th century by record",
    tone: "humorous",
    title: {
      en: "The Founding of Vyšehrad",
      cz: "Založení Vyšehradu",
      zh: "维谢赫拉德的建立",
    },
    hookLine: {
      en: "Legend says it's older than Prague Castle. The stones say: prove it.",
      cz: "Podle legendy je starší než Pražský hrad. Kameny na to říkají: dokažte to.",
      zh: "传说它比布拉格城堡还要古老。石头们表示：拿出证据来。",
    },
    summary: {
      en: "Nineteenth-century Czech tradition cast Vyšehrad as Libuše's original seat, older and grander than the castle her prophecy would later found — a claim that owes as much to Romantic-era nation-building (and one notorious forged manuscript) as to anything a medieval chronicler actually wrote. What the archaeological record actually confirms starts centuries later: Vyšehrad's first solid documentary trace is Duke Boleslav II minting coins there around 995, and its oldest still-standing building, the Rotunda of St. Martin, only went up around 1080. Between the legend and the ledger sits a very good rock outcrop that both sides can at least agree was worth building on.",
      cz: "Devatenácté století přisoudilo Vyšehradu roli Libušina původního sídla, staršího a velkolepějšího než hrad, který její proroctví později založilo — tvrzení, které vděčí spíš romantickému budování národa (a jednomu nechvalně proslulému padělanému rukopisu) než čemukoliv, co skutečně napsal některý středověký kronikář. To, co archeologie doopravdy potvrzuje, začíná o staletí později: první pevnou písemnou stopu Vyšehradu představuje ražba mincí knížete Boleslava II. kolem roku 995, a nejstarší dodnes stojící stavba, rotunda svatého Martina, vznikla až kolem roku 1080. Mezi legendou a listinou tak zbývá jedna vskutku dobrá skalní ostroha, na jejíž stavební hodnotě se ale obě strany shodnou.",
      zh: '19世纪的捷克传统把维谢赫拉德塑造成莉布谢最初的居所——比她预言中后来建立的城堡更古老、更宏伟——但这种说法与其说源自任何一位中世纪编年史家的真实记载，不如说更多归功于浪漫主义时代的民族建构（还有一份臭名昭著的伪造手稿）。考古记录真正能确认的历史，要晚上好几个世纪才开始：维谢赫拉德最早的确凿文献痕迹，是博莱斯拉夫二世公爵约在995年在此铸造钱币；而现存最古老的建筑——圣马丁圆形教堂——直到约1080年才建成。介于传说与账本之间的，是一处双方至少都同意"确实值得在此建造"的绝佳岩岬。',
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
    year: "874 (baptism) – 921 (martyrdom)",
    tone: "humorous",
    title: {
      en: "St. Ludmila — Christianization & Martyrdom",
      cz: "Svatá Ludmila — christianizace a mučednictví",
      zh: "圣鲁德米拉——基督教化与殉道",
    },
    hookLine: {
      en: "Bohemia's first Christian ruler was strangled with her own veil by her daughter-in-law.",
      cz: "Vlastní snacha uškrtila první křesťanskou vládkyni Čech jejím vlastním závojem.",
      zh: "波希米亚第一位信仰基督教的统治者，被自己的儿媳用她自己的头纱勒死。",
    },
    summary: {
      en: "Ludmila and her husband Bořivoj I were baptised around 874, reportedly by St. Methodius himself, making them the first Christian rulers of the Přemyslid line — a decision that put Bohemia formally on Christian Europe's map. It also made Ludmila a target: in 921, in a succession dispute with her daughter-in-law Drahomíra over the young Duke Wenceslas's upbringing, Ludmila was strangled at Tetín on Drahomíra's orders, becoming Bohemia's first native saint and — rather awkwardly for the family — its first political assassination on record.",
      cz: "Ludmila a její manžel Bořivoj I. přijali křest kolem roku 874, údajně z rukou samotného svatého Metoděje, čímž se stali prvními křesťanskými vládci přemyslovského rodu — rozhodnutím, které Čechy formálně zařadilo na mapu křesťanské Evropy. To z Ludmily zároveň udělalo terč: v roce 921, ve sporu o výchovu mladého knížete Václava, dala její snacha Drahomíra Ludmilu na Tetíně uškrtit. Ludmila se tak stala první domácí svatou v Čechách a — poněkud trapně pro rodinu — zároveň první doloženou politickou vraždou v jejích dějinách.",
      zh: "鲁德米拉与丈夫波日沃伊一世约在874年受洗——据说施洗者正是圣美多德本人——使他们成为普热米斯尔家族第一代信奉基督教的统治者，这一决定也让波希米亚正式跻身基督教欧洲的版图。但这也让鲁德米拉成为众矢之的：921年，在与儿媳德拉霍米拉就年幼的瓦茨拉夫公爵该由谁抚养的继承权之争中，鲁德米拉在德拉霍米拉的授意下于泰廷被人勒死，从而成为波希米亚本土第一位圣徒——同时也颇为尴尬地，成了这个家族史上有记载的第一起政治暗杀。",
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
    year: "935 (traditional date)",
    tone: "humorous",
    title: {
      en: "St. Wenceslas — The Good King and His Murder",
      cz: "Svatý Václav — dobrý kníže a jeho vražda",
      zh: "圣瓦茨拉夫——好公爵与他的谋杀案",
    },
    hookLine: {
      en: "The patron saint of a whole nation was killed by his own brother on his way to church.",
      cz: "Patrona celého národa zavraždil na cestě do kostela jeho vlastní bratr.",
      zh: "整个民族的守护圣人，在前往教堂的路上被自己的亲弟弟杀害。",
    },
    summary: {
      en: 'Duke Wenceslas I — grandson of Ludmila, raised partly by her, later immortalised in a Victorian Christmas carol as "Good King Wenceslas" — spent his short reign favouring the Church and an uneasy peace with the East Frankish kingdom, policies his brother Boleslav strongly disagreed with. In 935 (some historians argue 929), Boleslav had him murdered at the church door in Stará Boleslav, then spent the rest of his own long reign quietly rehabilitating his dead brother into Bohemia\'s patron saint — a franchise the country never let go of.',
      cz: 'Kníže Václav I. — vnuk Ludmily, jí samotnou zčásti vychovaný a později zvěčněný ve viktoriánské koledě jako „Good King Wenceslas" — během své krátké vlády upřednostňoval církev a křehký mír s Východofranskou říší, politiku, s níž jeho bratr Boleslav zásadně nesouhlasil. V roce 935 (podle některých historiků 929) nechal Boleslav bratra zavraždit u dveří kostela ve Staré Boleslavi — a zbytek své vlastní dlouhé vlády pak strávil tichým vylepšováním posmrtné pověsti mrtvého bratra na zemského patrona, značku, které se země od té doby nikdy nevzdala.',
      zh: '瓦茨拉夫一世公爵——鲁德米拉的孙子，部分由她抚养长大，后来在一首维多利亚时代的圣诞颂歌中被永远铭记为"好国王温塞斯拉斯"——在其短暂的统治期间偏向教会，并与东法兰克王国维持着一段并不牢靠的和平，而这些政策都遭到他弟弟博莱斯拉夫的强烈反对。935年（也有历史学家认为是929年），博莱斯拉夫在旧博莱斯拉夫的教堂门口派人将他杀害——此后，博莱斯拉夫用自己漫长统治的余下岁月，悄悄把这位亡兄塑造成波希米亚的守护圣人，而这个"人设"这个国家此后再也没有放弃过。',
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
