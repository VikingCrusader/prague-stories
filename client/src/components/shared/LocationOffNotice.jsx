import { Link } from 'react-router-dom';
import { useT } from '../../context/LanguageContext';
import { useLocationConsent } from '../../hooks/useLocationConsent';
import { requestLocationConsent } from '../../utils/locationConsent';

// For pages that can't work without the user's position (the treasure
// hunts): while location use isn't allowed, says so and offers the consent
// dialog again, instead of an endless "Finding your position…".
export default function LocationOffNotice() {
  const t = useT();
  const { consent } = useLocationConsent();
  if (consent?.granted) return null;
  return (
    <div className="location-off">
      <p>📍 {t('consent.offNotice')}</p>
      <div className="location-off__actions">
        <button type="button" className="px-btn px-btn--outline px-btn--sm" onClick={() => requestLocationConsent()}>
          {t('consent.allow')}
        </button>
        <Link to="/privacy">{t('consent.policyLink')}</Link>
      </div>
    </div>
  );
}
