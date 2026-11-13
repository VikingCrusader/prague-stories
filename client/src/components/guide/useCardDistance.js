import { useUserPosition } from '../../hooks/useUserPosition';
import { haversineDistance } from '../../utils/geolocation';

// Old Town Square, for players who haven't shared a position.
const FALLBACK = { lat: 50.0875, lng: 14.4213 };

// The demo cards show a distance like Explore's: from the player when the
// app knows where they are, otherwise from Old Town Square.
export function useCardDistance() {
  const pos = useUserPosition() || FALLBACK;
  return card => (card?.coordinates?.lat != null
    ? haversineDistance(pos.lat, pos.lng, card.coordinates.lat, card.coordinates.lng)
    : undefined);
}
