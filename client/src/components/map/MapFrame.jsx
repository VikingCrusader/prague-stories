// The frame around the 2K map (styles in pixelart.css). The corners are a small
// square with a four-pointed star, echoing the compass; straight lines on purpose,
// since the rarity cards' corners are curling flourishes.
const CORNERS = ['tl', 'tr', 'bl', 'br'];

export default function MapFrame() {
  return (
    <div className="map-frame" aria-hidden="true">
      {CORNERS.map(corner => (
        <svg key={corner} className={`map-frame__corner map-frame__corner--${corner}`} viewBox="0 0 36 36">
          <rect className="map-frame__corner-tile" x="1.5" y="1.5" width="33" height="33" />
          <rect className="map-frame__corner-rule" x="5" y="5" width="26" height="26" />
          <path className="map-frame__corner-star" d="M18 7.5 20.2 15.8 28.5 18 20.2 20.2 18 28.5 15.8 20.2 7.5 18 15.8 15.8Z" />
        </svg>
      ))}
    </div>
  );
}
