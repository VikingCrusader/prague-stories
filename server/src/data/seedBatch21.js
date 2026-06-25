import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';
import CheckIn from '../models/CheckIn.js';

const REMOVE_SLUGS = ['klementinum', 'prague-city-gallery'];

const locations = [
  {
    name: 'Stone Bell House',
    slug: 'stone-bell-house',
    labels: [],
    coordinates: { lat: 50.0877655, lng: 14.4218702 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/House_at_the_Stone_Bell',
    pixelArtKey: '',
    localizedNames: { cz: 'Dům U Kamenného zvonu', zh: '石铃之家' },
    description: {
      en: `The Stone Bell House has been standing on Old Town Square since the 14th century, quietly judging the astronomical clock across the square for getting all the attention. Once a royal palace, it spent several centuries disguised under a Baroque plaster overlay — a Gothic building in a trench coat, pretending to be something else. The bell-shaped corbel on the corner is the only clue it left for posterity, and posterity took until 1963 to notice.\n\nThe Baroque disguise was stripped away in the 1980s, revealing the original Gothic facade underneath, which was presumably relieved. Today it's a contemporary art gallery run by the Prague City Hall, meaning that serious modern installations now occupy the same rooms where medieval Czech royalty once had dinner and argued about politics. The walls have seen stranger things.\n\nUnlock this location, and the stone bell will ring once — silently, internally, in a way only you can feel. That's how Gothic architecture shows appreciation. It doesn't wave.`,
      cz: `Dům U Kamenného zvonu stojí na Staroměstském náměstí od 14. století a tiše hodnotí orloj naproti, který bere všechnu slávu. Byl to kdysi královský palác, pak se na několik staletí schoval pod barokní omítkou — gotická budova v přestrojení, která předstírala, že je někdo jiný. Kamenný zvon v rohu byl jediný náznak, který zanechal, a trvalo až do roku 1963, než si toho někdo všiml.\n\nBarokní převlek byl stržen v 80. letech, čímž se odkryla původní gotická fasáda, která to zřejmě nesla s úlevou. Dnes je tu galerie současného umění provozovaná pražským magistrátem — vážné moderní instalace v místnostech, kde středověká česká šlechta kdysi večeřela a hádala se o politice. Zdi toho zažily ještě divnější věci.\n\nOdemkni toto místo a kamenný zvon jednou zazvoní — tiše, vnitřně, způsobem, který pocítíš jen ty. Takto gotická architektura vyjadřuje uznání. Nemává.`,
      zh: `石铃之家自14世纪以来一直矗立在老城广场，静静地审视着对面那座抢走所有风头的天文钟。这里曾是一座皇家宫殿，后来在巴洛克式灰泥外衣下隐藏了几个世纪——一座哥特式建筑穿着伪装，假装自己是别的什么。角落里那个铃铛形托架是它留给后人的唯一线索，而后人直到1963年才注意到。\n\n巴洛克伪装在1980年代被剥除，露出下面的原始哥特式立面，那立面大概如释重负。如今这里是布拉格市政厅运营的当代艺术画廊，严肃的现代装置艺术占据了中世纪捷克王室曾经用餐和争论政治的房间。这面墙见过更奇怪的事。\n\n解锁此地，石铃将鸣响一声——无声地，在内心深处，以一种只有你能感受到的方式。这就是哥特式建筑表达感激的方式。它不会招手。`,
    },
  },
  {
    name: 'Church of Sts. Simon and Jude',
    slug: 'kostel-sv-simona-judy',
    labels: [],
    coordinates: { lat: 50.0920166, lng: 14.4205561 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Church_of_Saints_Simon_and_Jude_(Prague)',
    pixelArtKey: '',
    localizedNames: { cz: 'Kostel sv. Šimona a Judy', zh: '圣西门与圣犹大教堂' },
    description: {
      en: `The Church of Saints Simon and Jude has had more career changes than most people. Built in the early 17th century by the Bohemian Brethren — a Protestant group that was, to put it diplomatically, not popular with the Habsburgs — it was confiscated after the Battle of White Mountain in 1620 and handed to the Catholic Brothers of Mercy. Then it became a military hospital storeroom. Then a concert hall.\n\nThe Brothers of Mercy left enough Baroque detail to make the interior worth visiting, and the military left enough indifference that the acoustics remained excellent. Today it's used by the Prague Philharmonia for chamber concerts, meaning the building has gone from religious dispute to artillery supplies to Schubert — a trajectory that would confuse almost anyone.\n\nUnlock this location and appreciate that Saint Jude — patron saint of lost causes — presumably watches over a building that has survived every possible institutional identity crisis Prague could throw at it.`,
      cz: `Kostel sv. Šimona a Judy vystřídal kariéry více než většina lidí. Byl postaven na počátku 17. století Českobratrskou církví — protestantskou skupinou, která u Habsburků, řekněme diplomaticky, oblíbena nebyla — a po Bitvě na Bílé hoře roku 1620 byl zabaven a předán katolickým Milosrdným bratřím. Pak se stal vojenským skladem. Pak koncertním sálem.\n\nMilosrdní bratři zanechali dost barokních detailů, aby stálo za to interiér navštívit, a vojenská správa nechala dost lhostejnosti, aby akustika zůstala výborná. Dnes ho využívá Pražská filharmonie pro komorní koncerty — budova prošla od náboženského sporu přes dělostřelecké zásoby ke Schubertovi, což by zmátlo skoro každého.\n\nOdemkni toto místo a oceň, že svatý Juda — patron ztracených případů — střeží budovu, která přežila každou možnou institucionální krizi, jakou na ni Praha připravila.`,
      zh: `圣西门与圣犹大教堂的职业变迁比大多数人都多。它由波西米亚兄弟会——一个与哈布斯堡王朝关系，委婉地说，不太融洽的新教团体——建于17世纪初。1620年白山战役后，教堂被没收，转交给天主教仁慈兄弟会。后来成了军用仓库，再后来成了音乐厅。\n\n仁慈兄弟会留下了足够的巴洛克细节，让室内值得一看；军队留下了足够的漠然，让音响效果依然出色。如今布拉格爱乐乐团在此举办室内乐音乐会，这意味着这座建筑从宗教纷争到军械储备再到舒伯特，走过了一段几乎让任何人都困惑的轨迹。\n\n解锁此地，并感念圣犹大——失落事业的主保圣人——大概一直守护着这座熬过了布拉格所有可能的身份认同危机的建筑。`,
    },
  },
  {
    name: 'Čech Bridge',
    slug: 'cechuv-most',
    labels: [],
    coordinates: { lat: 50.0930820, lng: 14.4170414 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/%C4%8Cech_Bridge',
    pixelArtKey: '',
    localizedNames: { cz: 'Čechův most', zh: '切赫桥' },
    description: {
      en: `Čech Bridge was completed in 1908 and named after Svatopluk Čech, a Czech poet who wrote extensively about the Slavic homeland and probably did not foresee his name being attached to a traffic artery. The Art Nouveau lamp posts, railings, and allegorical statues make it one of the most decorative bridges in Prague, which is saying something in a city that treats bridges as competitive sport.\n\nThe bridge connects Old Town to Letná park, which means it has carried an enormous amount of people going to the Letná beer garden on sunny days. The allegorical sculptures at each end represent the Vltava and its tributaries — a polite way of acknowledging that a river runs through the city without having to discuss what it smells like in August.\n\nUnlock this bridge and walk across it slowly. Letná is on the other side. The beer garden is at the top of the hill. The statues will watch you go.`,
      cz: `Čechův most byl dokončen roku 1908 a pojmenován po Svatopluku Čechovi, českém básníkovi, který psal o slovanské vlasti a nepočítal s tím, že jeho jméno ponese dopravní tepna. Secesní lucerny, zábradlí a alegorické sochy z něj dělají jeden z nejokázalejších pražských mostů, což je co říct ve městě, které bere mosty jako sportovní soutěž.\n\nMost spojuje Staré Město s Letenskými sady — nese tedy obrovské množství lidí mířících za slunečných dní do letňanské zahrádky. Alegorické sochy na obou koncích zobrazují Vltavu a její přítoky, což je zdvořilý způsob, jak uznat, že řekou teče voda, aniž bychom museli mluvit o tom, jak v srpnu voní.\n\nOdemkni tento most a přejdi ho pomalu. Na druhé straně jsou Letné. Zahrádka je nahoře na kopci. Sochy budou sledovat, jak odcházíš.`,
      zh: `切赫桥建于1908年，以捷克诗人斯瓦托普鲁克·切赫命名。这位诗人大量书写斯拉夫故土，大概没料到自己的名字会被安在一条交通干道上。新艺术风格的路灯、栏杆和寓意雕塑使它成为布拉格最华丽的桥梁之一——在一座把桥梁当作竞技运动的城市里，这话分量不轻。\n\n这座桥连接老城区与莱特纳公园，晴天里承载着大量前往莱特纳啤酒花园的人流。两端的寓意雕塑代表伏尔塔瓦河及其支流——一种优雅的方式，承认城市里流淌着一条河，同时避免讨论八月份那条河闻起来是什么味道。\n\n解锁这座桥，慢慢走过去。莱特纳在对岸，啤酒花园在山顶。雕塑会看着你离去。`,
    },
  },
  {
    name: 'Church of Our Lady of Sorrows',
    slug: 'klasterni-kostel-panny-marie-bolestne',
    labels: [],
    coordinates: { lat: 50.0692498, lng: 14.4203879 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    pixelArtKey: '',
    localizedNames: { cz: 'Klášterní kostel Panny Marie Bolestné', zh: '圣母忧苦修道院教堂' },
    description: {
      en: `The Monastery Church of Our Lady of Sorrows sits in the quieter reaches of Nové Město, the kind of Baroque church that exists to remind you that seventeenth-century Prague was essentially a city-sized building site with a surplus of religious enthusiasm. Our Lady of Sorrows is the Virgin Mary in her grief — a subject Czech Baroque painters approached with remarkable frequency and considerable skill.\n\nThe monastery complex has changed hands and purposes several times, as was the fashion for religious institutions in a city that went from Catholic to Protestant, back to Catholic, then to Communist, and is now figuring out what comes next. The church itself maintained its liturgical function throughout, which in Prague counts as impressive institutional continuity.\n\nOdemkni toto místo — wait, wrong language. Unlock this location, light a metaphorical candle, and contemplate the fact that every building in this neighbourhood has a story involving at least two religious orders and one Habsburg.`,
      cz: `Klášterní kostel Panny Marie Bolestné stojí v klidnějším koutě Nového Města — barokní kostel, který připomíná, že Praha 17. století byla v podstatě jedno velké staveniště s přebytkem náboženského nadšení. Panna Maria Bolestná je Panna Maria v zármutku — téma, které čeští barokní malíři zpracovávali s pozoruhodnou frekvencí a značnou zručností.\n\nKlášterní komplex několikrát změnil majitele i účel — jak bylo módou pro náboženské instituce ve městě, které prošlo od katolictví k protestantství, zpět ke katolictví, pak ke komunismu a nyní zjišťuje, co přijde dál. Kostel sám si svou liturgickou funkci zachoval po celou dobu, což je v Praze považováno za pozoruhodnou institucionální kontinuitu.\n\nOdemkni toto místo, zapal symbolickou svíčku a zamysli se nad tím, že každá budova v sousedství skrývá příběh zahrnující nejméně dva řády a jednoho Habsburka.`,
      zh: `圣母忧苦修道院教堂坐落在新城较为僻静的角落——这类巴洛克教堂提醒你，17世纪的布拉格本质上是一个拥有过剩宗教热情的超大工地。忧苦圣母指的是悲痛中的圣母玛利亚——捷克巴洛克画家以惊人的频率和相当的技巧描绘这一主题。\n\n教堂所属的修道院综合建筑多次易主和改变用途，正如这座城市中宗教机构的惯常命运——从天主教到新教，再回到天主教，然后是共产主义，现在正在摸索接下来该怎么办。教堂本身在这整个过程中始终维持着礼拜功能，这在布拉格算得上令人印象深刻的机构延续性。\n\n解锁此地，点一根象征意义上的蜡烛，思考一下这个街区的每栋建筑背后都有一个涉及至少两个宗教修会和一位哈布斯堡成员的故事。`,
    },
  },
  {
    name: 'Church of St. Apollinaris',
    slug: 'kostel-sv-apolinar',
    labels: [],
    coordinates: { lat: 50.0708714, lng: 14.4238008 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Church_of_Saint_Apollinaris_(Prague)',
    pixelArtKey: '',
    localizedNames: { cz: 'Kostel sv. Apolináře', zh: '圣阿波利纳里斯教堂' },
    description: {
      en: `The Church of Saint Apollinaris is a Gothic church from the 14th century, sitting beside the Apolinář hospital complex in Nové Město as if the two were always meant to be neighbors — which they practically were. Apollinaris was a first-century bishop of Ravenna who was martyred by people who didn't appreciate his preaching, a career arc that medieval Prague found sufficiently inspiring to dedicate a whole church to.\n\nThe building has retained its Gothic core through the centuries, which is more than can be said for most buildings in this neighbourhood that got a Baroque makeover in the 17th century and never quite recovered. The hospital that grew up around it has delivered generations of Prague babies and treated generations of Prague ailments, meaning this corner of the city has witnessed both the beginning and various inconveniences of human existence.\n\nUnlock this location and note that Saint Apollinaris is the patron saint of epilepsy and toothache, which suggests the medieval church had a practical streak.`,
      cz: `Kostel sv. Apolináře je gotický chrám ze 14. století, který stojí vedle nemocničního komplexu Apolinář v Novém Městě, jako by tato dvě místa vždy měla být sousedy — a vlastně skoro vždy byly. Apolinar byl raně křesťanský biskupe Ravenny umučen lidmi, jimž se nelíbilo jeho kázání — životní dráha, která středověkou Prahu inspirovala natolik, že mu věnovala celý kostel.\n\nKostel si zachoval gotické jádro po celá staletí, což nelze říct o většině budov v sousedství, které v 17. století dostaly barokní renovaci a nikdy se z ní pořádně nevzpamatovaly. Nemocnice, jež vyrostla v jeho blízkosti, přivedla na svět generace pražských dětí a léčila generace pražských nemocí — tento kout města tak byl svědkem jak začátků, tak různých nesnází lidské existence.\n\nOdemkni toto místo a věz, že sv. Apolinar je také patronem epilepsie a zubní bolesti, což naznačuje, že středověká církev měla praktické sklony.`,
      zh: `圣阿波利纳里斯教堂是14世纪的哥特式教堂，紧邻新城的阿波利纳日医院综合楼，仿佛这两处本就该是邻居——实际上几乎确实如此。阿波利纳里斯是1世纪拉文纳的主教，被那些不欣赏他布道的人所杀害——中世纪布拉格认为这段职业生涯足够激励人心，专门为他建造了一座教堂。\n\n教堂在数百年间保留了哥特式核心，这比周边大多数建筑要强——那些建筑在17世纪经历了巴洛克改造，此后就再也没能完全恢复过来。随之成长起来的医院迎接了一代又一代的布拉格新生儿，治疗了一代又一代的布拉格病患，这意味着这个城市角落既见证了人类存在的开端，也见证了人类存在的各种不便。\n\n解锁此地，并注意到圣阿波利纳里斯同时也是癫痫和牙痛的主保圣人——这说明中世纪的教会具有相当实际的一面。`,
    },
  },
  {
    name: 'Apolinář Maternity Hospital',
    slug: 'porodnice-apolinar',
    labels: [],
    coordinates: { lat: 50.0714685, lng: 14.4269881 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Gynekologicko-porodnická_klinika_VFN',
    pixelArtKey: '',
    localizedNames: { cz: 'Porodnice Apolinář', zh: '阿波利纳日妇产医院' },
    description: {
      en: `The Apolinář Maternity Hospital — formally the Department of Obstetrics and Gynecology of the First Faculty of Medicine — has been delivering Prague babies since the 19th century, making it one of those institutions the city quietly depends on without thinking too hard about it. The building complex includes a neo-Gothic chapel, which is either reassuring or concerning depending on your perspective and your pain threshold.\n\nApolinář's maternity ward has seen Prague's birth rates rise and fall with the city's political moods: post-liberation euphoria, communist five-year-plan enthusiasm, post-1989 uncertainty, and whatever the current era is called. Every citizen born here received their first Prague credential before they were able to form opinions about it, which seems fair.\n\nUnlock this location. Statistically speaking, someone in your life was probably born here. This is not an easter egg. This is just Prague.`,
      cz: `Porodnice Apolinář — formálně Gynekologicko-porodnická klinika 1. lékařské fakulty — rodí pražské děti od 19. století a patří tak k institucím, na nichž město tiše závisí, aniž by o tom příliš přemýšlelo. Areál zahrnuje neogotickou kapli, což je buď uklidňující, nebo znepokojivé, záleží na pohledu a prahu bolesti.\n\nPorodnice Apolinář zažila vzestupy a pády pražské porodnosti odrážející politické nálady: poválečnou euforii, nadšení z komunistických pětiletek, nejistotu po roce 1989 a cokoliv se nazývá dnešní éra. Každý občan, který se zde narodil, obdržel svůj první pražský průkaz dříve, než byl schopen si o tom udělat vlastní názor, což se zdá spravedlivé.\n\nOdemkni toto místo. Statisticky vzato se tu někdo z tvého okolí pravděpodobně narodil. Toto není easter egg. To je prostě Praha.`,
      zh: `阿波利纳日妇产医院——正式名称为查理大学第一医学院妇产科——自19世纪以来一直在这里迎接布拉格新生命，成为这座城市静静依赖却很少认真思考的那类机构之一。建筑群中有一座新哥特式小教堂，这究竟令人安心还是令人不安，取决于你的观点和痛阈。\n\n阿波利纳日妇产科见证了布拉格出生率随城市政治情绪的起伏：战后解放的欣喜、共产主义五年计划的热情、1989年后的不确定，以及当前这个时代不管叫什么名字。每一位在此出生的市民，在还没能形成自己观点之前就已经获得了第一张布拉格身份凭证，这倒是公平。\n\n解锁此地。从统计学角度来说，你生命中的某个人很可能就是在这里出生的。这不是彩蛋，这就是布拉格。`,
    },
  },
  {
    name: 'Church of the Sacred Heart',
    slug: 'kostel-nejsvetejsiho-srdce-pane',
    labels: [],
    coordinates: { lat: 50.0780270, lng: 14.4502961 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Church_of_the_Most_Sacred_Heart_of_Our_Lord,_Prague',
    pixelArtKey: '',
    localizedNames: { cz: 'Kostel Nejsvětějšího Srdce Páně', zh: '至圣耶稣圣心教堂' },
    description: {
      en: `The Church of the Most Sacred Heart of Our Lord was designed by Slovenian architect Jože Plečnik and completed in 1932, and it looks like nothing else in Prague — which was entirely the point. Plečnik took the brief "Catholic church in Vinohrady" and produced something between an ancient Egyptian temple, a modernist statement, and a building that causes passing architects to stop and stare in either admiration or confusion, often both.\n\nThe defining feature is the clock tower: a massive rectangular block with a circular clock face so large it is visible from Náměstí Jiřího z Poděbrad below. The clock is essentially a public service at this point, which Plečnik probably did not consider a key theological statement but which local residents appreciate every morning they miss their tram.\n\nUnlock this location and stand on the square outside and look up. The building is actively making you think about time, space, and God, in whichever order you prefer. Plečnik achieved this without a single flying buttress.`,
      cz: `Kostel Nejsvětějšího Srdce Páně navrhl slovinský architekt Jože Plečnik a byl dokončen v roce 1932. Nevypadá jako nic jiného v Praze — a to byl zcela záměr. Plečnik dostal zadání „katolický kostel na Vinohradech" a vytvořil něco mezi starověkým egyptským chrámem, modernistickým manifestem a budovou, která nutí procházející architekty zastavit se a zírat — v obdivu, zmatení nebo obojím zároveň.\n\nDominantu tvoří věžní hodiny: masivní obdélníkový blok s kulatým ciferníkem, tak velkým, že je vidět z náměstí Jiřího z Poděbrad dole. Hodiny jsou v podstatě veřejnou službou, což Plečnik nepovažoval za klíčové teologické sdělení, ale místní obyvatelé to oceňují každé ráno, kdy jim ujede tramvaj.\n\nOdemkni toto místo, postůj na náměstí venku a podívej se nahoru. Budova tě aktivně nutí přemýšlet o čase, prostoru a Bohu — v pořadí, které si zvolíš. Plečnik toho dosáhl bez jediného opěrného oblouku.`,
      zh: `至圣耶稣圣心教堂由斯洛文尼亚建筑师约热·普莱赤尼克设计，于1932年完工。它看起来与布拉格其他任何建筑都不同——这完全是有意为之。普莱赤尼克收到"维诺赫拉迪的天主教堂"这一任务书，交出的答卷却像是古埃及神庙、现代主义宣言，以及一座让路过建筑师驻足凝视的建筑，带着敬佩、困惑，或二者兼而有之。\n\n钟楼是其标志性特征：一个巨大的矩形块体，圆形钟面大得从下方的波杰布拉迪广场就能看见。这个钟表实际上是一项公共服务，普莱赤尼克大概并不认为这是什么核心神学声明，但每天早上错过电车的居民都很感激它。\n\n解锁此地，站在外面的广场上抬头仰望。这座建筑主动让你思考时间、空间和上帝——以你喜欢的顺序。普莱赤尼克实现了这一切，却一个飞扶壁都没用上。`,
    },
  },
  {
    name: 'Svatopluk Čech Gardens',
    slug: 'sady-svatopluka-cecha',
    labels: [],
    coordinates: { lat: 50.0767063, lng: 14.4464561 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    pixelArtKey: '',
    localizedNames: { cz: 'Sady Svatopluka Čecha', zh: '斯瓦托普鲁克·切赫花园' },
    description: {
      en: `The Sady Svatopluka Čecha are the kind of Vinohrady park that exists to remind you that late 19th-century Prague was extremely serious about civic greenery. Laid out as a formal garden with paths, benches, and trees selected by someone who cared deeply about arboreal aesthetics, the park honours the Czech poet who spent his career lamenting the fate of the Slavic nations and would have enjoyed a bench in the shade.\n\nVinohrady, the neighbourhood surrounding the park, is one of Prague's most architecturally consistent districts — end-to-end Art Nouveau and historicist apartment blocks built when the city was expanding and optimistic. The park sits among them as a breathing space, which was exactly what its designers intended and what its dog walkers have confirmed for 130 years.\n\nUnlock this location on a sunny afternoon, sit down, and take note: you are in one of the most pleasant residential neighbourhoods in Central Europe, in a park named after a poet, surrounded by architecture that looks like a film set. Prague, occasionally, is very obvious about being beautiful.`,
      cz: `Sady Svatopluka Čecha jsou typickým vinohradským parkem, který připomíná, že Praha konce 19. století brala občanskou zeleň velmi vážně. Formální zahrada s cestičkami, lavičkami a stromy vybranými někým, komu záleželo na estetice stromů, vzdává hold českému básníkovi, který svou kariéru věnoval nářkům nad osudem slovanských národů a v klidném koutě by si rád zasedl.\n\nVinohrady, čtvrť kolem parku, jsou jednou z architektonicky nejucelenějších pražských čtvrtí — secesní a historistické bytové domy od kraje ke kraji, postavené v době, kdy město rostlo a bylo plné optimismu. Park leží uprostřed nich jako prostor k dýchání — přesně to, co projektanti zamýšleli, a venčitelé psů potvrzují 130 let.\n\nOdemkni toto místo za slunného odpoledne, sedni si a všimni si: jsi v jedné z nejpříjemnějších rezidenčních čtvrtí střední Evropy, v parku pojmenovaném po básníkovi, obklopený architekturou připomínající filmové kulisy. Praha je občas ve svém půvabu až nápadně přímočará.`,
      zh: `斯瓦托普鲁克·切赫花园是维诺赫拉迪那种典型公园，提醒你19世纪末的布拉格对市民绿化极为重视。这座正式花园拥有小径、长椅，以及由某位深度关心乔木美学的人精心挑选的树木，以那位毕生哀叹斯拉夫民族命运的捷克诗人命名，他本人大概也会喜欢在树荫下坐一坐。\n\n公园周边的维诺赫拉迪街区是布拉格建筑风格最统一的区域之一——新艺术风格和历史主义公寓楼从头到尾，建于城市扩张和充满乐观情绪的年代。公园夹在这些建筑之间，提供喘息空间——这正是设计者的初衷，遛狗的居民们已经印证了这一点130年。\n\n在一个晴朗的午后解锁此地，坐下来，环顾四周：你正身处中欧最宜居的住宅街区之一，在以诗人命名的公园里，被看起来像电影布景的建筑所环绕。布拉格有时候对自己的美丽直白得过分。`,
    },
  },
  {
    name: 'Hussite Congregation Vinohrady',
    slug: 'husuv-sbor-vinohrady',
    labels: [],
    coordinates: { lat: 50.0745323, lng: 14.4487413 },
    rarity: 'epic',
    xpReward: 30,
    wikipediaUrl: '',
    pixelArtKey: '',
    localizedNames: { cz: 'Husův sbor Vinohrady', zh: '维诺赫拉迪胡斯兄弟会' },
    description: {
      en: `The Vinohrady Hussite Congregation building is a piece of interwar Prague that most people walk past without registering, which is their loss. The Czechoslovak Hussite Church — a denomination that emerged from post-WWI religious politics and decided Hus was right and Rome was negotiable — built its congregation halls with a modernist confidence that communicates: we are a new church for a new republic and we do not do flying buttresses.\n\nThe Hussite movement traces itself to Jan Hus, the 15th-century theologian who was burned at the Council of Constance for suggesting the Church might benefit from reform. Prague has not forgotten this. There is a statue of him on Old Town Square, a national holiday in his honour, and several congregation halls with excellent acoustics that his memory inspired.\n\nUnlock this location and reflect: Jan Hus was excommunicated, tried, burned, and 600 years later has buildings named after him across the country. The long arc of history occasionally bends toward vindication.`,
      cz: `Husův sbor na Vinohradech je součástí meziválečné Prahy, kolem níž většina lidí prochází, aniž si toho všimne — což je jejich ztráta. Církev československá husitská — denominace, která vzešla z nábožensko-politických poměrů po první světové válce a rozhodla se, že Hus měl pravdu a Řím je na vyjednání — stavěla své sbory s modernistickým sebevědomím: jsme nová církev pro novou republiku a flying buttresses neděláme.\n\nHusitské hnutí se hlásí k Janu Husovi, teologovi 15. století, který byl upálen na Kostnickém koncilu za to, že navrhl, že by církvi prospěla reforma. Praha na to nezapomněla. Na Staroměstském náměstí stojí jeho socha, v jeho jménu je státní svátek a díky jeho odkazu vzniklo několik sborů s výbornou akustikou.\n\nOdemkni toto místo a zamysli se: Jan Hus byl exkomunikován, souzen, upálen — a šest set let poté se po něm po celé zemi jmenují budovy. Dlouhý oblouk dějin se občas ohýbá k ospravedlnění.`,
      zh: `维诺赫拉迪胡斯兄弟会是两次大战之间布拉格的一部分，大多数人路过时根本不会注意——这是他们的损失。捷克斯洛伐克胡斯教会——一个从一战后宗教政治动荡中诞生的教派，认定胡斯是对的而罗马是可以商量的——以现代主义的自信建造其会众礼堂：我们是为新共和国而生的新教会，我们不做飞扶壁。\n\n胡斯派运动追溯至杨·胡斯，这位15世纪的神学家在康斯坦茨大公会议上被烧死，原因是他建议教会或许能从改革中获益。布拉格没有忘记这件事。老城广场上有他的雕像，有以他命名的国家节日，还有几座受他记忆启发而建造的、音响效果极佳的会众礼堂。\n\n解锁此地，思考一下：杨·胡斯被逐出教会、受审、被焚烧，600年后全国各地都有以他命名的建筑。历史的长弧偶尔也会弯向昭雪。`,
    },
  },
  {
    name: 'Parukářka',
    slug: 'parukarka',
    labels: [],
    coordinates: { lat: 50.0852689, lng: 14.4620086 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://cs.wikipedia.org/wiki/Parukářka',
    pixelArtKey: '',
    localizedNames: { cz: 'Parukářka', zh: '帕鲁卡日卡' },
    description: {
      en: `Parukářka is a rocky hilltop park in Žižkov that functions simultaneously as a neighbourhood green space, a dog-walking destination, an open-air cinema venue, a spot for impromptu gatherings, and the location of a World War II anti-aircraft bunker that most picnickers have entirely stopped noticing. This combination is extremely Žižkov.\n\nThe bunker was built during the German occupation for anti-aircraft defence. It is now art gallery space, party venue, and general neighbourhood curiosity — which is also extremely Žižkov. The hill offers views over a district named after a one-eyed medieval warlord, allowing you to think about what it means to have an anti-aircraft bunker that became a disco.\n\nUnlock this location, ideally at dusk when the views are best and the neighbourhood's atmosphere is at its most Žižkov. That's not a precise adjective. You'll understand when you get there.`,
      cz: `Parukářka je skalnatý kopec v Žižkově, který funguje zároveň jako sousedský park, místo venčení psů, letní kino, prostor pro spontánní setkání a místo, kde se nachází protiletadlový bunkr z druhé světové války, který si picnikující lidé zcela přestali všímat. Tato kombinace je vrcholně žižkovská.\n\nBunkr byl postaven za německé okupace k protiletecké obraně. Dnes je v něm galerie, místo párty a všeobecná čtvrtová zvláštnost — což je také vrcholně žižkovské. Z kopce jsou pěkné výhledy na čtvrť pojmenovanou po jednookém středověkém válečníkovi a člověk může přemýšlet, co to znamená mít protiletadlový bunkr, který se stal diskotékou.\n\nOdemkni toto místo, ideálně za soumraku, kdy je výhled nejlepší a atmosféra čtvrti vrcholně žižkovská. To není přesný popis. Pochopíš, až tam přijdeš.`,
      zh: `帕鲁卡日卡是日什科夫区的一个岩石山顶公园，同时充当着社区绿地、遛狗目的地、露天电影院场地、即兴聚会地点，以及一座二战高射炮掩体的所在地——而使用这个公园野餐的大多数人已经完全忘记了这座掩体的存在。这种组合极具日什科夫特色。\n\n掩体建于德国占领期间，用于防空。现在它是画廊空间、派对场地和社区的一个一般性奇景——这也极具日什科夫特色。山顶可以俯瞰一个以独眼中世纪军阀命名的街区，让你思考一座防空掩体变成迪厅意味着什么。\n\n解锁此地，最好在黄昏时分，那时景色最美，街区氛围也最具日什科夫风味。这不是个精确的形容词，到了你就明白了。`,
    },
  },
  {
    name: 'Church of the Assumption (Modřany)',
    slug: 'kostel-panny-marie-modrany',
    labels: [],
    coordinates: { lat: 50.0039556, lng: 14.4067753 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: '',
    pixelArtKey: '',
    localizedNames: { cz: 'Kostel Nanebevzetí Panny Marie (Modřany)', zh: '圣母升天教堂（莫日阿内）' },
    description: {
      en: `The Church of the Assumption of the Virgin Mary in Modřany is one of those medieval churches that ended up inside a city by the city growing around it rather than anyone making a deliberate planning decision. Modřany was an independent village until absorbed into Greater Prague; its church predates the surrounding housing estates by several centuries and carries the quiet authority of something that was here first.\n\nThe building's Gothic origins have been modified over the centuries in the usual Czech fashion — a bit of Renaissance, a touch of Baroque, minor alterations at irregular intervals — until it became the kind of church architectural historians describe as "exhibiting the development of several periods," which is the polite version of "it's complicated."\n\nUnlock this location and acknowledge that you have reached the southern edge of the Prague XP map. The view back toward the city is unexpectedly good. The city is larger than most visitors realise, and its edges are quieter than most residents remember.`,
      cz: `Kostel Nanebevzetí Panny Marie v Modřanech je jedním z těch středověkých kostelů, které skončily uvnitř města nikoli díky záměrnému urbanistickému rozhodnutí, ale protože město jednoduše vyrostlo kolem nich. Modřany byly samostatnou obcí, než byly začleněny do Velké Prahy; jejich kostel je o několik staletí starší než okolní sídliště a nese klidnou autoritu čehosi, co tady bylo dřív.\n\nGotické jádro budovy bylo v průběhu staletí pozměněno obvyklým českým způsobem — trocha renesance, nádech baroka, drobné úpravy v nepravidelných intervalech — až se z něj stal kostel, který architektoničtí historici popisují jako „vykazující vývoj několika slohů," což je zdvořilá verze „je to složité."\n\nOdemkni toto místo a uvědom si, že jsi dosáhl jižního okraje pražské XP mapy. Výhled zpět na město je nečekaně dobrý. Město je větší, než si většina návštěvníků uvědomuje, a jeho okraje jsou tišší, jak si většina obyvatel přestala pamatovat.`,
      zh: `莫日阿内圣母升天教堂是那种因城市向外扩张而被包围、而非经过刻意城市规划决策的中世纪教堂之一。莫日阿内曾是一个独立村庄，后被并入大布拉格；其教堂比周围的住宅楼早几个世纪，带着"我在这里更早"的那种平静权威。\n\n这座建筑的哥特式起源在几个世纪里以典型的捷克方式被修改——一点文艺复兴，一丝巴洛克，不规则间隔的小改动——直到它变成建筑史学家描述为"体现了几个历史时期的发展"的教堂，这是"有点复杂"的礼貌说法。\n\n解锁此地，承认你已经到达布拉格经验值地图的南端边界。回望城市的景色出乎意料地好。这座城市比大多数游客意识到的要大，而它的边缘地带比大多数居民记忆中的要安静。`,
    },
  },
  {
    name: 'City Tower',
    slug: 'city-tower-prague',
    labels: [],
    coordinates: { lat: 50.0506040, lng: 14.4361519 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/City_Tower_(Prague)',
    pixelArtKey: '',
    localizedNames: { cz: 'City Tower Praha', zh: '城市塔' },
    description: {
      en: `City Tower is a 109-metre glass-and-steel skyscraper on the Pankrác plateau, completed in 2008 — exactly as contemporary as that sounds in a city whose most famous export is a 14th-century astronomical clock. Prague has a complicated relationship with modern tall buildings, and City Tower sits in the Pankrác skyline alongside other towers in a cluster that Praguers either love or pointedly ignore.\n\nThe Pankrác plateau has the strange quality of being geographically close to the historic centre while feeling entirely separate from it — the part of Prague that looks like a European capital's financial district, because it is. From the ground, City Tower's reflective facade mirrors the sky, the other towers, and the faint existential unease of being in Prague's most un-Prague location.\n\nUnlock this location. The tower does not open to the public, but standing outside and looking up at 109 metres of glass against the Prague sky is its own particular experience. The clock on Old Town Square suddenly seems a long time ago.`,
      cz: `City Tower je 109metrový skleněný mrakodrap na Pankráci, dokončený v roce 2008 — a je přesně tak soudobý, jak to zní ve městě, jehož nejslavnějším vývozním artiklem je astronomický orloj ze 14. století. Praha má složitý vztah k moderním výškovým budovám a City Tower stojí v pankrácké siluetě vedle dalších věží, které Pražané buď milují, nebo programově přehlížejí.\n\nPankrácká planina má zvláštní vlastnost: je geograficky blízko historickému centru, ale připadá jako úplně jiný svět — část Prahy, která vypadá jako finanční čtvrť evropského hlavního města, protože jí skutečně je. City Tower odráží svou zrcadlovou fasádou oblohu, ostatní věže a slabý existenciální neklid z toho, že člověk stojí na nejméně-pražském místě v Praze.\n\nOdemkni toto místo. Věž není otevřena veřejnosti, ale stát venku a dívat se nahoru na 109 metrů skla na pozadí pražského nebe je svým způsobem zvláštní zážitek. Hodiny na Staroměstském náměstí najednou připadají jako ze vzdálené doby.`,
      zh: `城市塔是潘克拉茨高地上一座109米高的玻璃钢结构摩天楼，2008年竣工，在一座最著名出口产品是14世纪天文钟的城市里，它恰如其分地代表着当代。布拉格与现代高层建筑的关系颇为复杂，城市塔与其他塔楼一起组成潘克拉茨天际线，布拉格人要么喜爱它，要么刻意忽视它。\n\n潘克拉茨高地有一种奇异特质：地理上离历史中心很近，感觉上却完全是另一个世界——这是布拉格看起来像欧洲首都金融区的部分，因为它本来就是。从地面看，城市塔的镜面外墙映照着天空、其他塔楼，以及身处布拉格最不布拉格之地时那种淡淡的存在主义不安。\n\n解锁此地。这座塔不对公众开放，但站在外面仰望109米的玻璃对着布拉格的天空，是一种特别的体验。老城广场上的时钟突然感觉是很久以前的事了。`,
    },
  },
  {
    name: 'Nusle Town Hall',
    slug: 'nuselska-radnice',
    labels: [],
    coordinates: { lat: 50.0626278, lng: 14.4401035 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    pixelArtKey: '',
    localizedNames: { cz: 'Nuselská radnice', zh: '努塞尔市政厅' },
    description: {
      en: `The Nuselská radnice — Nusle Town Hall — is the administrative relic of a time when Nusle was an independent town with its own civic ambitions and opinions about governance. That time ended when Nusle was absorbed into greater Prague, as most things around Prague eventually were, and the town hall became a municipal annex, then an office building, then whatever it is now — a building with a history of having been more important.\n\nNusle's most famous feature to most Praguers is the bridge — Nuselský most — which passes over the valley at a height sufficient to have a very dark reputation. The town hall predates this reputation and exists as evidence that Nusle was once primarily known for being a separate town rather than for the engineering above it.\n\nUnlock this location and note that Nusle has a valley, a bridge, a former town hall, and some excellent local pubs. Three of these four things are underappreciated.`,
      cz: `Nuselská radnice je správní relikt z doby, kdy Nusle bylo samostatným městem s vlastními občanskými ambicemi a názory na samosprávu. Ta doba skončila, když Nusle pohltila Velká Praha — jako většinu věcí kolem Prahy nakonec. Radnice se stala obecním přívěskem, pak kancelářskou budovou, pak čímkoli, čím je teď — budovou s historií toho, že bývala důležitější.\n\nNejznámějším rysem Nuslí pro většinu Pražanů je most — Nuselský most — který přechází přes údolí ve výšce dostatečné k tomu, aby získal velmi temnou pověst. Radnice tuto pověst předchází a existuje jako svědectví, že Nusle bylo kdysi primárně známo jako samostatné město, nikoli kvůli inženýrskému dílu nad ním.\n\nOdemkni toto místo a věz, že Nusle má údolí, most, bývalou radnici a výborné místní hospody. Tři z těchto čtyřech věcí jsou nedoceněné.`,
      zh: `努塞尔市政厅是一个时代的行政遗迹，那时努塞尔还是一个拥有自己市政抱负和治理主张的独立城镇。那个时代随着努塞尔被并入大布拉格而终结——正如大多数布拉格周边的事物最终都经历的那样——市政厅先变成市属附属机构，再变成办公楼，再变成现在不管是什么，总之是一座有着曾经更重要的历史的建筑。\n\n对大多数布拉格人来说，努塞尔最出名的是那座桥——努塞尔斯基大桥——它跨越山谷，高度足以让它获得一个非常阴暗的名声。市政厅比这个名声早了许多年，它的存在证明努塞尔曾经主要以其独立城镇身份著称，而非以上方的工程闻名。\n\n解锁此地，了解一下：努塞尔有山谷、桥梁、旧市政厅和几家出色的本地酒吧。这四样东西中有三样被低估了。`,
    },
  },
  {
    name: 'Hussite Congregation Smíchov',
    slug: 'husuv-sbor-smichov',
    labels: [],
    coordinates: { lat: 50.0655641, lng: 14.3987226 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: '',
    pixelArtKey: '',
    localizedNames: { cz: 'Husův sbor Smíchov', zh: '斯米霍夫胡斯兄弟会' },
    description: {
      en: `The Hussite Congregation in Smíchov is one of the Czechoslovak Hussite Church's Prague outposts — a denomination operating here since 1920, when it broke from Rome with the energy of a new republic's cultural self-determination and the earnestness of people who had been waiting a very long time to do so. Smíchov's congregation hall sits in a neighbourhood that has gone from industrial working-class to bohemian to gentrifying, in the manner of neighbourhoods that didn't want to stay the same.\n\nJan Hus would recognise the building's ethos if not its architecture. The church he inspired doesn't go in for Gothic cathedrals or Baroque excess — it prefers the honest lines of early 20th-century ecclesiastical functionalism, which is the architectural equivalent of saying what you mean.\n\nUnlock this location and reflect that Smíchov has changed dramatically in the past thirty years, and the congregation has watched it happen from the same address. Some things move slower than neighbourhoods.`,
      cz: `Husův sbor v Smíchově je jednou z pražských poboček Církve československé husitské — denominace, která ve městě působí od roku 1920, kdy se odtrhla od Říma s energií kulturního sebeurčení nové republiky a vroucností lidí, kteří na to čekali velmi dlouho. Sborová budova stojí ve čtvrti, která prošla proměnou z průmyslové dělnické čtvrti přes bohémskou atmosféru k gentrifikkaci — jako čtvrti, které nechtěly zůstat stejné.\n\nJan Hus by poznal étos budovy, i když ne její architekturu. Jím inspirovaná církev neinklinuje ke gotickým katedrálám ani barokní přepychu — dává přednost poctivým liniím raně 20. století, ecclesiastickému funkcionalismu, který je architektonickým ekvivalentem říkat věci přímo.\n\nOdemkni toto místo a zamysli se: Smíchov se za posledních třicet let dramaticky změnil a sbor sledoval tyto změny ze stejné adresy. Některé věci se pohybují pomaleji než čtvrti.`,
      zh: `斯米霍夫胡斯兄弟会是捷克斯洛伐克胡斯教会在布拉格的分支之一——这个教派自1920年起在布拉格运作，那时它以新共和国文化自决项目的活力脱离罗马，带着等待了很长时间的人们的那种认真劲。这个街区的会众礼堂所在的地方，从工业工人阶级区变成了波西米亚气息街区，再到绅士化社区，就像那些不想停留原地的街区一样。\n\n杨·胡斯会认出这座建筑的精神气质，即便不认得它的建筑风格。他所启发的教会不倾向于哥特大教堂或巴洛克奢华——它偏爱20世纪初教会功能主义的朴素线条，那是建筑语言中"有话直说"的等价物。\n\n解锁此地，思考一下：斯米霍夫在过去三十年里发生了巨大变化，而这个会众礼堂从同一地址目睹了这一切。有些事物的变化比街区慢。`,
    },
  },
  {
    name: 'Černý Most',
    slug: 'cerny-most',
    labels: [],
    coordinates: { lat: 50.1089257, lng: 14.5767803 },
    rarity: 'common',
    xpReward: 10,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/%C4%8Cern%C3%BD_Most',
    pixelArtKey: '',
    localizedNames: { cz: 'Černý Most', zh: '切尔尼·莫斯特' },
    description: {
      en: `Černý Most — Black Bridge — sits at the eastern terminus of Metro Line B, the yellow line that will get you here if you stay on it long enough and don't fall asleep before Letňany. The district takes its name from a former black wooden bridge that once crossed a local waterway; the bridge is long gone, the name remains, and the most prominent feature is now one of Prague's larger shopping centres, because the 21st century has its own ideas about landmarks.\n\nThis is the frontier of the Prague XP map: the point where the metro runs out, the panel housing estates thin out, and the city decides it is done for now. The OC Černý Most shopping centre opened in 1997 and became an anchor for a district that needed one. On a weekend afternoon it contains a cross-section of Prague 9 going about its business with commendable efficiency.\n\nUnlock this location and appreciate that you have ridden the metro to its end. This is not where the city ends — just where this line does. Everything beyond is Praha 9 and eventually just countryside, which Prague becomes more suddenly than you'd expect.`,
      cz: `Černý Most leží na východním konci metra linky B, žluté linky, která vás sem doveze, pokud vydržíte dost dlouho a nezaspíte před Letňany. Čtvrť dostala jméno po bývalém černém dřevěném mostě přes místní vodoteč; most je dávno pryč, název zůstal a nejnápadnějším prvkem je nyní jedno z větších pražských obchodních center, protože 21. století má vlastní představy o pamětihodnostech.\n\nToto je hranice pražské XP mapy: bod, kde metro končí, panelové sídliště řídne a město se rozhodne, že zatím stačí. Obchodní centrum OC Černý Most otevřelo v roce 1997 a stalo se kotvou pro čtvrť, která ji potřebovala. V sobotní odpoledne v ní najdete průřez Prahou 9, jak vyřizuje záležitosti s chvályhodnou efektivitou.\n\nOdemkni toto místo a oceň, že ses metrem dovezl do jeho konce. Toto není konec města — jen konec téhle linky. Za tím vším je Praha 9 a nakonec jen krajina, do které Praha přechází překvapivě náhle.`,
      zh: `切尔尼·莫斯特——黑桥——位于地铁B线（黄线）的东端，只要坚持坐到底、在莱特阿内之前不睡着就能把你带到这里。这个街区以昔日一座曾横跨当地水道的黑色木桥得名；桥早已不在，名字留了下来，而现在最显眼的地标是布拉格最大购物中心之一，因为21世纪对地标有自己的想法。\n\n这是布拉格经验值地图的边疆：地铁到站的地方，大板楼住宅区逐渐稀疏的地方，城市决定暂时到此为止的地方。OC切尔尼·莫斯特购物中心1997年开业，成为一个需要锚点的街区的锚点。周末下午，你可以看到布拉格9区的各色人等以令人赞叹的效率处理自己的事务。\n\n解锁此地，感受一下你已经坐地铁坐到了终点。这不是城市的尽头——只是这条线的尽头。再往前是布拉格9区，最终是乡间，而布拉格切换到乡村的速度之快出乎意料。`,
    },
  },
  {
    name: 'Kobylisy',
    slug: 'kobylisy',
    labels: [],
    coordinates: { lat: 50.1245181, lng: 14.4557553 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Kobylisy',
    pixelArtKey: '',
    localizedNames: { cz: 'Kobylisy', zh: '科比利西' },
    description: {
      en: `Kobylisy is a quiet residential district in northern Prague, but beneath its suburban calm lies one of the city's most significant historical wounds. The Kobylisy shooting range — Kobyliská střelnice — was where the Nazis executed hundreds of Czech resistance fighters, hostages, and ordinary citizens following the assassination of Reinhard Heydrich in 1942. The range saw the deaths of the paratroopers' associates, the Lidice villagers' male relatives, and anyone else the occupation determined was sufficiently connected to the act.\n\nThe shooting range is now a memorial, standing in contrast to the apartment blocks that surround it. Kobylisy as a district has continued the normal process of being a Prague neighbourhood — metro station, local shops, residents going about their lives — while carrying this history in its geography. Prague has several such places: sites where ordinary urban life continues directly adjacent to the weight of what happened.\n\nUnlock this location with the seriousness it deserves. Kobylisy is not difficult to reach — Line C, ten minutes from the centre — but it is the kind of place most visitors don't reach, which is a shame. The memorial is quiet and well-maintained. The shooting range no longer fires.`,
      cz: `Kobylisy jsou klidnou rezidenční čtvrtí na severu Prahy, ale pod jejich příměstským klidem se skrývá jedna z nejvýznamnějších historických ran tohoto města. Kobyliská střelnice byla místem, kde nacisté popravili stovky českých odbojářů, rukojmích a běžných občanů po atentátu na Reinharda Heydricha v roce 1942. Střelnice byla svědkem poprav spolupracovníků parašutistů, příbuzných lidických mužů a kohokoli, koho okupace shledala dostatečně spjatým s činem.\n\nStřelnice je dnes pietním místem, stojícím v kontrastu s okolními panelovými domy. Kobylisy jako čtvrť pokračovaly v běžném procesu pražské čtvrti — stanice metra, místní obchody, obyvatelé v každodenním životě — a přitom nesou tuto historii ve své geografii. Praha má několik takových míst: lokalit, kde běžný městský život pokračuje přímo vedle tíhy toho, co se stalo.\n\nOdemkni toto místo s náležitou vážností. Kobylisy nejsou těžko dostupné — linka C, deset minut od centra — ale patří k místům, kam většina návštěvníků nezavítá, a to je škoda. Pietní místo je klidné a dobře udržované. Střelnice již nestřílí.`,
      zh: `科比利西是布拉格北部一个安静的住宅区，但在其郊区的平静之下，隐藏着这座城市最重要的历史创伤之一。科比利西射击场是纳粹在1942年刺杀莱因哈德·海德里希事件之后，处决数百名捷克抵抗战士、人质和普通公民的地方。射击场见证了伞兵同伴、利迪采村男性亲属，以及任何被占领当局认定与该行动有足够关联的人的死亡。\n\n射击场现在是一处纪念地，与周围的公寓楼形成对比。科比利西作为街区继续了成为布拉格普通社区的正常进程——地铁站、本地商店、居民过着自己的生活——同时在其地理位置上承载着这段历史。布拉格有几处这样的地方：普通城市生活与历史的沉重直接毗邻的场所。\n\n以应有的严肃心情解锁此地。科比利西并不难到达——C线，距市中心十分钟——但它是大多数游客不会到达的那类地方，这是个遗憾。纪念地安静而维护良好。射击场不再射击了。`,
    },
  },
  {
    name: 'Basilica of St. Margaret',
    slug: 'bazilika-sv-margarety',
    labels: [],
    coordinates: { lat: 50.0846416, lng: 14.3565056 },
    rarity: 'rare',
    xpReward: 20,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Br%C4%9Bvnov_Monastery',
    pixelArtKey: '',
    localizedNames: { cz: 'Bazilika sv. Markéty Antiochijské', zh: '圣安提阿玛格丽特圣殿' },
    description: {
      en: `The Basilica of Saint Margaret of Antioch is the centrepiece of Břevnov Monastery — founded in 993 by Prince Boleslav II and Bishop Adalbert, making it the oldest surviving male monastery in Bohemia and one of those institutions that was already ancient when Charles Bridge was built. The current Baroque church was designed by Christoph Dientzenhofer in the early 18th century, because Prague's response to having a 10th-century monastery was evidently to give it an 18th-century makeover.\n\nSaint Margaret of Antioch was reportedly swallowed by a dragon and then burst out of it from the inside, which is either miraculous or a very unusual dietary arrangement. The church dedicated to her is considerably more sedate. The monastery is still occupied by Benedictine monks, who have maintained both the faith and the beer-brewing since the 10th century — a commitment to excellence on two very different fronts.\n\nUnlock this location, which requires going to Břevnov — slightly west of the tourist circuit, slightly beyond where most maps focus. The monastery gardens are open and peaceful. The beer brewed on the premises has been improving Czech morality since 993 and shows no signs of stopping.`,
      cz: `Bazilika sv. Markéty Antiochijské je centrem Břevnovského kláštera — založeného roku 993 knížetem Boleslavem II. a biskupem Vojtěchem, nejstaršího dochovaného mužského kláštera v Čechách a jedné z institucí, která byla již stará, když se stavěl Karlův most. Dnešní barokní kostel navrhl Kryštof Dientzenhofer na počátku 18. století, protože Praze nestačilo mít klášter ze 10. století bez renovace z 18. století.\n\nSvatá Markéta Antiochijská byla podle zpráv pohlcena drakem a prodrala se z něj zevnitř ven, což je buď zázrak, nebo velmi neobvyklá stravovací situace. Kostel jí zasvěcený je výrazně umírněnější. V klášteře dodnes žijí benediktinští mniši, kteří od 10. století pečují jak o víru, tak o vaření piva — závazek k excelenci na dvou velmi odlišných frontách.\n\nOdemkni toto místo — vyžaduje cestu do Břevnova, trochu na západ od turistického okruhu, trochu za hranicí, kde se většina map soustředí. Klášterní zahrada je otevřená a klidná. Pivo vařené na místě zlepšuje českou morálku od roku 993 a nejeví žádné známky toho, že by přestávalo.`,
      zh: `圣安提阿玛格丽特圣殿是布热夫诺夫修道院的核心——由波列斯拉夫二世王子与沃伊泰赫主教于993年创建，是波西米亚现存最古老的男性修道院，也是在查理大桥建造时就已经古老的机构之一。现存的巴洛克教堂由克里斯托弗·迪恩岑霍费尔在18世纪初设计，因为布拉格对拥有一座10世纪修道院的回应显然是给它一次18世纪的改造。\n\n据说圣安提阿玛格丽特曾被龙吞下，然后从内部破腹而出——这要么是奇迹，要么是一种非常不寻常的饮食安排。以她命名的教堂要低调得多。本笃会修士至今仍住在修道院里，自10世纪以来既守护信仰，又坚持酿酒——在两条截然不同的战线上保持卓越。\n\n解锁此地，需要前往布热夫诺夫——略微偏西于旅游线路，略微超出大多数地图关注的范围。修道院花园对外开放，宁静祥和。本笃会修士在此酿造的啤酒自993年以来一直在提升捷克的道德水准，并没有停下来的迹象。`,
    },
  },
];

async function run() {
  await connectDB();

  // ── Remove deprecated locations ──────────────────────────────────────────
  for (const slug of REMOVE_SLUGS) {
    const loc = await Location.findOne({ slug });
    if (!loc) {
      console.log(`Not found (already removed?): ${slug}`);
      continue;
    }
    const deleted = await CheckIn.deleteMany({ location: loc._id });
    await Location.deleteOne({ _id: loc._id });
    console.log(`Removed: ${slug} (${deleted.deletedCount} check-in(s) deleted)`);
  }

  // ── Seed new locations ────────────────────────────────────────────────────
  let inserted = 0;
  for (const loc of locations) {
    const result = await Location.updateOne(
      { slug: loc.slug },
      { $setOnInsert: { ...loc, isPreset: true } },
      { upsert: true },
    );
    if (result.upsertedCount) {
      console.log(`Inserted: ${loc.name}`);
      inserted++;
    } else {
      console.log(`Already exists: ${loc.name}`);
    }
  }

  console.log(`\nDone. ${inserted} new location(s) added.`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
