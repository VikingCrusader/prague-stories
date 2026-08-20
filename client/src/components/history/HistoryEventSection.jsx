import { useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { useUserPosition } from '../../hooks/useUserPosition';
import { haversineDistance } from '../../utils/geolocation';
import LocationCard from '../locations/LocationCard';

// One event's full write-up, rendered as an in-flow section inside
// HistoryPage's scrollable feed — not a single "selected event" detail
// pane. The whole feed scrolls as an ordinary page; HistorySidebar is the
// persistent nav (sticky, see history.css) that either scrolls a section
// into view on click or gets highlighted by scroll-spy as the user scrolls
// past it (see HistoryPage's IntersectionObserver). `sectionRef` is how
// HistoryPage gets a DOM node per event to observe/scrollIntoView.
//
// Related landmarks render inside the shared `.location-grid` class from
// Explore, so column widths/gaps still match Explore's grid — but each
// LocationCard is now paired with its relation caption in a single
// `.history-landmark-item` wrapper (flex column: card, then caption right
// underneath it), and it's that wrapper, not the bare card, that's the
// grid item. An earlier version kept the cards as direct, unwrapped grid
// children (with captions rendered in a wholly separate second grid below)
// specifically to preserve CSS Grid's default `align-items: stretch`,
// which made every card in a row exactly the row's height. Wrapping broke
// that — `.loc-card` no longer sits directly in the grid, so it stretches
// along the wrapper's cross axis (width) rather than its main axis
// (height), and reverts to its natural content height instead. That's an
// accepted, deliberate trade-off here: the point of this section is each
// landmark read as one card+caption unit, not a uniform card row, so a
// little natural height variance between cards is fine — pairing them
// correctly is the actual requirement.
//
// Unlike Explore, though, this isn't a discovery/gamification context: the
// event text already names the place, so `unlocked` is forced on for
// display (see the spread below) — always the real name and label, never
// Explore's "???" mystery treatment, regardless of whether the viewer has
// actually checked in there yet. Clicking a card still opens the full
// LocationDetail overlay on top of this page (see HistoryPage, which owns
// the selected-slug state), not a navigation away.
export default function HistoryEventSection({ event, onOpenLandmark, sectionRef }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const userPos = useUserPosition();
  // Background cards (see HistoryEvent model) are non-dated explainer
  // asides, not narrative events — they get a distinct visual treatment
  // (an icon+label instead of a year, no Wikipedia-link title) and a
  // collapse/expand toggle so a reader can skip past one on a reread
  // without it eating the same vertical space as a full event write-up
  // every time. Defaults open since it's slotted in at a point the reader
  // actually needs the context, not as a buried footnote.
  const isBackground = event.cardType === 'background';
  const [expanded, setExpanded] = useState(true);
  const showBody = !isBackground || expanded;

  return (
    <div
      ref={sectionRef}
      data-slug={event.slug}
      className={`history-detail-panel history-detail-panel--${event.tone}${isBackground ? ' history-detail-panel--background' : ''}`}
    >
      {isBackground ? (
        <div className="history-event__background-tag">
          <span>{t('history.backgroundLabel')}</span>
        </div>
      ) : (
        <div className="history-event__year">{convert(event.year[lang] || event.year.en)}</div>
      )}
      <h2 className="history-event__title">
        {event.wikipediaUrl ? (
          <a
            className="history-event__title-link"
            href={event.wikipediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={t('common.wikipedia')}
          >
            {convert(event.title[lang] || event.title.en)}
          </a>
        ) : (
          convert(event.title[lang] || event.title.en)
        )}
      </h2>

      {isBackground && (
        <button
          type="button"
          className="history-event__background-toggle"
          onClick={() => setExpanded(x => !x)}
          aria-expanded={expanded}
        >
          {expanded ? t('history.collapseCard') : t('history.expandCard')}
        </button>
      )}

      {showBody && (
        <>
          <p className="history-event__hook">{convert(event.hookLine[lang] || event.hookLine.en)}</p>
          {/* summary supports multi-paragraph text: split on \n and filter blank
              lines, same convention LocationDetail uses for `description`, so a
              '\n\n' in the source data renders as a paragraph break instead of
              collapsing into one dense block. Falls back to a single <p> for
              the (still-common) one-paragraph summaries. */}
          {convert(event.summary[lang] || event.summary.en)
            .split("\n")
            .filter((p) => p.trim())
            .map((para, i) => (
              <p key={i} className="history-event__summary">{para}</p>
            ))}

          {event.images?.map((src) => (
            <img key={src} className="history-event__image" src={src} alt="" />
          ))}

          {event.referenceMaps?.links?.length > 0 && (
            <div className="history-event__reference-maps">
              <span className="history-event__reference-maps-label">{t('history.referenceMapsLabel')}</span>
              {(event.referenceMaps.caption?.[lang] || event.referenceMaps.caption?.en) && (
                <p className="history-event__reference-maps-caption">
                  {convert(event.referenceMaps.caption[lang] || event.referenceMaps.caption.en)}
                </p>
              )}
              <ul className="history-event__reference-maps-list">
                {event.referenceMaps.links.map((map) => (
                  <li key={map.url}>
                    <a
                      className="history-event__reference-maps-link"
                      href={map.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="history-event__reference-maps-year">{map.label}</span>
                      {(map.description?.[lang] || map.description?.en) && (
                        <span className="history-event__reference-maps-desc">
                          {convert(map.description[lang] || map.description.en)}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {event.relatedLandmarks.length > 0 && (
            <div className="history-event__landmarks">
              <div className="history-event__landmarks-label">{t('history.relatedLandmarksLabel')}</div>

              <div className="location-grid">
                {event.relatedLandmarks.map(({ landmark, relation }) => {
                  const distance = userPos
                    ? haversineDistance(userPos.lat, userPos.lng, landmark.coordinates.lat, landmark.coordinates.lng)
                    : null;
                  return (
                    <div key={landmark.slug} className="history-landmark-item">
                      <LocationCard
                        location={{ ...landmark, unlocked: true }}
                        distance={distance}
                        onClick={() => onOpenLandmark(landmark.slug)}
                      />
                      <p className="history-landmark-caption">
                        {convert(relation[lang] || relation.en)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
