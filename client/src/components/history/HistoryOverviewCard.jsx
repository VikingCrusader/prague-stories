import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { renderInlineLinks } from '../../utils/historyMarkup';

// The card that opens each era (cardType 'overview', see the HistoryEvent
// model). It takes the place of the era banner (HistoryEraDivider): the
// era's title, years and tagline sit inside the card, followed by the card's
// own title as a subtitle and a single humorous paragraph (`summary`) that
// sets the era up without giving away its biggest outcomes. Deliberately
// plain: no sidebar entry, no landmarks, images or extra sections.
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
          <p className="history-overview__subtitle">{loc(event.title)}</p>
          {era.yearRange && <p className="history-era-divider__years">{loc(era.yearRange)}</p>}
          {era.tagline && <p className="history-era-divider__tagline">{loc(era.tagline)}</p>}
        </div>
      )}
      <p className="history-event__summary history-overview__text">
        {renderInlineLinks(loc(event.summary), onNavigateToEvent)}
      </p>
    </div>
  );
}
