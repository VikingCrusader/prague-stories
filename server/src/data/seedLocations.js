import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';

export const locations = [
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
    name: 'Mihulka Powder Tower',
    slug: 'prasna-vez-mihulka',
    localizedNames: { cz: 'Prašná věž Mihulka', zh: '米胡尔卡火药塔' },
    labels: ['tower', 'historical', 'museum'],
    coordinates: { lat: 50.09135709614391, lng: 14.40045799644936 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Mihulka Powder Tower! This chunky Renaissance cylinder tucked into Prague Castle's northern wall spent its working life storing gunpowder, casting bells, brewing alchemy for an emperor, and housing the cathedral sexton — proving that even a fortification tower in Prague cannot commit to just one career.

Built at the very end of the 15th century as part of a sweeping new fortification project, the tower was designed by royal architect Benedikt Rejt on the orders of King Vladislav Jagiellon, who had just returned his court to Prague Castle after more than a century of royal absence. Standing 44 metres tall with a 20-metre diameter, Mihulka is one of three surviving towers from this late-medieval defensive line, perched above the steep slope of the Deer Moat on the Castle's northern flank — built to be the mightiest cannon tower in the whole fortification.

Its interior led several separate lives. The Renaissance bell founder Tomáš Jaroš kept his workshop here, casting both the enormous Sigismund Bell for St. Vitus Cathedral and the Singing Fountain near the Royal Summer Palace. Later, under Emperor Rudolf II, part of the tower reportedly served as a laboratory for the court's alchemists, chasing gold and the philosopher's stone in the emperor's obsessive pursuit of hermetic knowledge. Afterward it settled into quieter work as a gunpowder magazine, then a dungeon, and — until the 20th century — as the modest home of the cathedral's sexton.

🥚 Easter Egg: Prague's alchemist mythology usually gets pinned on the tiny houses of Golden Lane nearby, thanks to a very persistent tourist legend. Most historians agree that's mostly folklore — the real laboratory work, if it happened on this scale at all, was far more likely conducted right here in Mihulka's thick stone walls, with actual furnaces and proper ventilation, rather than in a cottage barely large enough to stand up in.`,

      cz: `Statečný dobrodruhu, vítej v Prašné věži Mihulka! Tento podsaditý renesanční válec zasazený do severní hradby Pražského hradu si během své kariéry vyzkoušel snad všechno — skladování střelného prachu, odlévání zvonů, alchymistické pokusy pro císaře i bydlení kostelníka — což dokazuje, že ani hradební věž se v Praze nedokáže spokojit s jedinou profesí.

Věž byla postavena na samém konci 15. století jako součást rozsáhlého opevňovacího programu podle návrhu královského stavitele Benedikta Rejta, na příkaz krále Vladislava Jagellonského, který se se svým dvorem právě vrátil na Pražský hrad po více než století panovnické nepřítomnosti. Se svými 44 metry výšky a průměrem 20 metrů je Mihulka jednou ze tří dochovaných věží tehdejší pozdně gotické obranné linie, tyčící se nad strmým svahem Jeleního příkopu na severní straně Hradu — postavená jako nejmohutnější dělová věž celého opevnění.

Její vnitřek prožil hned několik samostatných životů. Renesanční zvonař Tomáš Jaroš zde měl svou dílnu a odlil zde jak mohutný Zikmundův zvon pro katedrálu sv. Víta, tak Zpívající fontánu u Královského letohrádku. Později, za vlády císaře Rudolfa II., prý část věže sloužila jako laboratoř dvorním alchymistům, kteří v císařově posedlosti hermetickým věděním hledali zlato a kámen mudrců. Poté se věž usadila v klidnějším provozu jako prachárna, posléze jako žalář a — až do 20. století — jako skromný byt kostelníka katedrály.

🥚 Velikonoční vajíčko: Pražská alchymistická mytologie se obvykle připisuje malým domečkům nedaleké Zlaté uličky, díky velmi vytrvalé turistické legendě. Většina historiků se ale shoduje, že jde spíše o folklór — pokud se alchymistická práce v takovém rozsahu vůbec odehrávala, mnohem pravděpodobněji probíhala právě zde, v mohutných kamenných zdech Mihulky, se skutečnými pecemi a řádným větráním, než v chaloupce, kde se člověk sotva narovnal.`,

      zh: `勇敢的冒险家，欢迎来到普拉纳塔（Prašná věž）——米胡尔卡火药塔！这座矮胖的文艺复兴风格圆形塔楼嵌在布拉格城堡北侧城墙中，一生干过储存火药、铸造钟铃、为皇帝炼金，还当过教堂司事的住所——证明就连一座城墙塔楼，在布拉格也无法只专精一份工作。

这座塔楼建于15世纪末，是瓦迪斯拉夫二世·亚盖隆（Vladislav Jagellonský）国王大规模筑城计划的一部分，由王室建筑师本尼迪克特·雷特（Benedikt Rejt）设计——当时国王的宫廷刚刚结束了长达一个多世纪的缺席，重新迁回布拉格城堡。塔高44米，直径20米，是这条晚期哥特式防线中现存的三座塔楼之一，矗立在城堡北侧鹿壕沟（Jelení příkop）陡坡之上，当初的设计目标是成为整条防线中火力最强的炮塔。

塔楼内部先后经历了好几段完全不同的"职业生涯"。文艺复兴时期的铸钟匠托马斯·雅罗什（Tomáš Jaroš）曾在此设有工坊，铸造了圣维特大教堂那口巨大的西吉斯蒙德钟（Zikmundův zvon），以及皇家夏宫附近的"会唱歌的喷泉"。后来，在鲁道夫二世皇帝在位期间，据说塔楼的一部分曾被用作宫廷炼金术士的实验室，皇帝对赫尔墨斯秘术的痴迷让这里一度弥漫着寻找黄金与贤者之石的气息。此后，塔楼归于平静，先后充当火药库、监狱，直到20世纪，还长期作为大教堂司事的简朴住所。

🥚 彩蛋：布拉格的炼金术传说通常被安在附近黄金巷（Zlatá ulička）那些小房子头上，这多亏了一个非常顽固的旅游传说。但大多数历史学家认为，这更多是民间演绎——如果当年真的存在这种规模的炼金实验，更可能是在米胡尔卡这样厚实的石墙内进行，配有真正的熔炉和通风设施，而不是在一间连站直都困难的小屋里。`,
    },
  },
  {
    name: 'Church of the Most Holy Trinity',
    slug: 'kostel-nejsvetejsi-trojice-spalena',
    localizedNames: { cz: 'Kostel Nejsvětější Trojice', zh: '至圣三一堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.07066187908413, lng: 14.417908714870514 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Church of the Most Holy Trinity! Built for monks whose entire vocation was ransoming captives from slavery, nearly flattened by a runaway metro excavation, and rescued by furious parishioners twice over, this quiet Baroque survivor has packed in far more drama than its modest façade admits.

The church and its adjoining monastery were built between 1708 and 1713 on the site of two demolished houses, designed by Octavian Broggio and raised under builders Kryštof Dientzenhofer and Jan Jiří Aichbauer the Younger. It was funded by Jan Ignác Putz z Adlersthurmu, the kingdom's chief mint master, for the Trinitarian Order — a religious order whose specific mission was collecting ransom money to free Christians held captive, often by pirates or in North Africa, which made a monastery of professional hostage negotiators a rather unusual next-door neighbour on a Prague street.

Joseph II's sweeping monastic reforms dissolved the Trinitarian community in 1783 and shut the church along with it, but Prague's parishioners pushed back hard enough that it reopened just a year later, absorbing the parish of the recently closed Church of St. Martin in the Wall. Its troubles weren't over: 20th-century construction of Prague's metro system structurally damaged the building badly enough that demolition was seriously discussed. It survived, and still preserves interior wall paintings from 1779. Since February 2006 it has served Prague's Slovak Greek Catholic community.

🥚 Easter Egg: The street it stands on, Spálená ("Burnt"), earned its name from a catastrophic fire on 3 June 1506 that destroyed twenty houses along it — meaning this church has spent three centuries facing a street named after a disaster, while quietly surviving disasters of its own.`,

      cz: `Statečný dobrodruhu, vítej v kostele Nejsvětější Trojice! Postaven pro mnichy, jejichž celým posláním bylo vykupování zajatců z otroctví, málem srovnán se zemí uprostřed výstavby metra a dvakrát zachráněn rozhořčenými farníky — tento tichý barokní přeživší toho ve své historii zvládl mnohem víc, než by jeho skromná fasáda prozradila.

Kostel spolu s přilehlým klášterem vznikl v letech 1708–1713 na místě dvou zbořených domů podle návrhu Octaviana Broggia a pod vedením stavitelů Kryštofa Dientzenhofera a Jana Jiřího Aichbauera mladšího. Financoval jej Jan Ignác Putz z Adlersthurmu, nejvyšší mincmistr Českého království, pro řád trinitářů — řeholi, jejímž konkrétním posláním bylo vybírat výkupné na osvobození křesťanů zajatých v otroctví, často piráty nebo v severní Africe, což z kláštera profesionálních vyjednavačů o rukojmích udělalo poněkud neobvyklého souseda na pražské ulici.

Rozsáhlé josefínské klášterní reformy zrušily trinitářskou komunitu v roce 1783 a s ní i kostel, ale pražští farníci se ozvali natolik hlasitě, že se kostel už o rok později znovu otevřel a převzal farnost tehdy zrušeného kostela sv. Martina ve zdi. Jeho trápení tím ale neskončilo: výstavba pražského metra ve 20. století budovu staticky poškodila natolik, že se vážně uvažovalo o demolici. Kostel přežil a dodnes se v něm dochovaly nástěnné malby z roku 1779. Od února 2006 slouží pražské slovenské řeckokatolické farnosti.

🥚 Velikonoční vajíčko: Ulice, na níž kostel stojí, Spálená, získala své jméno po ničivém požáru z 3. června 1506, který na ní zničil dvacet domů — tento kostel tak už tři století čelí ulici pojmenované po pohromě, zatímco tiše přežívá i své vlastní pohromy.`,

      zh: `勇敢的冒险家，欢迎来到至圣三一堂！这座教堂最初是为专门赎回被掳基督徒的修会而建，后来又在地铁施工中险些被夷为平地，还两度被愤怒的教区居民从关闭边缘拯救回来——这座安静的巴洛克式"幸存者"，其经历远比朴素的外观所暗示的要跌宕起伏得多。

教堂与附属修道院建于1708至1713年间，选址在两栋被拆除的房屋原址上，由奥克塔维安·布罗吉奥（Octavian Broggio）设计，建筑师克里什托夫·迪岑霍费尔（Kryštof Dientzenhofer）与小扬·伊日·艾希鲍尔（Jan Jiří Aichbauer）主持施工。出资人是波希米亚王国的铸币总管扬·伊格纳茨·普茨·冯·阿德勒斯图尔姆（Jan Ignác Putz z Adlersthurmu），建筑归属于三位一体会（Trinitarian Order）——这个修会的具体使命，是筹集赎金解救被掳为奴的基督徒，其中许多人被海盗掳走或被卖到北非，这让"专业人质谈判者"的修道院成了布拉格街头一个颇为特别的邻居。

约瑟夫二世大规模的修道院改革，在1783年解散了三位一体会团体，教堂也随之关闭；但布拉格教区居民强烈抗议，仅仅一年后教堂便重新开放，并接收了当时刚关闭的圣马丁教堂（Kostel sv. Martina ve zdi）的教区事务。它的麻烦并未就此结束：20世纪布拉格地铁建设对建筑结构造成了严重损伤，一度认真讨论过将其拆除。教堂最终幸存下来，至今仍保留着1779年的室内壁画。自2006年2月起，这里成为布拉格斯洛伐克希腊礼天主教团体的教堂。

🥚 彩蛋：教堂所在的斯帕莱纳街（Spálená，意为"被烧毁的"），其名字来自1506年6月3日的一场大火，那场火灾烧毁了街上二十栋房屋——这座教堂三百年来，一直面对着一条以灾难命名的街道，同时也悄悄挺过了属于自己的一场场灾难。`,
    },
  },
  {
    name: 'Prague Castle Riding School',
    slug: 'jizdarna-prazskeho-hradu',
    localizedNames: { cz: 'Jízdárna Pražského hradu', zh: '布拉格城堡马术学校' },
    labels: ['architecture', 'cultural', 'historical'],
    coordinates: { lat: 50.0923734915888, lng: 14.398389365530901 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Prague Castle Riding School! Built so Baroque nobles could show off their horsemanship in suitable grandeur, this hall survived a catastrophic fire, a stint as army storage, and a complete career change — today it exhibits paintings instead of ponies, with considerably less hay.

The current building went up in 1694, replacing a smaller 1572 riding hall, designed by court architect Jean-Baptiste Mathey and built by Jakub Antonín Canevalle for Emperor Leopold I. It stands just across the Deer Moat from the main castle complex, next to the Royal Garden and the Renaissance Belvedere summer palace, and was purpose-built so the nobility could train horses, stage tournaments, and generally show off in front of each other in suitably grand surroundings.

A fire gutted the hall in 1760, forcing a full reconstruction, and later the building was handed over to the military, which used it as storage — a considerable comedown for a hall once dedicated to aristocratic pageantry. In the mid-20th century it was converted for good into an exhibition space, and today, under the Prague Castle Administration, it hosts major art exhibitions in a barrel-vaulted hall that still looks entirely capable of holding a horse if the need ever arose again.

🥚 Easter Egg: The building sits within sight of Golden Lane and Daliborka Tower, meaning a single walk along the Castle's northern edge takes you past a Renaissance dungeon, an alchemist's tower, and a Baroque riding academy — three completely different flavours of "showing off for the emperor" within about two hundred metres of each other.`,

      cz: `Statečný dobrodruhu, vítej v Jízdárně Pražského hradu! Postavena proto, aby se barokní šlechta mohla náležitě honosně předvádět se svými koňmi, tato honosná hala přežila ničivý požár, éru vojenského skladu i úplnou změnu kariéry — dnes v ní visí obrazy místo koní, a sena je podstatně méně.

Současná budova vznikla v roce 1694 jako náhrada za menší jízdárnu z roku 1572, podle návrhu dvorního architekta Jeana-Baptista Matheyho a v provedení stavitele Jakuba Antonína Canevalla, pro císaře Leopolda I. Stojí hned za Jelením příkopem naproti hlavnímu areálu Hradu, vedle Královské zahrady a renesančního letohrádku Belveder, a byla postavena přímo pro potřeby šlechty, aby zde mohla cvičit koně, pořádat turnaje a obecně se před sebou navzájem předvádět v odpovídajícím honosném prostředí.

V roce 1760 halu zničil požár, který si vynutil kompletní přestavbu, a později byla budova zapůjčena armádě, jež ji využívala jako sklad — poměrně nevalný osud pro sál kdysi zasvěcený šlechtické parádě. V polovině 20. století byla natrvalo přeměněna na výstavní prostor a dnes zde Správa Pražského hradu pořádá velké umělecké výstavy v sálu s valenou klenbou, který stále vypadá, že by bez potíží pojal i koně, kdyby to bylo znovu potřeba.

🥚 Velikonoční vajíčko: Budova stojí na dohled od Zlaté uličky a Daliborky, takže jediná procházka podél severního okraje Hradu vás provede kolem renesančního žaláře, alchymistické věže a barokní jezdecké akademie — tři naprosto odlišné podoby "předvádění se před císařem" na ploše necelých dvou set metrů.`,

      zh: `勇敢的冒险家，欢迎来到布拉格城堡马术学校（Jízdárna Pražského hradu）！这座大厅本是为了让巴洛克贵族体面地炫耀自己的马匹而建，却先后经历了一场毁灭性大火、一段沦为军用仓库的岁月，以及一次彻底的"职业转型"——如今这里展出的是绘画而非骏马，干草也少了许多。

现存建筑建于1694年，取代了1572年建成的一座较小的马术厅，由宫廷建筑师让-巴蒂斯特·马泰（Jean-Baptiste Mathey）设计，工匠雅库布·安托宁·卡内瓦莱（Jakub Antonín Canevalle）施工，为皇帝利奥波德一世（Leopold I）建造。建筑就位于鹿壕沟对面、紧邻主城堡建筑群，毗邻皇家花园与文艺复兴风格的贝尔维德尔夏宫（Belveder），当初专为贵族训练马匹、举办马术比武及各类炫耀性活动而设计。

1760年一场大火几乎将大厅烧毁，迫使其进行全面重建；此后建筑一度被出借给军方用作仓库——对于一座曾经专属于贵族排场的大厅来说，这算是相当落魄的一段经历。20世纪中期，这里被彻底改造为展览空间，如今由布拉格城堡管理处运营，在这座至今看起来仍然完全能容纳一匹马的筒形拱顶大厅中，举办各类重要艺术展览。

🥚 彩蛋：这座建筑与黄金巷、达利博尔卡塔（Daliborka）近在咫尺，因此沿着城堡北侧散步一圈，你就能依次路过一座文艺复兴式监狱、一座炼金术塔楼，以及一座巴洛克马术学院——三种截然不同的"向皇帝炫耀"的方式，全部挤在不到两百米的范围内。`,
    },
  },
  {
    name: 'Rosenberg Palace — Institute of Noblewomen',
    slug: 'rozmbersky-palac-ustav-slechticen',
    localizedNames: { cz: 'Rožmberský palác – Ústav šlechtičen', zh: '罗森堡宫——贵族女子学院' },
    labels: ['historical', 'architecture', 'museum'],
    coordinates: { lat: 50.091410502475746, lng: 14.403602298858065 },
    rarity: 'superior',
    xpReward: 30,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Rosenberg Palace, later reborn as the Institute of Noblewomen! One of Prague Castle's quietest corners, this Renaissance palace spent nearly two centuries turning impoverished aristocratic daughters into acceptably genteel ladies — proof that even a castle occasionally needs a finishing school.

The original Renaissance palace was built between 1545 and 1574 for the powerful Rožmberk (Rosenberg) family, on ground cleared by a devastating fire in 1541. In 1600, the last of the line, Petr Vok of Rožmberk, sold it to Emperor Rudolf II, who had it connected to the Royal Palace by a covered wooden corridor so he wouldn't need to go outside to visit.

In the mid-18th century Empress Maria Theresa had the palace radically rebuilt, founding the Institute of Noblewomen there in 1753 — a charitable institution that housed and educated around thirty impoverished aristocratic daughters (minimum age 24, or 18 for orphans) right up until Czechoslovak independence in 1918, after which the Ministry of the Interior took the building over instead. A lengthy restoration ran from 1996 to 2007, and the palace has been open to the public as part of the Castle's tour circuit since April 2010 — a stop plenty of visitors skip entirely after exhausting themselves at St. Vitus Cathedral next door.

🥚 Easter Egg: The Institute's first abbess was Archduchess Maria Anna, Maria Theresa's own daughter, which meant the empress essentially put a member of her own family in charge of quality control for her new finishing school — a fairly on-brand move for a monarch famous for micromanaging practically everything, including her sixteen children's marriages.`,

      cz: `Statečný dobrodruhu, vítej v Rožmberském paláci, později Ústavu šlechtičen! Jeden z klidnějších koutů Pražského hradu, tento renesanční palác strávil téměř dvě staletí proměňováním zchudlých šlechtických dcer v náležitě vybrané dámy — důkaz, že i hrad občas potřebuje ústav pro dokončovací vzdělání.

Původní renesanční palác vznikl v letech 1545–1574 pro mocný rod Rožmberků, na pozemku uvolněném po ničivém požáru v roce 1541. V roce 1600 jej poslední mužský potomek rodu, Petr Vok z Rožmberka, prodal císaři Rudolfovi II., který si jej nechal propojit s Královským palácem krytou dřevěnou chodbou, aby při návštěvě nemusel vycházet ven.

V polovině 18. století nechala císařovna Marie Terezie palác radikálně přestavět a v roce 1753 zde založila Ústav šlechtičen — charitativní instituci, která ubytovávala a vzdělávala kolem třiceti zchudlých šlechtických dcer (minimální věk 24 let, u sirotků 18 let) až do vzniku samostatného Československa v roce 1918, poté budovu převzalo ministerstvo vnitra. V letech 1996–2007 proběhla rozsáhlá rekonstrukce a od dubna 2010 je palác přístupný veřejnosti jako součást prohlídkového okruhu Hradu — zastávka, kterou řada návštěvníků po vyčerpávající prohlídce sousední katedrály sv. Víta úplně vynechá.

🥚 Velikonoční vajíčko: První abatyší ústavu se stala arcivévodkyně Marie Anna, vlastní dcera Marie Terezie — císařovna tak v podstatě pověřila kontrolou kvality svého nového ústavu člena vlastní rodiny, což celkem odpovídá stylu panovnice proslulé mikromanagementem téměř všeho, včetně sňatků svých šestnácti dětí.`,

      zh: `勇敢的冒险家，欢迎来到罗森堡宫，后来改称贵族女子学院！作为布拉格城堡里较为安静的一角，这座文艺复兴宫殿在近两个世纪里，一直致力于把家道中落的贵族之女培养成举止得体的淑女——证明就连城堡，有时也需要一所"淑女礼仪学校"。

最初的文艺复兴风格宫殿建于1545年至1574年间，为势力强大的罗森堡家族（Rožmberk）而建，选址在1541年一场大火之后清理出的空地上。1600年，家族最后一位男丁彼得·沃克·冯·罗森堡（Petr Vok of Rožmberk）将其卖给了鲁道夫二世皇帝，皇帝下令用一条带顶的木质走廊将宫殿与王宫相连，以便自己造访时无需外出。

18世纪中期，玛丽亚·特蕾西亚女皇下令对宫殿进行彻底改建，并于1753年在此创立了贵族女子学院——这是一所慈善机构，收容并教育约三十名家道中落的贵族之女（最低入学年龄24岁，孤儿则为18岁），一直运作到1918年捷克斯洛伐克独立，此后建筑改由内政部接管。1996年至2007年间，这里经历了一次漫长的修复工程；自2010年4月起，宫殿作为城堡游览路线的一部分对公众开放——不少游客在隔壁圣维特大教堂逛得筋疲力尽后，往往会直接跳过这一站。

🥚 彩蛋：学院的第一任院长是玛丽亚·特蕾西亚女皇的亲生女儿——大公女玛丽亚·安娜（Maria Anna），也就是说，女皇实际上是让自家人来把关这所新"淑女学校"的质量——对于这位以事无巨细都要插手、甚至连十六个子女的婚事都要亲自安排而闻名的女皇来说，这一操作相当符合她的一贯风格。`,
    },
  },
  {
    name: 'Colloredo-Mansfeld Palace — Prague City Gallery',
    slug: 'colloredo-mansfeldsky-palac',
    localizedNames: { cz: 'Colloredo-Mansfeldský palác – Galerie hlavního města Prahy', zh: '科洛雷多-曼斯费尔德宫——布拉格市立美术馆' },
    labels: ['cultural', 'architecture', 'historical'],
    coordinates: { lat: 50.08596667057249, lng: 14.41439986032931 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Colloredo-Mansfeld Palace! This Baroque-Rococo showpiece on Karlova Street once hosted the last desperate council of a deposed "Winter King", whose host was beheaded for it soon after — and today it displays contemporary art instead of doomed monarchs and their advisors.

The site originally held a Romanesque, then Gothic house, rebuilt in Late Renaissance style around 1600. On the night of 8–9 November 1620, right after the Bohemian defeat at the Battle of White Mountain, the deposed "Winter King" Frederick of the Palatinate held his very last council of war here — the house then belonged to Count Jáchym Ondřej Šlik, who was among the twenty-seven Bohemian nobles executed on Old Town Square the following year for their part in the revolt.

The palace gained its present grand form over the following century, its design likely by Giovanni Battista Alliprandi, with a final Late Baroque phase completed after 1735 under architect Franz Ignatz Pree for owner Paul Vincent von Mansfeld-Fondi. In 1848, Princess Vilemína Josefína of Colloredo-Mansfeld acquired it as part of her dowry and had the façade reworked in Second Rococo style, with interiors updated to Viennese fashion in 1853. Since 2010 it has belonged to the Prague City Gallery, which opened its third-floor halls to contemporary art exhibitions in 2013.

🥚 Easter Egg: The twenty-seven nobles executed in 1621 — including this palace's former owner — are commemorated with twenty-seven white crosses set into the paving of Old Town Square, just a few minutes' walk from the palace's front door, meaning you can trace the entire arc of this particular tragedy from council chamber to execution site in under ten minutes on foot.`,

      cz: `Statečný dobrodruhu, vítej v Colloredo-Mansfeldském paláci! Tento barokně-rokokový skvost na Karlově ulici byl svědkem poslední zoufalé válečné rady sesazeného "zimního krále", jehož hostitel byl krátce nato za tuto pohostinnost popraven — a dnes tu místo odsouzených panovníků a jejich rádců visí současné umění.

Na místě paláce stál původně románský, později gotický dům, přestavěný kolem roku 1600 v pozdně renesančním slohu. V noci z 8. na 9. listopadu 1620, hned po porážce českých stavů v bitvě na Bílé hoře, se zde konala poslední válečná rada sesazeného "zimního krále" Fridricha Falckého — dům tehdy patřil hraběti Jáchymu Ondřeji Šlikovi, který byl následující rok mezi sedmadvaceti českými pány popravenými na Staroměstském náměstí za účast na povstání.

Palác získal svou dnešní honosnou podobu v průběhu následujícího století, pravděpodobně podle návrhu Giovanniho Battisty Alliprandiho, s pozdně barokní úpravou dokončenou po roce 1735 architektem Franzem Ignatzem Preem pro majitele Pavla Vincence z Mansfeldu-Fondi. V roce 1848 palác získala jako věno kněžna Vilemína Josefína Colloredo-Mansfeldová a nechala fasádu přestavět ve stylu druhého rokoka, interiéry pak byly v roce 1853 upraveny podle vídeňské módy. Od roku 2010 patří paláci Galerie hlavního města Prahy, která v roce 2013 otevřela sály ve třetím patře výstavám současného umění.

🥚 Velikonoční vajíčko: Sedmadvacet pánů popravených v roce 1621 — včetně bývalého majitele tohoto paláce — připomíná sedmadvacet bílých křížů zasazených do dlažby Staroměstského náměstí, jen pár minut chůze od vchodu do paláce, takže celý oblouk této konkrétní tragédie — od válečné rady až po popraviště — lze pěšky projít za necelých deset minut.`,

      zh: `勇敢的冒险家，欢迎来到科洛雷多-曼斯费尔德宫！这座位于卡罗瓦街（Karlova）的巴洛克-洛可可风格杰作，曾见证被废黜的"冬王"召开的最后一次绝望军事会议——而这场"款待"的主人不久后便为此付出了人头落地的代价，如今这里展出的是当代艺术，而非注定覆灭的君王与谋臣。

这座宫殿的原址最初是一栋罗马式、后改建为哥特式的房屋，约1600年前后又被改建为晚期文艺复兴风格。1620年11月8日至9日夜间，就在波希米亚军队在白山战役中战败之后，被废黜的"冬王"腓特烈五世（Frederick of the Palatinate）在此召开了他最后一次军事会议——当时这栋房子的主人是雅希姆·昂德热·什利克伯爵（Jáchym Ondřej Šlik），他在次年因参与这场起义，与另外二十六位波希米亚贵族一同在老城广场被处决。

此后的一个世纪里，宫殿逐渐形成如今的宏伟规模，设计者很可能是乔瓦尼·巴蒂斯塔·阿利普兰迪（Giovanni Battista Alliprandi），最后一次晚期巴洛克改建由建筑师弗朗茨·伊格纳茨·普雷（Franz Ignatz Pree）于1735年后为业主保罗·文森特·冯·曼斯费尔德-丰迪（Paul Vincent von Mansfeld-Fondi）完成。1848年，科洛雷多-曼斯费尔德家族的维莱米娜·约瑟菲娜公主（Vilemína Josefína）将其作为嫁妆继承，并将外立面改建为新洛可可风格，室内装饰也于1853年按照维也纳流行样式翻新。自2010年起，宫殿归属布拉格市立美术馆，该馆于2013年将三楼展厅向当代艺术展览开放。

🥚 彩蛋：1621年被处决的二十七位贵族——其中就包括这座宫殿曾经的主人——如今被镶嵌在老城广场地面上的二十七个白色十字标记所纪念，那里距离宫殿大门只有几分钟步行路程，也就是说，你可以在不到十分钟的步行时间里，走完这段悲剧从"军事会议室"到"刑场"的完整轨迹。`,
    },
  },
  {
    name: 'Hlahol Choral Society Building',
    slug: 'zpevacky-spolek-hlahol',
    localizedNames: { cz: 'Spolkový dům Hlahol', zh: '赫拉霍尔合唱协会大楼' },
    labels: ['cultural', 'architecture', 'historical'],
    coordinates: { lat: 50.07797025324643, lng: 14.41443574726674 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Hlahol Choral Society building! This Art Nouveau riverside clubhouse was built for one purpose only — so Czech patriots could sing at each other in beautifully arranged four-part harmony — and, more than a century later, they still gather here to do exactly that.

Hlahol — an Old Church Slavonic word roughly meaning "resounding sound" — is one of Prague's oldest choral societies, founded in 1861 during the Czech National Revival, a period when choral singing doubled as a quietly patriotic act under Habsburg rule: singing in Czech, in harmony, in public, was itself a small act of national self-assertion.

After decades of renting rehearsal space around the city, the growing society finally bought its own riverside plot on the Vltava embankment, directly opposite the Mánes building, in 1903, and construction of a purpose-built clubhouse ran through 1904–1905. Building work began under builder Čeněk Gregor to initial plans by committee member František Schlaffer, before architect Josef Fanta — also responsible for Prague's main railway station — took over and completed the design as one of the era's few genuinely pure examples of Art Nouveau architecture. Painter Karel Ludvík Klusáček, sculptor Josef Pekárek, painter Alfons Mucha, and architect Karel Mottl all contributed decorative work, turning the façade into something close to a group portrait of Czech Art Nouveau talent. It has been a protected cultural monument since 1964.

🥚 Easter Egg: Despite sitting directly across the river from the crowds around the National Theatre, most tourists walk straight past this one without a second glance — and Hlahol, as a society, is still active today, holding rehearsals and concerts in the very hall built for it more than a century ago, which makes it one of the few Prague landmarks that never actually stopped doing the thing it was built for.`,

      cz: `Statečný dobrodruhu, vítej v domě Zpěváckého spolku Hlahol! Tento secesní spolkový dům na břehu Vltavy byl postaven kvůli jedinému účelu — aby si čeští vlastenci mohli krásně sladěně zazpívat vícehlasně jeden druhému — a víc než sto let později se tu k tomu stále scházejí.

Hlahol — staroslověnské slovo přibližně znamenající "zvučný hlas" — patří mezi nejstarší pěvecké spolky v Praze, založený v roce 1861 v době národního obrození, kdy sborový zpěv fungoval jako tichý, ale výmluvný projev vlastenectví za habsburské nadvlády: zpívat česky, vícehlasně a veřejně bylo samo o sobě malým aktem národního sebeuvědomění.

Po desetiletích, kdy si spolek pronajímal zkušební prostory po celém městě, rostoucí Hlahol konečně v roce 1903 koupil vlastní pozemek na nábřeží Vltavy, přímo naproti Mánesu, a stavba účelového spolkového domu probíhala v letech 1904–1905. Práce zahájil stavitel Čeněk Gregor podle prvotních plánů výborového člena Františka Schlaffera, než návrh převzal a dokončil architekt Josef Fanta — autor i pražského Hlavního nádraží — jako jednu z mála skutečně čistých ukázek secesní architektury své doby. Na výzdobě se podíleli malíř Karel Ludvík Klusáček, sochař Josef Pekárek, malíř Alfons Mucha a architekt Karel Mottl, díky čemuž se fasáda blíží skupinovému portrétu české secesní tvorby. Od roku 1964 je budova chráněnou kulturní památkou.

🥚 Velikonoční vajíčko: Ačkoliv budova stojí přímo přes řeku naproti davům turistů kolem Národního divadla, většina návštěvníků kolem ní projde bez druhého pohledu — a Hlahol jako spolek je dodnes aktivní, zkouší a koncertuje ve stejném sále, který mu byl postaven před více než sto lety, což z něj dělá jednu z mála pražských památek, které nikdy nepřestaly dělat přesně to, k čemu byly postaveny.`,

      zh: `勇敢的冒险家，欢迎来到赫拉霍尔合唱协会大楼！这座新艺术风格的河畔会所，建造的目的只有一个——让捷克爱国者们能够以优美的多声部合唱彼此歌唱——一百多年后的今天，他们依然在这里为此而聚会。

"Hlahol"是古教会斯拉夫语，大意为"回响的声音"，是布拉格历史最悠久的合唱团体之一，创立于1861年捷克民族复兴运动期间。在哈布斯堡王朝统治下，合唱本身就是一种低调却有力的爱国表达方式——用捷克语、以多声部、在公开场合歌唱，本身就是一种小小的民族自我宣示。

在城中辗转租用排练场地数十年后，日渐壮大的合唱协会终于在1903年买下了伏尔塔瓦河畔、正对马内斯馆（Mánes）的一块地皮，专属会所的建造工程于1904至1905年间进行。工程最初由建造商切涅克·格雷戈尔（Čeněk Gregor）依照协会委员弗兰季谢克·施拉费尔（František Schlaffer）的初步方案动工，其后由建筑师约瑟夫·凡塔（Josef Fanta，布拉格中央车站的设计者）接手完成，最终呈现出那个时代少有的、真正纯粹的新艺术风格建筑之一。画家卡雷尔·卢德维克·克卢萨切克（Karel Ludvík Klusáček）、雕塑家约瑟夫·佩卡雷克（Josef Pekárek）、画家阿尔丰斯·穆夏（Alfons Mucha）与建筑师卡雷尔·莫特尔（Karel Mottl）都参与了装饰设计，让整座建筑的立面几乎成了一幅捷克新艺术人才的"集体肖像"。自1964年起，该建筑被列为受保护的文化古迹。

🥚 彩蛋：尽管这座建筑就坐落在河对岸、紧邻国家剧院周围熙攘的游客人群，大多数游客却对它视而不见、径直走过——而赫拉霍尔作为一个合唱团体至今仍然活跃，依然在这座为它建造的、已有百余年历史的大厅里排练与演出，这也让它成为布拉格少数几个从未停止实现其建造初衷的地标之一。`,
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
  {
    name: 'Radost Building',
    slug: 'dum-radost',
    localizedNames: { cz: 'Dům Radost', zh: '拉多斯特之家' },
    labels: ['modern', 'architecture', 'historical', 'cafe'],
    coordinates: { lat: 50.08418106214449, lng: 14.442571568859913 },
    rarity: 'superior',
    xpReward: 30,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/D%C5%AFm_Radost',
    description: {
      en: `Brave adventurer, welcome to the Radost Building (Dům Radost)! This Žižkov skyscraper spent seventy years as a grim communist trade-union headquarters nicknamed "the tilery," and only got its cheerful new name in 2019, once someone finally remembered to put a rooftop bar on top of it.

Built in 1932–1934 by young architects Karel Honzík and Josef Havlíček on the site of the old Prague Municipal Gas Plant, this cruciform 52-metre tower — inspired by Le Corbusier's cross-shaped floor plans — was, for a while, the tallest office building in the country: Prague's first real skyscraper. Its facade was clad edge to edge in pale ceramic tiles from the RAKO factory, which is exactly why Praguers have never called it by its official name and instead nicknamed it "kachlíkárna" — roughly, "the tile factory."

The building's own biography took a sharply less glamorous turn after 1948. From 1952 the Communist Party's Central Council of Trade Unions began absorbing it floor by floor, formally taking full ownership in 1957 and running it as the grey administrative engine room of state-controlled labour unions for the next four decades. It has been a protected cultural monument since 1964 — a rare case of a building being legally preserved specifically because of an era most Czechs would rather forget. Since new owners took over in 2019, it has been reborn under the name Radost Building, now packed with offices, apartments, a theatre, a cinema, a café, and a rooftop observation terrace open to the public.

🥚 Easter Egg: The rooftop terrace, Střecha Radost, sits exactly where trade-union bureaucrats once had their offices, and it now ranks among the best sunset views over central Prague — meaning the single greyest building of the communist administrative apparatus has, improbably, become one of the city's more delightful hangout spots. Somewhere, an ex-union official is turning in their filing cabinet.`,

      cz: `Statečný dobrodruhu, vítej v Domě Radost — žižkovském mrakodrapu, který sedmdesát let sloužil jako ponuré sídlo komunistických odborů s přezdívkou "kachlíkárna" a svého veselého jména se dočkal až v roce 2019, kdy si někdo konečně vzpomněl dát mu na střechu bar.

Stavba z let 1932–1934 od mladých architektů Karla Honzíka a Josefa Havlíčka vyrostla na místě bývalé Pražské obecní plynárny. Křížový půdorys inspirovaný Le Corbusierem a výška 52 metrů z ní na čas udělaly nejvyšší kancelářskou budovu v zemi — první opravdový pražský mrakodrap. Fasáda byla obložena světlými keramickými deskami z továrny RAKO, a právě proto jí Pražané odjakživa říkají spíš "kachlíkárna" než jejím oficiálním jménem.

Po roce 1948 se osud budovy prudce změnil k horšímu. Od roku 1952 ji postupně přebírala Ústřední rada odborů, v roce 1957 ji získala natrvalo a další čtyři desetiletí v ní fungovalo šedivé administrativní srdce státem řízených odborů. Od roku 1964 je chráněnou kulturní památkou — vzácný případ budovy, která je zákonem chráněná právě kvůli éře, na kterou by většina Čechů nejraději zapomněla. Od roku 2019, kdy dům získal nového majitele, ožil pod jménem Dům Radost a dnes v něm najdete kanceláře, byty, divadlo, kino, kavárnu a veřejně přístupnou vyhlídkovou terasu na střeše.

🥚 Velikonoční vajíčko: Vyhlídková terasa Střecha Radost stojí přesně tam, kde kdysi sídlili odboroví byrokrati, a dnes patří mezi nejlepší místa ve městě na sledování západu slunce nad centrem Prahy — nejšedivější budova komunistického administrativního aparátu se tak nečekaně proměnila v jedno z nejpříjemnějších míst k posezení ve městě. Někde se jistě nějaký bývalý odborový funkcionář obrací ve své kartotéce.`,

      zh: `勇敢的冒险家，欢迎来到拉多斯特之家（Dům Radost）——这座日什科夫的摩天大楼曾在七十年里一直是阴沉的共产党工会总部，被戏称为"瓷砖楼"，直到2019年才终于获得了这个欢快的新名字，因为终于有人想起该在楼顶开一间酒吧了。

这栋建筑建于1932至1934年，由年轻建筑师卡雷尔·洪济克（Karel Honzík）和约瑟夫·哈夫利切克（Josef Havlíček）设计，选址就在旧布拉格市立煤气厂的原址上。它高52米，采用受勒·柯布西耶启发的十字形平面布局，一度是全国最高的办公楼——布拉格真正意义上的第一座摩天大楼。外立面通体贴满了RAKO工厂出产的浅色陶瓷砖，也正因如此，布拉格人几乎从不叫它的正式名字，而是直接称呼它"瓷砖楼"（kachlíkárna）。

1948年之后，这栋建筑的命运急转直下。从1952年起，捷克斯洛伐克中央工会理事会开始逐层接管这栋大楼，并于1957年正式将其全部收归己有，此后近四十年里，它一直是国家管控下工会体系灰扑扑的行政中枢。自1964年起，它被列为受保护的文化古迹——这是一个相当罕见的案例：一栋建筑之所以受到法律保护，恰恰是因为它承载着大多数捷克人宁愿遗忘的那段历史。2019年，大楼迎来新的所有者，并以"拉多斯特之家"（意为"喜悦之家"）的新名字重获新生，如今这里汇聚了办公室、公寓、剧院、电影院、咖啡馆，还有一座向公众开放的屋顶观景平台。

🥚 彩蛋：名为"Střecha Radost"的屋顶观景台，正好坐落在当年工会官僚们办公室的位置上，如今却是欣赏布拉格市中心日落的绝佳去处之一——共产主义行政机器里最灰暗乏味的一栋建筑，竟意外变成了这座城市最讨人喜欢的休闲角落之一。某位昔日的工会干部，恐怕正在自己当年的档案柜里辗转难安。`,
    },
  },
  {
    name: 'Rotunda of St. Longinus',
    slug: 'rotunda-sv-longina',
    localizedNames: { cz: 'Rotunda sv. Longina', zh: '圣朗基努斯圆形教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.07651856385791, lng: 14.425631929011264 },
    rarity: 'superior',
    xpReward: 30,
    wikipediaUrl: "https://en.wikipedia.org/wiki/St._Longin's_Rotunda",
    description: {
      en: `Brave adventurer, welcome to the Rotunda of St. Longinus (Rotunda sv. Longina)! This tiny Romanesque roundhouse started out honouring St. Stephen, then got quietly rebranded to a completely different saint in the 1350s — because Emperor Charles IV had just acquired a very trendy relic and everyone in Prague suddenly wanted a piece of the hype.

One of only four Romanesque rotundas still standing in Prague, this one was built in the early twelfth century on Na Rybníčku street in what is now Prague 2, back when the area was an independent settlement called Rybníček, first recorded in the year 993. It served as the settlement's parish church, dedicated to St. Stephen. Everything changed after Charles IV founded the New Town in the mid-14th century: a much larger St. Stephen's Church went up right next door to handle the growing congregation, so the original rotunda needed a new identity entirely. Charles had recently acquired the Holy Lance — the relic said to have pierced Christ's side at the Crucifixion — which instantly made its wielder, the Roman centurion Longinus, the hottest saint in Bohemia. The little rotunda was rededicated in his honour, a Gothic window was cut into its apse, and by the 17th and 18th centuries it had picked up a Baroque lantern on top and a wooden altar retable balanced on its original Romanesque stone altar table.

Its luck nearly ran out twice. In 1783, Emperor Joseph II's sweeping church closures shut it down and turned it into a storeroom. Then in the mid-19th century, city planners wanted to bulldoze it to make way for the new Na Rybníčku street — and it was saved only because the Society of the National Museum, led by historian František Palacký, intervened on its behalf. It reopened in 1844 and was thoroughly restored between 1929 and 1934.

🥚 Easter Egg: The rebranding-by-relic story is a genuinely underrated piece of medieval PR strategy: Longinus wasn't even a well-known saint in Bohemia before Charles IV went shopping for holy hardware — the emperor collected relics the way modern billionaires collect art, and a soldier who barely gets a line in the Gospel of John ended up with his own dedicated rotunda purely because the boss brought home a really good souvenir from his travels.`,

      cz: `Statečný dobrodruhu, vítej v Rotundě sv. Longina! Tato drobná románská stavbička byla původně zasvěcena sv. Štěpánovi, ale ve 14. století dostala tiše úplně nového patrona — protože císař Karel IV. si právě pořídil velmi módní relikvii a celá Praha najednou chtěla mít podíl na té slávě.

Jde o jednu ze čtyř dochovaných románských rotund v Praze, postavenou na počátku 12. století v ulici Na Rybníčku na dnešním Novém Městě — tehdy tu ještě stávala samostatná osada Rybníček, poprvé zmíněná už roku 993. Rotunda sloužila jako farní kostelík osady a byla zasvěcena sv. Štěpánovi. Vše se změnilo po založení Nového Města Karlem IV. v polovině 14. století: hned vedle vyrostl mnohem větší kostel sv. Štěpána pro rostoucí farnost, a tak si původní rotunda musela najít úplně novou identitu. Karel IV. právě získal Svaté kopí — relikvii, jíž měl být proboden Kristův bok na kříži — což z jejího údajného držitele, římského setníka Longina, okamžitě udělalo nejžádanějšího světce v Čechách. Rotunda byla přesvěcena na jeho počest, do apsidy jí prolomili gotické okno a v 17. a 18. století přibyla barokní lucerna na vrcholu i dřevěný oltářní retábl posazený na původní románské kamenné meze.

Štěstí jí dvakrát skoro došlo. V roce 1783 ji zavřel dekret Josefa II. o rušení kostelů a proměnil ji ve sklad. V polovině 19. století ji pak plánovali zbourat kvůli stavbě nové ulice Na Rybníčku — zachránila ji jen intervence Muzejní společnosti vedené historikem Františkem Palackým. Znovu byla otevřena v roce 1844 a důkladně opravena v letech 1929–1934.

🥚 Velikonoční vajíčko: Toto přesvěcení na základě relikvie je podceňovaný kousek středověkého PR: Longinus nebyl v Čechách před nákupní horečkou Karla IV. skoro vůbec známý světec — císař sbíral relikvie podobně, jako dnešní miliardáři sbírají umění, a voják, který se v Janově evangeliu mihne sotva na jeden řádek, tak získal vlastní rotundu jen proto, že si šéf z cest přivezl opravdu povedený suvenýr.`,

      zh: `勇敢的冒险家，欢迎来到圣朗基努斯圆形教堂（Rotunda sv. Longina）！这座小小的罗曼式圆形教堂最初供奉的是圣斯德望，但到了14世纪，它悄悄换了一位完全不同的主保圣人——因为查理四世皇帝刚刚"入手"了一件非常时髦的圣物，布拉格人也都想跟着沾点光。

这是布拉格现存四座罗曼式圆形教堂之一，建于12世纪初，位于如今布拉格二区的"水塘街"（Na Rybníčku）——当时这里还是一个独立的小聚落"Rybníček"，早在公元993年就已见诸文献记载。圆形教堂最初是这个聚落的堂区教堂，供奉圣斯德望。查理四世在14世纪中叶建立布拉格新城后，一切都变了：紧挨着它，一座规模大得多的新圣斯德望教堂拔地而起，用来容纳日益增多的信众，于是这座老圆形教堂不得不重新寻找自己的身份。恰逢查理四世刚刚获得了"圣矛"——传说中曾刺穿耶稣肋旁的那件圣物——这立刻让圣矛的"持有者"、罗马百夫长朗基努斯，成为了波希米亚最炙手可热的圣人。这座圆形教堂随即改奉他为主保圣人，后堂被凿开一扇哥特式窗户，到17、18世纪，顶上又添了一座巴洛克风格的灯笼塔，原本的罗曼式石制祭坛桌上也摆上了一座木质祭坛屏。

它的好运曾两度几乎耗尽。1783年，约瑟夫二世大规模关闭教堂的法令让它被迫关闭，沦为仓库。到了19世纪中叶，市政规划者又打算为修建新的"水塘街"而将它拆除——多亏国家博物馆学会在历史学家弗朗蒂谢克·帕拉茨基（František Palacký）的带领下出面干预，它才幸免于难。教堂于1844年重新开放，并在1929至1934年间经过彻底修缮。

🥚 彩蛋：这次"因圣物而改朝换代"的故事，堪称一次被严重低估的中世纪公关操作：在查理四世开始"血拼"圣物之前，朗基努斯在波希米亚几乎默默无闻——这位皇帝收集圣物的热情，堪比今天的亿万富翁收藏艺术品，而《约翰福音》里几乎只被提了一句话的无名小兵，就这样单纯因为"老板"从外地带回一件绝佳纪念品，而拥有了属于自己的一整座圆形教堂。`,
    },
  },
  {
    name: 'Rotunda of St. Martin',
    slug: 'rotunda-sv-martina',
    localizedNames: { cz: 'Rotunda svatého Martina', zh: '圣马丁圆形教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.06365060030585, lng: 14.42155430763051 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Rotunda_svat%C3%A9ho_Martina_(Vy%C5%A1ehrad)',
    description: {
      en: `Brave adventurer, welcome to the Rotunda of St. Martin (Rotunda sv. Martina)! This is officially the oldest building still standing in Prague — nearly a thousand years old — and it has survived fire, war, gunpowder storage, and two separate attempts by different emperors to get rid of it entirely.

Built at the very end of the 11th century under Duke Vratislav II — the first Bohemian ruler to be crowned king — this small Romanesque rotunda predates Vyšehrad's more famous basilica and just about everything else on the hill. It was already showing its age by 1528, when a fire damaged it, and things got considerably stranger during the Thirty Years' War, when the sacred building was repurposed as a gunpowder magazine — not the safest storage decision anyone has ever made, but the rotunda survived it. A 1719 renovation swapped the old Romanesque entrance for a Baroque portal.

The 18th century was unkind twice over. Prussian troops damaged it during their siege of Prague in 1757, and Emperor Joseph II — mid-way through his enthusiastic campaign of closing "unnecessary" churches across the empire — deconsecrated it outright. In 1841 it was slated for demolition to clear space for a new road, and was only spared thanks to the direct intervention of Count Karel Chotek. The Vyšehrad Chapter finally bought the building outright in 1875 for the price of 500 guilders, then had it carefully restored to its Romanesque appearance by architect Antonín Baum. It remains theirs today, and occasional Mass is still held inside.

🥚 Easter Egg: Somewhere in the building's résumé is the detail that a nearly thousand-year-old sacred space spent part of the Thirty Years' War stacked with barrels of gunpowder — meaning Prague's oldest surviving building briefly doubled as one of its most flammable. It survived that, a fire, a Prussian siege, a bureaucratic deconsecration, and a scheduled demolition, which makes it one of the most improbable survivors in the entire city.`,

      cz: `Statečný dobrodruhu, vítej v Rotundě sv. Martina! Jde oficiálně o nejstarší dochovanou stavbu v Praze — je jí skoro tisíc let — a přežila požár, válku, sklad střelného prachu i dva samostatné pokusy různých panovníků se jí úplně zbavit.

Postavena byla na samém konci 11. století za vlády knížete Vratislava II., prvního českého panovníka korunovaného králem, a je tak starší než slavnější vyšehradská bazilika i téměř vše ostatní na kopci. Už v roce 1528 ji poznamenal požár, a ještě podivnější osud ji potkal za třicetileté války, kdy posvátná stavba sloužila jako sklad střelného prachu — rozhodně ne nejbezpečnější volba skladování, kterou kdy kdo učinil, ale rotunda to přežila. Při přestavbě roku 1719 nahradil původní románský vstup barokní portál.

18. století k ní bylo nemilosrdné hned dvakrát. V roce 1757 ji poškodilo pruské vojsko během obléhání Prahy, a císař Josef II. ji uprostřed svého nadšeného tažení za rušení "zbytečných" kostelů po celé říši rovnou odsvětil. V roce 1841 měla ustoupit nové silnici a čekala ji demolice — zachránil ji jedině přímý zásah hraběte Karla Chotka. Vyšehradská kapitula budovu nakonec v roce 1875 odkoupila za 500 zlatých a nechala ji citlivě zrenovovat do románské podoby architektem Antonínem Baumem. Dodnes patří kapitule a příležitostně se v ní slouží mše.

🥚 Velikonoční vajíčko: Ve stručném životopise budovy je i detail, že téměř tisíc let starý posvátný prostor strávil část třicetileté války obložený sudy se střelným prachem — nejstarší dochovaná pražská stavba tak na čas byla i jednou z těch nejhořlavějších. Přežila to, požár, pruské obléhání, byrokratické odsvěcení i naplánovanou demolici, což z ní dělá jednoho z nejnepravděpodobnějších přeživších v celém městě.`,

      zh: `勇敢的冒险家，欢迎来到圣马丁圆形教堂（Rotunda sv. Martina）！它是布拉格现存最古老的建筑——将近一千年历史——并且先后挺过了火灾、战争、火药仓库的岁月，还两次被不同的皇帝下令想要彻底铲除它。

这座小小的罗曼式圆形教堂建于11世纪末，由弗拉迪斯拉夫二世公爵（Vratislav II，波希米亚第一位加冕为国王的统治者）下令建造，比更负盛名的维谢赫拉德大殿以及山上几乎所有其他建筑都要古老。早在1528年，一场火灾就已让它元气大伤；而在三十年战争期间，它的命运变得更加离奇——这座神圣建筑一度被征用为火药库，绝对算不上什么明智的储存选择，但圆形教堂还是撑了过来。1719年的一次翻修中，原本的罗曼式入口被替换成了巴洛克式门廊。

18世纪对它格外不友善，而且是接连两次。1757年，普鲁士军队在围攻布拉格期间将其损毁；随后，约瑟夫二世皇帝在其雄心勃勃地关闭全国"多余"教堂的行动中，直接将其废止圣职。1841年，它险些被拆除以为新道路让路，多亏卡雷尔·霍特克伯爵（Karel Chotek）的直接干预才幸免于难。维谢赫拉德教士团最终在1875年以500古尔登的价格将其买下，并委托建筑师安东宁·鲍姆（Antonín Baum）精心修复成罗曼式原貌。如今它仍归教士团所有，偶尔还会在此举行弥撒。

🥚 彩蛋：这栋建筑的履历里藏着这样一个细节：一处近千年历史的神圣空间，曾在三十年战争期间的一段时间里被堆满火药桶——布拉格现存最古老的建筑，一度也是全城最易燃的建筑之一。它挺过了这一切，还有火灾、普鲁士围城、官僚式的废止圣职，以及一次已经排上日程的拆除计划，堪称全城最不可思议的"幸存者"之一。`,
    },
  },
  {
    name: 'Chapel of Our Lady of the Ramparts',
    slug: 'kaple-panny-marie-sancovske',
    localizedNames: { cz: 'Kaple Panny Marie Šancovské', zh: '壁垒圣母小教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.06421577207715, lng: 14.421649973132942 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Kaple_Panny_Marie_Na_hradb%C3%A1ch',
    description: {
      en: `Brave adventurer, welcome to the Chapel of Our Lady of the Ramparts (Kaple Panny Marie Šancovské)! This pocket-sized Vyšehrad chapel is named after a Madonna statue carved by an anonymous stonemason's apprentice in 1725 — proof that you don't need a famous sculptor to end up with your own miracle-working icon.

The chapel takes its name from a statue of the Virgin Mary carved in 1725 by a journeyman mason named Michal Hoch, originally housed in the nearby Church of the Beheading of St. John the Baptist, which has since vanished entirely. The statue developed a reputation as miraculous and became known as the Virgin Mary Šancovská — "of the ramparts," a nod to the Vyšehrad fortification walls surrounding it. The current chapel was built for her in 1748 by the Vyšehrad canon and dean Jan Tomáš Berghauer, in the Baroque style still visible today, complete with a gilded "AVE MARIA" inscription above the entrance and an octagonal lantern topped with a copper dome.

Like nearly every small chapel in the Habsburg lands, it ran straight into Joseph II's church closures: shut down in 1784 and seized for military use, fitting neatly with its location inside an active fortress. It sat in slow decline for almost a century until the Vyšehrad Chapter bought it back in 1882 and rebuilt it in the Neo-Baroque style it wears today. It is now a protected national cultural monument.

🥚 Easter Egg: Look closely at the dome and you'll find one of Prague's stranger decorative combinations: a gilded cross, held up by an eagle carrying a scepter, standing next to a two-tailed lion — Bohemia's own heraldic beast casually sharing rooftop space with an entirely different set of symbols. Quite a lot of ornamentation for a chapel whose original claim to fame was a statue carved by someone whose name history barely bothered to record.`,

      cz: `Statečný dobrodruhu, vítej v Kapli Panny Marie Šancovské! Tato kapsa velikosti kapličky na Vyšehradě nese jméno po soše Panny Marie, kterou v roce 1725 vytesal bezejmenný tovaryš zednický — důkaz, že k vlastní zázračné soše nepotřebujete slavného sochaře.

Kaple nese jméno po soše Panny Marie z roku 1725, dílu tovaryše Michala Hocha, původně umístěné v nedalekém kostele Stětí sv. Jana Křtitele, který mezitím zcela zanikl. Socha si vysloužila pověst zázračné a začalo se jí říkat Panna Marie Šancovská — podle šancí, tedy vyšehradských opevnění, která ji obklopovala. Současnou kapli pro ni nechal v roce 1748 postavit vyšehradský kanovník a děkan Jan Tomáš Berghauer v barokním slohu, který je patrný dodnes, včetně pozlaceného nápisu "AVE MARIA" nad vchodem a osmiboké lucerny s měděnou bání.

Stejně jako téměř každá menší kaple v habsburských zemích narazila i tahle na rušení kostelů Josefem II.: v roce 1784 byla uzavřena a zabrána pro vojenské účely, což se vzhledem k umístění uvnitř aktivní pevnosti docela hodilo. Téměř sto let pak pomalu chátrala, než ji v roce 1882 odkoupila zpět Vyšehradská kapitula a přestavěla do novobarokní podoby, kterou nosí dodnes. Dnes je chráněnou národní kulturní památkou.

🥚 Velikonoční vajíčko: Podívejte se pozorně na kopuli a najdete jednu z podivnějších dekorativních kombinací v Praze: pozlacený kříž, který drží orel se žezlem, stojící vedle dvouocasého lva — český heraldický šelma tu nenuceně sdílí střechu s úplně jinou sadou symbolů. Poměrně hodně výzdoby na kapli, jejíž původní sláva stála na soše vytesané někým, jehož jméno historie sotva zaznamenala.`,

      zh: `勇敢的冒险家，欢迎来到壁垒圣母小教堂（Kaple Panny Marie Šancovské）！这座维谢赫拉德内的袖珍小教堂，因一尊1725年由一位无名石匠学徒雕刻的圣母像而得名——证明你根本不需要著名雕塑家，也能拥有属于自己的显灵圣像。

小教堂的名字来自一尊1725年雕刻的圣母像，作者是一位名叫米哈尔·霍赫（Michal Hoch）的石匠学徒，圣像最初供奉在附近的"施洗约翰斩首堂"内——那座教堂如今已完全消失。这尊圣像后来被认为能显灵，人们称之为"壁垒圣母"（Šancovská），得名于环绕它的维谢赫拉德城防工事"šance"。现在这座小教堂由维谢赫拉德教士兼总铎扬·托马什·贝格豪尔（Jan Tomáš Berghauer）于1748年为她而建，至今仍保留着当时的巴洛克风格，入口上方镀金的"AVE MARIA"字样和顶部带铜穹顶的八角形灯笼塔都完好留存。

和哈布斯堡治下几乎所有小教堂一样，它也没能逃过约瑟夫二世的教堂关闭令：1784年被关闭，并被军方征用——考虑到它就位于一座仍在使用的要塞内部，这倒也算合乎逻辑。此后近一个世纪，它一直缓慢破败，直到1882年被维谢赫拉德教士团买回，并按照今天所见的新巴洛克风格重建。如今它是受保护的国家文化古迹。

🥚 彩蛋：仔细看看穹顶，你会发现布拉格最奇特的装饰组合之一：一只叼着权杖的鹰托举着一枚镀金十字架，旁边站着一头双尾狮——波希米亚自己的纹章猛兽，就这样随意地与另一套完全不同的象征符号共享屋顶空间。对于一座最初的名气仅仅来自一尊出自无名学徒之手的圣像的小教堂来说，这装饰未免也太隆重了一点。`,
    },
  },
  {
    name: "St. Charles Borromeo's Home",
    slug: 'domov-sv-karla-boromejskeho',
    localizedNames: { cz: 'Domov svatého Karla Boromejského', zh: '圣嘉禄·博罗梅奥之家' },
    labels: ['historical', 'architecture', 'hidden-gem'],
    coordinates: { lat: 50.069282024548386, lng: 14.295179751607341 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Domov_svat%C3%A9ho_Karla_Boromejsk%C3%A9ho_(%C5%98epy)',
    description: {
      en: `Brave adventurer, welcome to St. Charles Borromeo's Home (Domov svatého Karla Boromejského)! In its 160-plus years, this Řepy complex has been a farmstead, an orphanage, an epidemic ward, a women's prison run by nuns, and a care home — which is an unusually eventful résumé for a building most people walk past without a second glance.

The Sisters of Mercy of St. Charles Borromeo arrived in Prague in 1837, and in 1858 they bought the old Taicman farmstead in the village of Řepy for 56,000 guilders, clearing the farm buildings to make room. Construction of a new two-storey building began in April 1859 under builder Jan Ripota, and by the summer of 1860 it was already finished enough to take in 188 orphans. Then, in 1864, a dangerous eye infection swept through the children living there, forcing many to be evacuated to the countryside for treatment; the remaining population shrank to just 25, who were relocated to a smaller home in Karlín.

With the building suddenly empty, the state stepped in with an offer nobody saw coming: a 25-year lease to house convicted women prisoners. The sisters adapted the building in 1865–66, installing workshops for seamstresses and rope-makers, and ran what amounted to a convent-prison hybrid for the better part of a century, until the communist government shut the whole operation down in 1948 for political reasons. After 1989, the damaged cloister was slowly restored, and in 1996 the sisters finally returned to their original mission of caring for the sick, poor, and marginalized. Today the home treats roughly 500 patients a year and also runs a day centre for seniors — plus, remarkably, it still maintains a division for women serving sentences, keeping one thread of its unlikely history alive.

🥚 Easter Egg: Somewhere in the paperwork of Czech religious history is the fact that a Catholic convent quietly ran a state-sanctioned women's prison for the better part of a century, with nuns supervising seamstress and rope-making workshops inside cells that had once housed orphaned children recovering from an eye epidemic. Few buildings in Prague can claim quite that specific a combination of occupants.`,

      cz: `Statečný dobrodruhu, vítej v Domově svatého Karla Boromejského! Za víc než 160 let existence prošel tento komplex v Řepích proměnou od selského statku přes sirotčinec, epidemickou ošetřovnu a ženskou věznici pod dohledem sester až po dnešní domov s pečovatelskou péčí — neobvykle bohaté curriculum vitae na budovu, kolem které většina lidí projde bez povšimnutí.

Kongregace Milosrdných sester sv. Karla Boromejského přišla do Prahy v roce 1837 a v roce 1858 koupila v obci Řepy starý statek Taicmanů za 56 000 zlatých, aby na jeho místě po zbourání hospodářských budov vznikla nová stavební parcela. Stavba nové dvoupatrové budovy začala v dubnu 1859 pod vedením stavitele Jana Ripoty a už v létě 1860 byla hotová natolik, že sem mohlo být přestěhováno 188 sirotků. V roce 1864 se ale mezi dětmi rozšířila nebezpečná oční nákaza, kvůli které musela být řada z nich převezena na venkov k léčení; zbylých pouhých 25 dětí bylo přemístěno do menšího domova v Karlíně.

Náhle vyprázdněnou budovu si stát vzápětí vyžádal k účelu, jaký by nikdo nečekal: na 25 let si ji pronajal jako věznici pro odsouzené ženy. Sestry budovu v letech 1865–1866 upravily a zřídily v ní švadlenské a provaznické dílny, a téměř celé jedno století tak provozovaly svérázný hybrid kláštera a věznice — až do roku 1948, kdy komunistický režim celý provoz z politických důvodů uzavřel. Po roce 1989 se poškozený klášter pomalu obnovoval a v roce 1996 se sestry konečně vrátily ke svému původnímu poslání péče o nemocné, chudé a lidi na okraji společnosti. Dnes domov ročně ošetří kolem 500 pacientů, provozuje také denní stacionář pro seniory — a pozoruhodně stále udržuje i oddělení pro ženy ve výkonu trestu, čímž zachovává jednu nit své nepravděpodobné historie.

🥚 Velikonoční vajíčko: Někde v análech české církevní historie je zapsáno, že katolický klášter téměř celé století tiše provozoval státem posvěcenou ženskou věznici, kde sestry dohlížely na švadlenské a provaznické dílny v celách, které kdysi obývaly sirotčí děti zotavující se z oční epidemie. Jen málo pražských budov se může pochlubit tak specifickou kombinací obyvatel.`,

      zh: `勇敢的冒险家，欢迎来到圣嘉禄·博罗梅奥之家（Domov svatého Karla Boromejského）！在160多年的历史里，这座位于热比（Řepy）的建筑群先后做过农庄、孤儿院、传染病隔离所、由修女管理的女子监狱，最后变成了今天的养老照护中心——对于一栋大多数人路过都不会多看一眼的建筑来说，这份履历相当丰富曲折。

圣嘉禄·博罗梅奥慈善修女会于1837年来到布拉格，1858年又以56,000古尔登的价格买下热比村的泰茨曼老农庄，拆除农舍后腾出了一大片建筑用地。新的两层建筑于1859年4月在建筑师扬·里波塔（Jan Ripota）的主持下动工，到1860年夏天时已完工到足以接纳188名孤儿入住的程度。然而到了1864年，一场危险的眼疾在孩子们之间蔓延开来，许多人不得不被送往乡下治疗；留下来的孩子只剩25人，随后被转移到卡林（Karlín）一处更小的住所。

建筑突然空了下来，国家随即提出了一个谁也没料到的用途：租期25年，用作关押女性囚犯的监狱。修女们于1865至1866年对建筑进行改造，设立了缝纫和制绳的工坊，此后近一个世纪，这里实际上运作成了一种修道院与监狱的混合体——直到1948年，共产党政府出于政治原因将其彻底关闭。1989年后，受损的修道院逐渐得到修复，1996年，修女们终于重新回归她们最初的使命：照顾病人、穷人和社会边缘群体。如今，这座养老院每年治疗约500名病患，还开设了一处日间老年活动中心——而且颇为难得的是，这里至今仍保留着一个女性服刑人员的分部，让它那段不可思议的历史仍留有一线延续。

🥚 彩蛋：捷克教会历史的档案里记着这样一笔：一座天主教修道院，近一个世纪里悄悄运营着一座得到国家认可的女子监狱，修女们在曾经住满从眼疾中康复的孤儿的牢房里，监督着缝纫和制绳工坊的运作。布拉格能有这么一份"住客名单"的建筑，恐怕找不出几栋。`,
    },
  },
  {
    name: 'Smíchov Synagogue',
    slug: 'smichovska-synagoga',
    localizedNames: { cz: 'Smíchovská synagoga', zh: '斯米霍夫犹太会堂' },
    labels: ['architecture', 'historical'],
    coordinates: { lat: 50.07179711864168, lng: 14.40292464947191 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Sm%C3%ADchov_Synagogue',
    description: {
      en: `Brave adventurer, welcome to the Smíchov Synagogue (Smíchovská synagoga)! Over 160 years this building has worn four completely different disguises — neo-Romanesque synagogue, Functionalist redesign, Nazi loot warehouse, and Tatra truck-factory storeroom — before finally settling down as a quiet archive, which counts as a remarkably calm retirement.

The synagogue was completed on 30 August 1863, funded on land donated by the mayor of Smíchov himself, Franz Ringhoffer — a name Prague still recognizes today, since his family's factory went on to build much of the city's tram fleet. The original building paired a neo-Romanesque exterior with a Moorish-style interior, a combination fashionable for synagogues across 19th-century Central Europe. It didn't have an easy run: anti-Jewish riots in 1897 caused real damage to the building. By the 1920s the community was scouting new land for a replacement synagogue entirely, but ultimately chose instead to remodel the existing one — architect Leopold Ehrmann gave it a striking Functionalist exterior in 1931, the version still standing today.

The building's darkest chapter came during the Nazi occupation, when in 1941 it was converted into a warehouse for confiscated Jewish property. Prague's Smíchov Jewish community was never reconstituted after the war, and by the 1950s the building had been repurposed once again — this time as storage for the nearby Tatra Smíchov truck factory. In 1986 the communist authorities scheduled it for demolition, a fate it escaped only by being placed on the heritage protection list. Ownership passed to the Prague Jewish Community after the 1990 revolution, and since 1998 it has been leased to the Jewish Museum in Prague, which spent five years fully restoring it before turning it into the archive and study room it remains today.

🥚 Easter Egg: The full-circle detail worth savouring: the very same Ringhoffer family that donated the land for this synagogue in the 1860s built a factory empire that eventually merged into Tatra — and decades later, this synagogue itself ended up doing time as a storage annex for that very same Tatra Smíchov works. Prague's industrial and religious history occasionally loops back on itself in ways nobody could have planned.`,

      cz: `Statečný dobrodruhu, vítej ve Smíchovské synagoze! Za posledních 160 let na sobě tato budova vystřídala čtyři naprosto odlišné podoby — novorománskou synagogu, funkcionalistickou přestavbu, nacistický sklad ukořistěného majetku a skladiště smíchovské Tatry — než se konečně usadila jako tichý archiv, což je docela klidný důchod.

Synagoga byla dokončena 30. srpna 1863 na pozemku, který věnoval sám starosta Smíchova Franz Ringhoffer — jméno, které Praha zná dodnes, protože z jeho rodinné továrny nakonec vzešla velká část pražského tramvajového parku. Původní budova spojovala novorománský exteriér s maurským interiérem, což byla v 19. století oblíbená kombinace pro synagogy po celé střední Evropě. Snadný osud neměla: protižidovské nepokoje v roce 1897 ji reálně poškodily. Ve 20. letech obec dokonce hledala pozemek pro úplně novou synagogu, nakonec se ale rozhodla přestavět tu stávající — architekt Leopold Ehrmann jí v roce 1931 dal nápadný funkcionalistický vzhled, který nese dodnes.

Nejtemnější kapitola budovy přišla za nacistické okupace, kdy z ní v roce 1941 udělali sklad zkonfiskovaného židovského majetku. Smíchovská židovská obec už po válce nebyla obnovena a budova v 50. letech znovu změnila účel — tentokrát jako sklad blízké továrny Tatra Smíchov. V roce 1986 ji komunistické úřady odsoudily k demolici, které unikla jen díky zapsání na seznam památek. Po revoluci roku 1990 přešla do majetku Židovské obce v Praze a od roku 1998 ji má v pronájmu Židovské muzeum v Praze, které ji během pěti let kompletně zrestaurovalo a od té doby ji využívá jako archiv a studovnu.

🥚 Velikonoční vajíčko: Stojí za pozornost, jak se tu historie uzavírá do kruhu: stejná rodina Ringhofferů, která v 60. letech 19. století věnovala pozemek pro tuto synagogu, později vybudovala továrenské impérium, jež se nakonec spojilo s Tatrou — a o desítky let později synagoga sama sloužila jako skladovací přístavek přesně téhle smíchovské Tatrovky. Pražská průmyslová a náboženská historie se občas uzavírá do kruhů, které by nikdo neuměl naplánovat.`,

      zh: `勇敢的冒险家，欢迎来到斯米霍夫犹太会堂（Smíchovská synagoga）！在160多年的历史中，这栋建筑先后换过四副完全不同的"面孔"——新罗曼式犹太会堂、功能主义风格改建、纳粹赃物仓库，以及塔特拉（Tatra）卡车厂的储藏室——最终才安顿下来，做起了一间安静的档案室，也算是相当平静的"退休生活"。

这座会堂于1863年8月30日竣工，用地由斯米霍夫市长弗朗茨·林霍夫尔（Franz Ringhoffer）本人捐赠——这个名字布拉格人至今仍不陌生，因为他家族的工厂后来生产了这座城市大部分的有轨电车。最初的建筑外观为新罗曼式，内部则采用摩尔风格，这种组合在19世纪中欧的犹太会堂中相当流行。它的命运并不平顺：1897年的反犹骚乱曾对建筑造成实质性破坏。到了20世纪20年代，社区一度在寻找新地块，打算另建一座全新的会堂，但最终还是选择改建现有建筑——建筑师利奥波德·埃尔曼（Leopold Ehrmann）于1931年为其赋予了一副引人注目的功能主义外观，也就是今天所见的样貌。

这栋建筑最黑暗的一章发生在纳粹占领时期：1941年，它被改作没收的犹太人财产的仓库。战后，斯米霍夫的犹太社区再未得到重建，到了20世纪50年代，这栋建筑又一次改变了用途——这次成了附近塔特拉·斯米霍夫（Tatra Smíchov）卡车厂的储藏室。1986年，共产党当局曾计划将其拆除，多亏被列入文物保护名录才幸免于难。1990年剧变后，其产权转归布拉格犹太社区所有，自1998年起由布拉格犹太博物馆租用，博物馆花费五年时间将其彻底修复，此后它便一直作为档案室和阅览室使用至今。

🥚 彩蛋：这段历史里有个格外值得玩味的"闭环"细节：19世纪60年代为这座会堂捐地的林霍夫尔家族，后来打造出的工厂帝国最终并入了塔特拉——几十年后，这座会堂本身竟成了那家塔特拉·斯米霍夫工厂的储藏附楼。布拉格的工业史与宗教史，有时会以谁都无法预先设计的方式，兜转回到彼此身上。`,
    },
  },
  {
    name: 'Ládví Geodetic Tower',
    slug: 'geodeticka-vez-ladvi',
    localizedNames: { cz: 'Geodetická věž Ládví', zh: '拉德维测量塔' },
    labels: ['tower', 'historical', 'hidden-gem'],
    coordinates: { lat: 50.13598301593087, lng: 14.464383111569747 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Geodetick%C3%A1_v%C4%9B%C5%BE_L%C3%A1dv%C3%AD',
    description: {
      en: `Brave adventurer, welcome to the Ládví Geodetic Tower (Geodetická věž Ládví)! This fifteen-metre brick obelisk was built in 1936 for one job only — helping surveyors measure the exact shape of the Earth — and it does that job so seriously that even you, the visitor, are not allowed inside.

Ládví Tower is one of nine measuring towers raised across Czech lands between 1936 and 1942 to fix trigonometric reference points with the precision beloved by generations of cartographers. It stands on a circular floor plan, a design it shares only with the very first of the nine, on Pecný hill — every tower built after that one switched to a star-shaped footprint instead. The tower's real job, however, predates it by seventy years: the ground beneath it has been anchoring measurements since 1862, when the original cadastral marker here fed into the Central European degree survey used to calculate the curvature of the planet. The current tower simply protects that legacy point, which today underpins the S-JTSK coordinate system — the standard every Czech land surveyor, and the builders of the Prague metro, are legally required to use.

Ládví itself sits at 359 metres, the second-highest point in the Prague basin, hidden inside the quiet Ďáblický háj forest in Prague 8. The tower is fenced off and its door stays firmly locked, but the eastern edge of the hill opens onto a genuinely lovely view — on a clear day you can see all the way to Říp, the mythical hill where, according to legend, the first Czechs settled.

🥚 Easter Egg: The plot of land the tower stands on wasn't donated by a government ministry or a surveying office — it was handed over by the Order of the Knights of the Cross with the Red Star, a Czech Catholic order founded in the 13th century, specifically so that this one precise dot on the map would never be built over. Eight hundred years of institutional history, all in service of a single very stubborn survey point.`,

      cz: `Statečný dobrodruhu, vítej u Geodetické věže Ládví! Patnáctimetrový cihlový sloup byl postaven v roce 1936 kvůli jedinému úkolu — pomoci geodetům přesně změřit tvar Země — a bere to natolik vážně, že dovnitř nesmíte ani vy, návštěvníci.

Věž Ládví je jednou z devíti měřických věží, které vznikly na českém území mezi lety 1936 a 1942, aby zafixovaly trigonometrické body s přesností, kterou by ocenila celá generace kartografů. Stojí na kruhovém půdorysu, což sdílí jen s vůbec první z devítky, na kopci Pecný — všechny další věže po ní už dostaly půdorys ve tvaru hvězdy. Skutečný úkol věže je ale o sedmdesát let starší: půda pod ní slouží k měření už od roku 1862, kdy tehdejší katastrální bod vstoupil do středoevropského stupňového měření používaného k výpočtu zakřivení planety. Dnešní věž jen chrání tento historický bod, který dnes tvoří základ souřadnicového systému S-JTSK — normy, kterou musí ze zákona používat každý český geodet i stavitelé pražského metra.

Samotné Ládví leží ve výšce 359 metrů, což je druhý nejvyšší bod Pražské kotliny, ukrytý v tichém Ďáblickém háji v Praze 8. Věž je oplocená a dveře zůstávají pevně zamčené, ale východní okraj kopce nabízí opravdu pěkný výhled — za jasného počasí dohlédnete až k Řípu, bájné hoře, kde se podle legendy usadili první Češi.

🥚 Velikonoční vajíčko: Pozemek, na kterém věž stojí, nevěnovalo žádné ministerstvo ani zeměměřický úřad — daroval ho Rytířský řád křižovníků s červenou hvězdou, český katolický řád založený ve 13. století, a to výhradně proto, aby se na tomto jednom přesném bodě na mapě nikdy nic nepostavilo. Osm set let institucionální historie, to vše ve službách jednoho velmi tvrdohlavého geodetického bodu.`,

      zh: `勇敢的冒险家，欢迎来到拉德维地质测量塔（Geodetická věž Ládví）！这座15米高的砖砌尖塔建于1936年，只为了一个任务——帮助测量员精确测算地球的形状——而且它对这项工作认真到连你这位游客都不许进去参观。

拉德维塔是1936年至1942年间在捷克境内建造的九座测量塔之一，用于以令历代制图师都为之着迷的精度确定三角测量基准点。它采用圆形平面设计，这一点只与九座塔中最早建成的那座（位于佩茨尼山）相同——在那之后建造的所有测量塔都改用了星形平面。不过，这座塔真正的使命其实要追溯到七十年前：早在1862年，这片土地下方的测量点就已投入使用，当年的地籍基准点曾被纳入中欧度量测量项目，用于计算地球的曲率。如今的这座塔，不过是在守护这一历史悠久的基准点——而它至今仍是S-JTSK坐标系统的根基，捷克每一位测量员，乃至布拉格地铁的建造者，依法都必须使用这套系统。

拉德维山本身海拔359米，是布拉格盆地的第二高点，静静地藏在布拉格8区的达布利采森林（Ďáblický háj）之中。这座塔被围栏圈住，大门也一直紧锁，但山丘东侧确实能欣赏到一片相当迷人的风景——天气晴朗时，你甚至能一路望见传说中第一批捷克人定居的日普山（Říp）。

🥚 彩蛋：这座塔所在的土地并非由某个政府部门或测绘机构捐赠，而是由创立于13世纪的捷克天主教修会"红星十字骑士团"（Rytířský řád křižovníků s červenou hvězdou）捐出——目的只有一个：确保地图上这个精确的点位永远不会被任何建筑占用。八百年的机构历史，最终都汇聚成了守护一个异常执着的测量基准点。`,
    },
  },
  {
    name: 'Admirál Botel',
    slug: 'botel-admiral',
    localizedNames: { cz: 'Botel Admirál', zh: '阿德米拉尔船屋酒店' },
    labels: ['modern', 'hidden-gem', 'restaurants-and-cafes'],
    coordinates: { lat: 50.07064807859895, lng: 14.411284638292758 },
    rarity: 'superior',
    xpReward: 30,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Botel Admirál — a genuine hotel-boat that has spent over fifty years moored on the Vltava without so much as untying its ropes. It's the boldest non-voyage in Prague: three steel decks, eighty-two cabins, one restaurant, and absolutely no intention of ever actually sailing anywhere.

Admirál was the last of three "botels" built for Prague in the early 1970s, a curious piece of communist-era tourism infrastructure designed to squeeze extra hotel capacity out of the riverbank rather than the crowded city centre. Launched and towed into place in 1971, it dropped anchor on the Vltava's left bank between Palacký Bridge and the railway bridge, plugged itself into the city's gas and utility networks, and has stayed exactly there ever since — a fully self-contained three-storey steel hull doing hotel duty instead of harbour duty. After the 1989 revolution the state eventually let it go: in 1993 it was privatized and bought by Allvatours, a Czech family firm that still runs it today, restaurant, small nightclub, brass fittings and all.

What makes it worth the walk along the embankment is the view money can't easily buy from a landlocked hotel room: from the deck and the cabin windows you get Prague Castle, the Emmaus Monastery, the National Theatre, and Vyšehrad all lined up along the water, with Palacký Bridge close enough to touch.

🥚 Easter Egg: Two of Admirál's sister botels, Albatros and Racek, are still moored elsewhere on the same river — meaning Prague once operated an entire micro-fleet of hotels that share nothing with actual ships except the fact that they float.`,

      cz: `Statečný dobrodruhu, vítej na Botelu Admirál — opravdové hotelové lodi, která už přes padesát let kotví na Vltavě, aniž by kdy odvázala lana. Je to ta nejodvážnější neplavba v Praze: tři ocelová paluby, osmdesát dva kajut, jedna restaurace a naprosto žádný úmysl kamkoliv skutečně vyplout.

Admirál byl posledním ze tří "botelů" postavených pro Prahu na začátku 70. let — kuriózní kus turistické infrastruktury z komunistické éry, jehož smyslem bylo získat další hotelovou kapacitu z říčního břehu místo přeplněného centra. Loď byla spuštěna na vodu a v roce 1971 dotažena na místo, kde zakotvila na levém břehu Vltavy mezi Palackého mostem a železničním mostem, napojila se na městskou plynovou a inženýrskou síť a od té doby z místa nehnula — jde o plně soběstačný třípodlažní ocelový trup, který dělá hotelovou, nikoli přístavní službu. Po revoluci v roce 1989 se ho stát nakonec rozhodl pustit: v roce 1993 byl zprivatizován a koupila ho Allvatours, česká rodinná firma, která ho provozuje dodnes — s restaurací, malým nočním klubem i mosaznými detaily.

Co stojí za tu procházku po nábřeží, je výhled, který si za peníze v běžném hotelovém pokoji na pevnině jen tak nekoupíte: z paluby a z oken kajut vidíte Pražský hrad, klášter Emauzy, Národní divadlo i Vyšehrad seřazené podél řeky, s Palackého mostem na dosah ruky.

🥚 Velikonoční vajíčko: Dva sesterské botely Admirálu, Albatros a Racek, dodnes kotví jinde na téže řece — Praha tedy kdysi provozovala celou mikroflotilu hotelů, které se skutečným lodím podobají snad jen tím, že plavou.`,

      zh: `勇敢的冒险家，欢迎来到阿德米拉尔船屋酒店（Botel Admirál）——一艘真正的船型酒店，五十多年来一直系泊在伏尔塔瓦河上，从未解开过缆绳。这大概是布拉格最"勇敢"的一次不出航：三层钢制甲板，八十二间客舱，一间餐厅，以及完全没有真正启航的打算。

阿德米拉尔号是20世纪70年代初为布拉格建造的三艘"船屋酒店"（botel）中的最后一艘——这是共产主义时代一种颇为奇特的旅游基础设施：与其在拥挤的市中心新建酒店，不如干脆把河岸变成额外的客房。这艘船于1971年下水并被拖至指定位置，最终停泊在伏尔塔瓦河左岸、帕拉茨基桥与铁路桥之间，接入城市的燃气与市政管网后，便再也没有挪动过——它是一具完全自给自足的三层钢制船体，履行的是酒店职责，而非港口职责。1989年剧变之后，国家最终放手：1993年它被私有化，由捷克家族企业Allvatours买下并经营至今——餐厅、小型夜店、黄铜装饰一应俱全。

真正值得沿着河堤走这一趟的，是那种住在陆地酒店房间里花钱也未必买得到的景观：从甲板和舱窗望出去，布拉格城堡、埃马乌斯修道院、国家剧院和维谢赫拉德依次沿河排开，帕拉茨基桥更是近在咫尺。

🥚 彩蛋：阿德米拉尔号的两艘"姊妹船屋"——信天翁号（Albatros）和海鸥号（Racek）——至今仍停泊在同一条河的其他位置，这意味着布拉格曾经运营过一整支"迷你船队"酒店，而它们与真正的船只唯一的共同点，大概就是都能浮在水面上。`,
    },
  },
  {
    name: 'Cibulka Lookout Tower',
    slug: 'rozhledna-cibulka',
    localizedNames: { cz: 'Rozhledna Cibulka', zh: '齐布尔卡观景塔' },
    labels: ['tower', 'historical', 'nature'],
    coordinates: { lat: 50.06472972080001, lng: 14.355915322118458 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Cibulka_(Ko%C5%A1%C3%AD%C5%99e)',
    description: {
      en: `Brave adventurer, welcome to the Cibulka Lookout Tower (Rozhledna Cibulka) — at roughly two hundred years old, this modest thirteen-metre tower is the oldest purpose-built lookout tower in Prague, and it got that way by being built purely for fun.

The land has been productive since at least the 14th century — Cibulka was a working vineyard estate for centuries, named after the 16th-century burgher Blažej Cibulka who once owned it. Everything changed in 1817, when Leopold Leonhard Raymund of Thun-Hohenstein, the last Prince-Bishop of Passau, bought the estate and threw money at it with genuine enthusiasm: within a few years he had transformed the vineyards into a sprawling Romantic English park, dotted with statues, follies, a pavilion, and — around 1820 — this tower, reachable by 76 external steps and built for no better reason than to admire his own new park from above. The good times didn't last. After Thun-Hohenstein's death the estate caught fire and slid slowly into disrepair for a century, passing through owners with steadily thinner wallets until the last private one, a farmer named Josef Hyross, sold it to the City of Prague in 1922 simply because he couldn't afford it anymore.

The estate's story took its most surprising turn recently: in April 2021 it was purchased by a foundation backed by Avast co-founder Ondřej Vlček and his wife Katarina, who plan to restore Cibulka and turn it into a children's hospice and palliative care centre.

🥚 Easter Egg: A tower built purely as a Romantic-era luxury — the 19th-century equivalent of building a folly just because you can — is now on track to become part of a hospice for children. Two centuries later, the same hilltop is finally being put to the most serious use it has ever had.`,

      cz: `Statečný dobrodruhu, vítej u Rozhledny Cibulka — se svými zhruba dvěma sty lety je tato skromná třináctimetrová věž nejstarší účelově postavenou rozhlednou v Praze, a k tomuto prvenství přišla tak, že vznikla čistě pro radost.

Pozemek byl hospodářsky využívaný přinejmenším od 14. století — Cibulka byla po staletí fungujícím vinařským statkem, pojmenovaným po měšťanovi Blažeji Cibulkovi z Veleslavína, který jej vlastnil v 16. století. Vše se změnilo v roce 1817, kdy statek koupil Leopold Leonard Raymund Thun-Hohenstein, poslední pasovský kníže-biskup, a vrhl se do jeho přestavby se skutečným nadšením: během několika let proměnil vinice v rozsáhlý romantický anglický park plný soch, drobných staveb, pavilonku a — kolem roku 1820 — právě této věže, na kterou vede 76 vnějších schodů a která nesloužila k ničemu jinému, než aby si mohl svůj nový park obdivovat shora. Dobré časy ale netrvaly dlouho. Po Thun-Hohensteinově smrti statek vyhořel a další století pomalu chátral, procházel majiteli s čím dál tenčí peněženkou, až ho poslední soukromý vlastník, sedlák Josef Hyross, v roce 1922 prodal pražské obci — jednoduše proto, že už si ho nemohl dovolit.

Nejpřekvapivější zvrat přišel nedávno: v dubnu 2021 statek koupila nadace stojící za spoluzakladatelem Avastu Ondřejem Vlčkem a jeho ženou Katarinou, kteří plánují Cibulku zrekonstruovat a proměnit ji v dětský hospic a centrum paliativní péče.

🥚 Velikonoční vajíčko: Věž postavená čistě jako romantický luxus — devatenáctistoletý ekvivalent stavby okrasné zříceniny jen proto, že to jde — má nyní namířeno k tomu, že se stane součástí hospice pro děti. Po dvou stech letech konečně tenhle kopec dostává tu nejvážnější úlohu, jakou kdy měl.`,

      zh: `勇敢的冒险家，欢迎来到齐布尔卡观景塔（Rozhledna Cibulka）——这座仅13米高、朴素低调的小塔已有近两百年历史，是布拉格现存最古老的专门建造的观景塔，而它之所以能拿下这个"最古老"头衔，完全是因为它当初的建造理由只有一个：好玩。

这片土地至少从14世纪起就一直被开垦利用——齐布尔卡数百年来都是一座正常运营的葡萄园庄园，其名字来自16世纪拥有它的市民布拉热伊·齐布尔卡（Blažej Cibulka）。一切在1817年发生了转变：帕绍最后一任采邑主教莱奥波尔德·莱昂哈德·雷蒙德·图恩-霍恩施泰因（Thun-Hohenstein）买下了这处庄园，并满怀热情地大笔投入改造——短短几年内，他就把葡萄园变成了一座广阔的浪漫主义英式园林，遍布雕像、装饰性小品建筑、一座亭阁，以及大约建于1820年的这座塔——塔上76级户外台阶，建造它的唯一理由，就是让主人能够站在高处欣赏自己的新园林。可惜好日子并不长久。图恩-霍恩施泰因去世后，庄园遭遇火灾，此后整整一个世纪都在缓慢败落，历经一任任家底越来越薄的业主，直到最后一位私人业主——农民约瑟夫·希罗斯（Josef Hyross）——在1922年因实在无力负担，将其卖给了布拉格市政府。

这座庄园最出人意料的转折发生在近几年：2021年4月，由Avast联合创始人翁德热伊·弗尔切克（Ondřej Vlček）与妻子卡塔琳娜（Katarina）支持的一家基金会买下了它，计划将齐布尔卡修复后改建为儿童临终关怀与舒缓治疗中心。

🥚 彩蛋：一座纯粹为了浪漫主义式的奢侈享受而建的高塔——19世纪版本的"就因为能建所以才建"的装饰性建筑——如今即将成为一家儿童关怀中心的一部分。两百年后，这座山丘终于迎来了它有史以来最庄重的使命。`,
    },
  },
  {
    name: 'Košíře-Motol Nature Park',
    slug: 'prirodni-park-kosire-motol',
    localizedNames: { cz: 'Přírodní park Košíře-Motol', zh: '科希热-摩托尔自然公园' },
    labels: ['nature', 'park', 'hidden-gem'],
    coordinates: { lat: 50.06229792938048, lng: 14.346014640269098 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/P%C5%99%C3%ADrodn%C3%AD_park_Ko%C5%A1%C3%AD%C5%99e-Motol',
    description: {
      en: `Brave adventurer, welcome to Košíře-Motol Nature Park (Přírodní park Košíře-Motol) — at 354 hectares, it's officially Prague's smallest nature park, and yet somehow it found room for 480-million-year-old fossils, a working golf course, a greyhound track, and its own crematorium.

The park was set aside as a protected "quiet zone" in 1991 and formally reclassified as a nature park in 1992, once Czech law created that category specifically to bring places like this — too small and too suburban for grander protections, but worth saving anyway — under some kind of legal umbrella. Spread across Košíře, Motol, Jinonice, and Stodůlky, it contains three separate protected natural monuments: Vidoule, one of Prague's highest points at 372 metres; the Motolský ordovik, a geological outcrop where Ordovician-era trilobite fossils are still visible in the rock; and Kalvárie v Motole, a striking basalt formation. Red squirrels, hedgehogs, green frogs, and two protected species of swallowtail butterfly all share the woods with a greyhound racing track and a golf course, which is about as Prague a combination of land use as exists anywhere in the city.

Tucked inside the park's Cibulka section are oak trees estimated at two hundred years old, standing guard over the very same romantic-era lookout tower — the oldest in Prague — described elsewhere in this app.

🥚 Easter Egg: Not every corner of the park is romantic. The Motol crematorium once served as the final resting place — quite literally — for the ashes of political prisoners who died during the communist era, a grim footnote tucked into an otherwise pleasant patchwork of forest, fossils, and fairways.`,

      cz: `Statečný dobrodruhu, vítej v Přírodním parku Košíře-Motol — s rozlohou 354 hektarů jde oficiálně o nejmenší pražský přírodní park, a přesto se do něj nějak vešly 480 milionů let staré zkameněliny, fungující golfové hřiště, dráha pro dostihy chrtů i vlastní krematorium.

Území bylo v roce 1991 vyhlášeno chráněnou "oblastí klidu" a v roce 1992 formálně převedeno do kategorie přírodního parku poté, co český zákon tuto kategorii zavedl přímo kvůli místům, jako je toto — příliš malým a příliš předměstským na velkolepější ochranu, ale přesto stojícím za záchranu. Park se rozprostírá přes Košíře, Motol, Jinonice a Stodůlky a zahrnuje tři samostatné přírodní památky: Vidouli, jeden z nejvyšších bodů Prahy ve výšce 372 metrů; Motolský ordovik, geologický odkryv, kde jsou v hornině dodnes vidět zkameněliny trilobitů z prvohor; a Kalvárii v Motole, výraznou čedičovou skalní formaci. Veverky obecné, ježci, skokani zelení a dva chráněné druhy otakárků sdílejí les s dráhou pro dostihy chrtů a golfovým hřištěm — kombinace využití území, snad ta nejpražštější, jaká v celém městě existuje.

V cibulské části parku rostou duby staré odhadem dvě stě let, které střeží úplně tutéž romantickou rozhlednu — nejstarší v Praze — popsanou jinde v této aplikaci.

🥚 Velikonoční vajíčko: Ne každý kout parku je romantický. Motolské krematorium kdysi sloužilo jako poslední místo odpočinku — doslova — pro popel politických vězňů zemřelých v době komunismu, ponurá poznámka pod čarou uprostřed jinak příjemné mozaiky lesa, zkamenělin a golfových jamek.`,

      zh: `勇敢的冒险家，欢迎来到科希热-摩托尔自然公园（Přírodní park Košíře-Motol）——占地354公顷，是布拉格官方认定最小的自然公园，可它却不知怎么塞进了4.8亿年前的化石、一座正常运营的高尔夫球场、一条灵缇犬赛道，甚至还有自己的火葬场。

这片区域于1991年被划定为受保护的"安静区"，1992年捷克法律专门设立"自然公园"这一类别后，正式转为该类别——这个类别正是为了给这类地方一个法律保护伞：太小、太靠近郊区，够不上更高级别的保护，却依然值得保留。公园横跨科希热、摩托尔、伊尼奥尼采和斯托杜尔基几个区域，境内共有三处独立的自然保护地：维多乌莱（Vidoule），海拔372米，是布拉格最高点之一；摩托尔奥陶纪地层（Motolský ordovik），至今仍能在岩层中看到奥陶纪三叶虫化石；以及摩托尔各各他（Kalvárie v Motole），一处引人注目的玄武岩地貌。红松鼠、刺猬、绿蛙，以及两种受保护的凤蝶，都与灵缇犬赛道和高尔夫球场共享着同一片树林——这种土地用途组合，大概是全布拉格最具"布拉格特色"的搭配了。

在公园的齐布尔卡区域里，生长着树龄估计达两百年的橡树，默默守护着同一座浪漫主义时期建造的观景塔——布拉格最古老的一座，本应用程序的其他条目中也有介绍。

🥚 彩蛋：公园并非处处浪漫。摩托尔火葬场曾是共产主义时期死亡政治犯骨灰的最终安放之地——这是一段藏在森林、化石与高尔夫球道构成的宜人拼图之中的沉重注脚，字面意义上的"最终归宿"。`,
    },
  },
  {
    name: 'Velká Chuchle',
    slug: 'velka-chuchle',
    localizedNames: { cz: 'Velká Chuchle', zh: '大胡赫莱' },
    labels: ['village-and-town', 'historical', 'nature'],
    coordinates: { lat: 50.01133568478249, lng: 14.388908461803233 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Velk%C3%A1_Chuchle',
    description: {
      en: `Brave adventurer, welcome to Velká Chuchle — a quiet riverside village on the southern edge of Prague that has, against all odds, hosted the birth of Czech aviation, more than a century of horse racing, and at least two catastrophic floods.

Chuchle only became an official part of Prague on 24 November 1990, and today it's home to a modest 603 houses and around 2,500 residents gathered around a Baroque church dedicated to St. John of Nepomuk, its adjoining cemetery, and a pair of late-Baroque manor houses on the central square. But the village punches well above its size in historical significance. In 1911, aviator Jan Kašpar landed his Blériot XI here after a 121-kilometre, 92-minute flight from Pardubice — a genuinely reckless feat for the time, and one still remembered as the symbolic starting point of Czech aviation. Five years earlier, in 1906, the Chuchle racecourse had opened for business, and it's been running horses ever since: the first Czechoslovak Derby galloped through in 1921, and the President of the Republic Prize, established in 1920 in honour of T. G. Masaryk, remains the oldest race still run there today — Masaryk himself showed up in person for the 1931 Derby.

The river that gives Chuchle its charm has also, twice in living memory, tried to take it back: catastrophic floods in 2002 and 2013 fully submerged the racecourse both times, and both times it reopened anyway.

🥚 Easter Egg: The original wooden Art Nouveau grandstands survived nearly eighty years of racing before being demolished in 1985 and replaced with the concrete structure still standing today — meaning the racecourse has now outlived its own original architecture by exactly the same margin it once took to build a reputation.`,

      cz: `Statečný dobrodruhu, vítej ve Velké Chuchli — tiché vesnici na jižním okraji Prahy, která navzdory všem očekáváním hostila zrození českého letectví, více než století dostihů a přinejmenším dvě katastrofální povodně.

Chuchle se stala oficiální součástí Prahy až 24. listopadu 1990 a dnes v ní najdete skromných 603 domů a zhruba 2 500 obyvatel, soustředěných kolem barokního kostela zasvěceného sv. Janu Nepomuckému, přilehlého hřbitova a dvojice pozdně barokních usedlostí na návsi. Přesto má vesnice historický význam, který zdaleka přesahuje její velikost. V roce 1911 zde letec Jan Kašpar přistál se svým Blériotem XI po 121kilometrovém, 92minutovém letu z Pardubic — na svou dobu vyloženě odvážný kousek, který se dodnes připomíná jako symbolický počátek českého letectví. O pět let dříve, v roce 1906, otevřelo chuchelské závodiště a dostihy se tu jezdí dodnes: v roce 1921 se tudy prohnalo první československé derby a Cena prezidenta republiky, založená v roce 1920 na počest T. G. Masaryka, zůstává nejstarším dodnes běhaným dostihem — sám Masaryk se osobně dostavil na derby v roce 1931.

Řeka, která dává Chuchli její kouzlo, se ji v živé paměti dvakrát pokusila i vzít zpátky: katastrofální povodně v letech 2002 a 2013 obě dvakrát zcela zatopily závodiště, a obakrát se přesto znovu otevřelo.

🥚 Velikonoční vajíčko: Původní dřevěné secesní tribuny přežily téměř osmdesát let dostihů, než byly v roce 1985 zbourány a nahrazeny betonovou stavbou, která stojí dodnes — závodiště tak dnes svou původní architekturu přežilo o stejně dlouhou dobu, jaká mu kdysi trvalo, než si vybudovalo pověst.`,

      zh: `勇敢的冒险家，欢迎来到大胡赫莱（Velká Chuchle）——布拉格南郊一座安静的河畔村庄，却出人意料地见证了捷克航空的诞生、逾一个世纪的赛马传统，以及至少两次毁灭性的洪灾。

胡赫莱直到1990年11月24日才正式并入布拉格，如今这里只有603栋房屋、约2500名居民，聚居在一座供奉圣约翰·内波穆克的巴洛克教堂周围，教堂旁是墓地，村中心广场上还立着两座晚期巴洛克风格的庄园宅邸。然而论历史分量，这座小村庄远远超出了它的体量。1911年，飞行员扬·卡什帕尔（Jan Kašpar）驾驶布莱里奥XI型飞机，从帕尔杜比采飞抵此地，全程121公里、耗时92分钟——在当时堪称一次极其冒险的壮举，至今仍被视为捷克航空史的象征性起点。而在五年前的1906年，胡赫莱赛马场已经开业，此后赛马活动从未间断：1921年，首届捷克斯洛伐克德比赛在此举行；1920年为纪念捷克斯洛伐克首任总统马萨里克而设立的"共和国总统奖"，至今仍是这里最古老、仍在延续的赛事——马萨里克本人还曾亲临1931年的德比赛现场。

赋予胡赫莱魅力的这条河流，也曾两度试图将这份魅力收回：2002年和2013年的毁灭性洪灾都曾让赛马场完全被淹没，而两次它都重新开业。

🥚 彩蛋：最初的木制新艺术风格看台在赛马场使用了近八十年，直到1985年才被拆除，换成了沿用至今的混凝土看台——如此算来，这座赛马场"活过"其原始建筑的年头，恰好和当年它花了多久才建立起自己声誉的时间一样长。`,
    },
  },
  {
    name: 'Radotín Biotope',
    slug: 'biotop-radotin',
    localizedNames: { cz: 'Biotop Radotín', zh: '拉多丁生态浴场' },
    labels: ['nature', 'modern', 'hidden-gem'],
    coordinates: { lat: 49.97921189727987, lng: 14.359023407547198 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Biotop_Radot%C3%ADn',
    description: {
      en: `Brave adventurer, welcome to Biotop Radotín — a swimming spot so clean it filters itself, built on the site of a wastewater treatment plant that spent the 2000s as an abandoned squat. Sometimes a location's biggest achievement is simply how far it has come.

Before it was Prague's most photogenic swimming lagoon, this patch of land in Prague 16 was a working sewage treatment facility, decommissioned after the catastrophic 2002 floods and left to rot; by 2003 the crumbling buildings had become an informal shelter for the homeless. Local officials, apparently unimpressed by the status quo, went scouting for inspiration in 2009, visiting biotope-style swimming facilities in Moravia's Kovalovice and Bantice, and by 2010 had drawn up the first study for a Radotín version — a pool that uses plants and natural filtration instead of chlorine to keep the water clean. Construction under architect Jan Schlitz began in 2013, and the whole complex — swimming lagoons, a children's playground, two outdoor saunas, and enough parking to handle the crowds — opened to considerable local fanfare at the end of June 2014. A separate pool followed in 2019.

🥚 Easter Egg: Biotop Radotín may be the only swimming spot in Prague whose full origin story runs sewage plant → flood ruin → homeless shelter → award-worthy eco lagoon, all within about a decade — proof that even a derelict treatment plant can eventually clean up rather nicely.`,

      cz: `Statečný dobrodruhu, vítej v Biotopu Radotín — koupacím místě tak čistém, že se filtruje samo, postaveném na místě bývalé čistírny odpadních vod, která celé 2000 roky strávila jako opuštěný squat. Někdy je největším úspěchem místa prostě to, jak dlouhou cestu urazilo.

Než se z tohoto kousku Prahy 16 stalo jedno z nejfotogeničtějších koupacích jezírek v Praze, stávala tu fungující čistírna odpadních vod, vyřazená z provozu po katastrofálních povodních v roce 2002 a ponechaná napospas chátrání; do roku 2003 se rozpadající se budovy proměnily v neoficiální útočiště pro bezdomovce. Místní zastupitelé, zjevně nespokojení se současným stavem, se v roce 2009 vydali hledat inspiraci na Moravu, kde navštívili biotopová koupaliště v Kovalovicích a Bantici, a do roku 2010 měli hotovou první studii radotínské verze — koupaliště, které místo chloru čistí vodu pomocí rostlin a přirozené filtrace. Výstavba pod vedením architekta Jana Schlitze začala v roce 2013 a celý areál — koupací jezírka, dětské hřiště, dvě venkovní sauny a dostatek parkovacích míst pro davy návštěvníků — se s velkou místní slávou otevřel na konci června 2014. V roce 2019 přibyl ještě samostatný bazén.

🥚 Velikonoční vajíčko: Biotop Radotín je možná jediné koupací místo v Praze, jehož kompletní příběh vzniku zní: čistírna odpadních vod → povodňová zřícenina → útočiště bezdomovců → oceňovaná ekologická laguna, a to vše během zhruba jedné dekády — důkaz, že i zchátralá čistírna se nakonec dokáže docela hezky vyčistit.`,

      zh: `勇敢的冒险家，欢迎来到拉多丁生态浴场（Biotop Radotín）——一处干净到能自我过滤的天然泳池，建在一座曾经沦为流浪者聚居地的废弃污水处理厂旧址之上。有时候，一个地方最大的成就，恰恰在于它走过了多远的路。

在成为布拉格最上镜的天然泳池之前，布拉格16区的这片土地曾是一座正常运转的污水处理厂，在2002年那场毁灭性洪水后被废弃停用；到2003年，破败的厂房已经变成了流浪者的非正式栖身之所。当地官员显然对现状并不满意，于2009年前往摩拉维亚考察，参观了科瓦洛维采（Kovalovice）和班蒂采（Bantice）两地的生态浴场，并于2010年完成了拉多丁版本的首份规划——用植物和天然过滤系统而非氯来净化池水。在建筑师扬·施利茨（Jan Schlitz）的主持下，工程于2013年动工，整个园区——包括天然泳池、儿童游乐场、两座户外桑拿房，以及足以应付人潮的停车位——于2014年6月底在当地一片热烈反响中正式开放。2019年，园区又新增了一座独立泳池。

🥚 彩蛋：拉多丁生态浴场大概是布拉格唯一一处身世如此曲折的泳池——从污水处理厂，到洪灾废墟，再到流浪者收容所，最终蜕变为备受赞誉的生态泻湖，前后不过十年光景——足以证明，就算是一座破败的污水处理厂，最终也能"洗心革面"洗得相当漂亮。`,
    },
  },
  {
    name: 'Golf Club Praha',
    slug: 'golf-club-praha',
    localizedNames: { cz: 'Golf Club Praha', zh: '布拉格高尔夫俱乐部' },
    labels: ['nature', 'historical', 'hidden-gem'],
    coordinates: { lat: 50.06194032443152, lng: 14.338377856283673 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Golf_Club_Praha',
    description: {
      en: `Brave adventurer, welcome to Golf Club Praha — the oldest golf club in the country, and quite possibly the only one that has survived having its own fairways deliberately ploughed under and turned into a forest by the state.

Founded in 1926 with Jan Masaryk, son of the republic's first president, as its first honorary chairman, the club built a nine-hole course in the Motol basin that same year. The good times ended in dramatic fashion: after the 1948 communist coup golf was branded a bourgeois pastime, the club was forced into a merger with other organisations, the sport itself was banned outright in 1950, and between 1953 and 1960 the original greens were ploughed over and replanted as forest — about as thorough a course closure as exists in the sport's history anywhere. The club itself survived only as an idea, quietly waiting out two decades of communism.

Golf Club Praha was revived under its original name in 1968, and in 1969 its members set to work building an entirely new nine-hole course nearby, on a plot known as Na hliníku; construction ran through the early 1970s, and the first tournament under the reborn club finally took place in the autumn of 1977. That same course, tucked inside Košíře-Motol Nature Park just a few tram stops from the historic centre, is still the one played today.

🥚 Easter Egg: Somewhere under the trees of today's Košíře-Motol Nature Park lies the ghost of the original 1926 course — the forest planted deliberately to erase it from the map is now itself a protected natural landscape, which means the state's anti-golf forest ultimately became one of Prague's most cherished parks.`,

      cz: `Statečný dobrodruhu, vítej v Golf Clubu Praha — nejstarším golfovém klubu v zemi, a možná jediném, který přežil to, že mu stát vlastní jamkoviště záměrně rozoral a osázel lesem.

Klub byl založen v roce 1926 a jeho prvním čestným předsedou se stal Jan Masaryk, syn prvního československého prezidenta; už téhož roku vzniklo devítijamkové hřiště v motolské kotlině. Dobré časy skončily dramaticky: po komunistickém převratu v roce 1948 byl golf označen za buržoazní zábavu, klub byl donucen ke sloučení s jinými organizacemi, samotný sport byl v roce 1950 rovnou zakázán a mezi lety 1953 a 1960 byly původní greeny rozorány a osázeny lesem — asi tak důkladné zrušení hřiště, jaké tenhle sport kdekoli ve své historii zažil. Klub jako takový přežil jen jako myšlenka, tiše čekající, až dvacetiletí komunismu skončí.

Golf Club Praha byl obnoven pod původním názvem v roce 1968 a v roce 1969 se jeho členové pustili do stavby zcela nového devítijamkového hřiště na pozemku zvaném Na hliníku; výstavba probíhala na začátku 70. let a první turnaj obnoveného klubu se konal na podzim roku 1977. Přesně to samé hřiště, ukryté v Přírodním parku Košíře-Motol jen pár tramvajových zastávek od historického centra, se hraje dodnes.

🥚 Velikonoční vajíčko: Někde pod stromy dnešního Přírodního parku Košíře-Motol leží duch původního hřiště z roku 1926 — les, který měl jeho stopy vymazat z mapy, je dnes sám chráněnou přírodní krajinou, takže se ze státního protigolfového lesa nakonec stal jeden z nejoblíbenějších pražských parků.`,

      zh: `勇敢的冒险家，欢迎来到布拉格高尔夫俱乐部（Golf Club Praha）——这个国家历史最悠久的高尔夫俱乐部，也可能是唯一一个曾被国家蓄意犁平球道、种上森林之后依然幸存下来的俱乐部。

俱乐部成立于1926年，首任名誉主席是首任捷克斯洛伐克总统之子扬·马萨里克（Jan Masaryk）；同年，一座九洞球场就在摩托尔盆地建成。好日子在戏剧性的转折中戛然而止：1948年共产主义政变后，高尔夫被贴上"资产阶级消遣"的标签，俱乐部被迫与其他组织合并，这项运动本身也在1950年被彻底禁止，1953年至1960年间，原来的果岭被犁平并重新种上了森林——这大概是这项运动历史上关闭得最彻底的一座球场了。俱乐部本身只作为一个念想存活了下来，静静地熬过了二十年的共产主义时期。

布拉格高尔夫俱乐部于1968年以原名恢复运营，1969年，会员们着手在附近一块名为"Na hliníku"的地块上重建了一座全新的九洞球场；建设工程持续到70年代初，复兴后俱乐部的首场比赛终于在1977年秋天举行。如今仍在使用的，正是同一座球场——就藏在距离历史中心仅几站电车之遥的科希热-摩托尔自然公园之中。

🥚 彩蛋：如今科希热-摩托尔自然公园的树林之下，仍埋藏着1926年那座旧球场的"幽灵"——当初为了将它从地图上抹去而刻意栽种的森林，如今本身已成为一片受保护的自然景观，也就是说，当年那片"反高尔夫森林"，最终反倒变成了布拉格最受珍视的公园之一。`,
    },
  },
  {
    name: 'Prague Semmering (Hlubočepy Viaducts)',
    slug: 'hlubocepske-viadukty',
    localizedNames: { cz: 'Pražský Semmering (Hlubočepské viadukty)', zh: '布拉格塞默灵（赫卢博切皮高架桥）' },
    labels: ['transport', 'historical', 'architecture'],
    coordinates: { lat: 50.04124678798861, lng: 14.390603893433576 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Hlubo%C4%8Depsk%C3%A9_viadukty',
    description: {
      en: `Brave adventurer, welcome to the Prague Semmering (Pražský Semmering) — a modest stretch of suburban railway that borrowed its nickname from a legendary Alpine mountain line, and never quite lived up to the comparison, but gets full credit for trying.

Officially, this is the Hlubočepy Viaducts: two stone railway bridges built between 1870 and 1872 as part of a branch of the Buštěhrad Railway, engineered by Wilhelm Ast for the Klein brothers' firm. Freight trains began rattling across them on 3 July 1872, with passengers following that September. Because the line has to curve almost a full 180 degrees around Hlubočepy to manage the terrain, 19th-century railwaymen nicknamed the whole run the "Prague Semmering," after the far more dramatic Semmering railway that carried Habsburg trains from Vienna towards the Adriatic port of Trieste over a genuine Alpine pass. The southeastern viaduct here stretches 115 metres across seven arches up to 25 metres tall; its northwestern twin spans the Dalejský stream valley for 92 metres across five arches. Modest by Alpine standards, certainly — but a proper stone viaduct all the same.

Both viaducts were fully overhauled in a 2018–2019 reconstruction and have been protected as cultural heritage since 2006.

🥚 Easter Egg: The real Semmering railway in Austria is a UNESCO World Heritage Site, one of the first mountain railways ever built. Prague's version never got anywhere near that recognition — but it's kept its borrowed nickname for over 150 years regardless, which is either admirable persistence or a very long-running joke nobody bothered to correct.`,

      cz: `Statečný dobrodruhu, vítej u Pražského Semmeringu — skromného úseku předměstské železnice, který si vypůjčil přezdívku od legendární alpské horské trati a nikdy jí úplně nedostál, ale za snahu si body rozhodně zaslouží.

Oficiálně jde o Hlubočepské viadukty: dva kamenné železniční mosty postavené mezi lety 1870 a 1872 jako součást odbočky Buštěhradské dráhy, navržené Wilhelmem Astem pro firmu bratří Kleinů. Nákladní vlaky po nich poprvé projely 3. července 1872, cestující následovali téhož roku v září. Protože trať musí kvůli terénu opsat kolem Hlubočep téměř úplný půlkruh, dostal celý úsek už v 19. století přezdívku "Pražský Semmering" — podle mnohem dramatičtější rakouské tratě Semmering, která vozila habsburské vlaky z Vídně směrem k jadranskému přístavu v Terstu přes skutečný alpský průsmyk. Jihovýchodní viadukt zde měří 115 metrů a má sedm oblouků vysokých až 25 metrů; jeho severozápadní dvojče překlenuje údolí Dalejského potoka v délce 92 metrů pěti oblouky. Ve srovnání s Alpami skromné, to ano — ale pořádný kamenný viadukt to pořád je.

Oba viadukty prošly kompletní rekonstrukcí v letech 2018–2019 a od roku 2006 jsou chráněny jako kulturní památka.

🥚 Velikonoční vajíčko: Skutečná rakouská trať Semmering je zapsaná na seznamu UNESCO jako jedna z vůbec prvních horských železnic na světě. Ta pražská se takovému uznání ani zdaleka nepřiblížila — přesto si svou vypůjčenou přezdívku hrdě nese už přes 150 let, což je buď obdivuhodná vytrvalost, nebo velmi dlouhý vtip, který si nikdo nedal práci opravit.`,

      zh: `勇敢的冒险家，欢迎来到布拉格塞默灵（Pražský Semmering）——一段朴素的市郊铁路，借用了阿尔卑斯山传奇山地铁路的绰号，虽然从未真正配得上这个称号，但这份"敢想敢用"的精神值得加分。

官方名称是赫卢博切皮高架桥（Hlubočepské viadukty）：两座石造铁路桥，建于1870年至1872年间，是布什捷赫拉德铁路支线的一部分，由威廉·阿斯特（Wilhelm Ast）为克莱因兄弟公司设计。1872年7月3日，货运列车首次驶过这两座桥，同年9月客运服务也随之开通。由于地形所限，铁路线不得不绕着赫卢博切皮几乎转上整整180度的弯，19世纪的铁路工人便给这整段线路起了"布拉格塞默灵"的绰号——得名于更为壮观的奥地利塞默灵铁路，那条线路曾载着哈布斯堡王朝的列车穿越真正的阿尔卑斯山口，从维也纳一路开往亚得里亚海畔的的里雅斯特港。这里的东南高架桥全长115米，共有七座拱洞，最高达25米；与之相对的西北高架桥横跨达莱伊斯基溪谷，全长92米，共五座拱洞。和阿尔卑斯山的原版相比自然朴素得多——但终归也是一座正儿八经的石造高架桥。

两座高架桥都在2018至2019年间经历了全面翻修，并自2006年起被列为文化保护遗产。

🥚 彩蛋：奥地利那条真正的塞默灵铁路是联合国教科文组织世界遗产，也是世界上最早建成的山地铁路之一。布拉格这一段从未获得过任何类似的殊荣——但它依然骄傲地扛着这个"借来的"绰号走过了150多年，这究竟是令人钦佩的执着，还是一个没人愿意纠正的超长玩笑，就见仁见智了。`,
    },
  },
  {
    name: 'Hlubočepy Chateau',
    slug: 'hlubocepsky-zamecek',
    localizedNames: { cz: 'Hlubočepský zámeček', zh: '赫卢博切皮小城堡' },
    labels: ['villa', 'historical', 'architecture'],
    coordinates: { lat: 50.04260250014619, lng: 14.404065134318637 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Hlubo%C4%8Depy_(z%C3%A1mek)',
    description: {
      en: `Brave adventurer, welcome to the Hlubočepy Chateau (Hlubočepský zámeček) — a fortified house that spent four centuries changing hands between noblemen, an imperial councillor, an actual mortgage to the Jesuits, and a state education fund before finally settling down as, of all things, a wedding venue.

The story starts in 1571, when Jan Kutovec z Úrazu built a fortified manor house on this spot. It passed in 1623 to Pavel Michna z Vacínova, an imperial councillor, whose son later needed cash badly enough to mortgage the whole estate to the Jesuit order for 3,000 gulden. The Jesuits took the deal seriously: in 1669 they rebuilt the old fortification into a proper chateau and made it the administrative centre of their local estate. That arrangement lasted exactly a century, until the Jesuit order itself was dissolved in 1773 and the property was handed over to a state study fund. Its current neoclassical façade is generally credited to a later owner, Count František Antonín Desfours.

Today the building carries the official heritage designation "tvrz Raudnitzův dům" and is privately owned, hosting weddings and cultural events in rooms that once housed Jesuit administrators.

🥚 Easter Egg: A building mortgaged to a religious order to settle a nobleman's debts now earns its living hosting other people's wedding receptions — proving that whatever else changes over four hundred years, somebody is always trying to make rent on this particular hill.`,

      cz: `Statečný dobrodruhu, vítej u Hlubočepského zámečku — tvrze, která během čtyř staletí prošla z rukou drobné šlechty přes císařského radu, skutečnou zástavu jezuitům a studijní fond, aby nakonec skončila coby svatební místo.

Příběh začíná v roce 1571, kdy zde Jan Kutovec z Úrazu postavil opevněnou tvrz. V roce 1623 přešla do rukou císařského rady Pavla Michny z Vacínova, jehož syn později tak zoufale potřeboval peníze, že celé panství zastavil jezuitskému řádu za 3000 zlatých rýnských. Jezuité to vzali vážně: v roce 1669 přestavěli starou tvrz na pořádný zámek a udělali z něj správní centrum svého zdejšího statku. Toto uspořádání vydrželo přesně jedno století, dokud nebyl v roce 1773 zrušen samotný jezuitský řád a majetek nepřešel pod studijní fond. Za svou současnou klasicistní podobu zámeček vděčí pravděpodobně pozdějšímu majiteli, hraběti Františku Antonínu Desfoursovi.

Dnes budova nese oficiální památkovou ochranu pod názvem "tvrz Raudnitzův dům" a je v soukromém vlastnictví — v sálech, kde kdysi sídlili jezuitští správci, se dnes konají svatby a společenské akce.

🥚 Velikonoční vajíčko: Budova kdysi zastavená náboženskému řádu kvůli dluhům jednoho šlechtice si dnes vydělává na živobytí pořádáním cizích svatebních hostin — důkaz, že ať se za čtyři sta let změní cokoliv, na tomhle kopci se vždycky někdo snaží uhradit nájem.`,

      zh: `勇敢的冒险家，欢迎来到赫卢博切皮小城堡（Hlubočepský zámeček）——这座堡垒式宅邸在四百年间辗转于贵族、一位皇室顾问、被真实抵押给耶稣会，最终归入国家教育基金之手，如今竟成了一处婚礼场地。

故事始于1571年，扬·库托维茨·兹·乌拉祖（Jan Kutovec z Úrazu）在此建起了一座设防宅邸。1623年，宅邸转到了皇室顾问帕维尔·米赫纳·兹·瓦齐诺瓦（Pavel Michna z Vacínova）手中，他的儿子后来急需现金，索性把整片庄园以3000古尔登的价格抵押给了耶稣会。耶稣会对此十分认真：1669年，他们将旧堡垒改建成了一座真正的城堡，并将其作为当地庄园的管理中心。这一安排恰好维持了整整一个世纪，直到1773年耶稣会本身被解散，产业随即转归国家教育基金。如今这座建筑的新古典主义外观，通常被归功于后来的业主——弗朗蒂谢克·安东宁·德斯福尔伯爵（František Antonín Desfours）。

如今，这座建筑正式列入文物保护名录，登记名称为"劳德尼茨之家"（tvrz Raudnitzův dům），归私人所有——曾经容纳耶稣会管理人员的厅堂，如今用来举办婚礼和社交活动。

🥚 彩蛋：一座曾因贵族的债务被抵押给宗教修会的建筑，如今靠承办别人的婚宴维持生计——这证明无论四百年间世事如何变迁，这座山丘上总有人在想办法凑够"房租"。`,
    },
  },
  {
    name: 'Barrandov Bridge',
    slug: 'barrandovsky-most',
    localizedNames: { cz: 'Barrandovský most', zh: '巴兰多夫大桥' },
    labels: ['bridge', 'communism', 'historical'],
    coordinates: { lat: 50.03922406682129, lng: 14.407064052015377 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Barrandovsk%C3%BD_most',
    description: {
      en: `Brave adventurer, welcome to Barrandovský most — a concrete brutalist giant that took a full decade to build, spent its first two years honouring a communist president, and now carries more traffic every single day than the population of some entire Czech towns.

People have crossed the Vltava here since at least the 18th century, originally via a simple pontoon bridge. Grander plans followed independence: after 1918, engineers dreamed up an ambitious pair of bridges at different heights to link Hlubočepy with Braník and Dívčí hrady with Kavčí hory. Nothing came of it for decades, until in August 1976 planners finally settled on a single cable-stayed design. Construction began in 1978 and dragged on for ten years: the southern half opened to traffic on 20 September 1983, with the northern half following only in 1988. For its first two years the bridge was officially named after communist president Antonín Zápotocký — a title quietly dropped in 1990. Architect Karel Filsak designed the interchange, built almost entirely from raw brutalist concrete, and huge sculptural reliefs by Josef Klimeš were added to the bridgeheads in 1989–1990, right as the political system that commissioned the bridge was collapsing around it.

Today around 142,000 vehicles cross it daily, and a major 2022–2024 reconstruction — finished a year ahead of schedule, though nearly double the original budget — kept the whole structure standing for whatever comes next.

🥚 Easter Egg: The bridge's decade-long construction timeline (1978–1988) almost exactly bookends the last decade of Czechoslovak communism itself — groundbreaking under one regime, finishing touches added just as the Velvet Revolution swept the whole system away.`,

      cz: `Statečný dobrodruhu, vítej u Barrandovského mostu — brutalistického betonového obra, jehož stavba trvala celou dekádu, první dva roky nesl jméno komunistického prezidenta a dnes po něm denně projede víc aut, než kolik mají obyvatel některá celá česká města.

Lidé tady přes Vltavu chodí přinejmenším od 18. století, původně po jednoduchém pontonovém mostě. Po vzniku republiky přišly velkorysejší plány: po roce 1918 inženýři vymysleli ambiciózní dvojici mostů v různých výškách, které měly spojit Hlubočepy s Braníkem a Dívčí hrady s Kavčími horami. Desítky let se nic nedělo, dokud se v srpnu 1976 projektanti konečně nerozhodli pro variantu jediného zavěšeného mostu. Stavba začala v roce 1978 a táhla se deset let: jižní polovina byla zprovozněna 20. září 1983, severní následovala až v roce 1988. První dva roky nesl most oficiálně jméno komunistického prezidenta Antonína Zápotockého — titul, který v roce 1990 tiše zmizel. Architektem dopravního uzlu byl Karel Filsak, celý postavený téměř výhradně z holého brutalistického betonu, a mohutné sochařské reliéfy Josefa Klimeše přibyly na předmostích v letech 1989–1990 — přesně ve chvíli, kdy se politický systém, který most zadal, kolem něj sám hroutil.

Dnes po něm denně projede kolem 142 000 vozidel a velká rekonstrukce v letech 2022–2024 — dokončená o rok dříve, byť za skoro dvojnásobný rozpočet — udržela celou konstrukci ve stavu pro to, co přijde dál.

🥚 Velikonoční vajíčko: Desetiletá stavba mostu (1978–1988) téměř přesně ohraničuje poslední dekádu československého komunismu — základní kámen byl položen za jednoho režimu, poslední detaily přibývaly přesně ve chvíli, kdy sametová revoluce celý systém smetla.`,

      zh: `勇敢的冒险家，欢迎来到巴兰多夫大桥（Barrandovský most）——一座耗时整整十年建成的粗野主义混凝土巨构，头两年还顶着一位共产党总统的名字，如今每天承载的车流量比不少捷克小城镇的总人口还多。

至少从18世纪起，人们就已经在这里跨越伏尔塔瓦河，最初靠的是一座简易浮桥。捷克斯洛伐克独立后，规划变得更加宏大：1918年后，工程师们构想出一对高度不同的桥梁，分别连接赫卢博切皮与布拉尼克、以及迪芙齐赫拉迪与卡夫奇霍雷。这个计划搁置了几十年，直到1976年8月，规划者才最终选定了单一斜拉桥的方案。工程于1978年动工，一拖就是十年：南半段于1983年9月20日通车，北半段直到1988年才完工。头两年，这座桥官方名称是以共产党总统安东宁·扎波托茨基（Antonín Zápotocký）命名的——这个称谓在1990年被悄然撤下。交通枢纽的设计者是建筑师卡雷尔·菲尔萨克（Karel Filsak），整座桥几乎全部由裸露的粗野主义混凝土建成；1989至1990年间，雕塑家约瑟夫·克利梅什（Josef Klimeš）为桥头增添了巨型雕塑浮雕——恰逢当初下令建桥的那个政治体制在它周围土崩瓦解之时。

如今，每天约有14.2万辆车经过这座桥；2022至2024年间的一次大规模翻修——虽然预算几乎翻倍，却提前一年完工——让整座桥梁得以继续支撑接下来的岁月。

🥚 彩蛋：这座桥长达十年的建设周期（1978-1988），几乎正好框住了捷克斯洛伐克共产主义统治的最后十年——奠基时是一个政权，而收尾的细节工程，恰好赶上天鹅绒革命席卷整个体制的那一刻。`,
    },
  },
  {
    name: 'Dvorecký Bridge',
    slug: 'dvorecky-most',
    localizedNames: { cz: 'Dvorecký most', zh: '德沃雷茨基大桥' },
    labels: ['bridge', 'modern', 'architecture'],
    coordinates: { lat: 50.05030900181062, lng: 14.413006251866154 },
    rarity: 'superior',
    xpReward: 30,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Dvoreck%C3%BD_most',
    description: {
      en: `Brave adventurer, welcome to Dvorecký most — Prague's newest bridge across the Vltava, opened in 2026 after a construction saga so expensive it nearly doubled its own budget, and so committed to trams and pedestrians that regular cars aren't allowed on it at all.

This is the 21st bridge to cross the Vltava within Prague, linking Podolí and Smíchov with a striking 361-metre span of white high-strength concrete arranged into three Cubist-style arches — a nod to the distinctly Czech architectural movement that flourished a century earlier. The city approved the construction tender in June 2021 at an estimated 972 million crowns; ground was broken in September 2022, and complicated geology beneath the riverbed pushed the final bill all the way up to roughly 1.97 billion crowns. The bridge finally opened to the public on 18 April 2026, following a ceremonial opening the day before — and true to its transit-first design, it carries trams, buses, pedestrians, cyclists, and emergency vehicles, but deliberately excludes private cars.

Underneath the deck, artist Krištof Kintera installed a genuinely unusual attraction: a "light garden" made from decommissioned street lamps gathered from more than eighty countries around the world.

🥚 Easter Egg: Somewhere in that forest of lampposts under the bridge stands a streetlight from a country you've probably never associated with Prague at all — the light garden is essentially a tiny, glowing atlas of the world's street furniture, hiding in plain sight beneath one of the city's newest crossings.`,

      cz: `Statečný dobrodruhu, vítej u Dvoreckého mostu — nejnovějšího pražského mostu přes Vltavu, otevřeného v roce 2026 po stavební anabázi tak nákladné, že si téměř zdvojnásobila vlastní rozpočet, a tak zaměřené na tramvaje a chodce, že běžná auta po ní vůbec nesmí.

Jde o 21. most přes Vltavu v Praze, spojující Podolí se Smíchovem výrazným 361metrovým obloukem z bílého vysokopevnostního betonu, poskládaným do tří kubistických oblouků — poklona ryze české architektonické avantgardě, která vzkvétala o století dříve. Město schválilo tendr na stavbu v červnu 2021 s odhadovaným rozpočtem 972 milionů korun; základní kámen byl položen v září 2022 a komplikovaná geologie říčního dna nakonec vyhnala konečnou cenu až na zhruba 1,97 miliardy korun. Most byl veřejnosti otevřen 18. dubna 2026, po slavnostním otevření o den dříve — a věrný svému zaměření na hromadnou dopravu vozí tramvaje, autobusy, chodce, cyklisty a vozidla záchranných složek, ale osobní auta na něj záměrně nesmí.

Pod mostovkou instaloval umělec Krištof Kintera opravdu neobvyklou atrakci: "světelnou zahradu" vytvořenou z vyřazených pouličních lamp sesbíraných z více než osmdesáti zemí světa.

🥚 Velikonoční vajíčko: Někde v tom lese lampových sloupů pod mostem stojí i pouliční lampa ze země, kterou byste s Prahou asi vůbec nespojovali — světelná zahrada je v podstatě malý, zářící atlas pouličního mobiliáře celého světa, ukrytý na očích všem pod jedním z nejnovějších pražských mostů.`,

      zh: `勇敢的冒险家，欢迎来到德沃雷茨基大桥（Dvorecký most）——布拉格横跨伏尔塔瓦河最新的一座桥梁，2026年建成通车，工程一路"烧钱"到预算几乎翻倍，而且对有轨电车和行人一片赤诚——普通私家车完全不准上桥。

这是布拉格境内第21座跨越伏尔塔瓦河的桥梁，以一道引人注目的361米白色高强度混凝土桥身连接波多利与斯米霍夫，桥身由三座立体主义风格的拱券组成——向一个世纪前盛极一时的捷克本土建筑流派致敬。市政府于2021年6月批准了这项工程招标，预算约为9.72亿克朗；工程于2022年9月动工，河床下复杂的地质条件最终把总造价推高到约19.7亿克朗。这座桥于2026年4月18日正式向公众开放，此前一天已举行了落成典礼——而它也确实贯彻了"公交优先"的设计理念：只允许有轨电车、公交车、行人、骑行者和应急车辆通行，私家车则被特意排除在外。

在桥面之下，艺术家克日什托夫·金泰拉（Krištof Kintera）打造了一处相当特别的装置：一座由来自全球八十多个国家、已退役的路灯组成的"光之花园"。

🥚 彩蛋：在桥下那片路灯柱组成的"森林"里，藏着一盏来自某个你大概从未把它和布拉格联系在一起的国家的路灯——这座光之花园本质上就是一座微缩的、闪闪发光的全球街道家具图鉴，静静藏身于这座布拉格最新桥梁的桥面之下。`,
    },
  },
  {
    name: 'Barrandov Film Studios',
    slug: 'filmove-ateliery-barrandov',
    localizedNames: { cz: 'Filmové ateliéry Barrandov', zh: '巴兰多夫电影制片厂' },
    labels: ['cultural', 'historical', 'architecture'],
    coordinates: { lat: 50.03081931170479, lng: 14.39164133572945 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Barrandov_Studios',
    description: {
      en: `Brave adventurer, welcome to Barrandov Film Studios — founded by the father and uncle of a future Czech president, confiscated by the Nazis, nationalized by the communists, and now the address Hollywood calls when it needs a European backlot for its next blockbuster.

The studios exist because of a real-estate sales pitch: in the early 1930s Václav Maria Havel planned a luxury housing development on a hill on Prague's outskirts, and his brother Miloš — already a prominent figure in Czechoslovak cinema — suggested adding a state-of-the-art film studio to the plan. Construction moved remarkably fast for something this ambitious: ground was broken on 23 November 1931, and the very first scene was shot on 25 January 1933, on what was, at the time, the most modern film studio complex in Europe. That speed and sophistication didn't survive the century intact. The 1939 Nazi occupation brought confiscation without so much as asking Miloš Havel or the board, and by 1940 he was forced to sell his majority stake outright; he later fled to Munich and never set foot in Czechoslovakia again. Liberation brought no relief for private ownership — President Edvard Beneš nationalized Czechoslovak film after the war, and the studios stayed in state hands until 1991, two years after the Velvet Revolution finally allowed them to be privatized.

Today Barrandov is the largest film studio complex in the Czech Republic and one of the biggest in Europe, regularly hosting major international productions — including instalments of Mission: Impossible and Casino Royale — alongside Czech domestic film and television work.

🥚 Easter Egg: The whole area is named after Joachim Barrande, a French geologist who spent decades studying the trilobite-rich fossil beds on this exact hillside — meaning one of the world's great film capitals is named not after a filmmaker at all, but after a 19th-century paleontologist who never saw a single frame shot there.`,

      cz: `Statečný dobrodruhu, vítej ve Filmových ateliérech Barrandov — založených otcem a strýcem budoucího českého prezidenta, zabavených nacisty, znárodněných komunisty a dnes adresou, kterou si Hollywood vybírá, kdykoli potřebuje evropskou kulisu pro svůj další trhák.

Ateliéry vznikly vlastně z realitního záměru: na začátku 30. let plánoval Václav M. Havel na kopci na okraji Prahy luxusní rezidenční čtvrť a jeho bratr Miloš — už tehdy významná osobnost československé kinematografie — navrhl do projektu přidat moderní filmový ateliér. Výstavba postupovala na svou dobu neuvěřitelně rychle: základní kámen byl položen 23. listopadu 1931 a úplně první scéna se natáčela už 25. ledna 1933, v tehdy nejmodernějším filmovém komplexu v Evropě. Tahle rychlost a vyspělost se ale nedochovaly celé století beze změny. Nacistická okupace v roce 1939 přinesla zabavení bez jakéhokoliv souhlasu Miloše Havla či správní rady a v roce 1940 byl donucen prodat svůj většinový podíl; později odešel do Mnichova a do Československa se už nikdy nevrátil. Osvobození nepřineslo úlevu soukromému vlastnictví — prezident Edvard Beneš po válce znárodnil československou kinematografii a ateliéry zůstaly v rukou státu až do roku 1991, dva roky po sametové revoluci, která konečně umožnila jejich privatizaci.

Dnes je Barrandov největším filmovým ateliérovým komplexem v Česku a jedním z největších v Evropě, kde se pravidelně natáčí velké mezinárodní produkce — včetně dílů Mission: Impossible a Casino Royale — vedle českých domácích filmů a televizní tvorby.

🥚 Velikonoční vajíčko: Celá oblast nese jméno po Joachimu Barrandovi, francouzském geologovi, který na tomto přesném kopci strávil desítky let studiem nalezišť zkamenělin bohatých na trilobity — takže jedna z filmových velmocí světa nese jméno vůbec ne po filmaři, ale po devatenáctistoletém paleontologovi, který tu nikdy neviděl natočit jediný záběr.`,

      zh: `勇敢的冒险家，欢迎来到巴兰多夫电影制片厂（Filmové ateliéry Barrandov）——由一位未来捷克总统的父亲和伯父共同创立，曾被纳粹没收，又被共产党收归国有，如今则是好莱坞每次需要欧洲外景地拍摄大片时首先想到的地址。

这座制片厂的诞生，其实源于一次房地产推销：20世纪30年代初，瓦茨拉夫·M·哈维尔（Václav M. Havel）计划在布拉格郊外的一座山丘上开发豪华住宅区，他的兄弟米洛什（Miloš）——当时已是捷克斯洛伐克电影界的重要人物——提议在项目中加入一座最先进的电影制片厂。以如此宏大的规模而言，工程进展快得惊人：1931年11月23日举行奠基仪式，1933年1月25日便拍摄了第一个镜头，而当时它已是欧洲最现代化的电影制片厂。然而，这份速度与先进并未完整地熬过整个世纪。1939年纳粹占领带来了强行没收，甚至没有征询米洛什·哈维尔或董事会的意见；到1940年，他被迫出售了自己的多数股权；此后他逃往慕尼黑，终生再未踏足捷克斯洛伐克。战后的解放也未能让私人所有权得以恢复——总统爱德华·贝奈斯（Edvard Beneš）战后将捷克斯洛伐克电影业收归国有，制片厂一直归国家所有，直到1991年——也就是天鹅绒革命之后两年，才终于得以私有化。

如今，巴兰多夫是捷克最大的电影制片厂综合体，也是欧洲规模最大的制片厂之一，经常承接重量级国际制作——包括《碟中谍》系列和《007：大战皇家赌场》等——同时也持续拍摄捷克本土电影与电视作品。

🥚 彩蛋：整个区域的名字来自法国地质学家约阿希姆·巴兰德（Joachim Barrande），他曾在这同一座山丘上花费数十年研究富含三叶虫化石的地层——这意味着，这座世界级的电影重镇，名字压根不是来自某位电影人，而是来自一位19世纪的古生物学家，他终其一生都没能在这里看过哪怕一个镜头的拍摄。`,
    },
  },
  {
    name: 'Chaplin – Silent Film Sculpture',
    slug: 'plastika-chaplin-nemy-film',
    localizedNames: { cz: 'Plastika Charlieho Chaplina a němého filmu', zh: '卓别林与默片雕塑' },
    labels: ['monument', 'modern', 'hidden-gem'],
    coordinates: { lat: 50.03669474737618, lng: 14.378528078724411 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Chaplin — Plastika němého filmu, a four-metre granite-and-aluminium tribute to the world's most famous silent-film tramp, standing watch over a Prague housing estate that, appropriately enough, is named entirely after him.

Sculptor Vladimír Preclík won a design competition for the piece and unveiled it in 1988, using granite paired with hydronalium — an aluminium alloy that was, in its own quiet way, about as cutting-edge as materials got in late-communist Czechoslovakia. Rather than a single static statue, Preclík built six separate silhouettes capturing six phases of movement, so that walking past the sculpture reads like watching Charlie Chaplin's tramp character step, frame by frame, right out of the film screen and into the square that bears his name — Chaplinovo náměstí, the centrepiece of the wider Barrandov housing estate designed by architects Zdeněk Hölzel and Jan Kerel.

🥚 Easter Egg: Chaplin never set foot in communist Czechoslovakia, let alone this particular Prague housing estate — yet somehow he ended up with a public square and a four-metre aluminium monument here decades after his death, which is a stranger outcome than most of his own film plots.`,

      cz: `Statečný dobrodruhu, vítej u plastiky Chaplin — Plastika němého filmu, čtyřmetrové pocty žulou a hliníkem tomu nejslavnějšímu tulákovi z éry němého filmu, která hlídá pražské sídliště pojmenované celé po něm.

Sochař Vladimír Preclík vyhrál na dílo soutěž a odhalil ho v roce 1988, přičemž použil žulu v kombinaci s hydronáliem — hliníkovou slitinou, která byla svým způsobem tak moderní, jak jen materiály v pozdně komunistickém Československu mohly být. Místo jediné statické sochy postavil Preclík šest samostatných siluet zachycujících šest fází pohybu, takže procházka kolem plastiky působí, jako by tulák Charlieho Chaplina vystupoval snímek po snímku přímo z filmového plátna na náměstí, které nese jeho jméno — Chaplinovo náměstí, střed rozsáhlejšího sídliště Barrandov navrženého architekty Zdeňkem Hölzelem a Janem Kerelem.

🥚 Velikonoční vajíčko: Chaplin nikdy nevkročil do komunistického Československa, natož na tohle konkrétní pražské sídliště — a přesto tu desítky let po své smrti nějak skončil s vlastním náměstím a čtyřmetrovým hliníkovým pomníkem, což je podivnější zvrat, než většina zápletek jeho vlastních filmů.`,

      zh: `勇敢的冒险家，欢迎来到"卓别林——默片雕塑"（Chaplin – Plastika němého filmu）——这座四米高的花岗岩与铝合金雕塑，向这位默片史上最著名的流浪汉致敬，静静守望着一整片以他名字命名的布拉格住宅区。

雕塑家弗拉基米尔·普雷茨利克（Vladimír Preclík）赢得设计竞赛后，于1988年将作品揭幕，材料采用花岗岩搭配"海德罗纳留姆"（hydronalium，一种铝合金）——在后共产主义时代晚期的捷克斯洛伐克，这在某种意义上已经算得上相当"前沿"的材料了。普雷茨利克没有做成一尊静态雕像，而是塑造了六个独立的剪影，分别捕捉动作的六个阶段，于是从雕塑旁走过时，就仿佛看到卓别林扮演的流浪汉一格一格地从银幕上走了出来，踏入以他名字命名的这座广场——卓别林广场（Chaplinovo náměstí），也是由建筑师兹德涅克·赫尔泽尔（Zdeněk Hölzel）与扬·克雷尔（Jan Kerel）设计的更大规模的巴兰多夫住宅区的核心地带。

🥚 彩蛋：卓别林从未踏足过共产主义时期的捷克斯洛伐克，更别提这片具体的布拉格住宅区了——可他去世几十年后，却不知怎么在这里拥有了一座以自己命名的广场和一尊四米高的铝制纪念雕塑，这个结局，恐怕比他自己电影里的大多数剧情还要离奇。`,
    },
  },
  {
    name: 'Barrandov Terraces',
    slug: 'barrandovske-terasy',
    localizedNames: { cz: 'Barrandovské terasy', zh: '巴兰多夫平台餐厅' },
    labels: ['historical', 'architecture', 'restaurants-and-cafes'],
    coordinates: { lat: 50.03754648787407, lng: 14.40240135975072 },
    rarity: 'superior',
    xpReward: 30,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Barrandovsk%C3%A9_terasy',
    description: {
      en: `Brave adventurer, welcome to the Barrandov Terraces (Barrandovské terasy) — a restaurant complex modelled on a San Francisco cliffside diner, so popular in its prime that it served up to 3,000 Sunday lunches at a time, and later ended up, entirely by inheritance, in the hands of a former Czech president's family.

Construction began on 24 February 1928 at the initiative of entrepreneur Václav M. Havel, who had been struck by the Cliff House restaurant during a trip to San Francisco and brought photographs of it home for architect Max Urban to work from. The result opened on 4 October 1929 to roughly 50,000 visitors, and quickly became a magnet for Prague high society and ordinary weekend crowds alike — in peak summer season, the kitchen turned out up to 3,000 lunches on a single Sunday. In 1930 Havel doubled down, building what was then the most modern swimming pool in Europe directly beneath the Barrandov cliff: a 50-by-18-metre pool with 10-metre and 5-metre diving platforms, stands for 4,000 spectators, and food delivered straight from the terraces above via a dedicated dining lift.

The good times ended with the February 1948 communist coup, which nationalized the whole complex; the pool itself limped on until 1966 before finally closing. Ownership only returned to the Havel family in 1992 through post-revolution restitution — Václav Havel later transferred his share to his second wife, Dagmar Havlová, who eventually bought out her sister-in-law's stake as well. Restoration work finally began in earnest in 2024, adding two new buildings with 61 apartments alongside the restored original terraces.

🥚 Easter Egg: The entrepreneur who built this San Francisco-inspired clifftop pleasure palace in 1928 was the father of Miloš Havel, founder of the Barrandov Film Studios just up the same hill — meaning this one family managed to build both Prague's most glamorous restaurant terrace and one of Europe's biggest film studios within a few years of each other, on the very same outcrop of rock.`,

      cz: `Statečný dobrodruhu, vítej na Barrandovských terasách — restauračním komplexu podle vzoru útesové restaurace v San Francisku, který byl ve své nejlepší době tak oblíbený, že dokázal v jeden den podávat až 3000 nedělních obědů, a později skončil čistě dědictvím v rukou rodiny bývalého českého prezidenta.

Stavba začala 24. února 1928 z podnětu podnikatele Václava M. Havla, kterého při cestě do San Francisca uchvátila restaurace Cliff House a který si odtud domů přivezl fotografie, podle nichž pak pracoval architekt Max Urban. Výsledek byl slavnostně otevřen 4. října 1929 za účasti zhruba 50 000 návštěvníků a rychle se stal magnetem jak pro pražskou smetánku, tak pro obyčejné víkendové davy — v plné letní sezóně kuchyně dokázala v jednu neděli připravit až 3000 obědů. V roce 1930 Havel přidal na sázce ještě víc: přímo pod Barrandovskou skálou postavil tehdy nejmodernější plovárnu v Evropě — bazén o rozměrech 50 na 18 metrů s desetimetrovým a pětimetrovým skokanským můstkem, tribunami pro 4000 diváků a jídlem dováženým přímo z teras nahoře speciálním jídelním výtahem.

Dobré časy skončily s únorovým komunistickým převratem 1948, který celý komplex znárodnil; samotný bazén ještě dojel až do roku 1966, než se konečně zavřel. Vlastnictví se do rukou rodiny Havlových vrátilo až v roce 1992 porevoluční restitucí — Václav Havel později převedl svůj podíl na svou druhou manželku Dagmar Havlovou, která si nakonec odkoupila i podíl své švagrové. Obnova naplno začala až v roce 2024, kdy k restaurovaným původním terasám přibyly dvě nové budovy s 61 byty.

🥚 Velikonoční vajíčko: Podnikatel, který v roce 1928 postavil tenhle útesový palác rozkoše inspirovaný San Franciskem, byl otcem Miloše Havla, zakladatele Filmových ateliérů Barrandov kousek výš na témže kopci — jedna rodina tak během pár let dokázala na jediném skalním výběžku postavit jak nejhlamournější pražskou restaurační terasu, tak jedno z největších evropských filmových studií.`,

      zh: `勇敢的冒险家，欢迎来到巴兰多夫平台餐厅（Barrandovské terasy）——一座仿照旧金山悬崖餐厅打造的餐饮建筑群，鼎盛时期曾一天供应多达3000份周日午餐，后来竟因单纯的家族继承，落入了一位前捷克总统家族的手中。

工程始于1928年2月24日，由企业家瓦茨拉夫·M·哈维尔（Václav M. Havel）发起——他在旧金山旅行时被"悬崖之家"（Cliff House）餐厅深深打动，特意带回照片交给建筑师马克斯·乌尔班（Max Urban）作为设计参考。这座建筑于1929年10月4日隆重开幕，吸引了约五万名游客，很快便成了布拉格上流社会与普通周末人群共同的聚集地——在夏季旺季，厨房曾在一个周日之内做出多达3000份午餐。1930年，哈维尔再加码：直接在巴兰多夫悬崖脚下建起了当时欧洲最现代化的游泳池——一座50米长、18米宽的泳池，配有10米和5米高的跳水台，看台可容纳4000名观众，餐食则通过专用的送餐电梯直接从上方的平台送下来。

好日子在1948年2月共产主义政变中戛然而止，整个建筑群随即被收归国有；游泳池本身又勉强维持到1966年才最终关闭。产权直到1992年革命后的财产归还程序才重新回到哈维尔家族手中——瓦茨拉夫·哈维尔后来将自己的份额转给了第二任妻子达格玛·哈维洛娃（Dagmar Havlová），她后来又买下了小姑子的那一份。真正的修复工程直到2024年才全面展开，在修复原有平台建筑的同时，又新增了两栋共61套公寓的建筑。

🥚 彩蛋：1928年建造这座受旧金山启发的悬崖"欢乐宫殿"的企业家，正是巴兰多夫电影制片厂创始人米洛什·哈维尔的父亲——制片厂就在同一座山丘再往上一点。也就是说，同一个家族在短短几年间，在同一处岩壁上，先后建起了布拉格最奢华的餐饮平台，和欧洲最大的电影制片厂之一。`,
    },
  },
  {
    name: 'Evangelical Church (Braník)',
    slug: 'evangelicky-kostel-branik',
    localizedNames: { cz: 'Evangelický kostel (Braník)', zh: '布拉尼克福音教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.040800005631766, lng: 14.410659603001825 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Evangelick%C3%BD_kostel_(Bran%C3%ADk)',
    description: {
      en: `Brave adventurer, welcome to the Evangelical Church in Braník — a spruce-wood chapel knocked together in 1948 as a strictly temporary fix, meant to last maybe twenty years until the congregation could afford a proper stone building. Nobody ever got around to it. Over seventy-five years on, "temporary" is still clocking in for Sunday service.

Architect Pavel Bareš designed it in the depths of post-war material shortages, borrowing inspiration from the 18th-century "tolerance churches" — the modest, tower-less wooden chapels that Protestant congregations were legally restricted to building after Emperor Joseph II's 1781 Patent of Toleration finally let them worship, barely, in the open. Bareš specifically modelled his design on the tolerance church at Velká Lhota in Moravian Wallachia. Built between September 1947 and April 1948 and consecrated that May, the little wooden hall proved unexpectedly popular: by 1952 the congregation had swelled past 730 members, with around ninety people turning up for a typical service.

The following decades were not entirely peaceful. Ecumenical services launched hopefully in November 1968 were banned outright from 1972 onward, and in 1969 the pastor, Timoteus Pokorný, was robbed at gunpoint by an intruder who climbed in through a window — he spent nearly two months recovering and unable to preach. The church finally got its promised upgrade in 1989/90, when a new pine apse was added, and a full interior renovation in 2022-23 restored the original 1948 ceiling paintings.

🥚 Easter Egg: The architect behind that 1989/90 apse, David Vávra, is not primarily known as a church architect at all — he's one of Czech television's most recognisable faces, a founding member of the cult comedy troupe Sklep and the genial host of the long-running documentary series "Šumná města," which spent two decades touring Czech towns and gently mocking their ugliest buildings. Somewhere between sketch comedy and Wenceslas Square, he found time to design a church annex.`,

      cz: `Statečný dobrodruhu, vítej v Evangelickém kostele v Braníku — dřevěné kapli, kterou v roce 1948 narychlo sbili jako čistě provizorní řešení, jež mělo vydržet tak dvacet let, než si sbor bude moct dovolit postavit pořádný kamenný kostel. Nikdo se k tomu nikdy nedostal. Přes sedmdesát pět let později "provizorium" pořád spolehlivě slouží nedělním bohoslužbám.

Architekt Pavel Bareš jej navrhl v hlubinách poválečného nedostatku materiálu a inspiroval se osmnáctistoletými "tolerančními kostely" — skromnými, bezvěžovými dřevěnými stavbami, na které byly protestantské sbory zákonně omezeny poté, co jim toleranční patent císaře Josefa II. z roku 1781 konečně dovolil bohoslužby, byť jen stěží, na veřejnosti. Bareš se konkrétně inspiroval tolerančním kostelem ve Velké Lhotě na Valašsku. Kostel, postavený mezi zářím 1947 a dubnem 1948 a vysvěcený téhož května, se ukázal být nečekaně oblíbený: do roku 1952 sbor narostl na více než 730 členů, přičemž na běžnou bohoslužbu chodilo kolem devadesáti lidí.

Následující desetiletí neplynula úplně poklidně. Ekumenické bohoslužby, nadějně zahájené v listopadu 1968, byly od roku 1972 zcela zakázány, a v roce 1969 byl farář Timoteus Pokorný přepaden a oloupen se zbraní v ruce vetřelcem, který vlezl oknem — ze zranění se zotavoval téměř dva měsíce a nemohl kázat. Slíbené vylepšení se kostel dočkal až v letech 1989/1990, kdy přibyla nová sosnová apsida, a při kompletní rekonstrukci interiéru v letech 2022–2023 byly obnoveny původní stropní malby z roku 1948.

🥚 Velikonoční vajíčko: Architekt oné apsidy z let 1989/90, David Vávra, není v první řadě známý jako kostelní architekt — je to jedna z nejznámějších tváří české televize, zakládající člen kultovní komediální skupiny Sklep a laskavý moderátor dlouholetého dokumentárního cyklu "Šumná města", který dvě desetiletí objížděl česká města a s humorem se posmíval jejich nejošklivějším stavbám. Někde mezi scénkovou komedií a Václavským náměstím si našel čas navrhnout i přístavbu kostela.`,

      zh: `勇敢的冒险家，欢迎来到布拉尼克福音教堂——这是一座1948年匆匆搭建起来的云杉木小教堂，本来只打算作为权宜之计撑个二十年，等教会攒够钱盖一座正经的石头教堂再说。结果没人真去盖。七十多年过去了，这座"临时建筑"依然稳稳当当地主持着每周日的礼拜。

建筑师帕维尔·巴雷什（Pavel Bareš）在战后物资极度匮乏的年代设计了这座教堂，灵感来自十八世纪的"宽容教堂"（tolerance church）——那是约瑟夫二世皇帝1781年颁布《宽容专利令》后，新教教徒才勉强获准公开礼拜时，被法律限定只能建造的那种朴素、无塔楼的木结构小教堂。巴雷什具体参照的，是瓦拉几地区大勒霍塔（Velká Lhota）的一座宽容教堂。这座教堂于1947年9月至1948年4月间建成，同年5月举行祝圣仪式，人气出乎意料地旺：到1952年，会众已超过730人，一场普通礼拜也能吸引近九十人参加。

接下来的岁月并不算太平。1968年11月满怀希望开启的普世教会联合礼拜，从1972年起被彻底禁止；1969年，牧师蒂莫特乌斯·波科尔尼（Timoteus Pokorný）还曾遭一名破窗而入的歹徒持枪抢劫，伤愈休养了近两个月，无法主持讲道。教堂期待已久的"升级"直到1989/1990年才姗姗来迟——增建了一座松木后殿，而2022至2023年的整体室内翻修，则修复了1948年留下的原始天顶壁画。

🥚 彩蛋：负责1989/90年那座后殿设计的建筑师大卫·瓦弗拉（David Vávra），主业其实完全不是教堂建筑——他是捷克电视荧幕上最具辨识度的面孔之一，邪典喜剧团体Sklep的创团成员，也是长寿纪录片系列《美丽的城市》（Šumná města）里那位温和风趣的主持人，这档节目用了整整二十年时间跑遍捷克各城镇，笑呵呵地吐槽当地最丑的建筑。在小品喜剧和瓦茨拉夫广场之间，他居然还抽空设计了一座教堂的扩建部分。`,
    },
  },
  {
    name: 'Church of St. Prokop (Braník)',
    slug: 'kostel-sv-prokopa-branik',
    localizedNames: { cz: 'Kostel svatého Prokopa (Braník)', zh: '布拉尼克圣普罗科普教堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.03790847089915, lng: 14.41355239671184 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Kostel_svat%C3%A9ho_Prokopa_(Bran%C3%ADk)',
    description: {
      en: `Brave adventurer, welcome to the Church of St. Prokop in Braník — a solid red-brick Neo-Romanesque parish church that the neighbourhood built for itself, brick by brick, out of sheer stubbornness, at the turn of the twentieth century. No aristocrat commissioned it. No bishop funded it. The locals just decided they wanted a church and got on with it.

In 1892, Braník residents founded an association with the delightfully bureaucratic name "Society for the Construction and Equipping of the House of the Lord in Braník," and spent the next eight years raising money before the cornerstone was finally consecrated on 1 July 1900. Architect Rudolf Vomáčka delivered a single-nave Neo-Romanesque building with an apse and a blocky western tower, and it was formally dedicated to St. Prokop on 22 September 1901, with finishing work continuing until 1904.

The church's namesake, Prokop of Sázava, was an eleventh-century hermit-monk who reportedly did his soul-searching in a cave directly across the Vltava, in what is now Prokopské údolí — meaning his statue-worthy legend and his actual cave are separated by barely a couple of kilometres of river. The original bells were confiscated by the Nazis during WWII and only replaced at the start of this century, newly named Saint Anežka and Saint Vojtěch.

🥚 Easter Egg: The sandstone statue of St. John of Nepomuk standing guard outside didn't start life here at all — carved in the 18th century by a sculptor from the workshop of František Ignác Platzer, it originally stood in the nearby Dominican Courtyard and was only relocated to its current spot in 1950, decades after the church itself was finished. If you've already ticked off Prokopské údolí on your map, you've technically already visited the site of this saint's day job.`,

      cz: `Statečný dobrodruhu, vítej v Kostele svatého Prokopa v Braníku — solidním novorománském farním kostele z režného zdiva, který si čtvrť na přelomu dvacátého století postavila sama, cihlu po cihle, čirou tvrdohlavostí. Žádný šlechtic ho neobjednal. Žádný biskup ho nezaplatil. Místní si prostě usmysleli, že chtějí kostel, a šli si za tím.

V roce 1892 založili obyvatelé Braníku spolek s rozkošně byrokratickým názvem "Spolek pro vystavění a vyzdobení domu Páně v Braníku" a dalších osm let sháněli peníze, než byl 1. července 1900 konečně vysvěcen základní kámen. Architekt Rudolf Vomáčka navrhl jednolodní novorománskou stavbu s apsidou a hranatou věží na západním průčelí a slavnostně byla zasvěcena sv. Prokopu 22. září 1901, přičemž dokončovací práce pokračovaly až do roku 1904.

Patron kostela, Prokop Sázavský, byl jedenáctistoletým poustevníkem-mnichem, který se svými démony údajně zápasil v jeskyni přímo na druhé straně Vltavy, v dnešním Prokopském údolí — jeho pověstný příběh a jeho skutečná jeskyně jsou tak od sebe vzdáleny sotva pár kilometrů řeky. Původní zvony zabavili za druhé světové války nacisté a nahrazeny byly až na počátku tohoto století, nově pojmenované svatá Anežka a svatý Vojtěch.

🥚 Velikonoční vajíčko: Pískovcová socha svatého Jana Nepomuckého, která dnes hlídá před kostelem, tu vlastně vůbec nezačínala — vytesal ji v 18. století sochař z okruhu Františka Ignáce Platzera a původně stála v nedalekém Dominikánském dvoře, odkud byla na současné místo přemístěna až v roce 1950, celá desetiletí po dokončení samotného kostela. Pokud jsi na své mapě už odškrtl Prokopské údolí, technicky jsi tím pádem už navštívil i místo, kde tenhle světec "chodil do práce".`,

      zh: `勇敢的冒险家，欢迎来到布拉尼克圣普罗科普教堂——一座扎实的红砖新罗马式堂区教堂，是这个社区在二十世纪之交，凭着一股倔劲儿，一砖一瓦自己盖起来的。没有贵族出资委托，也没有主教掏钱资助，纯粹是当地居民自己决定"我们想要一座教堂"，然后就真的动手了。

1892年，布拉尼克的居民成立了一个名字格外官僚气十足的协会——"布拉尼克主之殿建造与装饰协会"，此后花了整整八年时间筹款，才终于在1900年7月1日举行了奠基石祝圣仪式。建筑师鲁道夫·沃马奇卡（Rudolf Vomáčka）设计了一座带后殿的单厅新罗马式建筑，西立面配有一座方形塔楼；教堂于1901年9月22日正式祝圣，献给圣普罗科普，而后续的收尾工程一直持续到1904年。

这座教堂的主保圣人——萨扎瓦的普罗科普，是十一世纪的一位隐修士，据说他"面壁修行"的洞穴，就在伏尔塔瓦河对岸，也就是今天的普罗科普山谷（Prokopské údolí）——换句话说，他那段传奇故事的发生地，和这座供奉他的教堂之间，隔着的不过是几公里的河水。原来的钟在二战期间被纳粹征收熔毁，直到本世纪初才补齐，新钟分别命名为"圣阿格尼丝"和"圣沃伊捷赫"。

🥚 彩蛋：如今守在教堂门前的那尊圣扬·内波穆茨基砂岩雕像，其实并不是"土生土长"于此——它由十八世纪雕塑家弗朗蒂谢克·伊格纳茨·普拉策（František Ignác Platzer）门下的匠人雕刻，原本立在附近的多明我修道院庭院里，直到1950年才被迁到现在的位置，那时距教堂本身竣工已经过去了几十年。如果你的地图上已经打过卡普罗科普山谷，那么严格来说，你其实早就"顺便"参观过这位圣人当年"上班"的地方了。`,
    },
  },
  {
    name: 'Dominican Courtyard',
    slug: 'dominikansky-dvur',
    localizedNames: { cz: 'Dominikánský dvůr', zh: '多明我修道院庭院' },
    labels: ['historical', 'architecture', 'ruin'],
    coordinates: { lat: 50.03686550478623, lng: 14.412232662516521 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Dominik%C3%A1nsk%C3%BD_dv%C5%AFr',
    description: {
      en: `Brave adventurer, welcome to the Dominican Courtyard — a crumbling Baroque estate that has, in its four-hundred-year career, been a monastery outpost, a brewery, a cinema, and a decaying pile of arcades that the city can't quite decide what to do with. Consider it Braník's answer to a fixer-upper, if the fixer-upper had once brewed beer for actual friars.

The land came into Dominican hands in 1625, a direct spoil of the Battle of White Mountain: Emperor Ferdinand II handed part of Braník to the Dominican order as part of the sweeping re-Catholicization of Bohemia, and the friars wasted no time — by 1626 they had a working brewery on-site. The surviving complex, three of an original four arcaded wings, dates mostly from the third quarter of the 17th century, with a bell tower and stucco-decorated chapel added in 1761. The chapel kept its religious function until 1899, the same year Prague's brewers' guild bought the whole estate and kept the brewery running until 1907.

After the beer stopped flowing, the courtyard reinvented itself yet again: from 1919 to 1969, its southern wing operated as Kino Eden, a neighbourhood cinema, before that section was demolished. Small craft workshops moved in after WWII, and since then the estate has mostly just sat there, owned by the City of Prague and slowly losing its fight against gravity — a 2019 proposal floated turning it into a Waldorf school, though nothing has come of it yet.

🥚 Easter Egg: The sandstone statue of St. John of Nepomuk now standing outside the nearby Church of St. Prokop originally lived right here in this courtyard, before being moved to the church in 1950. So if a saint could get evicted for redevelopment, it happened first — decades before anyone started debating what to do with the rest of the building.`,

      cz: `Statečný dobrodruhu, vítej v Dominikánském dvoře — chátrajícím barokním areálu, který za svou čtyřsetletou kariéru stihl být klášterní usedlostí, pivovarem, kinem i rozpadající se hromadou arkád, se kterou si město pořád neví rady. Ber to jako branickou odpověď na "dům k rekonstrukci", jen v tomto případě dům, kde se kdysi vařilo pivo skutečným mnichům.

Pozemek přešel do rukou dominikánů v roce 1625 jako přímá kořist z bitvy na Bílé hoře: císař Ferdinand II. věnoval část Braníku dominikánskému řádu v rámci rozsáhlé rekatolizace Čech a mniši neztráceli čas — už v roce 1626 tu měli fungující pivovar. Dochovaný areál, tři ze čtyř původních arkádových křídel, pochází většinou ze třetí čtvrtiny 17. století, zvonice se štukovanou kaplí byla přistavěna v roce 1761. Kaple si zachovala náboženskou funkci až do roku 1899, kdy celou usedlost odkoupil spolek pražských sládků a provozoval tu pivovar až do roku 1907.

Poté, co pivo přestalo téct, se dvůr znovu proměnil: od roku 1919 do roku 1969 fungovalo v jeho jižním křídle kino Eden, než bylo toto křídlo zbouráno. Po druhé válce se sem nastěhovaly drobné řemeslné dílny a od té doby areál většinou jen stojí, ve vlastnictví hlavního města Prahy, a pomalu prohrává boj s gravitací — v roce 2019 zazněl návrh přeměnit ho na waldorfskou školu, z čehož zatím nic nebylo.

🥚 Velikonoční vajíčko: Pískovcová socha svatého Jana Nepomuckého, která dnes stojí před nedalekým kostelem svatého Prokopa, původně bydlela přímo tady, na tomto dvoře, než byla v roce 1950 přesunuta ke kostelu. Pokud tedy někdy nějakého světce vystěhovali kvůli přestavbě, stalo se to tady — celé desítky let předtím, než se vůbec začalo řešit, co s tím zbytkem budovy.`,

      zh: `勇敢的冒险家，欢迎来到多明我修道院庭院——一座逐渐颓败的巴洛克庄园，在长达四百年的"职业生涯"里，它先后当过修道院产业、啤酒厂、电影院，如今则是一堆城市当局也不知该拿它怎么办的破败拱廊。不妨把它想象成布拉尼克版的"急待翻新的老宅"，只不过这座老宅，当年可是给真正的修士们酿过啤酒。

这片土地在1625年落入多明我会手中，是白山战役后再天主教化运动的直接战利品：费迪南二世皇帝将布拉尼克的一部分赐给了多明我会，作为波希米亚全面再天主教化行动的一环，修士们也没浪费时间——1626年就在此地开起了一座正常运转的啤酒厂。如今保留下来的建筑群，是原本四翼拱廊中幸存的三翼，大部分建于17世纪下半叶第三个二十五年间；1761年又增建了一座带灰泥装饰礼拜堂的钟楼。礼拜堂一直保持宗教用途直到1899年——同一年，布拉格酿酒商协会买下了整座庄园，并将啤酒厂经营到1907年。

啤酒停产之后，这座庭院又摇身一变：从1919年到1969年，它的南翼变成了社区电影院"伊甸园影院"（kino Eden），直到那部分建筑被拆除为止。二战之后，各种小手工作坊搬了进来，此后这座庄园大多数时候就只是静静地立在那里，产权归布拉格市政府所有，慢慢地输给了地心引力——2019年曾有人提议把它改造成一所华德福学校，但至今没有下文。

🥚 彩蛋：如今立在附近圣普罗科普教堂门前的那尊圣扬·内波穆茨基砂岩雕像，其实最早就住在这座庭院里，直到1950年才被迁往教堂。所以要说哪位圣人曾因为"改造项目"被迫搬家，这里才是最早的案例——比人们真正开始讨论这栋建筑其余部分该怎么办，早了几十年。`,
    },
  },
  {
    name: 'Braník Ice Houses',
    slug: 'branicke-ledarny',
    localizedNames: { cz: 'Branické ledárny', zh: '布拉尼克冰库' },
    labels: ['ruin', 'factory', 'historical'],
    coordinates: { lat: 50.03258223280205, lng: 14.406085408872267 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Branick%C3%A9_led%C3%A1rny',
    description: {
      en: `Brave adventurer, welcome to the Braník Ice Houses — a hulking Art Nouveau fortress built in 1911 for one job only: keeping beer cold before anyone had heard of a refrigerator. It stored twenty thousand tons of frozen Vltava a year, and today it just stands there, magnificently useless, waiting for somebody to figure out what to do with it.

A group of Prague pub and restaurant owners, tired of relying on the cramped older ice house at Štvanice Island, formed a joint-stock company and built this replacement between 1909 and 1911 to designs by architect Josef Kovařovič. It was structurally ahead of its time — one of the first buildings in Prague built on an iron-concrete skeleton, insulated with cork and threaded with elaborate ventilation and drainage systems. Every winter, workers cut blocks straight out of the frozen Vltava, floated them into a lagoon, hauled them up by paternoster elevator, and packed the whole hall solid over about 38 days — enough ice to keep Prague's pubs, hospitals, and butcher shops supplied through the following summer, delivered daily by horse-drawn cart.

The operation ran until 1954, when the new Slapy Dam upstream stopped the Vltava from freezing properly even in hard winters, making the entire building obsolete overnight. It's been listed as a protected monument since 1964, but protection hasn't meant use: it briefly stored potatoes in the 1980s, and has sat empty and privately owned — inaccessible to the public — ever since.

🥚 Easter Egg: Nobody could ever settle on what to do with this building once the ice ran out. A paleontology museum was floated in the mid-1980s and quietly dropped; in the 1990s, someone seriously proposed turning the isolated, windowless hall into a red-light district, on the logic that a building with no windows and few neighbours was, structurally speaking, perfectly suited to the job. Neither happened. It's still just an extremely handsome empty ice box.`,

      cz: `Statečný dobrodruhu, vítej v Branických ledárnách — mohutné secesní pevnosti postavené v roce 1911 pro jediný účel: udržet pivo studené v době, kdy nikdo ještě neslyšel o lednici. Skladovaly dvacet tisíc tun zmrzlé Vltavy ročně a dnes tu jen stojí, velkolepě nepotřebné, a čekají, až někdo konečně vymyslí, co s nimi.

Skupina pražských hostinských a restauratérů, unavená z tísnivé starší ledárny na Štvanici, založila akciovou společnost a mezi lety 1909 a 1911 postavila tuto náhradu podle návrhu architekta Josefa Kovařoviče. Konstrukčně to byla stavba doby daleko předbíhající — jedna z prvních pražských budov na železobetonové kostře, izolovaná korkem a protkaná složitým systémem větrání a odvodnění. Každou zimu dělníci vysekávali kry přímo ze zamrzlé Vltavy, splavovali je do laguny, vytahovali paternosterovými výtahy a celou halu tak během asi 38 dní naplnili do kompaktu — dost ledu na to, aby pražské hospody, nemocnice i řeznictví měly zásoby na celé následující léto, rozvážené denně koňskými povozy.

Provoz běžel až do roku 1954, kdy nově postavená Slapská přehrada výše po proudu způsobila, že Vltava už pořádně nezamrzala ani za tuhých mrazů, a celá budova se tak přes noc stala zbytečnou. Od roku 1964 je vedená jako chráněná kulturní památka, ochrana ale neznamenala využití: v 80. letech tu krátce skladovali brambory a od té doby stojí prázdná a v soukromém vlastnictví — veřejnosti nepřístupná.

🥚 Velikonoční vajíčko: Nikdo se nikdy pořádně nedohodl, co s budovou udělat, jakmile došel led. V polovině 80. let se zvažovalo paleontologické muzeum, ale nápad potichu zapadl; v 90. letech pak někdo vážně navrhoval proměnit izolovanou halu bez oken na červenou čtvrť, s logikou, že budova bez oken a bez sousedů je na to konstrukčně jako stvořená. Nestalo se ani jedno. Pořád je to jen mimořádně pohledná prázdná lednička.`,

      zh: `勇敢的冒险家，欢迎来到布拉尼克冰库——一座建于1911年的庞大新艺术风格"堡垒"，它存在的理由只有一个：在没人听说过冰箱的年代，让啤酒保持冰凉。它每年能储存两万吨从伏尔塔瓦河凿下的冰块，而如今，它只是气派而毫无用处地立在原地，等着有人想出该拿它怎么办。

一群厌倦了什托万卡岛（Štvanice）那座老旧狭小冰库的布拉格酒馆和餐厅老板，联合成立了一家股份公司，于1909年至1911年间按建筑师约瑟夫·科瓦若维奇（Josef Kovařovič）的设计，建起了这座替代设施。它在结构上远远领先于时代——是布拉格最早采用钢筋混凝土骨架的建筑之一，内部用软木隔热，并布有复杂的通风与排水系统。每年冬天，工人们直接从冰封的伏尔塔瓦河面上凿下冰块，用长杆推入前方的一处泻湖，再用三部"链斗式"提升机吊起，大约用38天的时间把整座大厅填得严严实实——足够供应布拉格的酒馆、医院和肉铺整整一个夏天，每天由马车按时送货。

这项业务一直运转到1954年——上游新建的斯拉皮大坝（Slapy Dam）改变了水文，使得即便在严寒冬季，伏尔塔瓦河也几乎不再结冰，整栋建筑几乎一夜之间失去了存在的意义。它自1964年起被列为受保护的文化古迹，但"受保护"不等于"被使用"：上世纪80年代，这里曾短暂用来储存土豆，此后便一直空置，归私人所有——不对公众开放。

🥚 彩蛋：自从冰块停产之后，人们始终没能就这栋建筑该派什么用场达成一致意见。上世纪80年代中期，曾有人提议把它改造成一座古生物博物馆，但这个想法后来悄悄不了了之；到了90年代，又有人一本正经地提议，把这座孤立、没有窗户的大厅改造成红灯区，理由是"一栋没有窗户、周围也没什么邻居的建筑，从结构上说简直是天生适合"。两个提议最后都没有成真。它至今仍然只是一只格外好看的、空荡荡的大冰箱。`,
    },
  },
  {
    name: 'Braník Theatre',
    slug: 'branicke-divadlo',
    localizedNames: { cz: 'Branické divadlo', zh: '布拉尼克剧院' },
    labels: ['cultural', 'architecture', 'historical'],
    coordinates: { lat: 50.03583712257063, lng: 14.413859361357183 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Branick%C3%A9_divadlo',
    description: {
      en: `Brave adventurer, welcome to the Braník Theatre — a neoclassical playhouse that the neighbourhood built with its own hands in the 1920s, lost to bureaucrats for most of the Cold War, and eventually handed over to a troupe of circus performers who renamed it something that sounds suspiciously like a cheer.

The theatre's roots trace back to an 1868 gymnastics-and-firefighting-and-amateur-drama society — a very of-its-era combination — which eventually raised the money for a proper building through public collections modelled directly on the fundraising campaign for the National Theatre itself. Thousands of volunteer hours later, architect Václav Šindelář's neoclassical building, with its six-axis facade and a pair of masks glaring down from above the entrance, opened on 1 August 1925 with a production of "Naši furianti."

The 20th century was not kind to it: during WWII the Germans used it as a furniture warehouse for evacuated schools, wrecking the parquet floor and backdrops in the process, and after the communist takeover the founding amateur society lost control of the building entirely, reduced to a mere 21 permitted days a year for rehearsals or performances. Things loosened up in the 1980s, when the programme turned toward pantomime and movement theatre under mime artist Boris Hybner. The theatre closed in 1992, sat through a three-year reconstruction, reopened in 2016, and since 2020 has operated as Divadlo BRAVO!, home to the neo-circus troupe Losers Cirque Company.

🥚 Easter Egg: Before any of them were famous, a young Jiří Krampol — later one of Czechoslovakia's best-loved comic actors — cut his teeth performing on this very stage. A theatre founded by volunteer firefighters and gymnasts eventually produced a national comedy star and then, decades later, reinvented itself as a circus. Consistency was apparently never really the point.`,

      cz: `Statečný dobrodruhu, vítej v Branickém divadle — klasicistním divadle, které si čtvrť ve 20. letech postavila vlastníma rukama, na většinu studené války ho ztratila ve prospěch úředníků a nakonec ho předala partě cirkusových umělců, kteří ho přejmenovali na něco, co zní podezřele jako povzbuzující pokřik.

Kořeny divadla sahají k tělocvično-hasičsko-ochotnickému spolku založenému v roce 1868 — pro svou dobu velmi typická kombinace —, který si na pořádnou budovu nakonec vysbíral peníze veřejnou sbírkou podle vzoru té na Národní divadlo. Po tisících odpracovaných dobrovolnických hodinách se klasicistní budova architekta Václava Šindeláře, se svým šestiosým průčelím a dvojicí masek shlížejících ze štítu nad vchodem, otevřela 1. srpna 1925 hrou "Naši furianti."

Dvacáté století s ní nezacházelo v rukavičkách: za druhé světové války ji Němci využívali jako sklad nábytku z evakuovaných škol, čímž zničili parkety i kulisy, a po komunistickém převratu zakládající ochotnický spolek o budovu zcela přišel a směl ji používat jen na 21 povolených dní v roce. Uvolnilo se to až v 80. letech, kdy se dramaturgie stočila k pantomimě a pohybovému divadlu pod vedením mima Borise Hybnera. Divadlo bylo zavřeno v roce 1992, přečkalo tříletou rekonstrukci, znovu otevřelo v roce 2016 a od roku 2020 funguje jako Divadlo BRAVO!, domovská scéna novocirkusového souboru Losers Cirque Company.

🥚 Velikonoční vajíčko: Ještě než se stal slavným, si na tomto jevišti zahrál mladý Jiří Krampol — pozdější jeden z nejoblíbenějších československých komiků. Divadlo založené dobrovolnými hasiči a cvičenci nakonec vychovalo národní komediální hvězdu a o desítky let později se přerodilo v cirkus. Důslednost zjevně nikdy nebyla úplně cílem.`,

      zh: `勇敢的冒险家，欢迎来到布拉尼克剧院——一座上世纪20年代由社区居民亲手建造的新古典主义剧院，冷战大部分时间里被官僚机构夺走，最终又被交到了一群马戏团表演者手中，他们还给它起了个听起来像是加油打气口号的新名字。

这座剧院的渊源可以追溯到1868年成立的一个"体操—消防—业余戏剧"协会——放在那个年代，这种奇特的组合搭配倒也算合情合理——该协会最终仿照国家剧院当年的募捐模式，通过公开集资筹到了建造一座正式剧院的资金。在志愿者们贡献了成千上万个小时的劳动之后，建筑师瓦茨拉夫·辛德拉尔（Václav Šindelář）设计的这座新古典主义建筑，以六开间立面和入口上方两个俯视众生的面具浮雕为特色，于1925年8月1日以剧目《我们的自大狂》（Naši furianti）正式开幕。

二十世纪对它并不算温柔：二战期间，德国占领当局把它当作从被疏散学校运来的家具仓库，过程中毁掉了地板和布景；共产党掌权后，创立这座剧院的业余剧团彻底失去了对它的控制权，一年之中只被允许使用21天用于排练或演出。直到上世纪80年代，情况才有所松动，剧院在哑剧演员鲍里斯·希布纳（Boris Hybner）带领下，将节目方向转向哑剧和形体剧场。剧院于1992年关闭，经历三年重建后于2016年重新开放，自2020年起以"BRAVO!剧院"（Divadlo BRAVO!）之名运营，成为新马戏团体Losers Cirque Company的驻地剧场。

🥚 彩蛋：在成名之前，年轻的伊日·克兰波尔（Jiří Krampol）——后来成为捷克斯洛伐克最受喜爱的喜剧演员之一——就曾在这个舞台上磨练演技。一座由志愿消防员和体操爱好者创办的剧院，最终培养出了一位国民级喜剧明星，几十年后又摇身变成了马戏团的家。看来"一以贯之"从来都不是这里的追求。`,
    },
  },
  {
    name: 'Old Town Weir',
    slug: 'staromestsky-jez',
    localizedNames: { cz: 'Staroměstský jez', zh: '老城堰' },
    labels: ['waterbody', 'historical', 'architecture'],
    coordinates: { lat: 50.08460207415982, lng: 14.41086146619012 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Starom%C4%9Bstsk%C3%BD_jez',
    description: {
      en: `Brave adventurer, welcome to the Old Town Weir (Staroměstský jez) — a diagonal wall of wood and stone across the Vltava that has been quietly doing its job since 1241, which makes it older than Charles Bridge, older than Charles University, and considerably older than your patience for reading historical plaques.

The weir was built to keep Prague's defensive moat filled and to feed water to an entire small industrial district: the Čertovka stream and its three mills, the Sovovy Mills on Kampa, eight separate Old Town mills, and eventually the Old Town Water Tower that supplied the city's drinking water. Running 321 metres diagonally from the Kampa side near Sovovy Mills to Novotného lávka on the opposite bank, with a modest 95-centimetre drop, it is the only one of Prague's historic weirs to have kept its original 13th-century "Prague type" profile — a wooden frame packed with stone — essentially unchanged for nearly eight centuries.

Charles IV himself weighed in on its operation in 1366, decreeing that the log-raft passage through the weir's centre had to remain a toll-free 20 cubits wide — medieval Bohemia's version of protecting a shipping lane. The weir became a protected cultural monument in 1964, and a 2021–2023 restoration stripped out twentieth-century concrete patching and rebuilt it the old way, with stone and oak timber up to 160 years old.

🥚 Easter Egg: Every summer, a competitive kayaking race runs paddlers down all three of Prague's historic Vltava weirs in a single event — meaning this 780-year-old piece of medieval hydraulic engineering doubles, once a year, as a whitewater slalom course.`,

      cz: `Statečný dobrodruhu, vítej u Staroměstského jezu — šikmé hráze ze dřeva a kamene napříč Vltavou, která tiše plní svou funkci už od roku 1241, což ji činí starší než Karlův most, starší než Karlova univerzita a podstatně starší než tvá trpělivost při čtení historických cedulí.

Jez byl postaven, aby udržoval naplněný pražský hradební příkop a zásoboval vodou celou malou průmyslovou čtvrť: potok Čertovku a jeho tři mlýny, Sovovy mlýny na Kampě, osm samostatných staroměstských mlýnů a nakonec i Staroměstskou vodárenskou věž, která zásobovala město pitnou vodou. Jez měří 321 metrů a vede šikmo od kampské strany u Sovových mlýnů k Novotného lávce na protějším břehu, se skromným spádem 95 centimetrů — a jako jediný z pražských jezů si dodnes zachoval svůj původní třináctistoletý profil takzvaného "pražského typu": dřevěnou konstrukci vyplněnou kamenem, prakticky beze změny už téměř osm století.

Sám Karel IV. zasáhl v roce 1366 do jeho provozu a nařídil, že vorová propust uprostřed jezu musí zůstat bezplatně průjezdná v šířce 20 loktů — středověká česká obdoba ochrany plavební dráhy. Jez se stal chráněnou kulturní památkou v roce 1964 a při obnově v letech 2021–2023 byly odstraněny betonové výplně z dřívějších oprav a jez byl obnoven starým způsobem — z kamene a dubového dřeva starého až 160 let.

🥚 Velikonoční vajíčko: Každé léto se koná závod, ve kterém vodáci sjíždějí v jedné akci všechny tři historické pražské jezy na Vltavě — takže tento 780 let starý kus středověkého vodního díla se jednou ročně mění ve vodáckou slalomovou trať.`,

      zh: `勇敢的冒险家，欢迎来到老城堰——一道横跨伏尔塔瓦河的木石斜堰，自1241年起便默默履行着自己的职责，这意味着它比查理大桥还老，比查理大学还老，也比你读历史铭牌的耐心老得多。

修建这座堰的目的，是为了让布拉格的护城河渠保持水位充足，同时为一整片小型"工业区"供水：恶魔溪（Čertovka）及其三座磨坊、坎帕岛上的索沃夫磨坊（Sovovy mlýny）、八座独立的老城磨坊，以及后来为全城供应饮用水的老城水塔。这道堰全长321米，从坎帕岛索沃夫磨坊一侧斜向延伸至对岸的诺沃特尼桥（Novotného lávka），落差仅有95厘米——它是布拉格现存所有历史堰坝中，唯一一座完整保留了十三世纪"布拉格式"原始形制的堰坝：木框架内填满石块，近八个世纪以来几乎原封未动。

查理四世本人也曾在1366年亲自过问它的运营，下令堰坝中央供木筏通过的水道必须保持20腕尺宽，且不得收取通行费——这是中世纪波希米亚版本的"保障航道畅通"。这座堰于1964年被列为受保护的文化古迹，2021至2023年的修复工程拆除了此前维修留下的混凝土填充物，改用石材与树龄最高达160年的橡木，按照古法重建。

🥚 彩蛋：每年夏天，都会举办一场皮划艇竞速活动，选手需要在同一场比赛中依次滑过布拉格全部三座历史堰坝——也就是说，这座已有780年历史的中世纪水利工程，每年都会有那么一天，摇身一变成为一条激流回旋赛道。`,
    },
  },
  {
    name: 'Braník Railway Bridge',
    slug: 'branicky-most',
    localizedNames: { cz: 'Branický most', zh: '布拉尼克铁路桥' },
    labels: ['bridge', 'historical'],
    coordinates: { lat: 50.02683062181724, lng: 14.397516333719427 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Branick%C3%BD_most',
    description: {
      en: `Brave adventurer, welcome to the Braník Railway Bridge — a 900-metre concrete viaduct nicknamed "Most Inteligence" (Bridge of the Intelligentsia) because much of the workforce that built it consisted of lawyers, philosophers, and doctors who had spent the 1950s being cheerfully reassigned to manual labour by a regime with strong opinions about educated people having opinions.

Construction ran from 1949 to 1955, and on completion the bridge — 15 concrete arches, 19 metres above the Vltava — briefly held the title of the longest double-track reinforced-concrete railway bridge in Europe. That title came with an asterisk: the bridge then sat essentially idle, used mainly for locomotive testing, for nine years before finally opening to regular traffic on 30 May 1964. It wasn't even given its official name until 1969, by which point "Most Inteligence" had already stuck for good.

The bridge never quite got the second life its builders intended, either. Both tracks were laid during construction, but the second one was pulled up after load testing and the crossing ran single-tracked for the next seven decades. A mysterious unfinished stub partway across still hints at an abandoned plan for a branch tunnel toward Hlubočepy that was never built. The missing second track was finally restored in 2023–2024 — meaning the bridge only became what its 1950s architects actually intended roughly seventy years after it opened.

🥚 Easter Egg: The bridge's high-minded nickname has entirely outlived the memory of who specifically built it. Ask a Praguer what "Most Inteligence" means and most will know the story in outline — educated people, forced labour, 1950s repression — without being able to name a single one of them. The bridge remembers a whole social class; it just doesn't remember any individuals in it.`,

      cz: `Statečný dobrodruhu, vítej u Branického mostu — devítisetmetrového betonového viaduktu přezdívaného "Most Inteligence", protože značnou část jeho stavební síly tvořili právníci, filozofové a lékaři, které v 50. letech s dobrou náladou převelel k manuální práci režim, který měl silné názory na to, že vzdělaní lidé mají názory.

Stavba probíhala v letech 1949 až 1955 a po dokončení — 15 betonových oblouků, 19 metrů nad Vltavou — most krátce nesl titul nejdelšího dvoukolejného železobetonového železničního mostu v Evropě. Tento titul měl háček: most poté prakticky nečinně stál, využívaný hlavně ke zkouškám lokomotiv, celých devět let, než se v roce 1964, 30. května, konečně otevřel běžnému provozu. Oficiální jméno dostal dokonce až v roce 1969, kdy už se přezdívka "Most Inteligence" dávno vžila.

Ani pak most úplně nedostal to, co jeho stavitelé zamýšleli. Během výstavby byly položeny obě koleje, ale druhá byla po zátěžových zkouškách odstraněna a most příštích sedmdesát let sloužil jen jednokolejně. Záhadný nedokončený pahýl konstrukce uprostřed mostu dodnes připomíná opuštěný plán na odbočnou tunelovou trať směrem na Hlubočepy, která nikdy nevznikla. Chybějící druhá kolej byla konečně obnovena v letech 2023–2024 — takže most se stal tím, co jeho architekti z 50. let skutečně zamýšleli, zhruba sedmdesát let po otevření.

🥚 Velikonoční vajíčko: Vznešená přezdívka mostu dávno přežila paměť na to, kdo ho konkrétně postavil. Zeptej se Pražana, co znamená "Most Inteligence", a většina bude znát příběh v obrysech — vzdělaní lidé, nucené práce, represe 50. let — aniž by dokázala jmenovat jediného konkrétního člověka. Most si pamatuje celou společenskou vrstvu; jednotlivce z ní si nepamatuje žádného.`,

      zh: `勇敢的冒险家，欢迎来到布拉尼克铁路桥——一座长约900米的混凝土高架桥，绰号"智识者之桥"（Most Inteligence），因为参与建造它的许多劳动力，都是在上世纪50年代被一个对"有想法的知识分子"意见很大的政权，欢快地重新分配去从事体力劳动的律师、哲学家和医生。

大桥的建造工程始于1949年，历时至1955年完工，落成时——15座混凝土拱、桥面距伏尔塔瓦河面19米——它一度是欧洲最长的双线钢筋混凝土铁路桥。可这个头衔背后藏着隐情：大桥此后基本闲置了整整九年，主要用于机车测试，直到1964年5月30日才正式对常规运营开放。它甚至直到1969年才获得正式命名，而那时，"智识者之桥"这个绰号早已深入人心。

即便如此，这座桥也从未真正实现建造者的初衷。施工期间两条铁轨都已铺设完成，但第二条轨道在荷载测试后被拆除，此后长达七十年，大桥只能单线运营。桥体中段一处神秘的未完工残段，至今仍暗示着一项从未实现的计划——原本打算修建一条通往赫卢博切皮（Hlubočepy）的支线隧道。缺失的第二条轨道终于在2023至2024年得以恢复——这意味着，这座桥直到通车大约七十年后，才真正变成了它20世纪50年代设计者当初设想的样子。

🥚 彩蛋：这座桥响亮的绰号，早已超越了人们对具体建造者的记忆。如果你问一位布拉格人"智识者之桥"是什么意思，大多数人都能大致讲出这个故事的轮廓——知识分子、强制劳动、50年代的压迫——却说不出其中任何一个人的名字。这座桥记住的是一整个社会阶层，却唯独不记得其中任何一个个体。`,
    },
  },
  {
    name: 'The Park (Chodov)',
    slug: 'the-park-chodov',
    localizedNames: { cz: 'The Park (Chodov)', zh: 'The Park（查多夫商务园区）' },
    labels: ['modern', 'architecture'],
    coordinates: { lat: 50.02866128728125, lng: 14.493351997660092 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/The_Park_(Praha)',
    description: {
      en: `Brave adventurer, welcome to The Park — a twelve-building office campus in Chodov that somehow became, in the middle of a business district next to a highway, the first new public park built anywhere in the country since 1938.

Built between 2003 and 2008 by developer AIG/Lincoln to a masterplan by architect Jakub Cigler, The Park was unusually deliberate about the space between its buildings — landscaped courtyards and green corridors at a time when most Prague office developments treated the outdoors as leftover parking lot. The complex now holds around 116,000 square metres of rentable office space plus restaurants, a hotel, a gym, and a kindergarten, and counts Accenture, DHL, IBM, Honeywell, and Samsung among its tenants.

It has also changed hands for genuinely startling sums. American investor Starwood Capital Group bought the entire complex in 2013 for roughly 8 billion crowns — at the time the largest single office transaction the Czech real-estate market had ever recorded — before German fund manager Deka Immobilien bought it again in 2016 for an estimated 10 billion crowns.

🥚 Easter Egg: The Park sits directly beside Westfield Chodov, one of the largest shopping centres in Central Europe, which means it is entirely possible to work an eight-hour day surrounded by manicured lawns and fountains, then walk two hundred metres and vanish into a mall for the rest of the evening without ever technically leaving the same postcode.`,

      cz: `Statečný dobrodruhu, vítej v The Parku — dvanáctibudovovém kancelářském kampusu v Chodově, který se uprostřed byznysové čtvrti u dálnice nějak stal prvním novým veřejným parkem postaveným v zemi od roku 1938.

The Park postavil developer AIG/Lincoln mezi lety 2003 a 2008 podle masterplánu architekta Jakuba Ciglera a nezvykle promyšleně přistoupil k prostoru mezi budovami — upravená nádvoří a zelené koridory v době, kdy většina pražských kancelářských projektů brala venkovní prostor jako zbytkové parkoviště. Komplex dnes nabízí přibližně 116 000 metrů čtverečních pronajímatelných kancelářských ploch, restaurace, hotel, posilovnu i školku a mezi jeho nájemci patří Accenture, DHL, IBM, Honeywell nebo Samsung.

Komplex také několikrát změnil majitele za skutečně ohromující částky. Americký investor Starwood Capital Group koupil celý areál v roce 2013 zhruba za 8 miliard korun — tehdy největší jednotlivou kancelářskou transakci, jakou český realitní trh kdy zaznamenal — než ho v roce 2016 znovu koupil německý správce fondů Deka Immobilien za odhadovaných 10 miliard korun.

🥚 Velikonoční vajíčko: The Park sousedí přímo s Westfield Chodov, jedním z největších nákupních center ve střední Evropě — takže je naprosto možné odpracovat osmihodinovou směnu obklopený upravenými trávníky a fontánami, pak ujít dvě stě metrů a zmizet na zbytek večera v nákupním centru, aniž bys technicky opustil stejné poštovní směrovací číslo.`,

      zh: `勇敢的冒险家，欢迎来到The Park——一座位于查多夫（Chodov）、由十二栋办公楼组成的商务园区，它竟然在紧邻高速公路的商业区中央，成为了全国自1938年以来新建的第一座公共公园。

The Park由开发商AIG/Lincoln于2003年至2008年间建成，出自建筑师雅库布·齐格勒（Jakub Cigler）之手的总体规划，对建筑之间的空间投入了不同寻常的用心——精心设计的庭院与绿色廊道，而在当时，布拉格的大多数办公项目还只是把户外空间当作多余的停车场来处理。如今，这座园区拥有约116,000平方米的可租赁办公面积，配有餐厅、酒店、健身房甚至幼儿园，埃森哲、DHL、IBM、霍尼韦尔和三星都名列其租户之中。

这座园区也曾以令人咋舌的价格数次易主：2013年，美国投资机构Starwood资本集团以约80亿克朗的价格买下整个园区——这在当时是捷克房地产市场有史以来最大的单笔办公物业交易；到了2016年，德国基金管理公司德卡不动产（Deka Immobilien）又以估计100亿克朗的价格将其买下。

🥚 彩蛋：The Park紧邻中欧最大的购物中心之一——Westfield Chodov商场，也就是说，你完全可以在修剪整齐的草坪与喷泉环绕中工作满八个小时，然后走上两百米，一头扎进商场里消磨掉整个晚上，而从技术上讲，你甚至都没有离开同一个邮编区域。`,
    },
  },
  {
    name: 'BB Centrum (Brumlovka)',
    slug: 'bb-centrum',
    localizedNames: { cz: 'BB Centrum (Brumlovka)', zh: 'BB中心（布鲁姆洛夫卡）' },
    labels: ['modern', 'architecture', 'cultural'],
    coordinates: { lat: 50.048022753856145, lng: 14.454920120498087 },
    rarity: 'superior',
    xpReward: 30,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/BB_Centrum',
    description: {
      en: `Brave adventurer, welcome to BB Centrum — an office district in Michle that grew so large it eventually needed its own name change, its own squares, its own parks, and, as of 2020, its own seventeen-metre Porsche impaled on a giant pin.

Developer Passerinvest Group, led by Radim Passer, has been building out the site since 1996, gradually assembling 18 office buildings that now host more than a thousand companies and roughly 30,000 workers a day — a population larger than many actual Czech towns. In 2022 the whole complex quietly dropped the "BB Centrum" branding in favour of "Brumlovka," and has since added Brumlovka Square, E.G. Whiteová Square, two full parks (Park Brumlovka and Baarův Park), and a public athletics stadium, in an apparent attempt to convince everyone that this is a neighbourhood and not just a very large parking problem with reception desks.

Tenants over the years have included ČEZ, Microsoft, HP, O2, and Škoda Auto, and its tallest building, Filadelfie, made the shortlist for the 2011 Building of the Year award.

🥚 Easter Egg: Since 1 April 2020 — appropriately, April Fools' Day — the complex has been guarded by David Černý's sculpture "Brouk" (Beetle): a Porsche 911 skewered on a giant pin like a specimen in an entomology collection, made of eleven hydraulically-driven segments that visibly twitch for about six minutes, once every hour, from 6:45 in the morning until 10:45 at night. It is, unambiguously, the most alarming thing you will see in an office park all week.`,

      cz: `Statečný dobrodruhu, vítej v BB Centru — kancelářské čtvrti v Michli, která natolik vyrostla, že si nakonec vyžádala vlastní přejmenování, vlastní náměstí, vlastní parky a od roku 2020 i vlastní sedmnáctimetrové porsche napíchnuté na obří špendlík.

Developer Passerinvest Group vedený Radimem Passerem tuto lokalitu buduje od roku 1996 a postupně tu postavil 18 kancelářských budov, ve kterých dnes sídlí přes tisíc firem a denně pracuje zhruba 30 000 lidí — víc, než kolik má obyvatel nejedno skutečné české město. V roce 2022 celý komplex tiše opustil značku "BB Centrum" ve prospěch jména "Brumlovka" a od té doby přibylo Brumlovka Square, náměstí E. G. Whiteové, dva celé parky (Park Brumlovka a Baarův park) i veřejný atletický stadion — jako by se areál snažil všechny přesvědčit, že je to čtvrť, a ne jen velmi rozlehlý parkovací problém s recepcemi.

Mezi nájemci se v průběhu let objevily firmy jako ČEZ, Microsoft, HP, O2 nebo Škoda Auto a jeho nejvyšší budova, Filadelfie, se dostala do užšího výběru soutěže Stavba roku 2011.

🥚 Velikonoční vajíčko: Od 1. dubna 2020 — příhodně na apríla — areál hlídá socha Davida Černého "Brouk": porsche 911 napíchnuté na obří špendlík jako exemplář v entomologické sbírce, složené z jedenácti hydraulicky poháněných segmentů, které se jednou za hodinu, od 6:45 do 22:45, na zhruba šest minut viditelně rozpohybují. Je to jednoznačně nejznepokojivější věc, jakou ten týden v kancelářském parku uvidíš.`,

      zh: `勇敢的冒险家，欢迎来到BB中心——一片位于米赫莱（Michle）的办公区，规模大到最终需要改名、需要自己的广场、自己的公园，还在2020年拥有了一只被巨大别针钉住的十七米高保时捷。

开发商帕塞尔投资集团（Passerinvest Group）在拉迪姆·帕塞尔（Radim Passer）的带领下，自1996年起持续开发这片区域，逐步建起18栋办公楼，如今容纳着一千多家企业，每天约有三万人在此工作——这个数字比不少捷克实体城镇的居民还多。2022年，整个园区悄悄放弃了"BB中心"这个名字，改用"布鲁姆洛夫卡"（Brumlovka），此后又陆续增建了布鲁姆洛夫卡广场、E. G.怀特女士广场、两座完整的公园（布鲁姆洛夫卡公园与巴罗夫公园），以及一座向公众开放的田径场——仿佛在努力向所有人证明：这里是一个真正的社区，而不只是一个配有前台的超大停车难题。

多年来，这里的租户包括ČEZ电力集团、微软、惠普、O2电信和斯柯达汽车，而其中最高的建筑"非拉铁非"大厦，还曾入围2011年"年度建筑"奖的候选名单。

🥚 彩蛋：自2020年4月1日——恰好是愚人节——起，这片园区就由大卫·切尔尼（David Černý）的雕塑作品"甲虫"（Brouk）守护着：一辆保时捷911被一根巨大的别针钉住，仿佛昆虫标本收藏中的一件展品，由十一个液压驱动的部件组成，每小时（从早上6:45到晚上22:45）都会明显地抽动大约六分钟。毫无疑问，这是你这一周在某个办公园区里能看到的最令人不安的东西。`,
    },
  },
  {
    name: 'Filadelfie Building',
    slug: 'budova-filadelfie',
    localizedNames: { cz: 'Budova Filadelfie', zh: '非拉铁非大厦' },
    labels: ['modern', 'architecture', 'tower'],
    coordinates: { lat: 50.049106460461026, lng: 14.453193431447055 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Filadelfie_(budova)',
    description: {
      en: `Brave adventurer, welcome to the Filadelfie Building — the 72-metre glass tower that dominates the BB Centrum skyline and is named after a biblical city in modern-day Turkey, a fact that will surprise roughly one hundred percent of the office workers who assume it's named after Pennsylvania.

Built between 2008 and 2010 by the DaM studio for developer Passerinvest Group, Filadelfie packs 17 floors above ground and 6 below into a floor plan described by its own architects as "a cross inscribed in an ellipse" — four wings radiating outward, each wrapped in a curved glass facade designed to ripple like four distinct waves. The building held roughly 30,500 square metres of office space and 3,500 square metres of retail, made the second round of the 2011 Building of the Year competition, and parks about a thousand cars across six underground levels.

At street level it functions like a small self-contained town: a shopping arcade with a supermarket, a drugstore, a dry cleaner, a jeweller, a nail studio, a tailor, a florist, and a wine shop, plus a rooftop terrace and cafeteria on top, and Baarův Park immediately outside. The Filadelfie bus stop sits right at the door, one stop from Budějovická metro station.

🥚 Easter Egg: Philadelphia — from the Greek for "brotherly love" — was one of the Seven Churches of the Book of Revelation, located in what is now the Turkish city of Alaşehir. Whoever named a 17-storey Prague office tower after it either has a very dry sense of humour or a genuine soft spot for obscure biblical geography. Either way, the building's tenants mostly just think it sounds American.`,

      cz: `Statečný dobrodruhu, vítej u Budovy Filadelfie — 72metrové skleněné věže, která dominuje panoramatu BB Centra a je pojmenovaná po biblickém městě na území dnešního Turecka, což překvapí zhruba sto procent kancelářských pracovníků, kteří si myslí, že jde o narážku na Pensylvánii.

Filadelfii postavilo studio DaM pro developera Passerinvest Group mezi lety 2008 a 2010 a vměstnalo do ní 17 nadzemních a 6 podzemních podlaží do půdorysu, který sami architekti popsali jako "kříž vepsaný do elipsy" — čtyři křídla vybíhající do stran, každé obalené zvlněnou skleněnou fasádou navrženou tak, aby působila jako čtyři odlišné vlny. Budova nabízela zhruba 30 500 metrů čtverečních kancelářských ploch a 3 500 metrů čtverečních obchodních prostor, postoupila do druhého kola soutěže Stavba roku 2011 a v šesti podzemních podlažích parkuje zhruba tisíc aut.

V přízemí funguje jako malé samostatné městečko: obchodní pasáž se supermarketem, drogerií, čistírnou, klenotnictvím, nehtovým studiem, krejčovstvím, květinářstvím a vinotékou, nahoře střešní terasa a jídelna, a hned vedle Baarův park. Zastávka Filadelfie je přímo u dveří, jednu stanici od stanice metra Budějovická.

🥚 Velikonoční vajíčko: Filadelfie — z řeckého slova pro "bratrskou lásku" — byla jedním ze sedmi měst zmíněných ve Zjevení svatého Jana, ležícím na území dnešního tureckého města Alaşehir. Ať už tuhle sedmnáctipatrovou pražskou kancelářskou věž pojmenoval kdokoliv, měl buď velmi suchý smysl pro humor, nebo opravdovou slabost pro nejasnou biblickou geografii. Nájemcům budovy to tak jako tak většinou zní prostě jako Amerika.`,

      zh: `勇敢的冒险家，欢迎来到非拉铁非大厦——这座72米高的玻璃塔楼是BB中心天际线上的地标建筑，其名字来自今天土耳其境内的一座圣经古城，而这个事实大概会让几乎所有以为它是在致敬美国宾夕法尼亚州的办公室职员感到意外。

非拉铁非大厦由DaM建筑事务所为开发商帕塞尔投资集团设计建造，工期为2008年至2010年，地上17层、地下6层，其平面布局被建筑师本人描述为"内接于椭圆中的十字形"——四翼向外辐射，每一翼都包裹着弧形玻璃幕墙，设计成四道各自独立、如波浪般起伏的立面。大楼提供约30,500平方米的办公面积和3,500平方米的商业面积，曾入围2011年"年度建筑"奖的第二轮评选，六层地下车库可停放约一千辆汽车。

在地面层，它俨然是一座自给自足的小城镇：商业拱廊里有超市、药妆店、干洗店、珠宝店、美甲店、裁缝店、花店和葡萄酒专卖店，楼顶还设有露天平台与自助餐厅，紧邻着巴罗夫公园。"非拉铁非"公交车站就设在大楼门口，距离布杰约维茨卡（Budějovická）地铁站仅一站之遥。

🥚 彩蛋："非拉铁非"（Filadelfie）一词源自希腊语，意为"兄弟之爱"，是《启示录》中提到的"七个教会"所在城市之一，位于今天土耳其的阿拉谢希尔（Alaşehir）。不管是谁给这座布拉格十七层办公塔楼取了这个名字，这人要么幽默感相当高冷，要么是真心偏爱冷门的圣经地理知识。但不管怎样，在这里上班的租户们大多只觉得这名字听起来很"美国"。`,
    },
  },
  {
    name: 'Church of Jesus Christ of Latter-day Saints',
    slug: 'cirkev-lds-praha',
    localizedNames: { cz: 'Církev Ježíše Krista Svatých posledních dnů', zh: '耶稣基督后期圣徒教会' },
    labels: ['church', 'modern'],
    coordinates: { lat: 50.04770874538555, lng: 14.440297026330125 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/C%C3%ADrkev_Je%C5%BE%C3%AD%C5%A1e_Krista_Svat%C3%BDch_posledn%C3%ADch_dn%C5%AF',
    description: {
      en: `Brave adventurer, welcome to the Church of Jesus Christ of Latter-day Saints in Prague — a congregation whose Czech members once got around a total government ban by teaching each other "Christian yoga," which is either the cleverest disguise in local religious history or proof that 1980s bureaucrats really didn't ask enough follow-up questions.

The Church arrived in the Czech lands in the 19th century but wasn't officially recognised until 1929, when a Czechoslovak mission was formally established. Activity actually intensified during the wartime occupation, with a separate Czech-language mission application filed in May 1940. That all came to a hard stop in 1950, when the communist regime banned the Church outright; members kept meeting anyway, quietly, in each other's apartments from the mid-1970s onward, most often at the home of Jiří and Olga Šnederfler, who led the underground Prague congregation through the last stretch of the Cold War.

Everything changed after the 1989 Velvet Revolution: the mission reopened, a historic building near Hradčanská was purchased and dedicated in 1994, and in 2016 the Prague Stake was organised — the first of its kind in the country. Ground was finally broken on this purpose-built stake centre on 12 April 2024, the first building the Church has ever constructed from scratch in the Czech Republic, arriving almost exactly 95 years after official recognition.

🥚 Easter Egg: The "Christian yoga" workaround wasn't just a cute cover story — it reportedly brought in around 130 converts during the years the Church was formally banned, meaning the regime's censors were, in the end, running interference for the exact thing they were trying to prevent.`,

      cz: `Statečný dobrodruhu, vítej u sboru Církve Ježíše Krista Svatých posledních dnů v Praze — společenství, jehož čeští členové kdysi obešli úplný státní zákaz tím, že se vzájemně učili "křesťanské józe", což je buď nejchytřejší zástěrka v místních náboženských dějinách, nebo důkaz, že se úředníci v 80. letech opravdu neptali dost podrobně.

Církev se v českých zemích objevila už v 19. století, ale oficiálně uznána byla až v roce 1929, kdy vzniklo samostatné československé misijní působiště. Činnost se paradoxně zintenzivnila i za válečné okupace, kdy byla v květnu 1940 podána žádost o samostatnou českou misii. Vše tvrdě skončilo v roce 1950, kdy komunistický režim církev úplně zakázal; členové se přesto dál scházeli, potají, od poloviny 70. let nejčastěji v bytě manželů Jiřího a Olgy Šnederferových, kteří vedli podzemní pražský sbor po zbytek studené války.

Vše se změnilo po sametové revoluci v roce 1989: misie byla znovu otevřena, v roce 1994 byla vysvěcena historická budova poblíž Hradčanské, kterou církev zakoupila, a v roce 2016 vznikl pražský kůl (stake) — první svého druhu v zemi. Základní kámen tohoto účelově postaveného sborového centra byl slavnostně položen 12. dubna 2024 — jde o vůbec první budovu, kterou církev v Česku postavila od základů, téměř přesně 95 let po oficiálním uznání.

🥚 Velikonoční vajíčko: "Křesťanská jóga" nebyla jen roztomilá zástěrka — údajně díky ní za dobu formálního zákazu církve přibylo kolem 130 nových konvertitů, takže cenzoři režimu nakonec nevědomky pomáhali přesně tomu, čemu se snažili zabránit.`,

      zh: `勇敢的冒险家，欢迎来到耶稣基督后期圣徒教会布拉格分会——这个团体的捷克信徒，曾用互相传授"基督教瑜伽"的方式，绕过了政府的全面禁令，这要么是当地宗教史上最聪明的伪装，要么就证明了上世纪80年代的官员们，真的没有多问几句。

该教会早在19世纪就已传入捷克地区，但直到1929年，随着一个独立的捷克斯洛伐克传教区正式成立，才获得官方承认。有意思的是，二战占领期间，教会活动反而有所加强，1940年5月还曾提交过一份独立捷克语传教区的申请。这一切在1950年戛然而止——共产政权全面取缔了该教会；但信徒们并未因此停止聚会，从上世纪70年代中期开始，他们悄悄在彼此的公寓里继续聚会，最常见的地点是伊日（Jiří）与奥尔加·什内德费尔（Olga Šnederfler）夫妇的家中，两人在冷战最后阶段一直带领着这个地下布拉格教会。

1989年天鹅绒革命后，一切都发生了变化：传教区重新开放，教会于1994年购置并祝圣了一栋位于赫拉德恰纳（Hradčanská）附近的历史建筑，2016年，布拉格支联会（Stake）正式成立——这是捷克境内第一个此类组织。这座专门建造的支联会中心已于2024年4月12日正式动工，是教会在捷克境内从零开始建造的第一栋建筑，距离1929年获得官方承认，恰好过去了将近95年。

🥚 彩蛋："基督教瑜伽"绝不仅仅是个可爱的伪装——据称，正是靠着它，在教会被正式取缔的那些年里，竟带来了大约130名新皈依者，也就是说，政权的审查人员最终在无意中，为自己极力想要阻止的事情大开了方便之门。`,
    },
  },
  {
    name: 'Fidlovačka Theatre',
    slug: 'divadlo-na-fidlovacce',
    localizedNames: { cz: 'Divadlo Na Fidlovačce', zh: '菲德洛瓦奇卡剧院' },
    labels: ['cultural', 'historical', 'architecture'],
    coordinates: { lat: 50.064749551919995, lng: 14.435802377867596 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Divadlo_na_Fidlova%C4%8Dce',
    description: {
      en: `Brave adventurer, welcome to Divadlo Na Fidlovačce — a Nusle theatre named after an 1834 play so influential that one throwaway song from it eventually became the entire country's national anthem, which is a lot of pressure to put on a building.

Actor and manager Stanislav Langer built the theatre entirely at his own expense in 1921 — the first purpose-built theatre to open in newly independent Czechoslovakia — on a plot beside the Botič stream. It opened on 5 November 1921 with Josef Kajetán Tyl's "Drahomíra," followed, fittingly, the very next night by "Fidlovačka" itself, the folk comedy whose song "Kde domov můj" ("Where Is My Home") would go on to become the Czech national anthem. The theatre spent the rest of the twentieth century cycling through names — Tylovo divadlo, Divadlo Pod Vyšehradem, Divadlo Na Fidlovačce, Hudební divadlo v Nuslích — before closing entirely in 1978 and sitting derelict for two decades.

Actors Tomáš Töpfer and Eliška Balzerová founded the Nadace Fidlovačka foundation in 1995 to save it, and with backing from the Prague 4 district, the theatre reopened on 28 October 1998 with "Fiddler on the Roof," which ran for sixteen consecutive years. A smaller chamber stage, Komorní Fidlovačka, was added in a converted cinema in 2006.

🥚 Easter Egg: The play that gave this theatre its name isn't just old trivia — "Kde domov můj," first performed as incidental music in "Fidlovačka" in 1834, is still, to this day, the literal national anthem of the Czech Republic. Somewhere in Nusle sits a theatre carrying the name of the single most consequential four minutes of music in Czech history, and most people walk past it without a second thought.`,

      cz: `Statečný dobrodruhu, vítej v Divadle Na Fidlovačce — nuselském divadle pojmenovaném po hře z roku 1834, která byla natolik vlivná, že jedna z jejích písní se nakonec stala státní hymnou celé země, což je na jednu budovu poměrně velký tlak.

Herec a ředitel Stanislav Langer postavil divadlo v roce 1921 zcela z vlastních prostředků — jako první účelově postavené divadlo otevřené v nově vzniklém Československu — na pozemku u potoka Botiče. Otevřelo se 5. listopadu 1921 Tylovou "Drahomírou" a hned příští večer, příznačně, samotnou "Fidlovačkou" — lidovou veselohrou, jejíž píseň "Kde domov můj" se později stala českou státní hymnou. Divadlo pak po zbytek dvacátého století prošlo řadou přejmenování — Tylovo divadlo, Divadlo Pod Vyšehradem, Divadlo Na Fidlovačce, Hudební divadlo v Nuslích —, než v roce 1978 úplně zavřelo a na dvacet let zchátralo.

Herci Tomáš Töpfer a Eliška Balzerová založili v roce 1995 Nadaci Fidlovačka, aby divadlo zachránili, a s podporou městské části Praha 4 se divadlo znovu otevřelo 28. října 1998 muzikálem "Šumař na střeše", který se hrál nepřetržitě šestnáct let. V roce 2006 přibyla menší Komorní Fidlovačka v přestavěném kině.

🥚 Velikonoční vajíčko: Hra, po které je divadlo pojmenované, není jen zajímavost do kvízu — "Kde domov můj", poprvé uvedená jako doprovodná píseň ve "Fidlovačce" v roce 1834, je dodnes doslova státní hymnou České republiky. Někde v Nuslích tak stojí divadlo nesoucí jméno nejvýznamnějších čtyř minut hudby v českých dějinách, a většina lidí kolem něj projde bez druhého pohledu.`,

      zh: `勇敢的冒险家，欢迎来到菲德洛瓦奇卡剧院——努斯莱区的一座剧院，得名于一部1834年的戏剧，这部戏影响力之大，其中一首随手写就的插曲后来竟成了整个国家的国歌，这对一栋建筑物来说压力可不小。

演员兼经理人斯坦尼斯拉夫·兰格尔（Stanislav Langer）于1921年完全自掏腰包，在博季奇溪（Botič）旁的一块土地上建起了这座剧院——它是新独立的捷克斯洛伐克开幕的第一座专门建造的剧院。剧院于1921年11月5日以蒂尔（Tyl）的剧作《德拉霍米拉》（Drahomíra）开幕，紧接着第二天晚上，恰如其分地上演了《菲德洛瓦奇卡》本身——这部民间喜剧中的插曲《我的家在哪里》（Kde domov můj）后来成为了捷克国歌。此后的整个二十世纪里，剧院几经易名——蒂尔剧院、维谢赫拉德山下剧院、菲德洛瓦奇卡剧院、努斯莱音乐剧院——直到1978年彻底关闭，荒废长达二十年。

演员托马什·特普费尔（Tomáš Töpfer）与埃利什卡·巴尔泽罗娃（Eliška Balzerová）于1995年成立了"菲德洛瓦奇卡基金会"，致力于挽救这座剧院；在布拉格4区的支持下，剧院于1998年10月28日以音乐剧《屋顶上的提琴手》重新开幕，该剧连续上演长达十六年。2006年，剧院又在一座改建的电影院里增设了小型的"室内菲德洛瓦奇卡"舞台。

🥚 彩蛋：这座剧院得名的那部戏剧，绝不只是个冷知识——《我的家在哪里》最早于1834年作为《菲德洛瓦奇卡》一剧的配乐首次演出，如今依然是捷克共和国名副其实的国歌。努斯莱的某个角落，就这样静静立着一座剧院，承载着捷克历史上最具分量的那四分钟音乐的名字，而大多数人从它面前经过时，甚至都不会多看一眼。`,
    },
  },
  {
    name: 'Artistic Garden in Nusle',
    slug: 'umelecka-zahrada-nusle',
    localizedNames: { cz: 'Umělecká zahrada v Nuslích', zh: '努斯莱艺术花园' },
    labels: ['hidden-gem', 'cultural', 'historical'],
    coordinates: { lat: 50.06427543833016, lng: 14.42764116414801 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Um%C4%9Bleck%C3%A1_zahrada_v_Nusl%C3%ADch',
    description: {
      en: `Brave adventurer, welcome to the Artistic Garden in Nusle — a sculpture-filled courtyard tucked into a hillside beneath the Nuselský Bridge, so thoroughly hidden that most Praguers who cross that bridge every single day have no idea it exists directly under their feet.

Sculptor Karel Novák bought the land from the Vyšehrad Chapter in 1924 and built a working studio here, lit from the north and equipped with a pantograph — one of the first in the country used to scale up sculptural designs. The workshop went on to produce pieces and models for some of the biggest names in Czech sculpture, including Bohumil Kafka's bust of Antonín Švehla and Josef Václav Pekárek's allegorical Vltava figure.

Nationalised in the 1950s, the site had a strange second act: it became a base for Krátký film Praha's animation studio, the outfit behind beloved Czech cartoons like "Pat a Mat" and "Kocour Mikeš." Then, during construction of the Nuselský most in the 1970s, the site served as a builders' yard — and a number of surviving sculptures were unceremoniously buried or poured straight into the bridge's own concrete foundations. After 1990s restitution, a new private owner rebuilt the garden from old photographs, and it has been slowly reopening to the public ever since, with a permanent exhibition running since May 2024.

🥚 Easter Egg: Generations of Czech children grew up watching cartoons animated on this exact patch of ground — meaning "Pat a Mat" and a hillside full of century-old sculptures buried in a bridge's foundations share the same postal address.`,

      cz: `Statečný dobrodruhu, vítej v Umělecké zahradě v Nuslích — na sochy nabitém dvorku zapuštěném do svahu pod Nuselským mostem, tak dokonale skrytém, že většina Pražanů, kteří po tom mostě chodí každý den, netuší, že jim leží přímo pod nohama.

Sochař Karel Novák koupil pozemek od Vyšehradské kapituly v roce 1924 a postavil zde funkční ateliér, osvětlený ze severu a vybavený pantografem — jedním z prvních v zemi používaných ke zvětšování sochařských návrhů. Dílna postupně vytvářela díla a modely pro nejvýznamnější jména české sochařiny, včetně busty Antonína Švehly od Bohumila Kafky nebo alegorické postavy Vltavy od Josefa Václava Pekárka.

Po znárodnění v 50. letech prožil areál zvláštní druhé dějství: stal se základnou animačního studia Krátkého filmu Praha, autora oblíbených českých pohádek jako "Pat a Mat" nebo "Kocour Mikeš". Během stavby Nuselského mostu v 70. letech pak areál sloužil jako stavební dvůr — a řada dochovaných soch byla bez velkých okolků zahrabána, nebo přímo zalita do betonových základů samotného mostu. Po restituci v 90. letech nový soukromý majitel zahradu podle starých fotografií znovu vybudoval a od té doby se postupně otevírá veřejnosti; stálá expozice běží od května 2024.

🥚 Velikonoční vajíčko: Celé generace českých dětí vyrůstaly na pohádkách animovaných přesně na tomto kousku země — takže "Pat a Mat" a svah plný stoletých soch zalitých v základech mostu mají doslova stejnou adresu.`,

      zh: `勇敢的冒险家，欢迎来到努斯莱艺术花园——一座嵌在努斯莱大桥（Nuselský most）下方山坡里、堆满雕塑的庭院，隐蔽得如此彻底，以至于每天从那座桥上经过的大多数布拉格人，都完全不知道自己脚下就藏着这样一个地方。

雕塑家卡雷尔·诺瓦克（Karel Novák）于1924年从维谢赫拉德教士会（Vyšehrad Chapter）手中买下这块地，在此建起了一间朝北采光的工作室，并配备了一台缩放绘图仪（pantograph）——这是捷克最早用于放大雕塑设计稿的设备之一。这间工坊后来为许多捷克雕塑界的重量级人物制作作品和模型，其中包括博胡米尔·卡夫卡（Bohumil Kafka）为安东宁·什维赫拉（Antonín Švehla）所作的胸像，以及约瑟夫·瓦茨拉夫·佩卡雷克（Josef Václav Pekárek）那尊寓意伏尔塔瓦河的寓言雕塑。

上世纪50年代被收归国有后，这个地方迎来了一段奇特的"第二人生"：它变成了"短片电影布拉格"（Krátký film Praha）动画工作室的据点，制作出了《帕特与马特》《米克什猫》等深受捷克人喜爱的经典动画片。而在上世纪70年代努斯莱大桥的施工期间，这里又被用作施工场地——不少留存下来的雕塑作品，就这样毫不留情地被埋入土中，或者直接被浇筑进了大桥自身的混凝土地基里。经过90年代的产权归还，新的私人业主依照老照片重建了这座花园，此后逐步向公众开放，常设展览自2024年5月起正式运行。

🥚 彩蛋：一代又一代捷克孩子，都是看着在这片土地上制作出来的动画片长大的——也就是说，《帕特与马特》和那片埋藏着百年雕塑、被浇筑进桥梁地基的山坡，其实拥有着完全相同的地址。`,
    },
  },
  {
    name: 'Nusle Valley',
    slug: 'nuselske-udoli',
    localizedNames: { cz: 'Nuselské údolí', zh: '努斯莱山谷' },
    labels: ['nature', 'historical'],
    coordinates: { lat: 50.06567560723365, lng: 14.426793638481088 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Nuselsk%C3%A9_%C3%BAdol%C3%AD',
    description: {
      en: `Brave adventurer, welcome to Nusle Valley — a district whose medieval German nickname, "Jammertal," literally translates to "Valley of Lament," which is not the sort of real-estate branding you see very often.

The valley's history runs deep: Neolithic finds and early Slavic traces predate its first written mention in 1088, in the founding charter of the Vyšehrad Chapter. Medieval records also knew it more cheerfully as "Vallis vinarium" — Wine Valley — for the vineyards that once covered its south-facing slopes. That cheer didn't survive the Thirty Years' War: in 1639 and 1648, Swedish artillery used the valley's high ground to bombard Vyšehrad and the New Town walls at Karlov, and the devastation left behind is what earned it the grim German nickname that eventually Czechified into "Jamrtál."

Things picked back up considerably by the 20th century — Nusle became a town in its own right in 1898 and joined Greater Prague in 1922 with over 34,000 residents. The valley's brewing tradition dates to 1694, when Count Jan Josef Sezima of Vrtba founded the Nuselský Pivovar, a brewery whose name is tied to the same 1834 folk operetta, "Fidlovačka," that gave Czechia its national anthem. Looming 40 metres above it all today is the Nuselský most, opened in 1973 to serve the new Pankrác housing estates, carrying Metro Line C through its belly and an expressway across its back — and, more solemnly, fitted with fencing and an inverted-streetlamp memorial sculpture by Krištof Kintera after decades as one of the country's most notorious sites for suicides.

🥚 Easter Egg: Tucked into the valley's southern slope, directly beneath that same bridge, sits the Artistic Garden in Nusle — a hidden sculpture studio where, during the bridge's 1970s construction, several irreplaceable artworks were quietly poured into the very foundations holding the bridge up. The valley of lament, it turns out, has never stopped living up to its name in one way or another.`,

      cz: `Statečný dobrodruhu, vítej v Nuselském údolí — čtvrti, jejíž středověká německá přezdívka "Jammertal" se doslova překládá jako "Údolí nářku", což není zrovna realitní marketing, se kterým se člověk setkává na každém kroku.

Historie údolí sahá hluboko: nálezy z mladší doby kamenné a stopy raných Slovanů předcházejí jeho první písemné zmínce z roku 1088, v zakládací listině Vyšehradské kapituly. Středověké prameny je znaly i pod veselejším jménem "Vallis vinarium" — Viničné údolí — podle vinic, které kdysi pokrývaly jeho k jihu obrácené svahy. Tahle veselost nepřežila třicetiletou válku: v letech 1639 a 1648 využívala švédská dělostřelba návrší údolí k ostřelování Vyšehradu a novoměstských hradeb u Karlova, a spoušť, která po nich zůstala, si vysloužila onu ponurou německou přezdívku, jež se později počeštila na "Jamrtál".

Ve 20. století se věci výrazně zlepšily — Nusle se v roce 1898 staly samostatným městem a v roce 1922 se s více než 34 000 obyvateli připojily k Velké Praze. Pivovarnická tradice údolí sahá do roku 1694, kdy hrabě Jan Josef Sezima z Vrtby založil Nuselský pivovar, jehož jméno je spjato se stejnou lidovou veselohrou "Fidlovačka" z roku 1834, která Česku dala státní hymnu. Nad tím vším se dnes ve výšce 40 metrů tyčí Nuselský most, otevřený v roce 1973 kvůli nové panelákové zástavbě na Pankráci, kterým prochází trasa metra C a po jehož hřbetu vede magistrála — a který je, smutněji, po desetiletích proslulosti jedním z nejznámějších míst sebevražd v zemi opatřen zábranami a memoriální sochou obráceného pouličního osvětlení od Krištofa Kintery.

🥚 Velikonoční vajíčko: Na jižním svahu údolí, přímo pod týmž mostem, se skrývá Umělecká zahrada v Nuslích — skrytý sochařský ateliér, kde byla během stavby mostu v 70. letech řada nenahraditelných uměleckých děl potichu zalita přímo do základů, na kterých most stojí dodnes. Údolí nářku svému jménu, zdá se, nikdy tak úplně nepřestalo dostávat za pravdu.`,

      zh: `勇敢的冒险家，欢迎来到努斯莱山谷——这个街区中世纪的德语绰号"Jammertal"，字面意思就是"哀叹之谷"，这可不是你经常能见到的那种房地产宣传语。

这座山谷的历史十分久远：早在1088年维谢赫拉德教士会的建立文书中首次留下文字记载之前，这里就已发现新石器时代的遗物和早期斯拉夫人活动的痕迹。中世纪的文献里，它也曾有过一个更欢快的名字——"Vallis vinarium"（葡萄酒山谷），因为它朝南的山坡曾一度种满葡萄园。可惜这份欢快没能挺过三十年战争：1639年与1648年，瑞典炮兵利用山谷的高地炮轰维谢赫拉德和卡尔洛夫（Karlov）一带的新城城墙，留下的满目疮痍，为这里赢得了那个阴郁的德语绰号，后来又被捷克语化为"Jamrtál"。

到了20世纪，情况大为改观——努斯莱于1898年正式升格为独立城镇，1922年又携三万四千多名居民并入大布拉格。这座山谷的酿酒传统可以追溯到1694年，扬·约瑟夫·塞济马·冯·弗尔特巴伯爵（Jan Josef Sezima z Vrtby）在此创立了努斯莱啤酒厂，其名字与1834年那部同样为捷克带来国歌的民间喜剧《菲德洛瓦奇卡》紧密相连。如今，一座高达40米的努斯莱大桥高高矗立在山谷上方，它于1973年通车，最初是为了服务潘克拉茨（Pankrác）新建的住宅区，地铁C线从桥身中穿过，城市快速路则从桥面上方通过——而更令人唏嘘的是，在数十年来一直是全国最臭名昭著的自杀地点之一后，如今桥上已加装了防护网，并立有克里什托夫·金特拉（Krištof Kintera）创作的倒置路灯纪念雕塑。

🥚 彩蛋：就在这座山谷的南坡上，正对着同一座桥的下方，藏着努斯莱艺术花园——一间隐秘的雕塑工作室，在上世纪70年代大桥施工期间，多件无可替代的艺术品曾被悄悄浇筑进如今依然支撑着这座桥梁的地基之中。这座"哀叹之谷"，看来从未真正停止过应验自己的名字。`,
    },
  },
  {
    name: 'Church of the Nativity of the Virgin Mary (Malá Chuchle)',
    slug: 'kostel-narozeni-panny-marie-mala-chuchle',
    localizedNames: { cz: 'Kostel Narození Panny Marie (Malá Chuchle)', zh: '小胡赫莱圣母诞生堂' },
    labels: ['church', 'historical', 'architecture'],
    coordinates: { lat: 50.02449025076059, lng: 14.392301896351261 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Kostel_Narozen%C3%AD_Panny_Marie_(Mal%C3%A1_Chuchle)',
    description: {
      en: `Brave adventurer, welcome to the Church of the Nativity of the Virgin Mary in Malá Chuchle — a modest Baroque parish church built directly on top of the flooded-out ruins of its own medieval predecessor, which is either resourceful engineering or a very calm response to eight centuries of the Vltava trying to reclaim the site.

A Romanesque church already stood here in the 12th century, becoming a parish church by 1264. In 1304, King Václav II granted both Chuchle villages to Zbraslav Monastery, which ran the church almost continuously until Emperor Joseph II dissolved it centuries later. The original building never really recovered from repeated flooding and groundwater damage, and was eventually demolished; the site was filled in, and a new late-Baroque church was built directly over the old foundations, consecrated on 7 September 1774 by Zbraslav's Abbot Celestin Stoy — paid for partly by donations from guests of the nearby spa.

The church survived the Hussite raids of 1420, which burned down its monastic overseer, and centuries of quiet parish life afterward. Its lantern-topped onion dome stands in for a proper bell tower, and it still holds two historic bells cast in 1708 and 1775.

🥚 Easter Egg: In 2019 the Roman Catholic Church handed this building over to a Greek-speaking Orthodox parish — meaning a church built and rebuilt over eight centuries of Catholic history now hosts liturgy in Greek, on a patch of riverbank ground that has apparently never stopped changing hands.`,

      cz: `Statečný dobrodruhu, vítej v Kostele Narození Panny Marie v Malé Chuchli — skromném barokním farním kostele, postaveném přímo na zatopených troskách svého středověkého předchůdce, což je buď důmyslné stavební řešení, nebo velmi klidná reakce na osm století, kdy se Vltava snažila místo dostat zpátky.

Románský kostel tu stál už ve 12. století a farním se stal do roku 1264. V roce 1304 daroval král Václav II. obě chuchelské vsi zbraslavskému klášteru, který kostel spravoval téměř nepřetržitě až do jeho zrušení císařem Josefem II. o staletí později. Původní stavba se nikdy pořádně nevzpamatovala z opakovaných povodní a podzemní vlhkosti a nakonec byla zbořena; pozemek byl navezen a přímo na starých základech vyrostl nový pozdně barokní kostel, vysvěcený 7. září 1774 zbraslavským opatem Celestinem Stoyem — částečně zaplacený z darů hostů nedalekých lázní.

Kostel přežil husitské nájezdy roku 1420, které vypálily jeho klášterního správce, i staletí následného tichého farního života. Lucernu s cibulovou bání má místo pořádné zvonice a dodnes v ní visí dva historické zvony z let 1708 a 1775.

🥚 Velikonoční vajíčko: V roce 2019 svěřila římskokatolická církev tuto budovu řecky mluvící pravoslavné farnosti — takže kostel budovaný a přestavovaný přes osm století katolických dějin dnes hostí liturgii v řečtině, na kousku říčního břehu, který zjevně nikdy nepřestal měnit majitele.`,

      zh: `勇敢的冒险家，欢迎来到小胡赫莱圣母诞生堂——一座朴素的巴洛克堂区教堂，直接建在其中世纪前身被洪水淹毁的废墟之上，这要么是一种因地制宜的建筑智慧，要么只是对伏尔塔瓦河八个世纪以来试图收回这块土地的一种非常淡定的回应。

早在12世纪，这里就已经有一座罗曼式教堂，到1264年成为堂区教堂。1304年，瓦茨拉夫二世国王将大小胡赫莱两个村庄一并赐予兹布拉斯拉夫修道院，此后修道院几乎不间断地掌管这座教堂，直到几个世纪后被约瑟夫二世皇帝下令解散。原来的建筑始终没能从反复的洪水和地下水侵蚀中恢复过来，最终被拆除；原址被填平后，一座新的晚期巴洛克教堂直接建在旧地基之上，于1774年9月7日由兹布拉斯拉夫修道院院长采莱斯廷·斯托伊主持祝圣——部分建造费用来自附近温泉浴场客人的捐款。

这座教堂挺过了1420年的胡斯战争突袭——那场突袭烧毁了它的修道院管理机构——以及此后数百年平静的堂区生活。它以带灯笼式洋葱顶的塔楼代替了正规钟楼，如今仍悬挂着两口分别铸于1708年和1775年的历史钟。

🥚 彩蛋：2019年，罗马天主教会将这座建筑交给了一个讲希腊语的东正教堂区——也就是说，一座历经八个世纪天主教历史反复重建的教堂，如今用希腊语举行礼拜，而这片河畔的土地，看来就从未真正停止过易主。`,
    },
  },
  {
    name: 'Malá Chuchle Mill and Sugar Factory',
    slug: 'mlyn-a-cukrovar-mala-chuchle',
    localizedNames: { cz: 'Mlýn a cukrovar Malá Chuchle', zh: '小胡赫莱磨坊与制糖厂' },
    labels: ['ruin', 'factory', 'historical'],
    coordinates: { lat: 50.02490492853393, lng: 14.39004859178085 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Malá Chuchle Mill and Sugar Factory — a single riverside building that has, over roughly four centuries, been a flour mill, an abandoned ruin, a spa's water supplier, a failed sugar refinery, a rented-out gun factory, and a sugar refinery again, which is a genuinely impressive number of career changes for one address.

Tax records from 1654 already describe the mill as a single-wheel operation standing "currently abandoned" — so it was derelict before most of its recorded history even properly began. It was rebuilt and, by 1736, shared its water supply directly with the neighbouring Chuchle spa next door, with the two operators splitting rent and water rights under a mid-18th-century arrangement. In 1831 a beet-sugar factory was set up on the site, one of only four founded in Bohemia that year — but water shortages and poor beet harvests killed the venture almost immediately, and the buildings ended up rented out for roughly twelve years to arms manufacturers Evans and Lee.

The mill eventually got a second shot at sugar in the second half of the 19th century, when it was rebuilt specifically for beet processing. Its physical form changed too: the original mill sat parallel to the stream, but reconstruction turned it to span directly across the water. Between 1952 and 1954, a railway tunnel blasted through the rock nearby forced the stream to be rerouted over an artificial waterfall, and the building has stood inaccessible and without functioning machinery ever since.

🥚 Easter Egg: For about a decade in the 19th century, this quiet riverside mill was, technically, a weapons factory. Whatever Evans and Lee were manufacturing here, "flour mill turned failed sugar refinery turned gun works" is not a sentence most historical buildings can honestly claim.`,

      cz: `Statečný dobrodruhu, vítej u Mlýna a cukrovaru v Malé Chuchli — jedné jediné budovy u řeky, která za zhruba čtyři století stihla být mlýnem, opuštěnou ruinou, dodavatelem vody pro lázně, zkrachovalou cukrovarnou, pronajatou zbrojovkou a nakonec znovu cukrovarem, což je na jednu adresu opravdu působivý počet kariérních obratů.

Berní rula z roku 1654 už popisuje mlýn jako jednokolový provoz, který je "nyní pustý" — takže zchátral ještě dřív, než pořádně začala jeho zdokumentovaná historie. Byl znovu postaven a do roku 1736 sdílel vodu přímo se sousedními chuchelskými lázněmi, přičemž si oba provozovatelé podle dohody z poloviny 18. století dělili nájem i vodní práva. V roce 1831 tu vznikl cukrovar na řepný cukr, jeden ze čtyř založených toho roku v Čechách — nedostatek vody a špatná úroda řepy ale podnik téměř okamžitě zabily a budovy skončily na dvanáct let pronajaté zbrojařům Evansovi a Leemu.

Mlýn nakonec dostal druhou šanci s cukrem ve druhé polovině 19. století, kdy byl přestavěn přímo pro zpracování řepy. Změnila se i jeho podoba: původní mlýn stál rovnoběžně s potokem, ale při přestavbě se otočil tak, aby jej přemostil. Mezi lety 1952 a 1954 vyrazený železniční tunel ve skále poblíž si vynutil přeložení potoka přes umělý vodopád, a budova od té doby stojí nepřístupná a bez fungující techniky.

🥚 Velikonoční vajíčko: Zhruba deset let v 19. století byl tenhle tichý mlýn u řeky technicky vzato zbrojovkou. Ať už tu Evans a Lee vyráběli cokoliv, věta "mlýn, který se stal zkrachovalou cukrovarnou a pak zbrojovkou" je něco, čím se málokterá historická budova může poctivě chlubit.`,

      zh: `勇敢的冒险家，欢迎来到小胡赫莱磨坊与制糖厂——这座位于河边的建筑，在大约四个世纪的时间里，先后当过面粉磨坊、废弃的空壳、温泉浴场的水源供应地、一家倒闭的制糖厂、一家出租的军工厂，最后又变回了一家制糖厂，对同一个地址来说，这个"职业转型"次数着实令人印象深刻。

早在1654年的税务登记册中，这座磨坊就已经被描述为一座"目前处于废弃状态"的单轮水磨——也就是说，它早在被正式记录下来之前，就已经荒废过一次。它后来被重建，到1736年，已经直接与相邻的胡赫莱温泉浴场共用水源，根据18世纪中叶的一项协议，两家经营者分摊租金与水权。1831年，这里建起了一座甜菜制糖厂，是当年在波希米亚成立的仅有四家制糖厂之一——但水源短缺与甜菜歉收几乎立刻就让这项事业夭折，厂房随后被出租给军火制造商埃文斯与李（Evans and Lee），租期长达十二年左右。

磨坊最终在19世纪下半叶迎来了制糖业的第二次机会，被专门改建用于加工甜菜。它的外观也随之改变：原来的磨坊与溪流平行而建，改建后则调转方向，直接横跨在水面之上。1952年至1954年间，附近开凿的一条铁路隧道穿山而过，迫使溪流改道，越过一道人工瀑布，此后这座建筑便一直无法进入，机械设备也早已不再运转。

🥚 彩蛋：在19世纪的大约十年间，这座河边的安静磨坊，严格说来其实是一家军工厂。不管埃文斯和李当年在这里生产的是什么，"磨坊变身失败制糖厂，再变身军工厂"这种履历，恐怕没有几座历史建筑能够如此坦然地拿出来讲。`,
    },
  },
  {
    name: 'Chuchle Spa',
    slug: 'chuchelske-lazne',
    localizedNames: { cz: 'Chuchelské lázně', zh: '胡赫莱温泉浴场' },
    labels: ['historical', 'ruin', 'hidden-gem'],
    coordinates: { lat: 50.025322109943446, lng: 14.386853249571251 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Chuchelsk%C3%A9_l%C3%A1zn%C4%9B',
    description: {
      en: `Brave adventurer, welcome to the Chuchle Spa (Chuchelské lázně) — a once-fashionable 18th-century health resort built around a spring nobody can actually prove ever cured anything, which didn't stop it from becoming one of Prague's favourite day trips for the better part of two centuries.

The spa grew up around a calcium-rich spring flowing from local Silurian and Devonian rock, first chapel-adorned in the early 18th century and later enclosed in a grotto after a relief of the Virgin Mary was installed nearby. Professor Jan Antonín Scrinci ran a water analysis in 1760 that supposedly confirmed its healing properties, and visitors — arriving by horse carriage from Smíchov or via a since-vanished dedicated railway station — flocked here through the 19th century for the mineral water, the grotto, and the excursion atmosphere. A late-classicist renovation in 1879 gave the spa building its more polished final look.

It wasn't purely peaceful: on 28 June 1881, German and Czech students brawled at the inn's upper restaurant in what locals still call the "Chuchelská bitka" (Chuchle Battle), a small but telling flashpoint of the era's nationalist tensions. By 1900 the water's curative reputation had collapsed, the spa quietly closed, and several of its buildings were later destroyed after WWII, leaving today's protected-monument ruins.

🥚 Easter Egg: Czech poet Jaroslav Vrchlický — one of the towering names of 19th-century Czech literature — rented Villa Maria here as a summer retreat and reportedly wrote his poem "Legenda chuchelská" on-site. His stays later inspired novelist František Kožík to write the still-read novel "Za trochu lásky…" — meaning this defunct spa quietly kick-started a small chain of Czech literary history.`,

      cz: `Statečný dobrodruhu, vítej v Chuchelských lázních — kdysi módním lázeňském areálu z 18. století, postaveném kolem pramene, u kterého nikdo nikdy pořádně nedokázal, že by cokoliv vyléčil, což mu nezabránilo stát se na dobré dvě století jedním z oblíbených pražských výletních cílů.

Lázně vyrostly kolem vápníkem bohatého pramene vyvěrajícího z místních silurských a devonských skal, v první polovině 18. století ozdobeného kapličkou a později uzavřeného do jeskyňky poté, co byl poblíž umístěn reliéf Panny Marie. Profesor Jan Antonín Scrinci provedl v roce 1760 rozbor vody, který údajně potvrdil její léčivé účinky, a návštěvníci — přijíždějící koňským povozem ze Smíchova nebo dnes už zaniklou vlakovou zastávkou přímo u lázní — sem po celé 19. století proudili kvůli minerálce, jeskyňce i výletní atmosféře. Pozdně klasicistní přestavba z roku 1879 dala lázeňské budově její dnešní uhlazenější podobu.

Nebylo to tu ale úplně poklidné: 28. června 1881 se v horní restauraci hostince strhla rvačka mezi německými a českými studenty, které se dodnes místně říká "chuchelská bitka" — malá, ale výmluvná epizoda dobových národnostních napětí. Do roku 1900 se pověst léčivé vody zhroutila, lázně tiše zanikly a několik budov bylo po druhé světové válce zbořeno, takže dnes po nich zůstaly jen chráněné zříceniny.

🥚 Velikonoční vajíčko: Český básník Jaroslav Vrchlický — jedno z největších jmen devatenáctého století české literatury — si zde jako letní sídlo pronajímal vilu Marii a údajně tu napsal báseň "Legenda chuchelská". Jeho pobyty zde později inspirovaly spisovatele Františka Kožíka k napsání dodnes čteného románu "Za trochu lásky…" — takže tyto zaniklé lázně tiše odstartovaly malý řetězec české literární historie.`,

      zh: `勇敢的冒险家，欢迎来到胡赫莱温泉浴场——一座建于18世纪、一度颇为时髦的疗养胜地，围绕着一处从未有人真正证明能治愈任何疾病的泉水而建，但这丝毫不妨碍它在此后近两个世纪里，一直是布拉格人最爱的郊游目的地之一。

这座浴场围绕着一处从当地志留纪与泥盆纪岩层中涌出、富含钙质的泉水兴建，18世纪初先是修建了一座小礼拜堂加以点缀，后来又在附近安放了一尊圣母浮雕，围绕它建起了一座石窟。扬·安东宁·斯克林奇教授于1760年对水质进行了分析，据称证实了它的疗效；游客们——或乘马车从斯米霍夫而来，或搭乘一座如今早已消失、就设在浴场旁的火车站——在整个19世纪络绎不绝地前来，为的是这矿泉水、这石窟，以及那种郊游的氛围。1879年的一次晚期古典主义风格翻修，赋予了浴场建筑更为精致的最终样貌。

这里也并非始终平静：1881年6月28日，德意志裔与捷克裔的学生在旅馆楼上的餐厅里爆发了一场斗殴，当地人至今仍称之为"胡赫莱之战"（Chuchelská bitka）——这是那个时代民族主义紧张情绪的一个虽小却颇具代表性的爆发点。到1900年，这泉水的疗效声誉彻底崩塌，浴场悄然关闭，部分建筑更是在二战后被拆除，只留下如今这片受保护的遗迹。

🥚 彩蛋：捷克诗人雅罗斯拉夫·夫尔赫利茨基（Jaroslav Vrchlický）——19世纪捷克文学史上举足轻重的人物之一——曾在这里租下"玛丽亚别墅"作为夏季居所，据说就是在此地写下了诗作《胡赫莱传奇》（Legenda chuchelská）。他在此地的居住经历，后来又启发小说家弗朗蒂谢克·科日克（František Kožík）写出了至今仍被阅读的小说《为了一点点爱……》（Za trochu lásky…）——也就是说，这座早已消失的温泉浴场，悄悄开启了一小段捷克文学史的传承链条。`,
    },
  },
  {
    name: 'Malá Chuchle Mini-Zoo',
    slug: 'zookoutek-mala-chuchle',
    localizedNames: { cz: 'Zookoutek Malá Chuchle', zh: '小胡赫莱迷你动物园' },
    labels: ['nature', 'hidden-gem'],
    coordinates: { lat: 50.02283193084138, lng: 14.388204048024935 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Zookoutek_Mal%C3%A1_Chuchle',
    description: {
      en: `Brave adventurer, welcome to the Malá Chuchle Mini-Zoo — a free, year-round forest zoo tucked inside a nature reserve, built specifically to give injured and permanently disabled wild animals somewhere to retire instead of being euthanised.

Run by Prague's Environmental Education Centre as an outpost of the city's Wildlife Rescue Station, the zookoutek grew out of informal animal-keeping by a local forest ranger in the 1970s before being formally established in October 1999. It focuses entirely on species native to the Czech Republic — mouflon, fallow deer, wild boar, foxes, and lynx — housed in a mix of open multi-species enclosures viewed from raised walkways and smaller pens, deep inside the Chuchelský háj nature reserve.

Every animal here has a story: most arrived after an injury or a permanent disability made survival in the wild impossible, and the zoo functions less as an attraction and more as a long-term sanctuary that happens to be open to the public, free of charge, every day of the year.

🥚 Easter Egg: Because it's officially a branch of Prague's wildlife rescue operation rather than a conventional zoo, the animal roster here changes based on who needs a permanent home — meaning the exhibits are, in the most literal sense possible, a rotating cast of survivors.`,

      cz: `Statečný dobrodruhu, vítej v Zookoutku Malá Chuchle — bezplatné, celoročně otevřené lesní zoo ukryté v přírodní rezervaci, postavené konkrétně proto, aby zraněná a trvale hendikepovaná divoká zvířata měla kam jít místo utracení.

Zookoutek provozuje Středisko ekologické výchovy hlavního města Prahy jako pobočku městské Záchranné stanice pro volně žijící živočichy a vznikl z neformálního chovu místního lesníka v 70. letech, než byl v říjnu 1999 formálně založen. Zaměřuje se výhradně na druhy původní v Česku — muflony, daňky, divoká prasata, lišky a rysy —, chované v kombinaci otevřených výběhů pro více druhů, sledovaných z vyvýšených ochozů, a menších kotců, hluboko uvnitř přírodní rezervace Chuchelský háj.

Každé zvíře tu má svůj příběh: většina sem přišla po zranění nebo trvalém postižení, které jim znemožnilo přežít ve volné přírodě, a zookoutek tak funguje spíš jako dlouhodobé útočiště, které mimochodem vychází vstříc i veřejnosti — zdarma, každý den v roce.

🥚 Velikonoční vajíčko: Protože jde oficiálně o pobočku pražské záchranné stanice, a ne o klasickou zoo, obsazení zvířat se tu mění podle toho, kdo zrovna potřebuje trvalý domov — expozice je tak v tom nejdoslovnějším smyslu proměnlivou sestavou přeživších.`,

      zh: `勇敢的冒险家，欢迎来到小胡赫莱迷你动物园——一座免费开放、全年无休的森林动物园，藏身于一处自然保护区之中，其建立的初衷十分明确：为那些受伤或永久残疾的野生动物提供一个可以安度余生的地方，而不是被安乐死。

这座"动物角"（zookoutek）由布拉格市环境教育中心运营，是该市野生动物救助站的一处分支机构，其历史可以追溯到上世纪70年代当地一位护林员的非正式养护活动，直到1999年10月才正式成立。它专门收养捷克本土物种——盘羊、黇鹿、野猪、狐狸和猞猁——饲养在开放式的多物种混养区（可从高架步道俯瞰）与较小的圈舍中，整个园区深藏于胡赫莱森林（Chuchelský háj）自然保护区内部。

这里的每一只动物都有自己的故事：大多数是因为受伤或永久残疾、无法在野外生存才被送到这里的，因此与其说这是一处旅游景点，不如说它更像一处长期收容所，只是恰好常年免费向公众开放。

🥚 彩蛋：因为它在官方上属于布拉格野生动物救助站的一个分支，而非传统意义上的动物园，这里展出的动物会根据谁需要一个永久的家而不断变化——从最字面的意义上讲，这里的"展品"其实是一批不断轮换的幸存者。`,
    },
  },
  {
    name: 'Chapel of Our Lady of Sorrows (Zlíchov)',
    slug: 'kaple-panny-marie-bolestne-zlichov',
    localizedNames: { cz: 'Kaple Panny Marie Bolestné (Zlíchov)', zh: '兹利霍夫圣母悲苦小堂' },
    labels: ['church', 'historical', 'ruin'],
    coordinates: { lat: 50.03829080171545, lng: 14.403876121837033 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Kaple_Panny_Marie_Bolestn%C3%A9_(Zl%C3%ADchov)',
    description: {
      en: `Brave adventurer, welcome to the Chapel of Our Lady of Sorrows in Zlíchov — a former French army gunpowder store from a Prague siege that someone eventually decided would make a perfectly nice place to pray, which is either poetic repurposing or the 18th-century version of not overthinking a real-estate decision.

The building started life in 1742 as a gunpowder magazine, built by French troops during their siege of Prague and later used by quarry workers simply as material storage in the limestone quarries south of Zlíchov. In 1847 quarry owner Herget converted it into a chapel — accounts differ on whether he built it to honour his daughter Marie after a misfortune in the quarry, or whether Marie herself commissioned it to commemorate workers who died on the job.

After 1900, Benedictine monks from Prague's Emauzy Monastery redecorated the interior in the distinctive Beuronese style, and painter and mosaic artist Viktor Foerster added artwork including a Christ monogram and a Latin inscription addressing passing travellers, drawn from the Book of Lamentations. The chapel was reconsecrated in 1903, but has been quietly deteriorating since the 1950s, tucked away on Zbraslavská road between Zlíchov and Malá Chuchle in what was once the vanished settlement of Křenkov.

🥚 Easter Egg: A structure built to store explosives for an army siege ended up, a century later, decorated with Latin verses of mourning for quarry workers — meaning this small roadside chapel has spent its entire existence marking death in one form or another, first as military infrastructure, then as memorial.`,

      cz: `Statečný dobrodruhu, vítej v Kapli Panny Marie Bolestné na Zlíchově — bývalém francouzském vojenském skladu střelného prachu z obléhání Prahy, ze kterého se někdo nakonec rozhodl udělat docela hezké místo k modlitbě, což je buď poetické znovuvyužití, nebo osmnáctistoletá verze neřešení realitního rozhodnutí příliš do hloubky.

Budova začala svou existenci v roce 1742 jako prachárna, postavená francouzskými vojsky během obléhání Prahy a později využívaná lomaři jednoduše jako sklad materiálu ve vápencových lomech jižně od Zlíchova. V roce 1847 ji majitel lomů Herget přestavěl na kapli — podání se rozcházejí v tom, zda ji postavil na počest své dcery Marie po neštěstí, které ji potkalo v lomu, nebo zda si ji sama Marie nechala postavit jako památník dělníkům, kteří při práci zahynuli.

Po roce 1900 benediktinští mniši z pražských Emauz přestavěli interiér v osobitém beuronském stylu a malíř a mozaikář Viktor Foerster doplnil výzdobu včetně Kristova monogramu a latinského nápisu oslovujícího kolemjdoucí poutníky, převzatého z Knihy nářků. Kaple byla znovu vysvěcena v roce 1903, ale od 50. let 20. století tiše chátrá, schovaná při Zbraslavské silnici mezi Zlíchovem a Malou Chuchlí, na místě kdysi zaniklé osady Křenkov.

🥚 Velikonoční vajíčko: Stavba postavená k uskladnění výbušnin pro vojenské obléhání skončila o století později ozdobená latinskými verši oplakávajícími zesnulé lomové dělníky — tahle malá kaple u silnice tak celou svou existenci nějakým způsobem označuje smrt: nejprve jako vojenská infrastruktura, později jako památník.`,

      zh: `勇敢的冒险家，欢迎来到兹利霍夫的圣母悲苦小堂——这里曾是布拉格围城战期间法国军队的一座火药库，后来不知被谁看中，改造成了一处相当宜人的祈祷场所，这要么是一种充满诗意的空间再利用，要么只是18世纪版本的"不想太多、直接改造"。

这栋建筑始建于1742年，最初是法军在围攻布拉格期间修建的一座火药库，后来又被石灰岩采石场的工人们当作普通材料仓库使用，采石场就位于兹利霍夫以南。1847年，采石场主赫格特（Herget）将它改建为一座小教堂——关于原因，说法不一：一种说法称，他是为了纪念女儿玛丽在采石场遭遇不幸而建；另一种说法则称，是玛丽本人出资建造，用以纪念在此丧生的工人。

1900年后，来自布拉格埃马乌斯修道院的本笃会修士以独具特色的博伊龙风格（Beuronese）重新装饰了内部，画家兼镶嵌艺术家维克多·福斯特（Viktor Foerster）又添加了包括基督徽记在内的装饰，以及一段引自《耶利米哀歌》、向过路旅人发出的拉丁语铭文。小堂于1903年重新祝圣，但自上世纪50年代起便一直悄然荒废，静静藏身于兹布拉斯拉夫大道旁、兹利霍夫与小胡赫莱之间，如今早已消失的克伦科夫（Křenkov）聚落旧址之上。

🥚 彩蛋：一座最初为军队围城战修建、用来储存炸药的建筑，一个世纪后竟以哀悼采石场工人的拉丁语诗句作为装饰——这座路边的小教堂，其存在的整个历程，似乎从未真正摆脱过"死亡"这个主题：先是作为军事设施，后来又成了纪念场所。`,
    },
  },
  {
    name: 'Velká Chuchle Racecourse',
    slug: 'dostihove-zavodiste-velka-chuchle',
    localizedNames: { cz: 'Dostihové závodiště Velká Chuchle', zh: '大胡赫莱赛马场' },
    labels: ['historical', 'cultural'],
    coordinates: { lat: 50.00919215862017, lng: 14.389319772519908 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Dostihov%C3%A9_z%C3%A1vodi%C5%A1t%C4%9B_Velk%C3%A1_Chuchle',
    description: {
      en: `Brave adventurer, welcome to the Velká Chuchle Racecourse — a track that opened in 1906 barely a month after being completely underwater, hosted the first long-distance flight in Czech aviation history five years later, and has since survived a world war, two catastrophic floods, and one very memorable act of communist-era bureaucratic patience.

The racecourse held its first race on 28 September 1906, won by a mare named Vision under her own owner, veterinarian František Bartoschs — an opening act that, remarkably, followed a flood that had left the entire site submerged only weeks earlier. In 1911, engineer Jan Kašpar landed his Blériot XI monoplane here after completing the first long-distance flight in Czech history, from Pardubice to Prague — the same aviation milestone still celebrated in the neighbouring village of Velká Chuchle today. The first Czechoslovak Derby ran here on 22 May 1921, and by 1931 the race was prestigious enough to draw President Tomáš Garrigue Masaryk himself, along with celebrity spectators like actors Vlasta Burian and Adina Mandlová.

The war years were brutal: during the May 1945 Prague Uprising, an exploding munitions train set the stables ablaze, and trainer Karel Šmejda was shot dead by a German sniper while trying to feed the horses inside — three of them, including the popular stallion Cyklon, didn't survive. Racing didn't resume at all until spring 2003. The old Art Nouveau wooden grandstands, torn down in 1985, were replaced with a 4,000-seat concrete stand that opened in 1991 — just in time for catastrophic floods in 2002 and again in 2013 to submerge the entire track, forcing the Czech Derby to relocate to Most for that year.

🥚 Easter Egg: Jan Kašpar's historic 1911 landing here didn't just make the racecourse famous — it's the same flight commemorated by the "birth of Czech aviation" story attached to the whole Velká Chuchle neighbourhood, meaning this racetrack is both a sporting venue and, quite literally, ground zero for Czech powered flight.`,

      cz: `Statečný dobrodruhu, vítej na Dostihovém závodišti Velká Chuchle — dráze, která se otevřela v roce 1906 sotva měsíc poté, co byla celá pod vodou, o pět let později hostila první dálkový let v dějinách české aviatiky, a od té doby přežila světovou válku, dvě katastrofální povodně a jeden mimořádně trpělivý kus komunistické byrokracie.

Závodiště odstartovalo svůj první dostih 28. září 1906, který vyhrála klisna Vision pod vlastním majitelem, veterinářem Františkem Bartoschem — otevírací číslo, které pozoruhodně následovalo hned po povodni, jež ještě pár týdnů předtím nechala celý areál pod vodou. V roce 1911 zde inženýr Jan Kašpar přistál se svým letounem Blériot XI po dokončení prvního dálkového letu v české historii, z Pardubic do Prahy — stejný letecký milník, který se dodnes slaví i v sousední Velké Chuchli. První Československé derby se tu běželo 22. května 1921 a do roku 1931 už byl závod natolik prestižní, že přilákal samotného prezidenta Tomáše Garrigua Masaryka spolu se slavnými diváky jako herci Vlasta Burian a Adina Mandlová.

Válečná léta byla krutá: během Pražského povstání v květnu 1945 zapálil výbuch muničního vlaku stáje a trenér Karel Šmejda byl při pokusu nakrmit koně uvnitř zastřelen německým odstřelovačem — tři koně, včetně oblíbeného hřebce Cyklona, přežití nepřežili. Dostihy se pak vůbec neobnovily až do jara 2003. Staré secesní dřevěné tribuny, zbourané v roce 1985, nahradila železobetonová tribuna pro 4000 diváků, otevřená v roce 1991 — právě včas na to, aby celé závodiště zaplavily katastrofální povodně v roce 2002 a znovu v roce 2013, kvůli čemuž se muselo České derby toho roku přesunout do Mostu.

🥚 Velikonoční vajíčko: Historické přistání Jana Kašpara zde v roce 1911 neproslavilo jen samotné závodiště — je to tentýž let, který se slaví i jako "zrod české aviatiky" spojený s celou čtvrtí Velká Chuchle, takže tahle dostihová dráha je zároveň sportovištěm i doslovným místem nula českého motorového létání.`,

      zh: `勇敢的冒险家，欢迎来到大胡赫莱赛马场——这条赛道在1906年开幕时，距离整个场地被洪水完全淹没还不到一个月；五年后，它又见证了捷克航空史上第一次长途飞行的降落；此后，它先后挺过了一场世界大战、两次灾难性的洪水，以及一段极其考验耐心的共产主义时代官僚故事。

赛马场于1906年9月28日举行了第一场比赛，获胜的是一匹名叫"愿景"（Vision）的母马，骑师正是它的主人——兽医弗朗蒂谢克·巴尔托什（František Bartoschs）——而这场开幕赛之前不过几周，整个场地还完全泡在洪水之中，堪称戏剧性的开局。1911年，工程师扬·卡斯帕尔（Jan Kašpar）驾驶他的布莱里奥XI型单翼机在此降落，完成了捷克历史上第一次长途飞行——从帕尔杜比采飞往布拉格，这一航空里程碑，至今仍在毗邻的大胡赫莱社区被人们纪念。第一届捷克斯洛伐克德比赛马于1921年5月22日在此举行，到1931年，这项赛事的声望已经高到足以吸引总统托马斯·加里格·马萨里克本人到场观看，同场观赛的还有演员弗拉斯塔·布里安和阿迪娜·曼德洛娃等社会名流。

战争年代对这里格外残酷：1945年5月布拉格起义期间，一列军火列车爆炸引燃了马厩，训练师卡雷尔·什梅伊达（Karel Šmejda）在试图给厩内的马匹喂食时，被一名德军狙击手击毙——包括人气种马"飓风"（Cyklon）在内的三匹马未能幸存。此后，赛马活动一直停摆，直到2003年春天才得以恢复。1985年拆除的老式新艺术风格木质看台，被一座可容纳4000名观众的钢筋混凝土看台取代，于1991年启用——却刚好赶上2002年与2013年两场毁灭性的洪水将整个赛道彻底淹没，导致那一年的捷克德比赛马不得不改在莫斯特（Most）举行。

🥚 彩蛋：扬·卡斯帕尔1911年在此地的历史性降落，不仅让这座赛马场声名大噪——这正是与整个大胡赫莱地区"捷克航空诞生地"这一说法紧密相连的同一次飞行，也就是说，这座赛马场既是体育场馆，同时也是名副其实的捷克动力飞行的"零点起飞地"。`,
    },
  },
  {
    name: 'National Monument to the Heroes of the Heydrich Terror',
    slug: 'narodni-pamatnik-hrdinu-heydrichiady',
    localizedNames: { cz: 'Národní památník hrdinů heydrichiády', zh: '海德里希暴政英雄纪念馆' },
    labels: ['museum', 'historical', 'cultural'],
    coordinates: { lat: 50.07592300023791, lng: 14.416677836699467 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the National Monument to the Heroes of the Heydrich Terror — a museum built inside the very crypt where seven Czechoslovak paratroopers made their last stand, founded not by the state but by one determined married couple who simply decided somebody needed to.

The monument's exhibition (redesigned for the siege's 80th anniversary in 2022) walks visitors through the full arc of the story: the Munich Agreement, the creation of the Nazi Protectorate, Reinhard Heydrich's brutal rise to power, and the planning and execution of Operation Anthropoid — the assassination attempt that sent the paratroopers into hiding here in the first place. It was founded privately in 1995 by Jaroslav and Eva Šuvarský, long before the state took any official interest, and only passed into the care of the Military History Institute in 2017.

Two threads the exhibition doesn't let you forget: the paratroopers were betrayed to the Gestapo by one of their own, fellow paratrooper Karel Čurda, for a reward; and the Orthodox clergy who sheltered them — including Bishop Gorazd, who publicly took responsibility to protect his parishioners — were executed for it months later. Bishop Gorazd was later canonised a saint by the Orthodox Church.

🥚 Easter Egg: Admission and every guided tour here are completely free, led by lecturers from the Military History Institute — a rare case in Prague's museum landscape where the most harrowing story in the city costs nothing at all to hear properly told.`,

      cz: `Statečný dobrodruhu, vítej v Národním památníku hrdinů heydrichiády — muzeu zřízeném přímo v kryptě, kde sedm československých parašutistů svedlo svůj poslední boj, a založeném nikoliv státem, ale jedním odhodlaným manželským párem, který se prostě rozhodl, že to někdo udělat musí.

Expozice památníku (přepracovaná k 80. výročí bojů v roce 2022) provede návštěvníky celým obloukem příběhu: Mnichovskou dohodou, vznikem nacistického protektorátu, brutálním vzestupem Reinharda Heydricha k moci i přípravou a provedením atentátu v rámci operace Anthropoid — tedy útoku, kvůli kterému se parašutisté vůbec museli ukrývat právě zde. Památník soukromě založili v roce 1995 manželé Jaroslav a Eva Šuvarští, dávno předtím, než o něj projevil oficiální zájem stát, a do péče Vojenského historického ústavu přešel až v roce 2017.

Dvě linky příběhu expozice nedovolí zapomenout: parašutisty za odměnu udal gestapu jeden z jejich vlastních, spoluparašutista Karel Čurda; a pravoslavní duchovní, kteří je ukrývali — včetně biskupa Gorazda, jenž na sebe veřejně vzal odpovědnost, aby ochránil své farníky —, byli o pár měsíců později za to popraveni. Biskup Gorazd byl později pravoslavnou církví svatořečen.

🥚 Velikonoční vajíčko: Vstup i každá prohlídka s průvodcem jsou tu naprosto zdarma, vedené lektory Vojenského historického ústavu — vzácný případ v pražské muzejní krajině, kdy si vyslechnutí toho nejotřesnějšího příběhu města nevyžádá jedinou korunu.`,

      zh: `勇敢的冒险家，欢迎来到"海德里希暴政英雄纪念馆"（Národní památník hrdinů heydrichiády）——这座博物馆就建在七名捷克斯洛伐克伞兵进行最后抵抗的那间地下墓室里，而它的创立者并非国家，而是一对下定决心"总得有人来做这件事"的夫妇。

纪念馆的常设展览（于2022年为纪念这场战斗80周年而重新设计）带领参观者走过整个故事的来龙去脉：慕尼黑协定、纳粹保护国的建立、莱因哈德·海德里希残暴的崛起之路，以及"类人猿行动"（Operation Anthropoid，即刺杀海德里希的行动）的策划与执行——正是这次刺杀行动，让这些伞兵不得不藏身于此。纪念馆由亚罗斯拉夫与埃娃·舒瓦尔斯基（Jaroslav a Eva Šuvarský）夫妇于1995年私人出资创立，远远早于国家对此表现出官方兴趣，直到2017年才移交给捷克军事历史研究所管理。

展览中有两条线索会让你无法忘怀：伞兵们是被自己的战友——同为伞兵的卡雷尔·丘尔达（Karel Čurda）——为了赏金向盖世太保出卖的；而收留、庇护他们的东正教神职人员——包括公开承担全部责任、以保护自己教区信众的戈拉兹德主教（Bishop Gorazd）——几个月后也因此被处决。戈拉兹德主教后来被东正教会封为圣人。

🥚 彩蛋：这里的门票和每一场导览完全免费，由捷克军事历史研究所的讲解员亲自带队——在布拉格的博物馆版图中，能够免费、完整地听到这座城市最惊心动魄的故事，实属罕见。`,
    },
  },
  {
    name: 'Villa Lanna',
    slug: 'villa-lanna',
    localizedNames: { cz: 'Lannova vila', zh: '兰纳别墅' },
    labels: ['villa', 'architecture', 'historical'],
    coordinates: { lat: 50.10235971300538, lng: 14.407197188379262 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Lannova_vila_(Bubene%C4%8D)',
    description: {
      en: `Brave adventurer, welcome to Villa Lanna — a Neo-Renaissance summer residence so architecturally influential it's considered the first "properly" Neo-Renaissance building in the whole of Bohemia, built by an industrialist mostly so he'd have somewhere nice to keep his art collection.

Built between 1868 and 1872 by architect Vojtěch Ignác Ullmann — with his son-in-law Antonín Barvitius and painter Viktor Barvitius pitching in — for entrepreneur and art collector Vojtěch Lanna the Younger, the villa modelled itself on the Italian "villa suburbana" tradition popularised by Renaissance architect Palladio: a single-storey house with a tower, wrapped in a columned portico and set in landscaped grounds. Inside, mythological murals from Greek and Roman legend cover the reception rooms, mixed with allegorical scenes celebrating Lanna's own business and social achievements.

The villa outlived Lanna's fortune in more ways than one — his son emigrated to Germany and sold the property in 1913, and Lanna's once-celebrated art collection was auctioned off piece by piece in Berlin in 1909–1910. The building passed through several private owners before being nationalised in 1948, and has been run by the Academy of Sciences since 1957 as a venue for conferences, ceremonies, and formal events.

🥚 Easter Egg: When the Academy's former president Rudolf Zahradník turned 90, his birthday celebration here was attended by none other than German Chancellor Angela Merkel — a fairly remarkable guest list for a suburban Prague villa most tourists have never heard of.`,

      cz: `Statečný dobrodruhu, vítej v Lannově vile — novorenesanční letní rezidenci natolik architektonicky vlivné, že se považuje za první opravdu čistě novorenesanční stavbu v celých Čechách, a to jen proto, aby ji jeden podnikatel měl kam uložit svou uměleckou sbírku.

Vilu postavil v letech 1868 až 1872 architekt Vojtěch Ignác Ullmann — za přispění svého zetě Antonína Barvitia a malíře Viktora Barvitia — pro podnikatele a sběratele umění Vojtěcha Lannu mladšího. Stavba se inspirovala italskou tradicí "villa suburbana", kterou proslavil renesanční architekt Palladio: jednopatrový dům s věží, obklopený sloupovým portikem a upravenou zahradou. Uvnitř zdobí reprezentační salony mytologické malby z řecké a římské báje, doplněné alegorickými výjevy oslavujícími Lannovy vlastní podnikatelské a společenské úspěchy.

Vila přežila Lannovo jmění hned v několika ohledech — jeho syn emigroval do Německa a nemovitost v roce 1913 prodal, zatímco kdysi proslulá Lannova umělecká sbírka byla po částech vydražena v Berlíně v letech 1909–1910. Budova pak prošla několika soukromými majiteli, než byla v roce 1948 znárodněna, a od roku 1957 ji spravuje Akademie věd jako místo pro konference, slavnostní akty a společenské akce.

🥚 Velikonoční vajíčko: Když bývalý předseda Akademie věd Rudolf Zahradník slavil devadesátiny, jeho oslavy se tu zúčastnila ani nikdo menší než německá kancléřka Angela Merkelová — poměrně pozoruhodný seznam hostů na pražskou vilu na okraji města, o které většina turistů v životě neslyšela.`,

      zh: `勇敢的冒险家，欢迎来到兰纳别墅——一座新文艺复兴风格的避暑别墅，其建筑影响力之大，被誉为整个波希米亚第一座"真正意义上"的新文艺复兴建筑，而它最初的建造目的，说穿了不过是让一位实业家有个地方安放自己的艺术收藏。

这座别墅由建筑师沃伊捷赫·伊格纳茨·乌尔曼（Vojtěch Ignác Ullmann）于1868年至1872年间建造完成——他的女婿安东宁·巴尔维蒂乌斯（Antonín Barvitius）和画家维克多·巴尔维蒂乌斯（Viktor Barvitius）也参与其中——委托人是实业家兼艺术收藏家小沃伊捷赫·兰纳（Vojtěch Lanna）。别墅仿照文艺复兴建筑师帕拉第奥（Palladio）所推广的意大利"郊区别墅"（villa suburbana）传统而建：一栋带塔楼的单层住宅，四周环绕着列柱门廊与精心设计的庭院。室内的接待厅堂中，绘满了取材自古希腊罗马神话的壁画，还穿插着歌颂兰纳本人商业与社会成就的寓言场景。

这座别墅在多个方面都"活得比兰纳的家产更久"——他的儿子移居德国，于1913年将房产出售；而兰纳曾一度声名远播的艺术收藏品，也在1909至1910年间于柏林被分批拍卖一空。这栋建筑此后几经私人易手，直到1948年被收归国有，自1957年起由捷克科学院管理，用作会议、庆典与正式活动的场地。

🥚 彩蛋：捷克科学院前主席鲁道夫·扎赫拉德尼克（Rudolf Zahradník）九十大寿之时，庆生宴会就在这里举行，到场嘉宾中赫然包括德国总理安格拉·默克尔——对于这座大多数游客闻所未闻、位于布拉格郊区的别墅来说，这份宾客名单着实令人称奇。`,
    },
  },
  {
    name: 'Škroup Square',
    slug: 'skroupovo-namesti',
    localizedNames: { cz: 'Škroupovo náměstí', zh: '什克鲁普广场' },
    labels: ['square', 'historical', 'communism'],
    coordinates: { lat: 50.08046956861441, lng: 14.448660286170732 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/%C5%A0kroupovo_n%C3%A1m%C4%9Bst%C3%AD',
    description: {
      en: `Brave adventurer, welcome to Škroupovo náměstí — a perfectly circular square in Žižkov named after the composer of the Czech national anthem, which is a nice honour undercut slightly by the fact that the square itself has changed its own name four times.

Laid out in 1910 as a full circle roughly 80 metres across, with four streets radiating outward and four-storey apartment buildings ringing the perimeter, the square started life as Smetanovo náměstí, honouring composer Bedřich Smetana. The Nazi Protectorate renamed it Sukovo náměstí after violinist Josef Suk in 1940; liberation restored the Smetana name; and only after 1947 did it finally settle on its current name, honouring František Škroup, who wrote the music for "Kde domov můj" — the same anthem tune first performed in the 1834 play "Fidlovačka."

The square's quiet postwar decades hid one genuinely pivotal moment: on 10 December 1988, it hosted the first officially permitted opposition demonstration of the entire communist "normalisation" era, timed to coincide with French President François Mitterrand's state visit. Around 3,000 people gathered to hear Václav Havel and others demand the release of political prisoners, opening with the national anthem — the very same anthem the square's own namesake had composed.

🥚 Easter Egg: The regime approved this demonstration in Žižkov only after Prague's city centre authorities had already rejected holding it on Wenceslas Square — meaning one of the opening acts of the Velvet Revolution's long prelude happened here largely because officials thought a quiet residential circle would attract less attention than the country's most famous public space. It didn't work out that way.`,

      cz: `Statečný dobrodruhu, vítej na Škroupově náměstí — dokonale kruhovém náměstí na Žižkově pojmenovaném po skladateli české státní hymny, což je pěkná pocta poněkud nabouraná faktem, že samo náměstí si vlastní jméno změnilo hned čtyřikrát.

Náměstí bylo vytyčeno v roce 1910 jako téměř dokonalý kruh o průměru zhruba 80 metrů, se čtyřmi ulicemi vybíhajícími do stran a čtyřpatrovými činžovními domy po obvodu, a zpočátku se jmenovalo Smetanovo náměstí, na počest skladatele Bedřicha Smetany. Nacistický protektorát je v roce 1940 přejmenoval na Sukovo náměstí po houslistovi Josefu Sukovi; po osvobození se vrátil Smetanův název, a teprve po roce 1947 dostalo náměstí svůj dnešní název na počest Františka Škroupa, autora hudby k písni "Kde domov můj" — téže hymnické melodie, poprvé uvedené ve hře "Fidlovačka" z roku 1834.

Klidná poválečná desetiletí náměstí skrývala jednu opravdu zásadní chvíli: 10. prosince 1988 se tu konala první úředně povolená demonstrace opozičních skupin za celou dobu normalizace, načasovaná na státní návštěvu francouzského prezidenta Françoise Mitterranda. Kolem 3000 lidí se sešlo, aby vyslechlo Václava Havla a další, jak žádají propuštění politických vězňů — a shromáždění zahájila právě státní hymna, kterou složil muž, po němž je náměstí pojmenované.

🥚 Velikonoční vajíčko: Režim povolil tuto demonstraci na Žižkově až poté, co pražské centrum už předtím zamítlo konání akce na Václavském náměstí — jedna z otevíracích scén dlouhé předehry sametové revoluce se tu tak z velké části odehrála proto, že úředníci si mysleli, že tiché obytné kolo přiláká méně pozornosti než nejslavnější veřejné prostranství země. Nevyšlo to.`,

      zh: `勇敢的冒险家，欢迎来到什克鲁普广场——日什科夫（Žižkov）一座近乎完美的圆形广场，得名于捷克国歌曲作者，这份殊荣却多少被一个事实打了折扣：这座广场自己的名字，前前后后竟改过四次。

这座广场于1910年规划建成，呈直径约80米的近乎完整的圆形，四条街道向外辐射，四层高的公寓楼环绕四周；它最初的名字是"斯美塔那广场"，用以纪念作曲家贝德里赫·斯美塔那。1940年，纳粹保护国政府将其改名为"苏克广场"，以纪念小提琴家约瑟夫·苏克；解放后又恢复了"斯美塔那"这个名字，直到1947年之后，才最终定名为如今的"什克鲁普广场"，纪念弗朗蒂谢克·什克鲁普——他正是《我的家在哪里》（Kde domov můj）这首曲调的作曲者，而这段旋律最早正是在1834年的话剧《菲德洛瓦奇卡》中首次亮相，后来成为了捷克国歌。

这座广场战后几十年的宁静表象之下，藏着一个真正具有历史转折意义的时刻：1988年12月10日，这里举行了整个共产主义"正常化"时期第一场获得官方批准的反对派示威活动，时间刻意选在法国总统弗朗索瓦·密特朗对捷克斯洛伐克进行国事访问期间。约三千人聚集于此，聆听瓦茨拉夫·哈维尔等人要求释放政治犯——集会正是以国歌开场的，而这首国歌的曲作者，正是这座广场的命名者本人。

🥚 彩蛋：当局之所以批准这场示威活动在日什科夫这个地方举行，是因为布拉格市中心当局此前已经拒绝了在瓦茨拉夫广场举办同类活动的申请——天鹅绒革命漫长序幕中的这一幕开场戏，之所以会发生在这里，很大程度上是因为官员们以为，一座安静的住宅区圆形广场，会比这个国家最著名的公共广场吸引更少的关注。事实证明，他们想错了。`,
    },
  },
  {
    name: "Šaloun's Studio",
    slug: 'salounuv-atelier',
    localizedNames: { cz: 'Šalounův ateliér', zh: '沙洛乌恩工作室' },
    labels: ['cultural', 'historical', 'architecture'],
    coordinates: { lat: 50.0726280500188, lng: 14.449506460985544 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/%C5%A0alounova_vila',
    description: {
      en: `Brave adventurer, welcome to Šaloun's Studio — the purpose-built workshop a sculptor commissioned specifically because his old studio was too small for a national monument, which is a delightfully practical origin story for an Art Nouveau building.

After winning the competition to design the Jan Hus Memorial for Old Town Square — one of Prague's most recognisable monuments — sculptor Ladislav Šaloun realised his existing studio on Wenceslas Square simply couldn't accommodate a piece of that scale. He built this Art Nouveau studio with Symbolist touches to his own design between 1908 and 1910, and it was officially approved for use in February 1911.

The studio quickly became a magnet for Czech cultural royalty: painter Alfons Mucha, opera singer Ema Destinnová, violinist Jan Kubelík, writer Alois Jirásek, poet Jaroslav Vrchlický, and sculptor František Bílek all passed through its doors. Šaloun's descendants eventually sold the studio space to the state in the 1980s, separating it from the residential portion of the villa; the Academy of Fine Arts bought it outright in 2001, restored it, and reopened it in 2007 as a teaching space for visiting international instructors.

🥚 Easter Egg: According to fellow artist Josef Váchal's memoirs, the studio's basement once hosted "occultist" gatherings that bordered on genuine magical ceremonies — meaning the same building where Prague's most celebrated Hus monument took shape may also have moonlighted, quietly, as a séance parlour.`,

      cz: `Statečný dobrodruhu, vítej v Šalounově ateliéru — účelově postavené dílně, kterou si sochař nechal postavit jen proto, že jeho starý ateliér byl na národní pomník příliš malý, což je nečekaně praktický vznik pro secesní budovu.

Poté, co sochař Ladislav Šaloun vyhrál soutěž na pomník mistra Jana Husa pro Staroměstské náměstí — jeden z nejrozpoznatelnějších pražských pomníků vůbec —, zjistil, že jeho stávající ateliér na Václavském náměstí prostě nepojme dílo takového rozměru. Podle vlastního návrhu si mezi lety 1908 a 1910 postavil tento secesní ateliér se symbolistními prvky, který byl oficiálně zkolaudován v únoru 1911.

Ateliér se rychle stal magnetem pro smetánku české kultury: procházeli jím malíř Alfons Mucha, pěvkyně Ema Destinnová, houslista Jan Kubelík, spisovatel Alois Jirásek, básník Jaroslav Vrchlický i sochař František Bílek. Šalounovi potomci nakonec ateliérové prostory v 80. letech prodali státu, čímž se fyzicky oddělily od obytné části vily; Akademie výtvarných umění je v roce 2001 odkoupila úplně, nechala zrekonstruovat a v roce 2007 znovu otevřela jako výukový prostor pro zahraniční hostující pedagogy.

🥚 Velikonoční vajíčko: Podle vzpomínek výtvarníka Josefa Váchala se ve sklepě ateliéru kdysi konala "okultistická" setkání hraničící se skutečnými magickými obřady — takže tatáž budova, kde vznikal nejslavnější pražský pomník mistru Janu Husovi, si možná tiše přivydělávala i jako spiritistický salon.`,

      zh: `勇敢的冒险家，欢迎来到沙洛乌恩工作室——一座雕塑家专门委托建造的工作坊，理由简单直接：他原来的工作室装不下一座国家级纪念碑，这为一栋新艺术风格建筑提供了一个格外实在的诞生故事。

雕塑家拉迪斯拉夫·沙洛乌恩（Ladislav Šaloun）赢得了为老城广场设计"扬·胡斯纪念碑"——布拉格最具辨识度的纪念碑之一——的竞赛之后，意识到自己在瓦茨拉夫广场的旧工作室根本容不下这样一件大体量的作品。于是，他按照自己的设计，于1908年至1910年间建造了这座带有象征主义元素的新艺术风格工作室，并于1911年2月正式获批投入使用。

这间工作室很快成为了捷克文化名流的聚集地：画家阿尔丰斯·穆夏（Alfons Mucha）、歌剧演唱家艾玛·德斯汀诺娃（Ema Destinnová）、小提琴家扬·库贝利克（Jan Kubelík）、作家阿洛伊斯·伊拉塞克（Alois Jirásek）、诗人雅罗斯拉夫·夫尔赫利茨基（Jaroslav Vrchlický），以及雕塑家弗朗蒂谢克·比莱克（František Bílek）都曾在此出入。沙洛乌恩的后代最终在上世纪80年代将工作室部分出售给了国家，使其与别墅的居住部分在物理上分离；布拉格美术学院于2001年将其整体买下，修复后于2007年重新开放，作为接待外国客座教师的教学空间。

🥚 彩蛋：据艺术家约瑟夫·瓦哈尔（Josef Váchal）的回忆录记载，这间工作室的地下室曾举行过"通灵"聚会，其形式近乎真正的降神仪式——也就是说，孕育出布拉格最著名的胡斯纪念碑的这栋建筑，或许也曾悄悄兼职当过一间灵媒沙龙。`,
    },
  },
  {
    name: 'Singing Fountain',
    slug: 'zpivajici-fontana',
    localizedNames: { cz: 'Zpívající fontána', zh: '会唱歌的喷泉' },
    labels: ['waterbody', 'historical', 'monument'],
    coordinates: { lat: 50.09362676711793, lng: 14.40483010882407 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Zp%C3%ADvaj%C3%ADc%C3%AD_font%C3%A1na_(Praha)',
    description: {
      en: `Brave adventurer, welcome to the Singing Fountain in Prague Castle's Royal Garden — a Renaissance bronze basin commissioned by an emperor in 1562 that took twelve years, several material shortages, and at least one dead patron to finally get water flowing.

Emperor Ferdinand I ordered the fountain in 1562 from Italian designer Francesco Terzi, with master founder Tomáš Jaroš of Brno overseeing the actual bronze casting — a five-tonne, two-tiered structure of hammered bronze figures topped, somewhat randomly, with a bagpiper. Ferdinand died in 1564 without ever seeing it finished; the fountain itself wasn't cast and installed until 1568, and water wasn't actually connected to it until 1574 — a full twelve years after it was first commissioned.

The "singing" comes from acoustics rather than magic: water falling onto the bronze disk resonates at roughly the musical note A, and if you crouch down and put your ear beneath the basin, the sound is often described as echoing like the distant ringing of every church bell in Prague at once. A 17th-century French visitor compared the sound to actual bagpipes, which feels appropriate given who's standing on top.

🥚 Easter Egg: The very first tulips grown in Central Europe were reportedly planted right next to this fountain in the 1560s — meaning this small patch of the Royal Garden quietly kicked off the flower that would later spark an entire Dutch financial mania a century later, an ocean and several economic bubbles away.`,

      cz: `Statečný dobrodruhu, vítej u Zpívající fontány v Královské zahradě Pražského hradu — renesanční bronzové kašny, kterou si v roce 1562 objednal císař a jejíž dokončení si vyžádalo dvanáct let, několik nedostatků materiálu a přinejmenším jednoho mrtvého objednavatele, než z ní konečně vytryskla voda.

Císař Ferdinand I. fontánu objednal v roce 1562 u italského návrháře Francesca Terziho, přičemž samotné odlévání bronzu dohlížel mistr zvonař Tomáš Jaroš z Brna — pět tun těžkou dvoupatrovou konstrukci z tepaných bronzových postav, korunovanou poněkud nečekaně dudákem. Ferdinand zemřel v roce 1564, aniž by fontánu spatřil dokončenou; samotná fontána byla odlita a instalována až v roce 1568, a voda k ní byla přivedena teprve v roce 1574 — celých dvanáct let po prvním zadání zakázky.

"Zpívání" má na svědomí akustika, ne kouzlo: voda dopadající na bronzový disk rezonuje přibližně na tónu A, a pokud se skloníte a přiložíte ucho pod misku, zvuk často připomíná vzdálené zvonění všech pražských kostelních zvonů najednou. Francouzský návštěvník ze 17. století přirovnal ten zvuk přímo k dudám, což se docela hodí, vezmeme-li v úvahu, kdo stojí na vrcholu.

🥚 Velikonoční vajíčko: Úplně první tulipány pěstované ve střední Evropě byly údajně vysazeny přímo vedle této fontány v 60. letech 16. století — takže tenhle kousek Královské zahrady tiše odstartoval květinu, která o století později a o oceán dál rozpoutala celou jednu nizozemskou finanční horečku a několik ekonomických bublin.`,

      zh: `勇敢的冒险家，欢迎来到布拉格城堡皇家花园里的"会唱歌的喷泉"——一座文艺复兴风格的青铜喷泉，由一位皇帝于1562年下令建造，却花了整整十二年、经历了多次材料短缺，甚至等到委托人本人去世，水才终于喷涌而出。

皇帝斐迪南一世于1562年向意大利设计师弗朗切斯科·特尔齐（Francesco Terzi）下达了建造喷泉的命令，青铜浇铸工作则由来自布尔诺的铸造大师托马什·雅罗什（Tomáš Jaroš）主持——这是一座重达五吨、分为上下两层、由锤揲青铜雕像构成的结构，顶端不知为何安放着一位吹风笛人的雕像。斐迪南一世于1564年去世，未能亲眼见证喷泉建成；喷泉本身直到1568年才完成浇铸并安装到位，而通水更是要等到1574年——距离最初下令建造，已经整整过去了十二年。

它"会唱歌"的秘密其实在于声学原理，而非魔法：水滴落在青铜圆盘上产生的共鸣音高大致落在音符"A"上，如果你蹲下身子，把耳朵贴近铜盆下方，听到的声音常被形容为仿佛布拉格城中所有教堂的钟声在远处一同回响。一位17世纪造访此地的法国旅人，甚至将这声音比作风笛的声响——考虑到喷泉顶端站着的正是一位风笛手，这个比喻倒也十分贴切。

🥚 彩蛋：据说，中欧地区最早种植的郁金香，就栽种在这座喷泉的旁边，时间大约是16世纪60年代——也就是说，皇家花园的这一小片角落，悄悄地"孕育"出了后来那朵花——一个世纪后，在大洋彼岸的荷兰，正是这种花掀起了一场轰动一时的金融狂潮，以及此后一连串的经济泡沫。`,
    },
  },
  {
    name: 'Tuscan Palace',
    slug: 'toskansky-palac',
    localizedNames: { cz: 'Toskánský palác', zh: '托斯卡纳宫' },
    labels: ['palace', 'historical', 'architecture'],
    coordinates: { lat: 50.0892566180175, lng: 14.395323478969289 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Tosk%C3%A1nsk%C3%BD_pal%C3%A1c',
    description: {
      en: `Brave adventurer, welcome to the Tuscan Palace — a Baroque mansion on Hradčany Square named after an Italian grand duchess who inherited it, built by a Bohemian count who never got to finish naming rights over his own house.

Count Michael Osvald of Thun-Hohenstein began construction before 1690, on a site that had previously belonged to the Lobkowicz family, hiring French architect Jean-Baptiste Mathey with Italian builder Giacomo Antonio Canevalle handling execution. The building wasn't actually completed until 1718 — by which point ownership had already passed to Anna Maria Franziska, Grand Duchess of Tuscany, who gave the palace the name that stuck. Archangel Michael watches from one corner of the roofline, courtesy of sculptor Ottavio Mosto, while Jan Brokoff's allegorical figures of the Seven Liberal Arts line the attic.

Ownership continued to drift through European nobility — Bavarian dukes, Habsburg archdukes, two actual emperors — before the newly independent Czechoslovak state took possession in 1918 and installed the Ministry of Foreign Affairs, which still occupies the building today. A 1990s reconstruction uncovered 17th-century wall frescoes hidden for centuries beneath later layers.

🥚 Easter Egg: Despite housing one of the most consequential government ministries in the country, only two ground-floor rooms in the western courtyard wing are ever opened to the public, and only occasionally, for exhibitions — meaning most of Czech foreign policy happens behind walls that the average visitor will never actually see the inside of.`,

      cz: `Statečný dobrodruhu, vítej v Toskánském paláci — barokním sídle na Hradčanském náměstí, pojmenovaném po italské velkovévodkyni, která ho zdědila, a postaveném českým hrabětem, který se svých vlastních vlastnických práv na jméno domu ani nedočkal.

Hrabě Michael Osvald z Thunu a Hohensteinu začal se stavbou před rokem 1690 na pozemku, který dříve patřil Lobkovicům, a najal francouzského architekta Jeana Baptistu Matheye, přičemž provedení stavby měl na starosti italský stavitel Giacomo Antonio Canevalle. Budova byla dokončena až v roce 1718 — v té době už vlastnictví přešlo na Annu Marii Františku, velkovévodkyni Toskánskou, po níž palác dostal jméno, které mu zůstalo dodnes. Z jednoho rohu střechy shlíží archanděl Michael od sochaře Ottavia Mosta, zatímco atiku lemují alegorické postavy Sedmi svobodných umění od Jana Brokoffa.

Vlastnictví dál putovalo evropskou šlechtou — bavorští vévodové, habsburští arcivévodové, dokonce dva skuteční císaři —, než jej v roce 1918 převzal nově vzniklý československý stát a umístil sem ministerstvo zahraničních věcí, které v budově sídlí dodnes. Rekonstrukce v 90. letech odkryla sedmnáctistoleté nástěnné fresky, po staletí skryté pod pozdějšími vrstvami.

🥚 Velikonoční vajíčko: Přestože v budově sídlí jedno z nejvlivnějších ministerstev v zemi, veřejnosti se příležitostně otevírají jen dvě přízemní místnosti v západním křídle dvora, a to jen u příležitosti výstav — takže většina české zahraniční politiky se odehrává za zdmi, jejichž vnitřek běžný návštěvník nikdy neuvidí.`,

      zh: `勇敢的冒险家，欢迎来到托斯卡纳宫——赫拉德恰尼广场（Hradčanské náměstí）上的一座巴洛克宅邸，得名于继承它的一位意大利大公夫人，而建造它的那位波希米亚伯爵，却始终没能等到给自己房子命名的那一天。

图恩-霍恩施泰因伯爵米哈埃尔·奥斯瓦尔德（Michael Osvald z Thun-Hohensteinu）在1690年之前便开始在这片原属洛布科维茨家族的土地上动工兴建，聘请法国建筑师让-巴蒂斯特·马泰（Jean-Baptiste Mathey）主持设计，工程实际执行则由意大利建筑师贾科莫·安东尼奥·卡内瓦莱（Giacomo Antonio Canevalle）负责。这座建筑直到1718年才最终完工——彼时产权已经转到了托斯卡纳大公夫人安娜·玛丽亚·弗朗西斯卡（Anna Marie Františka）手中，正是她赋予了这座宫殿如今沿用至今的名字。屋顶一角矗立着雕塑家奥塔维奥·莫斯托（Ottavio Mosto）创作的大天使米迦勒雕像，而阁楼层则排列着扬·布罗科夫（Jan Brokoff）创作的"七艺"寓言雕像。

此后，这座宫殿的产权几经辗转，先后落入巴伐利亚公爵、哈布斯堡大公，乃至两位真正的皇帝手中，直到1918年才被新独立的捷克斯洛伐克国家接管，并将外交部设于此处——外交部至今仍在这栋建筑中办公。上世纪90年代的一次翻修，还意外发现了隐藏在后期覆盖层之下、历经数百年的17世纪壁画。

🥚 彩蛋：尽管这栋建筑里坐落着全国最具影响力的政府部门之一，但对公众开放的空间却只有西侧庭院翼楼的两个底层房间，而且仅在举办展览时偶尔开放——也就是说，捷克大部分的外交决策，都是在普通游客永远无缘窥见的高墙之内做出的。`,
    },
  },
  {
    name: 'Astronomical Tower of the Klementinum',
    slug: 'astronomicka-vez-klementina',
    localizedNames: { cz: 'Astronomická věž Klementina', zh: '克莱门蒂努姆天文塔' },
    labels: ['tower', 'historical', 'architecture'],
    coordinates: { lat: 50.08666296354194, lng: 14.416485692564798 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Astronomick%C3%A1_v%C4%9B%C5%BE_(Klementinum)',
    description: {
      en: `Brave adventurer, welcome to the Astronomical Tower of the Klementinum — a 68-metre Baroque tower that spent nearly two centuries telling all of Prague what time it was, using nothing more high-tech than a flag, a cannon, and a beam of sunlight.

Built in 1722 as part of the Klementinum's expansion, the tower became home to a proper Jesuit astronomical observatory from 1751–1752 onward, run by mathematician Joseph Stepling as its first director. From 20 July 1842, a flag waved from the tower's gallery marked the exact moment of local noon — determined using a camera-obscura-style sunbeam falling on a taut string in the tower's Meridian Hall — so that Praguers could set their clocks. Between 1891 and 1926, a cannon shot from Prague Castle backed up the flag signal for anyone who couldn't see it.

The time-signal system quietly tracked the whole turbulent 20th century: the flag went from red-and-white to Austro-Hungarian black-and-yellow and back to red-and-white after independence, before switching to Central European Time in 1912 and finally being replaced by radio telegraph signals in 1926. Astronomical observations continued until 1939, by which point most serious work had already shifted to the newer Ondřejov Observatory outside the city. Climb the tower's 172 steps today and you'll find a lead statue of Atlas by sculptor Matyáš Bernard Braun holding up the heavens from the very top.

🥚 Easter Egg: The tower is missing three of its four original sundials — only one survives — which means the building that spent two centuries meticulously telling all of Prague the correct time can no longer, by its own oldest method, entirely tell you the time itself.`,

      cz: `Statečný dobrodruhu, vítej u Astronomické věže Klementina — 68metrové barokní věže, která téměř dvě století oznamovala celé Praze přesný čas, a to jen pomocí praporu, děla a paprsku slunečního světla.

Věž vznikla v roce 1722 v rámci rozšiřování Klementina a od let 1751–1752 se v ní usídlila skutečná jezuitská hvězdárna, kterou jako první ředitel vedl matematik Joseph Stepling. Od 20. července 1842 z ochozu věže vlál prapor označující přesný okamžik místního poledne — určovaný principem camery obscury pomocí slunečního paprsku dopadajícího na napjatou strunu v Meridiánové síni věže —, aby si podle něj mohli Pražané seřizovat hodiny. Mezi lety 1891 a 1926 doprovázela praporové znamení ještě rána z děla vystřelená z Pražského hradu, pro ty, kdo prapor neviděli.

Systém časového znamení tiše provázel celé bouřlivé 20. století: prapor prošel od červenobílé přes rakousko-uherskou černožlutou zpět k červenobílé po vzniku samostatnosti, než v roce 1912 přešel na středoevropský čas a v roce 1926 byl konečně nahrazen rádiotelegrafním signálem. Astronomická pozorování pokračovala až do roku 1939, i když většina seriózní práce se mezitím přesunula na novější observatoř v Ondřejově za městem. Vystoupáte-li dnes po 172 schodech věže, na samém vrcholu vás čeká olověná socha Atlanta od sochaře Matyáše Bernarda Brauna, který nese na svých bedrech nebeskou klenbu.

🥚 Velikonoční vajíčko: Věži chybí tři ze čtyř původních slunečních hodin — dochovaly se jen jedny —, takže budova, která dvě staletí Praze úzkostlivě přesně hlásila čas, už dnes vlastní nejstarší metodou úplně přesný čas ukázat nedokáže.`,

      zh: `勇敢的冒险家，欢迎来到克莱门蒂努姆天文塔——一座68米高的巴洛克塔楼，曾在近两个世纪里，仅凭一面旗帜、一门大炮和一束阳光，就把准确的时间告诉了整个布拉格。

这座塔楼建于1722年，是克莱门蒂努姆扩建工程的一部分，自1751至1752年起，这里便设立了一座正式的耶稣会天文台，由数学家约瑟夫·斯特普林（Joseph Stepling）担任首任台长。从1842年7月20日起，每到当地正午时分，塔楼观景台上就会挥动一面旗帜——正午时刻的判定，依靠的是一种类似"暗箱成像"的原理：阳光穿过塔内"子午线大厅"（Meridiánova síň）、照射在一根绷紧的细绳上——好让布拉格市民借此校准自己的时钟。1891年至1926年间，为了照顾看不到旗帜信号的人，布拉格城堡还会鸣放一炮，与旗语信号相互配合。

这套报时系统悄然见证了整个动荡的20世纪：旗帜的颜色从红白两色变为奥匈帝国的黑黄两色，独立后又变回红白两色；1912年改用中欧标准时间，直到1926年才最终被无线电报信号取代。天文观测活动一直持续到1939年，尽管当时大部分严肃的观测工作早已转移到城外更新的翁德热约夫天文台（Ondřejov Observatory）。如今登上塔楼172级台阶，你会在塔顶发现雕塑家马佳什·伯纳德·布劳恩（Matyáš Bernard Braun）创作的铅制阿特拉斯雕像，依然扛着那片苍穹。

🥚 彩蛋：塔楼原本的四座日晷，如今只剩下一座——也就是说，这座曾经两个世纪以来一丝不苟地为全布拉格报时的建筑，如今若仅靠自己最古老的报时方法，反倒已经无法完整地告诉你准确的时间了。`,
    },
  },
  {
    name: 'Týn Court (Ungelt)',
    slug: 'tynsky-dvur-ungelt',
    localizedNames: { cz: 'Týnský dvůr - Ungelt', zh: '提恩庭院——翁格尔特' },
    labels: ['historical', 'square', 'hidden-gem'],
    coordinates: { lat: 50.08802434835123, lng: 14.423956142844686 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Ungelt',
    description: {
      en: `Brave adventurer, welcome to Týnský dvůr — the Ungelt — a fortified medieval trading compound whose very name is German slang for "toll," which is a refreshingly honest thing to call a building whose entire purpose was collecting money from foreign merchants.

Archaeological finds trace the courtyard back to the 12th century, when it served as a princely and later royal customs house — the walled, moated compound where foreign traders were legally required to stay, display their goods, sell to local merchants, and pay duty on everything, all under one roof that also, generously, included a church and a hospital. The arrangement was formally codified in 1304, and the Ungelt reached its peak under Charles IV and Wenceslas IV, when merchants were reportedly happy enough with the deal that many settled here permanently.

The Hussite wars briefly handed control to the Old Town municipality before the crown reclaimed it around the mid-15th century, and the customs operation finally shut down in 1774. Most of the eighteen surviving houses owe their Baroque facades to a 1689 fire that tore through the complex — the same fire, incidentally, that reshaped much of Baroque Prague. Archaeological excavation began in 1978, restoration followed in the early 1980s, and the courtyard finally reopened to the public in 1996.

🥚 Easter Egg: Local legend holds that the Ungelt is haunted by the ghost of a Turkish merchant, doomed to wander the courtyard dragging a young woman's severed head by her blonde hair — a suitably grim footnote for a place whose entire medieval business model was making sure nobody left without paying up.`,

      cz: `Statečný dobrodruhu, vítej v Týnském dvoře — Ungeltu —, opevněném středověkém obchodním dvorci, jehož samotné jméno je německý výraz pro "clo", což je osvěžující upřímné pojmenování pro budovu, jejímž jediným smyslem bylo vybírat peníze od zahraničních kupců.

Archeologické nálezy datují dvorec až do 12. století, kdy sloužil jako knížecí a později královská celnice — opevněný, příkopem obehnaný areál, kde zahraniční obchodníci museli podle zákona bydlet, vystavovat své zboží, prodávat je místním kupcům a ze všeho platit clo, a to vše pod jednou střechou, která velkoryse zahrnovala i kostel a špitál. Uspořádání bylo formálně kodifikováno v roce 1304 a Ungelt zažil svůj vrchol za Karla IV. a Václava IV., kdy byli kupci s podmínkami natolik spokojeni, že se mnozí usadili natrvalo.

Husitské války dvorec na čas svěřily do rukou staroměstské obce, než si jej kolem poloviny 15. století opět nárokovala koruna, a celní provoz definitivně skončil v roce 1774. Většina z osmnácti dochovaných domů vděčí za své barokní fasády požáru z roku 1689, který se prohnal celým areálem — témuž požáru, který mimochodem přetvořil velkou část barokní Prahy. Archeologický průzkum začal v roce 1978, na počátku 80. let následovala rekonstrukce a dvůr byl veřejnosti konečně otevřen v roce 1996.

🥚 Velikonoční vajíčko: Místní pověst tvrdí, že v Ungeltu straší duch tureckého kupce, odsouzený navěky bloudit dvorem a táhnout za sebou uťatou hlavu mladé dívky za její plavé vlasy — vhodně ponurá poznámka pod čarou pro místo, jehož celý středověký byznys plán stál na tom, aby odtud nikdo neodešel bez zaplacení.`,

      zh: `勇敢的冒险家，欢迎来到提恩庭院——翁格尔特（Ungelt）——一座中世纪的设防商贸大院，它的名字本身在德语里就是"关税"的俚语说法，对于一栋存在的唯一目的就是向外国商人收钱的建筑来说，这个名字倒是相当坦率诚实。

考古发现将这座庭院的历史一路追溯到12世纪，当时它是一处王公、后来是王室的海关机构——一座由城墙与壕沟围合而成的院落，外国商人依法必须在此居住、展示货物、向本地商人出售，并为一切交易缴纳关税，而这一切都发生在同一片屋檐下——这片屋檐甚至还慷慨地容纳了一座教堂和一间医院。这套制度于1304年被正式编入法典，翁格尔特在查理四世与瓦茨拉夫四世统治时期迎来鼎盛，据说商人们对这里的待遇相当满意，许多人索性就此定居下来，再未离开。

胡斯战争期间，庭院的管理权一度转交给老城市政当局，直到15世纪中叶前后才重新归还王室，海关业务最终于1774年彻底终止。如今保存下来的十八栋房屋，大多数的巴洛克立面都要归功于1689年那场席卷整个建筑群的大火——顺带一提，正是这场大火，重塑了巴洛克风格布拉格的大半面貌。考古发掘工作始于1978年，随后在80年代初进行了修复，庭院最终于1996年重新向公众开放。

🥚 彩蛋：当地传说称，翁格尔特闹鬼，一名土耳其商人的亡灵被诅咒永世徘徊于庭院之中，拖拽着一位年轻女子的金发头颅——对于一个整套中世纪商业模式都建立在"确保没人能不付钱就离开"之上的地方来说，这个阴森的小传说倒也算得上恰如其分。`,
    },
  },
  {
    name: 'Chapel of the Holy Family',
    slug: 'kaple-svate-rodiny-praha',
    localizedNames: { cz: 'Kaple Svaté Rodiny (Praha)', zh: '布拉格圣家小堂' },
    labels: ['church', 'historical'],
    coordinates: { lat: 50.06899036751166, lng: 14.436124206279292 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Kaple_svat%C3%A9_Rodiny_(Praha)',
    description: {
      en: `Brave adventurer, welcome to the Chapel of the Holy Family — a tiny vineyard chapel built in 1755 specifically because one wealthy Prague merchant thought the workers on his land were, in his own words, an "unruly and undisciplined rabble" who needed regular churchgoing to straighten them out.

That merchant, city councillor Karel Leopold Bepta, funded the chapel from his own estate and originally handed its care to hermit monks of the Ivanite order — a small, obscure monastic order that barely survived Emperor Joseph II's sweeping dissolution of monasteries in 1782. Stripped of its caretakers, the little chapel drifted into decline, was folded into the Michle parish as a near-ruin by 1892, got a partial patch-up in 1908, and kept slowly falling apart anyway — at one point actually slated for demolition, a fate it somehow escaped.

Salvation came from an unexpected direction in 1970, when Prague's small Old Catholic Church took over the abandoned building and restored it through volunteer labour, eventually completing a full reconstruction in 1992. It still functions today as an active place of worship for that same small denomination.

🥚 Easter Egg: A well-meaning café owner once tried to spruce up the chapel's exterior with decorative murals — only for graffiti artists to repeatedly target the building anyway, seemingly undeterred, or possibly even encouraged, by the fresh canvas. The murals were eventually removed.`,

      cz: `Statečný dobrodruhu, vítej v Kapli Svaté Rodiny — nepatrné viniční kapličce postavené v roce 1755 jen proto, že jeden bohatý pražský měšťan usoudil, že dělníci na jeho pozemcích jsou, jeho vlastními slovy, "cháska rozpustilá a velmi nevázaná", kterou pravidelné bohoslužby uvedou na správnou cestu.

Onen měšťan, městský radní Karel Leopold Bepta, kapli zaplatil z vlastního jmění a její správu původně svěřil poustevníkům z řádu ivanitů — malého, nepříliš známého mnišského řádu, který sotva přežil rozsáhlé rušení klášterů za císaře Josefa II. v roce 1782. Bez svých správců kaplička postupně chátrala, do roku 1892 byla jako téměř zřícenina přičleněna k michelské farnosti, v roce 1908 se dočkala částečné opravy, ale i tak se dál pomalu rozpadala — v jednu chvíli byla dokonce určena k demolici, které se ale nakonec nějak vyhnula.

Záchrana přišla nečekaně v roce 1970, kdy opuštěnou budovu převzala malá Starokatolická církev v Praze a dobrovolnicky ji zrestaurovala, přičemž kompletní rekonstrukce byla dokončena v roce 1992. Dodnes slouží jako aktivní bohoslužebný prostor téže malé církve.

🥚 Velikonoční vajíčko: Jeden dobře míněný majitel kavárny se kdysi pokusil zvenčí kapli okrášlit dekorativními malbami — jenže sprejeři si na budovu navzdory tomu (nebo možná právě kvůli tomu) dál pravidelně brousili zuby. Malby byly nakonec odstraněny.`,

      zh: `勇敢的冒险家，欢迎来到圣家小堂——一座建于1755年的小型葡萄园礼拜堂，之所以建成，纯粹是因为一位富有的布拉格商人认为，在自己地产上干活的工人们，用他自己的话说，是一群"放荡不羁、毫无纪律"的人，需要定期上教堂来"改邪归正"。

这位商人——市议员卡雷尔·利奥波德·贝普塔（Karel Leopold Bepta）——自掏腰包资助了这座小堂，并最初将其托付给"伊万派"（Ivanite）隐修士照管——这是一个规模很小、鲜为人知的修会，在1782年约瑟夫二世大规模解散修道院的行动中几乎未能幸存。失去了照管者之后，这座小教堂逐渐荒废，到1892年时已近乎废墟，被并入米赫莱堂区；1908年得到部分修缮，但此后依然缓慢败坏——一度甚至被列入拆除计划，却不知怎么侥幸逃过一劫。

转机出现在1970年，布拉格规模不大的老公教会（Old Catholic Church）接管了这座废弃的建筑，依靠志愿者的力量将其修复，并最终于1992年完成全面重建。如今，它仍作为这一小型教派的活跃礼拜场所使用。

🥚 彩蛋：一位好心的咖啡馆老板曾试图用装饰性壁画为小堂外观增色——结果涂鸦客们却屡屡盯上这座建筑，似乎丝毫没有被吓退，甚至可能反被这块"新画布"所吸引。这些壁画后来还是被清除掉了。`,
    },
  },
  {
    name: 'Capuchin Monastery (Hradčany)',
    slug: 'klaster-kapucinu-hradcany',
    localizedNames: { cz: 'Klášter kapucínů Hradčany', zh: '赫拉德恰尼嘉布遣会修道院' },
    labels: ['monastery', 'historical', 'architecture'],
    coordinates: { lat: 50.08990533567678, lng: 14.39189169556788 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Kl%C3%A1%C5%A1ter_kapuc%C3%ADn%C5%AF_(Hrad%C4%8Dany)',
    description: {
      en: `Brave adventurer, welcome to the Capuchin Monastery on Hradčany — the oldest Capuchin monastery in the Czech lands, founded in 1600 by a friar who would later be made a saint, and which has since survived a Prussian bombardment, an SS prison, and a communist expulsion order.

Twelve Capuchin friars arrived in Prague in 1599 under the leadership of Lawrence of Brindisi — later canonised by the Catholic Church — who personally oversaw construction of this first monastery and its attached Church of Our Lady of the Angels, funded by land donated by Prague's own archbishop. The complex grew steadily through the 17th and early 18th centuries and is connected to the neighbouring Loreta shrine, which the Capuchins still administer, by an elevated covered walkway.

The monastery has taken more than its share of hits from history: Prussian artillery damaged it during the 1757 siege of Prague — the cannonballs are still on display — and during the Nazi occupation, the SS converted part of the building into a prison. The Capuchins briefly returned after the war, only to be forcibly expelled by the communist regime in the early 1950s, after which the state security services moved in. The friars didn't get their home back until 1990.

🥚 Easter Egg: The monastery's crypt holds the remains of Vratislav Eusebius of Pernstein, the very last male heir of one of medieval Bohemia's great noble families — meaning an entire aristocratic dynasty's bloodline quietly ends here, in a Capuchin basement, a few footsteps from the busloads of tourists filing into the Loreta next door.`,

      cz: `Statečný dobrodruhu, vítej v Klášteře kapucínů na Hradčanech — nejstarším kapucínském klášteře v českých zemích, založeném roku 1600 mnichem, který byl později svatořečen, a který od té doby přežil pruské bombardování, gestapáckou věznici i komunistický vyhošťovací příkaz.

Dvanáct kapucínských bratří přišlo do Prahy v roce 1599 pod vedením Vavřince z Brindisi — později svatořečeného katolickou církví —, který osobně dohlížel na stavbu tohoto prvního kláštera i přilehlého kostela Panny Marie Andělské, postaveného na pozemku darovaném pražským arcibiskupem. Areál se postupně rozrůstal v průběhu 17. a počátku 18. století a se sousední Loretou, kterou kapucíni dodnes spravují, je propojen vyvýšenou krytou chodbou.

Klášter si za svou historii vytrpěl víc než dost: pruské dělostřelectvo jej poškodilo při obléhání Prahy v roce 1757 — dělové koule jsou zde dodnes vystaveny — a za nacistické okupace zřídilo gestapo v části budovy věznici. Kapucíni se po válce na chvíli vrátili, jen aby je komunistický režim počátkem 50. let násilně vyhnal, načež se do budovy nastěhovala Státní bezpečnost. Bratři svůj domov zpět dostali až v roce 1990.

🥚 Velikonoční vajíčko: V kryptě kláštera odpočívá Vratislav Eusebius z Pernštejna, úplně poslední mužský potomek jednoho z velkých šlechtických rodů středověkých Čech — takže celá jedna aristokratická linie tiše končí právě tady, v kapucínském sklepení, pár kroků od turistických zástupů mířících do sousední Lorety.`,

      zh: `勇敢的冒险家，欢迎来到赫拉德恰尼嘉布遣会修道院——捷克境内历史最悠久的嘉布遣会修道院，由一位后来被封为圣人的修士于1600年创立，此后先后挺过了普鲁士的炮击、党卫军的监狱，以及共产党政权的驱逐令。

1599年，十二位嘉布遣会修士在布林迪西的圣劳伦斯（Lawrence of Brindisi，后被天主教会封圣）率领下来到布拉格，他亲自监督了这座首座修道院及其附属的天使圣母教堂（Church of Our Lady of the Angels）的建造工程，土地则由布拉格大主教本人捐赠。整个建筑群在17世纪至18世纪初逐步扩建，并通过一条高架有顶的走廊，与嘉布遣会至今仍在管理的邻近的洛雷塔圣地（Loreta）相连。

这座修道院承受的历史创伤远不止一次：1757年布拉格围城战期间，普鲁士炮兵曾对其造成损坏——那些炮弹至今仍陈列于此；纳粹占领期间，党卫军又将部分建筑改造成了监狱。战后嘉布遣会修士曾短暂回归，却在50年代初被共产政权强行驱逐，随后国家安全部门便进驻此处。修士们直到1990年才终于重新拥有了自己的家园。

🥚 彩蛋：修道院的地下墓室中安葬着弗拉季斯拉夫·欧塞比乌斯·冯·佩尔恩施泰因（Vratislav Eusebius of Pernstein）——中世纪波希米亚一大贵族世家最后一位男性继承人。也就是说，一整个贵族血脉，就这样悄无声息地终结在这里，在一间嘉布遣会的地下室里，距离隔壁鱼贯而入的成车游客，不过几步之遥。`,
    },
  },
  {
    name: 'Lumbe Garden',
    slug: 'lumbeho-zahrada',
    localizedNames: { cz: 'Lumbeho zahrada', zh: '伦贝花园' },
    labels: ['park', 'historical', 'nature'],
    coordinates: { lat: 50.09160986880122, lng: 14.395142862908692 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Lumbeho_vila',
    description: {
      en: `Brave adventurer, welcome to Lumbe Garden — a walled, off-limits patch of greenery next to the Czech president's official residence that spent the early Middle Ages as a graveyard, the Renaissance as an imperial pheasant farm, and the 21st century as somewhere you're specifically not allowed to go.

Archaeological digs here in the 1970s and 80s uncovered one of the largest Slavic-era cemeteries ever found in the area, with 10th-century skeletal graves — remarkably, over 75 percent of the people buried here were women, many identified by rich jewellery as members of the Přemyslid princely court. Centuries later, under Emperor Rudolf II, the same ground hosted imperial pheasantries and farm buildings before the noble Černín family turned it into an ornamental garden. Physician and politician Karl Lumbe bought the property in 1852 and rebuilt the house in a severe late-Classicist style, giving the garden the name it still carries.

The 1920s cut the grounds roughly in half when a tram line and widened road sliced straight through the property, leaving the southern portion as today's Lumbe Garden. The Czechoslovak state took over the deteriorating estate in 1925, and after decades of assorted institutional use, President Václav Havel had the neighbouring villa rebuilt as an official state guesthouse in the 1990s — before President Václav Klaus made it his actual residence in 2004, backed by a 52-million-crown renovation.

🥚 Easter Egg: Prague Castle's gardeners still grow the flowers for the entire castle complex inside this garden — meaning every bouquet and flowerbed you admire elsewhere on the castle grounds almost certainly started life in this one patch of soil that ordinary visitors are never allowed to see.`,

      cz: `Statečný dobrodruhu, vítej v Lumbeho zahradě — obehnaném, veřejnosti nepřístupném kousku zeleně hned vedle oficiálního sídla českého prezidenta, který v raném středověku sloužil jako hřbitov, v renesanci jako císařská bažantnice a ve 21. století jako místo, kam vás konkrétně nepustí.

Archeologické průzkumy zde v 70. a 80. letech odkryly jedno z největších slovanských pohřebišť v okolí, s kostrovými hroby z 10. století — pozoruhodně přes 75 procent pohřbených tvořily ženy, z nichž mnohé podle bohatých šperků patřily k přemyslovskému knížecímu dvoru. O staletí později, za vlády Rudolfa II., hostilo stejné místo císařské bažantnice a hospodářské budovy, než z něj šlechtický rod Černínů udělal okrasnou zahradu. Lékař a politik Karl Lumbe pozemek koupil v roce 1852 a dům nechal přestavět v přísně pozdně klasicistním stylu, po němž zahrada dodnes nese jméno.

Ve 20. letech 20. století pozemek zhruba na půl rozřízla tramvajová trať a rozšířená silnice, takže jižní část zůstala jako dnešní Lumbeho zahrada. Chátrající usedlost převzal československý stát v roce 1925, a po desetiletích nejrůznějšího institucionálního využití nechal prezident Václav Havel sousední vilu v 90. letech přestavět na oficiální státní hostinský dům — než si ji v roce 2004 vybral za své skutečné sídlo prezident Václav Klaus, za cenu rekonstrukce v hodnotě 52 milionů korun.

🥚 Velikonoční vajíčko: Zahradníci Pražského hradu v této zahradě dodnes pěstují květiny pro celý hradní areál — takže téměř každá kytice a záhon, který obdivujete kdekoliv jinde na hradě, téměř jistě vzešel právě z tohoto jednoho kousku země, kam se běžný návštěvník nikdy nepodívá.`,

      zh: `勇敢的冒险家，欢迎来到伦贝花园——一片被围墙圈起、不对外开放的绿地，就在捷克总统官邸旁边，中世纪早期曾是墓地，文艺复兴时期曾是皇家雉鸡饲养场，到了21世纪，则单纯变成了一个明确禁止你进入的地方。

上世纪70至80年代的考古发掘，在这里发现了周边地区规模最大的斯拉夫时代墓地之一，其中包括十世纪的骨骸墓葬——引人注目的是，超过75%的墓主为女性，其中不少人凭借随葬的华贵珠宝，被认定为普热米斯尔王朝王公宫廷的成员。几个世纪后，在鲁道夫二世统治时期，同一片土地又变成了皇家雉鸡饲养场和农业用房，此后贵族切尔宁家族（Černín）将其改造成了一座观赏花园。医生兼政治家卡尔·伦贝（Karl Lumbe）于1852年买下这处产业，并将宅邸按照严谨的晚期古典主义风格重建，花园也由此得名，沿用至今。

20世纪20年代，一条有轨电车线路与一条拓宽的道路径直穿过这片土地，将其大致一分为二，南侧部分便成了今天的伦贝花园。捷克斯洛伐克国家于1925年接手了这处日渐破败的产业，历经数十年种种机构用途之后，总统瓦茨拉夫·哈维尔在上世纪90年代将旁边的别墅重建为官方国宾馆——直到2004年，总统瓦茨拉夫·克劳斯将其选作自己真正的官邸，为此还投入了5200万克朗进行翻修。

🥚 彩蛋：布拉格城堡的园丁们，至今仍在这座花园里培育供应整个城堡建筑群使用的花卉——也就是说，你在城堡其他任何角落欣赏到的每一束花、每一片花坛，几乎肯定都源自这片普通游客永远无缘得见的土地。`,
    },
  },
  {
    name: 'House at the Golden Pear & House at the Golden Grape',
    slug: 'dum-u-zlate-hrusky-a-u-zlateho-hroznu',
    localizedNames: { cz: 'Dům U Zlaté hrušky a Dům U Zlatého hroznu', zh: '金梨之家与金葡萄之家' },
    labels: ['historical', 'architecture', 'hidden-gem'],
    coordinates: { lat: 50.09069327149062, lng: 14.392496931307004 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/D%C5%AFm_U_Zlat%C3%A9ho_hroznu',
    description: {
      en: `Brave adventurer, welcome to the House at the Golden Pear and the House at the Golden Grape — two gilded-named houses on a street of gilded-named houses in Nový Svět, a quarter founded in the 14th century specifically to house Prague's poorest residents, because apparently nothing cheers up poverty like calling your house "Golden."

Both houses were built around 1690 by the same man, a butcher named Abraham (surname recorded variously as Unkoffer or Unkofffer depending on which archive you trust), who lived at what's now the Golden Pear — originally nicknamed "U Abrahama" after him — before building the neighbouring Golden Grape next door, decorating it with frescoes, painted ceilings, and imported Venetian mirrors. The Golden Grape later passed through the hands of Ursuline nuns and a wealthy art collector named Josef Pikart, whose personal collection eventually became the founding core of what is today the National Gallery.

In the 20th century, Golden Grape briefly housed composer Rudolf Friml — a Czech pianist who emigrated to America and went on to write Broadway hits like "Rose-Marie" and "The Vagabond King" — while the surrounding street, still known locally as "Prague's Montmartre," became an informal artists' colony where filmmakers Jindřich Polák and Karel Kachyňa, painter Jiří Anderle, and sculptor Josef Nálepa reportedly moved so freely between each other's homes that neighbours joked they "passed doors back and forth."

🥚 Easter Egg: Today the Golden Pear houses a genuinely upscale restaurant and the Golden Grape a well-known wine bar — meaning two houses built by a single 17th-century butcher for himself and his neighbours have, three centuries later, both ended up quietly back in the food and drink business.`,

      cz: `Statečný dobrodruhu, vítej u Domu U Zlaté hrušky a Domu U Zlatého hroznu — dvou zlatě pojmenovaných domů na ulici plné zlatě pojmenovaných domů v Novém Světě, čtvrti založené ve 14. století speciálně pro nejchudší pražské obyvatele, protože zjevně nic nepozvedne náladu chudobě líp než pojmenovat si dům "Zlatý".

Oba domy postavil kolem roku 1690 tentýž muž, řezník jménem Abraham (příjmení se v pramenech uvádí různě jako Unkoffer či Unkofffer, podle toho, kterému archivu věříte), který sám bydlel v domě, jenž se dnes jmenuje U Zlaté hrušky — původně po něm přezdívaném "U Abrahama" —, než si vedle postavil sousední Zlatý hrozen a vyzdobil jej freskami, malovanými stropy a dovezenými benátskými zrcadly. Zlatý hrozen později prošel rukama uršulinek a bohatého sběratele umění Josefa Pikarta, jehož soukromá sbírka se nakonec stala základem toho, co je dnes Národní galerie.

Ve 20. století v Zlatém hroznu krátce bydlel skladatel Rudolf Friml — český pianista, který emigroval do Ameriky a proslavil se broadwayskými hity jako "Rose-Marie" nebo "The Vagabond King" —, zatímco okolní ulice, dodnes místně přezdívaná "pražský Montmartre", se stala neformální umělecké kolonií, kde se malíř Jiří Anderle, sochař Josef Nálepa a filmaři Jindřich Polák a Karel Kachyňa údajně pohybovali mezi sebou tak volně, že si sousedé razili vtip, že si "podávají dveře".

🥚 Velikonoční vajíčko: Dnes sídlí v Zlaté hrušce opravdu luxusní restaurace a ve Zlatém hroznu oblíbená vinárna — takže dva domy, které si pro sebe a své sousedy postavil jeden sedmnáctistoletý řezník, se o tři století později tiše vrátily zpátky k jídlu a pití.`,

      zh: `勇敢的冒险家，欢迎来到"金梨之家"与"金葡萄之家"——在新世界区（Nový Svět）这条满是"黄金"命名房屋的街道上，这两栋名字同样镀金的房子，而这个街区最初建立于14世纪，专门用来安置布拉格最贫穷的居民——看来给房子取名"黄金"，似乎是治愈贫穷最简单的办法。

这两栋房子都由同一个人于1690年前后建造——一位名叫亚伯拉罕（Abraham）的屠夫（姓氏在不同档案中记载为翁科弗尔"Unkoffer"或"Unkofffer"，说法不一），他本人住在如今被称为"金梨之家"的房子里——最初这栋房子还因他而被称为"U Abrahama"（亚伯拉罕之家）——随后又在旁边建起了"金葡萄之家"，并用壁画、彩绘天顶和进口的威尼斯镜子加以装饰。"金葡萄之家"后来先后归乌尔苏拉会修女以及富有的艺术收藏家约瑟夫·皮卡特（Josef Pikart）所有，皮卡特的私人收藏后来更成为了今天国家美术馆的奠基藏品。

20世纪，作曲家鲁道夫·弗里姆尔（Rudolf Friml）曾在"金葡萄之家"短暂居住——他是一位捷克钢琴家，后移居美国，创作了《罗丝-玛丽》（Rose-Marie）和《游荡王》（The Vagabond King）等百老汇名作；与此同时，周围这条至今仍被当地人称为"布拉格蒙马特"的街道，也悄然形成了一个非正式的艺术家聚居区——画家伊日·安德尔莱（Jiří Anderle）、雕塑家约瑟夫·纳莱帕（Josef Nálepa），以及导演扬德日赫·波拉克（Jindřich Polák）和卡雷尔·卡赫尼亚（Karel Kachyňa），据说彼此往来密切到邻居们打趣说他们"互相传递门钥匙"一般自由出入。

🥚 彩蛋：如今，"金梨之家"里开着一家相当高档的餐厅，"金葡萄之家"里则是一家颇受欢迎的葡萄酒吧——也就是说，一位17世纪的屠夫为自己和邻居建造的这两栋房子，三个世纪后，竟又不约而同地悄悄回归了餐饮这一行。`,
    },
  },
  {
    name: 'Pohořelec Barracks',
    slug: 'kasarna-na-pohorelci',
    localizedNames: { cz: 'Kasárna na Pohořelci', zh: '波霍热莱茨兵营' },
    labels: ['historical', 'architecture', 'communism'],
    coordinates: { lat: 50.087391591020264, lng: 14.38776099490174 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Kas%C3%A1rna_na_Poho%C5%99elci',
    description: {
      en: `Brave adventurer, welcome to the Pohořelec Barracks — a two-hectare Neo-Renaissance military complex built in four separate construction pushes over 26 years, on the site of a 17th-century city gate, which then spent much of the 20th century as the unlikely home address of Czechoslovakia's official army song-and-dance troupe.

Built in stages between 1873 and 1899 by four different architects — the main clock-towered building went up in 1890–1893 under Jindřich Fialka — the barracks replaced the old Strahov Gate, a fortification built in 1619–1620 and funded personally by a Malá Strana mayor. Once complete, the complex housed the 8th Landwehr Infantry Regiment from 1889, a mostly Czech unit of the Austro-Hungarian army that marched out from these very buildings in 1914 straight into the bloody Serbian front of WWI. Anti-aircraft and artillery regiments cycled through afterward, followed by a signals regiment in the late 1950s.

From 1956, the barracks took on a stranger second role as headquarters of the Vít Nejedlý Army Arts Ensemble — Czechoslovakia's official military song-and-dance troupe, founded in 1943 among Czechoslovak soldiers training in the Soviet Union and modelled directly on the USSR's famous Alexandrov Ensemble. Over its history the group performed more than 10,000 compositions across some 43,000 shows on four continents, before finally disbanding in 1995. The barracks themselves have stood empty since at least 2022, waiting on a Ministry of Defence reconstruction plan that hasn't yet materialised.

🥚 Easter Egg: The ensemble was named after conductor Vít Nejedlý, who died of typhus in a Polish military hospital in early 1945 while serving with Czechoslovak forces fighting through the Carpathians — meaning the barracks spent decades honouring, through song, a man who never lived to see the war he fought in actually end.`,

      cz: `Statečný dobrodruhu, vítej v Kasárnách na Pohořelci — dvouhektarovém novorenesančním vojenském komplexu, postaveném ve čtyřech samostatných stavebních etapách během 26 let, na místě sedmnáctistoleté městské brány, který pak většinu 20. století nečekaně sloužil jako sídlo oficiálního armádního pěveckého a tanečního souboru Československa.

Kasárny postavili ve fázích mezi lety 1873 a 1899 čtyři různí architekti — hlavní budova s hodinovou věží vznikla v letech 1890–1893 podle návrhu Jindřicha Fialky — a nahradily starou Strahovskou bránu, opevnění postavené v letech 1619–1620 na osobní náklady malostranského purkmistra. Po dokončení sídlil v komplexu od roku 1889 8. zeměbranecký pěší pluk, převážně český útvar rakousko-uherské armády, který z těchto budov v roce 1914 vypochodoval rovnou na krvavou srbskou frontu první světové války. Poté se v kasárnách vystřídaly protiletadlové a dělostřelecké pluky a koncem 50. let spojovací pluk.

Od roku 1956 sídlil v kasárnách i jejich podivnější druhá role: byly domovem Armádního uměleckého souboru Víta Nejedlého — oficiálního československého vojenského pěveckého a tanečního souboru, založeného v roce 1943 mezi československými vojáky cvičícími v Sovětském svazu a vzniklého přímo podle vzoru slavného sovětského Alexandrovova souboru. Za svou existenci soubor uvedl přes 10 tisíc skladeb v přibližně 43 tisících vystoupeních na čtyřech kontinentech, než byl v roce 1995 definitivně rozpuštěn. Samotné kasárny stojí prázdné přinejmenším od roku 2022 a čekají na rekonstrukční plán ministerstva obrany, který se zatím nezhmotnil.

🥚 Velikonoční vajíčko: Soubor nesl jméno dirigenta Víta Nejedlého, který zemřel na tyfus v polské vojenské nemocnici na počátku roku 1945 během bojů československých jednotek v Karpatech — kasárny tak celá desetiletí zpěvem uctívaly muže, který se nedožil konce války, za kterou bojoval.`,

      zh: `勇敢的冒险家，欢迎来到波霍热莱茨兵营（Kasárna na Pohořelci）——一座占地两公顷的新文艺复兴风格军事建筑群，历经26年、分四个阶段建成，建于一座17世纪城门的原址之上，此后在20世纪的大部分时间里，竟意外地成了捷克斯洛伐克官方军队歌舞团的驻地。

这片兵营由四位不同的建筑师分阶段建于1873年至1899年间——带钟楼的主楼建于1890年至1893年，出自建筑师伊日·菲阿尔卡（Jindřich Fialka）之手——取代了原先的斯特拉霍夫城门（Strahov Gate），这座建于1619至1620年的防御工事，当年是由小城区一位市长个人出资修建的。建成后，第八边防步兵团自1889年起便驻扎于此，这是一支以捷克人为主的奥匈帝国军队，1914年正是从这些建筑里出发，径直开赴第一次世界大战血腥的塞尔维亚战线。此后，防空炮兵团与野战炮兵团陆续在此驻扎，到了上世纪50年代末，又轮到一支通信兵团。

从1956年起，这座兵营还承担起了一个更为奇特的角色：它成为了"维特·内耶德利军队艺术团"（Vít Nejedlý Army Arts Ensemble）的总部——这是捷克斯洛伐克官方的军队歌舞团，1943年由在苏联受训的捷克斯洛伐克士兵组建，直接仿照苏联著名的亚历山德罗夫红旗歌舞团（Alexandrov Ensemble）而建。在其存续期间，该团共演出了一万多部作品，在四大洲进行了约四万三千场演出，直到1995年最终解散。兵营本身至少自2022年起便一直空置，仍在等待国防部一项迟迟未能落地的重建计划。

🥚 彩蛋：这支艺术团得名于指挥家维特·内耶德利（Vít Nejedlý），他于1945年初，在随捷克斯洛伐克部队转战喀尔巴阡山脉期间感染伤寒，病逝于波兰的一所军队医院——也就是说，这座兵营用歌声纪念了这样一位人物长达数十年，而他本人却未能活着看到自己参与的这场战争最终结束。`,
    },
  },
  {
    name: 'Galerie Mňau',
    slug: 'galerie-mnau',
    localizedNames: { cz: 'Galerie Mňau', zh: '喵画廊' },
    labels: ['cultural', 'hidden-gem'],
    coordinates: { lat: 50.08779910103794, lng: 14.390534490516657 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Galerie Mňau — a shop so small and so specific that its entire creative identity fits into one word: "meow." It sells precisely one thing with unwavering focus, and that thing is cats, rendered in enamel, glass, and velvet.

Run as a working studio by enamel and glass artist Radka Urbanová, the gallery sits directly on Pohořelec square, a stone's throw from Strahov Monastery and the old barracks complex next door. Step inside and you'll find hand-fired enamel pieces, traditional Bohemian Jablonec glass jewellery, and — the shop's genuine signature item — handmade velvet cats stitched in the artist's own atelier, alongside other feline-themed keepsakes that exist for no reason other than someone, at some point, really committed to the bit.

It's a working atelier as much as a shop, meaning the pieces on the shelves were very possibly made a few metres from where you're standing, by the same person ringing up your purchase.

🥚 Easter Egg: Prague has dozens of galleries dedicated to Mucha, to Kafka, to Baroque saints, and to national heroes with equestrian statues — and exactly one, tucked onto a quiet square in Hradčany, dedicated entirely and unapologetically to cats. Somehow it took this long for someone to notice the gap in the market.`,

      cz: `Statečný dobrodruhu, vítej v Galerii Mňau — obchůdku tak malém a tak úzce zaměřeném, že se jeho celá umělecká identita vejde do jediného slova: "mňau". Prodává se tu přesně jedna věc, a to s naprosto neochvějným zaměřením: kočky, ztvárněné ve smaltu, skle a plyši.

Galerii vede jako svůj funkční ateliér smaltérka a sklářka Radka Urbanová a nachází se přímo na náměstí Pohořelec, co by kamenem dohodil od Strahovského kláštera i od sousedního areálu kasáren. Uvnitř najdeš ručně vypalované smaltové kousky, tradiční jabloneckou bižuterii ze skla a — skutečně charakteristický výrobek obchodu — ručně šité plyšové kočky z vlastního autorčina ateliéru, spolu s dalšími kočičími suvenýry, které existují z jediného důvodu: že se někdo v nějakou chvíli do tohoto tématu opravdu pustil naplno.

Je to stejnou měrou funkční ateliér jako obchod, takže kousky na policích velmi pravděpodobně vznikly pár metrů od místa, kde právě stojíš, a to rukama téže osoby, která ti je u pokladny prodá.

🥚 Velikonoční vajíčko: Praha má desítky galerií věnovaných Muchovi, Kafkovi, barokním světcům i národním hrdinům na koňských sochách — a přesně jednu, schovanou na tichém hradčanském náměstí, věnovanou zcela a bez servítků kočkám. Nějak trvalo hodně dlouho, než si někdo té mezery na trhu všiml.`,

      zh: `勇敢的冒险家，欢迎来到"喵画廊"（Galerie Mňau）——一家小到极致、主题也精准到极致的店铺，它整个创作理念只需要一个词就能概括："喵"。这里卖的东西只有一种，而且专注到毫不动摇：猫，用珐琅、玻璃和天鹅绒呈现出来的猫。

这间画廊由珐琅与玻璃艺术家拉德卡·乌尔巴诺娃（Radka Urbanová）亲自经营，兼作工作室使用，就坐落在波霍热莱茨广场（Pohořelec）上，与斯特拉霍夫修道院以及隔壁那座兵营仅几步之遥。走进店内，你会看到手工烧制的珐琅作品、传统的雅布洛内茨（Jablonec）玻璃饰品，以及——这家店真正的招牌商品——出自艺术家自己工作室、手工缝制的天鹅绒猫咪，还有其他各式猫主题纪念品，它们存在的理由只有一个：曾经有人对这个主题真的全情投入了。

与其说这是一家商店，不如说这更是一间正在运作的工作室——也就是说，架子上的作品很可能就是在你脚下这几米之内制作出来的，而制作它们的人，很可能正是站在收银台后面结账的那个人。

🥚 彩蛋：布拉格有几十家专门致力于穆夏、卡夫卡、巴洛克圣徒，以及骑马青铜像上民族英雄的画廊——却只有这唯一一家，藏在赫拉德恰尼一处安静的广场角落，毫不掩饰、全心全意地只献给"猫"这一个主题。也不知怎么，过了这么久才终于有人发现了这块市场空白。`,
    },
  },
  {
    name: 'Film Legends Museum of Prague',
    slug: 'film-legends-museum',
    localizedNames: { cz: 'Film Legends Museum Praha', zh: '布拉格电影传奇博物馆' },
    labels: ['museum', 'cultural'],
    coordinates: { lat: 50.0809296565979, lng: 14.429351066600328 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Film_Legends_Museum',
    description: {
      en: `Brave adventurer, welcome to the Film Legends Museum of Prague! Somewhere between a comic convention that forgot to end and a wax museum that traded kings for Klingons, this Opletalova Street collection packs in thousands of statues, busts, and replicas pulled straight from Hollywood's greatest hits — no ticket to a galaxy far, far away required.

The whole operation is built around the private collection of Johnny Wolf, one of the largest personal hoards of film and pop-culture memorabilia anywhere in the world. It opened humbly in 2015 in the unglamorous district of Vysočany, then wandered — first to Poděbrady, then to branches in Kroměříž, Kutná Hora, and Český Krumlov — before finally settling into its current home two minutes from Prague's Main Train Station in 2023. More than 3,000 pieces are on display across the museum's five locations combined, and the Prague branch alone holds hundreds of exhibits with a level of paint and sculpting detail that makes you forget you're looking at resin instead of an actor.

Expect dedicated corners for Disney villains, the Predator and Alien franchises, and the nightmarish biomechanical designs of H. R. Giger — plus a rotating cast of comic-book and fairy-tale characters standing frozen mid-battle, mid-spell, or mid-monologue in glass-free display halls built for close-up photography.

🥚 Easter Egg: Before it found its permanent Opletalova Street address, the collection spent eight years bouncing between five Czech towns — Prague, Poděbrady, Kroměříž, Kutná Hora, Český Krumlov — like a Hollywood sequel searching for a studio willing to greenlight it. For a museum built entirely on cinema icons, its own origin story reads suspiciously like a road movie.`,

      cz: `Statečný dobrodruhu, vítej ve Film Legends Museu Praha! Něco mezi comicsovým veletrhem, který zapomněl skončit, a voskovým muzeem, jež vyměnilo krále za Klingony — tahle sbírka na Opletalově ulici nacpává do svých sálů tisíce soch, bust a replik přímo z hollywoodských trháků. Vstupenka do galaxie daleko, předaleko není potřeba.

Celý podnik stojí na soukromé sbírce Johnnyho Wolfa, jedné z největších osobních kolekcí filmových a popkulturních memorabilií na světě. Muzeum vzniklo skromně v roce 2015 v nedaleké okrajové Vysočanech, poté putovalo — nejprve do Poděbrad, pak k pobočkám v Kroměříži, Kutné Hoře a Českém Krumlově — než se v roce 2023 konečně usadilo dvě minuty od Hlavního nádraží. Napříč všemi pěti pobočkami je vystaveno přes 3 000 kousků a samotná pražská pobočka obsahuje stovky exponátů s takovou úrovní detailu barev a modelace, že snadno zapomenete, že se díváte na pryskyřici, a ne na skutečného herce.

Čekají tě samostatné koutky věnované disneyovským záporákům, sérii Predátor a Vetřelec i nočně můrovým biomechanickým designům H. R. Gigera — plus proměnlivá sestava komiksových a pohádkových postav, zmrzlých uprostřed souboje, kouzla nebo monologu v sálech bez skla, uzpůsobených k fotografování zblízka.

🥚 Velikonoční vajíčko: Než sbírka našla svou trvalou adresu na Opletalově ulici, strávila osm let poskakováním mezi pěti českými městy — Prahou, Poděbrady, Kroměříží, Kutnou Horou a Českým Krumlovem — jako hollywoodský sequel hledající studio ochotné dát mu zelenou. Pro muzeum postavené kompletně na filmových ikonách zní jeho vlastní vznik podezřele jako road movie.`,

      zh: `勇敢的冒险家，欢迎来到布拉格电影传奇博物馆（Film Legends Museum）！这里介于一场永远不散场的漫展和一座把国王换成克林贡人的蜡像馆之间——坐落在奥普雷塔洛娃街（Opletalova）上的这间展馆，塞满了成千上万座取自好莱坞经典大片的雕像、半身像和复制品。想穿越到遥远的银河系？这里不需要机票。

整个博物馆建立在收藏家约翰尼·沃尔夫（Johnny Wolf）的私人藏品之上，这是全世界最大的电影与流行文化周边私人收藏之一。博物馆2015年低调地在布拉格外围的维索恰尼（Vysočany）区开业，此后辗转迁移——先搬到波杰布拉迪（Poděbrady），又陆续在克罗梅日什（Kroměříž）、库特纳霍拉（Kutná Hora）和捷克克鲁姆洛夫（Český Krumlov）开设分馆——直到2023年终于在距布拉格中央火车站仅两分钟路程的地方安顿下来。五个分馆合计展出超过3000件展品，仅布拉格馆就有数百件展品，上色和雕刻的精细程度会让你一时忘记眼前看到的是树脂模型，而不是真人演员。

这里设有迪士尼反派、《铁血战士》与《异形》系列，以及H·R·吉格尔（H. R. Giger）那些噩梦般生物机械设计的专属展区，还有轮换展出的漫画与童话角色，它们定格在战斗、施法或独白的瞬间，陈列在没有玻璃阻隔、专为近距离拍照设计的展厅里。

🥚 彩蛋：在奥普雷塔洛娃街找到永久落脚点之前，这批藏品曾在八年间辗转五座捷克城市——布拉格、波杰布拉迪、克罗梅日什、库特纳霍拉、捷克克鲁姆洛夫——像一部到处找不到片场愿意开绿灯的好莱坞续集。对于一家完全建立在电影偶像之上的博物馆来说，它自己的起源故事读起来也颇有公路片的味道。`,
    },
  },
  {
    name: 'Vyšehrad Wall Walkway and Viewpoint',
    slug: 'vysehrad-wall-walkway',
    localizedNames: { cz: 'Vyšehradské hradby a vyhlídka (Leopoldova bašta)', zh: '维谢赫拉德城墙步道与观景台' },
    labels: ['historical', 'architecture'],
    coordinates: { lat: 50.06541854697423, lng: 14.421705830149381 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Vyšehrad Wall Walkway and Viewpoint! Picture Prague Castle's ramparts, but with a tenth of the tour groups and none of the queuing — just a raised stone footpath along a seventeenth-century Baroque bastion, a river bend, and a view that quietly outclasses every postcard rack in the Old Town.

These fortifications were raised after the Thirty Years' War rattled Europe's confidence in medieval city walls, when Vyšehrad — already an ancient seat of Czech princes by legend — was rebuilt as a modern star-shaped Baroque fortress by the Habsburgs. The Leopold Bastion, where this walkway runs, is one of the surviving points along that ring, its thick sloped walls designed to deflect cannon fire rather than simply block it. Underneath your feet, incidentally, run the Vyšehrad Casemates: over a kilometre of brick tunnels built for moving soldiers and ammunition unseen, now home to a gallery of the original Charles Bridge statues, safely relocated out of the weather.

Walk the rampart itself and the reward is immediate: the Vltava curling below in a wide horseshoe bend, the Podolí water tower's slate roof rising on the far bank, and on a clear day, the wooded ridge of Barrandov in the distance. Unlike the crowded battlements above the castle, this walkway rarely fills up — which makes it one of the few places in Prague where you can stand on seventeenth-century military architecture in near silence.

🥚 Easter Egg: The star-shaped bastion design wasn't decorative flourish — it was applied geometry. Star forts eliminate the "dead zones" that straight medieval walls left directly beneath themselves, where attackers could huddle safely out of a defender's firing line. Every angle of the Leopold Bastion was calculated so that no attacker could ever stand somewhere the cannons above couldn't reach. Four hundred years later, it turns out those same angles also happen to frame one of the best river views in Prague — military engineers, it seems, stumbled into landscape architecture.`,

      cz: `Statečný dobrodruhu, vítej na Vyšehradských hradbách a vyhlídce! Představ si hradby Pražského hradu, ale s desetinou turistických skupin a bez jediné fronty — jen zvýšená kamenná pěšina po sedmnáctém baroknímu bastionu, ohyb řeky a výhled, který tiše zastíní všechny pohlednice ze Starého Města.

Tato opevnění vznikla poté, co třicetiletá válka otřásla důvěrou Evropy ve středověké hradby, kdy byl Vyšehrad — podle legendy již dávné sídlo českých knížat — přestavěn Habsburky na moderní barokní pevnost hvězdicového půdorysu. Leopoldova bašta, po níž tato promenáda vede, je jedním z dochovaných bodů tohoto prstence; její silné šikmé zdi byly navrženy tak, aby dělostřelecké koule spíše odklonily, než jen blokovaly. Pod tvýma nohama mimochodem vedou Vyšehradské kasematy — přes kilometr cihlových chodeb postavených pro nepozorovaný přesun vojáků a munice, dnes domov galerie originálních soch z Karlova mostu, bezpečně přemístěných z nepřízně počasí.

Projdi hradbu samotnou a odměna přijde okamžitě: Vltava se dole stáčí do širokého podkovovitého ohybu, na protějším břehu se zvedá břidlicová střecha podolské vodárenské věže a za jasného počasí je v dálce vidět zalesněný hřeben Barrandova. Na rozdíl od přeplněných cimbuří nad hradem se tahle promenáda málokdy zaplní — což z ní dělá jedno z mála míst v Praze, kde můžeš stát na sedmnáctistoleté vojenské architektuře téměř v naprostém tichu.

🥚 Velikonoční vajíčko: Hvězdicový tvar bastionu nebyl ozdobným gestem — byla to aplikovaná geometrie. Hvězdicové pevnosti odstraňují "mrtvé zóny", které středověké rovné hradby nechávaly přímo pod sebou a kam se útočníci mohli bezpečně schovat mimo palebnou linii obránců. Každý úhel Leopoldovy bašty byl vypočítán tak, aby žádný útočník nemohl stát na místě, kam by děla shora nedosáhla. O čtyři sta let později se ukazuje, že tytéž úhly mimochodem rámují jeden z nejlepších říčních výhledů v Praze — vojenští inženýři tak trochu nechtěně vytvořili krajinářskou architekturu.`,

      zh: `勇敢的冒险家，欢迎来到维谢赫拉德城墙步道与观景台！想象一下布拉格城堡的城墙，但游客团只有十分之一，也完全不用排队——只有一条沿着十七世纪巴洛克棱堡修建的石砌步道、一段河流的弯曲，以及一处足以让老城所有明信片架相形见绌的静谧美景。

这些防御工事建于三十年战争动摇了欧洲人对中世纪城墙信心之后。传说中早已是波希米亚王公古老驻地的维谢赫拉德，被哈布斯堡王朝重建为一座星形平面的现代巴洛克要塞。这条步道所在的利奥波德棱堡（Leopoldova bašta）正是这一防御圈中留存至今的一处；它厚实的斜面墙体设计初衷不是单纯阻挡炮弹，而是让炮弹偏转弹开。顺带一提，你脚下埋藏着维谢赫拉德地下堡道——一段超过一公里长的砖砌隧道网络，当年专为士兵与弹药的隐蔽调动而建，如今则安置着查理大桥原版雕像的展廊，让它们安然躲避风吹雨打。

沿着城墙走一小段，回报立刻显现：伏尔塔瓦河在下方蜿蜒成一道宽阔的马蹄形弯道，对岸波多利（Podolí）水厂塔楼的石板屋顶隐约可见，天气晴朗时，远处巴兰多夫（Barrandov）的林木山脊也尽收眼底。与城堡上方总是人潮拥挤的城垛不同，这条步道很少人满为患——这让它成为布拉格少数能让你几乎独自静静站在十七世纪军事建筑之上的地方。

🥚 彩蛋：星形棱堡的设计并非装饰性的花哨造型，而是一套应用几何学。星形要塞消除了传统直线城墙脚下常见的"死角"——那些攻城者可以安全躲藏、避开守军射界的区域。利奥波德棱堡的每一个角度都经过精确计算，确保没有任何攻击者能站在城墙上方火炮打不到的位置。四百年后，人们发现这些角度恰好也勾勒出了布拉格最好的河景之一——看来当年的军事工程师，无意间也顺手做了一把风景建筑师。`,
    },
  },
  {
    name: "St. Wenceslas's Vineyard",
    slug: 'svatovaclavska-vinice',
    localizedNames: { cz: 'Svatováclavská vinice', zh: '圣瓦茨拉夫葡萄园' },
    labels: ['historical', 'park'],
    coordinates: { lat: 50.09242127180625, lng: 14.407149205190063 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to St. Wenceslas's Vineyard (Svatováclavská vinice)! Legend has it the future patron saint of Christmas carols once rolled up his royal sleeves, grabbed a pruning knife, and tended these vines himself — making this quite possibly the only vineyard in Europe with a job reference from a saint who also has his own carol.

According to Czech tradition, Prince Wenceslas founded and personally worked this sun-warmed slope beneath Prague Castle in the early tenth century, growing grapes specifically to produce sacramental wine — tying this small patch of earth directly to the birth of Christianity, and by extension statehood, in Bohemia. The vineyard's fortunes rose and fell across the centuries along with everything else on this rocky spur between Klárov and the Deer Moat, until it was carefully restored and reopened to the public in September 2008, on the 1,100th anniversary of Wenceslas's birth. Today just under a quarter of a hectare of Pinot Noir and Riesling vines produces roughly 1,200 bottles a year — a rounding error by wine-industry standards, and entirely the point.

At the centre of the vineyard stands Villa Richter, a neoclassical building raised between 1832 and 1835 by architect Josef Klement Peschka, now converted into two restaurants and a subterranean Wine Tresor stocked with some 700 different labels. Sit on the pergola terrace at the right hour and you get one of the least crowded, most photogenic views of Prague's rooftops available anywhere near the castle.

🥚 Easter Egg: Wenceslas's association with wine isn't folk invention layered on after the fact — sacramental wine was a genuinely serious matter for a prince trying to root Christianity into a still-pagan-leaning Bohemian court. Growing your own meant controlling your own supply for the Mass, at a time when importing anything reliably from abroad was neither cheap nor guaranteed. Eleven hundred years later, the vineyard produces wine nobody needs for the liturgy — but the continuity is the whole point: the same slope, the same crop, the same saint's name still on the label.`,

      cz: `Statečný dobrodruhu, vítej na Svatováclavské vinici! Podle legendy si budoucí patron vánočních koled jednou vyhrnul knížecí rukávy, popadl vinařský nůž a vinici obdělával vlastníma rukama — což z ní dělá pravděpodobně jedinou vinici v Evropě s pracovní referencí od světce, který má i vlastní koledu.

Podle české tradice založil a osobně obdělával kníže Václav tento sluncem zalitý svah pod Pražským hradem na počátku desátého století a pěstoval hrozny přímo pro výrobu mešního vína — čímž tento malý kus země přímo spojil se zrodem křesťanství, a tedy i české státnosti. Osud vinice v průběhu staletí stoupal a klesal spolu se vším ostatním na tomto skalnatém výběžku mezi Klárovem a Jelením příkopem, dokud nebyla pečlivě obnovena a v září 2008, u příležitosti 1100. výročí narození sv. Václava, znovu otevřena veřejnosti. Dnes necelá čtvrthektarová plocha odrůd Pinot Noir a Ryzlink vydá zhruba 1 200 lahví ročně — z pohledu vinařského průmyslu zaokrouhlovací chyba, a přesně o to tu jde.

Uprostřed vinice stojí Richterova vila, klasicistní budova postavená v letech 1832 až 1835 architektem Josefem Klementem Peschkou, dnes přestavěná na dvě restaurace a podzemní Wine Tresor se zásobou zhruba 700 druhů vín. Posaď se ve správnou hodinu na terase pergoly a dostaneš jeden z nejméně přeplněných a nejfotogeničtějších výhledů na pražské střechy v okolí hradu.

🥚 Velikonoční vajíčko: Václavovo spojení s vínem není dodatečně přilepená lidová pověst — mešní víno bylo pro knížete, který se snažil zakořenit křesťanství v ještě dost pohanském českém dvoře, skutečně vážnou záležitostí. Pěstovat si vlastní hrozny znamenalo mít pod kontrolou zásoby pro mši v době, kdy spolehlivý dovoz odkudkoli nebyl ani levný, ani jistý. O jedenáct set let později vinice produkuje víno, které už nikdo pro liturgii nepotřebuje — ale právě ta kontinuita je celý smysl: stejný svah, stejná plodina, stále stejné jméno světce na etiketě.`,

      zh: `勇敢的冒险家，欢迎来到圣瓦茨拉夫葡萄园（Svatováclavská vinice）！传说这位后来成为圣诞颂歌主角的守护圣人，曾亲自挽起王室的袖子，拿起修枝刀，亲手打理这片葡萄园——这或许是全欧洲唯一一座拥有圣人亲笔"工作证明"的葡萄园，而这位圣人恰好还拥有属于自己的圣诞颂歌。

根据捷克传统，瓦茨拉夫公爵在十世纪初创建并亲自耕种了布拉格城堡下这片阳光充足的山坡，专门种植葡萄以酿造弥撒用的圣餐酒——这块小小的土地，也因此与波希米亚基督教信仰乃至捷克国家的起源紧密相连。在克拉洛夫（Klárov）与鹿沟（Jelení příkop）之间这道岩石山脊上，这座葡萄园的命运数百年来几经兴衰，直到2008年9月——瓦茨拉夫诞辰1100周年之际——经过精心修复后重新向公众开放。如今，这片不到四分之一公顷的黑皮诺与雷司令葡萄园每年出产约1200瓶酒——按葡萄酒产业的标准这几乎是个舍入误差，但这恰恰就是它存在的意义。

葡萄园中央矗立着里希特别墅（Villa Richter），这座新古典主义建筑由建筑师约瑟夫·克莱门特·佩什卡（Josef Klement Peschka）于1832至1835年间建造，如今已改建为两家餐厅，外加一间藏有约700款葡萄酒的地下"美酒宝库"（Wine Tresor）。挑对时间坐在藤架露台上，你会看到布拉格城堡附近人流最少、也最上镜的一片屋顶景观。

🥚 彩蛋：瓦茨拉夫与葡萄酒的渊源并非后人添油加醋的民间传说——对于一位努力把基督教扎根于仍偏向异教信仰的波希米亚宫廷的公爵来说，弥撒用酒是件相当严肃的事情。自己种植葡萄，意味着能够自主掌控弥撒用酒的供应，而在那个年代，从外地稳定进口任何东西都既不便宜也不可靠。一千一百年后，这座葡萄园酿出的酒已经没有人需要用于礼拜仪式了——但这种延续性正是它的全部意义：同一片山坡，同一种作物，酒标上依旧写着同一位圣人的名字。`,
    },
  },
  {
    name: 'Sídliště Velká Ohrada',
    slug: 'sidliste-velka-ohrada',
    localizedNames: { cz: 'Sídliště Velká Ohrada', zh: '大欧赫拉达住宅区' },
    labels: ['communism', 'architecture'],
    coordinates: { lat: 50.03757391440223, lng: 14.339497028680896 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/S%C3%ADdli%C5%A1t%C4%9B_Velk%C3%A1_Ohrada',
    description: {
      en: `Brave adventurer, welcome to Sídliště Velká Ohrada! This is what happens when a Communist five-year plan runs straight through a revolution — construction started under one political system in 1988 and finished under a completely different one in 1998, and somehow the courtyard concept survived the changeover intact.

Velká Ohrada holds the distinction of being the last socialist housing estate built in Prague, planned to house roughly 13,000 residents in Prague 13's Stodůlky district. Unlike the endless straight rows of identical panel blocks that define most of Prague's socialist-era housing, architects Jan Bočan and Zdeněk Rothbauer designed something closer to a Renaissance palazzo turned inside out: nine square blocks of apartment buildings, each wrapped around its own inner courtyard, arranged together into one enormous square block, with streets and green space woven between them. It was, for the genre, an unusually deliberate attempt to build a neighbourhood rather than just stack up housing units.

Walk the streets here and you'll notice the names all belong to Czech physicians of the twentieth century — a quiet, unbureaucratic naming scheme in an estate whose construction straddled the fall of a regime that usually preferred street names honouring political ideology over individual professionals. Ten years on a building site, spanning a revolution, and the district still reads as a coherent, if slightly overbuilt, idea rather than a patchwork of leftovers.

🥚 Easter Egg: Prague 13's Jihozápadní Město (Southwest City) housing project was originally meant to be one sprawling, uniform network of estates stretching across the district. Velká Ohrada was the last piece built — and by the time construction crews got to it, the political system that commissioned the whole project no longer existed. The architects used the delay to their advantage, revising the original plan into something noticeably less monotonous than its older neighbours. It may be the only Prague housing estate that quietly benefited from its own government collapsing mid-construction.`,

      cz: `Statečný dobrodruhu, vítej na Sídlišti Velká Ohrada! Tohle se stane, když komunistický pětiletý plán projede rovnou skrz revoluci — výstavba začala v roce 1988 za jednoho politického systému a skončila v roce 1998 za úplně jiného, a koncept vnitřních dvorů tu přežil výměnu režimu bez úhony.

Velká Ohrada má tu čest být posledním socialistickým sídlištěm postaveným v Praze, naplánovaným pro zhruba 13 tisíc obyvatel v pražské čtvrti Stodůlky (Praha 13). Na rozdíl od nekonečných rovných řad identických panelových domů, které definují většinu pražské socialistické zástavby, navrhli architekti Jan Bočan a Zdeněk Rothbauer něco bližšího renesančnímu palazzu obrácenému naruby: devět čtvercových bloků bytových domů, každý obestavěný kolem vlastního vnitřního dvora, uspořádaných dohromady do jednoho obřího čtvercového celku, mezi nímž se proplétají ulice a zeleň. Na svůj žánr šlo o neobvykle promyšlený pokus postavit čtvrť, a ne jen navršit bytové jednotky.

Projdi se tu po ulicích a všimneš si, že všechny nesou jména českých lékařů dvacátého století — tichý, nepolitický způsob pojmenování na sídlišti, jehož výstavba přesně obkročmo přesáhla pád režimu, který obvykle preferoval názvy ulic ctící ideologii spíš než jednotlivé profesionály. Deset let na staveništi, které přečkalo revoluci, a čtvrť přesto dodnes působí jako ucelená, byť místy trochu přehuštěná myšlenka, ne jako záplata z pozůstatků.

🥚 Velikonoční vajíčko: Pražský projekt Jihozápadní Město měl původně být jednou rozlehlou, jednotnou sítí sídlišť táhnoucí se napříč čtvrtí. Velká Ohrada byla poslední postavenou částí — a než se k ní stavební čety dostaly, politický systém, který celý projekt zadal, už neexistoval. Architekti zpoždění využili ve svůj prospěch a původní plán přepracovali na něco znatelně méně monotónního než u starších sousedních sídlišť. Možná jde o jediné pražské sídliště, kterému tiše prospělo, že se mu uprostřed výstavby zhroutila vlastní vláda.`,

      zh: `勇敢的冒险家，欢迎来到大欧赫拉达住宅区（Sídliště Velká Ohrada）！当一个共产主义五年计划一路贯穿一场革命时，就会出现这样的结果——1988年在一种政治体制下开工，1998年却在一个完全不同的体制下完工，而中庭式的设计理念竟奇迹般地在政权更替中完好保留了下来。

大欧赫拉达是布拉格建造的最后一座社会主义住宅区，规划可容纳约1.3万名居民，位于布拉格13区的斯托杜尔基（Stodůlky）。与布拉格大多数社会主义时期住宅区那种一排排一模一样的板式楼房不同，建筑师扬·博昌（Jan Bočan）和兹德涅克·罗特鲍尔（Zdeněk Rothbauer）设计出了更接近"内外翻转的文艺复兴宫殿"的东西：九座方形公寓楼群，每一座都围绕着自己的内部庭院，彼此组合成一个巨大的方形整体，街道与绿地则在楼群之间穿插交织。对于这类建筑来说，这是一次异常用心的尝试——目标是建一个社区，而不只是堆砌住宅单元。

走在这里的街道上，你会注意到所有街名都取自二十世纪的捷克医生——在一个建设年代恰好横跨政权更迭的住宅区里，这是一种低调、不带官僚色彩的命名方式，而当年的政权通常更偏爱用意识形态而非具体的专业人士来命名街道。十年的工地岁月，横跨了一场革命，如今这片街区读起来依然是一个连贯的、虽然略显密集但完整的构想，而不是一堆零散拼凑的遗留物。

🥚 彩蛋：布拉格13区的"西南城"（Jihozápadní Město）住宅项目最初的设想，是横跨整个区域的一整片庞大而统一的住宅网络。大欧赫拉达是最后建成的一部分——而当施工队终于轮到它时，当初下令建造整个项目的那个政治体制已经不复存在。建筑师们把这次延误变成了优势，把原始规划修改得比周边那些更老的住宅区明显不那么单调乏味。这或许是布拉格唯一一个因为自己的政府在施工途中垮台，反而悄悄受益的住宅区。`,
    },
  },
  {
    name: 'House at the Minute',
    slug: 'dum-u-minuty',
    localizedNames: { cz: 'Dům U Minuty', zh: '明努蒂之家' },
    labels: ['historical', 'architecture'],
    coordinates: { lat: 50.08671651873242, lng: 14.419987344183797 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/D%C5%AFm_U_Minuty',
    description: {
      en: `Brave adventurer, welcome to the House at the Minute (Dům U Minuty)! Wedged directly beside the Astronomical Clock, this black-and-white Renaissance townhouse is easy to walk straight past while craning your neck at the clock's gears — which would be a shame, since its facade is basically a comic strip carved in plaster.

The house has late Gothic bones from the early fifteenth century, rebuilt in Renaissance style in the sixteenth, and covered — in two separate campaigns before 1600 and again before 1615 — in dense black-and-white sgraffito: hunting scenes, Adam and Eve, and the Roman legend of Gaius Mucius Scaevola calmly thrusting his hand into an open flame to prove a point to a hostile king. Baroque taste later found all this too busy and had it whitewashed over; a 1920s restoration scraped the plaster back off and gave Prague its comic strip back.

Franz Kafka lived here with his family from 1889 to 1896, and all three of his sisters were born within these walls — making it, alongside the more famous Kafka sites across the river, one of the quieter stops on any Kafka pilgrimage through Prague, hiding in plain sight on the busiest square in the city.

🥚 Easter Egg: Before 1712 this building was called "At the White Lion," and its current name has at least four competing origin stories, none of them fully agreed on by historians: a shop selling finely minced ("minuciózní") tobacco, an Italian owner who kept muttering "un minuto," cigarettes that supposedly burned for exactly sixty seconds — and, the best one, a tobacco business run by descendants of Peter Minuit, the Dutch colonial official who purchased the island of Manhattan from the Lenape in 1626. Nobody can prove the Manhattan connection. Everybody enjoys repeating it anyway.`,

      cz: `Statečný dobrodruhu, vítej v Domě U Minuty! Přitisknutý hned vedle Staroměstského orloje, tenhle černobílý renesanční měšťanský dům snadno minete, zatímco vytahujete krk na orlojní soukolí — což by byla škoda, protože jeho fasáda je v podstatě komiks vyrytý do omítky.

Dům má pozdně gotické základy z počátku patnáctého století, v šestnáctém byl přestavěn v renesančním stylu a ve dvou samostatných etapách — před rokem 1600 a znovu před rokem 1615 — pokryt hustým černobílým sgrafitem: loveckými výjevy, Adamem a Evou i římskou legendou o Gaiu Muciovi Scaevolovi, který klidně strčí ruku do otevřeného ohně, aby dokázal svou pevnost nepřátelskému králi. Barokní vkus později shledal tohle vše příliš rušivé a nechal to přebílit; restaurování ve 20. letech 20. století omítku znovu odkrylo a vrátilo Praze její komiks.

Franz Kafka tu se svou rodinou žil v letech 1889 až 1896 a v těchto zdech se narodily všechny tři jeho sestry — díky čemuž je dům, vedle slavnějších kafkovských míst za řekou, jednou z tišších zastávek na kafkovské pouti Prahou, ukrytou zcela na očích na nejrušnějším náměstí ve městě.

🥚 Velikonoční vajíčko: Před rokem 1712 se tento dům jmenoval "U Bílého lva" a jeho současný název má nejméně čtyři soupeřící teorie původu, na nichž se historikové plně neshodli: obchod s jemně nakrájeným ("minuciózním") tabákem, italský majitel, který si pořád mumlal "un minuto", cigarety, které údajně hořely přesně šedesát sekund — a nejlepší z verzí, tabáková firma vedená potomky Petera Minuita, nizozemského koloniálního úředníka, který v roce 1626 koupil ostrov Manhattan od indiánů kmene Lenape. Souvislost s Manhattanem nikdo neumí dokázat. Všichni ji ale rádi opakují.`,

      zh: `勇敢的冒险家，欢迎来到明努蒂之家（Dům U Minuty）！它紧贴在天文钟旁边，这栋黑白相间的文艺复兴式市民住宅很容易被匆匆路过——因为大家的脖子都仰起来在看天文钟的齿轮转动——但错过它实在可惜，因为它的立面基本上就是一幅刻在灰泥上的连环漫画。

这栋房子拥有十五世纪初的晚期哥特式骨架，十六世纪被改建成文艺复兴风格，并在1600年之前和1615年之前分两个阶段，覆盖上了密密麻麻的黑白刮画（sgraffito）装饰：狩猎场景、亚当与夏娃，还有古罗马传说中盖乌斯·穆西乌斯·斯凯沃拉（Gaius Mucius Scaevola）面不改色地把手伸进熊熊火焰、向敌国国王证明自己意志的故事。后来的巴洛克审美觉得这一切太过繁复花哨，便将其粉刷覆盖；直到20世纪20年代的一次修复，才把灰泥重新刮开，把这幅"漫画"还给了布拉格。

弗兰茨·卡夫卡（Franz Kafka）1889年至1896年间与家人在此居住，他的三个妹妹也都出生在这几堵墙内——这让这栋房子，比起河对岸那些更著名的卡夫卡故居，成为布拉格"卡夫卡朝圣之旅"上更安静的一站，就那样堂而皇之地藏在这座城市最繁忙的广场上。

🥚 彩蛋：1712年之前，这栋房子的名字是"白狮之家"，而它现在的名字至少有四种相互竞争的起源说法，历史学家至今没有定论：一说是这里曾开过一家卖精细切碎（"minuciózní"）烟丝的烟草店；一说是一位意大利业主总是嘟囔着"un minuto"（意大利语"一分钟"）；一说是这里卖的香烟据说正好燃烧六十秒；而最精彩的一种说法则是，这里的烟草生意由彼得·米努伊特（Peter Minuit）的后代经营——就是那位1626年从莱纳佩人手中"购得"曼哈顿岛的荷兰殖民地官员。没有人能证实这段"曼哈顿渊源"，但所有人都乐于一再复述它。`,
    },
  },
  {
    name: 'Panorama Hotel',
    slug: 'panorama-hotel',
    localizedNames: { cz: 'Hotel Panorama', zh: '全景酒店' },
    labels: ['communism', 'architecture'],
    coordinates: { lat: 50.04932923361488, lng: 14.438122792418858 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Hotel_Panorama',
    description: {
      en: `Brave adventurer, welcome to the Panorama Hotel! Twenty-four floors of unapologetic late-Communist concrete rising over the Pankrác skyline — built by a regime that officially disapproved of capitalist luxury while very enthusiastically building hotels to house the capitalists visiting to spend hard currency in it.

Construction ran from 1979 to 1983, making the Panorama the second high-rise to appear on Pankrác Plain after the 104-metre Motokov building went up in 1977. At 79 metres and 24 storeys, architects Alois Semela and Vlado Alujević gave Prague one more entry in a very specific Cold War building category: the international-standard hotel, engineered to reassure Western business travellers and diplomats that Czechoslovakia could offer the same amenities as anywhere else — provided you didn't look too closely at where the money and the construction materials were actually coming from.

Hotels like this one were never really about hospitality; they were foreign-currency machines, built to a design brief straight out of a five-year plan and often staffed with more surveillance than a border checkpoint. Rooms tended to be watched, phones tended to be tapped, and the panoramic views the hotel was named for came with the faint suspicion that someone in a back office might be enjoying the same view of you.

🥚 Easter Egg: By the mid-1980s, Brutalist high-rises like the Panorama had become the default architectural language for anything in Czechoslovakia meant to face outward — hotels, trade fair halls, foreign trade organisation headquarters — because raw concrete read internationally as modern and unmistakably present-tense, which was precisely the image a regime eager for hard currency wanted to project to the visitors it was simultaneously watching.`,

      cz: `Statečný dobrodruhu, vítej v Hotelu Panorama! Čtyřiadvacet pater neomluvně pozdně komunistického betonu tyčícího se nad panorama Pankráce — postavené režimem, který oficiálně odsuzoval kapitalistický luxus, ale velmi nadšeně stavěl hotely, kde tento luxus mohli utrácet kapitalisté přijíždějící do země s tvrdou měnou v kapse.

Výstavba probíhala v letech 1979 až 1983, čímž se Panorama stala druhou výškovou budovou na Pankrácké pláni po 104metrovém Motokově, dokončeném v roce 1977. S výškou 79 metrů a čtyřiadvaceti patry dali architekti Alois Semela a Vlado Alujević Praze další exemplář velmi specifické stavební kategorie studené války: hotelu mezinárodního standardu, navrženého tak, aby ujistil západní obchodníky a diplomaty, že Československo umí nabídnout stejný komfort jako kdekoli jinde — pokud se člověk příliš nezajímal o to, odkud skutečně pocházely peníze a stavební materiál.

Hotely tohoto typu nikdy nešlo primárně o pohostinnost; byly to stroje na tvrdou měnu, postavené podle zadání přímo z pětiletého plánu a často obsazené větším množstvím sledovacích zařízení než hraniční přechod. Pokoje bývaly odposlouchávány, telefony napíchnuty, a panoramatický výhled, po němž je hotel pojmenován, přicházel s lehkým podezřením, že někdo v zadní kanceláři si možná právě v tu chvíli užívá stejný výhled — na vás.

🥚 Velikonoční vajíčko: V polovině 80. let se brutalistní výškové budovy jako Panorama staly standardním architektonickým jazykem pro cokoli v Československu určeného navenek — hotely, výstavní haly, sídla podniků zahraničního obchodu — protože holý beton působil mezinárodně moderně a nezpochybnitelně soudobě, což byl přesně ten obraz, který chtěl režim toužící po tvrdé měně vyslat návštěvníkům, jež zároveň nespouštěl z očí.`,

      zh: `勇敢的冒险家，欢迎来到全景酒店（Panorama Hotel）！二十四层毫不掩饰的晚期共产主义混凝土建筑，高高耸立在潘克拉茨（Pankrác）的天际线上——这是一个官方谴责资本主义奢侈的政权，却极其热衷于建造酒店，专门供那些带着硬通货前来消费的"资本家"入住。

酒店建于1979年至1983年，是继1977年建成的104米高莫托科夫大楼（Motokov）之后，潘克拉茨高地上的第二座高层建筑。建筑师阿洛伊斯·塞梅拉（Alois Semela）与弗拉多·阿卢耶维奇（Vlado Alujević）设计了这座高79米、共24层的建筑，为布拉格增添了冷战时期一种极为特定的建筑类型："国际标准酒店"——它的设计初衷是要让西方商务人士和外交官相信，捷克斯洛伐克能提供不逊于世界任何地方的接待水准，前提是你别太深究这些钱和建材究竟从哪儿来。

这类酒店从来都不是真正为了待客之道而存在，它们本质上是外汇机器，按照五年计划里的设计任务书建造，配备的监控设备往往比边境口岸还要密集。客房常被监听，电话常被窃听，而这座酒店赖以得名的全景视野，也总带着一丝隐隐的疑虑——某个后台办公室里的某个人，此刻或许正欣赏着同样的风景，只不过看的是你。

🥚 彩蛋：到20世纪80年代中期，像全景酒店这样的粗野主义高层建筑，已经成为捷克斯洛伐克一切"对外形象工程"的默认建筑语言——酒店、展览馆、对外贸易机构总部，无一例外。因为裸露的混凝土在国际上读起来就是"现代"且毫无疑问的"当下"，而这正是一个渴求硬通货的政权，想要展现给那些访客——同时也在被自己暗中监视着的访客——的形象。`,
    },
  },
  {
    name: 'Statue of Přemysl and Libuše',
    slug: 'sousosi-premysl-a-libuse',
    localizedNames: { cz: 'Sousoší Přemysl a Libuše', zh: '普热米斯尔与莉布谢雕像群' },
    labels: ['monument', 'historical'],
    coordinates: { lat: 50.06404393315454, lng: 14.41743619035803 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Libu%C5%A1e_and_P%C5%99emysl',
    description: {
      en: `Brave adventurer, welcome to the Statue of Přemysl and Libuše! Two nineteenth-century bronze giants stand here reenacting an origin myth roughly a thousand years older than the bronze itself — proof that Czechs have been telling this particular founding story, in one medium or another, for a very long time.

According to legend, the wise and unmarried princess Libuše ruled Bohemia from Vyšehrad and, faced with nobles demanding she take a husband, had a vision: her horse would find him. The animal walked off alone, crossed the countryside, and stopped in front of a humble ploughman working a field with two oxen and an iron plough. His name was Přemysl — "the thoughtful one" — and Libuše's messengers brought him back to Vyšehrad to become her consort and found the Přemyslid dynasty, which would go on to rule Bohemia for the next four centuries. Libuše herself is credited with an even bigger prophecy: standing on this same rocky spur, she is said to have foreseen a great city rising on the river below, "whose glory will touch the stars" — Prague, essentially predicting its own greatness before a single stone was laid.

Sculptor Josef Václav Myslbek carved this pair, along with three other legendary Bohemian couples, between 1889 and 1897 for the four corners of the newly built Palacký Bridge. The group survived barely half a century there before American bombers, aiming for a nearby factory on 14 February 1945, hit central Prague by mistake and badly damaged several of the statues. All four groups were removed from the bridge in 1948 during reconstruction and relocated to Vyšehrad's gardens for safekeeping — but the Přemysl and Libuše you see today isn't quite the original: the bombing damage was judged beyond repair, and what stands here now is a faithful copy, installed in July 1977.

🥚 Easter Egg: There's a quiet irony in a Communist government installing a fresh copy of Bohemia's founding myth in 1977 — a story fundamentally about legitimate hereditary rule and prophetic monarchy, reinstalled by a regime with famously little patience for either concept. History apparently didn't mind the contradiction, and neither did the sculpture: it's been standing on Vyšehrad, gazing out over the same river Libuše supposedly prophesied about, for nearly fifty years now.`,

      cz: `Statečný dobrodruhu, vítej u Sousoší Přemysla a Libuše! Dva devatenáctistoletí bronzoví obři tu znovu sehrávají zakladatelský mýtus zhruba o tisíc let starší než samotný bronz — důkaz, že Češi vyprávějí právě tenhle příběh o svém vzniku, v tom či onom médiu, už opravdu dlouho.

Podle pověsti vládla moudrá a neprovdaná kněžna Libuše Čechám z Vyšehradu a tváří v tvář velmožům, kteří žádali, aby si vzala muže, dostala vidění: její kůň jej najde sám. Zvíře se vydalo samo, přešlo krajinu a zastavilo se před skromným oráčem, který obdělával pole se dvěma voly a železným pluhem. Jmenoval se Přemysl — "ten přemýšlivý" — a Libušini poslové jej přivedli zpět na Vyšehrad, aby se stal jejím chotěm a založil přemyslovskou dynastii, jež pak vládla Čechám další čtyři století. Samotné Libuši se navíc připisuje ještě větší proroctví: prý stála přesně na tomto skalnatém výběžku a spatřila velké město, které jednou vyroste na řece pod ní, "jehož sláva se hvězd bude dotýkat" — Prahu, jejíž velikost tak v podstatě předpověděla dřív, než byl položen jediný kámen.

Sochař Josef Václav Myslbek vytesal tento pár, spolu s dalšími třemi legendárními českými dvojicemi, mezi lety 1889 a 1897 pro čtyři rohy tehdy nově postaveného Palackého mostu. Sousoší tam vydrželo sotva půl století, než americké bombardéry, mířící 14. února 1945 na nedalekou továrnu, omylem zasáhly centrum Prahy a několik soch vážně poškodily. Všechny čtyři skupiny byly z mostu odstraněny v roce 1948 při jeho rekonstrukci a přesunuty do vyšehradských sadů, aby byly v bezpečí — ale Přemysl a Libuše, které vidíš dnes, nejsou tak úplně originál: poškození bombardováním bylo posouzeno jako neopravitelné, a to, co tu stojí nyní, je věrná kopie instalovaná v červenci 1977.

🥚 Velikonoční vajíčko: Je v tom tichá ironie — komunistická vláda instalovala v roce 1977 novou kopii zakladatelského mýtu Čech, příběhu v jádru o legitimní dědičné vládě a prorocké monarchii, a udělal to režim, který byl pověstný svou nulovou trpělivostí k oběma pojmům. Dějinám ten rozpor zjevně nevadil, a soše taky ne: stojí na Vyšehradě a hledí na stejnou řeku, o níž Libuše údajně prorokovala, už skoro padesát let.`,

      zh: `勇敢的冒险家，欢迎来到普热米斯尔与莉布谢雕像群（Sousoší Přemysl a Libuše）！这两尊十九世纪的青铜巨像，在这里重新演绎着一个比青铜本身早了大约一千年的建国神话——足以证明，捷克人用各种媒介反复讲述这同一个起源故事，已经讲了很久很久。

传说中，聪慧而未婚的莉布谢公主曾从维谢赫拉德统治整个波希米亚。面对贵族们要求她成婚的压力，她得到了一个启示：她的马会自己找到那个人。那匹马独自离开，穿越乡野，最终停在一位正用两头牛和一把铁犁耕地的普通农夫面前。他名叫普热米斯尔（Přemysl）——意为"深思之人"——莉布谢的使者将他带回维谢赫拉德，他从此成为她的配偶，并开创了普热米斯尔王朝，此后统治波希米亚长达四个世纪。莉布谢本人还留下了一个更宏大的预言：据说她就站在这同一处岩石山脊上，预见到脚下这条河边将崛起一座伟大的城市，"其荣耀将触及星辰"——那便是布拉格，等于是在第一块石头落地之前，就预言了这座城市未来的辉煌。

雕塑家约瑟夫·瓦茨拉夫·米斯尔贝克（Josef Václav Myslbek）在1889年至1897年间，为当时新建的帕拉茨基大桥（Palacký Bridge）的四个桥头雕刻了这对雕像，连同另外三对波希米亚传说中的情侣雕像组。这组雕像在桥上只矗立了不到半个世纪，1945年2月14日，美军轰炸机原本瞄准附近一座工厂，却误炸了布拉格市中心，好几组雕像因此严重受损。1948年桥梁重建时，全部四组雕像都被移走，转移到维谢赫拉德花园中妥善安置——但你今天看到的这尊普热米斯尔与莉布谢，并非完全是原作：轰炸造成的损毁被判定为无法修复，如今立在这里的，是1977年7月安装的一尊忠实复制品。

🥚 彩蛋：这里藏着一丝安静的讽刺——1977年，一个共产主义政权重新安装了这座波希米亚建国神话的复制品，而这个故事的核心恰恰是关于合法世袭统治与预言式君权，出自一个对这两个概念都出了名毫无耐心的政权之手。历史显然并不在意这种矛盾，雕像本身似乎也不在意：将近五十年来，它一直立在维谢赫拉德，眺望着莉布谢当年据说曾预言过的那条同一条河流。`,
    },
  },
  {
    name: 'St. Nicholas Bell Tower',
    slug: 'svatomikulasska-zvonice',
    localizedNames: { cz: 'Svatomikulášská městská zvonice', zh: '圣尼古拉市政钟楼' },
    labels: ['tower', 'historical'],
    coordinates: { lat: 50.08780470565001, lng: 14.403639252376404 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to St. Nicholas Bell Tower! Climb high enough and you get a panoramic view over Malá Strana's red rooftops — the exact same view a Communist secret policeman used to get paid to sit and stare at for entire shifts, just with considerably better company.

Built in 1755–56 alongside the Baroque church of St. Nicholas but functioning as its own separate municipal structure, this was for a long stretch the last operating town crier's tower in Prague — a fire watchman's post, keeping an eye on the tightly packed wooden roofs of Malá Strana for the first sign of smoke, long before anyone thought to worry about anything more political than an open flame.

That changed decisively in the 1960s, when the Communist secret police — the StB — installed an observation post near the top of the tower, disguised behind an innocuous cover story, and used it for two full decades to watch the Western embassies clustered around Malostranské Square, especially the American one directly across the square. Agents logged comings and goings, photographed visitors, and quietly built files on anyone who caught their interest, all from a fire-watch tower nobody suspected of doing anything but watching for smoke.

🥚 Easter Egg: Prague once had roughly seventy of these hidden StB observation posts scattered across the city, disguised inside attics, church towers, and apartment blocks. After the Velvet Revolution in 1989, almost every one of them was stripped out, destroyed, or simply forgotten. The lookout at St. Nicholas is the only one known to have survived completely intact — furniture, equipment, and all — making this Baroque fire tower, almost by accident, the single best-preserved piece of Cold War surveillance architecture left standing anywhere in the city.`,

      cz: `Statečný dobrodruhu, vítej ve Svatomikulášské zvonici! Vyšplhej dostatečně vysoko a dostaneš panoramatický výhled na červené střechy Malé Strany — přesně ten samý výhled, za jehož sledování byl kdysi placený komunistický tajný policista, jen ty budeš mít mnohem lepší společnost.

Zvonice byla postavena v letech 1755–56 vedle barokního kostela sv. Mikuláše, ale funguje jako samostatná městská stavba, a dlouhou dobu byla poslední fungující ponocnou věží v Praze — stanovištěm požárního hlídače, který sledoval hustě natěsnané dřevěné střechy Malé Strany kvůli prvnímu náznaku kouře, dávno předtím, než někoho napadlo obávat se něčeho politicky nebezpečnějšího než otevřeného ohně.

To se zásadně změnilo v 60. letech, kdy komunistická tajná policie (StB) zřídila blízko vrcholu věže pozorovací stanoviště, zamaskované neškodnou legendou, a dvě celé dekády jej využívala ke sledování západních velvyslanectví shromážděných kolem Malostranského náměstí, zejména amerického, které stálo přímo naproti přes náměstí. Agenti si zapisovali příchody a odchody, fotografovali návštěvníky a v tichosti zakládali spisy na kohokoli, kdo je zaujal — a to vše z požární věže, o níž nikdo netušil, že dělá cokoli jiného než hlídání kouře.

🥚 Velikonoční vajíčko: Praha měla kdysi zhruba sedmdesát podobných skrytých pozorovacích stanovišť StB roztroušených po celém městě, ukrytých na půdách, v kostelních věžích a v bytových domech. Po sametové revoluci v roce 1989 byla téměř všechna vyklizena, zničena, nebo prostě zapomenuta. Stanoviště u sv. Mikuláše je jediné známé, které se dochovalo zcela neporušené — včetně nábytku a vybavení — díky čemuž se tahle barokní požární věž takřka náhodou stala nejlépe dochovanou památkou studenoválečné sledovací architektury, jaká ve městě zůstala stát.`,

      zh: `勇敢的冒险家，欢迎来到圣尼古拉市政钟楼！只要爬得够高，你就能俯瞰小城区（Malá Strana）一片红色屋顶的全景——这正是当年一名共产主义秘密警察领工资盯着看一整个班次的那片风景，只不过你会有好得多的陪伴。

这座钟楼建于1755至1756年间，紧邻巴洛克式的圣尼古拉教堂，但作为一座独立的市政建筑运作，在很长一段时间里，它是布拉格最后一座仍在运作的更夫塔——一个消防瞭望哨，专门盯着小城区密密麻麻的木质屋顶，留意第一缕烟雾的出现，那时候人们担心的政治风险，还远没有比一场明火更严重的东西。

这一切在20世纪60年代发生了决定性的转变：捷克斯洛伐克的秘密警察（StB）在钟楼顶部附近设立了一处伪装成无害用途的观察哨，并用整整二十年的时间，监视聚集在小城广场（Malostranské náměstí）周围的西方使馆，尤其是广场正对面的美国大使馆。特工们记录人员的往来，为访客拍照，悄悄为任何引起他们兴趣的人建立档案——而这一切，都发生在一座谁也没怀疑过、除了盯着烟雾之外还会做别的事的消防瞭望塔里。

🥚 彩蛋：布拉格曾经在全城散布着大约七十处这样隐蔽的StB观察哨，分别伪装藏身在阁楼、教堂钟楼和公寓楼里。1989年天鹅绒革命之后，几乎所有这些观察哨都被拆除、销毁，或干脆被遗忘。圣尼古拉钟楼里的这一处，是目前已知唯一完整保存下来的一处——家具、设备一应俱全——这几乎是阴差阳错地，让这座巴洛克消防塔成为了这座城市里保存最完好的冷战监视建筑遗迹。`,
    },
  },
  {
    name: 'Statue of Jesus Christ Carrying the Cross',
    slug: 'socha-jezise-krista-petrin',
    localizedNames: { cz: 'Socha Ježíše Krista na kříži', zh: '耶稣背十字架像' },
    labels: ['monument', 'historical'],
    coordinates: { lat: 50.08431108018582, lng: 14.391198276421784 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Statue of Jesus Christ Carrying the Cross! Tucked into the slope of the Great Strahov Garden, this weathered Baroque figure has been quietly shouldering his cross since 1746 — with only a fourteenth-century famine wall and a scatter of fruit trees for company, and almost no one stopping to notice.

The statue itself is a modest two-part affair: a rectangular stone base topped by a polygonal shaft, with the figure of Christ carrying his cross set above a simple overhanging cornice. Nothing about it announces itself — no plaque with a sculptor's name, no dramatic setting, just a devotional marker of the kind that once dotted monastery orchards and vineyards across Bohemia by the hundreds. Most of those vanished centuries ago. This one didn't.

It stands within sight of Petřín's Hladová zeď — the "Hunger Wall" — a limestone fortification Charles IV had built in 1360–62, according to enduring local legend, as a make-work project to feed the poor during a famine. Whether or not that story is strictly accurate, the wall and the statue have shared this hillside for centuries, one built to keep hungry Praguers employed, the other built to give them somewhere to pray.

🥚 Easter Egg: The inscription on the back of the pedestal records a 1936 restoration — but it's written in German, not Czech: "renoviert 1936." In interwar Prague, a mixed Czech-German city with German-speaking craftsmen and patrons still active in restoration work, this kind of bilingual paper trail on stonework wasn't unusual. It's a small, easy-to-miss reminder that Prague's history isn't only cathedrals and kings — it's also whoever happened to hold the chisel in any given decade.`,

      cz: `Statečný dobrodruhu, vítej u Sochy Ježíše Krista na kříži! Zasazená do svahu Velké Strahovské zahrady, tahle zvětralá barokní socha nese svůj kříž tiše už od roku 1746 — se čtrnáctistoletou hladomornou zdí a hrstkou ovocných stromů coby jedinou společností, a téměř nikým, kdo by se zastavil a všiml si jí.

Socha samotná je skromná dvoudílná záležitost: obdélníkový kamenný podstavec zakončený mnohobokým dříkem, na němž nad jednoduchou převislou římsou stojí postava Krista nesoucího svůj kříž. Nic na ní na sebe neupozorňuje — žádná cedulka se jménem sochaře, žádné dramatické umístění, jen zbožný ukazatel toho druhu, jaký kdysi po stovkách lemoval klášterní sady a vinice po celých Čechách. Většina z nich zmizela už před staletími. Tahle nezmizela.

Stojí na dohled od petřínské Hladové zdi — opevnění, které nechal podle přetrvávající místní legendy postavit Karel IV. v letech 1360–1362 jako projekt na obživu chudých během hladomoru. Ať už je ten příběh přesně pravdivý, nebo ne, zeď a socha sdílejí tenhle svah po staletí — jedna postavená proto, aby dala hladovým Pražanům práci, druhá proto, aby jim dala místo k modlitbě.

🥚 Velikonoční vajíčko: Nápis na zadní straně podstavce zaznamenává opravu z roku 1936 — ale je napsaný německy, ne česky: "renoviert 1936". V meziválečné Praze, smíšeném česko-německém městě, kde v restaurátorské práci stále působili německy mluvící řemeslníci a mecenáši, nebyla taková dvojjazyčná stopa na kamenné práci ničím neobvyklým. Je to malá, snadno přehlédnutelná připomínka, že pražské dějiny nejsou jen katedrály a králové — jsou to i lidé, kteří zrovna v tom kterém desetiletí drželi dláto.`,

      zh: `勇敢的冒险家，欢迎来到耶稣背十字架像！这尊风化斑驳的巴洛克雕像，安静地坐落在斯特拉霍夫大花园（Velká Strahovská zahrada）的山坡上，自1746年起便一直默默背负着自己的十字架——陪伴它的只有一堵十四世纪的"饥饿之墙"和几棵果树，几乎没有人会停下脚步注意到它。

这尊雕像本身十分朴素，分为两部分：一个矩形石质基座之上立着一根多边形石柱，柱身上方越过一道简单的挑出檐口，便是背负十字架的基督像。它没有任何张扬之处——没有刻着雕塑家姓名的铭牌，没有戏剧化的场景布置，只是曾经数以百计、遍布波希米亚各地修道院果园与葡萄园的那种虔诚路标之一。这类雕像大多在几个世纪前就已经消失，唯独这一尊留了下来。

它就矗立在佩特任山"饥饿之墙"（Hladová zeď）的视线范围之内——那是查理四世据一则流传已久的地方传说，于1360至1362年间下令修建的一道石灰岩防御工事，目的是在饥荒时期为穷人提供以工代赈的工作机会。无论这个传说是否完全属实，这堵墙与这尊雕像已经共享这片山坡数百年——一个是为了让饥饿的布拉格人有活可干而建，另一个则是为了给他们一个可以祈祷的地方而立。

🥚 彩蛋：基座背面刻着一次1936年修复的铭文——但它不是用捷克语写的，而是德语："renoviert 1936"（1936年修复）。在两次世界大战之间那个捷克语与德语混杂的布拉格，说德语的工匠和赞助人依然活跃在文物修复工作中，石刻上留下这样的双语痕迹并不稀奇。这是一个很小、很容易被忽略的提醒：布拉格的历史不只是大教堂和国王，也包括不论哪个年代，恰好手握凿子的那个人。`,
    },
  },
  {
    name: 'Chapel of the Infant Jesus',
    slug: 'kaple-jezulatka-petrin',
    localizedNames: { cz: 'Kaple Jezulátka (Seminářská zahrada)', zh: '耶稣圣婴小教堂（神学院花园）' },
    labels: ['church', 'hidden-gem'],
    coordinates: { lat: 50.0848985224419, lng: 14.39970804315097 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Chapel of the Infant Jesus! Prague's most famous religious souvenir — the tiny wax-and-wood statue known worldwide as the Infant Jesus of Prague — has an entire church a short walk from here. This is its quieter, half-forgotten cousin: an oval Baroque chapel hidden inside a public garden, dedicated to the very same devotion, visited by almost nobody.

The chapel belonged to the Discalced Carmelite monastery of Malá Strana — the same order that has cared for the world-famous Infant Jesus statue in the nearby Church of Our Lady Victorious since 1628. The friars held this garden on Petřín's slope from the first half of the seventeenth century, and built this small oval-plan chapel here, believed to date from the first half of the eighteenth century, as a quieter, private counterpart to the grand pilgrimage devotion happening just down the hillside. For a long stretch of the twentieth century it sat neglected inside what had become a public park; a restoration completed after 2005 finally gave it back some of its shape.

Today it stands inside Seminářská zahrada — the Seminary Garden — a former orchard belonging to Prague's archiepiscopal seminary that now functions as one of Petřín's quieter public green spaces, all sloped lawns, fruit trees, and views back toward the castle. Most visitors climb straight past on their way to the funicular or the lookout tower, never noticing the small oval chapel tucked into the hillside just off the path.

🥚 Easter Egg: The statue that made this devotion world-famous — the original Infant Jesus of Prague — has its own extensive wardrobe. It's dressed in a rotating collection of tiny robes, donated from countries around the world and changed according to the liturgical calendar, with new outfits added by devotees to this day. This little garden chapel doesn't get robes or crowds, but it's dedicated to exactly the same small figure — proof that even Prague's most globally famous devotion has a quiet, overlooked branch office just up the hill.`,

      cz: `Statečný dobrodruhu, vítej v Kapli Jezulátka! Nejslavnější pražský náboženský suvenýr — drobná vosková a dřevěná soška známá po celém světě jako Pražské Jezulátko — má vlastní kostel jen kousek odsud. Tohle je jeho tišší, napůl zapomenutý příbuzný: oválná barokní kaplička ukrytá uvnitř veřejné zahrady, zasvěcená přesně stejné úctě, kterou dnes navštěvuje téměř nikdo.

Kaple patřila malostranskému klášteru bosých karmelitánů — témuž řádu, který od roku 1628 pečuje o světoznámou sošku Jezulátka v nedalekém kostele Panny Marie Vítězné. Řeholníci drželi tuto zahradu na svahu Petřína od první poloviny 17. století a postavili tu tuto malou kapli oválného půdorysu, jež pravděpodobně pochází z první poloviny 18. století, jako tišší, soukromý protějšek k velké poutní úctě odehrávající se kousek níže po svahu. Po dlouhou část 20. století stála zanedbaná uvnitř toho, co se mezitím stalo veřejným parkem; restaurování dokončené po roce 2005 jí konečně vrátilo alespoň část její podoby.

Dnes stojí uvnitř Seminářské zahrady — bývalého sadu patřícího pražskému arcibiskupskému semináři, jenž dnes funguje jako jedno z tišších veřejných zelených míst na Petříně, samé svažité trávníky, ovocné stromy a výhledy zpět na hrad. Většina návštěvníků prochází rovnou kolem cestou k lanovce nebo rozhledně a malou oválnou kapličku zasazenou do svahu kousek od cesty si vůbec nevšimne.

🥚 Velikonoční vajíčko: Soška, která tuhle úctu proslavila po celém světě — originální Pražské Jezulátko — má vlastní rozsáhlý šatník. Obléká se do proměnlivé sbírky drobných roušek, darovaných ze zemí z celého světa a měněných podle liturgického kalendáře, a věřící do sbírky přidávají nové kousky dodnes. Tahle malá zahradní kaplička roušky ani davy nemá, ale je zasvěcená přesně téže drobné postavičce — důkaz, že i nejslavnější pražská úcta má svou tichou, přehlíženou pobočku kousek nahoru do kopce.`,

      zh: `勇敢的冒险家，欢迎来到耶稣圣婴小教堂！布拉格最著名的宗教纪念品——那尊闻名世界、用蜡与木雕成的"布拉格圣婴"（Infant Jesus of Prague）小塑像——就在不远处拥有一整座属于自己的教堂。而这里，则是它那位更安静、几乎被遗忘的"表亲"：一座藏在公共花园里的椭圆形巴洛克小教堂，供奉着完全相同的信仰对象，却几乎无人问津。

这座小教堂曾属于小城区的赤足加尔默罗会修道院——正是这个修道会，自1628年起一直守护着附近胜利圣母教堂里那尊举世闻名的圣婴像。修士们自十七世纪上半叶起便拥有佩特任山坡上的这片花园，并在此建造了这座椭圆平面的小教堂，据信建于十八世纪上半叶，作为山下那场盛大朝圣崇拜活动的一处安静、私密的对应场所。在二十世纪的很长一段时间里，它一直闲置在后来变成公共公园的这片土地里，直到2005年之后完成的一次修复，才让它重新找回了些许原貌。

如今它坐落在神学院花园（Seminářská zahrada）内——这里曾是布拉格总主教座堂神学院的果园，如今是佩特任山上较为幽静的公共绿地之一，满是坡地草坪、果树，以及回望城堡的视野。大多数游客只顾着赶往缆车站或观景塔，径直从旁边走过，从未留意到路边山坡上这座藏起来的小小椭圆教堂。

🥚 彩蛋：让这份信仰闻名世界的那尊塑像——布拉格圣婴的原始雕像——拥有一整套属于自己的、极为丰富的"衣柜"。信徒们为它准备了成百上千件来自世界各地的迷你法衣，依照礼仪年历轮换穿戴，直至今日仍不断有新的衣物被虔诚地献上。这座花园里的小教堂没有法衣，也没有人潮，但它供奉的正是同一尊小小的圣像——证明就连布拉格最具全球知名度的信仰，也有一处安静地、被人遗忘在山坡上的"分部"。`,
    },
  },
  {
    name: 'Chuchle Grove',
    slug: 'chuchelsky-haj',
    localizedNames: { cz: 'Chuchelský háj', zh: '胡赫莱树林' },
    labels: ['nature', 'hidden-gem'],
    coordinates: { lat: 50.02142481039513, lng: 14.383494796263 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Chuchle Grove (Chuchelský háj)! This is a proper forest — not a manicured park with mown grass and matching benches, but a steep, tangled nature reserve of oak and hornbeam clinging to limestone slopes above the Vltava, doing its very best impression of the countryside despite technically still being Prague.

Declared a nature reserve in 1982, the grove protects one of the last significant stretches of natural deciduous woodland inside Prague's city limits — oak, hornbeam, and lime trees rooted in limestone bedrock so rich in ancient sea fossils that nineteenth-century geologist Joachim Barrande (yes, the same one Barrandov is named after) spent decades combing this stretch of the Vltava valley for trilobites. The result is a forest floor unusually generous with lime-loving wildflowers that struggle to survive almost anywhere else in the city.

Follow the path downhill and the grove eventually spits you out near the Velká Chuchle racecourse and the crumbling arcades of the old Chuchle Spa — proof that this corner of Prague has spent the last two centuries alternating between horses, invalids taking the waters, and, apparently, nobody at all.

🥚 Easter Egg: Deep inside the grove sits a free, easy-to-miss mini-zoo — the Malá Chuchle wildlife rescue outpost — where mouflon, fallow deer, and the occasional lynx live in enclosures built from repurposed forest paths. It grew out of one local forest ranger's personal menagerie in the 1970s and only became official in October 1999, which means for nearly three decades this entire deer herd existed in a kind of bureaucratic footnote.`,

      cz: `Statečný dobrodruhu, vítej v Chuchelském háji! Tohle je opravdový les — žádný upravený park s posekaným trávníkem a řadou stejných laviček, ale strmá, spletitá přírodní rezervace dubů a habrů, které se drží vápencových svahů nad Vltavou a dělají, co můžou, aby vypadaly jako venkov, i když jde technicky vzato pořád o Prahu.

Chuchelský háj byl vyhlášen přírodní rezervací v roce 1982 a chrání jeden z posledních větších souvislých úseků přirozeného listnatého lesa v hranicích Prahy — duby, habry a lípy zakořeněné ve vápencovém podloží tak bohatém na zkameněliny pravěkého moře, že devatenáctistoletý geolog Joachim Barrande (ano, ten, po kterém je pojmenován Barrandov) strávil desítky let procházením tohoto úseku vltavského údolí kvůli trilobitům. Výsledkem je lesní podrost neobvykle bohatý na vápnomilné druhy rostlin, které jinde ve městě sotva přežívají.

Pokud sejdete stezkou z kopce dolů, háj vás nakonec vyplivne poblíž dostihového závodiště ve Velké Chuchli a rozpadajících se arkád staré Chuchelské lázně — důkaz, že tenhle kout Prahy strávil poslední dvě staletí střídáním koní, pacientů léčících se vodou a zjevně i naprostým opuštěním.

🥚 Velikonoční vajíčko: Hluboko v háji se skrývá bezplatná, snadno přehlédnutelná mini zoo — záchranná stanice Zookoutek Malá Chuchle — kde žijí mufloni, daňci a příležitostně i rys ostrovid ve výbězích postavených z upravených lesních cestiček. Vznikla z neformálního chovu jednoho místního hajného v 70. letech a oficiálně vznikla až v říjnu 1999, což znamená, že celé toto stádo jelenů existovalo skoro tři desetiletí jako jakási byrokratická poznámka pod čarou.`,

      zh: `勇敢的冒险家，欢迎来到胡赫莱树林（Chuchelský háj）！这里可是一片名副其实的森林——不是那种修剪整齐、长椅成排的公园，而是一处陡峭、枝蔓交错的自然保护区，橡树与鹅耳枥沿着伏尔塔瓦河畔的石灰岩坡地生长，拼尽全力扮演着"乡野"的角色，尽管严格说来，这里依然是布拉格市区。

胡赫莱树林于1982年被列为自然保护区，保护着布拉格市界内为数不多、面积可观的天然阔叶林之一——橡树、鹅耳枥与椴树扎根于石灰岩基岩之中，这片基岩富含远古海洋化石，以至于十九世纪的地质学家约阿希姆·巴兰德（Joachim Barrande，没错，巴兰多夫〔Barrandov〕正是以他命名）花费数十年时间，在这段伏尔塔瓦河谷里搜寻三叶虫化石。这也造就了这片林地地表异常丰富的喜钙植物群落，在布拉格其他地方几乎难以存活。

沿着小径一路下坡，树林最终会把你"吐"到大胡赫莱（Velká Chuchle）赛马场附近，以及老胡赫莱温泉浴场那片已然破败的拱廊旁——证明布拉格的这个角落，过去两百年一直在赛马、疗养客与彻底的无人问津之间来回切换。

🥚 彩蛋：树林深处藏着一座免费、极易被忽略的迷你动物园——大胡赫莱野生动物救助站，欧洲盘羊、黇鹿，偶尔还有猞猁，都生活在由林间小径改造而成的围栏里。它最初只是上世纪70年代一位当地护林员的私人饲养，直到1999年10月才正式成立——也就是说，这整群鹿在近三十年里，一直只是某份官僚档案里被遗忘的一条脚注。`,
    },
  },
  {
    name: 'Na Knížecí Bus Terminal',
    slug: 'na-knizeci-bus-terminal',
    localizedNames: { cz: 'Autobusové nádraží Na Knížecí', zh: '克尼热齐巴士总站' },
    labels: ['transport'],
    coordinates: { lat: 50.068704396553905, lng: 14.404536736520281 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Na Knížecí Bus Terminal! Don't worry, this isn't a mistake in your quest log — a working bus station really has earned its own card, because in Prague even the place where regional buses idle between routes comes with a few centuries of backstory attached.

The name "Na Knížecí" — literally "at the prince's" — points back to a noble estate that once stood on this stretch of Smíchov before the district industrialized in the nineteenth century and filled up with breweries, workshops, and eventually the tram lines that made it one of Prague's busiest working-class suburbs. Today the aristocracy is long gone, replaced by regional and international coach services, but the terminal still sits right beside Anděl — one of Prague's biggest modern shopping and office hubs — making it the spot where entire tour groups, students, and commuters funnel in and out of the city every single day, largely unnoticed by anyone who isn't catching a bus.

🥚 Easter Egg: "Anděl" — Angel — the glossy shopping district next door, is itself named after a vanished Baroque house sign, "U Andělů" (At the Angels), that once marked a pharmacy on this very street. So this unglamorous bus terminal sits at the exact spot where Prague went, in a couple of centuries, from angels and dukes to bus timetables and shopping malls.`,

      cz: `Statečný dobrodruhu, vítej na autobusovém nádraží Na Knížecí! Neboj se, tohle není chyba v tvém seznamu úkolů — funkční autobusové nádraží si svou kartičku opravdu zaslouží, protože i místo, kde v Praze mezi jízdami postávají meziměstské autobusy, má za sebou pár staletí historie.

Název "Na Knížecí" — doslova "u knížecího" — odkazuje na šlechtické panství, které kdysi stávalo na tomto úseku Smíchova, než se čtvrť v devatenáctém století zprůmyslnila a zaplnila pivovary, dílnami a nakonec i tramvajovými linkami, díky nimž se stala jedním z nejrušnějších dělnických předměstí Prahy. Šlechta je dnes dávno pryč, nahradily ji regionální a mezinárodní autobusové linky, ale terminál pořád stojí hned vedle Anděla — jednoho z největších moderních nákupních a kancelářských center Prahy —, takže tudy denně proudí celé zájezdové skupiny, studenti i dojíždějící, aniž by si jich kdokoli jiný než čekající cestující vůbec všiml.

🥚 Velikonoční vajíčko: "Anděl", lesklá nákupní čtvrť hned vedle, je sama pojmenovaná po zaniklém barokním domovním znamení "U Andělů", které kdysi označovalo lékárnu přímo v této ulici. Tohle nenápadné autobusové nádraží tak stojí přesně na místě, kde se Praha za pár století proměnila z andělů a knížat na jízdní řády a nákupní centra.`,

      zh: `勇敢的冒险家，欢迎来到克尼热齐巴士总站（Na Knížecí）！别担心，这不是任务列表出错了——一座正常运营的巴士总站，确实配得上属于自己的一张卡片，因为在布拉格，就连长途客车临时停靠的地方，背后也拖着好几个世纪的故事。

"Na Knížecí"，字面意思是"在王公的地方"，指的是一座曾经坐落在这片斯米霍夫（Smíchov）土地上的贵族庄园——那是在十九世纪该区工业化、被啤酒厂、作坊乃至电车线路填满，最终成为布拉格最繁忙的工人阶层郊区之一之前的事。如今贵族早已远去，取而代之的是省际与国际长途客运班次，但这座总站依然紧邻安德尔（Anděl）——布拉格现代最大的购物与办公枢纽之一——因此每天都有整团的游客、学生与通勤者从这里涌入涌出这座城市，除了赶车的人，几乎没人会多看它一眼。

🥚 彩蛋：紧邻的那片光鲜购物区"安德尔"（Anděl，意为"天使"），其名字本身也源自一块早已消失的巴洛克式门牌标志"U Andělů"（天使之家），曾经标记着这条街上的一家药房。于是这座毫不起眼的巴士总站，恰好就坐落在布拉格几百年间从"天使与王公"走向"发车时刻表与购物中心"的那个交汇点上。`,
    },
  },
  {
    name: 'Barrandov Rocks (Silurian–Devonian Boundary)',
    slug: 'barrandovske-skaly',
    localizedNames: { cz: 'Barrandovské skály (Hranice silur-devon)', zh: '巴兰多夫岩层（志留纪-泥盆纪界线）' },
    labels: ['nature', 'hidden-gem'],
    coordinates: { lat: 50.03412230015572, lng: 14.401227225206561 },
    rarity: 'epic',
    xpReward: 50,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Barrandov Rocks (Barrandovské skály)! This unassuming limestone outcrop above the Vltava marks one of the most important addresses in the entire history of geology — the exact boundary between two whole periods of Earth's existence, hiding in plain sight beneath a district better known for movie studios.

Roughly 419 million years ago, the seabed that once covered this stretch of Bohemia shifted from the Silurian period into the Devonian, and the rock layers here recorded that transition with unusual clarity — clear enough that nineteenth-century geologist Joachim Barrande spent decades of his life studying the trilobites, cephalopods, and other marine fossils packed into these cliffs. His work was so thorough that the whole geological formation is now named "Barrandien" after him, and the district piled on top of it — Barrandov, with its film studios, bridge, and clifftop restaurant terraces — borrows his name too.

The site is protected today as a national natural monument, which sounds grand for what is, in practice, a quiet outcrop of grey rock most passers-by would walk straight past without a second glance. That, roughly, is the joke: one of the more scientifically significant few square metres in the country looks, to the untrained eye, exactly like a wall.

🥚 Easter Egg: Barrande wasn't even supposed to become Bohemia's most famous fossil hunter — he originally came to Prague in the 1830s as a tutor to the exiled French royal family, the Bourbons, and only got hooked on trilobites as a side project. The side project outlived the monarchy he was originally hired to serve by roughly two centuries and counting.`,

      cz: `Statečný dobrodruhu, vítej u Barrandovských skal! Tento nenápadný vápencový útvar nad Vltavou označuje jednu z nejdůležitějších adres v celých dějinách geologie — přesnou hranici mezi dvěma celými obdobími existence Země, ukrytou na očích všem pod čtvrtí, která je dnes známější díky filmovým ateliérům.

Zhruba před 419 miliony let se mořské dno, jež kdysi pokrývalo tento kus Čech, posunulo z období siluru do devonu, a horninové vrstvy zde tento přechod zaznamenaly s neobvyklou jasností — natolik jasně, že devatenáctistoletý geolog Joachim Barrande strávil desítky let svého života studiem trilobitů, hlavonožců a dalších mořských zkamenělin ukrytých v těchto skalách. Jeho práce byla tak důkladná, že se po něm dnes jmenuje celá geologická formace — "Barrandien" — a jméno si od něj vypůjčila i čtvrť, která na ní stojí: Barrandov, se svými filmovými ateliéry, mostem a restauračními terasami na útesu.

Lokalita je dnes chráněna jako národní přírodní památka, což zní honosně na to, že jde v praxi o tichý výchoz šedé skály, kolem něhož by většina kolemjdoucích prošla bez povšimnutí. V tom je zhruba ten vtip: pár vědecky nejvýznamnějších čtverečních metrů v celé zemi vypadá pro nezasvěcené oko úplně jako obyčejná zeď.

🥚 Velikonoční vajíčko: Barrande se vůbec neměl stát nejslavnějším lovcem zkamenělin v Čechách — do Prahy přišel ve 30. letech 19. století jako vychovatel exilové francouzské královské rodiny, Bourbonů, a na trilobity se upnul jen jako na vedlejší projekt. Tenhle vedlejší projekt přežil monarchii, které měl původně sloužit, o zhruba dvě staletí a stále přežívá.`,

      zh: `勇敢的冒险家，欢迎来到巴兰多夫岩层（Barrandovské skály）！这片伏尔塔瓦河畔看似平平无奇的石灰岩露头，标记着地质学史上最重要的"地址"之一——地球历史上两个完整地质时期之间的精确分界线，就这样大大方方地藏在一个如今更以电影制片厂闻名的城区之下。

大约在4.19亿年前，曾覆盖这片波希米亚土地的海床，从志留纪过渡到了泥盆纪，而这里的岩层以异常清晰的方式记录下了这次转变——清晰到十九世纪的地质学家约阿希姆·巴兰德（Joachim Barrande）为此投入了数十年时间，研究这些崖壁中富藏的三叶虫、头足类等海洋化石。他的研究之详尽，使得整个地质构造如今都以他命名为"巴兰迪安"（Barrandien），而坐落其上的城区——拥有电影制片厂、大桥与悬崖餐厅平台的巴兰多夫（Barrandov）——也借用了他的名字。

如今这处遗址被列为国家级自然保护纪念地，听起来颇为隆重，但实际上不过是一片安静的灰色岩壁，大多数路人经过时甚至不会多看一眼。这大概就是其中的妙处所在：这个国家科学意义最重大的几平方米之一，在外行人眼里看起来就是一堵普通的墙。

🥚 彩蛋：巴兰德原本压根不该成为波希米亚最著名的化石猎人——他在19世纪30年代来到布拉格，本是为了担任流亡中的法国波旁王室的家庭教师，追寻三叶虫只是他的一项"副业"。而这项副业存活的时间，比他最初受雇效力的那个王朝还要长上整整两个世纪，而且至今仍在延续。`,
    },
  },
  {
    name: 'Bastion of the Wayside Shrine',
    slug: 'bastion-u-bozich-muk',
    localizedNames: { cz: 'Bastion U Božích muk', zh: '路旁圣龛棱堡' },
    labels: ['historical', 'architecture'],
    coordinates: { lat: 50.06753329305644, lng: 14.425934584420554 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Bastion U Božích muk! Tucked into Vyšehrad's ring of star-shaped fortress walls, this squat brick bastion has one of the more melancholy names in the whole complex — "boží muka" means "wayside shrine," the small roadside crosses Czechs once built to mark a death, a miracle, or simply a place worth pausing at.

After the devastation of the Thirty Years' War exposed just how outdated Vyšehrad's medieval defences really were, the Habsburg military rebuilt the entire hilltop from the 1650s onward into a modern star-shaped fortress, ringed with angular brick bastions designed to give defenders clean lines of fire along every wall. This bastion took its name from a wayside shrine that stood nearby — one small, human-scale marker absorbed into a much larger piece of military engineering, the way old paths and shrines so often got quietly folded into new fortifications rather than erased by them.

Vyšehrad's guns, as it turned out, were never fired at an invading army — the fortress spent most of its working life as a garrison and, later, a barracks, before the walls were opened to the public as one of Prague's most atmospheric parks. The bastion today mostly guards nothing more threatening than a very good sunset view.

🥚 Easter Egg: Vyšehrad's fortress-builders were thorough enough to name almost every bastion individually — some after saints, some after commanding officers, and at least one, this one, after a small roadside cross that presumably nobody thought to ask permission from before building a military bastion directly on top of it.`,

      cz: `Statečný dobrodruhu, vítej u Bastionu U Božích muk! Zasazený do vyšehradského prstence hvězdicových hradeb má tento podsaditý cihlový bastion jedno z nejmelancholičtějších jmen v celém areálu — "boží muka" jsou drobné výklenkové kříže, které Češi kdysi stavěli na památku úmrtí, zázraku, nebo jen na místě, u kterého stálo za to se zastavit.

Poté, co třicetiletá válka bolestně odhalila, jak zastaralé je středověké opevnění Vyšehradu, začala habsburská armáda od 50. let 17. století přestavovat celý vrch na moderní hvězdicovou pevnost, obehnanou hranatými cihlovými bastiony navrženými tak, aby obráncům umožnily čistou palebnou linii podél celé hradby. Tento bastion dostal jméno po božích mukách, které stávaly poblíž — drobné, lidským měřítkem poznamenané znamení pohlcené mnohem větším kusem vojenského inženýrství, tak jak se staré cesty a boží muka do nových opevnění často tiše vsakovaly, místo aby byly zbourány.

Z vyšehradských děl se nakonec nikdy nevystřelilo na útočící armádu — pevnost strávila většinu své služby jako posádka a později kasárna, než byly hradby otevřeny veřejnosti jako jeden z nejatmosféričtějších pražských parků. Bastion dnes střeží nanejvýš opravdu povedený výhled na západ slunce.

🥚 Velikonoční vajíčko: Stavitelé vyšehradské pevnosti byli natolik důslední, že pojmenovali téměř každý bastion zvlášť — některé po svatých, jiné po velících důstojnících, a přinejmenším jeden, právě tenhle, po drobném výklenkovém kříži, kterého se zjevně nikdo neobtěžoval zeptat na souhlas, než mu na hlavu postavili vojenský bastion.`,

      zh: `勇敢的冒险家，欢迎来到"路旁圣龛棱堡"（Bastion U Božích muk）！它坐落在维谢赫拉德（Vyšehrad）星形城墙环中，这座敦实的砖砌棱堡，在整个要塞群里拥有一个格外伤感的名字——"boží muka"意为"路旁圣龛"，是捷克人过去用来纪念死者、奇迹，或仅仅是标记某个值得驻足之处的小型路边十字架。

三十年战争的浩劫暴露出维谢赫拉德中世纪防御工事早已过时，哈布斯堡军方自17世纪50年代起，将整座山丘重建为一座现代星形要塞，四周环绕着棱角分明的砖砌棱堡，专为守军提供沿墙无死角的射界而设计。这座棱堡的名字，正来自附近一座路旁圣龛——一个人性化尺度的小小标记，就这样被吸纳进一项规模大得多的军事工程之中，正如古老的小径与圣龛常常被悄悄折叠进新的防御工事里，而不是被彻底抹去。

维谢赫拉德的大炮，到头来从未真正朝入侵的军队开过火——这座要塞大半个"职业生涯"都只是充当驻军营地，后来又变成兵营，直到城墙最终向公众开放，成为布拉格最富氛围感的公园之一。如今，这座棱堡守卫的至多不过是一处绝佳的日落景观。

🥚 彩蛋：维谢赫拉德要塞的建造者做事极为细致，几乎为每一座棱堡都单独命名——有的以圣人命名，有的以指挥官命名，而至少有一座，也就是这一座，是以一座路边小十字架命名的——想必在把军事棱堡直接盖在它头顶之前，也没人特意去征求过它的同意。`,
    },
  },
  {
    name: 'Albertov Campus',
    slug: 'kampus-albertov',
    localizedNames: { cz: 'Kampus Albertov', zh: '阿尔贝托夫校区' },
    labels: ['academy', 'historical', 'modern'],
    coordinates: { lat: 50.068830247509666, lng: 14.423798144311984 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Albertov Campus! This cluster of Charles University science buildings looks like an ordinary place to study chemistry and biology — until you learn that twice in the twentieth century, the street outside became the starting line for protests that changed Czechoslovak history.

On 17 November 1939, Czech students gathered here to march in memory of a classmate killed during anti-Nazi protests — the Germans responded by executing nine student leaders, closing every Czech university for the rest of the occupation, and deporting over a thousand students to concentration camps. Exactly fifty years later, on 17 November 1989, students assembled at Albertov again, this time ostensibly to commemorate that same tragedy — and marched from here toward the city centre in what became the opening act of the Velvet Revolution, the protest that ended over four decades of communist rule within weeks.

Today the campus is simply where Charles University teaches physics, chemistry, geology, and biology to a new generation of students who mostly just want to pass their exams — the surrounding lecture halls and labs give little outward sign that this particular patch of pavement has twice launched a national reckoning.

🥚 Easter Egg: 17 November is now a Czech and Slovak public holiday — Struggle for Freedom and Democracy Day — meaning Albertov's two protest marches, exactly fifty years apart, together produced one of the only public holidays in the world commemorating events at the very same street corner twice.`,

      cz: `Statečný dobrodruhu, vítej v Kampusu Albertov! Tento shluk přírodovědeckých budov Univerzity Karlovy vypadá jako obyčejné místo pro studium chemie a biologie — dokud nezjistíš, že se ulice před ním ve dvacátém století dvakrát stala startovní čárou protestů, které změnily československé dějiny.

17. listopadu 1939 se tu čeští studenti shromáždili k pochodu na památku spolužáka zabitého při protinacistických demonstracích — Němci odpověděli popravou devíti studentských vůdců, uzavřením všech českých vysokých škol na zbytek okupace a deportací více než tisícovky studentů do koncentračních táborů. Přesně o padesát let později, 17. listopadu 1989, se studenti na Albertově znovu shromáždili, tentokrát oficiálně na počest téže tragédie — a vydali se odtud pochodem do centra města v tom, co se stalo úvodním dějstvím sametové revoluce, protestu, který během pár týdnů ukončil více než čtyři desetiletí komunistické vlády.

Dnes je kampus prostě místem, kde Univerzita Karlova učí fyziku, chemii, geologii a biologii novou generaci studentů, kteří většinou chtějí hlavně projít zkouškami — okolní posluchárny a laboratoře navenek příliš neprozrazují, že se přesně na tomhle kousku chodníku dvakrát rozhodovalo o osudu národa.

🥚 Velikonoční vajíčko: 17. listopad je dnes český a slovenský státní svátek — Den boje za svobodu a demokracii —, takže dva albertovské protestní pochody, oddělené přesně padesáti lety, dohromady vytvořily jeden z mála státních svátků na světě, který připomíná události, jež se dvakrát odehrály na tom samém rohu ulice.`,

      zh: `勇敢的冒险家，欢迎来到阿尔贝托夫校区（Albertov）！这一片查理大学理学院建筑群，看起来不过是学生学习化学和生物的普通场所——直到你了解到，在二十世纪，校外那条街道曾两度成为改变捷克斯洛伐克历史的抗议游行的起点。

1939年11月17日，捷克学生在此集结，为一名在反纳粹示威中遇害的同学举行悼念游行——德国当局的回应是处决九名学生领袖，关闭全国所有捷克高校直至占领结束，并将超过一千名学生送往集中营。整整五十年后，1989年11月17日，学生们再次聚集在阿尔贝托夫，表面上是为了纪念同一场悲剧——他们从这里出发游行前往市中心，由此揭开了"天鹅绒革命"的序幕，几周之内便终结了长达四十余年的共产党统治。

如今，这座校区不过是查理大学向新一代学生教授物理、化学、地质与生物的地方，学生们大多只想顺利通过考试——周围的阶梯教室与实验室，几乎看不出任何迹象，表明这块小小的人行道曾两度点燃过一场全民族的清算。

🥚 彩蛋：11月17日如今是捷克与斯洛伐克的法定假日——"争取自由与民主斗争日"——这意味着阿尔贝托夫的这两场相隔整整五十年的游行，共同造就了世界上极少数纪念"同一个街角发生过两次事件"的公共假日之一。`,
    },
  },
  {
    name: 'Trmal Villa',
    slug: 'trmalova-vila',
    localizedNames: { cz: 'Trmalova vila', zh: '特尔马尔别墅' },
    labels: ['villa', 'architecture', 'historical'],
    coordinates: { lat: 50.073757996880936, lng: 14.48780965189118 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Trmal Villa (Trmalova vila)! This crisp white cube with a jaunty little tower in the middle of residential Strašnice doesn't look like a turning point in architectural history — but it more or less was one, for Prague at least.

Designed by Jan Kotěra in 1902–03 for a local schoolteacher, Bedřich Trmal, the villa was one of the first buildings in Bohemia to break decisively with the ornamental historicism still dominating Czech architecture at the time. Kotěra had studied in Vienna under Otto Wagner, the father of the Vienna Secession, and brought Wagner's stripped-down, function-first sensibility home with him — the result is a house built almost entirely of clean geometric volumes and rational floor plans, decades ahead of the Functionalist style that would eventually sweep across interwar Czechoslovakia.

It's easy to walk past it today assuming it's simply a nice modern house, which is, in a roundabout way, the whole point: what looked genuinely radical in 1903 has become the visual baseline for a century of buildings that followed it.

🥚 Easter Egg: Kotěra designed the villa for a schoolteacher, not an aristocrat or industrialist — a modest client for what art historians now consider one of the founding buildings of Czech modern architecture, proof that architectural revolutions don't always need a rich patron, just a willing one.`,

      cz: `Statečný dobrodruhu, vítej u Trmalovy vily! Tahle svěže bílá kostka s veselou malou věžičkou uprostřed obytných Strašnic nevypadá jako zlomový bod v dějinách architektury — ale svým způsobem jím, přinejmenším pro Prahu, byla.

Vilu navrhl Jan Kotěra v letech 1902–03 pro místního učitele Bedřicha Trmala a stala se jednou z prvních staveb v Čechách, které se rozhodně rozešly s ozdobným historismem, jenž tehdy v české architektuře stále vládl. Kotěra studoval ve Vídni u Otto Wagnera, otce vídeňské secese, a jeho střízlivý, funkcí řízený přístup si přivezl domů s sebou — výsledkem je dům postavený téměř výhradně z čistých geometrických objemů a racionálního půdorysu, o desítky let předbíhající funkcionalismus, který nakonec zaplavil meziválečné Československo.

Dnes je snadné kolem ní projít s dojmem, že jde jen o pěkný moderní dům, což je vlastně oklikou přesně ten smysl: co v roce 1903 vypadalo skutečně radikálně, se stalo vizuálním základem pro celé století staveb, které přišly po ní.

🥚 Velikonoční vajíčko: Kotěra navrhl vilu pro učitele, ne pro šlechtice nebo průmyslníka — skromný klient pro stavbu, kterou dnes historici umění považují za jednu ze zakladatelských budov české moderní architektury, jako důkaz, že architektonické revoluce nepotřebují vždy bohatého mecenáše, jen ochotného.`,

      zh: `勇敢的冒险家，欢迎来到特尔马尔别墅（Trmalova vila）！这座矗立在住宅区施特拉什尼采（Strašnice）中央的素白立方体建筑，配上一座俏皮的小塔楼，看起来并不像是建筑史上的转折点——但对布拉格而言，它多少确实算得上是。

这座别墅由扬·科泰拉（Jan Kotěra）于1902至1903年设计，业主是当地一位名叫贝德日赫·特尔马尔（Bedřich Trmal）的教师。它是波希米亚最早一批果断摆脱当时仍主导捷克建筑的装饰性历史主义风格的建筑之一。科泰拉曾在维也纳师从"维也纳分离派之父"奥托·瓦格纳（Otto Wagner），并将瓦格纳那种去繁就简、以功能为先的理念带回了家乡——最终成果是一座几乎完全由干净的几何体块与理性平面布局构成的住宅，比后来席卷两次大战之间捷克斯洛伐克的功能主义风格早了整整数十年。

如今，人们很容易从它身边走过，只当它是一栋不错的现代住宅——而这恰恰是重点所在，只是绕了个圈子：1903年看起来真正激进的东西，如今已经成为此后整整一个世纪建筑的视觉基准线。

🥚 彩蛋：科泰拉是为一位教师而非贵族或实业家设计了这座别墅——这位业主的身份颇为朴素，而这座建筑如今却被艺术史学家视为捷克现代建筑的奠基之作之一，证明了建筑史上的革命并不总是需要一位富有的赞助人，只需要一位愿意支持的委托人。`,
    },
  },
  {
    name: 'Topič Salon',
    slug: 'topicuv-salon',
    localizedNames: { cz: 'Topičův salon', zh: '托皮奇沙龙' },
    labels: ['cultural', 'architecture', 'historical'],
    coordinates: { lat: 50.08159654413313, lng: 14.415612408490174 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Topič Salon (Topičův salon)! Hidden inside a publishing house on Národní třída, this modest exhibition hall spent the early twentieth century quietly deciding which Czech artists were worth paying attention to.

Established by the Topič publishing family in the early 1900s inside their own building on Národní třída, the salon became one of Prague's key independent exhibition spaces at a moment when Czech modern art was still fighting for legitimacy against more conservative, academy-approved taste. It hosted shows of Czech Impressionists, Cubists, and other artists pushing against convention, functioning less like a museum than a working showroom where reputations were made in real time.

The building itself, with its restrained Art Nouveau facade, has outlasted the publishing empire that built it — publishing houses rise and fall, but a well-placed exhibition room on one of Prague's grandest boulevards tends to find a way to keep being useful.

🥚 Easter Egg: Running an exhibition space out of a publishing house wasn't just convenient — it meant the Topič family could review a show, print the review, and sell you the catalogue, all without leaving the building. Vertically integrated art criticism, a century before anyone had a name for it.`,

      cz: `Statečný dobrodruhu, vítej v Topičově salonu! Ukrytá uvnitř nakladatelského domu na Národní třídě, tahle skromná výstavní síň strávila začátek dvacátého století tichým rozhodováním o tom, kteří čeští umělci si zaslouží pozornost.

Salon založila nakladatelská rodina Topičů na počátku dvacátého století přímo v jejich vlastní budově na Národní třídě a stal se jedním z klíčových nezávislých výstavních prostorů v Praze v době, kdy se české moderní umění ještě muselo prosazovat proti konzervativnějšímu, akademií posvěcenému vkusu. Hostil výstavy českých impresionistů, kubistů a dalších umělců bořících konvence, přičemž fungoval spíš jako živá showroomová galerie, kde se pověsti budovaly v reálném čase, než jako muzeum.

Budova samotná se svou střízlivou secesní fasádou přežila nakladatelské impérium, které ji postavilo — nakladatelství vznikají a zanikají, ale dobře umístěná výstavní místnost na jednom z nejvelkolepějších pražských bulvárů má tendenci pořád si nacházet uplatnění.

🥚 Velikonoční vajíčko: Provozovat výstavní prostor přímo v nakladatelském domě nebylo jen praktické — znamenalo to, že rodina Topičových mohla výstavu recenzovat, recenzi vytisknout a prodat vám katalog, aniž by museli opustit budovu. Vertikálně integrovaná umělecká kritika, sto let předtím, než by ji tak někdo pojmenoval.`,

      zh: `勇敢的冒险家，欢迎来到托皮奇沙龙（Topičův salon）！它藏身于民族大街（Národní třída）一座出版社大楼之内，这间不起眼的展厅，在二十世纪初悄悄决定着哪些捷克艺术家值得被关注。

托皮奇（Topič）出版家族于二十世纪初在他们位于民族大街的自家大楼内创立了这间沙龙，使其成为布拉格最重要的独立展览空间之一——彼时捷克现代艺术仍在与更为保守、被官方学院认可的审美趣味争夺合法地位。沙龙曾举办过捷克印象派、立体派及其他挑战传统的艺术家的展览，与其说它是一座博物馆，不如说它更像是一间实时"制造"艺术声誉的展销厅。

这座建筑本身拥有一副克制内敛的新艺术风格立面，如今它比当初建造它的那个出版帝国活得更久——出版社会兴起也会衰落，但布拉格最宏伟的林荫大道之一上，一间位置绝佳的展厅总能想办法继续派上用场。

🥚 彩蛋：把展览空间开在自家出版社楼里，可不只是图个方便——这意味着托皮奇家族可以为一场展览撰写评论、印刷出版，再把展览目录卖给你，全程都不用走出这栋大楼。这是整整一个世纪之前的"垂直整合艺术评论"，只是当时还没人想出这个说法。`,
    },
  },
  {
    name: 'Lucerna Cinema',
    slug: 'kino-lucerna',
    localizedNames: { cz: 'Kino Lucerna', zh: '卢采尔纳电影院' },
    labels: ['historical', 'architecture'],
    coordinates: { lat: 50.08143814579543, lng: 14.42532400271493 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Lucerna Cinema (Kino Lucerna)! Buried inside one of Prague's grandest early-twentieth-century entertainment complexes, this is one of the oldest cinemas in the country still screening films — and it shares its building with an upside-down horse.

Palác Lucerna was built between 1907 and 1921 by Václav Havel — grandfather of the future president of the same name — as an all-in-one entertainment palace: cinema, concert hall, cafés, shops, and a grand ballroom, all wrapped around a shopping passage that still cuts through the block today. The cinema itself opened as one of the first purpose-built movie theatres in Bohemia and has kept running, on and off, for well over a century, surviving two world wars, forty years of communism, and every format shift from silent film to digital projection.

Just outside the cinema, in the palace's central atrium, hangs the real reason most visitors show up at all: David Černý's "Kůň," a sculpture of King Wenceslas — Prague's patron saint, usually shown triumphantly astride a rearing horse — riding instead on the belly of a dead, upside-down horse. It has hung there since 1999, and the Havel family, incidentally, still partly owns and runs the building.

🥚 Easter Egg: Černý's inverted horse is a direct parody of the enormous, deeply earnest equestrian statue of St. Wenceslas that dominates Wenceslas Square just up the street — meaning Prague has, within a five-minute walk, both the solemn official version of its patron saint and the artist's rebuttal hanging from the ceiling of a cinema lobby.`,

      cz: `Statečný dobrodruhu, vítej v Kině Lucerna! Ukryté uvnitř jednoho z nejvelkolepějších pražských zábavních komplexů z počátku dvacátého století, tohle je jedno z nejstarších dosud promítajících kin v zemi — a sdílí budovu s koněm hlavou dolů.

Palác Lucerna postavil mezi lety 1907 a 1921 Václav Havel — dědeček budoucího prezidenta téhož jména — jako komplexní zábavní palác v jednom: kino, koncertní síň, kavárny, obchody a velký taneční sál, to vše obestavěné kolem obchodní pasáže, která blokem prochází dodnes. Samotné kino se otevřelo jako jedno z prvních účelově postavených kin v Čechách a s přestávkami funguje už přes sto let, přežilo dvě světové války, čtyřicet let komunismu i každý přechod formátu od němého filmu po digitální projekci.

Hned před kinem, v centrálním atriu paláce, visí skutečný důvod, proč sem míří většina návštěvníků: "Kůň" Davida Černého, socha svatého Václava — pražského patrona, obvykle zobrazovaného triumfálně na vzpínajícím se koni — jedoucího tentokrát na břiše mrtvého koně obráceného vzhůru nohama. Visí tam od roku 1999 a rodina Havlových, mimochodem, budovu stále částečně vlastní a provozuje.

🥚 Velikonoční vajíčko: Černého obrácený kůň je přímou parodií na obrovskou, hluboce vážně míněnou jezdeckou sochu svatého Václava, která dominuje Václavskému náměstí jen kousek odtud — takže Praha má v dosahu pěti minut chůze jak slavnostní oficiální verzi svého patrona, tak umělcovu odpověď na ni, visící ze stropu vstupní haly kina.`,

      zh: `勇敢的冒险家，欢迎来到卢采尔纳电影院（Kino Lucerna）！它藏身于布拉格二十世纪初最宏伟的娱乐建筑群之一内部，是全国至今仍在放映电影的最古老影院之一——而且它还与一匹倒挂的马共处一楼。

卢采尔纳宫（Palác Lucerna）由瓦茨拉夫·哈维尔（Václav Havel，与日后同名总统的祖父）建于1907至1921年间，是一座集电影院、音乐厅、咖啡馆、商铺与豪华舞厅于一体的综合娱乐宫殿，环绕着一条至今仍横穿整个街区的购物拱廊。这家电影院本身是波希米亚最早一批专门为放映电影而建的影院之一，此后断断续续运营了一个多世纪，历经两次世界大战、四十年共产主义时期，以及从无声电影到数字放映的每一次格式变革。

而在电影院外、宫殿的中央中庭里，悬挂着大多数游客真正为之而来的东西：大卫·切尔尼（David Černý）的作品《马》（Kůň）——原本用来表现布拉格主保圣人瓦茨拉夫圣王威风凛凛骑在腾跃骏马上的雕塑主题，在这里却变成了他骑在一匹倒挂而死的马腹上。这件作品自1999年起便悬挂于此，顺带一提，哈维尔家族至今仍部分拥有并经营着这栋建筑。

🥚 彩蛋：切尔尼这匹倒挂的马，是对不远处瓦茨拉夫广场上那尊庞大而无比严肃的圣瓦茨拉夫骑马雕像的直接戏仿——也就是说，在布拉格步行仅五分钟的范围内，你既能看到这位主保圣人庄严的官方形象，也能看到艺术家挂在电影院大厅天花板上的"反驳"之作。`,
    },
  },
  {
    name: 'Stýbl Palace',
    slug: 'palac-u-styblu',
    localizedNames: { cz: 'Palác U Stýblů', zh: '斯蒂布尔宫' },
    labels: ['palace', 'architecture', 'modern'],
    coordinates: { lat: 50.08261494903606, lng: 14.425387513821013 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Stýbl Palace (Palác U Stýblů)! On a square packed with nineteenth-century stone facades, this glassy, boxy building looks like it wandered in from an entirely different decade — because, architecturally speaking, it did.

Built in 1927–29 to a design by architect Ludvík Kysela, the palace was one of the first buildings on Wenceslas Square to wrap its ground floors in a continuous glass curtain wall — a construction technique so new at the time that most of Prague was still arguing over whether ornamented stone facades were a moral obligation. Kysela went on to design several more of the square's landmark functionalist buildings, and this one, tucked among older neighbours, still reads as strikingly modern nearly a century later.

Where an aristocratic family name once might have gone, the building instead carries the memory of the Stýbl family after whom it's named — a small reminder that by the interwar years, Wenceslas Square's biggest players were increasingly department store owners and developers rather than counts.

🥚 Easter Egg: Kysela's glass-wall trick on Wenceslas Square came a good two decades before the glass-and-steel curtain walls that would later define postwar skyscrapers worldwide — Prague's shopping street was doing 1950s Manhattan before Manhattan was.`,

      cz: `Statečný dobrodruhu, vítej u Paláce U Stýblů! Na náměstí přeplněném devatenáctistoletými kamennými fasádami působí tahle skleněná, hranatá budova, jako by zabloudila z úplně jiného desetiletí — protože architektonicky vzato se přesně to stalo.

Palác postavili v letech 1927–29 podle návrhu architekta Ludvíka Kysely a stal se jednou z prvních budov na Václavském náměstí, jejíž přízemí obestavěla souvislá skleněná stěna — stavební technika tehdy tak nová, že se v Praze pořád ještě vedly spory o tom, jestli je zdobená kamenná fasáda morální povinností. Kysela pak na náměstí navrhl ještě několik dalších ikonických funkcionalistických budov a tahle, zasazená mezi staršími sousedy, dodnes působí nápadně moderně, i po skoro sto letech.

Tam, kde by kdysi mohlo stát šlechtické jméno, nese budova místo toho vzpomínku na rodinu Stýblových, po níž je pojmenovaná — drobná připomínka toho, že v meziválečných letech byli hlavními hráči na Václavském náměstí čím dál častěji majitelé obchodních domů a developeři, ne hrabata.

🥚 Velikonoční vajíčko: Kyselův skleněný trik na Václavském náměstí přišel o dobré dvě desetiletí dřív než skleněné a ocelové opláštění, které později definovalo poválečné mrakodrapy po celém světě — pražská obchodní třída dělala padesátá léta newyorské Manhattanu dřív, než je dělal sám Manhattan.`,

      zh: `勇敢的冒险家，欢迎来到斯蒂布尔宫（Palác U Stýblů）！在一片挤满十九世纪石砌立面的广场上，这栋通体玻璃、方方正正的建筑，看起来像是从完全不同的年代误闯进来的——因为从建筑史的角度来说，它确实如此。

这座宫殿由建筑师卢德维克·基塞拉（Ludvík Kysela）设计，建于1927至1929年间，是瓦茨拉夫广场上最早采用连续玻璃幕墙包裹底层的建筑之一——在当时，这项建造技术新颖到布拉格大部分人还在争论，装饰性石质立面到底算不算一种"道德义务"。基塞拉后来又在广场上设计了好几座地标性的功能主义建筑，而这一座虽然夹在更古老的邻居之间，近一个世纪后看来依然显得格外现代。

原本可能属于某个贵族家族的位置，如今这栋建筑承载的却是斯蒂布尔（Stýbl）一家的名字——这也小小提醒了人们：到了两次世界大战之间的年代，瓦茨拉夫广场上真正的主角，已经越来越多地变成了百货公司老板和地产开发商，而不再是伯爵们。

🥚 彩蛋：基塞拉在瓦茨拉夫广场玩的这套玻璃幕墙把戏，比后来定义了整个战后世界摩天大楼的玻璃钢结构幕墙，足足早了二十年——布拉格的这条购物街，在纽约曼哈顿真正玩起"1950年代范儿"之前，早就先玩过了。`,
    },
  },
  {
    name: 'House at the Little People',
    slug: 'dum-u-clovicku',
    localizedNames: { cz: 'Dům U Človíčků', zh: '小人之家' },
    labels: ['historical', 'architecture'],
    coordinates: { lat: 50.086675250528856, lng: 14.420821654251514 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the House at the Little People (Dům U Človíčků)! Long before Prague bothered numbering its buildings, houses were told apart by carved or painted signs — and this one earned its cheerful, faintly odd name from a relief of tiny figures still visible on its facade.

Until Empress Maria Theresa's administration introduced sequential house numbers across the Habsburg lands in the 1770s, Praguers navigated the city by these carved symbols instead — a golden angel here, a black eagle there, a house of little people just down the street. Locating an address meant remembering which sign marked which building, a system that worked well enough for a city where most people never left their own neighbourhood, and considerably less well for anyone trying to deliver a letter.

Most of these house signs disappeared once the numbering system took over, chipped off, painted over, or simply forgotten — which makes the ones that survived, like this one, small accidental museums of how the city used to think about itself before bureaucracy standardised everything.

🥚 Easter Egg: Old Town houses still officially carry both their modern street number and their old house-sign name in property records — meaning that, on paper, this building has never actually stopped being "U Človíčků," it's just been quietly demoted to a footnote underneath its number.`,

      cz: `Statečný dobrodruhu, vítej u Domu U Človíčků! Dlouho předtím, než se Praha obtěžovala své domy číslovat, se stavení rozeznávala podle vytesaných nebo malovaných znamení — a tenhle dům si své veselé, mírně podivné jméno vysloužil díky reliéfu drobných postaviček, dodnes viditelnému na fasádě.

Než správa Marie Terezie zavedla v 70. letech 18. století po celých habsburských zemích postupné číslování domů, orientovali se Pražané po městě právě podle těchto vyřezávaných symbolů — tady zlatý anděl, tam černý orel, o kousek dál dům u človíčků. Najít adresu znamenalo pamatovat si, které znamení označuje kterou budovu — systém, který docela dobře fungoval ve městě, kde většina lidí nikdy neopustila vlastní čtvrť, a o poznání hůř fungoval pro každého, kdo se snažil doručit dopis.

Většina těchto domovních znamení zmizela, jakmile převzalo vládu číslování — byla otlučena, přemalována, nebo prostě zapomenuta —, což dělá z těch, které přežily, jako je tenhle dům, drobná náhodná muzea toho, jak o sobě město kdysi přemýšlelo, než byrokracie všechno sjednotila.

🥚 Velikonoční vajíčko: Domy na Starém Městě dodnes oficiálně nesou v katastrálních záznamech vedle svého moderního čísla popisného i svoje staré domovní jméno — což znamená, že na papíře tenhle dům vlastně nikdy nepřestal být "U Človíčků", jen byl tiše degradován na poznámku pod čarou pod svým číslem.`,

      zh: `勇敢的冒险家，欢迎来到"小人之家"（Dům U Človíčků）！早在布拉格费心为建筑编号之前，人们靠雕刻或彩绘的门牌标志来分辨各栋房子——而这一栋，正是凭着立面上至今仍清晰可见的一组"小人"浮雕，赢得了这个欢快又略带古怪的名字。

直到玛丽亚·特蕾莎女皇的政府于18世纪70年代在整个哈布斯堡领地推行连续门牌编号制度之前，布拉格人一直依靠这些雕刻符号来辨认方位——这里是"金天使"，那里是"黑鹰"，街角再往前一点，就是"小人之家"。要找到某个地址，就得记住哪个标志对应哪栋建筑——这套系统在一个大多数人一辈子都不出自己街区的城市里运作得相当不错，但对任何想要送一封信的人来说，可就没那么友好了。

编号制度接管之后，大多数这类门牌标志都消失了——被凿掉、被覆盖，或干脆被遗忘——这也让像这一栋这样幸存下来的建筑，变成了一座座意外留存的小型博物馆，记录着在官僚体系把一切标准化之前，这座城市曾经如何看待自己。

🥚 彩蛋：老城区的房屋，至今在产权登记档案中依然正式同时保留着现代门牌号与古老的门牌名——也就是说，纸面上这栋建筑其实从未真正停止过被称为"U Človíčků"（小人之家），它只是被悄悄降级，成了自己门牌号下方的一条小小脚注。`,
    },
  },
  {
    name: 'House at the Golden Angel',
    slug: 'dum-u-zlateho-andela',
    localizedNames: { cz: 'Dům U Zlatého anděla', zh: '金天使之家' },
    labels: ['historical', 'architecture'],
    coordinates: { lat: 50.086538164674074, lng: 14.42008412923989 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the House at the Golden Angel (Dům U Zlatého anděla)! One more entry in Prague's enormous, half-forgotten catalogue of house signs — this one marked by a gilded angel that once told locals exactly which building they were standing in front of.

Angels were one of the most popular motifs for old Prague house signs, chosen for their obvious connotations of protection and good fortune — useful associations for a merchant house hoping passing customers would trust whatever was sold inside. This particular golden angel marked its building for centuries before the 1770s numbering reform made such signs officially redundant, though, as with so many of Prague's old house names, nobody quite got around to taking it down.

The building today functions like any other address on a busy Old Town street, its golden angel now more decorative curiosity than functional signage — a small piece of pre-modern branding still doing its job long after the system it belonged to was retired.

🥚 Easter Egg: Prague has multiple buildings and even a whole neighbourhood — Anděl, in Smíchov — named after vanished angel house-signs, meaning that if you tried to navigate the city purely by "the building with the angel on it," you would eventually and understandably get extremely lost.`,

      cz: `Statečný dobrodruhu, vítej u Domu U Zlatého anděla! Další položka v obrovském, napůl zapomenutém katalogu pražských domovních znamení — tenhle nese pozlaceného anděla, který kdysi místním přesně říkal, před kterou budovou vlastně stojí.

Andělé patřili mezi nejoblíbenější motivy starých pražských domovních znamení, vybírané pro svůj zjevný odkaz na ochranu a štěstí — užitečné asociace pro kupecký dům, který si přál, aby kolemjdoucí zákazníci důvěřovali tomu, co se uvnitř prodává. Tenhle konkrétní zlatý anděl označoval svou budovu po staletí, než reforma číslování ze 70. let 18. století taková znamení oficiálně učinila zbytečnými — ačkoliv, jako u tolika starých pražských domovních jmen, se ho nikdo úplně neobtěžoval sundat.

Dnes budova funguje jako kterákoli jiná adresa na rušné staroměstské ulici, její zlatý anděl je dnes spíš dekorativní kuriozitou než funkčním označením — drobný kousek předmoderního brandingu, který dál dělá svou práci dlouho poté, co byl systém, ke kterému patřil, zrušen.

🥚 Velikonoční vajíčko: Praha má hned několik budov a dokonce celou čtvrť — Anděl na Smíchově — pojmenovaných po zaniklých andělských domovních znameních, takže kdybyste se pokusili orientovat po městě čistě podle "domu s andělem na fasádě", nakonec a docela pochopitelně byste se pořádně ztratili.`,

      zh: `勇敢的冒险家，欢迎来到"金天使之家"（Dům U Zlatého anděla）！这是布拉格庞大而半被遗忘的门牌标志目录中的又一笔——这一栋，曾以一尊镀金天使标记出来，让当地人一眼便知自己站在哪栋房子前。

天使是布拉格古老门牌标志中最受欢迎的主题之一，因其显而易见的"庇护"与"好运"寓意而备受青睐——对一家希望路过的顾客能够信任店内商品的商铺来说，这样的联想再实用不过。这尊金天使标记着自己的建筑长达数百年，直到18世纪70年代的编号改革让这类标志正式变得多余——不过，正如布拉格许多古老的门牌名一样，也没人真的费心把它拆下来。

如今，这栋建筑就像老城区任何一条繁忙街道上的其他门牌一样正常运作着，那尊金天使如今更多只是一件装饰性的趣味小物，而非实用标志——一小片前现代的"品牌标识"，在它所属的整套系统早已退役之后，依然默默履行着自己的职责。

🥚 彩蛋：布拉格有好几栋建筑，甚至整整一个街区——斯米霍夫的"安德尔"（Anděl，意为天使）——都是以早已消失的天使门牌标志命名的，也就是说，如果你试图仅凭"带天使标志的那栋楼"来给自己在城里导航，最终你多半会——而且完全可以理解地——彻底迷路。`,
    },
  },
  {
    name: 'Schier House',
    slug: 'schieruv-dum',
    localizedNames: { cz: 'Schierův dům', zh: '希尔之家' },
    labels: ['historical', 'architecture'],
    coordinates: { lat: 50.08797993460194, lng: 14.420554626503332 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Schier House (Schierův dům)! Wedged among Wenceslas Square's parade of grand facades, this Art Nouveau building is easy to walk past — right up until you actually look up at it.

Built in the early years of the twentieth century, during the building boom that transformed Wenceslas Square from a horse market into Prague's grandest commercial boulevard, the house takes its name from its original owner, a businessman named Schier — one of dozens of merchants, bankers, and hoteliers who commissioned increasingly elaborate Art Nouveau facades in a kind of architectural arms race up and down the square. Sculpted ornament, decorative ironwork, and stylised plant motifs were all deployed to the same end: making sure your building got noticed by the crowds below.

More than a century later, most passers-by are looking at their phones rather than the rooflines, which is Wenceslas Square's great ongoing irony — an entire boulevard built to be gawked at, mostly ignored by people in a hurry to get somewhere else.

🥚 Easter Egg: The early 1900s building boom that produced Schier House also produced most of the Art Nouveau facades Prague is famous for today, nearly all constructed within roughly a fifteen-year window — meaning the "historic" postcard version of Wenceslas Square is really just one very productive decade and a half, wearing a very convincing disguise of permanence.`,

      cz: `Statečný dobrodruhu, vítej u Schierova domu! Vklíněná mezi přehlídku honosných fasád Václavského náměstí, tahle secesní budova se snadno mine pohledem — přinejmenším dokud se skutečně nepodíváte nahoru.

Dům, postavený v prvních letech dvacátého století během stavebního boomu, který proměnil Václavské náměstí z koňského trhu v nejvelkolepější pražský obchodní bulvár, nese jméno svého původního majitele, podnikatele jménem Schier — jednoho z desítek kupců, bankéřů a hoteliérů, kteří si nechávali stavět čím dál propracovanější secesní fasády v jakémsi architektonickém závodu ve zbrojení podél celého náměstí. Sochařská výzdoba, dekorativní kovářská práce a stylizované rostlinné motivy sloužily všechny stejnému cíli — zajistit, aby si dav dole budovy všiml.

Přes sto let později se kolemjdoucí většinou dívají do telefonu, ne na římsy, což je velká přetrvávající ironie Václavského náměstí — celý bulvár postavený k tomu, aby se na něj lidé dívali s otevřenou pusou, dnes většinou ignorují lidé spěchající někam jinam.

🥚 Velikonoční vajíčko: Stavební boom z počátku dvacátého století, který přinesl Schierův dům, vytvořil i většinu secesních fasád, díky nimž je Praha dnes tak slavná — téměř všechny vznikly v rozmezí zhruba patnácti let. To znamená, že "historická" pohlednicová verze Václavského náměstí je vlastně jen jedno velmi produktivní desetiletí a půl, které na sebe vzalo velmi přesvědčivou masku věčnosti.`,

      zh: `勇敢的冒险家，欢迎来到希尔之家（Schierův dům）！它夹在瓦茨拉夫广场一整排华丽立面之间，这栋新艺术风格建筑很容易被人匆匆走过——直到你真正抬头看它的那一刻。

这栋房子建于二十世纪初，正值瓦茨拉夫广场从一个马匹交易市场蜕变为布拉格最宏伟商业大道的建筑热潮期。它的名字来自最初的业主——一位名叫希尔（Schier）的商人，他和数十位同样在广场沿线委托建造愈发繁复的新艺术风格立面的商人、银行家与旅馆主一样，加入了这场堪称"建筑军备竞赛"的比拼。雕塑装饰、精美的锻铁工艺与风格化的植物纹样，全都服务于同一个目的：确保楼下的人群不会错过你这栋楼。

一个多世纪之后，大多数路人低头看的是手机，而不是屋檐线条——这正是瓦茨拉夫广场至今仍在延续的一大讽刺：整条大道原本是为了让人驻足瞻仰而建，如今却大多被行色匆匆、赶往别处的人们忽略。

🥚 彩蛋：孕育了希尔之家的那波二十世纪初建筑热潮，同样也造就了如今让布拉格闻名于世的大多数新艺术风格立面——几乎全都建成于短短十五年左右的窗口期内。也就是说，明信片上那个"历史悠久"的瓦茨拉夫广场，说到底不过是一段极为高产的十五年，披上了一层极具说服力的"永恒"伪装。`,
    },
  },
  {
    name: 'Prague Municipal Insurance Building',
    slug: 'prazska-mestska-pojistovna',
    localizedNames: { cz: 'Pražská městská pojišťovna', zh: '布拉格市立保险公司大楼' },
    labels: ['architecture', 'historical', 'municipal'],
    coordinates: { lat: 50.08825110455569, lng: 14.421131908376346 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the Prague Municipal Insurance Building! Insurance companies don't usually commission buildings this beautiful anymore, which tells you almost everything about how differently Prague did civic self-promotion a century ago.

Designed by Osvald Polívka — the same architect responsible for the far more famous Municipal House a short walk away — the building was constructed to house the city's own municipal insurance company, an institution the young Czech civic establishment treated with genuine pride rather than bureaucratic indifference. The result is an Art Nouveau facade dense with allegorical sculpture and decorative ironwork, the kind of ornamentation usually reserved for theatres or town halls, lavished instead on a company whose actual business was underwriting fire and property risk.

It's a useful reminder that turn-of-the-century Prague treated even its most mundane civic institutions as opportunities for architectural statement-making — a habit almost nobody has kept up since.

🥚 Easter Egg: Osvald Polívka was so prolific around Prague's centre in this period that you can walk a fairly short loop and pass several of his buildings in under half an hour — making this insurance office less a one-off commission and more one stop on an unofficial Polívka architecture crawl.`,

      cz: `Statečný dobrodruhu, vítej u Pražské městské pojišťovny! Pojišťovny si dnes už podobně krásné budovy obvykle nenechávají stavět, což samo o sobě prozrazuje skoro všechno o tom, jak jinak Praha před sto lety pojímala vlastní veřejnou reprezentaci.

Budovu navrhl Osvald Polívka — tentýž architekt, který je zodpovědný za mnohem slavnější Obecní dům kousek odsud — a postavena byla pro potřeby vlastní městské pojišťovny, instituce, ke které mladá česká občanská reprezentace přistupovala se skutečnou hrdostí, a ne s byrokratickou lhostejností. Výsledkem je secesní fasáda hustě posetá alegorickou sochařskou výzdobou a dekorativní kovářskou prací — ozdobami obvykle vyhrazenými pro divadla nebo radnice, tady však štědře darovanými firmě, jejíž skutečnou náplní bylo pojišťování požárního a majetkového rizika.

Je to užitečná připomínka toho, že Praha na přelomu století zacházela i se svými nejvšednějšími veřejnými institucemi jako s příležitostí k architektonickému gestu — zvyk, který si od té doby skoro nikdo neudržel.

🥚 Velikonoční vajíčko: Osvald Polívka byl v tomto období v centru Prahy natolik plodný, že po ne příliš dlouhé procházce narazíte na několik jeho budov za necelou půlhodinu — díky čemuž je tahle pojišťovací budova méně jednorázovou zakázkou a spíš jednou zastávkou na neoficiální trase po Polívkově architektuře.`,

      zh: `勇敢的冒险家，欢迎来到布拉格市立保险公司大楼！如今的保险公司已经不太会委托建造这么美的建筑了，这一点几乎足以说明，一个世纪前的布拉格，对于"城市自我展示"这件事，有着多么不同的理解。

这座建筑由奥斯瓦尔德·波利夫卡（Osvald Polívka）设计——正是那位设计了不远处更为知名的市民会馆（Obecní dům）的建筑师——最初是为了容纳布拉格自己的市立保险公司而建。这家机构在当年年轻的捷克市民阶层眼中，值得真心的自豪，而非官僚式的漠然对待。最终成果是一副布满寓意雕塑与装饰铁艺的新艺术风格立面——这种通常只属于剧院或市政厅的华丽装饰，却被慷慨地赋予了一家实际业务只是承保火灾与财产风险的公司。

这也提醒着我们，世纪之交的布拉格，就连最平凡的市政机构，也会被当作一次建筑表态的机会——而这个习惯，此后几乎再没人保持下去。

🥚 彩蛋：奥斯瓦尔德·波利夫卡在这一时期于布拉格市中心的创作产量极高，你只需走一小段并不算长的环形路线，半小时之内就能经过他好几栋作品——这也让这座保险公司大楼，与其说是一次孤立的委托项目，不如说更像是一场"波利夫卡建筑巡礼"中的一站。`,
    },
  },
  {
    name: 'Goltz-Kinský Palace',
    slug: 'palac-goltz-kinskych',
    localizedNames: { cz: 'Palác Goltz-Kinských', zh: '戈尔兹-金斯基宫' },
    labels: ['palace', 'architecture', 'historical', 'museum'],
    coordinates: { lat: 50.08788053537254, lng: 14.421650170983325 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to Goltz-Kinský Palace (Palác Goltz-Kinských)! This pink-and-white Rococo showpiece on Old Town Square has hosted a teenage Franz Kafka's school days and one of the most consequential political speeches in modern Czech history — not bad for one building.

Built between 1755 and 1765 to a design attributed to Kilian Ignaz Dientzenhofer and completed by Anselmo Lurago, the palace first belonged to Count Goltz before passing to the Kinský family, whose name it still carries alongside his. A German-language gymnasium later occupied part of the building, and a young Franz Kafka was a student there in the 1890s — his father also briefly ran a shop in the arcade below, meaning Kafka's actual daily walk to school crossed Old Town Square, past the astronomical clock, more or less every morning of his adolescence.

The palace's most consequential moment, though, came on 25 February 1948, when Communist leader Klement Gottwald addressed a crowd of hundreds of thousands from its balcony, announcing the reshuffled government that effectively completed the Communist takeover of Czechoslovakia — a single afternoon that determined the country's next forty-one years. Today the building is far quieter, housing part of the National Gallery's collection of prints and drawings.

🥚 Easter Egg: A famous photograph of Gottwald's 1948 balcony speech shows fellow official Vladimír Clementis standing beside him — until Clementis was later purged and executed, at which point the regime's censors airbrushed him out of the official photo entirely, leaving only his hat, which they apparently found too fiddly to remove, still sitting on Gottwald's head.`,

      cz: `Statečný dobrodruhu, vítej u Paláce Goltz-Kinských! Tenhle růžovobílý rokokový skvost na Staroměstském náměstí byl svědkem školních let náctiletého Franze Kafky i jednoho z nejosudovějších politických projevů moderních českých dějin — na jednu budovu vcelku slušný výkon.

Palác postavený v letech 1755 až 1765 podle návrhu připisovaného Kiliánu Ignáci Dientzenhoferovi a dokončený Anselmem Luragem patřil nejprve hraběti Goltzovi, než přešel na rodinu Kinských, jejíž jméno nese dodnes vedle jeho. Část budovy později obsadilo německé gymnázium a v 90. letech 19. století zde studoval mladý Franz Kafka — jeho otec navíc krátce provozoval obchod v arkádách v přízemí, takže Kafkova skutečná každodenní cesta do školy vedla přes Staroměstské náměstí, kolem orloje, prakticky každé ráno jeho dospívání.

Nejzásadnější okamžik paláce ale přišel 25. února 1948, kdy komunistický vůdce Klement Gottwald z jeho balkonu oslovil davy čítající stovky tisíc lidí a oznámil přeskupenou vládu, která fakticky dovršila komunistický převrat v Československu — jediné odpoledne, které rozhodlo o dalších jednačtyřiceti letech země. Dnes je budova mnohem tišší a hostí část sbírky grafiky a kresby Národní galerie.

🥚 Velikonoční vajíčko: Slavná fotografie Gottwaldova balkonového projevu z roku 1948 ukazuje po jeho boku i tehdejšího ministra Vladimíra Clementise — dokud nebyl Clementis později v rámci čistek popraven, po čemž ho cenzoři režimu z oficiální fotografie kompletně vyretušovali. Zůstala po něm jen jeho čepice, kterou se retušérům zjevně nechtělo z Gottwaldovy hlavy odstraňovat, a tak tam dodnes visí sama.`,

      zh: `勇敢的冒险家，欢迎来到戈尔兹-金斯基宫（Palác Goltz-Kinských）！这座矗立在老城广场上的粉白相间洛可可式建筑瑰宝，既见证过少年时代的弗兰兹·卡夫卡（Franz Kafka）的求学岁月，也见证过捷克现代史上最具决定性的一场政治演说——对一栋建筑来说，成绩相当不俗。

这座宫殿始建于1755年至1765年间，设计据信出自基利安·伊格纳茨·迪岑霍费尔（Kilian Ignaz Dientzenhofer）之手，由安塞尔莫·卢拉戈（Anselmo Lurago）最终完工。它最初属于戈尔兹伯爵，后转归金斯基（Kinský）家族，至今名字里仍并列着两人的姓氏。此后，建筑的一部分曾被一所德语文理中学占用，19世纪90年代，年少的弗兰兹·卡夫卡就曾在此求学——他的父亲还曾在楼下拱廊短暂经营过一家店铺，也就是说，卡夫卡整个青春期几乎每天早晨上学的路，都要穿过老城广场、经过天文钟。

不过，这座宫殿最具决定性的时刻，发生在1948年2月25日：共产党领导人克莱门特·哥特瓦尔德（Klement Gottwald）从这里的阳台上向数十万群众发表讲话，宣布改组后的新政府名单，实质上完成了捷克斯洛伐克的共产党夺权——短短一个下午，就此决定了这个国家此后整整四十一年的命运。如今，这栋建筑安静了许多，如今作为国家美术馆的一部分，收藏着版画与素描藏品。

🥚 彩蛋：一张记录1948年阳台演说的著名照片中，原本还站着哥特瓦尔德身旁的另一位官员弗拉基米尔·克莱门蒂斯（Vladimír Clementis）——直到克莱门蒂斯后来在政治清洗中被处决，官方审查人员便将他从这张官方照片中彻底"抹去"，唯独留下了他的那顶帽子，大概是嫌从哥特瓦尔德头上"摘掉"太麻烦，就那样一直留在了照片里。`,
    },
  },
  {
    name: 'House at the White Unicorn',
    slug: 'dum-u-bileho-jednorozce',
    localizedNames: { cz: 'Dům U Bílého jednorožce', zh: '白独角兽之家' },
    labels: ['historical', 'cultural', 'architecture'],
    coordinates: { lat: 50.08748447214407, lng: 14.422089942178513 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    description: {
      en: `Brave adventurer, welcome to the House at the White Unicorn (Dům U Bílého jednorožce)! Behind this modest Old Town Square facade once ran one of the most intellectually startling living rooms in early twentieth-century Europe.

In the early 1900s, the house was home to Berta Fanta, whose family ran a pharmacy on the ground floor and whose private salon upstairs became a regular meeting point for an extraordinary cross-section of Prague's intellectual life — Franz Kafka and his friend Max Brod attended, alongside philosophers and scientists, and, during his 1911–1912 professorship in Prague, a young Albert Einstein, who reportedly played violin at these gatherings between discussions of Kant and relativity. For a few years, this unassuming building above a pharmacy counter hosted conversations that, in hindsight, connect modern literature to modern physics through one shared living room.

The unicorn on the facade long predates any of this — like so many Old Town houses, it originally served as a pre-numbering address marker — but it's the early-twentieth-century salon upstairs that gives the building its real claim to fame.

🥚 Easter Egg: Einstein's Prague stint gets far less attention than his time in Berlin or Princeton, but he is generally understood to have developed some of his early thinking on general relativity while living in the city — meaning this pharmacy building may have hosted violin-playing physics small talk that quietly fed into one of the twentieth century's biggest scientific breakthroughs.`,

      cz: `Statečný dobrodruhu, vítej u Domu U Bílého jednorožce! Za touhle skromnou fasádou na Staroměstském náměstí se kdysi odehrával jeden z intelektuálně nejúžasnějších salonů raně dvacátého století Evropy.

Na počátku 20. století v domě žila Berta Fanta, jejíž rodina provozovala v přízemí lékárnu a jejíž soukromý salon v patře se stal pravidelným setkávacím místem pro mimořádně pestrý průřez pražského intelektuálního života — docházel sem Franz Kafka a jeho přítel Max Brod, spolu s filozofy a vědci, a během svého profesorského angažmá v Praze v letech 1911–1912 také mladý Albert Einstein, který na těchto setkáních prý hrával na housle mezi diskuzemi o Kantovi a relativitě. Po pár let hostila tahle nenápadná budova nad lékárnickým pultem rozhovory, které z dnešního pohledu spojují moderní literaturu s moderní fyzikou v jednom společném salonu.

Jednorožec na fasádě je mnohem starší než tohle všechno — jako u tolika staroměstských domů sloužil původně jako adresní znamení z doby před číslováním —, ale skutečnou slávu domu přinesl až salon z počátku dvacátého století v patře.

🥚 Velikonoční vajíčko: Einsteinovu pražskou epizodu zastiňuje jeho čas v Berlíně nebo Princetonu, obecně se však má za to, že právě během pobytu v Praze rozpracoval některé rané myšlenky obecné teorie relativity — což znamená, že tahle lékárnická budova možná hostila hraní na housle prokládané fyzikálním tlacháním, které nakonec tiše přispělo k jednomu z největších vědeckých průlomů dvacátého století.`,

      zh: `勇敢的冒险家，欢迎来到"白独角兽之家"（Dům U Bílého jednorožce）！在这栋老城广场上其貌不扬的建筑背后，二十世纪初曾有过一间令人惊叹的"思想沙龙客厅"。

二十世纪初，这栋房子是贝尔塔·范塔（Berta Fanta）的家，她的家族在一楼经营着一家药房，而她在楼上开设的私人沙龙，则成为布拉格知识界一个非同寻常的交汇点，定期聚集着形形色色的思想人物——弗兰兹·卡夫卡和他的好友马克斯·布罗德（Max Brod）都是常客，同席的还有哲学家与科学家；1911年至1912年间，年轻的阿尔伯特·爱因斯坦正在布拉格担任教授，据说他也常在这些聚会上拉小提琴，在讨论康德与相对论的间隙演奏。短短几年间，这栋药房楼上不起眼的建筑，就这样在同一间客厅里，串联起了现代文学与现代物理学的对话。

立面上的独角兽标志，其历史远早于这一切——和老城区许多房子一样，它最初只是编号制度出现之前的一枚门牌标记——但真正为这栋建筑赢得盛名的，是二十世纪初楼上的那间沙龙。

🥚 彩蛋：相比爱因斯坦在柏林或普林斯顿的岁月，他在布拉格的这段经历常常被人忽略，但人们普遍认为，正是在布拉格居住期间，他发展出了广义相对论的一些早期思路——也就是说，这栋药房楼房，或许真的在小提琴声与物理学闲谈之间，悄悄孕育了二十世纪最重大的科学突破之一。`,
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
