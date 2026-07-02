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
  {
    name: 'Jindřišská Tower',
    slug: 'jindrisska-vez',
    localizedNames: { cz: 'Jindřišská věž', zh: '圣亨利钟楼' },
    labels: ['tower', 'historical', 'architecture'],
    coordinates: { lat: 50.08512498730844, lng: 14.430089087468694 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Jindřišská věž — the Tower of St. Henry!

Standing 65 metres tall in the heart of the New Town, the Jindřišská Tower is one of Prague's most distinctive Gothic constructions and one of the few surviving free-standing bell towers in the country. It was built between 1455 and 1475 as the bell tower of the adjacent Church of St. Henry and St. Cunigunde — which explains the unusual spatial arrangement: tower and church stand apart from each other rather than integrated, a medieval decision that has given this corner of the New Town its particular vertical punctuation for over five centuries. The tower can be climbed, with a small museum occupying several of its twelve floors and a café with views over the New Town at the top.

The tower has lived multiple lives since its construction. It has housed a watchman, a prison, and a mechanism for pumping water into the city. It was damaged by Prussian bombardment in 1757 during the Seven Years' War and by a catastrophic fire in 1879. Each time it was rebuilt. The bells — the original reason for its existence — have continued to mark the hours across the centuries, accompanying the New Town through its transformation from a medieval settlement to a nineteenth-century bourgeois neighbourhood to the commercial centre it is today.

🥚 Easter Egg: The Church of St. Henry and St. Cunigunde, to which this tower belongs, was founded by Emperor Charles IV in 1348 as part of his comprehensive plan for the New Town — a district he designed from scratch at a scale and speed that has no real parallel in medieval urban history. Charles IV laid out the New Town with extraordinary geometric precision, positioning churches, squares, and streets according to an intentional plan. If Jindřišská Tower looks like it was placed deliberately, it is because it was — as a punctuation mark in a city that was being written from the top down by an emperor with unusually strong opinions about urban form.`,

      cz: `Statečný dobrodruhu, vítej v Jindřišské věži!

Jindřišská věž tyčící se 65 metrů do nebe v srdci Nového Města je jednou z nejcharakterističtějších gotických staveb Prahy a jednou z mála dochovaných volně stojících zvonic v zemi. Byla postavena v letech 1455 až 1475 jako zvonice přilehlého Kostela sv. Jindřicha a sv. Kunhuty — což vysvětluje neobvyklé prostorové uspořádání: věž a kostel stojí odděleně, nikoli integrovaně, středověké rozhodnutí, které dalo tomuto rohu Nového Města jeho charakteristickou vertikální interpunkci po více než pět staletí. Věž lze vylézt, přičemž malé muzeum obsazuje několik z jejích dvanácti podlaží a kavárna s výhledem nad střechy Nového Města vrcholí v jejím vršku.

Věž od svého vzniku žila mnoha životy. Sloužila jako sídlo strážce, věznice a jako mechanismus pro čerpání vody do města. Byla poškozena pruským bombardováním roku 1757 za sedmileté války a katastrofickým požárem roku 1879. Pokaždé byla znovu vybudována. Zvony — původní důvod její existence — pokračovaly ve vyzvánění hodin po staletí, provázejíce Nové Město jeho proměnou z středověkého sídliště na měšťanskou čtvrť devatenáctého století a na dnešní obchodní centrum.

🥚 Velikonoční vajíčko: Kostel sv. Jindřicha a sv. Kunhuty, k němuž tato věž patří, byl founded císařem Karlem IV. roku 1348 jako součást jeho komplexního plánu pro Nové Město — čtvrť, kterou navrhl od základu v měřítku a rychlosti, které nemají v středověkých dějinách urbanismu skutečnou paralelu. Karel IV. vytyčil Nové Město s mimořádnou geometrickou přesností, umísťující kostely, náměstí a ulice podle záměrného plánu. Pokud Jindřišská věž vypadá, jako by byla umístěna záměrně, je to proto, že tomu tak skutečně bylo — jako interpunkční znaménko ve městě, které bylo psáno shora dolů císařem s neobvykle silnými názory na urbanistickou formu.`,

      zh: `勇敢的冒险家，欢迎来到英德日什斯卡塔——圣亨利钟楼（Jindřišská věž）！

这座65米高的哥特式钟楼矗立于新城（Nové Město）中心，是布拉格最具特色的哥特式建筑之一，也是捷克境内为数不多保存完好的独立式钟楼之一。它建于1455至1475年间，最初是邻近的圣亨利与圣昆胡塔教堂的钟楼——这解释了其不同寻常的空间布局：钟楼与教堂分离而立而非融为一体，这一中世纪的空间决策在五百多年间为新城的这个角落提供了独特的竖向标点。塔内设有小型博物馆占据十二层中的数层，顶部咖啡厅可俯瞰新城屋顶。

自建成以来，这座塔历经多种功能：曾作为守望人的居所、监狱，以及向城市泵水的机械装置。1757年七年战争期间遭到普鲁士炮击，1879年又经历了一场毁灭性大火，每次都得以重建。钟声——这座塔存在的原始理由——几个世纪来持续报时，陪伴着新城从中世纪聚落蜕变为19世纪的市民街区，再到今日的商业中心。

🥚 彩蛋：钟楼所属的圣亨利与圣昆胡塔教堂，由查理四世皇帝于1348年作为他的新城综合规划的一部分而创立——这是一个他从零开始设计的城区，其规模和速度在中世纪城市史上无出其右。查理四世以非凡的几何精度规划新城，按照一套有意为之的方案安置教堂、广场和街道。圣亨利钟楼之所以看起来像是被刻意放置于此，正是因为它确实如此——作为一座城市的标点符号，这座城市是由一位对城市形态有着异常强烈主张的皇帝自上而下书写的。`,
    },
  },
  {
    name: "Kafka's House",
    slug: 'kafkuv-dum',
    localizedNames: { cz: 'Kafkův dům', zh: '卡夫卡故居' },
    labels: ['historical', 'cultural', 'architecture'],
    coordinates: { lat: 50.087975464664126, lng: 14.419165872675462 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Kafkův dům — the birthplace of Franz Kafka!

Franz Kafka was born on July 3, 1883, in a house that no longer exists. The original building, which stood at the corner of Maiselova and Kaprova streets on the edge of the Jewish Quarter, was demolished during the "sanitation" of Josefov — the controversial urban renewal of 1893–1913 that razed most of the medieval Jewish Town and replaced it with new Art Nouveau boulevards. The current building at Náměstí Franze Kafky 3, marked by a small bust and plaque, dates from around 1902. The city did not keep the house where Kafka was born. The city kept the address.

Kafka spent almost his entire life in Prague, moving through a sequence of apartments across the Old Town and Josefov. He studied law at Charles University, worked as a claims assessor at the Workers' Accident Insurance Institute, and wrote — in German, the language of Prague's Jewish intellectual class — the novels and stories that would make him one of the most read writers of the twentieth century. He published almost nothing in his lifetime. He left instructions for his friend and executor Max Brod to burn all his unpublished manuscripts after his death. Brod declined. This is possibly the most consequential act of literary disobedience in history.

🥚 Easter Egg: "Prague doesn't let go," Kafka wrote to a friend in 1902. "This little mother has claws." He spent years considering departure — Jerusalem, Berlin, Vienna recur in his letters — and repeatedly did not leave. The city appears in his work not as a recognisable place but as atmosphere: a Castle unreachable across a valley, a Court operating by logic no one can identify, a Penal Colony running on rules no one questions. Scholars have argued for a century about whether these are political allegories, existential parables, or prophetic horror. The answer is probably all three simultaneously, and the city that produced them is probably the same.`,

      cz: `Statečný dobrodruhu, vítej v Kafkově domě — rodišti Franze Kafky!

Franz Kafka se narodil 3. července 1883 v domě, který už neexistuje. Původní budova stojící na rohu Maiselovy a Kaprovy ulice na okraji Židovského Města byla zbořena během "sanace" Josefova — kontroverzní asanace z let 1893–1913, která srovnala se zemí většinu středověkého Židovského Města a nahradila ho novými secesními bulváry. Současná budova na náměstí Franze Kafky 3, označená malou bustou a pamětní deskou, pochází přibližně z roku 1902. Město si nedochovalo dům, kde se Kafka narodil. Město si uchovalo adresu.

Kafka strávil téměř celý svůj život v Praze, přecházeje přes sled bytů po Starém Městě a Josefově. Studoval práva na Karlově univerzitě, pracoval jako likvidátor pojistných událostí v Dělnické úrazové pojišťovně a psal — německy, jazykem pražské židovské intelektuální třídy — romány a povídky, které z něj udělaly jednoho z nejčtenějších spisovatelů dvacátého století. Za svého života nepublikoval téměř nic. Svému příteli a vykonavateli závěti Maxu Brodovi zanechal pokyny, aby po jeho smrti spálil všechny nevydané rukopisy. Brod odmítl. Toto je možná nejzásadnější akt literární neposlušnosti v dějinách.

🥚 Velikonoční vajíčko: "Praha nepouští," napsal Kafka příteli roku 1902. "Tato malá matička má drápy." Léta uvažoval o odchodu — Jeruzalém, Berlín, Vídeň se opakují v jeho dopisech — a opakovaně neodjel. Město se v jeho díle neobjevuje jako rozpoznatelné místo, ale jako atmosféra: Hrad nedosažitelný přes údolí, Soud fungující podle logiky, kterou nikdo nedokáže identifikovat, Trestanecká kolonie provozující pravidla, která nikdo nezpochybňuje. Badatelé se sto let přou o to, zda jde o politické alegorie, existenciální podobenství nebo prorocký horor. Odpověď je pravděpodobně všechno tři současně, a město, které je vyprodukovalo, je pravděpodobně stejné.`,

      zh: `勇敢的冒险家，欢迎来到卡夫卡故居（Kafkův dům）——弗兰茨·卡夫卡的出生地！

弗兰茨·卡夫卡（Franz Kafka）于1883年7月3日出生在一栋已不复存在的房子里。那栋原始建筑曾矗立在迈瑟洛娃街（Maiselova）和卡普洛娃街（Kaprova）的交角、犹太区边缘，在约瑟夫区"卫生改造"（1893—1913年）期间被夷为平地——那场争议不断的城市更新将中世纪犹太城的大部分推倒重建为新艺术风格的林荫大道。如今在弗兰茨·卡夫卡广场3号、以一座小铜像和铭牌标注的现有建筑，大约建于1902年。这座城市没有保留卡夫卡出生的房子，它保留的是地址。

卡夫卡几乎一生都在布拉格度过，辗转于老城和约瑟夫区的一系列公寓之间。他在查理大学学习法律，在工人事故保险公司担任理赔员，用德语——布拉格犹太知识阶层的语言——写作小说和故事，这些作品使他成为20世纪阅读量最大的作家之一。他在世期间几乎没有发表任何作品。他留下指示，让他的朋友兼遗嘱执行人马克斯·布罗德（Max Brod）在他死后烧毁所有未发表的手稿。布罗德拒绝了。这或许是文学史上最具决定性意义的一次违抗。

🥚 彩蛋："布拉格不放手，"卡夫卡1902年写信给一位朋友说，"这个小母亲有爪子。"他多年来一直考虑离开——耶路撒冷、柏林、维也纳在他的信件中反复出现——却一次次没有离开。这座城市在他的作品中不以可辨认的地名出现，而是作为一种氛围：跨越山谷却永远无法抵达的城堡，按照无人能识别的逻辑运转的法庭，按照无人质疑的规则运行的流刑地。学者们争论了一个世纪，这些是政治寓言、存在主义比喻还是预言性的恐怖。答案或许是三者同时成立，而孕育了这些作品的城市也或许如此。`,
    },
  },
  {
    name: 'Kajetánka Park',
    slug: 'kajetanka-park',
    localizedNames: { cz: 'Park Kajetánka a Nová Vila Kajetánka', zh: '卡耶坦卡公园' },
    labels: ['park', 'historical', 'architecture'],
    coordinates: { lat: 50.08792169526558, lng: 14.373537883595835 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Park Kajetánka and Nová Vila Kajetánka!

Tucked into a hillside in Střešovice, west of Prague Castle and below the rim of the Hradčany plateau, Kajetánka is the kind of park that rewards navigation. It requires knowing it exists, finding the right entrance, and committing to the walk — after which it offers the thing that parks near the castle rarely provide: space, quiet, and a view of the city from an angle that most visitors never find. The park is built around the garden of a former Theatine monastery that once occupied this slope, and its terraced layout retains something of the formal garden geometry beneath the later informality of a public space.

The Nová Vila Kajetánka — the New Kajetánka Villa — is the building at the park's centre that now operates as a restaurant and event space. The name "Kajetánka" comes from the founder of the Theatine order, Saint Cajetan (San Gaetano da Thiene, 1480–1547), whose monastery garden this originally was. The Theatines arrived in Prague in the seventeenth century as part of the Counter-Reformation, and their garden on the Střešovice slope became a place of cultivation and retreat. After Josef II dissolved the monasteries in 1786, the garden eventually opened to the public and has served the western residential districts of Prague ever since.

🥚 Easter Egg: Saint Cajetan, for whom this park is ultimately named, was one of the more practically-minded Counter-Reformation saints. He did not primarily write mystical theology or accumulate documented miracles. What he did was found the Monte di Pietà — a network of charitable lending institutions designed to provide small loans to the poor at low or zero interest, competing directly with moneylenders whose usurious rates were devastating ordinary people across sixteenth-century Italy. The Monte di Pietà was, in structural terms, an early credit union. The saint whose name echoes through this quiet park in Střešovice was, among other things, a pioneer of ethical finance. Prague's saints contain multitudes.`,

      cz: `Statečný dobrodruhu, vítej v Parku Kajetánka a Nové Vile Kajetánka!

Zaklíněný do svahu ve Střešovicích, západně od Pražského hradu a pod okrajem hradčanské plošiny, je Kajetánka typem parku, který odměňuje navigaci. Vyžaduje vědět o jeho existenci, najít správný vstup a odhodlání se projít — poté nabízí to, co parky poblíž hradu jen zřídka poskytují: prostor, ticho a pohled na město z úhlu, který většina návštěvníků nikdy nenajde. Park je vybudován kolem zahrady bývalého theatinského kláštera, který kdysi obsazoval tento svah, a jeho terasovité uspořádání si zachovává něco z geometrie formální zahrady pod pozdější neformálností veřejného prostoru.

Nová Vila Kajetánka — budova v centru parku — dnes slouží jako restaurace a prostory pro akce. Název "Kajetánka" pochází od zakladatele theatinského řádu, sv. Kajetána (San Gaetano da Thiene, 1480–1547), jehož klášterní zahrada to původně byla. Theatini přišli do Prahy v sedmnáctém století jako součást protireformace a jejich zahrada na střešovickém svahu se stala místem kultivace a ústraní. Poté, co Josef II. v roce 1786 rozpustil kláštery, se zahrada nakonec otevřela veřejnosti a od té doby slouží západním rezidenčním čtvrtím Prahy.

🥚 Velikonoční vajíčko: Sv. Kajetán, po němž je tento park nakonec pojmenován, byl jedním z praktičtěji smýšlejících světců protireformace. Primárně nepsal mystickou teologii ani nehromadil zdokumentované zázraky. Co však udělal, bylo, že founded Monte di Pietà — síť charitativních úvěrových institucí navržených k poskytování malých půjček chudým s nízkým nebo nulovým úrokem, přímo konkurující lichvářům, jejichž úžernické sazby ničily obyčejné lidi po celé Itálii šestnáctého století. Monte di Pietà bylo strukturálně vzato ranou úvěrní unií. Světec, jehož jméno rezonuje v tomto tichém parku ve Střešovicích, byl mimo jiné průkopníkem etického financování. Pražští světci toho v sobě skrývají hodně.`,

      zh: `勇敢的冒险家，欢迎来到卡耶坦卡公园和新卡耶坦卡别墅（Park Kajetánka a Nová Vila Kajetánka）！

卡耶坦卡公园藏于斯特热绍维采（Střešovice）的山坡上，位于布拉格城堡以西、赫拉德恰内台地边缘以下，是那种需要主动寻找才能发现的公园。你需要先知道它的存在，找到正确的入口，然后坚持走进去——之后它会给你提供城堡附近的公园极少能给予的东西：空间、宁静，以及一个大多数游客从未发现的城市观察角度。公园依托昔日泰亚廷修道院（Theatine）的花园而建——那座修道院曾经占据这片山坡——其梯田式格局在后来的公共休闲空间改造之下，仍保留着部分规则式花园的几何感。

公园中央的新卡耶坦卡别墅（Nová Vila Kajetánka）如今作为餐厅和活动场所运营。"卡耶坦卡"这个名字源于泰亚廷修道团创始人圣卡耶坦（San Gaetano da Thiene，1480—1547），这里最初正是他的修道院花园。泰亚廷修士在17世纪作为反宗教改革运动的一部分来到布拉格，他们在斯特热绍维采山坡上的花园成为修行与隐居之所。1786年约瑟夫二世解散修道院后，这片花园最终向公众开放，此后一直服务于布拉格西部住宅区的居民。

🥚 彩蛋：这座公园最终以之命名的圣卡耶坦，是反宗教改革时期最具实践精神的圣人之一。他的主要贡献不在于撰写神秘主义神学或积累有据可查的神迹，而在于创立了"虔诚之山"（Monte di Pietà）——一个慈善借贷机构网络，旨在以低息或零息向穷人提供小额贷款，直接与那些以高利贷压榨16世纪意大利普通民众的放贷者竞争。从结构上看，Monte di Pietà就是早期的信用合作社。这位名字在斯特热绍维采这处幽静公园中回响的圣人，也是道德金融的先驱之一。布拉格的圣人们，各有其深藏的多面性。`,
    },
  },
  {
    name: 'Karolinum',
    slug: 'karolinum',
    localizedNames: { cz: 'Karolinum', zh: '卡罗利努姆' },
    labels: ['academy', 'historical', 'architecture'],
    coordinates: { lat: 50.08631952716103, lng: 14.423102082033886 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Karolinum — the historic heart of Charles University!

Founded in 1348 by Emperor Charles IV, Charles University (Univerzita Karlova) is the oldest university in Central Europe and one of the oldest in the world. The Karolinum is the surviving medieval core of that institution: a complex of buildings centred around a Gothic bay window — the Wenceslas College oriel — which has become the most reproduced image of the university. Charles IV obtained a papal bull from Pope Clement VI authorising the foundation, making Prague's university the first in the Holy Roman Empire east of the Rhine. Within a generation, it was drawing scholars from across Central and Northern Europe, and the city around it had become one of the intellectual centres of the medieval world.

The Karolinum has been at the centre of Czech intellectual and political history in ways that exceed what any single building can usually claim. Jan Hus served as rector here before his death at the Council of Constance in 1415. The Velvet Revolution of 1989 began in earnest when Prague's students marched — and when the faculty publicly declared solidarity. Between those two events: the Habsburg occupation, the Nazi Protectorate during which the university was forcibly closed and faculty members deported and executed, and forty years of Communist oversight over academic appointments and curricula. The building has witnessed the full arc of what it is possible to do to an institution of learning.

🥚 Easter Egg: In 1409, a dispute over which of two rival popes to support triggered the Kutná Hora Decree, in which King Václav IV restructured the university's voting to give Czech scholars three votes against one for all foreign nations combined. The result was a mass exodus: several thousand German scholars and students departed Prague and co-founded Leipzig University. The rearrangement that made the Karolinum more Czech inadvertently created one of Germany's most distinguished universities. The decree also elevated Jan Hus to the rectorship. He was burned at the stake six years later. The chain of consequences from a university governance dispute is not always predictable.`,

      cz: `Statečný dobrodruhu, vítej v Karolinu — historickém srdci Karlovy univerzity!

Karlova univerzita, founded v roce 1348 císařem Karlem IV., je nejstarší univerzitou ve střední Evropě a jednou z nejstarších na světě. Karolinum je dochovaným středověkým jádrem této instituce: komplex budov soustředěný kolem gotického arkýře — arkýře Václavské koleje — který se stal nejrozšířenějším obrazem univerzity. Karel IV. získal papežskou bulu od papeže Klementa VI., která autorizovala její founded, čímž se pražská univerzita stala první v Říši německého národa východně od Rýna. Během generace přitahovala učence z celé střední a severní Evropy a město kolem ní se stalo jedním z intelektuálních center středověkého světa.

Karolinum bylo centrem českých intelektuálních a politických dějin způsoby, které přesahují to, co může obvykle jedné budově nárokovat. Jan Hus sloužil jako rektor před svou smrtí na Kostnickém koncilu roku 1415. Sametová revoluce roku 1989 začala naplno, když pražští studenti pochodovali — a když fakulta veřejně prohlásila solidaritu. Mezi těmito dvěma událostmi: habsburská nadvláda, nacistický protektorát, během nějž byla univerzita násilně uzavřena a příslušníci fakulty deportováni a popraveni, a čtyřicet let komunistického dohledu nad akademickými jmenováními a osnovami. Budova byla svědkem celého oblouku toho, co je možné udělat s institucí vzdělanosti.

🥚 Velikonoční vajíčko: V roce 1409 spor o to, kterého ze dvou soupeřících papežů podpořit, spustil Dekret kutnohorský, v němž král Václav IV. přestrukturoval hlasování na univerzitě tak, aby dával českým učencům tři hlasy oproti jednomu pro všechny cizí národy dohromady. Výsledkem byl masový exodus: několik tisíc německých učenců a studentů opustilo Prahu a spoluzaložilo Lipskou univerzitu. Přeskupení, které učinilo Karolinum více českým, nechtěně vytvořilo jednu z nejprestižnějších německých univerzit. Dekret také povýšil Jana Husa do rektorátu. Za šest let byl upálen na hranici. Řetěz důsledků ze sporu o správu univerzity není vždy předvídatelný.`,

      zh: `勇敢的冒险家，欢迎来到卡罗利努姆（Karolinum）——查理大学的历史核心！

查理大学（Univerzita Karlova）由皇帝查理四世于1348年创立，是中欧最古老的大学，也是世界上最古老的大学之一。卡罗利努姆是这所大学保存至今的中世纪核心建筑群：围绕一扇哥特式凸窗——瓦茨拉夫学院飘窗——构建而成，而这扇飘窗已成为这所大学最被广泛复制的形象。查理四世从教皇克莱蒙六世处获得教皇诏书授权创校，使布拉格大学成为莱茵河以东神圣罗马帝国境内的第一所大学。不到一代人的时间，它便吸引来自整个中欧和北欧的学者，使周围的城市成为中世纪知识世界的中心之一。

卡罗利努姆在捷克知识史和政治史上的核心地位，远超通常一座建筑所能承载的分量。扬·胡斯在1415年康斯坦茨公会议遇难前曾在此担任校长。1989年天鹅绒革命在布拉格学生上街游行、大学教职人员公开声援时正式展开。在这两个事件之间：哈布斯堡统治、纳粹保护国期间大学被强制关闭、教职人员遭驱逐和处决，以及长达四十年的共产党对学术任命和课程设置的监控。这座建筑见证了对一所教育机构所能施加的一切的完整弧线。

🥚 彩蛋：1409年，一场关于支持两位对立教皇之中的哪一位的争论，引发了库特纳霍拉诏令（Kutná Hora Decree）——瓦茨拉夫四世国王重组大学投票权，给予捷克学者三票，而所有外国群体合计仅得一票。结果是大规模出走：数千名德国学者和学生离开布拉格，共同创建了莱比锡大学。使卡罗利努姆变得更加捷克化的这一重组，无意间创造了德国最负盛名的大学之一。该诏令同时也将扬·胡斯提升至校长职位。六年后，他被烧死在火刑柱上。一场大学治理争议所引发的后果链条，并不总是可以预见的。`,
    },
  },
  {
    name: 'KodlContemporary',
    slug: 'kodl-contemporary',
    localizedNames: { cz: 'KodlContemporary', zh: '科德尔当代艺术空间' },
    labels: ['cultural', 'museum', 'modern'],
    coordinates: { lat: 50.09208300394867, lng: 14.418069631015314 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to KodlContemporary!

The Kodl name has been central to the Czech fine art market for decades. KodlContemporary is their dedicated space for contemporary art — a gallery that sits at the intersection of the commercial art world and the broader cultural conversation about what Czech and Central European art means in the twenty-first century. The gallery occupies a position in Prague's Josefov-adjacent neighbourhood, in a part of the city that has quietly become one of its more concentrated pockets of cultural institution, drawing an audience of collectors, curators, artists, and people who simply want to see what is happening in Czech art right now.

The context matters. Czechoslovakia spent forty years under a state that prescribed what art was permitted to look like, what subjects were acceptable, and which artists were allowed to exhibit at all. The result was a bifurcated art world: official art that followed socialist realist conventions, and unofficial art that circulated in apartments, samizdat publications, and the studios of artists who had been blacklisted. When 1989 arrived, these two worlds had to be reconciled, the unofficial work recognised and exhibited, the market rebuilt from scratch. The contemporary Czech art scene that exists today — including galleries like KodlContemporary — is the product of that thirty-five-year reconstruction.

🥚 Easter Egg: The unofficial art of Communist Czechoslovakia developed its own distinctive visual languages partly because it had to — artists working outside the system could not exhibit publicly, which meant they had no reason to make work that communicated to a general audience. They could make work for themselves, for small circles, for the future. Some of the most formally adventurous Czech art of the twentieth century was made in this condition of enforced privacy. When it finally entered public galleries after 1989, it arrived already formed, already itself, already indifferent to whether it was immediately legible. That indifference is, in its own way, a kind of freedom.`,

      cz: `Statečný dobrodruhu, vítej v KodlContemporary!

Jméno Kodl je již desetiletí ústřední součástí českého trhu s výtvarným uměním. KodlContemporary je jejich dedikovaný prostor pro současné umění — galerie, která stojí na průsečíku komerčního světa umění a širší kulturní konverzace o tom, co české a středoevropské umění znamená v jednadvacátém století. Galerie zaujímá pozici v josefovském sousedství Prahy, v části města, která se tiše stala jednou z jeho koncentrovanějších kapes kulturních institucí, přitahující publikum sběratelů, kurátorů, umělců a lidí, kteří jednoduše chtějí vidět, co se v českém umění právě teď děje.

Kontext je důležitý. Československo strávilo čtyřicet let pod státem, který předpisoval, jak umění smí vypadat, jaká témata jsou přijatelná a kteří umělci vůbec mohou vystavovat. Výsledkem byl bifurkovaný svět umění: oficiální umění sledující konvence socialistického realismu a neoficiální umění cirkulující v bytech, samizdatových publikacích a atelérech umělců, kteří byli zařazeni na černou listinu. Když přišel rok 1989, tyto dva světy musely být smířeny, neoficiální díla uznána a vystavena, trh přebudován od základu. Současná česká umělecká scéna, která dnes existuje — včetně galerií jako KodlContemporary — je produktem této třicetipětileté rekonstrukce.

🥚 Velikonoční vajíčko: Neoficiální umění komunistického Československa si vyvinulo vlastní svébytné vizuální jazyky zčásti proto, že muselo — umělci pracující mimo systém nemohli veřejně vystavovat, což znamenalo, že neměli důvod tvořit díla, která komunikují s obecným publikem. Mohli tvořit pro sebe, pro malé kruhy, pro budoucnost. Některé formálně nejodvážnější české umění dvacátého století vzniklo v tomto stavu vynucené soukromosti. Když po roce 1989 konečně vstoupilo do veřejných galerií, přišlo již utvářené, již samo sebou, již lhostejné k tomu, zda je okamžitě srozumitelné. Tato lhostejnost je svým způsobem formou svobody.`,

      zh: `勇敢的冒险家，欢迎来到科德尔当代艺术空间（KodlContemporary）！

科德尔（Kodl）这个名字在捷克美术市场上举足轻重，已历经数十年。KodlContemporary是他们专注于当代艺术的画廊空间——一个处于商业艺术世界与更广泛的文化讨论交汇点的场所，探索捷克及中欧艺术在21世纪意味着什么。画廊位于布拉格约瑟夫区附近的街区，这一区域已悄然成为布拉格文化机构较为集中的地带之一，吸引着收藏家、策展人、艺术家以及那些只想了解捷克当代艺术动态的人。

背景至关重要。捷克斯洛伐克在一个规定艺术必须长什么样、哪些主题可以接受、哪些艺术家被允许展览的国家体制下度过了四十年。结果是一个两极分化的艺术世界：遵循社会主义现实主义惯例的官方艺术，以及在公寓、地下出版物和被列入黑名单的艺术家工作室中流通的非官方艺术。1989年到来后，这两个世界必须和解，非官方作品得到认可和展出，市场从零重建。今天存在的捷克当代艺术场景——包括科德尔当代艺术空间这样的画廊——正是这三十五年重建的产物。

🥚 彩蛋：共产主义捷克斯洛伐克的非官方艺术之所以发展出自己独特的视觉语言，部分原因正在于不得不如此——在体制外工作的艺术家无法公开展览，这意味着他们没有理由创作面向普通观众传播的作品。他们可以为自己创作，为小圈子创作，为未来创作。20世纪捷克在形式上最具探索精神的一些艺术，正是在这种被迫私密的状态下诞生的。当1989年后它们终于走进公共画廊，这些作品已然成型，已然是自己本身，已然对是否能被立即读懂漠然以待。这种漠然，以其特有的方式，是一种自由。`,
    },
  },
  {
    name: 'KOH-I-NOOR',
    slug: 'koh-i-noor',
    localizedNames: { cz: 'KOH-I-NOOR', zh: '光之山铅笔厂' },
    labels: ['historical', 'hidden-gem', 'architecture'],
    coordinates: { lat: 50.06792270539102, lng: 14.461515189971745 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to KOH-I-NOOR!

The name means "Mountain of Light" in Persian. It was the name of a 105-carat diamond mined in India, owned successively by Mughal emperors, Persian conquerors, Afghan shahs, and Sikh maharajas before the British annexed Punjab in 1849 and the diamond eventually ended up in the British Crown Jewels. It was also, as of 1889, the name of a pencil. Joseph Hardtmuth, who founded the pencil company in Vienna in 1790, had introduced the hexagonal pencil and discovered that mixing graphite with clay produces a writing instrument of controllable hardness. His descendants launched the "KOH-I-NOOR" brand at the 1889 Paris World Exhibition, naming their finest pencil after the most famous diamond in the world. The marketing logic was either inspired or brazen, depending on your temperament. It worked.

The company's Czech operations — centred in České Budějovice, with presence in Prague — became central to its identity after the First World War and the establishment of Czechoslovakia. Nationalised under communism and privatised again after 1989, KOH-I-NOOR Hardtmuth is one of the few brands from the nineteenth century that survived the full twentieth — empire, republic, occupation, communism, revolution — and emerged still manufacturing the same essential product with the same name. The pencil factory on the outskirts of Prague is part of that continuity: a place where the mundane act of making a writing instrument has been performed, with minimal fuss, for generations.

🥚 Easter Egg: The Koh-i-Noor diamond's journey through history is one of the more operatically excessive stories in the annals of precious stones. It passed through the hands of the Mughal emperor who called it the "Mountain of Light," was seized by Nader Shah of Persia and taken to Tehran, changed hands through assassination and war, arrived in Lahore, and was surrendered to Queen Victoria after the British conquest of the Punjab. It has been set in the crowns of three British queens and is currently in the Tower of London. India, Pakistan, Iran, and Afghanistan have all at various points requested its return. The British government's position is that the diamond was acquired legitimately. The KOH-I-NOOR pencil, named after all of this, costs about forty crowns.`,

      cz: `Statečný dobrodruhu, vítej v KOH-I-NOOR!

Název znamená persky "Hora světla". Byl to název 105karátového diamantu těženého v Indii, vlastněného postupně mughalskými císaři, perskými dobyvateli, afghánskými šáhy a sikhskými maharadžy, než Britové v roce 1849 anektovali Paňdžáb a diamant nakonec skončil v britských korunovačních klenotech. Byl to také, od roku 1889, název tužky. Joseph Hardtmuth, který founded tužkovou společnost ve Vídni v roce 1790, zavedl šestihrannou tužku a zjistil, že míchání grafitu s jílem produkuje psací nástroj s kontrolovatelnou tvrdostí. Jeho potomci uvedli značku "KOH-I-NOOR" na Světové výstavě v Paříži roku 1889, pojmenujíce svou nejlepší tužku po nejslavnějším diamantu světa. Marketingová logika byla buď geniální, nebo bezostyšná, podle vašeho temperamentu. Fungovala.

České operace společnosti — soustředěné v Českých Budějovicích, s přítomností v Praze — se po první světové válce a vzniku Československa staly ústředními pro její identitu. Znárodněna za komunismu a znovu zprivatizována po roce 1989, KOH-I-NOOR Hardtmuth je jednou z mála značek z devatenáctého století, které přežily celé dvacáté — říši, republiku, okupaci, komunismus, revoluci — a vyšly stále vyrábějící stejný základní produkt se stejným názvem. Tužkárna na okraji Prahy je součástí této kontinuity: místo, kde se banální akt výroby psacího nástroje provádí, bez velkého povyku, po generace.

🥚 Velikonoční vajíčko: Cesta diamantu Koh-i-Noor dějinami je jedním z operně přehnaných příběhů v análech drahokamů. Prošel rukama mughalského císaře, který ho nazval "Hora světla", byl zmocněn Nádirem Šáhem Perským a převezen do Teheránu, přecházel z ruky do ruky vražedstvím a válkou, dorazil do Láhóru a byl odevzdán královně Viktorii po britském dobytí Paňdžábu. Byl zasazen do korun tří britských královen a v současnosti se nachází v Toweru of London. Indie, Pákistán, Írán a Afghánistán si v různých momentech vyžádaly jeho vrácení. Stanovisko britské vlády je, že diamant byl nabyt legitimně. Tužka KOH-I-NOOR, pojmenovaná po všem tomto, stojí asi čtyřicet korun.`,

      zh: `勇敢的冒险家，欢迎来到光之山铅笔厂（KOH-I-NOOR）！

这个名字在波斯语中的意思是"光之山"。它是一颗105克拉钻石的名称——那颗钻石在印度被开采出来，先后经过莫卧儿皇帝、波斯征服者、阿富汗沙阿和锡克族大君之手，直到1849年英国吞并旁遮普邦，钻石最终落入英国王室珠宝之中。从1889年起，它也是一支铅笔的名字。约瑟夫·哈特穆斯（Joseph Hardtmuth）于1790年在维也纳创立了这家铅笔公司，他发明了六角形铅笔，并发现将石墨与黏土混合可以制造出硬度可控的书写工具。他的后代在1889年巴黎世界博览会上推出"KOH-I-NOOR"品牌，以世界上最著名的钻石命名他们最优质的铅笔。这套营销逻辑或许是天才之举，或许是厚颜无耻，取决于你的性情。但它奏效了。

第一次世界大战结束、捷克斯洛伐克建国后，公司的捷克业务——总部位于捷克布杰约维采（České Budějovice），在布拉格亦有布局——成为其身份认同的核心。经历了共产主义时代的国有化和1989年后的再度私有化，KOH-I-NOOR Hardtmuth是为数不多的在19世纪诞生、历经整个20世纪——帝国、共和国、占领、共产主义、革命——并以同样的名称继续生产同样基本产品的品牌之一。布拉格郊区的这处铅笔厂是这种延续性的一部分：一个几代人以来默默无闻地执行着制造书写工具这一平凡行为的地方。

🥚 彩蛋：光之山钻石的历史旅程，是珍贵宝石编年史中最具歌剧式戏剧性的故事之一。它曾传经称它为"光之山"的莫卧儿皇帝之手，被波斯的纳迪尔·沙阿夺走带回德黑兰，在暗杀和战争中几经易手，最终抵达拉合尔，并在英国征服旁遮普后被献给维多利亚女王。它曾被镶嵌于三位英国王后的王冠之中，目前收藏在伦敦塔。印度、巴基斯坦、伊朗和阿富汗都曾在不同时期要求归还。英国政府的立场是，这颗钻石是以合法方式获得的。以这一切命名的KOH-I-NOOR铅笔，大约售价四十克朗。`,
    },
  },
  {
    name: 'Koruna Palace',
    slug: 'palac-koruna',
    localizedNames: { cz: 'Palác Koruna', zh: '科鲁纳宫' },
    labels: ['architecture', 'historical', 'cultural'],
    coordinates: { lat: 50.08420389441953, lng: 14.424021298431308 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Palác Koruna — the Koruna Palace!

The Koruna Palace was built between 1911 and 1914 at what is arguably the most commercially significant intersection in Prague: the junction of Wenceslas Square and the luxury shopping street Na Příkopě. Architect Antonín Pfeiffer designed it as a deliberately theatrical building — the corner tower crowned with a glass-and-steel dome in the shape of a crown (koruna), visible from both streets simultaneously, announcing that whatever was happening inside was of the highest order. The building marked Prague's transition from the sinuous ornament of Art Nouveau toward the geometric confidence of early Modernism, and was among the first commercial structures in the city to use steel-reinforced concrete. The crown dome was designed to be electrically illuminated at night — one of the first commercially lit landmarks in Prague.

The word koruna means both "crown" and the Czech currency. This double meaning, entirely intentional, made the palace's name a compact advertisement: the Crown building, at the top of Wenceslas Square, dealing in crowns. The building has housed shops, offices, a cinema, and a famous ground-floor arcade café across successive eras. The Koruna has survived Habsburg commerce, two occupations, Communist nationalisation, and post-1989 privatisation — its glass crown still catching light above the foot of the square where it has stood for over a century.

🥚 Easter Egg: On November 17, 1989 — the day that would trigger the Velvet Revolution — student demonstrators were beaten by police on Národní třída, a few hundred metres from where you are standing. By the following day, Wenceslas Square was filling with crowds. The Koruna Palace stood at the foot of the square throughout the days of improvised speeches, jangling keys, and Václav Havel's voice coming from makeshift loudspeakers. Buildings do not participate in revolutions. But they are always present at them, and this one has been present at rather a lot.`,
    },
  },
  {
    name: 'Residence of the Mayor of Prague',
    slug: 'rezidence-primatora',
    localizedNames: { cz: 'Rezidence primátora hlavního města Prahy', zh: '布拉格市长官邸' },
    labels: ['historical', 'architecture', 'municipal'],
    coordinates: { lat: 50.08740291208507, lng: 14.417387194460145 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Rezidence primátora — the Official Residence of the Lord Mayor of Prague!

The position of primátor — Lord Mayor of Prague — is one of the oldest continuously held civic offices in Central Europe, tracing its origins to the medieval municipal institutions that governed the Old Town, New Town, Malá Strana, and Hradčany as four legally separate towns before their administrative unification in 1784. The person who holds this office today is the elected head of a capital city of 1.3 million people, responsible for a budget of considerable scale and a position that places them at the intersection of national politics, European urban policy, and the daily administrative reality of running one of the most visited cities on the continent. The residence is embedded in the civic fabric of the Old Town — authority housed not in isolated grandeur but in the neighbourhood it governs.

Prague's history of primátors is a compressed version of Czech history. The Habsburgs appointed compliant administrators. The First Republic produced mayors of genuine civic ambition who shaped the modern city. The Nazi Protectorate made the role a conduit for occupation. The Communist period transformed it into a party appointment. The post-1989 primátors have navigated rapid development, mass tourism, and European integration in a city rebuilding its civic identity from the ground up. The residence has housed representatives of all these eras — which is a way of saying it has housed both collaboration and courage, sometimes without distinguishing between them.

🥚 Easter Egg: The administrative unification of Prague's four historic towns in 1784 was an act of Habsburg rationalisation, part of the same Josephine reforms that dissolved the monasteries and reorganised the Church. The four towns had coexisted as legally separate entities for over four centuries, with their own councils, laws, and occasionally their own conflicts. Unification made administrative sense. It also, for the first time, created a single "Prague" that required a single mayor — and that required someone to decide what Prague actually was. That question has been argued about ever since, and the person who holds this office is, among other things, the latest answer.`,
    },
  },
  {
    name: 'City Gallery Prague — Bílek Villa',
    slug: 'bilkova-vila',
    localizedNames: { cz: 'Galerie hlavního města Prahy – Bílkova vila', zh: '布拉格市立美术馆——比尔克别墅' },
    labels: ['cultural', 'museum', 'architecture'],
    coordinates: { lat: 50.09529126233349, lng: 14.408429963259787 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Bílkova vila — the Bílek Villa, now a gallery of the City of Prague!

František Bílek (1872–1941) was a sculptor, draughtsman, architect, and visionary whose work defied every category his contemporaries tried to apply to it. He was associated with Czech Symbolism and Art Nouveau but answered primarily to a private spiritual theology that owed as much to his own mysticism as to any movement. He designed and built this villa in 1911 as his home, studio, and — there is no other word for it — temple. The low horizontal building, with its Egyptian-influenced columns, its facade decorated with sheaves of wheat (Bílek's recurring symbol of the cycle of life and death), and its proportions intended to evoke the human figure lying in the earth, is one of the most singular pieces of architecture in Prague. No one else would have built this. No one else did.

Bílek worked in almost complete indifference to the art market, in genuine dialogue with the deeper currents of Czech Symbolist culture. He corresponded with Otokar Březina, the greatest poet of Czech Symbolism. He was preoccupied throughout his career with the figure of Jan Hus — producing multiple works depicting him as a prophetic martyr who spoke directly to Czech spiritual identity. The villa now belongs to the City of Prague and houses a permanent collection of his work: sculptures that feel carved from personal necessity, drawings of extraordinary graphic intensity, and decorative objects in which beauty and religious purpose are inseparable.

🥚 Easter Egg: Bílek chose to build in Hradčany rather than in any of the fashionable artistic districts of the period — not Vinohrady, not the bourgeois New Town, but in the shadow of the castle, on the edge of the city's oldest and most symbolically loaded hill. This was deliberate. Bílek understood his work as belonging in the landscape of Czech spiritual history, not the commercial art market. He was also, by contemporary standards, extremely poor for most of his life, sustained by a small circle of admirers rather than sales. The villa is a monument to what it looks like when an artist builds their life entirely around vision and nothing else — including financial prudence. The result is extraordinary. The process was apparently quite hard.`,
    },
  },
  {
    name: 'Strašnice Crematorium',
    slug: 'strasnice-crematorium',
    localizedNames: { cz: 'Krematorium Strašnice', zh: '斯特拉什尼采火葬场' },
    labels: ['historical', 'architecture'],
    coordinates: { lat: 50.07645747473891, lng: 14.48472152135038 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Krematorium Strašnice — Prague's most confidently designed farewell. Built in the shadow of Vinohrady Cemetery, this Constructivist giant does not whisper about death the way churches do. It states it plainly, in poured concrete, with a floor plan the size of a small airport terminal.

Architect Alois Mezera designed it in the late 1920s as a showcase of pure Constructivist confidence — no crosses, no saints, no Gothic spires, just clean geometry and a crematory hall built to a scale unmatched anywhere else in Europe. Construction began in 1929, the opening ceremony was held on 23 January 1932, and the building has been protected as a cultural monument since 1988. It remains, by floor area, the largest crematorium on the continent — Prague's talent for architectural excess apparently applies to endings as much as beginnings.

Its ledger of names is where the building stops being merely impressive and becomes genuinely heavy. Writer Vladislav Vančura was secretly disposed of here in 1942 after his execution during the Nazi reprisals following the assassination of Reinhard Heydrich. General Josef Mašín and Bishop Gorazd of Prague met the same fate under occupation. After the war, the Communist regime used it exactly the same way: politician Milada Horáková was cremated here after her 1950 show trial, and to this day nobody knows where her ashes ended up. Václav Havel, first president of a free Czechoslovakia, was cremated here too in 2011 — the building's final, quieter irony.

🥚 Easter Egg: Two regimes, one furnace. Vančura and Horáková were both disposed of here specifically because a public grave would have given their names somewhere to be remembered — the whole point was erasure. Havel's ashes, by grim contrast, went straight from this same building to a marked family vault in nearby Vinohrady Cemetery, in the full glare of a country that could finally say his name out loud. Same address, opposite outcome — which is about as concise a lesson in twentieth-century Czech history as this city has to offer.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Dolní Počernice Chateau',
    slug: 'zamek-dolni-pocernice',
    localizedNames: { cz: 'Zámek Dolní Počernice', zh: '多尔尼波切尔尼采城堡' },
    labels: ['architecture', 'historical', 'nature'],
    coordinates: { lat: 50.08847059482143, lng: 14.579071963760668 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Zámek Dolní Počernice — the chateau Prague forgot to put on postcards. Tucked into a quiet eastern suburb beside a fishpond and an English park, it has spent six centuries quietly changing owners, roofs, and purposes without ever once managing to become famous. Undersell, meet overachieve.

The estate began as a medieval fortress, first recorded in 1401 in an inheritance document for one Jan z Cách — though exactly who built it and when remains genuinely unclear. It passed through Late Gothic and Renaissance rebuilds, reverted briefly to the crown in 1562, and was sold to Matěj Hůlka, a Prague burgher elevated to nobility as "of Počernice" for his trouble. After the Battle of White Mountain in 1620 it was confiscated and resold at a discount, then held by the Counts of Colloredo-Wallsee from 1664 to 1769 — a fairly typical Central European ownership history, meaning: violent, frequent, and mostly about money.

What stands today is a composite: an "old chateau" from around 1780 nearer the church, and a "new chateau" added in the 19th century, joined together and wrapped in a Baroque character that somehow survived every renovation. The formal garden was eventually let loose into a free, English-style park around the Počernický fishpond — landscaping that swapped aristocratic control for public wandering long before that was fashionable.

🥚 Easter Egg: After centuries of counts, confiscations, and crown reversions, the chateau's current occupant has nothing to do with nobility at all — it now houses a children's home. A building built to project the authority of Bohemian aristocracy spent its final chapter, so far, doing something considerably more useful.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: "Křižík's Fountain",
    slug: 'krizikova-fontana',
    localizedNames: { cz: 'Křižíkova fontána', zh: '克列谢克喷泉' },
    labels: ['cultural', 'historical'],
    coordinates: { lat: 50.10747559608483, lng: 14.42926302737521 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Křižíkova fontána — Prague's original son-et-lumière showpiece, dancing and glowing at Výstaviště since 1891. Long before Las Vegas made water-and-light shows a tourist industry, a Czech engineer nicknamed the "Czech Edison" beat them to it by roughly a century.

František Křižík built the fountain for the 1891 Jubilee Exhibition, hiding 26 arc lamps of his own invention beneath a glass floor so that coloured electric light shone directly through the jets — a genuine engineering marvel for its era, powered by steam-driven pumps shifting 250 litres of water per second. Contemporary accounts claimed it outperformed comparable fountains in London and Paris, which, for a fairground attraction in provincial Bohemia, was not a small boast.

The fountain was completely overhauled for the 1991 General Czechoslovak Exhibition and now runs on nearly 3,000 water jets, 49 pumps, and 1,300 lights choreographed to music — a full technological generation beyond Křižík's original, though it keeps his name and his instinct for spectacle intact.

🥚 Easter Egg: 1891 was a remarkably busy year for Křižík — the same Jubilee Exhibition that unveiled his fountain also saw the opening of Prague's first electrified tram line, his own invention as well, running right past what is now Letenský zámeček across the river. One engineer, one exhibition, two pieces of infrastructure that are both still running well over a century later.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'epet ARENA',
    slug: 'epet-arena',
    localizedNames: { cz: 'epet ARENA', zh: 'epet竞技场' },
    labels: ['landmark', 'modern'],
    coordinates: { lat: 50.099849317609504, lng: 14.415966413789576 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to epet ARENA — Sparta Praha's home turf, currently sponsored by whoever paid for the sign this decade. The pitch has stayed put on Letná hill since 1917. The name bolted to the stadium roof has not stayed put for even one of those years.

The first wooden stadium here dates to 1921. The stands were expanded in 1969 to a thunderous 35,880 capacity, then rebuilt entirely in 1994 down to 20,854 seats, and trimmed again to today's 18,887 since 2009 — a stadium that has spent a century getting smaller and considerably more comfortable. It remains Sparta Praha's home ground and regularly hosts the Czech national team, making it one of the country's genuine footballing centres of gravity.

The naming rights, meanwhile, have had a far more eventful run: Toyota Arena (2003–2007), AXA Arena (2007–2009), Generali Arena (2009–2020), Generali Česká pojišťovna Arena (2020–2022), and epet ARENA since November 2022. Sparta supporters have, sensibly, never once adjusted what they actually call it.

🥚 Easter Egg: epet, the sponsor currently attached to Sparta's name, is a Slovak online betting operator — meaning the stadium's identity is now underwritten by an industry built entirely on unpredictable outcomes, which is either extremely fitting or extremely on the nose for a football club.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Letná Chateau',
    slug: 'letensky-zamecek',
    localizedNames: { cz: 'Letenský zámeček', zh: '莱特纳城堡' },
    labels: ['architecture', 'cultural'],
    coordinates: { lat: 50.096180911872, lng: 14.425734118175772 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Letenský zámeček — the "little chateau" that is not really a chateau, but a very good beer garden with the best view of Prague you can get for the price of a pilsner. It has been pouring drinks with that view since 1863.

The neo-Renaissance building was designed by architect Vojtěch Ignác Ullmann in 1863 and has functioned as a restaurant ever since — over 160 years of continuous service, which is longer than most Prague governments have managed to hold together. In 1891, during the Jubilee Exhibition, Prague's first electrified tram line opened just below it, and three years later a carousel with hand-carved wooden horses was installed behind the building for fairgoers.

Today the site splits neatly into three moods: a sprawling open-air biergarten for beer and grilled meat with a panoramic view over the Vltava and the Old Town skyline, the more formal Belcredi room for private functions, and the Ullman brasserie for something closer to an actual sit-down meal.

🥚 Easter Egg: That 1894 carousel is still there, still turning, still carrying children on the same wooden horses that entertained visitors when Prague's first tram was still a novelty two hundred metres away. Order a beer, look downhill, and you're standing in one of the very few corners of the city where three different eras of entertainment technology have coexisted, more or less unbothered, for well over a century.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Letná Water Tower',
    slug: 'vodarenska-vez-letna',
    localizedNames: { cz: 'Vodárenská věž na Letné', zh: '莱特纳水塔' },
    labels: ['historical', 'architecture'],
    coordinates: { lat: 50.10025326907724, lng: 14.419916890219522 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Vodárenská věž — Letná's very own water tower, a pseudo-Romanesque brick giant that spent barely a generation doing its actual job before Prague found something else for it to do. It has been reinventing itself ever since.

Completed in 1888 to a design by Jindřich Fialka and built for the city of Prague by the Hübschmann & Schlaffer construction company, the tower pumped water uphill to serve the upper reaches of Holešovice and Bubeneč. Its career as actual infrastructure was strikingly short: the waterworks were decommissioned in 1913, after just twenty-five years, and the building was converted into flats for the water company's own employees.

Standing 38.3 metres tall and crowned with a pyramidal roof and a small clock tower, it offers a viewing gallery at 20.5 metres, ringed by a neo-Renaissance arcade resting on stone cantilevers. Since 1978 it has served as a base for Prague 7's youth and Pioneer organisations, and a careful 2016–2018 restoration by Petr Hájek Architekti brought the building back into public use.

🥚 Easter Egg: A tower built to move water uphill has now spent nearly six times longer as a youth centre and public landmark than it ever spent as working infrastructure. Prague has a habit of retiring its utilities into second careers — this one just happened to land on "clubhouse with a really good view" rather than "demolished."`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Lilith (David Černý)',
    slug: 'lilith-david-cerny',
    localizedNames: { cz: 'Lilith (David Černý)', zh: '莉莉丝（大卫·切尔尼）' },
    labels: ['cultural', 'monument', 'modern'],
    coordinates: { lat: 50.09701996412785, lng: 14.461879164325273 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Lilith — the 24-metre stainless-steel woman David Černý bolted to the side of an apartment block in 2022, because a normal balcony apparently wasn't dramatic enough. She has been quietly hugging the building, and unsettling the neighbours, ever since.

Forged from mirror-polished stainless steel and weighing 35 tonnes, Lilith wraps herself around the exterior wall of a modern residential building that is part of the Fragment development — 140 apartments given an entirely unasked-for landmark. She takes her name from Jewish mythology's Lilith, cast in some traditions as Adam's first wife and in others as a demon, a figure Černý reclaims here as an emblem of independence rather than menace.

This is standard operating procedure for Černý, whose permanent Prague works already include a giant rotating Kafka head, crawling black babies on the Žižkov TV Tower, and a Trabant on legs — a body of work built entirely on the premise that public art should occasionally make people flinch.

🥚 Easter Egg: Lilith is not actually static. Her head slowly rotates a full 180 degrees on a hidden motorised mechanism, so if you linger near the metro exit long enough, you can watch her turn to look directly at you — which is either the city's best piece of interactive art or its most effective way of making commuters walk faster.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Lyčkovo Square (Intelligence Statue)',
    slug: 'lyckovo-namesti-inteligence',
    localizedNames: { cz: 'Lyčkovo náměstí (Socha Inteligence)', zh: '利奇科夫广场（智慧雕像）' },
    labels: ['monument', 'historical', 'cultural'],
    coordinates: { lat: 50.093729257186624, lng: 14.458052431154787 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Lyčkovo náměstí — a modest Karlín square that has changed its name four times and its centrepiece statue not once. Through empire, occupation, and communism, a bronze woman has stood here quietly holding a book, apparently above all the fuss.

The sculpture, titled simply Inteligence, was created in 1910 by Josef Mařatka (1874–1937), a leading Czech sculptor of his generation. It depicts intelligence as an allegorical young woman in contrapposto, head gently tilted, robes flowing, a book held in her left hand — restrained, classical, entirely untroubled by the century of chaos about to unfold around her.

The square itself has had a rougher time of it than its statue: originally named Rieglovo náměstí, renamed Erbenovo during the wartime occupation, restored to Rieglovo afterward, and finally renamed Lyčkovo náměstí in 1948 in honour of Dr. Břetislav Lyčka, a physician remembered for his assistance during the Second World War.

🥚 Easter Egg: Four names, three regimes, one statue that never had to update her paperwork. While the square around her was being renamed by whoever currently held power in Prague, Inteligence simply kept holding her book — a fairly on-the-nose piece of civic irony for a sculpture literally named after the value of quietly outlasting nonsense.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Museum of Literature',
    slug: 'muzeum-literatury',
    localizedNames: { cz: 'Muzeum literatury – Památník národního písemnictví', zh: '文学博物馆——国家文学纪念馆' },
    labels: ['museum', 'cultural', 'historical'],
    coordinates: { lat: 50.1022543150346, lng: 14.407830571336783 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Museum of Literature — home of the Památník národního písemnictví, an institution that spent seventy years locked inside a monastery before finally moving into a confiscated banker's villa. Even Czech literature, it turns out, needed a very long and complicated plot before reaching its happy ending.

The institution was founded in 1952 after the Communist state seized Strahov Monastery and its library, folding in collections from other dissolved monasteries to build a state archive of Czech literary heritage. For nearly seventy years it operated out of Strahovské nádvoří, until the monastery was returned to the Premonstratensian order after 1989 and the collection was pushed into rented storage outside the city — a fairly undignified fate for the nation's literary memory.

In 2022 it finally found a proper home: the third Petschkova vila in Bubeneč, an eclectic 1929–1930 villa built by architect Max Spielmann for Marianne Gellertová of the wealthy Petschek banking family. The Petscheks were forced to flee to England in 1938 as the Nazi occupation closed in, and their property was confiscated. The Chinese Embassy later used the building, before it sat empty and disputed for over a decade. A full 2017–2021 restoration finally turned it into what it is today: nearly 1,000 square metres of literary exhibition space.

🥚 Easter Egg: The building's occupants form an almost absurd historical relay — a persecuted Jewish banking family, a communist-era foreign embassy, years of bureaucratic limbo, and finally a museum dedicated to preserving the written word. If the villa's walls could talk, they would need an entire library just to get through the twentieth century.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Old Wastewater Treatment Plant (Bubeneč)',
    slug: 'stara-cistirna-odpadnich-vod',
    localizedNames: { cz: 'Stará čistírna odpadních vod v Bubenči', zh: '布本涅奇老污水处理厂' },
    labels: ['historical', 'architecture'],
    coordinates: { lat: 50.110125527069584, lng: 14.402159418986486 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Stará čistírna odpadních vod — Prague's beautifully preserved 1906 sewage plant, proof that even wastewater infrastructure can end up on a heritage list if you wait around in mint condition for over a century. Yes, this is a real tourist attraction. Yes, it is about sewage.

Built between 1901 and 1906 as the final piece of Prague's first systematic sewer network, the plant was engineered by the British sanitation expert Sir William Heerlein Lindley, a man who spent his career making European cities considerably less disease-ridden. Steam engines, brick vaulted chambers, and settling tanks were all built to a standard so solid that the plant kept treating the city's waste continuously until 1967, when a modern facility on Císařský ostrov finally took over.

Because almost nothing was demolished or modernised afterward, the site survives as a nearly complete snapshot of turn-of-the-century sanitary engineering — steam-powered pumping halls and Victorian ironwork intact. It has been a national cultural monument since 2010, an anchor point of the European Route of Industrial Heritage since 2016, and is currently on Czechia's UNESCO tentative list.

🥚 Easter Egg: Sir William Lindley's family business of untangling European cities' sewage was practically hereditary — his father and sons all worked as sanitary engineers across the continent, quietly saving more lives through drainage than most generals ever did through battle. Prague's clean water and reduced cholera rates in the early twentieth century owe rather a lot to a family most visitors have never heard of.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Academy of Fine Arts in Prague',
    slug: 'akademie-vytvarnych-umeni',
    localizedNames: { cz: 'Akademie výtvarných umění v Praze', zh: '布拉格美术学院' },
    labels: ['academy', 'architecture', 'cultural'],
    coordinates: { lat: 50.10269066434499, lng: 14.424561293270557 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Akademie výtvarných umění — the oldest art school in the country, founded in 1799 by imperial decree so that Czech students from Bohemia, Moravia, and Silesia no longer had to travel to Vienna or Munich just to learn how to properly hold a paintbrush.

Founded by decree of Emperor Francis I on the initiative of the Society of Patriotic Friends of Art, the Academy began teaching in 1800 under its first director, the German engraver Joseph Bergler. It was nationalised in 1896 and formally recognised in 1922 as the country's first state institution of higher art education — a two-century journey from provincial workaround to the top of the Czech art establishment.

The building you see today, in Bubeneč overlooking Stromovka park, was designed by architect Václav Roštlapil and built between 1898 and 1903 in a High Baroque volumetric style layered with Renaissance detail and early Art Nouveau flourishes. Its north-facing studios were deliberately glazed to catch the steady, even daylight painters actually want, rather than the dramatic light everyone else in Prague was busy building towards.

🥚 Easter Egg: The Academy's neighbour on this stretch of Bubeneč riverbank is the small Church of St. Gothard — meaning generations of Czech art students have trained their eye for form and shadow within sight of a parish church whose own history includes being burned down by Hussite soldiers in 1420. Inspiration, it turns out, sits right next door to destruction.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Church of St. Gothard',
    slug: 'kostel-svateho-gotharda',
    localizedNames: { cz: 'Kostel svatého Gotharda', zh: '圣哥达教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.102695530385795, lng: 14.424576466136562 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Kostel svatého Gotharda — a small Bubeneč parish church with a genuinely eventful past, given that its medieval predecessor was burned to the ground by revolutionary soldiers and the parish itself was abolished for over 350 years before anyone got around to fixing it.

Devotion to St. Gothard, an 11th-century Bavarian abbot, arrived in Bohemia with Benedictine monks from Niederaltaich who helped found nearby Břevnov Monastery. A medieval church stood here until May 1420, when Jan Žižka's Hussite forces defeated Royalist troops nearby and, in the chaos of that victory, burned and plundered the church along with most of the surrounding settlement. The parish was formally abolished in 1421 and the building sat ruined for over three and a half centuries.

The parish was finally revived in 1786, and the current Classicist building on Baroque foundations went up between 1800 and 1801, consecrated that October by Prague's auxiliary bishop. Unstable ground forced repairs and modifications within a decade of construction, and the tower didn't get its clock faces until 1870, paid for by prominent builder Vojtěch Lanna the Younger. The interior sculpture came from the workshop of Ignác Michael Platzer, one of Bohemia's leading Baroque sculptors.

🥚 Easter Egg: A parish abolished in 1421 and not revived until 1786 spent longer in administrative limbo — 365 years — than the entire history of the United States. Prague's patience with unfinished business is, by any reasonable standard, extraordinary.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Ministry of Education, Youth and Sports',
    slug: 'ministerstvo-skolstvi',
    localizedNames: { cz: 'Ministerstvo školství, mládeže a tělovýchovy', zh: '捷克教育、青年和体育部' },
    labels: ['historical', 'architecture', 'palace'],
    coordinates: { lat: 50.08525281159678, lng: 14.404166318117742 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Ministry of Education, Youth and Sports — a stately Malá Strana palace that has quietly hosted actors, aristocrats, and bureaucrats in roughly that order, proving that Czech culture and Czech civil service have always shared surprisingly good real estate.

The site originally held three separate houses, built around 1571 by the architect and stonemason Bonifác Wohlmut. One of them operated as a theatre hall between 1700 and 1713, staging German-language opera in a Malá Strana still very much under Habsburg cultural influence. By the 1790s the houses belonged to the Czernín family, who had them joined into a single palace in a 1796 reconstruction led by architect Josef Zobel.

The palace's transformation into a government ministry came much later, once the modern Czechoslovak and then Czech state needed dignified premises for its education administration — the current Ministry of Education, Youth and Sports was established in 1969 and has occupied the building as its national headquarters ever since, turning a onetime opera house into the office that decides what the country's schoolchildren study.

🥚 Easter Egg: A building that once staged imported German opera for the aristocracy now spends its days approving Czech school curricula — meaning the loudest performances in this palace shifted, over three centuries, from arias to budget meetings. Whether that counts as progress is left as an exercise for the visiting adventurer.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Modřany Vineyard',
    slug: 'modranska-vinice',
    localizedNames: { cz: 'Modřanská vinice', zh: '摩德拉尼葡萄园' },
    labels: ['nature', 'historical', 'restaurants-and-cafes'],
    coordinates: { lat: 50.011415374482446, lng: 14.404002425560801 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Modřanská vinice — Prague's southernmost vineyard, a patch of hillside that has been growing grapes, on and off, since a medieval prince donated it to the church in 1178. Modern viticulture, it turns out, is just very old viticulture that occasionally took a nap.

Prince Soběslav II gifted the vineyard to the Vyšehrad Chapter in 1178, beginning an ownership history split between church and crown for centuries. In 1715 it was formally named the Archbishop's Vineyard after passing to the Prague Archbishopric, which replanted and expanded it to roughly two hectares in the early 19th century. Its luck ran out in the 1920s: the vineyard was sold off, fell into neglect, and froze solid in the brutal winter of 1929, effectively ending centuries of continuous cultivation.

It stayed dormant for nearly six decades until 1987, when members of the Czech Gardening Association revived it plot by plot — a genuinely grassroots restoration rather than a state or church project this time. Today it's a patchwork of individually tended parcels growing traditional varieties like Riesling, Pinot Noir, Traminer, and Blue Portugal, alongside an orchard and a restored vineyard house with its own restaurant and barn.

🥚 Easter Egg: A vineyard founded by a 12th-century prince and revived by 20th-century garden-club hobbyists has effectively swapped one kind of nobility for another — the aristocracy of people willing to argue passionately about pruning technique. Eight centuries later, that turns out to be the more durable kind.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Strahov Dormitories',
    slug: 'koleje-strahov',
    localizedNames: { cz: 'Koleje Strahov (ČVUT)', zh: '斯特拉霍夫学生宿舍（布拉格技术大学）' },
    labels: ['historical', 'modern', 'landmark'],
    coordinates: { lat: 50.080456283350465, lng: 14.393471080040232 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Koleje Strahov — a vast concrete hillside of student dormitories that looks, from a distance, like a small Brutalist city-state. Thousands of Czech Technical University students have called this home. In 1967, a few thousand of them got very, very angry about the lights going out.

Built from the 1950s onward on the hill above Strahov Monastery, this is one of the largest student dormitory complexes in Europe — a sprawling grid of housing blocks designed to warehouse the growing ranks of Czechoslovakia's technical university students. It remains a working ČVUT dormitory today, largely unchanged in spirit: cramped rooms, long corridors, and generations of engineering students pulling all-nighters within the same grey concrete walls.

On the night of 31 October 1967, one of Strahov's recurring electricity blackouts finally tipped students over the edge. Around 1,500 of them marched out of the dormitories toward the government seat in Malá Strana, chanting "We want light!" and "We want to study!" Riot police met them with tear gas and batons, reportedly sneering "here's your light" as they struck. It was meant to be a minor housing complaint. It did not stay that way.

🥚 Easter Egg: The brutal police crackdown on this small student protest backfired spectacularly. Public outrage over Strahov helped force out hardline leader Antonín Novotný, clearing the way for Alexander Dubček's reformist rise and the Prague Spring of 1968. A blown fuse in a student dormitory helped set in motion one of the defining events of the Cold War — which is either a remarkable coincidence or proof that revolutions really can start with something as small as a light switch.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'House of the Black Madonna',
    slug: 'dum-u-cerne-matky-bozi',
    localizedNames: { cz: 'Dům U Černé Matky Boží', zh: '黑圣母之屋' },
    labels: ['museum', 'architecture', 'cultural'],
    coordinates: { lat: 50.086990387115286, lng: 14.425406917197128 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Dům U Černé Matky Boží — the House of the Black Madonna, proof that Cubism, an art movement mostly known for confusing paintings, briefly and gloriously escaped the canvas to build an entire functioning office block, complete with its own café.

Architect Josef Gočár designed the building in 1911 at just thirty-one years old, for wholesale merchant František Josef Herbst, and completed it the following year as the first true work of Cubist architecture in Prague. A reinforced-concrete skeleton, borrowed from the Chicago School of engineering, let Gočár skip load-bearing walls entirely and cover the exterior in the angular, fractured geometry Cubist painters had, until then, kept safely on canvas. The building takes its name from a small Baroque statue of a black Madonna salvaged from an earlier structure on the same corner.

The ground floor originally housed the Grand Café Orient — the only Cubist café ever built, with Cubist chairs, Cubist chandeliers, and a Cubist view over Celetná street. It lasted about a decade before closing in the 1920s, apparently because customers found the aggressively geometric furniture more interesting to look at than to sit in. The upper floors today house the Museum of Czech Cubism, the only style of architecture the Czech lands can genuinely claim to have made distinctly their own.

🥚 Easter Egg: Grand Café Orient sat empty and forgotten for over eighty years before a meticulous restoration reopened it in the 2000s, angular chandeliers and all. You can still order a coffee there today, which makes it one of the very few places on earth where you can experience an entire early-twentieth-century art movement through the shape of your own chair.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Josef Sudek Gallery',
    slug: 'galerie-josefa-sudka',
    localizedNames: { cz: 'Galerie Josefa Sudka', zh: '约瑟夫·苏德克画廊' },
    labels: ['museum', 'cultural', 'hidden-gem'],
    coordinates: { lat: 50.08829615085762, lng: 14.394736286187927 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Josef Sudek Gallery — a tiny 61-square-metre wooden garden studio that has spent over a century quietly proving you don't need a big building to produce great art, just excellent light and one fairly stubborn one-armed photographer.

The studio itself predates its most famous tenant: this small glass-roofed garden pavilion was moved to Újezd from Královské Vinohrady in 1901, making it the last surviving nineteenth-century garden photo studio in Prague. Josef Sudek — who lost his right arm in the First World War and rebuilt his entire life around photography instead — began working here in 1927, eventually moving in to live alongside his sister and studio assistant, Božena Sudková.

From this single room, Sudek produced some of the most quietly obsessive photographic series in Czech art history: The Window of My Studio, A Walk in My Garden, The Garden of My Studio, and Still Life on the Window of My Studio — decades spent photographing, essentially, the same window and the same small garden, over and over, until both became genuinely profound. The original studio burned down in 1985; the faithful replica standing today was rebuilt in 2000 and now runs as a contemporary photography gallery.

🥚 Easter Egg: Sudek moved out of this studio in 1959 to a flat on Úvoz street — a five-minute walk from Rothmayerova vila, the home of his close friend, architect Otto Rothmayer, where Sudek was a frequent guest. A photographer who spent thirty years fixated on the same square metre of garden clearly still valued having somewhere interesting to walk to.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Ctěnice Chateau',
    slug: 'zamecky-areal-ctenice',
    localizedNames: { cz: 'Zámecký areál Ctěnice', zh: '采特尼采城堡区' },
    labels: ['architecture', 'historical', 'museum'],
    coordinates: { lat: 50.1487150028989, lng: 14.563281599382933 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Zámecký areál Ctěnice — a genuine medieval fortress turned Renaissance manor turned Classicist chateau, sitting so far out in Prague's northeastern suburbs that most residents of the city centre have never once heard of it, let alone visited.

First recorded in 1372, when a Prague burgher named Jan Cajzlmajstr bought the existing Gothic fortress, Ctěnice spent the 16th century in the hands of the Hrzán family of Harasov, who rebuilt it in Renaissance style. An 18th-century classicist reconstruction gave the chateau essentially the appearance it still has today — modest, symmetrical, and entirely unbothered by the grander architectural ambitions of Prague's city-centre palaces.

The City of Prague took ownership of the whole estate — chateau, outbuildings, and park — in 1993, and spent over seven years on a thorough renovation before handing it to the Prague City Museum in 2012. It now hosts a permanent exhibition tracing Ctěnice's own eight-hundred-year history, alongside temporary shows and family programming, in a genuinely peaceful corner of the city that most tourist itineraries never come close to reaching.

🥚 Easter Egg: Ctěnice has survived over 650 years of Bohemian history — plague, war, confiscation, nationalisation — mostly by being just obscure enough that nobody bothered fighting very hard over it. Sometimes the safest way for a building to last eight centuries is to stay quietly uninteresting to whoever currently holds power.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Podskalí Customs House at Výtoň',
    slug: 'podskalska-celnice-na-vytoni',
    localizedNames: { cz: 'Podskalská celnice Na Výtoni', zh: '维托尼关税站' },
    labels: ['museum', 'historical', 'hidden-gem'],
    coordinates: { lat: 50.0678540469226, lng: 14.415367802235844 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Podskalská celnice Na Výtoni — the last building left standing from an entire riverside neighbourhood that Prague simply demolished, and the only place in the city where you can learn how much tax got charged on a raft full of logs.

Podskalí — "below the rocks" — was a riverside settlement first recorded in 1199, home for centuries to the Vltava's timber rafters and boatmen, who held an exclusive royal right to the wood trade granted by John of Bohemia in the 14th century. This 16th-century building served simultaneously as an inn, a hostel for the rafters, and a customs post — collecting duty on the log rafts by literally cutting out a portion of the timber as payment before it entered the city.

The rafting trade peaked in the second half of the 19th century, then declined sharply through the 1930s as dams reshaped the river; the very last raft floated down the Vltava in 1960, just ahead of the Orlík dam's completion. Podskalí itself did not survive to see it: the entire neighbourhood was demolished between 1905 and 1914 to build the Vyšehrad tunnel and embankment. This customs house is the sole survivor, now run as a small museum on the vanished settlement and its rafters, maintained partly through the Vltavan association founded by former rafters back in 1871.

🥚 Easter Egg: An entire neighbourhood — houses, taverns, timber yards, generations of families — was flattened for a road tunnel, and the only thing Prague kept was the tax office. There may be no more honest metaphor for urban planning anywhere in the city.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Villa Müller',
    slug: 'mullerova-vila',
    localizedNames: { cz: 'Müllerova vila', zh: '穆勒别墅' },
    labels: ['villa', 'architecture', 'modern'],
    coordinates: { lat: 50.09255283407858, lng: 14.378454204965962 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Müllerova vila — a plain white cube from the outside and an architectural labyrinth on the inside, built by a man whose entire philosophy could be summarized as: floor plans are for people with no imagination.

Adolf Loos designed the villa in 1930 for construction magnate František Müller, and used it to build the definitive example of his Raumplan concept — a house organised not as flat stacked floors but as a continuous sequence of interlocking rooms set at different heights, each level pitched exactly to the importance and function of the room it holds. Loos infamously refused to draw conventional facades or floor plans at all, insisting he designed in "spaces," not blueprints — an approach that makes the Villa Müller notoriously difficult to draw and genuinely disorienting to walk through for the first time.

The severe cubic white exterior, in line with Loos's 1908 essay "Ornament and Crime," hides an interior soaked in exactly the marble, dark wood, and silk luxury the exterior seems to renounce — a contradiction Loos considered entirely intentional. The Müllers lived here for eighteen years before the Communist regime seized the house in 1948; by 1968 its most significant furnishings had been sold off to Prague's museums, and the building spent decades as a state-owned oddity before a 1998 restoration and its reopening as a museum in 2000.

🥚 Easter Egg: Loos's insistence on designing "spaces, not floor plans" turned out to be a genuine practical headache — the villa is famously difficult for visitors to mentally map, since a room can sit half a level above one neighbour and half a level below another, all reached via the same central staircase. Even architecture students touring the building today routinely lose track of which floor they're technically standing on.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Villa Rothmayer',
    slug: 'rothmayerova-vila',
    localizedNames: { cz: 'Rothmayerova vila', zh: '罗特迈耶别墅' },
    labels: ['villa', 'architecture', 'hidden-gem'],
    coordinates: { lat: 50.09124147152592, lng: 14.364264580638425 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Rothmayerova vila — the Mediterranean-flavoured hideaway an architect built for himself once he got tired of designing extravagant details for other people's castles, namely the one on the hill just up the road.

Otto Rothmayer spent his career as the closest collaborator of Josip Plečnik, the visionary Slovene architect responsible for reshaping much of Prague Castle in the interwar years — designing staircases, gates, and ornamental details under Plečnik's direction. In 1928–1929, Rothmayer built this villa for himself and his wife, textile artist Božena Rothmayerová, in Střešovice, working in a classicising modernist style that borrowed directly from the sun-washed Mediterranean sensibility Plečnik had brought to Bohemia.

The house quickly became an informal gathering point for Prague's interwar and postwar creative circle — photographer Josef Sudek, sculptors Bedřich Stefan and Hana Wichterlová, and glassmaker René Roubíček were all regular guests, turning Rothmayer's private home into an unofficial salon for Czech modernism. Protected as a cultural monument since 2010, it opened to the public in 2015 as a Prague City Museum branch, its garden now free to wander even outside gallery hours.

🥚 Easter Egg: The man who spent his professional life adding whimsical, almost fairy-tale details to Prague Castle's austere stonework — the Bull Staircase, ornamental gates, obelisks — went home every evening to a considerably smaller and stranger house of his own design. Even architects who spend their days working for kings apparently still want a weird little place that's entirely theirs.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Ministry of Industry and Trade',
    slug: 'ministerstvo-prumyslu-a-obchodu',
    localizedNames: { cz: 'Ministerstvo průmyslu a obchodu České republiky', zh: '捷克工业与贸易部' },
    labels: ['landmark', 'architecture', 'historical'],
    coordinates: { lat: 50.092791340514765, lng: 14.42585518643129 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Ministerstvo průmyslu a obchodu — a ministry building so ostentatiously decorated with 120 sculptures that you'd be forgiven for mistaking Czech bureaucracy for a Baroque cathedral. Somewhere in here, actual paperwork about industry and trade genuinely gets processed, apparently while surrounded by stone giants representing Industry and Navigation.

Architect Josef Fanta — the same man behind Prague's main railway station — designed this riverside colossus in the late 1920s, and construction ran from 1928 to 1934, considerably over its original three-year schedule. The building runs 107 by 49 metres along the Vltava embankment between Štefánik Bridge and the Convent of St. Agnes, faced in granite and sandstone, with a glazed dome rising above a balustrade attic lined with over-life-sized figures personifying Industry, Trade, Crafts, and Navigation.

Fourteen different artists contributed to the building's decoration, filling it with roughly 120 sculptures, extensive sgraffito, wrought-iron grilles, and ornamental detailing — sculptors Josef Paukert and Čeněk Vosmík among the most prominent names involved. The result is one of interwar Czechoslovakia's most lavishly decorated functional government buildings, now protected as a cultural monument. The Ministry of Industry and Trade has called it home since 1993.

🥚 Easter Egg: Josef Fanta apparently believed a government ministry should look at least as impressive as a train station — reasonable, since he designed Prague's Hlavní nádraží too. Between the two buildings, Fanta is responsible for a fair share of the monumental Art Nouveau and neo-Baroque flourish visible along the Vltava, proving that one architect's aesthetic can quietly shape how an entire city greets both its trains and its trade regulations.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Fourteen Hearts Memorial',
    slug: 'pamatnik-ctrnact-srdci',
    localizedNames: { cz: 'Památník Čtrnáct srdcí', zh: '十四颗心纪念碑' },
    labels: ['monument', 'historical', 'square'],
    coordinates: { lat: 50.08899476745673, lng: 14.415486338282555 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Welcome to the memorial on Jan Palach Square (Náměstí Jana Palacha), raised in memory of the fourteen students and staff of Charles University's Faculty of Arts who lost their lives on 21 December 2023 — a wound the university, and the city, are still learning to carry.

On the afternoon of 21 December 2023, a 24-year-old student opened fire inside the Faculty of Arts' main building, a short walk from this square. Thirteen people were killed on the spot and a fourteenth victim died after falling while trying to escape; twenty-five others were wounded before the attacker was killed in an exchange with police. It remains the deadliest mass shooting in the country's modern history.

The memorial itself is a deliberately unpolished, roughly hewn sandstone monolith, nearly three metres tall and weighing about eight tonnes, designed by sculptor Vojtěch Adamec Jr. and set in place by architect Vojtěch Králíček. It was unveiled on 20 June 2024, six months after the attack. In September 2025, a plaque bearing the names of all fourteen victims was added beside it, so that anyone passing through the square would know exactly whom the stone remembers.

The gunman's motive has never been fully explained. What remains is this stone, the fourteen names beside it, and a square that Prague now shares between two histories — Jan Palach's protest against occupation in 1969, and, more than half a century later, another loss the city did not choose.`,
      cz: '',
      zh: '',
    },
  },
  {
    name: 'Convent of St. Agnes of Bohemia',
    slug: 'klaster-sv-anezky-ceske',
    localizedNames: { cz: 'Klášter sv. Anežky České', zh: '圣阿格尼丝修道院' },
    labels: ['museum', 'monastery', 'historical'],
    coordinates: { lat: 50.0920770404173, lng: 14.424059134352138 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Convent of St. Agnes of Bohemia (Klášter sv. Anežky České) — Prague's oldest Gothic building, founded by a princess who turned down at least two kings and an emperor to become a nun instead. If ambition were measured in declined marriage proposals, Agnes would be historically undefeated.

Agnes of Bohemia (1211–1282) was the daughter of King Přemysl Otakar I, and by the standards of thirteenth-century royal matchmaking, extraordinarily eligible — proposed matches reportedly included the future Holy Roman Emperor Frederick II himself. She turned all of it down, chose the veil instead, and in 1231 founded this convent for the Poor Clares (the female order tied to St. Francis of Assisi), built in the then-radical Gothic style newly imported from France. It became the burial place of the Přemyslid dynasty and one of the most important religious institutions in Bohemia.

After Emperor Joseph II dissolved the convent in 1782 as part of his sweeping monastic reforms, the complex slid into disrepair, was used as workshops and slums, and was very nearly demolished outright in the 19th century — saved only by an active preservation campaign. A slow, careful restoration eventually returned it to something like dignity, and today it houses the National Gallery's collection of medieval and early Renaissance art from Bohemia and Central Europe.

🥚 Easter Egg: Agnes spent nearly seven centuries as merely "blessed," not a full saint, until Pope John Paul II finally canonized her in Rome on 12 November 1989 — exactly one week before the Velvet Revolution began. Czechs half-jokingly credit her sainthood with the fall of communism, citing an old prophecy that Bohemia would only find peace once Agnes was canonized. Coincidence, providence, or extremely good timing — you decide.`,

      cz: `Statečný dobrodruhu, vítej v Klášteře sv. Anežky České — nejstarší gotické stavbě v Praze, kterou založila princezna, jež odmítla nejméně dva krále a jednoho císaře, aby se místo toho stala jeptiškou. Pokud se ambice měří počtem odmítnutých nabídek k sňatku, je Anežka historicky neporažená.

Anežka Česká (1211–1282) byla dcerou krále Přemysla Otakara I. a podle měřítek dvorských sňatků třináctého století mimořádně žádanou nevěstou — mezi navrhovanými partiemi se prý objevil i budoucí římský císař Fridrich II. Všechny nabídky odmítla, zvolila si roli řeholnice a v roce 1231 založila tento klášter pro klarisky (ženský řád spojený se sv. Františkem z Assisi), postavený v tehdy revolučním gotickém slohu nově přejatém z Francie. Klášter se stal pohřebištěm přemyslovské dynastie a jednou z nejvýznamnějších náboženských institucí v Čechách.

Poté, co císař Josef II. klášter v roce 1782 zrušil v rámci svých rozsáhlých církevních reforem, budova postupně chátrala, sloužila jako dílny a chudinské byty a v 19. století jí dokonce hrozila úplná demolice — zachránila ji až aktivní kampaň za záchranu památek. Pomalá a pečlivá obnova jí nakonec vrátila důstojnost a dnes v ní sídlí sbírka středověkého a raně renesančního umění Čech a střední Evropy patřící Národní galerii.

🥚 Velikonoční vajíčko: Anežka zůstala téměř sedm set let pouze „blahoslavenou", nikoli plnohodnotnou svatou, dokud ji papež Jan Pavel II. 12. listopadu 1989 v Římě konečně nesvatořečil — přesně týden před začátkem sametové revoluce. Češi si napůl žertem připisují její svatořečení jako spouštěč pádu komunismu, s odkazem na staré proroctví, že Čechy najdou mír až po Anežčině svatořečení. Náhoda, prozřetelnost, nebo mimořádně dobré načasování — posuďte sami.`,

      zh: `勇敢的冒险家，欢迎来到圣阿格尼丝修道院（Klášter sv. Anežky České）——布拉格最古老的哥特式建筑，由一位公主创建，她拒绝了至少两位国王和一位皇帝的求婚，转而选择出家为修女。如果雄心壮志能用拒绝的求婚数量来衡量，阿格尼丝在历史上堪称无人能敌。

波希米亚的阿格尼丝（Anežka Česká，1211–1282）是波希米亚国王普热美斯·奥托卡一世之女，按十三世纪王室联姻的标准，她是极受追捧的新娘人选——据说提亲名单上甚至包括未来的神圣罗马帝国皇帝腓特烈二世。她一一拒绝了所有提亲，选择成为修女，并于1231年创立了这座修道院，供奉方济各会创始人圣方济各所创立的女修会——贫穷佳兰会。修道院采用了当时从法国新引入、尚属激进的哥特式风格建造，后来成为普热美斯王朝的墓葬地和波希米亚最重要的宗教机构之一。

1782年，约瑟夫二世皇帝在其大规模修道院改革中解散了这座修道院，此后建筑逐渐荒废，先后被用作作坊和贫民住所，19世纪时甚至差点被彻底拆除——多亏了一场积极的文物保护运动才得以幸存。经过漫长而细致的修复，它终于重获尊严，如今收藏着国家美术馆的波希米亚及中欧中世纪与文艺复兴早期艺术藏品。

🥚 彩蛋：阿格尼丝在近七百年间只被称为「真福者」，而非正式的圣徒，直到1989年11月12日，教皇若望·保禄二世才终于在罗马为她封圣——恰好是天鹅绒革命爆发前的一周。捷克人半开玩笑地把共产主义的垮台归功于她的封圣，引用一则古老预言：波希米亚只有在阿格尼丝封圣之后才能迎来和平。是巧合、天意，还是极其精准的时机——你来判断。`,
    },
  },
  {
    name: 'Wallenstein Riding School',
    slug: 'valdstejnska-jizdarna',
    localizedNames: { cz: 'Valdštejnská jízdárna', zh: '华伦斯坦骑术学校' },
    labels: ['museum', 'architecture', 'historical'],
    coordinates: { lat: 50.091209005900986, lng: 14.408739638423173 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Wallenstein Riding School (Valdštejnská jízdárna) — a Baroque horse gym built by a general so wildly ambitious he flattened twenty-three houses, three gardens, and a brickworks just to build himself a palace next door. The horses, presumably, appreciated the real estate more than the neighbours did.

The riding school is part of the vast Wallenstein Palace complex, commissioned in the 1620s by Albrecht von Wallenstein (Valdštejn), a Bohemian nobleman and mercenary general who became fabulously wealthy commanding armies during the Thirty Years' War. Not content with a modest townhouse, he demolished an entire neighbourhood of Malá Strana — dozens of buildings — to build a palace grand enough to rival Prague Castle itself, complete with formal gardens, an aviary, a grotto wall, and this dedicated riding hall for his prized horses.

Wallenstein's ambition eventually outpaced Emperor Ferdinand II's patience: suspected of secretly negotiating with the enemy to carve out his own kingdom, Wallenstein was assassinated by his own officers in 1634 on imperial orders, before he ever fully enjoyed his palace. The riding hall long outlived the drama — today it serves as an exhibition space for the National Gallery, hosting rotating shows of contemporary and historical art under its handsome vaulted ceiling.

🥚 Easter Egg: Wallenstein was famously superstitious and consulted astrologers, including Johannes Kepler, before major decisions. Some historians argue his fatal overconfidence came partly from having his horoscope read a little too favourably. Moral of the story: even the most powerful general in Central Europe should probably get a second opinion before picking a fight with an emperor.`,

      cz: `Statečný dobrodruhu, vítej ve Valdštejnské jízdárně — barokní jízdárně, kterou nechal postavit generál s tak nespoutanými ambicemi, že kvůli vlastnímu paláci srovnal se zemí třiadvacet domů, tři zahrady a cihelnu. Koně si tu nemovitost pravděpodobně užívali víc než sousedé.

Jízdárna je součástí rozlehlého komplexu Valdštejnského paláce, který si ve 20. letech 17. století nechal postavit Albrecht z Valdštejna — český šlechtic a žoldnéřský generál, jenž během třicetileté války zbohatl velením armádám. Nespokojil se se skromným městským domem a zbořil celou čtvrť Malé Strany — desítky budov — aby vybudoval palác dostatečně velkolepý na to, aby konkuroval samotnému Pražskému hradu, včetně formálních zahrad, voliéry, umělé krápníkové stěny a této jízdárny určené jeho oblíbeným koním.

Valdštejnovy ambice nakonec předčily trpělivost císaře Ferdinanda II.: podezřelý z tajných jednání s nepřítelem o vytvoření vlastního království byl v roce 1634 na císařův rozkaz zavražděn vlastními důstojníky, aniž by si svého paláce plně užil. Jízdárna dramata svého zakladatele dávno přežila — dnes slouží jako výstavní prostor Národní galerie a pod svým impozantním klenutým stropem hostí střídající se výstavy současného i historického umění.

🥚 Velikonoční vajíčko: Valdštejn byl notoricky pověrčivý a před důležitými rozhodnutími se radil s astrology, mimo jiné i s Johannesem Keplerem. Někteří historici tvrdí, že jeho osudová sebejistota částečně pramenila z až příliš příznivě vyloženého horoskopu. Ponaučení z příběhu: i nejmocnější generál střední Evropy by si měl před rozmíškou s císařem raději vyžádat druhý názor.`,

      zh: `勇敢的冒险家，欢迎来到华伦斯坦骑术学校（Valdštejnská jízdárna）——一座巴洛克式马术馆，由一位野心勃勃到为了给自己建宫殿，不惜夷平二十三栋房屋、三座花园和一座砖厂的将军所建。想必比起邻居，马匹更享受这片新地产。

这座骑术学校是庞大的华伦斯坦宫殿建筑群的一部分，由波希米亚贵族兼雇佣军将领阿尔布雷希特·冯·华伦斯坦（Valdštejn）于1620年代下令建造——他在三十年战争期间靠统领军队积累了惊人的财富。他并不满足于一座朴素的宅邸，而是拆除了整个小城区（Malá Strana）的数十栋建筑，只为建造一座足以与布拉格城堡本身媲美的宏伟宫殿，附带正式花园、鸟舍、人工钟乳石墙，以及这座专为他心爱的马匹而建的骑术馆。

华伦斯坦的野心最终超出了皇帝斐迪南二世的容忍限度：他被怀疑暗中与敌方谈判、图谋自立为王，于1634年在皇帝的命令下被自己的军官刺杀，还没来得及真正享受这座宫殿。骑术馆却远远地熬过了这场戏剧性事件——如今它是国家美术馆的展览空间，在其气派的拱顶天花板下，轮番举办当代与历史艺术展览。

🥚 彩蛋：华伦斯坦是出了名的迷信，在做重大决定前总要请教占星师，其中就包括约翰内斯·开普勒。一些历史学家认为，他那致命的过度自信，部分正是源自一份过于乐观的占星预测。这个故事的教训是：即便是中欧最有权势的将军，在与皇帝翻脸之前，或许也该多听听第二意见。`,
    },
  },
  {
    name: 'Mánes Gallery',
    slug: 'galerie-manes',
    localizedNames: { cz: 'Galerie Mánes', zh: '马奈斯画廊' },
    labels: ['museum', 'cultural', 'architecture'],
    coordinates: { lat: 50.07750471148303, lng: 14.414115512853042 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Mánes Gallery (Galerie Mánes) — a functionalist glass box perched improbably on stilts over the Vltava River, wrapped affectionately around a five-hundred-year-old water tower like a very modern hug. Prague's early twentieth-century architects, it turns out, were not shy about mixing centuries.

Built between 1927 and 1930 by architect Otakar Novotný for the Mánes Union of Fine Arts — named after the beloved nineteenth-century Czech painter Josef Mánes — the gallery is one of the finest examples of Czech functionalist architecture. Its most striking feature is the deliberate collision of old and new: the building incorporates the Šítkovská Water Tower, a Renaissance-era structure dating back to the 1500s, fusing it directly into a stark, glass-and-concrete modernist frame that spans the river on concrete piers.

The gallery quickly became a hub for Prague's interwar avant-garde, hosting exhibitions that connected Czech artists to the wider European modernist movement. It survived floods, occupation, and decades of communist-era neglect, and continues to function as a contemporary art gallery today — a rare structure where you can watch the Vltava flow directly beneath the exhibition floor.

🥚 Easter Egg: The 2002 Prague floods submerged the ground floor of the gallery almost entirely, a stark reminder that building directly over a river, however architecturally striking, comes with the occasional inconvenience of the river showing up uninvited. The gallery recovered and reopened, apparently undeterred by the occasional visit from the Vltava itself.`,

      cz: `Statečný dobrodruhu, vítej v Galerii Mánes — funkcionalistické skleněné krabici posazené nepravděpodobně na pilotách nad Vltavou, něžně obtočené kolem pětisetleté vodárenské věže jako velmi moderní objetí. Pražští architekti počátku dvacátého století se očividně nebáli míchat staletí.

Galerii postavil v letech 1927–1930 architekt Otakar Novotný pro Spolek výtvarných umělců Mánes — pojmenovaný po oblíbeném českém malíři devatenáctého století Josefu Mánesovi — a jde o jeden z nejlepších příkladů české funkcionalistické architektury. Nejnápadnějším rysem je záměrné setkání starého s novým: budova v sobě zahrnuje Šítkovskou vodárenskou věž, renesanční stavbu pocházející již ze 16. století, kterou spojuje s strohým, prosklenobetonovým modernistickým rámem klenoucím se přes řeku na betonových pilířích.

Galerie se rychle stala centrem pražské meziválečné avantgardy a hostila výstavy propojující české umělce se širším evropským modernistickým hnutím. Přežila povodně, okupaci i desetiletí komunistického zanedbávání a dodnes funguje jako galerie současného umění — vzácná stavba, kde lze sledovat proudění Vltavy přímo pod výstavními sály.

🥚 Velikonoční vajíčko: Povodně v roce 2002 zatopily přízemí galerie téměř celé — připomínka toho, že stavět přímo nad řekou, byť architektonicky působivě, s sebou nese občasnou nepříjemnost v podobě nezvané návštěvy samotné řeky. Galerie se z toho zotavila a znovu otevřela, zjevně nezastrašena občasnou návštěvou Vltavy.`,

      zh: `勇敢的冒险家，欢迎来到马奈斯画廊（Galerie Mánes）——一座功能主义风格的玻璃盒子，不可思议地架在伏尔塔瓦河上的桩基之上，温柔地环抱着一座有五百年历史的水塔，像一个非常现代的拥抱。看来二十世纪初的布拉格建筑师们，一点也不介意把不同世纪混搭在一起。

这座画廊由建筑师奥塔卡尔·诺沃特尼（Otakar Novotný）于1927至1930年间建造，为「马奈斯美术家协会」而建——协会以十九世纪深受喜爱的捷克画家约瑟夫·马奈斯命名——是捷克功能主义建筑的杰出范例之一。它最引人注目的特点，是新旧建筑之间刻意制造的碰撞：建筑将始建于十六世纪、文艺复兴时期的希特科夫斯卡水塔直接融入一个简洁的玻璃混凝土现代主义框架中，整座建筑靠混凝土桩基横跨河面而建。

这座画廊很快成为布拉格两战之间前卫艺术运动的中心，举办的展览将捷克艺术家与更广泛的欧洲现代主义运动联系在一起。它熬过了洪水、占领和数十年共产主义时期的忽视，至今仍作为当代艺术画廊运营——一座罕见的建筑，你可以在展厅地板之下，直接看到伏尔塔瓦河缓缓流过。

🥚 彩蛋：2002年布拉格大洪水几乎把画廊一楼全部淹没——这清楚地提醒人们，把建筑直接架在河流之上，无论建筑设计多么惊艳，偶尔也免不了迎来河流本身的「不速之客」。画廊后来完成修复并重新开放，显然并未被伏尔塔瓦河偶尔的造访吓退。`,
    },
  },
  {
    name: 'Sternberg Palace',
    slug: 'sternbersky-palac',
    localizedNames: { cz: 'Šternberský palác', zh: '什切尔恩贝格宫' },
    labels: ['museum', 'palace', 'historical'],
    coordinates: { lat: 50.09037281238459, lng: 14.396663102923888 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Sternberg Palace (Šternberský palác) — a Baroque palace so dedicated to Old Masters that it skipped straight past Czech art entirely and filled its halls with Rubens, Goya, and El Greco instead. Apparently even Bohemian counts occasionally preferred to shop abroad.

Built in the early eighteenth century for Count Wenzel Adalbert Sternberg, the palace sits in a quiet courtyard just steps from Prague Castle's main gate — easy to walk right past if you're not looking for it. Its refined Baroque interiors, with frescoed ceilings and an elegant oval central hall, now house the National Gallery's collection of European art from antiquity through the Baroque period, including major works by Rubens, El Greco, Goya, Cranach, and Dürer.

The collection was largely assembled through the efforts of the Society of Patriotic Friends of Art, founded in 1796 specifically to keep major European artworks from leaving Bohemia — an unusually forward-thinking act of cultural preservation for its time. Today the palace offers a genuinely startling contrast to Prague's Czech-heavy museum landscape: a chance to see Spanish, Italian, Flemish, and German masterpieces without ever needing to check a departures board.

🥚 Easter Egg: Sternberg Palace sits so close to Prague Castle that most visitors walk directly past its unassuming entrance on their way to the castle's crowds, never realising a world-class collection of European Old Masters is sitting quietly a few metres away. It might be the most overlooked great museum in the entire city.`,

      cz: `Statečný dobrodruhu, vítej ve Šternberském paláci — barokním paláci natolik oddaném starým mistrům, že rovnou přeskočil české umění a naplnil své sály Rubensem, Goyou a El Grecem. Zdá se, že i čeští hrabata občas raději nakupovali v zahraničí.

Palác postavený na počátku 18. století pro hraběte Václava Vojtěcha ze Šternberka stojí v tichém nádvoří jen pár kroků od hlavní brány Pražského hradu — snadno ho minete, pokud ho záměrně nehledáte. Jeho vytříbené barokní interiéry se zdobenými stropy a elegantním oválným centrálním sálem dnes ukrývají sbírku evropského umění Národní galerie od antiky až po baroko, včetně zásadních děl Rubense, El Greca, Goyi, Cranacha a Dürera.

Sbírka vznikla především díky úsilí Společnosti vlasteneckých přátel umění, založené v roce 1796 s cílem zabránit odchodu významných evropských uměleckých děl z Čech — pozoruhodně prozíravý čin kulturní ochrany na svou dobu. Palác dnes nabízí opravdu překvapivý kontrast k pražské, převážně české muzejní krajině: možnost vidět španělská, italská, vlámská a německá mistrovská díla, aniž byste museli kontrolovat odletovou tabuli.

🥚 Velikonoční vajíčko: Šternberský palác leží tak blízko Pražského hradu, že většina návštěvníků projde přímo kolem jeho nenápadného vchodu cestou k hradnímu davu, aniž by tušili, že jen pár metrů od nich tiše sídlí světová sbírka evropských starých mistrů. Možná jde o nejpřehlíženější skvělé muzeum v celém městě.`,

      zh: `勇敢的冒险家，欢迎来到什切尔恩贝格宫（Šternberský palác）——一座对古典大师作品情有独钟的巴洛克宫殿，干脆彻底跳过了捷克本土艺术，转而把展厅塞满了鲁本斯、戈雅和埃尔·格列柯的作品。看来就连波希米亚的伯爵，偶尔也更爱去国外「购物」。

这座宫殿建于18世纪初，为瓦茨拉夫·沃伊捷赫·什切尔恩贝格伯爵所建，坐落在布拉格城堡正门旁一处安静的庭院内——如果不是特意寻找，很容易直接错过。其精致的巴洛克式内部装饰，包括绘有壁画的天花板和一间优雅的椭圆形中央大厅，如今收藏着国家美术馆从古典时期到巴洛克时期的欧洲艺术藏品，包括鲁本斯、埃尔·格列柯、戈雅、克拉纳赫和丢勒等大师的重要作品。

这批藏品的形成，主要归功于1796年成立的「爱国艺术之友协会」，该协会的宗旨正是防止重要的欧洲艺术品流出波希米亚——就当时而言，这是一项异常有远见的文化保护举措。如今，这座宫殿为以捷克本土藏品为主的布拉格博物馆版图提供了一种真正令人惊喜的对比：不必查看航班信息屏，就能欣赏到西班牙、意大利、佛兰德斯和德国的艺术杰作。

🥚 彩蛋：什切尔恩贝格宫离布拉格城堡如此之近，以至于大多数游客在赶往城堡人潮的路上，都会直接从它低调的入口旁经过，完全没意识到几米之外，正静静收藏着一批世界级的欧洲古典大师作品。它或许是整座城市里最被忽视的一座伟大博物馆。`,
    },
  },
  {
    name: 'Antonín Dvořák Museum',
    slug: 'muzeum-antonina-dvoraka',
    localizedNames: { cz: 'Muzeum Antonína Dvořáka', zh: '安东宁·德沃夏克博物馆' },
    labels: ['museum', 'villa', 'historical'],
    coordinates: { lat: 50.073722541803626, lng: 14.426925867136669 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Antonín Dvořák Museum (Muzeum Antonína Dvořáka) — a cheerful Baroque summer villa nicknamed "America," dedicated to a composer who wrote one of classical music's most famous symphonies about, somewhat confusingly, that exact same country.

The museum occupies Villa Amerika, a small and exquisitely decorated Baroque villa built between 1717 and 1720 by Kilian Ignaz Dientzenhofer, one of Prague's most celebrated Baroque architects, for Count Michna of Vacínov. The villa's cheerful nickname comes from a nearby tavern once called "U Amerikánů," and the name simply stuck to the building over time — a very Prague way of naming things.

Since 1932 the villa has been dedicated to Antonín Dvořák (1841–1904), the butcher's son from a small Bohemian village who became one of the most celebrated composers of the Romantic era, famous worldwide for his Symphony No. 9 "From the New World," the opera Rusalka, and the "American" String Quartet — all written, ironically, with a genuine fondness for the actual United States, where he spent several formative years directing a conservatory in New York.

🥚 Easter Egg: Dvořák was reportedly obsessed with trains throughout his life, regularly visiting Prague's main railway station just to watch locomotives arrive and depart, and could apparently identify individual engines by sound alone. A world-famous composer with the enthusiasm of a trainspotting teenager — Prague's history rarely disappoints on charmingly odd personal details.`,

      cz: `Statečný dobrodruhu, vítej v Muzeu Antonína Dvořáka — veselé barokní letní vile přezdívané „Amerika", věnované skladateli, který napsal jednu z nejslavnějších symfonií klasické hudby poněkud matoucím způsobem právě o téže zemi.

Muzeum sídlí ve Vile Amerika, malé a nádherně zdobené barokní vile postavené v letech 1717–1720 Kiliánem Ignácem Dientzenhoferem, jedním z nejproslulejších pražských barokních architektů, pro hraběte Michnu z Vacínova. Veselá přezdívka vily pochází od nedaleké hospody kdysi zvané „U Amerikánů" a jméno se na budově prostě časem ujalo — velmi pražský způsob pojmenovávání věcí.

Od roku 1932 je vila věnována Antonínu Dvořákovi (1841–1904), synovi řezníka z malé české vesnice, který se stal jedním z nejslavnějších skladatelů romantické éry, celosvětově proslulým díky Symfonii č. 9 „Z Nového světa", opeře Rusalka a smyčcovému kvartetu „Americkému" — vše napsáno, ironicky, s upřímnou náklonností ke Spojeným státům, kde strávil několik formativních let jako ředitel konzervatoře v New Yorku.

🥚 Velikonoční vajíčko: Dvořák byl prý celoživotně posedlý vlaky, pravidelně navštěvoval pražské hlavní nádraží jen proto, aby sledoval příjezdy a odjezdy lokomotiv, a údajně dokázal jednotlivé stroje rozeznat podle zvuku. Světově proslulý skladatel s nadšením teenagera-vlakového nadšence — pražská historie málokdy zklame osobitými detaily.`,

      zh: `勇敢的冒险家，欢迎来到安东宁·德沃夏克博物馆（Muzeum Antonína Dvořáka）——一座绰号「美利坚」的欢快巴洛克夏日别墅，纪念的作曲家，恰好写出了古典音乐史上最著名的交响曲之一，主题略带巧合地——正是关于那个国家。

博物馆坐落于「美利坚别墅」（Vila Amerika）内，这是一座精美绝伦的小型巴洛克别墅，由布拉格最负盛名的巴洛克建筑师之一基利安·伊格纳茨·迪恩岑霍费尔（Kilian Ignaz Dientzenhofer）于1717至1720年间为瓦齐诺夫的米赫纳伯爵建造。别墅这个欢快的绰号，源自附近一家曾名为「美利坚人之家」的小酒馆，久而久之，这个名字就沿用到了建筑本身——非常「布拉格式」的命名方式。

自1932年起，这座别墅便一直用于纪念安东宁·德沃夏克（1841–1904）——这位出身波希米亚小村庄屠夫之家的作曲家，后来成为浪漫主义时期最负盛名的作曲家之一，凭借《第九交响曲「自新大陆」》、歌剧《水仙女》以及「美国」弦乐四重奏而闻名世界。颇具讽刺意味的是，这些作品都饱含着他对美国的真挚情感——他曾在纽约担任音乐学院院长，在那里度过了几年至关重要的岁月。

🥚 彩蛋：据说德沃夏克一生痴迷火车，经常前往布拉格总站，只为观看火车进站和出站，据说他甚至能仅凭声音辨认出不同的机车型号。一位世界闻名的作曲家，怀着少年铁道迷般的热情——布拉格的历史，总能在这些迷人的细节里给人惊喜。`,
    },
  },
  {
    name: 'National Museum Lapidarium',
    slug: 'lapidarium-narodniho-muzea',
    localizedNames: { cz: 'Lapidárium Národního muzea', zh: '国家博物馆石雕陈列馆' },
    labels: ['museum', 'hidden-gem', 'historical'],
    coordinates: { lat: 50.105597852732615, lng: 14.431546913775653 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the National Museum Lapidarium (Lapidárium Národního muzea) — a quiet warehouse of stone survivors, where Prague sends its outdoor statues into a sort of dignified witness-protection programme once pollution and weather get too aggressive.

Founded in 1893, the Lapidarium exists for a very specific and slightly melancholy reason: many of Prague's finest outdoor stone sculptures — worn down over centuries by weather, industrial pollution, and simple old age — cannot survive indefinitely outside. So the originals are quietly retired here, in climate-controlled safety, while weatherproof replicas often take their place in the city's squares and bridges. The result is a strange and wonderful collection: genuine medieval and Renaissance stonework, original fragments of the Marian Column that once stood in Old Town Square, and several of the actual statues that used to line Charles Bridge before replicas took over.

Tucked into the Výstaviště exhibition grounds in Holešovice, the museum sees a fraction of the visitors that flock to Charles Bridge daily, despite housing some of the very same statues those crowds are busy photographing outside — just older, more fragile, and considerably more honest about their true age.

🥚 Easter Egg: Several statues currently standing on Charles Bridge are exact replicas; their weather-beaten originals live here in the Lapidarium, close enough to walk to but rarely visited. Next time you admire a saint on Charles Bridge, there's a real chance you are looking at a stunt double, while the original quietly rests in a museum a few kilometres away.`,

      cz: `Statečný dobrodruhu, vítej v Lapidáriu Národního muzea — tiché skladiště kamenných přeživších, kam Praha posílá své venkovní sochy do jakéhosi důstojného programu ochrany svědků, jakmile na ně znečištění a počasí začnou být příliš agresivní.

Lapidárium založené v roce 1893 existuje z velmi konkrétního a poněkud melancholického důvodu: mnoho z nejkrásnějších pražských venkovních kamenných soch — opotřebovaných staletími počasí, průmyslového znečištění a prostého stáří — nemůže venku přežít donekonečna. Originály jsou proto tiše přesunuty sem, do klimatizovaného bezpečí, zatímco na náměstích a mostech města je často nahrazují odolné repliky. Výsledkem je podivuhodná sbírka: pravé středověké a renesanční kamenické práce, originální fragmenty Mariánského sloupu, který kdysi stál na Staroměstském náměstí, a několik skutečných soch, jež dříve lemovaly Karlův most, než je nahradily kopie.

Muzeum, ukryté v areálu Výstaviště v Holešovicích, navštíví jen zlomek lidí ve srovnání s davy, které denně proudí na Karlův most — přestože ukrývá některé z týchž soch, jež si tyto davy venku horlivě fotografují. Jen starší, křehčí a podstatně upřímnější ohledně svého skutečného věku.

🥚 Velikonoční vajíčko: Několik soch aktuálně stojících na Karlově mostě jsou přesné kopie; jejich zvětralé originály žijí právě zde v Lapidáriu, na dosah pěšky, ale málokdy navštívené. Až příště obdivujete světce na Karlově mostě, existuje reálná šance, že se díváte na kaskadérského dvojníka, zatímco originál tiše odpočívá v muzeu pár kilometrů odsud.`,

      zh: `勇敢的冒险家，欢迎来到国家博物馆石雕陈列馆（Lapidárium Národního muzea）——一座安静的石头「幸存者」仓库，每当污染和风化变得过于严酷，布拉格就会把户外雕像悄悄送到这里，接受某种颇有尊严的「证人保护计划」。

石雕陈列馆创建于1893年，其存在的理由十分具体，也带着几分伤感：布拉格众多最精美的户外石雕作品，历经数百年的风吹雨打、工业污染和岁月侵蚀，已经无法在户外无限期地保存下去。于是，这些原作被悄悄「退役」，安放在这座气候受控的安全场馆内，而在城市的广场和桥梁上，往往由耐候的复制品接替它们的位置。由此形成了一批既奇特又精彩的收藏：真正的中世纪与文艺复兴石刻作品、曾矗立在老城广场的圣母柱原始残件，以及几尊曾经排列在查理大桥上、如今已被复制品取代的真迹雕像。

这座博物馆隐藏在霍列绍维采的布拉格展览场（Výstaviště）内，与每天涌向查理大桥的人潮相比，来访者寥寥无几——尽管馆内收藏的，正是那些游客们正在桥上热情拍照的同一批雕像，只是它们更为古老、更加脆弱，也更诚实地展现着自己的真实年龄。

🥚 彩蛋：如今矗立在查理大桥上的几尊雕像，其实都是精确复制品；它们那饱经风霜的原作，如今就安静地陈列在这座石雕陈列馆中——步行即可到达，却鲜少有人来访。下次当你在查理大桥上欣赏某位圣徒雕像时，很有可能你看到的只是一位「替身演员」，而真正的原作，正在几公里外的博物馆里静静休息。`,
    },
  },
  {
    name: 'Nebozízek Restaurant',
    slug: 'restaurace-nebozizek',
    localizedNames: { cz: 'Restaurace Nebozízek', zh: '内博济泽克餐厅' },
    labels: ['restaurants-and-cafes', 'historical', 'landmark'],
    coordinates: { lat: 50.08201127152429, lng: 14.398841256101818 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Nebozízek — a restaurant whose name literally translates to "little auger" (as in, drill), which feels almost too honest for a place you can only reach by grinding your way up Petřín Hill, either on foot or by leaning on the funicular's mercy.

The name dates back to a medieval vineyard called Na Nebozezu, likely named after a zigzag path that spiralled up the hillside the way an auger bores into wood. In 1677, nobleman Karel Maxmilián Lažanský bought the vineyard and built a house with two wings and a raised central section. In 1809, the wholesaler and book printer Bohumil Haas took it over, renamed it Haasenburg, and opened Prague's first purpose-built sightseeing restaurant here — a place built specifically so people could eat while admiring the view, a genuinely novel idea at the time.

Haasenburg burned down in 1843 and was rebuilt in detail. The City of Prague bought the property in 1882 and restored its original name, Nebozízek; the restaurant found its first official tenant, Gustav Fiedler, in 1883. It has survived rather more than a name change, too — a major landslide on the Petřín slope in 1965 forced it to close in 1967, and by the time Klub Za starou Prahu ("Club for Old Prague") took up its restoration in 1984, the building was in such poor shape it had to be demolished and rebuilt as a faithful replica. Only the original cellars and a fragment of a Baroque staircase survived the process.

🥚 Easter Egg: Nebozízek sits at the halfway stop of the Petřín funicular, which means you can order dinner, watch the sun set over Prague Castle, and catch the next car down without ever having earned the view through actual auger-like effort. The path may be named after a drill, but the funicular has quietly made the whole ordeal optional.`,

      cz: `Statečný dobrodruhu, vítej v Nebozízku — restauraci, jejíž název doslova znamená "malý nebozez" (tedy vrták), což působí až příliš upřímně pro místo, kam se lze dostat jen tím, že se prokoušete vzhůru na Petřín, ať už pěšky, nebo s pomocí lanovky.

Název sahá až k středověké vinici zvané Na Nebozezu, pravděpodobně pojmenované podle klikaté stezky, která se vinula do svahu podobně, jako se nebozez zavrtává do dřeva. V roce 1677 vinici koupil šlechtic Karel Maxmilián Lažanský a postavil zde dům se dvěma křídly a vyvýšenou centrální částí. V roce 1809 objekt převzal velkoobchodník a knihtiskař Bohumil Haas, přejmenoval jej na Haasenburg a otevřel zde první pražskou vyhlídkovou restauraci postavenou přímo za účelem stolování s výhledem — v té době vskutku převratný nápad.

Haasenburg v roce 1843 vyhořel a byl detailně obnoven. Město Praha objekt koupilo v roce 1882 a vrátilo mu původní jméno Nebozízek; prvním oficiálním nájemcem restaurace se v roce 1883 stal Gustav Fiedler. Přežila i více než jen změnu jména — rozsáhlý sesuv půdy na petřínském svahu v roce 1965 vedl k jejímu uzavření v roce 1967, a než se v roce 1984 její obnovy ujal Klub Za starou Prahu, byla budova ve stavu natolik špatném, že musela být zbořena a znovu postavena jako věrná replika. Z původní stavby se dochovaly jen sklepy a fragment barokního schodiště.

🥚 Velikonoční vajíčko: Nebozízek stojí přesně u horní zastávky lanovky na půli cesty na Petřín, takže si můžete objednat večeři, sledovat západ slunce nad Pražským hradem a stihnout další vůz dolů, aniž byste si výhled museli vydřít skutečně nebozezovým úsilím. Stezka je sice pojmenovaná po vrtáku, ale lanovka celé to trápení tiše proměnila ve volitelné.`,

      zh: `勇敢的冒险家，欢迎来到内博济泽克餐厅（Nebozízek）——这个名字直译过来就是"小螺旋钻"（也就是钻头的意思），对于一家只能靠双脚苦苦爬上佩特任山（Petřín），或者仰赖缆车"开恩"才能抵达的餐厅来说，这名字诚实得有点过分。

这个名字可以追溯到一座中世纪葡萄园"Na Nebozezu"，得名大概是因为一条沿山坡盘旋而上的之字形小路，形状就像螺旋钻钻入木头的轨迹。1677年，贵族卡雷尔·马克西米利安·拉赞斯基（Karel Maxmilián Lažanský）买下了这座葡萄园，建造了一栋带两翼与凸起中央部分的房屋。1809年，批发商兼书商博胡米尔·哈斯（Bohumil Haas）接手了这里，将其更名为"哈森堡"（Haasenburg），并在此开设了布拉格第一家专门为观景而建的餐厅——在当时，这可是相当新潮的点子。

哈森堡在1843年被大火烧毁，随后被细致地重建。布拉格市于1882年买下该地产，并恢复了它原本的名字"内博济泽克"；1883年，古斯塔夫·菲德勒（Gustav Fiedler）成为这家餐厅第一位正式的承租人。它经历的远不止改名这么简单——1965年佩特任山坡发生大规模山体滑坡，导致餐厅在1967年被迫关闭；直到1984年，"保护老布拉格俱乐部"（Klub Za starou Prahu）着手修复时，建筑状况已经差到必须整栋拆除、按原样重建的地步。只有原本的地窖和一段巴洛克风格楼梯的残迹保留了下来。

🥚 彩蛋：内博济泽克正好坐落在佩特任缆车的半山腰站点旁，这意味着你可以一边享用晚餐，一边眺望夕阳洒落布拉格城堡，然后轻松赶上下一班缆车下山——完全不需要像"螺旋钻"那样费力钻上山才能换来这片风景。小路虽然是以钻头命名，但缆车早已悄悄把这份苦差事变成了可选项。`,
    },
  },
  {
    name: 'Negrelli Viaduct',
    slug: 'negrelliho-viadukt',
    localizedNames: { cz: 'Negrelliho viadukt', zh: '内格雷利高架桥' },
    labels: ['bridge', 'historical', 'transport'],
    coordinates: { lat: 50.097506568587356, lng: 14.440681968590335 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Negrelli Viaduct (Negrelliho viadukt) — Prague's second-oldest bridge over the Vltava, beaten to the title only by Charles Bridge, and somehow one of the least photographed large structures in the entire city despite being over a kilometre of solid brick and stone.

Built between 1846 and 1850 as part of the Vienna–Prague–Dresden railway line, the viaduct opened for traffic on 1 June 1850, engineered by Alois Negrelli — an Austrian builder whose career didn't stop at Prague. Stretching 1,110 metres across the river and the Karlín flatlands, it originally rested on 87 stone arches, including eight granite spans over the river itself, and briefly held the title of longest bridge in Europe, a record it kept until 1910. It remains, to this day, the oldest railway bridge in the country.

The viaduct has outlasted a great deal: two world wars, the fall of an empire, and the catastrophic floods of 2002, which swallowed much of surrounding Karlín while the bridge itself stood firm. A recent multi-year reconstruction, completed after nearly three years of work and roughly 1.9 billion crowns, restored the structure to its 1850 profile and — for the first time in its history — opened part of it to pedestrians and cyclists, so people can finally walk the length of a bridge that has spent 170-plus years exclusively serving trains.

🥚 Easter Egg: Alois Negrelli's Prague viaduct is impressive, but it isn't even his most famous project. Decades before Ferdinand de Lesseps broke ground on the Suez Canal, Negrelli was the engineer who drew up its original plans. So the same mind responsible for hauling Prague commuters over the Vltava also quietly laid the groundwork for connecting the Mediterranean to the Red Sea — proof that unglamorous infrastructure and world-changing engineering sometimes come from the exact same drafting table.`,

      cz: `Statečný dobrodruhu, vítej na Negrelliho viaduktu — druhém nejstarším mostě přes Vltavu v Praze, který v prvenství porazil jen Karlův most, a přesto jde o jednu z nejméně fotografovaných staveb podobného rozsahu v celém městě, přestože měří přes kilometr cihel a kamene.

Viadukt byl postaven mezi lety 1846 a 1850 jako součást železniční trati Vídeň–Praha–Drážďany a pro dopravu byl otevřen 1. června 1850; jeho stavbu řídil inženýr Alois Negrelli — rakouský stavitel, jehož kariéra se Prahou zdaleka nekončila. Viadukt se táhne 1 110 metrů přes řeku a karlínskou rovinu, původně spočíval na 87 kamenných obloucích, včetně osmi žulových polí nad samotnou řekou, a na krátkou dobu držel titul nejdelšího mostu v Evropě — rekord, který si udržel až do roku 1910. Dodnes je nejstarším železničním mostem v zemi.

Viadukt přečkal ledacos: dvě světové války, pád impéria i katastrofální povodně v roce 2002, které pohltily velkou část okolního Karlína, zatímco most samotný zůstal stát pevně. Nedávná několikaletá rekonstrukce, dokončená po téměř třech letech prací a s náklady kolem 1,9 miliardy korun, vrátila stavbě podobu z roku 1850 a poprvé v její historii otevřela část mostu chodcům a cyklistům — takže lidé se konečně mohou projít po délce mostu, který přes 170 let sloužil výhradně vlakům.

🥚 Velikonoční vajíčko: Negrelliho pražský viadukt je impozantní stavba, ale zdaleka není jeho nejslavnějším projektem. Desítky let předtím, než Ferdinand de Lesseps zahájil stavbu Suezského průplavu, byl to právě Negrelli, kdo vypracoval jeho původní plány. Tatáž mysl, která má na svědomí přepravu pražských cestujících přes Vltavu, tak tiše položila základy propojení Středozemního a Rudého moře — důkaz, že nenápadná infrastruktura a inženýrství měnící svět občas vzejdou ze stejného rýsovacího prkna.`,

      zh: `勇敢的冒险家，欢迎来到内格雷利高架桥（Negrelliho viadukt）——布拉格横跨伏尔塔瓦河的第二古老桥梁，仅次于查理大桥；尽管它长逾一公里、由砖石筑成，却是全城同等规模建筑中最少被拍照的一座。

这座高架桥于1846年至1850年间建成，是维也纳—布拉格—德累斯顿铁路线的一部分，1850年6月1日正式通车，工程由奥地利建筑师阿洛伊斯·内格雷利（Alois Negrelli）主持——而他的职业生涯远不止于布拉格这一项工程。桥体全长1110米，横跨河流与卡尔林平原，最初由87个石拱构成，其中8个跨越河道的拱为花岗岩结构；它一度是欧洲最长的桥梁，这一纪录一直保持到1910年。时至今日，它仍是捷克最古老的铁路桥。

这座高架桥经历过许多考验：两次世界大战、一个帝国的覆灭，还有2002年那场吞没了周边大片卡尔林地区的灾难性洪水——而桥体本身依然屹立不倒。近年来一项耗时近三年、耗资约19亿克朗的大规模修复工程，让桥梁恢复了1850年时的原貌，并首次在其历史上开放部分桥段供行人和骑行者通行——这座服役170多年、一直只为火车效力的桥，终于让人们可以徒步走完全程。

🥚 彩蛋：内格雷利在布拉格的这座高架桥固然令人赞叹，但它甚至算不上他最著名的作品。早在费迪南·德·雷赛布（Ferdinand de Lesseps）动工建造苏伊士运河的几十年前，正是内格雷利绘制了运河的最初方案。也就是说，那个让布拉格通勤者跨越伏尔塔瓦河的头脑，也曾悄悄为连接地中海与红海奠定了基础——不起眼的基础设施与改变世界的工程，有时候出自同一张绘图桌。`,
    },
  },
  {
    name: 'Nikola Tesla Monument',
    slug: 'pomnik-nikoly-tesly',
    localizedNames: { cz: 'Pomník Nikoly Tesly', zh: '尼古拉·特斯拉纪念碑' },
    labels: ['monument', 'modern'],
    coordinates: { lat: 50.10561393683505, lng: 14.394193185786111 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Nikola Tesla Monument (Pomník Nikoly Tesly) — a six-metre bronze bolt of stylized electricity standing quietly in a small Dejvice park, commemorating a genius who spent roughly one semester in this city and, true to form for a man who rarely finished what he started on paper, never actually earned a degree here.

Tesla arrived in Prague in 1880 at his uncle's urging and attended lectures at the Charles-Ferdinand University for a single semester. He was never formally enrolled — he lacked the required Greek examination — so he audited classes rather than pursued a diploma, then moved on to Budapest, Paris, and eventually the United States, where the ideas he'd been mulling over about alternating current would go on to power, quite literally, the modern world.

The monument itself, unveiled in November 2006 to mark the 150th anniversary of Tesla's birth, was designed by sculptor Stefan Milkov and architect Jiří Trojan. Measuring six by three by three metres and costing over four million crowns, its form is a stylized electrical discharge — a nod to Tesla's lifelong obsession with high voltage and alternating current — and it glows from within after dark, casting light exactly the way its subject would have appreciated.

🥚 Easter Egg: Despite Tesla's Prague résumé amounting to one unfinished semester with no diploma to show for it, this Dejvice sculpture is officially the largest Tesla monument anywhere in the world — outsizing tributes in Serbia, Croatia, and the United States, all countries with far stronger claims on the man. Sometimes cities build their biggest monuments not to what someone accomplished there, but to the tantalizing thought of what might have happened if they'd simply stayed a little longer.`,

      cz: `Statečný dobrodruhu, vítej u Pomníku Nikoly Tesly — šestimetrového bronzového výboje stylizované elektřiny, tiše stojícího v malém dejvickém parku, na počest génia, který v tomto městě strávil zhruba jeden semestr a — v souladu se svou pověstí muže, který jen málokdy dotáhl na papíře cokoliv do konce — zde nikdy nezískal žádný titul.

Tesla přijel do Prahy v roce 1880 na nátlak svého strýce a jeden semestr navštěvoval přednášky na Karlo-Ferdinandově univerzitě. Formálně nebyl nikdy zapsán — chyběla mu povinná zkouška z řečtiny —, a tak přednášky pouze poslouchal, aniž by usiloval o diplom. Poté pokračoval do Budapešti, Paříže a nakonec do Spojených států, kde myšlenky, které si tehdy v hlavě přebíral ohledně střídavého proudu, doslova poháněly moderní svět.

Samotný pomník, odhalený v listopadu 2006 u příležitosti 150. výročí Teslova narození, navrhl sochař Stefan Milkov a architekt Jiří Trojan. Měří šest krát tři krát tři metry a stál přes čtyři miliony korun; jeho tvar představuje stylizovaný elektrický výboj — poklonu Teslově celoživotní posedlosti vysokým napětím a střídavým proudem — a po setmění se rozsvítí zevnitř, přesně tak, jak by si to jeho hlavní hrdina jistě přál.

🥚 Velikonoční vajíčko: Ačkoliv Teslovo pražské CV sestává z jediného nedokončeného semestru bez jakéhokoliv diplomu, tato dejvická socha je oficiálně největším pomníkem Nikoly Tesly na celém světě — předčí i pocty v Srbsku, Chorvatsku a Spojených státech, tedy v zemích s mnohem silnějším nárokem na tohoto muže. Města někdy stavějí své největší pomníky ne tomu, co se u nich skutečně odehrálo, ale lákavé myšlence, co by se stalo, kdyby dotyčný zůstal jen o něco déle.`,

      zh: `勇敢的冒险家，欢迎来到尼古拉·特斯拉纪念碑（Pomník Nikoly Tesly）——一座高达六米、造型宛如风格化闪电的青铜雕塑，静静矗立在戴维采（Dejvice）的一座小公园里，纪念这位在布拉格只待过短短一个学期、且一如既往地没有拿到任何学位的天才。

1880年，特斯拉在叔叔的劝说下来到布拉格，在卡尔-斐迪南大学（Charles-Ferdinand University）旁听了一个学期的课程。他从未正式注册入学——因为他缺少必修的希腊语考试成绩——于是只能旁听，而没有真正攻读文凭。随后他辗转前往布达佩斯、巴黎，最终抵达美国。正是在那里，他当年反复琢磨的交流电构想，日后真正意义上点亮并驱动了整个现代世界。

这座雕塑于2006年11月揭幕，恰逢特斯拉诞辰150周年，由雕塑家斯特凡·米尔科夫（Stefan Milkov）和建筑师伊日·特罗扬（Jiří Trojan）共同设计。雕塑高6米、宽3米、深3米，造价超过四百万克朗，其造型是一道风格化的电击闪光——向特斯拉毕生痴迷的高压电与交流电致敬——夜幕降临后，雕塑还会由内而外地发光，其效果想必正是它所纪念之人会欣赏的方式。

🥚 彩蛋：尽管特斯拉在布拉格的"履历"只有未完成的一个学期、没有任何文凭，戴维采的这座雕像却是全世界最大的特斯拉纪念碑——规模超过塞尔维亚、克罗地亚乃至美国等与特斯拉渊源更深的国家所建的纪念物。有时候，一座城市建造最宏大的纪念碑，纪念的并不是某人真正做成了什么，而是那个诱人的假设：如果他当初多留一阵子，会发生什么。`,
    },
  },
  {
    name: 'Nová Spirála',
    slug: 'nova-spirala',
    localizedNames: { cz: 'Nová Spirála', zh: '新螺旋剧院' },
    labels: ['cultural', 'modern'],
    coordinates: { lat: 50.108385809335104, lng: 14.429945536139389 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Nová Spirála — a Výstaviště venue where you reach your seat by walking down actual spiral ramps, because apparently a regular staircase felt insufficiently dramatic for a hall that used to be a circular panoramic cinema.

The building began life as the Kruhové kino, a circular cinema on the Výstaviště exhibition grounds, and was converted into a theatre for the 1991 Jubilee Exhibition by architects Jindřich Smetana, Jan Louda, Tomáš Kulík, and Zbyšek Stýblo. Its new name, Spirála, came directly from the spiral ramps that became the load-bearing structure of the whole interior, carrying audiences around the stage rather than straight toward it. The conversion earned an honorable mention at the 1991 Prague Quadrennial and the Grand Prix of the Association of Czech Architects in 1993 — and its very first production, once the exhibition ended, was Laterna Magika's Faust, which premiered on 15 July 1992.

The devastating floods of August 2002 put the lower half of the Výstaviště grounds, Spirála included, entirely underwater, and the building spent years afterward in an uncertain state. A major reconstruction that began in 2021 finally brought it back, and the venue reopened on 3 October 2024 under its current name, Nová Spirála — now a multi-genre cultural space with a 360-degree auditorium, a revolving stage seating up to 800 people, and modern audiovisual technology built into a shell that started out screening panoramic newsreels.

🥚 Easter Egg: The theatre's first-ever production, Laterna Magika's Faust, wasn't a random booking — Laterna Magika is the Czech multimedia theatre company that dazzled the world at Expo 58 in Brussels by blending live performance with film projection, decades before "multimedia" was a familiar word. A building shaped like a spiral hosting a company built around blending art forms feels less like coincidence and more like Prague matching form to function, as usual.`,

      cz: `Statečný dobrodruhu, vítej v Nové Spirále — sále na Výstavišti, kam se ke svému místu dostanete po skutečných spirálových rampách, protože obyčejné schodiště zjevně nepůsobilo dost dramaticky pro halu, která bývala kruhovým panoramatickým kinem.

Budova začínala jako Kruhové kino na pražském Výstavišti a na divadelní scénu byla přestavěna k příležitosti Jubilejní výstavy v roce 1991 architekty Jindřichem Smetanou, Janem Loudou, Tomášem Kulíkem a Zbyškem Stýblem. Nový název Spirála pochází přímo od spirálové rampy, která se stala nosným prvkem celého interiéru a vedla diváky kolem jeviště, místo aby je vedla přímo k němu. Přestavba získala čestné uznání na Pražském quadriennale 1991 a Grand Prix Obce architektů v roce 1993 — a jejím úplně prvním představením po skončení výstavy byl Faust Laterny magiky, který měl premiéru 15. července 1992.

Ničivá povodeň v srpnu 2002 zaplavila celou spodní část areálu Výstaviště, Spirálu nevyjímaje, a budova pak řadu let zůstávala v nejisté situaci. Rozsáhlá rekonstrukce, která začala v roce 2021, ji nakonec vrátila k životu a prostor byl slavnostně znovuotevřen 3. října 2024 pod současným názvem Nová Spirála — dnes jde o multižánrový kulturní prostor s hledištěm do kruhu 360 stupňů, otočným jevištěm až pro 800 diváků a moderní audiovizuální technikou zabudovanou do pláště, který kdysi promítal panoramatické týdeníky.

🥚 Velikonoční vajíčko: Úplně první inscenace divadla, Faust Laterny magiky, nebyla náhodnou volbou — Laterna magika je český multimediální divadelní soubor, který okouzlil svět na Expu 58 v Bruselu spojením živého představení s filmovou projekcí, desítky let předtím, než se slovo "multimediální" stalo běžným pojmem. Budova ve tvaru spirály, hostící soubor postavený na propojování uměleckých forem, tak působí méně jako náhoda a spíše jako Praha, jak ji známe — forma sedící přesně na funkci.`,

      zh: `勇敢的冒险家，欢迎来到新螺旋剧院（Nová Spirála）——布拉格展览场（Výstaviště）内的一处场馆，你需要沿着真正的螺旋坡道走下去才能找到座位，因为对于一座曾经是环形全景电影院的大厅来说，普通楼梯显然不够有戏剧感。

这栋建筑最初是布拉格展览场内的一座环形电影院（Kruhové kino），1991年为纪念展（Jubilejní výstava）而由建筑师伊日赫·斯梅塔纳（Jindřich Smetana）、扬·劳达（Jan Louda）、托马什·库利克（Tomáš Kulík）和兹比舍克·斯蒂布洛（Zbyšek Stýblo）改建为剧院。它的新名字"螺旋"（Spirála）正是来自那条成为整栋建筑承重结构的螺旋坡道——观众沿着坡道绕行至舞台四周，而非径直走向舞台。这次改建在1991年布拉格四年展（Prague Quadrennial）上获得荣誉提名，并在1993年荣获捷克建筑师协会大奖；展览结束后，剧院上演的第一部作品，正是拉特尔纳魔灯剧院（Laterna Magika）的《浮士德》，于1992年7月15日首演。

2002年8月的那场灾难性洪水，淹没了整个布拉格展览场下半区，螺旋剧院也未能幸免，此后这栋建筑长年处于悬而未决的状态。直到2021年启动的大规模重建工程，才终于让它重获新生：2024年10月3日，场馆以现在的名字"新螺旋"（Nová Spirála）盛大重新开幕——如今这里是一处多类型文化空间，拥有360度环形观众席、可容纳多达800人的旋转舞台，以及嵌入在这座曾放映全景新闻片的建筑外壳中的现代视听技术。

🥚 彩蛋：剧院开幕后的第一部作品——拉特尔纳魔灯剧院的《浮士德》——绝非随意之选。拉特尔纳魔灯是捷克的多媒体剧团，早在"多媒体"这个词还未被广泛使用的几十年前，就以融合现场表演与电影投影的方式，在1958年布鲁塞尔世博会上震惊了全世界。一座螺旋形状的建筑，容纳着一个致力于融合各种艺术形式的剧团——这与其说是巧合，不如说是布拉格一贯的作风：形式恰好服务于功能。`,
    },
  },
  {
    name: 'Nusle Brewery',
    slug: 'nuselsky-pivovar',
    localizedNames: { cz: 'Nuselský pivovar', zh: '努斯莱啤酒厂' },
    labels: ['historical', 'hidden-gem', 'architecture'],
    coordinates: { lat: 50.06585422571656, lng: 14.437567185956755 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Nusle Brewery (Nuselský pivovar) — a 330-year-old beer works that, partway through its career, quietly swapped hops for grapes and spent decades making wine instead, all while everyone kept calling it a brewery out of sheer habit.

Founded in 1694 by Count Jan Josef Sezima of Vrtba in the Nusle valley, the brewery grew steadily over the centuries, with a major expansion completed in the second half of the 19th century. By the late 1930s, it ranked among the largest breweries in Central Europe, turning out roughly 90,000 hectolitres a year. Its light and dark ten-degree draft beers were well regarded, but the real star of the lineup was Prelát, a strong fourteen-degree dark beer that gave the brewery its local reputation.

Beer production stopped for good in 1960, and the premises were handed over to the Czech Wine Enterprise, which spent decades producing wine here instead — including a label called Pražský výběr (Prague Selection). So for longer than it brewed beer in its final chapter, a building named "pivovar" was quietly bottling wine, a fact that seemed to bother almost nobody. The complex was declared a protected cultural monument in 2003, and since 2020, the site has been gradually reborn: some operational buildings were demolished to make way for housing, while the historically protected structures along Mnatova Street were restored for commercial, cultural, and community use — a new neighbourhood built carefully around what survived.

🥚 Easter Egg: For decades, locals kept referring to a working winery as "the brewery" simply because the sign, and the name, never changed. It's a small, very Czech kind of stubbornness — the taste inside the building shifted entirely from beer to wine, but the identity etched into the neighbourhood's memory refused to budge an inch.`,

      cz: `Statečný dobrodruhu, vítej u Nuselského pivovaru — 330 let starého pivovarského provozu, který v jistém bodě své kariéry potichu vyměnil chmel za hrozny a na desítky let se přeorientoval na výrobu vína, zatímco mu všichni ze setrvačnosti dál říkali pivovar.

Pivovar založil v roce 1694 hrabě Jan Josef Sezima z Vrtby v nuselském údolí a v průběhu staletí se postupně rozrůstal, s velkým rozšířením dokončeným ve druhé polovině 19. století. Koncem třicátých let 20. století patřil mezi největší pivovary ve střední Evropě a produkoval zhruba 90 000 hektolitrů piva ročně. Jeho světlé a tmavé desítky měly dobrou pověst, ale skutečnou hvězdou sortimentu bylo silné čtrnáctistupňové tmavé pivo Prelát, které pivovaru vyneslo místní proslulost.

Výroba piva definitivně skončila v roce 1960 a objekt převzal Český vinařský podnik, který zde po další desítky let vyráběl místo piva víno — mimo jiné pod značkou Pražský výběr. Budova nesoucí jméno "pivovar" tak déle tichě plnila lahve vínem, než v posledním úseku své existence vařila pivo — a zdálo se, že to nikomu příliš nevadí. Areál byl v roce 2003 prohlášen za chráněnou kulturní památku a od roku 2020 se postupně proměňuje: některé provozní budovy byly zbořeny a nahrazeny bydlením, zatímco památkově chráněné stavby v Mnatově ulici byly zrekonstruovány pro komerční, kulturní a komunitní využití — vzniká tak nová čtvrť, pečlivě vystavěná kolem toho, co se dochovalo.

🥚 Velikonoční vajíčko: Místní po desítky let říkali fungující vinařství "pivovar" jen proto, že se název a cedule na budově nikdy nezměnily. Je to malá, velmi česká forma tvrdohlavosti — chuť uvnitř budovy se z piva zcela proměnila na víno, ale identita zapsaná do paměti čtvrti se nehnula ani o píď.`,

      zh: `勇敢的冒险家，欢迎来到努斯莱啤酒厂（Nuselský pivovar）——一座已有330年历史的酿酒厂。在漫长的历史中，它一度悄悄把啤酒花换成了葡萄，转而酿起了葡萄酒，而周围的人却因为习惯，仍然一直叫它"啤酒厂"。

这座啤酒厂由扬·约瑟夫·塞齐马·冯·弗尔特巴伯爵（Jan Josef Sezima of Vrtba）于1694年在努斯莱山谷创立，历经数百年稳步扩张，19世纪下半叶完成了一次大规模扩建。到20世纪30年代末，它已跻身中欧规模最大的啤酒厂之列，年产量约达9万百升。它的浅色与深色十度生啤颇受好评，但真正的招牌，是一款酒精度较高的十四度深色啤酒——"普雷拉特"（Prelát），正是这款啤酒为酒厂赢得了本地声誉。

1960年，啤酒生产彻底停止，厂区随后被移交给捷克葡萄酒企业，此后数十年间这里一直在酿造葡萄酒，其中就包括名为"布拉格精选"（Pražský výběr）的品牌。也就是说，这座名叫"啤酒厂"的建筑，在其最后一段历史里，酿酒（葡萄酒）的时间远比酿啤酒更长——而这件事似乎几乎没人在意。2003年，整个建筑群被列为受保护的文化古迹；自2020年起，这里逐步获得新生：部分生产建筑被拆除，为住宅让路，而位于姆纳托娃街（Mnatova Street）沿线受保护的历史建筑，则被修复用于商业、文化和社区用途——一片围绕幸存建筑精心营造的新社区正在这里形成。

🥚 彩蛋：几十年来，当地人一直把一家实际在酿葡萄酒的酒庄叫作"啤酒厂"，仅仅因为招牌和名字从未更换过。这是一种非常捷克式的、小小的固执——建筑内部的味道早已从啤酒彻底变成了葡萄酒，但刻在街区记忆里的身份，却分毫未曾改变。`,
    },
  },
  {
    name: 'Palác Akropolis',
    slug: 'palac-akropolis',
    localizedNames: { cz: 'Palác Akropolis', zh: '阿克罗波利斯宫' },
    labels: ['cultural', 'landmark'],
    coordinates: { lat: 50.08233526335989, lng: 14.448993369587882 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Palác Akropolis — a Žižkov apartment building that has, over one century, moonlighted as a theatre, a cinema, a workers' canteen, and one of Central Europe's most beloved alternative music venues, which is an unusually eventful résumé for a place that began life with a café on the ground floor.

Construction started in March 1927, when architect Rudolf V. Svoboda began building on his own plot at the corner of Kubelíkova and Víta Nejedlého streets, on the border between Žižkov and Královské Vinohrady. The building combined spacious apartments with a ground-floor café and a basement theatre hall, its foyer decorated by painter Štroff with scenes from the founding of Czechoslovakia. The hall opened on 23 January 1928 with a production of Mahen's comedy Ulička odvahy — barely two weeks before Svoboda himself was still accepting congratulations at the building's official inspection.

The good times didn't last. The economic crisis of the early 1930s buried Svoboda in debt, and the building was sold off at forced auction — to, of all buyers, a cremation company. During the Second World War it operated occasionally as a cinema, briefly returned to theatre after the war, and then closed for good as a stage following the communist coup of February 1948. For decades afterward it served as storage space, its once-lively restaurant reduced to a canteen for factory workers and pensioners.

🥚 Easter Egg: The revival came in 1991, when the newly formed Žižkovská divadelní a hudební agentura bought the building with help from the Nadace Pražská pětka foundation, reopening the restaurant first and then rebuilding the hall entirely. It went on to win "Best Rock Club" from The Prague Post and "Interior of the Year" from the Union of Czech Architects, and in 1996 celebrated sculptor František Skála transformed the interior into a genuine work of art in its own right. Somewhere between the cremation company's ownership and today's packed concert nights, this building managed the rare trick of getting louder with age.`,

      cz: `Statečný dobrodruhu, vítej v Paláci Akropolis — žižkovském činžovním domě, který si za jedno století přivydělal jako divadlo, kino, dělnická jídelna a jeden z nejoblíbenějších alternativních hudebních klubů střední Evropy, což je nezvykle bohaté curriculum vitae pro místo, které začínalo s kavárnou v přízemí.

Stavba začala v březnu 1927, kdy architekt Rudolf V. Svoboda začal stavět na vlastním pozemku na rozhraní Žižkova a Královských Vinohrad, na nároží dnešních ulic Kubelíkovy a Víta Nejedlého. Budova spojovala prostorné byty s kavárnou v přízemí a divadelním sálem v suterénu, jehož foyer vyzdobil malíř Štroff výjevy z událostí spjatých se vznikem Československa. Sál byl slavnostně otevřen 23. ledna 1928 uvedením Mahenovy veselohry Ulička odvahy — necelé dva týdny poté, co Svoboda sám ještě přijímal gratulace při kolaudaci budovy.

Dobré časy netrvaly dlouho. Hospodářská krize počátku třicátých let Svobodu zavalila dluhy a budova byla prodána v exekučním řízení — kupující byla, ironií osudu, společnost zabývající se pohřbíváním žehem. Za druhé světové války objekt občas fungoval jako kino, po válce se sem krátce vrátilo divadlo, aby definitivně skončilo po únorovém komunistickém převratu roku 1948. Po další desetiletí sloužila budova jako sklad a kdysi rušná restaurace se proměnila v jídelnu pro dělníky a důchodce.

🥚 Velikonoční vajíčko: Znovuzrození přišlo v roce 1991, kdy nově vzniklá Žižkovská divadelní a hudební agentura budovu koupila s pomocí Nadace Pražská pětka, nejprve zprovoznila restauraci a poté kompletně přestavěla sál. Klub si následně vysloužil ocenění Nejlepší rockový klub od týdeníku The Prague Post a Interiér roku od Obce architektů, a v roce 1996 proslulý sochař František Skála proměnil interiér v samostatné umělecké dílo. Někde mezi vlastnictvím pohřební společnosti a dnešními nabitými koncertními večery se této budově podařil vzácný kousek — s věkem zesílila.`,

      zh: `勇敢的冒险家，欢迎来到阿克罗波利斯宫（Palác Akropolis）——这座位于日什科夫（Žižkov）的公寓楼，在过去的一个世纪里先后兼职做过剧院、电影院、工人食堂，如今则是中欧最受欢迎的另类音乐场馆之一——对于一栋一楼最初只是间咖啡馆的建筑来说，这份履历相当丰富多彩。

建筑工程始于1927年3月，建筑师鲁道夫·V·斯沃博达（Rudolf V. Svoboda）在自己的地块上动工，地点位于日什科夫与皇家维诺赫拉迪（Královské Vinohrady）交界处、如今库贝利科娃街与维塔·内耶德利街的转角处。整栋建筑将宽敞的公寓与一楼的咖啡馆、地下室的剧场大厅结合在一起，画家什特罗夫（Štroff）在门厅绘制了描绘捷克斯洛伐克建国场景的壁画。剧场大厅于1928年1月23日正式开幕，首演剧目是马亨（Mahen）的喜剧《勇气小巷》（Ulička odvahy）——就在两周前，斯沃博达本人还在建筑竣工验收仪式上接受众人的祝贺。

然而好景不长。20世纪30年代初的经济危机让斯沃博达债台高筑，建筑最终被强制拍卖——而买家颇具讽刺意味，是一家火葬服务公司。第二次世界大战期间，这里偶尔作为电影院使用；战后剧院短暂恢复运营，却在1948年二月共产党政变后彻底关闭。此后数十年间，这里沦为仓库，曾经热闹的餐厅也变成了供工厂工人和退休人员用餐的食堂。

🥚 彩蛋：转机出现在1991年，新成立的日什科夫戏剧与音乐机构（Žižkovská divadelní a hudební agentura）在"布拉格五号"基金会（Nadace Pražská pětka）的帮助下买下了这栋建筑，先恢复了餐厅营业，随后对剧场大厅进行了彻底重建。该场馆此后先后荣获《布拉格邮报》评选的"最佳摇滚俱乐部"，以及捷克建筑师协会颁发的"年度最佳室内设计"奖项；1996年，著名雕塑家弗朗蒂谢克·斯卡拉（František Skála）将内部空间改造成了一件真正的艺术品。从曾经归属火葬公司，到如今座无虚席的演出之夜，这栋建筑完成了一件罕见的事情——它随着年岁增长，反而变得更加喧闹。`,
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
