import { Link } from 'react-router-dom';
import { useT, useConvert } from '../../context/LanguageContext';
import { DISTRICT_COLORS } from '../locations/DistrictLine';
import DistrictMap from './DistrictMap';

// Profile (2026-11-03, user request): collected cards out of all cards in
// each správní obvod, Praha 1 to 22, one short bar each in the district's
// own colour (the same one its pill uses on the cards). Its own full-width
// card under the XP and achievement totals. Above the list, how many of the
// 22 districts the user has been to (at least one card collected there);
// districts not yet visited have their name greyed.
// On the user's own profile (`own`) a visited district's row opens Explore
// filtered to that district (2026-11-04), not styled as a link, its name
// underlined on hover. My Collections ignores the area filter, so it opens
// the district's whole list, collected cards and locked ones.
export default function DistrictProgress({ districts, own = false }) {
  const t = useT();
  const convert = useConvert();
  // The map comes first, the list of 22 rows always under it (a fold
  // button was tried and dropped, 2026-11-04, user's call).
  if (!districts?.length) return null;
  const visited = districts.filter(d => d.collected > 0).length;
  return (
    <div className="stat-card district-progress" style={{ gridColumn: '1 / -1' }}>
      {/* A gold section title like Achievements and the strips (2026-11-04). */}
      <h2 className="px-title district-progress__title">{t('dashboard.districtProgress')}</h2>
      <div className="district-progress__summary">
        <span className="stat-card__value">{visited} / {districts.length}</span>
        <span className="district-progress__summary-text">{t('dashboard.districtsVisited')}</span>
      </div>
      <DistrictMap districts={districts} own={own} />
      <ul className="district-progress__list">
        {districts.map(d => {
          const n = Number(d.district.slice(6));
          const pct = d.total ? Math.round((d.collected / d.total) * 100) : 0;
          const inner = (
            <>
              <span className="district-progress__name quiet-link__text">{convert(t('detail.district', { n }))}</span>
              <span className="district-progress__bar">
                <span className="district-progress__fill" style={{ width: `${pct}%`, backgroundColor: DISTRICT_COLORS[n - 1] }} />
              </span>
              <span className="district-progress__count">{d.collected} / {d.total}</span>
            </>
          );
          return (
            <li key={d.district} className={`district-progress__row${d.collected ? '' : ' district-progress__row--unvisited'}`}>
              {own && d.collected
                ? <Link to="/explore" state={{ district: d.district }} className="quiet-link district-progress__link">{inner}</Link>
                : inner}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
