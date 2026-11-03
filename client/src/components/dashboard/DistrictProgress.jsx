import { useT, useConvert } from '../../context/LanguageContext';
import { DISTRICT_COLORS } from '../locations/DistrictLine';

// Profile (2026-11-03, user request): collected cards out of all cards in
// each správní obvod, Praha 1 to 22, one short bar each in the district's
// own colour (the same one its pill uses on the cards). Its own full-width
// card under the XP and achievement totals. Above the list, how many of the
// 22 districts the user has been to (at least one card collected there);
// districts not yet visited have their name greyed.
export default function DistrictProgress({ districts }) {
  const t = useT();
  const convert = useConvert();
  if (!districts?.length) return null;
  const visited = districts.filter(d => d.collected > 0).length;
  return (
    <div className="stat-card district-progress" style={{ gridColumn: '1 / -1' }}>
      <div className="stat-card__label">{t('dashboard.districtProgress')}</div>
      <div className="district-progress__summary">
        <span className="stat-card__value">{visited} / {districts.length}</span>
        <span className="district-progress__summary-text">{t('dashboard.districtsVisited')}</span>
      </div>
      <ul className="district-progress__list">
        {districts.map(d => {
          const n = Number(d.district.slice(6));
          const pct = d.total ? Math.round((d.collected / d.total) * 100) : 0;
          return (
            <li key={d.district} className={`district-progress__row${d.collected ? '' : ' district-progress__row--unvisited'}`}>
              <span className="district-progress__name">{convert(t('detail.district', { n }))}</span>
              <span className="district-progress__bar">
                <span className="district-progress__fill" style={{ width: `${pct}%`, backgroundColor: DISTRICT_COLORS[n - 1] }} />
              </span>
              <span className="district-progress__count">{d.collected} / {d.total}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
