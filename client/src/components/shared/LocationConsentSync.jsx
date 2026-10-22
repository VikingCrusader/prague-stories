import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import {
  LOCATION_CONSENT_VERSION, getLocationConsent, setLocationConsent, subscribeToLocationConsent,
} from '../../utils/locationConsent';

const key = c => (c ? `${c.granted}|${c.at}` : '');

// Keeps a signed-in user's location-consent decision on their account: the
// server copy is the record that consent was given (GDPR art. 7(1)), and it
// carries a withdrawal made on one device over to the others.
//  - On sign-in (or session restore) the newer of the device's and the
//    account's decision wins, by decision time; a decision on an older
//    notice version doesn't count.
//  - While signed in, every new decision is saved.
// Renders nothing.
export default function LocationConsentSync() {
  const { user } = useAuth();
  const lastSyncedRef = useRef('');

  useEffect(() => {
    if (!user) { lastSyncedRef.current = ''; return; }

    const push = c => {
      lastSyncedRef.current = key(c);
      userAPI.saveLocationConsent({ granted: c.granted, version: c.version }).catch(() => {
        lastSyncedRef.current = ''; // try again on the next change or sign-in
      });
    };

    const saved = user.locationConsent;
    const server = saved?.granted != null && saved.version === LOCATION_CONSENT_VERSION && saved.decidedAt
      ? { granted: saved.granted, version: saved.version, at: new Date(saved.decidedAt).toISOString() }
      : null;
    const local = getLocationConsent();
    if (local && (!server || Date.parse(local.at) > Date.parse(server.at))) {
      push(local);
    } else if (server) {
      lastSyncedRef.current = key(server);
      if (key(local) !== key(server)) setLocationConsent(server.granted, server.at);
    }

    return subscribeToLocationConsent(() => {
      const c = getLocationConsent();
      if (c && key(c) !== lastSyncedRef.current) push(c);
    });
  }, [user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
