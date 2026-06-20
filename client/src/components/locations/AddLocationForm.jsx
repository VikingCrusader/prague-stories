import { useState } from 'react';
import { locationAPI } from '../../services/api';

const CATEGORIES = ['historical', 'cultural', 'natural', 'food', 'hidden-gem', 'entertainment'];

export default function AddLocationForm({ onClose, onAdded }) {
  const [form, setForm]     = useState({ name: '', category: 'historical', lat: '', lng: '', wikipediaUrl: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (isNaN(lat) || isNaN(lng)) { setError('Latitude and longitude must be valid numbers.'); return; }
    if (lat < 48 || lat > 52 || lng < 13 || lng > 16) { setError('Coordinates must be within the Prague region.'); return; }

    setError(''); setLoading(true);
    try {
      const res = await locationAPI.create({ ...form, coordinates: { lat, lng } });
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
        <div className="px-modal__header" style={{ background: '#141830' }}>
          <span style={{ fontSize: '3rem' }}>📍</span>
          <h2 className="px-title" style={{ fontSize: 11 }}>Add Custom Location</h2>
        </div>
        <div className="px-modal__body">
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="px-input" name="name" value={form.name} onChange={handle} required maxLength={100} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="px-input" name="category" value={form.category} onChange={handle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Latitude</label>
                <input className="px-input" name="lat" placeholder="50.0875" value={form.lat} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="form-label">Longitude</label>
                <input className="px-input" name="lng" placeholder="14.4213" value={form.lng} onChange={handle} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Wikipedia URL (optional)</label>
              <input className="px-input" name="wikipediaUrl" value={form.wikipediaUrl} onChange={handle} type="url" placeholder="https://en.wikipedia.org/wiki/..." />
            </div>
            {error && <p className="form-error">{error}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="px-btn px-btn--gold" disabled={loading}>
                {loading ? 'Adding...' : '+ Add Location'}
              </button>
              <button type="button" className="px-btn px-btn--dark" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
