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
];

async function run() {
  await connectDB();
  let added = 0, updated = 0, failed = 0;

  for (const data of locations) {
    try {
      const result = await Location.findOneAndUpdate(
        { slug: data.slug },
        { $set: data },
        { upsert: true, new: true }
      );
      const wasNew = result.createdAt.getTime() === result.updatedAt.getTime();
      if (wasNew) { console.log(`ADD    ${data.slug}`); added++; }
      else         { console.log(`UPDATE ${data.slug}`); updated++; }
    } catch (err) {
      console.log(`FAIL   ${data.slug} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${added} added, ${updated} updated, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => { console.error(err); process.exit(1); });
