import { useEffect, useState } from 'react';
import { historyAPI } from '../services/api';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import HistorySidebar from '../components/history/HistorySidebar';
import HistoryDetailPanel from '../components/history/HistoryDetailPanel';
import LocationDetail from '../components/locations/LocationDetail';

export default function HistoryPage() {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Slug of a related landmark opened from the detail panel. Rendering
  // LocationDetail here (same as RandomDrawPage does) shows the exact same
  // card Explore uses, as an overlay on top of this page — no navigation
  // away, per the product call to keep the presentation identical without
  // leaving History.
  const [openLandmarkSlug, setOpenLandmarkSlug] = useState(null);

  useEffect(() => {
    historyAPI.getAll()
      .then(res => {
        setData(res.data);
        // Events come back sorted by startYear ascending — default to the
        // earliest one so the detail panel isn't empty on first load.
        if (res.data.events.length > 0) setSelectedEvent(res.data.events[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="guide-page history-page">
      <div className="history-header">
        <h1 className="px-title" style={{ fontSize: 13, marginBottom: 6 }}>{t('history.title')}</h1>
        <p className="guide-intro">{t('history.tagline')}</p>
        <p className="history-drag-hint">{t('history.dragHint')}</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <div className="spinner" />
        </div>
      ) : data ? (
        <div className="history-layout">
          <HistorySidebar
            eras={data.eras}
            events={data.events}
            selectedSlug={selectedEvent?.slug}
            onSelectEvent={setSelectedEvent}
            lang={lang}
            convert={convert}
            t={t}
          />
          <HistoryDetailPanel event={selectedEvent} onOpenLandmark={setOpenLandmarkSlug} />
        </div>
      ) : null}

      {openLandmarkSlug && (
        <LocationDetail
          slug={openLandmarkSlug}
          onClose={() => setOpenLandmarkSlug(null)}
          onCheckIn={() => {}}
        />
      )}
    </div>
  );
}
