import { useState, useEffect } from 'react';
import { subscribeToPosition } from '../utils/geolocation';

export function useUserPosition() {
  const [pos, setPos] = useState(null);
  useEffect(() => subscribeToPosition(setPos), []);
  return pos;
}
