import { useState } from 'react';
import { locationAPI } from '../../services/api';
import { useT, useLang } from '../../context/LanguageContext';
import { LABEL_DEFINITIONS } from '../../utils/pixelArtMap';

const MAX_BYTES = 1 * 1024 * 1024;

export default function AddLocationForm({ onClose, onAdded }) {
  const t = useT();
  const { lang } = useLang();
  const [form, setForm] = useState({
    name: '', lat: '', lng: '', wikipediaUrl: '', description: '',
  });
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [coverImage, setCoverImage] = useState('');
  const [preview, setPreview]       = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const toggleLabel = lb => {
    setSelectedLabels(prev =>
      prev.includes(lb) ? prev.filter(l => l !== lb) : [...prev, lb]
    );
  };

  const handleImage = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setError(t('add.coverPhotoHint'));
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      setCoverImage(ev.target.result);
      setPreview(ev.target.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const submit = async e => {
    e.preventDefault();
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (isNaN(lat) || isNaN(lng)) { setError('Latitude and longitude must be valid numbers.'); return; }
    if (lat < 48 || lat > 52 || lng < 13 || lng > 16) { setError('Coordinates must be within the Prague region.'); return; }

    setError(''); setLoading(true);
    try {
      const res = await locationAPI.create({
        ...form,
        labels: selectedLabels,
        coordinates: { lat, lng },
        coverImage,
      });
      onAdded(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="px-modal">
        <button className="px-modal__close" onClick={onClose}>✕</button>
        <div className="px-modal__header" style={{ background: '#141830', padding: 0, overflow: 'hidden', minHeight: 120 }}>
          {preview ? (
            <img src={preview} alt="cover preview" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 20px' }}>
              <span style={{ fontSize: '3rem' }}>📍</span>
              <h2 className="px-title" style={{ fontSize: 11 }}>{t('add.title')}</h2>
            </div>
          )}
        </div>
        <div className="px-modal__body">
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">{t('add.name')}</label>
              <input className="px-input" name="name" value={form.name} onChange={handle} required maxLength={100} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('add.labels')}</label>
              <div className="label-filter__panel label-filter__panel--inline">
                {Object.entries(LABEL_DEFINITIONS).map(([key, def]) => (
                  <button
                    key={key}
                    type="button"
                    className={`label-pill${selectedLabels.includes(key) ? ' label-pill--active' : ''}`}
                    onClick={() => toggleLabel(key)}
                  >
                    {lang === 'zh' ? def.zh : lang === 'cz' ? def.cz : def.en}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">{t('add.latitude')}</label>
                <input className="px-input" name="lat" placeholder="50.0875" value={form.lat} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('add.longitude')}</label>
                <input className="px-input" name="lng" placeholder="14.4213" value={form.lng} onChange={handle} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('add.description')}</label>
              <textarea
                className="px-input"
                name="description"
                value={form.description}
                onChange={handle}
                rows={3}
                maxLength={1000}
                style={{ resize: 'vertical', minHeight: 72 }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('add.wikiUrl')}</label>
              <input className="px-input" name="wikipediaUrl" value={form.wikipediaUrl} onChange={handle} type="url" placeholder="https://en.wikipedia.org/wiki/..." />
            </div>
            <div className="form-group">
              <label className="form-label">{t('add.coverPhoto')}</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImage}
                style={{ color: 'var(--text-primary)', fontSize: 14, width: '100%' }}
              />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('add.coverPhotoHint')}</span>
            </div>
            {error && <p className="form-error">{error}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="px-btn px-btn--gold" disabled={loading}>
                {loading ? t('add.adding') : t('explore.addLocation')}
              </button>
              <button type="button" className="px-btn px-btn--dark" onClick={onClose}>{t('common.cancel')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
