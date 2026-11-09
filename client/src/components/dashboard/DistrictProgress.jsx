import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { DISTRICT_COLORS } from '../locations/DistrictLine';
import AreaGuideModal from '../locations/AreaGuideModal';
import { quarterName } from '../../utils/pragueQuarters';
import { QUARTER_DISTRICT } from '../../utils/quarterDistricts';
import DistrictMap from './DistrictMap';

// Profile (2026-11-03, user request): collected cards out of all cards in
// each správní obvod, Praha 1 to 22, one short bar each in the district's
// own colour (the same one its pill uses on the cards). Its own full-width
// card under the XP and achievement totals. Above the list, how many of the
// 22 districts the user has been to (at least one card collected there);
// districts not yet visited have their name greyed.
// On the user's own profile (`own`) a row opens the area's guide with the
// cards collected there, like the map (2026-11-08, user's call; it used to go
// to Explore), not styled as a link, its name underlined on hover.
// The map's district / quarter toggle switches the summary and the list too
// (2026-11-04, user's call): in the quarter view every quarter with cards,
// grouped by district (utils/quarterDistricts.js) and sorted by name, bars in
// its district's colour. The card must stay as tall as it was before the
// toggle existed (user's call): the toggle sits in the title line, and a
// quarter page holds 21 rows (7 full rows of three) with the pager as a
// one-row-high item in the list's own grid, where the 22 districts need 8
// rows. The last page is padded with empty rows.
const QUARTER_PAGE = 21;

export default function DistrictProgress({ districts, quarters, own = false }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [mode, setMode] = useState('district');
  const [page, setPage] = useState(0);
  const [guide, setGuide] = useState(null);
  const [listOpen, setListOpen] = useState(false);
  useEffect(() => {
    if (!listOpen) return undefined;
    // A guide opened from a row handles Escape itself, first.
    const onKey = e => { if (e.key === 'Escape') setListOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [listOpen]);

  const quarterRows = useMemo(() => {
    const collator = new Intl.Collator(lang === 'zh' ? 'zh' : lang === 'cz' ? 'cs' : 'en');
    const dn = q => Number((QUARTER_DISTRICT[q] || 'Praha 99').slice(6));
    return (quarters || [])
      .filter(q => q.total > 0)
      .sort((a, b) => dn(a.quarter) - dn(b.quarter) || collator.compare(quarterName(a.quarter, lang), quarterName(b.quarter, lang)));
  }, [quarters, lang]);

  // The map stays on the page; the list opens in its own small window, on every
  // screen (2026-11-09, user's call).
  if (!districts?.length) return null;
  const isQ = mode === 'quarter' && quarterRows.length > 0;
  const changeMode = m => { setMode(m); setPage(0); };

  const pages = Math.max(1, Math.ceil(quarterRows.length / QUARTER_PAGE));
  const rows = isQ
    ? quarterRows.slice(page * QUARTER_PAGE, (page + 1) * QUARTER_PAGE).map(q => {
      const n = Number((QUARTER_DISTRICT[q.quarter] || 'Praha 1').slice(6));
      return { key: q.quarter, name: quarterName(q.quarter, lang), color: DISTRICT_COLORS[n - 1], ...q };
    })
    : districts.map(d => {
      const n = Number(d.district.slice(6));
      return { key: d.district, name: t('detail.district', { n }), color: DISTRICT_COLORS[n - 1], ...d };
    });
  const all = isQ ? quarterRows : districts;
  const visited = all.filter(d => d.collected > 0).length;

  return (
    <div className="stat-card district-progress" style={{ gridColumn: '1 / -1' }}>
      {/* A gold section title like Achievements and the strips (2026-11-04). */}
      <div className="district-progress__head">
        <h2 className="px-title district-progress__title">{t(isQ ? 'dashboard.quarterProgress' : 'dashboard.districtProgress')}</h2>
        <div className="district-map__toggle" role="tablist">
          {['district', 'quarter'].map(m => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              className={`filter-btn${mode === m ? ' filter-btn--active' : ''}`}
              onClick={() => changeMode(m)}
            >
              {t(m === 'district' ? 'dashboard.mapDistricts' : 'dashboard.mapQuarters')}
            </button>
          ))}
        </div>
      </div>
      <div className="district-progress__summary">
        <span className="stat-card__value">{visited} / {all.length}</span>
        <span className="district-progress__summary-text">{t(isQ ? 'dashboard.quartersVisited' : 'dashboard.districtsVisited')}</span>
      </div>
      <DistrictMap districts={districts} quarters={quarters} own={own} mode={mode} onModeChange={changeMode} showToggle={false} />
      <button type="button" className="filter-btn district-progress__toggle" onClick={() => setListOpen(true)}>
        {t('dashboard.showDetails')}
      </button>
      {/* In a portal: the page itself may be zoomed to fit the screen. */}
      {listOpen && createPortal(
        <div className="px-overlay" onClick={() => setListOpen(false)}>
          <div className="px-modal district-details" onClick={e => e.stopPropagation()} role="dialog" aria-label={t(isQ ? 'dashboard.quarterProgress' : 'dashboard.districtProgress')}>
            <button type="button" className="px-modal__close" onClick={() => setListOpen(false)} aria-label="✕">✕</button>
            <h2 className="px-title district-details__title">{t(isQ ? 'dashboard.quarterProgress' : 'dashboard.districtProgress')}</h2>
            <div className="district-progress__summary">
              <span className="stat-card__value">{visited} / {all.length}</span>
              <span className="district-progress__summary-text">{t(isQ ? 'dashboard.quartersVisited' : 'dashboard.districtsVisited')}</span>
            </div>
            <ul className={`district-progress__list${isQ ? ' district-progress__list--quarters' : ''}`}>
              {rows.map(r => {
                const pct = r.total ? Math.round((r.collected / r.total) * 100) : 0;
                const inner = (
                  <>
                    <span className="district-progress__name quiet-link__text" title={convert(r.name)}>{convert(r.name)}</span>
                    <span className="district-progress__bar">
                      <span className="district-progress__fill" style={{ width: `${pct}%`, backgroundColor: r.color }} />
                    </span>
                    <span className="district-progress__count">{r.collected} / {r.total}</span>
                  </>
                );
                return (
                  <li key={r.key} className={`district-progress__row${r.collected ? '' : ' district-progress__row--unvisited'}`}>
                    {own
                      ? <button type="button" className="quiet-link district-progress__link" onClick={() => setGuide({ kind: isQ ? 'quarter' : 'district', value: r.key })}>{inner}</button>
                      : inner}
                  </li>
                );
              })}
              {isQ && Array.from({ length: Math.max(0, QUARTER_PAGE - rows.length) }, (_, i) => (
                <li key={`pad-${i}`} className="district-progress__row district-progress__row--pad" aria-hidden="true">&nbsp;</li>
              ))}
              {isQ && pages > 1 && (
                <li className="district-progress__pager">
                  <button type="button" className="district-progress__page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                    ‹ {t('dashboard.pagePrev')}
                  </button>
                  <span className="district-progress__page">{page + 1} / {pages}</span>
                  <button type="button" className="district-progress__page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= pages - 1}>
                    {t('dashboard.pageNext')} ›
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>,
        document.body,
      )}
      {guide && <AreaGuideModal kind={guide.kind} value={guide.value} withCollection onClose={() => setGuide(null)} />}
    </div>
  );
}
