import { useT } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

// What the dots on the map mean; the colours are the markers' own (MapView).
export default function MapLegend() {
  const t = useT();
  const { theme } = useTheme();
  const items = [
    { key: 'map.legendUnlocked', fill: '#FFD700', border: '#FFD700' },
    theme === 'dark'
      ? { key: 'map.legendLocked', fill: '#fff', border: '#fff' }
      : { key: 'map.legendLocked', fill: '#333', border: '#555' },
    { key: 'map.legendYou', fill: '#e63946', border: '#fff' },
  ];
  return (
    <ul className="map-legend">
      {items.map(item => (
        <li key={item.key}>
          <span className="map-legend__dot" style={{ background: item.fill, borderColor: item.border }} aria-hidden="true" />
          {t(item.key)}
        </li>
      ))}
    </ul>
  );
}
