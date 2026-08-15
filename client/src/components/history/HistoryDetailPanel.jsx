import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { useUserPosition } from '../../hooks/useUserPosition';
import { haversineDistance } from '../../utils/geolocation';
import LocationCard from '../locations/LocationCard';

// The right-hand pane of the sidebar layout: renders whichever event is
// selected in HistorySidebar. Inline, not a modal — no overlay/close button,
// since there's always something to show (HistoryPage defaults the
// selection to the earliest event once data loads).
//
// Related landmarks render in the exact same `.location-grid` + LocationCard
// markup Explore uses — same class, same card, nothing wrapped around it —
// so card sizing/spacing/equal-row-height behaviour matches Explore pixel
// for pixel instead of drifting whenever an extra wrapper or caption
// changes a card's natural height (an earlier version put the caption
// directly inside each card's own box and that's exactly what broke it —
// see the conversation this shipped in). The relation captions still need
// to sit under their own card though, so they render in a *second*,
// separate `.location-grid` right below the card grid, using the identical
// grid-template-columns. Two grids of equal width with the same auto-fill
// track always resolve to the same column boundaries, so the Nth caption
// lines up under the Nth card — including whichever row it wrapped to —
// without the captions ever touching the card grid's own height math.
//
// Unlike Explore, though, this isn't a discovery/gamification context: the
// event text already names the place, so `unlocked` is forced on for
// display (see the spread below) — always the real name and label, never
// Explore's "???" mystery treatment, regardless of whether the viewer has
// actually checked in there yet. Clicking a card still opens the full
// LocationDetail overlay on top of this page (see HistoryPage, which owns
// the selected-slug state), not a navigation away.
export default function HistoryDetailPanel({ event, onOpenLandmark }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const userPos = useUserPosition();

  if (!event) {
    return (
      <div className="history-detail-panel history-detail-panel--empty">
        <p className="guide-body">{t('history.pickEventHint')}</p>
      </div>
    );
  }

  return (
    <div className={`history-detail-panel history-detail-panel--${event.tone}`}>
      <div className="history-event__year">{event.year}</div>
      <h2 className="history-event__title">{convert(event.title[lang] || event.title.en)}</h2>
      <p className="history-event__hook">{convert(event.hookLine[lang] || event.hookLine.en)}</p>
      <p className="history-event__summary">{convert(event.summary[lang] || event.summary.en)}</p>

      {event.wikipediaUrl && (
        <a className="history-event__wiki" href={event.wikipediaUrl} target="_blank" rel="noopener noreferrer">
          {t('common.wikipedia')}
        </a>
      )}

      {event.relatedLandmarks.length > 0 && (
        <div className="history-event__landmarks">
          <div className="history-event__landmarks-label">{t('history.relatedLandmarksLabel')}</div>

          <div className="location-grid">
            {event.relatedLandmarks.map(({ landmark }) => {
              const distance = userPos
                ? haversineDistance(userPos.lat, userPos.lng, landmark.coordinates.lat, landmark.coordinates.lng)
                : null;
              return (
                <LocationCard
                  key={landmark.slug}
                  location={{ ...landmark, unlocked: true }}
                  distance={distance}
                  onClick={() => onOpenLandmark(landmark.slug)}
                />
              );
            })}
          </div>

          <div className="location-grid history-landmarks-captions">
            {event.relatedLandmarks.map(({ landmark, relation }) => (
              <p key={landmark.slug} className="history-landmark-caption">
                {convert(relation[lang] || relation.en)}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
