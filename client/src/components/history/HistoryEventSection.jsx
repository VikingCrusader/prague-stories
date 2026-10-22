import { useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { useUserPosition } from '../../hooks/useUserPosition';
import { haversineDistance } from '../../utils/geolocation';
import LocationCard from '../locations/LocationCard';
// Reserves each lazy image's space before it loads (see
// scripts/generateHistoryImageSizes.mjs), so sidebar jumps land in place.
import HISTORY_IMAGE_SIZES from '../../utils/historyImageSizes.json';

import { renderInlineLinks } from '../../utils/historyMarkup';
import HistoryOverviewCard from './HistoryOverviewCard';

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
// `.history-landmark-item` wrapper (card, then caption right underneath
// it), and it's that wrapper, not the bare card, that's the grid item.
// The wrapper is a two-row subgrid (see history.css), so the cards in a
// row still stretch to equal heights and the captions line up below them.
//
// Unlike Explore, though, this isn't a discovery/gamification context: the
// event text already names the place, so `unlocked` is forced on for
// display (see the spread below) — always the real name and label, never
// Explore's "???" mystery treatment, regardless of whether the viewer has
// actually checked in there yet. Clicking a card still opens the full
// LocationDetail overlay on top of this page (see HistoryPage, which owns
// the selected-slug state), not a navigation away.
// Rows for the landmark wall (2026-10-22): full rows of `cols` cards, except
// that a lone card left on the last row of a 3-wide grid pulls one card down
// from the row above (4 → 2+2, 7 → 3+2+2). Returns each card's starting
// track in the 2-tracks-per-card grid (see history.css), or null for auto;
// only the first card of a short row needs one, to centre that row.
function landmarkStarts(n, cols) {
  const rows = [];
  let left = n;
  while (left > 0) {
    const k = cols === 3 && left === 4 ? 2 : Math.min(cols, left);
    rows.push(k);
    left -= k;
  }
  return rows.flatMap(k => Array.from({ length: k }, (_, i) => (i === 0 && k < cols ? cols - k + 1 : null)));
}

export default function HistoryEventSection({ event, era, chapter, onOpenLandmark, onNavigateToEvent, sectionRef }) {
  // Era-overview cards (cardType 'overview') have a structure of their own.
  if (event.cardType === 'overview') {
    return <HistoryOverviewCard event={event} era={era} chapter={chapter} onNavigateToEvent={onNavigateToEvent} sectionRef={sectionRef} />;
  }
  return <EventCard event={event} onOpenLandmark={onOpenLandmark} onNavigateToEvent={onNavigateToEvent} sectionRef={sectionRef} />;
}

function EventCard({ event, onOpenLandmark, onNavigateToEvent, sectionRef }) {
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
          <p className="history-event__hook">
            {/* Four ornamental corners (history.css). */}
            {['tl', 'tr', 'bl', 'br'].map((c) => (
              <span key={c} className={`history-event__hook-corner history-event__hook-corner--${c}`} aria-hidden="true" />
            ))}
            {convert(event.hookLine[lang] || event.hookLine.en)}
          </p>
          {/* summary supports multi-paragraph text: split on \n and filter blank
              lines, same convention LocationDetail uses for `description`, so a
              '\n\n' in the source data renders as a paragraph break instead of
              collapsing into one dense block. Falls back to a single <p> for
              the (still-common) one-paragraph summaries.

              A paragraph that's just a "[[quote:N]]" marker (its own line,
              nothing else) is swapped for event.quotes[N] and rendered as a
              distinct blockquote — decorative quotation marks, italic text,
              a right-aligned "— Source" attribution — instead of a plain
              <p>. Lets a primary-source quote stand apart from the summary's
              own prose instead of sitting inline as quoted text.

              A non-quote paragraph is still passed through renderInlineLinks
              (see above) — any "[[link:slug]]text[[/link]]" mid-sentence
              becomes an underlined clickable span jumping to that other
              event's own section. */}
          {convert(event.summary[lang] || event.summary.en)
            .split("\n")
            .filter((p) => p.trim())
            .map((para, i) => {
              const quoteMatch = para.trim().match(/^\[\[quote:(\d+)\]\]$/);
              if (quoteMatch) {
                const quote = event.quotes?.[Number(quoteMatch[1])];
                if (!quote) return null;
                return (
                  <blockquote key={i} className="history-event__quote">
                    <p className="history-event__quote-text">
                      {convert(quote.text[lang] || quote.text.en)}
                    </p>
                    {(quote.attribution?.[lang] || quote.attribution?.en) && (
                      <cite className="history-event__quote-attribution">
                        — {convert(quote.attribution[lang] || quote.attribution.en)}
                      </cite>
                    )}
                  </blockquote>
                );
              }
              return (
                <p key={i} className="history-event__summary">{renderInlineLinks(para, onNavigateToEvent)}</p>
              );
            })}

          {event.images?.map((src, i) => {
            const caption = event.imageCaptions?.[i];
            const captionText = caption?.[lang] || caption?.en;
            return (
              <figure key={src} className="history-event__image-figure">
                <img
                  className="history-event__image"
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={HISTORY_IMAGE_SIZES[src]?.[0]}
                  height={HISTORY_IMAGE_SIZES[src]?.[1]}
                />
                {captionText && (
                  // Reuses .history-landmark-caption rather than a new
                  // class — same "small muted caption under an image"
                  // role, and it already carries the tuned EN/CZ (white,
                  // weight 600) and ZH (LXGW WenKai TC) overrides in
                  // global.css that a brand-new class would need repeating.
                  <figcaption className="history-landmark-caption">
                    {convert(captionText)}
                  </figcaption>
                )}
              </figure>
            );
          })}

          {event.referenceMaps?.links?.length > 0 && (
            <div className="history-event__reference-maps">
              <span className="history-event__reference-maps-label">{t('history.referenceMapsLabel')}</span>
              {(event.referenceMaps.caption?.[lang] || event.referenceMaps.caption?.en) && (
                <p className="history-event__reference-maps-caption">
                  {convert(event.referenceMaps.caption[lang] || event.referenceMaps.caption.en)}
                </p>
              )}
              <ul className="history-event__reference-maps-list">
                {event.referenceMaps.links.map((map) => {
                  const isYouTube = /(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(
                    (() => {
                      try {
                        return new URL(map.url).hostname;
                      } catch {
                        return '';
                      }
                    })()
                  );
                  return (
                    <li key={map.url}>
                      <a
                        className="history-event__reference-maps-link"
                        href={map.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {isYouTube ? (
                          // Video links show a YouTube play-button glyph instead of
                          // the year chip — the label (e.g. "1955") is redundant
                          // once the icon itself says "this is a video."
                          <svg
                            className="history-event__reference-maps-icon"
                            viewBox="0 0 24 17"
                            width="24"
                            height="17"
                            aria-label="YouTube"
                          >
                            <rect width="24" height="17" rx="4" fill="#FF0000" />
                            <polygon points="9.5,4.5 9.5,12.5 16,8.5" fill="#FFFFFF" />
                          </svg>
                        ) : (
                          <span className="history-event__reference-maps-year">{map.label}</span>
                        )}
                        {(map.description?.[lang] || map.description?.en) && (
                          <span className="history-event__reference-maps-desc">
                            {convert(map.description[lang] || map.description.en)}
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {event.relatedLandmarks.length > 0 && (
            <div className="history-event__landmarks">
              <div className="history-event__landmarks-label">{t('history.relatedLandmarksLabel')}</div>

              <div className="location-grid history-landmark-grid">
                {event.relatedLandmarks.map(({ landmark, relation }, i, all) => {
                  const distance = userPos
                    ? haversineDistance(userPos.lat, userPos.lng, landmark.coordinates.lat, landmark.coordinates.lng)
                    : null;
                  const start3 = landmarkStarts(all.length, 3)[i];
                  const start2 = landmarkStarts(all.length, 2)[i];
                  return (
                    <div
                      key={landmark.slug}
                      className="history-landmark-item"
                      style={{ '--start-3': start3 ?? 'auto', '--start-2': start2 ?? 'auto' }}
                    >
                      <LocationCard
                        location={{ ...landmark, unlocked: true }}
                        holdable={!!landmark.unlocked}
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
