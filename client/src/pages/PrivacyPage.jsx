import { useT, useLang, useConvert } from '../context/LanguageContext';
import { useLocationConsent } from '../hooks/useLocationConsent';
import { setLocationConsent } from '../utils/locationConsent';

// Privacy notice (GDPR art. 13) plus the place to give or withdraw location
// consent at any time (art. 7(3): withdrawing must be as easy as agreeing).
// Reachable without signing in or entering guest mode. When the location
// section changes what it says, raise LOCATION_CONSENT_VERSION
// (utils/locationConsent.js) so everyone is asked again.

// Contact of the data controller, the private individual who runs the app
// (no company). GDPR art. 13(1)(a) asks for the controller's identity too:
// add a name to the first section before a wider public launch.
const CONTROLLER_EMAIL = 'zhyiwen820@gmail.com';
const UPDATED = '2026-10-22';

const POLICY = {
  en: [
    { h: 'Who is responsible', ps: [
      `Prague Stories is a hobby project run by a private individual, not a company. That person is the controller of your personal data under the EU General Data Protection Regulation (GDPR). For anything about your data, write to ${CONTROLLER_EMAIL}.`,
    ] },
    { h: 'Your location', ps: [
      'The app only reads your device\'s location after you have agreed to it, and only while the app is open. It is used to check you in at a place, to play the treasure hunts, to alert you when an undiscovered place is near (if you are signed in) and to show where you are on the map. The legal basis is your consent (art. 6(1)(a) GDPR).',
      'At a check-in or a treasure-hunt guess, your position is sent to our server to confirm that you are there. It is not stored with the check-in. During a treasure hunt the server works out the clues from your current position, and in the hardcore hunt it keeps one reference point for the "warmer / colder" hint, which is deleted when the hunt ends or when you withdraw consent. Which district and quarter you are in is worked out on your device and never sent. Your position is never sold, shared or used for advertising.',
      'Location is optional. Without it you can still browse every card, the map and the history, but you cannot collect cards or play the treasure hunts. You can withdraw your consent at any time at the top of this page; that does not affect what was done before. If you are under 15, please ask a parent before agreeing.',
    ] },
    { h: 'Your account', ps: [
      'If you register, we store your username, e-mail address and a hashed password, plus what you do in the game: the places you collected and when, XP, level, achievements, treasure-hunt progress, where you are in the History Timeline and your display settings. This is needed to provide the game you signed up for (art. 6(1)(b) GDPR) and is kept until you ask us to delete your account.',
      'Once you have earned XP, your username, XP, level, achievements and the places you collected (with the date) are shown publicly on the leaderboard and on your explorer page. Your e-mail address is never shown.',
    ] },
    { h: 'On your device', ps: [
      'The app saves a few things in your browser\'s local storage, such as your sign-in token, language, theme, your location choice and your reading position in the History Timeline. They are needed for the app to work as you set it up and stay on your device. There are no advertising or analytics cookies.',
    ] },
    { h: 'Services we use', ps: [
      'The app runs on Vercel (website) and Render (server), stores its data in MongoDB Atlas and serves some images through Cloudinary. The map tiles come from OpenStreetMap and the fonts from Google Fonts, so your browser connects to them and they see your IP address. These providers process data only to deliver their service, and hosting providers may keep short technical logs (such as IP addresses) for security. Some of them are based in the United States; such transfers rely on the EU-US Data Privacy Framework or the European Commission\'s standard contractual clauses.',
    ] },
    { h: 'Your rights', ps: [
      `You have the right to access your data, to have it corrected or deleted, to restrict or object to its processing, to receive it in a portable format and to withdraw consent at any time. Write to ${CONTROLLER_EMAIL} and I will answer within one month. You can also complain to a data protection authority; in the Czech Republic that is the Office for Personal Data Protection (Úřad pro ochranu osobních údajů, uoou.gov.cz).`,
    ] },
  ],
  cz: [
    { h: 'Kdo za údaje odpovídá', ps: [
      `Prague Stories je zájmový projekt, který provozuje soukromá osoba, ne firma. Ta je správcem tvých osobních údajů podle obecného nařízení o ochraně osobních údajů (GDPR). Se vším, co se týká tvých údajů, se obrať na ${CONTROLLER_EMAIL}.`,
    ] },
    { h: 'Tvoje poloha', ps: [
      'Aplikace čte polohu tvého zařízení až poté, co s tím souhlasíš, a jen když je otevřená. Slouží k zápisu návštěvy místa, k hledání pokladů, k upozornění na neobjevené místo poblíž (po přihlášení) a k zobrazení tvé polohy na mapě. Právním základem je tvůj souhlas (čl. 6 odst. 1 písm. a) GDPR).',
      'Při zápisu návštěvy nebo tipu při hledání pokladu se tvoje poloha pošle na náš server, aby ověřil, že jsi na místě. K návštěvě se neukládá. Během hledání pokladu server počítá nápovědy z tvé aktuální polohy a v hardcore režimu si drží jeden referenční bod pro nápovědu „přihořívá / samá voda“, který se smaže, když hledání skončí nebo když souhlas odvoláš. Ve které městské části a čtvrti jsi, se počítá jen v tvém zařízení a nikam se neposílá. Tvoji polohu nikdy neprodáváme, nesdílíme ani nepoužíváme k reklamě.',
      'Poloha je dobrovolná. Bez ní si dál můžeš prohlížet všechny karty, mapu i historii, ale nemůžeš sbírat karty ani hledat poklady. Souhlas můžeš kdykoli odvolat nahoře na této stránce; na tom, co proběhlo předtím, to nic nemění. Je-li ti méně než 15 let, zeptej se před souhlasem rodičů.',
    ] },
    { h: 'Tvůj účet', ps: [
      'Když se zaregistruješ, uložíme tvé uživatelské jméno, e-mail a zahashované heslo a k tomu, co ve hře děláš: sesbíraná místa a kdy, XP, úroveň, úspěchy, stav hledání pokladu, kde jsi v Historii a nastavení zobrazení. Je to nutné k poskytování hry, kterou používáš (čl. 6 odst. 1 písm. b) GDPR), a uchováváme to, dokud nás nepožádáš o smazání účtu.',
      'Jakmile získáš XP, je tvé uživatelské jméno, XP, úroveň, úspěchy a sesbíraná místa (i s datem) veřejně vidět v žebříčku a na tvé stránce průzkumníka. E-mail se nikde nezobrazuje.',
    ] },
    { h: 'Ve tvém zařízení', ps: [
      'Aplikace si v místním úložišti prohlížeče ukládá pár věcí, například přihlašovací token, jazyk, motiv, tvoji volbu ohledně polohy a místo, kde máš rozečtenou Historii. Jsou nutné, aby aplikace fungovala podle tvého nastavení, a zůstávají v tvém zařízení. Žádné reklamní ani analytické cookies nepoužíváme.',
    ] },
    { h: 'Služby, které používáme', ps: [
      'Aplikace běží na Vercelu (web) a Renderu (server), data ukládá v MongoDB Atlas a část obrázků načítá přes Cloudinary. Mapové podklady pocházejí z OpenStreetMap a písma z Google Fonts, takže se k nim tvůj prohlížeč připojuje a vidí tvou IP adresu. Tito poskytovatelé zpracovávají údaje jen kvůli své službě a hostingy mohou kvůli bezpečnosti krátce uchovávat technické záznamy (např. IP adresy). Někteří z nich sídlí v USA; takový přenos se opírá o rámec EU-USA pro ochranu údajů nebo o standardní smluvní doložky Evropské komise.',
    ] },
    { h: 'Tvoje práva', ps: [
      `Máš právo na přístup ke svým údajům, na jejich opravu nebo výmaz, na omezení zpracování, vznést námitku, získat údaje v přenositelném formátu a kdykoli odvolat souhlas. Napiš na ${CONTROLLER_EMAIL}, odpovím do jednoho měsíce. Můžeš také podat stížnost u Úřadu pro ochranu osobních údajů (uoou.gov.cz).`,
    ] },
  ],
  zh: [
    { h: '谁负责你的数据', ps: [
      `Prague Stories 是由个人运营的业余项目，不属于任何公司。运营者本人是欧盟《通用数据保护条例》（GDPR）意义上你个人数据的控制者。有关你数据的任何问题，请写信至 ${CONTROLLER_EMAIL}。`,
    ] },
    { h: '你的位置', ps: [
      '只有在你同意之后，应用才会读取设备的位置，而且只在应用打开时读取。位置用于在地点打卡、玩寻宝、在附近有未发现的地点时提醒你（登录后），以及在地图上显示你在哪里。法律依据是你的同意（GDPR 第6条第1款(a)项）。',
      '打卡或寻宝猜测时，你的位置会发送到我们的服务器，以确认你确实在现场，但不会随打卡记录保存。寻宝进行中，服务器根据你当前的位置计算线索；硬核模式下，服务器会保留一个参考点用于“变近／变远”提示，寻宝结束或你撤回同意时即删除。你所在的区和片区只在你的设备上计算，不会发送出去。你的位置绝不会被出售、分享或用于广告。',
      '定位是可选的。不开定位，你仍然可以浏览所有卡片、地图和历史，但无法收集卡片，也无法玩寻宝。你可以随时在本页顶部撤回同意，撤回不影响此前已进行的处理。如果你未满15岁，请先征得父母同意。',
    ] },
    { h: '你的账户', ps: [
      '注册后，我们会保存你的用户名、电子邮箱和加密后的密码，以及你在游戏中的记录：收集了哪些地点、何时收集、XP、等级、成就、寻宝进度、历史时间线的阅读位置和显示设置。这些是提供你所注册的游戏所必需的（GDPR 第6条第1款(b)项），会一直保留到你要求删除账户为止。',
      '获得 XP 之后，你的用户名、XP、等级、成就和已收集的地点（含收集日期）会公开显示在排行榜和你的探索者页面上。电子邮箱从不公开。',
    ] },
    { h: '保存在你设备上的内容', ps: [
      '应用会在浏览器的本地存储中保存几项内容，例如登录凭证、语言、主题、你的定位选择，以及历史时间线的阅读位置。这些是让应用按你的设置正常运行所必需的，只留在你的设备上。我们不使用任何广告或统计类 Cookie。',
    ] },
    { h: '我们使用的服务', ps: [
      '应用运行在 Vercel（网站）和 Render（服务器）上，数据存放在 MongoDB Atlas，部分图片通过 Cloudinary 提供。地图底图来自 OpenStreetMap，字体来自 Google Fonts，因此你的浏览器会连接到它们，它们能看到你的 IP 地址。这些服务商只为提供自身服务而处理数据，托管服务商可能出于安全原因短期保存技术日志（如 IP 地址）。其中部分服务商位于美国，这类传输依据《欧美数据隐私框架》或欧盟委员会的标准合同条款进行。',
    ] },
    { h: '你的权利', ps: [
      `你有权访问自己的数据，要求更正或删除，限制或反对处理，以可携带的格式获取数据，并可随时撤回同意。请写信至 ${CONTROLLER_EMAIL}，我会在一个月内答复。你也可以向数据保护监管机构投诉，在捷克是个人数据保护办公室（uoou.gov.cz）。`,
    ] },
  ],
};

export default function PrivacyPage() {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const { consent } = useLocationConsent();
  const sections = POLICY[lang] || POLICY.en;

  const decidedOn = consent
    ? new Date(consent.at).toLocaleDateString(lang === 'cz' ? 'cs-CZ' : lang === 'zh' ? 'zh-CN' : 'en-GB')
    : null;
  const status = !consent ? t('privacy.statusNone')
    : consent.granted ? t('privacy.statusOn', { date: decidedOn })
    : t('privacy.statusOff', { date: decidedOn });

  return (
    <div className="guide-page privacy-page">
      <div className="guide-wrap">
        <h1 className="px-title" style={{ fontSize: 26, marginBottom: 6 }}>{t('privacy.title')}</h1>
        <p className="guide-intro">{t('privacy.updated', { date: UPDATED })}</p>

        <section className="privacy-consent" aria-labelledby="privacy-consent-title">
          <h2 id="privacy-consent-title" className="guide-h2">📍 {t('privacy.consentTitle')}</h2>
          <p>{status}</p>
          {consent && <p className="privacy-consent__hint">{t('privacy.browserHint')}</p>}
          <div className="location-consent__actions">
            {consent?.granted ? (
              <button type="button" className="px-btn px-btn--outline" onClick={() => setLocationConsent(false)}>
                {t('privacy.withdraw')}
              </button>
            ) : (
              <>
                <button type="button" className="px-btn px-btn--outline" onClick={() => setLocationConsent(true)}>
                  {t('consent.allow')}
                </button>
                {!consent && (
                  <button type="button" className="px-btn px-btn--outline" onClick={() => setLocationConsent(false)}>
                    {t('consent.deny')}
                  </button>
                )}
              </>
            )}
          </div>
        </section>

        {sections.map(s => (
          <section key={s.h} className="guide-section privacy-section">
            <h2 className="guide-h2">{convert(s.h)}</h2>
            {s.ps.map((p, i) => <p key={i}>{convert(p)}</p>)}
          </section>
        ))}
      </div>
    </div>
  );
}
