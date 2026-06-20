import { useState, useEffect, useCallback } from 'react';
import { locationAPI } from '../services/api';
import { useT } from '../context/LanguageContext';
import LocationGrid from '../components/locations/LocationGrid';
import LocationDetail from '../components/locations/LocationDetail';
import AddLocationForm from '../components/locations/AddLocationForm';
import ToastContainer from '../components/shared/Toast';

let toastId = 0;

export default function ExplorePage() {
  const t = useT();
  const [locations, setLocations]       = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [showAdd, setShowAdd]           = useState(false);
  const [loading, setLoading]           = useState(true);
  const [toasts, setToasts]             = useState([]);

  useEffect(() => {
    locationAPI.getAll()
      .then(res => setLocations(res.data))
      .finally(() => setLoading(false));
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleCheckIn = (slug, result) => {
    setLocations(prev => prev.map(l => l.slug === slug ? { ...l, unlocked: true } : l));
    addToast(`+${result.xpEarned} XP earned! ${result.levelInfo.title}`);
    result.newAchievements?.forEach(a =>
      addToast(`Achievement unlocked: ${a.id.replace(/_/g, ' ')}`, 'info')
    );
    setSelectedSlug(null);
  };

  const handleUndo = (slug) => {
    setLocations(prev => prev.map(l => l.slug === slug ? { ...l, unlocked: false } : l));
    addToast('Visit removed', 'info');
    setSelectedSlug(null);
  };

  const handleLocationAdded = (newLoc) => {
    setLocations(prev => [...prev, { ...newLoc, unlocked: false }]);
    setShowAdd(false);
    addToast('Location added! Check it in on the map.');
  };

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="explore-page">
      <div className="explore-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="px-title" style={{ fontSize: 13 }}>{t('explore.title')}</h1>
          </div>
          <button className="px-btn px-btn--outline" onClick={() => setShowAdd(true)}>
            {t('explore.addLocation')}
          </button>
        </div>
      </div>

      <LocationGrid locations={locations} onCardClick={setSelectedSlug} />

      {selectedSlug && (
        <LocationDetail
          slug={selectedSlug}
          onClose={() => setSelectedSlug(null)}
          onCheckIn={handleCheckIn}
          onUndo={handleUndo}
        />
      )}

      {showAdd && (
        <AddLocationForm
          onClose={() => setShowAdd(false)}
          onAdded={handleLocationAdded}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
