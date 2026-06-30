import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';

const locations = [
  {
    name: 'Chapel of St. Ludmila',
    slug: 'kaple-sv-ludmily',
    localizedNames: { cz: 'Kaple sv. Ludmily', zh: '圣鲁德米拉小教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.064376679756634, lng: 14.417050840915913 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Chapel of St. Ludmila (Kaple sv. Ludmily)!

This quietly unassuming chapel commemorates Bohemia's very first Christian martyr — St. Ludmila herself. She was the grandmother of Good King Wenceslas, the one from the Christmas carol, and the woman largely responsible for bringing Christianity into the Bohemian royal court. In 921 AD, she was strangled with a silk scarf at Tetín Castle on the orders of her own daughter-in-law, Drahomíra. Yes, this is tenth-century royal family drama at its most unrestrained — and it is entirely true.

The chapel is modest and unpretentious — no soaring Gothic spires, no gilded Baroque altars. But its quiet dignity is precisely the point: this was not built to impress tourists. It was built for believers, and it has served that purpose with unassuming grace ever since. Finding it feels like uncovering a private memory the city hasn't bothered to advertise.

🥚 Easter Egg: If you dig into the family history, St. Ludmila's son — the very same Good King Wenceslas — was later murdered by his own brother, Boleslaus the Cruel, in 935 AD. One family: two martyrs, one fratricide. Boleslaus went on to become a formidable ruler despite the deeply inauspicious start to his reign, earning the title "the Cruel" while simultaneously expanding Bohemian territory considerably. Prague has always been a city where the history is not just impressive — it is genuinely unhinged.`,

      cz: `Statečný dobrodruhu, vítej v Kapli sv. Ludmily!

Tato tichá a nenápadná kaplička uctívá první českou křesťanskou mučednici — sv. Ludmilu. Byla babičkou sv. Václava, toho z vánočních koled, a žena, která přinesla křesťanství do přemyslovského panovnického dvora. V roce 921 byla uškrcena hedvábným šátkem na hradě Tetín — na rozkaz vlastní snachy Drahomíry. Ano, tohle je dvorský intrikánský seriál z desátého století v plné kráse — a je to naprosto autentické.

Kaple samotná je skromná a nenápadná — žádné gotické věže, žádné zlacené barokní oltáře. Ale právě v té tichosti tkví její smysl: nebyla postavena pro turisty, ale pro věřící, a tuto službu vykonává s nenápadnou grácií dodnes. Najít ji je jako odhalit soukromou vzpomínku, o které se město neobtěžovalo říct světu.

🥚 Velikonoční vajíčko: Když se začtete do rodinné kroniky, zjistíte, že syn sv. Ludmily — sv. Václav I. — byl v roce 935 zavražděn vlastním bratrem Boleslavem Ukrutným. Jedna rodina: dva mučedníci, jeden bratrský vrah. Boleslav se navzdory temnému začátku vlády stal mocným panovníkem, získal přívlastek "Ukrutný" a přitom výrazně rozšířil české území. Praha vždy bývala místem, kde dějiny nejsou jen působivé — jsou skutečně nepředvídatelné.`,

      zh: `勇敢的冒险家，欢迎来到圣鲁德米拉小教堂（Kaple sv. Ludmily）！

这座安静伫立在布拉格街角的小礼拜堂，供奉的是波西米亚历史上第一位基督教女性殉道者——圣鲁德米拉。她是"好国王瓦茨拉夫"（那首著名圣诞颂歌里的主角）的亲祖母，也是将基督教文明带入波西米亚皇室的关键人物。公元921年，她在布拉格附近的捷克小城泰廷（Tetín），被自己的儿媳妇德拉戈米拉（Drahomíra）下令用丝绸领巾活活勒死。没错，这是一出彻彻底底的宫斗剧——而且是真实发生在公元十世纪的那种。

这座小教堂的建筑风格朴实无华——没有哥特式高塔，没有镀金的巴洛克祭坛。但这种低调本身就是它存在的意义：它不是为游客而建的，它是为信仰而生的，几百年来一直默默地履行着这个使命。能找到它，就像挖掘出一段这座城市懒得对外宣传的私密记忆。

🥚 彩蛋：如果你仔细翻阅捷克皇室的家族史，会发现圣鲁德米拉的儿子——也就是那位"好国王"瓦茨拉夫一世——后来在公元935年被自己的亲弟弟"残忍者"波列斯拉夫（Boleslaus the Cruel）暗杀。一个家庭，两位殉道者，一个弑兄者。而这位"残忍者"在开局如此不吉利的情况下，竟然还成为了一代雄主，大幅扩展了波西米亚的领土。布拉格就是这样一座城市：这里的历史不只是令人印象深刻——它还经常令人匪夷所思。`,
    },
  },
  {
    name: 'Chapel of St. Mary Magdalene',
    slug: 'kaple-sv-mari-magdaleny',
    localizedNames: { cz: 'Kaple svaté Maří Magdaleny', zh: '圣玛利亚·玛达肋纳小教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.09352328869457, lng: 14.415935612206784 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Chapel of St. Mary Magdalene (Kaple svaté Maří Magdaleny)!

In the crowded roll call of Christian saints, Mary Magdalene is arguably the most fascinating and most persistently misunderstood. She was the first witness to the Resurrection — a point all four Gospels agree on. She was then falsely labelled a prostitute for over a thousand years, thanks to a careless conflation by Pope Gregory I in 591 AD. The Vatican quietly corrected this error in 1969, which is the ecclesiastical equivalent of an extremely belated apology. Along the way, she became the patron saint of repentant sinners, fragrance merchants, and — yes, absolutely, this is real — hairdressers.

This chapel is modest and measured, just like its setting in a Prague neighbourhood with no interest in performing for visitors. It is the kind of place you might walk past a hundred times before you think to push open the door — and when you do, you find a stillness inside that feels entirely disproportionate to the small exterior. The kind of quiet that has been accumulating for a long time.

🥚 Easter Egg: The hairdresser connection deserves an explanation, because it is more coherent than it sounds. Mary Magdalene is associated in Scripture with precious ointments and fragrant oils — she is the woman who anointed Christ's feet. Over the centuries, "unguents" expanded in guild classification to include hair treatments and cosmetic preparations, and the medieval guild of perfumers and hairdressers adopted her as their patron. The logic holds up. The history of saints is full of occupational connections that seem absurd on the surface and perfectly sensible once you follow the thread. Next time you sit in a barber's chair, a quiet nod to the Magdalene is entirely historically appropriate.`,

      cz: `Statečný dobrodruhu, vítej v Kapli svaté Maří Magdaleny!

Na přeplněném seznamu křesťanských světců je Maří Magdalena pravděpodobně nejzajímavější a nejpřetrvaleji nepochopenou osobností. Byla první svědkyní Zmrtvýchvstání — v tom se shodují všechna čtyři evangelia. Poté byla více než tisíc let nesprávně označována za nevěstku díky neopatrnému ztotožnění ze strany papeže Řehoře I. v roce 591. Vatikán tuto chybu tiše opravil v roce 1969, což je církevní ekvivalent mimořádně opožděné omluvy. Mezitím se stala patronkou kajících se hříšníků, obchodníků s vonnými látkami a — ano, naprosto vážně — kadeřníků.

Tato kaple je skromná a tichá, stejně jako čtvrť kolem ní, která nemá zájem se předvádět před turisty. Je to místo, kolem kterého možná projdete stokrát, než vás napadne vstoupit — a když to uděláte, najdete uvnitř ticho, které se zdá být zcela nepřiměřené malému exteriéru. Ticho, které se tu střádá velmi dlouho.

🥚 Velikonoční vajíčko: Spojení s kadeřníky si zaslouží vysvětlení, protože je soudržnější, než to zní. Maří Magdalena je v Písmu spojena s vzácnými mastmi a vonnými oleji — je to ona, kdo pomazal Kristovy nohy. V průběhu staletí se "masti" rozšířily v cechovní klasifikaci na vlasové přípravky a kosmetiku a středověký cech parfumérů a kadeřníků si ji zvolil za patronku. Logika obstojí. Dějiny světců jsou plné profesních vazeb, které se na povrchu zdají absurdní, ale jsou zcela logické, jakmile sledujete nit. Příště, až budete sedět u holiče, tichý dík Magdaleně je naprosto historicky vhodný.`,

      zh: `勇敢的冒险家，欢迎来到圣玛利亚·玛达肋纳小教堂（Kaple svaté Maří Magdaleny）！

在基督教圣人名单的漫长花名册里，圣玛利亚·玛达肋纳大概是最迷人、也最持续被误解的一位。四部福音书都一致记载：她是第一个见证耶稣复活的人。然而，公元591年教皇格利高里一世在一篇布道中不小心把她和另外两个人物混为一谈，于是她被错误地扣上"妓女"帽子长达一千多年。梵蒂冈在1969年悄悄纠正了这个错误——这大概是教会历史上最迟到的道歉之一。与此同时，她成为了忏悔者、香料商人，以及——没错，千真万确——美发师的主保圣人。

这座小教堂朴实而安静，与它所在的布拉格街区的气质完全一致——这个街区对游客表演毫无兴趣。这是那种你可能路过一百次却从未推门进去的地方，直到某天你终于停下脚步，发现里面藏着一种与小小外观完全不成比例的宁静。一种已经积累了很久很久的寂静。

🥚 彩蛋："美发师主保圣人"这件事值得认真解释一下，因为它比听起来更合乎逻辑。《圣经》里，玛利亚·玛达肋纳与珍贵的膏油和香料关系密切——正是她用香膏抹了耶稣的脚。随着时间推移，中世纪行会体系里"膏脂"的定义逐渐扩大，涵盖了护发和美容用品，于是香料商和美发师行会共同将她奉为主保圣人。这条逻辑线其实相当清晰。圣人与职业之间的渊源往往乍看荒唐，一旦顺着线索追下去却合情合理。下次坐在理发椅上，向玛达肋纳微微点头致意，是完全有历史依据的。`,
    },
  },
  {
    name: 'Church of Our Lady on the Lawn',
    slug: 'church-of-our-lady-on-the-lawn',
    localizedNames: { cz: 'Kostel Panny Marie Na trávníčku', zh: '草坪上的圣母教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.06762389176457, lng: 14.421488182945064 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Church of Our Lady on the Lawn (Kostel Panny Marie Na trávníčku)!

In a city full of churches with grand and atmospheric names — Our Lady of the Snows, Our Lady Victorious, Our Lady before Týn — this one stands apart with a name of breathtaking modesty: Our Lady on the Lawn. Not on a mountain. Not above a river. Not under heaven's vault. Just on a nice, pleasant lawn. It is, without question, the most disarmingly unpretentious Marian dedication in Central Europe, and possibly in the whole of Catholic Europe.

The church in Nusle dates back to medieval origins, reworked and restored across the centuries as Prague's southern suburbs expanded and contracted around it. When it was named, there was presumably an actual lawn here — a green clearing at the edge of the settlement, where someone decided to place a chapel for the Virgin. The city has long since paved over whatever grass once grew here. Streets came, apartment blocks followed, tram lines arrived. But the name endured, and that is perhaps the most charming act of historical stubbornness in the whole of Prague: the lawn is gone, but the Lady remains standing on it.

🥚 Easter Egg: Prague has dozens of churches dedicated to the Virgin Mary, and their subtitles are miniature historical documents. Each one records a specific landscape feature, a miracle, a battle outcome, or a geographical quirk that no longer exists in visible form. "Na trávníčku" — on the small lawn — is urban memory compressed into a single phrase. The meadow is gone. The city swallowed it, as cities do. But the church kept the name, and so the grass survives in four syllables, as a very quiet act of defiance against forgetting. Look at a map of Prague and count the Marian churches — each name is a different lost world.`,

      cz: `Statečný dobrodruhu, vítej v Kostele Panny Marie Na trávníčku!

V městě plném kostelů s velkými a atmosférickými názvy — Panna Maria Sněžná, Panna Maria Vítězná, Panna Maria před Týnem — tento vyniká názvem dechberoucí skromnosti: Panna Maria Na trávníčku. Ne na hoře. Ne nad řekou. Ne pod nebeskou klenbou. Prostě na pěkném, milém trávníčku. Je to bezpochyby nejodzbrojující a nejnenáročnější mariánské zasvěcení ve střední Evropě, a možná v celé katolické Evropě.

Nuselský kostel má středověké kořeny a byl v průběhu staletí přestavován a obnovován, jak se pražské jižní předměstí kolem něj rozrůstalo a smršťovalo. Když dostával jméno, byl tu zřejmě skutečný trávník — zelená paseka na okraji osady, kde se někdo rozhodl umístit kapli pro Pannu Marii. Město dávno zabetonovalo vše, co tu kdysi rostlo. Přišly ulice, bytové domy, tramvajové linky. Ale název zůstal — a to je možná nejroztomilejší projev historické vzdorovitosti v celé Praze: trávník zmizel, ale Panna Maria na něm stále stojí.

🥚 Velikonoční vajíčko: Praha má desítky kostelů zasvěcených Panně Marii a jejich přívlastky jsou malými historickými dokumenty. Každý zaznamenává konkrétní terénní prvek, zázrak, výsledek bitvy nebo geografickou zvláštnost, která dnes již není viditelná. "Na trávníčku" je urbánní paměť stlačená do jediného slovního spojení. Louka zmizela. Město ji pohltilo, jak to města dělají. Ale kostel si ponechal název — a tak tráva přežívá ve třech slovech jako velmi tichý akt vzdoru proti zapomnění. Prohlédněte si mapu Prahy a sečtěte mariánské kostely — každý název je jiný ztracený svět.`,

      zh: `勇敢的冒险家，欢迎来到草坪上的圣母教堂（Kostel Panny Marie Na trávníčku）！

在布拉格这座满是宏伟教堂名字的城市里——雪中圣母、胜利圣母、提恩圣母——这座教堂以一个令人叹为观止的朴实名字独树一帜：草坪上的圣母。不是山上的，不是河边的，不是天穹之下的——就是在一片普普通通、绿草如茵的草坪上。毫无疑问，这是中欧，甚至整个天主教欧洲最不装腔作势的圣母玛利亚献堂命名，朴实得令人心动。

这座位于努斯尔（Nusle）区的教堂拥有中世纪的历史渊源，随着布拉格南部郊区数百年来的扩张与收缩，它几经修缮与重建。最初得名之时，这里大概真的有一片草地——聚落边缘的一块绿色空地，有人在这里为圣母建了一座小教堂。后来城市把这里的草地全部铺上了石板。街道来了，公寓楼来了，电车线路也来了。但那个名字留了下来——这大概是整个布拉格最动人的历史倔强：草坪消失了，但圣母依然站在那里。

🥚 彩蛋：布拉格有数十座以圣母玛利亚命名的教堂，而它们的副标题各个都是微型历史文献。每一个名字都记录着某个具体的地貌特征、某次奇迹、某场战役的结局，或者某个如今已不再可见的地理特征。"Na trávníčku"（草坪上）——这是城市记忆压缩在一个短语里的样子。草地消失了，被城市吞噬，就像所有城市都会吞噬过去一样。但教堂保住了这个名字，于是那片草在三个单词里继续存活，成为一场对抗遗忘的、非常安静的抵抗。打开布拉格地图，数一数所有供奉圣母的教堂——每一个名字，都是一个已经消失的世界。`,
    },
  },
  {
    name: 'Prague Crossroads',
    slug: 'prague-crossroads',
    localizedNames: { cz: 'Pražská křižovatka (Kostel sv. Anny)', zh: '布拉格十字路口（圣安妮教堂）' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.08496244393777, lng: 14.41603848951594 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Prague Crossroads — the former Church of St. Anne (Pražská křižovatka / Kostel sv. Anny)!

This fourteenth-century Gothic church has one of Prague's most extraordinary second acts. St. Anne's began in 1313 as a chapel attached to a Dominican convent in the Old Town. It survived the Hussite wars, navigated the Reformation, and was formally shut down by Emperor Joseph II during his sweeping dissolution of religious houses in the 1780s. After that came a period of secular use so varied it reads like a theatrical farce: printing house, storage, various workshops, and eventually — in the twenty-first century — a cultural centre named Prague Crossroads, hosting concerts, exhibitions, theatre, and events beneath vaulting that was put in place more than seven hundred years ago.

What makes this place genuinely extraordinary is not the transformation, but what survived it. The Gothic ribbed vaulting is essentially intact. The stone columns stand exactly as the medieval builders set them. The proportions of the nave are unchanged from when Dominican friars processed through them in the fourteenth century. Jazz fills the acoustics that once carried plainchant. The stone doesn't mind. If anything, the acoustics have improved with centuries of accumulated vibration.

🥚 Easter Egg: The name "Prague Crossroads" (Pražská křižovatka) is a deliberate cultural metaphor — křižovatka means both "crossroads" and "intersection." But the building itself truly IS a crossroads: the precise point where medieval Catholicism meets modern secular culture, where a Dominican convent becomes a concert hall, where thirteen-century foundations support a twenty-first-century programme. When you attend an event here, you are sitting at the intersection of seven hundred years of Praguers making the same space mean something different. That is either very profound or very Prague. Possibly both.`,

      cz: `Statečný dobrodruhu, vítej v Pražské křižovatce — bývalém Kostele sv. Anny!

Tento gotický kostel ze čtrnáctého století má jedno z nejpozoruhodnějších "druhých dějství" v Praze. Kostel sv. Anny vznikl v roce 1313 jako kaple přilehlá k dominikánskému klášteru ve Starém Městě. Přežil husitské války, proplul reformací a byl formálně uzavřen císařem Josefem II. při jeho rozsáhlém rušení klášterů v 80. letech 18. století. Poté následovalo období světského využití tak rozmanitého, že připomíná divadelní frašku: tiskárna, skladiště, různé dílny — a nakonec, ve 21. století, kulturní centrum Pražská křižovatka, pořádající koncerty, výstavy, divadlo a akce pod klenbami, které byly osazeny před více než sedmi sty lety.

Co dělá toto místo skutečně výjimečným, není ta proměna, ale to, co ji přežilo. Gotické žebrové klenby jsou v podstatě neporušeny. Kamenné sloupy stojí přesně tak, jak je zasadili středověcí stavitelé. Proporce lodi jsou nezměněny od dob, kdy jimi v procesích procházeli dominikánští řeholníci ve čtrnáctém století. Jazz nyní naplňuje akustiku, která kdysi nesla gregoriánský chorál. Kameni to nevadí. Akustika se možná dokonce zlepšila staletími akumulovaných vibrací.

🥚 Velikonoční vajíčko: Název "Pražská křižovatka" je záměrná kulturní metafora — křižovatka znamená jak "křižovatku", tak "průsečík". Ale samotná budova skutečně JE křižovatkou: přesné místo, kde se středověký katolicismus setkává s moderní světskou kulturou, kde se klášter dominikánů mění v koncertní sál, kde třináctistoleté základy nesou program jednadvacátého věku. Když tu sedíte na představení, sedíte na průsečíku sedmi set let Pražanů, kteří dávají tomuto prostoru stále nový smysl. To je buď velmi hluboké, nebo velmi pražské. Možná obojí.`,

      zh: `勇敢的冒险家，欢迎来到布拉格十字路口——前圣安妮教堂（Pražská křižovatka / Kostel sv. Anny）！

这座14世纪的哥特式教堂拥有布拉格最传奇的"第二幕"之一。圣安妮教堂建于1313年，最初是老城区一座多明我会修道院的附属礼拜堂。它熬过了胡斯战争，穿越了宗教改革，又在18世纪80年代被约瑟夫二世的大规模拆解修道院令正式关闭。此后迎来了五花八门的世俗用途——印刷厂、仓库、各种作坊……直到21世纪，它变成了今天的"布拉格十字路口"文化中心，在七百多年历史的拱顶下举办音乐会、展览、戏剧和各类活动。

这个地方真正令人叹为观止的，不是它的转型，而是在转型中留存下来的一切。14世纪的哥特式肋形拱顶基本完好无损。石柱依然屹立在中世纪工匠最初安置它们的位置。中殿的比例与14世纪多明我会修士列队穿行其间时完全相同。如今，爵士乐填满了曾经回荡着圣歌的声学空间。石头毫无怨言。事实上，经过几百年震动的积累，音响效果大概比以往任何时候都更好了。

🥚 彩蛋："布拉格十字路口"（Pražská křižovatka）这个名字是一个精心设计的文化隐喻——"křižovatka"在捷克语里同时意味着"十字路口"和"交汇点"。但这座建筑本身确实就是一个十字路口：中世纪天主教与现代世俗文化相遇的精确坐标，多明我会修道院变身音乐厅的历史节点，13世纪的地基承载21世纪的演出节目单的奇异现场。当你坐在这里观看一场演出，你正坐在700年布拉格人赋予同一空间不同意义的交汇处。这要么非常深刻，要么非常布拉格。也许两者皆是。`,
    },
  },
  {
    name: 'Church of St. Cyril and St. Methodius',
    slug: 'church-st-cyril-methodius-karlin',
    localizedNames: { cz: 'Kostel sv. Cyrila a Metoděje (Karlín)', zh: '圣西里尔和圣美多迪乌斯教堂（卡林）' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.09115935149362, lng: 14.448166189670882 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Church of St. Cyril and St. Methodius in Karlín (Kostel sv. Cyrila a Metoděje)!

Before you go further, there is one essential thing to establish: Prague has TWO churches dedicated to Saints Cyril and Methodius, and the one you are standing in front of right now is the quieter one — the one in Karlín. The other, on Resslova Street in the New Town, is the site of one of the most extraordinary moments of World War Two resistance in European history. In June 1942, Czechoslovak paratroopers Jozef Gabčík and Jan Kubiš — who had successfully assassinated SS-Obergruppenführer Reinhard Heydrich, the Nazi Protector of Bohemia and Moravia and one of the principal architects of the Holocaust — made their final stand against the Gestapo in the crypt of that church. They fought for hours. They did not surrender. The bullet holes are still in the walls.

This Karlín church tells a quieter story. Built in the second half of the nineteenth century as Karlín developed into one of Prague's expanding industrial suburbs, it presents a stately neoclassical face to the street. Karlín was devastated by a catastrophic Vltava flood in 1890 and spent much of the twentieth century as a working-class district, before reinventing itself in the 2000s as one of Prague's most fashionable neighbourhoods — all independent cafés, design studios, and repurposed industrial spaces. The church has watched all of it without comment.

🥚 Easter Egg: 🥚 You found it. Prague's twin-church secret is now yours to keep. The two churches share patron saints but almost nothing else. Go find the Cathedral of SS. Cyril and Methodius on Resslova Street in your collection — it has one of the most remarkable stories in Czech history, and the crypt is open to visitors. The bullet holes in the plaster are still there. The Gestapo dug through a wall trying to get in. History in Prague is not always in the past.`,

      cz: `Statečný dobrodruhu, vítej v Kostele sv. Cyrila a Metoděje v Karlíně!

Než budeme pokračovat, je třeba si ujasnit jednu zásadní věc: Praha má DVA kostely zasvěcené sv. Cyrilu a Metodějovi a ten, před kterým právě stojíš, je ten klidnější — v Karlíně. Ten druhý, na Resslově ulici na Novém Městě, je místem jednoho z nejpozoruhodnějších momentů protinacistického odboje v evropských dějinách druhé světové války. V červnu 1942 provedli českoslovenští parašutisté Jozef Gabčík a Jan Kubiš úspěšný atentát na SS-Obergruppenführera Reinharda Heydricha — říšského protektora Čech a Moravy a jednoho z hlavních architektů holocaustu — a poté se v kryptě toho kostela postavili na odpor gestapu. Hodiny bojovali. Nevzdali se. Díry od kulek jsou tam v omítce dodnes.

Karlínský kostel vypráví klidnější příběh. Postaven v druhé polovině devatenáctého století, jak Karlín vyrůstal v jedno z průmyslových předměstí Prahy, nabízí ulici vážnou neoklasicistní tvář. Karlín byl zdevastován katastrofální povodní Vltavy v roce 1890 a velkou část dvacátého století strávil jako dělnická čtvrť, než se v prvních desetiletích tohoto věku proměnil v jednu z nejmodernějších čtvrtí Prahy — plnou nezávislých kaváren, designových studií a přebudovaných průmyslových prostor. Kostel to vše sledoval mlčky.

🥚 Velikonoční vajíčko: 🥚 Našel jsi ho. Tajemství pražských kostelů-dvojčat je teď tvé. Oba kostely sdílejí patrony, ale téměř nic jiného. Najdi si v kolekci Katedrálu sv. Cyrila a Metoděje na Resslově ulici — má jeden z nejpozoruhodnějších příběhů v českých dějinách a krypta je přístupná veřejnosti. Díry od kulek v omítce jsou tam dosud. Gestapo prokopávalo zeď, aby se dostalo dovnitř. Dějiny v Praze nejsou vždy minulostí.`,

      zh: `勇敢的冒险家，欢迎来到圣西里尔与圣美多迪乌斯教堂（Kostel sv. Cyrila a Metoděje，卡林区）！

在继续之前，有一件事必须先说清楚：布拉格有两座供奉圣西里尔和圣美多迪乌斯的教堂，而你现在站的这座，是那个安静的、不那么出名的——卡林区的那座。另一座位于新城区的雷斯洛娃街（Resslova），是欧洲二战抵抗运动史上最惊心动魄的场景之一的发生地。1942年6月，捷克斯洛伐克伞兵约瑟夫·加布奇克（Jozef Gabčík）和扬·库比什（Jan Kubiš）成功刺杀了党卫军上将莱因哈德·海德里希（Reinhard Heydrich）——波西米亚和摩拉维亚的纳粹帝国保护官，大屠杀的主要策划者之一——随后在那座教堂的地下室里与盖世太保激战数小时。他们没有投降。那些弹孔至今仍留在墙上。

这座卡林区的教堂则讲述着一个平静得多的故事。它建于19世纪下半叶，是当时卡林区工业化扩张的产物，以新古典主义风格的庄重面孔面向街道。卡林区曾在1890年遭受伏尔塔瓦河的毁灭性洪灾，整个20世纪几乎都作为工人阶级区存在，直到21世纪初才开始华丽转身，变成如今布拉格最时髦的街区之一——独立咖啡馆、设计工作室和改造后的工业空间比比皆是。这座教堂沉默地目睹了这一切。

🥚 彩蛋：🥚 恭喜你找到了它。布拉格"双胞胎教堂"的秘密现在属于你了。两座教堂共享着同样的主保圣人，但几乎没有其他共同点。去你的收藏里找找雷斯洛娃街的圣西里尔与圣美多迪乌斯大教堂——那里有捷克历史上最惊心动魄的故事之一，地下室至今向公众开放。灰泥里的弹孔还在。盖世太保当年挖穿了一堵墙试图强行进入。在布拉格，历史并不总是已经过去的事。`,
    },
  },
  {
    name: 'Church of St. Ignatius',
    slug: 'kostel-sv-ignace',
    localizedNames: { cz: 'Kostel sv. Ignáce', zh: '圣依纳爵教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.07553970033452, lng: 14.420762256478337 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Church of St. Ignatius (Kostel sv. Ignáce)!

Standing at the corner of Karlovo náměstí — Charles Square, the largest square in Prague, which most visitors incorrectly assume is smaller than Old Town Square — this Baroque church radiates the quiet, unshakeable authority of an institution that has been occupying prime real estate since 1671. It was built by the Jesuits, for the Jesuits, and dedicated to their founder Ignatius of Loyola: Spanish soldier, mystic, and architect of perhaps the most strategically sophisticated religious organisation in the history of Western Christianity.

The Jesuits — formally the Society of Jesus, informally "God's soldiers" — were the Catholic Church's elite Counter-Reformation force. They founded universities, ran schools with unprecedented rigour, sent missionaries to every corner of the globe, and in Prague, they simultaneously took over Charles University, built the Klementinum library complex in the Old Town (the largest Baroque complex in Central Europe), and constructed this church in the New Town. In the space of a century, they occupied every significant intellectual and spiritual high ground in the city. If they were operating today, they would be running the most formidable consulting firm in Europe, with an unbeatable publication record.

The interior is Jesuit Baroque at its most considered: ornate but orderly, grand but never chaotic. Every detail is calibrated for maximum spiritual impact — ceiling frescoes, marble columns, golden altars, a facade that makes no apologies. This is not a church that happened by accident. This is a carefully engineered encounter with the divine.

🥚 Easter Egg: Charles Square has its own overlooked history. In the Middle Ages, Emperor Charles IV used this square to display the imperial crown jewels and royal relics — fragments of the True Cross, the Holy Lance — once a year, drawing tens of thousands of pilgrims from across Bohemia and beyond. The annual relic show on Karlovo náměstí was, in the fourteenth century, the single most-attended event in Prague. The Jesuits later built their church on the same square where medieval crowds had gathered to glimpse the sacred. The audience changed; the instinct remained.`,

      cz: `Statečný dobrodruhu, vítej v Kostele sv. Ignáce!

Stojí v rohu Karlova náměstí — největšího náměstí v Praze, které většina návštěvníků nesprávně považuje za menší než Staroměstské — a vyzařuje tichou, neotřesitelnou autoritu instituce, která zde zaujímá prémiovou polohu od roku 1671. Postavili ho jezuité, pro jezuity, a zasvětili ho jejich zakladateli Ignáci z Loyoly: španělskému vojákovi, mystikovi a architektovi snad nejstrategičtěji sofistikované náboženské organizace v dějinách západního křesťanství.

Jezuité — formálně Tovaryšstvo Ježíšovo, neformálně "Boží vojáci" — byli elitní protireklamační silou katolické církve. Zakládali univerzity, provozovali školy s dosud nevídanou důkladností, vysílali misionáře do každého koutu světa a v Praze si zároveň přisvojili Karlovu univerzitu, vybudovali ve Starém Městě knihovní komplex Klementinum (největší barokní komplex ve střední Evropě) a na Novém Městě postavili tento kostel. Za jedno století obsadili každou významnou intelektuální a duchovní výšinu ve městě. Kdyby působili dnes, provozovali by nejobávanější poradenskou firmu v Evropě s nepřekonatelným publikačním rejstříkem.

Interiér je jezuitské baroko ve své nejpromyšlenější podobě: zdobný, ale uspořádaný, vznešený, ale nikdy chaotický. Každý detail je kalibrován pro maximální duchovní dopad — stropní fresky, mramorové sloupy, zlaté oltáře, průčelí, které se za nic neomlouvá. Tento kostel nevznikl náhodou. Je to precizně navržené setkání s božským.

🥚 Velikonoční vajíčko: Karlovo náměstí má svou vlastní přehlíženou historii. Ve středověku tu císař Karel IV. jednou ročně vystavoval říšské korunovační klenoty a královské relikvie — úlomky Pravého kříže, Svaté kopí — a přitahoval desetitisíce poutníků z celých Čech i ze zahraničí. Každoroční přehlídka relikvií na Karlově náměstí byla ve čtrnáctém století nejnavštěvovanější akcí v Praze. Jezuité poté postavili svůj kostel na témže náměstí, kde se středověké davy shromažďovaly, aby spatřily posvátné. Publikum se změnilo; instinkt zůstal.`,

      zh: `勇敢的冒险家，欢迎来到圣依纳爵教堂（Kostel sv. Ignáce）！

这座巴洛克风格的教堂矗立在卡洛广场（Karlovo náměstí）的一角——这是布拉格最大的广场，但大多数游客都误以为它比老城广场小——以一种低调而不可撼动的威严感俯视着周围的一切。自1671年起，它便在这里占据着绝佳位置，由耶稣会出资兴建，献给他们的创始人圣依纳爵·罗耀拉：西班牙士兵、神秘主义者，以及大概是整个西方基督教历史上最具战略头脑的宗教组织的设计者。

耶稣会——正式名称"耶稣会士"（Societas Iesu），绰号"上帝的士兵"——是罗马天主教会在宗教改革时期的精英反击力量。他们创建大学，以前所未有的严格标准运营学校，向全球每个角落派遣传教士；而在布拉格，他们一手接管了查理大学，在老城区建造了克莱门汀图书馆综合体（中欧最大的巴洛克建筑群），又在新城区建了这座教堂。在不到一个世纪的时间里，他们占领了这座城市所有重要的知识与精神制高点。如果他们活在今天，绝对会经营欧洲最令人生畏的咨询公司，并拥有无可匹敌的学术发表记录。

教堂内部是耶稣会巴洛克风格的极致体现：华丽而有秩序，宏大却从不混乱。每一个细节都经过精确校准以达到最大程度的精神感染力——天顶壁画、大理石圆柱、金色祭坛，以及一个毫不道歉的正面外立面。这不是一座偶然出现的教堂，这是一场精心设计的与神圣相遇的体验。

🥚 彩蛋：卡洛广场本身也有一段被忽略的历史。中世纪时，皇帝卡尔四世（Karl IV）每年在这里公开展示帝国王冠珠宝和皇家圣物——真十字架碎片、圣矛——每次都吸引来自波西米亚各地乃至更远处的数万名朝圣者。14世纪，卡洛广场年度圣物展是布拉格全年人气最旺的活动，没有之一。耶稣会后来将教堂建在同一座广场上，那里曾是中世纪人群聚集凝望神圣之物的地方。观众换了，本能没有变。`,
    },
  },
  {
    name: 'Military Church of St. John of Nepomuk',
    slug: 'vojenskyy-kostel-sv-jana-nepomuckeho',
    localizedNames: { cz: 'Vojenský kostel sv. Jana Nepomuckého', zh: '圣约翰·内波穆克军事教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.09030537376589, lng: 14.393533321409436 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Military Church of St. John of Nepomuk (Vojenský kostel sv. Jana Nepomuckého)!

In Prague, St. John of Nepomuk is absolutely inescapable. His gilded statue stands sentinel on Charles Bridge — the most famous of the thirty-odd statues lining the bridge, worn smooth by the hands of centuries of people touching it for luck. His image appears in historical buildings across Bohemia. His name marks churches, chapels, roadside shrines, and institutions across Central Europe. And here, the Czech military has formally adopted him as a patron — which, on reflection, is a choice with a very specific and rather dark logic.

In 1393, Jan of Nepomuk was the confessor of Queen Sophia of Bohemia. King Wenceslas IV, suspecting his wife of infidelity, demanded that Jan reveal the contents of her confessions. Jan refused, repeatedly and absolutely. The king had him tortured and thrown off Charles Bridge into the Vltava. He died rather than betray a secret entrusted to him. He was canonised in 1729, and became the patron of bridges, of confessors, and of everyone whose work demands absolute, unwavering discretion. The military, as it turns out, has always had considerable use for people who will not talk under pressure.

The church itself is a well-proportioned example of Neo-Baroque military architecture — functional rather than extravagant, disciplined in its decoration, with the restrained aesthetic of an institution that means business.

🥚 Easter Egg: The canonisation of St. John of Nepomuk comes with a twist that even most Czechs have never heard. When his remains were examined in 1719 as part of the beatification process, a remarkably preserved piece of soft tissue was discovered inside his skull. It was solemnly declared to be his tongue — miraculously preserved by God as a sign of the faithful silence that had cost him his life. This discovery became famous across Catholic Europe and was a decisive factor in his canonisation in 1729. However, twentieth-century scientific analysis — using modern tissue identification methods — revealed that the preserved tissue was not a tongue at all. It was a fragment of brain matter. The miracle of silence was real. The organ being honoured was wrong. History in Prague is almost always more complicated than the legend.`,

      cz: `Statečný dobrodruhu, vítej ve Vojenském kostele sv. Jana Nepomuckého!

V Praze je sv. Jan Nepomucký naprosto všudypřítomný. Jeho pozlacená socha stojí na stráži na Karlově mostě — nejslavnější z více než třiceti soch lemujících most, ohlazenou rukama staletí lidí, kteří se jí dotýkají pro štěstí. Jeho podoba se objevuje v historických budovách po celých Čechách. Jeho jméno zdobí kostely, kaple, přícestné kapličky a instituce po celé střední Evropě. A česká armáda ho zde formálně přijala za patrona — což je po zamyšlení volba s velmi specifickou a poněkud temnou logikou.

V roce 1393 byl Jan Nepomucký zpovědníkem české královny Žofie. Král Václav IV., podezřívající manželku z nevěry, požadoval, aby Jan prozradil obsah jejích zpovědí. Jan odmítl — opakovaně a absolutně. Král ho nechal mučit a shodil z Karlova mostu do Vltavy. Zemřel, místo aby zradil jemu svěřené tajemství. Byl kanonizován v roce 1729 a stal se patronem mostů, zpovědníků a všech, jejichž práce vyžaduje absolutní, neochvějnou diskrétnost. Ukázalo se, že armáda vždy měla značné uplatnění pro lidi, kteří nepromluví pod tlakem.

Kostel sám je dobře proporcionálním příkladem novobarokní vojenské architektury — funkční spíše než extravagantní, ukázněný v dekoraci, s podrženou estetikou instituce, která to myslí vážně.

🥚 Velikonoční vajíčko: Kanonizace sv. Jana Nepomuckého má zvrat, který většina Čechů nikdy neslyšela. Když byly jeho ostatky v roce 1719 zkoumány v rámci beatifikačního procesu, byl v jeho lebce objeven pozoruhodně zachovalý kousek měkkého tkáně. Byl slavnostně prohlášen za jeho jazyk — zázračně uchovaný Bohem jako znamení věrného mlčení, které ho stálo život. Tento objev se proslavil po celé katolické Evropě a byl rozhodujícím faktorem jeho kanonizace v roce 1729. Vědecká analýza ve dvacátém století — s použitím moderních metod identifikace tkání — však odhalila, že uchovaná tkáň nebyla jazyk. Byl to fragment mozkové tkáně. Zázrak mlčení byl skutečný. Uctívaný orgán byl špatný. Dějiny v Praze jsou téměř vždy složitější než legenda.`,

      zh: `勇敢的冒险家，欢迎来到圣约翰·内波穆克军事教堂（Vojenský kostel sv. Jana Nepomuckého）！

在布拉格，圣约翰·内波穆克（Jan Nepomucký）简直无处不在。他的镀金雕像在查理大桥上日夜守望——那是桥上三十余座雕像中最著名的一座，被数百年来无数人伸手触摸求福而磨得锃亮。他的画像出现在波西米亚各地的历史建筑角落。他的名字标记着中欧各处的教堂、礼拜堂、路边小神龛和各类机构。而在这里，捷克军队正式将他奉为主保圣人——仔细想来，这是一个有着非常具体、且相当黑暗逻辑的选择。

1393年，扬·内波穆克是波西米亚王后索菲亚（Queen Sophia）的告解神父。国王瓦茨拉夫四世怀疑王后不忠，要求扬透露她的告解内容。扬拒绝了——多次、彻底地拒绝了。国王下令对他施以酷刑，随后将他从查理大桥推入伏尔塔瓦河。他宁死也不出卖托付给他的秘密。1729年，他被封为圣人，成为桥梁、告解神父，以及所有工作需要绝对、坚定不移之守口如瓶的人的主保圣人。军队——事实证明——历来对那些在压力下不会开口的人有着极大的需求。

教堂本身是新巴洛克军事建筑的精良范本——功能性重于装饰性，装饰手法克制有度，透着一种认真做事的机构特有的内敛美学。

🥚 彩蛋：圣约翰·内波穆克的封圣过程有一个鲜为人知的转折，连大多数捷克人都没听说过。1719年，在他的遗体作为宣福调查的一部分被检查时，人们在他的颅骨内发现了一块保存异常完好的软组织。它被庄严地宣布为他的舌头——上帝神迹地保全了这位以守密之诺为代价丧命之人的言语器官。这一发现轰动了整个天主教欧洲，成为1729年封圣进程的决定性因素。然而，20世纪的科学分析——运用现代组织鉴定方法——揭示那块软组织根本不是舌头，而是一片大脑组织。守秘的奇迹是真实的。被供奉的器官搞错了。在布拉格，历史几乎永远比传说更加复杂。`,
    },
  },
  {
    name: 'Church of St. Joseph (Náměstí Republiky)',
    slug: 'kostel-sv-josefa-namesti-republiky',
    localizedNames: { cz: 'Kostel sv. Josefa (Náměstí Republiky)', zh: '圣约瑟夫教堂（共和国广场）' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.08873720936536, lng: 14.429058091414316 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Church of St. Joseph at Náměstí Republiky (Kostel sv. Josefa)!

You are standing in one of the most improbable hiding places in all of Prague. Between the Municipal House — a magnificent Art Nouveau palace that took seventeen years to build and has been photographed roughly a billion times — and the Powder Tower, one of the city's most recognisable Gothic landmarks, someone managed to tuck a complete seventeenth-century Baroque church and have it go almost entirely unnoticed. The Church of St. Joseph was built by the Discalced Carmelites between 1636 and 1651, during the height of the Counter-Reformation push to recatholicise Bohemia. The Carmelites were a contemplative order — one that valued inner quiet over outward display. Building between two extremely loud architectural neighbours may, on reflection, have been their most meditative accomplishment.

The interior rewards the visitor who actually stops to look. The proportions are calm and unhurried, the light through the windows falls exactly as Baroque architects intended it to fall, and the whole thing has an atmosphere of serious quiet that is hard to find anywhere in this quarter. Outside, tourists queue for the Municipal House café. In here, the seventeenth century continues without them.

🥚 Easter Egg: St. Joseph is one of the most versatile patron saints in Catholicism — his portfolio includes carpenters, fathers, immigrants, workers, unborn children, house hunters, a happy death, and the Universal Church itself. This broad jurisdiction is largely the result of Pope Pius IX officially declaring him Patron of the Universal Church in 1870. Historically, Joseph gets relatively little narrative space in the Gospels — he says nothing at all in most accounts. For a saint who has accumulated this much institutional power in silence, the Carmelite church may be exactly the right setting.`,

      cz: `Statečný dobrodruhu, vítej v Kostele sv. Josefa na Náměstí Republiky!

Stojíš na jednom z nejnepravděpodobnějších úkrytů v celé Praze. Mezi Obecním domem — nádherným secesním palácem, jehož stavba trvala sedmnáct let a byl vyfotografován přibližně miliardkrát — a Prašnou bránou, jednou z nejznámějších gotických dominant města, se někdo rozhodl vmáčknout celý barokní kostel ze sedmnáctého století a přimět ho, aby unikal téměř veškeré pozornosti. Kostel sv. Josefa byl postaven karmelitány bosými v letech 1636 až 1651, v době vrcholu protireformačního úsilí o rekatolizaci Čech. Karmelitáni byli kontemplativní řád — takový, který si cenil vnitřního klidu nad vnějšími projevy. Stavba mezi dvěma mimořádně hlučnými architektonickými sousedy mohla být, při zpětném zamyšlení, jejich nejmeditativnějším počinem.

Interiér odmění návštěvníka, který se skutečně zastaví a podívá. Proporce jsou klidné a neuspěchané, světlo procházející okny dopadá přesně tak, jak to barokní architekti zamýšleli, a celý prostor má atmosféru vážného ticha, které je v této čtvrti těžko k nalezení. Venku turisté čekají ve frontě před kavárnou Obecního domu. Tady uvnitř sedmnácté století pokračuje bez nich.

🥚 Velikonoční vajíčko: Sv. Josef je jedním z nejuniverzálnějších patronů v katolictví — jeho portfolio zahrnuje tesaře, otce, přistěhovalce, dělníky, nenarozené děti, hledače domovů, šťastnou smrt a Všeobecnou církev. Toto záštitnictví je z velké části výsledkem prohlášení papeže Pia IX., který ho v roce 1870 vyhlásil za Patrona Všeobecné církve. Historicky dostává Josef v evangeliích relativně málo prostoru — ve většině zpráv neříká vůbec nic. Pro světce, který si v mlčení nashromáždil tolik institucionální moci, může být karmelitánský kostel tím nejsprávnějším místem.`,

      zh: `勇敢的冒险家，欢迎来到共和国广场的圣约瑟夫教堂（Kostel sv. Josefa）！

你现在站在布拉格最不可思议的藏身之处之一。市政厅（Obecní dům）——那座建造历时17年、被拍摄过大约十亿次的壮丽新艺术风格宫殿——与火药塔（Prašná brána）这座城市最标志性的哥特式地标之间，有人硬生生塞进了一整座17世纪的巴洛克教堂，并让它几乎被所有人忽视。圣约瑟夫教堂由赤足加尔默罗会（Discalced Carmelites）于1636年至1651年间兴建，正值反宗教改革将波西米亚重新天主教化的高峰时期。加尔默罗会是一个沉思默想的修道会——重视内在宁静胜过外在展示。事后回想，把教堂建在两座极为喧嚣的建筑邻居之间，或许是他们最具冥想精神的成就。

推开门走进去，对于真正停下脚步打量的游客来说是一种奖赏。比例平静而从容，阳光透过窗户投下巴洛克建筑师心中预想的光线，整个空间弥漫着一种严肃的寂静，在这个街区几乎难以寻觅。外面，游客们在市政厅咖啡馆门口排队。这里，17世纪继续运转，与他们无关。

🥚 彩蛋：圣约瑟夫是天主教里职责最多元的主保圣人之一——他的保护范围涵盖木匠、父亲、移民、工人、未出生的孩子、找房子的人、善终，以及整个普世教会。这种宽泛的守护职责，很大程度上源于1870年教宗庇护九世正式宣布他为普世教会主保圣人。从历史上看，约瑟夫在《福音书》里出场机会相当有限——在大多数记载中他一言不发。对于这样一位在沉默中积累了如此之多机构权力的圣人来说，加尔默罗会的教堂或许正是最合适的归宿。`,
    },
  },
  {
    name: 'Cathedral of St. Catherine of Alexandria',
    slug: 'chram-sv-kateriny',
    localizedNames: { cz: 'Chrám sv. Kateřiny Alexandrijské', zh: '亚历山大的圣凯瑟琳大教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.07364819042929, lng: 14.425415567982796 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Cathedral of St. Catherine of Alexandria (Chrám sv. Kateřiny Alexandrijské)!

This church was founded in 1355 by Emperor Charles IV — the same king responsible for Charles Bridge, Charles University, and Charles Square, and who appears to have been constitutionally unable to name anything after anyone other than himself. The original foundation was an Augustinian monastery, and the distinctive octagonal tower that rises above the surrounding rooflines has been a navigational landmark in this part of the New Town for over six centuries. The Gothic interior was substantially reworked in the Baroque period, accumulating the layered atmosphere of a building continuously used and modified by different hands across seven hundred years.

The church's patron saint deserves special attention. Catherine of Alexandria is among the most celebrated early Christian martyrs, despite the fact that historians have been unable to verify her existence with any certainty. According to tradition, she was a fourth-century philosopher and princess who converted fifty pagan scholars sent by Emperor Maxentius to argue her out of her faith. He condemned her to death by breaking wheel — but the wheel shattered on contact with her. They beheaded her instead. She became patron of philosophers, theologians, and wheelwrights.

🥚 Easter Egg: The breaking wheel that failed to execute Catherine of Alexandria is the direct origin of the Catherine Wheel — the spinning firework that showers sparks in rotating spirals. The firework was named after the instrument of her failed martyrdom, which was subsequently adopted as her iconographic symbol. So every time a Catherine Wheel goes off at a fireworks display, it is commemorating a fourth-century torture device that broke against the will of a saint who probably did not exist. Fireworks tradition contains an unusual amount of martyrological content if you look closely enough.`,

      cz: `Statečný dobrodruhu, vítej v Chrámu sv. Kateřiny Alexandrijské!

Tento kostel byl v roce 1355 založen císařem Karlem IV. — tím samým králem, který stojí za Karlovým mostem, Karlovou univerzitou a Karlovým náměstím a který zřejmě nebyl schopen pojmenovat cokoli po komkoli jiném než po sobě. Původní základ byl augustiniánský klášter a výrazná osmiboká věž, tyčící se nad okolními střechami, slouží jako orientační bod v této části Nového Města déle než šest století. Gotický interiér byl výrazně přepracován v baroku a nashromáždil vrstvené ovzduší budovy, která byla nepřetržitě upravována různými rukama po sedm set let.

Patronka kostela si zaslouží zvláštní pozornost. Kateřina Alexandrijská patří k nejslavnějším raněkřesťanským mučednicím, přestože historici nedokázali její existenci věrohodně ověřit. Podle tradice byla filozofkou a princeznou čtvrtého století, která obrátila padesát pohanských vzdělanců, jež k ní císař Maxentius poslal, aby ji přiměli vzdát se víry. Odsoudil ji k lámání kolem — ale kolo se při kontaktu s ní roztříštilo. Místo toho ji sťali. Stala se patronkou filozofů, teologů a kolářů.

🥚 Velikonoční vajíčko: Lámací kolo, které nedokázalo popravit Kateřinu Alexandrijskou, je přímým původem "Kateřinského kola" — rotujícího ohňostroje, který rozstřikuje jiskry v točivých spirálách. Ohňostroj byl pojmenován přímo po nástroji jejího ztroskotaného mučednictví, který byl následně přijat jako její ikonografický symbol. Takže pokaždé, když Kateřinské kolo vzlétne na ohňostrojovém večírku, připomíná mučicí zařízení ze čtvrtého století, které se zlomilo vůlí světice, jež pravděpodobně neexistovala. Tradice ohňostrojů obsahuje překvapivě velké množství martyrologického obsahu, pokud se na ni podíváte dostatečně blízko.`,

      zh: `勇敢的冒险家，欢迎来到亚历山大的圣凯瑟琳大教堂（Chrám sv. Kateřiny Alexandrijské）！

这座教堂由皇帝卡尔四世（Karel IV.）于1355年建立——就是那位同时修建了查理大桥、创办了查理大学、设计了卡洛广场，并且似乎真的无法将任何东西以别人名字命名的国王。最初是奥斯定（Augustinian）修道院，催生了那座高耸于周围屋顶之上的独特八角形塔楼，六个多世纪以来一直是新城这片区域的地标。哥特式内部在巴洛克时期经历了大规模改建，积累了一种层叠复杂的氛围——这是一座被七百年间不同时代持续使用与改造的建筑所特有的气质。

这座教堂的主保圣人值得特别介绍。亚历山大的圣凯瑟琳是最著名的早期基督教殉道者之一，尽管历史学家无法以任何历史确定性证实她的真实存在。根据传说，皇帝马克西米努斯派来劝她放弃信仰的50位异教学者，反被她全部说服改宗。皇帝随后判她以车轮刑处死——但那个轮子一接触到她就神奇地碎裂了。最终改为砍头。她成为哲学家、神学家和车轮匠的主保圣人。

🥚 彩蛋：那个没能处死亚历山大的圣凯瑟琳的碾刑轮，正是"凯瑟琳轮"（Catherine Wheel）烟火的直接命名来源——那种在空中旋转、四处飞溅火花的螺旋形烟火。这种烟火直接以她未遂的殉道刑具命名，而那个刑具后来也成为了她的圣像标志。所以每当一支凯瑟琳轮在烟火秀上升空，它在纪念的是一件四世纪的刑讯器具——它被一位可能从未存在过的圣人的意志击碎了。仔细审视，烟火传统包含着相当多的殉道学内容。`,
    },
  },
  {
    name: 'Church of St. Lawrence (Malá Strana)',
    slug: 'kostel-sv-vavrence-mala-strana',
    localizedNames: { cz: 'Kostel sv. Vavřince (Malá Strana, Hellichova)', zh: '圣劳伦斯教堂（小城区）' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.0845052002624, lng: 14.403720971163557 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Church of St. Lawrence in Malá Strana (Kostel sv. Vavřince, Hellichova)!

Malá Strana — the Lesser Town — sits beneath Prague Castle with the compact self-assurance of a neighbourhood that knows it is standing on prime real estate and has no intention of leaving. Baroque palaces share space with embassies, wine bars, and cobblestoned streets that have not substantially changed their course in five hundred years. Tucked into Hellichova Street, the Church of St. Lawrence is a smaller, quieter presence in a neighbourhood where most buildings are making considerably larger architectural statements. That modesty is part of its appeal. In a district of palaces, a modest church is its own kind of landmark.

St. Lawrence — in Czech, sv. Vavřinec — was a deacon of the early church martyred in Rome in 258 AD under Emperor Valerian. He was executed by being roasted alive on a large iron gridiron over burning coals. According to a tradition that is either deeply moving or deeply improbable (possibly both), he reportedly said to his executioners, after some time on the grill: "Turn me over — I'm done on this side." He is patron of cooks, comedians, and brewers, on the basis that all three occupations require managing intense heat and maintaining composure under pressure.

🥚 Easter Egg: St. Lawrence's gridiron became his standard iconographic attribute — he is almost always depicted carrying the instrument of his martyrdom, which in his case doubles as kitchen equipment. This means that in Baroque paintings across European museums, you will repeatedly encounter a composed, robed figure carrying what looks like a barbecue grill. His feast day, August 10th, coincides in Central Europe with meteor shower season. Medieval Christians called the August Perseids "the Tears of St. Lawrence," and the name has never entirely gone away.`,

      cz: `Statečný dobrodruhu, vítej v Kostele sv. Vavřince v Malé Straně (Hellichova)!

Malá Strana leží pod Pražským hradem s kompaktní sebejistotou čtvrti, která ví, že stojí na prémiovém pozemku a nemá v úmyslu nikam odcházet. Barokní paláce sdílejí prostor s ambasádami, vinotékami a dlážděnými ulicemi, které svůj průběh nijak podstatně nezměnily za pět set let. Kostel sv. Vavřince ukrytý v Hellichově ulici je menší, tišší přítomností ve čtvrti, kde většina budov vydává architektonicky hlasitá prohlášení. Tato skromnost je součástí jeho kouzla. V okrese plném paláců je skromný kostel svým vlastním druhem dominanty.

Sv. Vavřinec byl jáhnem rané církve umučeným v Římě v roce 258 po Kr. za císaře Valeriana. Byl popraven živým opékáním na velkém železném roštu nad hořícím uhlím. Podle tradice, která je buď hluboce dojemná, nebo hluboce nepravděpodobná (možná obojí), prý po nějaké době na roštu řekl svým popravčím: "Otočte mě — z té strany jsem hotový." Je patronem kuchařů, komiků a pivovarníků, neboť všechna tři povolání vyžadují zvládání intenzivního tepla a zachování klidu pod tlakem.

🥚 Velikonoční vajíčko: Rošt sv. Vavřince se stal jeho standardním ikonografickým atributem — je téměř vždy zobrazován s nástrojem svého mučednictví, který v jeho případě slouží zároveň jako kuchyňské vybavení. To znamená, že v barokních obrazech napříč evropskými muzei budete opakovaně narazit na klidnou, zarobenou postavu nesoucí to, co vypadá jako grilovací rošt. Jeho svátek 10. srpna splývá ve střední Evropě se sezónou meteorického roje. Středověcí křesťané nazývali srpnový roj Perzeidy "Slzy sv. Vavřince" — název, který nikdy zcela nevymizel.`,

      zh: `勇敢的冒险家，欢迎来到小城区的圣劳伦斯教堂（Kostel sv. Vavřince，赫利霍娃街）！

小城区（Malá Strana）依傍在布拉格城堡脚下，带着一种紧凑的自信——这里的居民深知自己站在黄金地段，毫无搬走的念头。巴洛克宫殿与大使馆、葡萄酒吧并肩而立，鹅卵石铺就的街道五百年来几乎没有改变走向。这座位于赫利霍娃街（Hellichova）的圣劳伦斯教堂，在一个大多数建筑都在发出相当宏大建筑宣言的街区里，是一个更小巧、更安静的存在。这种谦逊恰恰构成了它的魅力。在一个到处都是宫殿的街区里，一座朴实的教堂本身就是一种地标。

圣劳伦斯——捷克语称"sv. Vavřinec"——是早期教会的一位助祭，公元258年在罗马皇帝瓦勒良（Valerian）统治下殉道。他被活活烤在一个大铁格栅上，下面燃着炭火。根据一个或深刻或荒诞（也许两者兼而有之）的传说，他在烤架上烤了一段时间后，据说对行刑者说："把我翻个面——这一面熟了。"他是厨师、喜剧演员和啤酒酿造者的主保圣人，因为这三种职业都需要在极端高温下保持沉着冷静。

🥚 彩蛋：圣劳伦斯的铁格栅成为他标准的圣像学标志——他几乎总是被描绘成手持殉道刑具的形象，而他的刑具恰好也兼具厨房设备功能。这意味着，在欧洲各地博物馆收藏的巴洛克油画里，你会反复看到一个神情平静的人物，手里提着看上去像烤架的东西。8月10日是他的瞻礼日，在中欧许多地方，这个日期恰逢流星雨季节。中世纪基督徒将八月的英仙座流星雨称为"圣劳伦斯之泪"，这个名字至今从未完全消失。`,
    },
  },
  {
    name: 'Church of St. Matthew',
    slug: 'kostel-sv-mateje',
    localizedNames: { cz: 'Kostel sv. Matěje', zh: '圣马太教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.11324187497204, lng: 14.377497748200899 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Church of St. Matthew (Kostel sv. Matěje)!

Dejvice is Prague's version of a well-ordered European residential district — wide avenues, embassies behind iron fences, a roundabout that causes traffic confusion roughly once per minute, and apartment blocks that carry themselves with the quiet dignity of the First Republic era. The Church of St. Matthew sits in this neighbourhood without architectural drama, serving a community that has been using it continuously since it was built. This is not Prague's most famous church. It does not need to be. Most of the world's churches were built for the people who actually live near them, and this one has been doing exactly that for a long time.

St. Matthew has a professional history that makes him uniquely interesting among the apostles. Before his conversion, he was a tax collector — specifically, a collector of tolls and customs duties in Capernaum, working on behalf of the Roman occupation. In first-century Jewish society, this was among the most despised of occupations: collaboration with the occupying power, handled in cash, and almost universally assumed to involve creative accounting in one's own favour. Jesus invited Matthew to follow him directly from the tax table, which caused immediate scandal among everyone watching. Matthew did not need convincing twice.

🥚 Easter Egg: The moment of Matthew's calling was the subject of one of Caravaggio's most celebrated paintings, "The Calling of Saint Matthew" (1600), now in Rome. Caravaggio painted the scene with extraordinary modernity: contemporary seventeenth-century clothing, naturalistic light, and Matthew's expression of genuine surprise — the look of someone who cannot quite believe this particular invitation is meant for him. Centuries later, tax collectors remain among St. Matthew's official patronage, alongside accountants and bankers. Whether this patronage has reduced the professional temptations of the occupation is a question history declines to answer definitively.`,

      cz: `Statečný dobrodruhu, vítej v Kostele sv. Matěje!

Dejvice jsou pražskou verzí spořádané evropské rezidenční čtvrti — široké třídy, ambasády za železnými ploty, kruhový objezd, který způsobuje dopravní zmatky přibližně jednou za minutu, a bytové domy, které se nesou s tichým důstojností éry První republiky. Kostel sv. Matěje leží v této čtvrti bez architektonické dramatičnosti a slouží společenství, které ho nepřetržitě používá od doby, kdy byl postaven. Toto není nejslavnější pražský kostel. Nemusí být. Většina světových kostelů byla postavena pro lidi, kteří skutečně žijí v blízkosti, a tento to tak dělá hodně dlouho.

Sv. Matěj má profesní historii, která ho mezi apoštoly činí jedinečně zajímavým. Před svým obrácením byl výběrčím daní — konkrétně výběrčím mýtného a cel v Kafarnaum, pracujícím jménem římské okupace. V židovské společnosti prvního století to bylo jedno z nejpohrdanějších zaměstnání: spolupráce s okupační mocí, prováděná v hotovosti a téměř všeobecně předpokládající kreativní účetnictví ve vlastní prospěch. Ježíš pozval Matěje, aby ho následoval, přímo od daňového stolu, což způsobilo okamžitý skandál u všech přihlížejících. Matěj nepotřeboval být přesvědčován dvakrát.

🥚 Velikonoční vajíčko: Okamžik Matějova povolání byl předmětem jednoho z nejslavnějších Caravaggiových obrazů, "Povolání sv. Matěje" (1600), v Římě. Caravaggio maloval scénu s mimořádnou moderností: postavy v dobových sedmnáctistoleních šatech, přirozené světlo a Matějův výraz skutečného překvapení — pohledem někoho, kdo nemůže uvěřit, že toto pozvání je myšleno jemu. O staletí později zůstávají výběrčí daní mezi patrony sv. Matěje, společně s účetními a bankéři. Zda toto záštitnictví snížilo profesní pokušení daného povolání, je otázka, na kterou dějiny odmítají dát definitivní odpověď.`,

      zh: `勇敢的冒险家，欢迎来到圣马太教堂（Kostel sv. Matěje）！

德伊维采（Dejvice）是布拉格版本的井然有序的欧洲住宅区——宽阔的林荫大道、铁栅栏后的大使馆、每分钟大约造成一次交通混乱的环形交叉路，以及带着第一共和国时代安静尊严的公寓楼群。圣马太教堂坐落在这个街区，没有任何建筑戏剧感，默默服务着自它建成以来就一直使用它的社区。这不是布拉格最著名的教堂，也不需要是。世界上大多数教堂都是为真正住在附近的人建造的，而这座教堂长久以来一直做着这件事。

圣马太有一段职业履历，使他在十二使徒中独具魅力。皈依之前，他是一位税吏——具体来说，是在迦百农（Capernaum）为罗马占领者征收通行税和关税的人。在一世纪的犹太社会里，这是最受鄙视的职业之一：为占领军服务，用现金交易，几乎所有人都默认你会从中做些"创意会计"。耶稣直接走到税摊前邀请马太跟从他——在场所有人都立刻感到震惊。马太没有犹豫第二次。

🥚 彩蛋：马太蒙召的那一刻是卡拉瓦乔（Caravaggio）最著名画作《蒙召的圣马太》（1600年）的主题，现藏罗马。卡拉瓦乔以极具现代感的方式描绘了这个场景：当时的服装、自然的光线，以及马太那真实的惊讶表情——像是一个无法相信这个邀请真的是针对自己的人。几百年后，税吏依然在圣马太的官方庇护范围之内，同他们一起的还有会计师和银行家。这种庇护是否减少了这个职业的职业诱惑，历史拒绝给出明确答案。`,
    },
  },
  {
    name: 'Church of St. Anne (Žižkov)',
    slug: 'kostel-sv-anny-zizkov',
    localizedNames: { cz: 'Kostel sv. Anny (Žižkov)', zh: '圣安妮教堂（日什科夫）' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.087141885353454, lng: 14.461328104780444 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Church of St. Anne in Žižkov (Kostel sv. Anny)!

You have arrived in Žižkov, which is simultaneously one of Prague's most beloved and most misunderstood districts. It is named after Jan Žižka, the fifteenth-century Hussite military commander who won every battle he ever fought — including, remarkably, several after he went blind in his second eye and was directing operations entirely by tactical memory and the reports of subordinates. His statue on Vítkov Hill nearby is the largest equestrian bronze statue in the world. Žižkov also has a television tower covered in giant crawling babies, more pubs per square kilometre than any other district in the city, and a reputation for independence that dates back centuries. Into this context, the Church of St. Anne provides the neighbourhood with a quiet Baroque counterweight to everything that surrounds it.

St. Anne is the name given by tradition to the mother of the Virgin Mary — and consequently the grandmother of Jesus. She does not appear anywhere in the canonical Gospels. Her existence is attested only in apocryphal texts, most importantly the second-century Protoevangelium of James. The Catholic and Orthodox churches nonetheless honour her on July 26, and she has become the patron of grandmothers, miners, housewives, and lace-makers. Despite her non-canonical status, she has been a significant figure in European folk piety for centuries.

🥚 Easter Egg: In Czech popular tradition, St. Anne's Day on July 26 marks the arrival of summer's second half, expressed in the folk saying "Anna chladí vodu" — Anne cools the water — meaning the rivers begin to lose their summer warmth from this date forward. This is not astronomically precise, but Czech folk meteorology has never aspired to the standards of the Czech Hydrometeorological Institute. In Žižkov, this tradition survives alongside the other district traditions — the summer festivals, the neighbourhood pubs, and the statue of the general on the hill after whom the whole district is named.`,

      cz: `Statečný dobrodruhu, vítej v Kostele sv. Anny v Žižkově!

Přišel jsi do Žižkova, který je zároveň jednou z nejmilejších a nejnepochopenějších pražských čtvrtí. Je pojmenován po Janu Žižkovi, husitském vojenském veliteli z patnáctého století, který vyhrál každou bitvu, kterou kdy svedl — včetně, pozoruhodně, několika poté, co oslepl na druhé oko a vedl operace čistě z taktické paměti a zpráv podřízených. Jeho socha na nedalekém Vítkově je největší jezdeckou bronzovou sochou na světě. Žižkov má také televizní věž pokrytou obřími lezoucími mimulami, více hospod na čtvereční kilometr než kterákoli jiná čtvrť ve městě a pověst nezávislosti sahající staletí zpět. Do tohoto kontextu poskytuje Kostel sv. Anny čtvrti tiché barokní protizávaží ke všemu, co ho obklopuje.

Sv. Anna je jméno, které tradice dává matce Panny Marie — a tedy babičce Ježíše. V kanonických evangeliích se nikde neobjevuje. Její existence je doložena pouze v apokryfních textech, nejdůležitěji ve druhostoleté Protoevangeliu Jakubovu. Katolická a pravoslavná církev ji nicméně uctívají 26. července a stala se patronkou babiček, horníků, hospodyní a krajkářek. Navzdory svému nekanonickému statusu je od staletí významnou postavou evropské lidové zbožnosti.

🥚 Velikonoční vajíčko: V české lidové tradici označuje svátek sv. Anny 26. července příchod druhé poloviny léta, vyjádřený lidovým rčením "Anna chladí vodu" — tedy že řeky od tohoto data ztrácejí své letní teplo. Toto není astronomicky přesné, ale česká lidová meteorologie nikdy neusilovala o standardy Českého hydrometeorologického ústavu. V Žižkově tradice přežívá vedle ostatních čtvrtních tradic — letních festivalů, sousedských hospod a sochy generála na kopci, po němž je celá čtvrť pojmenována.`,

      zh: `勇敢的冒险家，欢迎来到日什科夫（Žižkov）的圣安妮教堂（Kostel sv. Anny）！

你已到达日什科夫——这是布拉格最受爱戴却也最被误解的街区之一。它得名于15世纪的胡斯派军事指挥官扬·日什卡（Jan Žižka），他打遍天下无敌手——令人惊叹的是，其中包括他失去第二只眼睛、完全凭借战术记忆和部下汇报来指挥作战时赢得的几场胜利。附近维特科夫山（Vítkov）上他的雕像，是世界上最大的骑马铜像。日什科夫还有一座覆盖着巨型爬行婴儿雕塑的电视塔、每平方公里酒吧密度全市最高的记录，以及一种可以追溯数个世纪的独立精神。在这样的背景之中，圣安妮教堂以一种安静的巴洛克气质，成为这个街区另一种平衡力量。

圣安妮是传统上赋予圣母玛利亚之母——也就是耶稣的外祖母——的名字。她在任何一部正典福音书中都没有出现过。她的存在只能通过次经文献得到印证，最主要的来源是二世纪的《雅各伯原始福音》。尽管如此，天主教和东正教仍然在7月26日纪念她，她成为了祖母、矿工、家庭主妇和蕾丝编织者的守护圣人。尽管地位不在正典之列，几百年来她一直是欧洲民间信仰的重要人物。

🥚 彩蛋：在捷克民间传统中，7月26日圣安妮节标志着夏季下半段的到来，有一句民谚说"Anna chladí vodu"（安娜使水降温），意思是从这天起河水开始失去夏日的温度。这在天文学上并不精确，但捷克民间气象学从来没有追求达到捷克水文气象研究所的标准。在日什科夫，这个传统与其他街区传统并存——夏日节庆、街坊酒吧，以及山顶上那位以其名字命名了整个街区的将军雕像。`,
    },
  },
  {
    name: 'Church of St. Norbert',
    slug: 'kostel-sv-norberta',
    localizedNames: { cz: 'Kostel sv. Norberta', zh: '圣诺伯特教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.09157392579911, lng: 14.377693241731075 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Church of St. Norbert (Kostel sv. Norberta)!

In the geography of medieval sanctity, St. Norbert of Xanten holds a specific and important position: he is the founder of the Premonstratensians — formally the Order of Canons Regular of Prémontré, informally the White Canons — whose most prominent Prague institution, Strahov Monastery, sits visible on the hillside not far from here. Norbert was born around 1080 into a noble German family near Cologne and was living as a comfortable, pleasantly dissolute canon at Xanten when, according to his biography, he was struck by lightning during a severe thunderstorm in 1115 and narrowly escaped death. He took this as a divine instruction to reconsider his priorities with some urgency.

What followed was a dramatic reorientation. Norbert abandoned his comfortable position, gave away his possessions, and began travelling as an itinerant preacher. In 1120 he founded his religious community at Prémontré in northern France, establishing a rule combining monastic austerity with active ministry in the world. The White Canons came to Prague in 1143, founding Strahov Monastery on the heights above Malá Strana, where they have remained — with interruptions for Josephine dissolution and communist nationalisation — for over eight hundred years. Norbert was later appointed Archbishop of Magdeburg, which he regarded as considerably less interesting than running his order.

🥚 Easter Egg: St. Norbert's remains had a complicated journey. He died in Magdeburg in 1134, where he was initially buried. His relics remained there until 1626, when they were transferred to Strahov Monastery — partially as a rescue operation to bring them safely behind Bohemian lines during the chaos of the Thirty Years' War, and partially because the Prague Premonstratensians were very interested in having their founder's relics on site. The bones of St. Norbert have been at Strahov ever since, resting in the Church of the Assumption there. The Archbishop of Magdeburg has been without his founding bishop's remains for four hundred years. Prague has a habit of holding onto things.`,

      cz: `Statečný dobrodruhu, vítej v Kostele sv. Norberta!

V geografii středověké svatosti zaujímá sv. Norbert z Xantenu specifické a důležité místo: je zakladatelem premonstrátů — formálně Řádu kanovníků regulovaných z Prémontré, neformálně Bílých kanovníků — jejichž nejvýznamnější pražská instituce, Strahovský klášter, se viditelně tyčí na svahu nevelmi daleko odtud. Norbert se narodil okolo roku 1080 do urozené německé rodiny u Kolína nad Rýnem a žil jako pohodlný, příjemně rozmařilý kanovník v Xantenu, když ho podle jeho životopisu v roce 1115 zasáhl blesk při prudké bouřce a on jen o vlásek unikl smrti. Vzal to jako božský pokyn přehodnotit svůj životní postoj s určitou naléhavostí.

Následovala dramatická přeměna. Norbert opustil své pohodlné postavení, rozdal svůj majetek a začal cestovat jako putující kazatel. V roce 1120 v Prémontré v severní Francii založil řeholní komunitu, která kombinovala klášterní askezi s aktivní službou ve světě. Bílí kanovníci přišli do Prahy v roce 1143 a na výšinách nad Malou Stranou založili Strahovský klášter, kde zůstali — s přestávkami pro josefínské zrušení a komunistickou nacionalizaci — přes osm set let. Norbert byl později jmenován arcibiskupem magdeburským, což považoval za podstatně méně zajímavé než řízení svého řádu.

🥚 Velikonoční vajíčko: Pozůstatky sv. Norberta měly komplikovanou cestu. Zemřel v Magdeburku v roce 1134, kde byl zpočátku pohřben. Jeho relikvie tam zůstaly až do roku 1626, kdy byly přeneseny do Strahovského kláštera — částečně jako záchranná operace v chaosu Třicetileté války, částečně proto, že pražští premonstráti měli zájem mít ostatky zakladatele svého řádu na místě. Kosti sv. Norberta jsou od té doby na Strahově, uložené v tamějším kostele Nanebevzetí Panny Marie. Magdeburský arcibiskup se obejde bez ostatků svého zakladatele-biskupa čtyři sta let. Praha má zvyk věci udržet.`,

      zh: `勇敢的冒险家，欢迎来到圣诺伯特教堂（Kostel sv. Norberta）！

在中世纪圣洁的地理版图上，沙滕的圣诺伯特（Norbert of Xanten）占据着一个独特而重要的位置：他是普雷蒙特雷修会（Premonstratensians）的创始人——正式名称"普雷蒙特雷修会院司铎"，绰号"白衣修士"——他们在布拉格最著名的机构斯特拉霍夫修道院（Strahov Monastery）就矗立在距这里不远的山坡上清晰可见。诺伯特约于1080年出生在科隆附近的一个德国贵族家庭，在沙滕担任一名舒适、散漫的教士，直到据其传记记载，1115年一场猛烈雷雨中他被闪电击中，险些丧命。他把这视为需要紧迫地重新审视人生优先级的神圣指示。

随之而来的是一场戏剧性转变。诺伯特放弃了舒适的职位，散尽财产，开始以游历传道者的身份四处游荡。1120年，他在法国北部的普雷蒙特雷建立了修道社区，将修道生活的苦修与积极社会服务相结合。白衣修士于1143年抵达布拉格，在小城区上方的山顶建立了斯特拉霍夫修道院，在那里延续至今——中间经历了约瑟夫时代的解散令和共产主义国有化时期的中断——已逾八百年。圣诺伯特后来被任命为马格德堡大主教，他认为这远不如管理自己的修会有趣。

🥚 彩蛋：圣诺伯特的遗骸经历了一段曲折旅程。他于1134年在马格德堡去世，最初就葬于那里。他的遗物在那里保存至1626年，才被转移至布拉格的斯特拉霍夫修道院——部分原因是三十年战争混乱中将其安置在波西米亚防线之内的救援行动，另一部分原因是布拉格的普雷蒙特雷修士希望将修会创始人的遗物安置在自己的机构内。圣诺伯特的遗骸自那以后便一直留在斯特拉霍夫，安放在那里的圣母升天教堂内。马格德堡大主教已经与他创始主教的遗骸分离了四百年。布拉格有一种留住东西的习惯。`,
    },
  },
  {
    name: 'Church of St. Procopius (Sladkovského náměstí)',
    slug: 'kostel-sv-prokopa-sladkovskeho',
    localizedNames: { cz: 'Kostel sv. Prokopa (Sladkovského náměstí)', zh: '圣普罗科普教堂（斯拉德科夫斯凯广场）' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.084123311618775, lng: 14.450581857755662 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Church of St. Procopius on Sladkovského náměstí (Kostel sv. Prokopa)!

Among the patron saints of Bohemia — a distinguished roster that includes Wenceslas, Adalbert, Ludmila, and Vitus — St. Procopius is perhaps the most specifically, distinctively Czech. The others have international profiles: Wenceslas appears in an English Christmas carol; Adalbert died on a missionary journey to the Prussians; Vitus was a Sicilian child martyr whose medieval cult spread from Hamburg to Prague. Procopius, however, is entirely a Bohemian product. He was born in Bohemia around 970, studied in Prague, became a hermit in the Sázava valley, founded a monastery there, and died in 1053 without ever straying very far from the forests and meadows of central Bohemia. He is intensely local. He belongs here.

The legend of his hermitage includes a detail so good it deserves to be told plainly: at some point during his years in the forest, the devil appeared and began causing trouble. Procopius caught him, harnessed him to a plow, and made him till the fields. The devil was thus conscripted into agricultural labour and forced to break ground for the monastery. This is, by any measure, an extraordinarily satisfying resolution to a supernatural encounter, and it says something specific about the Bohemian folk imagination: the devil shows up, you put him to work, and the monastery gets its fields ploughed. Practical to the last.

🥚 Easter Egg: The Sázava Monastery that Procopius founded is significant in Czech history for reasons beyond his personal sanctity. It was one of the last European monasteries to use the Old Church Slavonic liturgy rather than Latin — a tradition established by Saints Cyril and Methodius in the ninth century and sustained at Sázava until the Benedictines replaced it with Latin rites around 1097. For over a century, Sázava was a rare island of liturgical Slavonic in the Latin sea covering Western Christianity. When you honour St. Procopius, you are also honouring the fact that somewhere in the Bohemian forest, people were chanting the liturgy in something recognisably close to Czech for a hundred years before the Latin rite finally prevailed.`,

      cz: `Statečný dobrodruhu, vítej v Kostele sv. Prokopa na Sladkovského náměstí!

Mezi patrony Čech — vynikajícím seznamem, který zahrnuje Václava, Vojtěcha, Ludmilu a Víta — je sv. Prokop snad nejspecifičtěji, nejdistinktivněji český. Ti ostatní mají mezinárodní profily: Václav se objevuje v anglické vánoční koledě; Vojtěch zemřel na misijní cestě k Prusům; Vít byl sicilský dětský mučedník, jehož středověký kult se rozšířil z Hamburku do Prahy. Prokop je však výlučně českým produktem. Narodil se v Čechách okolo roku 970, studoval v Praze, stal se poustevníkem v sázavském údolí, tam founded klášter a zemřel v roce 1053, aniž by se kdy vzdálil příliš daleko od lesů a luk středních Čech. Je hluboce místní. Patří sem.

Legenda o jeho poustevnictví obsahuje detail tak dobrý, že si zaslouží být vyprávěn přímo: v jistém okamžiku během jeho let v lese se objevil ďábel a začal způsobovat problémy. Prokop ho chytil, zapřáhl ho do pluhu a přiměl ho orat pole. Ďábel byl takto odveden do zemědělských prací a donucen rozorávat půdu pro klášter. Je to za každých okolností mimořádně uspokojivé vyřešení nadpřirozeného setkání a říká to něco specifického o české lidové fantazii: ďábel se objeví, ty ho dáš do práce a klášter má zorané pole. Praktické až do konce.

🥚 Velikonoční vajíčko: Sázavský klášter, který Prokop founded, je v české historii významný z důvodů přesahujících jeho osobní svatost. Byl jedním z posledních evropských klášterů používajících staroslověnskou liturgii namísto latiny — tradici zavedenou sv. Cyrilem a Metodějem v devátém století a udržovanou na Sázavě, dokud benediktini kolem roku 1097 slovanské obřady latinskými nezaměnili. Po více než sto let byl Sázavský klášter vzácným ostrovem liturgické staroslověnštiny v moři latiny pokrývajícím západní křesťanství. Když uctíváš sv. Prokopa, uctíváš také skutečnost, že někde v českém lese lidé po sto let zpívali liturgii v něčem rozpoznatelně blízkém češtině, než latinský ritus nakonec zvítězil.`,

      zh: `勇敢的冒险家，欢迎来到斯拉德科夫斯凯广场的圣普罗科普教堂（Kostel sv. Prokopa）！

在波西米亚的主保圣人中——一个由瓦茨拉夫、阿达尔伯特（Adalbert）、鲁德米拉和维特（Vitus）等人组成的杰出名单——圣普罗科普（sv. Prokop）或许是其中最独特、最纯粹捷克的一位。其他几位都有国际知名度：瓦茨拉夫出现在英语圣诞颂歌里；阿达尔伯特在前往普鲁士的传教途中殉道；维特是来自西西里的童年殉道者，他的中世纪崇拜从汉堡传播到了布拉格。而普罗科普完全是波西米亚本土的产物。他约于公元970年出生于波西米亚，在布拉格求学，后成为萨扎瓦（Sázava）河谷的隐士，在那里建立了修道院，并于1053年辞世，一生从未远离波西米亚中部的森林与牧场。他是彻底本地的——他属于这片土地。

关于他隐居生活的传说中有一个细节好到值得直白地讲述：在他在森林中生活的某个时刻，魔鬼出现并开始制造麻烦。普罗科普抓住了他，把他套上犁，让他耕地。魔鬼就此被征召为农业劳动力，被迫为修道院开垦土地。这无论如何都是对一场超自然遭遇令人满意的处理方式，也道出了波西米亚民间想象力的某种特质：魔鬼出现了，你把他安排去干活，修道院的地就被耕好了。务实到底。

🥚 彩蛋：普罗科普创立的萨扎瓦修道院在捷克历史上的意义远超他个人的圣洁。它是欧洲最后几座使用古教会斯拉夫语礼仪而非拉丁语的修道院之一——这一传统由圣西里尔和圣美多迪乌斯在九世纪建立，在萨扎瓦延续，直到约公元1097年本笃会修士用拉丁礼仪取而代之。在超过一百年的时间里，萨扎瓦修道院是西方基督教拉丁礼仪汪洋中一座罕见的斯拉夫礼仪之岛。当你向圣普罗科普致敬时，你也在以某种微小的方式，向这个事实致敬：在波西米亚的森林某处，有人用一种与捷克语可以辨认地接近的语言诵读了一百年的礼仪，然后拉丁礼仪才最终占据上风。`,
    },
  },
  {
    name: 'Church of the Holy Spirit',
    slug: 'kostel-sv-ducha',
    localizedNames: { cz: 'Kostel svatého Ducha', zh: '圣神教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.09008160415207, lng: 14.420300127391638 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Church of the Holy Spirit (Kostel svatého Ducha)!

In Czech, "Duch" means both "spirit" and "ghost." The word operates in both directions simultaneously — holy spirit, holy ghost, the same theological concept expressed through a single word that in other contexts means something rather more unsettling. This linguistic fact will not change your experience of the church, but it adds a certain atmospheric texture to standing in front of it in the Old Town, not far from the Jewish Quarter, in a part of Prague that has accumulated more layers of history than almost anywhere else in Central Europe. The Church of the Holy Spirit is a Gothic building from the fourteenth century, modified over subsequent centuries and now operating quietly as a Roman Catholic parish church in the shadow of more famous Old Town neighbours.

The immediate surroundings are among Prague's most historically dense. Josefov — the Jewish Quarter — lies close at hand: the old cemetery, the synagogues that survived what many did not, the 1850 administrative reorganisation that gave the quarter its current name. This part of the city has been simultaneously Jewish, Christian, German, Czech, Habsburg, and everything in between, and the Church of the Holy Spirit has sat here through all of it without comment.

🥚 Easter Egg: The Benedictine convent that originally surrounded this church was dissolved under Emperor Joseph II's massive anti-monastic campaign in the 1780s. Joseph II dissolved roughly half of all religious houses in the Bohemian lands during his tenure — a reform programme motivated by Enlightenment rationalism, fiscal pragmatism, and a genuine belief that contemplative monasticism was economically unproductive. The church survived the dissolution; the convent did not. Joseph II's reform programme is one of the more complicated legacies in Czech history: enlightened, often effective, frequently destructive of irreplaceable cultural heritage, and pursued with the characteristic determination of someone absolutely certain he knew what was best. Several Prague churches owe their current form — as concert halls, museums, or simply as survivors — entirely to which side of his particular calculation they ended up on.`,

      cz: `Statečný dobrodruhu, vítej v Kostele svatého Ducha!

V češtině "duch" znamená jak "ducha", tak "strašidlo." Slovo funguje oběma směry současně — Duch svatý, svaté strašidlo, tentýž teologický pojem vyjádřený jediným slovem, které v jiných kontextech znamená něco poněkud znepokojivějšího. Tento jazykový fakt nezmění tvůj zážitek z kostela, ale přidává určitou atmosferickou texturu ke stání před ním ve Starém Městě, nevelmi daleko od Josefova, v části Prahy, která navrstvila více vrstev dějin než takřka kdekoli jinde ve střední Evropě. Kostel svatého Ducha je gotická stavba ze čtrnáctého století, upravená v průběhu dalších staletí a nyní tiše fungující jako římskokatolická farnost ve stínu slavnějších sousedů Starého Města.

Bezprostřední okolí patří k historicky nejhustším v Praze. Josefov — Židovské Město — leží nedaleko: starý hřbitov, synagogy, které přežily to, co mnoho jiných nepřežilo, správní reorganizace z roku 1850, která čtvrti dala její současné jméno. Tato část města byla současně židovská, křesťanská, německá, česká, habsburská a vše mezi tím — a Kostel svatého Ducha tu po tom všem seděl mlčky.

🥚 Velikonoční vajíčko: Benediktinský klášter, který původně obklopoval tento kostel, byl zrušen za rozsáhlé antimonastické kampaně císaře Josefa II. v 80. letech 18. století. Josef II. zrušil přibližně polovinu všech řeholních domů v Českých zemích — reformní program motivovaný osvíceneckým racionalismem, fiskálním pragmatismem a upřímným přesvědčením, že kontemplativní mnišství je ekonomicky neproduktivní. Kostel přežil zrušení; klášter ne. Reformní program Josefa II. je jedním ze složitějších odkazů v české historii: osvícený, often účinný, frequently destruktivní vůči nenahraditelnému kulturnímu dědictví a prováděný s charakteristickým odhodláním někoho zcela přesvědčeného, že ví, co je nejlepší. Několik pražských kostelů vděčí za svou dnešní podobu — jako koncertní sály, muzea nebo prostě přeživší — výhradně tomu, na které straně jeho konkrétní kalkulace skončily.`,

      zh: `勇敢的冒险家，欢迎来到圣神教堂（Kostel svatého Ducha）！

在捷克语里，"Duch"同时意味着"圣灵"和"鬼魂"。这个词在两个方向上同时运作——圣灵、鬼魂，同一个神学概念通过一个在其他语境中意味着更令人不安之物的单词来表达。这个语言学事实不会改变你在这座教堂里的体验，但它确实为你在老城区站在教堂前增添了某种氛围上的质感——不远处就是犹太区，这是布拉格历史层积最为厚重的地带之一。圣神教堂是一座14世纪的哥特式建筑，历经后续几个世纪的改建，如今在老城区那些更著名的邻居的阴影下，安静地作为一个罗马天主教堂区运营。

教堂的周边环境是布拉格历史密度最高的区域之一。约瑟福夫（Josefov）犹太城近在咫尺：古老的公墓、在那些没能幸存的建筑中幸存下来的犹太会堂、1850年的行政重组给这片区域取了现在的名字。这片城区曾同时是犹太的、基督教的、德语的、捷克的、哈布斯堡的，以及所有这些之间的一切——而圣神教堂在这一切中始终沉默地坐落于此。

🥚 彩蛋：最初环绕这座教堂而建的本笃会修道院，在18世纪80年代约瑟夫二世大规模反修道运动中被解散。约瑟夫二世在任期间解散了波西米亚地区约一半的修道院——这是一个以启蒙理性主义、财政实用主义以及对沉思式修道主义经济上不具生产力的真诚信念为动机的改革计划。教堂在解散中幸存下来，修道院则没有。约瑟夫二世的改革计划是捷克历史上最复杂的遗产之一：开明、往往有效，但频繁地摧毁了事后证明无可替代的文化遗产，且以一种完全确信自己知道什么是最好的人的典型坚定来推行。布拉格几座教堂现在的样貌——作为音乐厅、博物馆，或者仅仅作为幸存者——正取决于它们最终落在他那特定计算的哪一侧。`,
    },
  },
  {
    name: 'Church of the Immaculate Conception',
    slug: 'kostel-neposkvrneneho-poceti',
    localizedNames: { cz: 'Kostel Neposkvrněného početí Panny Marie', zh: '圣母无玷受孕教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.068696940439516, lng: 14.494701153500596 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Church of the Immaculate Conception of the Virgin Mary (Kostel Neposkvrněného početí Panny Marie)!

This church holds a dedication that is among the most frequently misunderstood concepts in Catholic theology — and not only by non-Catholics. The Immaculate Conception does not refer to the birth of Jesus. It refers to the conception of Mary — specifically, the doctrine that Mary herself was conceived in her mother's womb without inheriting original sin. This is a specific, technical theological claim about a privilege granted retroactively by God in anticipation of Mary's role as mother of Christ. It was defined as formal dogma by Pope Pius IX in 1854, making it one of the newer official doctrines in Catholic teaching — in place for approximately 170 years, which is a relatively short period by the standards of an institution making formal doctrinal declarations since the Council of Nicaea in 325 AD.

The eastern districts of Prague where this church stands have their own unhurried character — working districts that developed in the nineteenth and early twentieth centuries as the city industrialised, and have settled into a pragmatic, unpretentious identity that has little to do with the castle-and-bridge Prague of the tourist brochures. The Church of the Immaculate Conception serves a community that lives and works here, as neighbourhood churches have always done.

🥚 Easter Egg: The definition of the Immaculate Conception in 1854 was preceded by centuries of theological debate within the Catholic Church itself, with major figures on both sides. Thomas Aquinas — one of the greatest theologians in Catholic history — argued against it: his position was that Mary was sanctified after her conception but not at it. The Franciscans argued for it; the Dominicans (following Aquinas) argued against. The debate lasted several hundred years and was one of the most heated internal disputes in medieval Catholic theology. In the end, the dogmatic definition of 1854 settled the matter by papal authority — neatly illustrating how doctrinal questions in the Catholic Church can remain actively contested for centuries before receiving a definitive institutional answer.`,

      cz: `Statečný dobrodruhu, vítej v Kostele Neposkvrněného početí Panny Marie!

Tento kostel nese zasvěcení, které patří mezi nejčastěji nepochopené pojmy v katolické teologii — a nejen nekatolíky. Neposkvrněné početí se nevztahuje na narození Ježíše. Vztahuje se na početí Marie — konkrétně na nauku, že Maria sama byla počata v lůně své matky bez dědičného prvotního hříchu. Jedná se o specifické, technické teologické tvrzení o privilegiu uděleném Bohem retroaktivně v předjímání Mariiny role jako matky Kristovy. Jako formální dogma bylo definováno papežem Piem IX. v roce 1854 — je tedy v platnosti přibližně 170 let, relativně krátká doba podle standardů instituce vydávající formální dogmatická prohlášení od Nicejského koncilu v roce 325 n. l.

Východní čtvrti Prahy, kde tento kostel stojí, mají svůj vlastní klidný charakter — pracovní čtvrti, které se rozvíjely v devatenáctém a začátkem dvacátého století s industrializací města a usadily se do pragmatické, nenápadné identity. Kostel Neposkvrněného početí slouží komunitě, která tu žije a pracuje, jak sousedské kostely vždy dělaly.

🥚 Velikonoční vajíčko: Definici Neposkvrněného početí v roce 1854 předcházela staletí teologické debaty uvnitř katolické církve samotné, s výraznými postavami na obou stranách. Tomáš Akvinský — jeden z největších teologů v katolické historii — se stavěl proti: jeho pozice byla, že Maria byla posvěcena po svém početí, nikoli při něm. Františkáni se stavěli pro; dominikáni (v souladu s Akvinským) proti. Debata trvala několik set let a patřila k nejheatovanějším interním sporům ve středověké katolické teologii. Nakonec dogmatická definice z roku 1854 věc papežskou autoritou oficálně uzavřela — přehledně ilustrujíc, jak naučné otázky v katolické církvi mohou zůstávat aktivně kontroverzní po staletí, než dostanou definitivní institucionální odpověď.`,

      zh: `勇敢的冒险家，欢迎来到圣母无玷受孕教堂（Kostel Neposkvrněného početí Panny Marie）！

这座教堂供奉着天主教神学中最常被误解的概念之一——不仅是非天主教徒，连天主教徒也经常搞混。"无玷受孕"（Immaculate Conception）指的不是耶稣的诞生。它指的是玛利亚的受孕——具体来说，是关于玛利亚本人在母亲子宫中受孕时便未沾染原罪的教义。这是一个具体的、技术性的神学主张，涉及上帝为预见玛利亚作为基督之母的角色而追溯性地赐予她的特权。它于1854年由教宗庇护九世正式定义为教义，使其成为天主教教导中较新的教义定义之一——大约只在170年内成为官方教会教义，对于一个自公元325年尼西亚公会议以来就在发表正式教义声明的机构来说，这是相当短暂的时间。

这座教堂所在的布拉格东部街区有着自己不紧不慢的特质——这些工业区在19世纪至20世纪初随着城市工业化而发展起来，形成了务实、不矫揉造作的气质。圣母无玷受孕教堂服务着在这里生活和工作的社区，就像街区教堂一直以来所做的那样。

🥚 彩蛋：1854年的无玷受孕教义定义之前，天主教会内部经历了数百年的神学辩论，双方都有重量级人物。托马斯·阿奎那——天主教历史上最伟大的神学家之一——持反对立场：他认为玛利亚是在受孕之后而非受孕之时得到圣化的。方济各会为此辩护；多明我会（遵循阿奎那的立场）则持反对意见。这场争论持续了数百年，是中世纪天主教神学中最激烈的内部神学争端之一。最终，1854年的教义定义以教宗权威正式解决了这一问题——清晰地说明了天主教会中教义问题在获得权威机构最终答案之前，可以持续争议数百年。`,
    },
  },
  {
    name: 'Church of Our Lady of the Angels',
    slug: 'kostel-panny-marie-andelske',
    localizedNames: { cz: 'Kostel Panny Marie Andělské', zh: '天使圣母教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.08991302365088, lng: 14.3904806618152 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Church of Our Lady of the Angels (Kostel Panny Marie Andělské)!

In the neighbourhood of Hradčany — the Castle District, perched above the city on its rocky promontory — the Capuchin monastery and its adjacent church have maintained a presence since 1600. The Capuchins are a branch of the Franciscan family: brown-robed, sandal-wearing, radically committed to poverty and simplicity in a tradition that runs directly back to St. Francis of Assisi. Their aesthetic choices are therefore the inverse of Baroque extravagance — plain walls, minimal decoration, a deliberate refusal of gold and ornament. Walking into this church from the theatrical excess of Prague's grander Baroque interiors is like switching from orchestral fortissimo to a single held note. The effect is disorienting in the best way.

The dedication — Our Lady of the Angels — connects this church to a specific Franciscan devotion. The Porziuncola, a tiny chapel near Assisi in Italy, is the spiritual birthplace of the Franciscan movement: it was there that Francis heard the Gospel passage that changed his life, there that Clare of Assisi made her profession of vows, and there that Francis himself died in 1226. That little chapel is now enclosed within the massive Basilica of Santa Maria degli Angeli — "of the Angels" — and the dedication was carried across Europe by Capuchin communities establishing their own devotion to it.

🥚 Easter Egg: The Capuchin monastery in Hradčany has a Christmas crib — a Nativity scene — that has been displayed in its church every Advent season since 1780. It is one of the most celebrated Nativity scenes in Central Europe: a large, elaborate composition with figures added and changed across the centuries, visited by Praguers for Christmas observance for over two hundred years. Capuchin Christmas cribs in the Central European tradition are a specific art form with detailed conventions about figures, scenery, and scale. In a city with many seasonal traditions, this is one that has survived Napoleon, the Habsburg dissolution of religious houses, two world wars, communist atheism, and the general turbulence of Czech history — entirely intact, still drawing crowds every December.`,

      cz: `Statečný dobrodruhu, vítej v Kostele Panny Marie Andělské!

V Hradčanech — Hradčanské čtvrti, zasazené nad městem na skalnaté výspě — kapucínský klášter a přilehlý kostel udržují svou přítomnost od roku 1600. Kapucíni jsou větví františkánské rodiny: v hnědých hábitech, v sandálech, radikálně oddáni chudobě a jednoduchosti v tradici vedoucí přímo k sv. Františku z Assisi. Jejich estetické volby jsou tedy inverzí barokní okázalosti — holé zdi, minimální dekorace, záměrné odmítnutí zlata a ornamentů. Vstoupit do tohoto kostela z theatrálního přebytku grandiózních pražských barokních interiérů je jako přejít z orchestrálního fortissima na jediný prolongovaný tón. Efekt je dezorientující tím nejlepším způsobem.

Zasvěcení — Panna Maria Andělská — spojuje tento kostel se specifickou františkánskou devokcí. Porziuncola, malá kaplička u Assisi v Itálii, je duchovním rodištěm františkánského hnutí: tam František uslyšel evangelní pasáž, která změnila jeho život, tam Klára z Assisi složila sliby a tam sám František zemřel v roce 1226. Tato malá kaplička je nyní uzavřena v rozlehlé Bazilice Santa Maria degli Angeli — "Andělské" — a zasvěcení bylo kapucínskými komunitami rozneseno po Evropě.

🥚 Velikonoční vajíčko: Kapucínský klášter v Hradčanech má betlém — jesličkovou scénu — která je vystavena v kostele každou adventní sezónou od roku 1780. Je to jeden z nejslavnějších betlémů ve střední Evropě: velká, propracovaná kompozice s postavami přidávanými a měněnými v průběhu staletí, na níž Pražané přicházejí na vánoční pobožnost déle než dvě stě let. Kapucínské betlémy ve středoevropské tradici jsou specifickým uměleckým žánrem s podrobnými konvencemi. V městě s mnoha sezónními tradicemi je tato taková, která přežila Napoleona, habsburské zrušení klášterů, dvě světové války, komunistický ateismus a obecnou turbulenci české dějiny zcela neporušeně — a každý prosinec stále přitahuje davy.`,

      zh: `勇敢的冒险家，欢迎来到天使圣母教堂（Kostel Panny Marie Andělské）！

在城堡区（Hradčany）——那片矗立在城市上方岩石高台上的街区——自1600年起，嘉布遣（Capuchin）修道院及其毗邻的教堂便在这里扎根。嘉布遣会是方济各会大家庭的一个分支：身穿棕色会衣，脚踏凉鞋，在一种直接追溯至阿西西的圣方济各的传统中，彻底奉行贫穷与简朴的生活方式。因此，他们的审美选择与巴洛克豪华形成了鲜明对立——素白的墙壁、极少的装饰、刻意拒绝金饰与纹章。从布拉格那些宏大巴洛克内部装饰的戏剧性奢华中走进这座教堂，就像从管弦乐的强奏转换到一个延续的单音。那种效果令人迷失方向，以最好的方式。

"天使圣母"这个献堂名称，将这座教堂与一种特定的方济各式虔诚联系在一起。波尔钦库拉（Porziuncola）是意大利阿西西附近的一座小礼拜堂，是方济各运动的精神发祥地：正是在那里，方济各聆听了改变他生命的福音段落；正是在那里，阿西西的嘉勒宣发了修道誓愿；也正是在那里，方济各本人于1226年辞世。这座小礼拜堂如今被宏大的"天使圣玛利亚大殿"（Santa Maria degli Angeli）所包裹，而这个献堂名称随着嘉布遣社区在欧洲各地传播开来。

🥚 彩蛋：城堡区的嘉布遣修道院有一套圣诞马槽——耶稣诞生景——自1780年以来每年降临节期间都在教堂内展出。这是中欧最著名的圣诞马槽之一：一个大型、精细的构图，数百年来不断有人物被添加或更换，布拉格人已经连续超过两百年来这里进行圣诞礼拜。嘉布遣圣诞马槽是有着详细惯例的特定艺术形式。在一座有着众多季节性传统的城市里，这是其中一个完好无损地熬过了拿破仑时期、哈布斯堡解散修道院令、两次世界大战和共产主义无神论的传统——每年十二月仍然吸引大批人群前来。`,
    },
  },
  {
    name: 'Monastery Church of Our Lady — U Kajetánů',
    slug: 'u-kajetanu',
    localizedNames: { cz: 'Klášterní kostel Panny Marie — U Kajetánů', zh: '嘉耶当修道院圣母教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.08860279566319, lng: 14.399775511178273 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Monastery Church of Our Lady — U Kajetánů (Klášterní kostel Panny Marie)!

"U Kajetánů" — meaning "at the Theatines" — is the kind of Prague address that reveals its meaning only to those who know to ask. The Theatines are a religious order that time has treated somewhat unfairly. Founded in 1524 by Gaetano da Thiene — later canonised as St. Cajetan — and Gian Pietro Carafa — later elected Pope Paul IV — the Theatines were among the earliest and most serious Counter-Reformation reform movements in the Catholic Church. They arrived in Prague in the seventeenth century and built this Baroque church in Malá Strana, which remains one of the neighbourhood's more restrained and elegant ecclesiastical buildings.

The Theatines never achieved the global profile of the Jesuits, despite being founded earlier and with similar aims. This is one of history's subtler ironies: two orders, similar missions, dramatically different outcomes in terms of institutional footprint. The Jesuits founded universities, ran global mission networks, and produced the Klementinum. The Theatines produced several popes, a handful of notable saints, and this church in Malá Strana that most people walk past without knowing who built it. History distributes institutional fame unevenly and often arbitrarily.

🥚 Easter Egg: Gian Pietro Carafa, co-founder of the Theatines, was elected Pope Paul IV in 1555. His papacy is remembered for two things in particular: establishing the Roman Inquisition as a permanent institution, and publishing the first Index of Forbidden Books (Index Librorum Prohibitorum) in 1559 — a list of books Catholics were prohibited from reading, maintained and regularly updated until it was formally abolished in 1966. At its height, the Index contained the works of Copernicus, Galileo, Descartes, Kant, Locke, Voltaire, and Victor Hugo, among many others. The man who co-founded the quiet Baroque order whose Prague church you are now looking at also created the most comprehensive official reading prohibition list in Western history. Both accomplishments remain, in their different ways, historically notable.`,

      cz: `Statečný dobrodruhu, vítej v Klášterním kostele Panny Marie — U Kajetánů!

"U Kajetánů" — tedy "u teatínů" — je typ pražské adresy, která odhaluje svůj smysl jen těm, kteří vědí, na co se ptát. Teatíni jsou řeholní řád, s nímž se čas zachoval poněkud nespravedlivě. Byli v roce 1524 founded Gaetano da Thiene — pozdějším sv. Kajetánem — a Gian Pietro Carafou — pozdějším papežem Pavlem IV. — a patřili k nejranějším a nejzávažnějším protireformačním reformním hnutím v katolické církvi. Do Prahy přišli v sedmnáctém století a vystavěli tento barokní kostel na Malé Straně, který zůstává jednou ze zdrženlivějších a elegantnějších kostelních staveb v této čtvrti.

Teatíni nikdy nedosáhli globálního profilu jezuitů, přestože byli founded dříve a s podobnými cíly. To je jedna z jemnějších historických ironií: dva řády, podobná mise, dramaticky odlišné výsledky z hlediska institucionální stopy. Jezuité zakládali univerzity, provozovali globální misijní sítě a vybudovali Klementinum. Teatíni vyprodukovali několik papežů, hrstku pozoruhodných světců a tento kostel na Malé Straně, kolem nějž většina lidí prochází, aniž by tušila, kdo ho postavil. Dějiny rozdělují institucionální slávu nerovnoměrně a often svévolně.

🥚 Velikonoční vajíčko: Gian Pietro Carafa, spoluzakladatel teatínů, byl v roce 1555 zvolen papežem Pavlem IV. Jeho pontifikát je vzpomínán především ze dvou důvodů: za zřízení Římské inkvizice jako trvalé instituce a za vydání prvního Indexu zakázaných knih (Index Librorum Prohibitorum) v roce 1559 — seznamu knih, jejichž čtení bylo katolíkům zakázáno, který byl udržován a pravidelně aktualizován až do jeho formálního zrušení v roce 1966. Na vrcholu slávy obsahoval díla Koperníka, Galilea, Descarta, Kanta, Locka, Voltaira a Victora Huga. Muž, který spoluzaložil tichý barokní řád, jehož pražský kostel právě vidíte, také vytvořil nejkomplexnější úřední seznam zákazů čtení v dějinách Západu. Obě počiny zůstávají, každý svým způsobem, historicky pozoruhodné.`,

      zh: `勇敢的冒险家，欢迎来到嘉耶当修道院圣母教堂——U Kajetánů（Klášterní kostel Panny Marie）！

"U Kajetánů"——意为"在泰亚廷会修士处"——是那种在布拉格只对知道该问什么的人才会透露其含义的地址。泰亚廷会（Theatines，捷克语Kajetáni）是一个时代对之处理有些不公平的修道会。1524年，由加埃塔诺·达·迪耶纳（Gaetano da Thiene，后被封圣为圣嘉耶当）和詹·皮耶特罗·卡拉法（Gian Pietro Carafa，后当选为教宗保禄四世）共同创立，是天主教会中最早也最认真的反宗教改革运动之一。他们在17世纪来到布拉格，在小城区建造了这座巴洛克风格的教堂——这是这个街区最为克制而优雅的教会建筑之一。

泰亚廷会从未获得与耶稣会同等的国际知名度，尽管前者成立更早、目标也相近。这是历史较为隐晦的讽刺之一：两个修会，使命相近，但在机构影响力方面结局却截然不同。耶稣会创建了大学，经营着全球传教网络，建造了克莱门汀图书馆；泰亚廷会则产出了几位教宗、少数几位著名圣人，以及小城区的这座教堂——大多数人从它旁边走过时根本不知道是谁建造了它。历史分配机构声望的方式往往不均，且常常出于偶然。

🥚 彩蛋：詹·皮耶特罗·卡拉法——泰亚廷会的联合创始人——于1555年当选为教宗保禄四世。他的教宗生涯主要因两件事被人铭记：将罗马宗教裁判所确立为永久机构，以及1559年发布了第一份《禁书目录》（Index Librorum Prohibitorum）——一份禁止天主教徒阅读的书籍清单，由教会持续维护并定期更新，直至1966年正式废除。《禁书目录》在鼎盛时期收录了哥白尼、伽利略、笛卡尔、康德、洛克、伏尔泰和维克多·雨果等人的著作。那位共同创立了你现在正在看的这座安静巴洛克教堂所属修道会的人，同时也创建了西方历史上最全面的官方阅读禁令清单。这两项成就，各以其不同的方式，在历史上都留下了值得注目的印记。`,
    },
  },
  {
    name: 'Church of St. John of Nepomuk, Košíře',
    slug: 'kostel-sv-jana-nepomuckeho-kosire',
    localizedNames: { cz: 'Kostel sv. Jana Nepomuckého (Košíře)', zh: '圣约翰·内波穆克教堂（科希热）' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.068877171836036, lng: 14.366337600775292 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Church of St. John of Nepomuk in Košíře (Kostel sv. Jana Nepomuckého, Praha—Košíře)!

Let us be transparent about something: Prague has a remarkable number of churches dedicated to St. John of Nepomuk. He appears on Charles Bridge (the most famous statue), in church dedications across the city, on roadside shrines, on building facades, at crossroads, and — now — in front of you in Košíře, the western district where the city begins its transition from the historic centre toward the suburban landscape beyond Motol. This is not a coincidence. The canonisation of St. John of Nepomuk in 1729 was a major event in Central European Catholic culture, and the following decades saw an explosion of shrines, churches, and statues across Bohemia that has never entirely abated.

The church itself is a solid, unpretentious neighbourhood church that has served the Košíře community through Habsburg administration, the First Republic, the Nazi occupation, forty years of communism, and the post-1989 democratic period. It has outlasted every government that has ruled over it. Churches are very good at this.

🥚 Easter Egg: The cult of St. John of Nepomuk crossed the Atlantic with Bohemian emigrants in the eighteenth and nineteenth centuries. He is honoured in churches across the United States, particularly in communities with Czech heritage — there is a statue of him in Nebraska, and a church named after him in Texas. The faithful Czech immigrant communities of the American Midwest, who left Bohemia in the nineteenth century for farming opportunities, built him shrines in a landscape that has never seen the Vltava, because they brought their saints with them the same way they brought their language, music, and recipes for kolache. Prague's most famous confessor watches over a rather larger geographical territory than Jan Nepomuk himself ever imagined.`,

      cz: `Statečný dobrodruhu, vítej v Kostele sv. Jana Nepomuckého v Košířích!

Buďme upřímní ohledně jedné věci: Praha má pozoruhodné množství kostelů zasvěcených sv. Janu Nepomuckému. Objevuje se na Karlově mostě (nejslavnější socha), v kostelních zasvěceních po celém městě, na přícestných kapličkách, na fasádách budov, na křižovatkách a — nyní — před tebou v Košířích, v západní čtvrti, kde město začíná přechod z historického centra k předměstské krajině za Motolem. To není náhoda. Kanonizace sv. Jana Nepomuckého v roce 1729 byla velkou událostí ve středoevropské katolické kultuře a v následujících desetiletích došlo k explozi kaplí, kostelů a soch po celých Čechách, která nikdy zcela neutichla.

Kostel sám je solidní, nenáročný sousedský kostel, který sloužil košířské komunitě přes habsburskou správu, První republiku, nacistickou okupaci, čtyřicet let komunismu a podemokratické období po roce 1989. Přežil každou vládu, která nad ním panovala. Kostely jsou v tom velmi dobré.

🥚 Velikonoční vajíčko: Kult sv. Jana Nepomuckého překročil Atlantik s českými emigranty v osmnáctém a devatenáctém století. Je uctíván v kostelech po celých Spojených státech, zejména ve společenstvích s českou tradicí — v Nebrasce je jeho socha a v Texasu kostel pojmenovaný po něm. Věrné české emigrantské komunity středozápadní Ameriky, které opustily Čechy v devatenáctém století pro zemědělské příležitosti, mu budovaly svatyně v krajině, která nikdy neviděla Vltavu, protože si přinesly své světce stejně jako svůj jazyk, hudbu a recepty na koláče. Nejslavnější zpovědník Prahy střeží poněkud větší geografické území, než Jan Nepomuk sám kdy tušil.`,

      zh: `勇敢的冒险家，欢迎来到科希热（Košíře）的圣约翰·内波穆克教堂（Kostel sv. Jana Nepomuckého）！

让我们坦诚地承认一件事：布拉格供奉圣约翰·内波穆克的教堂数量相当可观。他出现在查理大桥上（那座最著名的雕像），出现在全市各地的教堂献堂中，出现在路边神龛里，出现在建筑外立面上，出现在十字路口——而现在，他出现在你眼前的科希热，这个城市西部开始从历史中心向摩托尔（Motol）以外郊区化景观过渡的地方。这不是巧合。1729年圣约翰·内波穆克封圣是中欧天主教文化的重大事件，随后数十年间，波西米亚各地出现了一场神龛、教堂和雕像的爆发式建造潮，至今从未真正平息。

教堂本身是一座实在、朴素的街区教堂，在哈布斯堡王朝治下、第一共和国、纳粹占领、四十年共产主义，以及1989年后的民主时期，都一直默默服务着科希热社区。它熬过了每一个统治过它的政府。教堂在这方面非常擅长。

🥚 彩蛋：圣约翰·内波穆克的崇拜在18至19世纪随着波西米亚移民跨越大西洋传入新世界。他在美国各地的教堂中受到供奉，尤其是在有捷克传统的社区里——内布拉斯加州有他的雕像，德克萨斯州有以他命名的教堂。这些19世纪为了农业机会而离开波西米亚的捷克移民社区，在一片从未见过伏尔塔瓦河的土地上为他建造神龛——因为他们把自己的圣人带来了，就像他们带来了自己的语言、音乐和科拉切（kolache）食谱一样。布拉格最著名的告解神父守护着一片远超扬·内波穆克生前所能想象的地理版图。`,
    },
  },
  {
    name: 'Folimanka Shelter',
    slug: 'kryt-folimanka',
    localizedNames: { cz: 'Kryt Folimanka', zh: '弗利曼卡防空掩体' },
    labels: ['communism', 'historical', 'hidden-gem'],
    coordinates: { lat: 50.06775411961101, lng: 14.432288694882276 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Folimanka Shelter (Kryt Folimanka)!

Beneath the pleasant green expanse of Folimanka Park, in the Nusle district south of Vyšehrad, there is a world that most Praguers have never visited and most tourists have never heard of. This fully constructed nuclear and air-raid civil defence shelter was built by the Czechoslovak communist government in the 1950s as practical preparation for the scenario that the regime's own foreign policy was making increasingly plausible: a sudden and catastrophic outbreak of the Cold War into something significantly hotter. The architecture of existential anxiety is rarely beautiful, but it is always instructive. Folimanka's kryt is a network of reinforced concrete corridors, blast-proof doors, filtration systems, and sleeping quarters — designed to shelter hundreds of civilians underground for extended periods while the city above processed whatever the nuclear age had finally delivered.

The shelter was never used for its intended purpose. This is the only successful outcome a civil defence shelter can achieve, and Folimanka achieved it completely. Prague's communist authorities invested substantially in this kind of infrastructure — not because they were optimistic about the future, but because their strategic doctrine required planning for the morning after a war that nobody, officially, wanted but everyone, practically, was preparing for. The building above ground is a park. The building below the park is a very serious room.

🥚 Easter Egg: Prague's underground is considerably more extensive than even most locals realise. Beneath the streets and parks of the city runs a parallel infrastructure: medieval cellars linked in chains across the Old Town, nineteenth-century sewage tunnels wide enough to walk through upright, Cold War metro emergency protocols, municipal communication bunkers, and scattered civil defence shelters like this one. The communist government's nuclear preparedness programme produced dozens of kryty across Czechoslovakia — each one a concrete argument that the regime genuinely believed it was preparing for a survivable catastrophe rather than a theoretical one. The children who played football in Folimanka Park through the 1960s and 70s had no idea what was beneath their feet. Several of them presumably still don't.`,

      cz: `Statečný dobrodruhu, vítej v Krytu Folimanka!

Pod příjemnou zelení Folimanky, v nuselské čtvrti jižně od Vyšehradu, leží svět, který většina Pražanů nikdy nenavštívila a o němž většina turistů nikdy neslyšela. Tento plně vybavený protiatomový a protiletecký civilní úkryt byl postaven komunistickou vládou v 50. letech jako praktická příprava na scénář, který vlastní zahraniční politika režimu činila stále pravděpodobnějším: náhlý a katastrofický přechod studené války do čehosi podstatně teplejšího. Architektura existenční úzkosti bývá zřídkakdy krásná, ale vždy poučná. Folimanský kryt je síť železobetonových chodeb, protivýbuchových dveří, filtračních systémů a nocleháren — navržená k úkrytu stovek civilistů po dobu, než povrch města zvládne cokoliv, co jaderný věk nakonec přinese.

Úkryt nebyl nikdy použit ke svému určenému účelu. To je jediný úspěšný výsledek, jakého může civilní úkryt dosáhnout, a Folimanka ho dosáhla bezezbytku. Pražské komunistické úřady investovaly do tohoto druhu infrastruktury nemalé prostředky — ne proto, že by byly optimistické ohledně budoucnosti, ale protože jejich strategická doktrína vyžadovala plánování pro případ rána po válce, kterou nikdo oficiálně nechtěl, ale každý prakticky připravoval. Nad zemí je park. Pod parkem je velmi vážná místnost.

🥚 Velikonoční vajíčko: Pražské podzemí je podstatně rozsáhlejší, než tuší i většina místních. Pod ulicemi a parky města se vine paralelní infrastruktura: středověké sklepy vzájemně propojené v řetězcích pod Starým Městem, kanalizační tunely z devatenáctého století, v nichž je možné procházet vzpřímeně, nouzové protokoly pro metro z dob studené války, municipální komunikační bunkry a roztroušené civilní úkryty jako tento. Komunistický program jaderné připravenosti vyprodukoval po celém Československu desítky krytů — každý z nich betonový argument, že režim skutečně věřil, že připravuje na přeživatelnou katastrofu, nikoli na teoretickou. Děti, které hrály fotbal na Folimance v 60. a 70. letech, neměly ponětí, co se nachází pod jejich nohama. Část z nich to pravděpodobně neví dodnes.`,

      zh: `勇敢的冒险家，欢迎来到弗利曼卡防空掩体（Kryt Folimanka）！

在弗利曼卡（Folimanka）公园宜人的绿荫之下，努塞尔（Nusle）区维谢赫拉德以南，藏着一个大多数布拉格人从未探访、大多数游客从未听说过的地下世界。这座完整建造的核战与空袭民防地下掩体，由捷克斯洛伐克共产主义政府在20世纪50年代建造，是对一种正在变得越来越可信的场景所做的现实准备——冷战忽然烧穿临界点，化为某种烈度大得多的东西。存在焦虑的建筑学通常不够美观，但永远发人深省。弗利曼卡的"kryt"（地下掩体）是一套钢筋混凝土走廊、防爆门、过滤系统和寝室的网络——设计用于在城市地面应对核纪元最终降临的同时，在地下庇护数百名平民。

这座掩体从未被用于其设计目的。这是一座民防掩体唯一能够取得的成功结局，弗利曼卡圆满做到了。布拉格的共产主义当局在这类基础设施上投入了大量资源——不是因为他们对未来乐观，而是因为他们的战略理论要求为"战后的早晨"做好规划，在那场没有人官方上想要、但所有人实际上都在准备的战争之后。地面上是一座公园。公园下面，是一个极为严肃的房间。

🥚 彩蛋：布拉格的地下世界比大多数本地人意识到的要广阔得多。在这座城市的街道和公园之下，延伸着一套平行基础设施：在老城区地下互相连通成链状的中世纪地窖、宽到可以直立行走的19世纪下水道隧道、冷战时期的地铁紧急协议、市政通信掩体，以及像弗利曼卡这样零散分布的民防掩体。共产主义政府的核准备项目在整个捷克斯洛伐克建造了数十座"kryty"——每一座都是混凝土筑成的论据，证明该政权真的相信自己是在为一场可以被人熬过去的灾难做准备，而不仅仅是为一个理论上的情景。那些在60至70年代于弗利曼卡公园踢足球的孩子们，完全不知道自己脚下是什么。其中有一些人大概至今仍不知道。`,
    },
  },
  {
    name: 'Goethe-Institut Prag',
    slug: 'goethe-institut-prag',
    localizedNames: { cz: 'Goethe-Institut Praha', zh: '布拉格歌德学院' },
    labels: ['cultural', 'historical', 'architecture'],
    coordinates: { lat: 50.07966896735283, lng: 14.414204228766241 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Goethe-Institut Prag!

The Goethe-Institut is Germany's official cultural and language institution, present in 158 countries across the world. In most cities, this means a language school with some German films and cultural events. In Prague, it means something considerably more layered. The history of German and Czech culture in Bohemia runs for a thousand years: German-speaking medieval settlers, the Czech-German tensions of the nineteenth century, the Franz Kafka problem — a German-speaking Jew in a Czech city, writing in a language later claimed by the culture that would attempt to exterminate his people — the Sudeten crisis, the Nazi Protectorate, the brutal expulsion of three million German-speaking Bohemians after 1945, and then the slow, difficult work of cultural reconciliation in the decades that followed. The Goethe-Institut in Prague is the institutional expression of that last chapter.

The building on Masarykovo nábřeží — the embankment named for the founder of Czechoslovakia — is an appropriately interesting address for this kind of cultural work. The institute offers language courses, hosts exhibitions, runs film screenings, and does the quiet, persistent labour of maintaining a German cultural presence in a city that has extremely good reasons for complicated feelings about German cultural presence. It manages this, on the whole, without incident, which is itself a small historical achievement worth acknowledging.

🥚 Easter Egg: Johann Wolfgang von Goethe — for whom the institute is named — visited Bohemia many times and was genuinely enthusiastic about the region. He spent time in Karlovy Vary on a dozen separate occasions, fell in love with the spa town and its landscape, and composed poetry about the Bohemian countryside. At the age of seventy-three, he proposed marriage to Ulrike von Levetzow, a nineteen-year-old woman he had met in Mariánské Lázně. She declined. He wrote the Marienbad Elegy as a result — considered by many scholars to be among the finest lyric poems in the German language. The Goethe-Institut bears the name of a man who came to Bohemia repeatedly and left one great poem richer and one matrimonial prospect poorer. Cultural exchange takes many forms.`,

      cz: `Statečný dobrodruhu, vítej v Goethe-Institutu Praha!

Goethe-Institut je německá oficiální kulturní a jazyková instituce přítomná ve 158 zemích světa. Ve většině měst to znamená jazykovou školu s německými filmy a kulturními akcemi. V Praze to znamená něco podstatně vícevrstvějšího. Dějiny německé a české kultury v Čechách sahají tisíc let nazpět: německy mluvící středověcí osadníci, česko-německé napětí devatenáctého věku, kafkovský problém — německy mluvící Žid v českém městě, píšící v jazyce kultury, která se posléze pokusí vyvraždit jeho lid — sudetská krize, nacistický protektorát, brutální vyhnání tří milionů německy mluvících Čechů po roce 1945 a pak pomalá, náročná práce kulturního usmíření v následujících desetiletích. Goethe-Institut v Praze je institucionálním výrazem této poslední kapitoly.

Budova na Masarykově nábřeží — pojmenovaném po zakladateli Československa — je pro tento druh kulturní práce přiměřeně zajímavou adresou. Institut nabízí jazykové kurzy, pořádá výstavy, uvádí filmová představení a vykonává tiché, vytrvalé úsilí o udržení německé kulturní přítomnosti v městě, které má velmi dobré důvody pro komplikované pocity ohledně německé kulturní přítomnosti. Dělá to vcelku bez incidentů — což je samo o sobě malý historický úspěch, který stojí za povšimnutí.

🥚 Velikonoční vajíčko: Johann Wolfgang von Goethe — po němž je institut pojmenován — navštívil Čechy mnohokrát a kraj ho skutečně nadchl. V Karlových Varech trávil čas při dvanácti různých příležitostech, zamiloval se do lázeňského města a jeho krajiny a skládal básně o české přírodě. Ve věku sedmdesáti tří let požádal o ruku Ulrike von Levetzow, devatenáctileté dívky, s níž se seznámil v Mariánských Lázních. Odmítla. Napsal v důsledku toho Mariánské elegie — považované mnohými literárními vědci za jednu z nejlepších lyrických básní v německém jazyce. Goethe-Institut nese jméno muže, který přijel do Čech mnohokrát a odjel s jednou velkou básní bohatší a jednou sňatkovou šancí chudší. Kulturní výměna má mnoho podob.`,

      zh: `勇敢的冒险家，欢迎来到布拉格歌德学院（Goethe-Institut Prag）！

歌德学院是德国的官方文化与语言机构，遍布全球158个国家。在大多数城市，这意味着一所开设德语课程、放映德国电影、举办文化活动的机构。在布拉格，它意味着更加多层次的东西。波西米亚的德捷文化史绵延千年：中世纪德语移民、19世纪的捷德文化张力、卡夫卡难题——一个用德语写作的犹太人生活在捷克城市，而那门语言属于后来试图灭绝他的民族——苏台德危机、纳粹保护国时期、1945年后对三百万德语波西米亚人的粗暴驱逐，以及此后数十年艰难而缓慢的文化和解工作。布拉格的歌德学院，正是这最后一章的机构化表达。

马萨里克滨河大道（Masarykovo nábřeží）上的这栋建筑——以捷克斯洛伐克建国者命名——是承载这类文化工作的颇为耐人寻味的地址。学院开设语言课程，举办展览，放映电影，默默而持续地在一座对德国文化存在拥有充分理由感到复杂情绪的城市里维系着德国文化的存在。总体而言，它做到了这一切而不引发事端——这本身就是一个值得承认的小小历史成就。

🥚 彩蛋：约翰·沃尔夫冈·冯·歌德——歌德学院便以他的名字命名——曾多次访问波西米亚，并对这片土地真心着迷。他在卡罗维瓦利（Karlovy Vary）先后逗留过十二次，爱上了这座温泉小城及其周围的风景，写下了颂咏波西米亚田园的诗篇。73岁时，他向在玛利亚温泉（Mariánské Lázně）邂逅的一位19岁姑娘乌尔里克·冯·勒维措夫（Ulrike von Levetzow）求婚。她拒绝了。他因此写下了《玛利安浴场悲歌》（Marienbad Elegy）——被许多学者视为德语文学中最杰出的抒情诗之一。歌德学院以这位男人的名字命名：他多次来到波西米亚，离开时带走了一首伟大诗篇，却留下了一段求婚落空的遗憾。文化交流以多种形式存在。`,
    },
  },
  {
    name: 'Grömling Palace',
    slug: 'palac-gromlingovsky',
    localizedNames: { cz: 'Palác Grömlingovský', zh: '格罗姆林宫' },
    labels: ['palace', 'historical', 'architecture'],
    coordinates: { lat: 50.08798324847662, lng: 14.404202688205755 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Grömling Palace (Palác Grömlingovský)!

Malá Strana — the Lesser Town — contains more Baroque palaces per square kilometre than perhaps anywhere else in Central Europe. This density is not accidental. After the Battle of White Mountain in 1620, when the Habsburgs crushed the Bohemian Protestant nobility and set about replacing it with a new Catholic aristocracy imported from across the empire, the winning side needed somewhere to live. They chose Malá Strana, beneath the castle, and built on a scale that reflected both their newfound wealth and the architectural fashion of the seventeenth century, which was Baroque: a style that understood conspicuous expenditure as a form of theological argument. Grömling Palace is one of these buildings — raised for a family that won, or at least aligned themselves carefully with the winning side, at the right moment.

The palace stands with the composed authority of a building that has housed various administrative functions across its history and has never been required to justify its own existence. Most visitors to Malá Strana walk straight past it on the way to better-signposted destinations. The palace accepts this with the impassive equanimity of Baroque architecture that was never built for admiration by passing tourists, but for the daily assertion of social position by the family that lived inside. The function has changed. The building has not.

🥚 Easter Egg: The redistribution of Bohemian property after 1620 was one of the most systematic transfers of wealth in European history. The Habsburg authorities confiscated estates from Protestant nobles and sold them at substantially reduced prices to Catholic supporters of the regime — a deliberate policy of economic as well as religious restructuring. Estimates suggest that roughly half of all land in Bohemia changed hands in the decades following White Mountain. The new Catholic aristocracy that built Malá Strana's palaces did so with property and capital that had belonged to someone else a generation earlier. Baroque architecture in Prague is beautiful. It is also, in a precise sense, the architectural record of a very large property transaction conducted at the point of a political and military sword.`,

      cz: `Statečný dobrodruhu, vítej v Paláci Grömlingovském!

Malá Strana obsahuje více barokních paláců na čtvereční kilometr než snad kdekoli jinde ve střední Evropě. Tato hustota není náhodná. Po bitvě na Bílé hoře roku 1620, kdy Habsburkové zdrtili českou protestantskou šlechtu a začali ji nahrazovat novou katolickou aristokracií přivezenou z celé říše, potřebovala vítězná strana někde bydlet. Zvolila si Malou Stranu pod hradem a stavěla v měřítku odrážejícím jak nově nabyté bohatství, tak architektonické módy sedmnáctého století — baroka: stavebního slohu, který chápal okázalé výdaje jako formu teologického argumentu. Palác Grömlingovský je jednou z takových staveb — postavenou pro rodinu, která zvítězila, nebo se alespoň ve správnou chvíli opatrně přidala na vítěznou stranu.

Palác stojí s klidnou autoritou budovy, která ve svých dějinách plnila nejrůznější správní funkce a nikdy nebyla nucena obhajovat svou vlastní existenci. Většina návštěvníků Malé Strany projde kolem něj přímo na cestě k lépe označeným destinacím. Palác to snáší s lhostejným klidem barokní architektury, která nikdy nebyla postavena pro obdiv procházejících turistů, nýbrž pro každodenní potvrzení společenského postavení rodiny, jež v ní bydlela. Funkce se změnila. Budova nikoli.

🥚 Velikonoční vajíčko: Přerozdělení českého majetku po roce 1620 bylo jedním z nejsystematičtějších přesunů bohatství v evropských dějinách. Habsburské úřady konfiskovaly statky protestantské šlechty a prodávaly je za podstatně sníženou cenu katolickým přívržencům režimu — záměrná politika hospodářské i náboženské restrukturalizace. Odhady naznačují, že v desetiletích po Bílé hoře změnila majitele zhruba polovina veškeré půdy v Čechách. Nová katolická aristokracie, která stavěla paláce Malé Strany, tak činila z majetku a kapitálu, jenž o generaci dříve patřil někomu jinému. Barokní architektura Prahy je krásná. Je také — v přesném slova smyslu — architektonickým záznamem velmi rozsáhlého majetkového převodu provedeného za pomoci politického a vojenského meče.`,

      zh: `勇敢的冒险家，欢迎来到格罗姆林宫（Palác Grömlingovský）！

小城区（Malá Strana）——即"小城"——每平方公里内拥有的巴洛克宫殿，数量之多可能冠绝中欧。这种密度绝非偶然。1620年白山之战后，哈布斯堡王朝击垮波西米亚新教贵族，并着手以从帝国各地引入的新天主教贵族取而代之——胜利者需要一个落脚的地方。他们选择了城堡山下的小城区，以一种体现其新获财富与17世纪建筑时尚的规模大兴土木，而那个时代的建筑时尚正是巴洛克：一种将炫耀性支出理解为神学论据的建筑风格。格罗姆林宫就是这样的建筑之一——为一个赢得了胜利、或至少在恰当时机审时度势地站在了胜利者一边的家族而建。

这座宫殿以一种沉着的权威感矗立于此，历史上承担过各种行政功能，从未被要求为自身的存在做任何辩护。大多数造访小城区的游客在前往更有知名度的目的地途中，会径直从它旁边走过。这座宫殿以巴洛克建筑特有的淡漠从容接受这一切——它从来不是为路过游客的欣赏而建，而是为居住其中的家族每日对社会地位的彰显而建。功能已经改变。建筑本身没有。

🥚 彩蛋：1620年后波西米亚财产的重新分配，是欧洲历史上最系统性的财富转移之一。哈布斯堡当局没收新教贵族的庄园，以大幅折扣的价格出售给效忠于政权的天主教支持者——这是一项蓄意推行的经济与宗教双重重构政策。有估计认为，在白山之战后的数十年间，波西米亚大约一半的土地都换了主人。建造小城区宫殿群的新天主教贵族，正是用一代人以前属于别人的财产与资本来进行这些建造的。布拉格的巴洛克建筑很美。它同时也是——在精确的意义上——一份关于一次大规模财产转让的建筑档案，而那次转让是借助政治与军事刀剑的力量完成的。`,
    },
  },
  {
    name: 'Hagibor',
    slug: 'hagibor',
    localizedNames: { cz: 'Hagibor', zh: '哈吉博尔' },
    labels: ['historical', 'hidden-gem', 'monument'],
    coordinates: { lat: 50.078596258163955, lng: 14.47777440228983 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Hagibor!

The word "Hagibor" comes from the Hebrew — הגיבור — meaning "the hero" or, more precisely, "the mighty man," drawn from a tradition of Zionist sports culture that believed in physical strength as an act of cultural and political self-assertion. The SC Hagibor sports club was established in Prague as part of a broader movement of Jewish sports clubs across Central Europe in the late nineteenth and early twentieth centuries — a deliberate response to the antisemitic stereotype of the physically weak Jew, and an assertion of Jewish belonging in the civic life of the city. Jewish athletes ran, swam, boxed, and played football on Hagibor's grounds in the Žižkov/Vinohrady district. The club was a statement of presence.

In 1942, the Nazis converted the Hagibor sports ground into an assembly site and forced labour camp for Prague's Jewish population. The same fields where Jewish athletes had trained were used to concentrate, register, and prepare Prague's Jews for deportation to the concentration camp system. The precise, mundane reversal is difficult to absorb: the same ground, the same buildings, turned toward the opposite of everything they had been built for. After the war, sports activity resumed. The ground continued to be used. The history remained, mostly in silence.

🥚 Easter Egg: The Jewish Zionist sports movement of which Hagibor was a part produced one of the quietly significant precedents in the history of international sport. The Maccabi World Union — founded in 1921 and still active — is the world's oldest active international sports federation. Its Games, the Maccabiah, have been held since 1932, making them older than many national Olympic teams of countries that now send delegations to Games they did not know existed when Hagibor's athletes were still training in Žižkov. The Maccabiah Games are the third-largest multi-sport event in the world by number of participants, after the Olympics and the World Games. The "hero" of Hagibor's name is not a metaphor.`,

      cz: `Statečný dobrodruhu, vítej na Hagiboru!

Slovo "Hagibor" pochází z hebrejštiny — הגיבור — a znamená "hrdina" nebo přesněji "mocný muž", čerpajíc z tradice sionistické sportovní kultury, jež věřila v tělesnou sílu jako akt kulturního a politického sebeprosazení. Sportovní klub SC Hagibor byl v Praze založen jako součást širšího hnutí židovských sportovních klubů po střední Evropě na přelomu devatenáctého a dvacátého století — záměrná odpověď na antisemitský stereotyp fyzicky slabého Žida a prosazení židovské přítomnosti ve veřejném životě města. Židovští atleti v Hagiboru v žižkovsko-vinohrádské čtvrti běhali, plavali, boxovali a hráli fotbal. Klub byl prohlášením o přítomnosti.

V roce 1942 nacisté přeměnili Hagibor ve sběrné místo a nucený pracovní tábor pro pražskou židovskou populaci. Tatáž sportoviště, kde trénovali židovští atleti, byla použita ke koncentraci, evidenci a přípravě pražských Židů k deportaci do systému koncentračních táborů. Toto přesné, banální obrácení je těžko vstřebatelné: tentýž pozemek, tytéž budovy, obrácené k pravému opaku všeho, pro co byly vybudovány. Po válce sportovní aktivity pokračovaly. Areál byl nadále využíván. Dějiny zůstaly přítomny, většinou v tichu.

🥚 Velikonoční vajíčko: Židovské sionistické sportovní hnutí, jehož součástí byl Hagibor, přineslo jeden z tišších, ale závažných precedentů v dějinách mezinárodního sportu. Světová organizace Makabi — founded v roce 1921 a stále aktivní — je nejstarší aktivní mezinárodní sportovní federací na světě. Její hry, Makabi, se konají od roku 1932, čímž jsou starší než mnohé národní olympijské týmy zemí, které nyní vysílají delegace na hry, o nichž nevěděly, že existují, když ještě trénovali atleti Hagiboru na Žižkově. Hry Makabi jsou třetím největším vícesportovním podnikem na světě podle počtu účastníků, po olympijských hrách a světových hrách. "Hrdina" z názvu Hagiboru není metafora.`,

      zh: `勇敢的冒险家，欢迎来到哈吉博尔（Hagibor）！

"哈吉博尔"（Hagibor）这个词源自希伯来语——הגיבור——意为"英雄"，更精确地说是"强壮的勇士"，来自锡安主义体育文化中一种相信体能是文化与政治自我主张行为的传统。SC哈吉博尔体育俱乐部在布拉格成立，是中欧犹太体育俱乐部运动更广泛浪潮的一部分——19世纪末20世纪初，这场运动是对"犹太人体弱多病"这一反犹刻板印象的刻意回应，也是对犹太人在城市公民生活中存在的一次主张。在日瓦科夫（Žižkov）与维诺赫拉迪（Vinohrady）之间的哈吉博尔场地里，犹太运动员奔跑、游泳、拳击、踢足球。这个俱乐部是一种"我们在这里"的宣言。

1942年，纳粹将哈吉博尔运动场改造为布拉格犹太人的集合地点和强制劳动营。那些曾经是犹太运动员训练场地的运动场，被用于集中、登记布拉格的犹太人，并为将他们遣送至集中营体系做准备。这种精确而平庸的逆转难以被吸纳接受：同一块土地，同一批建筑，被转向了与建造它们的一切目的截然相反的用途。战后，体育活动在这里重新开展。场地继续被使用。历史还在，大多时候沉默无言。

🥚 彩蛋：哈吉博尔所属的犹太锡安主义体育运动，在国际体育史上留下了一个较为低调却颇具意义的先例。世界马卡比联盟（Maccabi World Union）——创立于1921年，至今仍活跃——是世界上历史最悠久的现役国际体育联合会。其运动会"马卡比运动会"（Maccabiah）自1932年起举办，历史早于许多如今参加奥运会的国家的国家奥委会——而那些国家在哈吉博尔的运动员仍在日瓦科夫训练时，根本不知道有这样的运动会存在。马卡比运动会按参赛人数计算，是全球第三大综合运动会，仅次于奥运会和世界运动会。哈吉博尔名字中的"英雄"，不是一个比喻。`,
    },
  },
  {
    name: 'Hanavský Pavilon',
    slug: 'hanavsky-pavilon',
    localizedNames: { cz: 'Hanavský Pavilon', zh: '哈纳夫斯基亭' },
    labels: ['architecture', 'historical', 'landmark'],
    coordinates: { lat: 50.09366496113001, lng: 14.412623330368751 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Hanavský Pavilon!

In 1891, the Kingdom of Bohemia staged a General Land Centennial Exhibition to mark the hundredth anniversary of an exhibition held under Joseph II. It was the kind of exposition that the late nineteenth century excelled at: enormous, technically ambitious, industrial in scale, and determined to demonstrate that Bohemian industry, culture, and craft were capable of standing alongside any comparable expression in the world. The centennial exhibition attracted over two and a half million visitors over several months. Among its many pavilions, one — designed by the architect Otto Hieser and fabricated entirely in cast iron — distinguished itself through a combination of structural ambition and decorative excess that reads today as the most extravagant possible disagreement with the idea of architectural restraint. After the exhibition closed, it was donated to the city and relocated to Letná Park, where it has stood ever since above the bend of the Vltava.

The pavilion functions today as a restaurant, which is the best possible outcome: a building this decoratively specific, sitting atop a view of Prague this comprehensively spectacular, would be wasted as anything that did not involve people sitting still long enough to appreciate both. The iron lacework of the exterior — neo-rococo flourishes cast in a material associated with industry and bridge-building — is one of Prague's quieter aesthetic paradoxes: the most delicate-looking thing in the park is made of metal. The view from the terrace takes in the Vltava's curve, the Old Town rooftops, and on clear days a horizon that establishes very precisely why this city has been considered worth fighting over for a thousand years.

🥚 Easter Egg: The 1891 Jubilee Exhibition had a pavilion designed by a young architect named Jan Kotěra, who went on to become the founder of modern Czech architecture. It also featured one of the first electric railways in Bohemia, running through the exhibition grounds. But its most consequential contribution to Prague's permanent cityscape was almost accidental: the temporary infrastructure built for the exhibition included a funicular up Petřín hill, which was subsequently made permanent. Hanavský Pavilon was also made permanent — a gift from Prince Wilhelm of Hanau, a German aristocrat with industrial interests who donated it to the city of Prague. A German prince's generosity is why one of the most photographed views in Prague has an ornate cast-iron pavilion in the foreground. The history of city aesthetics is substantially a history of inherited gifts and repurposed temporary structures.`,

      cz: `Statečný dobrodruhu, vítej v Hanavském Pavilonu!

V roce 1891 uspořádalo Království české Všeobecnou zemskou jubilejní výstavu při příležitosti stého výročí výstavy pořádané za Josefa II. Byl to typ expozice, v níž se pozdní devatenácté století vyžívalo: obrovská, technicky ambiciózní, průmyslová svým rozsahem a odhodlaná prokázat, že český průmysl, kultura a řemeslo jsou schopny obstát vedle čehokoli srovnatelného ve světě. Jubilejní výstava přilákala za několik měsíců přes dva a půl milionu návštěvníků. Mezi mnohými pavilony vynikal jeden — navržený architektem Ottem Hieserem a vyrobený celý z litiny — kombinací konstrukční ambice a dekorativní přemíry, která dnes působí jako nejokázalejší možný nesouhlas s představou architektonické zdrženlivosti. Po skončení výstavy byl věnován městu a přesunut do Letenských sadů, kde od té doby stojí nad zákrutem Vltavy.

Pavilon dnes funguje jako restaurace, což je nejlepší možný výsledek: budova s tak specifickými dekorativními prvky, sedící nad takto komplexně velkolepým výhledem na Prahu, by byla promarněna čímkoli jiným než místem, kde lidé sedí dost dlouho, aby ocenili obojí. Litinová krajka exteriéru — neorokoko v materiálu spojeném s průmyslem a stavbou mostů — je jedním z tišších pražských estetických paradoxů: nejjemnější věc v parku je vyrobena z kovu. Výhled z terasy zahrnuje Vltavský oblouk, střechy Starého Města a za jasných dnů horizont, který přesně vysvětluje, proč bylo toto město považováno za hodné bojů po tisíc let.

🥚 Velikonoční vajíčko: Jubilejní výstava roku 1891 měla pavilon navržený mladým architektem Janem Kotěrou, který se stal zakladatelem moderní české architektury. Zahrnovala také jednu z prvních elektrických železnic v Čechách, vedoucí výstavištěm. Jejím nejvýznamnějším příspěvkem k trvalému panoramatu Prahy však byl takřka náhodný: dočasná infrastruktura postavená pro výstavu zahrnovala lanovku na Petřín, která byla následně ponechána natrvalo. Hanavský pavilon byl rovněž ponechán natrvalo — jako dar prince Viléma Hanavského, německého aristokrata s průmyslovými zájmy, který ho věnoval městu Praze. Štědrost německého prince je důvodem, proč jeden z nejfotografovanějších výhledů Prahy má v popředí zdobný litinový pavilon. Dějiny městské estetiky jsou v podstatné míře dějinami zděděných darů a přebudovaných dočasných staveb.`,

      zh: `勇敢的冒险家，欢迎来到哈纳夫斯基亭（Hanavský Pavilon）！

1891年，波西米亚王国举办了一场全国土地百年纪念博览会，以纪念约瑟夫二世时代一场博览会的百周年。这是19世纪末最拿手的那种博览会：规模庞大、技术上雄心勃勃、工业气息十足，一心要向世界证明波西米亚的工业、文化与工艺足以与任何同类表达并驾齐驱。这场百年纪念博览会历时数月，吸引了超过两百五十万名游客。在众多展馆中，有一座格外出众——由建筑师奥托·希泽尔（Otto Hieser）设计，完全以铸铁制成——其结构上的雄心与装饰上的过度奢华结合在一起，在今天看来是对"建筑克制"这一理念最为铺张的公开异议。博览会结束后，它被捐赠给了这座城市，并迁移至莱腾公园（Letná Park）现址，此后便一直矗立在伏尔塔瓦河大弯的上方。

这座亭子如今作为餐厅使用，这是最好的结局：一座装饰如此别具一格、俯瞰布拉格全景如此叹为观止的建筑，如果不是用来让人们坐下来、静静地将这两者都欣赏个够，那就是一种浪费。外立面的铸铁花饰——用一种与工业和桥梁建造相关的材料铸造的新洛可可风格——是布拉格最安静的美学悖论之一：公园里看起来最精致轻盈的东西，是用金属做的。从露台望出去，伏尔塔瓦河的弯曲、老城的屋顶，以及晴天时那条将这座城市为何值得争夺了一千年清晰呈现出来的地平线，尽收眼底。

🥚 彩蛋：1891年的百年纪念博览会有一座展馆是由一位名叫扬·科特拉（Jan Kotěra）的年轻建筑师设计的，他后来成为现代捷克建筑的奠基人。博览会还设有波西米亚最早的电气铁路之一，穿越展览场地运行。然而它对布拉格永久城市景观最具意义的贡献，几乎是偶然为之的：为博览会建造的临时基础设施包括一条通往彼得任山（Petřín）的缆车线路，而这条线路随后被永久保留了下来。哈纳夫斯基亭也被永久保留——作为哈纳夫斯卡王子（Prince Wilhelm of Hanau）的礼物，这位拥有工业利益的德国贵族将其捐赠给了布拉格市。正是一位德国亲王的慷慨大方，让布拉格最常被拍摄的景观之一，在前景中多了一座精巧的铸铁亭子。城市美学的历史，在很大程度上是一部关于馈赠遗产与再利用临时建筑的历史。`,
    },
  },
  {
    name: 'Havlíčkovo náměstí',
    slug: 'havlickovo-namesti',
    localizedNames: { cz: 'Havlíčkovo náměstí', zh: '哈夫利切科广场' },
    labels: ['square', 'historical', 'architecture'],
    coordinates: { lat: 50.08510268712071, lng: 14.454266101218957 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Havlíčkovo náměstí — Havlíček Square!

In the elegant, leafy residential quarter of Vinohrady, this square bears the name of Karel Havlíček Borovský (1821–1856): Czech journalist, satirist, editor, and the man the Austrian Empire feared enough to exile. At a time when the Czech language was fighting to reclaim cultural and political space from German domination, Havlíček built three newspapers from scratch, used irony and satire as precision instruments of political resistance, and wrote with a clarity of purpose that made him genuinely dangerous to the authorities who preferred their subjects quietly compliant.

In 1851, the Habsburg government had had enough. Austrian police escorted him to Brixen in the South Tyrol — today Bressanone in northern Italy — where he spent four years in enforced exile, separated from his wife and daughter, both of whom died before he returned. He came back to Bohemia a broken man in health but not in spirit. He died in 1856, aged thirty-four, of tuberculosis contracted during his exile. The Austrian press was forbidden from noting his death. Thousands of Czechs attended his funeral anyway.

The square named after him in Vinohrady is a civilised urban space entirely in keeping with its subject: it does not shout. It does not need to. It simply stands here, in one of Prague's most liveable neighbourhoods, attached to the name of a man who spent his life fighting for the right to say things out loud.

🥚 Easter Egg: Havlíček's most celebrated work is Tyrolian Elegies, a satirical cycle of poems he wrote about his own exile — using verse form to document the absurdity of being politely but coercively relocated to the Alps for the crime of journalism. He addressed the poems to the police official who had organised the deportation. They are among the finest political satire in Czech literary history, written with a lightness that makes the anger underneath all the more effective. Czechs have a particular gift for surviving official oppression through irony, and Havlíček is one of the founding fathers of that tradition.`,

      cz: `Statečný dobrodruhu, vítej na Havlíčkově náměstí!

Ve vznosných, zelených Vinohradech nese toto náměstí jméno Karla Havlíčka Borovského (1821–1856): českého novináře, satirika, redaktora a muže, kterého se Rakouské císářství bálo natolik, že ho raději vyhnalo. V době, kdy čeština bojovala o znovudobytí kulturního a politického prostoru z nadvlády němčiny, vybudoval Havlíček od nuly tři noviny, používal ironii a satiru jako přesné nástroje politického odporu a psal s takovou jasností úmyslu, že byl pro úřady, které preferovaly poslušné poddané, skutečně nebezpečný.

V roce 1851 habsburské vládě došla trpělivost. Rakouská policie ho dopravila do Brixenu v Jižním Tyrolsku — dnešní Bressanone v severní Itálii — kde strávil čtyři roky nuceného exilu, oddělen od manželky a dcery, které obě zemřely dříve, než se vrátil. Vrátil se do Čech tělesně zlomený, avšak duchem ne. V roce 1856 zemřel na tuberkulózu, ve věku třiceti čtyř let, kontrahovanou v exilu. Rakouský tisk dostal zákaz jeho smrt zaznamenat. Přesto se jeho pohřbu zúčastnily tisíce Čechů.

Náměstí, které nese jeho jméno na Vinohradech, je civilizovaný městský prostor zcela odpovídající svému nositeli: nekřičí. Nepotřebuje to. Prostě tu stojí, v jedné z nejpříjemnějších čtvrtí Prahy, nesoucí jméno muže, který zasvětil život boji za právo říkat věci nahlas.

🥚 Velikonoční vajíčko: Nejslavnějším Havlíčkovým dílem jsou Tyrolské elegie — satirický cyklus básní, které napsal o vlastním vyhnanství a v nichž básnickým tvarem dokumentuje absurditu toho, že ho zdvořile, leč nátlakem přestěhovali do Alp za zločin novinářství. Básně adresoval policejnímu úředníkovi, který deportaci zorganizoval. Patří k nejlepší politické satiře v české literární historii, psané s lehkostí, která dělá hněv pod ní o to účinnějším. Češi mají zvláštní dar přežívat úřední útlak pomocí ironie, a Havlíček je jedním ze zakladatelů této tradice.`,

      zh: `勇敢的冒险家，欢迎来到哈夫利切科广场（Havlíčkovo náměstí）！

在维诺赫拉迪（Vinohrady）这片优雅葱郁的住宅区，这座广场以卡雷尔·哈夫利切克·博罗夫斯基（Karel Havlíček Borovský，1821—1856）的名字命名：捷克记者、讽刺作家、编辑，以及一个让奥地利帝国忌惮到足以将他驱逐出境的人。在捷克语正奋力从德语文化霸权中夺回文化和政治空间的年代，哈夫利切克从零开始创办了三份报纸，将讽刺与反语作为精准的政治抵抗工具，以一种让当局深感威胁的清晰姿态写作——那些当局更希望臣民保持顺从沉默。

1851年，哈布斯堡政府终于忍无可忍。奥地利警察将他押送至南蒂罗尔的布里克森（Brixen，今意大利北部布雷萨诺内），在那里他度过了四年强制流亡的岁月，与妻子和女儿天各一方——她们在他归来之前双双离世。他回到波西米亚时，身体已被摧毁，但精神未曾折断。1856年，他因流亡期间染上的肺结核去世，年仅三十四岁。奥地利报纸被禁止报道他的死讯。但数千名捷克人依然前来参加他的葬礼。

以他命名的维诺赫拉迪广场，是一个完全符合其命名者气质的文明城市空间：它不喧嚣。它不需要。它就这样静静地站在布拉格最宜居的街区之一，承载着一个用一生争取"大声说出来"这项权利的人的名字。

🥚 彩蛋：哈夫利切克最著名的作品是《蒂罗尔哀歌》（Tyrolian Elegies）——他用一组讽刺性的诗篇记录了自己的流亡经历，以诗歌形式呈现了那种"因为从事新闻工作"而被礼貌而强制地迁往阿尔卑斯山的荒诞。他将这些诗直接献给了策划这次驱逐的警察官员。这些作品是捷克文学史上最优秀的政治讽刺之作，写得如此轻盈，以至于藏在文字之下的愤怒更加令人震动。捷克人有一种通过讽刺来抵御官方压迫的特殊天赋，而哈夫利切克是这一传统的奠基人之一。`,
    },
  },
  {
    name: 'Holešovice Docks',
    slug: 'holesovice-docks',
    localizedNames: { cz: 'Holešovické přístaviště', zh: '霍莱绍维采码头' },
    labels: ['historical', 'landmark', 'architecture'],
    coordinates: { lat: 50.10893022955608, lng: 14.454636010922222 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Holešovice Docks (Holešovické přístaviště)!

You are standing at the edge of one of Prague's most significant industrial inheritances — a working river port that once made this stretch of the Vltava the commercial heartbeat of northern Prague. The Holešovice docks were developed in the late nineteenth century when Holešovice was still a separate municipality outside the city's boundaries, rapidly industrialising around textiles, gas production, and river trade. By the early twentieth century, this port was handling millions of tonnes of coal, timber, sand, and grain, serving the inland waterway trade that connected Prague to the Elbe and, via the Elbe, to Hamburg and the North Sea.

The riverbank here tells a story of the industrial city that built modern Prague — not the city of Baroque churches and medieval towers that features on postcards, but the city of workers, factories, river barges, and unglamorous logistics without which none of the rest would have functioned. Holešovice spent the twentieth century as a working-class district of genuine character, absorbing waves of migration and hosting the enormous Výstaviště exhibition grounds and the National Gallery's modern art collection at the Veletržní Palác. The docks have recently become the focus of ambitious urban redevelopment plans that will reshape this riverfront over the coming decades.

🥚 Easter Egg: The Vltava was once a far busier commercial artery than it appears today. Before rail dominated freight, river barges were the most efficient way to move heavy goods through Bohemia. Logs were floated downstream from the mountains in enormous rafts, guided by raftsmen — pltníci — who formed a distinct professional class with their own traditions, taverns, and patron saint. The patron saint of Czech raftsmen is St. John of Nepomuk, who was himself thrown into the Vltava and is therefore considered to have a certain professional solidarity with anyone whose livelihood depends on its currents. He is simultaneously Prague's most frequently depicted saint and history's most qualified river safety advocate.`,

      cz: `Statečný dobrodruhu, vítej na Holešovickém přístavišti!

Stojíš na okraji jednoho z nejvýznamnějších průmyslových dědictví Prahy — pracovního říčního přístavu, který kdysi z tohoto úseku Vltavy učinil obchodní tepnu severní Prahy. Holešovický přístav byl budován na konci devatenáctého století, kdy Holešovice byly ještě samostatnou obcí mimo hranice města, rychle se industrializující kolem textilní výroby, plynárenství a říčního obchodu. Na počátku dvacátého století přístav zpracovával miliony tun uhlí, dřeva, písku a obilí a sloužil vnitrozemské vodní dopravě, která spojovala Prahu s Labem a přes Labe s Hamburkem a Severním mořem.

Nábřeží zde vypráví příběh průmyslového města, které vybudovalo moderní Prahu — ne města barokních kostelů a středověkých věží, které se objevují na pohlednicích, ale města dělníků, továren, říčních člunů a bezmocistické logistiky, bez níž by nic jiného nefungovalo. Holešovice strávily dvacáté století jako dělnická čtvrť autentického charakteru, vstřebávající vlny migrace a hostující obrovský výstaviště a sbírku moderního umění Národní galerie ve Veletržním paláci. Přístaviště se v posledních letech stalo předmětem ambiciózních plánů městské přestavby, které v nadcházejících desetiletích zásadně promění tento říční břeh.

🥚 Velikonoční vajíčko: Vltava bývala daleko rušnější obchodní tepnou, než se dnes zdá. Předtím, než železnice ovládla nákladní dopravu, byly říční lodě nejefektivnějším způsobem přepravy těžkého zboží přes Čechy. Kmeny se z hor pluly po proudu v obrovských vorech, vedené vorníky — svébytnou profesní třídou s vlastními tradicemi, hospodami a patronem. Patronem českých vorníků je sv. Jan Nepomucký, který byl sám vhozen do Vltavy, a proto se má za to, že sdílí určitou profesní solidaritu s každým, jehož živobytí závisí na jejích proudech. Je zároveň nejčastěji zobrazovaným světcem Prahy i historicky nejkvalifikovanějším zastáncem bezpečnosti na řece.`,

      zh: `勇敢的冒险家，欢迎来到霍莱绍维采码头（Holešovické přístaviště）！

你站在布拉格最重要工业遗产之一的边缘——一个曾经让这段伏尔塔瓦河岸成为北布拉格商业命脉的工作河港。霍莱绍维采码头建于19世纪末，彼时霍莱绍维采（Holešovice）还是城市边界之外的一个独立市镇，正在纺织业、煤气生产和河运贸易的驱动下迅速工业化。到20世纪初，这个港口每年处理数百万吨煤炭、木材、沙石和谷物，服务于连接布拉格与易北河（Elbe），并经由易北河通向汉堡和北海的内陆水运贸易网络。

这片河岸讲述的是建造现代布拉格的工业城市的故事——不是那座出现在明信片上、有巴洛克教堂和中世纪塔楼的城市，而是那座有工人、工厂、货运驳船和毫无光鲜感却不可或缺的物流系统的城市，没有那些，其他一切都无从运转。霍莱绍维采整个20世纪都是一个有着真实性格的工人阶级街区，接纳了一波波移民浪潮，坐拥巨大的Výstaviště展览场和位于维列什尼宫（Veletržní Palác）的国家现代艺术画廊。近年来，码头区已成为雄心勃勃的城市更新规划的核心地带，这些规划将在未来数十年里重塑这片河岸。

🥚 彩蛋：伏尔塔瓦河曾经是一条比今天繁忙得多的商业动脉。在铁路主导货运之前，货运驳船是穿越波西米亚运输重型货物最有效的方式。圆木从山区顺流而下，被绑成巨大的木筏漂向下游，由筏工（pltníci）引导——他们形成了一个独特的职业群体，有着自己的传统、自己的酒馆和自己的主保圣人。捷克筏工的主保圣人，正是被投入伏尔塔瓦河的圣约翰·内波穆克——于是他被认为与所有靠这条河谋生之人共享着某种职业上的团结。他同时也是布拉格最常被雕绘的圣人，以及历史上资历最深的河流安全倡导者。`,
    },
  },
  {
    name: 'Holešovice Brewery',
    slug: 'holesovicky-pivovar',
    localizedNames: { cz: 'Holešovický pivovar', zh: '霍莱绍维采啤酒厂' },
    labels: ['historical', 'hidden-gem', 'architecture'],
    coordinates: { lat: 50.10561716147057, lng: 14.450072235434703 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Holešovický pivovar — the First Prague Citizens' Brewery (První pražský měšťanský pivovar)!

In 1895, this brewery was founded with a distinction that mattered enormously to the people of Prague: it was the first brewery in the city built not by the nobility, not by a monastery, and not by a royal charter, but by ordinary citizens — měšťané, burghers — pooling capital through a cooperative shareholding structure to take ownership of their own beer production. In a city where the right to brew was historically a noble or ecclesiastical privilege, this represented a democratic act in a very specific and very Czech sense: the assertion that ordinary people should be able to make, own, and profit from the thing they loved most.

The brewery complex, built in the late Victorian industrial style characteristic of Holešovice in this period, is a substantial piece of late nineteenth-century industrial architecture. The brick buildings with their characteristic chimney and storage halls reflect the serious ambition of its founders. Production continued here for most of the twentieth century, making it one of the longest-running breweries in the city. Today the complex has been repurposed as a cultural venue and event space — concerts, markets, festivals — keeping the sociable spirit of its origins intact, if not the beer.

🥚 Easter Egg: The Czech cooperative brewery movement was part of a broader National Revival strategy. Control of economic institutions — banks, insurance companies, breweries — was understood by Czech intellectuals and business leaders as an essential component of national self-determination that did not require political independence to begin with. By building a Czech-owned, citizen-held brewery in 1895, the founders were not just making economic choices — they were making cultural ones. They were asserting that Czech Prague had the organisational capacity and the capital to compete with German-owned enterprises on equal terms. The beer was the product. The brewery was the argument.`,

      cz: `Statečný dobrodruhu, vítej v Holešovickém pivovaru — Prvním pražském měšťanském pivovaru!

V roce 1895 byl tento pivovar founded s výjimečností, která pro Pražany mnoho znamenala: byl prvním pivovarem ve městě postaveným nikoli šlechtou, nikoli klášterem, nikoli na základě královské listiny, ale obyčejnými měšťany, kteří sdružili kapitál prostřednictvím družstevního akciového systému, aby se zmocnili vlastní výroby piva. Ve městě, kde právo vařit pivo bylo historicky šlechtickým nebo církevním privilegiem, to byl demokratický čin ve velmi specifickém a velmi českém smyslu: prosazení, že obyčejní lidé by měli mít možnost vyrábět, vlastnit a těžit ze věci, kterou milují nejvíce.

Pivovarský komplex, postavený v pozdně viktoriánském průmyslovém stylu charakteristickém pro Holešovice tohoto období, je podstatnou ukázkou průmyslové architektury konce devatenáctého století. Cihlové budovy s charakteristickým komínem a skladišti odrážejí seriózní ambice jeho zakladatelů. Výroba zde pokračovala po většinu dvacátého století, což z pivovaru učinilo jeden z nejdéle fungujících ve městě. Dnes byl komplex přeměněn na kulturní místo a prostor pro akce — koncerty, trhy, festivaly — přičemž společenský duch jeho počátků zůstal zachován, i když ne pivo.

🥚 Velikonoční vajíčko: České družstevní pivovarnické hnutí bylo součástí širší strategie Národního obrození. Kontrola hospodářských institucí — bank, pojišťoven, pivovarů — byla chápána českými intelektuály a obchodními vůdci jako základní součást národní sebeurčení, která nevyžadovala politickou nezávislost od počátku. Vybudováním česky vlastněného, občany drženého pivovaru v roce 1895 nedělali jeho zakladatelé jen ekonomická rozhodnutí — dělali kulturní. Prosazovali, že česká Praha má organizační kapacitu a kapitál ke konkurenci německy vlastněných podniků za rovných podmínek. Pivo byl produkt. Pivovar byl argument.`,

      zh: `勇敢的冒险家，欢迎来到霍莱绍维采啤酒厂（Holešovický pivovar）——布拉格第一家市民啤酒厂（První pražský měšťanský pivovar）！

1895年，这家啤酒厂以一种对布拉格人意义重大的特别方式宣告成立：它是这座城市第一家由普通市民（měšťané，即市民阶层）共同出资兴建的啤酒厂——既不是贵族的，也不是修道院的，更不是依靠王室特许状的，而是通过合作制股份结构将资本汇聚起来，自主掌控啤酒生产。在一座"酿酒权"历来是贵族或教会特权的城市里，这是一种非常具体、非常捷克式的民主行动：普通人有权酿造、拥有并从自己最热爱的东西中受益。

这座啤酒厂建筑群采用了彼时霍莱绍维采地区特有的维多利亚晚期工业风格，是19世纪末工业建筑的重要遗存。红砖建筑配以标志性的烟囱和仓储大厅，折射出创始人的宏大抱负。酿酒生产在这里持续了20世纪的大部分时间，使这家啤酒厂成为布拉格运营时间最长的酒厂之一。如今，整个建筑群已被改造为文化场所和活动空间——举办音乐会、集市、节庆——保留了其创始初衷中那种热爱聚会交流的精神，即便啤酒已不再生产。

🥚 彩蛋：捷克合作制酿酒运动是更广泛的"民族复兴"策略的组成部分。对经济机构的控制——银行、保险公司、啤酒厂——被捷克知识分子和商界领袖视为民族自决不可或缺的组成部分，且不必等到政治独立才能开始。1895年建立这家由捷克人拥有、市民持股的啤酒厂，创始人们做出的不仅仅是经济选择——更是文化选择。他们在宣示：捷克布拉格拥有与德语企业在平等条件下竞争的组织能力和资本实力。啤酒是产品。啤酒厂是论点。`,
    },
  },
  {
    name: 'Hospital of the Sisters of Mercy of St. Charles Borromeo',
    slug: 'nemocnice-milosrdnych-sester',
    localizedNames: { cz: 'Nemocnice Milosrdných sester sv. Karla Boromejského', zh: '圣博罗梅乌仁慈姐妹医院' },
    labels: ['historical', 'architecture', 'landmark'],
    coordinates: { lat: 50.08706001995986, lng: 14.39599769480772 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Hospital of the Sisters of Mercy of St. Charles Borromeo in Prague (Nemocnice Milosrdných sester sv. Karla Boromejského)!

This hospital has been providing medical care in Malá Strana continuously since 1837, when the Sisters of Mercy of St. Charles Borromeo — a religious nursing congregation founded in Strasbourg in 1652 — were invited to Prague by Archbishop Jan Chlumčanský. Their arrival brought professional nursing care to Prague at a moment when the city had no dedicated training for medical carers and hospitals were largely staffed by whoever happened to be available. The Sisters changed this with systematic rigour: they trained, organised, and worked in the most demanding conditions the nineteenth century could produce, including cholera epidemics and wartime medical care that required them to work far beyond the walls of this building.

St. Charles Borromeo himself (1538–1584) was an Italian cardinal, Archbishop of Milan, and one of the central figures of the Counter-Reformation. His defining act was his response to the plague of 1576, when he personally ministered to the sick in Milan while most of the nobility and clergy fled the city. He sold his personal assets to fund food and medicine for plague victims. He stayed. He is the patron of plague victims, catechists, and seminarians — as well as, improbably, apple orchards. The apple orchard connection has never been satisfactorily explained to historians. The rest makes sense.

🥚 Easter Egg: The Sisters of Mercy of St. Charles Borromeo have a second, much quieter claim to Prague's attention. During the Second World War, members of their congregation assisted in concealing Jewish residents and supported the Czech resistance network — a choice that put them at serious risk under Nazi occupation. This kind of institutional courage is rarely commemorated on plaques and, if recorded at all, exists only in the Order's own archives. The capacity of quiet organisations to do consequential things without requiring recognition is, in its own way, a form of spiritual practice that continues the logic of the man whose name they bear.`,

      cz: `Statečný dobrodruhu, vítej v Nemocnici Milosrdných sester sv. Karla Boromejského v Praze!

Tato nemocnice poskytuje lékařskou péči na Malé Straně nepřetržitě od roku 1837, kdy byly Milosrdné sestry sv. Karla Boromejského — kongregace sester zdravotnic founded v Štrasburku v roce 1652 — pozvány do Prahy arcibiskupem Janem Chlumčanským. Jejich příchod přinesl Praze profesionální ošetřovatelskou péči v době, kdy město nemělo žádné systematické vzdělávání pro zdravotní pracovníky a nemocnice byly z větší části obsazeny kýmkoli, kdo byl k dispozici. Sestry to změnily se systematickou přísností: vzdělávaly se, organizovaly a pracovaly v nejnáročnějších podmínkách, které devatenácté století mohlo přinést, včetně cholerovch epidemií a válečné péče, která je nutila pracovat daleko za zdmi této budovy.

Sám sv. Karel Boromejský (1538–1584) byl italský kardinál, arcibiskup milánský a jedna z ústředních postav protireformace. Jeho určující čin byl jeho reakce na mor roku 1576, kdy osobně sloužil nemocným v Miláně, zatímco většina šlechty a kléru z města uprchla. Prodal svůj osobní majetek, aby financoval jídlo a léky pro oběti moru. Zůstal. Je patronem obětí moru, katechetů a seminářistů — a také, nepravděpodobně, jabloňových sadů. Spojení s jabloňovými sady zůstává historikům nevysvětlitelné. Zbytek dává smysl.

🥚 Velikonoční vajíčko: Milosrdné sestry sv. Karla Boromejského mají druhý, mnohem tišší nárok na pražskou pozornost. Během druhé světové války příslušnice jejich kongregace pomáhaly skrývat žydovské obyvatele a podporovaly českou odbojovou síť — volba, která je za nacistické okupace vystavovala vážnému nebezpečí. Tento druh institucionální odvahy je zřídka připomínán pamětními deskami a pokud vůbec existuje záznam, pak jen v archivech samotného řádu. Schopnost tichých organizací dělat zásadní věci bez požadování uznání je svým způsobem formou duchovní praxe, která pokračuje v logice muže, jehož jméno nesou.`,

      zh: `勇敢的冒险家，欢迎来到布拉格圣博罗梅乌仁慈姐妹医院（Nemocnice Milosrdných sester sv. Karla Boromejského）！

自1837年以来，这家医院在小城区（Malá Strana）持续提供医疗服务——那一年，圣博罗梅乌仁慈姐妹会（Milosrdné sestry sv. Karla Boromejského）——一个1652年在斯特拉斯堡创立的护理修道女团体——应大主教扬·赫鲁姆昌斯基（Jan Chlumčanský）之邀来到布拉格。她们的到来，在布拉格尚无任何系统性医护培训、医院基本上靠临时凑人手运营的年代，带来了专业化的护理服务。修女们以严格的系统性彻底改变了这一局面：她们接受培训、自我组织，在19世纪所能提供的最艰难条件下工作，包括霍乱流行和战时护理，那些情境要求她们将工作延伸到这座建筑的围墙之外。

圣博罗梅乌（Carlo Borromeo，1538—1584）本人是意大利枢机主教、米兰大主教，宗教改革反对运动的核心人物之一。他最具决定性意义的行动，是他对1576年米兰瘟疫的回应：在大多数贵族和神职人员逃离城市时，他亲自留在米兰为病人服务。他变卖个人财产为瘟疫受害者筹备食物和药品。他留了下来。他是瘟疫受害者、教义问答师和神学院学生的主保圣人——以及，出人意料地，苹果园的主保圣人。苹果园那条关联，历史学家至今未能找到令人满意的解释。其余的都说得通。

🥚 彩蛋：圣博罗梅乌仁慈姐妹会还有另一项更为低调的历史功绩。二战期间，该修道女团体的成员协助藏匿犹太居民，并为捷克地下抵抗网络提供支持——在纳粹占领下，这是一个将她们置于严重危险中的选择。这类机构性的勇气鲜少被铭牌纪念，即便有记录，也只存于修道团体自己的档案之中。安静的组织在不寻求认可的情况下完成重要事情的能力，本身就是一种精神修行的方式，延续着她们所承载的那个名字背后的逻辑。`,
    },
  },
  {
    name: 'U Zlatého tygra',
    slug: 'u-zlateho-tygra',
    localizedNames: { cz: 'U Zlatého tygra', zh: '金虎酒馆' },
    labels: ['restaurants-and-cafes', 'historical', 'hidden-gem'],
    coordinates: { lat: 50.08585450344484, lng: 14.418034890162685 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to U Zlatého tygra — The Golden Tiger!

This is not just a pub. This is a Czech institution of approximately the same cultural weight as a national library, approached with the same reverence and governed by rules just as impenetrable to the uninitiated. U Zlatého tygra has been serving beer in the Old Town since the seventeenth century, but its modern legend is inseparable from one man: Bohumil Hrabal, arguably the greatest Czech prose writer of the twentieth century, who drank here so regularly and for so long that a chair in the corner became permanently associated with his name.

Hrabal was the author of Closely Watched Trains, I Served the King of England, and Too Loud a Solitude — a body of work that turned the everyday experience of ordinary Czechs (factory workers, pub philosophers, eccentric neighbours) into literature of startling precision and warmth. He came here to drink, to listen, and to talk, apparently without distinction between these activities. The beer was Pilsner Urquell, served properly, in a clean glass, at the correct temperature. These details mattered enormously to him.

In 1994, United States President Bill Clinton visited Prague on a state visit. His host, Václav Havel — poet, dissident, and newly elected President of the Czech Republic — brought him here. Hrabal was also present. Three men — a world superpower's president, a former political prisoner turned head of state, and the greatest Czech writer of his generation — sat in this room and drank Pilsner Urquell together. This is documented fact. It is also possibly the most specifically Czech thing that has ever happened.

🥚 Easter Egg: Bohumil Hrabal died in 1997 in circumstances that read like something out of his own fiction. He fell from the fifth-floor window of the hospital where he was recovering from an injury, reportedly while leaning out to feed the pigeons. He was eighty-two. He had been feeding pigeons for years. Nobody who knew him found this implausible. The pigeons presumably found it entirely expected. Prague has a gift for exits that are exactly as improbable as the lives that preceded them.`,

      cz: `Statečný dobrodruhu, vítej U Zlatého tygra!

Tohle není jen hospoda. Tohle je česká instituce přibližně stejné kulturní váhy jako národní knihovna, přistupovaná se stejnou úctou a řízená pravidly stejně neprostupnými pro nezasvěcené. U Zlatého tygra čepuje pivo na Starém Městě od sedmnáctého století, ale jeho moderní legenda je neoddělitelná od jednoho muže: Bohumila Hrabala, snad největšího českého prozaika dvacátého století, který sem chodil pít tak pravidelně a tak dlouho, že křeslo v rohu se natrvalo spojilo s jeho jménem.

Hrabal byl autorem Ostře sledovaných vlaků, Obsluhoval jsem anglického krále a Příliš hlučné samoty — díla, které proměnilo každodenní zkušenost obyčejných Čechů (dělníků, hospodských filozofů, excentrických sousedů) v literaturu překvapivé přesnosti a vřelosti. Chodil sem pít, naslouchat a mluvit, zřejmě bez rozlišení mezi těmito aktivitami. Pivo bylo Pilsner Urquell, čepovaný správně, do čistého sklenice, při správné teplotě. Tyto detaily mu byly nesmírně důležité.

V roce 1994 navštívil prezident Spojených států Bill Clinton Prahu na státní návštěvě. Jeho hostitel, Václav Havel — básník, disident a nově zvolený prezident České republiky — ho přivedl sem. Přítomen byl i Hrabal. Tři muži — prezident světové supervelmoci, bývalý politický vězeň, který se stal hlavou státu, a největší český spisovatel své generace — seděli v tomto pokoji a pili spolu Pilsner Urquell. Je to zdokumentovaný fakt. Je to také možná ta nejspecifičtěji česká věc, která se kdy stala.

🥚 Velikonoční vajíčko: Bohumil Hrabal zemřel v roce 1997 za okolností, které působí jako něco z jeho vlastní fikce. Vypadl z okna v pátém patře nemocnice, kde se vzpamatovával ze zranění, prý když se nakláněl ven, aby nakrmil holuby. Bylo mu osmdesát dva let. Holubům krmil léta. Nikdo, kdo ho znal, to neshledal nepravděpodobným. Holubi to zřejmě považovali za naprosto předvídatelné. Praha má dar pro odchody, které jsou přesně tak nepravděpodobné jako životy, které jim předcházely.`,

      zh: `勇敢的冒险家，欢迎来到金虎酒馆（U Zlatého tygra）！

这不只是一家酒馆。这是一家捷克机构，其文化分量大约与国家图书馆相当，被以同等的虔诚对待，并被一套对外人同样难以穿透的规则所支配。金虎自17世纪起便在老城区供应啤酒，但它的现代传奇与一个人密不可分：波胡米尔·赫拉巴尔（Bohumil Hrabal）——可能是20世纪最伟大的捷克散文作家——他在这里喝酒的时间如此漫长、如此规律，以至于角落里的那把椅子最终永远与他的名字联系在了一起。

赫拉巴尔是《严密监视的列车》《我曾服侍过英国国王》和《过于喧嚣的孤独》等作品的作者，他的文学世界将普通捷克人的日常生活（工厂工人、酒馆哲学家、古怪邻居）转化为令人惊叹的精准与温暖的文学。他来这里喝酒、聆听、闲谈，这几件事对他来说大概没有什么区别。他喝的是皮尔森乌奎尔（Pilsner Urquell），正确地倒进干净的杯子，温度恰到好处。这些细节对他极其重要。

1994年，美国总统比尔·克林顿对布拉格进行国事访问。他的东道主，瓦茨拉夫·哈维尔（Václav Havel）——诗人、异见人士、捷克共和国新当选总统——把他带到了这里。赫拉巴尔也在场。三个男人——一个超级大国的总统、一个从政治犯变成国家元首的人、以及他那一代最伟大的捷克作家——坐在这个房间里，一起喝了皮尔森乌奎尔。这是有据可查的事实。这也可能是有史以来最纯粹捷克式的事情。

🥚 彩蛋：波胡米尔·赫拉巴尔于1997年去世，死亡经过读来像他自己小说里的情节。他从医院五楼的窗口跌落，据说当时他正探身出去喂鸽子，彼时他正在医院养伤。他已八十二岁。他喂鸽子已经喂了很多年。认识他的人没有一个觉得这不可能。鸽子们大概觉得这完全在意料之中。布拉格有一种天赋，能让离场方式与走过的一生一样不可思议。`,
    },
  },
  {
    name: 'Castle Square Viewpoint',
    slug: 'vyhlidka-hradcanske-namesti',
    localizedNames: { cz: 'Vyhlídka na Hradčanském náměstí', zh: '城堡广场观景台' },
    labels: ['landmark', 'historical', 'architecture'],
    coordinates: { lat: 50.089342125363686, lng: 14.398764241981029 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Castle Square Viewpoint (Vyhlídka na Hradčanském náměstí)!

Hradčanské náměstí — Castle Square — is the large, austere, and frequently underestimated square that forms the ceremonial forecourt of Prague Castle. While the castle itself pulls every camera lens in Bohemia, this square quietly earns its own distinction: it is one of the finest Baroque urban spaces in Central Europe, enclosed by the Schwarzenberg Palace, the Tuscany Palace (seat of the Czech Ministry of Foreign Affairs since 1918), and the Archbishop's Palace. In the centre stands a plague column, erected in thanksgiving after the city survived the epidemic of 1713.

But the real reward is the view. At the southern edge of this square — where the plateau of Hradčany meets the steep slope that falls away toward Malá Strana — Prague opens up below you with extraordinary completeness. The red-roofed city stretches across both banks of the Vltava; the bridges are visible from here in sequence; the towers of the Old Town, the domes of the New Town churches, the hills of Žižkov and Vinohrady to the east, and on clear days the plateau of Bohemia dissolving into the horizon. This is the view that ambassadors, archbishops, and kings have walked out to inspect for three hundred years, each for their own reasons.

🥚 Easter Egg: The Tuscany Palace (Toskánský palác) on the western side of the square was built for Michael Oswald, Prince of Tuscany, in the early eighteenth century and subsequently passed through various Habsburg aristocratic hands. What has not changed is its function: it has housed the Czech Ministry of Foreign Affairs since Czechoslovakia's founding in 1918, and continues to do so today. Diplomacy in Prague is conducted from a Baroque palace on the square in front of the castle, which seems about right. The building's stone face has watched over Hradčanské náměstí through the First Republic, the Nazi Protectorate, the Communist period, and the restoration of democracy — without appearing to have strong views on any of it.`,

      cz: `Statečný dobrodruhu, vítej na Vyhlídce na Hradčanském náměstí!

Hradčanské náměstí je velké, strohé a často podceňované náměstí tvořící slavnostní předpolí Pražského hradu. Zatímco hrad samotný přitahuje každý fotoaparát v Čechách, toto náměstí tiše získává vlastní rozlišení: je to jeden z nejkrásnějších barokních městských prostor ve střední Evropě, uzavřený Schwarzenberským palácem, Toskánským palácem (sídlem českého Ministerstva zahraničních věcí od roku 1918) a Arcibiskupským palácem. V centru stojí morový sloup, vztyčený jako poděkování poté, co město přežilo epidemii roku 1713.

Ale skutečnou odměnou je výhled. Na jižním okraji tohoto náměstí — kde se planina Hradčan setkává se strmým svahem klesajícím k Malé Straně — se Praha otevírá pod vámi s mimořádnou úplností. Město s červenými střechami se rozkládá přes oba břehy Vltavy; odtud jsou mosty vidět v řadě za sebou; věže Starého Města, kopule novomětských kostelů, kopce Žižkova a Vinohrad na východě, a za jasných dnů planina Čech mizící na horizontu. To je výhled, který si velvyslanci, arcibiskupové a králové chodili prohlédnout tři sta let, každý z vlastních důvodů.

🥚 Velikonoční vajíčko: Toskánský palác na západní straně náměstí byl postaven pro Michaela Osvalda, prince Toskánského, na počátku osmnáctého století a poté přecházel různými větvemi habsburské aristokracie. Co se nezměnilo, je jeho funkce: od vzniku Československa v roce 1918 sídlí v paláci české Ministerstvo zahraničních věcí a dělá to dodnes. Diplomacie v Praze je vedena z barokního paláce na náměstí před hradem, což se zdá celkem příhodné. Kamenná tvář budovy přihlížela Hradčanskému náměstí za První republiky, nacistického protektorátu, komunistické éry a obnovy demokracie — aniž by se zdálo, že k tomu má silné osobní názory.`,

      zh: `勇敢的冒险家，欢迎来到城堡广场观景台（Vyhlídka na Hradčanském náměstí）！

赫拉德恰内广场（Hradčanské náměstí）——城堡广场——是布拉格城堡正前方那座宽阔、肃穆、常常被低估的广场，构成了城堡的礼仪式前院。城堡本身吸引了波西米亚所有的相机镜头，而这座广场则低调地积累着自己的分量：它是中欧最优美的巴洛克式城市广场之一，由施瓦岑贝格宫（Schwarzenberg Palace）、托斯卡纳宫（Tuscany Palace，自1918年起即为捷克外交部所在地）和大主教宫（Archbishop's Palace）围合而成。广场中央矗立着一根瘟疫纪念柱，那是1713年疫情过后幸存者竖立的感恩之石。

但真正的奖赏在于那个景色。在广场南缘——赫拉德恰内高地与向小城区陡然跌落的坡地相接之处——布拉格以一种令人惊叹的完整性在你脚下展开。红屋顶的城市绵延在伏尔塔瓦河两岸；从这里可以依次看清每一座桥；老城的塔楼、新城教堂的穹顶、东方日什科夫和维诺赫拉迪的山丘，在晴朗的日子里，波西米亚平原消融于远处的地平线。这是大使、大主教和国王们三百年来走出来眺望的景色，每个人都有着自己的理由。

🥚 彩蛋：广场西侧的托斯卡纳宫（Toskánský palác）建于18世纪初，最初为托斯卡纳亲王迈克尔·奥斯瓦尔德（Michael Oswald）所建，此后辗转经过哈布斯堡贵族的各个支系。没有改变的是它的功能：自1918年捷克斯洛伐克建国以来，托斯卡纳宫便是捷克外交部的所在地，至今仍是如此。布拉格的外交事务，在城堡广场前的一座巴洛克宫殿里进行，这似乎颇为合理。这座建筑的石制外墙俯瞰赫拉德恰内广场，见证了第一共和国、纳粹保护国、共产主义时期和民主恢复——而它似乎对这一切都没有表现出强烈的个人立场。`,
    },
  },
  {
    name: 'Hrzán Palace',
    slug: 'hrzansky-palac',
    localizedNames: { cz: 'Hrzánský palác', zh: '赫尔赞斯基宫' },
    labels: ['palace', 'historical', 'architecture'],
    coordinates: { lat: 50.08851546538464, lng: 14.394201115373157 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Hrzán Palace (Hrzánský palác)!

In the baroque competition that shaped Hradčany in the late seventeenth and early eighteenth centuries, the Hrzán Palace represents a well-calculated move in a very high-stakes real estate game. The Hrzán family of Harasova built their Prague residence here at a moment when every significant noble family in Bohemia understood the same principle: proximity to the castle was not merely architectural preference — it was political strategy. The palace that sat within walking distance of the Habsburg governor's office was the palace whose owner arrived at audiences first, briefed courtiers in corridors, and maintained the informal access that formal petitions could never guarantee. Baroque Hradčany was one long architectural argument about who mattered most.

The palace is a characteristic example of the Czech Baroque residential tradition — restrained compared to the theatrical excess of Viennese court architecture, but deliberate in its proportions and placement. The street it occupies, Loretánská, runs between the Loreto pilgrimage church and the fortress of the Černín Palace, ensuring that even a walk to morning devotions required navigating the full cast of Hradčany society. The palace passed through a succession of owners across the centuries, as noble families rose, fell, and merged through the dynastic turbulence of Central European history. It now serves governmental functions — the latest in a long line of institutional occupants who have found the address as useful as its original builders did.

🥚 Easter Egg: The Hrzán family name connects to a wider Bohemian aristocratic world that was almost entirely destroyed by one event: the Battle of White Mountain in 1620. After the Protestant Bohemian nobility was crushed by the Habsburgs, their estates were confiscated and redistributed to loyal Catholic families, many of them German-speaking newcomers. The Bohemian aristocracy that rebuilt Prague in the Baroque style — including the families that lined Loretánská and Hradčanské náměstí with palaces — was substantially a new class, installed by imperial patronage after the old one had been executed, exiled, or reduced to poverty. The grandeur of Baroque Prague is, in part, the architectural signature of a dispossession.`,

      cz: `Statečný dobrodruhu, vítej v Hrzánském paláci!

V barokní soutěži, která formovala Hradčany na konci sedmnáctého a počátku osmnáctého století, představuje Hrzánský palác dobře promyšlený tah ve velmi závažné hře o nemovitosti. Rod Hrzánů z Harasova si zde vybudoval svou pražskou rezidenci v době, kdy každý významný šlechtický rod v Čechách chápal touž zásadu: blízkost hradu nebyla jen architektonickou preferencí — byla politickou strategií. Palác na dochůdku od kanceláře habsburského místodržícího byl palác, jehož majitel přicházel na audience jako první, zpovídal dvořany v chodbách a udržoval neformální přístup, který formální žádosti nikdy nezaručovaly. Barokní Hradčany byly jednou dlouhou architektonickou polemiku o tom, kdo nejvíce záleží.

Palác je charakteristickým příkladem české barokní rezidenční tradice — zdrženlivý ve srovnání s teatrálním přebytkem vídeňské dvorní architektury, ale záměrný v proporcích a poloze. Ulice, na níž stojí — Loretánská — vede mezi Loretánskou poutní kaplí a pevností Černínského paláce, takže i cesta na ranní pobožnost vyžadovala procházet celým osazením hradčanské společnosti. Palác přecházel přes staletí z rukou do rukou, jak šlechtické rody stoupaly, upadaly a splývaly v dynastické turbulenci středoevropských dějin. Dnes slouží vládním účelům — jako nejnovější v dlouhé řadě institucionálních nájemníků, kteří tuto adresu shledali stejně užitečnou jako její původní stavitelé.

🥚 Velikonoční vajíčko: Jméno Hrzánů se váže k širšímu světu české šlechty, který byl téměř zcela zničen jednou událostí: bitvou na Bílé hoře roku 1620. Poté, co byla protestantská česká šlechta poražena Habsburky, byly její statky zkonfiskovány a rozděleny loajálním katolickým rodinám — z nichž mnohé byly německojazyčnými nováčky. Česká aristokracie, která přestavěla Prahu v barokním stylu — včetně rodin, které lemovaly Loretánskou a Hradčanské náměstí paláci — byla z podstatné části novou třídou, dosazenou císařskou přízní poté, co ta stará byla popravena, vyhnána nebo uvržena do chudoby. Nádhera barokní Prahy je zčásti architektonickým podpisem jednoho vyvlastnění.`,

      zh: `勇敢的冒险家，欢迎来到赫尔赞斯基宫（Hrzánský palác）！

在17世纪末至18世纪初那场塑造了赫拉德恰内（Hradčany）面貌的巴洛克式竞争中，赫尔赞斯基宫代表着一场极高风险的房地产博弈中的精准落子。赫尔赞（Hrzán）家族在这里建造布拉格宅邸的时机，恰好是波西米亚每一个重要贵族家族都领悟了同一条原则的时刻：靠近城堡不仅仅是建筑审美的偏好——那是政治策略。距哈布斯堡总督办公室步行可达的宫殿，才是其主人最先抵达觐见、在廊道间疏通关系、维系那种正式请愿永远无法保证的非正式渠道的宫殿。巴洛克时代的赫拉德恰内，是一场关于"谁最重要"的漫长建筑辩论。

这座宫殿是捷克巴洛克住宅传统的典型案例——与维也纳宫廷建筑的戏剧性奢华相比显得克制，但在比例和位置上颇具匠心。宫殿所在的洛雷坦斯卡街（Loretánská）连接洛雷托朝圣教堂与切尔宁宫（Černín Palace）要塞，如此一来，哪怕只是走去参加晨祷，也需要穿越整个赫拉德恰内社交圈的全体成员。几个世纪以来，这座宫殿辗转易主，贵族家族在中欧历史的王朝动荡中起起落落、分分合合。如今它服务于政府职能——是漫长的机构居住者名单中最新的一位，而这些人发现这个地址和当初的建造者一样有用。

🥚 彩蛋：赫尔赞家族的名字连接着一个更广阔的波西米亚贵族世界，而这个世界几乎在一场事件中被彻底摧毁：1620年的白山战役。新教波西米亚贵族被哈布斯堡王朝击败后，他们的庄园被没收，重新分配给忠诚的天主教家族——其中许多都是德语新移民。那些用巴洛克风格重建布拉格的波西米亚贵族——包括在洛雷坦斯卡街和赫拉德恰内广场两侧排列宫殿的家族——从根本上是一个由帝国庇护扶植的新阶级，替换了那个已被处决、流亡或沦为贫困的旧阶级。巴洛克布拉格的辉煌，在某种程度上，是一次剥夺的建筑签名。`,
    },
  },
  {
    name: 'Vršovice Hussite Hall',
    slug: 'husuv-sbor-vrsovice',
    localizedNames: { cz: 'Husův sbor ve Vršovicích', zh: '弗尔绍维采胡斯集会堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.06890911225685, lng: 14.453921707817928 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Hussite Congregation Hall in Vršovice (Husův sbor ve Vršovicích)!

When Czechoslovakia gained independence in October 1918, one of the most urgent questions facing the new state was religious. For three centuries, the Habsburg dynasty had enforced Catholicism throughout Bohemia with a thoroughness that produced official statistics but concealed the actual state of Czech religious identity. When those constraints were removed, Czech society moved quickly. On January 8, 1920, a group of reformist Catholic priests broke from Rome and founded the Czechoslovak Hussite Church — a new denomination that claimed the legacy of Jan Hus, celebrated Mass in Czech rather than Latin, allowed priests to marry, and governed itself through democratic congregational structures rather than episcopal hierarchy. Within a year it had over a hundred thousand members. Within a decade, it had built congregation halls — sbory — across the republic.

The Vršovice congregation hall is one of these purposefully built interwar structures, its architecture reflecting the confident modernism of the First Republic. Czech functionalism and national romanticism competed in the design of these buildings, which were not churches in the Catholic sense — they were sbory, "meeting places," a distinction that mattered very much to their congregations. The name on the building, Hus, was not merely a dedication. It was a statement: the memory of the fifteenth-century reformer who was burned for questioning Rome belonged to Czech Protestants, not to the institution that burned him.

🥚 Easter Egg: Jan Hus died at the Council of Constance on July 6, 1415, burned as a heretic after the Holy Roman Emperor revoked his guaranteed safe conduct on the theological grounds that promises to heretics are not binding. The resulting Hussite Wars lasted from 1419 to 1434 and were, by the military standards of the time, extraordinary: the Hussites — a comparatively small kingdom of mostly peasant and townspeople fighters — defeated five consecutive papal-backed crusades. When Martin Luther stood before the Diet of Worms in 1521 refusing to recant, he explicitly cited Hus: "We are all Hussites," he said, "without knowing it." The Czech reforms that Rome had crushed had seeded the Reformation a century later. July 6, the day of Hus's death, is a public holiday in the Czech Republic to this day.`,

      cz: `Statečný dobrodruhu, vítej v Husově sboru ve Vršovicích!

Když Československo v říjnu 1918 získalo nezávislost, jednou z nejnaléhavějších otázek, které nový stát čelil, byla náboženská. Po tři staletí Habsburkové prosazovali katolictví v Čechách s důkladností, která produkovala oficiální statistiky, ale zastírala skutečný stav české náboženské identity. Jakmile tato omezení pominula, česká společnost se rychle pohnula. Dne 8. ledna 1920 skupina reformistických katolických kněží přerušila vztahy s Římem a founded Církev československou husitskou — novou denominaci, která si nárokovala odkaz Jana Husa, slavila mši v češtině místo latiny, dovolovala kněžím se ženit a spravovala se demokratickými kongregačními strukturami místo biskupské hierarchie. Během roku měla přes sto tisíc členů. Během desetiletí vybudovala sbory ve čtvrtích po celé republice.

Vršovický sbor je jednou z těchto záměrně budovaných meziválečných staveb, jejíž architektura odráží sebejistý modernismus první republiky. Český funkcionalismus a národní romantismus soupeřily v návrzích těchto budov, které nebyly kostely v katolickém smyslu — byly to sbory, "shromažďovací místa", rozdíl, který pro jejich kongregace velmi záležel. Jméno na budově, Hus, nebylo pouhým věnováním. Bylo to prohlášení: paměť na reformatora z patnáctého století, upáleného za zpochybňování Říma, patřila českým protestantům, nikoli instituci, která ho upálila.

🥚 Velikonoční vajíčko: Jan Hus zemřel na Kostnickém koncilu 6. července 1415, upálen jako kacíř poté, co mu císař Svaté říše římské odvolal zaručené bezpečné chování s teologickým odůvodněním, že sliby dané kacířům nejsou závazné. Výsledné husitské války trvaly od roku 1419 do roku 1434 a byly z vojenského hlediska tehdejší doby pozoruhodné: Husité — relativně malé království většinou rolnických a měšťanských bojovníků — porazili pět po sobě jdoucích papežem podpořených křížových výprav. Když Martin Luther stanul před Říšským sněmem ve Wormsu roku 1521 a odmítl odvolat, explicitně citoval Husa: "Jsme všichni husité," řekl, "aniž bychom to věděli." České reformy, které Řím potlačil, zasely reformaci o století později. 6. červenec, den Husovy smrti, je dodnes státním svátkem v České republice.`,

      zh: `勇敢的冒险家，欢迎来到弗尔绍维采胡斯集会堂（Husův sbor ve Vršovicích）！

1918年10月捷克斯洛伐克获得独立时，新国家面临的最紧迫问题之一是宗教问题。三个世纪以来，哈布斯堡王朝在波西米亚强制推行天主教，这种力度制造了官方统计数字，却遮掩了捷克人真实的宗教认同状态。当这些约束解除后，捷克社会迅速行动。1920年1月8日，一群改革派天主教神父与罗马决裂，创立了捷克斯洛伐克胡斯派教会（Církev československá husitská）——一个以扬·胡斯为精神源头的新教派，以捷克语而非拉丁语举行弥撒，允许神职人员结婚，并通过民主的会众制度而非主教层级进行治理。不到一年，教会就拥有了超过十万名成员。不到十年，它在共和国各地街区建起了集会堂（sbory）。

弗尔绍维采集会堂是这批有意建造的两战之间建筑之一，其建筑风格体现了第一共和国时期充满自信的现代主义精神。捷克功能主义与民族浪漫主义在这些建筑的设计中相互竞争——它们在天主教意义上不是"教堂"，而是"sbory"（聚会场所），这个区分对会众来说意义重大。建筑上的名字"胡斯"不只是一个献名，那是一份声明：那位因质疑罗马而被烧死的15世纪改革者的记忆，属于捷克新教徒，而不属于烧死他的那个机构。

🥚 彩蛋：扬·胡斯于1415年7月6日在康斯坦茨公会议上以异端罪名被火刑处死，此前神圣罗马皇帝以"对异端的承诺不具约束力"为由撤销了对他的安全通行保证。随之而来的胡斯战争（1419—1434年）在当时的军事标准下堪称非凡：胡斯派击败了罗马教廷组织的五次十字军东征。1521年马丁·路德在沃尔姆斯帝国议会上拒绝收回声明时，明确援引了胡斯："我们都是胡斯派，"他说，"只是自己不知道。"罗马曾压制的捷克改革，在一个世纪后埋下了宗教改革的种子。胡斯的忌日7月6日，至今仍是捷克共和国的法定假日。`,
    },
  },
  {
    name: 'Theatre Hybernia',
    slug: 'divadlo-hybernia',
    localizedNames: { cz: 'Divadlo Hybernia', zh: '希伯尼亚剧院' },
    labels: ['historical', 'architecture', 'landmark'],
    coordinates: { lat: 50.08734989308102, lng: 14.42909015672586 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Divadlo Hybernia — Theatre Hybernia!

The name "Hybernia" is the Latin word for Ireland. The building you are standing in front of was originally a Baroque church and monastery built for Irish Franciscan friars — men who came to Prague in the early seventeenth century not as missionaries, but as refugees. Under English Protestant rule in Ireland, Catholic religious orders faced sustained persecution, dissolution, and the threat of extinction. Central European Catholic cities — Vienna, Prague, Louvain — became sanctuaries for Irish clergy seeking to preserve their orders and continue their theological training. The Irish Franciscans, known in Latin as the Fratres Minores Hiberniae, arrived in Prague in 1629. Emperor Ferdinand II, who had just won the Battle of White Mountain and was in the process of re-Catholicising Bohemia, received them warmly. He granted them a plot of land in the New Town, and on it they built the church that eventually became this theatre.

The Baroque church, completed in stages across the seventeenth and early eighteenth centuries, served the Irish community in Prague until Emperor Joseph II dissolved the monasteries in 1786 as part of his Enlightenment-era ecclesiastical reforms. The building was converted into a customs house — the Celnice — which explains the proximity to the adjacent railway terminal. It served this prosaic function for most of the nineteenth and twentieth centuries before being renovated and reopened in 2006 as a musical theatre and events venue. The Irish friars would have found the transformation unexpected. Prague audiences find it excellent.

🥚 Easter Egg: The Irish Franciscans in Prague were part of a phenomenon historians call the "Irish Colleges" — a network of institutions founded across Catholic Europe by Irish clergy and laypeople during the sixteenth through eighteenth centuries to preserve Irish Catholic education while it was suppressed at home. Colleges existed in Louvain, Salamanca, Rome, Paris, Prague, and elsewhere. These were not merely religious institutions; they trained the intellectual and ecclesiastical leadership that would eventually return to Ireland, carrying Scholastic philosophy, Counter-Reformation theology, and — crucially — the written preservation of Irish language, poetry, and history. The Four Masters, who compiled the Annals of the Kingdom of Ireland between 1632 and 1636, worked from one such college in Louvain. Prague's Irish church was part of the same network that saved a culture.`,

      cz: `Statečný dobrodruhu, vítej v Divadle Hybernia!

Název "Hybernia" je latinský výraz pro Irsko. Budova, před níž stojíš, byla původně barokní kostel a klášter postavený pro irské františkánské mnichy — muže, kteří přišli do Prahy na počátku sedmnáctého století nikoli jako misionáři, ale jako uprchlíci. Pod anglickou protestantskou nadvládou v Irsku čelily katolické řeholní řády soustavnému pronásledování, rozpuštění a hrozbě zániku. Středoevropská katolická města — Vídeň, Praha, Lovaň — se stala útočišti pro irský klérus hledající zachování svých řádů a pokračování v teologickém vzdělávání. Irští františkáni, latinsky známí jako Fratres Minores Hiberniae, přijeli do Prahy v roce 1629. Císař Ferdinand II., jenž právě zvítězil v bitvě na Bílé hoře a byl v procesu rekatolizace Čech, je přijal vřele. Poskytl jim pozemek a na něm postavili kostel, který se nakonec stal tímto divadlem.

Barokní kostel, dokončený po etapách v průběhu sedmnáctého a počátku osmnáctého století, sloužil irské komunitě v Praze, dokud císař Josef II. v roce 1786 nerozpustil kláštery jako součást svých osvíceneckých reforem. Budova byla přeměněna na celnici, což vysvětluje blízkost k přilehlému vlakovému nádraží. Tuto funkci plnila po většinu devatenáctého a dvacátého století, než byla zrekonstruována a v roce 2006 znovu otevřena jako hudební divadlo a prostory pro akce. Irští mniši by tuto proměnu nečekali. Pražské publikum ji shledává vynikající.

🥚 Velikonoční vajíčko: Irští františkáni v Praze byli součástí jevu, který historici nazývají "irskými kolejemi" — sítě institucí founded po celé katolické Evropě irskými duchovními a laiky v průběhu šestnáctého až osmnáctého století k zachování irského katolického vzdělání, zatímco bylo doma potlačováno. Koleje existovaly v Lovani, Salamance, Římě, Paříži, Praze a jinde. Nešlo jen o náboženské instituce; vzdělávaly intelektuální a církevní vedení, které se nakonec vrátilo do Irska, nesoucí scholastickou filozofii, protireformační teologii a — klíčově — písemné zachování irského jazyka, poezie a dějin. Čtyři páni, kteří mezi lety 1632 a 1636 sestavili Annály Irského království, pracovali z jedné takové koleje v Lovani. Pražský irský kostel byl součástí téže sítě, která zachránila kulturu.`,

      zh: `勇敢的冒险家，欢迎来到希伯尼亚剧院（Divadlo Hybernia）！

"Hybernia"是"爱尔兰"的拉丁语名称。你面前这座建筑，最初是为爱尔兰方济各会修士建造的巴洛克式教堂与修道院——这些人在17世纪初来到布拉格，不是作为传教士，而是作为难民。在英国新教统治下的爱尔兰，天主教修道团体面临持续的迫害、解散和灭亡的威胁。中欧的天主教城市——维也纳、布拉格、鲁汶——成为爱尔兰神职人员的庇护所，供他们保存教团、延续神学培训。爱尔兰方济各会（拉丁语称Fratres Minores Hiberniae）于1629年抵达布拉格。刚刚赢得白山战役、正在对波西米亚进行重新天主教化的皇帝斐迪南二世热情接待了他们，划拨了一块土地，他们在其上建起了最终成为这座剧院的教堂。

这座巴洛克教堂在17世纪至18世纪初分阶段建成，服务于布拉格的爱尔兰社区，直至1786年皇帝约瑟夫二世作为启蒙改革的一部分解散了修道院。建筑随后被改造为海关大楼（Celnice）——这解释了它紧邻火车站的原因。整个19至20世纪的大部分时间，这座建筑都在执行这项平凡的职能，直到被翻新，并于2006年重新开放为音乐剧院和活动场馆。爱尔兰修士们大概没有预料到这番变故。布拉格观众则认为这极好。

🥚 彩蛋：布拉格的爱尔兰方济各会，是历史学家所称的"爱尔兰学院"（Irish Colleges）现象的组成部分——这是16至18世纪爱尔兰神职人员和俗人在整个天主教欧洲建立的机构网络，目的是在国内教育受压制期间保护爱尔兰天主教教育。学院分布于鲁汶、萨拉曼卡、罗马、巴黎、布拉格等地。这些不仅是宗教机构；它们培养了最终回归爱尔兰的知识和教会领袖，带回了经院哲学、反宗教改革神学，以及——最重要的是——对爱尔兰语言、诗歌和历史的书面保存。"四位大师"在1632至1636年间编纂《爱尔兰王国编年史》时，就在鲁汶的一所此类学院工作。布拉格的爱尔兰教堂，是挽救了一种文化的那个网络的一部分。`,
    },
  },
  {
    name: 'Jan Palach Memorial — House of the Son and House of the Mother',
    slug: 'pamatnik-jana-palacha-sousosi',
    localizedNames: { cz: 'Památník Jana Palacha — sousoší Dům syna a Dům matky', zh: '扬·帕拉赫纪念碑——子之家与母之家' },
    labels: ['monument', 'historical', 'landmark'],
    coordinates: { lat: 50.08880631596714, lng: 14.414129818434814 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Jan Palach Memorial — the sculpture group "Dům syna a Dům matky" (House of the Son and House of the Mother)!

On January 16, 1969 — three months and twenty-four days after Soviet tanks had entered Prague to end the Prague Spring — a twenty-year-old first-year student at Charles University's Faculty of Arts walked to Wenceslas Square and set himself on fire. Jan Palach had prepared the act deliberately. He died of his burns on January 19. His stated purpose was to shock Czechoslovak society out of what he feared was the beginning of passive acceptance — the slow psychological surrender to normalisation that would characterise the next two decades. His death shocked it. Whether it prevented the surrender is more complicated.

The sculpture group by Olbram Zoubek — who had made Palach's death mask in 1969 and carried the memory of that act for the rest of his long life — consists of two house-shaped forms facing each other across a small space: the Dům syna (House of the Son) and the Dům matky (House of the Mother). The forms are simple and severe. They do not illustrate anything. They hold a space of grief and witness between them. Zoubek was one of the most significant Czech sculptors of the twentieth century, whose refusal to cooperate with the Communist regime cost him decades of official recognition; his memorial to Palach is among the most quietly powerful works of public art in the city.

🥚 Easter Egg: The Communist authorities worked systematically to erase Palach's memory. In 1973, his body was exhumed without his family's consent and cremated; his remains were sent to his mother with instructions not to display them publicly. The square in front of his Faculty of Arts building — previously named Náměstí Krasnoarmejců (Red Army Square) — had been renamed Jan Palach Square in 1969, but the regime changed it back. It was renamed again in 1989. In August 1988, Palach's original grave in Všetaty became a site of pilgrimage; the authorities attempted to prevent commemoration there and failed. Memory, in Czechoslovakia, proved more durable than the state that tried to manage it.`,

      cz: `Statečný dobrodruhu, vítej u Památníku Jana Palacha — sousoší Dům syna a Dům matky!

Dne 16. ledna 1969 — tři měsíce a dvacet čtyři dní poté, co sovětské tanky vstoupily do Prahy, aby ukončily Pražské jaro — přešel dvacetiletý student prvního ročníku Filozofické fakulty Karlovy univerzity na Václavské náměstí a zapálil se. Jan Palach tento čin předem pečlivě připravil. Zemřel na popáleniny 19. ledna. Jeho deklarovaným záměrem bylo šokovat československou společnost z toho, co se obával jako počátek pasivního smíření — pomalého psychologického podléhání normalizaci, která charakterizovala příštích dvacet let. Jeho smrt společností otřásla. Zda zabránila oné kapitulaci, je složitější otázka.

Sousoší Olbrama Zoubka — jenž v roce 1969 zhotovil Palachovu posmrtnou masku a nesl vzpomínku na ten čin po celý zbytek svého dlouhého života — sestává ze dvou domčekových tvarů obrácených k sobě přes malý prostor: Dům syna a Dům matky. Tvary jsou jednoduché a přísné. Nic nezobrazují. Drží mezi sebou prostor smutku a svědectví. Zoubek byl jedním z nejvýznamnějších českých sochařů dvacátého století, jehož odmítnutí spolupráce s komunistickým režimem ho stálo desítky let oficiálního uznání; jeho památník Palachovi patří k nejtiše silnějším dílům veřejného umění ve městě.

🥚 Velikonoční vajíčko: Komunistické úřady systematicky pracovaly na vymazání Palachovy paměti. V roce 1973 bylo jeho tělo bez souhlasu rodiny exhumováno a zpopelněno; pozůstatky byly zaslány jeho matce s příkazem nevystavovat je veřejně. Náměstí před jeho Filozofickou fakultou — dříve pojmenované Náměstí Krasnoarmějců — bylo v roce 1969 přejmenováno na náměstí Jana Palacha, ale režim ho přejmenoval zpět. Bylo přejmenováno znovu v roce 1989. V srpnu 1988 se Palachův původní hrob ve Všetatech stal místem pouti; úřady se pokusily zamezit uctívání památky tam a nepodařilo se jim to. Paměť, v Československu, se ukázala jako odolnější než stát, který ji pokoušel řídit.`,

      zh: `勇敢的冒险家，欢迎来到扬·帕拉赫纪念碑——"子之家与母之家"雕塑群（Památník Jana Palacha — sousoší Dům syna a Dům matky）！

1969年1月16日——在苏联坦克进入布拉格终结布拉格之春后的第三个月零二十四天——查理大学哲学系一年级的二十岁学生走到瓦茨拉夫广场，点火自焚。扬·帕拉赫（Jan Palach）是经过深思熟虑之后实施这一行动的。他于1月19日因烧伤身亡。他声明的目的是震醒捷克斯洛伐克社会，将其从他所担忧的被动接受的开端中唤醒——那种将在未来二十年里主宰这个国家的、对"正常化"的缓慢心理屈服。他的死震撼了这个社会。它是否阻止了那场屈服，是个更为复杂的问题。

雕塑群出自奥尔布拉姆·佐伯克（Olbram Zoubek）之手——他在1969年为帕拉赫制作了死亡面模，并将那一时刻的记忆携带了一生——由两个面对面、相隔一小段距离的房屋形态组成：子之家（Dům syna）与母之家（Dům matky）。造型简洁而庄严。它们不描绘任何东西。它们在彼此之间守护着一片悲恸与见证的空间。佐伯克是20世纪最重要的捷克雕塑家之一，他拒绝与共产党政权合作的立场使他付出了数十年官方认可的代价；他为帕拉赫创作的这件纪念作品，是这座城市中最安静有力的公共艺术作品之一。

🥚 彩蛋：共产党当局系统性地致力于抹去帕拉赫的记忆。1973年，他的遗体在未经家属同意的情况下被秘密挖出并火化；骨灰被送交其母，并附带指示，不得公开展示。他所在的哲学系门前的广场——原名"红军战士广场"（Náměstí Krasnoarmejců）——曾在1969年被更名为扬·帕拉赫广场，但政权随后又改了回去。1989年，广场再次更名。1988年8月，帕拉赫在全塞塔蒂（Všetaty）的原墓地成为朝圣之所；当局试图阻止那里的纪念活动，并未成功。在捷克斯洛伐克，记忆被证明比试图管控它的国家更为持久。`,
    },
  },
  {
    name: 'Klausen Synagogue',
    slug: 'klausova-synagoga',
    localizedNames: { cz: 'Klausová synagoga', zh: '克劳斯犹太会堂' },
    labels: ['church', 'historical', 'museum'],
    coordinates: { lat: 50.08996153954905, lng: 14.417203828590779 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Klausová synagoga — the Klausen Synagogue!

The name "Klausen" comes from the German word for small buildings — klause. The original klausen on this site were a cluster of small school buildings and a hospital founded in the mid-sixteenth century by Rabbi Jehuda Löw ben Bezalel, known as the Maharal of Prague, who ran a yeshiva here. After a catastrophic fire swept through the ghetto in 1689, the existing buildings were demolished and the current synagogue was built in 1694 — one of the largest and most elaborately decorated in the Jewish Quarter. It has remained in continuous use as a place of Jewish religious life and, since the mid-twentieth century, as an educational space within the Jewish Museum in Prague.

Rabbi Löw (c. 1520–1609) is one of the most famous figures associated with Jewish Prague, though his fame rests largely on a story he would not have recognised. He is the Maharal — master, teacher, religious authority, writer of important works on Talmudic interpretation, and a genuinely significant figure in the intellectual history of Central European Judaism. He is also, by legend, the creator of the Golem: an animated figure of clay, brought to life with the word "emet" (truth) inscribed on its forehead, created to protect the Jews of the ghetto from persecution, and deactivated by removing the first letter to leave "met" — death. The legend has no historical basis. It grew in the telling across two centuries before being fully elaborated in the Romantic period. Prague adopted it with total commitment. The real Rabbi Löw, whose actual scholarship was extraordinary, sometimes seems to struggle for attention against his own golem.

🥚 Easter Egg: The Jewish Museum in Prague, of which this synagogue is a part, was established in 1906 to preserve objects from synagogues being demolished during the controversial urban "sanitation" of Josefov (1893–1913), when the city razed most of the medieval Jewish Quarter and replaced it with new boulevards and Art Nouveau apartment buildings. During the Nazi occupation, the museum continued to operate — the Nazi administration intended it as a Museum of an Extinct Race. The Jewish curators who ran it under those conditions preserved not just objects, but the systematic record of a community the occupiers intended to destroy. The museum survived, as did its collections. Of the approximately 80,000 Czech Jews deported during the occupation, fewer than 10,000 survived. The museum now carries both the weight of that loss and the improbable fact of its own continuity.`,

      cz: `Statečný dobrodruhu, vítej v Klausové synagoze!

Název "Klausen" pochází z německého slova pro malé budovy — klause. Původní klausy na tomto místě byl soubor malých školních budov a nemocnice founded v polovině šestnáctého století rabínem Jehudou Löwem ben Bezalelem, známým jako Maharal pražský, který zde provozoval ješivu. Po katastrofickém požáru, který zachvátil ghetto v roce 1689, byly stávající budovy zbořeny a současná synagoga byla postavena v roce 1694 — jedna z největších a nejbohatěji zdobených v Židovském Městě. Sloužila nepřetržitě jako místo židovského náboženského života a od poloviny dvacátého století jako vzdělávací prostor v rámci Židovského muzea v Praze.

Rabín Löw (cca 1520–1609) je jednou z nejslavnějších postav spojených s židovskou Prahou, ačkoli jeho sláva spočívá z velké části na příběhu, který by nerozpoznal. Je to Maharal — mistr, učitel, náboženská autorita, autor důležitých děl o talmudické interpretaci a skutečně významná postava v intelektuálních dějinách středoevropského judaismu. Je také podle legendy stvořitelem Golema: oživené hliněné postavy, přivedené k životu slovem "emet" (pravda) napsaným na čele, vytvořené k ochraně Židů ghetta před pronásledováním a deaktivované odstraněním prvního písmene, aby zbylo "met" — smrt. Legenda nemá historický základ. Rostla v převypravování přes dvě staletí, než byla plně zpracována v romantickém období. Praha ji přijala s naprostým odhodláním. Skutečný rabín Löw, jehož skutečná učenost byla mimořádná, někdy jako by zápasil o pozornost se svým vlastním Golemem.

🥚 Velikonoční vajíčko: Židovské muzeum v Praze, jehož součástí je tato synagoga, bylo founded v roce 1906 k zachování předmětů ze synagog bourán­ých v průběhu kontroverzní "sanitace" Josefova (1893–1913), kdy město srovnalo se zemí většinu středověkého Židovského Města a nahradilo ho novými bulváry a secesními bytovými domy. Za nacistické okupace bylo muzeum udržováno v provozu — nacistická správa ho zamýšlela jako Muzeum vyhynulé rasy. Židovští kurátoři, kteří za těchto podmínek muzeum vedli, zachovávali nejen předměty, ale systematický záznam komunity, kterou okupanti zamýšleli zničit. Muzeum přežilo, stejně jako jeho sbírky. Z přibližně 80 000 českých Židů deportovaných za okupace přežilo méně než 10 000. Muzeum dnes nese jak tíhu té ztráty, tak nepravděpodobný fakt vlastní kontinuity.`,

      zh: `勇敢的冒险家，欢迎来到克劳斯犹太会堂（Klausová synagoga）！

"Klausen"这个名字来自德语中表示小建筑的词——klause。这里最初的"克劳斯"是一组小型学校建筑和一座医院，由布拉格的大拉比耶胡达·洛夫·本·别匝列尔（Jehuda Löw ben Bezalel）——即著名的"布拉格马哈拉尔"（Maharal）——在16世纪中期创立，他在这里开设犹太学院（yeshiva）。1689年，一场灾难性的大火席卷了犹太区，原有建筑被夷平，现存的会堂于1694年建成——是约瑟夫区规模最大、装饰最为精美的会堂之一。此后它持续作为犹太宗教生活的场所，并自20世纪中叶起成为布拉格犹太博物馆的组成部分，承担教育功能。

拉比洛夫（约1520—1609年）是与犹太布拉格相关的最著名人物之一，尽管他的声誉在很大程度上建立在一个他本人根本不会认得的故事上。他是马哈拉尔——老师、宗教权威、塔木德解释的重要著作作者，以及中欧犹太思想史上真正举足轻重的人物。而根据传说，他也是哥连（Golem）的创造者：一个用泥土塑成的活物，以刻在额头上的"emet"（真理）一词获得生命，为保护犹太区居民免遭迫害而生，通过抹去第一个字母留下"met"（死亡）而被停止。这个传说毫无历史依据，在两个世纪的口耳相传中不断生长，直到浪漫主义时期才被完整成型。布拉格以全情投入的方式接纳了这个传说。真实的拉比洛夫——他的学问在当时真正令人叹为观止——有时似乎在与自己的哥连争夺人们的注意力。

🥚 彩蛋：布拉格犹太博物馆于1906年创立，旨在保存约瑟夫区"卫生改造"（1893—1913年）期间被拆除会堂中的文物——那场改造将中世纪犹太区的大部分夷为平地，代之以新的林荫大道和新艺术风格公寓楼。纳粹占领期间，博物馆被维持运转——纳粹当局意图将其打造为"一个已灭绝种族的博物馆"。在这种情境下坚持运营博物馆的犹太策展人，保存的不只是物件，而是占领者意图摧毁的那个群体的系统性记录。博物馆幸存了，它的藏品也幸存了。占领期间被驱逐的约8万名捷克犹太人中，幸存者不足1万人。博物馆如今承载着那场失去的沉重，以及它自身延续这一令人难以置信的事实。`,
    },
  },
];

async function run() {
  await connectDB();
  let added = 0, updated = 0, failed = 0;

  for (const data of locations) {
    try {
      const result = await Location.findOneAndUpdate(
        { slug: data.slug },
        { $setOnInsert: data },
        { upsert: true, new: true }
      );
      const wasNew = result.createdAt.getTime() === result.updatedAt.getTime();
      if (wasNew) { console.log(`ADD    ${data.slug}`); added++; }
      else         { console.log(`SKIP   ${data.slug}`); }
    } catch (err) {
      console.log(`FAIL   ${data.slug} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${added} added, ${updated} updated, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => { console.error(err); process.exit(1); });
