import { useLang, useConvert } from '../../context/LanguageContext';
import { BOARD } from '../../utils/guideBoard';

// iPhone: three plain sketches of Safari's screens (iOS 26), drawn in HTML
// like the Android ones, so the two rows match; what to tap is ringed.
function MockPage() {
  return (
    <div className="guide-mock__page">
      <span className="guide-mock__brand"><img src="/brand/favicon.png" alt="" />Praguedex</span>
      <span className="guide-mock__cards"><i /><i /><i /><i /></span>
    </div>
  );
}
function SafariBar({ ring }) {
  return (
    <div className="guide-mock__bar">
      <span className="guide-mock__url">praguedex.com</span>
      <span className={`guide-mock__dots${ring ? ' guide-mock__hit' : ''}`}>⋯</span>
    </div>
  );
}
const SAFARI_MENU = ['Share', 'Add to Bookmarks', 'Add Bookmark to…', 'New Tab', 'New Private Tab'];
const SHARE_ROWS = ['Add Bookmark to…', 'Add to Favourites', 'Add to Quick Note', 'Find on Page', 'Add to Home Screen', 'Markup', 'Print'];
const IOS_MOCKS = [
  <div className="guide-mock guide-mock--ios">
    <MockPage />
    <ul className="guide-mock__menu guide-mock__menu--ios">
      {SAFARI_MENU.map(m => <li key={m} className={m === 'Share' ? 'guide-mock__hit' : undefined}>{m}</li>)}
    </ul>
    <SafariBar ring />
  </div>,
  <div className="guide-mock guide-mock--ios">
    <MockPage />
    <div className="guide-mock__sheet">
      <span className="guide-mock__app"><img src="/brand/app-icon.png" alt="" />Praguedex<small>praguedex.com</small></span>
      <ul className="guide-mock__list">
        {SHARE_ROWS.map(m => <li key={m} className={m === 'Add to Home Screen' ? 'guide-mock__hit' : undefined}>{m}</li>)}
      </ul>
    </div>
  </div>,
  <div className="guide-mock guide-mock--ios">
    <div className="guide-mock__sheet guide-mock__sheet--full">
      <span className="guide-mock__sheet-head"><span className="guide-mock__x">✕</span><strong>Add to Home Screen</strong><span className="guide-mock__add guide-mock__hit">Add</span></span>
      <span className="guide-mock__app guide-mock__app--row"><img src="/brand/app-icon.png" alt="" />Praguedex<small>praguedex.com</small></span>
      <span className="guide-mock__toggle-row">Open as Web App<span className="guide-mock__toggle guide-mock__hit" /></span>
    </div>
  </div>,
];

// Android: three plain sketches of Chrome's screens. Both rows use the
// browsers' own labels, in English.
function ChromeTop({ ring }) {
  return (
    <div className="guide-mock__top">
      <span className="guide-mock__url">praguedex.com</span>
      <span className={`guide-mock__dots${ring ? ' guide-mock__hit' : ''}`}>⋮</span>
    </div>
  );
}
const MENU = ['New tab', 'New Incognito tab', 'History', 'Downloads', 'Bookmarks', 'Share…', 'Find in page', 'Install app', 'Desktop site', 'Settings'];
const ANDROID_MOCKS = [
      <div className="guide-mock">
        <ChromeTop ring />
        <MockPage />
      </div>,
      <div className="guide-mock">
        <ChromeTop />
        <MockPage />
        <ul className="guide-mock__menu">
          {MENU.map(m => <li key={m} className={m === 'Install app' ? 'guide-mock__hit' : undefined}>{m}</li>)}
        </ul>
      </div>,
      <div className="guide-mock">
        <ChromeTop />
        <MockPage />
        <div className="guide-mock__dialog">
          <strong>Install app</strong>
          <span className="guide-mock__app"><img src="/brand/app-icon.png" alt="" />Praguedex<small>praguedex.com</small></span>
          <span className="guide-mock__buttons"><span>Cancel</span><span className="guide-mock__hit">Install</span></span>
        </div>
      </div>,
];

// The Install tile's demo: the steps as pictures, each with its line from
// the handbook (installIOS / installAndroid) under it.
export default function InstallDemo({ c }) {
  const { lang } = useLang();
  const convert = useConvert();
  const b = (BOARD[lang] || BOARD.en).install;
  return (
    <div className="guide-install">
      <div className="guide-install__group">
      <h4 className="guide-install__os">{c.installIOSTitle}</h4>
      <ol className="guide-install__row">
        {IOS_MOCKS.map((mock, i) => (
          <li key={i} className="guide-install__step">
            <span className="guide-install__phone guide-install__phone--mock">{mock}</span>
            <span className="guide-install__caption"><b>{i + 1}</b>{c.installIOS[i]}</span>
          </li>
        ))}
      </ol>
      </div>
      <div className="guide-install__group">
      <h4 className="guide-install__os">{c.installAndroidTitle}</h4>
      <ol className="guide-install__row guide-install__row--android">
        {ANDROID_MOCKS.map((mock, i) => (
          <li key={i} className="guide-install__step">
            <span className="guide-install__phone guide-install__phone--mock">{mock}</span>
            <span className="guide-install__caption"><b>{i + 1}</b>{c.installAndroid[i]}</span>
          </li>
        ))}
      </ol>
      </div>
      <p className="guide-demo__hint guide-install__note">{convert(b.mockNote)}</p>
    </div>
  );
}
