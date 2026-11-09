import { useEffect, useMemo, useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { loadAreaGuide, hasAreaGuide, AREA_LANDMARKS } from '../../utils/areaGuides';
import { getLocName } from '../../utils/locName';
import { quarterName } from '../../utils/pragueQuarters';
import { AREA_BLURBS } from '../../utils/areaBlurbs';

// One area's guide: its name, the player's progress there, and the sections,
// or only the first (the overview) with `overviewOnly`.
function AreaBlock({ kind, value, within, overviewOnly, compact, locations, onPickLandmark }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const { user } = useAuth();
  const [sections, setSections] = useState(null);
  useEffect(() => {
    let live = true;
    setSections(null);
    if (compact || !hasAreaGuide(kind, value)) { setSections([]); return undefined; }
    loadAreaGuide(lang, kind, value).then(s => { if (live) setSections(s || []); }).catch(() => { if (live) setSections([]); });
    return () => { live = false; };
  }, [lang, kind, value, compact]);

  const cards = useMemo(
    () => locations.filter(l => l[kind] === value && (!within || l.district === within)),
    [locations, kind, value, within],
  );
  const collected = cards.filter(l => l.unlocked).length;
  const pct = cards.length ? Math.round((collected / cards.length) * 100) : 0;
  const title = kind === 'district' ? t('detail.district', { n: value.slice(6) }) : quarterName(value, lang);
  const shown = overviewOnly ? sections?.slice(0, 1) : sections;
  const blurb = AREA_BLURBS[kind]?.[value];

  return (
    <div className="map-info__block">
      <h2 className="px-title area-guide__title">{convert(title)}</h2>
      <div className="area-guide__progress">
        {user ? (
          <>
            <div className="area-guide__progress-text">
              {convert(t('areaGuide.collected', { collected, total: cards.length }))}
              <span className="area-guide__pct">{pct}%</span>
            </div>
            <div className="area-guide__bar"><span className="area-guide__fill" style={{ width: `${pct}%`, backgroundColor: 'var(--gold)' }} /></div>
          </>
        ) : (
          <div className="area-guide__progress-text">{convert(t('areaGuide.total', { total: cards.length }))}</div>
        )}
      </div>
      {compact ? (
        blurb && <p className="map-info__blurb">{convert(blurb[lang] || blurb.en)}</p>
      ) : !sections ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><div className="spinner" /></div>
      ) : !sections.length ? (
        <p className="area-guide__soon">{convert(t('areaGuide.comingSoon'))}</p>
      ) : shown.map(s => {
        const marks = s.landmarks
          ? (AREA_LANDMARKS[kind]?.[value] || []).map(slug => locations.find(l => l.slug === slug)).filter(Boolean)
          : null;
        if (marks && !marks.length) return null;
        return (
          <section key={s.h} className="area-guide__section">
            <h3 className="area-guide__heading">{convert(s.h)}</h3>
            {marks ? (
              <ul className="area-guide__landmarks">
                {marks.map(l => {
                  const got = user && l.unlocked;
                  return (
                    <li key={l.slug} className={`area-guide__landmark${got ? ' area-guide__landmark--got' : ''}`}>
                      <button type="button" onClick={() => onPickLandmark?.(l)}>
                        {got && <span aria-label={t('areaGuide.landmarkCollected')}>✓ </span>}
                        {convert(getLocName(l, lang))}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : s.p.map((para, i) => <p key={i}>{convert(para)}</p>)}
          </section>
        );
      })}
    </div>
  );
}

// The right column on a 2K screen. A district alone gets its whole guide; with a
// quarter too, the district shrinks to its overview and the quarter gets the whole
// guide. `compact` (a card is chosen, its details follow below): each area keeps
// only its progress and one line.
export default function MapAreaInfo({ district, quarter, locations, compact = false, area = null, onPickLandmark }) {
  const t = useT();
  if (!district) return compact ? null : <div className="map-info__empty">{t('map.pickDistrictIntro')}</div>;
  // Seen whole (`homeDistrict` instead of `district`), its progress counts every card.
  const wholeQuarter = area?.kind === 'quarter' && area.value === quarter && !area.district;
  return (
    <div className={`area-guide map-info${compact ? ' map-info--compact' : ''}`} key={`${district}|${quarter ?? ''}|${compact}`}>
      <AreaBlock kind="district" value={district} overviewOnly={!!quarter} compact={compact} locations={locations} onPickLandmark={onPickLandmark} />
      {quarter && <AreaBlock kind="quarter" value={quarter} within={wholeQuarter ? null : district} compact={compact} locations={locations} onPickLandmark={onPickLandmark} />}
    </div>
  );
}
