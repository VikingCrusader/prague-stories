import { Link } from 'react-router-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { LABEL_DEFINITIONS } from '../../utils/pixelArtMap';
import { RARITY_LABEL, RARITY_VAR } from '../../utils/rarity';
import { LABEL_BLURB, RARITY_QUIP, GUEST_INTRO } from '../../utils/filterBlurbs';

// An area's name opens its guide (2026-11-08, user's call: no separate link).
function AreaName({ name, onOpen }) {
  if (!onOpen) return <span className="explore-applied__name">{name}</span>;
  return <button type="button" className="explore-applied__name explore-applied__name--link" onClick={onOpen}>{name}</button>;
}

function Item({ name, nameNode, color, onClear, children }) {
  const t = useT();
  return (
    <div className="explore-applied__item">
      <div className="explore-applied__head">
        {nameNode ?? <span className="explore-applied__name" style={color ? { color } : undefined}>{name}</span>}
        <button type="button" className="explore-applied__clear" aria-label={t('grid.clearLabels')} onClick={onClear}>✕</button>
      </div>
      {children && <p className="explore-applied__text">{children}</p>}
    </div>
  );
}

// The filters that are on, each with its line, under the map on Explore at 2K
// (2026-11-08, user's call), after `notes`, the lines that belong to the current
// mode. With no filter on: the district and quarter the player is in, each with
// its line, and how far the nearest card still to collect is (`here`); or, without a
// position in Prague, a `tip`; a guest gets what the app is for and a link to the Guide.
export default function ExploreApplied({ area, areaName, areaBlurb, onClearArea, onOpenGuide, rarity, onClearRarity, labels, onClearLabel, onClearAll, notes = [], here, tip, isGuest = false }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const pick = (entry) => (entry ? convert(entry[lang] || entry.en) : null);
  const anyFilter = area || rarity || labels.length > 0;
  return (
    <>
      {notes.map(note => <p key={note.key} className="explore-applied__note">{note.body}</p>)}
      {!anyFilter && here && (
        <div className="explore-applied__default">
          {here.areas.map(area_ => (
            <div key={area_.name} className="explore-applied__area">
              <AreaName name={convert(area_.name)} onOpen={area_.onOpenGuide} />
              {area_.blurb && <p className="explore-applied__text">{pick(area_.blurb)}</p>}
            </div>
          ))}
          {here.nearest && <p className="explore-applied__stat">{convert(t('explore.nearestLocked', { distance: here.nearest }))}</p>}
        </div>
      )}
      {!anyFilter && !here && (
        <div className={`explore-applied__default${isGuest ? ' explore-applied__default--intro' : ''}`}>
          <div className="explore-applied__head"><span className="explore-applied__name">{t(isGuest ? 'explore.guestIntroTitle' : 'explore.tipTitle')}</span></div>
          {pick(isGuest ? GUEST_INTRO : tip).split('\n').map(line => <p key={line} className="explore-applied__text">{line}</p>)}
          {isGuest && <p className="explore-applied__stat"><Link to="/guide" className="area-guide-link">{convert(t('explore.guideLink'))}</Link></p>}
        </div>
      )}
      {anyFilter && <button type="button" className="filter-btn explore-applied__clear-all" onClick={onClearAll}>{t('explore.clearFilters')}</button>}
      {area && (
        <Item nameNode={<AreaName name={areaName} onOpen={onOpenGuide} />} onClear={onClearArea}>
          {pick(areaBlurb)}
        </Item>
      )}
      {rarity && (
        <Item name={convert(RARITY_LABEL[lang]?.[rarity] ?? RARITY_LABEL.en[rarity])} color={RARITY_VAR[rarity]} onClear={onClearRarity}>
          {pick(RARITY_QUIP[rarity])}
        </Item>
      )}
      {labels.map(key => (
        <Item key={key} name={pick(LABEL_DEFINITIONS[key])} onClear={() => onClearLabel(key)}>
          {pick(LABEL_BLURB[key])}
        </Item>
      ))}
    </>
  );
}
