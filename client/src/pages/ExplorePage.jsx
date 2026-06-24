import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { locationAPI } from '../services/api';
import { useT } from '../context/LanguageContext';
import { useUserPosition } from '../hooks/useUserPosition';
import { haversineDistance } from '../utils/geolocation';
import LocationGrid from '../components/locations/LocationGrid';
import LocationDetail from '../components/locations/LocationDetail';
import AddLocationForm from '../components/locations/AddLocationForm';
import ToastContainer from '../components/shared/Toast';

let toastId = 0;

export default function ExplorePage() {
  const t = useT();
  const { state } = useLocation();
  const navigate = useNavigate();
  const userPos                          = useUserPosition();
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

  useEffect(() => {
    const handler = (e) =>
      setLocations(prev => prev.map(l => l.slug === e.detail.slug ? { ...l, unlocked: true } : l));
    window.addEventListener('proximity-checkin', handler);
    return () => window.removeEventListener('proximity-checkin', handler);
  }, []);

  useEffect(() => {
    if (state?.openSlug) {
      setSelectedSlug(state.openSlug);
      navigate('.', { replace: true, state: null });
    }
  }, [state?.openSlug]);

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

  const handleUpdate = (updatedLoc) => {
    setLocations(prev => prev.map(l => l.slug === updatedLoc.slug ? { ...l, ...updatedLoc } : l));
    addToast('Location updated.', 'success');
  };

  const sortedLocations = useMemo(() => {
    if (!userPos) return locations;
    return [...locations]
      .map(l => ({
        ...l,
        _distance: haversineDistance(userPos.lat, userPos.lng, l.coordinates.lat, l.coordinates.lng),
      }))
      .sort((a, b) => a._distance - b._distance);
  }, [locations, userPos]);

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h1 className="px-title" style={{ fontSize: 13 }}>{t('explore.title')}</h1>
      </div>

      <LocationGrid locations={sortedLocations} onCardClick={setSelectedSlug} onAddClick={() => setShowAdd(true)} />

      {selectedSlug && (
        <LocationDetail
          slug={selectedSlug}
          onClose={() => setSelectedSlug(null)}
          onCheckIn={handleCheckIn}
          onUndo={handleUndo}
          onUpdate={handleUpdate}
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
