import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { renderInlineLinks } from '../../utils/historyMarkup';

// The card that opens each era (cardType 'overview', see the HistoryEvent
// model). It takes the place of the era banner (HistoryEraDivider): the
// era's title and years sit inside the card (the years right under the
// title, same size, all of the header in gold), followed by the card's
// own title as a subtitle and a single humorous paragraph (`summary`) that
// sets the era up without giving away its biggest outcomes. The era tagline
// is left out here: the summary already introduces the era, and two intros
// in two typefaces read as clutter. Deliberately
// plain: no sidebar entry, no landmarks, images or extra sections. The four
// corner spans are the ornamental frame (styled in history.css).
//
// The era title carries a "Chapter N" prefix (era order, 1-based). Only
// here: the sidebar's era headings stay unnumbered.
const ZH_NUMERALS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三'];

export default function HistoryOverviewCard({ event, era, chapter, onNavigateToEvent, sectionRef }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const loc = (value) => (value ? convert(value[lang] || value.en || '') : '');

  return (
    <div
      ref={sectionRef}
      data-slug={event.slug}
      className="history-detail-panel history-detail-panel--overview"
    >
      {['tl', 'tr', 'bl', 'br'].map(c => (
        <span key={c} className={`history-overview__corner history-overview__corner--${c}`} aria-hidden="true" />
      ))}
      {era && (
        <div className="history-overview__era">
          <h2 className="history-era-divider__title">
            {chapter > 0 && (
              <span className="history-overview__chapter">
                {t('history.chapterLabel', { n: lang === 'zh' ? (ZH_NUMERALS[chapter] || chapter) : chapter })}
              </span>
            )}
            {loc(era.title)}
          </h2>
          {era.yearRange && <p className="history-era-divider__years">{loc(era.yearRange)}</p>}
          <p className="history-overview__subtitle"><span>{loc(event.title)}</span></p>
        </div>
      )}
      <p className="history-event__summary history-overview__text">
        {renderInlineLinks(loc(event.summary), onNavigateToEvent)}
      </p>
    </div>
  );
}
