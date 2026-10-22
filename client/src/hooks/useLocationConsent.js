import { useEffect, useState } from 'react';
import { getLocationConsent, isLocationConsentRequested, subscribeToLocationConsent } from '../utils/locationConsent';

// The current location-consent decision ({ granted, version, at } or null)
// and whether something is waiting for the user to decide.
export function useLocationConsent() {
  const read = () => ({ consent: getLocationConsent(), requested: isLocationConsentRequested() });
  const [state, setState] = useState(read);
  useEffect(() => subscribeToLocationConsent(() => setState(read())), []);
  return state;
}
