import { useState } from 'react';
import { useWindowEntrance } from '../../hooks/useModalEntrance';
import { locationAPI } from '../../services/api';
import { useLang } from '../../context/LanguageContext';
import { LABEL_DEFINITIONS } from '../../utils/pixelArtMap';

export default function LabelEditorModal({ location, onClose, onUpdated }) {
  const { overlayRef, modalRef, close } = useWindowEntrance(onClose);
  const { lang } = useLang();
  const [selected, setSelected] = useState(location.labels || []);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const toggle = key => setSelected(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
  );

  const getLabelName = (key, def) => {
    return lang === 'zh' ? def.zh : lang === 'cz' ? def.cz : def.en;
  };

  const save = async () => {
    setLoading(true); setError('');
    try {
      const res = await locationAPI.update(location.slug, { labels: selected });
      onUpdated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={overlayRef} className="px-overlay" onClick={e => e.target === e.currentTarget && close()}>
      <div ref={modalRef} className="px-modal" style={{ maxWidth: 480 }}>
        <button className="px-modal__close" onClick={close}>✕</button>
        <div className="px-modal__header" style={{ background: 'var(--bg-surface)', padding: '20px 20px 16px' }}>
          <h2 className="px-title" style={{ fontSize: 20 }}>Edit Labels — {location.name}</h2>
        </div>
        <div className="px-modal__body">
          <div className="label-filter__panel label-filter__panel--inline" style={{ marginBottom: 20 }}>
            {Object.entries(LABEL_DEFINITIONS).map(([key, def]) => (
              <button
                key={key}
                type="button"
                className={`label-pill${selected.includes(key) ? ' label-pill--active' : ''}`}
                onClick={() => toggle(key)}
              >
                {getLabelName(key, def)}
              </button>
            ))}
          </div>
          {error && <p className="form-error">{error}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="px-btn px-btn--gold" onClick={save} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button className="px-btn px-btn--dark" onClick={close}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
