import { Link, useLocation } from 'react-router-dom';
import { useT } from '../../context/LanguageContext';
import { useLocationConsent } from '../../hooks/useLocationConsent';
import { setLocationConsent } from '../../utils/locationConsent';

// Asks for consent to use the device's location (utils/locationConsent.js).
// Shown when the app opens and the user hasn't decided yet (or decided on an
// older version of this notice), and again whenever they start something
// that needs their position after saying no. GDPR: says what is collected,
// why, where it goes and how long it is kept, before anything is collected;
// both answers are one tap and look the same (no nudging), and the app works
// without consent. Withdrawing is on the Privacy page.
export default function LocationConsentDialog() {
  const t = useT();
  const { pathname } = useLocation();
  const { consent, requested } = useLocationConsent();
  if (consent && !requested) return null;
  // The Privacy page has the same choice inline; let it be read in full.
  if (pathname === '/privacy') return null;

  return (
    <div className="px-overlay location-consent" style={{ zIndex: 2100 }}>
      <div className="px-modal location-consent__box" role="dialog" aria-modal="true" aria-labelledby="location-consent-title">
        <h2 id="location-consent-title" className="px-title location-consent__title">📍 {t('consent.title')}</h2>
        <p>{t('consent.why')}</p>
        <p>{t('consent.what')}</p>
        <p>{t('consent.optional')}</p>
        <div className="location-consent__actions">
          <button type="button" className="px-btn px-btn--outline" onClick={() => setLocationConsent(true)}>
            {t('consent.allow')}
          </button>
          <button type="button" className="px-btn px-btn--outline" onClick={() => setLocationConsent(false)}>
            {t('consent.deny')}
          </button>
        </div>
        <Link to="/privacy" className="location-consent__policy">{t('consent.policyLink')}</Link>
      </div>
    </div>
  );
}
