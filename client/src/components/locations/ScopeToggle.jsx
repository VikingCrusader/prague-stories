import { useT } from '../../context/LanguageContext';

// One button that flips Explore/Map between the city proper ("City only",
// the default: cards without the `outside` label) and every card. The label
// names the current mode; clicking switches to the other.
export default function ScopeToggle({ cityOnly, onChange, className = '', style }) {
  const t = useT();
  return (
    <button
      className={`filter-btn scope-toggle${className ? ` ${className}` : ''}`}
      style={style}
      onClick={() => onChange(!cityOnly)}
      aria-pressed={!cityOnly}
    >
      {t(cityOnly ? 'explore.scopeCity' : 'explore.scopeAll')} ⇄
    </button>
  );
}

// Cards beyond Prague's administrative boundary carry the `outside` label.
export const isInCity = l => !l.labels?.includes('outside');
