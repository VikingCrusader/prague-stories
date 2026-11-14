import { useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import ExploreMap from '../locations/ExploreMap';
import DistrictLine from '../locations/DistrictLine';
import AreaGuideModal from '../locations/AreaGuideModal';
import { AREA_BLURBS } from '../../utils/areaBlurbs';
import { quarterName } from '../../utils/pragueQuarters';
import { BOARD, fill } from '../../utils/guideBoard';

// The Guide's Districts and Quarters demo (2026-11-13): Explore's own Prague
// map (districts, then the quarters inside one), and beside it the chosen
// area's one-liner, its card count and the button to its real area guide.
// With nothing chosen, Charles Bridge's two pills, which open guides too.
export default function AreasDemo({ locations }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const b = (BOARD[lang] || BOARD.en).areas;
  const [area, setArea] = useState(null);
  const [guide, setGuide] = useState(null);
  const list = locations || [];
  const kind = area?.kind === 'quarter' ? 'quarter' : area?.kind === 'district' ? 'district' : null;
  const name = kind === 'district' ? t('detail.district', { n: area.value.slice(6) }) : kind === 'quarter' ? quarterName(area.value, lang) : null;
  const blurb = kind ? AREA_BLURBS[kind]?.[area.value]?.[lang] ?? AREA_BLURBS[kind]?.[area.value]?.en : null;
  const count = kind ? list.filter(l => l[kind] === area.value).length : 0;

  return (
    <div className="guide-areas">
      <p className="guide-demo__hint">{convert(b.pick)}</p>
      <div className="guide-areas__stage">
        <div className="guide-areas__map">
          <ExploreMap locations={list} area={area} onArea={a => setArea(a?.kind === 'outside' ? null : a)} />
        </div>
        <div className="guide-areas__side">
          {kind ? (
            <>
              <h4 className="guide-areas__name">{convert(name)}</h4>
              {blurb && <p className="guide-body">{convert(blurb)}</p>}
              <p className="guide-areas__count">{fill(convert(b.cards), { n: count })}</p>
              <button type="button" className="px-btn px-btn--gold" onClick={() => setGuide({ kind, value: area.value })}>{convert(b.read)} →</button>
            </>
          ) : (
            <>
              <p className="guide-body">{convert(b.none)}</p>
              <DistrictLine loc={{ quarter: 'Staré Město', district: 'Praha 1' }} />
            </>
          )}
        </div>
      </div>
      {guide && <AreaGuideModal kind={guide.kind} value={guide.value} locations={list} onClose={() => setGuide(null)} />}
    </div>
  );
}
