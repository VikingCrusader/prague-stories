import { useT } from '../../context/LanguageContext';

// The Quick Start window's pictures (2026-11-14): three phone sketches in the
// Install window's style, built from the app's own wording so every language
// matches: the sign-up form, the location consent dialog, the alerts opt-in.
// Each carries the bold half of its step from `start` (utils/guideContent.js).
function Page({ children }) {
  return (
    <div className="guide-mock guide-mock--app">
      <div className="guide-mock__appbar"><img src="/brand/favicon.png" alt="" />Prague Stories</div>
      <div className="guide-mock__appbody">{children}</div>
    </div>
  );
}

export default function StartDemo({ c }) {
  const t = useT();
  const sketches = [
    <Page key="register">
      <strong className="guide-mock__apptitle">{t('auth.register')}</strong>
      {['auth.username', 'auth.email', 'auth.password'].map(k => (
        <span key={k} className="guide-mock__field"><small>{t(k)}</small><i /></span>
      ))}
      <span className="guide-mock__appbtn guide-mock__hit">{t('auth.register')}</span>
    </Page>,
    <Page key="location">
      <span className="guide-mock__cards guide-mock__cards--dim"><i /><i /><i /><i /></span>
      <div className="guide-mock__dialog guide-mock__dialog--app">
        <strong>📍 {t('consent.title')}</strong>
        <span className="guide-mock__buttons guide-mock__buttons--app">
          <span className="guide-mock__hit">{t('consent.allow')}</span>
          <span>{t('consent.deny')}</span>
        </span>
      </div>
    </Page>,
    <Page key="alerts">
      <span className="guide-mock__cards guide-mock__cards--dim"><i /><i /><i /><i /></span>
      <div className="guide-mock__dialog guide-mock__dialog--app">
        <strong>🔔 {t('notif.optInTitle')}</strong>
        <small>{t('notif.optInBody')}</small>
        <span className="guide-mock__buttons guide-mock__buttons--app">
          <span className="guide-mock__hit">{t('notif.optInEnable')}</span>
        </span>
      </div>
    </Page>,
  ];
  return (
    <ol className="guide-install__row guide-start">
      {sketches.map((sketch, i) => (
        <li key={i} className="guide-install__step">
          <span className="guide-install__phone guide-install__phone--mock">{sketch}</span>
          <span className="guide-install__caption"><b>{i + 1}</b>{c.start[i]?.b}</span>
        </li>
      ))}
    </ol>
  );
}
