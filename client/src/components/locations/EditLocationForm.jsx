import { useState } from 'react';
import { locationAPI } from '../../services/api';
import { LABEL_DEFINITIONS } from '../../utils/pixelArtMap';
import { useLang } from '../../context/LanguageContext';

const MAX_BYTES = 1 * 1024 * 1024;

export default function EditLocationForm({ location, onClose, onUpdated }) {
  const { lang } = useLang();
  const [form, setForm] = useState({
    name:         location.name                   || '',
    nameCz:       location.localizedNames?.cz     || '',
    nameZh:       location.localizedNames?.zh     || '',
    coords:       `${location.coordinates?.lat ?? ''},${location.coordinates?.lng ?? ''}`,
    wikipediaUrl: location.wikipediaUrl           || '',
    xpReward:     location.xpReward?.toString()   || '15',
    difficulty:   location.difficulty?.toString() || '1',
    descEn:       location.description?.en        || '',
    descCz:       location.description?.cz        || '',
    descZh:       location.description?.zh        || '',
  });
  const [selectedLabels, setSelectedLabels] = useState(location.labels || []);
  const [coverImage, setCoverImage] = useState(location.coverImage || '');
  const [preview, setPreview]       = useState(location.coverImage || '');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const toggleLabel = lb => {
    setSelectedLabels(prev =>
      prev.includes(lb) ? prev.filter(l => l !== lb) : [...prev, lb]
    );
  };

  const getLabelName = (key, def) => {
    return lang === 'zh' ? def.zh : lang === 'cz' ? def.cz : def.en;
  };

  const handleImage = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_BYTES) { setError('Image must be under 1 MB'); e.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = ev => { setCoverImage(ev.target.result); setPreview(ev.target.result); setError(''); };
    reader.readAsDataURL(file);
  };

  const submit = async e => {
    e.preventDefault();
    const [rawLat, rawLng] = form.coords.split(',').map(s => s.trim());
    const lat = parseFloat(rawLat);
    const lng = parseFloat(rawLng);
    if (isNaN(lat) || isNaN(lng)) { setError('Enter coordinates as "Latitude, Longitude" e.g. 50.0755, 14.4378'); return; }

    setError(''); setLoading(true);
    try {
      const res = await locationAPI.update(location.slug, {
        name:           form.name,
        localizedNames: { cz: form.nameCz, zh: form.nameZh },
        labels:         selectedLabels,
        coordinates:    { lat, lng },
        wikipediaUrl:   form.wikipediaUrl,
        xpReward:       parseInt(form.xpReward, 10),
        difficulty:     parseInt(form.difficulty, 10),
        description:    { en: form.descEn, cz: form.descCz, zh: form.descZh },
        coverImage,
      });
      onUpdated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="px-modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="px-modal__close" onClick={onClose}>✕</button>
        <div className="px-modal__header" style={{ background: '#141830', padding: 0, overflow: 'hidden', minHeight: 80 }}>
          {preview ? (
            <img src={preview} alt="cover" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px' }}>
              <span style={{ fontSize: '2rem' }}>✏️</span>
              <h2 className="px-title" style={{ fontSize: 10 }}>Edit Location</h2>
            </div>
          )}
        </div>

        <div className="px-modal__body">
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Name (EN)</label>
              <input className="px-input" name="name" value={form.name} onChange={handle} required maxLength={100} />
            </div>
            <div className="form-group">
              <label className="form-label">Name (CZ)</label>
              <input className="px-input" name="nameCz" value={form.nameCz} onChange={handle} maxLength={100} />
            </div>
            <div className="form-group">
              <label className="form-label">Name (ZH)</label>
              <input className="px-input" name="nameZh" value={form.nameZh} onChange={handle} maxLength={100} />
            </div>

            <div className="form-group">
              <label className="form-label">Labels</label>
              <div className="label-filter__panel label-filter__panel--inline">
                {Object.entries(LABEL_DEFINITIONS).map(([key, def]) => (
                  <button
                    key={key}
                    type="button"
                    className={`label-pill${selectedLabels.includes(key) ? ' label-pill--active' : ''}`}
                    onClick={() => toggleLabel(key)}
                  >
                    {getLabelName(key, def)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Coordinates</label>
              <input className="px-input" name="coords" value={form.coords} onChange={handle} required placeholder="50.0755, 14.4378" />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Latitude, Longitude</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">XP Reward</label>
                <select className="px-input" name="xpReward" value={form.xpReward} onChange={handle}>
                  {[10, 15, 20, 25, 30].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select className="px-input" name="difficulty" value={form.difficulty} onChange={handle}>
                  <option value="1">1 — Easy</option>
                  <option value="2">2 — Medium</option>
                  <option value="3">3 — Hard</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Wikipedia URL</label>
              <input className="px-input" name="wikipediaUrl" value={form.wikipediaUrl} onChange={handle} type="url" placeholder="https://en.wikipedia.org/wiki/..." />
            </div>

            <div className="form-group">
              <label className="form-label">Description (EN)</label>
              <textarea className="px-input" name="descEn" value={form.descEn} onChange={handle} rows={3} style={{ resize: 'vertical', minHeight: 72 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Description (CZ)</label>
              <textarea className="px-input" name="descCz" value={form.descCz} onChange={handle} rows={3} style={{ resize: 'vertical', minHeight: 72 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Description (ZH)</label>
              <textarea className="px-input" name="descZh" value={form.descZh} onChange={handle} rows={3} style={{ resize: 'vertical', minHeight: 72 }} />
            </div>

            <div className="form-group">
              <label className="form-label">Cover Photo</label>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} style={{ color: 'var(--text-primary)', fontSize: 14, width: '100%' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Max 1 MB · replaces existing image</span>
            </div>

            {error && <p className="form-error">{error}</p>}

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="px-btn px-btn--gold" disabled={loading}>
                {loading ? 'Saving...' : 'Save changes'}
              </button>
              <button type="button" className="px-btn px-btn--dark" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
