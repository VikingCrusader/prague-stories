import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang, useT, useConvert } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';

const AUTO_DISMISS_MS = 12000;

export default function ProximityToast({ location, onDismiss }) {
  const { lang } = useLang();
  const t = useT();
  const convert = useConvert();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [location.slug, onDismiss]);

  const name = convert(getLocName(location, lang));
  const body = t('proximity.prompt').replace('{name}', name);

  return (
    <div style={{
      position: 'fixed',
      top: 64,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1900,
      background: 'var(--bg-surface)',
      border: '2px solid var(--gold)',
      padding: '12px 16px',
      maxWidth: 400,
      width: 'calc(100% - 48px)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    }}>
      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>★</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: 'var(--gold)', marginBottom: 4 }}>
          {t('proximity.title')}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {body}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
        <button
          className="px-btn px-btn--gold"
          style={{ fontSize: 11, padding: '6px 12px' }}
          onClick={() => {
            navigate('/explore', { state: { openSlug: location.slug } });
            onDismiss();
          }}
        >
          {t('common.checkIn')}
        </button>
        <button
          className="px-btn px-btn--dark"
          style={{ fontSize: 11, padding: '6px 12px' }}
          onClick={onDismiss}
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  );
}
