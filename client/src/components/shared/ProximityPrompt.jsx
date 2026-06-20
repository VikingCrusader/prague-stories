import { useState } from 'react';
import { checkinAPI } from '../../services/api';
import { useLang, useT } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';

export default function ProximityPrompt({ discovery, onDismiss, onCheckIn }) {
  const { lang } = useLang();
  const t = useT();
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [xpEarned, setXpEarned] = useState(null);

  if (!discovery) return null;

  const { location, coords } = discovery;
  const name = getLocName(location, lang);

  const handleCheckIn = async () => {
    setLoading(true); setError('');
    try {
      const res = await checkinAPI.checkIn(location.slug, coords);
      setXpEarned(res.data.xpEarned);
      onCheckIn(location.slug, res.data);
      setTimeout(onDismiss, 2500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Check-in failed');
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 2000,
      background: 'var(--bg-surface)',
      border: '2px solid var(--gold)',
      padding: '18px 22px',
      maxWidth: 400,
      width: 'calc(100% - 48px)',
      boxShadow: '0 0 28px rgba(255,215,0,0.25)',
    }}>
      {xpEarned !== null ? (
        <p style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: '#8eff8e', textAlign: 'center' }}>
          +{xpEarned} XP ★
        </p>
      ) : (
        <>
          <p style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: 'var(--gold)', marginBottom: 10 }}>
            {t('proximity.title')}
          </p>
          <p style={{ fontSize: 17, marginBottom: 14, lineHeight: 1.5 }}>
            {t('proximity.prompt', { name })}
          </p>
          {error && <p style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 10 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="px-btn px-btn--gold" onClick={handleCheckIn} disabled={loading}>
              {loading ? '...' : t('common.checkIn')}
            </button>
            <button className="px-btn px-btn--dark" onClick={onDismiss}>
              {t('common.cancel')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
