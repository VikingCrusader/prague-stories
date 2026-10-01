import { useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { renderInlineLinks } from '../../utils/historyMarkup';

// The "Era Guide" that opens each era (cardType 'overview', see the
// HistoryEvent model). Deliberately shaped unlike both event cards and
// background cards: a chapter title page rather than a story. No prose
// summary, images, Wikipedia link or landmarks. Instead, fixed sections:
// the one-line logline (hookLine), the stage, the cast with one-line roles,
// the key-moments strip, numbered questions to read with, and a closing
// teaser. Written as a trailer: the questions stay open.
//
// A cast member or milestone whose card isn't written yet has an empty
// `slug` and renders as plain, non-clickable text.

const COLLAPSED_KEY = 'historyOverviewCollapsed';

// Remembered per card so a returning reader isn't made to scroll past a
// guide they've already read. Storage can be missing or throw (private
// mode, blocked site data); the card then just opens expanded.
function loadCollapsed() {
  try {
    return new Set(JSON.parse(localStorage.getItem(COLLAPSED_KEY)) || []);
  } catch {
    return new Set();
  }
}

function saveCollapsed(slug, collapsed) {
  try {
    const set = loadCollapsed();
    if (collapsed) set.add(slug);
    else set.delete(slug);
    localStorage.setItem(COLLAPSED_KEY, JSON.stringify([...set]));
  } catch {
    // Remembering is a convenience only.
  }
}

// ~200 words a minute for EN/CZ, ~400 characters a minute for Chinese.
function readingMinutes(text, lang) {
  const plain = text.replace(/\[\[[^\]]*\]\]/g, '');
  const units = lang === 'zh'
    ? plain.replace(/\s/g, '').length / 400
    : plain.split(/\s+/).filter(Boolean).length / 200;
  return Math.max(1, Math.round(units));
}

const ZH_NUMERALS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三'];

export default function HistoryOverviewCard({ event, chapter, onNavigateToEvent, sectionRef }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [expanded, setExpanded] = useState(() => !loadCollapsed().has(event.slug));

  const raw = (value) => (value ? value[lang] || value.en || '' : '');
  const loc = (value) => convert(raw(value));
  const jump = (slug) => onNavigateToEvent?.(slug);

  const cast = event.cast || [];
  const questions = event.questions || [];
  const milestones = event.milestones || [];
  const minutes = readingMinutes(
    [
      raw(event.hookLine),
      raw(event.stage),
      ...cast.map(c => `${raw(c.name)} ${raw(c.role)}`),
      ...questions.map(raw),
      raw(event.teaser),
    ].join(' '),
    lang,
  );
  const chapterLabel = chapter > 0
    ? t('history.chapterLabel', { n: lang === 'zh' ? (ZH_NUMERALS[chapter] || chapter) : chapter })
    : null;

  const toggle = () => {
    saveCollapsed(event.slug, expanded);
    setExpanded(!expanded);
  };

  return (
    <div
      ref={sectionRef}
      data-slug={event.slug}
      className="history-detail-panel history-detail-panel--overview"
    >
      <header className="history-overview__header">
        <div className="history-overview__kicker">
          {chapterLabel && <span>{chapterLabel}</span>}
          <span aria-hidden="true">·</span>
          <span>{t('history.overviewLabel')}</span>
        </div>
        <h2 className="history-event__title history-overview__title">{loc(event.title)}</h2>
        <div className="history-overview__meta">
          <span>{t('history.readingTime', { n: minutes })}</span>
          <button
            type="button"
            className="history-overview__toggle"
            onClick={toggle}
            aria-expanded={expanded}
          >
            {expanded ? t('history.collapseCard') : t('history.expandCard')}
          </button>
        </div>
      </header>

      {expanded && (
        <>
          <p className="history-overview__logline">{loc(event.hookLine)}</p>

          <div className="history-overview__columns">
            <section className="history-overview__box">
              <h3 className="history-overview__box-title">{t('history.stageLabel')}</h3>
              <p className="history-overview__stage">{renderInlineLinks(loc(event.stage), onNavigateToEvent)}</p>
            </section>
            <section className="history-overview__box">
              <h3 className="history-overview__box-title">{t('history.castLabel')}</h3>
              <ul className="history-overview__cast">
                {cast.map((c, i) => (
                  <li key={i} className="history-overview__cast-item">
                    {c.slug ? (
                      <button type="button" className="history-overview__cast-name" onClick={() => jump(c.slug)}>
                        {loc(c.name)}
                      </button>
                    ) : (
                      <span className="history-overview__cast-name history-overview__cast-name--static">{loc(c.name)}</span>
                    )}
                    <span className="history-overview__cast-role">{loc(c.role)}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {milestones.length > 0 && (
            <section className="history-overview__milestones">
              <h3 className="history-overview__section-title">{t('history.milestonesLabel')}</h3>
              <ol className="history-overview__milestone-list">
                {milestones.map((m, i) => {
                  const body = (
                    <>
                      <span className="history-overview__milestone-dot" aria-hidden="true" />
                      <span className="history-overview__milestone-year">{loc(m.year)}</span>
                      <span className="history-overview__milestone-label">{loc(m.label)}</span>
                    </>
                  );
                  return (
                    <li key={i} className="history-overview__milestone">
                      {m.slug ? (
                        <button type="button" className="history-overview__milestone-btn" onClick={() => jump(m.slug)}>
                          {body}
                        </button>
                      ) : (
                        <div className="history-overview__milestone-btn history-overview__milestone-btn--static">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          {questions.length > 0 && (
            <section className="history-overview__questions">
              <h3 className="history-overview__section-title">{t('history.questionsLabel')}</h3>
              <ol className="history-overview__question-list">
                {questions.map((q, i) => (
                  <li key={i} className="history-overview__question">
                    <span className="history-overview__question-num" aria-hidden="true">{i + 1}</span>
                    <span>{loc(q)}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {raw(event.teaser) && <p className="history-overview__teaser">{loc(event.teaser)}</p>}
        </>
      )}
    </div>
  );
}
