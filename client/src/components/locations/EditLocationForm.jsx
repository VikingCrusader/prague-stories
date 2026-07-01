import { useState } from 'react';
import { locationAPI } from '../../services/api';
import { LABEL_DEFINITIONS } from '../../utils/pixelArtMap';
import { useLang } from '../../context/LanguageContext';
import { RARITY_XP, RARITY_COLOR, RARITY_LABEL } from '../../utils/rarity';

export default function EditLocationForm({ location, onClose, onUpdated }) {
  const { lang } = useLang();
  const [form, setForm] = useState({
    name:         location.name                   || '',
    nameCz:       location.localizedNames?.cz     || '',
    nameZh:       location.localizedNames?.zh     || '',
    coords:       `${location.coordinates?.lat ?? ''},${location.coordinates?.lng ?? ''}`,
    wikipediaUrl: location.wikipediaUrl           || '',
    rarity:       location.rarity || 'common',
    descEn:       location.description?.en        || '',
    descCz:       location.description?.cz        || '',
    descZh:       location.description?.zh        || '',
  });
  const [selectedLabels, setSelectedLabels] = useState(location.labels || []);
  const [primaryLabel, setPrimaryLabel] = useState(location.labels?.[0] || '');
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview]     = useState(location.coverImage || '');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  function segmentDesc(text, lang) {
    if (!text || text.includes('\n\n')) return text;
    const keyword = lang === 'en' ? 'Unlock' : lang === 'cz' ? 'Odemkni' : '解锁';
    const unlockIdx = text.indexOf(keyword);
    if (unlockIdx === -1) return text;
    const before = text.substring(0, unlockIdx);
    const para3 = text.substring(unlockIdx).trim();
    const ends = [];
    if (lang === 'zh') {
      const re = /[。！？]/g; let m;
      while ((m = re.exec(before)) !== null) ends.push(m.index + 1);
    } else {
      const re = /[.!?]\s+/g; let m;
      while ((m = re.exec(before)) !== null) ends.push(m.index + m[0].length);
    }
    if (ends.length < 2) return `${before.trim()}\n\n${para3}`;
    const mid = before.length / 2;
    const splitAt = ends.reduce((best, idx) =>
      Math.abs(idx - mid) < Math.abs(best - mid) ? idx : best, ends[0]);
    const para1 = before.substring(0, splitAt).trim();
    const para2 = before.substring(splitAt).trim();
    return para2 ? `${para1}\n\n${para2}\n\n${para3}` : `${para1}\n\n${para3}`;
  }

  const handleDescPaste = (fieldName, lang) => e => {
    const pasted = e.clipboardData.getData('text');
    if (!pasted.includes('\n\n')) {
      const segmented = segmentDesc(pasted, lang);
      if (segmented !== pasted) {
        e.preventDefault();
        setForm(p => ({ ...p, [fieldName]: segmented }));
      }
    }
  };

  const toggleLabel = lb => {
    setSelectedLabels(prev => {
      const next = prev.includes(lb) ? prev.filter(l => l !== lb) : [...prev, lb];
      setPrimaryLabel(p => (next.includes(p) ? p : next[0] || ''));
      return next;
    });
  };

  const getLabelName = (key, def) => {
    return lang === 'zh' ? def.zh : lang === 'cz' ? def.cz : def.en;
  };

  const handleImage = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const submit = async e => {
    e.preventDefault();
    const [rawLat, rawLng] = form.coords.split(',').map(s => s.trim());
    const lat = parseFloat(rawLat);
    const lng = parseFloat(rawLng);
    if (isNaN(lat) || isNaN(lng)) { setError('Enter coordinates as "Latitude, Longitude" e.g. 50.0755, 14.4378'); return; }

    const orderedLabels = primaryLabel && selectedLabels.includes(primaryLabel)
      ? [primaryLabel, ...selectedLabels.filter(l => l !== primaryLabel)]
      : selectedLabels;

    setError(''); setLoading(true);
    try {
      const res = await locationAPI.update(location.slug, {
        name:           form.name,
        localizedNames: { cz: form.nameCz, zh: form.nameZh },
        labels:         orderedLabels,
        coordinates:    { lat, lng },
        wikipediaUrl:   form.wikipediaUrl,
        rarity:         form.rarity,
        description:    { en: form.descEn, cz: form.descCz, zh: form.descZh },
      });
      let updated = res.data;
      if (coverFile) {
        const coverRes = await locationAPI.uploadCover(location.slug, coverFile);
        updated = coverRes.data;
      }
      onUpdated(updated);
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

            {selectedLabels.length > 0 && (
              <div className="form-group">
                <label className="form-label">Primary Label (shown on card)</label>
                <div className="label-filter__panel label-filter__panel--inline">
                  {selectedLabels.map(key => (
                    <button
                      key={key}
                      type="button"
                      className={`label-pill${primaryLabel === key ? ' label-pill--active' : ''}`}
                      onClick={() => setPrimaryLabel(key)}
                    >
                      {primaryLabel === key ? '★ ' : ''}{getLabelName(key, LABEL_DEFINITIONS[key])}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Coordinates</label>
              <input className="px-input" name="coords" value={form.coords} onChange={handle} required placeholder="50.0755, 14.4378" />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Latitude, Longitude</span>
            </div>

            <div className="form-group">
              <label className="form-label">Rarity</label>
              <select className="px-input" name="rarity" value={form.rarity} onChange={handle}
                style={{ color: RARITY_COLOR[form.rarity] }}>
                {['common', 'rare', 'superior', 'epic', 'mythic', 'legend'].map(r => (
                  <option key={r} value={r} style={{ color: RARITY_COLOR[r] }}>
                    {RARITY_LABEL.en[r]} — +{RARITY_XP[r]} XP
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Wikipedia URL</label>
              <input className="px-input" name="wikipediaUrl" value={form.wikipediaUrl} onChange={handle} type="url" placeholder="https://en.wikipedia.org/wiki/..." />
            </div>

            <div className="form-group">
              <label className="form-label">Description (EN)</label>
              <textarea className="px-input" name="descEn" value={form.descEn} onChange={handle} onPaste={handleDescPaste('descEn', 'en')} rows={3} style={{ resize: 'vertical', minHeight: 72 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Description (CZ)</label>
              <textarea className="px-input" name="descCz" value={form.descCz} onChange={handle} onPaste={handleDescPaste('descCz', 'cz')} rows={3} style={{ resize: 'vertical', minHeight: 72 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Description (ZH)</label>
              <textarea className="px-input" name="descZh" value={form.descZh} onChange={handle} onPaste={handleDescPaste('descZh', 'zh')} rows={3} style={{ resize: 'vertical', minHeight: 72 }} />
            </div>

            <div className="form-group">
              <label className="form-label">Cover Photo</label>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} style={{ color: 'var(--text-primary)', fontSize: 14, width: '100%' }} />
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
